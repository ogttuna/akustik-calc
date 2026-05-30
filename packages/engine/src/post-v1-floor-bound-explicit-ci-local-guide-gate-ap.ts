export const POST_V1_FLOOR_BOUND_EXPLICIT_CI_LOCAL_GUIDE_GATE_AP_LANDED_GATE =
  "post_v1_floor_bound_explicit_ci_local_guide_gate_ap_plan" as const;

export const POST_V1_FLOOR_BOUND_EXPLICIT_CI_LOCAL_GUIDE_GATE_AP_SELECTION_STATUS =
  "post_v1_floor_bound_explicit_ci_local_guide_gate_ap_landed_selected_next_numeric_coverage_gap_gate_aq" as const;

export const POST_V1_FLOOR_BOUND_EXPLICIT_CI_LOCAL_GUIDE_GATE_AP_SELECTED_NEXT_ACTION =
  "post_v1_next_numeric_coverage_gap_gate_aq_plan" as const;

export const POST_V1_FLOOR_BOUND_EXPLICIT_CI_LOCAL_GUIDE_GATE_AP_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-aq-contract.test.ts" as const;

export const POST_V1_FLOOR_BOUND_EXPLICIT_CI_LOCAL_GUIDE_GATE_AP_SELECTED_NEXT_LABEL =
  "post-V1 next numeric coverage gap Gate AQ" as const;

export const POST_V1_GATE_AP_BOUND_EXPLICIT_CI_LOCAL_GUIDE_INPUT_PIN = {
  ciDb: -1,
  explicitHdDb: 0,
  explicitKDb: 3,
  guideMassRatio: 2.5,
  guideMassRatioBracket: "2 < r <= 3"
} as const;

export const POST_V1_GATE_AP_BOUND_EXPLICIT_CI_LOCAL_GUIDE_SUPPORTED_OUTPUTS = [
  "Ln,w",
  "CI",
  "Ln,w+CI",
  "L'n,w",
  "L'nT,50"
] as const;

export const POST_V1_GATE_AP_BOUND_EXPLICIT_CI_LOCAL_GUIDE_BLOCKED_OUTPUTS = [
  "L'nT,w",
  "IIC",
  "AIIC"
] as const;

export const POST_V1_GATE_AP_BOUND_EXPLICIT_CI_LOCAL_GUIDE_VALUE_PINS = [
  {
    caseId: "floor-open-web-bound",
    ci: -1,
    lPrimeNT50UpperBound: 53,
    lPrimeNWUpperBound: 54,
    lnWPlusCIUpperBound: 50,
    lnWUpperBound: 51
  },
  {
    caseId: "floor-ubiq-steel-300-unspecified-bound",
    ci: -1,
    lPrimeNT50UpperBound: 53,
    lPrimeNWUpperBound: 54,
    lnWPlusCIUpperBound: 50,
    lnWUpperBound: 51
  },
  {
    caseId: "floor-ubiq-steel-200-unspecified-bound",
    ci: -1,
    lPrimeNT50UpperBound: 55,
    lPrimeNWUpperBound: 56,
    lnWPlusCIUpperBound: 52,
    lnWUpperBound: 53
  },
  {
    caseId: "floor-ubiq-steel-250-bound",
    ci: -1,
    lPrimeNT50UpperBound: 54,
    lPrimeNWUpperBound: 55,
    lnWPlusCIUpperBound: 51,
    lnWUpperBound: 52
  }
] as const;
