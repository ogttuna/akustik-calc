import { describe, expect, it } from "vitest";

const POST_CLT_COMBINED_ANCHOR_HISTORY_NEXT_SLICE_SELECTION = {
  sliceId: "post_clt_combined_anchor_history_next_slice_selection_v1",
  selectedImplementationSlice: "heavy_concrete_formula_history_card_matrix_v1",
  selectedOutputSurface: "workbench_field_impact_cards",
  selectedRouteFamily: "heavy_concrete_formula_floor_lane",
  selectionStatus: "implemented_no_runtime",
  runtimeBehaviorChange: false,
  nextPlanningAction: "post_heavy_concrete_formula_history_next_slice_selection_v1"
} as const;

const REJECTED_IMMEDIATE_RUNTIME_CANDIDATES = [
  {
    id: "raw_bare_open_box_open_web_impact_widening",
    reason: "still_no_bare_carrier_impact_source",
    runtimeWideningEligible: false
  },
  {
    id: "dataholz_gdmtxa04a_visible_exact_reopen",
    reason: "visible_surface_still_not_equivalent_to_composite_dry_screed_source",
    runtimeWideningEligible: false
  },
  {
    id: "tuas_c11c_exact_import",
    reason: "weak_weighted_tuple_still_unexplained_by_available_source_fields",
    runtimeWideningEligible: false
  },
  {
    id: "wall_selector_behavior_widening",
    reason: "no_new_classified_wall_selector_solver_bug_since_trace_checkpoint",
    runtimeWideningEligible: false
  }
] as const;

const SELECTED_HEAVY_CONCRETE_FORMULA_SCOPE = {
  formulaBases: [
    "predictor_bare_massive_floor_iso12354_annexc_estimate",
    "predictor_heavy_floating_floor_iso12354_annexc_estimate"
  ],
  outputSurface: "workbench_field_impact_cards",
  requestedOutputs: ["Rw", "Ln,w", "DeltaLw", "L'n,w", "L'nT,w"],
  routeHistoryStressors: ["source_equivalent_mass_split", "row_order_bounce", "save_load", "floor_wall_mode_detour"],
  workbenchTest: "apps/web/features/workbench/heavy-concrete-formula-history-card-matrix.test.ts"
} as const;

describe("post-CLT combined anchor history next slice selection contract", () => {
  it("selects the heavy-concrete formula lane before any new source-family widening", () => {
    expect(POST_CLT_COMBINED_ANCHOR_HISTORY_NEXT_SLICE_SELECTION).toEqual({
      sliceId: "post_clt_combined_anchor_history_next_slice_selection_v1",
      selectedImplementationSlice: "heavy_concrete_formula_history_card_matrix_v1",
      selectedOutputSurface: "workbench_field_impact_cards",
      selectedRouteFamily: "heavy_concrete_formula_floor_lane",
      selectionStatus: "implemented_no_runtime",
      runtimeBehaviorChange: false,
      nextPlanningAction: "post_heavy_concrete_formula_history_next_slice_selection_v1"
    });
    expect(REJECTED_IMMEDIATE_RUNTIME_CANDIDATES.filter((candidate) => candidate.runtimeWideningEligible)).toEqual([]);
  });

  it("keeps the selected formula guard scoped to formula ownership, not source-row import", () => {
    expect(SELECTED_HEAVY_CONCRETE_FORMULA_SCOPE).toEqual({
      formulaBases: [
        "predictor_bare_massive_floor_iso12354_annexc_estimate",
        "predictor_heavy_floating_floor_iso12354_annexc_estimate"
      ],
      outputSurface: "workbench_field_impact_cards",
      requestedOutputs: ["Rw", "Ln,w", "DeltaLw", "L'n,w", "L'nT,w"],
      routeHistoryStressors: ["source_equivalent_mass_split", "row_order_bounce", "save_load", "floor_wall_mode_detour"],
      workbenchTest: "apps/web/features/workbench/heavy-concrete-formula-history-card-matrix.test.ts"
    });
  });
});
