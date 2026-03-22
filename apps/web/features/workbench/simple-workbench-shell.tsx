"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { MATERIAL_CATALOG_SEED } from "@dynecho/catalogs";
import { Command } from "cmdk";
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
  MaterialDefinition,
  PenetrationState,
  PerimeterSealClass,
  RequestedOutputId,
  SharedTrackClass
} from "@dynecho/shared";
import { SurfacePanel } from "@dynecho/ui";
import { ArrowDown, ArrowUp, Check, ChevronRight, ChevronsUpDown, Layers3, Plus, RotateCcw, Search } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";

import { formatDecimal } from "@/lib/format";

import { describeAssembly, getMaterialCategoryLabel } from "./describe-assembly";
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
import { normalizeRows } from "./normalize-rows";
import { evaluateScenario } from "./scenario-analysis";
import { buildSimpleWorkbenchEvidencePacket } from "./simple-workbench-evidence";
import { buildSimpleWorkbenchMethodDossier } from "./simple-workbench-method-dossier";
import { SimpleWorkbenchMethodPanel } from "./simple-workbench-method-panel";
import { SimpleWorkbenchProposalPanel } from "./simple-workbench-proposal-panel";
import { isSteelBoundSupportFormLane } from "./steel-bound-support-form-lane";
import {
  FLOOR_ROLE_LABELS,
  REPORT_PROFILE_LABELS,
  REQUESTED_OUTPUT_LABELS,
  REQUESTED_OUTPUT_SUPPORT_NOTES,
  STUDY_CONTEXT_LABELS
} from "./workbench-data";
import { getPresetById, type PresetId, type StudyMode } from "./preset-definitions";
import type { LayerDraft } from "./workbench-store";
import { useWorkbenchStore } from "./workbench-store";

type MaterialIdGroup = {
  ids: readonly string[];
  label: string;
};

type MaterialOptionGroup = {
  label: string;
  materials: readonly MaterialDefinition[];
};

type ControlOption<T extends string> = {
  label: string;
  note: string;
  value: T;
};

type OutputCardModel = {
  detail: string;
  label: string;
  output: RequestedOutputId;
  status: "bound" | "live" | "needs_input" | "unsupported";
  value: string;
};

type GuidedTopologyAction = {
  id: string;
  label: string;
  note: string;
  rows: ReadonlyArray<{ floorRole?: FloorRole; materialId: string; thicknessMm: string }>;
};

type FieldRelevanceTone = "optional" | "required";
type ReviewTabId = "diagnostics" | "method" | "proposal";

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

const MODE_QUICK_PICK_IDS: Record<StudyMode, readonly string[]> = {
  floor: [
    "ceramic_tile",
    "laminate_flooring",
    "vinyl_flooring",
    "screed",
    "generic_resilient_underlay",
    "mw_t_impact_layer",
    "clt_panel",
    "concrete",
    "hollow_core_plank"
  ],
  wall: ["gypsum_board", "acoustic_gypsum_board", "rockwool", "air_gap", "concrete", "clt_panel"]
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
      ids: ["screed", "bonded_chippings", "non_bonded_chippings", "elastic_bonded_fill", "generic_fill", "inex_floor_panel"],
      label: "Build-up and deck"
    },
    {
      ids: [
        "concrete",
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
        "glasswool",
        "air_gap",
        "resilient_channel",
        "ubiq_resilient_ceiling",
        "genieclip_rst",
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
        "cement_plaster",
        "dense_plaster",
        "lightweight_plaster",
        "lime_cement_plaster_1300",
        "lime_cement_plaster_1700",
        "lime_cement_plaster_1780",
        "skim_plaster",
        "celcon_lwt_plaster",
        "celcon_dense_plaster"
      ],
      label: "Board and plaster finish"
    },
    {
      ids: [
        "concrete",
        "clt_panel",
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
      ids: ["rockwool", "glasswool", "air_gap", "resilient_support", "resilient_channel", "furring_channel"],
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

function defaultThicknessFor(material: MaterialDefinition): string {
  switch (material.id) {
    case "gypsum_board":
      return "12.5";
    case "rockwool":
      return "50";
    case "air_gap":
      return "50";
    case "concrete":
      return "150";
    case "clt_panel":
      return "140";
    case "hollow_core_plank":
      return "200";
    case "ceramic_tile":
      return "8";
    case "laminate_flooring":
      return "8";
    case "vinyl_flooring":
      return "4";
    case "screed":
      return "50";
    case "generic_resilient_underlay":
      return "8";
    case "mw_t_impact_layer":
      return "30";
    default:
      switch (material.category) {
        case "finish":
          return "12";
        case "gap":
          return "50";
        case "insulation":
          return "50";
        case "support":
          return "10";
        case "mass":
        default:
          return "100";
      }
  }
}

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
  selectedMaterialId: string
): MaterialOptionGroup[] {
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
  if (!includedIds.has(selectedMaterialId)) {
    const selectedMaterial = materialById.get(selectedMaterialId);
    if (selectedMaterial) {
      groups.unshift({
        label: "Current row material",
        materials: [selectedMaterial]
      });
    }
  }

  return groups.map((group) => ({
    label: group.label,
    materials: uniqueMaterialsById(group.materials)
  }));
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

function getRowActivityCounts(rows: readonly LayerDraft[]): {
  collapsedLiveRowCount: number;
  liveRowCount: number;
  parkedRowCount: number;
  solverLayerCount: number;
} {
  const liveRowCount = countValidThicknessRows(rows);
  const solverLayerCount = normalizeRows(rows).layers.length;

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
      return "border-[color:color-mix(in_oklab,var(--accent)_28%,transparent)]";
    case "insulation":
      return "border-[color:color-mix(in_oklab,var(--success)_30%,transparent)]";
    case "gap":
      return "border-[color:color-mix(in_oklab,var(--ink)_12%,transparent)]";
    case "support":
      return "border-[color:color-mix(in_oklab,var(--warning)_30%,transparent)]";
    case "mass":
    default:
      return "border-[color:color-mix(in_oklab,var(--ink)_18%,transparent)]";
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
}): OutputCardModel {
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
      return "border-[color:color-mix(in_oklch,var(--warning)_34%,var(--line))] bg-[color:color-mix(in_oklch,var(--warning)_12%,var(--paper))]";
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

function SectionLead(props: { description?: string; step?: string; title: string }) {
  const { description, step, title } = props;

  return (
    <div className="min-w-0">
      {step ? <div className="eyebrow">{step}</div> : null}
      <h2 className="mt-1 font-display text-[1.3rem] leading-none tracking-[-0.03em] text-[color:var(--ink)]">{title}</h2>
      {description ? <p className="mt-1.5 max-w-2xl text-sm leading-6 text-[color:var(--ink-soft)]">{description}</p> : null}
    </div>
  );
}

function WorkflowStage(props: { index: string; note: string; title: string }) {
  const { index, note, title } = props;

  return (
    <article className="workflow-stage rounded-[1.35rem] border hairline px-4 py-4">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border hairline bg-[color:var(--paper)]/88 text-[0.72rem] font-semibold tracking-[0.14em] text-[color:var(--ink)]">
          {index}
        </span>
        <div className="min-w-0">
          <div className="text-sm font-semibold text-[color:var(--ink)]">{title}</div>
          <p className="mt-1 text-sm leading-6 text-[color:var(--ink-soft)]">{note}</p>
        </div>
      </div>
    </article>
  );
}

function StudyLedgerRow(props: { detail: string; label: string; value: string }) {
  const { detail, label, value } = props;

  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-4 border-b hairline py-3 last:border-b-0 last:pb-0 first:pt-0">
      <div className="min-w-0">
        <div className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[color:var(--ink-faint)]">{label}</div>
        <p className="mt-1 text-sm leading-6 text-[color:var(--ink-soft)]">{detail}</p>
      </div>
      <div className="text-right">
        <div className="font-display text-[1.5rem] leading-none tracking-[-0.04em] text-[color:var(--ink)]">{value}</div>
      </div>
    </div>
  );
}

function GuidedRouteRow(props: { detail: string; label: string; value: string }) {
  const { detail, label, value } = props;

  return (
    <div className="grid gap-2 border-b hairline py-3 last:border-b-0 last:pb-0 first:pt-0 sm:grid-cols-[minmax(0,10rem)_minmax(0,1fr)] sm:gap-4">
      <div>
        <div className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[color:var(--ink-faint)]">{label}</div>
        <div className="mt-1 text-sm font-semibold text-[color:var(--ink)]">{value}</div>
      </div>
      <div className="min-w-0">
        <p className="text-sm leading-6 text-[color:var(--ink-soft)]">{detail}</p>
      </div>
    </div>
  );
}

function RouteSignalCard(props: {
  detail: string;
  label: string;
  tone?: "neutral" | "ready" | "warning";
  value: string;
}) {
  const { detail, label, tone = "neutral", value } = props;
  const containerClass =
    tone === "ready"
      ? "border-[color:color-mix(in_oklch,var(--success)_34%,var(--line))] bg-[color:color-mix(in_oklch,var(--success)_10%,var(--paper))]"
      : tone === "warning"
        ? "border-[color:color-mix(in_oklch,var(--warning)_34%,var(--line))] bg-[color:color-mix(in_oklch,var(--warning)_12%,var(--paper))]"
        : "hairline bg-[color:var(--paper)]/82";
  const valueClass =
    tone === "ready"
      ? "text-[color:var(--success-ink)]"
      : tone === "warning"
        ? "text-[color:var(--warning-ink)]"
        : "text-[color:var(--ink)]";
  const toneLabel = tone === "warning" ? "Action" : "Route";

  return (
    <article className={`grid gap-2 rounded-[1rem] border px-3 py-3 ${containerClass}`}>
      <div className="flex items-center justify-between gap-3">
        <div className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">{label}</div>
        {tone === "ready" ? (
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border hairline bg-[color:var(--paper)]/82 text-[color:var(--success-ink)]">
            <Check className="h-3.5 w-3.5" />
          </span>
        ) : (
          <DetailTag tone={tone === "warning" ? "required" : "neutral"}>{toneLabel}</DetailTag>
        )}
      </div>
      <div className={`text-sm font-semibold ${valueClass}`}>{value}</div>
      <p className="text-sm leading-6 text-[color:var(--ink-soft)]">{detail}</p>
    </article>
  );
}

function GuidedDecisionBasisCard(props: SimpleWorkbenchCorridorDossierCard) {
  const { detail, label, tone, value } = props;
  const containerClass =
    tone === "success"
      ? "border-[color:color-mix(in_oklch,var(--success)_34%,var(--line))] bg-[color:color-mix(in_oklch,var(--success)_10%,var(--paper))]"
      : tone === "warning"
        ? "border-[color:color-mix(in_oklch,var(--warning)_34%,var(--line))] bg-[color:color-mix(in_oklch,var(--warning)_12%,var(--paper))]"
        : tone === "accent"
          ? "border-[color:color-mix(in_oklch,var(--accent)_30%,var(--line))] bg-[color:color-mix(in_oklch,var(--accent)_10%,var(--paper))]"
          : "hairline bg-[color:var(--paper)]/82";
  const valueClass =
    tone === "success"
      ? "text-[color:var(--success-ink)]"
      : tone === "warning"
        ? "text-[color:var(--warning-ink)]"
        : tone === "accent"
          ? "text-[color:var(--accent-ink)]"
          : "text-[color:var(--ink)]";
  const toneLabel =
    tone === "success" ? "Locked" : tone === "warning" ? "Caution" : tone === "accent" ? "Live" : "Explicit";

  return (
    <article className={`grid gap-2 rounded-[1rem] border px-3 py-3 ${containerClass}`}>
      <div className="flex items-center justify-between gap-3">
        <div className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">{label}</div>
        <DetailTag tone={tone === "warning" ? "required" : tone === "accent" ? "optional" : "neutral"}>{toneLabel}</DetailTag>
      </div>
      <div className={`text-sm font-semibold ${valueClass}`}>{value}</div>
      <p className="text-sm leading-6 text-[color:var(--ink-soft)]">{detail}</p>
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
    <section className="mt-6 overflow-hidden rounded-[1.35rem] border hairline bg-[color:color-mix(in_oklch,var(--accent)_8%,var(--paper))] px-4 py-4">
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.06fr)_auto] xl:items-start">
        <div className="min-w-0">
          <div className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[color:var(--ink-faint)]">Decision basis</div>
          <h3 className="mt-2 font-display text-[1.45rem] leading-none tracking-[-0.04em] text-[color:var(--ink)]">
            Validation corridor at a glance
          </h3>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[color:var(--ink-soft)]">{headline}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <GuidedFactChip>{`${traceGroupCount} trace group${traceGroupCount === 1 ? "" : "s"}`}</GuidedFactChip>
            <GuidedFactChip>{`${selectedTraceNoteCount} selected route note${selectedTraceNoteCount === 1 ? "" : "s"}`}</GuidedFactChip>
            <GuidedFactChip>{`Review deck: ${activeReviewTabLabel}`}</GuidedFactChip>
          </div>
        </div>

        <div className="grid gap-2 sm:grid-cols-3 xl:grid-cols-1 xl:justify-items-end">
          {REVIEW_TABS.map((tab) => (
            <button
              aria-pressed={activeReviewTab === tab.id}
              className={`focus-ring inline-flex items-center justify-center rounded-full border px-3 py-2 text-sm font-semibold ${
                activeReviewTab === tab.id
                  ? "border-[color:color-mix(in_oklch,var(--accent)_34%,var(--line))] bg-[color:color-mix(in_oklch,var(--accent)_14%,var(--paper))] text-[color:var(--accent-ink)]"
                  : "hairline bg-[color:var(--paper)]/82 text-[color:var(--ink-soft)] hover:bg-black/[0.03]"
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

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {cards.map((card) => (
          <GuidedDecisionBasisCard {...card} key={`decision-basis-${card.label}-${card.value}`} />
        ))}
      </div>

      <p className="mt-4 max-w-3xl text-sm leading-6 text-[color:var(--ink-soft)]">
        The same selected route notes stay aligned across method detail, diagnostics, and the client-facing PDF appendix.
      </p>
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
        <p className="mt-1 text-sm leading-6 text-[color:var(--ink-soft)]">{note}</p>
      </div>
      {children}
    </label>
  );
}

function GuidedFactChip(props: { children: ReactNode; tone?: "neutral" | "warning" }) {
  const { children, tone = "neutral" } = props;
  const toneClass =
    tone === "warning"
      ? "border-[color:color-mix(in_oklch,var(--warning)_34%,var(--line))] bg-[color:color-mix(in_oklch,var(--warning)_12%,var(--paper))] text-[color:var(--warning-ink)]"
      : "hairline bg-[color:var(--paper)]/82 text-[color:var(--ink-soft)]";

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[0.72rem] font-medium ${toneClass}`}>
      {children}
    </span>
  );
}

function DetailTag(props: { children: ReactNode; tone?: "neutral" | FieldRelevanceTone }) {
  const { children, tone = "neutral" } = props;
  const toneClass =
    tone === "required"
      ? "border border-[color:color-mix(in_oklch,var(--warning)_34%,var(--line))] bg-[color:color-mix(in_oklch,var(--warning)_14%,var(--paper))] text-[color:var(--warning-ink)]"
      : tone === "optional"
        ? "border border-[color:color-mix(in_oklch,var(--accent)_26%,var(--line))] bg-[color:color-mix(in_oklch,var(--accent)_10%,var(--paper))] text-[color:var(--accent-ink)]"
        : "border hairline bg-[color:var(--paper)]/72 text-[color:var(--ink-soft)]";

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.16em] ${toneClass}`}>
      {children}
    </span>
  );
}

function InlinePair(props: { label: string; value: string }) {
  const { label, value } = props;

  return (
    <div className="grid gap-1 rounded-[1rem] border hairline bg-[color:var(--paper)]/72 px-3 py-3">
      <div className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">{label}</div>
      <div className="text-sm font-semibold text-[color:var(--ink)]">{value}</div>
    </div>
  );
}

function formatMaterialDensity(material: MaterialDefinition): string | null {
  if (!(material.densityKgM3 > 0)) {
    return null;
  }

  return `${material.densityKgM3.toLocaleString("en-US")} kg/m³`;
}

function compactValues(values: Array<string | null | undefined>): string[] {
  return values.filter((value): value is string => Boolean(value && value.trim().length > 0));
}

function getTextInputClassName(hasWarning = false): string {
  return `focus-ring touch-target w-full min-w-0 rounded-[1rem] border px-3 py-3 ${
    hasWarning
      ? "border-[color:var(--warning-ink)]/34 bg-[color:var(--warning-soft)]/48"
      : "hairline bg-[color:var(--paper)]"
  }`;
}

function buildMaterialFacts(material: MaterialDefinition, thicknessMm: string): string[] {
  const facts: string[] = [];
  const density = formatMaterialDensity(material);
  const thickness = parsePositiveNumber(thicknessMm);

  if (density) {
    facts.push(density);
  }

  if (density && thickness && thickness > 0) {
    facts.push(`${formatDecimal((material.densityKgM3 * thickness) / 1000)} kg/m² at this layer`);
  }

  if (typeof material.impact?.dynamicStiffnessMNm3 === "number" && material.impact.dynamicStiffnessMNm3 > 0) {
    facts.push(`${formatDecimal(material.impact.dynamicStiffnessMNm3)} MN/m³ dynamic stiffness`);
  }

  return facts;
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
  const { advisory, children, label, note, relevance = "optional", usage, warning } = props;
  const relevanceLabel = relevance === "required" ? "Required now" : "Optional now";
  const relevanceNote =
    relevance === "required" ? `Needed now for ${usage}.` : `Used when ${usage}.`;

  return (
    <div className="grid min-w-0 gap-2" title={`${note} Used for: ${usage}`}>
      <div className="flex min-w-0 items-start justify-between gap-3">
        <div className="min-w-0">
          <span className="text-sm font-medium text-[color:var(--ink)]">{label}</span>
          <p className="mt-1 text-xs leading-5 text-[color:var(--ink-faint)]">{note}</p>
          <p className="mt-1 text-[0.72rem] leading-5 text-[color:var(--ink-soft)]">{relevanceNote}</p>
          {advisory ? <p className="mt-1 text-[0.72rem] leading-5 text-[color:var(--ink-soft)]">{advisory}</p> : null}
          {warning ? <p className="mt-1 text-[0.72rem] leading-5 text-[color:var(--warning-ink)]">{warning}</p> : null}
        </div>
        <DetailTag tone={relevance}>{relevanceLabel}</DetailTag>
      </div>
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
      ? "border-[color:color-mix(in_oklch,var(--warning)_24%,var(--line))] bg-[color:color-mix(in_oklch,var(--warning)_8%,var(--paper))]"
      : "hairline bg-[color:var(--paper)]/72";

  return (
    <section className={`rounded-[1.2rem] border px-4 py-4 ${shellClass}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-[color:var(--ink)]">{title}</div>
          <p className="mt-1 text-sm leading-6 text-[color:var(--ink-soft)]">{description}</p>
        </div>
        <DetailTag tone={tone}>{title}</DetailTag>
      </div>

      {hasContent ? (
        <div className="mt-4 grid gap-4">{children}</div>
      ) : (
        <div className="mt-4 rounded-[1rem] border border-dashed hairline bg-black/[0.02] px-4 py-3 text-sm leading-6 text-[color:var(--ink-soft)]">
          No parked fields on this route.
        </div>
      )}
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
    <div className="grid gap-3 rounded-[1rem] border hairline bg-[color:var(--paper)]/74 px-4 py-4">
      <div>
        <div className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">{title}</div>
        <p className="mt-1 text-sm leading-6 text-[color:var(--ink-soft)]">{note}</p>
      </div>
      <div className="grid gap-3">{children}</div>
    </div>
  );
}

function StackOrderPanel(props: {
  rows: readonly LayerDraft[];
  studyMode: StudyMode;
}) {
  const { rows, studyMode } = props;
  const boundary = getStackBoundaryLabels(studyMode);
  const orderNarrative =
    studyMode === "floor"
      ? "Solver order follows the list exactly, from walking side to ceiling side."
      : "Solver order follows the list exactly, from Side A to Side B.";

  return (
    <section className="rounded-[1.25rem] border hairline bg-[color:var(--paper)]/72 px-4 py-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-[color:var(--ink)]">Stack order</div>
          <p className="mt-1 text-sm leading-6 text-[color:var(--ink-soft)]">{orderNarrative}</p>
        </div>
        <DetailTag>{rows.length ? `${rows.length} visible row${rows.length === 1 ? "" : "s"}` : "Waiting for rows"}</DetailTag>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,11rem)_minmax(0,1fr)_minmax(0,11rem)] lg:items-center">
        <div className="grid gap-1 rounded-[1rem] border hairline bg-[color:var(--paper)]/82 px-3 py-3">
          <div className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">Row 1</div>
          <div className="text-sm font-semibold text-[color:var(--ink)]">{boundary.start}</div>
        </div>

        <div className="flex min-w-0 items-center gap-3 text-sm leading-6 text-[color:var(--ink-soft)]">
          <span className="h-px flex-1 bg-[color:color-mix(in_oklch,var(--line)_82%,transparent)]" />
          <span className="min-w-0 text-center">{rows.length ? "Move rows only when the physical build-up changes." : "Start from the exposed side of the assembly."}</span>
          <span className="h-px flex-1 bg-[color:color-mix(in_oklch,var(--line)_82%,transparent)]" />
        </div>

        <div className="grid gap-1 rounded-[1rem] border hairline bg-[color:var(--paper)]/82 px-3 py-3">
          <div className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">Last row</div>
          <div className="text-sm font-semibold text-[color:var(--ink)]">{boundary.end}</div>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <GuidedFactChip>Blank thickness rows stay parked until they are valid.</GuidedFactChip>
        <GuidedFactChip>Adjacent identical live rows collapse into one solver layer.</GuidedFactChip>
        <GuidedFactChip>{studyMode === "floor" ? "Floor roles sharpen exact family matching." : "Wall rows are read straight across the partition."}</GuidedFactChip>
      </div>
    </section>
  );
}

function LayerPositionRail(props: {
  index: number;
  studyMode: StudyMode;
  totalRows: number;
}) {
  const { index, studyMode, totalRows } = props;
  const boundary = getStackBoundaryLabels(studyMode);
  const edgeLabel = getStackEdgeLabel(studyMode, index, totalRows);
  const progress = totalRows <= 1 ? 50 : (index / Math.max(totalRows - 1, 1)) * 100;
  const positionLabel = totalRows <= 1 ? "Only row" : edgeLabel ?? "Interior row";

  return (
    <div className="rounded-[1rem] border hairline bg-[color:var(--paper)]/74 px-3 py-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">
          {`Preview row ${index + 1} of ${totalRows}`}
        </div>
        <DetailTag>{positionLabel}</DetailTag>
      </div>

      <div className="mt-3 grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-[color:var(--ink-faint)]">
        <span>{boundary.start}</span>
        <div className="relative h-2 rounded-full bg-[color:color-mix(in_oklch,var(--line)_82%,transparent)]">
          <span className="absolute inset-0 rounded-full bg-[linear-gradient(90deg,rgba(17,57,52,0.12),rgba(17,57,52,0.03))]" />
          <span
            className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border hairline bg-[color:var(--paper)] shadow-[0_8px_18px_-12px_rgba(18,34,34,0.4)]"
            style={{ left: `${progress}%` }}
          >
            <span className="absolute inset-[3px] rounded-full bg-[color:var(--ink)]" />
          </span>
        </div>
        <span className="text-right">{boundary.end}</span>
      </div>

      <p className="mt-2 text-[0.78rem] leading-5 text-[color:var(--ink-soft)]">
        {`${getLayerPositionNarrative(studyMode, index, totalRows)} Editor row numbers match the section preview.`}
      </p>
    </div>
  );
}

function MaterialPickerField(props: {
  material: MaterialDefinition;
  materialGroups: readonly MaterialOptionGroup[];
  onSelect: (materialId: string) => void;
  thicknessMm: string;
}) {
  const { material, materialGroups, onSelect, thicknessMm } = props;
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!open) {
      setSearch("");
    }
  }, [open]);

  const selectedGroup =
    materialGroups.find((group) => group.materials.some((entry) => entry.id === material.id))?.label ?? getMaterialCategoryLabel(material);
  const selectedFacts = buildMaterialFacts(material, thicknessMm);

  return (
    <div className="grid min-w-0 gap-2">
      <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--ink-faint)]">Material</span>

      <button
        className="focus-ring flex min-w-0 items-center justify-between gap-3 rounded-[1rem] border hairline bg-[color:var(--paper)] px-3 py-3 text-left"
        onClick={() => setOpen(true)}
        type="button"
      >
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-semibold text-[color:var(--ink)]">{material.name}</div>
          <div className="mt-1 truncate text-xs text-[color:var(--ink-soft)]">
            {compactValues([selectedGroup, selectedFacts[0]]).join(" · ")}
          </div>
        </div>
        <ChevronsUpDown className="h-4 w-4 shrink-0 text-[color:var(--ink-faint)]" />
      </button>

      <Command.Dialog label="Select material" loop onOpenChange={setOpen} open={open}>
        <Dialog.Title className="sr-only">Select material</Dialog.Title>
        <Dialog.Description className="sr-only">
          Search and choose a catalog material for the active layer.
        </Dialog.Description>

        <div className="command-shell">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b hairline px-4 py-4">
            <div>
              <div className="eyebrow">Material picker</div>
              <div className="mt-1 font-display text-[1.3rem] leading-none tracking-[-0.03em] text-[color:var(--ink)]">
                Choose a layer material
              </div>
            </div>
            <DetailTag>{selectedGroup}</DetailTag>
          </div>

          <div className="flex items-center gap-3 border-b hairline px-4 py-3">
            <Search className="h-4 w-4 text-[color:var(--ink-faint)]" />
            <Command.Input
              className="w-full bg-transparent text-sm text-[color:var(--ink)] outline-none placeholder:text-[color:var(--ink-faint)]"
              onValueChange={setSearch}
              placeholder="Search material, category, or density..."
              value={search}
            />
          </div>

          <Command.List className="max-h-[26rem] overflow-y-auto px-3 py-3">
            <Command.Empty className="px-3 py-8 text-center text-sm text-[color:var(--ink-soft)]">
              No matching material.
            </Command.Empty>

            {materialGroups.map((group) => (
              <Command.Group heading={group.label} key={group.label}>
                {group.materials.map((entry) => {
                  const isSelected = entry.id === material.id;
                  const facts = buildMaterialFacts(entry, thicknessMm);
                  const keywords = compactValues([
                    group.label,
                    getMaterialCategoryLabel(entry),
                    formatMaterialDensity(entry),
                    entry.name
                  ]);

                  return (
                    <Command.Item
                      key={entry.id}
                      keywords={keywords}
                      onSelect={() => {
                        onSelect(entry.id);
                        setOpen(false);
                      }}
                      value={[entry.name, ...keywords].join(" ")}
                    >
                      <div className={`h-10 w-2 shrink-0 rounded-full border ${layerFillClass(entry)} ${layerStrokeClass(entry)}`} />
                      <div className="min-w-0 flex-1">
                        <div className="flex min-w-0 flex-wrap items-center gap-2">
                          <span className="truncate font-semibold">{entry.name}</span>
                          {isSelected ? <DetailTag>Current</DetailTag> : null}
                        </div>
                        <div className="mt-1 flex min-w-0 flex-wrap gap-1.5 text-[0.72rem] leading-5 text-[color:var(--ink-soft)]">
                          <span>{group.label}</span>
                          {facts.slice(0, 2).map((fact) => (
                            <span key={fact}>{fact}</span>
                          ))}
                        </div>
                      </div>
                      {isSelected ? <Check className="h-4 w-4 shrink-0 text-[color:var(--accent-ink)]" /> : null}
                    </Command.Item>
                  );
                })}
              </Command.Group>
            ))}
          </Command.List>
        </div>
      </Command.Dialog>
    </div>
  );
}

function OutputCard(props: { card: OutputCardModel }) {
  const { card } = props;

  return (
    <article
      className={`min-w-0 rounded-[1.25rem] border px-4 py-4 ${outputStatusClass(card.status)}`}
      title={card.detail}
    >
      <div className="flex min-w-0 items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[color:var(--ink-faint)]">{card.label}</div>
          <div className="mt-3 text-[1.9rem] font-display leading-none tracking-[-0.05em] text-[color:var(--ink)]">{card.value}</div>
        </div>
        <span className={`text-[0.72rem] font-semibold uppercase tracking-[0.16em] ${outputStatusTextClass(card.status)}`}>
          {statusLabel(card.status)}
        </span>
      </div>
      <p className="mt-4 text-sm leading-6 text-[color:var(--ink-soft)]">{card.detail}</p>
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
    <div className="grid gap-3 rounded-[1.25rem] border hairline bg-[color:var(--paper)]/72 px-4 py-4 sm:grid-cols-3">
      <div>
        <div className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">Ready now</div>
        <div className="mt-2 text-lg font-semibold text-[color:var(--ink)]">{`${readyCount}/${totalCount}`}</div>
        <p className="mt-1 text-sm leading-6 text-[color:var(--ink-soft)]">
          {boundCount > 0
            ? `${liveCount} live output${liveCount === 1 ? "" : "s"} and ${boundCount} bound support output${boundCount === 1 ? "" : "s"} are currently readable.`
            : `${liveCount} live output${liveCount === 1 ? "" : "s"} are currently readable on this route.`}
        </p>
      </div>
      <div>
        <div className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">Parked by route</div>
        <div className="mt-2 text-lg font-semibold text-[color:var(--ink)]">{parkedCount}</div>
        <p className="mt-1 text-sm leading-6 text-[color:var(--ink-soft)]">
          {parkedCount > 0
            ? "These outputs belong to a nearby route or still need context inputs."
            : "No route-dependent outputs are parked right now."}
        </p>
      </div>
      <div>
        <div className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">Unsupported on lane</div>
        <div className="mt-2 text-lg font-semibold text-[color:var(--ink)]">{unsupportedCount}</div>
        <p className="mt-1 text-sm leading-6 text-[color:var(--ink-soft)]">
          {unsupportedCount > 0
            ? "These outputs stay explicit, but the current topology cannot defend them."
            : "No outputs are currently outside the supported lane."}
        </p>
      </div>
    </div>
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
    <div className="mt-5 rounded-[1.25rem] border hairline bg-[color:var(--paper)]/72 px-4 py-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-[color:var(--ink)]">Unlock parked outputs</div>
          <p className="mt-1 text-sm leading-6 text-[color:var(--ink-soft)]">
            The route is close. These are the next concrete inputs or evidence upgrades that will unlock the parked metrics.
          </p>
        </div>
        <div className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[color:var(--ink-faint)]">
          {formatCountLabel(groups.length, "next step")}
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {groups.map((group) => (
          <article
            className="rounded-[1.15rem] border hairline bg-[color:color-mix(in_oklch,var(--warning)_8%,var(--paper))] px-4 py-4"
            key={`unlock-${group.title}`}
          >
            <div className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--warning-ink)]">Next unlock</div>
            <div className="mt-2 text-base font-semibold text-[color:var(--ink)]">{group.title}</div>
            <p className="mt-2 text-sm leading-6 text-[color:var(--ink-soft)]">{group.detail}</p>
            <div className="mt-3 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">Unlocks</div>
            <div className="mt-2 text-sm leading-6 text-[color:var(--ink)]">{formatUnlockOutputs(group.outputs)}</div>
          </article>
        ))}
      </div>
    </div>
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

  return (
    <article className={`result-hero min-w-0 overflow-hidden rounded-[1.65rem] border px-5 py-5 ${outputStatusClass(card.status)}`}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="eyebrow">{studyMode === "floor" ? "Primary floor read" : "Primary wall read"}</div>
          <h3 className="mt-2 max-w-xl font-display text-[1.65rem] leading-none tracking-[-0.05em] text-[color:var(--ink)]">
            {heroHeadline}
          </h3>
        </div>
        <DetailTag>{contextLabel}</DetailTag>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-[minmax(0,1fr)_14rem] md:items-end">
        <div className="min-w-0">
          <div className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[color:var(--ink-faint)]">{card.label}</div>
          <div className="mt-3 font-display text-[clamp(3rem,7vw,5.5rem)] leading-[0.88] tracking-[-0.07em] text-[color:var(--ink)]">
            {card.value}
          </div>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[color:var(--ink-soft)]">{card.detail}</p>
        </div>

        <div className="grid gap-3 rounded-[1.25rem] border hairline bg-[color:var(--paper)]/68 p-4">
          <div className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[color:var(--ink-faint)]">State</div>
          <div className={`text-sm font-semibold uppercase tracking-[0.14em] ${outputStatusTextClass(card.status)}`}>{statusLabel(card.status)}</div>
          <div className="text-sm leading-6 text-[color:var(--ink-soft)]">
            {studyMode === "floor"
              ? "This is the most decision-shaping floor metric available from the current stack."
              : "This is the lead airborne metric available from the current wall stack."}
          </div>
          <div className="border-t hairline pt-3">
            <div className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[color:var(--ink-faint)]">Live stack basis</div>
            <div className="mt-2 text-sm font-semibold text-[color:var(--ink)]">{liveStackValue}</div>
            <div className="mt-1 text-sm leading-6 text-[color:var(--ink-soft)]">{liveStackDetail}</div>
          </div>
          <div className="border-t hairline pt-3">
            <div className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[color:var(--ink-faint)]">Read posture</div>
            <div className={`mt-2 text-sm font-semibold ${validationValueClass}`}>{validationSummary.value}</div>
            <div className="mt-1 text-sm leading-6 text-[color:var(--ink-soft)]">{validationSummary.detail}</div>
          </div>
        </div>
      </div>
    </article>
  );
}

function PendingOutputRow(props: { card: OutputCardModel }) {
  const { card } = props;

  return (
    <article className="rounded-[1.15rem] border hairline bg-[color:color-mix(in_oklch,var(--paper)_82%,transparent)] px-4 py-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm font-semibold text-[color:var(--ink)]">{card.label}</div>
        <span className={`text-[0.72rem] font-semibold uppercase tracking-[0.16em] ${outputStatusTextClass(card.status)}`}>
          {statusLabel(card.status)}
        </span>
      </div>
      <p className="mt-2 text-sm leading-6 text-[color:var(--ink-soft)]">{card.detail}</p>
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
        <div>
          <div className="text-sm font-semibold text-[color:var(--ink)]">{title}</div>
          <p className="mt-1 text-sm leading-6 text-[color:var(--ink-soft)]">{detail}</p>
        </div>
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
  const facts = buildMaterialFacts(material, row.thicknessMm);

  return (
    <article
      className={`rounded-[1.1rem] border px-3 py-3 shadow-[0_10px_20px_-20px_rgba(18,34,34,0.3)] ${
        active
          ? "border-[color:color-mix(in_oklch,var(--accent)_34%,var(--line))] bg-[color:color-mix(in_oklch,var(--accent)_10%,var(--paper))]"
          : ready
            ? "hairline bg-[color:var(--paper)]/76"
            : "border-[color:color-mix(in_oklch,var(--warning)_28%,var(--line))] bg-[color:color-mix(in_oklch,var(--warning)_10%,var(--paper))]"
      }`}
      data-active={active ? "true" : "false"}
      data-ready={ready ? "true" : "false"}
      data-testid={`legend-row-${index + 1}`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm font-semibold ${layerFillClass(material)} ${layerStrokeClass(material)}`}
        >
          {index + 1}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <div className="truncate text-sm font-semibold text-[color:var(--ink)]">{material.name}</div>
            <DetailTag>{row.thicknessMm || "?"} mm</DetailTag>
            <DetailTag tone={ready ? "neutral" : "required"}>{ready ? "Live row" : "Parked"}</DetailTag>
            {studyMode === "floor" && row.floorRole ? <DetailTag>{FLOOR_ROLE_LABELS[row.floorRole]}</DetailTag> : null}
          </div>
          <div className="mt-1 text-[0.72rem] uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">
            {getMaterialCategoryLabel(material)}
          </div>
          {facts.length ? (
            <p className="mt-2 text-sm leading-6 text-[color:var(--ink-soft)]">{facts.slice(0, 2).join(" · ")}</p>
          ) : null}
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

  return (
    <div className="section-figure rounded-[1.5rem] border hairline bg-[color:var(--paper)]/84 px-4 py-4">
      <div className="flex items-center justify-between text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[color:var(--ink-faint)]">
        <span>Walking side</span>
        <span>{rows.length} layers</span>
      </div>

      <div className="mt-4 flex min-h-[18rem] flex-col overflow-hidden rounded-[1.25rem] border hairline bg-[linear-gradient(180deg,rgba(255,255,255,0.54),rgba(255,255,255,0.12))]">
        {rows.map(({ material, row }, index) => {
          const thickness = parsePositiveNumber(row.thicknessMm) ?? 10;
          const active = row.id === activeRowId;
          const ready = isThicknessReady(row.thicknessMm);
          return (
            <div
              className={`relative flex min-h-10 items-center justify-between gap-3 border-b px-3 py-3 last:border-b-0 ${layerFillClass(material)} ${
                active
                  ? "border-[color:color-mix(in_oklch,var(--accent)_34%,var(--line))] shadow-[inset_0_0_0_1px_color-mix(in_oklch,var(--accent)_26%,transparent)]"
                  : ready
                    ? "hairline"
                    : "border-[color:color-mix(in_oklch,var(--warning)_28%,var(--line))] opacity-75"
              }`}
              data-active={active ? "true" : "false"}
              data-ready={ready ? "true" : "false"}
              data-testid={`preview-row-${index + 1}`}
              key={row.id}
              style={{ flexBasis: 0, flexGrow: Math.max(thickness, 10) }}
              title={`${material.name} · ${row.thicknessMm || "?"} mm`}
            >
              <div className="flex min-w-0 items-center gap-2">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border hairline bg-[color:var(--paper)]/76 text-[0.72rem] font-semibold text-[color:var(--ink)]">
                  {index + 1}
                </div>
                <div className="truncate text-sm font-semibold text-[color:var(--ink)]">{material.name}</div>
              </div>
              <div className="shrink-0 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-[color:var(--ink-soft)]">
                {ready ? `${row.thicknessMm} mm` : "Parked"}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-between text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[color:var(--ink-faint)]">
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

  return (
    <div className="section-figure rounded-[1.5rem] border hairline bg-[color:var(--paper)]/84 px-4 py-4">
      <div className="flex items-center justify-between text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[color:var(--ink-faint)]">
        <span>Side A</span>
        <span>{rows.length} layers</span>
      </div>

      <div className="mt-4 overflow-hidden rounded-[1.25rem] border hairline bg-[linear-gradient(180deg,rgba(255,255,255,0.54),rgba(255,255,255,0.12))]">
        <div className="flex min-h-[14rem]">
          {rows.map(({ material, row }, index) => {
            const thickness = parsePositiveNumber(row.thicknessMm) ?? 10;
            const active = row.id === activeRowId;
            const ready = isThicknessReady(row.thicknessMm);
            return (
              <div
                className={`flex min-w-0 basis-0 flex-col justify-between border-r px-2 py-3 last:border-r-0 ${layerFillClass(material)} ${
                  active
                    ? "border-[color:color-mix(in_oklch,var(--accent)_34%,var(--line))] shadow-[inset_0_0_0_1px_color-mix(in_oklch,var(--accent)_26%,transparent)]"
                    : ready
                      ? "hairline"
                      : "border-[color:color-mix(in_oklch,var(--warning)_28%,var(--line))] opacity-75"
                }`}
                data-active={active ? "true" : "false"}
                data-ready={ready ? "true" : "false"}
                data-testid={`preview-row-${index + 1}`}
                key={row.id}
                style={{ flexGrow: Math.max(thickness, 10) }}
                title={`${material.name} · ${row.thicknessMm || "?"} mm`}
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full border hairline bg-[color:var(--paper)]/76 text-[0.72rem] font-semibold text-[color:var(--ink)]">
                  {index + 1}
                </div>
                <div className="min-w-0">
                  <div className="truncate text-[0.72rem] font-semibold text-[color:var(--ink)]">{material.name}</div>
                  <div className="mt-1 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[color:var(--ink-soft)]">
                    {ready ? `${row.thicknessMm} mm` : "Parked"}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[color:var(--ink-faint)]">
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
  const { collapsedLiveRowCount, liveRowCount, parkedRowCount, solverLayerCount } = getRowActivityCounts(rows);
  const resolved = rows.map((row) => ({
    material: materials.find((entry) => entry.id === row.materialId) ?? materials[0]!,
    row
  }));

  return (
    <section className="atelier-panel min-w-0 overflow-hidden rounded-[1.75rem] border hairline">
      <div className="border-b hairline px-5 py-5">
        <div className="eyebrow">Section preview</div>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
          <div className="min-w-0">
            <h2 className="font-display text-[1.5rem] leading-none tracking-[-0.04em] text-[color:var(--ink)]">
              {studyMode === "floor" ? "Layered floor build-up" : "Layered wall build-up"}
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-[color:var(--ink-soft)]">
              {studyMode === "floor"
                ? "Read from the walking side down to the ceiling side."
                : "Read from Side A across to Side B."}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <GuidedFactChip>Editor row numbers match preview row numbers.</GuidedFactChip>
              <GuidedFactChip>{studyMode === "floor" ? "Row 1 starts on the walking side." : "Row 1 starts on Side A."}</GuidedFactChip>
              <GuidedFactChip>{activeRowId ? "Focused editor row is spotlighted here." : "Hover or focus a row to spotlight it here."}</GuidedFactChip>
              <GuidedFactChip>{rows.length ? formatCountLabel(liveRowCount, "live row") : "No live rows yet"}</GuidedFactChip>
              <GuidedFactChip tone={collapsedLiveRowCount > 0 ? "warning" : "neutral"}>
                {rows.length
                  ? `${solverLayerCount} solver layer${solverLayerCount === 1 ? "" : "s"}`
                  : "No solver layers yet"}
              </GuidedFactChip>
              <GuidedFactChip tone={parkedRowCount > 0 ? "warning" : "neutral"}>
                {parkedRowCount > 0 ? formatCountLabel(parkedRowCount, "parked row") : "No parked rows"}
              </GuidedFactChip>
            </div>
          </div>
          <div className="grid gap-1 text-right text-sm text-[color:var(--ink-soft)]">
            <span>{rows.length ? `${rows.length} editor rows` : "No layers yet"}</span>
            <span>{rows.length ? `${solverLayerCount} solver layers` : "Solver layers pending"}</span>
            <span>{totalThickness > 0 ? `${formatDecimal(totalThickness)} mm total thickness` : "Thickness pending"}</span>
            <span>{result ? `${formatDecimal(result.metrics.surfaceMassKgM2)} kg/m² surface mass` : "Surface mass pending"}</span>
          </div>
        </div>
      </div>

      {rows.length ? (
        <div className="grid gap-5 p-5 xl:grid-cols-[minmax(0,1.05fr)_minmax(18rem,0.95fr)]">
          <div>{studyMode === "floor" ? <FloorStackFigure activeRowId={activeRowId} rows={resolved} /> : <WallStackFigure activeRowId={activeRowId} rows={resolved} />}</div>
          <div className="grid gap-2.5">
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
      ) : (
        <div className="px-5 py-6">
          <div className="rounded-[1.25rem] border border-dashed hairline px-4 py-6 text-sm leading-6 text-[color:var(--ink-soft)]">
            Add layers in physical order to generate the section preview and live stack metrics.
          </div>
        </div>
      )}
    </section>
  );
}

function SimpleLayerRow(props: {
  active: boolean;
  index: number;
  materialGroups: readonly MaterialOptionGroup[];
  onActiveRowChange: (rowId: string | null) => void;
  onFloorRoleChange: (id: string, floorRole?: FloorRole) => void;
  onMaterialChange: (id: string, materialId: string) => void;
  onMoveRow: (id: string, direction: "up" | "down") => void;
  onRemoveRow: (id: string) => void;
  onThicknessChange: (id: string, thicknessMm: string) => void;
  row: LayerDraft;
  studyMode: StudyMode;
  totalRows: number;
}) {
  const { active, index, materialGroups, onActiveRowChange, onFloorRoleChange, onMaterialChange, onMoveRow, onRemoveRow, onThicknessChange, row, studyMode, totalRows } = props;

  const materials = uniqueMaterialsById(materialGroups.flatMap((group) => group.materials));
  const material = materials.find((entry) => entry.id === row.materialId) ?? materials[0]!;
  const edgeLabel = getStackEdgeLabel(studyMode, index, totalRows);
  const canMoveUp = index > 0;
  const canMoveDown = index < totalRows - 1;
  const materialFacts = buildMaterialFacts(material, row.thicknessMm);
  const thicknessReady = isThicknessReady(row.thicknessMm);
  const thicknessGuidanceHint = getLayerThicknessGuidanceHint(row);
  const thicknessSanityWarning = getLayerThicknessSanityWarning(row, index + 1);
  const floorRoleNote =
    studyMode !== "floor"
      ? null
      : row.floorRole
        ? null
        : "Assign a floor role when this row should participate in exact floor matching.";

  return (
    <article
      className={`min-w-0 rounded-[1.15rem] border bg-[color:var(--panel)]/90 px-3 py-3 shadow-[0_18px_32px_-32px_rgba(20,37,36,0.42)] sm:px-4 ${
        active
          ? "border-[color:color-mix(in_oklch,var(--accent)_34%,var(--line))] shadow-[0_20px_40px_-34px_rgba(20,37,36,0.42),inset_0_0_0_1px_color-mix(in_oklch,var(--accent)_22%,transparent)]"
          : thicknessReady
            ? "hairline"
            : "border-[color:color-mix(in_oklch,var(--warning)_28%,var(--line))] bg-[color:color-mix(in_oklch,var(--warning)_8%,var(--panel))]"
      }`}
      data-active={active ? "true" : "false"}
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
      <div className="flex min-w-0 items-start gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border hairline bg-[color:var(--panel-strong)] text-sm font-semibold text-[color:var(--ink)]">
          {index + 1}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <div className="truncate text-[0.98rem] font-semibold text-[color:var(--ink)]">{material.name}</div>
            {edgeLabel ? <DetailTag>{edgeLabel}</DetailTag> : null}
            <DetailTag tone={thicknessReady ? "neutral" : "required"}>{thicknessReady ? "Live row" : "Parked"}</DetailTag>
            {studyMode === "floor" && row.floorRole ? <DetailTag>{FLOOR_ROLE_LABELS[row.floorRole]}</DetailTag> : null}
          </div>
          <div className="mt-1 text-[0.68rem] uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">
            {getMaterialCategoryLabel(material)}
          </div>
          {floorRoleNote ? <p className="mt-2 text-[0.78rem] leading-5 text-[color:var(--ink-soft)]">{floorRoleNote}</p> : null}
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <button
            aria-label={`Move layer ${index + 1} up`}
            className="focus-ring inline-flex h-8 w-8 items-center justify-center rounded-full border hairline text-[color:var(--ink-soft)] enabled:hover:bg-black/[0.04] disabled:cursor-not-allowed disabled:opacity-35"
            disabled={!canMoveUp}
            onClick={() => onMoveRow(row.id, "up")}
            type="button"
          >
            <ArrowUp className="h-4 w-4" />
          </button>
          <button
            aria-label={`Move layer ${index + 1} down`}
            className="focus-ring inline-flex h-8 w-8 items-center justify-center rounded-full border hairline text-[color:var(--ink-soft)] enabled:hover:bg-black/[0.04] disabled:cursor-not-allowed disabled:opacity-35"
            disabled={!canMoveDown}
            onClick={() => onMoveRow(row.id, "down")}
            type="button"
          >
            <ArrowDown className="h-4 w-4" />
          </button>
          <button
            className="focus-ring rounded-full px-2.5 py-1.5 text-sm font-medium text-[color:var(--ink-soft)] hover:bg-black/[0.03]"
            onClick={() => onRemoveRow(row.id)}
            type="button"
          >
            Remove
          </button>
        </div>
      </div>

      <div
        className={`mt-3 grid min-w-0 items-end gap-3 ${
          studyMode === "floor" ? "sm:grid-cols-[minmax(0,1fr)_7rem_minmax(10rem,12rem)]" : "sm:grid-cols-[minmax(0,1fr)_7rem]"
        }`}
      >
        <MaterialPickerField
          material={material}
          materialGroups={materialGroups}
          onSelect={(materialId) => onMaterialChange(row.id, materialId)}
          thicknessMm={row.thicknessMm}
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
          {thicknessGuidanceHint ? (
            <p className="text-[0.72rem] leading-5 text-[color:var(--ink-soft)]">{thicknessGuidanceHint}</p>
          ) : null}
          {thicknessSanityWarning ? (
            <p className="text-[0.72rem] leading-5 text-[color:var(--warning-ink)]">{thicknessSanityWarning}</p>
          ) : null}
        </label>

        {studyMode === "floor" ? (
          <label className="grid min-w-0 gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--ink-faint)]">Floor role</span>
            <select
              className="focus-ring touch-target w-full min-w-0 rounded-[1rem] border hairline bg-[color:var(--paper)] px-3 py-3"
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

      <div className="mt-3">
        <LayerPositionRail index={index} studyMode={studyMode} totalRows={totalRows} />
      </div>

      {materialFacts.length ? (
        <div className="mt-3 flex min-w-0 flex-wrap gap-2">
          {materialFacts.map((fact) => (
            <span
              className="rounded-full border hairline px-2.5 py-1 text-[0.72rem] font-medium text-[color:var(--ink-soft)]"
              key={fact}
            >
              {fact}
            </span>
          ))}
        </div>
      ) : null}
    </article>
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
      className={`focus-ring inline-flex items-center rounded-full border px-3 py-2 text-sm font-semibold transition ${
        active
          ? "border-[color:color-mix(in_oklch,var(--accent)_28%,var(--line))] bg-[color:color-mix(in_oklch,var(--accent)_14%,var(--paper))] text-[color:var(--ink)]"
          : "hairline bg-[color:var(--paper)]/74 text-[color:var(--ink-soft)] hover:bg-black/[0.03]"
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
  const briefNote = useWorkbenchStore((state) => state.briefNote);
  const clientName = useWorkbenchStore((state) => state.clientName);
  const consultantAddress = useWorkbenchStore((state) => state.consultantAddress);
  const consultantCompany = useWorkbenchStore((state) => state.consultantCompany);
  const consultantEmail = useWorkbenchStore((state) => state.consultantEmail);
  const consultantLogoDataUrl = useWorkbenchStore((state) => state.consultantLogoDataUrl);
  const consultantPhone = useWorkbenchStore((state) => state.consultantPhone);
  const consultantWordmarkLine = useWorkbenchStore((state) => state.consultantWordmarkLine);
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

  const addRow = useWorkbenchStore((state) => state.addRow);
  const appendMaterial = useWorkbenchStore((state) => state.appendMaterial);
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
  const updateFloorRole = useWorkbenchStore((state) => state.updateFloorRole);
  const updateMaterial = useWorkbenchStore((state) => state.updateMaterial);
  const updateThickness = useWorkbenchStore((state) => state.updateThickness);

  const materials = MATERIAL_CATALOG_SEED;
  const quickPickMaterials = MODE_QUICK_PICK_IDS[studyMode]
    .map((materialId) => materials.find((entry) => entry.id === materialId) ?? null)
    .filter((entry): entry is MaterialDefinition => entry !== null);
  const modePresets = MODE_PRESETS[studyMode].map((presetId) => getPresetById(presetId));
  const automaticOutputs = getAutomaticOutputs(studyMode, airborneContextMode);
  const totalThickness = sumThickness(rows);
  const { collapsedLiveRowCount, liveRowCount, parkedRowCount, solverLayerCount } = getRowActivityCounts(rows);
  const [selectedPresetId, setSelectedPresetId] = useState<PresetId>(modePresets[0]?.id ?? MODE_PRESETS[studyMode][0]!);
  const [quickAddMaterialId, setQuickAddMaterialId] = useState<string>(quickPickMaterials[0]?.id ?? MODE_QUICK_PICK_IDS[studyMode][0]!);
  const [activeRowId, setActiveRowId] = useState<string | null>(null);
  const [activeReviewTab, setActiveReviewTab] = useState<ReviewTabId>("proposal");

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
    const fallbackMaterialId = quickPickMaterials[0]?.id ?? MODE_QUICK_PICK_IDS[studyMode][0]!;
    if (!quickPickMaterials.some((material) => material.id === quickAddMaterialId)) {
      setQuickAddMaterialId(fallbackMaterialId);
    }
  }, [quickAddMaterialId, quickPickMaterials, studyMode]);

  useEffect(() => {
    if (activeRowId && !rows.some((row) => row.id === activeRowId)) {
      setActiveRowId(null);
    }
  }, [activeRowId, rows]);

  const selectedPreset = modePresets.find((preset) => preset.id === selectedPresetId) ?? modePresets[0]!;
  const selectedQuickAddMaterial =
    quickPickMaterials.find((material) => material.id === quickAddMaterialId) ?? quickPickMaterials[0]!;
  const selectedContextOption =
    AIRBORNE_CONTEXT_OPTIONS.find((option) => option.value === airborneContextMode) ?? AIRBORNE_CONTEXT_OPTIONS[0]!;
  const selectedStudyModeNote =
    studyMode === "floor"
      ? "Use this when the assembly includes coverings, resilient layers, screeds, slabs, or suspended ceiling packages."
      : "Use this when the calculator should read airborne separation across a wall or partition assembly.";

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

  const outputCards = automaticOutputs.map((output) => buildOutputCard({ output, result, studyMode }));
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
    scenario.warnings.length > 0 ? `${scenario.warnings.length} warning${scenario.warnings.length === 1 ? "" : "s"}` : "No active warnings";
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
    status: card.status,
    value: card.value
  }));
  const proposalLayers = rows.map((row, index) => {
    const material = materials.find((entry) => entry.id === row.materialId);

    return {
      categoryLabel: material ? getMaterialCategoryLabel(material) : "Uncatalogued layer",
      index: index + 1,
      label: material?.name ?? row.materialId,
      roleLabel: studyMode === "floor" && row.floorRole ? FLOOR_ROLE_LABELS[row.floorRole] : undefined,
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
  const activeReviewTabConfig = REVIEW_TABS.find((tab) => tab.id === activeReviewTab) ?? REVIEW_TABS[0]!;
  const activeReviewPanelId = `guided-review-panel-${activeReviewTab}`;
  const openReviewTab = (tabId: ReviewTabId) => {
    setActiveReviewTab(tabId);
    requestAnimationFrame(() => {
      document.getElementById("guided-review-deck")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  return (
    <div className="grid min-w-0 gap-6">
      <section className="atelier-panel grain-mask stage-enter overflow-hidden rounded-[2rem] border hairline px-5 py-6 sm:px-7 sm:py-7">
        <div className="grid gap-8 xl:grid-cols-[minmax(0,1.15fr)_minmax(20rem,0.85fr)] xl:items-end">
          <div className="min-w-0">
            <div className="eyebrow">Guided Acoustic Calculator</div>
            <h1 className="mt-3 max-w-4xl font-display text-[clamp(2.35rem,4.5vw,4.4rem)] leading-[0.92] tracking-[-0.05em] text-[color:var(--ink)]">
              Build the assembly first. The calculator shows the outputs it can actually defend.
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-[color:var(--ink-soft)] sm:text-[1rem]">
              Start with <span className="font-semibold text-[color:var(--ink)]">floor</span> or{" "}
              <span className="font-semibold text-[color:var(--ink)]">wall</span>, choose the project context, then enter the layer
              stack. Result cards update from the current inputs instead of asking you to manage expert output switches first.
            </p>

            <div className="mt-6 grid gap-3 md:grid-cols-3">
              <WorkflowStage index="01" note="Choose whether the assembly is a floor or a wall." title="Set the surface" />
              <WorkflowStage index="02" note="Tell the calculator if the read is lab-side, room-to-room, or building-side." title="Frame the context" />
              <WorkflowStage index="03" note="Enter the layers in order and let the engine expose only supportable metrics." title="Build and read" />
            </div>
          </div>

          <aside className="rounded-[1.7rem] border hairline bg-[color:var(--paper)]/68 p-5 shadow-[0_24px_44px_-34px_rgba(20,36,35,0.32)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="eyebrow">Current study</div>
                <div className="mt-2 font-display text-[1.3rem] leading-none tracking-[-0.04em] text-[color:var(--ink)]">
                  Live calculation ledger
                </div>
              </div>
              <DetailTag>{readyOutputCount} ready</DetailTag>
            </div>

            <div className="mt-5 grid gap-0">
              <StudyLedgerRow detail="Current assembly type" label="Surface" value={getStudyModeLabel(studyMode)} />
              <StudyLedgerRow detail="How the result should be interpreted" label="Context" value={getEnvironmentLabel(airborneContextMode)} />
              <StudyLedgerRow
                detail={totalThickness > 0 ? `${formatDecimal(totalThickness)} mm total thickness` : "No stack entered yet"}
                label="Layer stack"
                value={`${rows.length}`}
              />
              <StudyLedgerRow
                detail={automaticOutputs.map((output) => REQUESTED_OUTPUT_LABELS[output]).join(" · ")}
                label="Outputs ready"
                value={`${readyOutputCount}/${automaticOutputs.length}`}
              />
            </div>
          </aside>
        </div>
      </section>

      <section className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(22rem,0.95fr)]">
        <div className="grid min-w-0 gap-6">
          <SurfacePanel className="stage-enter-2 min-w-0 overflow-hidden px-5 py-6 sm:px-6">
            <div className="flex min-w-0 flex-wrap items-start justify-between gap-4">
              <SectionLead
                description="Keep the decision path linear: choose the surface, set the project context, and only then expose extra technical inputs."
                step="01 / 02"
                title="Set the study"
              />
              <button
                className="focus-ring inline-flex items-center gap-2 rounded-full border hairline px-3 py-2 text-sm font-semibold text-[color:var(--ink-soft)] hover:bg-black/[0.03]"
                onClick={() => reset()}
                type="button"
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </button>
            </div>

            <div className="mt-6 grid gap-6">
              <div className="grid gap-4 xl:grid-cols-[minmax(0,19rem)_minmax(0,1fr)]">
                <div className="grid gap-4 rounded-[1.45rem] border hairline bg-[color:var(--paper)]/72 p-4">
                  <GuidedSelectField
                    label="Surface type"
                    note="Start by telling the calculator whether the assembly is a floor build-up or a wall partition."
                  >
                    <select
                      aria-label="Surface type"
                      className="focus-ring touch-target w-full min-w-0 rounded-[1rem] border hairline bg-[color:var(--paper)] px-3 py-3"
                      onChange={(event) => startStudyMode(event.target.value as StudyMode)}
                      value={studyMode}
                    >
                      <option value="floor">Floor</option>
                      <option value="wall">Wall</option>
                    </select>
                  </GuidedSelectField>

                  <GuidedSelectField
                    label="Project context"
                    note="Choose the interpretation route before you touch the stack, so only relevant inputs and outputs appear."
                  >
                    <select
                      aria-label="Project context"
                      className="focus-ring touch-target w-full min-w-0 rounded-[1rem] border hairline bg-[color:var(--paper)] px-3 py-3"
                      onChange={(event) => setAirborneContextMode(event.target.value as AirborneContextMode)}
                      value={airborneContextMode}
                    >
                      {AIRBORNE_CONTEXT_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </GuidedSelectField>

                  <div className="flex flex-wrap gap-2">
                    <GuidedFactChip>{REQUESTED_OUTPUT_LABELS[automaticOutputs[0]!]}</GuidedFactChip>
                    {automaticOutputs.length > 1 ? (
                      <GuidedFactChip>{`${automaticOutputs.length - 1} more auto outputs`}</GuidedFactChip>
                    ) : null}
                    <GuidedFactChip tone={scenario.warnings.length ? "warning" : "neutral"}>{routeCoverageLabel}</GuidedFactChip>
                  </div>
                </div>

                <div className="rounded-[1.45rem] border hairline bg-[color:var(--paper)]/72 p-4 sm:p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold text-[color:var(--ink)]">Current route</div>
                      <p className="mt-1 text-sm leading-6 text-[color:var(--ink-soft)]">
                        The guided shell keeps this route explicit, then reveals only the context inputs and outputs that belong to it.
                      </p>
                    </div>
                    <DetailTag>{selectedContextOption.label}</DetailTag>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <InlinePair label="Surface" value={getStudyModeLabel(studyMode)} />
                    <InlinePair label="Context" value={selectedContextOption.label} />
                  </div>

                  <div className="mt-4 grid gap-0">
                    <GuidedRouteRow
                      detail={selectedStudyModeNote}
                      label="Assembly lane"
                      value={getStudyModeLabel(studyMode)}
                    />
                    <GuidedRouteRow
                      detail={selectedContextOption.note}
                      label="Context meaning"
                      value={selectedContextOption.label}
                    />
                    <GuidedRouteRow
                      detail={automaticOutputs.map((output) => REQUESTED_OUTPUT_LABELS[output]).join(" · ")}
                      label="Auto outputs"
                      value={`${readyOutputCount}/${automaticOutputs.length} ready`}
                    />
                    <GuidedRouteRow
                      detail={routeReadinessDetail}
                      label="Stack readiness"
                      value={rows.length ? `${rows.length} rows` : "Waiting"}
                    />
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
                    <RouteSignalCard
                      detail={routeSignals.stackStatus.detail}
                      label="Stack status"
                      tone={routeSignals.stackStatus.tone}
                      value={routeSignals.stackStatus.value}
                    />
                    <RouteSignalCard
                      detail={routeSignals.primaryRead.detail}
                      label="Primary read"
                      tone={routeSignals.primaryRead.tone}
                      value={routeSignals.primaryRead.value}
                    />
                    <RouteSignalCard
                      detail={routeSignals.nextAction.detail}
                      label="Next action"
                      tone={routeSignals.nextAction.tone}
                      value={routeSignals.nextAction.value}
                    />
                    <RouteSignalCard
                      detail={dynamicCalcBranch.detail}
                      label="Solver branch"
                      tone={dynamicCalcBranch.tone}
                      value={dynamicCalcBranch.value}
                    />
                    <RouteSignalCard
                      detail={validationSummary.detail}
                      label="Validation posture"
                      tone={validationSummary.tone}
                      value={validationSummary.value}
                    />
                  </div>

                  {topologyGap ? (
                    <div className="mt-3">
                      <RouteSignalCard detail={topologyGap.detail} label="Topology gap" tone="warning" value={topologyGap.value} />
                    </div>
                  ) : null}

                  {showTimberImpactOnlyGuidedActions ? (
                    <div className="mt-3 rounded-[1.1rem] border hairline bg-black/[0.025] p-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <div className="text-sm font-semibold text-[color:var(--ink)]">Quick path into a narrower timber lane</div>
                          <p className="mt-1 text-sm leading-6 text-[color:var(--ink-soft)]">
                            These helpers append ceiling-side rows in solver order so the stack can move out of the broad bare-floor fallback without rebuilding the assembly by hand.
                          </p>
                        </div>
                        <DetailTag>Ceiling-side helpers</DetailTag>
                      </div>

                      <div className="mt-4 grid gap-3 xl:grid-cols-3">
                        {TIMBER_IMPACT_ONLY_GUIDED_ACTIONS.map((action) => (
                          <button
                            className="focus-ring flex min-w-0 flex-col items-start gap-2 rounded-[1rem] border hairline bg-[color:var(--paper)] px-4 py-4 text-left hover:bg-black/[0.03]"
                            key={action.id}
                            onClick={() => appendRows(action.rows)}
                            type="button"
                          >
                            <span className="inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--ink)]">
                              <Plus className="h-4 w-4" />
                              {action.label}
                            </span>
                            <span className="text-sm leading-6 text-[color:var(--ink-soft)]">{action.note}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {showSteelBoundSupportFormActions && lightweightSteelBaseRow ? (
                    <div className="mt-3 rounded-[1.1rem] border hairline bg-black/[0.025] p-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <div className="text-sm font-semibold text-[color:var(--ink)]">Lock the steel support form</div>
                          <p className="mt-1 text-sm leading-6 text-[color:var(--ink-soft)]">
                            These helpers keep the floor and ceiling package intact but pin the base carrier to joist / purlin or open-web /
                            rolled steel so the crossover bound can collapse into a narrower UBIQ family corridor.
                          </p>
                        </div>
                        <DetailTag>Support-form helpers</DetailTag>
                      </div>

                      <div className="mt-4 grid gap-3 xl:grid-cols-2">
                        {STEEL_BOUND_SUPPORT_FORM_ACTIONS.map((action) => (
                          <button
                            className="focus-ring flex min-w-0 flex-col items-start gap-2 rounded-[1rem] border hairline bg-[color:var(--paper)] px-4 py-4 text-left hover:bg-black/[0.03]"
                            key={action.id}
                            onClick={() => updateMaterial(lightweightSteelBaseRow.id, action.materialId)}
                            type="button"
                          >
                            <span className="inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--ink)]">
                              <Plus className="h-4 w-4" />
                              {action.label}
                            </span>
                            <span className="text-sm leading-6 text-[color:var(--ink-soft)]">{action.note}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  <p className="mt-4 text-sm leading-6 text-[color:var(--ink-soft)]">{getAutomaticOutputNarrative(studyMode, airborneContextMode)}</p>
                </div>
              </div>

              <section className="rounded-[1.45rem] border hairline bg-[color:var(--paper)]/76 px-4 py-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-[color:var(--ink)]">
                      {geometryActive || impactFieldActive ? "Context-dependent inputs" : "No extra context inputs needed"}
                    </div>
                    <p className="mt-1 text-sm leading-6 text-[color:var(--ink-soft)]">
                      {geometryActive || impactFieldActive
                        ? "Only the fields that unlock additional outputs are shown here, split into required and parked groups."
                        : "The current route is already complete enough to start reading core outputs from the visible stack."}
                    </p>
                  </div>
                  <DetailTag>{getEnvironmentLabel(airborneContextMode)}</DetailTag>
                </div>

                {contextNotes.length ? (
                  <div className="mt-4 rounded-[1.05rem] border hairline bg-black/[0.02] px-4 py-3 text-sm leading-6 text-[color:var(--ink-soft)]">
                    {contextNotes.join(" ")}
                  </div>
                ) : null}

                {geometryActive || impactFieldActive ? (
                  <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
                    <ContextBucket
                      description="These values are on the active route and directly change whether the current read is defensible."
                      hasContent={geometryActive || impactFieldActive}
                      title="Required now"
                      tone="required"
                    >
                      {geometryActive ? (
                        <ContextSubsection
                          note={
                            standardizedAirborneActive
                              ? "Standardized airborne outputs are active, so partition geometry and receiving-room volume are required. RT60 stays optional for absorption-aware sidecars."
                              : "Apparent airborne field reads are active, so element geometry is required before the stack can be trusted."
                          }
                          title="Airborne route"
                        >
                          <FieldShell
                            advisory={`Guided sanity band ${formatGuidedSanityBand(GUIDED_INPUT_SANITY_BANDS.panelWidthMm)}.`}
                            label="Partition width (mm)"
                            note="Width of the separating element."
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
                            note="Height of the separating element."
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
                              label="Receiving room volume (m³)"
                              note="Use the real receiving-room volume when standardized DnT outputs are required."
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
                              ? "Field impact and standardized floor-side reads are active, so both K and receiving-room volume are required."
                              : "Only direct field-side impact correction is active right now, so K is the minimum required input."
                          }
                          title="Impact route"
                        >
                          <FieldShell
                            advisory={`Guided sanity band ${formatGuidedSanityBand(GUIDED_INPUT_SANITY_BANDS.fieldKDb)}.`}
                            label="K correction (dB)"
                            note="Field K is the simplest direct supplement for L'n,w."
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
                              label="Receiving room volume (m³)"
                              note="Needed for standardized floor-side impact outputs."
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
                      description="These inputs are relevant on nearby routes, but they do not block the current core read."
                      hasContent={hasOptionalContextFields}
                      title="Optional now"
                      tone="optional"
                    >
                      {geometryActive && !standardizedAirborneActive ? (
                        <ContextSubsection
                          note="Keep these parked until the route moves from apparent field reads into standardized airborne normalization."
                          title="Airborne route"
                        >
                          <FieldShell
                            advisory={`Guided sanity band ${formatGuidedSanityBand(GUIDED_INPUT_SANITY_BANDS.receivingRoomVolumeM3)}.`}
                            label="Receiving room volume (m³)"
                            note="Use the real receiving-room volume when available."
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
                          note="RT60 is optional on the current DnT lane. It supports absorption-aware sidecars, but it does not block DnT,w or DnT,A."
                          title="Airborne route"
                        >
                          <FieldShell
                            advisory={`Guided sanity band ${formatGuidedSanityBand(GUIDED_INPUT_SANITY_BANDS.receivingRoomRt60S)}.`}
                            label="RT60 (s)"
                            note="Optional reverberation-time context for absorption-aware sidecars."
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
                          note="Room volume can stay parked until the route upgrades from L'n,w into standardized L'nT outputs."
                          title="Impact route"
                        >
                          <FieldShell
                            advisory={`Guided sanity band ${formatGuidedSanityBand(GUIDED_INPUT_SANITY_BANDS.receivingRoomVolumeM3)}.`}
                            label="Receiving room volume (m³)"
                            note="Needed for standardized floor-side impact outputs."
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
                ) : null}
              </section>

              <section className="grid gap-3">
                <div className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[color:var(--ink-faint)]">
                  Sample starting points
                </div>
                <div className="rounded-[1.25rem] border hairline bg-[color:var(--paper)]/76 px-4 py-4">
                  <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
                    <label className="grid min-w-0 gap-2">
                      <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--ink-faint)]">Sample assembly</span>
                      <select
                        className="focus-ring touch-target w-full min-w-0 rounded-[1rem] border hairline bg-[color:var(--paper)] px-3 py-3"
                        onChange={(event) => setSelectedPresetId(event.target.value as PresetId)}
                        value={selectedPresetId}
                      >
                        {modePresets.map((preset) => (
                          <option key={preset.id} value={preset.id}>
                            {preset.label}
                          </option>
                        ))}
                      </select>
                    </label>

                    <button
                      className="focus-ring inline-flex items-center justify-center gap-2 rounded-full border hairline px-4 py-3 text-sm font-semibold text-[color:var(--ink)] hover:bg-black/[0.03]"
                      onClick={() => loadPreset(selectedPreset.id)}
                      type="button"
                    >
                      Load sample
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="mt-3 rounded-[1rem] border hairline bg-black/[0.02] px-4 py-3">
                    <div className="text-sm font-semibold text-[color:var(--ink)]">{selectedPreset.label}</div>
                    <p className="mt-1 text-sm leading-6 text-[color:var(--ink-soft)]">{selectedPreset.summary}</p>
                    <p className="mt-2 text-[0.78rem] leading-5 text-[color:var(--ink-faint)]">{selectedPreset.note}</p>
                  </div>
                </div>
              </section>

              <details className="rounded-[1.35rem] border hairline bg-[color:var(--paper)]/62 px-4 py-4">
                <summary className="cursor-pointer list-none">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold text-[color:var(--ink)]">Expert options</div>
                      <p className="mt-1 text-sm leading-6 text-[color:var(--ink-soft)]">
                        Solver choice and wall leakage assumptions stay out of the main flow unless the current route actually uses them.
                      </p>
                    </div>
                    {expertInputsActive ? <DetailTag tone="optional">Active</DetailTag> : <DetailTag>Not used now</DetailTag>}
                  </div>
                </summary>

                <div className="mt-4 grid gap-5">
                  <div className="grid gap-3 md:grid-cols-2">
                    <FieldShell
                      label="Calculator"
                      note="This selector chooses the airborne solver family."
                      relevance="optional"
                      usage="Rw, R'w, STC, C, Ctr, Dn* outputs and any airborne companion on floor studies"
                    >
                      <select
                        className="focus-ring touch-target rounded-[1rem] border hairline bg-[color:var(--paper)] px-3 py-3"
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

                    <div className="rounded-[1.1rem] border hairline bg-black/[0.02] px-4 py-4">
                      <div className="text-sm font-semibold text-[color:var(--ink)]">Full expert desk</div>
                      <p className="mt-2 text-sm leading-6 text-[color:var(--ink-soft)]">
                        Use the advanced workbench for explicit output curation, imported bands, field paths, provenance, and diagnostics.
                      </p>
                      <Link
                        className="focus-ring mt-4 inline-flex items-center gap-2 rounded-full border hairline px-3 py-2 text-sm font-semibold text-[color:var(--ink)] hover:bg-black/[0.03]"
                        href="/workbench?view=advanced"
                      >
                        Open advanced view
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>

                  {wallModifiersActive ? (
                    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                      <FieldShell
                        label="Connection path"
                        note="Choose a known connection only if it is clear."
                        relevance="optional"
                        usage="Wall-family detection and airborne overlays"
                      >
                        <select
                          className="focus-ring touch-target rounded-[1rem] border hairline bg-[color:var(--paper)] px-3 py-3"
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
                          className="focus-ring touch-target rounded-[1rem] border hairline bg-[color:var(--paper)] px-3 py-3"
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
                          className="focus-ring touch-target rounded-[1rem] border hairline bg-[color:var(--paper)] px-3 py-3"
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
                          className="focus-ring touch-target rounded-[1rem] border hairline bg-[color:var(--paper)] px-3 py-3"
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
                          className="focus-ring touch-target rounded-[1rem] border hairline bg-[color:var(--paper)] px-3 py-3"
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
                          className="focus-ring touch-target rounded-[1rem] border hairline bg-[color:var(--paper)] px-3 py-3"
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
                          className="focus-ring touch-target rounded-[1rem] border hairline bg-[color:var(--paper)] px-3 py-3"
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
                          className="focus-ring touch-target rounded-[1rem] border hairline bg-[color:var(--paper)] px-3 py-3"
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
                          className="focus-ring touch-target rounded-[1rem] border hairline bg-[color:var(--paper)] px-3 py-3"
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
          </SurfacePanel>

          <SurfacePanel className="stage-enter-2 min-w-0 overflow-hidden px-5 py-6 sm:px-6">
            <div className="flex min-w-0 flex-wrap items-start justify-between gap-4">
              <SectionLead
                description="Add layers in physical order, set thickness, and tag floor roles when they matter. The stack stays visible on the right so the current build-up never disappears while editing."
                step="03"
                title="Build the layer stack"
              />
              <button
                className="focus-ring inline-flex items-center gap-2 rounded-full bg-[color:var(--ink)] px-4 py-2 text-sm font-semibold text-[color:var(--paper)]"
                onClick={() => addRow()}
                type="button"
              >
                <Plus className="h-4 w-4" />
                Add layer
              </button>
            </div>

            <div className="mt-6 grid gap-3 rounded-[1.25rem] border hairline bg-[color:var(--paper)]/72 px-4 py-4 sm:grid-cols-3">
              <div>
                <div className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">Rows</div>
                <div className="mt-2 text-lg font-semibold text-[color:var(--ink)]">{rows.length}</div>
                <p className="mt-1 text-sm leading-6 text-[color:var(--ink-soft)]">
                  {rows.length
                    ? collapsedLiveRowCount > 0
                      ? `Visible order still defines solver order, but ${formatCountLabel(collapsedLiveRowCount, "adjacent duplicate live row")} ${collapsedLiveRowCount === 1 ? "collapses" : "collapse"} before calculation.`
                      : "Visible order is sent straight through to the solver."
                    : "Start with the topmost visible layer."}
                </p>
              </div>
              <div>
                <div className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">Thickness ready</div>
                <div className="mt-2 text-lg font-semibold text-[color:var(--ink)]">
                  {rows.length ? `${liveRowCount} live · ${parkedRowCount} parked` : "No rows yet"}
                </div>
                <p className="mt-1 text-sm leading-6 text-[color:var(--ink-soft)]">
                  {rows.length
                    ? parkedRowCount > 0
                      ? `${formatCountLabel(liveRowCount, "live row")} currently ${liveRowCount === 1 ? "feeds" : "feed"} ${formatCountLabel(solverLayerCount, "solver layer")}. ${formatCountLabel(parkedRowCount, "parked row")} ${parkedRowCount === 1 ? "stays" : "stay"} visible but ${parkedRowCount === 1 ? "does" : "do"} not affect the live calculation.`
                      : collapsedLiveRowCount > 0
                        ? `${formatCountLabel(liveRowCount, "live row")} collapse${liveRowCount === 1 ? "s" : ""} to ${formatCountLabel(solverLayerCount, "solver layer")} before the live calculation.`
                        : "Every visible row currently feeds the solver."
                    : "Missing or zero thickness keeps a row parked until it is ready for the live calculation."}
                </p>
              </div>
              <div>
                <div className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">
                  {studyMode === "floor" ? "Role coverage" : "Role coverage"}
                </div>
                <div className="mt-2 text-lg font-semibold text-[color:var(--ink)]">
                  {studyMode === "floor" ? `${assignedFloorRoleCount}/${rows.length || 0}` : "N/A"}
                </div>
                <p className="mt-1 text-sm leading-6 text-[color:var(--ink-soft)]">
                  {studyMode === "floor"
                    ? missingFloorRoleCount > 0
                      ? `${missingFloorRoleCount} row still needs a floor role for clean exact family and product matching.`
                      : "Every row is explicitly tagged for exact family and product lanes."
                    : "Floor-role tagging only matters on floor studies."}
                </p>
              </div>
            </div>

            <div className="mt-6">
              <StackOrderPanel rows={rows} studyMode={studyMode} />
            </div>

            <div className="mt-6 grid gap-3">
              <div className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[color:var(--ink-faint)]">
                Quick add common layers
              </div>
              <div className="rounded-[1.25rem] border hairline bg-[color:var(--paper)]/74 px-4 py-4">
                <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
                  <label className="grid min-w-0 gap-2">
                    <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--ink-faint)]">Common layer</span>
                    <select
                      className="focus-ring touch-target w-full min-w-0 rounded-[1rem] border hairline bg-[color:var(--paper)] px-3 py-3"
                      onChange={(event) => setQuickAddMaterialId(event.target.value)}
                      value={quickAddMaterialId}
                    >
                      {quickPickMaterials.map((material) => (
                        <option key={material.id} value={material.id}>
                          {material.name}
                        </option>
                      ))}
                    </select>
                  </label>

                  <button
                    className="focus-ring inline-flex items-center justify-center gap-2 rounded-full bg-[color:var(--ink)] px-4 py-3 text-sm font-semibold text-[color:var(--paper)]"
                    onClick={() => appendMaterial(selectedQuickAddMaterial.id, defaultThicknessFor(selectedQuickAddMaterial))}
                    type="button"
                  >
                    Add common layer
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-[color:var(--ink-soft)]">
                  <span>{`${defaultThicknessFor(selectedQuickAddMaterial)} mm starter thickness`}</span>
                  <span className="text-[color:var(--ink-faint)]">•</span>
                  <span>{getMaterialCategoryLabel(selectedQuickAddMaterial)}</span>
                  {formatMaterialDensity(selectedQuickAddMaterial) ? (
                    <>
                      <span className="text-[color:var(--ink-faint)]">•</span>
                      <span>{formatMaterialDensity(selectedQuickAddMaterial)}</span>
                    </>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="mt-6 grid min-w-0 gap-3">
              {rows.length ? (
                rows.map((row, index) => (
                  <SimpleLayerRow
                    active={row.id === activeRowId}
                    index={index}
                    key={row.id}
                    materialGroups={buildMaterialGroups(studyMode, materials, row.materialId)}
                    onActiveRowChange={setActiveRowId}
                    onFloorRoleChange={updateFloorRole}
                    onMaterialChange={updateMaterial}
                    onMoveRow={moveRow}
                    onRemoveRow={removeRow}
                    onThicknessChange={updateThickness}
                    row={row}
                    studyMode={studyMode}
                    totalRows={rows.length}
                  />
                ))
              ) : (
                <div className="rounded-[1.35rem] border border-dashed hairline bg-black/[0.02] px-4 py-8 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border hairline bg-[color:var(--panel-strong)]">
                    <Layers3 className="h-5 w-5 text-[color:var(--ink)]" />
                  </div>
                  <div className="mt-4 text-lg font-semibold text-[color:var(--ink)]">No layers yet</div>
                  <p className="mt-2 text-sm leading-6 text-[color:var(--ink-soft)]">
                    Add the first layer, or start from one of the sample assemblies above.
                  </p>
                </div>
              )}
            </div>
          </SurfacePanel>
        </div>

        <div className="grid min-w-0 gap-6 self-start xl:sticky xl:top-4">
          <LayerStackDiagram activeRowId={activeRowId} materials={materials} result={result} rows={rows} studyMode={studyMode} />

          <SurfacePanel className="stage-enter-3 min-w-0 overflow-hidden px-5 py-6 sm:px-6">
            <SectionLead
              description="Result cards are automatic. The calculator shows what is already supported and what still needs more data."
              step="04"
              title="Read the outputs"
            />

            <div className="mt-5">
              <OutputCoverageSummary
                boundCount={boundOutputCards.length}
                liveCount={liveOutputCards.length}
                parkedCount={needsInputCards.length}
                readyCount={readyCards.length}
                totalCount={automaticOutputs.length}
                unsupportedCount={unsupportedCards.length}
              />
            </div>

            <OutputUnlockRail groups={outputUnlockGroups} />

            {primaryReadyCard ? (
              <>
                <div className="mt-5">
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
                </div>

                {secondaryReadyCards.length ? (
                  <div className="mt-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="text-sm font-semibold text-[color:var(--ink)]">Supporting metrics</div>
                      <div className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[color:var(--ink-faint)]">
                        {secondaryReadyCards.length} companion values
                      </div>
                    </div>
                    <div className="mt-3 grid gap-3 md:grid-cols-2">
                      {secondaryReadyCards.map((card) => (
                        <OutputCard card={card} key={`ready-${card.label}`} />
                      ))}
                    </div>
                  </div>
                ) : null}
              </>
            ) : (
              <div className="mt-5 rounded-[1.25rem] border border-dashed hairline px-4 py-5 text-sm leading-6 text-[color:var(--ink-soft)]">
                Build a valid stack to populate the result cards.
              </div>
            )}

            {rows.length > 0 ? (
              <GuidedDecisionBasisStrip
                activeReviewTab={activeReviewTab}
                cards={corridorDossier.cards}
                headline={corridorDossier.headline}
                onOpenReviewTab={openReviewTab}
                selectedTraceNoteCount={selectedTraceNoteCount}
                traceGroupCount={methodDossier.traceGroups.length}
              />
            ) : null}

            <PendingOutputGroup
              cards={needsInputCards}
              countLabel={`${needsInputCards.length} parked`}
              detail="These outputs are still in scope, but the current route or context inputs are not complete enough to unlock them."
              title="Parked by current route"
            />

            <PendingOutputGroup
              cards={unsupportedCards}
              countLabel={`${unsupportedCards.length} unsupported`}
              detail="These outputs stay visible, but the current solver lane cannot defend them on this topology."
              title="Unsupported on this lane"
            />

            {scenario.warnings.length ? (
              <div className="mt-6 rounded-[1.2rem] border hairline bg-[color:var(--warning-soft)] px-4 py-4 text-sm leading-6 text-[color:var(--warning-ink)]">
                <div className="font-semibold">Check these inputs before trusting the read.</div>
                <div className="mt-2 grid gap-2">
                  {scenario.warnings.slice(0, 3).map((warning) => (
                    <div key={warning}>{warning}</div>
                  ))}
                  {scenario.warnings.length > 3 ? <div>{`+${scenario.warnings.length - 3} more warning${scenario.warnings.length - 3 === 1 ? "" : "s"} in diagnostics.`}</div> : null}
                </div>
              </div>
            ) : null}
          </SurfacePanel>
        </div>
      </section>

      <section className="grid gap-4" id="guided-review-deck">
        <SurfacePanel className="px-5 py-5 sm:px-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="eyebrow">Review Deck</div>
              <h2 className="mt-1 font-display text-[1.4rem] leading-none tracking-[-0.04em] text-[color:var(--ink)]">
                Method, diagnostics, and proposal tabs
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-7 text-[color:var(--ink-soft)]">{activeReviewTabConfig.note}</p>
            </div>
            <div className="grid gap-2 text-right text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">
              <div>{`${proposalMetrics.length} live metric${proposalMetrics.length === 1 ? "" : "s"}`}</div>
              <div>{`${proposalLayers.length} visible row${proposalLayers.length === 1 ? "" : "s"}`}</div>
              <div>{scenario.warnings.length > 0 ? `${scenario.warnings.length} warning${scenario.warnings.length === 1 ? "" : "s"}` : "No live warnings"}</div>
            </div>
          </div>

          <div
            aria-label="Guided review sections"
            className="mt-5 flex flex-wrap gap-2"
            role="tablist"
          >
            {REVIEW_TABS.map((tab) => (
              <ReviewTabButton
                active={tab.id === activeReviewTab}
                controlsId={`guided-review-panel-${tab.id}`}
                id={tab.id}
                key={tab.id}
                label={tab.label}
                onSelect={setActiveReviewTab}
              />
            ))}
          </div>
        </SurfacePanel>

        {activeReviewTab === "method" ? (
          <div
            aria-labelledby="guided-review-tab-method"
            id={activeReviewPanelId}
            role="tabpanel"
          >
            <SimpleWorkbenchMethodPanel
              branchDetail={dynamicCalcBranch.detail}
              branchLabel={dynamicCalcBranch.value}
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

        {activeReviewTab === "diagnostics" ? (
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
              result={result}
              studyMode={studyMode}
              traceGroups={methodDossier.traceGroups}
              validationDetail={validationSummary.detail}
              validationLabel={validationSummary.value}
              warnings={scenario.warnings}
            />
          </div>
        ) : null}

        {activeReviewTab === "proposal" ? (
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
    </div>
  );
}
