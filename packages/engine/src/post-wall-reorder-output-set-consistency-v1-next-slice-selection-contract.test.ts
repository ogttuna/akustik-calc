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
  selectedImplementationSlice: "preset_airborne_context_injection_v1",
  selectedOutputSurface: "wall_preset_airborne_context_injection",
  selectedRouteFamily: "wall_acoustic_preset_family_injection",
  selectionStatus:
    "selected_preset_airborne_context_injection_after_reorder_consistency_closed_with_ctr_term_guarded_fallthrough_fix",
  numericRuntimeBehaviorChange: false,
  runtimeTightening: true,
  nextExecutionAction: "preset_airborne_context_injection_v1",
  followUpPlanningAction:
    "post_preset_airborne_context_injection_v1_next_slice_selection_v1"
} as const;

const POST_REORDER_CANDIDATE_MATRIX = [
  {
    id: "preset_airborne_context_injection_v1",
    selectedNext: true,
    runtimeTighteningEligible: true,
    reason:
      "master_plan_step_2_unblocks_lsf_and_timber_stud_presets_and_closes_the_2_to_4_db_preset_context_gap_on_aac_and_masonry_presets_by_injecting_lab_masonry_context_into_the_preset_load_path"
  },
  {
    id: "wall_reorder_output_set_consistency_v1",
    selectedNext: false,
    runtimeTighteningEligible: false,
    reason:
      "closed_with_ctr_term_guarded_fallthrough_fix_in_target_output_support_which_preserves_the_intentional_ctr_term_suppression_while_eliminating_the_rw_plus_ctr_reorder_sensitivity"
  },
  {
    id: "wall_preset_pack_2_v1",
    selectedNext: false,
    runtimeTighteningEligible: false,
    reason:
      "blocked_until_preset_airborne_context_injection_lands_because_lsf_and_timber_stud_presets_cannot_produce_studtype_tuned_rw_without_the_context_injection_path"
  },
  {
    id: "wall_hostile_input_matrix_v1",
    selectedNext: false,
    runtimeTighteningEligible: false,
    reason:
      "probe_verified_wall_mode_already_handles_unknown_material_empty_material_and_invalid_thickness_with_explicit_warnings_so_the_hostile_input_matrix_can_follow_preset_context_injection"
  },
  {
    id: "engine_thickness_guardrail_v1",
    selectedNext: false,
    runtimeTighteningEligible: false,
    reason: "cross_cutting_half_day_slice_scheduled_for_master_plan_step_5"
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
    "manufacturer_spec_verification_confirmed_wienerberger_porotherm_100_dense_plaster_rw_43_and_xella_ytong_d700_150_plaster_rw_47_are_the_real_benchmark_values_against_which_preset_outputs_must_reconcile_in_a_separate_context_injection_slice",
    "root_cause_isolated_to_get_carrier_c_returning_null_when_floor_carrier_has_undefined_c_instead_of_falling_through_to_metrics_estimated_c_db_on_non_ctr_term_semantics",
    "ctr_term_guarded_fallthrough_fix_preserves_the_target_output_support_contract_test_intentional_ctr_term_suppression_while_eliminating_the_rw_plus_ctr_reorder_sensitivity",
    "wall_reorder_invariance_matrix_test_pins_the_invariance_across_four_topology_classes_including_asymmetric_light_heavy_and_symmetric_single_and_double_leaf",
    "wall_full_preset_contract_matrix_and_wall_preset_expansion_benchmarks_updated_to_reflect_that_concrete_wall_now_also_exposes_c_in_lab_mode_just_like_the_benchmark_backed_presets",
    "no_engine_numerical_output_changed_and_no_blocked_source_family_was_loosened"
  ]
} as const;

const SELECTED_PRESET_CONTEXT_INJECTION_EVIDENCE = {
  engineEvidence: [
    "packages/engine/src/airborne-masonry-benchmark.test.ts",
    "packages/engine/src/airborne-verified-catalog.ts"
  ],
  webEvidence: [
    "apps/web/features/workbench/preset-definitions.ts",
    "apps/web/features/workbench/scenario-analysis.ts",
    "apps/web/features/workbench/wall-preset-expansion-benchmarks.test.ts"
  ],
  planningAnchors: [
    "docs/calculator/MASTER_PLAN.md",
    "docs/calculator/WALL_COVERAGE_EXPANSION_PLAN.md",
    "docs/calculator/SYSTEM_AUDIT_2026-04-20.md"
  ],
  investigationFindings: [
    "masonry_preset_produces_rw_47_under_workbench_default_context_while_wienerberger_porotherm_benchmark_expects_43_under_lab_masonry_context_which_is_a_4_db_gap_exceeding_the_1_db_benchmark_tolerance",
    "aac_preset_produces_rw_45_under_workbench_default_context_while_xella_ytong_d700_150_benchmark_expects_47_under_lab_masonry_context_which_is_a_2_db_gap_within_the_aircrete_tolerance_but_still_not_benchmark_matching",
    "presets_in_preset_definitions_declare_only_rows_and_do_not_declare_airborne_context_so_the_workbench_load_path_cannot_inject_airtightness_good_or_other_context_fields_that_the_benchmarks_rely_on"
  ],
  selectedBecause: [
    "master_plan_step_2_directly_unblocks_light_steel_stud_and_timber_stud_presets_that_require_airbornecontext_studtype_injection",
    "the_same_slice_closes_the_2_to_4_db_preset_context_gap_on_aac_and_masonry_presets_because_both_problems_share_the_same_root_cause_preset_does_not_inject_airborne_context",
    "accuracy_axis_and_coverage_axis_advance_together_in_this_slice_so_principle_p1_coverage_and_accuracy_advance_together_holds"
  ]
} as const;

describe("post wall reorder output set consistency v1 next slice selection contract", () => {
  it("selects preset airborne context injection once the reorder fix closes cleanly", () => {
    expect(POST_WALL_REORDER_OUTPUT_SET_CONSISTENCY_NEXT_SLICE_SELECTION).toEqual({
      sliceId: "post_wall_reorder_output_set_consistency_v1_next_slice_selection_v1",
      latestClosedImplementationSlice: "wall_reorder_output_set_consistency_v1",
      selectedImplementationSlice: "preset_airborne_context_injection_v1",
      selectedOutputSurface: "wall_preset_airborne_context_injection",
      selectedRouteFamily: "wall_acoustic_preset_family_injection",
      selectionStatus:
        "selected_preset_airborne_context_injection_after_reorder_consistency_closed_with_ctr_term_guarded_fallthrough_fix",
      numericRuntimeBehaviorChange: false,
      runtimeTightening: true,
      nextExecutionAction: "preset_airborne_context_injection_v1",
      followUpPlanningAction:
        "post_preset_airborne_context_injection_v1_next_slice_selection_v1"
    });

    expect(POST_REORDER_CANDIDATE_MATRIX.find((candidate) => candidate.selectedNext)).toEqual({
      id: "preset_airborne_context_injection_v1",
      selectedNext: true,
      runtimeTighteningEligible: true,
      reason:
        "master_plan_step_2_unblocks_lsf_and_timber_stud_presets_and_closes_the_2_to_4_db_preset_context_gap_on_aac_and_masonry_presets_by_injecting_lab_masonry_context_into_the_preset_load_path"
    });
  });

  it("keeps every blocked source family and pack-2 preset blocked across this closeout", () => {
    const blockedIds = [
      "dataholz_gdmtxa04a_visible_exact_reopen",
      "tuas_c11c_exact_import",
      "raw_bare_open_box_open_web_impact_widening",
      "wall_selector_behavior_widening",
      "wall_preset_pack_2_v1",
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
        id: "preset_airborne_context_injection_v1",
        selectedNext: true,
        runtimeTighteningEligible: true,
        reason:
          "master_plan_step_2_unblocks_lsf_and_timber_stud_presets_and_closes_the_2_to_4_db_preset_context_gap_on_aac_and_masonry_presets_by_injecting_lab_masonry_context_into_the_preset_load_path"
      }
    ]);
  });

  it("ties the closeout and the preset injection selection to explicit engine and workbench evidence", () => {
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
        "manufacturer_spec_verification_confirmed_wienerberger_porotherm_100_dense_plaster_rw_43_and_xella_ytong_d700_150_plaster_rw_47_are_the_real_benchmark_values_against_which_preset_outputs_must_reconcile_in_a_separate_context_injection_slice",
        "root_cause_isolated_to_get_carrier_c_returning_null_when_floor_carrier_has_undefined_c_instead_of_falling_through_to_metrics_estimated_c_db_on_non_ctr_term_semantics",
        "ctr_term_guarded_fallthrough_fix_preserves_the_target_output_support_contract_test_intentional_ctr_term_suppression_while_eliminating_the_rw_plus_ctr_reorder_sensitivity",
        "wall_reorder_invariance_matrix_test_pins_the_invariance_across_four_topology_classes_including_asymmetric_light_heavy_and_symmetric_single_and_double_leaf",
        "wall_full_preset_contract_matrix_and_wall_preset_expansion_benchmarks_updated_to_reflect_that_concrete_wall_now_also_exposes_c_in_lab_mode_just_like_the_benchmark_backed_presets",
        "no_engine_numerical_output_changed_and_no_blocked_source_family_was_loosened"
      ]
    });

    expect(SELECTED_PRESET_CONTEXT_INJECTION_EVIDENCE.selectedBecause.length).toBeGreaterThan(0);
    expect(SELECTED_PRESET_CONTEXT_INJECTION_EVIDENCE.investigationFindings.length).toBeGreaterThan(0);
  });
});
