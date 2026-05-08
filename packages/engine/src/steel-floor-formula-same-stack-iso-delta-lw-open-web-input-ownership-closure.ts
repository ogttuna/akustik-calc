import type {
  ImpactPredictorLowerTreatmentSupportClass,
  ImpactPredictorSupportForm,
} from "@dynecho/shared";

import {
  GATE_AW_REQUIRED_PACKET_LOCATOR_METADATA_FIELDS,
  type GateAWSteelFloorFormulaPacketLocatorMetadataField,
} from "./steel-floor-formula-same-stack-iso-delta-lw-packet-acquisition-readiness";
import {
  type GateATSteelFloorFormulaPacketRightsPosture,
} from "./steel-floor-formula-same-stack-iso-delta-lw-packet-target";
import {
  buildGateBESteelFloorFormulaSameStackIsoDeltaLwPairedNegativeClosureContract,
  type GateBESteelFloorFormulaSameStackIsoDeltaLwPairedNegativeClosureContract,
} from "./steel-floor-formula-same-stack-iso-delta-lw-paired-negative-closure";
import {
  type GateBCSteelFloorFormulaResidualBlockerClosureLaneId,
} from "./steel-floor-formula-same-stack-iso-delta-lw-residual-blocker-closure";
import {
  type SteelFloorDeltaLwHoldoutBasis,
} from "./steel-floor-formula-source-owned-delta-lw-holdout";
import {
  STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB,
  STEEL_FLOOR_FORMULA_LN_W_TOLERANCE_DB,
} from "./steel-floor-impact-formula-corridor";

export const GATE_BF_REQUIRED_SOURCE_OWNED_OPEN_WEB_FORMULA_INPUT_PACKET_COUNT =
  1;

export const GATE_BF_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_OPEN_WEB_INPUT_OWNERSHIP_CLOSURE_SELECTED_NEXT_FILE =
  "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-bg-steel-floor-formula-same-stack-iso-delta-lw-field-building-basis-owner-closure-contract.test.ts";

export const GATE_BF_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_OPEN_WEB_INPUT_OWNERSHIP_CLOSURE_SELECTED_NEXT_ACTION =
  "gate_bg_steel_floor_formula_same_stack_iso_delta_lw_field_building_basis_owner_closure_plan";

export const GATE_BF_REQUIRED_OPEN_WEB_FORMULA_INPUT_OWNER_FIELDS = [
  "support_form",
  "carrier_depth",
  "carrier_spacing",
  "load_basis",
  "dynamic_stiffness",
  "lower_support_class",
  "upper_resilient_topology",
] as const;

export type GateBFSteelFloorFormulaOpenWebInputOwnerField =
  (typeof GATE_BF_REQUIRED_OPEN_WEB_FORMULA_INPUT_OWNER_FIELDS)[number];

export const GATE_BF_REQUIRED_OPEN_WEB_FORMULA_INPUT_VALUE_FIELDS = [
  "carrier_depth_mm",
  "carrier_spacing_mm",
  "load_basis_kg_m2",
  "dynamic_stiffness_mn_m3",
] as const;

export type GateBFSteelFloorFormulaOpenWebInputValueField =
  (typeof GATE_BF_REQUIRED_OPEN_WEB_FORMULA_INPUT_VALUE_FIELDS)[number];

export type GateBFSteelFloorFormulaOpenWebInputSourceKind =
  | "inferred_from_exact_row_or_companion"
  | "product_catalog_or_design_guide_input_claim"
  | "source_owned_open_web_formula_input_packet";

export type GateBFSteelFloorFormulaUpperResilientTopology =
  | "floating_screed_or_resilient_mat"
  | "not_source_owned";

export type GateBFSteelFloorFormulaOpenWebInputOwnershipClosureDecision =
  | "accepted_residual_readiness_open_web_formula_input_ownership"
  | "blocked_gate_be_next_lane_not_open_web_formula_input_ownership"
  | "rejected_missing_open_web_formula_input_values"
  | "rejected_missing_rights_safe_locator_metadata"
  | "rejected_missing_source_owned_open_web_formula_input_fields"
  | "rejected_product_or_inferred_open_web_input_claim"
  | "rejected_rights_blocked_open_web_input_packet"
  | "rejected_wrong_metric_basis"
  | "rejected_wrong_support_form";

export type GateBFSteelFloorFormulaOpenWebInputOwnershipPacket = {
  readonly basis: SteelFloorDeltaLwHoldoutBasis;
  readonly carrierDepthMm: number | null;
  readonly carrierSpacingMm: number | null;
  readonly dynamicStiffnessMNm3: number | null;
  readonly loadBasisKgM2: number | null;
  readonly locatorMetadataFields: readonly GateAWSteelFloorFormulaPacketLocatorMetadataField[];
  readonly lowerSupportClass: ImpactPredictorLowerTreatmentSupportClass | null;
  readonly rightsPosture: GateATSteelFloorFormulaPacketRightsPosture;
  readonly sourceKind: GateBFSteelFloorFormulaOpenWebInputSourceKind;
  readonly sourceOwnedFields: readonly GateBFSteelFloorFormulaOpenWebInputOwnerField[];
  readonly supportForm: ImpactPredictorSupportForm | "generic_lightweight_steel";
  readonly upperResilientTopology: GateBFSteelFloorFormulaUpperResilientTopology;
};

export type GateBFSteelFloorFormulaOpenWebInputOwnershipClosureInput = {
  readonly id: string;
  readonly pairedNegativeClosureContract: GateBESteelFloorFormulaSameStackIsoDeltaLwPairedNegativeClosureContract;
  readonly sourceInputPacket: GateBFSteelFloorFormulaOpenWebInputOwnershipPacket | null;
};

export type GateBFSteelFloorFormulaOpenWebInputOwnershipClosureRow =
  GateBFSteelFloorFormulaOpenWebInputOwnershipClosureInput & {
    readonly canMoveRuntimeNow: false;
    readonly canPromoteExactSourceNow: false;
    readonly canRetuneRuntimeNow: false;
    readonly closureDecision: GateBFSteelFloorFormulaOpenWebInputOwnershipClosureDecision;
    readonly closureEvidenceAccepted: boolean;
    readonly closureEvidenceUse:
      | "blocked_open_web_formula_input_ownership_evidence"
      | "residual_policy_readiness_evidence_only";
    readonly countsTowardOpenWebInputOwnershipClosure: boolean;
    readonly exactSourceOverrideAllowedNow: false;
    readonly fieldBuildingAliasAllowedNow: false;
    readonly measuredMetricValueIngestedForRuntime: false;
    readonly missingInputValueFields: readonly GateBFSteelFloorFormulaOpenWebInputValueField[];
    readonly missingLocatorMetadataFields: readonly GateAWSteelFloorFormulaPacketLocatorMetadataField[];
    readonly missingSourceOwnedInputFields: readonly GateBFSteelFloorFormulaOpenWebInputOwnerField[];
    readonly openWebFormulaInputOwnershipContribution: number;
    readonly residualRetuneAllowedNow: false;
    readonly runtimeValueMovement: false;
    readonly sourceDocumentCopied: false;
    readonly sourceRowsAreResidualReadinessEvidenceNotProduct: true;
    readonly sourceTextIngested: false;
    readonly toleranceChangeAllowedNow: false;
  };

export type GateBFSteelFloorFormulaSameStackIsoDeltaLwOpenWebInputOwnershipClosureContract = {
  readonly acceptedOpenWebInputOwnershipClosureProbeIds: readonly string[];
  readonly exactSourceOverridePolicy: {
    readonly exactMeasuredRowsRemainPrecedence: true;
    readonly fullAssemblyExactMatchRequired: true;
    readonly openWebInputOwnershipClosureRowsAreNotExactRows: true;
  };
  readonly fieldAndBuildingBasisSeparation: {
    readonly fieldOrAstmBasisCanCloseLabOpenWebInputOwnership: false;
    readonly labDeltaLwCanAliasFieldMetrics: false;
  };
  readonly landedGate: "gate_bf_steel_floor_formula_same_stack_iso_delta_lw_open_web_input_ownership_closure_plan";
  readonly openWebInputOwnershipClosurePolicy: {
    readonly acceptedClosureEvidenceCanMoveRuntimeNow: false;
    readonly acceptedClosureEvidenceCanMoveToleranceNow: false;
    readonly acceptedClosureEvidenceUse: "residual_policy_readiness_evidence_only";
    readonly broadSourceCrawlAllowed: false;
    readonly exactOverrideAllowedNow: false;
    readonly gateBESelectedOpenWebInputOwnershipLaneOnly: true;
    readonly isoLabBasisOwnerRequired: true;
    readonly openWebSupportFormRequired: true;
    readonly rejectedOrRemainingFollowupLanesRemainBlocked: true;
    readonly rightsSafeLocatorMetadataRequired: true;
    readonly runtimeRetuneAllowedNow: false;
    readonly sourceDocumentCopyAllowed: false;
    readonly sourceOwnedFormulaInputProofRequired: true;
    readonly sourceTextIngestionAllowed: false;
  };
  readonly openWebInputOwnershipClosureProbeRows: readonly GateBFSteelFloorFormulaOpenWebInputOwnershipClosureRow[];
  readonly openWebInputOwnershipClosureSurface: {
    readonly acceptedGateBEAdditionalPairedNegativeBoundaryCount: number;
    readonly metricBasis: "lab_iso_10140_717_2";
    readonly pairedNegativeClosureComplete: true;
    readonly requiredCitationLocatorMetadataFields: readonly GateAWSteelFloorFormulaPacketLocatorMetadataField[];
    readonly requiredOpenWebFormulaInputOwnerFields: readonly GateBFSteelFloorFormulaOpenWebInputOwnerField[];
    readonly requiredOpenWebFormulaInputPacketCount: typeof GATE_BF_REQUIRED_SOURCE_OWNED_OPEN_WEB_FORMULA_INPUT_PACKET_COUNT;
    readonly requiredOpenWebFormulaInputValueFields: readonly GateBFSteelFloorFormulaOpenWebInputValueField[];
    readonly selectedGateBENextLaneId: "open_web_formula_input_ownership_closure";
    readonly selectedOwner: "source_owned_open_web_formula_input_packet";
    readonly selectedTermId: "open_web_formula_inputs_not_source_owned";
  };
  readonly openWebInputOwnershipReadiness: {
    readonly acceptedSourceOwnedOpenWebFormulaInputPacketCount: number;
    readonly openWebFormulaInputOwnershipComplete: boolean;
    readonly remainingOpenWebFormulaInputOwnershipPacketShortfall: number;
    readonly selectedNextClosureLaneId: "field_building_basis_owner_closure";
  };
  readonly previousLandedGate: "gate_be_steel_floor_formula_same_stack_iso_delta_lw_paired_negative_closure_plan";
  readonly rejectedOpenWebInputOwnershipClosureProbeIds: readonly string[];
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
  readonly selectedNextAction: typeof GATE_BF_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_OPEN_WEB_INPUT_OWNERSHIP_CLOSURE_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof GATE_BF_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_OPEN_WEB_INPUT_OWNERSHIP_CLOSURE_SELECTED_NEXT_FILE;
  readonly selectedPairedNegativeClosureInput: GateBESteelFloorFormulaSameStackIsoDeltaLwPairedNegativeClosureContract;
  readonly selectionStatus: "gate_bf_same_stack_iso_delta_lw_open_web_input_ownership_closure_landed_no_runtime_selected_field_building_basis_owner_gate_bg";
};

const gateBEPairedNegativeClosureContract =
  buildGateBESteelFloorFormulaSameStackIsoDeltaLwPairedNegativeClosureContract();

const missingLocatorMetadataFields = (
  fields: readonly GateAWSteelFloorFormulaPacketLocatorMetadataField[],
): readonly GateAWSteelFloorFormulaPacketLocatorMetadataField[] => {
  const present = new Set(fields);
  return GATE_AW_REQUIRED_PACKET_LOCATOR_METADATA_FIELDS.filter(
    (field) => !present.has(field),
  );
};

const missingSourceOwnedInputFields = (
  fields: readonly GateBFSteelFloorFormulaOpenWebInputOwnerField[],
): readonly GateBFSteelFloorFormulaOpenWebInputOwnerField[] => {
  const present = new Set(fields);
  return GATE_BF_REQUIRED_OPEN_WEB_FORMULA_INPUT_OWNER_FIELDS.filter(
    (field) => !present.has(field),
  );
};

const hasPositiveFiniteNumber = (value: number | null): value is number =>
  typeof value === "number" && Number.isFinite(value) && value > 0;

const missingInputValueFields = (
  sourceInputPacket: GateBFSteelFloorFormulaOpenWebInputOwnershipPacket | null,
): readonly GateBFSteelFloorFormulaOpenWebInputValueField[] => {
  if (sourceInputPacket === null) {
    return GATE_BF_REQUIRED_OPEN_WEB_FORMULA_INPUT_VALUE_FIELDS;
  }

  const missing: GateBFSteelFloorFormulaOpenWebInputValueField[] = [];
  if (!hasPositiveFiniteNumber(sourceInputPacket.carrierDepthMm)) {
    missing.push("carrier_depth_mm");
  }
  if (!hasPositiveFiniteNumber(sourceInputPacket.carrierSpacingMm)) {
    missing.push("carrier_spacing_mm");
  }
  if (!hasPositiveFiniteNumber(sourceInputPacket.loadBasisKgM2)) {
    missing.push("load_basis_kg_m2");
  }
  if (!hasPositiveFiniteNumber(sourceInputPacket.dynamicStiffnessMNm3)) {
    missing.push("dynamic_stiffness_mn_m3");
  }

  return missing;
};

const selectedGateBELaneIsOpenWebInputOwnership = (
  contract: GateBESteelFloorFormulaSameStackIsoDeltaLwPairedNegativeClosureContract,
): boolean =>
  contract.pairedNegativeReadiness.selectedNextClosureLaneId ===
  "open_web_formula_input_ownership_closure";

const isProductOrInferredSourceKind = (
  sourceKind: GateBFSteelFloorFormulaOpenWebInputSourceKind,
): boolean =>
  sourceKind === "product_catalog_or_design_guide_input_claim" ||
  sourceKind === "inferred_from_exact_row_or_companion";

export function classifyGateBFSteelFloorFormulaSameStackIsoDeltaLwOpenWebInputOwnershipClosure(
  input: GateBFSteelFloorFormulaOpenWebInputOwnershipClosureInput,
): GateBFSteelFloorFormulaOpenWebInputOwnershipClosureRow {
  const sourceInputPacket = input.sourceInputPacket;
  const missingLocatorFields =
    sourceInputPacket === null
      ? GATE_AW_REQUIRED_PACKET_LOCATOR_METADATA_FIELDS
      : missingLocatorMetadataFields(sourceInputPacket.locatorMetadataFields);
  const missingOwnerFields =
    sourceInputPacket === null
      ? GATE_BF_REQUIRED_OPEN_WEB_FORMULA_INPUT_OWNER_FIELDS
      : missingSourceOwnedInputFields(sourceInputPacket.sourceOwnedFields);
  const missingValueFields = missingInputValueFields(sourceInputPacket);

  let closureDecision: GateBFSteelFloorFormulaOpenWebInputOwnershipClosureDecision;
  if (
    !selectedGateBELaneIsOpenWebInputOwnership(
      input.pairedNegativeClosureContract,
    )
  ) {
    closureDecision =
      "blocked_gate_be_next_lane_not_open_web_formula_input_ownership";
  } else if (sourceInputPacket === null || missingOwnerFields.length > 0) {
    closureDecision =
      "rejected_missing_source_owned_open_web_formula_input_fields";
  } else if (
    sourceInputPacket.rightsPosture === "rights_blocked_do_not_ingest"
  ) {
    closureDecision = "rejected_rights_blocked_open_web_input_packet";
  } else if (missingLocatorFields.length > 0) {
    closureDecision = "rejected_missing_rights_safe_locator_metadata";
  } else if (sourceInputPacket.basis !== "lab_iso_10140_717_2") {
    closureDecision = "rejected_wrong_metric_basis";
  } else if (sourceInputPacket.supportForm !== "open_web_or_rolled") {
    closureDecision = "rejected_wrong_support_form";
  } else if (isProductOrInferredSourceKind(sourceInputPacket.sourceKind)) {
    closureDecision = "rejected_product_or_inferred_open_web_input_claim";
  } else if (
    missingValueFields.length > 0 ||
    sourceInputPacket.lowerSupportClass === null ||
    sourceInputPacket.upperResilientTopology !==
      "floating_screed_or_resilient_mat"
  ) {
    closureDecision = "rejected_missing_open_web_formula_input_values";
  } else {
    closureDecision =
      "accepted_residual_readiness_open_web_formula_input_ownership";
  }

  const closureEvidenceAccepted =
    closureDecision ===
    "accepted_residual_readiness_open_web_formula_input_ownership";

  return {
    ...input,
    canMoveRuntimeNow: false,
    canPromoteExactSourceNow: false,
    canRetuneRuntimeNow: false,
    closureDecision,
    closureEvidenceAccepted,
    closureEvidenceUse: closureEvidenceAccepted
      ? "residual_policy_readiness_evidence_only"
      : "blocked_open_web_formula_input_ownership_evidence",
    countsTowardOpenWebInputOwnershipClosure: closureEvidenceAccepted,
    exactSourceOverrideAllowedNow: false,
    fieldBuildingAliasAllowedNow: false,
    measuredMetricValueIngestedForRuntime: false,
    missingInputValueFields: missingValueFields,
    missingLocatorMetadataFields: missingLocatorFields,
    missingSourceOwnedInputFields: missingOwnerFields,
    openWebFormulaInputOwnershipContribution: closureEvidenceAccepted ? 1 : 0,
    residualRetuneAllowedNow: false,
    runtimeValueMovement: false,
    sourceDocumentCopied: false,
    sourceRowsAreResidualReadinessEvidenceNotProduct: true,
    sourceTextIngested: false,
    toleranceChangeAllowedNow: false,
  };
}

const completeOpenWebInputPacket =
  {
    basis: "lab_iso_10140_717_2",
    carrierDepthMm: 300,
    carrierSpacingMm: 600,
    dynamicStiffnessMNm3: 15,
    loadBasisKgM2: 120,
    locatorMetadataFields: GATE_AW_REQUIRED_PACKET_LOCATOR_METADATA_FIELDS,
    lowerSupportClass: "furred_channels",
    rightsPosture: "rights_safe_metadata_only",
    sourceKind: "source_owned_open_web_formula_input_packet",
    sourceOwnedFields: GATE_BF_REQUIRED_OPEN_WEB_FORMULA_INPUT_OWNER_FIELDS,
    supportForm: "open_web_or_rolled",
    upperResilientTopology: "floating_screed_or_resilient_mat",
  } satisfies GateBFSteelFloorFormulaOpenWebInputOwnershipPacket;

const ownerFieldsWithout = (
  excludedField: GateBFSteelFloorFormulaOpenWebInputOwnerField,
): readonly GateBFSteelFloorFormulaOpenWebInputOwnerField[] =>
  GATE_BF_REQUIRED_OPEN_WEB_FORMULA_INPUT_OWNER_FIELDS.filter(
    (field) => field !== excludedField,
  );

const openWebInputOwnershipClosureProbeInputs = [
  {
    id: "gate_bf_future_source_owned_open_web_formula_input_packet",
    pairedNegativeClosureContract: gateBEPairedNegativeClosureContract,
    sourceInputPacket: completeOpenWebInputPacket,
  },
  {
    id: "gate_bf_missing_carrier_spacing_owner",
    pairedNegativeClosureContract: gateBEPairedNegativeClosureContract,
    sourceInputPacket: {
      ...completeOpenWebInputPacket,
      sourceOwnedFields: ownerFieldsWithout("carrier_spacing"),
    },
  },
  {
    id: "gate_bf_missing_dynamic_stiffness_value",
    pairedNegativeClosureContract: gateBEPairedNegativeClosureContract,
    sourceInputPacket: {
      ...completeOpenWebInputPacket,
      dynamicStiffnessMNm3: null,
    },
  },
  {
    id: "gate_bf_missing_locator_metadata",
    pairedNegativeClosureContract: gateBEPairedNegativeClosureContract,
    sourceInputPacket: {
      ...completeOpenWebInputPacket,
      locatorMetadataFields:
        GATE_AW_REQUIRED_PACKET_LOCATOR_METADATA_FIELDS.filter(
          (field) => field !== "source_locator",
        ),
    },
  },
  {
    id: "gate_bf_wrong_metric_basis",
    pairedNegativeClosureContract: gateBEPairedNegativeClosureContract,
    sourceInputPacket: {
      ...completeOpenWebInputPacket,
      basis: "field_or_astm_basis",
    },
  },
  {
    id: "gate_bf_wrong_support_form_steel_joist",
    pairedNegativeClosureContract: gateBEPairedNegativeClosureContract,
    sourceInputPacket: {
      ...completeOpenWebInputPacket,
      supportForm: "joist_or_purlin",
    },
  },
  {
    id: "gate_bf_product_catalog_or_inferred_claim",
    pairedNegativeClosureContract: gateBEPairedNegativeClosureContract,
    sourceInputPacket: {
      ...completeOpenWebInputPacket,
      sourceKind: "product_catalog_or_design_guide_input_claim",
    },
  },
  {
    id: "gate_bf_rights_blocked_input_packet",
    pairedNegativeClosureContract: gateBEPairedNegativeClosureContract,
    sourceInputPacket: {
      ...completeOpenWebInputPacket,
      rightsPosture: "rights_blocked_do_not_ingest",
    },
  },
  {
    id: "gate_bf_missing_upper_resilient_topology",
    pairedNegativeClosureContract: gateBEPairedNegativeClosureContract,
    sourceInputPacket: {
      ...completeOpenWebInputPacket,
      upperResilientTopology: "not_source_owned",
    },
  },
] satisfies readonly GateBFSteelFloorFormulaOpenWebInputOwnershipClosureInput[];

export function buildGateBFSteelFloorFormulaSameStackIsoDeltaLwOpenWebInputOwnershipClosureContract():
  GateBFSteelFloorFormulaSameStackIsoDeltaLwOpenWebInputOwnershipClosureContract {
  const openWebInputOwnershipClosureProbeRows =
    openWebInputOwnershipClosureProbeInputs.map(
      classifyGateBFSteelFloorFormulaSameStackIsoDeltaLwOpenWebInputOwnershipClosure,
    );
  const acceptedOpenWebInputOwnershipClosureProbeIds =
    openWebInputOwnershipClosureProbeRows
      .filter((row) => row.closureEvidenceAccepted)
      .map((row) => row.id);
  const rejectedOpenWebInputOwnershipClosureProbeIds =
    openWebInputOwnershipClosureProbeRows
      .filter((row) => !row.closureEvidenceAccepted)
      .map((row) => row.id);
  const acceptedSourceOwnedOpenWebFormulaInputPacketCount =
    openWebInputOwnershipClosureProbeRows.reduce(
      (sum, row) => sum + row.openWebFormulaInputOwnershipContribution,
      0,
    );
  const remainingOpenWebFormulaInputOwnershipPacketShortfall = Math.max(
    0,
    GATE_BF_REQUIRED_SOURCE_OWNED_OPEN_WEB_FORMULA_INPUT_PACKET_COUNT -
      acceptedSourceOwnedOpenWebFormulaInputPacketCount,
  );

  return {
    acceptedOpenWebInputOwnershipClosureProbeIds,
    exactSourceOverridePolicy: {
      exactMeasuredRowsRemainPrecedence: true,
      fullAssemblyExactMatchRequired: true,
      openWebInputOwnershipClosureRowsAreNotExactRows: true,
    },
    fieldAndBuildingBasisSeparation: {
      fieldOrAstmBasisCanCloseLabOpenWebInputOwnership: false,
      labDeltaLwCanAliasFieldMetrics: false,
    },
    landedGate:
      "gate_bf_steel_floor_formula_same_stack_iso_delta_lw_open_web_input_ownership_closure_plan",
    openWebInputOwnershipClosurePolicy: {
      acceptedClosureEvidenceCanMoveRuntimeNow: false,
      acceptedClosureEvidenceCanMoveToleranceNow: false,
      acceptedClosureEvidenceUse: "residual_policy_readiness_evidence_only",
      broadSourceCrawlAllowed: false,
      exactOverrideAllowedNow: false,
      gateBESelectedOpenWebInputOwnershipLaneOnly: true,
      isoLabBasisOwnerRequired: true,
      openWebSupportFormRequired: true,
      rejectedOrRemainingFollowupLanesRemainBlocked: true,
      rightsSafeLocatorMetadataRequired: true,
      runtimeRetuneAllowedNow: false,
      sourceDocumentCopyAllowed: false,
      sourceOwnedFormulaInputProofRequired: true,
      sourceTextIngestionAllowed: false,
    },
    openWebInputOwnershipClosureProbeRows,
    openWebInputOwnershipClosureSurface: {
      acceptedGateBEAdditionalPairedNegativeBoundaryCount:
        gateBEPairedNegativeClosureContract.pairedNegativeReadiness
          .acceptedAdditionalPairedNegativeBoundaryCount,
      metricBasis: "lab_iso_10140_717_2",
      pairedNegativeClosureComplete: true,
      requiredCitationLocatorMetadataFields:
        GATE_AW_REQUIRED_PACKET_LOCATOR_METADATA_FIELDS,
      requiredOpenWebFormulaInputOwnerFields:
        GATE_BF_REQUIRED_OPEN_WEB_FORMULA_INPUT_OWNER_FIELDS,
      requiredOpenWebFormulaInputPacketCount:
        GATE_BF_REQUIRED_SOURCE_OWNED_OPEN_WEB_FORMULA_INPUT_PACKET_COUNT,
      requiredOpenWebFormulaInputValueFields:
        GATE_BF_REQUIRED_OPEN_WEB_FORMULA_INPUT_VALUE_FIELDS,
      selectedGateBENextLaneId: "open_web_formula_input_ownership_closure",
      selectedOwner: "source_owned_open_web_formula_input_packet",
      selectedTermId: "open_web_formula_inputs_not_source_owned",
    },
    openWebInputOwnershipReadiness: {
      acceptedSourceOwnedOpenWebFormulaInputPacketCount,
      openWebFormulaInputOwnershipComplete:
        remainingOpenWebFormulaInputOwnershipPacketShortfall === 0,
      remainingOpenWebFormulaInputOwnershipPacketShortfall,
      selectedNextClosureLaneId: "field_building_basis_owner_closure",
    },
    previousLandedGate:
      "gate_be_steel_floor_formula_same_stack_iso_delta_lw_paired_negative_closure_plan",
    rejectedOpenWebInputOwnershipClosureProbeIds,
    remainingFollowupClosureLaneIds: ["field_building_basis_owner_closure"],
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
      GATE_BF_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_OPEN_WEB_INPUT_OWNERSHIP_CLOSURE_SELECTED_NEXT_ACTION,
    selectedNextFile:
      GATE_BF_STEEL_FLOOR_FORMULA_SAME_STACK_ISO_DELTA_LW_OPEN_WEB_INPUT_OWNERSHIP_CLOSURE_SELECTED_NEXT_FILE,
    selectedPairedNegativeClosureInput: gateBEPairedNegativeClosureContract,
    selectionStatus:
      "gate_bf_same_stack_iso_delta_lw_open_web_input_ownership_closure_landed_no_runtime_selected_field_building_basis_owner_gate_bg",
  };
}
