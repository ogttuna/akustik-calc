export const POST_V1_WALL_FRAMED_BUILDING_ADAPTER_GATE_AX_LANDED_GATE =
  "post_v1_wall_framed_building_adapter_gate_ax_plan" as const;

export const POST_V1_WALL_FRAMED_BUILDING_ADAPTER_GATE_AX_SELECTION_STATUS =
  "post_v1_wall_framed_building_adapter_gate_ax_landed_selected_next_numeric_coverage_gap_gate_ay" as const;

export const POST_V1_WALL_FRAMED_BUILDING_ADAPTER_GATE_AX_SELECTED_NEXT_ACTION =
  "post_v1_next_numeric_coverage_gap_gate_ay_plan" as const;

export const POST_V1_WALL_FRAMED_BUILDING_ADAPTER_GATE_AX_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ay-contract.test.ts" as const;

export const POST_V1_WALL_FRAMED_BUILDING_ADAPTER_GATE_AX_SELECTED_NEXT_LABEL =
  "post-V1 next numeric coverage gap Gate AY" as const;

export const POST_V1_GATE_AX_WALL_FRAMED_TARGET_OUTPUTS = [
  "Rw",
  "STC",
  "C",
  "Ctr",
  "R'w",
  "Dn,w",
  "Dn,A",
  "DnT,w",
  "DnT,A"
] as const;

export const POST_V1_GATE_AX_WALL_FRAMED_LAB_OUTPUTS = [
  "Rw",
  "STC",
  "C",
  "Ctr"
] as const;

export const POST_V1_GATE_AX_WALL_FRAMED_BUILDING_OUTPUTS = [
  "R'w",
  "Dn,w",
  "Dn,A",
  "DnT,w",
  "DnT,A"
] as const;

export const POST_V1_GATE_AX_WALL_FRAMED_VALUE_PINS = [
  {
    caseId: "wall-lsf-knauf",
    values: {
      "C": -1.4,
      "Ctr": -6.4,
      "Dn,A": 49.6,
      "Dn,w": 51,
      "DnT,A": 51.1,
      "DnT,w": 52,
      "R'w": 51,
      "Rw": 51,
      "STC": 51
    }
  },
  {
    caseId: "wall-timber-stud",
    values: {
      "C": 0.5,
      "Ctr": -4.2,
      "Dn,A": 42.4,
      "Dn,w": 42,
      "DnT,A": 43.9,
      "DnT,w": 43,
      "R'w": 42,
      "Rw": 50,
      "STC": 50
    }
  }
] as const;
