import {
  buildPersonalUseMvpCoverageSprintGateALOwnerGapMap,
  type PersonalUseMvpCoverageSprintGateALOwnerGap,
  type PersonalUseMvpCoverageSprintGateALOwnerId
} from "./calculator-personal-use-mvp-coverage-sprint-gate-al";
import {
  buildPersonalUseMvpCoverageSprintGateAMContract,
  buildPersonalUseMvpCoverageSprintGateAMDirectCurveOwnerContract,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AM_DIRECT_CURVE_OWNER_ID,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AM_LANDED_GATE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AM_SELECTION_STATUS,
  type PersonalUseMvpCoverageSprintGateAMDirectCurveOwnerContract
} from "./calculator-personal-use-mvp-coverage-sprint-gate-am";
import {
  GATE_O_AIRBORNE_BUILDING_PREDICTION_TOLERANCE_DB
} from "./dynamic-airborne-gate-o-building-prediction-formula-corridor";
import {
  buildGatePAirborneBuildingPredictionRuntimeCorridorContract
} from "./dynamic-airborne-gate-p-building-prediction-runtime-corridor";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AN_LANDED_GATE =
  "gate_an_personal_use_mvp_airborne_building_prediction_flanking_path_energy_owner_contract_plan";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AN_SELECTION_STATUS =
  "gate_an_personal_use_mvp_airborne_building_prediction_flanking_path_energy_owner_landed_no_runtime_selected_junction_vibration_gate_ao";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AN_SELECTED_NEXT_ACTION =
  "gate_ao_personal_use_mvp_airborne_building_prediction_junction_vibration_owner_contract_plan";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AN_SELECTED_NEXT_FILE =
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ao-airborne-building-prediction-junction-vibration-owner-contract.test.ts";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AN_PREVIOUS_SELECTION_STATUS =
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AM_SELECTION_STATUS;

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AN_FLANKING_OWNER_ID =
  "flanking_path_energy_sum" satisfies PersonalUseMvpCoverageSprintGateALOwnerId;

export type PersonalUseMvpCoverageSprintGateANFlankingRequirementId =
  | "basis_compatible_indirect_transmission_terms"
  | "basis_compatible_metric_scope"
  | "coupling_surface_area_owner"
  | "direct_curve_owner_dependency"
  | "flanking_path_identity_and_count_owner"
  | "named_flanking_path_topology"
  | "source_absent_conservative_assumption_owner";

export type PersonalUseMvpCoverageSprintGateANFlankingRejectedSignalId =
  | "direct_curve_only_without_indirect_paths"
  | "field_runtime_budget"
  | "generic_flanking_assumption_without_path_identity"
  | "lab_rw_single_number"
  | "legacy_raw_dynamic_field_building_continuation"
  | "opening_leak_lab_adapter"
  | "source_row_single_number_without_path_terms"
  | "stc_single_number";

export type PersonalUseMvpCoverageSprintGateAOLaneId =
  | "broad_source_crawl"
  | "building_prediction_runtime_promotion"
  | "building_prediction_uncertainty_budget_owner_contract"
  | "junction_vibration_reduction_owner_contract"
  | "room_standardization_owner_contract";

export type PersonalUseMvpCoverageSprintGateANFlankingPathEnergyOwnerContract = {
  acceptedRequirementIds: readonly PersonalUseMvpCoverageSprintGateANFlankingRequirementId[];
  directCurveOwnerAloneCanPromoteBuildingRuntime: false;
  directCurveOwnerDependency: PersonalUseMvpCoverageSprintGateAMDirectCurveOwnerContract;
  downstreamOwnerGapsStillBlocked: readonly Exclude<
    PersonalUseMvpCoverageSprintGateALOwnerId,
    | typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AM_DIRECT_CURVE_OWNER_ID
    | typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AN_FLANKING_OWNER_ID
  >[];
  evidenceRowIds: readonly string[];
  flankingEnergyMustComeFrom: "named_indirect_path_energy_terms_for_iso_12354_1_building_prediction";
  gateALOwnerGap: PersonalUseMvpCoverageSprintGateALOwnerGap;
  gatePBlockerPreserved: string;
  genericConservativeAssumptionCanSatisfyFlankingEnergy: false;
  ownerId: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AN_FLANKING_OWNER_ID;
  rejectedSignalIds: readonly PersonalUseMvpCoverageSprintGateANFlankingRejectedSignalId[];
  requiredInputs: readonly string[];
  runtimeOwnedInGateAN: false;
  runtimePromotionAllowedInGateAN: false;
  sourceRowsRequiredForRuntimeSelection: false;
};

export type PersonalUseMvpCoverageSprintGateAOLaneCandidate = {
  basisLeakageRisk: number;
  calculatorCoverageGain: number;
  evidenceOwnerIds: readonly PersonalUseMvpCoverageSprintGateALOwnerId[];
  id: PersonalUseMvpCoverageSprintGateAOLaneId;
  implementationCost: number;
  prerequisiteWeight: number;
  reason: string;
  runtimePromotionRisk: number;
  score: number;
  selected: boolean;
  solverReadiness: number;
  sourceRowsRequiredForRuntimeSelection: boolean;
};

export type PersonalUseMvpCoverageSprintGateAOLaneSelection = {
  candidates: readonly PersonalUseMvpCoverageSprintGateAOLaneCandidate[];
  selectedCandidate: PersonalUseMvpCoverageSprintGateAOLaneCandidate;
  selectedNextAction: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AN_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AN_SELECTED_NEXT_FILE;
  selectionPolicy: readonly string[];
};

export type PersonalUseMvpCoverageSprintGateANContract = {
  directCurveOwnerPreserved: true;
  downstreamOwnerGapsStillBlocked: readonly Exclude<
    PersonalUseMvpCoverageSprintGateALOwnerId,
    | typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AM_DIRECT_CURVE_OWNER_ID
    | typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AN_FLANKING_OWNER_ID
  >[];
  flankingPathEnergyOwner: PersonalUseMvpCoverageSprintGateANFlankingPathEnergyOwnerContract;
  gateALOwnerGapCount: 5;
  gateOToleranceDbPreserved: typeof GATE_O_AIRBORNE_BUILDING_PREDICTION_TOLERANCE_DB;
  gatePDecisionBranch: "runtime_blocked_formula_terms_not_owned";
  landedGate: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AN_LANDED_GATE;
  numericRuntimeBehaviorChange: false;
  previousLandedGate: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AM_LANDED_GATE;
  previousSelectionStatus: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AN_PREVIOUS_SELECTION_STATUS;
  runtimePromotionAllowedInGateAN: false;
  runtimeValueMovement: false;
  selectedGateAOLane: PersonalUseMvpCoverageSprintGateAOLaneId;
  selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1";
  selectedNextAction: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AN_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AN_SELECTED_NEXT_FILE;
  selectionStatus: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AN_SELECTION_STATUS;
  sourceRowsRequiredForRuntimeSelection: false;
};

const FLANKING_PATH_REQUIREMENTS = [
  "direct_curve_owner_dependency",
  "named_flanking_path_topology",
  "flanking_path_identity_and_count_owner",
  "basis_compatible_indirect_transmission_terms",
  "coupling_surface_area_owner",
  "source_absent_conservative_assumption_owner",
  "basis_compatible_metric_scope"
] as const satisfies readonly PersonalUseMvpCoverageSprintGateANFlankingRequirementId[];

const FLANKING_PATH_REJECTED_SIGNALS = [
  "direct_curve_only_without_indirect_paths",
  "generic_flanking_assumption_without_path_identity",
  "lab_rw_single_number",
  "stc_single_number",
  "source_row_single_number_without_path_terms",
  "field_runtime_budget",
  "opening_leak_lab_adapter",
  "legacy_raw_dynamic_field_building_continuation"
] as const satisfies readonly PersonalUseMvpCoverageSprintGateANFlankingRejectedSignalId[];

const DOWNSTREAM_OWNER_GAPS_AFTER_FLANKING_ENERGY = [
  "junction_vibration_reduction_index",
  "room_absorption_standardization",
  "building_prediction_uncertainty_budget"
] as const satisfies readonly Exclude<
  PersonalUseMvpCoverageSprintGateALOwnerId,
  | typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AM_DIRECT_CURVE_OWNER_ID
  | typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AN_FLANKING_OWNER_ID
>[];

function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

function scoreLane(
  candidate: Omit<PersonalUseMvpCoverageSprintGateAOLaneCandidate, "score" | "selected">
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

function findFlankingOwnerGap(
  ownerGaps: readonly PersonalUseMvpCoverageSprintGateALOwnerGap[]
): PersonalUseMvpCoverageSprintGateALOwnerGap {
  const flankingOwner = ownerGaps.find(
    (gap) => gap.ownerId === PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AN_FLANKING_OWNER_ID
  );

  if (!flankingOwner) {
    throw new Error("Gate AN requires the Gate AL flanking path energy owner gap.");
  }

  return flankingOwner;
}

export function buildPersonalUseMvpCoverageSprintGateANFlankingPathEnergyOwnerContract(input?: {
  directCurveOwner?: PersonalUseMvpCoverageSprintGateAMDirectCurveOwnerContract;
  ownerGaps?: readonly PersonalUseMvpCoverageSprintGateALOwnerGap[];
}): PersonalUseMvpCoverageSprintGateANFlankingPathEnergyOwnerContract {
  const ownerGaps = input?.ownerGaps ?? buildPersonalUseMvpCoverageSprintGateALOwnerGapMap();
  const directCurveOwner =
    input?.directCurveOwner ?? buildPersonalUseMvpCoverageSprintGateAMDirectCurveOwnerContract(ownerGaps);
  const flankingOwner = findFlankingOwnerGap(ownerGaps);
  const gatePContract = buildGatePAirborneBuildingPredictionRuntimeCorridorContract();
  const gatePDecision = gatePContract.formulaTermDecisions.find(
    (decision) => decision.termId === PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AN_FLANKING_OWNER_ID
  );

  if (!gatePDecision) {
    throw new Error("Gate AN requires the Gate P flanking path promotion blocker.");
  }

  return {
    acceptedRequirementIds: FLANKING_PATH_REQUIREMENTS,
    directCurveOwnerAloneCanPromoteBuildingRuntime: false,
    directCurveOwnerDependency: directCurveOwner,
    downstreamOwnerGapsStillBlocked: DOWNSTREAM_OWNER_GAPS_AFTER_FLANKING_ENERGY,
    evidenceRowIds: flankingOwner.evidenceRowIds,
    flankingEnergyMustComeFrom:
      "named_indirect_path_energy_terms_for_iso_12354_1_building_prediction",
    gateALOwnerGap: flankingOwner,
    gatePBlockerPreserved: gatePDecision.promotionBlocker,
    genericConservativeAssumptionCanSatisfyFlankingEnergy: false,
    ownerId: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AN_FLANKING_OWNER_ID,
    rejectedSignalIds: FLANKING_PATH_REJECTED_SIGNALS,
    requiredInputs: [
      ...flankingOwner.requiredInputs,
      "namedFlankingPathTopologyOwner",
      "flankingPathIdentityAndCountOwner",
      "basisCompatibleIndirectTransmissionTermsOwner",
      "couplingSurfaceAreaOwner",
      "sourceAbsentConservativeAssumptionOwner",
      "basisCompatibleMetricScope"
    ],
    runtimeOwnedInGateAN: false,
    runtimePromotionAllowedInGateAN: false,
    sourceRowsRequiredForRuntimeSelection: false
  };
}

export function rankPersonalUseMvpCoverageSprintGateAOLanes(
  flankingPathEnergyOwner: PersonalUseMvpCoverageSprintGateANFlankingPathEnergyOwnerContract =
    buildPersonalUseMvpCoverageSprintGateANFlankingPathEnergyOwnerContract()
): PersonalUseMvpCoverageSprintGateAOLaneSelection {
  const remainingOwners = new Set(flankingPathEnergyOwner.downstreamOwnerGapsStillBlocked);
  const requireRemainingOwner = (ownerId: Exclude<
    PersonalUseMvpCoverageSprintGateALOwnerId,
    | typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AM_DIRECT_CURVE_OWNER_ID
    | typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AN_FLANKING_OWNER_ID
  >): void => {
    if (!remainingOwners.has(ownerId)) {
      throw new Error(`Gate AO lane ranking references missing remaining owner gap ${ownerId}`);
    }
  };

  requireRemainingOwner("junction_vibration_reduction_index");
  requireRemainingOwner("room_absorption_standardization");
  requireRemainingOwner("building_prediction_uncertainty_budget");

  const candidateSeeds = [
    {
      basisLeakageRisk: 5,
      calculatorCoverageGain: 5,
      evidenceOwnerIds: ["junction_vibration_reduction_index"],
      id: "junction_vibration_reduction_owner_contract",
      implementationCost: 5,
      prerequisiteWeight: 4,
      reason:
        "After direct and flanking energy ownership, junction vibration reduction is the next physical term needed to turn indirect paths into a building-prediction formula.",
      runtimePromotionRisk: 2,
      solverReadiness: 3,
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
        "Room standardization is necessary for DnT,w but should follow the direct, flanking, and junction physical path owners.",
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
        "The +/-9 dB budget remains visible, but uncertainty ownership cannot promote runtime while junction and room terms are unowned.",
      runtimePromotionRisk: 2,
      solverReadiness: 3,
      sourceRowsRequiredForRuntimeSelection: false
    },
    {
      basisLeakageRisk: 9,
      calculatorCoverageGain: 8,
      evidenceOwnerIds: [
        "junction_vibration_reduction_index",
        "room_absorption_standardization",
        "building_prediction_uncertainty_budget"
      ],
      id: "building_prediction_runtime_promotion",
      implementationCost: 8,
      prerequisiteWeight: 5,
      reason:
        "Runtime promotion remains blocked because Gate AN only defines flanking path energy ownership.",
      runtimePromotionRisk: 9,
      solverReadiness: 0,
      sourceRowsRequiredForRuntimeSelection: false
    },
    {
      basisLeakageRisk: 8,
      calculatorCoverageGain: 2,
      evidenceOwnerIds: ["junction_vibration_reduction_index"],
      id: "broad_source_crawl",
      implementationCost: 9,
      prerequisiteWeight: 1,
      reason:
        "Broad source crawling does not produce the named junction owner needed by the source-absent building formula path.",
      runtimePromotionRisk: 8,
      solverReadiness: 1,
      sourceRowsRequiredForRuntimeSelection: true
    }
  ] as const satisfies readonly Omit<PersonalUseMvpCoverageSprintGateAOLaneCandidate, "score" | "selected">[];
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
    throw new Error("Personal-use MVP Coverage Sprint Gate AN requires a Gate AO lane candidate.");
  }

  const candidates = candidatesWithoutSelection.map((candidate) => ({
    ...candidate,
    selected: candidate.id === selected.id
  }));
  const selectedCandidate = candidates.find((candidate) => candidate.selected);

  if (!selectedCandidate) {
    throw new Error("Personal-use MVP Coverage Sprint Gate AN did not mark a selected Gate AO lane.");
  }

  return {
    candidates,
    selectedCandidate,
    selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AN_SELECTED_NEXT_ACTION,
    selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AN_SELECTED_NEXT_FILE,
    selectionPolicy: [
      "keep Gate AN no-runtime: flanking path energy ownership does not promote building R'w or DnT,w",
      "score coverage_gain * prerequisite_weight * solver_readiness / (implementation_cost + basis_leakage_risk + runtime_promotion_risk + 1)",
      "select junction vibration reduction after direct and flanking energy because indirect path energy still needs junction coupling ownership",
      "reject broad source crawling and direct runtime promotion while downstream Gate AL owners remain unowned"
    ]
  };
}

export function buildPersonalUseMvpCoverageSprintGateANContract(): PersonalUseMvpCoverageSprintGateANContract {
  const gateAMContract = buildPersonalUseMvpCoverageSprintGateAMContract();
  const gatePContract = buildGatePAirborneBuildingPredictionRuntimeCorridorContract();
  const ownerGaps = buildPersonalUseMvpCoverageSprintGateALOwnerGapMap();
  const flankingPathEnergyOwner = buildPersonalUseMvpCoverageSprintGateANFlankingPathEnergyOwnerContract({
    directCurveOwner: gateAMContract.directCurveOwner,
    ownerGaps
  });
  const laneSelection = rankPersonalUseMvpCoverageSprintGateAOLanes(flankingPathEnergyOwner);

  return {
    directCurveOwnerPreserved: true,
    downstreamOwnerGapsStillBlocked: flankingPathEnergyOwner.downstreamOwnerGapsStillBlocked,
    flankingPathEnergyOwner,
    gateALOwnerGapCount: gateAMContract.gateALOwnerGapCount,
    gateOToleranceDbPreserved: GATE_O_AIRBORNE_BUILDING_PREDICTION_TOLERANCE_DB,
    gatePDecisionBranch: gatePContract.decisionBranch,
    landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AN_LANDED_GATE,
    numericRuntimeBehaviorChange: false,
    previousLandedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AM_LANDED_GATE,
    previousSelectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AN_PREVIOUS_SELECTION_STATUS,
    runtimePromotionAllowedInGateAN: false,
    runtimeValueMovement: false,
    selectedGateAOLane: laneSelection.selectedCandidate.id,
    selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
    selectedNextAction: laneSelection.selectedNextAction,
    selectedNextFile: laneSelection.selectedNextFile,
    selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AN_SELECTION_STATUS,
    sourceRowsRequiredForRuntimeSelection: false
  };
}
