import { describe, expect, it } from "vitest";

const POST_MIXED_FLOOR_WALL_RUNTIME_CANDIDATE_RERANK_AFTER_REQUESTED_OUTPUT_HARNESS_NEXT_SLICE_SELECTION = {
  sliceId: "post_mixed_floor_wall_runtime_candidate_re_rank_after_requested_output_harness_next_slice_selection_v1",
  latestClosedImplementationSlice: "mixed_floor_wall_runtime_candidate_re_rank_after_requested_output_harness_v1",
  selectedImplementationSlice: "heavy_concrete_formula_family_widening_v1",
  selectedOutputSurface: "heavy_concrete_formula_family_widening_matrix",
  selectedRouteFamily: "heavy_concrete_formula_floor_lane",
  selectionStatus: "selected_runtime_formula_family_widening_after_post_harness_rerank",
  numericRuntimeBehaviorChange: false,
  runtimeWidening: true,
  nextExecutionAction: "heavy_concrete_formula_family_widening_v1",
  followUpPlanningAction: "post_heavy_concrete_formula_family_widening_next_slice_selection_v1"
} as const;

const RERANKED_RUNTIME_CANDIDATE_MATRIX = [
  {
    id: "heavy_concrete_formula_family_widening",
    selectedNext: true,
    runtimeWideningEligible: true,
    reason:
      "live_formula_lane_already_has_catalog_lower_bound_monotonicity_and_provenance_guards"
  },
  {
    id: "dataholz_clt_calibration_tightening",
    selectedNext: false,
    runtimeWideningEligible: true,
    reason:
      "exact_slack_is_mostly_consumed_and_remaining_manual_match_boundary_has_no_fresh_runtime_red"
  },
  {
    id: "raw_bare_open_box_open_web_impact_widening",
    selectedNext: false,
    runtimeWideningEligible: false,
    reason: "blocked_until_bare_carrier_source_evidence_exists"
  },
  {
    id: "dataholz_gdmtxa04a_visible_exact_reopen",
    selectedNext: false,
    runtimeWideningEligible: false,
    reason: "blocked_until_composite_dry_screed_surface_is_modeled"
  },
  {
    id: "tuas_c11c_exact_import",
    selectedNext: false,
    runtimeWideningEligible: false,
    reason: "blocked_until_frequency_or_source_anomaly_is_explained"
  },
  {
    id: "wall_selector_behavior_widening",
    selectedNext: false,
    runtimeWideningEligible: false,
    reason: "blocked_until_a_fresh_classified_red_exists"
  }
] as const;

const SELECTED_HEAVY_CONCRETE_WIDENING_EVIDENCE = {
  engineEvidence: [
    "packages/engine/src/impact-heavy-floor-planned-scope-benchmark.test.ts",
    "packages/engine/src/reinforced-concrete-floor-monotonicity.test.ts",
    "packages/engine/src/floor-widening-candidate-contract.test.ts",
    "packages/engine/src/calculate-impact-only.test.ts"
  ],
  webEvidence: [
    "apps/web/features/workbench/heavy-concrete-formula-history-card-matrix.test.ts",
    "apps/web/features/workbench/heavy-concrete-formula-provenance-report-surface.test.ts"
  ],
  runtimeAnchors: [
    "packages/engine/src/impact-estimate.ts",
    "packages/engine/src/floor-system-estimate.ts",
    "packages/engine/src/dynamic-impact.ts",
    "packages/engine/src/impact-support.ts"
  ],
  selectedBecause: [
    "formula_lane_is_already_live_on_bare_and_floating_reinforced_concrete_routes",
    "official_catalog_product_delta_and_lower_bound_anchors_already_exist",
    "monotonicity_and_helper_negative_guards_are_green",
    "history_trace_report_and_method_provenance_guards_are_green",
    "widening_can_stay_inside_a_known_reinforced_concrete_corridor"
  ]
} as const;

const HELD_DATAHOLZ_CLT_CANDIDATE_EVIDENCE = {
  engineEvidence: [
    "packages/engine/src/dataholz-clt-source-truth-audit.test.ts",
    "packages/engine/src/floor-source-corpus-contract.test.ts"
  ],
  webEvidence: [
    "apps/web/features/workbench/dataholz-clt-source-truth-route.test.ts"
  ],
  heldBecause: [
    "remaining_exact_only_slack_is_manual_match_disabled",
    "gdmtxa04a_stays_blocked_as_a_material_surface_boundary_not_a_generic_tightening_lane",
    "no_fresh_classified_runtime_red_exists_on_the_current_clt_estimate_lane"
  ]
} as const;

describe("post mixed floor/wall runtime candidate rerank after requested-output harness next slice selection contract", () => {
  it("selects heavy concrete formula family widening as the first post-harness runtime widening", () => {
    expect(
      POST_MIXED_FLOOR_WALL_RUNTIME_CANDIDATE_RERANK_AFTER_REQUESTED_OUTPUT_HARNESS_NEXT_SLICE_SELECTION
    ).toEqual({
      sliceId: "post_mixed_floor_wall_runtime_candidate_re_rank_after_requested_output_harness_next_slice_selection_v1",
      latestClosedImplementationSlice: "mixed_floor_wall_runtime_candidate_re_rank_after_requested_output_harness_v1",
      selectedImplementationSlice: "heavy_concrete_formula_family_widening_v1",
      selectedOutputSurface: "heavy_concrete_formula_family_widening_matrix",
      selectedRouteFamily: "heavy_concrete_formula_floor_lane",
      selectionStatus: "selected_runtime_formula_family_widening_after_post_harness_rerank",
      numericRuntimeBehaviorChange: false,
      runtimeWidening: true,
      nextExecutionAction: "heavy_concrete_formula_family_widening_v1",
      followUpPlanningAction: "post_heavy_concrete_formula_family_widening_next_slice_selection_v1"
    });

    expect(RERANKED_RUNTIME_CANDIDATE_MATRIX.find((candidate) => candidate.selectedNext)).toEqual({
      id: "heavy_concrete_formula_family_widening",
      selectedNext: true,
      runtimeWideningEligible: true,
      reason:
        "live_formula_lane_already_has_catalog_lower_bound_monotonicity_and_provenance_guards"
    });
  });

  it("keeps Dataholz CLT as the held second candidate instead of forcing a weak immediate tightening", () => {
    expect(RERANKED_RUNTIME_CANDIDATE_MATRIX.filter((candidate) => candidate.runtimeWideningEligible)).toEqual([
      {
        id: "heavy_concrete_formula_family_widening",
        selectedNext: true,
        runtimeWideningEligible: true,
        reason:
          "live_formula_lane_already_has_catalog_lower_bound_monotonicity_and_provenance_guards"
      },
      {
        id: "dataholz_clt_calibration_tightening",
        selectedNext: false,
        runtimeWideningEligible: true,
        reason:
          "exact_slack_is_mostly_consumed_and_remaining_manual_match_boundary_has_no_fresh_runtime_red"
      }
    ]);

    expect(HELD_DATAHOLZ_CLT_CANDIDATE_EVIDENCE).toEqual({
      engineEvidence: [
        "packages/engine/src/dataholz-clt-source-truth-audit.test.ts",
        "packages/engine/src/floor-source-corpus-contract.test.ts"
      ],
      webEvidence: [
        "apps/web/features/workbench/dataholz-clt-source-truth-route.test.ts"
      ],
      heldBecause: [
        "remaining_exact_only_slack_is_manual_match_disabled",
        "gdmtxa04a_stays_blocked_as_a_material_surface_boundary_not_a_generic_tightening_lane",
        "no_fresh_classified_runtime_red_exists_on_the_current_clt_estimate_lane"
      ]
    });
  });

  it("ties the selected heavy concrete widening to concrete-specific runtime and user-facing evidence", () => {
    expect(SELECTED_HEAVY_CONCRETE_WIDENING_EVIDENCE).toEqual({
      engineEvidence: [
        "packages/engine/src/impact-heavy-floor-planned-scope-benchmark.test.ts",
        "packages/engine/src/reinforced-concrete-floor-monotonicity.test.ts",
        "packages/engine/src/floor-widening-candidate-contract.test.ts",
        "packages/engine/src/calculate-impact-only.test.ts"
      ],
      webEvidence: [
        "apps/web/features/workbench/heavy-concrete-formula-history-card-matrix.test.ts",
        "apps/web/features/workbench/heavy-concrete-formula-provenance-report-surface.test.ts"
      ],
      runtimeAnchors: [
        "packages/engine/src/impact-estimate.ts",
        "packages/engine/src/floor-system-estimate.ts",
        "packages/engine/src/dynamic-impact.ts",
        "packages/engine/src/impact-support.ts"
      ],
      selectedBecause: [
        "formula_lane_is_already_live_on_bare_and_floating_reinforced_concrete_routes",
        "official_catalog_product_delta_and_lower_bound_anchors_already_exist",
        "monotonicity_and_helper_negative_guards_are_green",
        "history_trace_report_and_method_provenance_guards_are_green",
        "widening_can_stay_inside_a_known_reinforced_concrete_corridor"
      ]
    });
  });
});
