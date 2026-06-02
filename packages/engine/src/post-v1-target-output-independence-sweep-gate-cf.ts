export const POST_V1_TARGET_OUTPUT_INDEPENDENCE_SWEEP_GATE_CF_LANDED_GATE =
  "post_v1_target_output_independence_sweep_gate_cf_plan" as const;

export const POST_V1_TARGET_OUTPUT_INDEPENDENCE_SWEEP_GATE_CF_SELECTION_STATUS =
  "post_v1_target_output_independence_sweep_gate_cf_landed_selected_floor_common_floating_covering_expansion_gate_cg" as const;

export const POST_V1_TARGET_OUTPUT_INDEPENDENCE_SWEEP_GATE_CF_SELECTED_NEXT_ACTION =
  "post_v1_floor_common_floating_covering_expansion_gate_cg_plan" as const;

export const POST_V1_TARGET_OUTPUT_INDEPENDENCE_SWEEP_GATE_CF_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-floor-common-floating-covering-expansion-gate-cg-contract.test.ts" as const;

export const POST_V1_TARGET_OUTPUT_INDEPENDENCE_SWEEP_GATE_CF_SELECTED_NEXT_LABEL =
  "post-V1 common floor floating/covering expansion Gate CG" as const;

export const POST_V1_GATE_CF_COVERAGE_COUNTERS = {
  accuracyOnlyTemplates: 0,
  auditedRuntimeFamilies: 6,
  newCalculableLayerTemplates: 0,
  newCalculableRequestShapes: 8,
  newMetricBasisOwners: 0,
  newSingleOutputParityPins: 37,
  requiredPhysicalInputFields: [],
  runtimeCorrectedRequestShapes: 8,
  surfaceParityRequired: false,
  wrongAliasOrFallbackBlocks: [
    "ISO impact routes still do not publish IIC/AIIC without ASTM E492/E1007 owners",
    "wall field outputs still require complete receiving-room RT60 and room volume",
    "field-only wall requests still do not widen into unrequested lab Rw"
  ]
} as const;
