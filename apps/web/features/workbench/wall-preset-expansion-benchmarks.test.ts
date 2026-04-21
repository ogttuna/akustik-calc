// Benchmarks the three wall presets added in wall_preset_expansion_v1:
// aac_single_leaf_wall, masonry_brick_wall, clt_wall.
//
// Each case pins:
//  - the canonical Rw produced under the default workbench lab context
//  - the supported / unsupported output set under lab, field, and building
//    airborne contexts (cross-referenced against
//    wall-full-preset-contract-matrix.test.ts)
//  - the provenance posture implied by the output set (non-screening family
//    lane so C is live, matching the engine's existing airborne family
//    detection paths)
//
// Values here are the ones the engine produces today. They are pinned so
// future engine changes (new family lanes, context-aware studType, etc.)
// that would change these numbers land with an explicit test update rather
// than silently moving the user-visible Rw on a preset.
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

const FIELD_CONTEXT: AirborneContext = {
  contextMode: "field_between_rooms",
  panelHeightMm: 3000,
  panelWidthMm: 4200
};

const BUILDING_CONTEXT: AirborneContext = {
  contextMode: "building_prediction",
  panelHeightMm: 3000,
  panelWidthMm: 4200,
  receivingRoomRt60S: 0.7,
  receivingRoomVolumeM3: 55
};

function evaluateWall(presetId: PresetId, airborneContext: AirborneContext | null) {
  const preset = getPresetById(presetId);
  const rows = preset.rows.map((row, index) => ({
    ...row,
    id: `${preset.id}-${index + 1}`
  }));

  const scenario = evaluateScenario({
    airborneContext,
    id: `${preset.id}-${airborneContext?.contextMode ?? "lab"}`,
    impactFieldContext: null,
    name: preset.label,
    rows,
    source: "current",
    studyMode: "wall",
    targetOutputs: WALL_OUTPUTS
  });

  return {
    rw: scenario.result?.ratings?.iso717?.Rw ?? null,
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
  nonScreeningFamily: true;
  note: string;
};

const BENCHMARKS: readonly ExpectedBenchmark[] = [
  {
    presetId: "aac_single_leaf_wall",
    labRw: 45,
    nonScreeningFamily: true,
    note:
      "Ytong D700 150 mm + 10 mm cement plaster both sides. Source-truth for the Xella reference is Rw=47 under their lab protocol; the workbench default lab context (no explicit airtightness) produces Rw=45 which stays within the masonry family tolerance."
  },
  {
    presetId: "masonry_brick_wall",
    labRw: 47,
    nonScreeningFamily: true,
    note:
      "Wienerberger Porotherm 100 mm + 13 mm dense plaster both sides. The clay-masonry family lane treats this as a dense single-leaf element; the result reflects a lightly plastered masonry profile rather than a vacuumed acoustic lab protocol."
  },
  {
    presetId: "clt_wall",
    labRw: 40,
    nonScreeningFamily: true,
    note:
      "140 mm cross-laminated timber with 12.5 mm gypsum board lining on both sides. The mass-timber family lane produces a symmetric double-lined lightweight-mass output; there is no source-backed exact CLT wall row in the catalog today, so this value is formula-owned."
  }
];

describe("wall preset expansion benchmarks", () => {
  it.each(BENCHMARKS)(
    "$presetId pins canonical Rw and output set under lab context",
    (benchmark) => {
      const { rw, cards } = evaluateWall(benchmark.presetId, null);

      expect(rw, `${benchmark.presetId}: lab Rw`).toBe(benchmark.labRw);

      // Non-screening family: Rw + STC + C + Ctr are live in lab; the field/
      // building outputs are parked (need_input) because no context is given.
      for (const output of ["Rw", "STC", "C", "Ctr"] as const) {
        expect(cards.get(output)?.status, `${benchmark.presetId}: lab ${output}`).toBe("live");
      }
      for (const output of ["R'w", "Dn,w", "Dn,A", "DnT,w", "DnT,A"] as const) {
        expect(cards.get(output)?.status, `${benchmark.presetId}: lab ${output} parked`).toBe(
          "needs_input"
        );
      }
    }
  );

  it.each(BENCHMARKS)(
    "$presetId keeps the field route non-screening (Rw unsupported, field outputs live)",
    (benchmark) => {
      const { cards } = evaluateWall(benchmark.presetId, FIELD_CONTEXT);

      // Field route: non-screening family means Rw goes unsupported (the route
      // is now a field measurement path) but R'w, Dn,w, Dn,A, STC, C, Ctr are
      // live.
      expect(cards.get("Rw")?.status, `${benchmark.presetId}: field Rw unsupported`).toBe(
        "unsupported"
      );
      for (const output of ["R'w", "Dn,w", "Dn,A", "STC", "C", "Ctr"] as const) {
        expect(cards.get(output)?.status, `${benchmark.presetId}: field ${output} live`).toBe("live");
      }
      for (const output of ["DnT,w", "DnT,A"] as const) {
        expect(cards.get(output)?.status, `${benchmark.presetId}: field ${output} parked`).toBe(
          "needs_input"
        );
      }
    }
  );

  it.each(BENCHMARKS)(
    "$presetId lights DnT,w and DnT,A on the building route once room volume is provided",
    (benchmark) => {
      const { cards } = evaluateWall(benchmark.presetId, BUILDING_CONTEXT);

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

  it("keeps the three new wall presets distinct from concrete_wall screening posture", () => {
    const concreteLab = evaluateWall("concrete_wall", null);
    const aacLab = evaluateWall("aac_single_leaf_wall", null);

    // concrete_wall is screening-only: C is not supported in lab mode.
    expect(concreteLab.cards.get("C")?.status).toBe("unsupported");

    // New presets are non-screening family: C is live.
    expect(aacLab.cards.get("C")?.status).toBe("live");
  });
});
