import type { RequestedOutputId } from "@dynecho/shared";

import {
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CN_LANDED_GATE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CN_SELECTED_NEXT_ACTION,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CN_SELECTED_NEXT_FILE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CN_SELECTION_STATUS
} from "./post-v1-next-numeric-coverage-gap-gate-cn";
import {
  MASS_TIMBER_CLT_DELTA_LW_FORMULA_BASIS,
  TIMBER_JOIST_DELTA_LW_FORMULA_BASIS
} from "./timber-clt-floor-impact-delta-lw-runtime-corridor";

export const POST_V1_FLOOR_VISIBLE_LAYER_UPPER_PACKAGE_DELTA_LW_GATE_CO_LANDED_GATE =
  "post_v1_floor_visible_layer_upper_package_delta_lw_gate_co_plan" as const;

export const POST_V1_FLOOR_VISIBLE_LAYER_UPPER_PACKAGE_DELTA_LW_GATE_CO_SELECTION_STATUS =
  "post_v1_floor_visible_layer_upper_package_delta_lw_gate_co_landed_runtime_selected_next_numeric_coverage_gap_gate_cp" as const;

export const POST_V1_FLOOR_VISIBLE_LAYER_UPPER_PACKAGE_DELTA_LW_GATE_CO_SELECTED_NEXT_ACTION =
  "post_v1_next_numeric_coverage_gap_gate_cp_plan" as const;

export const POST_V1_FLOOR_VISIBLE_LAYER_UPPER_PACKAGE_DELTA_LW_GATE_CO_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-cp-contract.test.ts" as const;

export const POST_V1_FLOOR_VISIBLE_LAYER_UPPER_PACKAGE_DELTA_LW_GATE_CO_SELECTED_NEXT_LABEL =
  "post-V1 next numeric coverage gap Gate CP" as const;

export const POST_V1_GATE_CO_TARGET_OUTPUTS = [
  "Ln,w",
  "DeltaLw",
  "L'n,w",
  "L'nT,w",
  "L'nT,50"
] as const satisfies readonly RequestedOutputId[];

export const POST_V1_GATE_CO_COUNTERS = {
  newCalculableLayerTemplates: 2,
  newCalculableRequestShapes: 10,
  runtimeCorrectedLayerTemplates: 0,
  runtimeCorrectedRequestShapes: 0,
  wrongFallbackOrAliasBlocks: [
    "visible timber and CLT upper packages route DeltaLw to the existing timber/CLT formula owner instead of remaining Ln,w-only",
    "exact or published-family Ln,w remains the primary lab anchor while DeltaLw is only a metric companion",
    "missing load basis or dynamic stiffness remains needs_input",
    "ISO DeltaLw still does not publish ASTM IIC or AIIC aliases"
  ]
} as const;

export const POST_V1_GATE_CO_VALUE_PINS = {
  cltVisibleUpperPackage: {
    family: "mass_timber_clt",
    metricBasis: MASS_TIMBER_CLT_DELTA_LW_FORMULA_BASIS,
    metrics: {
      "DeltaLw": 22.6,
      "L'n,w": 52,
      "L'nT,50": 52.6,
      "L'nT,w": 49.6,
      "Ln,w": 50
    }
  },
  timberVisibleUpperPackage: {
    family: "timber_joists",
    metricBasis: TIMBER_JOIST_DELTA_LW_FORMULA_BASIS,
    metrics: {
      "DeltaLw": 25.2,
      "L'n,w": 53,
      "L'nT,50": 53.6,
      "L'nT,w": 50.6,
      "Ln,w": 51
    }
  }
} as const;

export type PostV1GateCOSummary = {
  readonly counters: typeof POST_V1_GATE_CO_COUNTERS;
  readonly landedGate: typeof POST_V1_FLOOR_VISIBLE_LAYER_UPPER_PACKAGE_DELTA_LW_GATE_CO_LANDED_GATE;
  readonly previousGateCN: {
    readonly landedGate: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CN_LANDED_GATE;
    readonly selectedNextAction: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CN_SELECTED_NEXT_ACTION;
    readonly selectedNextFile: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CN_SELECTED_NEXT_FILE;
    readonly selectionStatus: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CN_SELECTION_STATUS;
  };
  readonly selectedNextAction: typeof POST_V1_FLOOR_VISIBLE_LAYER_UPPER_PACKAGE_DELTA_LW_GATE_CO_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof POST_V1_FLOOR_VISIBLE_LAYER_UPPER_PACKAGE_DELTA_LW_GATE_CO_SELECTED_NEXT_FILE;
  readonly selectedNextLabel: typeof POST_V1_FLOOR_VISIBLE_LAYER_UPPER_PACKAGE_DELTA_LW_GATE_CO_SELECTED_NEXT_LABEL;
  readonly selectionStatus: typeof POST_V1_FLOOR_VISIBLE_LAYER_UPPER_PACKAGE_DELTA_LW_GATE_CO_SELECTION_STATUS;
  readonly targetOutputs: typeof POST_V1_GATE_CO_TARGET_OUTPUTS;
  readonly valuePins: typeof POST_V1_GATE_CO_VALUE_PINS;
};

export function summarizePostV1FloorVisibleLayerUpperPackageDeltaLwGateCO():
  PostV1GateCOSummary {
  if (
    POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CN_SELECTED_NEXT_ACTION !==
    POST_V1_FLOOR_VISIBLE_LAYER_UPPER_PACKAGE_DELTA_LW_GATE_CO_LANDED_GATE
  ) {
    throw new Error("Gate CO can only land after Gate CN selects Gate CO.");
  }

  return {
    counters: POST_V1_GATE_CO_COUNTERS,
    landedGate: POST_V1_FLOOR_VISIBLE_LAYER_UPPER_PACKAGE_DELTA_LW_GATE_CO_LANDED_GATE,
    previousGateCN: {
      landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CN_LANDED_GATE,
      selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CN_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CN_SELECTED_NEXT_FILE,
      selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CN_SELECTION_STATUS
    },
    selectedNextAction: POST_V1_FLOOR_VISIBLE_LAYER_UPPER_PACKAGE_DELTA_LW_GATE_CO_SELECTED_NEXT_ACTION,
    selectedNextFile: POST_V1_FLOOR_VISIBLE_LAYER_UPPER_PACKAGE_DELTA_LW_GATE_CO_SELECTED_NEXT_FILE,
    selectedNextLabel: POST_V1_FLOOR_VISIBLE_LAYER_UPPER_PACKAGE_DELTA_LW_GATE_CO_SELECTED_NEXT_LABEL,
    selectionStatus: POST_V1_FLOOR_VISIBLE_LAYER_UPPER_PACKAGE_DELTA_LW_GATE_CO_SELECTION_STATUS,
    targetOutputs: POST_V1_GATE_CO_TARGET_OUTPUTS,
    valuePins: POST_V1_GATE_CO_VALUE_PINS
  };
}
