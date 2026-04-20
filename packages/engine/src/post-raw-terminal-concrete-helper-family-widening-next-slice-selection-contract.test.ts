import { describe, expect, it } from "vitest";

const POST_RAW_TERMINAL_CONCRETE_HELPER_FAMILY_WIDENING_NEXT_SLICE_SELECTION = {
  sliceId: "post_raw_terminal_concrete_helper_family_widening_next_slice_selection_v1",
  latestClosedImplementationSlice: "raw_terminal_concrete_helper_family_widening_v1",
  selectedImplementationSlice: "clt_local_combined_interaction_evidence_v1",
  selectedOutputSurface: "clt_local_combined_interaction_evidence_surface",
  selectedRouteFamily: "local_clt_combined_floor_routes",
  selectionStatus: "selected_no_runtime_clt_local_combined_evidence_after_raw_helper_closeout",
  numericRuntimeBehaviorChange: false,
  runtimeWidening: false,
  nextExecutionAction: "clt_local_combined_interaction_evidence_v1",
  followUpPlanningAction: "post_clt_local_combined_interaction_evidence_next_slice_selection_v1"
} as const;

const RAW_HELPER_CLOSEOUT_SELECTION_MATRIX = [
  {
    id: "clt_local_combined_interaction_evidence_v1",
    selectedNext: true,
    planningOnly: true,
    reason:
      "the_raw_helper_support_baseline_is_now_explicitly_pinned_so_the_next_honest_roi_move_is_the_held_clt_local_combined_evidence_slice_not_more_raw_helper_guesswork"
  },
  {
    id: "raw_terminal_concrete_helper_family_widening_v1",
    selectedNext: false,
    planningOnly: false,
    reason:
      "the_helper_family_split_topology_and_partial_order_cuts_now_cover_the_support_baseline_shapes_so_the_current_raw_helper_slice_should_close_not_sprawl"
  },
  {
    id: "reinforced_concrete_accuracy_reopen",
    selectedNext: false,
    planningOnly: false,
    reason:
      "the_closed_concrete_corridor_stays_conditional_only_without_a_new_proof_backed_overlap_or_formula_ownership_gap"
  },
  {
    id: "dataholz_gdmtxa04a_exact_visible_reopen_candidate_v1",
    selectedNext: false,
    planningOnly: false,
    reason:
      "the_closed_dataholz_design_still_keeps_the_65mm_visible_surface_as_a_convenience_proxy_not_an_honest_exact_reopen"
  },
  {
    id: "tuas_c11c_exact_import",
    selectedNext: false,
    planningOnly: false,
    reason:
      "the_closed_c11c_design_still_does_not_have_raw_spectrum_or_source_correction_evidence_for_the_weak_weighted_tuple"
  },
  {
    id: "raw_bare_open_box_open_web_impact_widening",
    selectedNext: false,
    planningOnly: false,
    reason:
      "the_closed_raw_bare_family_still_only_has_packaged_system_rows_not_true_bare_carrier_impact_truth"
  },
  {
    id: "wall_selector_behavior_widening",
    selectedNext: false,
    planningOnly: false,
    reason:
      "the_closed_wall_selector_family_still_has_no_fresh_classified_red_that_justifies_a_behavior_reopen"
  }
] as const;

const CLOSED_RAW_HELPER_WIDENING_EVIDENCE = {
  engineEvidence: [
    "packages/engine/src/raw-floor-screening-carrier-support.test.ts",
    "packages/engine/src/raw-terminal-concrete-helper-widening-matrix.test.ts",
    "packages/engine/src/raw-terminal-concrete-helper-origin-matrix.test.ts",
    "packages/engine/src/raw-terminal-concrete-helper-split-topology-matrix.test.ts",
    "packages/engine/src/raw-terminal-concrete-helper-split-topology-origin-matrix.test.ts",
    "packages/engine/src/raw-terminal-concrete-helper-partial-order-matrix.test.ts",
    "packages/engine/src/raw-terminal-concrete-helper-partial-order-origin-matrix.test.ts",
    "packages/engine/src/raw-concrete-helper-answer-guard.test.ts",
    "packages/engine/src/raw-floor-hostile-input-answer-matrix.test.ts",
    "packages/engine/src/raw-floor-safe-bare-split-parity.test.ts"
  ],
  webEvidence: [
    "apps/web/features/workbench/raw-terminal-concrete-helper-route-card-matrix.test.ts",
    "apps/web/features/workbench/raw-terminal-concrete-helper-output-origin-card-matrix.test.ts",
    "apps/web/features/workbench/raw-terminal-concrete-helper-split-topology-route-card-matrix.test.ts",
    "apps/web/features/workbench/raw-terminal-concrete-helper-split-topology-output-origin-card-matrix.test.ts",
    "apps/web/features/workbench/raw-terminal-concrete-helper-partial-order-route-card-matrix.test.ts",
    "apps/web/features/workbench/raw-terminal-concrete-helper-partial-order-output-origin-card-matrix.test.ts",
    "apps/web/features/workbench/raw-concrete-helper-route-card-guard.test.ts",
    "apps/web/features/workbench/raw-floor-hostile-input-route-card-matrix.test.ts",
    "apps/web/features/workbench/raw-floor-safe-bare-split-parity.test.ts"
  ],
  closedBecause: [
    "the_terminal_concrete_helper_support_baseline_shapes_are_now_explicitly_pinned_across_answer_support_provenance_and_route_card_surfaces",
    "no_additional_defended_raw_helper_topology_is_selected_from_the_current_support_baseline",
    "continuing_to_widen_the_raw_helper_slice_now_would_be_sprawl_not_a_clean_roi_cut",
    "blocked_source_families_remain_fail_closed_and_should_not_reopen_from_nearby_green_tests"
  ]
} as const;

const SELECTED_CLT_LOCAL_COMBINED_EVIDENCE = {
  engineEvidence: [
    "packages/engine/src/impact-predictor-input.test.ts",
    "packages/engine/src/tuas-clt-backlog-decision-contract.test.ts"
  ],
  webEvidence: [
    "apps/web/features/workbench/clt-combined-anchor-history-replay-matrix.test.ts",
    "apps/web/features/workbench/floor-family-regressions.test.ts"
  ],
  selectedBecause: [
    "clt_local_combined_interaction_evidence_v1_was_already_the_held_next_candidate_after_the_broad_audit_selection",
    "the_raw_helper_slice_now_closes_cleanly_so_the_held_clt_local_candidate_becomes_the_next_honest_roi_move",
    "the_clt_combined_work_still_needs_explicit_local_evidence_before_any_runtime_widening_so_the_follow_up_stays_no_runtime",
    "reinforced_concrete_and_all_closed_blocked_source_families_still_rank_below_the_held_clt_local_evidence_slice_without_new_proof"
  ]
} as const;

describe("post raw terminal concrete helper family widening next slice selection contract", () => {
  it("closes the raw helper widening slice and selects the held CLT-local evidence slice", () => {
    expect(POST_RAW_TERMINAL_CONCRETE_HELPER_FAMILY_WIDENING_NEXT_SLICE_SELECTION).toEqual({
      sliceId: "post_raw_terminal_concrete_helper_family_widening_next_slice_selection_v1",
      latestClosedImplementationSlice: "raw_terminal_concrete_helper_family_widening_v1",
      selectedImplementationSlice: "clt_local_combined_interaction_evidence_v1",
      selectedOutputSurface: "clt_local_combined_interaction_evidence_surface",
      selectedRouteFamily: "local_clt_combined_floor_routes",
      selectionStatus: "selected_no_runtime_clt_local_combined_evidence_after_raw_helper_closeout",
      numericRuntimeBehaviorChange: false,
      runtimeWidening: false,
      nextExecutionAction: "clt_local_combined_interaction_evidence_v1",
      followUpPlanningAction: "post_clt_local_combined_interaction_evidence_next_slice_selection_v1"
    });

    expect(RAW_HELPER_CLOSEOUT_SELECTION_MATRIX.find((candidate) => candidate.selectedNext)).toEqual({
      id: "clt_local_combined_interaction_evidence_v1",
      selectedNext: true,
      planningOnly: true,
      reason:
        "the_raw_helper_support_baseline_is_now_explicitly_pinned_so_the_next_honest_roi_move_is_the_held_clt_local_combined_evidence_slice_not_more_raw_helper_guesswork"
    });
  });

  it("keeps the raw helper slice closed and every blocked or conditional candidate out of the next active move", () => {
    expect(RAW_HELPER_CLOSEOUT_SELECTION_MATRIX.filter((candidate) => candidate.planningOnly)).toEqual([
      {
        id: "clt_local_combined_interaction_evidence_v1",
        selectedNext: true,
        planningOnly: true,
        reason:
          "the_raw_helper_support_baseline_is_now_explicitly_pinned_so_the_next_honest_roi_move_is_the_held_clt_local_combined_evidence_slice_not_more_raw_helper_guesswork"
      }
    ]);

    expect(RAW_HELPER_CLOSEOUT_SELECTION_MATRIX.filter((candidate) => !candidate.selectedNext)).toEqual([
      {
        id: "raw_terminal_concrete_helper_family_widening_v1",
        selectedNext: false,
        planningOnly: false,
        reason:
          "the_helper_family_split_topology_and_partial_order_cuts_now_cover_the_support_baseline_shapes_so_the_current_raw_helper_slice_should_close_not_sprawl"
      },
      {
        id: "reinforced_concrete_accuracy_reopen",
        selectedNext: false,
        planningOnly: false,
        reason:
          "the_closed_concrete_corridor_stays_conditional_only_without_a_new_proof_backed_overlap_or_formula_ownership_gap"
      },
      {
        id: "dataholz_gdmtxa04a_exact_visible_reopen_candidate_v1",
        selectedNext: false,
        planningOnly: false,
        reason:
          "the_closed_dataholz_design_still_keeps_the_65mm_visible_surface_as_a_convenience_proxy_not_an_honest_exact_reopen"
      },
      {
        id: "tuas_c11c_exact_import",
        selectedNext: false,
        planningOnly: false,
        reason:
          "the_closed_c11c_design_still_does_not_have_raw_spectrum_or_source_correction_evidence_for_the_weak_weighted_tuple"
      },
      {
        id: "raw_bare_open_box_open_web_impact_widening",
        selectedNext: false,
        planningOnly: false,
        reason:
          "the_closed_raw_bare_family_still_only_has_packaged_system_rows_not_true_bare_carrier_impact_truth"
      },
      {
        id: "wall_selector_behavior_widening",
        selectedNext: false,
        planningOnly: false,
        reason:
          "the_closed_wall_selector_family_still_has_no_fresh_classified_red_that_justifies_a_behavior_reopen"
      }
    ]);
  });

  it("uses the landed raw-helper evidence pack and the held CLT-local evidence anchors to justify the next no-runtime slice", () => {
    expect(CLOSED_RAW_HELPER_WIDENING_EVIDENCE).toEqual({
      engineEvidence: [
        "packages/engine/src/raw-floor-screening-carrier-support.test.ts",
        "packages/engine/src/raw-terminal-concrete-helper-widening-matrix.test.ts",
        "packages/engine/src/raw-terminal-concrete-helper-origin-matrix.test.ts",
        "packages/engine/src/raw-terminal-concrete-helper-split-topology-matrix.test.ts",
        "packages/engine/src/raw-terminal-concrete-helper-split-topology-origin-matrix.test.ts",
        "packages/engine/src/raw-terminal-concrete-helper-partial-order-matrix.test.ts",
        "packages/engine/src/raw-terminal-concrete-helper-partial-order-origin-matrix.test.ts",
        "packages/engine/src/raw-concrete-helper-answer-guard.test.ts",
        "packages/engine/src/raw-floor-hostile-input-answer-matrix.test.ts",
        "packages/engine/src/raw-floor-safe-bare-split-parity.test.ts"
      ],
      webEvidence: [
        "apps/web/features/workbench/raw-terminal-concrete-helper-route-card-matrix.test.ts",
        "apps/web/features/workbench/raw-terminal-concrete-helper-output-origin-card-matrix.test.ts",
        "apps/web/features/workbench/raw-terminal-concrete-helper-split-topology-route-card-matrix.test.ts",
        "apps/web/features/workbench/raw-terminal-concrete-helper-split-topology-output-origin-card-matrix.test.ts",
        "apps/web/features/workbench/raw-terminal-concrete-helper-partial-order-route-card-matrix.test.ts",
        "apps/web/features/workbench/raw-terminal-concrete-helper-partial-order-output-origin-card-matrix.test.ts",
        "apps/web/features/workbench/raw-concrete-helper-route-card-guard.test.ts",
        "apps/web/features/workbench/raw-floor-hostile-input-route-card-matrix.test.ts",
        "apps/web/features/workbench/raw-floor-safe-bare-split-parity.test.ts"
      ],
      closedBecause: [
        "the_terminal_concrete_helper_support_baseline_shapes_are_now_explicitly_pinned_across_answer_support_provenance_and_route_card_surfaces",
        "no_additional_defended_raw_helper_topology_is_selected_from_the_current_support_baseline",
        "continuing_to_widen_the_raw_helper_slice_now_would_be_sprawl_not_a_clean_roi_cut",
        "blocked_source_families_remain_fail_closed_and_should_not_reopen_from_nearby_green_tests"
      ]
    });

    expect(SELECTED_CLT_LOCAL_COMBINED_EVIDENCE).toEqual({
      engineEvidence: [
        "packages/engine/src/impact-predictor-input.test.ts",
        "packages/engine/src/tuas-clt-backlog-decision-contract.test.ts"
      ],
      webEvidence: [
        "apps/web/features/workbench/clt-combined-anchor-history-replay-matrix.test.ts",
        "apps/web/features/workbench/floor-family-regressions.test.ts"
      ],
      selectedBecause: [
        "clt_local_combined_interaction_evidence_v1_was_already_the_held_next_candidate_after_the_broad_audit_selection",
        "the_raw_helper_slice_now_closes_cleanly_so_the_held_clt_local_candidate_becomes_the_next_honest_roi_move",
        "the_clt_combined_work_still_needs_explicit_local_evidence_before_any_runtime_widening_so_the_follow_up_stays_no_runtime",
        "reinforced_concrete_and_all_closed_blocked_source_families_still_rank_below_the_held_clt_local_evidence_slice_without_new_proof"
      ]
    });
  });
});
