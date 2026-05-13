import type {
  AirborneContext,
  LayerInput,
  RequestedOutputId
} from "@dynecho/shared";

import { calculateAssembly } from "./calculate-assembly";
import {
  type PersonalUseMvpCoverageFailureClass,
  type PersonalUseMvpCoverageMetricValuePin,
  type PersonalUseMvpCoverageOutputBasis,
  type PersonalUseMvpCoveragePosture,
  type PersonalUseMvpCoverageRoute,
  type PersonalUseMvpCoverageScenarioRow,
  type PersonalUseMvpCoverageVisibleSurface
} from "./calculator-personal-use-mvp-coverage-sprint";
import {
  buildPersonalUseMvpCoverageSprintGateAKScenarioMatrix,
  summarizePersonalUseMvpCoverageSprintGateAK
} from "./calculator-personal-use-mvp-coverage-sprint-gate-ak";
import {
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AS_LANDED_GATE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AS_SELECTION_STATUS
} from "./calculator-personal-use-mvp-coverage-sprint-gate-as";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AT_LANDED_GATE =
  "gate_at_personal_use_mvp_acceptance_matrix_refresh_after_building_prediction_plan";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AT_SELECTION_STATUS =
  "gate_at_personal_use_mvp_acceptance_matrix_refresh_after_building_prediction_landed_selected_daily_use_release_handoff_gate_au";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AT_SELECTED_NEXT_ACTION =
  "gate_au_personal_use_mvp_daily_use_release_handoff_plan";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AT_SELECTED_NEXT_FILE =
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-au-daily-use-release-handoff-contract.test.ts";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AT_PREVIOUS_SELECTION_STATUS =
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AS_SELECTION_STATUS;

export type PersonalUseMvpCoverageSprintGateAULaneId =
  | "astm_iic_aiic_adapter_after_release"
  | "budget_tightening_and_calibration_phase"
  | "daily_use_release_handoff"
  | "opening_leak_building_adapter_after_release";

export type PersonalUseMvpCoverageSprintGateAULaneCandidate = {
  acceptanceCoverage: number;
  id: PersonalUseMvpCoverageSprintGateAULaneId;
  implementationCost: number;
  reason: string;
  releaseBlockerCount: number;
  residualRisk: number;
  score: number;
  selected: boolean;
  sourceRowsRequiredForRuntimeSelection: boolean;
};

export type PersonalUseMvpCoverageSprintGateAULaneSelection = {
  candidates: readonly PersonalUseMvpCoverageSprintGateAULaneCandidate[];
  selectedCandidate: PersonalUseMvpCoverageSprintGateAULaneCandidate;
  selectedNextAction: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AT_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AT_SELECTED_NEXT_FILE;
  selectionPolicy: readonly string[];
};

export type PersonalUseMvpCoverageSprintGateATSummary = {
  aliasNegativeRowIds: readonly string[];
  basisCoverage: readonly PersonalUseMvpCoverageOutputBasis[];
  correctlyBlockedRowIds: readonly string[];
  currentPostureCoverage: readonly PersonalUseMvpCoveragePosture[];
  dailyUseAcceptanceMatrixReadyForReleaseHandoff: true;
  dailyUseReleaseBlockerIds: readonly [];
  exactSourcePrecedenceRowIds: readonly string[];
  failureClassCounts: Readonly<Record<PersonalUseMvpCoverageFailureClass, number>>;
  gapFreeAfterGateAT: true;
  hostileLayerEditRowIds: readonly string[];
  matrixRowsAddedAtGateAT: 1;
  matrixRowsRenamedAtGateAT: readonly { from: string; to: string }[];
  openingLeakBoundaryRowIds: readonly string[];
  partialBuildingPredictionRowIds: readonly string[];
  previousLandedGate: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AS_LANDED_GATE;
  previousSelectionStatus: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AT_PREVIOUS_SELECTION_STATUS;
  remainingCoverageGapRowIds: readonly [];
  retiredStaleRowIds: readonly string[];
  routeCoverage: readonly PersonalUseMvpCoverageRoute[];
  rowCount: 41;
  runtimeBuildingPredictionRowIds: readonly string[];
  selectedGateAULane: PersonalUseMvpCoverageSprintGateAULaneId;
  selectedNextAction: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AT_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AT_SELECTED_NEXT_FILE;
  sourceRowsRequiredForRuntimeSelection: false;
};

const WALL_BUILDING_OUTPUTS = ["R'w", "DnT,w"] as const satisfies readonly RequestedOutputId[];
const WALL_BROAD_BUILDING_OUTPUTS = ["Rw", "STC", "R'w", "DnT,w"] as const satisfies readonly RequestedOutputId[];

const WALL_VISIBLE_SURFACES = [
  "workbench_card",
  "saved_replay",
  "calculator_api",
  "markdown_report",
  "pdf_report",
  "docx_report"
] as const satisfies readonly PersonalUseMvpCoverageVisibleSurface[];

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

const LINED_MASSIVE_WALL: readonly LayerInput[] = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "air_gap", thicknessMm: 40 },
  { materialId: "rockwool", thicknessMm: 40 },
  { materialId: "concrete", thicknessMm: 160 }
] as const;

const COMPLETE_BUILDING_RENAME = {
  from: "wall.complete_building_prediction.unsupported",
  to: "wall.complete_building_prediction.runtime"
} as const;

const GATE_AT_ADDED_ROW_IDS = [
  "wall.complete_building_prediction_broad_targets.alias_boundary"
] as const;

const RUNTIME_BUILDING_PREDICTION_ROW_IDS = [
  COMPLETE_BUILDING_RENAME.to,
  "wall.complete_building_prediction_broad_targets.alias_boundary"
] as const;

const PARTIAL_BUILDING_PREDICTION_ROW_IDS = [
  "wall.building_prediction_partial_context.needs_input"
] as const;

const HOSTILE_LAYER_EDIT_ROW_IDS = [
  "wall.grouped_triple_leaf_safe_reverse_order.lab",
  "wall.flat_multicavity_many_layer_schedule.needs_input",
  "floor.heavy_concrete_floating_floor_safe_reorder.lab",
  "floor.many_layer_stress_exact_stable"
] as const;

const ALIAS_NEGATIVE_ROW_IDS = [
  "wall.complete_building_prediction_broad_targets.alias_boundary",
  "wall.opening_leak_composite_building_boundary.unsupported",
  "floor.astm_iic_aiic_boundary.unsupported"
] as const;

const EXACT_SOURCE_PRECEDENCE_ROW_IDS = [
  "floor.lightweight_steel_exact_source_precedence.lab"
] as const;

const OPENING_LEAK_BOUNDARY_ROW_IDS = [
  "wall.opening_leak_composite.lab",
  "wall.opening_leak_two_openings.lab",
  "wall.opening_leak_stc_target.lab",
  "wall.opening_leak_duplicate_id.refused",
  "wall.opening_leak_composite_building_boundary.unsupported"
] as const;

const BASIS_ORDER = [
  "element_lab",
  "field_apparent",
  "astm_rating_boundary",
  "building_prediction"
] as const satisfies readonly PersonalUseMvpCoverageOutputBasis[];

const POSTURE_ORDER = [
  "family_physics",
  "bounded_screening",
  "needs_input",
  "unsupported",
  "exact",
  "source_anchored_delta",
  "calibrated_physics"
] as const satisfies readonly PersonalUseMvpCoveragePosture[];

const ROUTE_ORDER = ["wall", "floor"] as const satisfies readonly PersonalUseMvpCoverageRoute[];

function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

function orderedSubset<T extends string>(values: readonly T[], order: readonly T[]): readonly T[] {
  const valueSet = new Set(values);
  return order.filter((value) => valueSet.has(value));
}

function targetValuePins(input: {
  metrics: ReturnType<typeof calculateAssembly>["metrics"];
  supportedTargetOutputs: readonly RequestedOutputId[];
  targetOutputs: readonly RequestedOutputId[];
}): PersonalUseMvpCoverageMetricValuePin[] {
  const pins: PersonalUseMvpCoverageMetricValuePin[] = [];
  const supported = new Set(input.supportedTargetOutputs);
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

  maybePush("Rw", input.metrics.estimatedRwDb);
  maybePush("STC", input.metrics.estimatedStc);
  maybePush("R'w", input.metrics.estimatedRwPrimeDb);
  maybePush("DnT,w", input.metrics.estimatedDnTwDb);

  return pins;
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

function assemblyRuntime(input: {
  airborneContext: AirborneContext;
  layers: readonly LayerInput[];
  targetOutputs: readonly RequestedOutputId[];
}): Pick<PersonalUseMvpCoverageScenarioRow, "currentPosture" | "runtime"> {
  const result = calculateAssembly(input.layers, {
    airborneContext: input.airborneContext,
    calculator: "dynamic",
    targetOutputs: input.targetOutputs
  });
  const currentPosture = classifyAirbornePosture(result);
  const shouldPinValues = currentPosture !== "needs_input" && currentPosture !== "unsupported";

  return {
    currentPosture,
    runtime: {
      basisId: result.airborneBasis?.method ?? null,
      errorBudgetDb: result.airborneBasis?.errorBudgetDb ?? null,
      missingPhysicalInputs: result.airborneBasis?.missingPhysicalInputs ?? [],
      origin: result.airborneBasis?.origin ?? null,
      publicEntryPoint: "calculateAssembly",
      selectedMethod: result.dynamicAirborneTrace?.selectedMethod ?? null,
      supportedTargetOutputs: result.supportedTargetOutputs,
      unsupportedTargetOutputs: result.unsupportedTargetOutputs,
      valuePins: shouldPinValues
        ? targetValuePins({
          metrics: result.metrics,
          supportedTargetOutputs: result.supportedTargetOutputs,
          targetOutputs: input.targetOutputs
        })
        : []
    }
  };
}

function failureClassCounts(
  matrix: readonly PersonalUseMvpCoverageScenarioRow[]
): Readonly<Record<PersonalUseMvpCoverageFailureClass, number>> {
  const counts: Record<PersonalUseMvpCoverageFailureClass, number> = {
    basis_boundary: 0,
    correct_block: 0,
    coverage_gap: 0,
    hostile_input_refusal: 0,
    none: 0,
    unsupported_metric: 0
  };

  for (const row of matrix) {
    counts[row.failureClass] += 1;
  }

  return counts;
}

function buildBroadBuildingAliasBoundaryRow(): PersonalUseMvpCoverageScenarioRow {
  const runtime = assemblyRuntime({
    airborneContext: COMPLETE_BUILDING_PREDICTION_CONTEXT,
    layers: LINED_MASSIVE_WALL,
    targetOutputs: WALL_BROAD_BUILDING_OUTPUTS
  });

  return {
    basis: "building_prediction",
    currentPosture: runtime.currentPosture,
    expectedPosture: "family_physics",
    failureClass: "basis_boundary",
    family: "wall_complete_airborne_building_prediction_broad_targets",
    hostileVariant: "lab_rw_stc_requested_beside_building_metrics",
    id: "wall.complete_building_prediction_broad_targets.alias_boundary",
    inputCompleteness: "complete",
    nextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AT_SELECTED_NEXT_ACTION,
    originSupportBucket: "source_absent_building_prediction_runtime_with_lab_alias_boundary",
    requestedMetrics: WALL_BROAD_BUILDING_OUTPUTS,
    route: "wall",
    runtime: runtime.runtime,
    toleranceOrErrorBudget: "gate_aq_plus_minus_9_db_source_absent_budget_not_measured",
    valueOrBlockedReason:
      "R'w 58 / DnT,w 59 are supported; lab Rw/STC remain unsupported on the building route.",
    visibleSurfaceParityTarget: WALL_VISIBLE_SURFACES
  };
}

function normalizeGateATRow(row: PersonalUseMvpCoverageScenarioRow): PersonalUseMvpCoverageScenarioRow {
  if (row.id !== COMPLETE_BUILDING_RENAME.from) {
    return row;
  }

  return {
    ...row,
    id: COMPLETE_BUILDING_RENAME.to,
    nextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AT_SELECTED_NEXT_ACTION,
    originSupportBucket: "source_absent_building_prediction_runtime_acceptance_ready",
    requestedMetrics: WALL_BUILDING_OUTPUTS,
    toleranceOrErrorBudget: "gate_aq_plus_minus_9_db_source_absent_budget_not_measured",
    valueOrBlockedReason:
      "R'w 58 / DnT,w 59 through Gate AR source-absent all-owner building-prediction runtime corridor."
  };
}

function requireRows(
  matrix: readonly PersonalUseMvpCoverageScenarioRow[],
  rowIds: readonly string[],
  label: string
): void {
  const known = new Set(matrix.map((row) => row.id));
  const missing = rowIds.filter((rowId) => !known.has(rowId));

  if (missing.length > 0) {
    throw new Error(`Gate AT missing ${label} row(s): ${missing.join(", ")}`);
  }
}

export function buildPersonalUseMvpCoverageSprintGateATScenarioMatrix(): readonly PersonalUseMvpCoverageScenarioRow[] {
  const baseRows = buildPersonalUseMvpCoverageSprintGateAKScenarioMatrix().map(normalizeGateATRow);
  const rows = [...baseRows, buildBroadBuildingAliasBoundaryRow()];
  const ids = rows.map((row) => row.id);

  if (ids.includes(COMPLETE_BUILDING_RENAME.from)) {
    throw new Error(`Gate AT matrix must retire stale row id ${COMPLETE_BUILDING_RENAME.from}.`);
  }

  return rows;
}

export function rankPersonalUseMvpCoverageSprintGateAULanes(): PersonalUseMvpCoverageSprintGateAULaneSelection {
  const candidateSeeds = [
    {
      acceptanceCoverage: 10,
      id: "daily_use_release_handoff",
      implementationCost: 2,
      reason:
        "Gate AT is gap-free after building-prediction runtime and surface parity; the highest-ROI next step is a concise daily-use operating envelope and release handoff.",
      releaseBlockerCount: 0,
      residualRisk: 3,
      sourceRowsRequiredForRuntimeSelection: false
    },
    {
      acceptanceCoverage: 4,
      id: "budget_tightening_and_calibration_phase",
      implementationCost: 8,
      reason:
        "Calibration remains important, but source-owned same-building holdouts are a post-release accuracy program rather than a daily-use blocker.",
      releaseBlockerCount: 0,
      residualRisk: 6,
      sourceRowsRequiredForRuntimeSelection: true
    },
    {
      acceptanceCoverage: 3,
      id: "opening_leak_building_adapter_after_release",
      implementationCost: 6,
      reason:
        "Opening/leak building adapters remain blocked by basis ownership and should not delay the supported building-prediction wall route.",
      releaseBlockerCount: 0,
      residualRisk: 4,
      sourceRowsRequiredForRuntimeSelection: false
    },
    {
      acceptanceCoverage: 2,
      id: "astm_iic_aiic_adapter_after_release",
      implementationCost: 5,
      reason:
        "ASTM IIC/AIIC adapters are explicit unsupported boundaries in the matrix and are outside the ISO daily-use release lane.",
      releaseBlockerCount: 0,
      residualRisk: 4,
      sourceRowsRequiredForRuntimeSelection: false
    }
  ] as const satisfies readonly Omit<PersonalUseMvpCoverageSprintGateAULaneCandidate, "score" | "selected">[];

  const candidatesWithoutSelection = candidateSeeds.map((candidate) => ({
    ...candidate,
    score: round1(candidate.acceptanceCoverage / (candidate.implementationCost + candidate.residualRisk + 1)),
    selected: false
  }));
  const [selected] = [...candidatesWithoutSelection].sort((left, right) => {
    const scoreDelta = right.score - left.score;
    return scoreDelta === 0 ? left.id.localeCompare(right.id) : scoreDelta;
  });

  if (!selected) {
    throw new Error("Personal-use MVP Coverage Sprint Gate AT requires a Gate AU lane candidate.");
  }

  const candidates = candidatesWithoutSelection.map((candidate) => ({
    ...candidate,
    selected: candidate.id === selected.id
  }));
  const selectedCandidate = candidates.find((candidate) => candidate.selected);

  if (!selectedCandidate) {
    throw new Error("Personal-use MVP Coverage Sprint Gate AT did not mark a selected Gate AU lane.");
  }

  return {
    candidates,
    selectedCandidate,
    selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AT_SELECTED_NEXT_ACTION,
    selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AT_SELECTED_NEXT_FILE,
    selectionPolicy: [
      "treat Gate AT as the acceptance matrix refresh after building-prediction runtime and surface parity",
      "select release handoff only when the matrix has no coverage gaps or release blockers",
      "keep post-release calibration, ASTM adapters, and opening/leak building adapters explicit residual risks",
      "do not require broad source crawling for the source-absent calculator daily-use lane"
    ]
  };
}

export function summarizePersonalUseMvpCoverageSprintGateAT(
  matrix: readonly PersonalUseMvpCoverageScenarioRow[] = buildPersonalUseMvpCoverageSprintGateATScenarioMatrix()
): PersonalUseMvpCoverageSprintGateATSummary {
  summarizePersonalUseMvpCoverageSprintGateAK(buildPersonalUseMvpCoverageSprintGateAKScenarioMatrix());
  requireRows(matrix, RUNTIME_BUILDING_PREDICTION_ROW_IDS, "runtime building-prediction");
  requireRows(matrix, PARTIAL_BUILDING_PREDICTION_ROW_IDS, "partial building-prediction");
  requireRows(matrix, HOSTILE_LAYER_EDIT_ROW_IDS, "hostile layer-edit");
  requireRows(matrix, ALIAS_NEGATIVE_ROW_IDS, "basis alias negative");
  requireRows(matrix, EXACT_SOURCE_PRECEDENCE_ROW_IDS, "exact-source precedence");
  requireRows(matrix, OPENING_LEAK_BOUNDARY_ROW_IDS, "opening/leak boundary");

  const remainingCoverageGapRowIds = matrix
    .filter((row) => row.failureClass === "coverage_gap")
    .map((row) => row.id);

  if (remainingCoverageGapRowIds.length > 0) {
    throw new Error(`Gate AT expected a gap-free daily-use matrix, found: ${remainingCoverageGapRowIds.join(", ")}`);
  }

  const releaseBlockerIds = matrix
    .filter((row) => row.failureClass === "coverage_gap")
    .map((row) => row.id);

  if (releaseBlockerIds.length > 0) {
    throw new Error(`Gate AT found daily-use release blockers: ${releaseBlockerIds.join(", ")}`);
  }

  const laneSelection = rankPersonalUseMvpCoverageSprintGateAULanes();

  return {
    aliasNegativeRowIds: ALIAS_NEGATIVE_ROW_IDS,
    basisCoverage: orderedSubset(matrix.map((row) => row.basis), BASIS_ORDER),
    correctlyBlockedRowIds: matrix
      .filter((row) => row.failureClass !== "none")
      .map((row) => row.id),
    currentPostureCoverage: orderedSubset(matrix.map((row) => row.currentPosture), POSTURE_ORDER),
    dailyUseAcceptanceMatrixReadyForReleaseHandoff: true,
    dailyUseReleaseBlockerIds: [],
    exactSourcePrecedenceRowIds: EXACT_SOURCE_PRECEDENCE_ROW_IDS,
    failureClassCounts: failureClassCounts(matrix),
    gapFreeAfterGateAT: true,
    hostileLayerEditRowIds: HOSTILE_LAYER_EDIT_ROW_IDS,
    matrixRowsAddedAtGateAT: GATE_AT_ADDED_ROW_IDS.length,
    matrixRowsRenamedAtGateAT: [COMPLETE_BUILDING_RENAME],
    openingLeakBoundaryRowIds: OPENING_LEAK_BOUNDARY_ROW_IDS,
    partialBuildingPredictionRowIds: PARTIAL_BUILDING_PREDICTION_ROW_IDS,
    previousLandedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AS_LANDED_GATE,
    previousSelectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AT_PREVIOUS_SELECTION_STATUS,
    remainingCoverageGapRowIds: [],
    retiredStaleRowIds: [COMPLETE_BUILDING_RENAME.from],
    routeCoverage: orderedSubset(matrix.map((row) => row.route), ROUTE_ORDER),
    rowCount: 41,
    runtimeBuildingPredictionRowIds: RUNTIME_BUILDING_PREDICTION_ROW_IDS,
    selectedGateAULane: laneSelection.selectedCandidate.id,
    selectedNextAction: laneSelection.selectedNextAction,
    selectedNextFile: laneSelection.selectedNextFile,
    sourceRowsRequiredForRuntimeSelection: false
  };
}

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AT_BUILDING_RUNTIME_METHOD =
  "gate_ar_airborne_building_prediction_all_owner_runtime_corridor";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AT_BUILDING_ERROR_BUDGET_DB =
  9;
