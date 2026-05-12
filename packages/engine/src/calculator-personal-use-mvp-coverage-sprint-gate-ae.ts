import {
  GATE_AE_FLAT_MULTICAVITY_PREDICTION_STRATEGY,
  GATE_AE_FLAT_MULTICAVITY_RUNTIME_METHOD,
  GATE_AE_FLAT_MULTICAVITY_SELECTED_CANDIDATE_ID
} from "./dynamic-airborne-gate-ae-flat-multicavity";
import { PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AD_SELECTION_STATUS } from "./calculator-personal-use-mvp-coverage-sprint-gate-ad";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AE_LANDED_GATE =
  "gate_ae_personal_use_mvp_flat_multicavity_solver_broadening_plan";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AE_SELECTION_STATUS =
  "gate_ae_personal_use_mvp_flat_multicavity_solver_broadening_landed_selected_revalidation_gate_af";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AE_SELECTED_NEXT_FILE =
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-af-post-flat-multicavity-solver-broadening-revalidation-contract.test.ts";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AE_SELECTED_NEXT_ACTION =
  "gate_af_personal_use_mvp_post_flat_multicavity_solver_broadening_revalidation_plan";

export const GATE_AE_FLAT_MULTICAVITY_EXPECTED_METRICS = {
  estimatedCDb: -0.6,
  estimatedCtrDb: -8,
  estimatedRwDb: 53,
  estimatedStc: 57
} as const;

export const GATE_AE_FLAT_MULTICAVITY_PREVIOUS_SCREENING_METRICS = {
  estimatedCDb: -1,
  estimatedCtrDb: -5.6,
  estimatedRwDb: 38,
  estimatedStc: 38
} as const;

export const GATE_AE_FLAT_MULTICAVITY_ERROR_BUDGET_DB = 7;

export type PersonalUseMvpCoverageSprintGateAESummary = {
  errorBudgetDb: typeof GATE_AE_FLAT_MULTICAVITY_ERROR_BUDGET_DB;
  expectedMetrics: typeof GATE_AE_FLAT_MULTICAVITY_EXPECTED_METRICS;
  landedGate: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AE_LANDED_GATE;
  previousScreeningMetrics: typeof GATE_AE_FLAT_MULTICAVITY_PREVIOUS_SCREENING_METRICS;
  previousSelectionStatus: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AD_SELECTION_STATUS;
  runtimeMethod: typeof GATE_AE_FLAT_MULTICAVITY_RUNTIME_METHOD;
  runtimeValueMovement: true;
  selectedCandidateId: typeof GATE_AE_FLAT_MULTICAVITY_SELECTED_CANDIDATE_ID;
  selectedNextAction: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AE_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AE_SELECTED_NEXT_FILE;
  selectionStatus: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AE_SELECTION_STATUS;
  solverStrategy: typeof GATE_AE_FLAT_MULTICAVITY_PREDICTION_STRATEGY;
  sourceRowsRequiredForRuntimeSelection: false;
};

export function summarizePersonalUseMvpCoverageSprintGateAE(): PersonalUseMvpCoverageSprintGateAESummary {
  return {
    errorBudgetDb: GATE_AE_FLAT_MULTICAVITY_ERROR_BUDGET_DB,
    expectedMetrics: GATE_AE_FLAT_MULTICAVITY_EXPECTED_METRICS,
    landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AE_LANDED_GATE,
    previousScreeningMetrics: GATE_AE_FLAT_MULTICAVITY_PREVIOUS_SCREENING_METRICS,
    previousSelectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AD_SELECTION_STATUS,
    runtimeMethod: GATE_AE_FLAT_MULTICAVITY_RUNTIME_METHOD,
    runtimeValueMovement: true,
    selectedCandidateId: GATE_AE_FLAT_MULTICAVITY_SELECTED_CANDIDATE_ID,
    selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AE_SELECTED_NEXT_ACTION,
    selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AE_SELECTED_NEXT_FILE,
    selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AE_SELECTION_STATUS,
    solverStrategy: GATE_AE_FLAT_MULTICAVITY_PREDICTION_STRATEGY,
    sourceRowsRequiredForRuntimeSelection: false
  };
}
