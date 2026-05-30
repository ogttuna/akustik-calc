export const POST_V1_WALL_FRAMED_LAB_SPECTRUM_COMPANION_GATE_AE_LANDED_GATE =
  "post_v1_wall_framed_lab_spectrum_companion_gate_ae_plan" as const;

export const POST_V1_WALL_FRAMED_LAB_SPECTRUM_COMPANION_GATE_AE_SELECTION_STATUS =
  "post_v1_wall_framed_lab_spectrum_companion_gate_ae_landed_selected_next_numeric_coverage_gap_gate_af" as const;

export const POST_V1_WALL_FRAMED_LAB_SPECTRUM_COMPANION_GATE_AE_SELECTED_NEXT_ACTION =
  "post_v1_next_numeric_coverage_gap_gate_af_plan" as const;

export const POST_V1_WALL_FRAMED_LAB_SPECTRUM_COMPANION_GATE_AE_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-af-contract.test.ts" as const;

export const POST_V1_WALL_FRAMED_LAB_SPECTRUM_COMPANION_GATE_AE_SELECTED_NEXT_LABEL =
  "post-V1 next numeric coverage gap Gate AF" as const;

export const POST_V1_GATE_AE_WALL_FRAMED_BUILDING_OUTPUTS = [
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

export const POST_V1_GATE_AE_WALL_FRAMED_LAB_SPECTRUM_OUTPUTS = [
  "Rw",
  "STC",
  "C",
  "Ctr"
] as const;

export const POST_V1_GATE_AE_WALL_FRAMED_BLOCKED_FIELD_BUILDING_OUTPUTS = [
  "R'w",
  "Dn,w",
  "Dn,A",
  "DnT,w",
  "DnT,A"
] as const;

export const POST_V1_GATE_AE_WALL_FRAMED_LAB_SPECTRUM_VALUE_PINS = [
  { caseId: "wall-lsf-knauf", metric: "Rw", value: 51 },
  { caseId: "wall-lsf-knauf", metric: "STC", value: 51 },
  { caseId: "wall-lsf-knauf", metric: "C", value: -1.4 },
  { caseId: "wall-lsf-knauf", metric: "Ctr", value: -6.4 },
  { caseId: "wall-timber-stud", metric: "Rw", value: 42 },
  { caseId: "wall-timber-stud", metric: "STC", value: 42 },
  { caseId: "wall-timber-stud", metric: "C", value: 0.4 },
  { caseId: "wall-timber-stud", metric: "Ctr", value: -4.3 }
] as const;
