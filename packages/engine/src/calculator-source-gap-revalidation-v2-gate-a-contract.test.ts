import { existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const CALCULATOR_SOURCE_GAP_REVALIDATION_V2_GATE_A = {
  followUpPlanningAction: "post_floor_layer_order_invariance_expansion_v1_next_slice_selection_contract",
  landedGate: "gate_a_revalidate_source_accuracy_gap_order_after_wall_source_chain_no_runtime_closeout",
  latestClosedRuntimeOrSourceSlice: "wall_lined_massive_heavy_core_source_research_v1",
  nextExecutionAction: "floor_layer_order_invariance_expansion_v1_gate_a_role_defined_and_raw_order_audit",
  numericRuntimeBehaviorChange: false,
  runtimeTightening: false,
  runtimeWidening: false,
  selectedImplementationSlice: "floor_layer_order_invariance_expansion_v1",
  selectedOutputSurface: "floor_role_defined_vs_raw_order_invariance_matrix",
  selectedPlanningSurface: "docs/calculator/SLICE_FLOOR_LAYER_ORDER_INVARIANCE_EXPANSION_PLAN.md",
  selectedRouteFamily: "floor_layer_order_edit_accuracy_and_support_honesty",
  selectionStatus:
    "selected_no_runtime_floor_layer_order_accuracy_audit_after_source_gaps_remained_blocked",
  sliceId: "calculator_source_gap_revalidation_v2"
} as const;

const WALL_SOURCE_CHAIN_HOLDOUTS = [
  {
    id: "wall_no_stud_double_leaf",
    currentPosture: "formula_owned_source_blocked",
    docOwner:
      "docs/calculator/CHECKPOINT_2026-04-28_WALL_NO_STUD_DOUBLE_LEAF_SOURCE_RESEARCH_GATE_C_CLOSEOUT_HANDOFF.md",
    evidenceOwner:
      "packages/engine/src/post-wall-no-stud-double-leaf-source-research-v1-next-slice-selection-contract.test.ts",
    reason:
      "direct_rows_formula_tolerance_and_nrc_row_mapping_remain_incomplete_for_runtime_import",
    runtimeEligibleNow: false
  },
  {
    id: "wall_timber_double_board",
    currentPosture: "formula_low_confidence_source_blocked",
    docOwner:
      "docs/calculator/CHECKPOINT_2026-04-28_WALL_TIMBER_DOUBLE_BOARD_SOURCE_RESEARCH_GATE_C_CLOSEOUT_HANDOFF.md",
    evidenceOwner:
      "packages/engine/src/post-wall-timber-double-board-source-research-v1-next-slice-selection-contract.test.ts",
    reason:
      "single_board_resilient_and_secondary_benchmark_context_do_not_match_the_live_double_board_timber_stack",
    runtimeEligibleNow: false
  },
  {
    id: "wall_clt_mass_timber",
    currentPosture: "formula_medium_confidence_source_blocked",
    docOwner:
      "docs/calculator/CHECKPOINT_2026-04-28_WALL_CLT_WALL_SOURCE_RESEARCH_GATE_C_CLOSEOUT_HANDOFF.md",
    evidenceOwner:
      "packages/engine/src/post-wall-clt-wall-source-research-v1-next-slice-selection-contract.test.ts",
    reason:
      "dataholz_clt_rows_are_floor_only_and_no_wall_specific_clt_row_or_laminated_leaf_tolerance_owner_exists",
    runtimeEligibleNow: false
  },
  {
    id: "wall_lined_massive_heavy_core",
    currentPosture: "screening_no_wall_source_or_bounded_lining_rule",
    docOwner:
      "docs/calculator/CHECKPOINT_2026-04-28_WALL_LINED_MASSIVE_HEAVY_CORE_SOURCE_RESEARCH_GATE_C_CLOSEOUT_HANDOFF.md",
    evidenceOwner:
      "packages/engine/src/post-wall-lined-massive-heavy-core-source-research-v1-next-slice-selection-contract.test.ts",
    reason:
      "wall_specific_source_rows_are_missing_knauf_cc60_rows_are_floor_only_and_lining_formula_context_is_unbounded",
    runtimeEligibleNow: false
  }
] as const;

const BLOCKED_SOURCE_FAMILY_REVALIDATION = [
  {
    id: "dataholz_gdmtxa04a_visible_exact_reopen",
    currentPosture: "closed_fail_closed",
    evidenceOwner: "packages/engine/src/dataholz-gdmtxa04a-composite-surface-model-design.test.ts",
    reason:
      "visible_65mm_surface_still_represents_a_proxy_not_a_source_equivalent_composite_dry_screed_surface",
    runtimeEligibleNow: false
  },
  {
    id: "tuas_c11c_exact_import",
    currentPosture: "closed_fail_closed",
    evidenceOwner: "packages/engine/src/tuas-c11c-exact-import-readiness-design.test.ts",
    reason:
      "combined_wet_tuple_still_lacks_raw_spectrum_or_source_correction_evidence_for_an_honest_exact_import",
    runtimeEligibleNow: false
  },
  {
    id: "raw_bare_open_box_open_web_impact_widening",
    currentPosture: "closed_fail_closed",
    evidenceOwner: "packages/engine/src/raw-bare-open-web-open-box-source-evidence-rerank-contract.test.ts",
    reason:
      "source_rows_still_describe_packaged_systems_not_true_bare_carrier_impact_behavior",
    runtimeEligibleNow: false
  },
  {
    id: "wall_selector_behavior_widening",
    currentPosture: "closed_fail_closed",
    evidenceOwner: "packages/engine/src/blocked-source-rank-4-wall-selector-feasibility-contract.test.ts",
    reason: "no_fresh_classified_wall_selector_red_exists_beyond_the_closed_trace_guard",
    runtimeEligibleNow: false
  },
  {
    id: "floor_steel_fallback_low_confidence",
    currentPosture: "low_confidence_screening",
    evidenceOwner: "packages/engine/src/floor-fallback-low-confidence-gate-b-source-contract.test.ts",
    reason:
      "generated_stack_still_lacks_exact_pliteq_or_bounded_ubiq_topology_or_a_bounded_steel_open_web_family_rule",
    runtimeEligibleNow: false
  }
] as const;

const SOURCE_ACCURACY_RERANK = [
  {
    id: "floor_layer_order_invariance_expansion_v1",
    currentPosture: "engine_addressable_accuracy_audit_ready",
    firstGate:
      "gate_a_role_defined_exact_rows_raw_order_sensitive_rows_many_layer_reorder_and_card_honesty_inventory_no_runtime_change",
    reason:
      "source_import_candidates_are_blocked_but_broad_arbitrary_floor_reorder_value_invariance_is_still_unclaimed_and_user_layer_moves_are_a_direct_calculator_correctness_risk",
    selectedNext: true,
    runtimeEligibleNow: false,
    targetFile: "packages/engine/src/floor-layer-order-invariance-expansion-gate-a-contract.test.ts"
  },
  {
    id: "floor_field_continuation_expansion_reopen",
    currentPosture: "closed_representative_no_runtime_audit",
    firstGate: "not_selected_gate_a_already_found_no_required_gate_b_fix",
    reason:
      "representative_floor_field_and_building_continuation_surfaces_are_already_pinned_and_no_drift_was_found",
    selectedNext: false,
    runtimeEligibleNow: false,
    targetFile: "packages/engine/src/floor-field-continuation-gate-a-matrix.test.ts"
  },
  {
    id: "floor_fallback_runtime_promotion",
    currentPosture: "source_blocked_low_confidence_screening",
    firstGate: "not_selected_until_source_or_bounded_family_rule_exists",
    reason:
      "floor_steel_fallback_remains_low_confidence_without_exact_source_topology_or_bounded_steel_open_web_family_rule",
    selectedNext: false,
    runtimeEligibleNow: false,
    targetFile: "packages/engine/src/floor-fallback-low-confidence-gate-b-source-contract.test.ts"
  },
  {
    id: "wall_source_holdout_runtime_reopen",
    currentPosture: "source_blocked_after_wall_chain",
    firstGate: "not_selected_until_new_wall_specific_source_evidence_appears",
    reason:
      "no_stud_timber_double_board_clt_and_lined_massive_wall_holdouts_all_closed_no_runtime_without_import_ready_rows_or_bounded_tolerances",
    selectedNext: false,
    runtimeEligibleNow: false,
    targetFile: "packages/engine/src/post-wall-lined-massive-heavy-core-source-research-v1-next-slice-selection-contract.test.ts"
  },
  {
    id: "dynamic_airborne_optional_guard_carves",
    currentPosture: "optional_architecture_backlog",
    firstGate: "not_selected_without_new_calculator_risk",
    reason:
      "c6_architecture_hygiene_is_closed_and_remaining_recursive_guard_carves_do_not_outrank_a_user_visible_order_edit_accuracy_audit",
    selectedNext: false,
    runtimeEligibleNow: false,
    targetFile: "docs/calculator/DYNAMIC_AIRBORNE_CARTOGRAPHY.md"
  },
  {
    id: "productization_only_work",
    currentPosture: "deferred_while_calculator_accuracy_slice_is_ready",
    firstGate: "not_selected",
    reason:
      "calculator_accuracy_and_edge_case_resilience_remain_the_active_priority_and_a_bounded_calculator_audit_is_ready",
    selectedNext: false,
    runtimeEligibleNow: false,
    targetFile: "docs/calculator/POST_CALCULATOR_PRODUCTIZATION_ROADMAP.md"
  }
] as const;

const SELECTED_FLOOR_LAYER_ORDER_INVARIANCE_PLAN = {
  planningSurface: "docs/calculator/SLICE_FLOOR_LAYER_ORDER_INVARIANCE_EXPANSION_PLAN.md",
  requiredEvidenceFields: [
    "case_id_current_posture_and_user_visible_risk",
    "role_defined_or_raw_order_inferred_topology_class",
    "exact_bound_formula_screening_or_fail_closed_precedence_before_and_after_reorder",
    "numeric_value_finiteness_and_supported_unsupported_output_buckets",
    "paired_web_route_card_requirements_before_any_visible_copy_or_status_change",
    "gate_b_selection_only_if_gate_a_finds_concrete_runtime_or_card_drift"
  ],
  selectedBecause: [
    "it_is_engine_addressable_without_new_source_evidence",
    "it_targets_real_user_layer_move_and_reorder_behavior",
    "it_preserves_the_existing_no_broad_arbitrary_reorder_claim_boundary",
    "it_can_improve_private_use_confidence_with_a_bounded_no_runtime_gate_a_audit"
  ],
  targetFirstGateFile: "packages/engine/src/floor-layer-order-invariance-expansion-gate-a-contract.test.ts"
} as const;

const ACTIVE_BOUNDARIES = {
  disallowedMoves: [
    "change_calculator_runtime_values_during_source_gap_revalidation_gate_a",
    "claim_broad_arbitrary_floor_reorder_value_invariance_without_a_new_bounded_audit",
    "normalize_raw_floor_layer_order_as_if_all_orders_were_physically_equivalent",
    "reopen_wall_source_holdouts_floor_fallback_or_historical_blocked_source_families_from_nearby_green_tests",
    "change_support_confidence_evidence_text_or_route_card_copy_without_paired_tests",
    "resume_productization_before_the_selected_floor_layer_order_accuracy_slice_closes_or_priority_changes"
  ]
} as const;

describe("calculator source-gap revalidation v2 Gate A contract", () => {
  it("closes Gate A without runtime movement and selects floor layer-order invariance expansion", () => {
    expect(CALCULATOR_SOURCE_GAP_REVALIDATION_V2_GATE_A).toEqual({
      followUpPlanningAction: "post_floor_layer_order_invariance_expansion_v1_next_slice_selection_contract",
      landedGate: "gate_a_revalidate_source_accuracy_gap_order_after_wall_source_chain_no_runtime_closeout",
      latestClosedRuntimeOrSourceSlice: "wall_lined_massive_heavy_core_source_research_v1",
      nextExecutionAction: "floor_layer_order_invariance_expansion_v1_gate_a_role_defined_and_raw_order_audit",
      numericRuntimeBehaviorChange: false,
      runtimeTightening: false,
      runtimeWidening: false,
      selectedImplementationSlice: "floor_layer_order_invariance_expansion_v1",
      selectedOutputSurface: "floor_role_defined_vs_raw_order_invariance_matrix",
      selectedPlanningSurface: "docs/calculator/SLICE_FLOOR_LAYER_ORDER_INVARIANCE_EXPANSION_PLAN.md",
      selectedRouteFamily: "floor_layer_order_edit_accuracy_and_support_honesty",
      selectionStatus:
        "selected_no_runtime_floor_layer_order_accuracy_audit_after_source_gaps_remained_blocked",
      sliceId: "calculator_source_gap_revalidation_v2"
    });

    for (const path of [
      CALCULATOR_SOURCE_GAP_REVALIDATION_V2_GATE_A.selectedPlanningSurface,
      "docs/calculator/CHECKPOINT_2026-04-28_CALCULATOR_SOURCE_GAP_REVALIDATION_V2_GATE_A_HANDOFF.md",
      "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
      "docs/calculator/CURRENT_STATE.md"
    ]) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("keeps the closed wall source-chain holdouts source-blocked", () => {
    expect(WALL_SOURCE_CHAIN_HOLDOUTS.map((candidate) => candidate.id)).toEqual([
      "wall_no_stud_double_leaf",
      "wall_timber_double_board",
      "wall_clt_mass_timber",
      "wall_lined_massive_heavy_core"
    ]);
    expect(WALL_SOURCE_CHAIN_HOLDOUTS.every((candidate) => candidate.runtimeEligibleNow === false)).toBe(true);

    for (const path of WALL_SOURCE_CHAIN_HOLDOUTS.flatMap((candidate) => [candidate.docOwner, candidate.evidenceOwner])) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("keeps historical blocked source families and floor fallback closed", () => {
    expect(BLOCKED_SOURCE_FAMILY_REVALIDATION.map((candidate) => candidate.id)).toEqual([
      "dataholz_gdmtxa04a_visible_exact_reopen",
      "tuas_c11c_exact_import",
      "raw_bare_open_box_open_web_impact_widening",
      "wall_selector_behavior_widening",
      "floor_steel_fallback_low_confidence"
    ]);
    expect(BLOCKED_SOURCE_FAMILY_REVALIDATION.every((candidate) => candidate.runtimeEligibleNow === false)).toBe(true);

    for (const path of BLOCKED_SOURCE_FAMILY_REVALIDATION.map((candidate) => candidate.evidenceOwner)) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("selects the only currently ready source/accuracy candidate and defers lower-ROI work", () => {
    expect(SOURCE_ACCURACY_RERANK.filter((candidate) => candidate.selectedNext)).toEqual([
      {
        id: "floor_layer_order_invariance_expansion_v1",
        currentPosture: "engine_addressable_accuracy_audit_ready",
        firstGate:
          "gate_a_role_defined_exact_rows_raw_order_sensitive_rows_many_layer_reorder_and_card_honesty_inventory_no_runtime_change",
        reason:
          "source_import_candidates_are_blocked_but_broad_arbitrary_floor_reorder_value_invariance_is_still_unclaimed_and_user_layer_moves_are_a_direct_calculator_correctness_risk",
        selectedNext: true,
        runtimeEligibleNow: false,
        targetFile: "packages/engine/src/floor-layer-order-invariance-expansion-gate-a-contract.test.ts"
      }
    ]);
    expect(SOURCE_ACCURACY_RERANK.every((candidate) => candidate.runtimeEligibleNow === false)).toBe(true);
    expect(SOURCE_ACCURACY_RERANK.every((candidate) => candidate.reason.length > 60)).toBe(true);
  });

  it("defines the selected floor order-invariance planning surface before any runtime movement", () => {
    expect(SELECTED_FLOOR_LAYER_ORDER_INVARIANCE_PLAN).toEqual({
      planningSurface: "docs/calculator/SLICE_FLOOR_LAYER_ORDER_INVARIANCE_EXPANSION_PLAN.md",
      requiredEvidenceFields: [
        "case_id_current_posture_and_user_visible_risk",
        "role_defined_or_raw_order_inferred_topology_class",
        "exact_bound_formula_screening_or_fail_closed_precedence_before_and_after_reorder",
        "numeric_value_finiteness_and_supported_unsupported_output_buckets",
        "paired_web_route_card_requirements_before_any_visible_copy_or_status_change",
        "gate_b_selection_only_if_gate_a_finds_concrete_runtime_or_card_drift"
      ],
      selectedBecause: [
        "it_is_engine_addressable_without_new_source_evidence",
        "it_targets_real_user_layer_move_and_reorder_behavior",
        "it_preserves_the_existing_no_broad_arbitrary_reorder_claim_boundary",
        "it_can_improve_private_use_confidence_with_a_bounded_no_runtime_gate_a_audit"
      ],
      targetFirstGateFile: "packages/engine/src/floor-layer-order-invariance-expansion-gate-a-contract.test.ts"
    });
  });

  it("keeps runtime, source-family, broad-invariance, route-card, and productization boundaries closed", () => {
    expect(ACTIVE_BOUNDARIES.disallowedMoves).toEqual([
      "change_calculator_runtime_values_during_source_gap_revalidation_gate_a",
      "claim_broad_arbitrary_floor_reorder_value_invariance_without_a_new_bounded_audit",
      "normalize_raw_floor_layer_order_as_if_all_orders_were_physically_equivalent",
      "reopen_wall_source_holdouts_floor_fallback_or_historical_blocked_source_families_from_nearby_green_tests",
      "change_support_confidence_evidence_text_or_route_card_copy_without_paired_tests",
      "resume_productization_before_the_selected_floor_layer_order_accuracy_slice_closes_or_priority_changes"
    ]);
  });
});
