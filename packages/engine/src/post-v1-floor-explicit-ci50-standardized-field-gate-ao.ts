export const POST_V1_FLOOR_EXPLICIT_CI50_STANDARDIZED_FIELD_GATE_AO_LANDED_GATE =
  "post_v1_floor_explicit_ci50_standardized_field_gate_ao_plan" as const;

export const POST_V1_FLOOR_EXPLICIT_CI50_STANDARDIZED_FIELD_GATE_AO_SELECTION_STATUS =
  "post_v1_floor_explicit_ci50_standardized_field_gate_ao_landed_selected_next_numeric_coverage_gap_gate_ap" as const;

export const POST_V1_FLOOR_EXPLICIT_CI50_STANDARDIZED_FIELD_GATE_AO_SELECTED_NEXT_ACTION =
  "post_v1_next_numeric_coverage_gap_gate_ap_plan" as const;

export const POST_V1_FLOOR_EXPLICIT_CI50_STANDARDIZED_FIELD_GATE_AO_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ap-contract.test.ts" as const;

export const POST_V1_FLOOR_EXPLICIT_CI50_STANDARDIZED_FIELD_GATE_AO_SELECTED_NEXT_LABEL =
  "post-V1 next numeric coverage gap Gate AP" as const;

export const POST_V1_GATE_AO_EXPLICIT_CI50_STANDARDIZED_FIELD_INPUT_PIN = {
  ci50_2500Db: 2,
  explicitKDb: 3,
  receivingRoomVolumeM3: 60
} as const;

export const POST_V1_GATE_AO_EXPLICIT_CI50_STANDARDIZED_FIELD_VALUE_PINS = [
  {
    caseId: "floor-hollow-core-vinyl",
    basis: "mixed_exact_plus_estimated_standardized_field_volume_normalization",
    ci50_2500: 2,
    lPrimeNT50: 50.2,
    lPrimeNTw: 48.2,
    lPrimeNW: 51,
    lnW: 48
  },
  {
    caseId: "floor-heavy-concrete",
    basis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
    ci50_2500: 2,
    lPrimeNT50: 52.2,
    lPrimeNTw: 50.2,
    lPrimeNW: 53,
    lnW: 50
  },
  {
    caseId: "floor-steel-fallback",
    basis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
    ci50_2500: 2,
    lPrimeNT50: 60.2,
    lPrimeNTw: 58.2,
    lPrimeNW: 61,
    lnW: 58
  }
] as const;
