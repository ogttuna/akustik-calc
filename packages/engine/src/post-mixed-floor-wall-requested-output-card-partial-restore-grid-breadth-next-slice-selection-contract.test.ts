import { describe, expect, it } from "vitest";

const POST_MIXED_FLOOR_WALL_REQUESTED_OUTPUT_CARD_PARTIAL_RESTORE_GRID_BREADTH_NEXT_SLICE_SELECTION = {
  sliceId: "post_mixed_floor_wall_requested_output_card_partial_restore_grid_breadth_next_slice_selection_v1",
  selectedImplementationSlice: "mixed_floor_wall_output_card_snapshot_grid_helper_extraction_v1",
  selectedOutputSurface: "workbench_output_card_snapshot_grid_harness",
  selectedRouteFamily: "mixed_floor_wall_route_matrix",
  selectionStatus: "selected_no_runtime_harness_hardening",
  numericRuntimeBehaviorChange: false,
  runtimeWidening: false,
  nextExecutionAction: "mixed_floor_wall_output_card_snapshot_grid_helper_extraction_v1",
  followUpPlanningAction: "post_mixed_floor_wall_output_card_snapshot_grid_helper_extraction_next_slice_selection_v1",
} as const;

const OUTPUT_CARD_SNAPSHOT_GRID_HARDENING_SCOPE = {
  currentBroadRequestedOutputPartialRestoreGridGreen: true,
  currentBroadRequestedOutputEditHistoryRestoreGridGreen: true,
  currentBroadRequestedOutputRestoreGridGreen: true,
  currentBroadRequestedOutputReplayGridGreen: true,
  currentSelectedRequestedOutputPartialRestoreGridGreen: true,
  currentRepresentativeRequestedOutputGeneratedRestoreGridGreen: true,
  currentRepresentativeRequestedOutputEditHistoryRestoreGridGreen: true,
  currentRepresentativeRequestedOutputPartialRestoreGridGreen: true,
  keepRepresentativeDefaultRestoreGridGreen: true,
  snapshotGridFile:
    "apps/web/features/workbench/mixed-study-mode-output-card-snapshot-grid.test.ts",
  snapshotGridLineCountAtSelection: 2145,
  helperExtractionTargets: [
    "requested_output_bundle_selection_and_default_assertion_helpers",
    "partial_restore_replay_and_save_load_scenario_setup_helpers",
    "requested_output_card_projection_parity_helpers",
    "broad_selected_representative_route_case_enumerator_helpers",
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
    reason: "snapshot_grid_harness_should_be_extracted_before_new_runtime_scope",
    runtimeWideningEligible: false,
  },
  {
    id: "dataholz_gdmtxa04a_visible_exact_reopen",
    reason: "snapshot_grid_harness_should_be_extracted_before_new_runtime_scope",
    runtimeWideningEligible: false,
  },
  {
    id: "tuas_c11c_exact_import",
    reason: "snapshot_grid_harness_should_be_extracted_before_new_runtime_scope",
    runtimeWideningEligible: false,
  },
  {
    id: "broad_heavy_concrete_formula_family_widening",
    reason: "snapshot_grid_harness_should_be_extracted_before_new_runtime_scope",
    runtimeWideningEligible: false,
  },
  {
    id: "wall_selector_behavior_widening",
    reason: "snapshot_grid_harness_should_be_extracted_before_new_runtime_scope",
    runtimeWideningEligible: false,
  },
] as const;

describe("post mixed floor/wall requested-output card partial-restore grid breadth next slice selection contract", () => {
  it("selects output-card snapshot harness extraction before any runtime widening", () => {
    expect(POST_MIXED_FLOOR_WALL_REQUESTED_OUTPUT_CARD_PARTIAL_RESTORE_GRID_BREADTH_NEXT_SLICE_SELECTION).toEqual({
      sliceId: "post_mixed_floor_wall_requested_output_card_partial_restore_grid_breadth_next_slice_selection_v1",
      selectedImplementationSlice: "mixed_floor_wall_output_card_snapshot_grid_helper_extraction_v1",
      selectedOutputSurface: "workbench_output_card_snapshot_grid_harness",
      selectedRouteFamily: "mixed_floor_wall_route_matrix",
      selectionStatus: "selected_no_runtime_harness_hardening",
      numericRuntimeBehaviorChange: false,
      runtimeWidening: false,
      nextExecutionAction: "mixed_floor_wall_output_card_snapshot_grid_helper_extraction_v1",
      followUpPlanningAction: "post_mixed_floor_wall_output_card_snapshot_grid_helper_extraction_next_slice_selection_v1",
    });
    expect(DEFERRED_IMMEDIATE_RUNTIME_CANDIDATES.filter((candidate) => candidate.runtimeWideningEligible)).toEqual(
      [],
    );
  });

  it("keeps the next scope on output-card snapshot harness extraction while preserving the full requested-output restore lattice", () => {
    expect(OUTPUT_CARD_SNAPSHOT_GRID_HARDENING_SCOPE).toEqual({
      currentBroadRequestedOutputPartialRestoreGridGreen: true,
      currentBroadRequestedOutputEditHistoryRestoreGridGreen: true,
      currentBroadRequestedOutputRestoreGridGreen: true,
      currentBroadRequestedOutputReplayGridGreen: true,
      currentSelectedRequestedOutputPartialRestoreGridGreen: true,
      currentRepresentativeRequestedOutputGeneratedRestoreGridGreen: true,
      currentRepresentativeRequestedOutputEditHistoryRestoreGridGreen: true,
      currentRepresentativeRequestedOutputPartialRestoreGridGreen: true,
      keepRepresentativeDefaultRestoreGridGreen: true,
      snapshotGridFile:
        "apps/web/features/workbench/mixed-study-mode-output-card-snapshot-grid.test.ts",
      snapshotGridLineCountAtSelection: 2145,
      helperExtractionTargets: [
        "requested_output_bundle_selection_and_default_assertion_helpers",
        "partial_restore_replay_and_save_load_scenario_setup_helpers",
        "requested_output_card_projection_parity_helpers",
        "broad_selected_representative_route_case_enumerator_helpers",
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
