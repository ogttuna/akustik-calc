export const POST_V1_FLOOR_TUAS_C11C_ISO_IMPACT_GATE_AY_LANDED_GATE =
  "post_v1_floor_tuas_c11c_iso_impact_gate_ay_plan" as const;

export const POST_V1_FLOOR_TUAS_C11C_ISO_IMPACT_GATE_AY_SELECTION_STATUS =
  "post_v1_floor_tuas_c11c_iso_impact_gate_ay_landed_selected_next_numeric_coverage_gap_gate_az" as const;

export const POST_V1_FLOOR_TUAS_C11C_ISO_IMPACT_GATE_AY_SELECTED_NEXT_ACTION =
  "post_v1_next_numeric_coverage_gap_gate_az_plan" as const;

export const POST_V1_FLOOR_TUAS_C11C_ISO_IMPACT_GATE_AY_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-az-contract.test.ts" as const;

export const POST_V1_FLOOR_TUAS_C11C_ISO_IMPACT_GATE_AY_SELECTED_NEXT_LABEL =
  "post-V1 next numeric coverage gap Gate AZ" as const;

export const POST_V1_GATE_AY_TUAS_C11C_LAB_IMPACT_OUTPUTS = [
  "Ln,w",
  "CI",
  "CI,50-2500",
  "Ln,w+CI"
] as const;

export const POST_V1_GATE_AY_TUAS_C11C_FIELD_IMPACT_OUTPUTS = [
  "L'n,w",
  "L'nT,w",
  "L'nT,50"
] as const;

export const POST_V1_GATE_AY_TUAS_C11C_UNSUPPORTED_OUTPUTS = [
  "DeltaLw",
  "IIC",
  "AIIC"
] as const;

export const POST_V1_GATE_AY_TUAS_C11C_VALUE_PINS = {
  lab: {
    "CI": 1,
    "CI,50-2500": 1,
    "Ln,w": 59,
    "Ln,w+CI": 60
  },
  field: {
    "L'n,w": 62,
    "L'nT,w": 59.2,
    "L'nT,50": 60.2
  },
  screeningAirborne: {
    "C": -1,
    "Ctr": -5.7,
    "DnT,w": 49,
    "R'w": 47,
    "Rw": 47,
    "STC": 47
  }
} as const;
