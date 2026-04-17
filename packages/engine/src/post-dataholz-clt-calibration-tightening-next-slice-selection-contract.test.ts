import { describe, expect, it } from "vitest";

const POST_DATAHOLZ_CLT_CALIBRATION_TIGHTENING_NEXT_SLICE_SELECTION = {
  sliceId: "post_dataholz_clt_calibration_tightening_next_slice_selection_v1",
  latestClosedImplementationSlice: "dataholz_clt_calibration_tightening",
  selectedImplementationSlice: "blocked_source_backed_widening_rerank_v1",
  selectedOutputSurface: "blocked_source_backed_widening_rerank_matrix",
  selectedRouteFamily: "deferred_floor_source_gap_candidates",
  selectionStatus: "selected_no_runtime_rerank_after_clt_calibration_closeout",
  numericRuntimeBehaviorChange: false,
  runtimeWidening: false,
  nextExecutionAction: "blocked_source_backed_widening_rerank_v1",
  followUpPlanningAction: "post_blocked_source_backed_widening_rerank_next_slice_selection_v1"
} as const;

const POST_DATAHOLZ_CLT_CLOSEOUT_CANDIDATE_MATRIX = [
  {
    id: "blocked_source_backed_widening_rerank_v1",
    selectedNext: true,
    planningOnly: true,
    reason:
      "clt_calibration_is_now_closed_so_the_highest_roi_next_move_is_an_explicit_no_runtime_rerank_of_the_still_blocked_source_backed_candidates"
  },
  {
    id: "dataholz_gdmtxa04a_visible_exact_reopen",
    selectedNext: false,
    planningOnly: false,
    reason: "still_blocked_until_the_composite_dry_screed_surface_is_modeled_honestly"
  },
  {
    id: "raw_bare_open_box_open_web_impact_widening",
    selectedNext: false,
    planningOnly: false,
    reason: "still_blocked_until_bare_carrier_impact_source_evidence_exists"
  },
  {
    id: "tuas_c11c_exact_import",
    selectedNext: false,
    planningOnly: false,
    reason: "still_blocked_until_the_frequency_source_anomaly_is_explained"
  },
  {
    id: "wall_selector_behavior_widening",
    selectedNext: false,
    planningOnly: false,
    reason: "still_blocked_until_a_fresh_classified_wall_red_exists"
  },
  {
    id: "reinforced_concrete_accuracy_reopen",
    selectedNext: false,
    planningOnly: false,
    reason: "closed_concrete_low_confidence_corridor_stays_guarded_without_a_new_proof_backed_overlap"
  }
] as const;

const CLOSED_DATAHOLZ_CLT_TIGHTENING_EVIDENCE = {
  engineEvidence: [
    "packages/engine/src/dataholz-clt-calibration-tightening-audit.test.ts",
    "packages/engine/src/dataholz-gdmtxa04a-material-surface-recheck.test.ts",
    "packages/engine/src/dataholz-clt-source-truth-audit.test.ts",
    "packages/engine/src/floor-source-corpus-contract.test.ts",
    "packages/engine/src/remaining-source-gap-posture-matrix.test.ts",
    "packages/engine/src/output-origin-trace-matrix.test.ts"
  ],
  webEvidence: [
    "apps/web/features/workbench/dataholz-clt-source-truth-route.test.ts",
    "apps/web/features/workbench/remaining-source-gap-posture-card-matrix.test.ts",
    "apps/web/features/workbench/output-origin-trace-card-matrix.test.ts"
  ],
  closedBecause: [
    "the_visible_gdmtxa04a_like_boundary_stays_estimate_only_instead_of_reopening_exact_matching",
    "lab_side_ln_w_ci_ci50_2500_and_lnw_plus_ci_now_cap_against_the_direct_official_exact_row",
    "the_visible_boundary_now_uses_the_standardized_lpriment50_companion_path_instead_of_the_weaker_local_guide_fallback",
    "no_higher_roi_runtime_tightening_remains_on_the_current_defended_clt_corridor"
  ]
} as const;

const SELECTED_BLOCKED_SOURCE_RERANK_EVIDENCE = {
  engineEvidence: [
    "packages/engine/src/source-gap-candidate-re-rank-contract.test.ts",
    "packages/engine/src/raw-bare-open-web-open-box-source-evidence-rerank-contract.test.ts",
    "packages/engine/src/remaining-source-gap-posture-matrix.test.ts",
    "packages/engine/src/dataholz-gdmtxa04a-material-surface-recheck.test.ts",
    "packages/engine/src/floor-source-corpus-contract.test.ts"
  ],
  webEvidence: [
    "apps/web/features/workbench/remaining-source-gap-posture-card-matrix.test.ts",
    "apps/web/features/workbench/output-origin-trace-card-matrix.test.ts"
  ],
  selectedBecause: [
    "blocked_source_families_are_still_explicit_but_need_a_fresh_roi_order_after_the_clt_closeout",
    "the_next_honest_step_is_selection_work_not_automatic_runtime_widening",
    "gdmtxa04a_c11c_raw_bare_and_wall_selector_boundaries_remain_open_questions_but_not_live_runtime_candidates",
    "a_no_runtime_rerank_creates_the_clean_baseline_needed_before_any_new_behavior_change"
  ]
} as const;

describe("post Dataholz CLT calibration tightening next slice selection contract", () => {
  it("selects a no-runtime blocked-source rerank once the defended CLT tightening closes", () => {
    expect(POST_DATAHOLZ_CLT_CALIBRATION_TIGHTENING_NEXT_SLICE_SELECTION).toEqual({
      sliceId: "post_dataholz_clt_calibration_tightening_next_slice_selection_v1",
      latestClosedImplementationSlice: "dataholz_clt_calibration_tightening",
      selectedImplementationSlice: "blocked_source_backed_widening_rerank_v1",
      selectedOutputSurface: "blocked_source_backed_widening_rerank_matrix",
      selectedRouteFamily: "deferred_floor_source_gap_candidates",
      selectionStatus: "selected_no_runtime_rerank_after_clt_calibration_closeout",
      numericRuntimeBehaviorChange: false,
      runtimeWidening: false,
      nextExecutionAction: "blocked_source_backed_widening_rerank_v1",
      followUpPlanningAction: "post_blocked_source_backed_widening_rerank_next_slice_selection_v1"
    });

    expect(POST_DATAHOLZ_CLT_CLOSEOUT_CANDIDATE_MATRIX.find((candidate) => candidate.selectedNext)).toEqual({
      id: "blocked_source_backed_widening_rerank_v1",
      selectedNext: true,
      planningOnly: true,
      reason:
        "clt_calibration_is_now_closed_so_the_highest_roi_next_move_is_an_explicit_no_runtime_rerank_of_the_still_blocked_source_backed_candidates"
    });
  });

  it("keeps every blocked widening candidate blocked during the rerank selection step", () => {
    expect(POST_DATAHOLZ_CLT_CLOSEOUT_CANDIDATE_MATRIX.filter((candidate) => candidate.planningOnly)).toEqual([
      {
        id: "blocked_source_backed_widening_rerank_v1",
        selectedNext: true,
        planningOnly: true,
        reason:
          "clt_calibration_is_now_closed_so_the_highest_roi_next_move_is_an_explicit_no_runtime_rerank_of_the_still_blocked_source_backed_candidates"
      }
    ]);

    expect(
      POST_DATAHOLZ_CLT_CLOSEOUT_CANDIDATE_MATRIX.find(
        (candidate) => candidate.id === "dataholz_gdmtxa04a_visible_exact_reopen"
      )
    ).toEqual({
      id: "dataholz_gdmtxa04a_visible_exact_reopen",
      selectedNext: false,
      planningOnly: false,
      reason: "still_blocked_until_the_composite_dry_screed_surface_is_modeled_honestly"
    });
  });

  it("ties the CLT closeout and the rerank selection to explicit engine and workbench evidence", () => {
    expect(CLOSED_DATAHOLZ_CLT_TIGHTENING_EVIDENCE).toEqual({
      engineEvidence: [
        "packages/engine/src/dataholz-clt-calibration-tightening-audit.test.ts",
        "packages/engine/src/dataholz-gdmtxa04a-material-surface-recheck.test.ts",
        "packages/engine/src/dataholz-clt-source-truth-audit.test.ts",
        "packages/engine/src/floor-source-corpus-contract.test.ts",
        "packages/engine/src/remaining-source-gap-posture-matrix.test.ts",
        "packages/engine/src/output-origin-trace-matrix.test.ts"
      ],
      webEvidence: [
        "apps/web/features/workbench/dataholz-clt-source-truth-route.test.ts",
        "apps/web/features/workbench/remaining-source-gap-posture-card-matrix.test.ts",
        "apps/web/features/workbench/output-origin-trace-card-matrix.test.ts"
      ],
      closedBecause: [
        "the_visible_gdmtxa04a_like_boundary_stays_estimate_only_instead_of_reopening_exact_matching",
        "lab_side_ln_w_ci_ci50_2500_and_lnw_plus_ci_now_cap_against_the_direct_official_exact_row",
        "the_visible_boundary_now_uses_the_standardized_lpriment50_companion_path_instead_of_the_weaker_local_guide_fallback",
        "no_higher_roi_runtime_tightening_remains_on_the_current_defended_clt_corridor"
      ]
    });

    expect(SELECTED_BLOCKED_SOURCE_RERANK_EVIDENCE).toEqual({
      engineEvidence: [
        "packages/engine/src/source-gap-candidate-re-rank-contract.test.ts",
        "packages/engine/src/raw-bare-open-web-open-box-source-evidence-rerank-contract.test.ts",
        "packages/engine/src/remaining-source-gap-posture-matrix.test.ts",
        "packages/engine/src/dataholz-gdmtxa04a-material-surface-recheck.test.ts",
        "packages/engine/src/floor-source-corpus-contract.test.ts"
      ],
      webEvidence: [
        "apps/web/features/workbench/remaining-source-gap-posture-card-matrix.test.ts",
        "apps/web/features/workbench/output-origin-trace-card-matrix.test.ts"
      ],
      selectedBecause: [
        "blocked_source_families_are_still_explicit_but_need_a_fresh_roi_order_after_the_clt_closeout",
        "the_next_honest_step_is_selection_work_not_automatic_runtime_widening",
        "gdmtxa04a_c11c_raw_bare_and_wall_selector_boundaries_remain_open_questions_but_not_live_runtime_candidates",
        "a_no_runtime_rerank_creates_the_clean_baseline_needed_before_any_new_behavior_change"
      ]
    });
  });
});
