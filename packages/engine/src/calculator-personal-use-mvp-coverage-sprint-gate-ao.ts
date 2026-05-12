import {
  buildPersonalUseMvpCoverageSprintGateALOwnerGapMap,
  type PersonalUseMvpCoverageSprintGateALOwnerGap,
  type PersonalUseMvpCoverageSprintGateALOwnerId
} from "./calculator-personal-use-mvp-coverage-sprint-gate-al";
import {
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AM_DIRECT_CURVE_OWNER_ID
} from "./calculator-personal-use-mvp-coverage-sprint-gate-am";
import {
  buildPersonalUseMvpCoverageSprintGateANContract,
  buildPersonalUseMvpCoverageSprintGateANFlankingPathEnergyOwnerContract,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AN_FLANKING_OWNER_ID,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AN_LANDED_GATE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AN_SELECTION_STATUS,
  type PersonalUseMvpCoverageSprintGateANFlankingPathEnergyOwnerContract
} from "./calculator-personal-use-mvp-coverage-sprint-gate-an";
import {
  GATE_O_AIRBORNE_BUILDING_PREDICTION_TOLERANCE_DB
} from "./dynamic-airborne-gate-o-building-prediction-formula-corridor";
import {
  buildGatePAirborneBuildingPredictionRuntimeCorridorContract
} from "./dynamic-airborne-gate-p-building-prediction-runtime-corridor";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AO_LANDED_GATE =
  "gate_ao_personal_use_mvp_airborne_building_prediction_junction_vibration_owner_contract_plan";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AO_SELECTION_STATUS =
  "gate_ao_personal_use_mvp_airborne_building_prediction_junction_vibration_owner_landed_no_runtime_selected_room_standardization_gate_ap";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AO_SELECTED_NEXT_ACTION =
  "gate_ap_personal_use_mvp_airborne_building_prediction_room_standardization_owner_contract_plan";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AO_SELECTED_NEXT_FILE =
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ap-airborne-building-prediction-room-standardization-owner-contract.test.ts";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AO_PREVIOUS_SELECTION_STATUS =
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AN_SELECTION_STATUS;

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AO_JUNCTION_OWNER_ID =
  "junction_vibration_reduction_index" satisfies PersonalUseMvpCoverageSprintGateALOwnerId;

export type PersonalUseMvpCoverageSprintGateAOJunctionRequirementId =
  | "basis_compatible_metric_scope"
  | "basis_compatible_vibration_reduction_index_owner"
  | "coupling_length_owner"
  | "explicit_junction_class_owner"
  | "flanking_path_energy_owner_dependency"
  | "path_specific_junction_coupling_owner";

export type PersonalUseMvpCoverageSprintGateAOJunctionRejectedSignalId =
  | "direct_and_flanking_only_without_junction_index"
  | "field_runtime_budget"
  | "generic_junction_class_without_reduction_index"
  | "lab_rw_single_number"
  | "legacy_raw_dynamic_field_building_continuation"
  | "opening_leak_lab_adapter"
  | "source_row_single_number_without_junction_terms"
  | "stc_single_number";

export type PersonalUseMvpCoverageSprintGateAPLaneId =
  | "broad_source_crawl"
  | "building_prediction_runtime_promotion"
  | "building_prediction_uncertainty_budget_owner_contract"
  | "room_standardization_owner_contract";

export type PersonalUseMvpCoverageSprintGateAOJunctionVibrationOwnerContract = {
  acceptedRequirementIds: readonly PersonalUseMvpCoverageSprintGateAOJunctionRequirementId[];
  directAndFlankingOwnersAloneCanPromoteBuildingRuntime: false;
  downstreamOwnerGapsStillBlocked: readonly Exclude<
    PersonalUseMvpCoverageSprintGateALOwnerId,
    | typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AM_DIRECT_CURVE_OWNER_ID
    | typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AN_FLANKING_OWNER_ID
    | typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AO_JUNCTION_OWNER_ID
  >[];
  evidenceRowIds: readonly string[];
  flankingPathEnergyOwnerDependency: PersonalUseMvpCoverageSprintGateANFlankingPathEnergyOwnerContract;
  gateALOwnerGap: PersonalUseMvpCoverageSprintGateALOwnerGap;
  gatePBlockerPreserved: string;
  genericJunctionClassCanSatisfyVibrationReduction: false;
  junctionVibrationMustComeFrom: "basis_compatible_junction_vibration_reduction_index_for_iso_12354_1_building_prediction";
  ownerId: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AO_JUNCTION_OWNER_ID;
  rejectedSignalIds: readonly PersonalUseMvpCoverageSprintGateAOJunctionRejectedSignalId[];
  requiredInputs: readonly string[];
  runtimeOwnedInGateAO: false;
  runtimePromotionAllowedInGateAO: false;
  sourceRowsRequiredForRuntimeSelection: false;
};

export type PersonalUseMvpCoverageSprintGateAPLaneCandidate = {
  basisLeakageRisk: number;
  calculatorCoverageGain: number;
  evidenceOwnerIds: readonly PersonalUseMvpCoverageSprintGateALOwnerId[];
  id: PersonalUseMvpCoverageSprintGateAPLaneId;
  implementationCost: number;
  prerequisiteWeight: number;
  reason: string;
  runtimePromotionRisk: number;
  score: number;
  selected: boolean;
  solverReadiness: number;
  sourceRowsRequiredForRuntimeSelection: boolean;
};

export type PersonalUseMvpCoverageSprintGateAPLaneSelection = {
  candidates: readonly PersonalUseMvpCoverageSprintGateAPLaneCandidate[];
  selectedCandidate: PersonalUseMvpCoverageSprintGateAPLaneCandidate;
  selectedNextAction: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AO_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AO_SELECTED_NEXT_FILE;
  selectionPolicy: readonly string[];
};

export type PersonalUseMvpCoverageSprintGateAOContract = {
  directCurveOwnerPreserved: true;
  downstreamOwnerGapsStillBlocked: readonly Exclude<
    PersonalUseMvpCoverageSprintGateALOwnerId,
    | typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AM_DIRECT_CURVE_OWNER_ID
    | typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AN_FLANKING_OWNER_ID
    | typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AO_JUNCTION_OWNER_ID
  >[];
  flankingPathEnergyOwnerPreserved: true;
  gateALOwnerGapCount: 5;
  gateOToleranceDbPreserved: typeof GATE_O_AIRBORNE_BUILDING_PREDICTION_TOLERANCE_DB;
  gatePDecisionBranch: "runtime_blocked_formula_terms_not_owned";
  junctionVibrationOwner: PersonalUseMvpCoverageSprintGateAOJunctionVibrationOwnerContract;
  landedGate: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AO_LANDED_GATE;
  numericRuntimeBehaviorChange: false;
  previousLandedGate: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AN_LANDED_GATE;
  previousSelectionStatus: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AO_PREVIOUS_SELECTION_STATUS;
  runtimePromotionAllowedInGateAO: false;
  runtimeValueMovement: false;
  selectedGateAPLane: PersonalUseMvpCoverageSprintGateAPLaneId;
  selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1";
  selectedNextAction: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AO_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AO_SELECTED_NEXT_FILE;
  selectionStatus: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AO_SELECTION_STATUS;
  sourceRowsRequiredForRuntimeSelection: false;
};

const JUNCTION_VIBRATION_REQUIREMENTS = [
  "flanking_path_energy_owner_dependency",
  "explicit_junction_class_owner",
  "coupling_length_owner",
  "basis_compatible_vibration_reduction_index_owner",
  "path_specific_junction_coupling_owner",
  "basis_compatible_metric_scope"
] as const satisfies readonly PersonalUseMvpCoverageSprintGateAOJunctionRequirementId[];

const JUNCTION_VIBRATION_REJECTED_SIGNALS = [
  "direct_and_flanking_only_without_junction_index",
  "generic_junction_class_without_reduction_index",
  "lab_rw_single_number",
  "stc_single_number",
  "source_row_single_number_without_junction_terms",
  "field_runtime_budget",
  "opening_leak_lab_adapter",
  "legacy_raw_dynamic_field_building_continuation"
] as const satisfies readonly PersonalUseMvpCoverageSprintGateAOJunctionRejectedSignalId[];

const DOWNSTREAM_OWNER_GAPS_AFTER_JUNCTION_VIBRATION = [
  "room_absorption_standardization",
  "building_prediction_uncertainty_budget"
] as const satisfies readonly Exclude<
  PersonalUseMvpCoverageSprintGateALOwnerId,
  | typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AM_DIRECT_CURVE_OWNER_ID
  | typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AN_FLANKING_OWNER_ID
  | typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AO_JUNCTION_OWNER_ID
>[];

function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

function scoreLane(
  candidate: Omit<PersonalUseMvpCoverageSprintGateAPLaneCandidate, "score" | "selected">
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

function findJunctionOwnerGap(
  ownerGaps: readonly PersonalUseMvpCoverageSprintGateALOwnerGap[]
): PersonalUseMvpCoverageSprintGateALOwnerGap {
  const junctionOwner = ownerGaps.find(
    (gap) => gap.ownerId === PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AO_JUNCTION_OWNER_ID
  );

  if (!junctionOwner) {
    throw new Error("Gate AO requires the Gate AL junction vibration reduction owner gap.");
  }

  return junctionOwner;
}

export function buildPersonalUseMvpCoverageSprintGateAOJunctionVibrationOwnerContract(input?: {
  flankingPathEnergyOwner?: PersonalUseMvpCoverageSprintGateANFlankingPathEnergyOwnerContract;
  ownerGaps?: readonly PersonalUseMvpCoverageSprintGateALOwnerGap[];
}): PersonalUseMvpCoverageSprintGateAOJunctionVibrationOwnerContract {
  const ownerGaps = input?.ownerGaps ?? buildPersonalUseMvpCoverageSprintGateALOwnerGapMap();
  const flankingPathEnergyOwner =
    input?.flankingPathEnergyOwner ??
    buildPersonalUseMvpCoverageSprintGateANFlankingPathEnergyOwnerContract({ ownerGaps });
  const junctionOwner = findJunctionOwnerGap(ownerGaps);
  const gatePContract = buildGatePAirborneBuildingPredictionRuntimeCorridorContract();
  const gatePDecision = gatePContract.formulaTermDecisions.find(
    (decision) => decision.termId === PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AO_JUNCTION_OWNER_ID
  );

  if (!gatePDecision) {
    throw new Error("Gate AO requires the Gate P junction vibration promotion blocker.");
  }

  return {
    acceptedRequirementIds: JUNCTION_VIBRATION_REQUIREMENTS,
    directAndFlankingOwnersAloneCanPromoteBuildingRuntime: false,
    downstreamOwnerGapsStillBlocked: DOWNSTREAM_OWNER_GAPS_AFTER_JUNCTION_VIBRATION,
    evidenceRowIds: junctionOwner.evidenceRowIds,
    flankingPathEnergyOwnerDependency: flankingPathEnergyOwner,
    gateALOwnerGap: junctionOwner,
    gatePBlockerPreserved: gatePDecision.promotionBlocker,
    genericJunctionClassCanSatisfyVibrationReduction: false,
    junctionVibrationMustComeFrom:
      "basis_compatible_junction_vibration_reduction_index_for_iso_12354_1_building_prediction",
    ownerId: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AO_JUNCTION_OWNER_ID,
    rejectedSignalIds: JUNCTION_VIBRATION_REJECTED_SIGNALS,
    requiredInputs: [
      ...junctionOwner.requiredInputs,
      "explicitJunctionClassOwner",
      "junctionCouplingLengthOwner",
      "basisCompatibleVibrationReductionIndexOwner",
      "pathSpecificJunctionCouplingOwner",
      "basisCompatibleMetricScope"
    ],
    runtimeOwnedInGateAO: false,
    runtimePromotionAllowedInGateAO: false,
    sourceRowsRequiredForRuntimeSelection: false
  };
}

export function rankPersonalUseMvpCoverageSprintGateAPLanes(
  junctionVibrationOwner: PersonalUseMvpCoverageSprintGateAOJunctionVibrationOwnerContract =
    buildPersonalUseMvpCoverageSprintGateAOJunctionVibrationOwnerContract()
): PersonalUseMvpCoverageSprintGateAPLaneSelection {
  const remainingOwners = new Set(junctionVibrationOwner.downstreamOwnerGapsStillBlocked);
  const requireRemainingOwner = (ownerId: Exclude<
    PersonalUseMvpCoverageSprintGateALOwnerId,
    | typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AM_DIRECT_CURVE_OWNER_ID
    | typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AN_FLANKING_OWNER_ID
    | typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AO_JUNCTION_OWNER_ID
  >): void => {
    if (!remainingOwners.has(ownerId)) {
      throw new Error(`Gate AP lane ranking references missing remaining owner gap ${ownerId}`);
    }
  };

  requireRemainingOwner("room_absorption_standardization");
  requireRemainingOwner("building_prediction_uncertainty_budget");

  const candidateSeeds = [
    {
      basisLeakageRisk: 4,
      calculatorCoverageGain: 5,
      evidenceOwnerIds: ["room_absorption_standardization"],
      id: "room_standardization_owner_contract",
      implementationCost: 5,
      prerequisiteWeight: 4,
      reason:
        "After direct, flanking, and junction ownership, room standardization is the next physical term needed to separate R'w from DnT,w building outputs.",
      runtimePromotionRisk: 2,
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
        "The +/-9 dB budget must remain visible, but it should trail direct, flanking, junction, and room physical owners.",
      runtimePromotionRisk: 2,
      solverReadiness: 3,
      sourceRowsRequiredForRuntimeSelection: false
    },
    {
      basisLeakageRisk: 9,
      calculatorCoverageGain: 8,
      evidenceOwnerIds: [
        "room_absorption_standardization",
        "building_prediction_uncertainty_budget"
      ],
      id: "building_prediction_runtime_promotion",
      implementationCost: 8,
      prerequisiteWeight: 5,
      reason:
        "Runtime promotion remains blocked because Gate AO only defines junction vibration ownership.",
      runtimePromotionRisk: 9,
      solverReadiness: 0,
      sourceRowsRequiredForRuntimeSelection: false
    },
    {
      basisLeakageRisk: 8,
      calculatorCoverageGain: 2,
      evidenceOwnerIds: ["room_absorption_standardization"],
      id: "broad_source_crawl",
      implementationCost: 9,
      prerequisiteWeight: 1,
      reason:
        "Broad source crawling does not produce the room standardization owner needed by the source-absent building formula path.",
      runtimePromotionRisk: 8,
      solverReadiness: 1,
      sourceRowsRequiredForRuntimeSelection: true
    }
  ] as const satisfies readonly Omit<PersonalUseMvpCoverageSprintGateAPLaneCandidate, "score" | "selected">[];
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
    throw new Error("Personal-use MVP Coverage Sprint Gate AO requires a Gate AP lane candidate.");
  }

  const candidates = candidatesWithoutSelection.map((candidate) => ({
    ...candidate,
    selected: candidate.id === selected.id
  }));
  const selectedCandidate = candidates.find((candidate) => candidate.selected);

  if (!selectedCandidate) {
    throw new Error("Personal-use MVP Coverage Sprint Gate AO did not mark a selected Gate AP lane.");
  }

  return {
    candidates,
    selectedCandidate,
    selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AO_SELECTED_NEXT_ACTION,
    selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AO_SELECTED_NEXT_FILE,
    selectionPolicy: [
      "keep Gate AO no-runtime: junction vibration ownership does not promote building R'w or DnT,w",
      "score coverage_gain * prerequisite_weight * solver_readiness / (implementation_cost + basis_leakage_risk + runtime_promotion_risk + 1)",
      "select room standardization after direct, flanking, and junction ownership because DnT,w needs room absorption normalization",
      "reject broad source crawling and direct runtime promotion while downstream Gate AL owners remain unowned"
    ]
  };
}

export function buildPersonalUseMvpCoverageSprintGateAOContract(): PersonalUseMvpCoverageSprintGateAOContract {
  const gateANContract = buildPersonalUseMvpCoverageSprintGateANContract();
  const gatePContract = buildGatePAirborneBuildingPredictionRuntimeCorridorContract();
  const ownerGaps = buildPersonalUseMvpCoverageSprintGateALOwnerGapMap();
  const junctionVibrationOwner = buildPersonalUseMvpCoverageSprintGateAOJunctionVibrationOwnerContract({
    flankingPathEnergyOwner: gateANContract.flankingPathEnergyOwner,
    ownerGaps
  });
  const laneSelection = rankPersonalUseMvpCoverageSprintGateAPLanes(junctionVibrationOwner);

  return {
    directCurveOwnerPreserved: true,
    downstreamOwnerGapsStillBlocked: junctionVibrationOwner.downstreamOwnerGapsStillBlocked,
    flankingPathEnergyOwnerPreserved: true,
    gateALOwnerGapCount: gateANContract.gateALOwnerGapCount,
    gateOToleranceDbPreserved: GATE_O_AIRBORNE_BUILDING_PREDICTION_TOLERANCE_DB,
    gatePDecisionBranch: gatePContract.decisionBranch,
    junctionVibrationOwner,
    landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AO_LANDED_GATE,
    numericRuntimeBehaviorChange: false,
    previousLandedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AN_LANDED_GATE,
    previousSelectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AO_PREVIOUS_SELECTION_STATUS,
    runtimePromotionAllowedInGateAO: false,
    runtimeValueMovement: false,
    selectedGateAPLane: laneSelection.selectedCandidate.id,
    selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
    selectedNextAction: laneSelection.selectedNextAction,
    selectedNextFile: laneSelection.selectedNextFile,
    selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AO_SELECTION_STATUS,
    sourceRowsRequiredForRuntimeSelection: false
  };
}
