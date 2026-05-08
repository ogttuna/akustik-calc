import {
  buildGateASSteelFloorFormulaOwnerEvidenceTargetingContract,
  type GateASSteelFloorFormulaOwnerEvidenceRejectionBoundary,
} from "./steel-floor-formula-owner-evidence-targeting";
import {
  evaluateSteelFloorFormulaResidualMetricPolicy,
  type SteelFloorFormulaResidualMetricPolicy,
} from "./steel-floor-formula-residual-policy";
import {
  STEEL_FLOOR_DELTA_LW_REQUIRED_SOURCE_OWNER_FIELDS,
  evaluateSteelFloorDeltaLwHoldoutPacket,
  type SteelFloorDeltaLwHoldoutBasis,
  type SteelFloorDeltaLwHoldoutSourceKind,
  type SteelFloorDeltaLwRequiredSourceOwnerField,
} from "./steel-floor-formula-source-owned-delta-lw-holdout";
import {
  GATE_AJ_REQUIRED_DELTA_LW_MEASURED_HOLDOUT_COUNT,
  GATE_AJ_REQUIRED_NEGATIVE_BOUNDARY_COUNT,
} from "./steel-floor-formula-negative-boundary-delta-lw-intake";
import {
  STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB,
  STEEL_FLOOR_FORMULA_LN_W_TOLERANCE_DB,
} from "./steel-floor-impact-formula-corridor";

export const GATE_AT_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_PACKET_TARGET_SELECTED_NEXT_FILE =
  "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-au-steel-floor-formula-same-stack-iso-delta-lw-narrow-source-lead-contract.test.ts";

export const GATE_AT_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_PACKET_TARGET_SELECTED_NEXT_ACTION =
  "gate_au_steel_floor_formula_same_stack_iso_delta_lw_narrow_source_lead_plan";

export type GateATSteelFloorFormulaPacketReferenceFloor =
  | "boundary_reference_only"
  | "same_stack_steel"
  | "solid_or_concrete_reference_floor";

export type GateATSteelFloorFormulaPacketRightsPosture =
  | "rights_blocked_do_not_ingest"
  | "rights_safe_metadata_only";

export type GateATSteelFloorFormulaPacketTargetBucket =
  | "accepted_source_owned_same_stack_iso_delta_lw_packet_fixture"
  | "rejected_boundary_reference_only"
  | "rejected_missing_source_owned_packet_fields"
  | "rejected_product_or_inferred_delta_lw"
  | "rejected_reference_floor_not_same_stack_steel"
  | "rejected_rights_blocked"
  | "rejected_wrong_metric_basis";

export type GateATSteelFloorFormulaPacketCandidateInput = {
  readonly basis: SteelFloorDeltaLwHoldoutBasis;
  readonly fullAssemblyExactMatch: boolean;
  readonly id: string;
  readonly measuredDeltaLwDb: number | null;
  readonly referenceFloor: GateATSteelFloorFormulaPacketReferenceFloor;
  readonly representedRowCount: number;
  readonly rightsPosture: GateATSteelFloorFormulaPacketRightsPosture;
  readonly sourceKind: SteelFloorDeltaLwHoldoutSourceKind;
  readonly sourceLabel: string;
  readonly sourceOwnedFields: readonly SteelFloorDeltaLwRequiredSourceOwnerField[];
  readonly sourceUrl: string | null;
};

export type GateATSteelFloorFormulaPacketClassification =
  GateATSteelFloorFormulaPacketCandidateInput & {
    readonly bucket: GateATSteelFloorFormulaPacketTargetBucket;
    readonly canBecomeCalibrationEvidence: boolean;
    readonly canMoveRuntimeNow: false;
    readonly canPromoteExactSourceNow: false;
    readonly missingSourceOwnedFields: readonly SteelFloorDeltaLwRequiredSourceOwnerField[];
    readonly residualPolicyIfAccepted: SteelFloorFormulaResidualMetricPolicy | null;
    readonly runtimeValueMovement: false;
    readonly sourceRowsAreCalibrationEvidenceNotProduct: true;
  };

export type GateATSteelFloorFormulaSameStackIsoDeltaLwPacketTargetContract = {
  readonly acceptedFixtureProbeIds: readonly string[];
  readonly exactSourceOverridePolicy: {
    readonly exactMeasuredRowsRemainPrecedence: true;
    readonly fullAssemblyExactMatchRequired: true;
    readonly targetPacketIsCalibrationEvidenceByDefault: true;
  };
  readonly fieldAndBuildingBasisSeparation: {
    readonly fieldOrAstmBasisCanTightenLabCorridor: false;
    readonly labDeltaLwCanAliasFieldMetrics: false;
  };
  readonly fixturePacketClassifications: readonly GateATSteelFloorFormulaPacketClassification[];
  readonly landedGate: "gate_at_steel_floor_formula_same_stack_iso_delta_lw_packet_target_plan";
  readonly packetAcceptanceSurface: {
    readonly broadSourceLibraryCrawlAllowed: false;
    readonly measuredMetricIds: readonly ["DeltaLw"];
    readonly metricBasis: "lab_iso_10140_717_2";
    readonly minimumAcceptedPacketCountBeforeRetune: typeof GATE_AJ_REQUIRED_DELTA_LW_MEASURED_HOLDOUT_COUNT;
    readonly minimumPairedNegativeBoundaryCountBeforeRetune: typeof GATE_AJ_REQUIRED_NEGATIVE_BOUNDARY_COUNT;
    readonly referenceFloor: "same_stack_steel";
    readonly rejectionBoundaries: readonly GateASSteelFloorFormulaOwnerEvidenceRejectionBoundary[];
    readonly requiredSourceOwnedFields: readonly SteelFloorDeltaLwRequiredSourceOwnerField[];
    readonly selectedOwner: "accepted_source_owned_same_stack_iso_delta_lw_holdouts";
    readonly selectedTermId: "source_owned_delta_lw_holdout_absence";
    readonly usesGateASSelectedTargetOnly: true;
  };
  readonly previousLandedGate: "gate_as_steel_floor_formula_owner_evidence_targeting_plan";
  readonly rejectedFixtureProbeIds: readonly string[];
  readonly runtimePins: {
    readonly deltaLwToleranceDb: typeof STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB;
    readonly estimateDeltaLw: 22.4;
    readonly estimateLnW: 55.6;
    readonly lnWToleranceDb: typeof STEEL_FLOOR_FORMULA_LN_W_TOLERANCE_DB;
    readonly runtimeRetuneAllowedNow: false;
    readonly runtimeValueMovement: false;
  };
  readonly selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1";
  readonly selectedNextAction: typeof GATE_AT_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_PACKET_TARGET_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof GATE_AT_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_PACKET_TARGET_SELECTED_NEXT_FILE;
  readonly selectionStatus: "gate_at_same_stack_iso_delta_lw_packet_target_landed_no_runtime_selected_narrow_source_lead_gate_au";
};

const fixturePacketInputs = [
  {
    basis: "lab_iso_10140_717_2",
    fullAssemblyExactMatch: false,
    id: "gate_at_future_source_owned_same_stack_iso_delta_lw_packet_fixture",
    measuredDeltaLwDb: 23,
    referenceFloor: "same_stack_steel",
    representedRowCount: 1,
    rightsPosture: "rights_safe_metadata_only",
    sourceKind: "source_owned_same_stack_lab_delta_lw",
    sourceLabel: "Future rights-safe same-stack ISO DeltaLw packet fixture",
    sourceOwnedFields: STEEL_FLOOR_DELTA_LW_REQUIRED_SOURCE_OWNER_FIELDS,
    sourceUrl: null,
  },
  {
    basis: "lab_iso_10140_717_2",
    fullAssemblyExactMatch: false,
    id: "gate_at_product_catalog_delta_lw_fixture",
    measuredDeltaLwDb: 26,
    referenceFloor: "same_stack_steel",
    representedRowCount: 1,
    rightsPosture: "rights_safe_metadata_only",
    sourceKind: "product_catalog_delta_lw",
    sourceLabel: "Product catalog DeltaLw fixture",
    sourceOwnedFields: ["metric_value"],
    sourceUrl: null,
  },
  {
    basis: "field_or_astm_basis",
    fullAssemblyExactMatch: false,
    id: "gate_at_astm_iic_stc_or_field_basis_fixture",
    measuredDeltaLwDb: null,
    referenceFloor: "same_stack_steel",
    representedRowCount: 1,
    rightsPosture: "rights_safe_metadata_only",
    sourceKind: "field_astm_or_building_prediction_delta_lw",
    sourceLabel: "ASTM/IIC/STC or field basis fixture",
    sourceOwnedFields: ["metric_value", "topology_and_support_family"],
    sourceUrl: null,
  },
  {
    basis: "lab_iso_10140_717_2",
    fullAssemblyExactMatch: false,
    id: "gate_at_concrete_reference_floor_delta_lw_fixture",
    measuredDeltaLwDb: 27,
    referenceFloor: "solid_or_concrete_reference_floor",
    representedRowCount: 1,
    rightsPosture: "rights_safe_metadata_only",
    sourceKind: "product_catalog_delta_lw",
    sourceLabel: "Concrete reference floor DeltaLw fixture",
    sourceOwnedFields: ["metric_value", "load_basis"],
    sourceUrl: null,
  },
  {
    basis: "lab_iso_10140_717_2",
    fullAssemblyExactMatch: false,
    id: "gate_at_boundary_reference_only_fixture",
    measuredDeltaLwDb: null,
    referenceFloor: "boundary_reference_only",
    representedRowCount: 0,
    rightsPosture: "rights_safe_metadata_only",
    sourceKind: "product_catalog_delta_lw",
    sourceLabel: "Boundary reference fixture",
    sourceOwnedFields: [],
    sourceUrl: null,
  },
  {
    basis: "lab_iso_10140_717_2",
    fullAssemblyExactMatch: false,
    id: "gate_at_missing_owner_fields_fixture",
    measuredDeltaLwDb: 24,
    referenceFloor: "same_stack_steel",
    representedRowCount: 1,
    rightsPosture: "rights_safe_metadata_only",
    sourceKind: "source_owned_same_stack_lab_delta_lw",
    sourceLabel: "Missing source-owned physical fields fixture",
    sourceOwnedFields: ["metric_value", "topology_and_support_family"],
    sourceUrl: null,
  },
  {
    basis: "lab_iso_10140_717_2",
    fullAssemblyExactMatch: false,
    id: "gate_at_rights_blocked_same_stack_fixture",
    measuredDeltaLwDb: 23,
    referenceFloor: "same_stack_steel",
    representedRowCount: 1,
    rightsPosture: "rights_blocked_do_not_ingest",
    sourceKind: "source_owned_same_stack_lab_delta_lw",
    sourceLabel: "Rights-blocked same-stack packet fixture",
    sourceOwnedFields: STEEL_FLOOR_DELTA_LW_REQUIRED_SOURCE_OWNER_FIELDS,
    sourceUrl: null,
  },
] as const satisfies readonly GateATSteelFloorFormulaPacketCandidateInput[];

const residualPolicyForAcceptedFixture = (
  representedRowCount: number,
): SteelFloorFormulaResidualMetricPolicy =>
  evaluateSteelFloorFormulaResidualMetricPolicy({
    currentToleranceDb: STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB,
    fieldAndBuildingBasisOwnersPresent: false,
    maxAbsoluteResidualDb: 1.1,
    meanAbsoluteResidualDb: 0.8,
    metricId: "DeltaLw",
    openWebFormulaInputsSourceOwned: false,
    pairedNegativeBoundaryCount: 1,
    requiredHoldoutCount: GATE_AJ_REQUIRED_DELTA_LW_MEASURED_HOLDOUT_COUNT,
    requiredPairedNegativeBoundaryCount: GATE_AJ_REQUIRED_NEGATIVE_BOUNDARY_COUNT,
    residualCaseCount: representedRowCount,
    sourceOwnedCorrectionAvailable: false,
    sourceOwnedMetricHoldoutsPresent: true,
  });

const isProductOrInferred = (
  sourceKind: SteelFloorDeltaLwHoldoutSourceKind,
): boolean =>
  sourceKind === "product_catalog_delta_lw" ||
  sourceKind === "annex_c_or_companion_inferred_delta_lw";

export function classifyGateATSteelFloorFormulaSameStackIsoDeltaLwPacket(
  input: GateATSteelFloorFormulaPacketCandidateInput,
): GateATSteelFloorFormulaPacketClassification {
  const evaluated = evaluateSteelFloorDeltaLwHoldoutPacket({
    basis: input.basis,
    id: input.id,
    measuredDeltaLwDb: input.measuredDeltaLwDb,
    representedRowCount: input.representedRowCount,
    runtimeValueMovement: false,
    sourceKind: input.sourceKind,
    sourceOwnedFields: input.sourceOwnedFields,
  });
  const hasMeasuredDeltaLw = typeof input.measuredDeltaLwDb === "number";

  let bucket: GateATSteelFloorFormulaPacketTargetBucket;
  if (input.basis !== "lab_iso_10140_717_2") {
    bucket = "rejected_wrong_metric_basis";
  } else if (input.referenceFloor === "boundary_reference_only") {
    bucket = "rejected_boundary_reference_only";
  } else if (input.referenceFloor !== "same_stack_steel") {
    bucket = "rejected_reference_floor_not_same_stack_steel";
  } else if (isProductOrInferred(input.sourceKind)) {
    bucket = "rejected_product_or_inferred_delta_lw";
  } else if (input.rightsPosture === "rights_blocked_do_not_ingest") {
    bucket = "rejected_rights_blocked";
  } else if (!hasMeasuredDeltaLw || evaluated.missingSourceOwnedFields.length > 0) {
    bucket = "rejected_missing_source_owned_packet_fields";
  } else {
    bucket = "accepted_source_owned_same_stack_iso_delta_lw_packet_fixture";
  }

  const canBecomeCalibrationEvidence =
    bucket === "accepted_source_owned_same_stack_iso_delta_lw_packet_fixture";

  return {
    ...input,
    bucket,
    canBecomeCalibrationEvidence,
    canMoveRuntimeNow: false,
    canPromoteExactSourceNow: false,
    missingSourceOwnedFields: evaluated.missingSourceOwnedFields,
    residualPolicyIfAccepted: canBecomeCalibrationEvidence
      ? residualPolicyForAcceptedFixture(input.representedRowCount)
      : null,
    runtimeValueMovement: false,
    sourceRowsAreCalibrationEvidenceNotProduct: true,
  };
}

export function buildGateATSteelFloorFormulaSameStackIsoDeltaLwPacketTargetContract():
  GateATSteelFloorFormulaSameStackIsoDeltaLwPacketTargetContract {
  const gateAS = buildGateASSteelFloorFormulaOwnerEvidenceTargetingContract();
  const selected = gateAS.selectedOwnerTarget;
  const fixturePacketClassifications = fixturePacketInputs.map(
    classifyGateATSteelFloorFormulaSameStackIsoDeltaLwPacket,
  );
  const acceptedFixtureProbeIds = fixturePacketClassifications
    .filter((packet) => packet.canBecomeCalibrationEvidence)
    .map((packet) => packet.id);
  const rejectedFixtureProbeIds = fixturePacketClassifications
    .filter((packet) => !packet.canBecomeCalibrationEvidence)
    .map((packet) => packet.id);

  return {
    acceptedFixtureProbeIds,
    exactSourceOverridePolicy: {
      exactMeasuredRowsRemainPrecedence: true,
      fullAssemblyExactMatchRequired: true,
      targetPacketIsCalibrationEvidenceByDefault: true,
    },
    fieldAndBuildingBasisSeparation: {
      fieldOrAstmBasisCanTightenLabCorridor: false,
      labDeltaLwCanAliasFieldMetrics: false,
    },
    fixturePacketClassifications,
    landedGate:
      "gate_at_steel_floor_formula_same_stack_iso_delta_lw_packet_target_plan",
    packetAcceptanceSurface: {
      broadSourceLibraryCrawlAllowed: false,
      measuredMetricIds: selected.acquisitionPacketShape.measuredMetricIds,
      metricBasis: selected.acquisitionPacketShape.metricBasis,
      minimumAcceptedPacketCountBeforeRetune:
        selected.acquisitionPacketShape.minimumAcceptedPacketCountBeforeRetune,
      minimumPairedNegativeBoundaryCountBeforeRetune:
        selected.acquisitionPacketShape
          .minimumPairedNegativeBoundaryCountBeforeRetune,
      referenceFloor: selected.acquisitionPacketShape.referenceFloor,
      rejectionBoundaries: selected.target.rejectionBoundaries,
      requiredSourceOwnedFields:
        selected.acquisitionPacketShape.requiredSourceOwnedFields,
      selectedOwner: "accepted_source_owned_same_stack_iso_delta_lw_holdouts",
      selectedTermId: "source_owned_delta_lw_holdout_absence",
      usesGateASSelectedTargetOnly: true,
    },
    previousLandedGate:
      "gate_as_steel_floor_formula_owner_evidence_targeting_plan",
    rejectedFixtureProbeIds,
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
      GATE_AT_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_PACKET_TARGET_SELECTED_NEXT_ACTION,
    selectedNextFile:
      GATE_AT_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_PACKET_TARGET_SELECTED_NEXT_FILE,
    selectionStatus:
      "gate_at_same_stack_iso_delta_lw_packet_target_landed_no_runtime_selected_narrow_source_lead_gate_au",
  };
}
