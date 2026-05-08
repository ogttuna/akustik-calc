import {
  buildGateBBSteelFloorFormulaSameStackIsoDeltaLwResidualPolicyDecisionContract,
  type GateBBSteelFloorFormulaResidualPolicyDecisionRow,
} from "./steel-floor-formula-same-stack-iso-delta-lw-residual-policy-decision";
import {
  type SteelFloorFormulaResidualPolicyBlocker,
} from "./steel-floor-formula-residual-policy";
import {
  STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB,
  STEEL_FLOOR_FORMULA_LN_W_TOLERANCE_DB,
} from "./steel-floor-impact-formula-corridor";

export const GATE_BC_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_RESIDUAL_BLOCKER_CLOSURE_SELECTED_NEXT_FILE =
  "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-bd-steel-floor-formula-same-stack-iso-delta-lw-holdout-closure-contract.test.ts";

export const GATE_BC_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_RESIDUAL_BLOCKER_CLOSURE_SELECTED_NEXT_ACTION =
  "gate_bd_steel_floor_formula_same_stack_iso_delta_lw_holdout_closure_plan";

export type GateBCSteelFloorFormulaResidualBlockerClosureLaneId =
  | "field_building_basis_owner_closure"
  | "open_web_formula_input_ownership_closure"
  | "paired_negative_boundary_closure"
  | "same_stack_iso_delta_lw_holdout_count_closure";

export type GateBCSteelFloorFormulaResidualBlockerClosureDecision =
  | "blocked_policy_decision_not_admitted"
  | "ranked_followup_closure_lane"
  | "selected_next_narrow_closure_lane";

export type GateBCSteelFloorFormulaResidualBlockerClosureLaneInput = {
  readonly laneId: GateBCSteelFloorFormulaResidualBlockerClosureLaneId;
  readonly policyDecisionRow: GateBBSteelFloorFormulaResidualPolicyDecisionRow;
};

export type GateBCSteelFloorFormulaResidualBlockerClosureLane =
  GateBCSteelFloorFormulaResidualBlockerClosureLaneInput & {
    readonly associatedBlocker: SteelFloorFormulaResidualPolicyBlocker;
    readonly blockerPresent: boolean;
    readonly broadSourceCrawlAllowed: false;
    readonly canMoveRuntimeNow: false;
    readonly canPromoteExactSourceNow: false;
    readonly closureDecision: GateBCSteelFloorFormulaResidualBlockerClosureDecision;
    readonly closureLaneScope:
      | "basis_owner_closure"
      | "carrier_formula_input_owner_closure"
      | "metric_holdout_count_closure"
      | "paired_negative_boundary_closure";
    readonly closureReadinessImpact:
      | "basis_scope_readiness"
      | "formula_input_owner_readiness"
      | "negative_boundary_count_readiness"
      | "residual_case_count_readiness";
    readonly measuredMetricValueIngestedForRuntime: false;
    readonly priorityRank: number;
    readonly selectedForNextGate: boolean;
    readonly shortfallCount: number | null;
    readonly sourceDocumentCopied: false;
    readonly sourceTextIngested: false;
    readonly toleranceChangeAllowedNow: false;
  };

export type GateBCSteelFloorFormulaSameStackIsoDeltaLwResidualBlockerClosureContract = {
  readonly acceptedPolicyDecisionInputIds: readonly string[];
  readonly blockedCurrentPolicyDecisionInputIds: readonly string[];
  readonly blockedProbePolicyDecisionInputIds: readonly string[];
  readonly closureLaneRanking: readonly GateBCSteelFloorFormulaResidualBlockerClosureLane[];
  readonly exactSourceOverridePolicy: {
    readonly exactMeasuredRowsRemainPrecedence: true;
    readonly fullAssemblyExactMatchRequired: true;
    readonly residualBlockerClosureRowsAreNotExactRows: true;
  };
  readonly fieldAndBuildingBasisSeparation: {
    readonly fieldOrAstmBasisCanEnterLabResidualPolicy: false;
    readonly labDeltaLwCanAliasFieldMetrics: false;
  };
  readonly landedGate: "gate_bc_steel_floor_formula_same_stack_iso_delta_lw_residual_blocker_closure_plan";
  readonly previousLandedGate: "gate_bb_steel_floor_formula_same_stack_iso_delta_lw_residual_policy_decision_plan";
  readonly residualBlockerClosurePolicy: {
    readonly broadSourceCrawlAllowed: false;
    readonly exactOverrideAllowedNow: false;
    readonly gateBBAcceptedPolicyDecisionRowsOnly: true;
    readonly policyDecisionRowsAreEvidenceNotRuntimeAction: true;
    readonly rejectedOrBlockedPolicyRowsRemainBlocked: true;
    readonly runtimeRetuneAllowedNow: false;
    readonly selectedLaneCanMoveRuntimeNow: false;
    readonly selectedLaneCanMoveToleranceNow: false;
    readonly sourceDocumentCopyAllowed: false;
    readonly sourceTextIngestionAllowed: false;
  };
  readonly runtimePins: {
    readonly deltaLwToleranceDb: typeof STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB;
    readonly estimateDeltaLw: 22.4;
    readonly estimateLnW: 55.6;
    readonly lnWToleranceDb: typeof STEEL_FLOOR_FORMULA_LN_W_TOLERANCE_DB;
    readonly runtimeRetuneAllowedNow: false;
    readonly runtimeValueMovement: false;
  };
  readonly selectedClosureLane: GateBCSteelFloorFormulaResidualBlockerClosureLane;
  readonly selectedClosureLaneIds: readonly ["same_stack_iso_delta_lw_holdout_count_closure"];
  readonly selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1";
  readonly selectedNextAction: typeof GATE_BC_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_RESIDUAL_BLOCKER_CLOSURE_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof GATE_BC_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_RESIDUAL_BLOCKER_CLOSURE_SELECTED_NEXT_FILE;
  readonly selectionStatus: "gate_bc_same_stack_iso_delta_lw_residual_blocker_closure_landed_no_runtime_selected_holdout_closure_gate_bd";
};

const gateBBResidualPolicyDecisionContract =
  buildGateBBSteelFloorFormulaSameStackIsoDeltaLwResidualPolicyDecisionContract();

const laneMetadata = (
  laneId: GateBCSteelFloorFormulaResidualBlockerClosureLaneId,
): Pick<
  GateBCSteelFloorFormulaResidualBlockerClosureLane,
  | "associatedBlocker"
  | "closureLaneScope"
  | "closureReadinessImpact"
  | "priorityRank"
> => {
  switch (laneId) {
    case "same_stack_iso_delta_lw_holdout_count_closure":
      return {
        associatedBlocker: "holdout_count_below_policy_threshold",
        closureLaneScope: "metric_holdout_count_closure",
        closureReadinessImpact: "residual_case_count_readiness",
        priorityRank: 1,
      };
    case "paired_negative_boundary_closure":
      return {
        associatedBlocker: "paired_negative_boundaries_missing",
        closureLaneScope: "paired_negative_boundary_closure",
        closureReadinessImpact: "negative_boundary_count_readiness",
        priorityRank: 2,
      };
    case "open_web_formula_input_ownership_closure":
      return {
        associatedBlocker: "open_web_formula_inputs_not_source_owned",
        closureLaneScope: "carrier_formula_input_owner_closure",
        closureReadinessImpact: "formula_input_owner_readiness",
        priorityRank: 3,
      };
    case "field_building_basis_owner_closure":
      return {
        associatedBlocker: "field_and_building_basis_owners_missing",
        closureLaneScope: "basis_owner_closure",
        closureReadinessImpact: "basis_scope_readiness",
        priorityRank: 4,
      };
  }
};

const shortfallForLane = (
  laneId: GateBCSteelFloorFormulaResidualBlockerClosureLaneId,
  policyDecisionRow: GateBBSteelFloorFormulaResidualPolicyDecisionRow,
): number | null => {
  switch (laneId) {
    case "same_stack_iso_delta_lw_holdout_count_closure":
      return policyDecisionRow.blockerClosureRequirements.holdoutCountShortfall;
    case "paired_negative_boundary_closure":
      return policyDecisionRow.blockerClosureRequirements
        .pairedNegativeBoundaryShortfall;
    case "open_web_formula_input_ownership_closure":
    case "field_building_basis_owner_closure":
      return null;
  }
};

export function classifyGateBCSteelFloorFormulaSameStackIsoDeltaLwResidualBlockerClosureLane(
  input: GateBCSteelFloorFormulaResidualBlockerClosureLaneInput,
): GateBCSteelFloorFormulaResidualBlockerClosureLane {
  const metadata = laneMetadata(input.laneId);
  const blockerPresent = input.policyDecisionRow.blockers.includes(
    metadata.associatedBlocker,
  );
  const selectedForNextGate =
    input.policyDecisionRow.acceptedForPolicyDecision &&
    input.laneId === "same_stack_iso_delta_lw_holdout_count_closure" &&
    blockerPresent;

  const closureDecision =
    input.policyDecisionRow.acceptedForPolicyDecision && blockerPresent
      ? selectedForNextGate
        ? "selected_next_narrow_closure_lane"
        : "ranked_followup_closure_lane"
      : "blocked_policy_decision_not_admitted";

  return {
    ...input,
    ...metadata,
    blockerPresent,
    broadSourceCrawlAllowed: false,
    canMoveRuntimeNow: false,
    canPromoteExactSourceNow: false,
    closureDecision,
    measuredMetricValueIngestedForRuntime: false,
    selectedForNextGate,
    shortfallCount: shortfallForLane(input.laneId, input.policyDecisionRow),
    sourceDocumentCopied: false,
    sourceTextIngested: false,
    toleranceChangeAllowedNow: false,
  };
}

const closureLaneIds = [
  "same_stack_iso_delta_lw_holdout_count_closure",
  "paired_negative_boundary_closure",
  "open_web_formula_input_ownership_closure",
  "field_building_basis_owner_closure",
] satisfies readonly GateBCSteelFloorFormulaResidualBlockerClosureLaneId[];

const acceptedPolicyDecisionRows =
  gateBBResidualPolicyDecisionContract.packetPolicyDecisionProbeRows.filter(
    (row) => row.acceptedForPolicyDecision,
  );

const closureLaneInputs = acceptedPolicyDecisionRows.flatMap((row) =>
  closureLaneIds.map((laneId) => ({
    laneId,
    policyDecisionRow: row,
  })),
) satisfies readonly GateBCSteelFloorFormulaResidualBlockerClosureLaneInput[];

export function buildGateBCSteelFloorFormulaSameStackIsoDeltaLwResidualBlockerClosureContract():
  GateBCSteelFloorFormulaSameStackIsoDeltaLwResidualBlockerClosureContract {
  const closureLaneRanking = closureLaneInputs
    .map(
      classifyGateBCSteelFloorFormulaSameStackIsoDeltaLwResidualBlockerClosureLane,
    )
    .sort((a, b) => a.priorityRank - b.priorityRank);
  const selectedClosureLane = closureLaneRanking.find(
    (lane) => lane.selectedForNextGate,
  );

  if (!selectedClosureLane) {
    throw new Error("Gate BC expected a selected blocker-closure lane.");
  }

  return {
    acceptedPolicyDecisionInputIds: acceptedPolicyDecisionRows.map(
      (row) => row.id,
    ),
    blockedCurrentPolicyDecisionInputIds:
      gateBBResidualPolicyDecisionContract.currentPolicyDecisionRows
        .filter((row) => !row.acceptedForPolicyDecision)
        .map((row) => row.id),
    blockedProbePolicyDecisionInputIds:
      gateBBResidualPolicyDecisionContract.packetPolicyDecisionProbeRows
        .filter((row) => !row.acceptedForPolicyDecision)
        .map((row) => row.id),
    closureLaneRanking,
    exactSourceOverridePolicy: {
      exactMeasuredRowsRemainPrecedence: true,
      fullAssemblyExactMatchRequired: true,
      residualBlockerClosureRowsAreNotExactRows: true,
    },
    fieldAndBuildingBasisSeparation: {
      fieldOrAstmBasisCanEnterLabResidualPolicy: false,
      labDeltaLwCanAliasFieldMetrics: false,
    },
    landedGate:
      "gate_bc_steel_floor_formula_same_stack_iso_delta_lw_residual_blocker_closure_plan",
    previousLandedGate:
      "gate_bb_steel_floor_formula_same_stack_iso_delta_lw_residual_policy_decision_plan",
    residualBlockerClosurePolicy: {
      broadSourceCrawlAllowed: false,
      exactOverrideAllowedNow: false,
      gateBBAcceptedPolicyDecisionRowsOnly: true,
      policyDecisionRowsAreEvidenceNotRuntimeAction: true,
      rejectedOrBlockedPolicyRowsRemainBlocked: true,
      runtimeRetuneAllowedNow: false,
      selectedLaneCanMoveRuntimeNow: false,
      selectedLaneCanMoveToleranceNow: false,
      sourceDocumentCopyAllowed: false,
      sourceTextIngestionAllowed: false,
    },
    runtimePins: {
      deltaLwToleranceDb: STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB,
      estimateDeltaLw: 22.4,
      estimateLnW: 55.6,
      lnWToleranceDb: STEEL_FLOOR_FORMULA_LN_W_TOLERANCE_DB,
      runtimeRetuneAllowedNow: false,
      runtimeValueMovement: false,
    },
    selectedClosureLane,
    selectedClosureLaneIds: [
      "same_stack_iso_delta_lw_holdout_count_closure",
    ],
    selectedImplementationSlice:
      "calculator_model_first_physics_prediction_pivot_v1",
    selectedNextAction:
      GATE_BC_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_RESIDUAL_BLOCKER_CLOSURE_SELECTED_NEXT_ACTION,
    selectedNextFile:
      GATE_BC_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_RESIDUAL_BLOCKER_CLOSURE_SELECTED_NEXT_FILE,
    selectionStatus:
      "gate_bc_same_stack_iso_delta_lw_residual_blocker_closure_landed_no_runtime_selected_holdout_closure_gate_bd",
  };
}
