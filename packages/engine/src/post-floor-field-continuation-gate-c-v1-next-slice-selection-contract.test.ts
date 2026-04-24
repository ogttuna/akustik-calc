import { describe, expect, it } from "vitest";

const POST_FLOOR_FIELD_CONTINUATION_GATE_C_V1_NEXT_SLICE_SELECTION = {
  sliceId: "post_floor_field_continuation_gate_c_v1_next_slice_selection_v1",
  closedImplementationSlice: "floor_field_continuation_expansion_v1",
  latestLandedGate: "floor_field_continuation_expansion_v1_gate_c_no_runtime_closeout",
  selectedImplementationSlice: "floor_many_layer_stress_regression_v1",
  selectedPlanningSurface: "docs/calculator/SLICE_FLOOR_MANY_LAYER_STRESS_REGRESSION_PLAN.md",
  selectedRouteFamily: "floor_50_plus_layer_stability_surfaces",
  nextExecutionAction:
    "pin_50_plus_floor_stack_stability_across_supported_and_fail_closed_routes_without_runtime_change"
} as const;

const FLOOR_FIELD_CONTINUATION_CLOSEOUT_EVIDENCE = {
  posture: "no_runtime_change_gate_a_inventory",
  gateBDecision: "not_required_by_gate_a_findings",
  executableProof: [
    "packages/engine/src/floor-field-continuation-gate-a-matrix.test.ts",
    "apps/web/features/workbench/floor-field-continuation-gate-a-card-matrix.test.ts"
  ],
  representativeFamilies: [
    "ubiq_fl28_open_web_steel_200_exact_lab_2026",
    "knauf_ct120_1c_timber_lab_2026",
    "dataholz_gdmtxn01_dry_clt_lab_2026",
    "reinforced_concrete_low_confidence_formula_floor",
    "raw_terminal_concrete_helper_floor",
    "raw_bare_open_web_impact_blocked_floor"
  ],
  pinnedContexts: ["lab", "field_between_rooms", "building_prediction"],
  pinnedOutputs: [
    "Rw",
    "R'w",
    "Dn,w",
    "Dn,A",
    "DnT,w",
    "DnT,A",
    "Ln,w",
    "L'n,w",
    "L'nT,w"
  ]
} as const;

const NEXT_SLICE_RATIONALE = {
  selectedBecause: [
    "floor_field_continuation_gate_a_found_no_runtime_or_card_drift",
    "master_plan_d3_requires_50_plus_layer_stacks_to_return_defended_answers_or_fail_closed_states",
    "wall_50_plus_layer_behavior_is_pinned_but_floor_50_plus_layer_behavior_remains_deferred",
    "many_layer_stress_is_a_direct_user_operator_risk_and_can_be_pinned_without_source_family_reopening"
  ],
  firstGate: "gate_a_inventory_current_floor_50_plus_layer_stability_no_runtime_change",
  deferredButNotCancelled: [
    "arbitrary_floor_reorder_expansion",
    "standalone_all_caller_invalid_thickness_guard",
    "project_access_policy_route_integration_v1"
  ]
} as const;

const ACTIVE_BOUNDARIES = {
  disallowedMoves: [
    "reopen_GDMTXA04A_direct_exact_without_composite_surface_source_model",
    "reopen_C11c_exact_import_without_resolving_the_combined_wet_tuple_anomaly",
    "infer_bare_open_box_or_open_web_impact_from_packaged_system_rows",
    "treat_arbitrary_floor_layer_reorder_as_value_invariant",
    "resume_productization_route_integration_before_the_selected_calculator_slice_closes"
  ]
} as const;

describe("post floor field-continuation Gate C next slice selection contract", () => {
  it("closes the floor continuation slice and selects floor 50+ layer stress next", () => {
    expect(POST_FLOOR_FIELD_CONTINUATION_GATE_C_V1_NEXT_SLICE_SELECTION).toEqual({
      sliceId: "post_floor_field_continuation_gate_c_v1_next_slice_selection_v1",
      closedImplementationSlice: "floor_field_continuation_expansion_v1",
      latestLandedGate: "floor_field_continuation_expansion_v1_gate_c_no_runtime_closeout",
      selectedImplementationSlice: "floor_many_layer_stress_regression_v1",
      selectedPlanningSurface: "docs/calculator/SLICE_FLOOR_MANY_LAYER_STRESS_REGRESSION_PLAN.md",
      selectedRouteFamily: "floor_50_plus_layer_stability_surfaces",
      nextExecutionAction:
        "pin_50_plus_floor_stack_stability_across_supported_and_fail_closed_routes_without_runtime_change"
    });
  });

  it("ties closeout to the no-runtime floor continuation inventory", () => {
    expect(FLOOR_FIELD_CONTINUATION_CLOSEOUT_EVIDENCE.posture).toBe(
      "no_runtime_change_gate_a_inventory"
    );
    expect(FLOOR_FIELD_CONTINUATION_CLOSEOUT_EVIDENCE.gateBDecision).toBe(
      "not_required_by_gate_a_findings"
    );
    expect(FLOOR_FIELD_CONTINUATION_CLOSEOUT_EVIDENCE.executableProof).toEqual([
      "packages/engine/src/floor-field-continuation-gate-a-matrix.test.ts",
      "apps/web/features/workbench/floor-field-continuation-gate-a-card-matrix.test.ts"
    ]);
    expect(FLOOR_FIELD_CONTINUATION_CLOSEOUT_EVIDENCE.representativeFamilies).toContain(
      "raw_bare_open_web_impact_blocked_floor"
    );
    expect(FLOOR_FIELD_CONTINUATION_CLOSEOUT_EVIDENCE.pinnedContexts).toEqual([
      "lab",
      "field_between_rooms",
      "building_prediction"
    ]);
  });

  it("selects floor many-layer stress because the floor 50+ surface is still unpinned", () => {
    expect(NEXT_SLICE_RATIONALE.selectedBecause).toEqual([
      "floor_field_continuation_gate_a_found_no_runtime_or_card_drift",
      "master_plan_d3_requires_50_plus_layer_stacks_to_return_defended_answers_or_fail_closed_states",
      "wall_50_plus_layer_behavior_is_pinned_but_floor_50_plus_layer_behavior_remains_deferred",
      "many_layer_stress_is_a_direct_user_operator_risk_and_can_be_pinned_without_source_family_reopening"
    ]);
    expect(NEXT_SLICE_RATIONALE.firstGate).toBe(
      "gate_a_inventory_current_floor_50_plus_layer_stability_no_runtime_change"
    );
    expect(NEXT_SLICE_RATIONALE.deferredButNotCancelled).toContain("arbitrary_floor_reorder_expansion");
  });

  it("keeps blocked source, arbitrary floor reorder, and productization boundaries closed", () => {
    expect(ACTIVE_BOUNDARIES.disallowedMoves).toEqual([
      "reopen_GDMTXA04A_direct_exact_without_composite_surface_source_model",
      "reopen_C11c_exact_import_without_resolving_the_combined_wet_tuple_anomaly",
      "infer_bare_open_box_or_open_web_impact_from_packaged_system_rows",
      "treat_arbitrary_floor_layer_reorder_as_value_invariant",
      "resume_productization_route_integration_before_the_selected_calculator_slice_closes"
    ]);
  });
});
