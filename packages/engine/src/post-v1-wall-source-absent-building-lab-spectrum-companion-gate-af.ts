export const POST_V1_WALL_SOURCE_ABSENT_BUILDING_LAB_SPECTRUM_COMPANION_GATE_AF_LANDED_GATE =
  "post_v1_wall_source_absent_building_lab_spectrum_companion_gate_af_plan" as const;

export const POST_V1_WALL_SOURCE_ABSENT_BUILDING_LAB_SPECTRUM_COMPANION_GATE_AF_SELECTION_STATUS =
  "post_v1_wall_source_absent_building_lab_spectrum_companion_gate_af_landed_selected_next_numeric_coverage_gap_gate_ag" as const;

export const POST_V1_WALL_SOURCE_ABSENT_BUILDING_LAB_SPECTRUM_COMPANION_GATE_AF_SELECTED_NEXT_ACTION =
  "post_v1_next_numeric_coverage_gap_gate_ag_plan" as const;

export const POST_V1_WALL_SOURCE_ABSENT_BUILDING_LAB_SPECTRUM_COMPANION_GATE_AF_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ag-contract.test.ts" as const;

export const POST_V1_WALL_SOURCE_ABSENT_BUILDING_LAB_SPECTRUM_COMPANION_GATE_AF_SELECTED_NEXT_LABEL =
  "post-V1 next numeric coverage gap Gate AG" as const;

export const POST_V1_GATE_AF_WALL_SOURCE_ABSENT_BUILDING_OUTPUTS = [
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

export const POST_V1_GATE_AF_WALL_SOURCE_ABSENT_BUILDING_LAB_SPECTRUM_OUTPUTS = [
  "Rw",
  "STC",
  "C",
  "Ctr"
] as const;

export const POST_V1_GATE_AF_WALL_SOURCE_ABSENT_BUILDING_BLOCKED_FIELD_BUILDING_OUTPUTS = [
  "R'w",
  "Dn,w",
  "Dn,A",
  "DnT,w",
  "DnT,A"
] as const;

export const POST_V1_GATE_AF_WALL_SOURCE_ABSENT_BUILDING_LAB_SPECTRUM_VALUE_PINS = [
  { caseId: "wall-screening-concrete", metric: "Rw", value: 55 },
  { caseId: "wall-screening-concrete", metric: "STC", value: 55 },
  { caseId: "wall-screening-concrete", metric: "C", value: -1.6 },
  { caseId: "wall-screening-concrete", metric: "Ctr", value: -6.3 },
  { caseId: "wall-masonry-brick", metric: "Rw", value: 40 },
  { caseId: "wall-masonry-brick", metric: "STC", value: 40 },
  { caseId: "wall-masonry-brick", metric: "C", value: -0.2 },
  { caseId: "wall-masonry-brick", metric: "Ctr", value: -4.7 },
  { caseId: "wall-clt-local", metric: "Rw", value: 41 },
  { caseId: "wall-clt-local", metric: "STC", value: 41 },
  { caseId: "wall-clt-local", metric: "C", value: -1.8 },
  { caseId: "wall-clt-local", metric: "Ctr", value: -7.6 }
] as const;
