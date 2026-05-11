import type { RequestedOutputId } from "@dynecho/shared";

import { calculateAssembly } from "./calculate-assembly";
import {
  buildPersonalUseMvpCoverageSprintGateWScenarioMatrix,
  type PersonalUseMvpCoverageFailureClass,
  type PersonalUseMvpCoverageMetricValuePin,
  type PersonalUseMvpCoveragePosture,
  type PersonalUseMvpCoverageScenarioRow
} from "./calculator-personal-use-mvp-coverage-sprint";
import {
  GATE_X_AAC_NONHOMOGENEOUS_MASONRY_RUNTIME_METHOD,
  GATE_X_AAC_NONHOMOGENEOUS_MASONRY_SELECTED_CANDIDATE_ID
} from "./dynamic-airborne-gate-x-aac-nonhomogeneous-masonry";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_X_LANDED_GATE =
  "gate_x_personal_use_mvp_aac_nonhomogeneous_masonry_wall_family_solver_plan";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_X_SELECTION_STATUS =
  "gate_x_personal_use_mvp_aac_nonhomogeneous_masonry_wall_family_solver_landed_selected_clt_ctr_gate_y";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_X_SELECTED_NEXT_FILE =
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-y-clt-mass-timber-ctr-spectrum-adapter-contract.test.ts";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_X_SELECTED_NEXT_ACTION =
  "gate_y_personal_use_mvp_clt_mass_timber_ctr_spectrum_adapter_plan";

type GateYLaneId =
  | "airborne_building_prediction_runtime_terms"
  | "astm_iic_aiic_rating_adapter"
  | "clt_mass_timber_ctr_spectrum_adapter"
  | "flat_multicavity_autogrouping_guarded_topology"
  | "targeted_aac_source_holdout_packet";

type GateYLaneCandidate = {
  basisLeakageRisk: number;
  currentFailureRisk: number;
  evidenceRowIds: readonly string[];
  id: GateYLaneId;
  implementationCost: number;
  score: number;
  selected: boolean;
  solverReadiness: number;
  sourceRowsRequiredForRuntimeSelection: boolean;
  userFrequency: number;
};

export type PersonalUseMvpGateYLaneSelection = {
  candidates: readonly GateYLaneCandidate[];
  selectedCandidate: GateYLaneCandidate;
  selectedNextAction: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_X_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_X_SELECTED_NEXT_FILE;
  selectionPolicy: readonly string[];
};

export type PersonalUseMvpCoverageSprintGateXSummary = {
  aacRuntimeBasisId: typeof GATE_X_AAC_NONHOMOGENEOUS_MASONRY_RUNTIME_METHOD;
  aacSelectedCandidateId: typeof GATE_X_AAC_NONHOMOGENEOUS_MASONRY_SELECTED_CANDIDATE_ID;
  closedCoverageGapRowIds: readonly ["wall.aac_nonhomogeneous_masonry.lab"];
  currentPostureCoverage: readonly PersonalUseMvpCoveragePosture[];
  failureClassCoverage: readonly PersonalUseMvpCoverageFailureClass[];
  numericRuntimeValueMovement: false;
  remainingCoverageGapRowIds: readonly string[];
  rowCount: number;
  selectedGateYLane: GateYLaneId;
  selectedNextAction: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_X_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_X_SELECTED_NEXT_FILE;
};

const WALL_LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];
const AAC_WALL = [{ materialId: "ytong_aac_d700", thicknessMm: 150 }] as const;
const WALL_LAB_CONTEXT = { airtightness: "good", contextMode: "element_lab" } as const;

const POSTURE_COVERAGE_ORDER = [
  "family_physics",
  "bounded_screening",
  "needs_input",
  "unsupported",
  "exact",
  "source_anchored_delta",
  "calibrated_physics"
] as const satisfies readonly PersonalUseMvpCoveragePosture[];

function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

function orderedSubset<T extends string>(values: readonly T[], order: readonly T[]): readonly T[] {
  const valueSet = new Set(values);
  return order.filter((value) => valueSet.has(value));
}

function unique<T>(values: readonly T[]): readonly T[] {
  return [...new Set(values)];
}

function scoreLane(candidate: Omit<GateYLaneCandidate, "score" | "selected">): number {
  return (
    candidate.userFrequency *
    candidate.currentFailureRisk *
    candidate.solverReadiness
  ) / (candidate.implementationCost + candidate.basisLeakageRisk);
}

function targetValuePins(input: ReturnType<typeof calculateAssembly>): PersonalUseMvpCoverageMetricValuePin[] {
  const pins: PersonalUseMvpCoverageMetricValuePin[] = [];
  const supported = new Set(input.supportedTargetOutputs);
  const maybePush = (metric: RequestedOutputId, value: number | undefined): void => {
    if (input.targetOutputs.includes(metric) && supported.has(metric) && typeof value === "number") {
      pins.push({ metric, value: round1(value) });
    }
  };

  maybePush("Rw", input.metrics.estimatedRwDb);
  maybePush("STC", input.metrics.estimatedStc);
  maybePush("C", input.metrics.estimatedCDb);
  maybePush("Ctr", input.metrics.estimatedCtrDb);

  return pins;
}

function buildGateXAacRuntime(): Pick<PersonalUseMvpCoverageScenarioRow, "currentPosture" | "runtime"> {
  const result = calculateAssembly(AAC_WALL, {
    airborneContext: WALL_LAB_CONTEXT,
    calculator: "dynamic",
    targetOutputs: WALL_LAB_OUTPUTS
  });

  return {
    currentPosture: "family_physics",
    runtime: {
      basisId: result.airborneBasis?.method ?? null,
      errorBudgetDb: result.airborneBasis?.errorBudgetDb ?? null,
      missingPhysicalInputs: result.airborneBasis?.missingPhysicalInputs ?? [],
      origin: result.airborneBasis?.origin ?? null,
      publicEntryPoint: "calculateAssembly",
      selectedMethod: result.dynamicAirborneTrace?.selectedMethod ?? null,
      supportedTargetOutputs: result.supportedTargetOutputs,
      unsupportedTargetOutputs: result.unsupportedTargetOutputs,
      valuePins: targetValuePins(result)
    }
  };
}

export function buildPersonalUseMvpCoverageSprintGateXScenarioMatrix(): readonly PersonalUseMvpCoverageScenarioRow[] {
  return buildPersonalUseMvpCoverageSprintGateWScenarioMatrix().map((row) => {
    if (row.id !== "wall.aac_nonhomogeneous_masonry.lab") {
      return row;
    }

    const runtime = buildGateXAacRuntime();

    return {
      ...row,
      currentPosture: runtime.currentPosture,
      expectedPosture: "family_physics",
      failureClass: "none",
      nextAction: "regression_guard",
      originSupportBucket: "source_absent_gate_x_aac_nonhomogeneous_masonry_family_physics",
      runtime: runtime.runtime,
      toleranceOrErrorBudget: "airborne_error_budget_6_db",
      valueOrBlockedReason: "Rw 44 / STC 44 / C -0.7 / Ctr -5.2 via Gate X AAC/non-homogeneous masonry family physics"
    };
  });
}

export function rankPersonalUseMvpCoverageSprintGateYLanes(
  matrix: readonly PersonalUseMvpCoverageScenarioRow[] = buildPersonalUseMvpCoverageSprintGateXScenarioMatrix()
): PersonalUseMvpGateYLaneSelection {
  const candidateSeeds = [
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
      solverReadiness: 3,
      sourceRowsRequiredForRuntimeSelection: false,
      userFrequency: 3
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
      currentFailureRisk: 1,
      evidenceRowIds: ["wall.aac_nonhomogeneous_masonry.lab"],
      id: "targeted_aac_source_holdout_packet",
      implementationCost: 5,
      solverReadiness: 2,
      sourceRowsRequiredForRuntimeSelection: true,
      userFrequency: 4
    }
  ] as const satisfies readonly Omit<GateYLaneCandidate, "score" | "selected">[];

  const rowIds = new Set(matrix.map((row) => row.id));
  const candidatesWithoutSelection = candidateSeeds.map((candidate) => {
    const missingRows = candidate.evidenceRowIds.filter((id) => !rowIds.has(id));
    if (missingRows.length > 0) {
      throw new Error(`Gate Y lane ${candidate.id} references missing matrix rows: ${missingRows.join(", ")}`);
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
    throw new Error("Personal-use MVP Coverage Sprint Gate X requires a Gate Y lane candidate.");
  }

  const candidates = candidatesWithoutSelection.map((candidate) => ({
    ...candidate,
    selected: candidate.id === selected.id
  }));
  const selectedCandidate = candidates.find((candidate) => candidate.selected);

  if (!selectedCandidate) {
    throw new Error("Personal-use MVP Coverage Sprint Gate X did not mark a selected Gate Y lane.");
  }

  return {
    candidates,
    selectedCandidate,
    selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_X_SELECTED_NEXT_ACTION,
    selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_X_SELECTED_NEXT_FILE,
    selectionPolicy: [
      "close the landed AAC algorithmic gap before opening any source-holdout acquisition lane",
      "score user_frequency * current_failure_risk * solver_readiness / (implementation_cost + basis_leakage_risk)",
      "prefer the remaining source-absent lab family gap over field/building/ASTM adapters while basis leakage remains higher",
      "keep targeted source packets as calibration evidence, not the next runtime unlock, unless the matrix shows no algorithmic gap"
    ]
  };
}

export function summarizePersonalUseMvpCoverageSprintGateX(
  matrix: readonly PersonalUseMvpCoverageScenarioRow[] = buildPersonalUseMvpCoverageSprintGateXScenarioMatrix()
): PersonalUseMvpCoverageSprintGateXSummary {
  const laneSelection = rankPersonalUseMvpCoverageSprintGateYLanes(matrix);

  return {
    aacRuntimeBasisId: GATE_X_AAC_NONHOMOGENEOUS_MASONRY_RUNTIME_METHOD,
    aacSelectedCandidateId: GATE_X_AAC_NONHOMOGENEOUS_MASONRY_SELECTED_CANDIDATE_ID,
    closedCoverageGapRowIds: ["wall.aac_nonhomogeneous_masonry.lab"],
    currentPostureCoverage: orderedSubset(matrix.map((row) => row.currentPosture), POSTURE_COVERAGE_ORDER),
    failureClassCoverage: unique(matrix.map((row) => row.failureClass)),
    numericRuntimeValueMovement: false,
    remainingCoverageGapRowIds: matrix
      .filter((row) => row.failureClass === "coverage_gap")
      .map((row) => row.id),
    rowCount: matrix.length,
    selectedGateYLane: laneSelection.selectedCandidate.id,
    selectedNextAction: laneSelection.selectedNextAction,
    selectedNextFile: laneSelection.selectedNextFile
  };
}
