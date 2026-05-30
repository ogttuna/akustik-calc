export const POST_V1_WALL_HEAVY_COMPOSITE_BUILDING_LAB_SPECTRUM_COMPANION_GATE_AG_LANDED_GATE =
  "post_v1_wall_heavy_composite_building_lab_spectrum_companion_gate_ag_plan" as const;

export const POST_V1_WALL_HEAVY_COMPOSITE_BUILDING_LAB_SPECTRUM_COMPANION_GATE_AG_SELECTION_STATUS =
  "post_v1_wall_heavy_composite_building_lab_spectrum_companion_gate_ag_landed_selected_next_numeric_coverage_gap_gate_ah" as const;

export const POST_V1_WALL_HEAVY_COMPOSITE_BUILDING_LAB_SPECTRUM_COMPANION_GATE_AG_SELECTED_NEXT_ACTION =
  "post_v1_next_numeric_coverage_gap_gate_ah_plan" as const;

export const POST_V1_WALL_HEAVY_COMPOSITE_BUILDING_LAB_SPECTRUM_COMPANION_GATE_AG_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ah-contract.test.ts" as const;

export const POST_V1_WALL_HEAVY_COMPOSITE_BUILDING_LAB_SPECTRUM_COMPANION_GATE_AG_SELECTED_NEXT_LABEL =
  "post-V1 next numeric coverage gap Gate AH" as const;

export const POST_V1_GATE_AG_WALL_HEAVY_COMPOSITE_BUILDING_OUTPUTS = [
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

export const POST_V1_GATE_AG_WALL_HEAVY_COMPOSITE_BUILDING_LAB_SPECTRUM_OUTPUTS = [
  "Rw",
  "STC",
  "C",
  "Ctr"
] as const;

export const POST_V1_GATE_AG_WALL_HEAVY_COMPOSITE_BLOCKED_FIELD_BUILDING_OUTPUTS = [
  "R'w",
  "Dn,w",
  "Dn,A",
  "DnT,w",
  "DnT,A"
] as const;

export const POST_V1_GATE_AG_WALL_HEAVY_COMPOSITE_BUILDING_LAB_SPECTRUM_VALUE_PINS = [
  { metric: "Rw", value: 60 },
  { metric: "STC", value: 60 },
  { metric: "C", value: -1.4 },
  { metric: "Ctr", value: -6.1 }
] as const;

export const POST_V1_GATE_AG_WALL_HEAVY_COMPOSITE_BUILDING_MISSING_INPUTS = [
  "sourceRoomVolumeM3",
  "flankingJunctionClass",
  "conservativeFlankingAssumption",
  "junctionCouplingLengthM",
  "buildingPredictionOutputBasis"
] as const;
