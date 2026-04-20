import { describe, expect, it } from "vitest";

const POST_BROAD_AUDIT_AND_REPLANNING_PASS_V2_NEXT_SLICE_SELECTION = {
  sliceId: "post_broad_audit_and_replanning_pass_v2_next_slice_selection_v1",
  latestClosedImplementationSlice: "broad_audit_and_replanning_pass_v2",
  selectedImplementationSlice: "raw_terminal_concrete_helper_family_widening_v1",
  selectedOutputSurface: "raw_terminal_concrete_helper_widening_matrix",
  selectedRouteFamily: "raw_terminal_concrete_helper_floor_lane",
  selectionStatus: "selected_runtime_raw_helper_widening_after_broad_audit_replan",
  numericRuntimeBehaviorChange: false,
  runtimeWidening: true,
  nextExecutionAction: "raw_terminal_concrete_helper_family_widening_v1",
  followUpPlanningAction: "post_raw_terminal_concrete_helper_family_widening_next_slice_selection_v1"
} as const;

const BROAD_AUDIT_AND_REPLANNING_SELECTION_MATRIX = [
  {
    id: "raw_terminal_concrete_helper_family_widening_v1",
    selectedNext: true,
    runtimeWideningEligible: true,
    reason:
      "the_terminal_concrete_helper_floor_lane_is_already_live_formula_owned_and_now_has_green_answer_support_history_and_broad_validation_guards"
  },
  {
    id: "clt_local_combined_interaction_evidence_v1",
    selectedNext: false,
    runtimeWideningEligible: false,
    reason:
      "under_described_combined_clt_direct_fixed_shapes_still_need_explicit_source_or_frequency_evidence_before_any_honest_runtime_opening"
  },
  {
    id: "reinforced_concrete_accuracy_reopen",
    selectedNext: false,
    runtimeWideningEligible: false,
    reason:
      "the_closed_concrete_corridor_stays_conditional_only_without_a_new_proof_backed_overlap_or_formula_ownership_gap"
  },
  {
    id: "dataholz_gdmtxa04a_exact_visible_reopen_candidate_v1",
    selectedNext: false,
    runtimeWideningEligible: false,
    reason:
      "the_closed_dataholz_design_still_keeps_the_65mm_visible_surface_as_a_convenience_proxy_not_an_honest_exact_reopen"
  },
  {
    id: "tuas_c11c_exact_import",
    selectedNext: false,
    runtimeWideningEligible: false,
    reason:
      "the_closed_c11c_design_still_does_not_have_raw_spectrum_or_source_correction_evidence_for_the_weak_weighted_tuple"
  },
  {
    id: "raw_bare_open_box_open_web_impact_widening",
    selectedNext: false,
    runtimeWideningEligible: false,
    reason:
      "the_closed_raw_bare_family_still_only_has_packaged_system_rows_not_true_bare_carrier_impact_truth"
  },
  {
    id: "wall_selector_behavior_widening",
    selectedNext: false,
    runtimeWideningEligible: false,
    reason:
      "the_closed_wall_selector_family_still_has_no_fresh_classified_red_that_justifies_a_behavior_reopen"
  }
] as const;

const SELECTED_RAW_TERMINAL_CONCRETE_HELPER_WIDENING_EVIDENCE = {
  engineEvidence: [
    "packages/engine/src/raw-floor-screening-carrier-support.test.ts",
    "packages/engine/src/raw-concrete-helper-answer-guard.test.ts",
    "packages/engine/src/raw-floor-hostile-input-answer-matrix.test.ts",
    "packages/engine/src/raw-floor-safe-bare-split-parity.test.ts",
    "packages/engine/src/output-origin-trace-matrix.test.ts"
  ],
  webEvidence: [
    "apps/web/features/workbench/raw-floor-screening-route-support.test.ts",
    "apps/web/features/workbench/raw-concrete-helper-route-card-guard.test.ts",
    "apps/web/features/workbench/raw-floor-hostile-input-route-card-matrix.test.ts",
    "apps/web/features/workbench/raw-floor-safe-bare-split-parity.test.ts"
  ],
  runtimeAnchors: [
    "packages/engine/src/calculate-assembly.ts",
    "packages/engine/src/floor-system-estimate.ts",
    "packages/engine/src/impact-estimate.ts",
    "packages/engine/src/impact-support.ts"
  ],
  selectedBecause: [
    "broad_repo_validation_is_green_after_the_last_blocked_source_family_closed_fail_closed",
    "the_terminal_concrete_helper_floor_lane_is_already_live_and_formula_owned",
    "answer_support_and_route_card_guards_now_cover_fragmentation_hostile_input_and_nearby_negative_shapes",
    "the_next_coverage_gain_can_happen_inside_one_defended_floor_lane_without_reopening_any_closed_source_backed_family"
  ]
} as const;

const HELD_CLT_LOCAL_COMBINED_INTERACTION_EVIDENCE = {
  engineEvidence: [
    "packages/engine/src/impact-predictor-input.test.ts",
    "packages/engine/src/tuas-clt-backlog-decision-contract.test.ts"
  ],
  webEvidence: [
    "apps/web/features/workbench/clt-combined-anchor-history-replay-matrix.test.ts",
    "apps/web/features/workbench/floor-family-regressions.test.ts"
  ],
  heldBecause: [
    "under_described_combined_clt_direct_fixed_shapes_still_need_explicit_source_or_frequency_evidence",
    "c11c_remains_fail_closed_and_gdmtxa04a_remains_estimate_only_so_clt_local_combined_work_is_not_the_cleanest_next_runtime_cut",
    "the_raw_terminal_concrete_helper_lane_already_has_better_guarded_live_answer_surfaces_for_incremental_widening"
  ]
} as const;

describe("post broad audit and replanning pass v2 next slice selection contract", () => {
  it("selects the raw terminal-concrete helper corridor as the first post-audit active slice", () => {
    expect(POST_BROAD_AUDIT_AND_REPLANNING_PASS_V2_NEXT_SLICE_SELECTION).toEqual({
      sliceId: "post_broad_audit_and_replanning_pass_v2_next_slice_selection_v1",
      latestClosedImplementationSlice: "broad_audit_and_replanning_pass_v2",
      selectedImplementationSlice: "raw_terminal_concrete_helper_family_widening_v1",
      selectedOutputSurface: "raw_terminal_concrete_helper_widening_matrix",
      selectedRouteFamily: "raw_terminal_concrete_helper_floor_lane",
      selectionStatus: "selected_runtime_raw_helper_widening_after_broad_audit_replan",
      numericRuntimeBehaviorChange: false,
      runtimeWidening: true,
      nextExecutionAction: "raw_terminal_concrete_helper_family_widening_v1",
      followUpPlanningAction: "post_raw_terminal_concrete_helper_family_widening_next_slice_selection_v1"
    });

    expect(BROAD_AUDIT_AND_REPLANNING_SELECTION_MATRIX.find((candidate) => candidate.selectedNext)).toEqual({
      id: "raw_terminal_concrete_helper_family_widening_v1",
      selectedNext: true,
      runtimeWideningEligible: true,
      reason:
        "the_terminal_concrete_helper_floor_lane_is_already_live_formula_owned_and_now_has_green_answer_support_history_and_broad_validation_guards"
    });
  });

  it("keeps CLT-local work, concrete reopening, and all blocked-source families out of the next active slice", () => {
    expect(
      BROAD_AUDIT_AND_REPLANNING_SELECTION_MATRIX.filter((candidate) => candidate.runtimeWideningEligible)
    ).toEqual([
      {
        id: "raw_terminal_concrete_helper_family_widening_v1",
        selectedNext: true,
        runtimeWideningEligible: true,
        reason:
          "the_terminal_concrete_helper_floor_lane_is_already_live_formula_owned_and_now_has_green_answer_support_history_and_broad_validation_guards"
      }
    ]);

    expect(HELD_CLT_LOCAL_COMBINED_INTERACTION_EVIDENCE).toEqual({
      engineEvidence: [
        "packages/engine/src/impact-predictor-input.test.ts",
        "packages/engine/src/tuas-clt-backlog-decision-contract.test.ts"
      ],
      webEvidence: [
        "apps/web/features/workbench/clt-combined-anchor-history-replay-matrix.test.ts",
        "apps/web/features/workbench/floor-family-regressions.test.ts"
      ],
      heldBecause: [
        "under_described_combined_clt_direct_fixed_shapes_still_need_explicit_source_or_frequency_evidence",
        "c11c_remains_fail_closed_and_gdmtxa04a_remains_estimate_only_so_clt_local_combined_work_is_not_the_cleanest_next_runtime_cut",
        "the_raw_terminal_concrete_helper_lane_already_has_better_guarded_live_answer_surfaces_for_incremental_widening"
      ]
    });
  });

  it("ties the raw helper selection to the guarded live lane evidence instead of reopening closed candidates by inertia", () => {
    expect(SELECTED_RAW_TERMINAL_CONCRETE_HELPER_WIDENING_EVIDENCE).toEqual({
      engineEvidence: [
        "packages/engine/src/raw-floor-screening-carrier-support.test.ts",
        "packages/engine/src/raw-concrete-helper-answer-guard.test.ts",
        "packages/engine/src/raw-floor-hostile-input-answer-matrix.test.ts",
        "packages/engine/src/raw-floor-safe-bare-split-parity.test.ts",
        "packages/engine/src/output-origin-trace-matrix.test.ts"
      ],
      webEvidence: [
        "apps/web/features/workbench/raw-floor-screening-route-support.test.ts",
        "apps/web/features/workbench/raw-concrete-helper-route-card-guard.test.ts",
        "apps/web/features/workbench/raw-floor-hostile-input-route-card-matrix.test.ts",
        "apps/web/features/workbench/raw-floor-safe-bare-split-parity.test.ts"
      ],
      runtimeAnchors: [
        "packages/engine/src/calculate-assembly.ts",
        "packages/engine/src/floor-system-estimate.ts",
        "packages/engine/src/impact-estimate.ts",
        "packages/engine/src/impact-support.ts"
      ],
      selectedBecause: [
        "broad_repo_validation_is_green_after_the_last_blocked_source_family_closed_fail_closed",
        "the_terminal_concrete_helper_floor_lane_is_already_live_and_formula_owned",
        "answer_support_and_route_card_guards_now_cover_fragmentation_hostile_input_and_nearby_negative_shapes",
        "the_next_coverage_gain_can_happen_inside_one_defended_floor_lane_without_reopening_any_closed_source_backed_family"
      ]
    });
  });
});
