export const POST_V1_FLOOR_COMBINED_BOUND_EXPLICIT_CI_SPLIT_GATE_AQ_LANDED_GATE =
  "post_v1_floor_combined_bound_explicit_ci_split_gate_aq_plan" as const;

export const POST_V1_FLOOR_COMBINED_BOUND_EXPLICIT_CI_SPLIT_GATE_AQ_SELECTION_STATUS =
  "post_v1_floor_combined_bound_explicit_ci_split_gate_aq_landed_selected_next_numeric_coverage_gap_gate_ar" as const;

export const POST_V1_FLOOR_COMBINED_BOUND_EXPLICIT_CI_SPLIT_GATE_AQ_SELECTED_NEXT_ACTION =
  "post_v1_next_numeric_coverage_gap_gate_ar_plan" as const;

export const POST_V1_FLOOR_COMBINED_BOUND_EXPLICIT_CI_SPLIT_GATE_AQ_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ar-contract.test.ts" as const;

export const POST_V1_FLOOR_COMBINED_BOUND_EXPLICIT_CI_SPLIT_GATE_AQ_SELECTED_NEXT_LABEL =
  "post-V1 next numeric coverage gap Gate AR" as const;

export const POST_V1_GATE_AQ_COMBINED_BOUND_EXPLICIT_CI_SPLIT_INPUT_PIN = {
  ciDb: -1,
  fieldKDb: 3,
  receivingRoomVolumeM3: 32
} as const;

export const POST_V1_GATE_AQ_COMBINED_BOUND_EXPLICIT_CI_SPLIT_VALUE_PIN = {
  ci: -1,
  lPrimeNT50UpperBound: 48,
  lPrimeNTwUpperBound: 48.9,
  lPrimeNWUpperBound: 49,
  lnWPlusCIUpperBound: 45,
  lnWUpperBound: 46
} as const;

export const POST_V1_GATE_AQ_COMBINED_BOUND_EXPLICIT_CI_SPLIT_SUPPORTED_OUTPUTS = [
  "Ln,w",
  "CI",
  "Ln,w+CI",
  "L'n,w",
  "L'nT,w",
  "L'nT,50"
] as const;

export const POST_V1_GATE_AQ_COMBINED_BOUND_EXPLICIT_CI_SPLIT_BLOCKED_OUTPUTS = [
  "CI,50-2500",
  "IIC",
  "AIIC"
] as const;
