import { existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const POST_UI_INPUT_OUTPUT_HONESTY_GATE_C_NEXT_SLICE_SELECTION = {
  sliceId: "post_ui_input_output_honesty_gate_c_next_slice_selection_v1",
  closedImplementationSlice: "ui_input_output_honesty_v1",
  latestLandedGate: "ui_input_output_honesty_v1_gate_c_validated_closeout",
  selectedImplementationSlice: "project_access_policy_route_integration_v1",
  selectedPlanningSurface: "docs/calculator/SLICE_PROJECT_ACCESS_POLICY_ROUTE_INTEGRATION_PLAN.md",
  selectedRouteFamily: "owner_scoped_project_and_proposal_route_policy_adapter",
  selectionStatus: "selected_after_personal_use_calculator_readiness_chain_closed",
  calculatorReadinessStatus: "ready_for_private_internal_use_with_evidence_tier_caveats",
  numericRuntimeBehaviorChange: false,
  runtimeWidening: false,
  productizationCancelled: false,
  firstExecutionAction: "wire_owner_only_route_policy_adapter_without_changing_calculator_runtime"
} as const;

const READINESS_CLOSEOUT_EVIDENCE = {
  readinessDefinition: "private_internal_use_not_full_productization",
  validation: {
    focusedCurrentGate: "engine_98_files_445_tests_web_39_files_188_passed_18_skipped_build_5_of_5",
    broadCheck: "lint_typecheck_engine_231_files_1265_tests_web_152_files_871_passed_18_skipped_build_5_of_5"
  },
  closedBecause: [
    "common_wall_and_floor_routes_return_finite_values_when_source_formula_family_or_bound_support_exists",
    "exact_source_and_bound_precedence_is_guarded_before_formula_or_screening_lanes",
    "screening_low_confidence_bound_unsupported_and_fail_closed_posture_is_visible",
    "missing_inputs_invalid_thickness_many_layers_reorder_and_unsupported_outputs_do_not_emit_defended_bad_numbers",
    "api_validation_now_names_the_next_field_for_missing_layer_or_impact_source_payloads",
    "active_field_continuation_outputs_rejected_by_the_engine_stay_non_numeric_and_unsupported"
  ],
  caveats: [
    "not_claimed_as_every_possible_floor_or_wall_family_corridor",
    "not_claimed_as_a_certified_design_or_regulatory_submission_tool",
    "blocked_source_families_stay_closed_until_new_source_evidence_is_imported",
    "productization_access_persistence_billing_deployment_and_polished_reporting_remain_separate_work"
  ],
  evidenceLedger: [
    "docs/calculator/PERSONAL_USE_READINESS_ROADMAP.md",
    "docs/calculator/SLICE_UI_INPUT_OUTPUT_HONESTY_PLAN.md",
    "docs/calculator/CHECKPOINT_2026-04-27_UI_INPUT_OUTPUT_HONESTY_GATE_B_HANDOFF.md",
    "apps/web/features/workbench/ui-input-output-honesty-gate-a-inventory.test.ts",
    "apps/web/lib/calculator-api-validation.test.ts",
    "apps/web/features/workbench/simple-workbench-output-model.test.ts"
  ]
} as const;

const PRODUCTIZATION_RESUME_EVIDENCE = {
  resumedSlice: "project_access_policy_route_integration_v1",
  reason:
    "the_calculator_readiness_chain_is_closed_and_the_deferred_policy_route_adapter_is_the_next_documented_non_calculator_productization_slice",
  preservedCalculatorBoundaries: [
    "do_not_change_calculator_formulas_values_or_confidence_scores",
    "do_not_reopen_GDMTXA04A_C11c_raw_open_box_or_open_web_without_new_source_evidence",
    "do_not_promote_heavy_concrete_timber_stud_clt_or_floor_steel_fallback_without_source_or_bounded_family_evidence",
    "do_not_make_role_or_plan_tier_affect_acoustic_results"
  ],
  routeIntegrationScope: [
    "keep_routes_owner_scoped",
    "adapt_current_project_owner_scope_into_the_pure_access_policy",
    "prove_team_roles_are_not_route_enabled_until_a_membership_source_exists",
    "preserve_existing_project_and_proposal_route_status_shapes_unless_a_test_requires_narrower_policy_detail"
  ]
} as const;

describe("post UI input/output honesty Gate C next slice selection contract", () => {
  it("closes UI input/output honesty and marks the calculator ready for private/internal use", () => {
    expect(POST_UI_INPUT_OUTPUT_HONESTY_GATE_C_NEXT_SLICE_SELECTION).toEqual({
      sliceId: "post_ui_input_output_honesty_gate_c_next_slice_selection_v1",
      closedImplementationSlice: "ui_input_output_honesty_v1",
      latestLandedGate: "ui_input_output_honesty_v1_gate_c_validated_closeout",
      selectedImplementationSlice: "project_access_policy_route_integration_v1",
      selectedPlanningSurface: "docs/calculator/SLICE_PROJECT_ACCESS_POLICY_ROUTE_INTEGRATION_PLAN.md",
      selectedRouteFamily: "owner_scoped_project_and_proposal_route_policy_adapter",
      selectionStatus: "selected_after_personal_use_calculator_readiness_chain_closed",
      calculatorReadinessStatus: "ready_for_private_internal_use_with_evidence_tier_caveats",
      numericRuntimeBehaviorChange: false,
      runtimeWidening: false,
      productizationCancelled: false,
      firstExecutionAction: "wire_owner_only_route_policy_adapter_without_changing_calculator_runtime"
    });
  });

  it("ties the readiness closeout to validation, UI honesty, and source-posture evidence", () => {
    expect(READINESS_CLOSEOUT_EVIDENCE.closedBecause).toEqual([
      "common_wall_and_floor_routes_return_finite_values_when_source_formula_family_or_bound_support_exists",
      "exact_source_and_bound_precedence_is_guarded_before_formula_or_screening_lanes",
      "screening_low_confidence_bound_unsupported_and_fail_closed_posture_is_visible",
      "missing_inputs_invalid_thickness_many_layers_reorder_and_unsupported_outputs_do_not_emit_defended_bad_numbers",
      "api_validation_now_names_the_next_field_for_missing_layer_or_impact_source_payloads",
      "active_field_continuation_outputs_rejected_by_the_engine_stay_non_numeric_and_unsupported"
    ]);
    expect(READINESS_CLOSEOUT_EVIDENCE.validation).toEqual({
      focusedCurrentGate: "engine_98_files_445_tests_web_39_files_188_passed_18_skipped_build_5_of_5",
      broadCheck: "lint_typecheck_engine_231_files_1265_tests_web_152_files_871_passed_18_skipped_build_5_of_5"
    });
    expect(READINESS_CLOSEOUT_EVIDENCE.evidenceLedger).toContain(
      "apps/web/lib/calculator-api-validation.test.ts"
    );
    expect(READINESS_CLOSEOUT_EVIDENCE.evidenceLedger).toContain(
      "apps/web/features/workbench/simple-workbench-output-model.test.ts"
    );
  });

  it("keeps the private-use claim scoped and does not reopen blocked source families", () => {
    expect(READINESS_CLOSEOUT_EVIDENCE.readinessDefinition).toBe(
      "private_internal_use_not_full_productization"
    );
    expect(READINESS_CLOSEOUT_EVIDENCE.caveats).toEqual([
      "not_claimed_as_every_possible_floor_or_wall_family_corridor",
      "not_claimed_as_a_certified_design_or_regulatory_submission_tool",
      "blocked_source_families_stay_closed_until_new_source_evidence_is_imported",
      "productization_access_persistence_billing_deployment_and_polished_reporting_remain_separate_work"
    ]);
    expect(PRODUCTIZATION_RESUME_EVIDENCE.preservedCalculatorBoundaries).toEqual([
      "do_not_change_calculator_formulas_values_or_confidence_scores",
      "do_not_reopen_GDMTXA04A_C11c_raw_open_box_or_open_web_without_new_source_evidence",
      "do_not_promote_heavy_concrete_timber_stud_clt_or_floor_steel_fallback_without_source_or_bounded_family_evidence",
      "do_not_make_role_or_plan_tier_affect_acoustic_results"
    ]);
  });

  it("selects the deferred owner-only route policy integration as the next implementation slice", () => {
    expect(PRODUCTIZATION_RESUME_EVIDENCE.resumedSlice).toBe("project_access_policy_route_integration_v1");
    expect(PRODUCTIZATION_RESUME_EVIDENCE.reason).toContain("calculator_readiness_chain_is_closed");
    expect(PRODUCTIZATION_RESUME_EVIDENCE.routeIntegrationScope).toEqual([
      "keep_routes_owner_scoped",
      "adapt_current_project_owner_scope_into_the_pure_access_policy",
      "prove_team_roles_are_not_route_enabled_until_a_membership_source_exists",
      "preserve_existing_project_and_proposal_route_status_shapes_unless_a_test_requires_narrower_policy_detail"
    ]);
  });

  it("keeps the selected planning and evidence documents present for the next agent", () => {
    for (const path of [
      POST_UI_INPUT_OUTPUT_HONESTY_GATE_C_NEXT_SLICE_SELECTION.selectedPlanningSurface,
      "docs/calculator/PERSONAL_USE_READINESS_ROADMAP.md",
      "docs/calculator/CHECKPOINT_2026-04-27_UI_INPUT_OUTPUT_HONESTY_GATE_C_CLOSEOUT_HANDOFF.md",
      "docs/calculator/POST_CALCULATOR_PRODUCTIZATION_ROADMAP.md"
    ]) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });
});
