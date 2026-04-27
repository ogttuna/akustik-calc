import { existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const POST_FLOOR_FALLBACK_LOW_CONFIDENCE_GATE_C_NEXT_SLICE_SELECTION = {
  sliceId: "post_floor_fallback_low_confidence_gate_c_next_slice_selection_v1",
  closedImplementationSlice: "floor_fallback_low_confidence_cleanup_v1",
  latestLandedGate: "floor_fallback_low_confidence_cleanup_v1_gate_c_no_runtime_closeout",
  selectedImplementationSlice: "ui_input_output_honesty_v1",
  selectedPlanningSurface: "docs/calculator/SLICE_UI_INPUT_OUTPUT_HONESTY_PLAN.md",
  selectedRouteFamily: "workbench_input_output_honesty_and_support_visibility",
  selectionStatus:
    "selected_after_floor_fallback_promotion_blocked_and_low_confidence_posture_pinned",
  numericRuntimeBehaviorChange: false,
  runtimeWidening: false,
  nextExecutionAction:
    "gate_a_inventory_required_inputs_output_support_origin_confidence_and_edit_stability_no_runtime_change"
} as const;

const FLOOR_FALLBACK_GATE_C_CLOSEOUT_EVIDENCE = {
  posture: "no_runtime_gate_a_audit_plus_gate_b_source_formula_decision_closed",
  closedBecause: [
    "selected_stack_has_no_exact_pliteq_source_topology",
    "selected_stack_has_no_ubiq_fl32_bound_source_topology",
    "selected_stack_has_no_bounded_steel_open_web_family_rule",
    "unsupported_lprimen_t50_lnw_plus_ci_and_delta_lw_are_already_explicit",
    "low_confidence_engine_and_web_posture_is_already_visible"
  ],
  keptRuntimePosture: {
    evidenceTier: "screening",
    estimateKind: "low_confidence",
    fitPercent: 28,
    generatedCaseId: "floor-steel-fallback",
    impactBasis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
    lnW: 58.3,
    lPrimeNTw: 58.5,
    lPrimeNW: 61.3,
    originBasisId: "predictor_floor_system_low_confidence_estimate",
    rwPrimeDb: 70,
    supportedFieldOutputs: ["Rw", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"],
    unsupportedFieldOutputs: ["L'nT,50"]
  },
  executableProof: [
    "packages/engine/src/floor-fallback-low-confidence-gate-a-audit-contract.test.ts",
    "packages/engine/src/floor-fallback-low-confidence-gate-b-source-contract.test.ts"
  ]
} as const;

const SELECTED_UI_INPUT_OUTPUT_HONESTY_EVIDENCE = {
  selectedBecause: [
    "the_remaining_personal_use_gap_is_not_a_new_formula_before_the_ui_shows_existing_engine_honesty",
    "missing_inputs_must_tell_the_user_what_to_enter_next_for_wall_and_floor_routes",
    "output_cards_must_distinguish_exact_benchmark_formula_family_screening_bound_unsupported_and_fail_closed_values",
    "origin_confidence_and_unsupported_output_messages_must_survive_layer_edits_reorder_many_layers_and_save_load",
    "private_use_readiness_requires_visible_support_posture_for_common_stacks_before_productization_resumes"
  ],
  firstGate:
    "gate_a_inventory_required_inputs_output_support_origin_confidence_and_edit_stability_no_runtime_change",
  requiredSurfaces: [
    "apps/web/features/workbench",
    "apps/web/app/api/estimate",
    "apps/web/app/api/impact-only",
    "packages/engine/src/target-output-support-contract.test.ts",
    "packages/engine/src/output-origin-trace-matrix.test.ts"
  ],
  deferredButNotCancelled: ["project_access_policy_route_integration_v1"]
} as const;

const ACTIVE_BOUNDARIES = {
  disallowedMoves: [
    "change_floor_steel_fallback_runtime_values_during_ui_honesty_gate_a",
    "hide_low_confidence_screening_bound_or_unsupported_posture_behind_generic_estimated_labels",
    "invent_lprimen_t50_or_low_frequency_impact_outputs_without_source_formula_or_bound_evidence",
    "reopen_GDMTXA04A_C11c_raw_bare_open_box_open_web_heavy_concrete_timber_stud_or_clt_wall",
    "resume_productization_route_integration_before_ui_input_output_honesty_closes"
  ]
} as const;

describe("post floor fallback low-confidence Gate C next slice selection contract", () => {
  it("closes the floor fallback slice and selects UI input/output honesty next", () => {
    expect(POST_FLOOR_FALLBACK_LOW_CONFIDENCE_GATE_C_NEXT_SLICE_SELECTION).toEqual({
      sliceId: "post_floor_fallback_low_confidence_gate_c_next_slice_selection_v1",
      closedImplementationSlice: "floor_fallback_low_confidence_cleanup_v1",
      latestLandedGate: "floor_fallback_low_confidence_cleanup_v1_gate_c_no_runtime_closeout",
      selectedImplementationSlice: "ui_input_output_honesty_v1",
      selectedPlanningSurface: "docs/calculator/SLICE_UI_INPUT_OUTPUT_HONESTY_PLAN.md",
      selectedRouteFamily: "workbench_input_output_honesty_and_support_visibility",
      selectionStatus:
        "selected_after_floor_fallback_promotion_blocked_and_low_confidence_posture_pinned",
      numericRuntimeBehaviorChange: false,
      runtimeWidening: false,
      nextExecutionAction:
        "gate_a_inventory_required_inputs_output_support_origin_confidence_and_edit_stability_no_runtime_change"
    });

    for (const path of [
      POST_FLOOR_FALLBACK_LOW_CONFIDENCE_GATE_C_NEXT_SLICE_SELECTION.selectedPlanningSurface,
      "docs/calculator/CHECKPOINT_2026-04-27_FLOOR_FALLBACK_LOW_CONFIDENCE_GATE_C_CLOSEOUT_HANDOFF.md",
      "docs/calculator/PERSONAL_USE_READINESS_ROADMAP.md"
    ]) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("ties closeout to the landed no-runtime floor fallback evidence", () => {
    expect(FLOOR_FALLBACK_GATE_C_CLOSEOUT_EVIDENCE.posture).toBe(
      "no_runtime_gate_a_audit_plus_gate_b_source_formula_decision_closed"
    );
    expect(FLOOR_FALLBACK_GATE_C_CLOSEOUT_EVIDENCE.closedBecause).toEqual([
      "selected_stack_has_no_exact_pliteq_source_topology",
      "selected_stack_has_no_ubiq_fl32_bound_source_topology",
      "selected_stack_has_no_bounded_steel_open_web_family_rule",
      "unsupported_lprimen_t50_lnw_plus_ci_and_delta_lw_are_already_explicit",
      "low_confidence_engine_and_web_posture_is_already_visible"
    ]);
    expect(FLOOR_FALLBACK_GATE_C_CLOSEOUT_EVIDENCE.keptRuntimePosture).toEqual({
      evidenceTier: "screening",
      estimateKind: "low_confidence",
      fitPercent: 28,
      generatedCaseId: "floor-steel-fallback",
      impactBasis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
      lnW: 58.3,
      lPrimeNTw: 58.5,
      lPrimeNW: 61.3,
      originBasisId: "predictor_floor_system_low_confidence_estimate",
      rwPrimeDb: 70,
      supportedFieldOutputs: ["Rw", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"],
      unsupportedFieldOutputs: ["L'nT,50"]
    });
  });

  it("selects UI input/output honesty because calculation readiness now depends on visible support posture", () => {
    expect(SELECTED_UI_INPUT_OUTPUT_HONESTY_EVIDENCE.selectedBecause).toEqual([
      "the_remaining_personal_use_gap_is_not_a_new_formula_before_the_ui_shows_existing_engine_honesty",
      "missing_inputs_must_tell_the_user_what_to_enter_next_for_wall_and_floor_routes",
      "output_cards_must_distinguish_exact_benchmark_formula_family_screening_bound_unsupported_and_fail_closed_values",
      "origin_confidence_and_unsupported_output_messages_must_survive_layer_edits_reorder_many_layers_and_save_load",
      "private_use_readiness_requires_visible_support_posture_for_common_stacks_before_productization_resumes"
    ]);
    expect(SELECTED_UI_INPUT_OUTPUT_HONESTY_EVIDENCE.firstGate).toBe(
      "gate_a_inventory_required_inputs_output_support_origin_confidence_and_edit_stability_no_runtime_change"
    );
    expect(SELECTED_UI_INPUT_OUTPUT_HONESTY_EVIDENCE.deferredButNotCancelled).toContain(
      "project_access_policy_route_integration_v1"
    );
  });

  it("keeps source-family, unsupported-output, and productization boundaries closed", () => {
    expect(ACTIVE_BOUNDARIES.disallowedMoves).toEqual([
      "change_floor_steel_fallback_runtime_values_during_ui_honesty_gate_a",
      "hide_low_confidence_screening_bound_or_unsupported_posture_behind_generic_estimated_labels",
      "invent_lprimen_t50_or_low_frequency_impact_outputs_without_source_formula_or_bound_evidence",
      "reopen_GDMTXA04A_C11c_raw_bare_open_box_open_web_heavy_concrete_timber_stud_or_clt_wall",
      "resume_productization_route_integration_before_ui_input_output_honesty_closes"
    ]);
  });
});
