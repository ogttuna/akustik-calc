export const POST_V1_WALL_FLAT_MULTICAVITY_BUILDING_PHYSICS_GATE_AJ_LANDED_GATE =
  "post_v1_wall_flat_multicavity_building_physics_gate_aj_plan" as const;

export const POST_V1_WALL_FLAT_MULTICAVITY_BUILDING_PHYSICS_GATE_AJ_SELECTION_STATUS =
  "post_v1_wall_flat_multicavity_building_physics_gate_aj_landed_selected_next_numeric_coverage_gap_gate_ak" as const;

export const POST_V1_WALL_FLAT_MULTICAVITY_BUILDING_PHYSICS_GATE_AJ_SELECTED_NEXT_ACTION =
  "post_v1_next_numeric_coverage_gap_gate_ak_plan" as const;

export const POST_V1_WALL_FLAT_MULTICAVITY_BUILDING_PHYSICS_GATE_AJ_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ak-contract.test.ts" as const;

export const POST_V1_WALL_FLAT_MULTICAVITY_BUILDING_PHYSICS_GATE_AJ_SELECTED_NEXT_LABEL =
  "post-V1 next numeric coverage gap Gate AK" as const;

export const POST_V1_GATE_AJ_WALL_FLAT_MULTICAVITY_BUILDING_SUPPORTED_OUTPUTS = [
  "R'w",
  "Dn,w",
  "Dn,A",
  "DnT,w",
  "DnT,A"
] as const;

export const POST_V1_GATE_AJ_WALL_FLAT_MULTICAVITY_BUILDING_UNSUPPORTED_LAB_OUTPUTS = [
  "Rw",
  "STC",
  "C",
  "Ctr"
] as const;

export const POST_V1_GATE_AJ_WALL_FLAT_MULTICAVITY_BUILDING_TARGET_OUTPUTS = [
  ...POST_V1_GATE_AJ_WALL_FLAT_MULTICAVITY_BUILDING_UNSUPPORTED_LAB_OUTPUTS,
  ...POST_V1_GATE_AJ_WALL_FLAT_MULTICAVITY_BUILDING_SUPPORTED_OUTPUTS
] as const;

export const POST_V1_GATE_AJ_WALL_FLAT_MULTICAVITY_BUILDING_VALUE_PINS = [
  { metric: "R'w", value: 60 },
  { metric: "Dn,w", value: 60 },
  { metric: "Dn,A", value: 58.1 },
  { metric: "DnT,w", value: 61 },
  { metric: "DnT,A", value: 59.6 }
] as const;
