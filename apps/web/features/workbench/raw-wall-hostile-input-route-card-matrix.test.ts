// Wall hostile-input route-card matrix — workbench-side counterpart
// to `packages/engine/src/raw-wall-hostile-input-answer-matrix.test.ts`.
// Every case pins the user-visible `buildOutputCard` output for
// hostile wall inputs so that the engine's fail-closed or bounded
// output surfaces consistently through the workbench card layer
// (status, value, supported / unsupported split).
//
// The cases mirror the engine matrix one-to-one. When the engine
// answer surface shifts, either the engine invariant broke or the
// card layer needs updating; either way this test catches the
// divergence explicitly.

import type { AirborneContext, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { evaluateScenario } from "./scenario-analysis";
import { buildOutputCard } from "./simple-workbench-output-model";
import type { LayerDraft } from "./workbench-store";

const WALL_OUTPUTS = ["Rw", "R'w", "DnT,w", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];

const WALL_LAB_CONTEXT: AirborneContext = {
  airtightness: "good",
  contextMode: "element_lab"
};

const WALL_FIELD_CONTEXT: AirborneContext = {
  airtightness: "good",
  contextMode: "field_between_rooms",
  panelHeightMm: 3000,
  panelWidthMm: 4200
};

type CardStatus = "bound" | "live" | "needs_input" | "unsupported";

function runScenario(
  scenarioId: string,
  rows: readonly Omit<LayerDraft, "id">[],
  airborneContext: AirborneContext
) {
  const mapped = rows.map((row, index) => ({
    ...row,
    id: `${scenarioId}-${index + 1}`
  }));

  const scenario = evaluateScenario({
    airborneContext,
    id: scenarioId,
    name: scenarioId,
    rows: mapped,
    source: "current",
    studyMode: "wall",
    targetOutputs: WALL_OUTPUTS
  });

  const cards = new Map<(typeof WALL_OUTPUTS)[number], { status: CardStatus; value: string }>();
  for (const output of WALL_OUTPUTS) {
    const card = buildOutputCard({
      output,
      result: scenario.result,
      studyMode: "wall"
    });
    cards.set(output, {
      status: card?.status ?? "unsupported",
      value: card?.formattedValue ?? ""
    });
  }

  // Scenario-level warnings combine `normalize-rows` warnings (from
  // the web pre-engine layer) with the engine result warnings. Hostile
  // rows that the normaliser rejects never reach the engine, so their
  // warning text lives on `scenario.warnings`, not
  // `scenario.result?.warnings`. Merge both so tests can match either
  // message surface.
  const mergedWarnings: string[] = [
    ...(scenario.warnings ?? []),
    ...((scenario.result?.warnings as readonly string[] | undefined) ?? [])
  ];

  return {
    warningCount: mergedWarnings.length,
    warnings: mergedWarnings,
    supported: scenario.result?.supportedTargetOutputs ?? [],
    unsupported: scenario.result?.unsupportedTargetOutputs ?? [],
    rwDb: scenario.result?.metrics.estimatedRwDb ?? null,
    cards
  };
}

describe("raw wall hostile-input route-card matrix", () => {
  it("50 identical heavy concrete layers produce a bounded, live card set in lab mode", () => {
    const rows: Omit<LayerDraft, "id">[] = Array.from({ length: 50 }, () => ({
      materialId: "concrete",
      thicknessMm: "100"
    }));
    const snap = runScenario("50-heavy-concrete-lab", rows, WALL_LAB_CONTEXT);

    expect(snap.rwDb).not.toBeNull();
    expect(Number.isFinite(snap.rwDb ?? NaN)).toBe(true);
    expect(snap.cards.get("Rw")?.status).toBe("live");
    expect(snap.cards.get("STC")?.status).toBe("live");
  });

  it("50 mixed layers produce deterministic card output under reorder", () => {
    const baseRows: Omit<LayerDraft, "id">[] = Array.from({ length: 50 }, (_, index) => {
      const rotation = index % 3;
      if (rotation === 0) return { materialId: "gypsum_board", thicknessMm: "12.5" };
      if (rotation === 1) return { materialId: "rockwool", thicknessMm: "45" };
      return { materialId: "air_gap", thicknessMm: "20" };
    });

    const forward = runScenario("50-mixed-forward", baseRows, WALL_LAB_CONTEXT);
    const reversed = runScenario("50-mixed-reversed", [...baseRows].reverse(), WALL_LAB_CONTEXT);

    expect(reversed.supported).toEqual(forward.supported);
    expect(reversed.unsupported).toEqual(forward.unsupported);
  });

  it("fail-closes with unsupported card set on an unknown materialId", () => {
    const rows: Omit<LayerDraft, "id">[] = [
      { materialId: "unobtainium" as unknown as string, thicknessMm: "100" }
    ];
    const snap = runScenario("unknown-material", rows, WALL_LAB_CONTEXT);

    expect(
      snap.warnings.some((warning) => /unknown material/i.test(warning))
    ).toBe(true);
    // Every requested output card collapses to a non-live state when
    // the engine falls back to the hostile-input fail-closed result.
    // The card builder distinguishes `unsupported` (output physically
    // unavailable on this route) from `needs_input` (output available
    // once more data lands); both are acceptable fail-closed states
    // here since the engine returns an empty rating set either way.
    for (const output of WALL_OUTPUTS) {
      const status = snap.cards.get(output)?.status;
      expect(
        status,
        `expected ${output} to be in a fail-closed state, got ${status}`
      ).not.toBe("live");
    }
  });

  it("fail-closes with a non-live card set on zero thickness", () => {
    // The workbench `normalize-rows` layer catches zero thickness
    // BEFORE it reaches the engine, filtering the row out and emitting
    // a `missing a valid thickness` warning. That keeps the web path
    // user-friendly even though the engine guardrail is the last line
    // of defense for API / CLI callers that bypass normalization.
    const rows: Omit<LayerDraft, "id">[] = [{ materialId: "concrete", thicknessMm: "0" }];
    const snap = runScenario("zero-thickness", rows, WALL_LAB_CONTEXT);

    expect(
      snap.warnings.some((warning) =>
        /missing a valid thickness|invalid thickness|thickness/i.test(warning)
      )
    ).toBe(true);
    for (const output of WALL_OUTPUTS) {
      const status = snap.cards.get(output)?.status;
      expect(
        status,
        `expected ${output} to be in a fail-closed state, got ${status}`
      ).not.toBe("live");
    }
  });

  it("keeps the field-mode card surface consistent under 50 heavy layers", () => {
    const rows: Omit<LayerDraft, "id">[] = Array.from({ length: 50 }, () => ({
      materialId: "concrete",
      thicknessMm: "100"
    }));
    const snap = runScenario("50-heavy-concrete-field", rows, WALL_FIELD_CONTEXT);

    // Field mode: Rw unsupported (screening heavy stack), R'w live
    // because the apparent lane is active.
    expect(snap.cards.get("R'w")?.status).toBe("live");
    expect(snap.cards.get("STC")?.status).toBe("live");
  });

  it("handles an empty rows array without crashing the card layer", () => {
    const snap = runScenario("empty-rows", [], WALL_LAB_CONTEXT);

    // Empty stack is a degenerate but valid input: no crash, every
    // card renders in one of the known statuses. The engine may
    // short-circuit to a null result (no layers to compute) and
    // evaluateScenario mirrors that — both are acceptable as long
    // as we do not observe undefined statuses.
    for (const output of WALL_OUTPUTS) {
      const status = snap.cards.get(output)?.status ?? "unsupported";
      expect(["live", "needs_input", "unsupported"]).toContain(status);
    }
  });
});
