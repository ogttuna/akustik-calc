import { describe, expect, it } from "vitest";

const POST_MIXED_FLOOR_WALL_SEEDED_CROSS_MODE_CHAIN_NEXT_SLICE_SELECTION = {
  sliceId: "post_mixed_floor_wall_seeded_cross_mode_chain_next_slice_selection_v2",
  latestClosedImplementationSlice: "mixed_floor_wall_seeded_cross_mode_chain_expansion_v2",
  selectedImplementationSlice: "blocked_source_backed_widening_rerank_refresh_v2",
  selectedOutputSurface: "blocked_source_backed_widening_rerank_matrix",
  selectedRouteFamily: "deferred_floor_source_gap_candidates",
  selectionStatus: "selected_no_runtime_blocked_source_refresh_after_seeded_chain_closeout",
  numericRuntimeBehaviorChange: false,
  runtimeWidening: false,
  nextExecutionAction: "blocked_source_backed_widening_rerank_refresh_v2",
  followUpPlanningAction: "post_blocked_source_backed_widening_rerank_refresh_next_slice_selection_v1"
} as const;

const RERANK_REFRESH_CANDIDATE_MATRIX = [
  {
    id: "blocked_source_backed_widening_rerank_refresh_v2",
    selectedNext: true,
    runtimeWidening: false,
    reason:
      "the_seeded_mixed_floor_wall_follow_up_closed_cleanly_without_a_fresh_classified_runtime_red_so_the_next_honest_move_is_a_blocked_source_refresh_not_a_reopen"
  },
  {
    id: "dataholz_gdmtxa04a_visible_exact_reopen",
    selectedNext: false,
    runtimeWidening: true,
    reason: "still_blocked_until_visible_exact_reopen_has_honest_composite_dry_screed_surface_modeling"
  },
  {
    id: "tuas_c11c_exact_import",
    selectedNext: false,
    runtimeWidening: true,
    reason: "still_blocked_until_the_combined_wet_tuple_anomaly_is_explained_without_guesswork"
  },
  {
    id: "raw_bare_open_box_open_web_impact_widening",
    selectedNext: false,
    runtimeWidening: true,
    reason: "still_blocked_until_true_bare_carrier_impact_evidence_exists_instead_of_packaged_system_rows"
  },
  {
    id: "wall_selector_behavior_widening",
    selectedNext: false,
    runtimeWidening: true,
    reason: "still_blocked_until_a_fresh_classified_wall_red_reopens_the_trace_guard_honestly"
  }
] as const;

const MIXED_SEEDED_CHAIN_CLOSEOUT_EVIDENCE = {
  currentSeededBoundaryRoutes: [
    "route-wall-held-aac",
    "route-wall-heavy-composite-hint-suppression",
    "route-dataholz-gdmtxa04a-boundary",
    "route-tuas-c11c-fail-closed",
    "route-open-box-exact",
    "route-open-web-bound"
  ],
  landedCloseoutFacts: [
    "selected_duplicate_swap_replay_now_uses_explicit_per_plan_reverse_masks",
    "selected_requested_output_restore_surfaces_now_use_the_reverse_mask_branch",
    "broad_and_representative_requested_output_surfaces_stay_on_the_compact_branch",
    "no_blocked_source_backed_runtime_candidate_reopened_during_the_shared_follow_up"
  ],
  targetedEngineTests: [
    "packages/engine/src/mixed-floor-wall-complex-stack.test.ts",
    "packages/engine/src/mixed-floor-wall-generated-matrix.test.ts",
    "packages/engine/src/post-blocked-source-backed-widening-rerank-next-slice-selection-contract.test.ts"
  ],
  targetedWebTests: [
    "apps/web/features/workbench/mixed-study-mode-torture.test.ts",
    "apps/web/features/workbench/mixed-study-mode-generated-history-grid.test.ts",
    "apps/web/features/workbench/mixed-study-mode-generated-edit-history-matrix.test.ts",
    "apps/web/features/workbench/mixed-study-mode-output-card-snapshot-grid.test.ts",
    "apps/web/features/workbench/mixed-study-mode-output-card-snapshot-requested-output-surface-descriptors.test.ts"
  ]
} as const;

describe("post mixed floor/wall seeded cross-mode chain next slice selection contract", () => {
  it("closes the seeded cross-mode chain by selecting a blocked-source refresh instead of a direct runtime reopen", () => {
    expect(POST_MIXED_FLOOR_WALL_SEEDED_CROSS_MODE_CHAIN_NEXT_SLICE_SELECTION).toEqual({
      sliceId: "post_mixed_floor_wall_seeded_cross_mode_chain_next_slice_selection_v2",
      latestClosedImplementationSlice: "mixed_floor_wall_seeded_cross_mode_chain_expansion_v2",
      selectedImplementationSlice: "blocked_source_backed_widening_rerank_refresh_v2",
      selectedOutputSurface: "blocked_source_backed_widening_rerank_matrix",
      selectedRouteFamily: "deferred_floor_source_gap_candidates",
      selectionStatus: "selected_no_runtime_blocked_source_refresh_after_seeded_chain_closeout",
      numericRuntimeBehaviorChange: false,
      runtimeWidening: false,
      nextExecutionAction: "blocked_source_backed_widening_rerank_refresh_v2",
      followUpPlanningAction: "post_blocked_source_backed_widening_rerank_refresh_next_slice_selection_v1"
    });

    expect(RERANK_REFRESH_CANDIDATE_MATRIX.find((candidate) => candidate.selectedNext)).toEqual({
      id: "blocked_source_backed_widening_rerank_refresh_v2",
      selectedNext: true,
      runtimeWidening: false,
      reason:
        "the_seeded_mixed_floor_wall_follow_up_closed_cleanly_without_a_fresh_classified_runtime_red_so_the_next_honest_move_is_a_blocked_source_refresh_not_a_reopen"
    });
  });

  it("keeps every blocked runtime candidate fail-closed while the refresh stays selected", () => {
    expect(
      RERANK_REFRESH_CANDIDATE_MATRIX.filter((candidate) => candidate.runtimeWidening && candidate.selectedNext)
    ).toEqual([]);

    expect(RERANK_REFRESH_CANDIDATE_MATRIX.filter((candidate) => !candidate.selectedNext)).toEqual([
      {
        id: "dataholz_gdmtxa04a_visible_exact_reopen",
        selectedNext: false,
        runtimeWidening: true,
        reason: "still_blocked_until_visible_exact_reopen_has_honest_composite_dry_screed_surface_modeling"
      },
      {
        id: "tuas_c11c_exact_import",
        selectedNext: false,
        runtimeWidening: true,
        reason: "still_blocked_until_the_combined_wet_tuple_anomaly_is_explained_without_guesswork"
      },
      {
        id: "raw_bare_open_box_open_web_impact_widening",
        selectedNext: false,
        runtimeWidening: true,
        reason: "still_blocked_until_true_bare_carrier_impact_evidence_exists_instead_of_packaged_system_rows"
      },
      {
        id: "wall_selector_behavior_widening",
        selectedNext: false,
        runtimeWidening: true,
        reason: "still_blocked_until_a_fresh_classified_wall_red_reopens_the_trace_guard_honestly"
      }
    ]);
  });

  it("ties the closeout decision to the landed mixed seeded reverse-mask and requested-output evidence", () => {
    expect(MIXED_SEEDED_CHAIN_CLOSEOUT_EVIDENCE).toEqual({
      currentSeededBoundaryRoutes: [
        "route-wall-held-aac",
        "route-wall-heavy-composite-hint-suppression",
        "route-dataholz-gdmtxa04a-boundary",
        "route-tuas-c11c-fail-closed",
        "route-open-box-exact",
        "route-open-web-bound"
      ],
      landedCloseoutFacts: [
        "selected_duplicate_swap_replay_now_uses_explicit_per_plan_reverse_masks",
        "selected_requested_output_restore_surfaces_now_use_the_reverse_mask_branch",
        "broad_and_representative_requested_output_surfaces_stay_on_the_compact_branch",
        "no_blocked_source_backed_runtime_candidate_reopened_during_the_shared_follow_up"
      ],
      targetedEngineTests: [
        "packages/engine/src/mixed-floor-wall-complex-stack.test.ts",
        "packages/engine/src/mixed-floor-wall-generated-matrix.test.ts",
        "packages/engine/src/post-blocked-source-backed-widening-rerank-next-slice-selection-contract.test.ts"
      ],
      targetedWebTests: [
        "apps/web/features/workbench/mixed-study-mode-torture.test.ts",
        "apps/web/features/workbench/mixed-study-mode-generated-history-grid.test.ts",
        "apps/web/features/workbench/mixed-study-mode-generated-edit-history-matrix.test.ts",
        "apps/web/features/workbench/mixed-study-mode-output-card-snapshot-grid.test.ts",
        "apps/web/features/workbench/mixed-study-mode-output-card-snapshot-requested-output-surface-descriptors.test.ts"
      ]
    });
  });
});
