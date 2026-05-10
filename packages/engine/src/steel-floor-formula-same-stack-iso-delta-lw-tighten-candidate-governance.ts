import {
  GATE_BH_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_RESIDUAL_POLICY_CLOSED_OWNER_REVALIDATION_SELECTED_NEXT_ACTION,
  buildGateBHSteelFloorFormulaSameStackIsoDeltaLwResidualPolicyClosedOwnerRevalidationContract,
  type GateBHSteelFloorFormulaSameStackIsoDeltaLwResidualPolicyClosedOwnerRevalidationContract,
} from "./steel-floor-formula-same-stack-iso-delta-lw-residual-policy-closed-owner-revalidation";
import {
  STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB,
  STEEL_FLOOR_FORMULA_LN_W_TOLERANCE_DB,
} from "./steel-floor-impact-formula-corridor";

export const GATE_BI_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_TIGHTEN_CANDIDATE_GOVERNANCE_SELECTED_NEXT_FILE =
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-a-scenario-matrix-contract.test.ts";

export const GATE_BI_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_TIGHTEN_CANDIDATE_GOVERNANCE_SELECTED_NEXT_ACTION =
  "gate_a_personal_use_mvp_coverage_matrix_plan";

export type GateBISteelFloorFormulaTightenGovernancePrerequisiteId =
  | "basis_separation_runtime_owner"
  | "card_report_api_parity_for_any_future_tolerance_delta"
  | "exact_source_precedence_boundary"
  | "independent_measured_residual_packet_ownership"
  | "source_rights_and_citation_posture"
  | "steel_topology_diversity_holdouts"
  | "tolerance_delta_runtime_proposal";

export type GateBISteelFloorFormulaTightenGovernancePrerequisite = {
  readonly id: GateBISteelFloorFormulaTightenGovernancePrerequisiteId;
  readonly closureFixtureRowsCanSatisfy: false;
  readonly requiredBeforeRuntimeMovement: true;
  readonly status: "required_for_future_runtime_gate";
};

export type GateBISteelFloorFormulaTightenGovernanceDecision =
  | "accepted_tighten_candidate_governance_signal_only"
  | "blocked_previous_gate_not_selected_gate_bi"
  | "blocked_previous_gate_not_tighten_candidate";

export type GateBISteelFloorFormulaTightenGovernanceInput = {
  readonly closedOwnerRevalidationContract: GateBHSteelFloorFormulaSameStackIsoDeltaLwResidualPolicyClosedOwnerRevalidationContract;
  readonly id: string;
};

export type GateBISteelFloorFormulaTightenGovernanceRow =
  GateBISteelFloorFormulaTightenGovernanceInput & {
    readonly acceptedForGovernance: boolean;
    readonly exactSourceOverrideAllowedNow: false;
    readonly fieldBuildingAliasAllowedNow: false;
    readonly formulaCoefficientChangeAllowedNow: false;
    readonly governanceDecision: GateBISteelFloorFormulaTightenGovernanceDecision;
    readonly measuredMetricValueIngestedForRuntime: false;
    readonly prerequisiteIds: readonly GateBISteelFloorFormulaTightenGovernancePrerequisiteId[];
    readonly runtimeRetuneAllowedNow: false;
    readonly runtimeValueMovement: false;
    readonly sourceDocumentCopied: false;
    readonly sourceTextIngested: false;
    readonly toleranceChangeAllowedNow: false;
  };

export type GateBISteelFloorFormulaSameStackIsoDeltaLwTightenCandidateGovernanceContract = {
  readonly candidateGovernanceRow: GateBISteelFloorFormulaTightenGovernanceRow;
  readonly coverageSprintSelection: {
    readonly initialScenarioRowTargetCount: 24;
    readonly matrixMustUseCurrentEngineEntryPoints: true;
    readonly nextLane: "personal_use_mvp_coverage_sprint_after_gate_bi";
    readonly requiredRowFields: readonly [
      "id",
      "route",
      "family",
      "requestedMetrics",
      "basis",
      "inputCompleteness",
      "currentPosture",
      "expectedPosture",
      "valueOrBlockedReason",
      "originSupportBucket",
      "toleranceOrErrorBudget",
      "visibleSurfaceParityTarget",
      "hostileVariant",
      "failureClass",
      "nextAction",
    ];
    readonly selectedFirstAction: typeof GATE_BI_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_TIGHTEN_CANDIDATE_GOVERNANCE_SELECTED_NEXT_ACTION;
    readonly selectedFirstFile: typeof GATE_BI_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_TIGHTEN_CANDIDATE_GOVERNANCE_SELECTED_NEXT_FILE;
  };
  readonly frozenSurfacePolicy: {
    readonly cardsReportsApisCanShowGovernanceLabelOnly: true;
    readonly exactRowsRemainFirstPrecedence: true;
    readonly formulaCoefficientsFrozen: true;
    readonly labFieldBuildingAliasesBlocked: true;
    readonly sourceTextOrDocumentIngestionBlocked: true;
    readonly steelToleranceMovementBlocked: true;
  };
  readonly governancePrerequisites: readonly GateBISteelFloorFormulaTightenGovernancePrerequisite[];
  readonly landedGate: "gate_bi_steel_floor_formula_same_stack_iso_delta_lw_tighten_candidate_governance_plan";
  readonly previousLandedGate: "gate_bh_steel_floor_formula_same_stack_iso_delta_lw_residual_policy_closed_owner_revalidation_plan";
  readonly runtimePins: {
    readonly deltaLwToleranceDb: typeof STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB;
    readonly estimateDeltaLw: 22.4;
    readonly estimateLnW: 55.6;
    readonly lnWToleranceDb: typeof STEEL_FLOOR_FORMULA_LN_W_TOLERANCE_DB;
    readonly runtimeRetuneAllowedNow: false;
    readonly runtimeValueMovement: false;
  };
  readonly selectedClosedOwnerRevalidationInput: GateBHSteelFloorFormulaSameStackIsoDeltaLwResidualPolicyClosedOwnerRevalidationContract;
  readonly selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1";
  readonly selectedNextAction: typeof GATE_BI_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_TIGHTEN_CANDIDATE_GOVERNANCE_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof GATE_BI_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_TIGHTEN_CANDIDATE_GOVERNANCE_SELECTED_NEXT_FILE;
  readonly selectionStatus: "gate_bi_same_stack_iso_delta_lw_tighten_candidate_governance_landed_no_runtime_selected_personal_use_mvp_coverage_sprint_gate_a";
};

const gateBHTightenCandidateContract =
  buildGateBHSteelFloorFormulaSameStackIsoDeltaLwResidualPolicyClosedOwnerRevalidationContract();

export const GATE_BI_REQUIRED_TIGHTEN_GOVERNANCE_PREREQUISITES = [
  "independent_measured_residual_packet_ownership",
  "steel_topology_diversity_holdouts",
  "source_rights_and_citation_posture",
  "exact_source_precedence_boundary",
  "basis_separation_runtime_owner",
  "tolerance_delta_runtime_proposal",
  "card_report_api_parity_for_any_future_tolerance_delta",
] as const satisfies readonly GateBISteelFloorFormulaTightenGovernancePrerequisiteId[];

const buildGovernancePrerequisites = ():
  readonly GateBISteelFloorFormulaTightenGovernancePrerequisite[] =>
  GATE_BI_REQUIRED_TIGHTEN_GOVERNANCE_PREREQUISITES.map((id) => ({
    closureFixtureRowsCanSatisfy: false,
    id,
    requiredBeforeRuntimeMovement: true,
    status: "required_for_future_runtime_gate",
  }));

export function classifyGateBISteelFloorFormulaSameStackIsoDeltaLwTightenCandidateGovernance(
  input: GateBISteelFloorFormulaTightenGovernanceInput,
): GateBISteelFloorFormulaTightenGovernanceRow {
  const gateBH = input.closedOwnerRevalidationContract;
  const gateBHSelectedGateBI =
    gateBH.selectedNextAction ===
    GATE_BH_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_RESIDUAL_POLICY_CLOSED_OWNER_REVALIDATION_SELECTED_NEXT_ACTION;
  const gateBHProducedTightenCandidate =
    gateBH.closedOwnerDecisionSummary.selectedCandidate ===
      "tighten_candidate_policy_signal_only" &&
    gateBH.closedOwnerDecisionSummary.closedOwnerPolicyDecision === "tighten" &&
    gateBH.closedOwnerRevalidationRow.decisionClassification ===
      "tighten_candidate_requires_later_gate";
  const acceptedForGovernance =
    gateBHSelectedGateBI && gateBHProducedTightenCandidate;

  const governanceDecision: GateBISteelFloorFormulaTightenGovernanceDecision =
    acceptedForGovernance
      ? "accepted_tighten_candidate_governance_signal_only"
      : gateBHSelectedGateBI
        ? "blocked_previous_gate_not_tighten_candidate"
        : "blocked_previous_gate_not_selected_gate_bi";

  return {
    ...input,
    acceptedForGovernance,
    exactSourceOverrideAllowedNow: false,
    fieldBuildingAliasAllowedNow: false,
    formulaCoefficientChangeAllowedNow: false,
    governanceDecision,
    measuredMetricValueIngestedForRuntime: false,
    prerequisiteIds: GATE_BI_REQUIRED_TIGHTEN_GOVERNANCE_PREREQUISITES,
    runtimeRetuneAllowedNow: false,
    runtimeValueMovement: false,
    sourceDocumentCopied: false,
    sourceTextIngested: false,
    toleranceChangeAllowedNow: false,
  };
}

export function buildGateBISteelFloorFormulaSameStackIsoDeltaLwTightenCandidateGovernanceContract():
  GateBISteelFloorFormulaSameStackIsoDeltaLwTightenCandidateGovernanceContract {
  const governancePrerequisites = buildGovernancePrerequisites();
  const candidateGovernanceRow =
    classifyGateBISteelFloorFormulaSameStackIsoDeltaLwTightenCandidateGovernance(
      {
        closedOwnerRevalidationContract: gateBHTightenCandidateContract,
        id: "gate_bi_tighten_candidate_governance",
      },
    );

  return {
    candidateGovernanceRow,
    coverageSprintSelection: {
      initialScenarioRowTargetCount: 24,
      matrixMustUseCurrentEngineEntryPoints: true,
      nextLane: "personal_use_mvp_coverage_sprint_after_gate_bi",
      requiredRowFields: [
        "id",
        "route",
        "family",
        "requestedMetrics",
        "basis",
        "inputCompleteness",
        "currentPosture",
        "expectedPosture",
        "valueOrBlockedReason",
        "originSupportBucket",
        "toleranceOrErrorBudget",
        "visibleSurfaceParityTarget",
        "hostileVariant",
        "failureClass",
        "nextAction",
      ],
      selectedFirstAction:
        GATE_BI_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_TIGHTEN_CANDIDATE_GOVERNANCE_SELECTED_NEXT_ACTION,
      selectedFirstFile:
        GATE_BI_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_TIGHTEN_CANDIDATE_GOVERNANCE_SELECTED_NEXT_FILE,
    },
    frozenSurfacePolicy: {
      cardsReportsApisCanShowGovernanceLabelOnly: true,
      exactRowsRemainFirstPrecedence: true,
      formulaCoefficientsFrozen: true,
      labFieldBuildingAliasesBlocked: true,
      sourceTextOrDocumentIngestionBlocked: true,
      steelToleranceMovementBlocked: true,
    },
    governancePrerequisites,
    landedGate:
      "gate_bi_steel_floor_formula_same_stack_iso_delta_lw_tighten_candidate_governance_plan",
    previousLandedGate:
      "gate_bh_steel_floor_formula_same_stack_iso_delta_lw_residual_policy_closed_owner_revalidation_plan",
    runtimePins: {
      deltaLwToleranceDb: STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB,
      estimateDeltaLw: 22.4,
      estimateLnW: 55.6,
      lnWToleranceDb: STEEL_FLOOR_FORMULA_LN_W_TOLERANCE_DB,
      runtimeRetuneAllowedNow: false,
      runtimeValueMovement: false,
    },
    selectedClosedOwnerRevalidationInput: gateBHTightenCandidateContract,
    selectedImplementationSlice:
      "calculator_model_first_physics_prediction_pivot_v1",
    selectedNextAction:
      GATE_BI_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_TIGHTEN_CANDIDATE_GOVERNANCE_SELECTED_NEXT_ACTION,
    selectedNextFile:
      GATE_BI_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_TIGHTEN_CANDIDATE_GOVERNANCE_SELECTED_NEXT_FILE,
    selectionStatus:
      "gate_bi_same_stack_iso_delta_lw_tighten_candidate_governance_landed_no_runtime_selected_personal_use_mvp_coverage_sprint_gate_a",
  };
}
