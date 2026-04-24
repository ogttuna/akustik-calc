import { describe, expect, it } from "vitest";

const POST_WALL_FORMULA_FAMILY_WIDENING_V1_NEXT_SLICE_SELECTION = {
  sliceId: "post_wall_formula_family_widening_v1_next_slice_selection_v1",
  latestClosedImplementationSlice: "wall_formula_family_widening_v1",
  selectedImplementationSlice: "wall_timber_lightweight_source_corpus_v1",
  selectedPlanningSurface: "docs/calculator/SLICE_WALL_TIMBER_LIGHTWEIGHT_SOURCE_CORPUS_PLAN.md",
  selectedRouteFamily: "common_lightweight_wall_source_corpus",
  selectionStatus: "selected_no_runtime_closeout_after_gate_c_source_posture_recheck",
  gateAStatus: "landed_no_runtime_value_change",
  gateBStatus: "landed_live_workbench_dynamic_route_pinned",
  gateCStatus: "closed_no_runtime_precise_tightening_not_source_backed",
  numericRuntimeBehaviorChange: false,
  runtimeWidening: false,
  nextExecutionAction: "author_common_timber_lightweight_wall_source_corpus_and_classify_exact_vs_secondary_rows"
} as const;

const CLOSED_WALL_FORMULA_FAMILY_WIDENING_EVIDENCE = {
  engineEvidence: [
    "packages/engine/src/wall-formula-family-widening-audit.test.ts",
    "packages/engine/src/post-team-access-model-calculator-refocus-next-slice-selection-contract.test.ts"
  ],
  webEvidence: [
    "apps/web/features/workbench/wall-live-dynamic-preset-route-card-matrix.test.ts",
    "apps/web/features/workbench/wall-lsf-timber-stud-preset-benchmarks.test.ts",
    "apps/web/features/workbench/wall-field-continuation-completeness-matrix.test.ts"
  ],
  sourceAnchors: [
    "https://pubmed.ncbi.nlm.nih.gov/20136207/",
    "https://www.nature.com/articles/s41598-024-82403-w",
    "https://knauf.com/api/download-center/v1/assets/0f399ff9-ae51-4916-b290-c5f5d270a2e4?country=gb&download=true&locale=en-GB",
    "https://www.british-gypsum.com/documents/technical-specification/british-gypsum-ts-a046005-en.pdf",
    "https://www.british-gypsum.com/documents/technical-specification/british-gypsum-ts-a046006-en.pdf",
    "https://www.gyproc.ie/documents/system-specifications/a026025.pdf"
  ],
  closedBecause: [
    "gate_a_and_gate_b_proved_the_live_dynamic_timber_route_without_requiring_runtime_math_change",
    "available_sources_make_the_current_dynamic_result_plausible_but_not_precise_enough_for_a_targeted_trim",
    "official_rows_span_direct_timber_and_resilient_timber_topologies_but_do_not_exact_match_the_current_preset_stack",
    "the_honest_next_move_is_source_corpus_expansion_not_formula_guessing"
  ]
} as const;

const SELECTED_WALL_SOURCE_CORPUS_EVIDENCE = {
  firstSources: [
    "knauf_uk_timber_rows_rw_42_56_59",
    "british_gypsum_a046005_rw_55",
    "british_gypsum_a046006_rw_58",
    "gyproc_ie_a026025_rwdb_41"
  ],
  selectedBecause: [
    "common_lightweight_wall_questions_need_source_backed_answers_before_more_runtime_widening",
    "the_previous_slice_closed_the_route_authority_question_but_not_the_source_corpus_question",
    "this_slice_can_expand_accuracy_and_coverage_without_reopening_blocked_floor_families"
  ]
} as const;

describe("post wall formula family widening v1 next slice selection contract", () => {
  it("closes the wall formula-family slice no-runtime and selects the timber/lightweight source corpus slice", () => {
    expect(POST_WALL_FORMULA_FAMILY_WIDENING_V1_NEXT_SLICE_SELECTION).toEqual({
      sliceId: "post_wall_formula_family_widening_v1_next_slice_selection_v1",
      latestClosedImplementationSlice: "wall_formula_family_widening_v1",
      selectedImplementationSlice: "wall_timber_lightweight_source_corpus_v1",
      selectedPlanningSurface: "docs/calculator/SLICE_WALL_TIMBER_LIGHTWEIGHT_SOURCE_CORPUS_PLAN.md",
      selectedRouteFamily: "common_lightweight_wall_source_corpus",
      selectionStatus: "selected_no_runtime_closeout_after_gate_c_source_posture_recheck",
      gateAStatus: "landed_no_runtime_value_change",
      gateBStatus: "landed_live_workbench_dynamic_route_pinned",
      gateCStatus: "closed_no_runtime_precise_tightening_not_source_backed",
      numericRuntimeBehaviorChange: false,
      runtimeWidening: false,
      nextExecutionAction: "author_common_timber_lightweight_wall_source_corpus_and_classify_exact_vs_secondary_rows"
    });
  });

  it("ties the no-runtime closeout to explicit route, source, and posture evidence", () => {
    expect(CLOSED_WALL_FORMULA_FAMILY_WIDENING_EVIDENCE.engineEvidence).toContain(
      "packages/engine/src/wall-formula-family-widening-audit.test.ts"
    );
    expect(CLOSED_WALL_FORMULA_FAMILY_WIDENING_EVIDENCE.webEvidence).toContain(
      "apps/web/features/workbench/wall-live-dynamic-preset-route-card-matrix.test.ts"
    );
    expect(CLOSED_WALL_FORMULA_FAMILY_WIDENING_EVIDENCE.sourceAnchors).toContain(
      "https://pubmed.ncbi.nlm.nih.gov/20136207/"
    );
    expect(CLOSED_WALL_FORMULA_FAMILY_WIDENING_EVIDENCE.sourceAnchors).toContain(
      "https://www.british-gypsum.com/documents/technical-specification/british-gypsum-ts-a046006-en.pdf"
    );
    expect(CLOSED_WALL_FORMULA_FAMILY_WIDENING_EVIDENCE.closedBecause).toEqual([
      "gate_a_and_gate_b_proved_the_live_dynamic_timber_route_without_requiring_runtime_math_change",
      "available_sources_make_the_current_dynamic_result_plausible_but_not_precise_enough_for_a_targeted_trim",
      "official_rows_span_direct_timber_and_resilient_timber_topologies_but_do_not_exact_match_the_current_preset_stack",
      "the_honest_next_move_is_source_corpus_expansion_not_formula_guessing"
    ]);
  });

  it("selects a source-corpus slice instead of another runtime heuristic pass", () => {
    expect(SELECTED_WALL_SOURCE_CORPUS_EVIDENCE.firstSources).toEqual([
      "knauf_uk_timber_rows_rw_42_56_59",
      "british_gypsum_a046005_rw_55",
      "british_gypsum_a046006_rw_58",
      "gyproc_ie_a026025_rwdb_41"
    ]);
    expect(SELECTED_WALL_SOURCE_CORPUS_EVIDENCE.selectedBecause).toEqual([
      "common_lightweight_wall_questions_need_source_backed_answers_before_more_runtime_widening",
      "the_previous_slice_closed_the_route_authority_question_but_not_the_source_corpus_question",
      "this_slice_can_expand_accuracy_and_coverage_without_reopening_blocked_floor_families"
    ]);
  });
});
