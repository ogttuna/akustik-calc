import { describe, expect, it } from "vitest";

const POST_REINFORCED_CONCRETE_ACCURACY_REOPEN_NEXT_SLICE_SELECTION = {
  sliceId: "post_reinforced_concrete_accuracy_reopen_next_slice_selection_v1",
  latestClosedImplementationSlice: "reinforced_concrete_accuracy_reopen",
  selectedImplementationSlice: "dataholz_clt_calibration_tightening",
  selectedOutputSurface: "dataholz_clt_calibration_tightening_matrix",
  selectedRouteFamily: "mass_timber_clt_floor_lane",
  selectionStatus: "selected_runtime_clt_calibration_after_reinforced_concrete_reopen_closeout",
  numericRuntimeBehaviorChange: false,
  runtimeTightening: true,
  nextExecutionAction: "dataholz_clt_calibration_tightening",
  followUpPlanningAction: "post_dataholz_clt_calibration_tightening_next_slice_selection_v1"
} as const;

const POST_REINFORCED_CONCRETE_REOPEN_CLOSEOUT_CANDIDATE_MATRIX = [
  {
    id: "dataholz_clt_calibration_tightening",
    selectedNext: true,
    runtimeTighteningEligible: true,
    reason: "reinforced_concrete_low_confidence_corridor_is_now_explicitly_closed_so_clt_is_the_next_defended_tightening_family"
  },
  {
    id: "reinforced_concrete_accuracy_reopen",
    selectedNext: false,
    runtimeTighteningEligible: false,
    reason: "no_fourth_defended_boundary_remained_after_matrix_provenance_and_report_surfaces_closed_the_low_confidence_corridor"
  },
  {
    id: "dataholz_gdmtxa04a_visible_exact_reopen",
    selectedNext: false,
    runtimeTighteningEligible: false,
    reason: "blocked_until_the_material_surface_is_modeled_honestly_not_just_direct_id_exact"
  },
  {
    id: "raw_bare_open_box_open_web_impact_widening",
    selectedNext: false,
    runtimeTighteningEligible: false,
    reason: "blocked_until_bare_carrier_source_evidence_exists"
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

const CLOSED_REINFORCED_CONCRETE_REOPEN_EVIDENCE = {
  engineEvidence: [
    "packages/engine/src/reinforced-concrete-formula-family-closeout-audit.test.ts",
    "packages/engine/src/reinforced-concrete-family-formula-fit-audit.test.ts",
    "packages/engine/src/reinforced-concrete-low-confidence-edge-continuity.test.ts",
    "packages/engine/src/reinforced-concrete-visible-low-confidence-edge-continuity.test.ts",
    "packages/engine/src/reinforced-concrete-combined-vinyl-elastic-ceiling-estimate.test.ts",
    "packages/engine/src/reinforced-concrete-low-confidence-follow-up-matrix.test.ts",
    "packages/engine/src/reinforced-concrete-low-confidence-follow-up-origin-matrix.test.ts"
  ],
  webEvidence: [
    "apps/web/features/workbench/reinforced-concrete-low-confidence-impact-panels.test.ts",
    "apps/web/features/workbench/reinforced-concrete-low-confidence-follow-up-route-card-matrix.test.ts",
    "apps/web/features/workbench/reinforced-concrete-low-confidence-follow-up-provenance-matrix.test.ts",
    "apps/web/features/workbench/reinforced-concrete-low-confidence-diagnostics-dossier-matrix.test.ts",
    "apps/web/features/workbench/reinforced-concrete-low-confidence-consultant-trail-matrix.test.ts",
    "apps/web/features/workbench/reinforced-concrete-low-confidence-proposal-honesty.test.ts"
  ],
  closedBecause: [
    "the_vinyl_elastic_ceiling_corridor_is_explicitly_frozen_on_the_low_confidence_lane",
    "nearby_row_ranking_and_support_surfaces_now_stay_screening_only_under_hostile_history",
    "provenance_and_reporting_surfaces_no_longer_blur_the_low_confidence_lane_into_adjacent_formula_owned_concrete_boundaries",
    "no_fourth_defended_boundary_remains_inside_the_current_reinforced_concrete_follow_up_corridor"
  ]
} as const;

const SELECTED_DATAHOLZ_CLT_TIGHTENING_EVIDENCE = {
  engineEvidence: [
    "packages/engine/src/dataholz-clt-calibration-tightening-audit.test.ts",
    "packages/engine/src/dataholz-clt-source-truth-audit.test.ts",
    "packages/engine/src/floor-source-corpus-contract.test.ts"
  ],
  webEvidence: [
    "apps/web/features/workbench/dataholz-clt-source-truth-route.test.ts"
  ],
  runtimeAnchors: [
    "packages/engine/src/predictor-published-family-estimate.ts",
    "packages/engine/src/predictor-floor-system-estimate.ts",
    "packages/engine/src/floor-system-estimate.ts",
    "packages/engine/src/calculate-assembly.ts"
  ],
  selectedBecause: [
    "dataholz_clt_source_truth_is_already_pinned_for_exact_and_estimate_rows",
    "the_only_remaining_exact_only_slack_is_gdmtxa04a_and_it_is_explicitly_blocked_as_a_surface_decision",
    "clt_now_has_higher_roi_than_reopening_an_already_closed_reinforced_low_confidence_micro_corridor",
    "the_reinforced_concrete_follow_up_is_now_closed_without_needing_another_micro_pass"
  ]
} as const;

describe("post reinforced-concrete accuracy reopen next slice selection contract", () => {
  it("selects Dataholz CLT calibration tightening once the reinforced-concrete follow-up closes honestly", () => {
    expect(POST_REINFORCED_CONCRETE_ACCURACY_REOPEN_NEXT_SLICE_SELECTION).toEqual({
      sliceId: "post_reinforced_concrete_accuracy_reopen_next_slice_selection_v1",
      latestClosedImplementationSlice: "reinforced_concrete_accuracy_reopen",
      selectedImplementationSlice: "dataholz_clt_calibration_tightening",
      selectedOutputSurface: "dataholz_clt_calibration_tightening_matrix",
      selectedRouteFamily: "mass_timber_clt_floor_lane",
      selectionStatus: "selected_runtime_clt_calibration_after_reinforced_concrete_reopen_closeout",
      numericRuntimeBehaviorChange: false,
      runtimeTightening: true,
      nextExecutionAction: "dataholz_clt_calibration_tightening",
      followUpPlanningAction: "post_dataholz_clt_calibration_tightening_next_slice_selection_v1"
    });

    expect(
      POST_REINFORCED_CONCRETE_REOPEN_CLOSEOUT_CANDIDATE_MATRIX.find((candidate) => candidate.selectedNext)
    ).toEqual({
      id: "dataholz_clt_calibration_tightening",
      selectedNext: true,
      runtimeTighteningEligible: true,
      reason:
        "reinforced_concrete_low_confidence_corridor_is_now_explicitly_closed_so_clt_is_the_next_defended_tightening_family"
    });
  });

  it("keeps reinforced-concrete reopening and blocked source-family work out of the next active slice", () => {
    expect(
      POST_REINFORCED_CONCRETE_REOPEN_CLOSEOUT_CANDIDATE_MATRIX.filter(
        (candidate) => candidate.runtimeTighteningEligible
      )
    ).toEqual([
      {
        id: "dataholz_clt_calibration_tightening",
        selectedNext: true,
        runtimeTighteningEligible: true,
        reason:
          "reinforced_concrete_low_confidence_corridor_is_now_explicitly_closed_so_clt_is_the_next_defended_tightening_family"
      }
    ]);

    expect(
      POST_REINFORCED_CONCRETE_REOPEN_CLOSEOUT_CANDIDATE_MATRIX.find(
        (candidate) => candidate.id === "reinforced_concrete_accuracy_reopen"
      )
    ).toEqual({
      id: "reinforced_concrete_accuracy_reopen",
      selectedNext: false,
      runtimeTighteningEligible: false,
      reason:
        "no_fourth_defended_boundary_remained_after_matrix_provenance_and_report_surfaces_closed_the_low_confidence_corridor"
    });
  });

  it("ties the reinforced closeout and the new CLT selection to explicit engine and workbench evidence", () => {
    expect(CLOSED_REINFORCED_CONCRETE_REOPEN_EVIDENCE).toEqual({
      engineEvidence: [
        "packages/engine/src/reinforced-concrete-formula-family-closeout-audit.test.ts",
        "packages/engine/src/reinforced-concrete-family-formula-fit-audit.test.ts",
        "packages/engine/src/reinforced-concrete-low-confidence-edge-continuity.test.ts",
        "packages/engine/src/reinforced-concrete-visible-low-confidence-edge-continuity.test.ts",
        "packages/engine/src/reinforced-concrete-combined-vinyl-elastic-ceiling-estimate.test.ts",
        "packages/engine/src/reinforced-concrete-low-confidence-follow-up-matrix.test.ts",
        "packages/engine/src/reinforced-concrete-low-confidence-follow-up-origin-matrix.test.ts"
      ],
      webEvidence: [
        "apps/web/features/workbench/reinforced-concrete-low-confidence-impact-panels.test.ts",
        "apps/web/features/workbench/reinforced-concrete-low-confidence-follow-up-route-card-matrix.test.ts",
        "apps/web/features/workbench/reinforced-concrete-low-confidence-follow-up-provenance-matrix.test.ts",
        "apps/web/features/workbench/reinforced-concrete-low-confidence-diagnostics-dossier-matrix.test.ts",
        "apps/web/features/workbench/reinforced-concrete-low-confidence-consultant-trail-matrix.test.ts",
        "apps/web/features/workbench/reinforced-concrete-low-confidence-proposal-honesty.test.ts"
      ],
      closedBecause: [
        "the_vinyl_elastic_ceiling_corridor_is_explicitly_frozen_on_the_low_confidence_lane",
        "nearby_row_ranking_and_support_surfaces_now_stay_screening_only_under_hostile_history",
        "provenance_and_reporting_surfaces_no_longer_blur_the_low_confidence_lane_into_adjacent_formula_owned_concrete_boundaries",
        "no_fourth_defended_boundary_remains_inside_the_current_reinforced_concrete_follow_up_corridor"
      ]
    });

    expect(SELECTED_DATAHOLZ_CLT_TIGHTENING_EVIDENCE).toEqual({
      engineEvidence: [
        "packages/engine/src/dataholz-clt-calibration-tightening-audit.test.ts",
        "packages/engine/src/dataholz-clt-source-truth-audit.test.ts",
        "packages/engine/src/floor-source-corpus-contract.test.ts"
      ],
      webEvidence: [
        "apps/web/features/workbench/dataholz-clt-source-truth-route.test.ts"
      ],
      runtimeAnchors: [
        "packages/engine/src/predictor-published-family-estimate.ts",
        "packages/engine/src/predictor-floor-system-estimate.ts",
        "packages/engine/src/floor-system-estimate.ts",
        "packages/engine/src/calculate-assembly.ts"
      ],
      selectedBecause: [
        "dataholz_clt_source_truth_is_already_pinned_for_exact_and_estimate_rows",
        "the_only_remaining_exact_only_slack_is_gdmtxa04a_and_it_is_explicitly_blocked_as_a_surface_decision",
        "clt_now_has_higher_roi_than_reopening_an_already_closed_reinforced_low_confidence_micro_corridor",
        "the_reinforced_concrete_follow_up_is_now_closed_without_needing_another_micro_pass"
      ]
    });
  });
});
