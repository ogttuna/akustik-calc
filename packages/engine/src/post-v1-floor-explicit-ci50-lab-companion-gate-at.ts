export const POST_V1_FLOOR_EXPLICIT_CI50_LAB_COMPANION_GATE_AT_LANDED_GATE =
  "post_v1_floor_explicit_ci50_lab_companion_gate_at_plan" as const;

export const POST_V1_FLOOR_EXPLICIT_CI50_LAB_COMPANION_GATE_AT_SELECTION_STATUS =
  "post_v1_floor_explicit_ci50_lab_companion_gate_at_landed_selected_next_numeric_coverage_gap_gate_au" as const;

export const POST_V1_FLOOR_EXPLICIT_CI50_LAB_COMPANION_GATE_AT_SELECTED_NEXT_ACTION =
  "post_v1_next_numeric_coverage_gap_gate_au_plan" as const;

export const POST_V1_FLOOR_EXPLICIT_CI50_LAB_COMPANION_GATE_AT_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-au-contract.test.ts" as const;

export const POST_V1_FLOOR_EXPLICIT_CI50_LAB_COMPANION_GATE_AT_SELECTED_NEXT_LABEL =
  "post-V1 next numeric coverage gap Gate AU" as const;

export const POST_V1_GATE_AT_EXPLICIT_CI50_LAB_COMPANION_INPUT_PIN = {
  ci50_2500Db: 4
} as const;

export const POST_V1_GATE_AT_EXPLICIT_CI50_LAB_COMPANION_LIVE_SUPPORTED_OUTPUTS = [
  "CI,50-2500",
  "Ln,w"
] as const;

export const POST_V1_GATE_AT_EXPLICIT_CI50_LAB_COMPANION_BOUND_SUPPORTED_OUTPUTS = [
  "CI,50-2500",
  "Ln,w"
] as const;

export const POST_V1_GATE_AT_EXPLICIT_CI50_LAB_COMPANION_BLOCKED_OUTPUTS = [
  "CI",
  "Ln,w+CI",
  "L'n,w",
  "L'nT,w",
  "L'nT,50",
  "IIC",
  "AIIC"
] as const;

export const POST_V1_GATE_AT_EXPLICIT_CI50_LAB_COMPANION_LIVE_VALUE_PINS = [
  {
    basis: "official_floor_system_exact_match",
    caseId: "floor-hollow-core-vinyl",
    ci50_2500: 4,
    lnW: 48
  },
  {
    basis: "predictor_heavy_concrete_published_upper_treatment_estimate",
    caseId: "floor-heavy-concrete",
    ci50_2500: 4,
    lnW: 50
  },
  {
    basis: "predictor_floor_system_family_archetype_estimate",
    caseId: "floor-steel-fallback",
    ci50_2500: 4,
    lnW: 58
  }
] as const;

export const POST_V1_GATE_AT_EXPLICIT_CI50_LAB_COMPANION_BOUND_VALUE_PINS = [
  {
    basis: "official_floor_system_bound_support",
    caseId: "floor-open-web-bound",
    ci50_2500: 4,
    lnWUpperBound: 51
  },
  {
    basis: "predictor_lightweight_steel_missing_support_form_bound_estimate",
    caseId: "floor-ubiq-steel-300-unspecified-bound",
    ci50_2500: 4,
    lnWUpperBound: 51
  },
  {
    basis: "predictor_lightweight_steel_bound_interpolation_estimate",
    caseId: "floor-ubiq-steel-200-unspecified-bound",
    ci50_2500: 4,
    lnWUpperBound: 53
  },
  {
    basis: "predictor_lightweight_steel_bound_interpolation_estimate",
    caseId: "floor-ubiq-steel-250-bound",
    ci50_2500: 4,
    lnWUpperBound: 52
  }
] as const;
