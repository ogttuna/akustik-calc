import {
  buildPersonalUseMvpCoverageSprintGateALOwnerGapMap,
  type PersonalUseMvpCoverageSprintGateALOwnerGap,
  type PersonalUseMvpCoverageSprintGateALOwnerId
} from "./calculator-personal-use-mvp-coverage-sprint-gate-al";
import {
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AM_DIRECT_CURVE_OWNER_ID
} from "./calculator-personal-use-mvp-coverage-sprint-gate-am";
import {
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AN_FLANKING_OWNER_ID
} from "./calculator-personal-use-mvp-coverage-sprint-gate-an";
import {
  buildPersonalUseMvpCoverageSprintGateAOContract,
  buildPersonalUseMvpCoverageSprintGateAOJunctionVibrationOwnerContract,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AO_JUNCTION_OWNER_ID,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AO_LANDED_GATE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AO_SELECTION_STATUS,
  type PersonalUseMvpCoverageSprintGateAOJunctionVibrationOwnerContract
} from "./calculator-personal-use-mvp-coverage-sprint-gate-ao";
import {
  GATE_O_AIRBORNE_BUILDING_PREDICTION_TOLERANCE_DB
} from "./dynamic-airborne-gate-o-building-prediction-formula-corridor";
import {
  buildGatePAirborneBuildingPredictionRuntimeCorridorContract
} from "./dynamic-airborne-gate-p-building-prediction-runtime-corridor";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AP_LANDED_GATE =
  "gate_ap_personal_use_mvp_airborne_building_prediction_room_standardization_owner_contract_plan";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AP_SELECTION_STATUS =
  "gate_ap_personal_use_mvp_airborne_building_prediction_room_standardization_owner_landed_no_runtime_selected_uncertainty_budget_gate_aq";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AP_SELECTED_NEXT_ACTION =
  "gate_aq_personal_use_mvp_airborne_building_prediction_uncertainty_budget_owner_contract_plan";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AP_SELECTED_NEXT_FILE =
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-aq-airborne-building-prediction-uncertainty-budget-owner-contract.test.ts";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AP_PREVIOUS_SELECTION_STATUS =
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AO_SELECTION_STATUS;

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AP_ROOM_OWNER_ID =
  "room_absorption_standardization" satisfies PersonalUseMvpCoverageSprintGateALOwnerId;

export type PersonalUseMvpCoverageSprintGateAPRoomRequirementId =
  | "basis_compatible_metric_scope"
  | "basis_compatible_room_absorption_owner"
  | "building_standardization_basis_owner"
  | "junction_vibration_owner_dependency"
  | "receiving_room_rt60_owner"
  | "receiving_room_volume_owner"
  | "separating_element_area_owner";

export type PersonalUseMvpCoverageSprintGateAPRoomRejectedSignalId =
  | "apparent_r_prime_w_relabelled_as_dntw"
  | "direct_flanking_junction_without_room_standardization"
  | "field_room_correction_alias"
  | "generic_room_label_without_rt60_or_volume"
  | "lab_rw_single_number"
  | "legacy_raw_dynamic_field_building_continuation"
  | "opening_leak_lab_adapter"
  | "source_row_single_number_without_room_terms"
  | "stc_single_number";

export type PersonalUseMvpCoverageSprintGateAQLaneId =
  | "broad_source_crawl"
  | "building_prediction_runtime_promotion"
  | "building_prediction_uncertainty_budget_owner_contract";

export type PersonalUseMvpCoverageSprintGateAPRoomStandardizationOwnerContract = {
  acceptedRequirementIds: readonly PersonalUseMvpCoverageSprintGateAPRoomRequirementId[];
  directFlankingJunctionOwnersAloneCanPromoteBuildingRuntime: false;
  downstreamOwnerGapsStillBlocked: readonly Exclude<
    PersonalUseMvpCoverageSprintGateALOwnerId,
    | typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AM_DIRECT_CURVE_OWNER_ID
    | typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AN_FLANKING_OWNER_ID
    | typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AO_JUNCTION_OWNER_ID
    | typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AP_ROOM_OWNER_ID
  >[];
  evidenceRowIds: readonly string[];
  gateALOwnerGap: PersonalUseMvpCoverageSprintGateALOwnerGap;
  gatePBlockerPreserved: string;
  genericRoomLabelCanSatisfyStandardization: false;
  junctionVibrationOwnerDependency: PersonalUseMvpCoverageSprintGateAOJunctionVibrationOwnerContract;
  ownerId: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AP_ROOM_OWNER_ID;
  rejectedSignalIds: readonly PersonalUseMvpCoverageSprintGateAPRoomRejectedSignalId[];
  requiredInputs: readonly string[];
  roomStandardizationMustComeFrom: "basis_compatible_receiving_room_absorption_standardization_for_iso_12354_1_building_prediction";
  runtimeOwnedInGateAP: false;
  runtimePromotionAllowedInGateAP: false;
  sourceRowsRequiredForRuntimeSelection: false;
};

export type PersonalUseMvpCoverageSprintGateAQLaneCandidate = {
  basisLeakageRisk: number;
  calculatorCoverageGain: number;
  evidenceOwnerIds: readonly PersonalUseMvpCoverageSprintGateALOwnerId[];
  id: PersonalUseMvpCoverageSprintGateAQLaneId;
  implementationCost: number;
  prerequisiteWeight: number;
  reason: string;
  runtimePromotionRisk: number;
  score: number;
  selected: boolean;
  solverReadiness: number;
  sourceRowsRequiredForRuntimeSelection: boolean;
};

export type PersonalUseMvpCoverageSprintGateAQLaneSelection = {
  candidates: readonly PersonalUseMvpCoverageSprintGateAQLaneCandidate[];
  selectedCandidate: PersonalUseMvpCoverageSprintGateAQLaneCandidate;
  selectedNextAction: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AP_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AP_SELECTED_NEXT_FILE;
  selectionPolicy: readonly string[];
};

export type PersonalUseMvpCoverageSprintGateAPContract = {
  directCurveOwnerPreserved: true;
  downstreamOwnerGapsStillBlocked: readonly Exclude<
    PersonalUseMvpCoverageSprintGateALOwnerId,
    | typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AM_DIRECT_CURVE_OWNER_ID
    | typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AN_FLANKING_OWNER_ID
    | typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AO_JUNCTION_OWNER_ID
    | typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AP_ROOM_OWNER_ID
  >[];
  flankingPathEnergyOwnerPreserved: true;
  gateALOwnerGapCount: 5;
  gateOToleranceDbPreserved: typeof GATE_O_AIRBORNE_BUILDING_PREDICTION_TOLERANCE_DB;
  gatePDecisionBranch: "runtime_blocked_formula_terms_not_owned";
  junctionVibrationOwnerPreserved: true;
  landedGate: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AP_LANDED_GATE;
  numericRuntimeBehaviorChange: false;
  previousLandedGate: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AO_LANDED_GATE;
  previousSelectionStatus: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AP_PREVIOUS_SELECTION_STATUS;
  roomStandardizationOwner: PersonalUseMvpCoverageSprintGateAPRoomStandardizationOwnerContract;
  runtimePromotionAllowedInGateAP: false;
  runtimeValueMovement: false;
  selectedGateAQLane: PersonalUseMvpCoverageSprintGateAQLaneId;
  selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1";
  selectedNextAction: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AP_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AP_SELECTED_NEXT_FILE;
  selectionStatus: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AP_SELECTION_STATUS;
  sourceRowsRequiredForRuntimeSelection: false;
};

const ROOM_STANDARDIZATION_REQUIREMENTS = [
  "junction_vibration_owner_dependency",
  "separating_element_area_owner",
  "receiving_room_volume_owner",
  "receiving_room_rt60_owner",
  "building_standardization_basis_owner",
  "basis_compatible_room_absorption_owner",
  "basis_compatible_metric_scope"
] as const satisfies readonly PersonalUseMvpCoverageSprintGateAPRoomRequirementId[];

const ROOM_STANDARDIZATION_REJECTED_SIGNALS = [
  "direct_flanking_junction_without_room_standardization",
  "generic_room_label_without_rt60_or_volume",
  "apparent_r_prime_w_relabelled_as_dntw",
  "lab_rw_single_number",
  "stc_single_number",
  "source_row_single_number_without_room_terms",
  "field_room_correction_alias",
  "opening_leak_lab_adapter",
  "legacy_raw_dynamic_field_building_continuation"
] as const satisfies readonly PersonalUseMvpCoverageSprintGateAPRoomRejectedSignalId[];

const DOWNSTREAM_OWNER_GAPS_AFTER_ROOM_STANDARDIZATION = [
  "building_prediction_uncertainty_budget"
] as const satisfies readonly Exclude<
  PersonalUseMvpCoverageSprintGateALOwnerId,
  | typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AM_DIRECT_CURVE_OWNER_ID
  | typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AN_FLANKING_OWNER_ID
  | typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AO_JUNCTION_OWNER_ID
  | typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AP_ROOM_OWNER_ID
>[];

function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

function scoreLane(
  candidate: Omit<PersonalUseMvpCoverageSprintGateAQLaneCandidate, "score" | "selected">
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

function findRoomOwnerGap(
  ownerGaps: readonly PersonalUseMvpCoverageSprintGateALOwnerGap[]
): PersonalUseMvpCoverageSprintGateALOwnerGap {
  const roomOwner = ownerGaps.find(
    (gap) => gap.ownerId === PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AP_ROOM_OWNER_ID
  );

  if (!roomOwner) {
    throw new Error("Gate AP requires the Gate AL room absorption standardization owner gap.");
  }

  return roomOwner;
}

export function buildPersonalUseMvpCoverageSprintGateAPRoomStandardizationOwnerContract(input?: {
  junctionVibrationOwner?: PersonalUseMvpCoverageSprintGateAOJunctionVibrationOwnerContract;
  ownerGaps?: readonly PersonalUseMvpCoverageSprintGateALOwnerGap[];
}): PersonalUseMvpCoverageSprintGateAPRoomStandardizationOwnerContract {
  const ownerGaps = input?.ownerGaps ?? buildPersonalUseMvpCoverageSprintGateALOwnerGapMap();
  const junctionVibrationOwner =
    input?.junctionVibrationOwner ??
    buildPersonalUseMvpCoverageSprintGateAOJunctionVibrationOwnerContract({ ownerGaps });
  const roomOwner = findRoomOwnerGap(ownerGaps);
  const gatePContract = buildGatePAirborneBuildingPredictionRuntimeCorridorContract();
  const gatePDecision = gatePContract.formulaTermDecisions.find(
    (decision) => decision.termId === PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AP_ROOM_OWNER_ID
  );

  if (!gatePDecision) {
    throw new Error("Gate AP requires the Gate P room standardization promotion blocker.");
  }

  return {
    acceptedRequirementIds: ROOM_STANDARDIZATION_REQUIREMENTS,
    directFlankingJunctionOwnersAloneCanPromoteBuildingRuntime: false,
    downstreamOwnerGapsStillBlocked: DOWNSTREAM_OWNER_GAPS_AFTER_ROOM_STANDARDIZATION,
    evidenceRowIds: roomOwner.evidenceRowIds,
    gateALOwnerGap: roomOwner,
    gatePBlockerPreserved: gatePDecision.promotionBlocker,
    genericRoomLabelCanSatisfyStandardization: false,
    junctionVibrationOwnerDependency: junctionVibrationOwner,
    ownerId: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AP_ROOM_OWNER_ID,
    rejectedSignalIds: ROOM_STANDARDIZATION_REJECTED_SIGNALS,
    requiredInputs: [
      ...roomOwner.requiredInputs,
      "separatingElementAreaOwner",
      "receivingRoomVolumeOwner",
      "receivingRoomRt60Owner",
      "buildingStandardizationBasisOwner",
      "basisCompatibleRoomAbsorptionOwner",
      "basisCompatibleMetricScope"
    ],
    roomStandardizationMustComeFrom:
      "basis_compatible_receiving_room_absorption_standardization_for_iso_12354_1_building_prediction",
    runtimeOwnedInGateAP: false,
    runtimePromotionAllowedInGateAP: false,
    sourceRowsRequiredForRuntimeSelection: false
  };
}

export function rankPersonalUseMvpCoverageSprintGateAQLanes(
  roomStandardizationOwner: PersonalUseMvpCoverageSprintGateAPRoomStandardizationOwnerContract =
    buildPersonalUseMvpCoverageSprintGateAPRoomStandardizationOwnerContract()
): PersonalUseMvpCoverageSprintGateAQLaneSelection {
  const remainingOwners = new Set(roomStandardizationOwner.downstreamOwnerGapsStillBlocked);
  const requireRemainingOwner = (ownerId: Exclude<
    PersonalUseMvpCoverageSprintGateALOwnerId,
    | typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AM_DIRECT_CURVE_OWNER_ID
    | typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AN_FLANKING_OWNER_ID
    | typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AO_JUNCTION_OWNER_ID
    | typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AP_ROOM_OWNER_ID
  >): void => {
    if (!remainingOwners.has(ownerId)) {
      throw new Error(`Gate AQ lane ranking references missing remaining owner gap ${ownerId}`);
    }
  };

  requireRemainingOwner("building_prediction_uncertainty_budget");

  const candidateSeeds = [
    {
      basisLeakageRisk: 3,
      calculatorCoverageGain: 4,
      evidenceOwnerIds: ["building_prediction_uncertainty_budget"],
      id: "building_prediction_uncertainty_budget_owner_contract",
      implementationCost: 4,
      prerequisiteWeight: 4,
      reason:
        "After direct, flanking, junction, and room standardization ownership, the +/-9 dB building-prediction uncertainty budget is the last owner before a runtime corridor can be reconsidered.",
      runtimePromotionRisk: 2,
      solverReadiness: 3,
      sourceRowsRequiredForRuntimeSelection: false
    },
    {
      basisLeakageRisk: 9,
      calculatorCoverageGain: 8,
      evidenceOwnerIds: ["building_prediction_uncertainty_budget"],
      id: "building_prediction_runtime_promotion",
      implementationCost: 8,
      prerequisiteWeight: 5,
      reason:
        "Runtime promotion remains blocked because Gate AP only defines room standardization ownership; uncertainty ownership is still missing.",
      runtimePromotionRisk: 9,
      solverReadiness: 0,
      sourceRowsRequiredForRuntimeSelection: false
    },
    {
      basisLeakageRisk: 8,
      calculatorCoverageGain: 2,
      evidenceOwnerIds: ["building_prediction_uncertainty_budget"],
      id: "broad_source_crawl",
      implementationCost: 9,
      prerequisiteWeight: 1,
      reason:
        "Broad source crawling does not produce the source-absent uncertainty owner needed before building runtime can be reconsidered.",
      runtimePromotionRisk: 8,
      solverReadiness: 1,
      sourceRowsRequiredForRuntimeSelection: true
    }
  ] as const satisfies readonly Omit<PersonalUseMvpCoverageSprintGateAQLaneCandidate, "score" | "selected">[];
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
    throw new Error("Personal-use MVP Coverage Sprint Gate AP requires a Gate AQ lane candidate.");
  }

  const candidates = candidatesWithoutSelection.map((candidate) => ({
    ...candidate,
    selected: candidate.id === selected.id
  }));
  const selectedCandidate = candidates.find((candidate) => candidate.selected);

  if (!selectedCandidate) {
    throw new Error("Personal-use MVP Coverage Sprint Gate AP did not mark a selected Gate AQ lane.");
  }

  return {
    candidates,
    selectedCandidate,
    selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AP_SELECTED_NEXT_ACTION,
    selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AP_SELECTED_NEXT_FILE,
    selectionPolicy: [
      "keep Gate AP no-runtime: room standardization ownership does not promote building R'w or DnT,w",
      "score coverage_gain * prerequisite_weight * solver_readiness / (implementation_cost + basis_leakage_risk + runtime_promotion_risk + 1)",
      "select uncertainty-budget ownership after direct, flanking, junction, and room physical owners are defined",
      "reject broad source crawling and direct runtime promotion while the Gate AL uncertainty owner remains unowned"
    ]
  };
}

export function buildPersonalUseMvpCoverageSprintGateAPContract(): PersonalUseMvpCoverageSprintGateAPContract {
  const gateAOContract = buildPersonalUseMvpCoverageSprintGateAOContract();
  const gatePContract = buildGatePAirborneBuildingPredictionRuntimeCorridorContract();
  const ownerGaps = buildPersonalUseMvpCoverageSprintGateALOwnerGapMap();
  const roomStandardizationOwner = buildPersonalUseMvpCoverageSprintGateAPRoomStandardizationOwnerContract({
    junctionVibrationOwner: gateAOContract.junctionVibrationOwner,
    ownerGaps
  });
  const laneSelection = rankPersonalUseMvpCoverageSprintGateAQLanes(roomStandardizationOwner);

  return {
    directCurveOwnerPreserved: true,
    downstreamOwnerGapsStillBlocked: roomStandardizationOwner.downstreamOwnerGapsStillBlocked,
    flankingPathEnergyOwnerPreserved: true,
    gateALOwnerGapCount: gateAOContract.gateALOwnerGapCount,
    gateOToleranceDbPreserved: GATE_O_AIRBORNE_BUILDING_PREDICTION_TOLERANCE_DB,
    gatePDecisionBranch: gatePContract.decisionBranch,
    junctionVibrationOwnerPreserved: true,
    landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AP_LANDED_GATE,
    numericRuntimeBehaviorChange: false,
    previousLandedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AO_LANDED_GATE,
    previousSelectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AP_PREVIOUS_SELECTION_STATUS,
    roomStandardizationOwner,
    runtimePromotionAllowedInGateAP: false,
    runtimeValueMovement: false,
    selectedGateAQLane: laneSelection.selectedCandidate.id,
    selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
    selectedNextAction: laneSelection.selectedNextAction,
    selectedNextFile: laneSelection.selectedNextFile,
    selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AP_SELECTION_STATUS,
    sourceRowsRequiredForRuntimeSelection: false
  };
}
