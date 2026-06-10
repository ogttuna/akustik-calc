import type {
  AirborneContext,
  AssemblyCalculation,
  ExactImpactSource,
  ImpactFieldContext,
  ImpactOnlyCalculation,
  LayerInput,
  RequestedOutputId
} from "@dynecho/shared";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { composeWorkbenchReport } from "./compose-workbench-report";
import { CRITERIA_PACKS } from "./criteria-packs";
import {
  getLayerCombinationResolverCandidateReportLines,
  getLayerCombinationResolverCandidateSurface
} from "./layer-combination-resolver-candidate-surface";
import { getActiveImpactMetricBasisRows } from "./impact-metric-basis-view";
import { getPresetById } from "./preset-definitions";
import { buildResultAnswerChartLanes } from "./result-answer-chart-model";
import { evaluateScenario, type EvaluatedScenario } from "./scenario-analysis";
import {
  buildServerProjectWorkbenchSnapshot,
  parseServerProjectWorkbenchSnapshot
} from "./server-project-workbench-snapshot";
import { addOutputCardPosture, buildOutputCard } from "./simple-workbench-output-model";
import { buildWorkbenchWallTopology } from "./simple-workbench-wall-topology";
import type { LayerDraft, ScenarioSnapshot } from "./workbench-store";

const AUTH_ENV_KEYS = ["DYNECHO_AUTH_USERNAME", "DYNECHO_AUTH_PASSWORD", "DYNECHO_AUTH_SECRET"] as const;
const HELPER_ONLY_BASIS =
  "broad_accuracy_floor_helper_only_timber_open_web_impact_stack_source_absent_formula_corridor";
const SELECTED_CANDIDATE_ID = "floor.helper_only_timber_open_web.source_absent";
const SINGLE_LEAF_BASIS = "layer_combination_resolver_single_leaf_mass_law_banded_source_absent_formula_corridor";
const SINGLE_LEAF_SELECTED_CANDIDATE_ID =
  "candidate_layer_combination_resolver_single_leaf_mass_law_banded_source_absent_family_solver";
const DOUBLE_LEAF_BASIS =
  "layer_combination_resolver_double_leaf_framed_wall_banded_source_absent_formula_corridor";
const DOUBLE_LEAF_SELECTED_CANDIDATE_ID =
  "candidate_layer_combination_resolver_double_leaf_framed_wall_banded_source_absent_family_solver";
const WALL_EXACT_LSF_LAB_COMPANION_SELECTED_CANDIDATE_ID =
  "candidate_lsf_exact_rw_calculated_lab_companions";
const WALL_EXACT_LSF_LAB_COMPANION_RUNTIME_BASIS =
  "gate_dv_lsf_exact_rw_calculated_lab_companion_runtime";
const WALL_ANCHOR_DELTA_SELECTED_CANDIDATE_ID =
  "wall.compatible_anchor_delta.extra_board_on_verified_lsf";
const WALL_ANCHOR_DELTA_RUNTIME_BASIS = "exact_subassembly_source_plus_calculated_delta";
const WALL_FIELD_SELECTED_CANDIDATE_ID = "wall.airborne_field_context.field_apparent_adapter";
const WALL_FIELD_RUNTIME_BASIS = "gate_i_airborne_field_apparent_context_adapter_runtime";
const FLOOR_EXACT_SELECTED_CANDIDATE_ID = "floor.exact_measured_floor_system.same_topology_metric_basis";
const FLOOR_EXACT_RUNTIME_BASIS = "open_measured_floor_system_exact_match";
const EXACT_IMPACT_SELECTED_CANDIDATE_ID = "floor.exact_impact_band_source.metric_basis";
const EXACT_IMPACT_RUNTIME_BASIS = "exact_source_band_curve_iso7172";
const OPEN_BOX_PACKAGE_SELECTED_CANDIDATE_ID = "floor.open_box_timber.package_transfer_similarity";
const OPEN_BOX_PACKAGE_RUNTIME_BASIS =
  "broad_accuracy_floor_open_box_timber_similarity_package_transfer_formula_corridor";
const OPEN_WEB_SUPPORTED_SELECTED_CANDIDATE_ID = "floor.open_web.supported_band_similarity";
const OPEN_WEB_SUPPORTED_RUNTIME_BASIS = "predictor_lightweight_steel_open_web_supported_band_similarity_estimate";
const OPEN_BOX_RAW_SELECTED_CANDIDATE_ID = "floor.open_box_timber.raw_bare_source_absent";
const OPEN_BOX_RAW_RUNTIME_BASIS = "broad_accuracy_floor_open_box_timber_raw_bare_source_absent_formula_corridor";
const OPEN_WEB_RAW_SELECTED_CANDIDATE_ID = "floor.open_web.raw_bare_source_absent";
const OPEN_WEB_RAW_RUNTIME_BASIS = "broad_accuracy_floor_open_web_raw_bare_source_absent_formula_corridor";
const DIRECT_FIXED_SELECTED_CANDIDATE_ID = "floor.open_web.direct_fixed_lining.source_absent";
const DIRECT_FIXED_RUNTIME_BASIS =
  "broad_accuracy_floor_open_web_direct_fixed_lining_direct_source_interpolation_formula_corridor";
const HEAVY_FLOATING_SELECTED_CANDIDATE_ID = "floor.heavy_concrete_floating_floor.lab_impact_formula";
const HEAVY_FLOATING_RUNTIME_BASIS = "predictor_heavy_floating_floor_iso12354_annexc_estimate";
const HEAVY_PUBLISHED_UPPER_TREATMENT_SELECTED_CANDIDATE_ID =
  "floor.heavy_concrete_floating.published_upper_treatment_anchor_owned";
const HEAVY_PUBLISHED_UPPER_TREATMENT_RUNTIME_BASIS =
  "predictor_heavy_concrete_published_upper_treatment_estimate";
const NEEDS_INPUT_SELECTED_CANDIDATE_ID = "generic.required_input_owner.needs_input_boundary";
const OPENING_LEAK_BUILDING_SELECTED_CANDIDATE_ID =
  "candidate_company_internal_opening_leak_building_family_physics_prediction";
const OPENING_LEAK_BUILDING_RUNTIME_BASIS =
  "company_internal_opening_leak_building_area_energy_runtime_corridor";
const ASTM_UNSUPPORTED_SELECTED_CANDIDATE_ID = "generic.astm_iic_aiic.unsupported_boundary";
const ASTM_E989_SELECTED_CANDIDATE_ID = "floor.astm_e989_impact_rating.contour_runtime";
const ASTM_E989_RUNTIME_BASIS = "astm_e989_impact_rating_metric_schema_adapter_bridge";
const ASTM_E989_AIIC_METRIC_BASIS = "astm_e989_aiic_metric_schema_adapter_bridge";
const ASTM_E989_IIC_METRIC_BASIS = "astm_e989_iic_metric_schema_adapter_bridge";
const TARGET_OUTPUTS = [
  "Rw",
  "C",
  "Ctr",
  "Ln,w",
  "CI",
  "CI,50-2500",
  "Ln,w+CI",
  "L'n,w",
  "L'nT,w",
  "IIC"
] as const satisfies readonly RequestedOutputId[];
const SINGLE_LEAF_TARGET_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];
const DOUBLE_LEAF_TARGET_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];
const EXACT_WALL_TARGET_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];
const WALL_ANCHOR_DELTA_DIRECT_OUTPUTS = ["Rw"] as const satisfies readonly RequestedOutputId[];
const WALL_FIELD_TARGET_OUTPUTS = ["R'w", "DnT,w"] as const satisfies readonly RequestedOutputId[];
const WALL_UNSUPPORTED_BUILDING_TARGET_OUTPUTS = ["Rw", "STC", "R'w", "DnT,w"] as const satisfies readonly RequestedOutputId[];
const FLOOR_EXACT_MIXED_OUTPUTS = [
  "Rw",
  "STC",
  "C",
  "Ctr",
  "Ln,w",
  "CI",
  "CI,50-2500",
  "Ln,w+CI",
  "IIC"
] as const satisfies readonly RequestedOutputId[];
const EXACT_IMPACT_TARGET_OUTPUTS = [
  "Ln,w",
  "CI",
  "CI,50-2500",
  "Ln,w+CI",
  "DeltaLw",
  "IIC"
] as const satisfies readonly RequestedOutputId[];
const FLOOR_LAB_IMPACT_OUTPUTS = ["Ln,w", "DeltaLw"] as const satisfies readonly RequestedOutputId[];
const FLOOR_LAB_IMPACT_WITH_ASTM_OUTPUTS = ["Ln,w", "DeltaLw", "IIC"] as const satisfies readonly RequestedOutputId[];
const FLOOR_FIELD_IMPACT_OUTPUTS = ["L'n,w", "L'nT,w"] as const satisfies readonly RequestedOutputId[];
const FLOOR_ASTM_ONLY_OUTPUTS = ["IIC", "AIIC"] as const satisfies readonly RequestedOutputId[];

let originalEnv: Record<string, string | undefined>;

const HELPER_ONLY_OPEN_WEB_ROWS: readonly LayerDraft[] = [
  { floorRole: "ceiling_board", id: "board-a", materialId: "firestop_board", thicknessMm: "16" },
  { floorRole: "ceiling_board", id: "board-b", materialId: "firestop_board", thicknessMm: "16" },
  { floorRole: "ceiling_fill", id: "fill", materialId: "rockwool", thicknessMm: "145" },
  { floorRole: "ceiling_cavity", id: "cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: "65" },
  { floorRole: "base_structure", id: "open-web", materialId: "open_web_steel_floor", thicknessMm: "250" }
];

const EXACT_FLOOR_R5B_PACKAGE_ROWS: readonly LayerDraft[] = [
  { floorRole: "ceiling_board", id: "exact-floor-board-a", materialId: "gypsum_board", thicknessMm: "13" },
  { floorRole: "ceiling_board", id: "exact-floor-board-b", materialId: "gypsum_board", thicknessMm: "13" },
  { floorRole: "ceiling_fill", id: "exact-floor-fill", materialId: "rockwool", thicknessMm: "100" },
  { floorRole: "ceiling_cavity", id: "exact-floor-cavity", materialId: "resilient_stud_ceiling", thicknessMm: "25" },
  { floorRole: "floor_covering", id: "exact-floor-finish", materialId: "laminate_flooring", thicknessMm: "8" },
  { floorRole: "resilient_layer", id: "exact-floor-underlay", materialId: "eps_underlay", thicknessMm: "3" },
  { floorRole: "upper_fill", id: "exact-floor-fill-upper", materialId: "generic_fill", thicknessMm: "50" },
  {
    floorRole: "floating_screed",
    id: "exact-floor-floating-screed",
    materialId: "dry_floating_gypsum_fiberboard",
    thicknessMm: "60"
  },
  { floorRole: "base_structure", id: "exact-floor-base", materialId: "open_box_timber_slab", thicknessMm: "370" }
];

const DRY_GYPSUM_FIBER_SOURCE_ABSENT_ROWS: readonly LayerDraft[] = [
  { floorRole: "ceiling_board", id: "package-board-a", materialId: "gypsum_board", thicknessMm: "13" },
  { floorRole: "ceiling_board", id: "package-board-b", materialId: "gypsum_board", thicknessMm: "13" },
  { floorRole: "ceiling_fill", id: "package-fill", materialId: "rockwool", thicknessMm: "100" },
  { floorRole: "ceiling_cavity", id: "package-cavity", materialId: "resilient_stud_ceiling", thicknessMm: "25" },
  { floorRole: "floor_covering", id: "package-finish", materialId: "laminate_flooring", thicknessMm: "8" },
  { floorRole: "resilient_layer", id: "package-underlay", materialId: "eps_underlay", thicknessMm: "3" },
  { floorRole: "upper_fill", id: "package-upper-fill", materialId: "generic_fill", thicknessMm: "32" },
  {
    floorRole: "floating_screed",
    id: "package-floating-screed",
    materialId: "dry_floating_gypsum_fiberboard",
    thicknessMm: "45"
  },
  { floorRole: "base_structure", id: "package-base", materialId: "open_box_timber_slab", thicknessMm: "370" }
];

const SUPPORTED_BAND_PACKAGE_ROWS: readonly LayerDraft[] = [
  { floorRole: "ceiling_board", id: "supported-board-a", materialId: "firestop_board", thicknessMm: "16" },
  { floorRole: "ceiling_board", id: "supported-board-b", materialId: "firestop_board", thicknessMm: "16" },
  { floorRole: "ceiling_fill", id: "supported-fill", materialId: "rockwool", thicknessMm: "145" },
  { floorRole: "ceiling_cavity", id: "supported-cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: "65" },
  { floorRole: "floating_screed", id: "supported-inex", materialId: "inex_floor_panel", thicknessMm: "19" },
  { floorRole: "base_structure", id: "supported-base", materialId: "open_web_steel_floor", thicknessMm: "250" }
];

const RAW_OPEN_BOX_TIMBER_ROWS: readonly LayerDraft[] = [
  { floorRole: "base_structure", id: "raw-open-box", materialId: "open_box_timber_slab", thicknessMm: "370" }
];

const RAW_OPEN_WEB_ROWS: readonly LayerDraft[] = [
  { floorRole: "base_structure", id: "raw-open-web", materialId: "open_web_steel_floor", thicknessMm: "300" }
];

const DIRECT_FIXED_OPEN_WEB_ROWS: readonly LayerDraft[] = [
  { floorRole: "ceiling_board", id: "direct-board-a", materialId: "firestop_board", thicknessMm: "13" },
  { floorRole: "ceiling_board", id: "direct-board-b", materialId: "firestop_board", thicknessMm: "13" },
  {
    floorRole: "floor_covering",
    id: "direct-floor-covering",
    materialId: "engineered_timber_with_acoustic_underlay",
    thicknessMm: "20"
  },
  { floorRole: "floating_screed", id: "direct-inex", materialId: "inex_floor_panel", thicknessMm: "19" },
  { floorRole: "base_structure", id: "direct-base", materialId: "open_web_steel_floor", thicknessMm: "250" }
];

const EXACT_IMPACT_ASSEMBLY_FLOOR_ROWS: readonly LayerDraft[] = [
  { id: "exact-impact-tile", materialId: "ceramic_tile", thicknessMm: "8" },
  { id: "exact-impact-screed", materialId: "screed", thicknessMm: "50" },
  { id: "exact-impact-underlay", materialId: "generic_resilient_underlay", thicknessMm: "8" },
  { id: "exact-impact-concrete", materialId: "concrete", thicknessMm: "150" }
];

const EXACT_IMPACT_SOURCE_19 = {
  frequenciesHz: [50, 63, 80, 100, 125, 160, 200, 250, 315, 400, 500, 630, 800, 1000, 1250, 1600, 2000, 2500, 3150],
  labOrField: "lab",
  levelsDb: [60, 59, 58, 58, 57, 56, 55, 54, 53, 52, 51, 50, 49, 48, 47, 46, 45, 44, 43]
} as const satisfies ExactImpactSource;

const ASTM_E989_THIRD_OCTAVE_FREQS = [100, 125, 160, 200, 250, 315, 400, 500, 630, 800, 1000, 1250, 1600, 2000, 2500, 3150] as const;
const ASTM_E989_THIRD_OCTAVE_OFFSETS = [2, 2, 2, 2, 2, 2, 1, 0, -1, -2, -3, -6, -9, -12, -15, -18] as const;

function buildAstmE989Levels(baseContourPlusDeficiencyDb: number): number[] {
  return ASTM_E989_THIRD_OCTAVE_OFFSETS.map((offset) => baseContourPlusDeficiencyDb + offset);
}

const EXACT_ASTM_LAB_IIC_SOURCE = {
  frequenciesHz: [...ASTM_E989_THIRD_OCTAVE_FREQS],
  labOrField: "lab",
  label: "Gate G ASTM E492 lab impact source",
  levelsDb: buildAstmE989Levels(62),
  standardMethod: "ASTM E492 / ASTM E989"
} as const satisfies ExactImpactSource;

const EXACT_ASTM_FIELD_AIIC_SOURCE = {
  ...EXACT_ASTM_LAB_IIC_SOURCE,
  labOrField: "field",
  label: "Gate G ASTM E1007 field impact source",
  standardMethod: "ASTM E1007 / ASTM E989"
} as const satisfies ExactImpactSource;

const HEAVY_FLOATING_FLOOR_ROWS: readonly LayerDraft[] = [
  { floorRole: "base_structure", id: "heavy-base", materialId: "concrete", thicknessMm: "150" },
  {
    floorRole: "resilient_layer",
    id: "heavy-underlay",
    materialId: "generic_resilient_underlay_s30",
    thicknessMm: "8"
  },
  { floorRole: "floating_screed", id: "heavy-screed", materialId: "screed", thicknessMm: "30" },
  { floorRole: "floor_covering", id: "heavy-tile", materialId: "ceramic_tile", thicknessMm: "8" }
];

const HEAVY_FLOATING_FLOOR_IMPACT_CONTEXT = {
  loadBasisKgM2: 76,
  resilientLayerDynamicStiffnessMNm3: 30
} as const;

const SINGLE_LEAF_GYPSUM_ROWS: readonly LayerDraft[] = [
  { id: "single-leaf-board", materialId: "gypsum_board", thicknessMm: "12.5" }
];

const DOUBLE_LEAF_ROWS: readonly LayerDraft[] = [
  { id: "double-leaf-side-a", materialId: "gypsum_board", thicknessMm: "12.5" },
  { id: "double-leaf-cavity", materialId: "rockwool", thicknessMm: "90" },
  { id: "double-leaf-side-b", materialId: "gypsum_board", thicknessMm: "12.5" }
];

const DOUBLE_LEAF_RESILIENT_CONTEXT: AirborneContext = {
  connectionType: "resilient_channel",
  contextMode: "element_lab",
  resilientBarSideCount: "both_sides",
  studSpacingMm: 600,
  wallTopology: {
    cavity1AbsorptionClass: "porous_absorptive",
    cavity1DepthMm: 75,
    cavity1FillCoverage: "full",
    cavity1LayerIndices: [1],
    sideALeafLayerIndices: [0],
    sideBLeafLayerIndices: [2],
    supportTopology: "resilient_channel",
    topologyMode: "double_leaf_framed"
  }
};

const EXACT_LSF_ROWS: readonly LayerDraft[] = [
  { id: "exact-side-a-1", materialId: "acoustic_gypsum_board", thicknessMm: "12.5" },
  { id: "exact-side-a-2", materialId: "acoustic_gypsum_board", thicknessMm: "12.5" },
  { id: "exact-gap", materialId: "air_gap", thicknessMm: "5" },
  { id: "exact-fill", materialId: "glasswool", thicknessMm: "70" },
  { id: "exact-side-b-1", materialId: "acoustic_gypsum_board", thicknessMm: "12.5" },
  { id: "exact-side-b-2", materialId: "acoustic_gypsum_board", thicknessMm: "12.5" }
];

const EXACT_LSF_PLUS_OUTER_BOARD_ROWS: readonly LayerDraft[] = [
  ...EXACT_LSF_ROWS,
  { id: "exact-side-b-extra", materialId: "acoustic_gypsum_board", thicknessMm: "12.5" }
];

const EXACT_LSF_CONTEXT: AirborneContext = {
  airtightness: "good",
  connectionType: "line_connection",
  contextMode: "element_lab",
  studSpacingMm: 600,
  studType: "light_steel_stud"
};

const LINED_MASSIVE_WALL_ROWS: readonly LayerDraft[] = [
  { id: "field-lining", materialId: "gypsum_board", thicknessMm: "12.5" },
  { id: "field-gap", materialId: "air_gap", thicknessMm: "40" },
  { id: "field-fill", materialId: "rockwool", thicknessMm: "40" },
  { id: "field-core", materialId: "concrete", thicknessMm: "160" }
];

const COMPLETE_FIELD_CONTEXT: AirborneContext = {
  contextMode: "field_between_rooms",
  panelHeightMm: 2700,
  panelWidthMm: 4000,
  receivingRoomRt60S: 0.55,
  receivingRoomVolumeM3: 42
};

const PARTIAL_FIELD_CONTEXT: AirborneContext = {
  contextMode: "field_between_rooms"
};

const OPENING_BUILDING_CONTEXT: AirborneContext = {
  airtightness: "good",
  buildingPredictionOutputBasis: "apparent_and_standardized",
  conservativeFlankingAssumption: "multi_path_conservative",
  contextMode: "building_prediction",
  flankingJunctionClass: "rigid_t_junction",
  hostWallAreaM2: 12,
  junctionCouplingLengthM: 4.8,
  openingLeakElements: [
    {
      areaM2: 1.8,
      count: 1,
      elementRwDb: 32,
      id: "door-01",
      origin: "catalogued",
      ratingBasis: "rw_single_number",
      sealLeakageClass: "average"
    }
  ],
  panelHeightMm: 2700,
  panelWidthMm: 4000,
  receivingRoomRt60S: 0.55,
  receivingRoomVolumeM3: 42,
  sourceRoomVolumeM3: 38
};

function createMemoryStorage(): Storage {
  const entries = new Map<string, string>();

  return {
    clear: () => entries.clear(),
    getItem: (key) => entries.get(key) ?? null,
    key: (index) => Array.from(entries.keys())[index] ?? null,
    get length() {
      return entries.size;
    },
    removeItem: (key) => {
      entries.delete(key);
    },
    setItem: (key, value) => {
      entries.set(key, value);
    }
  };
}

function jsonRequest(url: string, payload: unknown) {
  return new Request(url, {
    body: JSON.stringify(payload),
    headers: {
      "content-type": "application/json"
    },
    method: "POST"
  });
}

function withoutIds(rows: readonly LayerDraft[]): Array<Omit<LayerDraft, "id">> {
  return rows.map((row) => ({
    floorRole: row.floorRole,
    materialId: row.materialId,
    thicknessMm: row.thicknessMm
  }));
}

function toLayerInputs(rows: readonly LayerDraft[]): LayerInput[] {
  return rows.map((row) => ({
    floorRole: row.floorRole,
    materialId: row.materialId,
    thicknessMm: Number.parseFloat(row.thicknessMm.replace(",", "."))
  }));
}

function buildScenario(input: {
  airborneContext?: AirborneContext;
  exactImpactSource?: ExactImpactSource | null;
  id?: string;
  impactFieldContext?: ImpactFieldContext | null;
  rows?: readonly LayerDraft[];
  source?: "current" | "saved";
  studyMode?: "floor" | "wall";
  targetOutputs?: readonly RequestedOutputId[];
} = {}): EvaluatedScenario & { result: AssemblyCalculation } {
  const scenario = evaluateScenario({
    airborneContext: input.airborneContext,
    calculator: "dynamic",
    exactImpactSource: input.exactImpactSource,
    id: input.id ?? "resolver-candidate-surface",
    impactFieldContext: input.impactFieldContext,
    name: "Resolver candidate surface",
    rows: input.rows ?? HELPER_ONLY_OPEN_WEB_ROWS,
    savedAtIso: input.source === "saved" ? "2026-05-21T10:00:00.000Z" : undefined,
    source: input.source ?? "current",
    studyMode: input.studyMode ?? "floor",
    targetOutputs: input.targetOutputs ?? TARGET_OUTPUTS
  });

  if (!scenario.result) {
    throw new Error("Resolver candidate surface scenario did not evaluate.");
  }

  return scenario as EvaluatedScenario & { result: AssemblyCalculation };
}

function buildWallScenario(input: {
  airborneContext?: AirborneContext;
  id: string;
  rows: readonly LayerDraft[];
  targetOutputs: readonly RequestedOutputId[];
}): EvaluatedScenario & { result: AssemblyCalculation } {
  return buildScenario({
    airborneContext: input.airborneContext,
    id: input.id,
    rows: input.rows,
    studyMode: "wall",
    targetOutputs: input.targetOutputs
  });
}

function buildSingleLeafWallScenario(): EvaluatedScenario & { result: AssemblyCalculation } {
  return buildScenario({
    id: "single-leaf-resolver-candidate-surface",
    rows: SINGLE_LEAF_GYPSUM_ROWS,
    studyMode: "wall",
    targetOutputs: SINGLE_LEAF_TARGET_OUTPUTS
  });
}

function buildDoubleLeafWallScenario(input: {
  airborneContext?: AirborneContext;
  id?: string;
  rows?: readonly LayerDraft[];
  source?: "current" | "saved";
  targetOutputs?: readonly RequestedOutputId[];
} = {}): EvaluatedScenario & { result: AssemblyCalculation } {
  const scenario = evaluateScenario({
    airborneContext: input.airborneContext ?? DOUBLE_LEAF_RESILIENT_CONTEXT,
    calculator: "dynamic",
    id: input.id ?? "double-leaf-resolver-candidate-surface",
    name: "Double-leaf resolver candidate surface",
    rows: input.rows ?? DOUBLE_LEAF_ROWS,
    savedAtIso: input.source === "saved" ? "2026-05-21T11:00:00.000Z" : undefined,
    source: input.source ?? "current",
    studyMode: "wall",
    targetOutputs: input.targetOutputs ?? DOUBLE_LEAF_TARGET_OUTPUTS
  });

  if (!scenario.result) {
    throw new Error("Double-leaf resolver candidate surface scenario did not evaluate.");
  }

  return scenario as EvaluatedScenario & { result: AssemblyCalculation };
}

function expectResolverCandidate(result: AssemblyCalculation | ImpactOnlyCalculation | null | undefined): void {
  const trace = getLayerCombinationResolverCandidateSurface(result);

  expect(trace).toMatchObject({
    boundaryCandidateIds: ["generic.astm_iic_aiic.unsupported_boundary"],
    candidateKind: "source_absent_family_solver",
    noRuntimeValueMovement: true,
    requestedBasis: "element_lab",
    route: "floor",
    runtimeBasisId: HELPER_ONLY_BASIS,
    selectedCandidateId: SELECTED_CANDIDATE_ID,
    supportBucket: "source_absent_estimate",
    supportedMetrics: ["Rw", "C", "Ctr", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"],
    valuePins: expect.arrayContaining([
      { metric: "Rw", value: 46.7 },
      { metric: "C", value: -1.7 },
      { metric: "Ctr", value: -7.9 },
      { metric: "Ln,w", value: 59.6 },
      { metric: "CI", value: 1 },
      { metric: "CI,50-2500", value: 4 },
      { metric: "Ln,w+CI", value: 60.6 }
    ])
  });
  expect(trace?.surfaceDetail).toContain(SELECTED_CANDIDATE_ID);
  expect(trace?.surfaceDetail).toContain("scenario-specific");
  expect(result?.impact).toMatchObject({
    CI50_2500: 4,
    LnW: 59.6,
    basis: HELPER_ONLY_BASIS
  });
  expect(result?.unsupportedTargetOutputs).toEqual(["L'n,w", "L'nT,w", "IIC"]);
}

function expectDoubleLeafResolverCandidate(result: AssemblyCalculation | null | undefined): void {
  const trace = getLayerCombinationResolverCandidateSurface(result);

  expect(trace).toMatchObject({
    candidateKind: "source_absent_family_solver",
    errorBudgetMetrics: ["Rw", "C", "Ctr", "STC"],
    noRuntimeValueMovement: true,
    requestedBasis: "element_lab",
    route: "wall",
    runtimeBasisId: DOUBLE_LEAF_BASIS,
    selectedCandidateId: DOUBLE_LEAF_SELECTED_CANDIDATE_ID,
    supportBucket: "source_absent_estimate",
    valuePins: expect.arrayContaining([
      { metric: "Rw", value: 46 },
      { metric: "STC", value: 46 },
      { metric: "C", value: -1.1 },
      { metric: "Ctr", value: -6.2 }
    ])
  });
  expect(trace?.surfaceDetail).toContain("scenario-specific");
  expect(result?.metrics).toMatchObject({
    estimatedCDb: -1.1,
    estimatedCtrDb: -6.2,
    estimatedRwDb: 46,
    estimatedStc: 46
  });
}

function buildReport(scenario: EvaluatedScenario): string {
  return composeWorkbenchReport({
    activeCriteriaPack: CRITERIA_PACKS[0],
    activePreset: getPresetById("heavy_concrete_impact_floor"),
    briefNote: "",
    clientName: "Broad Accuracy",
    currentScenario: scenario,
    fieldRiskIds: [],
    impactGuide: null,
    impactImprovementBandInput: "",
    impactReference: null,
    impactReferenceDeltaLwDb: "",
    improvementReferenceImpact: null,
    projectName: "Resolver Candidate Surface",
    reportProfile: "consultant",
    requestedOutputs: TARGET_OUTPUTS,
    savedScenarios: [],
    studyContext: "coordination",
    studyMode: "floor",
    targetLnwDb: "60",
    targetRwDb: "47"
  });
}

function buildSingleLeafReport(scenario: EvaluatedScenario): string {
  return composeWorkbenchReport({
    activeCriteriaPack: CRITERIA_PACKS[0],
    activePreset: getPresetById("heavy_concrete_impact_floor"),
    briefNote: "",
    clientName: "Broad Accuracy",
    currentScenario: scenario,
    fieldRiskIds: [],
    impactGuide: null,
    impactImprovementBandInput: "",
    impactReference: null,
    impactReferenceDeltaLwDb: "",
    improvementReferenceImpact: null,
    projectName: "Single Leaf Resolver Candidate Surface",
    reportProfile: "consultant",
    requestedOutputs: SINGLE_LEAF_TARGET_OUTPUTS,
    savedScenarios: [],
    studyContext: "coordination",
    studyMode: "wall",
    targetLnwDb: "",
    targetRwDb: "35"
  });
}

function buildDoubleLeafReport(scenario: EvaluatedScenario): string {
  return composeWorkbenchReport({
    activeCriteriaPack: CRITERIA_PACKS[0],
    activePreset: getPresetById("concrete_wall"),
    briefNote: "",
    clientName: "Broad Accuracy",
    currentScenario: scenario,
    fieldRiskIds: [],
    impactGuide: null,
    impactImprovementBandInput: "",
    impactReference: null,
    impactReferenceDeltaLwDb: "",
    improvementReferenceImpact: null,
    projectName: "Double Leaf Resolver Candidate Surface",
    reportProfile: "consultant",
    requestedOutputs: DOUBLE_LEAF_TARGET_OUTPUTS,
    savedScenarios: [],
    studyContext: "coordination",
    studyMode: "wall",
    targetLnwDb: "",
    targetRwDb: "45"
  });
}

function buildWallReport(input: {
  requestedOutputs: readonly RequestedOutputId[];
  scenario: EvaluatedScenario;
  title: string;
}): string {
  return composeWorkbenchReport({
    activeCriteriaPack: CRITERIA_PACKS[0],
    activePreset: getPresetById("concrete_wall"),
    briefNote: "",
    clientName: "Broad Accuracy",
    currentScenario: input.scenario,
    fieldRiskIds: [],
    impactGuide: null,
    impactImprovementBandInput: "",
    impactReference: null,
    impactReferenceDeltaLwDb: "",
    improvementReferenceImpact: null,
    projectName: input.title,
    reportProfile: "consultant",
    requestedOutputs: input.requestedOutputs,
    savedScenarios: [],
    studyContext: "coordination",
    studyMode: "wall",
    targetLnwDb: "",
    targetRwDb: "55"
  });
}

function buildFloorReport(input: {
  requestedOutputs: readonly RequestedOutputId[];
  scenario: EvaluatedScenario;
  title: string;
}): string {
  return composeWorkbenchReport({
    activeCriteriaPack: CRITERIA_PACKS[0],
    activePreset: getPresetById("heavy_concrete_impact_floor"),
    briefNote: "",
    clientName: "Broad Accuracy",
    currentScenario: input.scenario,
    fieldRiskIds: [],
    impactGuide: null,
    impactImprovementBandInput: "",
    impactReference: null,
    impactReferenceDeltaLwDb: "",
    improvementReferenceImpact: null,
    projectName: input.title,
    reportProfile: "consultant",
    requestedOutputs: input.requestedOutputs,
    savedScenarios: [],
    studyContext: "coordination",
    studyMode: "floor",
    targetLnwDb: "60",
    targetRwDb: "47"
  });
}

function buildFloorScenarioFromResult(input: {
  id: string;
  result: AssemblyCalculation;
  rows: readonly LayerDraft[];
}): EvaluatedScenario & { result: AssemblyCalculation } {
  return {
    id: input.id,
    name: "Resolver candidate surface",
    result: input.result,
    rows: input.rows,
    source: "current",
    studyMode: "floor",
    warnings: input.result.warnings
  };
}

async function estimateAssemblyViaApi(input: {
  airborneContext?: AirborneContext | null;
  exactImpactSource?: ExactImpactSource | null;
  floorImpactContext?: {
    loadBasisKgM2?: number;
    resilientLayerDynamicStiffnessMNm3?: number;
  } | null;
  impactFieldContext?: ImpactFieldContext | null;
  rows: readonly LayerDraft[];
  targetOutputs: readonly RequestedOutputId[];
}): Promise<AssemblyCalculation> {
  const { POST: estimate } = await import("../../app/api/estimate/route");
  const estimateResponse = await estimate(
    jsonRequest("http://localhost/api/estimate", {
      airborneContext: input.airborneContext ?? undefined,
      calculator: "dynamic",
      exactImpactSource: input.exactImpactSource ?? undefined,
      floorImpactContext: input.floorImpactContext ?? undefined,
      impactFieldContext: input.impactFieldContext ?? undefined,
      layers: toLayerInputs(input.rows),
      targetOutputs: input.targetOutputs
    })
  );
  const estimateBody = (await estimateResponse.json()) as {
    ok?: boolean;
    result?: AssemblyCalculation;
  };

  expect(estimateResponse.status).toBe(200);
  expect(estimateBody.ok).toBe(true);
  expect(estimateBody.result).toBeDefined();

  return estimateBody.result as AssemblyCalculation;
}

async function saveCompleteScenario(): Promise<ScenarioSnapshot> {
  const { useWorkbenchStore } = await import("./workbench-store");
  const store = useWorkbenchStore.getState();

  store.reset();
  store.startStudyMode("floor");
  store.clearRows();
  store.appendRows(withoutIds(HELPER_ONLY_OPEN_WEB_ROWS));
  store.setRequestedOutputs([...TARGET_OUTPUTS]);
  store.saveCurrentScenario();

  const savedSnapshot = useWorkbenchStore.getState().savedScenarios[0];
  if (!savedSnapshot) {
    throw new Error("Expected the workbench store to save the resolver candidate snapshot.");
  }

  return savedSnapshot;
}

function parsePositiveNumber(value: string | undefined): number | undefined {
  if (!value) {
    return undefined;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
}

function buildDoubleLeafContextFromSnapshot(snapshot: ScenarioSnapshot): AirborneContext {
  const wallTopology = buildWorkbenchWallTopology(snapshot, snapshot.rows.length);
  if (!wallTopology) {
    throw new Error("Expected a saved double-leaf wall topology.");
  }

  const context: AirborneContext = {
    contextMode: snapshot.airborneContextMode,
    wallTopology
  };
  const studSpacingMm = parsePositiveNumber(snapshot.airborneStudSpacingMm);

  if (snapshot.airborneConnectionType !== "auto") {
    context.connectionType = snapshot.airborneConnectionType;
  }
  if (snapshot.airborneResilientBarSideCount) {
    context.resilientBarSideCount = snapshot.airborneResilientBarSideCount;
  }
  if (typeof studSpacingMm === "number") {
    context.studSpacingMm = studSpacingMm;
  }

  return context;
}

function buildFieldContextFromSnapshot(snapshot: ScenarioSnapshot): AirborneContext {
  const context: AirborneContext = {
    contextMode: snapshot.airborneContextMode
  };
  const panelHeightMm = parsePositiveNumber(snapshot.airbornePanelHeightMm);
  const panelWidthMm = parsePositiveNumber(snapshot.airbornePanelWidthMm);
  const receivingRoomRt60S = parsePositiveNumber(snapshot.airborneReceivingRoomRt60S);
  const receivingRoomVolumeM3 = parsePositiveNumber(snapshot.airborneReceivingRoomVolumeM3);

  if (typeof panelHeightMm === "number") {
    context.panelHeightMm = panelHeightMm;
  }
  if (typeof panelWidthMm === "number") {
    context.panelWidthMm = panelWidthMm;
  }
  if (typeof receivingRoomRt60S === "number") {
    context.receivingRoomRt60S = receivingRoomRt60S;
  }
  if (typeof receivingRoomVolumeM3 === "number") {
    context.receivingRoomVolumeM3 = receivingRoomVolumeM3;
  }

  return context;
}

async function saveDoubleLeafScenario(): Promise<ScenarioSnapshot> {
  const { useWorkbenchStore } = await import("./workbench-store");
  const store = useWorkbenchStore.getState();

  store.reset();
  store.startStudyMode("wall");
  store.clearRows();
  store.appendRows(withoutIds(DOUBLE_LEAF_ROWS));
  store.setRequestedOutputs([...DOUBLE_LEAF_TARGET_OUTPUTS]);
  store.setAirborneConnectionType("resilient_channel");
  store.setAirborneResilientBarSideCount("both_sides");
  store.setAirborneStudSpacingMm("600");
  store.setAirborneWallTopologyMode("double_leaf_framed");
  store.setAirborneWallSideALeafLayerIndices("1");
  store.setAirborneWallCavity1LayerIndices("2");
  store.setAirborneWallCavity1DepthMm("75");
  store.setAirborneWallCavity1FillCoverage("full");
  store.setAirborneWallCavity1AbsorptionClass("porous_absorptive");
  store.setAirborneWallSideBLeafLayerIndices("3");
  store.setAirborneWallSupportTopology("resilient_channel");
  store.saveCurrentScenario();

  const savedSnapshot = useWorkbenchStore.getState().savedScenarios[0];
  if (!savedSnapshot) {
    throw new Error("Expected the workbench store to save the double-leaf snapshot.");
  }

  return savedSnapshot;
}

async function savePartialFieldScenario(): Promise<ScenarioSnapshot> {
  const { useWorkbenchStore } = await import("./workbench-store");
  const store = useWorkbenchStore.getState();

  store.reset();
  store.startStudyMode("wall");
  store.clearRows();
  store.appendRows(withoutIds(LINED_MASSIVE_WALL_ROWS));
  store.setRequestedOutputs([...WALL_FIELD_TARGET_OUTPUTS]);
  store.setAirborneContextMode("field_between_rooms");
  store.saveCurrentScenario();

  const savedSnapshot = useWorkbenchStore.getState().savedScenarios[0];
  if (!savedSnapshot) {
    throw new Error("Expected the workbench store to save the partial field snapshot.");
  }

  return savedSnapshot;
}

async function saveFloorMissingLoadScenario(): Promise<ScenarioSnapshot> {
  const { useWorkbenchStore } = await import("./workbench-store");
  const store = useWorkbenchStore.getState();

  store.reset();
  store.startStudyMode("floor");
  store.clearRows();
  store.appendRows(withoutIds(HEAVY_FLOATING_FLOOR_ROWS));
  store.setRequestedOutputs([...FLOOR_LAB_IMPACT_OUTPUTS]);
  store.saveCurrentScenario();

  const savedSnapshot = useWorkbenchStore.getState().savedScenarios[0];
  if (!savedSnapshot) {
    throw new Error("Expected the workbench store to save the floor missing-load snapshot.");
  }

  return savedSnapshot;
}

beforeEach(() => {
  originalEnv = Object.fromEntries(AUTH_ENV_KEYS.map((key) => [key, process.env[key]] as const));
  vi.stubGlobal("localStorage", createMemoryStorage());

  for (const key of AUTH_ENV_KEYS) {
    process.env[key] = "";
  }
});

afterEach(() => {
  for (const [key, value] of Object.entries(originalEnv)) {
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }
  vi.unstubAllGlobals();
});

describe("layer combination resolver candidate surface parity", () => {
  it("shows the candidate trace on the workbench result and Markdown report", () => {
    const scenario = buildScenario();

    expectResolverCandidate(scenario.result);
    expect(getLayerCombinationResolverCandidateReportLines(scenario.result)).toEqual(
      expect.arrayContaining([
        `- Resolver candidate id: ${SELECTED_CANDIDATE_ID}`,
        "- Resolver candidate kind: source_absent_family_solver",
        "- Resolver support bucket: source_absent_estimate",
        "- Resolver route / basis: floor / element_lab",
        `- Resolver runtime basis: ${HELPER_ONLY_BASIS}`,
        "- Resolver boundary candidates: generic.astm_iic_aiic.unsupported_boundary"
      ])
    );

    const report = buildReport(scenario);
    expect(report).toContain(`- Resolver candidate id: ${SELECTED_CANDIDATE_ID}`);
    expect(report).toContain("- Resolver candidate kind: source_absent_family_solver");
    expect(report).toContain("- Resolver support bucket: source_absent_estimate");
    expect(report).toContain(`- Resolver runtime basis: ${HELPER_ONLY_BASIS}`);
    expect(report).toContain("- Resolver boundary candidates: generic.astm_iic_aiic.unsupported_boundary");
    expect(report).toContain(
      "- Resolver value pins: Rw 46.7, C -1.7, Ctr -7.9, Ln,w 59.6, CI 1, CI,50-2500 4, Ln,w+CI 60.6"
    );
  });

  it("keeps local saved replay and server snapshot replay on the same candidate trace", async () => {
    const savedSnapshot = await saveCompleteScenario();
    const savedScenario = buildScenario({
      id: "resolver-candidate-saved",
      rows: savedSnapshot.rows,
      source: "saved",
      targetOutputs: savedSnapshot.requestedOutputs
    });

    expectResolverCandidate(savedScenario.result);

    const parsedServerSnapshot = parseServerProjectWorkbenchSnapshot(
      buildServerProjectWorkbenchSnapshot(savedSnapshot)
    );
    expect(parsedServerSnapshot).not.toBeNull();

    const serverScenario = buildScenario({
      id: "resolver-candidate-server",
      rows: parsedServerSnapshot?.rows ?? [],
      source: "saved",
      targetOutputs: parsedServerSnapshot?.requestedOutputs ?? TARGET_OUTPUTS
    });
    expectResolverCandidate(serverScenario.result);
  });

  it("keeps calculator and impact-only API payloads on the same candidate trace", async () => {
    const layers = toLayerInputs(HELPER_ONLY_OPEN_WEB_ROWS);
    const { POST: estimate } = await import("../../app/api/estimate/route");
    const { POST: impactOnly } = await import("../../app/api/impact-only/route");

    const estimateResponse = await estimate(
      jsonRequest("http://localhost/api/estimate", {
        calculator: "dynamic",
        layers,
        targetOutputs: TARGET_OUTPUTS
      })
    );
    const estimateBody = (await estimateResponse.json()) as {
      ok?: boolean;
      result?: AssemblyCalculation;
    };

    expect(estimateResponse.status).toBe(200);
    expect(estimateBody.ok).toBe(true);
    expectResolverCandidate(estimateBody.result);

    const impactResponse = await impactOnly(
      jsonRequest("http://localhost/api/impact-only", {
        layers,
        sourceLayers: layers,
        targetOutputs: TARGET_OUTPUTS
      })
    );
    const impactBody = (await impactResponse.json()) as {
      ok?: boolean;
      result?: ImpactOnlyCalculation;
    };

    expect(impactResponse.status).toBe(200);
    expect(impactBody.ok).toBe(true);
    expectResolverCandidate(impactBody.result);
    expect(impactBody.result?.impact?.LPrimeNW).toBeUndefined();
    expect(impactBody.result?.impact?.LPrimeNTw).toBeUndefined();
  });

  it("shows the single-leaf wall mass-law candidate on workbench, report, and calculator API surfaces", async () => {
    const scenario = buildSingleLeafWallScenario();
    const trace = getLayerCombinationResolverCandidateSurface(scenario.result);

    expect(trace).toMatchObject({
      candidateKind: "source_absent_family_solver",
      errorBudgetMetrics: ["Rw", "STC"],
      requestedBasis: "element_lab",
      route: "wall",
      runtimeBasisId: SINGLE_LEAF_BASIS,
      selectedCandidateId: SINGLE_LEAF_SELECTED_CANDIDATE_ID,
      supportBucket: "source_absent_estimate",
      valuePins: expect.arrayContaining([
        { metric: "Rw", value: 31 },
        { metric: "STC", value: 31 }
      ])
    });
    expect(scenario.result.metrics).toMatchObject({
      estimatedRwDb: 31,
      estimatedStc: 31
    });

    const report = buildSingleLeafReport(scenario);
    expect(report).toContain(`- Resolver candidate id: ${SINGLE_LEAF_SELECTED_CANDIDATE_ID}`);
    expect(report).toContain(`- Resolver runtime basis: ${SINGLE_LEAF_BASIS}`);
    expect(report).toContain("- Resolver route / basis: wall / element_lab");
    expect(report).toContain("- Resolver value pins: Rw 31, STC 31");

    const { POST: estimate } = await import("../../app/api/estimate/route");
    const estimateResponse = await estimate(
      jsonRequest("http://localhost/api/estimate", {
        calculator: "dynamic",
        layers: toLayerInputs(SINGLE_LEAF_GYPSUM_ROWS),
        targetOutputs: SINGLE_LEAF_TARGET_OUTPUTS
      })
    );
    const estimateBody = (await estimateResponse.json()) as {
      ok?: boolean;
      result?: AssemblyCalculation;
    };

    expect(estimateResponse.status).toBe(200);
    expect(estimateBody.ok).toBe(true);
    expect(getLayerCombinationResolverCandidateSurface(estimateBody.result)).toMatchObject({
      runtimeBasisId: SINGLE_LEAF_BASIS,
      selectedCandidateId: SINGLE_LEAF_SELECTED_CANDIDATE_ID,
      valuePins: expect.arrayContaining([{ metric: "Rw", value: 31 }])
    });
  });

  it("shows the double-leaf framed wall candidate on workbench, report, saved replay, server replay, and calculator API surfaces", async () => {
    const scenario = buildDoubleLeafWallScenario();
    expectDoubleLeafResolverCandidate(scenario.result);

    const report = buildDoubleLeafReport(scenario);
    expect(report).toContain(`- Resolver candidate id: ${DOUBLE_LEAF_SELECTED_CANDIDATE_ID}`);
    expect(report).toContain(`- Resolver runtime basis: ${DOUBLE_LEAF_BASIS}`);
    expect(report).toContain("- Resolver route / basis: wall / element_lab");
    expect(report).toContain("- Resolver value pins: Rw 46, STC 46, C -1.1, Ctr -6.2");

    const savedSnapshot = await saveDoubleLeafScenario();
    expect(savedSnapshot.airborneWallTopologyMode).toBe("double_leaf_framed");
    expect(savedSnapshot.airborneWallCavity1DepthMm).toBe("75");
    expect(savedSnapshot.airborneResilientBarSideCount).toBe("both_sides");

    const savedScenario = buildDoubleLeafWallScenario({
      airborneContext: buildDoubleLeafContextFromSnapshot(savedSnapshot),
      id: "double-leaf-resolver-candidate-saved",
      rows: savedSnapshot.rows,
      source: "saved",
      targetOutputs: savedSnapshot.requestedOutputs
    });
    expectDoubleLeafResolverCandidate(savedScenario.result);

    const parsedServerSnapshot = parseServerProjectWorkbenchSnapshot(
      buildServerProjectWorkbenchSnapshot(savedSnapshot)
    );
    expect(parsedServerSnapshot).not.toBeNull();
    expect(parsedServerSnapshot?.airborneWallTopologyMode).toBe("double_leaf_framed");

    const serverScenario = buildDoubleLeafWallScenario({
      airborneContext: buildDoubleLeafContextFromSnapshot(parsedServerSnapshot!),
      id: "double-leaf-resolver-candidate-server",
      rows: parsedServerSnapshot?.rows ?? [],
      source: "saved",
      targetOutputs: parsedServerSnapshot?.requestedOutputs ?? DOUBLE_LEAF_TARGET_OUTPUTS
    });
    expectDoubleLeafResolverCandidate(serverScenario.result);

    const { POST: estimate } = await import("../../app/api/estimate/route");
    const estimateResponse = await estimate(
      jsonRequest("http://localhost/api/estimate", {
        airborneContext: DOUBLE_LEAF_RESILIENT_CONTEXT,
        calculator: "dynamic",
        layers: toLayerInputs(DOUBLE_LEAF_ROWS),
        targetOutputs: DOUBLE_LEAF_TARGET_OUTPUTS
      })
    );
    const estimateBody = (await estimateResponse.json()) as {
      ok?: boolean;
      result?: AssemblyCalculation;
    };

    expect(estimateResponse.status).toBe(200);
    expect(estimateBody.ok).toBe(true);
    expectDoubleLeafResolverCandidate(estimateBody.result);
  });

  it("keeps exact measured wall metric scope aligned across cards, report, and calculator API", async () => {
    const scenario = buildWallScenario({
      airborneContext: EXACT_LSF_CONTEXT,
      id: "wall-v1-exact-resolver-surface",
      rows: EXACT_LSF_ROWS,
      targetOutputs: EXACT_WALL_TARGET_OUTPUTS
    });
    const trace = getLayerCombinationResolverCandidateSurface(scenario.result);

    expect(trace).toMatchObject({
      candidateKind: "source_absent_family_solver",
      requestedBasis: "element_lab",
      route: "wall",
      runtimeBasisId: WALL_EXACT_LSF_LAB_COMPANION_RUNTIME_BASIS,
      selectedCandidateId: WALL_EXACT_LSF_LAB_COMPANION_SELECTED_CANDIDATE_ID,
      supportBucket: "source_absent_estimate",
      supportedMetrics: ["Rw", "STC", "C", "Ctr"],
      valuePins: [
        { metric: "Rw", value: 55 },
        { metric: "STC", value: 55 },
        { metric: "C", value: -1.5 },
        { metric: "Ctr", value: -6.4 }
      ]
    });
    expect(scenario.result.unsupportedTargetOutputs).toEqual([]);
    expect(buildOutputCard({ output: "Rw", result: scenario.result, studyMode: "wall" })).toMatchObject({
      label: "Rw",
      status: "live",
      value: "55 dB"
    });
    expect(buildOutputCard({ output: "STC", result: scenario.result, studyMode: "wall" })).toMatchObject({
      label: "STC",
      status: "live",
      value: "55 dB"
    });

    const report = buildWallReport({
      requestedOutputs: EXACT_WALL_TARGET_OUTPUTS,
      scenario,
      title: "Wall V1 Exact Resolver Surface"
    });
    expect(report).toContain(`- Resolver candidate id: ${WALL_EXACT_LSF_LAB_COMPANION_SELECTED_CANDIDATE_ID}`);
    expect(report).toContain(`- Resolver runtime basis: ${WALL_EXACT_LSF_LAB_COMPANION_RUNTIME_BASIS}`);
    expect(report).toContain("- Resolver route / basis: wall / element_lab");
    expect(report).toContain("- Resolver supported metrics: Rw, STC, C, Ctr");
    expect(report).toContain("- Resolver value pins: Rw 55, STC 55, C -1.5, Ctr -6.4");

    const { POST: estimate } = await import("../../app/api/estimate/route");
    const estimateResponse = await estimate(
      jsonRequest("http://localhost/api/estimate", {
        airborneContext: EXACT_LSF_CONTEXT,
        calculator: "dynamic",
        layers: toLayerInputs(EXACT_LSF_ROWS),
        targetOutputs: EXACT_WALL_TARGET_OUTPUTS
      })
    );
    const estimateBody = (await estimateResponse.json()) as {
      ok?: boolean;
      result?: AssemblyCalculation;
    };

    expect(estimateResponse.status).toBe(200);
    expect(estimateBody.ok).toBe(true);
    expect(getLayerCombinationResolverCandidateSurface(estimateBody.result)).toMatchObject({
      selectedCandidateId: WALL_EXACT_LSF_LAB_COMPANION_SELECTED_CANDIDATE_ID,
      supportedMetrics: ["Rw", "STC", "C", "Ctr"],
      valuePins: [
        { metric: "Rw", value: 55 },
        { metric: "STC", value: 55 },
        { metric: "C", value: -1.5 },
        { metric: "Ctr", value: -6.4 }
      ]
    });
    expect(estimateBody.result?.unsupportedTargetOutputs).toEqual([]);
  });

  it("surfaces compatible wall anchor-delta answers across cards, report, and calculator API", async () => {
    const scenario = buildWallScenario({
      airborneContext: EXACT_LSF_CONTEXT,
      id: "wall-v1-compatible-anchor-delta-surface",
      rows: EXACT_LSF_PLUS_OUTER_BOARD_ROWS,
      targetOutputs: WALL_ANCHOR_DELTA_DIRECT_OUTPUTS
    });
    const trace = getLayerCombinationResolverCandidateSurface(scenario.result);

    expect(trace).toMatchObject({
      candidateKind: "similarity_anchor",
      requestedBasis: "element_lab",
      route: "wall",
      runtimeBasisId: WALL_ANCHOR_DELTA_RUNTIME_BASIS,
      selectedCandidateId: WALL_ANCHOR_DELTA_SELECTED_CANDIDATE_ID,
      supportBucket: "anchored_estimate",
      supportedMetrics: ["Rw"],
      valuePins: [{ metric: "Rw", value: 57 }]
    });
    expect(scenario.result.supportedTargetOutputs).toEqual(["Rw"]);
    expect(scenario.result.unsupportedTargetOutputs).toEqual([]);
    expect(buildOutputCard({ output: "Rw", result: scenario.result, studyMode: "wall" })).toMatchObject({
      label: "Rw",
      status: "live",
      value: "57 dB"
    });

    const report = buildWallReport({
      requestedOutputs: WALL_ANCHOR_DELTA_DIRECT_OUTPUTS,
      scenario,
      title: "Wall V1 Compatible Anchor Delta Surface"
    });
    expect(report).toContain(`- Resolver candidate id: ${WALL_ANCHOR_DELTA_SELECTED_CANDIDATE_ID}`);
    expect(report).toContain(`- Resolver runtime basis: ${WALL_ANCHOR_DELTA_RUNTIME_BASIS}`);
    expect(report).toContain("- Resolver support bucket: anchored_estimate");
    expect(report).toContain("- Resolver supported metrics: Rw");
    expect(report).toContain("- Resolver value pins: Rw 57");

    const { POST: estimate } = await import("../../app/api/estimate/route");
    const estimateResponse = await estimate(
      jsonRequest("http://localhost/api/estimate", {
        airborneContext: EXACT_LSF_CONTEXT,
        calculator: "dynamic",
        layers: toLayerInputs(EXACT_LSF_PLUS_OUTER_BOARD_ROWS),
        targetOutputs: WALL_ANCHOR_DELTA_DIRECT_OUTPUTS
      })
    );
    const estimateBody = (await estimateResponse.json()) as {
      ok?: boolean;
      result?: AssemblyCalculation;
    };

    expect(estimateResponse.status).toBe(200);
    expect(estimateBody.ok).toBe(true);
    expect(getLayerCombinationResolverCandidateSurface(estimateBody.result)).toMatchObject({
      selectedCandidateId: WALL_ANCHOR_DELTA_SELECTED_CANDIDATE_ID,
      supportedMetrics: ["Rw"],
      valuePins: [{ metric: "Rw", value: 57 }]
    });
    expect(estimateBody.result?.supportedTargetOutputs).toEqual(["Rw"]);
    expect(estimateBody.result?.unsupportedTargetOutputs).toEqual([]);
  });

  it("keeps complete wall field-apparent answers on the wall adapter across cards, report, and calculator API", async () => {
    const scenario = buildWallScenario({
      airborneContext: COMPLETE_FIELD_CONTEXT,
      id: "wall-v1-field-resolver-surface",
      rows: LINED_MASSIVE_WALL_ROWS,
      targetOutputs: WALL_FIELD_TARGET_OUTPUTS
    });
    const trace = getLayerCombinationResolverCandidateSurface(scenario.result);

    expect(trace).toMatchObject({
      candidateKind: "field_building_adapter",
      requestedBasis: "field_apparent",
      route: "wall",
      runtimeBasisId: WALL_FIELD_RUNTIME_BASIS,
      selectedCandidateId: WALL_FIELD_SELECTED_CANDIDATE_ID,
      supportBucket: "field_adapter",
      supportedMetrics: ["R'w", "DnT,w"],
      valuePins: expect.arrayContaining([
        { metric: "R'w", value: 58 },
        { metric: "DnT,w", value: 59 }
      ])
    });
    expect(scenario.result.unsupportedTargetOutputs).toEqual([]);
    expect(buildOutputCard({ output: "R'w", result: scenario.result, studyMode: "wall" })).toMatchObject({
      label: "R'w",
      status: "live",
      value: "58 dB"
    });
    expect(buildOutputCard({ output: "DnT,w", result: scenario.result, studyMode: "wall" })).toMatchObject({
      label: "DnT,w",
      status: "live",
      value: "59 dB"
    });

    const report = buildWallReport({
      requestedOutputs: WALL_FIELD_TARGET_OUTPUTS,
      scenario,
      title: "Wall V1 Field Resolver Surface"
    });
    expect(report).toContain(`- Resolver candidate id: ${WALL_FIELD_SELECTED_CANDIDATE_ID}`);
    expect(report).toContain(`- Resolver runtime basis: ${WALL_FIELD_RUNTIME_BASIS}`);
    expect(report).toContain("- Resolver route / basis: wall / field_apparent");
    expect(report).toContain("- Resolver value pins: R'w 58, DnT,w 59");

    const { POST: estimate } = await import("../../app/api/estimate/route");
    const estimateResponse = await estimate(
      jsonRequest("http://localhost/api/estimate", {
        airborneContext: COMPLETE_FIELD_CONTEXT,
        calculator: "dynamic",
        layers: toLayerInputs(LINED_MASSIVE_WALL_ROWS),
        targetOutputs: WALL_FIELD_TARGET_OUTPUTS
      })
    );
    const estimateBody = (await estimateResponse.json()) as {
      ok?: boolean;
      result?: AssemblyCalculation;
    };

    expect(estimateResponse.status).toBe(200);
    expect(estimateBody.ok).toBe(true);
    expect(getLayerCombinationResolverCandidateSurface(estimateBody.result)).toMatchObject({
      requestedBasis: "field_apparent",
      route: "wall",
      selectedCandidateId: WALL_FIELD_SELECTED_CANDIDATE_ID,
      valuePins: expect.arrayContaining([
        { metric: "R'w", value: 58 },
        { metric: "DnT,w", value: 59 }
      ])
    });
  });

  it("keeps partial wall field context as needs_input across cards, report, and calculator API", async () => {
    const scenario = buildWallScenario({
      airborneContext: PARTIAL_FIELD_CONTEXT,
      id: "wall-v1-field-needs-input-surface",
      rows: LINED_MASSIVE_WALL_ROWS,
      targetOutputs: WALL_FIELD_TARGET_OUTPUTS
    });
    const trace = getLayerCombinationResolverCandidateSurface(scenario.result);

    expect(trace).toMatchObject({
      candidateKind: "needs_input_boundary",
      requestedBasis: "field_apparent",
      requiredInputs: ["partitionAreaM2", "receivingRoomVolumeM3", "receivingRoomRt60S"],
      route: "wall",
      runtimeBasisId: null,
      selectedCandidateId: NEEDS_INPUT_SELECTED_CANDIDATE_ID,
      supportBucket: "needs_input",
      supportedMetrics: [],
      valuePins: []
    });
    expect(scenario.result.unsupportedTargetOutputs).toEqual(["R'w", "DnT,w"]);
    expect(buildOutputCard({ output: "R'w", result: scenario.result, studyMode: "wall" })).toMatchObject({
      label: "R'w",
      status: "needs_input",
      value: "Not ready"
    });
    expect(buildOutputCard({ output: "DnT,w", result: scenario.result, studyMode: "wall" })).toMatchObject({
      label: "DnT,w",
      status: "needs_input",
      value: "Not ready"
    });

    const report = buildWallReport({
      requestedOutputs: WALL_FIELD_TARGET_OUTPUTS,
      scenario,
      title: "Wall V1 Field Needs Input Surface"
    });
    expect(report).toContain(`- Resolver candidate id: ${NEEDS_INPUT_SELECTED_CANDIDATE_ID}`);
    expect(report).toContain("- Resolver support bucket: needs_input");
    expect(report).toContain("- Resolver runtime basis: none");
    expect(report).toContain("- Resolver value pins: none");
    expect(report).toContain("Missing physical inputs: partitionAreaM2, receivingRoomVolumeM3, receivingRoomRt60S.");

    const { POST: estimate } = await import("../../app/api/estimate/route");
    const estimateResponse = await estimate(
      jsonRequest("http://localhost/api/estimate", {
        airborneContext: PARTIAL_FIELD_CONTEXT,
        calculator: "dynamic",
        layers: toLayerInputs(LINED_MASSIVE_WALL_ROWS),
        targetOutputs: WALL_FIELD_TARGET_OUTPUTS
      })
    );
    const estimateBody = (await estimateResponse.json()) as {
      ok?: boolean;
      result?: AssemblyCalculation;
    };

    expect(estimateResponse.status).toBe(200);
    expect(estimateBody.ok).toBe(true);
    expect(getLayerCombinationResolverCandidateSurface(estimateBody.result)).toMatchObject({
      requiredInputs: ["partitionAreaM2", "receivingRoomVolumeM3", "receivingRoomRt60S"],
      selectedCandidateId: NEEDS_INPUT_SELECTED_CANDIDATE_ID,
      supportBucket: "needs_input",
      valuePins: []
    });
    expect(estimateBody.result?.unsupportedTargetOutputs).toEqual(["R'w", "DnT,w"]);
  });

  it("keeps Step 4 stopped wall and floor answers aligned across saved replay, server replay, cards, and report summaries", async () => {
    const savedWallSnapshot = await savePartialFieldScenario();
    const savedWallScenario = buildWallScenario({
      airborneContext: buildFieldContextFromSnapshot(savedWallSnapshot),
      id: "step-4-wall-stopped-saved",
      rows: savedWallSnapshot.rows,
      targetOutputs: savedWallSnapshot.requestedOutputs
    });
    const parsedWallSnapshot = parseServerProjectWorkbenchSnapshot(
      buildServerProjectWorkbenchSnapshot(savedWallSnapshot)
    );
    expect(parsedWallSnapshot).not.toBeNull();
    const serverWallScenario = buildWallScenario({
      airborneContext: buildFieldContextFromSnapshot(parsedWallSnapshot!),
      id: "step-4-wall-stopped-server",
      rows: parsedWallSnapshot?.rows ?? [],
      targetOutputs: parsedWallSnapshot?.requestedOutputs ?? WALL_FIELD_TARGET_OUTPUTS
    });

    for (const scenario of [savedWallScenario, serverWallScenario]) {
      expect(getLayerCombinationResolverCandidateSurface(scenario.result)).toMatchObject({
        candidateKind: "needs_input_boundary",
        requiredInputs: ["partitionAreaM2", "receivingRoomVolumeM3", "receivingRoomRt60S"],
        route: "wall",
        selectedCandidateId: NEEDS_INPUT_SELECTED_CANDIDATE_ID,
        supportBucket: "needs_input",
        supportedMetrics: [],
        valuePins: []
      });
      expect(buildOutputCard({ output: "R'w", result: scenario.result, studyMode: "wall" })).toMatchObject({
        status: "needs_input",
        value: "Not ready"
      });
      const report = buildWallReport({
        requestedOutputs: WALL_FIELD_TARGET_OUTPUTS,
        scenario,
        title: scenario.id
      });
      const summaryLine = report.split("\n").find((line) => line.startsWith("- Answer summary:"));
      expect(summaryLine).toContain("airborne answer needs_input");
      expect(summaryLine).not.toContain("Rw");
      expect(summaryLine).not.toContain("STC");
      expect(report).toContain("- Resolver value pins: none");
    }

    const savedFloorSnapshot = await saveFloorMissingLoadScenario();
    const savedFloorScenario = buildScenario({
      id: "step-4-floor-stopped-saved",
      rows: savedFloorSnapshot.rows,
      source: "saved",
      targetOutputs: savedFloorSnapshot.requestedOutputs
    });
    const parsedFloorSnapshot = parseServerProjectWorkbenchSnapshot(
      buildServerProjectWorkbenchSnapshot(savedFloorSnapshot)
    );
    expect(parsedFloorSnapshot).not.toBeNull();
    const serverFloorScenario = buildScenario({
      id: "step-4-floor-stopped-server",
      rows: parsedFloorSnapshot?.rows ?? [],
      source: "saved",
      targetOutputs: parsedFloorSnapshot?.requestedOutputs ?? FLOOR_LAB_IMPACT_OUTPUTS
    });

    for (const scenario of [savedFloorScenario, serverFloorScenario]) {
      expect(getLayerCombinationResolverCandidateSurface(scenario.result)).toMatchObject({
        candidateKind: "similarity_anchor",
        requiredInputs: [
          "baseSlabOrFloor",
          "floatingOrToppingLayer",
          "resilientLayer",
          "floorCovering",
          "publishedFamilyAnchorCandidate",
          "loadBasisKgM2"
        ],
        route: "floor",
        runtimeBasisId: HEAVY_PUBLISHED_UPPER_TREATMENT_RUNTIME_BASIS,
        selectedCandidateId: HEAVY_PUBLISHED_UPPER_TREATMENT_SELECTED_CANDIDATE_ID,
        supportBucket: "anchored_estimate",
        supportedMetrics: ["Ln,w", "DeltaLw"],
        valuePins: expect.arrayContaining([
          { metric: "Ln,w", value: 50 },
          { metric: "DeltaLw", value: 24.3 }
        ])
      });
      expect(buildOutputCard({ output: "Ln,w", result: scenario.result, studyMode: "floor" })).toMatchObject({
        status: "live",
        value: "50 dB"
      });
      expect(buildOutputCard({ output: "DeltaLw", result: scenario.result, studyMode: "floor" })).toMatchObject({
        status: "live",
        value: "24.3 dB"
      });
      const report = buildFloorReport({
        requestedOutputs: FLOOR_LAB_IMPACT_OUTPUTS,
        scenario,
        title: scenario.id
      });
      const summaryLine = report.split("\n").find((line) => line.startsWith("- Answer summary:"));
      expect(summaryLine).toContain("Ln,w");
      expect(summaryLine).toContain("DeltaLw");
      expect(summaryLine).not.toContain("Rw");
      expect(summaryLine).not.toContain("STC");
      expect(report).toContain(`- Resolver candidate id: ${HEAVY_PUBLISHED_UPPER_TREATMENT_SELECTED_CANDIDATE_ID}`);
      expect(report).toContain("- Resolver support bucket: anchored_estimate");
      expect(report).toContain("- Resolver value pins: Ln,w 50, DeltaLw 24.3");
    }
  });

  it("keeps opening/leak building owners live without aliasing lab metrics across cards, report, and calculator API", async () => {
    const scenario = buildWallScenario({
      airborneContext: OPENING_BUILDING_CONTEXT,
      id: "wall-v1-unsupported-building-surface",
      rows: LINED_MASSIVE_WALL_ROWS,
      targetOutputs: WALL_UNSUPPORTED_BUILDING_TARGET_OUTPUTS
    });
    const trace = getLayerCombinationResolverCandidateSurface(scenario.result);

    expect(trace).toMatchObject({
      candidateKind: "field_building_adapter",
      requestedBasis: "building_prediction",
      route: "wall",
      runtimeBasisId: OPENING_LEAK_BUILDING_RUNTIME_BASIS,
      selectedCandidateId: OPENING_LEAK_BUILDING_SELECTED_CANDIDATE_ID,
      supportBucket: "field_adapter",
      supportedMetrics: ["R'w", "DnT,w"],
      valuePins: expect.arrayContaining([
        { metric: "R'w", value: 31.6 },
        { metric: "DnT,w", value: 32.1 }
      ])
    });
    expect(scenario.result.unsupportedTargetOutputs).toEqual(["Rw", "STC"]);
    expect(buildOutputCard({ output: "Rw", result: scenario.result, studyMode: "wall" })).toMatchObject({
      label: "Rw",
      status: "unsupported",
      value: "Not ready"
    });
    expect(buildOutputCard({ output: "DnT,w", result: scenario.result, studyMode: "wall" })).toMatchObject({
      label: "DnT,w",
      status: "live",
      value: "32.1 dB"
    });

    const report = buildWallReport({
      requestedOutputs: WALL_UNSUPPORTED_BUILDING_TARGET_OUTPUTS,
      scenario,
      title: "Wall V1 Unsupported Building Surface"
    });
    expect(report).toContain(`- Resolver candidate id: ${OPENING_LEAK_BUILDING_SELECTED_CANDIDATE_ID}`);
    expect(report).toContain("- Resolver support bucket: field_adapter");
    expect(report).toContain("- Resolver route / basis: wall / building_prediction");
    expect(report).toContain(`- Resolver runtime basis: ${OPENING_LEAK_BUILDING_RUNTIME_BASIS}`);
    expect(report).toContain("- Resolver value pins: R'w 31.6, DnT,w 32.1");

    const { POST: estimate } = await import("../../app/api/estimate/route");
    const estimateResponse = await estimate(
      jsonRequest("http://localhost/api/estimate", {
        airborneContext: OPENING_BUILDING_CONTEXT,
        calculator: "dynamic",
        layers: toLayerInputs(LINED_MASSIVE_WALL_ROWS),
        targetOutputs: WALL_UNSUPPORTED_BUILDING_TARGET_OUTPUTS
      })
    );
    const estimateBody = (await estimateResponse.json()) as {
      ok?: boolean;
      result?: AssemblyCalculation;
    };

    expect(estimateResponse.status).toBe(200);
    expect(estimateBody.ok).toBe(true);
    expect(getLayerCombinationResolverCandidateSurface(estimateBody.result)).toMatchObject({
      requestedBasis: "building_prediction",
      runtimeBasisId: OPENING_LEAK_BUILDING_RUNTIME_BASIS,
      selectedCandidateId: OPENING_LEAK_BUILDING_SELECTED_CANDIDATE_ID,
      supportBucket: "field_adapter",
      valuePins: expect.arrayContaining([
        { metric: "R'w", value: 31.6 },
        { metric: "DnT,w", value: 32.1 }
      ])
    });
    expect(estimateBody.result?.unsupportedTargetOutputs).toEqual(["Rw", "STC"]);
  });

  it("keeps Step 3 floor exact, anchor, and source-absent formula candidates aligned across cards, report, and calculator API", async () => {
    const cases = [
      {
        cards: [
          { output: "Rw", status: "live", value: "75 dB" },
          { output: "STC", status: "unsupported", value: "Not ready" },
          { output: "IIC", status: "unsupported", value: "Not ready" }
        ],
        expectedTrace: {
          candidateKind: "exact_measured_override",
          route: "floor",
          runtimeBasisId: FLOOR_EXACT_RUNTIME_BASIS,
          selectedCandidateId: FLOOR_EXACT_SELECTED_CANDIDATE_ID,
          supportBucket: "exact",
          supportedMetrics: ["Rw", "C", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"],
          valuePins: expect.arrayContaining([
            { metric: "Rw", value: 75 },
            { metric: "Ln,w", value: 44 }
          ])
        },
        id: "floor-v1-exact-surface",
        reportRuntimeBasis: FLOOR_EXACT_RUNTIME_BASIS,
        rows: EXACT_FLOOR_R5B_PACKAGE_ROWS,
        targetOutputs: FLOOR_EXACT_MIXED_OUTPUTS
      },
      {
        cards: [
          { output: "Ln,w", status: "live", value: "53 dB" },
          { output: "DeltaLw", status: "unsupported", value: "Not ready" },
          { output: "IIC", status: "unsupported", value: "Not ready" }
        ],
        exactImpactSource: EXACT_IMPACT_SOURCE_19,
        expectedTrace: {
          boundaryCandidateIds: [ASTM_UNSUPPORTED_SELECTED_CANDIDATE_ID],
          candidateKind: "exact_measured_override",
          route: "floor",
          runtimeBasisId: EXACT_IMPACT_RUNTIME_BASIS,
          selectedCandidateId: EXACT_IMPACT_SELECTED_CANDIDATE_ID,
          supportBucket: "exact",
          supportedMetrics: ["Ln,w", "CI", "CI,50-2500", "Ln,w+CI"],
          valuePins: expect.arrayContaining([
            { metric: "Ln,w", value: 53 },
            { metric: "CI", value: -3 }
          ])
        },
        id: "floor-v1-exact-impact-surface",
        reportRuntimeBasis: EXACT_IMPACT_RUNTIME_BASIS,
        rows: EXACT_IMPACT_ASSEMBLY_FLOOR_ROWS,
        targetOutputs: EXACT_IMPACT_TARGET_OUTPUTS
      },
      {
        cards: [
          { output: "Rw", status: "live", value: "66 dB" },
          { output: "Ln,w", status: "live", value: "50.8 dB" },
          { output: "IIC", status: "unsupported", value: "Not ready" }
        ],
        expectedTrace: {
          candidateKind: "similarity_anchor",
          route: "floor",
          runtimeBasisId: OPEN_BOX_PACKAGE_RUNTIME_BASIS,
          selectedCandidateId: OPEN_BOX_PACKAGE_SELECTED_CANDIDATE_ID,
          supportBucket: "anchored_estimate",
          supportedMetrics: ["Rw", "C", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"],
          valuePins: expect.arrayContaining([
            { metric: "Rw", value: 66 },
            { metric: "Ln,w", value: 50.8 }
          ])
        },
        id: "floor-v1-open-box-package-surface",
        reportRuntimeBasis: OPEN_BOX_PACKAGE_RUNTIME_BASIS,
        rows: DRY_GYPSUM_FIBER_SOURCE_ABSENT_ROWS,
        targetOutputs: TARGET_OUTPUTS
      },
      {
        cards: [
          { output: "Rw", status: "live", value: "61.5 dB" },
          { output: "C", status: "unsupported", value: "Not ready" },
          { output: "Ln,w", status: "live", value: "61.5 dB" }
        ],
        expectedTrace: {
          candidateKind: "similarity_anchor",
          route: "floor",
          runtimeBasisId: OPEN_WEB_SUPPORTED_RUNTIME_BASIS,
          selectedCandidateId: OPEN_WEB_SUPPORTED_SELECTED_CANDIDATE_ID,
          supportBucket: "anchored_estimate",
          supportedMetrics: ["Rw", "Ctr", "Ln,w", "CI", "Ln,w+CI"],
          valuePins: expect.arrayContaining([
            { metric: "Rw", value: 61.5 },
            { metric: "Ctr", value: -5.5 },
            { metric: "Ln,w", value: 61.5 }
          ])
        },
        id: "floor-v1-open-web-supported-surface",
        reportRuntimeBasis: OPEN_WEB_SUPPORTED_RUNTIME_BASIS,
        rows: SUPPORTED_BAND_PACKAGE_ROWS,
        targetOutputs: TARGET_OUTPUTS
      },
      {
        cards: [
          { output: "Rw", status: "live", value: "42.3 dB" },
          { output: "Ln,w", status: "live", value: "88.2 dB" },
          { output: "IIC", status: "unsupported", value: "Not ready" }
        ],
        expectedTrace: {
          candidateKind: "source_absent_family_solver",
          route: "floor",
          runtimeBasisId: OPEN_BOX_RAW_RUNTIME_BASIS,
          selectedCandidateId: OPEN_BOX_RAW_SELECTED_CANDIDATE_ID,
          supportBucket: "source_absent_estimate",
          supportedMetrics: ["Rw", "C", "Ctr", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"],
          valuePins: expect.arrayContaining([
            { metric: "Rw", value: 42.3 },
            { metric: "Ln,w", value: 88.2 }
          ])
        },
        id: "floor-v1-open-box-raw-surface",
        reportRuntimeBasis: OPEN_BOX_RAW_RUNTIME_BASIS,
        rows: RAW_OPEN_BOX_TIMBER_ROWS,
        targetOutputs: TARGET_OUTPUTS
      },
      {
        cards: [
          { output: "Rw", status: "live", value: "32 dB" },
          { output: "Ln,w", status: "live", value: "96 dB" },
          { output: "IIC", status: "unsupported", value: "Not ready" }
        ],
        expectedTrace: {
          candidateKind: "source_absent_family_solver",
          route: "floor",
          runtimeBasisId: OPEN_WEB_RAW_RUNTIME_BASIS,
          selectedCandidateId: OPEN_WEB_RAW_SELECTED_CANDIDATE_ID,
          supportBucket: "source_absent_estimate",
          supportedMetrics: ["Rw", "C", "Ctr", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"],
          valuePins: expect.arrayContaining([
            { metric: "Rw", value: 32 },
            { metric: "Ln,w", value: 96 }
          ])
        },
        id: "floor-v1-open-web-raw-surface",
        reportRuntimeBasis: OPEN_WEB_RAW_RUNTIME_BASIS,
        rows: RAW_OPEN_WEB_ROWS,
        targetOutputs: TARGET_OUTPUTS
      },
      {
        cards: [
          { output: "Rw", status: "live", value: "46.7 dB" },
          { output: "Ln,w", status: "live", value: "59.6 dB" },
          { output: "IIC", status: "unsupported", value: "Not ready" }
        ],
        expectedTrace: {
          candidateKind: "source_absent_family_solver",
          route: "floor",
          runtimeBasisId: HELPER_ONLY_BASIS,
          selectedCandidateId: SELECTED_CANDIDATE_ID,
          supportBucket: "source_absent_estimate",
          supportedMetrics: ["Rw", "C", "Ctr", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"],
          valuePins: expect.arrayContaining([
            { metric: "Rw", value: 46.7 },
            { metric: "Ln,w", value: 59.6 }
          ])
        },
        id: "floor-v1-helper-only-surface",
        reportRuntimeBasis: HELPER_ONLY_BASIS,
        rows: HELPER_ONLY_OPEN_WEB_ROWS,
        targetOutputs: TARGET_OUTPUTS
      },
      {
        cards: [
          { output: "Rw", status: "live", value: "51 dB" },
          { output: "C", status: "unsupported", value: "Not ready" },
          { output: "Ln,w", status: "live", value: "71 dB" }
        ],
        expectedTrace: {
          candidateKind: "source_absent_family_solver",
          route: "floor",
          runtimeBasisId: DIRECT_FIXED_RUNTIME_BASIS,
          selectedCandidateId: DIRECT_FIXED_SELECTED_CANDIDATE_ID,
          supportBucket: "source_absent_estimate",
          supportedMetrics: ["Rw", "Ctr", "Ln,w", "CI", "Ln,w+CI"],
          valuePins: expect.arrayContaining([
            { metric: "Rw", value: 51 },
            { metric: "Ln,w", value: 71 }
          ])
        },
        id: "floor-v1-direct-fixed-surface",
        reportRuntimeBasis: DIRECT_FIXED_RUNTIME_BASIS,
        rows: DIRECT_FIXED_OPEN_WEB_ROWS,
        targetOutputs: TARGET_OUTPUTS
      }
    ] as const;

    for (const testCase of cases) {
      const scenario = buildScenario({
        exactImpactSource: testCase.exactImpactSource ?? null,
        id: testCase.id,
        rows: testCase.rows,
        targetOutputs: testCase.targetOutputs
      });

      expect(getLayerCombinationResolverCandidateSurface(scenario.result)).toMatchObject(testCase.expectedTrace);

      for (const cardExpectation of testCase.cards) {
        expect(
          buildOutputCard({
            output: cardExpectation.output,
            result: scenario.result,
            studyMode: "floor"
          }),
          `${testCase.id} ${cardExpectation.output} card`
        ).toMatchObject(cardExpectation);
      }

      const report = buildFloorReport({
        requestedOutputs: testCase.targetOutputs,
        scenario,
        title: testCase.id
      });
      expect(report).toContain(`- Resolver candidate id: ${testCase.expectedTrace.selectedCandidateId}`);
      expect(report).toContain(`- Resolver runtime basis: ${testCase.reportRuntimeBasis}`);
      expect(report).toContain("- Resolver route / basis: floor /");

      const apiResult = await estimateAssemblyViaApi({
        exactImpactSource: testCase.exactImpactSource ?? null,
        rows: testCase.rows,
        targetOutputs: testCase.targetOutputs
      });
      expect(getLayerCombinationResolverCandidateSurface(apiResult)).toMatchObject(testCase.expectedTrace);
    }
  });

  it("keeps Step 3 floor heavy-impact, field-impact, and ASTM boundary states aligned across cards, report, and calculator API", async () => {
    const heavyResult = await estimateAssemblyViaApi({
      floorImpactContext: HEAVY_FLOATING_FLOOR_IMPACT_CONTEXT,
      rows: HEAVY_FLOATING_FLOOR_ROWS,
      targetOutputs: FLOOR_LAB_IMPACT_WITH_ASTM_OUTPUTS
    });
    expect(getLayerCombinationResolverCandidateSurface(heavyResult)).toMatchObject({
      boundaryCandidateIds: [ASTM_UNSUPPORTED_SELECTED_CANDIDATE_ID],
      candidateKind: "source_absent_family_solver",
      route: "floor",
      runtimeBasisId: HEAVY_FLOATING_RUNTIME_BASIS,
      selectedCandidateId: HEAVY_FLOATING_SELECTED_CANDIDATE_ID,
      supportBucket: "source_absent_estimate",
      supportedMetrics: ["Ln,w", "DeltaLw"],
      valuePins: expect.arrayContaining([
        { metric: "Ln,w", value: 50.3 },
        { metric: "DeltaLw", value: 24.3 }
      ])
    });
    expect(buildOutputCard({ output: "Ln,w", result: heavyResult, studyMode: "floor" })).toMatchObject({
      label: "Ln,w",
      status: "live",
      value: "50.3 dB"
    });
    expect(buildOutputCard({ output: "DeltaLw", result: heavyResult, studyMode: "floor" })).toMatchObject({
      label: "DeltaLw",
      status: "live",
      value: "24.3 dB"
    });
    expect(buildOutputCard({ output: "IIC", result: heavyResult, studyMode: "floor" })).toMatchObject({
      label: "IIC",
      status: "unsupported",
      value: "Not ready"
    });
    const heavyReport = buildFloorReport({
      requestedOutputs: FLOOR_LAB_IMPACT_WITH_ASTM_OUTPUTS,
      scenario: buildFloorScenarioFromResult({
        id: "floor-v1-heavy-floating-surface",
        result: heavyResult,
        rows: HEAVY_FLOATING_FLOOR_ROWS
      }),
      title: "floor-v1-heavy-floating-surface"
    });
    expect(heavyReport).toContain(`- Resolver candidate id: ${HEAVY_FLOATING_SELECTED_CANDIDATE_ID}`);
    expect(heavyReport).toContain(`- Resolver runtime basis: ${HEAVY_FLOATING_RUNTIME_BASIS}`);
    expect(heavyReport).toContain("- Resolver boundary candidates: generic.astm_iic_aiic.unsupported_boundary");
    expect(heavyReport).toContain("- Resolver value pins: Ln,w 50.3, DeltaLw 24.3");
    const heavySummaryLine = heavyReport.split("\n").find((line) => line.startsWith("- Answer summary:"));
    expect(heavySummaryLine).toContain("Ln,w");
    expect(heavySummaryLine).not.toContain("Rw");
    expect(heavySummaryLine).not.toContain("STC");

    const missingLoadResult = await estimateAssemblyViaApi({
      rows: HEAVY_FLOATING_FLOOR_ROWS,
      targetOutputs: FLOOR_LAB_IMPACT_OUTPUTS
    });
    expect(getLayerCombinationResolverCandidateSurface(missingLoadResult)).toMatchObject({
      boundaryCandidateIds: [NEEDS_INPUT_SELECTED_CANDIDATE_ID],
      candidateKind: "similarity_anchor",
      requiredInputs: [
        "baseSlabOrFloor",
        "floatingOrToppingLayer",
        "resilientLayer",
        "floorCovering",
        "publishedFamilyAnchorCandidate",
        "loadBasisKgM2"
      ],
      route: "floor",
      runtimeBasisId: HEAVY_PUBLISHED_UPPER_TREATMENT_RUNTIME_BASIS,
      selectedCandidateId: HEAVY_PUBLISHED_UPPER_TREATMENT_SELECTED_CANDIDATE_ID,
      supportBucket: "anchored_estimate",
      supportedMetrics: ["Ln,w"],
      valuePins: [{ metric: "Ln,w", value: 50 }]
    });
    expect(buildOutputCard({ output: "Ln,w", result: missingLoadResult, studyMode: "floor" })).toMatchObject({
      label: "Ln,w",
      status: "live",
      value: "50 dB"
    });
    expect(buildOutputCard({ output: "DeltaLw", result: missingLoadResult, studyMode: "floor" })).toMatchObject({
      label: "DeltaLw",
      status: "needs_input",
      value: "Not ready"
    });
    const missingLoadReport = buildFloorReport({
      requestedOutputs: FLOOR_LAB_IMPACT_OUTPUTS,
      scenario: buildFloorScenarioFromResult({
        id: "floor-v1-heavy-missing-load-surface",
        result: missingLoadResult,
        rows: HEAVY_FLOATING_FLOOR_ROWS
      }),
      title: "floor-v1-heavy-missing-load-surface"
    });
    expect(missingLoadReport).toContain(`- Resolver candidate id: ${HEAVY_PUBLISHED_UPPER_TREATMENT_SELECTED_CANDIDATE_ID}`);
    expect(missingLoadReport).toContain("- Resolver support bucket: anchored_estimate");
    expect(missingLoadReport).toContain("- Resolver boundary candidates: generic.required_input_owner.needs_input_boundary");
    expect(missingLoadReport).toContain("- Resolver value pins: Ln,w 50");
    expect(missingLoadReport).toContain("Missing physical inputs: loadBasisKgM2.");
    const missingLoadSummaryLine = missingLoadReport.split("\n").find((line) => line.startsWith("- Answer summary:"));
    expect(missingLoadSummaryLine).toContain("Ln,w");
    expect(missingLoadSummaryLine).not.toContain("Rw");
    expect(missingLoadSummaryLine).not.toContain("STC");

    const missingFieldResult = await estimateAssemblyViaApi({
      floorImpactContext: HEAVY_FLOATING_FLOOR_IMPACT_CONTEXT,
      rows: HEAVY_FLOATING_FLOOR_ROWS,
      targetOutputs: FLOOR_FIELD_IMPACT_OUTPUTS
    });
    expect(getLayerCombinationResolverCandidateSurface(missingFieldResult)).toMatchObject({
      candidateKind: "needs_input_boundary",
      requiredInputs: ["impactFieldContext", "receivingRoomVolumeM3"],
      route: "floor",
      selectedCandidateId: NEEDS_INPUT_SELECTED_CANDIDATE_ID,
      supportBucket: "needs_input",
      supportedMetrics: [],
      valuePins: []
    });
    expect(buildOutputCard({ output: "L'n,w", result: missingFieldResult, studyMode: "floor" })).toMatchObject({
      label: "L'n,w",
      status: "needs_input",
      value: "Not ready"
    });
    expect(buildOutputCard({ output: "L'nT,w", result: missingFieldResult, studyMode: "floor" })).toMatchObject({
      label: "L'nT,w",
      status: "needs_input",
      value: "Not ready"
    });

    const astmResult = await estimateAssemblyViaApi({
      rows: EXACT_FLOOR_R5B_PACKAGE_ROWS,
      targetOutputs: FLOOR_ASTM_ONLY_OUTPUTS
    });
    expect(getLayerCombinationResolverCandidateSurface(astmResult)).toMatchObject({
      candidateKind: "unsupported_boundary",
      requestedBasis: "astm_rating_boundary",
      route: "floor",
      selectedCandidateId: ASTM_UNSUPPORTED_SELECTED_CANDIDATE_ID,
      supportBucket: "unsupported",
      supportedMetrics: [],
      valuePins: []
    });
    expect(buildOutputCard({ output: "IIC", result: astmResult, studyMode: "floor" })).toMatchObject({
      label: "IIC",
      status: "unsupported",
      value: "Not ready"
    });
    expect(buildOutputCard({ output: "AIIC", result: astmResult, studyMode: "floor" })).toMatchObject({
      label: "AIIC",
      status: "unsupported",
      value: "Not ready"
    });
    const astmReport = buildFloorReport({
      requestedOutputs: FLOOR_ASTM_ONLY_OUTPUTS,
      scenario: buildFloorScenarioFromResult({
        id: "floor-v1-astm-unsupported-surface",
        result: astmResult,
        rows: EXACT_FLOOR_R5B_PACKAGE_ROWS
      }),
      title: "floor-v1-astm-unsupported-surface"
    });
    expect(astmReport).toContain(`- Resolver candidate id: ${ASTM_UNSUPPORTED_SELECTED_CANDIDATE_ID}`);
    expect(astmReport).toContain("- Resolver support bucket: unsupported");
    expect(astmReport).toContain("- Resolver runtime basis: none");
    expect(astmReport).toContain("- Resolver value pins: none");
  });

  it("keeps Gate G exact ASTM IIC and AIIC values aligned across cards, chart, report, and APIs", async () => {
    const labScenario = buildScenario({
      exactImpactSource: EXACT_ASTM_LAB_IIC_SOURCE,
      id: "floor-gate-g-astm-iic-surface",
      rows: EXACT_IMPACT_ASSEMBLY_FLOOR_ROWS,
      targetOutputs: ["IIC"]
    });
    const labTrace = getLayerCombinationResolverCandidateSurface(labScenario.result);

    expect(labScenario.result.impact).toMatchObject({
      IIC: 50,
      availableOutputs: ["IIC"],
      basis: ASTM_E989_RUNTIME_BASIS,
      labOrField: "lab",
      metricBasis: { IIC: ASTM_E989_IIC_METRIC_BASIS }
    });
    expect(labScenario.result.supportedTargetOutputs).toEqual(["IIC"]);
    expect(labScenario.result.unsupportedTargetOutputs).toEqual([]);
    expect(labTrace).toMatchObject({
      candidateKind: "exact_measured_override",
      requestedBasis: "astm_rating_boundary",
      route: "floor",
      runtimeBasisId: ASTM_E989_RUNTIME_BASIS,
      selectedCandidateId: ASTM_E989_SELECTED_CANDIDATE_ID,
      supportBucket: "exact",
      supportedMetrics: ["IIC"],
      valuePins: [{ metric: "IIC", value: 50 }]
    });
    expect(labTrace?.surfaceDetail).toContain("exact ASTM impact-band contour rating");

    const labCard = addOutputCardPosture(
      buildOutputCard({ output: "IIC", result: labScenario.result, studyMode: "floor" }),
      { result: labScenario.result, studyMode: "floor" }
    );
    expect(labCard).toMatchObject({
      label: "IIC",
      postureLabel: "ASTM E989 exact rating",
      postureTone: "success",
      status: "live",
      value: "50 dB"
    });
    expect(labCard.detail).toContain("ASTM E989 contour bridge");

    expect(buildResultAnswerChartLanes({ result: labScenario.result })).toEqual([
      expect.objectContaining({
        direction: "higher_better",
        label: "IIC",
        value: 50,
        valueLabel: "50 dB"
      })
    ]);

    expect(getActiveImpactMetricBasisRows(labScenario.result.impact)).toEqual([
      expect.objectContaining({
        basis: ASTM_E989_IIC_METRIC_BASIS,
        label: "IIC"
      })
    ]);

    const labReport = buildFloorReport({
      requestedOutputs: ["IIC"],
      scenario: labScenario,
      title: "floor-gate-g-astm-iic-surface"
    });
    expect(labReport).toContain("- Answer summary: IIC 50 dB");
    expect(labReport).toContain("- Impact IIC: 50.0 dB");
    expect(labReport).toContain("- Impact IIC provenance: ASTM E989 lab IIC metric owner");
    expect(labReport).toContain(`- Resolver candidate id: ${ASTM_E989_SELECTED_CANDIDATE_ID}`);
    expect(labReport).toContain(`- Resolver runtime basis: ${ASTM_E989_RUNTIME_BASIS}`);
    expect(labReport).toContain("- Resolver value pins: IIC 50");

    const estimateResult = await estimateAssemblyViaApi({
      exactImpactSource: EXACT_ASTM_LAB_IIC_SOURCE,
      rows: EXACT_IMPACT_ASSEMBLY_FLOOR_ROWS,
      targetOutputs: ["IIC"]
    });
    expect(getLayerCombinationResolverCandidateSurface(estimateResult)).toMatchObject({
      selectedCandidateId: ASTM_E989_SELECTED_CANDIDATE_ID,
      valuePins: [{ metric: "IIC", value: 50 }]
    });

    const { POST: impactOnly } = await import("../../app/api/impact-only/route");
    const impactResponse = await impactOnly(
      jsonRequest("http://localhost/api/impact-only", {
        exactImpactSource: EXACT_ASTM_LAB_IIC_SOURCE,
        layers: toLayerInputs(EXACT_IMPACT_ASSEMBLY_FLOOR_ROWS),
        sourceLayers: toLayerInputs(EXACT_IMPACT_ASSEMBLY_FLOOR_ROWS),
        targetOutputs: ["IIC"]
      })
    );
    const impactBody = (await impactResponse.json()) as {
      ok?: boolean;
      result?: ImpactOnlyCalculation;
    };
    expect(impactResponse.status).toBe(200);
    expect(impactBody.ok).toBe(true);
    expect(getLayerCombinationResolverCandidateSurface(impactBody.result)).toMatchObject({
      selectedCandidateId: ASTM_E989_SELECTED_CANDIDATE_ID,
      supportedMetrics: ["IIC"],
      valuePins: [{ metric: "IIC", value: 50 }]
    });

    const fieldScenario = buildScenario({
      exactImpactSource: EXACT_ASTM_FIELD_AIIC_SOURCE,
      id: "floor-gate-g-astm-aiic-surface",
      rows: EXACT_IMPACT_ASSEMBLY_FLOOR_ROWS,
      targetOutputs: ["AIIC"]
    });
    expect(fieldScenario.result.impact).toMatchObject({
      AIIC: 50,
      availableOutputs: ["AIIC"],
      basis: ASTM_E989_RUNTIME_BASIS,
      labOrField: "field",
      metricBasis: { AIIC: ASTM_E989_AIIC_METRIC_BASIS }
    });
    expect(getLayerCombinationResolverCandidateSurface(fieldScenario.result)).toMatchObject({
      requestedBasis: "astm_rating_boundary",
      selectedCandidateId: ASTM_E989_SELECTED_CANDIDATE_ID,
      supportedMetrics: ["AIIC"],
      valuePins: [{ metric: "AIIC", value: 50 }]
    });
    expect(addOutputCardPosture(
      buildOutputCard({ output: "AIIC", result: fieldScenario.result, studyMode: "floor" }),
      { result: fieldScenario.result, studyMode: "floor" }
    )).toMatchObject({
      label: "AIIC",
      postureLabel: "ASTM E989 exact rating",
      status: "live",
      value: "50 dB"
    });
  });
});
