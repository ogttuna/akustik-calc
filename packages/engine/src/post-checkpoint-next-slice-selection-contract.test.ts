import { describe, expect, it } from "vitest";

const POST_CHECKPOINT_NEXT_SLICE_SELECTION = {
  sliceId: "post_checkpoint_next_slice_selection_v1",
  selectedImplementationSlice: "clt_combined_anchor_history_replay_matrix_v1",
  selectedOutputSurface: "workbench_field_impact_cards",
  selectedRouteFamily: "tuas_combined_clt_anchors",
  selectionStatus: "implemented_no_runtime",
  runtimeBehaviorChange: false,
  nextPlanningAction: "post_clt_combined_anchor_history_next_slice_selection_v1"
} as const;

const REJECTED_BROADENING_CANDIDATES = [
  {
    id: "raw_bare_open_box_open_web_impact",
    reason: "still_no_bare_carrier_impact_source",
    runtimeWideningEligible: false
  },
  {
    id: "dataholz_gdmtxa04a_visible_exact_reopen",
    reason: "composite_dry_screed_surface_not_modeled_locally",
    runtimeWideningEligible: false
  },
  {
    id: "tuas_c11c_exact_import",
    reason: "weak_weighted_tuple_not_explained_by_frequency_or_source_correction",
    runtimeWideningEligible: false
  },
  {
    id: "wall_selector_architecture_widening",
    reason: "requires_fresh_classified_red_or_source_backed_trace_row",
    runtimeWideningEligible: false
  }
] as const;

const SELECTED_CLT_HISTORY_REPLAY_SCOPE = {
  exactAnchor: "tuas_c4c_clt260_measured_2026",
  failClosedBoundary: "under_described_combined_clt_lower_treatment_without_ceiling_cavity",
  predictorAnchor: "tuas_c5c_clt260_measured_2026",
  routeHistoryStressors: ["source_equivalent_split", "row_order_bounce", "save_load", "floor_wall_mode_detour"],
  workbenchTest: "apps/web/features/workbench/clt-combined-anchor-history-replay-matrix.test.ts"
} as const;

describe("post-checkpoint next slice selection contract", () => {
  it("selects the CLT combined anchor history replay guard after source-gap runtime widening stays closed", () => {
    expect(POST_CHECKPOINT_NEXT_SLICE_SELECTION).toEqual({
      sliceId: "post_checkpoint_next_slice_selection_v1",
      selectedImplementationSlice: "clt_combined_anchor_history_replay_matrix_v1",
      selectedOutputSurface: "workbench_field_impact_cards",
      selectedRouteFamily: "tuas_combined_clt_anchors",
      selectionStatus: "implemented_no_runtime",
      runtimeBehaviorChange: false,
      nextPlanningAction: "post_clt_combined_anchor_history_next_slice_selection_v1"
    });
    expect(REJECTED_BROADENING_CANDIDATES.filter((candidate) => candidate.runtimeWideningEligible)).toEqual([]);
  });

  it("keeps the selected history guard scoped to exact, predictor-backed, and fail-closed CLT combined routes", () => {
    expect(SELECTED_CLT_HISTORY_REPLAY_SCOPE).toEqual({
      exactAnchor: "tuas_c4c_clt260_measured_2026",
      failClosedBoundary: "under_described_combined_clt_lower_treatment_without_ceiling_cavity",
      predictorAnchor: "tuas_c5c_clt260_measured_2026",
      routeHistoryStressors: ["source_equivalent_split", "row_order_bounce", "save_load", "floor_wall_mode_detour"],
      workbenchTest: "apps/web/features/workbench/clt-combined-anchor-history-replay-matrix.test.ts"
    });
  });
});
