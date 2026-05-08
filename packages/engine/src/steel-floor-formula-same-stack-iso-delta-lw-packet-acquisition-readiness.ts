import {
  buildGateAVSteelFloorFormulaSameStackIsoDeltaLwSourceLeadIntakeContract,
  type GateAVSteelFloorFormulaSourceLeadIntakeRow,
} from "./steel-floor-formula-same-stack-iso-delta-lw-source-lead-intake";
import {
  type SteelFloorDeltaLwRequiredSourceOwnerField,
} from "./steel-floor-formula-source-owned-delta-lw-holdout";
import {
  STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB,
  STEEL_FLOOR_FORMULA_LN_W_TOLERANCE_DB,
} from "./steel-floor-impact-formula-corridor";

export const GATE_AW_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_PACKET_ACQUISITION_READINESS_SELECTED_NEXT_FILE =
  "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ax-steel-floor-formula-same-stack-iso-delta-lw-packet-request-ledger-contract.test.ts";

export const GATE_AW_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_PACKET_ACQUISITION_READINESS_SELECTED_NEXT_ACTION =
  "gate_ax_steel_floor_formula_same_stack_iso_delta_lw_packet_request_ledger_plan";

export const GATE_AW_REQUIRED_PACKET_LOCATOR_METADATA_FIELDS = [
  "source_locator",
  "report_identifier",
  "source_owner_or_contact",
  "rights_safe_access_method",
  "citation_scope",
] as const;

export type GateAWSteelFloorFormulaPacketLocatorMetadataField =
  (typeof GATE_AW_REQUIRED_PACKET_LOCATOR_METADATA_FIELDS)[number];

export type GateAWSteelFloorFormulaPacketAcquisitionReadinessDecision =
  | "blocked_missing_rights_safe_locator_metadata"
  | "blocked_missing_source_owned_owner_fields"
  | "blocked_rejected_source_lead_intake_row"
  | "ready_metadata_only_packet_request";

export type GateAWSteelFloorFormulaPacketAcquisitionReadinessInput = {
  readonly intakeRow: GateAVSteelFloorFormulaSourceLeadIntakeRow;
  readonly packetLocatorMetadataFields: readonly GateAWSteelFloorFormulaPacketLocatorMetadataField[];
  readonly packetRequestLabel: string;
};

export type GateAWSteelFloorFormulaPacketAcquisitionReadinessRow =
  GateAWSteelFloorFormulaPacketAcquisitionReadinessInput & {
    readonly canBecomeCalibrationEvidenceNow: false;
    readonly canBecomeSourcePacketNow: false;
    readonly canMoveRuntimeNow: false;
    readonly canPromoteExactSourceNow: false;
    readonly measuredMetricValueIngested: false;
    readonly missingLocatorMetadataFields: readonly GateAWSteelFloorFormulaPacketLocatorMetadataField[];
    readonly missingSourceOwnedFields: readonly SteelFloorDeltaLwRequiredSourceOwnerField[];
    readonly packetReadinessDecision: GateAWSteelFloorFormulaPacketAcquisitionReadinessDecision;
    readonly packetRequestAllowed: boolean;
    readonly packetRequestUse:
      | "blocked_packet_request_boundary"
      | "metadata_only_packet_request_target";
    readonly requiredPacketLocatorMetadataFields: readonly GateAWSteelFloorFormulaPacketLocatorMetadataField[];
    readonly requiredPacketOwnerFields: readonly SteelFloorDeltaLwRequiredSourceOwnerField[];
    readonly rightsSafeMetadataOnly: true;
    readonly runtimeValueMovement: false;
    readonly sourceDocumentCopied: false;
    readonly sourceTextIngested: false;
  };

export type GateAWSteelFloorFormulaSameStackIsoDeltaLwPacketAcquisitionReadinessContract = {
  readonly blockedPacketRequestIds: readonly string[];
  readonly exactSourceOverridePolicy: {
    readonly exactMeasuredRowsRemainPrecedence: true;
    readonly fullAssemblyExactMatchRequired: true;
    readonly readyPacketRequestsAreNotExactRows: true;
  };
  readonly fieldAndBuildingBasisSeparation: {
    readonly fieldOrAstmBasisCanTightenLabCorridor: false;
    readonly labDeltaLwCanAliasFieldMetrics: false;
  };
  readonly landedGate: "gate_aw_steel_floor_formula_same_stack_iso_delta_lw_packet_acquisition_readiness_plan";
  readonly packetAcquisitionReadinessRows: readonly GateAWSteelFloorFormulaPacketAcquisitionReadinessRow[];
  readonly packetReadinessPolicy: {
    readonly acceptedGateAVRowsOnly: true;
    readonly broadSourceLibraryCrawlAllowed: false;
    readonly calibrationEvidenceAllowedNow: false;
    readonly exactOverrideAllowedNow: false;
    readonly measuredMetricValueIngestionAllowed: false;
    readonly rejectedGateAVRowsRemainBlocked: true;
    readonly rightsSafeMetadataOnly: true;
    readonly sourceDocumentCopyAllowed: false;
    readonly sourcePacketAcceptanceAllowedNow: false;
    readonly sourceTextIngestionAllowed: false;
  };
  readonly packetReadinessSurface: {
    readonly requiredPacketLocatorMetadataFields: readonly GateAWSteelFloorFormulaPacketLocatorMetadataField[];
    readonly requiredPacketOwnerFields: readonly SteelFloorDeltaLwRequiredSourceOwnerField[];
    readonly sourceLeadIntakeScope: {
      readonly measuredMetricIds: readonly ["DeltaLw"];
      readonly metricBasis: "lab_iso_10140_717_2";
      readonly referenceFloor: "same_stack_steel";
      readonly rightsSafeMetadataOnly: true;
      readonly usesGateAVAcceptedIntakeRowsOnly: true;
    };
  };
  readonly previousLandedGate: "gate_av_steel_floor_formula_same_stack_iso_delta_lw_source_lead_intake_plan";
  readonly readyPacketRequestIds: readonly string[];
  readonly runtimePins: {
    readonly deltaLwToleranceDb: typeof STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB;
    readonly estimateDeltaLw: 22.4;
    readonly estimateLnW: 55.6;
    readonly lnWToleranceDb: typeof STEEL_FLOOR_FORMULA_LN_W_TOLERANCE_DB;
    readonly runtimeRetuneAllowedNow: false;
    readonly runtimeValueMovement: false;
  };
  readonly selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1";
  readonly selectedNextAction: typeof GATE_AW_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_PACKET_ACQUISITION_READINESS_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof GATE_AW_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_PACKET_ACQUISITION_READINESS_SELECTED_NEXT_FILE;
  readonly selectionStatus: "gate_aw_same_stack_iso_delta_lw_packet_acquisition_readiness_landed_no_runtime_selected_packet_request_ledger_gate_ax";
};

const gateAVSourceLeadIntakeContract =
  buildGateAVSteelFloorFormulaSameStackIsoDeltaLwSourceLeadIntakeContract();

const missingLocatorMetadataFields = (
  fields: readonly GateAWSteelFloorFormulaPacketLocatorMetadataField[],
): readonly GateAWSteelFloorFormulaPacketLocatorMetadataField[] => {
  const present = new Set(fields);

  return GATE_AW_REQUIRED_PACKET_LOCATOR_METADATA_FIELDS.filter(
    (field) => !present.has(field),
  );
};

const packetReadinessInputs =
  gateAVSourceLeadIntakeContract.leadIntakeRows.map((intakeRow) => ({
    intakeRow,
    packetLocatorMetadataFields: intakeRow.acquisitionRequestAllowed
      ? GATE_AW_REQUIRED_PACKET_LOCATOR_METADATA_FIELDS
      : [],
    packetRequestLabel: `${intakeRow.leadLabel} packet acquisition request`,
  })) satisfies readonly GateAWSteelFloorFormulaPacketAcquisitionReadinessInput[];

export function classifyGateAWSteelFloorFormulaSameStackIsoDeltaLwPacketAcquisitionReadiness(
  input: GateAWSteelFloorFormulaPacketAcquisitionReadinessInput,
): GateAWSteelFloorFormulaPacketAcquisitionReadinessRow {
  const missingLocatorFields = missingLocatorMetadataFields(
    input.packetLocatorMetadataFields,
  );
  const missingOwnerFields = input.intakeRow.missingSourceOwnedFields;

  let packetReadinessDecision:
    GateAWSteelFloorFormulaPacketAcquisitionReadinessDecision;
  if (!input.intakeRow.acquisitionRequestAllowed) {
    packetReadinessDecision = "blocked_rejected_source_lead_intake_row";
  } else if (missingOwnerFields.length > 0) {
    packetReadinessDecision = "blocked_missing_source_owned_owner_fields";
  } else if (missingLocatorFields.length > 0) {
    packetReadinessDecision = "blocked_missing_rights_safe_locator_metadata";
  } else {
    packetReadinessDecision = "ready_metadata_only_packet_request";
  }

  const packetRequestAllowed =
    packetReadinessDecision === "ready_metadata_only_packet_request";

  return {
    ...input,
    canBecomeCalibrationEvidenceNow: false,
    canBecomeSourcePacketNow: false,
    canMoveRuntimeNow: false,
    canPromoteExactSourceNow: false,
    measuredMetricValueIngested: false,
    missingLocatorMetadataFields: missingLocatorFields,
    missingSourceOwnedFields: missingOwnerFields,
    packetReadinessDecision,
    packetRequestAllowed,
    packetRequestUse: packetRequestAllowed
      ? "metadata_only_packet_request_target"
      : "blocked_packet_request_boundary",
    requiredPacketLocatorMetadataFields:
      GATE_AW_REQUIRED_PACKET_LOCATOR_METADATA_FIELDS,
    requiredPacketOwnerFields:
      gateAVSourceLeadIntakeContract.leadScope.requiredSourceOwnedFields,
    rightsSafeMetadataOnly: true,
    runtimeValueMovement: false,
    sourceDocumentCopied: false,
    sourceTextIngested: false,
  };
}

export function buildGateAWSteelFloorFormulaSameStackIsoDeltaLwPacketAcquisitionReadinessContract():
  GateAWSteelFloorFormulaSameStackIsoDeltaLwPacketAcquisitionReadinessContract {
  const packetAcquisitionReadinessRows = packetReadinessInputs.map(
    classifyGateAWSteelFloorFormulaSameStackIsoDeltaLwPacketAcquisitionReadiness,
  );
  const readyPacketRequestIds = packetAcquisitionReadinessRows
    .filter((row) => row.packetRequestAllowed)
    .map((row) => row.intakeRow.id);
  const blockedPacketRequestIds = packetAcquisitionReadinessRows
    .filter((row) => !row.packetRequestAllowed)
    .map((row) => row.intakeRow.id);

  return {
    blockedPacketRequestIds,
    exactSourceOverridePolicy: {
      exactMeasuredRowsRemainPrecedence: true,
      fullAssemblyExactMatchRequired: true,
      readyPacketRequestsAreNotExactRows: true,
    },
    fieldAndBuildingBasisSeparation: {
      fieldOrAstmBasisCanTightenLabCorridor: false,
      labDeltaLwCanAliasFieldMetrics: false,
    },
    landedGate:
      "gate_aw_steel_floor_formula_same_stack_iso_delta_lw_packet_acquisition_readiness_plan",
    packetAcquisitionReadinessRows,
    packetReadinessPolicy: {
      acceptedGateAVRowsOnly: true,
      broadSourceLibraryCrawlAllowed: false,
      calibrationEvidenceAllowedNow: false,
      exactOverrideAllowedNow: false,
      measuredMetricValueIngestionAllowed: false,
      rejectedGateAVRowsRemainBlocked: true,
      rightsSafeMetadataOnly: true,
      sourceDocumentCopyAllowed: false,
      sourcePacketAcceptanceAllowedNow: false,
      sourceTextIngestionAllowed: false,
    },
    packetReadinessSurface: {
      requiredPacketLocatorMetadataFields:
        GATE_AW_REQUIRED_PACKET_LOCATOR_METADATA_FIELDS,
      requiredPacketOwnerFields:
        gateAVSourceLeadIntakeContract.leadScope.requiredSourceOwnedFields,
      sourceLeadIntakeScope: {
        measuredMetricIds:
          gateAVSourceLeadIntakeContract.leadScope.measuredMetricIds,
        metricBasis: gateAVSourceLeadIntakeContract.leadScope.metricBasis,
        referenceFloor: gateAVSourceLeadIntakeContract.leadScope.referenceFloor,
        rightsSafeMetadataOnly: true,
        usesGateAVAcceptedIntakeRowsOnly: true,
      },
    },
    previousLandedGate:
      "gate_av_steel_floor_formula_same_stack_iso_delta_lw_source_lead_intake_plan",
    readyPacketRequestIds,
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
      GATE_AW_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_PACKET_ACQUISITION_READINESS_SELECTED_NEXT_ACTION,
    selectedNextFile:
      GATE_AW_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_PACKET_ACQUISITION_READINESS_SELECTED_NEXT_FILE,
    selectionStatus:
      "gate_aw_same_stack_iso_delta_lw_packet_acquisition_readiness_landed_no_runtime_selected_packet_request_ledger_gate_ax",
  };
}
