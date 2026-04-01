import { describe, expect, it } from "vitest";

import { derivePredictorSpecificFloorSystemEstimate } from "./predictor-floor-system-estimate";

describe("derivePredictorSpecificFloorSystemEstimate", () => {
  it("keeps overlapping reinforced-concrete vinyl inputs on the low-confidence strategy before the published-family strategy", () => {
    const result = derivePredictorSpecificFloorSystemEstimate({
      structuralSupportType: "reinforced_concrete",
      impactSystemType: "combined_upper_lower_system",
      baseSlab: {
        materialClass: "heavy_concrete",
        thicknessMm: 180,
        densityKgM3: 2400
      },
      resilientLayer: {
        thicknessMm: 8,
        dynamicStiffnessMNm3: 35
      },
      floorCovering: {
        mode: "material_layer",
        materialClass: "vinyl_flooring",
        thicknessMm: 3,
        densityKgM3: 1400
      },
      lowerTreatment: {
        type: "suspended_ceiling_elastic_hanger",
        cavityDepthMm: 120,
        cavityFillThicknessMm: 100,
        boardLayerCount: 2,
        boardThicknessMm: 16
      }
    });

    expect(result?.kind).toBe("low_confidence");
    expect(result?.impact.basis).toBe("predictor_floor_system_low_confidence_estimate");
  });

  it("keeps overlapping composite suspended-ceiling inputs on the low-confidence strategy before the composite interaction strategy", () => {
    const result = derivePredictorSpecificFloorSystemEstimate({
      structuralSupportType: "composite_panel",
      impactSystemType: "suspended_ceiling_only",
      baseSlab: {
        materialClass: "composite_steel_deck",
        thicknessMm: 150,
        densityKgM3: 2350
      },
      lowerTreatment: {
        type: "suspended_ceiling_elastic_hanger",
        cavityDepthMm: 150,
        cavityFillThicknessMm: 100,
        boardLayerCount: 2,
        boardThicknessMm: 16
      }
    });

    expect(result?.kind).toBe("low_confidence");
    expect(result?.impact.basis).toBe("predictor_floor_system_low_confidence_estimate");
  });

  it("falls through to the heavy-concrete special strategy when no low-confidence strategy matches", () => {
    const result = derivePredictorSpecificFloorSystemEstimate({
      structuralSupportType: "reinforced_concrete",
      impactSystemType: "heavy_floating_floor",
      baseSlab: {
        materialClass: "heavy_concrete",
        thicknessMm: 150,
        densityKgM3: 2400
      },
      resilientLayer: {
        thicknessMm: 8
      },
      floatingScreed: {
        materialClass: "generic_screed",
        thicknessMm: 30
      },
      floorCovering: {
        mode: "material_layer",
        materialClass: "ceramic_tile",
        thicknessMm: 8,
        densityKgM3: 2000
      }
    });

    expect(result?.kind).toBe("family_general");
    expect(result?.impact.basis).toBe("predictor_heavy_concrete_published_upper_treatment_estimate");
  });

  it("falls through to the published-family strategy when no earlier special strategy matches", () => {
    const result = derivePredictorSpecificFloorSystemEstimate({
      structuralSupportType: "timber_joists",
      impactSystemType: "combined_upper_lower_system",
      baseSlab: {
        thicknessMm: 200
      },
      floorCovering: {
        mode: "material_layer",
        materialClass: "dry_floating_gypsum_fiberboard",
        thicknessMm: 65
      },
      lowerTreatment: {
        type: "suspended_ceiling_elastic_hanger",
        cavityDepthMm: 60,
        cavityFillThicknessMm: 200,
        boardLayerCount: 1,
        boardThicknessMm: 15
      }
    });

    expect(result?.kind).toBe("family_archetype");
    expect(result?.impact.basis).toBe("predictor_floor_system_family_archetype_estimate");
    expect(result?.impact.estimateCandidateIds).toEqual(["dataholz_gdrtxa06a_timber_frame_dry_lab_2026"]);
  });
});
