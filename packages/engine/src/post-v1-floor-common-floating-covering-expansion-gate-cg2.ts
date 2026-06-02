export const POST_V1_FLOOR_COMMON_FLOATING_COVERING_EXPANSION_GATE_CG2_LANDED_GATE =
  "post_v1_floor_common_floating_covering_expansion_gate_cg2_plan" as const;

export const POST_V1_FLOOR_COMMON_FLOATING_COVERING_EXPANSION_GATE_CG2_SELECTION_STATUS =
  "post_v1_floor_common_floating_covering_expansion_gate_cg2_landed_selected_next_numeric_coverage_gap_gate_ch" as const;

export const POST_V1_FLOOR_COMMON_FLOATING_COVERING_EXPANSION_GATE_CG2_SELECTED_NEXT_ACTION =
  "post_v1_next_numeric_coverage_gap_gate_ch_plan" as const;

export const POST_V1_FLOOR_COMMON_FLOATING_COVERING_EXPANSION_GATE_CG2_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ch-contract.test.ts" as const;

export const POST_V1_FLOOR_COMMON_FLOATING_COVERING_EXPANSION_GATE_CG2_SELECTED_NEXT_LABEL =
  "post-V1 next numeric coverage gap Gate CH" as const;

export const POST_V1_GATE_CG2_COVERAGE_COUNTERS = {
  accuracyOnlyTemplates: 0,
  auditedRuntimeFamilies: 1,
  newCalculableLayerTemplates: 2,
  newCalculableRequestShapes: 10,
  newMetricBasisOwners: 0,
  requiredPhysicalInputFields: [
    "loadBasisKgM2",
    "resilientLayerDynamicStiffnessMNm3",
    "impactFieldContext",
    "receivingRoomVolumeM3",
    "impactFieldContext.ci50_2500Db"
  ],
  runtimeCorrectedRequestShapes: 8,
  surfaceParityRequired: false,
  wrongAliasOrFallbackBlocks: [
    "visible heavy-floating upper-treatment dynamic requests keep published-family Ln,w live but do not invent DeltaLw",
    "missing load basis and missing dynamic stiffness stay separate needs_input boundaries for DeltaLw",
    "published upper-treatment ISO Ln,w and field companions still do not publish ASTM IIC/AIIC"
  ]
} as const;
