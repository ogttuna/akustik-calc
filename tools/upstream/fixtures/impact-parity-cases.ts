import type {
  ExactImpactSource,
  ImpactFieldContext,
  ImpactPredictorInput,
  LayerInput
} from "@dynecho/shared";

type ImpactMetricKey =
  | "CI"
  | "CI50_2500"
  | "DeltaLw"
  | "LPrimeNW"
  | "LPrimeNT50"
  | "LPrimeNTw"
  | "LnW"
  | "LnWPlusCI";

type LowerBoundMetricKey =
  | "DeltaLwLowerBound"
  | "LPrimeNTwUpperBound"
  | "LPrimeNWUpperBound"
  | "LnWUpperBound";

type ImpactParityCase = {
  compare: {
    compareCatalogId?: boolean;
    compareFloorMetrics?: boolean;
    compareFloorSystemId?: boolean;
    compareImpactBasis?: boolean;
    compareImpactEstimateCandidateIds?: boolean;
    compareLowerBoundBasis?: boolean;
    impactMetrics?: readonly ImpactMetricKey[];
    lowerBoundMetrics?: readonly LowerBoundMetricKey[];
  };
  id: string;
  label: string;
  layers: LayerInput[];
  localOptions?: {
    exactImpactSource?: ExactImpactSource;
    impactFieldContext?: ImpactFieldContext;
    impactPredictorInput?: ImpactPredictorInput;
  };
  upstreamImpactPredictorInput: Record<string, unknown>;
  upstreamOptions?: {
    assemblyMeta?: Record<string, unknown>;
    countryProfile?: string;
    targetOutputs?: string[];
  };
};

export const IMPACT_PARITY_CASES: readonly ImpactParityCase[] = [
  {
    id: "regupol_exact_row",
    label: "REGUPOL exact product-system row",
    layers: [
      { floorRole: "floor_covering", materialId: "ceramic_tile", thicknessMm: 8 },
      { floorRole: "floating_screed", materialId: "screed", thicknessMm: 30 },
      { floorRole: "resilient_layer", materialId: "regupol_sonus_curve_8", thicknessMm: 8 },
      { floorRole: "base_structure", materialId: "concrete", thicknessMm: 150 }
    ],
    upstreamImpactPredictorInput: {
      impactSystemType: "heavy_floating_floor",
      referenceFloorType: "heavy_standard",
      baseSlab: { materialClass: "heavy_concrete", thicknessMm: 150, densityKgM3: 2400 },
      resilientLayer: { productId: "regupol_sonus_curve_8", thicknessMm: 8, dynamicStiffnessMNm3: 30 },
      floatingScreed: { materialClass: "generic_screed", thicknessMm: 30, densityKgM3: 2000 },
      floorCovering: { mode: "material_layer", materialClass: "ceramic_tile", thicknessMm: 8, densityKgM3: 2200 }
    },
    compare: {
      compareCatalogId: true,
      compareImpactBasis: true,
      impactMetrics: ["LnW", "DeltaLw"]
    }
  },
  {
    id: "regupol_wet_lower_bound",
    label: "REGUPOL lower-bound support + live heavy formula",
    layers: [
      { floorRole: "floating_screed", materialId: "screed", thicknessMm: 70 },
      { floorRole: "resilient_layer", materialId: "regupol_sonus_curve_8", thicknessMm: 8 },
      { floorRole: "base_structure", materialId: "concrete", thicknessMm: 140 }
    ],
    upstreamImpactPredictorInput: {
      impactSystemType: "heavy_floating_floor",
      referenceFloorType: "heavy_standard",
      baseSlab: { materialClass: "heavy_concrete", thicknessMm: 140, densityKgM3: 2400 },
      resilientLayer: { productId: "regupol_sonus_curve_8", thicknessMm: 8, dynamicStiffnessMNm3: 30 },
      floatingScreed: { materialClass: "generic_screed", thicknessMm: 70, densityKgM3: 2000 },
      floorCovering: { mode: "none" }
    },
    compare: {
      compareCatalogId: true,
      compareImpactBasis: true,
      compareLowerBoundBasis: true,
      impactMetrics: ["LnW", "DeltaLw"],
      lowerBoundMetrics: ["LnWUpperBound", "DeltaLwLowerBound"]
    }
  },
  {
    id: "getzner_afm33_delta",
    label: "Getzner AFM 33 official DeltaLw row",
    layers: [
      { floorRole: "floor_covering", materialId: "ceramic_tile", thicknessMm: 8 },
      { floorRole: "floating_screed", materialId: "screed", thicknessMm: 50 },
      { floorRole: "resilient_layer", materialId: "getzner_afm_33", thicknessMm: 8 },
      { floorRole: "base_structure", materialId: "concrete", thicknessMm: 150 }
    ],
    upstreamImpactPredictorInput: {
      impactSystemType: "heavy_floating_floor",
      referenceFloorType: "heavy_standard",
      baseSlab: { materialClass: "heavy_concrete", thicknessMm: 150, densityKgM3: 2400 },
      resilientLayer: { productId: "getzner_afm_33", thicknessMm: 8, dynamicStiffnessMNm3: 7 },
      floatingScreed: { materialClass: "generic_screed", thicknessMm: 50, densityKgM3: 2000 },
      floorCovering: { mode: "delta_lw_catalog", deltaLwDb: 33 }
    },
    compare: {
      compareCatalogId: true,
      compareImpactBasis: true,
      impactMetrics: ["LnW", "DeltaLw"]
    }
  },
  {
    id: "assembly_explicit_delta_heavy_reference",
    label: "Assembly route keeps explicit DeltaLw predictor input on the heavy-reference lane",
    layers: [
      { materialId: "gypsum_board", thicknessMm: 12.5 },
      { materialId: "air_gap", thicknessMm: 90 },
      { materialId: "rockwool", thicknessMm: 90 },
      { materialId: "gypsum_board", thicknessMm: 12.5 }
    ],
    localOptions: {
      impactPredictorInput: {
        structuralSupportType: "reinforced_concrete",
        impactSystemType: "heavy_floating_floor",
        referenceFloorType: "heavy_standard",
        baseSlab: { materialClass: "heavy_concrete", thicknessMm: 140, densityKgM3: 2400 },
        resilientLayer: { thicknessMm: 10, dynamicStiffnessMNm3: 20 },
        floatingScreed: { materialClass: "generic_screed", thicknessMm: 50, densityKgM3: 2000 },
        floorCovering: { mode: "delta_lw_catalog", deltaLwDb: 26 }
      }
    },
    upstreamImpactPredictorInput: {
      structuralSupportType: "reinforced_concrete",
      impactSystemType: "heavy_floating_floor",
      referenceFloorType: "heavy_standard",
      baseSlab: { materialClass: "heavy_concrete", thicknessMm: 140, densityKgM3: 2400 },
      resilientLayer: { thicknessMm: 10, dynamicStiffnessMNm3: 20 },
      floatingScreed: { materialClass: "generic_screed", thicknessMm: 50, densityKgM3: 2000 },
      floorCovering: { mode: "delta_lw_catalog", deltaLwDb: 26 }
    },
    upstreamOptions: {
      targetOutputs: ["Ln,w", "DeltaLw"]
    },
    compare: {
      compareFloorMetrics: true,
      compareImpactBasis: true,
      impactMetrics: ["LnW", "DeltaLw"]
    }
  },
  {
    id: "open_box_direct_flanking_family_inferred",
    label: "Open-box timber exact floor row infers direct+flanking family models",
    layers: [{ materialId: "concrete", thicknessMm: 140 }],
    localOptions: {
      impactFieldContext: {
        directPathOffsetDb: 1,
        flankingPaths: [
          {
            edgeIsolationClass: "rigid",
            id: "edge_path",
            junctionLengthM: 4,
            kijDb: 2,
            levelOffsetDb: -6,
            pathCount: 1,
            pathType: "edge",
            shortCircuitRisk: "high"
          }
        ]
      },
      impactPredictorInput: {
        officialFloorSystemId: "tuas_r5b_open_box_timber_measured_2026",
        structuralSupportType: "open_box_timber"
      }
    },
    upstreamImpactPredictorInput: {
      officialFloorSystemId: "tuas_r5b_open_box_timber_measured_2026",
      structuralSupportType: "open_box_timber"
    },
    upstreamOptions: {
      assemblyMeta: {
        contextMode: "field_between_rooms",
        impactDirectPathOffsetDb: 1,
        impactFlankingPaths: [
          {
            edgeIsolationClass: "rigid",
            id: "edge_path",
            junctionLengthM: 4,
            kijDb: 2,
            levelOffsetDb: -6,
            pathCount: 1,
            pathType: "edge",
            shortCircuitRisk: "high"
          }
        ]
      },
      targetOutputs: ["L'n,w"]
    },
    compare: {
      compareFloorMetrics: true,
      compareImpactBasis: true,
      impactMetrics: ["LPrimeNW"]
    }
  },
  {
    id: "open_box_guide_delta_before_k",
    label: "Open-box timber exact floor row applies ΔLd before K and standardization",
    layers: [{ materialId: "concrete", thicknessMm: 140 }],
    localOptions: {
      impactFieldContext: {
        fieldKDb: 2,
        lowerTreatmentReductionDb: 6,
        receivingRoomVolumeM3: 50
      },
      impactPredictorInput: {
        officialFloorSystemId: "tuas_r5b_open_box_timber_measured_2026",
        structuralSupportType: "open_box_timber"
      }
    },
    upstreamImpactPredictorInput: {
      officialFloorSystemId: "tuas_r5b_open_box_timber_measured_2026",
      structuralSupportType: "open_box_timber"
    },
    upstreamOptions: {
      assemblyMeta: {
        contextMode: "field_between_rooms",
        impactFieldKCorrectionDb: 2,
        impactLowerTreatmentReductionDb: 6,
        receivingRoomVolumeM3: 50
      },
      targetOutputs: ["L'n,w", "L'nT,w"]
    },
    compare: {
      compareFloorMetrics: true,
      compareImpactBasis: true,
      impactMetrics: ["LPrimeNW", "LPrimeNTw", "LPrimeNT50"]
    }
  },
  {
    id: "assembly_general_knauf_timber_ceramic",
    label: "Assembly route keeps Knauf timber ceramic topology on the published family blend",
    layers: [
      { materialId: "gypsum_board", thicknessMm: 12.5 },
      { materialId: "air_gap", thicknessMm: 90 },
      { materialId: "rockwool", thicknessMm: 90 },
      { materialId: "gypsum_board", thicknessMm: 12.5 }
    ],
    localOptions: {
      impactPredictorInput: {
        structuralSupportType: "timber_joists",
        impactSystemType: "suspended_ceiling_only",
        baseSlab: {
          thicknessMm: 240
        },
        floorCovering: {
          mode: "material_layer",
          materialClass: "ceramic_tile",
          thicknessMm: 8,
          densityKgM3: 2000
        },
        lowerTreatment: {
          type: "direct_fixed_ceiling",
          cavityFillThicknessMm: 90,
          boardLayerCount: 1,
          boardThicknessMm: 13,
          boardMaterialClass: "firestop_board",
          supportClass: "furred_channels"
        }
      }
    },
    upstreamImpactPredictorInput: {
      structuralSupportType: "timber_joists",
      impactSystemType: "suspended_ceiling_only",
      baseSlab: {
        thicknessMm: 240
      },
      floorCovering: {
        mode: "material_layer",
        materialClass: "ceramic_tile",
        thicknessMm: 8,
        densityKgM3: 2000
      },
      lowerTreatment: {
        type: "direct_fixed_ceiling",
        cavityFillThicknessMm: 90,
        boardLayerCount: 1,
        boardThicknessMm: 13,
        boardMaterialClass: "firestop_board",
        supportClass: "furred_channels"
      }
    },
    upstreamOptions: {
      targetOutputs: ["Ln,w"]
    },
    compare: {
      compareFloorMetrics: true,
      compareImpactBasis: true,
      compareImpactEstimateCandidateIds: true,
      impactMetrics: ["LnW"]
    }
  },
  {
    id: "assembly_general_ubiq_open_web_carpet",
    label: "Assembly route keeps open-web steel carpet topology on the published family blend",
    layers: [
      { materialId: "gypsum_board", thicknessMm: 12.5 },
      { materialId: "air_gap", thicknessMm: 90 },
      { materialId: "rockwool", thicknessMm: 90 },
      { materialId: "gypsum_board", thicknessMm: 12.5 }
    ],
    localOptions: {
      impactPredictorInput: {
        structuralSupportType: "steel_joists",
        supportForm: "open_web_or_rolled",
        impactSystemType: "combined_upper_lower_system",
        baseSlab: {
          thicknessMm: 300
        },
        floatingScreed: {
          thicknessMm: 19
        },
        floorCovering: {
          mode: "material_layer",
          materialClass: "carpet_with_foam_underlay",
          thicknessMm: 8
        },
        lowerTreatment: {
          type: "suspended_ceiling_elastic_hanger",
          cavityDepthMm: 65,
          cavityFillThicknessMm: 145,
          boardLayerCount: 3,
          boardThicknessMm: 16
        }
      }
    },
    upstreamImpactPredictorInput: {
      structuralSupportType: "steel_joists",
      supportForm: "open_web_or_rolled",
      impactSystemType: "combined_upper_lower_system",
      baseSlab: {
        thicknessMm: 300
      },
      floatingScreed: {
        thicknessMm: 19
      },
      floorCovering: {
        mode: "material_layer",
        materialClass: "carpet_with_foam_underlay",
        thicknessMm: 8
      },
      lowerTreatment: {
        type: "suspended_ceiling_elastic_hanger",
        cavityDepthMm: 65,
        cavityFillThicknessMm: 145,
        boardLayerCount: 3,
        boardThicknessMm: 16
      }
    },
    upstreamOptions: {
      targetOutputs: ["Ln,w", "CI", "Ln,w+CI"]
    },
    compare: {
      compareFloorMetrics: true,
      compareImpactBasis: true,
      compareImpactEstimateCandidateIds: true,
      impactMetrics: ["LnW", "CI", "LnWPlusCI"]
    }
  },
  {
    id: "ubiq_fl28_exact_300",
    label: "UBIQ FL-28 exact 300 mm open-web row",
    layers: [
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 145 },
      { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: 65 },
      { floorRole: "floor_covering", materialId: "engineered_timber_with_acoustic_underlay", thicknessMm: 20 },
      { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: 19 },
      { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 300 }
    ],
    upstreamImpactPredictorInput: {
      impactSystemType: "combined_upper_lower_system",
      structuralSupportType: "steel_joists",
      supportForm: "open_web_or_rolled",
      baseSlab: { thicknessMm: 300 },
      floatingScreed: { thicknessMm: 19 },
      floorCovering: {
        mode: "material_layer",
        materialClass: "engineered_timber_with_acoustic_underlay",
        thicknessMm: 20
      },
      lowerTreatment: {
        type: "suspended_ceiling_elastic_hanger",
        cavityDepthMm: 65,
        cavityFillThicknessMm: 145,
        boardLayerCount: 3,
        boardThicknessMm: 16
      }
    },
    compare: {
      compareFloorMetrics: true,
      compareFloorSystemId: true,
      compareImpactBasis: true,
      impactMetrics: ["LnW", "CI", "LnWPlusCI"]
    }
  },
  {
    id: "ubiq_fl28_interp_250",
    label: "UBIQ FL-28 interpolation at 250 mm",
    layers: [
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 145 },
      { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: 75 },
      { floorRole: "floor_covering", materialId: "engineered_timber_with_acoustic_underlay", thicknessMm: 20 },
      { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: 19 },
      { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 250 }
    ],
    upstreamImpactPredictorInput: {
      impactSystemType: "combined_upper_lower_system",
      structuralSupportType: "steel_joists",
      supportForm: "open_web_or_rolled",
      baseSlab: { thicknessMm: 250 },
      floatingScreed: { thicknessMm: 19 },
      floorCovering: {
        mode: "material_layer",
        materialClass: "engineered_timber_with_acoustic_underlay",
        thicknessMm: 20
      },
      lowerTreatment: {
        type: "suspended_ceiling_elastic_hanger",
        cavityDepthMm: 75,
        cavityFillThicknessMm: 145,
        boardLayerCount: 3,
        boardThicknessMm: 16
      }
    },
    compare: {
      compareFloorMetrics: true,
      compareImpactBasis: true,
      compareImpactEstimateCandidateIds: true,
      impactMetrics: ["LnW", "CI", "LnWPlusCI"]
    }
  },
  {
    id: "ubiq_fl33_bound_300",
    label: "UBIQ FL-33 exact bound-only row",
    layers: [
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: 65 },
      { floorRole: "floor_covering", materialId: "engineered_timber_with_acoustic_underlay", thicknessMm: 20 },
      { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: 19 },
      { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 300 }
    ],
    upstreamImpactPredictorInput: {
      impactSystemType: "combined_upper_lower_system",
      structuralSupportType: "steel_joists",
      supportForm: "open_web_or_rolled",
      officialFloorSystemId: "ubiq_fl33_open_web_steel_300_lab_2026",
      baseSlab: { materialClass: "steel_joists", thicknessMm: 300 },
      floatingScreed: { materialClass: "lightweight_dry_deck", thicknessMm: 19 },
      floorCovering: {
        mode: "material_layer",
        materialClass: "engineered_timber_with_acoustic_underlay",
        thicknessMm: 20
      },
      lowerTreatment: {
        type: "suspended_ceiling_elastic_hanger",
        boardLayerCount: 2,
        boardThicknessMm: 16,
        cavityDepthMm: 65,
        cavityFillThicknessMm: 0,
        boardMaterialClass: "fire_board"
      }
    },
    compare: {
      compareFloorMetrics: true,
      compareFloorSystemId: true,
      compareLowerBoundBasis: true,
      lowerBoundMetrics: ["LnWUpperBound"]
    }
  },
  {
    id: "ubiq_fl33_interp_250",
    label: "UBIQ FL-33 bound interpolation at 250 mm",
    layers: [
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: 65 },
      { floorRole: "floor_covering", materialId: "engineered_timber_with_acoustic_underlay", thicknessMm: 20 },
      { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: 19 },
      { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 250 }
    ],
    upstreamImpactPredictorInput: {
      impactSystemType: "combined_upper_lower_system",
      structuralSupportType: "steel_joists",
      supportForm: "open_web_or_rolled",
      baseSlab: { thicknessMm: 250 },
      floatingScreed: { thicknessMm: 19 },
      floorCovering: {
        mode: "material_layer",
        materialClass: "engineered_timber_with_acoustic_underlay",
        thicknessMm: 20
      },
      lowerTreatment: {
        type: "suspended_ceiling_elastic_hanger",
        cavityDepthMm: 65,
        cavityFillThicknessMm: 0,
        boardLayerCount: 2,
        boardThicknessMm: 16
      }
    },
    compare: {
      compareFloorMetrics: true,
      compareLowerBoundBasis: true,
      lowerBoundMetrics: ["LnWUpperBound"]
    }
  },
  {
    id: "ubiq_missing_support_bound_300",
    label: "UBIQ conservative missing-support-form crossover",
    layers: [
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: 65 },
      { floorRole: "floor_covering", materialId: "engineered_timber_with_acoustic_underlay", thicknessMm: 20 },
      { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: 19 },
      { floorRole: "base_structure", materialId: "lightweight_steel_floor", thicknessMm: 300 }
    ],
    upstreamImpactPredictorInput: {
      impactSystemType: "combined_upper_lower_system",
      structuralSupportType: "steel_joists",
      baseSlab: { thicknessMm: 300 },
      floatingScreed: { thicknessMm: 19 },
      floorCovering: {
        mode: "material_layer",
        materialClass: "engineered_timber_with_acoustic_underlay",
        thicknessMm: 20
      },
      lowerTreatment: {
        type: "suspended_ceiling_elastic_hanger",
        cavityDepthMm: 65,
        boardLayerCount: 2,
        boardThicknessMm: 16
      }
    },
    compare: {
      compareFloorMetrics: true,
      compareLowerBoundBasis: true,
      lowerBoundMetrics: ["LnWUpperBound"]
    }
  },
  {
    id: "regupol_wet_field_standardization",
    label: "REGUPOL wet lower-bound stack with field carry-over",
    layers: [
      { floorRole: "floating_screed", materialId: "screed", thicknessMm: 70 },
      { floorRole: "resilient_layer", materialId: "regupol_sonus_curve_8", thicknessMm: 8 },
      { floorRole: "base_structure", materialId: "concrete", thicknessMm: 140 }
    ],
    localOptions: {
      impactFieldContext: { fieldKDb: 2, receivingRoomVolumeM3: 50 }
    },
    upstreamImpactPredictorInput: {
      impactSystemType: "heavy_floating_floor",
      referenceFloorType: "heavy_standard",
      baseSlab: { materialClass: "heavy_concrete", thicknessMm: 140, densityKgM3: 2400 },
      resilientLayer: { productId: "regupol_sonus_curve_8", thicknessMm: 8, dynamicStiffnessMNm3: 30 },
      floatingScreed: { materialClass: "generic_screed", thicknessMm: 70, densityKgM3: 2000 },
      floorCovering: { mode: "none" }
    },
    upstreamOptions: {
      assemblyMeta: {
        contextMode: "field_between_rooms",
        impactFieldKCorrectionDb: 2,
        receivingRoomVolumeM3: 50
      },
      targetOutputs: ["L'n,w", "L'nT,w"]
    },
    compare: {
      impactMetrics: ["LPrimeNW", "LPrimeNTw"]
    }
  },
  {
    id: "tuas_clt140_field_standardization",
    label: "TUAS exact CLT family with field and standardized outputs",
    layers: [
      { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
      { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
      { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: 140 }
    ],
    localOptions: {
      impactFieldContext: { fieldKDb: 2, receivingRoomVolumeM3: 50 }
    },
    upstreamImpactPredictorInput: {
      officialFloorSystemId: "tuas_x2_clt140_measured_2026",
      structuralSupportType: "mass_timber_clt",
      impactSystemType: "combined_upper_lower_system",
      baseSlab: { thicknessMm: 140 },
      floorCovering: { mode: "material_layer", materialClass: "laminate_flooring", thicknessMm: 8 },
      resilientLayer: { thicknessMm: 3, dynamicStiffnessMNm3: 30 }
    },
    upstreamOptions: {
      assemblyMeta: {
        contextMode: "field_between_rooms",
        impactFieldKCorrectionDb: 2,
        receivingRoomVolumeM3: 50
      },
      targetOutputs: ["L'n,w", "L'nT,w", "L'nT,50"]
    },
    compare: {
      compareImpactBasis: true,
      impactMetrics: ["LPrimeNW", "LPrimeNTw", "LPrimeNT50"]
    }
  },
  {
    id: "ubiq_fl28_turkish_simple_guide",
    label: "UBIQ FL-28 exact row through Turkish simple-guide lookups",
    layers: [
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 145 },
      { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: 65 },
      { floorRole: "floor_covering", materialId: "engineered_timber_with_acoustic_underlay", thicknessMm: 20 },
      { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: 19 },
      { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 300 }
    ],
    localOptions: {
      impactFieldContext: {
        enableSmallRoomEstimate: true,
        guideMassRatio: 3.4,
        receivingRoomVolumeM3: 32
      }
    },
    upstreamImpactPredictorInput: {
      impactSystemType: "combined_upper_lower_system",
      structuralSupportType: "steel_joists",
      supportForm: "open_web_or_rolled",
      baseSlab: { thicknessMm: 300 },
      floatingScreed: { thicknessMm: 19 },
      floorCovering: {
        mode: "material_layer",
        materialClass: "engineered_timber_with_acoustic_underlay",
        thicknessMm: 20
      },
      lowerTreatment: {
        type: "suspended_ceiling_elastic_hanger",
        cavityDepthMm: 65,
        cavityFillThicknessMm: 145,
        boardLayerCount: 3,
        boardThicknessMm: 16
      }
    },
    upstreamOptions: {
      assemblyMeta: {
        guideImpactMassRatio: 3.4,
        receivingRoomVolumeM3: 32
      },
      countryProfile: "tr_guide_simple_method",
      targetOutputs: ["L'nT,50"]
    },
    compare: {
      compareImpactBasis: true,
      impactMetrics: ["LnW", "CI", "LnWPlusCI", "LPrimeNT50"]
    }
  },
  {
    id: "ubiq_fl33_bound_field_standardization",
    label: "UBIQ FL-33 bound-only row through conservative field carry-over",
    layers: [
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: 65 },
      { floorRole: "floor_covering", materialId: "engineered_timber_with_acoustic_underlay", thicknessMm: 20 },
      { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: 19 },
      { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 300 }
    ],
    localOptions: {
      impactFieldContext: { fieldKDb: 2, receivingRoomVolumeM3: 50 }
    },
    upstreamImpactPredictorInput: {
      impactSystemType: "combined_upper_lower_system",
      structuralSupportType: "steel_joists",
      supportForm: "open_web_or_rolled",
      officialFloorSystemId: "ubiq_fl33_open_web_steel_300_lab_2026",
      baseSlab: { materialClass: "steel_joists", thicknessMm: 300 },
      floatingScreed: { materialClass: "lightweight_dry_deck", thicknessMm: 19 },
      floorCovering: {
        mode: "material_layer",
        materialClass: "engineered_timber_with_acoustic_underlay",
        thicknessMm: 20
      },
      lowerTreatment: {
        type: "suspended_ceiling_elastic_hanger",
        boardLayerCount: 2,
        boardThicknessMm: 16,
        cavityDepthMm: 65
      }
    },
    upstreamOptions: {
      assemblyMeta: {
        contextMode: "field_between_rooms",
        impactFieldKCorrectionDb: 2,
        receivingRoomVolumeM3: 50
      },
      targetOutputs: ["L'n,w", "L'nT,w"]
    },
    compare: {
      lowerBoundMetrics: ["LnWUpperBound", "LPrimeNWUpperBound", "LPrimeNTwUpperBound"]
    }
  }
];

export type { ImpactMetricKey, ImpactParityCase, LowerBoundMetricKey };
