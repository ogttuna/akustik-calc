import { describe, expect, it } from "vitest";

import { calculateImpactOnly } from "./calculate-impact-only";
import { derivePredictorPublishedFamilyEstimate } from "./predictor-published-family-estimate";
import { deriveReinforcedConcreteCombinedVinylElasticCeilingMetrics } from "./reinforced-concrete-combined-vinyl-elastic-ceiling-estimate";

function buildReinforcedConcreteCombinedInput(overrides: Record<string, unknown> = {}) {
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

describe("reinforced concrete family vs formula fit audit", () => {
  it("parks the old low-confidence combined vinyl lane even when the bounded geometry helper can score it", () => {
    const variants = [
      {
        id: "baseline",
        input: buildReinforcedConcreteCombinedInput()
      },
      {
        id: "shallower",
        input: buildReinforcedConcreteCombinedInput({
          baseSlab: { materialClass: "heavy_concrete", thicknessMm: 165, densityKgM3: 2400 },
          resilientLayer: { thicknessMm: 6, dynamicStiffnessMNm3: 28 },
          floorCovering: { mode: "material_layer", materialClass: "vinyl_flooring", thicknessMm: 4, densityKgM3: 1400 },
          lowerTreatment: {
            type: "suspended_ceiling_elastic_hanger",
            cavityDepthMm: 100,
            cavityFillThicknessMm: 85,
            boardLayerCount: 2,
            boardThicknessMm: 15
          }
        })
      },
      {
        id: "deeper",
        input: buildReinforcedConcreteCombinedInput({
          baseSlab: { materialClass: "heavy_concrete", thicknessMm: 140, densityKgM3: 2400 },
          resilientLayer: { thicknessMm: 10, dynamicStiffnessMNm3: 32 },
          floorCovering: { mode: "material_layer", materialClass: "vinyl_flooring", thicknessMm: 2.5, densityKgM3: 1400 },
          lowerTreatment: {
            type: "suspended_ceiling_elastic_hanger",
            cavityDepthMm: 140,
            cavityFillThicknessMm: 120,
            boardLayerCount: 2,
            boardThicknessMm: 18
          }
        })
      }
    ] as const;

    for (const variant of variants) {
      const metrics = deriveReinforcedConcreteCombinedVinylElasticCeilingMetrics(variant.input as never);
      const result = calculateImpactOnly([], {
        impactPredictorInput: variant.input as never,
        targetOutputs: ["Rw", "Ctr", "Ln,w"]
      });

      expect(metrics, `${variant.id} should stay inside the bounded combined geometry`).not.toBeNull();
      expect(result.floorSystemEstimate, `${variant.id} should not promote a low-confidence family row`).toBeNull();
      expect(result.impact, `${variant.id} should park impact until physical owners are complete`).toBeNull();
      expect(result.dynamicImpactTrace, `${variant.id} should not expose a live low-confidence trace`).toBeUndefined();
      expect(result.impactPredictorStatus?.implementedLowConfidenceEstimate).toBe(false);
      expect(result.warnings).toContain(
        "Dynamic Calculator reinforced-concrete combined upper/lower impact runtime is waiting for loadBasisKgM2, ceilingOrLowerAssembly before promoting Ln,w / DeltaLw from the heavy-concrete combined formula corridor."
      );
    }
  });

  it("keeps the parked combined vinyl branch materially separated from the formula-owned heavy-floating corridor", () => {
    const lowConfidence = calculateImpactOnly([], {
      impactPredictorInput: buildReinforcedConcreteCombinedInput() as never,
      targetOutputs: ["Rw", "Ctr", "Ln,w"]
    });

    const formula = calculateImpactOnly([], {
      impactPredictorInput: {
        structuralSupportType: "reinforced_concrete",
        impactSystemType: "heavy_floating_floor",
        referenceFloorType: "heavy_standard",
        baseSlab: { materialClass: "heavy_concrete", thicknessMm: 180, densityKgM3: 2400 },
        resilientLayer: { thicknessMm: 8, dynamicStiffnessMNm3: 35 },
        floorCovering: { mode: "material_layer", materialClass: "vinyl_flooring", thicknessMm: 3, densityKgM3: 1400 }
      },
      targetOutputs: ["Rw", "Ctr", "Ln,w", "DeltaLw"]
    });

    expect(lowConfidence.floorSystemEstimate).toBeNull();
    expect(lowConfidence.dynamicImpactTrace).toBeUndefined();
    expect(lowConfidence.impact).toBeNull();
    expect(lowConfidence.impactPredictorStatus?.implementedLowConfidenceEstimate).toBe(false);
    expect(formula.impact?.basis).toBe("predictor_heavy_floating_floor_iso12354_annexc_estimate");
    expect(formula.impact?.DeltaLw).toBe(7);

    expect(typeof formula.impact?.LnW).toBe("number");
    expect(typeof lowConfidence.floorSystemRatings?.Rw).toBe("number");
    expect(typeof formula.floorSystemRatings?.Rw).toBe("number");
  });

  it("does not keep a hidden published-family overlap for the same combined vinyl corridor", () => {
    const input = buildReinforcedConcreteCombinedInput({
      lowerTreatment: {
        type: "suspended_ceiling_elastic_hanger",
        cavityDepthMm: 120,
        cavityFillThicknessMm: 100,
        boardLayerCount: 2,
        boardThicknessMm: 16,
        boardMaterialClass: "firestop_board"
      }
    });

    const directPublishedFamily = derivePredictorPublishedFamilyEstimate(input as never);
    const routed = calculateImpactOnly([], {
      impactPredictorInput: input as never,
      targetOutputs: ["Rw", "Ctr", "Ln,w"]
    });

    expect(directPublishedFamily).toBeNull();
    expect(routed.floorSystemEstimate).toBeNull();
    expect(routed.impact).toBeNull();
    expect(routed.dynamicImpactTrace).toBeUndefined();
    expect(routed.impactPredictorStatus?.implementedLowConfidenceEstimate).toBe(false);
  });
});
