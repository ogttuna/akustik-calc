import { describe, expect, it } from "vitest";

const POST_BLOCKED_SOURCE_BACKED_WIDENING_RERANK_REFRESH_NEXT_SLICE_SELECTION = {
  sliceId: "post_blocked_source_backed_widening_rerank_refresh_next_slice_selection_v1",
  latestClosedImplementationSlice: "blocked_source_backed_widening_rerank_refresh_v2",
  selectedImplementationSlice: "dataholz_gdmtxa04a_composite_surface_model_design_v1",
  selectedOutputSurface: "dataholz_visible_exact_surface_equivalence",
  selectedRouteFamily: "dataholz_visible_exact_boundary_routes",
  selectionStatus: "selected_no_runtime_rank_1_dataholz_surface_design_after_refresh_closeout",
  numericRuntimeBehaviorChange: false,
  runtimeWidening: false,
  nextExecutionAction: "dataholz_gdmtxa04a_composite_surface_model_design_v1",
  followUpPlanningAction: "post_dataholz_gdmtxa04a_composite_surface_model_design_next_slice_selection_v1"
} as const;

const REFRESH_CLOSEOUT_SELECTION_MATRIX = [
  {
    id: "dataholz_gdmtxa04a_composite_surface_model_design_v1",
    selectedNext: true,
    planningOnly: true,
    reason:
      "refresh_left_gdmtxa04a_as_rank_1_and_its_remaining_gap_is_a_local_composite_surface_design_problem_not_a_missing_source_truth_problem"
  },
  {
    id: "dataholz_gdmtxa04a_visible_exact_reopen",
    selectedNext: false,
    planningOnly: false,
    reason: "still_blocked_until_the_composite_dry_screed_surface_is_modeled_honestly"
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

const REFRESH_CLOSEOUT_SELECTION_EVIDENCE = {
  seededCloseoutEvidence: [
    "packages/engine/src/post-mixed-floor-wall-seeded-cross-mode-chain-next-slice-selection-contract.test.ts",
    "packages/engine/src/mixed-floor-wall-complex-stack.test.ts",
    "packages/engine/src/mixed-floor-wall-generated-matrix.test.ts",
    "apps/web/features/workbench/mixed-study-mode-torture.test.ts",
    "apps/web/features/workbench/mixed-study-mode-generated-history-grid.test.ts",
    "apps/web/features/workbench/mixed-study-mode-generated-edit-history-matrix.test.ts",
    "apps/web/features/workbench/mixed-study-mode-output-card-snapshot-grid.test.ts",
    "apps/web/features/workbench/mixed-study-mode-output-card-snapshot-requested-output-surface-descriptors.test.ts"
  ],
  refreshEvidence: [
    "packages/engine/src/blocked-source-backed-widening-rerank-refresh-contract.test.ts"
  ],
  selectedBecause: [
    "the_refresh_closeout_kept_the_explicit_blocked_order_unchanged",
    "gdmtxa04a_remains_the_rank_1_blocked_candidate_after_the_refresh",
    "its_remaining_gap_is_explicitly_material_surface_modeling_before_any_exact_reopen",
    "c11c_still_requires_external_frequency_or_source_correction_evidence",
    "raw_bare_open_box_open_web_still_requires_true_bare_carrier_impact_evidence",
    "wall_selector_still_requires_a_fresh_classified_wall_red"
  ]
} as const;

describe("post blocked-source backed widening rerank refresh next slice selection contract", () => {
  it("closes the refresh by selecting a no-runtime Dataholz composite-surface design slice", () => {
    expect(POST_BLOCKED_SOURCE_BACKED_WIDENING_RERANK_REFRESH_NEXT_SLICE_SELECTION).toEqual({
      sliceId: "post_blocked_source_backed_widening_rerank_refresh_next_slice_selection_v1",
      latestClosedImplementationSlice: "blocked_source_backed_widening_rerank_refresh_v2",
      selectedImplementationSlice: "dataholz_gdmtxa04a_composite_surface_model_design_v1",
      selectedOutputSurface: "dataholz_visible_exact_surface_equivalence",
      selectedRouteFamily: "dataholz_visible_exact_boundary_routes",
      selectionStatus: "selected_no_runtime_rank_1_dataholz_surface_design_after_refresh_closeout",
      numericRuntimeBehaviorChange: false,
      runtimeWidening: false,
      nextExecutionAction: "dataholz_gdmtxa04a_composite_surface_model_design_v1",
      followUpPlanningAction: "post_dataholz_gdmtxa04a_composite_surface_model_design_next_slice_selection_v1"
    });

    expect(REFRESH_CLOSEOUT_SELECTION_MATRIX.find((candidate) => candidate.selectedNext)).toEqual({
      id: "dataholz_gdmtxa04a_composite_surface_model_design_v1",
      selectedNext: true,
      planningOnly: true,
      reason:
        "refresh_left_gdmtxa04a_as_rank_1_and_its_remaining_gap_is_a_local_composite_surface_design_problem_not_a_missing_source_truth_problem"
    });
  });

  it("keeps every blocked runtime candidate fail-closed while the selected follow-up stays no-runtime", () => {
    expect(REFRESH_CLOSEOUT_SELECTION_MATRIX.filter((candidate) => candidate.planningOnly)).toEqual([
      {
        id: "dataholz_gdmtxa04a_composite_surface_model_design_v1",
        selectedNext: true,
        planningOnly: true,
        reason:
          "refresh_left_gdmtxa04a_as_rank_1_and_its_remaining_gap_is_a_local_composite_surface_design_problem_not_a_missing_source_truth_problem"
      }
    ]);

    expect(REFRESH_CLOSEOUT_SELECTION_MATRIX.filter((candidate) => !candidate.selectedNext)).toEqual([
      {
        id: "dataholz_gdmtxa04a_visible_exact_reopen",
        selectedNext: false,
        planningOnly: false,
        reason: "still_blocked_until_the_composite_dry_screed_surface_is_modeled_honestly"
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

  it("uses only the landed seeded closeout pack plus the landed refresh contract as closeout evidence", () => {
    expect(REFRESH_CLOSEOUT_SELECTION_EVIDENCE).toEqual({
      seededCloseoutEvidence: [
        "packages/engine/src/post-mixed-floor-wall-seeded-cross-mode-chain-next-slice-selection-contract.test.ts",
        "packages/engine/src/mixed-floor-wall-complex-stack.test.ts",
        "packages/engine/src/mixed-floor-wall-generated-matrix.test.ts",
        "apps/web/features/workbench/mixed-study-mode-torture.test.ts",
        "apps/web/features/workbench/mixed-study-mode-generated-history-grid.test.ts",
        "apps/web/features/workbench/mixed-study-mode-generated-edit-history-matrix.test.ts",
        "apps/web/features/workbench/mixed-study-mode-output-card-snapshot-grid.test.ts",
        "apps/web/features/workbench/mixed-study-mode-output-card-snapshot-requested-output-surface-descriptors.test.ts"
      ],
      refreshEvidence: [
        "packages/engine/src/blocked-source-backed-widening-rerank-refresh-contract.test.ts"
      ],
      selectedBecause: [
        "the_refresh_closeout_kept_the_explicit_blocked_order_unchanged",
        "gdmtxa04a_remains_the_rank_1_blocked_candidate_after_the_refresh",
        "its_remaining_gap_is_explicitly_material_surface_modeling_before_any_exact_reopen",
        "c11c_still_requires_external_frequency_or_source_correction_evidence",
        "raw_bare_open_box_open_web_still_requires_true_bare_carrier_impact_evidence",
        "wall_selector_still_requires_a_fresh_classified_wall_red"
      ]
    });
  });
});
