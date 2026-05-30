export const POST_V1_WALL_BUILDING_LAB_COMPANION_GATE_AW_LANDED_GATE =
  "post_v1_wall_building_lab_companion_gate_aw_plan" as const;

export const POST_V1_WALL_BUILDING_LAB_COMPANION_GATE_AW_SELECTION_STATUS =
  "post_v1_wall_building_lab_companion_gate_aw_landed_selected_next_numeric_coverage_gap_gate_ax" as const;

export const POST_V1_WALL_BUILDING_LAB_COMPANION_GATE_AW_SELECTED_NEXT_ACTION =
  "post_v1_next_numeric_coverage_gap_gate_ax_plan" as const;

export const POST_V1_WALL_BUILDING_LAB_COMPANION_GATE_AW_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ax-contract.test.ts" as const;

export const POST_V1_WALL_BUILDING_LAB_COMPANION_GATE_AW_SELECTED_NEXT_LABEL =
  "post-V1 next numeric coverage gap Gate AX" as const;

export const POST_V1_GATE_AW_WALL_BUILDING_LAB_COMPANION_TARGET_OUTPUTS = [
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

export const POST_V1_GATE_AW_WALL_BUILDING_LAB_COMPANION_LAB_OUTPUTS = [
  "Rw",
  "STC",
  "C",
  "Ctr"
] as const;

export const POST_V1_GATE_AW_WALL_BUILDING_LAB_COMPANION_BUILDING_OUTPUTS = [
  "R'w",
  "Dn,w",
  "Dn,A",
  "DnT,w",
  "DnT,A"
] as const;

export const POST_V1_GATE_AW_WALL_BUILDING_LAB_COMPANION_VALUE_PINS = [
  {
    caseId: "wall-screening-concrete",
    values: {
      "C": -1.6,
      "Ctr": -6.3,
      "Dn,A": 53.4,
      "Dn,w": 55,
      "DnT,A": 54.9,
      "DnT,w": 56,
      "R'w": 55,
      "Rw": 55,
      "STC": 55
    }
  },
  {
    caseId: "wall-heavy-composite-hint-suppression",
    values: {
      "C": -1.4,
      "Ctr": -6.1,
      "Dn,A": 58.6,
      "Dn,w": 60,
      "DnT,A": 60.1,
      "DnT,w": 61,
      "R'w": 60,
      "Rw": 60,
      "STC": 60
    }
  },
  {
    caseId: "wall-masonry-brick",
    values: {
      "C": -0.2,
      "Ctr": -4.7,
      "Dn,A": 39.8,
      "Dn,w": 40,
      "DnT,A": 41.3,
      "DnT,w": 42,
      "R'w": 40,
      "Rw": 40,
      "STC": 40
    }
  },
  {
    caseId: "wall-clt-local",
    values: {
      "C": -1.8,
      "Ctr": -7.6,
      "Dn,A": 39.2,
      "Dn,w": 41,
      "DnT,A": 40.7,
      "DnT,w": 42,
      "R'w": 41,
      "Rw": 41,
      "STC": 41
    }
  },
  {
    caseId: "wall-held-aac",
    values: {
      "C": -1.9,
      "Ctr": -8,
      "Dn,A": 58.1,
      "Dn,w": 60,
      "DnT,A": 59.6,
      "DnT,w": 61,
      "R'w": 60,
      "Rw": 60,
      "STC": 60
    }
  }
] as const;
