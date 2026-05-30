export const POST_V1_FLOOR_EXPLICIT_DELTALW_FIELD_COMPANION_GATE_AV_LANDED_GATE =
  "post_v1_floor_explicit_deltalw_field_companion_gate_av_plan" as const;

export const POST_V1_FLOOR_EXPLICIT_DELTALW_FIELD_COMPANION_GATE_AV_SELECTION_STATUS =
  "post_v1_floor_explicit_deltalw_field_companion_gate_av_landed_selected_next_numeric_coverage_gap_gate_aw" as const;

export const POST_V1_FLOOR_EXPLICIT_DELTALW_FIELD_COMPANION_GATE_AV_SELECTED_NEXT_ACTION =
  "post_v1_next_numeric_coverage_gap_gate_aw_plan" as const;

export const POST_V1_FLOOR_EXPLICIT_DELTALW_FIELD_COMPANION_GATE_AV_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-aw-contract.test.ts" as const;

export const POST_V1_FLOOR_EXPLICIT_DELTALW_FIELD_COMPANION_GATE_AV_SELECTED_NEXT_LABEL =
  "post-V1 next numeric coverage gap Gate AW" as const;

export const POST_V1_GATE_AV_EXPLICIT_DELTALW_FIELD_COMPANION_INPUT_PIN = {
  ci50_2500Db: 4,
  ciDb: -1,
  deltaLwDb: 26,
  fieldKDb: 2,
  receivingRoomVolumeM3: 50
} as const;

export const POST_V1_GATE_AV_EXPLICIT_DELTALW_FIELD_COMPANION_SUPPORTED_OUTPUTS = [
  "Ln,w",
  "DeltaLw",
  "CI",
  "Ln,w+CI",
  "CI,50-2500",
  "L'n,w",
  "L'nT,w",
  "L'nT,50"
] as const;

export const POST_V1_GATE_AV_EXPLICIT_DELTALW_FIELD_COMPANION_BLOCKED_OUTPUTS = [
  "IIC",
  "AIIC"
] as const;

export const POST_V1_GATE_AV_EXPLICIT_DELTALW_FIELD_COMPANION_VALUE_PIN = {
  basis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
  ci: -1,
  ci50_2500: 4,
  deltaLw: 26,
  lPrimeNT50: 56,
  lPrimeNTw: 52,
  lPrimeNW: 54,
  lnW: 52,
  lnWPlusCI: 51
} as const;
