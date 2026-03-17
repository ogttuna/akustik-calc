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
      baseStructure: {
        materialIds: ["concrete"],
        thicknessMm: 150
      },
      floatingScreed: {
        materialIds: ["screed"],
        thicknessMm: 30
      },
      floorCovering: {
        materialIds: ["ceramic_tile"],
        thicknessMm: 8
      },
      resilientLayer: {
        materialIds: ["regupol_sonus_curve_8"],
        thicknessMm: 8
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
      baseStructure: {
        materialIds: ["concrete"],
        thicknessMm: 150
      },
      floatingScreed: {
        materialIds: ["screed"],
        thicknessMm: 30
      },
      floorCovering: {
        materialIds: ["ceramic_tile"],
        thicknessMm: 8
      },
      resilientLayer: {
        materialIds: ["regupol_sonus_multi_4_5"],
        thicknessMm: 4.5
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
      baseStructure: {
        materialIds: ["concrete"],
        thicknessMm: 140
      },
      floatingScreed: {
        materialIds: ["screed"],
        thicknessMm: 70
      },
      resilientLayer: {
        materialIds: ["regupol_sonus_curve_8"],
        thicknessMm: 8
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
      baseStructure: {
        materialIds: ["concrete"],
        thicknessMm: 150
      },
      floorCovering: {
        materialIds: ["porcelain_tile"],
        thicknessMm: 10
      },
      resilientLayer: {
        materialIds: ["regupol_sonus_multi_4_5"],
        thicknessMm: 4.5
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
    id: "getzner_afm21_catalog_2026",
    impactRatings: {
      DeltaLw: 21
    },
    impactSystemType: "heavy_floating_floor",
    label: "Getzner AFM 21 catalog DeltaLw",
    match: {
      absentRoles: [],
      resilientLayer: {
        materialIds: ["getzner_afm_21"]
      }
    },
    matchMode: "product_property_delta",
    referenceFloorType: "heavy_standard",
    source: "https://www.getzner.com/media/9347/download/hb-022_abk-020.pdf?v=5",
    sourceType: "official_manufacturer_catalog_pdf",
    trustTier: "official_manufacturer"
  },
  {
    id: "getzner_afm23_catalog_2026",
    impactRatings: {
      DeltaLw: 23
    },
    impactSystemType: "heavy_floating_floor",
    label: "Getzner AFM 23 catalog DeltaLw",
    match: {
      absentRoles: [],
      resilientLayer: {
        materialIds: ["getzner_afm_23"]
      }
    },
    matchMode: "product_property_delta",
    referenceFloorType: "heavy_standard",
    source: "https://www.getzner.com/media/9347/download/hb-022_abk-020.pdf?v=5",
    sourceType: "official_manufacturer_catalog_pdf",
    trustTier: "official_manufacturer"
  },
  {
    id: "getzner_afm26_catalog_2026",
    impactRatings: {
      DeltaLw: 26
    },
    impactSystemType: "heavy_floating_floor",
    label: "Getzner AFM 26 catalog DeltaLw",
    match: {
      absentRoles: [],
      resilientLayer: {
        materialIds: ["getzner_afm_26"]
      }
    },
    matchMode: "product_property_delta",
    referenceFloorType: "heavy_standard",
    source: "https://www.getzner.com/media/9347/download/hb-022_abk-020.pdf?v=5",
    sourceType: "official_manufacturer_catalog_pdf",
    trustTier: "official_manufacturer"
  },
  {
    id: "getzner_afm29_catalog_2026",
    impactRatings: {
      DeltaLw: 29
    },
    impactSystemType: "heavy_floating_floor",
    label: "Getzner AFM 29 catalog DeltaLw",
    match: {
      absentRoles: [],
      resilientLayer: {
        materialIds: ["getzner_afm_29"]
      }
    },
    matchMode: "product_property_delta",
    referenceFloorType: "heavy_standard",
    source: "https://www.getzner.com/media/9347/download/hb-022_abk-020.pdf?v=5",
    sourceType: "official_manufacturer_catalog_pdf",
    trustTier: "official_manufacturer"
  },
  {
    id: "getzner_afm33_catalog_2026",
    impactRatings: {
      DeltaLw: 33
    },
    impactSystemType: "heavy_floating_floor",
    label: "Getzner AFM 33 catalog DeltaLw",
    match: {
      absentRoles: [],
      resilientLayer: {
        materialIds: ["getzner_afm_33"]
      }
    },
    matchMode: "product_property_delta",
    referenceFloorType: "heavy_standard",
    source: "https://www.getzner.com/media/9347/download/hb-022_abk-020.pdf?v=5",
    sourceType: "official_manufacturer_catalog_pdf",
    trustTier: "official_manufacturer"
  },
  {
    id: "getzner_afm35_catalog_2026",
    impactRatings: {
      DeltaLw: 35
    },
    impactSystemType: "heavy_floating_floor",
    label: "Getzner AFM 35 catalog DeltaLw",
    match: {
      absentRoles: [],
      resilientLayer: {
        materialIds: ["getzner_afm_35"]
      }
    },
    matchMode: "product_property_delta",
    referenceFloorType: "heavy_standard",
    source: "https://www.getzner.com/media/9347/download/hb-022_abk-020.pdf?v=5",
    sourceType: "official_manufacturer_catalog_pdf",
    trustTier: "official_manufacturer"
  }
];
