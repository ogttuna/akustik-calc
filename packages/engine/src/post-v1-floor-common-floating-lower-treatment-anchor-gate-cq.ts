import type { RequestedOutputId } from "@dynecho/shared";

import {
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CP_LANDED_GATE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CP_SELECTED_NEXT_ACTION,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CP_SELECTED_NEXT_FILE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CP_SELECTION_STATUS
} from "./post-v1-next-numeric-coverage-gap-gate-cp";

export const POST_V1_FLOOR_COMMON_FLOATING_LOWER_TREATMENT_ANCHOR_GATE_CQ_LANDED_GATE =
  "post_v1_floor_common_floating_lower_treatment_anchor_gate_cq_plan" as const;

export const POST_V1_FLOOR_COMMON_FLOATING_LOWER_TREATMENT_ANCHOR_GATE_CQ_SELECTION_STATUS =
  "post_v1_floor_common_floating_lower_treatment_anchor_gate_cq_landed_runtime_selected_next_numeric_coverage_gap_gate_cr" as const;

export const POST_V1_FLOOR_COMMON_FLOATING_LOWER_TREATMENT_ANCHOR_GATE_CQ_SELECTED_NEXT_ACTION =
  "post_v1_next_numeric_coverage_gap_gate_cr_plan" as const;

export const POST_V1_FLOOR_COMMON_FLOATING_LOWER_TREATMENT_ANCHOR_GATE_CQ_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-cr-contract.test.ts" as const;

export const POST_V1_FLOOR_COMMON_FLOATING_LOWER_TREATMENT_ANCHOR_GATE_CQ_SELECTED_NEXT_LABEL =
  "post-V1 next numeric coverage gap Gate CR" as const;

export const POST_V1_GATE_CQ_TARGET_OUTPUTS = [
  "Ln,w",
  "DeltaLw",
  "L'n,w",
  "L'nT,w",
  "L'nT,50"
] as const satisfies readonly RequestedOutputId[];

export const POST_V1_GATE_CQ_COUNTERS = {
  newCalculableLayerTemplates: 2,
  newCalculableRequestShapes: 10,
  runtimeCorrectedRequestShapes: 8,
  wrongFallbackOrAliasBlocks: [
    "visible common floating lower-treatment stacks keep the published-family Ln,w anchor instead of stopping all impact outputs behind the combined-formula needs_input guard",
    "DeltaLw still requires loadBasisKgM2 and resilientLayerDynamicStiffnessMNm3",
    "complete physical inputs still use the heavy combined upper/lower formula corridor",
    "ISO impact routes still do not publish ASTM IIC or AIIC aliases"
  ]
} as const;

export const POST_V1_GATE_CQ_VALUE_PINS = {
  acousticHangerLowerTreatment: {
    basis: "predictor_heavy_concrete_published_upper_treatment_estimate",
    candidateId: "floor.heavy_concrete_floating.published_upper_treatment_anchor_owned",
    metrics: {
      "L'n,w": 45,
      "L'nT,50": 46.6,
      "L'nT,w": 42.6,
      "Ln,w": 43
    }
  },
  resilientStudLowerTreatment: {
    basis: "predictor_heavy_concrete_published_upper_treatment_estimate",
    candidateId: "floor.heavy_concrete_floating.published_upper_treatment_anchor_owned",
    metrics: {
      "L'n,w": 53.5,
      "L'nT,50": 55.1,
      "L'nT,w": 51.1,
      "Ln,w": 51.5
    }
  }
} as const;

export type PostV1GateCQSummary = {
  readonly counters: typeof POST_V1_GATE_CQ_COUNTERS;
  readonly landedGate: typeof POST_V1_FLOOR_COMMON_FLOATING_LOWER_TREATMENT_ANCHOR_GATE_CQ_LANDED_GATE;
  readonly previousGateCP: {
    readonly landedGate: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CP_LANDED_GATE;
    readonly selectedNextAction: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CP_SELECTED_NEXT_ACTION;
    readonly selectedNextFile: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CP_SELECTED_NEXT_FILE;
    readonly selectionStatus: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CP_SELECTION_STATUS;
  };
  readonly selectedNextAction: typeof POST_V1_FLOOR_COMMON_FLOATING_LOWER_TREATMENT_ANCHOR_GATE_CQ_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof POST_V1_FLOOR_COMMON_FLOATING_LOWER_TREATMENT_ANCHOR_GATE_CQ_SELECTED_NEXT_FILE;
  readonly selectedNextLabel: typeof POST_V1_FLOOR_COMMON_FLOATING_LOWER_TREATMENT_ANCHOR_GATE_CQ_SELECTED_NEXT_LABEL;
  readonly selectionStatus: typeof POST_V1_FLOOR_COMMON_FLOATING_LOWER_TREATMENT_ANCHOR_GATE_CQ_SELECTION_STATUS;
  readonly targetOutputs: typeof POST_V1_GATE_CQ_TARGET_OUTPUTS;
  readonly valuePins: typeof POST_V1_GATE_CQ_VALUE_PINS;
};

export function summarizePostV1FloorCommonFloatingLowerTreatmentAnchorGateCQ():
  PostV1GateCQSummary {
  if (
    POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CP_SELECTED_NEXT_ACTION !==
    POST_V1_FLOOR_COMMON_FLOATING_LOWER_TREATMENT_ANCHOR_GATE_CQ_LANDED_GATE
  ) {
    throw new Error("Gate CQ can only land after Gate CP selects the common floating lower-treatment anchor slice.");
  }

  return {
    counters: POST_V1_GATE_CQ_COUNTERS,
    landedGate: POST_V1_FLOOR_COMMON_FLOATING_LOWER_TREATMENT_ANCHOR_GATE_CQ_LANDED_GATE,
    previousGateCP: {
      landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CP_LANDED_GATE,
      selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CP_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CP_SELECTED_NEXT_FILE,
      selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CP_SELECTION_STATUS
    },
    selectedNextAction:
      POST_V1_FLOOR_COMMON_FLOATING_LOWER_TREATMENT_ANCHOR_GATE_CQ_SELECTED_NEXT_ACTION,
    selectedNextFile:
      POST_V1_FLOOR_COMMON_FLOATING_LOWER_TREATMENT_ANCHOR_GATE_CQ_SELECTED_NEXT_FILE,
    selectedNextLabel:
      POST_V1_FLOOR_COMMON_FLOATING_LOWER_TREATMENT_ANCHOR_GATE_CQ_SELECTED_NEXT_LABEL,
    selectionStatus:
      POST_V1_FLOOR_COMMON_FLOATING_LOWER_TREATMENT_ANCHOR_GATE_CQ_SELECTION_STATUS,
    targetOutputs: POST_V1_GATE_CQ_TARGET_OUTPUTS,
    valuePins: POST_V1_GATE_CQ_VALUE_PINS
  };
}
