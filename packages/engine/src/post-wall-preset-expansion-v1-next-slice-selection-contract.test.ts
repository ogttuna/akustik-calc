import { describe, expect, it } from "vitest";

// Contract pinning the closeout of wall_preset_expansion_v1. This slice
// landed three new wall presets (AAC single-leaf, masonry brick, CLT wall)
// leveraging existing engine airborne family detection paths, pinned
// canonical Rw values and output availability per preset under lab / field /
// building contexts, and mirrored the reinforced-concrete discipline by
// updating the focused current gate. No runtime engine behavior changed;
// the engine already supported these stacks before the slice began.
const POST_WALL_PRESET_EXPANSION_NEXT_SLICE_SELECTION = {
  sliceId: "post_wall_preset_expansion_v1_next_slice_selection_v1",
  latestClosedImplementationSlice: "wall_preset_expansion_v1",
  selectedImplementationSlice: "wall_reorder_output_set_consistency_v1",
  selectedOutputSurface: "wall_airborne_output_availability_under_reorder",
  selectedRouteFamily: "wall_acoustic_family_detection",
  selectionStatus:
    "selected_wall_reorder_output_set_consistency_after_preset_expansion_revealed_asymmetric_c_availability_on_order_reversal",
  numericRuntimeBehaviorChange: false,
  runtimeTightening: false,
  workbenchTightening: true,
  nextExecutionAction: "wall_reorder_output_set_consistency_v1",
  followUpPlanningAction: "post_wall_reorder_output_set_consistency_v1_next_slice_selection_v1"
} as const;

// Candidate matrix. The single next-selected candidate is the wall-reorder
// C-availability investigation found by the analysis probe that preceded
// this slice. LSF and timber stud remain fail-closed at the preset level
// because they require airborneContext.studType injection that the preset
// surface does not support today.
const POST_WALL_PRESET_EXPANSION_CANDIDATE_MATRIX = [
  {
    id: "wall_reorder_output_set_consistency_v1",
    selectedNext: true,
    runtimeTighteningEligible: true,
    reason:
      "probe_found_asymmetric_gypsum_concrete_stacks_expose_different_supported_output_sets_when_reversed_even_though_rw_is_identical_which_is_a_user_visible_determinism_gap_in_the_engine_airborne_family_detection"
  },
  {
    id: "wall_hostile_input_matrix_v1",
    selectedNext: false,
    runtimeTighteningEligible: false,
    reason:
      "probe_confirmed_wall_mode_already_handles_unknown_material_empty_material_and_invalid_thickness_with_explicit_warnings_and_partial_or_fail_closed_results_so_a_formal_matrix_slice_is_lower_priority_than_the_reorder_fix_for_now"
  },
  {
    id: "light_steel_stud_wall_preset_v1",
    selectedNext: false,
    runtimeTighteningEligible: false,
    reason:
      "blocked_until_preset_surface_can_inject_airborne_context_studtype_or_until_engine_family_detection_infers_studtype_from_layer_patterns_without_the_context"
  },
  {
    id: "timber_stud_wall_preset_v1",
    selectedNext: false,
    runtimeTighteningEligible: false,
    reason: "blocked_for_the_same_studtype_context_reason_as_light_steel_stud_wall_preset_v1"
  },
  {
    id: "dataholz_gdmtxa04a_visible_exact_reopen",
    selectedNext: false,
    runtimeTighteningEligible: false,
    reason: "blocked_until_the_composite_dry_screed_surface_is_modeled_honestly"
  },
  {
    id: "tuas_c11c_exact_import",
    selectedNext: false,
    runtimeTighteningEligible: false,
    reason: "blocked_until_the_frequency_or_source_anomaly_on_the_combined_wet_tuple_is_explained"
  },
  {
    id: "raw_bare_open_box_open_web_impact_widening",
    selectedNext: false,
    runtimeTighteningEligible: false,
    reason: "blocked_until_bare_carrier_impact_source_evidence_exists"
  },
  {
    id: "wall_selector_behavior_widening",
    selectedNext: false,
    runtimeTighteningEligible: false,
    reason: "blocked_until_a_fresh_classified_wall_selector_red_exists"
  }
] as const;

// Evidence that wall_preset_expansion_v1 is closed.
const CLOSED_WALL_PRESET_EXPANSION_EVIDENCE = {
  engineEvidence: [
    "packages/engine/src/airborne-verified-catalog.ts",
    "packages/engine/src/airborne-masonry-benchmark.test.ts",
    "packages/engine/src/airborne-aircrete-benchmark.test.ts"
  ],
  webEvidence: [
    "apps/web/features/workbench/preset-definitions.ts",
    "apps/web/features/workbench/wall-full-preset-contract-matrix.test.ts",
    "apps/web/features/workbench/wall-preset-expansion-benchmarks.test.ts"
  ],
  closedBecause: [
    "three_new_wall_presets_aac_single_leaf_wall_masonry_brick_wall_clt_wall_landed_on_the_workbench_surface_with_benchmark_backed_material_stacks",
    "each_new_preset_produces_a_live_non_screening_rw_with_stc_c_and_ctr_outputs_all_live_in_lab_context_which_is_a_clear_posture_step_up_from_the_screening_only_concrete_wall_preset",
    "wall_full_preset_contract_matrix_already_handled_the_non_screening_conditional_path_so_no_matrix_surgery_was_required_and_every_new_preset_survives_the_lab_apparent_field_and_building_context_sweep",
    "wall_preset_expansion_benchmarks_pins_the_canonical_rw_per_preset_so_future_engine_changes_that_would_shift_these_values_surface_as_explicit_test_updates_rather_than_silent_drift",
    "no_engine_runtime_behavior_changed_the_engine_already_supported_these_stacks_and_the_slice_only_enlarged_the_user_visible_preset_surface_plus_the_pinning_discipline"
  ]
} as const;

// Evidence for the next selected slice.
const SELECTED_WALL_REORDER_CONSISTENCY_EVIDENCE = {
  engineEvidence: [
    "packages/engine/src/dynamic-airborne.ts"
  ],
  webEvidence: [
    "apps/web/features/workbench/wall-preset-expansion-benchmarks.test.ts"
  ],
  runtimeAnchors: [
    "packages/engine/src/dynamic-airborne.ts",
    "packages/engine/src/estimate-rw.ts"
  ],
  investigationFindings: [
    "given_an_asymmetric_stack_gypsum_12_5_rockwool_50_air_gap_50_concrete_150_rw_is_54_and_supported_outputs_are_rw_stc_ctr",
    "given_the_same_materials_reversed_concrete_150_rockwool_50_air_gap_50_gypsum_12_5_rw_is_also_54_but_supported_outputs_are_rw_stc_c_ctr_with_c_now_live",
    "airborne_family_detection_returns_null_in_both_orderings_so_the_difference_is_not_driven_by_family_classification_and_is_likely_in_the_rw_c_derivation_path",
    "symmetric_single_leaf_concrete_plus_gypsum_and_symmetric_double_leaf_gypsum_air_gypsum_show_no_reorder_delta_so_the_inconsistency_is_specific_to_asymmetric_light_heavy_stacks"
  ],
  selectedBecause: [
    "the_preset_expansion_surfaced_a_deterministic_output_set_expectation_that_the_engine_does_not_yet_meet_and_this_is_a_user_trust_issue_rather_than_a_numerical_accuracy_issue",
    "fixing_reorder_consistency_protects_future_wall_coverage_expansion_from_inheriting_a_surprise_where_moving_a_layer_changes_what_outputs_are_available_on_the_workbench_card_surface",
    "the_fix_is_contained_to_the_engine_airborne_c_derivation_lane_and_does_not_require_new_catalog_rows_or_new_formula_families"
  ]
} as const;

describe("post wall preset expansion v1 next slice selection contract", () => {
  it("selects wall reorder output-set consistency once the preset expansion closes cleanly", () => {
    expect(POST_WALL_PRESET_EXPANSION_NEXT_SLICE_SELECTION).toEqual({
      sliceId: "post_wall_preset_expansion_v1_next_slice_selection_v1",
      latestClosedImplementationSlice: "wall_preset_expansion_v1",
      selectedImplementationSlice: "wall_reorder_output_set_consistency_v1",
      selectedOutputSurface: "wall_airborne_output_availability_under_reorder",
      selectedRouteFamily: "wall_acoustic_family_detection",
      selectionStatus:
        "selected_wall_reorder_output_set_consistency_after_preset_expansion_revealed_asymmetric_c_availability_on_order_reversal",
      numericRuntimeBehaviorChange: false,
      runtimeTightening: false,
      workbenchTightening: true,
      nextExecutionAction: "wall_reorder_output_set_consistency_v1",
      followUpPlanningAction: "post_wall_reorder_output_set_consistency_v1_next_slice_selection_v1"
    });

    expect(
      POST_WALL_PRESET_EXPANSION_CANDIDATE_MATRIX.find((candidate) => candidate.selectedNext)
    ).toEqual({
      id: "wall_reorder_output_set_consistency_v1",
      selectedNext: true,
      runtimeTighteningEligible: true,
      reason:
        "probe_found_asymmetric_gypsum_concrete_stacks_expose_different_supported_output_sets_when_reversed_even_though_rw_is_identical_which_is_a_user_visible_determinism_gap_in_the_engine_airborne_family_detection"
    });
  });

  it("keeps blocked source families and context-dependent presets fail-closed", () => {
    const blockedIds = [
      "dataholz_gdmtxa04a_visible_exact_reopen",
      "tuas_c11c_exact_import",
      "raw_bare_open_box_open_web_impact_widening",
      "wall_selector_behavior_widening",
      "light_steel_stud_wall_preset_v1",
      "timber_stud_wall_preset_v1",
      "wall_hostile_input_matrix_v1"
    ] as const;

    for (const id of blockedIds) {
      const candidate = POST_WALL_PRESET_EXPANSION_CANDIDATE_MATRIX.find((entry) => entry.id === id);
      expect(candidate, `${id} must remain in the candidate matrix`).toBeDefined();
      expect(candidate?.selectedNext, `${id} must not be selected next`).toBe(false);
    }

    // Exactly one candidate is runtime-tightening-eligible: the reorder fix.
    expect(
      POST_WALL_PRESET_EXPANSION_CANDIDATE_MATRIX.filter(
        (candidate) => candidate.runtimeTighteningEligible
      )
    ).toEqual([
      {
        id: "wall_reorder_output_set_consistency_v1",
        selectedNext: true,
        runtimeTighteningEligible: true,
        reason:
          "probe_found_asymmetric_gypsum_concrete_stacks_expose_different_supported_output_sets_when_reversed_even_though_rw_is_identical_which_is_a_user_visible_determinism_gap_in_the_engine_airborne_family_detection"
      }
    ]);
  });

  it("ties the slice closeout and the reorder selection to explicit engine and workbench evidence", () => {
    expect(CLOSED_WALL_PRESET_EXPANSION_EVIDENCE).toEqual({
      engineEvidence: [
        "packages/engine/src/airborne-verified-catalog.ts",
        "packages/engine/src/airborne-masonry-benchmark.test.ts",
        "packages/engine/src/airborne-aircrete-benchmark.test.ts"
      ],
      webEvidence: [
        "apps/web/features/workbench/preset-definitions.ts",
        "apps/web/features/workbench/wall-full-preset-contract-matrix.test.ts",
        "apps/web/features/workbench/wall-preset-expansion-benchmarks.test.ts"
      ],
      closedBecause: [
        "three_new_wall_presets_aac_single_leaf_wall_masonry_brick_wall_clt_wall_landed_on_the_workbench_surface_with_benchmark_backed_material_stacks",
        "each_new_preset_produces_a_live_non_screening_rw_with_stc_c_and_ctr_outputs_all_live_in_lab_context_which_is_a_clear_posture_step_up_from_the_screening_only_concrete_wall_preset",
        "wall_full_preset_contract_matrix_already_handled_the_non_screening_conditional_path_so_no_matrix_surgery_was_required_and_every_new_preset_survives_the_lab_apparent_field_and_building_context_sweep",
        "wall_preset_expansion_benchmarks_pins_the_canonical_rw_per_preset_so_future_engine_changes_that_would_shift_these_values_surface_as_explicit_test_updates_rather_than_silent_drift",
        "no_engine_runtime_behavior_changed_the_engine_already_supported_these_stacks_and_the_slice_only_enlarged_the_user_visible_preset_surface_plus_the_pinning_discipline"
      ]
    });

    expect(SELECTED_WALL_REORDER_CONSISTENCY_EVIDENCE.selectedBecause.length).toBeGreaterThan(0);
    expect(SELECTED_WALL_REORDER_CONSISTENCY_EVIDENCE.investigationFindings.length).toBeGreaterThan(0);
  });
});
