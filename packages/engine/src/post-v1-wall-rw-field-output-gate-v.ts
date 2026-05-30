export const POST_V1_WALL_RW_FIELD_OUTPUT_GATE_V_LANDED_GATE =
  "post_v1_wall_rw_field_output_gate_v_plan" as const;

export const POST_V1_WALL_RW_FIELD_OUTPUT_GATE_V_SELECTION_STATUS =
  "post_v1_wall_rw_field_output_gate_v_landed_selected_next_numeric_coverage_gap_gate_w" as const;

export const POST_V1_WALL_RW_FIELD_OUTPUT_GATE_V_SELECTED_NEXT_ACTION =
  "post_v1_next_numeric_coverage_gap_gate_w_plan" as const;

export const POST_V1_WALL_RW_FIELD_OUTPUT_GATE_V_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-w-contract.test.ts" as const;

export const POST_V1_WALL_RW_FIELD_OUTPUT_GATE_V_SELECTED_NEXT_LABEL =
  "post-V1 next numeric coverage gap Gate W" as const;

export const POST_V1_GATE_V_WALL_RW_FIELD_CORE_OUTPUTS = ["Rw", "R'w", "DnT,w"] as const;

export const POST_V1_GATE_V_DOUBLE_LEAF_RW_FIELD_VALUE_PINS = [
  { metric: "R'w", value: 39 },
  { metric: "DnT,w", value: 42 }
] as const;

export const POST_V1_GATE_V_MULTILEAF_RW_FIELD_VALUE_PINS = [
  { metric: "R'w", value: 50 },
  { metric: "DnT,w", value: 53 }
] as const;
