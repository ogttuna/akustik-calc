import { describe, expect, it } from "vitest";

import { derivePredictorSpecificFloorSystemEstimate } from "./predictor-floor-system-estimate";

describe("derivePredictorSpecificFloorSystemEstimate", () => {
  it("keeps reinforced-concrete vinyl inputs on the low-confidence strategy even when the ceiling board token is explicit", () => {
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
        boardThicknessMm: 16,
        boardMaterialClass: "firestop_board"
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

  it("keeps combined wet concrete plus elastic ceiling inputs on the heavy-concrete special strategy", () => {
    const result = derivePredictorSpecificFloorSystemEstimate({
      structuralSupportType: "reinforced_concrete",
      impactSystemType: "combined_upper_lower_system",
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
        thicknessMm: 50,
        densityKgM3: 2000
      },
      floorCovering: {
        mode: "material_layer",
        materialClass: "ceramic_tile",
        thicknessMm: 8,
        densityKgM3: 2000
      },
      lowerTreatment: {
        type: "suspended_ceiling_elastic_hanger",
        cavityDepthMm: 65,
        cavityFillThicknessMm: 100,
        boardLayerCount: 2,
        boardThicknessMm: 13,
        boardMaterialClass: "gypsum_board"
      }
    });

    expect(result?.kind).toBe("family_general");
    expect(result?.impact.basis).toBe("predictor_heavy_concrete_published_upper_treatment_estimate");
    expect(result?.impact.LnW).toBe(43);
    expect(result?.airborneRatings.Rw).toBe(77);
    expect(result?.impact.estimateCandidateIds).toEqual(["euracoustics_f2_elastic_ceiling_concrete_lab_2026"]);
  });

  it("keeps combined wet concrete plus rigid gypsum ceiling inputs on the heavy-concrete special strategy", () => {
    const result = derivePredictorSpecificFloorSystemEstimate({
      structuralSupportType: "reinforced_concrete",
      impactSystemType: "combined_upper_lower_system",
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
        thicknessMm: 50,
        densityKgM3: 2000
      },
      floorCovering: {
        mode: "material_layer",
        materialClass: "ceramic_tile",
        thicknessMm: 8,
        densityKgM3: 2000
      },
      lowerTreatment: {
        type: "suspended_ceiling_rigid_hanger",
        cavityDepthMm: 130,
        cavityFillThicknessMm: 100,
        boardLayerCount: 2,
        boardThicknessMm: 13,
        boardMaterialClass: "gypsum_board"
      }
    });

    expect(result?.kind).toBe("family_general");
    expect(result?.impact.basis).toBe("predictor_heavy_concrete_published_upper_treatment_estimate");
    expect(result?.impact.LnW).toBe(51.5);
    expect(result?.airborneRatings.Rw).toBe(70);
    expect(result?.airborneRatings.RwCtr).toBe(57);
    expect(result?.impact.estimateCandidateIds).toEqual([
      "euracoustics_f1_rigid_ceiling_concrete_lab_2026",
      "euracoustics_f2_elastic_ceiling_concrete_lab_2026",
      "knauf_cc60_1a_concrete150_timber_acoustic_underlay_lab_2026"
    ]);
  });

  it("keeps combined wet concrete plus derived generic gypsum ceiling inputs on the heavy-concrete special strategy", () => {
    const result = derivePredictorSpecificFloorSystemEstimate({
      structuralSupportType: "reinforced_concrete",
      impactSystemType: "combined_upper_lower_system",
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
        thicknessMm: 50,
        densityKgM3: 2000
      },
      floorCovering: {
        mode: "material_layer",
        materialClass: "ceramic_tile",
        thicknessMm: 8,
        densityKgM3: 2000
      },
      lowerTreatment: {
        type: "suspended_ceiling_rigid_hanger",
        cavityDepthMm: 130,
        cavityFillThicknessMm: 100,
        boardLayerCount: 2,
        boardThicknessMm: 13,
        boardMaterialClass: "generic_gypsum_board"
      }
    });

    expect(result?.kind).toBe("family_general");
    expect(result?.impact.basis).toBe("predictor_heavy_concrete_published_upper_treatment_estimate");
    expect(result?.impact.LnW).toBe(51.5);
    expect(result?.airborneRatings.Rw).toBe(70);
    expect(result?.airborneRatings.RwCtr).toBe(57);
  });

  it("treats fire_board as firestop_board on reinforced-concrete concrete archetype inputs", () => {
    const result = derivePredictorSpecificFloorSystemEstimate({
      structuralSupportType: "reinforced_concrete",
      impactSystemType: "suspended_ceiling_only",
      baseSlab: {
        materialClass: "heavy_concrete",
        thicknessMm: 205,
        densityKgM3: 2400
      },
      floorCovering: {
        mode: "material_layer",
        materialClass: "ceramic_tile",
        thicknessMm: 8,
        densityKgM3: 2000
      },
      lowerTreatment: {
        type: "suspended_ceiling_rigid_hanger",
        cavityDepthMm: 310,
        cavityFillThicknessMm: 50,
        boardLayerCount: 2,
        boardThicknessMm: 13,
        boardMaterialClass: "fire_board",
        supportClass: "furred_channels"
      }
    });

    expect(result?.kind).toBe("family_archetype");
    expect(result?.impact.basis).toBe("predictor_floor_system_family_archetype_estimate");
    expect(result?.impact.LnW).toBe(45);
    expect(result?.airborneRatings.Rw).toBe(69);
    expect(result?.airborneRatings.RwCtr).toBe(64);
    expect(result?.impact.estimateCandidateIds).toEqual(["knauf_cc60_1b_concrete200_tile_acoustic_underlay_lab_2026"]);
  });

  it("keeps split timber flooring plus generic underlay concrete inputs on the concrete archetype strategy", () => {
    const result = derivePredictorSpecificFloorSystemEstimate({
      structuralSupportType: "reinforced_concrete",
      impactSystemType: "combined_upper_lower_system",
      baseSlab: {
        materialClass: "heavy_concrete",
        thicknessMm: 165,
        densityKgM3: 2400
      },
      resilientLayer: {
        thicknessMm: 5
      },
      floorCovering: {
        mode: "material_layer",
        materialClass: "engineered_timber_flooring",
        thicknessMm: 18,
        densityKgM3: 900
      },
      lowerTreatment: {
        type: "suspended_ceiling_elastic_hanger",
        cavityDepthMm: 110,
        cavityFillThicknessMm: 60,
        boardLayerCount: 2,
        boardThicknessMm: 13,
        boardMaterialClass: "firestop_board"
      }
    });

    expect(result?.kind).toBe("family_archetype");
    expect(result?.impact.basis).toBe("predictor_floor_system_family_archetype_estimate");
    expect(result?.impact.LnW).toBe(51);
    expect(result?.airborneRatings.Rw).toBe(63);
    expect(result?.airborneRatings.RwCtr).toBe(57);
    expect(result?.impact.estimateCandidateIds).toEqual(["knauf_cc60_1a_concrete150_timber_acoustic_underlay_lab_2026"]);
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
