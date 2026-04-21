import { describe, expect, it } from "vitest";

const POST_DATAHOLZ_CLT_CALIBRATION_TIGHTENING_SECOND_PASS_NEXT_SLICE_SELECTION = {
  sliceId: "post_dataholz_clt_calibration_tightening_second_pass_next_slice_selection_v1",
  latestClosedImplementationSlice: "dataholz_clt_calibration_tightening",
  latestClosedImplementationPass: "second_pass",
  selectedImplementationSlice: "wall_coverage_expansion_planning_v1",
  selectedOutputSurface: "wall_coverage_expansion_plan",
  selectedRouteFamily: "wall_acoustic_formula_families",
  selectionStatus:
    "selected_no_runtime_wall_coverage_expansion_planning_after_clt_second_pass_closed_with_consultant_trail_and_diagnostics_dossier_cut",
  numericRuntimeBehaviorChange: false,
  runtimeTightening: false,
  workbenchTightening: true,
  nextExecutionAction: "wall_coverage_expansion_planning_v1",
  followUpPlanningAction: "post_wall_coverage_expansion_planning_next_slice_selection_v1"
} as const;

// Candidate matrix for the pass-2 closeout. Only the wall coverage expansion
// planning slice is selected; every other candidate is either a closed
// upstream corridor or a fail-closed blocked-source family.
const POST_CLT_PASS_2_CLOSEOUT_CANDIDATE_MATRIX = [
  {
    id: "wall_coverage_expansion_planning_v1",
    selectedNext: true,
    runtimeTighteningEligible: false,
    reason:
      "wall_lane_is_the_primary_remaining_coverage_gap_and_product_mission_prioritizes_broader_layer_combination_coverage_plus_accuracy_on_both_floor_and_wall"
  },
  {
    id: "dataholz_clt_calibration_tightening_third_pass",
    selectedNext: false,
    runtimeTighteningEligible: false,
    reason:
      "no_further_defendable_exact_vs_estimate_or_capped_visible_slack_remains_on_the_defended_clt_corridor_without_reopening_gdmtxa04a_visible_exact_matching"
  },
  {
    id: "reinforced_concrete_accuracy_reopen",
    selectedNext: false,
    runtimeTighteningEligible: false,
    reason: "closed_as_explicit_low_confidence_closeout_evidence_in_the_prior_slice"
  },
  {
    id: "raw_terminal_concrete_helper_family_widening_v1",
    selectedNext: false,
    runtimeTighteningEligible: false,
    reason: "closed_as_solved_program_evidence_across_widening_split_topology_and_partial_order_matrices"
  },
  {
    id: "clt_local_combined_interaction_evidence_v1",
    selectedNext: false,
    runtimeTighteningEligible: false,
    reason: "closed_on_the_exact_c2c_c3c_c4c_c7c_anchors_and_the_predictor_backed_c5c_proxy"
  },
  {
    id: "dataholz_gdmtxa04a_visible_exact_reopen",
    selectedNext: false,
    runtimeTighteningEligible: false,
    reason: "blocked_until_the_composite_dry_screed_surface_is_modeled_honestly_not_just_matched_on_direct_id"
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
    reason: "blocked_until_bare_carrier_impact_source_evidence_exists_current_evidence_is_packaged_system_only"
  },
  {
    id: "wall_selector_behavior_widening",
    selectedNext: false,
    runtimeTighteningEligible: false,
    reason: "blocked_until_a_fresh_classified_wall_selector_red_exists"
  }
] as const;

// Evidence that the second-pass CLT calibration tightening is closed. The
// pass-2 cut landed on the workbench consultant-trail and diagnostics-
// dossier surfaces for the CLT visible estimate route, mirroring the
// reinforced-concrete low-confidence discipline on the estimate-side
// mass-timber corridor.
const CLOSED_CLT_PASS_2_EVIDENCE = {
  engineEvidence: [
    "packages/engine/src/dataholz-clt-source-truth-audit.test.ts",
    "packages/engine/src/dataholz-clt-calibration-tightening-audit.test.ts",
    "packages/engine/src/dataholz-gdmtxa04a-material-surface-recheck.test.ts",
    "packages/engine/src/dataholz-gdmtxa04a-composite-surface-model-design.test.ts",
    "packages/engine/src/post-dataholz-clt-calibration-tightening-next-slice-selection-contract.test.ts",
    "packages/engine/src/post-reinforced-concrete-accuracy-reopen-next-slice-selection-contract.test.ts"
  ],
  webEvidence: [
    "apps/web/features/workbench/dataholz-clt-source-truth-route.test.ts",
    "apps/web/features/workbench/clt-visible-estimate-consultant-trail-matrix.test.ts",
    "apps/web/features/workbench/clt-visible-estimate-diagnostics-dossier-matrix.test.ts"
  ],
  closedBecause: [
    "the_exact_vs_estimate_tolerance_bands_on_all_nine_dataholz_clt_rows_are_already_single_value_pinned_in_the_source_truth_audit",
    "the_visible_gdmtxa04a_impact_caps_already_equal_the_direct_official_exact_row_on_lnw_ci_ci50_and_lnwplusci_so_no_further_numerical_tightening_is_defendable_without_reopening_visible_exact_matching",
    "the_lprimentt50_companion_path_already_rides_the_standardized_room_volume_basis_pinned_in_the_first_pass_calibration_audit",
    "the_pass_2_cut_landed_on_the_workbench_consultant_trail_and_diagnostics_dossier_surfaces_so_the_clt_visible_estimate_route_now_carries_the_same_scoped_estimate_posture_discipline_as_reinforced_concrete_low_confidence",
    "the_workbench_source_truth_route_already_pins_support_buckets_and_card_values_so_support_semantics_cannot_drift_under_the_new_consultant_surfaces",
    "every_upstream_closeout_reinforced_concrete_raw_helper_clt_local_broad_audit_blocked_source_refresh_remained_frozen_through_pass_2"
  ]
} as const;

// Evidence that justifies the next wall coverage expansion planning slice.
// This is a no-runtime planning slice whose deliverable is a written plan
// document enumerating the wall formula-family widening agenda under the
// product mission of broader coverage plus defended accuracy.
const SELECTED_WALL_PLANNING_EVIDENCE = {
  engineEvidence: [],
  webEvidence: [],
  planningAnchors: [
    "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
    "docs/calculator/CURRENT_STATE.md",
    "docs/calculator/SOURCE_GAP_LEDGER.md"
  ],
  selectedBecause: [
    "the_product_mission_gives_equal_weight_to_broader_layer_combination_coverage_and_maximum_numerical_accuracy_on_both_floor_and_wall",
    "the_floor_corridor_has_deep_coverage_across_ubiq_knauf_heavy_concrete_reinforced_concrete_dataholz_clt_raw_helper_while_the_wall_corridor_remains_shallow_with_only_a_selector_plus_six_defended_corridors",
    "formula_owned_wall_lanes_are_a_fast_coverage_growth_tool_that_respect_the_existing_exact_catalog_family_formula_low_confidence_precedence_so_no_exact_wall_row_would_be_overridden_by_a_new_formula_lane",
    "a_no_runtime_planning_slice_is_the_correct_transition_after_clt_pass_2_because_the_wall_widening_program_is_multi_iteration_and_deserves_a_defended_plan_before_the_first_runtime_cut_lands"
  ]
} as const;

describe("post Dataholz CLT calibration tightening second pass next slice selection contract", () => {
  it("selects wall coverage expansion planning once the CLT second pass closes with the consultant-trail and diagnostics-dossier cut", () => {
    expect(POST_DATAHOLZ_CLT_CALIBRATION_TIGHTENING_SECOND_PASS_NEXT_SLICE_SELECTION).toEqual({
      sliceId: "post_dataholz_clt_calibration_tightening_second_pass_next_slice_selection_v1",
      latestClosedImplementationSlice: "dataholz_clt_calibration_tightening",
      latestClosedImplementationPass: "second_pass",
      selectedImplementationSlice: "wall_coverage_expansion_planning_v1",
      selectedOutputSurface: "wall_coverage_expansion_plan",
      selectedRouteFamily: "wall_acoustic_formula_families",
      selectionStatus:
        "selected_no_runtime_wall_coverage_expansion_planning_after_clt_second_pass_closed_with_consultant_trail_and_diagnostics_dossier_cut",
      numericRuntimeBehaviorChange: false,
      runtimeTightening: false,
      workbenchTightening: true,
      nextExecutionAction: "wall_coverage_expansion_planning_v1",
      followUpPlanningAction: "post_wall_coverage_expansion_planning_next_slice_selection_v1"
    });

    expect(
      POST_CLT_PASS_2_CLOSEOUT_CANDIDATE_MATRIX.find((candidate) => candidate.selectedNext)
    ).toEqual({
      id: "wall_coverage_expansion_planning_v1",
      selectedNext: true,
      runtimeTighteningEligible: false,
      reason:
        "wall_lane_is_the_primary_remaining_coverage_gap_and_product_mission_prioritizes_broader_layer_combination_coverage_plus_accuracy_on_both_floor_and_wall"
    });
  });

  it("keeps GDMTXA04A, C11c, raw bare, and wall-selector fail-closed across the second-pass closeout", () => {
    const blockedIds = [
      "dataholz_gdmtxa04a_visible_exact_reopen",
      "tuas_c11c_exact_import",
      "raw_bare_open_box_open_web_impact_widening",
      "wall_selector_behavior_widening"
    ] as const;

    for (const id of blockedIds) {
      const candidate = POST_CLT_PASS_2_CLOSEOUT_CANDIDATE_MATRIX.find((entry) => entry.id === id);
      expect(candidate, `${id} must remain in the candidate matrix`).toBeDefined();
      expect(candidate?.selectedNext, `${id} must not be selected next`).toBe(false);
      expect(candidate?.runtimeTighteningEligible, `${id} must stay runtime-ineligible`).toBe(false);
    }

    // No runtime tightening candidate is eligible in this pass — the wall
    // planning slice is explicitly no-runtime.
    expect(
      POST_CLT_PASS_2_CLOSEOUT_CANDIDATE_MATRIX.filter((candidate) => candidate.runtimeTighteningEligible)
    ).toEqual([]);
  });

  it("ties the second-pass closeout and the wall planning selection to explicit engine and workbench evidence", () => {
    expect(CLOSED_CLT_PASS_2_EVIDENCE).toEqual({
      engineEvidence: [
        "packages/engine/src/dataholz-clt-source-truth-audit.test.ts",
        "packages/engine/src/dataholz-clt-calibration-tightening-audit.test.ts",
        "packages/engine/src/dataholz-gdmtxa04a-material-surface-recheck.test.ts",
        "packages/engine/src/dataholz-gdmtxa04a-composite-surface-model-design.test.ts",
        "packages/engine/src/post-dataholz-clt-calibration-tightening-next-slice-selection-contract.test.ts",
        "packages/engine/src/post-reinforced-concrete-accuracy-reopen-next-slice-selection-contract.test.ts"
      ],
      webEvidence: [
        "apps/web/features/workbench/dataholz-clt-source-truth-route.test.ts",
        "apps/web/features/workbench/clt-visible-estimate-consultant-trail-matrix.test.ts",
        "apps/web/features/workbench/clt-visible-estimate-diagnostics-dossier-matrix.test.ts"
      ],
      closedBecause: [
        "the_exact_vs_estimate_tolerance_bands_on_all_nine_dataholz_clt_rows_are_already_single_value_pinned_in_the_source_truth_audit",
        "the_visible_gdmtxa04a_impact_caps_already_equal_the_direct_official_exact_row_on_lnw_ci_ci50_and_lnwplusci_so_no_further_numerical_tightening_is_defendable_without_reopening_visible_exact_matching",
        "the_lprimentt50_companion_path_already_rides_the_standardized_room_volume_basis_pinned_in_the_first_pass_calibration_audit",
        "the_pass_2_cut_landed_on_the_workbench_consultant_trail_and_diagnostics_dossier_surfaces_so_the_clt_visible_estimate_route_now_carries_the_same_scoped_estimate_posture_discipline_as_reinforced_concrete_low_confidence",
        "the_workbench_source_truth_route_already_pins_support_buckets_and_card_values_so_support_semantics_cannot_drift_under_the_new_consultant_surfaces",
        "every_upstream_closeout_reinforced_concrete_raw_helper_clt_local_broad_audit_blocked_source_refresh_remained_frozen_through_pass_2"
      ]
    });

    expect(SELECTED_WALL_PLANNING_EVIDENCE).toEqual({
      engineEvidence: [],
      webEvidence: [],
      planningAnchors: [
        "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
        "docs/calculator/CURRENT_STATE.md",
        "docs/calculator/SOURCE_GAP_LEDGER.md"
      ],
      selectedBecause: [
        "the_product_mission_gives_equal_weight_to_broader_layer_combination_coverage_and_maximum_numerical_accuracy_on_both_floor_and_wall",
        "the_floor_corridor_has_deep_coverage_across_ubiq_knauf_heavy_concrete_reinforced_concrete_dataholz_clt_raw_helper_while_the_wall_corridor_remains_shallow_with_only_a_selector_plus_six_defended_corridors",
        "formula_owned_wall_lanes_are_a_fast_coverage_growth_tool_that_respect_the_existing_exact_catalog_family_formula_low_confidence_precedence_so_no_exact_wall_row_would_be_overridden_by_a_new_formula_lane",
        "a_no_runtime_planning_slice_is_the_correct_transition_after_clt_pass_2_because_the_wall_widening_program_is_multi_iteration_and_deserves_a_defended_plan_before_the_first_runtime_cut_lands"
      ]
    });
  });
});
