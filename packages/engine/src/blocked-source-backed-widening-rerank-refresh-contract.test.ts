import { EXACT_FLOOR_SYSTEMS } from "@dynecho/catalogs";
import { describe, expect, it } from "vitest";

const BLOCKED_SOURCE_BACKED_WIDENING_RERANK_REFRESH = {
  sliceId: "blocked_source_backed_widening_rerank_refresh_v2",
  outcome: "keep_explicit_blocked_order_until_a_fresh_classified_runtime_red_exists",
  runtimeBehaviorChange: false,
  selectedNextRuntimeCandidate: null,
  selectedNextRuntimeCandidateStatus:
    "mixed_seeded_closeout_added_no_fresh_classified_runtime_red_so_all_blocked_runtime_candidates_stay_fail_closed",
  routeFamily: "deferred_floor_source_gap_candidates",
  outputSurface: "blocked_source_backed_widening_rerank_matrix"
} as const;

const REFRESHED_BLOCKED_SOURCE_BACKED_CANDIDATES = [
  {
    id: "dataholz_gdmtxa04a_visible_exact_reopen",
    rank: 1,
    evidenceDeltaSinceSeededCloseout: "unchanged_strongest_candidate_direct_official_row_exists_but_visible_exact_reopen_still_needs_honest_composite_surface_modeling",
    fakeConfidenceRisk: "medium",
    nextAction: "material_surface_modeling_recheck_before_any_exact_reopen"
  },
  {
    id: "tuas_c11c_exact_import",
    rank: 2,
    evidenceDeltaSinceSeededCloseout: "unchanged_combined_wet_tuple_anomaly_still_blocks_any_exact_import",
    fakeConfidenceRisk: "high",
    nextAction: "frequency_or_source_correction_recheck_before_exact_import"
  },
  {
    id: "raw_bare_open_box_open_web_impact_widening",
    rank: 3,
    evidenceDeltaSinceSeededCloseout: "unchanged_shared_seeded_routes_added_no_true_bare_carrier_impact_evidence",
    fakeConfidenceRisk: "very_high",
    nextAction: "find_true_bare_carrier_impact_evidence_before_any_widening"
  },
  {
    id: "wall_selector_behavior_widening",
    rank: 4,
    evidenceDeltaSinceSeededCloseout: "unchanged_no_fresh_classified_wall_red_emerged_from_the_shared_seeded_follow_up",
    fakeConfidenceRisk: "medium",
    nextAction: "wait_for_a_new_classified_wall_red_before_reopening"
  }
] as const;

const MIXED_SEEDED_CLOSEOUT_REFRESH_EVIDENCE = {
  boundaryRoutesReviewed: [
    "route-wall-held-aac",
    "route-wall-heavy-composite-hint-suppression",
    "route-dataholz-gdmtxa04a-boundary",
    "route-tuas-c11c-fail-closed",
    "route-open-box-exact",
    "route-open-web-bound"
  ],
  landedSeededFacts: [
    "selected_duplicate_swap_replay_now_uses_explicit_per_plan_reverse_masks",
    "selected_requested_output_restore_surfaces_now_use_the_reverse_mask_branch",
    "broad_and_representative_requested_output_surfaces_stay_on_the_compact_branch",
    "no_blocked_source_backed_runtime_candidate_reopened_during_the_shared_follow_up"
  ],
  refreshReasons: [
    "no_new_classified_runtime_red_was_introduced_by_the_mixed_seeded_closeout",
    "no_new_direct_source_truth_was_imported_for_gdmtxa04a_c11c_or_raw_bare_open_box_open_web",
    "no_new_wall_trace_red_reopened_selector_behavior"
  ]
} as const;

describe("blocked source-backed widening rerank refresh contract", () => {
  it("refreshes the blocked candidate order without selecting a runtime widening", () => {
    expect(BLOCKED_SOURCE_BACKED_WIDENING_RERANK_REFRESH).toEqual({
      sliceId: "blocked_source_backed_widening_rerank_refresh_v2",
      outcome: "keep_explicit_blocked_order_until_a_fresh_classified_runtime_red_exists",
      runtimeBehaviorChange: false,
      selectedNextRuntimeCandidate: null,
      selectedNextRuntimeCandidateStatus:
        "mixed_seeded_closeout_added_no_fresh_classified_runtime_red_so_all_blocked_runtime_candidates_stay_fail_closed",
      routeFamily: "deferred_floor_source_gap_candidates",
      outputSurface: "blocked_source_backed_widening_rerank_matrix"
    });

    expect(REFRESHED_BLOCKED_SOURCE_BACKED_CANDIDATES.map((candidate) => candidate.id)).toEqual([
      "dataholz_gdmtxa04a_visible_exact_reopen",
      "tuas_c11c_exact_import",
      "raw_bare_open_box_open_web_impact_widening",
      "wall_selector_behavior_widening"
    ]);
  });

  it("keeps the rerank order unchanged because the seeded closeout supplied no new classified runtime red", () => {
    expect(REFRESHED_BLOCKED_SOURCE_BACKED_CANDIDATES).toEqual([
      {
        id: "dataholz_gdmtxa04a_visible_exact_reopen",
        rank: 1,
        evidenceDeltaSinceSeededCloseout:
          "unchanged_strongest_candidate_direct_official_row_exists_but_visible_exact_reopen_still_needs_honest_composite_surface_modeling",
        fakeConfidenceRisk: "medium",
        nextAction: "material_surface_modeling_recheck_before_any_exact_reopen"
      },
      {
        id: "tuas_c11c_exact_import",
        rank: 2,
        evidenceDeltaSinceSeededCloseout:
          "unchanged_combined_wet_tuple_anomaly_still_blocks_any_exact_import",
        fakeConfidenceRisk: "high",
        nextAction: "frequency_or_source_correction_recheck_before_exact_import"
      },
      {
        id: "raw_bare_open_box_open_web_impact_widening",
        rank: 3,
        evidenceDeltaSinceSeededCloseout:
          "unchanged_shared_seeded_routes_added_no_true_bare_carrier_impact_evidence",
        fakeConfidenceRisk: "very_high",
        nextAction: "find_true_bare_carrier_impact_evidence_before_any_widening"
      },
      {
        id: "wall_selector_behavior_widening",
        rank: 4,
        evidenceDeltaSinceSeededCloseout:
          "unchanged_no_fresh_classified_wall_red_emerged_from_the_shared_seeded_follow_up",
        fakeConfidenceRisk: "medium",
        nextAction: "wait_for_a_new_classified_wall_red_before_reopening"
      }
    ]);
  });

  it("ties the refresh hold to the seeded closeout evidence instead of reopening any blocked source-backed candidate", () => {
    const gdmtxa04a = EXACT_FLOOR_SYSTEMS.find((system) => system.id === "dataholz_gdmtxa04a_clt_lab_2026");

    expect(gdmtxa04a?.sourceLabel).toBe("Dataholz open component library");
    expect(EXACT_FLOOR_SYSTEMS.some((system) => system.id === "tuas_c11c_clt260_measured_2026")).toBe(false);

    expect(MIXED_SEEDED_CLOSEOUT_REFRESH_EVIDENCE).toEqual({
      boundaryRoutesReviewed: [
        "route-wall-held-aac",
        "route-wall-heavy-composite-hint-suppression",
        "route-dataholz-gdmtxa04a-boundary",
        "route-tuas-c11c-fail-closed",
        "route-open-box-exact",
        "route-open-web-bound"
      ],
      landedSeededFacts: [
        "selected_duplicate_swap_replay_now_uses_explicit_per_plan_reverse_masks",
        "selected_requested_output_restore_surfaces_now_use_the_reverse_mask_branch",
        "broad_and_representative_requested_output_surfaces_stay_on_the_compact_branch",
        "no_blocked_source_backed_runtime_candidate_reopened_during_the_shared_follow_up"
      ],
      refreshReasons: [
        "no_new_classified_runtime_red_was_introduced_by_the_mixed_seeded_closeout",
        "no_new_direct_source_truth_was_imported_for_gdmtxa04a_c11c_or_raw_bare_open_box_open_web",
        "no_new_wall_trace_red_reopened_selector_behavior"
      ]
    });
  });
});
