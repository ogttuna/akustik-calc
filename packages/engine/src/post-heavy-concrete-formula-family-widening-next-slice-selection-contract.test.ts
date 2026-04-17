import { describe, expect, it } from "vitest";

const POST_HEAVY_CONCRETE_FORMULA_FAMILY_WIDENING_NEXT_SLICE_SELECTION = {
  sliceId: "post_heavy_concrete_formula_family_widening_next_slice_selection_v1",
  latestClosedImplementationSlice: "heavy_concrete_formula_family_widening_v1",
  selectedImplementationSlice: "reinforced_concrete_accuracy_tightening_follow_up_v1",
  selectedOutputSurface: "reinforced_concrete_accuracy_tightening_matrix",
  selectedRouteFamily: "reinforced_concrete_floor_lane",
  selectionStatus: "selected_runtime_accuracy_tightening_after_heavy_concrete_closeout",
  numericRuntimeBehaviorChange: false,
  runtimeTightening: true,
  nextExecutionAction: "reinforced_concrete_accuracy_tightening_follow_up_v1",
  followUpPlanningAction: "post_reinforced_concrete_accuracy_tightening_follow_up_next_slice_selection_v1"
} as const;

const POST_CLOSEOUT_CANDIDATE_MATRIX = [
  {
    id: "reinforced_concrete_accuracy_tightening_follow_up",
    selectedNext: true,
    runtimeTighteningEligible: true,
    reason: "widening_is_honestly_exhausted_and_accuracy_risk_now_dominates_the_owned_concrete_corridor"
  },
  {
    id: "dataholz_clt_calibration_tightening",
    selectedNext: false,
    runtimeTighteningEligible: true,
    reason: "still_defended_and_valuable_but_lower_roi_than_concrete_accuracy_tightening_on_the_current_owned_corridor"
  },
  {
    id: "reinforced_concrete_parity_reopen",
    selectedNext: false,
    runtimeTighteningEligible: false,
    reason: "final_explicit_equivalence_probe_closed_without_a_new_proof_backed_candidate"
  },
  {
    id: "raw_bare_open_box_open_web_impact_widening",
    selectedNext: false,
    runtimeTighteningEligible: false,
    reason: "blocked_until_bare_carrier_source_evidence_exists"
  },
  {
    id: "dataholz_gdmtxa04a_visible_exact_reopen",
    selectedNext: false,
    runtimeTighteningEligible: false,
    reason: "blocked_until_composite_dry_screed_surface_is_modeled"
  },
  {
    id: "tuas_c11c_exact_import",
    selectedNext: false,
    runtimeTighteningEligible: false,
    reason: "blocked_until_frequency_or_source_anomaly_is_explained"
  },
  {
    id: "wall_selector_behavior_widening",
    selectedNext: false,
    runtimeTighteningEligible: false,
    reason: "blocked_until_a_fresh_classified_red_exists"
  }
] as const;

const SELECTED_REINFORCED_CONCRETE_TIGHTENING_EVIDENCE = {
  engineEvidence: [
    "packages/engine/src/reinforced-concrete-formula-family-closeout-audit.test.ts",
    "packages/engine/src/reinforced-concrete-family-formula-fit-audit.test.ts",
    "packages/engine/src/reinforced-concrete-low-confidence-edge-continuity.test.ts",
    "packages/engine/src/reinforced-concrete-visible-low-confidence-edge-continuity.test.ts",
    "packages/engine/src/impact-heavy-floor-planned-scope-benchmark.test.ts",
    "packages/engine/src/reinforced-concrete-floor-monotonicity.test.ts",
    "packages/engine/src/calculate-impact-only.test.ts"
  ],
  webEvidence: [
    "apps/web/features/workbench/heavy-concrete-formula-history-card-matrix.test.ts",
    "apps/web/features/workbench/heavy-concrete-formula-provenance-report-surface.test.ts",
    "apps/web/features/workbench/reinforced-concrete-low-confidence-impact-panels.test.ts"
  ],
  runtimeAnchors: [
    "packages/engine/src/heavy-concrete-published-upper-treatment-estimate.ts",
    "packages/engine/src/predictor-published-family-estimate.ts",
    "packages/engine/src/reinforced-concrete-combined-vinyl-elastic-ceiling-estimate.ts",
    "packages/engine/src/reinforced-concrete-low-confidence-airborne.ts",
    "packages/engine/src/impact-support.ts",
    "packages/engine/src/impact-predictor-status.ts"
  ],
  selectedBecause: [
    "the_heavy_concrete_widening_now_has_a_central_formula_family_closeout_audit",
    "the_final_explicit_parity_probe_closed_without_a_new_defended_widening_candidate",
    "the_vinyl_elastic_ceiling_branch_and_residual_family_formula_fit_now_dominate_honesty_risk",
    "tightening_compounds_value_on_the_most_owned_reinforced_concrete_corridor"
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
    "no_fresh_classified_runtime_red_exists_on_the_current_clt_estimate_lane",
    "concrete_accuracy_tightening_has_higher_immediate_roi_on_the_more_owned_corridor",
    "blocked_exact_reopen_and_source_anomaly_boundaries_still_apply"
  ]
} as const;

describe("post heavy-concrete formula-family widening next slice selection contract", () => {
  it("selects reinforced-concrete accuracy tightening after the heavy-concrete widening closes honestly", () => {
    expect(POST_HEAVY_CONCRETE_FORMULA_FAMILY_WIDENING_NEXT_SLICE_SELECTION).toEqual({
      sliceId: "post_heavy_concrete_formula_family_widening_next_slice_selection_v1",
      latestClosedImplementationSlice: "heavy_concrete_formula_family_widening_v1",
      selectedImplementationSlice: "reinforced_concrete_accuracy_tightening_follow_up_v1",
      selectedOutputSurface: "reinforced_concrete_accuracy_tightening_matrix",
      selectedRouteFamily: "reinforced_concrete_floor_lane",
      selectionStatus: "selected_runtime_accuracy_tightening_after_heavy_concrete_closeout",
      numericRuntimeBehaviorChange: false,
      runtimeTightening: true,
      nextExecutionAction: "reinforced_concrete_accuracy_tightening_follow_up_v1",
      followUpPlanningAction: "post_reinforced_concrete_accuracy_tightening_follow_up_next_slice_selection_v1"
    });

    expect(POST_CLOSEOUT_CANDIDATE_MATRIX.find((candidate) => candidate.selectedNext)).toEqual({
      id: "reinforced_concrete_accuracy_tightening_follow_up",
      selectedNext: true,
      runtimeTighteningEligible: true,
      reason: "widening_is_honestly_exhausted_and_accuracy_risk_now_dominates_the_owned_concrete_corridor"
    });
  });

  it("keeps CLT as the held second candidate and leaves parity reopening blocked until new proof appears", () => {
    expect(POST_CLOSEOUT_CANDIDATE_MATRIX.filter((candidate) => candidate.runtimeTighteningEligible)).toEqual([
      {
        id: "reinforced_concrete_accuracy_tightening_follow_up",
        selectedNext: true,
        runtimeTighteningEligible: true,
        reason: "widening_is_honestly_exhausted_and_accuracy_risk_now_dominates_the_owned_concrete_corridor"
      },
      {
        id: "dataholz_clt_calibration_tightening",
        selectedNext: false,
        runtimeTighteningEligible: true,
        reason:
          "still_defended_and_valuable_but_lower_roi_than_concrete_accuracy_tightening_on_the_current_owned_corridor"
      }
    ]);

    expect(POST_CLOSEOUT_CANDIDATE_MATRIX.find((candidate) => candidate.id === "reinforced_concrete_parity_reopen")).toEqual({
      id: "reinforced_concrete_parity_reopen",
      selectedNext: false,
      runtimeTighteningEligible: false,
      reason: "final_explicit_equivalence_probe_closed_without_a_new_proof_backed_candidate"
    });

    expect(HELD_DATAHOLZ_CLT_CANDIDATE_EVIDENCE).toEqual({
      engineEvidence: [
        "packages/engine/src/dataholz-clt-source-truth-audit.test.ts",
        "packages/engine/src/floor-source-corpus-contract.test.ts"
      ],
      webEvidence: [
        "apps/web/features/workbench/dataholz-clt-source-truth-route.test.ts"
      ],
      heldBecause: [
        "no_fresh_classified_runtime_red_exists_on_the_current_clt_estimate_lane",
        "concrete_accuracy_tightening_has_higher_immediate_roi_on_the_more_owned_corridor",
        "blocked_exact_reopen_and_source_anomaly_boundaries_still_apply"
      ]
    });
  });

  it("ties the selected accuracy tightening to the closeout audit, benchmark, and user-facing provenance guards", () => {
    expect(SELECTED_REINFORCED_CONCRETE_TIGHTENING_EVIDENCE).toEqual({
      engineEvidence: [
        "packages/engine/src/reinforced-concrete-formula-family-closeout-audit.test.ts",
        "packages/engine/src/reinforced-concrete-family-formula-fit-audit.test.ts",
        "packages/engine/src/reinforced-concrete-low-confidence-edge-continuity.test.ts",
        "packages/engine/src/reinforced-concrete-visible-low-confidence-edge-continuity.test.ts",
        "packages/engine/src/impact-heavy-floor-planned-scope-benchmark.test.ts",
        "packages/engine/src/reinforced-concrete-floor-monotonicity.test.ts",
        "packages/engine/src/calculate-impact-only.test.ts"
      ],
      webEvidence: [
        "apps/web/features/workbench/heavy-concrete-formula-history-card-matrix.test.ts",
        "apps/web/features/workbench/heavy-concrete-formula-provenance-report-surface.test.ts",
        "apps/web/features/workbench/reinforced-concrete-low-confidence-impact-panels.test.ts"
      ],
      runtimeAnchors: [
        "packages/engine/src/heavy-concrete-published-upper-treatment-estimate.ts",
        "packages/engine/src/predictor-published-family-estimate.ts",
        "packages/engine/src/reinforced-concrete-combined-vinyl-elastic-ceiling-estimate.ts",
        "packages/engine/src/reinforced-concrete-low-confidence-airborne.ts",
        "packages/engine/src/impact-support.ts",
        "packages/engine/src/impact-predictor-status.ts"
      ],
      selectedBecause: [
        "the_heavy_concrete_widening_now_has_a_central_formula_family_closeout_audit",
        "the_final_explicit_parity_probe_closed_without_a_new_defended_widening_candidate",
        "the_vinyl_elastic_ceiling_branch_and_residual_family_formula_fit_now_dominate_honesty_risk",
        "tightening_compounds_value_on_the_most_owned_reinforced_concrete_corridor"
      ]
    });
  });
});
