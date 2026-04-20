import { describe, expect, it } from "vitest";

const POST_DATAHOLZ_GDMTXA04A_COMPOSITE_SURFACE_MODEL_DESIGN_NEXT_SLICE_SELECTION = {
  sliceId: "post_dataholz_gdmtxa04a_composite_surface_model_design_next_slice_selection_v1",
  latestClosedImplementationSlice: "dataholz_gdmtxa04a_composite_surface_model_design_v1",
  selectedImplementationSlice: "tuas_c11c_exact_import_readiness_design_v1",
  selectedOutputSurface: "tuas_c11c_exact_import_readiness",
  selectedRouteFamily: "tuas_c11c_combined_wet_import_routes",
  selectionStatus: "selected_no_runtime_rank_2_c11c_readiness_design_after_dataholz_fail_closed",
  numericRuntimeBehaviorChange: false,
  runtimeWidening: false,
  nextExecutionAction: "tuas_c11c_exact_import_readiness_design_v1",
  followUpPlanningAction: "post_tuas_c11c_exact_import_readiness_design_next_slice_selection_v1"
} as const;

const DATAHOLZ_CLOSEOUT_SELECTION_MATRIX = [
  {
    id: "tuas_c11c_exact_import_readiness_design_v1",
    selectedNext: true,
    planningOnly: true,
    reason:
      "dataholz_closed_fail_closed_so_rank_2_c11c_is_the_next_blocked_family_that_still_needs_an_explicit_no_runtime_import_readiness_design"
  },
  {
    id: "dataholz_gdmtxa04a_exact_visible_reopen_candidate_v1",
    selectedNext: false,
    planningOnly: false,
    reason:
      "the_landed_design_kept_the_65mm_visible_surface_as_a_convenience_proxy_not_an_honest_composite_surface_equivalence"
  },
  {
    id: "tuas_c11c_exact_import",
    selectedNext: false,
    planningOnly: false,
    reason: "still_blocked_until_the_weighted_tuple_anomaly_has_raw_spectrum_or_source_correction_evidence"
  },
  {
    id: "raw_bare_open_box_open_web_impact_widening",
    selectedNext: false,
    planningOnly: false,
    reason: "still_blocked_until_true_bare_carrier_impact_evidence_exists_instead_of_packaged_system_rows"
  },
  {
    id: "wall_selector_behavior_widening",
    selectedNext: false,
    planningOnly: false,
    reason: "still_blocked_until_a_fresh_classified_wall_red_exists"
  }
] as const;

const CLOSED_DATAHOLZ_COMPOSITE_SURFACE_DESIGN_EVIDENCE = {
  engineEvidence: [
    "packages/engine/src/dataholz-gdmtxa04a-composite-surface-model-design.test.ts",
    "packages/engine/src/dataholz-gdmtxa04a-material-surface-recheck.test.ts",
    "packages/engine/src/blocked-source-rank-1-gdmtxa04a-feasibility-contract.test.ts"
  ],
  runtimeAnchors: [
    "packages/engine/src/dataholz-gdmtxa04a-composite-surface-model.ts",
    "packages/engine/src/floor-system-estimate.ts"
  ],
  closedBecause: [
    "the_landed_design_kept_the_65mm_dry_screed_surface_as_a_convenience_proxy_not_a_source_equivalent_composite_surface",
    "the_direct_gdmtxa04a_exact_row_still_remains_direct_official_id_truth_only",
    "the_visible_boundary_still_routes_honestly_to_the_nearby_gdmtxa01a_estimate_lane",
    "no_honest_visible_exact_reopen_candidate_was_created_by_the_design_pass"
  ]
} as const;

const SELECTED_C11C_READINESS_DESIGN_EVIDENCE = {
  engineEvidence: [
    "packages/engine/src/tuas-c11c-frequency-source-recheck.test.ts",
    "packages/engine/src/blocked-source-rank-2-c11c-feasibility-contract.test.ts",
    "packages/engine/src/blocked-source-backed-widening-rerank-refresh-contract.test.ts"
  ],
  selectedBecause: [
    "c11c_is_now_the_next_remaining_blocked_family_in_the_explicit_order_once_dataholz_closes_fail_closed",
    "its_remaining_gap_is_still_an_import_readiness_problem_not_a_live_runtime_widening_candidate",
    "the_weighted_tuple_anomaly_is_already_pinned_but_still_needs_explicit_design_level_follow_up_before_any_exact_import",
    "raw_bare_open_box_open_web_and_wall_selector_still_rank_below_c11c_without_fresh_reordering_evidence"
  ]
} as const;

describe("post Dataholz GDMTXA04A composite surface model design next slice selection contract", () => {
  it("closes the Dataholz design fail-closed and selects a no-runtime C11c readiness design", () => {
    expect(POST_DATAHOLZ_GDMTXA04A_COMPOSITE_SURFACE_MODEL_DESIGN_NEXT_SLICE_SELECTION).toEqual({
      sliceId: "post_dataholz_gdmtxa04a_composite_surface_model_design_next_slice_selection_v1",
      latestClosedImplementationSlice: "dataholz_gdmtxa04a_composite_surface_model_design_v1",
      selectedImplementationSlice: "tuas_c11c_exact_import_readiness_design_v1",
      selectedOutputSurface: "tuas_c11c_exact_import_readiness",
      selectedRouteFamily: "tuas_c11c_combined_wet_import_routes",
      selectionStatus: "selected_no_runtime_rank_2_c11c_readiness_design_after_dataholz_fail_closed",
      numericRuntimeBehaviorChange: false,
      runtimeWidening: false,
      nextExecutionAction: "tuas_c11c_exact_import_readiness_design_v1",
      followUpPlanningAction: "post_tuas_c11c_exact_import_readiness_design_next_slice_selection_v1"
    });

    expect(DATAHOLZ_CLOSEOUT_SELECTION_MATRIX.find((candidate) => candidate.selectedNext)).toEqual({
      id: "tuas_c11c_exact_import_readiness_design_v1",
      selectedNext: true,
      planningOnly: true,
      reason:
        "dataholz_closed_fail_closed_so_rank_2_c11c_is_the_next_blocked_family_that_still_needs_an_explicit_no_runtime_import_readiness_design"
    });
  });

  it("keeps every blocked runtime candidate fail-closed while the next active slice stays planning-only", () => {
    expect(DATAHOLZ_CLOSEOUT_SELECTION_MATRIX.filter((candidate) => candidate.planningOnly)).toEqual([
      {
        id: "tuas_c11c_exact_import_readiness_design_v1",
        selectedNext: true,
        planningOnly: true,
        reason:
          "dataholz_closed_fail_closed_so_rank_2_c11c_is_the_next_blocked_family_that_still_needs_an_explicit_no_runtime_import_readiness_design"
      }
    ]);

    expect(DATAHOLZ_CLOSEOUT_SELECTION_MATRIX.filter((candidate) => !candidate.selectedNext)).toEqual([
      {
        id: "dataholz_gdmtxa04a_exact_visible_reopen_candidate_v1",
        selectedNext: false,
        planningOnly: false,
        reason:
          "the_landed_design_kept_the_65mm_visible_surface_as_a_convenience_proxy_not_an_honest_composite_surface_equivalence"
      },
      {
        id: "tuas_c11c_exact_import",
        selectedNext: false,
        planningOnly: false,
        reason: "still_blocked_until_the_weighted_tuple_anomaly_has_raw_spectrum_or_source_correction_evidence"
      },
      {
        id: "raw_bare_open_box_open_web_impact_widening",
        selectedNext: false,
        planningOnly: false,
        reason: "still_blocked_until_true_bare_carrier_impact_evidence_exists_instead_of_packaged_system_rows"
      },
      {
        id: "wall_selector_behavior_widening",
        selectedNext: false,
        planningOnly: false,
        reason: "still_blocked_until_a_fresh_classified_wall_red_exists"
      }
    ]);
  });

  it("uses the landed Dataholz design evidence plus the landed C11c blocker evidence to pick the next honest slice", () => {
    expect(CLOSED_DATAHOLZ_COMPOSITE_SURFACE_DESIGN_EVIDENCE).toEqual({
      engineEvidence: [
        "packages/engine/src/dataholz-gdmtxa04a-composite-surface-model-design.test.ts",
        "packages/engine/src/dataholz-gdmtxa04a-material-surface-recheck.test.ts",
        "packages/engine/src/blocked-source-rank-1-gdmtxa04a-feasibility-contract.test.ts"
      ],
      runtimeAnchors: [
        "packages/engine/src/dataholz-gdmtxa04a-composite-surface-model.ts",
        "packages/engine/src/floor-system-estimate.ts"
      ],
      closedBecause: [
        "the_landed_design_kept_the_65mm_dry_screed_surface_as_a_convenience_proxy_not_a_source_equivalent_composite_surface",
        "the_direct_gdmtxa04a_exact_row_still_remains_direct_official_id_truth_only",
        "the_visible_boundary_still_routes_honestly_to_the_nearby_gdmtxa01a_estimate_lane",
        "no_honest_visible_exact_reopen_candidate_was_created_by_the_design_pass"
      ]
    });

    expect(SELECTED_C11C_READINESS_DESIGN_EVIDENCE).toEqual({
      engineEvidence: [
        "packages/engine/src/tuas-c11c-frequency-source-recheck.test.ts",
        "packages/engine/src/blocked-source-rank-2-c11c-feasibility-contract.test.ts",
        "packages/engine/src/blocked-source-backed-widening-rerank-refresh-contract.test.ts"
      ],
      selectedBecause: [
        "c11c_is_now_the_next_remaining_blocked_family_in_the_explicit_order_once_dataholz_closes_fail_closed",
        "its_remaining_gap_is_still_an_import_readiness_problem_not_a_live_runtime_widening_candidate",
        "the_weighted_tuple_anomaly_is_already_pinned_but_still_needs_explicit_design_level_follow_up_before_any_exact_import",
        "raw_bare_open_box_open_web_and_wall_selector_still_rank_below_c11c_without_fresh_reordering_evidence"
      ]
    });
  });
});
