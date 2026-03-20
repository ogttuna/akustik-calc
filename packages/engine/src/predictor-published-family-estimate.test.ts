import { describe, expect, it } from "vitest";

import { derivePredictorPublishedFamilyEstimate } from "./predictor-published-family-estimate";

describe("derivePredictorPublishedFamilyEstimate", () => {
  it("keeps near-match Knauf concrete timber-underlay stacks on the concrete archetype lane", () => {
    const result = derivePredictorPublishedFamilyEstimate({
      structuralSupportType: "reinforced_concrete",
      impactSystemType: "combined_upper_lower_system",
      baseSlab: {
        materialClass: "heavy_concrete",
        thicknessMm: 165
      },
      floorCovering: {
        mode: "material_layer",
        materialClass: "engineered_timber_with_acoustic_underlay",
        thicknessMm: 18
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
    expect(result?.impact.estimateCandidateIds).toEqual([
      "knauf_cc60_1a_concrete150_timber_acoustic_underlay_lab_2026"
    ]);
  });

  it("keeps near-match Knauf concrete carpet stacks on the concrete archetype lane", () => {
    const result = derivePredictorPublishedFamilyEstimate({
      structuralSupportType: "reinforced_concrete",
      impactSystemType: "combined_upper_lower_system",
      baseSlab: {
        materialClass: "heavy_concrete",
        thicknessMm: 155
      },
      floorCovering: {
        mode: "material_layer",
        materialClass: "carpet_with_foam_underlay",
        thicknessMm: 10
      },
      lowerTreatment: {
        type: "suspended_ceiling_elastic_hanger",
        cavityDepthMm: 95,
        cavityFillThicknessMm: 50,
        boardLayerCount: 2,
        boardThicknessMm: 13
      }
    });

    expect(result?.kind).toBe("family_archetype");
    expect(result?.impact.basis).toBe("predictor_floor_system_family_archetype_estimate");
    expect(result?.impact.LnW).toBe(31);
    expect(result?.airborneRatings.Rw).toBe(63);
    expect(result?.airborneRatings.RwCtr).toBe(57);
    expect(result?.impact.estimateCandidateIds).toEqual(["knauf_cc60_1a_concrete150_carpet_lab_2026"]);
  });

  it("keeps near-match Knauf concrete tile-ceiling stacks on the tile archetype lane", () => {
    const result = derivePredictorPublishedFamilyEstimate({
      structuralSupportType: "reinforced_concrete",
      impactSystemType: "suspended_ceiling_only",
      baseSlab: {
        materialClass: "heavy_concrete",
        thicknessMm: 205
      },
      floorCovering: {
        mode: "material_layer",
        materialClass: "ceramic_tile",
        thicknessMm: 8
      },
      lowerTreatment: {
        type: "suspended_ceiling_rigid_hanger",
        cavityDepthMm: 310,
        cavityFillThicknessMm: 50,
        boardLayerCount: 2,
        boardThicknessMm: 13,
        boardMaterialClass: "firestop_board",
        supportClass: "furred_channels"
      }
    });

    expect(result?.kind).toBe("family_archetype");
    expect(result?.impact.basis).toBe("predictor_floor_system_family_archetype_estimate");
    expect(result?.impact.LnW).toBe(45);
    expect(result?.airborneRatings.Rw).toBe(69);
    expect(result?.airborneRatings.RwCtr).toBe(64);
    expect(result?.impact.estimateCandidateIds).toEqual([
      "knauf_cc60_1b_concrete200_tile_acoustic_underlay_lab_2026"
    ]);
  });

  it("keeps near-match Knauf concrete tile-underlay ceiling stacks on the combined tile archetype lane", () => {
    const result = derivePredictorPublishedFamilyEstimate({
      structuralSupportType: "reinforced_concrete",
      impactSystemType: "combined_upper_lower_system",
      baseSlab: {
        materialClass: "heavy_concrete",
        thicknessMm: 205
      },
      resilientLayer: {
        thicknessMm: 5
      },
      floorCovering: {
        mode: "material_layer",
        materialClass: "ceramic_tile",
        thicknessMm: 8
      },
      lowerTreatment: {
        type: "suspended_ceiling_rigid_hanger",
        cavityDepthMm: 310,
        cavityFillThicknessMm: 50,
        boardLayerCount: 2,
        boardThicknessMm: 13,
        boardMaterialClass: "firestop_board",
        supportClass: "furred_channels"
      }
    });

    expect(result?.kind).toBe("family_archetype");
    expect(result?.impact.basis).toBe("predictor_floor_system_family_archetype_estimate");
    expect(result?.impact.LnW).toBe(45);
    expect(result?.airborneRatings.Rw).toBe(69);
    expect(result?.airborneRatings.RwCtr).toBe(64);
    expect(result?.impact.estimateCandidateIds).toEqual([
      "knauf_cc60_1b_concrete200_tile_acoustic_underlay_lab_2026"
    ]);
  });

  it("keeps near-match concrete vinyl plus elastic ceiling stacks on the narrower family-general lane", () => {
    const result = derivePredictorPublishedFamilyEstimate({
      structuralSupportType: "reinforced_concrete",
      impactSystemType: "combined_upper_lower_system",
      baseSlab: {
        materialClass: "heavy_concrete",
        thicknessMm: 180
      },
      resilientLayer: {
        thicknessMm: 8,
        dynamicStiffnessMNm3: 35
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

    expect(result?.kind).toBe("family_general");
    expect(result?.impact.basis).toBe("predictor_floor_system_family_general_estimate");
    expect(result?.impact.LnW).toBe(50);
    expect(result?.airborneRatings.Rw).toBe(65.9);
    expect(result?.airborneRatings.RwCtr).toBe(57);
    expect(result?.impact.estimateCandidateIds).toEqual([
      "knauf_cc60_1a_concrete150_timber_acoustic_underlay_lab_2026",
      "euracoustics_f2_elastic_ceiling_concrete_lab_2026",
      "euracoustics_f1_rigid_ceiling_concrete_lab_2026"
    ]);
  });

  it("keeps near-match steel joist vinyl suspended-ceiling stacks on the Pliteq family lane", () => {
    const result = derivePredictorPublishedFamilyEstimate({
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

    expect(result?.kind).toBe("family_general");
    expect(result?.impact.basis).toBe("predictor_floor_system_family_general_estimate");
    expect(result?.impact.LnW).toBe(58);
    expect(result?.airborneRatings.Rw).toBe(60);
    expect(result?.airborneRatings.RwCtr).toBeUndefined();
    expect(result?.impact.estimateCandidateIds).toEqual([
      "pliteq_steel_joist_250_rst02_vinyl_lab_2026",
      "pliteq_steel_joist_250_rst02_wood_lab_2026",
      "pliteq_steel_joist_250_rst12_porcelain_lab_2026"
    ]);
  });

  it("keeps near-match open-web steel vinyl suspended-ceiling stacks on the UBIQ family lane", () => {
    const result = derivePredictorPublishedFamilyEstimate({
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

    expect(result?.kind).toBe("family_general");
    expect(result?.impact.basis).toBe("predictor_floor_system_family_general_estimate");
    expect(result?.impact.LnW).toBe(51);
    expect(result?.impact.CI).toBe(-1.7);
    expect(result?.impact.LnWPlusCI).toBe(49.3);
    expect(result?.airborneRatings.Rw).toBe(63.1);
    expect(result?.airborneRatings.RwCtr).toBe(57.7);
    expect(result?.impact.estimateCandidateIds).toEqual([
      "ubiq_fl33_open_web_steel_200_lab_2026",
      "ubiq_fl33_open_web_steel_300_lab_2026",
      "ubiq_fl28_open_web_steel_200_exact_lab_2026",
      "ubiq_fl28_open_web_steel_300_exact_lab_2026",
      "ubiq_fl28_open_web_steel_400_exact_lab_2026"
    ]);
  });

  it("keeps direct-to-joists timber tile ceilings on the Knauf family-general lane even when support form is explicit", () => {
    const result = derivePredictorPublishedFamilyEstimate({
      structuralSupportType: "timber_joists",
      supportForm: "joist_or_purlin",
      impactSystemType: "suspended_ceiling_only",
      floorCovering: {
        mode: "material_layer",
        materialClass: "ceramic_tile",
        thicknessMm: 10
      },
      lowerTreatment: {
        type: "direct_fixed_ceiling",
        supportClass: "direct_to_joists",
        boardMaterialClass: "firestop_board"
      }
    });

    expect(result?.kind).toBe("family_general");
    expect(result?.impact.basis).toBe("predictor_floor_system_family_general_estimate");
    expect(result?.impact.LnW).toBe(69.9);
    expect(result?.airborneRatings.Rw).toBe(51.8);
    expect(result?.airborneRatings.RwCtr).toBe(45.1);
    expect(result?.impact.estimateCandidateIds).toEqual([
      "knauf_ct30_1a_timber_lab_2026",
      "knauf_ct30_2a_timber_lab_2026",
      "knauf_ct30_1b_timber_lab_2026",
      "knauf_ct30_2b_timber_lab_2026"
    ]);
  });
});
