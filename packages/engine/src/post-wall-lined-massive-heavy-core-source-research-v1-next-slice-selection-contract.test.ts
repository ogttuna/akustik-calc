import { existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const POST_WALL_LINED_MASSIVE_HEAVY_CORE_SOURCE_RESEARCH_GATE_C_NEXT_SLICE_SELECTION = {
  closedImplementationSlice: "wall_lined_massive_heavy_core_source_research_v1",
  latestLandedGate:
    "wall_lined_massive_heavy_core_source_research_v1_gate_a_no_runtime_source_and_bounded_lining_rule_inventory",
  nextExecutionAction:
    "gate_a_revalidate_source_accuracy_gap_order_after_wall_source_chain_no_runtime_closeout",
  numericRuntimeBehaviorChange: false,
  routeCardWorkRequiredNow: false,
  runtimeWidening: false,
  selectedImplementationSlice: "calculator_source_gap_revalidation_v2",
  selectedPlanningSurface:
    "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V2_PLAN.md",
  selectedRouteFamily: "calculator_source_accuracy_gap_revalidation_after_wall_chain",
  selectionStatus:
    "selected_no_runtime_after_wall_lined_massive_sources_remained_missing_floor_only_adjacent_or_unbounded",
  sliceId: "post_wall_lined_massive_heavy_core_source_research_v1_next_slice_selection"
} as const;

const WALL_LINED_MASSIVE_HEAVY_CORE_CLOSEOUT = {
  closedBecause: [
    "gate_a_found_no_wall_specific_lined_concrete_or_heavy_masonry_source_row",
    "gate_a_kept_knauf_cc60_concrete_rows_floor_only",
    "gate_a_kept_manufacturer_lining_context_adjacent_and_unimported",
    "gate_a_found_no_named_lined_massive_wall_formula_tolerance_owner",
    "gate_a_kept_selector_value_pins_and_deep_hybrid_rows_as_stability_boundaries",
    "web_route_card_work_is_not_required_because_no_visible_output_support_confidence_evidence_or_missing_input_copy_changed"
  ],
  executableProof: [
    "packages/engine/src/wall-lined-massive-heavy-core-source-research-gate-a-contract.test.ts",
    "docs/calculator/CHECKPOINT_2026-04-28_WALL_LINED_MASSIVE_HEAVY_CORE_SOURCE_RESEARCH_GATE_A_HANDOFF.md",
    "docs/calculator/SLICE_WALL_LINED_MASSIVE_HEAVY_CORE_SOURCE_RESEARCH_PLAN.md"
  ],
  keptRuntimePosture: {
    linedMassiveHeavyCore: {
      confidence: "medium",
      currentSourcePosture: "screening_no_wall_source_or_bounded_lining_rule",
      dynamicFamily: "lined_massive_wall",
      evidenceTier: "screening",
      fieldDnTADb: 54.9,
      fieldContextDnTwDb: 56,
      fieldRwPrimeDb: 55,
      generatedCaseId: "wall-screening-concrete",
      labRwDb: 57,
      routeStrategy: "lined_massive_blend",
      runtimeMovementAllowed: false,
      supportedFieldOutputs: ["R'w", "Dn,w", "DnT,w", "DnT,A"]
    }
  },
  posture: "no_runtime_gate_a_inventory_closed_without_direct_import_or_formula_tolerance_gate"
} as const;

const NEXT_SLICE_SELECTION_MATRIX = [
  {
    id: "calculator_source_gap_revalidation_v2",
    reason:
      "the_wall_source_research_chain_for_no_stud_double_leaf_timber_double_board_clt_and_lined_massive_heavy_core_has_now_closed_no_runtime_so_the_next_honest_step_is_a_fresh_cross_floor_wall_source_accuracy_rerank_before_any_new_runtime_or_productization_work",
    runtimeWideningEligibleNow: false,
    selectedNext: true
  },
  {
    id: "wall_lined_massive_heavy_core_runtime_import_or_retune",
    reason:
      "gate_a_found_no_wall_specific_source_row_no_import_ready_manufacturer_lining_row_and_no_bounded_lined_massive_formula_tolerance_owner",
    runtimeWideningEligibleNow: false,
    selectedNext: false
  },
  {
    id: "floor_fallback_source_tolerance_research_v1",
    reason:
      "floor_fallback_still_matters_but_remains_low_confidence_without_new_source_evidence_or_a_bounded_family_rule_and_should_be_re_ranked_against_other_accuracy_gaps_before_reopening",
    runtimeWideningEligibleNow: false,
    selectedNext: false
  },
  {
    id: "blocked_floor_source_reopens_gdmtxa04a_c11c_raw_bare",
    reason:
      "the_historical_blocked_floor_source_families_remain_closed_fail_closed_until_new_source_evidence_explicitly_reopens_one_of_them",
    runtimeWideningEligibleNow: false,
    selectedNext: false
  },
  {
    id: "dynamic_airborne_optional_recursive_guard_carves",
    reason:
      "remaining_recursive_guard_carves_are_optional_architecture_backlog_after_c6_closed_and_do_not_outrank_source_accuracy_revalidation",
    runtimeWideningEligibleNow: false,
    selectedNext: false
  },
  {
    id: "productization_or_route_card_only_work",
    reason:
      "calculator_accuracy_and_coverage_are_the_active_priority_and_no_visible_support_confidence_or_evidence_copy_changed",
    runtimeWideningEligibleNow: false,
    selectedNext: false
  }
] as const;

const SELECTED_CALCULATOR_SOURCE_GAP_REVALIDATION_V2_GATE_A_CONTRACT = {
  firstGate: "gate_a_revalidate_source_accuracy_gap_order_after_wall_source_chain_no_runtime_closeout",
  requiredCandidateFamilies: [
    "wall_source_chain_holdouts_no_stud_double_leaf_timber_double_board_clt_and_lined_massive",
    "floor_fallback_low_confidence_and_field_continuation_accuracy_surfaces",
    "historical_blocked_source_families_gdmtxa04a_c11c_raw_bare_open_box_open_web_and_wall_selector",
    "runtime_guardrails_for_many_layers_reorder_invalid_thickness_and_unsupported_outputs",
    "optional_architecture_guard_carves_that_should_not_outrank_calculator_accuracy_without_a_new_risk"
  ],
  requiredEvidenceFields: [
    "candidate_id_current_posture_and_current_user_visible_risk",
    "latest_executable_evidence_owner_and_doc_owner",
    "runtime_import_or_formula_tolerance_prerequisites",
    "negative_boundaries_that_must_stay_closed",
    "selected_next_slice_with_target_gate_file_and_validation_scope"
  ],
  requiredPlanningSurfaces: [
    "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V2_PLAN.md",
    "docs/calculator/SOURCE_GAP_LEDGER.md",
    "docs/calculator/CURRENT_STATE.md",
    "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
    "docs/calculator/MASTER_PLAN.md"
  ],
  runtimeBehaviorChange: false
} as const;

const ACTIVE_BOUNDARIES = {
  disallowedMoves: [
    "change_lined_massive_heavy_core_values_during_gate_c_closeout",
    "borrow_knauf_cc60_or_any_floor_system_rows_as_wall_lined_massive_truth",
    "promote_wall_lined_massive_heavy_core_screening_without_new_source_or_bounded_lining_rule",
    "reopen_no_stud_timber_double_board_clt_or_floor_fallback_from_nearby_green_tests_alone",
    "change_support_confidence_evidence_text_or_route_card_copy_without_paired_tests",
    "resume_productization_before_the_selected_calculator_source_accuracy_revalidation_closes_or_priority_changes"
  ]
} as const;

describe("post wall lined massive / heavy-core source research next-slice selection contract", () => {
  it("closes the lined massive / heavy-core source research slice no-runtime and selects source-gap revalidation v2", () => {
    expect(POST_WALL_LINED_MASSIVE_HEAVY_CORE_SOURCE_RESEARCH_GATE_C_NEXT_SLICE_SELECTION).toEqual({
      closedImplementationSlice: "wall_lined_massive_heavy_core_source_research_v1",
      latestLandedGate:
        "wall_lined_massive_heavy_core_source_research_v1_gate_a_no_runtime_source_and_bounded_lining_rule_inventory",
      nextExecutionAction:
        "gate_a_revalidate_source_accuracy_gap_order_after_wall_source_chain_no_runtime_closeout",
      numericRuntimeBehaviorChange: false,
      routeCardWorkRequiredNow: false,
      runtimeWidening: false,
      selectedImplementationSlice: "calculator_source_gap_revalidation_v2",
      selectedPlanningSurface:
        "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V2_PLAN.md",
      selectedRouteFamily: "calculator_source_accuracy_gap_revalidation_after_wall_chain",
      selectionStatus:
        "selected_no_runtime_after_wall_lined_massive_sources_remained_missing_floor_only_adjacent_or_unbounded",
      sliceId: "post_wall_lined_massive_heavy_core_source_research_v1_next_slice_selection"
    });

    for (const path of [
      POST_WALL_LINED_MASSIVE_HEAVY_CORE_SOURCE_RESEARCH_GATE_C_NEXT_SLICE_SELECTION.selectedPlanningSurface,
      "docs/calculator/CHECKPOINT_2026-04-28_WALL_LINED_MASSIVE_HEAVY_CORE_SOURCE_RESEARCH_GATE_C_CLOSEOUT_HANDOFF.md",
      "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
      "docs/calculator/CURRENT_STATE.md"
    ]) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("ties the closeout to lined massive Gate A blockers without moving the live route", () => {
    expect(WALL_LINED_MASSIVE_HEAVY_CORE_CLOSEOUT.posture).toBe(
      "no_runtime_gate_a_inventory_closed_without_direct_import_or_formula_tolerance_gate"
    );
    expect(WALL_LINED_MASSIVE_HEAVY_CORE_CLOSEOUT.keptRuntimePosture).toEqual({
      linedMassiveHeavyCore: {
        confidence: "medium",
        currentSourcePosture: "screening_no_wall_source_or_bounded_lining_rule",
        dynamicFamily: "lined_massive_wall",
        evidenceTier: "screening",
        fieldDnTADb: 54.9,
        fieldContextDnTwDb: 56,
        fieldRwPrimeDb: 55,
        generatedCaseId: "wall-screening-concrete",
        labRwDb: 57,
        routeStrategy: "lined_massive_blend",
        runtimeMovementAllowed: false,
        supportedFieldOutputs: ["R'w", "Dn,w", "DnT,w", "DnT,A"]
      }
    });

    for (const path of WALL_LINED_MASSIVE_HEAVY_CORE_CLOSEOUT.executableProof) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("selects calculator source-gap revalidation v2 after the wall source chain closes no-runtime", () => {
    expect(NEXT_SLICE_SELECTION_MATRIX.filter((candidate) => candidate.selectedNext)).toEqual([
      {
        id: "calculator_source_gap_revalidation_v2",
        reason:
          "the_wall_source_research_chain_for_no_stud_double_leaf_timber_double_board_clt_and_lined_massive_heavy_core_has_now_closed_no_runtime_so_the_next_honest_step_is_a_fresh_cross_floor_wall_source_accuracy_rerank_before_any_new_runtime_or_productization_work",
        runtimeWideningEligibleNow: false,
        selectedNext: true
      }
    ]);
    expect(NEXT_SLICE_SELECTION_MATRIX.every((candidate) => candidate.runtimeWideningEligibleNow === false)).toBe(true);
    expect(NEXT_SLICE_SELECTION_MATRIX.every((candidate) => candidate.reason.length > 50)).toBe(true);
  });

  it("defines the first gate of the selected revalidation slice before any runtime movement", () => {
    expect(SELECTED_CALCULATOR_SOURCE_GAP_REVALIDATION_V2_GATE_A_CONTRACT).toEqual({
      firstGate: "gate_a_revalidate_source_accuracy_gap_order_after_wall_source_chain_no_runtime_closeout",
      requiredCandidateFamilies: [
        "wall_source_chain_holdouts_no_stud_double_leaf_timber_double_board_clt_and_lined_massive",
        "floor_fallback_low_confidence_and_field_continuation_accuracy_surfaces",
        "historical_blocked_source_families_gdmtxa04a_c11c_raw_bare_open_box_open_web_and_wall_selector",
        "runtime_guardrails_for_many_layers_reorder_invalid_thickness_and_unsupported_outputs",
        "optional_architecture_guard_carves_that_should_not_outrank_calculator_accuracy_without_a_new_risk"
      ],
      requiredEvidenceFields: [
        "candidate_id_current_posture_and_current_user_visible_risk",
        "latest_executable_evidence_owner_and_doc_owner",
        "runtime_import_or_formula_tolerance_prerequisites",
        "negative_boundaries_that_must_stay_closed",
        "selected_next_slice_with_target_gate_file_and_validation_scope"
      ],
      requiredPlanningSurfaces: [
        "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V2_PLAN.md",
        "docs/calculator/SOURCE_GAP_LEDGER.md",
        "docs/calculator/CURRENT_STATE.md",
        "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
        "docs/calculator/MASTER_PLAN.md"
      ],
      runtimeBehaviorChange: false
    });
  });

  it("keeps lined massive, source-family, route-card, and productization boundaries closed", () => {
    expect(ACTIVE_BOUNDARIES.disallowedMoves).toEqual([
      "change_lined_massive_heavy_core_values_during_gate_c_closeout",
      "borrow_knauf_cc60_or_any_floor_system_rows_as_wall_lined_massive_truth",
      "promote_wall_lined_massive_heavy_core_screening_without_new_source_or_bounded_lining_rule",
      "reopen_no_stud_timber_double_board_clt_or_floor_fallback_from_nearby_green_tests_alone",
      "change_support_confidence_evidence_text_or_route_card_copy_without_paired_tests",
      "resume_productization_before_the_selected_calculator_source_accuracy_revalidation_closes_or_priority_changes"
    ]);
  });
});
