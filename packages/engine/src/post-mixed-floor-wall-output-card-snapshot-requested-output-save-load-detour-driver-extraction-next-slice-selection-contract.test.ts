import { describe, expect, it } from "vitest";

const POST_MIXED_FLOOR_WALL_OUTPUT_CARD_SNAPSHOT_REQUESTED_OUTPUT_SAVE_LOAD_DETOUR_DRIVER_EXTRACTION_NEXT_SLICE_SELECTION = {
  sliceId:
    "post_mixed_floor_wall_output_card_snapshot_requested_output_save_load_detour_driver_extraction_next_slice_selection_v1",
  selectedImplementationSlice:
    "mixed_floor_wall_output_card_snapshot_requested_output_variant_branch_driver_extraction_v1",
  selectedOutputSurface: "workbench_output_card_snapshot_requested_output_variant_branch_harness",
  selectedRouteFamily: "mixed_floor_wall_route_matrix",
  selectionStatus: "selected_no_runtime_harness_hardening",
  numericRuntimeBehaviorChange: false,
  runtimeWidening: false,
  nextExecutionAction:
    "mixed_floor_wall_output_card_snapshot_requested_output_variant_branch_driver_extraction_v1",
  followUpPlanningAction:
    "post_mixed_floor_wall_output_card_snapshot_requested_output_variant_branch_driver_extraction_next_slice_selection_v1",
} as const;

const OUTPUT_CARD_SNAPSHOT_REQUESTED_OUTPUT_VARIANT_BRANCH_SCOPE = {
  currentRequestedOutputSaveLoadDetourDriverExtractionGreen: true,
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
  snapshotGridLineCountAtSelection: 315,
  requestedOutputRunnerFile:
    "apps/web/features/workbench/mixed-study-mode-output-card-snapshot-requested-output-runners.ts",
  requestedOutputRunnerFileLineCountAtSelection: 1147,
  requestedOutputVariantBranchExtractionTargets: [
    "requested_output_compact_replay_variant_branch_driver",
    "requested_output_edit_history_variant_branch_driver",
    "requested_output_partial_restore_variant_branch_driver",
    "requested_output_variant_projection_assertion_driver",
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
    reason: "requested_output_variant_branch_extraction_should_land_before_new_runtime_scope",
    runtimeWideningEligible: false,
  },
  {
    id: "dataholz_gdmtxa04a_visible_exact_reopen",
    reason: "requested_output_variant_branch_extraction_should_land_before_new_runtime_scope",
    runtimeWideningEligible: false,
  },
  {
    id: "tuas_c11c_exact_import",
    reason: "requested_output_variant_branch_extraction_should_land_before_new_runtime_scope",
    runtimeWideningEligible: false,
  },
  {
    id: "broad_heavy_concrete_formula_family_widening",
    reason: "requested_output_variant_branch_extraction_should_land_before_new_runtime_scope",
    runtimeWideningEligible: false,
  },
  {
    id: "wall_selector_behavior_widening",
    reason: "requested_output_variant_branch_extraction_should_land_before_new_runtime_scope",
    runtimeWideningEligible: false,
  },
] as const;

describe("post mixed floor/wall output-card snapshot requested-output save-load detour driver extraction next slice selection contract", () => {
  it("selects variant branch driver extraction before any runtime widening", () => {
    expect(
      POST_MIXED_FLOOR_WALL_OUTPUT_CARD_SNAPSHOT_REQUESTED_OUTPUT_SAVE_LOAD_DETOUR_DRIVER_EXTRACTION_NEXT_SLICE_SELECTION,
    ).toEqual({
      sliceId:
        "post_mixed_floor_wall_output_card_snapshot_requested_output_save_load_detour_driver_extraction_next_slice_selection_v1",
      selectedImplementationSlice:
        "mixed_floor_wall_output_card_snapshot_requested_output_variant_branch_driver_extraction_v1",
      selectedOutputSurface: "workbench_output_card_snapshot_requested_output_variant_branch_harness",
      selectedRouteFamily: "mixed_floor_wall_route_matrix",
      selectionStatus: "selected_no_runtime_harness_hardening",
      numericRuntimeBehaviorChange: false,
      runtimeWidening: false,
      nextExecutionAction:
        "mixed_floor_wall_output_card_snapshot_requested_output_variant_branch_driver_extraction_v1",
      followUpPlanningAction:
        "post_mixed_floor_wall_output_card_snapshot_requested_output_variant_branch_driver_extraction_next_slice_selection_v1",
    });
    expect(DEFERRED_IMMEDIATE_RUNTIME_CANDIDATES.filter((candidate) => candidate.runtimeWideningEligible)).toEqual(
      [],
    );
  });

  it("keeps the next scope on requested-output variant branch extraction while preserving the shared restore driver win", () => {
    expect(OUTPUT_CARD_SNAPSHOT_REQUESTED_OUTPUT_VARIANT_BRANCH_SCOPE).toEqual({
      currentRequestedOutputSaveLoadDetourDriverExtractionGreen: true,
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
      snapshotGridLineCountAtSelection: 315,
      requestedOutputRunnerFile:
        "apps/web/features/workbench/mixed-study-mode-output-card-snapshot-requested-output-runners.ts",
      requestedOutputRunnerFileLineCountAtSelection: 1147,
      requestedOutputVariantBranchExtractionTargets: [
        "requested_output_compact_replay_variant_branch_driver",
        "requested_output_edit_history_variant_branch_driver",
        "requested_output_partial_restore_variant_branch_driver",
        "requested_output_variant_projection_assertion_driver",
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
