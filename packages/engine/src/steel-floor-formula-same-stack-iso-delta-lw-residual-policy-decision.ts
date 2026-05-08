import {
  buildGateBASteelFloorFormulaSameStackIsoDeltaLwResidualAdmissionBoundaryContract,
  GATE_BA_REQUIRED_DELTA_LW_RESIDUAL_HOLDOUT_COUNT,
  GATE_BA_REQUIRED_PAIRED_NEGATIVE_BOUNDARY_COUNT,
  type GateBASteelFloorFormulaResidualAdmissionBoundaryRow,
} from "./steel-floor-formula-same-stack-iso-delta-lw-residual-admission-boundary";
import {
  type SteelFloorFormulaResidualMetricPolicy,
  type SteelFloorFormulaResidualPolicyBlocker,
  type SteelFloorFormulaResidualPolicyDecision,
} from "./steel-floor-formula-residual-policy";
import {
  STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB,
  STEEL_FLOOR_FORMULA_LN_W_TOLERANCE_DB,
} from "./steel-floor-impact-formula-corridor";

export const GATE_BB_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_RESIDUAL_POLICY_DECISION_SELECTED_NEXT_FILE =
  "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-bc-steel-floor-formula-same-stack-iso-delta-lw-residual-blocker-closure-contract.test.ts";

export const GATE_BB_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_RESIDUAL_POLICY_DECISION_SELECTED_NEXT_ACTION =
  "gate_bc_steel_floor_formula_same_stack_iso_delta_lw_residual_blocker_closure_plan";

export type GateBBSteelFloorFormulaResidualPolicyDecisionClassification =
  | "blocked_no_residual_policy_input"
  | "hold_current_corridor_policy_decision"
  | "retune_candidate_requires_later_gate"
  | "tighten_candidate_requires_later_gate"
  | "widen_candidate_requires_later_gate";

export type GateBBSteelFloorFormulaResidualPolicyDecisionInput = {
  readonly id: string;
  readonly residualAdmissionRow: GateBASteelFloorFormulaResidualAdmissionBoundaryRow;
};

export type GateBBSteelFloorFormulaResidualPolicyDecisionRow =
  GateBBSteelFloorFormulaResidualPolicyDecisionInput & {
    readonly acceptedForPolicyDecision: boolean;
    readonly blockerClosureRequirements: {
      readonly fieldAndBuildingBasisOwnersRequired: boolean;
      readonly holdoutCountShortfall: number;
      readonly openWebFormulaInputsSourceOwnedRequired: boolean;
      readonly pairedNegativeBoundaryShortfall: number;
      readonly sourceOwnedCorrectionRequiredBeforeRetune: boolean;
    };
    readonly blockers: readonly SteelFloorFormulaResidualPolicyBlocker[];
    readonly canMoveRuntimeNow: false;
    readonly canPromoteExactSourceNow: false;
    readonly canSelectLaterRetuneGate: boolean;
    readonly canSelectLaterTightenGate: boolean;
    readonly canSelectLaterWidenGate: boolean;
    readonly canUseAsExactMeasuredRow: false;
    readonly decisionClassification: GateBBSteelFloorFormulaResidualPolicyDecisionClassification;
    readonly exactSourceOverrideAllowedNow: false;
    readonly fieldBuildingAliasAllowedNow: false;
    readonly measuredMetricValueIngestedForRuntime: false;
    readonly policyDecision: SteelFloorFormulaResidualPolicyDecision | null;
    readonly policyDecisionIsRuntimeAction: false;
    readonly residualPolicy: SteelFloorFormulaResidualMetricPolicy | null;
    readonly residualPolicyDecisionUse:
      | "blocked_policy_decision_input"
      | "residual_policy_decision_only";
    readonly runtimeRetuneAllowedNow: false;
    readonly runtimeValueMovement: false;
    readonly sourceDocumentCopied: false;
    readonly sourceRowsArePolicyEvidenceNotProduct: true;
    readonly sourceTextIngested: false;
    readonly toleranceChangeAllowedNow: false;
  };

export type GateBBSteelFloorFormulaSameStackIsoDeltaLwResidualPolicyDecisionContract = {
  readonly acceptedPolicyDecisionProbeIds: readonly string[];
  readonly blockedPolicyDecisionProbeIds: readonly string[];
  readonly currentPolicyDecisionRows: readonly GateBBSteelFloorFormulaResidualPolicyDecisionRow[];
  readonly exactSourceOverridePolicy: {
    readonly exactMeasuredRowsRemainPrecedence: true;
    readonly fullAssemblyExactMatchRequired: true;
    readonly residualPolicyDecisionRowsAreNotExactRows: true;
  };
  readonly fieldAndBuildingBasisSeparation: {
    readonly fieldOrAstmBasisCanEnterLabResidualPolicy: false;
    readonly labDeltaLwCanAliasFieldMetrics: false;
  };
  readonly heldPolicyDecisionProbeIds: readonly string[];
  readonly landedGate: "gate_bb_steel_floor_formula_same_stack_iso_delta_lw_residual_policy_decision_plan";
  readonly overallDecision: "hold_current_steel_floor_formula_corridor";
  readonly packetPolicyDecisionProbeRows: readonly GateBBSteelFloorFormulaResidualPolicyDecisionRow[];
  readonly previousLandedGate: "gate_ba_steel_floor_formula_same_stack_iso_delta_lw_residual_admission_boundary_plan";
  readonly residualPolicyDecisionPolicy: {
    readonly exactOverrideAllowedNow: false;
    readonly gateBAResidualAdmittedRowsOnly: true;
    readonly holdDecisionBlocksRuntimeMovement: true;
    readonly labIso101407172BasisRequired: true;
    readonly policyDecisionCanMoveRuntimeNow: false;
    readonly policyDecisionCanMoveToleranceNow: false;
    readonly policyDecisionRowsAreEvidenceNotRuntimeAction: true;
    readonly rejectedOrBlockedAdmissionRowsRemainBlocked: true;
    readonly runtimeRetuneAllowedNow: false;
    readonly sameStackSteelReferenceRequired: true;
    readonly sourceDocumentCopyAllowed: false;
    readonly sourceTextIngestionAllowed: false;
  };
  readonly residualPolicyDecisionSurface: {
    readonly blockerClosureOwner: "same_stack_iso_delta_lw_residual_blocker_closure";
    readonly currentDeltaLwToleranceDb: typeof STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB;
    readonly currentMetricId: "DeltaLw";
    readonly requiredDeltaLwHoldoutCount: typeof GATE_BA_REQUIRED_DELTA_LW_RESIDUAL_HOLDOUT_COUNT;
    readonly requiredFieldAndBuildingBasisOwners: true;
    readonly requiredOpenWebFormulaInputOwnership: true;
    readonly requiredPairedNegativeBoundaryCount: typeof GATE_BA_REQUIRED_PAIRED_NEGATIVE_BOUNDARY_COUNT;
    readonly selectedTermId: "source_owned_delta_lw_holdout_absence";
  };
  readonly runtimePins: {
    readonly deltaLwToleranceDb: typeof STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB;
    readonly estimateDeltaLw: 22.4;
    readonly estimateLnW: 55.6;
    readonly lnWToleranceDb: typeof STEEL_FLOOR_FORMULA_LN_W_TOLERANCE_DB;
    readonly runtimeRetuneAllowedNow: false;
    readonly runtimeValueMovement: false;
  };
  readonly selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1";
  readonly selectedNextAction: typeof GATE_BB_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_RESIDUAL_POLICY_DECISION_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof GATE_BB_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_RESIDUAL_POLICY_DECISION_SELECTED_NEXT_FILE;
  readonly selectionStatus: "gate_bb_same_stack_iso_delta_lw_residual_policy_decision_landed_no_runtime_selected_blocker_closure_gate_bc";
};

const gateBAResidualAdmissionContract =
  buildGateBASteelFloorFormulaSameStackIsoDeltaLwResidualAdmissionBoundaryContract();

const decisionClassificationFor = (
  decision: SteelFloorFormulaResidualPolicyDecision | null,
): GateBBSteelFloorFormulaResidualPolicyDecisionClassification => {
  switch (decision) {
    case "hold":
      return "hold_current_corridor_policy_decision";
    case "retune_candidate":
      return "retune_candidate_requires_later_gate";
    case "tighten":
      return "tighten_candidate_requires_later_gate";
    case "widen":
      return "widen_candidate_requires_later_gate";
    case null:
      return "blocked_no_residual_policy_input";
  }
};

const includesBlocker = (
  blockers: readonly SteelFloorFormulaResidualPolicyBlocker[],
  blocker: SteelFloorFormulaResidualPolicyBlocker,
): boolean => blockers.includes(blocker);

const blockerClosureRequirementsFor = (
  row: GateBASteelFloorFormulaResidualAdmissionBoundaryRow,
  policy: SteelFloorFormulaResidualMetricPolicy | null,
): GateBBSteelFloorFormulaResidualPolicyDecisionRow["blockerClosureRequirements"] => {
  const blockers = policy?.blockers ?? [];
  const threshold = policy?.threshold ?? {
    requiredHoldoutCount: GATE_BA_REQUIRED_DELTA_LW_RESIDUAL_HOLDOUT_COUNT,
    requiredPairedNegativeBoundaryCount:
      GATE_BA_REQUIRED_PAIRED_NEGATIVE_BOUNDARY_COUNT,
  };
  const residualCaseCount = policy?.residualCaseCount ?? row.residualCaseCount;

  return {
    fieldAndBuildingBasisOwnersRequired: includesBlocker(
      blockers,
      "field_and_building_basis_owners_missing",
    ),
    holdoutCountShortfall: Math.max(
      0,
      threshold.requiredHoldoutCount - residualCaseCount,
    ),
    openWebFormulaInputsSourceOwnedRequired: includesBlocker(
      blockers,
      "open_web_formula_inputs_not_source_owned",
    ),
    pairedNegativeBoundaryShortfall: Math.max(
      0,
      threshold.requiredPairedNegativeBoundaryCount -
        row.pairedNegativeBoundaryCount,
    ),
    sourceOwnedCorrectionRequiredBeforeRetune: includesBlocker(
      blockers,
      "source_owned_correction_missing",
    ),
  };
};

export function classifyGateBBSteelFloorFormulaSameStackIsoDeltaLwResidualPolicyDecision(
  input: GateBBSteelFloorFormulaResidualPolicyDecisionInput,
): GateBBSteelFloorFormulaResidualPolicyDecisionRow {
  const residualAdmissionRow = input.residualAdmissionRow;
  const residualPolicy = residualAdmissionRow.residualPolicyIfAdmitted;
  const acceptedForPolicyDecision =
    residualAdmissionRow.residualEvaluationAllowed && residualPolicy !== null;
  const policyDecision = residualPolicy?.decision ?? null;
  const decisionClassification = decisionClassificationFor(policyDecision);

  return {
    ...input,
    acceptedForPolicyDecision,
    blockerClosureRequirements: blockerClosureRequirementsFor(
      residualAdmissionRow,
      residualPolicy,
    ),
    blockers: residualPolicy?.blockers ?? [],
    canMoveRuntimeNow: false,
    canPromoteExactSourceNow: false,
    canSelectLaterRetuneGate: policyDecision === "retune_candidate",
    canSelectLaterTightenGate: policyDecision === "tighten",
    canSelectLaterWidenGate: policyDecision === "widen",
    canUseAsExactMeasuredRow: false,
    decisionClassification,
    exactSourceOverrideAllowedNow: false,
    fieldBuildingAliasAllowedNow: false,
    measuredMetricValueIngestedForRuntime: false,
    policyDecision,
    policyDecisionIsRuntimeAction: false,
    residualPolicy,
    residualPolicyDecisionUse: acceptedForPolicyDecision
      ? "residual_policy_decision_only"
      : "blocked_policy_decision_input",
    runtimeRetuneAllowedNow: false,
    runtimeValueMovement: false,
    sourceDocumentCopied: false,
    sourceRowsArePolicyEvidenceNotProduct: true,
    sourceTextIngested: false,
    toleranceChangeAllowedNow: false,
  };
}

const currentPolicyDecisionInputs =
  gateBAResidualAdmissionContract.currentResidualAdmissionBoundaryRows.map(
    (row) => ({
      id: `gate_bb_current_${row.id}_policy_decision`,
      residualAdmissionRow: row,
    }),
  ) satisfies readonly GateBBSteelFloorFormulaResidualPolicyDecisionInput[];

const packetPolicyDecisionProbeInputs =
  gateBAResidualAdmissionContract.packetResidualAdmissionProbeRows.map(
    (row) => ({
      id: `gate_bb_probe_${row.id}_policy_decision`,
      residualAdmissionRow: row,
    }),
  ) satisfies readonly GateBBSteelFloorFormulaResidualPolicyDecisionInput[];

export function buildGateBBSteelFloorFormulaSameStackIsoDeltaLwResidualPolicyDecisionContract():
  GateBBSteelFloorFormulaSameStackIsoDeltaLwResidualPolicyDecisionContract {
  const currentPolicyDecisionRows = currentPolicyDecisionInputs.map(
    classifyGateBBSteelFloorFormulaSameStackIsoDeltaLwResidualPolicyDecision,
  );
  const packetPolicyDecisionProbeRows = packetPolicyDecisionProbeInputs.map(
    classifyGateBBSteelFloorFormulaSameStackIsoDeltaLwResidualPolicyDecision,
  );
  const acceptedPolicyDecisionProbeIds = packetPolicyDecisionProbeRows
    .filter((row) => row.acceptedForPolicyDecision)
    .map((row) => row.id);
  const blockedPolicyDecisionProbeIds = packetPolicyDecisionProbeRows
    .filter((row) => !row.acceptedForPolicyDecision)
    .map((row) => row.id);
  const heldPolicyDecisionProbeIds = packetPolicyDecisionProbeRows
    .filter((row) => row.policyDecision === "hold")
    .map((row) => row.id);

  return {
    acceptedPolicyDecisionProbeIds,
    blockedPolicyDecisionProbeIds,
    currentPolicyDecisionRows,
    exactSourceOverridePolicy: {
      exactMeasuredRowsRemainPrecedence: true,
      fullAssemblyExactMatchRequired: true,
      residualPolicyDecisionRowsAreNotExactRows: true,
    },
    fieldAndBuildingBasisSeparation: {
      fieldOrAstmBasisCanEnterLabResidualPolicy: false,
      labDeltaLwCanAliasFieldMetrics: false,
    },
    heldPolicyDecisionProbeIds,
    landedGate:
      "gate_bb_steel_floor_formula_same_stack_iso_delta_lw_residual_policy_decision_plan",
    overallDecision: "hold_current_steel_floor_formula_corridor",
    packetPolicyDecisionProbeRows,
    previousLandedGate:
      "gate_ba_steel_floor_formula_same_stack_iso_delta_lw_residual_admission_boundary_plan",
    residualPolicyDecisionPolicy: {
      exactOverrideAllowedNow: false,
      gateBAResidualAdmittedRowsOnly: true,
      holdDecisionBlocksRuntimeMovement: true,
      labIso101407172BasisRequired: true,
      policyDecisionCanMoveRuntimeNow: false,
      policyDecisionCanMoveToleranceNow: false,
      policyDecisionRowsAreEvidenceNotRuntimeAction: true,
      rejectedOrBlockedAdmissionRowsRemainBlocked: true,
      runtimeRetuneAllowedNow: false,
      sameStackSteelReferenceRequired: true,
      sourceDocumentCopyAllowed: false,
      sourceTextIngestionAllowed: false,
    },
    residualPolicyDecisionSurface: {
      blockerClosureOwner: "same_stack_iso_delta_lw_residual_blocker_closure",
      currentDeltaLwToleranceDb: STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB,
      currentMetricId: "DeltaLw",
      requiredDeltaLwHoldoutCount:
        GATE_BA_REQUIRED_DELTA_LW_RESIDUAL_HOLDOUT_COUNT,
      requiredFieldAndBuildingBasisOwners: true,
      requiredOpenWebFormulaInputOwnership: true,
      requiredPairedNegativeBoundaryCount:
        GATE_BA_REQUIRED_PAIRED_NEGATIVE_BOUNDARY_COUNT,
      selectedTermId: "source_owned_delta_lw_holdout_absence",
    },
    runtimePins: {
      deltaLwToleranceDb: STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB,
      estimateDeltaLw: 22.4,
      estimateLnW: 55.6,
      lnWToleranceDb: STEEL_FLOOR_FORMULA_LN_W_TOLERANCE_DB,
      runtimeRetuneAllowedNow: false,
      runtimeValueMovement: false,
    },
    selectedImplementationSlice:
      "calculator_model_first_physics_prediction_pivot_v1",
    selectedNextAction:
      GATE_BB_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_RESIDUAL_POLICY_DECISION_SELECTED_NEXT_ACTION,
    selectedNextFile:
      GATE_BB_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_RESIDUAL_POLICY_DECISION_SELECTED_NEXT_FILE,
    selectionStatus:
      "gate_bb_same_stack_iso_delta_lw_residual_policy_decision_landed_no_runtime_selected_blocker_closure_gate_bc",
  };
}
