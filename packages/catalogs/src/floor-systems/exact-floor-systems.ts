import type { ExactFloorSystem } from "@dynecho/shared";

import { EURACOUSTICS_CONCRETE_ROWS } from "./euracoustics-concrete-rows";
import { KNAUF_AU_LOW_CONFIDENCE_ROWS } from "./knauf-au-low-confidence-rows";
import { KNAUF_AU_TIMBER_FAMILY_ROWS } from "./knauf-au-timber-family-rows";
import { PLITEQ_STEEL_JOIST_ROWS } from "./pliteq-steel-joist-rows";
import { withFloorSystemSourceUrls } from "./source-url";
import { UBIQ_OPEN_WEB_SUPPORTED_BAND_EXACT_ROWS } from "./ubiq-open-web-supported-band-rows";
import { UBIQ_OPEN_WEB_WEAK_BAND_ROWS } from "./ubiq-open-web-weak-band-rows";

export const EXACT_FLOOR_SYSTEMS: readonly ExactFloorSystem[] = withFloorSystemSourceUrls([
  ...EURACOUSTICS_CONCRETE_ROWS,
  ...KNAUF_AU_LOW_CONFIDENCE_ROWS,
  ...KNAUF_AU_TIMBER_FAMILY_ROWS,
  ...PLITEQ_STEEL_JOIST_ROWS,
  ...UBIQ_OPEN_WEB_SUPPORTED_BAND_EXACT_ROWS,
  ...UBIQ_OPEN_WEB_WEAK_BAND_ROWS,
  {
    id: "pliteq_hcp200_bare_lab_2026",
    label: "Pliteq HCP 200 | bare hollow-core plank | GenieClip ceiling",
    sourceLabel: "Pliteq Australia GenieClip brochure",
    sourceType: "official_manufacturer_system_table",
    trustTier: "official_manufacturer",
    estimateMatch: {
      structuralSupportType: "hollow_core",
      impactSystemType: "suspended_ceiling_only",
      baseSlab: {
        thicknessMm: 200
      },
      lowerTreatment: {
        type: "suspended_ceiling_elastic_hanger",
        boardLayerCount: 1,
        boardThicknessMm: 16
      }
    },
    match: {
      absentRoles: ["floating_screed", "floor_covering", "resilient_layer", "upper_fill", "ceiling_fill"],
      baseStructure: {
        materialIds: ["hollow_core_plank"],
        thicknessMm: 200
      },
      ceilingCavity: {
        materialIds: ["genieclip_rst"],
        thicknessMm: 16
      },
      ceilingBoard: {
        layerCount: 1,
        materialIds: ["gypsum_board"],
        thicknessMm: 16
      }
    },
    systemSummary: {
      carrier: "200 mm hollow-core plank",
      floorBuildUp: "Bare hollow-core floor",
      ceiling: "GenieClip RST suspended ceiling with 1 x 16 mm plasterboard"
    },
    impactRatings: {
      LnW: 55
    },
    airborneRatings: {
      Rw: 62
    }
  },
  {
    id: "pliteq_hcp200_vinyl_lab_2026",
    label: "Pliteq HCP 200 | vinyl + GenieMat RST05 | GenieClip ceiling",
    sourceLabel: "Pliteq Australia GenieClip brochure",
    sourceType: "official_manufacturer_system_table",
    trustTier: "official_manufacturer",
    estimateMatch: {
      structuralSupportType: "hollow_core",
      impactSystemType: "combined_upper_lower_system",
      baseSlab: {
        thicknessMm: 200
      },
      resilientLayer: {
        productId: "geniemat_rst05",
        thicknessMm: 5
      },
      floorCovering: {
        mode: "material_layer",
        materialClass: "vinyl_flooring",
        thicknessMm: 2.5
      },
      lowerTreatment: {
        type: "suspended_ceiling_elastic_hanger",
        boardLayerCount: 1,
        boardThicknessMm: 16
      }
    },
    match: {
      absentRoles: ["floating_screed", "upper_fill", "ceiling_fill"],
      baseStructure: {
        materialIds: ["hollow_core_plank"],
        thicknessMm: 200
      },
      resilientLayer: {
        materialIds: ["geniemat_rst05"],
        thicknessMm: 5
      },
      floorCovering: {
        materialIds: ["vinyl_flooring"]
      },
      ceilingCavity: {
        materialIds: ["genieclip_rst"],
        thicknessMm: 16
      },
      ceilingBoard: {
        layerCount: 1,
        materialIds: ["gypsum_board"],
        thicknessMm: 16
      }
    },
    systemSummary: {
      carrier: "200 mm hollow-core plank",
      floorBuildUp: "Vinyl plank finish over GenieMat RST05 underlayment",
      ceiling: "GenieClip RST suspended ceiling with 1 x 16 mm plasterboard"
    },
    impactRatings: {
      LnW: 48
    },
    airborneRatings: {
      Rw: 62
    }
  },
  {
    id: "pliteq_hcp200_porcelain_lab_2026",
    label: "Pliteq HCP 200 | porcelain + GenieMat RST05 | GenieClip ceiling",
    sourceLabel: "Pliteq Australia GenieClip brochure",
    sourceType: "official_manufacturer_system_table",
    trustTier: "official_manufacturer",
    match: {
      absentRoles: ["floating_screed", "upper_fill", "ceiling_fill"],
      baseStructure: {
        materialIds: ["hollow_core_plank"],
        thicknessMm: 200
      },
      resilientLayer: {
        materialIds: ["geniemat_rst05"],
        thicknessMm: 5
      },
      floorCovering: {
        materialIds: ["porcelain_tile"]
      },
      ceilingCavity: {
        materialIds: ["genieclip_rst"],
        thicknessMm: 16
      },
      ceilingBoard: {
        layerCount: 1,
        materialIds: ["gypsum_board"],
        thicknessMm: 16
      }
    },
    systemSummary: {
      carrier: "200 mm hollow-core plank",
      floorBuildUp: "Porcelain tile finish over GenieMat RST05 underlayment",
      ceiling: "GenieClip RST suspended ceiling with 1 x 16 mm plasterboard"
    },
    impactRatings: {
      LnW: 49
    },
    airborneRatings: {
      Rw: 60
    }
  },
  {
    id: "pliteq_hcp200_rst05_vinyl_no_ceiling_lab_2026",
    label: "Pliteq HCP 200 | vinyl + GenieMat RST05 | no ceiling",
    sourceLabel: "Pliteq Australia GenieClip brochure",
    sourceType: "official_manufacturer_system_table",
    trustTier: "official_manufacturer",
    estimateMatch: {
      structuralSupportType: "hollow_core",
      impactSystemType: "bare_floor",
      baseSlab: {
        thicknessMm: 200
      },
      resilientLayer: {
        productId: "geniemat_rst05",
        thicknessMm: 5
      },
      floorCovering: {
        mode: "material_layer",
        materialClass: "vinyl_flooring",
        thicknessMm: 2.5
      }
    },
    match: {
      absentRoles: ["floating_screed", "upper_fill", "ceiling_board", "ceiling_cavity", "ceiling_fill"],
      baseStructure: {
        materialIds: ["hollow_core_plank"],
        thicknessMm: 200
      },
      resilientLayer: {
        materialIds: ["geniemat_rst05"],
        thicknessMm: 5
      },
      floorCovering: {
        materialIds: ["vinyl_flooring"]
      }
    },
    systemSummary: {
      carrier: "200 mm hollow-core plank",
      floorBuildUp: "Vinyl plank finish over GenieMat RST05 underlayment",
      ceiling: "No suspended ceiling"
    },
    impactRatings: {
      LnW: 58
    },
    airborneRatings: {
      Rw: 53
    }
  },
  {
    id: "pliteq_hcp200_rst12_porcelain_no_ceiling_lab_2026",
    label: "Pliteq HCP 200 | porcelain + GenieMat RST12 | no ceiling",
    sourceLabel: "Pliteq Australia GenieClip brochure",
    sourceType: "official_manufacturer_system_table",
    trustTier: "official_manufacturer",
    estimateMatch: {
      structuralSupportType: "hollow_core",
      impactSystemType: "bare_floor",
      baseSlab: {
        thicknessMm: 200
      },
      resilientLayer: {
        productId: "geniemat_rst12",
        thicknessMm: 12
      },
      floorCovering: {
        mode: "material_layer",
        materialClass: "porcelain_tile",
        thicknessMm: 8
      }
    },
    match: {
      absentRoles: ["floating_screed", "upper_fill", "ceiling_board", "ceiling_cavity", "ceiling_fill"],
      baseStructure: {
        materialIds: ["hollow_core_plank"],
        thicknessMm: 200
      },
      resilientLayer: {
        materialIds: ["geniemat_rst12"],
        thicknessMm: 12
      },
      floorCovering: {
        materialIds: ["porcelain_tile"]
      }
    },
    systemSummary: {
      carrier: "200 mm hollow-core plank",
      floorBuildUp: "Porcelain tile finish over GenieMat RST12 underlayment",
      ceiling: "No suspended ceiling"
    },
    impactRatings: {
      LnW: 59
    },
    airborneRatings: {
      Rw: 55
    }
  },
  {
    id: "pmc_m1_bare_composite_lab_2026",
    label: "PMC M1 | bare composite panel floor",
    sourceLabel: "PMC open-access composite panel floor study",
    sourceType: "open_measured_dataset",
    trustTier: "peer_reviewed_open_access",
    match: {
      absentRoles: ["ceiling_board", "ceiling_cavity", "ceiling_fill", "floating_screed", "floor_covering", "resilient_layer", "upper_fill"],
      baseStructure: {
        materialIds: ["composite_steel_deck"],
        thicknessMm: 150
      }
    },
    systemSummary: {
      carrier: "Composite steel-deck panel floor",
      floorBuildUp: "Bare composite panel without additional upper treatment",
      ceiling: "No suspended ceiling"
    },
    impactRatings: {
      LnW: 84
    },
    airborneRatings: {
      Rw: 27
    }
  },
  {
    id: "pmc_m1_dry_floating_floor_lab_2026",
    label: "PMC M1 | dry floating floor",
    sourceLabel: "PMC open-access composite panel floor study",
    sourceType: "open_measured_dataset",
    trustTier: "peer_reviewed_open_access",
    match: {
      absentRoles: ["ceiling_board", "ceiling_cavity", "ceiling_fill", "floating_screed", "upper_fill"],
      baseStructure: {
        materialIds: ["composite_steel_deck"],
        thicknessMm: 60
      },
      resilientLayer: {
        materialIds: ["generic_resilient_underlay"],
        thicknessMm: 15
      },
      floorCovering: {
        materialIds: ["dry_floating_gypsum_fiberboard"],
        thicknessMm: 25
      }
    },
    systemSummary: {
      carrier: "Composite sandwich panel floor M1",
      floorBuildUp: "15 mm resilient layer + 25 mm dry floating gypsum-fiber floor",
      ceiling: "No suspended ceiling"
    },
    impactRatings: {
      LnW: 68
    },
    airborneRatings: {
      Rw: 47
    }
  },
  {
    id: "pmc_m1_dry_floating_plus_c1x_lab_2026",
    label: "PMC M1 | dry floating floor + C1x ceiling",
    sourceLabel: "PMC open-access composite panel floor study",
    sourceType: "open_measured_dataset",
    trustTier: "peer_reviewed_open_access",
    match: {
      absentRoles: ["floating_screed", "upper_fill"],
      baseStructure: {
        materialIds: ["composite_steel_deck"],
        thicknessMm: 60
      },
      resilientLayer: {
        materialIds: ["generic_resilient_underlay"],
        thicknessMm: 15
      },
      floorCovering: {
        materialIds: ["dry_floating_gypsum_fiberboard"],
        thicknessMm: 25
      },
      ceilingCavity: {
        materialIds: ["acoustic_hanger_ceiling"],
        thicknessMm: 150
      },
      ceilingFill: {
        materialIds: ["rockwool"],
        thicknessMm: 150
      },
      ceilingBoard: {
        layerCount: 1,
        materialIds: ["gypsum_board"],
        thicknessMm: 12.5
      }
    },
    systemSummary: {
      carrier: "Composite sandwich panel floor M1",
      floorBuildUp: "15 mm resilient layer + 25 mm dry floating gypsum-fiber floor",
      ceiling: "C1x suspended ceiling with 150 mm mineral wool and 1 x 12.5 mm gypsum board"
    },
    impactRatings: {
      LnW: 51
    },
    airborneRatings: {
      Rw: 61
    }
  },
  {
    id: "pmc_m1_dry_floating_plus_c2x_lab_2026",
    label: "PMC M1 | dry floating floor + C2x ceiling",
    sourceLabel: "PMC open-access composite panel floor study",
    sourceType: "open_measured_dataset",
    trustTier: "peer_reviewed_open_access",
    estimateMatch: {
      structuralSupportType: "composite_panel",
      impactSystemType: "combined_upper_lower_system",
      baseSlab: {
        thicknessMm: 60
      },
      resilientLayer: {
        thicknessMm: 15
      },
      floorCovering: {
        mode: "material_layer",
        materialClass: "dry_floating_gypsum_fiberboard",
        thicknessMm: 25
      },
      lowerTreatment: {
        type: "suspended_ceiling_elastic_hanger",
        cavityDepthMm: 150,
        cavityFillThicknessMm: 150,
        boardLayerCount: 2,
        boardThicknessMm: 12.5
      }
    },
    match: {
      absentRoles: ["floating_screed", "upper_fill"],
      baseStructure: {
        materialIds: ["composite_steel_deck"],
        thicknessMm: 60
      },
      resilientLayer: {
        materialIds: ["generic_resilient_underlay"],
        thicknessMm: 15
      },
      floorCovering: {
        materialIds: ["dry_floating_gypsum_fiberboard"],
        thicknessMm: 25
      },
      ceilingCavity: {
        materialIds: ["acoustic_hanger_ceiling"],
        thicknessMm: 150
      },
      ceilingFill: {
        materialIds: ["rockwool"],
        thicknessMm: 150
      },
      ceilingBoard: {
        layerCount: 2,
        materialIds: ["gypsum_board"],
        thicknessMm: 12.5
      }
    },
    systemSummary: {
      carrier: "Composite sandwich panel floor M1",
      floorBuildUp: "15 mm resilient layer + 25 mm dry floating gypsum-fiber floor",
      ceiling: "C2x suspended ceiling with 150 mm mineral wool and 2 x 12.5 mm gypsum board"
    },
    impactRatings: {
      LnW: 49
    },
    airborneRatings: {
      Rw: 61
    }
  },
  {
    id: "knauf_ct2g_timber_r25_lab_2026",
    label: "Knauf CT.2G | timber flooring | KI 90G R2.5",
    sourceLabel: "Knauf AU official system table",
    sourceType: "official_manufacturer_system_table",
    trustTier: "official_manufacturer",
    estimateMatch: {
      structuralSupportType: "timber_joists",
      impactSystemType: "suspended_ceiling_only",
      baseSlab: {
        thicknessMm: 240
      },
      floorCovering: {
        mode: "material_layer",
        materialClass: "engineered_timber"
      },
      lowerTreatment: {
        type: "direct_fixed_ceiling",
        cavityFillThicknessMm: 90,
        boardLayerCount: 1,
        boardThicknessMm: 13,
        boardMaterialClass: "impactstop_board",
        supportClass: "furred_channels"
      }
    },
    match: {
      absentRoles: ["ceiling_cavity", "floating_screed", "upper_fill"],
      baseStructure: {
        materialIds: ["timber_joist_floor"],
        thicknessMm: 240
      },
      floorCovering: {
        materialIds: ["engineered_timber_flooring"],
        thicknessMm: 15
      },
      ceilingFill: {
        materialIds: ["rockwool"],
        thicknessMm: 90
      },
      ceilingBoard: {
        layerCount: 1,
        materialIds: ["impactstop_board"],
        thicknessMm: 13
      }
    },
    systemSummary: {
      carrier: "Min 19 mm particleboard flooring on 240 mm timber joists @ 450 mm centres",
      floorBuildUp: "Timber flooring (min 8.5 kg/m²)",
      ceiling: "1 x 13 mm IMPACTSTOP fixed on 28 mm furring channels with KI 90G R2.5 ceiling batts"
    },
    impactRatings: {
      LnW: 69
    },
    airborneRatings: {
      Rw: 54,
      RwCtr: 47
    }
  },
  {
    id: "knauf_ct30_2b_carpet_lab_2026",
    label: "Knauf CT30.2B | carpet + foam underlay | KI 90G R2.5",
    sourceLabel: "Knauf AU official system table",
    sourceType: "official_manufacturer_system_table",
    trustTier: "official_manufacturer",
    estimateMatch: {
      structuralSupportType: "timber_joists",
      impactSystemType: "combined_upper_lower_system",
      baseSlab: {
        thicknessMm: 240
      },
      floorCovering: {
        mode: "material_layer",
        materialClass: "carpet_with_foam_underlay"
      },
      lowerTreatment: {
        type: "direct_fixed_ceiling",
        cavityFillThicknessMm: 90,
        boardLayerCount: 1,
        boardThicknessMm: 16,
        boardMaterialClass: "firestop_board",
        supportClass: "furred_channels"
      }
    },
    match: {
      absentRoles: ["ceiling_cavity", "floating_screed", "upper_fill"],
      baseStructure: {
        materialIds: ["timber_joist_floor"],
        thicknessMm: 240
      },
      floorCovering: {
        materialIds: ["carpet_with_foam_underlay"],
        thicknessMm: 11
      },
      ceilingFill: {
        materialIds: ["rockwool"],
        thicknessMm: 90
      },
      ceilingBoard: {
        layerCount: 1,
        materialIds: ["firestop_board"],
        thicknessMm: 16
      }
    },
    systemSummary: {
      carrier: "Min 19 mm particleboard flooring on 240 mm timber joists @ 450 mm centres",
      floorBuildUp: "Carpet + minimum 3 mm foam underlay",
      ceiling: "1 x 16 mm FIRESTOP on 28 mm furring channels with KI 90G R2.5 ceiling batts"
    },
    impactRatings: {
      LnW: 38
    },
    airborneRatings: {
      Rw: 55,
      RwCtr: 48
    }
  },
  {
    id: "knauf_ct120_1c_timber_lab_2026",
    label: "Knauf CT120.1C | timber + 5 mm acoustic underlay | KI 145G R3.0",
    sourceLabel: "Knauf AU official system table",
    sourceType: "official_manufacturer_system_table",
    trustTier: "official_manufacturer",
    estimateMatch: {
      structuralSupportType: "timber_joists",
      impactSystemType: "combined_upper_lower_system",
      baseSlab: {
        thicknessMm: 240
      },
      floorCovering: {
        mode: "material_layer",
        materialClass: "engineered_timber_with_acoustic_underlay"
      },
      lowerTreatment: {
        type: "suspended_ceiling_elastic_hanger",
        cavityFillThicknessMm: 145,
        boardLayerCount: 3,
        boardThicknessMm: 16,
        boardMaterialClass: "firestop_board"
      }
    },
    match: {
      absentRoles: ["floating_screed", "upper_fill"],
      baseStructure: {
        materialIds: ["timber_joist_floor"],
        thicknessMm: 240
      },
      floorCovering: {
        materialIds: ["engineered_timber_with_acoustic_underlay"],
        thicknessMm: 20
      },
      ceilingCavity: {
        materialIds: ["furring_channel"],
        thicknessMm: 28
      },
      ceilingFill: {
        materialIds: ["rockwool"],
        thicknessMm: 145
      },
      ceilingBoard: {
        layerCount: 3,
        materialIds: ["firestop_board"],
        thicknessMm: 16
      }
    },
    systemSummary: {
      carrier: "Min 19 mm particleboard flooring on 240 mm timber joists @ 450 mm centres",
      floorBuildUp: "Timber flooring + minimum 5 mm acoustic underlay",
      ceiling: "3 x 16 mm FIRESTOP on 28 mm furring channels with acoustic mounts and KI 145G R3.0 ceiling batts"
    },
    impactRatings: {
      LnW: 61
    },
    airborneRatings: {
      Rw: 60,
      RwCtr: 53
    }
  },
  {
    id: "knauf_ct30_1c_timber_lab_2026",
    label: "Knauf CT30.1C | timber flooring | KI 145G R3.0",
    sourceLabel: "Knauf AU official system table",
    sourceType: "official_manufacturer_system_table",
    trustTier: "official_manufacturer",
    match: {
      absentRoles: ["floating_screed", "upper_fill"],
      baseStructure: {
        materialIds: ["timber_joist_floor"],
        thicknessMm: 240
      },
      floorCovering: {
        materialIds: ["engineered_timber_flooring"],
        thicknessMm: 15
      },
      ceilingCavity: {
        materialIds: ["furring_channel"],
        thicknessMm: 28
      },
      ceilingFill: {
        materialIds: ["rockwool"],
        thicknessMm: 145
      },
      ceilingBoard: {
        layerCount: 1,
        materialIds: ["firestop_board"],
        thicknessMm: 13
      }
    },
    systemSummary: {
      carrier: "Min 19 mm particleboard flooring on 240 mm timber joists @ 450 mm centres",
      floorBuildUp: "Timber flooring (min 8.5 kg/m²)",
      ceiling: "1 x 13 mm FIRESTOP on 28 mm furring channels + acoustic mounts with KI 145G R3.0 ceiling batts"
    },
    impactRatings: {
      LnW: 67
    },
    airborneRatings: {
      Rw: 60,
      RwCtr: 53
    }
  },
  {
    id: "knauf_cc60_1a_concrete150_timber_acoustic_underlay_lab_2026",
    label: "Knauf CC60.1A | 150 mm concrete | timber + acoustic underlay",
    sourceLabel: "Knauf AU official system table",
    sourceType: "official_manufacturer_system_table",
    trustTier: "official_manufacturer",
    estimateMatch: {
      structuralSupportType: "reinforced_concrete",
      impactSystemType: "combined_upper_lower_system",
      baseSlab: {
        materialClass: "heavy_concrete",
        thicknessMm: 150
      },
      floorCovering: {
        mode: "material_layer",
        materialClass: "engineered_timber_with_acoustic_underlay"
      },
      lowerTreatment: {
        type: "suspended_ceiling_elastic_hanger",
        cavityDepthMm: 100,
        cavityFillThicknessMm: 50,
        boardLayerCount: 2,
        boardThicknessMm: 13,
        boardMaterialClass: "firestop_board"
      }
    },
    match: {
      absentRoles: ["floating_screed", "resilient_layer", "upper_fill"],
      baseStructure: {
        materialIds: ["concrete"],
        thicknessMm: 150
      },
      floorCovering: {
        materialIds: ["engineered_timber_with_acoustic_underlay"]
      },
      ceilingCavity: {
        materialIds: ["furring_channel"],
        thicknessMm: 100
      },
      ceilingFill: {
        materialIds: ["rockwool"],
        thicknessMm: 50
      },
      ceilingBoard: {
        layerCount: 2,
        materialIds: ["firestop_board"],
        thicknessMm: 13
      }
    },
    systemSummary: {
      carrier: "150 mm reinforced concrete slab",
      floorBuildUp: "Engineered timber finish with acoustic underlay",
      ceiling: "2 x 13 mm FIRESTOP on an acoustically mounted ceiling with 100 mm cavity and 50 mm mineral wool"
    },
    impactRatings: {
      LnW: 51
    },
    airborneRatings: {
      Rw: 63,
      RwCtr: 57
    }
  },
  {
    id: "knauf_cc60_1a_concrete150_carpet_lab_2026",
    label: "Knauf CC60.1A | 150 mm concrete | carpet + foam underlay",
    sourceLabel: "Knauf AU official system table",
    sourceType: "official_manufacturer_system_table",
    trustTier: "official_manufacturer",
    match: {
      absentRoles: ["floating_screed", "resilient_layer", "upper_fill"],
      baseStructure: {
        materialIds: ["concrete"],
        thicknessMm: 150
      },
      floorCovering: {
        materialIds: ["carpet_with_foam_underlay"]
      },
      ceilingCavity: {
        materialIds: ["furring_channel"],
        thicknessMm: 100
      },
      ceilingFill: {
        materialIds: ["rockwool"],
        thicknessMm: 50
      },
      ceilingBoard: {
        layerCount: 2,
        materialIds: ["firestop_board"],
        thicknessMm: 13
      }
    },
    systemSummary: {
      carrier: "150 mm reinforced concrete slab",
      floorBuildUp: "Carpet with foam underlay",
      ceiling: "2 x 13 mm FIRESTOP on an acoustically mounted ceiling with 100 mm cavity and 50 mm mineral wool"
    },
    impactRatings: {
      LnW: 31
    },
    airborneRatings: {
      Rw: 63,
      RwCtr: 57
    }
  },
  {
    id: "knauf_cc60_1b_concrete200_tile_acoustic_underlay_lab_2026",
    label: "Knauf CC60.1B | 200 mm concrete | tile + acoustic underlay",
    sourceLabel: "Knauf AU official system table",
    sourceType: "official_manufacturer_system_table",
    trustTier: "official_manufacturer",
    match: {
      absentRoles: ["floating_screed", "resilient_layer", "upper_fill"],
      baseStructure: {
        materialIds: ["concrete"],
        thicknessMm: 200
      },
      floorCovering: {
        materialIds: ["ceramic_tile"]
      },
      ceilingCavity: {
        materialIds: ["furring_channel"],
        thicknessMm: 300
      },
      ceilingFill: {
        materialIds: ["rockwool"],
        thicknessMm: 50
      },
      ceilingBoard: {
        layerCount: 2,
        materialIds: ["firestop_board"],
        thicknessMm: 13
      }
    },
    systemSummary: {
      carrier: "200 mm reinforced concrete slab",
      floorBuildUp: "Tile finish with acoustic underlay",
      ceiling: "2 x 13 mm FIRESTOP on a suspended ceiling with 300 mm cavity and 50 mm mineral wool"
    },
    impactRatings: {
      LnW: 45
    },
    airborneRatings: {
      Rw: 69,
      RwCtr: 64
    }
  },
  {
    id: "dataholz_gdsnxn01a_timber_frame_lab_2026",
    label: "Dataholz GDSNXN01A | timber frame | wet screed + fill | no lining",
    sourceLabel: "Dataholz open component library",
    sourceType: "official_open_component_library",
    trustTier: "official_manufacturer",
    match: {
      absentRoles: ["ceiling_board", "ceiling_cavity", "ceiling_fill", "floor_covering"],
      baseStructure: {
        materialIds: ["timber_frame_floor"],
        thicknessMm: 220
      },
      resilientLayer: {
        materialIds: ["mw_t_impact_layer"],
        thicknessMm: 30
      },
      floatingScreed: {
        materialIds: ["screed"],
        thicknessMm: 70
      },
      upperFill: {
        materialIds: ["generic_fill"],
        thicknessMm: 100
      }
    },
    systemSummary: {
      carrier: "220 mm timber frame joists @ 800 mm centres with diagonal spruce planking",
      floorBuildUp: "70 mm cement screed + 30 mm impact subflooring MW-T [s'=10 MN/m3] + 100 mm loose fill",
      ceiling: "No additional suspended lining declared"
    },
    impactRatings: {
      CI: 2,
      LnW: 52,
      LnWPlusCI: 54
    },
    airborneRatings: {
      Rw: 68,
      RwCtr: -6,
      RwCtrSemantic: "ctr_term"
    }
  },
  {
    id: "dataholz_gdrnxa01a_timber_frame_lab_2026",
    label: "Dataholz GDRNXA01A | timber frame | wet screed | resilient channel ceiling",
    sourceLabel: "Dataholz open component library",
    sourceType: "official_open_component_library",
    trustTier: "official_manufacturer",
    estimateMatch: {
      structuralSupportType: "timber_joists",
      impactSystemType: "combined_upper_lower_system",
      baseSlab: {
        thicknessMm: 200
      },
      resilientLayer: {
        thicknessMm: 30
      },
      floatingScreed: {
        materialClass: "generic_screed",
        thicknessMm: 50
      },
      floorCovering: {
        mode: "none"
      },
      lowerTreatment: {
        type: "suspended_ceiling_rigid_hanger",
        cavityDepthMm: 27,
        cavityFillThicknessMm: 100,
        boardLayerCount: 1,
        boardThicknessMm: 12.5,
        boardMaterialClass: "generic_gypsum_board"
      }
    },
    match: {
      absentRoles: ["floor_covering"],
      baseStructure: {
        materialIds: ["timber_frame_floor"],
        thicknessMm: 200
      },
      resilientLayer: {
        materialIds: ["mw_t_impact_layer"],
        thicknessMm: 30
      },
      floatingScreed: {
        materialIds: ["screed"],
        thicknessMm: 50
      },
      ceilingCavity: {
        materialIds: ["resilient_channel"],
        thicknessMm: 27
      },
      ceilingFill: {
        materialIds: ["rockwool"],
        thicknessMm: 100
      },
      ceilingBoard: {
        layerCount: 1,
        materialIds: ["gypsum_board"],
        thicknessMm: 12.5
      }
    },
    systemSummary: {
      carrier: "200 mm timber frame joists @ 625 mm centres with OSB deck",
      floorBuildUp: "50 mm anhydrite/cement screed + 30 mm impact subflooring MW-T on 18 mm OSB",
      ceiling: "27 mm resilient channel ceiling with 1 x 12.5 mm gypsum/fibre board and 100 mm mineral wool"
    },
    impactRatings: {
      CI: 0,
      LnW: 53,
      LnWPlusCI: 53
    },
    airborneRatings: {
      Rw: 66,
      RwCtr: -7,
      RwCtrSemantic: "ctr_term"
    }
  },
  {
    id: "dataholz_gdrnxa05b_timber_frame_lab_2026",
    label: "Dataholz GDRNXA05B | timber frame | wet screed | resilient channel ceiling",
    sourceLabel: "Dataholz open component library",
    sourceType: "official_open_component_library",
    trustTier: "official_manufacturer",
    estimateMatch: {
      structuralSupportType: "timber_joists",
      impactSystemType: "combined_upper_lower_system",
      baseSlab: {
        thicknessMm: 220,
        densityKgM3: 450
      },
      resilientLayer: {
        thicknessMm: 30,
        dynamicStiffnessMNm3: 10
      },
      floatingScreed: {
        materialClass: "generic_screed",
        thicknessMm: 50,
        densityKgM3: 2200
      },
      floorCovering: {
        mode: "none"
      },
      lowerTreatment: {
        type: "suspended_ceiling_rigid_hanger",
        cavityDepthMm: 27,
        cavityFillThicknessMm: 100,
        boardLayerCount: 2,
        boardThicknessMm: 12.5,
        boardMaterialClass: "generic_gypsum_board"
      }
    },
    match: {
      absentRoles: ["floor_covering", "upper_fill"],
      baseStructure: {
        materialIds: ["timber_frame_floor"],
        thicknessMm: 220
      },
      resilientLayer: {
        materialIds: ["mw_t_impact_layer"],
        thicknessMm: 30
      },
      floatingScreed: {
        materialIds: ["screed"],
        thicknessMm: 50
      },
      ceilingCavity: {
        materialIds: ["resilient_channel"],
        thicknessMm: 27
      },
      ceilingFill: {
        materialIds: ["rockwool"],
        thicknessMm: 100
      },
      ceilingBoard: {
        layerCount: 2,
        materialIds: ["gypsum_board"],
        thicknessMm: 12.5
      }
    },
    systemSummary: {
      carrier: "220 mm timber frame joists @ 625 mm centres with OSB decking",
      floorBuildUp: "50 mm anhydrite/cement screed + 30 mm impact subflooring MW-T [s'=10 MN/m3]",
      ceiling: "27 mm resilient channel ceiling with 2 x 12.5 mm gypsum plasterboard type DF and 100 mm mineral wool"
    },
    impactRatings: {
      CI: 0,
      LnW: 60,
      LnWPlusCI: 60
    },
    airborneRatings: {
      Rw: 58,
      RwCtr: -7,
      RwCtrSemantic: "ctr_term"
    }
  },
  {
    id: "dataholz_gdrnxa07a_timber_frame_lab_2026",
    label: "Dataholz GDRNXA07A | timber frame | wet screed + fill | resilient channel ceiling",
    sourceLabel: "Dataholz open component library",
    sourceType: "official_open_component_library",
    trustTier: "official_manufacturer",
    estimateMatch: {
      structuralSupportType: "timber_joists",
      impactSystemType: "combined_upper_lower_system",
      baseSlab: {
        thicknessMm: 220,
        densityKgM3: 450
      },
      resilientLayer: {
        thicknessMm: 30,
        dynamicStiffnessMNm3: 10
      },
      floatingScreed: {
        materialClass: "generic_screed",
        thicknessMm: 50,
        densityKgM3: 2000
      },
      upperFill: {
        materialClass: "generic_fill",
        thicknessMm: 40,
        densityKgM3: 1800
      },
      floorCovering: {
        mode: "none"
      },
      lowerTreatment: {
        type: "suspended_ceiling_rigid_hanger",
        cavityDepthMm: 27,
        cavityFillThicknessMm: 120,
        boardLayerCount: 1,
        boardThicknessMm: 12.5,
        boardMaterialClass: "generic_gypsum_board"
      }
    },
    match: {
      absentRoles: ["floor_covering"],
      baseStructure: {
        materialIds: ["timber_frame_floor"],
        thicknessMm: 220
      },
      resilientLayer: {
        materialIds: ["mw_t_impact_layer"],
        thicknessMm: 30
      },
      floatingScreed: {
        materialIds: ["screed"],
        thicknessMm: 50
      },
      upperFill: {
        materialIds: ["generic_fill"],
        thicknessMm: 40
      },
      ceilingCavity: {
        materialIds: ["resilient_channel"],
        thicknessMm: 27
      },
      ceilingFill: {
        materialIds: ["rockwool"],
        thicknessMm: 120
      },
      ceilingBoard: {
        layerCount: 1,
        materialIds: ["gypsum_board"],
        thicknessMm: 12.5
      }
    },
    systemSummary: {
      carrier: "220 mm timber frame joists @ 625 mm centres with OSB deck and loose fill",
      floorBuildUp: "50 mm cement/anhydrite screed + 30 mm impact subflooring MW-T [s'=10 MN/m3] + 40 mm loose fill",
      ceiling: "27 mm resilient channel ceiling with 1 x 12.5 mm gypsum plasterboard type DF and 120 mm mineral wool"
    },
    impactRatings: {
      CI: 1,
      LnW: 41,
      LnWPlusCI: 42
    },
    airborneRatings: {
      Rw: 70,
      RwCtr: -5,
      RwCtrSemantic: "ctr_term"
    }
  },
  {
    id: "dataholz_gdrnxa11a_timber_frame_lab_2026",
    label: "Dataholz GDRNXA11A | timber frame | wet screed + bonded fill | resilient channel ceiling",
    sourceLabel: "Dataholz open component library",
    sourceType: "official_open_component_library",
    trustTier: "official_manufacturer",
    estimateMatch: {
      structuralSupportType: "timber_joists",
      impactSystemType: "combined_upper_lower_system",
      baseSlab: {
        thicknessMm: 240
      },
      resilientLayer: {
        thicknessMm: 30,
        dynamicStiffnessMNm3: 10
      },
      floatingScreed: {
        materialClass: "generic_screed",
        thicknessMm: 60
      },
      upperFill: {
        materialClass: "generic_fill",
        thicknessMm: 60
      },
      floorCovering: {
        mode: "none"
      },
      lowerTreatment: {
        type: "suspended_ceiling_rigid_hanger",
        cavityDepthMm: 27,
        cavityFillThicknessMm: 100,
        boardLayerCount: 1,
        boardThicknessMm: 12.5,
        boardMaterialClass: "generic_gypsum_board"
      }
    },
    match: {
      absentRoles: ["floor_covering"],
      baseStructure: {
        materialIds: ["timber_frame_floor"],
        thicknessMm: 240
      },
      resilientLayer: {
        materialIds: ["mw_t_impact_layer"],
        thicknessMm: 30
      },
      floatingScreed: {
        materialIds: ["screed"],
        thicknessMm: 60
      },
      upperFill: {
        materialIds: ["generic_fill"],
        thicknessMm: 60
      },
      ceilingCavity: {
        materialIds: ["resilient_channel"],
        thicknessMm: 27
      },
      ceilingFill: {
        materialIds: ["rockwool"],
        thicknessMm: 100
      },
      ceilingBoard: {
        layerCount: 1,
        materialIds: ["gypsum_board"],
        thicknessMm: 12.5
      }
    },
    systemSummary: {
      carrier: "240 mm timber frame joists @ 300 mm centres with OSB deck and elastic bonded fill",
      floorBuildUp: "60 mm cement screed + 30 mm MW-T impact layer + 60 mm elastic bonded fill",
      ceiling: "27 mm resilient channel ceiling with 1 x 12.5 mm gypsum/fibre board and 100 mm mineral wool"
    },
    impactRatings: {
      CI: 2,
      CI50_2500: 14,
      LnW: 42,
      LnWPlusCI: 44
    },
    airborneRatings: {
      Rw: 83,
      RwCtr: -17,
      RwCtrSemantic: "ctr_term"
    }
  },
  {
    id: "dataholz_gdrnxa03b_timber_frame_lab_2026",
    label: "Dataholz GDRNXA03B | timber frame | wet screed + elastic bonded fill | resilient channel ceiling",
    sourceLabel: "Dataholz open component library",
    sourceType: "official_open_component_library",
    trustTier: "official_manufacturer",
    match: {
      absentRoles: ["floor_covering"],
      baseStructure: {
        materialIds: ["timber_frame_floor"],
        thicknessMm: 240
      },
      resilientLayer: {
        materialIds: ["mw_t_impact_layer"],
        thicknessMm: 30
      },
      floatingScreed: {
        materialIds: ["screed"],
        thicknessMm: 60
      },
      upperFill: {
        materialIds: ["elastic_bonded_fill"],
        thicknessMm: 60
      },
      ceilingCavity: {
        materialIds: ["resilient_channel"],
        thicknessMm: 27
      },
      ceilingFill: {
        materialIds: ["rockwool"],
        thicknessMm: 100
      },
      ceilingBoard: {
        layerCount: 1,
        materialIds: ["gypsum_board"],
        thicknessMm: 25
      }
    },
    systemSummary: {
      carrier: "240 mm timber frame joists @ 625 mm centres with OSB deck and elastic bonded fill",
      floorBuildUp: "60 mm cement screed + 30 mm impact subflooring MW-T [s'=10 MN/m3] + 60 mm elastic bonded (PUR) chippings",
      ceiling: "27 mm resilient channel ceiling with 1 x 25 mm gypsum plasterboard type DF or gypsum fibre board and 100 mm mineral wool"
    },
    impactRatings: {
      CI: 0,
      LnW: 47,
      LnWPlusCI: 47
    },
    airborneRatings: {
      Rw: 74,
      RwCtr: -12,
      RwCtrSemantic: "ctr_term"
    }
  },
  {
    id: "dataholz_gdrtxn01a_timber_frame_dry_lab_2026",
    label: "Dataholz GDRTXN01A | timber frame | dry floor + fill | direct lining",
    sourceLabel: "Dataholz open component library",
    sourceType: "official_open_component_library",
    trustTier: "official_manufacturer",
    estimateMatch: {
      structuralSupportType: "timber_joists",
      impactSystemType: "combined_upper_lower_system",
      baseSlab: {
        thicknessMm: 220
      },
      resilientLayer: {
        thicknessMm: 30
      },
      upperFill: {
        materialClass: "generic_fill",
        thicknessMm: 40
      },
      floorCovering: {
        mode: "material_layer",
        materialClass: "dry_floating_gypsum_fiberboard",
        thicknessMm: 25,
        densityKgM3: 900
      },
      lowerTreatment: {
        type: "direct_fixed_ceiling",
        cavityFillThicknessMm: 100,
        boardLayerCount: 1,
        boardThicknessMm: 12.5,
        boardMaterialClass: "generic_gypsum_board"
      }
    },
    match: {
      absentRoles: ["ceiling_cavity", "floating_screed"],
      baseStructure: {
        materialIds: ["timber_frame_floor"],
        thicknessMm: 220
      },
      resilientLayer: {
        materialIds: ["mw_t_impact_layer"],
        thicknessMm: 30
      },
      upperFill: {
        materialIds: ["generic_fill"],
        thicknessMm: 40
      },
      floorCovering: {
        materialIds: ["dry_floating_gypsum_fiberboard"],
        thicknessMm: 25
      },
      ceilingFill: {
        materialIds: ["rockwool"],
        thicknessMm: 100
      },
      ceilingBoard: {
        layerCount: 1,
        materialIds: ["gypsum_board"],
        thicknessMm: 12.5
      }
    },
    systemSummary: {
      carrier: "220 mm timber frame joists with OSB deck and direct lining",
      floorBuildUp: "25 mm dry screed + 30 mm MW-T impact layer + 40 mm fill on OSB",
      ceiling: "Direct lining with 100 mm mineral wool and 1 x 12.5 mm gypsum/fibre board"
    },
    impactRatings: {
      CI: 2,
      LnW: 58,
      LnWPlusCI: 60
    },
    airborneRatings: {
      Rw: 63,
      RwCtr: -12,
      RwCtrSemantic: "ctr_term"
    }
  },
  {
    id: "dataholz_gdrtxn02b_timber_frame_dry_lab_2026",
    label: "Dataholz GDRTXN02B | timber frame | dry floor + fill | direct lining",
    sourceLabel: "Dataholz open component library",
    sourceType: "official_open_component_library",
    trustTier: "official_manufacturer",
    estimateMatch: {
      structuralSupportType: "timber_joists",
      impactSystemType: "combined_upper_lower_system",
      baseSlab: {
        thicknessMm: 220
      },
      resilientLayer: {
        thicknessMm: 30
      },
      upperFill: {
        materialClass: "generic_fill",
        thicknessMm: 40,
        densityKgM3: 1800
      },
      floorCovering: {
        mode: "material_layer",
        materialClass: "dry_floating_gypsum_fiberboard",
        thicknessMm: 25,
        densityKgM3: 900
      },
      lowerTreatment: {
        type: "direct_fixed_ceiling",
        cavityFillThicknessMm: 100,
        boardLayerCount: 2,
        boardThicknessMm: 12.5,
        boardMaterialClass: "generic_gypsum_board"
      }
    },
    match: {
      absentRoles: ["ceiling_cavity", "floating_screed"],
      baseStructure: {
        materialIds: ["timber_frame_floor"],
        thicknessMm: 220
      },
      resilientLayer: {
        materialIds: ["mw_t_impact_layer"],
        thicknessMm: 30
      },
      upperFill: {
        materialIds: ["generic_fill"],
        thicknessMm: 40
      },
      floorCovering: {
        materialIds: ["dry_floating_gypsum_fiberboard"],
        thicknessMm: 25
      },
      ceilingFill: {
        materialIds: ["rockwool"],
        thicknessMm: 100
      },
      ceilingBoard: {
        layerCount: 2,
        materialIds: ["gypsum_board"],
        thicknessMm: 12.5
      }
    },
    systemSummary: {
      carrier: "220 mm timber frame joists with particleboard deck and direct lining",
      floorBuildUp: "25 mm dry screed + 30 mm MW-T impact layer + 40 mm fill on particleboard",
      ceiling: "Direct lining with 100 mm mineral wool and 2 x 12.5 mm gypsum board"
    },
    impactRatings: {
      CI: 2,
      LnW: 62,
      LnWPlusCI: 64
    },
    airborneRatings: {
      Rw: 60,
      RwCtr: -12,
      RwCtrSemantic: "ctr_term"
    }
  },
  {
    id: "dataholz_gdrtxa03b_timber_frame_dry_lab_2026",
    label: "Dataholz GDRTXA03B | timber frame | dry floor | resilient channel ceiling",
    sourceLabel: "Dataholz open component library",
    sourceType: "official_open_component_library",
    trustTier: "official_manufacturer",
    estimateMatch: {
      structuralSupportType: "timber_joists",
      impactSystemType: "combined_upper_lower_system",
      baseSlab: {
        thicknessMm: 240
      },
      resilientLayer: {
        thicknessMm: 30
      },
      floorCovering: {
        mode: "material_layer",
        materialClass: "dry_floating_gypsum_fiberboard",
        thicknessMm: 25,
        densityKgM3: 900
      },
      lowerTreatment: {
        type: "suspended_ceiling_rigid_hanger",
        cavityDepthMm: 27,
        cavityFillThicknessMm: 100,
        boardLayerCount: 2,
        boardThicknessMm: 12.5,
        boardMaterialClass: "generic_gypsum_board"
      }
    },
    match: {
      absentRoles: ["floating_screed", "upper_fill"],
      baseStructure: {
        materialIds: ["timber_frame_floor"],
        thicknessMm: 240
      },
      resilientLayer: {
        materialIds: ["mw_t_impact_layer"],
        thicknessMm: 30
      },
      floorCovering: {
        materialIds: ["dry_floating_gypsum_fiberboard"],
        thicknessMm: 25
      },
      ceilingCavity: {
        materialIds: ["resilient_channel"],
        thicknessMm: 27
      },
      ceilingFill: {
        materialIds: ["rockwool"],
        thicknessMm: 100
      },
      ceilingBoard: {
        layerCount: 2,
        materialIds: ["gypsum_board"],
        thicknessMm: 12.5
      }
    },
    systemSummary: {
      carrier: "240 mm timber frame joists with dry floor deck",
      floorBuildUp: "25 mm dry screed + 30 mm MW-T impact layer",
      ceiling: "27 mm resilient channel ceiling with 2 x 12.5 mm gypsum board and 100 mm mineral wool"
    },
    impactRatings: {
      CI: 2,
      LnW: 51,
      LnWPlusCI: 53
    },
    airborneRatings: {
      Rw: 65,
      RwCtr: -9,
      RwCtrSemantic: "ctr_term"
    }
  },
  {
    id: "dataholz_gdrtxa06a_timber_frame_dry_lab_2026",
    label: "Dataholz GDRTXA06A | timber frame | integrated dry floor | acoustic direct hanger ceiling",
    sourceLabel: "Dataholz open component library",
    sourceType: "official_open_component_library",
    trustTier: "official_manufacturer",
    manualMatch: false,
    estimateMatch: {
      structuralSupportType: "timber_joists",
      impactSystemType: "combined_upper_lower_system",
      baseSlab: {
        thicknessMm: 200
      },
      floorCovering: {
        mode: "material_layer",
        materialClass: "dry_floating_gypsum_fiberboard",
        thicknessMm: 65,
        densityKgM3: 900
      },
      lowerTreatment: {
        type: "suspended_ceiling_elastic_hanger",
        cavityDepthMm: 60,
        cavityFillThicknessMm: 200,
        boardLayerCount: 1,
        boardThicknessMm: 15,
        boardMaterialClass: "generic_gypsum_board"
      }
    },
    match: {
      absentRoles: ["floating_screed", "resilient_layer", "upper_fill"],
      baseStructure: {
        materialIds: ["timber_frame_floor"],
        thicknessMm: 200
      },
      floorCovering: {
        materialIds: ["dry_floating_gypsum_fiberboard"],
        thicknessMm: 65
      },
      ceilingCavity: {
        materialIds: ["acoustic_hanger_ceiling"],
        thicknessMm: 60
      },
      ceilingFill: {
        materialIds: ["rockwool"],
        thicknessMm: 200
      },
      ceilingBoard: {
        layerCount: 1,
        materialIds: ["gypsum_board"],
        thicknessMm: 15
      }
    },
    systemSummary: {
      carrier: "200 mm timber frame joists with OSB deck",
      floorBuildUp: "65 mm Rigidur flooring element 65 MW on 18 mm OSB",
      ceiling: "Rigips acoustic direct hanger with CD 60/27 under open timber formwork, 200 mm mineral wool, and 15 mm gypsum-fiber board"
    },
    impactRatings: {
      CI: 1,
      LnW: 52,
      LnWPlusCI: 53
    },
    airborneRatings: {
      Rw: 66,
      RwCtr: -15,
      RwCtrSemantic: "ctr_term"
    }
  },
  {
    id: "dataholz_gdmnxn02_wet_clt_lab_2026",
    label: "Dataholz GDMNXN02 | CLT floor | wet screed | no lining",
    sourceLabel: "Dataholz open component library",
    sourceType: "official_open_component_library",
    trustTier: "official_manufacturer",
    estimateMatch: {
      structuralSupportType: "mass_timber_clt",
      impactSystemType: "heavy_floating_floor",
      baseSlab: {
        thicknessMm: 140
      },
      resilientLayer: {
        thicknessMm: 30,
        dynamicStiffnessMNm3: 35
      },
      upperFill: {
        materialClass: "bonded_chippings",
        thicknessMm: 60,
        densityKgM3: 1800
      },
      floatingScreed: {
        materialClass: "generic_screed",
        thicknessMm: 60,
        densityKgM3: 2000
      }
    },
    match: {
      absentRoles: ["ceiling_board", "ceiling_cavity", "ceiling_fill", "floor_covering"],
      baseStructure: {
        materialIds: ["clt_panel"],
        thicknessMm: 140
      },
      resilientLayer: {
        materialIds: ["mw_t_impact_layer_s35"],
        thicknessMm: 30
      },
      floatingScreed: {
        materialIds: ["screed"],
        thicknessMm: 60
      },
      upperFill: {
        materialIds: ["bonded_chippings"],
        thicknessMm: 60
      }
    },
    systemSummary: {
      carrier: "140 mm cross-laminated timber, minimum 5-ply",
      floorBuildUp: "60 mm cement screed + 30 mm MW-T impact layer [s'=35 MN/m3] + 60 mm bonded chippings",
      ceiling: "No lining below"
    },
    impactRatings: {
      CI: -2,
      LnW: 65,
      LnWPlusCI: 63
    },
    airborneRatings: {
      Rw: 54
    }
  },
  {
    id: "dataholz_gdmnxn02_05_wet_clt_lab_2026",
    label: "Dataholz GDMNXN02-05 | CLT floor | wet screed + fill | no lining",
    sourceLabel: "Dataholz open component library",
    sourceType: "official_open_component_library",
    sourceUrl: "https://www.dataholz.eu/en/components/intermediate-floor/version/kz/gdmnxn02/nr/05.htm",
    trustTier: "official_manufacturer",
    estimateMatch: {
      structuralSupportType: "mass_timber_clt",
      impactSystemType: "heavy_floating_floor",
      baseSlab: {
        thicknessMm: 160
      },
      resilientLayer: {
        thicknessMm: 30,
        dynamicStiffnessMNm3: 10
      },
      upperFill: {
        materialClass: "non_bonded_chippings",
        thicknessMm: 60,
        densityKgM3: 1800
      },
      floatingScreed: {
        materialClass: "generic_screed",
        thicknessMm: 60,
        densityKgM3: 2000
      }
    },
    match: {
      absentRoles: ["ceiling_board", "ceiling_cavity", "ceiling_fill", "floor_covering"],
      baseStructure: {
        materialIds: ["clt_panel"],
        thicknessMm: 160
      },
      resilientLayer: {
        materialIds: ["mw_t_impact_layer"],
        thicknessMm: 30
      },
      floatingScreed: {
        materialIds: ["screed"],
        thicknessMm: 60
      },
      upperFill: {
        materialIds: ["non_bonded_chippings"],
        thicknessMm: 60
      }
    },
    systemSummary: {
      carrier: "160 mm CLT, minimum 40 mm first layer",
      floorBuildUp: "60 mm cement screed + 30 mm MW-T impact layer [s'=10 MN/m3] + 60 mm non-bonded chippings",
      ceiling: "No lining below"
    },
    impactRatings: {
      CI: 2,
      CI50_2500: 4,
      LnW: 47,
      LnWPlusCI: 49
    },
    airborneRatings: {
      Rw: 74,
      RwCtr: -7,
      RwCtrSemantic: "ctr_term"
    }
  },
  {
    id: "dataholz_gdmnxn05_wet_clt_lab_2026",
    label: "Dataholz GDMNXN05 | CLT floor | wet screed + fill | no lining",
    sourceLabel: "Dataholz open component library",
    sourceType: "official_open_component_library",
    trustTier: "official_manufacturer",
    match: {
      absentRoles: ["ceiling_board", "ceiling_cavity", "ceiling_fill", "floor_covering"],
      baseStructure: {
        materialIds: ["clt_panel"],
        thicknessMm: 150
      },
      resilientLayer: {
        materialIds: ["mw_t_impact_layer"],
        thicknessMm: 30
      },
      floatingScreed: {
        materialIds: ["screed"],
        thicknessMm: 70
      },
      upperFill: {
        materialIds: ["non_bonded_chippings"],
        thicknessMm: 100
      }
    },
    systemSummary: {
      carrier: "150 mm CLT, 5-ply",
      floorBuildUp: "70 mm cement screed + 30 mm MW-T impact layer + 100 mm non-bonded chippings",
      ceiling: "No lining below"
    },
    impactRatings: {
      CI: -1,
      LnW: 45,
      LnWPlusCI: 44
    },
    airborneRatings: {
      Rw: 74
    }
  },
  {
    id: "dataholz_gdmtxn01_dry_clt_lab_2026",
    label: "Dataholz GDMTXN01 | CLT floor | dry screed | no lining",
    sourceLabel: "Dataholz open component library",
    sourceType: "official_open_component_library",
    trustTier: "official_manufacturer",
    match: {
      absentRoles: ["ceiling_board", "ceiling_cavity", "ceiling_fill", "floating_screed"],
      baseStructure: {
        materialIds: ["clt_panel"],
        thicknessMm: 140
      },
      resilientLayer: {
        materialIds: ["mw_t_impact_layer_s40"],
        thicknessMm: 30
      },
      upperFill: {
        materialIds: ["elastic_bonded_fill"],
        thicknessMm: 60
      },
      floorCovering: {
        materialIds: ["dry_floating_gypsum_fiberboard"],
        thicknessMm: 25
      }
    },
    systemSummary: {
      carrier: "140 mm cross-laminated timber",
      floorBuildUp: "25 mm dry screed + 30 mm MW-T impact layer [s'=40 MN/m3] + 60 mm elastic bonded fill",
      ceiling: "No lining below"
    },
    impactRatings: {
      CI: -1,
      LnW: 50,
      LnWPlusCI: 49
    },
    airborneRatings: {
      Rw: 62
    }
  },
  {
    id: "dataholz_gdmnxn06_fill_clt_lab_2026",
    label: "Dataholz GDMNXN06 | CLT floor | wet screed + resilient fill | no lining",
    sourceLabel: "Dataholz open component library",
    sourceType: "official_open_component_library",
    sourceUrl: "https://www.dataholz.eu/en/components/multi-storey-housing/version/kz/gdmnxn06/nr/05.htm",
    trustTier: "official_manufacturer",
    match: {
      absentRoles: ["ceiling_board", "ceiling_cavity", "ceiling_fill", "floor_covering"],
      baseStructure: {
        materialIds: ["clt_panel"],
        thicknessMm: 160
      },
      resilientLayer: {
        materialIds: ["mw_t_impact_layer_s6"],
        thicknessMm: 40
      },
      floatingScreed: {
        materialIds: ["screed"],
        thicknessMm: 60
      },
      upperFill: {
        materialIds: ["non_bonded_chippings"],
        thicknessMm: 120
      }
    },
    systemSummary: {
      carrier: "160 mm CLT, 5-ply",
      floorBuildUp: "60 mm cement screed + 40 mm MW-T impact layer [s'=6 MN/m3] + 120 mm non-bonded chippings",
      ceiling: "No lining below"
    },
    impactRatings: {
      CI: -1,
      CI50_2500: 7,
      LnW: 39,
      LnWPlusCI: 38
    },
    airborneRatings: {
      Rw: 78
    }
  },
  {
    id: "dataholz_gdmnxa02a_00_clt_lab_2026",
    label: "Dataholz GDMNXA02A-00 | CLT floor | wet screed + suspended lining",
    sourceLabel: "Dataholz open component library",
    sourceType: "official_open_component_library",
    sourceUrl: "https://www.dataholz.eu/en/index/download/en/gdmnxa02a-0.pdf",
    trustTier: "official_manufacturer",
    manualMatch: false,
    match: {
      absentRoles: ["floor_covering"],
      baseStructure: {
        materialIds: ["clt_panel"],
        thicknessMm: 140
      },
      resilientLayer: {
        materialIds: ["mw_t_impact_layer_s35"],
        thicknessMm: 30
      },
      floatingScreed: {
        materialIds: ["screed"],
        thicknessMm: 60
      },
      upperFill: {
        materialIds: ["non_bonded_chippings"],
        thicknessMm: 60
      },
      ceilingCavity: {
        materialIds: ["acoustic_hanger_ceiling"],
        thicknessMm: 70
      },
      ceilingFill: {
        materialIds: ["rockwool"],
        thicknessMm: 60
      },
      ceilingBoard: {
        layerCount: 1,
        materialIds: ["gypsum_board"],
        thicknessMm: 12.5
      }
    },
    systemSummary: {
      carrier: "140 mm cross laminated timber, minimum 5-ply",
      floorBuildUp: "60 mm cement screed + 30 mm MW-T impact layer [s'=35 MN/m3] + 60 mm non-bonded chippings",
      ceiling: "70 mm acoustic hanger ceiling with 60 mm mineral wool and 1 x 12.5 mm gypsum board"
    },
    impactRatings: {
      LnW: 53
    },
    airborneRatings: {
      Rw: 61,
      RwCtr: -8,
      RwCtrSemantic: "ctr_term"
    }
  },
  {
    id: "dataholz_gdmnxa02a_02_clt_lab_2026",
    label: "Dataholz GDMNXA02A-02 | CLT floor | wet screed + suspended lining",
    sourceLabel: "Dataholz open component library",
    sourceType: "official_open_component_library",
    sourceUrl: "https://www.dataholz.eu/en/index/download/en/gdmnxa02a-2.pdf",
    trustTier: "official_manufacturer",
    manualMatch: false,
    match: {
      absentRoles: ["floor_covering"],
      baseStructure: {
        materialIds: ["clt_panel"],
        thicknessMm: 140
      },
      resilientLayer: {
        materialIds: ["mw_t_impact_layer"],
        thicknessMm: 30
      },
      floatingScreed: {
        materialIds: ["screed"],
        thicknessMm: 60
      },
      upperFill: {
        materialIds: ["non_bonded_chippings"],
        thicknessMm: 60
      },
      ceilingCavity: {
        materialIds: ["acoustic_hanger_ceiling"],
        thicknessMm: 70
      },
      ceilingFill: {
        materialIds: ["rockwool"],
        thicknessMm: 60
      },
      ceilingBoard: {
        layerCount: 1,
        materialIds: ["gypsum_board"],
        thicknessMm: 12.5
      }
    },
    systemSummary: {
      carrier: "140 mm cross laminated timber, minimum 5-ply",
      floorBuildUp: "60 mm cement screed + 30 mm MW-T impact layer [s'=10 MN/m3] + 60 mm non-bonded chippings",
      ceiling: "70 mm acoustic hanger ceiling with 60 mm mineral wool and 1 x 12.5 mm gypsum board"
    },
    impactRatings: {
      LnW: 46
    },
    airborneRatings: {
      Rw: 62,
      RwCtr: -6,
      RwCtrSemantic: "ctr_term"
    }
  },
  {
    id: "dataholz_gdmtxa01a_clt_lab_2026",
    label: "Dataholz GDMTXA01a | CLT floor | dry screed + suspended lining",
    sourceLabel: "Dataholz open component library",
    sourceType: "official_open_component_library",
    trustTier: "official_manufacturer",
    estimateMatch: {
      structuralSupportType: "mass_timber_clt",
      impactSystemType: "combined_upper_lower_system",
      baseSlab: {
        thicknessMm: 150
      },
      resilientLayer: {
        thicknessMm: 10,
        dynamicStiffnessMNm3: 102
      },
      upperFill: {
        materialClass: "bonded_chippings",
        thicknessMm: 60,
        densityKgM3: 1500
      },
      floorCovering: {
        mode: "material_layer",
        materialClass: "dry_floating_gypsum_fiberboard",
        thicknessMm: 20,
        densityKgM3: 1200
      },
      lowerTreatment: {
        type: "suspended_ceiling_elastic_hanger",
        cavityDepthMm: 95,
        cavityFillThicknessMm: 75,
        boardLayerCount: 1,
        boardThicknessMm: 15,
        boardMaterialClass: "generic_gypsum_board"
      }
    },
    match: {
      absentRoles: ["floating_screed"],
      baseStructure: {
        materialIds: ["clt_panel"],
        thicknessMm: 150
      },
      resilientLayer: {
        materialIds: ["wf_t_impact_layer_s102"],
        thicknessMm: 10
      },
      upperFill: {
        materialIds: ["bonded_chippings"],
        thicknessMm: 60
      },
      floorCovering: {
        materialIds: ["dry_floating_gypsum_fiberboard"],
        thicknessMm: 20
      },
      ceilingCavity: {
        materialIds: ["acoustic_hanger_ceiling"],
        thicknessMm: 95
      },
      ceilingFill: {
        materialIds: ["rockwool"],
        thicknessMm: 75
      },
      ceilingBoard: {
        layerCount: 1,
        materialIds: ["gypsum_board"],
        thicknessMm: 15
      }
    },
    systemSummary: {
      carrier: "150 mm cross-laminated timber BBS 125, 5-layer",
      floorBuildUp: "20 mm dry screed + 10 mm WF-T impact layer [s'=102 MN/m3] + 60 mm bonded chippings",
      ceiling: "95 mm acoustic direct hanger ceiling with 75 mm mineral wool and 1 x 15 mm board"
    },
    impactRatings: {
      CI: 2,
      LnW: 47,
      LnWPlusCI: 49
    },
    airborneRatings: {
      Rw: 65
    }
  },
  {
    id: "dataholz_gdmtxa04a_clt_lab_2026",
    label: "Dataholz GDMTXA04A | CLT floor | dry floor + fill + acoustic direct hanger ceiling",
    sourceLabel: "Dataholz open component library",
    sourceType: "official_open_component_library",
    sourceUrl: "https://www.dataholz.eu/en/index/download/en/gdmtxa04a-0.pdf",
    trustTier: "official_manufacturer",
    manualMatch: false,
    match: {
      absentRoles: ["floating_screed", "resilient_layer"],
      baseStructure: {
        materialIds: ["clt_panel"],
        thicknessMm: 160
      },
      upperFill: {
        materialIds: ["non_bonded_chippings"],
        thicknessMm: 60
      },
      floorCovering: {
        materialIds: ["dry_floating_gypsum_fiberboard"],
        thicknessMm: 65
      },
      ceilingCavity: {
        materialIds: ["acoustic_hanger_ceiling"],
        thicknessMm: 70
      },
      ceilingFill: {
        materialIds: ["rockwool"],
        thicknessMm: 50
      },
      ceilingBoard: {
        layerCount: 1,
        materialIds: ["gypsum_board"],
        thicknessMm: 12.5
      }
    },
    systemSummary: {
      carrier: "160 mm cross laminated timber, first layer minimum 40 mm",
      floorBuildUp: "65 mm dry floor element + 60 mm non-bonded chippings",
      ceiling: "70 mm acoustic direct hanger ceiling with 50 mm mineral wool and 1 x 12.5 mm gypsum board"
    },
    impactRatings: {
      CI: 4,
      CI50_2500: 9,
      LnW: 49,
      LnWPlusCI: 53
    },
    airborneRatings: {
      Rw: 70,
      RwCtr: -19,
      RwCtrSemantic: "ctr_term"
    }
  },
  {
    id: "tuas_x2_clt140_measured_2026",
    label: "TUAS X2 | CLT 140 mm | laminate + EPS underlay",
    sourceLabel: "TUAS open measured dataset",
    sourceType: "open_measured_dataset",
    trustTier: "peer_reviewed_open_access",
    match: {
      absentRoles: ["ceiling_board", "ceiling_cavity", "ceiling_fill", "floating_screed", "upper_fill"],
      baseStructure: {
        materialIds: ["clt_panel"],
        thicknessMm: 140
      },
      resilientLayer: {
        materialIds: ["eps_underlay"],
        thicknessMm: 3
      },
      floorCovering: {
        materialIds: ["laminate_flooring"],
        thicknessMm: 8
      }
    },
    systemSummary: {
      carrier: "Cross-laminated timber slab 140 mm (edge-glued)",
      floorBuildUp: "8 mm laminate on 3 mm EPS underlay",
      ceiling: "No additional lower treatment"
    },
    impactRatings: {
      CI: 2,
      CI50_2500: 3,
      LnW: 61,
      LnWPlusCI: 63
    },
    airborneRatings: {
      Rw: 38,
      RwCtr: 37.242344245020725,
      RwCtrSemantic: "rw_plus_c"
    }
  },
  {
    id: "tuas_x3_clt140_measured_2026",
    label: "TUAS X3 | CLT 140 mm | staged mixed upper package + laminate",
    sourceLabel: "TUAS open measured dataset",
    sourceType: "open_measured_dataset",
    trustTier: "peer_reviewed_open_access",
    match: {
      absentRoles: ["ceiling_board", "ceiling_cavity", "ceiling_fill"],
      baseStructure: {
        materialIds: ["clt_panel"],
        thicknessMm: 140
      },
      resilientLayer: {
        materialIds: ["eps_underlay"],
        thicknessMm: 3
      },
      upperFill: {
        materialIds: ["glasswool_board"],
        thicknessMm: 13
      },
      floatingScreed: {
        layerCount: 3,
        materialScheduleIds: ["gypsum_board", "screed", "gypsum_board"],
        thicknessScheduleMm: [15, 3, 15]
      },
      floorCovering: {
        materialIds: ["laminate_flooring"],
        thicknessMm: 8
      }
    },
    systemSummary: {
      carrier: "Cross-laminated timber slab 140 mm (edge-glued)",
      floorBuildUp: "13 mm glass wool board + 15 mm gypsum board + 3 mm mortar + 15 mm gypsum board + 3 mm EPS underlay + 8 mm laminate",
      ceiling: "No additional lower treatment"
    },
    impactRatings: {
      CI: 0,
      CI50_2500: 8,
      LnW: 52,
      LnWPlusCI: 52
    },
    airborneRatings: {
      Rw: 49,
      RwCtr: 47.10786221887914,
      RwCtrSemantic: "rw_plus_c"
    }
  },
  {
    id: "tuas_x4_clt140_measured_2026",
    label: "TUAS X4 | CLT 140 mm | 50 mm glass wool + 2 x 15 mm gypsum + laminate",
    sourceLabel: "TUAS open measured dataset",
    sourceType: "open_measured_dataset",
    trustTier: "peer_reviewed_open_access",
    match: {
      absentRoles: ["ceiling_board", "ceiling_cavity", "ceiling_fill"],
      baseStructure: {
        materialIds: ["clt_panel"],
        thicknessMm: 140
      },
      resilientLayer: {
        materialIds: ["eps_underlay"],
        thicknessMm: 3
      },
      upperFill: {
        materialIds: ["glasswool_board"],
        thicknessMm: 50
      },
      floatingScreed: {
        layerCount: 2,
        materialIds: ["gypsum_board"],
        thicknessMm: 15
      },
      floorCovering: {
        materialIds: ["laminate_flooring"],
        thicknessMm: 8
      }
    },
    systemSummary: {
      carrier: "Cross-laminated timber slab 140 mm (edge-glued)",
      floorBuildUp: "50 mm glass wool + 2 x 15 mm gypsum board + 3 mm EPS underlay + 8 mm laminate",
      ceiling: "No additional lower treatment"
    },
    impactRatings: {
      CI: 1,
      CI50_2500: 8,
      LnW: 50,
      LnWPlusCI: 51
    },
    impactBands: {
      frequenciesHz: [20, 25, 31.5, 40, 50, 63, 80, 100, 125, 160, 200, 250, 315, 400, 500, 630, 800, 1000, 1250, 1600, 2000, 2500, 3150, 4000, 5000],
      labOrField: "lab",
      levelsDb: [
        87.69644673704535,
        82.84819233180403,
        90.71866889848235,
        82.47845286781076,
        76.63748152094948,
        76.26178924656664,
        77.64756429893393,
        69.8564915632972,
        60.5012183061683,
        58.86310105006574,
        55.85185481018566,
        50.15801734703297,
        50.20449869090232,
        49.10675816215532,
        44.20595311576401,
        39.05682094740483,
        34.87846311798496,
        35.62084932358843,
        33.773586429570045,
        30.02115260914249,
        28.640026427879484,
        26.205091010560913,
        22.58947484386416,
        19.92416343796227,
        18.292055381745755
      ],
      standardMethod: "open_measured_dataset"
    },
    airborneRatings: {
      Rw: 55,
      RwCtr: 53.20807486278851,
      RwCtrSemantic: "rw_plus_c"
    }
  },
  {
    id: "tuas_x5_clt140_measured_2026",
    label: "TUAS X5 | CLT 140 mm | 50 mm glass wool dry floor + laminate",
    sourceLabel: "TUAS open measured dataset",
    sourceType: "open_measured_dataset",
    trustTier: "peer_reviewed_open_access",
    manualMatch: false,
    estimateMatch: {
      structuralSupportType: "mass_timber_clt",
      impactSystemType: "dry_floating_floor",
      baseSlab: {
        thicknessMm: 140
      },
      resilientLayer: {
        thicknessMm: 3,
        dynamicStiffnessMNm3: 64
      },
      upperFill: {
        materialClass: "generic_fill",
        thicknessMm: 50
      },
      floorCovering: {
        mode: "material_layer",
        materialClass: "laminate_flooring"
      }
    },
    match: {
      absentRoles: ["ceiling_board", "ceiling_cavity", "ceiling_fill"],
      baseStructure: {
        materialIds: ["clt_panel"],
        thicknessMm: 140
      },
      resilientLayer: {
        materialIds: ["eps_underlay"],
        thicknessMm: 3
      },
      floatingScreed: {
        materialIds: ["dry_floating_gypsum_fiberboard"],
        thicknessMm: 60
      },
      upperFill: {
        materialIds: ["generic_fill"],
        thicknessMm: 50
      },
      floorCovering: {
        materialIds: ["laminate_flooring"],
        thicknessMm: 8
      }
    },
    systemSummary: {
      carrier: "Cross-laminated timber slab 140 mm (edge-glued)",
      floorBuildUp: "50 mm glass wool + 60 mm dry gypsum floor pack + 3 mm EPS underlay + 8 mm laminate",
      ceiling: "No additional lower treatment"
    },
    impactRatings: {
      CI: 0,
      CI50_2500: 0,
      LnW: 65,
      LnWPlusCI: 65
    },
    impactBands: {
      frequenciesHz: [20, 25, 31.5, 40, 50, 63, 80, 100, 125, 160, 200, 250, 315, 400, 500, 630, 800, 1000, 1250, 1600, 2000, 2500, 3150, 4000, 5000],
      labOrField: "lab",
      levelsDb: [
        86.3654207370248,
        80.7359361579656,
        89.89318361298649,
        79.991390078572,
        78.67883251385726,
        75.54247597251768,
        71.60009168434031,
        62.622709160435775,
        57.48111120810134,
        53.092220520200655,
        53.59145627585459,
        47.06875958445886,
        46.48537400727974,
        44.30906923002322,
        40.38096479451434,
        38.09918868250873,
        35.39883881222491,
        36.84567298423087,
        34.048585701031904,
        29.73897558043597,
        26.38787052460315,
        22.797854295948653,
        18.080329604535873,
        13.180821426854653,
        13.593308832773957
      ],
      standardMethod: "open_measured_dataset"
    },
    airborneRatings: {
      Rw: 55,
      RwCtr: 53.24148704194138,
      RwCtrSemantic: "rw_plus_c"
    }
  },
  {
    id: "tuas_r2a_open_box_timber_measured_2026",
    label: "TUAS R2a | open-box timber slab | laminate + EPS underlay | ceiling family A",
    sourceLabel: "TUAS open measured dataset",
    sourceType: "open_measured_dataset",
    trustTier: "peer_reviewed_open_access",
    estimateMatch: {
      structuralSupportType: "open_box_timber",
      impactSystemType: "combined_upper_lower_system",
      baseSlab: {
        thicknessMm: 370
      },
      resilientLayer: {
        productId: "eps_underlay",
        thicknessMm: 3
      },
      floorCovering: {
        mode: "material_layer",
        materialClass: "laminate_flooring",
        thicknessMm: 8
      },
      lowerTreatment: {
        type: "suspended_ceiling_elastic_hanger",
        supportClass: "tuas_open_box_family_a",
        boardLayerCount: 2,
        boardMaterialClass: "generic_gypsum_board",
        boardThicknessMm: 13,
        cavityDepthMm: 25,
        cavityFillThicknessMm: 100
      }
    },
      match: {
        absentRoles: ["floating_screed", "upper_fill"],
        baseStructure: {
          materialIds: ["open_box_timber_slab"],
          thicknessMm: 370
      },
      resilientLayer: {
        materialIds: ["eps_underlay"],
        thicknessMm: 3
      },
      floorCovering: {
        materialIds: ["laminate_flooring"],
        thicknessMm: 8
      },
      ceilingCavity: {
        materialIds: ["tuas_open_box_ceiling_family_a"],
        thicknessMm: 25
      },
      ceilingFill: {
        materialIds: ["rockwool"],
        thicknessMm: 100
      },
      ceilingBoard: {
        layerCount: 2,
        materialIds: ["gypsum_board"],
        thicknessMm: 13
      }
    },
    systemSummary: {
      carrier: "Open box timber slab 370 mm",
      floorBuildUp: "8 mm laminate on 3 mm EPS underlay over open-box timber slab",
      ceiling: "25 mm TUAS family A suspended ceiling with 2 x 13 mm gypsum board and 100 mm glass wool"
    },
    impactRatings: {
      CI: 2,
      CI50_2500: 4,
      LnW: 61,
      LnWPlusCI: 63
    },
    airborneRatings: {
      Rw: 49,
      RwCtr: 44.52764215440286,
      RwCtrSemantic: "rw_plus_c"
    }
  },
  {
    id: "tuas_r2b_open_box_timber_measured_2026",
    label: "TUAS R2b | open-box timber slab | laminate + EPS underlay | resilient stud ceiling",
    sourceLabel: "TUAS open measured dataset",
    sourceType: "open_measured_dataset",
    trustTier: "peer_reviewed_open_access",
    estimateMatch: {
      structuralSupportType: "open_box_timber",
      impactSystemType: "combined_upper_lower_system",
      baseSlab: {
        thicknessMm: 370
      },
      resilientLayer: {
        productId: "eps_underlay",
        thicknessMm: 3
      },
      floorCovering: {
        mode: "material_layer",
        materialClass: "laminate_flooring",
        thicknessMm: 8
      },
      lowerTreatment: {
        type: "suspended_ceiling_elastic_hanger",
        supportClass: "tuas_open_box_family_b",
        boardLayerCount: 2,
        boardMaterialClass: "generic_gypsum_board",
        boardThicknessMm: 13,
        cavityDepthMm: 25,
        cavityFillThicknessMm: 100
      }
    },
    match: {
      absentRoles: ["floating_screed", "upper_fill"],
      baseStructure: {
        materialIds: ["open_box_timber_slab"],
        thicknessMm: 370
      },
      resilientLayer: {
        materialIds: ["eps_underlay"],
        thicknessMm: 3
      },
      floorCovering: {
        materialIds: ["laminate_flooring"],
        thicknessMm: 8
      },
      ceilingCavity: {
        materialIds: ["resilient_stud_ceiling"],
        thicknessMm: 25
      },
      ceilingFill: {
        materialIds: ["rockwool"],
        thicknessMm: 100
      },
      ceilingBoard: {
        layerCount: 2,
        materialIds: ["gypsum_board"],
        thicknessMm: 13
      }
    },
    systemSummary: {
      carrier: "Open box timber slab 370 mm",
      floorBuildUp: "8 mm laminate on 3 mm EPS underlay over open-box timber slab",
      ceiling: "25 mm resilient stud ceiling with 2 x 13 mm gypsum board and 100 mm glass wool"
    },
    impactRatings: {
      CI: 1,
      CI50_2500: 3,
      LnW: 46,
      LnWPlusCI: 47
    },
    airborneRatings: {
      Rw: 62,
      RwCtr: 59.973347663855776,
      RwCtrSemantic: "rw_plus_c"
    }
  },
  {
    id: "tuas_r3a_open_box_timber_measured_2026",
    label: "TUAS R3a | open-box timber slab | 13 mm glass wool dry floor | ceiling family A",
    sourceLabel: "TUAS open measured dataset",
    sourceType: "open_measured_dataset",
    trustTier: "peer_reviewed_open_access",
    estimateMatch: {
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
        materialClass: "generic_fill",
        thicknessMm: 13
      },
      floatingScreed: {
        materialClass: "dry_floating_gypsum_fiberboard",
        thicknessMm: 30
      },
      floorCovering: {
        mode: "material_layer",
        materialClass: "laminate_flooring",
        thicknessMm: 8
      },
      lowerTreatment: {
        type: "suspended_ceiling_elastic_hanger",
        supportClass: "tuas_open_box_family_a",
        boardLayerCount: 2,
        boardMaterialClass: "generic_gypsum_board",
        boardThicknessMm: 13,
        cavityDepthMm: 25,
        cavityFillThicknessMm: 100
      }
    },
    match: {
      absentRoles: [],
      baseStructure: {
        materialIds: ["open_box_timber_slab"],
        thicknessMm: 370
      },
      resilientLayer: {
        materialIds: ["eps_underlay"],
        thicknessMm: 3
      },
      floatingScreed: {
        materialIds: ["dry_floating_gypsum_fiberboard"],
        thicknessMm: 30
      },
      upperFill: {
        materialIds: ["generic_fill"],
        thicknessMm: 13
      },
      floorCovering: {
        materialIds: ["laminate_flooring"],
        thicknessMm: 8
      },
      ceilingCavity: {
        materialIds: ["tuas_open_box_ceiling_family_a"],
        thicknessMm: 25
      },
      ceilingFill: {
        materialIds: ["rockwool"],
        thicknessMm: 100
      },
      ceilingBoard: {
        layerCount: 2,
        materialIds: ["gypsum_board"],
        thicknessMm: 13
      }
    },
    systemSummary: {
      carrier: "Open box timber slab 370 mm",
      floorBuildUp: "13 mm glass wool + 30 mm dry gypsum floor pack + 3 mm EPS underlay + 8 mm laminate",
      ceiling: "25 mm TUAS family A resilient stud ceiling with 2 x 13 mm gypsum board and 100 mm glass wool"
    },
    impactRatings: {
      CI: 2,
      CI50_2500: 3,
      LnW: 56,
      LnWPlusCI: 58
    },
    airborneRatings: {
      Rw: 56,
      RwCtr: 51.30566236283586,
      RwCtrSemantic: "rw_plus_c"
    }
  },
  {
    id: "tuas_r3b_open_box_timber_measured_2026",
    label: "TUAS R3b | open-box timber slab | 13 mm glass wool dry floor | resilient stud ceiling",
    sourceLabel: "TUAS open measured dataset",
    sourceType: "open_measured_dataset",
    trustTier: "peer_reviewed_open_access",
    estimateMatch: {
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
        materialClass: "generic_fill",
        thicknessMm: 13
      },
      floatingScreed: {
        materialClass: "dry_floating_gypsum_fiberboard",
        thicknessMm: 30
      },
      floorCovering: {
        mode: "material_layer",
        materialClass: "laminate_flooring",
        thicknessMm: 8
      },
      lowerTreatment: {
        type: "suspended_ceiling_elastic_hanger",
        supportClass: "tuas_open_box_family_b",
        boardLayerCount: 2,
        boardMaterialClass: "generic_gypsum_board",
        boardThicknessMm: 13,
        cavityDepthMm: 25,
        cavityFillThicknessMm: 100
      }
    },
    match: {
      absentRoles: [],
      baseStructure: {
        materialIds: ["open_box_timber_slab"],
        thicknessMm: 370
      },
      resilientLayer: {
        materialIds: ["eps_underlay"],
        thicknessMm: 3
      },
      floatingScreed: {
        materialIds: ["dry_floating_gypsum_fiberboard"],
        thicknessMm: 30
      },
      upperFill: {
        materialIds: ["generic_fill"],
        thicknessMm: 13
      },
      floorCovering: {
        materialIds: ["laminate_flooring"],
        thicknessMm: 8
      },
      ceilingCavity: {
        materialIds: ["resilient_stud_ceiling"],
        thicknessMm: 25
      },
      ceilingFill: {
        materialIds: ["rockwool"],
        thicknessMm: 100
      },
      ceilingBoard: {
        layerCount: 2,
        materialIds: ["gypsum_board"],
        thicknessMm: 13
      }
    },
    systemSummary: {
      carrier: "Open box timber slab 370 mm",
      floorBuildUp: "13 mm glass wool + 30 mm dry gypsum floor pack + 3 mm EPS underlay + 8 mm laminate",
      ceiling: "25 mm resilient stud ceiling with 2 x 13 mm gypsum board and 100 mm glass wool"
    },
    impactRatings: {
      CI: 2,
      CI50_2500: 5,
      LnW: 39,
      LnWPlusCI: 41
    },
    airborneRatings: {
      Rw: 70,
      RwCtr: 67.58499572159022,
      RwCtrSemantic: "rw_plus_c"
    }
  },
  {
    id: "tuas_r5a_open_box_timber_measured_2026",
    label: "TUAS R5a | open-box timber slab | 50 mm glass wool dry floor | ceiling family A",
    sourceLabel: "TUAS open measured dataset",
    sourceType: "open_measured_dataset",
    trustTier: "peer_reviewed_open_access",
    estimateMatch: {
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
        supportClass: "tuas_open_box_family_a",
        boardLayerCount: 2,
        boardMaterialClass: "generic_gypsum_board",
        boardThicknessMm: 13,
        cavityDepthMm: 25,
        cavityFillThicknessMm: 100
      }
    },
    match: {
      absentRoles: [],
      baseStructure: {
        materialIds: ["open_box_timber_slab"],
        thicknessMm: 370
      },
      resilientLayer: {
        materialIds: ["eps_underlay"],
        thicknessMm: 3
      },
      floatingScreed: {
        materialIds: ["dry_floating_gypsum_fiberboard"],
        thicknessMm: 60
      },
      upperFill: {
        materialIds: ["generic_fill"],
        thicknessMm: 50
      },
      floorCovering: {
        materialIds: ["laminate_flooring"],
        thicknessMm: 8
      },
      ceilingCavity: {
        materialIds: ["tuas_open_box_ceiling_family_a"],
        thicknessMm: 25
      },
      ceilingFill: {
        materialIds: ["rockwool"],
        thicknessMm: 100
      },
      ceilingBoard: {
        layerCount: 2,
        materialIds: ["gypsum_board"],
        thicknessMm: 13
      }
    },
    systemSummary: {
      carrier: "Open box timber slab 370 mm",
      floorBuildUp: "50 mm glass wool + 60 mm dry gypsum floor pack + 3 mm EPS underlay + 8 mm laminate",
      ceiling: "25 mm TUAS family A resilient stud ceiling with 2 x 13 mm gypsum board and 100 mm glass wool"
    },
    impactRatings: {
      CI: 1,
      CI50_2500: 2,
      LnW: 64,
      LnWPlusCI: 65
    },
    airborneRatings: {
      Rw: 63,
      RwCtr: 57.78202920484737,
      RwCtrSemantic: "rw_plus_c"
    }
  },
  {
    id: "tuas_r5b_open_box_timber_measured_2026",
    label: "TUAS R5b | open-box timber slab | 50 mm glass wool dry floor | resilient stud ceiling",
    sourceLabel: "TUAS open measured dataset",
    sourceType: "open_measured_dataset",
    trustTier: "peer_reviewed_open_access",
    estimateMatch: {
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
        supportClass: "tuas_open_box_family_b",
        boardLayerCount: 2,
        boardMaterialClass: "generic_gypsum_board",
        boardThicknessMm: 13,
        cavityDepthMm: 25,
        cavityFillThicknessMm: 100
      }
    },
    match: {
      absentRoles: [],
      baseStructure: {
        materialIds: ["open_box_timber_slab"],
        thicknessMm: 370
      },
      resilientLayer: {
        materialIds: ["eps_underlay"],
        thicknessMm: 3
      },
      floatingScreed: {
        materialIds: ["dry_floating_gypsum_fiberboard"],
        thicknessMm: 60
      },
      upperFill: {
        materialIds: ["generic_fill"],
        thicknessMm: 50
      },
      floorCovering: {
        materialIds: ["laminate_flooring"],
        thicknessMm: 8
      },
      ceilingCavity: {
        materialIds: ["resilient_stud_ceiling"],
        thicknessMm: 25
      },
      ceilingFill: {
        materialIds: ["rockwool"],
        thicknessMm: 100
      },
      ceilingBoard: {
        layerCount: 2,
        materialIds: ["gypsum_board"],
        thicknessMm: 13
      }
    },
    systemSummary: {
      carrier: "Open box timber slab 370 mm",
      floorBuildUp: "50 mm glass wool + 60 mm dry gypsum floor pack + 3 mm EPS underlay + 8 mm laminate",
      ceiling: "25 mm resilient stud ceiling with 2 x 13 mm gypsum board and 100 mm glass wool"
    },
    impactRatings: {
      CI: 0,
      CI50_2500: 3,
      LnW: 44,
      LnWPlusCI: 44
    },
    impactBands: {
      frequenciesHz: [20, 25, 31.5, 40, 50, 63, 80, 100, 125, 160, 200, 250, 315, 400, 500, 630, 800, 1000, 1250, 1600, 2000, 2500, 3150, 4000, 5000],
      labOrField: "lab",
      levelsDb: [
        88.98469913260708,
        83.08692204644406,
        87.19333228366578,
        79.55663296751297,
        67.67563819548371,
        62.965791899593924,
        55.296984714295945,
        48.99744604599472,
        52.387035539600646,
        47.30707265699782,
        38.88512949368683,
        37.82978425722561,
        35.24997132256958,
        34.092279526947756,
        30.069690294186124,
        28.704244477277463,
        27.66708268040662,
        22.843591928507557,
        18.213951139421262,
        18.587499085657775,
        16.608315041494276,
        18.33852083392007,
        16.344670629632056,
        12.70254820886805,
        10.41167300505007
      ],
      standardMethod: "open_measured_dataset"
    },
    airborneRatings: {
      Rw: 75,
      RwCtr: 71.87531170772152,
      RwCtrSemantic: "rw_plus_c"
    }
  },
  {
    id: "tuas_r6a_open_box_timber_measured_2026",
    label: "TUAS R6a | open-box timber slab | laminate + EPS underlay | mixed-board ceiling family A",
    sourceLabel: "TUAS open measured dataset",
    sourceType: "open_measured_dataset",
    trustTier: "peer_reviewed_open_access",
    estimateMatch: {
      structuralSupportType: "open_box_timber",
      impactSystemType: "combined_upper_lower_system",
      baseSlab: {
        thicknessMm: 370
      },
      resilientLayer: {
        productId: "eps_underlay",
        thicknessMm: 3
      },
      floorCovering: {
        mode: "material_layer",
        materialClass: "laminate_flooring",
        thicknessMm: 8
      },
      lowerTreatment: {
        type: "suspended_ceiling_elastic_hanger",
        supportClass: "tuas_open_box_family_a",
        boardMaterialClass: "generic_gypsum_board",
        boardThicknessScheduleMm: [13, 13, 15, 15, 15, 15],
        cavityDepthMm: 25,
        cavityFillThicknessMm: 100
      }
    },
    match: {
      absentRoles: ["floating_screed", "upper_fill"],
      baseStructure: {
        materialIds: ["open_box_timber_slab"],
        thicknessMm: 370
      },
      resilientLayer: {
        materialIds: ["eps_underlay"],
        thicknessMm: 3
      },
      floorCovering: {
        materialIds: ["laminate_flooring"],
        thicknessMm: 8
      },
      ceilingCavity: {
        materialIds: ["tuas_open_box_ceiling_family_a"],
        thicknessMm: 25
      },
      ceilingFill: {
        materialIds: ["rockwool"],
        thicknessMm: 100
      },
      ceilingBoard: {
        materialIds: ["gypsum_board"],
        thicknessScheduleMm: [13, 13, 15, 15, 15, 15]
      }
    },
    systemSummary: {
      carrier: "Open box timber slab 370 mm",
      floorBuildUp: "8 mm laminate on 3 mm EPS underlay over open-box timber slab",
      ceiling: "25 mm TUAS family A suspended ceiling with 2 x 13 mm + 4 x 15 mm gypsum board and 100 mm glass wool"
    },
    impactRatings: {
      CI: 1,
      CI50_2500: 3,
      LnW: 60,
      LnWPlusCI: 61
    },
    airborneRatings: {
      Rw: 56,
      RwCtr: 53.59725745128915,
      RwCtrSemantic: "rw_plus_c"
    }
  },
  {
    id: "tuas_r6b_open_box_timber_measured_2026",
    label: "TUAS R6b | open-box timber slab | laminate + EPS underlay | reinforced resilient stud ceiling",
    sourceLabel: "TUAS open measured dataset",
    sourceType: "open_measured_dataset",
    trustTier: "peer_reviewed_open_access",
    estimateMatch: {
      structuralSupportType: "open_box_timber",
      impactSystemType: "combined_upper_lower_system",
      baseSlab: {
        thicknessMm: 370
      },
      resilientLayer: {
        productId: "eps_underlay",
        thicknessMm: 3
      },
      floorCovering: {
        mode: "material_layer",
        materialClass: "laminate_flooring",
        thicknessMm: 8
      },
      lowerTreatment: {
        type: "suspended_ceiling_elastic_hanger",
        supportClass: "tuas_open_box_family_b",
        boardLayerCount: 4,
        boardMaterialClass: "generic_gypsum_board",
        boardThicknessMm: 15,
        cavityDepthMm: 25,
        cavityFillThicknessMm: 100
      }
    },
    match: {
      absentRoles: ["floating_screed", "upper_fill"],
      baseStructure: {
        materialIds: ["open_box_timber_slab"],
        thicknessMm: 370
      },
      resilientLayer: {
        materialIds: ["eps_underlay"],
        thicknessMm: 3
      },
      floorCovering: {
        materialIds: ["laminate_flooring"],
        thicknessMm: 8
      },
      ceilingCavity: {
        materialIds: ["resilient_stud_ceiling"],
        thicknessMm: 25
      },
      ceilingFill: {
        materialIds: ["rockwool"],
        thicknessMm: 100
      },
      ceilingBoard: {
        layerCount: 4,
        materialIds: ["gypsum_board"],
        thicknessMm: 15
      }
    },
    systemSummary: {
      carrier: "Open box timber slab 370 mm",
      floorBuildUp: "8 mm laminate on 3 mm EPS underlay over open-box timber slab",
      ceiling: "25 mm resilient stud ceiling with 4 x 15 mm gypsum board and 100 mm glass wool"
    },
    impactRatings: {
      CI: 0,
      CI50_2500: 1,
      LnW: 47,
      LnWPlusCI: 47
    },
    airborneRatings: {
      Rw: 71,
      RwCtr: 69.5361374042257,
      RwCtrSemantic: "rw_plus_c"
    }
  },
  {
    id: "tuas_r7a_open_box_timber_measured_2026",
    label: "TUAS R7a | open-box timber slab | EPS board + screed + EPS underlay + laminate | ceiling family A",
    sourceLabel: "TUAS open measured dataset",
    sourceType: "open_measured_dataset",
    trustTier: "peer_reviewed_open_access",
    estimateMatch: {
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
        boardLayerCount: 2,
        boardMaterialClass: "generic_gypsum_board",
        boardThicknessMm: 13,
        cavityDepthMm: 25,
        cavityFillThicknessMm: 100
      }
    },
    match: {
      absentRoles: [],
      baseStructure: {
        materialIds: ["open_box_timber_slab"],
        thicknessMm: 370
      },
      resilientLayer: {
        materialIds: ["eps_underlay"],
        thicknessMm: 3
      },
      upperFill: {
        materialIds: ["eps_floor_insulation_board"],
        thicknessMm: 50
      },
      floatingScreed: {
        materialIds: ["screed"],
        thicknessMm: 40
      },
      floorCovering: {
        materialIds: ["laminate_flooring"],
        thicknessMm: 8
      },
      ceilingCavity: {
        materialIds: ["tuas_open_box_ceiling_family_a"],
        thicknessMm: 25
      },
      ceilingFill: {
        materialIds: ["rockwool"],
        thicknessMm: 100
      },
      ceilingBoard: {
        layerCount: 2,
        materialIds: ["gypsum_board"],
        thicknessMm: 13
      }
    },
    systemSummary: {
      carrier: "Open box timber slab 370 mm",
      floorBuildUp: "50 mm EPS floor insulation board + 40 mm screed + 3 mm EPS underlay + 8 mm laminate",
      ceiling: "25 mm TUAS family A suspended ceiling with 2 x 13 mm gypsum board and 100 mm glass wool"
    },
    impactRatings: {
      CI: 1,
      CI50_2500: 3,
      LnW: 63,
      LnWPlusCI: 64
    },
    airborneRatings: {
      Rw: 60,
      RwCtr: 57,
      RwCtrSemantic: "rw_plus_c"
    }
  },
  {
    id: "tuas_r7b_open_box_timber_measured_2026",
    label: "TUAS R7b | open-box timber slab | EPS board + geotextile + screed + EPS underlay + laminate | hybrid lower treatment",
    sourceLabel: "TUAS open measured dataset",
    sourceType: "open_measured_dataset",
    trustTier: "peer_reviewed_open_access",
    match: {
      absentRoles: [],
      baseStructure: {
        materialIds: ["open_box_timber_slab"],
        thicknessMm: 370
      },
      resilientLayer: {
        materialIds: ["eps_underlay"],
        thicknessMm: 3
      },
      upperFill: {
        materialIds: ["eps_floor_insulation_board"],
        thicknessMm: 35
      },
      floatingScreed: {
        layerCount: 2,
        materialScheduleIds: ["geotextile", "screed"],
        thicknessScheduleMm: [1, 40]
      },
      floorCovering: {
        materialIds: ["laminate_flooring"],
        thicknessMm: 8
      },
      ceilingCavity: {
        layerCount: 2,
        materialScheduleIds: ["tuas_open_box_ceiling_family_a", "resilient_stud_ceiling"],
        thicknessScheduleMm: [45, 25]
      },
      ceilingFill: {
        materialIds: ["rockwool"],
        thicknessMm: 100
      },
      ceilingBoard: {
        layerCount: 2,
        materialIds: ["gypsum_board"],
        thicknessMm: 13
      }
    },
    systemSummary: {
      carrier: "Open box timber slab 370 mm",
      floorBuildUp: "35 mm EPS floor insulation board + 1 mm geotextile + 40 mm screed + 3 mm EPS underlay + 8 mm laminate",
      ceiling: "45 mm TUAS family A cavity + 25 mm resilient stud ceiling with 2 x 13 mm gypsum board and 100 mm rockwool"
    },
    impactRatings: {
      CI: 0,
      CI50_2500: 1,
      LnW: 47,
      LnWPlusCI: 47
    },
    airborneRatings: {
      Rw: 72,
      RwCtr: 70.726430817278,
      RwCtrSemantic: "rw_plus_c"
    }
  },
  {
    id: "tuas_r8b_open_box_timber_measured_2026",
    label: "TUAS R8b | open-box timber slab | EPS board + geotextile + screed | hybrid lower treatment",
    sourceLabel: "TUAS open measured dataset",
    sourceType: "open_measured_dataset",
    trustTier: "peer_reviewed_open_access",
    match: {
      absentRoles: ["resilient_layer", "floor_covering"],
      baseStructure: {
        materialIds: ["open_box_timber_slab"],
        thicknessMm: 370
      },
      upperFill: {
        materialIds: ["eps_floor_insulation_board"],
        thicknessMm: 35
      },
      floatingScreed: {
        layerCount: 2,
        materialScheduleIds: ["geotextile", "screed"],
        thicknessScheduleMm: [1, 40]
      },
      ceilingCavity: {
        layerCount: 2,
        materialScheduleIds: ["tuas_open_box_ceiling_family_a", "resilient_stud_ceiling"],
        thicknessScheduleMm: [45, 25]
      },
      ceilingFill: {
        materialIds: ["rockwool"],
        thicknessMm: 100
      },
      ceilingBoard: {
        layerCount: 2,
        materialIds: ["gypsum_board"],
        thicknessMm: 13
      }
    },
    systemSummary: {
      carrier: "Open box timber slab 370 mm",
      floorBuildUp: "35 mm EPS floor insulation board + 1 mm geotextile + 40 mm screed",
      ceiling: "45 mm TUAS family A cavity + 25 mm resilient stud ceiling with 2 x 13 mm gypsum board and 100 mm rockwool"
    },
    impactRatings: {
      CI: -1,
      CI50_2500: 0,
      LnW: 50,
      LnWPlusCI: 49
    },
    airborneRatings: {
      Rw: 72,
      RwCtr: 70.60101885694094,
      RwCtrSemantic: "rw_plus_c"
    }
  },
  {
    id: "tuas_r9b_open_box_timber_measured_2026",
    label: "TUAS R9b | open-box timber slab | screed + EPS underlay + laminate | hybrid lower treatment",
    sourceLabel: "TUAS open measured dataset",
    sourceType: "open_measured_dataset",
    trustTier: "peer_reviewed_open_access",
    match: {
      absentRoles: ["upper_fill"],
      baseStructure: {
        materialIds: ["open_box_timber_slab"],
        thicknessMm: 370
      },
      resilientLayer: {
        materialIds: ["eps_underlay"],
        thicknessMm: 3
      },
      floatingScreed: {
        materialIds: ["screed"],
        thicknessMm: 40
      },
      floorCovering: {
        materialIds: ["laminate_flooring"],
        thicknessMm: 8
      },
      ceilingCavity: {
        layerCount: 2,
        materialScheduleIds: ["tuas_open_box_ceiling_family_a", "resilient_stud_ceiling"],
        thicknessScheduleMm: [45, 25]
      },
      ceilingFill: {
        materialIds: ["rockwool"],
        thicknessMm: 100
      },
      ceilingBoard: {
        layerCount: 2,
        materialIds: ["gypsum_board"],
        thicknessMm: 13
      }
    },
    systemSummary: {
      carrier: "Open box timber slab 370 mm",
      floorBuildUp: "40 mm screed + 3 mm EPS underlay + 8 mm laminate",
      ceiling: "45 mm TUAS family A cavity + 25 mm resilient stud ceiling with 2 x 13 mm gypsum board and 100 mm rockwool"
    },
    impactRatings: {
      CI: 1,
      CI50_2500: 3,
      LnW: 45,
      LnWPlusCI: 46
    },
    airborneRatings: {
      Rw: 68,
      RwCtr: 67.01756572323127,
      RwCtrSemantic: "rw_plus_c"
    }
  },
  {
    id: "tuas_r2c_open_box_timber_measured_2026",
    label: "TUAS R2c | open-box timber slab | EPS underlay + laminate | hybrid lower treatment no fill",
    sourceLabel: "TUAS open measured dataset",
    sourceType: "open_measured_dataset",
    trustTier: "peer_reviewed_open_access",
    match: {
      absentRoles: ["ceiling_fill", "upper_fill", "floating_screed"],
      baseStructure: {
        materialIds: ["open_box_timber_slab"],
        thicknessMm: 370
      },
      resilientLayer: {
        materialIds: ["eps_underlay"],
        thicknessMm: 3
      },
      floorCovering: {
        materialIds: ["laminate_flooring"],
        thicknessMm: 8
      },
      ceilingCavity: {
        layerCount: 2,
        materialScheduleIds: ["tuas_open_box_ceiling_family_a", "resilient_stud_ceiling"],
        thicknessScheduleMm: [45, 25]
      },
      ceilingBoard: {
        layerCount: 2,
        materialIds: ["gypsum_board"],
        thicknessMm: 13
      }
    },
    systemSummary: {
      carrier: "Open box timber slab 370 mm",
      floorBuildUp: "3 mm EPS underlay + 8 mm laminate",
      ceiling: "45 mm TUAS family A cavity + 25 mm resilient stud ceiling with 2 x 13 mm gypsum board"
    },
    impactRatings: {
      CI: 0,
      CI50_2500: 0,
      LnW: 70,
      LnWPlusCI: 70
    },
    airborneRatings: {
      Rw: 54,
      RwCtr: 53.34048310542768,
      RwCtrSemantic: "rw_plus_c"
    }
  },
  {
    id: "tuas_r10a_open_box_timber_measured_2026",
    label: "TUAS R10a | open-box timber slab | staged mixed upper package + laminate | ceiling family A",
    sourceLabel: "TUAS open measured dataset",
    sourceType: "open_measured_dataset",
    trustTier: "peer_reviewed_open_access",
    match: {
      absentRoles: [],
      baseStructure: {
        materialIds: ["open_box_timber_slab"],
        thicknessMm: 370
      },
      resilientLayer: {
        materialIds: ["eps_underlay"],
        thicknessMm: 3
      },
      upperFill: {
        materialIds: ["glasswool_board"],
        thicknessMm: 13
      },
      floatingScreed: {
        layerCount: 3,
        materialScheduleIds: ["gypsum_board", "screed", "gypsum_board"],
        thicknessScheduleMm: [15, 3, 15]
      },
      floorCovering: {
        materialIds: ["laminate_flooring"],
        thicknessMm: 8
      },
      ceilingCavity: {
        materialIds: ["tuas_open_box_ceiling_family_a"],
        thicknessMm: 25
      },
      ceilingFill: {
        materialIds: ["rockwool"],
        thicknessMm: 100
      },
      ceilingBoard: {
        layerCount: 2,
        materialIds: ["gypsum_board"],
        thicknessMm: 13
      }
    },
    systemSummary: {
      carrier: "Open box timber slab 370 mm",
      floorBuildUp: "13 mm glass wool board + 15 mm gypsum board + 3 mm mortar + 15 mm gypsum board + 3 mm EPS underlay + 8 mm laminate",
      ceiling: "25 mm TUAS family A suspended ceiling with 2 x 13 mm gypsum board and 100 mm glass wool"
    },
    impactRatings: {
      CI: 0,
      CI50_2500: 1,
      LnW: 55,
      LnWPlusCI: 55
    },
    airborneRatings: {
      Rw: 56,
      RwCtr: 50.89680103538985,
      RwCtrSemantic: "rw_plus_c"
    }
  },
  {
    id: "tuas_r11b_open_box_timber_measured_2026",
    label: "TUAS R11b | open-box timber slab | 40 mm glass wool + 40 mm screed | resilient stud ceiling",
    sourceLabel: "TUAS open measured dataset",
    sourceType: "open_measured_dataset",
    trustTier: "peer_reviewed_open_access",
    estimateMatch: {
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
        materialClass: "generic_fill",
        thicknessMm: 40
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
        supportClass: "tuas_open_box_family_b",
        boardLayerCount: 2,
        boardMaterialClass: "generic_gypsum_board",
        boardThicknessMm: 13,
        cavityDepthMm: 25,
        cavityFillThicknessMm: 100
      }
    },
    match: {
      absentRoles: [],
      baseStructure: {
        materialIds: ["open_box_timber_slab"],
        thicknessMm: 370
      },
      resilientLayer: {
        materialIds: ["eps_underlay"],
        thicknessMm: 3
      },
      floatingScreed: {
        materialIds: ["screed"],
        thicknessMm: 40
      },
      upperFill: {
        materialIds: ["generic_fill"],
        thicknessMm: 40
      },
      floorCovering: {
        materialIds: ["laminate_flooring"],
        thicknessMm: 8
      },
      ceilingCavity: {
        materialIds: ["resilient_stud_ceiling"],
        thicknessMm: 25
      },
      ceilingFill: {
        materialIds: ["rockwool"],
        thicknessMm: 100
      },
      ceilingBoard: {
        layerCount: 2,
        materialIds: ["gypsum_board"],
        thicknessMm: 13
      }
    },
    systemSummary: {
      carrier: "Open box timber slab 370 mm",
      floorBuildUp: "40 mm glass wool + 40 mm screed + 3 mm EPS underlay + 8 mm laminate",
      ceiling: "25 mm resilient stud ceiling with 2 x 13 mm gypsum board and 100 mm glass wool"
    },
    impactRatings: {
      CI: 0,
      CI50_2500: 0,
      LnW: 60,
      LnWPlusCI: 60
    },
    airborneRatings: {
      Rw: 74,
      RwCtr: 71.15477026441121,
      RwCtrSemantic: "rw_plus_c"
    }
  },
  {
    id: "tuas_c2_clt260_measured_2026",
    label: "TUAS C2 | CLT 260 mm | laminate + EPS underlay",
    sourceLabel: "TUAS open measured dataset",
    sourceType: "open_measured_dataset",
    trustTier: "peer_reviewed_open_access",
    match: {
      absentRoles: ["ceiling_board", "ceiling_cavity", "ceiling_fill", "floating_screed", "upper_fill"],
      baseStructure: {
        materialIds: ["clt_panel"],
        thicknessMm: 260
      },
      resilientLayer: {
        materialIds: ["eps_underlay"],
        thicknessMm: 3
      },
      floorCovering: {
        materialIds: ["laminate_flooring"],
        thicknessMm: 8
      }
    },
    systemSummary: {
      carrier: "Cross-laminated timber slab 260 mm (edge-glued)",
      floorBuildUp: "8 mm laminate on 3 mm EPS underlay",
      ceiling: "No additional lower treatment"
    },
    impactRatings: {
      CI: 3,
      CI50_2500: 4,
      LnW: 55,
      LnWPlusCI: 58
    },
    airborneRatings: {
      Rw: 42,
      RwCtr: 41.478540491108376,
      RwCtrSemantic: "rw_plus_c"
    }
  },
  {
    id: "tuas_c3_clt260_measured_2026",
    label: "TUAS C3 | CLT 260 mm | staged mixed upper package + laminate",
    sourceLabel: "TUAS open measured dataset",
    sourceType: "open_measured_dataset",
    trustTier: "peer_reviewed_open_access",
    match: {
      absentRoles: ["ceiling_board", "ceiling_cavity", "ceiling_fill"],
      baseStructure: {
        materialIds: ["clt_panel"],
        thicknessMm: 260
      },
      resilientLayer: {
        materialIds: ["eps_underlay"],
        thicknessMm: 3
      },
      upperFill: {
        materialIds: ["glasswool_board"],
        thicknessMm: 13
      },
      floatingScreed: {
        layerCount: 3,
        materialScheduleIds: ["gypsum_board", "screed", "gypsum_board"],
        thicknessScheduleMm: [15, 3, 15]
      },
      floorCovering: {
        materialIds: ["laminate_flooring"],
        thicknessMm: 8
      }
    },
    systemSummary: {
      carrier: "Cross-laminated timber slab 260 mm (edge-glued)",
      floorBuildUp: "13 mm glass wool board + 15 mm gypsum board + 3 mm mortar + 15 mm gypsum board + 3 mm EPS underlay + 8 mm laminate",
      ceiling: "No additional lower treatment"
    },
    impactRatings: {
      CI: 2,
      CI50_2500: 6,
      LnW: 47,
      LnWPlusCI: 49
    },
    airborneRatings: {
      Rw: 54,
      RwCtr: 51.413639069637696,
      RwCtrSemantic: "rw_plus_c"
    }
  },
  {
    id: "tuas_c4_clt260_measured_2026",
    label: "TUAS C4 | CLT 260 mm | 50 mm glass wool + 2 x 15 mm gypsum + laminate",
    sourceLabel: "TUAS open measured dataset",
    sourceType: "open_measured_dataset",
    trustTier: "peer_reviewed_open_access",
    match: {
      absentRoles: ["ceiling_board", "ceiling_cavity", "ceiling_fill"],
      baseStructure: {
        materialIds: ["clt_panel"],
        thicknessMm: 260
      },
      resilientLayer: {
        materialIds: ["eps_underlay"],
        thicknessMm: 3
      },
      upperFill: {
        materialIds: ["glasswool_board"],
        thicknessMm: 50
      },
      floatingScreed: {
        layerCount: 2,
        materialIds: ["gypsum_board"],
        thicknessMm: 15
      },
      floorCovering: {
        materialIds: ["laminate_flooring"],
        thicknessMm: 8
      }
    },
    systemSummary: {
      carrier: "Cross-laminated timber slab 260 mm (edge-glued)",
      floorBuildUp: "50 mm glass wool + 2 x 15 mm gypsum board + 3 mm EPS underlay + 8 mm laminate",
      ceiling: "No additional lower treatment"
    },
    impactRatings: {
      CI: 1,
      CI50_2500: 6,
      LnW: 45,
      LnWPlusCI: 46
    },
    impactBands: {
      frequenciesHz: [20, 25, 31.5, 40, 50, 63, 80, 100, 125, 160, 200, 250, 315, 400, 500, 630, 800, 1000, 1250, 1600, 2000, 2500, 3150, 4000, 5000],
      labOrField: "lab",
      levelsDb: [
        84.106051867185244,
        79.791927201228901,
        83.661484273276415,
        80.191256452276448,
        74.15023116861768,
        70.499426179716664,
        72.330159979877934,
        66.608770554530224,
        58.244188167437805,
        55.222278733476955,
        60.050479407700664,
        45.282250522662373,
        43.708121436473192,
        40.28408637327059,
        36.497969497320412,
        34.854755284248384,
        34.367119305961438,
        33.833258520871915,
        32.002081214845909,
        30.566358592259292,
        30.466920124026736,
        26.77081061740552,
        22.722509851584476,
        19.987334560985108,
        16.926032888813722
      ],
      standardMethod: "open_measured_dataset"
    },
    airborneRatings: {
      Rw: 61,
      RwCtr: 58.831296422168144,
      RwCtrSemantic: "rw_plus_c"
    }
  },
  {
    id: "tuas_c5_clt260_measured_2026",
    label: "TUAS C5 | CLT 260 mm | 50 mm glass wool + 4 x 15 mm gypsum + laminate",
    sourceLabel: "TUAS open measured dataset",
    sourceType: "open_measured_dataset",
    trustTier: "peer_reviewed_open_access",
    match: {
      absentRoles: ["ceiling_board", "ceiling_cavity", "ceiling_fill"],
      baseStructure: {
        materialIds: ["clt_panel"],
        thicknessMm: 260
      },
      resilientLayer: {
        materialIds: ["eps_underlay"],
        thicknessMm: 3
      },
      upperFill: {
        materialIds: ["glasswool_board"],
        thicknessMm: 50
      },
      floatingScreed: {
        layerCount: 4,
        materialIds: ["gypsum_board"],
        thicknessMm: 15
      },
      floorCovering: {
        materialIds: ["laminate_flooring"],
        thicknessMm: 8
      }
    },
    systemSummary: {
      carrier: "Cross-laminated timber slab 260 mm (edge-glued)",
      floorBuildUp: "50 mm glass wool + 4 x 15 mm gypsum board + 3 mm EPS underlay + 8 mm laminate",
      ceiling: "No additional lower treatment"
    },
    impactRatings: {
      CI: 2,
      CI50_2500: 3,
      LnW: 60,
      LnWPlusCI: 62
    },
    impactBands: {
      frequenciesHz: [20, 25, 31.5, 40, 50, 63, 80, 100, 125, 160, 200, 250, 315, 400, 500, 630, 800, 1000, 1250, 1600, 2000, 2500, 3150, 4000, 5000],
      labOrField: "lab",
      levelsDb: [
        83.38969771059153,
        77.03198620919188,
        84.63010531603929,
        76.46764002899377,
        76.12697425541992,
        69.15062898410406,
        65.72887428818605,
        59.4991621694355,
        53.984749378461906,
        50.79415958631088,
        54.52397940538498,
        43.514298695659825,
        41.953099972488886,
        40.652148548621064,
        37.66498063413417,
        31.37359546466279,
        27.932312638381312,
        26.12310843617644,
        22.95517302920244,
        18.537467312415902,
        16.406007749204576,
        18.71257799068667,
        19.279909604217487,
        17.111945574309424,
        13.27252773876381
      ],
      standardMethod: "open_measured_dataset"
    },
    airborneRatings: {
      Rw: 61,
      RwCtr: 59.492301808652826,
      RwCtrSemantic: "rw_plus_c"
    }
  },
  {
    id: "tuas_c7_clt260_measured_2026",
    label: "TUAS C7 | CLT 260 mm | EPS board + geotextile + screed + EPS underlay + laminate",
    sourceLabel: "TUAS open measured dataset",
    sourceType: "open_measured_dataset",
    trustTier: "peer_reviewed_open_access",
    match: {
      absentRoles: ["ceiling_board", "ceiling_cavity", "ceiling_fill"],
      baseStructure: {
        materialIds: ["clt_panel"],
        thicknessMm: 260
      },
      upperFill: {
        materialIds: ["eps_floor_insulation_board"],
        thicknessMm: 35
      },
      floatingScreed: {
        layerCount: 2,
        materialScheduleIds: ["geotextile", "screed"],
        thicknessScheduleMm: [1, 40]
      },
      resilientLayer: {
        materialIds: ["eps_underlay"],
        thicknessMm: 3
      },
      floorCovering: {
        materialIds: ["laminate_flooring"],
        thicknessMm: 8
      }
    },
    systemSummary: {
      carrier: "Cross-laminated timber slab 260 mm (edge-glued)",
      floorBuildUp: "35 mm EPS floor insulation board + 1 mm geotextile + 40 mm screed + 3 mm EPS underlay + 8 mm laminate",
      ceiling: "No additional lower treatment"
    },
    impactRatings: {
      CI: 1,
      CI50_2500: 3,
      LnW: 39,
      LnWPlusCI: 40
    },
    airborneRatings: {
      Rw: 57,
      RwCtr: 52.458421802887344,
      RwCtrSemantic: "rw_plus_c"
    }
  },
  {
    id: "tuas_c7c_clt260_measured_2026",
    label: "TUAS C7c | CLT 260 mm | EPS board + geotextile + screed + EPS underlay + laminate + suspended ceiling",
    sourceLabel: "TUAS open measured dataset",
    sourceType: "open_measured_dataset",
    trustTier: "peer_reviewed_open_access",
    match: {
      absentRoles: [],
      baseStructure: {
        materialIds: ["clt_panel"],
        thicknessMm: 260
      },
      upperFill: {
        materialIds: ["eps_floor_insulation_board"],
        thicknessMm: 35
      },
      floatingScreed: {
        layerCount: 2,
        materialScheduleIds: ["geotextile", "screed"],
        thicknessScheduleMm: [1, 40]
      },
      resilientLayer: {
        materialIds: ["eps_underlay"],
        thicknessMm: 3
      },
      floorCovering: {
        materialIds: ["laminate_flooring"],
        thicknessMm: 8
      },
      ceilingCavity: {
        materialIds: ["acoustic_hanger_ceiling"],
        thicknessMm: 70
      },
      ceilingFill: {
        materialIds: ["rockwool"],
        thicknessMm: 100
      },
      ceilingBoard: {
        layerCount: 2,
        materialIds: ["gypsum_board"],
        thicknessMm: 13
      }
    },
    systemSummary: {
      carrier: "Cross-laminated timber slab 260 mm (edge-glued)",
      floorBuildUp: "35 mm EPS floor insulation board + 1 mm geotextile + 40 mm screed + 3 mm EPS underlay + 8 mm laminate",
      ceiling: "70 mm acoustic hanger ceiling with 100 mm mineral wool and 2 x 13 mm gypsum board"
    },
    impactRatings: {
      CI: 5,
      CI50_2500: 14,
      LnW: 30,
      LnWPlusCI: 35
    },
    airborneRatings: {
      Rw: 75,
      RwCtr: 70.92499901751341,
      RwCtrSemantic: "rw_plus_c"
    }
  },
  {
    id: "tuas_c2c_clt260_measured_2026",
    label: "TUAS C2c | CLT 260 mm | EPS underlay + laminate + suspended ceiling",
    sourceLabel: "TUAS open measured dataset",
    sourceType: "open_measured_dataset",
    trustTier: "peer_reviewed_open_access",
    estimateMatch: {
      structuralSupportType: "mass_timber_clt",
      impactSystemType: "combined_upper_lower_system",
      baseSlab: {
        thicknessMm: 260
      },
      resilientLayer: {
        thicknessMm: 3,
        dynamicStiffnessMNm3: 64
      },
      floorCovering: {
        mode: "material_layer",
        materialClass: "laminate_flooring",
        thicknessMm: 8
      },
      lowerTreatment: {
        type: "suspended_ceiling_rigid_hanger",
        cavityDepthMm: 70,
        cavityFillThicknessMm: 100,
        boardLayerCount: 2,
        boardMaterialClass: "generic_gypsum_board",
        boardThicknessMm: 13
      }
    },
    match: {
      absentRoles: ["floating_screed", "upper_fill"],
      baseStructure: {
        materialIds: ["clt_panel"],
        thicknessMm: 260
      },
      resilientLayer: {
        materialIds: ["eps_underlay"],
        thicknessMm: 3
      },
      floorCovering: {
        materialIds: ["laminate_flooring"],
        thicknessMm: 8
      },
      ceilingCavity: {
        materialIds: ["acoustic_hanger_ceiling"],
        thicknessMm: 70
      },
      ceilingFill: {
        materialIds: ["rockwool"],
        thicknessMm: 100
      },
      ceilingBoard: {
        layerCount: 2,
        materialIds: ["gypsum_board"],
        thicknessMm: 13
      }
    },
    systemSummary: {
      carrier: "Cross-laminated timber slab 260 mm (edge-glued)",
      floorBuildUp: "3 mm EPS underlay + 8 mm laminate",
      ceiling: "70 mm acoustic hanger ceiling with 100 mm mineral wool and 2 x 13 mm gypsum board"
    },
    impactRatings: {
      CI: 4,
      CI50_2500: 9,
      LnW: 35,
      LnWPlusCI: 39
    },
    airborneRatings: {
      Rw: 70,
      RwCtr: 67.41490151958673,
      RwCtrSemantic: "rw_plus_c"
    }
  },
  {
    id: "tuas_c3c_clt260_measured_2026",
    label: "TUAS C3c | CLT 260 mm | 13 mm gypsum + 2 x 15 mm gypsum + suspended ceiling",
    sourceLabel: "TUAS open measured dataset",
    sourceType: "open_measured_dataset",
    trustTier: "peer_reviewed_open_access",
    match: {
      absentRoles: ["upper_fill"],
      baseStructure: {
        materialIds: ["clt_panel"],
        thicknessMm: 260
      },
      resilientLayer: {
        materialIds: ["eps_underlay"],
        thicknessMm: 3
      },
      floatingScreed: {
        layerCount: 3,
        materialScheduleIds: ["gypsum_board", "gypsum_board", "gypsum_board"],
        thicknessScheduleMm: [13, 15, 15]
      },
      floorCovering: {
        materialIds: ["laminate_flooring"],
        thicknessMm: 8
      },
      ceilingCavity: {
        materialIds: ["acoustic_hanger_ceiling"],
        thicknessMm: 70
      },
      ceilingFill: {
        materialIds: ["rockwool"],
        thicknessMm: 100
      },
      ceilingBoard: {
        layerCount: 2,
        materialIds: ["gypsum_board"],
        thicknessMm: 13
      }
    },
    systemSummary: {
      carrier: "Cross-laminated timber slab 260 mm (edge-glued)",
      floorBuildUp: "13 mm gypsum board + 2 x 15 mm gypsum board + 3 mm EPS underlay + 8 mm laminate",
      ceiling: "70 mm acoustic hanger ceiling with 100 mm mineral wool and 2 x 13 mm gypsum board"
    },
    impactRatings: {
      CI: 2,
      CI50_2500: 16,
      LnW: 27,
      LnWPlusCI: 29
    },
    airborneRatings: {
      Rw: 73,
      RwCtr: 67.7537144078056,
      RwCtrSemantic: "rw_plus_c"
    }
  },
  {
    id: "tuas_c4c_clt260_measured_2026",
    label: "TUAS C4c | CLT 260 mm | 50 mm glass wool + 2 x 15 mm gypsum + suspended ceiling",
    sourceLabel: "TUAS open measured dataset",
    sourceType: "open_measured_dataset",
    trustTier: "peer_reviewed_open_access",
    match: {
      absentRoles: [],
      baseStructure: {
        materialIds: ["clt_panel"],
        thicknessMm: 260
      },
      resilientLayer: {
        materialIds: ["eps_underlay"],
        thicknessMm: 3
      },
      upperFill: {
        materialIds: ["glasswool_board"],
        thicknessMm: 50
      },
      floatingScreed: {
        layerCount: 2,
        materialIds: ["gypsum_board"],
        thicknessMm: 15
      },
      floorCovering: {
        materialIds: ["laminate_flooring"],
        thicknessMm: 8
      },
      ceilingCavity: {
        materialIds: ["acoustic_hanger_ceiling"],
        thicknessMm: 70
      },
      ceilingFill: {
        materialIds: ["rockwool"],
        thicknessMm: 100
      },
      ceilingBoard: {
        layerCount: 2,
        materialIds: ["gypsum_board"],
        thicknessMm: 13
      }
    },
    systemSummary: {
      carrier: "Cross-laminated timber slab 260 mm (edge-glued)",
      floorBuildUp: "50 mm glass wool + 2 x 15 mm gypsum board + 3 mm EPS underlay + 8 mm laminate",
      ceiling: "70 mm acoustic hanger ceiling with 100 mm mineral wool and 2 x 13 mm gypsum board"
    },
    impactRatings: {
      CI: 2,
      CI50_2500: 16,
      LnW: 24,
      LnWPlusCI: 26
    },
    airborneRatings: {
      Rw: 74,
      RwCtr: 69.69668895954507,
      RwCtrSemantic: "rw_plus_c"
    }
  },
  {
    id: "tuas_c5c_clt260_measured_2026",
    label: "TUAS C5c | CLT 260 mm | 50 mm glass wool dry floor + suspended ceiling",
    sourceLabel: "TUAS open measured dataset",
    sourceType: "open_measured_dataset",
    trustTier: "peer_reviewed_open_access",
    manualMatch: false,
    estimateMatch: {
      structuralSupportType: "mass_timber_clt",
      impactSystemType: "combined_upper_lower_system",
      baseSlab: {
        thicknessMm: 260
      },
      resilientLayer: {
        thicknessMm: 3,
        dynamicStiffnessMNm3: 64
      },
      upperFill: {
        materialClass: "generic_fill",
        thicknessMm: 50
      },
      floorCovering: {
        mode: "material_layer",
        materialClass: "laminate_flooring"
      },
      lowerTreatment: {
        type: "suspended_ceiling_rigid_hanger",
        boardLayerCount: 2,
        boardThicknessMm: 13,
        cavityFillThicknessMm: 100
      }
    },
    match: {
      absentRoles: [],
      baseStructure: {
        materialIds: ["clt_panel"],
        thicknessMm: 260
      },
      resilientLayer: {
        materialIds: ["eps_underlay"],
        thicknessMm: 3
      },
      floatingScreed: {
        materialIds: ["dry_floating_gypsum_fiberboard"],
        thicknessMm: 60
      },
      upperFill: {
        materialIds: ["generic_fill"],
        thicknessMm: 50
      },
      floorCovering: {
        materialIds: ["laminate_flooring"],
        thicknessMm: 8
      },
      ceilingCavity: {
        materialIds: ["acoustic_hanger_ceiling"]
      },
      ceilingFill: {
        materialIds: ["rockwool"],
        thicknessMm: 100
      },
      ceilingBoard: {
        layerCount: 2,
        materialIds: ["gypsum_board"],
        thicknessMm: 13
      }
    },
    systemSummary: {
      carrier: "Cross-laminated timber slab 260 mm (edge-glued)",
      floorBuildUp: "50 mm glass wool + 60 mm dry gypsum floor pack + 3 mm EPS underlay + 8 mm laminate",
      ceiling: "Hanging-wire suspended ceiling with 100 mm glass wool and 2 x 13 mm gypsum boards"
    },
    impactRatings: {
      CI: 4,
      CI50_2500: 6,
      LnW: 38,
      LnWPlusCI: 42
    },
    impactBands: {
      frequenciesHz: [20, 25, 31.5, 40, 50, 63, 80, 100, 125, 160, 200, 250, 315, 400, 500, 630, 800, 1000, 1250, 1600, 2000, 2500, 3150, 4000, 5000],
      labOrField: "lab",
      levelsDb: [
        86.44305944662032,
        82.43431154607758,
        85.48962188183688,
        71.93364560656336,
        68.32003476803226,
        64.4974627944173,
        54.49292795225674,
        40.97131071349352,
        37.50656725131751,
        31.26789426941332,
        32.71582932848809,
        26.500812262095714,
        24.95806525802386,
        25.325366244452574,
        20.62767147501809,
        20.96741997342113,
        20.6890275728863,
        15.112696846982956,
        17.517521963229665,
        13.883643478551626,
        13.10920526157864,
        10.96443857379316,
        9.785596370646438,
        6.306880086023325,
        5.266319858870024
      ],
      standardMethod: "open_measured_dataset"
    },
    airborneRatings: {
      Rw: 75,
      RwCtr: 70.46337519002095,
      RwCtrSemantic: "rw_plus_c"
    }
  },
  {
    id: "tuas_h2_concrete160_measured_2026",
    label: "TUAS H2 | 160 mm steel-reinforced concrete | laminate + EPS underlay",
    sourceLabel: "TUAS open measured dataset",
    sourceType: "open_measured_dataset",
    trustTier: "peer_reviewed_open_access",
    match: {
      absentRoles: ["ceiling_board", "ceiling_cavity", "ceiling_fill", "floating_screed", "upper_fill"],
      baseStructure: {
        materialIds: ["concrete"],
        thicknessMm: 160
      },
      resilientLayer: {
        materialIds: ["eps_underlay"],
        thicknessMm: 3
      },
      floorCovering: {
        materialIds: ["laminate_flooring"],
        thicknessMm: 8
      }
    },
    systemSummary: {
      carrier: "Steel-reinforced concrete slab 160 mm",
      floorBuildUp: "8 mm laminate on 3 mm EPS underlay",
      ceiling: "No additional lower treatment"
    },
    impactRatings: {
      CI: 2,
      CI50_2500: 5,
      LnW: 47,
      LnWPlusCI: 49
    },
    airborneRatings: {
      Rw: 49,
      RwCtr: 47.53683856051791,
      RwCtrSemantic: "rw_plus_c"
    }
  },
  {
    id: "tuas_h5_concrete160_measured_2026",
    label: "TUAS H5 | 160 mm steel-reinforced concrete | 50 mm glass wool dry floor + laminate",
    sourceLabel: "TUAS open measured dataset",
    sourceType: "open_measured_dataset",
    trustTier: "peer_reviewed_open_access",
    match: {
      absentRoles: ["ceiling_board", "ceiling_cavity", "ceiling_fill"],
      baseStructure: {
        materialIds: ["concrete"],
        thicknessMm: 160
      },
      resilientLayer: {
        materialIds: ["eps_underlay"],
        thicknessMm: 3
      },
      floatingScreed: {
        materialIds: ["dry_floating_gypsum_fiberboard"],
        thicknessMm: 60
      },
      upperFill: {
        materialIds: ["generic_fill"],
        thicknessMm: 50
      },
      floorCovering: {
        materialIds: ["laminate_flooring"],
        thicknessMm: 8
      }
    },
    systemSummary: {
      carrier: "Steel-reinforced concrete slab 160 mm",
      floorBuildUp: "50 mm glass wool + 60 mm dry gypsum floor pack + 3 mm EPS underlay + 8 mm laminate",
      ceiling: "No additional lower treatment"
    },
    impactRatings: {
      CI: 1,
      CI50_2500: 9,
      LnW: 46,
      LnWPlusCI: 47
    },
    airborneRatings: {
      Rw: 66,
      RwCtr: 64.50483471830356,
      RwCtrSemantic: "rw_plus_c"
    }
  }
]);
