import {
  GATE_BA_REQUIRED_DELTA_LW_RESIDUAL_HOLDOUT_COUNT,
  GATE_BA_REQUIRED_PAIRED_NEGATIVE_BOUNDARY_COUNT,
} from "./steel-floor-formula-same-stack-iso-delta-lw-residual-admission-boundary";
import {
  GATE_BD_REQUIRED_ADDITIONAL_SAME_STACK_ISO_DELTA_LW_HOLDOUT_COUNT,
} from "./steel-floor-formula-same-stack-iso-delta-lw-holdout-closure";
import {
  GATE_BE_REQUIRED_ADDITIONAL_PAIRED_NEGATIVE_BOUNDARY_COUNT,
} from "./steel-floor-formula-same-stack-iso-delta-lw-paired-negative-closure";
import {
  GATE_BF_REQUIRED_SOURCE_OWNED_OPEN_WEB_FORMULA_INPUT_PACKET_COUNT,
} from "./steel-floor-formula-same-stack-iso-delta-lw-open-web-input-ownership-closure";
import {
  GATE_BG_REQUIRED_BUILDING_BASIS_OWNER_PACKET_COUNT,
  GATE_BG_REQUIRED_FIELD_BASIS_OWNER_PACKET_COUNT,
  buildGateBGSteelFloorFormulaSameStackIsoDeltaLwFieldBuildingBasisOwnerClosureContract,
  type GateBGSteelFloorFormulaSameStackIsoDeltaLwFieldBuildingBasisOwnerClosureContract,
} from "./steel-floor-formula-same-stack-iso-delta-lw-field-building-basis-owner-closure";
import {
  evaluateSteelFloorFormulaResidualMetricPolicy,
  type SteelFloorFormulaResidualMetricPolicy,
  type SteelFloorFormulaResidualPolicyBlocker,
  type SteelFloorFormulaResidualPolicyDecision,
} from "./steel-floor-formula-residual-policy";
import {
  STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB,
  STEEL_FLOOR_FORMULA_LN_W_TOLERANCE_DB,
} from "./steel-floor-impact-formula-corridor";

export const GATE_BH_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_RESIDUAL_POLICY_CLOSED_OWNER_REVALIDATION_SELECTED_NEXT_FILE =
  "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-bi-steel-floor-formula-same-stack-iso-delta-lw-tighten-candidate-governance-contract.test.ts";

export const GATE_BH_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_RESIDUAL_POLICY_CLOSED_OWNER_REVALIDATION_SELECTED_NEXT_ACTION =
  "gate_bi_steel_floor_formula_same_stack_iso_delta_lw_tighten_candidate_governance_plan";

export const GATE_BH_REQUIRED_CLOSED_OWNER_MAP_GATE_IDS = [
  "gate_bd_holdout_count_closure",
  "gate_be_paired_negative_boundary_closure",
  "gate_bf_open_web_formula_input_ownership_closure",
  "gate_bg_field_building_basis_owner_closure",
] as const;

export type GateBHSteelFloorFormulaClosedOwnerMapGateId =
  (typeof GATE_BH_REQUIRED_CLOSED_OWNER_MAP_GATE_IDS)[number];

export type GateBHSteelFloorFormulaClosedOwnerPolicyDecisionClassification =
  | "blocked_gate_bg_next_lane_not_residual_policy_closed_owner_revalidation"
  | "hold_current_corridor_after_closed_owner_revalidation"
  | "retune_candidate_requires_later_gate"
  | "tighten_candidate_requires_later_gate"
  | "widen_candidate_requires_later_gate";

export type GateBHSteelFloorFormulaClosedOwnerRequirement = {
  readonly acceptedCount: number;
  readonly blocker: SteelFloorFormulaResidualPolicyBlocker;
  readonly closed: boolean;
  readonly closureEvidenceUse:
    | "residual_policy_readiness_evidence_only"
    | "residual_readiness_evidence_only";
  readonly gateId: GateBHSteelFloorFormulaClosedOwnerMapGateId;
  readonly requiredCount: number;
  readonly runtimeValueMovement: false;
  readonly sourceRowsAreResidualReadinessEvidenceNotProduct: true;
};

export type GateBHSteelFloorFormulaClosedOwnerMap = {
  readonly allResidualPolicyOwnerBlockersClosed: boolean;
  readonly closedOwnerResidualCaseCount: number;
  readonly currentAdmittedDeltaLwHoldoutCount: number;
  readonly currentPairedNegativeBoundaryCount: number;
  readonly fieldAndBuildingBasisOwnersPresent: boolean;
  readonly openWebFormulaInputsSourceOwned: boolean;
  readonly policyOnlyAdditionalDeltaLwHoldoutCount: number;
  readonly policyOnlyAdditionalPairedNegativeBoundaryCount: number;
  readonly requirements: readonly GateBHSteelFloorFormulaClosedOwnerRequirement[];
  readonly sourceOwnedMetricHoldoutsPresent: boolean;
  readonly totalPairedNegativeBoundaryCount: number;
};

export type GateBHSteelFloorFormulaClosedOwnerResidualEvidence = {
  readonly closureRowsUsedAsMeasuredRuntimeEvidence: false;
  readonly maxAbsoluteResidualDb: number | null;
  readonly meanAbsoluteResidualDb: number | null;
  readonly measuredMetricValueIngestedForRuntime: false;
  readonly policyOnlyClosureResidualValuesDb: readonly number[];
  readonly policyOnlyResidualValuesDb: readonly number[];
};

export type GateBHSteelFloorFormulaResidualPolicyClosedOwnerRevalidationInput = {
  readonly fieldBuildingBasisOwnerClosureContract: GateBGSteelFloorFormulaSameStackIsoDeltaLwFieldBuildingBasisOwnerClosureContract;
  readonly id: string;
};

export type GateBHSteelFloorFormulaResidualPolicyClosedOwnerRevalidationRow =
  GateBHSteelFloorFormulaResidualPolicyClosedOwnerRevalidationInput & {
    readonly acceptedForClosedOwnerRevalidation: boolean;
    readonly canMoveRuntimeNow: false;
    readonly canPromoteExactSourceNow: false;
    readonly canRetuneRuntimeNow: false;
    readonly canUseAsExactMeasuredRow: false;
    readonly closedOwnerMap: GateBHSteelFloorFormulaClosedOwnerMap;
    readonly closedOwnerPolicy: SteelFloorFormulaResidualMetricPolicy | null;
    readonly decisionClassification: GateBHSteelFloorFormulaClosedOwnerPolicyDecisionClassification;
    readonly exactSourceOverrideAllowedNow: false;
    readonly fieldBuildingAliasAllowedNow: false;
    readonly measuredMetricValueIngestedForRuntime: false;
    readonly policyDecision: SteelFloorFormulaResidualPolicyDecision | null;
    readonly policyDecisionIsRuntimeAction: false;
    readonly residualEvidence: GateBHSteelFloorFormulaClosedOwnerResidualEvidence;
    readonly residualPolicyDecisionUse:
      | "blocked_closed_owner_revalidation_input"
      | "closed_owner_policy_revalidation_only";
    readonly runtimeRetuneAllowedNow: false;
    readonly runtimeValueMovement: false;
    readonly sourceDocumentCopied: false;
    readonly sourceRowsArePolicyEvidenceNotProduct: true;
    readonly sourceTextIngested: false;
    readonly toleranceChangeAllowedNow: false;
  };

export type GateBHSteelFloorFormulaSameStackIsoDeltaLwResidualPolicyClosedOwnerRevalidationContract = {
  readonly closedOwnerDecisionSummary: {
    readonly currentDecisionBeforeClosure: "hold";
    readonly closedOwnerPolicyDecision: SteelFloorFormulaResidualPolicyDecision | null;
    readonly selectedCandidate: "tighten_candidate_policy_signal_only";
    readonly selectedNextGateReason: "tighten_candidate_requires_later_governance_before_any_tolerance_change";
    readonly toleranceOrRuntimeMovementAllowedNow: false;
  };
  readonly closedOwnerRevalidationRow: GateBHSteelFloorFormulaResidualPolicyClosedOwnerRevalidationRow;
  readonly exactSourceOverridePolicy: {
    readonly closedOwnerRevalidationRowsAreNotExactRows: true;
    readonly exactMeasuredRowsRemainPrecedence: true;
    readonly fullAssemblyExactMatchRequired: true;
  };
  readonly fieldAndBuildingBasisSeparation: {
    readonly buildingPredictionRequiresOwnContextBeforeRuntime: true;
    readonly fieldImpactRequiresOwnContextBeforeRuntime: true;
    readonly fieldOrAstmBasisCanEnterLabResidualPolicy: false;
    readonly labDeltaLwCanAliasFieldMetrics: false;
    readonly labLnWCanAliasApparentOrBuildingMetrics: false;
  };
  readonly landedGate: "gate_bh_steel_floor_formula_same_stack_iso_delta_lw_residual_policy_closed_owner_revalidation_plan";
  readonly previousLandedGate: "gate_bg_steel_floor_formula_same_stack_iso_delta_lw_field_building_basis_owner_closure_plan";
  readonly residualPolicyClosedOwnerRevalidationPolicy: {
    readonly closedOwnerDecisionCanMoveRuntimeNow: false;
    readonly closedOwnerDecisionCanMoveToleranceNow: false;
    readonly closureRowsAreEvidenceNotRuntimeAction: true;
    readonly exactOverrideAllowedNow: false;
    readonly gateBGSelectedResidualPolicyClosedOwnerRevalidationOnly: true;
    readonly labIso101407172BasisRequired: true;
    readonly laterGateRequiredBeforeTightenRetuneOrWiden: true;
    readonly runtimeRetuneAllowedNow: false;
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
  readonly selectedFieldBuildingBasisOwnerClosureInput: GateBGSteelFloorFormulaSameStackIsoDeltaLwFieldBuildingBasisOwnerClosureContract;
  readonly selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1";
  readonly selectedNextAction: typeof GATE_BH_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_RESIDUAL_POLICY_CLOSED_OWNER_REVALIDATION_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof GATE_BH_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_RESIDUAL_POLICY_CLOSED_OWNER_REVALIDATION_SELECTED_NEXT_FILE;
  readonly selectionStatus: "gate_bh_same_stack_iso_delta_lw_residual_policy_closed_owner_revalidation_landed_no_runtime_selected_tighten_candidate_governance_gate_bi";
};

const gateBGFieldBuildingBasisOwnerClosureContract =
  buildGateBGSteelFloorFormulaSameStackIsoDeltaLwFieldBuildingBasisOwnerClosureContract();

const roundedDb = (value: number): number => Math.round(value * 10) / 10;

const repeatedResidualValues = (
  residualDb: number | null,
  representedRowCount: number,
): readonly number[] => {
  if (residualDb === null || representedRowCount <= 0) {
    return [];
  }

  return Array.from({ length: representedRowCount }, () => residualDb);
};

const meanResidual = (values: readonly number[]): number | null => {
  if (values.length === 0) {
    return null;
  }

  return roundedDb(values.reduce((sum, value) => sum + value, 0) / values.length);
};

const selectedGateBGLaneIsClosedOwnerRevalidation = (
  contract: GateBGSteelFloorFormulaSameStackIsoDeltaLwFieldBuildingBasisOwnerClosureContract,
): boolean =>
  contract.fieldBuildingBasisOwnerReadiness.selectedNextClosureLaneId ===
  "residual_policy_closed_owner_revalidation";

const classificationForDecision = (
  acceptedForClosedOwnerRevalidation: boolean,
  decision: SteelFloorFormulaResidualPolicyDecision | null,
): GateBHSteelFloorFormulaClosedOwnerPolicyDecisionClassification => {
  if (!acceptedForClosedOwnerRevalidation) {
    return "blocked_gate_bg_next_lane_not_residual_policy_closed_owner_revalidation";
  }

  switch (decision) {
    case "hold":
      return "hold_current_corridor_after_closed_owner_revalidation";
    case "retune_candidate":
      return "retune_candidate_requires_later_gate";
    case "tighten":
      return "tighten_candidate_requires_later_gate";
    case "widen":
      return "widen_candidate_requires_later_gate";
    case null:
      return "blocked_gate_bg_next_lane_not_residual_policy_closed_owner_revalidation";
  }
};

export function classifyGateBHSteelFloorFormulaSameStackIsoDeltaLwResidualPolicyClosedOwnerRevalidation(
  input: GateBHSteelFloorFormulaResidualPolicyClosedOwnerRevalidationInput,
): GateBHSteelFloorFormulaResidualPolicyClosedOwnerRevalidationRow {
  const gateBG = input.fieldBuildingBasisOwnerClosureContract;
  const gateBF = gateBG.selectedOpenWebInputOwnershipClosureInput;
  const gateBE = gateBF.selectedPairedNegativeClosureInput;
  const gateBD = gateBE.selectedHoldoutClosureInput;
  const admittedResidualRow =
    gateBD.selectedClosureLaneInput.policyDecisionRow.residualAdmissionRow;
  const admittedResidualPolicy = admittedResidualRow.residualPolicyIfAdmitted;

  const acceptedHoldoutRows = gateBD.holdoutClosureProbeRows.filter(
    (row) => row.closureEvidenceAccepted,
  );
  const policyOnlyClosureResidualValues = acceptedHoldoutRows.flatMap((row) => {
    const sourcePacket = row.sourcePacket;
    if (sourcePacket === null || sourcePacket.measuredDeltaLwDb === null) {
      return [];
    }

    const residualDb = roundedDb(
      Math.abs(sourcePacket.measuredDeltaLwDb - 22.4),
    );
    return repeatedResidualValues(residualDb, sourcePacket.representedRowCount);
  });

  // Gate BA exposes one admitted future probe through aggregate residual
  // policy stats. Gate BH combines that policy-only residual with BD
  // policy-only closure holdouts, while keeping every closure row out of
  // runtime evidence and exact-source promotion.
  const admittedResidualValues = repeatedResidualValues(
    admittedResidualPolicy?.maxAbsoluteResidualDb ?? null,
    admittedResidualRow.residualCaseCount,
  );
  const policyOnlyResidualValues = [
    ...admittedResidualValues,
    ...policyOnlyClosureResidualValues,
  ];
  const maxAbsoluteResidualDb =
    policyOnlyResidualValues.length > 0
      ? Math.max(...policyOnlyResidualValues)
      : null;
  const meanAbsoluteResidualDb = meanResidual(policyOnlyResidualValues);

  const currentAdmittedDeltaLwHoldoutCount =
    admittedResidualRow.residualCaseCount;
  const policyOnlyAdditionalDeltaLwHoldoutCount =
    gateBD.futureHoldoutClosureReadiness.acceptedAdditionalHoldoutCount;
  const closedOwnerResidualCaseCount =
    currentAdmittedDeltaLwHoldoutCount +
    policyOnlyAdditionalDeltaLwHoldoutCount;
  const currentPairedNegativeBoundaryCount =
    admittedResidualRow.pairedNegativeBoundaryCount;
  const policyOnlyAdditionalPairedNegativeBoundaryCount =
    gateBE.pairedNegativeReadiness.acceptedAdditionalPairedNegativeBoundaryCount;
  const totalPairedNegativeBoundaryCount =
    currentPairedNegativeBoundaryCount +
    policyOnlyAdditionalPairedNegativeBoundaryCount;
  const fieldAndBuildingBasisOwnersPresent =
    gateBG.fieldBuildingBasisOwnerReadiness.fieldBuildingBasisOwnerClosureComplete;
  const openWebFormulaInputsSourceOwned =
    gateBF.openWebInputOwnershipReadiness.openWebFormulaInputOwnershipComplete;
  const sourceOwnedMetricHoldoutsPresent = closedOwnerResidualCaseCount > 0;

  const requirements: readonly GateBHSteelFloorFormulaClosedOwnerRequirement[] = [
    {
      acceptedCount: policyOnlyAdditionalDeltaLwHoldoutCount,
      blocker: "holdout_count_below_policy_threshold",
      closed:
        policyOnlyAdditionalDeltaLwHoldoutCount >=
        GATE_BD_REQUIRED_ADDITIONAL_SAME_STACK_ISO_DELTA_LW_HOLDOUT_COUNT,
      closureEvidenceUse: "residual_readiness_evidence_only",
      gateId: "gate_bd_holdout_count_closure",
      requiredCount:
        GATE_BD_REQUIRED_ADDITIONAL_SAME_STACK_ISO_DELTA_LW_HOLDOUT_COUNT,
      runtimeValueMovement: false,
      sourceRowsAreResidualReadinessEvidenceNotProduct: true,
    },
    {
      acceptedCount: policyOnlyAdditionalPairedNegativeBoundaryCount,
      blocker: "paired_negative_boundaries_missing",
      closed:
        policyOnlyAdditionalPairedNegativeBoundaryCount >=
        GATE_BE_REQUIRED_ADDITIONAL_PAIRED_NEGATIVE_BOUNDARY_COUNT,
      closureEvidenceUse: "residual_policy_readiness_evidence_only",
      gateId: "gate_be_paired_negative_boundary_closure",
      requiredCount: GATE_BE_REQUIRED_ADDITIONAL_PAIRED_NEGATIVE_BOUNDARY_COUNT,
      runtimeValueMovement: false,
      sourceRowsAreResidualReadinessEvidenceNotProduct: true,
    },
    {
      acceptedCount:
        gateBF.openWebInputOwnershipReadiness
          .acceptedSourceOwnedOpenWebFormulaInputPacketCount,
      blocker: "open_web_formula_inputs_not_source_owned",
      closed: openWebFormulaInputsSourceOwned,
      closureEvidenceUse: "residual_policy_readiness_evidence_only",
      gateId: "gate_bf_open_web_formula_input_ownership_closure",
      requiredCount:
        GATE_BF_REQUIRED_SOURCE_OWNED_OPEN_WEB_FORMULA_INPUT_PACKET_COUNT,
      runtimeValueMovement: false,
      sourceRowsAreResidualReadinessEvidenceNotProduct: true,
    },
    {
      acceptedCount:
        gateBG.fieldBuildingBasisOwnerReadiness.acceptedFieldBasisOwnerPacketCount +
        gateBG.fieldBuildingBasisOwnerReadiness
          .acceptedBuildingBasisOwnerPacketCount,
      blocker: "field_and_building_basis_owners_missing",
      closed: fieldAndBuildingBasisOwnersPresent,
      closureEvidenceUse: "residual_policy_readiness_evidence_only",
      gateId: "gate_bg_field_building_basis_owner_closure",
      requiredCount:
        GATE_BG_REQUIRED_FIELD_BASIS_OWNER_PACKET_COUNT +
        GATE_BG_REQUIRED_BUILDING_BASIS_OWNER_PACKET_COUNT,
      runtimeValueMovement: false,
      sourceRowsAreResidualReadinessEvidenceNotProduct: true,
    },
  ];
  const allResidualPolicyOwnerBlockersClosed = requirements.every(
    (entry) => entry.closed,
  );
  const acceptedForClosedOwnerRevalidation =
    selectedGateBGLaneIsClosedOwnerRevalidation(gateBG) &&
    allResidualPolicyOwnerBlockersClosed;
  const closedOwnerPolicy = acceptedForClosedOwnerRevalidation
    ? evaluateSteelFloorFormulaResidualMetricPolicy({
        currentToleranceDb: STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB,
        fieldAndBuildingBasisOwnersPresent,
        maxAbsoluteResidualDb,
        meanAbsoluteResidualDb,
        metricId: "DeltaLw",
        openWebFormulaInputsSourceOwned,
        pairedNegativeBoundaryCount: totalPairedNegativeBoundaryCount,
        requiredHoldoutCount: GATE_BA_REQUIRED_DELTA_LW_RESIDUAL_HOLDOUT_COUNT,
        requiredPairedNegativeBoundaryCount:
          GATE_BA_REQUIRED_PAIRED_NEGATIVE_BOUNDARY_COUNT,
        residualCaseCount: closedOwnerResidualCaseCount,
        sourceOwnedCorrectionAvailable: false,
        sourceOwnedMetricHoldoutsPresent,
      })
    : null;
  const policyDecision = closedOwnerPolicy?.decision ?? null;

  return {
    ...input,
    acceptedForClosedOwnerRevalidation,
    canMoveRuntimeNow: false,
    canPromoteExactSourceNow: false,
    canRetuneRuntimeNow: false,
    canUseAsExactMeasuredRow: false,
    closedOwnerMap: {
      allResidualPolicyOwnerBlockersClosed,
      closedOwnerResidualCaseCount,
      currentAdmittedDeltaLwHoldoutCount,
      currentPairedNegativeBoundaryCount,
      fieldAndBuildingBasisOwnersPresent,
      openWebFormulaInputsSourceOwned,
      policyOnlyAdditionalDeltaLwHoldoutCount,
      policyOnlyAdditionalPairedNegativeBoundaryCount,
      requirements,
      sourceOwnedMetricHoldoutsPresent,
      totalPairedNegativeBoundaryCount,
    },
    closedOwnerPolicy,
    decisionClassification: classificationForDecision(
      acceptedForClosedOwnerRevalidation,
      policyDecision,
    ),
    exactSourceOverrideAllowedNow: false,
    fieldBuildingAliasAllowedNow: false,
    measuredMetricValueIngestedForRuntime: false,
    policyDecision,
    policyDecisionIsRuntimeAction: false,
    residualEvidence: {
      closureRowsUsedAsMeasuredRuntimeEvidence: false,
      maxAbsoluteResidualDb,
      meanAbsoluteResidualDb,
      measuredMetricValueIngestedForRuntime: false,
      policyOnlyClosureResidualValuesDb: policyOnlyClosureResidualValues,
      policyOnlyResidualValuesDb: policyOnlyResidualValues,
    },
    residualPolicyDecisionUse: acceptedForClosedOwnerRevalidation
      ? "closed_owner_policy_revalidation_only"
      : "blocked_closed_owner_revalidation_input",
    runtimeRetuneAllowedNow: false,
    runtimeValueMovement: false,
    sourceDocumentCopied: false,
    sourceRowsArePolicyEvidenceNotProduct: true,
    sourceTextIngested: false,
    toleranceChangeAllowedNow: false,
  };
}

export function buildGateBHSteelFloorFormulaSameStackIsoDeltaLwResidualPolicyClosedOwnerRevalidationContract():
  GateBHSteelFloorFormulaSameStackIsoDeltaLwResidualPolicyClosedOwnerRevalidationContract {
  const closedOwnerRevalidationRow =
    classifyGateBHSteelFloorFormulaSameStackIsoDeltaLwResidualPolicyClosedOwnerRevalidation(
      {
        fieldBuildingBasisOwnerClosureContract:
          gateBGFieldBuildingBasisOwnerClosureContract,
        id: "gate_bh_closed_owner_residual_policy_revalidation",
      },
    );

  return {
    closedOwnerDecisionSummary: {
      currentDecisionBeforeClosure: "hold",
      closedOwnerPolicyDecision: closedOwnerRevalidationRow.policyDecision,
      selectedCandidate: "tighten_candidate_policy_signal_only",
      selectedNextGateReason:
        "tighten_candidate_requires_later_governance_before_any_tolerance_change",
      toleranceOrRuntimeMovementAllowedNow: false,
    },
    closedOwnerRevalidationRow,
    exactSourceOverridePolicy: {
      closedOwnerRevalidationRowsAreNotExactRows: true,
      exactMeasuredRowsRemainPrecedence: true,
      fullAssemblyExactMatchRequired: true,
    },
    fieldAndBuildingBasisSeparation: {
      buildingPredictionRequiresOwnContextBeforeRuntime: true,
      fieldImpactRequiresOwnContextBeforeRuntime: true,
      fieldOrAstmBasisCanEnterLabResidualPolicy: false,
      labDeltaLwCanAliasFieldMetrics: false,
      labLnWCanAliasApparentOrBuildingMetrics: false,
    },
    landedGate:
      "gate_bh_steel_floor_formula_same_stack_iso_delta_lw_residual_policy_closed_owner_revalidation_plan",
    previousLandedGate:
      "gate_bg_steel_floor_formula_same_stack_iso_delta_lw_field_building_basis_owner_closure_plan",
    residualPolicyClosedOwnerRevalidationPolicy: {
      closedOwnerDecisionCanMoveRuntimeNow: false,
      closedOwnerDecisionCanMoveToleranceNow: false,
      closureRowsAreEvidenceNotRuntimeAction: true,
      exactOverrideAllowedNow: false,
      gateBGSelectedResidualPolicyClosedOwnerRevalidationOnly: true,
      labIso101407172BasisRequired: true,
      laterGateRequiredBeforeTightenRetuneOrWiden: true,
      runtimeRetuneAllowedNow: false,
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
    selectedFieldBuildingBasisOwnerClosureInput:
      gateBGFieldBuildingBasisOwnerClosureContract,
    selectedImplementationSlice:
      "calculator_model_first_physics_prediction_pivot_v1",
    selectedNextAction:
      GATE_BH_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_RESIDUAL_POLICY_CLOSED_OWNER_REVALIDATION_SELECTED_NEXT_ACTION,
    selectedNextFile:
      GATE_BH_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_RESIDUAL_POLICY_CLOSED_OWNER_REVALIDATION_SELECTED_NEXT_FILE,
    selectionStatus:
      "gate_bh_same_stack_iso_delta_lw_residual_policy_closed_owner_revalidation_landed_no_runtime_selected_tighten_candidate_governance_gate_bi",
  };
}
