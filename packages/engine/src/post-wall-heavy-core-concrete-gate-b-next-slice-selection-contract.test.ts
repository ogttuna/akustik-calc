import { existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const POST_WALL_HEAVY_CORE_CONCRETE_GATE_B_NEXT_SLICE_SELECTION = {
  sliceId: "post_wall_heavy_core_concrete_gate_b_next_slice_selection_v1",
  parentSlice: "realistic_layer_combination_coverage_cartography_v1",
  closedImplementationSlice: "wall_heavy_core_concrete_gate_b_v1",
  latestLandedGate: "wall_heavy_core_concrete_gate_b_no_runtime_closeout",
  selectedImplementationSlice: "wall_timber_stud_clt_accuracy_pass_v1",
  selectedPlanningSurface: "docs/calculator/SLICE_WALL_TIMBER_STUD_CLT_ACCURACY_PASS_PLAN.md",
  selectedRouteFamily: "common_wall_timber_stud_and_clt_formula_accuracy",
  selectionStatus: "selected_after_heavy_core_screening_lane_closed_no_runtime_without_source_row",
  numericRuntimeBehaviorChange: false,
  runtimeWidening: false,
  nextExecutionAction:
    "gate_a_audit_timber_stud_and_clt_wall_formula_lanes_before_exact_family_or_formula_promotion"
} as const;

const CLOSED_HEAVY_CORE_CONCRETE_GATE_B_EVIDENCE = {
  posture: "no_runtime_source_formula_audit_and_closeout",
  closedBecause: [
    "selected_concrete_lining_stack_has_no_exact_verified_airborne_catalog_match",
    "selected_concrete_lining_stack_has_no_lab_fallback_verified_match",
    "current_audit_found_no_direct_external_benchmark_match_or_topology_specific_tolerance",
    "local_mass_law_iso717_field_normalization_components_are_formula_parts_not_stack_specific_source_truth",
    "retuning_from_selector_workbench_or_deep_hybrid_green_tests_would_overstate_accuracy"
  ],
  keptRuntimePosture: {
    evidenceTier: "screening",
    fieldRwPrimeDb: 55,
    generatedCaseId: "wall-screening-concrete",
    supportedFieldOutputs: ["R'w", "Dn,w", "DnT,w", "DnT,A"]
  },
  executableProof: [
    "packages/engine/src/wall-heavy-core-concrete-gate-b-audit-contract.test.ts",
    "packages/engine/src/realistic-layer-combination-coverage-cartography.test.ts"
  ]
} as const;

const SELECTED_TIMBER_CLT_ACCURACY_PASS_EVIDENCE = {
  candidateOrderAfterHeavyCoreCloseout: [
    "wall.timber_stud_formula.field",
    "wall.clt_formula.field",
    "floor.steel_fallback_low_confidence.field"
  ],
  selectedBecause: [
    "timber_stud_and_clt_are_common_wall_topologies_in_the_personal_use_readiness_chain",
    "both_lanes_are_currently_formula_owned_or_family_adjacent_rather_than_exact_for_the_live_generated_cases",
    "existing_timber_source_corpus_must_not_bleed_exact_rows_into_unmatched_live_topologies",
    "clt_wall_formula_lane_should_be_audited_separately_from_floor_clt_source_truth",
    "this_pass_can_improve_accuracy_honesty_before_lower_priority_floor_fallback_cleanup"
  ],
  firstGate: "gate_a_source_formula_surface_audit_no_runtime_change"
} as const;

const ACTIVE_BOUNDARIES = {
  disallowedMoves: [
    "promote_heavy_core_concrete_screening_lane_without_new_source_or_bounded_family_rule",
    "retune_live_timber_stud_formula_from_direct_or_resilient_timber_exact_rows_by_adjacency",
    "claim_clt_wall_exactness_from_floor_clt_source_truth",
    "reopen_GDMTXA04A_C11c_raw_bare_open_box_open_web_or_wall_selector_blocked_sources",
    "resume_productization_route_integration_before_the_calculator_readiness_chain_closes"
  ]
} as const;

describe("post wall heavy-core concrete Gate B next slice selection contract", () => {
  it("closes heavy-core concrete Gate B no-runtime and selects timber stud plus CLT wall accuracy next", () => {
    expect(POST_WALL_HEAVY_CORE_CONCRETE_GATE_B_NEXT_SLICE_SELECTION).toEqual({
      sliceId: "post_wall_heavy_core_concrete_gate_b_next_slice_selection_v1",
      parentSlice: "realistic_layer_combination_coverage_cartography_v1",
      closedImplementationSlice: "wall_heavy_core_concrete_gate_b_v1",
      latestLandedGate: "wall_heavy_core_concrete_gate_b_no_runtime_closeout",
      selectedImplementationSlice: "wall_timber_stud_clt_accuracy_pass_v1",
      selectedPlanningSurface: "docs/calculator/SLICE_WALL_TIMBER_STUD_CLT_ACCURACY_PASS_PLAN.md",
      selectedRouteFamily: "common_wall_timber_stud_and_clt_formula_accuracy",
      selectionStatus: "selected_after_heavy_core_screening_lane_closed_no_runtime_without_source_row",
      numericRuntimeBehaviorChange: false,
      runtimeWidening: false,
      nextExecutionAction:
        "gate_a_audit_timber_stud_and_clt_wall_formula_lanes_before_exact_family_or_formula_promotion"
    });

    for (const path of [
      POST_WALL_HEAVY_CORE_CONCRETE_GATE_B_NEXT_SLICE_SELECTION.selectedPlanningSurface,
      "docs/calculator/CHECKPOINT_2026-04-27_WALL_HEAVY_CORE_CONCRETE_GATE_B_CLOSEOUT_HANDOFF.md",
      "docs/calculator/PERSONAL_USE_READINESS_ROADMAP.md"
    ]) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("ties the no-runtime closeout to the explicit source/formula blocker", () => {
    expect(CLOSED_HEAVY_CORE_CONCRETE_GATE_B_EVIDENCE.posture).toBe(
      "no_runtime_source_formula_audit_and_closeout"
    );
    expect(CLOSED_HEAVY_CORE_CONCRETE_GATE_B_EVIDENCE.closedBecause).toEqual([
      "selected_concrete_lining_stack_has_no_exact_verified_airborne_catalog_match",
      "selected_concrete_lining_stack_has_no_lab_fallback_verified_match",
      "current_audit_found_no_direct_external_benchmark_match_or_topology_specific_tolerance",
      "local_mass_law_iso717_field_normalization_components_are_formula_parts_not_stack_specific_source_truth",
      "retuning_from_selector_workbench_or_deep_hybrid_green_tests_would_overstate_accuracy"
    ]);
    expect(CLOSED_HEAVY_CORE_CONCRETE_GATE_B_EVIDENCE.keptRuntimePosture).toEqual({
      evidenceTier: "screening",
      fieldRwPrimeDb: 55,
      generatedCaseId: "wall-screening-concrete",
      supportedFieldOutputs: ["R'w", "Dn,w", "DnT,w", "DnT,A"]
    });
  });

  it("selects the timber stud plus CLT pass because it is the next personal-use accuracy bottleneck", () => {
    expect(SELECTED_TIMBER_CLT_ACCURACY_PASS_EVIDENCE.candidateOrderAfterHeavyCoreCloseout).toEqual([
      "wall.timber_stud_formula.field",
      "wall.clt_formula.field",
      "floor.steel_fallback_low_confidence.field"
    ]);
    expect(SELECTED_TIMBER_CLT_ACCURACY_PASS_EVIDENCE.selectedBecause).toEqual([
      "timber_stud_and_clt_are_common_wall_topologies_in_the_personal_use_readiness_chain",
      "both_lanes_are_currently_formula_owned_or_family_adjacent_rather_than_exact_for_the_live_generated_cases",
      "existing_timber_source_corpus_must_not_bleed_exact_rows_into_unmatched_live_topologies",
      "clt_wall_formula_lane_should_be_audited_separately_from_floor_clt_source_truth",
      "this_pass_can_improve_accuracy_honesty_before_lower_priority_floor_fallback_cleanup"
    ]);
    expect(SELECTED_TIMBER_CLT_ACCURACY_PASS_EVIDENCE.firstGate).toBe(
      "gate_a_source_formula_surface_audit_no_runtime_change"
    );
  });

  it("keeps source, exact-row, and productization boundaries closed for the new slice", () => {
    expect(ACTIVE_BOUNDARIES.disallowedMoves).toEqual([
      "promote_heavy_core_concrete_screening_lane_without_new_source_or_bounded_family_rule",
      "retune_live_timber_stud_formula_from_direct_or_resilient_timber_exact_rows_by_adjacency",
      "claim_clt_wall_exactness_from_floor_clt_source_truth",
      "reopen_GDMTXA04A_C11c_raw_bare_open_box_open_web_or_wall_selector_blocked_sources",
      "resume_productization_route_integration_before_the_calculator_readiness_chain_closes"
    ]);
  });
});
