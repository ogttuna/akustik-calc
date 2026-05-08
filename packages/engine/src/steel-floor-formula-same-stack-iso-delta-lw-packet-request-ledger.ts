import {
  GATE_AW_REQUIRED_PACKET_LOCATOR_METADATA_FIELDS,
  buildGateAWSteelFloorFormulaSameStackIsoDeltaLwPacketAcquisitionReadinessContract,
  type GateAWSteelFloorFormulaPacketAcquisitionReadinessRow,
  type GateAWSteelFloorFormulaPacketLocatorMetadataField,
} from "./steel-floor-formula-same-stack-iso-delta-lw-packet-acquisition-readiness";
import {
  type SteelFloorDeltaLwRequiredSourceOwnerField,
} from "./steel-floor-formula-source-owned-delta-lw-holdout";
import {
  STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB,
  STEEL_FLOOR_FORMULA_LN_W_TOLERANCE_DB,
} from "./steel-floor-impact-formula-corridor";

export const GATE_AX_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_PACKET_REQUEST_LEDGER_SELECTED_NEXT_FILE =
  "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ay-steel-floor-formula-same-stack-iso-delta-lw-packet-acceptance-boundary-contract.test.ts";

export const GATE_AX_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_PACKET_REQUEST_LEDGER_SELECTED_NEXT_ACTION =
  "gate_ay_steel_floor_formula_same_stack_iso_delta_lw_packet_acceptance_boundary_plan";

export type GateAXSteelFloorFormulaPacketRequestLedgerDecision =
  | "blocked_packet_request_ledger_boundary"
  | "queued_rights_safe_packet_request_ledger_entry";

export type GateAXSteelFloorFormulaPacketRequestLedgerRow = {
  readonly canBecomeCalibrationEvidenceNow: false;
  readonly canBecomeSourcePacketNow: false;
  readonly canMoveRuntimeNow: false;
  readonly canPromoteExactSourceNow: false;
  readonly ledgerDecision: GateAXSteelFloorFormulaPacketRequestLedgerDecision;
  readonly ledgerEntryAllowed: boolean;
  readonly ledgerEntryUse:
    | "blocked_packet_request_ledger_boundary"
    | "rights_safe_packet_request_ledger_entry";
  readonly measuredMetricValueIngested: false;
  readonly nextPacketAcceptanceBoundaryGate: typeof GATE_AX_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_PACKET_REQUEST_LEDGER_SELECTED_NEXT_ACTION;
  readonly packetReadinessRow: GateAWSteelFloorFormulaPacketAcquisitionReadinessRow;
  readonly requestLedgerId: string;
  readonly requiredPacketLocatorMetadataFields: readonly GateAWSteelFloorFormulaPacketLocatorMetadataField[];
  readonly requiredPacketOwnerFields: readonly SteelFloorDeltaLwRequiredSourceOwnerField[];
  readonly rightsSafeMetadataOnly: true;
  readonly runtimeValueMovement: false;
  readonly sourceDocumentCopied: false;
  readonly sourceTextIngested: false;
};

export type GateAXSteelFloorFormulaSameStackIsoDeltaLwPacketRequestLedgerContract = {
  readonly blockedLedgerRowIds: readonly string[];
  readonly exactSourceOverridePolicy: {
    readonly exactMeasuredRowsRemainPrecedence: true;
    readonly fullAssemblyExactMatchRequired: true;
    readonly requestLedgerEntriesAreNotExactRows: true;
  };
  readonly fieldAndBuildingBasisSeparation: {
    readonly fieldOrAstmBasisCanTightenLabCorridor: false;
    readonly labDeltaLwCanAliasFieldMetrics: false;
  };
  readonly landedGate: "gate_ax_steel_floor_formula_same_stack_iso_delta_lw_packet_request_ledger_plan";
  readonly packetRequestLedgerPolicy: {
    readonly blockedGateAWRowsRemainBlocked: true;
    readonly broadSourceLibraryCrawlAllowed: false;
    readonly calibrationEvidenceAllowedNow: false;
    readonly exactOverrideAllowedNow: false;
    readonly locatorMetadataOnly: true;
    readonly measuredMetricValueIngestionAllowed: false;
    readonly readyGateAWRowsOnly: true;
    readonly rightsSafeMetadataOnly: true;
    readonly sourceDocumentCopyAllowed: false;
    readonly sourcePacketAcceptanceAllowedNow: false;
    readonly sourceTextIngestionAllowed: false;
  };
  readonly packetRequestLedgerRows: readonly GateAXSteelFloorFormulaPacketRequestLedgerRow[];
  readonly packetRequestLedgerSurface: {
    readonly requiredPacketLocatorMetadataFields: readonly GateAWSteelFloorFormulaPacketLocatorMetadataField[];
    readonly requiredPacketOwnerFields: readonly SteelFloorDeltaLwRequiredSourceOwnerField[];
    readonly sourceLeadIntakeScope: {
      readonly measuredMetricIds: readonly ["DeltaLw"];
      readonly metricBasis: "lab_iso_10140_717_2";
      readonly referenceFloor: "same_stack_steel";
      readonly rightsSafeMetadataOnly: true;
      readonly usesGateAWReadyRowsOnly: true;
    };
  };
  readonly previousLandedGate: "gate_aw_steel_floor_formula_same_stack_iso_delta_lw_packet_acquisition_readiness_plan";
  readonly requestLedgerEntryIds: readonly string[];
  readonly runtimePins: {
    readonly deltaLwToleranceDb: typeof STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB;
    readonly estimateDeltaLw: 22.4;
    readonly estimateLnW: 55.6;
    readonly lnWToleranceDb: typeof STEEL_FLOOR_FORMULA_LN_W_TOLERANCE_DB;
    readonly runtimeRetuneAllowedNow: false;
    readonly runtimeValueMovement: false;
  };
  readonly selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1";
  readonly selectedNextAction: typeof GATE_AX_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_PACKET_REQUEST_LEDGER_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof GATE_AX_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_PACKET_REQUEST_LEDGER_SELECTED_NEXT_FILE;
  readonly selectionStatus: "gate_ax_same_stack_iso_delta_lw_packet_request_ledger_landed_no_runtime_selected_packet_acceptance_boundary_gate_ay";
};

const gateAWPacketReadinessContract =
  buildGateAWSteelFloorFormulaSameStackIsoDeltaLwPacketAcquisitionReadinessContract();

export function classifyGateAXSteelFloorFormulaSameStackIsoDeltaLwPacketRequestLedger(
  packetReadinessRow: GateAWSteelFloorFormulaPacketAcquisitionReadinessRow,
): GateAXSteelFloorFormulaPacketRequestLedgerRow {
  const ledgerEntryAllowed = packetReadinessRow.packetRequestAllowed;
  const requestLedgerId = `gate_ax_${packetReadinessRow.intakeRow.id}_packet_request`;

  return {
    canBecomeCalibrationEvidenceNow: false,
    canBecomeSourcePacketNow: false,
    canMoveRuntimeNow: false,
    canPromoteExactSourceNow: false,
    ledgerDecision: ledgerEntryAllowed
      ? "queued_rights_safe_packet_request_ledger_entry"
      : "blocked_packet_request_ledger_boundary",
    ledgerEntryAllowed,
    ledgerEntryUse: ledgerEntryAllowed
      ? "rights_safe_packet_request_ledger_entry"
      : "blocked_packet_request_ledger_boundary",
    measuredMetricValueIngested: false,
    nextPacketAcceptanceBoundaryGate:
      GATE_AX_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_PACKET_REQUEST_LEDGER_SELECTED_NEXT_ACTION,
    packetReadinessRow,
    requestLedgerId,
    requiredPacketLocatorMetadataFields:
      GATE_AW_REQUIRED_PACKET_LOCATOR_METADATA_FIELDS,
    requiredPacketOwnerFields:
      gateAWPacketReadinessContract.packetReadinessSurface
        .requiredPacketOwnerFields,
    rightsSafeMetadataOnly: true,
    runtimeValueMovement: false,
    sourceDocumentCopied: false,
    sourceTextIngested: false,
  };
}

export function buildGateAXSteelFloorFormulaSameStackIsoDeltaLwPacketRequestLedgerContract():
  GateAXSteelFloorFormulaSameStackIsoDeltaLwPacketRequestLedgerContract {
  const packetRequestLedgerRows =
    gateAWPacketReadinessContract.packetAcquisitionReadinessRows.map(
      classifyGateAXSteelFloorFormulaSameStackIsoDeltaLwPacketRequestLedger,
    );
  const requestLedgerEntryIds = packetRequestLedgerRows
    .filter((row) => row.ledgerEntryAllowed)
    .map((row) => row.packetReadinessRow.intakeRow.id);
  const blockedLedgerRowIds = packetRequestLedgerRows
    .filter((row) => !row.ledgerEntryAllowed)
    .map((row) => row.packetReadinessRow.intakeRow.id);

  return {
    blockedLedgerRowIds,
    exactSourceOverridePolicy: {
      exactMeasuredRowsRemainPrecedence: true,
      fullAssemblyExactMatchRequired: true,
      requestLedgerEntriesAreNotExactRows: true,
    },
    fieldAndBuildingBasisSeparation: {
      fieldOrAstmBasisCanTightenLabCorridor: false,
      labDeltaLwCanAliasFieldMetrics: false,
    },
    landedGate:
      "gate_ax_steel_floor_formula_same_stack_iso_delta_lw_packet_request_ledger_plan",
    packetRequestLedgerPolicy: {
      blockedGateAWRowsRemainBlocked: true,
      broadSourceLibraryCrawlAllowed: false,
      calibrationEvidenceAllowedNow: false,
      exactOverrideAllowedNow: false,
      locatorMetadataOnly: true,
      measuredMetricValueIngestionAllowed: false,
      readyGateAWRowsOnly: true,
      rightsSafeMetadataOnly: true,
      sourceDocumentCopyAllowed: false,
      sourcePacketAcceptanceAllowedNow: false,
      sourceTextIngestionAllowed: false,
    },
    packetRequestLedgerRows,
    packetRequestLedgerSurface: {
      requiredPacketLocatorMetadataFields:
        GATE_AW_REQUIRED_PACKET_LOCATOR_METADATA_FIELDS,
      requiredPacketOwnerFields:
        gateAWPacketReadinessContract.packetReadinessSurface
          .requiredPacketOwnerFields,
      sourceLeadIntakeScope: {
        measuredMetricIds:
          gateAWPacketReadinessContract.packetReadinessSurface
            .sourceLeadIntakeScope.measuredMetricIds,
        metricBasis:
          gateAWPacketReadinessContract.packetReadinessSurface
            .sourceLeadIntakeScope.metricBasis,
        referenceFloor:
          gateAWPacketReadinessContract.packetReadinessSurface
            .sourceLeadIntakeScope.referenceFloor,
        rightsSafeMetadataOnly: true,
        usesGateAWReadyRowsOnly: true,
      },
    },
    previousLandedGate:
      "gate_aw_steel_floor_formula_same_stack_iso_delta_lw_packet_acquisition_readiness_plan",
    requestLedgerEntryIds,
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
      GATE_AX_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_PACKET_REQUEST_LEDGER_SELECTED_NEXT_ACTION,
    selectedNextFile:
      GATE_AX_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_PACKET_REQUEST_LEDGER_SELECTED_NEXT_FILE,
    selectionStatus:
      "gate_ax_same_stack_iso_delta_lw_packet_request_ledger_landed_no_runtime_selected_packet_acceptance_boundary_gate_ay",
  };
}
