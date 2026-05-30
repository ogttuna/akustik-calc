export const POST_V1_FLOOR_BOUND_LOW_FREQUENCY_FIELD_COMPANION_GATE_AK_LANDED_GATE =
  "post_v1_floor_bound_low_frequency_field_companion_gate_ak_plan" as const;

export const POST_V1_FLOOR_BOUND_LOW_FREQUENCY_FIELD_COMPANION_GATE_AK_SELECTION_STATUS =
  "post_v1_floor_bound_low_frequency_field_companion_gate_ak_landed_selected_next_numeric_coverage_gap_gate_al" as const;

export const POST_V1_FLOOR_BOUND_LOW_FREQUENCY_FIELD_COMPANION_GATE_AK_SELECTED_NEXT_ACTION =
  "post_v1_next_numeric_coverage_gap_gate_al_plan" as const;

export const POST_V1_FLOOR_BOUND_LOW_FREQUENCY_FIELD_COMPANION_GATE_AK_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-al-contract.test.ts" as const;

export const POST_V1_FLOOR_BOUND_LOW_FREQUENCY_FIELD_COMPANION_GATE_AK_SELECTED_NEXT_LABEL =
  "post-V1 next numeric coverage gap Gate AL" as const;

export const POST_V1_GATE_AK_FLOOR_BOUND_LOW_FREQUENCY_SUPPORTED_OUTPUTS = [
  "Ln,w",
  "L'n,w",
  "L'nT,w",
  "L'nT,50"
] as const;

export const POST_V1_GATE_AK_FLOOR_BOUND_LOW_FREQUENCY_AST_DISABLE_OUTPUTS = [
  "IIC",
  "AIIC"
] as const;

export const POST_V1_GATE_AK_FLOOR_BOUND_LOW_FREQUENCY_VALUE_PINS = [
  {
    caseId: "floor-open-web-bound",
    lPrimeNT50UpperBound: 55.2,
    lPrimeNTwUpperBound: 51.2
  },
  {
    caseId: "floor-ubiq-steel-300-unspecified-bound",
    lPrimeNT50UpperBound: 55.2,
    lPrimeNTwUpperBound: 51.2
  },
  {
    caseId: "floor-ubiq-steel-200-unspecified-bound",
    lPrimeNT50UpperBound: 57.2,
    lPrimeNTwUpperBound: 53.2
  },
  {
    caseId: "floor-ubiq-steel-250-bound",
    lPrimeNT50UpperBound: 56.2,
    lPrimeNTwUpperBound: 52.2
  }
] as const;
