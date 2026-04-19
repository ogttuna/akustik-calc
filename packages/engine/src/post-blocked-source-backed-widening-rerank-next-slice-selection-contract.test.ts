import { describe, expect, it } from "vitest";

const POST_BLOCKED_SOURCE_BACKED_WIDENING_RERANK_NEXT_SLICE_SELECTION = {
  sliceId: "post_blocked_source_backed_widening_rerank_next_slice_selection_v1",
  latestClosedImplementationSlice: "blocked_source_backed_widening_rerank_v1",
  selectedImplementationSlice: "mixed_floor_wall_seeded_cross_mode_chain_expansion_v2",
  selectedOutputSurface: "workbench_saved_scenario_replay_and_output_cards",
  selectedRouteFamily: "mixed_floor_wall_seeded_boundary_routes",
  selectionStatus: "selected_no_runtime_shared_evidence_expansion_after_blocked_source_rerank_closeout",
  numericRuntimeBehaviorChange: false,
  runtimeWidening: false,
  nextExecutionAction: "mixed_floor_wall_seeded_cross_mode_chain_expansion_v2",
  followUpPlanningAction: "post_mixed_floor_wall_seeded_cross_mode_chain_expansion_v2_next_slice_selection_v1"
} as const;

const BLOCKED_SOURCE_RERANK_CLOSEOUT_MATRIX = [
  {
    id: "mixed_floor_wall_seeded_cross_mode_chain_expansion_v2",
    selectedNext: true,
    runtimeWidening: false,
    reason:
      "all_ranked_source_backed_runtime_candidates_are_now_explicitly_blocked_so_the_next_honest_move_is_a_shared_no_runtime_seeded_chain_follow_up"
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

const SELECTED_SHARED_TORTURE_SCOPE = {
  currentSeededBoundaryRoutes: [
    "route-wall-held-aac",
    "route-wall-heavy-composite-hint-suppression",
    "route-dataholz-gdmtxa04a-boundary",
    "route-tuas-c11c-fail-closed",
    "route-open-box-exact",
    "route-open-web-bound"
  ],
  remainingOpenEvidenceGaps: [
    "broader_seeded_cross_mode_edit_chain_families_beyond_the_current_second_wall_family_expansion",
    "wider_duplicate_swap_pressure_beyond_the_current_complementary_generated_history_variants",
    "saved_scenario_replay_and_output_card_projection_parity_after_longer_cross_mode_chains"
  ],
  targetedEngineTests: [
    "packages/engine/src/mixed-floor-wall-complex-stack.test.ts",
    "packages/engine/src/mixed-floor-wall-generated-matrix.test.ts"
  ],
  targetedWebTests: [
    "apps/web/features/workbench/mixed-study-mode-torture.test.ts",
    "apps/web/features/workbench/mixed-study-mode-generated-history-grid.test.ts",
    "apps/web/features/workbench/mixed-study-mode-generated-edit-history-matrix.test.ts",
    "apps/web/features/workbench/mixed-study-mode-output-card-snapshot-grid.test.ts"
  ]
} as const;

describe("post blocked-source backed widening rerank next slice selection contract", () => {
  it("closes the rerank by selecting a no-runtime shared seeded-chain follow-up instead of reopening a blocked runtime candidate", () => {
    expect(POST_BLOCKED_SOURCE_BACKED_WIDENING_RERANK_NEXT_SLICE_SELECTION).toEqual({
      sliceId: "post_blocked_source_backed_widening_rerank_next_slice_selection_v1",
      latestClosedImplementationSlice: "blocked_source_backed_widening_rerank_v1",
      selectedImplementationSlice: "mixed_floor_wall_seeded_cross_mode_chain_expansion_v2",
      selectedOutputSurface: "workbench_saved_scenario_replay_and_output_cards",
      selectedRouteFamily: "mixed_floor_wall_seeded_boundary_routes",
      selectionStatus: "selected_no_runtime_shared_evidence_expansion_after_blocked_source_rerank_closeout",
      numericRuntimeBehaviorChange: false,
      runtimeWidening: false,
      nextExecutionAction: "mixed_floor_wall_seeded_cross_mode_chain_expansion_v2",
      followUpPlanningAction: "post_mixed_floor_wall_seeded_cross_mode_chain_expansion_v2_next_slice_selection_v1"
    });

    expect(BLOCKED_SOURCE_RERANK_CLOSEOUT_MATRIX.find((candidate) => candidate.selectedNext)).toEqual({
      id: "mixed_floor_wall_seeded_cross_mode_chain_expansion_v2",
      selectedNext: true,
      runtimeWidening: false,
      reason:
        "all_ranked_source_backed_runtime_candidates_are_now_explicitly_blocked_so_the_next_honest_move_is_a_shared_no_runtime_seeded_chain_follow_up"
    });
  });

  it("keeps every blocked runtime candidate fail-closed while the selected follow-up stays on shared evidence expansion", () => {
    expect(BLOCKED_SOURCE_RERANK_CLOSEOUT_MATRIX.filter((candidate) => candidate.runtimeWidening && candidate.selectedNext)).toEqual([]);
    expect(BLOCKED_SOURCE_RERANK_CLOSEOUT_MATRIX.filter((candidate) => !candidate.selectedNext)).toEqual([
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

  it("keeps the selected next scope on the seeded mixed floor/wall boundary routes and saved-scenario replay surfaces", () => {
    expect(SELECTED_SHARED_TORTURE_SCOPE).toEqual({
      currentSeededBoundaryRoutes: [
        "route-wall-held-aac",
        "route-wall-heavy-composite-hint-suppression",
        "route-dataholz-gdmtxa04a-boundary",
        "route-tuas-c11c-fail-closed",
        "route-open-box-exact",
        "route-open-web-bound"
      ],
      remainingOpenEvidenceGaps: [
        "broader_seeded_cross_mode_edit_chain_families_beyond_the_current_second_wall_family_expansion",
        "wider_duplicate_swap_pressure_beyond_the_current_complementary_generated_history_variants",
        "saved_scenario_replay_and_output_card_projection_parity_after_longer_cross_mode_chains"
      ],
      targetedEngineTests: [
        "packages/engine/src/mixed-floor-wall-complex-stack.test.ts",
        "packages/engine/src/mixed-floor-wall-generated-matrix.test.ts"
      ],
      targetedWebTests: [
        "apps/web/features/workbench/mixed-study-mode-torture.test.ts",
        "apps/web/features/workbench/mixed-study-mode-generated-history-grid.test.ts",
        "apps/web/features/workbench/mixed-study-mode-generated-edit-history-matrix.test.ts",
        "apps/web/features/workbench/mixed-study-mode-output-card-snapshot-grid.test.ts"
      ]
    });
  });
});
