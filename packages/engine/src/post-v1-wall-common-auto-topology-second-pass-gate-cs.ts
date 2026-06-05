import type { RequestedOutputId } from "@dynecho/shared";

import {
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CR_LANDED_GATE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CR_SELECTED_NEXT_ACTION,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CR_SELECTED_NEXT_FILE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CR_SELECTION_STATUS
} from "./post-v1-next-numeric-coverage-gap-gate-cr";

export const POST_V1_WALL_COMMON_AUTO_TOPOLOGY_SECOND_PASS_GATE_CS_LANDED_GATE =
  "post_v1_wall_common_auto_topology_second_pass_gate_cs_plan" as const;

export const POST_V1_WALL_COMMON_AUTO_TOPOLOGY_SECOND_PASS_GATE_CS_SELECTION_STATUS =
  "post_v1_wall_common_auto_topology_second_pass_gate_cs_landed_runtime_selected_next_numeric_coverage_gap_gate_ct" as const;

export const POST_V1_WALL_COMMON_AUTO_TOPOLOGY_SECOND_PASS_GATE_CS_SELECTED_NEXT_ACTION =
  "post_v1_next_numeric_coverage_gap_gate_ct_plan" as const;

export const POST_V1_WALL_COMMON_AUTO_TOPOLOGY_SECOND_PASS_GATE_CS_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ct-contract.test.ts" as const;

export const POST_V1_WALL_COMMON_AUTO_TOPOLOGY_SECOND_PASS_GATE_CS_SELECTED_NEXT_LABEL =
  "post-V1 next numeric coverage gap Gate CT" as const;

export const POST_V1_GATE_CS_TARGET_OUTPUTS = [
  "R'w",
  "Dn,w",
  "Dn,A",
  "DnT,w",
  "DnT,A"
] as const satisfies readonly RequestedOutputId[];

export const POST_V1_GATE_CS_COUNTERS = {
  newCalculableLayerTemplates: 0,
  newCalculableRequestShapes: 5,
  runtimeCorrectedLayerTemplates: 5,
  runtimeCorrectedRequestShapes: 25,
  wrongFallbackOrAliasBlocks: [
    "only safely segmentable three-segment flat_layer_order double-leaf walls are admitted",
    "explicit flat_layer_order multicavity stacks are carried forward for a separate grouped multicavity owner instead of being widened by Gate CS",
    "missing supportTopology, missing studSpacingMm, and missing resilientBarSideCount remain needs_input",
    "lab Rw/STC/C/Ctr still do not alias into field or building R'w/Dn,w/DnT,w outputs"
  ]
} as const;

export const POST_V1_GATE_CS_VALUE_PINS = [
  {
    id: "explicit_flat_layer_order_independent_simple_building",
    metrics: {
      "Dn,A": 38.5,
      "Dn,w": 40,
      "DnT,A": 40.9,
      "DnT,w": 42,
      "R'w": 39
    }
  },
  {
    id: "explicit_flat_layer_order_resilient_both_sides_building",
    metrics: {
      "Dn,A": 40.5,
      "Dn,w": 42,
      "DnT,A": 42.9,
      "DnT,w": 44,
      "R'w": 41
    }
  },
  {
    id: "explicit_flat_layer_order_multi_board_building",
    metrics: {
      "Dn,A": 45.7,
      "Dn,w": 47,
      "DnT,A": 48.1,
      "DnT,w": 49,
      "R'w": 46
    }
  },
  {
    id: "explicit_flat_layer_order_split_air_porous_cavity_building",
    metrics: {
      "Dn,A": 43.1,
      "Dn,w": 44,
      "DnT,A": 45.5,
      "DnT,w": 47,
      "R'w": 44
    }
  },
  {
    id: "explicit_flat_layer_order_asymmetric_board_count_building",
    metrics: {
      "Dn,A": 42.1,
      "Dn,w": 43,
      "DnT,A": 44.5,
      "DnT,w": 46,
      "R'w": 43
    }
  }
] as const;

export type PostV1GateCSSummary = {
  readonly counters: typeof POST_V1_GATE_CS_COUNTERS;
  readonly landedGate: typeof POST_V1_WALL_COMMON_AUTO_TOPOLOGY_SECOND_PASS_GATE_CS_LANDED_GATE;
  readonly previousGateCR: {
    readonly landedGate: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CR_LANDED_GATE;
    readonly selectedNextAction: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CR_SELECTED_NEXT_ACTION;
    readonly selectedNextFile: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CR_SELECTED_NEXT_FILE;
    readonly selectionStatus: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CR_SELECTION_STATUS;
  };
  readonly selectedNextAction: typeof POST_V1_WALL_COMMON_AUTO_TOPOLOGY_SECOND_PASS_GATE_CS_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof POST_V1_WALL_COMMON_AUTO_TOPOLOGY_SECOND_PASS_GATE_CS_SELECTED_NEXT_FILE;
  readonly selectedNextLabel: typeof POST_V1_WALL_COMMON_AUTO_TOPOLOGY_SECOND_PASS_GATE_CS_SELECTED_NEXT_LABEL;
  readonly selectionStatus: typeof POST_V1_WALL_COMMON_AUTO_TOPOLOGY_SECOND_PASS_GATE_CS_SELECTION_STATUS;
  readonly targetOutputs: typeof POST_V1_GATE_CS_TARGET_OUTPUTS;
  readonly valuePins: typeof POST_V1_GATE_CS_VALUE_PINS;
};

export function summarizePostV1WallCommonAutoTopologySecondPassGateCS(): PostV1GateCSSummary {
  if (
    POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CR_SELECTED_NEXT_ACTION !==
    POST_V1_WALL_COMMON_AUTO_TOPOLOGY_SECOND_PASS_GATE_CS_LANDED_GATE
  ) {
    throw new Error("Gate CS can only land after Gate CR selects the wall auto-topology second pass.");
  }

  return {
    counters: POST_V1_GATE_CS_COUNTERS,
    landedGate: POST_V1_WALL_COMMON_AUTO_TOPOLOGY_SECOND_PASS_GATE_CS_LANDED_GATE,
    previousGateCR: {
      landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CR_LANDED_GATE,
      selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CR_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CR_SELECTED_NEXT_FILE,
      selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CR_SELECTION_STATUS
    },
    selectedNextAction:
      POST_V1_WALL_COMMON_AUTO_TOPOLOGY_SECOND_PASS_GATE_CS_SELECTED_NEXT_ACTION,
    selectedNextFile:
      POST_V1_WALL_COMMON_AUTO_TOPOLOGY_SECOND_PASS_GATE_CS_SELECTED_NEXT_FILE,
    selectedNextLabel:
      POST_V1_WALL_COMMON_AUTO_TOPOLOGY_SECOND_PASS_GATE_CS_SELECTED_NEXT_LABEL,
    selectionStatus:
      POST_V1_WALL_COMMON_AUTO_TOPOLOGY_SECOND_PASS_GATE_CS_SELECTION_STATUS,
    targetOutputs: POST_V1_GATE_CS_TARGET_OUTPUTS,
    valuePins: POST_V1_GATE_CS_VALUE_PINS
  };
}
