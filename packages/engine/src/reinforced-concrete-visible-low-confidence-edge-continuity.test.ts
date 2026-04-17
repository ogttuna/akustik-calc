import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";

const TARGET_OUTPUTS = ["Rw", "Ctr", "Ln,w"] as const;

const BASELINE_VISIBLE_STACK = [
  { floorRole: "base_structure", materialId: "concrete", thicknessMm: 180 },
  { floorRole: "resilient_layer", materialId: "generic_resilient_underlay", thicknessMm: 8 },
  { floorRole: "floor_covering", materialId: "vinyl_flooring", thicknessMm: 3 },
  { floorRole: "ceiling_cavity", materialId: "resilient_channel", thicknessMm: 120 },
  { floorRole: "ceiling_fill", materialId: "glasswool", thicknessMm: 100 },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 }
] as const;

function evaluate(layers: readonly Record<string, unknown>[]) {
  return calculateAssembly(layers as never, {
    targetOutputs: TARGET_OUTPUTS as never
  });
}

describe("reinforced concrete visible low-confidence edge continuity", () => {
  it("keeps neutral visible-stack reorder and alias variants on the same derived low-confidence lane", () => {
    const baseline = evaluate(BASELINE_VISIBLE_STACK);
    const variants = [
      evaluate([
        BASELINE_VISIBLE_STACK[0],
        BASELINE_VISIBLE_STACK[1],
        BASELINE_VISIBLE_STACK[2],
        BASELINE_VISIBLE_STACK[4],
        BASELINE_VISIBLE_STACK[3],
        BASELINE_VISIBLE_STACK[5],
        BASELINE_VISIBLE_STACK[6]
      ]),
      evaluate([
        BASELINE_VISIBLE_STACK[0],
        BASELINE_VISIBLE_STACK[1],
        BASELINE_VISIBLE_STACK[2],
        BASELINE_VISIBLE_STACK[3],
        BASELINE_VISIBLE_STACK[4],
        { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 16 },
        { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 16 }
      ]),
      evaluate([
        BASELINE_VISIBLE_STACK[0],
        BASELINE_VISIBLE_STACK[1],
        BASELINE_VISIBLE_STACK[2],
        BASELINE_VISIBLE_STACK[3],
        { floorRole: "ceiling_fill", materialId: "glasswool", thicknessMm: 50 },
        { floorRole: "ceiling_fill", materialId: "glasswool", thicknessMm: 50 },
        BASELINE_VISIBLE_STACK[5],
        BASELINE_VISIBLE_STACK[6]
      ]),
      evaluate([
        BASELINE_VISIBLE_STACK[0],
        { floorRole: "resilient_layer", materialId: "generic_resilient_underlay", thicknessMm: 4 },
        { floorRole: "resilient_layer", materialId: "generic_resilient_underlay", thicknessMm: 4 },
        BASELINE_VISIBLE_STACK[2],
        BASELINE_VISIBLE_STACK[3],
        BASELINE_VISIBLE_STACK[4],
        BASELINE_VISIBLE_STACK[5],
        BASELINE_VISIBLE_STACK[6]
      ])
    ];

    expect(baseline.floorSystemEstimate?.kind).toBe("low_confidence");
    expect(baseline.floorSystemEstimate?.fitPercent).toBe(29);
    expect(baseline.dynamicImpactTrace?.fitPercent).toBe(29);
    expect(baseline.impact?.basis).toBe("predictor_floor_system_low_confidence_estimate");
    expect(baseline.impactPredictorStatus?.inputMode).toBe("derived_from_visible_layers");

    for (const result of variants) {
      expect(result.floorSystemEstimate?.kind).toBe("low_confidence");
      expect(result.floorSystemEstimate?.fitPercent).toBe(29);
      expect(result.dynamicImpactTrace?.fitPercent).toBe(29);
      expect(result.impact?.basis).toBe("predictor_floor_system_low_confidence_estimate");
      expect(result.impactPredictorStatus?.inputMode).toBe("derived_from_visible_layers");
      expect(result.impact?.LnW).toBe(baseline.impact?.LnW);
      expect(result.floorSystemRatings?.Rw).toBe(baseline.floorSystemRatings?.Rw);
      expect(result.floorSystemRatings?.RwCtr).toBe(baseline.floorSystemRatings?.RwCtr);
      expect(result.impact?.estimateCandidateIds).toEqual(baseline.impact?.estimateCandidateIds);
      expect(result.impactPredictorStatus?.notes).toEqual(baseline.impactPredictorStatus?.notes);
    }
  });

  it("treats an expanded ceiling-board schedule as an intentional boundary instead of fabricating the derived low-confidence lane", () => {
    const baseline = evaluate(BASELINE_VISIBLE_STACK);
    const expandedBoardSchedule = evaluate([
      BASELINE_VISIBLE_STACK[0],
      BASELINE_VISIBLE_STACK[1],
      BASELINE_VISIBLE_STACK[2],
      BASELINE_VISIBLE_STACK[3],
      BASELINE_VISIBLE_STACK[4],
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 8 },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 8 },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 8 },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 8 }
    ]);

    expect(baseline.impact?.basis).toBe("predictor_floor_system_low_confidence_estimate");
    expect(expandedBoardSchedule.impact?.basis).toBe("predictor_heavy_bare_floor_iso12354_annexc_estimate");
    expect(expandedBoardSchedule.floorSystemEstimate?.kind).toBeUndefined();
    expect(expandedBoardSchedule.floorSystemEstimate?.fitPercent).toBeUndefined();
    expect(expandedBoardSchedule.dynamicImpactTrace?.fitPercent).toBeUndefined();
    expect(expandedBoardSchedule.impactPredictorStatus?.inputMode).toBeUndefined();
    expect(expandedBoardSchedule.impactPredictorStatus?.implementedFormulaEstimate).toBe(true);
    expect(expandedBoardSchedule.impactPredictorStatus?.implementedFamilyEstimate).toBe(false);
    expect(expandedBoardSchedule.impactPredictorStatus?.implementedLowConfidenceEstimate).toBe(false);
    expect(expandedBoardSchedule.impactPredictorStatus?.notes).toEqual([
      "Implemented formula estimate is active.",
      "Annex C style relation is active on the current impact lane."
    ]);
    expect(
      expandedBoardSchedule.warnings.some((warning: string) =>
        /withheld the closest candidate label because it drifted outside the defended same-family route/i.test(warning)
      )
    ).toBe(true);
    expect((expandedBoardSchedule.impact?.LnW ?? 0) - (baseline.impact?.LnW ?? 0)).toBeGreaterThanOrEqual(20);
    expect((baseline.floorSystemRatings?.Rw ?? 0) - (expandedBoardSchedule.floorSystemRatings?.Rw ?? 0)).toBeGreaterThanOrEqual(5);
  });
});
