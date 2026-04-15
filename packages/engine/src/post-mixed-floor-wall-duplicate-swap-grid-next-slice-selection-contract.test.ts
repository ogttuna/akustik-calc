import { describe, expect, it } from "vitest";

const POST_MIXED_FLOOR_WALL_DUPLICATE_SWAP_GRID_NEXT_SLICE_SELECTION = {
  sliceId: "post_mixed_floor_wall_duplicate_swap_grid_next_slice_selection_v1",
  selectedImplementationSlice: "mixed_floor_wall_requested_output_reset_grid_expansion_v1",
  selectedOutputSurface: "workbench_requested_output_defaults_and_restore_posture",
  selectedRouteFamily: "mixed_floor_wall_seeded_boundary_routes",
  selectionStatus: "selected_no_runtime_evidence_expansion",
  numericRuntimeBehaviorChange: false,
  runtimeWidening: false,
  nextExecutionAction: "mixed_floor_wall_requested_output_reset_grid_expansion_v1",
  followUpPlanningAction: "post_mixed_floor_wall_requested_output_reset_grid_next_slice_selection_v1"
} as const;

const SELECTED_SHARED_POSTURE_SCOPE = {
  currentSeededBoundaryRoutes: [
    "route-wall-held-aac",
    "route-wall-heavy-composite-hint-suppression",
    "route-dataholz-gdmtxa04a-boundary",
    "route-tuas-c11c-fail-closed",
    "route-open-box-exact",
    "route-open-web-bound"
  ],
  postureStressors: [
    "startStudyMode_default_requested_output_bundles",
    "opposite_mode_requested_output_resets",
    "save_load_requested_output_restore",
    "selected_route_support_bucket_projection_parity",
    "output_card_status_projection_after_restore"
  ],
  targetedEngineTest: "packages/engine/src/mixed-floor-wall-generated-matrix.test.ts",
  targetedWebTests: [
    "apps/web/features/workbench/mixed-study-mode-generated-matrix.test.ts",
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
    reason: "requested_output_reset_grid_should_land_before_formula_scope_expansion",
    runtimeWideningEligible: false
  },
  {
    id: "wall_selector_behavior_widening",
    reason: "requested_output_reset_grid_should_land_before_wall_selector_scope_expansion",
    runtimeWideningEligible: false
  }
] as const;

describe("post mixed floor/wall duplicate-swap grid next slice selection contract", () => {
  it("selects requested-output reset grid expansion before any runtime widening", () => {
    expect(POST_MIXED_FLOOR_WALL_DUPLICATE_SWAP_GRID_NEXT_SLICE_SELECTION).toEqual({
      sliceId: "post_mixed_floor_wall_duplicate_swap_grid_next_slice_selection_v1",
      selectedImplementationSlice: "mixed_floor_wall_requested_output_reset_grid_expansion_v1",
      selectedOutputSurface: "workbench_requested_output_defaults_and_restore_posture",
      selectedRouteFamily: "mixed_floor_wall_seeded_boundary_routes",
      selectionStatus: "selected_no_runtime_evidence_expansion",
      numericRuntimeBehaviorChange: false,
      runtimeWidening: false,
      nextExecutionAction: "mixed_floor_wall_requested_output_reset_grid_expansion_v1",
      followUpPlanningAction: "post_mixed_floor_wall_requested_output_reset_grid_next_slice_selection_v1"
    });
    expect(DEFERRED_IMMEDIATE_RUNTIME_CANDIDATES.filter((candidate) => candidate.runtimeWideningEligible)).toEqual([]);
  });

  it("keeps the next scope on the selected seeded route ledger and requested-output restore posture", () => {
    expect(SELECTED_SHARED_POSTURE_SCOPE).toEqual({
      currentSeededBoundaryRoutes: [
        "route-wall-held-aac",
        "route-wall-heavy-composite-hint-suppression",
        "route-dataholz-gdmtxa04a-boundary",
        "route-tuas-c11c-fail-closed",
        "route-open-box-exact",
        "route-open-web-bound"
      ],
      postureStressors: [
        "startStudyMode_default_requested_output_bundles",
        "opposite_mode_requested_output_resets",
        "save_load_requested_output_restore",
        "selected_route_support_bucket_projection_parity",
        "output_card_status_projection_after_restore"
      ],
      targetedEngineTest: "packages/engine/src/mixed-floor-wall-generated-matrix.test.ts",
      targetedWebTests: [
        "apps/web/features/workbench/mixed-study-mode-generated-matrix.test.ts",
        "apps/web/features/workbench/mixed-study-mode-output-card-snapshot-grid.test.ts"
      ]
    });
  });
});
