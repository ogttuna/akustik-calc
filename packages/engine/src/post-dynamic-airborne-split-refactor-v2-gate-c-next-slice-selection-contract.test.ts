import { describe, expect, it } from "vitest";

const POST_DYNAMIC_AIRBORNE_SPLIT_V2_GATE_C_NEXT_SLICE_SELECTION = {
  sliceId: "post_dynamic_airborne_split_refactor_v2_gate_c_next_slice_selection_v1",
  closedImplementationSlice: "dynamic_airborne_split_refactor_v2",
  latestLandedGate: "dynamic_airborne_split_refactor_v2_gate_c_closeout",
  selectedImplementationSlice: "realistic_layer_combination_coverage_cartography_v1",
  selectedPlanningSurface: "docs/calculator/SLICE_REALISTIC_LAYER_COMBINATION_COVERAGE_CARTOGRAPHY_PLAN.md",
  selectedRouteFamily: "realistic_layer_combination_coverage_cartography",
  nextExecutionAction:
    "create_executable_realistic_floor_wall_layer_combination_coverage_cartography_without_runtime_changes"
} as const;

const DYNAMIC_AIRBORNE_SPLIT_V2_CLOSEOUT_EVIDENCE = {
  posture: "behavior_preserving_architecture_slice_gate_c_closeout",
  runtimeValueDecision: "no_defended_calculator_value_changes",
  mainFileLinesBeforeV2: 3152,
  mainFileLinesAfterGateB: 1793,
  guardModuleLinesAfterGateB: 1422,
  carvedGuardCount: 11,
  remainingInFileGuardCount: 3,
  remainingRecursiveComposerGuards: [
    "applyLinedMassiveMasonryMonotonicFloor",
    "applyFramedReinforcementMonotonicFloor",
    "applyAmbiguousFamilyBoundaryHold"
  ],
  validation: [
    "targeted_eleventh_carve_contract_and_coverage_grid_green_2_files_10_tests",
    "focused_dynamic_airborne_and_hostile_input_sweep_green_13_files_239_tests",
    "calculator_current_gate_green_87_engine_files_401_tests_36_web_files_170_passed_18_skipped_build_5_of_5",
    "broad_pnpm_check_green_219_engine_files_1216_tests_150_web_files_864_passed_18_skipped_build_5_of_5",
    "git_diff_check_clean"
  ]
} as const;

const MASTER_GRID_CLOSEOUT = {
  row: "`dynamic-airborne.ts` size",
  statusAfterCloseout: "Split v2 Gate C closed",
  c6Decision: "closed_because_dynamic_airborne_ts_is_below_2000_lines_after_broad_validation",
  optionalFollowUp:
    "remaining_three_recursive_composer_guards_are_architecture_backlog_not_a_c6_blocker",
  evidenceAdded:
    "packages/engine/src/post-dynamic-airborne-split-refactor-v2-gate-c-next-slice-selection-contract.test.ts"
} as const;

const NEXT_SLICE_RATIONALE = {
  selectedBecause: [
    "dynamic_airborne_ts_is_below_the_2000_line_c6_threshold",
    "broad_pnpm_check_confirmed_no_behavior_or_repo_drift_after_the_eleventh_carve",
    "the_user_priority_is_broad_realistic_floor_wall_layer_combination_coverage_with_honest_accuracy",
    "remaining_source_family_reopens_are_blocked_without_new_evidence",
    "coverage_cartography_selects_the_next_runtime_widening_target_from_evidence_tiers_before_formula_changes"
  ],
  firstGate:
    "gate_a_create_executable_realistic_layer_combination_coverage_cartography_no_runtime_change",
  deferredButNotCancelled: [
    "project_access_policy_route_integration_v1",
    "applyLinedMassiveMasonryMonotonicFloor_architecture_carve",
    "applyFramedReinforcementMonotonicFloor_architecture_carve",
    "applyAmbiguousFamilyBoundaryHold_architecture_carve",
    "blocked_source_family_reopens_without_new_evidence"
  ]
} as const;

const ACTIVE_BOUNDARIES = {
  disallowedMoves: [
    "retune_dynamic_airborne_formulas_during_cartography_gate_a",
    "reopen_GDMTXA04A_C11c_raw_bare_or_wall_selector_blocked_source_families_from_nearby_green_tests",
    "claim_all_arbitrary_layer_stacks_are_exact_or_defended",
    "downgrade_existing_exact_or_benchmark_lanes_to_broader_formula_lanes",
    "resume_productization_route_integration_before_the_selected_calculator_slice_closes"
  ]
} as const;

describe("post dynamic-airborne split v2 Gate C next slice selection contract", () => {
  it("closes dynamic airborne split v2 and selects realistic layer-combination cartography next", () => {
    expect(POST_DYNAMIC_AIRBORNE_SPLIT_V2_GATE_C_NEXT_SLICE_SELECTION).toEqual({
      sliceId: "post_dynamic_airborne_split_refactor_v2_gate_c_next_slice_selection_v1",
      closedImplementationSlice: "dynamic_airborne_split_refactor_v2",
      latestLandedGate: "dynamic_airborne_split_refactor_v2_gate_c_closeout",
      selectedImplementationSlice: "realistic_layer_combination_coverage_cartography_v1",
      selectedPlanningSurface:
        "docs/calculator/SLICE_REALISTIC_LAYER_COMBINATION_COVERAGE_CARTOGRAPHY_PLAN.md",
      selectedRouteFamily: "realistic_layer_combination_coverage_cartography",
      nextExecutionAction:
        "create_executable_realistic_floor_wall_layer_combination_coverage_cartography_without_runtime_changes"
    });
  });

  it("ties closeout to the behavior-preserving split evidence and broad validation", () => {
    expect(DYNAMIC_AIRBORNE_SPLIT_V2_CLOSEOUT_EVIDENCE.posture).toBe(
      "behavior_preserving_architecture_slice_gate_c_closeout"
    );
    expect(DYNAMIC_AIRBORNE_SPLIT_V2_CLOSEOUT_EVIDENCE.runtimeValueDecision).toBe(
      "no_defended_calculator_value_changes"
    );
    expect(DYNAMIC_AIRBORNE_SPLIT_V2_CLOSEOUT_EVIDENCE.mainFileLinesBeforeV2).toBe(3152);
    expect(DYNAMIC_AIRBORNE_SPLIT_V2_CLOSEOUT_EVIDENCE.mainFileLinesAfterGateB).toBe(1793);
    expect(DYNAMIC_AIRBORNE_SPLIT_V2_CLOSEOUT_EVIDENCE.carvedGuardCount).toBe(11);
    expect(DYNAMIC_AIRBORNE_SPLIT_V2_CLOSEOUT_EVIDENCE.remainingRecursiveComposerGuards).toEqual([
      "applyLinedMassiveMasonryMonotonicFloor",
      "applyFramedReinforcementMonotonicFloor",
      "applyAmbiguousFamilyBoundaryHold"
    ]);
    expect(DYNAMIC_AIRBORNE_SPLIT_V2_CLOSEOUT_EVIDENCE.validation).toContain(
      "broad_pnpm_check_green_219_engine_files_1216_tests_150_web_files_864_passed_18_skipped_build_5_of_5"
    );
  });

  it("moves the master C6 line-count signal out of partial without hiding optional follow-up carves", () => {
    expect(MASTER_GRID_CLOSEOUT).toEqual({
      row: "`dynamic-airborne.ts` size",
      statusAfterCloseout: "Split v2 Gate C closed",
      c6Decision: "closed_because_dynamic_airborne_ts_is_below_2000_lines_after_broad_validation",
      optionalFollowUp:
        "remaining_three_recursive_composer_guards_are_architecture_backlog_not_a_c6_blocker",
      evidenceAdded:
        "packages/engine/src/post-dynamic-airborne-split-refactor-v2-gate-c-next-slice-selection-contract.test.ts"
    });
  });

  it("selects coverage cartography because the next runtime move must be evidence-tiered", () => {
    expect(NEXT_SLICE_RATIONALE.selectedBecause).toEqual([
      "dynamic_airborne_ts_is_below_the_2000_line_c6_threshold",
      "broad_pnpm_check_confirmed_no_behavior_or_repo_drift_after_the_eleventh_carve",
      "the_user_priority_is_broad_realistic_floor_wall_layer_combination_coverage_with_honest_accuracy",
      "remaining_source_family_reopens_are_blocked_without_new_evidence",
      "coverage_cartography_selects_the_next_runtime_widening_target_from_evidence_tiers_before_formula_changes"
    ]);
    expect(NEXT_SLICE_RATIONALE.firstGate).toBe(
      "gate_a_create_executable_realistic_layer_combination_coverage_cartography_no_runtime_change"
    );
    expect(NEXT_SLICE_RATIONALE.deferredButNotCancelled).toContain(
      "project_access_policy_route_integration_v1"
    );
  });

  it("keeps source-family, accuracy, and productization boundaries closed for the new active slice", () => {
    expect(ACTIVE_BOUNDARIES.disallowedMoves).toEqual([
      "retune_dynamic_airborne_formulas_during_cartography_gate_a",
      "reopen_GDMTXA04A_C11c_raw_bare_or_wall_selector_blocked_source_families_from_nearby_green_tests",
      "claim_all_arbitrary_layer_stacks_are_exact_or_defended",
      "downgrade_existing_exact_or_benchmark_lanes_to_broader_formula_lanes",
      "resume_productization_route_integration_before_the_selected_calculator_slice_closes"
    ]);
  });
});
