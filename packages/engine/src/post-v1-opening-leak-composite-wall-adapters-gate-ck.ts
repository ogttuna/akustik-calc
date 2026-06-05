import type { RequestedOutputId } from "@dynecho/shared";

import {
  COMPANY_INTERNAL_OPENING_LEAK_BUILDING_RUNTIME_METHOD,
  COMPANY_INTERNAL_OPENING_LEAK_BUILDING_TOLERANCE_DB,
  COMPANY_INTERNAL_OPENING_LEAK_FIELD_RUNTIME_METHOD,
  COMPANY_INTERNAL_OPENING_LEAK_FIELD_TOLERANCE_DB
} from "./company-internal-opening-leak-building-runtime-corridor";
import {
  POST_V1_WALL_COMMON_AUTO_TOPOLOGY_EXPANSION_GATE_CJ_LANDED_GATE,
  POST_V1_WALL_COMMON_AUTO_TOPOLOGY_EXPANSION_GATE_CJ_SELECTED_NEXT_ACTION,
  POST_V1_WALL_COMMON_AUTO_TOPOLOGY_EXPANSION_GATE_CJ_SELECTED_NEXT_FILE,
  POST_V1_WALL_COMMON_AUTO_TOPOLOGY_EXPANSION_GATE_CJ_SELECTION_STATUS
} from "./post-v1-wall-common-auto-topology-expansion-gate-cj";

export const POST_V1_OPENING_LEAK_COMPOSITE_WALL_ADAPTERS_GATE_CK_LANDED_GATE =
  "post_v1_opening_leak_composite_wall_adapters_gate_ck_plan" as const;

export const POST_V1_OPENING_LEAK_COMPOSITE_WALL_ADAPTERS_GATE_CK_SELECTION_STATUS =
  "post_v1_opening_leak_composite_wall_adapters_gate_ck_landed_runtime_selected_next_numeric_coverage_gap_gate_cl" as const;

export const POST_V1_OPENING_LEAK_COMPOSITE_WALL_ADAPTERS_GATE_CK_SELECTED_NEXT_ACTION =
  "post_v1_next_numeric_coverage_gap_gate_cl_plan" as const;

export const POST_V1_OPENING_LEAK_COMPOSITE_WALL_ADAPTERS_GATE_CK_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-cl-contract.test.ts" as const;

export const POST_V1_OPENING_LEAK_COMPOSITE_WALL_ADAPTERS_GATE_CK_SELECTED_NEXT_LABEL =
  "post-V1 next numeric coverage gap rerank after opening/leak adapters" as const;

export const POST_V1_GATE_CK_FIELD_TARGET_OUTPUTS = [
  "R'w",
  "Dn,w",
  "DnT,w",
  "Dn,A"
] as const satisfies readonly RequestedOutputId[];

export const POST_V1_GATE_CK_BUILDING_TARGET_OUTPUTS = [
  "R'w",
  "DnT,w",
  "DnT,A"
] as const satisfies readonly RequestedOutputId[];

export const POST_V1_GATE_CK_COUNTERS = {
  newCalculableLayerTemplates: 2,
  newCalculableRequestShapes: 5,
  runtimeCorrectedLayerTemplates: 2,
  runtimeCorrectedRequestShapes: 5,
  wrongFallbackOrAliasBlocks: [
    "explicit field opening/leak route fields no longer require a hidden adapter-boundary flag",
    "explicit building opening/leak route fields no longer require a hidden adapter-boundary flag",
    "A-weighted opening/leak outputs still require the owned frequencyBandSet",
    "lab opening/leak Rw/STC still do not alias into field or building metrics"
  ]
} as const;

export const POST_V1_GATE_CK_VALUE_PINS = {
  building: {
    basisMethod: COMPANY_INTERNAL_OPENING_LEAK_BUILDING_RUNTIME_METHOD,
    errorBudgetDb: COMPANY_INTERNAL_OPENING_LEAK_BUILDING_TOLERANCE_DB,
    metrics: {
      "DnT,w": 32.1,
      "R'w": 31.6
    }
  },
  field: {
    basisMethod: COMPANY_INTERNAL_OPENING_LEAK_FIELD_RUNTIME_METHOD,
    errorBudgetDb: COMPANY_INTERNAL_OPENING_LEAK_FIELD_TOLERANCE_DB,
    metrics: {
      "Dn,w": 36.7,
      "DnT,w": 36.9,
      "R'w": 36.4
    }
  }
} as const;

export type PostV1GateCKSummary = {
  readonly counters: typeof POST_V1_GATE_CK_COUNTERS;
  readonly landedGate: typeof POST_V1_OPENING_LEAK_COMPOSITE_WALL_ADAPTERS_GATE_CK_LANDED_GATE;
  readonly previousGateCJ: {
    readonly landedGate: typeof POST_V1_WALL_COMMON_AUTO_TOPOLOGY_EXPANSION_GATE_CJ_LANDED_GATE;
    readonly selectedNextAction: typeof POST_V1_WALL_COMMON_AUTO_TOPOLOGY_EXPANSION_GATE_CJ_SELECTED_NEXT_ACTION;
    readonly selectedNextFile: typeof POST_V1_WALL_COMMON_AUTO_TOPOLOGY_EXPANSION_GATE_CJ_SELECTED_NEXT_FILE;
    readonly selectionStatus: typeof POST_V1_WALL_COMMON_AUTO_TOPOLOGY_EXPANSION_GATE_CJ_SELECTION_STATUS;
  };
  readonly selectedNextAction: typeof POST_V1_OPENING_LEAK_COMPOSITE_WALL_ADAPTERS_GATE_CK_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof POST_V1_OPENING_LEAK_COMPOSITE_WALL_ADAPTERS_GATE_CK_SELECTED_NEXT_FILE;
  readonly selectedNextLabel: typeof POST_V1_OPENING_LEAK_COMPOSITE_WALL_ADAPTERS_GATE_CK_SELECTED_NEXT_LABEL;
  readonly selectionStatus: typeof POST_V1_OPENING_LEAK_COMPOSITE_WALL_ADAPTERS_GATE_CK_SELECTION_STATUS;
  readonly valuePins: typeof POST_V1_GATE_CK_VALUE_PINS;
};

export function summarizePostV1OpeningLeakCompositeWallAdaptersGateCK(): PostV1GateCKSummary {
  if (
    POST_V1_WALL_COMMON_AUTO_TOPOLOGY_EXPANSION_GATE_CJ_SELECTED_NEXT_ACTION !==
    POST_V1_OPENING_LEAK_COMPOSITE_WALL_ADAPTERS_GATE_CK_LANDED_GATE
  ) {
    throw new Error("Gate CK can only land after Gate CJ selects Gate CK.");
  }

  return {
    counters: POST_V1_GATE_CK_COUNTERS,
    landedGate: POST_V1_OPENING_LEAK_COMPOSITE_WALL_ADAPTERS_GATE_CK_LANDED_GATE,
    previousGateCJ: {
      landedGate: POST_V1_WALL_COMMON_AUTO_TOPOLOGY_EXPANSION_GATE_CJ_LANDED_GATE,
      selectedNextAction: POST_V1_WALL_COMMON_AUTO_TOPOLOGY_EXPANSION_GATE_CJ_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_WALL_COMMON_AUTO_TOPOLOGY_EXPANSION_GATE_CJ_SELECTED_NEXT_FILE,
      selectionStatus: POST_V1_WALL_COMMON_AUTO_TOPOLOGY_EXPANSION_GATE_CJ_SELECTION_STATUS
    },
    selectedNextAction: POST_V1_OPENING_LEAK_COMPOSITE_WALL_ADAPTERS_GATE_CK_SELECTED_NEXT_ACTION,
    selectedNextFile: POST_V1_OPENING_LEAK_COMPOSITE_WALL_ADAPTERS_GATE_CK_SELECTED_NEXT_FILE,
    selectedNextLabel: POST_V1_OPENING_LEAK_COMPOSITE_WALL_ADAPTERS_GATE_CK_SELECTED_NEXT_LABEL,
    selectionStatus: POST_V1_OPENING_LEAK_COMPOSITE_WALL_ADAPTERS_GATE_CK_SELECTION_STATUS,
    valuePins: POST_V1_GATE_CK_VALUE_PINS
  };
}
