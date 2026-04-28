import { existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const POST_WALL_NO_STUD_DOUBLE_LEAF_SOURCE_RESEARCH_GATE_C_NEXT_SLICE_SELECTION = {
  closedImplementationSlice: "wall_no_stud_double_leaf_source_research_v1",
  latestLandedGate:
    "wall_no_stud_double_leaf_source_research_v1_gate_b_no_runtime_formula_tolerance_and_direct_row_feasibility",
  nextExecutionAction:
    "gate_a_inventory_direct_double_board_timber_stud_sources_and_tolerance_rules_no_runtime_change",
  numericRuntimeBehaviorChange: false,
  routeCardWorkRequiredNow: false,
  runtimeWidening: false,
  selectedImplementationSlice: "wall_timber_double_board_source_research_v1",
  selectedPlanningSurface: "docs/calculator/SLICE_WALL_TIMBER_DOUBLE_BOARD_SOURCE_RESEARCH_PLAN.md",
  selectedRouteFamily: "wall_timber_double_board_stud_source_and_tolerance_research",
  selectionStatus:
    "selected_no_runtime_after_no_stud_double_leaf_sources_remained_blocked_by_missing_direct_rows_and_tolerances",
  sliceId: "post_wall_no_stud_double_leaf_source_research_v1_next_slice_selection"
} as const;

const WALL_NO_STUD_DOUBLE_LEAF_CLOSEOUT = {
  closedBecause: [
    "gate_a_found_no_direct_import_ready_for_empty_or_porous_no_stud_routes",
    "gate_a_kept_gypsum_block_double_walls_as_direct_family_adjacent_material",
    "gate_b_rejected_davy_sharp_as_current_local_single_number_tolerance_owner",
    "gate_b_rejected_nrc_archive_import_without_extracted_no_stud_no_rail_row_proof",
    "web_route_card_work_is_not_required_because_no_visible_output_support_confidence_evidence_or_missing_input_copy_changed"
  ],
  executableProof: [
    "packages/engine/src/wall-no-stud-double-leaf-source-research-gate-a-contract.test.ts",
    "packages/engine/src/wall-no-stud-double-leaf-source-research-gate-b-contract.test.ts",
    "docs/calculator/CHECKPOINT_2026-04-28_WALL_NO_STUD_DOUBLE_LEAF_SOURCE_RESEARCH_GATE_B_HANDOFF.md",
    "docs/calculator/SLICE_WALL_NO_STUD_DOUBLE_LEAF_SOURCE_RESEARCH_PLAN.md"
  ],
  keptRuntimePosture: {
    emptyNoStudDoubleLeaf: {
      currentSourcePosture: "formula_owned_no_stack_source",
      fieldRwPrimeDb: 46,
      labRwDb: 48,
      routeStrategy: "double_leaf_empty_cavity_delegate",
      runtimeMovementAllowed: false
    },
    porousNoStudDoubleLeaf: {
      currentSourcePosture: "formula_owned_no_stack_source",
      fieldRwPrimeDb: 41,
      labRwDb: 43,
      routeStrategy: "double_leaf_porous_fill_corrected",
      runtimeMovementAllowed: false
    }
  },
  posture: "no_runtime_gate_a_inventory_plus_gate_b_feasibility_closed"
} as const;

const NEXT_SLICE_SELECTION_MATRIX = [
  {
    id: "wall_timber_double_board_source_research_v1",
    reason:
      "common_lightweight_wall_lane_still_formula_low_confidence_and_source_catalog_lists_it_next_after_no_stud_double_leaf",
    runtimeWideningEligibleNow: false,
    selectedNext: true
  },
  {
    id: "wall_no_stud_double_leaf_runtime_import_or_retune",
    reason:
      "gate_b_found_no_direct_row_no_local_single_number_tolerance_and_no_nrc_row_mapping_for_runtime_movement",
    runtimeWideningEligibleNow: false,
    selectedNext: false
  },
  {
    id: "wall_clt_wall_source_research_v1",
    reason:
      "still_valid_but_requires_wall_specific_clt_rows_or_laminated_leaf_tolerance_and_floor_clt_rows_must_not_be_borrowed",
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

const SELECTED_TIMBER_DOUBLE_BOARD_GATE_A_CONTRACT = {
  firstGate: "gate_a_timber_double_board_source_and_tolerance_inventory",
  requiredEvidenceFields: [
    "source_label_url_page_table_row_or_local_path_and_retrieval_date",
    "exact_board_count_board_material_thickness_density_or_surface_mass",
    "stud_material_stud_spacing_cavity_depth_fill_type_and_coupling_metadata",
    "resilient_bar_side_count_and_acoustic_board_topology_when_present",
    "reported_metric_rw_r_prime_w_dntw_dnta_spectrum_lab_or_field_context_and_tolerance",
    "engine_value_test_and_web_route_card_test_requirements_before_any_visible_movement"
  ],
  requiredSourceFamilies: [
    "direct_double_board_timber_stud_wall_rows_matching_the_live_preset_topology",
    "resilient_or_proprietary_timber_rows_that_must_stay_side_count_and_board_topology_bounded",
    "single_board_direct_timber_rows_as_negative_or_adjacent_boundaries",
    "steel_framed_linked_holdouts_as_non_timber_context_boundaries",
    "documented_timber_stud_formula_or_family_tolerance_references_if_direct_rows_remain_missing"
  ],
  runtimeBehaviorChange: false,
  targetCurrentRoute: {
    confidence: "low",
    fieldRwPrimeDb: 42,
    generatedCaseId: "wall-timber-stud",
    labRwDb: 50,
    strategy: "stud_surrogate_blend+framed_wall_calibration"
  }
} as const;

const ACTIVE_BOUNDARIES = {
  disallowedMoves: [
    "change_no_stud_double_leaf_values_during_gate_c_closeout",
    "reopen_timber_stud_runtime_widening_from_nearby_green_tests_alone",
    "promote_single_board_or_resilient_timber_exact_rows_to_double_board_without_exact_topology",
    "borrow_clt_floor_floor_impact_product_delta_or_report_rows_as_wall_source_truth",
    "change_support_confidence_evidence_text_or_route_card_copy_without_paired_tests",
    "resume_productization_before_the_selected_calculator_source_research_slice_closes_or_priority_changes"
  ]
} as const;

describe("post wall no-stud double-leaf source research next-slice selection contract", () => {
  it("closes the no-stud double-leaf source research slice no-runtime and selects timber double-board research", () => {
    expect(POST_WALL_NO_STUD_DOUBLE_LEAF_SOURCE_RESEARCH_GATE_C_NEXT_SLICE_SELECTION).toEqual({
      closedImplementationSlice: "wall_no_stud_double_leaf_source_research_v1",
      latestLandedGate:
        "wall_no_stud_double_leaf_source_research_v1_gate_b_no_runtime_formula_tolerance_and_direct_row_feasibility",
      nextExecutionAction:
        "gate_a_inventory_direct_double_board_timber_stud_sources_and_tolerance_rules_no_runtime_change",
      numericRuntimeBehaviorChange: false,
      routeCardWorkRequiredNow: false,
      runtimeWidening: false,
      selectedImplementationSlice: "wall_timber_double_board_source_research_v1",
      selectedPlanningSurface: "docs/calculator/SLICE_WALL_TIMBER_DOUBLE_BOARD_SOURCE_RESEARCH_PLAN.md",
      selectedRouteFamily: "wall_timber_double_board_stud_source_and_tolerance_research",
      selectionStatus:
        "selected_no_runtime_after_no_stud_double_leaf_sources_remained_blocked_by_missing_direct_rows_and_tolerances",
      sliceId: "post_wall_no_stud_double_leaf_source_research_v1_next_slice_selection"
    });

    for (const path of [
      POST_WALL_NO_STUD_DOUBLE_LEAF_SOURCE_RESEARCH_GATE_C_NEXT_SLICE_SELECTION.selectedPlanningSurface,
      "docs/calculator/CHECKPOINT_2026-04-28_WALL_NO_STUD_DOUBLE_LEAF_SOURCE_RESEARCH_GATE_C_CLOSEOUT_HANDOFF.md",
      "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
      "docs/calculator/CURRENT_STATE.md"
    ]) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("ties the closeout to Gate A inventory and Gate B feasibility without moving values", () => {
    expect(WALL_NO_STUD_DOUBLE_LEAF_CLOSEOUT.posture).toBe(
      "no_runtime_gate_a_inventory_plus_gate_b_feasibility_closed"
    );
    expect(WALL_NO_STUD_DOUBLE_LEAF_CLOSEOUT.keptRuntimePosture).toEqual({
      emptyNoStudDoubleLeaf: {
        currentSourcePosture: "formula_owned_no_stack_source",
        fieldRwPrimeDb: 46,
        labRwDb: 48,
        routeStrategy: "double_leaf_empty_cavity_delegate",
        runtimeMovementAllowed: false
      },
      porousNoStudDoubleLeaf: {
        currentSourcePosture: "formula_owned_no_stack_source",
        fieldRwPrimeDb: 41,
        labRwDb: 43,
        routeStrategy: "double_leaf_porous_fill_corrected",
        runtimeMovementAllowed: false
      }
    });

    for (const path of WALL_NO_STUD_DOUBLE_LEAF_CLOSEOUT.executableProof) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("selects timber double-board as the next highest-value source research slice", () => {
    expect(NEXT_SLICE_SELECTION_MATRIX.filter((candidate) => candidate.selectedNext)).toEqual([
      {
        id: "wall_timber_double_board_source_research_v1",
        reason:
          "common_lightweight_wall_lane_still_formula_low_confidence_and_source_catalog_lists_it_next_after_no_stud_double_leaf",
        runtimeWideningEligibleNow: false,
        selectedNext: true
      }
    ]);

    expect(NEXT_SLICE_SELECTION_MATRIX.every((candidate) => candidate.runtimeWideningEligibleNow === false)).toBe(true);
    expect(NEXT_SLICE_SELECTION_MATRIX.every((candidate) => candidate.reason.length > 40)).toBe(true);
  });

  it("defines the first gate of the selected timber double-board slice before any runtime movement", () => {
    expect(SELECTED_TIMBER_DOUBLE_BOARD_GATE_A_CONTRACT).toEqual({
      firstGate: "gate_a_timber_double_board_source_and_tolerance_inventory",
      requiredEvidenceFields: [
        "source_label_url_page_table_row_or_local_path_and_retrieval_date",
        "exact_board_count_board_material_thickness_density_or_surface_mass",
        "stud_material_stud_spacing_cavity_depth_fill_type_and_coupling_metadata",
        "resilient_bar_side_count_and_acoustic_board_topology_when_present",
        "reported_metric_rw_r_prime_w_dntw_dnta_spectrum_lab_or_field_context_and_tolerance",
        "engine_value_test_and_web_route_card_test_requirements_before_any_visible_movement"
      ],
      requiredSourceFamilies: [
        "direct_double_board_timber_stud_wall_rows_matching_the_live_preset_topology",
        "resilient_or_proprietary_timber_rows_that_must_stay_side_count_and_board_topology_bounded",
        "single_board_direct_timber_rows_as_negative_or_adjacent_boundaries",
        "steel_framed_linked_holdouts_as_non_timber_context_boundaries",
        "documented_timber_stud_formula_or_family_tolerance_references_if_direct_rows_remain_missing"
      ],
      runtimeBehaviorChange: false,
      targetCurrentRoute: {
        confidence: "low",
        fieldRwPrimeDb: 42,
        generatedCaseId: "wall-timber-stud",
        labRwDb: 50,
        strategy: "stud_surrogate_blend+framed_wall_calibration"
      }
    });
  });

  it("keeps no-stud, timber, adjacent-source, route-card, and productization boundaries closed", () => {
    expect(ACTIVE_BOUNDARIES.disallowedMoves).toEqual([
      "change_no_stud_double_leaf_values_during_gate_c_closeout",
      "reopen_timber_stud_runtime_widening_from_nearby_green_tests_alone",
      "promote_single_board_or_resilient_timber_exact_rows_to_double_board_without_exact_topology",
      "borrow_clt_floor_floor_impact_product_delta_or_report_rows_as_wall_source_truth",
      "change_support_confidence_evidence_text_or_route_card_copy_without_paired_tests",
      "resume_productization_before_the_selected_calculator_source_research_slice_closes_or_priority_changes"
    ]);
  });
});
