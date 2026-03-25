"use client";

import type {
  AirborneCalculatorId,
  AirborneConnectionType,
  AirborneContextMode,
  AirborneContext,
  AirborneStudType,
  AirtightnessClass,
  AssemblyCalculation,
  ElectricalBoxState,
  FloorRole,
  ImpactFieldContext,
  JunctionQuality,
  MaterialCategory,
  MaterialDefinition,
  PenetrationState,
  PerimeterSealClass,
  RequestedOutputId,
  SharedTrackClass
} from "@dynecho/shared";
import { SurfacePanel } from "@dynecho/ui";
import { ArrowDown, ArrowUp, ChevronRight, Layers3, Moon, Plus, RotateCcw, Sun } from "lucide-react";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { useEffect, useState } from "react";

import { formatDecimal } from "@/lib/format";

import { describeAssembly, getMaterialCategoryLabel } from "./describe-assembly";
import {
  getCatalogDynamicStiffness,
  getEffectiveDynamicStiffness,
  hasDynamicStiffnessOverrideInput,
  hasEffectiveDynamicStiffnessOverride,
  parseDynamicStiffnessOverride
} from "./dynamic-stiffness";
import {
  getCatalogDensity,
  getEffectiveDensity,
  hasDensityOverrideInput,
  hasEffectiveDensityOverride,
  parseDensityOverride
} from "./material-density";
import { getDynamicCalcBranchSummary } from "./dynamic-calc-branch";
import {
  buildSimpleWorkbenchCorridorDossier,
  type SimpleWorkbenchCorridorDossierCard
} from "./simple-workbench-corridor-dossier";
import { SimpleWorkbenchDiagnosticsPanel } from "./simple-workbench-diagnostics-panel";
import {
  FIELD_AIRBORNE_OUTPUTS,
  getFieldAirborneBlockingRequirement,
  getFieldAirborneLiveDetail,
  getFieldAirbornePendingDetail,
  STANDARDIZED_AIRBORNE_OUTPUTS
} from "./field-airborne-output";
import { formatUnlockOutputs, getGuidedOutputUnlocks } from "./guided-output-unlocks";
import { getGuidedTopologyGap } from "./guided-topology-gap";
import { deriveGuidedRouteSignals } from "./guided-route-signals";
import { getGuidedValidationSummary, type GuidedValidationSummary } from "./guided-validation-summary";
import {
  IMPACT_ONLY_LOW_CONFIDENCE_CTR_DETAIL,
  IMPACT_ONLY_LOW_CONFIDENCE_LNW_DETAIL,
  IMPACT_ONLY_LOW_CONFIDENCE_RW_DETAIL,
  IMPACT_ONLY_LOW_CONFIDENCE_UNAVAILABLE_DETAIL,
  isImpactOnlyLowConfidenceFloorLane,
  isImpactOnlyLowConfidenceUnavailableOutput
} from "./impact-only-low-confidence-floor-lane";
import {
  formatGuidedSanityBand,
  getGuidedNumericSanityWarning,
  getLayerThicknessGuidanceHint,
  getLayerThicknessSanityWarning,
  GUIDED_INPUT_SANITY_BANDS
} from "./input-sanity";
import { prependRecommendedMaterialGroup } from "./material-picker-recommendations";
import { normalizeRows } from "./normalize-rows";
import { useTheme } from "./use-theme";
import { evaluateScenario } from "./scenario-analysis";
import { buildSimpleWorkbenchEvidencePacket } from "./simple-workbench-evidence";
import { buildSimpleWorkbenchMethodDossier } from "./simple-workbench-method-dossier";
import { SimpleWorkbenchMethodPanel } from "./simple-workbench-method-panel";
import { buildSimpleWorkbenchOutputPosture } from "./simple-workbench-output-posture";
import { buildSimpleWorkbenchProposalBrief } from "./simple-workbench-proposal-brief";
import { SimpleWorkbenchProposalConstructionFigure } from "./simple-workbench-proposal-construction-figure";
import { SimpleWorkbenchProposalPanel } from "./simple-workbench-proposal-panel";
import { isSteelBoundSupportFormLane } from "./steel-bound-support-form-lane";
import {
  FLOOR_ROLE_LABELS,
  REPORT_PROFILE_LABELS,
  REQUESTED_OUTPUT_LABELS,
  REQUESTED_OUTPUT_SUPPORT_NOTES,
  STUDY_CONTEXT_LABELS
} from "./workbench-data";
import {
  buildCustomMaterialDefinition,
  buildWorkbenchMaterialCatalog,
  createEmptyCustomMaterialDraft,
  CUSTOM_MATERIAL_CATEGORY_OPTIONS,
  defaultThicknessForMaterial,
  isCustomWorkbenchMaterial,
  validateCustomMaterialDraft,
  type CustomMaterialDraft,
  type CustomMaterialDraftErrors
} from "./workbench-materials";
import { WorkbenchMaterialPicker, type WorkbenchMaterialOptionGroup } from "./workbench-material-picker";
import { getPresetById, type PresetId, type StudyMode } from "./preset-definitions";
import type { LayerDraft } from "./workbench-store";
import { inferFloorRole, useWorkbenchStore } from "./workbench-store";

type MaterialIdGroup = {
  ids: readonly string[];
  label: string;
};

type ControlOption<T extends string> = {
  label: string;
  note: string;
  value: T;
};

type BaseOutputCardModel = {
  detail: string;
  label: string;
  output: RequestedOutputId;
  status: "bound" | "live" | "needs_input" | "unsupported";
  value: string;
};

type OutputCardModel = BaseOutputCardModel & {
  postureDetail: string;
  postureLabel: string;
  postureTone: "accent" | "neutral" | "success" | "warning";
};

type GuidedTopologyAction = {
  id: string;
  label: string;
  note: string;
  rows: ReadonlyArray<{ floorRole?: FloorRole; materialId: string; thicknessMm: string }>;
};

type NewLayerDraft = {
  densityKgM3: string;
  dynamicStiffnessMNm3: string;
  floorRole?: FloorRole;
  materialId: string;
  thicknessMm: string;
};

const SIMPLE_WORKBENCH_THEME = {} as CSSProperties;

type FieldRelevanceTone = "optional" | "required";
type ReviewTabId = "diagnostics" | "method" | "proposal";
type AssemblyToolPanel = "composer" | "library" | "preview";
type WorkbenchSectionTone = "assembly" | "results" | "review" | "route";
type WorkspacePanelId = "results" | "review" | "setup" | "stack";

const REVIEW_TABS: readonly { id: ReviewTabId; label: string; note: string }[] = [
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

const MODE_PRESETS: Record<StudyMode, readonly PresetId[]> = {
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

const TIMBER_IMPACT_ONLY_GUIDED_ACTIONS: readonly GuidedTopologyAction[] = [
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

const STEEL_BOUND_SUPPORT_FORM_ACTIONS = [
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

const MODE_MATERIAL_GROUPS: Record<StudyMode, readonly MaterialIdGroup[]> = {
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

const REMAINDER_MATERIAL_GROUP_LABEL: Record<StudyMode, string> = {
  floor: "More catalog materials",
  wall: "More catalog materials"
};

const CALCULATOR_OPTIONS: readonly ControlOption<AirborneCalculatorId>[] = [
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

const AIRBORNE_CONTEXT_OPTIONS: readonly ControlOption<AirborneContextMode>[] = [
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

const CONNECTION_OPTIONS: readonly ControlOption<AirborneConnectionType>[] = [
  { label: "Auto", note: "Let the engine infer a likely connection type.", value: "auto" },
  { label: "None", note: "No explicit connection cue.", value: "none" },
  { label: "Line connection", note: "Typical direct linear framing connection.", value: "line_connection" },
  { label: "Point connection", note: "Point-fixed attachment condition.", value: "point_connection" },
  { label: "Mixed connection", note: "A mixed or uncertain attachment condition.", value: "mixed_connection" },
  { label: "Direct fix", note: "Direct-fix lining or mounting path.", value: "direct_fix" },
  { label: "Resilient channel", note: "Decoupled resilient-channel type path.", value: "resilient_channel" }
];

const STUD_TYPE_OPTIONS: readonly ControlOption<AirborneStudType>[] = [
  { label: "Auto", note: "Let the engine infer the stud family if possible.", value: "auto" },
  { label: "Light steel stud", note: "Standard light-gauge steel framing.", value: "light_steel_stud" },
  { label: "Resilient stud", note: "Higher-decoupling resilient stud family.", value: "resilient_stud" },
  { label: "Wood stud", note: "Timber stud framing.", value: "wood_stud" }
];

const AIRTIGHTNESS_OPTIONS: readonly ControlOption<AirtightnessClass>[] = [
  { label: "Unknown", note: "No explicit leakage assumption.", value: "unknown" },
  { label: "Good", note: "Tight build quality with low leakage penalty.", value: "good" },
  { label: "Average", note: "Moderate leakage risk.", value: "average" },
  { label: "Poor", note: "High leakage risk and conservative penalty.", value: "poor" }
];

const SEAL_OPTIONS: readonly ControlOption<PerimeterSealClass>[] = [
  { label: "Unknown", note: "No perimeter-seal assumption.", value: "unknown" },
  { label: "Good", note: "Good sealing detail quality.", value: "good" },
  { label: "Average", note: "Some seal weakness is expected.", value: "average" },
  { label: "Poor", note: "Weak perimeter sealing.", value: "poor" }
];

const PENETRATION_OPTIONS: readonly ControlOption<PenetrationState>[] = [
  { label: "Unknown", note: "Penetration condition not declared.", value: "unknown" },
  { label: "None", note: "No penetrations assumed.", value: "none" },
  { label: "Minor", note: "Some minor services or openings.", value: "minor" },
  { label: "Major", note: "Heavy service penetration condition.", value: "major" }
];

const JUNCTION_OPTIONS: readonly ControlOption<JunctionQuality>[] = [
  { label: "Unknown", note: "No junction-quality assumption.", value: "unknown" },
  { label: "Good", note: "Tidy junction detailing.", value: "good" },
  { label: "Average", note: "Middle-of-the-road field detailing.", value: "average" },
  { label: "Poor", note: "Conservative flanking penalty posture.", value: "poor" }
];

const ELECTRICAL_BOX_OPTIONS: readonly ControlOption<ElectricalBoxState>[] = [
  { label: "Unknown", note: "Box placement not declared.", value: "unknown" },
  { label: "None", note: "No box penalty path.", value: "none" },
  { label: "Separated", note: "Boxes exist but are well separated.", value: "separated" },
  { label: "Back-to-back", note: "Back-to-back electrical boxes.", value: "back_to_back" },
  { label: "Many", note: "Many boxes or clustered service points.", value: "many" }
];

const TRACK_OPTIONS: readonly ControlOption<SharedTrackClass>[] = [
  { label: "Unknown", note: "Shared support condition not declared.", value: "unknown" },
  { label: "Independent", note: "Separate support path. Better field posture.", value: "independent" },
  { label: "Shared", note: "Shared support path and more coupling risk.", value: "shared" }
];

const WALL_OUTPUT_PRESET_LAB: readonly RequestedOutputId[] = ["Rw", "STC", "C", "Ctr"];
const WALL_OUTPUT_PRESET_FIELD: readonly RequestedOutputId[] = ["Rw", "R'w", "Dn,w", "Dn,A", "STC", "Ctr"];
const WALL_OUTPUT_PRESET_BUILDING: readonly RequestedOutputId[] = ["Rw", "R'w", "DnT,w", "DnT,A", "Dn,w", "Dn,A", "STC", "Ctr"];
const FLOOR_OUTPUT_PRESET_LAB: readonly RequestedOutputId[] = ["Rw", "Ln,w", "Ln,w+CI", "DeltaLw"];
const FLOOR_OUTPUT_PRESET_FIELD: readonly RequestedOutputId[] = ["Ln,w", "DeltaLw", "Rw", "R'w", "L'n,w", "Dn,w"];
const FLOOR_OUTPUT_PRESET_BUILDING: readonly RequestedOutputId[] = ["Ln,w", "DeltaLw", "Rw", "R'w", "DnT,w", "L'n,w", "L'nT,w", "L'nT,50"];

const AUTOMATIC_OUTPUTS: Record<StudyMode, Record<AirborneContextMode, readonly RequestedOutputId[]>> = {
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

const FIELD_IMPACT_OUTPUTS = new Set<RequestedOutputId>(["L'n,w", "L'nT,w", "L'nT,50", "LnT,A"]);

const DEFAULT_NEW_LAYER_BY_MODE: Record<StudyMode, { materialId: string; thicknessMm: string }> = {
  floor: { materialId: "vinyl_flooring", thicknessMm: "4" },
  wall: { materialId: "gypsum_board", thicknessMm: "12.5" }
};

function formatSignedDb(value: number | null | undefined): string {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return "Not ready";
  }

  return `${value >= 0 ? "+" : ""}${formatDecimal(value)} dB`;
}

function parsePositiveNumber(value: string): number | undefined {
  const parsed = Number(value);

  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
}

function isThicknessReady(thicknessMm: string): boolean {
  return typeof parsePositiveNumber(thicknessMm) === "number";
}

function getDynamicStiffnessInputWarning(value: string | undefined): string | null {
  if (!hasDynamicStiffnessOverrideInput(value)) {
    return null;
  }

  return parseDynamicStiffnessOverride(value) ? null : "Dynamic stiffness override must be a positive number in MN/m³.";
}

function getDensityInputWarning(material: MaterialDefinition, value: string | undefined): string | null {
  if (!hasDensityOverrideInput(value)) {
    return null;
  }

  return parseDensityOverride({
    material,
    value
  })
    ? null
    : "Density override must be non-negative in kg/m³. Use zero only for gap or support layers.";
}

function formatDynamicStiffnessLabel(material: MaterialDefinition, overrideValue: string | undefined): string {
  const effectiveDynamicStiffness = getEffectiveDynamicStiffness({
    material,
    overrideValue
  });

  if (typeof effectiveDynamicStiffness !== "number") {
    return hasDynamicStiffnessOverrideInput(overrideValue) ? "Invalid override" : "Not listed";
  }

  return `${formatDecimal(effectiveDynamicStiffness)} MN/m³${
    hasEffectiveDynamicStiffnessOverride({ material, overrideValue }) ? " (manual)" : ""
  }`;
}

function formatDensityValue(densityKgM3: number | undefined): string | null {
  if (!(typeof densityKgM3 === "number" && Number.isFinite(densityKgM3) && densityKgM3 >= 0)) {
    return null;
  }

  const valueLabel = Number.isInteger(densityKgM3) ? densityKgM3.toLocaleString("en-US") : formatDecimal(densityKgM3);

  return `${valueLabel} kg/m³`;
}

function uniqueMaterialsById(materials: readonly MaterialDefinition[]): MaterialDefinition[] {
  const seen = new Set<string>();

  return materials.filter((material) => {
    if (seen.has(material.id)) {
      return false;
    }

    seen.add(material.id);
    return true;
  });
}

function buildMaterialGroups(
  studyMode: StudyMode,
  allMaterials: readonly MaterialDefinition[],
  selectedMaterialId: string,
  floorRole?: FloorRole
): WorkbenchMaterialOptionGroup[] {
  const materialById = new Map(allMaterials.map((material) => [material.id, material]));
  const groups = MODE_MATERIAL_GROUPS[studyMode]
    .map((group) => ({
      label: group.label,
      materials: group.ids
        .map((id) => materialById.get(id))
        .filter((material): material is MaterialDefinition => Boolean(material))
  }))
    .filter((group) => group.materials.length > 0);

  const includedIds = new Set(groups.flatMap((group) => group.materials.map((material) => material.id)));
  const customMaterials = uniqueMaterialsById(
    allMaterials
      .filter((material) => !includedIds.has(material.id) && isCustomWorkbenchMaterial(material))
      .sort((left, right) => left.name.localeCompare(right.name, "en"))
  );
  if (customMaterials.length > 0) {
    groups.unshift({
      label: "Custom materials",
      materials: customMaterials
    });
  }

  if (!includedIds.has(selectedMaterialId)) {
    const selectedMaterial = materialById.get(selectedMaterialId);
    if (selectedMaterial && !isCustomWorkbenchMaterial(selectedMaterial)) {
      includedIds.add(selectedMaterial.id);
      groups.unshift({
        label: "Current row material",
        materials: [selectedMaterial]
      });
    }
  }

  const remainderMaterials = uniqueMaterialsById(
    allMaterials
      .filter((material) => !includedIds.has(material.id) && !isCustomWorkbenchMaterial(material))
      .sort((left, right) => left.name.localeCompare(right.name, "en"))
  );

  if (remainderMaterials.length > 0) {
    groups.push({
      label: REMAINDER_MATERIAL_GROUP_LABEL[studyMode],
      materials: remainderMaterials
    });
  }

  return prependRecommendedMaterialGroup({
    floorRole,
    groups: groups.map((group) => ({
      label: group.label,
      materials: uniqueMaterialsById(group.materials)
    })),
    materials: allMaterials,
    selectedMaterialId,
    studyMode
  });
}

function getStackEdgeLabel(studyMode: StudyMode, index: number, totalRows: number): string | null {
  if (index === 0) {
    return studyMode === "floor" ? "Walking side" : "Side A";
  }

  if (index === totalRows - 1) {
    return studyMode === "floor" ? "Ceiling side" : "Side B";
  }

  return null;
}

function getStackBoundaryLabels(studyMode: StudyMode): { end: string; start: string } {
  return studyMode === "floor"
    ? { end: "Ceiling side", start: "Walking side" }
    : { end: "Side B", start: "Side A" };
}

function getLayerPositionNarrative(studyMode: StudyMode, index: number, totalRows: number): string {
  const boundary = getStackBoundaryLabels(studyMode);

  if (totalRows <= 1) {
    return "Only visible row in the current draft.";
  }

  if (index === 0) {
    return `Starts on ${boundary.start}.`;
  }

  if (index === totalRows - 1) {
    return `Closes on ${boundary.end}.`;
  }

  return `Sits between ${boundary.start} and ${boundary.end}.`;
}

function getEnvironmentLabel(contextMode: AirborneContextMode): string {
  return AIRBORNE_CONTEXT_OPTIONS.find((option) => option.value === contextMode)?.label ?? "Lab element";
}

function sumThickness(rows: readonly LayerDraft[]): number {
  return rows.reduce((total, row) => total + (parsePositiveNumber(row.thicknessMm) ?? 0), 0);
}

function countValidThicknessRows(rows: readonly LayerDraft[]): number {
  return rows.filter((row) => typeof parsePositiveNumber(row.thicknessMm) === "number").length;
}

function formatCountLabel(count: number, singular: string): string {
  return `${count} ${singular}${count === 1 ? "" : "s"}`;
}

function getRowActivityCounts(rows: readonly LayerDraft[], materials?: readonly MaterialDefinition[]): {
  collapsedLiveRowCount: number;
  liveRowCount: number;
  parkedRowCount: number;
  solverLayerCount: number;
} {
  const liveRowCount = countValidThicknessRows(rows);
  const solverLayerCount = normalizeRows(rows, materials).layers.length;

  return {
    collapsedLiveRowCount: Math.max(liveRowCount - solverLayerCount, 0),
    liveRowCount,
    parkedRowCount: Math.max(rows.length - liveRowCount, 0),
    solverLayerCount
  };
}

function countAssignedFloorRoles(rows: readonly LayerDraft[]): number {
  return rows.filter((row) => typeof row.floorRole === "string").length;
}

function getAutomaticOutputs(studyMode: StudyMode, contextMode: AirborneContextMode): RequestedOutputId[] {
  return [...AUTOMATIC_OUTPUTS[studyMode][contextMode]];
}

function sameRequestedOutputs(left: readonly RequestedOutputId[], right: readonly RequestedOutputId[]): boolean {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}

function getStudyModeLabel(studyMode: StudyMode): string {
  return studyMode === "floor" ? "Floor" : "Wall";
}

function getAutomaticOutputNarrative(studyMode: StudyMode, contextMode: AirborneContextMode): string {
  if (studyMode === "floor") {
    if (contextMode === "element_lab") {
      return "Lab-side floor outputs with airborne companion values.";
    }

    if (contextMode === "field_between_rooms") {
      return "Room-to-room floor outputs plus direct field-side companions.";
    }

    return "Building-style floor outputs, including standardized field reads when enough data is present.";
  }

  if (contextMode === "element_lab") {
    return "Core wall airborne outputs without field penalties or room data.";
  }

  if (contextMode === "field_between_rooms") {
    return "Room-to-room wall outputs with apparent and normalized airborne reads.";
  }

  return "Building-style wall outputs, including standardized airborne values.";
}

function layerFillClass(material: MaterialDefinition): string {
  switch (material.category) {
    case "finish":
      return "bg-[color:color-mix(in_oklab,var(--accent)_12%,var(--paper))]";
    case "insulation":
      return "bg-[color:color-mix(in_oklab,var(--success)_12%,var(--paper))]";
    case "gap":
      return "bg-[color:color-mix(in_oklab,var(--ink)_4%,var(--paper))]";
    case "support":
      return "bg-[color:color-mix(in_oklab,var(--warning)_16%,var(--paper))]";
    case "mass":
    default:
      return "bg-[color:color-mix(in_oklab,var(--ink)_10%,var(--paper))]";
  }
}

function layerStrokeClass(material: MaterialDefinition): string {
  switch (material.category) {
    case "finish":
      return "border-[color:color-mix(in_oklab,var(--accent)_50%,var(--line))]";
    case "insulation":
      return "border-[color:color-mix(in_oklab,var(--success)_50%,var(--line))]";
    case "gap":
      return "border-[color:color-mix(in_oklab,var(--ink)_22%,var(--line))]";
    case "support":
      return "border-[color:color-mix(in_oklab,var(--warning)_50%,var(--line))]";
    case "mass":
    default:
      return "border-[color:color-mix(in_oklab,var(--ink)_35%,var(--line))]";
  }
}

type LayerVisualSurface = {
  frontStyle: CSSProperties;
  sideStyle: CSSProperties;
  topStyle: CSSProperties;
};

function buildLayerFaceStyle(input: {
  backgroundColor: string;
  backgroundImage?: string;
  backgroundSize?: string;
}): CSSProperties {
  return {
    backgroundColor: input.backgroundColor,
    backgroundImage: input.backgroundImage,
    backgroundSize: input.backgroundSize
  };
}

function getLayerVisualSurface(material: MaterialDefinition): LayerVisualSurface {
  switch (material.category) {
    case "finish":
      return {
        frontStyle: buildLayerFaceStyle({
          backgroundColor: "color-mix(in oklch,var(--accent) 48%, var(--paper))",
          backgroundImage: "linear-gradient(170deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0) 60%)"
        }),
        sideStyle: buildLayerFaceStyle({
          backgroundColor: "color-mix(in oklch,var(--accent-ink) 58%, var(--paper))",
          backgroundImage: "linear-gradient(180deg, rgba(255,255,255,0.10), rgba(0,0,0,0.10))"
        }),
        topStyle: buildLayerFaceStyle({
          backgroundColor: "color-mix(in oklch,var(--accent) 36%, var(--paper))",
          backgroundImage: "linear-gradient(180deg, rgba(255,255,255,0.24), rgba(255,255,255,0.04))"
        })
      };
    case "insulation":
      return {
        frontStyle: buildLayerFaceStyle({
          backgroundColor: "color-mix(in oklch,var(--success) 44%, var(--paper))",
          backgroundImage:
            "repeating-linear-gradient(45deg, transparent 0 6px, rgba(255,255,255,0.28) 6px 7px, transparent 7px 13px)"
        }),
        sideStyle: buildLayerFaceStyle({
          backgroundColor: "color-mix(in oklch,var(--success-ink) 54%, var(--paper))",
          backgroundImage: "linear-gradient(180deg, rgba(255,255,255,0.12), rgba(0,0,0,0.10))"
        }),
        topStyle: buildLayerFaceStyle({
          backgroundColor: "color-mix(in oklch,var(--success) 30%, var(--paper))",
          backgroundImage:
            "repeating-linear-gradient(45deg, transparent 0 6px, rgba(255,255,255,0.20) 6px 7px, transparent 7px 13px)"
        })
      };
    case "gap":
      return {
        frontStyle: buildLayerFaceStyle({
          backgroundColor: "color-mix(in oklch,var(--ink) 10%, var(--paper))",
          backgroundImage: "radial-gradient(circle at 1.5px 1.5px, var(--ink-faint) 1px, transparent 0)",
          backgroundSize: "8px 8px"
        }),
        sideStyle: buildLayerFaceStyle({
          backgroundColor: "color-mix(in oklch,var(--ink) 18%, var(--paper))",
          backgroundImage: "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(0,0,0,0.06))"
        }),
        topStyle: buildLayerFaceStyle({
          backgroundColor: "color-mix(in oklch,var(--ink) 8%, var(--paper))",
          backgroundImage: "radial-gradient(circle at 1.5px 1.5px, var(--ink-faint) 0.8px, transparent 0)",
          backgroundSize: "8px 8px"
        })
      };
    case "support":
      return {
        frontStyle: buildLayerFaceStyle({
          backgroundColor: "color-mix(in oklch,var(--warning) 44%, var(--paper))",
          backgroundImage:
            "repeating-linear-gradient(135deg, rgba(0,0,0,0.08) 0 6px, transparent 6px 12px)"
        }),
        sideStyle: buildLayerFaceStyle({
          backgroundColor: "color-mix(in oklch,var(--warning-ink) 54%, var(--paper))",
          backgroundImage: "linear-gradient(180deg, rgba(255,255,255,0.12), rgba(0,0,0,0.10))"
        }),
        topStyle: buildLayerFaceStyle({
          backgroundColor: "color-mix(in oklch,var(--warning) 30%, var(--paper))",
          backgroundImage:
            "repeating-linear-gradient(135deg, rgba(0,0,0,0.06) 0 6px, transparent 6px 12px)"
        })
      };
    case "mass":
    default:
      return {
        frontStyle: buildLayerFaceStyle({
          backgroundColor: "color-mix(in oklch,var(--ink) 32%, var(--paper))",
          backgroundImage: "linear-gradient(170deg, rgba(255,255,255,0.14) 0%, rgba(0,0,0,0.04) 100%)"
        }),
        sideStyle: buildLayerFaceStyle({
          backgroundColor: "color-mix(in oklch,var(--ink) 46%, var(--paper))",
          backgroundImage: "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(0,0,0,0.10))"
        }),
        topStyle: buildLayerFaceStyle({
          backgroundColor: "color-mix(in oklch,var(--ink) 22%, var(--paper))",
          backgroundImage: "linear-gradient(180deg, rgba(255,255,255,0.16), rgba(0,0,0,0.02))"
        })
      };
  }
}

function buildUnavailableOutputDetail(input: {
  output: RequestedOutputId;
  result: AssemblyCalculation | null;
  studyMode: StudyMode;
}): string {
  const { output, result, studyMode } = input;
  const isImpactOnlyLowConfidenceLane = isImpactOnlyLowConfidenceFloorLane(result);

  if (!result) {
    return "Add a valid layer stack first.";
  }

  if (FIELD_AIRBORNE_OUTPUTS.has(output)) {
    const pendingDetail = getFieldAirbornePendingDetail(output, result);

    if (pendingDetail) {
      return pendingDetail;
    }
  }

  if (FIELD_IMPACT_OUTPUTS.has(output) && studyMode === "floor") {
    if (output === "L'n,w") {
      return "Need field K or a direct field supplement for L'n,w.";
    }

    if (output === "L'nT,w" || output === "L'nT,50") {
      return "Need field K together with receiving-room volume for standardized field impact outputs.";
    }

    if (output === "LnT,A") {
      return "Needs an exact Dutch field-band source. The simple panel does not fabricate it.";
    }
  }

  if (isImpactOnlyLowConfidenceLane && isImpactOnlyLowConfidenceUnavailableOutput(output)) {
    return IMPACT_ONLY_LOW_CONFIDENCE_UNAVAILABLE_DETAIL;
  }

  if (output === "Ln,w+CI" || output === "CI" || output === "CI,50-2500") {
    return "This appears only when the active impact lane carries low-frequency companion terms.";
  }

  return REQUESTED_OUTPUT_SUPPORT_NOTES[output];
}

function isRouteBlockedOutput(input: {
  output: RequestedOutputId;
  result: AssemblyCalculation | null;
  studyMode: StudyMode;
}): boolean {
  const { output, result, studyMode } = input;

  if (!result) {
    return true;
  }

  if (FIELD_AIRBORNE_OUTPUTS.has(output)) {
    return getFieldAirborneBlockingRequirement(output, result) !== null;
  }

  if (FIELD_IMPACT_OUTPUTS.has(output) && studyMode === "floor") {
    return true;
  }

  return false;
}

function buildOutputCard(input: {
  output: RequestedOutputId;
  result: AssemblyCalculation | null;
  studyMode: StudyMode;
}): BaseOutputCardModel {
  const { output, result, studyMode } = input;
  const fieldRatings = result?.ratings.field;
  const isImpactOnlyLowConfidenceLane = isImpactOnlyLowConfidenceFloorLane(result);

  switch (output) {
    case "Rw":
      if (studyMode === "floor" && typeof result?.floorSystemRatings?.Rw === "number") {
        return {
          detail: "Airborne companion carried on the active floor lane.",
          label: "Rw",
          output,
          status: "live",
          value: `${formatDecimal(result.floorSystemRatings.Rw)} dB`
        };
      }

      if (typeof result?.metrics.estimatedRwDb === "number") {
        return {
          detail: isImpactOnlyLowConfidenceLane ? IMPACT_ONLY_LOW_CONFIDENCE_RW_DETAIL : "Weighted airborne element rating from the active airborne calculator.",
          label: "Rw",
          output,
          status: "live",
          value: `${formatDecimal(result.metrics.estimatedRwDb)} dB`
        };
      }
      break;
    case "R'w":
      if (typeof result?.metrics.estimatedRwPrimeDb === "number") {
        return {
          detail: getFieldAirborneLiveDetail("R'w", result),
          label: "R'w",
          output,
          status: "live",
          value: `${formatDecimal(result.metrics.estimatedRwPrimeDb)} dB`
        };
      }
      break;
    case "STC":
      if (typeof result?.metrics.estimatedStc === "number") {
        return {
          detail: "ASTM single-number companion from the same airborne curve.",
          label: "STC",
          output,
          status: "live",
          value: `${formatDecimal(result.metrics.estimatedStc)} dB`
        };
      }
      break;
    case "C":
      if (typeof result?.metrics.estimatedCDb === "number") {
        return {
          detail: "Mid-frequency adaptation term on the airborne lane.",
          label: "C",
          output,
          status: "live",
          value: formatSignedDb(result.metrics.estimatedCDb)
        };
      }
      break;
    case "Ctr":
      if (typeof result?.metrics.estimatedCtrDb === "number") {
        return {
          detail: isImpactOnlyLowConfidenceLane ? IMPACT_ONLY_LOW_CONFIDENCE_CTR_DETAIL : "Traffic-noise adaptation term on the airborne lane.",
          label: "Ctr",
          output,
          status: "live",
          value: formatSignedDb(result.metrics.estimatedCtrDb)
        };
      }
      break;
    case "DnT,w":
      if (typeof result?.metrics.estimatedDnTwDb === "number") {
        return {
          detail: getFieldAirborneLiveDetail("DnT,w", result),
          label: "DnT,w",
          output,
          status: "live",
          value: `${formatDecimal(result.metrics.estimatedDnTwDb)} dB`
        };
      }
      break;
    case "DnT,A":
      if (typeof result?.metrics.estimatedDnTADb === "number") {
        return {
          detail: getFieldAirborneLiveDetail("DnT,A", result),
          label: "DnT,A",
          output,
          status: "live",
          value: `${formatDecimal(result.metrics.estimatedDnTADb)} dB`
        };
      }
      break;
    case "DnT,A,k":
      if (typeof fieldRatings?.DnTAk === "number" || typeof result?.metrics.estimatedDnTAkDb === "number") {
        return {
          detail: getFieldAirborneLiveDetail("DnT,A,k", result),
          label: "DnT,A,k",
          output,
          status: "live",
          value: `${formatDecimal(fieldRatings?.DnTAk ?? result?.metrics.estimatedDnTAkDb ?? 0)} dB`
        };
      }
      break;
    case "Dn,w":
      if (typeof result?.metrics.estimatedDnWDb === "number") {
        return {
          detail: getFieldAirborneLiveDetail("Dn,w", result),
          label: "Dn,w",
          output,
          status: "live",
          value: `${formatDecimal(result.metrics.estimatedDnWDb)} dB`
        };
      }
      break;
    case "Dn,A":
      if (typeof result?.metrics.estimatedDnADb === "number") {
        return {
          detail: getFieldAirborneLiveDetail("Dn,A", result),
          label: "Dn,A",
          output,
          status: "live",
          value: `${formatDecimal(result.metrics.estimatedDnADb)} dB`
        };
      }
      break;
    case "Ln,w":
      if (typeof result?.impact?.LnW === "number") {
        return {
          detail: isImpactOnlyLowConfidenceLane ? IMPACT_ONLY_LOW_CONFIDENCE_LNW_DETAIL : "Lab-side weighted normalized impact sound level.",
          label: "Ln,w",
          output,
          status: "live",
          value: `${formatDecimal(result.impact.LnW)} dB`
        };
      }

      if (typeof result?.lowerBoundImpact?.LnWUpperBound === "number") {
        return {
          detail: "Conservative upper bound from a bound-only floor family lane.",
          label: "Ln,w",
          output,
          status: "bound",
          value: `<= ${formatDecimal(result.lowerBoundImpact.LnWUpperBound)} dB`
        };
      }
      break;
    case "L'n,w":
      if (typeof result?.impact?.LPrimeNW === "number") {
        return {
          detail: "Field-side impact value after K or direct-path carry-over.",
          label: "L'n,w",
          output,
          status: "live",
          value: `${formatDecimal(result.impact.LPrimeNW)} dB`
        };
      }

      if (typeof result?.lowerBoundImpact?.LPrimeNWUpperBound === "number") {
        return {
          detail: "Conservative field-side impact upper bound.",
          label: "L'n,w",
          output,
          status: "bound",
          value: `<= ${formatDecimal(result.lowerBoundImpact.LPrimeNWUpperBound)} dB`
        };
      }
      break;
    case "CI":
      if (typeof result?.impact?.CI === "number") {
        return {
          detail: "Low-frequency impact companion term.",
          label: "CI",
          output,
          status: "live",
          value: formatSignedDb(result.impact.CI)
        };
      }
      break;
    case "CI,50-2500":
      if (typeof result?.impact?.CI50_2500 === "number") {
        return {
          detail: "Extended low-frequency impact companion term.",
          label: "CI,50-2500",
          output,
          status: "live",
          value: formatSignedDb(result.impact.CI50_2500)
        };
      }
      break;
    case "Ln,w+CI":
      if (typeof result?.impact?.LnWPlusCI === "number") {
        return {
          detail: "Combined weighted impact result with CI carry-over.",
          label: "Ln,w+CI",
          output,
          status: "live",
          value: `${formatDecimal(result.impact.LnWPlusCI)} dB`
        };
      }
      break;
    case "DeltaLw":
      if (typeof result?.impact?.DeltaLw === "number") {
        return {
          detail: "Heavy-reference improvement term from the active impact lane.",
          label: "DeltaLw",
          output,
          status: "live",
          value: `${formatDecimal(result.impact.DeltaLw)} dB`
        };
      }

      if (typeof result?.lowerBoundImpact?.DeltaLwLowerBound === "number") {
        return {
          detail: "Conservative lower bound from a bound-only support lane.",
          label: "DeltaLw",
          output,
          status: "bound",
          value: `>= ${formatDecimal(result.lowerBoundImpact.DeltaLwLowerBound)} dB`
        };
      }
      break;
    case "L'nT,w":
      if (typeof result?.impact?.LPrimeNTw === "number") {
        return {
          detail: "Standardized field impact result with receiving-room normalization.",
          label: "L'nT,w",
          output,
          status: "live",
          value: `${formatDecimal(result.impact.LPrimeNTw)} dB`
        };
      }

      if (typeof result?.lowerBoundImpact?.LPrimeNTwUpperBound === "number") {
        return {
          detail: "Conservative standardized field impact upper bound.",
          label: "L'nT,w",
          output,
          status: "bound",
          value: `<= ${formatDecimal(result.lowerBoundImpact.LPrimeNTwUpperBound)} dB`
        };
      }
      break;
    case "L'nT,50":
      if (typeof result?.impact?.LPrimeNT50 === "number") {
        return {
          detail: "Standardized field impact value with the extended low-frequency companion.",
          label: "L'nT,50",
          output,
          status: "live",
          value: `${formatDecimal(result.impact.LPrimeNT50)} dB`
        };
      }

      if (typeof result?.lowerBoundImpact?.LPrimeNT50UpperBound === "number") {
        return {
          detail: "Conservative L'nT,50 upper bound.",
          label: "L'nT,50",
          output,
          status: "bound",
          value: `<= ${formatDecimal(result.lowerBoundImpact.LPrimeNT50UpperBound)} dB`
        };
      }
      break;
    case "LnT,A":
      if (typeof result?.impact?.LnTA === "number") {
        return {
          detail: "Exact Dutch NEN 5077 A-weighted impact companion.",
          label: "LnT,A",
          output,
          status: "live",
          value: `${formatDecimal(result.impact.LnTA)} dB`
        };
      }
      break;
    default:
      break;
  }

  return {
    detail: buildUnavailableOutputDetail({ output, result, studyMode }),
    label: REQUESTED_OUTPUT_LABELS[output],
    output,
    status: isRouteBlockedOutput({ output, result, studyMode }) ? "needs_input" : "unsupported",
    value: "Not ready"
  };
}

function addOutputCardPosture(
  card: BaseOutputCardModel,
  input: { result: AssemblyCalculation | null; studyMode: StudyMode }
): OutputCardModel {
  const posture = buildSimpleWorkbenchOutputPosture({
    output: card.output,
    result: input.result,
    status: card.status,
    studyMode: input.studyMode
  });

  return {
    ...card,
    postureDetail: posture.detail,
    postureLabel: posture.label,
    postureTone: posture.tone
  };
}

function statusLabel(status: OutputCardModel["status"] | "ignored" | "used"): string {
  switch (status) {
    case "live":
      return "Live";
    case "bound":
      return "Bound";
    case "used":
      return "Used now";
    case "ignored":
      return "Ignored now";
    case "needs_input":
      return "Needs input";
    case "unsupported":
    default:
      return "Unsupported";
  }
}

function outputStatusClass(status: OutputCardModel["status"]): string {
  switch (status) {
    case "live":
      return "border-[color:color-mix(in_oklch,var(--success)_42%,var(--line))] bg-[color:color-mix(in_oklch,var(--success)_10%,var(--paper))]";
    case "bound":
      return "border-[color:color-mix(in_oklch,var(--ink)_16%,var(--line))] bg-[color:var(--paper)]/88";
    case "needs_input":
      return "border-[color:color-mix(in_oklch,var(--warning)_34%,var(--line))] bg-[color:var(--warning-soft)]";
    case "unsupported":
    default:
      return "border-[color:color-mix(in_oklch,var(--warning)_24%,var(--line))] bg-[color:var(--paper)]/80";
  }
}

function outputStatusTextClass(status: OutputCardModel["status"]): string {
  switch (status) {
    case "live":
      return "text-[color:var(--success-ink)]";
    case "bound":
      return "text-[color:var(--ink-soft)]";
    case "needs_input":
    case "unsupported":
    default:
      return "text-[color:var(--warning-ink)]";
  }
}

function outputPostureTextClass(tone: OutputCardModel["postureTone"]): string {
  switch (tone) {
    case "success":
      return "text-[color:var(--success-ink)]";
    case "warning":
      return "text-[color:var(--warning-ink)]";
    case "accent":
      return "text-[color:var(--accent-ink)]";
    case "neutral":
    default:
      return "text-[color:var(--ink)]";
  }
}

function outputPosturePanelClass(tone: OutputCardModel["postureTone"]): string {
  switch (tone) {
    case "success":
      return "border-[color:color-mix(in_oklch,var(--success)_34%,var(--line))] bg-[color:color-mix(in_oklch,var(--success)_8%,var(--paper))]";
    case "warning":
      return "border-[color:color-mix(in_oklch,var(--warning)_34%,var(--line))] bg-[color:color-mix(in_oklch,var(--warning)_10%,var(--paper))]";
    case "accent":
      return "border-[color:color-mix(in_oklch,var(--accent)_24%,var(--line))] bg-[color:color-mix(in_oklch,var(--accent)_8%,var(--paper))]";
    case "neutral":
    default:
      return "border-[color:var(--line)] bg-[color:var(--paper)]/72";
  }
}

function workbenchSectionPanelClass(_tone: WorkbenchSectionTone): string {
  return "border-[color:var(--line)] bg-[color:var(--paper)]";
}

function workbenchSectionCardClass(_tone: WorkbenchSectionTone): string {
  return "border-[color:var(--line)] bg-[color:var(--panel)]";
}

function workbenchSectionMutedCardClass(_tone: WorkbenchSectionTone): string {
  return "border-[color:var(--line)] bg-[color:var(--paper-strong)]";
}

function workbenchSectionAccentRailClass(_tone: WorkbenchSectionTone): string {
  return "bg-[color:var(--accent)]";
}

function workbenchSectionTitleClass(_tone: WorkbenchSectionTone): string {
  return "text-[color:var(--ink)]";
}

function workbenchSectionEyebrowClass(_tone: WorkbenchSectionTone): string {
  return "text-[color:var(--ink-faint)]";
}

function SectionLead(props: { description?: string; step?: string; title: string; tone?: WorkbenchSectionTone }) {
  const { description, step, title } = props;

  return (
    <div className="min-w-0">
      {step ? (
        <div className="text-[0.68rem] font-medium uppercase tracking-[0.1em] text-[color:var(--ink-faint)]">{step}</div>
      ) : null}
      <h2 className="text-sm font-semibold text-[color:var(--ink)]">{title}</h2>
      {description ? <p className="mt-0.5 max-w-2xl text-[0.8rem] leading-5 text-[color:var(--ink-soft)]">{description}</p> : null}
    </div>
  );
}

function WorkspacePanelButton(props: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  const { active, label, onClick } = props;

  return (
    <button
      aria-pressed={active}
      className={`focus-ring inline-flex items-center justify-center border-b-2 px-3 py-2 text-sm font-medium transition-colors ${
        active
          ? "border-[color:var(--accent)] text-[color:var(--ink)]"
          : "border-transparent text-[color:var(--ink-faint)] hover:text-[color:var(--ink-soft)]"
      }`}
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  );
}

function GuidedRouteRow(props: { detail: string; label: string; value: string; tone?: WorkbenchSectionTone }) {
  const { detail, label, value } = props;

  return (
    <div className="flex min-w-0 items-baseline justify-between gap-3 rounded border border-[color:var(--line)] bg-[color:var(--paper)] px-3 py-2">
      <div className="min-w-0">
        <div className="text-[0.64rem] font-medium uppercase tracking-[0.1em] text-[color:var(--ink-faint)]">{label}</div>
        <p className="mt-0.5 line-clamp-1 text-[0.72rem] leading-5 text-[color:var(--ink-soft)]">{detail}</p>
      </div>
      <div className="shrink-0 text-right text-[0.84rem] font-semibold leading-5 text-[color:var(--ink)]">{value}</div>
    </div>
  );
}

function GuidedDecisionBasisCard(props: SimpleWorkbenchCorridorDossierCard) {
  const { detail, label, tone, value } = props;
  const valueClass =
    tone === "success"
      ? "text-[color:var(--success-ink)]"
      : tone === "warning"
        ? "text-[color:var(--warning-ink)]"
        : "text-[color:var(--ink)]";
  const toneLabel =
    tone === "success" ? "Locked" : tone === "warning" ? "Caution" : tone === "accent" ? "Live" : "Explicit";

  return (
    <article className="grid gap-1.5 rounded border border-[color:var(--line)] bg-[color:var(--paper)] px-3 py-2.5">
      <div className="flex items-center justify-between gap-3">
        <div className="text-[0.68rem] font-medium uppercase tracking-[0.1em] text-[color:var(--ink-faint)]">{label}</div>
        <DetailTag tone={tone === "warning" ? "required" : tone === "accent" ? "optional" : "neutral"}>{toneLabel}</DetailTag>
      </div>
      <div className={`text-sm font-semibold ${valueClass}`}>{value}</div>
      <p className="text-[0.8rem] leading-5 text-[color:var(--ink-soft)]">{detail}</p>
    </article>
  );
}

function GuidedDecisionBasisStrip(props: {
  activeReviewTab: ReviewTabId;
  cards: readonly SimpleWorkbenchCorridorDossierCard[];
  headline: string;
  onOpenReviewTab: (tabId: ReviewTabId) => void;
  selectedTraceNoteCount: number;
  traceGroupCount: number;
}) {
  const { activeReviewTab, cards, headline, onOpenReviewTab, selectedTraceNoteCount, traceGroupCount } = props;
  const activeReviewTabLabel = REVIEW_TABS.find((tab) => tab.id === activeReviewTab)?.label ?? "Proposal";

  return (
    <section className={`mt-4 overflow-hidden rounded-lg border px-4 py-4 ${workbenchSectionCardClass("review")}`}>
      <div className="grid gap-3 xl:grid-cols-[minmax(0,1.06fr)_auto] xl:items-start">
        <div className="min-w-0">
          <div className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[color:var(--ink-faint)]">Decision basis</div>
          <h3 className="mt-1.5 text-[1.02rem] font-semibold leading-tight text-[color:var(--ink)]">
            Validation corridor at a glance
          </h3>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[color:var(--ink-soft)]">{headline}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <GuidedFactChip>{`${traceGroupCount} trace group${traceGroupCount === 1 ? "" : "s"}`}</GuidedFactChip>
            <GuidedFactChip>{`${selectedTraceNoteCount} selected route note${selectedTraceNoteCount === 1 ? "" : "s"}`}</GuidedFactChip>
            <GuidedFactChip>{`Review deck: ${activeReviewTabLabel}`}</GuidedFactChip>
          </div>
        </div>

        <div className="grid gap-2 sm:grid-cols-3 xl:grid-cols-1 xl:justify-items-end">
          {REVIEW_TABS.map((tab) => (
            <button
              aria-pressed={activeReviewTab === tab.id}
              className={`focus-ring inline-flex items-center justify-center rounded border px-3 py-2 text-sm font-semibold ${
                activeReviewTab === tab.id
                  ? "border-[color:var(--accent)] bg-[color:var(--accent-soft)] text-[color:var(--accent-ink)]"
                  : "hairline bg-[color:var(--paper)]/82 text-[color:var(--ink-soft)] hover:bg-[color:var(--panel)]"
              }`}
              key={`review-jump-${tab.id}`}
              onClick={() => onOpenReviewTab(tab.id)}
              type="button"
            >
              {`Open ${tab.label.toLowerCase()}`}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-3 grid gap-2 md:grid-cols-2">
        {cards.map((card) => (
          <GuidedDecisionBasisCard {...card} key={`decision-basis-${card.label}-${card.value}`} />
        ))}
      </div>
    </section>
  );
}

function GuidedConstructionSnapshot(props: {
  activeReviewTab: ReviewTabId;
  layers: readonly {
    categoryLabel: string;
    index: number;
    label: string;
    roleLabel?: string;
    thicknessLabel: string;
  }[];
  onOpenReviewTab: (tabId: ReviewTabId) => void;
  studyModeLabel: string;
}) {
  const { activeReviewTab, layers, onOpenReviewTab, studyModeLabel } = props;
  const activeReviewTabLabel = REVIEW_TABS.find((tab) => tab.id === activeReviewTab)?.label ?? "Proposal";

  return (
    <section className={`mt-4 overflow-hidden rounded-lg border px-4 py-4 ${workbenchSectionCardClass("assembly")}`}>
      <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-start">
        <div className="min-w-0">
          <div className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[color:var(--ink-faint)]">
            Construction snapshot
          </div>
          <h3 className="mt-1.5 text-[1.02rem] font-semibold leading-tight text-[color:var(--ink)]">
            Solver-order section on the live result
          </h3>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[color:var(--ink-soft)]">
            One technical section stays aligned across the live read, method notes, and proposal output.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <GuidedFactChip>{`${layers.length} visible row${layers.length === 1 ? "" : "s"}`}</GuidedFactChip>
            <GuidedFactChip>{`Review deck: ${activeReviewTabLabel}`}</GuidedFactChip>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 xl:justify-end">
          <button
            className="focus-ring inline-flex items-center justify-center rounded border hairline bg-[color:var(--paper)]/84 px-3 py-2 text-sm font-semibold text-[color:var(--ink-soft)] hover:bg-[color:var(--panel)]"
            onClick={() => onOpenReviewTab("method")}
            type="button"
          >
            Open method detail
          </button>
          <button
            className="focus-ring inline-flex items-center justify-center rounded border hairline bg-[color:var(--paper)]/84 px-3 py-2 text-sm font-semibold text-[color:var(--ink-soft)] hover:bg-[color:var(--panel)]"
            onClick={() => onOpenReviewTab("proposal")}
            type="button"
          >
            Open proposal
          </button>
        </div>
      </div>

      <div className="mt-4">
        <SimpleWorkbenchProposalConstructionFigure layers={layers} studyModeLabel={studyModeLabel} />
      </div>
    </section>
  );
}

function GuidedSelectField(props: {
  children: ReactNode;
  label: string;
  note: string;
}) {
  const { children, label, note } = props;

  return (
    <label className="grid min-w-0 gap-2">
      <div className="min-w-0">
        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--ink-faint)]">{label}</span>
        <p className="mt-1 text-[0.78rem] leading-5 text-[color:var(--ink-soft)]">{note}</p>
      </div>
      {children}
    </label>
  );
}

function GuidedFactChip(props: { children: ReactNode; tone?: "neutral" | "warning" }) {
  const { children, tone = "neutral" } = props;
  const toneClass =
    tone === "warning"
      ? "border-[color:var(--warning)] bg-[color:var(--warning-soft)] text-[color:var(--warning-ink)]"
      : "border-[color:var(--line)] bg-[color:var(--paper)] text-[color:var(--ink-soft)]";

  return (
    <span className={`inline-flex items-center rounded border px-2 py-0.5 text-[0.7rem] font-medium ${toneClass}`}>
      {children}
    </span>
  );
}

function DetailTag(props: { children: ReactNode; tone?: "neutral" | FieldRelevanceTone }) {
  const { children, tone = "neutral" } = props;
  const toneClass =
    tone === "required"
      ? "border border-[color:var(--warning)] bg-[color:var(--warning-soft)] text-[color:var(--warning-ink)]"
      : tone === "optional"
        ? "border border-[color:var(--accent)] bg-[color:var(--accent-soft)] text-[color:var(--accent-ink)]"
        : "border border-[color:var(--line)] bg-[color:var(--paper)] text-[color:var(--ink-soft)]";

  return (
    <span className={`inline-flex items-center rounded px-2 py-0.5 text-[0.68rem] font-medium uppercase tracking-[0.1em] ${toneClass}`}>
      {children}
    </span>
  );
}

function InlinePair(props: { label: string; value: string }) {
  const { label, value } = props;

  return (
    <div className="grid min-w-0 gap-1 overflow-hidden rounded-md border hairline bg-[color:var(--paper)]/72 px-3 py-2.5">
      <div className="break-words text-[0.68rem] font-semibold uppercase leading-4 tracking-[0.16em] text-[color:var(--ink-faint)]">
        {label}
      </div>
      <div className="min-w-0 break-words text-[0.98rem] font-semibold leading-6 text-[color:var(--ink)]">{value}</div>
    </div>
  );
}

function formatMaterialDensity(material: MaterialDefinition): string | null {
  return formatDensityValue(getCatalogDensity(material));
}

function formatDensityLabel(material: MaterialDefinition, overrideValue: string | undefined): string {
  const effectiveDensity = getEffectiveDensity({
    material,
    overrideValue
  });

  if (typeof effectiveDensity !== "number") {
    return hasDensityOverrideInput(overrideValue) ? "Invalid override" : "Not listed";
  }

  return `${formatDensityValue(effectiveDensity)}${hasEffectiveDensityOverride({ material, overrideValue }) ? " (manual)" : ""}`;
}

function compactValues(values: Array<string | null | undefined>): string[] {
  return values.filter((value): value is string => Boolean(value && value.trim().length > 0));
}

function getCustomMaterialNotePreview(notes: string | undefined): string | null {
  const cleaned = notes?.replace(/Local custom workbench material\./gu, "").replace(/\s+/gu, " ").trim();
  return cleaned && cleaned.length > 0 ? cleaned : null;
}

function getCustomMaterialCategoryLabel(category: MaterialCategory): string {
  return CUSTOM_MATERIAL_CATEGORY_OPTIONS.find((option) => option.value === category)?.label ?? category;
}

function getTextInputClassName(hasWarning = false): string {
  return `focus-ring touch-target w-full min-w-0 rounded border px-3 py-2.5 ${
    hasWarning
      ? "border-[color:var(--warning-ink)]/34 bg-[color:var(--warning-soft)]/48"
      : "hairline bg-[color:var(--paper)]"
  }`;
}

function buildMaterialFacts(input: {
  densityOverride?: string;
  dynamicStiffnessOverride?: string;
  material: MaterialDefinition;
  thicknessMm: string;
}): string[] {
  const facts: string[] = [];
  const density = getEffectiveDensity({
    material: input.material,
    overrideValue: input.densityOverride
  });
  const densityLabel = formatDensityValue(density);
  const thickness = parsePositiveNumber(input.thicknessMm);
  const dynamicStiffness = getEffectiveDynamicStiffness({
    material: input.material,
    overrideValue: input.dynamicStiffnessOverride
  });

  if (densityLabel) {
    facts.push(`${densityLabel}${hasEffectiveDensityOverride({ material: input.material, overrideValue: input.densityOverride }) ? " (manual)" : ""}`);
  }

  if (typeof density === "number" && thickness && thickness > 0) {
    facts.push(`${formatDecimal((density * thickness) / 1000)} kg/m² at this layer`);
  }

  if (typeof dynamicStiffness === "number") {
    facts.push(
      `${formatDecimal(dynamicStiffness)} MN/m³ dynamic stiffness${
        hasEffectiveDynamicStiffnessOverride({ material: input.material, overrideValue: input.dynamicStiffnessOverride }) ? " (manual)" : ""
      }`
    );
  }

  return facts;
}

function buildDefaultNewLayerDraft(studyMode: StudyMode): NewLayerDraft {
  const defaults = DEFAULT_NEW_LAYER_BY_MODE[studyMode];

  return {
    densityKgM3: "",
    dynamicStiffnessMNm3: "",
    floorRole: inferFloorRole(defaults.materialId, studyMode),
    materialId: defaults.materialId,
    thicknessMm: defaults.thicknessMm
  };
}

function FieldShell(props: {
  advisory?: string | null;
  children: ReactNode;
  label: string;
  note: string;
  relevance?: FieldRelevanceTone;
  usage: string;
  warning?: string | null;
}) {
  const { children, label, warning } = props;

  return (
    <div className="grid min-w-0 gap-1.5 rounded border border-[color:var(--line)] bg-[color:var(--paper)] px-3 py-2.5">
      <span className="text-[0.82rem] font-semibold text-[color:var(--ink)]">{label}</span>
      {warning ? <p className="text-[0.72rem] leading-5 text-[color:var(--warning-ink)]">{warning}</p> : null}
      {children}
    </div>
  );
}

function ContextBucket(props: {
  children?: ReactNode;
  description: string;
  hasContent: boolean;
  title: string;
  tone: FieldRelevanceTone;
}) {
  const { children, description, hasContent, title, tone } = props;
  const shellClass =
    tone === "required"
      ? "border-[color:color-mix(in_oklch,var(--warning)_24%,var(--line))] bg-[color:color-mix(in_oklch,var(--warning)_6%,var(--paper))]"
      : workbenchSectionMutedCardClass("route");

  return (
    <section className={`rounded border px-3 py-3 ${shellClass}`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-[0.84rem] font-semibold text-[color:var(--ink)]">{title}</div>
        <DetailTag tone={tone}>{title}</DetailTag>
      </div>

      {hasContent ? (
        <div className="mt-3 grid gap-3">{children}</div>
      ) : null}
    </section>
  );
}

function ContextSubsection(props: {
  children: ReactNode;
  note: string;
  title: string;
}) {
  const { children, note, title } = props;

  return (
    <div className={`grid gap-3 rounded border px-3 py-3 ${workbenchSectionMutedCardClass("route")}`}>
      <div className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[color:var(--ink-faint)]">{title}</div>
      <div className="grid gap-3">{children}</div>
    </div>
  );
}

function OutputCard(props: { card: OutputCardModel }) {
  const { card } = props;

  return (
    <article
      className={`min-w-0 rounded-md border px-4 py-4 ${outputStatusClass(card.status)}`}
      title={card.detail}
    >
      <div className="flex min-w-0 flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">{card.label}</div>
          <div className="mt-2 text-[1.65rem] font-semibold leading-none tracking-[-0.04em] text-[color:var(--ink)]">{card.value}</div>
        </div>
        <span className={`text-[0.7rem] font-semibold uppercase tracking-[0.16em] ${outputStatusTextClass(card.status)}`}>
          {statusLabel(card.status)}
        </span>
      </div>
      <div className="mt-2 text-[0.72rem] font-medium text-[color:var(--ink-soft)]">{card.postureLabel}</div>
    </article>
  );
}

function OutputCoverageSummary(props: {
  boundCount: number;
  liveCount: number;
  parkedCount: number;
  readyCount: number;
  totalCount: number;
  unsupportedCount: number;
}) {
  const { boundCount, liveCount, parkedCount, readyCount, totalCount, unsupportedCount } = props;

  return (
    <section className={`rounded border px-3 py-3 ${workbenchSectionCardClass("results")}`}>
      <div className="flex min-w-0 flex-wrap items-center justify-between gap-3">
        <div className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">Coverage</div>
        <div className="flex flex-wrap gap-2">
          <GuidedFactChip>{`${readyCount}/${totalCount} ready`}</GuidedFactChip>
          <GuidedFactChip>{boundCount > 0 ? `${liveCount} live + ${boundCount} bound` : `${liveCount} live`}</GuidedFactChip>
          <GuidedFactChip tone={parkedCount > 0 ? "warning" : "neutral"}>{`${parkedCount} parked`}</GuidedFactChip>
          <GuidedFactChip tone={unsupportedCount > 0 ? "warning" : "neutral"}>{`${unsupportedCount} unsupported`}</GuidedFactChip>
        </div>
      </div>
    </section>
  );
}

function OutputUnlockRail(props: {
  groups: readonly {
    detail: string;
    outputs: readonly RequestedOutputId[];
    title: string;
  }[];
}) {
  const { groups } = props;

  if (!groups.length) {
    return null;
  }

  return (
    <details className="rounded-md border hairline bg-[color:var(--paper)]/72 px-4 py-3">
      <summary className="cursor-pointer list-none">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-sm font-semibold text-[color:var(--ink)]">Unlock parked outputs</div>
          <div className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[color:var(--ink-faint)]">
            {formatCountLabel(groups.length, "next step")}
          </div>
        </div>
      </summary>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {groups.map((group) => (
          <article
            className="rounded-md border hairline bg-[color:color-mix(in_oklch,var(--warning)_8%,var(--paper))] px-4 py-3"
            key={`unlock-${group.title}`}
          >
            <div className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--warning-ink)]">Next unlock</div>
            <div className="mt-2 text-sm font-semibold text-[color:var(--ink)]">{group.title}</div>
            <div className="mt-2 flex flex-wrap gap-2">
              <GuidedFactChip tone="warning">{formatUnlockOutputs(group.outputs)}</GuidedFactChip>
            </div>
            <p className="mt-2 text-[0.78rem] leading-5 text-[color:var(--ink-soft)]">{group.detail}</p>
          </article>
        ))}
      </div>
    </details>
  );
}

function pickPrimaryOutputCard(cards: readonly OutputCardModel[], studyMode: StudyMode): OutputCardModel | null {
  if (!cards.length) {
    return null;
  }

  const priority =
    studyMode === "floor"
      ? ["Ln,w", "L'n,w", "L'nT,w", "L'nT,50", "DeltaLw", "Rw", "R'w", "DnT,w", "Dn,w"]
      : ["Rw", "R'w", "DnT,w", "Dn,w", "STC", "Ctr", "C"];

  for (const label of priority) {
    const match = cards.find((card) => card.label === label);
    if (match) {
      return match;
    }
  }

  return cards[0] ?? null;
}

function PrimaryResultCard(props: {
  card: OutputCardModel;
  collapsedLiveRowCount: number;
  contextLabel: string;
  heroHeadline: string;
  liveRowCount: number;
  parkedRowCount: number;
  solverLayerCount: number;
  studyMode: StudyMode;
  validationSummary: GuidedValidationSummary;
}) {
  const { card, collapsedLiveRowCount, contextLabel, heroHeadline, liveRowCount, parkedRowCount, solverLayerCount, studyMode, validationSummary } = props;
  const liveStackValue = `${formatCountLabel(liveRowCount, "live row")} used`;
  const liveStackDetail =
    parkedRowCount > 0
      ? `${formatCountLabel(liveRowCount, "live row")} currently resolve to ${formatCountLabel(solverLayerCount, "solver layer")}. ${formatCountLabel(parkedRowCount, "parked row")} ${parkedRowCount === 1 ? "stays" : "stay"} visible in the draft stack but ${parkedRowCount === 1 ? "does" : "do"} not affect this read.`
      : collapsedLiveRowCount > 0
        ? `${formatCountLabel(liveRowCount, "live row")} collapse to ${formatCountLabel(solverLayerCount, "solver layer")} before this read is calculated.`
        : "Every visible row currently contributes to this read.";
  const validationValueClass =
    validationSummary.tone === "ready"
      ? "text-[color:var(--success-ink)]"
      : validationSummary.tone === "warning"
        ? "text-[color:var(--warning-ink)]"
        : "text-[color:var(--ink)]";
  const postureValueClass = outputPostureTextClass(card.postureTone);

  return (
    <article className={`result-hero min-w-0 overflow-hidden rounded border px-4 py-4 ${outputStatusClass(card.status)}`}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-[color:var(--ink-faint)]">
            {studyMode === "floor" ? "Primary floor read" : "Primary wall read"}
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            <GuidedFactChip>{card.label}</GuidedFactChip>
            <GuidedFactChip>{heroHeadline}</GuidedFactChip>
          </div>
        </div>
        <DetailTag>{contextLabel}</DetailTag>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[auto_minmax(0,1fr)] lg:items-start">
        <div className={`min-w-0 rounded border px-4 py-4 text-right ${workbenchSectionCardClass("results")}`}>
          <div className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">{card.label}</div>
          <div className="mt-2 text-[clamp(2.4rem,4vw,3.2rem)] font-semibold leading-[0.92] tracking-[-0.05em] text-[color:var(--ink)]">
            {card.value}
          </div>
          <div className={`mt-1 text-[0.72rem] font-semibold uppercase tracking-[0.14em] ${outputStatusTextClass(card.status)}`}>
            {statusLabel(card.status)}
          </div>
        </div>

        <div className="min-w-0 grid gap-2">
          <div className="flex flex-wrap gap-2">
            <GuidedFactChip>{card.postureLabel}</GuidedFactChip>
            <GuidedFactChip>{validationSummary.value}</GuidedFactChip>
            <GuidedFactChip>{liveStackValue}</GuidedFactChip>
          </div>
        </div>
      </div>
    </article>
  );
}

function PendingOutputRow(props: { card: OutputCardModel }) {
  const { card } = props;
  const postureTextClass = outputPostureTextClass(card.postureTone);

  return (
    <article className="rounded border border-[color:var(--line)] bg-[color:var(--paper)] px-3 py-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm font-semibold text-[color:var(--ink)]">{card.label}</div>
        <span className={`text-[0.72rem] font-semibold uppercase tracking-[0.16em] ${outputStatusTextClass(card.status)}`}>
          {statusLabel(card.status)}
        </span>
      </div>
      <div className={`mt-1 text-[0.72rem] font-medium ${postureTextClass}`}>{card.postureLabel}</div>
    </article>
  );
}

function PendingOutputGroup(props: {
  cards: readonly OutputCardModel[];
  countLabel: string;
  detail: string;
  title: string;
}) {
  const { cards, countLabel, detail, title } = props;

  if (!cards.length) {
    return null;
  }

  return (
    <div className="mt-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm font-semibold text-[color:var(--ink)]">{title}</div>
        <div className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[color:var(--ink-faint)]">{countLabel}</div>
      </div>
      <div className="mt-3 grid gap-3">
        {cards.map((card) => (
          <PendingOutputRow card={card} key={`pending-${title}-${card.label}`} />
        ))}
      </div>
    </div>
  );
}

function LayerLegendRow(props: {
  active: boolean;
  index: number;
  material: MaterialDefinition;
  ready: boolean;
  row: LayerDraft;
  studyMode: StudyMode;
}) {
  const { active, index, material, ready, row, studyMode } = props;
  const facts = buildMaterialFacts({
    densityOverride: row.densityKgM3,
    dynamicStiffnessOverride: row.dynamicStiffnessMNm3,
    material,
    thicknessMm: row.thicknessMm
  });

  return (
    <article
      className={`rounded border px-3 py-2 ${
        active
          ? "border-[color:var(--ink)] bg-[color:color-mix(in_oklch,var(--ink)_4%,var(--paper))]"
          : ready
            ? "border-[color:var(--line)] bg-[color:var(--paper)]"
            : "border-[color:var(--warning)] bg-[color:color-mix(in_oklch,var(--warning)_8%,var(--paper))]"
      }`}
      data-active={active ? "true" : "false"}
      data-ready={ready ? "true" : "false"}
      data-testid={`legend-row-${index + 1}`}
    >
      <div className="flex items-center gap-2.5">
        <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[0.68rem] font-semibold ${layerFillClass(material)} ${layerStrokeClass(material)}`}>
          {index + 1}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <div className="truncate text-[0.82rem] font-semibold text-[color:var(--ink)]">{material.name}</div>
            <DetailTag>{row.thicknessMm || "?"} mm</DetailTag>
            {studyMode === "floor" && row.floorRole ? <DetailTag>{FLOOR_ROLE_LABELS[row.floorRole]}</DetailTag> : null}
          </div>
          <div className="mt-0.5 text-[0.68rem] leading-5 text-[color:var(--ink-soft)]">
            {compactValues([getMaterialCategoryLabel(material), facts[0], ready ? "Live row" : "Parked"]).join(" · ")}
          </div>
        </div>
      </div>
    </article>
  );
}

function FloorStackFigure(props: {
  activeRowId: string | null;
  rows: readonly {
    material: MaterialDefinition;
    row: LayerDraft;
  }[];
}) {
  const { activeRowId, rows } = props;
  const totalThickness = rows.reduce((sum, entry) => sum + (parsePositiveNumber(entry.row.thicknessMm) ?? 0), 0);
  const depthPx = 32;

  return (
    <div className="section-figure rounded-md border border-[color:var(--line)] bg-[color:var(--panel-strong)] px-3 py-3">
      <div className="flex items-center justify-between text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-[color:var(--ink-faint)]">
        <span>Walking side</span>
        <span>{rows.length} layers</span>
      </div>

      <div className="mt-3 rounded border border-[color:var(--line)] bg-[color:var(--paper)] px-4 pb-4 pt-6">
        <div className="mx-auto max-w-[32rem]" style={{ paddingRight: `${depthPx}px` }}>
          {rows.map(({ material, row }, index) => {
            const thickness = parsePositiveNumber(row.thicknessMm) ?? 10;
            const active = row.id === activeRowId;
            const ready = isThicknessReady(row.thicknessMm);
            const surface = getLayerVisualSurface(material);
            const heightPx = Math.max(28, Math.min(72, thickness * 0.7));
            const isFirst = index === 0;
            return (
              <div
                className="relative"
                data-active={active ? "true" : "false"}
                data-ready={ready ? "true" : "false"}
                data-testid={`preview-row-${index + 1}`}
                key={row.id}
                style={{ height: `${heightPx}px`, marginTop: index === 0 ? 0 : -1 }}
                title={`${material.name} · ${row.thicknessMm || "?"} mm`}
              >
                {/* Top face — only on first layer */}
                {isFirst ? (
                  <div
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-full origin-bottom"
                    style={{
                      ...surface.topStyle,
                      height: `${depthPx}px`,
                      transform: "skewX(-40deg)",
                      transformOrigin: "bottom left",
                      borderTopLeftRadius: "0.25rem",
                      borderTopRightRadius: "0.25rem",
                      borderTop: "1px solid var(--line-strong)",
                      borderRight: "1px solid var(--line)",
                      marginLeft: `${depthPx * 0.84}px`
                    }}
                  />
                ) : null}
                {/* Right face */}
                <div
                  aria-hidden="true"
                  className="absolute inset-y-0 left-full"
                  style={{
                    ...surface.sideStyle,
                    width: `${depthPx}px`,
                    transform: "skewY(-50deg)",
                    transformOrigin: "top left",
                    borderRight: "1px solid var(--line-strong)"
                  }}
                />
                {/* Front face */}
                <div
                  className={`relative flex h-full items-center justify-between overflow-hidden border-x border-b px-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.12),inset_0_-1px_0_rgba(0,0,0,0.06)] ${
                    isFirst ? "rounded-tl-sm border-t" : ""
                  } ${index === rows.length - 1 ? "rounded-bl-sm" : ""} ${
                    active
                      ? "border-[color:color-mix(in_oklch,var(--accent)_40%,var(--line-strong))] shadow-[inset_0_0_0_1px_color-mix(in_oklch,var(--accent)_18%,transparent)]"
                      : ready
                        ? "border-[color:color-mix(in_oklch,var(--line-strong)_60%,transparent)]"
                        : "border-[color:color-mix(in_oklch,var(--warning)_30%,var(--line))] opacity-75"
                  }`}
                  style={surface.frontStyle}
                >
                  <span className="inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded bg-[color:var(--paper)] px-1 text-[0.6rem] font-bold tabular-nums text-[color:var(--ink)] shadow-[0_1px_2px_rgba(0,0,0,0.06)]">
                    {index + 1}
                  </span>
                  <span className="rounded bg-[color:var(--paper-strong)] px-1.5 py-0.5 text-[0.58rem] font-semibold tabular-nums text-[color:var(--ink-soft)] shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                    {ready ? `${row.thicknessMm} mm` : "Parked"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-[color:var(--ink-faint)]">
        <span>Ceiling side</span>
        <span>{formatDecimal(totalThickness)} mm total</span>
      </div>
    </div>
  );
}

function WallStackFigure(props: {
  activeRowId: string | null;
  rows: readonly {
    material: MaterialDefinition;
    row: LayerDraft;
  }[];
}) {
  const { activeRowId, rows } = props;
  const totalThickness = rows.reduce((sum, entry) => sum + (parsePositiveNumber(entry.row.thicknessMm) ?? 0), 0);
  const depthPx = 24;
  const wallHeight = 150;

  return (
    <div className="section-figure rounded-md border border-[color:var(--line)] bg-[color:var(--panel-strong)] px-3 py-3">
      <div className="flex items-center justify-between text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-[color:var(--ink-faint)]">
        <span>Side A</span>
        <span>{rows.length} layers</span>
      </div>

      <div className="mt-3 overflow-x-auto rounded border border-[color:var(--line)] bg-[color:var(--paper)] px-4 pb-4 pt-2">
        <div className="mx-auto flex w-fit items-end" style={{ paddingTop: `${depthPx + 4}px` }}>
          {rows.map(({ material, row }, index) => {
            const thickness = parsePositiveNumber(row.thicknessMm) ?? 10;
            const active = row.id === activeRowId;
            const ready = isThicknessReady(row.thicknessMm);
            const surface = getLayerVisualSurface(material);
            const widthPx = Math.max(38, Math.min(110, thickness * 0.6));
            const isFirst = index === 0;
            return (
              <div
                className="relative flex-shrink-0"
                data-active={active ? "true" : "false"}
                data-ready={ready ? "true" : "false"}
                data-testid={`preview-row-${index + 1}`}
                key={row.id}
                style={{ height: `${wallHeight}px`, width: `${widthPx}px`, marginLeft: index === 0 ? 0 : -1 }}
                title={`${material.name} · ${row.thicknessMm || "?"} mm`}
              >
                {/* Top face */}
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-full"
                  style={{
                    ...surface.topStyle,
                    height: `${depthPx}px`,
                    transform: "skewX(40deg)",
                    transformOrigin: "bottom left",
                    borderTop: "1px solid var(--line-strong)",
                    ...(isFirst ? { borderLeft: "1px solid var(--line)", borderTopLeftRadius: "0.2rem" } : {})
                  }}
                />
                {/* Front face */}
                <div
                  className={`relative flex h-full flex-col items-center justify-between overflow-hidden border-y px-1.5 py-2.5 shadow-[inset_1px_0_0_rgba(255,255,255,0.12),inset_-1px_0_0_rgba(0,0,0,0.06)] ${
                    isFirst ? "rounded-bl-sm border-l" : ""
                  } ${index === rows.length - 1 ? "rounded-br-sm border-r" : "border-r"} ${
                    active
                      ? "border-[color:color-mix(in_oklch,var(--accent)_40%,var(--line-strong))] shadow-[inset_0_0_0_1px_color-mix(in_oklch,var(--accent)_18%,transparent)]"
                      : ready
                        ? "border-[color:color-mix(in_oklch,var(--line-strong)_60%,transparent)]"
                        : "border-[color:color-mix(in_oklch,var(--warning)_30%,var(--line))] opacity-75"
                  }`}
                  style={surface.frontStyle}
                >
                  <span className="inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded bg-[color:var(--paper)] px-1 text-[0.6rem] font-bold tabular-nums text-[color:var(--ink)] shadow-[0_1px_2px_rgba(0,0,0,0.06)]">
                    {index + 1}
                  </span>
                  <span
                    className="rounded bg-[color:var(--paper-strong)] px-1 py-0.5 text-[0.54rem] font-semibold tabular-nums text-[color:var(--ink-soft)] shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
                    style={{ writingMode: widthPx < 44 ? "vertical-rl" : "horizontal-tb" }}
                  >
                    {ready ? `${row.thicknessMm} mm` : "?"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-[color:var(--ink-faint)]">
        <span>Side B</span>
        <span>{formatDecimal(totalThickness)} mm total</span>
      </div>
    </div>
  );
}

function LayerStackDiagram(props: {
  activeRowId: string | null;
  materials: readonly MaterialDefinition[];
  result: AssemblyCalculation | null;
  rows: readonly LayerDraft[];
  studyMode: StudyMode;
}) {
  const { activeRowId, materials, result, rows, studyMode } = props;
  const totalThickness = sumThickness(rows);
  const { collapsedLiveRowCount, liveRowCount, parkedRowCount, solverLayerCount } = getRowActivityCounts(rows, materials);
  const resolved = rows.map((row) => ({
    material: materials.find((entry) => entry.id === row.materialId) ?? materials[0]!,
    row
  }));

  return (
    <section className={`min-w-0 overflow-hidden rounded border ${workbenchSectionCardClass("assembly")}`}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[color:var(--line)] px-4 py-3">
        <div className={`text-[0.68rem] font-semibold uppercase tracking-[0.14em] ${workbenchSectionEyebrowClass("assembly")}`}>
          {studyMode === "floor" ? "Floor section" : "Wall section"}
        </div>
        <div className="flex flex-wrap gap-3 text-[0.68rem] tabular-nums text-[color:var(--ink-faint)]">
          <span>{rows.length} rows</span>
          <span>{totalThickness > 0 ? `${formatDecimal(totalThickness)} mm` : "—"}</span>
          <span>{result ? `${formatDecimal(result.metrics.surfaceMassKgM2)} kg/m²` : "—"}</span>
        </div>
      </div>

      {rows.length ? (
        <div className="grid gap-3 p-3">
          <div>{studyMode === "floor" ? <FloorStackFigure activeRowId={activeRowId} rows={resolved} /> : <WallStackFigure activeRowId={activeRowId} rows={resolved} />}</div>
          <div className="grid gap-2">
            <div className="flex items-center justify-between gap-3">
              <div className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">
                Technical layer schedule
              </div>
              <div className="text-[0.72rem] font-semibold text-[color:var(--ink-soft)]">
                {`${solverLayerCount} solver layer${solverLayerCount === 1 ? "" : "s"}`}
              </div>
            </div>
            <div className="grid gap-2 xl:grid-cols-2">
              {resolved.map(({ material, row }, index) => (
                <LayerLegendRow
                  active={row.id === activeRowId}
                  index={index}
                  key={row.id}
                  material={material}
                  ready={isThicknessReady(row.thicknessMm)}
                  row={row}
                  studyMode={studyMode}
                />
              ))}
            </div>
          </div>
          {collapsedLiveRowCount > 0 ? (
            <div className="text-[0.72rem] text-[color:var(--ink-faint)]">
              {`${collapsedLiveRowCount} adjacent row${collapsedLiveRowCount === 1 ? "" : "s"} collapse before calculation.`}
            </div>
          ) : null}
        </div>
      ) : (
        <div className="px-4 py-4">
          <div className="rounded border border-dashed border-[color:var(--line)] bg-[color:var(--paper)] px-4 py-5 text-[0.82rem] leading-6 text-[color:var(--ink-soft)]">
            Add layers in physical order to generate the section preview and live stack metrics.
          </div>
        </div>
      )}
    </section>
  );
}

function SimpleLayerRow(props: {
  active: boolean;
  expanded: boolean;
  index: number;
  materials: readonly MaterialDefinition[];
  onDensityChange: (id: string, densityKgM3: string) => void;
  onDynamicStiffnessChange: (id: string, dynamicStiffnessMNm3: string) => void;
  materialGroups: readonly WorkbenchMaterialOptionGroup[];
  moveFlashDirection?: "down" | "up";
  onActiveRowChange: (rowId: string | null) => void;
  onExpandedChange: (rowId: string | null) => void;
  onFloorRoleChange: (id: string, floorRole?: FloorRole) => void;
  onMaterialChange: (id: string, materialId: string) => void;
  onMoveRow: (id: string, direction: "up" | "down") => void;
  onRemoveRow: (id: string) => void;
  onThicknessChange: (id: string, thicknessMm: string) => void;
  row: LayerDraft;
  studyMode: StudyMode;
  totalRows: number;
}) {
  const {
    active,
    expanded,
    index,
    materials: allMaterials,
    materialGroups,
    moveFlashDirection,
    onActiveRowChange,
    onExpandedChange,
    onDensityChange,
    onDynamicStiffnessChange,
    onFloorRoleChange,
    onMaterialChange,
    onMoveRow,
    onRemoveRow,
    onThicknessChange,
    row,
    studyMode,
    totalRows
  } = props;

  const materials = uniqueMaterialsById(materialGroups.flatMap((group) => group.materials));
  const material = materials.find((entry) => entry.id === row.materialId) ?? allMaterials[0]!;
  const edgeLabel = getStackEdgeLabel(studyMode, index, totalRows);
  const canMoveUp = index > 0;
  const canMoveDown = index < totalRows - 1;
  const thicknessReady = isThicknessReady(row.thicknessMm);
  const thicknessGuidanceHint = getLayerThicknessGuidanceHint(row, allMaterials);
  const thicknessSanityWarning = getLayerThicknessSanityWarning(row, index + 1, allMaterials);
  const densityWarning = getDensityInputWarning(material, row.densityKgM3);
  const dynamicStiffnessWarning = getDynamicStiffnessInputWarning(row.dynamicStiffnessMNm3);
  const categoryLabel = getMaterialCategoryLabel(material);
  const densityLabel = formatDensityLabel(material, row.densityKgM3);
  const surfaceMassLabel =
    buildMaterialFacts({
      densityOverride: row.densityKgM3,
      dynamicStiffnessOverride: row.dynamicStiffnessMNm3,
      material,
      thicknessMm: row.thicknessMm
    }).find((fact) => fact.includes("kg/m²")) ?? "Pending thickness";
  const dynamicStiffnessLabel = formatDynamicStiffnessLabel(material, row.dynamicStiffnessMNm3);
  const catalogDynamicStiffness = getCatalogDynamicStiffness(material);
  const catalogDensity = getCatalogDensity(material);
  const floorRoleNote =
    studyMode !== "floor"
      ? null
      : row.floorRole
        ? null
        : "Assign a floor role when this row should participate in exact floor matching.";
  const stateLabel = thicknessReady ? "Live row" : "Parked";
  const rowMeta = compactValues([edgeLabel, stateLabel, studyMode === "floor" && row.floorRole ? FLOOR_ROLE_LABELS[row.floorRole] : null]).join(" • ");

  return (
    <article
      className={`workbench-row min-w-0 rounded border px-3 py-3 ${
        active
          ? "border-[color:var(--line-strong)] bg-[color:var(--panel)]"
          : thicknessReady
            ? "border-[color:var(--line)] bg-[color:var(--paper)]"
            : "border-[color:var(--warning)] bg-[color:color-mix(in_oklch,var(--warning)_8%,var(--paper))]"
      }`}
      data-active={active ? "true" : "false"}
      data-move-flash={moveFlashDirection ?? "idle"}
      data-row-id={row.id}
      data-ready={thicknessReady ? "true" : "false"}
      data-testid={`editor-row-${index + 1}`}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          onActiveRowChange(null);
        }
      }}
      onFocusCapture={() => onActiveRowChange(row.id)}
      onMouseEnter={() => onActiveRowChange(row.id)}
      onMouseLeave={() => onActiveRowChange(null)}
    >
      <div className="flex min-w-0 flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[color:var(--line)] bg-[color:color-mix(in_oklch,var(--ink)_3%,var(--paper))] text-xs font-semibold text-[color:var(--ink)]">
            {index + 1}
          </div>
          <div className="min-w-0">
            <div className="truncate text-[0.9rem] font-semibold text-[color:var(--ink)]">{material.name}</div>
            <div className="mt-1 text-[0.72rem] leading-5 text-[color:var(--ink-soft)]">{rowMeta}</div>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <button
            aria-label={`Move layer ${index + 1} up`}
            className="focus-ring inline-flex h-7 w-7 items-center justify-center rounded border border-[color:var(--line)] text-[color:var(--ink-soft)] enabled:hover:bg-[color:var(--panel)] disabled:cursor-not-allowed disabled:opacity-35"
            disabled={!canMoveUp}
            onClick={() => onMoveRow(row.id, "up")}
            type="button"
          >
            <ArrowUp className="h-4 w-4" />
          </button>
          <button
            aria-label={`Move layer ${index + 1} down`}
            className="focus-ring inline-flex h-7 w-7 items-center justify-center rounded border border-[color:var(--line)] text-[color:var(--ink-soft)] enabled:hover:bg-[color:var(--panel)] disabled:cursor-not-allowed disabled:opacity-35"
            disabled={!canMoveDown}
            onClick={() => onMoveRow(row.id, "down")}
            type="button"
          >
            <ArrowDown className="h-4 w-4" />
          </button>
          <button
            className="focus-ring rounded px-2.5 py-1.5 text-sm font-medium text-[color:var(--ink-soft)] hover:bg-[color:var(--panel)]"
            onClick={() => onRemoveRow(row.id)}
            type="button"
          >
            Remove
          </button>
          <button
            aria-label={expanded ? "Hide details" : "Edit row"}
            aria-expanded={expanded}
            className="focus-ring inline-flex items-center justify-center rounded border border-[color:var(--line)] px-2.5 py-1.5 text-sm font-medium text-[color:var(--ink-soft)] hover:bg-[color:var(--panel)]"
            onClick={() => onExpandedChange(expanded ? null : row.id)}
            type="button"
          >
            {expanded ? "Close" : "Edit"}
          </button>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <GuidedFactChip>{thicknessReady ? `${row.thicknessMm} mm` : "Pending thickness"}</GuidedFactChip>
        <GuidedFactChip>{studyMode === "floor" ? (row.floorRole ? FLOOR_ROLE_LABELS[row.floorRole] : "Unassigned role") : stateLabel}</GuidedFactChip>
        <GuidedFactChip>{densityLabel}</GuidedFactChip>
        <GuidedFactChip>{surfaceMassLabel}</GuidedFactChip>
      </div>

      {expanded ? (
        <div className="mt-3 grid gap-3">
          <div className={`grid min-w-0 gap-3 ${studyMode === "floor" ? "md:grid-cols-2" : "md:grid-cols-3"}`}>
            <WorkbenchMaterialPicker
              currentMaterial={material}
              groups={materialGroups}
              label="Material"
              onSelect={(materialId) => onMaterialChange(row.id, materialId)}
            />

            <label className="grid min-w-0 gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--ink-faint)]">Thickness</span>
              <input
                aria-invalid={Boolean(thicknessSanityWarning)}
                className={getTextInputClassName(Boolean(thicknessSanityWarning))}
                inputMode="decimal"
                onChange={(event) => onThicknessChange(row.id, event.target.value)}
                placeholder="mm"
                value={row.thicknessMm}
              />
            </label>

            <label className="grid min-w-0 gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--ink-faint)]">Density</span>
              <input
                aria-invalid={Boolean(densityWarning)}
                aria-label={`Layer ${index + 1} density`}
                className={getTextInputClassName(Boolean(densityWarning))}
                inputMode="decimal"
                onChange={(event) => onDensityChange(row.id, event.target.value)}
                placeholder={typeof catalogDensity === "number" ? formatDecimal(catalogDensity) : "kg/m³"}
                value={row.densityKgM3 ?? ""}
              />
            </label>

            {studyMode === "floor" ? (
              <label className="grid min-w-0 gap-2">
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--ink-faint)]">Dynamic stiffness</span>
                <input
                  aria-invalid={Boolean(dynamicStiffnessWarning)}
                  aria-label={`Layer ${index + 1} dynamic stiffness`}
                  className={getTextInputClassName(Boolean(dynamicStiffnessWarning))}
                  inputMode="decimal"
                  onChange={(event) => onDynamicStiffnessChange(row.id, event.target.value)}
                  placeholder={typeof catalogDynamicStiffness === "number" ? formatDecimal(catalogDynamicStiffness) : "MN/m³"}
                  value={row.dynamicStiffnessMNm3 ?? ""}
                />
              </label>
            ) : null}

            {studyMode === "floor" ? (
              <label className="grid min-w-0 gap-2">
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--ink-faint)]">Floor role</span>
                <select
                  className="focus-ring touch-target w-full min-w-0 rounded border border-[color:var(--line)] bg-[color:var(--paper)] px-3 py-2.5"
                  onChange={(event) => onFloorRoleChange(row.id, event.target.value ? (event.target.value as FloorRole) : undefined)}
                  value={row.floorRole ?? ""}
                >
                  <option value="">Unassigned</option>
                  {Object.entries(FLOOR_ROLE_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
            ) : null}
          </div>

          <div className="flex flex-wrap gap-2">
            <GuidedFactChip>{categoryLabel}</GuidedFactChip>
            <GuidedFactChip>{dynamicStiffnessLabel}</GuidedFactChip>
            <GuidedFactChip>{getLayerPositionNarrative(studyMode, index, totalRows)}</GuidedFactChip>
          </div>

          {material.notes ? (
            <div className={`rounded border px-3 py-2.5 text-[0.74rem] leading-5 text-[color:var(--ink-soft)] ${workbenchSectionMutedCardClass("assembly")}`}>
              <span className="font-semibold text-[color:var(--ink)]">Material note:</span> {material.notes}
            </div>
          ) : null}

          {floorRoleNote || thicknessGuidanceHint || thicknessSanityWarning || densityWarning || dynamicStiffnessWarning ? (
            <div className="grid gap-1 text-[0.7rem] leading-5">
              {floorRoleNote ? <div className="text-[color:var(--ink-soft)]">{floorRoleNote}</div> : null}
              {thicknessGuidanceHint ? <div className="text-[color:var(--ink-soft)]">{thicknessGuidanceHint}</div> : null}
              {thicknessSanityWarning ? <div className="text-[color:var(--warning-ink)]">{thicknessSanityWarning}</div> : null}
              {densityWarning ? <div className="text-[color:var(--warning-ink)]">{densityWarning}</div> : null}
              {dynamicStiffnessWarning ? <div className="text-[color:var(--warning-ink)]">{dynamicStiffnessWarning}</div> : null}
            </div>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}

function CustomMaterialComposer(props: {
  customMaterials: readonly MaterialDefinition[];
  draft: CustomMaterialDraft;
  errors: CustomMaterialDraftErrors;
  expanded: boolean;
  onCreate: () => void;
  onDraftChange: <Field extends keyof CustomMaterialDraft>(field: Field, value: CustomMaterialDraft[Field]) => void;
  onExpandedChange: (expanded: boolean) => void;
}) {
  const { customMaterials, draft, errors, expanded, onCreate, onDraftChange, onExpandedChange } = props;
  const canCreate =
    draft.name.trim().length > 0 &&
    draft.densityKgM3.trim().length > 0 &&
    Object.values(errors).every((value) => !value);
  const draftName = draft.name.trim() || "New local material";
  const draftCategoryLabel = getCustomMaterialCategoryLabel(draft.category);
  const draftDensityLabel = draft.densityKgM3.trim().length > 0 ? `${draft.densityKgM3.trim()} kg/m³` : "Pending";
  const draftDynamicLabel =
    draft.dynamicStiffnessMNm3.trim().length > 0 ? `${draft.dynamicStiffnessMNm3.trim()} MN/m³` : "Not listed";
  const draftNotePreview = draft.notes.trim().length > 0 ? draft.notes.trim() : null;

  return (
    <section className={`rounded border px-3 py-3 ${workbenchSectionCardClass("assembly")}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[0.84rem] font-semibold text-[color:var(--ink)]">Custom material library</div>
          <div className="mt-1 text-[0.72rem] text-[color:var(--ink-faint)]">{`${customMaterials.length} saved`}</div>
        </div>
        <button
          aria-expanded={expanded}
          className={`focus-ring inline-flex items-center justify-center rounded border px-3 py-2 text-sm font-semibold ${
            expanded
              ? "border-[color:var(--line)] bg-[color:var(--panel)] text-[color:var(--ink)]"
              : "border-[color:var(--line)] bg-[color:var(--paper)] text-[color:var(--ink-soft)]"
          }`}
          onClick={() => onExpandedChange(!expanded)}
          type="button"
        >
          {expanded ? "Close custom material" : "Create custom material"}
        </button>
      </div>

      {customMaterials.length ? (
        <div className="mt-3 grid gap-2 xl:grid-cols-2">
          {customMaterials.map((material) => {
            const notePreview = getCustomMaterialNotePreview(material.notes);

            return (
              <article
                className={`grid gap-2 rounded border px-3 py-3 ${workbenchSectionMutedCardClass("assembly")}`}
                data-testid={`custom-material-card-${material.id}`}
                key={material.id}
              >
                <div className="flex min-w-0 items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-[color:var(--ink)]">{material.name}</div>
                    <div className="mt-1 flex flex-wrap gap-2">
                      <DetailTag>Local</DetailTag>
                      <DetailTag>{getMaterialCategoryLabel(material)}</DetailTag>
                    </div>
                  </div>
                  {typeof material.impact?.dynamicStiffnessMNm3 === "number" ? (
                    <GuidedFactChip>{`${formatDecimal(material.impact.dynamicStiffnessMNm3)} MN/m³`}</GuidedFactChip>
                  ) : null}
                </div>
                <div className="text-[0.72rem] text-[color:var(--ink-faint)]">{`${formatDecimal(material.densityKgM3)} kg/m³`}</div>
                {notePreview ? (
                  <p className="line-clamp-2 text-[0.74rem] leading-5 text-[color:var(--ink-soft)]">{notePreview}</p>
                ) : null}
              </article>
            );
          })}
        </div>
      ) : (
        <div className={`mt-3 rounded border px-3 py-3 text-[0.78rem] text-[color:var(--ink-soft)] ${workbenchSectionMutedCardClass("assembly")}`}>
          No local materials yet.
        </div>
      )}

      {expanded ? (
        <div className="mt-4 grid gap-3">
          <div
            className={`grid gap-2 rounded-md border px-3 py-3 ${workbenchSectionMutedCardClass("assembly")}`}
            data-testid="custom-material-preview"
          >
            <div className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">Preview</div>
            <div className="grid gap-2 sm:grid-cols-2">
              <InlinePair label="Name" value={draftName} />
              <InlinePair label="Category" value={draftCategoryLabel} />
              <InlinePair label="Density" value={draftDensityLabel} />
              <InlinePair label="Dynamic stiffness" value={draftDynamicLabel} />
            </div>
            {draftNotePreview ? <p className="text-[0.76rem] leading-5 text-[color:var(--ink-soft)]">{draftNotePreview}</p> : null}
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <label className="grid min-w-0 gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--ink-faint)]">Custom material name</span>
              <input
                aria-invalid={Boolean(errors.name)}
                className={getTextInputClassName(Boolean(errors.name))}
                onChange={(event) => onDraftChange("name", event.target.value)}
                placeholder="e.g. EPDM resilient mat"
                value={draft.name}
              />
              {errors.name ? <span className="text-[0.72rem] leading-5 text-[color:var(--warning-ink)]">{errors.name}</span> : null}
            </label>

            <label className="grid min-w-0 gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--ink-faint)]">Category</span>
              <select
                className="focus-ring touch-target w-full min-w-0 rounded border border-[color:var(--line)] bg-[color:var(--paper)] px-3 py-2.5"
                onChange={(event) => onDraftChange("category", event.target.value as MaterialCategory)}
                value={draft.category}
              >
                {CUSTOM_MATERIAL_CATEGORY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid min-w-0 gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--ink-faint)]">Density</span>
              <input
                aria-invalid={Boolean(errors.densityKgM3)}
                className={getTextInputClassName(Boolean(errors.densityKgM3))}
                inputMode="decimal"
                onChange={(event) => onDraftChange("densityKgM3", event.target.value)}
                placeholder="kg/m³"
                value={draft.densityKgM3}
              />
              {errors.densityKgM3 ? (
                <span className="text-[0.72rem] leading-5 text-[color:var(--warning-ink)]">{errors.densityKgM3}</span>
              ) : (
                <span className="text-[0.72rem] leading-5 text-[color:var(--ink-soft)]">Required for surface mass. Use `0` only for true gaps or support-only layers.</span>
              )}
            </label>

            <label className="grid min-w-0 gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--ink-faint)]">Dynamic stiffness</span>
              <input
                aria-invalid={Boolean(errors.dynamicStiffnessMNm3)}
                className={getTextInputClassName(Boolean(errors.dynamicStiffnessMNm3))}
                inputMode="decimal"
                onChange={(event) => onDraftChange("dynamicStiffnessMNm3", event.target.value)}
                placeholder="MN/m³"
                value={draft.dynamicStiffnessMNm3}
              />
              {errors.dynamicStiffnessMNm3 ? (
                <span className="text-[0.72rem] leading-5 text-[color:var(--warning-ink)]">{errors.dynamicStiffnessMNm3}</span>
              ) : (
                <span className="text-[0.72rem] leading-5 text-[color:var(--ink-soft)]">Optional. Fill this when the product sheet publishes a resilient-layer stiffness.</span>
              )}
            </label>
          </div>

          <label className="grid min-w-0 gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--ink-faint)]">Material note</span>
            <textarea
              className="focus-ring min-h-[5.5rem] rounded border border-[color:var(--line)] bg-[color:var(--paper)] px-3 py-2.5 text-sm text-[color:var(--ink)]"
              onChange={(event) => onDraftChange("notes", event.target.value)}
              placeholder="Optional source note, product sheet reference, or consultant remark."
              value={draft.notes}
            />
          </label>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              <GuidedFactChip tone={errors.name || errors.densityKgM3 ? "warning" : "neutral"}>
                {canCreate ? "Ready to save" : "Missing required fields"}
              </GuidedFactChip>
              <GuidedFactChip>{`Library size after save: ${customMaterials.length + (canCreate ? 1 : 0)}`}</GuidedFactChip>
            </div>
            <button
              className="focus-ring inline-flex items-center justify-center gap-2 rounded bg-[color:var(--accent)] px-4 py-2 text-sm font-semibold text-[color:var(--paper)] disabled:cursor-not-allowed disabled:opacity-45"
              disabled={!canCreate}
              onClick={onCreate}
              type="button"
            >
              <Plus className="h-4 w-4" />
              Save material
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}

function NewLayerComposer(props: {
  draft: NewLayerDraft;
  materials: readonly MaterialDefinition[];
  onDensityChange: (densityKgM3: string) => void;
  materialGroups: readonly WorkbenchMaterialOptionGroup[];
  onAdd: () => void;
  onDynamicStiffnessChange: (dynamicStiffnessMNm3: string) => void;
  onFloorRoleChange: (floorRole?: FloorRole) => void;
  onMaterialChange: (materialId: string) => void;
  onThicknessChange: (thicknessMm: string) => void;
  studyMode: StudyMode;
}) {
  const {
    draft,
    materials: allMaterials,
    materialGroups,
    onAdd,
    onDensityChange,
    onDynamicStiffnessChange,
    onFloorRoleChange,
    onMaterialChange,
    onThicknessChange,
    studyMode
  } = props;
  const materials = uniqueMaterialsById(materialGroups.flatMap((group) => group.materials));
  const material = materials.find((entry) => entry.id === draft.materialId) ?? allMaterials[0]!;
  const categoryLabel = getMaterialCategoryLabel(material);
  const densityLabel = formatDensityLabel(material, draft.densityKgM3);
  const surfaceMassLabel =
    buildMaterialFacts({
      densityOverride: draft.densityKgM3,
      dynamicStiffnessOverride: draft.dynamicStiffnessMNm3,
      material,
      thicknessMm: draft.thicknessMm
    }).find((fact) => fact.includes("kg/m²")) ?? "Pending thickness";
  const dynamicStiffnessLabel = formatDynamicStiffnessLabel(material, draft.dynamicStiffnessMNm3);
  const densityWarning = getDensityInputWarning(material, draft.densityKgM3);
  const dynamicStiffnessWarning = getDynamicStiffnessInputWarning(draft.dynamicStiffnessMNm3);
  const catalogDynamicStiffness = getCatalogDynamicStiffness(material);
  const catalogDensity = getCatalogDensity(material);
  const thicknessWarning = getLayerThicknessSanityWarning(
    {
      floorRole: draft.floorRole,
      materialId: draft.materialId,
      thicknessMm: draft.thicknessMm
    },
    0,
    allMaterials
  );
  const thicknessHint = getLayerThicknessGuidanceHint(
    {
      floorRole: draft.floorRole,
      materialId: draft.materialId
    },
    allMaterials
  );
  const canAdd = Boolean(parsePositiveNumber(draft.thicknessMm));

  return (
    <div className={`rounded border px-3 py-3 ${workbenchSectionCardClass("assembly")}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="text-[0.84rem] font-semibold text-[color:var(--ink)]">Add the next layer here</div>
          <p className="mt-1 text-[0.76rem] leading-5 text-[color:var(--ink-soft)]">
            Pick the material and thickness, then append it to the stack.
          </p>
        </div>
        <button
          className="focus-ring inline-flex items-center justify-center gap-2 rounded bg-[color:var(--accent)] px-4 py-2 text-sm font-semibold text-[color:var(--paper)] disabled:cursor-not-allowed disabled:opacity-45"
          disabled={!canAdd}
          onClick={onAdd}
          type="button"
        >
          <Plus className="h-4 w-4" />
          Add layer
        </button>
      </div>

      <div className={`mt-3 grid min-w-0 gap-3 ${studyMode === "floor" ? "md:grid-cols-2" : "md:grid-cols-3"}`}>
        <WorkbenchMaterialPicker
          currentMaterial={material}
          groups={materialGroups}
          label="New layer material"
          onSelect={onMaterialChange}
        />

        <label className="grid min-w-0 gap-2">
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--ink-faint)]">New layer thickness</span>
          <input
            aria-invalid={Boolean(thicknessWarning)}
            aria-label="New layer thickness"
            className={getTextInputClassName(Boolean(thicknessWarning))}
            inputMode="decimal"
            onChange={(event) => onThicknessChange(event.target.value)}
            placeholder="mm"
            value={draft.thicknessMm}
          />
        </label>

        <label className="grid min-w-0 gap-2">
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--ink-faint)]">New layer density</span>
          <input
            aria-invalid={Boolean(densityWarning)}
            aria-label="New layer density"
            className={getTextInputClassName(Boolean(densityWarning))}
            inputMode="decimal"
            onChange={(event) => onDensityChange(event.target.value)}
            placeholder={typeof catalogDensity === "number" ? formatDecimal(catalogDensity) : "kg/m³"}
            value={draft.densityKgM3}
          />
        </label>

        {studyMode === "floor" ? (
          <label className="grid min-w-0 gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--ink-faint)]">New layer dynamic stiffness</span>
            <input
              aria-invalid={Boolean(dynamicStiffnessWarning)}
              aria-label="New layer dynamic stiffness"
              className={getTextInputClassName(Boolean(dynamicStiffnessWarning))}
              inputMode="decimal"
              onChange={(event) => onDynamicStiffnessChange(event.target.value)}
              placeholder={typeof catalogDynamicStiffness === "number" ? formatDecimal(catalogDynamicStiffness) : "MN/m³"}
              value={draft.dynamicStiffnessMNm3}
            />
          </label>
        ) : null}

        {studyMode === "floor" ? (
          <label className="grid min-w-0 gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--ink-faint)]">New layer role</span>
            <select
              aria-label="New layer role"
              className="focus-ring touch-target w-full min-w-0 rounded border border-[color:var(--line)] bg-[color:var(--paper)] px-3 py-2.5"
              onChange={(event) => onFloorRoleChange(event.target.value ? (event.target.value as FloorRole) : undefined)}
              value={draft.floorRole ?? ""}
            >
              <option value="">Unassigned</option>
              {Object.entries(FLOOR_ROLE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
        ) : null}
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-2 2xl:grid-cols-4">
        <InlinePair label="Category" value={categoryLabel} />
        <InlinePair label="Density" value={densityLabel} />
        <InlinePair label="Layer mass" value={surfaceMassLabel} />
        <InlinePair label="Dynamic stiffness" value={dynamicStiffnessLabel} />
      </div>

      {material.notes ? (
        <div className={`mt-3 rounded border px-3 py-2.5 text-[0.74rem] leading-5 text-[color:var(--ink-soft)] ${workbenchSectionMutedCardClass("assembly")}`}>
          <span className="font-semibold text-[color:var(--ink)]">Material note:</span> {material.notes}
        </div>
      ) : null}

      {thicknessHint || thicknessWarning || densityWarning || dynamicStiffnessWarning ? (
        <div className="mt-3 grid gap-1 text-[0.7rem] leading-5">
          {thicknessHint ? <div className="text-[color:var(--ink-soft)]">{thicknessHint}</div> : null}
          {thicknessWarning ? <div className="text-[color:var(--warning-ink)]">{thicknessWarning}</div> : null}
          {densityWarning ? <div className="text-[color:var(--warning-ink)]">{densityWarning}</div> : null}
          {dynamicStiffnessWarning ? <div className="text-[color:var(--warning-ink)]">{dynamicStiffnessWarning}</div> : null}
        </div>
      ) : null}
    </div>
  );
}

function ReviewTabButton(props: {
  active: boolean;
  controlsId: string;
  id: ReviewTabId;
  label: string;
  onSelect: (id: ReviewTabId) => void;
}) {
  const { active, controlsId, id, label, onSelect } = props;

  return (
    <button
      aria-controls={controlsId}
      aria-selected={active}
      className={`focus-ring inline-flex items-center rounded border px-3 py-2 text-sm font-semibold transition ${
        active
          ? "border-[color:var(--accent)] bg-[color:var(--accent-soft)] text-[color:var(--ink)]"
          : "hairline bg-[color:var(--paper)]/74 text-[color:var(--ink-soft)] hover:bg-[color:var(--panel)]"
      }`}
      id={`guided-review-tab-${id}`}
      onClick={() => onSelect(id)}
      role="tab"
      type="button"
    >
      {label}
    </button>
  );
}

export function SimpleWorkbenchShell() {
  const addCustomMaterial = useWorkbenchStore((state) => state.addCustomMaterial);
  const briefNote = useWorkbenchStore((state) => state.briefNote);
  const clientName = useWorkbenchStore((state) => state.clientName);
  const consultantAddress = useWorkbenchStore((state) => state.consultantAddress);
  const consultantCompany = useWorkbenchStore((state) => state.consultantCompany);
  const consultantEmail = useWorkbenchStore((state) => state.consultantEmail);
  const consultantLogoDataUrl = useWorkbenchStore((state) => state.consultantLogoDataUrl);
  const consultantPhone = useWorkbenchStore((state) => state.consultantPhone);
  const consultantWordmarkLine = useWorkbenchStore((state) => state.consultantWordmarkLine);
  const customMaterials = useWorkbenchStore((state) => state.customMaterials);
  const approverTitle = useWorkbenchStore((state) => state.approverTitle);
  const preparedBy = useWorkbenchStore((state) => state.preparedBy);
  const proposalIssueCodePrefix = useWorkbenchStore((state) => state.proposalIssueCodePrefix);
  const proposalAttention = useWorkbenchStore((state) => state.proposalAttention);
  const proposalIssuePurpose = useWorkbenchStore((state) => state.proposalIssuePurpose);
  const proposalRecipient = useWorkbenchStore((state) => state.proposalRecipient);
  const projectName = useWorkbenchStore((state) => state.projectName);
  const proposalReference = useWorkbenchStore((state) => state.proposalReference);
  const proposalRevision = useWorkbenchStore((state) => state.proposalRevision);
  const proposalSubject = useWorkbenchStore((state) => state.proposalSubject);
  const proposalValidityNote = useWorkbenchStore((state) => state.proposalValidityNote);
  const reportProfile = useWorkbenchStore((state) => state.reportProfile);
  const rows = useWorkbenchStore((state) => state.rows);
  const studyContext = useWorkbenchStore((state) => state.studyContext);
  const studyMode = useWorkbenchStore((state) => state.studyMode);
  const calculatorId = useWorkbenchStore((state) => state.calculatorId);
  const requestedOutputs = useWorkbenchStore((state) => state.requestedOutputs);
  const airborneContextMode = useWorkbenchStore((state) => state.airborneContextMode);
  const airborneAirtightness = useWorkbenchStore((state) => state.airborneAirtightness);
  const airborneConnectionType = useWorkbenchStore((state) => state.airborneConnectionType);
  const airborneElectricalBoxes = useWorkbenchStore((state) => state.airborneElectricalBoxes);
  const airborneJunctionQuality = useWorkbenchStore((state) => state.airborneJunctionQuality);
  const airbornePanelHeightMm = useWorkbenchStore((state) => state.airbornePanelHeightMm);
  const airbornePanelWidthMm = useWorkbenchStore((state) => state.airbornePanelWidthMm);
  const airbornePenetrationState = useWorkbenchStore((state) => state.airbornePenetrationState);
  const airbornePerimeterSeal = useWorkbenchStore((state) => state.airbornePerimeterSeal);
  const airborneReceivingRoomRt60S = useWorkbenchStore((state) => state.airborneReceivingRoomRt60S);
  const airborneReceivingRoomVolumeM3 = useWorkbenchStore((state) => state.airborneReceivingRoomVolumeM3);
  const airborneSharedTrack = useWorkbenchStore((state) => state.airborneSharedTrack);
  const airborneStudSpacingMm = useWorkbenchStore((state) => state.airborneStudSpacingMm);
  const airborneStudType = useWorkbenchStore((state) => state.airborneStudType);
  const impactGuideKDb = useWorkbenchStore((state) => state.impactGuideKDb);
  const impactGuideReceivingRoomVolumeM3 = useWorkbenchStore((state) => state.impactGuideReceivingRoomVolumeM3);

  const appendRows = useWorkbenchStore((state) => state.appendRows);
  const loadPreset = useWorkbenchStore((state) => state.loadPreset);
  const moveRow = useWorkbenchStore((state) => state.moveRow);
  const removeRow = useWorkbenchStore((state) => state.removeRow);
  const reset = useWorkbenchStore((state) => state.reset);
  const setAirborneAirtightness = useWorkbenchStore((state) => state.setAirborneAirtightness);
  const setAirborneConnectionType = useWorkbenchStore((state) => state.setAirborneConnectionType);
  const setAirborneContextMode = useWorkbenchStore((state) => state.setAirborneContextMode);
  const setAirborneElectricalBoxes = useWorkbenchStore((state) => state.setAirborneElectricalBoxes);
  const setAirborneJunctionQuality = useWorkbenchStore((state) => state.setAirborneJunctionQuality);
  const setAirbornePanelHeightMm = useWorkbenchStore((state) => state.setAirbornePanelHeightMm);
  const setAirbornePanelWidthMm = useWorkbenchStore((state) => state.setAirbornePanelWidthMm);
  const setAirbornePenetrationState = useWorkbenchStore((state) => state.setAirbornePenetrationState);
  const setAirbornePerimeterSeal = useWorkbenchStore((state) => state.setAirbornePerimeterSeal);
  const setAirborneReceivingRoomRt60S = useWorkbenchStore((state) => state.setAirborneReceivingRoomRt60S);
  const setAirborneReceivingRoomVolumeM3 = useWorkbenchStore((state) => state.setAirborneReceivingRoomVolumeM3);
  const setAirborneSharedTrack = useWorkbenchStore((state) => state.setAirborneSharedTrack);
  const setAirborneStudSpacingMm = useWorkbenchStore((state) => state.setAirborneStudSpacingMm);
  const setAirborneStudType = useWorkbenchStore((state) => state.setAirborneStudType);
  const setBriefNote = useWorkbenchStore((state) => state.setBriefNote);
  const setCalculatorId = useWorkbenchStore((state) => state.setCalculatorId);
  const setClientName = useWorkbenchStore((state) => state.setClientName);
  const setConsultantAddress = useWorkbenchStore((state) => state.setConsultantAddress);
  const setConsultantCompany = useWorkbenchStore((state) => state.setConsultantCompany);
  const setConsultantEmail = useWorkbenchStore((state) => state.setConsultantEmail);
  const setConsultantLogoDataUrl = useWorkbenchStore((state) => state.setConsultantLogoDataUrl);
  const setConsultantPhone = useWorkbenchStore((state) => state.setConsultantPhone);
  const setConsultantWordmarkLine = useWorkbenchStore((state) => state.setConsultantWordmarkLine);
  const setImpactGuideKDb = useWorkbenchStore((state) => state.setImpactGuideKDb);
  const setImpactGuideReceivingRoomVolumeM3 = useWorkbenchStore((state) => state.setImpactGuideReceivingRoomVolumeM3);
  const setApproverTitle = useWorkbenchStore((state) => state.setApproverTitle);
  const setPreparedBy = useWorkbenchStore((state) => state.setPreparedBy);
  const setProposalIssueCodePrefix = useWorkbenchStore((state) => state.setProposalIssueCodePrefix);
  const setProposalAttention = useWorkbenchStore((state) => state.setProposalAttention);
  const setProposalIssuePurpose = useWorkbenchStore((state) => state.setProposalIssuePurpose);
  const setProposalRecipient = useWorkbenchStore((state) => state.setProposalRecipient);
  const setProjectName = useWorkbenchStore((state) => state.setProjectName);
  const setProposalReference = useWorkbenchStore((state) => state.setProposalReference);
  const setProposalRevision = useWorkbenchStore((state) => state.setProposalRevision);
  const setProposalSubject = useWorkbenchStore((state) => state.setProposalSubject);
  const setProposalValidityNote = useWorkbenchStore((state) => state.setProposalValidityNote);
  const setRequestedOutputs = useWorkbenchStore((state) => state.setRequestedOutputs);
  const setReportProfile = useWorkbenchStore((state) => state.setReportProfile);
  const startStudyMode = useWorkbenchStore((state) => state.startStudyMode);
  const updateDensity = useWorkbenchStore((state) => state.updateDensity);
  const updateDynamicStiffness = useWorkbenchStore((state) => state.updateDynamicStiffness);
  const updateFloorRole = useWorkbenchStore((state) => state.updateFloorRole);
  const updateMaterial = useWorkbenchStore((state) => state.updateMaterial);
  const updateThickness = useWorkbenchStore((state) => state.updateThickness);

  const materials = buildWorkbenchMaterialCatalog(customMaterials);
  const modePresets = MODE_PRESETS[studyMode].map((presetId) => getPresetById(presetId));
  const automaticOutputs = getAutomaticOutputs(studyMode, airborneContextMode);
  const totalThickness = sumThickness(rows);
  const { collapsedLiveRowCount, liveRowCount, parkedRowCount, solverLayerCount } = getRowActivityCounts(rows, materials);
  const [selectedPresetId, setSelectedPresetId] = useState<PresetId>(modePresets[0]?.id ?? MODE_PRESETS[studyMode][0]!);
  const [newLayerDraft, setNewLayerDraft] = useState<NewLayerDraft>(() => buildDefaultNewLayerDraft(studyMode));
  const [customMaterialDraft, setCustomMaterialDraft] = useState<CustomMaterialDraft>(() => createEmptyCustomMaterialDraft());
  const [customMaterialExpanded, setCustomMaterialExpanded] = useState(false);
  const [activeRowId, setActiveRowId] = useState<string | null>(null);
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
  const [activeAssemblyTool, setActiveAssemblyTool] = useState<AssemblyToolPanel | null>(null);
  const [movedRowFlash, setMovedRowFlash] = useState<{ direction: "down" | "up"; rowId: string } | null>(null);
  const [activeReviewTab, setActiveReviewTab] = useState<ReviewTabId>("method");
  const [activeWorkspacePanel, setActiveWorkspacePanel] = useState<WorkspacePanelId>(() => (rows.length > 0 ? "stack" : "setup"));
  const [reviewExpanded, setReviewExpanded] = useState(false);
  const { theme, toggle: toggleTheme } = useTheme();
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1280px)");
    const sync = () => setIsDesktop(mediaQuery.matches);
    sync();
    mediaQuery.addEventListener("change", sync);
    return () => mediaQuery.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (sameRequestedOutputs(requestedOutputs, automaticOutputs)) {
      return;
    }

    setRequestedOutputs(automaticOutputs);
  }, [automaticOutputs, requestedOutputs, setRequestedOutputs]);

  useEffect(() => {
    const fallbackPresetId = modePresets[0]?.id ?? MODE_PRESETS[studyMode][0]!;
    if (!modePresets.some((preset) => preset.id === selectedPresetId)) {
      setSelectedPresetId(fallbackPresetId);
    }
  }, [modePresets, selectedPresetId, studyMode]);

  useEffect(() => {
    setNewLayerDraft(buildDefaultNewLayerDraft(studyMode));
  }, [studyMode]);

  useEffect(() => {
    if (activeRowId && !rows.some((row) => row.id === activeRowId)) {
      setActiveRowId(null);
    }
  }, [activeRowId, rows]);

  useEffect(() => {
    if (expandedRowId && rows.some((row) => row.id === expandedRowId)) {
      return;
    }

    setExpandedRowId(null);
  }, [expandedRowId, rows]);

  useEffect(() => {
    if (!movedRowFlash) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setMovedRowFlash((current) => (current?.rowId === movedRowFlash.rowId ? null : current));
    }, 520);

    return () => window.clearTimeout(timeoutId);
  }, [movedRowFlash]);

  const selectedPreset = modePresets.find((preset) => preset.id === selectedPresetId) ?? modePresets[0]!;
  const selectedContextOption =
    AIRBORNE_CONTEXT_OPTIONS.find((option) => option.value === airborneContextMode) ?? AIRBORNE_CONTEXT_OPTIONS[0]!;
  const newLayerMaterialGroups = buildMaterialGroups(
    studyMode,
    materials,
    newLayerDraft.materialId,
    newLayerDraft.floorRole
  );
  const customMaterialErrors = validateCustomMaterialDraft(customMaterialDraft, materials);

  const liveAirborneContext: AirborneContext = {
    airtightness: airborneAirtightness,
    connectionType: airborneConnectionType,
    contextMode: airborneContextMode,
    electricalBoxes: airborneElectricalBoxes,
    junctionQuality: airborneJunctionQuality,
    panelHeightMm: parsePositiveNumber(airbornePanelHeightMm),
    panelWidthMm: parsePositiveNumber(airbornePanelWidthMm),
    penetrationState: airbornePenetrationState,
    perimeterSeal: airbornePerimeterSeal,
    receivingRoomRt60S: parsePositiveNumber(airborneReceivingRoomRt60S),
    receivingRoomVolumeM3: parsePositiveNumber(airborneReceivingRoomVolumeM3),
    sharedTrack: airborneSharedTrack,
    studSpacingMm: parsePositiveNumber(airborneStudSpacingMm),
    studType: airborneStudType
  };

  const liveImpactFieldContext: ImpactFieldContext | null =
    studyMode === "floor" &&
    (parsePositiveNumber(impactGuideKDb) || parsePositiveNumber(impactGuideReceivingRoomVolumeM3))
      ? {
          fieldKDb: parsePositiveNumber(impactGuideKDb),
          receivingRoomVolumeM3: parsePositiveNumber(impactGuideReceivingRoomVolumeM3)
        }
      : null;

  const scenario = evaluateScenario({
    airborneContext: liveAirborneContext,
    calculator: calculatorId,
    customMaterials,
    id: "simple-current",
    impactFieldContext: liveImpactFieldContext,
    name: projectName,
    rows,
    source: "current",
    studyMode,
    targetOutputs: automaticOutputs
  });

  const result = scenario.result;
  const assemblyDescription = describeAssembly(result, studyMode);
  const fieldAirborneRequested = automaticOutputs.some((output) => FIELD_AIRBORNE_OUTPUTS.has(output));
  const fieldImpactRequested = automaticOutputs.some((output) => FIELD_IMPACT_OUTPUTS.has(output));
  const geometryActive = airborneContextMode !== "element_lab" && fieldAirborneRequested;
  const standardizedAirborneActive = geometryActive && automaticOutputs.some((output) => STANDARDIZED_AIRBORNE_OUTPUTS.has(output));
  const wallModifiersActive = studyMode === "wall" && airborneContextMode !== "element_lab";
  const impactFieldActive = studyMode === "floor" && fieldImpactRequested;
  const standardizedImpactOutputsActive = automaticOutputs.includes("L'nT,w") || automaticOutputs.includes("L'nT,50");
  const expertInputsActive = wallModifiersActive || calculatorId !== "dynamic";
  const validThicknessCount = countValidThicknessRows(rows);
  const assignedFloorRoleCount = countAssignedFloorRoles(rows);
  const missingFloorRoleCount = studyMode === "floor" ? Math.max(rows.length - assignedFloorRoleCount, 0) : 0;
  const contextNotes: string[] = [];
  const panelWidthSanityWarning =
    geometryActive
      ? getGuidedNumericSanityWarning({
          band: GUIDED_INPUT_SANITY_BANDS.panelWidthMm,
          label: "Partition width",
          suffix: "Check that the value is in millimetres.",
          value: airbornePanelWidthMm
        })
      : null;
  const panelHeightSanityWarning =
    geometryActive
      ? getGuidedNumericSanityWarning({
          band: GUIDED_INPUT_SANITY_BANDS.panelHeightMm,
          label: "Partition height",
          suffix: "Check that the value is in millimetres.",
          value: airbornePanelHeightMm
        })
      : null;
  const airborneVolumeSanityWarning =
    geometryActive && standardizedAirborneActive
      ? getGuidedNumericSanityWarning({
          band: GUIDED_INPUT_SANITY_BANDS.receivingRoomVolumeM3,
          label: "Receiving-room volume",
          suffix: "Check that the value reflects the real receiving space.",
          value: airborneReceivingRoomVolumeM3
        })
      : null;
  const rt60SanityWarning =
    standardizedAirborneActive
      ? getGuidedNumericSanityWarning({
          band: GUIDED_INPUT_SANITY_BANDS.receivingRoomRt60S,
          label: "RT60",
          suffix: "Recheck the measurement or assumption before trusting a standardized field read.",
          value: airborneReceivingRoomRt60S
        })
      : null;
  const impactKSanityWarning =
    impactFieldActive
      ? getGuidedNumericSanityWarning({
          band: GUIDED_INPUT_SANITY_BANDS.fieldKDb,
          label: "Field K correction",
          suffix: "Recheck the correction source before trusting carried field impact values.",
          value: impactGuideKDb
        })
      : null;
  const impactVolumeSanityWarning =
    impactFieldActive && standardizedImpactOutputsActive
      ? getGuidedNumericSanityWarning({
          band: GUIDED_INPUT_SANITY_BANDS.receivingRoomVolumeM3,
          label: "Impact receiving-room volume",
          suffix: "Check that the value reflects the room used for field standardization.",
          value: impactGuideReceivingRoomVolumeM3
        })
      : null;

  if (!geometryActive) {
    contextNotes.push(
      airborneContextMode === "element_lab"
        ? "Lab mode ignores room geometry, RT60, and field normalization inputs."
        : "The current output set does not need extra airborne geometry fields."
    );
  } else if (!standardizedAirborneActive) {
    contextNotes.push("Receiving-room volume stays parked because the current route stops at apparent field outputs such as R'w and Dn,w.");
  } else {
    contextNotes.push("RT60 stays optional here. DnT outputs standardize with partition geometry and receiving-room volume; RT60 only feeds absorption-aware sidecars.");
  }

  if (studyMode === "floor") {
    if (!impactFieldActive) {
      contextNotes.push("Field K and floor-side room-volume corrections stay hidden until field impact outputs are requested.");
    } else if (!standardizedImpactOutputsActive) {
      contextNotes.push("Floor field volume is optional right now because only L'n,w is active; standardized L'nT outputs are not requested yet.");
    }
  }

  if (!wallModifiersActive) {
    contextNotes.push("Wall leakage modifiers only matter on wall field or building reads, so they stay out of the main path here.");
  }

  const outputCards = automaticOutputs.map((output) =>
    addOutputCardPosture(buildOutputCard({ output, result, studyMode }), { result, studyMode })
  );
  const readyCards = outputCards.filter((card) => card.status === "live" || card.status === "bound");
  const pendingCards = outputCards.filter((card) => card.status !== "live" && card.status !== "bound");
  const liveOutputCards = outputCards.filter((card) => card.status === "live");
  const boundOutputCards = outputCards.filter((card) => card.status === "bound");
  const needsInputCards = pendingCards.filter((card) => card.status === "needs_input");
  const unsupportedCards = pendingCards.filter((card) => card.status === "unsupported");
  const outputUnlockGroups = getGuidedOutputUnlocks({
    airborneContextMode,
    airbornePanelHeightMm,
    airbornePanelWidthMm,
    airborneReceivingRoomRt60S,
    airborneReceivingRoomVolumeM3,
    impactGuideKDb,
    impactGuideReceivingRoomVolumeM3,
    parkedOutputs: needsInputCards.map((card) => card.output),
    studyMode
  });
  const primaryReadyCard = pickPrimaryOutputCard(readyCards, studyMode);
  const secondaryReadyCards = primaryReadyCard ? readyCards.filter((card) => card !== primaryReadyCard) : readyCards;
  const readyOutputCount = readyCards.length;
  const heroHeadline = result ? assemblyDescription.headline : "Choose a context and build the assembly to start the live estimate.";
  const routeReadinessDetail =
    rows.length === 0
      ? "No layers yet. Start the stack below."
      : `${validThicknessCount}/${rows.length} rows currently contribute live thickness.${studyMode === "floor" ? ` ${assignedFloorRoleCount}/${rows.length} rows are tagged for exact floor matching.` : ""}`;
  const routeCoverageLabel =
    rows.length === 0 ? "Stack empty" : `${validThicknessCount}/${rows.length} layer${rows.length === 1 ? "" : "s"} ready`;
  const hasOptionalContextFields = geometryActive || (impactFieldActive && !standardizedImpactOutputsActive);
  const validationSummary = getGuidedValidationSummary({ result, studyMode });
  const topologyGap = getGuidedTopologyGap({ result, rows, studyMode });
  const routeSignals = deriveGuidedRouteSignals({
    missingFloorRoleCount,
    primaryReadyCard: primaryReadyCard ? { label: primaryReadyCard.label, value: primaryReadyCard.value } : null,
    rowsLength: rows.length,
    studyMode,
    topologyGap,
    validationPosture: validationSummary.posture,
    validThicknessCount,
    warningCount: scenario.warnings.length
  });
  const dynamicCalcBranch = getDynamicCalcBranchSummary({ result, studyMode });
  const showTimberImpactOnlyGuidedActions = studyMode === "floor" && isImpactOnlyLowConfidenceFloorLane(result);
  const lightweightSteelBaseRow =
    studyMode === "floor" ? rows.find((row) => row.floorRole === "base_structure" && row.materialId === "lightweight_steel_floor") : null;
  const showSteelBoundSupportFormActions =
    studyMode === "floor" && isSteelBoundSupportFormLane(result) && Boolean(lightweightSteelBaseRow);
  const proposalIssuedOnLabel = new Intl.DateTimeFormat("en-GB", {
    dateStyle: "long"
  }).format(new Date());
  const proposalIssuedOnIso = new Date().toISOString();
  const outputUnlockActionById = new Map<RequestedOutputId, string>();
  for (const group of outputUnlockGroups) {
    for (const output of group.outputs) {
      if (!outputUnlockActionById.has(output)) {
        outputUnlockActionById.set(output, group.title);
      }
    }
  }
  const proposalMetrics = readyCards.map((card) => ({
    detail: card.detail,
    label: card.label,
    value: card.value
  }));
  const proposalCoverageItems = outputCards.map((card) => ({
    detail: card.detail,
    label: card.label,
    nextStep: card.status === "needs_input" ? outputUnlockActionById.get(card.output) : undefined,
    postureDetail: card.postureDetail,
    postureLabel: card.postureLabel,
    postureTone: card.postureTone,
    status: card.status,
    value: card.value
  }));
  const proposalLayers = rows.map((row, index) => {
    const material = materials.find((entry) => entry.id === row.materialId);
    const effectiveDensity = material
      ? getEffectiveDensity({
          material,
          overrideValue: row.densityKgM3
        })
      : undefined;
    const densityLabel = material ? formatDensityLabel(material, row.densityKgM3) : "Not listed";
    const layerThicknessMm = parsePositiveNumber(row.thicknessMm);
    const surfaceMassLabel =
      typeof effectiveDensity === "number" && typeof layerThicknessMm === "number"
        ? `${formatDecimal((effectiveDensity * layerThicknessMm) / 1000)} kg/m²`
        : undefined;

    return {
      categoryLabel: material ? getMaterialCategoryLabel(material) : "Uncatalogued layer",
      densityLabel,
      index: index + 1,
      label: material?.name ?? row.materialId,
      roleLabel: studyMode === "floor" && row.floorRole ? FLOOR_ROLE_LABELS[row.floorRole] : undefined,
      surfaceMassLabel,
      thicknessLabel: `${row.thicknessMm.trim().length > 0 ? row.thicknessMm : "?"} mm`
    };
  });
  const methodReadyMetrics = readyCards.map((card) => ({
    detail: card.detail,
    label: card.label,
    value: card.value
  }));
  const methodUnlocks = outputUnlockGroups.map((group) => ({
    detail: group.detail,
    outputsLabel: formatUnlockOutputs(group.outputs),
    title: group.title
  }));
  const methodStackDetail =
    parkedRowCount > 0
      ? `${formatCountLabel(liveRowCount, "live row")} currently resolve to ${formatCountLabel(solverLayerCount, "solver layer")}. ${formatCountLabel(parkedRowCount, "parked row")} stay visible but do not affect the live route.`
      : collapsedLiveRowCount > 0
        ? `${formatCountLabel(liveRowCount, "live row")} collapse to ${formatCountLabel(solverLayerCount, "solver layer")} before calculation because adjacent identical live rows are merged.`
        : `${formatCountLabel(liveRowCount, "live row")} feed ${formatCountLabel(solverLayerCount, "solver layer")} directly on the active route.`;
  const methodDossier = buildSimpleWorkbenchMethodDossier({
    branchDetail: dynamicCalcBranch.detail,
    branchLabel: dynamicCalcBranch.value,
    contextLabel: getEnvironmentLabel(airborneContextMode),
    coverageItems: proposalCoverageItems,
    layers: proposalLayers,
    result: scenario.result,
    stackDetail: methodStackDetail,
    studyModeLabel: getStudyModeLabel(studyMode),
    validationDetail: validationSummary.detail,
    validationLabel: validationSummary.value,
    warnings: scenario.warnings
  });
  const corridorDossier = buildSimpleWorkbenchCorridorDossier(scenario.result, studyMode);
  const selectedTraceNoteCount = methodDossier.traceGroups.reduce((count, group) => count + group.notes.length, 0);
  const proposalEvidence = buildSimpleWorkbenchEvidencePacket({
    briefNote,
    outputs: automaticOutputs,
    result,
    warnings: scenario.warnings
  });
  const methodAssumptionItems = buildSimpleWorkbenchProposalBrief({
    briefNote,
    citations: proposalEvidence.citations,
    consultantCompany,
    contextLabel: getEnvironmentLabel(airborneContextMode),
    dynamicBranchDetail: dynamicCalcBranch.detail,
    dynamicBranchLabel: dynamicCalcBranch.value,
    issueCodePrefix: proposalIssueCodePrefix,
    issuedOnIso: proposalIssuedOnIso,
    primaryMetricLabel: proposalMetrics[0]?.label ?? "Primary read",
    primaryMetricValue: proposalMetrics[0]?.value ?? "Waiting for supported output",
    projectName,
    reportProfileLabel: REPORT_PROFILE_LABELS[reportProfile],
    studyContextLabel: STUDY_CONTEXT_LABELS[studyContext],
    studyModeLabel: getStudyModeLabel(studyMode),
    validationDetail: validationSummary.detail,
    validationLabel: validationSummary.value,
    validationTone: validationSummary.tone,
    warnings: scenario.warnings
  }).assumptionItems;
  const activeReviewTabConfig = REVIEW_TABS.find((tab) => tab.id === activeReviewTab) ?? REVIEW_TABS[0]!;
  const activeReviewPanelId = `guided-review-panel-${activeReviewTab}`;
  const openWorkspacePanel = (panelId: WorkspacePanelId) => {
    setActiveWorkspacePanel(panelId);
    if (panelId === "review") {
      setReviewExpanded(true);
    }
  };
  const closeReviewPanel = () => {
    setReviewExpanded(false);
    setActiveWorkspacePanel(rows.length > 0 ? "results" : "stack");
  };
  const selectReviewTab = (tabId: ReviewTabId) => {
    setActiveReviewTab(tabId);
    setReviewExpanded(true);
    setActiveWorkspacePanel("review");
  };
  const openReviewTab = (tabId: ReviewTabId) => {
    selectReviewTab(tabId);
    requestAnimationFrame(() => {
      document.getElementById("guided-review-deck")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };
  const appendConfiguredLayer = () => {
    if (!parsePositiveNumber(newLayerDraft.thicknessMm)) {
      return;
    }

    appendRows([
      {
        densityKgM3: newLayerDraft.densityKgM3,
        dynamicStiffnessMNm3: newLayerDraft.dynamicStiffnessMNm3,
        floorRole: studyMode === "floor" ? newLayerDraft.floorRole : undefined,
        materialId: newLayerDraft.materialId,
        thicknessMm: newLayerDraft.thicknessMm
      }
    ]);
    setNewLayerDraft(buildDefaultNewLayerDraft(studyMode));
    setActiveAssemblyTool(null);
  };
  const createCustomMaterial = () => {
    const errors = validateCustomMaterialDraft(customMaterialDraft, materials);
    if (Object.values(errors).some((value) => value)) {
      return;
    }

    const material = buildCustomMaterialDefinition({
      draft: customMaterialDraft,
      existingMaterials: materials
    });

    addCustomMaterial(material);
    setCustomMaterialDraft(createEmptyCustomMaterialDraft());
    setCustomMaterialExpanded(false);
    setActiveAssemblyTool("composer");
    setNewLayerDraft({
      densityKgM3: "",
      dynamicStiffnessMNm3: "",
      floorRole: inferFloorRole(material.id, studyMode, [...customMaterials, material]),
      materialId: material.id,
      thicknessMm: defaultThicknessForMaterial(material)
    });
    setActiveWorkspacePanel("stack");
  };
  const moveRowWithFeedback = (rowId: string, direction: "up" | "down") => {
    moveRow(rowId, direction);
    setActiveRowId(rowId);
    setMovedRowFlash({ direction, rowId });

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.querySelector<HTMLElement>(`[data-row-id="${rowId}"]`)?.scrollIntoView({
          behavior: "smooth",
          block: "nearest"
        });
      });
    });
  };

  return (
    <div
      className="grid min-w-0 gap-0"
      style={SIMPLE_WORKBENCH_THEME}
    >
      {/* ── Compact toolbar ── */}
      <div className="stage-enter border-b border-[color:var(--line)] bg-[color:var(--paper)] px-4 py-2.5">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <h1 className="shrink-0 text-sm font-semibold text-[color:var(--ink)]">
            {`${getStudyModeLabel(studyMode)} calculator`}
          </h1>

          <div className="flex flex-wrap items-center gap-2">
            <select
              aria-label="Study type"
              className="focus-ring h-8 min-w-0 rounded border border-[color:var(--line)] bg-[color:var(--paper)] px-2 text-[0.8rem] text-[color:var(--ink)]"
              onChange={(event) => startStudyMode(event.target.value as StudyMode)}
              value={studyMode}
            >
              <option value="floor">Floor</option>
              <option value="wall">Wall</option>
            </select>

            <select
              aria-label="Project context"
              className="focus-ring h-8 min-w-0 rounded border border-[color:var(--line)] bg-[color:var(--paper)] px-2 text-[0.8rem] text-[color:var(--ink)]"
              onChange={(event) => setAirborneContextMode(event.target.value as AirborneContextMode)}
              value={airborneContextMode}
            >
              {AIRBORNE_CONTEXT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <select
              aria-label="Example stack"
              className="focus-ring h-8 min-w-0 rounded border border-[color:var(--line)] bg-[color:var(--paper)] px-2 text-[0.8rem] text-[color:var(--ink)]"
              onChange={(event) => {
                const nextPresetId = event.target.value as PresetId;
                setSelectedPresetId(nextPresetId);
                loadPreset(nextPresetId);
              }}
              value={selectedPresetId}
            >
              {modePresets.map((preset) => (
                <option key={preset.id} value={preset.id}>
                  {preset.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              className="focus-ring inline-flex h-8 items-center gap-1.5 rounded border border-[color:var(--line)] bg-[color:var(--paper)] px-2.5 text-[0.8rem] font-medium text-[color:var(--ink-soft)] hover:bg-[color:var(--panel)]"
              onClick={() => reset()}
              type="button"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </button>

            <Link
              className="focus-ring inline-flex h-8 items-center gap-1.5 rounded border border-[color:var(--line)] bg-[color:var(--paper)] px-2.5 text-[0.8rem] font-medium text-[color:var(--ink-soft)] hover:bg-[color:var(--panel)]"
              href="/workbench?view=advanced"
            >
              Advanced
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>

            <button
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              className="focus-ring inline-flex h-8 w-8 items-center justify-center rounded border border-[color:var(--line)] bg-[color:var(--paper)] text-[color:var(--ink-soft)] hover:bg-[color:var(--panel)]"
              onClick={toggleTheme}
              type="button"
            >
              {theme === "dark" ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
            </button>
          </div>

          <div className="ml-auto flex items-center gap-1.5 text-[0.72rem] text-[color:var(--ink-faint)]">
            <span>{`${readyOutputCount}/${automaticOutputs.length} ready`}</span>
            <span className="text-[color:var(--line)]">|</span>
            <span>{`${rows.length} row${rows.length === 1 ? "" : "s"}`}</span>
          </div>
        </div>
      </div>

      {/* ── Tab navigation (mobile only) ── */}
      {!isDesktop ? (
        <div className="flex border-b border-[color:var(--line)] bg-[color:var(--paper)] px-4">
          <WorkspacePanelButton active={activeWorkspacePanel === "setup"} label="Setup" onClick={() => openWorkspacePanel("setup")} />
          <WorkspacePanelButton active={activeWorkspacePanel === "stack"} label="Assembly" onClick={() => openWorkspacePanel("stack")} />
          <WorkspacePanelButton active={activeWorkspacePanel === "results"} label="Results" onClick={() => openWorkspacePanel("results")} />
          <WorkspacePanelButton
            active={activeWorkspacePanel === "review"}
            label="Details"
            onClick={() => openWorkspacePanel("review")}
          />
        </div>
      ) : null}

      {/* ── Panel content ── */}
      <section className={`grid min-w-0 ${isDesktop ? "grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]" : ""}`}>
        <div
          className={isDesktop
            ? "col-start-1 row-start-1 min-w-0 border-r border-[color:var(--line)] px-4 py-4"
            : `stage-enter-2 min-w-0 overflow-hidden px-4 py-4 ${activeWorkspacePanel === "setup" ? "block" : "hidden"}`
          }
        >
          <div className="flex flex-col">
            <SectionLead title="Route" tone="route" />

            <div className="mt-4 space-y-4">
              <section className={`rounded border px-3 py-3 ${workbenchSectionCardClass("route")}`}>
                <div className={`text-[0.68rem] font-semibold uppercase tracking-[0.14em] ${workbenchSectionEyebrowClass("route")}`}>Route summary</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  <GuidedFactChip>{getEnvironmentLabel(airborneContextMode)}</GuidedFactChip>
                  <GuidedFactChip>{selectedPreset.label}</GuidedFactChip>
                  <GuidedFactChip>{`${readyOutputCount}/${automaticOutputs.length} ready`}</GuidedFactChip>
                  <GuidedFactChip>{`${liveRowCount} live / ${parkedRowCount} parked`}</GuidedFactChip>
                </div>
                <p className="mt-3 text-[0.8rem] leading-5 text-[color:var(--ink-soft)]">{selectedContextOption.note}</p>
                <div className="mt-3 grid gap-2 md:grid-cols-2">
                  <GuidedRouteRow detail={routeSignals.primaryRead.detail} label="Primary output" tone="route" value={routeSignals.primaryRead.value} />
                  <GuidedRouteRow detail={dynamicCalcBranch.detail} label="Solver lane" tone="route" value={dynamicCalcBranch.value} />
                  <GuidedRouteRow detail={validationSummary.detail} label="Validation" tone="route" value={validationSummary.value} />
                  <GuidedRouteRow detail={routeSignals.nextAction.detail} label="Next step" tone="route" value={routeSignals.nextAction.value} />
                  {topologyGap ? <GuidedRouteRow detail={topologyGap.detail} label="Topology gap" tone="route" value={topologyGap.value} /> : null}
                </div>
              </section>

              {geometryActive || impactFieldActive ? (
                <section className={`rounded border px-3 py-3 ${workbenchSectionCardClass("route")}`}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="text-[0.84rem] font-semibold text-[color:var(--ink)]">Input map</div>
                    <DetailTag>{getEnvironmentLabel(airborneContextMode)}</DetailTag>
                  </div>

                  <div className="mt-3 grid gap-3">
                    <ContextBucket
                      description="Directly gates the live read."
                      hasContent={geometryActive || impactFieldActive}
                      title="Required now"
                      tone="required"
                    >
                      {geometryActive ? (
                        <ContextSubsection
                          note={
                            standardizedAirborneActive
                              ? "Geometry and room volume are live for DnT."
                              : "Geometry is live for apparent airborne reads."
                          }
                          title="Airborne route"
                        >
                          <FieldShell
                            advisory={`Guided sanity band ${formatGuidedSanityBand(GUIDED_INPUT_SANITY_BANDS.panelWidthMm)}.`}
                            label="Partition width (mm)"
                            note="Clear width of the separating element."
                            relevance="required"
                            usage="Dn,w, Dn,A, DnT,w, DnT,A"
                            warning={panelWidthSanityWarning}
                          >
                            <input
                              aria-invalid={Boolean(panelWidthSanityWarning)}
                              className={getTextInputClassName(Boolean(panelWidthSanityWarning))}
                              inputMode="decimal"
                              onChange={(event) => setAirbornePanelWidthMm(event.target.value)}
                              placeholder="e.g. 3600"
                              value={airbornePanelWidthMm}
                            />
                          </FieldShell>

                          <FieldShell
                            advisory={`Guided sanity band ${formatGuidedSanityBand(GUIDED_INPUT_SANITY_BANDS.panelHeightMm)}.`}
                            label="Partition height (mm)"
                            note="Clear height of the separating element."
                            relevance="required"
                            usage="Dn,w, Dn,A, DnT,w, DnT,A"
                            warning={panelHeightSanityWarning}
                          >
                            <input
                              aria-invalid={Boolean(panelHeightSanityWarning)}
                              className={getTextInputClassName(Boolean(panelHeightSanityWarning))}
                              inputMode="decimal"
                              onChange={(event) => setAirbornePanelHeightMm(event.target.value)}
                              placeholder="e.g. 2800"
                              value={airbornePanelHeightMm}
                            />
                          </FieldShell>

                          {standardizedAirborneActive ? (
                            <FieldShell
                              advisory={`Guided sanity band ${formatGuidedSanityBand(GUIDED_INPUT_SANITY_BANDS.receivingRoomVolumeM3)}.`}
                              label="Airborne room volume (m³)"
                              note="Receiving room volume for standardized DnT."
                              relevance="required"
                              usage="DnT,w and DnT,A"
                              warning={airborneVolumeSanityWarning}
                            >
                              <input
                                aria-invalid={Boolean(airborneVolumeSanityWarning)}
                                className={getTextInputClassName(Boolean(airborneVolumeSanityWarning))}
                                inputMode="decimal"
                                onChange={(event) => setAirborneReceivingRoomVolumeM3(event.target.value)}
                                placeholder="e.g. 42"
                                value={airborneReceivingRoomVolumeM3}
                              />
                            </FieldShell>
                          ) : null}
                        </ContextSubsection>
                      ) : null}

                      {impactFieldActive ? (
                        <ContextSubsection
                          note={
                            standardizedImpactOutputsActive
                              ? "K and room volume are live for standardized impact reads."
                              : "K is the only live field carry-over input."
                          }
                          title="Impact route"
                        >
                          <FieldShell
                            advisory={`Guided sanity band ${formatGuidedSanityBand(GUIDED_INPUT_SANITY_BANDS.fieldKDb)}.`}
                            label="Impact K correction (dB)"
                            note="Direct field K carry-over."
                            relevance="required"
                            usage="L'n,w, L'nT,w and L'nT,50"
                            warning={impactKSanityWarning}
                          >
                            <input
                              aria-invalid={Boolean(impactKSanityWarning)}
                              className={getTextInputClassName(Boolean(impactKSanityWarning))}
                              inputMode="decimal"
                              onChange={(event) => setImpactGuideKDb(event.target.value)}
                              placeholder="e.g. 2"
                              value={impactGuideKDb}
                            />
                          </FieldShell>

                          {standardizedImpactOutputsActive ? (
                            <FieldShell
                              advisory={`Guided sanity band ${formatGuidedSanityBand(GUIDED_INPUT_SANITY_BANDS.receivingRoomVolumeM3)}.`}
                              label="Impact room volume (m³)"
                              note="Receiving room volume for standardized impact reads."
                              relevance="required"
                              usage="L'nT,w and L'nT,50"
                              warning={impactVolumeSanityWarning}
                            >
                              <input
                                aria-invalid={Boolean(impactVolumeSanityWarning)}
                                className={getTextInputClassName(Boolean(impactVolumeSanityWarning))}
                                inputMode="decimal"
                                onChange={(event) => setImpactGuideReceivingRoomVolumeM3(event.target.value)}
                                placeholder="e.g. 42"
                                value={impactGuideReceivingRoomVolumeM3}
                              />
                            </FieldShell>
                          ) : null}
                        </ContextSubsection>
                      ) : null}
                    </ContextBucket>

                    <ContextBucket
                      description="Keep nearby for the next route upgrade."
                      hasContent={hasOptionalContextFields}
                      title="Optional now"
                      tone="optional"
                    >
                      {geometryActive && !standardizedAirborneActive ? (
                        <ContextSubsection
                          note="Room volume can wait until this route upgrades to DnT."
                          title="Airborne route"
                        >
                          <FieldShell
                            advisory={`Guided sanity band ${formatGuidedSanityBand(GUIDED_INPUT_SANITY_BANDS.receivingRoomVolumeM3)}.`}
                            label="Airborne room volume (m³)"
                            note="Keep the receiving room volume ready for DnT."
                            relevance="optional"
                            usage="DnT,w, DnT,A and floor-side L'nT,w when requested"
                            warning={airborneVolumeSanityWarning}
                          >
                            <input
                              aria-invalid={Boolean(airborneVolumeSanityWarning)}
                              className={getTextInputClassName(Boolean(airborneVolumeSanityWarning))}
                              inputMode="decimal"
                              onChange={(event) => setAirborneReceivingRoomVolumeM3(event.target.value)}
                              placeholder="e.g. 42"
                              value={airborneReceivingRoomVolumeM3}
                            />
                          </FieldShell>
                        </ContextSubsection>
                      ) : null}

                      {geometryActive && standardizedAirborneActive ? (
                        <ContextSubsection
                          note="RT60 only feeds absorption-aware sidecars."
                          title="Airborne route"
                        >
                          <FieldShell
                            advisory={`Guided sanity band ${formatGuidedSanityBand(GUIDED_INPUT_SANITY_BANDS.receivingRoomRt60S)}.`}
                            label="RT60 (s)"
                            note="Use only when absorption-aware sidecars matter."
                            relevance="optional"
                            usage="Absorption-aware field sidecars"
                            warning={rt60SanityWarning}
                          >
                            <input
                              aria-invalid={Boolean(rt60SanityWarning)}
                              className={getTextInputClassName(Boolean(rt60SanityWarning))}
                              inputMode="decimal"
                              onChange={(event) => setAirborneReceivingRoomRt60S(event.target.value)}
                              placeholder="e.g. 0.6"
                              value={airborneReceivingRoomRt60S}
                            />
                          </FieldShell>
                        </ContextSubsection>
                      ) : null}

                      {impactFieldActive && !standardizedImpactOutputsActive ? (
                        <ContextSubsection
                          note="Room volume can wait until this route upgrades to L'nT."
                          title="Impact route"
                        >
                          <FieldShell
                            advisory={`Guided sanity band ${formatGuidedSanityBand(GUIDED_INPUT_SANITY_BANDS.receivingRoomVolumeM3)}.`}
                            label="Impact room volume (m³)"
                            note="Keep the receiving room volume ready for standardized impact reads."
                            relevance="optional"
                            usage="L'nT,w and L'nT,50"
                            warning={impactVolumeSanityWarning}
                          >
                            <input
                              aria-invalid={Boolean(impactVolumeSanityWarning)}
                              className={getTextInputClassName(Boolean(impactVolumeSanityWarning))}
                              inputMode="decimal"
                              onChange={(event) => setImpactGuideReceivingRoomVolumeM3(event.target.value)}
                              placeholder="e.g. 42"
                              value={impactGuideReceivingRoomVolumeM3}
                            />
                          </FieldShell>
                        </ContextSubsection>
                      ) : null}
                    </ContextBucket>
                  </div>
                </section>
              ) : (
                <div className={`rounded border px-3 py-3 text-[0.8rem] leading-5 text-[color:var(--ink-soft)] ${workbenchSectionCardClass("route")}`}>
                  {contextNotes[0] ?? "No additional route inputs are needed for this context."}
                </div>
              )}

              <details className={`rounded border px-3 py-3 ${workbenchSectionMutedCardClass("route")}`}>
                <summary className="cursor-pointer list-none">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="text-[0.84rem] font-semibold text-[color:var(--ink)]">Tools</div>
                    <DetailTag>{selectedPreset.label}</DetailTag>
                  </div>
                </summary>

                <div className="mt-4 grid gap-4">
                  <div className={`rounded border px-3 py-3 text-[0.8rem] leading-5 text-[color:var(--ink-soft)] ${workbenchSectionMutedCardClass("route")}`}>
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="font-semibold text-[color:var(--ink)]">{selectedPreset.label}</div>
                      <GuidedFactChip>{`${rows.length} visible row${rows.length === 1 ? "" : "s"}`}</GuidedFactChip>
                    </div>
                    <p className="mt-1">{selectedPreset.summary}</p>
                    <p className="mt-1 text-[0.74rem] leading-5 text-[color:var(--ink-faint)]">{selectedPreset.note}</p>
                  </div>

                  {showTimberImpactOnlyGuidedActions ? (
                    <div className="grid gap-2">
                      {TIMBER_IMPACT_ONLY_GUIDED_ACTIONS.map((action) => (
                        <button
                          className="focus-ring flex min-w-0 flex-col items-start gap-1.5 rounded border border-[color:var(--line)] bg-[color:var(--paper)] px-3 py-3 text-left hover:bg-[color:var(--panel)]"
                          key={action.id}
                          onClick={() => appendRows(action.rows)}
                          type="button"
                        >
                          <span className="inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--ink)]">
                            <Plus className="h-4 w-4" />
                            {action.label}
                          </span>
                          <span className="text-[0.76rem] leading-5 text-[color:var(--ink-soft)]">{action.note}</span>
                        </button>
                      ))}
                    </div>
                  ) : null}

                  {showSteelBoundSupportFormActions && lightweightSteelBaseRow ? (
                    <div className="grid gap-2">
                      {STEEL_BOUND_SUPPORT_FORM_ACTIONS.map((action) => (
                        <button
                          className="focus-ring flex min-w-0 flex-col items-start gap-1.5 rounded border border-[color:var(--line)] bg-[color:var(--paper)] px-3 py-3 text-left hover:bg-[color:var(--panel)]"
                          key={action.id}
                          onClick={() => updateMaterial(lightweightSteelBaseRow.id, action.materialId)}
                          type="button"
                        >
                          <span className="inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--ink)]">
                            <Plus className="h-4 w-4" />
                            {action.label}
                          </span>
                          <span className="text-[0.76rem] leading-5 text-[color:var(--ink-soft)]">{action.note}</span>
                        </button>
                      ))}
                    </div>
                  ) : null}

                  <details className={`rounded border px-3 py-3 ${workbenchSectionMutedCardClass("route")}`}>
                    <summary className="cursor-pointer list-none">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="text-[0.82rem] font-semibold text-[color:var(--ink)]">Advanced controls</div>
                        {expertInputsActive ? <DetailTag tone="optional">Active</DetailTag> : <DetailTag>Hidden</DetailTag>}
                      </div>
                    </summary>

                    <div className="mt-4 grid gap-5">
                      <div className="grid gap-3">
                        <FieldShell
                          label="Calculator"
                          note="This selector chooses the airborne solver family."
                          relevance="optional"
                          usage="Rw, R'w, STC, C, Ctr, Dn* outputs and any airborne companion on floor studies"
                          >
                            <select
                              className="focus-ring touch-target rounded border hairline bg-[color:var(--paper)] px-3 py-2.5"
                              onChange={(event) => setCalculatorId(event.target.value as AirborneCalculatorId)}
                            value={calculatorId}
                          >
                            {CALCULATOR_OPTIONS.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                            </select>
                          </FieldShell>
                      </div>

                      {wallModifiersActive ? (
                        <div className="grid gap-3">
                          <FieldShell
                            label="Connection path"
                            note="Choose a known connection only if it is clear."
                            relevance="optional"
                            usage="Wall-family detection and airborne overlays"
                          >
                            <select
                              className="focus-ring touch-target rounded border hairline bg-[color:var(--paper)] px-3 py-2.5"
                              onChange={(event) => setAirborneConnectionType(event.target.value as AirborneConnectionType)}
                              value={airborneConnectionType}
                            >
                              {CONNECTION_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          </FieldShell>

                          <FieldShell
                            label="Stud family"
                            note="Set this only when the framing type is known."
                            relevance="optional"
                            usage="Framed-wall family matching and resilient framing penalties"
                          >
                            <select
                              className="focus-ring touch-target rounded border hairline bg-[color:var(--paper)] px-3 py-2.5"
                              onChange={(event) => setAirborneStudType(event.target.value as AirborneStudType)}
                              value={airborneStudType}
                            >
                              {STUD_TYPE_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          </FieldShell>

                          <FieldShell
                            label="Stud spacing (mm)"
                            note="Leave blank if spacing is unknown."
                            relevance="optional"
                            usage="Framed wall family matching when stud spacing is part of the evidence"
                          >
                            <input
                              className="focus-ring touch-target rounded border hairline bg-[color:var(--paper)] px-3 py-2.5"
                              inputMode="decimal"
                              onChange={(event) => setAirborneStudSpacingMm(event.target.value)}
                              value={airborneStudSpacingMm}
                            />
                          </FieldShell>

                          <FieldShell
                            label="Airtightness"
                            note="One of the main leakage penalty drivers."
                            relevance="optional"
                            usage="Field/building airborne overlays"
                          >
                            <select
                              className="focus-ring touch-target rounded border hairline bg-[color:var(--paper)] px-3 py-2.5"
                              onChange={(event) => setAirborneAirtightness(event.target.value as AirtightnessClass)}
                              value={airborneAirtightness}
                            >
                              {AIRTIGHTNESS_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          </FieldShell>

                          <FieldShell
                            label="Perimeter seal"
                            note="Expected seal quality around the element."
                            relevance="optional"
                            usage="Leakage overlay on the airborne field/building route"
                          >
                            <select
                              className="focus-ring touch-target rounded border hairline bg-[color:var(--paper)] px-3 py-2.5"
                              onChange={(event) => setAirbornePerimeterSeal(event.target.value as PerimeterSealClass)}
                              value={airbornePerimeterSeal}
                            >
                              {SEAL_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          </FieldShell>

                          <FieldShell
                            label="Penetrations"
                            note="Reflects service cut-through and opening intensity."
                            relevance="optional"
                            usage="Airborne leakage penalty on field/building reads"
                          >
                            <select
                              className="focus-ring touch-target rounded border hairline bg-[color:var(--paper)] px-3 py-2.5"
                              onChange={(event) => setAirbornePenetrationState(event.target.value as PenetrationState)}
                              value={airbornePenetrationState}
                            >
                              {PENETRATION_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          </FieldShell>

                          <FieldShell
                            label="Junction quality"
                            note="Use this when flanking quality differs from a clean build."
                            relevance="optional"
                            usage="Field flanking overlay and conservative airborne penalties"
                          >
                            <select
                              className="focus-ring touch-target rounded border hairline bg-[color:var(--paper)] px-3 py-2.5"
                              onChange={(event) => setAirborneJunctionQuality(event.target.value as JunctionQuality)}
                              value={airborneJunctionQuality}
                            >
                              {JUNCTION_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          </FieldShell>

                          <FieldShell
                            label="Electrical boxes"
                            note="Only set this when back boxes are a real concern."
                            relevance="optional"
                            usage="Wall field/building leakage penalties"
                          >
                            <select
                              className="focus-ring touch-target rounded border hairline bg-[color:var(--paper)] px-3 py-2.5"
                              onChange={(event) => setAirborneElectricalBoxes(event.target.value as ElectricalBoxState)}
                              value={airborneElectricalBoxes}
                            >
                              {ELECTRICAL_BOX_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          </FieldShell>

                          <FieldShell
                            label="Shared support track"
                            note="Use this when adjacent leaves or supports are clearly shared."
                            relevance="optional"
                            usage="Conservative flanking posture on field/building overlays"
                          >
                            <select
                              className="focus-ring touch-target rounded border hairline bg-[color:var(--paper)] px-3 py-2.5"
                              onChange={(event) => setAirborneSharedTrack(event.target.value as SharedTrackClass)}
                              value={airborneSharedTrack}
                            >
                              {TRACK_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          </FieldShell>
                        </div>
                      ) : null}
                    </div>
                  </details>
                </div>
              </details>
            </div>
          </div>
        </div>
        <div
          className={isDesktop
            ? "col-start-1 row-start-2 min-w-0 border-r border-[color:var(--line)] px-4 pb-4"
            : `stage-enter-2 min-w-0 overflow-hidden px-4 py-4 ${activeWorkspacePanel === "stack" ? "block" : "hidden"}`
          }
        >
          <div className="flex flex-col">
            <SectionLead title="Assembly" tone="assembly" />

            <div className="mt-2 flex flex-wrap items-center gap-2 text-[0.72rem] text-[color:var(--ink-faint)]">
              <span>{rows.length ? `${rows.length} rows` : "No rows"}</span>
              {rows.length ? (
                <>
                  <span className="text-[color:var(--line)]">·</span>
                  <span>{`${formatDecimal(totalThickness)} mm`}</span>
                  <span className="text-[color:var(--line)]">·</span>
                  <span>{`${liveRowCount} live / ${parkedRowCount} parked`}</span>
                  {studyMode === "floor" && missingFloorRoleCount > 0 ? (
                    <>
                      <span className="text-[color:var(--line)]">·</span>
                      <span className="text-[color:var(--warning-ink)]">{`${missingFloorRoleCount} role missing`}</span>
                    </>
                  ) : null}
                </>
              ) : null}
            </div>

            <div className="mt-4 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  aria-pressed={activeAssemblyTool === "composer"}
                  className={`focus-ring inline-flex h-8 items-center gap-1.5 rounded px-3 text-[0.8rem] font-semibold ${
                    activeAssemblyTool === "composer"
                      ? "bg-[color:var(--accent)] text-[color:var(--paper)]"
                      : "border border-[color:var(--accent)] text-[color:var(--accent-ink)] hover:bg-[color:var(--accent-soft)]"
                  }`}
                  onClick={() => setActiveAssemblyTool((current) => (current === "composer" ? null : "composer"))}
                  type="button"
                >
                  <Plus className="h-3.5 w-3.5" />
                  {activeAssemblyTool === "composer" ? "Close" : "Add layer"}
                </button>
                <button
                  aria-pressed={activeAssemblyTool === "library"}
                  className={`focus-ring inline-flex h-8 items-center gap-1.5 rounded border px-3 text-[0.8rem] font-medium ${
                    activeAssemblyTool === "library"
                      ? "border-[color:var(--accent)] bg-[color:var(--accent-soft)] text-[color:var(--accent-ink)]"
                      : "border-[color:var(--line)] text-[color:var(--ink-soft)] hover:bg-[color:var(--panel)]"
                  }`}
                  onClick={() => setActiveAssemblyTool((current) => (current === "library" ? null : "library"))}
                  type="button"
                >
                  {`Custom materials${customMaterials.length ? ` (${customMaterials.length})` : ""}`}
                </button>
                {!isDesktop ? (
                  <button
                    aria-pressed={activeAssemblyTool === "preview"}
                    className={`focus-ring inline-flex h-8 items-center gap-1.5 rounded border px-3 text-[0.8rem] font-medium ${
                      activeAssemblyTool === "preview"
                        ? "border-[color:var(--accent)] bg-[color:var(--accent-soft)] text-[color:var(--accent-ink)]"
                        : "border-[color:var(--line)] text-[color:var(--ink-soft)] hover:bg-[color:var(--panel)]"
                    }`}
                    onClick={() => setActiveAssemblyTool((current) => (current === "preview" ? null : "preview"))}
                    type="button"
                  >
                    Preview
                  </button>
                ) : null}
              </div>

              {activeAssemblyTool === "library" ? (
                <CustomMaterialComposer
                  customMaterials={customMaterials}
                  draft={customMaterialDraft}
                  errors={customMaterialErrors}
                  expanded={customMaterialExpanded}
                  onCreate={createCustomMaterial}
                  onDraftChange={(field, value) =>
                    setCustomMaterialDraft((current) => ({
                      ...current,
                      [field]: value
                    }))
                  }
                  onExpandedChange={setCustomMaterialExpanded}
                />
              ) : null}

              {activeAssemblyTool === "composer" ? (
                <NewLayerComposer
                  draft={newLayerDraft}
                  materials={materials}
                  materialGroups={newLayerMaterialGroups}
                  onAdd={appendConfiguredLayer}
                  onDensityChange={(densityKgM3) => setNewLayerDraft((current) => ({ ...current, densityKgM3 }))}
                  onDynamicStiffnessChange={(dynamicStiffnessMNm3) =>
                    setNewLayerDraft((current) => ({ ...current, dynamicStiffnessMNm3 }))
                  }
                  onFloorRoleChange={(floorRole) => setNewLayerDraft((current) => ({ ...current, floorRole }))}
                  onMaterialChange={(materialId) =>
                    setNewLayerDraft((current) => ({
                      ...current,
                      densityKgM3: "",
                      dynamicStiffnessMNm3: "",
                      floorRole: inferFloorRole(materialId, studyMode, customMaterials),
                      materialId
                    }))
                  }
                  onThicknessChange={(thicknessMm) => setNewLayerDraft((current) => ({ ...current, thicknessMm }))}
                  studyMode={studyMode}
                />
              ) : null}

              {!isDesktop && activeAssemblyTool === "preview" ? (
                <LayerStackDiagram activeRowId={activeRowId} materials={materials} result={result} rows={rows} studyMode={studyMode} />
              ) : null}

              {rows.length ? (
                <div className={`hidden items-center gap-3 rounded border px-3 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[color:var(--ink-faint)] 2xl:grid 2xl:grid-cols-[2.5rem_minmax(0,1.5fr)_7rem_10rem_auto] ${workbenchSectionMutedCardClass("assembly")}`}>
                  <span>#</span>
                  <span>Layer</span>
                  <span>Thickness</span>
                  {studyMode === "floor" ? <span>Role</span> : <span>State</span>}
                  <span className="text-right">Actions</span>
                </div>
              ) : null}

              <div className="grid min-w-0 gap-3">
                {rows.length ? (
                  rows.map((row, index) => (
                    <SimpleLayerRow
                      active={row.id === activeRowId}
                      expanded={row.id === expandedRowId}
                      index={index}
                      key={row.id}
                      materials={materials}
                      materialGroups={buildMaterialGroups(studyMode, materials, row.materialId, row.floorRole)}
                      moveFlashDirection={movedRowFlash?.rowId === row.id ? movedRowFlash.direction : undefined}
                      onActiveRowChange={setActiveRowId}
                      onExpandedChange={setExpandedRowId}
                      onDensityChange={updateDensity}
                      onDynamicStiffnessChange={updateDynamicStiffness}
                      onFloorRoleChange={updateFloorRole}
                      onMaterialChange={updateMaterial}
                      onMoveRow={moveRowWithFeedback}
                      onRemoveRow={removeRow}
                      onThicknessChange={updateThickness}
                      row={row}
                      studyMode={studyMode}
                      totalRows={rows.length}
                    />
                  ))
                ) : (
                  <div className="rounded border border-dashed border-[color:var(--line)] px-4 py-6 text-center text-sm text-[color:var(--ink-soft)]">
                    No layers yet. Use <strong className="font-semibold text-[color:var(--ink)]">Add layer</strong> or pick an example stack.
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
        {/* ── Right column on desktop: Section preview + Results ── */}
        <div
          className={isDesktop
            ? "col-start-2 row-start-1 row-span-2 min-w-0 overflow-y-auto px-4 py-4 sticky top-0 self-start max-h-screen"
            : `stage-enter-3 min-w-0 overflow-hidden px-4 py-4 ${activeWorkspacePanel === "results" ? "block" : "hidden"}`
          }
        >
          {isDesktop ? (
            <div className="mb-4">
              <LayerStackDiagram activeRowId={activeRowId} materials={materials} result={result} rows={rows} studyMode={studyMode} />
            </div>
          ) : null}
          <div className="flex flex-col">
              <div className="flex min-w-0 flex-wrap items-start justify-between gap-4">
                <SectionLead title="Results" tone="results" />
                <button
                  className={`focus-ring inline-flex items-center justify-center rounded border px-3 py-1.5 text-sm font-medium text-[color:var(--ink-soft)] ${workbenchSectionMutedCardClass("results")}`}
                onClick={() => openWorkspacePanel("review")}
                type="button"
              >
                Open details
              </button>
            </div>

              <div className="mt-4 space-y-4">
                <OutputCoverageSummary
                  boundCount={boundOutputCards.length}
                  liveCount={liveOutputCards.length}
                  parkedCount={needsInputCards.length}
                  readyCount={readyCards.length}
                  totalCount={automaticOutputs.length}
                  unsupportedCount={unsupportedCards.length}
                />

                <div className="flex flex-wrap gap-2 text-[0.72rem] leading-5 text-[color:var(--ink-soft)]">
                  <GuidedFactChip>{routeCoverageLabel}</GuidedFactChip>
                  {scenario.warnings.length ? <GuidedFactChip tone="warning">{`${scenario.warnings.length} warning${scenario.warnings.length === 1 ? "" : "s"}`}</GuidedFactChip> : null}
                </div>

                {primaryReadyCard ? (
                  <>
                    <PrimaryResultCard
                    card={primaryReadyCard}
                    collapsedLiveRowCount={collapsedLiveRowCount}
                    contextLabel={getEnvironmentLabel(airborneContextMode)}
                    heroHeadline={heroHeadline}
                    liveRowCount={liveRowCount}
                    parkedRowCount={parkedRowCount}
                    solverLayerCount={solverLayerCount}
                    studyMode={studyMode}
                    validationSummary={validationSummary}
                  />

                  {secondaryReadyCards.length ? (
                    <details className={`rounded border px-3 py-3 ${workbenchSectionMutedCardClass("results")}`}>
                      <summary className="cursor-pointer list-none">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div className="text-sm font-semibold text-[color:var(--ink)]">Supporting metrics</div>
                          <div className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">
                            {secondaryReadyCards.length} companion values
                          </div>
                        </div>
                      </summary>
                      <div className="mt-3 grid gap-2">
                        {secondaryReadyCards.map((card) => (
                          <OutputCard card={card} key={`ready-${card.label}`} />
                        ))}
                      </div>
                    </details>
                  ) : null}
                </>
              ) : (
                <div className={`rounded border border-dashed px-4 py-5 text-sm leading-6 text-[color:var(--ink-soft)] ${workbenchSectionMutedCardClass("results")}`}>
                  Build a valid stack to populate the result cards.
                </div>
              )}

              <OutputUnlockRail groups={outputUnlockGroups} />

              {scenario.warnings.length ? (
                <details className="rounded border border-[color:var(--warning)] bg-[color:var(--warning-soft)] px-4 py-3 text-[color:var(--warning-ink)]">
                  <summary className="cursor-pointer list-none">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="font-semibold">Check these inputs before trusting the read.</div>
                      <GuidedFactChip tone="warning">{`${scenario.warnings.length} warning${scenario.warnings.length === 1 ? "" : "s"}`}</GuidedFactChip>
                    </div>
                  </summary>
                  <div className="mt-3 grid gap-2 text-sm leading-6">
                    {scenario.warnings.slice(0, 3).map((warning) => (
                      <div key={warning}>{warning}</div>
                    ))}
                    {scenario.warnings.length > 3 ? <div>{`+${scenario.warnings.length - 3} more warning${scenario.warnings.length - 3 === 1 ? "" : "s"} in diagnostics.`}</div> : null}
                  </div>
                </details>
              ) : null}

              {needsInputCards.length ? (
                <details className="rounded border border-[color:var(--line)] bg-[color:var(--paper)] px-3 py-3">
                  <summary className="cursor-pointer list-none">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="text-sm font-semibold text-[color:var(--ink)]">Parked by current route</div>
                      <DetailTag>{`${needsInputCards.length} parked`}</DetailTag>
                    </div>
                  </summary>
                  <div className="mt-3 grid gap-3">
                    {needsInputCards.map((card) => (
                      <PendingOutputRow card={card} key={`pending-route-${card.label}`} />
                    ))}
                  </div>
                </details>
              ) : null}

              {unsupportedCards.length ? (
                <details className="rounded border border-[color:var(--line)] bg-[color:var(--paper)] px-3 py-3">
                  <summary className="cursor-pointer list-none">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="text-sm font-semibold text-[color:var(--ink)]">Unsupported on this lane</div>
                      <DetailTag>{`${unsupportedCards.length} unsupported`}</DetailTag>
                    </div>
                  </summary>
                  <div className="mt-3 grid gap-3">
                    {unsupportedCards.map((card) => (
                      <PendingOutputRow card={card} key={`pending-unsupported-${card.label}`} />
                    ))}
                  </div>
                </details>
              ) : null}

              <div className={`rounded border px-3 py-3 ${workbenchSectionMutedCardClass("review")}`}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="text-sm font-semibold text-[color:var(--ink)]">Open detail deck</div>
                  <DetailTag>{activeReviewTabConfig.label}</DetailTag>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {REVIEW_TABS.map((tab) => (
                    <button
                      className={`focus-ring inline-flex items-center justify-center rounded border px-3 py-2 text-sm font-semibold ${
                        activeReviewTab === tab.id
                          ? "border-[color:var(--accent)] bg-[color:var(--accent-soft)] text-[color:var(--ink)]"
                          : "border-[color:var(--line)] bg-[color:var(--paper)] text-[color:var(--ink-soft)]"
                      }`}
                      key={`result-review-${tab.id}`}
                      onClick={() => openReviewTab(tab.id)}
                      type="button"
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {reviewExpanded ? (
        <section className={`${isDesktop || activeWorkspacePanel === "review" ? "grid" : "hidden"} gap-4 px-4 py-4`} id="guided-review-deck">
        <div className="border-b border-[color:var(--line)] pb-4">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <h2 className="text-sm font-semibold text-[color:var(--ink)]">Review</h2>
            <div className="flex gap-3 text-[0.72rem] font-medium text-[color:var(--ink-faint)]">
              <div>{`${proposalMetrics.length} live metric${proposalMetrics.length === 1 ? "" : "s"}`}</div>
              <div>{`${proposalLayers.length} visible row${proposalLayers.length === 1 ? "" : "s"}`}</div>
              <div>{scenario.warnings.length > 0 ? `${scenario.warnings.length} warning${scenario.warnings.length === 1 ? "" : "s"}` : "No live warnings"}</div>
            </div>
          </div>

          <div
            aria-label="Guided review sections"
            className="mt-4 flex flex-wrap gap-2"
            role="tablist"
          >
            {REVIEW_TABS.map((tab) => (
              <ReviewTabButton
                active={tab.id === activeReviewTab}
                controlsId={`guided-review-panel-${tab.id}`}
                id={tab.id}
                key={tab.id}
                label={tab.label}
                onSelect={selectReviewTab}
              />
            ))}
          </div>

          <div className="mt-3 flex items-center justify-end">
            <button
              className="focus-ring inline-flex items-center justify-center rounded border border-[color:var(--line)] px-2.5 py-1.5 text-[0.8rem] font-medium text-[color:var(--ink-soft)] hover:bg-[color:var(--panel)]"
              onClick={closeReviewPanel}
              type="button"
            >
              Hide review
            </button>
          </div>
        </div>

        {reviewExpanded && rows.length > 0 ? (
          <GuidedDecisionBasisStrip
            activeReviewTab={activeReviewTab}
            cards={corridorDossier.cards}
            headline={corridorDossier.headline}
            onOpenReviewTab={openReviewTab}
            selectedTraceNoteCount={selectedTraceNoteCount}
            traceGroupCount={methodDossier.traceGroups.length}
          />
        ) : null}

        {reviewExpanded && proposalLayers.length > 0 ? (
          <GuidedConstructionSnapshot
            activeReviewTab={activeReviewTab}
            layers={proposalLayers}
            onOpenReviewTab={openReviewTab}
            studyModeLabel={getStudyModeLabel(studyMode)}
          />
        ) : null}

        {reviewExpanded && activeReviewTab === "method" ? (
          <div
            aria-labelledby="guided-review-tab-method"
            id={activeReviewPanelId}
            role="tabpanel"
          >
            <SimpleWorkbenchMethodPanel
              assumptionItems={methodAssumptionItems}
              branchDetail={dynamicCalcBranch.detail}
              branchLabel={dynamicCalcBranch.value}
              citations={proposalEvidence.citations}
              coverageItems={proposalCoverageItems}
              contextLabel={getEnvironmentLabel(airborneContextMode)}
              layers={proposalLayers}
              readyMetrics={methodReadyMetrics}
              result={scenario.result}
              stackDetail={methodStackDetail}
              studyMode={studyMode}
              studyModeLabel={getStudyModeLabel(studyMode)}
              unlocks={methodUnlocks}
              validationDetail={validationSummary.detail}
              validationLabel={validationSummary.value}
              warnings={scenario.warnings}
            />
          </div>
        ) : null}

        {reviewExpanded && activeReviewTab === "diagnostics" ? (
          <div
            aria-labelledby="guided-review-tab-diagnostics"
            id={activeReviewPanelId}
            role="tabpanel"
          >
            <SimpleWorkbenchDiagnosticsPanel
              branchLabel={dynamicCalcBranch.value}
              citations={proposalEvidence.citations}
              decisionTrailHeadline={proposalEvidence.decisionTrailHeadline}
              decisionTrailItems={proposalEvidence.decisionTrailItems}
              layers={proposalLayers}
              result={result}
              studyMode={studyMode}
              studyModeLabel={getStudyModeLabel(studyMode)}
              traceGroups={methodDossier.traceGroups}
              validationDetail={validationSummary.detail}
              validationLabel={validationSummary.value}
              warnings={scenario.warnings}
            />
          </div>
        ) : null}

        {reviewExpanded && activeReviewTab === "proposal" ? (
          <div
            aria-labelledby="guided-review-tab-proposal"
            id={activeReviewPanelId}
            role="tabpanel"
          >
            <SimpleWorkbenchProposalPanel
              assemblyHeadline={heroHeadline}
              briefNote={briefNote}
              clientName={clientName}
              consultantAddress={consultantAddress}
              citations={proposalEvidence.citations}
              consultantCompany={consultantCompany}
              consultantEmail={consultantEmail}
              consultantLogoDataUrl={consultantLogoDataUrl}
              consultantPhone={consultantPhone}
              consultantWordmarkLine={consultantWordmarkLine}
              contextLabel={getEnvironmentLabel(airborneContextMode)}
              coverageItems={proposalCoverageItems}
              corridorDossierCards={corridorDossier.cards}
              corridorDossierHeadline={corridorDossier.headline}
              decisionTrailHeadline={proposalEvidence.decisionTrailHeadline}
              decisionTrailItems={proposalEvidence.decisionTrailItems}
              dynamicBranchDetail={dynamicCalcBranch.detail}
              dynamicBranchLabel={dynamicCalcBranch.value}
              issuedOnLabel={proposalIssuedOnLabel}
              issuedOnIso={proposalIssuedOnIso}
              layers={proposalLayers}
              metrics={proposalMetrics}
              methodDossierCards={methodDossier.cards}
              methodDossierHeadline={methodDossier.headline}
              methodTraceGroups={methodDossier.traceGroups}
              onApproverTitleChange={setApproverTitle}
              onBriefNoteChange={setBriefNote}
              onClientNameChange={setClientName}
              onConsultantAddressChange={setConsultantAddress}
              onConsultantCompanyChange={setConsultantCompany}
              onConsultantEmailChange={setConsultantEmail}
              onConsultantLogoDataUrlChange={setConsultantLogoDataUrl}
              onConsultantPhoneChange={setConsultantPhone}
              onConsultantWordmarkLineChange={setConsultantWordmarkLine}
              onPreparedByChange={setPreparedBy}
              onIssueCodePrefixChange={setProposalIssueCodePrefix}
              onProposalAttentionChange={setProposalAttention}
              onProposalIssuePurposeChange={setProposalIssuePurpose}
              onProposalRecipientChange={setProposalRecipient}
              onProjectNameChange={setProjectName}
              onProposalReferenceChange={setProposalReference}
              onProposalRevisionChange={setProposalRevision}
              onProposalSubjectChange={setProposalSubject}
              onProposalValidityNoteChange={setProposalValidityNote}
              onReportProfileChange={setReportProfile}
              approverTitle={approverTitle}
              preparedBy={preparedBy}
              issueCodePrefix={proposalIssueCodePrefix}
              proposalAttention={proposalAttention}
              proposalIssuePurpose={proposalIssuePurpose}
              proposalRecipient={proposalRecipient}
              projectName={projectName}
              proposalReference={proposalReference}
              proposalRevision={proposalRevision}
              proposalSubject={proposalSubject}
              proposalValidityNote={proposalValidityNote}
              reportProfile={reportProfile}
              reportProfileLabel={REPORT_PROFILE_LABELS[reportProfile]}
              result={result}
              studyModeLabel={getStudyModeLabel(studyMode)}
              studyContextLabel={STUDY_CONTEXT_LABELS[studyContext]}
              validationDetail={validationSummary.detail}
              validationLabel={validationSummary.value}
              validationTone={validationSummary.tone}
              warnings={scenario.warnings}
            />
          </div>
        ) : null}
        </section>
      ) : null}
    </div>
  );
}
