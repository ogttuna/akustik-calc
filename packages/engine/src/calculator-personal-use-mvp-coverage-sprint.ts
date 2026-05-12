import type {
  AcousticInputFieldId,
  AirborneContext,
  ImpactFieldContext,
  ImpactOnlyCalculation,
  ImpactPredictorInput,
  LayerInput,
  RequestedOutputId
} from "@dynecho/shared";

import { calculateAssembly } from "./calculate-assembly";
import { calculateImpactOnly } from "./calculate-impact-only";
import {
  buildDynamicCalculatorRouteInputTopologyAssessment,
  type DynamicCalculatorRoute
} from "./dynamic-calculator-route-input-topology";
import {
  buildSteelFloorFormulaPredictorInputFromSurface,
  type SteelFloorFormulaInputSurface
} from "./steel-floor-formula-input-surface";
import {
  buildTimberCltDeltaLwPredictorInputFromSurface,
  type TimberCltDeltaLwInputSurface
} from "./timber-clt-delta-lw-input-surface";
import {
  GATE_B_CLT_LAYERS,
  GATE_B_TIMBER_JOIST_LAYERS
} from "./timber-clt-floor-impact-delta-lw-input-contract";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_A_LANDED_GATE =
  "gate_a_personal_use_mvp_coverage_matrix_plan";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_A_SELECTION_STATUS =
  "gate_a_personal_use_mvp_coverage_matrix_landed_no_runtime_selected_timber_clt_floor_impact_delta_lw_gate_b";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_A_SELECTED_NEXT_FILE =
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-b-timber-clt-floor-impact-delta-lw-contract.test.ts";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_A_SELECTED_NEXT_ACTION =
  "gate_b_personal_use_mvp_timber_clt_floor_impact_delta_lw_input_contract_plan";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_W_LANDED_GATE =
  "gate_w_personal_use_mvp_coverage_matrix_refresh_after_opening_leak_plan";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_W_SELECTION_STATUS =
  "gate_w_personal_use_mvp_coverage_matrix_refresh_after_opening_leak_landed_selected_aac_masonry_gate_x";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_W_SELECTED_NEXT_FILE =
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-x-aac-nonhomogeneous-masonry-wall-family-solver-contract.test.ts";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_W_SELECTED_NEXT_ACTION =
  "gate_x_personal_use_mvp_aac_nonhomogeneous_masonry_wall_family_solver_plan";

export type PersonalUseMvpCoverageRoute = "floor" | "wall";
export type PersonalUseMvpCoverageOutputBasis =
  | "astm_rating_boundary"
  | "building_prediction"
  | "element_lab"
  | "field_apparent";
export type PersonalUseMvpCoverageInputCompleteness =
  | "ambiguous"
  | "complete"
  | "hostile"
  | "invalid"
  | "partial";
export type PersonalUseMvpCoveragePosture =
  | "bounded_screening"
  | "calibrated_physics"
  | "exact"
  | "family_physics"
  | "needs_input"
  | "source_anchored_delta"
  | "unsupported";
export type PersonalUseMvpCoverageVisibleSurface =
  | "calculator_api"
  | "docx_report"
  | "impact_only_api"
  | "markdown_report"
  | "pdf_report"
  | "saved_replay"
  | "workbench_card";
export type PersonalUseMvpCoverageFailureClass =
  | "basis_boundary"
  | "correct_block"
  | "coverage_gap"
  | "hostile_input_refusal"
  | "none"
  | "unsupported_metric";

export type PersonalUseMvpCoverageMetricValuePin = {
  metric: RequestedOutputId;
  value: number;
};

export type PersonalUseMvpCoverageRuntimeSnapshot = {
  basisId: string | null;
  errorBudgetDb: number | null;
  missingPhysicalInputs: readonly AcousticInputFieldId[];
  origin: string | null;
  publicEntryPoint:
    | "buildDynamicCalculatorRouteInputTopologyAssessment"
    | "buildSteelFloorFormulaPredictorInputFromSurface"
    | "buildTimberCltDeltaLwPredictorInputFromSurface"
    | "calculateAssembly"
    | "calculateImpactOnly";
  selectedMethod: string | null;
  supportedTargetOutputs: readonly RequestedOutputId[];
  unsupportedTargetOutputs: readonly RequestedOutputId[];
  valuePins: readonly PersonalUseMvpCoverageMetricValuePin[];
};

export type PersonalUseMvpCoverageScenarioRow = {
  basis: PersonalUseMvpCoverageOutputBasis;
  currentPosture: PersonalUseMvpCoveragePosture;
  expectedPosture: PersonalUseMvpCoveragePosture;
  failureClass: PersonalUseMvpCoverageFailureClass;
  family: string;
  hostileVariant: string | null;
  id: string;
  inputCompleteness: PersonalUseMvpCoverageInputCompleteness;
  nextAction: string;
  originSupportBucket: string;
  requestedMetrics: readonly RequestedOutputId[];
  route: PersonalUseMvpCoverageRoute;
  runtime: PersonalUseMvpCoverageRuntimeSnapshot;
  toleranceOrErrorBudget: string;
  valueOrBlockedReason: string;
  visibleSurfaceParityTarget: readonly PersonalUseMvpCoverageVisibleSurface[];
};

export type PersonalUseMvpGateBLaneId =
  | "field_building_context_continuation"
  | "generalized_wall_multicavity_triple_leaf"
  | "lined_masonry_clt_wall_upgrade"
  | "timber_clt_floor_impact_delta_lw";

export type PersonalUseMvpGateBLaneCandidate = {
  basisLeakageRisk: number;
  currentFailureRisk: number;
  evidenceRowIds: readonly string[];
  id: PersonalUseMvpGateBLaneId;
  implementationCost: number;
  score: number;
  selected: boolean;
  solverReadiness: number;
  userFrequency: number;
};

export type PersonalUseMvpGateBLaneSelection = {
  candidates: readonly PersonalUseMvpGateBLaneCandidate[];
  selectedCandidate: PersonalUseMvpGateBLaneCandidate;
  selectedNextAction: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_A_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_A_SELECTED_NEXT_FILE;
  selectionPolicy: readonly string[];
};

export type PersonalUseMvpGateXLaneId =
  | "aac_nonhomogeneous_masonry_wall_family_solver"
  | "airborne_building_prediction_runtime_terms"
  | "astm_iic_aiic_rating_adapter"
  | "clt_mass_timber_ctr_spectrum_adapter"
  | "flat_multicavity_autogrouping_guarded_topology"
  | "targeted_aac_source_holdout_packet";

export type PersonalUseMvpGateXLaneCandidate = {
  basisLeakageRisk: number;
  currentFailureRisk: number;
  evidenceRowIds: readonly string[];
  id: PersonalUseMvpGateXLaneId;
  implementationCost: number;
  score: number;
  selected: boolean;
  solverReadiness: number;
  sourceRowsRequiredForRuntimeSelection: boolean;
  userFrequency: number;
};

export type PersonalUseMvpGateXLaneSelection = {
  candidates: readonly PersonalUseMvpGateXLaneCandidate[];
  selectedCandidate: PersonalUseMvpGateXLaneCandidate;
  selectedNextAction: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_W_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_W_SELECTED_NEXT_FILE;
  selectionPolicy: readonly string[];
};

export type PersonalUseMvpCoverageSprintGateASummary = {
  basisCoverage: readonly PersonalUseMvpCoverageOutputBasis[];
  currentPostureCoverage: readonly PersonalUseMvpCoveragePosture[];
  failureClassCoverage: readonly PersonalUseMvpCoverageFailureClass[];
  noRuntimeValueMovement: true;
  routeCoverage: readonly PersonalUseMvpCoverageRoute[];
  rowCount: number;
  selectedGateBLane: PersonalUseMvpGateBLaneId;
  selectedNextAction: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_A_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_A_SELECTED_NEXT_FILE;
};

export type PersonalUseMvpCoverageSprintGateWSummary = {
  basisCoverage: readonly PersonalUseMvpCoverageOutputBasis[];
  currentPostureCoverage: readonly PersonalUseMvpCoveragePosture[];
  failureClassCoverage: readonly PersonalUseMvpCoverageFailureClass[];
  noNewRuntimeValueMovement: true;
  refreshedAfterGate: "gate_v_personal_use_mvp_post_opening_leak_input_surface_revalidation_landed_no_runtime_selected_matrix_refresh_gate_w";
  remainingCoverageGapRowIds: readonly string[];
  routeCoverage: readonly PersonalUseMvpCoverageRoute[];
  rowCount: number;
  selectedGateXLane: PersonalUseMvpGateXLaneId;
  selectedNextAction: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_W_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_W_SELECTED_NEXT_FILE;
};

type ScenarioDefinition = Omit<PersonalUseMvpCoverageScenarioRow, "currentPosture" | "runtime"> & {
  run: () => {
    currentPosture: PersonalUseMvpCoveragePosture;
    runtime: PersonalUseMvpCoverageRuntimeSnapshot;
  };
};

const WALL_LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];
const WALL_FIELD_OUTPUTS = ["R'w", "DnT,w"] as const satisfies readonly RequestedOutputId[];
const FLOOR_LAB_IMPACT_OUTPUTS = ["Ln,w", "DeltaLw"] as const satisfies readonly RequestedOutputId[];
const FLOOR_FIELD_IMPACT_OUTPUTS = ["L'n,w", "L'nT,w"] as const satisfies readonly RequestedOutputId[];
const ASTM_IMPACT_OUTPUTS = ["IIC", "AIIC"] as const satisfies readonly RequestedOutputId[];
const IMPACT_OUTPUT_SET = new Set<RequestedOutputId>([
  "AIIC",
  "CI",
  "CI,50-2500",
  "DeltaLw",
  "HIIC",
  "IIC",
  "L'n,w",
  "L'nT,50",
  "L'nT,w",
  "LIIC",
  "LIR",
  "Ln,w",
  "Ln,w+CI",
  "LnT,A",
  "NISR"
]);

const ALL_VISIBLE_SURFACES = [
  "workbench_card",
  "saved_replay",
  "calculator_api",
  "impact_only_api",
  "markdown_report",
  "pdf_report",
  "docx_report"
] as const satisfies readonly PersonalUseMvpCoverageVisibleSurface[];

const WALL_VISIBLE_SURFACES = [
  "workbench_card",
  "saved_replay",
  "calculator_api",
  "markdown_report",
  "pdf_report",
  "docx_report"
] as const satisfies readonly PersonalUseMvpCoverageVisibleSurface[];

const IMPACT_VISIBLE_SURFACES = [
  "workbench_card",
  "saved_replay",
  "calculator_api",
  "impact_only_api",
  "markdown_report",
  "pdf_report",
  "docx_report"
] as const satisfies readonly PersonalUseMvpCoverageVisibleSurface[];

const WALL_LAB_CONTEXT: AirborneContext = {
  airtightness: "good",
  contextMode: "element_lab"
};

const DOUBLE_LEAF_CONTEXT: AirborneContext = {
  ...WALL_LAB_CONTEXT,
  sharedTrack: "independent",
  studSpacingMm: 600,
  wallTopology: {
    cavity1AbsorptionClass: "porous_absorptive",
    cavity1DepthMm: 90,
    cavity1FillCoverage: "full",
    cavity1LayerIndices: [1],
    sideALeafLayerIndices: [0],
    sideBLeafLayerIndices: [2],
    supportTopology: "independent_frames",
    topologyMode: "double_leaf_framed"
  }
};

const RESILIENT_WALL_CONTEXT: AirborneContext = {
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

const TRIPLE_LEAF_50_50_CONTEXT: AirborneContext = {
  ...WALL_LAB_CONTEXT,
  wallTopology: {
    cavity1AbsorptionClass: "porous_absorptive",
    cavity1DepthMm: 50,
    cavity1FillCoverage: "full",
    cavity1LayerIndices: [3],
    cavity2AbsorptionClass: "porous_absorptive",
    cavity2DepthMm: 50,
    cavity2FillCoverage: "full",
    cavity2LayerIndices: [5],
    internalLeafCoupling: "independent",
    internalLeafLayerIndices: [4],
    sideALeafLayerIndices: [0, 1, 2],
    sideBLeafLayerIndices: [6, 7, 8],
    supportTopology: "independent_frames",
    topologyMode: "grouped_triple_leaf"
  }
};

const TRIPLE_LEAF_NON_50_50_CONTEXT: AirborneContext = {
  ...TRIPLE_LEAF_50_50_CONTEXT,
  wallTopology: {
    ...TRIPLE_LEAF_50_50_CONTEXT.wallTopology,
    cavity1DepthMm: 70,
    cavity2DepthMm: 35
  }
};

const COMPLETE_WALL_FIELD_CONTEXT: AirborneContext = {
  ...DOUBLE_LEAF_CONTEXT,
  contextMode: "field_between_rooms",
  junctionQuality: "good",
  panelHeightMm: 2600,
  panelWidthMm: 3000,
  receivingRoomRt60S: 0.5,
  receivingRoomVolumeM3: 32
};

const SINGLE_CONCRETE_WALL: readonly LayerInput[] = [
  { materialId: "concrete", thicknessMm: 200 }
];

const LAMINATED_BOARD_WALL: readonly LayerInput[] = [
  { materialId: "acoustic_gypsum_board", thicknessMm: 15 },
  { materialId: "diamond_board", thicknessMm: 18 }
];

const DOUBLE_LEAF_WALL: readonly LayerInput[] = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 90 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
];

const RESILIENT_WALL: readonly LayerInput[] = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 75 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
];

const TRIPLE_LEAF_WALL: readonly LayerInput[] = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "mlv", thicknessMm: 4 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 50 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 50 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "gypsum_plaster", thicknessMm: 10 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
];

const FLAT_MULTICAVITY_WALL: readonly LayerInput[] = [
  { materialId: "gypsum_plaster", thicknessMm: 3 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "mlv", thicknessMm: 2 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 80 },
  { materialId: "air_gap", thicknessMm: 20 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "air_gap", thicknessMm: 30 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 80 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "mlv", thicknessMm: 2 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "gypsum_plaster", thicknessMm: 3 }
];

const LINED_MASSIVE_WALL: readonly LayerInput[] = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "air_gap", thicknessMm: 40 },
  { materialId: "rockwool", thicknessMm: 40 },
  { materialId: "concrete", thicknessMm: 160 }
];

const CLT_WALL: readonly LayerInput[] = [
  { materialId: "clt_panel", thicknessMm: 120 }
];

const HEAVY_FLOATING_FLOOR: readonly LayerInput[] = [
  { floorRole: "base_structure", materialId: "concrete", thicknessMm: 180 },
  { floorRole: "resilient_layer", materialId: "generic_resilient_underlay", thicknessMm: 8 },
  { floorRole: "floating_screed", materialId: "screed", thicknessMm: 50 }
];

const LIGHTWEIGHT_STEEL_FLOOR: readonly LayerInput[] = [
  { floorRole: "floor_covering", materialId: "ceramic_tile", thicknessMm: 10 },
  { floorRole: "floating_screed", materialId: "cement_board", thicknessMm: 18 },
  { floorRole: "resilient_layer", materialId: "generic_resilient_underlay", thicknessMm: 4.5 },
  { floorRole: "base_structure", materialId: "lightweight_steel_floor", thicknessMm: 200 },
  { floorRole: "ceiling_cavity", materialId: "air_gap", thicknessMm: 200 },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 12.5 }
];

const COMPLETE_STEEL_SURFACE: SteelFloorFormulaInputSurface = {
  loadBasisKgM2: 64,
  lowerCeilingIsolationSupportForm: "elastic_furred_channels",
  resilientLayerDynamicStiffnessMNm3: 35,
  steelCarrierDepthMm: 200,
  steelCarrierSpacingMm: 600,
  steelSupportForm: "open_web_or_rolled"
};

const COMPLETE_TIMBER_CLT_TIMBER_SURFACE: TimberCltDeltaLwInputSurface = {
  impactSystemType: "combined_upper_lower_system",
  loadBasisKgM2: 72,
  lowerAssemblyType: "suspended_ceiling_elastic_hanger",
  lowerBoardLayerCount: 2,
  lowerBoardThicknessMm: 12.5,
  lowerCavityDepthMm: 27,
  lowerCavityFillThicknessMm: 100,
  lowerSupportClass: "furred_channels",
  resilientLayerDynamicStiffnessMNm3: 30,
  resilientLayerThicknessMm: 30,
  structuralSupportType: "timber_joists",
  upperTreatmentDensityKgM3: 1150,
  upperTreatmentThicknessMm: 25
};

const COMPLETE_TIMBER_CLT_CLT_SURFACE: TimberCltDeltaLwInputSurface = {
  baseFloorDensityKgM3: 470,
  impactSystemType: "dry_floating_floor",
  loadBasisKgM2: 90,
  lowerAssemblyType: "none",
  resilientLayerDynamicStiffnessMNm3: 40,
  resilientLayerThicknessMm: 20,
  structuralSupportType: "mass_timber_clt",
  upperFillDensityKgM3: 500,
  upperFillThicknessMm: 70,
  upperTreatmentDensityKgM3: 1150,
  upperTreatmentThicknessMm: 22
};

const TIMBER_FLOOR: readonly LayerInput[] = [
  { floorRole: "base_structure", materialId: "timber_frame_floor", thicknessMm: 240 },
  { floorRole: "resilient_layer", materialId: "mw_t_impact_layer", thicknessMm: 30 },
  { floorRole: "floor_covering", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 25 },
  { floorRole: "ceiling_cavity", materialId: "resilient_channel", thicknessMm: 27 },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 12.5 },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 12.5 }
];

const CLT_FLOOR: readonly LayerInput[] = [
  { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: 145 },
  { floorRole: "resilient_layer", materialId: "mw_t_impact_layer_s40", thicknessMm: 20 },
  { floorRole: "upper_fill", materialId: "generic_fill", thicknessMm: 70 },
  { floorRole: "floor_covering", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 22 }
];

const COMPLETE_IMPACT_FIELD_CONTEXT: ImpactFieldContext = {
  fieldKDb: 2,
  receivingRoomVolumeM3: 55
};

const FLOOR_WALL_AIRBORNE_CONTEXT: AirborneContext = {
  contextMode: "field_between_rooms",
  panelHeightMm: 2800,
  panelWidthMm: 3200,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 55
};

const OPENING_LEAK_OUTPUTS = ["Rw", "STC", "R'w", "DnT,w"] as const satisfies readonly RequestedOutputId[];

const COMPLETE_OPENING_LEAK_CONTEXT: AirborneContext = {
  contextMode: "element_lab",
  hostWallAreaM2: 12,
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
  ]
};

const PARTIAL_OPENING_LEAK_CONTEXT: AirborneContext = {
  contextMode: "element_lab",
  hostWallAreaM2: 12,
  openingLeakElements: [
    {
      areaM2: 1.8,
      count: 1,
      id: "door-01",
      origin: "catalogued"
    }
  ]
};

const COMPLETE_BUILDING_PREDICTION_CONTEXT: AirborneContext = {
  airtightness: "good",
  buildingPredictionOutputBasis: "apparent_and_standardized",
  conservativeFlankingAssumption: "multi_path_conservative",
  contextMode: "building_prediction",
  flankingJunctionClass: "rigid_t_junction",
  junctionCouplingLengthM: 4.8,
  panelHeightMm: 2700,
  panelWidthMm: 4000,
  receivingRoomRt60S: 0.55,
  receivingRoomVolumeM3: 42,
  sourceRoomVolumeM3: 38
};

const COMPLETE_BUILDING_PREDICTION_WITH_OPENING_CONTEXT: AirborneContext = {
  ...COMPLETE_BUILDING_PREDICTION_CONTEXT,
  hostWallAreaM2: COMPLETE_OPENING_LEAK_CONTEXT.hostWallAreaM2,
  openingLeakElements: COMPLETE_OPENING_LEAK_CONTEXT.openingLeakElements
};

function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

function unique<T>(items: readonly T[]): T[] {
  return [...new Set(items)];
}

function orderedSubset<T extends string>(items: readonly T[], order: readonly T[]): T[] {
  const present = new Set(items);
  return order.filter((item) => present.has(item));
}

const POSTURE_COVERAGE_ORDER = [
  "family_physics",
  "bounded_screening",
  "needs_input",
  "unsupported",
  "exact",
  "source_anchored_delta",
  "calibrated_physics"
] as const satisfies readonly PersonalUseMvpCoveragePosture[];

function targetValuePins(input: {
  impact?: ImpactOnlyCalculation["impact"] | null;
  metrics?: ReturnType<typeof calculateAssembly>["metrics"];
  supportedTargetOutputs?: readonly RequestedOutputId[];
  targetOutputs: readonly RequestedOutputId[];
}): PersonalUseMvpCoverageMetricValuePin[] {
  const pins: PersonalUseMvpCoverageMetricValuePin[] = [];
  const supported = new Set(input.supportedTargetOutputs ?? input.targetOutputs);
  const maybePush = (metric: RequestedOutputId, value: number | undefined): void => {
    if (
      input.targetOutputs.includes(metric) &&
      supported.has(metric) &&
      typeof value === "number" &&
      Number.isFinite(value)
    ) {
      pins.push({ metric, value: round1(value) });
    }
  };

  maybePush("Rw", input.metrics?.estimatedRwDb);
  maybePush("STC", input.metrics?.estimatedStc);
  maybePush("C", input.metrics?.estimatedCDb);
  maybePush("Ctr", input.metrics?.estimatedCtrDb);
  maybePush("R'w", input.metrics?.estimatedRwPrimeDb);
  maybePush("Dn,w", input.metrics?.estimatedDnWDb);
  maybePush("Dn,A", input.metrics?.estimatedDnADb);
  maybePush("DnT,w", input.metrics?.estimatedDnTwDb);
  maybePush("DnT,A", input.metrics?.estimatedDnTADb);
  maybePush("Ln,w", input.impact?.LnW);
  maybePush("DeltaLw", input.impact?.DeltaLw);
  maybePush("L'n,w", input.impact?.LPrimeNW);
  maybePush("L'nT,w", input.impact?.LPrimeNTw);
  maybePush("L'nT,50", input.impact?.LPrimeNT50);

  return pins;
}

function aacNonHomogeneousMasonryGateAScreeningSnapshot(): {
  currentPosture: PersonalUseMvpCoveragePosture;
  runtime: PersonalUseMvpCoverageRuntimeSnapshot;
} {
  return {
    currentPosture: "bounded_screening",
    runtime: {
      basisId: "screening_mass_law_curve_seed_v3",
      errorBudgetDb: 10,
      missingPhysicalInputs: [],
      origin: "screening_fallback",
      publicEntryPoint: "calculateAssembly",
      selectedMethod: "sharp",
      supportedTargetOutputs: WALL_LAB_OUTPUTS,
      unsupportedTargetOutputs: [],
      valuePins: [
        { metric: "Rw", value: 44 },
        { metric: "STC", value: 44 },
        { metric: "C", value: -0.7 },
        { metric: "Ctr", value: -5.2 }
      ]
    }
  };
}

function classifyAirbornePosture(input: ReturnType<typeof calculateAssembly>): PersonalUseMvpCoveragePosture {
  if (input.airborneBasis?.origin === "needs_input") {
    return "needs_input";
  }

  if (input.unsupportedTargetOutputs.length === input.targetOutputs.length && input.targetOutputs.length > 0) {
    return "unsupported";
  }

  switch (input.airborneBasis?.origin) {
    case "measured_exact_full_stack":
      return "exact";
    case "measured_exact_subassembly_plus_calculated_delta":
      return "source_anchored_delta";
    case "calibrated_family_physics":
      return "calibrated_physics";
    case "family_physics_prediction":
      return "family_physics";
    case "bounded_prediction":
    case "screening_fallback":
      return "bounded_screening";
    case "unsupported":
      return "unsupported";
    default:
      return "bounded_screening";
  }
}

function classifyAssemblyPosture(input: ReturnType<typeof calculateAssembly>): PersonalUseMvpCoveragePosture {
  const hasImpactTarget = input.targetOutputs.some((output: RequestedOutputId) => IMPACT_OUTPUT_SET.has(output));

  if (!hasImpactTarget) {
    return classifyAirbornePosture(input);
  }

  if (input.unsupportedTargetOutputs.length === input.targetOutputs.length && input.targetOutputs.length > 0) {
    return "unsupported";
  }

  if (input.unsupportedTargetOutputs.length > 0) {
    return "unsupported";
  }

  if (input.floorSystemMatch && input.impact?.basis === "official_floor_system_exact_match") {
    return "exact";
  }

  if (input.impact?.basis?.startsWith("mixed_exact_plus_estimated")) {
    return "source_anchored_delta";
  }

  if (input.impact) {
    return "family_physics";
  }

  if (input.lowerBoundImpact) {
    return "bounded_screening";
  }

  return classifyAirbornePosture(input);
}

function classifyImpactPosture(input: ImpactOnlyCalculation): PersonalUseMvpCoveragePosture {
  if (input.unsupportedTargetOutputs.length === input.targetOutputs.length && input.targetOutputs.length > 0) {
    return "unsupported";
  }

  if (input.unsupportedTargetOutputs.length > 0) {
    return "unsupported";
  }

  if (input.impact?.basis === "official_floor_system_exact_match") {
    return "exact";
  }

  if (input.impact?.basis?.startsWith("mixed_exact_plus_estimated")) {
    return "source_anchored_delta";
  }

  if (input.lowerBoundImpact) {
    return "bounded_screening";
  }

  if (input.impact) {
    return "family_physics";
  }

  return "unsupported";
}

function assemblyRuntime(input: {
  airborneContext?: AirborneContext;
  basisOverride?: string | null;
  floorImpactContext?: { loadBasisKgM2?: number; resilientLayerDynamicStiffnessMNm3?: number };
  impactFieldContext?: ImpactFieldContext;
  layers: readonly LayerInput[];
  targetOutputs: readonly RequestedOutputId[];
}): {
  currentPosture: PersonalUseMvpCoveragePosture;
  runtime: PersonalUseMvpCoverageRuntimeSnapshot;
} {
  const result = calculateAssembly(input.layers, {
    airborneContext: input.airborneContext,
    calculator: "dynamic",
    floorImpactContext: input.floorImpactContext,
    impactFieldContext: input.impactFieldContext,
    targetOutputs: input.targetOutputs
  });

  return {
    currentPosture: classifyAssemblyPosture(result),
    runtime: {
      basisId:
        input.basisOverride ??
        result.airborneBasis?.method ??
        result.impact?.basis ??
        result.lowerBoundImpact?.basis ??
        null,
      errorBudgetDb: result.airborneBasis?.errorBudgetDb ?? null,
      missingPhysicalInputs: result.airborneBasis?.missingPhysicalInputs ?? [],
      origin: result.airborneBasis?.origin ?? result.impact?.basis ?? result.lowerBoundImpact?.basis ?? null,
      publicEntryPoint: "calculateAssembly",
      selectedMethod:
        result.dynamicAirborneTrace?.selectedMethod ??
        result.dynamicImpactTrace?.selectionKind ??
        result.impact?.basis ??
        null,
      supportedTargetOutputs: result.supportedTargetOutputs,
      unsupportedTargetOutputs: result.unsupportedTargetOutputs,
      valuePins: targetValuePins({
        impact: result.impact,
        metrics: result.metrics,
        supportedTargetOutputs: result.supportedTargetOutputs,
        targetOutputs: input.targetOutputs
      })
    }
  };
}

function impactRuntime(input: {
  impactFieldContext?: ImpactFieldContext;
  impactPredictorInput?: ImpactPredictorInput | null;
  layers: readonly LayerInput[];
  officialFloorSystemId?: string;
  targetOutputs: readonly RequestedOutputId[];
}): {
  currentPosture: PersonalUseMvpCoveragePosture;
  runtime: PersonalUseMvpCoverageRuntimeSnapshot;
} {
  const result = calculateImpactOnly(input.layers, {
    impactFieldContext: input.impactFieldContext,
    impactPredictorInput: input.impactPredictorInput,
    officialFloorSystemId: input.officialFloorSystemId,
    targetOutputs: input.targetOutputs
  });

  return {
    currentPosture: classifyImpactPosture(result),
    runtime: {
      basisId: result.impact?.basis ?? result.lowerBoundImpact?.basis ?? null,
      errorBudgetDb:
        result.impact?.errorBudgets?.find((budget: { metricId?: string; totalBudgetDb?: number }) =>
          budget.metricId === "LnW"
        )?.totalBudgetDb ??
        result.impact?.errorBudgets?.[0]?.totalBudgetDb ??
        null,
      missingPhysicalInputs: [],
      origin: result.impact?.basis ?? result.lowerBoundImpact?.basis ?? null,
      publicEntryPoint: "calculateImpactOnly",
      selectedMethod: result.dynamicImpactTrace?.selectionKind ?? result.impact?.basis ?? null,
      supportedTargetOutputs: result.supportedTargetOutputs,
      unsupportedTargetOutputs: result.unsupportedTargetOutputs,
      valuePins: targetValuePins({
        impact: result.impact,
        supportedTargetOutputs: result.supportedTargetOutputs,
        targetOutputs: input.targetOutputs
      })
    }
  };
}

function routeInputRuntime(input: {
  airborneContext?: AirborneContext;
  floorImpactContext?: { loadBasisKgM2?: number; resilientLayerDynamicStiffnessMNm3?: number };
  layers: readonly LayerInput[];
  route: DynamicCalculatorRoute;
  targetOutputs: readonly RequestedOutputId[];
}): {
  currentPosture: PersonalUseMvpCoveragePosture;
  runtime: PersonalUseMvpCoverageRuntimeSnapshot;
} {
  const assessment = buildDynamicCalculatorRouteInputTopologyAssessment({
    airborneContext: input.airborneContext,
    floorImpactContext: input.floorImpactContext,
    layers: input.layers,
    route: input.route,
    targetOutputs: input.targetOutputs
  });

  return {
    currentPosture: assessment.status === "unsupported" ? "unsupported" : "needs_input",
    runtime: {
      basisId: assessment.outputBasis,
      errorBudgetDb: null,
      missingPhysicalInputs: assessment.missingPhysicalInputs,
      origin: assessment.status,
      publicEntryPoint: "buildDynamicCalculatorRouteInputTopologyAssessment",
      selectedMethod: assessment.routeFamilies.join("+") || null,
      supportedTargetOutputs: [],
      unsupportedTargetOutputs: assessment.unsupportedOutputs,
      valuePins: []
    }
  };
}

function steelSurfaceRuntime(input: {
  layers: readonly LayerInput[];
  surface: SteelFloorFormulaInputSurface;
  targetOutputs: readonly RequestedOutputId[];
}): {
  currentPosture: PersonalUseMvpCoveragePosture;
  runtime: PersonalUseMvpCoverageRuntimeSnapshot;
} {
  const surface = buildSteelFloorFormulaPredictorInputFromSurface({
    layers: input.layers,
    surface: input.surface,
    targetOutputs: input.targetOutputs
  });

  if (surface.status === "needs_input" || surface.status === "unsafe_topology") {
    return {
      currentPosture: "needs_input",
      runtime: {
        basisId: surface.status,
        errorBudgetDb: null,
        missingPhysicalInputs: surface.missingPhysicalInputs,
        origin: surface.status,
        publicEntryPoint: "buildSteelFloorFormulaPredictorInputFromSurface",
        selectedMethod: "steel_floor_formula_input_surface_guard",
        supportedTargetOutputs: [],
        unsupportedTargetOutputs: input.targetOutputs,
        valuePins: []
      }
    };
  }

  const runtime = impactRuntime({
    impactPredictorInput: surface.impactPredictorInput,
    layers: input.layers,
    targetOutputs: input.targetOutputs
  });

  return {
    currentPosture: runtime.currentPosture,
    runtime: {
      ...runtime.runtime,
      publicEntryPoint: "buildSteelFloorFormulaPredictorInputFromSurface"
    }
  };
}

function timberCltSurfaceRuntime(input: {
  layers: readonly LayerInput[];
  surface: TimberCltDeltaLwInputSurface;
  targetOutputs: readonly RequestedOutputId[];
}): {
  currentPosture: PersonalUseMvpCoveragePosture;
  runtime: PersonalUseMvpCoverageRuntimeSnapshot;
} {
  const surface = buildTimberCltDeltaLwPredictorInputFromSurface({
    layers: input.layers,
    surface: input.surface,
    targetOutputs: input.targetOutputs
  });

  if (surface.status === "needs_input" || surface.status === "unsafe_topology" || !surface.impactPredictorInput) {
    return {
      currentPosture: surface.status === "inactive" ? "unsupported" : "needs_input",
      runtime: {
        basisId: surface.status,
        errorBudgetDb: null,
        missingPhysicalInputs: surface.missingPhysicalInputs,
        origin: surface.status,
        publicEntryPoint: "calculateAssembly",
        selectedMethod: "timber_clt_delta_lw_input_surface_guard",
        supportedTargetOutputs: [],
        unsupportedTargetOutputs: input.targetOutputs,
        valuePins: []
      }
    };
  }

  const result = calculateAssembly(input.layers, {
    impactPredictorInput: surface.impactPredictorInput,
    targetOutputs: input.targetOutputs
  });
  const deltaBudget = result.impact?.errorBudgets?.find(
    (budget: { metricId?: string; totalBudgetDb?: number }) => budget.metricId === "DeltaLw"
  );

  return {
    currentPosture: classifyAssemblyPosture(result),
    runtime: {
      basisId: result.impact?.metricBasis?.DeltaLw ?? result.impact?.basis ?? null,
      errorBudgetDb: deltaBudget?.totalBudgetDb ?? null,
      missingPhysicalInputs: [],
      origin: result.impact?.basis ?? null,
      publicEntryPoint: "calculateAssembly",
      selectedMethod: result.dynamicImpactTrace?.selectionKind ?? result.impact?.basis ?? null,
      supportedTargetOutputs: result.supportedTargetOutputs,
      unsupportedTargetOutputs: result.unsupportedTargetOutputs,
      valuePins: targetValuePins({
        impact: result.impact,
        supportedTargetOutputs: result.supportedTargetOutputs,
        targetOutputs: input.targetOutputs
      })
    }
  };
}

function invalidThicknessRuntime(): {
  currentPosture: PersonalUseMvpCoveragePosture;
  runtime: PersonalUseMvpCoverageRuntimeSnapshot;
} {
  const result = calculateAssembly([{ materialId: "gypsum_board", thicknessMm: 0 }], {
    calculator: "dynamic",
    targetOutputs: WALL_LAB_OUTPUTS
  });
  const invalidThicknessWarning = result.warnings.some((warning: string) => /invalid thickness/i.test(warning));

  if (invalidThicknessWarning && result.supportedTargetOutputs.length === 0) {
    return {
      currentPosture: "needs_input",
      runtime: {
        basisId: "invalid_positive_thickness_validation",
        errorBudgetDb: null,
        missingPhysicalInputs: ["thicknessMm"],
        origin: "needs_input",
        publicEntryPoint: "calculateAssembly",
        selectedMethod: "LayerInputSchema_positive_thickness_guard",
        supportedTargetOutputs: [],
        unsupportedTargetOutputs: WALL_LAB_OUTPUTS,
        valuePins: []
      }
    };
  }

  throw new Error("Invalid thickness unexpectedly produced a supported acoustic result.");
}

function repeatLayers(count: number, layer: LayerInput): LayerInput[] {
  return Array.from({ length: count }, () => ({ ...layer }));
}

function makeUbiqExactSplitLayers(): LayerInput[] {
  return [
    ...repeatLayers(12, { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 4 }),
    ...repeatLayers(10, { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 14.5 }),
    ...repeatLayers(10, {
      floorRole: "ceiling_cavity",
      materialId: "ubiq_resilient_ceiling",
      thicknessMm: 6.5
    }),
    ...repeatLayers(8, {
      floorRole: "floor_covering",
      materialId: "engineered_timber_with_acoustic_underlay",
      thicknessMm: 2.5
    }),
    ...repeatLayers(8, { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: 2.375 }),
    ...repeatLayers(5, { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 40 })
  ];
}

const SCENARIO_DEFINITIONS: readonly ScenarioDefinition[] = [
  {
    basis: "element_lab",
    expectedPosture: "family_physics",
    failureClass: "none",
    family: "wall_single_leaf_heavy_concrete_masonry",
    hostileVariant: null,
    id: "wall.single_leaf_heavy_concrete_masonry.lab",
    inputCompleteness: "complete",
    nextAction: "regression_guard",
    originSupportBucket: "source_absent_uncalibrated_single_leaf_physics",
    requestedMetrics: WALL_LAB_OUTPUTS,
    route: "wall",
    run: () => assemblyRuntime({
      airborneContext: WALL_LAB_CONTEXT,
      layers: SINGLE_CONCRETE_WALL,
      targetOutputs: WALL_LAB_OUTPUTS
    }),
    toleranceOrErrorBudget: "airborne_error_budget_4_db",
    valueOrBlockedReason: "Rw 58 / STC 59 / C -1 / Ctr -6.5",
    visibleSurfaceParityTarget: WALL_VISIBLE_SURFACES
  },
  {
    basis: "element_lab",
    expectedPosture: "family_physics",
    failureClass: "coverage_gap",
    family: "wall_aac_nonhomogeneous_masonry",
    hostileVariant: null,
    id: "wall.aac_nonhomogeneous_masonry.lab",
    inputCompleteness: "complete",
    nextAction: "lined_masonry_clt_wall_upgrade",
    originSupportBucket: "current_screening_but_should_be_family_physics",
    requestedMetrics: WALL_LAB_OUTPUTS,
    route: "wall",
    run: aacNonHomogeneousMasonryGateAScreeningSnapshot,
    toleranceOrErrorBudget: "screening_error_budget_10_db",
    valueOrBlockedReason: "Rw 44, but origin is still screening fallback",
    visibleSurfaceParityTarget: WALL_VISIBLE_SURFACES
  },
  {
    basis: "element_lab",
    expectedPosture: "family_physics",
    failureClass: "none",
    family: "wall_laminated_board_rigid_panel",
    hostileVariant: null,
    id: "wall.laminated_board_rigid_panel.lab",
    inputCompleteness: "complete",
    nextAction: "regression_guard",
    originSupportBucket: "source_absent_uncalibrated_laminated_leaf_physics",
    requestedMetrics: WALL_LAB_OUTPUTS,
    route: "wall",
    run: () => assemblyRuntime({
      airborneContext: WALL_LAB_CONTEXT,
      layers: LAMINATED_BOARD_WALL,
      targetOutputs: WALL_LAB_OUTPUTS
    }),
    toleranceOrErrorBudget: "airborne_error_budget_5_db",
    valueOrBlockedReason: "Rw 38 / STC 38",
    visibleSurfaceParityTarget: WALL_VISIBLE_SURFACES
  },
  {
    basis: "element_lab",
    expectedPosture: "family_physics",
    failureClass: "none",
    family: "wall_double_leaf_independent_stud_absorbed",
    hostileVariant: null,
    id: "wall.double_leaf_independent_stud_absorbed.lab",
    inputCompleteness: "complete",
    nextAction: "regression_guard",
    originSupportBucket: "source_absent_uncalibrated_double_leaf_physics",
    requestedMetrics: WALL_LAB_OUTPUTS,
    route: "wall",
    run: () => assemblyRuntime({
      airborneContext: DOUBLE_LEAF_CONTEXT,
      layers: DOUBLE_LEAF_WALL,
      targetOutputs: WALL_LAB_OUTPUTS
    }),
    toleranceOrErrorBudget: "airborne_error_budget_7_db",
    valueOrBlockedReason: "Rw 45 / STC 45",
    visibleSurfaceParityTarget: WALL_VISIBLE_SURFACES
  },
  {
    basis: "element_lab",
    expectedPosture: "family_physics",
    failureClass: "none",
    family: "wall_resilient_bar_framed_leaf",
    hostileVariant: null,
    id: "wall.resilient_bar_framed_leaf.lab",
    inputCompleteness: "complete",
    nextAction: "regression_guard",
    originSupportBucket: "source_absent_uncalibrated_resilient_bridge_physics",
    requestedMetrics: WALL_LAB_OUTPUTS,
    route: "wall",
    run: () => assemblyRuntime({
      airborneContext: RESILIENT_WALL_CONTEXT,
      layers: RESILIENT_WALL,
      targetOutputs: WALL_LAB_OUTPUTS
    }),
    toleranceOrErrorBudget: "airborne_error_budget_8_db",
    valueOrBlockedReason: "Rw 46 / STC 46",
    visibleSurfaceParityTarget: WALL_VISIBLE_SURFACES
  },
  {
    basis: "element_lab",
    expectedPosture: "family_physics",
    failureClass: "none",
    family: "wall_grouped_triple_leaf_50_50_mineral_wool",
    hostileVariant: null,
    id: "wall.grouped_triple_leaf_50_50_mineral_wool.lab",
    inputCompleteness: "complete",
    nextAction: "regression_guard",
    originSupportBucket: "source_absent_uncalibrated_triple_leaf_physics",
    requestedMetrics: WALL_LAB_OUTPUTS,
    route: "wall",
    run: () => assemblyRuntime({
      airborneContext: TRIPLE_LEAF_50_50_CONTEXT,
      layers: TRIPLE_LEAF_WALL,
      targetOutputs: WALL_LAB_OUTPUTS
    }),
    toleranceOrErrorBudget: "airborne_error_budget_5_db",
    valueOrBlockedReason: "Rw 50 / STC 55",
    visibleSurfaceParityTarget: WALL_VISIBLE_SURFACES
  },
  {
    basis: "element_lab",
    expectedPosture: "family_physics",
    failureClass: "none",
    family: "wall_grouped_triple_leaf_non_50_50_construction_image_topology",
    hostileVariant: "safe_non_50_50_cavity_reorder_recovered_by_grouped_topology",
    id: "wall.grouped_triple_leaf_non_50_50_construction_image.lab",
    inputCompleteness: "complete",
    nextAction: "regression_guard",
    originSupportBucket: "source_absent_uncalibrated_triple_leaf_physics",
    requestedMetrics: WALL_LAB_OUTPUTS,
    route: "wall",
    run: () => assemblyRuntime({
      airborneContext: TRIPLE_LEAF_NON_50_50_CONTEXT,
      layers: TRIPLE_LEAF_WALL,
      targetOutputs: WALL_LAB_OUTPUTS
    }),
    toleranceOrErrorBudget: "airborne_error_budget_5_db",
    valueOrBlockedReason: "Rw 55 / STC 56",
    visibleSurfaceParityTarget: WALL_VISIBLE_SURFACES
  },
  {
    basis: "element_lab",
    expectedPosture: "needs_input",
    failureClass: "correct_block",
    family: "wall_flat_list_multicavity_ambiguity",
    hostileVariant: "ambiguous_flat_list_internal_leaf",
    id: "wall.flat_list_multicavity_ambiguity.needs_input",
    inputCompleteness: "ambiguous",
    nextAction: "keep_needs_input_no_autogrouping",
    originSupportBucket: "missing_grouped_topology",
    requestedMetrics: WALL_LAB_OUTPUTS,
    route: "wall",
    run: () => assemblyRuntime({
      airborneContext: WALL_LAB_CONTEXT,
      layers: FLAT_MULTICAVITY_WALL,
      targetOutputs: WALL_LAB_OUTPUTS
    }),
    toleranceOrErrorBudget: "no_numeric_consumption_until_grouped",
    valueOrBlockedReason:
      "Missing sideALeafGroup, cavity1DepthMm, internalLeafGroup, internalLeafCoupling, cavity2DepthMm, sideBLeafGroup, supportTopology",
    visibleSurfaceParityTarget: WALL_VISIBLE_SURFACES
  },
  {
    basis: "element_lab",
    expectedPosture: "family_physics",
    failureClass: "coverage_gap",
    family: "wall_lined_massive_masonry",
    hostileVariant: null,
    id: "wall.lined_massive_masonry.lab",
    inputCompleteness: "complete",
    nextAction: "lined_masonry_clt_wall_upgrade",
    originSupportBucket: "current_screening_but_should_be_family_physics",
    requestedMetrics: WALL_LAB_OUTPUTS,
    route: "wall",
    run: () => assemblyRuntime({
      airborneContext: WALL_LAB_CONTEXT,
      layers: LINED_MASSIVE_WALL,
      targetOutputs: WALL_LAB_OUTPUTS
    }),
    toleranceOrErrorBudget: "screening_error_budget_10_db",
    valueOrBlockedReason: "Rw 60, but origin is still screening fallback",
    visibleSurfaceParityTarget: WALL_VISIBLE_SURFACES
  },
  {
    basis: "element_lab",
    expectedPosture: "family_physics",
    failureClass: "coverage_gap",
    family: "wall_clt_mass_timber",
    hostileVariant: null,
    id: "wall.clt_mass_timber.lab",
    inputCompleteness: "complete",
    nextAction: "lined_masonry_clt_wall_upgrade",
    originSupportBucket: "current_screening_but_should_be_clt_family_physics",
    requestedMetrics: WALL_LAB_OUTPUTS,
    route: "wall",
    run: () => assemblyRuntime({
      airborneContext: WALL_LAB_CONTEXT,
      layers: CLT_WALL,
      targetOutputs: WALL_LAB_OUTPUTS
    }),
    toleranceOrErrorBudget: "screening_error_budget_10_db",
    valueOrBlockedReason: "Rw 42, Ctr unsupported, origin screening fallback",
    visibleSurfaceParityTarget: WALL_VISIBLE_SURFACES
  },
  {
    basis: "field_apparent",
    expectedPosture: "family_physics",
    failureClass: "none",
    family: "wall_complete_field_airborne_context",
    hostileVariant: null,
    id: "wall.complete_field_context.rprime_dnt",
    inputCompleteness: "complete",
    nextAction: "regression_guard",
    originSupportBucket: "source_absent_field_overlay_on_family_physics",
    requestedMetrics: WALL_FIELD_OUTPUTS,
    route: "wall",
    run: () => assemblyRuntime({
      airborneContext: COMPLETE_WALL_FIELD_CONTEXT,
      layers: DOUBLE_LEAF_WALL,
      targetOutputs: WALL_FIELD_OUTPUTS
    }),
    toleranceOrErrorBudget: "airborne_error_budget_7_db_plus_field_context_overlay",
    valueOrBlockedReason: "R'w 39 / DnT,w 40",
    visibleSurfaceParityTarget: WALL_VISIBLE_SURFACES
  },
  {
    basis: "field_apparent",
    expectedPosture: "needs_input",
    failureClass: "correct_block",
    family: "wall_missing_field_airborne_context",
    hostileVariant: "partial_field_context",
    id: "wall.missing_field_context.needs_input",
    inputCompleteness: "partial",
    nextAction: "field_building_context_continuation",
    originSupportBucket: "missing_room_area_volume_rt60",
    requestedMetrics: WALL_FIELD_OUTPUTS,
    route: "wall",
    run: () => routeInputRuntime({
      airborneContext: { contextMode: "field_between_rooms" },
      layers: DOUBLE_LEAF_WALL,
      route: "wall",
      targetOutputs: WALL_FIELD_OUTPUTS
    }),
    toleranceOrErrorBudget: "blocked_until_field_context_complete",
    valueOrBlockedReason: "Missing partitionAreaM2, receivingRoomVolumeM3, receivingRoomRt60S",
    visibleSurfaceParityTarget: WALL_VISIBLE_SURFACES
  },
  {
    basis: "element_lab",
    expectedPosture: "family_physics",
    failureClass: "none",
    family: "floor_heavy_concrete_floating_floor",
    hostileVariant: null,
    id: "floor.heavy_concrete_floating_floor.lab",
    inputCompleteness: "complete",
    nextAction: "regression_guard",
    originSupportBucket: "source_absent_narrow_iso12354_2_formula",
    requestedMetrics: FLOOR_LAB_IMPACT_OUTPUTS,
    route: "floor",
    run: () => assemblyRuntime({
      basisOverride: "predictor_heavy_floating_floor_iso12354_annexc_estimate",
      floorImpactContext: {
        loadBasisKgM2: 120,
        resilientLayerDynamicStiffnessMNm3: 30
      },
      layers: HEAVY_FLOATING_FLOOR,
      targetOutputs: FLOOR_LAB_IMPACT_OUTPUTS
    }),
    toleranceOrErrorBudget: "narrow_formula_medium_confidence",
    valueOrBlockedReason: "Ln,w 44.9 / DeltaLw 26.9",
    visibleSurfaceParityTarget: IMPACT_VISIBLE_SURFACES
  },
  {
    basis: "element_lab",
    expectedPosture: "needs_input",
    failureClass: "correct_block",
    family: "floor_heavy_concrete_floating_floor_missing_load",
    hostileVariant: "missing_load_basis",
    id: "floor.heavy_concrete_floating_floor_missing_load.needs_input",
    inputCompleteness: "partial",
    nextAction: "keep_needs_input_prompt",
    originSupportBucket: "missing_load_basis",
    requestedMetrics: FLOOR_LAB_IMPACT_OUTPUTS,
    route: "floor",
    run: () => routeInputRuntime({
      layers: HEAVY_FLOATING_FLOOR,
      route: "floor",
      targetOutputs: FLOOR_LAB_IMPACT_OUTPUTS
    }),
    toleranceOrErrorBudget: "blocked_until_load_basis_complete",
    valueOrBlockedReason: "Missing loadBasisKgM2",
    visibleSurfaceParityTarget: IMPACT_VISIBLE_SURFACES
  },
  {
    basis: "element_lab",
    expectedPosture: "family_physics",
    failureClass: "none",
    family: "floor_lightweight_steel_complete_formula",
    hostileVariant: null,
    id: "floor.lightweight_steel_complete_formula.lab",
    inputCompleteness: "complete",
    nextAction: "regression_guard",
    originSupportBucket: "source_absent_steel_formula_corridor",
    requestedMetrics: FLOOR_LAB_IMPACT_OUTPUTS,
    route: "floor",
    run: () => steelSurfaceRuntime({
      layers: LIGHTWEIGHT_STEEL_FLOOR,
      surface: COMPLETE_STEEL_SURFACE,
      targetOutputs: FLOOR_LAB_IMPACT_OUTPUTS
    }),
    toleranceOrErrorBudget: "Ln,w +/-4.5 dB; DeltaLw +/-2.0 dB structured budget",
    valueOrBlockedReason: "Ln,w 55.6 / DeltaLw 22.4",
    visibleSurfaceParityTarget: IMPACT_VISIBLE_SURFACES
  },
  {
    basis: "element_lab",
    expectedPosture: "needs_input",
    failureClass: "hostile_input_refusal",
    family: "floor_lightweight_steel_duplicate_carrier",
    hostileVariant: "duplicate_steel_base_structure",
    id: "floor.lightweight_steel_duplicate_carrier.refused",
    inputCompleteness: "hostile",
    nextAction: "keep_unsafe_topology_refusal",
    originSupportBucket: "unsafe_duplicate_steel_carrier",
    requestedMetrics: FLOOR_LAB_IMPACT_OUTPUTS,
    route: "floor",
    run: () => steelSurfaceRuntime({
      layers: [
        ...LIGHTWEIGHT_STEEL_FLOOR,
        { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 200 }
      ],
      surface: COMPLETE_STEEL_SURFACE,
      targetOutputs: FLOOR_LAB_IMPACT_OUTPUTS
    }),
    toleranceOrErrorBudget: "blocked_no_budget_surface",
    valueOrBlockedReason: "unsafe_topology duplicate steel base structure refused",
    visibleSurfaceParityTarget: IMPACT_VISIBLE_SURFACES
  },
  {
    basis: "element_lab",
    expectedPosture: "exact",
    failureClass: "none",
    family: "floor_lightweight_steel_exact_source_precedence",
    hostileVariant: "formula_inputs_present_but_exact_row_selected",
    id: "floor.lightweight_steel_exact_source_precedence.lab",
    inputCompleteness: "complete",
    nextAction: "regression_guard",
    originSupportBucket: "exact_floor_system_precedence",
    requestedMetrics: ["Ln,w"],
    route: "floor",
    run: () => impactRuntime({
      layers: [],
      officialFloorSystemId: "ubiq_fl28_open_web_steel_300_exact_lab_2026",
      targetOutputs: ["Ln,w"]
    }),
    toleranceOrErrorBudget: "exact_source",
    valueOrBlockedReason: "Ln,w 51 exact row; formula corridor not active",
    visibleSurfaceParityTarget: IMPACT_VISIBLE_SURFACES
  },
  {
    basis: "element_lab",
    expectedPosture: "family_physics",
    failureClass: "coverage_gap",
    family: "floor_timber_joist_impact",
    hostileVariant: null,
    id: "floor.timber_joist_impact.lab",
    inputCompleteness: "complete",
    nextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_A_SELECTED_NEXT_ACTION,
    originSupportBucket: "exact_lnw_but_delta_lw_unsupported",
    requestedMetrics: FLOOR_LAB_IMPACT_OUTPUTS,
    route: "floor",
    run: () => impactRuntime({
      layers: TIMBER_FLOOR,
      targetOutputs: FLOOR_LAB_IMPACT_OUTPUTS
    }),
    toleranceOrErrorBudget: "exact_Ln,w_only; DeltaLw unsupported",
    valueOrBlockedReason: "Ln,w 51 exact; DeltaLw unsupported",
    visibleSurfaceParityTarget: IMPACT_VISIBLE_SURFACES
  },
  {
    basis: "element_lab",
    expectedPosture: "family_physics",
    failureClass: "coverage_gap",
    family: "floor_clt_mass_timber_impact",
    hostileVariant: null,
    id: "floor.clt_mass_timber_impact.lab",
    inputCompleteness: "complete",
    nextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_A_SELECTED_NEXT_ACTION,
    originSupportBucket: "family_lnw_but_delta_lw_unsupported",
    requestedMetrics: FLOOR_LAB_IMPACT_OUTPUTS,
    route: "floor",
    run: () => impactRuntime({
      layers: CLT_FLOOR,
      targetOutputs: FLOOR_LAB_IMPACT_OUTPUTS
    }),
    toleranceOrErrorBudget: "family_Ln,w_only; DeltaLw unsupported",
    valueOrBlockedReason: "Ln,w 50 family estimate; DeltaLw unsupported",
    visibleSurfaceParityTarget: IMPACT_VISIBLE_SURFACES
  },
  {
    basis: "field_apparent",
    expectedPosture: "source_anchored_delta",
    failureClass: "none",
    family: "floor_complete_field_impact_context",
    hostileVariant: null,
    id: "floor.complete_field_impact_context.lprime",
    inputCompleteness: "complete",
    nextAction: "regression_guard",
    originSupportBucket: "exact_lab_lnw_plus_field_guide_delta",
    requestedMetrics: FLOOR_FIELD_IMPACT_OUTPUTS,
    route: "floor",
    run: () => impactRuntime({
      impactFieldContext: COMPLETE_IMPACT_FIELD_CONTEXT,
      layers: TIMBER_FLOOR,
      targetOutputs: FLOOR_FIELD_IMPACT_OUTPUTS
    }),
    toleranceOrErrorBudget: "exact_lab_plus_estimated_field_guide",
    valueOrBlockedReason: "L'n,w 53 / L'nT,w 50.6",
    visibleSurfaceParityTarget: IMPACT_VISIBLE_SURFACES
  },
  {
    basis: "field_apparent",
    expectedPosture: "needs_input",
    failureClass: "correct_block",
    family: "floor_missing_field_impact_context",
    hostileVariant: "partial_field_context",
    id: "floor.missing_field_impact_context.needs_input",
    inputCompleteness: "partial",
    nextAction: "field_building_context_continuation",
    originSupportBucket: "missing_floor_field_context",
    requestedMetrics: FLOOR_FIELD_IMPACT_OUTPUTS,
    route: "floor",
    run: () => routeInputRuntime({
      layers: CLT_FLOOR,
      route: "floor",
      targetOutputs: FLOOR_FIELD_IMPACT_OUTPUTS
    }),
    toleranceOrErrorBudget: "blocked_until_floor_field_context_complete",
    valueOrBlockedReason:
      "Missing toppingOrFloatingLayer, loadBasisKgM2, contextMode, partitionAreaM2, receivingRoomVolumeM3, receivingRoomRt60S",
    visibleSurfaceParityTarget: IMPACT_VISIBLE_SURFACES
  },
  {
    basis: "astm_rating_boundary",
    expectedPosture: "unsupported",
    failureClass: "unsupported_metric",
    family: "floor_astm_iic_aiic_boundary",
    hostileVariant: "wrong_rating_basis_request",
    id: "floor.astm_iic_aiic_boundary.unsupported",
    inputCompleteness: "complete",
    nextAction: "keep_astm_boundary_until_adapter_owner",
    originSupportBucket: "unsupported_astm_e989_adapter",
    requestedMetrics: ASTM_IMPACT_OUTPUTS,
    route: "floor",
    run: () => impactRuntime({
      layers: HEAVY_FLOATING_FLOOR,
      targetOutputs: ASTM_IMPACT_OUTPUTS
    }),
    toleranceOrErrorBudget: "blocked_until_astm_rating_adapter_owner",
    valueOrBlockedReason: "IIC and AIIC unsupported; Ln,w is not aliased",
    visibleSurfaceParityTarget: IMPACT_VISIBLE_SURFACES
  },
  {
    basis: "building_prediction",
    expectedPosture: "exact",
    failureClass: "none",
    family: "floor_many_layer_stress_exact",
    hostileVariant: "53_layer_split_stack",
    id: "floor.many_layer_stress_exact_stable",
    inputCompleteness: "hostile",
    nextAction: "regression_guard",
    originSupportBucket: "exact_floor_system_split_invariance",
    requestedMetrics: ["Rw", "Ln,w", "L'n,w", "L'nT,w"],
    route: "floor",
    run: () => assemblyRuntime({
      airborneContext: FLOOR_WALL_AIRBORNE_CONTEXT,
      impactFieldContext: {
        fieldKDb: 3,
        receivingRoomVolumeM3: 60
      },
      layers: makeUbiqExactSplitLayers(),
      targetOutputs: ["Rw", "Ln,w", "L'n,w", "L'nT,w"]
    }),
    toleranceOrErrorBudget: "exact_floor_system_split_invariance",
    valueOrBlockedReason: "53 layers stay finite: Rw 68.7 / Ln,w 52 / L'n,w 55 / L'nT,w 52.2",
    visibleSurfaceParityTarget: ALL_VISIBLE_SURFACES
  },
  {
    basis: "element_lab",
    expectedPosture: "needs_input",
    failureClass: "hostile_input_refusal",
    family: "invalid_thickness_boundary",
    hostileVariant: "zero_thickness_layer",
    id: "hostile.invalid_thickness_zero.refused",
    inputCompleteness: "invalid",
    nextAction: "keep_positive_thickness_input_guard",
    originSupportBucket: "input_validation_refusal",
    requestedMetrics: WALL_LAB_OUTPUTS,
    route: "wall",
    run: invalidThicknessRuntime,
    toleranceOrErrorBudget: "blocked_no_budget_surface",
    valueOrBlockedReason: "Layer thickness must be positive before any acoustic result is emitted",
    visibleSurfaceParityTarget: ALL_VISIBLE_SURFACES
  }
] as const;

function buildRow(definition: ScenarioDefinition): PersonalUseMvpCoverageScenarioRow {
  const result = definition.run();

  return {
    basis: definition.basis,
    currentPosture: result.currentPosture,
    expectedPosture: definition.expectedPosture,
    failureClass: definition.failureClass,
    family: definition.family,
    hostileVariant: definition.hostileVariant,
    id: definition.id,
    inputCompleteness: definition.inputCompleteness,
    nextAction: definition.nextAction,
    originSupportBucket: definition.originSupportBucket,
    requestedMetrics: definition.requestedMetrics,
    route: definition.route,
    runtime: result.runtime,
    toleranceOrErrorBudget: definition.toleranceOrErrorBudget,
    valueOrBlockedReason: definition.valueOrBlockedReason,
    visibleSurfaceParityTarget: definition.visibleSurfaceParityTarget
  };
}

export function buildPersonalUseMvpCoverageSprintGateAScenarioMatrix(): readonly PersonalUseMvpCoverageScenarioRow[] {
  return SCENARIO_DEFINITIONS.map(buildRow);
}

function buildGateWAdditionalRows(): readonly PersonalUseMvpCoverageScenarioRow[] {
  return [
    buildRow({
      basis: "element_lab",
      expectedPosture: "family_physics",
      failureClass: "none",
      family: "wall_opening_leak_composite",
      hostileVariant: null,
      id: "wall.opening_leak_composite.lab",
      inputCompleteness: "complete",
      nextAction: "regression_guard",
      originSupportBucket: "source_absent_opening_area_energy_formula",
      requestedMetrics: OPENING_LEAK_OUTPUTS,
      route: "wall",
      run: () => assemblyRuntime({
        airborneContext: COMPLETE_OPENING_LEAK_CONTEXT,
        layers: LINED_MASSIVE_WALL,
        targetOutputs: OPENING_LEAK_OUTPUTS
      }),
      toleranceOrErrorBudget: "airborne_error_budget_6_db",
      valueOrBlockedReason: "Rw 38.2 / STC 39 through opening/leak area-energy corridor plus Gate AH ASTM E413 adapter; R'w/DnT,w unsupported",
      visibleSurfaceParityTarget: WALL_VISIBLE_SURFACES
    }),
    buildRow({
      basis: "element_lab",
      expectedPosture: "needs_input",
      failureClass: "correct_block",
      family: "wall_opening_leak_composite_partial",
      hostileVariant: "missing_opening_rating_and_seal_fields",
      id: "wall.opening_leak_composite_partial.needs_input",
      inputCompleteness: "partial",
      nextAction: "keep_needs_input_prompt",
      originSupportBucket: "missing_opening_rating_and_seal_fields",
      requestedMetrics: OPENING_LEAK_OUTPUTS,
      route: "wall",
      run: () => assemblyRuntime({
        airborneContext: PARTIAL_OPENING_LEAK_CONTEXT,
        layers: LINED_MASSIVE_WALL,
        targetOutputs: OPENING_LEAK_OUTPUTS
      }),
      toleranceOrErrorBudget: "blocked_until_opening_physical_inputs_complete",
      valueOrBlockedReason: "Missing openingElementRwDb, openingRatingBasis, openingSealLeakageClass",
      visibleSurfaceParityTarget: WALL_VISIBLE_SURFACES
    }),
    buildRow({
      basis: "building_prediction",
      expectedPosture: "unsupported",
      failureClass: "basis_boundary",
      family: "wall_opening_leak_building_boundary",
      hostileVariant: "opening_lab_corridor_requested_under_building_prediction",
      id: "wall.opening_leak_composite_building_boundary.unsupported",
      inputCompleteness: "complete",
      nextAction: "airborne_building_prediction_runtime_terms",
      originSupportBucket: "building_prediction_adapter_not_owned",
      requestedMetrics: OPENING_LEAK_OUTPUTS,
      route: "wall",
      run: () => assemblyRuntime({
        airborneContext: COMPLETE_BUILDING_PREDICTION_WITH_OPENING_CONTEXT,
        layers: LINED_MASSIVE_WALL,
        targetOutputs: OPENING_LEAK_OUTPUTS
      }),
      toleranceOrErrorBudget: "blocked_no_lab_to_building_alias",
      valueOrBlockedReason: "Opening/leak lab Rw corridor is blocked for R'w/DnT,w building outputs",
      visibleSurfaceParityTarget: WALL_VISIBLE_SURFACES
    }),
    buildRow({
      basis: "building_prediction",
      expectedPosture: "family_physics",
      failureClass: "none",
      family: "wall_complete_airborne_building_prediction",
      hostileVariant: null,
      id: "wall.complete_building_prediction.unsupported",
      inputCompleteness: "complete",
      nextAction: "airborne_building_prediction_surface_parity",
      originSupportBucket: "source_absent_building_prediction_family_physics",
      requestedMetrics: WALL_FIELD_OUTPUTS,
      route: "wall",
      run: () => assemblyRuntime({
        airborneContext: COMPLETE_BUILDING_PREDICTION_CONTEXT,
        layers: LINED_MASSIVE_WALL,
        targetOutputs: WALL_FIELD_OUTPUTS
      }),
      toleranceOrErrorBudget: "gate_aq_plus_minus_9_db_source_absent_budget",
      valueOrBlockedReason: "R'w 58 / DnT,w 59 through Gate AR source-absent all-owner runtime corridor",
      visibleSurfaceParityTarget: WALL_VISIBLE_SURFACES
    })
  ];
}

export function buildPersonalUseMvpCoverageSprintGateWScenarioMatrix(): readonly PersonalUseMvpCoverageScenarioRow[] {
  const refreshedGateA = buildPersonalUseMvpCoverageSprintGateAScenarioMatrix().map((row) => {
    switch (row.id) {
      case "wall.aac_nonhomogeneous_masonry.lab":
        return {
          ...row,
          currentPosture: "bounded_screening" as const,
          failureClass: "coverage_gap" as const,
          nextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_W_SELECTED_NEXT_ACTION,
          originSupportBucket: "source_absent_screening_nonhomogeneous_masonry_gap",
          runtime: aacNonHomogeneousMasonryGateAScreeningSnapshot().runtime,
          toleranceOrErrorBudget: "screening_error_budget_10_db_until_aac_family_solver",
          valueOrBlockedReason: "Rw 44 / STC 44 remains screening fallback for AAC/non-homogeneous masonry"
        };
      case "wall.lined_massive_masonry.lab":
        return {
          ...row,
          failureClass: "none" as const,
          nextAction: "regression_guard",
          originSupportBucket: "source_absent_gate_h_lined_massive_family_physics",
          toleranceOrErrorBudget: "airborne_error_budget_6_db",
          valueOrBlockedReason: "Rw 60 / STC 60 via Gate H lined massive family-physics runtime"
        };
      case "wall.clt_mass_timber.lab":
        return {
          ...row,
          failureClass: "coverage_gap" as const,
          nextAction: "clt_ctr_adaptation_backlog",
          originSupportBucket: "source_absent_gate_h_clt_family_physics_partial_spectrum",
          toleranceOrErrorBudget: "airborne_error_budget_6_db_with_Ctr_unsupported",
          valueOrBlockedReason: "Rw 42 / STC 42 / C -1.2; Ctr remains unsupported until a CLT spectrum-adaptation owner exists"
        };
      case "floor.timber_joist_impact.lab": {
        const refreshed = timberCltSurfaceRuntime({
          layers: GATE_B_TIMBER_JOIST_LAYERS,
          surface: COMPLETE_TIMBER_CLT_TIMBER_SURFACE,
          targetOutputs: FLOOR_LAB_IMPACT_OUTPUTS
        });

        return {
          ...row,
          currentPosture: refreshed.currentPosture,
          expectedPosture: "exact" as const,
          failureClass: "none" as const,
          nextAction: "regression_guard",
          originSupportBucket: "exact_Ln,w_plus_source_absent_timber_DeltaLw_formula",
          runtime: refreshed.runtime,
          toleranceOrErrorBudget: "Ln,w exact; DeltaLw +/-7.5 dB source_absent_formula_error_budget",
          valueOrBlockedReason: "Ln,w 51 exact plus DeltaLw 25.2 timber formula companion"
        };
      }
      case "floor.clt_mass_timber_impact.lab": {
        const refreshed = timberCltSurfaceRuntime({
          layers: GATE_B_CLT_LAYERS,
          surface: COMPLETE_TIMBER_CLT_CLT_SURFACE,
          targetOutputs: FLOOR_LAB_IMPACT_OUTPUTS
        });

        return {
          ...row,
          currentPosture: refreshed.currentPosture,
          failureClass: "none" as const,
          nextAction: "regression_guard",
          originSupportBucket: "published_family_Ln,w_plus_source_absent_CLT_DeltaLw_formula",
          runtime: refreshed.runtime,
          toleranceOrErrorBudget: "Ln,w family estimate; DeltaLw +/-7.5 dB source_absent_formula_error_budget",
          valueOrBlockedReason: "Ln,w 50 family estimate plus DeltaLw 22.6 CLT formula companion"
        };
      }
      case "floor.many_layer_stress_exact_stable":
        return {
          ...row,
          expectedPosture: "source_anchored_delta" as const,
          originSupportBucket: "exact_impact_plus_field_guide_split_invariance",
          valueOrBlockedReason: "53 layers stay finite: Rw 52 / Ln,w 52 / L'n,w 55 / L'nT,w 52.2"
        };
      default:
        return row;
    }
  });

  return [...refreshedGateA, ...buildGateWAdditionalRows()];
}

function scoreLane(input: {
  basisLeakageRisk: number;
  currentFailureRisk: number;
  implementationCost: number;
  solverReadiness: number;
  userFrequency: number;
}): number {
  return round1(
    (input.userFrequency * input.currentFailureRisk * input.solverReadiness) /
      (input.implementationCost + input.basisLeakageRisk)
  );
}

export function rankPersonalUseMvpCoverageSprintGateBLanes(
  matrix: readonly PersonalUseMvpCoverageScenarioRow[] = buildPersonalUseMvpCoverageSprintGateAScenarioMatrix()
): PersonalUseMvpGateBLaneSelection {
  const candidateSeeds = [
    {
      basisLeakageRisk: 5,
      currentFailureRisk: 2,
      evidenceRowIds: [
        "wall.grouped_triple_leaf_50_50_mineral_wool.lab",
        "wall.grouped_triple_leaf_non_50_50_construction_image.lab",
        "wall.flat_list_multicavity_ambiguity.needs_input"
      ],
      id: "generalized_wall_multicavity_triple_leaf",
      implementationCost: 4,
      solverReadiness: 3,
      userFrequency: 3
    },
    {
      basisLeakageRisk: 2,
      currentFailureRisk: 3,
      evidenceRowIds: [
        "wall.aac_nonhomogeneous_masonry.lab",
        "wall.lined_massive_masonry.lab",
        "wall.clt_mass_timber.lab"
      ],
      id: "lined_masonry_clt_wall_upgrade",
      implementationCost: 3,
      solverReadiness: 3,
      userFrequency: 4
    },
    {
      basisLeakageRisk: 2,
      currentFailureRisk: 4,
      evidenceRowIds: [
        "floor.timber_joist_impact.lab",
        "floor.clt_mass_timber_impact.lab",
        "floor.complete_field_impact_context.lprime"
      ],
      id: "timber_clt_floor_impact_delta_lw",
      implementationCost: 3,
      solverReadiness: 4,
      userFrequency: 5
    },
    {
      basisLeakageRisk: 5,
      currentFailureRisk: 2,
      evidenceRowIds: [
        "wall.complete_field_context.rprime_dnt",
        "wall.missing_field_context.needs_input",
        "floor.complete_field_impact_context.lprime",
        "floor.missing_field_impact_context.needs_input"
      ],
      id: "field_building_context_continuation",
      implementationCost: 4,
      solverReadiness: 3,
      userFrequency: 4
    }
  ] as const satisfies readonly Omit<PersonalUseMvpGateBLaneCandidate, "score" | "selected">[];

  const rowIds = new Set(matrix.map((row) => row.id));
  const candidatesWithoutSelection = candidateSeeds.map((candidate) => {
    const missingRows = candidate.evidenceRowIds.filter((id) => !rowIds.has(id));
    if (missingRows.length > 0) {
      throw new Error(`Gate B lane ${candidate.id} references missing matrix rows: ${missingRows.join(", ")}`);
    }

    return {
      ...candidate,
      score: scoreLane(candidate),
      selected: false
    };
  });
  const [selected] = [...candidatesWithoutSelection].sort((left, right) => {
    const scoreDelta = right.score - left.score;
    return scoreDelta === 0 ? left.id.localeCompare(right.id) : scoreDelta;
  });

  if (!selected) {
    throw new Error("Personal-use MVP Coverage Sprint Gate A requires a Gate B lane candidate.");
  }

  const candidates = candidatesWithoutSelection.map((candidate) => ({
    ...candidate,
    selected: candidate.id === selected.id
  }));
  const selectedCandidate = candidates.find((candidate) => candidate.selected);

  if (!selectedCandidate) {
    throw new Error("Personal-use MVP Coverage Sprint Gate A did not mark a selected Gate B lane.");
  }

  return {
    candidates,
    selectedCandidate,
    selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_A_SELECTED_NEXT_ACTION,
    selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_A_SELECTED_NEXT_FILE,
    selectionPolicy: [
      "use the executable matrix rows, not source availability alone",
      "score user_frequency * current_failure_risk * solver_readiness / (implementation_cost + basis_leakage_risk)",
      "prefer a lane that improves source-absent calculator coverage while preserving basis separation",
      "do not select a lane without numeric or posture assertions"
    ]
  };
}

export function rankPersonalUseMvpCoverageSprintGateXLanes(
  matrix: readonly PersonalUseMvpCoverageScenarioRow[] = buildPersonalUseMvpCoverageSprintGateWScenarioMatrix()
): PersonalUseMvpGateXLaneSelection {
  const candidateSeeds = [
    {
      basisLeakageRisk: 1,
      currentFailureRisk: 3,
      evidenceRowIds: ["wall.aac_nonhomogeneous_masonry.lab"],
      id: "aac_nonhomogeneous_masonry_wall_family_solver",
      implementationCost: 2,
      solverReadiness: 4,
      sourceRowsRequiredForRuntimeSelection: false,
      userFrequency: 4
    },
    {
      basisLeakageRisk: 7,
      currentFailureRisk: 4,
      evidenceRowIds: [
        "wall.complete_building_prediction.unsupported",
        "wall.opening_leak_composite_building_boundary.unsupported"
      ],
      id: "airborne_building_prediction_runtime_terms",
      implementationCost: 6,
      solverReadiness: 1,
      sourceRowsRequiredForRuntimeSelection: false,
      userFrequency: 4
    },
    {
      basisLeakageRisk: 5,
      currentFailureRisk: 3,
      evidenceRowIds: ["floor.astm_iic_aiic_boundary.unsupported"],
      id: "astm_iic_aiic_rating_adapter",
      implementationCost: 4,
      solverReadiness: 2,
      sourceRowsRequiredForRuntimeSelection: false,
      userFrequency: 3
    },
    {
      basisLeakageRisk: 2,
      currentFailureRisk: 2,
      evidenceRowIds: ["wall.clt_mass_timber.lab"],
      id: "clt_mass_timber_ctr_spectrum_adapter",
      implementationCost: 3,
      solverReadiness: 2,
      sourceRowsRequiredForRuntimeSelection: false,
      userFrequency: 2
    },
    {
      basisLeakageRisk: 7,
      currentFailureRisk: 3,
      evidenceRowIds: ["wall.flat_list_multicavity_ambiguity.needs_input"],
      id: "flat_multicavity_autogrouping_guarded_topology",
      implementationCost: 4,
      solverReadiness: 2,
      sourceRowsRequiredForRuntimeSelection: false,
      userFrequency: 3
    },
    {
      basisLeakageRisk: 2,
      currentFailureRisk: 2,
      evidenceRowIds: ["wall.aac_nonhomogeneous_masonry.lab"],
      id: "targeted_aac_source_holdout_packet",
      implementationCost: 5,
      solverReadiness: 2,
      sourceRowsRequiredForRuntimeSelection: true,
      userFrequency: 4
    }
  ] as const satisfies readonly Omit<PersonalUseMvpGateXLaneCandidate, "score" | "selected">[];

  const rowIds = new Set(matrix.map((row) => row.id));
  const candidatesWithoutSelection = candidateSeeds.map((candidate) => {
    const missingRows = candidate.evidenceRowIds.filter((id) => !rowIds.has(id));
    if (missingRows.length > 0) {
      throw new Error(`Gate X lane ${candidate.id} references missing matrix rows: ${missingRows.join(", ")}`);
    }

    return {
      ...candidate,
      score: scoreLane(candidate),
      selected: false
    };
  });
  const [selected] = [...candidatesWithoutSelection].sort((left, right) => {
    const scoreDelta = right.score - left.score;
    return scoreDelta === 0 ? left.id.localeCompare(right.id) : scoreDelta;
  });

  if (!selected) {
    throw new Error("Personal-use MVP Coverage Sprint Gate W requires a Gate X lane candidate.");
  }

  const candidates = candidatesWithoutSelection.map((candidate) => ({
    ...candidate,
    selected: candidate.id === selected.id
  }));
  const selectedCandidate = candidates.find((candidate) => candidate.selected);

  if (!selectedCandidate) {
    throw new Error("Personal-use MVP Coverage Sprint Gate W did not mark a selected Gate X lane.");
  }

  return {
    candidates,
    selectedCandidate,
    selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_W_SELECTED_NEXT_ACTION,
    selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_W_SELECTED_NEXT_FILE,
    selectionPolicy: [
      "refresh runtime/posture rows after landed Gates B-U before selecting a new lane",
      "score user_frequency * current_failure_risk * solver_readiness / (implementation_cost + basis_leakage_risk)",
      "prefer source-absent algorithmic coverage when one bounded family solver is ready",
      "keep broad source crawling unselected unless a row names a source packet as the highest-impact unblocker",
      "do not select building, field, ASTM, or lab adapters when the refreshed row shows basis-leakage risk is still dominant"
    ]
  };
}

export function summarizePersonalUseMvpCoverageSprintGateA(
  matrix: readonly PersonalUseMvpCoverageScenarioRow[] = buildPersonalUseMvpCoverageSprintGateAScenarioMatrix()
): PersonalUseMvpCoverageSprintGateASummary {
  const laneSelection = rankPersonalUseMvpCoverageSprintGateBLanes(matrix);

  return {
    basisCoverage: unique(matrix.map((row) => row.basis)),
    currentPostureCoverage: orderedSubset(matrix.map((row) => row.currentPosture), POSTURE_COVERAGE_ORDER),
    failureClassCoverage: unique(matrix.map((row) => row.failureClass)),
    noRuntimeValueMovement: true,
    routeCoverage: unique(matrix.map((row) => row.route)),
    rowCount: matrix.length,
    selectedGateBLane: laneSelection.selectedCandidate.id,
    selectedNextAction: laneSelection.selectedNextAction,
    selectedNextFile: laneSelection.selectedNextFile
  };
}

export function summarizePersonalUseMvpCoverageSprintGateW(
  matrix: readonly PersonalUseMvpCoverageScenarioRow[] = buildPersonalUseMvpCoverageSprintGateWScenarioMatrix()
): PersonalUseMvpCoverageSprintGateWSummary {
  const laneSelection = rankPersonalUseMvpCoverageSprintGateXLanes(matrix);

  return {
    basisCoverage: unique(matrix.map((row) => row.basis)),
    currentPostureCoverage: orderedSubset(matrix.map((row) => row.currentPosture), POSTURE_COVERAGE_ORDER),
    failureClassCoverage: unique(matrix.map((row) => row.failureClass)),
    noNewRuntimeValueMovement: true,
    refreshedAfterGate:
      "gate_v_personal_use_mvp_post_opening_leak_input_surface_revalidation_landed_no_runtime_selected_matrix_refresh_gate_w",
    remainingCoverageGapRowIds: matrix
      .filter((row) => row.failureClass === "coverage_gap")
      .map((row) => row.id),
    routeCoverage: unique(matrix.map((row) => row.route)),
    rowCount: matrix.length,
    selectedGateXLane: laneSelection.selectedCandidate.id,
    selectedNextAction: laneSelection.selectedNextAction,
    selectedNextFile: laneSelection.selectedNextFile
  };
}
