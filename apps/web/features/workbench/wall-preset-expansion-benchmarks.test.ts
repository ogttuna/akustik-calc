// Benchmarks the three wall presets added in wall_preset_expansion_v1:
// aac_single_leaf_wall, masonry_brick_wall, clt_wall.
//
// Each case pins:
//  - the canonical Rw the engine produces under the REAL workbench default
//    lab context (airtightness = "good", contextMode = "element_lab"),
//    matching the composition wired up in
//    `apps/web/features/workbench/workbench-shell.tsx` (the `liveAirborneContext`
//    block). A prior version of this test passed `airborneContext: null`,
//    which routes through the no-context engine path and does NOT reflect
//    what the user sees in the workbench UI. The current defaults produce
//    benchmark-matching results (Masonry = Wienerberger Porotherm 100 +
//    13 mm dense plaster, Rw = 43; AAC = Xella Ytong D700 150 + 10 mm plaster,
//    Rw = 47). CLT has no exact wall catalog row, so its Rw is formula-owned.
//  - the supported / unsupported output set under lab, field, and building
//    airborne contexts (cross-referenced against
//    wall-full-preset-contract-matrix.test.ts)
//  - the provenance posture implied by the output set (non-screening family
//    lane so C is live, matching the engine's existing airborne family
//    detection paths)
//
// Values here are the ones the engine produces today for the user-facing
// preset path. They are pinned so future engine changes (new family lanes,
// context-aware studType, etc.) that would change these numbers land with
// an explicit test update rather than silently moving the user-visible Rw
// on a preset.
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

// Real workbench default wall context.  Mirrors the `liveAirborneContext`
// composition in `workbench-shell.tsx` when the user has not changed any
// airborne-context-panel field: airtightness defaults to "good" and
// contextMode defaults to "element_lab".  All the other optional fields
// are left undefined (empty-string inputs parse to undefined), which is
// what an out-of-the-box workbench session looks like.
const WORKBENCH_DEFAULT_LAB_CONTEXT: AirborneContext = {
  airtightness: "good",
  contextMode: "element_lab"
};

const WORKBENCH_DEFAULT_FIELD_CONTEXT: AirborneContext = {
  airtightness: "good",
  contextMode: "field_between_rooms",
  panelHeightMm: 3000,
  panelWidthMm: 4200
};

const WORKBENCH_DEFAULT_BUILDING_CONTEXT: AirborneContext = {
  airtightness: "good",
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
    id: `${preset.id}-${airborneContext?.contextMode ?? "no_context"}`,
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
  // Field / building VALUE pins. R'w in field mode must respect the
  // ISO 140-4 flanking non-negativity invariant (R'w ≤ Rw, enforced by
  // wall-physical-invariants-matrix.test.ts). These exact values are
  // drift guards: any change in the lab-fallback anchor, flanking
  // overlay, or mass-law baseline will land with an explicit test
  // update rather than silently moving user-visible outputs.
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
    presetId: "aac_single_leaf_wall",
    labRw: 47,
    fieldRwPrime: 45,
    buildingRwPrime: 45,
    buildingDnTw: 46,
    benchmarkSource: "xella_ytong_d700_150_plaster10_official_2026 (airborne-verified-catalog.ts)",
    benchmarkRw: 47,
    toleranceDb: 2.5,
    note:
      "Ytong D700 150 mm + 10 mm cement plaster both sides. Under the real workbench default lab context (airtightness=good, contextMode=element_lab) the engine produces Rw=47, matching the Xella reference exactly. Field / building R'w pinned as drift guard for the 2026-04-21 lab-fallback anchor (R'w ≤ Rw invariant)."
  },
  {
    presetId: "masonry_brick_wall",
    labRw: 43,
    fieldRwPrime: 41,
    buildingRwPrime: 41,
    buildingDnTw: 43,
    benchmarkSource: "wienerberger_porotherm_100_dense_plaster_primary_2026 (airborne-masonry-benchmark.test.ts)",
    benchmarkRw: 43,
    toleranceDb: 1,
    note:
      "Wienerberger Porotherm 100 mm + 13 mm dense plaster both sides. Under the real workbench default lab context the engine produces Rw=43, matching the Wienerberger/Lucideon reference exactly. Field / building R'w = 41 dB is the direct consequence of the 2026-04-21 lab-fallback anchor (lab benchmark 43 − overlay flanking 1.8 dB ≈ 41). Before the fix this preset violated R'w ≤ Rw by producing R'w=45 from mass-law overestimate; this pin is the regression guard."
  },
  {
    presetId: "clt_wall",
    labRw: 40,
    fieldRwPrime: 38,
    buildingRwPrime: 38,
    buildingDnTw: 39,
    benchmarkSource: "no_exact_clt_wall_row_in_catalog",
    benchmarkRw: 40,
    toleranceDb: 0,
    note:
      "140 mm cross-laminated timber with 12.5 mm gypsum board lining on both sides. No exact CLT wall catalog row exists today, so this value is formula-owned and the test pins the engine's current output under the default lab context. Field / building R'w pinned for future drift detection."
  }
];

describe("wall preset expansion benchmarks", () => {
  it.each(BENCHMARKS)(
    "$presetId pins canonical Rw and output set under the real workbench default lab context",
    (benchmark) => {
      const { rw, cards } = evaluateWall(benchmark.presetId, WORKBENCH_DEFAULT_LAB_CONTEXT);

      expect(rw, `${benchmark.presetId}: lab Rw`).toBe(benchmark.labRw);
      expect(
        Math.abs((rw ?? 0) - benchmark.benchmarkRw),
        `${benchmark.presetId}: benchmark fit within tolerance ${benchmark.toleranceDb} dB`
      ).toBeLessThanOrEqual(benchmark.toleranceDb);

      // Non-screening family: Rw + STC + C + Ctr are live in lab; the field/
      // building outputs are parked (need_input) because no field geometry
      // is provided in lab context.
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
    "$presetId pins canonical field R'w and keeps the field route non-screening",
    (benchmark) => {
      const { rwPrime, cards } = evaluateWall(benchmark.presetId, WORKBENCH_DEFAULT_FIELD_CONTEXT);

      expect(rwPrime, `${benchmark.presetId}: field R'w defined`).not.toBeNull();
      expect(rwPrime, `${benchmark.presetId}: field R'w value pin`).toBe(benchmark.fieldRwPrime);
      expect(
        rwPrime ?? Number.POSITIVE_INFINITY,
        `${benchmark.presetId}: field R'w (${rwPrime}) ≤ lab Rw (${benchmark.labRw}) + 0.5 dB`
      ).toBeLessThanOrEqual(benchmark.labRw + 0.5);

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
    "$presetId pins canonical building R'w and DnT,w and lights DnT on the building route",
    (benchmark) => {
      const { rwPrime, dnTw, cards } = evaluateWall(benchmark.presetId, WORKBENCH_DEFAULT_BUILDING_CONTEXT);

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

  it("keeps all four wall presets on a consistent lab output surface after the reorder-invariance fix", () => {
    // Before 2026-04-21 the `concrete_wall` preset suppressed C in every
    // context because the inferred floor-carrier path hid the curve-rating
    // C estimate for any non-`rw_plus_c` semantic. The reorder-invariance
    // fix in `packages/engine/src/target-output-support.ts` now falls
    // through to `metrics.estimatedCDb` for screening-basis carriers, so
    // every wall preset — screening or benchmark-backed — exposes the
    // same lab output surface (Rw, STC, C, Ctr live) under the real
    // workbench default context.
    const concreteLab = evaluateWall("concrete_wall", WORKBENCH_DEFAULT_LAB_CONTEXT);
    const aacLab = evaluateWall("aac_single_leaf_wall", WORKBENCH_DEFAULT_LAB_CONTEXT);
    const masonryLab = evaluateWall("masonry_brick_wall", WORKBENCH_DEFAULT_LAB_CONTEXT);
    const cltLab = evaluateWall("clt_wall", WORKBENCH_DEFAULT_LAB_CONTEXT);

    for (const lab of [concreteLab, aacLab, masonryLab, cltLab]) {
      expect(lab.cards.get("Rw")?.status).toBe("live");
      expect(lab.cards.get("STC")?.status).toBe("live");
      expect(lab.cards.get("C")?.status).toBe("live");
      expect(lab.cards.get("Ctr")?.status).toBe("live");
    }
  });
});
