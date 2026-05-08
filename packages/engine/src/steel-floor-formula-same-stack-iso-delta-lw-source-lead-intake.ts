import {
  buildGateAUSteelFloorFormulaSameStackIsoDeltaLwNarrowSourceLeadContract,
  classifyGateAUSteelFloorFormulaSameStackIsoDeltaLwSourceLead,
  type GateAUSteelFloorFormulaSourceLeadBucket,
  type GateAUSteelFloorFormulaSourceLeadClassification,
  type GateAUSteelFloorFormulaSourceLeadInput,
} from "./steel-floor-formula-same-stack-iso-delta-lw-narrow-source-lead";
import {
  type SteelFloorDeltaLwRequiredSourceOwnerField,
} from "./steel-floor-formula-source-owned-delta-lw-holdout";
import {
  STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB,
  STEEL_FLOOR_FORMULA_LN_W_TOLERANCE_DB,
} from "./steel-floor-impact-formula-corridor";

export const GATE_AV_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_SOURCE_LEAD_INTAKE_SELECTED_NEXT_FILE =
  "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-aw-steel-floor-formula-same-stack-iso-delta-lw-packet-acquisition-readiness-contract.test.ts";

export const GATE_AV_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_SOURCE_LEAD_INTAKE_SELECTED_NEXT_ACTION =
  "gate_aw_steel_floor_formula_same_stack_iso_delta_lw_packet_acquisition_readiness_plan";

export type GateAVSteelFloorFormulaSourceLeadIntakeDecision =
  | "accepted_metadata_only_source_lead_intake_row"
  | "rejected_boundary_reference_only_source_lead_intake"
  | "rejected_missing_source_owned_fields_source_lead_intake"
  | "rejected_product_or_inferred_source_lead_intake"
  | "rejected_reference_floor_not_same_stack_steel_source_lead_intake"
  | "rejected_rights_blocked_source_lead_intake"
  | "rejected_wrong_metric_basis_source_lead_intake";

export type GateAVSteelFloorFormulaSourceLeadIntakeRow =
  GateAUSteelFloorFormulaSourceLeadClassification & {
    readonly acquisitionRequestAllowed: boolean;
    readonly canBecomeCalibrationEvidenceNow: false;
    readonly canBecomeSourcePacketNow: false;
    readonly canMoveRuntimeNow: false;
    readonly canPromoteExactSourceNow: false;
    readonly intakeDecision: GateAVSteelFloorFormulaSourceLeadIntakeDecision;
    readonly intakeLedgerUse:
      | "blocked_source_lead_intake_boundary"
      | "metadata_only_source_lead_packet_request_target";
    readonly measuredMetricValueIngested: false;
    readonly nextPacketAcquisitionGate: typeof GATE_AV_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_SOURCE_LEAD_INTAKE_SELECTED_NEXT_ACTION;
    readonly requiredPacketOwnerFields: readonly SteelFloorDeltaLwRequiredSourceOwnerField[];
    readonly rightsSafeMetadataOnly: true;
    readonly runtimeValueMovement: false;
    readonly sourceTextIngested: false;
  };

export type GateAVSteelFloorFormulaSameStackIsoDeltaLwSourceLeadIntakeContract = {
  readonly acceptedIntakeRowIds: readonly string[];
  readonly exactSourceOverridePolicy: {
    readonly exactMeasuredRowsRemainPrecedence: true;
    readonly fullAssemblyExactMatchRequired: true;
    readonly sourceLeadIntakeRowsAreNotExactRows: true;
  };
  readonly fieldAndBuildingBasisSeparation: {
    readonly fieldOrAstmBasisCanTightenLabCorridor: false;
    readonly labDeltaLwCanAliasFieldMetrics: false;
  };
  readonly intakeLedgerPolicy: {
    readonly acceptedRowsAreAcquisitionTargetsOnly: true;
    readonly broadSourceLibraryCrawlAllowed: false;
    readonly calibrationEvidenceAllowedNow: false;
    readonly exactOverrideAllowedNow: false;
    readonly measuredMetricValueIngestionAllowed: false;
    readonly rightsSafeMetadataOnly: true;
    readonly sourcePacketAcceptanceAllowedNow: false;
    readonly sourceTextIngestionAllowed: false;
  };
  readonly landedGate: "gate_av_steel_floor_formula_same_stack_iso_delta_lw_source_lead_intake_plan";
  readonly leadIntakeRows: readonly GateAVSteelFloorFormulaSourceLeadIntakeRow[];
  readonly leadScope: {
    readonly broadSourceLibraryCrawlAllowed: false;
    readonly measuredMetricIds: readonly ["DeltaLw"];
    readonly metricBasis: "lab_iso_10140_717_2";
    readonly referenceFloor: "same_stack_steel";
    readonly requiredSourceOwnedFields: readonly SteelFloorDeltaLwRequiredSourceOwnerField[];
    readonly rightsSafeMetadataOnly: true;
    readonly selectedOwner: "accepted_source_owned_same_stack_iso_delta_lw_holdouts";
    readonly selectedTermId: "source_owned_delta_lw_holdout_absence";
    readonly usesGateATPacketAcceptanceSurfaceOnly: true;
    readonly usesGateAUNarrowLeadScopeOnly: true;
  };
  readonly previousLandedGate: "gate_au_steel_floor_formula_same_stack_iso_delta_lw_narrow_source_lead_plan";
  readonly rejectedIntakeRowIds: readonly string[];
  readonly runtimePins: {
    readonly deltaLwToleranceDb: typeof STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB;
    readonly estimateDeltaLw: 22.4;
    readonly estimateLnW: 55.6;
    readonly lnWToleranceDb: typeof STEEL_FLOOR_FORMULA_LN_W_TOLERANCE_DB;
    readonly runtimeRetuneAllowedNow: false;
    readonly runtimeValueMovement: false;
  };
  readonly selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1";
  readonly selectedNextAction: typeof GATE_AV_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_SOURCE_LEAD_INTAKE_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof GATE_AV_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_SOURCE_LEAD_INTAKE_SELECTED_NEXT_FILE;
  readonly selectionStatus: "gate_av_same_stack_iso_delta_lw_source_lead_intake_landed_no_runtime_selected_packet_acquisition_readiness_gate_aw";
};

const intakeDecisionForBucket: Record<
  GateAUSteelFloorFormulaSourceLeadBucket,
  GateAVSteelFloorFormulaSourceLeadIntakeDecision
> = {
  accepted_narrow_source_lead_for_packet_acquisition:
    "accepted_metadata_only_source_lead_intake_row",
  rejected_boundary_reference_only_lead:
    "rejected_boundary_reference_only_source_lead_intake",
  rejected_missing_source_owned_lead_fields:
    "rejected_missing_source_owned_fields_source_lead_intake",
  rejected_product_or_inferred_lead:
    "rejected_product_or_inferred_source_lead_intake",
  rejected_reference_floor_not_same_stack_steel_lead:
    "rejected_reference_floor_not_same_stack_steel_source_lead_intake",
  rejected_rights_blocked_lead: "rejected_rights_blocked_source_lead_intake",
  rejected_wrong_metric_basis_lead:
    "rejected_wrong_metric_basis_source_lead_intake",
};

const gateAUNarrowLeadContract =
  buildGateAUSteelFloorFormulaSameStackIsoDeltaLwNarrowSourceLeadContract();

export function classifyGateAVSteelFloorFormulaSameStackIsoDeltaLwSourceLeadIntake(
  input: GateAUSteelFloorFormulaSourceLeadInput,
): GateAVSteelFloorFormulaSourceLeadIntakeRow {
  const leadClassification =
    classifyGateAUSteelFloorFormulaSameStackIsoDeltaLwSourceLead(input);
  const acquisitionRequestAllowed =
    leadClassification.bucket ===
    "accepted_narrow_source_lead_for_packet_acquisition";

  return {
    ...leadClassification,
    acquisitionRequestAllowed,
    canBecomeCalibrationEvidenceNow: false,
    canBecomeSourcePacketNow: false,
    canMoveRuntimeNow: false,
    canPromoteExactSourceNow: false,
    intakeDecision: intakeDecisionForBucket[leadClassification.bucket],
    intakeLedgerUse: acquisitionRequestAllowed
      ? "metadata_only_source_lead_packet_request_target"
      : "blocked_source_lead_intake_boundary",
    measuredMetricValueIngested: false,
    nextPacketAcquisitionGate:
      GATE_AV_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_SOURCE_LEAD_INTAKE_SELECTED_NEXT_ACTION,
    requiredPacketOwnerFields:
      gateAUNarrowLeadContract.leadScope.requiredSourceOwnedFields,
    rightsSafeMetadataOnly: true,
    runtimeValueMovement: false,
    sourceTextIngested: false,
  };
}

export function buildGateAVSteelFloorFormulaSameStackIsoDeltaLwSourceLeadIntakeContract():
  GateAVSteelFloorFormulaSameStackIsoDeltaLwSourceLeadIntakeContract {
  const leadIntakeRows = gateAUNarrowLeadContract.leadClassifications.map(
    classifyGateAVSteelFloorFormulaSameStackIsoDeltaLwSourceLeadIntake,
  );
  const acceptedIntakeRowIds = leadIntakeRows
    .filter((row) => row.acquisitionRequestAllowed)
    .map((row) => row.id);
  const rejectedIntakeRowIds = leadIntakeRows
    .filter((row) => !row.acquisitionRequestAllowed)
    .map((row) => row.id);

  return {
    acceptedIntakeRowIds,
    exactSourceOverridePolicy: {
      exactMeasuredRowsRemainPrecedence: true,
      fullAssemblyExactMatchRequired: true,
      sourceLeadIntakeRowsAreNotExactRows: true,
    },
    fieldAndBuildingBasisSeparation: {
      fieldOrAstmBasisCanTightenLabCorridor: false,
      labDeltaLwCanAliasFieldMetrics: false,
    },
    intakeLedgerPolicy: {
      acceptedRowsAreAcquisitionTargetsOnly: true,
      broadSourceLibraryCrawlAllowed: false,
      calibrationEvidenceAllowedNow: false,
      exactOverrideAllowedNow: false,
      measuredMetricValueIngestionAllowed: false,
      rightsSafeMetadataOnly: true,
      sourcePacketAcceptanceAllowedNow: false,
      sourceTextIngestionAllowed: false,
    },
    landedGate:
      "gate_av_steel_floor_formula_same_stack_iso_delta_lw_source_lead_intake_plan",
    leadIntakeRows,
    leadScope: {
      ...gateAUNarrowLeadContract.leadScope,
      usesGateAUNarrowLeadScopeOnly: true,
    },
    previousLandedGate:
      "gate_au_steel_floor_formula_same_stack_iso_delta_lw_narrow_source_lead_plan",
    rejectedIntakeRowIds,
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
      GATE_AV_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_SOURCE_LEAD_INTAKE_SELECTED_NEXT_ACTION,
    selectedNextFile:
      GATE_AV_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_SOURCE_LEAD_INTAKE_SELECTED_NEXT_FILE,
    selectionStatus:
      "gate_av_same_stack_iso_delta_lw_source_lead_intake_landed_no_runtime_selected_packet_acquisition_readiness_gate_aw",
  };
}
