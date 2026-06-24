import type { ImpactProductCatalogEntry } from "@dynecho/shared";

export const OFFICIAL_IMPACT_PRODUCT_CATALOG: readonly ImpactProductCatalogEntry[] = [
  {
    id: "regupol_sonus_curve_8_tile_match_2026",
    impactRatings: {
      DeltaLw: 26,
      LnW: 50
    },
    impactSystemType: "heavy_floating_floor",
    label: "REGUPOL sonus curve 8, 150 mm slab, 30 mm screed, 8 mm tile",
    match: {
      absentRoles: ["ceiling_board", "ceiling_cavity", "ceiling_fill", "upper_fill"],
      supportingElementFamilies: ["reinforced_concrete"],
      baseStructure: {
        layerCount: 1,
        materialIds: ["concrete"],
        thicknessMm: 150
      },
      floatingScreed: {
        layerCount: 1,
        materialIds: ["screed"],
        thicknessMm: 30
      },
      floorCovering: {
        layerCount: 1,
        materialIds: ["ceramic_tile"],
        thicknessMm: 8,
        thicknessToleranceMm: 0.5
      },
      resilientLayer: {
        layerCount: 1,
        materialIds: ["regupol_sonus_curve_8"],
        thicknessMm: 8,
        thicknessToleranceMm: 0.5
      }
    },
    matchMode: "exact_system",
    referenceFloorType: "heavy_standard",
    source:
      "https://acoustics.regupol.com/fileadmin/user_upload/acoustics/products/documents/technical_data/en/regupol_sonus_curve/regupol_sonus_curve_8/REGUPOL_sonus_curve_8_-_TD-en_072024.pdf",
    sourceType: "official_manufacturer_technical_data_pdf",
    trustTier: "official_manufacturer"
  },
  {
    id: "regupol_sonus_multi_45_tile_match_2026",
    impactRatings: {
      DeltaLw: 19,
      LnW: 60
    },
    impactSystemType: "heavy_floating_floor",
    label: "REGUPOL sonus multi 4.5, 150 mm slab, 30 mm screed, 8 mm tile",
    match: {
      absentRoles: ["ceiling_board", "ceiling_cavity", "ceiling_fill", "upper_fill"],
      supportingElementFamilies: ["reinforced_concrete"],
      baseStructure: {
        layerCount: 1,
        materialIds: ["concrete"],
        thicknessMm: 150
      },
      floatingScreed: {
        layerCount: 1,
        materialIds: ["screed"],
        thicknessMm: 30
      },
      floorCovering: {
        layerCount: 1,
        materialIds: ["ceramic_tile"],
        thicknessMm: 8,
        thicknessToleranceMm: 0.5
      },
      resilientLayer: {
        layerCount: 1,
        materialIds: ["regupol_sonus_multi_4_5"],
        thicknessMm: 4.5,
        thicknessToleranceMm: 0.25
      }
    },
    matchMode: "exact_system",
    referenceFloorType: "heavy_standard",
    source:
      "https://acoustics.regupol.com/fileadmin/user_upload/acoustics/products/documents/technical_data/en/regupol_sonus_multi/regupol_sonus_multi_4-5/REGUPOL_sonus_multi_4.5_-_TD-en_092024.pdf",
    sourceType: "official_manufacturer_technical_data_pdf",
    trustTier: "official_manufacturer"
  },
  {
    id: "regupol_sonus_curve_8_wet_screed_lower_bound_2026",
    impactRatings: {
      DeltaLwLowerBound: 22,
      LnWUpperBound: 56
    },
    impactSystemType: "heavy_floating_floor",
    label: "REGUPOL sonus curve 8, 140 mm slab, 70 mm wet screed (lower-bound support)",
    match: {
      absentRoles: ["ceiling_board", "ceiling_cavity", "ceiling_fill", "floor_covering", "upper_fill"],
      supportingElementFamilies: ["reinforced_concrete"],
      baseStructure: {
        layerCount: 1,
        materialIds: ["concrete"],
        thicknessMm: 140
      },
      floatingScreed: {
        layerCount: 1,
        materialIds: ["screed"],
        thicknessMm: 70
      },
      resilientLayer: {
        layerCount: 1,
        materialIds: ["regupol_sonus_curve_8"],
        thicknessMm: 8,
        thicknessToleranceMm: 0.5
      }
    },
    matchMode: "lower_bound_support",
    referenceFloorType: "heavy_standard",
    source:
      "https://acoustics.regupol.com/fileadmin/user_upload/acoustics/products/documents/technical_data/en/regupol_sonus_curve/regupol_sonus_curve_8/REGUPOL_sonus_curve_8_-_TD-en_072024.pdf",
    sourceType: "official_manufacturer_technical_data_pdf",
    trustTier: "official_manufacturer"
  },
  {
    id: "regupol_sonus_multi_45_porcelain_match_2026",
    impactRatings: {
      DeltaLw: 17,
      LnW: 61
    },
    impactSystemType: "heavy_floating_floor",
    label: "REGUPOL sonus multi 4.5, 150 mm slab, 10 mm porcelain tile",
    match: {
      absentRoles: ["ceiling_board", "ceiling_cavity", "ceiling_fill", "floating_screed", "upper_fill"],
      supportingElementFamilies: ["reinforced_concrete"],
      baseStructure: {
        layerCount: 1,
        materialIds: ["concrete"],
        thicknessMm: 150
      },
      floorCovering: {
        layerCount: 1,
        materialIds: ["porcelain_tile"],
        thicknessMm: 10,
        thicknessToleranceMm: 0.5
      },
      resilientLayer: {
        layerCount: 1,
        materialIds: ["regupol_sonus_multi_4_5"],
        thicknessMm: 4.5,
        thicknessToleranceMm: 0.25
      }
    },
    matchMode: "exact_system",
    referenceFloorType: "heavy_standard",
    source:
      "https://acoustics.regupol.com/fileadmin/user_upload/acoustics/products/documents/technical_data/en/regupol_sonus_multi/regupol_sonus_multi_4-5/REGUPOL_sonus_multi_4.5_-_TD-en_092024.pdf",
    sourceType: "official_manufacturer_technical_data_pdf",
    trustTier: "official_manufacturer"
  },
  {
    id: "getzner_afm29_rc160_screed172_exact_2026",
    impactRatings: {
      DeltaLw: 29,
      LnW: 49
    },
    impactSystemType: "heavy_floating_floor",
    label: "Getzner AFM29, 160 mm reinforced concrete, 172 kg/m2 concrete screed",
    match: {
      absentRoles: ["ceiling_board", "ceiling_cavity", "ceiling_fill", "floor_covering", "upper_fill"],
      supportingElementFamilies: ["reinforced_concrete"],
      baseStructure: {
        layerCount: 1,
        materialIds: ["concrete"],
        thicknessMm: 160
      },
      floatingScreed: {
        layerCount: 1,
        materialIds: ["screed"],
        surfaceMassKgM2: 172,
        surfaceMassToleranceKgM2: 2
      },
      resilientLayer: {
        layerCount: 1,
        materialIds: ["getzner_afm_29"],
        thicknessMm: 11,
        thicknessToleranceMm: 0.5
      }
    },
    matchMode: "exact_system",
    referenceFloorType: "getzner_afm29_rc160_screed172_lab",
    source:
      "https://www.getzner.com/media/14078/download/Data%20Sheet%20Acoustic%20Floor%20Mat%2029%20EN.pdf?v=5",
    sourceType: "official_manufacturer_technical_data_pdf",
    trustTier: "official_manufacturer"
  },
  {
    id: "getzner_afm29_rc160_screed197_exact_2026",
    impactRatings: {
      DeltaLw: 33,
      LnW: 46
    },
    impactSystemType: "heavy_floating_floor",
    label: "Getzner AFM29, 160 mm reinforced concrete, 197 kg/m2 concrete screed",
    match: {
      absentRoles: ["ceiling_board", "ceiling_cavity", "ceiling_fill", "floor_covering", "upper_fill"],
      supportingElementFamilies: ["reinforced_concrete"],
      baseStructure: {
        layerCount: 1,
        materialIds: ["concrete"],
        thicknessMm: 160
      },
      floatingScreed: {
        layerCount: 1,
        materialIds: ["screed"],
        surfaceMassKgM2: 197,
        surfaceMassToleranceKgM2: 2
      },
      resilientLayer: {
        layerCount: 1,
        materialIds: ["getzner_afm_29"],
        thicknessMm: 11,
        thicknessToleranceMm: 0.5
      }
    },
    matchMode: "exact_system",
    referenceFloorType: "getzner_afm29_rc160_screed197_lab",
    source:
      "https://www.getzner.com/media/14078/download/Data%20Sheet%20Acoustic%20Floor%20Mat%2029%20EN.pdf?v=5",
    sourceType: "official_manufacturer_technical_data_pdf",
    trustTier: "official_manufacturer"
  },
  {
    id: "regufoam_sound_10_catalog_delta_lw_2026",
    impactRatings: {
      DeltaLwLowerBound: 34
    },
    impactSystemType: "heavy_floating_floor",
    label: "REGUFOAM sound 10 catalog DeltaLw lower-bound, 17 mm under cement screed",
    match: {
      absentRoles: ["ceiling_board", "ceiling_cavity", "ceiling_fill", "floor_covering", "upper_fill"],
      supportingElementFamilies: ["reinforced_concrete"],
      baseStructure: {
        layerCount: 1,
        materialIds: ["concrete"],
        surfaceMassRangeKgM2: { min: 280 }
      },
      floatingScreed: {
        layerCount: 1,
        materialIds: ["screed"],
        surfaceMassRangeKgM2: { min: 80 }
      },
      resilientLayer: {
        layerCount: 1,
        materialIds: ["regufoam_sound_10"],
        thicknessMm: 17,
        thicknessToleranceMm: 0.5
      }
    },
    matchMode: "lower_bound_support",
    referenceFloorType: "heavy_standard",
    source: "https://acoustics.regupol.com/products/range/regupol-sound/regufoam-sound-10/",
    sourceType: "official_manufacturer_product_page",
    trustTier: "official_manufacturer"
  },
  {
    id: "regupol_sound_12_one_layer_catalog_delta_lw_2026",
    impactRatings: {
      DeltaLwLowerBound: 31
    },
    impactSystemType: "heavy_floating_floor",
    label: "REGUPOL sound 12 catalog DeltaLw lower-bound, one 17 mm layer under cement screed",
    match: {
      absentRoles: ["ceiling_board", "ceiling_cavity", "ceiling_fill", "floor_covering", "upper_fill"],
      supportingElementFamilies: ["reinforced_concrete"],
      baseStructure: {
        layerCount: 1,
        materialIds: ["concrete"],
        surfaceMassRangeKgM2: { min: 280 }
      },
      floatingScreed: {
        layerCount: 1,
        materialIds: ["screed"],
        surfaceMassRangeKgM2: { min: 80 }
      },
      resilientLayer: {
        layerCount: 1,
        materialIds: ["regupol_sound_12"],
        thicknessMm: 17,
        thicknessToleranceMm: 0.5
      }
    },
    matchMode: "lower_bound_support",
    referenceFloorType: "heavy_standard",
    source: "https://acoustics.regupol.com/products/range/regupol-sound/regupol-sound-12/",
    sourceType: "official_manufacturer_product_page",
    trustTier: "official_manufacturer"
  },
  {
    id: "regupol_sound_12_two_layer_catalog_delta_lw_2026",
    impactRatings: {
      DeltaLwLowerBound: 36
    },
    impactSystemType: "heavy_floating_floor",
    label: "REGUPOL sound 12 catalog DeltaLw lower-bound, two 17 mm layers under cement screed",
    match: {
      absentRoles: ["ceiling_board", "ceiling_cavity", "ceiling_fill", "floor_covering", "upper_fill"],
      supportingElementFamilies: ["reinforced_concrete"],
      baseStructure: {
        layerCount: 1,
        materialIds: ["concrete"],
        surfaceMassRangeKgM2: { min: 280 }
      },
      floatingScreed: {
        layerCount: 1,
        materialIds: ["screed"],
        surfaceMassRangeKgM2: { min: 80 }
      },
      resilientLayer: {
        layerCount: 2,
        materialIds: ["regupol_sound_12"],
        thicknessMm: 17,
        thicknessToleranceMm: 0.5
      }
    },
    matchMode: "lower_bound_support",
    referenceFloorType: "heavy_standard",
    source: "https://acoustics.regupol.com/products/range/regupol-sound/regupol-sound-12/",
    sourceType: "official_manufacturer_product_page",
    trustTier: "official_manufacturer"
  },
  {
    id: "regupol_sound_15_catalog_delta_lw_2026",
    impactRatings: {
      DeltaLwLowerBound: 29
    },
    impactSystemType: "heavy_floating_floor",
    label: "REGUPOL sound 15 catalog DeltaLw lower-bound, 12 mm under cement screed",
    match: {
      absentRoles: ["ceiling_board", "ceiling_cavity", "ceiling_fill", "floor_covering", "upper_fill"],
      supportingElementFamilies: ["reinforced_concrete"],
      baseStructure: {
        layerCount: 1,
        materialIds: ["concrete"],
        surfaceMassRangeKgM2: { min: 280 }
      },
      floatingScreed: {
        layerCount: 1,
        materialIds: ["screed"],
        surfaceMassRangeKgM2: { min: 80 }
      },
      resilientLayer: {
        layerCount: 1,
        materialIds: ["regupol_sound_15"],
        thicknessMm: 12,
        thicknessToleranceMm: 0.5
      }
    },
    matchMode: "lower_bound_support",
    referenceFloorType: "heavy_standard",
    source: "https://acoustics.regupol.com/products/range/regupol-sound/regupol-sound-15/",
    sourceType: "official_manufacturer_product_page",
    trustTier: "official_manufacturer"
  },
  {
    id: "regupol_sound_17_one_layer_catalog_delta_lw_2026",
    impactRatings: {
      DeltaLwLowerBound: 26
    },
    impactSystemType: "heavy_floating_floor",
    label: "REGUPOL sound 17 catalog DeltaLw lower-bound, one 17 mm layer under cement screed",
    match: {
      absentRoles: ["ceiling_board", "ceiling_cavity", "ceiling_fill", "floor_covering", "upper_fill"],
      supportingElementFamilies: ["reinforced_concrete"],
      baseStructure: {
        layerCount: 1,
        materialIds: ["concrete"],
        surfaceMassRangeKgM2: { min: 280 }
      },
      floatingScreed: {
        layerCount: 1,
        materialIds: ["screed"],
        surfaceMassRangeKgM2: { min: 80 }
      },
      resilientLayer: {
        layerCount: 1,
        materialIds: ["regupol_sound_17"],
        thicknessMm: 17,
        thicknessToleranceMm: 0.5
      }
    },
    matchMode: "lower_bound_support",
    referenceFloorType: "heavy_standard",
    source: "https://acoustics.regupol.com/products/range/regupol-sound/regupol-sound-17/",
    sourceType: "official_manufacturer_product_page",
    trustTier: "official_manufacturer"
  },
  {
    id: "regupol_sound_17_two_layer_catalog_delta_lw_2026",
    impactRatings: {
      DeltaLwLowerBound: 30
    },
    impactSystemType: "heavy_floating_floor",
    label: "REGUPOL sound 17 catalog DeltaLw lower-bound, two 17 mm layers under cement screed",
    match: {
      absentRoles: ["ceiling_board", "ceiling_cavity", "ceiling_fill", "floor_covering", "upper_fill"],
      supportingElementFamilies: ["reinforced_concrete"],
      baseStructure: {
        layerCount: 1,
        materialIds: ["concrete"],
        surfaceMassRangeKgM2: { min: 280 }
      },
      floatingScreed: {
        layerCount: 1,
        materialIds: ["screed"],
        surfaceMassRangeKgM2: { min: 80 }
      },
      resilientLayer: {
        layerCount: 2,
        materialIds: ["regupol_sound_17"],
        thicknessMm: 17,
        thicknessToleranceMm: 0.5
      }
    },
    matchMode: "lower_bound_support",
    referenceFloorType: "heavy_standard",
    source: "https://acoustics.regupol.com/products/range/regupol-sound/regupol-sound-17/",
    sourceType: "official_manufacturer_product_page",
    trustTier: "official_manufacturer"
  },
  {
    id: "regupol_sound_47_catalog_delta_lw_2026",
    impactRatings: {
      DeltaLwLowerBound: 22
    },
    impactSystemType: "heavy_floating_floor",
    label: "REGUPOL sound 47 catalog DeltaLw lower-bound, 8 mm under cement screed",
    match: {
      absentRoles: ["ceiling_board", "ceiling_cavity", "ceiling_fill", "floor_covering", "upper_fill"],
      supportingElementFamilies: ["reinforced_concrete"],
      baseStructure: {
        layerCount: 1,
        materialIds: ["concrete"],
        surfaceMassRangeKgM2: { min: 280 }
      },
      floatingScreed: {
        layerCount: 1,
        materialIds: ["screed"],
        surfaceMassRangeKgM2: { min: 80 }
      },
      resilientLayer: {
        layerCount: 1,
        materialIds: ["regupol_sound_47"],
        thicknessMm: 8,
        thicknessToleranceMm: 0.5
      }
    },
    matchMode: "lower_bound_support",
    referenceFloorType: "heavy_standard",
    source: "https://acoustics.regupol.com/products/range/regupol-sound/regupol-sound-47/",
    sourceType: "official_manufacturer_product_page",
    trustTier: "official_manufacturer"
  },
  {
    id: "isolgomma_sylcer_3_catalog_delta_lw_2026",
    impactRatings: {
      DeltaLw: 17
    },
    impactSystemType: "heavy_floating_floor",
    label: "Isolgomma SYLCER 3 catalog DeltaLw, 3 mm bonded underlay under ceramic tile",
    match: {
      absentRoles: ["ceiling_board", "ceiling_cavity", "ceiling_fill", "floating_screed", "upper_fill"],
      supportingElementFamilies: ["reinforced_concrete"],
      baseStructure: {
        layerCount: 1,
        materialIds: ["concrete"],
        surfaceMassRangeKgM2: { min: 280 }
      },
      floorCovering: {
        layerCount: 1,
        materialIds: ["ceramic_tile", "porcelain_tile"]
      },
      resilientLayer: {
        layerCount: 1,
        materialIds: ["isolgomma_sylcer_3"],
        thicknessMm: 3,
        thicknessToleranceMm: 0.25
      }
    },
    matchMode: "product_property_delta",
    referenceFloorType: "heavy_standard",
    source: "https://www.isolgomma.com/downloads/technical-data/Isolgomma_Sylcer-EN.pdf",
    sourceType: "official_manufacturer_technical_data_pdf",
    trustTier: "official_manufacturer"
  },
  {
    id: "schluter_ditra_sound_catalog_delta_lw_2026",
    impactRatings: {
      DeltaLw: 13
    },
    impactSystemType: "heavy_floating_floor",
    label: "Schluter DITRA-SOUND catalog impact reduction, 3.5 mm bonded mat under tile",
    match: {
      absentRoles: ["ceiling_board", "ceiling_cavity", "ceiling_fill", "floating_screed", "upper_fill"],
      supportingElementFamilies: ["reinforced_concrete"],
      baseStructure: {
        layerCount: 1,
        materialIds: ["concrete"],
        surfaceMassRangeKgM2: { min: 280 }
      },
      floorCovering: {
        layerCount: 1,
        materialIds: ["ceramic_tile", "porcelain_tile"]
      },
      resilientLayer: {
        layerCount: 1,
        materialIds: ["schluter_ditra_sound"],
        thicknessMm: 3.5,
        thicknessToleranceMm: 0.25
      }
    },
    matchMode: "product_property_delta",
    referenceFloorType: "heavy_standard",
    source:
      "https://assets.schluter.com/asset/570120892212/document_bd9ftlao5926r0vrla5ukp4b77/552264_Prospekt_Ditra_Sound_GB?content-disposition=inline",
    sourceType: "official_manufacturer_technical_data_pdf",
    trustTier: "official_manufacturer"
  },
  {
    id: "tarkett_comfort_acoustic_19_db_catalog_delta_lw_2026",
    impactRatings: {
      DeltaLw: 19
    },
    impactSystemType: "heavy_floor_covering",
    label: "Tarkett Comfort Acoustic 19 dB catalog impact reduction",
    match: {
      absentRoles: ["ceiling_board", "ceiling_cavity", "ceiling_fill", "floating_screed", "resilient_layer", "upper_fill"],
      supportingElementFamilies: ["reinforced_concrete"],
      baseStructure: {
        layerCount: 1,
        materialIds: ["concrete"],
        surfaceMassRangeKgM2: { min: 280 }
      },
      floorCovering: {
        layerCount: 1,
        materialIds: ["tarkett_comfort_acoustic_19_db"],
        thicknessMm: 3.15,
        thicknessToleranceMm: 0.1
      }
    },
    matchMode: "product_property_delta",
    referenceFloorType: "heavy_standard",
    source: "https://professionals.tarkett.co.uk/en_GB/collection-C002828-comfort-acoustic-35-residential",
    sourceType: "official_manufacturer_product_page",
    trustTier: "official_manufacturer"
  },
  {
    id: "tarkett_iq_optima_acoustic_16_db_catalog_delta_lw_2026",
    impactRatings: {
      DeltaLw: 16
    },
    impactSystemType: "heavy_floor_covering",
    label: "Tarkett iQ Optima Acoustic 16 dB catalog impact reduction",
    match: {
      absentRoles: ["ceiling_board", "ceiling_cavity", "ceiling_fill", "floating_screed", "resilient_layer", "upper_fill"],
      supportingElementFamilies: ["reinforced_concrete"],
      baseStructure: {
        layerCount: 1,
        materialIds: ["concrete"],
        surfaceMassRangeKgM2: { min: 280 }
      },
      floorCovering: {
        layerCount: 1,
        materialIds: ["tarkett_iq_optima_acoustic_16_db"],
        thicknessMm: 3.15,
        thicknessToleranceMm: 0.1
      }
    },
    matchMode: "product_property_delta",
    referenceFloorType: "heavy_standard",
    source: "https://professionals.tarkett.com/en_EU/collection-C000127-iq-optima-acoustic",
    sourceType: "official_manufacturer_product_page",
    trustTier: "official_manufacturer"
  }
];
