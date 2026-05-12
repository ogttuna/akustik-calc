import type {
  GateOAirborneBuildingPredictionFormulaTerm
} from "./dynamic-airborne-gate-o-building-prediction-formula-corridor";
import {
  buildGateOAirborneBuildingPredictionFormulaCorridorContract,
  GATE_O_AIRBORNE_BUILDING_PREDICTION_TOLERANCE_DB
} from "./dynamic-airborne-gate-o-building-prediction-formula-corridor";
import {
  buildGatePAirborneBuildingPredictionRuntimeCorridorContract
} from "./dynamic-airborne-gate-p-building-prediction-runtime-corridor";
import {
  summarizePersonalUseMvpCoverageSprintGateAK,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AK_LANDED_GATE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AK_SELECTION_STATUS
} from "./calculator-personal-use-mvp-coverage-sprint-gate-ak";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AL_LANDED_GATE =
  "gate_al_personal_use_mvp_airborne_building_prediction_owner_gap_refresh_plan";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AL_SELECTION_STATUS =
  "gate_al_personal_use_mvp_airborne_building_prediction_owner_gap_refresh_landed_no_runtime_selected_direct_curve_owner_gate_am";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AL_SELECTED_NEXT_ACTION =
  "gate_am_personal_use_mvp_airborne_building_prediction_direct_curve_owner_contract_plan";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AL_SELECTED_NEXT_FILE =
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-am-airborne-building-prediction-direct-curve-owner-contract.test.ts";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AL_PREVIOUS_SELECTION_STATUS =
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AK_SELECTION_STATUS;

export type PersonalUseMvpCoverageSprintGateALOwnerId =
  GateOAirborneBuildingPredictionFormulaTerm["termId"];

export type PersonalUseMvpCoverageSprintGateAMLaneId =
  | "broad_source_crawl"
  | "building_prediction_runtime_promotion"
  | "building_prediction_uncertainty_budget_owner_contract"
  | "direct_separating_element_curve_owner_contract"
  | "flanking_path_energy_owner_contract"
  | "junction_vibration_reduction_owner_contract"
  | "room_standardization_owner_contract";

export type PersonalUseMvpCoverageSprintGateALBlockedAliasBoundary =
  | "field_runtime_budget_alias_blocked"
  | "lab_rw_stc_single_number_alias_blocked"
  | "opening_leak_lab_adapter_alias_blocked"
  | "source_single_number_without_curve_alias_blocked";

export type PersonalUseMvpCoverageSprintGateALOwnerGap = {
  blockedAliasBoundaries: readonly PersonalUseMvpCoverageSprintGateALBlockedAliasBoundary[];
  evidenceRowIds: readonly string[];
  gateODesignTermDefined: true;
  gatePBlocker: string;
  ownerId: PersonalUseMvpCoverageSprintGateALOwnerId;
  requiredBeforeBuildingRuntime: true;
  requiredInputs: readonly string[];
  runtimeOwnedInGateAL: false;
  sourceRowsRequiredForRuntimeSelection: false;
};

export type PersonalUseMvpCoverageSprintGateAMLaneCandidate = {
  basisLeakageRisk: number;
  calculatorCoverageGain: number;
  evidenceOwnerIds: readonly PersonalUseMvpCoverageSprintGateALOwnerId[];
  id: PersonalUseMvpCoverageSprintGateAMLaneId;
  implementationCost: number;
  prerequisiteWeight: number;
  reason: string;
  runtimePromotionRisk: number;
  score: number;
  selected: boolean;
  solverReadiness: number;
  sourceRowsRequiredForRuntimeSelection: boolean;
};

export type PersonalUseMvpCoverageSprintGateAMLaneSelection = {
  candidates: readonly PersonalUseMvpCoverageSprintGateAMLaneCandidate[];
  selectedCandidate: PersonalUseMvpCoverageSprintGateAMLaneCandidate;
  selectedNextAction: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AL_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AL_SELECTED_NEXT_FILE;
  selectionPolicy: readonly string[];
};

export type PersonalUseMvpCoverageSprintGateALContract = {
  aliasBoundariesPreserved: {
    fieldRuntimeBudget: true;
    labRwOrStc: true;
    openingLeakLabAdapter: true;
    sourceSingleNumberWithoutCurve: true;
  };
  buildingEvidenceRowIds: readonly string[];
  gateAKMatrixRows: 40;
  gateOToleranceDbPreserved: typeof GATE_O_AIRBORNE_BUILDING_PREDICTION_TOLERANCE_DB;
  gatePDecisionBranch: "runtime_blocked_formula_terms_not_owned";
  landedGate: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AL_LANDED_GATE;
  numericRuntimeBehaviorChange: false;
  ownerGaps: readonly PersonalUseMvpCoverageSprintGateALOwnerGap[];
  previousLandedGate: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AK_LANDED_GATE;
  previousSelectionStatus: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AL_PREVIOUS_SELECTION_STATUS;
  runtimePromotionAllowedInGateAL: false;
  runtimeValueMovement: false;
  selectedGateAMLane: PersonalUseMvpCoverageSprintGateAMLaneId;
  selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1";
  selectedNextAction: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AL_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AL_SELECTED_NEXT_FILE;
  selectionStatus: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AL_SELECTION_STATUS;
  sourceRowsRequiredForRuntimeSelection: false;
};

const BUILDING_EVIDENCE_ROW_IDS = [
  "wall.complete_building_prediction.unsupported",
  "wall.building_prediction_partial_context.needs_input",
  "wall.opening_leak_composite_building_boundary.unsupported"
] as const;

const DEFAULT_ALIAS_BOUNDARIES = [
  "field_runtime_budget_alias_blocked",
  "lab_rw_stc_single_number_alias_blocked",
  "opening_leak_lab_adapter_alias_blocked",
  "source_single_number_without_curve_alias_blocked"
] as const satisfies readonly PersonalUseMvpCoverageSprintGateALBlockedAliasBoundary[];

function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

function scoreLane(
  candidate: Omit<PersonalUseMvpCoverageSprintGateAMLaneCandidate, "score" | "selected">
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

export function buildPersonalUseMvpCoverageSprintGateALOwnerGapMap(): readonly PersonalUseMvpCoverageSprintGateALOwnerGap[] {
  const gateOContract = buildGateOAirborneBuildingPredictionFormulaCorridorContract();
  const gatePContract = buildGatePAirborneBuildingPredictionRuntimeCorridorContract();
  const gatePDecisions = new Map(
    gatePContract.formulaTermDecisions.map((decision) => [decision.termId, decision])
  );
  const [corridor] = gateOContract.candidateFormulaCorridors;

  if (!corridor) {
    throw new Error("Gate AL requires the Gate O building-prediction formula corridor.");
  }

  return corridor.formulaTerms.map((term) => {
    const gatePDecision = gatePDecisions.get(term.termId);

    if (!gatePDecision) {
      throw new Error(`Gate AL missing Gate P decision for owner ${term.termId}`);
    }

    return {
      blockedAliasBoundaries: DEFAULT_ALIAS_BOUNDARIES,
      evidenceRowIds: BUILDING_EVIDENCE_ROW_IDS,
      gateODesignTermDefined: true,
      gatePBlocker: gatePDecision.promotionBlocker,
      ownerId: term.termId,
      requiredBeforeBuildingRuntime: true,
      requiredInputs: term.requiredInputs,
      runtimeOwnedInGateAL: false,
      sourceRowsRequiredForRuntimeSelection: false
    };
  });
}

export function rankPersonalUseMvpCoverageSprintGateAMLanes(
  ownerGaps: readonly PersonalUseMvpCoverageSprintGateALOwnerGap[] =
    buildPersonalUseMvpCoverageSprintGateALOwnerGapMap()
): PersonalUseMvpCoverageSprintGateAMLaneSelection {
  const ownerIds = new Set(ownerGaps.map((gap) => gap.ownerId));
  const requireOwner = (ownerId: PersonalUseMvpCoverageSprintGateALOwnerId): void => {
    if (!ownerIds.has(ownerId)) {
      throw new Error(`Gate AM lane ranking references missing owner gap ${ownerId}`);
    }
  };

  requireOwner("direct_separating_element_frequency_curve");
  requireOwner("flanking_path_energy_sum");
  requireOwner("junction_vibration_reduction_index");
  requireOwner("room_absorption_standardization");
  requireOwner("building_prediction_uncertainty_budget");

  const candidateSeeds = [
    {
      basisLeakageRisk: 3,
      calculatorCoverageGain: 5,
      evidenceOwnerIds: ["direct_separating_element_frequency_curve"],
      id: "direct_separating_element_curve_owner_contract",
      implementationCost: 5,
      prerequisiteWeight: 4,
      reason:
        "Every building-prediction energy path needs an owned direct separating-element frequency curve before flanking, room, or uncertainty work can promote runtime.",
      runtimePromotionRisk: 1,
      solverReadiness: 4,
      sourceRowsRequiredForRuntimeSelection: false
    },
    {
      basisLeakageRisk: 8,
      calculatorCoverageGain: 5,
      evidenceOwnerIds: ["flanking_path_energy_sum"],
      id: "flanking_path_energy_owner_contract",
      implementationCost: 7,
      prerequisiteWeight: 4,
      reason:
        "Flanking energy is essential but higher risk until the direct element curve owner exists.",
      runtimePromotionRisk: 3,
      solverReadiness: 1,
      sourceRowsRequiredForRuntimeSelection: false
    },
    {
      basisLeakageRisk: 7,
      calculatorCoverageGain: 4,
      evidenceOwnerIds: ["junction_vibration_reduction_index"],
      id: "junction_vibration_reduction_owner_contract",
      implementationCost: 6,
      prerequisiteWeight: 3,
      reason:
        "Junction vibration reduction must stay behind direct curve ownership and an explicit flanking-path model.",
      runtimePromotionRisk: 3,
      solverReadiness: 2,
      sourceRowsRequiredForRuntimeSelection: false
    },
    {
      basisLeakageRisk: 4,
      calculatorCoverageGain: 4,
      evidenceOwnerIds: ["room_absorption_standardization"],
      id: "room_standardization_owner_contract",
      implementationCost: 4,
      prerequisiteWeight: 2,
      reason:
        "Room standardization is more tractable, but it cannot create building runtime without direct/flanking energy terms.",
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
        "The +/-9 dB budget must stay visible, but budget ownership alone cannot create a defensible building estimate.",
      runtimePromotionRisk: 2,
      solverReadiness: 3,
      sourceRowsRequiredForRuntimeSelection: false
    },
    {
      basisLeakageRisk: 9,
      calculatorCoverageGain: 8,
      evidenceOwnerIds: [
        "direct_separating_element_frequency_curve",
        "flanking_path_energy_sum",
        "junction_vibration_reduction_index",
        "room_absorption_standardization",
        "building_prediction_uncertainty_budget"
      ],
      id: "building_prediction_runtime_promotion",
      implementationCost: 8,
      prerequisiteWeight: 5,
      reason:
        "Runtime promotion remains blocked because all five Gate AL owner gaps are still runtime-unowned.",
      runtimePromotionRisk: 9,
      solverReadiness: 0,
      sourceRowsRequiredForRuntimeSelection: false
    },
    {
      basisLeakageRisk: 8,
      calculatorCoverageGain: 2,
      evidenceOwnerIds: ["direct_separating_element_frequency_curve"],
      id: "broad_source_crawl",
      implementationCost: 9,
      prerequisiteWeight: 1,
      reason:
        "Broad source crawling does not solve the source-absent building formula owner gap.",
      runtimePromotionRisk: 8,
      solverReadiness: 1,
      sourceRowsRequiredForRuntimeSelection: true
    }
  ] as const satisfies readonly Omit<PersonalUseMvpCoverageSprintGateAMLaneCandidate, "score" | "selected">[];
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
    throw new Error("Personal-use MVP Coverage Sprint Gate AL requires a Gate AM lane candidate.");
  }

  const candidates = candidatesWithoutSelection.map((candidate) => ({
    ...candidate,
    selected: candidate.id === selected.id
  }));
  const selectedCandidate = candidates.find((candidate) => candidate.selected);

  if (!selectedCandidate) {
    throw new Error("Personal-use MVP Coverage Sprint Gate AL did not mark a selected Gate AM lane.");
  }

  return {
    candidates,
    selectedCandidate,
    selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AL_SELECTED_NEXT_ACTION,
    selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AL_SELECTED_NEXT_FILE,
    selectionPolicy: [
      "keep Gate AL no-runtime: owner-gap mapping does not promote building R'w or DnT,w",
      "score coverage_gain * prerequisite_weight * solver_readiness / (implementation_cost + basis_leakage_risk + runtime_promotion_risk + 1)",
      "select the first prerequisite owner needed by every building energy path before flanking or runtime work",
      "reject broad source crawling and direct runtime promotion while any Gate AL owner gap is unowned"
    ]
  };
}

export function buildPersonalUseMvpCoverageSprintGateALContract(): PersonalUseMvpCoverageSprintGateALContract {
  const gateAKSummary = summarizePersonalUseMvpCoverageSprintGateAK();
  const gatePContract = buildGatePAirborneBuildingPredictionRuntimeCorridorContract();
  const ownerGaps = buildPersonalUseMvpCoverageSprintGateALOwnerGapMap();
  const laneSelection = rankPersonalUseMvpCoverageSprintGateAMLanes(ownerGaps);

  return {
    aliasBoundariesPreserved: {
      fieldRuntimeBudget: true,
      labRwOrStc: true,
      openingLeakLabAdapter: true,
      sourceSingleNumberWithoutCurve: true
    },
    buildingEvidenceRowIds: BUILDING_EVIDENCE_ROW_IDS,
    gateAKMatrixRows: gateAKSummary.rowCount,
    gateOToleranceDbPreserved: GATE_O_AIRBORNE_BUILDING_PREDICTION_TOLERANCE_DB,
    gatePDecisionBranch: gatePContract.decisionBranch,
    landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AL_LANDED_GATE,
    numericRuntimeBehaviorChange: false,
    ownerGaps,
    previousLandedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AK_LANDED_GATE,
    previousSelectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AL_PREVIOUS_SELECTION_STATUS,
    runtimePromotionAllowedInGateAL: false,
    runtimeValueMovement: false,
    selectedGateAMLane: laneSelection.selectedCandidate.id,
    selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
    selectedNextAction: laneSelection.selectedNextAction,
    selectedNextFile: laneSelection.selectedNextFile,
    selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AL_SELECTION_STATUS,
    sourceRowsRequiredForRuntimeSelection: false
  };
}
