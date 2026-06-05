import type { RequestedOutputId } from "@dynecho/shared";

import {
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CT_LANDED_GATE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CT_SELECTED_NEXT_ACTION,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CT_SELECTED_NEXT_FILE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CT_SELECTION_STATUS
} from "./post-v1-next-numeric-coverage-gap-gate-ct";

export const POST_V1_WALL_FLAT_LAYER_ORDER_MULTICAVITY_GATE_CU_LANDED_GATE =
  "post_v1_wall_flat_layer_order_multicavity_gate_cu_plan" as const;

export const POST_V1_WALL_FLAT_LAYER_ORDER_MULTICAVITY_GATE_CU_SELECTION_STATUS =
  "post_v1_wall_flat_layer_order_multicavity_gate_cu_landed_runtime_selected_next_numeric_coverage_gap_gate_cv" as const;

export const POST_V1_WALL_FLAT_LAYER_ORDER_MULTICAVITY_GATE_CU_SELECTED_NEXT_ACTION =
  "post_v1_next_numeric_coverage_gap_gate_cv_plan" as const;

export const POST_V1_WALL_FLAT_LAYER_ORDER_MULTICAVITY_GATE_CU_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-cv-contract.test.ts" as const;

export const POST_V1_WALL_FLAT_LAYER_ORDER_MULTICAVITY_GATE_CU_SELECTED_NEXT_LABEL =
  "post-V1 next numeric coverage gap Gate CV" as const;

export const POST_V1_GATE_CU_LAB_TARGET_OUTPUTS = [
  "Rw",
  "STC",
  "C",
  "Ctr"
] as const satisfies readonly RequestedOutputId[];

export const POST_V1_GATE_CU_FIELD_TARGET_OUTPUTS = [
  "R'w",
  "Dn,w",
  "Dn,A",
  "DnT,w",
  "DnT,A"
] as const satisfies readonly RequestedOutputId[];

export const POST_V1_GATE_CU_BUILDING_TARGET_OUTPUTS = [
  "R'w",
  "Dn,w",
  "Dn,A",
  "DnT,w",
  "DnT,A"
] as const satisfies readonly RequestedOutputId[];

export const POST_V1_GATE_CU_COUNTERS = {
  newCalculableLayerTemplates: 1,
  newCalculableRequestShapes: 14,
  runtimeCorrectedLayerTemplates: 1,
  runtimeCorrectedRequestShapes: 14,
  wrongFallbackOrAliasBlocks: [
    "only safe explicit flat_layer_order multicavity stacks with five leaf/cavity/leaf/cavity/leaf segments and explicit supportTopology are admitted",
    "explicit grouped layer indices on flat_layer_order remain blocked as contradictory topology ownership",
    "missing supportTopology remains needs_input instead of defaulting multicavity support",
    "field outputs require field_between_rooms panel/room context and building outputs require building_prediction flanking/room context",
    "lab Rw/STC/C/Ctr are not relabelled as field or building outputs without the Gate I/Gate AR adapters"
  ]
} as const;

export const POST_V1_GATE_CU_VALUE_PINS = {
  building: {
    basis: "gate_ar_airborne_building_prediction_all_owner_runtime_corridor",
    candidateId: "candidate_airborne_building_prediction_all_owner_family_physics_prediction",
    metrics: {
      "Dn,A": 52,
      "Dn,w": 53,
      "DnT,A": 53.5,
      "DnT,w": 54,
      "R'w": 53
    }
  },
  field: {
    basis: "gate_i_airborne_field_apparent_context_adapter_runtime",
    candidateId: "candidate_airborne_field_context_family_physics_prediction",
    metrics: {
      "Dn,A": 52,
      "Dn,w": 53,
      "DnT,A": 53.5,
      "DnT,w": 54,
      "R'w": 53
    }
  },
  lab: {
    basis: "gate_ae_flat_multicavity_two_cavity_frequency_solver",
    candidateId: "candidate_gate_ae_flat_multicavity_family_physics_prediction",
    metrics: {
      C: -0.6,
      Ctr: -8,
      Rw: 53,
      STC: 57
    }
  }
} as const;

export type PostV1GateCUSummary = {
  readonly counters: typeof POST_V1_GATE_CU_COUNTERS;
  readonly landedGate: typeof POST_V1_WALL_FLAT_LAYER_ORDER_MULTICAVITY_GATE_CU_LANDED_GATE;
  readonly previousGateCT: {
    readonly landedGate: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CT_LANDED_GATE;
    readonly selectedNextAction: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CT_SELECTED_NEXT_ACTION;
    readonly selectedNextFile: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CT_SELECTED_NEXT_FILE;
    readonly selectionStatus: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CT_SELECTION_STATUS;
  };
  readonly selectedNextAction: typeof POST_V1_WALL_FLAT_LAYER_ORDER_MULTICAVITY_GATE_CU_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof POST_V1_WALL_FLAT_LAYER_ORDER_MULTICAVITY_GATE_CU_SELECTED_NEXT_FILE;
  readonly selectedNextLabel: typeof POST_V1_WALL_FLAT_LAYER_ORDER_MULTICAVITY_GATE_CU_SELECTED_NEXT_LABEL;
  readonly selectionStatus: typeof POST_V1_WALL_FLAT_LAYER_ORDER_MULTICAVITY_GATE_CU_SELECTION_STATUS;
  readonly targetOutputs: {
    readonly building: typeof POST_V1_GATE_CU_BUILDING_TARGET_OUTPUTS;
    readonly field: typeof POST_V1_GATE_CU_FIELD_TARGET_OUTPUTS;
    readonly lab: typeof POST_V1_GATE_CU_LAB_TARGET_OUTPUTS;
  };
  readonly valuePins: typeof POST_V1_GATE_CU_VALUE_PINS;
};

export function summarizePostV1WallFlatLayerOrderMulticavityGateCU():
  PostV1GateCUSummary {
  if (
    POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CT_SELECTED_NEXT_ACTION !==
    POST_V1_WALL_FLAT_LAYER_ORDER_MULTICAVITY_GATE_CU_LANDED_GATE
  ) {
    throw new Error("Gate CU can only land after Gate CT selects the flat layer-order multicavity slice.");
  }

  return {
    counters: POST_V1_GATE_CU_COUNTERS,
    landedGate: POST_V1_WALL_FLAT_LAYER_ORDER_MULTICAVITY_GATE_CU_LANDED_GATE,
    previousGateCT: {
      landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CT_LANDED_GATE,
      selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CT_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CT_SELECTED_NEXT_FILE,
      selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CT_SELECTION_STATUS
    },
    selectedNextAction:
      POST_V1_WALL_FLAT_LAYER_ORDER_MULTICAVITY_GATE_CU_SELECTED_NEXT_ACTION,
    selectedNextFile:
      POST_V1_WALL_FLAT_LAYER_ORDER_MULTICAVITY_GATE_CU_SELECTED_NEXT_FILE,
    selectedNextLabel:
      POST_V1_WALL_FLAT_LAYER_ORDER_MULTICAVITY_GATE_CU_SELECTED_NEXT_LABEL,
    selectionStatus:
      POST_V1_WALL_FLAT_LAYER_ORDER_MULTICAVITY_GATE_CU_SELECTION_STATUS,
    targetOutputs: {
      building: POST_V1_GATE_CU_BUILDING_TARGET_OUTPUTS,
      field: POST_V1_GATE_CU_FIELD_TARGET_OUTPUTS,
      lab: POST_V1_GATE_CU_LAB_TARGET_OUTPUTS
    },
    valuePins: POST_V1_GATE_CU_VALUE_PINS
  };
}
