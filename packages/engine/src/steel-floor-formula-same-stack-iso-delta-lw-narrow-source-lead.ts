import {
  buildGateATSteelFloorFormulaSameStackIsoDeltaLwPacketTargetContract,
  type GateATSteelFloorFormulaPacketRightsPosture,
} from "./steel-floor-formula-same-stack-iso-delta-lw-packet-target";
import {
  type SteelFloorDeltaLwHoldoutBasis,
  type SteelFloorDeltaLwRequiredSourceOwnerField,
} from "./steel-floor-formula-source-owned-delta-lw-holdout";
import {
  STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB,
  STEEL_FLOOR_FORMULA_LN_W_TOLERANCE_DB,
} from "./steel-floor-impact-formula-corridor";

export const GATE_AU_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_NARROW_SOURCE_LEAD_SELECTED_NEXT_FILE =
  "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-av-steel-floor-formula-same-stack-iso-delta-lw-source-lead-intake-contract.test.ts";

export const GATE_AU_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_NARROW_SOURCE_LEAD_SELECTED_NEXT_ACTION =
  "gate_av_steel_floor_formula_same_stack_iso_delta_lw_source_lead_intake_plan";

export type GateAUSteelFloorFormulaSourceLeadKind =
  | "accredited_lab_report_index_same_stack_steel_iso_delta_lw"
  | "astm_iic_stc_or_field_basis_report_lead"
  | "boundary_scope_reference_lead"
  | "concrete_reference_iso_delta_lw_lead"
  | "internal_measurement_packet_same_stack_steel_iso_delta_lw"
  | "manufacturer_report_index_same_stack_steel_iso_delta_lw"
  | "missing_owner_metadata_same_stack_iso_delta_lw_lead"
  | "product_page_or_catalog_delta_lw_claim"
  | "rights_blocked_same_stack_iso_delta_lw_report_lead";

export type GateAUSteelFloorFormulaSourceLeadReferenceFloor =
  | "boundary_reference_only"
  | "same_stack_steel"
  | "solid_or_concrete_reference_floor";

export type GateAUSteelFloorFormulaSourceLeadBucket =
  | "accepted_narrow_source_lead_for_packet_acquisition"
  | "rejected_boundary_reference_only_lead"
  | "rejected_missing_source_owned_lead_fields"
  | "rejected_product_or_inferred_lead"
  | "rejected_reference_floor_not_same_stack_steel_lead"
  | "rejected_rights_blocked_lead"
  | "rejected_wrong_metric_basis_lead";

export type GateAUSteelFloorFormulaSourceLeadInput = {
  readonly basis: SteelFloorDeltaLwHoldoutBasis;
  readonly id: string;
  readonly leadKind: GateAUSteelFloorFormulaSourceLeadKind;
  readonly leadLabel: string;
  readonly measuredMetricIds: readonly string[];
  readonly referenceFloor: GateAUSteelFloorFormulaSourceLeadReferenceFloor;
  readonly rightsPosture: GateATSteelFloorFormulaPacketRightsPosture;
  readonly sourceOwnedFields: readonly SteelFloorDeltaLwRequiredSourceOwnerField[];
};

export type GateAUSteelFloorFormulaSourceLeadClassification =
  GateAUSteelFloorFormulaSourceLeadInput & {
    readonly bucket: GateAUSteelFloorFormulaSourceLeadBucket;
    readonly canBecomeCalibrationEvidenceNow: false;
    readonly canMoveRuntimeNow: false;
    readonly canProceedToPacketAcquisition: boolean;
    readonly canPromoteExactSourceNow: false;
    readonly missingSourceOwnedFields: readonly SteelFloorDeltaLwRequiredSourceOwnerField[];
    readonly runtimeValueMovement: false;
    readonly sourceLeadUse: "metadata_only_packet_acquisition_target";
  };

export type GateAUSteelFloorFormulaSameStackIsoDeltaLwNarrowSourceLeadContract = {
  readonly acceptedLeadIds: readonly string[];
  readonly exactSourceOverridePolicy: {
    readonly exactMeasuredRowsRemainPrecedence: true;
    readonly fullAssemblyExactMatchRequired: true;
    readonly sourceLeadsAreNotExactRows: true;
  };
  readonly fieldAndBuildingBasisSeparation: {
    readonly fieldOrAstmBasisCanTightenLabCorridor: false;
    readonly labDeltaLwCanAliasFieldMetrics: false;
  };
  readonly landedGate: "gate_au_steel_floor_formula_same_stack_iso_delta_lw_narrow_source_lead_plan";
  readonly leadClassifications: readonly GateAUSteelFloorFormulaSourceLeadClassification[];
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
  };
  readonly previousLandedGate: "gate_at_steel_floor_formula_same_stack_iso_delta_lw_packet_target_plan";
  readonly rejectedLeadIds: readonly string[];
  readonly runtimePins: {
    readonly deltaLwToleranceDb: typeof STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB;
    readonly estimateDeltaLw: 22.4;
    readonly estimateLnW: 55.6;
    readonly lnWToleranceDb: typeof STEEL_FLOOR_FORMULA_LN_W_TOLERANCE_DB;
    readonly runtimeRetuneAllowedNow: false;
    readonly runtimeValueMovement: false;
  };
  readonly selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1";
  readonly selectedNextAction: typeof GATE_AU_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_NARROW_SOURCE_LEAD_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof GATE_AU_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_NARROW_SOURCE_LEAD_SELECTED_NEXT_FILE;
  readonly selectionStatus: "gate_au_same_stack_iso_delta_lw_narrow_source_lead_landed_no_runtime_selected_source_lead_intake_gate_av";
};

const gateATPacketSurface =
  buildGateATSteelFloorFormulaSameStackIsoDeltaLwPacketTargetContract()
    .packetAcceptanceSurface;

const leadInputs = [
  {
    basis: "lab_iso_10140_717_2",
    id: "manufacturer_lab_report_index_same_stack_steel_iso_delta_lw_lead",
    leadKind: "manufacturer_report_index_same_stack_steel_iso_delta_lw",
    leadLabel: "Manufacturer lab-report index naming same-stack steel ISO DeltaLw",
    measuredMetricIds: ["DeltaLw"],
    referenceFloor: "same_stack_steel",
    rightsPosture: "rights_safe_metadata_only",
    sourceOwnedFields: gateATPacketSurface.requiredSourceOwnedFields,
  },
  {
    basis: "lab_iso_10140_717_2",
    id: "accredited_lab_report_index_same_stack_steel_iso_delta_lw_lead",
    leadKind: "accredited_lab_report_index_same_stack_steel_iso_delta_lw",
    leadLabel: "Accredited lab index naming same-stack steel ISO DeltaLw",
    measuredMetricIds: ["DeltaLw"],
    referenceFloor: "same_stack_steel",
    rightsPosture: "rights_safe_metadata_only",
    sourceOwnedFields: gateATPacketSurface.requiredSourceOwnedFields,
  },
  {
    basis: "lab_iso_10140_717_2",
    id: "internal_measurement_packet_same_stack_steel_iso_delta_lw_lead",
    leadKind: "internal_measurement_packet_same_stack_steel_iso_delta_lw",
    leadLabel: "Internal measurement packet lead with same-stack steel ISO DeltaLw",
    measuredMetricIds: ["DeltaLw"],
    referenceFloor: "same_stack_steel",
    rightsPosture: "rights_safe_metadata_only",
    sourceOwnedFields: gateATPacketSurface.requiredSourceOwnedFields,
  },
  {
    basis: "lab_iso_10140_717_2",
    id: "product_page_delta_lw_claim_lead",
    leadKind: "product_page_or_catalog_delta_lw_claim",
    leadLabel: "Product page or catalog DeltaLw claim",
    measuredMetricIds: ["DeltaLw"],
    referenceFloor: "same_stack_steel",
    rightsPosture: "rights_safe_metadata_only",
    sourceOwnedFields: ["metric_value"],
  },
  {
    basis: "field_or_astm_basis",
    id: "astm_iic_stc_or_field_basis_report_lead",
    leadKind: "astm_iic_stc_or_field_basis_report_lead",
    leadLabel: "ASTM/IIC/STC or field-basis steel report lead",
    measuredMetricIds: ["IIC", "STC"],
    referenceFloor: "same_stack_steel",
    rightsPosture: "rights_safe_metadata_only",
    sourceOwnedFields: ["topology_and_support_family"],
  },
  {
    basis: "lab_iso_10140_717_2",
    id: "concrete_reference_iso_delta_lw_lead",
    leadKind: "concrete_reference_iso_delta_lw_lead",
    leadLabel: "Concrete reference-floor ISO DeltaLw lead",
    measuredMetricIds: ["DeltaLw"],
    referenceFloor: "solid_or_concrete_reference_floor",
    rightsPosture: "rights_safe_metadata_only",
    sourceOwnedFields: ["metric_value", "load_basis"],
  },
  {
    basis: "lab_iso_10140_717_2",
    id: "boundary_scope_reference_lead",
    leadKind: "boundary_scope_reference_lead",
    leadLabel: "Boundary-only ISO DeltaLw scope reference lead",
    measuredMetricIds: [],
    referenceFloor: "boundary_reference_only",
    rightsPosture: "rights_safe_metadata_only",
    sourceOwnedFields: [],
  },
  {
    basis: "lab_iso_10140_717_2",
    id: "missing_owner_metadata_same_stack_iso_delta_lw_lead",
    leadKind: "missing_owner_metadata_same_stack_iso_delta_lw_lead",
    leadLabel: "Same-stack ISO DeltaLw lead missing physical owner metadata",
    measuredMetricIds: ["DeltaLw"],
    referenceFloor: "same_stack_steel",
    rightsPosture: "rights_safe_metadata_only",
    sourceOwnedFields: ["metric_value", "topology_and_support_family"],
  },
  {
    basis: "lab_iso_10140_717_2",
    id: "rights_blocked_same_stack_iso_delta_lw_report_lead",
    leadKind: "rights_blocked_same_stack_iso_delta_lw_report_lead",
    leadLabel: "Rights-blocked same-stack ISO DeltaLw report lead",
    measuredMetricIds: ["DeltaLw"],
    referenceFloor: "same_stack_steel",
    rightsPosture: "rights_blocked_do_not_ingest",
    sourceOwnedFields: gateATPacketSurface.requiredSourceOwnedFields,
  },
] as const satisfies readonly GateAUSteelFloorFormulaSourceLeadInput[];

const missingLeadFields = (
  fields: readonly SteelFloorDeltaLwRequiredSourceOwnerField[],
): readonly SteelFloorDeltaLwRequiredSourceOwnerField[] => {
  const owned = new Set(fields);

  return gateATPacketSurface.requiredSourceOwnedFields.filter(
    (field) => !owned.has(field),
  );
};

const isProductOrInferredLead = (
  leadKind: GateAUSteelFloorFormulaSourceLeadKind,
): boolean =>
  leadKind === "product_page_or_catalog_delta_lw_claim";

export function classifyGateAUSteelFloorFormulaSameStackIsoDeltaLwSourceLead(
  input: GateAUSteelFloorFormulaSourceLeadInput,
): GateAUSteelFloorFormulaSourceLeadClassification {
  const missingSourceOwnedFields = missingLeadFields(input.sourceOwnedFields);
  const hasDeltaLwMetric = input.measuredMetricIds.includes("DeltaLw");

  let bucket: GateAUSteelFloorFormulaSourceLeadBucket;
  if (input.basis !== "lab_iso_10140_717_2") {
    bucket = "rejected_wrong_metric_basis_lead";
  } else if (input.referenceFloor === "boundary_reference_only") {
    bucket = "rejected_boundary_reference_only_lead";
  } else if (input.referenceFloor !== "same_stack_steel") {
    bucket = "rejected_reference_floor_not_same_stack_steel_lead";
  } else if (isProductOrInferredLead(input.leadKind)) {
    bucket = "rejected_product_or_inferred_lead";
  } else if (input.rightsPosture === "rights_blocked_do_not_ingest") {
    bucket = "rejected_rights_blocked_lead";
  } else if (!hasDeltaLwMetric || missingSourceOwnedFields.length > 0) {
    bucket = "rejected_missing_source_owned_lead_fields";
  } else {
    bucket = "accepted_narrow_source_lead_for_packet_acquisition";
  }

  const canProceedToPacketAcquisition =
    bucket === "accepted_narrow_source_lead_for_packet_acquisition";

  return {
    ...input,
    bucket,
    canBecomeCalibrationEvidenceNow: false,
    canMoveRuntimeNow: false,
    canProceedToPacketAcquisition,
    canPromoteExactSourceNow: false,
    missingSourceOwnedFields,
    runtimeValueMovement: false,
    sourceLeadUse: "metadata_only_packet_acquisition_target",
  };
}

export function buildGateAUSteelFloorFormulaSameStackIsoDeltaLwNarrowSourceLeadContract():
  GateAUSteelFloorFormulaSameStackIsoDeltaLwNarrowSourceLeadContract {
  const leadClassifications = leadInputs.map(
    classifyGateAUSteelFloorFormulaSameStackIsoDeltaLwSourceLead,
  );
  const acceptedLeadIds = leadClassifications
    .filter((lead) => lead.canProceedToPacketAcquisition)
    .map((lead) => lead.id);
  const rejectedLeadIds = leadClassifications
    .filter((lead) => !lead.canProceedToPacketAcquisition)
    .map((lead) => lead.id);

  return {
    acceptedLeadIds,
    exactSourceOverridePolicy: {
      exactMeasuredRowsRemainPrecedence: true,
      fullAssemblyExactMatchRequired: true,
      sourceLeadsAreNotExactRows: true,
    },
    fieldAndBuildingBasisSeparation: {
      fieldOrAstmBasisCanTightenLabCorridor: false,
      labDeltaLwCanAliasFieldMetrics: false,
    },
    landedGate:
      "gate_au_steel_floor_formula_same_stack_iso_delta_lw_narrow_source_lead_plan",
    leadClassifications,
    leadScope: {
      broadSourceLibraryCrawlAllowed: false,
      measuredMetricIds: gateATPacketSurface.measuredMetricIds,
      metricBasis: gateATPacketSurface.metricBasis,
      referenceFloor: gateATPacketSurface.referenceFloor,
      requiredSourceOwnedFields: gateATPacketSurface.requiredSourceOwnedFields,
      rightsSafeMetadataOnly: true,
      selectedOwner: gateATPacketSurface.selectedOwner,
      selectedTermId: gateATPacketSurface.selectedTermId,
      usesGateATPacketAcceptanceSurfaceOnly: true,
    },
    previousLandedGate:
      "gate_at_steel_floor_formula_same_stack_iso_delta_lw_packet_target_plan",
    rejectedLeadIds,
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
      GATE_AU_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_NARROW_SOURCE_LEAD_SELECTED_NEXT_ACTION,
    selectedNextFile:
      GATE_AU_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_NARROW_SOURCE_LEAD_SELECTED_NEXT_FILE,
    selectionStatus:
      "gate_au_same_stack_iso_delta_lw_narrow_source_lead_landed_no_runtime_selected_source_lead_intake_gate_av",
  };
}
