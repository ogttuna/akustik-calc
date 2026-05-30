export const POST_V1_WALL_MULTILEAF_MIXED_LAB_FIELD_OUTPUT_GATE_U_LANDED_GATE =
  "post_v1_wall_multileaf_mixed_lab_field_output_gate_u_plan" as const;

export const POST_V1_WALL_MULTILEAF_MIXED_LAB_FIELD_OUTPUT_GATE_U_SELECTION_STATUS =
  "post_v1_wall_multileaf_mixed_lab_field_output_gate_u_landed_selected_next_numeric_coverage_gap_gate_v" as const;

export const POST_V1_WALL_MULTILEAF_MIXED_LAB_FIELD_OUTPUT_GATE_U_SELECTED_NEXT_ACTION =
  "post_v1_next_numeric_coverage_gap_gate_v_plan" as const;

export const POST_V1_WALL_MULTILEAF_MIXED_LAB_FIELD_OUTPUT_GATE_U_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-v-contract.test.ts" as const;

export const POST_V1_WALL_MULTILEAF_MIXED_LAB_FIELD_OUTPUT_GATE_U_SELECTED_NEXT_LABEL =
  "post-V1 next numeric coverage gap Gate V" as const;

export const POST_V1_GATE_U_WALL_MULTILEAF_MIXED_LAB_FIELD_SUPPORTED_OUTPUTS = [
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

export const POST_V1_GATE_U_WALL_MULTILEAF_MIXED_LAB_FIELD_FIELD_VALUE_PINS = [
  { metric: "R'w", value: 50 },
  { metric: "DnT,w", value: 53 },
  { metric: "DnT,A", value: 50.9 },
  { metric: "Dn,w", value: 50 },
  { metric: "Dn,A", value: 48.5 }
] as const;
