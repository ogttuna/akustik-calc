import { existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const POST_WALL_DOUBLE_LEAF_SOURCE_EVIDENCE_GATE_C_NEXT_SLICE_SELECTION = {
  sliceId: "post_wall_double_leaf_source_evidence_acquisition_v1_next_slice_selection",
  closedImplementationSlice: "wall_double_leaf_source_evidence_acquisition_v1",
  latestLandedGate:
    "wall_double_leaf_source_evidence_acquisition_v1_gate_b_no_runtime_bounded_framed_wall_reconciliation",
  selectedImplementationSlice: "wall_source_catalog_acquisition_v1",
  selectedPlanningSurface: "docs/calculator/SLICE_WALL_SOURCE_CATALOG_ACQUISITION_PLAN.md",
  selectedRouteFamily: "wall_source_catalog_for_blocked_common_wall_families",
  selectionStatus:
    "selected_after_common_wall_runtime_moves_blocked_by_missing_direct_source_rows_or_tolerance_owners",
  numericRuntimeBehaviorChange: false,
  runtimeWidening: false,
  routeCardWorkRequiredNow: false,
  nextExecutionAction:
    "gate_a_inventory_wall_source_catalog_targets_and_import_acceptance_rules_no_runtime_change"
} as const;

const WALL_DOUBLE_LEAF_SOURCE_EVIDENCE_CLOSEOUT = {
  posture: "no_runtime_gate_a_inventory_plus_gate_b_bounded_reconciliation_closed",
  closedBecause: [
    "gate_a_rejected_generic_empty_and_no_stud_double_leaf_runtime_movement_without_direct_source_or_formula_tolerance",
    "gate_a_classified_knauf_w111_w115_quietstud_davy_and_stud_type_sources_without_importing_runtime_values",
    "gate_b_proved_bounded_w111_w112_w115_w119_rows_already_fit_current_lab_and_field_behavior",
    "w112_field_rows_already_use_exact_verified_field_proxy_anchor_precedence",
    "web_route_card_work_is_not_required_because_no_visible_output_support_confidence_evidence_or_missing_input_copy_changed"
  ],
  keptRuntimePosture: {
    doubleStudSplitCavity: {
      confidence: "medium",
      detectedFamily: "double_stud_system",
      evidenceTier: "formula",
      sourceFit: "knauf_w115_w119_current_values_match_bounded_rows",
      strategy: "double_stud_surrogate_blend+double_stud_calibration"
    },
    noStudDoubleLeaf: {
      confidence: "formula_owned_current_behavior",
      importStatus: "source_blocked",
      runtimeMovementAllowed: false,
      requiredUnlock: "direct_no_stud_stack_row_or_named_formula_tolerance_owner"
    },
    singleStudFramedWall: {
      confidence: "low",
      detectedFamily: "stud_wall_system",
      evidenceTier: "formula",
      sourceFit: "knauf_w111_w112_rows_fit_current_tolerances",
      strategy: "stud_surrogate_blend+framed_wall_calibration"
    },
    w112FieldRows: {
      basis: "exact_verified_field_proxy_anchor",
      metric: "DnT,A,k_through_local_DnT,A_proxy_lane",
      runtimeMovementAllowed: false,
      sourceFit: "exact_match"
    }
  },
  executableProof: [
    "packages/engine/src/wall-double-leaf-source-evidence-acquisition-gate-a-contract.test.ts",
    "packages/engine/src/wall-double-leaf-source-evidence-acquisition-gate-b-contract.test.ts",
    "docs/calculator/CHECKPOINT_2026-04-28_WALL_DOUBLE_LEAF_SOURCE_EVIDENCE_GATE_B_HANDOFF.md"
  ]
} as const;

const NEXT_SLICE_SELECTION_MATRIX = [
  {
    id: "wall_source_catalog_acquisition_v1",
    selectedNext: true,
    runtimeWideningEligibleNow: false,
    reason:
      "the last wall accuracy slices repeatedly blocked runtime movement on missing direct source rows or tolerance owners"
  },
  {
    id: "direct_double_leaf_or_stud_runtime_retune",
    selectedNext: false,
    runtimeWideningEligibleNow: false,
    reason:
      "gate_b_found_bounded_framed_rows_already_fit_and_generic_no_stud_double_leaf_rows_still_lack_direct_evidence"
  },
  {
    id: "wall_clt_or_timber_stud_runtime_tightening",
    selectedNext: false,
    runtimeWideningEligibleNow: false,
    reason:
      "prior_clt_and_timber_gate_b_contracts_blocked_runtime_tightening_until_wall_specific_sources_or_bounded_rules_exist"
  },
  {
    id: "blocked_floor_source_reopens",
    selectedNext: false,
    runtimeWideningEligibleNow: false,
    reason:
      "gdmtxa04a_c11c_and_raw_bare_open_box_open_web_remain_fail_closed_without_new_source_evidence"
  },
  {
    id: "productization_or_optional_architecture",
    selectedNext: false,
    runtimeWideningEligibleNow: false,
    reason:
      "the_user_priority_is_calculator_scope_and_accuracy; productization_is_deferred_and_c6_architecture_is_already_closed"
  }
] as const;

const SELECTED_WALL_SOURCE_CATALOG_GATE_A_CONTRACT = {
  firstGate: "gate_a_wall_source_catalog_target_inventory_and_import_acceptance_rules",
  runtimeBehaviorChange: false,
  requiredTargetFamilies: [
    "manufacturer_wall_system_rows_for_w111_w112_w115_w119_and_adjacent_framed_systems",
    "direct_no_stud_double_leaf_or_formula_tolerance_sources",
    "timber_double_board_and_clt_wall_specific_rows",
    "lined_massive_and_heavy_core_concrete_rows",
    "source_schema_import_readiness_with_exact_lab_fallback_bound_family_formula_and_negative_boundaries"
  ],
  requiredSourceFields: [
    "source_label_url_page_or_local_path",
    "assembly_layers_materials_thickness_density_or_surface_mass_and_mounting",
    "reported_metric_spectrum_lab_or_field_context_and_tolerance",
    "cavity_depth_fill_type_stud_type_stud_spacing_coupling_and_side_count_when_relevant",
    "import_decision_accept_bounded_reject_or_needs_research",
    "paired_engine_value_and_web_route_card_tests_required_before_visible_runtime_movement"
  ],
  allowedAfterGateA:
    "select_a_bounded_source_import_slice_only_if_rows_are_direct_and_negative_boundaries_are_pinned; otherwise_close_no_runtime"
} as const;

const ACTIVE_BOUNDARIES = {
  disallowedMoves: [
    "change_wall_double_leaf_or_stud_runtime_values_during_gate_c_closeout",
    "promote_no_stud_double_leaf_or_porous_double_leaf_from_adjacent_framed_rows",
    "borrow_floor_clt_floor_impact_or_product_delta_rows_as_wall_source_truth",
    "reopen_GDMTXA04A_C11c_raw_bare_open_box_open_web_wall_selector_heavy_concrete_timber_or_clt_from_nearby_green_tests",
    "change_support_confidence_evidence_text_or_route_card_copy_without_paired_tests",
    "resume_productization_before_the_selected_calculator_source_catalog_slice_closes_or_priority_changes"
  ]
} as const;

describe("post wall double-leaf source evidence acquisition next-slice selection contract", () => {
  it("closes the source-evidence slice no-runtime and selects wall source catalog acquisition", () => {
    expect(POST_WALL_DOUBLE_LEAF_SOURCE_EVIDENCE_GATE_C_NEXT_SLICE_SELECTION).toEqual({
      sliceId: "post_wall_double_leaf_source_evidence_acquisition_v1_next_slice_selection",
      closedImplementationSlice: "wall_double_leaf_source_evidence_acquisition_v1",
      latestLandedGate:
        "wall_double_leaf_source_evidence_acquisition_v1_gate_b_no_runtime_bounded_framed_wall_reconciliation",
      selectedImplementationSlice: "wall_source_catalog_acquisition_v1",
      selectedPlanningSurface: "docs/calculator/SLICE_WALL_SOURCE_CATALOG_ACQUISITION_PLAN.md",
      selectedRouteFamily: "wall_source_catalog_for_blocked_common_wall_families",
      selectionStatus:
        "selected_after_common_wall_runtime_moves_blocked_by_missing_direct_source_rows_or_tolerance_owners",
      numericRuntimeBehaviorChange: false,
      runtimeWidening: false,
      routeCardWorkRequiredNow: false,
      nextExecutionAction:
        "gate_a_inventory_wall_source_catalog_targets_and_import_acceptance_rules_no_runtime_change"
    });

    for (const path of [
      POST_WALL_DOUBLE_LEAF_SOURCE_EVIDENCE_GATE_C_NEXT_SLICE_SELECTION.selectedPlanningSurface,
      "docs/calculator/CHECKPOINT_2026-04-28_WALL_DOUBLE_LEAF_SOURCE_EVIDENCE_GATE_B_HANDOFF.md",
      "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
      "docs/calculator/CURRENT_STATE.md"
    ]) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("ties the closeout to Gate A inventory and Gate B reconciliation without runtime movement", () => {
    expect(WALL_DOUBLE_LEAF_SOURCE_EVIDENCE_CLOSEOUT.posture).toBe(
      "no_runtime_gate_a_inventory_plus_gate_b_bounded_reconciliation_closed"
    );
    expect(WALL_DOUBLE_LEAF_SOURCE_EVIDENCE_CLOSEOUT.closedBecause).toEqual([
      "gate_a_rejected_generic_empty_and_no_stud_double_leaf_runtime_movement_without_direct_source_or_formula_tolerance",
      "gate_a_classified_knauf_w111_w115_quietstud_davy_and_stud_type_sources_without_importing_runtime_values",
      "gate_b_proved_bounded_w111_w112_w115_w119_rows_already_fit_current_lab_and_field_behavior",
      "w112_field_rows_already_use_exact_verified_field_proxy_anchor_precedence",
      "web_route_card_work_is_not_required_because_no_visible_output_support_confidence_evidence_or_missing_input_copy_changed"
    ]);
    expect(WALL_DOUBLE_LEAF_SOURCE_EVIDENCE_CLOSEOUT.keptRuntimePosture).toEqual({
      doubleStudSplitCavity: {
        confidence: "medium",
        detectedFamily: "double_stud_system",
        evidenceTier: "formula",
        sourceFit: "knauf_w115_w119_current_values_match_bounded_rows",
        strategy: "double_stud_surrogate_blend+double_stud_calibration"
      },
      noStudDoubleLeaf: {
        confidence: "formula_owned_current_behavior",
        importStatus: "source_blocked",
        runtimeMovementAllowed: false,
        requiredUnlock: "direct_no_stud_stack_row_or_named_formula_tolerance_owner"
      },
      singleStudFramedWall: {
        confidence: "low",
        detectedFamily: "stud_wall_system",
        evidenceTier: "formula",
        sourceFit: "knauf_w111_w112_rows_fit_current_tolerances",
        strategy: "stud_surrogate_blend+framed_wall_calibration"
      },
      w112FieldRows: {
        basis: "exact_verified_field_proxy_anchor",
        metric: "DnT,A,k_through_local_DnT,A_proxy_lane",
        runtimeMovementAllowed: false,
        sourceFit: "exact_match"
      }
    });

    for (const path of WALL_DOUBLE_LEAF_SOURCE_EVIDENCE_CLOSEOUT.executableProof) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("selects source catalog acquisition because source gaps now block the remaining wall accuracy moves", () => {
    expect(NEXT_SLICE_SELECTION_MATRIX.filter((candidate) => candidate.selectedNext)).toEqual([
      {
        id: "wall_source_catalog_acquisition_v1",
        selectedNext: true,
        runtimeWideningEligibleNow: false,
        reason:
          "the last wall accuracy slices repeatedly blocked runtime movement on missing direct source rows or tolerance owners"
      }
    ]);
    expect(NEXT_SLICE_SELECTION_MATRIX.every((candidate) => candidate.runtimeWideningEligibleNow === false)).toBe(true);
  });

  it("locks the no-runtime Gate A acceptance contract for wall source catalog acquisition", () => {
    expect(SELECTED_WALL_SOURCE_CATALOG_GATE_A_CONTRACT).toEqual({
      firstGate: "gate_a_wall_source_catalog_target_inventory_and_import_acceptance_rules",
      runtimeBehaviorChange: false,
      requiredTargetFamilies: [
        "manufacturer_wall_system_rows_for_w111_w112_w115_w119_and_adjacent_framed_systems",
        "direct_no_stud_double_leaf_or_formula_tolerance_sources",
        "timber_double_board_and_clt_wall_specific_rows",
        "lined_massive_and_heavy_core_concrete_rows",
        "source_schema_import_readiness_with_exact_lab_fallback_bound_family_formula_and_negative_boundaries"
      ],
      requiredSourceFields: [
        "source_label_url_page_or_local_path",
        "assembly_layers_materials_thickness_density_or_surface_mass_and_mounting",
        "reported_metric_spectrum_lab_or_field_context_and_tolerance",
        "cavity_depth_fill_type_stud_type_stud_spacing_coupling_and_side_count_when_relevant",
        "import_decision_accept_bounded_reject_or_needs_research",
        "paired_engine_value_and_web_route_card_tests_required_before_visible_runtime_movement"
      ],
      allowedAfterGateA:
        "select_a_bounded_source_import_slice_only_if_rows_are_direct_and_negative_boundaries_are_pinned; otherwise_close_no_runtime"
    });
  });

  it("keeps source-family, visible-output, and productization boundaries closed", () => {
    expect(ACTIVE_BOUNDARIES.disallowedMoves).toEqual([
      "change_wall_double_leaf_or_stud_runtime_values_during_gate_c_closeout",
      "promote_no_stud_double_leaf_or_porous_double_leaf_from_adjacent_framed_rows",
      "borrow_floor_clt_floor_impact_or_product_delta_rows_as_wall_source_truth",
      "reopen_GDMTXA04A_C11c_raw_bare_open_box_open_web_wall_selector_heavy_concrete_timber_or_clt_from_nearby_green_tests",
      "change_support_confidence_evidence_text_or_route_card_copy_without_paired_tests",
      "resume_productization_before_the_selected_calculator_source_catalog_slice_closes_or_priority_changes"
    ]);
  });
});
