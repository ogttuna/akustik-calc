import {
  GATE_AW_REQUIRED_PACKET_LOCATOR_METADATA_FIELDS,
  type GateAWSteelFloorFormulaPacketLocatorMetadataField,
} from "./steel-floor-formula-same-stack-iso-delta-lw-packet-acquisition-readiness";
import {
  GATE_BA_REQUIRED_DELTA_LW_RESIDUAL_HOLDOUT_COUNT,
  GATE_BA_REQUIRED_PAIRED_NEGATIVE_BOUNDARY_COUNT,
} from "./steel-floor-formula-same-stack-iso-delta-lw-residual-admission-boundary";
import {
  buildGateBCSteelFloorFormulaSameStackIsoDeltaLwResidualBlockerClosureContract,
  type GateBCSteelFloorFormulaResidualBlockerClosureLane,
  type GateBCSteelFloorFormulaResidualBlockerClosureLaneId,
} from "./steel-floor-formula-same-stack-iso-delta-lw-residual-blocker-closure";
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

export const GATE_BD_REQUIRED_ADDITIONAL_SAME_STACK_ISO_DELTA_LW_HOLDOUT_COUNT =
  2;

export const GATE_BD_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_HOLDOUT_CLOSURE_SELECTED_NEXT_FILE =
  "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-be-steel-floor-formula-same-stack-iso-delta-lw-paired-negative-closure-contract.test.ts";

export const GATE_BD_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_HOLDOUT_CLOSURE_SELECTED_NEXT_ACTION =
  "gate_be_steel_floor_formula_same_stack_iso_delta_lw_paired_negative_closure_plan";

export type GateBDSteelFloorFormulaHoldoutClosureDecision =
  | "accepted_residual_readiness_holdout_closure_evidence"
  | "blocked_gate_bc_lane_not_selected_holdout_count_closure"
  | "rejected_missing_rights_safe_locator_metadata"
  | "rejected_missing_source_owned_holdout_fields"
  | "rejected_product_or_inferred_delta_lw_holdout"
  | "rejected_rights_blocked_holdout_evidence"
  | "rejected_wrong_metric_basis_or_reference";

export type GateBDSteelFloorFormulaHoldoutClosureEvidencePacket = {
  readonly basis: SteelFloorDeltaLwHoldoutBasis;
  readonly locatorMetadataFields: readonly GateAWSteelFloorFormulaPacketLocatorMetadataField[];
  readonly measuredDeltaLwDb: number | null;
  readonly referenceFloor: GateATSteelFloorFormulaPacketReferenceFloor;
  readonly representedRowCount: number;
  readonly rightsPosture: GateATSteelFloorFormulaPacketRightsPosture;
  readonly sourceKind: SteelFloorDeltaLwHoldoutSourceKind;
  readonly sourceOwnedFields: readonly SteelFloorDeltaLwRequiredSourceOwnerField[];
};

export type GateBDSteelFloorFormulaHoldoutClosureInput = {
  readonly closureLane: GateBCSteelFloorFormulaResidualBlockerClosureLane;
  readonly id: string;
  readonly sourcePacket: GateBDSteelFloorFormulaHoldoutClosureEvidencePacket | null;
};

export type GateBDSteelFloorFormulaHoldoutClosureRow =
  GateBDSteelFloorFormulaHoldoutClosureInput & {
    readonly additionalHoldoutCountContribution: number;
    readonly canMoveRuntimeNow: false;
    readonly canPromoteExactSourceNow: false;
    readonly canRetuneRuntimeNow: false;
    readonly closureDecision: GateBDSteelFloorFormulaHoldoutClosureDecision;
    readonly closureEvidenceAccepted: boolean;
    readonly closureEvidenceUse:
      | "blocked_holdout_closure_evidence"
      | "residual_readiness_evidence_only";
    readonly countsTowardAdditionalHoldoutShortfallClosure: boolean;
    readonly exactSourceOverrideAllowedNow: false;
    readonly fieldBuildingAliasAllowedNow: false;
    readonly measuredMetricValueIngestedForRuntime: false;
    readonly missingLocatorMetadataFields: readonly GateAWSteelFloorFormulaPacketLocatorMetadataField[];
    readonly missingSourceOwnedFields: readonly SteelFloorDeltaLwRequiredSourceOwnerField[];
    readonly residualRetuneAllowedNow: false;
    readonly runtimeValueMovement: false;
    readonly sourceDocumentCopied: false;
    readonly sourceRowsAreResidualReadinessEvidenceNotProduct: true;
    readonly sourceTextIngested: false;
    readonly toleranceChangeAllowedNow: false;
  };

export type GateBDSteelFloorFormulaSameStackIsoDeltaLwHoldoutClosureContract = {
  readonly acceptedHoldoutClosureProbeIds: readonly string[];
  readonly blockedFollowupClosureLaneIds: readonly GateBCSteelFloorFormulaResidualBlockerClosureLaneId[];
  readonly exactSourceOverridePolicy: {
    readonly exactMeasuredRowsRemainPrecedence: true;
    readonly fullAssemblyExactMatchRequired: true;
    readonly holdoutClosureRowsAreNotExactRows: true;
  };
  readonly fieldAndBuildingBasisSeparation: {
    readonly fieldOrAstmBasisCanCloseLabHoldoutShortfall: false;
    readonly labDeltaLwCanAliasFieldMetrics: false;
  };
  readonly futureHoldoutClosureReadiness: {
    readonly acceptedAdditionalHoldoutCount: number;
    readonly closesGateBCHoldoutCountShortfall: boolean;
    readonly remainingHoldoutShortfall: number;
    readonly selectedNextClosureLaneId: "paired_negative_boundary_closure";
  };
  readonly holdoutClosurePolicy: {
    readonly acceptedClosureEvidenceCanMoveRuntimeNow: false;
    readonly acceptedClosureEvidenceCanMoveToleranceNow: false;
    readonly acceptedClosureEvidenceUse: "residual_readiness_evidence_only";
    readonly allGateATAKOwnerFieldsRequired: true;
    readonly broadSourceCrawlAllowed: false;
    readonly exactOverrideAllowedNow: false;
    readonly gateBCSelectedHoldoutCountLaneOnly: true;
    readonly labIso101407172BasisRequired: true;
    readonly pairedNegativeBoundaryOwnershipRequired: true;
    readonly rejectedOrFollowupClosureLanesRemainBlocked: true;
    readonly rightsSafeLocatorMetadataRequired: true;
    readonly runtimeRetuneAllowedNow: false;
    readonly sameStackSteelReferenceRequired: true;
    readonly sourceDocumentCopyAllowed: false;
    readonly sourceOwnedMeasuredDeltaLwRequired: true;
    readonly sourceTextIngestionAllowed: false;
  };
  readonly holdoutClosureProbeRows: readonly GateBDSteelFloorFormulaHoldoutClosureRow[];
  readonly holdoutClosureSurface: {
    readonly currentAdmittedDeltaLwHoldoutCount: number;
    readonly currentPairedNegativeBoundaryCount: number;
    readonly measuredMetricIds: readonly ["DeltaLw"];
    readonly metricBasis: "lab_iso_10140_717_2";
    readonly referenceFloor: "same_stack_steel";
    readonly requiredAdditionalDeltaLwHoldoutCount: typeof GATE_BD_REQUIRED_ADDITIONAL_SAME_STACK_ISO_DELTA_LW_HOLDOUT_COUNT;
    readonly requiredCitationLocatorMetadataFields: readonly GateAWSteelFloorFormulaPacketLocatorMetadataField[];
    readonly requiredPacketOwnerFields: readonly SteelFloorDeltaLwRequiredSourceOwnerField[];
    readonly requiredPairedNegativeBoundaryCount: typeof GATE_BA_REQUIRED_PAIRED_NEGATIVE_BOUNDARY_COUNT;
    readonly requiredTotalDeltaLwHoldoutCount: typeof GATE_BA_REQUIRED_DELTA_LW_RESIDUAL_HOLDOUT_COUNT;
    readonly selectedGateBCBlocker: "holdout_count_below_policy_threshold";
    readonly selectedGateBCLaneId: "same_stack_iso_delta_lw_holdout_count_closure";
    readonly selectedOwner: "accepted_source_owned_same_stack_iso_delta_lw_holdouts";
    readonly selectedTermId: "source_owned_delta_lw_holdout_absence";
  };
  readonly landedGate: "gate_bd_steel_floor_formula_same_stack_iso_delta_lw_holdout_closure_plan";
  readonly previousLandedGate: "gate_bc_steel_floor_formula_same_stack_iso_delta_lw_residual_blocker_closure_plan";
  readonly rejectedHoldoutClosureProbeIds: readonly string[];
  readonly runtimePins: {
    readonly deltaLwToleranceDb: typeof STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB;
    readonly estimateDeltaLw: 22.4;
    readonly estimateLnW: 55.6;
    readonly lnWToleranceDb: typeof STEEL_FLOOR_FORMULA_LN_W_TOLERANCE_DB;
    readonly runtimeRetuneAllowedNow: false;
    readonly runtimeValueMovement: false;
  };
  readonly selectedClosureLaneInput: GateBCSteelFloorFormulaResidualBlockerClosureLane;
  readonly selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1";
  readonly selectedNextAction: typeof GATE_BD_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_HOLDOUT_CLOSURE_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof GATE_BD_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_HOLDOUT_CLOSURE_SELECTED_NEXT_FILE;
  readonly selectionStatus: "gate_bd_same_stack_iso_delta_lw_holdout_closure_landed_no_runtime_selected_paired_negative_closure_gate_be";
};

const gateBCResidualBlockerClosureContract =
  buildGateBCSteelFloorFormulaSameStackIsoDeltaLwResidualBlockerClosureContract();

const missingLocatorMetadataFields = (
  fields: readonly GateAWSteelFloorFormulaPacketLocatorMetadataField[],
): readonly GateAWSteelFloorFormulaPacketLocatorMetadataField[] => {
  const present = new Set(fields);
  return GATE_AW_REQUIRED_PACKET_LOCATOR_METADATA_FIELDS.filter(
    (field) => !present.has(field),
  );
};

const missingSourceOwnedFieldsForPacket = (
  sourcePacket: GateBDSteelFloorFormulaHoldoutClosureEvidencePacket | null,
): readonly SteelFloorDeltaLwRequiredSourceOwnerField[] => {
  if (sourcePacket === null) {
    return STEEL_FLOOR_DELTA_LW_REQUIRED_SOURCE_OWNER_FIELDS;
  }

  const evaluated = evaluateSteelFloorDeltaLwHoldoutPacket({
    basis: sourcePacket.basis,
    id: "gate_bd_source_owned_field_check",
    measuredDeltaLwDb: sourcePacket.measuredDeltaLwDb,
    representedRowCount: sourcePacket.representedRowCount,
    runtimeValueMovement: false,
    sourceKind: sourcePacket.sourceKind,
    sourceOwnedFields: sourcePacket.sourceOwnedFields,
  });
  const missing = new Set(evaluated.missingSourceOwnedFields);
  const hasMeasuredDeltaLw =
    typeof sourcePacket.measuredDeltaLwDb === "number" &&
    Number.isFinite(sourcePacket.measuredDeltaLwDb);

  if (!hasMeasuredDeltaLw) {
    missing.add("metric_value");
  }

  return STEEL_FLOOR_DELTA_LW_REQUIRED_SOURCE_OWNER_FIELDS.filter((field) =>
    missing.has(field),
  );
};

const isSelectedGateBCHoldoutCountLane = (
  closureLane: GateBCSteelFloorFormulaResidualBlockerClosureLane,
): boolean =>
  closureLane.laneId === "same_stack_iso_delta_lw_holdout_count_closure" &&
  closureLane.selectedForNextGate &&
  closureLane.closureDecision === "selected_next_narrow_closure_lane";

const isProductOrInferredSourceKind = (
  sourceKind: SteelFloorDeltaLwHoldoutSourceKind,
): boolean =>
  sourceKind === "product_catalog_delta_lw" ||
  sourceKind === "annex_c_or_companion_inferred_delta_lw";

export function classifyGateBDSteelFloorFormulaSameStackIsoDeltaLwHoldoutClosure(
  input: GateBDSteelFloorFormulaHoldoutClosureInput,
): GateBDSteelFloorFormulaHoldoutClosureRow {
  const sourcePacket = input.sourcePacket;
  const missingLocatorFields =
    sourcePacket === null
      ? GATE_AW_REQUIRED_PACKET_LOCATOR_METADATA_FIELDS
      : missingLocatorMetadataFields(sourcePacket.locatorMetadataFields);
  const missingSourceOwnedFields =
    missingSourceOwnedFieldsForPacket(sourcePacket);

  let closureDecision: GateBDSteelFloorFormulaHoldoutClosureDecision;
  if (!isSelectedGateBCHoldoutCountLane(input.closureLane)) {
    closureDecision = "blocked_gate_bc_lane_not_selected_holdout_count_closure";
  } else if (sourcePacket === null || missingSourceOwnedFields.length > 0) {
    closureDecision = "rejected_missing_source_owned_holdout_fields";
  } else if (sourcePacket.rightsPosture === "rights_blocked_do_not_ingest") {
    closureDecision = "rejected_rights_blocked_holdout_evidence";
  } else if (missingLocatorFields.length > 0) {
    closureDecision = "rejected_missing_rights_safe_locator_metadata";
  } else if (
    sourcePacket.basis !== "lab_iso_10140_717_2" ||
    sourcePacket.referenceFloor !== "same_stack_steel"
  ) {
    closureDecision = "rejected_wrong_metric_basis_or_reference";
  } else if (isProductOrInferredSourceKind(sourcePacket.sourceKind)) {
    closureDecision = "rejected_product_or_inferred_delta_lw_holdout";
  } else {
    closureDecision = "accepted_residual_readiness_holdout_closure_evidence";
  }

  const closureEvidenceAccepted =
    closureDecision ===
    "accepted_residual_readiness_holdout_closure_evidence";

  return {
    ...input,
    additionalHoldoutCountContribution: closureEvidenceAccepted
      ? Math.max(0, sourcePacket?.representedRowCount ?? 0)
      : 0,
    canMoveRuntimeNow: false,
    canPromoteExactSourceNow: false,
    canRetuneRuntimeNow: false,
    closureDecision,
    closureEvidenceAccepted,
    closureEvidenceUse: closureEvidenceAccepted
      ? "residual_readiness_evidence_only"
      : "blocked_holdout_closure_evidence",
    countsTowardAdditionalHoldoutShortfallClosure: closureEvidenceAccepted,
    exactSourceOverrideAllowedNow: false,
    fieldBuildingAliasAllowedNow: false,
    measuredMetricValueIngestedForRuntime: false,
    missingLocatorMetadataFields: missingLocatorFields,
    missingSourceOwnedFields,
    residualRetuneAllowedNow: false,
    runtimeValueMovement: false,
    sourceDocumentCopied: false,
    sourceRowsAreResidualReadinessEvidenceNotProduct: true,
    sourceTextIngested: false,
    toleranceChangeAllowedNow: false,
  };
}

const completeHoldoutClosurePacket =
  {
    basis: "lab_iso_10140_717_2",
    locatorMetadataFields: GATE_AW_REQUIRED_PACKET_LOCATOR_METADATA_FIELDS,
    measuredDeltaLwDb: 23,
    referenceFloor: "same_stack_steel",
    representedRowCount: 1,
    rightsPosture: "rights_safe_metadata_only",
    sourceKind: "source_owned_same_stack_lab_delta_lw",
    sourceOwnedFields: STEEL_FLOOR_DELTA_LW_REQUIRED_SOURCE_OWNER_FIELDS,
  } satisfies GateBDSteelFloorFormulaHoldoutClosureEvidencePacket;

const ownerFieldsWithout = (
  excludedField: SteelFloorDeltaLwRequiredSourceOwnerField,
): readonly SteelFloorDeltaLwRequiredSourceOwnerField[] =>
  STEEL_FLOOR_DELTA_LW_REQUIRED_SOURCE_OWNER_FIELDS.filter(
    (field) => field !== excludedField,
  );

const selectedClosureLane =
  gateBCResidualBlockerClosureContract.selectedClosureLane;

const holdoutClosureProbeInputs = [
  {
    closureLane: selectedClosureLane,
    id: "gate_bd_future_source_owned_same_stack_iso_delta_lw_holdout_one",
    sourcePacket: completeHoldoutClosurePacket,
  },
  {
    closureLane: selectedClosureLane,
    id: "gate_bd_future_source_owned_same_stack_iso_delta_lw_holdout_two",
    sourcePacket: {
      ...completeHoldoutClosurePacket,
      measuredDeltaLwDb: 21.9,
    },
  },
  {
    closureLane: selectedClosureLane,
    id: "gate_bd_missing_measured_delta_lw_holdout",
    sourcePacket: {
      ...completeHoldoutClosurePacket,
      measuredDeltaLwDb: null,
      sourceOwnedFields: ownerFieldsWithout("metric_value"),
    },
  },
  {
    closureLane: selectedClosureLane,
    id: "gate_bd_missing_paired_negative_boundary_owner_holdout",
    sourcePacket: {
      ...completeHoldoutClosurePacket,
      sourceOwnedFields: ownerFieldsWithout("paired_negative_boundary_owner"),
    },
  },
  {
    closureLane: selectedClosureLane,
    id: "gate_bd_missing_locator_metadata_holdout",
    sourcePacket: {
      ...completeHoldoutClosurePacket,
      locatorMetadataFields:
        GATE_AW_REQUIRED_PACKET_LOCATOR_METADATA_FIELDS.filter(
          (field) => field !== "source_locator",
        ),
    },
  },
  {
    closureLane: selectedClosureLane,
    id: "gate_bd_wrong_metric_basis_holdout",
    sourcePacket: {
      ...completeHoldoutClosurePacket,
      basis: "field_or_astm_basis",
    },
  },
  {
    closureLane: selectedClosureLane,
    id: "gate_bd_concrete_reference_floor_holdout",
    sourcePacket: {
      ...completeHoldoutClosurePacket,
      referenceFloor: "solid_or_concrete_reference_floor",
    },
  },
  {
    closureLane: selectedClosureLane,
    id: "gate_bd_product_delta_lw_holdout",
    sourcePacket: {
      ...completeHoldoutClosurePacket,
      sourceKind: "product_catalog_delta_lw",
    },
  },
  {
    closureLane: selectedClosureLane,
    id: "gate_bd_rights_blocked_holdout",
    sourcePacket: {
      ...completeHoldoutClosurePacket,
      rightsPosture: "rights_blocked_do_not_ingest",
    },
  },
] satisfies readonly GateBDSteelFloorFormulaHoldoutClosureInput[];

export function buildGateBDSteelFloorFormulaSameStackIsoDeltaLwHoldoutClosureContract():
  GateBDSteelFloorFormulaSameStackIsoDeltaLwHoldoutClosureContract {
  const holdoutClosureProbeRows = holdoutClosureProbeInputs.map(
    classifyGateBDSteelFloorFormulaSameStackIsoDeltaLwHoldoutClosure,
  );
  const acceptedHoldoutClosureProbeIds = holdoutClosureProbeRows
    .filter((row) => row.closureEvidenceAccepted)
    .map((row) => row.id);
  const rejectedHoldoutClosureProbeIds = holdoutClosureProbeRows
    .filter((row) => !row.closureEvidenceAccepted)
    .map((row) => row.id);
  const acceptedAdditionalHoldoutCount = holdoutClosureProbeRows.reduce(
    (sum, row) => sum + row.additionalHoldoutCountContribution,
    0,
  );
  const remainingHoldoutShortfall = Math.max(
    0,
    GATE_BD_REQUIRED_ADDITIONAL_SAME_STACK_ISO_DELTA_LW_HOLDOUT_COUNT -
      acceptedAdditionalHoldoutCount,
  );

  return {
    acceptedHoldoutClosureProbeIds,
    blockedFollowupClosureLaneIds:
      gateBCResidualBlockerClosureContract.closureLaneRanking
        .filter((lane) => !lane.selectedForNextGate)
        .map((lane) => lane.laneId),
    exactSourceOverridePolicy: {
      exactMeasuredRowsRemainPrecedence: true,
      fullAssemblyExactMatchRequired: true,
      holdoutClosureRowsAreNotExactRows: true,
    },
    fieldAndBuildingBasisSeparation: {
      fieldOrAstmBasisCanCloseLabHoldoutShortfall: false,
      labDeltaLwCanAliasFieldMetrics: false,
    },
    futureHoldoutClosureReadiness: {
      acceptedAdditionalHoldoutCount,
      closesGateBCHoldoutCountShortfall: remainingHoldoutShortfall === 0,
      remainingHoldoutShortfall,
      selectedNextClosureLaneId: "paired_negative_boundary_closure",
    },
    holdoutClosurePolicy: {
      acceptedClosureEvidenceCanMoveRuntimeNow: false,
      acceptedClosureEvidenceCanMoveToleranceNow: false,
      acceptedClosureEvidenceUse: "residual_readiness_evidence_only",
      allGateATAKOwnerFieldsRequired: true,
      broadSourceCrawlAllowed: false,
      exactOverrideAllowedNow: false,
      gateBCSelectedHoldoutCountLaneOnly: true,
      labIso101407172BasisRequired: true,
      pairedNegativeBoundaryOwnershipRequired: true,
      rejectedOrFollowupClosureLanesRemainBlocked: true,
      rightsSafeLocatorMetadataRequired: true,
      runtimeRetuneAllowedNow: false,
      sameStackSteelReferenceRequired: true,
      sourceDocumentCopyAllowed: false,
      sourceOwnedMeasuredDeltaLwRequired: true,
      sourceTextIngestionAllowed: false,
    },
    holdoutClosureProbeRows,
    holdoutClosureSurface: {
      currentAdmittedDeltaLwHoldoutCount:
        selectedClosureLane.policyDecisionRow.residualAdmissionRow
          .residualCaseCount,
      currentPairedNegativeBoundaryCount:
        selectedClosureLane.policyDecisionRow.residualAdmissionRow
          .pairedNegativeBoundaryCount,
      measuredMetricIds: ["DeltaLw"],
      metricBasis: "lab_iso_10140_717_2",
      referenceFloor: "same_stack_steel",
      requiredAdditionalDeltaLwHoldoutCount:
        GATE_BD_REQUIRED_ADDITIONAL_SAME_STACK_ISO_DELTA_LW_HOLDOUT_COUNT,
      requiredCitationLocatorMetadataFields:
        GATE_AW_REQUIRED_PACKET_LOCATOR_METADATA_FIELDS,
      requiredPacketOwnerFields:
        STEEL_FLOOR_DELTA_LW_REQUIRED_SOURCE_OWNER_FIELDS,
      requiredPairedNegativeBoundaryCount:
        GATE_BA_REQUIRED_PAIRED_NEGATIVE_BOUNDARY_COUNT,
      requiredTotalDeltaLwHoldoutCount:
        GATE_BA_REQUIRED_DELTA_LW_RESIDUAL_HOLDOUT_COUNT,
      selectedGateBCBlocker: "holdout_count_below_policy_threshold",
      selectedGateBCLaneId: "same_stack_iso_delta_lw_holdout_count_closure",
      selectedOwner: "accepted_source_owned_same_stack_iso_delta_lw_holdouts",
      selectedTermId: "source_owned_delta_lw_holdout_absence",
    },
    landedGate:
      "gate_bd_steel_floor_formula_same_stack_iso_delta_lw_holdout_closure_plan",
    previousLandedGate:
      "gate_bc_steel_floor_formula_same_stack_iso_delta_lw_residual_blocker_closure_plan",
    rejectedHoldoutClosureProbeIds,
    runtimePins: {
      deltaLwToleranceDb: STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB,
      estimateDeltaLw: 22.4,
      estimateLnW: 55.6,
      lnWToleranceDb: STEEL_FLOOR_FORMULA_LN_W_TOLERANCE_DB,
      runtimeRetuneAllowedNow: false,
      runtimeValueMovement: false,
    },
    selectedClosureLaneInput: selectedClosureLane,
    selectedImplementationSlice:
      "calculator_model_first_physics_prediction_pivot_v1",
    selectedNextAction:
      GATE_BD_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_HOLDOUT_CLOSURE_SELECTED_NEXT_ACTION,
    selectedNextFile:
      GATE_BD_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_HOLDOUT_CLOSURE_SELECTED_NEXT_FILE,
    selectionStatus:
      "gate_bd_same_stack_iso_delta_lw_holdout_closure_landed_no_runtime_selected_paired_negative_closure_gate_be",
  };
}
