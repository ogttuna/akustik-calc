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
import { ImpactResultPanel } from "./impact-result-panel";
import { evaluateScenario } from "./scenario-analysis";
import { ResultSummary } from "./result-summary";
import {
  REQUESTED_OUTPUT_LABELS,
  REQUESTED_OUTPUT_SUPPORT_NOTES
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
  status: "bound" | "live" | "needs_input" | "unsupported";
  value: string;
};

const MODE_PRESETS: Record<StudyMode, readonly PresetId[]> = {
  floor: ["heavy_concrete_impact_floor", "clt_floor", "dataholz_clt_dry_exact"],
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

const FIELD_AIRBORNE_OUTPUTS = new Set<RequestedOutputId>(["R'w", "DnT,w", "DnT,A", "Dn,w", "Dn,A", "DnT,A,k"]);
const FIELD_IMPACT_OUTPUTS = new Set<RequestedOutputId>(["L'n,w", "L'nT,w", "L'nT,50", "LnT,A"]);
const STANDARDIZED_AIRBORNE_OUTPUTS = new Set<RequestedOutputId>(["DnT,w", "DnT,A"]);

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

function getEnvironmentLabel(contextMode: AirborneContextMode): string {
  return AIRBORNE_CONTEXT_OPTIONS.find((option) => option.value === contextMode)?.label ?? "Lab element";
}

function joinLabels(items: readonly string[]): string {
  if (!items.length) {
    return "";
  }

  if (items.length === 1) {
    return items[0]!;
  }

  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

function sumThickness(rows: readonly LayerDraft[]): number {
  return rows.reduce((total, row) => total + (parsePositiveNumber(row.thicknessMm) ?? 0), 0);
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
  airborneContextMode: AirborneContextMode;
  output: RequestedOutputId;
  result: AssemblyCalculation | null;
  studyMode: StudyMode;
}): string {
  const { airborneContextMode, output, result, studyMode } = input;

  if (!result) {
    return "Add a valid layer stack first.";
  }

  if (FIELD_AIRBORNE_OUTPUTS.has(output)) {
    if (airborneContextMode === "element_lab") {
      return "Switch the airborne environment out of lab mode for field-side airborne metrics.";
    }

    const geometryNeeded = result.ratings.field?.geometryNeeded ?? [];
    const absorptionNeeded = result.ratings.field?.absorptionDataNeeded ?? [];
    const needed = Array.from(new Set([...geometryNeeded, ...absorptionNeeded]));

    if (needed.length) {
      return `Need ${joinLabels(needed)} to derive this output.`;
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

  if (output === "Ln,w+CI" || output === "CI" || output === "CI,50-2500") {
    return "This appears only when the active impact lane carries low-frequency companion terms.";
  }

  return REQUESTED_OUTPUT_SUPPORT_NOTES[output];
}

function buildOutputCard(input: {
  airborneContextMode: AirborneContextMode;
  output: RequestedOutputId;
  result: AssemblyCalculation | null;
  studyMode: StudyMode;
}): OutputCardModel {
  const { airborneContextMode, output, result, studyMode } = input;
  const fieldRatings = result?.ratings.field;

  switch (output) {
    case "Rw":
      if (studyMode === "floor" && typeof result?.floorSystemRatings?.Rw === "number") {
        return {
          detail: "Airborne companion carried on the active floor lane.",
          label: "Rw",
          status: "live",
          value: `${formatDecimal(result.floorSystemRatings.Rw)} dB`
        };
      }

      if (typeof result?.metrics.estimatedRwDb === "number") {
        return {
          detail: "Weighted airborne element rating from the active airborne calculator.",
          label: "Rw",
          status: "live",
          value: `${formatDecimal(result.metrics.estimatedRwDb)} dB`
        };
      }
      break;
    case "R'w":
      if (typeof result?.metrics.estimatedRwPrimeDb === "number") {
        return {
          detail: "Apparent on-site airborne rating from the field/building route.",
          label: "R'w",
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
          status: "live",
          value: formatSignedDb(result.metrics.estimatedCDb)
        };
      }
      break;
    case "Ctr":
      if (typeof result?.metrics.estimatedCtrDb === "number") {
        return {
          detail: "Traffic-noise adaptation term on the airborne lane.",
          label: "Ctr",
          status: "live",
          value: formatSignedDb(result.metrics.estimatedCtrDb)
        };
      }
      break;
    case "DnT,w":
      if (typeof result?.metrics.estimatedDnTwDb === "number") {
        return {
          detail: "Standardized field airborne level difference.",
          label: "DnT,w",
          status: "live",
          value: `${formatDecimal(result.metrics.estimatedDnTwDb)} dB`
        };
      }
      break;
    case "DnT,A":
      if (typeof result?.metrics.estimatedDnTADb === "number") {
        return {
          detail: "A-weighted standardized field airborne companion.",
          label: "DnT,A",
          status: "live",
          value: `${formatDecimal(result.metrics.estimatedDnTADb)} dB`
        };
      }
      break;
    case "DnT,A,k":
      if (typeof fieldRatings?.DnTAk === "number" || typeof result?.metrics.estimatedDnTAkDb === "number") {
        return {
          detail: "Published or exact-field carried DnT,A,k companion.",
          label: "DnT,A,k",
          status: "live",
          value: `${formatDecimal(fieldRatings?.DnTAk ?? result?.metrics.estimatedDnTAkDb ?? 0)} dB`
        };
      }
      break;
    case "Dn,w":
      if (typeof result?.metrics.estimatedDnWDb === "number") {
        return {
          detail: "Normalized field airborne level difference.",
          label: "Dn,w",
          status: "live",
          value: `${formatDecimal(result.metrics.estimatedDnWDb)} dB`
        };
      }
      break;
    case "Dn,A":
      if (typeof result?.metrics.estimatedDnADb === "number") {
        return {
          detail: "A-weighted normalized field airborne companion.",
          label: "Dn,A",
          status: "live",
          value: `${formatDecimal(result.metrics.estimatedDnADb)} dB`
        };
      }
      break;
    case "Ln,w":
      if (typeof result?.impact?.LnW === "number") {
        return {
          detail: "Lab-side weighted normalized impact sound level.",
          label: "Ln,w",
          status: "live",
          value: `${formatDecimal(result.impact.LnW)} dB`
        };
      }

      if (typeof result?.lowerBoundImpact?.LnWUpperBound === "number") {
        return {
          detail: "Conservative upper bound from a bound-only floor family lane.",
          label: "Ln,w",
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
          status: "live",
          value: `${formatDecimal(result.impact.LPrimeNW)} dB`
        };
      }

      if (typeof result?.lowerBoundImpact?.LPrimeNWUpperBound === "number") {
        return {
          detail: "Conservative field-side impact upper bound.",
          label: "L'n,w",
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
          status: "live",
          value: `${formatDecimal(result.impact.DeltaLw)} dB`
        };
      }

      if (typeof result?.lowerBoundImpact?.DeltaLwLowerBound === "number") {
        return {
          detail: "Conservative lower bound from a bound-only support lane.",
          label: "DeltaLw",
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
          status: "live",
          value: `${formatDecimal(result.impact.LPrimeNTw)} dB`
        };
      }

      if (typeof result?.lowerBoundImpact?.LPrimeNTwUpperBound === "number") {
        return {
          detail: "Conservative standardized field impact upper bound.",
          label: "L'nT,w",
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
          status: "live",
          value: `${formatDecimal(result.impact.LPrimeNT50)} dB`
        };
      }

      if (typeof result?.lowerBoundImpact?.LPrimeNT50UpperBound === "number") {
        return {
          detail: "Conservative L'nT,50 upper bound.",
          label: "L'nT,50",
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
          status: "live",
          value: `${formatDecimal(result.impact.LnTA)} dB`
        };
      }
      break;
    default:
      break;
  }

  return {
    detail: buildUnavailableOutputDetail({ airborneContextMode, output, result, studyMode }),
    label: REQUESTED_OUTPUT_LABELS[output],
    status: "needs_input",
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

function SelectionCard(props: {
  active: boolean;
  children?: ReactNode;
  note: string;
  onClick: () => void;
  title: string;
}) {
  const { active, children, note, onClick, title } = props;

  return (
    <button
      className={`focus-ring group relative min-w-0 overflow-hidden rounded-[1.45rem] border px-4 py-4 text-left transition ${
        active
          ? "border-[color:var(--accent)] bg-[color:color-mix(in_oklch,var(--accent)_14%,var(--paper))] text-[color:var(--ink)] shadow-[0_24px_40px_-34px_rgba(50,31,9,0.4)]"
          : "hairline bg-[color:var(--paper)]/78 text-[color:var(--ink)] hover:bg-black/[0.03] hover:translate-y-[-1px]"
      }`}
      onClick={onClick}
      type="button"
    >
      <div
        className={`pointer-events-none absolute inset-x-0 top-0 h-px ${
          active ? "bg-[color:var(--accent)]" : "bg-[color:color-mix(in_oklch,var(--line)_80%,transparent)]"
        }`}
      />
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="text-[1.02rem] font-semibold">{title}</div>
          <p className="mt-2 text-sm leading-6 text-[color:var(--ink-soft)]">{note}</p>
        </div>
        <div
          className={`mt-1 h-3 w-3 shrink-0 rounded-full border transition ${
            active
              ? "border-[color:var(--accent)] bg-[color:var(--accent)]"
              : "border-[color:var(--line-strong)] bg-transparent group-hover:border-[color:var(--ink-soft)]"
          }`}
        />
      </div>
      {children ? (
        <div className="mt-4 border-t hairline pt-3 text-sm leading-6 text-[color:var(--ink-soft)]">{children}</div>
      ) : null}
    </button>
  );
}

function DetailTag(props: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border hairline bg-[color:var(--paper)]/72 px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-soft)]">
      {props.children}
    </span>
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
  active?: boolean;
  children: ReactNode;
  label: string;
  note: string;
  usage: string;
}) {
  const { children, label, note, usage } = props;

  return (
    <div className="grid min-w-0 gap-2" title={`${note} Used for: ${usage}`}>
      <div className="min-w-0">
        <span className="text-sm font-medium text-[color:var(--ink)]">{label}</span>
        <p className="mt-1 text-xs leading-5 text-[color:var(--ink-faint)]">{note}</p>
      </div>
      {children}
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
  contextLabel: string;
  heroHeadline: string;
  studyMode: StudyMode;
}) {
  const { card, contextLabel, heroHeadline, studyMode } = props;

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

function LayerLegendRow(props: {
  index: number;
  material: MaterialDefinition;
  row: LayerDraft;
}) {
  const { index, material, row } = props;
  const facts = buildMaterialFacts(material, row.thicknessMm);

  return (
    <article className="rounded-[1.1rem] border hairline bg-[color:var(--paper)]/76 px-3 py-3 shadow-[0_10px_20px_-20px_rgba(18,34,34,0.3)]">
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
  rows: readonly {
    material: MaterialDefinition;
    row: LayerDraft;
  }[];
}) {
  const { rows } = props;
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
          return (
            <div
              className={`relative flex min-h-10 items-center justify-between gap-3 border-b hairline px-3 py-3 last:border-b-0 ${layerFillClass(material)}`}
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
                {row.thicknessMm || "?"} mm
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
  rows: readonly {
    material: MaterialDefinition;
    row: LayerDraft;
  }[];
}) {
  const { rows } = props;
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
            return (
              <div
                className={`flex min-w-0 basis-0 flex-col justify-between border-r hairline px-2 py-3 last:border-r-0 ${layerFillClass(material)}`}
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
                    {row.thicknessMm || "?"} mm
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
  materials: readonly MaterialDefinition[];
  result: AssemblyCalculation | null;
  rows: readonly LayerDraft[];
  studyMode: StudyMode;
}) {
  const { materials, result, rows, studyMode } = props;
  const totalThickness = sumThickness(rows);
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
          </div>
          <div className="grid gap-1 text-right text-sm text-[color:var(--ink-soft)]">
            <span>{rows.length ? `${rows.length} layers` : "No layers yet"}</span>
            <span>{totalThickness > 0 ? `${formatDecimal(totalThickness)} mm total thickness` : "Thickness pending"}</span>
            <span>{result ? `${formatDecimal(result.metrics.surfaceMassKgM2)} kg/m² surface mass` : "Surface mass pending"}</span>
          </div>
        </div>
      </div>

      {rows.length ? (
        <div className="grid gap-5 p-5 xl:grid-cols-[minmax(0,1.05fr)_minmax(18rem,0.95fr)]">
          <div>{studyMode === "floor" ? <FloorStackFigure rows={resolved} /> : <WallStackFigure rows={resolved} />}</div>
          <div className="grid gap-2.5">
            {resolved.map(({ material, row }, index) => (
              <LayerLegendRow index={index} key={row.id} material={material} row={row} />
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
  index: number;
  materialGroups: readonly MaterialOptionGroup[];
  onMaterialChange: (id: string, materialId: string) => void;
  onMoveRow: (id: string, direction: "up" | "down") => void;
  onRemoveRow: (id: string) => void;
  onThicknessChange: (id: string, thicknessMm: string) => void;
  row: LayerDraft;
  studyMode: StudyMode;
  totalRows: number;
}) {
  const { index, materialGroups, onMaterialChange, onMoveRow, onRemoveRow, onThicknessChange, row, studyMode, totalRows } =
    props;

  const materials = uniqueMaterialsById(materialGroups.flatMap((group) => group.materials));
  const material = materials.find((entry) => entry.id === row.materialId) ?? materials[0]!;
  const edgeLabel = getStackEdgeLabel(studyMode, index, totalRows);
  const canMoveUp = index > 0;
  const canMoveDown = index < totalRows - 1;
  const materialFacts = buildMaterialFacts(material, row.thicknessMm);

  return (
    <article className="min-w-0 rounded-[1.15rem] border hairline bg-[color:var(--panel)]/90 px-3 py-3 shadow-[0_18px_32px_-32px_rgba(20,37,36,0.42)] sm:px-4">
      <div className="flex min-w-0 items-start gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border hairline bg-[color:var(--panel-strong)] text-sm font-semibold text-[color:var(--ink)]">
          {index + 1}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <div className="truncate text-[0.98rem] font-semibold text-[color:var(--ink)]">{material.name}</div>
            {edgeLabel ? (
              <span className="rounded-full border hairline px-2 py-1 text-[0.64rem] font-semibold uppercase tracking-[0.14em] text-[color:var(--ink-faint)]">
                {edgeLabel}
              </span>
            ) : null}
          </div>
          <div className="mt-1 text-[0.68rem] uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">
            {getMaterialCategoryLabel(material)}
          </div>
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

      <div className="mt-3 grid min-w-0 items-end gap-3 sm:grid-cols-[minmax(0,1fr)_7rem]">
        <MaterialPickerField
          material={material}
          materialGroups={materialGroups}
          onSelect={(materialId) => onMaterialChange(row.id, materialId)}
          thicknessMm={row.thicknessMm}
        />

        <label className="grid min-w-0 gap-2">
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--ink-faint)]">Thickness</span>
          <input
            className="focus-ring touch-target w-full min-w-0 rounded-[1rem] border hairline bg-[color:var(--paper)] px-3 py-3"
            inputMode="decimal"
            onChange={(event) => onThicknessChange(row.id, event.target.value)}
            placeholder="mm"
            value={row.thicknessMm}
          />
        </label>
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

export function SimpleWorkbenchShell() {
  const projectName = useWorkbenchStore((state) => state.projectName);
  const rows = useWorkbenchStore((state) => state.rows);
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
  const setCalculatorId = useWorkbenchStore((state) => state.setCalculatorId);
  const setImpactGuideKDb = useWorkbenchStore((state) => state.setImpactGuideKDb);
  const setImpactGuideReceivingRoomVolumeM3 = useWorkbenchStore((state) => state.setImpactGuideReceivingRoomVolumeM3);
  const setRequestedOutputs = useWorkbenchStore((state) => state.setRequestedOutputs);
  const startStudyMode = useWorkbenchStore((state) => state.startStudyMode);
  const updateMaterial = useWorkbenchStore((state) => state.updateMaterial);
  const updateThickness = useWorkbenchStore((state) => state.updateThickness);

  const materials = MATERIAL_CATALOG_SEED;
  const quickPickMaterials = MODE_QUICK_PICK_IDS[studyMode]
    .map((materialId) => materials.find((entry) => entry.id === materialId) ?? null)
    .filter((entry): entry is MaterialDefinition => entry !== null);
  const modePresets = MODE_PRESETS[studyMode].map((presetId) => getPresetById(presetId));
  const automaticOutputs = getAutomaticOutputs(studyMode, airborneContextMode);
  const totalThickness = sumThickness(rows);

  useEffect(() => {
    if (sameRequestedOutputs(requestedOutputs, automaticOutputs)) {
      return;
    }

    setRequestedOutputs(automaticOutputs);
  }, [automaticOutputs, requestedOutputs, setRequestedOutputs]);

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
  const absorptionActive = geometryActive && automaticOutputs.some((output) => STANDARDIZED_AIRBORNE_OUTPUTS.has(output));
  const wallModifiersActive = studyMode === "wall" && airborneContextMode !== "element_lab";
  const impactFieldActive = studyMode === "floor" && fieldImpactRequested;
  const expertInputsActive = wallModifiersActive || calculatorId !== "dynamic";
  const outputCards = automaticOutputs.map((output) => buildOutputCard({ airborneContextMode, output, result, studyMode }));
  const readyCards = outputCards.filter((card) => card.status === "live" || card.status === "bound");
  const pendingCards = outputCards.filter((card) => card.status !== "live" && card.status !== "bound");
  const primaryReadyCard = pickPrimaryOutputCard(readyCards, studyMode);
  const secondaryReadyCards = primaryReadyCard ? readyCards.filter((card) => card !== primaryReadyCard) : readyCards;
  const readyOutputCount = readyCards.length;
  const heroHeadline = result ? assemblyDescription.headline : "Choose a context and build the assembly to start the live estimate.";

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
              <div className="grid gap-6 xl:grid-cols-[14rem_minmax(0,1fr)]">
                <div className="grid gap-3">
                  <div className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[color:var(--ink-faint)]">Surface</div>
                  <div className="grid gap-2">
                    {(["floor", "wall"] as const).map((mode) => (
                      <SelectionCard
                        active={mode === studyMode}
                        key={mode}
                        note={mode === "floor" ? "Impact and airborne companion metrics for floor build-ups." : "Airborne separation metrics for wall assemblies."}
                        onClick={() => startStudyMode(mode)}
                        title={getStudyModeLabel(mode)}
                      >
                        {mode === "floor"
                          ? "Use when the user defines coverings, resilient layers, screeds, slabs, or ceiling build-ups."
                          : "Use when the assembly is read from one side of the partition to the other."}
                      </SelectionCard>
                    ))}
                  </div>
                </div>

                <div className="grid gap-3">
                  <div className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[color:var(--ink-faint)]">Project context</div>
                  <div className="grid gap-3 lg:grid-cols-3">
                    {AIRBORNE_CONTEXT_OPTIONS.map((option) => (
                      <SelectionCard
                        active={option.value === airborneContextMode}
                        key={option.value}
                        note={option.note}
                        onClick={() => setAirborneContextMode(option.value)}
                        title={option.label}
                      >
                        Outputs:{" "}
                        {getAutomaticOutputs(studyMode, option.value)
                          .map((output) => REQUESTED_OUTPUT_LABELS[output])
                          .join(", ")}
                      </SelectionCard>
                    ))}
                  </div>
                  <p className="text-sm leading-6 text-[color:var(--ink-soft)]">
                    {getAutomaticOutputNarrative(studyMode, airborneContextMode)}
                  </p>
                </div>
              </div>

              {geometryActive || impactFieldActive ? (
                <section className="rounded-[1.45rem] border hairline bg-[color:var(--paper)]/76 px-4 py-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold text-[color:var(--ink)]">Context-dependent inputs</div>
                      <p className="mt-1 text-sm leading-6 text-[color:var(--ink-soft)]">
                        Only the fields that unlock additional outputs are shown here.
                      </p>
                    </div>
                    <DetailTag>{getEnvironmentLabel(airborneContextMode)}</DetailTag>
                  </div>

                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    {geometryActive ? (
                      <div className="grid gap-3">
                        <div className="text-sm font-semibold text-[color:var(--ink)]">Geometry and room data</div>
                        <FieldShell
                          active={geometryActive}
                          label="Partition width (mm)"
                          note="Width of the separating element."
                          usage="Dn,w, Dn,A, DnT,w, DnT,A"
                        >
                          <input
                            className="focus-ring touch-target rounded-[1rem] border hairline bg-[color:var(--paper)] px-3 py-3"
                            inputMode="decimal"
                            onChange={(event) => setAirbornePanelWidthMm(event.target.value)}
                            placeholder="e.g. 3600"
                            value={airbornePanelWidthMm}
                          />
                        </FieldShell>

                        <FieldShell
                          active={geometryActive}
                          label="Partition height (mm)"
                          note="Height of the separating element."
                          usage="Dn,w, Dn,A, DnT,w, DnT,A"
                        >
                          <input
                            className="focus-ring touch-target rounded-[1rem] border hairline bg-[color:var(--paper)] px-3 py-3"
                            inputMode="decimal"
                            onChange={(event) => setAirbornePanelHeightMm(event.target.value)}
                            placeholder="e.g. 2800"
                            value={airbornePanelHeightMm}
                          />
                        </FieldShell>

                        <FieldShell
                          active={geometryActive}
                          label="Receiving room volume (m³)"
                          note="Use the real receiving-room volume when available."
                          usage="DnT,w, DnT,A and floor-side L'nT,w when requested"
                        >
                          <input
                            className="focus-ring touch-target rounded-[1rem] border hairline bg-[color:var(--paper)] px-3 py-3"
                            inputMode="decimal"
                            onChange={(event) => setAirborneReceivingRoomVolumeM3(event.target.value)}
                            placeholder="e.g. 42"
                            value={airborneReceivingRoomVolumeM3}
                          />
                        </FieldShell>

                        {absorptionActive ? (
                          <FieldShell
                            active={absorptionActive}
                            label="RT60 (s)"
                            note="Only needed on absorption-aware standardized reads."
                            usage="DnT,w and DnT,A building-style normalization"
                          >
                            <input
                              className="focus-ring touch-target rounded-[1rem] border hairline bg-[color:var(--paper)] px-3 py-3"
                              inputMode="decimal"
                              onChange={(event) => setAirborneReceivingRoomRt60S(event.target.value)}
                              placeholder="e.g. 0.6"
                              value={airborneReceivingRoomRt60S}
                            />
                          </FieldShell>
                        ) : null}
                      </div>
                    ) : null}

                    {impactFieldActive ? (
                      <div className="grid gap-3">
                        <div className="text-sm font-semibold text-[color:var(--ink)]">Field correction</div>
                        <FieldShell
                          active={impactFieldActive}
                          label="K correction (dB)"
                          note="Field K is the simplest direct supplement for L'n,w."
                          usage="L'n,w, L'nT,w and L'nT,50"
                        >
                          <input
                            className="focus-ring touch-target rounded-[1rem] border hairline bg-[color:var(--paper)] px-3 py-3"
                            inputMode="decimal"
                            onChange={(event) => setImpactGuideKDb(event.target.value)}
                            placeholder="e.g. 2"
                            value={impactGuideKDb}
                          />
                        </FieldShell>

                        <FieldShell
                          active={impactFieldActive}
                          label="Receiving room volume (m³)"
                          note="Needed for standardized floor-side impact outputs."
                          usage="L'nT,w and L'nT,50"
                        >
                          <input
                            className="focus-ring touch-target rounded-[1rem] border hairline bg-[color:var(--paper)] px-3 py-3"
                            inputMode="decimal"
                            onChange={(event) => setImpactGuideReceivingRoomVolumeM3(event.target.value)}
                            placeholder="e.g. 42"
                            value={impactGuideReceivingRoomVolumeM3}
                          />
                        </FieldShell>
                      </div>
                    ) : null}
                  </div>
                </section>
              ) : null}

              <section className="grid gap-3">
                <div className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[color:var(--ink-faint)]">
                  Sample starting points
                </div>
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {modePresets.map((preset) => (
                    <button
                      className="focus-ring rounded-[1.25rem] border hairline bg-[color:var(--paper)]/76 px-4 py-4 text-left transition hover:bg-black/[0.03]"
                      key={preset.id}
                      onClick={() => loadPreset(preset.id)}
                      type="button"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="text-base font-semibold text-[color:var(--ink)]">{preset.label}</div>
                          <p className="mt-2 text-sm leading-6 text-[color:var(--ink-soft)]">{preset.note}</p>
                        </div>
                        <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-[color:var(--ink-faint)]" />
                      </div>
                    </button>
                  ))}
                </div>
              </section>

              <details className="rounded-[1.35rem] border hairline bg-[color:var(--paper)]/62 px-4 py-4">
                <summary className="cursor-pointer list-none">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold text-[color:var(--ink)]">Expert options</div>
                      <p className="mt-1 text-sm leading-6 text-[color:var(--ink-soft)]">
                        Solver choice and wall leakage assumptions stay out of the main flow.
                      </p>
                    </div>
                    {expertInputsActive ? <DetailTag>Active</DetailTag> : <DetailTag>Collapsed by default</DetailTag>}
                  </div>
                </summary>

                <div className="mt-4 grid gap-5">
                  <div className="grid gap-3 md:grid-cols-2">
                    <FieldShell
                      active
                      label="Calculator"
                      note="This selector chooses the airborne solver family."
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
                        active={wallModifiersActive}
                        label="Connection path"
                        note="Choose a known connection only if it is clear."
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
                        active={wallModifiersActive}
                        label="Stud family"
                        note="Set this only when the framing type is known."
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
                        active={wallModifiersActive}
                        label="Stud spacing (mm)"
                        note="Leave blank if spacing is unknown."
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
                        active={wallModifiersActive}
                        label="Airtightness"
                        note="One of the main leakage penalty drivers."
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
                        active={wallModifiersActive}
                        label="Perimeter seal"
                        note="Expected seal quality around the element."
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
                        active={wallModifiersActive}
                        label="Penetrations"
                        note="Reflects service cut-through and opening intensity."
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
                        active={wallModifiersActive}
                        label="Junction quality"
                        note="Use this when flanking quality differs from a clean build."
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
                        active={wallModifiersActive}
                        label="Electrical boxes"
                        note="Only set this when back boxes are a real concern."
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
                        active={wallModifiersActive}
                        label="Shared support track"
                        note="Use this when adjacent leaves or supports are clearly shared."
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
                description="Add layers in physical order. The stack stays visible on the right so the user never loses the build-up while editing."
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

            <div className="mt-6 grid gap-3">
              <div className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[color:var(--ink-faint)]">
                Quick add common layers
              </div>
              <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
                {quickPickMaterials.map((material) => (
                  <button
                    className="focus-ring rounded-[1.1rem] border hairline bg-[color:var(--paper)]/74 px-3 py-3 text-left transition hover:bg-black/[0.03]"
                    key={material.id}
                    onClick={() => appendMaterial(material.id, defaultThicknessFor(material))}
                    type="button"
                  >
                    <div className="text-sm font-semibold text-[color:var(--ink)]">{material.name}</div>
                    <div className="mt-1 text-sm text-[color:var(--ink-soft)]">{defaultThicknessFor(material)} mm starter thickness</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 grid min-w-0 gap-3">
              {rows.length ? (
                rows.map((row, index) => (
                  <SimpleLayerRow
                    index={index}
                    key={row.id}
                    materialGroups={buildMaterialGroups(studyMode, materials, row.materialId)}
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
          <LayerStackDiagram materials={materials} result={result} rows={rows} studyMode={studyMode} />

          <SurfacePanel className="stage-enter-3 min-w-0 overflow-hidden px-5 py-6 sm:px-6">
            <SectionLead
              description="Result cards are automatic. The calculator shows what is already supported and what still needs more data."
              step="04"
              title="Read the outputs"
            />

            {primaryReadyCard ? (
              <>
                <div className="mt-5">
                  <PrimaryResultCard
                    card={primaryReadyCard}
                    contextLabel={getEnvironmentLabel(airborneContextMode)}
                    heroHeadline={heroHeadline}
                    studyMode={studyMode}
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

            {pendingCards.length ? (
              <div className="mt-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="text-sm font-semibold text-[color:var(--ink)]">More outputs unlock as you add data</div>
                  <div className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[color:var(--ink-faint)]">
                    Needs context
                  </div>
                </div>
                <div className="mt-3 grid gap-3">
                  {pendingCards.map((card) => (
                    <PendingOutputRow card={card} key={`pending-${card.label}`} />
                  ))}
                </div>
              </div>
            ) : null}

            {scenario.warnings.length ? (
              <div className="mt-6 rounded-[1.2rem] border hairline bg-[color:var(--warning-soft)] px-4 py-4 text-sm leading-6 text-[color:var(--warning-ink)]">
                <span className="font-semibold">Warning:</span> {scenario.warnings[0]}
              </div>
            ) : null}
          </SurfacePanel>
        </div>
      </section>

      <details className="rounded-[1.5rem] border hairline bg-[color:var(--panel)]/85 px-5 py-5">
        <summary className="cursor-pointer list-none">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="eyebrow">Diagnostics</div>
              <h2 className="mt-1 font-display text-[1.4rem] leading-none tracking-[-0.04em] text-[color:var(--ink)]">
                Provenance, confidence, and advanced traces
              </h2>
            </div>
            <Link
              className="focus-ring inline-flex items-center gap-2 rounded-full border hairline px-3 py-2 text-sm font-semibold text-[color:var(--ink-soft)] hover:bg-black/[0.03]"
              href="/workbench?view=advanced"
            >
              Open operator desk
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </summary>

        <div className="mt-5 grid gap-6">
          <ResultSummary result={result} warnings={scenario.warnings} />
          {studyMode === "floor" ? <ImpactResultPanel result={result} /> : null}
        </div>
      </details>
    </div>
  );
}
