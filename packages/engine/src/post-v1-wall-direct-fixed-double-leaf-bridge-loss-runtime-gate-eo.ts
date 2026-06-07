import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";

import { calculateAssembly } from "./calculate-assembly";
import {
  GATE_EO_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_RUNTIME_METHOD,
  GATE_EO_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_SELECTED_CANDIDATE_ID
} from "./dynamic-airborne-gate-s-double-leaf-framed";
import {
  GATE_S_DOUBLE_LEAF_FRAMED_BRIDGE_RUNTIME_METHOD,
  GATE_S_DOUBLE_LEAF_FRAMED_BRIDGE_SELECTED_CANDIDATE_ID
} from "./dynamic-airborne-gate-s-double-leaf-framed";
import {
  POST_V1_GATE_EN_COUNTERS,
  POST_V1_GATE_EN_OWNER_ID,
  POST_V1_GATE_EN_OWNER_LEDGER,
  POST_V1_GATE_EN_PLAN_DOC_PATH,
  POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_OWNER_GATE_EN_LANDED_GATE,
  POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_OWNER_GATE_EN_SELECTED_NEXT_ACTION,
  POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_OWNER_GATE_EN_SELECTED_NEXT_FILE,
  POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_OWNER_GATE_EN_SELECTION_STATUS,
  buildPostV1GateENRuntimeReadinessEvidence
} from "./post-v1-wall-direct-fixed-double-leaf-bridge-loss-owner-gate-en";

export const POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_RUNTIME_GATE_EO_LANDED_GATE =
  "post_v1_wall_direct_fixed_double_leaf_bridge_loss_runtime_gate_eo_plan" as const;

export const POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_RUNTIME_GATE_EO_SELECTION_STATUS =
  "post_v1_wall_direct_fixed_double_leaf_bridge_loss_runtime_gate_eo_landed_runtime_selected_next_numeric_coverage_gap_gate_ep" as const;

export const POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_RUNTIME_GATE_EO_SELECTED_NEXT_ACTION =
  "post_v1_next_numeric_coverage_gap_gate_ep_plan" as const;

export const POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_RUNTIME_GATE_EO_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ep-contract.test.ts" as const;

export const POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_RUNTIME_GATE_EO_SELECTED_NEXT_LABEL =
  "post-V1 next numeric coverage gap Gate EP" as const;

export const POST_V1_GATE_EO_PLAN_DOC_PATH =
  "docs/calculator/POST_V1_GATE_EM_EN_WALL_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_OWNER_PLAN_2026-06-07.md" as const;

export const POST_V1_GATE_EO_TARGET_OUTPUTS = [
  "Rw",
  "STC",
  "C",
  "Ctr"
] as const satisfies readonly RequestedOutputId[];

export const POST_V1_GATE_EO_COUNTERS = {
  fieldBuildingRequestShapesWidened: 0,
  frontendImplementationFilesTouched: 0,
  newCalculableLayerTemplates: 0,
  newCalculableRequestShapes: 0,
  runtimeBasisPromotions: 1,
  runtimeCorrectedLayerTemplates: 1,
  runtimeCorrectedRequestShapes: 4,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 4,
  sourceRowsImported: 0
} as const;

const DIRECT_FIXED_EMPTY_STACK = [
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

const DIRECT_FIXED_MISSING_SPACING_CONTEXT = {
  connectionType: "direct_fix",
  contextMode: "element_lab",
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

const DIRECT_FIXED_FIELD_CONTEXT = {
  ...DIRECT_FIXED_CONTEXT,
  contextMode: "field_between_rooms",
  panelHeightMm: 2500,
  panelWidthMm: 3000,
  receivingRoomRt60S: 0.5,
  receivingRoomVolumeM3: 50
} as const satisfies AirborneContext;

const INDEPENDENT_ABSORBED_STACK = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 90 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
] as const satisfies readonly LayerInput[];

const INDEPENDENT_ABSORBED_CONTEXT = {
  airtightness: "good",
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

export type PostV1GateEORuntimeEvidence = {
  readonly directFixedBasisMethod: string | null | undefined;
  readonly directFixedErrorBudgetDb: number | null | undefined;
  readonly directFixedMetrics: {
    readonly C: number | null | undefined;
    readonly Ctr: number | null | undefined;
    readonly Rw: number | null | undefined;
    readonly STC: number | null | undefined;
  };
  readonly directFixedRuntimeValueMovement: boolean | undefined;
  readonly directFixedSelectedCandidateId: string | undefined;
  readonly directFixedSupportedOutputs: readonly RequestedOutputId[];
  readonly directFixedUnsupportedOutputs: readonly RequestedOutputId[];
  readonly fieldRequestBasisMethod: string | null | undefined;
  readonly fieldRequestSelectedCandidateId: string | undefined;
  readonly fieldRequestSupportedOutputs: readonly RequestedOutputId[];
  readonly independentBasisMethod: string | null | undefined;
  readonly independentRw: number | null | undefined;
  readonly independentSelectedCandidateId: string | undefined;
  readonly missingSpacingBasisMethod: string | null | undefined;
  readonly missingSpacingMissingPhysicalInputs: readonly string[];
  readonly missingSpacingSelectedCandidateId: string | undefined;
};

export type PostV1GateEOSummary = {
  readonly counters: typeof POST_V1_GATE_EO_COUNTERS;
  readonly landedGate:
    typeof POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_RUNTIME_GATE_EO_LANDED_GATE;
  readonly ownerId: typeof POST_V1_GATE_EN_OWNER_ID;
  readonly ownerLedger: typeof POST_V1_GATE_EN_OWNER_LEDGER;
  readonly planDocPath: typeof POST_V1_GATE_EO_PLAN_DOC_PATH;
  readonly previousGateEN: {
    readonly counters: typeof POST_V1_GATE_EN_COUNTERS;
    readonly landedGate: typeof POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_OWNER_GATE_EN_LANDED_GATE;
    readonly selectedNextAction: typeof POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_OWNER_GATE_EN_SELECTED_NEXT_ACTION;
    readonly selectedNextFile: typeof POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_OWNER_GATE_EN_SELECTED_NEXT_FILE;
    readonly selectionStatus: typeof POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_OWNER_GATE_EN_SELECTION_STATUS;
  };
  readonly runtimeEvidence: PostV1GateEORuntimeEvidence;
  readonly selectedNextAction:
    typeof POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_RUNTIME_GATE_EO_SELECTED_NEXT_ACTION;
  readonly selectedNextFile:
    typeof POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_RUNTIME_GATE_EO_SELECTED_NEXT_FILE;
  readonly selectedNextLabel:
    typeof POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_RUNTIME_GATE_EO_SELECTED_NEXT_LABEL;
  readonly selectionStatus:
    typeof POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_RUNTIME_GATE_EO_SELECTION_STATUS;
  readonly targetOutputs: typeof POST_V1_GATE_EO_TARGET_OUTPUTS;
};

export function buildPostV1GateEORuntimeEvidence(): PostV1GateEORuntimeEvidence {
  const directFixed = calculateAssembly(DIRECT_FIXED_EMPTY_STACK, {
    airborneContext: DIRECT_FIXED_CONTEXT,
    calculator: "dynamic",
    targetOutputs: POST_V1_GATE_EO_TARGET_OUTPUTS
  });
  const missingSpacing = calculateAssembly(DIRECT_FIXED_EMPTY_STACK, {
    airborneContext: DIRECT_FIXED_MISSING_SPACING_CONTEXT,
    calculator: "dynamic",
    targetOutputs: ["Rw"]
  });
  const fieldRequest = calculateAssembly(DIRECT_FIXED_EMPTY_STACK, {
    airborneContext: DIRECT_FIXED_FIELD_CONTEXT,
    calculator: "dynamic",
    targetOutputs: ["R'w", "DnT,w"]
  });
  const independent = calculateAssembly(INDEPENDENT_ABSORBED_STACK, {
    airborneContext: INDEPENDENT_ABSORBED_CONTEXT,
    calculator: "dynamic",
    targetOutputs: POST_V1_GATE_EO_TARGET_OUTPUTS
  });

  return {
    directFixedBasisMethod: directFixed.airborneBasis?.method,
    directFixedErrorBudgetDb: directFixed.airborneBasis?.errorBudgetDb,
    directFixedMetrics: {
      C: directFixed.metrics.estimatedCDb,
      Ctr: directFixed.metrics.estimatedCtrDb,
      Rw: directFixed.metrics.estimatedRwDb,
      STC: directFixed.metrics.estimatedStc
    },
    directFixedRuntimeValueMovement: directFixed.airborneCandidateResolution?.runtimeValueMovement,
    directFixedSelectedCandidateId: directFixed.airborneCandidateResolution?.selectedCandidateId,
    directFixedSupportedOutputs: [...directFixed.supportedTargetOutputs],
    directFixedUnsupportedOutputs: [...directFixed.unsupportedTargetOutputs],
    fieldRequestBasisMethod: fieldRequest.airborneBasis?.method,
    fieldRequestSelectedCandidateId: fieldRequest.airborneCandidateResolution?.selectedCandidateId,
    fieldRequestSupportedOutputs: [...fieldRequest.supportedTargetOutputs],
    independentBasisMethod: independent.airborneBasis?.method,
    independentRw: independent.metrics.estimatedRwDb,
    independentSelectedCandidateId: independent.airborneCandidateResolution?.selectedCandidateId,
    missingSpacingBasisMethod: missingSpacing.airborneBasis?.method,
    missingSpacingMissingPhysicalInputs: [...(missingSpacing.airborneBasis?.missingPhysicalInputs ?? [])],
    missingSpacingSelectedCandidateId: missingSpacing.airborneCandidateResolution?.selectedCandidateId
  };
}

export function summarizePostV1WallDirectFixedDoubleLeafBridgeLossRuntimeGateEO(): PostV1GateEOSummary {
  const gateENReadiness = buildPostV1GateENRuntimeReadinessEvidence();

  if (
    gateENReadiness.directFixedBridgeClass !== "direct_fixed_bridge" ||
    gateENReadiness.directFixedInputCompletenessStatus !== "complete"
  ) {
    throw new Error("Gate EO runtime requires Gate EN direct-fixed complete-input owner evidence.");
  }

  return {
    counters: POST_V1_GATE_EO_COUNTERS,
    landedGate: POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_RUNTIME_GATE_EO_LANDED_GATE,
    ownerId: POST_V1_GATE_EN_OWNER_ID,
    ownerLedger: POST_V1_GATE_EN_OWNER_LEDGER,
    planDocPath: POST_V1_GATE_EN_PLAN_DOC_PATH,
    previousGateEN: {
      counters: POST_V1_GATE_EN_COUNTERS,
      landedGate: POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_OWNER_GATE_EN_LANDED_GATE,
      selectedNextAction: POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_OWNER_GATE_EN_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_OWNER_GATE_EN_SELECTED_NEXT_FILE,
      selectionStatus: POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_OWNER_GATE_EN_SELECTION_STATUS
    },
    runtimeEvidence: buildPostV1GateEORuntimeEvidence(),
    selectedNextAction: POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_RUNTIME_GATE_EO_SELECTED_NEXT_ACTION,
    selectedNextFile: POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_RUNTIME_GATE_EO_SELECTED_NEXT_FILE,
    selectedNextLabel: POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_RUNTIME_GATE_EO_SELECTED_NEXT_LABEL,
    selectionStatus: POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_RUNTIME_GATE_EO_SELECTION_STATUS,
    targetOutputs: POST_V1_GATE_EO_TARGET_OUTPUTS
  };
}

export const POST_V1_GATE_EO_RUNTIME_ASSERTIONS = {
  directFixedExpectedBasisMethod: GATE_EO_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_RUNTIME_METHOD,
  directFixedExpectedCandidateId: GATE_EO_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_SELECTED_CANDIDATE_ID,
  directFixedExpectedMetrics: {
    C: -1.2,
    Ctr: -5.9,
    Rw: 31,
    STC: 31
  },
  fieldRequestMustNotSelectGateEO: true,
  independentExpectedBasisMethod: GATE_S_DOUBLE_LEAF_FRAMED_BRIDGE_RUNTIME_METHOD,
  independentExpectedCandidateId: GATE_S_DOUBLE_LEAF_FRAMED_BRIDGE_SELECTED_CANDIDATE_ID,
  missingSpacingExpectedCandidateId: "candidate_dynamic_needs_input"
} as const;
