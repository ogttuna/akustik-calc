import type {
  AirborneCalculatorId,
  AirborneConnectionType,
  AirborneContextMode,
  AirborneStudType,
  AirtightnessClass,
  ElectricalBoxState,
  FloorRole,
  JunctionQuality,
  PenetrationState,
  PerimeterSealClass,
  RequestedOutputId,
  SharedTrackClass
} from "@dynecho/shared";
import type { CSSProperties } from "react";

import type { PresetId, StudyMode } from "./preset-definitions";

export type MaterialIdGroup = {
  ids: readonly string[];
  label: string;
};

export type ControlOption<T extends string> = {
  label: string;
  note: string;
  value: T;
};

export type GuidedTopologyAction = {
  id: string;
  label: string;
  note: string;
  rows: ReadonlyArray<{ floorRole?: FloorRole; materialId: string; thicknessMm: string }>;
};

export type NewLayerDraft = {
  densityKgM3: string;
  dynamicStiffnessMNm3: string;
  floorRole?: FloorRole;
  materialId: string;
  thicknessMm: string;
};

export const SIMPLE_WORKBENCH_THEME = {} as CSSProperties;

export type FieldRelevanceTone = "optional" | "required";
export type ReviewTabId = "diagnostics" | "method" | "proposal";
export type AssemblyToolPanel = "composer" | "library" | "preview";
export type WorkbenchSectionTone = "assembly" | "results" | "review" | "route";
export type WorkspacePanelId = "results" | "review" | "setup" | "stack";

export const REVIEW_TABS: readonly { id: ReviewTabId; label: string; note: string }[] = [
  {
    id: "proposal",
    label: "Proposal",
    note: "Shape the live dynamic result into a client-facing offer sheet with issue control metadata."
  },
  {
    id: "method",
    label: "Method detail",
    note: "Explain why the current route is active, which outputs are defensible, and what is still parked."
  },
  {
    id: "diagnostics",
    label: "Diagnostics",
    note: "Keep provenance, confidence, and advanced traces visible without leaving the guided flow."
  }
] as const;

export const MODE_PRESETS: Record<StudyMode, readonly PresetId[]> = {
  floor: [
    "heavy_concrete_impact_floor",
    "clt_floor",
    "dataholz_clt_dry_exact",
    "ubiq_open_web_300_bound",
    "ubiq_steel_200_unspecified_bound",
    "ubiq_steel_300_unspecified_bound",
    "steel_suspended_fallback",
    "timber_bare_impact_only_fallback"
  ],
  wall: ["concrete_wall"]
};

export const TIMBER_IMPACT_ONLY_GUIDED_ACTIONS: readonly GuidedTopologyAction[] = [
  {
    id: "direct-impactstop-board",
    label: "Add direct ceiling board",
    note: "Append one 13 mm Impactstop board on the ceiling side to leave the broad bare-floor fallback.",
    rows: [{ floorRole: "ceiling_board", materialId: "impactstop_board", thicknessMm: "13" }]
  },
  {
    id: "furred-impactstop-package",
    label: "Add furred ceiling package",
    note: "Append 28 mm furring channel plus one 13 mm Impactstop board as a quick narrower Knauf path.",
    rows: [
      { floorRole: "ceiling_cavity", materialId: "furring_channel", thicknessMm: "28" },
      { floorRole: "ceiling_board", materialId: "impactstop_board", thicknessMm: "13" }
    ]
  },
  {
    id: "insulated-furred-package",
    label: "Add insulated furred package",
    note: "Append 28 mm furring channel, 90 mm rockwool, and one 13 mm Impactstop board to pin the full lower package.",
    rows: [
      { floorRole: "ceiling_cavity", materialId: "furring_channel", thicknessMm: "28" },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: "90" },
      { floorRole: "ceiling_board", materialId: "impactstop_board", thicknessMm: "13" }
    ]
  }
] as const;

export const STEEL_BOUND_SUPPORT_FORM_ACTIONS = [
  {
    id: "set-steel-joist-purlin-carrier",
    label: "Set steel joist / purlin carrier",
    materialId: "steel_joist_floor",
    note: "Switch the base row to steel joist / purlin so DynEcho can leave the crossover bound and stay inside the narrower FL-32 family."
  },
  {
    id: "set-open-web-carrier",
    label: "Set open-web / rolled carrier",
    materialId: "open_web_steel_floor",
    note: "Switch the base row to open-web / rolled steel so DynEcho can leave the crossover bound and stay inside the narrower FL-33 family."
  }
] as const;

export const MODE_MATERIAL_GROUPS: Record<StudyMode, readonly MaterialIdGroup[]> = {
  floor: [
    {
      ids: [
        "ceramic_tile",
        "porcelain_tile",
        "vinyl_flooring",
        "laminate_flooring",
        "engineered_timber_flooring",
        "engineered_timber_with_acoustic_underlay",
        "carpet_with_foam_underlay",
        "mlv",
        "bitumen_membrane",
        "dry_floating_gypsum_fiberboard",
        "impactstop_board",
        "firestop_board"
      ],
      label: "Top finish"
    },
    {
      ids: [
        "generic_resilient_underlay",
        "generic_resilient_underlay_s30",
        "eps_underlay",
        "mw_t_impact_layer",
        "mw_t_impact_layer_s35",
        "mw_t_impact_layer_s40",
        "mw_t_impact_layer_s6",
        "wf_t_impact_layer_s102",
        "geniemat_rst02",
        "geniemat_rst05",
        "geniemat_rst12",
        "regupol_sonus_curve_8",
        "regupol_sonus_multi_4_5",
        "getzner_afm_21",
        "getzner_afm_23",
        "getzner_afm_26",
        "getzner_afm_29",
        "getzner_afm_33",
        "getzner_afm_35"
      ],
      label: "Resilient and impact layer"
    },
    {
      ids: [
        "screed",
        "anhydrite_screed",
        "bonded_chippings",
        "non_bonded_chippings",
        "elastic_bonded_fill",
        "generic_fill",
        "particleboard_flooring",
        "osb",
        "plywood",
        "inex_floor_panel"
      ],
      label: "Build-up and deck"
    },
    {
      ids: [
        "concrete",
        "lightweight_concrete",
        "heavy_concrete",
        "clt_panel",
        "hollow_core_plank",
        "composite_steel_deck",
        "steel_joist_floor",
        "lightweight_steel_floor",
        "timber_joist_floor",
        "timber_frame_floor",
        "open_box_timber_slab",
        "open_web_steel_floor"
      ],
      label: "Base structure"
    },
    {
      ids: [
        "rockwool",
        "high_density_rockwool",
        "glasswool",
        "glasswool_board",
        "cellulose_fill",
        "wood_wool_panel",
        "pet_felt",
        "air_gap",
        "resilient_channel",
        "ubiq_resilient_ceiling",
        "genieclip_rst",
        "acoustic_mount_clip",
        "spring_hanger_track",
        "acoustic_hanger_ceiling",
        "resilient_stud_ceiling",
        "furring_channel",
        "resilient_support"
      ],
      label: "Ceiling and cavity"
    }
  ],
  wall: [
    {
      ids: [
        "gypsum_board",
        "acoustic_gypsum_board",
        "diamond_board",
        "security_board",
        "silentboard",
        "fire_board",
        "sheetrock_one",
        "cement_board",
        "cement_plaster",
        "gypsum_plaster",
        "lime_plaster",
        "dense_plaster",
        "lightweight_plaster",
        "lime_cement_plaster_1300",
        "lime_cement_plaster_1700",
        "lime_cement_plaster_1780",
        "skim_plaster",
        "celcon_lwt_plaster",
        "celcon_dense_plaster",
        "mlv",
        "bitumen_membrane"
      ],
      label: "Board and plaster finish"
    },
    {
      ids: [
        "concrete",
        "lightweight_concrete",
        "heavy_concrete",
        "clt_panel",
        "solid_brick",
        "hollow_brick",
        "aac",
        "ytong_aac_d700",
        "ytong_g5_800",
        "ytong_separatiepaneel_aac_4_600",
        "ytong_separatiepaneel_aac_5_750",
        "ytong_cellenbetonblok_g4_600",
        "ytong_cellenbetonblok_g5_800",
        "ytong_massief_g2_300",
        "celcon_solar_grade",
        "celcon_standard_grade",
        "celcon_high_strength",
        "pumice_block",
        "silka_cs_block",
        "porotherm_pls_100",
        "porotherm_pls_140",
        "porotherm_pls_190",
        "heluz_14_brushed",
        "heluz_aku_115",
        "heluz_aku_200_p15",
        "heluz_aku_300_333_p20"
      ],
      label: "Core mass"
    },
    {
      ids: [
        "rockwool",
        "high_density_rockwool",
        "glasswool",
        "glasswool_board",
        "cellulose_fill",
        "wood_wool_panel",
        "pet_felt",
        "air_gap",
        "resilient_support",
        "resilient_channel",
        "acoustic_mount_clip",
        "spring_hanger_track",
        "furring_channel"
      ],
      label: "Cavity and support"
    },
    {
      ids: [
        "screed",
        "vinyl_flooring",
        "ceramic_tile",
        "generic_resilient_underlay",
        "generic_resilient_underlay_s30",
        "hollow_core_plank",
        "steel_joist_floor",
        "lightweight_steel_floor",
        "composite_steel_deck",
        "timber_joist_floor",
        "timber_frame_floor",
        "open_box_timber_slab",
        "open_web_steel_floor",
        "mw_t_impact_layer",
        "generic_fill",
        "ubiq_resilient_ceiling",
        "genieclip_rst",
        "geniemat_rst02",
        "geniemat_rst05",
        "geniemat_rst12",
        "regupol_sonus_curve_8",
        "regupol_sonus_multi_4_5",
        "getzner_afm_21",
        "getzner_afm_23",
        "getzner_afm_26",
        "getzner_afm_29",
        "getzner_afm_33",
        "getzner_afm_35",
        "laminate_flooring",
        "eps_underlay",
        "mw_t_impact_layer_s35",
        "mw_t_impact_layer_s40",
        "mw_t_impact_layer_s6",
        "wf_t_impact_layer_s102",
        "bonded_chippings",
        "non_bonded_chippings",
        "elastic_bonded_fill",
        "acoustic_hanger_ceiling",
        "resilient_stud_ceiling",
        "dry_floating_gypsum_fiberboard",
        "inex_floor_panel",
        "engineered_timber_flooring",
        "engineered_timber_with_acoustic_underlay",
        "carpet_with_foam_underlay",
        "porcelain_tile",
        "impactstop_board",
        "firestop_board"
      ],
      label: "Other catalog materials"
    }
  ]
};

export const REMAINDER_MATERIAL_GROUP_LABEL: Record<StudyMode, string> = {
  floor: "More catalog materials",
  wall: "More catalog materials"
};

export const CALCULATOR_OPTIONS: readonly ControlOption<AirborneCalculatorId>[] = [
  {
    label: "Dynamic",
    note: "Recommended local airborne lane with the strongest current coverage.",
    value: "dynamic"
  },
  {
    label: "KS calibrated",
    note: "Alternative calibrated lane for cross-checking Rw behavior.",
    value: "ks_rw_calibrated"
  },
  {
    label: "Mass law",
    note: "Simple baseline comparison. Useful as a coarse sanity check only.",
    value: "mass_law"
  },
  {
    label: "Sharp",
    note: "Secondary delegate. Use when you want a different airborne anchor.",
    value: "sharp"
  },
  {
    label: "Kurtovic",
    note: "Secondary delegate for airborne comparison, not the default operator choice.",
    value: "kurtovic"
  }
];

export const AIRBORNE_CONTEXT_OPTIONS: readonly ControlOption<AirborneContextMode>[] = [
  {
    label: "Lab element",
    note: "Clean element-side airborne read. Field geometry stays out.",
    value: "element_lab"
  },
  {
    label: "Between rooms",
    note: "Apparent field-side airborne route. Good for R'w and Dn,w style checks.",
    value: "field_between_rooms"
  },
  {
    label: "Building prediction",
    note: "Use when you also want standardized DnT outputs and room data.",
    value: "building_prediction"
  }
];

export const CONNECTION_OPTIONS: readonly ControlOption<AirborneConnectionType>[] = [
  { label: "Auto", note: "Let the engine infer a likely connection type.", value: "auto" },
  { label: "None", note: "No explicit connection cue.", value: "none" },
  { label: "Line connection", note: "Typical direct linear framing connection.", value: "line_connection" },
  { label: "Point connection", note: "Point-fixed attachment condition.", value: "point_connection" },
  { label: "Mixed connection", note: "A mixed or uncertain attachment condition.", value: "mixed_connection" },
  { label: "Direct fix", note: "Direct-fix lining or mounting path.", value: "direct_fix" },
  { label: "Resilient channel", note: "Decoupled resilient-channel type path.", value: "resilient_channel" }
];

export const STUD_TYPE_OPTIONS: readonly ControlOption<AirborneStudType>[] = [
  { label: "Auto", note: "Let the engine infer the stud family if possible.", value: "auto" },
  { label: "Light steel stud", note: "Standard light-gauge steel framing.", value: "light_steel_stud" },
  { label: "Resilient stud", note: "Higher-decoupling resilient stud family.", value: "resilient_stud" },
  { label: "Wood stud", note: "Timber stud framing.", value: "wood_stud" }
];

export const AIRTIGHTNESS_OPTIONS: readonly ControlOption<AirtightnessClass>[] = [
  { label: "Unknown", note: "No explicit leakage assumption.", value: "unknown" },
  { label: "Good", note: "Tight build quality with low leakage penalty.", value: "good" },
  { label: "Average", note: "Moderate leakage risk.", value: "average" },
  { label: "Poor", note: "High leakage risk and conservative penalty.", value: "poor" }
];

export const SEAL_OPTIONS: readonly ControlOption<PerimeterSealClass>[] = [
  { label: "Unknown", note: "No perimeter-seal assumption.", value: "unknown" },
  { label: "Good", note: "Good sealing detail quality.", value: "good" },
  { label: "Average", note: "Some seal weakness is expected.", value: "average" },
  { label: "Poor", note: "Weak perimeter sealing.", value: "poor" }
];

export const PENETRATION_OPTIONS: readonly ControlOption<PenetrationState>[] = [
  { label: "Unknown", note: "Penetration condition not declared.", value: "unknown" },
  { label: "None", note: "No penetrations assumed.", value: "none" },
  { label: "Minor", note: "Some minor services or openings.", value: "minor" },
  { label: "Major", note: "Heavy service penetration condition.", value: "major" }
];

export const JUNCTION_OPTIONS: readonly ControlOption<JunctionQuality>[] = [
  { label: "Unknown", note: "No junction-quality assumption.", value: "unknown" },
  { label: "Good", note: "Tidy junction detailing.", value: "good" },
  { label: "Average", note: "Middle-of-the-road field detailing.", value: "average" },
  { label: "Poor", note: "Conservative flanking penalty posture.", value: "poor" }
];

export const ELECTRICAL_BOX_OPTIONS: readonly ControlOption<ElectricalBoxState>[] = [
  { label: "Unknown", note: "Box placement not declared.", value: "unknown" },
  { label: "None", note: "No box penalty path.", value: "none" },
  { label: "Separated", note: "Boxes exist but are well separated.", value: "separated" },
  { label: "Back-to-back", note: "Back-to-back electrical boxes.", value: "back_to_back" },
  { label: "Many", note: "Many boxes or clustered service points.", value: "many" }
];

export const TRACK_OPTIONS: readonly ControlOption<SharedTrackClass>[] = [
  { label: "Unknown", note: "Shared support condition not declared.", value: "unknown" },
  { label: "Independent", note: "Separate support path. Better field posture.", value: "independent" },
  { label: "Shared", note: "Shared support path and more coupling risk.", value: "shared" }
];

export const WALL_OUTPUT_PRESET_LAB: readonly RequestedOutputId[] = ["Rw", "STC", "C", "Ctr"];
export const WALL_OUTPUT_PRESET_FIELD: readonly RequestedOutputId[] = ["Rw", "R'w", "Dn,w", "Dn,A", "STC", "Ctr"];
export const WALL_OUTPUT_PRESET_BUILDING: readonly RequestedOutputId[] = ["Rw", "R'w", "DnT,w", "DnT,A", "Dn,w", "Dn,A", "STC", "Ctr"];
export const FLOOR_OUTPUT_PRESET_LAB: readonly RequestedOutputId[] = ["Rw", "Ln,w", "Ln,w+CI", "DeltaLw"];
export const FLOOR_OUTPUT_PRESET_FIELD: readonly RequestedOutputId[] = ["Ln,w", "DeltaLw", "Rw", "R'w", "L'n,w", "Dn,w"];
export const FLOOR_OUTPUT_PRESET_BUILDING: readonly RequestedOutputId[] = ["Ln,w", "DeltaLw", "Rw", "R'w", "DnT,w", "L'n,w", "L'nT,w", "L'nT,50"];

export const AUTOMATIC_OUTPUTS: Record<StudyMode, Record<AirborneContextMode, readonly RequestedOutputId[]>> = {
  floor: {
    building_prediction: FLOOR_OUTPUT_PRESET_BUILDING,
    element_lab: FLOOR_OUTPUT_PRESET_LAB,
    field_between_rooms: FLOOR_OUTPUT_PRESET_FIELD
  },
  wall: {
    building_prediction: WALL_OUTPUT_PRESET_BUILDING,
    element_lab: WALL_OUTPUT_PRESET_LAB,
    field_between_rooms: WALL_OUTPUT_PRESET_FIELD
  }
};

export const FIELD_IMPACT_OUTPUTS = new Set<RequestedOutputId>(["L'n,w", "L'nT,w", "L'nT,50", "LnT,A"]);

export const DEFAULT_NEW_LAYER_BY_MODE: Record<StudyMode, { materialId: string; thicknessMm: string }> = {
  floor: { materialId: "vinyl_flooring", thicknessMm: "4" },
  wall: { materialId: "gypsum_board", thicknessMm: "12.5" }
};
