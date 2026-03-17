import type { BoundFloorSystem } from "@dynecho/shared";

export const BOUND_FLOOR_SYSTEMS: readonly BoundFloorSystem[] = [
  {
    id: "ubiq_fl32_steel_200_lab_2026",
    label: "UBIQ FL-32 | 200 mm steel joist / purlin | INEX FLOOR 19 | 2 x 16 mm resilient ceiling",
    sourceLabel: "UBIQ official system table PDF",
    sourceType: "official_manufacturer_system_table",
    trustTier: "official_manufacturer",
    match: {
      absentRoles: ["upper_fill", "ceiling_fill"],
      baseStructure: {
        materialIds: ["steel_joist_floor"],
        thicknessMm: 200
      },
      floatingScreed: {
        materialIds: ["inex_floor_panel"],
        thicknessMm: 19
      },
      floorCovering: {
        materialIds: ["engineered_timber_with_acoustic_underlay"]
      },
      ceilingCavity: {
        materialIds: ["ubiq_resilient_ceiling"]
      },
      ceilingBoard: {
        layerCount: 2,
        materialIds: ["firestop_board"],
        thicknessMm: 16
      }
    },
    systemSummary: {
      carrier: "200 mm steel joist / purlin floor at 450 mm centres",
      floorBuildUp: "19 mm INEX FLOOR upper deck with engineered timber floor and acoustic underlay",
      ceiling: "Resilient ceiling family with 2 x 16 mm fire-rated plasterboard"
    },
    impactBounds: {
      LnWUpperBound: 53
    },
    airborneRatings: {
      Rw: 62,
      RwCtr: 56
    }
  },
  {
    id: "ubiq_fl32_steel_300_lab_2026",
    label: "UBIQ FL-32 | 300 mm steel joist / purlin | INEX FLOOR 19 | 2 x 16 mm resilient ceiling",
    sourceLabel: "UBIQ official system table PDF",
    sourceType: "official_manufacturer_system_table",
    trustTier: "official_manufacturer",
    match: {
      absentRoles: ["upper_fill", "ceiling_fill"],
      baseStructure: {
        materialIds: ["steel_joist_floor"],
        thicknessMm: 300
      },
      floatingScreed: {
        materialIds: ["inex_floor_panel"],
        thicknessMm: 19
      },
      floorCovering: {
        materialIds: ["engineered_timber_with_acoustic_underlay"]
      },
      ceilingCavity: {
        materialIds: ["ubiq_resilient_ceiling"]
      },
      ceilingBoard: {
        layerCount: 2,
        materialIds: ["firestop_board"],
        thicknessMm: 16
      }
    },
    systemSummary: {
      carrier: "300 mm steel joist / purlin floor at 450 mm centres",
      floorBuildUp: "19 mm INEX FLOOR upper deck with engineered timber floor and acoustic underlay",
      ceiling: "Resilient ceiling family with 2 x 16 mm fire-rated plasterboard"
    },
    impactBounds: {
      LnWUpperBound: 51
    },
    airborneRatings: {
      Rw: 62,
      RwCtr: 58
    }
  },
  {
    id: "ubiq_fl33_open_web_steel_200_lab_2026",
    label: "UBIQ FL-33 | 200 mm open-web / rolled steel | INEX FLOOR 19 | 2 x 16 mm resilient ceiling",
    sourceLabel: "UBIQ official system table PDF",
    sourceType: "official_manufacturer_system_table",
    trustTier: "official_manufacturer",
    match: {
      absentRoles: ["upper_fill", "ceiling_fill"],
      baseStructure: {
        materialIds: ["open_web_steel_floor"],
        thicknessMm: 200
      },
      floatingScreed: {
        materialIds: ["inex_floor_panel"],
        thicknessMm: 19
      },
      floorCovering: {
        materialIds: ["engineered_timber_with_acoustic_underlay"]
      },
      ceilingCavity: {
        materialIds: ["ubiq_resilient_ceiling"]
      },
      ceilingBoard: {
        layerCount: 2,
        materialIds: ["firestop_board"],
        thicknessMm: 16
      }
    },
    systemSummary: {
      carrier: "200 mm open-web / rolled steel floor at 450 mm centres",
      floorBuildUp: "19 mm INEX FLOOR upper deck with engineered timber floor and acoustic underlay",
      ceiling: "Resilient ceiling family with 2 x 16 mm fire-rated plasterboard"
    },
    impactBounds: {
      LnWUpperBound: 53
    },
    airborneRatings: {
      Rw: 62,
      RwCtr: 56
    }
  },
  {
    id: "ubiq_fl33_open_web_steel_300_lab_2026",
    label: "UBIQ FL-33 | 300 mm open-web / rolled steel | INEX FLOOR 19 | 2 x 16 mm resilient ceiling",
    sourceLabel: "UBIQ official system table PDF",
    sourceType: "official_manufacturer_system_table",
    trustTier: "official_manufacturer",
    match: {
      absentRoles: ["upper_fill", "ceiling_fill"],
      baseStructure: {
        materialIds: ["open_web_steel_floor"],
        thicknessMm: 300
      },
      floatingScreed: {
        materialIds: ["inex_floor_panel"],
        thicknessMm: 19
      },
      floorCovering: {
        materialIds: ["engineered_timber_with_acoustic_underlay"]
      },
      ceilingCavity: {
        materialIds: ["ubiq_resilient_ceiling"]
      },
      ceilingBoard: {
        layerCount: 2,
        materialIds: ["firestop_board"],
        thicknessMm: 16
      }
    },
    systemSummary: {
      carrier: "300 mm open-web / rolled steel floor at 450 mm centres",
      floorBuildUp: "19 mm INEX FLOOR upper deck with engineered timber floor and acoustic underlay",
      ceiling: "Resilient ceiling family with 2 x 16 mm fire-rated plasterboard"
    },
    impactBounds: {
      LnWUpperBound: 51
    },
    airborneRatings: {
      Rw: 63,
      RwCtr: 58
    }
  }
];
