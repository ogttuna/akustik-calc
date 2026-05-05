import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

type RuntimeReadiness = {
  exactLiveTopologyMappingNamed: boolean;
  exactSourceRowsNamed: boolean;
  floorRolePromptPolicyNamed: boolean;
  localMaterialMappingNamed: boolean;
  metricOwnerNamed: boolean;
  pairedEngineVisibleTestsNamed: boolean;
  pairedWebVisibleTestsNamed: boolean;
  protectedNegativeBoundariesNamed: boolean;
  rightsSafeCurrentPayloadAvailable: boolean;
  runtimeImportReadyNow: false;
  sourceLocatorConcrete: boolean;
  toleranceOwnerNamed: boolean;
};

type V16Candidate = {
  currentPosture: string;
  docOwner: string;
  executableTestOwner: string;
  firstMissingRequirement: string;
  id: string;
  protectedNegativeBoundaries: readonly string[];
  rank: number;
  readiness: RuntimeReadiness;
  reason: string;
  runtimeBehaviorChange: false;
  selectedNext: boolean;
  targetFile: string;
  userVisibleRisk: string;
  validationScope: readonly string[];
};

const CALCULATOR_SOURCE_GAP_REVALIDATION_V16_GATE_A = {
  apiShapeChange: false,
  confidencePromotion: false,
  evidencePromotion: false,
  landedGate: "gate_a_revalidate_source_accuracy_gap_order_after_lane_drift_guard_runtime_landing",
  latestClosedSlice: "route_family_lane_drift_common_stack_watchlist_v1",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: false,
  outputSupportChange: false,
  proposalReportCopyChange: false,
  routeCardValueChange: false,
  runtimeImportSelectedNow: false,
  runtimeTightening: false,
  runtimeWidening: false,
  selectedImplementationSlice: "floor_raw_role_inference_guardrail_v1",
  selectedPlanningSurface: "docs/calculator/SLICE_FLOOR_RAW_ROLE_INFERENCE_GUARDRAIL_PLAN.md",
  selectedRouteFamily: "floor_raw_role_inference_guardrail_no_runtime",
  selectionStatus:
    "selected_floor_raw_role_inference_guardrail_after_v16_rerank_found_no_source_ready_runtime_candidate_and_prioritized_floor_side_wrong_lane_risk",
  sliceId: "calculator_source_gap_revalidation_v16",
  sourceReadyRuntimePackAvailable: false,
  supportPromotion: false,
  targetFirstGateFile: "packages/engine/src/floor-raw-role-inference-guardrail-gate-a-contract.test.ts",
  workbenchInputBehaviorChange: false
} as const;

const REQUIRED_PLANNING_SURFACES = [
  "packages/engine/src/calculator-source-gap-revalidation-v16-gate-a-contract.test.ts",
  "packages/engine/src/post-route-family-lane-drift-common-stack-watchlist-v1-next-slice-selection-contract.test.ts",
  "packages/engine/src/route-family-lane-drift-common-stack-watchlist-gate-e-flat-list-family-guard-implementation.test.ts",
  "packages/engine/src/route-family-lane-drift-common-stack-watchlist-gate-d-flat-list-family-guard-design.test.ts",
  "packages/engine/src/route-family-lane-drift-common-stack-watchlist-gate-c-classification.test.ts",
  "packages/engine/src/route-family-lane-drift-common-stack-watchlist-gate-b-reprobes.test.ts",
  "packages/engine/src/route-family-lane-drift-common-stack-watchlist-gate-a-contract.test.ts",
  "packages/engine/src/calculator-source-gap-revalidation-v15-gate-a-contract.test.ts",
  "packages/engine/src/calculator-route-source-risk-register-contract.test.ts",
  "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V16_PLAN.md",
  "docs/calculator/SLICE_FLOOR_RAW_ROLE_INFERENCE_GUARDRAIL_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-03_CALCULATOR_SOURCE_GAP_REVALIDATION_V16_GATE_A_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-05-03_ROUTE_FAMILY_LANE_DRIFT_COMMON_STACK_WATCHLIST_GATE_F_CLOSEOUT_HANDOFF.md",
  "docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md",
  "docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md",
  "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "AGENTS.md"
] as const;

const GATE_E_FLAT_LIST_GUARD_LANDING_SUMMARY = {
  adjacentRockwoolFlatList: {
    confidence: "low",
    rw: 41,
    strategy: "multileaf_screening_blend_fail_closed_until_grouped_topology"
  },
  classicSwappedFlatList: {
    confidence: "low",
    rw: 33,
    strategy: "multileaf_screening_blend_fail_closed_until_grouped_topology"
  },
  groupedSplitRockwool: {
    confidence: "low",
    rw: 41,
    strategy: "multileaf_screening_blend"
  },
  sourceValidatedNow: false,
  splitRockwoolSwappedFlatList: {
    confidence: "low",
    rw: 42,
    strategy: "multileaf_screening_blend_fail_closed_until_grouped_topology"
  }
} as const;

const POST_GUARD_ROCKWOOL_TRIPLE_LEAF_EXACT_SOURCE_PACKET_STATUS = {
  currentScreeningAnswer: "multileaf_screening_blend_rw_41_low_confidence",
  flatListWrongLaneSymptomGuarded: true,
  requiredBeforeRuntime: [
    "rights_safe_uris_2006_source_packet_or_equivalent_source_owned_curve_payload",
    "page_figure_table_locator",
    "band_vector_or_digitization_payload",
    "rating_derivation_and_uncertainty",
    "local_gypsum_board_rockwool_mlv_and_gypsum_plaster_mapping",
    "grouped_topology_runtime_guard",
    "paired_engine_and_web_visible_runtime_tests"
  ],
  runtimeImportReadyNow: false,
  sourceLaneDisposition: "paused_waiting_rights_safe_source_packet",
  sourceValidatedNow: false
} as const;

const CLOSED_MANUFACTURER_AND_GA600_CONTEXT = {
  closedFamilies: [
    "certainteed_silentfx_nrc_astc_source_pack_extraction_v1",
    "pabco_quietrock_sound_design_guide_source_pack_extraction_v1",
    "georgia_pacific_fire_sound_assemblies_source_pack_extraction_v1",
    "national_gypsum_fire_sound_selector_source_pack_extraction_v1",
    "usg_acoustical_assemblies_source_pack_extraction_v1",
    "rockwool_acoustic_wall_assemblies_source_pack_extraction_v1",
    "british_gypsum_white_book_source_pack_extraction_v1",
    "knauf_wall_systems_source_pack_extraction_v1"
  ],
  commonMissingRequirements: [
    "exact_live_topology_mapping",
    "metric_owner_for_dyn_echo_rw_lnw_r_w_dntw_or_explicit_rejection",
    "local_material_mapping",
    "tolerance_owner",
    "protected_negative_boundaries",
    "paired_engine_and_web_visible_tests"
  ],
  ga600CurrentRowPayloadAvailable: false,
  runtimeImportReadyNow: false
} as const;

const COMMON_STACK_LANE_MISCLASSIFICATION_WATCHLIST_CARRY_FORWARD = {
  actionWhenSuspicious: "note_test_document_or_easy_fix",
  mandatoryEverySlice: "standing_lane_misclassification_monitoring_mandate",
  watchItems: [
    "duplicate_or_many_layer_stack_drift",
    "masonry_lined_massive_boundary_drift",
    "raw_floor_role_inference",
    "floor_tolerance_edge_promotion",
    "near_source_false_promotion",
    "field_output_leakage",
    "material_alias_coalescing",
    "hostile_api_input",
    "curve_digitization_provenance"
  ]
} as const;

const V16_RERANK_CANDIDATES: readonly V16Candidate[] = [
  {
    currentPosture:
      "rockwool_like_wall_flat_list_lane_jump_guarded_but_floor_side_raw_role_inference_remains_the_next_actionable_user_edit_lane_risk",
    docOwner: "docs/calculator/SLICE_FLOOR_RAW_ROLE_INFERENCE_GUARDRAIL_PLAN.md",
    executableTestOwner: "packages/engine/src/floor-raw-role-inference-guardrail-gate-a-contract.test.ts",
    firstMissingRequirement:
      "inventory_role_tagged_exact_floor_rows_raw_inferred_floor_rows_duplicate_role_cases_and_order_edits_then_define_prompt_fail_closed_and_visible_card_requirements_before_any_runtime_or_support_movement",
    id: "floor_raw_role_inference_guardrail",
    protectedNegativeBoundaries: [
      "arbitrary_raw_floor_reorder_value_invariance_remains_unclaimed",
      "role_tagged_exact_floor_rows_are_the_promoted_exact_path",
      "raw_floor_inference_must_stay_screening_or_prompt_for_roles_when_exact_outputs_require_role_ownership"
    ],
    rank: 1,
    readiness: {
      exactLiveTopologyMappingNamed: false,
      exactSourceRowsNamed: false,
      floorRolePromptPolicyNamed: true,
      localMaterialMappingNamed: false,
      metricOwnerNamed: false,
      pairedEngineVisibleTestsNamed: true,
      pairedWebVisibleTestsNamed: true,
      protectedNegativeBoundariesNamed: true,
      rightsSafeCurrentPayloadAvailable: false,
      runtimeImportReadyNow: false,
      sourceLocatorConcrete: false,
      toleranceOwnerNamed: false
    },
    reason:
      "after_gate_e_guarded_the_wall_flat_list_wrong_lane_symptom_and_all_current_source_rows_remain_no_runtime_the_next_high_value_actionable_correctness_risk_is_the_floor_side_equivalent_called_out_as_h6_r4_raw_floor_role_inference_where_small_user_order_or_duplicate_role_edits_can_change_support_or_exactness_without_new_source_packet_work",
    runtimeBehaviorChange: false,
    selectedNext: true,
    targetFile: "packages/engine/src/floor-raw-role-inference-guardrail-gate-a-contract.test.ts",
    userVisibleRisk:
      "a_floor_stack_can_render_plausible_rw_lnw_or_field_outputs_while_raw_layer_order_or_duplicate_roles_changed_the_inferred_physical_roles",
    validationScope: [
      "floor_raw_role_inference_guardrail_gate_a_contract",
      "raw_floor_role_negative_matrix",
      "paired_web_route_card_prompt_or_screening_copy_if_visible_behavior_moves",
      "pnpm_calculator_gate_current",
      "git_diff_check"
    ]
  },
  {
    currentPosture: "paused_waiting_rights_safe_source_packet_after_gate_t_and_gate_e_guard",
    docOwner: "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md",
    executableTestOwner: "packages/engine/src/wall-triple-leaf-manual-source-packet-handoff-gate-t.test.ts",
    firstMissingRequirement:
      "rights_safe_uris_2006_source_packet_or_equivalent_source_owned_curve_payload_with_rating_derivation_uncertainty_local_material_mapping_grouped_topology_runtime_guard_and_paired_visible_tests",
    id: "wall_triple_leaf_uris_2006_source_packet_lane",
    protectedNegativeBoundaries: [
      "rw_41_split_rockwool_screening_result_must_not_be_presented_as_fixed_or_source_validated",
      "gate_e_flat_list_guard_does_not_create_source_validated_triple_leaf_runtime",
      "manufacturer_stc_astc_or_ga600_context_do_not_substitute_for_uris_two_cavity_curves"
    ],
    rank: 2,
    readiness: {
      exactLiveTopologyMappingNamed: true,
      exactSourceRowsNamed: false,
      floorRolePromptPolicyNamed: false,
      localMaterialMappingNamed: false,
      metricOwnerNamed: false,
      pairedEngineVisibleTestsNamed: true,
      pairedWebVisibleTestsNamed: true,
      protectedNegativeBoundariesNamed: true,
      rightsSafeCurrentPayloadAvailable: false,
      runtimeImportReadyNow: false,
      sourceLocatorConcrete: true,
      toleranceOwnerNamed: false
    },
    reason:
      "the_original_user_defect_remains_urgent_but_gate_t_still_blocks_exact_runtime_until_the_source_packet_or_equivalent_payload_exists_so_selecting_it_now_would_repeat_a_paused_lane",
    runtimeBehaviorChange: false,
    selectedNext: false,
    targetFile: "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md",
    userVisibleRisk:
      "the_guarded_wall_case_can_be_mistaken_for_a_fixed_triple_leaf_solver_if_the_packet_blocker_is_not_kept_visible",
    validationScope: ["gate_t_handoff_context", "gate_e_guard_context", "route_source_risk_register"]
  },
  {
    currentPosture: "authoritative_manual_context_without_rights_safe_current_row_payloads",
    docOwner: "docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md",
    executableTestOwner: "packages/engine/src/calculator-post-georgia-pacific-source-acquisition-gate-a-contract.test.ts",
    firstMissingRequirement:
      "rights_safe_current_ga600_row_payloads_exact_design_rows_metric_owner_material_mapping_tolerance_negative_boundaries_and_visible_tests_before_extraction_or_runtime_selection",
    id: "gypsum_association_ga600_2024_context",
    protectedNegativeBoundaries: [
      "ga600_current_manual_context_requires_rights_safe_row_payload_before_extraction_or_runtime",
      "ga600_stc_iic_fire_design_context_does_not_promote_dyn_echo_rw_lnw_or_field_outputs",
      "older_public_ga600_context_does_not_replace_current_rights_safe_rows"
    ],
    rank: 3,
    readiness: {
      exactLiveTopologyMappingNamed: false,
      exactSourceRowsNamed: false,
      floorRolePromptPolicyNamed: false,
      localMaterialMappingNamed: false,
      metricOwnerNamed: true,
      pairedEngineVisibleTestsNamed: false,
      pairedWebVisibleTestsNamed: false,
      protectedNegativeBoundariesNamed: true,
      rightsSafeCurrentPayloadAvailable: false,
      runtimeImportReadyNow: false,
      sourceLocatorConcrete: true,
      toleranceOwnerNamed: false
    },
    reason:
      "ga600_remains_authoritative_but_no_current_rights_safe_row_payload_is_in_hand_so_it_stays_below_the_floor_raw_role_guardrail_for_immediate_execution",
    runtimeBehaviorChange: false,
    selectedNext: false,
    targetFile: "docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md",
    userVisibleRisk:
      "manual_authority_can_make_non_payload_context_look_runtime_ready_without_exact_row_truth",
    validationScope: ["source_ready_intake_backlog", "route_source_risk_register"]
  },
  {
    currentPosture: "closed_no_runtime_official_manufacturer_chain_after_gate_e",
    docOwner: "docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md",
    executableTestOwner: "packages/engine/src/calculator-route-source-risk-register-contract.test.ts",
    firstMissingRequirement:
      "new_payload_truth_not_already_closed_by_certainteed_pabco_georgia_pacific_national_gypsum_usg_rockwool_british_gypsum_knauf_or_the_paused_uris_lane",
    id: "closed_manufacturer_rows_after_lane_drift_guard",
    protectedNegativeBoundaries: [
      "closed_manufacturer_rows_remain_context_only",
      "stc_astc_oitc_iic_rw_and_field_contexts_do_not_cross_promote_between_route_families",
      "near_source_rows_do_not_override_existing_exact_anchors_or_fix_uris_2006"
    ],
    rank: 4,
    readiness: {
      exactLiveTopologyMappingNamed: false,
      exactSourceRowsNamed: true,
      floorRolePromptPolicyNamed: false,
      localMaterialMappingNamed: false,
      metricOwnerNamed: false,
      pairedEngineVisibleTestsNamed: false,
      pairedWebVisibleTestsNamed: false,
      protectedNegativeBoundariesNamed: true,
      rightsSafeCurrentPayloadAvailable: true,
      runtimeImportReadyNow: false,
      sourceLocatorConcrete: true,
      toleranceOwnerNamed: false
    },
    reason:
      "gate_e_did_not_make_any_closed_manufacturer_row_more_exact_and_no_source_row_gains_topology_metric_material_tolerance_or_visible_test_ownership_from_the_guard",
    runtimeBehaviorChange: false,
    selectedNext: false,
    targetFile: "docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md",
    userVisibleRisk:
      "near_source_false_promotion_can_make_closed_official_rows_look_more_exact_than_the_live_stack_can_defend",
    validationScope: ["source_ready_intake_backlog", "route_source_risk_register"]
  },
  {
    currentPosture: "documented_route_family_boundary_risks_after_the_flat_list_guard",
    docOwner: "docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md",
    executableTestOwner:
      "packages/engine/src/route-family-lane-drift-common-stack-watchlist-gate-c-classification.test.ts",
    firstMissingRequirement:
      "new_reproduced_non_floor_lane_jump_that_is_bounded_like_gate_e_or_source_topology_coupling_payload_for_masonry_lined_massive_twin_frame_or_duplicate_many_layer_boundary_smoothing",
    id: "remaining_route_family_boundary_watch_items",
    protectedNegativeBoundaries: [
      "lined_massive_boundary_hold_negative_boundary",
      "ordinary_double_leaf_negative_boundary",
      "duplicate_or_many_layer_stack_drift_needs_new_repro_before_runtime_guard"
    ],
    rank: 5,
    readiness: {
      exactLiveTopologyMappingNamed: false,
      exactSourceRowsNamed: false,
      floorRolePromptPolicyNamed: false,
      localMaterialMappingNamed: false,
      metricOwnerNamed: false,
      pairedEngineVisibleTestsNamed: true,
      pairedWebVisibleTestsNamed: true,
      protectedNegativeBoundariesNamed: true,
      rightsSafeCurrentPayloadAvailable: false,
      runtimeImportReadyNow: false,
      sourceLocatorConcrete: false,
      toleranceOwnerNamed: false
    },
    reason:
      "the_wall_flat_list_guard_already_landed_for_the_reproduced_bounded_cases_and_the_remaining_wall_boundary_items_need_new_repro_or_source_coupling_evidence_before_more_runtime_guard_work",
    runtimeBehaviorChange: false,
    selectedNext: false,
    targetFile: "docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md",
    userVisibleRisk:
      "additional_wall_boundary_guarding_without_new_repro_can hide_physical_topology_gaps_or_over_smooth_boundary_hold_cases",
    validationScope: ["route_source_risk_register", "watchlist_gate_c_gate_e_context"]
  },
  {
    currentPosture: "floor_tolerance_edge_promotions_remain_documented_but_less_immediate_than_role_inference",
    docOwner: "docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md",
    executableTestOwner: "packages/engine/src/floor-layer-order-edit-stability-gate-a-matrix.test.ts",
    firstMissingRequirement:
      "selected_exact_floor_family_with_just_inside_just_outside_tolerance_corridor_tests_visible_support_wording_and_raw_role_negative_boundaries",
    id: "floor_tolerance_edge_promotion_guard",
    protectedNegativeBoundaries: [
      "every_new_exact_floor_row_needs_explicit_tolerance_corridor",
      "raw_order_and_duplicate_role_negatives_must_accompany_new_exact_floor_rows",
      "visible_support_wording_must_distinguish_exact_bound_and_screening_floor_outputs"
    ],
    rank: 6,
    readiness: {
      exactLiveTopologyMappingNamed: false,
      exactSourceRowsNamed: false,
      floorRolePromptPolicyNamed: true,
      localMaterialMappingNamed: false,
      metricOwnerNamed: false,
      pairedEngineVisibleTestsNamed: true,
      pairedWebVisibleTestsNamed: true,
      protectedNegativeBoundariesNamed: true,
      rightsSafeCurrentPayloadAvailable: false,
      runtimeImportReadyNow: false,
      sourceLocatorConcrete: false,
      toleranceOwnerNamed: false
    },
    reason:
      "floor_tolerance_edge_work_should_follow_the_raw_role_guardrail_so_new_exact_floor_rows_have_role_ownership_before_tolerance_corridors_are_promoted",
    runtimeBehaviorChange: false,
    selectedNext: false,
    targetFile: "docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md",
    userVisibleRisk:
      "tiny_floor_thickness_edits_can_change_exact_bound_or_screening_status_without_clear_role_and_tolerance_explanation",
    validationScope: ["floor_order_existing_matrices", "route_source_risk_register"]
  }
] as const;

const SELECTED_FLOOR_RAW_ROLE_GUARDRAIL_SCOPE = {
  firstGate: "gate_a_inventory_raw_floor_role_inference_guardrail_no_runtime",
  requiredArtifacts: [
    "role_tagged_exact_floor_row_inventory",
    "raw_floor_inference_snapshot_matrix",
    "duplicate_role_and_order_edit_negative_boundaries",
    "missing_role_prompt_policy_for_exact_floor_outputs",
    "engine_and_web_visible_test_plan_before_support_confidence_or_output_copy_movement",
    "next_closeout_or_bounded_runtime_guard_decision"
  ],
  runtimeBehaviorChange: false,
  selectedPlanningSurface: "docs/calculator/SLICE_FLOOR_RAW_ROLE_INFERENCE_GUARDRAIL_PLAN.md",
  targetFirstGateFile: "packages/engine/src/floor-raw-role-inference-guardrail-gate-a-contract.test.ts"
} as const;

const FROZEN_SURFACES = [
  "runtime",
  "support",
  "confidence",
  "evidence",
  "API",
  "route-card",
  "output-card",
  "proposal/report",
  "workbench-input"
] as const;

const WALL_LAB_CONTEXT: AirborneContext = {
  contextMode: "element_lab"
};

const SPLIT_ROCKWOOL_STACK: readonly LayerInput[] = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "mlv", thicknessMm: 4 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 50 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 50 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "gypsum_plaster", thicknessMm: 10 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
];

const RAW_OPEN_BOX_FLOOR_STACK: readonly LayerInput[] = [
  { materialId: "gypsum_board", thicknessMm: 13 },
  { materialId: "gypsum_board", thicknessMm: 13 },
  { materialId: "rockwool", thicknessMm: 100 },
  { materialId: "resilient_stud_ceiling", thicknessMm: 25 },
  { materialId: "laminate_flooring", thicknessMm: 8 },
  { materialId: "eps_underlay", thicknessMm: 3 },
  { materialId: "generic_fill", thicknessMm: 50 },
  { materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 60 },
  { materialId: "open_box_timber_slab", thicknessMm: 370 }
];

const ROLE_TAGGED_OPEN_BOX_FLOOR_STACK: readonly LayerInput[] = [
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
  { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: 25 },
  { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
  { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
  { floorRole: "upper_fill", materialId: "generic_fill", thicknessMm: 50 },
  { floorRole: "floating_screed", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 60 },
  { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 370 }
];

const FLOOR_OUTPUTS: readonly RequestedOutputId[] = ["Rw", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"];

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function swap(stack: readonly LayerInput[], a: number, b: number): readonly LayerInput[] {
  const swapped = [...stack];
  [swapped[a], swapped[b]] = [swapped[b]!, swapped[a]!];
  return swapped;
}

function floorSnapshot(layers: readonly LayerInput[]) {
  const result = calculateAssembly(layers, { targetOutputs: FLOOR_OUTPUTS });

  return {
    basis: result.impact?.basis ?? result.lowerBoundImpact?.basis ?? null,
    floorSystemMatchId: result.floorSystemMatch?.system.id ?? null,
    lnW: result.impact?.LnW ?? result.lowerBoundImpact?.LnWUpperBound ?? null,
    rw: result.floorSystemRatings?.Rw ?? result.metrics.estimatedRwDb,
    supported: result.supportedTargetOutputs,
    unsupported: result.unsupportedTargetOutputs
  };
}

describe("calculator source-gap revalidation v16 Gate A contract", () => {
  it("lands v16 Gate A without runtime or visible-surface movement", () => {
    expect(CALCULATOR_SOURCE_GAP_REVALIDATION_V16_GATE_A).toEqual({
      apiShapeChange: false,
      confidencePromotion: false,
      evidencePromotion: false,
      landedGate: "gate_a_revalidate_source_accuracy_gap_order_after_lane_drift_guard_runtime_landing",
      latestClosedSlice: "route_family_lane_drift_common_stack_watchlist_v1",
      numericRuntimeBehaviorChange: false,
      outputCardStatusChange: false,
      outputSupportChange: false,
      proposalReportCopyChange: false,
      routeCardValueChange: false,
      runtimeImportSelectedNow: false,
      runtimeTightening: false,
      runtimeWidening: false,
      selectedImplementationSlice: "floor_raw_role_inference_guardrail_v1",
      selectedPlanningSurface: "docs/calculator/SLICE_FLOOR_RAW_ROLE_INFERENCE_GUARDRAIL_PLAN.md",
      selectedRouteFamily: "floor_raw_role_inference_guardrail_no_runtime",
      selectionStatus:
        "selected_floor_raw_role_inference_guardrail_after_v16_rerank_found_no_source_ready_runtime_candidate_and_prioritized_floor_side_wrong_lane_risk",
      sliceId: "calculator_source_gap_revalidation_v16",
      sourceReadyRuntimePackAvailable: false,
      supportPromotion: false,
      targetFirstGateFile: "packages/engine/src/floor-raw-role-inference-guardrail-gate-a-contract.test.ts",
      workbenchInputBehaviorChange: false
    });

    for (const path of REQUIRED_PLANNING_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("treats Gate E guard evidence as a wall-lane symptom guard, not source approval", () => {
    const grouped = calculateAssembly(SPLIT_ROCKWOOL_STACK, {
      airborneContext: WALL_LAB_CONTEXT,
      calculator: "dynamic",
      targetOutputs: ["Rw"]
    });
    const swapped = calculateAssembly(swap(SPLIT_ROCKWOOL_STACK, 3, 4), {
      airborneContext: WALL_LAB_CONTEXT,
      calculator: "dynamic",
      targetOutputs: ["Rw"]
    });

    expect(GATE_E_FLAT_LIST_GUARD_LANDING_SUMMARY.groupedSplitRockwool).toEqual({
      confidence: "low",
      rw: 41,
      strategy: "multileaf_screening_blend"
    });
    expect(GATE_E_FLAT_LIST_GUARD_LANDING_SUMMARY.splitRockwoolSwappedFlatList).toEqual({
      confidence: "low",
      rw: 42,
      strategy: "multileaf_screening_blend_fail_closed_until_grouped_topology"
    });
    expect(GATE_E_FLAT_LIST_GUARD_LANDING_SUMMARY.sourceValidatedNow).toBe(false);
    expect(grouped.metrics.estimatedRwDb).toBe(41);
    expect(grouped.dynamicAirborneTrace?.strategy).toBe("multileaf_screening_blend");
    expect(swapped.metrics.estimatedRwDb).toBe(51);
    expect(swapped.dynamicAirborneTrace?.strategy).toBe(
      "double_leaf_porous_fill_delegate+flat_list_adjacent_swap_numeric_hold_until_grouped_topology"
    );
  });

  it("keeps the rockwool exact-source lane paused after the guard", () => {
    expect(POST_GUARD_ROCKWOOL_TRIPLE_LEAF_EXACT_SOURCE_PACKET_STATUS).toMatchObject({
      currentScreeningAnswer: "multileaf_screening_blend_rw_41_low_confidence",
      flatListWrongLaneSymptomGuarded: true,
      runtimeImportReadyNow: false,
      sourceLaneDisposition: "paused_waiting_rights_safe_source_packet",
      sourceValidatedNow: false
    });
    expect(POST_GUARD_ROCKWOOL_TRIPLE_LEAF_EXACT_SOURCE_PACKET_STATUS.requiredBeforeRuntime).toContain(
      "rights_safe_uris_2006_source_packet_or_equivalent_source_owned_curve_payload"
    );
    expect(POST_GUARD_ROCKWOOL_TRIPLE_LEAF_EXACT_SOURCE_PACKET_STATUS.requiredBeforeRuntime).toContain(
      "local_gypsum_board_rockwool_mlv_and_gypsum_plaster_mapping"
    );
  });

  it("keeps closed manufacturer rows and GA-600 context out of runtime promotion", () => {
    expect(CLOSED_MANUFACTURER_AND_GA600_CONTEXT.closedFamilies).toHaveLength(8);
    expect(CLOSED_MANUFACTURER_AND_GA600_CONTEXT.runtimeImportReadyNow).toBe(false);
    expect(CLOSED_MANUFACTURER_AND_GA600_CONTEXT.ga600CurrentRowPayloadAvailable).toBe(false);
    expect(CLOSED_MANUFACTURER_AND_GA600_CONTEXT.commonMissingRequirements).toContain("tolerance_owner");
    expect(CLOSED_MANUFACTURER_AND_GA600_CONTEXT.commonMissingRequirements).toContain(
      "paired_engine_and_web_visible_tests"
    );
  });

  it("carries forward wrong-lane monitoring and verifies raw floor role inference remains explicit", () => {
    const raw = floorSnapshot(RAW_OPEN_BOX_FLOOR_STACK);
    const tagged = floorSnapshot(ROLE_TAGGED_OPEN_BOX_FLOOR_STACK);

    expect(COMMON_STACK_LANE_MISCLASSIFICATION_WATCHLIST_CARRY_FORWARD).toEqual({
      actionWhenSuspicious: "note_test_document_or_easy_fix",
      mandatoryEverySlice: "standing_lane_misclassification_monitoring_mandate",
      watchItems: [
        "duplicate_or_many_layer_stack_drift",
        "masonry_lined_massive_boundary_drift",
        "raw_floor_role_inference",
        "floor_tolerance_edge_promotion",
        "near_source_false_promotion",
        "field_output_leakage",
        "material_alias_coalescing",
        "hostile_api_input",
        "curve_digitization_provenance"
      ]
    });
    expect(raw).toEqual(tagged);
    expect(raw).toMatchObject({
      basis: "open_measured_floor_system_exact_match",
      floorSystemMatchId: "tuas_r5b_open_box_timber_measured_2026",
      lnW: 44,
      rw: 75,
      supported: ["Rw", "Ln,w"],
      unsupported: ["R'w", "DnT,w", "L'n,w", "L'nT,w"]
    });
  });

  it("reranks the backlog after the lane-drift guard with every candidate fail-closed", () => {
    expect(V16_RERANK_CANDIDATES.map((candidate) => candidate.id)).toEqual([
      "floor_raw_role_inference_guardrail",
      "wall_triple_leaf_uris_2006_source_packet_lane",
      "gypsum_association_ga600_2024_context",
      "closed_manufacturer_rows_after_lane_drift_guard",
      "remaining_route_family_boundary_watch_items",
      "floor_tolerance_edge_promotion_guard"
    ]);
    expect(V16_RERANK_CANDIDATES.map((candidate) => candidate.rank)).toEqual([1, 2, 3, 4, 5, 6]);
    expect(new Set(V16_RERANK_CANDIDATES.map((candidate) => candidate.id)).size).toBe(
      V16_RERANK_CANDIDATES.length
    );
    expect(V16_RERANK_CANDIDATES.every((candidate) => candidate.runtimeBehaviorChange === false)).toBe(true);
    expect(V16_RERANK_CANDIDATES.every((candidate) => candidate.readiness.runtimeImportReadyNow === false)).toBe(
      true
    );
    expect(V16_RERANK_CANDIDATES.every((candidate) => candidate.readiness.protectedNegativeBoundariesNamed)).toBe(
      true
    );
    expect(V16_RERANK_CANDIDATES.every((candidate) => candidate.firstMissingRequirement.length > 120)).toBe(true);
  });

  it("selects the floor raw-role guardrail because no source-ready runtime candidate exists", () => {
    expect(V16_RERANK_CANDIDATES.filter((candidate) => candidate.selectedNext)).toEqual([
      expect.objectContaining({
        id: "floor_raw_role_inference_guardrail",
        rank: 1,
        readiness: expect.objectContaining({
          exactLiveTopologyMappingNamed: false,
          exactSourceRowsNamed: false,
          floorRolePromptPolicyNamed: true,
          pairedEngineVisibleTestsNamed: true,
          pairedWebVisibleTestsNamed: true,
          runtimeImportReadyNow: false,
          sourceLocatorConcrete: false,
          toleranceOwnerNamed: false
        }),
        selectedNext: true,
        targetFile: "packages/engine/src/floor-raw-role-inference-guardrail-gate-a-contract.test.ts"
      })
    ]);
  });

  it("defines the selected floor raw-role guardrail scope before any runtime movement", () => {
    expect(SELECTED_FLOOR_RAW_ROLE_GUARDRAIL_SCOPE).toEqual({
      firstGate: "gate_a_inventory_raw_floor_role_inference_guardrail_no_runtime",
      requiredArtifacts: [
        "role_tagged_exact_floor_row_inventory",
        "raw_floor_inference_snapshot_matrix",
        "duplicate_role_and_order_edit_negative_boundaries",
        "missing_role_prompt_policy_for_exact_floor_outputs",
        "engine_and_web_visible_test_plan_before_support_confidence_or_output_copy_movement",
        "next_closeout_or_bounded_runtime_guard_decision"
      ],
      runtimeBehaviorChange: false,
      selectedPlanningSurface: "docs/calculator/SLICE_FLOOR_RAW_ROLE_INFERENCE_GUARDRAIL_PLAN.md",
      targetFirstGateFile: "packages/engine/src/floor-raw-role-inference-guardrail-gate-a-contract.test.ts"
    });
  });

  it("keeps active docs aligned on the selected no-runtime floor raw-role guardrail", () => {
    const docs = [
      readRepoFile("AGENTS.md"),
      readRepoFile("docs/calculator/NEXT_IMPLEMENTATION_PLAN.md"),
      readRepoFile("docs/calculator/CURRENT_STATE.md"),
      readRepoFile("docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V16_PLAN.md"),
      readRepoFile(CALCULATOR_SOURCE_GAP_REVALIDATION_V16_GATE_A.selectedPlanningSurface),
      readRepoFile("docs/calculator/CHECKPOINT_2026-05-03_CALCULATOR_SOURCE_GAP_REVALIDATION_V16_GATE_A_HANDOFF.md"),
      readRepoFile("docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md"),
      readRepoFile("docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md"),
      readRepoFile("docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md")
    ];

    for (const doc of docs) {
      expect(doc).toContain(CALCULATOR_SOURCE_GAP_REVALIDATION_V16_GATE_A.selectedImplementationSlice);
      expect(doc).toContain(CALCULATOR_SOURCE_GAP_REVALIDATION_V16_GATE_A.targetFirstGateFile);
      expect(doc).toContain(CALCULATOR_SOURCE_GAP_REVALIDATION_V16_GATE_A.selectionStatus);
      expect(doc).toContain("raw_floor_role_inference");
      expect(doc).toContain("standing_lane_misclassification_monitoring_mandate");
      expect(doc).toContain("note_test_document_or_easy_fix");
      expect(doc).toContain("paused_waiting_rights_safe_source_packet");
      expect(doc).toContain("multileaf_screening_blend_fail_closed_until_grouped_topology");
      expect(doc).toContain("arbitrary_raw_floor_reorder_value_invariance_remains_unclaimed");
    }
  });

  it("keeps frozen surfaces and validation expectations explicit", () => {
    const joinedDocs = [
      readRepoFile("docs/calculator/CHECKPOINT_2026-05-03_CALCULATOR_SOURCE_GAP_REVALIDATION_V16_GATE_A_HANDOFF.md"),
      readRepoFile("docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V16_PLAN.md"),
      readRepoFile("docs/calculator/SLICE_FLOOR_RAW_ROLE_INFERENCE_GUARDRAIL_PLAN.md")
    ].join("\n");

    for (const surface of FROZEN_SURFACES) {
      expect(joinedDocs, surface).toContain(surface);
    }

    expect(joinedDocs).toContain(
      "pnpm --filter @dynecho/engine exec vitest run src/calculator-source-gap-revalidation-v16-gate-a-contract.test.ts --maxWorkers=1"
    );
    expect(joinedDocs).toContain("pnpm calculator:gate:current");
    expect(joinedDocs).toContain("git diff --check");
  });
});
