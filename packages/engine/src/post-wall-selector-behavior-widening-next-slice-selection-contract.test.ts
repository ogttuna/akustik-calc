import { describe, expect, it } from "vitest";

const POST_WALL_SELECTOR_BEHAVIOR_WIDENING_NEXT_SLICE_SELECTION = {
  sliceId: "post_wall_selector_behavior_widening_next_slice_selection_v1",
  latestClosedImplementationSlice: "wall_selector_behavior_widening",
  selectedImplementationSlice: "broad_audit_and_replanning_pass_v2",
  selectedOutputSurface: "calculator_living_plan_and_validation_baseline",
  selectedRouteFamily: "cross_corridor_program_state",
  selectionStatus: "selected_no_runtime_replan_after_last_blocked_family_fail_closed",
  numericRuntimeBehaviorChange: false,
  runtimeWidening: false,
  nextExecutionAction: "broad_audit_and_replanning_pass_v2",
  followUpPlanningAction: "post_broad_audit_and_replanning_pass_v2_next_slice_selection_v1"
} as const;

const WALL_SELECTOR_CLOSEOUT_SELECTION_MATRIX = [
  {
    id: "broad_audit_and_replanning_pass_v2",
    selectedNext: true,
    planningOnly: true,
    reason:
      "all_blocked_source_backed_runtime_families_are_now_closed_fail_closed_so_the_next_honest_move_is_a_broad_validation_and_replanning_pass_not_a_forced_reopen"
  },
  {
    id: "wall_selector_behavior_widening",
    selectedNext: false,
    planningOnly: false,
    reason:
      "the_rank_4_wall_selector_audit_found_no_fresh_classified_wall_red_beyond_the_already_closed_trace_guard"
  },
  {
    id: "raw_bare_open_box_open_web_impact_widening",
    selectedNext: false,
    planningOnly: false,
    reason:
      "the_closed_raw_family_still_only_has_packaged_system_rows_not_true_bare_carrier_impact_truth"
  },
  {
    id: "tuas_c11c_exact_import",
    selectedNext: false,
    planningOnly: false,
    reason:
      "the_closed_c11c_design_still_does_not_have_raw_spectrum_or_source_correction_evidence_for_the_weak_weighted_tuple"
  },
  {
    id: "dataholz_gdmtxa04a_exact_visible_reopen_candidate_v1",
    selectedNext: false,
    planningOnly: false,
    reason:
      "the_closed_dataholz_design_still_keeps_the_65mm_visible_surface_as_a_convenience_proxy_not_an_honest_exact_reopen"
  },
  {
    id: "reinforced_concrete_accuracy_reopen",
    selectedNext: false,
    planningOnly: false,
    reason:
      "the_closed_concrete_corridor_stays_conditional_only_without_a_new_proof_backed_overlap_or_formula_ownership_gap"
  }
] as const;

const CLOSED_BLOCKED_SOURCE_FAMILY_EVIDENCE = {
  engineEvidence: [
    "packages/engine/src/blocked-source-backed-widening-rerank-refresh-contract.test.ts",
    "packages/engine/src/post-blocked-source-backed-widening-rerank-refresh-next-slice-selection-contract.test.ts",
    "packages/engine/src/post-dataholz-gdmtxa04a-composite-surface-model-design-next-slice-selection-contract.test.ts",
    "packages/engine/src/post-tuas-c11c-exact-import-readiness-design-next-slice-selection-contract.test.ts",
    "packages/engine/src/post-raw-bare-open-box-open-web-impact-widening-next-slice-selection-contract.test.ts",
    "packages/engine/src/blocked-source-rank-4-wall-selector-feasibility-contract.test.ts",
    "packages/engine/src/source-gap-candidate-re-rank-contract.test.ts"
  ],
  selectedBecause: [
    "gdmtxa04a_c11c_raw_bare_and_wall_selector_now_all_have_explicit_fail_closed_closeout_evidence",
    "the_last_remaining_blocked_family_also_did_not_yield_a_fresh_classified_wall_red",
    "reopening_any_runtime_family_now_would_be_inertia_not_new_evidence",
    "the_program_needs_a_fresh_validation_baseline_and_roi_replan_before_another_runtime_slice_is_selected"
  ]
} as const;

describe("post wall-selector behavior widening next slice selection contract", () => {
  it("closes the last blocked wall family fail-closed and selects a broad audit and replanning pass", () => {
    expect(POST_WALL_SELECTOR_BEHAVIOR_WIDENING_NEXT_SLICE_SELECTION).toEqual({
      sliceId: "post_wall_selector_behavior_widening_next_slice_selection_v1",
      latestClosedImplementationSlice: "wall_selector_behavior_widening",
      selectedImplementationSlice: "broad_audit_and_replanning_pass_v2",
      selectedOutputSurface: "calculator_living_plan_and_validation_baseline",
      selectedRouteFamily: "cross_corridor_program_state",
      selectionStatus: "selected_no_runtime_replan_after_last_blocked_family_fail_closed",
      numericRuntimeBehaviorChange: false,
      runtimeWidening: false,
      nextExecutionAction: "broad_audit_and_replanning_pass_v2",
      followUpPlanningAction: "post_broad_audit_and_replanning_pass_v2_next_slice_selection_v1"
    });

    expect(WALL_SELECTOR_CLOSEOUT_SELECTION_MATRIX.find((candidate) => candidate.selectedNext)).toEqual({
      id: "broad_audit_and_replanning_pass_v2",
      selectedNext: true,
      planningOnly: true,
      reason:
        "all_blocked_source_backed_runtime_families_are_now_closed_fail_closed_so_the_next_honest_move_is_a_broad_validation_and_replanning_pass_not_a_forced_reopen"
    });
  });

  it("keeps all closed blocked families and conditional reopens fail-closed while the follow-up stays planning-only", () => {
    expect(WALL_SELECTOR_CLOSEOUT_SELECTION_MATRIX.filter((candidate) => candidate.planningOnly)).toEqual([
      {
        id: "broad_audit_and_replanning_pass_v2",
        selectedNext: true,
        planningOnly: true,
        reason:
          "all_blocked_source_backed_runtime_families_are_now_closed_fail_closed_so_the_next_honest_move_is_a_broad_validation_and_replanning_pass_not_a_forced_reopen"
      }
    ]);

    expect(WALL_SELECTOR_CLOSEOUT_SELECTION_MATRIX.filter((candidate) => !candidate.selectedNext)).toEqual([
      {
        id: "wall_selector_behavior_widening",
        selectedNext: false,
        planningOnly: false,
        reason:
          "the_rank_4_wall_selector_audit_found_no_fresh_classified_wall_red_beyond_the_already_closed_trace_guard"
      },
      {
        id: "raw_bare_open_box_open_web_impact_widening",
        selectedNext: false,
        planningOnly: false,
        reason:
          "the_closed_raw_family_still_only_has_packaged_system_rows_not_true_bare_carrier_impact_truth"
      },
      {
        id: "tuas_c11c_exact_import",
        selectedNext: false,
        planningOnly: false,
        reason:
          "the_closed_c11c_design_still_does_not_have_raw_spectrum_or_source_correction_evidence_for_the_weak_weighted_tuple"
      },
      {
        id: "dataholz_gdmtxa04a_exact_visible_reopen_candidate_v1",
        selectedNext: false,
        planningOnly: false,
        reason:
          "the_closed_dataholz_design_still_keeps_the_65mm_visible_surface_as_a_convenience_proxy_not_an_honest_exact_reopen"
      },
      {
        id: "reinforced_concrete_accuracy_reopen",
        selectedNext: false,
        planningOnly: false,
        reason:
          "the_closed_concrete_corridor_stays_conditional_only_without_a_new_proof_backed_overlap_or_formula_ownership_gap"
      }
    ]);
  });

  it("uses the landed blocked-family closeouts as evidence for a fresh program-level replan instead of a forced reopen", () => {
    expect(CLOSED_BLOCKED_SOURCE_FAMILY_EVIDENCE).toEqual({
      engineEvidence: [
        "packages/engine/src/blocked-source-backed-widening-rerank-refresh-contract.test.ts",
        "packages/engine/src/post-blocked-source-backed-widening-rerank-refresh-next-slice-selection-contract.test.ts",
        "packages/engine/src/post-dataholz-gdmtxa04a-composite-surface-model-design-next-slice-selection-contract.test.ts",
        "packages/engine/src/post-tuas-c11c-exact-import-readiness-design-next-slice-selection-contract.test.ts",
        "packages/engine/src/post-raw-bare-open-box-open-web-impact-widening-next-slice-selection-contract.test.ts",
        "packages/engine/src/blocked-source-rank-4-wall-selector-feasibility-contract.test.ts",
        "packages/engine/src/source-gap-candidate-re-rank-contract.test.ts"
      ],
      selectedBecause: [
        "gdmtxa04a_c11c_raw_bare_and_wall_selector_now_all_have_explicit_fail_closed_closeout_evidence",
        "the_last_remaining_blocked_family_also_did_not_yield_a_fresh_classified_wall_red",
        "reopening_any_runtime_family_now_would_be_inertia_not_new_evidence",
        "the_program_needs_a_fresh_validation_baseline_and_roi_replan_before_another_runtime_slice_is_selected"
      ]
    });
  });
});
