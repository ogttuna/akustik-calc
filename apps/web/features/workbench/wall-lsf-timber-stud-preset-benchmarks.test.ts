// Benchmarks the two wall presets added in the LSF + timber stud
// preset pack slice: `light_steel_stud_wall`, `timber_stud_wall`.
//
// Each case pins:
//  - the canonical Rw the engine produces when the preset's
//    `airborneDefaults` are folded into the no-calculator preset-matrix
//    lab context. This file is intentionally the screening-side drift
//    guard, not the live user-visible workbench path. Gate B pins the
//    live dynamic route in
//    `wall-live-dynamic-preset-route-card-matrix.test.ts`.
//    `light_steel_stud_wall` locks onto the Knauf
//    primary framed-wall corpus (exact catalog row
//    `knauf_lsf_2x2_12_5_70_glasswool_lab_416702_2026`, Rw=55).
//    `timber_stud_wall` still has no exact wall catalog row for this
//    preset topology, so its Rw remains formula-owned and the test
//    pins the engine's current output as a drift guard. Gate C later
//    imported two narrower direct-timber exact rows, but they do not
//    topologically match the preset's double-board + rockwool + air-gap
//    stack. The live workbench default currently uses
//    `calculator: "dynamic"` and Gate B now proves that the live
//    workbench preset path uses that dynamic surface; this file remains
//    the screening drift guard so both surfaces stay named.
//  - the supported / unsupported output set under lab, field, and
//    building airborne contexts (cross-referenced against
//    wall-full-preset-contract-matrix.test.ts and
//    wall-preset-expansion-benchmarks.test.ts).
//  - the ISO 140-4 invariant that field R'w and building R'w remain
//    bounded by the lab Rw ceiling after the 2026-04-21 lab-fallback
//    anchor landed.
//
// Values here are pinned so future engine changes (new family lanes,
// additional framed-wall corpus rows, different dynamic heuristics)
// that would move these numbers land with an explicit test update
// rather than silently changing the user-visible Rw on a preset.
import type { AirborneContext, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { getPresetById, type PresetId } from "./preset-definitions";
import { evaluateScenario } from "./scenario-analysis";
import { buildOutputCard } from "./simple-workbench-output-model";

const WALL_OUTPUTS: readonly RequestedOutputId[] = [
  "Rw",
  "R'w",
  "Dn,w",
  "Dn,A",
  "DnT,w",
  "DnT,A",
  "STC",
  "C",
  "Ctr"
];

// Mirror the workbench-shell `liveAirborneContext` composition with
// a preset's `airborneDefaults` folded in, but deliberately leave the
// calculator unset so this file pins the no-calculator preset-matrix
// surface.
function composeLabContextForPreset(presetId: PresetId): AirborneContext {
  const preset = getPresetById(presetId);
  const defaults = preset.airborneDefaults ?? {};
  return {
    airtightness: defaults.airtightness ?? "good",
    contextMode: "element_lab",
    ...(defaults.connectionType ? { connectionType: defaults.connectionType } : {}),
    ...(defaults.studType ? { studType: defaults.studType } : {}),
    ...(defaults.studSpacingMm
      ? { studSpacingMm: Number.parseFloat(defaults.studSpacingMm) }
      : {})
  };
}

function composeFieldContextForPreset(presetId: PresetId): AirborneContext {
  const preset = getPresetById(presetId);
  const defaults = preset.airborneDefaults ?? {};
  return {
    airtightness: defaults.airtightness ?? "good",
    contextMode: "field_between_rooms",
    panelHeightMm: 3000,
    panelWidthMm: 4200,
    ...(defaults.connectionType ? { connectionType: defaults.connectionType } : {}),
    ...(defaults.studType ? { studType: defaults.studType } : {}),
    ...(defaults.studSpacingMm
      ? { studSpacingMm: Number.parseFloat(defaults.studSpacingMm) }
      : {})
  };
}

function composeBuildingContextForPreset(presetId: PresetId): AirborneContext {
  const preset = getPresetById(presetId);
  const defaults = preset.airborneDefaults ?? {};
  return {
    airtightness: defaults.airtightness ?? "good",
    contextMode: "building_prediction",
    panelHeightMm: 3000,
    panelWidthMm: 4200,
    receivingRoomRt60S: 0.7,
    receivingRoomVolumeM3: 55,
    ...(defaults.connectionType ? { connectionType: defaults.connectionType } : {}),
    ...(defaults.studType ? { studType: defaults.studType } : {}),
    ...(defaults.studSpacingMm
      ? { studSpacingMm: Number.parseFloat(defaults.studSpacingMm) }
      : {})
  };
}

function evaluateWall(presetId: PresetId, airborneContext: AirborneContext) {
  const preset = getPresetById(presetId);
  const rows = preset.rows.map((row, index) => ({
    ...row,
    id: `${preset.id}-${index + 1}`
  }));

  const scenario = evaluateScenario({
    airborneContext,
    id: `${preset.id}-${airborneContext.contextMode}`,
    impactFieldContext: null,
    name: preset.label,
    rows,
    source: "current",
    studyMode: "wall",
    targetOutputs: WALL_OUTPUTS
  });

  const rwPrime =
    scenario.result?.ratings?.field?.RwPrime ??
    (scenario.result?.ratings?.iso717 as { RwPrime?: number } | undefined)?.RwPrime ??
    null;

  return {
    rw: scenario.result?.ratings?.iso717?.Rw ?? null,
    rwPrime,
    dnTw: scenario.result?.ratings?.field?.DnTw ?? null,
    cards: new Map(
      WALL_OUTPUTS.map((output) => [
        output,
        buildOutputCard({
          output,
          result: scenario.result,
          studyMode: "wall"
        })
      ])
    )
  };
}

type ExpectedBenchmark = {
  presetId: PresetId;
  labRw: number;
  fieldRwPrime: number;
  buildingRwPrime: number;
  buildingDnTw: number;
  benchmarkSource: string;
  benchmarkRw: number;
  toleranceDb: number;
  note: string;
};

const BENCHMARKS: readonly ExpectedBenchmark[] = [
  {
    presetId: "light_steel_stud_wall",
    labRw: 55,
    // Field / building R'w stay under the lab Rw ceiling per the
    // ISO 140-4 flanking non-negativity invariant (proven by
    // wall-physical-invariants-matrix.test.ts). Concrete values are
    // engine-produced and pinned as drift guards.
    fieldRwPrime: 48,
    buildingRwPrime: 48,
    buildingDnTw: 49,
    benchmarkSource:
      "knauf_lsf_2x2_12_5_70_glasswool_lab_416702_2026 (airborne-verified-catalog.ts exact catalog row)",
    benchmarkRw: 55,
    toleranceDb: 0,
    note:
      "Two 12.5 mm acoustic gypsum boards + 5 mm air gap + 70 mm glasswool + two 12.5 mm acoustic gypsum boards on a 600 mm light-steel stud frame with line-connected airtightness=good. Exact Knauf lab row drives Rw=55; preset's `airborneDefaults.studType=light_steel_stud` pushes the engine onto that lane."
  },
  {
    presetId: "timber_stud_wall",
    labRw: 31,
    fieldRwPrime: 24,
    buildingRwPrime: 24,
    buildingDnTw: 25,
    benchmarkSource: "no_exact_timber_stud_wall_row_in_catalog",
    benchmarkRw: 31,
    toleranceDb: 0,
    note:
      "Two 12.5 mm gypsum boards + 50 mm rockwool + 50 mm air gap + two 12.5 mm gypsum boards on a 600 mm wood-stud frame with line-connected airtightness=good. Narrower direct-timber exact rows now exist, but none matches this preset topology exactly, so this no-calculator / screening-seed pin still acts as a drift guard for future engine changes. The same stack under calculator: dynamic currently produces a higher low-confidence framed-wall candidate, so wall_formula_family_widening_v1 had to audit both surfaces before changing visible timber-stud behavior."
  }
];

describe("wall LSF + timber stud preset benchmarks", () => {
  it.each(BENCHMARKS)(
    "$presetId pins canonical Rw under the preset's composed lab context",
    (benchmark) => {
      const labContext = composeLabContextForPreset(benchmark.presetId);
      const { rw, cards } = evaluateWall(benchmark.presetId, labContext);

      expect(rw, `${benchmark.presetId}: lab Rw`).toBe(benchmark.labRw);
      expect(
        Math.abs((rw ?? 0) - benchmark.benchmarkRw),
        `${benchmark.presetId}: benchmark fit within ${benchmark.toleranceDb} dB`
      ).toBeLessThanOrEqual(benchmark.toleranceDb);

      for (const output of ["Rw", "STC", "C", "Ctr"] as const) {
        expect(cards.get(output)?.status, `${benchmark.presetId}: lab ${output} live`).toBe("live");
      }
      for (const output of ["R'w", "Dn,w", "Dn,A", "DnT,w", "DnT,A"] as const) {
        expect(
          cards.get(output)?.status,
          `${benchmark.presetId}: lab ${output} parked`
        ).toBe("needs_input");
      }
    }
  );

  it.each(BENCHMARKS)(
    "$presetId pins canonical field R'w under the preset's composed field context",
    (benchmark) => {
      const fieldContext = composeFieldContextForPreset(benchmark.presetId);
      const { rwPrime, cards } = evaluateWall(benchmark.presetId, fieldContext);

      expect(rwPrime, `${benchmark.presetId}: field R'w defined`).not.toBeNull();
      expect(rwPrime, `${benchmark.presetId}: field R'w value pin`).toBe(benchmark.fieldRwPrime);
      expect(
        rwPrime ?? Number.POSITIVE_INFINITY,
        `${benchmark.presetId}: field R'w (${rwPrime}) ≤ lab Rw (${benchmark.labRw}) + 0.5 dB`
      ).toBeLessThanOrEqual(benchmark.labRw + 0.5);

      // Non-screening framed-wall family: Rw unsupported in field; R'w +
      // Dn*, STC, C, Ctr live; DnT* parked on no-room-volume contexts.
      expect(cards.get("Rw")?.status, `${benchmark.presetId}: field Rw unsupported`).toBe(
        "unsupported"
      );
      for (const output of ["R'w", "Dn,w", "Dn,A", "STC", "C", "Ctr"] as const) {
        expect(cards.get(output)?.status, `${benchmark.presetId}: field ${output} live`).toBe("live");
      }
      for (const output of ["DnT,w", "DnT,A"] as const) {
        expect(
          cards.get(output)?.status,
          `${benchmark.presetId}: field ${output} parked`
        ).toBe("needs_input");
      }
    }
  );

  it.each(BENCHMARKS)(
    "$presetId pins canonical building R'w and DnT,w under the preset's composed building context",
    (benchmark) => {
      const buildingContext = composeBuildingContextForPreset(benchmark.presetId);
      const { rwPrime, dnTw, cards } = evaluateWall(benchmark.presetId, buildingContext);

      expect(rwPrime, `${benchmark.presetId}: building R'w defined`).not.toBeNull();
      expect(rwPrime, `${benchmark.presetId}: building R'w value pin`).toBe(benchmark.buildingRwPrime);
      expect(
        rwPrime ?? Number.POSITIVE_INFINITY,
        `${benchmark.presetId}: building R'w (${rwPrime}) ≤ lab Rw (${benchmark.labRw}) + 0.5 dB`
      ).toBeLessThanOrEqual(benchmark.labRw + 0.5);
      expect(dnTw, `${benchmark.presetId}: building DnT,w defined`).not.toBeNull();
      expect(dnTw, `${benchmark.presetId}: building DnT,w value pin`).toBe(benchmark.buildingDnTw);

      expect(cards.get("Rw")?.status, `${benchmark.presetId}: building Rw unsupported`).toBe(
        "unsupported"
      );
      for (const output of ["R'w", "Dn,w", "Dn,A", "DnT,w", "DnT,A", "STC", "C", "Ctr"] as const) {
        expect(cards.get(output)?.status, `${benchmark.presetId}: building ${output} live`).toBe(
          "live"
        );
      }
    }
  );
});
