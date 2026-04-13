import type { ExactImpactSource, ImpactFieldContext, ImpactPredictorInput, LayerInput } from "@dynecho/shared";

type VisibleLayerParityInput = LayerInput & {
  category?: string;
  density?: number;
  materialName?: string;
};

type ImpactOnlyMetricKey =
  | "CI"
  | "CI50_2500"
  | "DeltaLw"
  | "LPrimeNT50"
  | "LPrimeNTw"
  | "LPrimeNW"
  | "LnW"
  | "LnWPlusCI";

type ImpactOnlyLowerBoundMetricKey =
  | "DeltaLwLowerBound"
  | "LPrimeNTwUpperBound"
  | "LPrimeNWUpperBound"
  | "LnWUpperBound";

export type ImpactOnlyParityCase = {
  compare: {
    acceptedLocalDivergences?: readonly {
      metrics: readonly string[];
      reason: string;
    }[];
    compareFloorMetrics?: boolean;
    compareFloorSystemId?: boolean;
    compareImpactBasis?: boolean;
    compareImpactEstimateCandidateIds?: boolean;
    impactMetrics?: readonly ImpactOnlyMetricKey[];
    lowerBoundMetrics?: readonly ImpactOnlyLowerBoundMetricKey[];
  };
  id: string;
  label: string;
  derivePredictorInputFromVisibleLayers?: boolean;
  localOptions?: {
    exactImpactSource?: ExactImpactSource;
    impactFieldContext?: ImpactFieldContext;
    impactPredictorInput?: ImpactPredictorInput;
    officialFloorSystemId?: string;
    sourceLayers?: LayerInput[];
  };
  upstreamOptions: {
    assemblyMeta?: Record<string, unknown>;
    impactPredictorInput?: Record<string, unknown>;
    sourceRecords?: Record<string, unknown>[];
    targetOutputs?: string[];
  };
  visibleLayers: VisibleLayerParityInput[];
};

export const IMPACT_ONLY_PARITY_CASES: readonly ImpactOnlyParityCase[] = [
  {
    id: "exact_band_gap_only",
    label: "Exact impact-band source over a gap-only visible stack",
    visibleLayers: [{ materialId: "air_gap", thicknessMm: 90 }],
    localOptions: {
      exactImpactSource: {
        frequenciesHz: [50, 63, 80, 100, 125, 160, 200, 250, 315, 400, 500, 630, 800, 1000, 1250, 1600, 2000, 2500, 3150],
        labOrField: "lab",
        levelsDb: [60, 59, 58, 58, 57, 56, 55, 54, 53, 52, 51, 50, 49, 48, 47, 46, 45, 44, 43]
      }
    },
    upstreamOptions: {
      assemblyMeta: {
        contextMode: "element_lab"
      },
      sourceRecords: [
        {
          id: "impact_lab_curve_only",
          label: "Impact lab curve only",
          sourceType: "lab_report",
          trustTier: "accredited_lab",
          standardMethod: "ISO 10140-3",
          matchMode: "current_input",
          bands: {
            frequencies: [50, 63, 80, 100, 125, 160, 200, 250, 315, 400, 500, 630, 800, 1000, 1250, 1600, 2000, 2500, 3150],
            values: [60, 59, 58, 58, 57, 56, 55, 54, 53, 52, 51, 50, 49, 48, 47, 46, 45, 44, 43]
          }
        }
      ],
      targetOutputs: ["Ln,w", "CI", "CI,50-2500", "Ln,w+CI"]
    },
    compare: {
      impactMetrics: ["LnW", "CI", "CI50_2500", "LnWPlusCI"]
    }
  },
  {
    id: "official_timber_gap_only",
    label: "Official timber floor-system id with a gap-only visible stack",
    visibleLayers: [{ materialId: "air_gap", thicknessMm: 90 }],
    localOptions: {
      officialFloorSystemId: "knauf_ct30_1c_timber_lab_2026"
    },
    upstreamOptions: {
      assemblyMeta: {
        contextMode: "element_lab"
      },
      impactPredictorInput: {
        structuralSupportType: "timber_joists",
        officialFloorSystemId: "knauf_ct30_1c_timber_lab_2026"
      },
      targetOutputs: ["Ln,w"]
    },
    compare: {
      compareFloorMetrics: true,
      compareFloorSystemId: true,
      impactMetrics: ["LnW"]
    }
  },
  {
    id: "official_clt_empty",
    label: "Official CLT floor-system id with no visible layers",
    visibleLayers: [],
    localOptions: {
      officialFloorSystemId: "dataholz_gdmtxn01_dry_clt_lab_2026"
    },
    upstreamOptions: {
      assemblyMeta: {
        contextMode: "element_lab"
      },
      impactPredictorInput: {
        structuralSupportType: "mass_timber_clt",
        officialFloorSystemId: "dataholz_gdmtxn01_dry_clt_lab_2026"
      },
      targetOutputs: ["Ln,w"]
    },
    compare: {
      compareFloorMetrics: true,
      compareFloorSystemId: true,
      impactMetrics: ["LnW"]
    }
  },
  {
    id: "official_steel_bound_empty",
    label: "Official bound-only steel floor-system id with no visible layers",
    visibleLayers: [],
    localOptions: {
      officialFloorSystemId: "ubiq_fl32_steel_200_lab_2026"
    },
    upstreamOptions: {
      assemblyMeta: {
        contextMode: "element_lab"
      },
      impactPredictorInput: {
        structuralSupportType: "steel_joists",
        officialFloorSystemId: "ubiq_fl32_steel_200_lab_2026"
      },
      targetOutputs: ["Ln,w"]
    },
    compare: {
      compareFloorMetrics: true,
      compareFloorSystemId: true,
      lowerBoundMetrics: ["LnWUpperBound"]
    }
  },
  {
    id: "official_hollow_core_empty",
    label: "Official hollow-core floor-system id with no visible layers",
    visibleLayers: [],
    localOptions: {
      officialFloorSystemId: "pliteq_hcp200_bare_lab_2026"
    },
    upstreamOptions: {
      assemblyMeta: {
        contextMode: "element_lab"
      },
      impactPredictorInput: {
        structuralSupportType: "hollow_core",
        officialFloorSystemId: "pliteq_hcp200_bare_lab_2026"
      },
      targetOutputs: ["Ln,w"]
    },
    compare: {
      compareFloorMetrics: true,
      compareFloorSystemId: true,
      impactMetrics: ["LnW"]
    }
  },
  {
    id: "heavy_formula_gap_only",
    label: "Heavy floating-floor formula with dedicated impact-only source layers",
    visibleLayers: [{ materialId: "air_gap", thicknessMm: 90 }],
    localOptions: {
      sourceLayers: [
        { floorRole: "floor_covering", materialId: "ceramic_tile", thicknessMm: 8 },
        { floorRole: "floating_screed", materialId: "screed", thicknessMm: 30 },
        { floorRole: "resilient_layer", materialId: "generic_resilient_underlay_s30", thicknessMm: 8 },
        { floorRole: "base_structure", materialId: "concrete", thicknessMm: 150 }
      ]
    },
    upstreamOptions: {
      assemblyMeta: {
        contextMode: "element_lab"
      },
      impactPredictorInput: {
        structuralSupportType: "reinforced_concrete",
        impactSystemType: "heavy_floating_floor",
        baseSlab: {
          materialClass: "heavy_concrete",
          thicknessMm: 150,
          densityKgM3: 2400
        },
        resilientLayer: {
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
      targetOutputs: ["Ln,w", "DeltaLw"]
    },
    compare: {
      impactMetrics: ["LnW", "DeltaLw"]
    }
  },
  {
    id: "predictor_explicit_delta_heavy_reference",
    label: "Explicit DeltaLw heavy-reference predictor input",
    visibleLayers: [],
    localOptions: {
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
          thicknessMm: 10,
          dynamicStiffnessMNm3: 20
        },
        floatingScreed: {
          materialClass: "generic_screed",
          thicknessMm: 50,
          densityKgM3: 2000
        },
        floorCovering: {
          mode: "delta_lw_catalog",
          deltaLwDb: 26
        }
      }
    },
    upstreamOptions: {
      assemblyMeta: {
        contextMode: "element_lab"
      },
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
          thicknessMm: 10,
          dynamicStiffnessMNm3: 20
        },
        floatingScreed: {
          materialClass: "generic_screed",
          thicknessMm: 50,
          densityKgM3: 2000
        },
        floorCovering: {
          mode: "delta_lw_catalog",
          deltaLwDb: 26
        }
      },
      targetOutputs: ["Ln,w", "DeltaLw"]
    },
    compare: {
      compareFloorMetrics: true,
      compareImpactBasis: true,
      impactMetrics: ["LnW", "DeltaLw"]
    }
  },
  {
    id: "predictor_explicit_delta_heavy_reference_field_locked",
    label: "Explicit DeltaLw heavy-reference input stays lab-side under field context",
    visibleLayers: [],
    localOptions: {
      impactFieldContext: {
        fieldKDb: 2,
        receivingRoomVolumeM3: 50
      },
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
          thicknessMm: 10,
          dynamicStiffnessMNm3: 20
        },
        floatingScreed: {
          materialClass: "generic_screed",
          thicknessMm: 50,
          densityKgM3: 2000
        },
        floorCovering: {
          mode: "delta_lw_catalog",
          deltaLwDb: 26
        }
      }
    },
    upstreamOptions: {
      assemblyMeta: {
        contextMode: "element_lab"
      },
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
          thicknessMm: 10,
          dynamicStiffnessMNm3: 20
        },
        floatingScreed: {
          materialClass: "generic_screed",
          thicknessMm: 50,
          densityKgM3: 2000
        },
        floorCovering: {
          mode: "delta_lw_catalog",
          deltaLwDb: 26
        }
      },
      targetOutputs: ["Ln,w", "DeltaLw", "L'n,w", "L'nT,w"]
    },
    compare: {
      compareImpactBasis: true,
      impactMetrics: ["LnW", "DeltaLw"]
    }
  },
  {
    id: "predictor_general_knauf_timber_ceramic",
    label: "Explicit Knauf timber ceramic direct-ceiling published family blend",
    visibleLayers: [],
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
    upstreamOptions: {
      assemblyMeta: {
        contextMode: "element_lab"
      },
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
      },
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
    id: "predictor_general_ubiq_open_web_carpet",
    label: "Explicit UBIQ open-web carpet published family blend",
    visibleLayers: [],
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
    upstreamOptions: {
      assemblyMeta: {
        contextMode: "element_lab"
      },
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
      },
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
    id: "layer_driven_knauf_ct30_1a",
    label: "Layer-driven Knauf CT30.1A timber exact match",
    derivePredictorInputFromVisibleLayers: true,
    visibleLayers: [
      { materialId: "engineered_timber_structural", thicknessMm: 240, floorRole: "base_structure" },
      { materialId: "engineered_timber_flooring", thicknessMm: 15, floorRole: "floor_covering" },
      { materialId: "glasswool", thicknessMm: 90, floorRole: "ceiling_fill" },
      { materialId: "firestop_board", thicknessMm: 13, floorRole: "ceiling_board" }
    ],
    upstreamOptions: {
      assemblyMeta: {
        contextMode: "element_lab"
      },
      targetOutputs: ["Ln,w"]
    },
    compare: {
      compareFloorMetrics: true,
      compareFloorSystemId: true,
      impactMetrics: ["LnW"]
    }
  },
  {
    id: "layer_driven_knauf_family_general",
    label: "Layer-driven generic joist-tagged Knauf timber ceramic low-confidence blend",
    derivePredictorInputFromVisibleLayers: true,
    visibleLayers: [
      { materialId: "timber_joist_floor", thicknessMm: 240, floorRole: "base_structure" },
      { materialId: "ceramic_tile", thicknessMm: 8, floorRole: "floor_covering" },
      { materialId: "glasswool", thicknessMm: 90, floorRole: "ceiling_fill" },
      { materialId: "firestop_board", thicknessMm: 13, floorRole: "ceiling_board" }
    ],
    upstreamOptions: {
      assemblyMeta: {
        contextMode: "element_lab"
      },
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
    id: "layer_driven_knauf_family_general_engineered",
    label: "Layer-driven engineered-timber Knauf timber ceramic published family blend",
    derivePredictorInputFromVisibleLayers: true,
    visibleLayers: [
      { materialId: "engineered_timber_structural", category: "Wood", density: 500, thicknessMm: 240, floorRole: "base_structure" },
      { materialId: "ceramic_tile", category: "Floor Finish", density: 2000, thicknessMm: 8, floorRole: "floor_covering" },
      { materialId: "glasswool", category: "Insulation", density: 14, thicknessMm: 90, floorRole: "ceiling_fill" },
      { materialId: "firestop_board", category: "Board", density: 900, thicknessMm: 13, floorRole: "ceiling_board" }
    ],
    upstreamOptions: {
      assemblyMeta: {
        contextMode: "element_lab"
      },
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
    id: "layer_driven_ubiq_fl28_open_web_300",
    label: "Layer-driven UBIQ FL-28 open-web steel exact match",
    derivePredictorInputFromVisibleLayers: true,
    visibleLayers: [
      { materialId: "open_web_steel_joist", thicknessMm: 300, floorRole: "base_structure" },
      { materialId: "rubber_sheet", thicknessMm: 5, floorRole: "resilient_layer" },
      { materialId: "particleboard_flooring", thicknessMm: 19, floorRole: "floating_screed" },
      { materialId: "engineered_timber_flooring", thicknessMm: 15, floorRole: "floor_covering" },
      { materialId: "resilient_channel", thicknessMm: 65, floorRole: "ceiling_cavity" },
      { materialId: "glasswool", thicknessMm: 145, floorRole: "ceiling_fill" },
      { materialId: "firestop_board", thicknessMm: 16, floorRole: "ceiling_board" },
      { materialId: "firestop_board", thicknessMm: 16, floorRole: "ceiling_board" },
      { materialId: "firestop_board", thicknessMm: 16, floorRole: "ceiling_board" }
    ],
    upstreamOptions: {
      assemblyMeta: {
        contextMode: "element_lab"
      },
      targetOutputs: ["Ln,w", "CI", "Ln,w+CI"]
    },
    compare: {
      compareFloorMetrics: true,
      compareFloorSystemId: true,
      impactMetrics: ["LnW", "CI", "LnWPlusCI"]
    }
  },
  {
    id: "layer_driven_pliteq_hcp200_vinyl",
    label: "Layer-driven Pliteq hollow-core vinyl exact match",
    derivePredictorInputFromVisibleLayers: true,
    visibleLayers: [
      { materialId: "hollow_core_plank", thicknessMm: 200, floorRole: "base_structure" },
      { materialId: "geniemat_rst05", thicknessMm: 5, floorRole: "resilient_layer" },
      { materialId: "vinyl_flooring", thicknessMm: 2.5, floorRole: "floor_covering" },
      { materialId: "genieclip_rst", thicknessMm: 16, floorRole: "ceiling_cavity" },
      { materialId: "gypsum_board", thicknessMm: 16, floorRole: "ceiling_board" }
    ],
    upstreamOptions: {
      assemblyMeta: {
        contextMode: "element_lab"
      },
      targetOutputs: ["Ln,w"]
    },
    compare: {
      compareFloorMetrics: true,
      compareFloorSystemId: true,
      impactMetrics: ["LnW"]
    }
  },
  {
    id: "layer_driven_tuas_x2_clt140",
    label: "Layer-driven TUAS X2 CLT measured exact match",
    derivePredictorInputFromVisibleLayers: true,
    visibleLayers: [
      { materialId: "clt_panel", thicknessMm: 140, floorRole: "base_structure" },
      { materialId: "eps_acoustic_underlay", thicknessMm: 3, floorRole: "resilient_layer" },
      { materialId: "laminate_flooring", thicknessMm: 8, floorRole: "floor_covering" }
    ],
    upstreamOptions: {
      assemblyMeta: {
        contextMode: "element_lab"
      },
      targetOutputs: ["Ln,w", "CI", "Ln,w+CI"]
    },
    compare: {
      acceptedLocalDivergences: [
        {
          metrics: ["impact.LnW", "impact.CI", "impact.LnWPlusCI", "floor.RwCtr"],
          reason:
            "Acoustic2 still carries the older TUAS X2 CLT tuple; local follows the source-truth refresh with Ln,w 61, CI 2, Ln,w+CI 63, and Rw+Ctr 37.242344245020725."
        }
      ],
      compareFloorMetrics: true,
      compareFloorSystemId: true,
      impactMetrics: ["LnW", "CI", "LnWPlusCI"]
    }
  },
  {
    id: "layer_driven_pmc_m1_dry_floor",
    label: "Layer-driven PMC composite dry floor exact match",
    derivePredictorInputFromVisibleLayers: true,
    visibleLayers: [
      { materialId: "steel_deck_composite", thicknessMm: 60, floorRole: "base_structure" },
      { materialId: "mw_t_10_impact_layer", thicknessMm: 15, floorRole: "resilient_layer" },
      { materialId: "gypsum_fiberboard", thicknessMm: 25, floorRole: "floor_covering" }
    ],
    upstreamOptions: {
      assemblyMeta: {
        contextMode: "element_lab"
      },
      targetOutputs: ["Ln,w"]
    },
    compare: {
      compareFloorMetrics: true,
      compareFloorSystemId: true,
      impactMetrics: ["LnW"]
    }
  },
  {
    id: "predictor_heavy_formula_empty",
    label: "Predictor-input heavy floating formula without visible impact layers",
    visibleLayers: [],
    localOptions: {
      impactPredictorInput: {
        structuralSupportType: "reinforced_concrete",
        impactSystemType: "heavy_floating_floor",
        baseSlab: {
          materialClass: "heavy_concrete",
          thicknessMm: 150,
          densityKgM3: 2400
        },
        resilientLayer: {
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
      }
    },
    upstreamOptions: {
      assemblyMeta: {
        contextMode: "element_lab"
      },
      impactPredictorInput: {
        structuralSupportType: "reinforced_concrete",
        impactSystemType: "heavy_floating_floor",
        baseSlab: {
          materialClass: "heavy_concrete",
          thicknessMm: 150,
          densityKgM3: 2400
        },
        resilientLayer: {
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
      targetOutputs: ["Ln,w", "DeltaLw"]
    },
    compare: {
      impactMetrics: ["LnW", "DeltaLw"]
    }
  },
  {
    id: "predictor_open_web_interp_250",
    label: "Predictor-input open-web steel interpolation at 250 mm",
    visibleLayers: [],
    localOptions: {
      impactPredictorInput: {
        structuralSupportType: "steel_joists",
        supportForm: "open_web_or_rolled",
        impactSystemType: "combined_upper_lower_system",
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
          boardThicknessMm: 16,
          boardMaterialClass: "fire_board"
        }
      }
    },
    upstreamOptions: {
      assemblyMeta: {
        contextMode: "element_lab"
      },
      impactPredictorInput: {
        structuralSupportType: "steel_joists",
        supportForm: "open_web_or_rolled",
        impactSystemType: "combined_upper_lower_system",
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
          boardThicknessMm: 16,
          boardMaterialClass: "fire_board"
        }
      },
      targetOutputs: ["Ln,w", "CI", "Ln,w+CI"]
    },
    compare: {
      compareFloorMetrics: true,
      impactMetrics: ["LnW", "CI", "LnWPlusCI"]
    }
  },
  {
    id: "predictor_composite_dry_empty",
    label: "Predictor-input composite dry floating interaction estimate without visible layers",
    visibleLayers: [],
    localOptions: {
      impactPredictorInput: {
        structuralSupportType: "composite_panel",
        impactSystemType: "dry_floating_floor",
        baseSlab: { thicknessMm: 65 },
        resilientLayer: { thicknessMm: 12 },
        floorCovering: {
          mode: "material_layer",
          materialClass: "dry_floating_gypsum_fiberboard",
          thicknessMm: 20,
          densityKgM3: 900
        }
      }
    },
    upstreamOptions: {
      assemblyMeta: {
        contextMode: "element_lab"
      },
      impactPredictorInput: {
        structuralSupportType: "composite_panel",
        impactSystemType: "dry_floating_floor",
        baseSlab: { thicknessMm: 65 },
        resilientLayer: { thicknessMm: 12 },
        floorCovering: {
          mode: "material_layer",
          materialClass: "dry_floating_gypsum_fiberboard",
          thicknessMm: 20,
          densityKgM3: 900
        }
      },
      targetOutputs: ["Ln,w"]
    },
    compare: {
      compareFloorMetrics: true,
      impactMetrics: ["LnW"]
    }
  },
  {
    id: "predictor_heavy_missing_sprime_empty",
    label: "Predictor-input heavy floating published upper-treatment estimate without visible layers",
    visibleLayers: [],
    localOptions: {
      impactPredictorInput: {
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
          thicknessMm: 30,
          densityKgM3: 2000
        },
        floorCovering: {
          mode: "material_layer",
          materialClass: "ceramic_tile",
          thicknessMm: 8,
          densityKgM3: 2000
        }
      }
    },
    upstreamOptions: {
      assemblyMeta: {
        contextMode: "element_lab"
      },
      impactPredictorInput: {
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
      targetOutputs: ["Ln,w"]
    },
    compare: {
      compareFloorMetrics: true,
      impactMetrics: ["LnW"]
    }
  },
  {
    id: "predictor_knauf_timber_archetype",
    label: "Predictor-input Knauf timber archetype estimate",
    visibleLayers: [],
    localOptions: {
      impactPredictorInput: {
        structuralSupportType: "timber_joists",
        impactSystemType: "suspended_ceiling_only",
        baseSlab: { thicknessMm: 240 },
        floorCovering: {
          mode: "material_layer",
          materialClass: "engineered_timber"
        },
        lowerTreatment: {
          type: "direct_fixed_ceiling",
          cavityFillThicknessMm: 45,
          boardLayerCount: 1,
          boardThicknessMm: 12,
          boardMaterialClass: "impactstop_board",
          supportClass: "furred_channels"
        }
      }
    },
    upstreamOptions: {
      assemblyMeta: {
        contextMode: "element_lab"
      },
      impactPredictorInput: {
        structuralSupportType: "timber_joists",
        impactSystemType: "suspended_ceiling_only",
        baseSlab: { thicknessMm: 240 },
        floorCovering: {
          mode: "material_layer",
          materialClass: "engineered_timber"
        },
        lowerTreatment: {
          type: "direct_fixed_ceiling",
          cavityFillThicknessMm: 45,
          boardLayerCount: 1,
          boardThicknessMm: 12,
          boardMaterialClass: "impactstop_board",
          supportClass: "furred_channels"
        }
      },
      targetOutputs: ["Ln,w"]
    },
    compare: {
      compareFloorMetrics: true,
      impactMetrics: ["LnW"]
    }
  },
  {
    id: "predictor_knauf_timber_general",
    label: "Predictor-input Knauf timber broader family estimate",
    visibleLayers: [],
    localOptions: {
      impactPredictorInput: {
        structuralSupportType: "timber_joists",
        impactSystemType: "suspended_ceiling_only",
        baseSlab: { thicknessMm: 240 },
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
    upstreamOptions: {
      assemblyMeta: {
        contextMode: "element_lab"
      },
      impactPredictorInput: {
        structuralSupportType: "timber_joists",
        impactSystemType: "suspended_ceiling_only",
        baseSlab: { thicknessMm: 240 },
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
      targetOutputs: ["Ln,w"]
    },
    compare: {
      compareFloorMetrics: true,
      impactMetrics: ["LnW"]
    }
  },
  {
    id: "predictor_dataholz_wet_clt_archetype",
    label: "Predictor-input Dataholz wet CLT family estimate",
    visibleLayers: [],
    localOptions: {
      impactPredictorInput: {
        structuralSupportType: "mass_timber_clt",
        impactSystemType: "heavy_floating_floor",
        baseSlab: { thicknessMm: 155 },
        resilientLayer: {
          thicknessMm: 35,
          dynamicStiffnessMNm3: 8
        },
        upperFill: {
          materialClass: "non_bonded_chippings",
          thicknessMm: 110,
          densityKgM3: 1800
        },
        floatingScreed: {
          materialClass: "generic_screed",
          thicknessMm: 65,
          densityKgM3: 2000
        }
      }
    },
    upstreamOptions: {
      assemblyMeta: {
        contextMode: "element_lab"
      },
      impactPredictorInput: {
        structuralSupportType: "mass_timber_clt",
        impactSystemType: "heavy_floating_floor",
        baseSlab: { thicknessMm: 155 },
        resilientLayer: {
          thicknessMm: 35,
          dynamicStiffnessMNm3: 8
        },
        upperFill: {
          materialClass: "non_bonded_chippings",
          thicknessMm: 110,
          densityKgM3: 1800
        },
        floatingScreed: {
          materialClass: "generic_screed",
          thicknessMm: 65,
          densityKgM3: 2000
        }
      },
      targetOutputs: ["Ln,w", "CI", "Ln,w+CI"]
    },
    compare: {
      compareFloorMetrics: true,
      impactMetrics: ["LnW", "CI", "LnWPlusCI"]
    }
  },
  {
    id: "predictor_steel_open_web_general",
    label: "Predictor-input open-web steel broader family estimate",
    visibleLayers: [],
    localOptions: {
      impactPredictorInput: {
        structuralSupportType: "steel_joists",
        supportForm: "open_web_or_rolled",
        impactSystemType: "combined_upper_lower_system",
        baseSlab: { thicknessMm: 300 },
        floatingScreed: { thicknessMm: 19 },
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
    upstreamOptions: {
      assemblyMeta: {
        contextMode: "element_lab"
      },
      impactPredictorInput: {
        structuralSupportType: "steel_joists",
        supportForm: "open_web_or_rolled",
        impactSystemType: "combined_upper_lower_system",
        baseSlab: { thicknessMm: 300 },
        floatingScreed: { thicknessMm: 19 },
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
      targetOutputs: ["Ln,w", "CI", "Ln,w+CI"]
    },
    compare: {
      compareImpactBasis: true,
      compareImpactEstimateCandidateIds: true,
      compareFloorMetrics: true,
      impactMetrics: ["LnW", "CI", "LnWPlusCI"]
    }
  },
  {
    id: "predictor_concrete_combined_low_confidence",
    label: "Predictor-input reinforced-concrete combined low-confidence fallback",
    visibleLayers: [],
    localOptions: {
      impactPredictorInput: {
        structuralSupportType: "reinforced_concrete",
        impactSystemType: "combined_upper_lower_system",
        baseSlab: { materialClass: "heavy_concrete", thicknessMm: 180, densityKgM3: 2400 },
        resilientLayer: { thicknessMm: 8, dynamicStiffnessMNm3: 35 },
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
      }
    },
    upstreamOptions: {
      assemblyMeta: {
        contextMode: "element_lab"
      },
      impactPredictorInput: {
        structuralSupportType: "reinforced_concrete",
        impactSystemType: "combined_upper_lower_system",
        baseSlab: { materialClass: "heavy_concrete", thicknessMm: 180, densityKgM3: 2400 },
        resilientLayer: { thicknessMm: 8, dynamicStiffnessMNm3: 35 },
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
      targetOutputs: ["Ln,w"]
    },
    compare: {
      compareImpactBasis: true,
      compareImpactEstimateCandidateIds: true,
      compareFloorMetrics: true,
      impactMetrics: ["LnW"]
    }
  },
  {
    id: "predictor_steel_open_web_low_confidence",
    label: "Predictor-input open-web steel suspended low-confidence fallback",
    visibleLayers: [],
    localOptions: {
      impactPredictorInput: {
        structuralSupportType: "steel_joists",
        supportForm: "open_web_or_rolled",
        impactSystemType: "suspended_ceiling_only",
        baseSlab: { thicknessMm: 250 },
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
      }
    },
    upstreamOptions: {
      assemblyMeta: {
        contextMode: "element_lab"
      },
      impactPredictorInput: {
        structuralSupportType: "steel_joists",
        supportForm: "open_web_or_rolled",
        impactSystemType: "suspended_ceiling_only",
        baseSlab: { thicknessMm: 250 },
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
      targetOutputs: ["Ln,w", "CI", "Ln,w+CI"]
    },
    compare: {
      compareImpactBasis: true,
      compareImpactEstimateCandidateIds: true,
      compareFloorMetrics: true,
      impactMetrics: ["LnW", "CI", "LnWPlusCI"]
    }
  },
  {
    id: "predictor_steel_joist_low_confidence",
    label: "Predictor-input joist-or-purlin steel suspended low-confidence fallback",
    visibleLayers: [],
    localOptions: {
      impactPredictorInput: {
        structuralSupportType: "steel_joists",
        supportForm: "joist_or_purlin",
        impactSystemType: "suspended_ceiling_only",
        baseSlab: { thicknessMm: 250, densityKgM3: 7850 },
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
      }
    },
    upstreamOptions: {
      assemblyMeta: {
        contextMode: "element_lab"
      },
      impactPredictorInput: {
        structuralSupportType: "steel_joists",
        supportForm: "joist_or_purlin",
        impactSystemType: "suspended_ceiling_only",
        baseSlab: { thicknessMm: 250, densityKgM3: 7850 },
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
      },
      targetOutputs: ["Ln,w"]
    },
    compare: {
      compareImpactBasis: true,
      compareImpactEstimateCandidateIds: true,
      compareFloorMetrics: true,
      impactMetrics: ["LnW"]
    }
  },
  {
    id: "predictor_timber_bare_low_confidence",
    label: "Predictor-input bare timber laminate low-confidence fallback",
    visibleLayers: [],
    localOptions: {
      impactPredictorInput: {
        structuralSupportType: "timber_joists",
        impactSystemType: "bare_floor",
        baseSlab: { thicknessMm: 240 },
        floorCovering: {
          mode: "material_layer",
          materialClass: "laminate_flooring",
          thicknessMm: 9,
          densityKgM3: 850
        }
      }
    },
    upstreamOptions: {
      assemblyMeta: {
        contextMode: "element_lab"
      },
      impactPredictorInput: {
        structuralSupportType: "timber_joists",
        impactSystemType: "bare_floor",
        baseSlab: { thicknessMm: 240 },
        floorCovering: {
          mode: "material_layer",
          materialClass: "laminate_flooring",
          thicknessMm: 9,
          densityKgM3: 850
        }
      },
      targetOutputs: ["Ln,w", "CI", "Ln,w+CI"]
    },
    compare: {
      acceptedLocalDivergences: [
        {
          metrics: ["floor.RwCtr"],
          reason:
            "Local now withholds the low-confidence timber bare-floor companion because its candidate set mixes Dataholz ctr_term with Knauf Rw+Ctr rows; Acoustic2 still exposes the ambiguous legacy RwCtr value."
        }
      ],
      compareImpactBasis: true,
      compareImpactEstimateCandidateIds: true,
      compareFloorMetrics: true,
      impactMetrics: ["LnW", "CI", "LnWPlusCI"]
    }
  },
  {
    id: "predictor_composite_ceiling_low_confidence",
    label: "Predictor-input composite suspended-ceiling low-confidence fallback",
    visibleLayers: [],
    localOptions: {
      impactPredictorInput: {
        structuralSupportType: "composite_panel",
        impactSystemType: "suspended_ceiling_only",
        baseSlab: { materialClass: "composite_steel_deck", thicknessMm: 150, densityKgM3: 2350 },
        lowerTreatment: {
          type: "suspended_ceiling_elastic_hanger",
          cavityDepthMm: 150,
          cavityFillThicknessMm: 100,
          boardLayerCount: 2,
          boardThicknessMm: 16
        }
      }
    },
    upstreamOptions: {
      assemblyMeta: {
        contextMode: "element_lab"
      },
      impactPredictorInput: {
        structuralSupportType: "composite_panel",
        impactSystemType: "suspended_ceiling_only",
        baseSlab: { materialClass: "composite_steel_deck", thicknessMm: 150, densityKgM3: 2350 },
        lowerTreatment: {
          type: "suspended_ceiling_elastic_hanger",
          cavityDepthMm: 150,
          cavityFillThicknessMm: 100,
          boardLayerCount: 2,
          boardThicknessMm: 16
        }
      },
      targetOutputs: ["Ln,w"]
    },
    compare: {
      compareImpactBasis: true,
      compareImpactEstimateCandidateIds: true,
      compareFloorMetrics: true,
      impactMetrics: ["LnW"]
    }
  },
  {
    id: "predictor_missing_support_bound_300",
    label: "Predictor-input lightweight-steel bound lane with unspecified support form",
    visibleLayers: [],
    localOptions: {
      impactPredictorInput: {
        structuralSupportType: "steel_joists",
        impactSystemType: "combined_upper_lower_system",
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
          boardThicknessMm: 16,
          boardMaterialClass: "fire_board"
        }
      }
    },
    upstreamOptions: {
      assemblyMeta: {
        contextMode: "element_lab"
      },
      impactPredictorInput: {
        structuralSupportType: "steel_joists",
        impactSystemType: "combined_upper_lower_system",
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
          boardThicknessMm: 16,
          boardMaterialClass: "fire_board"
        }
      },
      targetOutputs: ["Ln,w", "Rw"]
    },
    compare: {
      compareFloorMetrics: true,
      lowerBoundMetrics: ["LnWUpperBound"]
    }
  }
];

export type { ImpactOnlyLowerBoundMetricKey, ImpactOnlyMetricKey };
