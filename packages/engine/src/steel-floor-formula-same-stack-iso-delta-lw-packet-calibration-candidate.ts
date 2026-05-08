import {
  GATE_AW_REQUIRED_PACKET_LOCATOR_METADATA_FIELDS,
  type GateAWSteelFloorFormulaPacketLocatorMetadataField,
} from "./steel-floor-formula-same-stack-iso-delta-lw-packet-acquisition-readiness";
import {
  buildGateAYSteelFloorFormulaSameStackIsoDeltaLwPacketAcceptanceBoundaryContract,
  type GateAYSteelFloorFormulaPacketAcceptanceBoundaryRow,
} from "./steel-floor-formula-same-stack-iso-delta-lw-packet-acceptance-boundary";
import {
  STEEL_FLOOR_DELTA_LW_REQUIRED_SOURCE_OWNER_FIELDS,
  type SteelFloorDeltaLwRequiredSourceOwnerField,
} from "./steel-floor-formula-source-owned-delta-lw-holdout";
import {
  STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB,
  STEEL_FLOOR_FORMULA_LN_W_TOLERANCE_DB,
} from "./steel-floor-impact-formula-corridor";

export const GATE_AZ_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_PACKET_CALIBRATION_CANDIDATE_SELECTED_NEXT_FILE =
  "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ba-steel-floor-formula-same-stack-iso-delta-lw-residual-admission-boundary-contract.test.ts";

export const GATE_AZ_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_PACKET_CALIBRATION_CANDIDATE_SELECTED_NEXT_ACTION =
  "gate_ba_steel_floor_formula_same_stack_iso_delta_lw_residual_admission_boundary_plan";

export type GateAZSteelFloorFormulaPacketCalibrationCandidateDecision =
  | "accepted_calibration_evidence_candidate_boundary"
  | "blocked_missing_rights_safe_citation_locator_metadata"
  | "blocked_missing_source_owned_packet_fields"
  | "blocked_packet_not_accepted_boundary";

export type GateAZSteelFloorFormulaPacketCalibrationCandidateInput = {
  readonly acceptedPacketBoundaryRow: GateAYSteelFloorFormulaPacketAcceptanceBoundaryRow;
  readonly id: string;
};

export type GateAZSteelFloorFormulaPacketCalibrationCandidateRow =
  GateAZSteelFloorFormulaPacketCalibrationCandidateInput & {
    readonly acceptedForResidualAdmissionNow: false;
    readonly canBecomeCalibrationEvidenceCandidate: boolean;
    readonly canMoveRuntimeNow: false;
    readonly canPromoteExactSourceNow: false;
    readonly canRetuneRuntimeNow: false;
    readonly candidateDecision: GateAZSteelFloorFormulaPacketCalibrationCandidateDecision;
    readonly candidateUse:
      | "blocked_calibration_candidate_boundary"
      | "calibration_evidence_candidate_only";
    readonly exactSourceOverrideAllowedNow: false;
    readonly fieldBuildingAliasAllowedNow: false;
    readonly measuredMetricValueIngestedForRuntime: false;
    readonly missingCitationLocatorMetadataFields: readonly GateAWSteelFloorFormulaPacketLocatorMetadataField[];
    readonly missingSourceOwnedFields: readonly SteelFloorDeltaLwRequiredSourceOwnerField[];
    readonly residualAdmissionAllowedNow: false;
    readonly runtimeValueMovement: false;
    readonly sourceDocumentCopied: false;
    readonly sourceRowsAreCalibrationEvidenceCandidateNotProduct: true;
    readonly sourceTextIngested: false;
    readonly toleranceChangeAllowedNow: false;
  };

export type GateAZSteelFloorFormulaSameStackIsoDeltaLwPacketCalibrationCandidateContract = {
  readonly acceptedCandidateProbeIds: readonly string[];
  readonly candidateBoundaryPolicy: {
    readonly allGateATAKOwnerFieldsRequired: true;
    readonly calibrationCandidateAllowedAtBoundaryOnly: true;
    readonly currentRequestStatusRowsRemainBlocked: true;
    readonly exactOverrideAllowedNow: false;
    readonly gateAYAcceptedPacketBoundaryRowsOnly: true;
    readonly labIso101407172BasisRequired: true;
    readonly measuredMetricValueRuntimeIngestionAllowed: false;
    readonly rejectedGateAYProbesRemainBlocked: true;
    readonly residualAdmissionAllowedNow: false;
    readonly rightsSafeCitationLocatorMetadataRequired: true;
    readonly runtimeRetuneAllowedNow: false;
    readonly sameStackSteelReferenceRequired: true;
    readonly sourceDocumentCopyAllowed: false;
    readonly sourceOwnedMeasuredDeltaLwRequired: true;
    readonly sourceTextIngestionAllowed: false;
    readonly toleranceChangeAllowedNow: false;
  };
  readonly candidateBoundarySurface: {
    readonly measuredMetricIds: readonly ["DeltaLw"];
    readonly metricBasis: "lab_iso_10140_717_2";
    readonly referenceFloor: "same_stack_steel";
    readonly requiredCitationLocatorMetadataFields: readonly GateAWSteelFloorFormulaPacketLocatorMetadataField[];
    readonly requiredPacketOwnerFields: readonly SteelFloorDeltaLwRequiredSourceOwnerField[];
    readonly selectedOwner: "accepted_source_owned_same_stack_iso_delta_lw_holdouts";
    readonly selectedTermId: "source_owned_delta_lw_holdout_absence";
    readonly usesGateAYAcceptedPacketBoundaryRowsOnly: true;
  };
  readonly currentAcceptedCalibrationCandidateIds: readonly string[];
  readonly currentCalibrationCandidateRows: readonly GateAZSteelFloorFormulaPacketCalibrationCandidateRow[];
  readonly currentRejectedCalibrationCandidateIds: readonly string[];
  readonly exactSourceOverridePolicy: {
    readonly calibrationCandidatesAreNotExactRows: true;
    readonly exactMeasuredRowsRemainPrecedence: true;
    readonly fullAssemblyExactMatchRequired: true;
  };
  readonly fieldAndBuildingBasisSeparation: {
    readonly fieldOrAstmBasisCanTightenLabCorridor: false;
    readonly labDeltaLwCanAliasFieldMetrics: false;
  };
  readonly landedGate: "gate_az_steel_floor_formula_same_stack_iso_delta_lw_packet_calibration_candidate_plan";
  readonly packetCalibrationCandidateProbeRows: readonly GateAZSteelFloorFormulaPacketCalibrationCandidateRow[];
  readonly previousLandedGate: "gate_ay_steel_floor_formula_same_stack_iso_delta_lw_packet_acceptance_boundary_plan";
  readonly rejectedCandidateProbeIds: readonly string[];
  readonly runtimePins: {
    readonly deltaLwToleranceDb: typeof STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB;
    readonly estimateDeltaLw: 22.4;
    readonly estimateLnW: 55.6;
    readonly lnWToleranceDb: typeof STEEL_FLOOR_FORMULA_LN_W_TOLERANCE_DB;
    readonly runtimeRetuneAllowedNow: false;
    readonly runtimeValueMovement: false;
  };
  readonly selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1";
  readonly selectedNextAction: typeof GATE_AZ_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_PACKET_CALIBRATION_CANDIDATE_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof GATE_AZ_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_PACKET_CALIBRATION_CANDIDATE_SELECTED_NEXT_FILE;
  readonly selectionStatus: "gate_az_same_stack_iso_delta_lw_packet_calibration_candidate_landed_no_runtime_selected_residual_admission_boundary_gate_ba";
};

const gateAYPacketAcceptanceBoundaryContract =
  buildGateAYSteelFloorFormulaSameStackIsoDeltaLwPacketAcceptanceBoundaryContract();

const missingCitationLocatorMetadataFields = (
  row: GateAYSteelFloorFormulaPacketAcceptanceBoundaryRow,
): readonly GateAWSteelFloorFormulaPacketLocatorMetadataField[] => {
  const present = new Set(
    row.requestLedgerRow.packetReadinessRow.packetLocatorMetadataFields,
  );

  return GATE_AW_REQUIRED_PACKET_LOCATOR_METADATA_FIELDS.filter(
    (field) => !present.has(field),
  );
};

export function classifyGateAZSteelFloorFormulaSameStackIsoDeltaLwPacketCalibrationCandidate(
  input: GateAZSteelFloorFormulaPacketCalibrationCandidateInput,
): GateAZSteelFloorFormulaPacketCalibrationCandidateRow {
  const acceptedPacketBoundaryRow = input.acceptedPacketBoundaryRow;
  const missingCitationFields = missingCitationLocatorMetadataFields(
    acceptedPacketBoundaryRow,
  );
  const missingSourceOwnedFields =
    acceptedPacketBoundaryRow.missingSourceOwnedFields;

  let candidateDecision:
    GateAZSteelFloorFormulaPacketCalibrationCandidateDecision;
  if (!acceptedPacketBoundaryRow.packetAcceptanceAllowed) {
    candidateDecision = "blocked_packet_not_accepted_boundary";
  } else if (missingCitationFields.length > 0) {
    candidateDecision =
      "blocked_missing_rights_safe_citation_locator_metadata";
  } else if (missingSourceOwnedFields.length > 0) {
    candidateDecision = "blocked_missing_source_owned_packet_fields";
  } else {
    candidateDecision = "accepted_calibration_evidence_candidate_boundary";
  }

  const canBecomeCalibrationEvidenceCandidate =
    candidateDecision === "accepted_calibration_evidence_candidate_boundary";

  return {
    ...input,
    acceptedForResidualAdmissionNow: false,
    canBecomeCalibrationEvidenceCandidate,
    canMoveRuntimeNow: false,
    canPromoteExactSourceNow: false,
    canRetuneRuntimeNow: false,
    candidateDecision,
    candidateUse: canBecomeCalibrationEvidenceCandidate
      ? "calibration_evidence_candidate_only"
      : "blocked_calibration_candidate_boundary",
    exactSourceOverrideAllowedNow: false,
    fieldBuildingAliasAllowedNow: false,
    measuredMetricValueIngestedForRuntime: false,
    missingCitationLocatorMetadataFields: missingCitationFields,
    missingSourceOwnedFields,
    residualAdmissionAllowedNow: false,
    runtimeValueMovement: false,
    sourceDocumentCopied: false,
    sourceRowsAreCalibrationEvidenceCandidateNotProduct: true,
    sourceTextIngested: false,
    toleranceChangeAllowedNow: false,
  };
}

const currentCalibrationCandidateInputs =
  gateAYPacketAcceptanceBoundaryContract.currentPacketAcceptanceBoundaryRows.map(
    (row) => ({
      acceptedPacketBoundaryRow: row,
      id: `gate_az_current_${row.id}_calibration_candidate`,
    }),
  ) satisfies readonly GateAZSteelFloorFormulaPacketCalibrationCandidateInput[];

const packetCalibrationCandidateProbeInputs =
  gateAYPacketAcceptanceBoundaryContract.packetAcceptanceBoundaryProbeRows.map(
    (row) => ({
      acceptedPacketBoundaryRow: row,
      id: `gate_az_probe_${row.id}_calibration_candidate`,
    }),
  ) satisfies readonly GateAZSteelFloorFormulaPacketCalibrationCandidateInput[];

export function buildGateAZSteelFloorFormulaSameStackIsoDeltaLwPacketCalibrationCandidateContract():
  GateAZSteelFloorFormulaSameStackIsoDeltaLwPacketCalibrationCandidateContract {
  const currentCalibrationCandidateRows =
    currentCalibrationCandidateInputs.map(
      classifyGateAZSteelFloorFormulaSameStackIsoDeltaLwPacketCalibrationCandidate,
    );
  const packetCalibrationCandidateProbeRows =
    packetCalibrationCandidateProbeInputs.map(
      classifyGateAZSteelFloorFormulaSameStackIsoDeltaLwPacketCalibrationCandidate,
    );
  const currentAcceptedCalibrationCandidateIds =
    currentCalibrationCandidateRows
      .filter((row) => row.canBecomeCalibrationEvidenceCandidate)
      .map((row) => row.id);
  const currentRejectedCalibrationCandidateIds =
    currentCalibrationCandidateRows
      .filter((row) => !row.canBecomeCalibrationEvidenceCandidate)
      .map((row) => row.id);
  const acceptedCandidateProbeIds = packetCalibrationCandidateProbeRows
    .filter((row) => row.canBecomeCalibrationEvidenceCandidate)
    .map((row) => row.id);
  const rejectedCandidateProbeIds = packetCalibrationCandidateProbeRows
    .filter((row) => !row.canBecomeCalibrationEvidenceCandidate)
    .map((row) => row.id);

  return {
    acceptedCandidateProbeIds,
    candidateBoundaryPolicy: {
      allGateATAKOwnerFieldsRequired: true,
      calibrationCandidateAllowedAtBoundaryOnly: true,
      currentRequestStatusRowsRemainBlocked: true,
      exactOverrideAllowedNow: false,
      gateAYAcceptedPacketBoundaryRowsOnly: true,
      labIso101407172BasisRequired: true,
      measuredMetricValueRuntimeIngestionAllowed: false,
      rejectedGateAYProbesRemainBlocked: true,
      residualAdmissionAllowedNow: false,
      rightsSafeCitationLocatorMetadataRequired: true,
      runtimeRetuneAllowedNow: false,
      sameStackSteelReferenceRequired: true,
      sourceDocumentCopyAllowed: false,
      sourceOwnedMeasuredDeltaLwRequired: true,
      sourceTextIngestionAllowed: false,
      toleranceChangeAllowedNow: false,
    },
    candidateBoundarySurface: {
      measuredMetricIds: ["DeltaLw"],
      metricBasis: "lab_iso_10140_717_2",
      referenceFloor: "same_stack_steel",
      requiredCitationLocatorMetadataFields:
        GATE_AW_REQUIRED_PACKET_LOCATOR_METADATA_FIELDS,
      requiredPacketOwnerFields:
        STEEL_FLOOR_DELTA_LW_REQUIRED_SOURCE_OWNER_FIELDS,
      selectedOwner: "accepted_source_owned_same_stack_iso_delta_lw_holdouts",
      selectedTermId: "source_owned_delta_lw_holdout_absence",
      usesGateAYAcceptedPacketBoundaryRowsOnly: true,
    },
    currentAcceptedCalibrationCandidateIds,
    currentCalibrationCandidateRows,
    currentRejectedCalibrationCandidateIds,
    exactSourceOverridePolicy: {
      calibrationCandidatesAreNotExactRows: true,
      exactMeasuredRowsRemainPrecedence: true,
      fullAssemblyExactMatchRequired: true,
    },
    fieldAndBuildingBasisSeparation: {
      fieldOrAstmBasisCanTightenLabCorridor: false,
      labDeltaLwCanAliasFieldMetrics: false,
    },
    landedGate:
      "gate_az_steel_floor_formula_same_stack_iso_delta_lw_packet_calibration_candidate_plan",
    packetCalibrationCandidateProbeRows,
    previousLandedGate:
      "gate_ay_steel_floor_formula_same_stack_iso_delta_lw_packet_acceptance_boundary_plan",
    rejectedCandidateProbeIds,
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
      GATE_AZ_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_PACKET_CALIBRATION_CANDIDATE_SELECTED_NEXT_ACTION,
    selectedNextFile:
      GATE_AZ_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_PACKET_CALIBRATION_CANDIDATE_SELECTED_NEXT_FILE,
    selectionStatus:
      "gate_az_same_stack_iso_delta_lw_packet_calibration_candidate_landed_no_runtime_selected_residual_admission_boundary_gate_ba",
  };
}
