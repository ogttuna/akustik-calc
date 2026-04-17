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
  it("keeps the low-confidence combined vinyl lane on the bounded combined-geometry slope", () => {
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
      expect(result.floorSystemEstimate?.kind, `${variant.id} should remain low-confidence`).toBe("low_confidence");
      expect(result.floorSystemEstimate?.fitPercent, `${variant.id} fit should stay capped`).toBe(29);
      expect(result.dynamicImpactTrace?.fitPercent, `${variant.id} trace fit should stay capped`).toBe(29);
      expect(result.dynamicImpactTrace?.selectionKindLabel, `${variant.id} should stay explicitly low-confidence`).toBe(
        "Low-confidence fallback"
      );
      expect(result.dynamicImpactTrace?.notes).toContain("Low-confidence fallback is active on the current impact lane.");
      expect(result.dynamicImpactTrace?.notes).not.toContain(
        "Published family estimate is active on the current impact lane."
      );
      expect(result.impactSupport?.notes).toContain(
        "Nearby-row ranking stays elastic-ceiling first, rigid-ceiling second, with timber-underlay held as a farther fallback when cavity and board geometry drift."
      );
      expect(result.impact?.notes).toContain(
        "This remains a low-confidence fallback built from nearby published rows, not a narrow published-family claim or an exact lab record."
      );
      expect(result.impact?.notes?.join(" ")).not.toContain("This remains a labeled published-family estimate");
      expect(result.impact?.notes?.join(" ")).not.toContain("Candidate rows:");
      expect(result.floorSystemEstimate?.notes?.join(" ")).toContain("Nearby published lineage:");
      expect(result.floorSystemEstimate?.notes?.join(" ")).not.toContain("Curated lineage:");
      expect(result.impact?.basis, `${variant.id} basis should remain low-confidence`).toBe(
        "predictor_floor_system_low_confidence_estimate"
      );
      expect(result.impact?.LnW, `${variant.id} Ln,w should follow the bounded geometry`).toBe(metrics?.lnW);
      expect(result.floorSystemRatings?.Rw, `${variant.id} Rw should follow the bounded geometry`).toBe(metrics?.rw);
    }
  });

  it("keeps the low-confidence combined vinyl lane materially separated from the formula-owned heavy-floating corridor", () => {
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

    expect(lowConfidence.floorSystemEstimate?.kind).toBe("low_confidence");
    expect(lowConfidence.dynamicImpactTrace?.selectionKindLabel).toBe("Low-confidence fallback");
    expect(lowConfidence.impact?.basis).toBe("predictor_floor_system_low_confidence_estimate");
    expect(formula.impact?.basis).toBe("predictor_heavy_floating_floor_iso12354_annexc_estimate");
    expect(formula.impact?.DeltaLw).toBe(7);

    expect(typeof lowConfidence.impact?.LnW).toBe("number");
    expect(typeof formula.impact?.LnW).toBe("number");
    expect(typeof lowConfidence.floorSystemRatings?.Rw).toBe("number");
    expect(typeof formula.floorSystemRatings?.Rw).toBe("number");

    expect((formula.impact?.LnW ?? 0) - (lowConfidence.impact?.LnW ?? 0)).toBeGreaterThanOrEqual(10);
    expect((lowConfidence.floorSystemRatings?.Rw ?? 0) - (formula.floorSystemRatings?.Rw ?? 0)).toBeGreaterThanOrEqual(4);
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
    expect(routed.floorSystemEstimate?.kind).toBe("low_confidence");
    expect(routed.impact?.basis).toBe("predictor_floor_system_low_confidence_estimate");
    expect(routed.dynamicImpactTrace?.selectionKindLabel).toBe("Low-confidence fallback");
  });
});
