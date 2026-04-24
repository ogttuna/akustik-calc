import { describe, expect, it } from "vitest";

const POST_WALL_RESILIENT_SIDE_COUNT_GATE_C_V1_NEXT_SLICE_SELECTION = {
  sliceId: "post_wall_resilient_side_count_gate_c_v1_next_slice_selection_v1",
  closedImplementationSlice: "wall_resilient_bar_side_count_modeling_v1",
  latestLandedGate: "wall_resilient_bar_side_count_modeling_v1_gate_c",
  selectedImplementationSlice: "floor_field_continuation_expansion_v1",
  selectedPlanningSurface: "docs/calculator/SLICE_FLOOR_FIELD_CONTINUATION_EXPANSION_PLAN.md",
  selectedRouteFamily: "floor_field_and_building_continuation_surfaces",
  nextExecutionAction:
    "audit_and_pin_floor_lab_field_building_continuation_values_without_reopening_source_blocked_families"
} as const;

const LANDED_GATE_C_EVIDENCE = {
  exactRows: [
    "knauf_gb_en_tp_89_38_rb1_2x15_soundshield_plus_90_fill_lab_2026",
    "knauf_gb_en_tp_89_38_rb2_2x15_soundshield_plus_90_fill_lab_2026",
    "british_gypsum_a046005_timber_rb1_2x12p5_soundbloc_50apr_lab_2026",
    "british_gypsum_a046006_timber_rb2_2x12p5_soundbloc_50apr_lab_2026"
  ],
  exactReason: "resilient_bar_side_count_topology_exactly_representable",
  legacyAutoPosture: "value_stable_side_count_blind",
  explicitPosture: "source_backed_exact_lab_anchor_with_field_and_building_lab_fallback",
  implementationFiles: [
    "packages/engine/src/wall-timber-lightweight-source-corpus.ts",
    "packages/engine/src/airborne-verified-catalog.ts"
  ],
  executableProof: [
    "packages/engine/src/wall-resilient-bar-side-count-blind-audit.test.ts",
    "packages/engine/src/wall-timber-lightweight-source-corpus-contract.test.ts",
    "packages/engine/src/wall-timber-lightweight-source-audit.test.ts",
    "packages/engine/src/airborne-verified-catalog.test.ts",
    "apps/web/features/workbench/wall-resilient-bar-side-count-route-card-matrix.test.ts"
  ]
} as const;

const NEXT_SLICE_RATIONALE = {
  selectedBecause: [
    "wall_side_count_exact_coverage_has_landed_for_the_current_source_backed_common_wall_gap",
    "floor_coverage_is_deep_but_floor_field_and_building_continuations_are_not_yet_systematically_value_pinned",
    "the_next_accuracy_gain_is_a_bounded_audit_of_floor_RwPrime_DnW_DnA_DnTW_DnTA_continuations",
    "this_work_does_not_require_reopening_GDMTXA04A_C11c_or_bare_carrier_source_blocks"
  ],
  firstGate: "gate_a_inventory_current_floor_continuation_surfaces_no_runtime_change",
  deferredButNotCancelled: [
    "project_access_policy_route_integration_v1",
    "dynamic_airborne_split_refactor_v2",
    "dedicated_floor_50_plus_layer_regression"
  ]
} as const;

const ACTIVE_BOUNDARIES = {
  disallowedMoves: [
    "reopen_GDMTXA04A_direct_exact_without_composite_surface_source_model",
    "reopen_C11c_exact_import_without_resolving_the_combined_wet_tuple_anomaly",
    "infer_bare_open_box_or_open_web_impact_from_packaged_system_rows",
    "retune_wall_timber_or_resilient_formula_from_the_new_exact_rows",
    "resume_productization_route_integration_before_the_selected_calculator_slice_closes"
  ]
} as const;

describe("post wall resilient side-count Gate C next slice selection contract", () => {
  it("closes the resilient side-count slice and selects floor field continuation next", () => {
    expect(POST_WALL_RESILIENT_SIDE_COUNT_GATE_C_V1_NEXT_SLICE_SELECTION).toEqual({
      sliceId: "post_wall_resilient_side_count_gate_c_v1_next_slice_selection_v1",
      closedImplementationSlice: "wall_resilient_bar_side_count_modeling_v1",
      latestLandedGate: "wall_resilient_bar_side_count_modeling_v1_gate_c",
      selectedImplementationSlice: "floor_field_continuation_expansion_v1",
      selectedPlanningSurface: "docs/calculator/SLICE_FLOOR_FIELD_CONTINUATION_EXPANSION_PLAN.md",
      selectedRouteFamily: "floor_field_and_building_continuation_surfaces",
      nextExecutionAction:
        "audit_and_pin_floor_lab_field_building_continuation_values_without_reopening_source_blocked_families"
    });
  });

  it("ties Gate C closeout to exact rows and executable value evidence", () => {
    expect(LANDED_GATE_C_EVIDENCE.exactRows).toEqual([
      "knauf_gb_en_tp_89_38_rb1_2x15_soundshield_plus_90_fill_lab_2026",
      "knauf_gb_en_tp_89_38_rb2_2x15_soundshield_plus_90_fill_lab_2026",
      "british_gypsum_a046005_timber_rb1_2x12p5_soundbloc_50apr_lab_2026",
      "british_gypsum_a046006_timber_rb2_2x12p5_soundbloc_50apr_lab_2026"
    ]);
    expect(LANDED_GATE_C_EVIDENCE.exactReason).toBe("resilient_bar_side_count_topology_exactly_representable");
    expect(LANDED_GATE_C_EVIDENCE.legacyAutoPosture).toBe("value_stable_side_count_blind");
    expect(LANDED_GATE_C_EVIDENCE.explicitPosture).toBe(
      "source_backed_exact_lab_anchor_with_field_and_building_lab_fallback"
    );
    expect(LANDED_GATE_C_EVIDENCE.executableProof).toContain(
      "apps/web/features/workbench/wall-resilient-bar-side-count-route-card-matrix.test.ts"
    );
  });

  it("selects floor continuation because it improves accuracy coverage without blocked-source reopening", () => {
    expect(NEXT_SLICE_RATIONALE.selectedBecause).toEqual([
      "wall_side_count_exact_coverage_has_landed_for_the_current_source_backed_common_wall_gap",
      "floor_coverage_is_deep_but_floor_field_and_building_continuations_are_not_yet_systematically_value_pinned",
      "the_next_accuracy_gain_is_a_bounded_audit_of_floor_RwPrime_DnW_DnA_DnTW_DnTA_continuations",
      "this_work_does_not_require_reopening_GDMTXA04A_C11c_or_bare_carrier_source_blocks"
    ]);
    expect(NEXT_SLICE_RATIONALE.firstGate).toBe(
      "gate_a_inventory_current_floor_continuation_surfaces_no_runtime_change"
    );
    expect(NEXT_SLICE_RATIONALE.deferredButNotCancelled).toContain("project_access_policy_route_integration_v1");
  });

  it("keeps source-blocked and non-calculator boundaries closed", () => {
    expect(ACTIVE_BOUNDARIES.disallowedMoves).toEqual([
      "reopen_GDMTXA04A_direct_exact_without_composite_surface_source_model",
      "reopen_C11c_exact_import_without_resolving_the_combined_wet_tuple_anomaly",
      "infer_bare_open_box_or_open_web_impact_from_packaged_system_rows",
      "retune_wall_timber_or_resilient_formula_from_the_new_exact_rows",
      "resume_productization_route_integration_before_the_selected_calculator_slice_closes"
    ]);
  });
});
