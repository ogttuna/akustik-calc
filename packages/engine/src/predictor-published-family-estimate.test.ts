import { describe, expect, it } from "vitest";

import {
  derivePredictorPublishedFamilyEstimate,
  PREDICTOR_PUBLISHED_FAMILY_RULES
} from "./predictor-published-family-estimate";

describe("derivePredictorPublishedFamilyEstimate", () => {
  it("keeps published-family rule ids and priorities stable", () => {
    expect(PREDICTOR_PUBLISHED_FAMILY_RULES.map((rule) => rule.id)).toEqual([
      "knauf_concrete_combined",
      "knauf_concrete_combined_tile",
      "knauf_concrete_suspended_tile",
      "concrete_combined_vinyl_elastic_ceiling",
      "pliteq_steel_joist_suspended_vinyl",
      "ubiq_open_web_suspended_vinyl",
      "open_box",
      "clt_bare",
      "clt_dry",
      "dataholz_clt_dry",
      "pliteq_hollow_core",
      "dataholz_timber_dry",
      "knauf_timber",
      "clt_wet",
      "dataholz_clt_wet_suspended",
      "steel_open_web_carpet"
    ]);
    expect(PREDICTOR_PUBLISHED_FAMILY_RULES.map((rule) => rule.priority)).toEqual([
      10, 20, 30, 40, 50, 60, 70, 75, 80, 90, 100, 110, 120, 130, 135, 140
    ]);
    expect(PREDICTOR_PUBLISHED_FAMILY_RULES.map((rule) => rule.implementationKind)).toEqual([
      "scored_candidates",
      "scored_candidates",
      "scored_candidates",
      "computed_metrics",
      "scored_candidates",
      "fixed_output",
      "fixed_output",
      "computed_metrics",
      "fixed_output",
      "fixed_output",
      "fixed_output",
      "fixed_output",
      "fixed_output",
      "fixed_output",
      "fixed_output",
      "fixed_output"
    ]);
  });

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

  it("withholds the open-box basic archetype when a non-dry upper package is present", () => {
    const result = derivePredictorPublishedFamilyEstimate({
      structuralSupportType: "open_box_timber",
      impactSystemType: "combined_upper_lower_system",
      baseSlab: {
        thicknessMm: 370
      },
      resilientLayer: {
        productId: "eps_underlay",
        thicknessMm: 3
      },
      upperFill: {
        materialClass: "eps_floor_insulation_board",
        thicknessMm: 50
      },
      floatingScreed: {
        materialClass: "generic_screed",
        thicknessMm: 40
      },
      floorCovering: {
        mode: "material_layer",
        materialClass: "laminate_flooring",
        thicknessMm: 8
      },
      lowerTreatment: {
        type: "suspended_ceiling_elastic_hanger",
        supportClass: "tuas_open_box_family_a",
        cavityDepthMm: 25,
        cavityFillThicknessMm: 100,
        boardLayerCount: 2,
        boardMaterialClass: "generic_gypsum_board",
        boardThicknessMm: 13
      }
    });

    expect(result).toBeNull();
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
      "euracoustics_f2_elastic_ceiling_concrete_lab_2026",
      "euracoustics_f1_rigid_ceiling_concrete_lab_2026",
      "knauf_cc60_1a_concrete150_timber_acoustic_underlay_lab_2026"
    ]);
  });

  it("keeps bare CLT predictor inputs on a conservative interpolation lane instead of outperforming the laminate anchors", () => {
    const result = derivePredictorPublishedFamilyEstimate({
      structuralSupportType: "mass_timber_clt",
      impactSystemType: "bare_floor",
      baseSlab: {
        thicknessMm: 140
      }
    });

    expect(result?.kind).toBe("family_general");
    expect(result?.impact.basis).toBe("predictor_mass_timber_clt_bare_interpolation_estimate");
    expect(result?.impact.LnW).toBe(64);
    expect(result?.impact.CI).toBe(0);
    expect(result?.impact.CI50_2500).toBe(0);
    expect(result?.impact.LnWPlusCI).toBe(64);
    expect(result?.airborneRatings.Rw).toBe(35);
    expect(result?.airborneRatings.RwCtr).toBe(34.2);
    expect(result?.impact.estimateCandidateIds).toEqual([
      "tuas_x2_clt140_measured_2026",
      "tuas_c2_clt260_measured_2026"
    ]);
  });

  it("keeps thin-finish CLT bare-floor predictor inputs on the TUAS interpolation anchors without the raw-slab penalty", () => {
    const result = derivePredictorPublishedFamilyEstimate({
      structuralSupportType: "mass_timber_clt",
      impactSystemType: "bare_floor",
      baseSlab: {
        thicknessMm: 180
      },
      resilientLayer: {
        thicknessMm: 3
      },
      floorCovering: {
        mode: "material_layer",
        materialClass: "laminate_flooring",
        thicknessMm: 8
      }
    });

    expect(result?.kind).toBe("family_general");
    expect(result?.impact.basis).toBe("predictor_mass_timber_clt_bare_interpolation_estimate");
    expect(result?.impact.LnW).toBe(59);
    expect(result?.impact.LnWPlusCI).toBe(59);
    expect(result?.airborneRatings.Rw).toBe(39.3);
    expect(result?.airborneRatings.RwCtr).toBe(38.7);
    expect(result?.impact.estimateCandidateIds).toEqual([
      "tuas_x2_clt140_measured_2026",
      "tuas_c2_clt260_measured_2026"
    ]);
  });

  it("keeps incomplete or out-of-band CLT laminate finishes off the TUAS bare interpolation lane", () => {
    const noUnderlay = derivePredictorPublishedFamilyEstimate({
      structuralSupportType: "mass_timber_clt",
      impactSystemType: "bare_floor",
      baseSlab: {
        thicknessMm: 180
      },
      floorCovering: {
        mode: "material_layer",
        materialClass: "laminate_flooring",
        thicknessMm: 8
      }
    });
    const thickLaminate = derivePredictorPublishedFamilyEstimate({
      structuralSupportType: "mass_timber_clt",
      impactSystemType: "bare_floor",
      baseSlab: {
        thicknessMm: 180
      },
      resilientLayer: {
        thicknessMm: 3
      },
      floorCovering: {
        mode: "material_layer",
        materialClass: "laminate_flooring",
        thicknessMm: 30
      }
    });

    expect(noUnderlay).toBeNull();
    expect(thickLaminate).toBeNull();
  });

  it("keeps malformed CLT dry finishes off the TUAS X5 dry interaction lane", () => {
    const thickLaminate = derivePredictorPublishedFamilyEstimate({
      structuralSupportType: "mass_timber_clt",
      impactSystemType: "dry_floating_floor",
      baseSlab: {
        thicknessMm: 140
      },
      upperFill: {
        materialClass: "generic_fill",
        thicknessMm: 50
      },
      floorCovering: {
        mode: "material_layer",
        materialClass: "laminate_flooring",
        thicknessMm: 30
      }
    });
    const thickUnderlay = derivePredictorPublishedFamilyEstimate({
      structuralSupportType: "mass_timber_clt",
      impactSystemType: "dry_floating_floor",
      baseSlab: {
        thicknessMm: 140
      },
      resilientLayer: {
        thicknessMm: 12
      },
      upperFill: {
        materialClass: "generic_fill",
        thicknessMm: 50
      },
      floorCovering: {
        mode: "material_layer",
        materialClass: "laminate_flooring",
        thicknessMm: 8
      }
    });
    const combinedThickLaminate = derivePredictorPublishedFamilyEstimate({
      structuralSupportType: "mass_timber_clt",
      impactSystemType: "combined_upper_lower_system",
      baseSlab: {
        thicknessMm: 260
      },
      resilientLayer: {
        thicknessMm: 3
      },
      upperFill: {
        materialClass: "generic_fill",
        thicknessMm: 50
      },
      floatingScreed: {
        materialClass: "dry_floating_gypsum_fiberboard",
        thicknessMm: 60
      },
      floorCovering: {
        mode: "material_layer",
        materialClass: "laminate_flooring",
        thicknessMm: 30
      },
      lowerTreatment: {
        type: "suspended_ceiling_rigid_hanger",
        cavityFillThicknessMm: 100,
        boardLayerCount: 2,
        boardThicknessMm: 13
      }
    });

    expect(thickLaminate).toBeNull();
    expect(thickUnderlay).toBeNull();
    expect(combinedThickLaminate).toBeNull();
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

  it("keeps open-box dry-floor predictor inputs on the stronger TUAS dry lane", () => {
    const result = derivePredictorPublishedFamilyEstimate({
      structuralSupportType: "open_box_timber",
      impactSystemType: "combined_upper_lower_system",
      baseSlab: {
        thicknessMm: 370
      },
      resilientLayer: {
        thicknessMm: 3,
        dynamicStiffnessMNm3: 64
      },
      upperFill: {
        materialClass: "generic_fill",
        thicknessMm: 50
      },
      floatingScreed: {
        materialClass: "dry_floating_gypsum_fiberboard",
        thicknessMm: 60
      },
      floorCovering: {
        mode: "material_layer",
        materialClass: "laminate_flooring",
        thicknessMm: 8
      },
      lowerTreatment: {
        type: "suspended_ceiling_elastic_hanger",
        cavityFillThicknessMm: 100,
        boardLayerCount: 2,
        boardThicknessMm: 13
      }
    });

    expect(result?.kind).toBe("family_archetype");
    expect(result?.impact.basis).toBe("predictor_floor_system_family_archetype_estimate");
    expect(result?.impact.LnW).toBe(44);
    expect(result?.impact.CI).toBe(0);
    expect(result?.impact.LnWPlusCI).toBe(44);
    expect(result?.airborneRatings.Rw).toBe(75);
    expect(result?.airborneRatings.RwCtr).toBe(71.87531170772152);
    expect(result?.impact.estimateCandidateIds).toEqual(["tuas_r5b_open_box_timber_measured_2026"]);
  });

  it("keeps open-box predictor inputs without the dry package on the weaker TUAS basic lane", () => {
    const result = derivePredictorPublishedFamilyEstimate({
      structuralSupportType: "open_box_timber",
      impactSystemType: "combined_upper_lower_system",
      baseSlab: {
        thicknessMm: 370
      },
      resilientLayer: {
        thicknessMm: 3
      },
      floorCovering: {
        mode: "material_layer",
        materialClass: "laminate_flooring",
        thicknessMm: 8
      },
      lowerTreatment: {
        type: "suspended_ceiling_elastic_hanger",
        cavityFillThicknessMm: 100,
        boardLayerCount: 2,
        boardThicknessMm: 13
      }
    });

    expect(result?.kind).toBe("family_archetype");
    expect(result?.impact.basis).toBe("predictor_floor_system_family_archetype_estimate");
    expect(result?.impact.LnW).toBe(46);
    expect(result?.impact.CI).toBe(1);
    expect(result?.impact.LnWPlusCI).toBe(47);
    expect(result?.airborneRatings.Rw).toBe(62);
    expect(result?.airborneRatings.RwCtr).toBe(59.973347663855776);
    expect(result?.impact.estimateCandidateIds).toEqual(["tuas_r2b_open_box_timber_measured_2026"]);
  });

  it("aligns open-box laminate finish tolerance with the exact source band", () => {
    const accepted = derivePredictorPublishedFamilyEstimate({
      structuralSupportType: "open_box_timber",
      impactSystemType: "combined_upper_lower_system",
      baseSlab: {
        thicknessMm: 370
      },
      resilientLayer: {
        thicknessMm: 3
      },
      floorCovering: {
        mode: "material_layer",
        materialClass: "laminate_flooring",
        thicknessMm: 10
      },
      lowerTreatment: {
        type: "suspended_ceiling_elastic_hanger",
        cavityFillThicknessMm: 100,
        boardLayerCount: 2,
        boardThicknessMm: 13
      }
    });
    const outsideBasic = derivePredictorPublishedFamilyEstimate({
      structuralSupportType: "open_box_timber",
      impactSystemType: "combined_upper_lower_system",
      baseSlab: {
        thicknessMm: 370
      },
      resilientLayer: {
        thicknessMm: 3
      },
      floorCovering: {
        mode: "material_layer",
        materialClass: "laminate_flooring",
        thicknessMm: 12
      },
      lowerTreatment: {
        type: "suspended_ceiling_elastic_hanger",
        cavityFillThicknessMm: 100,
        boardLayerCount: 2,
        boardThicknessMm: 13
      }
    });
    const outsideDry = derivePredictorPublishedFamilyEstimate({
      structuralSupportType: "open_box_timber",
      impactSystemType: "combined_upper_lower_system",
      baseSlab: {
        thicknessMm: 370
      },
      resilientLayer: {
        thicknessMm: 3
      },
      upperFill: {
        materialClass: "generic_fill",
        thicknessMm: 50
      },
      floatingScreed: {
        materialClass: "dry_floating_gypsum_fiberboard",
        thicknessMm: 60
      },
      floorCovering: {
        mode: "material_layer",
        materialClass: "laminate_flooring",
        thicknessMm: 12
      },
      lowerTreatment: {
        type: "suspended_ceiling_elastic_hanger",
        cavityFillThicknessMm: 100,
        boardLayerCount: 2,
        boardThicknessMm: 13
      }
    });

    expect(accepted?.impact.estimateCandidateIds).toEqual(["tuas_r2b_open_box_timber_measured_2026"]);
    expect(outsideBasic).toBeNull();
    expect(outsideDry).toBeNull();
  });

  it("keeps open-box predictor inputs off the published-family lane when the common gate is broken", () => {
    const result = derivePredictorPublishedFamilyEstimate({
      structuralSupportType: "open_box_timber",
      impactSystemType: "combined_upper_lower_system",
      baseSlab: {
        thicknessMm: 370
      },
      resilientLayer: {
        thicknessMm: 3
      },
      floorCovering: {
        mode: "material_layer",
        materialClass: "vinyl_flooring",
        thicknessMm: 3
      },
      lowerTreatment: {
        type: "suspended_ceiling_elastic_hanger",
        cavityFillThicknessMm: 100,
        boardLayerCount: 2,
        boardThicknessMm: 13
      }
    });

    expect(result).toBeNull();
  });

  it("keeps thin-underlay wet CLT suspended stacks on the new Dataholz suspended-family lane", () => {
    const result = derivePredictorPublishedFamilyEstimate({
      structuralSupportType: "mass_timber_clt",
      impactSystemType: "dry_floating_floor",
      baseSlab: {
        thicknessMm: 140
      },
      resilientLayer: {
        thicknessMm: 8
      },
      floatingScreed: {
        materialClass: "generic_screed",
        thicknessMm: 50
      },
      floorCovering: {
        mode: "material_layer",
        materialClass: "vinyl_flooring",
        thicknessMm: 4
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
    expect(result?.impact.basis).toBe("predictor_floor_system_family_general_estimate");
    expect(result?.impact.LnW).toBe(49.5);
    expect(result?.airborneRatings.Rw).toBe(61.5);
    expect(result?.airborneRatings.RwCtr).toBe(-7);
    expect(result?.impact.estimateCandidateIds).toEqual([
      "dataholz_gdmnxa02a_00_clt_lab_2026",
      "dataholz_gdmnxa02a_02_clt_lab_2026"
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
