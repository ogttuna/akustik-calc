import { existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const POST_WALL_SINGLE_LEAF_MASS_LAW_GATE_C_NEXT_SLICE_SELECTION = {
  sliceId: "post_wall_single_leaf_mass_law_calibration_v1_next_slice_selection",
  closedImplementationSlice: "wall_single_leaf_mass_law_calibration_v1",
  latestLandedGate: "wall_single_leaf_mass_law_calibration_v1_gate_b_no_runtime_candidate_matrix",
  selectedImplementationSlice: "wall_double_leaf_sharp_davy_scoping_v1",
  selectedPlanningSurface: "docs/calculator/SLICE_WALL_DOUBLE_LEAF_SHARP_DAVY_SCOPING_PLAN.md",
  selectedRouteFamily: "wall_double_leaf_stud_cavity_formula_scoping",
  selectionStatus:
    "selected_after_single_leaf_runtime_movement_blocked_by_missing_source_or_tolerance",
  numericRuntimeBehaviorChange: false,
  runtimeWidening: false,
  nextExecutionAction:
    "gate_a_scope_sharp_davy_double_leaf_cavity_applicability_and_guardrails_no_runtime_change"
} as const;

const WALL_SINGLE_LEAF_CLOSEOUT_EVIDENCE = {
  posture: "no_runtime_gate_a_source_formula_contract_plus_gate_b_candidate_matrix_closed",
  closedBecause: [
    "gate_a_proved_exact_lab_fallback_precedence_and_adjacent_lane_boundaries",
    "gate_b_pinned_concrete_solid_brick_and_generic_aac_current_values",
    "generic_concrete_has_formula_basis_but_no_stack_specific_wall_source_or_tolerance_pack",
    "generic_solid_brick_has_family_benchmark_context_but_no_direct_generic_source_row",
    "generic_aac_has_named_aircrete_benchmark_context_but_no_direct_generic_placeholder_source_row"
  ],
  keptRuntimePosture: {
    concrete150: {
      confidence: "high",
      evidenceTier: "formula",
      family: "rigid_massive_wall",
      fieldRwPrimeDb: 53
    },
    genericAac150: {
      confidence: "medium",
      evidenceTier: "formula",
      family: "masonry_nonhomogeneous",
      fieldRwPrimeDb: 38
    },
    solidBrick150: {
      confidence: "medium",
      evidenceTier: "formula",
      family: "masonry_nonhomogeneous",
      fieldRwPrimeDb: 51
    }
  },
  executableProof: [
    "packages/engine/src/wall-single-leaf-mass-law-calibration-gate-a-contract.test.ts",
    "packages/engine/src/wall-single-leaf-mass-law-calibration-gate-b-contract.test.ts"
  ]
} as const;

const SELECTED_DOUBLE_LEAF_SCOPING_EVIDENCE = {
  selectedBecause: [
    "wall_coverage_expansion_planning_v2_ranked_double_leaf_after_single_leaf",
    "stud_double_leaf_and_cavity_walls_are_common_private_use_wall_combinations",
    "single_leaf_value_movement_is_blocked_without_new_source_or_tolerance",
    "double_leaf_lane_needs_sharp_vs_davy_applicability_cavity_fill_stud_metadata_and_triple_leaf_negative_cases_before_runtime_changes",
    "selection_preserves_closed_source_boundaries_instead_of_reopening_them_from_nearby_green_tests"
  ],
  firstGate:
    "gate_a_scope_sharp_davy_double_leaf_cavity_applicability_and_guardrails_no_runtime_change",
  requiredSurfaces: [
    "docs/calculator/SLICE_WALL_COVERAGE_EXPANSION_PLANNING_V2_PLAN.md",
    "packages/engine/src/dynamic-airborne.ts",
    "packages/engine/src/dynamic-airborne-cavity-topology.ts",
    "packages/engine/src/dynamic-airborne-framed-wall.ts",
    "packages/engine/src/airborne-framed-wall-benchmark.test.ts",
    "packages/engine/src/dynamic-airborne-order-sensitivity.test.ts",
    "apps/web/features/workbench/dynamic-route-family-boundary-scan.test.ts"
  ]
} as const;

const GATE_A_ACCEPTANCE_CONTRACT = {
  runtimeBehaviorChange: false,
  requiredInventory: [
    "current_double_leaf_empty_and_filled_cavity_outputs",
    "current_stud_wall_and_double_stud_outputs",
    "sharp_vs_davy_delegate_ownership",
    "cavity_fill_and_stud_metadata_requirements",
    "triple_leaf_direct_coupled_and_exact_catalog_negative_boundaries",
    "web_route_card_surfaces_required_if_values_support_confidence_or_evidence_text_move"
  ],
  allowedAfterGateA:
    "select_bounded_gate_b_matrix_or_close_no_runtime_if_formula_source_or_tolerance_evidence_is_insufficient"
} as const;

const ACTIVE_BOUNDARIES = {
  disallowedMoves: [
    "retune_generic_single_leaf_wall_values_without_new_source_or_tolerance_pack",
    "change_double_leaf_or_stud_wall_runtime_values_during_gate_a_scoping",
    "promote_heavy_core_timber_stud_clt_or_floor_fallback_from_nearby_green_tests",
    "borrow_dataholz_floor_clt_rows_as_wall_clt_truth",
    "reopen_GDMTXA04A_C11c_raw_bare_open_box_open_web_or_wall_selector_blocked_sources",
    "resume_productization_before_the_selected_calculator_slice_closes"
  ]
} as const;

describe("post wall single-leaf mass-law calibration next-slice selection contract", () => {
  it("closes the single-leaf mass-law slice and selects double-leaf scoping next", () => {
    expect(POST_WALL_SINGLE_LEAF_MASS_LAW_GATE_C_NEXT_SLICE_SELECTION).toEqual({
      sliceId: "post_wall_single_leaf_mass_law_calibration_v1_next_slice_selection",
      closedImplementationSlice: "wall_single_leaf_mass_law_calibration_v1",
      latestLandedGate: "wall_single_leaf_mass_law_calibration_v1_gate_b_no_runtime_candidate_matrix",
      selectedImplementationSlice: "wall_double_leaf_sharp_davy_scoping_v1",
      selectedPlanningSurface:
        "docs/calculator/SLICE_WALL_DOUBLE_LEAF_SHARP_DAVY_SCOPING_PLAN.md",
      selectedRouteFamily: "wall_double_leaf_stud_cavity_formula_scoping",
      selectionStatus:
        "selected_after_single_leaf_runtime_movement_blocked_by_missing_source_or_tolerance",
      numericRuntimeBehaviorChange: false,
      runtimeWidening: false,
      nextExecutionAction:
        "gate_a_scope_sharp_davy_double_leaf_cavity_applicability_and_guardrails_no_runtime_change"
    });

    for (const path of [
      POST_WALL_SINGLE_LEAF_MASS_LAW_GATE_C_NEXT_SLICE_SELECTION.selectedPlanningSurface,
      "docs/calculator/CHECKPOINT_2026-04-27_WALL_SINGLE_LEAF_MASS_LAW_GATE_C_CLOSEOUT_HANDOFF.md",
      "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
      "docs/calculator/CURRENT_STATE.md"
    ]) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("ties the closeout to the landed no-runtime Gate A and Gate B evidence", () => {
    expect(WALL_SINGLE_LEAF_CLOSEOUT_EVIDENCE.posture).toBe(
      "no_runtime_gate_a_source_formula_contract_plus_gate_b_candidate_matrix_closed"
    );
    expect(WALL_SINGLE_LEAF_CLOSEOUT_EVIDENCE.closedBecause).toEqual([
      "gate_a_proved_exact_lab_fallback_precedence_and_adjacent_lane_boundaries",
      "gate_b_pinned_concrete_solid_brick_and_generic_aac_current_values",
      "generic_concrete_has_formula_basis_but_no_stack_specific_wall_source_or_tolerance_pack",
      "generic_solid_brick_has_family_benchmark_context_but_no_direct_generic_source_row",
      "generic_aac_has_named_aircrete_benchmark_context_but_no_direct_generic_placeholder_source_row"
    ]);
    expect(WALL_SINGLE_LEAF_CLOSEOUT_EVIDENCE.keptRuntimePosture).toEqual({
      concrete150: {
        confidence: "high",
        evidenceTier: "formula",
        family: "rigid_massive_wall",
        fieldRwPrimeDb: 53
      },
      genericAac150: {
        confidence: "medium",
        evidenceTier: "formula",
        family: "masonry_nonhomogeneous",
        fieldRwPrimeDb: 38
      },
      solidBrick150: {
        confidence: "medium",
        evidenceTier: "formula",
        family: "masonry_nonhomogeneous",
        fieldRwPrimeDb: 51
      }
    });

    for (const path of WALL_SINGLE_LEAF_CLOSEOUT_EVIDENCE.executableProof) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("selects double-leaf scoping because it is the next common wall coverage gap", () => {
    expect(SELECTED_DOUBLE_LEAF_SCOPING_EVIDENCE.selectedBecause).toEqual([
      "wall_coverage_expansion_planning_v2_ranked_double_leaf_after_single_leaf",
      "stud_double_leaf_and_cavity_walls_are_common_private_use_wall_combinations",
      "single_leaf_value_movement_is_blocked_without_new_source_or_tolerance",
      "double_leaf_lane_needs_sharp_vs_davy_applicability_cavity_fill_stud_metadata_and_triple_leaf_negative_cases_before_runtime_changes",
      "selection_preserves_closed_source_boundaries_instead_of_reopening_them_from_nearby_green_tests"
    ]);
    expect(SELECTED_DOUBLE_LEAF_SCOPING_EVIDENCE.firstGate).toBe(
      "gate_a_scope_sharp_davy_double_leaf_cavity_applicability_and_guardrails_no_runtime_change"
    );

    for (const path of SELECTED_DOUBLE_LEAF_SCOPING_EVIDENCE.requiredSurfaces) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("locks the no-runtime Gate A acceptance contract for the selected double-leaf slice", () => {
    expect(GATE_A_ACCEPTANCE_CONTRACT).toEqual({
      runtimeBehaviorChange: false,
      requiredInventory: [
        "current_double_leaf_empty_and_filled_cavity_outputs",
        "current_stud_wall_and_double_stud_outputs",
        "sharp_vs_davy_delegate_ownership",
        "cavity_fill_and_stud_metadata_requirements",
        "triple_leaf_direct_coupled_and_exact_catalog_negative_boundaries",
        "web_route_card_surfaces_required_if_values_support_confidence_or_evidence_text_move"
      ],
      allowedAfterGateA:
        "select_bounded_gate_b_matrix_or_close_no_runtime_if_formula_source_or_tolerance_evidence_is_insufficient"
    });
  });

  it("keeps source-family, runtime-retune, and productization boundaries closed", () => {
    expect(ACTIVE_BOUNDARIES.disallowedMoves).toEqual([
      "retune_generic_single_leaf_wall_values_without_new_source_or_tolerance_pack",
      "change_double_leaf_or_stud_wall_runtime_values_during_gate_a_scoping",
      "promote_heavy_core_timber_stud_clt_or_floor_fallback_from_nearby_green_tests",
      "borrow_dataholz_floor_clt_rows_as_wall_clt_truth",
      "reopen_GDMTXA04A_C11c_raw_bare_open_box_open_web_or_wall_selector_blocked_sources",
      "resume_productization_before_the_selected_calculator_slice_closes"
    ]);
  });
});
