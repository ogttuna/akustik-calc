import { existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const POST_WALL_FRAMED_FACING_SPLIT_GATE_C_NEXT_SLICE_SELECTION = {
  closedImplementationSlice: "wall_framed_facing_split_warning_stability_v1",
  latestLandedGate: "gate_b_lsf_field_board_split_value_warning_stability_fix",
  nextExecutionAction:
    "gate_a_revalidate_remaining_calculator_source_and_accuracy_gap_order_after_framed_split_fix",
  numericRuntimeBehaviorChange: false,
  routeCardWorkRequiredNow: false,
  runtimeWidening: false,
  selectedImplementationSlice: "calculator_source_gap_revalidation_v3",
  selectedPlanningSurface:
    "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V3_PLAN.md",
  selectedRouteFamily: "calculator_source_accuracy_gap_revalidation_after_framed_split_fix",
  selectionStatus:
    "selected_no_runtime_after_local_framed_split_drift_fixed_without_reopening_source_blocked_families",
  sliceId: "post_wall_framed_facing_split_warning_stability_v1_next_slice_selection"
} as const;

const FRAMED_SPLIT_CLOSEOUT = {
  closedBecause: [
    "gate_a_found_lsf_field_board_split_value_plus_warning_drift_not_warning_only",
    "gate_b_fixed_lsf_field_board_split_values_back_to_baseline",
    "gate_b_removed_the_split_only_framed_reinforcement_monotonic_floor_warning",
    "gate_b_kept_lsf_lab_exact_and_timber_lab_field_split_stability_pinned",
    "gate_b_added_paired_web_route_card_coverage_for_the_visible_card_and_acoustic_warning_surface",
    "gate_b_preserved_the_no_global_same_material_board_coalescing_negative_boundary"
  ],
  executableProof: [
    "packages/engine/src/wall-framed-facing-split-warning-stability-gate-a-contract.test.ts",
    "packages/engine/src/wall-framed-facing-split-warning-stability-gate-b-contract.test.ts",
    "apps/web/features/workbench/wall-framed-facing-split-warning-stability-route-card-matrix.test.ts",
    "docs/calculator/CHECKPOINT_2026-04-28_WALL_FRAMED_FACING_SPLIT_WARNING_STABILITY_GATE_B_HANDOFF.md",
    "docs/calculator/SLICE_WALL_FRAMED_FACING_SPLIT_WARNING_STABILITY_PLAN.md"
  ],
  keptRuntimePosture: {
    coalesced25MmBoardsRemainDifferentTopology: true,
    fieldSplitValues: {
      c: -1.4,
      ctr: -6.4,
      dnA: 49.6,
      dnTA: 51.1,
      dnTw: 52,
      dnW: 51,
      rwPrime: 51,
      stc: 51
    },
    globalBoardCoalescingUsed: false,
    lsfLabExactRwDb: 55,
    monotonicFloorWarningStillSplitOnly: false,
    timberSplitValuesMoved: false
  },
  posture: "gate_b_runtime_fix_closed_with_regression_coverage_and_no_source_family_reopen"
} as const;

const NEXT_SLICE_SELECTION_MATRIX = [
  {
    id: "calculator_source_gap_revalidation_v3",
    reason:
      "framed_split_was_a_local_engine_addressable_drift_and_is_now_fixed_so_the_next_honest_step_is_to_re_rank_remaining_source_blocked_and_accuracy_backlog_items_before_any_new_runtime_or_productization_work",
    runtimeWideningEligibleNow: false,
    selectedNext: true,
    targetFile: "packages/engine/src/calculator-source-gap-revalidation-v3-gate-a-contract.test.ts"
  },
  {
    id: "wall_framed_split_additional_runtime_work",
    reason:
      "gate_b_already_fixed_the_known_lsf_field_board_split_drift_and_added_web_coverage_so_more_runtime_work_in_this_slice_would_be_unscoped",
    runtimeWideningEligibleNow: false,
    selectedNext: false,
    targetFile: "packages/engine/src/wall-framed-facing-split-warning-stability-gate-b-contract.test.ts"
  },
  {
    id: "wall_source_holdout_runtime_reopen",
    reason:
      "no_stud_double_leaf_timber_double_board_clt_and_lined_massive_wall_holdouts_still_lack_new_direct_rows_or_bounded_tolerance_owners",
    runtimeWideningEligibleNow: false,
    selectedNext: false,
    targetFile: "docs/calculator/SOURCE_GAP_LEDGER.md"
  },
  {
    id: "floor_fallback_runtime_promotion",
    reason:
      "floor_fallback_remains_low_confidence_without_new_source_evidence_or_a_bounded_family_rule_and_should_be_re_ranked_before_reopening",
    runtimeWideningEligibleNow: false,
    selectedNext: false,
    targetFile: "packages/engine/src/floor-fallback-low-confidence-gate-b-source-contract.test.ts"
  },
  {
    id: "remaining_dynamic_airborne_recursive_guard_carves",
    reason:
      "optional_architecture_backlog_does_not_outrank_a_fresh_calculator_source_accuracy_rerank_after_the_last_documented_runtime_drift_closed",
    runtimeWideningEligibleNow: false,
    selectedNext: false,
    targetFile: "docs/calculator/DYNAMIC_AIRBORNE_CARTOGRAPHY.md"
  },
  {
    id: "productization_only_work",
    reason:
      "calculator_scope_and_accuracy_remain_the_active_priority_and_productization_should_not_resume_from_a_local_runtime_bugfix_green_result",
    runtimeWideningEligibleNow: false,
    selectedNext: false,
    targetFile: "docs/calculator/POST_CALCULATOR_PRODUCTIZATION_ROADMAP.md"
  }
] as const;

const SELECTED_CALCULATOR_SOURCE_GAP_REVALIDATION_V3_GATE_A_CONTRACT = {
  firstGate: "gate_a_revalidate_remaining_calculator_source_and_accuracy_gap_order_after_framed_split_fix",
  requiredCandidateFamilies: [
    "framed_split_fix_closeout_and_regression_posture",
    "wall_source_holdouts_no_stud_double_leaf_timber_double_board_clt_and_lined_massive",
    "floor_fallback_low_confidence_and_historical_blocked_floor_source_families",
    "internal_pilot_regular_internal_use_and_comprehensive_accuracy_readiness_tiers",
    "remaining_engine_addressable_edge_case_or_invariant_gaps",
    "optional_architecture_and_productization_tracks_that_should_not_outrank_calculator_accuracy_without_new_risk"
  ],
  requiredEvidenceFields: [
    "candidate_id_current_posture_and_user_visible_risk",
    "latest_executable_evidence_owner_and_doc_owner",
    "runtime_import_or_formula_tolerance_prerequisites",
    "negative_boundaries_that_must_stay_closed",
    "selected_next_slice_with_target_gate_file_and_validation_scope"
  ],
  requiredPlanningSurfaces: [
    "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V3_PLAN.md",
    "docs/calculator/SOURCE_GAP_LEDGER.md",
    "docs/calculator/CURRENT_STATE.md",
    "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
    "docs/calculator/MASTER_PLAN.md",
    "docs/calculator/SLICE_INTERNAL_USE_OPERATING_ENVELOPE_V1_PLAN.md",
    "docs/calculator/CALCULATOR_COMPREHENSIVE_ACCURACY_ROADMAP.md"
  ],
  runtimeBehaviorChange: false
} as const;

const ACTIVE_BOUNDARIES = {
  disallowedMoves: [
    "change_gate_b_lsf_field_split_values_during_gate_c_closeout",
    "remove_the_paired_web_route_card_regression_for_visible_framed_split_behavior",
    "use_global_same_material_board_coalescing_as_a_follow_up",
    "reopen_source_blocked_wall_or_floor_families_from_the_framed_split_fix",
    "claim_floor_fallback_or_wall_source_holdout_runtime_eligibility_without_new_source_or_bounded_tolerance_evidence",
    "resume_productization_before_the_selected_calculator_source_gap_revalidation_v3_closes_or_priority_changes"
  ]
} as const;

describe("post wall framed facing split warning stability next-slice selection contract", () => {
  it("closes the framed split stability slice and selects source-gap revalidation v3", () => {
    expect(POST_WALL_FRAMED_FACING_SPLIT_GATE_C_NEXT_SLICE_SELECTION).toEqual({
      closedImplementationSlice: "wall_framed_facing_split_warning_stability_v1",
      latestLandedGate: "gate_b_lsf_field_board_split_value_warning_stability_fix",
      nextExecutionAction:
        "gate_a_revalidate_remaining_calculator_source_and_accuracy_gap_order_after_framed_split_fix",
      numericRuntimeBehaviorChange: false,
      routeCardWorkRequiredNow: false,
      runtimeWidening: false,
      selectedImplementationSlice: "calculator_source_gap_revalidation_v3",
      selectedPlanningSurface:
        "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V3_PLAN.md",
      selectedRouteFamily: "calculator_source_accuracy_gap_revalidation_after_framed_split_fix",
      selectionStatus:
        "selected_no_runtime_after_local_framed_split_drift_fixed_without_reopening_source_blocked_families",
      sliceId: "post_wall_framed_facing_split_warning_stability_v1_next_slice_selection"
    });

    for (const path of [
      POST_WALL_FRAMED_FACING_SPLIT_GATE_C_NEXT_SLICE_SELECTION.selectedPlanningSurface,
      "docs/calculator/SLICE_INTERNAL_USE_OPERATING_ENVELOPE_V1_PLAN.md",
      "docs/calculator/CALCULATOR_COMPREHENSIVE_ACCURACY_ROADMAP.md",
      "docs/calculator/CHECKPOINT_2026-04-28_WALL_FRAMED_FACING_SPLIT_WARNING_STABILITY_GATE_C_CLOSEOUT_HANDOFF.md",
      "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
      "docs/calculator/CURRENT_STATE.md"
    ]) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("ties the closeout to Gate A and Gate B evidence without further runtime movement", () => {
    expect(FRAMED_SPLIT_CLOSEOUT.posture).toBe(
      "gate_b_runtime_fix_closed_with_regression_coverage_and_no_source_family_reopen"
    );
    expect(FRAMED_SPLIT_CLOSEOUT.keptRuntimePosture).toEqual({
      coalesced25MmBoardsRemainDifferentTopology: true,
      fieldSplitValues: {
        c: -1.4,
        ctr: -6.4,
        dnA: 49.6,
        dnTA: 51.1,
        dnTw: 52,
        dnW: 51,
        rwPrime: 51,
        stc: 51
      },
      globalBoardCoalescingUsed: false,
      lsfLabExactRwDb: 55,
      monotonicFloorWarningStillSplitOnly: false,
      timberSplitValuesMoved: false
    });

    for (const path of FRAMED_SPLIT_CLOSEOUT.executableProof) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("selects revalidation before reopening any source-blocked or productization track", () => {
    expect(NEXT_SLICE_SELECTION_MATRIX.filter((candidate) => candidate.selectedNext)).toEqual([
      {
        id: "calculator_source_gap_revalidation_v3",
        reason:
          "framed_split_was_a_local_engine_addressable_drift_and_is_now_fixed_so_the_next_honest_step_is_to_re_rank_remaining_source_blocked_and_accuracy_backlog_items_before_any_new_runtime_or_productization_work",
        runtimeWideningEligibleNow: false,
        selectedNext: true,
        targetFile: "packages/engine/src/calculator-source-gap-revalidation-v3-gate-a-contract.test.ts"
      }
    ]);
    expect(NEXT_SLICE_SELECTION_MATRIX.every((candidate) => candidate.reason.length > 60)).toBe(true);
    expect(NEXT_SLICE_SELECTION_MATRIX.every((candidate) => candidate.runtimeWideningEligibleNow === false)).toBe(true);
  });

  it("defines the first gate of the selected v3 revalidation slice", () => {
    expect(SELECTED_CALCULATOR_SOURCE_GAP_REVALIDATION_V3_GATE_A_CONTRACT).toEqual({
      firstGate: "gate_a_revalidate_remaining_calculator_source_and_accuracy_gap_order_after_framed_split_fix",
      requiredCandidateFamilies: [
        "framed_split_fix_closeout_and_regression_posture",
        "wall_source_holdouts_no_stud_double_leaf_timber_double_board_clt_and_lined_massive",
        "floor_fallback_low_confidence_and_historical_blocked_floor_source_families",
        "internal_pilot_regular_internal_use_and_comprehensive_accuracy_readiness_tiers",
        "remaining_engine_addressable_edge_case_or_invariant_gaps",
        "optional_architecture_and_productization_tracks_that_should_not_outrank_calculator_accuracy_without_new_risk"
      ],
      requiredEvidenceFields: [
        "candidate_id_current_posture_and_user_visible_risk",
        "latest_executable_evidence_owner_and_doc_owner",
        "runtime_import_or_formula_tolerance_prerequisites",
        "negative_boundaries_that_must_stay_closed",
        "selected_next_slice_with_target_gate_file_and_validation_scope"
      ],
      requiredPlanningSurfaces: [
        "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V3_PLAN.md",
        "docs/calculator/SOURCE_GAP_LEDGER.md",
        "docs/calculator/CURRENT_STATE.md",
        "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
        "docs/calculator/MASTER_PLAN.md",
        "docs/calculator/SLICE_INTERNAL_USE_OPERATING_ENVELOPE_V1_PLAN.md",
        "docs/calculator/CALCULATOR_COMPREHENSIVE_ACCURACY_ROADMAP.md"
      ],
      runtimeBehaviorChange: false
    });
  });

  it("keeps framed split, source-family, floor fallback, and productization boundaries closed", () => {
    expect(ACTIVE_BOUNDARIES.disallowedMoves).toEqual([
      "change_gate_b_lsf_field_split_values_during_gate_c_closeout",
      "remove_the_paired_web_route_card_regression_for_visible_framed_split_behavior",
      "use_global_same_material_board_coalescing_as_a_follow_up",
      "reopen_source_blocked_wall_or_floor_families_from_the_framed_split_fix",
      "claim_floor_fallback_or_wall_source_holdout_runtime_eligibility_without_new_source_or_bounded_tolerance_evidence",
      "resume_productization_before_the_selected_calculator_source_gap_revalidation_v3_closes_or_priority_changes"
    ]);
  });
});
