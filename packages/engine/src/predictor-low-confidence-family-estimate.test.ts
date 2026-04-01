import { describe, expect, it } from "vitest";

import { derivePredictorLowConfidenceFamilyEstimate } from "./predictor-low-confidence-family-estimate";

describe("derivePredictorLowConfidenceFamilyEstimate", () => {
  it("keeps reinforced-concrete combined vinyl inputs on the concrete low-confidence lane", () => {
    const result = derivePredictorLowConfidenceFamilyEstimate({
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
    expect(result?.impact.LnW).toBe(50);
    expect(result?.airborneRatings.Rw).toBe(65.9);
    expect(result?.impact.estimateCandidateIds).toEqual([
      "knauf_cc60_1a_concrete150_timber_acoustic_underlay_lab_2026",
      "knauf_cc60_1a_concrete150_carpet_lab_2026",
      "euracoustics_f2_elastic_ceiling_concrete_lab_2026",
      "euracoustics_f0_bare_concrete_lab_2026",
      "euracoustics_f1_rigid_ceiling_concrete_lab_2026"
    ]);
  });

  it("keeps open-web steel suspended vinyl inputs on the open-web low-confidence lane", () => {
    const result = derivePredictorLowConfidenceFamilyEstimate({
      structuralSupportType: "steel_joists",
      supportForm: "open_web_or_rolled",
      impactSystemType: "suspended_ceiling_only",
      baseSlab: {
        thicknessMm: 250
      },
      floorCovering: {
        mode: "material_layer",
        materialClass: "vinyl_flooring",
        thicknessMm: 3
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
    expect(result?.impact.LnW).toBe(51);
    expect(result?.impact.CI).toBe(-1.7);
    expect(result?.impact.LnWPlusCI).toBe(49.3);
    expect(result?.airborneRatings.Rw).toBe(63.1);
    expect(result?.impact.estimateCandidateIds).toEqual([
      "ubiq_fl33_open_web_steel_200_lab_2026",
      "ubiq_fl33_open_web_steel_300_lab_2026",
      "ubiq_fl28_open_web_steel_200_exact_lab_2026",
      "ubiq_fl28_open_web_steel_300_exact_lab_2026",
      "ubiq_fl28_open_web_steel_400_exact_lab_2026"
    ]);
  });

  it("keeps joist steel suspended vinyl inputs on the joist low-confidence lane", () => {
    const result = derivePredictorLowConfidenceFamilyEstimate({
      structuralSupportType: "steel_joists",
      supportForm: "joist_or_purlin",
      impactSystemType: "suspended_ceiling_only",
      baseSlab: {
        thicknessMm: 250
      },
      floorCovering: {
        mode: "material_layer",
        materialClass: "vinyl_flooring",
        thicknessMm: 3
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
    expect(result?.impact.LnW).toBe(58.3);
    expect(result?.airborneRatings.Rw).toBe(61);
    expect(result?.impact.estimateCandidateIds).toEqual([
      "pliteq_steel_joist_250_rst02_vinyl_lab_2026",
      "ubiq_fl32_steel_200_lab_2026",
      "ubiq_fl32_steel_300_lab_2026",
      "pliteq_steel_joist_250_rst12_porcelain_lab_2026",
      "pliteq_steel_joist_250_rst02_wood_lab_2026"
    ]);
  });

  it("keeps timber direct-to-joists ceramic inputs on the timber low-confidence lane", () => {
    const result = derivePredictorLowConfidenceFamilyEstimate({
      structuralSupportType: "timber_joists",
      supportForm: "joist_or_purlin",
      impactSystemType: "suspended_ceiling_only",
      floorCovering: {
        mode: "material_layer",
        materialClass: "ceramic_tile",
        thicknessMm: 8
      },
      lowerTreatment: {
        type: "direct_fixed_ceiling",
        supportClass: "direct_to_joists",
        boardMaterialClass: "firestop_board",
        boardThicknessMm: 13
      }
    });

    expect(result?.kind).toBe("low_confidence");
    expect(result?.impact.basis).toBe("predictor_floor_system_low_confidence_estimate");
    expect(result?.impact.LnW).toBe(69.9);
    expect(result?.airborneRatings.Rw).toBe(51.8);
    expect(result?.airborneRatings.RwCtr).toBe(45.1);
    expect(result?.impact.estimateCandidateIds).toEqual([
      "knauf_ct30_1a_timber_lab_2026",
      "knauf_ct30_2a_timber_lab_2026",
      "knauf_ct30_1b_timber_lab_2026",
      "knauf_ct30_2b_timber_lab_2026",
      "knauf_ct2d_timber_r25_lab_2026"
    ]);
  });

  it("keeps timber bare laminate inputs on the bare-floor low-confidence lane", () => {
    const result = derivePredictorLowConfidenceFamilyEstimate({
      structuralSupportType: "timber_joists",
      impactSystemType: "bare_floor",
      baseSlab: {
        thicknessMm: 240
      },
      floorCovering: {
        mode: "material_layer",
        materialClass: "laminate_flooring",
        thicknessMm: 9,
        densityKgM3: 850
      }
    });

    expect(result?.kind).toBe("low_confidence");
    expect(result?.impact.basis).toBe("predictor_floor_system_low_confidence_estimate");
    expect(result?.impact.LnW).toBe(61.3);
    expect(result?.impact.CI).toBe(2);
    expect(result?.impact.LnWPlusCI).toBe(63.3);
    expect(result?.airborneRatings.Rw).toBe(51.6);
    expect(result?.impact.estimateCandidateIds).toEqual([
      "dataholz_gdsnxn01a_timber_frame_lab_2026",
      "knauf_ct3b_timber_nil_lab_2026",
      "knauf_ct2a_timber_nil_lab_2026",
      "knauf_ct2a_carpet_nil_lab_2026",
      "knauf_ct2d_timber_nil_lab_2026"
    ]);
  });

  it("keeps composite suspended-ceiling inputs on the composite low-confidence lane", () => {
    const result = derivePredictorLowConfidenceFamilyEstimate({
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
    expect(result?.impact.LnW).toBe(63.3);
    expect(result?.airborneRatings.Rw).toBe(48.6);
    expect(result?.impact.estimateCandidateIds).toEqual([
      "pmc_m1_bare_composite_lab_2026",
      "pmc_m1_dry_floating_plus_c2x_lab_2026",
      "pmc_m1_dry_floating_plus_c1x_lab_2026",
      "pmc_m1_dry_floating_floor_lab_2026"
    ]);
  });
});
