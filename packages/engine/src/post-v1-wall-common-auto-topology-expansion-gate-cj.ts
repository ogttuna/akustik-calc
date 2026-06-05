import type { RequestedOutputId } from "@dynecho/shared";

import {
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CI_LANDED_GATE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CI_SELECTED_NEXT_ACTION,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CI_SELECTED_NEXT_FILE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CI_SELECTION_STATUS
} from "./post-v1-next-numeric-coverage-gap-gate-ci";

export const POST_V1_WALL_COMMON_AUTO_TOPOLOGY_EXPANSION_GATE_CJ_LANDED_GATE =
  "post_v1_wall_common_auto_topology_expansion_gate_cj_plan" as const;

export const POST_V1_WALL_COMMON_AUTO_TOPOLOGY_EXPANSION_GATE_CJ_SELECTION_STATUS =
  "post_v1_wall_common_auto_topology_expansion_gate_cj_landed_runtime_selected_opening_leak_composite_wall_adapters_gate_ck" as const;

export const POST_V1_WALL_COMMON_AUTO_TOPOLOGY_EXPANSION_GATE_CJ_SELECTED_NEXT_ACTION =
  "post_v1_opening_leak_composite_wall_adapters_gate_ck_plan" as const;

export const POST_V1_WALL_COMMON_AUTO_TOPOLOGY_EXPANSION_GATE_CJ_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-opening-leak-composite-wall-adapters-gate-ck-contract.test.ts" as const;

export const POST_V1_WALL_COMMON_AUTO_TOPOLOGY_EXPANSION_GATE_CJ_SELECTED_NEXT_LABEL =
  "post-V1 opening/leak/composite wall adapters Gate CK" as const;

export const POST_V1_GATE_CJ_PLAN_DOC_PATH =
  "docs/calculator/POST_V1_GATE_CI_CJ_ENGINE_PLAN_2026-06-05.md" as const;

export const POST_V1_GATE_CJ_BUILDING_TARGET_OUTPUTS = [
  "R'w",
  "Dn,w",
  "Dn,A",
  "DnT,w",
  "DnT,A"
] as const satisfies readonly RequestedOutputId[];

export const POST_V1_GATE_CJ_COUNTERS = {
  newCalculableLayerTemplates: 1,
  newCalculableRequestShapes: 5,
  runtimeCorrectedLayerTemplates: 5,
  runtimeCorrectedRequestShapes: 25,
  wrongFallbackOrAliasBlocks: [
    "flat double-leaf building requests without supportTopology no longer fall through to generic Gate AR",
    "flat double-leaf building requests without studSpacingMm no longer fall through to generic Gate AR",
    "resilient-channel building requests still require resilientBarSideCount"
  ]
} as const;

export const POST_V1_GATE_CJ_BUILDING_VALUE_PINS = [
  {
    id: "independent_simple_flat_double_leaf_building",
    metrics: {
      "Dn,A": 38.5,
      "Dn,w": 40,
      "DnT,A": 40.9,
      "DnT,w": 42,
      "R'w": 39
    }
  },
  {
    id: "resilient_both_sides_flat_double_leaf_building",
    metrics: {
      "Dn,A": 40.5,
      "Dn,w": 42,
      "DnT,A": 42.9,
      "DnT,w": 44,
      "R'w": 41
    }
  },
  {
    id: "multi_board_leaf_flat_double_leaf_building",
    metrics: {
      "Dn,A": 45.7,
      "Dn,w": 47,
      "DnT,A": 48.1,
      "DnT,w": 49,
      "R'w": 46
    }
  },
  {
    id: "split_air_porous_cavity_flat_double_leaf_building",
    metrics: {
      "Dn,A": 43.1,
      "Dn,w": 44,
      "DnT,A": 45.5,
      "DnT,w": 47,
      "R'w": 44
    }
  },
  {
    id: "asymmetric_board_count_flat_double_leaf_building",
    metrics: {
      "Dn,A": 42.1,
      "Dn,w": 43,
      "DnT,A": 44.5,
      "DnT,w": 46,
      "R'w": 43
    }
  }
] as const;

export type PostV1GateCJSummary = {
  readonly counters: typeof POST_V1_GATE_CJ_COUNTERS;
  readonly landedGate: typeof POST_V1_WALL_COMMON_AUTO_TOPOLOGY_EXPANSION_GATE_CJ_LANDED_GATE;
  readonly planDocPath: typeof POST_V1_GATE_CJ_PLAN_DOC_PATH;
  readonly previousGateCI: {
    readonly landedGate: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CI_LANDED_GATE;
    readonly selectedNextAction: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CI_SELECTED_NEXT_ACTION;
    readonly selectedNextFile: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CI_SELECTED_NEXT_FILE;
    readonly selectionStatus: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CI_SELECTION_STATUS;
  };
  readonly selectedNextAction: typeof POST_V1_WALL_COMMON_AUTO_TOPOLOGY_EXPANSION_GATE_CJ_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof POST_V1_WALL_COMMON_AUTO_TOPOLOGY_EXPANSION_GATE_CJ_SELECTED_NEXT_FILE;
  readonly selectedNextLabel: typeof POST_V1_WALL_COMMON_AUTO_TOPOLOGY_EXPANSION_GATE_CJ_SELECTED_NEXT_LABEL;
  readonly selectionStatus: typeof POST_V1_WALL_COMMON_AUTO_TOPOLOGY_EXPANSION_GATE_CJ_SELECTION_STATUS;
  readonly valuePins: typeof POST_V1_GATE_CJ_BUILDING_VALUE_PINS;
};

export function summarizePostV1WallCommonAutoTopologyExpansionGateCJ(): PostV1GateCJSummary {
  if (
    POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CI_SELECTED_NEXT_ACTION !==
    POST_V1_WALL_COMMON_AUTO_TOPOLOGY_EXPANSION_GATE_CJ_LANDED_GATE
  ) {
    throw new Error("Gate CJ can only land after Gate CI selects Gate CJ.");
  }

  return {
    counters: POST_V1_GATE_CJ_COUNTERS,
    landedGate: POST_V1_WALL_COMMON_AUTO_TOPOLOGY_EXPANSION_GATE_CJ_LANDED_GATE,
    planDocPath: POST_V1_GATE_CJ_PLAN_DOC_PATH,
    previousGateCI: {
      landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CI_LANDED_GATE,
      selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CI_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CI_SELECTED_NEXT_FILE,
      selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CI_SELECTION_STATUS
    },
    selectedNextAction: POST_V1_WALL_COMMON_AUTO_TOPOLOGY_EXPANSION_GATE_CJ_SELECTED_NEXT_ACTION,
    selectedNextFile: POST_V1_WALL_COMMON_AUTO_TOPOLOGY_EXPANSION_GATE_CJ_SELECTED_NEXT_FILE,
    selectedNextLabel: POST_V1_WALL_COMMON_AUTO_TOPOLOGY_EXPANSION_GATE_CJ_SELECTED_NEXT_LABEL,
    selectionStatus: POST_V1_WALL_COMMON_AUTO_TOPOLOGY_EXPANSION_GATE_CJ_SELECTION_STATUS,
    valuePins: POST_V1_GATE_CJ_BUILDING_VALUE_PINS
  };
}
