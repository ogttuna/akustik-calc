import {
  buildPersonalUseMvpCoverageSprintGateALContract,
  buildPersonalUseMvpCoverageSprintGateALOwnerGapMap,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AL_LANDED_GATE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AL_SELECTION_STATUS,
  type PersonalUseMvpCoverageSprintGateALOwnerGap,
  type PersonalUseMvpCoverageSprintGateALOwnerId
} from "./calculator-personal-use-mvp-coverage-sprint-gate-al";
import {
  GATE_O_AIRBORNE_BUILDING_PREDICTION_TOLERANCE_DB
} from "./dynamic-airborne-gate-o-building-prediction-formula-corridor";
import {
  buildGatePAirborneBuildingPredictionRuntimeCorridorContract
} from "./dynamic-airborne-gate-p-building-prediction-runtime-corridor";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AM_LANDED_GATE =
  "gate_am_personal_use_mvp_airborne_building_prediction_direct_curve_owner_contract_plan";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AM_SELECTION_STATUS =
  "gate_am_personal_use_mvp_airborne_building_prediction_direct_curve_owner_landed_no_runtime_selected_flanking_path_energy_gate_an";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AM_SELECTED_NEXT_ACTION =
  "gate_an_personal_use_mvp_airborne_building_prediction_flanking_path_energy_owner_contract_plan";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AM_SELECTED_NEXT_FILE =
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-an-airborne-building-prediction-flanking-path-energy-owner-contract.test.ts";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AM_PREVIOUS_SELECTION_STATUS =
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AL_SELECTION_STATUS;

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AM_DIRECT_CURVE_OWNER_ID =
  "direct_separating_element_frequency_curve" satisfies PersonalUseMvpCoverageSprintGateALOwnerId;

export type PersonalUseMvpCoverageSprintGateAMDirectCurveRequirementId =
  | "basis_compatible_metric_scope"
  | "frequency_band_resolution_owner"
  | "iso_717_1_rating_adapter_basis"
  | "selected_candidate_trace_owner"
  | "selected_dynamic_airborne_frequency_curve";

export type PersonalUseMvpCoverageSprintGateAMDirectCurveRejectedSignalId =
  | "field_runtime_budget"
  | "lab_rw_single_number"
  | "legacy_raw_dynamic_field_building_continuation"
  | "opening_leak_lab_adapter"
  | "source_row_single_number_without_curve"
  | "stc_single_number";

export type PersonalUseMvpCoverageSprintGateANLaneId =
  | "broad_source_crawl"
  | "building_prediction_runtime_promotion"
  | "building_prediction_uncertainty_budget_owner_contract"
  | "flanking_path_energy_owner_contract"
  | "junction_vibration_reduction_owner_contract"
  | "room_standardization_owner_contract";

export type PersonalUseMvpCoverageSprintGateAMDirectCurveOwnerContract = {
  acceptedRequirementIds: readonly PersonalUseMvpCoverageSprintGateAMDirectCurveRequirementId[];
  directCurveMustComeFrom: "selected_dynamic_airborne_family_solver_frequency_curve";
  downstreamOwnerGapsStillBlocked: readonly Exclude<
    PersonalUseMvpCoverageSprintGateALOwnerId,
    typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AM_DIRECT_CURVE_OWNER_ID
  >[];
  evidenceRowIds: readonly string[];
  gateALOwnerGap: PersonalUseMvpCoverageSprintGateALOwnerGap;
  gatePBlockerPreserved: string;
  labSingleNumberCanSatisfyDirectEnergyTerm: false;
  ownerId: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AM_DIRECT_CURVE_OWNER_ID;
  rejectedSignalIds: readonly PersonalUseMvpCoverageSprintGateAMDirectCurveRejectedSignalId[];
  requiredInputs: readonly string[];
  runtimeOwnedInGateAM: false;
  runtimePromotionAllowedInGateAM: false;
  sourceRowsRequiredForRuntimeSelection: false;
};

export type PersonalUseMvpCoverageSprintGateANLaneCandidate = {
  basisLeakageRisk: number;
  calculatorCoverageGain: number;
  evidenceOwnerIds: readonly PersonalUseMvpCoverageSprintGateALOwnerId[];
  id: PersonalUseMvpCoverageSprintGateANLaneId;
  implementationCost: number;
  prerequisiteWeight: number;
  reason: string;
  runtimePromotionRisk: number;
  score: number;
  selected: boolean;
  solverReadiness: number;
  sourceRowsRequiredForRuntimeSelection: boolean;
};

export type PersonalUseMvpCoverageSprintGateANLaneSelection = {
  candidates: readonly PersonalUseMvpCoverageSprintGateANLaneCandidate[];
  selectedCandidate: PersonalUseMvpCoverageSprintGateANLaneCandidate;
  selectedNextAction: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AM_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AM_SELECTED_NEXT_FILE;
  selectionPolicy: readonly string[];
};

export type PersonalUseMvpCoverageSprintGateAMContract = {
  directCurveOwner: PersonalUseMvpCoverageSprintGateAMDirectCurveOwnerContract;
  downstreamOwnerGapsStillBlocked: readonly Exclude<
    PersonalUseMvpCoverageSprintGateALOwnerId,
    typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AM_DIRECT_CURVE_OWNER_ID
  >[];
  gateALOwnerGapCount: 5;
  gateOToleranceDbPreserved: typeof GATE_O_AIRBORNE_BUILDING_PREDICTION_TOLERANCE_DB;
  gatePDecisionBranch: "runtime_blocked_formula_terms_not_owned";
  landedGate: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AM_LANDED_GATE;
  numericRuntimeBehaviorChange: false;
  previousLandedGate: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AL_LANDED_GATE;
  previousSelectionStatus: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AM_PREVIOUS_SELECTION_STATUS;
  runtimePromotionAllowedInGateAM: false;
  runtimeValueMovement: false;
  selectedGateANLane: PersonalUseMvpCoverageSprintGateANLaneId;
  selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1";
  selectedNextAction: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AM_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AM_SELECTED_NEXT_FILE;
  selectionStatus: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AM_SELECTION_STATUS;
  sourceRowsRequiredForRuntimeSelection: false;
};

const DIRECT_CURVE_REQUIREMENTS = [
  "selected_dynamic_airborne_frequency_curve",
  "frequency_band_resolution_owner",
  "iso_717_1_rating_adapter_basis",
  "selected_candidate_trace_owner",
  "basis_compatible_metric_scope"
] as const satisfies readonly PersonalUseMvpCoverageSprintGateAMDirectCurveRequirementId[];

const DIRECT_CURVE_REJECTED_SIGNALS = [
  "lab_rw_single_number",
  "stc_single_number",
  "source_row_single_number_without_curve",
  "field_runtime_budget",
  "opening_leak_lab_adapter",
  "legacy_raw_dynamic_field_building_continuation"
] as const satisfies readonly PersonalUseMvpCoverageSprintGateAMDirectCurveRejectedSignalId[];

const DOWNSTREAM_OWNER_GAPS_AFTER_DIRECT_CURVE = [
  "flanking_path_energy_sum",
  "junction_vibration_reduction_index",
  "room_absorption_standardization",
  "building_prediction_uncertainty_budget"
] as const satisfies readonly Exclude<
  PersonalUseMvpCoverageSprintGateALOwnerId,
  typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AM_DIRECT_CURVE_OWNER_ID
>[];

function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

function scoreLane(
  candidate: Omit<PersonalUseMvpCoverageSprintGateANLaneCandidate, "score" | "selected">
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

function findDirectCurveOwnerGap(
  ownerGaps: readonly PersonalUseMvpCoverageSprintGateALOwnerGap[]
): PersonalUseMvpCoverageSprintGateALOwnerGap {
  const directCurveOwner = ownerGaps.find(
    (gap) => gap.ownerId === PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AM_DIRECT_CURVE_OWNER_ID
  );

  if (!directCurveOwner) {
    throw new Error("Gate AM requires the Gate AL direct separating-element frequency curve owner gap.");
  }

  return directCurveOwner;
}

export function buildPersonalUseMvpCoverageSprintGateAMDirectCurveOwnerContract(
  ownerGaps: readonly PersonalUseMvpCoverageSprintGateALOwnerGap[] =
    buildPersonalUseMvpCoverageSprintGateALOwnerGapMap()
): PersonalUseMvpCoverageSprintGateAMDirectCurveOwnerContract {
  const directCurveOwner = findDirectCurveOwnerGap(ownerGaps);
  const gatePContract = buildGatePAirborneBuildingPredictionRuntimeCorridorContract();
  const gatePDecision = gatePContract.formulaTermDecisions.find(
    (decision) => decision.termId === PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AM_DIRECT_CURVE_OWNER_ID
  );

  if (!gatePDecision) {
    throw new Error("Gate AM requires the Gate P direct curve promotion blocker.");
  }

  return {
    acceptedRequirementIds: DIRECT_CURVE_REQUIREMENTS,
    directCurveMustComeFrom: "selected_dynamic_airborne_family_solver_frequency_curve",
    downstreamOwnerGapsStillBlocked: DOWNSTREAM_OWNER_GAPS_AFTER_DIRECT_CURVE,
    evidenceRowIds: directCurveOwner.evidenceRowIds,
    gateALOwnerGap: directCurveOwner,
    gatePBlockerPreserved: gatePDecision.promotionBlocker,
    labSingleNumberCanSatisfyDirectEnergyTerm: false,
    ownerId: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AM_DIRECT_CURVE_OWNER_ID,
    rejectedSignalIds: DIRECT_CURVE_REJECTED_SIGNALS,
    requiredInputs: [
      ...directCurveOwner.requiredInputs,
      "selectedCandidateTraceOwner",
      "frequencyBandResolutionOwner",
      "basisCompatibleMetricScope"
    ],
    runtimeOwnedInGateAM: false,
    runtimePromotionAllowedInGateAM: false,
    sourceRowsRequiredForRuntimeSelection: false
  };
}

export function rankPersonalUseMvpCoverageSprintGateANLanes(
  directCurveOwner: PersonalUseMvpCoverageSprintGateAMDirectCurveOwnerContract =
    buildPersonalUseMvpCoverageSprintGateAMDirectCurveOwnerContract()
): PersonalUseMvpCoverageSprintGateANLaneSelection {
  const remainingOwners = new Set(directCurveOwner.downstreamOwnerGapsStillBlocked);
  const requireRemainingOwner = (ownerId: Exclude<
    PersonalUseMvpCoverageSprintGateALOwnerId,
    typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AM_DIRECT_CURVE_OWNER_ID
  >): void => {
    if (!remainingOwners.has(ownerId)) {
      throw new Error(`Gate AN lane ranking references missing remaining owner gap ${ownerId}`);
    }
  };

  requireRemainingOwner("flanking_path_energy_sum");
  requireRemainingOwner("junction_vibration_reduction_index");
  requireRemainingOwner("room_absorption_standardization");
  requireRemainingOwner("building_prediction_uncertainty_budget");

  const candidateSeeds = [
    {
      basisLeakageRisk: 4,
      calculatorCoverageGain: 5,
      evidenceOwnerIds: ["flanking_path_energy_sum"],
      id: "flanking_path_energy_owner_contract",
      implementationCost: 5,
      prerequisiteWeight: 4,
      reason:
        "Once the direct element curve owner is defined, flanking path energy is the next highest-risk ISO 12354-1 building-prediction prerequisite.",
      runtimePromotionRisk: 2,
      solverReadiness: 3,
      sourceRowsRequiredForRuntimeSelection: false
    },
    {
      basisLeakageRisk: 6,
      calculatorCoverageGain: 4,
      evidenceOwnerIds: ["junction_vibration_reduction_index"],
      id: "junction_vibration_reduction_owner_contract",
      implementationCost: 5,
      prerequisiteWeight: 3,
      reason:
        "Junction vibration reduction depends on named flanking paths and coupling surfaces, so it should follow flanking energy ownership.",
      runtimePromotionRisk: 3,
      solverReadiness: 2,
      sourceRowsRequiredForRuntimeSelection: false
    },
    {
      basisLeakageRisk: 3,
      calculatorCoverageGain: 4,
      evidenceOwnerIds: ["room_absorption_standardization"],
      id: "room_standardization_owner_contract",
      implementationCost: 4,
      prerequisiteWeight: 2,
      reason:
        "Room standardization is necessary for DnT,w but cannot promote building runtime while flanking and junction terms are unowned.",
      runtimePromotionRisk: 1,
      solverReadiness: 3,
      sourceRowsRequiredForRuntimeSelection: false
    },
    {
      basisLeakageRisk: 4,
      calculatorCoverageGain: 3,
      evidenceOwnerIds: ["building_prediction_uncertainty_budget"],
      id: "building_prediction_uncertainty_budget_owner_contract",
      implementationCost: 3,
      prerequisiteWeight: 2,
      reason:
        "The +/-9 dB budget needs a decomposition, but uncertainty ownership should trail the direct/flanking/junction physical terms.",
      runtimePromotionRisk: 2,
      solverReadiness: 3,
      sourceRowsRequiredForRuntimeSelection: false
    },
    {
      basisLeakageRisk: 9,
      calculatorCoverageGain: 8,
      evidenceOwnerIds: [
        "flanking_path_energy_sum",
        "junction_vibration_reduction_index",
        "room_absorption_standardization",
        "building_prediction_uncertainty_budget"
      ],
      id: "building_prediction_runtime_promotion",
      implementationCost: 8,
      prerequisiteWeight: 5,
      reason:
        "Runtime promotion remains blocked because Gate AM only defines the direct curve owner contract.",
      runtimePromotionRisk: 9,
      solverReadiness: 0,
      sourceRowsRequiredForRuntimeSelection: false
    },
    {
      basisLeakageRisk: 8,
      calculatorCoverageGain: 2,
      evidenceOwnerIds: ["flanking_path_energy_sum"],
      id: "broad_source_crawl",
      implementationCost: 9,
      prerequisiteWeight: 1,
      reason:
        "Broad source crawling does not produce the named source-absent flanking-energy owner needed by the calculator path.",
      runtimePromotionRisk: 8,
      solverReadiness: 1,
      sourceRowsRequiredForRuntimeSelection: true
    }
  ] as const satisfies readonly Omit<PersonalUseMvpCoverageSprintGateANLaneCandidate, "score" | "selected">[];
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
    throw new Error("Personal-use MVP Coverage Sprint Gate AM requires a Gate AN lane candidate.");
  }

  const candidates = candidatesWithoutSelection.map((candidate) => ({
    ...candidate,
    selected: candidate.id === selected.id
  }));
  const selectedCandidate = candidates.find((candidate) => candidate.selected);

  if (!selectedCandidate) {
    throw new Error("Personal-use MVP Coverage Sprint Gate AM did not mark a selected Gate AN lane.");
  }

  return {
    candidates,
    selectedCandidate,
    selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AM_SELECTED_NEXT_ACTION,
    selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AM_SELECTED_NEXT_FILE,
    selectionPolicy: [
      "keep Gate AM no-runtime: direct curve ownership does not promote building R'w or DnT,w",
      "score coverage_gain * prerequisite_weight * solver_readiness / (implementation_cost + basis_leakage_risk + runtime_promotion_risk + 1)",
      "select flanking path energy after the direct element curve owner because building prediction needs both direct and indirect energy terms",
      "reject broad source crawling and direct runtime promotion while downstream Gate AL owners remain unowned"
    ]
  };
}

export function buildPersonalUseMvpCoverageSprintGateAMContract(): PersonalUseMvpCoverageSprintGateAMContract {
  const gateALContract = buildPersonalUseMvpCoverageSprintGateALContract();
  const gatePContract = buildGatePAirborneBuildingPredictionRuntimeCorridorContract();
  const directCurveOwner = buildPersonalUseMvpCoverageSprintGateAMDirectCurveOwnerContract(
    gateALContract.ownerGaps
  );
  const laneSelection = rankPersonalUseMvpCoverageSprintGateANLanes(directCurveOwner);

  return {
    directCurveOwner,
    downstreamOwnerGapsStillBlocked: directCurveOwner.downstreamOwnerGapsStillBlocked,
    gateALOwnerGapCount: gateALContract.ownerGaps.length as 5,
    gateOToleranceDbPreserved: GATE_O_AIRBORNE_BUILDING_PREDICTION_TOLERANCE_DB,
    gatePDecisionBranch: gatePContract.decisionBranch,
    landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AM_LANDED_GATE,
    numericRuntimeBehaviorChange: false,
    previousLandedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AL_LANDED_GATE,
    previousSelectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AM_PREVIOUS_SELECTION_STATUS,
    runtimePromotionAllowedInGateAM: false,
    runtimeValueMovement: false,
    selectedGateANLane: laneSelection.selectedCandidate.id,
    selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
    selectedNextAction: laneSelection.selectedNextAction,
    selectedNextFile: laneSelection.selectedNextFile,
    selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AM_SELECTION_STATUS,
    sourceRowsRequiredForRuntimeSelection: false
  };
}
