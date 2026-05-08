import {
  buildGateAXSteelFloorFormulaSameStackIsoDeltaLwPacketRequestLedgerContract,
  type GateAXSteelFloorFormulaPacketRequestLedgerRow,
} from "./steel-floor-formula-same-stack-iso-delta-lw-packet-request-ledger";
import {
  type GateATSteelFloorFormulaPacketReferenceFloor,
  type GateATSteelFloorFormulaPacketRightsPosture,
} from "./steel-floor-formula-same-stack-iso-delta-lw-packet-target";
import {
  STEEL_FLOOR_DELTA_LW_REQUIRED_SOURCE_OWNER_FIELDS,
  evaluateSteelFloorDeltaLwHoldoutPacket,
  type SteelFloorDeltaLwHoldoutBasis,
  type SteelFloorDeltaLwHoldoutSourceKind,
  type SteelFloorDeltaLwRequiredSourceOwnerField,
} from "./steel-floor-formula-source-owned-delta-lw-holdout";
import {
  STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB,
  STEEL_FLOOR_FORMULA_LN_W_TOLERANCE_DB,
} from "./steel-floor-impact-formula-corridor";

export const GATE_AY_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_PACKET_ACCEPTANCE_BOUNDARY_SELECTED_NEXT_FILE =
  "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-az-steel-floor-formula-same-stack-iso-delta-lw-packet-calibration-candidate-contract.test.ts";

export const GATE_AY_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_PACKET_ACCEPTANCE_BOUNDARY_SELECTED_NEXT_ACTION =
  "gate_az_steel_floor_formula_same_stack_iso_delta_lw_packet_calibration_candidate_plan";

export type GateAYSteelFloorFormulaPacketAcceptanceDecision =
  | "accepted_source_owned_same_stack_iso_delta_lw_packet_boundary"
  | "blocked_request_ledger_row_not_allowed"
  | "rejected_boundary_reference_only_packet"
  | "rejected_missing_source_owned_packet_fields"
  | "rejected_missing_source_packet"
  | "rejected_product_or_inferred_delta_lw_packet"
  | "rejected_reference_floor_not_same_stack_steel_packet"
  | "rejected_rights_blocked_packet"
  | "rejected_wrong_metric_basis_packet";

export type GateAYSteelFloorFormulaAcceptedPacketEvidence = {
  readonly basis: SteelFloorDeltaLwHoldoutBasis;
  readonly measuredDeltaLwDb: number | null;
  readonly referenceFloor: GateATSteelFloorFormulaPacketReferenceFloor;
  readonly representedRowCount: number;
  readonly rightsPosture: GateATSteelFloorFormulaPacketRightsPosture;
  readonly sourceKind: SteelFloorDeltaLwHoldoutSourceKind;
  readonly sourceOwnedFields: readonly SteelFloorDeltaLwRequiredSourceOwnerField[];
};

export type GateAYSteelFloorFormulaPacketAcceptanceBoundaryInput = {
  readonly id: string;
  readonly requestLedgerRow: GateAXSteelFloorFormulaPacketRequestLedgerRow;
  readonly sourcePacket: GateAYSteelFloorFormulaAcceptedPacketEvidence | null;
};

export type GateAYSteelFloorFormulaPacketAcceptanceBoundaryRow =
  GateAYSteelFloorFormulaPacketAcceptanceBoundaryInput & {
    readonly acceptanceDecision: GateAYSteelFloorFormulaPacketAcceptanceDecision;
    readonly canBecomeCalibrationEvidenceCandidateLater: boolean;
    readonly canBecomeCalibrationEvidenceNow: false;
    readonly canMoveRuntimeNow: false;
    readonly canPromoteExactSourceNow: false;
    readonly canRetuneRuntimeNow: false;
    readonly missingSourceOwnedFields: readonly SteelFloorDeltaLwRequiredSourceOwnerField[];
    readonly measuredMetricValueAcceptedAsPacket: boolean;
    readonly measuredMetricValueIngestedForRuntime: false;
    readonly packetAcceptanceAllowed: boolean;
    readonly packetAcceptanceUse:
      | "accepted_source_packet_boundary"
      | "blocked_packet_acceptance_boundary";
    readonly pairedNegativeBoundaryOwned: boolean;
    readonly runtimeValueMovement: false;
    readonly sourceDocumentCopied: false;
    readonly sourcePacketAccepted: boolean;
    readonly sourceRowsAreCalibrationEvidenceNow: false;
    readonly sourceTextIngested: false;
  };

export type GateAYSteelFloorFormulaSameStackIsoDeltaLwPacketAcceptanceBoundaryContract = {
  readonly acceptedBoundaryProbeIds: readonly string[];
  readonly currentAcceptedPacketBoundaryIds: readonly string[];
  readonly currentPacketAcceptanceBoundaryRows: readonly GateAYSteelFloorFormulaPacketAcceptanceBoundaryRow[];
  readonly currentRejectedPacketBoundaryIds: readonly string[];
  readonly exactSourceOverridePolicy: {
    readonly acceptedBoundaryPacketsAreNotExactRows: true;
    readonly exactMeasuredRowsRemainPrecedence: true;
    readonly fullAssemblyExactMatchRequired: true;
  };
  readonly fieldAndBuildingBasisSeparation: {
    readonly fieldOrAstmBasisCanTightenLabCorridor: false;
    readonly labDeltaLwCanAliasFieldMetrics: false;
  };
  readonly landedGate: "gate_ay_steel_floor_formula_same_stack_iso_delta_lw_packet_acceptance_boundary_plan";
  readonly packetAcceptanceBoundaryPolicy: {
    readonly allGateATAKOwnerFieldsRequired: true;
    readonly blockedGateAXRowsRemainBlocked: true;
    readonly calibrationEvidenceAllowedNow: false;
    readonly exactOverrideAllowedNow: false;
    readonly gateAXRequestLedgerEntriesOnly: true;
    readonly labIso101407172BasisRequired: true;
    readonly measuredMetricValueRuntimeIngestionAllowed: false;
    readonly pairedNegativeBoundaryOwnershipRequired: true;
    readonly sameStackSteelReferenceRequired: true;
    readonly sourceDocumentCopyAllowed: false;
    readonly sourceOwnedMeasuredDeltaLwRequired: true;
    readonly sourcePacketAcceptanceAllowedAtBoundaryOnly: true;
    readonly sourceTextIngestionAllowed: false;
  };
  readonly packetAcceptanceBoundaryProbeRows: readonly GateAYSteelFloorFormulaPacketAcceptanceBoundaryRow[];
  readonly packetAcceptanceBoundarySurface: {
    readonly measuredMetricIds: readonly ["DeltaLw"];
    readonly metricBasis: "lab_iso_10140_717_2";
    readonly referenceFloor: "same_stack_steel";
    readonly requiredPacketOwnerFields: readonly SteelFloorDeltaLwRequiredSourceOwnerField[];
    readonly selectedOwner: "accepted_source_owned_same_stack_iso_delta_lw_holdouts";
    readonly selectedTermId: "source_owned_delta_lw_holdout_absence";
    readonly usesGateAXRequestLedgerEntriesOnly: true;
  };
  readonly previousLandedGate: "gate_ax_steel_floor_formula_same_stack_iso_delta_lw_packet_request_ledger_plan";
  readonly rejectedBoundaryProbeIds: readonly string[];
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
  readonly selectedNextAction: typeof GATE_AY_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_PACKET_ACCEPTANCE_BOUNDARY_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof GATE_AY_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_PACKET_ACCEPTANCE_BOUNDARY_SELECTED_NEXT_FILE;
  readonly selectionStatus: "gate_ay_same_stack_iso_delta_lw_packet_acceptance_boundary_landed_no_runtime_selected_packet_calibration_candidate_gate_az";
};

const gateAXPacketRequestLedgerContract =
  buildGateAXSteelFloorFormulaSameStackIsoDeltaLwPacketRequestLedgerContract();

const ownerFieldsWithout = (
  excludedField: SteelFloorDeltaLwRequiredSourceOwnerField,
): readonly SteelFloorDeltaLwRequiredSourceOwnerField[] =>
  STEEL_FLOOR_DELTA_LW_REQUIRED_SOURCE_OWNER_FIELDS.filter(
    (field) => field !== excludedField,
  );

const requestLedgerRowByIntakeId = (
  id: string,
): GateAXSteelFloorFormulaPacketRequestLedgerRow => {
  const row =
    gateAXPacketRequestLedgerContract.packetRequestLedgerRows.find(
      (candidate) => candidate.packetReadinessRow.intakeRow.id === id,
    );

  if (!row) {
    throw new Error(`Gate AX request-ledger row not found: ${id}`);
  }

  return row;
};

const completeSourceOwnedPacket: GateAYSteelFloorFormulaAcceptedPacketEvidence =
  {
    basis: "lab_iso_10140_717_2",
    measuredDeltaLwDb: 23,
    referenceFloor: "same_stack_steel",
    representedRowCount: 1,
    rightsPosture: "rights_safe_metadata_only",
    sourceKind: "source_owned_same_stack_lab_delta_lw",
    sourceOwnedFields: STEEL_FLOOR_DELTA_LW_REQUIRED_SOURCE_OWNER_FIELDS,
  };

const isProductOrInferred = (
  sourceKind: SteelFloorDeltaLwHoldoutSourceKind,
): boolean =>
  sourceKind === "product_catalog_delta_lw" ||
  sourceKind === "annex_c_or_companion_inferred_delta_lw";

export function classifyGateAYSteelFloorFormulaSameStackIsoDeltaLwPacketAcceptanceBoundary(
  input: GateAYSteelFloorFormulaPacketAcceptanceBoundaryInput,
): GateAYSteelFloorFormulaPacketAcceptanceBoundaryRow {
  const sourcePacket = input.sourcePacket;
  const evaluated =
    sourcePacket === null
      ? null
      : evaluateSteelFloorDeltaLwHoldoutPacket({
          basis: sourcePacket.basis,
          id: input.id,
          measuredDeltaLwDb: sourcePacket.measuredDeltaLwDb,
          representedRowCount: sourcePacket.representedRowCount,
          runtimeValueMovement: false,
          sourceKind: sourcePacket.sourceKind,
          sourceOwnedFields: sourcePacket.sourceOwnedFields,
        });
  const missingSourceOwnedFields =
    evaluated?.missingSourceOwnedFields ??
    STEEL_FLOOR_DELTA_LW_REQUIRED_SOURCE_OWNER_FIELDS;
  const pairedNegativeBoundaryOwned =
    sourcePacket?.sourceOwnedFields.includes(
      "paired_negative_boundary_owner",
    ) ?? false;
  const hasMeasuredDeltaLw =
    sourcePacket !== null &&
    typeof sourcePacket.measuredDeltaLwDb === "number" &&
    Number.isFinite(sourcePacket.measuredDeltaLwDb);

  let acceptanceDecision: GateAYSteelFloorFormulaPacketAcceptanceDecision;
  if (!input.requestLedgerRow.ledgerEntryAllowed) {
    acceptanceDecision = "blocked_request_ledger_row_not_allowed";
  } else if (sourcePacket === null) {
    acceptanceDecision = "rejected_missing_source_packet";
  } else if (sourcePacket.rightsPosture === "rights_blocked_do_not_ingest") {
    acceptanceDecision = "rejected_rights_blocked_packet";
  } else if (sourcePacket.basis !== "lab_iso_10140_717_2") {
    acceptanceDecision = "rejected_wrong_metric_basis_packet";
  } else if (sourcePacket.referenceFloor === "boundary_reference_only") {
    acceptanceDecision = "rejected_boundary_reference_only_packet";
  } else if (sourcePacket.referenceFloor !== "same_stack_steel") {
    acceptanceDecision =
      "rejected_reference_floor_not_same_stack_steel_packet";
  } else if (isProductOrInferred(sourcePacket.sourceKind)) {
    acceptanceDecision = "rejected_product_or_inferred_delta_lw_packet";
  } else if (!hasMeasuredDeltaLw || missingSourceOwnedFields.length > 0) {
    acceptanceDecision = "rejected_missing_source_owned_packet_fields";
  } else {
    acceptanceDecision =
      "accepted_source_owned_same_stack_iso_delta_lw_packet_boundary";
  }

  const packetAcceptanceAllowed =
    acceptanceDecision ===
    "accepted_source_owned_same_stack_iso_delta_lw_packet_boundary";

  return {
    ...input,
    acceptanceDecision,
    canBecomeCalibrationEvidenceCandidateLater: packetAcceptanceAllowed,
    canBecomeCalibrationEvidenceNow: false,
    canMoveRuntimeNow: false,
    canPromoteExactSourceNow: false,
    canRetuneRuntimeNow: false,
    missingSourceOwnedFields,
    measuredMetricValueAcceptedAsPacket: packetAcceptanceAllowed,
    measuredMetricValueIngestedForRuntime: false,
    packetAcceptanceAllowed,
    packetAcceptanceUse: packetAcceptanceAllowed
      ? "accepted_source_packet_boundary"
      : "blocked_packet_acceptance_boundary",
    pairedNegativeBoundaryOwned,
    runtimeValueMovement: false,
    sourceDocumentCopied: false,
    sourcePacketAccepted: packetAcceptanceAllowed,
    sourceRowsAreCalibrationEvidenceNow: false,
    sourceTextIngested: false,
  };
}

const currentPacketAcceptanceBoundaryInputs =
  gateAXPacketRequestLedgerContract.packetRequestLedgerRows.map((row) => ({
    id: `gate_ay_current_${row.requestLedgerId}_packet_acceptance_boundary`,
    requestLedgerRow: row,
    sourcePacket: null,
  })) satisfies readonly GateAYSteelFloorFormulaPacketAcceptanceBoundaryInput[];

const packetAcceptanceBoundaryProbeInputs = [
  {
    id: "gate_ay_future_source_owned_same_stack_iso_delta_lw_packet_probe",
    requestLedgerRow: requestLedgerRowByIntakeId(
      "manufacturer_lab_report_index_same_stack_steel_iso_delta_lw_lead",
    ),
    sourcePacket: completeSourceOwnedPacket,
  },
  {
    id: "gate_ay_missing_measured_delta_lw_packet_probe",
    requestLedgerRow: requestLedgerRowByIntakeId(
      "accredited_lab_report_index_same_stack_steel_iso_delta_lw_lead",
    ),
    sourcePacket: {
      ...completeSourceOwnedPacket,
      measuredDeltaLwDb: null,
    },
  },
  {
    id: "gate_ay_missing_paired_negative_boundary_owner_packet_probe",
    requestLedgerRow: requestLedgerRowByIntakeId(
      "internal_measurement_packet_same_stack_steel_iso_delta_lw_lead",
    ),
    sourcePacket: {
      ...completeSourceOwnedPacket,
      sourceOwnedFields: ownerFieldsWithout("paired_negative_boundary_owner"),
    },
  },
  {
    id: "gate_ay_wrong_metric_basis_packet_probe",
    requestLedgerRow: requestLedgerRowByIntakeId(
      "manufacturer_lab_report_index_same_stack_steel_iso_delta_lw_lead",
    ),
    sourcePacket: {
      ...completeSourceOwnedPacket,
      basis: "field_or_astm_basis",
    },
  },
  {
    id: "gate_ay_concrete_reference_floor_packet_probe",
    requestLedgerRow: requestLedgerRowByIntakeId(
      "accredited_lab_report_index_same_stack_steel_iso_delta_lw_lead",
    ),
    sourcePacket: {
      ...completeSourceOwnedPacket,
      referenceFloor: "solid_or_concrete_reference_floor",
    },
  },
  {
    id: "gate_ay_product_delta_lw_packet_probe",
    requestLedgerRow: requestLedgerRowByIntakeId(
      "internal_measurement_packet_same_stack_steel_iso_delta_lw_lead",
    ),
    sourcePacket: {
      ...completeSourceOwnedPacket,
      sourceKind: "product_catalog_delta_lw",
    },
  },
  {
    id: "gate_ay_rights_blocked_packet_probe",
    requestLedgerRow: requestLedgerRowByIntakeId(
      "manufacturer_lab_report_index_same_stack_steel_iso_delta_lw_lead",
    ),
    sourcePacket: {
      ...completeSourceOwnedPacket,
      rightsPosture: "rights_blocked_do_not_ingest",
    },
  },
  {
    id: "gate_ay_blocked_request_ledger_packet_probe",
    requestLedgerRow: requestLedgerRowByIntakeId(
      "product_page_delta_lw_claim_lead",
    ),
    sourcePacket: completeSourceOwnedPacket,
  },
] satisfies readonly GateAYSteelFloorFormulaPacketAcceptanceBoundaryInput[];

export function buildGateAYSteelFloorFormulaSameStackIsoDeltaLwPacketAcceptanceBoundaryContract():
  GateAYSteelFloorFormulaSameStackIsoDeltaLwPacketAcceptanceBoundaryContract {
  const currentPacketAcceptanceBoundaryRows =
    currentPacketAcceptanceBoundaryInputs.map(
      classifyGateAYSteelFloorFormulaSameStackIsoDeltaLwPacketAcceptanceBoundary,
    );
  const packetAcceptanceBoundaryProbeRows =
    packetAcceptanceBoundaryProbeInputs.map(
      classifyGateAYSteelFloorFormulaSameStackIsoDeltaLwPacketAcceptanceBoundary,
    );
  const currentAcceptedPacketBoundaryIds =
    currentPacketAcceptanceBoundaryRows
      .filter((row) => row.packetAcceptanceAllowed)
      .map((row) => row.id);
  const currentRejectedPacketBoundaryIds =
    currentPacketAcceptanceBoundaryRows
      .filter((row) => !row.packetAcceptanceAllowed)
      .map((row) => row.id);
  const acceptedBoundaryProbeIds = packetAcceptanceBoundaryProbeRows
    .filter((row) => row.packetAcceptanceAllowed)
    .map((row) => row.id);
  const rejectedBoundaryProbeIds = packetAcceptanceBoundaryProbeRows
    .filter((row) => !row.packetAcceptanceAllowed)
    .map((row) => row.id);

  return {
    acceptedBoundaryProbeIds,
    currentAcceptedPacketBoundaryIds,
    currentPacketAcceptanceBoundaryRows,
    currentRejectedPacketBoundaryIds,
    exactSourceOverridePolicy: {
      acceptedBoundaryPacketsAreNotExactRows: true,
      exactMeasuredRowsRemainPrecedence: true,
      fullAssemblyExactMatchRequired: true,
    },
    fieldAndBuildingBasisSeparation: {
      fieldOrAstmBasisCanTightenLabCorridor: false,
      labDeltaLwCanAliasFieldMetrics: false,
    },
    landedGate:
      "gate_ay_steel_floor_formula_same_stack_iso_delta_lw_packet_acceptance_boundary_plan",
    packetAcceptanceBoundaryPolicy: {
      allGateATAKOwnerFieldsRequired: true,
      blockedGateAXRowsRemainBlocked: true,
      calibrationEvidenceAllowedNow: false,
      exactOverrideAllowedNow: false,
      gateAXRequestLedgerEntriesOnly: true,
      labIso101407172BasisRequired: true,
      measuredMetricValueRuntimeIngestionAllowed: false,
      pairedNegativeBoundaryOwnershipRequired: true,
      sameStackSteelReferenceRequired: true,
      sourceDocumentCopyAllowed: false,
      sourceOwnedMeasuredDeltaLwRequired: true,
      sourcePacketAcceptanceAllowedAtBoundaryOnly: true,
      sourceTextIngestionAllowed: false,
    },
    packetAcceptanceBoundaryProbeRows,
    packetAcceptanceBoundarySurface: {
      measuredMetricIds: ["DeltaLw"],
      metricBasis: "lab_iso_10140_717_2",
      referenceFloor: "same_stack_steel",
      requiredPacketOwnerFields:
        STEEL_FLOOR_DELTA_LW_REQUIRED_SOURCE_OWNER_FIELDS,
      selectedOwner: "accepted_source_owned_same_stack_iso_delta_lw_holdouts",
      selectedTermId: "source_owned_delta_lw_holdout_absence",
      usesGateAXRequestLedgerEntriesOnly: true,
    },
    previousLandedGate:
      "gate_ax_steel_floor_formula_same_stack_iso_delta_lw_packet_request_ledger_plan",
    rejectedBoundaryProbeIds,
    requestLedgerEntryIds:
      gateAXPacketRequestLedgerContract.requestLedgerEntryIds,
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
      GATE_AY_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_PACKET_ACCEPTANCE_BOUNDARY_SELECTED_NEXT_ACTION,
    selectedNextFile:
      GATE_AY_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_PACKET_ACCEPTANCE_BOUNDARY_SELECTED_NEXT_FILE,
    selectionStatus:
      "gate_ay_same_stack_iso_delta_lw_packet_acceptance_boundary_landed_no_runtime_selected_packet_calibration_candidate_gate_az",
  };
}
