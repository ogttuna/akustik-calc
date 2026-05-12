import {
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AR_LANDED_GATE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AR_SELECTION_STATUS
} from "./calculator-personal-use-mvp-coverage-sprint-gate-ar";
import {
  GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
  GATE_AR_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID
} from "./dynamic-airborne-gate-ar-airborne-building-prediction-runtime-corridor";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AS_LANDED_GATE =
  "gate_as_personal_use_mvp_airborne_building_prediction_surface_api_report_parity_plan";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AS_SELECTION_STATUS =
  "gate_as_personal_use_mvp_airborne_building_prediction_surface_api_report_parity_landed_selected_acceptance_matrix_gate_at";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AS_SELECTED_NEXT_ACTION =
  "gate_at_personal_use_mvp_acceptance_matrix_refresh_after_building_prediction_plan";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AS_SELECTED_NEXT_FILE =
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-at-acceptance-matrix-refresh-after-building-prediction-contract.test.ts";

export type PersonalUseMvpCoverageSprintGateASVisibleSurfaceId =
  | "output_cards"
  | "route_posture"
  | "scenario_corridor_summary"
  | "method_dossier"
  | "corridor_dossier"
  | "saved_replay"
  | "markdown_report"
  | "estimate_api_payload";

export type PersonalUseMvpCoverageSprintGateASContract = {
  apiShapeChange: false;
  candidateId: typeof GATE_AR_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID;
  evidencePromotion: false;
  landedGate: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AS_LANDED_GATE;
  numericRuntimeBehaviorChange: false;
  previousLandedGate: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AR_LANDED_GATE;
  previousSelectionStatus: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AR_SELECTION_STATUS;
  runtimeMethod: typeof GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD;
  selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1";
  selectedNextAction: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AS_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AS_SELECTED_NEXT_FILE;
  selectionStatus: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AS_SELECTION_STATUS;
  sourceRowsRequiredForRuntimeSelection: false;
  visibleSurfaceIds: readonly PersonalUseMvpCoverageSprintGateASVisibleSurfaceId[];
  workbenchInputBehaviorChange: false;
  workbenchVisibleBehaviorChange: true;
};

export function buildPersonalUseMvpCoverageSprintGateASContract(): PersonalUseMvpCoverageSprintGateASContract {
  return {
    apiShapeChange: false,
    candidateId: GATE_AR_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID,
    evidencePromotion: false,
    landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AS_LANDED_GATE,
    numericRuntimeBehaviorChange: false,
    previousLandedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AR_LANDED_GATE,
    previousSelectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AR_SELECTION_STATUS,
    runtimeMethod: GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
    selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
    selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AS_SELECTED_NEXT_ACTION,
    selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AS_SELECTED_NEXT_FILE,
    selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AS_SELECTION_STATUS,
    sourceRowsRequiredForRuntimeSelection: false,
    visibleSurfaceIds: [
      "output_cards",
      "route_posture",
      "scenario_corridor_summary",
      "method_dossier",
      "corridor_dossier",
      "saved_replay",
      "markdown_report",
      "estimate_api_payload"
    ],
    workbenchInputBehaviorChange: false,
    workbenchVisibleBehaviorChange: true
  };
}
