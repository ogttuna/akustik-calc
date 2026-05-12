import type { RequestedOutputId } from "@dynecho/shared";

import {
  buildPersonalUseMvpCoverageSprintGateAQContract,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AQ_LANDED_GATE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AQ_SELECTION_STATUS
} from "./calculator-personal-use-mvp-coverage-sprint-gate-aq";
import {
  GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
  GATE_AR_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID
} from "./dynamic-airborne-gate-ar-airborne-building-prediction-runtime-corridor";
import { buildGateNAirborneBuildingPredictionRuntimeAdapterAssessment } from "./dynamic-airborne-gate-n-building-prediction-runtime-adapter";
import {
  buildGateOAirborneBuildingPredictionFormulaCorridorContract,
  GATE_O_AIRBORNE_BUILDING_PREDICTION_TOLERANCE_DB
} from "./dynamic-airborne-gate-o-building-prediction-formula-corridor";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AR_LANDED_GATE =
  "gate_ar_personal_use_mvp_airborne_building_prediction_all_owner_runtime_corridor_plan";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AR_SELECTION_STATUS =
  "gate_ar_personal_use_mvp_airborne_building_prediction_all_owner_runtime_corridor_landed_selected_surface_parity_gate_as";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AR_SELECTED_NEXT_ACTION =
  "gate_as_personal_use_mvp_airborne_building_prediction_surface_api_report_parity_plan";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AR_SELECTED_NEXT_FILE =
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-as-airborne-building-prediction-surface-parity-contract.test.ts";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AR_PREVIOUS_SELECTION_STATUS =
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AQ_SELECTION_STATUS;

export type PersonalUseMvpCoverageSprintGateARRuntimeRequirementId =
  | "direct_dynamic_airborne_curve_owner"
  | "flanking_path_energy_overlay_owner"
  | "junction_class_and_coupling_length_owner"
  | "room_standardization_owner"
  | "gate_aq_uncertainty_budget_owner"
  | "basis_compatible_building_metric_scope"
  | "visible_not_measured_posture";

export type PersonalUseMvpCoverageSprintGateARNegativeBoundaryId =
  | "partial_building_context_stays_needs_input"
  | "field_between_rooms_stays_gate_i"
  | "element_lab_stays_lab_family_route"
  | "opening_leak_building_adapter_stays_blocked"
  | "lab_rw_stc_source_single_number_alias_blocked"
  | "stc_iic_wrong_basis_alias_blocked";

export type PersonalUseMvpCoverageSprintGateARMetricRuntime = {
  errorBudgetDb: typeof GATE_O_AIRBORNE_BUILDING_PREDICTION_TOLERANCE_DB;
  metricId: "R'w" | "DnT,w";
  method: typeof GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD;
  notMeasuredEvidence: true;
  origin: "family_physics_prediction";
  sourceAbsent: true;
};

export type PersonalUseMvpCoverageSprintGateARContract = {
  acceptedRequirementIds: readonly PersonalUseMvpCoverageSprintGateARRuntimeRequirementId[];
  candidateId: typeof GATE_AR_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID;
  completeBuildingRuntimePromotionAllowed: true;
  exactMeasuredRowsRemainPrecedence: true;
  gateNReadyStatus: "ready_for_formula_corridor";
  landedGate: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AR_LANDED_GATE;
  metricRuntimes: readonly PersonalUseMvpCoverageSprintGateARMetricRuntime[];
  negativeBoundaryIds: readonly PersonalUseMvpCoverageSprintGateARNegativeBoundaryId[];
  numericRuntimeBehaviorChange: true;
  previousLandedGate: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AQ_LANDED_GATE;
  previousSelectionStatus: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AR_PREVIOUS_SELECTION_STATUS;
  runtimeMethod: typeof GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD;
  selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1";
  selectedNextAction: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AR_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AR_SELECTED_NEXT_FILE;
  selectionStatus: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AR_SELECTION_STATUS;
  sourceRowsRequiredForRuntimeSelection: false;
  supportedRuntimeOutputs: readonly ("R'w" | "DnT,w")[];
};

const BUILDING_OUTPUTS = ["R'w", "DnT,w"] as const satisfies readonly RequestedOutputId[];

const COMPLETE_BUILDING_CONTEXT = {
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
} as const;

const LINED_MASSIVE_WALL = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "air_gap", thicknessMm: 40 },
  { materialId: "rockwool", thicknessMm: 40 },
  { materialId: "concrete", thicknessMm: 160 }
] as const;

const COMPLETE_GATE_M_RUNTIME_OWNERS = {
  apparentBuildingMetricBasisOwner: true,
  iso12354FlankingAdapterOwner: true,
  junctionCouplingLengthOwner: true,
  standardizedBuildingMetricBasisOwner: true
} as const;

const COMPLETE_FORMULA_OWNERS = {
  buildingPredictionUncertaintyBudgetOwner: true,
  directSeparatingElementFrequencyCurveOwner: true,
  flankingPathTransmissionTermsOwner: true,
  junctionVibrationReductionIndexOwner: true,
  roomAbsorptionNormalizationOwner: true
} as const;

export function buildPersonalUseMvpCoverageSprintGateARContract(): PersonalUseMvpCoverageSprintGateARContract {
  const gateAQContract = buildPersonalUseMvpCoverageSprintGateAQContract();
  const gateOContract = buildGateOAirborneBuildingPredictionFormulaCorridorContract();
  const readyAssessment = buildGateNAirborneBuildingPredictionRuntimeAdapterAssessment({
    airborneContext: COMPLETE_BUILDING_CONTEXT,
    formulaOwners: COMPLETE_FORMULA_OWNERS,
    layers: LINED_MASSIVE_WALL,
    runtimeOwners: COMPLETE_GATE_M_RUNTIME_OWNERS,
    scenarioId: "gate_n_complete_formula_owner_set_ready_for_gate_o_formula_corridor",
    targetOutputs: BUILDING_OUTPUTS
  });

  if (readyAssessment.status !== "ready_for_formula_corridor") {
    throw new Error("Gate AR requires Gate N's complete all-owner assessment to be ready.");
  }

  return {
    acceptedRequirementIds: [
      "direct_dynamic_airborne_curve_owner",
      "flanking_path_energy_overlay_owner",
      "junction_class_and_coupling_length_owner",
      "room_standardization_owner",
      "gate_aq_uncertainty_budget_owner",
      "basis_compatible_building_metric_scope",
      "visible_not_measured_posture"
    ],
    candidateId: GATE_AR_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID,
    completeBuildingRuntimePromotionAllowed: true,
    exactMeasuredRowsRemainPrecedence: true,
    gateNReadyStatus: readyAssessment.status,
    landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AR_LANDED_GATE,
    metricRuntimes: gateOContract.candidateFormulaCorridors.map((corridor) => ({
      errorBudgetDb: corridor.toleranceBudget.toleranceDb,
      metricId: corridor.metricId,
      method: GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
      notMeasuredEvidence: true,
      origin: "family_physics_prediction",
      sourceAbsent: true
    })),
    negativeBoundaryIds: [
      "partial_building_context_stays_needs_input",
      "field_between_rooms_stays_gate_i",
      "element_lab_stays_lab_family_route",
      "opening_leak_building_adapter_stays_blocked",
      "lab_rw_stc_source_single_number_alias_blocked",
      "stc_iic_wrong_basis_alias_blocked"
    ],
    numericRuntimeBehaviorChange: true,
    previousLandedGate: gateAQContract.landedGate,
    previousSelectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AR_PREVIOUS_SELECTION_STATUS,
    runtimeMethod: GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
    selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
    selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AR_SELECTED_NEXT_ACTION,
    selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AR_SELECTED_NEXT_FILE,
    selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AR_SELECTION_STATUS,
    sourceRowsRequiredForRuntimeSelection: false,
    supportedRuntimeOutputs: BUILDING_OUTPUTS
  };
}
