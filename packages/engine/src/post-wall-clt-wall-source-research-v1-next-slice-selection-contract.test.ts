import { existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const POST_WALL_CLT_WALL_SOURCE_RESEARCH_GATE_C_NEXT_SLICE_SELECTION = {
  closedImplementationSlice: "wall_clt_wall_source_research_v1",
  latestLandedGate:
    "wall_clt_wall_source_research_v1_gate_a_no_runtime_source_and_tolerance_inventory",
  nextExecutionAction:
    "gate_a_inventory_lined_massive_heavy_core_wall_sources_and_bounded_lining_rules_no_runtime_change",
  numericRuntimeBehaviorChange: false,
  routeCardWorkRequiredNow: false,
  runtimeWidening: false,
  selectedImplementationSlice: "wall_lined_massive_heavy_core_source_research_v1",
  selectedPlanningSurface:
    "docs/calculator/SLICE_WALL_LINED_MASSIVE_HEAVY_CORE_SOURCE_RESEARCH_PLAN.md",
  selectedRouteFamily: "wall_lined_massive_heavy_core_source_and_lining_rule_research",
  selectionStatus:
    "selected_no_runtime_after_clt_wall_sources_remained_floor_only_missing_or_unbounded",
  sliceId: "post_wall_clt_wall_source_research_v1_next_slice_selection"
} as const;

const WALL_CLT_WALL_CLOSEOUT = {
  closedBecause: [
    "gate_a_found_no_wall_specific_clt_or_mass_timber_source_row",
    "gate_a_kept_dataholz_clt_floor_rows_as_floor_only_source_truth",
    "gate_a_found_no_named_bounded_laminated_leaf_formula_tolerance_owner",
    "gate_a_kept_report_export_and_product_delta_context_as_non_source_context",
    "web_route_card_work_is_not_required_because_no_visible_output_support_confidence_evidence_or_missing_input_copy_changed"
  ],
  executableProof: [
    "packages/engine/src/wall-clt-wall-source-research-gate-a-contract.test.ts",
    "docs/calculator/CHECKPOINT_2026-04-28_WALL_CLT_WALL_SOURCE_RESEARCH_GATE_A_HANDOFF.md",
    "docs/calculator/SLICE_WALL_CLT_WALL_SOURCE_RESEARCH_PLAN.md"
  ],
  keptRuntimePosture: {
    cltWall: {
      confidence: "medium",
      currentSourcePosture: "formula_owned_no_wall_source_or_bounded_tolerance",
      fieldContextDnTwDb: 42,
      fieldRwPrimeDb: 41,
      generatedCaseId: "wall-clt-local",
      labRwDb: 42,
      routeStrategy: "laminated_leaf_sharp_delegate",
      runtimeMovementAllowed: false
    }
  },
  posture: "no_runtime_gate_a_inventory_closed_without_direct_import_or_formula_tolerance_gate"
} as const;

const NEXT_SLICE_SELECTION_MATRIX = [
  {
    id: "wall_lined_massive_heavy_core_source_research_v1",
    reason:
      "the_remaining_high_value_wall_source_catalog_gap_is_the_common_lined_massive_heavy_core_screening_lane_and_it_needs_new_source_rows_or_bounded_lining_rules_before_runtime_tightening",
    runtimeWideningEligibleNow: false,
    selectedNext: true
  },
  {
    id: "wall_clt_wall_runtime_import_or_retune",
    reason:
      "gate_a_found_only_floor_clt_source_truth_missing_wall_specific_rows_and_no_bounded_laminated_leaf_tolerance_owner",
    runtimeWideningEligibleNow: false,
    selectedNext: false
  },
  {
    id: "wall_timber_double_board_runtime_import_or_retune",
    reason:
      "timber_double_board_gate_a_found_adjacent_or_secondary_rows_only_and_no_bounded_formula_tolerance_owner",
    runtimeWideningEligibleNow: false,
    selectedNext: false
  },
  {
    id: "wall_no_stud_double_leaf_runtime_import_or_retune",
    reason:
      "no_stud_double_leaf_gate_b_found_no_direct_row_no_local_single_number_tolerance_and_no_nrc_row_mapping_for_runtime_movement",
    runtimeWideningEligibleNow: false,
    selectedNext: false
  },
  {
    id: "floor_fallback_source_tolerance_research_v1",
    reason:
      "floor_fallback_is_still_low_confidence_but_the_active_wall_source_catalog_chain_should_finish_the_remaining_wall_gap_first",
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

const SELECTED_LINED_MASSIVE_HEAVY_CORE_GATE_A_CONTRACT = {
  firstGate: "gate_a_lined_massive_heavy_core_source_and_lining_rule_inventory",
  requiredEvidenceFields: [
    "source_label_url_page_table_row_or_local_path_and_retrieval_date",
    "base_wall_material_thickness_density_or_surface_mass_and_lining_board_makeup",
    "cavity_depth_absorber_mounting_rail_or_frame_coupling_side_order_and_boundary_metadata",
    "reported_metric_rw_r_prime_w_dntw_dnta_spectrum_lab_or_field_context_and_tolerance",
    "local_generated_case_or_workbench_preset_mapping_and_exact_family_formula_screening_precedence",
    "engine_value_test_and_web_route_card_test_requirements_before_any_visible_movement"
  ],
  requiredSourceFamilies: [
    "wall_specific_lined_concrete_or_heavy_masonry_rows_matching_wall_screening_concrete_or_concrete_wall",
    "manufacturer_wall_lining_rows_that_must_stay_mounting_and_side_order_bounded",
    "documented_lined_massive_wall_or_heavy_core_formula_references_with_explicit_tolerance",
    "selector_deep_hybrid_and_value_pin_rows_as_stability_evidence_not_runtime_retune_truth",
    "prior_heavy_core_gate_b_audit_as_the_current_frozen_screening_baseline"
  ],
  runtimeBehaviorChange: false,
  targetCurrentRoute: {
    confidence: "medium",
    dynamicFamily: "lined_massive_wall",
    evidenceTier: "screening",
    fieldRwPrimeDb: 55,
    generatedCaseId: "wall-screening-concrete",
    labRwDb: 57,
    strategy: "lined_massive_blend",
    supportedFieldOutputs: ["R'w", "Dn,w", "DnT,w", "DnT,A"]
  }
} as const;

const ACTIVE_BOUNDARIES = {
  disallowedMoves: [
    "change_clt_wall_values_during_gate_c_closeout",
    "borrow_dataholz_floor_clt_rows_as_wall_clt_truth",
    "promote_lined_massive_heavy_core_screening_without_new_source_or_bounded_lining_rule",
    "reopen_prior_heavy_core_concrete_gate_b_runtime_tightening_from_nearby_green_tests_alone",
    "change_support_confidence_evidence_text_or_route_card_copy_without_paired_tests",
    "resume_productization_before_the_selected_calculator_source_research_slice_closes_or_priority_changes"
  ]
} as const;

describe("post wall CLT wall source research next-slice selection contract", () => {
  it("closes the CLT wall source research slice no-runtime and selects lined massive/heavy-core research", () => {
    expect(POST_WALL_CLT_WALL_SOURCE_RESEARCH_GATE_C_NEXT_SLICE_SELECTION).toEqual({
      closedImplementationSlice: "wall_clt_wall_source_research_v1",
      latestLandedGate:
        "wall_clt_wall_source_research_v1_gate_a_no_runtime_source_and_tolerance_inventory",
      nextExecutionAction:
        "gate_a_inventory_lined_massive_heavy_core_wall_sources_and_bounded_lining_rules_no_runtime_change",
      numericRuntimeBehaviorChange: false,
      routeCardWorkRequiredNow: false,
      runtimeWidening: false,
      selectedImplementationSlice: "wall_lined_massive_heavy_core_source_research_v1",
      selectedPlanningSurface:
        "docs/calculator/SLICE_WALL_LINED_MASSIVE_HEAVY_CORE_SOURCE_RESEARCH_PLAN.md",
      selectedRouteFamily: "wall_lined_massive_heavy_core_source_and_lining_rule_research",
      selectionStatus:
        "selected_no_runtime_after_clt_wall_sources_remained_floor_only_missing_or_unbounded",
      sliceId: "post_wall_clt_wall_source_research_v1_next_slice_selection"
    });

    for (const path of [
      POST_WALL_CLT_WALL_SOURCE_RESEARCH_GATE_C_NEXT_SLICE_SELECTION.selectedPlanningSurface,
      "docs/calculator/CHECKPOINT_2026-04-28_WALL_CLT_WALL_SOURCE_RESEARCH_GATE_C_CLOSEOUT_HANDOFF.md",
      "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
      "docs/calculator/CURRENT_STATE.md"
    ]) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("ties the closeout to CLT Gate A blockers without moving the live CLT route", () => {
    expect(WALL_CLT_WALL_CLOSEOUT.posture).toBe(
      "no_runtime_gate_a_inventory_closed_without_direct_import_or_formula_tolerance_gate"
    );
    expect(WALL_CLT_WALL_CLOSEOUT.keptRuntimePosture).toEqual({
      cltWall: {
        confidence: "medium",
        currentSourcePosture: "formula_owned_no_wall_source_or_bounded_tolerance",
        fieldContextDnTwDb: 42,
        fieldRwPrimeDb: 41,
        generatedCaseId: "wall-clt-local",
        labRwDb: 42,
        routeStrategy: "laminated_leaf_sharp_delegate",
        runtimeMovementAllowed: false
      }
    });

    for (const path of WALL_CLT_WALL_CLOSEOUT.executableProof) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("selects lined massive/heavy-core as the next highest-value wall source research slice", () => {
    expect(NEXT_SLICE_SELECTION_MATRIX.filter((candidate) => candidate.selectedNext)).toEqual([
      {
        id: "wall_lined_massive_heavy_core_source_research_v1",
        reason:
          "the_remaining_high_value_wall_source_catalog_gap_is_the_common_lined_massive_heavy_core_screening_lane_and_it_needs_new_source_rows_or_bounded_lining_rules_before_runtime_tightening",
        runtimeWideningEligibleNow: false,
        selectedNext: true
      }
    ]);
    expect(NEXT_SLICE_SELECTION_MATRIX.every((candidate) => candidate.runtimeWideningEligibleNow === false)).toBe(true);
    expect(NEXT_SLICE_SELECTION_MATRIX.every((candidate) => candidate.reason.length > 50)).toBe(true);
  });

  it("defines the first gate of the selected source-research slice before any runtime movement", () => {
    expect(SELECTED_LINED_MASSIVE_HEAVY_CORE_GATE_A_CONTRACT).toEqual({
      firstGate: "gate_a_lined_massive_heavy_core_source_and_lining_rule_inventory",
      requiredEvidenceFields: [
        "source_label_url_page_table_row_or_local_path_and_retrieval_date",
        "base_wall_material_thickness_density_or_surface_mass_and_lining_board_makeup",
        "cavity_depth_absorber_mounting_rail_or_frame_coupling_side_order_and_boundary_metadata",
        "reported_metric_rw_r_prime_w_dntw_dnta_spectrum_lab_or_field_context_and_tolerance",
        "local_generated_case_or_workbench_preset_mapping_and_exact_family_formula_screening_precedence",
        "engine_value_test_and_web_route_card_test_requirements_before_any_visible_movement"
      ],
      requiredSourceFamilies: [
        "wall_specific_lined_concrete_or_heavy_masonry_rows_matching_wall_screening_concrete_or_concrete_wall",
        "manufacturer_wall_lining_rows_that_must_stay_mounting_and_side_order_bounded",
        "documented_lined_massive_wall_or_heavy_core_formula_references_with_explicit_tolerance",
        "selector_deep_hybrid_and_value_pin_rows_as_stability_evidence_not_runtime_retune_truth",
        "prior_heavy_core_gate_b_audit_as_the_current_frozen_screening_baseline"
      ],
      runtimeBehaviorChange: false,
      targetCurrentRoute: {
        confidence: "medium",
        dynamicFamily: "lined_massive_wall",
        evidenceTier: "screening",
        fieldRwPrimeDb: 55,
        generatedCaseId: "wall-screening-concrete",
        labRwDb: 57,
        strategy: "lined_massive_blend",
        supportedFieldOutputs: ["R'w", "Dn,w", "DnT,w", "DnT,A"]
      }
    });
  });

  it("keeps CLT, heavy-core, route-card, and productization boundaries closed", () => {
    expect(ACTIVE_BOUNDARIES.disallowedMoves).toEqual([
      "change_clt_wall_values_during_gate_c_closeout",
      "borrow_dataholz_floor_clt_rows_as_wall_clt_truth",
      "promote_lined_massive_heavy_core_screening_without_new_source_or_bounded_lining_rule",
      "reopen_prior_heavy_core_concrete_gate_b_runtime_tightening_from_nearby_green_tests_alone",
      "change_support_confidence_evidence_text_or_route_card_copy_without_paired_tests",
      "resume_productization_before_the_selected_calculator_source_research_slice_closes_or_priority_changes"
    ]);
  });
});
