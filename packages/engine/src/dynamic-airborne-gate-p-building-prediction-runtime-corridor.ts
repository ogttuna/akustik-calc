import type { RequestedOutputId } from "@dynecho/shared";

import {
  buildGateOAirborneBuildingPredictionFormulaCorridorContract,
  GATE_O_AIRBORNE_BUILDING_PREDICTION_FORMULA_CORRIDOR_PLAN,
  GATE_O_AIRBORNE_BUILDING_PREDICTION_FORMULA_CORRIDOR_STATUS,
  GATE_O_AIRBORNE_BUILDING_PREDICTION_TOLERANCE_DB,
  type GateOAirborneBuildingPredictionFormulaTerm
} from "./dynamic-airborne-gate-o-building-prediction-formula-corridor";
import {
  GATE_N_AIRBORNE_BUILDING_PREDICTION_RUNTIME_ADAPTER_METHOD,
  GATE_N_AIRBORNE_BUILDING_PREDICTION_RUNTIME_ADAPTER_WARNING
} from "./dynamic-airborne-gate-n-building-prediction-runtime-adapter";

export const GATE_P_AIRBORNE_BUILDING_PREDICTION_RUNTIME_CORRIDOR_PLAN =
  "gate_p_personal_use_mvp_airborne_building_prediction_runtime_corridor_plan";

export const GATE_P_AIRBORNE_BUILDING_PREDICTION_RUNTIME_CORRIDOR_STATUS =
  "gate_p_personal_use_mvp_airborne_building_prediction_runtime_corridor_closed_no_runtime_selected_opening_leak_composite_gate_q";

export const GATE_P_AIRBORNE_BUILDING_PREDICTION_SELECTED_NEXT_ACTION =
  "gate_q_personal_use_mvp_opening_leak_composite_transmission_loss_input_contract_plan";

export const GATE_P_AIRBORNE_BUILDING_PREDICTION_SELECTED_NEXT_FILE =
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-q-opening-leak-composite-transmission-loss-input-contract.test.ts";

export type GatePAirborneBuildingPredictionRuntimeDecisionBranch =
  | "runtime_blocked_formula_terms_not_owned"
  | "runtime_promoted_with_owned_formula_terms";

export type GatePAirborneBuildingPredictionTermDecision = {
  gateODesignTermDefined: true;
  promotionBlocker: string;
  requiredBeforePromotion: true;
  runtimeExecutableInGateP: false;
  termId: GateOAirborneBuildingPredictionFormulaTerm["termId"];
};

export type GatePAirborneBuildingPredictionCorridorDecision = {
  blockedReason: string;
  metricId: "R'w" | "DnT,w";
  proposedRuntimeEstimateDb: null;
  runtimePromotionAllowedInGateP: false;
  selectedCandidateId: "candidate_dynamic_unsupported";
  targetOutputs: readonly RequestedOutputId[];
};

export type GatePAirborneBuildingPredictionNextLaneCandidateId =
  | "broad_source_crawl"
  | "field_context_surface_hardening"
  | "opening_leak_composite_transmission_loss";

export type GatePAirborneBuildingPredictionNextLaneCandidate = {
  basisLeakageRisk: number;
  calculatorCoverageGain: number;
  id: GatePAirborneBuildingPredictionNextLaneCandidateId;
  implementationCost: number;
  reason: string;
  score: number;
  selected: boolean;
  sourceRowsRequiredForRuntimeSelection: boolean;
};

export type GatePAirborneBuildingPredictionRuntimeCorridorContract = {
  aliasBoundariesPreserved: {
    fieldRuntimeBudget: true;
    labRwOrStc: true;
    sourceSingleNumberWithoutCurve: true;
  };
  blockedRuntimeWarning: typeof GATE_N_AIRBORNE_BUILDING_PREDICTION_RUNTIME_ADAPTER_WARNING;
  corridorDecisions: readonly GatePAirborneBuildingPredictionCorridorDecision[];
  decisionBranch: "runtime_blocked_formula_terms_not_owned";
  exactMeasuredRowsRemainPrecedence: true;
  formulaTermDecisions: readonly GatePAirborneBuildingPredictionTermDecision[];
  landedGate: typeof GATE_P_AIRBORNE_BUILDING_PREDICTION_RUNTIME_CORRIDOR_PLAN;
  metricRuntimeMethod: typeof GATE_N_AIRBORNE_BUILDING_PREDICTION_RUNTIME_ADAPTER_METHOD;
  nextLaneCandidates: readonly GatePAirborneBuildingPredictionNextLaneCandidate[];
  numericRuntimeBehaviorChange: false;
  previousLandedGate: typeof GATE_O_AIRBORNE_BUILDING_PREDICTION_FORMULA_CORRIDOR_PLAN;
  previousSelectionStatus: typeof GATE_O_AIRBORNE_BUILDING_PREDICTION_FORMULA_CORRIDOR_STATUS;
  promotionBranches: readonly GatePAirborneBuildingPredictionRuntimeDecisionBranch[];
  runtimePromotionAllowedInGateP: false;
  runtimeValueMovement: false;
  selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1";
  selectedNextAction: typeof GATE_P_AIRBORNE_BUILDING_PREDICTION_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof GATE_P_AIRBORNE_BUILDING_PREDICTION_SELECTED_NEXT_FILE;
  selectionStatus: typeof GATE_P_AIRBORNE_BUILDING_PREDICTION_RUNTIME_CORRIDOR_STATUS;
  sourceRowsRequiredForRuntimeSelection: false;
  toleranceDbPreserved: typeof GATE_O_AIRBORNE_BUILDING_PREDICTION_TOLERANCE_DB;
};

const TERM_BLOCKERS: Record<string, string> = {
  building_prediction_uncertainty_budget:
    "The Gate O +/-9 dB budget is visible, but it is still a design budget and cannot by itself create measured or design-grade building runtime.",
  direct_separating_element_frequency_curve:
    "The current selected wall candidate exposes rated single-number outputs, but Gate P has no reusable direct separating-element frequency curve owner for building energy summation.",
  flanking_path_energy_sum:
    "Flanking paths are named by Gate O but not executable as path-by-path transmission energy terms.",
  junction_vibration_reduction_index:
    "Junction class and coupling length are collected, but no runtime vibration-reduction index formula owner exists yet.",
  room_absorption_standardization:
    "Room geometry and RT60 are collected, but the building-standardization term is not wired into a runtime candidate separate from Gate I field context."
};

function scoreLane(input: {
  basisLeakageRisk: number;
  calculatorCoverageGain: number;
  implementationCost: number;
}): number {
  return Math.round(
    (input.calculatorCoverageGain / (input.implementationCost + input.basisLeakageRisk)) * 10
  ) / 10;
}

function buildTermDecision(
  term: GateOAirborneBuildingPredictionFormulaTerm
): GatePAirborneBuildingPredictionTermDecision {
  return {
    gateODesignTermDefined: true,
    promotionBlocker:
      TERM_BLOCKERS[term.termId] ??
      "Gate P cannot promote a building-prediction term until it is executable and visible in trace/report surfaces.",
    requiredBeforePromotion: true,
    runtimeExecutableInGateP: false,
    termId: term.termId
  };
}

function buildNextLaneCandidates(): readonly GatePAirborneBuildingPredictionNextLaneCandidate[] {
  const candidates = [
    {
      basisLeakageRisk: 2,
      calculatorCoverageGain: 8,
      id: "opening_leak_composite_transmission_loss",
      implementationCost: 4,
      reason:
        "Common wall calculator use needs doors/windows/leaks and composite area transmission before another high-risk building flanking runtime attempt.",
      sourceRowsRequiredForRuntimeSelection: false
    },
    {
      basisLeakageRisk: 3,
      calculatorCoverageGain: 5,
      id: "field_context_surface_hardening",
      implementationCost: 4,
      reason:
        "Field-context rows are already partly live, so this is useful but lower coverage gain than opening/leak composite modelling.",
      sourceRowsRequiredForRuntimeSelection: false
    },
    {
      basisLeakageRisk: 6,
      calculatorCoverageGain: 2,
      id: "broad_source_crawl",
      implementationCost: 6,
      reason:
        "Broad source crawling does not unblock source-absent family solvers and remains the wrong next step.",
      sourceRowsRequiredForRuntimeSelection: true
    }
  ] as const satisfies readonly Omit<GatePAirborneBuildingPredictionNextLaneCandidate, "score" | "selected">[];
  const scored = candidates.map((candidate) => ({
    ...candidate,
    score: scoreLane(candidate),
    selected: false
  }));
  const [selected] = [...scored].sort((left, right) => {
    const scoreDelta = right.score - left.score;
    return scoreDelta === 0 ? left.id.localeCompare(right.id) : scoreDelta;
  });

  return scored.map((candidate) => ({
    ...candidate,
    selected: candidate.id === selected?.id
  }));
}

export function buildGatePAirborneBuildingPredictionRuntimeCorridorContract(): GatePAirborneBuildingPredictionRuntimeCorridorContract {
  const gateOContract = buildGateOAirborneBuildingPredictionFormulaCorridorContract();
  const [representativeCorridor] = gateOContract.candidateFormulaCorridors;

  if (!representativeCorridor) {
    throw new Error("Gate P requires the Gate O formula corridor before it can make a runtime decision.");
  }

  return {
    aliasBoundariesPreserved: {
      fieldRuntimeBudget: true,
      labRwOrStc: true,
      sourceSingleNumberWithoutCurve: true
    },
    blockedRuntimeWarning: GATE_N_AIRBORNE_BUILDING_PREDICTION_RUNTIME_ADAPTER_WARNING,
    corridorDecisions: gateOContract.candidateFormulaCorridors.map((corridor) => ({
      blockedReason:
        "Gate P found named formula terms but no executable path-by-path building-prediction runtime owner.",
      metricId: corridor.metricId,
      proposedRuntimeEstimateDb: null,
      runtimePromotionAllowedInGateP: false,
      selectedCandidateId: "candidate_dynamic_unsupported",
      targetOutputs: [corridor.metricId]
    })),
    decisionBranch: "runtime_blocked_formula_terms_not_owned",
    exactMeasuredRowsRemainPrecedence: true,
    formulaTermDecisions: representativeCorridor.formulaTerms.map(buildTermDecision),
    landedGate: GATE_P_AIRBORNE_BUILDING_PREDICTION_RUNTIME_CORRIDOR_PLAN,
    metricRuntimeMethod: GATE_N_AIRBORNE_BUILDING_PREDICTION_RUNTIME_ADAPTER_METHOD,
    nextLaneCandidates: buildNextLaneCandidates(),
    numericRuntimeBehaviorChange: false,
    previousLandedGate: GATE_O_AIRBORNE_BUILDING_PREDICTION_FORMULA_CORRIDOR_PLAN,
    previousSelectionStatus: GATE_O_AIRBORNE_BUILDING_PREDICTION_FORMULA_CORRIDOR_STATUS,
    promotionBranches: [
      "runtime_promoted_with_owned_formula_terms",
      "runtime_blocked_formula_terms_not_owned"
    ],
    runtimePromotionAllowedInGateP: false,
    runtimeValueMovement: false,
    selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
    selectedNextAction: GATE_P_AIRBORNE_BUILDING_PREDICTION_SELECTED_NEXT_ACTION,
    selectedNextFile: GATE_P_AIRBORNE_BUILDING_PREDICTION_SELECTED_NEXT_FILE,
    selectionStatus: GATE_P_AIRBORNE_BUILDING_PREDICTION_RUNTIME_CORRIDOR_STATUS,
    sourceRowsRequiredForRuntimeSelection: false,
    toleranceDbPreserved: GATE_O_AIRBORNE_BUILDING_PREDICTION_TOLERANCE_DB
  };
}
