import {
  GATE_AW_REQUIRED_PACKET_LOCATOR_METADATA_FIELDS,
  type GateAWSteelFloorFormulaPacketLocatorMetadataField,
} from "./steel-floor-formula-same-stack-iso-delta-lw-packet-acquisition-readiness";
import {
  buildGateAZSteelFloorFormulaSameStackIsoDeltaLwPacketCalibrationCandidateContract,
  type GateAZSteelFloorFormulaPacketCalibrationCandidateRow,
} from "./steel-floor-formula-same-stack-iso-delta-lw-packet-calibration-candidate";
import {
  evaluateSteelFloorFormulaResidualMetricPolicy,
  type SteelFloorFormulaResidualMetricPolicy,
} from "./steel-floor-formula-residual-policy";
import {
  STEEL_FLOOR_DELTA_LW_REQUIRED_SOURCE_OWNER_FIELDS,
  type SteelFloorDeltaLwRequiredSourceOwnerField,
} from "./steel-floor-formula-source-owned-delta-lw-holdout";
import {
  STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB,
  STEEL_FLOOR_FORMULA_LN_W_TOLERANCE_DB,
} from "./steel-floor-impact-formula-corridor";

export const GATE_BA_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_RESIDUAL_ADMISSION_BOUNDARY_SELECTED_NEXT_FILE =
  "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-bb-steel-floor-formula-same-stack-iso-delta-lw-residual-policy-decision-contract.test.ts";

export const GATE_BA_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_RESIDUAL_ADMISSION_BOUNDARY_SELECTED_NEXT_ACTION =
  "gate_bb_steel_floor_formula_same_stack_iso_delta_lw_residual_policy_decision_plan";

export const GATE_BA_REQUIRED_DELTA_LW_RESIDUAL_HOLDOUT_COUNT = 3;
export const GATE_BA_REQUIRED_PAIRED_NEGATIVE_BOUNDARY_COUNT = 4;

export type GateBASteelFloorFormulaResidualAdmissionDecision =
  | "accepted_residual_evaluation_boundary"
  | "blocked_missing_rights_safe_citation_locator_metadata"
  | "blocked_missing_source_owned_packet_fields"
  | "blocked_not_calibration_evidence_candidate"
  | "blocked_wrong_metric_basis_or_reference";

export type GateBASteelFloorFormulaResidualAdmissionBoundaryInput = {
  readonly calibrationCandidateRow: GateAZSteelFloorFormulaPacketCalibrationCandidateRow;
  readonly id: string;
};

export type GateBASteelFloorFormulaResidualAdmissionBoundaryRow =
  GateBASteelFloorFormulaResidualAdmissionBoundaryInput & {
    readonly acceptedForResidualEvaluation: boolean;
    readonly admissionDecision: GateBASteelFloorFormulaResidualAdmissionDecision;
    readonly canMoveRuntimeNow: false;
    readonly canPromoteExactSourceNow: false;
    readonly canRetuneRuntimeNow: false;
    readonly exactSourceOverrideAllowedNow: false;
    readonly fieldBuildingAliasAllowedNow: false;
    readonly measuredMetricValueIngestedForRuntime: false;
    readonly measuredMetricValuePreservedForResidualPolicy: boolean;
    readonly missingCitationLocatorMetadataFields: readonly GateAWSteelFloorFormulaPacketLocatorMetadataField[];
    readonly missingSourceOwnedFields: readonly SteelFloorDeltaLwRequiredSourceOwnerField[];
    readonly pairedNegativeBoundaryCount: number;
    readonly residualAdmissionUse:
      | "blocked_residual_admission_boundary"
      | "residual_policy_evaluation_boundary";
    readonly residualCaseCount: number;
    readonly residualEvaluationAllowed: boolean;
    readonly residualPolicyIfAdmitted: SteelFloorFormulaResidualMetricPolicy | null;
    readonly residualPolicyRuntimeMovementAllowedNow: false;
    readonly runtimeValueMovement: false;
    readonly sourceDocumentCopied: false;
    readonly sourceRowsAreResidualEvidenceNotProduct: true;
    readonly sourceTextIngested: false;
    readonly toleranceChangeAllowedNow: false;
  };

export type GateBASteelFloorFormulaSameStackIsoDeltaLwResidualAdmissionBoundaryContract = {
  readonly acceptedResidualAdmissionProbeIds: readonly string[];
  readonly currentAcceptedResidualAdmissionIds: readonly string[];
  readonly currentRejectedResidualAdmissionIds: readonly string[];
  readonly currentResidualAdmissionBoundaryRows: readonly GateBASteelFloorFormulaResidualAdmissionBoundaryRow[];
  readonly exactSourceOverridePolicy: {
    readonly exactMeasuredRowsRemainPrecedence: true;
    readonly fullAssemblyExactMatchRequired: true;
    readonly residualAdmissionRowsAreNotExactRows: true;
  };
  readonly fieldAndBuildingBasisSeparation: {
    readonly fieldOrAstmBasisCanEnterLabResidualPolicy: false;
    readonly labDeltaLwCanAliasFieldMetrics: false;
  };
  readonly landedGate: "gate_ba_steel_floor_formula_same_stack_iso_delta_lw_residual_admission_boundary_plan";
  readonly packetResidualAdmissionProbeRows: readonly GateBASteelFloorFormulaResidualAdmissionBoundaryRow[];
  readonly previousLandedGate: "gate_az_steel_floor_formula_same_stack_iso_delta_lw_packet_calibration_candidate_plan";
  readonly rejectedResidualAdmissionProbeIds: readonly string[];
  readonly residualAdmissionBoundaryPolicy: {
    readonly allGateATAKOwnerFieldsRequired: true;
    readonly calibrationCandidatesCanEnterResidualEvaluationBoundary: true;
    readonly currentRequestStatusRowsRemainBlocked: true;
    readonly exactOverrideAllowedNow: false;
    readonly gateAZAcceptedCalibrationCandidatesOnly: true;
    readonly labIso101407172BasisRequired: true;
    readonly measuredMetricValueRuntimeIngestionAllowed: false;
    readonly rejectedGateAZCandidatesRemainBlocked: true;
    readonly residualPolicyDecisionCanMoveRuntimeNow: false;
    readonly residualPolicyEvaluationAllowedAtBoundaryOnly: true;
    readonly rightsSafeCitationLocatorMetadataRequired: true;
    readonly runtimeRetuneAllowedNow: false;
    readonly sameStackSteelReferenceRequired: true;
    readonly sourceDocumentCopyAllowed: false;
    readonly sourceOwnedMeasuredDeltaLwRequired: true;
    readonly sourceTextIngestionAllowed: false;
    readonly toleranceChangeAllowedNow: false;
  };
  readonly residualAdmissionBoundarySurface: {
    readonly currentDeltaLwToleranceDb: typeof STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB;
    readonly measuredMetricIds: readonly ["DeltaLw"];
    readonly metricBasis: "lab_iso_10140_717_2";
    readonly referenceFloor: "same_stack_steel";
    readonly requiredCitationLocatorMetadataFields: readonly GateAWSteelFloorFormulaPacketLocatorMetadataField[];
    readonly requiredPacketOwnerFields: readonly SteelFloorDeltaLwRequiredSourceOwnerField[];
    readonly residualPolicyThreshold: {
      readonly requiredDeltaLwHoldoutCount: typeof GATE_BA_REQUIRED_DELTA_LW_RESIDUAL_HOLDOUT_COUNT;
      readonly requiredPairedNegativeBoundaryCount: typeof GATE_BA_REQUIRED_PAIRED_NEGATIVE_BOUNDARY_COUNT;
    };
    readonly selectedOwner: "accepted_source_owned_same_stack_iso_delta_lw_holdouts";
    readonly selectedTermId: "source_owned_delta_lw_holdout_absence";
    readonly usesGateAZAcceptedCalibrationCandidatesOnly: true;
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
  readonly selectedNextAction: typeof GATE_BA_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_RESIDUAL_ADMISSION_BOUNDARY_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof GATE_BA_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_RESIDUAL_ADMISSION_BOUNDARY_SELECTED_NEXT_FILE;
  readonly selectionStatus: "gate_ba_same_stack_iso_delta_lw_residual_admission_boundary_landed_no_runtime_selected_residual_policy_decision_gate_bb";
};

const gateAZPacketCalibrationCandidateContract =
  buildGateAZSteelFloorFormulaSameStackIsoDeltaLwPacketCalibrationCandidateContract();

const uniqueOwnerFields = (
  fields: readonly SteelFloorDeltaLwRequiredSourceOwnerField[],
): readonly SteelFloorDeltaLwRequiredSourceOwnerField[] =>
  STEEL_FLOOR_DELTA_LW_REQUIRED_SOURCE_OWNER_FIELDS.filter((field) =>
    fields.includes(field),
  );

const missingOwnerFields = (
  fields: readonly SteelFloorDeltaLwRequiredSourceOwnerField[],
): readonly SteelFloorDeltaLwRequiredSourceOwnerField[] => {
  const ownedFields = new Set(uniqueOwnerFields(fields));
  return STEEL_FLOOR_DELTA_LW_REQUIRED_SOURCE_OWNER_FIELDS.filter(
    (field) => !ownedFields.has(field),
  );
};

const withMissingMetricValueWhenNeeded = (
  row: GateAZSteelFloorFormulaPacketCalibrationCandidateRow,
): readonly SteelFloorDeltaLwRequiredSourceOwnerField[] => {
  const sourcePacket = row.acceptedPacketBoundaryRow.sourcePacket;
  if (sourcePacket === null) {
    return STEEL_FLOOR_DELTA_LW_REQUIRED_SOURCE_OWNER_FIELDS;
  }

  const missing = new Set(missingOwnerFields(sourcePacket.sourceOwnedFields));
  const hasMeasuredDeltaLw =
    typeof sourcePacket.measuredDeltaLwDb === "number" &&
    Number.isFinite(sourcePacket.measuredDeltaLwDb);
  if (!hasMeasuredDeltaLw) {
    missing.add("metric_value");
  }
  if (!row.acceptedPacketBoundaryRow.pairedNegativeBoundaryOwned) {
    missing.add("paired_negative_boundary_owner");
  }
  for (const field of row.missingSourceOwnedFields) {
    missing.add(field);
  }

  return STEEL_FLOOR_DELTA_LW_REQUIRED_SOURCE_OWNER_FIELDS.filter((field) =>
    missing.has(field),
  );
};

const isSameStackIsoDeltaLwPacket = (
  row: GateAZSteelFloorFormulaPacketCalibrationCandidateRow,
): boolean => {
  const sourcePacket = row.acceptedPacketBoundaryRow.sourcePacket;
  return (
    sourcePacket !== null &&
    sourcePacket.basis === "lab_iso_10140_717_2" &&
    sourcePacket.referenceFloor === "same_stack_steel" &&
    sourcePacket.sourceKind === "source_owned_same_stack_lab_delta_lw"
  );
};

const roundedDb = (value: number): number => Math.round(value * 10) / 10;

const residualPolicyForAcceptedCandidate = (
  row: GateAZSteelFloorFormulaPacketCalibrationCandidateRow,
): SteelFloorFormulaResidualMetricPolicy => {
  const sourcePacket = row.acceptedPacketBoundaryRow.sourcePacket;
  if (sourcePacket === null || sourcePacket.measuredDeltaLwDb === null) {
    throw new Error(
      `Gate BA residual admission requires a measured DeltaLw packet: ${row.id}`,
    );
  }

  const residualDb = roundedDb(
    Math.abs(sourcePacket.measuredDeltaLwDb - 22.4),
  );
  const residualCaseCount = Math.max(0, sourcePacket.representedRowCount);
  const pairedNegativeBoundaryCount =
    row.acceptedPacketBoundaryRow.pairedNegativeBoundaryOwned ? 1 : 0;

  return evaluateSteelFloorFormulaResidualMetricPolicy({
    currentToleranceDb: STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB,
    fieldAndBuildingBasisOwnersPresent: false,
    maxAbsoluteResidualDb: residualDb,
    meanAbsoluteResidualDb: residualDb,
    metricId: "DeltaLw",
    openWebFormulaInputsSourceOwned: false,
    pairedNegativeBoundaryCount,
    requiredHoldoutCount: GATE_BA_REQUIRED_DELTA_LW_RESIDUAL_HOLDOUT_COUNT,
    requiredPairedNegativeBoundaryCount:
      GATE_BA_REQUIRED_PAIRED_NEGATIVE_BOUNDARY_COUNT,
    residualCaseCount,
    sourceOwnedCorrectionAvailable: false,
    sourceOwnedMetricHoldoutsPresent: residualCaseCount > 0,
  });
};

export function classifyGateBASteelFloorFormulaSameStackIsoDeltaLwResidualAdmissionBoundary(
  input: GateBASteelFloorFormulaResidualAdmissionBoundaryInput,
): GateBASteelFloorFormulaResidualAdmissionBoundaryRow {
  const calibrationCandidateRow = input.calibrationCandidateRow;
  const missingCitationLocatorMetadataFields =
    calibrationCandidateRow.missingCitationLocatorMetadataFields;
  const missingSourceOwnedFields =
    withMissingMetricValueWhenNeeded(calibrationCandidateRow);

  let admissionDecision: GateBASteelFloorFormulaResidualAdmissionDecision;
  if (
    calibrationCandidateRow.candidateDecision ===
    "blocked_missing_rights_safe_citation_locator_metadata"
  ) {
    admissionDecision =
      "blocked_missing_rights_safe_citation_locator_metadata";
  } else if (
    calibrationCandidateRow.candidateDecision ===
    "blocked_missing_source_owned_packet_fields"
  ) {
    admissionDecision = "blocked_missing_source_owned_packet_fields";
  } else if (!calibrationCandidateRow.canBecomeCalibrationEvidenceCandidate) {
    admissionDecision = "blocked_not_calibration_evidence_candidate";
  } else if (missingCitationLocatorMetadataFields.length > 0) {
    admissionDecision =
      "blocked_missing_rights_safe_citation_locator_metadata";
  } else if (!isSameStackIsoDeltaLwPacket(calibrationCandidateRow)) {
    admissionDecision = "blocked_wrong_metric_basis_or_reference";
  } else if (missingSourceOwnedFields.length > 0) {
    admissionDecision = "blocked_missing_source_owned_packet_fields";
  } else {
    admissionDecision = "accepted_residual_evaluation_boundary";
  }

  const residualEvaluationAllowed =
    admissionDecision === "accepted_residual_evaluation_boundary";
  const sourcePacket =
    calibrationCandidateRow.acceptedPacketBoundaryRow.sourcePacket;
  const residualCaseCount =
    residualEvaluationAllowed && sourcePacket !== null
      ? Math.max(0, sourcePacket.representedRowCount)
      : 0;
  const pairedNegativeBoundaryCount =
    residualEvaluationAllowed &&
    calibrationCandidateRow.acceptedPacketBoundaryRow.pairedNegativeBoundaryOwned
      ? 1
      : 0;
  const residualPolicyIfAdmitted = residualEvaluationAllowed
    ? residualPolicyForAcceptedCandidate(calibrationCandidateRow)
    : null;

  return {
    ...input,
    acceptedForResidualEvaluation: residualEvaluationAllowed,
    admissionDecision,
    canMoveRuntimeNow: false,
    canPromoteExactSourceNow: false,
    canRetuneRuntimeNow: false,
    exactSourceOverrideAllowedNow: false,
    fieldBuildingAliasAllowedNow: false,
    measuredMetricValueIngestedForRuntime: false,
    measuredMetricValuePreservedForResidualPolicy: residualEvaluationAllowed,
    missingCitationLocatorMetadataFields,
    missingSourceOwnedFields,
    pairedNegativeBoundaryCount,
    residualAdmissionUse: residualEvaluationAllowed
      ? "residual_policy_evaluation_boundary"
      : "blocked_residual_admission_boundary",
    residualCaseCount,
    residualEvaluationAllowed,
    residualPolicyIfAdmitted,
    residualPolicyRuntimeMovementAllowedNow: false,
    runtimeValueMovement: false,
    sourceDocumentCopied: false,
    sourceRowsAreResidualEvidenceNotProduct: true,
    sourceTextIngested: false,
    toleranceChangeAllowedNow: false,
  };
}

const currentResidualAdmissionBoundaryInputs =
  gateAZPacketCalibrationCandidateContract.currentCalibrationCandidateRows.map(
    (row) => ({
      calibrationCandidateRow: row,
      id: `gate_ba_current_${row.id}_residual_admission`,
    }),
  ) satisfies readonly GateBASteelFloorFormulaResidualAdmissionBoundaryInput[];

const packetResidualAdmissionProbeInputs =
  gateAZPacketCalibrationCandidateContract.packetCalibrationCandidateProbeRows.map(
    (row) => ({
      calibrationCandidateRow: row,
      id: `gate_ba_probe_${row.id}_residual_admission`,
    }),
  ) satisfies readonly GateBASteelFloorFormulaResidualAdmissionBoundaryInput[];

export function buildGateBASteelFloorFormulaSameStackIsoDeltaLwResidualAdmissionBoundaryContract():
  GateBASteelFloorFormulaSameStackIsoDeltaLwResidualAdmissionBoundaryContract {
  const currentResidualAdmissionBoundaryRows =
    currentResidualAdmissionBoundaryInputs.map(
      classifyGateBASteelFloorFormulaSameStackIsoDeltaLwResidualAdmissionBoundary,
    );
  const packetResidualAdmissionProbeRows =
    packetResidualAdmissionProbeInputs.map(
      classifyGateBASteelFloorFormulaSameStackIsoDeltaLwResidualAdmissionBoundary,
    );
  const currentAcceptedResidualAdmissionIds =
    currentResidualAdmissionBoundaryRows
      .filter((row) => row.residualEvaluationAllowed)
      .map((row) => row.id);
  const currentRejectedResidualAdmissionIds =
    currentResidualAdmissionBoundaryRows
      .filter((row) => !row.residualEvaluationAllowed)
      .map((row) => row.id);
  const acceptedResidualAdmissionProbeIds =
    packetResidualAdmissionProbeRows
      .filter((row) => row.residualEvaluationAllowed)
      .map((row) => row.id);
  const rejectedResidualAdmissionProbeIds =
    packetResidualAdmissionProbeRows
      .filter((row) => !row.residualEvaluationAllowed)
      .map((row) => row.id);

  return {
    acceptedResidualAdmissionProbeIds,
    currentAcceptedResidualAdmissionIds,
    currentRejectedResidualAdmissionIds,
    currentResidualAdmissionBoundaryRows,
    exactSourceOverridePolicy: {
      exactMeasuredRowsRemainPrecedence: true,
      fullAssemblyExactMatchRequired: true,
      residualAdmissionRowsAreNotExactRows: true,
    },
    fieldAndBuildingBasisSeparation: {
      fieldOrAstmBasisCanEnterLabResidualPolicy: false,
      labDeltaLwCanAliasFieldMetrics: false,
    },
    landedGate:
      "gate_ba_steel_floor_formula_same_stack_iso_delta_lw_residual_admission_boundary_plan",
    packetResidualAdmissionProbeRows,
    previousLandedGate:
      "gate_az_steel_floor_formula_same_stack_iso_delta_lw_packet_calibration_candidate_plan",
    rejectedResidualAdmissionProbeIds,
    residualAdmissionBoundaryPolicy: {
      allGateATAKOwnerFieldsRequired: true,
      calibrationCandidatesCanEnterResidualEvaluationBoundary: true,
      currentRequestStatusRowsRemainBlocked: true,
      exactOverrideAllowedNow: false,
      gateAZAcceptedCalibrationCandidatesOnly: true,
      labIso101407172BasisRequired: true,
      measuredMetricValueRuntimeIngestionAllowed: false,
      rejectedGateAZCandidatesRemainBlocked: true,
      residualPolicyDecisionCanMoveRuntimeNow: false,
      residualPolicyEvaluationAllowedAtBoundaryOnly: true,
      rightsSafeCitationLocatorMetadataRequired: true,
      runtimeRetuneAllowedNow: false,
      sameStackSteelReferenceRequired: true,
      sourceDocumentCopyAllowed: false,
      sourceOwnedMeasuredDeltaLwRequired: true,
      sourceTextIngestionAllowed: false,
      toleranceChangeAllowedNow: false,
    },
    residualAdmissionBoundarySurface: {
      currentDeltaLwToleranceDb: STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB,
      measuredMetricIds: ["DeltaLw"],
      metricBasis: "lab_iso_10140_717_2",
      referenceFloor: "same_stack_steel",
      requiredCitationLocatorMetadataFields:
        GATE_AW_REQUIRED_PACKET_LOCATOR_METADATA_FIELDS,
      requiredPacketOwnerFields:
        STEEL_FLOOR_DELTA_LW_REQUIRED_SOURCE_OWNER_FIELDS,
      residualPolicyThreshold: {
        requiredDeltaLwHoldoutCount:
          GATE_BA_REQUIRED_DELTA_LW_RESIDUAL_HOLDOUT_COUNT,
        requiredPairedNegativeBoundaryCount:
          GATE_BA_REQUIRED_PAIRED_NEGATIVE_BOUNDARY_COUNT,
      },
      selectedOwner: "accepted_source_owned_same_stack_iso_delta_lw_holdouts",
      selectedTermId: "source_owned_delta_lw_holdout_absence",
      usesGateAZAcceptedCalibrationCandidatesOnly: true,
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
      GATE_BA_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_RESIDUAL_ADMISSION_BOUNDARY_SELECTED_NEXT_ACTION,
    selectedNextFile:
      GATE_BA_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_RESIDUAL_ADMISSION_BOUNDARY_SELECTED_NEXT_FILE,
    selectionStatus:
      "gate_ba_same_stack_iso_delta_lw_residual_admission_boundary_landed_no_runtime_selected_residual_policy_decision_gate_bb",
  };
}
