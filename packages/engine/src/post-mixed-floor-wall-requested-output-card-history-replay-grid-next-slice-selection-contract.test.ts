import { describe, expect, it } from "vitest";

const POST_MIXED_FLOOR_WALL_REQUESTED_OUTPUT_CARD_HISTORY_REPLAY_GRID_NEXT_SLICE_SELECTION = {
  sliceId: "post_mixed_floor_wall_requested_output_card_history_replay_grid_next_slice_selection_v1",
  selectedImplementationSlice: "mixed_floor_wall_output_card_history_grid_breadth_expansion_v1",
  selectedOutputSurface: "workbench_output_card_history_replay_breadth",
  selectedRouteFamily: "mixed_floor_wall_generated_route_matrix",
  selectionStatus: "selected_no_runtime_evidence_expansion",
  numericRuntimeBehaviorChange: false,
  runtimeWidening: false,
  nextExecutionAction: "mixed_floor_wall_output_card_history_grid_breadth_expansion_v1",
  followUpPlanningAction: "post_mixed_floor_wall_output_card_history_grid_breadth_next_slice_selection_v1"
} as const;

const SELECTED_BROAD_OUTPUT_CARD_SCOPE = {
  currentBroadRouteMatrix: "ROUTE_MIXED_GENERATED_CASES",
  keepSelectedRequestedOutputLedgerGreen: true,
  alreadyClosedSelectedLedgerSlice: "mixed_floor_wall_requested_output_card_history_replay_grid_expansion_v1",
  compactVisibleReplayVariants: [
    "ascending-direct-leading-rebuild",
    "ascending-reversed-trailing-rebuild",
    "descending-direct-trailing-rebuild",
    "descending-reversed-leading-rebuild"
  ],
  postureStressors: [
    "visible_output_card_status_value_projection_after_broad_replay",
    "visible_output_card_support_bucket_projection_parity",
    "visible_output_card_warning_projection_parity",
    "visible_output_card_floor_system_projection_parity",
    "selected_requested_output_card_ledger_regression_guard"
  ],
  targetedEngineTest: "packages/engine/src/mixed-floor-wall-generated-matrix.test.ts",
  targetedWebTests: [
    "apps/web/features/workbench/mixed-study-mode-output-card-snapshot-grid.test.ts",
    "apps/web/features/workbench/mixed-study-mode-generated-edit-history-matrix.test.ts",
    "apps/web/features/workbench/mixed-study-mode-generated-history-grid.test.ts"
  ]
} as const;

const DEFERRED_IMMEDIATE_RUNTIME_CANDIDATES = [
  {
    id: "raw_bare_open_box_open_web_impact_widening",
    reason: "still_no_bare_carrier_impact_source",
    runtimeWideningEligible: false
  },
  {
    id: "dataholz_gdmtxa04a_visible_exact_reopen",
    reason: "composite_dry_screed_surface_model_still_missing",
    runtimeWideningEligible: false
  },
  {
    id: "tuas_c11c_exact_import",
    reason: "weak_weighted_tuple_still_unexplained_by_available_source_fields",
    runtimeWideningEligible: false
  },
  {
    id: "broad_heavy_concrete_formula_family_widening",
    reason: "output_card_history_grid_breadth_should_land_before_formula_scope_expansion",
    runtimeWideningEligible: false
  },
  {
    id: "wall_selector_behavior_widening",
    reason: "output_card_history_grid_breadth_should_land_before_wall_selector_scope_expansion",
    runtimeWideningEligible: false
  }
] as const;

describe("post mixed floor/wall requested-output card history replay grid next slice selection contract", () => {
  it("selects broad output-card history grid expansion before any runtime widening", () => {
    expect(POST_MIXED_FLOOR_WALL_REQUESTED_OUTPUT_CARD_HISTORY_REPLAY_GRID_NEXT_SLICE_SELECTION).toEqual({
      sliceId: "post_mixed_floor_wall_requested_output_card_history_replay_grid_next_slice_selection_v1",
      selectedImplementationSlice: "mixed_floor_wall_output_card_history_grid_breadth_expansion_v1",
      selectedOutputSurface: "workbench_output_card_history_replay_breadth",
      selectedRouteFamily: "mixed_floor_wall_generated_route_matrix",
      selectionStatus: "selected_no_runtime_evidence_expansion",
      numericRuntimeBehaviorChange: false,
      runtimeWidening: false,
      nextExecutionAction: "mixed_floor_wall_output_card_history_grid_breadth_expansion_v1",
      followUpPlanningAction: "post_mixed_floor_wall_output_card_history_grid_breadth_next_slice_selection_v1"
    });
    expect(DEFERRED_IMMEDIATE_RUNTIME_CANDIDATES.filter((candidate) => candidate.runtimeWideningEligible)).toEqual([]);
  });

  it("keeps the next scope on the broad visible route matrix while preserving the selected requested-output ledger", () => {
    expect(SELECTED_BROAD_OUTPUT_CARD_SCOPE).toEqual({
      currentBroadRouteMatrix: "ROUTE_MIXED_GENERATED_CASES",
      keepSelectedRequestedOutputLedgerGreen: true,
      alreadyClosedSelectedLedgerSlice: "mixed_floor_wall_requested_output_card_history_replay_grid_expansion_v1",
      compactVisibleReplayVariants: [
        "ascending-direct-leading-rebuild",
        "ascending-reversed-trailing-rebuild",
        "descending-direct-trailing-rebuild",
        "descending-reversed-leading-rebuild"
      ],
      postureStressors: [
        "visible_output_card_status_value_projection_after_broad_replay",
        "visible_output_card_support_bucket_projection_parity",
        "visible_output_card_warning_projection_parity",
        "visible_output_card_floor_system_projection_parity",
        "selected_requested_output_card_ledger_regression_guard"
      ],
      targetedEngineTest: "packages/engine/src/mixed-floor-wall-generated-matrix.test.ts",
      targetedWebTests: [
        "apps/web/features/workbench/mixed-study-mode-output-card-snapshot-grid.test.ts",
        "apps/web/features/workbench/mixed-study-mode-generated-edit-history-matrix.test.ts",
        "apps/web/features/workbench/mixed-study-mode-generated-history-grid.test.ts"
      ]
    });
  });
});
