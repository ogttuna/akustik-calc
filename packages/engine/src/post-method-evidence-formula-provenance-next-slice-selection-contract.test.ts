import { describe, expect, it } from "vitest";

const POST_METHOD_EVIDENCE_FORMULA_PROVENANCE_NEXT_SLICE_SELECTION = {
  sliceId: "post_method_evidence_formula_provenance_next_slice_selection_v1",
  selectedImplementationSlice: "mixed_floor_wall_seeded_cross_mode_chain_expansion_v1",
  selectedOutputSurface: "workbench_saved_scenario_replay_and_output_cards",
  selectedRouteFamily: "mixed_floor_wall_seeded_boundary_routes",
  selectionStatus: "selected_no_runtime_evidence_expansion",
  numericRuntimeBehaviorChange: false,
  runtimeWidening: false,
  nextExecutionAction: "mixed_floor_wall_seeded_cross_mode_chain_expansion_v1",
  followUpPlanningAction: "post_mixed_floor_wall_seeded_cross_mode_chain_next_slice_selection_v1"
} as const;

const SELECTED_SHARED_TORTURE_SCOPE = {
  currentSeededBoundaryRoutes: [
    "route-wall-held-aac",
    "route-wall-heavy-composite-hint-suppression",
    "route-dataholz-gdmtxa04a-boundary",
    "route-tuas-c11c-fail-closed",
    "route-open-box-exact",
    "route-open-web-bound"
  ],
  historyStressors: [
    "duplicate_and_split_edits",
    "reorder_move_up_move_down_chains",
    "partial_delete_and_rebuild",
    "opposite_mode_detours",
    "save_load_retention_pressure"
  ],
  targetedEngineTest: "packages/engine/src/mixed-floor-wall-complex-stack.test.ts",
  targetedWebTests: [
    "apps/web/features/workbench/mixed-study-mode-torture.test.ts",
    "apps/web/features/workbench/mixed-study-mode-output-card-snapshot-grid.test.ts"
  ]
} as const;

const DEFERRED_IMMEDIATE_RUNTIME_CANDIDATES = [
  {
    id: "raw_bare_open_box_open_web_impact_widening",
    reason: "still_no_bare_carrier_impact_source",
    runtimeWideningEligible: false
  },
  {
    id: "dataholz_gdmtxa04a_visible_exact_reopen",
    reason: "composite_dry_screed_surface_model_still_missing",
    runtimeWideningEligible: false
  },
  {
    id: "tuas_c11c_exact_import",
    reason: "weak_weighted_tuple_still_unexplained_by_available_source_fields",
    runtimeWideningEligible: false
  },
  {
    id: "broad_heavy_concrete_formula_family_widening",
    reason: "shared_torture_pass_should_land_before_formula_scope_expansion",
    runtimeWideningEligible: false
  },
  {
    id: "wall_selector_behavior_widening",
    reason: "mixed_stack_torture_pass_still_needs_broader_seeded_chain_evidence",
    runtimeWideningEligible: false
  }
] as const;

describe("post-method evidence formula provenance next slice selection contract", () => {
  it("selects the shared mixed floor/wall seeded chain expansion before runtime widening", () => {
    expect(POST_METHOD_EVIDENCE_FORMULA_PROVENANCE_NEXT_SLICE_SELECTION).toEqual({
      sliceId: "post_method_evidence_formula_provenance_next_slice_selection_v1",
      selectedImplementationSlice: "mixed_floor_wall_seeded_cross_mode_chain_expansion_v1",
      selectedOutputSurface: "workbench_saved_scenario_replay_and_output_cards",
      selectedRouteFamily: "mixed_floor_wall_seeded_boundary_routes",
      selectionStatus: "selected_no_runtime_evidence_expansion",
      numericRuntimeBehaviorChange: false,
      runtimeWidening: false,
      nextExecutionAction: "mixed_floor_wall_seeded_cross_mode_chain_expansion_v1",
      followUpPlanningAction: "post_mixed_floor_wall_seeded_cross_mode_chain_next_slice_selection_v1"
    });
    expect(DEFERRED_IMMEDIATE_RUNTIME_CANDIDATES.filter((candidate) => candidate.runtimeWideningEligible)).toEqual([]);
  });

  it("keeps the selected scope on seeded mixed boundary routes rather than new source families", () => {
    expect(SELECTED_SHARED_TORTURE_SCOPE).toEqual({
      currentSeededBoundaryRoutes: [
        "route-wall-held-aac",
        "route-wall-heavy-composite-hint-suppression",
        "route-dataholz-gdmtxa04a-boundary",
        "route-tuas-c11c-fail-closed",
        "route-open-box-exact",
        "route-open-web-bound"
      ],
      historyStressors: [
        "duplicate_and_split_edits",
        "reorder_move_up_move_down_chains",
        "partial_delete_and_rebuild",
        "opposite_mode_detours",
        "save_load_retention_pressure"
      ],
      targetedEngineTest: "packages/engine/src/mixed-floor-wall-complex-stack.test.ts",
      targetedWebTests: [
        "apps/web/features/workbench/mixed-study-mode-torture.test.ts",
        "apps/web/features/workbench/mixed-study-mode-output-card-snapshot-grid.test.ts"
      ]
    });
  });
});
