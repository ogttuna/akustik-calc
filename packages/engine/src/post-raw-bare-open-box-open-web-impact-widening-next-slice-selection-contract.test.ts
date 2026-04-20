import { describe, expect, it } from "vitest";

const POST_RAW_BARE_OPEN_BOX_OPEN_WEB_IMPACT_WIDENING_NEXT_SLICE_SELECTION = {
  sliceId: "post_raw_bare_open_box_open_web_impact_widening_next_slice_selection_v1",
  latestClosedImplementationSlice: "raw_bare_open_box_open_web_impact_widening",
  selectedImplementationSlice: "wall_selector_behavior_widening",
  selectedOutputSurface: "blocked_source_backed_widening_rerank_matrix",
  selectedRouteFamily: "deferred_floor_source_gap_candidates",
  selectionStatus: "selected_no_runtime_rank_4_wall_selector_after_raw_bare_fail_closed",
  numericRuntimeBehaviorChange: false,
  runtimeWidening: false,
  nextExecutionAction: "wall_selector_behavior_widening",
  followUpPlanningAction: "post_wall_selector_behavior_widening_next_slice_selection_v1"
} as const;

const RAW_BARE_CLOSEOUT_SELECTION_MATRIX = [
  {
    id: "wall_selector_behavior_widening",
    selectedNext: true,
    planningOnly: true,
    reason:
      "raw_bare_closed_fail_closed_so_wall_selector_is_now_the_last_remaining_blocked_family_for_explicit_no_runtime_closeout"
  },
  {
    id: "raw_bare_open_box_open_web_impact_widening",
    selectedNext: false,
    planningOnly: false,
    reason:
      "current_tuas_and_ubiq_rows_still_only_prove_packaged_system_behavior_not_true_bare_carrier_impact_truth"
  },
  {
    id: "tuas_c11c_exact_import",
    selectedNext: false,
    planningOnly: false,
    reason:
      "already_closed_fail_closed_until_raw_spectrum_or_source_correction_evidence_exists_for_the_weak_weighted_tuple"
  },
  {
    id: "dataholz_gdmtxa04a_exact_visible_reopen_candidate_v1",
    selectedNext: false,
    planningOnly: false,
    reason:
      "already_closed_fail_closed_until_the_visible_65mm_surface_has_an_honest_composite_equivalence_model"
  }
] as const;

const CLOSED_RAW_BARE_FAMILY_EVIDENCE = {
  engineEvidence: [
    "packages/engine/src/source-gap-candidate-re-rank-contract.test.ts",
    "packages/engine/src/raw-bare-open-web-open-box-source-evidence-rerank-contract.test.ts",
    "packages/engine/src/blocked-source-rank-3-raw-bare-open-box-open-web-feasibility-contract.test.ts",
    "packages/engine/src/remaining-source-gap-posture-matrix.test.ts"
  ],
  closedBecause: [
    "tuas_open_box_rows_are_measured_packaged_systems_not_true_bare_carrier_impact_rows",
    "ubiq_open_web_rows_are_inex_packaged_system_tables_not_true_bare_carrier_impact_rows",
    "raw_bare_open_box_and_open_web_routes_still_stay_impact_fail_closed_in_runtime",
    "the_landed_raw_family_evidence_did_not_create_an_honest_runtime_reopen_candidate"
  ]
} as const;

const SELECTED_WALL_SELECTOR_FOLLOW_UP_EVIDENCE = {
  engineEvidence: [
    "packages/engine/src/blocked-source-rank-4-wall-selector-feasibility-contract.test.ts",
    "packages/engine/src/post-tuas-c11c-exact-import-readiness-design-next-slice-selection-contract.test.ts",
    "packages/engine/src/source-gap-candidate-re-rank-contract.test.ts"
  ],
  selectedBecause: [
    "wall_selector_is_now_the_last_remaining_blocked_family_once_dataholz_c11c_and_raw_bare_all_close_fail_closed",
    "its_current_problem_is_still_guarded_runtime_posture_not_a_live_widening_candidate",
    "the_rank_4_feasibility_audit_already_proves_no_fresh_classified_wall_red_exists",
    "the_next_honest_move_is_an_explicit_no_runtime_wall_selector_closeout"
  ]
} as const;

describe("post raw bare open-box/open-web impact widening next slice selection contract", () => {
  it("closes the raw bare family fail-closed and selects the wall-selector follow-up as the next no-runtime slice", () => {
    expect(POST_RAW_BARE_OPEN_BOX_OPEN_WEB_IMPACT_WIDENING_NEXT_SLICE_SELECTION).toEqual({
      sliceId: "post_raw_bare_open_box_open_web_impact_widening_next_slice_selection_v1",
      latestClosedImplementationSlice: "raw_bare_open_box_open_web_impact_widening",
      selectedImplementationSlice: "wall_selector_behavior_widening",
      selectedOutputSurface: "blocked_source_backed_widening_rerank_matrix",
      selectedRouteFamily: "deferred_floor_source_gap_candidates",
      selectionStatus: "selected_no_runtime_rank_4_wall_selector_after_raw_bare_fail_closed",
      numericRuntimeBehaviorChange: false,
      runtimeWidening: false,
      nextExecutionAction: "wall_selector_behavior_widening",
      followUpPlanningAction: "post_wall_selector_behavior_widening_next_slice_selection_v1"
    });

    expect(RAW_BARE_CLOSEOUT_SELECTION_MATRIX.find((candidate) => candidate.selectedNext)).toEqual({
      id: "wall_selector_behavior_widening",
      selectedNext: true,
      planningOnly: true,
      reason:
        "raw_bare_closed_fail_closed_so_wall_selector_is_now_the_last_remaining_blocked_family_for_explicit_no_runtime_closeout"
    });
  });

  it("keeps the raw bare family and older blocked candidates fail-closed while wall-selector stays planning-only", () => {
    expect(RAW_BARE_CLOSEOUT_SELECTION_MATRIX.filter((candidate) => candidate.planningOnly)).toEqual([
      {
        id: "wall_selector_behavior_widening",
        selectedNext: true,
        planningOnly: true,
        reason:
          "raw_bare_closed_fail_closed_so_wall_selector_is_now_the_last_remaining_blocked_family_for_explicit_no_runtime_closeout"
      }
    ]);

    expect(RAW_BARE_CLOSEOUT_SELECTION_MATRIX.filter((candidate) => !candidate.selectedNext)).toEqual([
      {
        id: "raw_bare_open_box_open_web_impact_widening",
        selectedNext: false,
        planningOnly: false,
        reason:
          "current_tuas_and_ubiq_rows_still_only_prove_packaged_system_behavior_not_true_bare_carrier_impact_truth"
      },
      {
        id: "tuas_c11c_exact_import",
        selectedNext: false,
        planningOnly: false,
        reason:
          "already_closed_fail_closed_until_raw_spectrum_or_source_correction_evidence_exists_for_the_weak_weighted_tuple"
      },
      {
        id: "dataholz_gdmtxa04a_exact_visible_reopen_candidate_v1",
        selectedNext: false,
        planningOnly: false,
        reason:
          "already_closed_fail_closed_until_the_visible_65mm_surface_has_an_honest_composite_equivalence_model"
      }
    ]);
  });

  it("uses the landed raw-family blocker pack and the landed wall feasibility audit to pick the last remaining blocked slice", () => {
    expect(CLOSED_RAW_BARE_FAMILY_EVIDENCE).toEqual({
      engineEvidence: [
        "packages/engine/src/source-gap-candidate-re-rank-contract.test.ts",
        "packages/engine/src/raw-bare-open-web-open-box-source-evidence-rerank-contract.test.ts",
        "packages/engine/src/blocked-source-rank-3-raw-bare-open-box-open-web-feasibility-contract.test.ts",
        "packages/engine/src/remaining-source-gap-posture-matrix.test.ts"
      ],
      closedBecause: [
        "tuas_open_box_rows_are_measured_packaged_systems_not_true_bare_carrier_impact_rows",
        "ubiq_open_web_rows_are_inex_packaged_system_tables_not_true_bare_carrier_impact_rows",
        "raw_bare_open_box_and_open_web_routes_still_stay_impact_fail_closed_in_runtime",
        "the_landed_raw_family_evidence_did_not_create_an_honest_runtime_reopen_candidate"
      ]
    });

    expect(SELECTED_WALL_SELECTOR_FOLLOW_UP_EVIDENCE).toEqual({
      engineEvidence: [
        "packages/engine/src/blocked-source-rank-4-wall-selector-feasibility-contract.test.ts",
        "packages/engine/src/post-tuas-c11c-exact-import-readiness-design-next-slice-selection-contract.test.ts",
        "packages/engine/src/source-gap-candidate-re-rank-contract.test.ts"
      ],
      selectedBecause: [
        "wall_selector_is_now_the_last_remaining_blocked_family_once_dataholz_c11c_and_raw_bare_all_close_fail_closed",
        "its_current_problem_is_still_guarded_runtime_posture_not_a_live_widening_candidate",
        "the_rank_4_feasibility_audit_already_proves_no_fresh_classified_wall_red_exists",
        "the_next_honest_move_is_an_explicit_no_runtime_wall_selector_closeout"
      ]
    });
  });
});
