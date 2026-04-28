import { existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const POST_WALL_DOUBLE_LEAF_SHARP_DAVY_GATE_C_NEXT_SLICE_SELECTION = {
  sliceId: "post_wall_double_leaf_sharp_davy_scoping_v1_next_slice_selection",
  closedImplementationSlice: "wall_double_leaf_sharp_davy_scoping_v1",
  latestLandedGate: "wall_double_leaf_sharp_davy_scoping_v1_gate_b_no_runtime_source_tolerance_matrix",
  selectedImplementationSlice: "wall_double_leaf_source_evidence_acquisition_v1",
  selectedPlanningSurface: "docs/calculator/SLICE_WALL_DOUBLE_LEAF_SOURCE_EVIDENCE_ACQUISITION_PLAN.md",
  selectedRouteFamily: "wall_double_leaf_stud_cavity_source_tolerance_evidence",
  selectionStatus:
    "selected_source_evidence_slice_after_runtime_movement_blocked_by_missing_double_leaf_tolerance_basis",
  numericRuntimeBehaviorChange: false,
  runtimeWidening: false,
  routeCardWorkRequiredNow: false,
  nextExecutionAction:
    "gate_a_collect_double_leaf_stud_cavity_source_and_tolerance_pack_no_runtime_change"
} as const;

const WALL_DOUBLE_LEAF_CLOSEOUT_EVIDENCE = {
  posture: "no_runtime_gate_a_inventory_plus_gate_b_source_tolerance_matrix_closed",
  closedBecause: [
    "gate_a_pinned_current_double_leaf_single_stud_double_stud_values_and_negative_boundaries",
    "gate_b_proved_no_exact_or_lab_fallback_source_row_for_the_positive_candidates",
    "gate_b_found_no_benchmark_envelope_formula_tolerance_owner_or_bounded_family_rule",
    "web_route_card_work_is_not_required_because_no_visible_output_support_confidence_evidence_or_missing_input_copy_changed"
  ],
  keptRuntimePosture: {
    doubleStudSplitCavityWithMetadata: {
      confidence: "medium",
      evidenceTier: "formula",
      family: "double_stud_system",
      fieldRwPrimeDb: 52,
      strategy: "double_stud_surrogate_blend+double_stud_calibration"
    },
    emptyDoubleLeaf: {
      confidence: "medium",
      evidenceTier: "formula",
      family: "double_leaf",
      fieldRwPrimeDb: 46,
      strategy: "double_leaf_empty_cavity_delegate"
    },
    porousDoubleLeafNoStudMetadata: {
      confidence: "low",
      evidenceTier: "formula",
      family: "double_leaf",
      fieldRwPrimeDb: 41,
      strategy: "double_leaf_porous_fill_corrected"
    },
    singleStudWithMetadata: {
      confidence: "low",
      evidenceTier: "formula",
      family: "stud_wall_system",
      fieldRwPrimeDb: 37,
      strategy: "stud_surrogate_blend+framed_wall_calibration"
    }
  },
  executableProof: [
    "packages/engine/src/wall-double-leaf-sharp-davy-scoping-gate-a-contract.test.ts",
    "packages/engine/src/wall-double-leaf-sharp-davy-scoping-gate-b-contract.test.ts",
    "docs/calculator/CHECKPOINT_2026-04-28_WALL_DOUBLE_LEAF_SHARP_DAVY_GATE_B_HANDOFF.md"
  ]
} as const;

const NEXT_SLICE_SELECTION_MATRIX = [
  {
    id: "wall_double_leaf_source_evidence_acquisition_v1",
    selectedNext: true,
    runtimeWideningEligibleNow: false,
    reason:
      "gate_b_identified_specific_double_leaf_stud_cavity_source_and_tolerance_blockers_for_common_wall_combinations"
  },
  {
    id: "direct_double_leaf_or_stud_runtime_retune",
    selectedNext: false,
    runtimeWideningEligibleNow: false,
    reason:
      "gate_b_blocked_runtime_movement_without_a_source_row_benchmark_envelope_formula_tolerance_owner_or_bounded_family_rule"
  },
  {
    id: "blocked_floor_source_reopens",
    selectedNext: false,
    runtimeWideningEligibleNow: false,
    reason:
      "gdmtxa04a_c11c_and_raw_bare_open_box_open_web_stay_fail_closed_without_new_external_source_evidence"
  },
  {
    id: "remaining_dynamic_airborne_recursive_guard_carves",
    selectedNext: false,
    runtimeWideningEligibleNow: false,
    reason:
      "architecture_backlog_is_optional_because_c6_is_closed_and_dynamic_airborne_ts_is_below_the_2000_line_threshold"
  },
  {
    id: "productization_route_policy_or_reporting",
    selectedNext: false,
    runtimeWideningEligibleNow: false,
    reason:
      "productization_slices_are_closed_or_deferred_while_the_user_priority_is_calculator_scope_and_accuracy"
  }
] as const;

const SELECTED_SOURCE_EVIDENCE_GATE_A_CONTRACT = {
  firstGate: "gate_a_double_leaf_stud_cavity_source_tolerance_inventory",
  runtimeBehaviorChange: false,
  requiredInventory: [
    "empty_double_leaf_cavity_source_or_formula_tolerance_candidates",
    "porous_filled_double_leaf_source_or_formula_tolerance_candidates",
    "single_stud_lightweight_wall_source_or_formula_tolerance_candidates",
    "double_stud_split_cavity_source_or_formula_tolerance_candidates",
    "negative_boundaries_for_exact_catalog_resilient_timber_single_leaf_lined_massive_clt_direct_coupled_and_triple_leaf_shapes",
    "source_acceptance_rules_for_direct_stack_rows_family_benchmarks_formula_tolerances_and_rejected_broad_corridors"
  ],
  requiredSourceFields: [
    "source_label_and_url_or_local_path",
    "assembly_layers_with_thickness_density_surface_mass_and_mounting",
    "reported_rw_or_spectrum_and_context",
    "cavity_depth_fill_type_stud_type_stud_spacing_and_coupling",
    "declared_tolerance_or_benchmark_fit_threshold",
    "import_decision_accept_bounded_or_reject"
  ],
  allowedAfterGateA:
    "select_bounded_gate_b_import_or_close_no_runtime_if_evidence_is_too_broad_for_value_movement"
} as const;

const ACTIVE_BOUNDARIES = {
  disallowedMoves: [
    "change_double_leaf_or_stud_wall_runtime_values_during_gate_c_closeout",
    "promote_gate_b_formula_values_to_benchmark_or_exact_without_source_evidence",
    "use_floor_clt_or_floor_impact_rows_as_wall_double_leaf_truth",
    "merge_direct_coupled_or_triple_leaf_shapes_into_decoupled_double_leaf",
    "reopen_GDMTXA04A_C11c_raw_bare_open_box_open_web_wall_selector_or_heavy_concrete_from_nearby_green_tests",
    "resume_productization_before_the_selected_calculator_source_evidence_slice_closes"
  ]
} as const;

describe("post wall double-leaf Sharp/Davy scoping next-slice selection contract", () => {
  it("closes the double-leaf Sharp/Davy scoping slice no-runtime and selects source evidence acquisition", () => {
    expect(POST_WALL_DOUBLE_LEAF_SHARP_DAVY_GATE_C_NEXT_SLICE_SELECTION).toEqual({
      sliceId: "post_wall_double_leaf_sharp_davy_scoping_v1_next_slice_selection",
      closedImplementationSlice: "wall_double_leaf_sharp_davy_scoping_v1",
      latestLandedGate: "wall_double_leaf_sharp_davy_scoping_v1_gate_b_no_runtime_source_tolerance_matrix",
      selectedImplementationSlice: "wall_double_leaf_source_evidence_acquisition_v1",
      selectedPlanningSurface: "docs/calculator/SLICE_WALL_DOUBLE_LEAF_SOURCE_EVIDENCE_ACQUISITION_PLAN.md",
      selectedRouteFamily: "wall_double_leaf_stud_cavity_source_tolerance_evidence",
      selectionStatus:
        "selected_source_evidence_slice_after_runtime_movement_blocked_by_missing_double_leaf_tolerance_basis",
      numericRuntimeBehaviorChange: false,
      runtimeWidening: false,
      routeCardWorkRequiredNow: false,
      nextExecutionAction:
        "gate_a_collect_double_leaf_stud_cavity_source_and_tolerance_pack_no_runtime_change"
    });

    for (const path of [
      POST_WALL_DOUBLE_LEAF_SHARP_DAVY_GATE_C_NEXT_SLICE_SELECTION.selectedPlanningSurface,
      "docs/calculator/CHECKPOINT_2026-04-28_WALL_DOUBLE_LEAF_SHARP_DAVY_GATE_B_HANDOFF.md",
      "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
      "docs/calculator/CURRENT_STATE.md"
    ]) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("ties the closeout to the landed Gate A and Gate B evidence without changing runtime", () => {
    expect(WALL_DOUBLE_LEAF_CLOSEOUT_EVIDENCE.posture).toBe(
      "no_runtime_gate_a_inventory_plus_gate_b_source_tolerance_matrix_closed"
    );
    expect(WALL_DOUBLE_LEAF_CLOSEOUT_EVIDENCE.closedBecause).toEqual([
      "gate_a_pinned_current_double_leaf_single_stud_double_stud_values_and_negative_boundaries",
      "gate_b_proved_no_exact_or_lab_fallback_source_row_for_the_positive_candidates",
      "gate_b_found_no_benchmark_envelope_formula_tolerance_owner_or_bounded_family_rule",
      "web_route_card_work_is_not_required_because_no_visible_output_support_confidence_evidence_or_missing_input_copy_changed"
    ]);
    expect(WALL_DOUBLE_LEAF_CLOSEOUT_EVIDENCE.keptRuntimePosture).toEqual({
      doubleStudSplitCavityWithMetadata: {
        confidence: "medium",
        evidenceTier: "formula",
        family: "double_stud_system",
        fieldRwPrimeDb: 52,
        strategy: "double_stud_surrogate_blend+double_stud_calibration"
      },
      emptyDoubleLeaf: {
        confidence: "medium",
        evidenceTier: "formula",
        family: "double_leaf",
        fieldRwPrimeDb: 46,
        strategy: "double_leaf_empty_cavity_delegate"
      },
      porousDoubleLeafNoStudMetadata: {
        confidence: "low",
        evidenceTier: "formula",
        family: "double_leaf",
        fieldRwPrimeDb: 41,
        strategy: "double_leaf_porous_fill_corrected"
      },
      singleStudWithMetadata: {
        confidence: "low",
        evidenceTier: "formula",
        family: "stud_wall_system",
        fieldRwPrimeDb: 37,
        strategy: "stud_surrogate_blend+framed_wall_calibration"
      }
    });

    for (const path of WALL_DOUBLE_LEAF_CLOSEOUT_EVIDENCE.executableProof) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("selects source-evidence acquisition because it is the only defensible next wall-accuracy move", () => {
    expect(NEXT_SLICE_SELECTION_MATRIX.filter((candidate) => candidate.selectedNext)).toEqual([
      {
        id: "wall_double_leaf_source_evidence_acquisition_v1",
        selectedNext: true,
        runtimeWideningEligibleNow: false,
        reason:
          "gate_b_identified_specific_double_leaf_stud_cavity_source_and_tolerance_blockers_for_common_wall_combinations"
      }
    ]);
    expect(NEXT_SLICE_SELECTION_MATRIX.every((candidate) => !candidate.runtimeWideningEligibleNow)).toBe(true);
  });

  it("locks the Gate A acceptance contract for the selected source-evidence slice", () => {
    expect(SELECTED_SOURCE_EVIDENCE_GATE_A_CONTRACT).toEqual({
      firstGate: "gate_a_double_leaf_stud_cavity_source_tolerance_inventory",
      runtimeBehaviorChange: false,
      requiredInventory: [
        "empty_double_leaf_cavity_source_or_formula_tolerance_candidates",
        "porous_filled_double_leaf_source_or_formula_tolerance_candidates",
        "single_stud_lightweight_wall_source_or_formula_tolerance_candidates",
        "double_stud_split_cavity_source_or_formula_tolerance_candidates",
        "negative_boundaries_for_exact_catalog_resilient_timber_single_leaf_lined_massive_clt_direct_coupled_and_triple_leaf_shapes",
        "source_acceptance_rules_for_direct_stack_rows_family_benchmarks_formula_tolerances_and_rejected_broad_corridors"
      ],
      requiredSourceFields: [
        "source_label_and_url_or_local_path",
        "assembly_layers_with_thickness_density_surface_mass_and_mounting",
        "reported_rw_or_spectrum_and_context",
        "cavity_depth_fill_type_stud_type_stud_spacing_and_coupling",
        "declared_tolerance_or_benchmark_fit_threshold",
        "import_decision_accept_bounded_or_reject"
      ],
      allowedAfterGateA:
        "select_bounded_gate_b_import_or_close_no_runtime_if_evidence_is_too_broad_for_value_movement"
    });
  });

  it("keeps source-family, runtime-retune, and productization boundaries closed", () => {
    expect(ACTIVE_BOUNDARIES.disallowedMoves).toEqual([
      "change_double_leaf_or_stud_wall_runtime_values_during_gate_c_closeout",
      "promote_gate_b_formula_values_to_benchmark_or_exact_without_source_evidence",
      "use_floor_clt_or_floor_impact_rows_as_wall_double_leaf_truth",
      "merge_direct_coupled_or_triple_leaf_shapes_into_decoupled_double_leaf",
      "reopen_GDMTXA04A_C11c_raw_bare_open_box_open_web_wall_selector_or_heavy_concrete_from_nearby_green_tests",
      "resume_productization_before_the_selected_calculator_source_evidence_slice_closes"
    ]);
  });
});
