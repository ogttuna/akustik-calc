import { describe, expect, it } from "vitest";

import { calculateImpactOnly } from "./calculate-impact-only";

function buildInput(overrides: Record<string, unknown> = {}) {
  return {
    structuralSupportType: "reinforced_concrete",
    impactSystemType: "combined_upper_lower_system",
    baseSlab: { materialClass: "heavy_concrete", thicknessMm: 180, densityKgM3: 2400 },
    resilientLayer: { thicknessMm: 8, dynamicStiffnessMNm3: 35 },
    floorCovering: { mode: "material_layer", materialClass: "vinyl_flooring", thicknessMm: 3, densityKgM3: 1400 },
    lowerTreatment: {
      type: "suspended_ceiling_elastic_hanger",
      cavityDepthMm: 120,
      cavityFillThicknessMm: 100,
      boardLayerCount: 2,
      boardThicknessMm: 16
    },
    ...overrides
  };
}

function evaluate(input: Record<string, unknown>) {
  return calculateImpactOnly([], {
    impactPredictorInput: input as never,
    targetOutputs: ["Rw", "Ctr", "Ln,w"]
  });
}

describe("reinforced concrete low-confidence edge continuity", () => {
  it("keeps near-threshold combined-vinyl package variations on the same predictor branch with bounded drift", () => {
    const baseline = evaluate(buildInput());
    const variants = [
      evaluate(
        buildInput({
          baseSlab: { materialClass: "heavy_concrete", thicknessMm: 175, densityKgM3: 2400 }
        })
      ),
      evaluate(
        buildInput({
          baseSlab: { materialClass: "heavy_concrete", thicknessMm: 185, densityKgM3: 2400 }
        })
      ),
      evaluate(
        buildInput({
          lowerTreatment: {
            type: "suspended_ceiling_elastic_hanger",
            cavityDepthMm: 110,
            cavityFillThicknessMm: 90,
            boardLayerCount: 2,
            boardThicknessMm: 16
          }
        })
      ),
      evaluate(
        buildInput({
          lowerTreatment: {
            type: "suspended_ceiling_elastic_hanger",
            cavityDepthMm: 130,
            cavityFillThicknessMm: 110,
            boardLayerCount: 2,
            boardThicknessMm: 16
          }
        })
      )
    ];

    expect(baseline.floorSystemEstimate?.kind).toBe("low_confidence");
    expect(baseline.impact?.basis).toBe("predictor_floor_system_low_confidence_estimate");
    expect(baseline.floorSystemEstimate?.fitPercent).toBe(29);

    for (const result of variants) {
      expect(result.floorSystemEstimate?.kind).toBe("low_confidence");
      expect(result.impact?.basis).toBe("predictor_floor_system_low_confidence_estimate");
      expect(result.floorSystemEstimate?.fitPercent).toBe(29);
      expect(result.dynamicImpactTrace?.fitPercent).toBe(29);
      expect(result.impact?.estimateCandidateIds).toEqual(baseline.impact?.estimateCandidateIds);

      expect(Math.abs((result.impact?.LnW ?? 0) - (baseline.impact?.LnW ?? 0))).toBeLessThanOrEqual(0.3);
      expect(Math.abs((result.floorSystemRatings?.Rw ?? 0) - (baseline.floorSystemRatings?.Rw ?? 0))).toBeLessThanOrEqual(0.3);
    }
  });

  it("keeps board-material presence neutral on the baseline low-confidence combined-vinyl lane", () => {
    const withoutBoardClass = evaluate(buildInput());
    const withFirestopBoard = evaluate(
      buildInput({
        lowerTreatment: {
          type: "suspended_ceiling_elastic_hanger",
          cavityDepthMm: 120,
          cavityFillThicknessMm: 100,
          boardLayerCount: 2,
          boardThicknessMm: 16,
          boardMaterialClass: "firestop_board"
        }
      })
    );

    expect(withoutBoardClass.floorSystemEstimate?.kind).toBe("low_confidence");
    expect(withFirestopBoard.floorSystemEstimate?.kind).toBe("low_confidence");
    expect(withoutBoardClass.impact?.basis).toBe("predictor_floor_system_low_confidence_estimate");
    expect(withFirestopBoard.impact?.basis).toBe("predictor_floor_system_low_confidence_estimate");
    expect(withFirestopBoard.floorSystemEstimate?.fitPercent).toBe(29);
    expect(withFirestopBoard.dynamicImpactTrace?.fitPercent).toBe(29);
    expect(withFirestopBoard.impact?.LnW).toBe(withoutBoardClass.impact?.LnW);
    expect(withFirestopBoard.floorSystemRatings?.Rw).toBe(withoutBoardClass.floorSystemRatings?.Rw);
    expect(withFirestopBoard.floorSystemRatings?.RwCtr).toBe(withoutBoardClass.floorSystemRatings?.RwCtr);
    expect(withFirestopBoard.impact?.estimateCandidateIds).toEqual(withoutBoardClass.impact?.estimateCandidateIds);
  });
});
