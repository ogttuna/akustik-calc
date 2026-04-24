import { describe, expect, it } from "vitest";

const POST_WALL_TIMBER_LIGHTWEIGHT_SOURCE_CORPUS_V1_NEXT_SLICE_SELECTION = {
  sliceId: "post_wall_timber_lightweight_source_corpus_v1_next_slice_selection_v1",
  latestClosedImplementationSlice: "wall_timber_lightweight_source_corpus_v1",
  selectedImplementationSlice: "wall_resilient_bar_side_count_modeling_v1",
  selectedPlanningSurface: "docs/calculator/SLICE_WALL_RESILIENT_BAR_SIDE_COUNT_MODELING_PLAN.md",
  selectedRouteFamily: "common_resilient_framed_wall_side_count",
  selectionStatus: "selected_after_source_corpus_closeout_to_model_missing_resilient_bar_side_count",
  gateAStatus: "landed_source_corpus_authored",
  gateBStatus: "landed_executable_source_audit_green",
  gateCStatus: "landed_direct_timber_exact_import_and_resilient_hold_decision",
  liveTimberPresetRuntimeBehaviorChange: false,
  commonWallExactCoverageExpanded: true,
  nextExecutionAction:
    "author_no_runtime_side_count_surface_audit_and_input_contract_before_ui_or_engine_model_changes"
} as const;

const CLOSED_SOURCE_CORPUS_EVIDENCE = {
  engineEvidence: [
    "packages/engine/src/wall-timber-lightweight-source-corpus-contract.test.ts",
    "packages/engine/src/wall-timber-lightweight-source-audit.test.ts",
    "packages/engine/src/airborne-verified-catalog.test.ts"
  ],
  webEvidence: ["apps/web/features/workbench/wall-direct-timber-exact-route-card-matrix.test.ts"],
  closedBecause: [
    "two_direct_timber_rows_were_precise_enough_for_exact_import_and_are_now_landed",
    "five_resilient_or_proprietary_rows_remain_non_exact_for_explicit_named_reasons",
    "linked_lightweight_steel_companions_remain_holdout_only",
    "the_live_timber_preset_still_lacks_a_true_exact_double_board_generic_topology_row"
  ]
} as const;

const SELECTED_RESILIENT_SIDE_COUNT_EVIDENCE = {
  firstRows: [
    "knauf_gb_en_tp_89_38_rb1_2x15_soundshield_plus_90_fill_lab_2026",
    "knauf_gb_en_tp_89_38_rb2_2x15_soundshield_plus_90_fill_lab_2026",
    "british_gypsum_a046005_timber_rb1_2x12p5_soundbloc_50apr_lab_2026",
    "british_gypsum_a046006_timber_rb2_2x12p5_soundbloc_50apr_lab_2026"
  ],
  selectedBecause: [
    "four_official_timber_rows_are_already_in_repo_and_their_main_remaining_gap_is_explicit_resilient_bar_side_count_modeling",
    "current_airborne_context_exposes_connection_type_and_stud_type_but_not_one_side_vs_both_sides_resilient_mounting",
    "adding_that_missing_input_dimension_is_higher_roi_than_speculating_on_the_direct_double_board_timber_formula_lane",
    "it_broadens_common_wall_coverage_with_source_backed_answers_without_reopening_blocked_floor_families"
  ]
} as const;

const KEPT_BOUNDARIES = {
  blockedSourceQueueUnchanged: [
    "GDMTXA04A_direct_exact",
    "C11c_exact_import",
    "raw_bare_open_box_open_web_impact",
    "wall_selector_behavior_widening"
  ],
  liveTimberPresetStillNeedsTrueExactTopologyRow: true,
  resilientRowsCannotPromoteByAdjacencyAlone: true,
  productizationRouteIntegrationDeferredNotDeleted: true
} as const;

describe("post wall timber/lightweight source corpus v1 next slice selection contract", () => {
  it("closes the source-corpus slice and selects resilient bar side-count modeling next", () => {
    expect(POST_WALL_TIMBER_LIGHTWEIGHT_SOURCE_CORPUS_V1_NEXT_SLICE_SELECTION).toEqual({
      sliceId: "post_wall_timber_lightweight_source_corpus_v1_next_slice_selection_v1",
      latestClosedImplementationSlice: "wall_timber_lightweight_source_corpus_v1",
      selectedImplementationSlice: "wall_resilient_bar_side_count_modeling_v1",
      selectedPlanningSurface: "docs/calculator/SLICE_WALL_RESILIENT_BAR_SIDE_COUNT_MODELING_PLAN.md",
      selectedRouteFamily: "common_resilient_framed_wall_side_count",
      selectionStatus: "selected_after_source_corpus_closeout_to_model_missing_resilient_bar_side_count",
      gateAStatus: "landed_source_corpus_authored",
      gateBStatus: "landed_executable_source_audit_green",
      gateCStatus: "landed_direct_timber_exact_import_and_resilient_hold_decision",
      liveTimberPresetRuntimeBehaviorChange: false,
      commonWallExactCoverageExpanded: true,
      nextExecutionAction:
        "author_no_runtime_side_count_surface_audit_and_input_contract_before_ui_or_engine_model_changes"
    });
  });

  it("ties the closeout to explicit exact-import, benchmark-only, and holdout evidence", () => {
    expect(CLOSED_SOURCE_CORPUS_EVIDENCE.engineEvidence).toContain(
      "packages/engine/src/wall-timber-lightweight-source-audit.test.ts"
    );
    expect(CLOSED_SOURCE_CORPUS_EVIDENCE.webEvidence).toContain(
      "apps/web/features/workbench/wall-direct-timber-exact-route-card-matrix.test.ts"
    );
    expect(CLOSED_SOURCE_CORPUS_EVIDENCE.closedBecause).toEqual([
      "two_direct_timber_rows_were_precise_enough_for_exact_import_and_are_now_landed",
      "five_resilient_or_proprietary_rows_remain_non_exact_for_explicit_named_reasons",
      "linked_lightweight_steel_companions_remain_holdout_only",
      "the_live_timber_preset_still_lacks_a_true_exact_double_board_generic_topology_row"
    ]);
  });

  it("selects side-count modeling because the remaining common-wall gap is a missing input dimension, not a missing heuristic", () => {
    expect(SELECTED_RESILIENT_SIDE_COUNT_EVIDENCE.firstRows).toEqual([
      "knauf_gb_en_tp_89_38_rb1_2x15_soundshield_plus_90_fill_lab_2026",
      "knauf_gb_en_tp_89_38_rb2_2x15_soundshield_plus_90_fill_lab_2026",
      "british_gypsum_a046005_timber_rb1_2x12p5_soundbloc_50apr_lab_2026",
      "british_gypsum_a046006_timber_rb2_2x12p5_soundbloc_50apr_lab_2026"
    ]);
    expect(SELECTED_RESILIENT_SIDE_COUNT_EVIDENCE.selectedBecause).toEqual([
      "four_official_timber_rows_are_already_in_repo_and_their_main_remaining_gap_is_explicit_resilient_bar_side_count_modeling",
      "current_airborne_context_exposes_connection_type_and_stud_type_but_not_one_side_vs_both_sides_resilient_mounting",
      "adding_that_missing_input_dimension_is_higher_roi_than_speculating_on_the_direct_double_board_timber_formula_lane",
      "it_broadens_common_wall_coverage_with_source_backed_answers_without_reopening_blocked_floor_families"
    ]);
  });

  it("keeps blocked-source and adjacency boundaries intact", () => {
    expect(KEPT_BOUNDARIES.blockedSourceQueueUnchanged).toEqual([
      "GDMTXA04A_direct_exact",
      "C11c_exact_import",
      "raw_bare_open_box_open_web_impact",
      "wall_selector_behavior_widening"
    ]);
    expect(KEPT_BOUNDARIES.liveTimberPresetStillNeedsTrueExactTopologyRow).toBe(true);
    expect(KEPT_BOUNDARIES.resilientRowsCannotPromoteByAdjacencyAlone).toBe(true);
    expect(KEPT_BOUNDARIES.productizationRouteIntegrationDeferredNotDeleted).toBe(true);
  });
});
