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

describe("reinforced concrete visible low-confidence cleanup edge continuity", () => {
  it("keeps neutral visible-stack reorder and alias variants on the same derived needs-input boundary", () => {
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

    expect(baseline.floorSystemEstimate).toBeNull();
    expect(baseline.dynamicImpactTrace?.fitPercent).toBeUndefined();
    expect(baseline.impact).toBeNull();
    expect(baseline.impactPredictorStatus?.inputMode).toBe("derived_from_visible_layers");
    expect(baseline.impactPredictorStatus?.implementedLowConfidenceEstimate).toBe(false);
    expect(baseline.impactPredictorStatus?.warnings).toEqual(expect.arrayContaining([
      expect.stringMatching(/reinforced-concrete combined upper\/lower impact runtime is waiting/i)
    ]));
    expect(baseline.supportedTargetOutputs).toEqual(["Rw", "Ctr"]);
    expect(baseline.unsupportedTargetOutputs).toEqual(["Ln,w"]);

    for (const result of variants) {
      expect(result.floorSystemEstimate).toBeNull();
      expect(result.dynamicImpactTrace?.fitPercent).toBeUndefined();
      expect(result.impact).toBeNull();
      expect(result.impactPredictorStatus?.inputMode).toBe("derived_from_visible_layers");
      expect(result.impactPredictorStatus?.implementedLowConfidenceEstimate).toBe(false);
      expect(result.impactPredictorStatus?.warnings).toEqual(baseline.impactPredictorStatus?.warnings);
      expect(result.supportedTargetOutputs).toEqual(baseline.supportedTargetOutputs);
      expect(result.unsupportedTargetOutputs).toEqual(baseline.unsupportedTargetOutputs);
      expect(result.floorSystemRatings?.Rw).toBe(baseline.floorSystemRatings?.Rw);
      expect(result.floorSystemRatings?.RwCtr).toBe(baseline.floorSystemRatings?.RwCtr);
      expect(result.impactPredictorStatus?.notes).toEqual(baseline.impactPredictorStatus?.notes);
    }
  });

  it("treats an expanded ceiling-board schedule as the same missing-owner boundary instead of falling through to bare impact", () => {
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

    expect(baseline.impact).toBeNull();
    expect(expandedBoardSchedule.impact).toBeNull();
    expect(expandedBoardSchedule.floorSystemEstimate).toBeNull();
    expect(expandedBoardSchedule.dynamicImpactTrace?.fitPercent).toBeUndefined();
    expect(expandedBoardSchedule.impactPredictorStatus?.inputMode).toBe("derived_from_visible_layers");
    expect(expandedBoardSchedule.impactPredictorStatus?.implementedFormulaEstimate).toBe(false);
    expect(expandedBoardSchedule.impactPredictorStatus?.implementedFamilyEstimate).toBe(false);
    expect(expandedBoardSchedule.impactPredictorStatus?.implementedLowConfidenceEstimate).toBe(false);
    expect(expandedBoardSchedule.impactPredictorStatus?.warnings).toEqual(expect.arrayContaining([
      expect.stringMatching(/reinforced-concrete combined upper\/lower impact runtime is waiting/i)
    ]));
    expect(
      expandedBoardSchedule.warnings.some((warning: string) =>
        /withheld the closest candidate label because it drifted outside the defended same-family route/i.test(warning)
      )
    ).toBe(true);
    expect(expandedBoardSchedule.supportedTargetOutputs).toEqual(["Rw", "Ctr"]);
    expect(expandedBoardSchedule.unsupportedTargetOutputs).toEqual(["Ln,w"]);
    expect(expandedBoardSchedule.floorSystemRatings?.Rw).toBe(baseline.floorSystemRatings?.Rw);
    expect(expandedBoardSchedule.floorSystemRatings?.RwCtr).toBe(baseline.floorSystemRatings?.RwCtr);
  });
});
