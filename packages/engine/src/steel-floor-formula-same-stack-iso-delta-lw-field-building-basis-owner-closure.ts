import {
  GATE_AW_REQUIRED_PACKET_LOCATOR_METADATA_FIELDS,
  type GateAWSteelFloorFormulaPacketLocatorMetadataField,
} from "./steel-floor-formula-same-stack-iso-delta-lw-packet-acquisition-readiness";
import {
  type GateATSteelFloorFormulaPacketRightsPosture,
} from "./steel-floor-formula-same-stack-iso-delta-lw-packet-target";
import {
  buildGateBFSteelFloorFormulaSameStackIsoDeltaLwOpenWebInputOwnershipClosureContract,
  type GateBFSteelFloorFormulaSameStackIsoDeltaLwOpenWebInputOwnershipClosureContract,
} from "./steel-floor-formula-same-stack-iso-delta-lw-open-web-input-ownership-closure";
import {
  type GateBCSteelFloorFormulaResidualBlockerClosureLaneId,
} from "./steel-floor-formula-same-stack-iso-delta-lw-residual-blocker-closure";
import {
  STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB,
  STEEL_FLOOR_FORMULA_LN_W_TOLERANCE_DB,
} from "./steel-floor-impact-formula-corridor";

export const GATE_BG_REQUIRED_FIELD_BASIS_OWNER_PACKET_COUNT = 1;
export const GATE_BG_REQUIRED_BUILDING_BASIS_OWNER_PACKET_COUNT = 1;

export const GATE_BG_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_FIELD_BUILDING_BASIS_OWNER_CLOSURE_SELECTED_NEXT_FILE =
  "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-bh-steel-floor-formula-same-stack-iso-delta-lw-residual-policy-closed-owner-revalidation-contract.test.ts";

export const GATE_BG_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_FIELD_BUILDING_BASIS_OWNER_CLOSURE_SELECTED_NEXT_ACTION =
  "gate_bh_steel_floor_formula_same_stack_iso_delta_lw_residual_policy_closed_owner_revalidation_plan";

export const GATE_BG_REQUIRED_FIELD_BASIS_OWNER_FIELDS = [
  "field_metric_family",
  "receiving_room_geometry_or_volume",
  "separating_element_area",
  "junction_or_flanking_context",
  "reverberation_or_normalization_basis",
  "field_basis_owner",
  "source_or_project_context_locator",
] as const;

export type GateBGSteelFloorFormulaFieldBasisOwnerField =
  (typeof GATE_BG_REQUIRED_FIELD_BASIS_OWNER_FIELDS)[number];

export const GATE_BG_REQUIRED_BUILDING_BASIS_OWNER_FIELDS = [
  "building_prediction_metric_family",
  "receiving_room_geometry_or_volume",
  "separating_element_area",
  "junction_or_flanking_context",
  "flanking_path_model",
  "reverberation_or_normalization_basis",
  "building_prediction_basis_owner",
  "source_or_project_context_locator",
] as const;

export type GateBGSteelFloorFormulaBuildingBasisOwnerField =
  (typeof GATE_BG_REQUIRED_BUILDING_BASIS_OWNER_FIELDS)[number];

export type GateBGSteelFloorFormulaBasisOwnerField =
  | GateBGSteelFloorFormulaBuildingBasisOwnerField
  | GateBGSteelFloorFormulaFieldBasisOwnerField;

export const GATE_BG_REQUIRED_FIELD_BUILDING_CONTEXT_VALUE_FIELDS = [
  "receiving_room_volume_m3",
  "separating_element_area_m2",
  "junction_or_flanking_context",
  "reverberation_or_normalization_basis",
] as const;

export type GateBGSteelFloorFormulaFieldBuildingContextValueField =
  (typeof GATE_BG_REQUIRED_FIELD_BUILDING_CONTEXT_VALUE_FIELDS)[number];

export type GateBGSteelFloorFormulaBasisContextKind =
  | "building_prediction_context"
  | "field_apparent_impact_context"
  | "lab_element_context";

export type GateBGSteelFloorFormulaBasisContextBasis =
  | "astm_iic_or_stc_context"
  | "building_prediction_en_12354_2_project_context"
  | "field_iso_16283_2_717_2_apparent_impact"
  | "lab_iso_10140_717_2";

export type GateBGSteelFloorFormulaBasisOwnerMetricId =
  | "DeltaLw"
  | "IIC"
  | "L'n,w"
  | "L'nT,w"
  | "Ln,w"
  | "building_prediction_Ln_w"
  | "building_prediction_LnT_w";

export type GateBGSteelFloorFormulaBasisOwnerSourceKind =
  | "product_or_inferred_basis_claim"
  | "source_owned_building_prediction_basis_owner_packet"
  | "source_owned_field_apparent_basis_owner_packet";

export type GateBGSteelFloorFormulaContextFlag =
  | "missing_or_generic"
  | "source_owned_or_project_owned";

export type GateBGSteelFloorFormulaFieldBuildingBasisOwnerClosureDecision =
  | "accepted_residual_readiness_building_prediction_basis_owner"
  | "accepted_residual_readiness_field_apparent_basis_owner"
  | "blocked_gate_bf_next_lane_not_field_building_basis_owner"
  | "rejected_lab_corridor_alias_attempt"
  | "rejected_missing_field_building_context_values"
  | "rejected_missing_rights_safe_locator_or_project_context_metadata"
  | "rejected_missing_source_owned_basis_owner_fields"
  | "rejected_product_or_inferred_basis_claim"
  | "rejected_rights_blocked_basis_owner_packet"
  | "rejected_wrong_metric_basis"
  | "rejected_wrong_metric_family";

export type GateBGSteelFloorFormulaFieldBuildingBasisOwnerPacket = {
  readonly basis: GateBGSteelFloorFormulaBasisContextBasis;
  readonly contextKind: GateBGSteelFloorFormulaBasisContextKind;
  readonly junctionOrFlankingContext: GateBGSteelFloorFormulaContextFlag;
  readonly labCorridorAliasAttempt: boolean;
  readonly locatorMetadataFields: readonly GateAWSteelFloorFormulaPacketLocatorMetadataField[];
  readonly metricIds: readonly GateBGSteelFloorFormulaBasisOwnerMetricId[];
  readonly projectContextMetadataOwned: boolean;
  readonly receivingRoomVolumeM3: number | null;
  readonly reverberationOrNormalizationBasis: GateBGSteelFloorFormulaContextFlag;
  readonly rightsPosture: GateATSteelFloorFormulaPacketRightsPosture;
  readonly separatingElementAreaM2: number | null;
  readonly sourceKind: GateBGSteelFloorFormulaBasisOwnerSourceKind;
  readonly sourceOwnedFields: readonly GateBGSteelFloorFormulaBasisOwnerField[];
};

export type GateBGSteelFloorFormulaFieldBuildingBasisOwnerClosureInput = {
  readonly id: string;
  readonly openWebInputOwnershipClosureContract: GateBFSteelFloorFormulaSameStackIsoDeltaLwOpenWebInputOwnershipClosureContract;
  readonly sourceBasisPacket: GateBGSteelFloorFormulaFieldBuildingBasisOwnerPacket | null;
};

export type GateBGSteelFloorFormulaFieldBuildingBasisOwnerClosureRow =
  GateBGSteelFloorFormulaFieldBuildingBasisOwnerClosureInput & {
    readonly buildingBasisOwnerContribution: number;
    readonly canMoveRuntimeNow: false;
    readonly canPromoteExactSourceNow: false;
    readonly canRetuneRuntimeNow: false;
    readonly closureDecision: GateBGSteelFloorFormulaFieldBuildingBasisOwnerClosureDecision;
    readonly closureEvidenceAccepted: boolean;
    readonly closureEvidenceUse:
      | "blocked_field_building_basis_owner_evidence"
      | "residual_policy_readiness_evidence_only";
    readonly countsTowardBuildingBasisOwnerClosure: boolean;
    readonly countsTowardFieldBasisOwnerClosure: boolean;
    readonly exactSourceOverrideAllowedNow: false;
    readonly fieldBasisOwnerContribution: number;
    readonly fieldBuildingAliasAllowedNow: false;
    readonly labCorridorConvertedToFieldOrBuildingOutput: false;
    readonly measuredMetricValueIngestedForRuntime: false;
    readonly missingContextValueFields: readonly GateBGSteelFloorFormulaFieldBuildingContextValueField[];
    readonly missingLocatorOrProjectContextMetadataFields: readonly GateAWSteelFloorFormulaPacketLocatorMetadataField[];
    readonly missingSourceOwnedBasisFields: readonly GateBGSteelFloorFormulaBasisOwnerField[];
    readonly residualRetuneAllowedNow: false;
    readonly runtimeValueMovement: false;
    readonly sourceDocumentCopied: false;
    readonly sourceRowsAreResidualReadinessEvidenceNotProduct: true;
    readonly sourceTextIngested: false;
    readonly toleranceChangeAllowedNow: false;
  };

export type GateBGSteelFloorFormulaSameStackIsoDeltaLwFieldBuildingBasisOwnerClosureContract = {
  readonly acceptedFieldBuildingBasisOwnerClosureProbeIds: readonly string[];
  readonly exactSourceOverridePolicy: {
    readonly exactMeasuredRowsRemainPrecedence: true;
    readonly fieldBuildingBasisOwnerRowsAreNotExactRows: true;
    readonly fullAssemblyExactMatchRequired: true;
  };
  readonly fieldAndBuildingBasisSeparation: {
    readonly buildingPredictionRequiresOwnContextBeforeRuntime: true;
    readonly fieldImpactRequiresOwnContextBeforeRuntime: true;
    readonly labDeltaLwCanAliasFieldMetrics: false;
    readonly labLnWCanAliasApparentOrBuildingMetrics: false;
  };
  readonly fieldBuildingBasisOwnerClosurePolicy: {
    readonly acceptedClosureEvidenceCanMoveFieldOrBuildingRuntimeNow: false;
    readonly acceptedClosureEvidenceCanMoveRuntimeNow: false;
    readonly acceptedClosureEvidenceCanMoveToleranceNow: false;
    readonly acceptedClosureEvidenceUse: "residual_policy_readiness_evidence_only";
    readonly broadSourceCrawlAllowed: false;
    readonly exactOverrideAllowedNow: false;
    readonly fieldAndBuildingOwnersMustBeSeparate: true;
    readonly gateBFSelectedFieldBuildingBasisOwnerLaneOnly: true;
    readonly labCorridorAliasAllowed: false;
    readonly rejectedOrRemainingFollowupLanesRemainBlocked: true;
    readonly rightsSafeLocatorOrProjectContextMetadataRequired: true;
    readonly runtimeRetuneAllowedNow: false;
    readonly sourceDocumentCopyAllowed: false;
    readonly sourceOwnedBasisProofRequired: true;
    readonly sourceTextIngestionAllowed: false;
  };
  readonly fieldBuildingBasisOwnerClosureProbeRows: readonly GateBGSteelFloorFormulaFieldBuildingBasisOwnerClosureRow[];
  readonly fieldBuildingBasisOwnerClosureSurface: {
    readonly acceptedGateBFOpenWebFormulaInputPacketCount: number;
    readonly metricFamilies: readonly ["field_apparent_impact", "building_prediction"];
    readonly openWebFormulaInputOwnershipComplete: true;
    readonly requiredBuildingBasisOwnerFields: readonly GateBGSteelFloorFormulaBuildingBasisOwnerField[];
    readonly requiredBuildingBasisOwnerPacketCount: typeof GATE_BG_REQUIRED_BUILDING_BASIS_OWNER_PACKET_COUNT;
    readonly requiredContextValueFields: readonly GateBGSteelFloorFormulaFieldBuildingContextValueField[];
    readonly requiredFieldBasisOwnerFields: readonly GateBGSteelFloorFormulaFieldBasisOwnerField[];
    readonly requiredFieldBasisOwnerPacketCount: typeof GATE_BG_REQUIRED_FIELD_BASIS_OWNER_PACKET_COUNT;
    readonly requiredLocatorOrProjectContextMetadataFields: readonly GateAWSteelFloorFormulaPacketLocatorMetadataField[];
    readonly selectedGateBFNextLaneId: "field_building_basis_owner_closure";
    readonly selectedOwner: "separate_field_and_building_basis_owners";
    readonly selectedTermId: "field_and_building_basis_owners_missing";
  };
  readonly fieldBuildingBasisOwnerReadiness: {
    readonly acceptedBuildingBasisOwnerPacketCount: number;
    readonly acceptedFieldBasisOwnerPacketCount: number;
    readonly fieldBuildingBasisOwnerClosureComplete: boolean;
    readonly remainingBuildingBasisOwnerPacketShortfall: number;
    readonly remainingFieldBasisOwnerPacketShortfall: number;
    readonly selectedNextClosureLaneId: "residual_policy_closed_owner_revalidation";
  };
  readonly landedGate: "gate_bg_steel_floor_formula_same_stack_iso_delta_lw_field_building_basis_owner_closure_plan";
  readonly previousLandedGate: "gate_bf_steel_floor_formula_same_stack_iso_delta_lw_open_web_input_ownership_closure_plan";
  readonly rejectedFieldBuildingBasisOwnerClosureProbeIds: readonly string[];
  readonly remainingFollowupClosureLaneIds: readonly GateBCSteelFloorFormulaResidualBlockerClosureLaneId[];
  readonly runtimePins: {
    readonly deltaLwToleranceDb: typeof STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB;
    readonly estimateDeltaLw: 22.4;
    readonly estimateLnW: 55.6;
    readonly lnWToleranceDb: typeof STEEL_FLOOR_FORMULA_LN_W_TOLERANCE_DB;
    readonly runtimeRetuneAllowedNow: false;
    readonly runtimeValueMovement: false;
  };
  readonly selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1";
  readonly selectedNextAction: typeof GATE_BG_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_FIELD_BUILDING_BASIS_OWNER_CLOSURE_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof GATE_BG_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_FIELD_BUILDING_BASIS_OWNER_CLOSURE_SELECTED_NEXT_FILE;
  readonly selectedOpenWebInputOwnershipClosureInput: GateBFSteelFloorFormulaSameStackIsoDeltaLwOpenWebInputOwnershipClosureContract;
  readonly selectionStatus: "gate_bg_same_stack_iso_delta_lw_field_building_basis_owner_closure_landed_no_runtime_selected_residual_policy_revalidation_gate_bh";
};

const gateBFOpenWebInputOwnershipClosureContract =
  buildGateBFSteelFloorFormulaSameStackIsoDeltaLwOpenWebInputOwnershipClosureContract();

const missingLocatorOrProjectContextMetadataFields = (
  sourceBasisPacket: GateBGSteelFloorFormulaFieldBuildingBasisOwnerPacket | null,
): readonly GateAWSteelFloorFormulaPacketLocatorMetadataField[] => {
  if (sourceBasisPacket === null) {
    return GATE_AW_REQUIRED_PACKET_LOCATOR_METADATA_FIELDS;
  }

  if (sourceBasisPacket.projectContextMetadataOwned) {
    return [];
  }

  const present = new Set(sourceBasisPacket.locatorMetadataFields);
  return GATE_AW_REQUIRED_PACKET_LOCATOR_METADATA_FIELDS.filter(
    (field) => !present.has(field),
  );
};

const requiredOwnerFieldsForContext = (
  sourceBasisPacket: GateBGSteelFloorFormulaFieldBuildingBasisOwnerPacket | null,
): readonly GateBGSteelFloorFormulaBasisOwnerField[] => {
  if (sourceBasisPacket?.contextKind === "building_prediction_context") {
    return GATE_BG_REQUIRED_BUILDING_BASIS_OWNER_FIELDS;
  }

  return GATE_BG_REQUIRED_FIELD_BASIS_OWNER_FIELDS;
};

const missingSourceOwnedBasisFields = (
  sourceBasisPacket: GateBGSteelFloorFormulaFieldBuildingBasisOwnerPacket | null,
): readonly GateBGSteelFloorFormulaBasisOwnerField[] => {
  const required = requiredOwnerFieldsForContext(sourceBasisPacket);
  if (sourceBasisPacket === null) {
    return required;
  }

  const present = new Set(sourceBasisPacket.sourceOwnedFields);
  return required.filter((field) => !present.has(field));
};

const hasPositiveFiniteNumber = (value: number | null): value is number =>
  typeof value === "number" && Number.isFinite(value) && value > 0;

const missingContextValueFields = (
  sourceBasisPacket: GateBGSteelFloorFormulaFieldBuildingBasisOwnerPacket | null,
): readonly GateBGSteelFloorFormulaFieldBuildingContextValueField[] => {
  if (sourceBasisPacket === null) {
    return GATE_BG_REQUIRED_FIELD_BUILDING_CONTEXT_VALUE_FIELDS;
  }

  const missing: GateBGSteelFloorFormulaFieldBuildingContextValueField[] = [];
  if (!hasPositiveFiniteNumber(sourceBasisPacket.receivingRoomVolumeM3)) {
    missing.push("receiving_room_volume_m3");
  }
  if (!hasPositiveFiniteNumber(sourceBasisPacket.separatingElementAreaM2)) {
    missing.push("separating_element_area_m2");
  }
  if (sourceBasisPacket.junctionOrFlankingContext !== "source_owned_or_project_owned") {
    missing.push("junction_or_flanking_context");
  }
  if (
    sourceBasisPacket.reverberationOrNormalizationBasis !==
    "source_owned_or_project_owned"
  ) {
    missing.push("reverberation_or_normalization_basis");
  }

  return missing;
};

const selectedGateBFLaneIsFieldBuildingBasisOwner = (
  contract: GateBFSteelFloorFormulaSameStackIsoDeltaLwOpenWebInputOwnershipClosureContract,
): boolean =>
  contract.openWebInputOwnershipReadiness.selectedNextClosureLaneId ===
  "field_building_basis_owner_closure";

const isProductOrInferredSourceKind = (
  sourceKind: GateBGSteelFloorFormulaBasisOwnerSourceKind,
): boolean => sourceKind === "product_or_inferred_basis_claim";

const metricFamilyMatchesContext = (
  sourceBasisPacket: GateBGSteelFloorFormulaFieldBuildingBasisOwnerPacket,
): boolean => {
  if (sourceBasisPacket.contextKind === "field_apparent_impact_context") {
    return (
      sourceBasisPacket.metricIds.includes("L'n,w") &&
      sourceBasisPacket.metricIds.includes("L'nT,w")
    );
  }

  if (sourceBasisPacket.contextKind === "building_prediction_context") {
    return (
      sourceBasisPacket.metricIds.includes("building_prediction_Ln_w") &&
      sourceBasisPacket.metricIds.includes("building_prediction_LnT_w")
    );
  }

  return false;
};

const basisMatchesContext = (
  sourceBasisPacket: GateBGSteelFloorFormulaFieldBuildingBasisOwnerPacket,
): boolean =>
  (sourceBasisPacket.contextKind === "field_apparent_impact_context" &&
    sourceBasisPacket.basis === "field_iso_16283_2_717_2_apparent_impact") ||
  (sourceBasisPacket.contextKind === "building_prediction_context" &&
    sourceBasisPacket.basis ===
      "building_prediction_en_12354_2_project_context");

export function classifyGateBGSteelFloorFormulaSameStackIsoDeltaLwFieldBuildingBasisOwnerClosure(
  input: GateBGSteelFloorFormulaFieldBuildingBasisOwnerClosureInput,
): GateBGSteelFloorFormulaFieldBuildingBasisOwnerClosureRow {
  const sourceBasisPacket = input.sourceBasisPacket;
  const missingOwnerFields =
    missingSourceOwnedBasisFields(sourceBasisPacket);
  const missingLocatorFields =
    missingLocatorOrProjectContextMetadataFields(sourceBasisPacket);
  const missingValueFields = missingContextValueFields(sourceBasisPacket);

  let closureDecision: GateBGSteelFloorFormulaFieldBuildingBasisOwnerClosureDecision;
  if (
    !selectedGateBFLaneIsFieldBuildingBasisOwner(
      input.openWebInputOwnershipClosureContract,
    )
  ) {
    closureDecision =
      "blocked_gate_bf_next_lane_not_field_building_basis_owner";
  } else if (sourceBasisPacket === null || missingOwnerFields.length > 0) {
    closureDecision = "rejected_missing_source_owned_basis_owner_fields";
  } else if (sourceBasisPacket.rightsPosture === "rights_blocked_do_not_ingest") {
    closureDecision = "rejected_rights_blocked_basis_owner_packet";
  } else if (missingLocatorFields.length > 0) {
    closureDecision =
      "rejected_missing_rights_safe_locator_or_project_context_metadata";
  } else if (!basisMatchesContext(sourceBasisPacket)) {
    closureDecision = "rejected_wrong_metric_basis";
  } else if (sourceBasisPacket.labCorridorAliasAttempt) {
    closureDecision = "rejected_lab_corridor_alias_attempt";
  } else if (!metricFamilyMatchesContext(sourceBasisPacket)) {
    closureDecision = "rejected_wrong_metric_family";
  } else if (isProductOrInferredSourceKind(sourceBasisPacket.sourceKind)) {
    closureDecision = "rejected_product_or_inferred_basis_claim";
  } else if (missingValueFields.length > 0) {
    closureDecision = "rejected_missing_field_building_context_values";
  } else {
    closureDecision =
      sourceBasisPacket.contextKind === "field_apparent_impact_context"
        ? "accepted_residual_readiness_field_apparent_basis_owner"
        : "accepted_residual_readiness_building_prediction_basis_owner";
  }

  const fieldAccepted =
    closureDecision ===
    "accepted_residual_readiness_field_apparent_basis_owner";
  const buildingAccepted =
    closureDecision ===
    "accepted_residual_readiness_building_prediction_basis_owner";
  const closureEvidenceAccepted = fieldAccepted || buildingAccepted;

  return {
    ...input,
    buildingBasisOwnerContribution: buildingAccepted ? 1 : 0,
    canMoveRuntimeNow: false,
    canPromoteExactSourceNow: false,
    canRetuneRuntimeNow: false,
    closureDecision,
    closureEvidenceAccepted,
    closureEvidenceUse: closureEvidenceAccepted
      ? "residual_policy_readiness_evidence_only"
      : "blocked_field_building_basis_owner_evidence",
    countsTowardBuildingBasisOwnerClosure: buildingAccepted,
    countsTowardFieldBasisOwnerClosure: fieldAccepted,
    exactSourceOverrideAllowedNow: false,
    fieldBasisOwnerContribution: fieldAccepted ? 1 : 0,
    fieldBuildingAliasAllowedNow: false,
    labCorridorConvertedToFieldOrBuildingOutput: false,
    measuredMetricValueIngestedForRuntime: false,
    missingContextValueFields: missingValueFields,
    missingLocatorOrProjectContextMetadataFields: missingLocatorFields,
    missingSourceOwnedBasisFields: missingOwnerFields,
    residualRetuneAllowedNow: false,
    runtimeValueMovement: false,
    sourceDocumentCopied: false,
    sourceRowsAreResidualReadinessEvidenceNotProduct: true,
    sourceTextIngested: false,
    toleranceChangeAllowedNow: false,
  };
}

const completeFieldBasisOwnerPacket =
  {
    basis: "field_iso_16283_2_717_2_apparent_impact",
    contextKind: "field_apparent_impact_context",
    junctionOrFlankingContext: "source_owned_or_project_owned",
    labCorridorAliasAttempt: false,
    locatorMetadataFields: GATE_AW_REQUIRED_PACKET_LOCATOR_METADATA_FIELDS,
    metricIds: ["L'n,w", "L'nT,w"],
    projectContextMetadataOwned: false,
    receivingRoomVolumeM3: 52,
    reverberationOrNormalizationBasis: "source_owned_or_project_owned",
    rightsPosture: "rights_safe_metadata_only",
    separatingElementAreaM2: 18,
    sourceKind: "source_owned_field_apparent_basis_owner_packet",
    sourceOwnedFields: GATE_BG_REQUIRED_FIELD_BASIS_OWNER_FIELDS,
  } satisfies GateBGSteelFloorFormulaFieldBuildingBasisOwnerPacket;

const completeBuildingBasisOwnerPacket =
  {
    basis: "building_prediction_en_12354_2_project_context",
    contextKind: "building_prediction_context",
    junctionOrFlankingContext: "source_owned_or_project_owned",
    labCorridorAliasAttempt: false,
    locatorMetadataFields: [],
    metricIds: ["building_prediction_Ln_w", "building_prediction_LnT_w"],
    projectContextMetadataOwned: true,
    receivingRoomVolumeM3: 48,
    reverberationOrNormalizationBasis: "source_owned_or_project_owned",
    rightsPosture: "rights_safe_metadata_only",
    separatingElementAreaM2: 20,
    sourceKind: "source_owned_building_prediction_basis_owner_packet",
    sourceOwnedFields: GATE_BG_REQUIRED_BUILDING_BASIS_OWNER_FIELDS,
  } satisfies GateBGSteelFloorFormulaFieldBuildingBasisOwnerPacket;

const fieldOwnerFieldsWithout = (
  excludedField: GateBGSteelFloorFormulaFieldBasisOwnerField,
): readonly GateBGSteelFloorFormulaFieldBasisOwnerField[] =>
  GATE_BG_REQUIRED_FIELD_BASIS_OWNER_FIELDS.filter(
    (field) => field !== excludedField,
  );

const buildingOwnerFieldsWithout = (
  excludedField: GateBGSteelFloorFormulaBuildingBasisOwnerField,
): readonly GateBGSteelFloorFormulaBuildingBasisOwnerField[] =>
  GATE_BG_REQUIRED_BUILDING_BASIS_OWNER_FIELDS.filter(
    (field) => field !== excludedField,
  );

const fieldBuildingBasisOwnerClosureProbeInputs = [
  {
    id: "gate_bg_future_source_owned_field_apparent_basis_owner_packet",
    openWebInputOwnershipClosureContract:
      gateBFOpenWebInputOwnershipClosureContract,
    sourceBasisPacket: completeFieldBasisOwnerPacket,
  },
  {
    id: "gate_bg_future_project_owned_building_prediction_basis_owner_packet",
    openWebInputOwnershipClosureContract:
      gateBFOpenWebInputOwnershipClosureContract,
    sourceBasisPacket: completeBuildingBasisOwnerPacket,
  },
  {
    id: "gate_bg_missing_field_room_geometry_owner",
    openWebInputOwnershipClosureContract:
      gateBFOpenWebInputOwnershipClosureContract,
    sourceBasisPacket: {
      ...completeFieldBasisOwnerPacket,
      sourceOwnedFields: fieldOwnerFieldsWithout(
        "receiving_room_geometry_or_volume",
      ),
    },
  },
  {
    id: "gate_bg_missing_building_flanking_model_owner",
    openWebInputOwnershipClosureContract:
      gateBFOpenWebInputOwnershipClosureContract,
    sourceBasisPacket: {
      ...completeBuildingBasisOwnerPacket,
      sourceOwnedFields: buildingOwnerFieldsWithout("flanking_path_model"),
    },
  },
  {
    id: "gate_bg_missing_receiving_room_volume_value",
    openWebInputOwnershipClosureContract:
      gateBFOpenWebInputOwnershipClosureContract,
    sourceBasisPacket: {
      ...completeFieldBasisOwnerPacket,
      receivingRoomVolumeM3: null,
    },
  },
  {
    id: "gate_bg_missing_locator_and_project_context_metadata",
    openWebInputOwnershipClosureContract:
      gateBFOpenWebInputOwnershipClosureContract,
    sourceBasisPacket: {
      ...completeFieldBasisOwnerPacket,
      locatorMetadataFields:
        GATE_AW_REQUIRED_PACKET_LOCATOR_METADATA_FIELDS.filter(
          (field) => field !== "source_locator",
        ),
      projectContextMetadataOwned: false,
    },
  },
  {
    id: "gate_bg_wrong_lab_basis_for_field_context",
    openWebInputOwnershipClosureContract:
      gateBFOpenWebInputOwnershipClosureContract,
    sourceBasisPacket: {
      ...completeFieldBasisOwnerPacket,
      basis: "lab_iso_10140_717_2",
    },
  },
  {
    id: "gate_bg_lab_corridor_alias_attempt",
    openWebInputOwnershipClosureContract:
      gateBFOpenWebInputOwnershipClosureContract,
    sourceBasisPacket: {
      ...completeFieldBasisOwnerPacket,
      labCorridorAliasAttempt: true,
    },
  },
  {
    id: "gate_bg_wrong_metric_family_iic_claim",
    openWebInputOwnershipClosureContract:
      gateBFOpenWebInputOwnershipClosureContract,
    sourceBasisPacket: {
      ...completeFieldBasisOwnerPacket,
      metricIds: ["IIC"],
    },
  },
  {
    id: "gate_bg_product_or_inferred_basis_claim",
    openWebInputOwnershipClosureContract:
      gateBFOpenWebInputOwnershipClosureContract,
    sourceBasisPacket: {
      ...completeBuildingBasisOwnerPacket,
      sourceKind: "product_or_inferred_basis_claim",
    },
  },
  {
    id: "gate_bg_rights_blocked_basis_owner_packet",
    openWebInputOwnershipClosureContract:
      gateBFOpenWebInputOwnershipClosureContract,
    sourceBasisPacket: {
      ...completeFieldBasisOwnerPacket,
      rightsPosture: "rights_blocked_do_not_ingest",
    },
  },
] satisfies readonly GateBGSteelFloorFormulaFieldBuildingBasisOwnerClosureInput[];

export function buildGateBGSteelFloorFormulaSameStackIsoDeltaLwFieldBuildingBasisOwnerClosureContract():
  GateBGSteelFloorFormulaSameStackIsoDeltaLwFieldBuildingBasisOwnerClosureContract {
  const fieldBuildingBasisOwnerClosureProbeRows =
    fieldBuildingBasisOwnerClosureProbeInputs.map(
      classifyGateBGSteelFloorFormulaSameStackIsoDeltaLwFieldBuildingBasisOwnerClosure,
    );
  const acceptedFieldBuildingBasisOwnerClosureProbeIds =
    fieldBuildingBasisOwnerClosureProbeRows
      .filter((row) => row.closureEvidenceAccepted)
      .map((row) => row.id);
  const rejectedFieldBuildingBasisOwnerClosureProbeIds =
    fieldBuildingBasisOwnerClosureProbeRows
      .filter((row) => !row.closureEvidenceAccepted)
      .map((row) => row.id);
  const acceptedFieldBasisOwnerPacketCount =
    fieldBuildingBasisOwnerClosureProbeRows.reduce(
      (sum, row) => sum + row.fieldBasisOwnerContribution,
      0,
    );
  const acceptedBuildingBasisOwnerPacketCount =
    fieldBuildingBasisOwnerClosureProbeRows.reduce(
      (sum, row) => sum + row.buildingBasisOwnerContribution,
      0,
    );
  const remainingFieldBasisOwnerPacketShortfall = Math.max(
    0,
    GATE_BG_REQUIRED_FIELD_BASIS_OWNER_PACKET_COUNT -
      acceptedFieldBasisOwnerPacketCount,
  );
  const remainingBuildingBasisOwnerPacketShortfall = Math.max(
    0,
    GATE_BG_REQUIRED_BUILDING_BASIS_OWNER_PACKET_COUNT -
      acceptedBuildingBasisOwnerPacketCount,
  );

  return {
    acceptedFieldBuildingBasisOwnerClosureProbeIds,
    exactSourceOverridePolicy: {
      exactMeasuredRowsRemainPrecedence: true,
      fieldBuildingBasisOwnerRowsAreNotExactRows: true,
      fullAssemblyExactMatchRequired: true,
    },
    fieldAndBuildingBasisSeparation: {
      buildingPredictionRequiresOwnContextBeforeRuntime: true,
      fieldImpactRequiresOwnContextBeforeRuntime: true,
      labDeltaLwCanAliasFieldMetrics: false,
      labLnWCanAliasApparentOrBuildingMetrics: false,
    },
    fieldBuildingBasisOwnerClosurePolicy: {
      acceptedClosureEvidenceCanMoveFieldOrBuildingRuntimeNow: false,
      acceptedClosureEvidenceCanMoveRuntimeNow: false,
      acceptedClosureEvidenceCanMoveToleranceNow: false,
      acceptedClosureEvidenceUse: "residual_policy_readiness_evidence_only",
      broadSourceCrawlAllowed: false,
      exactOverrideAllowedNow: false,
      fieldAndBuildingOwnersMustBeSeparate: true,
      gateBFSelectedFieldBuildingBasisOwnerLaneOnly: true,
      labCorridorAliasAllowed: false,
      rejectedOrRemainingFollowupLanesRemainBlocked: true,
      rightsSafeLocatorOrProjectContextMetadataRequired: true,
      runtimeRetuneAllowedNow: false,
      sourceDocumentCopyAllowed: false,
      sourceOwnedBasisProofRequired: true,
      sourceTextIngestionAllowed: false,
    },
    fieldBuildingBasisOwnerClosureProbeRows,
    fieldBuildingBasisOwnerClosureSurface: {
      acceptedGateBFOpenWebFormulaInputPacketCount:
        gateBFOpenWebInputOwnershipClosureContract
          .openWebInputOwnershipReadiness
          .acceptedSourceOwnedOpenWebFormulaInputPacketCount,
      metricFamilies: ["field_apparent_impact", "building_prediction"],
      openWebFormulaInputOwnershipComplete: true,
      requiredBuildingBasisOwnerFields:
        GATE_BG_REQUIRED_BUILDING_BASIS_OWNER_FIELDS,
      requiredBuildingBasisOwnerPacketCount:
        GATE_BG_REQUIRED_BUILDING_BASIS_OWNER_PACKET_COUNT,
      requiredContextValueFields:
        GATE_BG_REQUIRED_FIELD_BUILDING_CONTEXT_VALUE_FIELDS,
      requiredFieldBasisOwnerFields:
        GATE_BG_REQUIRED_FIELD_BASIS_OWNER_FIELDS,
      requiredFieldBasisOwnerPacketCount:
        GATE_BG_REQUIRED_FIELD_BASIS_OWNER_PACKET_COUNT,
      requiredLocatorOrProjectContextMetadataFields:
        GATE_AW_REQUIRED_PACKET_LOCATOR_METADATA_FIELDS,
      selectedGateBFNextLaneId: "field_building_basis_owner_closure",
      selectedOwner: "separate_field_and_building_basis_owners",
      selectedTermId: "field_and_building_basis_owners_missing",
    },
    fieldBuildingBasisOwnerReadiness: {
      acceptedBuildingBasisOwnerPacketCount,
      acceptedFieldBasisOwnerPacketCount,
      fieldBuildingBasisOwnerClosureComplete:
        remainingFieldBasisOwnerPacketShortfall === 0 &&
        remainingBuildingBasisOwnerPacketShortfall === 0,
      remainingBuildingBasisOwnerPacketShortfall,
      remainingFieldBasisOwnerPacketShortfall,
      selectedNextClosureLaneId: "residual_policy_closed_owner_revalidation",
    },
    landedGate:
      "gate_bg_steel_floor_formula_same_stack_iso_delta_lw_field_building_basis_owner_closure_plan",
    previousLandedGate:
      "gate_bf_steel_floor_formula_same_stack_iso_delta_lw_open_web_input_ownership_closure_plan",
    rejectedFieldBuildingBasisOwnerClosureProbeIds,
    remainingFollowupClosureLaneIds: [],
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
      GATE_BG_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_FIELD_BUILDING_BASIS_OWNER_CLOSURE_SELECTED_NEXT_ACTION,
    selectedNextFile:
      GATE_BG_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_FIELD_BUILDING_BASIS_OWNER_CLOSURE_SELECTED_NEXT_FILE,
    selectedOpenWebInputOwnershipClosureInput:
      gateBFOpenWebInputOwnershipClosureContract,
    selectionStatus:
      "gate_bg_same_stack_iso_delta_lw_field_building_basis_owner_closure_landed_no_runtime_selected_residual_policy_revalidation_gate_bh",
  };
}
