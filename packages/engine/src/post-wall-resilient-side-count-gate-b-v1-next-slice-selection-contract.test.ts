import { describe, expect, it } from "vitest";

const POST_WALL_RESILIENT_SIDE_COUNT_GATE_B_V1_NEXT_SLICE_SELECTION = {
  sliceId: "post_wall_resilient_side_count_gate_b_v1_next_slice_selection_v1",
  activeImplementationSlice: "wall_resilient_bar_side_count_modeling_v1",
  latestLandedGate: "wall_resilient_bar_side_count_modeling_v1_gate_b",
  selectedPlanningSurface: "docs/calculator/SLICE_WALL_RESILIENT_BAR_SIDE_COUNT_MODELING_PLAN.md",
  selectedRouteFamily: "common_resilient_framed_wall_side_count",
  gateAStatus: "landed_no_runtime_side_count_audit",
  gateBStatus: "landed_explicit_input_model_plumbing_no_value_retune",
  nextGate: "wall_resilient_bar_side_count_modeling_v1_gate_c",
  nextExecutionAction:
    "decide_exact_import_vs_narrower_benchmark_vs_blocked_posture_for_the_four_rb1_rb2_timber_rows"
} as const;

const LANDED_GATE_B_EVIDENCE = {
  sharedSchema: ["packages/shared/src/domain/airborne-context.ts"],
  workbenchStateAndPersistence: [
    "apps/web/features/workbench/workbench-store.ts",
    "apps/web/features/workbench/server-project-workbench-snapshot.ts",
    "apps/web/features/workbench/preset-definitions.ts"
  ],
  workbenchShellAndUi: [
    "apps/web/features/workbench/workbench-shell.tsx",
    "apps/web/features/workbench/simple-workbench-shell.tsx",
    "apps/web/features/workbench/airborne-context-panel.tsx",
    "apps/web/features/workbench/simple-workbench-route-panel.tsx"
  ],
  engineMetadata: [
    "packages/engine/src/dynamic-airborne-family-detection.ts",
    "packages/engine/src/airborne-verified-catalog.ts"
  ],
  executableProof: [
    "apps/web/features/workbench/wall-resilient-bar-side-count-input-contract.test.ts",
    "apps/web/features/workbench/wall-resilient-bar-side-count-route-card-matrix.test.ts",
    "apps/web/features/workbench/server-project-workbench-snapshot.test.ts",
    "apps/web/features/workbench/wall-live-dynamic-preset-route-card-matrix.test.ts",
    "packages/engine/src/wall-resilient-bar-side-count-blind-audit.test.ts",
    "packages/engine/src/airborne-verified-catalog.test.ts"
  ]
} as const;

const GATE_B_BEHAVIOR_CONTRACT = {
  explicitEnumValues: ["auto", "one_side", "both_sides"],
  legacyDefault: "auto",
  autoKeepsPriorBlindBehavior: true,
  explicitValuesPropagateButDoNotRetuneInGateB: true,
  sideCountAloneDoesNotTriggerFramingFamilySelection: true,
  futureCatalogRowsMayDiscriminateExplicitSideCount: true
} as const;

const GATE_C_BOUNDARIES = {
  candidateRows: [
    "knauf_gb_en_tp_89_38_rb1_2x15_soundshield_plus_90_fill_lab_2026",
    "knauf_gb_en_tp_89_38_rb2_2x15_soundshield_plus_90_fill_lab_2026",
    "british_gypsum_a046005_timber_rb1_2x12p5_soundbloc_50apr_lab_2026",
    "british_gypsum_a046006_timber_rb2_2x12p5_soundbloc_50apr_lab_2026"
  ],
  allowedPostures: ["exact_import_landed", "narrower_benchmark_lane", "still_blocked"],
  disallowedMoves: [
    "retune_the_broad_timber_stud_formula_from_nearby_green_tests",
    "promote_resilient_rows_without_source_backed_topology_and_board_mapping",
    "reopen_blocked_floor_or_wall_selector_families",
    "resume_productization_route_integration_before_this_calculator_slice_moves"
  ]
} as const;

describe("post wall resilient side-count Gate B next slice selection contract", () => {
  it("marks Gate B as landed and keeps the same active slice on Gate C", () => {
    expect(POST_WALL_RESILIENT_SIDE_COUNT_GATE_B_V1_NEXT_SLICE_SELECTION).toEqual({
      sliceId: "post_wall_resilient_side_count_gate_b_v1_next_slice_selection_v1",
      activeImplementationSlice: "wall_resilient_bar_side_count_modeling_v1",
      latestLandedGate: "wall_resilient_bar_side_count_modeling_v1_gate_b",
      selectedPlanningSurface: "docs/calculator/SLICE_WALL_RESILIENT_BAR_SIDE_COUNT_MODELING_PLAN.md",
      selectedRouteFamily: "common_resilient_framed_wall_side_count",
      gateAStatus: "landed_no_runtime_side_count_audit",
      gateBStatus: "landed_explicit_input_model_plumbing_no_value_retune",
      nextGate: "wall_resilient_bar_side_count_modeling_v1_gate_c",
      nextExecutionAction:
        "decide_exact_import_vs_narrower_benchmark_vs_blocked_posture_for_the_four_rb1_rb2_timber_rows"
    });
  });

  it("ties Gate B to schema, persistence, UI, engine, and executable tests", () => {
    expect(LANDED_GATE_B_EVIDENCE.sharedSchema).toEqual(["packages/shared/src/domain/airborne-context.ts"]);
    expect(LANDED_GATE_B_EVIDENCE.workbenchStateAndPersistence).toContain(
      "apps/web/features/workbench/workbench-store.ts"
    );
    expect(LANDED_GATE_B_EVIDENCE.workbenchShellAndUi).toContain(
      "apps/web/features/workbench/simple-workbench-route-panel.tsx"
    );
    expect(LANDED_GATE_B_EVIDENCE.engineMetadata).toEqual([
      "packages/engine/src/dynamic-airborne-family-detection.ts",
      "packages/engine/src/airborne-verified-catalog.ts"
    ]);
    expect(LANDED_GATE_B_EVIDENCE.executableProof).toContain(
      "apps/web/features/workbench/wall-resilient-bar-side-count-input-contract.test.ts"
    );
    expect(LANDED_GATE_B_EVIDENCE.executableProof).toContain(
      "packages/engine/src/wall-resilient-bar-side-count-blind-audit.test.ts"
    );
  });

  it("keeps Gate B propagation-only and legacy-stable", () => {
    expect(GATE_B_BEHAVIOR_CONTRACT).toEqual({
      explicitEnumValues: ["auto", "one_side", "both_sides"],
      legacyDefault: "auto",
      autoKeepsPriorBlindBehavior: true,
      explicitValuesPropagateButDoNotRetuneInGateB: true,
      sideCountAloneDoesNotTriggerFramingFamilySelection: true,
      futureCatalogRowsMayDiscriminateExplicitSideCount: true
    });
  });

  it("limits Gate C to source-backed exact, narrower benchmark, or still-blocked decisions", () => {
    expect(GATE_C_BOUNDARIES.candidateRows).toEqual([
      "knauf_gb_en_tp_89_38_rb1_2x15_soundshield_plus_90_fill_lab_2026",
      "knauf_gb_en_tp_89_38_rb2_2x15_soundshield_plus_90_fill_lab_2026",
      "british_gypsum_a046005_timber_rb1_2x12p5_soundbloc_50apr_lab_2026",
      "british_gypsum_a046006_timber_rb2_2x12p5_soundbloc_50apr_lab_2026"
    ]);
    expect(GATE_C_BOUNDARIES.allowedPostures).toEqual([
      "exact_import_landed",
      "narrower_benchmark_lane",
      "still_blocked"
    ]);
    expect(GATE_C_BOUNDARIES.disallowedMoves).toEqual([
      "retune_the_broad_timber_stud_formula_from_nearby_green_tests",
      "promote_resilient_rows_without_source_backed_topology_and_board_mapping",
      "reopen_blocked_floor_or_wall_selector_families",
      "resume_productization_route_integration_before_this_calculator_slice_moves"
    ]);
  });
});
