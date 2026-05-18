import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

type RuntimeReadiness = {
  exactLiveTopologyMappingNamed: boolean;
  exactSourceRowsNamed: boolean;
  frequentCombinationCoverageNamed: boolean;
  laneDriftWatchlistNamed: boolean;
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

type V15Candidate = {
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

const CALCULATOR_SOURCE_GAP_REVALIDATION_V15_GATE_A = {
  apiShapeChange: false,
  confidencePromotion: false,
  evidencePromotion: false,
  landedGate: "gate_a_revalidate_source_accuracy_gap_order_after_certainteed_source_pack_closeout",
  latestClosedSlice: "certainteed_silentfx_nrc_astc_source_pack_extraction_v1",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: false,
  outputSupportChange: false,
  proposalReportCopyChange: false,
  routeCardValueChange: false,
  runtimeImportSelectedNow: false,
  runtimeTightening: false,
  runtimeWidening: false,
  selectedImplementationSlice: "route_family_lane_drift_common_stack_watchlist_v1",
  selectedPlanningSurface: "docs/calculator/SLICE_ROUTE_FAMILY_LANE_DRIFT_COMMON_STACK_WATCHLIST_PLAN.md",
  selectedRouteFamily: "route_family_lane_drift_common_stack_watchlist_no_runtime",
  selectionStatus:
    "selected_route_family_lane_drift_common_stack_watchlist_after_v15_rerank_found_no_runtime_ready_source_candidate_and_user_prioritized_rockwool_like_lane_errors",
  sliceId: "calculator_source_gap_revalidation_v15",
  sourceReadyRuntimePackAvailable: false,
  supportPromotion: false,
  targetFirstGateFile:
    "packages/engine/src/route-family-lane-drift-common-stack-watchlist-gate-a-contract.test.ts",
  workbenchInputBehaviorChange: false
} as const;

const REQUIRED_PLANNING_SURFACES = [
  "packages/engine/src/calculator-source-gap-revalidation-v15-gate-a-contract.test.ts",
  "packages/engine/src/post-certainteed-silentfx-nrc-astc-source-pack-extraction-v1-next-slice-selection-contract.test.ts",
  "packages/engine/src/certainteed-silentfx-nrc-astc-source-pack-extraction-gate-b-contract.test.ts",
  "packages/engine/src/certainteed-silentfx-nrc-astc-source-pack-extraction-gate-a-contract.test.ts",
  "packages/engine/src/calculator-source-gap-revalidation-v14-gate-a-contract.test.ts",
  "packages/engine/src/post-pabco-quietrock-sound-design-guide-source-pack-extraction-v1-next-slice-selection-contract.test.ts",
  "packages/engine/src/pabco-quietrock-sound-design-guide-source-pack-extraction-gate-b-contract.test.ts",
  "packages/engine/src/pabco-quietrock-sound-design-guide-source-pack-extraction-gate-a-contract.test.ts",
  "packages/engine/src/calculator-route-source-risk-register-contract.test.ts",
  "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V15_PLAN.md",
  "docs/calculator/SLICE_ROUTE_FAMILY_LANE_DRIFT_COMMON_STACK_WATCHLIST_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-03_CALCULATOR_SOURCE_GAP_REVALIDATION_V15_GATE_A_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-05-03_CERTAINTEED_SILENTFX_NRC_ASTC_SOURCE_PACK_EXTRACTION_GATE_C_CLOSEOUT_HANDOFF.md",
  "docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md",
  "docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md",
  "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "AGENTS.md"
] as const;

const CERTAINTEED_CLOSEOUT_SUMMARY = {
  closedRows: [
    "NRC_CERTAINTEED_SILENTFX_ASTC_HIGH_RISE_22_EXAMPLES_2018",
    "CERTAINTEED_CTG_2481_SILENTFX_U465_STC57_PRODUCT_DATA_EXAMPLE",
    "CERTAINTEED_CTG_2481_SILENTFX_U309_STC51_PRODUCT_DATA_EXAMPLE"
  ],
  commonMissingRequirements: [
    "direct_dyn_echo_metric_owner_for_astc_stc_rw_r_w_dntw_or_explicit_rejection",
    "rights_safe_current_onesource_or_product_payload",
    "silentfx_type_x_certainteed_type_x_generic_gypsum_quietrock_pabco_type_x_material_mapping",
    "exact_live_topology_mapping_and_existing_anchor_precedence",
    "tolerance_owner",
    "paired_engine_and_web_visible_tests"
  ],
  latestStatus:
    "closed_certainteed_silentfx_nrc_astc_source_pack_no_runtime_and_selected_source_gap_revalidation_v15_because_gate_b_found_no_runtime_ready_row",
  runtimeImportReadyNow: false
} as const;

const PAUSED_TRIPLE_LEAF_SOURCE_LANE = {
  currentScreeningAnswer: "multileaf_screening_blend_rw_41_low_confidence",
  requiredBeforeRuntime: [
    "authorized_uris_2006_source_file_or_tdm_payload",
    "page_figure_table_locator",
    "curve_identity_map",
    "band_vector_or_digitization_payload",
    "rating_derivation_and_uncertainty",
    "local_gypsum_board_rockwool_mlv_and_gypsum_plaster_mapping",
    "route_family_and_grouped_topology_runtime_guard",
    "paired_engine_and_web_visible_runtime_tests"
  ],
  runtimeImportReadyNow: false,
  sourceLaneDisposition: "paused_waiting_rights_safe_source_packet"
} as const;

const STANDING_LANE_MISCLASSIFICATION_MONITORING_MANDATE = {
  actionWhenSuspicious:
    "note_test_document_or_easy_fix_before_the_next_runtime_or_source_promotion_if_a_common_stack_drops_into_the_wrong_lane_or_returns_an_absurd_value",
  requiredEveryRevalidation: true,
  token: "standing_lane_misclassification_monitoring_mandate",
  watchlistFamilies: [
    "flat_list_route_family_flip",
    "duplicate_or_many_layer_stack_drift",
    "masonry_lined_massive_boundary_drift",
    "raw_floor_role_inference",
    "near_source_false_promotion",
    "field_output_leakage",
    "material_alias_coalescing",
    "hostile_api_input",
    "curve_digitization_provenance"
  ]
} as const;

const V15_RERANK_CANDIDATES: readonly V15Candidate[] = [
  {
    currentPosture: "source_ready_runtime_pack_absent_but_common_stack_lane_drift_is_actionable_now",
    docOwner: "docs/calculator/SLICE_ROUTE_FAMILY_LANE_DRIFT_COMMON_STACK_WATCHLIST_PLAN.md",
    executableTestOwner:
      "packages/engine/src/route-family-lane-drift-common-stack-watchlist-gate-a-contract.test.ts",
    firstMissingRequirement:
      "inventory_frequently_used_wall_and_floor_stacks_route_family_tokens_source_lane_tokens_output_values_support_confidence_and_edge_reorder_variants_then_test_each_suspicious_lane_flip_before_documenting_or_fixing_any_easy_runtime_guard",
    id: "route_family_lane_drift_common_stack_watchlist",
    protectedNegativeBoundaries: [
      "common_stack_watchlist_is_not_runtime_import_or_value_retune",
      "wrong_lane_suspicion_requires_repro_test_before_documented_defect_or_easy_fix",
      "frequently_used_combinations_must_keep_route_family_source_lane_support_confidence_and_output_copy_honest"
    ],
    rank: 1,
    readiness: {
      exactLiveTopologyMappingNamed: false,
      exactSourceRowsNamed: false,
      frequentCombinationCoverageNamed: true,
      laneDriftWatchlistNamed: true,
      localMaterialMappingNamed: false,
      metricOwnerNamed: false,
      pairedEngineVisibleTestsNamed: false,
      pairedWebVisibleTestsNamed: false,
      protectedNegativeBoundariesNamed: true,
      rightsSafeCurrentPayloadAvailable: false,
      runtimeImportReadyNow: false,
      sourceLocatorConcrete: false,
      toleranceOwnerNamed: false
    },
    reason:
      "certainteed_pabco_georgia_pacific_national_gypsum_usg_rockwool_british_gypsum_and_knauf_source_rows_have_closed_no_runtime_the_uris_2006_lane_is_still_paused_and_the_user_priority_is_to_catch_rockwool_like_wrong_lane_errors_on_common_wall_floor_stacks_before_more_near_source_context_can_leak_into_runtime_answers",
    runtimeBehaviorChange: false,
    selectedNext: true,
    targetFile: "packages/engine/src/route-family-lane-drift-common-stack-watchlist-gate-a-contract.test.ts",
    userVisibleRisk:
      "a_common_stack_can_look_plausible_while_the_engine_has_switched_to_triple_leaf_double_leaf_lined_masonry_floor_or_field_output_lane_for_the_wrong_reason",
    validationScope: [
      "route_family_lane_drift_common_stack_watchlist_gate_a_contract",
      "route_source_risk_register_refresh",
      "source_ready_intake_backlog_refresh",
      "pnpm_calculator_gate_current",
      "git_diff_check"
    ]
  },
  {
    currentPosture: "paused_waiting_rights_safe_source_packet_after_gate_t",
    docOwner: "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md",
    executableTestOwner: "packages/engine/src/wall-triple-leaf-manual-source-packet-handoff-gate-t.test.ts",
    firstMissingRequirement:
      "rights_safe_uris_2006_source_packet_with_curve_or_table_payload_rating_derivation_uncertainty_local_material_mapping_grouped_topology_runtime_guard_and_paired_visible_tests",
    id: "wall_triple_leaf_uris_2006_source_packet_lane",
    protectedNegativeBoundaries: [
      "rw_41_split_rockwool_screening_result_must_not_be_presented_as_fixed_or_source_validated",
      "certainteed_pabco_ga600_and_closed_manufacturer_context_do_not_substitute_for_uris_two_cavity_curves",
      "source_packet_absence_blocks_runtime_even_when_grouped_topology_and_visible_guards_exist"
    ],
    rank: 2,
    readiness: {
      exactLiveTopologyMappingNamed: true,
      exactSourceRowsNamed: false,
      frequentCombinationCoverageNamed: true,
      laneDriftWatchlistNamed: true,
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
      "the_original_user_defect_remains_the_highest_specific_correctness_problem_but_reopening_the_numeric_solver_without_the_uris_source_packet_would_make_the_rw_41_screening_result_look_fixed",
    runtimeBehaviorChange: false,
    selectedNext: false,
    targetFile: "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md",
    userVisibleRisk:
      "without_packet_truth_the_rockwool_reorder_case_can_only_be_guarded_and_diagnosed_not_claimed_as_a_source_calibrated_fix",
    validationScope: ["gate_t_handoff_context", "route_source_risk_register"]
  },
  {
    currentPosture: "authoritative_manual_context_without_rights_safe_current_rows",
    docOwner: "docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md",
    executableTestOwner: "packages/engine/src/calculator-post-georgia-pacific-source-acquisition-gate-a-contract.test.ts",
    firstMissingRequirement:
      "rights_safe_current_ga600_row_payloads_exact_design_rows_metric_owner_material_mapping_tolerance_negative_boundaries_and_paired_visible_tests_before_extraction_or_runtime_selection",
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
      frequentCombinationCoverageNamed: false,
      laneDriftWatchlistNamed: true,
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
      "ga600_remains_authoritative_but_no_current_rights_safe_row_payload_is_available_in_the_calculator_corpus_so_it_stays_below_the_actionable_common_stack_lane_drift_watchlist",
    runtimeBehaviorChange: false,
    selectedNext: false,
    targetFile: "docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md",
    userVisibleRisk:
      "ga600_authority_can_make_manual_context_look_runtime_ready_without_current_row_payload_and_metric_policy",
    validationScope: ["post_georgia_pacific_source_acquisition_context", "source_backlog_context"]
  },
  {
    currentPosture: "closed_no_runtime_official_manufacturer_chain_after_certainteed",
    docOwner: "docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md",
    executableTestOwner: "packages/engine/src/calculator-route-source-risk-register-contract.test.ts",
    firstMissingRequirement:
      "new_payload_truth_not_already_closed_by_certainteed_pabco_georgia_pacific_national_gypsum_usg_rockwool_british_gypsum_knauf_or_the_paused_uris_lane",
    id: "closed_certainteed_pabco_georgia_pacific_national_gypsum_usg_rockwool_british_gypsum_knauf_rows",
    protectedNegativeBoundaries: [
      "closed_manufacturer_rows_remain_context_only",
      "stc_astc_oitc_iic_rw_and_field_contexts_do_not_cross_promote_between_route_families",
      "near_source_rows_do_not_override_existing_exact_anchors_or_fix_uris_2006"
    ],
    rank: 4,
    readiness: {
      exactLiveTopologyMappingNamed: false,
      exactSourceRowsNamed: true,
      frequentCombinationCoverageNamed: false,
      laneDriftWatchlistNamed: true,
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
      "the_closed_manufacturer_chain_remains_high_value_negative_boundary_context_but_no_row_gains_runtime_readiness_or_a_new_exact_mapping_from_certainteed_closeout",
    runtimeBehaviorChange: false,
    selectedNext: false,
    targetFile: "docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md",
    userVisibleRisk:
      "near_source_false_promotion_can_make_closed_official_rows_look_more_exact_than_the_live_stack_can_defend",
    validationScope: ["route_source_risk_register", "source_ready_intake_backlog"]
  },
  {
    currentPosture: "fresh_source_acquisition_needed_but_no_concrete_locator_ranked_above_lane_drift_watchlist_now",
    docOwner: "docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md",
    executableTestOwner: "packages/engine/src/calculator-post-georgia-pacific-source-acquisition-gate-a-contract.test.ts",
    firstMissingRequirement:
      "fresh_rights_safe_wall_or_floor_source_locators_or_packets_with_exact_topology_metric_policy_material_mapping_tolerance_negative_boundaries_and_visible_test_ownership",
    id: "post_certainteed_fresh_source_acquisition",
    protectedNegativeBoundaries: [
      "fresh_source_hunt_must_not_reopen_closed_rows_without_new_payload_truth",
      "source_locator_only_context_must_not_promote_runtime_or_output_copy",
      "new_sources_must_be_screened_against_common_stack_lane_drift_before promotion"
    ],
    rank: 5,
    readiness: {
      exactLiveTopologyMappingNamed: false,
      exactSourceRowsNamed: false,
      frequentCombinationCoverageNamed: false,
      laneDriftWatchlistNamed: true,
      localMaterialMappingNamed: false,
      metricOwnerNamed: false,
      pairedEngineVisibleTestsNamed: false,
      pairedWebVisibleTestsNamed: false,
      protectedNegativeBoundariesNamed: true,
      rightsSafeCurrentPayloadAvailable: false,
      runtimeImportReadyNow: false,
      sourceLocatorConcrete: false,
      toleranceOwnerNamed: false
    },
    reason:
      "fresh_source_acquisition_is_still_needed_after_certainteed_but_v15_has_no_concrete_new_locator_to_extract_and_the_common_stack_lane_drift_watchlist_is_more_immediately_executable",
    runtimeBehaviorChange: false,
    selectedNext: false,
    targetFile: "docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md",
    userVisibleRisk:
      "without_a_concrete_locator_source_acquisition_would_repeat_broad_search_while_known_common_stack_route_drift_risks_remain_uninventoried",
    validationScope: ["source_ready_intake_backlog", "route_source_risk_register"]
  },
  {
    currentPosture: "formula_owned_or_metric_blocked_followups_still_not_source_ready",
    docOwner: "docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md",
    executableTestOwner: "packages/engine/src/calculator-source-pack-readiness-triage-gate-a-contract.test.ts",
    firstMissingRequirement:
      "new_exact_wall_or_floor_source_rows_plus_metric_policy_tolerance_material_mapping_negative_boundaries_visible_tests_and_lane_drift_guard_coverage",
    id: "clt_mass_timber_generated_floor_no_stud_lined_heavy_followups",
    protectedNegativeBoundaries: [
      "floor_only_or_ceiling_lining_rows_do_not_become_wall_truth",
      "generated_floor_near_misses_need_exact_or_bounded_topology_match",
      "lined_masonry_and_heavy_core_context_do_not_promote_without_wall_specific_rows"
    ],
    rank: 6,
    readiness: {
      exactLiveTopologyMappingNamed: false,
      exactSourceRowsNamed: false,
      frequentCombinationCoverageNamed: false,
      laneDriftWatchlistNamed: true,
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
      "these_families_remain_high_value_but_certainteed_closeout_does_not_add_exact_metric_topology_or_material_truth_for_them",
    runtimeBehaviorChange: false,
    selectedNext: false,
    targetFile: "docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md",
    userVisibleRisk:
      "formula_owned_or_near_miss_families_can_look_source_backed_before_exact_metric_and_topology_requirements_are_met",
    validationScope: ["source_ready_intake_backlog", "clt_floor_no_stud_lined_heavy_boundaries"]
  }
] as const;

const SELECTED_WATCHLIST_SCOPE = {
  firstGate: "gate_a_inventory_common_wall_floor_lane_drift_watchlist_no_runtime",
  requiredArtifacts: [
    "frequently_used_wall_and_floor_stack_inventory",
    "route_family_source_lane_output_value_support_confidence_snapshot_matrix",
    "small_layer_reorder_duplicate_many_layer_and_boundary_variant_reprobes",
    "rockwool_like_wrong_lane_defect_note_test_document_or_easy_fix_rule",
    "field_output_source_metric_material_alias_and_hostile_input_leakage_guards",
    "paired_engine_and_web_visible_test_plan_before_any_runtime_or_visible_movement"
  ],
  runtimeBehaviorChange: false,
  selectedPlanningSurface: "docs/calculator/SLICE_ROUTE_FAMILY_LANE_DRIFT_COMMON_STACK_WATCHLIST_PLAN.md",
  targetFirstGateFile: "packages/engine/src/route-family-lane-drift-common-stack-watchlist-gate-a-contract.test.ts"
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

const COMPLETE_TRIPLE_LEAF_CONTEXT: AirborneContext = {
  contextMode: "element_lab",
  wallTopology: {
    cavity1AbsorptionClass: "porous_absorptive",
    cavity1DepthMm: 50,
    cavity1FillCoverage: "full",
    cavity1LayerIndices: [3],
    cavity2AbsorptionClass: "porous_absorptive",
    cavity2DepthMm: 50,
    cavity2FillCoverage: "full",
    cavity2LayerIndices: [5],
    internalLeafCoupling: "independent",
    internalLeafLayerIndices: [4],
    sideALeafLayerIndices: [0, 1, 2],
    sideBLeafLayerIndices: [6, 7, 8],
    supportTopology: "independent_frames",
    topologyMode: "grouped_triple_leaf"
  }
};

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("calculator source-gap revalidation v15 Gate A contract", () => {
  it("lands v15 Gate A without runtime or visible-surface movement", () => {
    expect(CALCULATOR_SOURCE_GAP_REVALIDATION_V15_GATE_A).toEqual({
      apiShapeChange: false,
      confidencePromotion: false,
      evidencePromotion: false,
      landedGate: "gate_a_revalidate_source_accuracy_gap_order_after_certainteed_source_pack_closeout",
      latestClosedSlice: "certainteed_silentfx_nrc_astc_source_pack_extraction_v1",
      numericRuntimeBehaviorChange: false,
      outputCardStatusChange: false,
      outputSupportChange: false,
      proposalReportCopyChange: false,
      routeCardValueChange: false,
      runtimeImportSelectedNow: false,
      runtimeTightening: false,
      runtimeWidening: false,
      selectedImplementationSlice: "route_family_lane_drift_common_stack_watchlist_v1",
      selectedPlanningSurface: "docs/calculator/SLICE_ROUTE_FAMILY_LANE_DRIFT_COMMON_STACK_WATCHLIST_PLAN.md",
      selectedRouteFamily: "route_family_lane_drift_common_stack_watchlist_no_runtime",
      selectionStatus:
        "selected_route_family_lane_drift_common_stack_watchlist_after_v15_rerank_found_no_runtime_ready_source_candidate_and_user_prioritized_rockwool_like_lane_errors",
      sliceId: "calculator_source_gap_revalidation_v15",
      sourceReadyRuntimePackAvailable: false,
      supportPromotion: false,
      targetFirstGateFile:
        "packages/engine/src/route-family-lane-drift-common-stack-watchlist-gate-a-contract.test.ts",
      workbenchInputBehaviorChange: false
    });

    for (const path of REQUIRED_PLANNING_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("treats CertainTeed closeout evidence as no-runtime context only", () => {
    expect(CERTAINTEED_CLOSEOUT_SUMMARY.closedRows).toHaveLength(3);
    expect(CERTAINTEED_CLOSEOUT_SUMMARY.runtimeImportReadyNow).toBe(false);
    expect(CERTAINTEED_CLOSEOUT_SUMMARY.commonMissingRequirements).toContain(
      "direct_dyn_echo_metric_owner_for_astc_stc_rw_r_w_dntw_or_explicit_rejection"
    );
    expect(CERTAINTEED_CLOSEOUT_SUMMARY.commonMissingRequirements).toContain(
      "silentfx_type_x_certainteed_type_x_generic_gypsum_quietrock_pabco_type_x_material_mapping"
    );
    expect(CERTAINTEED_CLOSEOUT_SUMMARY.latestStatus).toBe(
      "closed_certainteed_silentfx_nrc_astc_source_pack_no_runtime_and_selected_source_gap_revalidation_v15_because_gate_b_found_no_runtime_ready_row"
    );
  });

  it("keeps the Uris 2006 split-rockwool lane paused instead of calling Rw 41 fixed", () => {
    const splitRockwool = calculateAssembly(SPLIT_ROCKWOOL_STACK, {
      airborneContext: COMPLETE_TRIPLE_LEAF_CONTEXT,
      calculator: "dynamic",
      targetOutputs: ["Rw"]
    });

    expect(PAUSED_TRIPLE_LEAF_SOURCE_LANE.sourceLaneDisposition).toBe("paused_waiting_rights_safe_source_packet");
    expect(PAUSED_TRIPLE_LEAF_SOURCE_LANE.currentScreeningAnswer).toBe(
      "multileaf_screening_blend_rw_41_low_confidence"
    );
    expect(PAUSED_TRIPLE_LEAF_SOURCE_LANE.runtimeImportReadyNow).toBe(false);
    expect(PAUSED_TRIPLE_LEAF_SOURCE_LANE.requiredBeforeRuntime).toContain(
      "route_family_and_grouped_topology_runtime_guard"
    );
    expect(splitRockwool.metrics.estimatedRwDb).toBe(53);
    expect(splitRockwool.dynamicAirborneTrace?.strategy).toBe("broad_accuracy_wall_multileaf_triple_leaf_local_substitution_runtime_corridor");
    expect(splitRockwool.dynamicAirborneTrace?.confidenceClass).toBe("medium");
  });

  it("makes route-family and source-lane misclassification monitoring a standing rule", () => {
    expect(STANDING_LANE_MISCLASSIFICATION_MONITORING_MANDATE).toEqual({
      actionWhenSuspicious:
        "note_test_document_or_easy_fix_before_the_next_runtime_or_source_promotion_if_a_common_stack_drops_into_the_wrong_lane_or_returns_an_absurd_value",
      requiredEveryRevalidation: true,
      token: "standing_lane_misclassification_monitoring_mandate",
      watchlistFamilies: [
        "flat_list_route_family_flip",
        "duplicate_or_many_layer_stack_drift",
        "masonry_lined_massive_boundary_drift",
        "raw_floor_role_inference",
        "near_source_false_promotion",
        "field_output_leakage",
        "material_alias_coalescing",
        "hostile_api_input",
        "curve_digitization_provenance"
      ]
    });
    expect(STANDING_LANE_MISCLASSIFICATION_MONITORING_MANDATE.watchlistFamilies).toHaveLength(9);
  });

  it("reranks the backlog after CertainTeed closeout with every candidate fail-closed", () => {
    expect(V15_RERANK_CANDIDATES.map((candidate) => candidate.id)).toEqual([
      "route_family_lane_drift_common_stack_watchlist",
      "wall_triple_leaf_uris_2006_source_packet_lane",
      "gypsum_association_ga600_2024_context",
      "closed_certainteed_pabco_georgia_pacific_national_gypsum_usg_rockwool_british_gypsum_knauf_rows",
      "post_certainteed_fresh_source_acquisition",
      "clt_mass_timber_generated_floor_no_stud_lined_heavy_followups"
    ]);
    expect(V15_RERANK_CANDIDATES.map((candidate) => candidate.rank)).toEqual([1, 2, 3, 4, 5, 6]);
    expect(new Set(V15_RERANK_CANDIDATES.map((candidate) => candidate.id)).size).toBe(
      V15_RERANK_CANDIDATES.length
    );
    expect(V15_RERANK_CANDIDATES.every((candidate) => candidate.runtimeBehaviorChange === false)).toBe(true);
    expect(V15_RERANK_CANDIDATES.every((candidate) => candidate.readiness.runtimeImportReadyNow === false)).toBe(
      true
    );
    expect(V15_RERANK_CANDIDATES.every((candidate) => candidate.readiness.protectedNegativeBoundariesNamed)).toBe(
      true
    );
    expect(V15_RERANK_CANDIDATES.every((candidate) => candidate.readiness.laneDriftWatchlistNamed)).toBe(true);
    expect(V15_RERANK_CANDIDATES.every((candidate) => candidate.firstMissingRequirement.length > 120)).toBe(true);
  });

  it("selects the common-stack lane-drift watchlist because no source-ready runtime candidate exists", () => {
    expect(V15_RERANK_CANDIDATES.filter((candidate) => candidate.selectedNext)).toEqual([
      expect.objectContaining({
        id: "route_family_lane_drift_common_stack_watchlist",
        rank: 1,
        readiness: expect.objectContaining({
          exactLiveTopologyMappingNamed: false,
          exactSourceRowsNamed: false,
          frequentCombinationCoverageNamed: true,
          laneDriftWatchlistNamed: true,
          pairedEngineVisibleTestsNamed: false,
          pairedWebVisibleTestsNamed: false,
          runtimeImportReadyNow: false,
          sourceLocatorConcrete: false,
          toleranceOwnerNamed: false
        }),
        selectedNext: true,
        targetFile: "packages/engine/src/route-family-lane-drift-common-stack-watchlist-gate-a-contract.test.ts"
      })
    ]);
  });

  it("defines the selected watchlist scope before any runtime movement", () => {
    expect(SELECTED_WATCHLIST_SCOPE).toEqual({
      firstGate: "gate_a_inventory_common_wall_floor_lane_drift_watchlist_no_runtime",
      requiredArtifacts: [
        "frequently_used_wall_and_floor_stack_inventory",
        "route_family_source_lane_output_value_support_confidence_snapshot_matrix",
        "small_layer_reorder_duplicate_many_layer_and_boundary_variant_reprobes",
        "rockwool_like_wrong_lane_defect_note_test_document_or_easy_fix_rule",
        "field_output_source_metric_material_alias_and_hostile_input_leakage_guards",
        "paired_engine_and_web_visible_test_plan_before_any_runtime_or_visible_movement"
      ],
      runtimeBehaviorChange: false,
      selectedPlanningSurface: "docs/calculator/SLICE_ROUTE_FAMILY_LANE_DRIFT_COMMON_STACK_WATCHLIST_PLAN.md",
      targetFirstGateFile: "packages/engine/src/route-family-lane-drift-common-stack-watchlist-gate-a-contract.test.ts"
    });
  });

  it("keeps active docs aligned on the selected no-runtime lane-drift watchlist", () => {
    const docs = [
      readRepoFile("AGENTS.md"),
      readRepoFile("docs/calculator/NEXT_IMPLEMENTATION_PLAN.md"),
      readRepoFile("docs/calculator/CURRENT_STATE.md"),
      readRepoFile("docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V15_PLAN.md"),
      readRepoFile(CALCULATOR_SOURCE_GAP_REVALIDATION_V15_GATE_A.selectedPlanningSurface),
      readRepoFile("docs/calculator/CHECKPOINT_2026-05-03_CALCULATOR_SOURCE_GAP_REVALIDATION_V15_GATE_A_HANDOFF.md"),
      readRepoFile("docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md"),
      readRepoFile("docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md"),
      readRepoFile("docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md")
    ];

    for (const doc of docs) {
      expect(doc).toContain(CALCULATOR_SOURCE_GAP_REVALIDATION_V15_GATE_A.selectedImplementationSlice);
      expect(doc).toContain(CALCULATOR_SOURCE_GAP_REVALIDATION_V15_GATE_A.targetFirstGateFile);
      expect(doc).toContain(CALCULATOR_SOURCE_GAP_REVALIDATION_V15_GATE_A.selectionStatus);
      expect(doc).toContain("standing_lane_misclassification_monitoring_mandate");
      expect(doc).toContain("note_test_document_or_easy_fix");
      expect(doc).toContain("paused_waiting_rights_safe_source_packet");
      expect(doc).toContain("multileaf_screening_blend");
      expect(doc).toContain("Rw 41");
    }
  });

  it("keeps frozen surfaces and validation expectations explicit", () => {
    const joinedDocs = [
      readRepoFile("docs/calculator/CHECKPOINT_2026-05-03_CALCULATOR_SOURCE_GAP_REVALIDATION_V15_GATE_A_HANDOFF.md"),
      readRepoFile("docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V15_PLAN.md"),
      readRepoFile("docs/calculator/SLICE_ROUTE_FAMILY_LANE_DRIFT_COMMON_STACK_WATCHLIST_PLAN.md")
    ].join("\n");

    for (const surface of FROZEN_SURFACES) {
      expect(joinedDocs, surface).toContain(surface);
    }

    expect(joinedDocs).toContain(
      "pnpm --filter @dynecho/engine exec vitest run src/calculator-source-gap-revalidation-v15-gate-a-contract.test.ts --maxWorkers=1"
    );
    expect(joinedDocs).toContain("pnpm calculator:gate:current");
    expect(joinedDocs).toContain("git diff --check");
  });
});
