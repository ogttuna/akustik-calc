import {
  GATE_AW_REQUIRED_PACKET_LOCATOR_METADATA_FIELDS,
  type GateAWSteelFloorFormulaPacketLocatorMetadataField,
} from "./steel-floor-formula-same-stack-iso-delta-lw-packet-acquisition-readiness";
import {
  type GateATSteelFloorFormulaPacketReferenceFloor,
  type GateATSteelFloorFormulaPacketRightsPosture,
} from "./steel-floor-formula-same-stack-iso-delta-lw-packet-target";
import {
  buildGateBDSteelFloorFormulaSameStackIsoDeltaLwHoldoutClosureContract,
  type GateBDSteelFloorFormulaSameStackIsoDeltaLwHoldoutClosureContract,
} from "./steel-floor-formula-same-stack-iso-delta-lw-holdout-closure";
import {
  GATE_BA_REQUIRED_PAIRED_NEGATIVE_BOUNDARY_COUNT,
} from "./steel-floor-formula-same-stack-iso-delta-lw-residual-admission-boundary";
import {
  type GateBCSteelFloorFormulaResidualBlockerClosureLaneId,
} from "./steel-floor-formula-same-stack-iso-delta-lw-residual-blocker-closure";
import {
  type SteelFloorDeltaLwHoldoutBasis,
  type SteelFloorDeltaLwHoldoutSourceKind,
} from "./steel-floor-formula-source-owned-delta-lw-holdout";
import {
  STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB,
  STEEL_FLOOR_FORMULA_LN_W_TOLERANCE_DB,
} from "./steel-floor-impact-formula-corridor";

export const GATE_BE_REQUIRED_ADDITIONAL_PAIRED_NEGATIVE_BOUNDARY_COUNT = 3;

export const GATE_BE_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_PAIRED_NEGATIVE_CLOSURE_SELECTED_NEXT_FILE =
  "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-bf-steel-floor-formula-same-stack-iso-delta-lw-open-web-input-ownership-closure-contract.test.ts";

export const GATE_BE_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_PAIRED_NEGATIVE_CLOSURE_SELECTED_NEXT_ACTION =
  "gate_bf_steel_floor_formula_same_stack_iso_delta_lw_open_web_input_ownership_closure_plan";

export const GATE_BE_REQUIRED_PAIRED_NEGATIVE_BOUNDARY_OWNER_FIELDS = [
  "target_metric_family",
  "iso_lab_basis_owner",
  "explicit_negative_boundary_kind",
  "boundary_support_or_reference_identity",
  "same_stack_steel_exclusion_reason",
  "boundary_scope_not_holdout",
] as const;

export type GateBESteelFloorFormulaPairedNegativeBoundaryOwnerField =
  (typeof GATE_BE_REQUIRED_PAIRED_NEGATIVE_BOUNDARY_OWNER_FIELDS)[number];

export type GateBESteelFloorFormulaPairedNegativeMetricFamily =
  | "airborne_or_field_metric_family"
  | "floor_impact_delta_lw";

export type GateBESteelFloorFormulaPairedNegativeBoundaryKind =
  | "not_explicit_negative_boundary"
  | "wrong_reference_floor"
  | "wrong_support_family";

export type GateBESteelFloorFormulaPairedNegativeSupportFamily =
  | "non_steel_heavy_or_concrete_floor"
  | "same_stack_lightweight_steel"
  | "timber_or_mass_timber_floor";

export type GateBESteelFloorFormulaPairedNegativeClosureDecision =
  | "accepted_residual_readiness_paired_negative_boundary"
  | "blocked_gate_bd_next_lane_not_paired_negative_boundary"
  | "rejected_missing_rights_safe_locator_metadata"
  | "rejected_missing_source_owned_boundary_fields"
  | "rejected_not_explicit_negative_boundary"
  | "rejected_product_or_inferred_boundary"
  | "rejected_rights_blocked_boundary"
  | "rejected_same_stack_steel_holdout_not_negative_boundary"
  | "rejected_wrong_metric_basis"
  | "rejected_wrong_metric_family";

export type GateBESteelFloorFormulaPairedNegativeBoundaryPacket = {
  readonly basis: SteelFloorDeltaLwHoldoutBasis;
  readonly boundaryKind: GateBESteelFloorFormulaPairedNegativeBoundaryKind;
  readonly locatorMetadataFields: readonly GateAWSteelFloorFormulaPacketLocatorMetadataField[];
  readonly metricFamily: GateBESteelFloorFormulaPairedNegativeMetricFamily;
  readonly referenceFloor: GateATSteelFloorFormulaPacketReferenceFloor;
  readonly rightsPosture: GateATSteelFloorFormulaPacketRightsPosture;
  readonly sourceKind: SteelFloorDeltaLwHoldoutSourceKind;
  readonly sourceOwnedFields: readonly GateBESteelFloorFormulaPairedNegativeBoundaryOwnerField[];
  readonly supportFamily: GateBESteelFloorFormulaPairedNegativeSupportFamily;
};

export type GateBESteelFloorFormulaPairedNegativeClosureInput = {
  readonly holdoutClosureContract: GateBDSteelFloorFormulaSameStackIsoDeltaLwHoldoutClosureContract;
  readonly id: string;
  readonly sourceBoundary: GateBESteelFloorFormulaPairedNegativeBoundaryPacket | null;
};

export type GateBESteelFloorFormulaPairedNegativeClosureRow =
  GateBESteelFloorFormulaPairedNegativeClosureInput & {
    readonly additionalPairedNegativeBoundaryContribution: number;
    readonly canMoveRuntimeNow: false;
    readonly canPromoteExactSourceNow: false;
    readonly canRetuneRuntimeNow: false;
    readonly closureDecision: GateBESteelFloorFormulaPairedNegativeClosureDecision;
    readonly closureEvidenceAccepted: boolean;
    readonly closureEvidenceUse:
      | "blocked_paired_negative_boundary_evidence"
      | "residual_policy_readiness_evidence_only";
    readonly countsTowardPairedNegativeBoundaryShortfallClosure: boolean;
    readonly exactSourceOverrideAllowedNow: false;
    readonly fieldBuildingAliasAllowedNow: false;
    readonly measuredMetricValueIngestedForRuntime: false;
    readonly missingLocatorMetadataFields: readonly GateAWSteelFloorFormulaPacketLocatorMetadataField[];
    readonly missingSourceOwnedBoundaryFields: readonly GateBESteelFloorFormulaPairedNegativeBoundaryOwnerField[];
    readonly residualRetuneAllowedNow: false;
    readonly runtimeValueMovement: false;
    readonly sourceDocumentCopied: false;
    readonly sourceRowsAreResidualReadinessEvidenceNotProduct: true;
    readonly sourceTextIngested: false;
    readonly toleranceChangeAllowedNow: false;
  };

export type GateBESteelFloorFormulaSameStackIsoDeltaLwPairedNegativeClosureContract = {
  readonly acceptedPairedNegativeClosureProbeIds: readonly string[];
  readonly exactSourceOverridePolicy: {
    readonly exactMeasuredRowsRemainPrecedence: true;
    readonly fullAssemblyExactMatchRequired: true;
    readonly pairedNegativeClosureRowsAreNotExactRows: true;
  };
  readonly fieldAndBuildingBasisSeparation: {
    readonly fieldOrAstmBasisCanCloseLabPairedNegativeShortfall: false;
    readonly labDeltaLwCanAliasFieldMetrics: false;
  };
  readonly landedGate: "gate_be_steel_floor_formula_same_stack_iso_delta_lw_paired_negative_closure_plan";
  readonly pairedNegativeClosurePolicy: {
    readonly acceptedClosureEvidenceCanMoveRuntimeNow: false;
    readonly acceptedClosureEvidenceCanMoveToleranceNow: false;
    readonly acceptedClosureEvidenceUse: "residual_policy_readiness_evidence_only";
    readonly broadSourceCrawlAllowed: false;
    readonly exactOverrideAllowedNow: false;
    readonly explicitWrongSupportOrReferenceBoundaryRequired: true;
    readonly gateBDSelectedPairedNegativeLaneOnly: true;
    readonly isoLabBasisOwnerRequired: true;
    readonly rejectedOrRemainingFollowupLanesRemainBlocked: true;
    readonly rightsSafeLocatorMetadataRequired: true;
    readonly runtimeRetuneAllowedNow: false;
    readonly sameTargetMetricFamilyRequired: true;
    readonly sourceDocumentCopyAllowed: false;
    readonly sourceOwnedBoundaryProofRequired: true;
    readonly sourceTextIngestionAllowed: false;
  };
  readonly pairedNegativeClosureProbeRows: readonly GateBESteelFloorFormulaPairedNegativeClosureRow[];
  readonly pairedNegativeClosureSurface: {
    readonly currentAdmittedDeltaLwHoldoutCount: number;
    readonly currentPairedNegativeBoundaryCount: number;
    readonly measuredMetricIds: readonly ["DeltaLw"];
    readonly metricBasis: "lab_iso_10140_717_2";
    readonly requiredAdditionalPairedNegativeBoundaryCount: typeof GATE_BE_REQUIRED_ADDITIONAL_PAIRED_NEGATIVE_BOUNDARY_COUNT;
    readonly requiredBoundaryOwnerFields: readonly GateBESteelFloorFormulaPairedNegativeBoundaryOwnerField[];
    readonly requiredCitationLocatorMetadataFields: readonly GateAWSteelFloorFormulaPacketLocatorMetadataField[];
    readonly requiredTotalPairedNegativeBoundaryCount: typeof GATE_BA_REQUIRED_PAIRED_NEGATIVE_BOUNDARY_COUNT;
    readonly selectedGateBDNextLaneId: "paired_negative_boundary_closure";
    readonly selectedOwner: "same_stack_iso_delta_lw_paired_negative_boundaries";
    readonly selectedTermId: "paired_negative_boundaries_missing";
  };
  readonly pairedNegativeReadiness: {
    readonly acceptedAdditionalPairedNegativeBoundaryCount: number;
    readonly closesGateBEPairedNegativeShortfall: boolean;
    readonly remainingPairedNegativeBoundaryShortfall: number;
    readonly selectedNextClosureLaneId: "open_web_formula_input_ownership_closure";
  };
  readonly previousLandedGate: "gate_bd_steel_floor_formula_same_stack_iso_delta_lw_holdout_closure_plan";
  readonly rejectedPairedNegativeClosureProbeIds: readonly string[];
  readonly remainingFollowupClosureLaneIds: readonly GateBCSteelFloorFormulaResidualBlockerClosureLaneId[];
  readonly runtimePins: {
    readonly deltaLwToleranceDb: typeof STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB;
    readonly estimateDeltaLw: 22.4;
    readonly estimateLnW: 55.6;
    readonly lnWToleranceDb: typeof STEEL_FLOOR_FORMULA_LN_W_TOLERANCE_DB;
    readonly runtimeRetuneAllowedNow: false;
    readonly runtimeValueMovement: false;
  };
  readonly selectedHoldoutClosureInput: GateBDSteelFloorFormulaSameStackIsoDeltaLwHoldoutClosureContract;
  readonly selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1";
  readonly selectedNextAction: typeof GATE_BE_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_PAIRED_NEGATIVE_CLOSURE_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof GATE_BE_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_PAIRED_NEGATIVE_CLOSURE_SELECTED_NEXT_FILE;
  readonly selectionStatus: "gate_be_same_stack_iso_delta_lw_paired_negative_closure_landed_no_runtime_selected_open_web_input_ownership_gate_bf";
};

const gateBDHoldoutClosureContract =
  buildGateBDSteelFloorFormulaSameStackIsoDeltaLwHoldoutClosureContract();

const missingLocatorMetadataFields = (
  fields: readonly GateAWSteelFloorFormulaPacketLocatorMetadataField[],
): readonly GateAWSteelFloorFormulaPacketLocatorMetadataField[] => {
  const present = new Set(fields);
  return GATE_AW_REQUIRED_PACKET_LOCATOR_METADATA_FIELDS.filter(
    (field) => !present.has(field),
  );
};

const missingBoundaryOwnerFields = (
  fields: readonly GateBESteelFloorFormulaPairedNegativeBoundaryOwnerField[],
): readonly GateBESteelFloorFormulaPairedNegativeBoundaryOwnerField[] => {
  const present = new Set(fields);
  return GATE_BE_REQUIRED_PAIRED_NEGATIVE_BOUNDARY_OWNER_FIELDS.filter(
    (field) => !present.has(field),
  );
};

const selectedGateBDLaneIsPairedNegative = (
  contract: GateBDSteelFloorFormulaSameStackIsoDeltaLwHoldoutClosureContract,
): boolean =>
  contract.futureHoldoutClosureReadiness.selectedNextClosureLaneId ===
  "paired_negative_boundary_closure";

const isExplicitNegativeBoundary = (
  sourceBoundary: GateBESteelFloorFormulaPairedNegativeBoundaryPacket,
): boolean =>
  sourceBoundary.boundaryKind === "wrong_support_family" ||
  sourceBoundary.boundaryKind === "wrong_reference_floor";

const provesNotSameStackSteelHoldout = (
  sourceBoundary: GateBESteelFloorFormulaPairedNegativeBoundaryPacket,
): boolean =>
  (sourceBoundary.boundaryKind === "wrong_support_family" &&
    sourceBoundary.supportFamily !== "same_stack_lightweight_steel") ||
  (sourceBoundary.boundaryKind === "wrong_reference_floor" &&
    sourceBoundary.referenceFloor !== "same_stack_steel");

const isProductOrInferredSourceKind = (
  sourceKind: SteelFloorDeltaLwHoldoutSourceKind,
): boolean =>
  sourceKind === "product_catalog_delta_lw" ||
  sourceKind === "annex_c_or_companion_inferred_delta_lw";

export function classifyGateBESteelFloorFormulaSameStackIsoDeltaLwPairedNegativeClosure(
  input: GateBESteelFloorFormulaPairedNegativeClosureInput,
): GateBESteelFloorFormulaPairedNegativeClosureRow {
  const sourceBoundary = input.sourceBoundary;
  const missingLocatorFields =
    sourceBoundary === null
      ? GATE_AW_REQUIRED_PACKET_LOCATOR_METADATA_FIELDS
      : missingLocatorMetadataFields(sourceBoundary.locatorMetadataFields);
  const missingOwnerFields =
    sourceBoundary === null
      ? GATE_BE_REQUIRED_PAIRED_NEGATIVE_BOUNDARY_OWNER_FIELDS
      : missingBoundaryOwnerFields(sourceBoundary.sourceOwnedFields);

  let closureDecision: GateBESteelFloorFormulaPairedNegativeClosureDecision;
  if (!selectedGateBDLaneIsPairedNegative(input.holdoutClosureContract)) {
    closureDecision =
      "blocked_gate_bd_next_lane_not_paired_negative_boundary";
  } else if (sourceBoundary === null || missingOwnerFields.length > 0) {
    closureDecision = "rejected_missing_source_owned_boundary_fields";
  } else if (sourceBoundary.rightsPosture === "rights_blocked_do_not_ingest") {
    closureDecision = "rejected_rights_blocked_boundary";
  } else if (missingLocatorFields.length > 0) {
    closureDecision = "rejected_missing_rights_safe_locator_metadata";
  } else if (sourceBoundary.basis !== "lab_iso_10140_717_2") {
    closureDecision = "rejected_wrong_metric_basis";
  } else if (sourceBoundary.metricFamily !== "floor_impact_delta_lw") {
    closureDecision = "rejected_wrong_metric_family";
  } else if (isProductOrInferredSourceKind(sourceBoundary.sourceKind)) {
    closureDecision = "rejected_product_or_inferred_boundary";
  } else if (!isExplicitNegativeBoundary(sourceBoundary)) {
    closureDecision = "rejected_not_explicit_negative_boundary";
  } else if (!provesNotSameStackSteelHoldout(sourceBoundary)) {
    closureDecision =
      "rejected_same_stack_steel_holdout_not_negative_boundary";
  } else {
    closureDecision = "accepted_residual_readiness_paired_negative_boundary";
  }

  const closureEvidenceAccepted =
    closureDecision ===
    "accepted_residual_readiness_paired_negative_boundary";

  return {
    ...input,
    additionalPairedNegativeBoundaryContribution: closureEvidenceAccepted
      ? 1
      : 0,
    canMoveRuntimeNow: false,
    canPromoteExactSourceNow: false,
    canRetuneRuntimeNow: false,
    closureDecision,
    closureEvidenceAccepted,
    closureEvidenceUse: closureEvidenceAccepted
      ? "residual_policy_readiness_evidence_only"
      : "blocked_paired_negative_boundary_evidence",
    countsTowardPairedNegativeBoundaryShortfallClosure:
      closureEvidenceAccepted,
    exactSourceOverrideAllowedNow: false,
    fieldBuildingAliasAllowedNow: false,
    measuredMetricValueIngestedForRuntime: false,
    missingLocatorMetadataFields: missingLocatorFields,
    missingSourceOwnedBoundaryFields: missingOwnerFields,
    residualRetuneAllowedNow: false,
    runtimeValueMovement: false,
    sourceDocumentCopied: false,
    sourceRowsAreResidualReadinessEvidenceNotProduct: true,
    sourceTextIngested: false,
    toleranceChangeAllowedNow: false,
  };
}

const completePairedNegativeBoundary =
  {
    basis: "lab_iso_10140_717_2",
    boundaryKind: "wrong_support_family",
    locatorMetadataFields: GATE_AW_REQUIRED_PACKET_LOCATOR_METADATA_FIELDS,
    metricFamily: "floor_impact_delta_lw",
    referenceFloor: "same_stack_steel",
    rightsPosture: "rights_safe_metadata_only",
    sourceKind: "source_owned_same_stack_lab_delta_lw",
    sourceOwnedFields: GATE_BE_REQUIRED_PAIRED_NEGATIVE_BOUNDARY_OWNER_FIELDS,
    supportFamily: "non_steel_heavy_or_concrete_floor",
  } satisfies GateBESteelFloorFormulaPairedNegativeBoundaryPacket;

const ownerFieldsWithout = (
  excludedField: GateBESteelFloorFormulaPairedNegativeBoundaryOwnerField,
): readonly GateBESteelFloorFormulaPairedNegativeBoundaryOwnerField[] =>
  GATE_BE_REQUIRED_PAIRED_NEGATIVE_BOUNDARY_OWNER_FIELDS.filter(
    (field) => field !== excludedField,
  );

const pairedNegativeClosureProbeInputs = [
  {
    holdoutClosureContract: gateBDHoldoutClosureContract,
    id: "gate_be_future_wrong_support_concrete_iso_delta_lw_boundary",
    sourceBoundary: completePairedNegativeBoundary,
  },
  {
    holdoutClosureContract: gateBDHoldoutClosureContract,
    id: "gate_be_future_wrong_reference_concrete_floor_iso_delta_lw_boundary",
    sourceBoundary: {
      ...completePairedNegativeBoundary,
      boundaryKind: "wrong_reference_floor",
      referenceFloor: "solid_or_concrete_reference_floor",
      supportFamily: "same_stack_lightweight_steel",
    },
  },
  {
    holdoutClosureContract: gateBDHoldoutClosureContract,
    id: "gate_be_future_wrong_support_timber_iso_delta_lw_boundary",
    sourceBoundary: {
      ...completePairedNegativeBoundary,
      supportFamily: "timber_or_mass_timber_floor",
    },
  },
  {
    holdoutClosureContract: gateBDHoldoutClosureContract,
    id: "gate_be_missing_boundary_support_identity_owner",
    sourceBoundary: {
      ...completePairedNegativeBoundary,
      sourceOwnedFields: ownerFieldsWithout(
        "boundary_support_or_reference_identity",
      ),
    },
  },
  {
    holdoutClosureContract: gateBDHoldoutClosureContract,
    id: "gate_be_missing_locator_metadata_boundary",
    sourceBoundary: {
      ...completePairedNegativeBoundary,
      locatorMetadataFields:
        GATE_AW_REQUIRED_PACKET_LOCATOR_METADATA_FIELDS.filter(
          (field) => field !== "source_locator",
        ),
    },
  },
  {
    holdoutClosureContract: gateBDHoldoutClosureContract,
    id: "gate_be_wrong_metric_basis_boundary",
    sourceBoundary: {
      ...completePairedNegativeBoundary,
      basis: "field_or_astm_basis",
    },
  },
  {
    holdoutClosureContract: gateBDHoldoutClosureContract,
    id: "gate_be_wrong_metric_family_boundary",
    sourceBoundary: {
      ...completePairedNegativeBoundary,
      metricFamily: "airborne_or_field_metric_family",
    },
  },
  {
    holdoutClosureContract: gateBDHoldoutClosureContract,
    id: "gate_be_same_stack_steel_not_negative_boundary",
    sourceBoundary: {
      ...completePairedNegativeBoundary,
      supportFamily: "same_stack_lightweight_steel",
    },
  },
  {
    holdoutClosureContract: gateBDHoldoutClosureContract,
    id: "gate_be_not_explicit_negative_boundary",
    sourceBoundary: {
      ...completePairedNegativeBoundary,
      boundaryKind: "not_explicit_negative_boundary",
    },
  },
  {
    holdoutClosureContract: gateBDHoldoutClosureContract,
    id: "gate_be_product_or_inferred_boundary",
    sourceBoundary: {
      ...completePairedNegativeBoundary,
      sourceKind: "product_catalog_delta_lw",
    },
  },
  {
    holdoutClosureContract: gateBDHoldoutClosureContract,
    id: "gate_be_rights_blocked_boundary",
    sourceBoundary: {
      ...completePairedNegativeBoundary,
      rightsPosture: "rights_blocked_do_not_ingest",
    },
  },
] satisfies readonly GateBESteelFloorFormulaPairedNegativeClosureInput[];

export function buildGateBESteelFloorFormulaSameStackIsoDeltaLwPairedNegativeClosureContract():
  GateBESteelFloorFormulaSameStackIsoDeltaLwPairedNegativeClosureContract {
  const pairedNegativeClosureProbeRows = pairedNegativeClosureProbeInputs.map(
    classifyGateBESteelFloorFormulaSameStackIsoDeltaLwPairedNegativeClosure,
  );
  const acceptedPairedNegativeClosureProbeIds =
    pairedNegativeClosureProbeRows
      .filter((row) => row.closureEvidenceAccepted)
      .map((row) => row.id);
  const rejectedPairedNegativeClosureProbeIds =
    pairedNegativeClosureProbeRows
      .filter((row) => !row.closureEvidenceAccepted)
      .map((row) => row.id);
  const acceptedAdditionalPairedNegativeBoundaryCount =
    pairedNegativeClosureProbeRows.reduce(
      (sum, row) =>
        sum + row.additionalPairedNegativeBoundaryContribution,
      0,
    );
  const remainingPairedNegativeBoundaryShortfall = Math.max(
    0,
    GATE_BE_REQUIRED_ADDITIONAL_PAIRED_NEGATIVE_BOUNDARY_COUNT -
      acceptedAdditionalPairedNegativeBoundaryCount,
  );

  return {
    acceptedPairedNegativeClosureProbeIds,
    exactSourceOverridePolicy: {
      exactMeasuredRowsRemainPrecedence: true,
      fullAssemblyExactMatchRequired: true,
      pairedNegativeClosureRowsAreNotExactRows: true,
    },
    fieldAndBuildingBasisSeparation: {
      fieldOrAstmBasisCanCloseLabPairedNegativeShortfall: false,
      labDeltaLwCanAliasFieldMetrics: false,
    },
    landedGate:
      "gate_be_steel_floor_formula_same_stack_iso_delta_lw_paired_negative_closure_plan",
    pairedNegativeClosurePolicy: {
      acceptedClosureEvidenceCanMoveRuntimeNow: false,
      acceptedClosureEvidenceCanMoveToleranceNow: false,
      acceptedClosureEvidenceUse: "residual_policy_readiness_evidence_only",
      broadSourceCrawlAllowed: false,
      exactOverrideAllowedNow: false,
      explicitWrongSupportOrReferenceBoundaryRequired: true,
      gateBDSelectedPairedNegativeLaneOnly: true,
      isoLabBasisOwnerRequired: true,
      rejectedOrRemainingFollowupLanesRemainBlocked: true,
      rightsSafeLocatorMetadataRequired: true,
      runtimeRetuneAllowedNow: false,
      sameTargetMetricFamilyRequired: true,
      sourceDocumentCopyAllowed: false,
      sourceOwnedBoundaryProofRequired: true,
      sourceTextIngestionAllowed: false,
    },
    pairedNegativeClosureProbeRows,
    pairedNegativeClosureSurface: {
      currentAdmittedDeltaLwHoldoutCount:
        gateBDHoldoutClosureContract.holdoutClosureSurface
          .currentAdmittedDeltaLwHoldoutCount,
      currentPairedNegativeBoundaryCount:
        gateBDHoldoutClosureContract.holdoutClosureSurface
          .currentPairedNegativeBoundaryCount,
      measuredMetricIds: ["DeltaLw"],
      metricBasis: "lab_iso_10140_717_2",
      requiredAdditionalPairedNegativeBoundaryCount:
        GATE_BE_REQUIRED_ADDITIONAL_PAIRED_NEGATIVE_BOUNDARY_COUNT,
      requiredBoundaryOwnerFields:
        GATE_BE_REQUIRED_PAIRED_NEGATIVE_BOUNDARY_OWNER_FIELDS,
      requiredCitationLocatorMetadataFields:
        GATE_AW_REQUIRED_PACKET_LOCATOR_METADATA_FIELDS,
      requiredTotalPairedNegativeBoundaryCount:
        GATE_BA_REQUIRED_PAIRED_NEGATIVE_BOUNDARY_COUNT,
      selectedGateBDNextLaneId: "paired_negative_boundary_closure",
      selectedOwner: "same_stack_iso_delta_lw_paired_negative_boundaries",
      selectedTermId: "paired_negative_boundaries_missing",
    },
    pairedNegativeReadiness: {
      acceptedAdditionalPairedNegativeBoundaryCount,
      closesGateBEPairedNegativeShortfall:
        remainingPairedNegativeBoundaryShortfall === 0,
      remainingPairedNegativeBoundaryShortfall,
      selectedNextClosureLaneId: "open_web_formula_input_ownership_closure",
    },
    previousLandedGate:
      "gate_bd_steel_floor_formula_same_stack_iso_delta_lw_holdout_closure_plan",
    rejectedPairedNegativeClosureProbeIds,
    remainingFollowupClosureLaneIds: [
      "open_web_formula_input_ownership_closure",
      "field_building_basis_owner_closure",
    ],
    runtimePins: {
      deltaLwToleranceDb: STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB,
      estimateDeltaLw: 22.4,
      estimateLnW: 55.6,
      lnWToleranceDb: STEEL_FLOOR_FORMULA_LN_W_TOLERANCE_DB,
      runtimeRetuneAllowedNow: false,
      runtimeValueMovement: false,
    },
    selectedHoldoutClosureInput: gateBDHoldoutClosureContract,
    selectedImplementationSlice:
      "calculator_model_first_physics_prediction_pivot_v1",
    selectedNextAction:
      GATE_BE_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_PAIRED_NEGATIVE_CLOSURE_SELECTED_NEXT_ACTION,
    selectedNextFile:
      GATE_BE_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_PAIRED_NEGATIVE_CLOSURE_SELECTED_NEXT_FILE,
    selectionStatus:
      "gate_be_same_stack_iso_delta_lw_paired_negative_closure_landed_no_runtime_selected_open_web_input_ownership_gate_bf",
  };
}
