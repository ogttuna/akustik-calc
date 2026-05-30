export const POST_V1_FLOOR_EXPLICIT_DELTALW_LAB_COMPANION_GATE_AU_LANDED_GATE =
  "post_v1_floor_explicit_deltalw_lab_companion_gate_au_plan" as const;

export const POST_V1_FLOOR_EXPLICIT_DELTALW_LAB_COMPANION_GATE_AU_SELECTION_STATUS =
  "post_v1_floor_explicit_deltalw_lab_companion_gate_au_landed_selected_next_numeric_coverage_gap_gate_av" as const;

export const POST_V1_FLOOR_EXPLICIT_DELTALW_LAB_COMPANION_GATE_AU_SELECTED_NEXT_ACTION =
  "post_v1_next_numeric_coverage_gap_gate_av_plan" as const;

export const POST_V1_FLOOR_EXPLICIT_DELTALW_LAB_COMPANION_GATE_AU_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-av-contract.test.ts" as const;

export const POST_V1_FLOOR_EXPLICIT_DELTALW_LAB_COMPANION_GATE_AU_SELECTED_NEXT_LABEL =
  "post-V1 next numeric coverage gap Gate AV" as const;

export const POST_V1_GATE_AU_EXPLICIT_DELTALW_LAB_COMPANION_INPUT_PIN = {
  ci50_2500Db: 4,
  ciDb: -1,
  deltaLwDb: 26
} as const;

export const POST_V1_GATE_AU_EXPLICIT_DELTALW_LAB_COMPANION_SUPPORTED_OUTPUTS = [
  "Ln,w",
  "DeltaLw",
  "CI",
  "Ln,w+CI",
  "CI,50-2500"
] as const;

export const POST_V1_GATE_AU_EXPLICIT_DELTALW_LAB_COMPANION_BLOCKED_OUTPUTS = [
  "L'n,w",
  "L'nT,w",
  "L'nT,50",
  "IIC",
  "AIIC"
] as const;

export const POST_V1_GATE_AU_EXPLICIT_DELTALW_LAB_COMPANION_VALUE_PIN = {
  basis: "predictor_explicit_delta_heavy_reference_derived",
  ci: -1,
  ci50_2500: 4,
  deltaLw: 26,
  lnW: 52,
  lnWPlusCI: 51
} as const;
