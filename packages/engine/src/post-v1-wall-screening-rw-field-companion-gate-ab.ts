export const POST_V1_WALL_SCREENING_RW_FIELD_COMPANION_GATE_AB_LANDED_GATE =
  "post_v1_wall_screening_rw_field_companion_gate_ab_plan" as const;

export const POST_V1_WALL_SCREENING_RW_FIELD_COMPANION_GATE_AB_SELECTION_STATUS =
  "post_v1_wall_screening_rw_field_companion_gate_ab_landed_selected_next_numeric_coverage_gap_gate_ac" as const;

export const POST_V1_WALL_SCREENING_RW_FIELD_COMPANION_GATE_AB_SELECTED_NEXT_ACTION =
  "post_v1_next_numeric_coverage_gap_gate_ac_plan" as const;

export const POST_V1_WALL_SCREENING_RW_FIELD_COMPANION_GATE_AB_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ac-contract.test.ts" as const;

export const POST_V1_WALL_SCREENING_RW_FIELD_COMPANION_GATE_AB_SELECTED_NEXT_LABEL =
  "post-V1 next numeric coverage gap Gate AC" as const;

export const POST_V1_GATE_AB_WALL_SCREENING_RW_OUTPUTS = ["Rw"] as const;

export const POST_V1_GATE_AB_WALL_SCREENING_RW_VALUE_PINS = [
  { caseId: "wall-masonry-brick", metric: "Rw", value: 40 },
  { caseId: "wall-clt-local", metric: "Rw", value: 41 }
] as const;
