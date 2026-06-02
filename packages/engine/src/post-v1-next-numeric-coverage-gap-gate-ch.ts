export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CH_LANDED_GATE =
  "post_v1_next_numeric_coverage_gap_gate_ch_plan" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CH_SELECTION_STATUS =
  "post_v1_next_numeric_coverage_gap_gate_ch_landed_runtime_selected_next_numeric_coverage_gap_gate_ci" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CH_SELECTED_NEXT_ACTION =
  "post_v1_next_numeric_coverage_gap_gate_ci_plan" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CH_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ci-contract.test.ts" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CH_SELECTED_NEXT_LABEL =
  "post-V1 next numeric coverage gap Gate CI" as const;

export const POST_V1_GATE_CH_FIELD_DIRECT_FLANKING_VALUE_PINS = {
  "CI,50-2500": 4,
  "L'n,w": 57.5,
  "L'nT,w": 55.1,
  "L'nT,50": 59.1,
  "Ln,w": 50
} as const;

export const POST_V1_GATE_CH_COVERAGE_COUNTERS = {
  accuracyOnlyTemplates: 0,
  auditedRuntimeFamilies: 1,
  newCalculableLayerTemplates: 2,
  newCalculableRequestShapes: 4,
  newMetricBasisOwners: 0,
  requiredPhysicalInputFields: [
    "impactFieldContext.directPathOffsetDb_or_fieldKDb",
    "impactFieldContext.flankingPaths",
    "impactFieldContext.receivingRoomVolumeM3",
    "impactFieldContext.ci50_2500Db",
    "ownedLabImpactAnchorLnW"
  ],
  runtimeCorrectedRequestShapes: 3,
  surfaceParityRequired: false,
  wrongAliasOrFallbackBlocks: [
    "direct+flanking L'nT,50 still requires explicit CI,50-2500 owner",
    "published upper-treatment ISO field outputs still do not publish ASTM IIC/AIIC",
    "field adapter stays on field_apparent basis and does not relabel lab Ln,w as field output"
  ]
} as const;

export type PostV1GateCHSummary = {
  readonly coverageCounters: typeof POST_V1_GATE_CH_COVERAGE_COUNTERS;
  readonly landedGate: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CH_LANDED_GATE;
  readonly noRuntimeValueMovement: false;
  readonly previousGateCG2: {
    readonly landedGate: "post_v1_floor_common_floating_covering_expansion_gate_cg2_plan";
    readonly selectedNextAction: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CH_LANDED_GATE;
    readonly selectionStatus: "post_v1_floor_common_floating_covering_expansion_gate_cg2_landed_selected_next_numeric_coverage_gap_gate_ch";
  };
  readonly runtimeMovementThisGate:
    "floor_direct_flanking_low_frequency_ci50_owner_used_for_published_upper_treatment_field_adapter";
  readonly selectedNextAction: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CH_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CH_SELECTED_NEXT_FILE;
  readonly selectedNextLabel: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CH_SELECTED_NEXT_LABEL;
  readonly selectionStatus: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CH_SELECTION_STATUS;
  readonly valuePins: typeof POST_V1_GATE_CH_FIELD_DIRECT_FLANKING_VALUE_PINS;
};

export function summarizePostV1GateCHNumericCoverageGap(): PostV1GateCHSummary {
  return {
    coverageCounters: POST_V1_GATE_CH_COVERAGE_COUNTERS,
    landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CH_LANDED_GATE,
    noRuntimeValueMovement: false,
    previousGateCG2: {
      landedGate: "post_v1_floor_common_floating_covering_expansion_gate_cg2_plan",
      selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CH_LANDED_GATE,
      selectionStatus:
        "post_v1_floor_common_floating_covering_expansion_gate_cg2_landed_selected_next_numeric_coverage_gap_gate_ch"
    },
    runtimeMovementThisGate:
      "floor_direct_flanking_low_frequency_ci50_owner_used_for_published_upper_treatment_field_adapter",
    selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CH_SELECTED_NEXT_ACTION,
    selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CH_SELECTED_NEXT_FILE,
    selectedNextLabel: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CH_SELECTED_NEXT_LABEL,
    selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CH_SELECTION_STATUS,
    valuePins: POST_V1_GATE_CH_FIELD_DIRECT_FLANKING_VALUE_PINS
  };
}
