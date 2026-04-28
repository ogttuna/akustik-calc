import { existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const POST_FLOOR_LAYER_ORDER_INVARIANCE_EXPANSION_GATE_C_NEXT_SLICE_SELECTION = {
  closedImplementationSlice: "floor_layer_order_invariance_expansion_v1",
  latestLandedGate:
    "floor_layer_order_invariance_expansion_v1_gate_a_role_defined_vs_raw_order_inventory_no_runtime",
  nextExecutionAction:
    "gate_a_inventory_framed_wall_board_facing_split_warning_drift_no_runtime_change",
  numericRuntimeBehaviorChange: false,
  routeCardWorkRequiredNow: false,
  runtimeWidening: false,
  selectedImplementationSlice: "wall_framed_facing_split_warning_stability_v1",
  selectedPlanningSurface:
    "docs/calculator/SLICE_WALL_FRAMED_FACING_SPLIT_WARNING_STABILITY_PLAN.md",
  selectedRouteFamily: "wall_framed_split_warning_honesty",
  selectionStatus:
    "selected_no_runtime_after_floor_order_expansion_closed_without_runtime_or_card_drift",
  sliceId: "post_floor_layer_order_invariance_expansion_v1_next_slice_selection"
} as const;

const FLOOR_ORDER_INVARIANCE_CLOSEOUT = {
  closedBecause: [
    "gate_a_preserved_role_defined_ubiq_fl28_exact_values_under_reverse_rotate_base_first_grouped_and_interleaved_order_edits",
    "gate_a_preserved_role_defined_dataholz_gdmtxn01_exact_values_under_reverse_rotate_base_first_grouped_and_interleaved_order_edits",
    "gate_a_kept_raw_terminal_concrete_helper_support_changes_visible_instead_of_fabricating_order_invariance",
    "gate_a_kept_raw_open_web_impact_outputs_fail_closed_after_reorder",
    "gate_a_kept_many_layer_split_raw_concrete_stacks_finite_without_exact_or_bound_promotion",
    "gate_a_found_no_route_card_movement_requirement_because_no_visible_support_confidence_evidence_warning_or_value_changed"
  ],
  executableProof: [
    "packages/engine/src/floor-layer-order-invariance-expansion-gate-a-contract.test.ts",
    "docs/calculator/CHECKPOINT_2026-04-28_FLOOR_LAYER_ORDER_INVARIANCE_EXPANSION_GATE_A_HANDOFF.md",
    "docs/calculator/SLICE_FLOOR_LAYER_ORDER_INVARIANCE_EXPANSION_PLAN.md"
  ],
  gateBDecision: "not_required_by_gate_a_findings",
  keptRuntimePosture: {
    broadArbitraryRawFloorReorderValueInvarianceClaimed: false,
    numericRuntimeBehaviorChange: false,
    sourceFamilyReopened: false,
    visibleRouteCardMovement: false
  },
  posture: "no_runtime_gate_a_inventory_closed_without_gate_b_fix"
} as const;

const NEXT_SLICE_SELECTION_MATRIX = [
  {
    id: "wall_framed_facing_split_warning_stability_v1",
    reason:
      "f3_is_the_remaining_documented_non_source_blocked_calculator_drift_warning_only_on_framed_wall_board_facing_splits_numeric_outputs_are_unchanged_but_warning_honesty_matters_for_user_split_edit_confidence",
    selectedNext: true,
    targetFile: "packages/engine/src/wall-framed-facing-split-warning-stability-gate-a-contract.test.ts"
  },
  {
    id: "source_blocked_runtime_widening_reopens",
    reason:
      "gdmtxa04a_c11c_raw_bare_open_box_open_web_floor_fallback_no_stud_timber_double_board_clt_and_lined_massive_holdouts_still_lack_new_source_evidence_or_bounded_tolerance_owners",
    selectedNext: false,
    targetFile: "docs/calculator/SOURCE_GAP_LEDGER.md"
  },
  {
    id: "deep_hybrid_swap_value_pins",
    reason:
      "optional_value_pinning_backlog_has_lower_user_visible_risk_than_the_named_f3_split_warning_drift_and_existing_invariant_pins_already_guard_the_surface",
    selectedNext: false,
    targetFile: "docs/calculator/CURRENT_STATE.md"
  },
  {
    id: "remaining_dynamic_airborne_recursive_guard_carves",
    reason:
      "optional_architecture_backlog_after_c6_closed_dynamic_airborne_ts_is_under_the_line_limit_and_does_not_outrank_a_known_warning_honesty_drift",
    selectedNext: false,
    targetFile: "docs/calculator/DYNAMIC_AIRBORNE_CARTOGRAPHY.md"
  },
  {
    id: "productization_only_work",
    reason:
      "calculator_accuracy_and_edge_case_honesty_remain_the_active_priority_and_productization_should_not_resume_from_a_nearby_green_calculator_closeout",
    selectedNext: false,
    targetFile: "docs/calculator/POST_CALCULATOR_PRODUCTIZATION_ROADMAP.md"
  }
] as const;

const SELECTED_WALL_FRAMED_FACING_SPLIT_WARNING_GATE_A = {
  firstGate: "gate_a_inventory_framed_wall_board_facing_split_warning_drift_no_runtime_change",
  requiredEvidenceFields: [
    "baseline_vs_board_facing_split_values_for_representative_lsf_and_timber_framed_wall_stacks",
    "warnings_before_and_after_facing_split_with_numeric_outputs_pinned_equal",
    "negative_boundary_proving_no_global_entry_coalescing_or_board_topology_merge_is_allowed",
    "paired_web_route_card_requirement_before_any_visible_warning_copy_or_status_change",
    "selected_next_action_gate_b_fix_only_if_warning_drift_is_concrete_and_fixable_without_value_drift"
  ],
  requiredPlanningSurfaces: [
    "docs/calculator/SLICE_WALL_FRAMED_FACING_SPLIT_WARNING_STABILITY_PLAN.md",
    "docs/calculator/CURRENT_STATE.md",
    "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
    "docs/calculator/MASTER_PLAN.md"
  ],
  runtimeBehaviorChange: false,
  targetFirstGateFile:
    "packages/engine/src/wall-framed-facing-split-warning-stability-gate-a-contract.test.ts"
} as const;

const ACTIVE_BOUNDARIES = {
  disallowedMoves: [
    "change_floor_order_gate_a_values_support_buckets_or_evidence_during_gate_c_closeout",
    "claim_broad_arbitrary_raw_floor_layer_order_value_invariance",
    "add_global_same_material_entry_coalescing_for_wall_boards_without_proving_framed_wall_benchmarks_stay_green",
    "merge_physically_distinct_board_layers_as_a_source_or_catalog_equivalence_rule",
    "reopen_source_blocked_floor_or_wall_families_from_the_floor_order_green_result",
    "change_visible_route_card_warning_copy_without_paired_web_route_card_tests"
  ]
} as const;

describe("post floor layer-order invariance expansion Gate C next-slice selection contract", () => {
  it("closes the expanded floor order slice no-runtime and selects framed-wall split warning stability", () => {
    expect(POST_FLOOR_LAYER_ORDER_INVARIANCE_EXPANSION_GATE_C_NEXT_SLICE_SELECTION).toEqual({
      closedImplementationSlice: "floor_layer_order_invariance_expansion_v1",
      latestLandedGate:
        "floor_layer_order_invariance_expansion_v1_gate_a_role_defined_vs_raw_order_inventory_no_runtime",
      nextExecutionAction:
        "gate_a_inventory_framed_wall_board_facing_split_warning_drift_no_runtime_change",
      numericRuntimeBehaviorChange: false,
      routeCardWorkRequiredNow: false,
      runtimeWidening: false,
      selectedImplementationSlice: "wall_framed_facing_split_warning_stability_v1",
      selectedPlanningSurface:
        "docs/calculator/SLICE_WALL_FRAMED_FACING_SPLIT_WARNING_STABILITY_PLAN.md",
      selectedRouteFamily: "wall_framed_split_warning_honesty",
      selectionStatus:
        "selected_no_runtime_after_floor_order_expansion_closed_without_runtime_or_card_drift",
      sliceId: "post_floor_layer_order_invariance_expansion_v1_next_slice_selection"
    });

    for (const path of [
      POST_FLOOR_LAYER_ORDER_INVARIANCE_EXPANSION_GATE_C_NEXT_SLICE_SELECTION.selectedPlanningSurface,
      "docs/calculator/CHECKPOINT_2026-04-28_FLOOR_LAYER_ORDER_INVARIANCE_EXPANSION_GATE_C_CLOSEOUT_HANDOFF.md",
      "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
      "docs/calculator/CURRENT_STATE.md"
    ]) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("ties closeout to the expanded Gate A floor-order evidence without moving runtime", () => {
    expect(FLOOR_ORDER_INVARIANCE_CLOSEOUT.posture).toBe(
      "no_runtime_gate_a_inventory_closed_without_gate_b_fix"
    );
    expect(FLOOR_ORDER_INVARIANCE_CLOSEOUT.gateBDecision).toBe("not_required_by_gate_a_findings");
    expect(FLOOR_ORDER_INVARIANCE_CLOSEOUT.keptRuntimePosture).toEqual({
      broadArbitraryRawFloorReorderValueInvarianceClaimed: false,
      numericRuntimeBehaviorChange: false,
      sourceFamilyReopened: false,
      visibleRouteCardMovement: false
    });

    for (const path of FLOOR_ORDER_INVARIANCE_CLOSEOUT.executableProof) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("selects the documented F3 split-warning drift before optional or source-blocked work", () => {
    expect(NEXT_SLICE_SELECTION_MATRIX.filter((candidate) => candidate.selectedNext)).toEqual([
      {
        id: "wall_framed_facing_split_warning_stability_v1",
        reason:
          "f3_is_the_remaining_documented_non_source_blocked_calculator_drift_warning_only_on_framed_wall_board_facing_splits_numeric_outputs_are_unchanged_but_warning_honesty_matters_for_user_split_edit_confidence",
        selectedNext: true,
        targetFile: "packages/engine/src/wall-framed-facing-split-warning-stability-gate-a-contract.test.ts"
      }
    ]);
    expect(NEXT_SLICE_SELECTION_MATRIX.every((candidate) => candidate.reason.length > 60)).toBe(true);
  });

  it("defines the first gate of the selected warning-stability slice before any fix", () => {
    expect(SELECTED_WALL_FRAMED_FACING_SPLIT_WARNING_GATE_A).toEqual({
      firstGate: "gate_a_inventory_framed_wall_board_facing_split_warning_drift_no_runtime_change",
      requiredEvidenceFields: [
        "baseline_vs_board_facing_split_values_for_representative_lsf_and_timber_framed_wall_stacks",
        "warnings_before_and_after_facing_split_with_numeric_outputs_pinned_equal",
        "negative_boundary_proving_no_global_entry_coalescing_or_board_topology_merge_is_allowed",
        "paired_web_route_card_requirement_before_any_visible_warning_copy_or_status_change",
        "selected_next_action_gate_b_fix_only_if_warning_drift_is_concrete_and_fixable_without_value_drift"
      ],
      requiredPlanningSurfaces: [
        "docs/calculator/SLICE_WALL_FRAMED_FACING_SPLIT_WARNING_STABILITY_PLAN.md",
        "docs/calculator/CURRENT_STATE.md",
        "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
        "docs/calculator/MASTER_PLAN.md"
      ],
      runtimeBehaviorChange: false,
      targetFirstGateFile:
        "packages/engine/src/wall-framed-facing-split-warning-stability-gate-a-contract.test.ts"
    });
  });

  it("keeps broad floor-order, source-family, board-topology, and route-card boundaries closed", () => {
    expect(ACTIVE_BOUNDARIES.disallowedMoves).toEqual([
      "change_floor_order_gate_a_values_support_buckets_or_evidence_during_gate_c_closeout",
      "claim_broad_arbitrary_raw_floor_layer_order_value_invariance",
      "add_global_same_material_entry_coalescing_for_wall_boards_without_proving_framed_wall_benchmarks_stay_green",
      "merge_physically_distinct_board_layers_as_a_source_or_catalog_equivalence_rule",
      "reopen_source_blocked_floor_or_wall_families_from_the_floor_order_green_result",
      "change_visible_route_card_warning_copy_without_paired_web_route_card_tests"
    ]);
  });
});
