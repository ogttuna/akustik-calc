export const POST_V1_WALL_MIXED_LAB_FIELD_OUTPUT_GATE_T_LANDED_GATE =
  "post_v1_wall_mixed_lab_field_output_gate_t_plan" as const;

export const POST_V1_WALL_MIXED_LAB_FIELD_OUTPUT_GATE_T_SELECTION_STATUS =
  "post_v1_wall_mixed_lab_field_output_gate_t_landed_selected_next_numeric_coverage_gap_gate_u" as const;

export const POST_V1_WALL_MIXED_LAB_FIELD_OUTPUT_GATE_T_SELECTED_NEXT_ACTION =
  "post_v1_next_numeric_coverage_gap_gate_u_plan" as const;

export const POST_V1_WALL_MIXED_LAB_FIELD_OUTPUT_GATE_T_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-u-contract.test.ts" as const;

export const POST_V1_WALL_MIXED_LAB_FIELD_OUTPUT_GATE_T_SELECTED_NEXT_LABEL =
  "post-V1 next numeric coverage gap Gate U" as const;

export const POST_V1_GATE_T_WALL_MIXED_LAB_FIELD_SUPPORTED_OUTPUTS = [
  "Rw",
  "STC",
  "C",
  "Ctr",
  "R'w",
  "Dn,w",
  "Dn,A",
  "DnT,w",
  "DnT,A"
] as const;

export const POST_V1_GATE_T_WALL_MIXED_LAB_FIELD_FIELD_VALUE_PINS = [
  { metric: "R'w", value: 39 },
  { metric: "DnT,w", value: 42 },
  { metric: "DnT,A", value: 40.9 },
  { metric: "Dn,w", value: 40 },
  { metric: "Dn,A", value: 38.5 }
] as const;
