import { describe, expect, it } from "vitest";

const POST_CLT_LOCAL_COMBINED_INTERACTION_EVIDENCE_NEXT_SLICE_SELECTION = {
  sliceId: "post_clt_local_combined_interaction_evidence_next_slice_selection_v1",
  latestClosedImplementationSlice: "clt_local_combined_interaction_evidence_v1",
  selectedImplementationSlice: "reinforced_concrete_accuracy_reopen",
  selectedOutputSurface: "reinforced_concrete_low_confidence_follow_up_surface",
  selectedRouteFamily: "reinforced_concrete_combined_low_confidence_floor_lane",
  selectionStatus: "selected_conditional_reinforced_concrete_follow_up_after_clt_local_closeout",
  numericRuntimeBehaviorChange: false,
  runtimeWidening: false,
  nextExecutionAction: "reinforced_concrete_accuracy_reopen",
  followUpPlanningAction: "post_reinforced_concrete_accuracy_reopen_next_slice_selection_v1"
} as const;

const CLT_LOCAL_CLOSEOUT_SELECTION_MATRIX = [
  {
    id: "reinforced_concrete_accuracy_reopen",
    selectedNext: true,
    planningOnly: true,
    reason:
      "the_local_clt_combined_surface_is_now_explicitly_pinned_so_the_next_honest_roi_move_is_the_only_still_live_conditional_reinforced_concrete_follow_up_not_more_clt_sprawl_or_any_closed_blocked_family"
  },
  {
    id: "clt_local_combined_interaction_evidence_v1",
    selectedNext: false,
    planningOnly: true,
    reason:
      "the_exact_anchor_pack_predictor_proxy_and_fail_closed_under_described_boundary_now_cover_the_current_local_combined_surface_so_the_slice_should_close_not_sprawl"
  },
  {
    id: "raw_terminal_concrete_helper_family_widening_v1",
    selectedNext: false,
    planningOnly: false,
    reason:
      "the_raw_helper_lane_is_already_closed_as_solved_support_baseline_evidence_and_should_not_reopen_from_nearby_green_tests"
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

const CLOSED_CLT_LOCAL_COMBINED_EVIDENCE = {
  engineEvidence: [
    "packages/engine/src/impact-predictor-input.test.ts",
    "packages/engine/src/tuas-clt-backlog-decision-contract.test.ts",
    "packages/engine/src/clt-local-combined-interaction-evidence-matrix.test.ts",
    "packages/engine/src/clt-local-combined-exact-anchor-pack.test.ts"
  ],
  webEvidence: [
    "apps/web/features/workbench/clt-combined-anchor-history-replay-matrix.test.ts",
    "apps/web/features/workbench/clt-local-combined-exact-anchor-route-card-matrix.test.ts"
  ],
  closedBecause: [
    "the_exact_combined_local_clt_anchors_c2c_c3c_c4c_and_c7c_are_now_explicit_on_one_shared_surface",
    "the_visible_c5c_proxy_now_stays_predictor_backed_without_pretending_exact_local_evidence",
    "under_described_local_combined_shapes_now_stay_fail_closed_on_the_same_screening_owned_boundary",
    "no_additional_genuinely_distinct_local_combined_boundary_is_selected_from_the_current_evidence_pack"
  ]
} as const;

const SELECTED_REINFORCED_CONCRETE_FOLLOW_UP = {
  engineEvidence: [
    "packages/engine/src/reinforced-concrete-formula-family-closeout-audit.test.ts",
    "packages/engine/src/reinforced-concrete-family-formula-fit-audit.test.ts",
    "packages/engine/src/reinforced-concrete-low-confidence-edge-continuity.test.ts",
    "packages/engine/src/reinforced-concrete-visible-low-confidence-edge-continuity.test.ts",
    "packages/engine/src/reinforced-concrete-combined-vinyl-elastic-ceiling-estimate.test.ts"
  ],
  webEvidence: [
    "apps/web/features/workbench/reinforced-concrete-low-confidence-impact-panels.test.ts",
    "apps/web/features/workbench/reinforced-concrete-low-confidence-proposal-honesty.test.ts"
  ],
  runtimeAnchors: [
    "packages/engine/src/calculate-impact-only.ts",
    "packages/engine/src/reinforced-concrete-combined-vinyl-elastic-ceiling-estimate.ts",
    "packages/engine/src/reinforced-concrete-low-confidence-airborne.ts",
    "apps/web/features/workbench/reinforced-concrete-low-confidence-floor-lane.ts"
  ],
  selectedBecause: [
    "the_raw_helper_corridor_and_the_local_clt_combined_evidence_surface_are_both_now_closed_cleanly",
    "blocked_source_families_remain_fail_closed_and_do_not_have_new_evidence_to_reopen",
    "reinforced_concrete_is_the_only_still_live_non_blocked_conditional_corridor_with_an_explicit_bounded_low_confidence_residual_risk",
    "the_follow_up_must_start_from_the_closed_reinforced_concrete_audit_and_not_from_nearby_green_tests_alone"
  ]
} as const;

describe("post clt local combined interaction evidence next slice selection contract", () => {
  it("closes the CLT-local evidence slice and selects the reinforced-concrete conditional follow-up", () => {
    expect(POST_CLT_LOCAL_COMBINED_INTERACTION_EVIDENCE_NEXT_SLICE_SELECTION).toEqual({
      sliceId: "post_clt_local_combined_interaction_evidence_next_slice_selection_v1",
      latestClosedImplementationSlice: "clt_local_combined_interaction_evidence_v1",
      selectedImplementationSlice: "reinforced_concrete_accuracy_reopen",
      selectedOutputSurface: "reinforced_concrete_low_confidence_follow_up_surface",
      selectedRouteFamily: "reinforced_concrete_combined_low_confidence_floor_lane",
      selectionStatus: "selected_conditional_reinforced_concrete_follow_up_after_clt_local_closeout",
      numericRuntimeBehaviorChange: false,
      runtimeWidening: false,
      nextExecutionAction: "reinforced_concrete_accuracy_reopen",
      followUpPlanningAction: "post_reinforced_concrete_accuracy_reopen_next_slice_selection_v1"
    });

    expect(CLT_LOCAL_CLOSEOUT_SELECTION_MATRIX.find((candidate) => candidate.selectedNext)).toEqual({
      id: "reinforced_concrete_accuracy_reopen",
      selectedNext: true,
      planningOnly: true,
      reason:
        "the_local_clt_combined_surface_is_now_explicitly_pinned_so_the_next_honest_roi_move_is_the_only_still_live_conditional_reinforced_concrete_follow_up_not_more_clt_sprawl_or_any_closed_blocked_family"
    });
  });

  it("keeps the CLT-local slice closed and leaves blocked source-backed families fail-closed", () => {
    expect(CLT_LOCAL_CLOSEOUT_SELECTION_MATRIX.filter((candidate) => candidate.planningOnly)).toEqual([
      {
        id: "reinforced_concrete_accuracy_reopen",
        selectedNext: true,
        planningOnly: true,
        reason:
          "the_local_clt_combined_surface_is_now_explicitly_pinned_so_the_next_honest_roi_move_is_the_only_still_live_conditional_reinforced_concrete_follow_up_not_more_clt_sprawl_or_any_closed_blocked_family"
      },
      {
        id: "clt_local_combined_interaction_evidence_v1",
        selectedNext: false,
        planningOnly: true,
        reason:
          "the_exact_anchor_pack_predictor_proxy_and_fail_closed_under_described_boundary_now_cover_the_current_local_combined_surface_so_the_slice_should_close_not_sprawl"
      }
    ]);

    expect(CLT_LOCAL_CLOSEOUT_SELECTION_MATRIX.filter((candidate) => !candidate.selectedNext)).toEqual([
      {
        id: "clt_local_combined_interaction_evidence_v1",
        selectedNext: false,
        planningOnly: true,
        reason:
          "the_exact_anchor_pack_predictor_proxy_and_fail_closed_under_described_boundary_now_cover_the_current_local_combined_surface_so_the_slice_should_close_not_sprawl"
      },
      {
        id: "raw_terminal_concrete_helper_family_widening_v1",
        selectedNext: false,
        planningOnly: false,
        reason:
          "the_raw_helper_lane_is_already_closed_as_solved_support_baseline_evidence_and_should_not_reopen_from_nearby_green_tests"
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

  it("uses the landed CLT-local evidence pack and the reinforced-concrete guard pack to justify the next conditional follow-up", () => {
    expect(CLOSED_CLT_LOCAL_COMBINED_EVIDENCE).toEqual({
      engineEvidence: [
        "packages/engine/src/impact-predictor-input.test.ts",
        "packages/engine/src/tuas-clt-backlog-decision-contract.test.ts",
        "packages/engine/src/clt-local-combined-interaction-evidence-matrix.test.ts",
        "packages/engine/src/clt-local-combined-exact-anchor-pack.test.ts"
      ],
      webEvidence: [
        "apps/web/features/workbench/clt-combined-anchor-history-replay-matrix.test.ts",
        "apps/web/features/workbench/clt-local-combined-exact-anchor-route-card-matrix.test.ts"
      ],
      closedBecause: [
        "the_exact_combined_local_clt_anchors_c2c_c3c_c4c_and_c7c_are_now_explicit_on_one_shared_surface",
        "the_visible_c5c_proxy_now_stays_predictor_backed_without_pretending_exact_local_evidence",
        "under_described_local_combined_shapes_now_stay_fail_closed_on_the_same_screening_owned_boundary",
        "no_additional_genuinely_distinct_local_combined_boundary_is_selected_from_the_current_evidence_pack"
      ]
    });

    expect(SELECTED_REINFORCED_CONCRETE_FOLLOW_UP).toEqual({
      engineEvidence: [
        "packages/engine/src/reinforced-concrete-formula-family-closeout-audit.test.ts",
        "packages/engine/src/reinforced-concrete-family-formula-fit-audit.test.ts",
        "packages/engine/src/reinforced-concrete-low-confidence-edge-continuity.test.ts",
        "packages/engine/src/reinforced-concrete-visible-low-confidence-edge-continuity.test.ts",
        "packages/engine/src/reinforced-concrete-combined-vinyl-elastic-ceiling-estimate.test.ts"
      ],
      webEvidence: [
        "apps/web/features/workbench/reinforced-concrete-low-confidence-impact-panels.test.ts",
        "apps/web/features/workbench/reinforced-concrete-low-confidence-proposal-honesty.test.ts"
      ],
      runtimeAnchors: [
        "packages/engine/src/calculate-impact-only.ts",
        "packages/engine/src/reinforced-concrete-combined-vinyl-elastic-ceiling-estimate.ts",
        "packages/engine/src/reinforced-concrete-low-confidence-airborne.ts",
        "apps/web/features/workbench/reinforced-concrete-low-confidence-floor-lane.ts"
      ],
      selectedBecause: [
        "the_raw_helper_corridor_and_the_local_clt_combined_evidence_surface_are_both_now_closed_cleanly",
        "blocked_source_families_remain_fail_closed_and_do_not_have_new_evidence_to_reopen",
        "reinforced_concrete_is_the_only_still_live_non_blocked_conditional_corridor_with_an_explicit_bounded_low_confidence_residual_risk",
        "the_follow_up_must_start_from_the_closed_reinforced_concrete_audit_and_not_from_nearby_green_tests_alone"
      ]
    });
  });
});
