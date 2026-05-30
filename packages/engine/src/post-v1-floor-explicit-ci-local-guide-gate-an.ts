export const POST_V1_FLOOR_EXPLICIT_CI_LOCAL_GUIDE_GATE_AN_LANDED_GATE =
  "post_v1_floor_explicit_ci_local_guide_gate_an_plan" as const;

export const POST_V1_FLOOR_EXPLICIT_CI_LOCAL_GUIDE_GATE_AN_SELECTION_STATUS =
  "post_v1_floor_explicit_ci_local_guide_gate_an_landed_selected_next_numeric_coverage_gap_gate_ao" as const;

export const POST_V1_FLOOR_EXPLICIT_CI_LOCAL_GUIDE_GATE_AN_SELECTED_NEXT_ACTION =
  "post_v1_next_numeric_coverage_gap_gate_ao_plan" as const;

export const POST_V1_FLOOR_EXPLICIT_CI_LOCAL_GUIDE_GATE_AN_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ao-contract.test.ts" as const;

export const POST_V1_FLOOR_EXPLICIT_CI_LOCAL_GUIDE_GATE_AN_SELECTED_NEXT_LABEL =
  "post-V1 next numeric coverage gap Gate AO" as const;

export const POST_V1_GATE_AN_EXPLICIT_CI_LOCAL_GUIDE_INPUT_PIN = {
  ciDb: -1,
  explicitHdDb: 0,
  explicitKDb: 3,
  guideMassRatio: 2.5,
  guideMassRatioBracket: "2 < r <= 3",
  receivingRoomVolumeM3: 60
} as const;

export const POST_V1_GATE_AN_EXPLICIT_CI_LOCAL_GUIDE_VALUE_PINS = [
  {
    caseId: "floor-hollow-core-vinyl",
    basis: "mixed_exact_plus_estimated_local_guide",
    ci: -1,
    lPrimeNT50: 50,
    lPrimeNTw: 48.2,
    lPrimeNW: 51,
    lnW: 48,
    lnWPlusCI: 47
  },
  {
    caseId: "floor-heavy-concrete",
    basis: "mixed_predicted_plus_estimated_local_guide",
    ci: -1,
    lPrimeNT50: 52,
    lPrimeNTw: 50.2,
    lPrimeNW: 53,
    lnW: 50,
    lnWPlusCI: 49
  },
  {
    caseId: "floor-steel-fallback",
    basis: "mixed_predicted_plus_estimated_local_guide",
    ci: -1,
    lPrimeNT50: 60,
    lPrimeNTw: 58.2,
    lPrimeNW: 61,
    lnW: 58,
    lnWPlusCI: 57
  }
] as const;
