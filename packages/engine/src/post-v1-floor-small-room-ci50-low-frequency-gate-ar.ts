export const POST_V1_FLOOR_SMALL_ROOM_CI50_LOW_FREQUENCY_GATE_AR_LANDED_GATE =
  "post_v1_floor_small_room_ci50_low_frequency_gate_ar_plan" as const;

export const POST_V1_FLOOR_SMALL_ROOM_CI50_LOW_FREQUENCY_GATE_AR_SELECTION_STATUS =
  "post_v1_floor_small_room_ci50_low_frequency_gate_ar_landed_selected_next_numeric_coverage_gap_gate_as" as const;

export const POST_V1_FLOOR_SMALL_ROOM_CI50_LOW_FREQUENCY_GATE_AR_SELECTED_NEXT_ACTION =
  "post_v1_next_numeric_coverage_gap_gate_as_plan" as const;

export const POST_V1_FLOOR_SMALL_ROOM_CI50_LOW_FREQUENCY_GATE_AR_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-as-contract.test.ts" as const;

export const POST_V1_FLOOR_SMALL_ROOM_CI50_LOW_FREQUENCY_GATE_AR_SELECTED_NEXT_LABEL =
  "post-V1 next numeric coverage gap Gate AS" as const;

export const POST_V1_GATE_AR_SMALL_ROOM_CI50_INPUT_PIN = {
  ciDb: -1,
  ci50_2500Db: 4,
  enableSmallRoomEstimate: true
} as const;

export const POST_V1_GATE_AR_SMALL_ROOM_CI50_BOUND_VALUE_PIN = {
  ci: -1,
  ci50_2500: 4,
  lPrimeNT50UpperBound: 53,
  lPrimeNTwUpperBound: 49,
  lnWPlusCIUpperBound: 45,
  lnWUpperBound: 46
} as const;

export const POST_V1_GATE_AR_SMALL_ROOM_CI50_LIVE_VALUE_PIN = {
  ci50_2500: 4,
  lPrimeNT50: 57,
  lPrimeNTw: 53,
  lnW: 50
} as const;

export const POST_V1_GATE_AR_SMALL_ROOM_CI50_BOUND_SUPPORTED_OUTPUTS = [
  "Ln,w",
  "CI",
  "Ln,w+CI",
  "L'nT,w",
  "CI,50-2500",
  "L'nT,50"
] as const;

export const POST_V1_GATE_AR_SMALL_ROOM_CI50_BOUND_BLOCKED_OUTPUTS = ["L'n,w", "IIC", "AIIC"] as const;

export const POST_V1_GATE_AR_SMALL_ROOM_CI50_LIVE_SUPPORTED_OUTPUTS = [
  "CI,50-2500",
  "L'nT,w",
  "L'nT,50"
] as const;

export const POST_V1_GATE_AR_SMALL_ROOM_CI50_LIVE_BLOCKED_OUTPUTS = ["L'n,w", "IIC", "AIIC"] as const;
