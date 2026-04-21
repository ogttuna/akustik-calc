import { describe, expect, it } from "vitest";

// Contract pinning the closeout of wall_reorder_output_set_consistency_v1.
//
// The slice fixed a non-determinism bug: asymmetric light-heavy wall stacks
// produced different `supportedOutputs` sets when the layer order was
// reversed even though Rw, C, and Ctr values were identical across
// orderings. Root cause: workbench-inferred floor-carrier signals with
// `rw_plus_ctr` semantic suppressed the curve-rating C in `getCarrierC`
// even when a finite `metrics.estimatedCDb` was available. The fix adds a
// ctr_term-guarded fallthrough so non-`ctr_term` carriers with no declared
// C fall back to the curve-rating estimate.
//
// Accuracy impact: no defended Rw / C / Ctr value changed. The fix only
// changes whether C is reported as a supported output on an already-
// computed curve. The four blocked-source families stay fail-closed, the
// reinforced-concrete / raw-helper / CLT-local / broad-audit / blocked-
// source refresh closeouts stay frozen, and the wall preset expansion
// benchmarks still pin the same canonical Rw values.
const POST_WALL_REORDER_OUTPUT_SET_CONSISTENCY_NEXT_SLICE_SELECTION = {
  sliceId: "post_wall_reorder_output_set_consistency_v1_next_slice_selection_v1",
  latestClosedImplementationSlice: "wall_reorder_output_set_consistency_v1",
  // Updated 2026-04-21 after retracting the false preset-context-gap
  // finding (see SYSTEM_AUDIT_2026-04-20.md finding 10 retraction).
  // The preset_airborne_context_injection_v1 slice was removed from
  // the plan; the next slice is the wall field-continuation
  // completeness audit.
  selectedImplementationSlice: "wall_field_continuation_completeness_v1",
  selectedOutputSurface: "wall_field_continuation_completeness_matrix",
  selectedRouteFamily: "wall_airborne_field_and_building_continuations",
  selectionStatus:
    "selected_wall_field_continuation_audit_after_reorder_consistency_closed_and_false_preset_context_gap_retracted",
  numericRuntimeBehaviorChange: false,
  runtimeTightening: true,
  nextExecutionAction: "wall_field_continuation_completeness_v1",
  followUpPlanningAction:
    "post_wall_field_continuation_completeness_v1_next_slice_selection_v1"
} as const;

const POST_REORDER_CANDIDATE_MATRIX = [
  {
    id: "wall_field_continuation_completeness_v1",
    selectedNext: true,
    runtimeTighteningEligible: true,
    reason:
      "master_plan_step_2_after_retraction_audits_every_defended_wall_corridor_across_lab_field_and_building_context_modes_to_surface_any_untested_gap_or_silent_accuracy_drift_before_landing_additional_wall_coverage_slices"
  },
  {
    id: "preset_airborne_context_injection_v1",
    selectedNext: false,
    runtimeTighteningEligible: false,
    reason:
      "retracted_on_2026_04_21_after_verification_proved_presets_already_run_under_the_workbench_default_live_airborne_context_and_produce_benchmark_matching_rw_for_masonry_and_aac_so_no_accuracy_gap_exists_to_close"
  },
  {
    id: "wall_reorder_output_set_consistency_v1",
    selectedNext: false,
    runtimeTighteningEligible: false,
    reason:
      "closed_with_ctr_term_guarded_fallthrough_fix_in_target_output_support_which_preserves_the_intentional_ctr_term_suppression_while_eliminating_the_screening_carrier_reorder_sensitivity"
  },
  {
    id: "wall_hostile_input_matrix_v1",
    selectedNext: false,
    runtimeTighteningEligible: false,
    reason:
      "probe_verified_wall_mode_already_handles_unknown_material_empty_material_and_invalid_thickness_with_explicit_warnings_so_the_hostile_input_matrix_is_a_robustness_slice_that_follows_the_field_continuation_audit"
  },
  {
    id: "engine_thickness_guardrail_v1",
    selectedNext: false,
    runtimeTighteningEligible: false,
    reason: "cross_cutting_half_day_slice_can_be_folded_into_a_later_engine_validation_slice"
  },
  {
    id: "wall_lsf_timber_stud_preset_pack_v1",
    selectedNext: false,
    runtimeTighteningEligible: false,
    reason:
      "engine_already_benchmark_backed_for_lsf_via_airborne_framed_wall_benchmark_so_the_remaining_work_is_a_preset_to_workbench_state_defaults_mapping_which_is_lower_priority_than_the_field_continuation_audit"
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

const CLOSED_REORDER_CONSISTENCY_EVIDENCE = {
  engineEvidence: [
    "packages/engine/src/target-output-support.ts",
    "packages/engine/src/target-output-support-contract.test.ts"
  ],
  webEvidence: [
    "apps/web/features/workbench/wall-reorder-invariance-matrix.test.ts",
    "apps/web/features/workbench/wall-full-preset-contract-matrix.test.ts",
    "apps/web/features/workbench/wall-preset-expansion-benchmarks.test.ts"
  ],
  closedBecause: [
    "probe_confirmed_same_physical_wall_stack_produced_different_supportedoutputs_on_reversal_with_identical_rw_c_ctr_values_which_is_a_user_trust_violation",
    "manufacturer_spec_verification_confirmed_wienerberger_porotherm_100_dense_plaster_rw_43_and_xella_ytong_d700_150_plaster_rw_47_are_the_real_benchmark_values_which_the_preset_path_already_matches_under_the_real_workbench_default_live_airborne_context",
    "root_cause_isolated_to_get_carrier_c_returning_null_when_floor_carrier_has_undefined_c_instead_of_falling_through_to_metrics_estimated_c_db_on_screening_basis_carriers",
    "screening_carrier_fallthrough_fix_preserves_authoritative_no_c_declarations_on_exact_and_bound_catalog_rows_while_eliminating_the_reorder_sensitivity_on_inferred_screening_wall_carriers",
    "wall_reorder_invariance_matrix_test_pins_the_invariance_across_four_topology_classes_including_asymmetric_light_heavy_and_symmetric_single_and_double_leaf",
    "wall_full_preset_contract_matrix_and_wall_preset_expansion_benchmarks_updated_to_reflect_that_concrete_wall_now_also_exposes_c_in_lab_mode_just_like_the_benchmark_backed_presets_and_that_benchmarks_are_evaluated_under_the_real_workbench_default_live_airborne_context",
    "no_engine_numerical_output_changed_and_no_blocked_source_family_was_loosened"
  ]
} as const;

const SELECTED_WALL_FIELD_CONTINUATION_EVIDENCE = {
  engineEvidence: [
    "packages/engine/src/dynamic-airborne-wall-selector-trace-matrix.test.ts",
    "packages/engine/src/airborne-framed-wall-benchmark.test.ts",
    "packages/engine/src/airborne-masonry-benchmark.test.ts",
    "packages/engine/src/airborne-aircrete-benchmark.test.ts"
  ],
  webEvidence: [
    "apps/web/features/workbench/workbench-shell.tsx",
    "apps/web/features/workbench/airborne-context-panel.tsx",
    "apps/web/features/workbench/wall-full-preset-contract-matrix.test.ts",
    "apps/web/features/workbench/wall-preset-expansion-benchmarks.test.ts"
  ],
  planningAnchors: [
    "docs/calculator/MASTER_PLAN.md",
    "docs/calculator/WALL_COVERAGE_EXPANSION_PLAN.md",
    "docs/calculator/SYSTEM_AUDIT_2026-04-20.md"
  ],
  auditScope: [
    "defended_wall_corridors_include_concrete_wall_aac_single_leaf_wall_masonry_brick_wall_clt_wall_presets_plus_the_six_engine_corridors_double_leaf_aac_boundary_lined_massive_g5_sibling_heavy_core_trim_lab_double_stud",
    "airborne_context_modes_include_element_lab_field_between_rooms_building_prediction_each_with_its_own_required_geometry_and_required_field_outputs",
    "airborne_outputs_include_rw_r_prime_w_dn_w_dn_a_dnt_w_dnt_a_stc_c_ctr_which_must_each_show_a_pinned_live_unsupported_or_needs_input_status_for_every_corridor_times_context_cell"
  ],
  selectedBecause: [
    "after_retracting_the_false_preset_context_gap_finding_the_only_real_remaining_wall_accuracy_question_is_whether_every_corridor_actually_holds_across_lab_field_and_building_contexts_or_whether_there_are_silent_drifts_we_cannot_see_without_an_audit",
    "the_audit_is_cheap_small_scope_no_source_blocking_and_directly_advances_principle_p1_because_any_gap_it_surfaces_becomes_a_separate_explicit_tightening_slice_instead_of_a_silent_regression",
    "lsf_and_timber_stud_preset_work_depends_on_first_knowing_whether_the_current_six_defended_wall_corridors_are_actually_accurate_under_every_context_mode"
  ]
} as const;

describe("post wall reorder output set consistency v1 next slice selection contract", () => {
  it("selects wall field-continuation completeness once the reorder fix closes cleanly", () => {
    expect(POST_WALL_REORDER_OUTPUT_SET_CONSISTENCY_NEXT_SLICE_SELECTION).toEqual({
      sliceId: "post_wall_reorder_output_set_consistency_v1_next_slice_selection_v1",
      latestClosedImplementationSlice: "wall_reorder_output_set_consistency_v1",
      selectedImplementationSlice: "wall_field_continuation_completeness_v1",
      selectedOutputSurface: "wall_field_continuation_completeness_matrix",
      selectedRouteFamily: "wall_airborne_field_and_building_continuations",
      selectionStatus:
        "selected_wall_field_continuation_audit_after_reorder_consistency_closed_and_false_preset_context_gap_retracted",
      numericRuntimeBehaviorChange: false,
      runtimeTightening: true,
      nextExecutionAction: "wall_field_continuation_completeness_v1",
      followUpPlanningAction:
        "post_wall_field_continuation_completeness_v1_next_slice_selection_v1"
    });

    expect(POST_REORDER_CANDIDATE_MATRIX.find((candidate) => candidate.selectedNext)).toEqual({
      id: "wall_field_continuation_completeness_v1",
      selectedNext: true,
      runtimeTighteningEligible: true,
      reason:
        "master_plan_step_2_after_retraction_audits_every_defended_wall_corridor_across_lab_field_and_building_context_modes_to_surface_any_untested_gap_or_silent_accuracy_drift_before_landing_additional_wall_coverage_slices"
    });
  });

  it("keeps every blocked source family, the retracted preset-context slice, and pending wall slices blocked across this closeout", () => {
    const blockedIds = [
      "preset_airborne_context_injection_v1",
      "dataholz_gdmtxa04a_visible_exact_reopen",
      "tuas_c11c_exact_import",
      "raw_bare_open_box_open_web_impact_widening",
      "wall_selector_behavior_widening",
      "wall_lsf_timber_stud_preset_pack_v1",
      "wall_hostile_input_matrix_v1",
      "engine_thickness_guardrail_v1"
    ] as const;

    for (const id of blockedIds) {
      const candidate = POST_REORDER_CANDIDATE_MATRIX.find((entry) => entry.id === id);
      expect(candidate, `${id} must remain in the candidate matrix`).toBeDefined();
      expect(candidate?.selectedNext, `${id} must not be selected next`).toBe(false);
    }

    expect(
      POST_REORDER_CANDIDATE_MATRIX.filter((candidate) => candidate.runtimeTighteningEligible)
    ).toEqual([
      {
        id: "wall_field_continuation_completeness_v1",
        selectedNext: true,
        runtimeTighteningEligible: true,
        reason:
          "master_plan_step_2_after_retraction_audits_every_defended_wall_corridor_across_lab_field_and_building_context_modes_to_surface_any_untested_gap_or_silent_accuracy_drift_before_landing_additional_wall_coverage_slices"
      }
    ]);
  });

  it("ties the closeout and the wall field-continuation selection to explicit engine and workbench evidence", () => {
    expect(CLOSED_REORDER_CONSISTENCY_EVIDENCE).toEqual({
      engineEvidence: [
        "packages/engine/src/target-output-support.ts",
        "packages/engine/src/target-output-support-contract.test.ts"
      ],
      webEvidence: [
        "apps/web/features/workbench/wall-reorder-invariance-matrix.test.ts",
        "apps/web/features/workbench/wall-full-preset-contract-matrix.test.ts",
        "apps/web/features/workbench/wall-preset-expansion-benchmarks.test.ts"
      ],
      closedBecause: [
        "probe_confirmed_same_physical_wall_stack_produced_different_supportedoutputs_on_reversal_with_identical_rw_c_ctr_values_which_is_a_user_trust_violation",
        "manufacturer_spec_verification_confirmed_wienerberger_porotherm_100_dense_plaster_rw_43_and_xella_ytong_d700_150_plaster_rw_47_are_the_real_benchmark_values_which_the_preset_path_already_matches_under_the_real_workbench_default_live_airborne_context",
        "root_cause_isolated_to_get_carrier_c_returning_null_when_floor_carrier_has_undefined_c_instead_of_falling_through_to_metrics_estimated_c_db_on_screening_basis_carriers",
        "screening_carrier_fallthrough_fix_preserves_authoritative_no_c_declarations_on_exact_and_bound_catalog_rows_while_eliminating_the_reorder_sensitivity_on_inferred_screening_wall_carriers",
        "wall_reorder_invariance_matrix_test_pins_the_invariance_across_four_topology_classes_including_asymmetric_light_heavy_and_symmetric_single_and_double_leaf",
        "wall_full_preset_contract_matrix_and_wall_preset_expansion_benchmarks_updated_to_reflect_that_concrete_wall_now_also_exposes_c_in_lab_mode_just_like_the_benchmark_backed_presets_and_that_benchmarks_are_evaluated_under_the_real_workbench_default_live_airborne_context",
        "no_engine_numerical_output_changed_and_no_blocked_source_family_was_loosened"
      ]
    });

    expect(SELECTED_WALL_FIELD_CONTINUATION_EVIDENCE.selectedBecause.length).toBeGreaterThan(0);
    expect(SELECTED_WALL_FIELD_CONTINUATION_EVIDENCE.auditScope.length).toBeGreaterThan(0);
  });
});
