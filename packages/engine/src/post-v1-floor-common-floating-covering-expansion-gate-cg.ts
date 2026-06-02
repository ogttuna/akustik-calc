export const POST_V1_FLOOR_COMMON_FLOATING_COVERING_EXPANSION_GATE_CG_LANDED_GATE =
  "post_v1_floor_common_floating_covering_expansion_gate_cg_plan" as const;

export const POST_V1_FLOOR_COMMON_FLOATING_COVERING_EXPANSION_GATE_CG_SELECTION_STATUS =
  "post_v1_floor_common_floating_covering_expansion_gate_cg_landed_partial_selected_floor_common_floating_covering_expansion_gate_cg2" as const;

export const POST_V1_FLOOR_COMMON_FLOATING_COVERING_EXPANSION_GATE_CG_SELECTED_NEXT_ACTION =
  "post_v1_floor_common_floating_covering_expansion_gate_cg2_plan" as const;

export const POST_V1_FLOOR_COMMON_FLOATING_COVERING_EXPANSION_GATE_CG_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-floor-common-floating-covering-expansion-gate-cg2-contract.test.ts" as const;

export const POST_V1_FLOOR_COMMON_FLOATING_COVERING_EXPANSION_GATE_CG_SELECTED_NEXT_LABEL =
  "post-V1 common floor floating/covering expansion Gate CG2" as const;

export const POST_V1_GATE_CG_COVERAGE_COUNTERS = {
  accuracyOnlyTemplates: 0,
  auditedRuntimeFamilies: 1,
  newCalculableLayerTemplates: 4,
  newCalculableRequestShapes: 20,
  newMetricBasisOwners: 0,
  requiredPhysicalInputFields: [
    "toppingOrFloatingLayer",
    "resilientLayerDynamicStiffnessMNm3",
    "loadBasisKgM2",
    "impactFieldContext",
    "receivingRoomVolumeM3",
    "impactFieldContext.ci50_2500Db"
  ],
  runtimeCorrectedRequestShapes: 12,
  surfaceParityRequired: false,
  wrongAliasOrFallbackBlocks: [
    "floor covering-only heavy concrete does not invent DeltaLw without a floating/topping layer, dynamic stiffness, and load basis",
    "floor covering-only heavy concrete field outputs still require explicit impactFieldContext",
    "ISO Ln,w impact routes still do not publish ASTM IIC/AIIC without ASTM E492/E1007 owners"
  ]
} as const;
