import { existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const POST_WALL_SOURCE_CATALOG_GATE_C_NEXT_SLICE_SELECTION = {
  sliceId: "post_wall_source_catalog_acquisition_v1_next_slice_selection",
  closedImplementationSlice: "wall_source_catalog_acquisition_v1",
  latestLandedGate:
    "wall_source_catalog_acquisition_v1_gate_b_no_runtime_source_pack_readiness_closeout",
  selectedImplementationSlice: "wall_no_stud_double_leaf_source_research_v1",
  selectedPlanningSurface: "docs/calculator/SLICE_WALL_NO_STUD_DOUBLE_LEAF_SOURCE_RESEARCH_PLAN.md",
  selectedRouteFamily: "wall_no_stud_empty_and_porous_double_leaf_direct_source_acquisition",
  selectionStatus:
    "selected_no_runtime_after_source_catalog_found_no_runtime_import_pack_ready",
  numericRuntimeBehaviorChange: false,
  runtimeWidening: false,
  routeCardWorkRequiredNow: false,
  nextExecutionAction:
    "gate_a_research_direct_no_stud_empty_and_porous_double_leaf_sources_no_runtime_change"
} as const;

const WALL_SOURCE_CATALOG_CLOSEOUT = {
  posture: "no_runtime_gate_a_inventory_plus_gate_b_source_pack_readiness_closed",
  closedBecause: [
    "manufacturer_framed_rows_already_fit_current_w111_w112_w115_w119_behavior",
    "no_stud_empty_and_porous_double_leaf_pack_lacks_direct_rows_or_formula_tolerance_owner",
    "timber_double_board_stud_pack_lacks_live_topology_match",
    "clt_wall_pack_lacks_wall_specific_source_rows",
    "lined_massive_heavy_core_concrete_pack_lacks_bounded_lining_rule",
    "floor_impact_and_product_delta_rows_are_rejected_as_wall_source_truth"
  ],
  noRuntimeImportReadyNow: false,
  keptRuntimePosture:
    "freeze_values_confidence_support_evidence_and_visible_copy_until_a_complete_direct_row_pack_exists",
  executableProof: [
    "packages/engine/src/wall-source-catalog-acquisition-gate-a-contract.test.ts",
    "packages/engine/src/wall-source-catalog-acquisition-gate-b-contract.test.ts",
    "docs/calculator/CHECKPOINT_2026-04-28_WALL_SOURCE_CATALOG_ACQUISITION_GATE_B_HANDOFF.md",
    "docs/calculator/SLICE_WALL_SOURCE_CATALOG_ACQUISITION_PLAN.md"
  ]
} as const;

const NEXT_SLICE_SELECTION_MATRIX = [
  {
    id: "wall_no_stud_double_leaf_source_research_v1",
    selectedNext: true,
    runtimeWideningEligibleNow: false,
    reason:
      "no_stud_empty_and_porous_double_leaf_is_a_common_user_stack_and_is_blocked_only_by_missing_direct_rows_or_formula_tolerance"
  },
  {
    id: "manufacturer_framed_adjacent_row_import",
    selectedNext: false,
    runtimeWideningEligibleNow: false,
    reason:
      "w111_w112_w115_w119_rows_already_fit_current_behavior_and_adjacent_rows_need_their_own_complete_source_pack"
  },
  {
    id: "timber_double_board_stud_source_research",
    selectedNext: false,
    runtimeWideningEligibleNow: false,
    reason:
      "still_blocked_but_lower_immediate_roi_than_generic_no_stud_double_leaf_because_direct_timber_exact_rows_and_resilient_rows_already_cover_narrower_lanes"
  },
  {
    id: "clt_wall_source_research",
    selectedNext: false,
    runtimeWideningEligibleNow: false,
    reason:
      "still_blocked_but_requires_wall_specific_clt_rows_and_must_not_borrow_floor_clt_source_truth"
  },
  {
    id: "lined_massive_heavy_core_runtime_tightening",
    selectedNext: false,
    runtimeWideningEligibleNow: false,
    reason:
      "heavy_core_concrete_and_lined_massive_remain_screening_until_a_bounded_lining_rule_or_direct_source_row_exists"
  },
  {
    id: "productization_or_route_card_only_work",
    selectedNext: false,
    runtimeWideningEligibleNow: false,
    reason:
      "the_user_priority_is_calculator_scope_and_accuracy_and_no_visible_support_confidence_or_evidence_copy_changed"
  }
] as const;

const SELECTED_NO_STUD_DOUBLE_LEAF_GATE_A_CONTRACT = {
  firstGate: "gate_a_direct_no_stud_double_leaf_source_research_and_tolerance_inventory",
  runtimeBehaviorChange: false,
  requiredSourceFamilies: [
    "empty_no_stud_double_leaf_wall_rows",
    "porous_or_absorber_filled_no_stud_double_leaf_wall_rows",
    "named_sharp_davy_or_mass_air_mass_formula_tolerance_references_for_no_stud_double_leaf_routes"
  ],
  requiredEvidenceFields: [
    "source_label_url_page_table_row_or_local_path_and_retrieval_date",
    "exact_layer_order_thickness_material_density_or_surface_mass",
    "explicit_no_stud_no_rail_no_mechanical_coupling_boundary",
    "cavity_depth_air_gap_and_fill_or_absorber_metadata",
    "reported_metric_rw_r_prime_w_dntw_dnta_spectrum_lab_or_field_context_and_tolerance",
    "engine_value_test_and_web_route_card_test_requirements_before_any_visible_movement"
  ],
  gateAExitOptions: [
    "select_direct_import_slice_only_if_direct_rows_tolerance_and_negative_boundaries_are_complete",
    "select_formula_tolerance_slice_only_if_named_no_stud_double_leaf_formula_owner_is_complete",
    "close_no_runtime_if_sources_are_adjacent_framed_triple_leaf_floor_or_product_delta_context_only"
  ]
} as const;

const ACTIVE_BOUNDARIES = {
  disallowedMoves: [
    "change_runtime_values_confidence_support_evidence_or_route_card_copy_during_gate_c_closeout",
    "promote_no_stud_double_leaf_from_w111_w112_w115_w119_framed_rows",
    "borrow_floor_clt_floor_impact_product_delta_or_report_rows_as_wall_source_truth",
    "reopen_GDMTXA04A_C11c_raw_open_box_open_web_wall_selector_heavy_concrete_timber_or_clt_from_nearby_green_tests",
    "start_productization_before_the_selected_calculator_source_research_slice_closes_or_priority_changes"
  ]
} as const;

describe("post wall source catalog acquisition next-slice selection contract", () => {
  it("closes the wall source catalog slice no-runtime and selects no-stud double-leaf source research", () => {
    expect(POST_WALL_SOURCE_CATALOG_GATE_C_NEXT_SLICE_SELECTION).toEqual({
      sliceId: "post_wall_source_catalog_acquisition_v1_next_slice_selection",
      closedImplementationSlice: "wall_source_catalog_acquisition_v1",
      latestLandedGate:
        "wall_source_catalog_acquisition_v1_gate_b_no_runtime_source_pack_readiness_closeout",
      selectedImplementationSlice: "wall_no_stud_double_leaf_source_research_v1",
      selectedPlanningSurface:
        "docs/calculator/SLICE_WALL_NO_STUD_DOUBLE_LEAF_SOURCE_RESEARCH_PLAN.md",
      selectedRouteFamily: "wall_no_stud_empty_and_porous_double_leaf_direct_source_acquisition",
      selectionStatus:
        "selected_no_runtime_after_source_catalog_found_no_runtime_import_pack_ready",
      numericRuntimeBehaviorChange: false,
      runtimeWidening: false,
      routeCardWorkRequiredNow: false,
      nextExecutionAction:
        "gate_a_research_direct_no_stud_empty_and_porous_double_leaf_sources_no_runtime_change"
    });

    for (const path of [
      POST_WALL_SOURCE_CATALOG_GATE_C_NEXT_SLICE_SELECTION.selectedPlanningSurface,
      "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
      "docs/calculator/CURRENT_STATE.md",
      "docs/calculator/SLICE_WALL_SOURCE_CATALOG_ACQUISITION_PLAN.md"
    ]) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("ties the closeout to Gate A inventory and Gate B readiness without importing values", () => {
    expect(WALL_SOURCE_CATALOG_CLOSEOUT).toEqual({
      posture: "no_runtime_gate_a_inventory_plus_gate_b_source_pack_readiness_closed",
      closedBecause: [
        "manufacturer_framed_rows_already_fit_current_w111_w112_w115_w119_behavior",
        "no_stud_empty_and_porous_double_leaf_pack_lacks_direct_rows_or_formula_tolerance_owner",
        "timber_double_board_stud_pack_lacks_live_topology_match",
        "clt_wall_pack_lacks_wall_specific_source_rows",
        "lined_massive_heavy_core_concrete_pack_lacks_bounded_lining_rule",
        "floor_impact_and_product_delta_rows_are_rejected_as_wall_source_truth"
      ],
      noRuntimeImportReadyNow: false,
      keptRuntimePosture:
        "freeze_values_confidence_support_evidence_and_visible_copy_until_a_complete_direct_row_pack_exists",
      executableProof: [
        "packages/engine/src/wall-source-catalog-acquisition-gate-a-contract.test.ts",
        "packages/engine/src/wall-source-catalog-acquisition-gate-b-contract.test.ts",
        "docs/calculator/CHECKPOINT_2026-04-28_WALL_SOURCE_CATALOG_ACQUISITION_GATE_B_HANDOFF.md",
        "docs/calculator/SLICE_WALL_SOURCE_CATALOG_ACQUISITION_PLAN.md"
      ]
    });

    for (const path of WALL_SOURCE_CATALOG_CLOSEOUT.executableProof) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("selects no-stud double-leaf source research as the highest-value next accuracy move", () => {
    expect(NEXT_SLICE_SELECTION_MATRIX.filter((candidate) => candidate.selectedNext)).toEqual([
      {
        id: "wall_no_stud_double_leaf_source_research_v1",
        selectedNext: true,
        runtimeWideningEligibleNow: false,
        reason:
          "no_stud_empty_and_porous_double_leaf_is_a_common_user_stack_and_is_blocked_only_by_missing_direct_rows_or_formula_tolerance"
      }
    ]);

    for (const candidate of NEXT_SLICE_SELECTION_MATRIX) {
      if (candidate.selectedNext) {
        expect(candidate.runtimeWideningEligibleNow).toBe(false);
        expect(candidate.reason).toContain("no_stud");
      } else {
        expect(candidate.reason.length).toBeGreaterThan(20);
      }
    }
  });

  it("defines the first gate of the selected research slice before any runtime movement", () => {
    expect(SELECTED_NO_STUD_DOUBLE_LEAF_GATE_A_CONTRACT).toEqual({
      firstGate: "gate_a_direct_no_stud_double_leaf_source_research_and_tolerance_inventory",
      runtimeBehaviorChange: false,
      requiredSourceFamilies: [
        "empty_no_stud_double_leaf_wall_rows",
        "porous_or_absorber_filled_no_stud_double_leaf_wall_rows",
        "named_sharp_davy_or_mass_air_mass_formula_tolerance_references_for_no_stud_double_leaf_routes"
      ],
      requiredEvidenceFields: [
        "source_label_url_page_table_row_or_local_path_and_retrieval_date",
        "exact_layer_order_thickness_material_density_or_surface_mass",
        "explicit_no_stud_no_rail_no_mechanical_coupling_boundary",
        "cavity_depth_air_gap_and_fill_or_absorber_metadata",
        "reported_metric_rw_r_prime_w_dntw_dnta_spectrum_lab_or_field_context_and_tolerance",
        "engine_value_test_and_web_route_card_test_requirements_before_any_visible_movement"
      ],
      gateAExitOptions: [
        "select_direct_import_slice_only_if_direct_rows_tolerance_and_negative_boundaries_are_complete",
        "select_formula_tolerance_slice_only_if_named_no_stud_double_leaf_formula_owner_is_complete",
        "close_no_runtime_if_sources_are_adjacent_framed_triple_leaf_floor_or_product_delta_context_only"
      ]
    });
  });

  it("keeps active blocked-family and productization boundaries fail-closed", () => {
    expect(ACTIVE_BOUNDARIES.disallowedMoves).toEqual([
      "change_runtime_values_confidence_support_evidence_or_route_card_copy_during_gate_c_closeout",
      "promote_no_stud_double_leaf_from_w111_w112_w115_w119_framed_rows",
      "borrow_floor_clt_floor_impact_product_delta_or_report_rows_as_wall_source_truth",
      "reopen_GDMTXA04A_C11c_raw_open_box_open_web_wall_selector_heavy_concrete_timber_or_clt_from_nearby_green_tests",
      "start_productization_before_the_selected_calculator_source_research_slice_closes_or_priority_changes"
    ]);

    expect(POST_WALL_SOURCE_CATALOG_GATE_C_NEXT_SLICE_SELECTION.numericRuntimeBehaviorChange).toBe(false);
    expect(POST_WALL_SOURCE_CATALOG_GATE_C_NEXT_SLICE_SELECTION.routeCardWorkRequiredNow).toBe(false);
  });
});
