import { EXACT_FLOOR_SYSTEMS } from "@dynecho/catalogs";
import { describe, expect, it } from "vitest";

const BLOCKED_SOURCE_BACKED_WIDENING_RERANK = {
  sliceId: "blocked_source_backed_widening_rerank_v1",
  outcome: "refresh_priority_order_without_runtime_change",
  runtimeBehaviorChange: false,
  selectedNextRuntimeCandidate: null,
  selectedNextRuntimeCandidateStatus: "hold_until_rerank_closeout_selects_the_next_slice_explicitly",
  routeFamily: "deferred_floor_source_gap_candidates",
  outputSurface: "blocked_source_backed_widening_rerank_matrix"
} as const;

const BLOCKED_SOURCE_BACKED_CANDIDATES = [
  {
    id: "dataholz_gdmtxa04a_visible_exact_reopen",
    rank: 1,
    evidencePosture: "strongest_current_source_backed_candidate_but_still_blocked_on_honest_composite_surface_modeling",
    fakeConfidenceRisk: "medium",
    nextAction: "material_surface_modeling_recheck_before_any_exact_reopen"
  },
  {
    id: "tuas_c11c_exact_import",
    rank: 2,
    evidencePosture: "source_backed_row_exists_but_weighted_tuple_anomaly_is_still_unexplained",
    fakeConfidenceRisk: "high",
    nextAction: "frequency_or_source_correction_recheck_before_exact_import"
  },
  {
    id: "raw_bare_open_box_open_web_impact_widening",
    rank: 3,
    evidencePosture: "current_sources_only_support_packaged_systems_not_bare_carrier_impact_rows",
    fakeConfidenceRisk: "very_high",
    nextAction: "find_true_bare_carrier_impact_evidence_before_any_widening"
  },
  {
    id: "wall_selector_behavior_widening",
    rank: 4,
    evidencePosture: "no_fresh_classified_red_exists_so_the_behavior_gap_is_not_a_live_runtime_candidate",
    fakeConfidenceRisk: "medium",
    nextAction: "wait_for_a_new_classified_wall_red_before_reopening"
  }
] as const;

const BLOCKED_SOURCE_BACKED_RERANK_EVIDENCE = {
  strongestCandidateFacts: [
    "dataholz_gdmtxa04a_clt_lab_2026_exists_as_a_direct_official_exact_row",
    "the_visible_gdmtxa04a_like_boundary_is_already_bounded_on_a_defended_estimate_route",
    "the_remaining_gap_is_honest_surface_modeling_not_missing_catalog_truth"
  ],
  secondCandidateFacts: [
    "c11c_still_stays_fail_closed_on_impact_outputs_in_the_current_source_gap_matrix",
    "its_remaining_problem_is_a_frequency_or_source_anomaly_not_missing_drawings"
  ],
  thirdCandidateFacts: [
    "raw_open_box_and_open_web_rows_are_currently_packaged_system_sources_not_bare_carrier_sources",
    "reopening_them_now_would_require_guessing_bare_carrier_impact_values"
  ],
  fourthCandidateFacts: [
    "the_wall_selector_trace_guard_is_closed",
    "there_is_no_new_classified_red_that_raises_wall_selector_widening_above_the_floor_source_gap_candidates"
  ]
} as const;

describe("source gap candidate re-rank contract", () => {
  it("refreshes the blocked source-backed priority order without selecting a runtime widening yet", () => {
    expect(BLOCKED_SOURCE_BACKED_WIDENING_RERANK).toEqual({
      sliceId: "blocked_source_backed_widening_rerank_v1",
      outcome: "refresh_priority_order_without_runtime_change",
      runtimeBehaviorChange: false,
      selectedNextRuntimeCandidate: null,
      selectedNextRuntimeCandidateStatus: "hold_until_rerank_closeout_selects_the_next_slice_explicitly",
      routeFamily: "deferred_floor_source_gap_candidates",
      outputSurface: "blocked_source_backed_widening_rerank_matrix"
    });

    expect(BLOCKED_SOURCE_BACKED_CANDIDATES.map((candidate) => candidate.id)).toEqual([
      "dataholz_gdmtxa04a_visible_exact_reopen",
      "tuas_c11c_exact_import",
      "raw_bare_open_box_open_web_impact_widening",
      "wall_selector_behavior_widening"
    ]);
  });

  it("keeps the rerank sorted by current evidence strength and fake-confidence risk", () => {
    expect(BLOCKED_SOURCE_BACKED_CANDIDATES).toEqual([
      {
        id: "dataholz_gdmtxa04a_visible_exact_reopen",
        rank: 1,
        evidencePosture: "strongest_current_source_backed_candidate_but_still_blocked_on_honest_composite_surface_modeling",
        fakeConfidenceRisk: "medium",
        nextAction: "material_surface_modeling_recheck_before_any_exact_reopen"
      },
      {
        id: "tuas_c11c_exact_import",
        rank: 2,
        evidencePosture: "source_backed_row_exists_but_weighted_tuple_anomaly_is_still_unexplained",
        fakeConfidenceRisk: "high",
        nextAction: "frequency_or_source_correction_recheck_before_exact_import"
      },
      {
        id: "raw_bare_open_box_open_web_impact_widening",
        rank: 3,
        evidencePosture: "current_sources_only_support_packaged_systems_not_bare_carrier_impact_rows",
        fakeConfidenceRisk: "very_high",
        nextAction: "find_true_bare_carrier_impact_evidence_before_any_widening"
      },
      {
        id: "wall_selector_behavior_widening",
        rank: 4,
        evidencePosture: "no_fresh_classified_red_exists_so_the_behavior_gap_is_not_a_live_runtime_candidate",
        fakeConfidenceRisk: "medium",
        nextAction: "wait_for_a_new_classified_wall_red_before_reopening"
      }
    ]);
  });

  it("ties the rerank order to the current blocked-source evidence posture instead of reopening any candidate by inertia", () => {
    const gdmtxa04a = EXACT_FLOOR_SYSTEMS.find((system) => system.id === "dataholz_gdmtxa04a_clt_lab_2026");

    expect(gdmtxa04a?.sourceLabel).toBe("Dataholz open component library");
    expect(EXACT_FLOOR_SYSTEMS.some((system) => system.id === "tuas_c11c_clt260_measured_2026")).toBe(false);

    expect(BLOCKED_SOURCE_BACKED_RERANK_EVIDENCE).toEqual({
      strongestCandidateFacts: [
        "dataholz_gdmtxa04a_clt_lab_2026_exists_as_a_direct_official_exact_row",
        "the_visible_gdmtxa04a_like_boundary_is_already_bounded_on_a_defended_estimate_route",
        "the_remaining_gap_is_honest_surface_modeling_not_missing_catalog_truth"
      ],
      secondCandidateFacts: [
        "c11c_still_stays_fail_closed_on_impact_outputs_in_the_current_source_gap_matrix",
        "its_remaining_problem_is_a_frequency_or_source_anomaly_not_missing_drawings"
      ],
      thirdCandidateFacts: [
        "raw_open_box_and_open_web_rows_are_currently_packaged_system_sources_not_bare_carrier_sources",
        "reopening_them_now_would_require_guessing_bare_carrier_impact_values"
      ],
      fourthCandidateFacts: [
        "the_wall_selector_trace_guard_is_closed",
        "there_is_no_new_classified_red_that_raises_wall_selector_widening_above_the_floor_source_gap_candidates"
      ]
    });
  });
});
