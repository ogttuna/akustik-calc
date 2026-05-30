export const POST_V1_WALL_FRAMED_METADATA_AUTO_TOPOLOGY_GATE_AD_LANDED_GATE =
  "post_v1_wall_framed_metadata_auto_topology_gate_ad_plan" as const;

export const POST_V1_WALL_FRAMED_METADATA_AUTO_TOPOLOGY_GATE_AD_SELECTION_STATUS =
  "post_v1_wall_framed_metadata_auto_topology_gate_ad_landed_selected_next_numeric_coverage_gap_gate_ae" as const;

export const POST_V1_WALL_FRAMED_METADATA_AUTO_TOPOLOGY_GATE_AD_SELECTED_NEXT_ACTION =
  "post_v1_next_numeric_coverage_gap_gate_ae_plan" as const;

export const POST_V1_WALL_FRAMED_METADATA_AUTO_TOPOLOGY_GATE_AD_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ae-contract.test.ts" as const;

export const POST_V1_WALL_FRAMED_METADATA_AUTO_TOPOLOGY_GATE_AD_SELECTED_NEXT_LABEL =
  "post-V1 next numeric coverage gap Gate AE" as const;

export const POST_V1_GATE_AD_WALL_FRAMED_FIELD_OUTPUTS = [
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

export const POST_V1_GATE_AD_WALL_FRAMED_VALUE_PINS = [
  { caseId: "wall-lsf-knauf", metric: "Rw", value: 51 },
  { caseId: "wall-lsf-knauf", metric: "STC", value: 51 },
  { caseId: "wall-lsf-knauf", metric: "C", value: -1.4 },
  { caseId: "wall-lsf-knauf", metric: "Ctr", value: -6.4 },
  { caseId: "wall-lsf-knauf", metric: "R'w", value: 51 },
  { caseId: "wall-lsf-knauf", metric: "Dn,w", value: 51 },
  { caseId: "wall-lsf-knauf", metric: "Dn,A", value: 49.6 },
  { caseId: "wall-lsf-knauf", metric: "DnT,w", value: 52 },
  { caseId: "wall-lsf-knauf", metric: "DnT,A", value: 51.1 },
  { caseId: "wall-timber-stud", metric: "Rw", value: 42 },
  { caseId: "wall-timber-stud", metric: "STC", value: 42 },
  { caseId: "wall-timber-stud", metric: "C", value: 0.4 },
  { caseId: "wall-timber-stud", metric: "Ctr", value: -4.3 },
  { caseId: "wall-timber-stud", metric: "R'w", value: 42 },
  { caseId: "wall-timber-stud", metric: "Dn,w", value: 42 },
  { caseId: "wall-timber-stud", metric: "Dn,A", value: 42.4 },
  { caseId: "wall-timber-stud", metric: "DnT,w", value: 43 },
  { caseId: "wall-timber-stud", metric: "DnT,A", value: 43.9 }
] as const;
