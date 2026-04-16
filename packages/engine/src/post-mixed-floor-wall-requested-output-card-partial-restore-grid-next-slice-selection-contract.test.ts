import { describe, expect, it } from "vitest";

const POST_MIXED_FLOOR_WALL_REQUESTED_OUTPUT_CARD_PARTIAL_RESTORE_GRID_NEXT_SLICE_SELECTION = {
  sliceId: "post_mixed_floor_wall_requested_output_card_partial_restore_grid_next_slice_selection_v1",
  selectedImplementationSlice:
    "mixed_floor_wall_requested_output_card_required_grid_partial_restore_expansion_v1",
  selectedOutputSurface: "workbench_requested_output_card_partial_restore_breadth",
  selectedRouteFamily: "mixed_floor_wall_required_output_card_grid",
  selectionStatus: "selected_no_runtime_evidence_expansion",
  numericRuntimeBehaviorChange: false,
  runtimeWidening: false,
  nextExecutionAction: "mixed_floor_wall_requested_output_card_required_grid_partial_restore_expansion_v1",
  followUpPlanningAction:
    "post_mixed_floor_wall_requested_output_card_required_grid_partial_restore_next_slice_selection_v1",
} as const;

const SELECTED_REQUESTED_OUTPUT_PARTIAL_RESTORE_SCOPE = {
  currentSelectedRequestedOutputPartialRestoreGridGreen: true,
  keepRepresentativeRequestedOutputGeneratedRestoreGridGreen: true,
  keepRepresentativeRequestedOutputEditHistoryRestoreGridGreen: true,
  keepRepresentativeDefaultRestoreGridGreen: true,
  representativeRequiredCardGridIds: [
    "route-tuas-c11c-fail-closed",
    "route-dataholz-gdmtxa04a-boundary",
    "route-open-box-exact",
    "route-open-web-200-exact",
    "route-open-web-400-exact",
    "route-open-web-bound",
    "route-wall-held-aac",
    "route-wall-heavy-composite-hint-suppression",
  ],
  representativePartialRestoreVariants: [
    "ascending-direct-leading-rebuild",
    "ascending-reversed-leading-rebuild",
    "ascending-direct-trailing-rebuild",
    "ascending-reversed-trailing-rebuild",
    "descending-direct-leading-rebuild",
    "descending-reversed-leading-rebuild",
    "descending-direct-trailing-rebuild",
    "descending-reversed-trailing-rebuild",
  ],
  requestedOutputStressors: [
    "representative_custom_requested_output_bundle_selection",
    "representative_requested_output_partial_split_restore_after_cross_mode_noise",
    "representative_requested_output_partial_split_save_load_restore_after_replay",
    "representative_requested_output_status_value_projection_restore_parity",
    "representative_requested_output_support_warning_floor_system_restore_parity",
    "selected_requested_output_partial_restore_regression_guard",
    "representative_requested_output_generated_history_restore_regression_guard",
    "representative_requested_output_edit_history_restore_regression_guard",
    "representative_default_output_restore_regression_guard",
  ],
  targetedEngineTest: "packages/engine/src/mixed-floor-wall-generated-matrix.test.ts",
  targetedWebTests: [
    "apps/web/features/workbench/mixed-study-mode-output-card-snapshot-grid.test.ts",
    "apps/web/features/workbench/mixed-study-mode-generated-history-grid.test.ts",
    "apps/web/features/workbench/mixed-study-mode-generated-edit-history-matrix.test.ts",
  ],
} as const;

const DEFERRED_IMMEDIATE_RUNTIME_CANDIDATES = [
  {
    id: "raw_bare_open_box_open_web_impact_widening",
    reason: "still_no_bare_carrier_impact_source",
    runtimeWideningEligible: false,
  },
  {
    id: "dataholz_gdmtxa04a_visible_exact_reopen",
    reason: "composite_dry_screed_surface_model_still_missing",
    runtimeWideningEligible: false,
  },
  {
    id: "tuas_c11c_exact_import",
    reason: "weak_weighted_tuple_still_unexplained_by_available_source_fields",
    runtimeWideningEligible: false,
  },
  {
    id: "broad_heavy_concrete_formula_family_widening",
    reason: "representative_requested_output_partial_restore_should_land_before_formula_scope_expansion",
    runtimeWideningEligible: false,
  },
  {
    id: "wall_selector_behavior_widening",
    reason: "representative_requested_output_partial_restore_should_land_before_wall_selector_scope_expansion",
    runtimeWideningEligible: false,
  },
] as const;

describe("post mixed floor/wall requested-output card partial-restore grid next slice selection contract", () => {
  it("selects representative requested-output partial-restore expansion before any runtime widening", () => {
    expect(POST_MIXED_FLOOR_WALL_REQUESTED_OUTPUT_CARD_PARTIAL_RESTORE_GRID_NEXT_SLICE_SELECTION).toEqual({
      sliceId: "post_mixed_floor_wall_requested_output_card_partial_restore_grid_next_slice_selection_v1",
      selectedImplementationSlice:
        "mixed_floor_wall_requested_output_card_required_grid_partial_restore_expansion_v1",
      selectedOutputSurface: "workbench_requested_output_card_partial_restore_breadth",
      selectedRouteFamily: "mixed_floor_wall_required_output_card_grid",
      selectionStatus: "selected_no_runtime_evidence_expansion",
      numericRuntimeBehaviorChange: false,
      runtimeWidening: false,
      nextExecutionAction: "mixed_floor_wall_requested_output_card_required_grid_partial_restore_expansion_v1",
      followUpPlanningAction:
        "post_mixed_floor_wall_requested_output_card_required_grid_partial_restore_next_slice_selection_v1",
    });
    expect(DEFERRED_IMMEDIATE_RUNTIME_CANDIDATES.filter((candidate) => candidate.runtimeWideningEligible)).toEqual(
      [],
    );
  });

  it("keeps the next scope on representative requested-output partial-restore proof while preserving selected and representative restore regressions", () => {
    expect(SELECTED_REQUESTED_OUTPUT_PARTIAL_RESTORE_SCOPE).toEqual({
      currentSelectedRequestedOutputPartialRestoreGridGreen: true,
      keepRepresentativeRequestedOutputGeneratedRestoreGridGreen: true,
      keepRepresentativeRequestedOutputEditHistoryRestoreGridGreen: true,
      keepRepresentativeDefaultRestoreGridGreen: true,
      representativeRequiredCardGridIds: [
        "route-tuas-c11c-fail-closed",
        "route-dataholz-gdmtxa04a-boundary",
        "route-open-box-exact",
        "route-open-web-200-exact",
        "route-open-web-400-exact",
        "route-open-web-bound",
        "route-wall-held-aac",
        "route-wall-heavy-composite-hint-suppression",
      ],
      representativePartialRestoreVariants: [
        "ascending-direct-leading-rebuild",
        "ascending-reversed-leading-rebuild",
        "ascending-direct-trailing-rebuild",
        "ascending-reversed-trailing-rebuild",
        "descending-direct-leading-rebuild",
        "descending-reversed-leading-rebuild",
        "descending-direct-trailing-rebuild",
        "descending-reversed-trailing-rebuild",
      ],
      requestedOutputStressors: [
        "representative_custom_requested_output_bundle_selection",
        "representative_requested_output_partial_split_restore_after_cross_mode_noise",
        "representative_requested_output_partial_split_save_load_restore_after_replay",
        "representative_requested_output_status_value_projection_restore_parity",
        "representative_requested_output_support_warning_floor_system_restore_parity",
        "selected_requested_output_partial_restore_regression_guard",
        "representative_requested_output_generated_history_restore_regression_guard",
        "representative_requested_output_edit_history_restore_regression_guard",
        "representative_default_output_restore_regression_guard",
      ],
      targetedEngineTest: "packages/engine/src/mixed-floor-wall-generated-matrix.test.ts",
      targetedWebTests: [
        "apps/web/features/workbench/mixed-study-mode-output-card-snapshot-grid.test.ts",
        "apps/web/features/workbench/mixed-study-mode-generated-history-grid.test.ts",
        "apps/web/features/workbench/mixed-study-mode-generated-edit-history-matrix.test.ts",
      ],
    });
  });
});
