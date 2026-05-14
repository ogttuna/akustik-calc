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

function expectParkedCombinedRoute(result: ReturnType<typeof evaluate>) {
  expect(result.floorSystemEstimate).toBeNull();
  expect(result.impact).toBeNull();
  expect(result.dynamicImpactTrace).toBeUndefined();
  expect(result.impactPredictorStatus?.implementedLowConfidenceEstimate).toBe(false);
  expect(result.warnings).toContain(
    "Dynamic Calculator reinforced-concrete combined upper/lower impact runtime is waiting for loadBasisKgM2, ceilingOrLowerAssembly before promoting Ln,w / DeltaLw from the heavy-concrete combined formula corridor."
  );
}

describe("reinforced concrete low-confidence edge continuity", () => {
  it("keeps near-threshold combined-vinyl package variations on the same missing-owner boundary", () => {
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

    expectParkedCombinedRoute(baseline);

    for (const result of variants) {
      expectParkedCombinedRoute(result);
      expect(Math.abs((result.floorSystemRatings?.Rw ?? 0) - (baseline.floorSystemRatings?.Rw ?? 0))).toBeLessThanOrEqual(1);
    }
  });

  it("keeps board-material presence neutral on the baseline missing-owner combined-vinyl boundary", () => {
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

    expectParkedCombinedRoute(withoutBoardClass);
    expectParkedCombinedRoute(withFirestopBoard);
    expect(withFirestopBoard.floorSystemRatings?.Rw).toBe(withoutBoardClass.floorSystemRatings?.Rw);
    expect(withFirestopBoard.floorSystemRatings?.RwCtr).toBe(withoutBoardClass.floorSystemRatings?.RwCtr);
  });
});
