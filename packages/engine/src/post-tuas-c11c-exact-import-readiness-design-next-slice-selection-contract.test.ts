import { describe, expect, it } from "vitest";

const POST_TUAS_C11C_EXACT_IMPORT_READINESS_DESIGN_NEXT_SLICE_SELECTION = {
  sliceId: "post_tuas_c11c_exact_import_readiness_design_next_slice_selection_v1",
  latestClosedImplementationSlice: "tuas_c11c_exact_import_readiness_design_v1",
  selectedImplementationSlice: "raw_bare_open_box_open_web_impact_widening",
  selectedOutputSurface: "blocked_source_backed_widening_rerank_matrix",
  selectedRouteFamily: "deferred_floor_source_gap_candidates",
  selectionStatus: "selected_no_runtime_rank_3_raw_bare_family_after_c11c_fail_closed",
  numericRuntimeBehaviorChange: false,
  runtimeWidening: false,
  nextExecutionAction: "raw_bare_open_box_open_web_impact_widening",
  followUpPlanningAction: "post_raw_bare_open_box_open_web_impact_widening_next_slice_selection_v1"
} as const;

const C11C_CLOSEOUT_SELECTION_MATRIX = [
  {
    id: "raw_bare_open_box_open_web_impact_widening",
    selectedNext: true,
    planningOnly: true,
    reason:
      "c11c_closed_fail_closed_so_rank_3_raw_bare_open_box_open_web_is_now_the_next_remaining_blocked_family_for_explicit_no_runtime_closeout"
  },
  {
    id: "tuas_c11c_exact_import_candidate_v1",
    selectedNext: false,
    planningOnly: false,
    reason:
      "the_landed_readiness_design_did_not_yield_an_honest_exact_import_rule_for_the_weak_weighted_tuple"
  },
  {
    id: "dataholz_gdmtxa04a_exact_visible_reopen_candidate_v1",
    selectedNext: false,
    planningOnly: false,
    reason:
      "the_closed_rank_1_dataholz_design_still_keeps_the_65mm_visible_surface_as_a_convenience_proxy_not_an_honest_exact_reopen"
  },
  {
    id: "tuas_c11c_exact_import",
    selectedNext: false,
    planningOnly: false,
    reason:
      "still_blocked_until_raw_c11c_spectrum_or_source_correction_evidence_exists_beyond_the_fail_closed_readiness_design"
  },
  {
    id: "wall_selector_behavior_widening",
    selectedNext: false,
    planningOnly: false,
    reason: "still_blocked_until_a_fresh_classified_wall_red_exists"
  }
] as const;

const CLOSED_C11C_READINESS_DESIGN_EVIDENCE = {
  engineEvidence: [
    "packages/engine/src/tuas-c11c-exact-import-readiness.ts",
    "packages/engine/src/tuas-c11c-exact-import-readiness-design.test.ts",
    "packages/engine/src/tuas-c11c-frequency-source-recheck.test.ts",
    "packages/engine/src/blocked-source-rank-2-c11c-feasibility-contract.test.ts",
    "packages/engine/src/tuas-c11c-wet-stack-anomaly-audit.test.ts"
  ],
  closedBecause: [
    "the_visible_c11c_schedule_is_now_explicit_but_the_runtime_route_still_stays_screening_only_rw_support_with_impact_fail_closed",
    "the_weighted_tuple_remains_unexplained_by_any_raw_one_third_octave_impact_spectrum",
    "no_source_correction_or_lab_note_currently_defends_an_exact_import_of_the_weak_weighted_tuple",
    "the_landed_readiness_design_did_not_produce_an_honest_exact_import_candidate"
  ]
} as const;

const SELECTED_RAW_BARE_FOLLOW_UP_EVIDENCE = {
  engineEvidence: [
    "packages/engine/src/source-gap-candidate-re-rank-contract.test.ts",
    "packages/engine/src/raw-bare-open-web-open-box-source-evidence-rerank-contract.test.ts",
    "packages/engine/src/blocked-source-rank-3-raw-bare-open-box-open-web-feasibility-contract.test.ts"
  ],
  selectedBecause: [
    "raw_bare_open_box_open_web_is_now_the_next_remaining_blocked_family_once_c11c_closes_fail_closed",
    "its_current_problem_is_still_source_posture_and_fake_confidence_control_not_a_live_runtime_reopen",
    "the_landed_raw_source_contract_already_proves_that_current_rows_are_packaged_system_evidence_not_true_bare_carrier_impact_evidence",
    "wall_selector_still_ranks_below_raw_bare_without_a_fresh_classified_wall_red"
  ]
} as const;

describe("post TUAS C11c exact import readiness design next slice selection contract", () => {
  it("closes the C11c design fail-closed and selects the next no-runtime raw bare family follow-up", () => {
    expect(POST_TUAS_C11C_EXACT_IMPORT_READINESS_DESIGN_NEXT_SLICE_SELECTION).toEqual({
      sliceId: "post_tuas_c11c_exact_import_readiness_design_next_slice_selection_v1",
      latestClosedImplementationSlice: "tuas_c11c_exact_import_readiness_design_v1",
      selectedImplementationSlice: "raw_bare_open_box_open_web_impact_widening",
      selectedOutputSurface: "blocked_source_backed_widening_rerank_matrix",
      selectedRouteFamily: "deferred_floor_source_gap_candidates",
      selectionStatus: "selected_no_runtime_rank_3_raw_bare_family_after_c11c_fail_closed",
      numericRuntimeBehaviorChange: false,
      runtimeWidening: false,
      nextExecutionAction: "raw_bare_open_box_open_web_impact_widening",
      followUpPlanningAction: "post_raw_bare_open_box_open_web_impact_widening_next_slice_selection_v1"
    });

    expect(C11C_CLOSEOUT_SELECTION_MATRIX.find((candidate) => candidate.selectedNext)).toEqual({
      id: "raw_bare_open_box_open_web_impact_widening",
      selectedNext: true,
      planningOnly: true,
      reason:
        "c11c_closed_fail_closed_so_rank_3_raw_bare_open_box_open_web_is_now_the_next_remaining_blocked_family_for_explicit_no_runtime_closeout"
    });
  });

  it("keeps the blocked reopen candidates fail-closed while the next raw family step stays planning-only", () => {
    expect(C11C_CLOSEOUT_SELECTION_MATRIX.filter((candidate) => candidate.planningOnly)).toEqual([
      {
        id: "raw_bare_open_box_open_web_impact_widening",
        selectedNext: true,
        planningOnly: true,
        reason:
          "c11c_closed_fail_closed_so_rank_3_raw_bare_open_box_open_web_is_now_the_next_remaining_blocked_family_for_explicit_no_runtime_closeout"
      }
    ]);

    expect(C11C_CLOSEOUT_SELECTION_MATRIX.filter((candidate) => !candidate.selectedNext)).toEqual([
      {
        id: "tuas_c11c_exact_import_candidate_v1",
        selectedNext: false,
        planningOnly: false,
        reason:
          "the_landed_readiness_design_did_not_yield_an_honest_exact_import_rule_for_the_weak_weighted_tuple"
      },
      {
        id: "dataholz_gdmtxa04a_exact_visible_reopen_candidate_v1",
        selectedNext: false,
        planningOnly: false,
        reason:
          "the_closed_rank_1_dataholz_design_still_keeps_the_65mm_visible_surface_as_a_convenience_proxy_not_an_honest_exact_reopen"
      },
      {
        id: "tuas_c11c_exact_import",
        selectedNext: false,
        planningOnly: false,
        reason:
          "still_blocked_until_raw_c11c_spectrum_or_source_correction_evidence_exists_beyond_the_fail_closed_readiness_design"
      },
      {
        id: "wall_selector_behavior_widening",
        selectedNext: false,
        planningOnly: false,
        reason: "still_blocked_until_a_fresh_classified_wall_red_exists"
      }
    ]);
  });

  it("uses only the landed C11c readiness evidence and the landed raw-family blocker pack to pick the next honest slice", () => {
    expect(CLOSED_C11C_READINESS_DESIGN_EVIDENCE).toEqual({
      engineEvidence: [
        "packages/engine/src/tuas-c11c-exact-import-readiness.ts",
        "packages/engine/src/tuas-c11c-exact-import-readiness-design.test.ts",
        "packages/engine/src/tuas-c11c-frequency-source-recheck.test.ts",
        "packages/engine/src/blocked-source-rank-2-c11c-feasibility-contract.test.ts",
        "packages/engine/src/tuas-c11c-wet-stack-anomaly-audit.test.ts"
      ],
      closedBecause: [
        "the_visible_c11c_schedule_is_now_explicit_but_the_runtime_route_still_stays_screening_only_rw_support_with_impact_fail_closed",
        "the_weighted_tuple_remains_unexplained_by_any_raw_one_third_octave_impact_spectrum",
        "no_source_correction_or_lab_note_currently_defends_an_exact_import_of_the_weak_weighted_tuple",
        "the_landed_readiness_design_did_not_produce_an_honest_exact_import_candidate"
      ]
    });

    expect(SELECTED_RAW_BARE_FOLLOW_UP_EVIDENCE).toEqual({
      engineEvidence: [
        "packages/engine/src/source-gap-candidate-re-rank-contract.test.ts",
        "packages/engine/src/raw-bare-open-web-open-box-source-evidence-rerank-contract.test.ts",
        "packages/engine/src/blocked-source-rank-3-raw-bare-open-box-open-web-feasibility-contract.test.ts"
      ],
      selectedBecause: [
        "raw_bare_open_box_open_web_is_now_the_next_remaining_blocked_family_once_c11c_closes_fail_closed",
        "its_current_problem_is_still_source_posture_and_fake_confidence_control_not_a_live_runtime_reopen",
        "the_landed_raw_source_contract_already_proves_that_current_rows_are_packaged_system_evidence_not_true_bare_carrier_impact_evidence",
        "wall_selector_still_ranks_below_raw_bare_without_a_fresh_classified_wall_red"
      ]
    });
  });
});
