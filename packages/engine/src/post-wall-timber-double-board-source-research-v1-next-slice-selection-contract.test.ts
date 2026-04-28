import { existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const POST_WALL_TIMBER_DOUBLE_BOARD_SOURCE_RESEARCH_GATE_C_NEXT_SLICE_SELECTION = {
  closedImplementationSlice: "wall_timber_double_board_source_research_v1",
  latestLandedGate:
    "wall_timber_double_board_source_research_v1_gate_a_no_runtime_source_and_tolerance_inventory",
  nextExecutionAction:
    "gate_a_inventory_wall_specific_clt_rows_and_laminated_leaf_tolerance_no_runtime_change",
  numericRuntimeBehaviorChange: false,
  routeCardWorkRequiredNow: false,
  runtimeWidening: false,
  selectedImplementationSlice: "wall_clt_wall_source_research_v1",
  selectedPlanningSurface: "docs/calculator/SLICE_WALL_CLT_WALL_SOURCE_RESEARCH_PLAN.md",
  selectedRouteFamily: "wall_clt_mass_timber_source_and_laminated_leaf_tolerance_research",
  selectionStatus:
    "selected_no_runtime_after_timber_double_board_sources_remained_adjacent_or_unbounded",
  sliceId: "post_wall_timber_double_board_source_research_v1_next_slice_selection"
} as const;

const WALL_TIMBER_DOUBLE_BOARD_CLOSEOUT = {
  closedBecause: [
    "gate_a_found_no_direct_same_stack_timber_double_board_source_row",
    "gate_a_kept_direct_single_board_timber_rows_as_adjacent_only",
    "gate_a_kept_resilient_rb1_rb2_rows_side_count_and_topology_bounded",
    "gate_a_kept_gyproc_fireline_direct_double_board_row_as_secondary_benchmark_not_live_stack_import",
    "gate_a_found_no_named_bounded_timber_stud_formula_tolerance_owner",
    "web_route_card_work_is_not_required_because_no_visible_output_support_confidence_evidence_or_missing_input_copy_changed"
  ],
  executableProof: [
    "packages/engine/src/wall-timber-double-board-source-research-gate-a-contract.test.ts",
    "docs/calculator/CHECKPOINT_2026-04-28_WALL_TIMBER_DOUBLE_BOARD_SOURCE_RESEARCH_GATE_A_HANDOFF.md",
    "docs/calculator/SLICE_WALL_TIMBER_DOUBLE_BOARD_SOURCE_RESEARCH_PLAN.md"
  ],
  keptRuntimePosture: {
    timberDoubleBoard: {
      currentSourcePosture: "formula_owned_no_exact_or_bounded_source",
      confidence: "low",
      fieldContextDnTwDb: 43,
      fieldRwPrimeDb: 42,
      generatedCaseId: "wall-timber-stud",
      labRwDb: 50,
      routeStrategy: "stud_surrogate_blend+framed_wall_calibration",
      runtimeMovementAllowed: false,
      workbenchBuildingContextDnTwDb: 44
    }
  },
  posture: "no_runtime_gate_a_inventory_closed_without_direct_import_or_formula_tolerance_gate"
} as const;

const NEXT_SLICE_SELECTION_MATRIX = [
  {
    id: "wall_clt_wall_source_research_v1",
    reason:
      "source_catalog_lists_clt_wall_as_the_next_common_wall_gap_after_timber_double_board_and_current_wall_clt_route_is_formula_owned_without_wall_specific_source_truth",
    runtimeWideningEligibleNow: false,
    selectedNext: true
  },
  {
    id: "wall_timber_double_board_runtime_import_or_retune",
    reason:
      "gate_a_found_only_adjacent_single_board_resilient_secondary_or_non_timber_context_and_no_bounded_formula_tolerance_owner",
    runtimeWideningEligibleNow: false,
    selectedNext: false
  },
  {
    id: "wall_lined_massive_heavy_core_source_rule_v1",
    reason:
      "still_valid_but_prior_heavy_core_screening_remains_honest_until_a_bounded_lining_rule_or_direct_source_row_exists",
    runtimeWideningEligibleNow: false,
    selectedNext: false
  },
  {
    id: "wall_no_stud_double_leaf_runtime_import_or_retune",
    reason:
      "previous_no_stud_gate_b_found_no_direct_row_no_local_single_number_tolerance_and_no_nrc_row_mapping_for_runtime_movement",
    runtimeWideningEligibleNow: false,
    selectedNext: false
  },
  {
    id: "floor_fallback_source_tolerance_research_v1",
    reason:
      "personal_use_floor_fallback_chain_is_closed_no_runtime_and_current_follow_up_requires_new_source_evidence_not_a_closeout_reopen",
    runtimeWideningEligibleNow: false,
    selectedNext: false
  },
  {
    id: "productization_or_route_card_only_work",
    reason:
      "calculator_accuracy_is_the_active_priority_and_no_visible_support_confidence_or_evidence_copy_changed",
    runtimeWideningEligibleNow: false,
    selectedNext: false
  }
] as const;

const SELECTED_CLT_WALL_GATE_A_CONTRACT = {
  firstGate: "gate_a_wall_specific_clt_source_and_laminated_leaf_tolerance_inventory",
  requiredEvidenceFields: [
    "source_label_url_page_table_row_or_local_path_and_retrieval_date",
    "wall_specific_clt_or_laminated_leaf_layer_order_thickness_density_or_surface_mass",
    "mounting_boundary_conditions_lining_decoupling_air_cavity_and_orientation_metadata",
    "reported_metric_rw_r_prime_w_dntw_dnta_spectrum_lab_or_field_context_and_tolerance",
    "local_material_mapping_confidence_and_floor_vs_wall_source_scope",
    "engine_value_test_and_web_route_card_test_requirements_before_any_visible_movement"
  ],
  requiredSourceFamilies: [
    "wall_specific_clt_or_mass_timber_single_leaf_rows_matching_the_live_preset_topology",
    "clt_wall_lined_or_decoupled_rows_that_must_stay_mounting_and_side_order_bounded",
    "documented_laminated_single_leaf_or_mass_timber_formula_references_with_explicit_tolerance",
    "dataholz_floor_clt_rows_as_floor_only_negative_boundaries",
    "exact_verified_airborne_and_lab_fallback_absence_as_current_runtime_boundaries"
  ],
  runtimeBehaviorChange: false,
  targetCurrentRoute: {
    confidence: "medium",
    fieldDnTwDb: 42,
    fieldRwPrimeDb: 41,
    generatedCaseId: "wall-clt-local",
    labRwDb: 42,
    strategy: "laminated_leaf_sharp_delegate"
  }
} as const;

const ACTIVE_BOUNDARIES = {
  disallowedMoves: [
    "change_timber_double_board_values_during_gate_c_closeout",
    "promote_single_board_resilient_secondary_or_steel_context_to_live_timber_double_board_truth",
    "borrow_dataholz_floor_clt_rows_as_wall_clt_truth",
    "change_support_confidence_evidence_text_or_route_card_copy_without_paired_tests",
    "reopen_GDMTXA04A_C11c_raw_bare_open_box_open_web_heavy_concrete_or_wall_selector_from_this_green_test",
    "resume_productization_before_the_selected_calculator_source_research_slice_closes_or_priority_changes"
  ]
} as const;

describe("post wall timber double-board source research next-slice selection contract", () => {
  it("closes the timber double-board source research slice no-runtime and selects CLT wall research", () => {
    expect(POST_WALL_TIMBER_DOUBLE_BOARD_SOURCE_RESEARCH_GATE_C_NEXT_SLICE_SELECTION).toEqual({
      closedImplementationSlice: "wall_timber_double_board_source_research_v1",
      latestLandedGate:
        "wall_timber_double_board_source_research_v1_gate_a_no_runtime_source_and_tolerance_inventory",
      nextExecutionAction:
        "gate_a_inventory_wall_specific_clt_rows_and_laminated_leaf_tolerance_no_runtime_change",
      numericRuntimeBehaviorChange: false,
      routeCardWorkRequiredNow: false,
      runtimeWidening: false,
      selectedImplementationSlice: "wall_clt_wall_source_research_v1",
      selectedPlanningSurface: "docs/calculator/SLICE_WALL_CLT_WALL_SOURCE_RESEARCH_PLAN.md",
      selectedRouteFamily: "wall_clt_mass_timber_source_and_laminated_leaf_tolerance_research",
      selectionStatus:
        "selected_no_runtime_after_timber_double_board_sources_remained_adjacent_or_unbounded",
      sliceId: "post_wall_timber_double_board_source_research_v1_next_slice_selection"
    });

    for (const path of [
      POST_WALL_TIMBER_DOUBLE_BOARD_SOURCE_RESEARCH_GATE_C_NEXT_SLICE_SELECTION.selectedPlanningSurface,
      "docs/calculator/CHECKPOINT_2026-04-28_WALL_TIMBER_DOUBLE_BOARD_SOURCE_RESEARCH_GATE_C_CLOSEOUT_HANDOFF.md",
      "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
      "docs/calculator/CURRENT_STATE.md"
    ]) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("ties the closeout to Gate A blockers without moving the live timber route", () => {
    expect(WALL_TIMBER_DOUBLE_BOARD_CLOSEOUT.posture).toBe(
      "no_runtime_gate_a_inventory_closed_without_direct_import_or_formula_tolerance_gate"
    );
    expect(WALL_TIMBER_DOUBLE_BOARD_CLOSEOUT.keptRuntimePosture).toEqual({
      timberDoubleBoard: {
        currentSourcePosture: "formula_owned_no_exact_or_bounded_source",
        confidence: "low",
        fieldContextDnTwDb: 43,
        fieldRwPrimeDb: 42,
        generatedCaseId: "wall-timber-stud",
        labRwDb: 50,
        routeStrategy: "stud_surrogate_blend+framed_wall_calibration",
        runtimeMovementAllowed: false,
        workbenchBuildingContextDnTwDb: 44
      }
    });

    for (const path of WALL_TIMBER_DOUBLE_BOARD_CLOSEOUT.executableProof) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("selects CLT wall as the next highest-value source research slice", () => {
    expect(NEXT_SLICE_SELECTION_MATRIX.filter((candidate) => candidate.selectedNext)).toEqual([
      {
        id: "wall_clt_wall_source_research_v1",
        reason:
          "source_catalog_lists_clt_wall_as_the_next_common_wall_gap_after_timber_double_board_and_current_wall_clt_route_is_formula_owned_without_wall_specific_source_truth",
        runtimeWideningEligibleNow: false,
        selectedNext: true
      }
    ]);
    expect(NEXT_SLICE_SELECTION_MATRIX.every((candidate) => candidate.runtimeWideningEligibleNow === false)).toBe(true);
    expect(NEXT_SLICE_SELECTION_MATRIX.every((candidate) => candidate.reason.length > 50)).toBe(true);
  });

  it("defines the first gate of the selected CLT wall slice before any runtime movement", () => {
    expect(SELECTED_CLT_WALL_GATE_A_CONTRACT).toEqual({
      firstGate: "gate_a_wall_specific_clt_source_and_laminated_leaf_tolerance_inventory",
      requiredEvidenceFields: [
        "source_label_url_page_table_row_or_local_path_and_retrieval_date",
        "wall_specific_clt_or_laminated_leaf_layer_order_thickness_density_or_surface_mass",
        "mounting_boundary_conditions_lining_decoupling_air_cavity_and_orientation_metadata",
        "reported_metric_rw_r_prime_w_dntw_dnta_spectrum_lab_or_field_context_and_tolerance",
        "local_material_mapping_confidence_and_floor_vs_wall_source_scope",
        "engine_value_test_and_web_route_card_test_requirements_before_any_visible_movement"
      ],
      requiredSourceFamilies: [
        "wall_specific_clt_or_mass_timber_single_leaf_rows_matching_the_live_preset_topology",
        "clt_wall_lined_or_decoupled_rows_that_must_stay_mounting_and_side_order_bounded",
        "documented_laminated_single_leaf_or_mass_timber_formula_references_with_explicit_tolerance",
        "dataholz_floor_clt_rows_as_floor_only_negative_boundaries",
        "exact_verified_airborne_and_lab_fallback_absence_as_current_runtime_boundaries"
      ],
      runtimeBehaviorChange: false,
      targetCurrentRoute: {
        confidence: "medium",
        fieldDnTwDb: 42,
        fieldRwPrimeDb: 41,
        generatedCaseId: "wall-clt-local",
        labRwDb: 42,
        strategy: "laminated_leaf_sharp_delegate"
      }
    });
  });

  it("keeps timber, CLT floor, blocked-source, route-card, and productization boundaries closed", () => {
    expect(ACTIVE_BOUNDARIES.disallowedMoves).toEqual([
      "change_timber_double_board_values_during_gate_c_closeout",
      "promote_single_board_resilient_secondary_or_steel_context_to_live_timber_double_board_truth",
      "borrow_dataholz_floor_clt_rows_as_wall_clt_truth",
      "change_support_confidence_evidence_text_or_route_card_copy_without_paired_tests",
      "reopen_GDMTXA04A_C11c_raw_bare_open_box_open_web_heavy_concrete_or_wall_selector_from_this_green_test",
      "resume_productization_before_the_selected_calculator_source_research_slice_closes_or_priority_changes"
    ]);
  });
});
