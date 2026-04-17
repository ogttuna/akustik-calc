import { describe, expect, it } from "vitest";

import type { ImpactPredictorInput, RequestedOutputId } from "@dynecho/shared";

import { calculateImpactOnly } from "./calculate-impact-only";

type PlannedScopeBenchmarkCase =
  | {
      expected: {
        deltaLwDb: number;
        lnwDb: number;
      };
      id: string;
      impactPredictorInput: ImpactPredictorInput;
      matchedCatalogCaseId: string;
      mode: "official_catalog_exact";
      source: string;
    }
  | {
      expected: {
        deltaLwDb: number;
        deltaLwLowerBoundDb: number;
        lnwDb: number;
        lnwUpperBoundDb: number;
      };
      id: string;
      impactPredictorInput: ImpactPredictorInput;
      matchedCatalogCaseId: string;
      mode: "formula_plus_lower_bound";
      source: string;
      tolerances: {
        deltaLwDb: number;
        lnwDb: number;
      };
    }
  | {
      expected: {
        deltaLwDb: number;
        lnwDb: number;
      };
      id: string;
      impactPredictorInput: ImpactPredictorInput;
      matchedCatalogCaseId: string;
      mode: "product_delta_official";
      source: string;
    };

const PLANNED_SCOPE_HEAVY_FLOOR_CASES: readonly PlannedScopeBenchmarkCase[] = [
  {
    id: "regupol_curve8_exact_catalog",
    matchedCatalogCaseId: "regupol_sonus_curve_8_tile_match_2026",
    mode: "official_catalog_exact",
    source:
      "https://acoustics.regupol.com/fileadmin/user_upload/acoustics/products/documents/technical_data/en/regupol_sonus_curve/regupol_sonus_curve_8/REGUPOL_sonus_curve_8_-_TD-en_072024.pdf",
    impactPredictorInput: {
      structuralSupportType: "reinforced_concrete",
      impactSystemType: "heavy_floating_floor",
      referenceFloorType: "heavy_standard",
      baseSlab: {
        materialClass: "heavy_concrete",
        thicknessMm: 150,
        densityKgM3: 2400
      },
      resilientLayer: {
        productId: "regupol_sonus_curve_8",
        thicknessMm: 8,
        dynamicStiffnessMNm3: 30
      },
      floatingScreed: {
        materialClass: "generic_screed",
        thicknessMm: 30,
        densityKgM3: 2000
      },
      floorCovering: {
        mode: "material_layer",
        materialClass: "ceramic_tile",
        thicknessMm: 8,
        densityKgM3: 2000
      }
    },
    expected: {
      lnwDb: 50,
      deltaLwDb: 26
    }
  },
  {
    id: "regupol_multi45_tile_exact_catalog",
    matchedCatalogCaseId: "regupol_sonus_multi_45_tile_match_2026",
    mode: "official_catalog_exact",
    source:
      "https://acoustics.regupol.com/fileadmin/user_upload/acoustics/products/documents/technical_data/en/regupol_sonus_multi/regupol_sonus_multi_4-5/REGUPOL_sonus_multi_4.5_-_TD-en_092024.pdf",
    impactPredictorInput: {
      structuralSupportType: "reinforced_concrete",
      impactSystemType: "heavy_floating_floor",
      referenceFloorType: "heavy_standard",
      baseSlab: {
        materialClass: "heavy_concrete",
        thicknessMm: 150,
        densityKgM3: 2400
      },
      resilientLayer: {
        productId: "regupol_sonus_multi_4_5",
        thicknessMm: 4.5
      },
      floatingScreed: {
        materialClass: "generic_screed",
        thicknessMm: 30,
        densityKgM3: 2000
      },
      floorCovering: {
        mode: "material_layer",
        materialClass: "ceramic_tile",
        thicknessMm: 8,
        densityKgM3: 2200
      }
    },
    expected: {
      lnwDb: 60,
      deltaLwDb: 19
    }
  },
  {
    id: "regupol_multi45_porcelain_exact_catalog",
    matchedCatalogCaseId: "regupol_sonus_multi_45_porcelain_match_2026",
    mode: "official_catalog_exact",
    source:
      "https://acoustics.regupol.com/fileadmin/user_upload/acoustics/products/documents/technical_data/en/regupol_sonus_multi/regupol_sonus_multi_4-5/REGUPOL_sonus_multi_4.5_-_TD-en_092024.pdf",
    impactPredictorInput: {
      structuralSupportType: "reinforced_concrete",
      impactSystemType: "heavy_floating_floor",
      referenceFloorType: "heavy_standard",
      baseSlab: {
        materialClass: "heavy_concrete",
        thicknessMm: 150,
        densityKgM3: 2400
      },
      resilientLayer: {
        productId: "regupol_sonus_multi_4_5",
        thicknessMm: 4.5
      },
      floorCovering: {
        mode: "material_layer",
        materialClass: "porcelain_tile",
        thicknessMm: 10,
        densityKgM3: 2300
      }
    },
    expected: {
      lnwDb: 61,
      deltaLwDb: 17
    }
  },
  {
    id: "regupol_curve8_lower_bound_plus_formula",
    matchedCatalogCaseId: "regupol_sonus_curve_8_wet_screed_lower_bound_2026",
    mode: "formula_plus_lower_bound",
    source:
      "https://acoustics.regupol.com/fileadmin/user_upload/acoustics/products/documents/technical_data/en/regupol_sonus_curve/regupol_sonus_curve_8/REGUPOL_sonus_curve_8_-_TD-en_072024.pdf",
    impactPredictorInput: {
      structuralSupportType: "reinforced_concrete",
      impactSystemType: "heavy_floating_floor",
      referenceFloorType: "heavy_standard",
      baseSlab: {
        materialClass: "heavy_concrete",
        thicknessMm: 140,
        densityKgM3: 2400
      },
      resilientLayer: {
        productId: "regupol_sonus_curve_8",
        thicknessMm: 8,
        dynamicStiffnessMNm3: 30
      },
      floatingScreed: {
        materialClass: "generic_screed",
        thicknessMm: 70,
        densityKgM3: 2000
      },
      floorCovering: {
        mode: "none"
      }
    },
    expected: {
      lnwDb: 47.9,
      deltaLwDb: 27.7,
      lnwUpperBoundDb: 56,
      deltaLwLowerBoundDb: 22
    },
    tolerances: {
      lnwDb: 0.2,
      deltaLwDb: 0.2
    }
  },
  ...(["21", "23", "26", "29", "33", "35"] as const).map((suffix) => {
    const deltaLwDb = Number(suffix);
    return {
      id: `getzner_afm${suffix}_catalog_product_delta`,
      matchedCatalogCaseId: `getzner_afm${suffix}_catalog_2026`,
      mode: "product_delta_official" as const,
      source: "https://www.getzner.com/media/9347/download/hb-022_abk-020.pdf?v=5",
      impactPredictorInput: {
        structuralSupportType: "reinforced_concrete",
        impactSystemType: "heavy_floating_floor",
        referenceFloorType: "heavy_standard",
        baseSlab: {
          materialClass: "heavy_concrete",
          thicknessMm: 140,
          densityKgM3: 2400
        },
        resilientLayer: {
          productId: `getzner_afm_${suffix}`,
          thicknessMm: 10
        },
        floorCovering: {
          mode: "delta_lw_catalog"
        }
      } satisfies ImpactPredictorInput,
      expected: {
        deltaLwDb,
        lnwDb: 78 - deltaLwDb
      }
    };
  })
];

type ReinforcedConcreteFamilyLaneCase = {
  expected: {
    basis: string;
    candidateIds: readonly string[];
    implementedFamilyEstimate: boolean;
    implementedFormulaEstimate: boolean;
    implementedLowConfidenceEstimate: boolean;
    kind: "family_archetype" | "family_general" | "low_confidence";
    lnwDb: number;
    rwCtrDb: number | null;
    rwDb: number;
    supportedTargetOutputs: readonly RequestedOutputId[];
    unsupportedTargetOutputs: readonly RequestedOutputId[];
  };
  id: string;
  impactPredictorInput: ImpactPredictorInput;
  targetOutputs: readonly RequestedOutputId[];
};

type ReinforcedConcreteBlockedParityCase = {
  expected: {
    basis: string;
    implementedFamilyEstimate: boolean;
    implementedFormulaEstimate: boolean;
    implementedLowConfidenceEstimate: boolean;
    kind: null;
    lnwDb: number;
    supportedTargetOutputs: readonly RequestedOutputId[];
    unsupportedTargetOutputs: readonly RequestedOutputId[];
  };
  id: string;
  impactPredictorInput: ImpactPredictorInput;
  targetOutputs: readonly RequestedOutputId[];
};

const REINFORCED_CONCRETE_FAMILY_LANE_CASES: readonly ReinforcedConcreteFamilyLaneCase[] = [
  {
    id: "published_upper_treatment_predictor_family_general",
    impactPredictorInput: {
      structuralSupportType: "reinforced_concrete",
      impactSystemType: "heavy_floating_floor",
      referenceFloorType: "heavy_standard",
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
        thicknessMm: 30,
        densityKgM3: 2000
      },
      floorCovering: {
        mode: "material_layer",
        materialClass: "ceramic_tile",
        thicknessMm: 8,
        densityKgM3: 2000
      }
    },
    targetOutputs: ["Ln,w", "Rw", "Ctr"],
    expected: {
      basis: "predictor_heavy_concrete_published_upper_treatment_estimate",
      candidateIds: ["regupol_curve8_concrete_tile_lab_2026"],
      implementedFamilyEstimate: true,
      implementedFormulaEstimate: true,
      implementedLowConfidenceEstimate: false,
      kind: "family_general",
      lnwDb: 50,
      rwCtrDb: -6.7,
      rwDb: 58,
      supportedTargetOutputs: ["Ln,w", "Rw", "Ctr"],
      unsupportedTargetOutputs: []
    }
  },
  {
    id: "knauf_concrete_carpet_archetype",
    impactPredictorInput: {
      structuralSupportType: "reinforced_concrete",
      impactSystemType: "combined_upper_lower_system",
      baseSlab: {
        materialClass: "heavy_concrete",
        thicknessMm: 165,
        densityKgM3: 2400
      },
      floorCovering: {
        mode: "material_layer",
        materialClass: "carpet_with_foam_underlay",
        thicknessMm: 11,
        densityKgM3: 320
      },
      lowerTreatment: {
        type: "suspended_ceiling_elastic_hanger",
        cavityDepthMm: 110,
        cavityFillThicknessMm: 60,
        boardLayerCount: 2,
        boardThicknessMm: 13,
        boardMaterialClass: "firestop_board"
      }
    },
    targetOutputs: ["Ln,w", "Rw", "Ctr", "DeltaLw"],
    expected: {
      basis: "predictor_floor_system_family_archetype_estimate",
      candidateIds: ["knauf_cc60_1a_concrete150_carpet_lab_2026"],
      implementedFamilyEstimate: true,
      implementedFormulaEstimate: false,
      implementedLowConfidenceEstimate: false,
      kind: "family_archetype",
      lnwDb: 31,
      rwCtrDb: 57,
      rwDb: 63,
      supportedTargetOutputs: ["Ln,w", "Rw", "Ctr"],
      unsupportedTargetOutputs: ["DeltaLw"]
    }
  },
  {
    id: "knauf_concrete_timber_underlay_archetype",
    impactPredictorInput: {
      structuralSupportType: "reinforced_concrete",
      impactSystemType: "combined_upper_lower_system",
      baseSlab: {
        materialClass: "heavy_concrete",
        thicknessMm: 165,
        densityKgM3: 2400
      },
      floorCovering: {
        mode: "material_layer",
        materialClass: "engineered_timber_with_acoustic_underlay",
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
    },
    targetOutputs: ["Ln,w", "Rw", "Ctr"],
    expected: {
      basis: "predictor_floor_system_family_archetype_estimate",
      candidateIds: ["knauf_cc60_1a_concrete150_timber_acoustic_underlay_lab_2026"],
      implementedFamilyEstimate: true,
      implementedFormulaEstimate: false,
      implementedLowConfidenceEstimate: false,
      kind: "family_archetype",
      lnwDb: 51,
      rwCtrDb: 57,
      rwDb: 63,
      supportedTargetOutputs: ["Ln,w", "Rw", "Ctr"],
      unsupportedTargetOutputs: []
    }
  },
  {
    id: "knauf_concrete_timber_underlay_fire_board_alias_archetype",
    impactPredictorInput: {
      structuralSupportType: "reinforced_concrete",
      impactSystemType: "combined_upper_lower_system",
      baseSlab: {
        materialClass: "heavy_concrete",
        thicknessMm: 165,
        densityKgM3: 2400
      },
      floorCovering: {
        mode: "material_layer",
        materialClass: "engineered_timber_with_acoustic_underlay",
        thicknessMm: 18,
        densityKgM3: 900
      },
      lowerTreatment: {
        type: "suspended_ceiling_elastic_hanger",
        cavityDepthMm: 110,
        cavityFillThicknessMm: 60,
        boardLayerCount: 2,
        boardThicknessMm: 13,
        boardMaterialClass: "fire_board"
      }
    },
    targetOutputs: ["Ln,w", "Rw", "Ctr"],
    expected: {
      basis: "predictor_floor_system_family_archetype_estimate",
      candidateIds: ["knauf_cc60_1a_concrete150_timber_acoustic_underlay_lab_2026"],
      implementedFamilyEstimate: true,
      implementedFormulaEstimate: false,
      implementedLowConfidenceEstimate: false,
      kind: "family_archetype",
      lnwDb: 51,
      rwCtrDb: 57,
      rwDb: 63,
      supportedTargetOutputs: ["Ln,w", "Rw", "Ctr"],
      unsupportedTargetOutputs: []
    }
  },
  {
    id: "knauf_concrete_timber_underlay_split_cover_alias_archetype",
    impactPredictorInput: {
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
    },
    targetOutputs: ["Ln,w", "Rw", "Ctr"],
    expected: {
      basis: "predictor_floor_system_family_archetype_estimate",
      candidateIds: ["knauf_cc60_1a_concrete150_timber_acoustic_underlay_lab_2026"],
      implementedFamilyEstimate: true,
      implementedFormulaEstimate: false,
      implementedLowConfidenceEstimate: false,
      kind: "family_archetype",
      lnwDb: 51,
      rwCtrDb: 57,
      rwDb: 63,
      supportedTargetOutputs: ["Ln,w", "Rw", "Ctr"],
      unsupportedTargetOutputs: []
    }
  },
  {
    id: "knauf_concrete_tile_ceiling_archetype",
    impactPredictorInput: {
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
        boardMaterialClass: "firestop_board",
        supportClass: "furred_channels"
      }
    },
    targetOutputs: ["Ln,w", "Rw", "Ctr"],
    expected: {
      basis: "predictor_floor_system_family_archetype_estimate",
      candidateIds: ["knauf_cc60_1b_concrete200_tile_acoustic_underlay_lab_2026"],
      implementedFamilyEstimate: true,
      implementedFormulaEstimate: false,
      implementedLowConfidenceEstimate: false,
      kind: "family_archetype",
      lnwDb: 45,
      rwCtrDb: 64,
      rwDb: 69,
      supportedTargetOutputs: ["Ln,w", "Rw", "Ctr"],
      unsupportedTargetOutputs: []
    }
  },
  {
    id: "knauf_concrete_tile_ceiling_fire_board_alias_archetype",
    impactPredictorInput: {
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
    },
    targetOutputs: ["Ln,w", "Rw", "Ctr"],
    expected: {
      basis: "predictor_floor_system_family_archetype_estimate",
      candidateIds: ["knauf_cc60_1b_concrete200_tile_acoustic_underlay_lab_2026"],
      implementedFamilyEstimate: true,
      implementedFormulaEstimate: false,
      implementedLowConfidenceEstimate: false,
      kind: "family_archetype",
      lnwDb: 45,
      rwCtrDb: 64,
      rwDb: 69,
      supportedTargetOutputs: ["Ln,w", "Rw", "Ctr"],
      unsupportedTargetOutputs: []
    }
  },
  {
    id: "knauf_concrete_tile_underlay_combined_archetype",
    impactPredictorInput: {
      structuralSupportType: "reinforced_concrete",
      impactSystemType: "combined_upper_lower_system",
      baseSlab: {
        materialClass: "heavy_concrete",
        thicknessMm: 205,
        densityKgM3: 2400
      },
      resilientLayer: {
        thicknessMm: 5
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
        boardMaterialClass: "firestop_board",
        supportClass: "furred_channels"
      }
    },
    targetOutputs: ["Ln,w", "Rw", "Ctr", "DeltaLw"],
    expected: {
      basis: "predictor_floor_system_family_archetype_estimate",
      candidateIds: ["knauf_cc60_1b_concrete200_tile_acoustic_underlay_lab_2026"],
      implementedFamilyEstimate: true,
      implementedFormulaEstimate: false,
      implementedLowConfidenceEstimate: false,
      kind: "family_archetype",
      lnwDb: 45,
      rwCtrDb: 64,
      rwDb: 69,
      supportedTargetOutputs: ["Ln,w", "Rw", "Ctr"],
      unsupportedTargetOutputs: ["DeltaLw"]
    }
  },
  {
    id: "knauf_concrete_tile_underlay_fire_board_alias_combined_archetype",
    impactPredictorInput: {
      structuralSupportType: "reinforced_concrete",
      impactSystemType: "combined_upper_lower_system",
      baseSlab: {
        materialClass: "heavy_concrete",
        thicknessMm: 205,
        densityKgM3: 2400
      },
      resilientLayer: {
        thicknessMm: 5
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
    },
    targetOutputs: ["Ln,w", "Rw", "Ctr", "DeltaLw"],
    expected: {
      basis: "predictor_floor_system_family_archetype_estimate",
      candidateIds: ["knauf_cc60_1b_concrete200_tile_acoustic_underlay_lab_2026"],
      implementedFamilyEstimate: true,
      implementedFormulaEstimate: false,
      implementedLowConfidenceEstimate: false,
      kind: "family_archetype",
      lnwDb: 45,
      rwCtrDb: 64,
      rwDb: 69,
      supportedTargetOutputs: ["Ln,w", "Rw", "Ctr"],
      unsupportedTargetOutputs: ["DeltaLw"]
    }
  },
  {
    id: "concrete_combined_vinyl_elastic_ceiling_low_confidence",
    impactPredictorInput: {
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
    },
    targetOutputs: ["Ln,w", "Rw", "Ctr"],
    expected: {
      basis: "predictor_floor_system_low_confidence_estimate",
      candidateIds: [
        "euracoustics_f2_elastic_ceiling_concrete_lab_2026",
        "euracoustics_f1_rigid_ceiling_concrete_lab_2026",
        "knauf_cc60_1a_concrete150_timber_acoustic_underlay_lab_2026"
      ],
      implementedFamilyEstimate: true,
      implementedFormulaEstimate: false,
      implementedLowConfidenceEstimate: true,
      kind: "low_confidence",
      lnwDb: 50,
      rwCtrDb: 57,
      rwDb: 65.9,
      supportedTargetOutputs: ["Ln,w", "Rw", "Ctr"],
      unsupportedTargetOutputs: []
    }
  },
  {
    id: "published_upper_treatment_combined_wet_elastic_ceiling_family_general",
    impactPredictorInput: {
      structuralSupportType: "reinforced_concrete",
      impactSystemType: "combined_upper_lower_system",
      referenceFloorType: "heavy_standard",
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
    },
    targetOutputs: ["Ln,w", "DeltaLw", "Rw"],
    expected: {
      basis: "predictor_heavy_concrete_published_upper_treatment_estimate",
      candidateIds: ["euracoustics_f2_elastic_ceiling_concrete_lab_2026"],
      implementedFamilyEstimate: true,
      implementedFormulaEstimate: true,
      implementedLowConfidenceEstimate: false,
      kind: "family_general",
      lnwDb: 43,
      rwCtrDb: null,
      rwDb: 77,
      supportedTargetOutputs: ["Ln,w", "DeltaLw", "Rw"],
      unsupportedTargetOutputs: []
    }
  },
  {
    id: "published_upper_treatment_combined_wet_rigid_gypsum_ceiling_family_general",
    impactPredictorInput: {
      structuralSupportType: "reinforced_concrete",
      impactSystemType: "combined_upper_lower_system",
      referenceFloorType: "heavy_standard",
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
    },
    targetOutputs: ["Ln,w", "Rw", "Ctr", "DeltaLw"],
    expected: {
      basis: "predictor_heavy_concrete_published_upper_treatment_estimate",
      candidateIds: [
        "euracoustics_f1_rigid_ceiling_concrete_lab_2026",
        "euracoustics_f2_elastic_ceiling_concrete_lab_2026",
        "knauf_cc60_1a_concrete150_timber_acoustic_underlay_lab_2026"
      ],
      implementedFamilyEstimate: true,
      implementedFormulaEstimate: true,
      implementedLowConfidenceEstimate: false,
      kind: "family_general",
      lnwDb: 51.5,
      rwCtrDb: 57,
      rwDb: 70,
      supportedTargetOutputs: ["Ln,w", "Rw", "Ctr", "DeltaLw"],
      unsupportedTargetOutputs: []
    }
  }
];

const REINFORCED_CONCRETE_BLOCKED_PARITY_CASES: readonly ReinforcedConcreteBlockedParityCase[] = [
  {
    id: "concrete_carpet_plus_generic_underlay_stays_unproven",
    impactPredictorInput: {
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
        materialClass: "carpet_with_foam_underlay",
        thicknessMm: 11,
        densityKgM3: 320
      },
      lowerTreatment: {
        type: "suspended_ceiling_elastic_hanger",
        cavityDepthMm: 110,
        cavityFillThicknessMm: 60,
        boardLayerCount: 2,
        boardThicknessMm: 13,
        boardMaterialClass: "firestop_board"
      }
    },
    targetOutputs: ["Ln,w", "Rw", "Ctr", "DeltaLw"],
    expected: {
      basis: "predictor_heavy_bare_floor_iso12354_annexc_estimate",
      implementedFamilyEstimate: false,
      implementedFormulaEstimate: true,
      implementedLowConfidenceEstimate: false,
      kind: null,
      lnwDb: 72,
      supportedTargetOutputs: ["Ln,w"],
      unsupportedTargetOutputs: ["Rw", "Ctr", "DeltaLw"]
    }
  }
];

function numberOrNull(value: number | null | undefined): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

describe("impact heavy-floor planned-scope benchmark", () => {
  it("stays well-formed and official-source-backed", () => {
    const ids = new Set<string>();

    expect(PLANNED_SCOPE_HEAVY_FLOOR_CASES).toHaveLength(10);

    for (const entry of PLANNED_SCOPE_HEAVY_FLOOR_CASES) {
      expect(ids.has(entry.id)).toBe(false);
      ids.add(entry.id);
      expect(String(entry.source)).toMatch(/^https:\/\//);
      expect([
        "official_catalog_exact",
        "formula_plus_lower_bound",
        "product_delta_official"
      ]).toContain(entry.mode);
    }
  });

  it("keeps the planned-scope heavy-floor corridor inside exact and tolerated bounds", () => {
    const errors: string[] = [];

    for (const entry of PLANNED_SCOPE_HEAVY_FLOOR_CASES) {
      const result = calculateImpactOnly([], {
        impactPredictorInput: entry.impactPredictorInput,
        targetOutputs: ["Ln,w", "DeltaLw"]
      });

      const impact = result.impact;
      const lowerBound = result.lowerBoundImpact;
      const lnw = numberOrNull(impact?.LnW);
      const deltaLw = numberOrNull(impact?.DeltaLw);

      if (result.impactPredictorStatus?.matchedCatalogCaseId !== entry.matchedCatalogCaseId) {
        errors.push(
          `${entry.id}: expected catalog match ${entry.matchedCatalogCaseId}, got ${result.impactPredictorStatus?.matchedCatalogCaseId ?? "null"}`
        );
      }

      if (entry.mode === "official_catalog_exact") {
        if (impact?.basis !== "predictor_catalog_exact_match_official") {
          errors.push(`${entry.id}: expected exact official catalog basis, got ${impact?.basis ?? "null"}`);
        }

        if (lnw !== entry.expected.lnwDb) {
          errors.push(`${entry.id}: expected Ln,w ${entry.expected.lnwDb}, got ${lnw}`);
        }

        if (deltaLw !== entry.expected.deltaLwDb) {
          errors.push(`${entry.id}: expected DeltaLw ${entry.expected.deltaLwDb}, got ${deltaLw}`);
        }
      } else if (entry.mode === "formula_plus_lower_bound") {
        if (impact?.basis !== "predictor_heavy_floating_floor_iso12354_annexc_estimate") {
          errors.push(`${entry.id}: expected heavy-floor formula basis, got ${impact?.basis ?? "null"}`);
        }

        if (
          lnw === null ||
          Math.abs(lnw - entry.expected.lnwDb) > entry.tolerances.lnwDb
        ) {
          errors.push(
            `${entry.id}: Ln,w error ${lnw === null ? "null" : Math.abs(lnw - entry.expected.lnwDb).toFixed(2)} dB exceeds tolerance ${entry.tolerances.lnwDb}`
          );
        }

        if (
          deltaLw === null ||
          Math.abs(deltaLw - entry.expected.deltaLwDb) > entry.tolerances.deltaLwDb
        ) {
          errors.push(
            `${entry.id}: DeltaLw error ${deltaLw === null ? "null" : Math.abs(deltaLw - entry.expected.deltaLwDb).toFixed(2)} dB exceeds tolerance ${entry.tolerances.deltaLwDb}`
          );
        }

        if (numberOrNull(lowerBound?.LnWUpperBound) !== entry.expected.lnwUpperBoundDb) {
          errors.push(
            `${entry.id}: expected Ln,w upper bound ${entry.expected.lnwUpperBoundDb}, got ${numberOrNull(lowerBound?.LnWUpperBound)}`
          );
        }

        if (numberOrNull(lowerBound?.DeltaLwLowerBound) !== entry.expected.deltaLwLowerBoundDb) {
          errors.push(
            `${entry.id}: expected DeltaLw lower bound ${entry.expected.deltaLwLowerBoundDb}, got ${numberOrNull(lowerBound?.DeltaLwLowerBound)}`
          );
        }
      } else if (entry.mode === "product_delta_official") {
        if (impact?.basis !== "predictor_catalog_product_delta_official") {
          errors.push(`${entry.id}: expected official product-delta basis, got ${impact?.basis ?? "null"}`);
        }

        if (lnw !== entry.expected.lnwDb) {
          errors.push(`${entry.id}: expected Ln,w ${entry.expected.lnwDb}, got ${lnw}`);
        }

        if (deltaLw !== entry.expected.deltaLwDb) {
          errors.push(`${entry.id}: expected DeltaLw ${entry.expected.deltaLwDb}, got ${deltaLw}`);
        }

        if (impact?.metricBasis?.DeltaLw !== "predictor_catalog_product_delta_official") {
          errors.push(`${entry.id}: expected official DeltaLw provenance, got ${impact?.metricBasis?.DeltaLw ?? "null"}`);
        }

        if (impact?.metricBasis?.LnW !== "predictor_catalog_product_delta_heavy_reference_derived") {
          errors.push(
            `${entry.id}: expected heavy-reference-derived Ln,w provenance, got ${impact?.metricBasis?.LnW ?? "null"}`
          );
        }
      }
    }

    expect(errors).toEqual([]);
  });

  it("keeps reinforced-concrete family lanes classified intentionally before widening", () => {
    const errors: string[] = [];

    for (const entry of REINFORCED_CONCRETE_FAMILY_LANE_CASES) {
      const result = calculateImpactOnly([], {
        impactPredictorInput: entry.impactPredictorInput,
        targetOutputs: [...entry.targetOutputs]
      });

      if (result.sourceMode !== "predictor_input") {
        errors.push(`${entry.id}: expected predictor_input source mode, got ${result.sourceMode}`);
      }

      if (result.floorSystemMatch !== null) {
        errors.push(`${entry.id}: expected no exact floor-system match`);
      }

      if (result.impact?.basis !== entry.expected.basis) {
        errors.push(`${entry.id}: expected impact basis ${entry.expected.basis}, got ${result.impact?.basis ?? "null"}`);
      }

      if ((result.floorSystemEstimate?.kind ?? null) !== entry.expected.kind) {
        errors.push(
          `${entry.id}: expected estimate kind ${entry.expected.kind}, got ${result.floorSystemEstimate?.kind ?? "null"}`
        );
      }

      if (numberOrNull(result.impact?.LnW) !== entry.expected.lnwDb) {
        errors.push(`${entry.id}: expected Ln,w ${entry.expected.lnwDb}, got ${numberOrNull(result.impact?.LnW)}`);
      }

      if (numberOrNull(result.floorSystemRatings?.Rw) !== entry.expected.rwDb) {
        errors.push(`${entry.id}: expected Rw ${entry.expected.rwDb}, got ${numberOrNull(result.floorSystemRatings?.Rw)}`);
      }

      if (numberOrNull(result.floorSystemRatings?.RwCtr) !== entry.expected.rwCtrDb) {
        errors.push(
          `${entry.id}: expected Ctr ${String(entry.expected.rwCtrDb)}, got ${String(numberOrNull(result.floorSystemRatings?.RwCtr))}`
        );
      }

      if (result.impact?.estimateCandidateIds?.join("|") !== entry.expected.candidateIds.join("|")) {
        errors.push(
          `${entry.id}: expected candidate ids ${entry.expected.candidateIds.join(", ")}, got ${result.impact?.estimateCandidateIds?.join(", ") ?? "null"}`
        );
      }

      if ((result.impactPredictorStatus?.implementedFamilyEstimate ?? false) !== entry.expected.implementedFamilyEstimate) {
        errors.push(
          `${entry.id}: expected implementedFamilyEstimate ${String(entry.expected.implementedFamilyEstimate)}, got ${String(result.impactPredictorStatus?.implementedFamilyEstimate ?? false)}`
        );
      }

      if ((result.impactPredictorStatus?.implementedFormulaEstimate ?? false) !== entry.expected.implementedFormulaEstimate) {
        errors.push(
          `${entry.id}: expected implementedFormulaEstimate ${String(entry.expected.implementedFormulaEstimate)}, got ${String(result.impactPredictorStatus?.implementedFormulaEstimate ?? false)}`
        );
      }

      if (
        (result.impactPredictorStatus?.implementedLowConfidenceEstimate ?? false) !==
        entry.expected.implementedLowConfidenceEstimate
      ) {
        errors.push(
          `${entry.id}: expected implementedLowConfidenceEstimate ${String(entry.expected.implementedLowConfidenceEstimate)}, got ${String(result.impactPredictorStatus?.implementedLowConfidenceEstimate ?? false)}`
        );
      }

      if (result.supportedTargetOutputs.join("|") !== entry.expected.supportedTargetOutputs.join("|")) {
        errors.push(
          `${entry.id}: expected supported outputs ${entry.expected.supportedTargetOutputs.join(", ")}, got ${result.supportedTargetOutputs.join(", ")}`
        );
      }

      if (result.unsupportedTargetOutputs.join("|") !== entry.expected.unsupportedTargetOutputs.join("|")) {
        errors.push(
          `${entry.id}: expected unsupported outputs ${entry.expected.unsupportedTargetOutputs.join(", ")}, got ${result.unsupportedTargetOutputs.join(", ")}`
        );
      }
    }

    expect(errors).toEqual([]);
  });

  it("keeps unproven reinforced-concrete parity candidates off defended family lanes", () => {
    const errors: string[] = [];

    for (const entry of REINFORCED_CONCRETE_BLOCKED_PARITY_CASES) {
      const result = calculateImpactOnly([], {
        impactPredictorInput: entry.impactPredictorInput,
        targetOutputs: [...entry.targetOutputs]
      });

      if (result.sourceMode !== "predictor_input") {
        errors.push(`${entry.id}: expected predictor_input source mode, got ${result.sourceMode}`);
      }

      if (result.impact?.basis !== entry.expected.basis) {
        errors.push(`${entry.id}: expected impact basis ${entry.expected.basis}, got ${result.impact?.basis ?? "null"}`);
      }

      if ((result.floorSystemEstimate?.kind ?? null) !== entry.expected.kind) {
        errors.push(
          `${entry.id}: expected estimate kind ${String(entry.expected.kind)}, got ${result.floorSystemEstimate?.kind ?? "null"}`
        );
      }

      if (numberOrNull(result.impact?.LnW) !== entry.expected.lnwDb) {
        errors.push(`${entry.id}: expected Ln,w ${entry.expected.lnwDb}, got ${numberOrNull(result.impact?.LnW)}`);
      }

      if ((result.impactPredictorStatus?.implementedFamilyEstimate ?? false) !== entry.expected.implementedFamilyEstimate) {
        errors.push(
          `${entry.id}: expected implementedFamilyEstimate ${String(entry.expected.implementedFamilyEstimate)}, got ${String(result.impactPredictorStatus?.implementedFamilyEstimate ?? false)}`
        );
      }

      if ((result.impactPredictorStatus?.implementedFormulaEstimate ?? false) !== entry.expected.implementedFormulaEstimate) {
        errors.push(
          `${entry.id}: expected implementedFormulaEstimate ${String(entry.expected.implementedFormulaEstimate)}, got ${String(result.impactPredictorStatus?.implementedFormulaEstimate ?? false)}`
        );
      }

      if (
        (result.impactPredictorStatus?.implementedLowConfidenceEstimate ?? false) !==
        entry.expected.implementedLowConfidenceEstimate
      ) {
        errors.push(
          `${entry.id}: expected implementedLowConfidenceEstimate ${String(entry.expected.implementedLowConfidenceEstimate)}, got ${String(result.impactPredictorStatus?.implementedLowConfidenceEstimate ?? false)}`
        );
      }

      if (result.supportedTargetOutputs.join("|") !== entry.expected.supportedTargetOutputs.join("|")) {
        errors.push(
          `${entry.id}: expected supported outputs ${entry.expected.supportedTargetOutputs.join(", ")}, got ${result.supportedTargetOutputs.join(", ")}`
        );
      }

      if (result.unsupportedTargetOutputs.join("|") !== entry.expected.unsupportedTargetOutputs.join("|")) {
        errors.push(
          `${entry.id}: expected unsupported outputs ${entry.expected.unsupportedTargetOutputs.join(", ")}, got ${result.unsupportedTargetOutputs.join(", ")}`
        );
      }
    }

    expect(errors).toEqual([]);
  });
});
