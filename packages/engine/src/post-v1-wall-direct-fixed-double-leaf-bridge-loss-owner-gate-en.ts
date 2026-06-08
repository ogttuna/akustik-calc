import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";

import { buildGateRDoubleLeafFramedBridgeSolverContract } from "./dynamic-calculator-double-leaf-framed-bridge-solver-contract";
import {
  POST_V1_GATE_EM_NO_RUNTIME_COUNTERS,
  POST_V1_GATE_EM_SELECTED_CANDIDATE_ID,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EM_LANDED_GATE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EM_SELECTED_NEXT_ACTION,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EM_SELECTED_NEXT_FILE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EM_SELECTION_STATUS,
  buildPostV1GateEMDirectFixedEvidence
} from "./post-v1-next-numeric-coverage-gap-gate-em";

export const POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_OWNER_GATE_EN_LANDED_GATE =
  "post_v1_wall_direct_fixed_double_leaf_bridge_loss_owner_gate_en_plan" as const;

export const POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_OWNER_GATE_EN_SELECTION_STATUS =
  "post_v1_wall_direct_fixed_double_leaf_bridge_loss_owner_gate_en_landed_no_runtime_selected_wall_direct_fixed_double_leaf_bridge_loss_runtime_gate_eo" as const;

export const POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_OWNER_GATE_EN_SELECTED_NEXT_ACTION =
  "post_v1_wall_direct_fixed_double_leaf_bridge_loss_runtime_gate_eo_plan" as const;

export const POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_OWNER_GATE_EN_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-wall-direct-fixed-double-leaf-bridge-loss-runtime-gate-eo-contract.test.ts" as const;

export const POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_OWNER_GATE_EN_SELECTED_NEXT_LABEL =
  "post-V1 wall direct-fixed double-leaf bridge-loss runtime Gate EO" as const;

export const POST_V1_GATE_EN_OWNER_ID =
  "wall.direct_fixed_double_leaf.bridge_loss_owner" as const;

export const POST_V1_GATE_EN_PLAN_DOC_PATH =
  "docs/calculator/POST_V1_GATE_EM_EN_WALL_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_OWNER_PLAN_2026-06-07.md" as const;

export const POST_V1_GATE_EN_TARGET_OUTPUTS = [
  "Rw",
  "STC",
  "C",
  "Ctr"
] as const satisfies readonly RequestedOutputId[];

export type PostV1GateENRequiredOwnerField =
  | "ASTM_E413_STC_adapter_boundary"
  | "ISO717_1_Rw_adapter"
  | "cavity1DepthMm"
  | "connectionType=direct_fix"
  | "directFixedBridgeLossOwner"
  | "directFixedEquivalentCoupledMassOwner"
  | "directFixedNoMassAirMassBoostBoundary"
  | "sideALeafGroup"
  | "sideALeafMassKgM2"
  | "sideBLeafGroup"
  | "sideBLeafMassKgM2"
  | "supportSpacingMm"
  | "supportTopology=direct_fixed";

export type PostV1GateENRejectedBoundary = {
  readonly boundary:
    | "field_building_metric_alias_rejected"
    | "gate_s_non_direct_fixed_stays_on_existing_owner"
    | "missing_route_physical_inputs_need_input"
    | "multicavity_or_triple_leaf_family_boundary"
    | "source_row_catalog_not_required";
  readonly id: string;
  readonly reason: string;
};

export type PostV1GateENOwnerLedger = {
  readonly acceptedFormerGateRNegativeReason: string;
  readonly formulaCorridorId: "wall.direct_fixed_double_leaf.equivalent_coupled_mass_bridge_loss_owner";
  readonly ownerId: typeof POST_V1_GATE_EN_OWNER_ID;
  readonly ownerStatus: "accepted_no_runtime";
  readonly requiredOwnerFields: readonly PostV1GateENRequiredOwnerField[];
  readonly runtimePromotionAllowed: false;
  readonly sourceRowsRequiredForOwner: false;
  readonly targetOutputs: typeof POST_V1_GATE_EN_TARGET_OUTPUTS;
};

export type PostV1GateENRuntimeReadinessEvidence = {
  readonly directFixedBridgeClass: string;
  readonly directFixedCurrentReadinessStatus: string;
  readonly directFixedInputCompletenessStatus: string;
  readonly directFixedMissingPhysicalInputs: readonly string[];
  readonly directFixedNegativeBoundaryReasons: readonly string[];
  readonly independentCurrentReadinessStatus: string;
  readonly independentRemainsExistingGateSFamily: string | null | undefined;
  readonly ownerLedgerFormulaCorridor: PostV1GateENOwnerLedger["formulaCorridorId"];
  readonly runtimePromotionAllowedNow: false;
};

export const POST_V1_GATE_EN_REQUIRED_OWNER_FIELDS = [
  "sideALeafGroup",
  "sideBLeafGroup",
  "sideALeafMassKgM2",
  "sideBLeafMassKgM2",
  "cavity1DepthMm",
  "supportTopology=direct_fixed",
  "connectionType=direct_fix",
  "supportSpacingMm",
  "directFixedEquivalentCoupledMassOwner",
  "directFixedBridgeLossOwner",
  "directFixedNoMassAirMassBoostBoundary",
  "ISO717_1_Rw_adapter",
  "ASTM_E413_STC_adapter_boundary"
] as const satisfies readonly PostV1GateENRequiredOwnerField[];

export const POST_V1_GATE_EN_OWNER_LEDGER = {
  acceptedFormerGateRNegativeReason:
    "direct_fixed_bridge_behaves_like_mechanically_coupled_single_partition_until_a_dedicated_bridge_loss_model_is_owned",
  formulaCorridorId: "wall.direct_fixed_double_leaf.equivalent_coupled_mass_bridge_loss_owner",
  ownerId: POST_V1_GATE_EN_OWNER_ID,
  ownerStatus: "accepted_no_runtime",
  requiredOwnerFields: POST_V1_GATE_EN_REQUIRED_OWNER_FIELDS,
  runtimePromotionAllowed: false,
  sourceRowsRequiredForOwner: false,
  targetOutputs: POST_V1_GATE_EN_TARGET_OUTPUTS
} as const satisfies PostV1GateENOwnerLedger;

export const POST_V1_GATE_EN_REJECTED_BOUNDARIES = [
  {
    boundary: "gate_s_non_direct_fixed_stays_on_existing_owner",
    id: "independent_twin_shared_and_resilient_double_leaf_stay_gate_s",
    reason:
      "The new owner is only for direct-fixed bridge loss; independent, twin-frame, shared-stud, and resilient systems stay on the existing Gate S corridor."
  },
  {
    boundary: "missing_route_physical_inputs_need_input",
    id: "missing_leaf_group_cavity_support_or_spacing_stays_needs_input",
    reason:
      "Direct-fixed owner selection still requires explicit leaf groups, cavity depth, direct-fixed support topology, connection type, and spacing."
  },
  {
    boundary: "multicavity_or_triple_leaf_family_boundary",
    id: "multicavity_and_triple_leaf_do_not_collapse_to_direct_fixed_double_leaf",
    reason:
      "Multicavity and triple-leaf routes keep their separate topology owners rather than being forced into the direct-fixed two-leaf owner."
  },
  {
    boundary: "field_building_metric_alias_rejected",
    id: "lab_rw_stc_c_ctr_do_not_alias_to_field_or_building_outputs",
    reason:
      "Gate EN owns only lab Rw/STC/C/Ctr readiness; R'w, Dn,w, and DnT,w require explicit field/building adapters."
  },
  {
    boundary: "source_row_catalog_not_required",
    id: "finite_direct_fixed_source_row_crawl_not_selected",
    reason:
      "No finite source-row catalog is needed for this owner proof; source rows can later calibrate or hold out the selected owner."
  }
] as const satisfies readonly PostV1GateENRejectedBoundary[];

export const POST_V1_GATE_EN_COUNTERS = {
  acceptedOwnerLedgers: 1,
  boundaryLedgersPinned: POST_V1_GATE_EN_REJECTED_BOUNDARIES.length,
  frontendImplementationFilesTouched: 0,
  newCalculableLayerTemplates: 0,
  newCalculableRequestShapes: 0,
  runtimeBasisPromotions: 0,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 0,
  sourceRowsImported: 0
} as const;

const DIRECT_FIXED_LAYERS = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "air_gap", thicknessMm: 45 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
] as const satisfies readonly LayerInput[];

const DIRECT_FIXED_CONTEXT = {
  connectionType: "direct_fix",
  contextMode: "element_lab",
  studSpacingMm: 400,
  wallTopology: {
    cavity1AbsorptionClass: "none",
    cavity1DepthMm: 45,
    cavity1FillCoverage: "empty",
    cavity1LayerIndices: [1],
    sideALeafLayerIndices: [0],
    sideBLeafLayerIndices: [2],
    supportTopology: "direct_fixed",
    topologyMode: "double_leaf_framed"
  }
} as const satisfies AirborneContext;

const INDEPENDENT_CONTEXT = {
  contextMode: "element_lab",
  sharedTrack: "independent",
  studSpacingMm: 600,
  wallTopology: {
    cavity1AbsorptionClass: "porous_absorptive",
    cavity1DepthMm: 90,
    cavity1FillCoverage: "full",
    cavity1LayerIndices: [1],
    sideALeafLayerIndices: [0],
    sideBLeafLayerIndices: [2],
    supportTopology: "independent_frames",
    topologyMode: "double_leaf_framed"
  }
} as const satisfies AirborneContext;

const INDEPENDENT_LAYERS = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 90 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
] as const satisfies readonly LayerInput[];

export type PostV1GateENSummary = {
  readonly counters: typeof POST_V1_GATE_EN_COUNTERS;
  readonly landedGate:
    typeof POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_OWNER_GATE_EN_LANDED_GATE;
  readonly noRuntimeValueMovement: true;
  readonly ownerLedger: typeof POST_V1_GATE_EN_OWNER_LEDGER;
  readonly ownerId: typeof POST_V1_GATE_EN_OWNER_ID;
  readonly planDocPath: typeof POST_V1_GATE_EN_PLAN_DOC_PATH;
  readonly previousGateEM: {
    readonly counters: typeof POST_V1_GATE_EM_NO_RUNTIME_COUNTERS;
    readonly landedGate: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EM_LANDED_GATE;
    readonly selectedCandidateId: typeof POST_V1_GATE_EM_SELECTED_CANDIDATE_ID;
    readonly selectedNextAction: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EM_SELECTED_NEXT_ACTION;
    readonly selectedNextFile: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EM_SELECTED_NEXT_FILE;
    readonly selectionStatus: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EM_SELECTION_STATUS;
  };
  readonly rejectedBoundaries: typeof POST_V1_GATE_EN_REJECTED_BOUNDARIES;
  readonly runtimeReadinessEvidence: PostV1GateENRuntimeReadinessEvidence;
  readonly selectedNextAction:
    typeof POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_OWNER_GATE_EN_SELECTED_NEXT_ACTION;
  readonly selectedNextFile:
    typeof POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_OWNER_GATE_EN_SELECTED_NEXT_FILE;
  readonly selectedNextLabel:
    typeof POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_OWNER_GATE_EN_SELECTED_NEXT_LABEL;
  readonly selectionStatus:
    typeof POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_OWNER_GATE_EN_SELECTION_STATUS;
  readonly targetOutputs: typeof POST_V1_GATE_EN_TARGET_OUTPUTS;
};

export function buildPostV1GateENRuntimeReadinessEvidence(): PostV1GateENRuntimeReadinessEvidence {
  const directFixed = buildGateRDoubleLeafFramedBridgeSolverContract({
    airborneContext: DIRECT_FIXED_CONTEXT,
    layers: DIRECT_FIXED_LAYERS,
    targetOutputs: POST_V1_GATE_EN_TARGET_OUTPUTS
  });
  const independent = buildGateRDoubleLeafFramedBridgeSolverContract({
    airborneContext: INDEPENDENT_CONTEXT,
    layers: INDEPENDENT_LAYERS,
    targetOutputs: POST_V1_GATE_EN_TARGET_OUTPUTS
  });

  return {
    directFixedBridgeClass: directFixed.bridgeClass,
    directFixedCurrentReadinessStatus: directFixed.readinessStatus,
    directFixedInputCompletenessStatus: directFixed.inputContract.inputCompleteness.status,
    directFixedMissingPhysicalInputs: [...directFixed.missingPhysicalInputs],
    directFixedNegativeBoundaryReasons: [...directFixed.negativeBoundaryReasons],
    independentCurrentReadinessStatus: independent.readinessStatus,
    independentRemainsExistingGateSFamily: independent.candidateFamily,
    ownerLedgerFormulaCorridor: POST_V1_GATE_EN_OWNER_LEDGER.formulaCorridorId,
    runtimePromotionAllowedNow: false
  };
}

export function summarizePostV1WallDirectFixedDoubleLeafBridgeLossOwnerGateEN():
  PostV1GateENSummary {
  if (
    POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EM_SELECTED_NEXT_ACTION !==
    POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_OWNER_GATE_EN_LANDED_GATE
  ) {
    throw new Error("Gate EN can only land after Gate EM selects the direct-fixed bridge-loss owner proof.");
  }

  const gateEMEvidence = buildPostV1GateEMDirectFixedEvidence();
  if (
    gateEMEvidence.bridgeClass !== "direct_fixed_bridge" ||
    gateEMEvidence.readinessStatus !== "negative_boundary" ||
    !gateEMEvidence.negativeBoundaryReasons.includes(POST_V1_GATE_EN_OWNER_LEDGER.acceptedFormerGateRNegativeReason)
  ) {
    throw new Error("Gate EN expected Gate EM to prove the direct-fixed negative boundary before owner acceptance.");
  }

  return {
    counters: POST_V1_GATE_EN_COUNTERS,
    landedGate: POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_OWNER_GATE_EN_LANDED_GATE,
    noRuntimeValueMovement: true,
    ownerLedger: POST_V1_GATE_EN_OWNER_LEDGER,
    ownerId: POST_V1_GATE_EN_OWNER_ID,
    planDocPath: POST_V1_GATE_EN_PLAN_DOC_PATH,
    previousGateEM: {
      counters: POST_V1_GATE_EM_NO_RUNTIME_COUNTERS,
      landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EM_LANDED_GATE,
      selectedCandidateId: POST_V1_GATE_EM_SELECTED_CANDIDATE_ID,
      selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EM_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EM_SELECTED_NEXT_FILE,
      selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EM_SELECTION_STATUS
    },
    rejectedBoundaries: POST_V1_GATE_EN_REJECTED_BOUNDARIES,
    runtimeReadinessEvidence: buildPostV1GateENRuntimeReadinessEvidence(),
    selectedNextAction: POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_OWNER_GATE_EN_SELECTED_NEXT_ACTION,
    selectedNextFile: POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_OWNER_GATE_EN_SELECTED_NEXT_FILE,
    selectedNextLabel: POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_OWNER_GATE_EN_SELECTED_NEXT_LABEL,
    selectionStatus: POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_OWNER_GATE_EN_SELECTION_STATUS,
    targetOutputs: POST_V1_GATE_EN_TARGET_OUTPUTS
  };
}
