export const POST_V1_FLOOR_FIELD_A_WEIGHTED_SURFACE_GATE_AC_LANDED_GATE =
  "post_v1_floor_field_a_weighted_surface_gate_ac_plan" as const;

export const POST_V1_FLOOR_FIELD_A_WEIGHTED_SURFACE_GATE_AC_SELECTION_STATUS =
  "post_v1_floor_field_a_weighted_surface_gate_ac_landed_selected_next_numeric_coverage_gap_gate_ad" as const;

export const POST_V1_FLOOR_FIELD_A_WEIGHTED_SURFACE_GATE_AC_SELECTED_NEXT_ACTION =
  "post_v1_next_numeric_coverage_gap_gate_ad_plan" as const;

export const POST_V1_FLOOR_FIELD_A_WEIGHTED_SURFACE_GATE_AC_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ad-contract.test.ts" as const;

export const POST_V1_FLOOR_FIELD_A_WEIGHTED_SURFACE_GATE_AC_SELECTED_NEXT_LABEL =
  "post-V1 next numeric coverage gap Gate AD" as const;

export const POST_V1_GATE_AC_FLOOR_FIELD_A_WEIGHTED_OUTPUTS = ["Dn,w", "Dn,A", "DnT,w", "DnT,A"] as const;

export const POST_V1_GATE_AC_FLOOR_FIELD_A_WEIGHTED_VALUE_PINS = [
  { caseId: "floor-heavy-concrete", metric: "Dn,w", value: 57 },
  { caseId: "floor-heavy-concrete", metric: "Dn,A", value: 56.1 },
  { caseId: "floor-heavy-concrete", metric: "DnT,w", value: 60 },
  { caseId: "floor-heavy-concrete", metric: "DnT,A", value: 58.6 },
  { caseId: "floor-steel-fallback", metric: "Dn,w", value: 69 },
  { caseId: "floor-steel-fallback", metric: "Dn,A", value: 68.1 },
  { caseId: "floor-steel-fallback", metric: "DnT,w", value: 72 },
  { caseId: "floor-steel-fallback", metric: "DnT,A", value: 70.6 }
] as const;
