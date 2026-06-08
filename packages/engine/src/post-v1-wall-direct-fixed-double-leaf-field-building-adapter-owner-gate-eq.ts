import type { RequestedOutputId } from "@dynecho/shared";

import {
  GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
  GATE_AR_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID
} from "./dynamic-airborne-gate-ar-airborne-building-prediction-runtime-corridor";
import {
  GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
  GATE_I_AIRBORNE_FIELD_CONTEXT_SELECTED_CANDIDATE_ID
} from "./dynamic-airborne-gate-i-airborne-field-context";
import {
  GATE_EO_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_RUNTIME_METHOD,
  GATE_EO_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_SELECTED_CANDIDATE_ID
} from "./dynamic-airborne-gate-s-double-leaf-framed";
import {
  POST_V1_GATE_EP_NO_RUNTIME_COUNTERS,
  POST_V1_GATE_EP_PLAN_DOC_PATH,
  POST_V1_GATE_EP_ROUTE_METHOD_ASSERTIONS,
  POST_V1_GATE_EP_SELECTED_CANDIDATE_ID,
  POST_V1_GATE_EP_SELECTED_TARGET_OUTPUTS,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EP_LANDED_GATE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EP_SELECTED_NEXT_ACTION,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EP_SELECTED_NEXT_FILE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EP_SELECTION_STATUS,
  buildPostV1GateEPCurrentRouteEvidence,
  summarizePostV1GateEPNumericCoverageGap
} from "./post-v1-next-numeric-coverage-gap-gate-ep";

export const POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_OWNER_GATE_EQ_LANDED_GATE =
  "post_v1_wall_direct_fixed_double_leaf_field_building_adapter_owner_gate_eq_plan" as const;

export const POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_OWNER_GATE_EQ_SELECTION_STATUS =
  "post_v1_wall_direct_fixed_double_leaf_field_building_adapter_owner_gate_eq_landed_no_runtime_selected_wall_direct_fixed_double_leaf_field_building_adapter_runtime_gate_er" as const;

export const POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_OWNER_GATE_EQ_SELECTED_NEXT_ACTION =
  "post_v1_wall_direct_fixed_double_leaf_field_building_adapter_runtime_gate_er_plan" as const;

export const POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_OWNER_GATE_EQ_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-wall-direct-fixed-double-leaf-field-building-adapter-runtime-gate-er-contract.test.ts" as const;

export const POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_OWNER_GATE_EQ_SELECTED_NEXT_LABEL =
  "post-V1 wall direct-fixed double-leaf field/building adapter runtime Gate ER" as const;

export const POST_V1_GATE_EQ_FIELD_ADAPTER_OWNER_ID =
  "wall.direct_fixed_double_leaf.field_between_rooms_adapter_owner" as const;

export const POST_V1_GATE_EQ_BUILDING_ADAPTER_OWNER_ID =
  "wall.direct_fixed_double_leaf.building_prediction_adapter_owner" as const;

export const POST_V1_GATE_EQ_PLAN_DOC_PATH =
  "docs/calculator/POST_V1_GATE_EP_EQ_WALL_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_PLAN_2026-06-07.md" as const;

export const POST_V1_GATE_EQ_SELECTED_RUNTIME_PLAN_DOC_PATH =
  "docs/calculator/POST_V1_GATE_EQ_ER_WALL_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_RUNTIME_PLAN_2026-06-08.md" as const;

export const POST_V1_GATE_EQ_TARGET_OUTPUTS = [
  "R'w",
  "Dn,w",
  "DnT,w"
] as const satisfies readonly RequestedOutputId[];

export type PostV1GateEQFieldAdapterOwnerField =
  | "ISO12354_1_direct_separating_element_curve_owner"
  | "ISO12354_1_field_apparent_adapter"
  | "ISO717_1_rating_adapter"
  | "baseCurve=wall.direct_fixed_double_leaf.equivalent_coupled_mass_bridge_loss_owner"
  | "contextMode=field_between_rooms"
  | "fieldMetricAdapter:R'w/Dn,w/DnT,w"
  | "panelHeightMm"
  | "panelWidthMm"
  | "partitionAreaM2_from_panel_dimensions"
  | "receivingRoomRt60S"
  | "receivingRoomVolumeM3";

export type PostV1GateEQBuildingAdapterOwnerField =
  | "ISO12354_1_direct_separating_element_curve_owner"
  | "ISO12354_1_flanking_junction_adapter"
  | "ISO12354_1_room_standardization_adapter"
  | "ISO717_1_rating_adapter"
  | "baseCurve=wall.direct_fixed_double_leaf.equivalent_coupled_mass_bridge_loss_owner"
  | "buildingPredictionOutputBasis"
  | "conservativeFlankingAssumption"
  | "contextMode=building_prediction"
  | "flankingJunctionClass"
  | "junctionCouplingLengthM"
  | "panelHeightMm"
  | "panelWidthMm"
  | "receivingRoomRt60S"
  | "receivingRoomVolumeM3"
  | "sourceRoomVolumeM3";

export type PostV1GateEQAdapterOwnerLedger =
  | {
      readonly adapterRuntimeMethod: typeof GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD;
      readonly adapterSelectedCandidateId: typeof GATE_I_AIRBORNE_FIELD_CONTEXT_SELECTED_CANDIDATE_ID;
      readonly baseCurveRuntimeMethod: typeof GATE_EO_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_RUNTIME_METHOD;
      readonly baseCurveSelectedCandidateId: typeof GATE_EO_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_SELECTED_CANDIDATE_ID;
      readonly ownerId: typeof POST_V1_GATE_EQ_FIELD_ADAPTER_OWNER_ID;
      readonly ownerStatus: "accepted_no_runtime";
      readonly requiredOwnerFields: readonly PostV1GateEQFieldAdapterOwnerField[];
      readonly runtimePromotionAllowed: false;
      readonly sourceRowsRequiredForOwner: false;
      readonly targetOutputs: typeof POST_V1_GATE_EQ_TARGET_OUTPUTS;
    }
  | {
      readonly adapterRuntimeMethod: typeof GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD;
      readonly adapterSelectedCandidateId: typeof GATE_AR_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID;
      readonly baseCurveRuntimeMethod: typeof GATE_EO_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_RUNTIME_METHOD;
      readonly baseCurveSelectedCandidateId: typeof GATE_EO_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_SELECTED_CANDIDATE_ID;
      readonly ownerId: typeof POST_V1_GATE_EQ_BUILDING_ADAPTER_OWNER_ID;
      readonly ownerStatus: "accepted_no_runtime";
      readonly requiredOwnerFields: readonly PostV1GateEQBuildingAdapterOwnerField[];
      readonly runtimePromotionAllowed: false;
      readonly sourceRowsRequiredForOwner: false;
      readonly targetOutputs: typeof POST_V1_GATE_EQ_TARGET_OUTPUTS;
    };

export type PostV1GateEQRejectedBoundary = {
  readonly boundary:
    | "building_runtime_waits_for_gate_er"
    | "lab_metric_alias_rejected"
    | "missing_building_context_stays_blocked"
    | "missing_field_context_stays_needs_input"
    | "missing_support_spacing_stays_needs_input"
    | "multicavity_or_triple_leaf_family_boundary"
    | "non_direct_fixed_families_stay_existing_adapters"
    | "source_row_catalog_not_required";
  readonly id: string;
  readonly reason: string;
};

export const POST_V1_GATE_EQ_FIELD_ADAPTER_REQUIRED_OWNER_FIELDS = [
  "baseCurve=wall.direct_fixed_double_leaf.equivalent_coupled_mass_bridge_loss_owner",
  "contextMode=field_between_rooms",
  "panelWidthMm",
  "panelHeightMm",
  "partitionAreaM2_from_panel_dimensions",
  "receivingRoomVolumeM3",
  "receivingRoomRt60S",
  "fieldMetricAdapter:R'w/Dn,w/DnT,w",
  "ISO12354_1_direct_separating_element_curve_owner",
  "ISO12354_1_field_apparent_adapter",
  "ISO717_1_rating_adapter"
] as const satisfies readonly PostV1GateEQFieldAdapterOwnerField[];

export const POST_V1_GATE_EQ_BUILDING_ADAPTER_REQUIRED_OWNER_FIELDS = [
  "baseCurve=wall.direct_fixed_double_leaf.equivalent_coupled_mass_bridge_loss_owner",
  "contextMode=building_prediction",
  "panelWidthMm",
  "panelHeightMm",
  "sourceRoomVolumeM3",
  "receivingRoomVolumeM3",
  "receivingRoomRt60S",
  "flankingJunctionClass",
  "conservativeFlankingAssumption",
  "buildingPredictionOutputBasis",
  "junctionCouplingLengthM",
  "ISO12354_1_direct_separating_element_curve_owner",
  "ISO12354_1_flanking_junction_adapter",
  "ISO12354_1_room_standardization_adapter",
  "ISO717_1_rating_adapter"
] as const satisfies readonly PostV1GateEQBuildingAdapterOwnerField[];

export const POST_V1_GATE_EQ_FIELD_ADAPTER_OWNER_LEDGER = {
  adapterRuntimeMethod: GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
  adapterSelectedCandidateId: GATE_I_AIRBORNE_FIELD_CONTEXT_SELECTED_CANDIDATE_ID,
  baseCurveRuntimeMethod: GATE_EO_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_RUNTIME_METHOD,
  baseCurveSelectedCandidateId: GATE_EO_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_SELECTED_CANDIDATE_ID,
  ownerId: POST_V1_GATE_EQ_FIELD_ADAPTER_OWNER_ID,
  ownerStatus: "accepted_no_runtime",
  requiredOwnerFields: POST_V1_GATE_EQ_FIELD_ADAPTER_REQUIRED_OWNER_FIELDS,
  runtimePromotionAllowed: false,
  sourceRowsRequiredForOwner: false,
  targetOutputs: POST_V1_GATE_EQ_TARGET_OUTPUTS
} as const satisfies PostV1GateEQAdapterOwnerLedger;

export const POST_V1_GATE_EQ_BUILDING_ADAPTER_OWNER_LEDGER = {
  adapterRuntimeMethod: GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
  adapterSelectedCandidateId: GATE_AR_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID,
  baseCurveRuntimeMethod: GATE_EO_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_RUNTIME_METHOD,
  baseCurveSelectedCandidateId: GATE_EO_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_SELECTED_CANDIDATE_ID,
  ownerId: POST_V1_GATE_EQ_BUILDING_ADAPTER_OWNER_ID,
  ownerStatus: "accepted_no_runtime",
  requiredOwnerFields: POST_V1_GATE_EQ_BUILDING_ADAPTER_REQUIRED_OWNER_FIELDS,
  runtimePromotionAllowed: false,
  sourceRowsRequiredForOwner: false,
  targetOutputs: POST_V1_GATE_EQ_TARGET_OUTPUTS
} as const satisfies PostV1GateEQAdapterOwnerLedger;

export const POST_V1_GATE_EQ_ADAPTER_OWNER_LEDGERS = [
  POST_V1_GATE_EQ_FIELD_ADAPTER_OWNER_LEDGER,
  POST_V1_GATE_EQ_BUILDING_ADAPTER_OWNER_LEDGER
] as const satisfies readonly PostV1GateEQAdapterOwnerLedger[];

export const POST_V1_GATE_EQ_REJECTED_BOUNDARIES = [
  {
    boundary: "lab_metric_alias_rejected",
    id: "lab_rw_stc_c_ctr_do_not_publish_field_or_building_metrics",
    reason:
      "The Gate EO lab curve can be the direct separating-element base, but lab Rw/STC/C/Ctr are not relabelled as R'w, Dn,w, or DnT,w."
  },
  {
    boundary: "missing_field_context_stays_needs_input",
    id: "missing_receiving_room_rt60_stays_needs_input",
    reason:
      "The field adapter owns only explicit field_between_rooms context with partition area, receiving-room volume, and receiving-room RT60."
  },
  {
    boundary: "missing_building_context_stays_blocked",
    id: "missing_building_prediction_flanking_context_stays_blocked",
    reason:
      "The building adapter owns only explicit building_prediction context with source/receiving volumes, RT60, flanking class, conservative assumption, output basis, and coupling length."
  },
  {
    boundary: "missing_support_spacing_stays_needs_input",
    id: "missing_direct_fixed_support_spacing_stays_gate_eo_needs_input",
    reason:
      "The field/building adapters require the Gate EO direct curve first; missing supportSpacingMm still blocks that base curve as needs_input."
  },
  {
    boundary: "non_direct_fixed_families_stay_existing_adapters",
    id: "independent_resilient_shared_and_twin_frame_routes_stay_gate_s_i_ar",
    reason:
      "Non-direct-fixed double-leaf/framed systems already use Gate S plus Gate I/AR when complete physical inputs are present."
  },
  {
    boundary: "multicavity_or_triple_leaf_family_boundary",
    id: "multicavity_and_triple_leaf_routes_do_not_collapse_to_direct_fixed_double_leaf",
    reason:
      "Gate EQ is limited to the visible two-leaf, one-cavity direct-fixed subset; multicavity and triple-leaf routes keep their own topology owners."
  },
  {
    boundary: "building_runtime_waits_for_gate_er",
    id: "complete_building_prediction_requests_remain_unsupported_until_runtime_gate",
    reason:
      "Gate EQ proves adapter ownership only; complete building_prediction requests still wait for Gate ER before runtime values move."
  },
  {
    boundary: "source_row_catalog_not_required",
    id: "finite_field_building_source_row_crawl_not_selected",
    reason:
      "No finite field/building source-row catalog is needed for this owner proof; source rows can later calibrate or hold out the selected adapters."
  }
] as const satisfies readonly PostV1GateEQRejectedBoundary[];

export const POST_V1_GATE_EQ_COUNTERS = {
  acceptedAdapterOwnerLedgers: POST_V1_GATE_EQ_ADAPTER_OWNER_LEDGERS.length,
  boundaryLedgersPinned: POST_V1_GATE_EQ_REJECTED_BOUNDARIES.length,
  estimatedNextNewCalculableLayerTemplates: 1,
  estimatedNextNewCalculableRequestShapes: 3,
  estimatedNextRuntimeCorrectedLayerTemplates: 1,
  estimatedNextRuntimeCorrectedRequestShapes: 3,
  frontendImplementationFilesTouched: 0,
  newCalculableLayerTemplates: 0,
  newCalculableRequestShapes: 0,
  runtimeBasisPromotions: 0,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 0,
  sourceRowsImported: 0
} as const;

export type PostV1GateEQOwnerReadinessEvidence = {
  readonly buildingAdapterRuntimeMethodOwner: typeof GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD;
  readonly buildingCurrentBasisMethod: string | null | undefined;
  readonly buildingCurrentSelectedCandidateId: string | undefined;
  readonly buildingCurrentSupportedOutputs: readonly RequestedOutputId[];
  readonly buildingCurrentUnsupportedOutputs: readonly RequestedOutputId[];
  readonly buildingRuntimePromotionAllowedNow: false;
  readonly fieldAdapterRuntimeMethodOwner: typeof GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD;
  readonly fieldCurrentBasisMethod: string | null | undefined;
  readonly fieldCurrentMetrics: {
    readonly Dnw: number | null | undefined;
    readonly DnTw: number | null | undefined;
    readonly RwPrime: number | null | undefined;
  };
  readonly fieldCurrentSelectedCandidateId: string | undefined;
  readonly fieldCurrentSupportedOutputs: readonly RequestedOutputId[];
  readonly fieldCurrentUnsupportedOutputs: readonly RequestedOutputId[];
  readonly fieldRuntimePromotionAllowedNow: false;
  readonly labBaseCurveBasisMethod: string | null | undefined;
  readonly labBaseCurveMetrics: {
    readonly C: number | null | undefined;
    readonly Ctr: number | null | undefined;
    readonly Rw: number | null | undefined;
    readonly STC: number | null | undefined;
  };
  readonly labBaseCurveSelectedCandidateId: string | undefined;
  readonly missingFieldRt60BasisMethod: string | null | undefined;
  readonly missingFieldRt60MissingPhysicalInputs: readonly string[];
  readonly runtimePromotionAllowedNow: false;
};

export type PostV1GateEQSummary = {
  readonly adapterOwnerLedgers: typeof POST_V1_GATE_EQ_ADAPTER_OWNER_LEDGERS;
  readonly counters: typeof POST_V1_GATE_EQ_COUNTERS;
  readonly landedGate:
    typeof POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_OWNER_GATE_EQ_LANDED_GATE;
  readonly noRuntimeValueMovement: true;
  readonly ownerReadinessEvidence: PostV1GateEQOwnerReadinessEvidence;
  readonly planDocPath: typeof POST_V1_GATE_EQ_PLAN_DOC_PATH;
  readonly previousGateEP: {
    readonly counters: typeof POST_V1_GATE_EP_NO_RUNTIME_COUNTERS;
    readonly landedGate: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EP_LANDED_GATE;
    readonly selectedCandidateId: typeof POST_V1_GATE_EP_SELECTED_CANDIDATE_ID;
    readonly selectedNextAction: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EP_SELECTED_NEXT_ACTION;
    readonly selectedNextFile: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EP_SELECTED_NEXT_FILE;
    readonly selectionStatus: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EP_SELECTION_STATUS;
  };
  readonly rejectedBoundaries: typeof POST_V1_GATE_EQ_REJECTED_BOUNDARIES;
  readonly selectedNextAction:
    typeof POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_OWNER_GATE_EQ_SELECTED_NEXT_ACTION;
  readonly selectedNextFile:
    typeof POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_OWNER_GATE_EQ_SELECTED_NEXT_FILE;
  readonly selectedNextLabel:
    typeof POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_OWNER_GATE_EQ_SELECTED_NEXT_LABEL;
  readonly selectedRuntimePlanDocPath: typeof POST_V1_GATE_EQ_SELECTED_RUNTIME_PLAN_DOC_PATH;
  readonly selectionStatus:
    typeof POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_OWNER_GATE_EQ_SELECTION_STATUS;
  readonly targetOutputs: typeof POST_V1_GATE_EQ_TARGET_OUTPUTS;
};

export function buildPostV1GateEQOwnerReadinessEvidence(): PostV1GateEQOwnerReadinessEvidence {
  const evidence = buildPostV1GateEPCurrentRouteEvidence();

  return {
    buildingAdapterRuntimeMethodOwner: GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
    buildingCurrentBasisMethod: evidence.buildingBasisMethod,
    buildingCurrentSelectedCandidateId: evidence.buildingSelectedCandidateId,
    buildingCurrentSupportedOutputs: evidence.buildingSupportedOutputs,
    buildingCurrentUnsupportedOutputs: evidence.buildingUnsupportedOutputs,
    buildingRuntimePromotionAllowedNow: false,
    fieldAdapterRuntimeMethodOwner: GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
    fieldCurrentBasisMethod: evidence.fieldBasisMethod,
    fieldCurrentMetrics: evidence.fieldMetrics,
    fieldCurrentSelectedCandidateId: evidence.fieldSelectedCandidateId,
    fieldCurrentSupportedOutputs: evidence.fieldSupportedOutputs,
    fieldCurrentUnsupportedOutputs: evidence.fieldUnsupportedOutputs,
    fieldRuntimePromotionAllowedNow: false,
    labBaseCurveBasisMethod: evidence.labBasisMethod,
    labBaseCurveMetrics: evidence.labMetrics,
    labBaseCurveSelectedCandidateId: evidence.labSelectedCandidateId,
    missingFieldRt60BasisMethod: evidence.missingFieldRt60BasisMethod,
    missingFieldRt60MissingPhysicalInputs: evidence.missingFieldRt60MissingPhysicalInputs,
    runtimePromotionAllowedNow: false
  };
}

export function summarizePostV1WallDirectFixedDoubleLeafFieldBuildingAdapterOwnerGateEQ():
  PostV1GateEQSummary {
  if (
    POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EP_SELECTED_NEXT_ACTION !==
    POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_OWNER_GATE_EQ_LANDED_GATE
  ) {
    throw new Error("Gate EQ can only land after Gate EP selects the direct-fixed field/building adapter owner proof.");
  }

  const previousGateEP = summarizePostV1GateEPNumericCoverageGap();
  const evidence = buildPostV1GateEQOwnerReadinessEvidence();

  if (
    evidence.labBaseCurveBasisMethod !== GATE_EO_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_RUNTIME_METHOD ||
    evidence.labBaseCurveSelectedCandidateId !== GATE_EO_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_SELECTED_CANDIDATE_ID
  ) {
    throw new Error("Gate EQ requires the Gate EO direct-fixed base curve before accepting field/building adapter ownership.");
  }

  if (
    evidence.fieldCurrentBasisMethod !== POST_V1_GATE_EP_ROUTE_METHOD_ASSERTIONS.fieldCurrentScreeningMethod ||
    evidence.buildingCurrentBasisMethod !== POST_V1_GATE_EP_ROUTE_METHOD_ASSERTIONS.buildingCurrentUnsupportedMethod
  ) {
    throw new Error("Gate EQ expected Gate EP to prove the current field/building adapter gap before owner acceptance.");
  }

  return {
    adapterOwnerLedgers: POST_V1_GATE_EQ_ADAPTER_OWNER_LEDGERS,
    counters: POST_V1_GATE_EQ_COUNTERS,
    landedGate: POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_OWNER_GATE_EQ_LANDED_GATE,
    noRuntimeValueMovement: true,
    ownerReadinessEvidence: evidence,
    planDocPath: POST_V1_GATE_EP_PLAN_DOC_PATH,
    previousGateEP: {
      counters: POST_V1_GATE_EP_NO_RUNTIME_COUNTERS,
      landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EP_LANDED_GATE,
      selectedCandidateId: previousGateEP.selectedCandidateId,
      selectedNextAction: previousGateEP.selectedNextAction,
      selectedNextFile: previousGateEP.selectedNextFile,
      selectionStatus: previousGateEP.selectionStatus
    },
    rejectedBoundaries: POST_V1_GATE_EQ_REJECTED_BOUNDARIES,
    selectedNextAction: POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_OWNER_GATE_EQ_SELECTED_NEXT_ACTION,
    selectedNextFile: POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_OWNER_GATE_EQ_SELECTED_NEXT_FILE,
    selectedNextLabel: POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_OWNER_GATE_EQ_SELECTED_NEXT_LABEL,
    selectedRuntimePlanDocPath: POST_V1_GATE_EQ_SELECTED_RUNTIME_PLAN_DOC_PATH,
    selectionStatus: POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_OWNER_GATE_EQ_SELECTION_STATUS,
    targetOutputs: POST_V1_GATE_EQ_TARGET_OUTPUTS
  };
}

export const POST_V1_GATE_EQ_OWNER_ASSERTIONS = {
  buildingAdapterRuntimeMethodOwner: GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
  buildingCurrentUnsupportedMethod: POST_V1_GATE_EP_ROUTE_METHOD_ASSERTIONS.buildingCurrentUnsupportedMethod,
  buildingCurrentUnsupportedSelectedCandidateId: POST_V1_GATE_EP_ROUTE_METHOD_ASSERTIONS.buildingSelectedCandidateId,
  fieldAdapterRuntimeMethodOwner: GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
  fieldCurrentScreeningCandidateId: POST_V1_GATE_EP_ROUTE_METHOD_ASSERTIONS.fieldCurrentScreeningCandidateId,
  fieldCurrentScreeningMethod: POST_V1_GATE_EP_ROUTE_METHOD_ASSERTIONS.fieldCurrentScreeningMethod,
  fieldExpectedMetrics: POST_V1_GATE_EP_ROUTE_METHOD_ASSERTIONS.fieldExpectedMetrics,
  gateARSelectedCandidateId: GATE_AR_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID,
  gateISelectedCandidateId: GATE_I_AIRBORNE_FIELD_CONTEXT_SELECTED_CANDIDATE_ID,
  labBaseCurveMethod: GATE_EO_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_RUNTIME_METHOD,
  labBaseCurveSelectedCandidateId: GATE_EO_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_SELECTED_CANDIDATE_ID,
  missingFieldRt60CandidateId: POST_V1_GATE_EP_ROUTE_METHOD_ASSERTIONS.missingFieldRt60CandidateId
} as const;
