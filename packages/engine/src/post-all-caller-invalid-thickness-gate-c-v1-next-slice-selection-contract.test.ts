import { describe, expect, it } from "vitest";

const POST_INVALID_THICKNESS_GATE_C_V1_NEXT_SLICE_SELECTION = {
  sliceId: "post_all_caller_invalid_thickness_gate_c_v1_next_slice_selection_v1",
  closedImplementationSlice: "all_caller_invalid_thickness_guard_v1",
  latestLandedGate: "all_caller_invalid_thickness_guard_v1_gate_c_no_runtime_closeout",
  selectedImplementationSlice: "dynamic_airborne_split_refactor_v2",
  selectedPlanningSurface: "docs/calculator/SLICE_DYNAMIC_AIRBORNE_SPLIT_REFACTOR_V2_PLAN.md",
  selectedRouteFamily: "dynamic_airborne_architecture_hygiene",
  nextExecutionAction:
    "inventory_remaining_dynamic_airborne_floor_cap_guards_and_plan_composer_injection_before_mechanical_carve"
} as const;

const INVALID_THICKNESS_CLOSEOUT_EVIDENCE = {
  posture: "no_runtime_change_gate_a_inventory_and_gate_c_closeout",
  gateBDecision: "not_required_by_gate_a_findings",
  executableProof: [
    "packages/engine/src/all-caller-invalid-thickness-guard-gate-a-matrix.test.ts",
    "packages/engine/src/raw-floor-hostile-input-answer-matrix.test.ts",
    "packages/engine/src/raw-wall-hostile-input-answer-matrix.test.ts",
    "apps/web/features/workbench/normalize-rows.test.ts"
  ],
  auditedCallerSurfaces: [
    "wall_lab_direct",
    "wall_field_direct",
    "floor_field_explicit_roles",
    "floor_raw_pre_inference"
  ],
  invalidThicknessClasses: ["zero", "negative", "nan", "infinity", "non_numeric_runtime_value"],
  findings: [
    "no_direct_caller_crashed",
    "metrics_ratings_and_curve_bands_stayed_finite",
    "supported_target_outputs_stayed_empty",
    "requested_outputs_moved_to_unsupported_target_outputs",
    "impact_and_floor_system_lanes_stayed_null_or_absent",
    "every_cell_emitted_a_thickness_specific_warning"
  ]
} as const;

const MASTER_GRID_CLOSEOUT = {
  row: "Engine thickness validity",
  statusAfterCloseout: "Benchmark",
  removedDeferredReason: "Standalone all-caller floor/wall direct engine guard remains deferred.",
  evidenceAdded: "packages/engine/src/all-caller-invalid-thickness-guard-gate-a-matrix.test.ts"
} as const;

const NEXT_SLICE_RATIONALE = {
  selectedBecause: [
    "all_caller_invalid_thickness_gate_a_found_no_runtime_or_card_drift",
    "master_plan_engine_thickness_validity_row_can_leave_partial_after_gate_c_grid_sync",
    "remaining_source_family_gaps_are_blocked_or_lower_roi_without_new_evidence",
    "dynamic_airborne_ts_remains_above_2000_lines_with_a_documented_composer_injection_blocker",
    "architecture_hygiene_improves_future_accuracy_work_without_changing_calculator_values"
  ],
  firstGate: "gate_a_inventory_remaining_dynamic_airborne_guard_call_graph_no_runtime_change",
  deferredButNotCancelled: [
    "project_access_policy_route_integration_v1",
    "deep_hybrid_swap_value_pins",
    "workbench_card_level_selector_value_pins",
    "blocked_source_family_reopens_without_new_evidence"
  ]
} as const;

const ACTIVE_BOUNDARIES = {
  disallowedMoves: [
    "change_defended_calculator_values_during_the_split",
    "retune_dynamic_airborne_formulas",
    "reopen_GDMTXA04A_C11c_raw_bare_or_wall_selector_blocked_source_families",
    "deduplicate_or_rewrite_guard_logic_during_a_mechanical_carve",
    "introduce_a_circular_import_between_dynamic_airborne_and_guard_modules",
    "resume_productization_route_integration_before_the_selected_calculator_slice_closes"
  ]
} as const;

describe("post all-caller invalid-thickness Gate C next slice selection contract", () => {
  it("closes the invalid-thickness guard and selects dynamic airborne split v2 next", () => {
    expect(POST_INVALID_THICKNESS_GATE_C_V1_NEXT_SLICE_SELECTION).toEqual({
      sliceId: "post_all_caller_invalid_thickness_gate_c_v1_next_slice_selection_v1",
      closedImplementationSlice: "all_caller_invalid_thickness_guard_v1",
      latestLandedGate: "all_caller_invalid_thickness_guard_v1_gate_c_no_runtime_closeout",
      selectedImplementationSlice: "dynamic_airborne_split_refactor_v2",
      selectedPlanningSurface: "docs/calculator/SLICE_DYNAMIC_AIRBORNE_SPLIT_REFACTOR_V2_PLAN.md",
      selectedRouteFamily: "dynamic_airborne_architecture_hygiene",
      nextExecutionAction:
        "inventory_remaining_dynamic_airborne_floor_cap_guards_and_plan_composer_injection_before_mechanical_carve"
    });
  });

  it("ties closeout to the direct invalid-thickness caller evidence", () => {
    expect(INVALID_THICKNESS_CLOSEOUT_EVIDENCE.posture).toBe(
      "no_runtime_change_gate_a_inventory_and_gate_c_closeout"
    );
    expect(INVALID_THICKNESS_CLOSEOUT_EVIDENCE.gateBDecision).toBe(
      "not_required_by_gate_a_findings"
    );
    expect(INVALID_THICKNESS_CLOSEOUT_EVIDENCE.auditedCallerSurfaces).toEqual([
      "wall_lab_direct",
      "wall_field_direct",
      "floor_field_explicit_roles",
      "floor_raw_pre_inference"
    ]);
    expect(INVALID_THICKNESS_CLOSEOUT_EVIDENCE.invalidThicknessClasses).toEqual([
      "zero",
      "negative",
      "nan",
      "infinity",
      "non_numeric_runtime_value"
    ]);
    expect(INVALID_THICKNESS_CLOSEOUT_EVIDENCE.findings).toContain(
      "every_cell_emitted_a_thickness_specific_warning"
    );
  });

  it("moves engine thickness validity out of partial only with matching grid evidence", () => {
    expect(MASTER_GRID_CLOSEOUT).toEqual({
      row: "Engine thickness validity",
      statusAfterCloseout: "Benchmark",
      removedDeferredReason: "Standalone all-caller floor/wall direct engine guard remains deferred.",
      evidenceAdded: "packages/engine/src/all-caller-invalid-thickness-guard-gate-a-matrix.test.ts"
    });
  });

  it("selects dynamic airborne split v2 before lower-ROI optional/productization work", () => {
    expect(NEXT_SLICE_RATIONALE.selectedBecause).toEqual([
      "all_caller_invalid_thickness_gate_a_found_no_runtime_or_card_drift",
      "master_plan_engine_thickness_validity_row_can_leave_partial_after_gate_c_grid_sync",
      "remaining_source_family_gaps_are_blocked_or_lower_roi_without_new_evidence",
      "dynamic_airborne_ts_remains_above_2000_lines_with_a_documented_composer_injection_blocker",
      "architecture_hygiene_improves_future_accuracy_work_without_changing_calculator_values"
    ]);
    expect(NEXT_SLICE_RATIONALE.firstGate).toBe(
      "gate_a_inventory_remaining_dynamic_airborne_guard_call_graph_no_runtime_change"
    );
    expect(NEXT_SLICE_RATIONALE.deferredButNotCancelled).toContain(
      "project_access_policy_route_integration_v1"
    );
  });

  it("keeps value, source-family, split-scope, and productization boundaries closed", () => {
    expect(ACTIVE_BOUNDARIES.disallowedMoves).toEqual([
      "change_defended_calculator_values_during_the_split",
      "retune_dynamic_airborne_formulas",
      "reopen_GDMTXA04A_C11c_raw_bare_or_wall_selector_blocked_source_families",
      "deduplicate_or_rewrite_guard_logic_during_a_mechanical_carve",
      "introduce_a_circular_import_between_dynamic_airborne_and_guard_modules",
      "resume_productization_route_integration_before_the_selected_calculator_slice_closes"
    ]);
  });
});
