import { describe, expect, it } from "vitest";

export const POST_TEAM_ACCESS_MODEL_CALCULATOR_REFOCUS_NEXT_SLICE_SELECTION = {
  sliceId: "post_team_access_model_calculator_refocus_next_slice_selection_v1",
  latestClosedImplementationSlice: "team_access_model_v1",
  refocusReason:
    "broad_revalidation_confirmed_the_repo_is_green_and_the_product_priority_was_reasserted_as_calculation_accuracy_and_coverage_first",
  selectedImplementationSlice: "wall_formula_family_widening_v1",
  selectedPlanningSurface: "docs/calculator/SLICE_WALL_FORMULA_FAMILY_WIDENING_PLAN.md",
  selectedRouteFamily: "wall_airborne_formula_families",
  deferredProductizationSlice: "project_access_policy_route_integration_v1",
  firstExecutionAction:
    "author_wall_formula_family_audit_anchor_matrix_before_any_runtime_formula_value_change",
  gateAStatus: "landed_no_runtime_value_change",
  gateAArtifact: "packages/engine/src/wall-formula-family-widening-audit.test.ts",
  gateBStatus: "landed_live_workbench_dynamic_route_pinned",
  gateBArtifact: "apps/web/features/workbench/wall-live-dynamic-preset-route-card-matrix.test.ts",
  currentExecutionAction:
    "decide_gate_c_source_backed_runtime_tightening_or_no_runtime_closeout_after_live_dynamic_route_confirmation",
  numericRuntimeBehaviorChange: false,
  runtimeTighteningEligible: true,
  productizationCancelled: false
} as const;

const SELECTED_WALL_FORMULA_EVIDENCE = {
  primaryObjective:
    "broader_defensible_wall_layer_combination_coverage_plus_higher_numerical_accuracy",
  knownGap:
    "timber_stud_wall_has_two_surfaces_screening_seed_lab_rw_31_1_field_rw_prime_24_building_dntw_25_and_dynamic_candidate_rw_50_field_rw_prime_42_building_dntw_43_with_low_confidence_framed_wall_trace",
  sourceRecheck:
    "davy_2010_double_leaf_cavity_wall_model_and_2024_stud_type_sound_bridge_research_support_a_corridor_audit_not_a_direct_exact_replacement_value",
  gateAAnchors: [
    "packages/engine/src/wall-formula-family-widening-audit.test.ts",
    "tools/dev/run-calculator-current-gate.ts",
    "calculator_null_and_dynamic_surfaces_are_named_before_runtime_work"
  ],
  gateBAnchors: [
    "apps/web/features/workbench/wall-live-dynamic-preset-route-card-matrix.test.ts",
    "live_workbench_shell_forwards_calculator_id_to_evaluate_scenario",
    "screening_preset_matrices_remain_non_user_visible_drift_guards"
  ],
  existingGuardrails: [
    "apps/web/features/workbench/wall-lsf-timber-stud-preset-benchmarks.test.ts",
    "apps/web/features/workbench/wall-field-continuation-completeness-matrix.test.ts",
    "apps/web/features/workbench/wall-physical-invariants-matrix.test.ts",
    "packages/engine/src/mixed-floor-wall-cross-mode-wall-extension-matrix.test.ts",
    "packages/engine/src/coverage-grid-consistency.test.ts"
  ],
  firstRuntimePreconditions: [
    "pin_calculator_null_and_dynamic_trace_surfaces_for_lsf_timber_stud_double_leaf_and_lined_cavity_cases",
    "prove_exact_catalog_and_verified_benchmark_precedence_before_any_formula_lane_can_fire",
    "prove_negative_cases_for_single_leaf_triple_leaf_direct_coupled_and_hostile_thickness_stacks",
    "name_which_calculator_surface_is_authoritative_for_each_user_visible_wall_path",
    "define_a_defended_target_corridor_before_changing_timber_stud_or_double_leaf_values"
  ]
} as const;

const DEFERRED_PRODUCTIZATION_EVIDENCE = {
  deferredSlice: "project_access_policy_route_integration_v1",
  reason:
    "policy_contract_exists_but_route_integration_does_not_improve_acoustic_accuracy_or_coverage_and_can_wait_until_the_calculator_reentry_slice_is_planned",
  preservedArtifacts: [
    "apps/web/lib/project-access-policy.ts",
    "apps/web/lib/project-access-policy.test.ts",
    "docs/calculator/SLICE_PROJECT_ACCESS_POLICY_ROUTE_INTEGRATION_PLAN.md",
    "docs/calculator/CHECKPOINT_2026-04-23_TEAM_ACCESS_MODEL_HANDOFF.md"
  ]
} as const;

const KEPT_BOUNDARIES = {
  blockedSourceQueueUnchanged: [
    "GDMTXA04A_direct_exact",
    "C11c_exact_import",
    "raw_bare_open_box_open_web_impact",
    "wall_selector_behavior_widening"
  ],
  productizationRouteIntegrationDeferredNotDeleted: true,
  noCalculatorRuntimeChangeDuringRefocusPlanning: true,
  exactCatalogRowsMustKeepPrecedenceOverFormulaLanes: true,
  broadGreenBaselineRequiredBeforeCommit: true
} as const;

describe("post team-access model calculator refocus next-slice selection contract", () => {
  it("selects wall formula-family widening after the green broad revalidation", () => {
    expect(POST_TEAM_ACCESS_MODEL_CALCULATOR_REFOCUS_NEXT_SLICE_SELECTION).toMatchObject({
      latestClosedImplementationSlice: "team_access_model_v1",
      selectedImplementationSlice: "wall_formula_family_widening_v1",
      selectedPlanningSurface: "docs/calculator/SLICE_WALL_FORMULA_FAMILY_WIDENING_PLAN.md",
      deferredProductizationSlice: "project_access_policy_route_integration_v1",
      gateAStatus: "landed_no_runtime_value_change",
      gateBStatus: "landed_live_workbench_dynamic_route_pinned",
      numericRuntimeBehaviorChange: false,
      runtimeTighteningEligible: true
    });
  });

  it("anchors the selection to the known timber-stud accuracy gap and existing wall guardrails", () => {
    expect(SELECTED_WALL_FORMULA_EVIDENCE.knownGap).toContain("lab_rw_31_1");
    expect(SELECTED_WALL_FORMULA_EVIDENCE.knownGap).toContain("building_dntw_25");
    expect(SELECTED_WALL_FORMULA_EVIDENCE.knownGap).toContain("dynamic_candidate_rw_50");
    expect(SELECTED_WALL_FORMULA_EVIDENCE.knownGap).toContain("building_dntw_43");
    expect(SELECTED_WALL_FORMULA_EVIDENCE.knownGap).toContain("low_confidence_framed_wall_trace");
    expect(SELECTED_WALL_FORMULA_EVIDENCE.sourceRecheck).toContain("corridor_audit_not_a_direct_exact_replacement_value");
    expect(SELECTED_WALL_FORMULA_EVIDENCE.existingGuardrails).toContain(
      "apps/web/features/workbench/wall-lsf-timber-stud-preset-benchmarks.test.ts"
    );
    expect(SELECTED_WALL_FORMULA_EVIDENCE.existingGuardrails).toContain(
      "packages/engine/src/coverage-grid-consistency.test.ts"
    );
  });

  it("records the landed Gate A audit and Gate B live-route proof before any runtime formula change", () => {
    expect(POST_TEAM_ACCESS_MODEL_CALCULATOR_REFOCUS_NEXT_SLICE_SELECTION.firstExecutionAction).toBe(
      "author_wall_formula_family_audit_anchor_matrix_before_any_runtime_formula_value_change"
    );
    expect(POST_TEAM_ACCESS_MODEL_CALCULATOR_REFOCUS_NEXT_SLICE_SELECTION.gateAArtifact).toBe(
      "packages/engine/src/wall-formula-family-widening-audit.test.ts"
    );
    expect(POST_TEAM_ACCESS_MODEL_CALCULATOR_REFOCUS_NEXT_SLICE_SELECTION.gateBArtifact).toBe(
      "apps/web/features/workbench/wall-live-dynamic-preset-route-card-matrix.test.ts"
    );
    expect(POST_TEAM_ACCESS_MODEL_CALCULATOR_REFOCUS_NEXT_SLICE_SELECTION.currentExecutionAction).toBe(
      "decide_gate_c_source_backed_runtime_tightening_or_no_runtime_closeout_after_live_dynamic_route_confirmation"
    );
    expect(SELECTED_WALL_FORMULA_EVIDENCE.gateAAnchors).toContain(
      "calculator_null_and_dynamic_surfaces_are_named_before_runtime_work"
    );
    expect(SELECTED_WALL_FORMULA_EVIDENCE.gateBAnchors).toContain(
      "live_workbench_shell_forwards_calculator_id_to_evaluate_scenario"
    );
    expect(SELECTED_WALL_FORMULA_EVIDENCE.gateBAnchors).toContain(
      "screening_preset_matrices_remain_non_user_visible_drift_guards"
    );
    expect(SELECTED_WALL_FORMULA_EVIDENCE.firstRuntimePreconditions).toEqual([
      "pin_calculator_null_and_dynamic_trace_surfaces_for_lsf_timber_stud_double_leaf_and_lined_cavity_cases",
      "prove_exact_catalog_and_verified_benchmark_precedence_before_any_formula_lane_can_fire",
      "prove_negative_cases_for_single_leaf_triple_leaf_direct_coupled_and_hostile_thickness_stacks",
      "name_which_calculator_surface_is_authoritative_for_each_user_visible_wall_path",
      "define_a_defended_target_corridor_before_changing_timber_stud_or_double_leaf_values"
    ]);
  });

  it("defers productization route integration without deleting its policy contract", () => {
    expect(DEFERRED_PRODUCTIZATION_EVIDENCE.deferredSlice).toBe("project_access_policy_route_integration_v1");
    expect(DEFERRED_PRODUCTIZATION_EVIDENCE.reason).toContain("does_not_improve_acoustic_accuracy_or_coverage");
    expect(DEFERRED_PRODUCTIZATION_EVIDENCE.preservedArtifacts).toContain("apps/web/lib/project-access-policy.ts");
    expect(POST_TEAM_ACCESS_MODEL_CALCULATOR_REFOCUS_NEXT_SLICE_SELECTION.productizationCancelled).toBe(false);
  });

  it("keeps blocked-source and exact-precedence boundaries intact", () => {
    expect(KEPT_BOUNDARIES.blockedSourceQueueUnchanged).toEqual([
      "GDMTXA04A_direct_exact",
      "C11c_exact_import",
      "raw_bare_open_box_open_web_impact",
      "wall_selector_behavior_widening"
    ]);
    expect(KEPT_BOUNDARIES.productizationRouteIntegrationDeferredNotDeleted).toBe(true);
    expect(KEPT_BOUNDARIES.noCalculatorRuntimeChangeDuringRefocusPlanning).toBe(true);
    expect(KEPT_BOUNDARIES.exactCatalogRowsMustKeepPrecedenceOverFormulaLanes).toBe(true);
    expect(KEPT_BOUNDARIES.broadGreenBaselineRequiredBeforeCommit).toBe(true);
  });
});
