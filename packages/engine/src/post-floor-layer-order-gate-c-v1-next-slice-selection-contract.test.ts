import { describe, expect, it } from "vitest";

const POST_FLOOR_LAYER_ORDER_GATE_C_V1_NEXT_SLICE_SELECTION = {
  sliceId: "post_floor_layer_order_gate_c_v1_next_slice_selection_v1",
  closedImplementationSlice: "floor_layer_order_edit_stability_v1",
  latestLandedGate: "floor_layer_order_edit_stability_v1_gate_c_no_runtime_closeout",
  selectedImplementationSlice: "all_caller_invalid_thickness_guard_v1",
  selectedPlanningSurface: "docs/calculator/SLICE_ALL_CALLER_INVALID_THICKNESS_GUARD_PLAN.md",
  selectedRouteFamily: "cross_cutting_engine_input_guard_surfaces",
  nextExecutionAction:
    "inventory_direct_engine_invalid_thickness_behavior_for_floor_and_wall_callers_before_runtime_guard"
} as const;

const FLOOR_LAYER_ORDER_CLOSEOUT_EVIDENCE = {
  posture: "no_runtime_change_gate_a_inventory_and_gate_c_closeout",
  gateBDecision: "not_required_by_gate_a_findings",
  executableProof: [
    "packages/engine/src/floor-layer-order-edit-stability-gate-a-matrix.test.ts",
    "apps/web/features/workbench/floor-layer-order-edit-stability-gate-a-card-matrix.test.ts"
  ],
  findings: [
    "explicit_role_ubiq_and_dataholz_exact_rows_stay_exact_after_reorder",
    "raw_terminal_concrete_helper_order_sensitive_rw_support_change_is_explicit",
    "raw_open_web_impact_outputs_remain_fail_closed_after_reorder",
    "unsupported_cards_do_not_leak_live_or_bound_values"
  ],
  validation: [
    "focused_gate_green_82_engine_381_tests_36_web_170_passed_18_skipped_build_5_of_5",
    "broad_check_green_215_engine_1201_tests_150_web_864_passed_18_skipped_build_5_of_5"
  ]
} as const;

const NEXT_SLICE_RATIONALE = {
  selectedBecause: [
    "floor_layer_order_gate_a_found_no_runtime_or_card_drift",
    "master_plan_d3_requires_invalid_thickness_to_fail_closed_with_specific_warning",
    "master_plan_cross_cutting_grid_still_marks_engine_thickness_validity_partial",
    "workbench_normalization_and_wall_direct_hostile_inputs_are_guarded_but_all_engine_callers_are_not_yet_audited",
    "guard_improves_accuracy_honesty_by_preventing_nan_undefined_or_silent_calculation_from_hostile_direct_callers"
  ],
  firstGate: "gate_a_inventory_current_direct_floor_and_wall_invalid_thickness_surfaces_no_runtime_change",
  deferredButNotCancelled: [
    "dynamic_airborne_split_refactor_v2",
    "deep_hybrid_swap_value_pins",
    "workbench_card_level_selector_value_pins",
    "project_access_policy_route_integration_v1"
  ]
} as const;

const ACTIVE_BOUNDARIES = {
  disallowedMoves: [
    "change_defended_values_without_a_specific_invalid_thickness_failure_reproduction",
    "normalize_physical_layer_order_or_merge_layers_as_part_of_the_guard",
    "reopen_GDMTXA04A_C11c_raw_bare_or_wall_selector_blocked_source_families",
    "turn_unsupported_invalid_thickness_outputs_into_estimates",
    "resume_productization_route_integration_before_the_selected_calculator_slice_closes"
  ]
} as const;

describe("post floor layer-order Gate C next slice selection contract", () => {
  it("closes the layer-order slice and selects all-caller invalid thickness next", () => {
    expect(POST_FLOOR_LAYER_ORDER_GATE_C_V1_NEXT_SLICE_SELECTION).toEqual({
      sliceId: "post_floor_layer_order_gate_c_v1_next_slice_selection_v1",
      closedImplementationSlice: "floor_layer_order_edit_stability_v1",
      latestLandedGate: "floor_layer_order_edit_stability_v1_gate_c_no_runtime_closeout",
      selectedImplementationSlice: "all_caller_invalid_thickness_guard_v1",
      selectedPlanningSurface: "docs/calculator/SLICE_ALL_CALLER_INVALID_THICKNESS_GUARD_PLAN.md",
      selectedRouteFamily: "cross_cutting_engine_input_guard_surfaces",
      nextExecutionAction:
        "inventory_direct_engine_invalid_thickness_behavior_for_floor_and_wall_callers_before_runtime_guard"
    });
  });

  it("ties closeout to the no-runtime layer-order engine and card evidence", () => {
    expect(FLOOR_LAYER_ORDER_CLOSEOUT_EVIDENCE.posture).toBe(
      "no_runtime_change_gate_a_inventory_and_gate_c_closeout"
    );
    expect(FLOOR_LAYER_ORDER_CLOSEOUT_EVIDENCE.gateBDecision).toBe(
      "not_required_by_gate_a_findings"
    );
    expect(FLOOR_LAYER_ORDER_CLOSEOUT_EVIDENCE.executableProof).toEqual([
      "packages/engine/src/floor-layer-order-edit-stability-gate-a-matrix.test.ts",
      "apps/web/features/workbench/floor-layer-order-edit-stability-gate-a-card-matrix.test.ts"
    ]);
    expect(FLOOR_LAYER_ORDER_CLOSEOUT_EVIDENCE.findings).toContain(
      "unsupported_cards_do_not_leak_live_or_bound_values"
    );
  });

  it("selects the remaining cross-cutting invalid-thickness guard before lower-ROI follow-ups", () => {
    expect(NEXT_SLICE_RATIONALE.selectedBecause).toEqual([
      "floor_layer_order_gate_a_found_no_runtime_or_card_drift",
      "master_plan_d3_requires_invalid_thickness_to_fail_closed_with_specific_warning",
      "master_plan_cross_cutting_grid_still_marks_engine_thickness_validity_partial",
      "workbench_normalization_and_wall_direct_hostile_inputs_are_guarded_but_all_engine_callers_are_not_yet_audited",
      "guard_improves_accuracy_honesty_by_preventing_nan_undefined_or_silent_calculation_from_hostile_direct_callers"
    ]);
    expect(NEXT_SLICE_RATIONALE.firstGate).toBe(
      "gate_a_inventory_current_direct_floor_and_wall_invalid_thickness_surfaces_no_runtime_change"
    );
    expect(NEXT_SLICE_RATIONALE.deferredButNotCancelled).toContain(
      "dynamic_airborne_split_refactor_v2"
    );
  });

  it("keeps runtime values, source-family posture, and productization boundaries closed", () => {
    expect(ACTIVE_BOUNDARIES.disallowedMoves).toEqual([
      "change_defended_values_without_a_specific_invalid_thickness_failure_reproduction",
      "normalize_physical_layer_order_or_merge_layers_as_part_of_the_guard",
      "reopen_GDMTXA04A_C11c_raw_bare_or_wall_selector_blocked_source_families",
      "turn_unsupported_invalid_thickness_outputs_into_estimates",
      "resume_productization_route_integration_before_the_selected_calculator_slice_closes"
    ]);
  });
});
