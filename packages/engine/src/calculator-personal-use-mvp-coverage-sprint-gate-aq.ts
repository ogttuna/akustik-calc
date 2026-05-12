import {
  buildPersonalUseMvpCoverageSprintGateALOwnerGapMap,
  type PersonalUseMvpCoverageSprintGateALOwnerGap,
  type PersonalUseMvpCoverageSprintGateALOwnerId
} from "./calculator-personal-use-mvp-coverage-sprint-gate-al";
import {
  buildPersonalUseMvpCoverageSprintGateAPContract,
  buildPersonalUseMvpCoverageSprintGateAPRoomStandardizationOwnerContract,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AP_LANDED_GATE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AP_SELECTION_STATUS,
  type PersonalUseMvpCoverageSprintGateAPRoomStandardizationOwnerContract
} from "./calculator-personal-use-mvp-coverage-sprint-gate-ap";
import {
  buildGateNAirborneBuildingPredictionRuntimeAdapterAssessment,
  type GateNAirborneBuildingPredictionStatus
} from "./dynamic-airborne-gate-n-building-prediction-runtime-adapter";
import {
  buildGateOAirborneBuildingPredictionFormulaCorridorContract,
  GATE_O_AIRBORNE_BUILDING_PREDICTION_TOLERANCE_DB,
  type GateOAirborneBuildingPredictionToleranceBudget,
  type GateOAirborneBuildingPredictionToleranceTerm
} from "./dynamic-airborne-gate-o-building-prediction-formula-corridor";
import {
  buildGatePAirborneBuildingPredictionRuntimeCorridorContract
} from "./dynamic-airborne-gate-p-building-prediction-runtime-corridor";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AQ_LANDED_GATE =
  "gate_aq_personal_use_mvp_airborne_building_prediction_uncertainty_budget_owner_contract_plan";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AQ_SELECTION_STATUS =
  "gate_aq_personal_use_mvp_airborne_building_prediction_uncertainty_budget_owner_landed_no_runtime_selected_all_owner_runtime_corridor_gate_ar";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AQ_SELECTED_NEXT_ACTION =
  "gate_ar_personal_use_mvp_airborne_building_prediction_all_owner_runtime_corridor_plan";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AQ_SELECTED_NEXT_FILE =
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ar-airborne-building-prediction-all-owner-runtime-corridor-contract.test.ts";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AQ_PREVIOUS_SELECTION_STATUS =
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AP_SELECTION_STATUS;

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AQ_UNCERTAINTY_OWNER_ID =
  "building_prediction_uncertainty_budget" satisfies PersonalUseMvpCoverageSprintGateALOwnerId;

export type PersonalUseMvpCoverageSprintGateAQBudgetRequirementId =
  | "apparent_r_prime_w_budget_terms_owner"
  | "basis_compatible_metric_scope"
  | "direct_curve_residual_budget_term_owner"
  | "flanking_energy_simplification_budget_term_owner"
  | "gate_o_metric_specific_budget_decomposition"
  | "input_geometry_or_room_standardization_precision_budget_term_owner"
  | "junction_vibration_surrogate_budget_term_owner"
  | "not_measured_evidence_posture"
  | "room_standardization_owner_dependency"
  | "same_building_holdout_absence_owner"
  | "source_absent_design_budget_posture"
  | "standardized_dnt_w_budget_terms_owner";

export type PersonalUseMvpCoverageSprintGateAQRejectedSignalId =
  | "exact_source_row_without_same_building_basis"
  | "gate_i_field_budget_alias"
  | "generic_safety_factor_without_decomposition"
  | "lab_rw_stc_tolerance_alias"
  | "measured_evidence_claim_without_same_building_holdout"
  | "opening_leak_lab_adapter_budget_alias"
  | "source_single_number_without_building_terms"
  | "stc_iic_product_only_evidence";

export type PersonalUseMvpCoverageSprintGateARLaneId =
  | "all_owner_building_prediction_runtime_corridor"
  | "broad_source_crawl"
  | "surface_parity_without_runtime";

export type PersonalUseMvpCoverageSprintGateAQBudgetTermOwner = {
  budgetTermId: GateOAirborneBuildingPredictionToleranceTerm["termId"];
  canTightenRuntimeToleranceInGateAQ: false;
  db: number;
  metricId: GateOAirborneBuildingPredictionToleranceBudget["metricId"];
  measuredEvidence: false;
  ownerSignal:
    | "direct_curve_owner_dependency"
    | "flanking_path_energy_owner_dependency"
    | "geometry_precision_owner"
    | "junction_vibration_owner_dependency"
    | "room_standardization_precision_owner"
    | "same_building_holdout_absence_owner";
};

export type PersonalUseMvpCoverageSprintGateAQMetricBudgetOwner = {
  metricId: GateOAirborneBuildingPredictionToleranceBudget["metricId"];
  notMeasuredEvidence: true;
  sourceAbsentDesignBudget: true;
  termOwners: readonly PersonalUseMvpCoverageSprintGateAQBudgetTermOwner[];
  toleranceDb: typeof GATE_O_AIRBORNE_BUILDING_PREDICTION_TOLERANCE_DB;
  totalBudgetDb: typeof GATE_O_AIRBORNE_BUILDING_PREDICTION_TOLERANCE_DB;
};

export type PersonalUseMvpCoverageSprintGateAQUncertaintyBudgetOwnerContract = {
  acceptedRequirementIds: readonly PersonalUseMvpCoverageSprintGateAQBudgetRequirementId[];
  budgetCanCreateRuntimeByItself: false;
  budgetMustComeFrom: "metric_specific_gate_o_source_absent_building_prediction_design_budget";
  downstreamOwnerGapsStillBlocked: readonly never[];
  evidenceRowIds: readonly string[];
  gateALOwnerGap: PersonalUseMvpCoverageSprintGateALOwnerGap;
  gatePBlockerPreserved: string;
  metricBudgets: readonly PersonalUseMvpCoverageSprintGateAQMetricBudgetOwner[];
  ownerId: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AQ_UNCERTAINTY_OWNER_ID;
  rejectedSignalIds: readonly PersonalUseMvpCoverageSprintGateAQRejectedSignalId[];
  requiredInputs: readonly string[];
  roomStandardizationOwnerDependency: PersonalUseMvpCoverageSprintGateAPRoomStandardizationOwnerContract;
  runtimePromotionAllowedInGateAQ: false;
  sourceRowsRequiredForRuntimeSelection: false;
  toleranceMovementAllowedInGateAQ: false;
  uncertaintyOwnerContractedInGateAQ: true;
};

export type PersonalUseMvpCoverageSprintGateARLaneCandidate = {
  basisLeakageRisk: number;
  calculatorCoverageGain: number;
  id: PersonalUseMvpCoverageSprintGateARLaneId;
  implementationCost: number;
  prerequisiteWeight: number;
  reason: string;
  runtimePromotionRisk: number;
  score: number;
  selected: boolean;
  solverReadiness: number;
  sourceRowsRequiredForRuntimeSelection: boolean;
};

export type PersonalUseMvpCoverageSprintGateARLaneSelection = {
  candidates: readonly PersonalUseMvpCoverageSprintGateARLaneCandidate[];
  selectedCandidate: PersonalUseMvpCoverageSprintGateARLaneCandidate;
  selectedNextAction: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AQ_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AQ_SELECTED_NEXT_FILE;
  selectionPolicy: readonly string[];
};

export type PersonalUseMvpCoverageSprintGateAQContract = {
  allGateALOwnerContractsAccountedFor: true;
  directCurveOwnerPreserved: true;
  downstreamOwnerGapsStillBlocked: readonly never[];
  flankingPathEnergyOwnerPreserved: true;
  gateALOwnerGapCount: 5;
  gateNAllOwnerAssessmentStatus: GateNAirborneBuildingPredictionStatus;
  gateNRuntimePromotionAllowed: false;
  gateOToleranceDbPreserved: typeof GATE_O_AIRBORNE_BUILDING_PREDICTION_TOLERANCE_DB;
  gatePDecisionBranch: "runtime_blocked_formula_terms_not_owned";
  junctionVibrationOwnerPreserved: true;
  landedGate: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AQ_LANDED_GATE;
  numericRuntimeBehaviorChange: false;
  previousLandedGate: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AP_LANDED_GATE;
  previousSelectionStatus: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AQ_PREVIOUS_SELECTION_STATUS;
  roomStandardizationOwnerPreserved: true;
  runtimePromotionAllowedInGateAQ: false;
  runtimeValueMovement: false;
  selectedGateARLane: PersonalUseMvpCoverageSprintGateARLaneId;
  selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1";
  selectedNextAction: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AQ_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AQ_SELECTED_NEXT_FILE;
  selectionStatus: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AQ_SELECTION_STATUS;
  sourceRowsRequiredForRuntimeSelection: false;
  uncertaintyBudgetOwner: PersonalUseMvpCoverageSprintGateAQUncertaintyBudgetOwnerContract;
};

const UNCERTAINTY_BUDGET_REQUIREMENTS = [
  "room_standardization_owner_dependency",
  "gate_o_metric_specific_budget_decomposition",
  "apparent_r_prime_w_budget_terms_owner",
  "standardized_dnt_w_budget_terms_owner",
  "direct_curve_residual_budget_term_owner",
  "flanking_energy_simplification_budget_term_owner",
  "junction_vibration_surrogate_budget_term_owner",
  "input_geometry_or_room_standardization_precision_budget_term_owner",
  "same_building_holdout_absence_owner",
  "source_absent_design_budget_posture",
  "not_measured_evidence_posture",
  "basis_compatible_metric_scope"
] as const satisfies readonly PersonalUseMvpCoverageSprintGateAQBudgetRequirementId[];

const UNCERTAINTY_BUDGET_REJECTED_SIGNALS = [
  "lab_rw_stc_tolerance_alias",
  "gate_i_field_budget_alias",
  "opening_leak_lab_adapter_budget_alias",
  "source_single_number_without_building_terms",
  "stc_iic_product_only_evidence",
  "generic_safety_factor_without_decomposition",
  "exact_source_row_without_same_building_basis",
  "measured_evidence_claim_without_same_building_holdout"
] as const satisfies readonly PersonalUseMvpCoverageSprintGateAQRejectedSignalId[];

function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

function scoreLane(
  candidate: Omit<PersonalUseMvpCoverageSprintGateARLaneCandidate, "score" | "selected">
): number {
  return round1(
    (
      candidate.calculatorCoverageGain *
      candidate.prerequisiteWeight *
      candidate.solverReadiness
    ) /
      (
        candidate.implementationCost +
        candidate.basisLeakageRisk +
        candidate.runtimePromotionRisk +
        1
      )
  );
}

function findUncertaintyOwnerGap(
  ownerGaps: readonly PersonalUseMvpCoverageSprintGateALOwnerGap[]
): PersonalUseMvpCoverageSprintGateALOwnerGap {
  const uncertaintyOwner = ownerGaps.find(
    (gap) => gap.ownerId === PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AQ_UNCERTAINTY_OWNER_ID
  );

  if (!uncertaintyOwner) {
    throw new Error("Gate AQ requires the Gate AL building-prediction uncertainty owner gap.");
  }

  return uncertaintyOwner;
}

function ownerSignalForBudgetTerm(
  term: GateOAirborneBuildingPredictionToleranceTerm,
  metricId: GateOAirborneBuildingPredictionToleranceBudget["metricId"]
): PersonalUseMvpCoverageSprintGateAQBudgetTermOwner["ownerSignal"] {
  switch (term.termId) {
    case "direct_family_curve_residual":
      return "direct_curve_owner_dependency";
    case "flanking_energy_path_simplification":
      return "flanking_path_energy_owner_dependency";
    case "junction_vibration_reduction_surrogate":
      return "junction_vibration_owner_dependency";
    case "input_geometry_precision":
      return "geometry_precision_owner";
    case "receiving_room_standardization_precision":
      return "room_standardization_precision_owner";
    case "same_building_holdout_absence":
      return "same_building_holdout_absence_owner";
    default:
      throw new Error(`Gate AQ cannot map ${String(term.termId)} for ${metricId}.`);
  }
}

function buildMetricBudgetOwner(
  budget: GateOAirborneBuildingPredictionToleranceBudget
): PersonalUseMvpCoverageSprintGateAQMetricBudgetOwner {
  return {
    metricId: budget.metricId,
    notMeasuredEvidence: budget.notMeasuredEvidence,
    sourceAbsentDesignBudget: true,
    termOwners: budget.terms.map((term) => ({
      budgetTermId: term.termId,
      canTightenRuntimeToleranceInGateAQ: false,
      db: term.db,
      measuredEvidence: false,
      metricId: budget.metricId,
      ownerSignal: ownerSignalForBudgetTerm(term, budget.metricId)
    })),
    toleranceDb: budget.toleranceDb,
    totalBudgetDb: budget.totalBudgetDb
  };
}

export function buildPersonalUseMvpCoverageSprintGateAQUncertaintyBudgetOwnerContract(input?: {
  ownerGaps?: readonly PersonalUseMvpCoverageSprintGateALOwnerGap[];
  roomStandardizationOwner?: PersonalUseMvpCoverageSprintGateAPRoomStandardizationOwnerContract;
}): PersonalUseMvpCoverageSprintGateAQUncertaintyBudgetOwnerContract {
  const ownerGaps = input?.ownerGaps ?? buildPersonalUseMvpCoverageSprintGateALOwnerGapMap();
  const roomStandardizationOwner =
    input?.roomStandardizationOwner ??
    buildPersonalUseMvpCoverageSprintGateAPRoomStandardizationOwnerContract({ ownerGaps });
  const uncertaintyOwner = findUncertaintyOwnerGap(ownerGaps);
  const gateOContract = buildGateOAirborneBuildingPredictionFormulaCorridorContract();
  const gatePContract = buildGatePAirborneBuildingPredictionRuntimeCorridorContract();
  const gatePDecision = gatePContract.formulaTermDecisions.find(
    (decision) => decision.termId === PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AQ_UNCERTAINTY_OWNER_ID
  );

  if (!gatePDecision) {
    throw new Error("Gate AQ requires the Gate P uncertainty-budget promotion blocker.");
  }

  return {
    acceptedRequirementIds: UNCERTAINTY_BUDGET_REQUIREMENTS,
    budgetCanCreateRuntimeByItself: false,
    budgetMustComeFrom: "metric_specific_gate_o_source_absent_building_prediction_design_budget",
    downstreamOwnerGapsStillBlocked: [],
    evidenceRowIds: uncertaintyOwner.evidenceRowIds,
    gateALOwnerGap: uncertaintyOwner,
    gatePBlockerPreserved: gatePDecision.promotionBlocker,
    metricBudgets: gateOContract.candidateFormulaCorridors.map((corridor) =>
      buildMetricBudgetOwner(corridor.toleranceBudget)
    ),
    ownerId: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AQ_UNCERTAINTY_OWNER_ID,
    rejectedSignalIds: UNCERTAINTY_BUDGET_REJECTED_SIGNALS,
    requiredInputs: [
      ...uncertaintyOwner.requiredInputs,
      "metricSpecificBudgetDecompositionOwner",
      "sameBuildingHoldoutAbsenceOwner",
      "sourceAbsentDesignBudgetPostureOwner",
      "notMeasuredEvidencePostureOwner",
      "basisCompatibleMetricScope"
    ],
    roomStandardizationOwnerDependency: roomStandardizationOwner,
    runtimePromotionAllowedInGateAQ: false,
    sourceRowsRequiredForRuntimeSelection: false,
    toleranceMovementAllowedInGateAQ: false,
    uncertaintyOwnerContractedInGateAQ: true
  };
}

export function rankPersonalUseMvpCoverageSprintGateARLanes(
  uncertaintyBudgetOwner: PersonalUseMvpCoverageSprintGateAQUncertaintyBudgetOwnerContract =
    buildPersonalUseMvpCoverageSprintGateAQUncertaintyBudgetOwnerContract()
): PersonalUseMvpCoverageSprintGateARLaneSelection {
  if (uncertaintyBudgetOwner.downstreamOwnerGapsStillBlocked.length !== 0) {
    throw new Error("Gate AR ranking requires Gate AQ to account for every Gate AL owner gap.");
  }

  const candidateSeeds = [
    {
      basisLeakageRisk: 5,
      calculatorCoverageGain: 8,
      id: "all_owner_building_prediction_runtime_corridor",
      implementationCost: 7,
      prerequisiteWeight: 5,
      reason:
        "All five Gate AL owner contracts are now accounted for, so the next bounded slice is the all-owner runtime corridor where building R'w/DnT,w can be considered.",
      runtimePromotionRisk: 5,
      solverReadiness: 3,
      sourceRowsRequiredForRuntimeSelection: false
    },
    {
      basisLeakageRisk: 3,
      calculatorCoverageGain: 4,
      id: "surface_parity_without_runtime",
      implementationCost: 4,
      prerequisiteWeight: 2,
      reason:
        "Surface parity is required after runtime exists, but it cannot prove the runtime corridor while values are still parked.",
      runtimePromotionRisk: 1,
      solverReadiness: 3,
      sourceRowsRequiredForRuntimeSelection: false
    },
    {
      basisLeakageRisk: 8,
      calculatorCoverageGain: 2,
      id: "broad_source_crawl",
      implementationCost: 9,
      prerequisiteWeight: 1,
      reason:
        "Broad source crawling is lower value than proving the source-absent all-owner runtime corridor already selected by the calculator path.",
      runtimePromotionRisk: 8,
      solverReadiness: 1,
      sourceRowsRequiredForRuntimeSelection: true
    }
  ] as const satisfies readonly Omit<PersonalUseMvpCoverageSprintGateARLaneCandidate, "score" | "selected">[];
  const candidatesWithoutSelection = candidateSeeds.map((candidate) => ({
    ...candidate,
    score: scoreLane(candidate),
    selected: false
  }));
  const [selected] = [...candidatesWithoutSelection].sort((left, right) => {
    const scoreDelta = right.score - left.score;
    return scoreDelta === 0 ? left.id.localeCompare(right.id) : scoreDelta;
  });

  if (!selected) {
    throw new Error("Personal-use MVP Coverage Sprint Gate AQ requires a Gate AR lane candidate.");
  }

  const candidates = candidatesWithoutSelection.map((candidate) => ({
    ...candidate,
    selected: candidate.id === selected.id
  }));
  const selectedCandidate = candidates.find((candidate) => candidate.selected);

  if (!selectedCandidate) {
    throw new Error("Personal-use MVP Coverage Sprint Gate AQ did not mark a selected Gate AR lane.");
  }

  return {
    candidates,
    selectedCandidate,
    selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AQ_SELECTED_NEXT_ACTION,
    selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AQ_SELECTED_NEXT_FILE,
    selectionPolicy: [
      "keep Gate AQ no-runtime: uncertainty-budget ownership does not promote building R'w or DnT,w",
      "score coverage_gain * prerequisite_weight * solver_readiness / (implementation_cost + basis_leakage_risk + runtime_promotion_risk + 1)",
      "select the all-owner runtime corridor only after direct, flanking, junction, room, and uncertainty owners are all accounted for",
      "reject surface parity and broad source crawling before the runtime corridor has an executable value path"
    ]
  };
}

export function buildPersonalUseMvpCoverageSprintGateAQContract(): PersonalUseMvpCoverageSprintGateAQContract {
  const gateAPContract = buildPersonalUseMvpCoverageSprintGateAPContract();
  const gatePContract = buildGatePAirborneBuildingPredictionRuntimeCorridorContract();
  const ownerGaps = buildPersonalUseMvpCoverageSprintGateALOwnerGapMap();
  const uncertaintyBudgetOwner = buildPersonalUseMvpCoverageSprintGateAQUncertaintyBudgetOwnerContract({
    ownerGaps,
    roomStandardizationOwner: gateAPContract.roomStandardizationOwner
  });
  const gateNReadyAssessment = buildGateNAirborneBuildingPredictionRuntimeAdapterAssessment({
    airborneContext: {
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
    },
    formulaOwners: {
      buildingPredictionUncertaintyBudgetOwner: true,
      directSeparatingElementFrequencyCurveOwner: true,
      flankingPathTransmissionTermsOwner: true,
      junctionVibrationReductionIndexOwner: true,
      roomAbsorptionNormalizationOwner: true
    },
    layers: [
      { materialId: "gypsum_board", thicknessMm: 12.5 },
      { materialId: "air_gap", thicknessMm: 40 },
      { materialId: "rockwool", thicknessMm: 40 },
      { materialId: "concrete", thicknessMm: 160 }
    ],
    runtimeOwners: {
      apparentBuildingMetricBasisOwner: true,
      iso12354FlankingAdapterOwner: true,
      junctionCouplingLengthOwner: true,
      standardizedBuildingMetricBasisOwner: true
    },
    scenarioId: "gate_n_complete_formula_owner_set_ready_for_gate_o_formula_corridor",
    targetOutputs: ["R'w", "DnT,w"]
  });
  const laneSelection = rankPersonalUseMvpCoverageSprintGateARLanes(uncertaintyBudgetOwner);

  return {
    allGateALOwnerContractsAccountedFor: true,
    directCurveOwnerPreserved: true,
    downstreamOwnerGapsStillBlocked: uncertaintyBudgetOwner.downstreamOwnerGapsStillBlocked,
    flankingPathEnergyOwnerPreserved: true,
    gateALOwnerGapCount: ownerGaps.length as 5,
    gateNAllOwnerAssessmentStatus: gateNReadyAssessment.status,
    gateNRuntimePromotionAllowed: gateNReadyAssessment.runtimePromotionAllowedInGateN,
    gateOToleranceDbPreserved: GATE_O_AIRBORNE_BUILDING_PREDICTION_TOLERANCE_DB,
    gatePDecisionBranch: gatePContract.decisionBranch,
    junctionVibrationOwnerPreserved: true,
    landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AQ_LANDED_GATE,
    numericRuntimeBehaviorChange: false,
    previousLandedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AP_LANDED_GATE,
    previousSelectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AQ_PREVIOUS_SELECTION_STATUS,
    roomStandardizationOwnerPreserved: true,
    runtimePromotionAllowedInGateAQ: false,
    runtimeValueMovement: false,
    selectedGateARLane: laneSelection.selectedCandidate.id,
    selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
    selectedNextAction: laneSelection.selectedNextAction,
    selectedNextFile: laneSelection.selectedNextFile,
    selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AQ_SELECTION_STATUS,
    sourceRowsRequiredForRuntimeSelection: false,
    uncertaintyBudgetOwner
  };
}
