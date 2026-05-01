import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

type RuntimeReadiness = {
  exactTopologyOrBoundedRuleNamed: boolean;
  localMaterialMappingNamed: boolean;
  metricOwnerNamed: boolean;
  pairedEngineVisibleTestsNamed: boolean;
  pairedWebVisibleTestsNamed: boolean;
  protectedNegativeBoundariesNamed: boolean;
  runtimeImportReadyNow: false;
  sourceLocatorConcrete: boolean;
  toleranceOwnerNamed: boolean;
};

type V7Candidate = {
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

const CALCULATOR_SOURCE_GAP_REVALIDATION_V7_GATE_A = {
  apiShapeChange: false,
  confidencePromotion: false,
  evidencePromotion: false,
  landedGate: "gate_a_revalidate_source_accuracy_gap_order_after_all_concrete_knauf_mapping_closeouts",
  latestClosedSlice: "steel_stud_knauf_enpc_mapping_tolerance_v1",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: false,
  outputSupportChange: false,
  proposalReportCopyChange: false,
  routeCardValueChange: false,
  runtimeImportSelectedNow: false,
  runtimeTightening: false,
  runtimeWidening: false,
  selectedImplementationSlice: "calculator_post_knauf_source_acquisition_v1",
  selectedPlanningSurface: "docs/calculator/SLICE_CALCULATOR_POST_KNAUF_SOURCE_ACQUISITION_V1_PLAN.md",
  selectedRouteFamily: "post_knauf_source_locator_acquisition_no_runtime",
  selectionStatus:
    "selected_post_knauf_source_acquisition_v1_after_v7_rerank_found_no_runtime_ready_candidate_and_current_sources_exhausted",
  sliceId: "calculator_source_gap_revalidation_v7",
  sourceReadyRuntimePackAvailable: false,
  supportPromotion: false,
  targetFirstGateFile: "packages/engine/src/calculator-post-knauf-source-acquisition-gate-a-contract.test.ts",
  workbenchInputBehaviorChange: false
} as const;

const REQUIRED_PLANNING_SURFACES = [
  "packages/engine/src/calculator-source-gap-revalidation-v7-gate-a-contract.test.ts",
  "packages/engine/src/post-steel-stud-knauf-enpc-mapping-tolerance-v1-next-slice-selection-contract.test.ts",
  "packages/engine/src/steel-stud-knauf-enpc-mapping-tolerance-gate-a-contract.test.ts",
  "packages/engine/src/calculator-source-gap-revalidation-v6-gate-a-contract.test.ts",
  "packages/engine/src/post-twin-timber-knauf-ttf302a-mapping-tolerance-v1-next-slice-selection-contract.test.ts",
  "packages/engine/src/post-lined-masonry-knauf-mwi2a-mapping-tolerance-v1-next-slice-selection-contract.test.ts",
  "packages/engine/src/post-timber-double-board-knauf-tb5a-mapping-tolerance-v1-next-slice-selection-contract.test.ts",
  "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V7_PLAN.md",
  "docs/calculator/SLICE_CALCULATOR_POST_KNAUF_SOURCE_ACQUISITION_V1_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-04-30_CALCULATOR_SOURCE_GAP_REVALIDATION_V7_GATE_A_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-04-30_STEEL_STUD_KNAUF_ENPC_MAPPING_TOLERANCE_GATE_C_CLOSEOUT_HANDOFF.md",
  "docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md",
  "docs/calculator/CALCULATOR_COMPREHENSIVE_ACCURACY_ROADMAP.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "AGENTS.md"
] as const;

const CONCRETE_KNAUF_CLOSEOUTS = [
  {
    closedSlice: "timber_double_board_knauf_tb5a_mapping_tolerance_v1",
    runtimeImportReadyNow: false,
    systemCode: "TB.5A",
    unresolvedOwner:
      "stud_depth_column_sheetrock_one_ki75g11_lab_field_policy_tolerance_owner_and_visible_tests"
  },
  {
    closedSlice: "lined_masonry_knauf_mwi2a_mapping_tolerance_v1",
    runtimeImportReadyNow: false,
    systemCode: "MWI.2A",
    unresolvedOwner:
      "substrate_mass_furring_cavity_coupling_sheetrock_ki_mapping_field_policy_tolerance_owner_and_visible_tests"
  },
  {
    closedSlice: "twin_timber_knauf_ttf302a_mapping_tolerance_v1",
    runtimeImportReadyNow: false,
    systemCode: "TTF30.2A",
    unresolvedOwner:
      "twin_frame_gap_side_asymmetry_fiberock_column_selection_glasswool_field_policy_tolerance_owner_and_visible_tests"
  },
  {
    closedSlice: "steel_stud_knauf_enpc_mapping_tolerance_v1",
    runtimeImportReadyNow: false,
    systemCode: "EN-PC-50-055-6-2-12.5-WB-25",
    unresolvedOwner:
      "wallboard_acoustic_roll_stud_depth_gauge_field_policy_spectrum_terms_tolerance_owner_and_visible_tests"
  }
] as const;

const REMAINING_KNAUF_BOUNDARIES = [
  {
    currentPosture: "aac_adjacent_context_only",
    firstMissingRequirement:
      "aac_density_panel_gap_discontinuous_frame_sheetrock_mapping_metric_policy_tolerance_owner_and_visible_tests",
    runtimeImportReadyNow: false,
    systemCode: "AAC.1A"
  },
  {
    currentPosture: "staggered_timber_adjacent_context_only",
    firstMissingRequirement:
      "staggered_stud_fiberock_side_configuration_live_topology_mapping_tolerance_owner_and_visible_tests",
    runtimeImportReadyNow: false,
    systemCode: "TSF120.1A"
  },
  {
    currentPosture: "one_side_lined_negative_boundary",
    firstMissingRequirement: "one_side_lined_row_is_not_two_sided_runtime_wall_truth",
    runtimeImportReadyNow: false,
    systemCode: "TO120.1A"
  }
] as const;

const V7_RERANK_CANDIDATES: readonly V7Candidate[] = [
  {
    currentPosture: "current_source_reservoir_exhausted_after_knauf_mapping_closeouts",
    docOwner: "docs/calculator/SLICE_CALCULATOR_POST_KNAUF_SOURCE_ACQUISITION_V1_PLAN.md",
    executableTestOwner: "packages/engine/src/calculator-post-knauf-source-acquisition-gate-a-contract.test.ts",
    firstMissingRequirement:
      "fresh_official_source_locators_with_exact_topology_metric_tolerance_material_mapping_negative_boundaries_and_paired_visible_test_ownership",
    id: "calculator_post_knauf_source_acquisition",
    protectedNegativeBoundaries: [
      "closed_knauf_rows_remain_context_only_until_exact_runtime_prerequisites_are_named",
      "remaining_knauf_aac_tsf_to_rows_do_not_promote_runtime_from_adjacent_context",
      "old_clt_floor_generated_floor_no_stud_lined_heavy_and_historical_blockers_do_not_reopen_without_new_source_truth"
    ],
    rank: 1,
    readiness: {
      exactTopologyOrBoundedRuleNamed: false,
      localMaterialMappingNamed: false,
      metricOwnerNamed: false,
      pairedEngineVisibleTestsNamed: false,
      pairedWebVisibleTestsNamed: false,
      protectedNegativeBoundariesNamed: true,
      runtimeImportReadyNow: false,
      sourceLocatorConcrete: false,
      toleranceOwnerNamed: false
    },
    reason:
      "all_current_concrete_knauf_mapping_rows_and_recent_non_knauf_source_reservoirs_have_closed_no_runtime_so_the_highest_value_next_step_is_to_acquire_new_official_source_locators_before_selecting_another_family_specific_mapping_or_runtime_slice",
    runtimeBehaviorChange: false,
    selectedNext: true,
    targetFile: "packages/engine/src/calculator-post-knauf-source-acquisition-gate-a-contract.test.ts",
    userVisibleRisk:
      "continuing to rerank the same exhausted source set can create false momentum without improving floor_or_wall_accuracy_or_coverage",
    validationScope: [
      "post_knauf_source_acquisition_gate_a_contract",
      "source_ready_intake_backlog_refresh",
      "comprehensive_accuracy_roadmap_refresh",
      "pnpm_calculator_gate_current",
      "git_diff_check"
    ]
  },
  {
    currentPosture: "remaining_knauf_adjacent_rows_are_not_runtime_import_candidates",
    docOwner: "docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md",
    executableTestOwner: "packages/engine/src/knauf-wall-systems-source-pack-extraction-gate-b-contract.test.ts",
    firstMissingRequirement:
      "aac_tsf_to_exact_topology_material_mapping_metric_policy_tolerance_owner_and_visible_tests",
    id: "remaining_knauf_aac_tsf_to_followup",
    protectedNegativeBoundaries: [
      "TO120.1A_one_side_lined_row_must_stay_negative_for_two_sided_wall_truth",
      "TSF120.1A_staggered_timber_context_must_not_promote_direct_timber_or_twin_frame_routes",
      "AAC.1A_panel_frame_context_must_not_promote_generic_masonry_or_steel_stud_routes"
    ],
    rank: 2,
    readiness: {
      exactTopologyOrBoundedRuleNamed: false,
      localMaterialMappingNamed: false,
      metricOwnerNamed: false,
      pairedEngineVisibleTestsNamed: false,
      pairedWebVisibleTestsNamed: false,
      protectedNegativeBoundariesNamed: true,
      runtimeImportReadyNow: false,
      sourceLocatorConcrete: true,
      toleranceOwnerNamed: false
    },
    reason:
      "remaining_knauf_rows_are_useful_boundaries_but_gate_b_already_classified_them_as_adjacent_or_negative_and_none_outmatches_new_source_acquisition_after_the_four_concrete_mapping_rows_closed",
    runtimeBehaviorChange: false,
    selectedNext: false,
    targetFile: "docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md",
    userVisibleRisk:
      "adjacent Knauf rows could leak into generic AAC timber or steel routes if reopened without exact topology and tolerance owners",
    validationScope: ["knauf_gate_b_context", "post_knauf_backlog_context"]
  },
  {
    currentPosture: "formula_owned_mass_timber_wall_source_gated_after_prior_extraction",
    docOwner: "docs/calculator/SLICE_CLT_MASS_TIMBER_WALL_SOURCE_PACK_EXTRACTION_PLAN.md",
    executableTestOwner: "packages/engine/src/clt-mass-timber-wall-source-pack-extraction-gate-b-contract.test.ts",
    firstMissingRequirement:
      "wall_specific_single_number_metric_policy_or_frequency_recompute_path_plus_laminated_leaf_tolerance_owner",
    id: "clt_mass_timber_second_pass_metric_tolerance",
    protectedNegativeBoundaries: [
      "dataholz_clt_floor_rows_remain_floor_only",
      "iic_context_does_not_support_wall_airborne_outputs",
      "woodworks_database_pointers_do_not_import_without_report_and_metric_mapping"
    ],
    rank: 3,
    readiness: {
      exactTopologyOrBoundedRuleNamed: false,
      localMaterialMappingNamed: false,
      metricOwnerNamed: false,
      pairedEngineVisibleTestsNamed: false,
      pairedWebVisibleTestsNamed: false,
      protectedNegativeBoundariesNamed: true,
      runtimeImportReadyNow: false,
      sourceLocatorConcrete: true,
      toleranceOwnerNamed: false
    },
    reason:
      "clt_and_mass_timber_remain_important_but_the_recent_extraction_gate_found_metric_policy_and_tolerance_blockers_that_need_new_source_or_model_evidence_before_another_mapping_attempt",
    runtimeBehaviorChange: false,
    selectedNext: false,
    targetFile: "packages/engine/src/clt-mass-timber-wall-source-pack-extraction-gate-b-contract.test.ts",
    userVisibleRisk:
      "mass_timber_wall_outputs_can_look_more_source_backed_than_their_metric_conversion_and_tolerance_evidence_supports",
    validationScope: ["clt_mass_timber_gate_b_context", "clt_visible_estimate_web_context"]
  },
  {
    currentPosture: "generated_floor_fallback_low_confidence_after_topology_delta_near_misses",
    docOwner: "docs/calculator/SLICE_GENERATED_FLOOR_FALLBACK_TOPOLOGY_DELTA_V1_PLAN.md",
    executableTestOwner: "packages/engine/src/generated-floor-fallback-topology-delta-gate-a-contract.test.ts",
    firstMissingRequirement:
      "new_exact_floor_topology_match_or_bounded_steel_open_web_family_rule_with_metric_tolerance_and_visible_test_owners",
    id: "generated_floor_fallback_new_source_rule",
    protectedNegativeBoundaries: [
      "pliteq_exact_rows_apply_only_to_exact_source_topology",
      "ubiq_fl32_bound_precedence_stays_source_topology_gated",
      "many_layer_generated_split_variants_remain_finite_low_confidence_screening"
    ],
    rank: 4,
    readiness: {
      exactTopologyOrBoundedRuleNamed: false,
      localMaterialMappingNamed: false,
      metricOwnerNamed: false,
      pairedEngineVisibleTestsNamed: false,
      pairedWebVisibleTestsNamed: false,
      protectedNegativeBoundariesNamed: true,
      runtimeImportReadyNow: false,
      sourceLocatorConcrete: true,
      toleranceOwnerNamed: false
    },
    reason:
      "floor_fallback_is_high_value_for_coverage_but_the_recent_topology_delta_found_near_misses_only_so_it_needs_new_sources_or_a_bounded_family_rule_before_runtime_movement",
    runtimeBehaviorChange: false,
    selectedNext: false,
    targetFile: "packages/engine/src/generated-floor-fallback-topology-delta-gate-a-contract.test.ts",
    userVisibleRisk:
      "generated_floor_routes_can_overstate_accuracy_if_exact_or_bound_source_precedence_is_inherited_by_proximity",
    validationScope: ["generated_floor_topology_delta_context", "floor_many_layer_and_order_edge_context"]
  },
  {
    currentPosture: "no_stud_double_leaf_formula_owned_source_blocked",
    docOwner: "docs/calculator/SLICE_WALL_NO_STUD_DOUBLE_LEAF_SOURCE_RESEARCH_PLAN.md",
    executableTestOwner: "packages/engine/src/wall-no-stud-double-leaf-source-research-gate-b-contract.test.ts",
    firstMissingRequirement:
      "direct_no_stud_no_rail_row_or_local_davy_sharp_single_number_tolerance_owner_with_visible_tests",
    id: "no_stud_double_leaf_formula_tolerance",
    protectedNegativeBoundaries: [
      "framed_double_leaf_rows_do_not_promote_no_stud_truth",
      "formula_scope_does_not_move_values_without_local_single_number_tolerance_owner"
    ],
    rank: 5,
    readiness: {
      exactTopologyOrBoundedRuleNamed: false,
      localMaterialMappingNamed: false,
      metricOwnerNamed: false,
      pairedEngineVisibleTestsNamed: false,
      pairedWebVisibleTestsNamed: false,
      protectedNegativeBoundariesNamed: true,
      runtimeImportReadyNow: false,
      sourceLocatorConcrete: false,
      toleranceOwnerNamed: false
    },
    reason:
      "no_stud_double_leaf_remains_a_common_gap_but_the_prior_source_research_found_no_direct_row_or_local_formula_tolerance_owner_ready_for_runtime",
    runtimeBehaviorChange: false,
    selectedNext: false,
    targetFile: "packages/engine/src/wall-no-stud-double-leaf-source-research-gate-b-contract.test.ts",
    userVisibleRisk: "unsupported_or_formula_owned_no_stud_cases_should_not_return_false_precision",
    validationScope: ["no_stud_double_leaf_gate_b_context", "unsupported_output_partition_context"]
  },
  {
    currentPosture: "lined_massive_heavy_core_wall_screening_without_bounded_lining_rule",
    docOwner: "docs/calculator/SLICE_WALL_LINED_MASSIVE_HEAVY_CORE_SOURCE_RESEARCH_PLAN.md",
    executableTestOwner: "packages/engine/src/wall-lined-massive-heavy-core-source-research-gate-a-contract.test.ts",
    firstMissingRequirement:
      "wall_specific_lined_concrete_or_heavy_masonry_source_row_or_bounded_lining_rule_with_field_output_tolerance",
    id: "lined_massive_heavy_core_lining_rule",
    protectedNegativeBoundaries: [
      "floor_only_or_ceiling_lining_rows_do_not_become_wall_truth",
      "heavy_concrete_parity_checks_do_not_reopen_the_screening_route_without_source_evidence"
    ],
    rank: 6,
    readiness: {
      exactTopologyOrBoundedRuleNamed: false,
      localMaterialMappingNamed: false,
      metricOwnerNamed: false,
      pairedEngineVisibleTestsNamed: false,
      pairedWebVisibleTestsNamed: false,
      protectedNegativeBoundariesNamed: true,
      runtimeImportReadyNow: false,
      sourceLocatorConcrete: false,
      toleranceOwnerNamed: false
    },
    reason:
      "lined_massive_heavy_core_is_still_screening_and_needs_new_wall_specific_lining_sources_or_a_bounded_rule_before_confidence_or_value_movement",
    runtimeBehaviorChange: false,
    selectedNext: false,
    targetFile: "packages/engine/src/wall-lined-massive-heavy-core-source-research-gate-a-contract.test.ts",
    userVisibleRisk: "renovation_heavy_core_wall_values_can_be_mistaken_for_source_backed_wall_truth",
    validationScope: ["lined_massive_source_research_context", "heavy_core_screening_context"]
  },
  {
    currentPosture: "historical_blockers_must_stay_fail_closed",
    docOwner: "docs/calculator/SOURCE_GAP_LEDGER.md",
    executableTestOwner: "packages/engine/src/blocked-source-backed-widening-rerank-refresh-contract.test.ts",
    firstMissingRequirement: "new_evidence_that_directly_satisfies_each_family_original_blocker",
    id: "historical_blocked_family_reopen",
    protectedNegativeBoundaries: [
      "gdmtxa04a_must_not_reopen_from_adjacent_dataholz_context",
      "c11c_must_not_reopen_without_exact_frequency_and_metric_resolution",
      "raw_open_box_open_web_must_not_reopen_from_nearby_floor_context",
      "wall_selector_behavior_must_not_reopen_from_green_tests_alone"
    ],
    rank: 7,
    readiness: {
      exactTopologyOrBoundedRuleNamed: false,
      localMaterialMappingNamed: false,
      metricOwnerNamed: false,
      pairedEngineVisibleTestsNamed: false,
      pairedWebVisibleTestsNamed: false,
      protectedNegativeBoundariesNamed: true,
      runtimeImportReadyNow: false,
      sourceLocatorConcrete: false,
      toleranceOwnerNamed: false
    },
    reason:
      "historical_blocked_families_remain_closed_until_their_original_evidence_or_topology_blockers_are_satisfied_directly",
    runtimeBehaviorChange: false,
    selectedNext: false,
    targetFile: "docs/calculator/SOURCE_GAP_LEDGER.md",
    userVisibleRisk: "old_exact_or_raw_routes_could_silently_regain_support_from_unrelated_nearby_evidence",
    validationScope: ["blocked_source_rank_contracts", "source_gap_ledger_context"]
  },
  {
    currentPosture: "controlled_use_and_productization_do_not_raise_accuracy",
    docOwner: "docs/calculator/INTERNAL_USE_PILOT_HANDOFF.md",
    executableTestOwner: "packages/engine/src/internal-use-acceptance-rehearsal-v1-gate-a-contract.test.ts",
    firstMissingRequirement:
      "concrete_operator_defect_or_source_ready_accuracy_pack_before_confidence_support_copy_or_productization_promotion",
    id: "internal_use_or_productization_only_work",
    protectedNegativeBoundaries: [
      "pilot_handoff_does_not_promote_source_gated_families",
      "productization_does_not_improve_calculator_accuracy_or_source_readiness"
    ],
    rank: 8,
    readiness: {
      exactTopologyOrBoundedRuleNamed: false,
      localMaterialMappingNamed: false,
      metricOwnerNamed: false,
      pairedEngineVisibleTestsNamed: false,
      pairedWebVisibleTestsNamed: false,
      protectedNegativeBoundariesNamed: true,
      runtimeImportReadyNow: false,
      sourceLocatorConcrete: false,
      toleranceOwnerNamed: false
    },
    reason:
      "internal_use_is_available_inside_the_handoff_envelope_but_the_user_priority_is_broader_more_accurate_calculation_so_source_acquisition_outranks_productization_without_a_defect",
    runtimeBehaviorChange: false,
    selectedNext: false,
    targetFile: "docs/calculator/INTERNAL_USE_PILOT_HANDOFF.md",
    userVisibleRisk: "workflow_polish_or_pilot_success_could_be_mistaken_for_broad_high_confidence_coverage",
    validationScope: ["internal_use_acceptance_rehearsal", "internal_use_pilot_handoff"]
  }
] as const;

const SELECTED_POST_KNAUF_SOURCE_ACQUISITION_SCOPE = {
  firstGate: "gate_a_acquire_and_classify_post_knauf_source_locators_without_runtime_import",
  requiredArtifacts: [
    "official_source_locator_matrix_for_top_wall_and_floor_gaps",
    "candidate_eligibility_rules_for_exact_topology_metric_tolerance_material_and_visible_test_ownership",
    "per_family_source_search_targets_for_clt_mass_timber_generated_floor_no_stud_lined_heavy_and_timber_double_board",
    "explicit_rejection_rules_for_exhausted_knauf_rows_and_historical_blockers",
    "selected_next_extraction_or_mapping_slice_only_if_a_concrete_locator_becomes_ready",
    "validation_scope_with_targeted_contract_current_gate_and_git_diff_check"
  ],
  runtimeBehaviorChange: false,
  selectedPlanningSurface: "docs/calculator/SLICE_CALCULATOR_POST_KNAUF_SOURCE_ACQUISITION_V1_PLAN.md",
  targetFirstGateFile: "packages/engine/src/calculator-post-knauf-source-acquisition-gate-a-contract.test.ts"
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

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("calculator source-gap revalidation v7 Gate A contract", () => {
  it("lands v7 Gate A without runtime or visible-surface movement", () => {
    expect(CALCULATOR_SOURCE_GAP_REVALIDATION_V7_GATE_A).toEqual({
      apiShapeChange: false,
      confidencePromotion: false,
      evidencePromotion: false,
      landedGate: "gate_a_revalidate_source_accuracy_gap_order_after_all_concrete_knauf_mapping_closeouts",
      latestClosedSlice: "steel_stud_knauf_enpc_mapping_tolerance_v1",
      numericRuntimeBehaviorChange: false,
      outputCardStatusChange: false,
      outputSupportChange: false,
      proposalReportCopyChange: false,
      routeCardValueChange: false,
      runtimeImportSelectedNow: false,
      runtimeTightening: false,
      runtimeWidening: false,
      selectedImplementationSlice: "calculator_post_knauf_source_acquisition_v1",
      selectedPlanningSurface: "docs/calculator/SLICE_CALCULATOR_POST_KNAUF_SOURCE_ACQUISITION_V1_PLAN.md",
      selectedRouteFamily: "post_knauf_source_locator_acquisition_no_runtime",
      selectionStatus:
        "selected_post_knauf_source_acquisition_v1_after_v7_rerank_found_no_runtime_ready_candidate_and_current_sources_exhausted",
      sliceId: "calculator_source_gap_revalidation_v7",
      sourceReadyRuntimePackAvailable: false,
      supportPromotion: false,
      targetFirstGateFile: "packages/engine/src/calculator-post-knauf-source-acquisition-gate-a-contract.test.ts",
      workbenchInputBehaviorChange: false
    });

    for (const path of REQUIRED_PLANNING_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("keeps every concrete Knauf mapping closeout out of runtime import", () => {
    expect(CONCRETE_KNAUF_CLOSEOUTS.map((row) => row.systemCode)).toEqual([
      "TB.5A",
      "MWI.2A",
      "TTF30.2A",
      "EN-PC-50-055-6-2-12.5-WB-25"
    ]);
    expect(CONCRETE_KNAUF_CLOSEOUTS.every((row) => row.runtimeImportReadyNow === false)).toBe(true);
    expect(CONCRETE_KNAUF_CLOSEOUTS.every((row) => row.unresolvedOwner.length > 80)).toBe(true);
  });

  it("keeps remaining Knauf rows as adjacent or negative context only", () => {
    expect(REMAINING_KNAUF_BOUNDARIES.map((row) => row.systemCode)).toEqual([
      "AAC.1A",
      "TSF120.1A",
      "TO120.1A"
    ]);
    expect(REMAINING_KNAUF_BOUNDARIES.every((row) => row.runtimeImportReadyNow === false)).toBe(true);
    expect(REMAINING_KNAUF_BOUNDARIES.find((row) => row.systemCode === "TO120.1A")).toMatchObject({
      currentPosture: "one_side_lined_negative_boundary"
    });
  });

  it("reranks source and accuracy candidates after current sources are exhausted", () => {
    expect(V7_RERANK_CANDIDATES.map((candidate) => candidate.id)).toEqual([
      "calculator_post_knauf_source_acquisition",
      "remaining_knauf_aac_tsf_to_followup",
      "clt_mass_timber_second_pass_metric_tolerance",
      "generated_floor_fallback_new_source_rule",
      "no_stud_double_leaf_formula_tolerance",
      "lined_massive_heavy_core_lining_rule",
      "historical_blocked_family_reopen",
      "internal_use_or_productization_only_work"
    ]);
    expect(V7_RERANK_CANDIDATES.map((candidate) => candidate.rank)).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
    expect(new Set(V7_RERANK_CANDIDATES.map((candidate) => candidate.id)).size).toBe(
      V7_RERANK_CANDIDATES.length
    );
    expect(V7_RERANK_CANDIDATES.every((candidate) => candidate.runtimeBehaviorChange === false)).toBe(true);
    expect(V7_RERANK_CANDIDATES.every((candidate) => candidate.readiness.runtimeImportReadyNow === false)).toBe(
      true
    );
    expect(
      V7_RERANK_CANDIDATES.every((candidate) => candidate.readiness.protectedNegativeBoundariesNamed)
    ).toBe(true);
    expect(V7_RERANK_CANDIDATES.every((candidate) => candidate.firstMissingRequirement.length > 60)).toBe(true);
  });

  it("selects post-Knauf source acquisition as the next no-runtime accuracy step", () => {
    expect(V7_RERANK_CANDIDATES.filter((candidate) => candidate.selectedNext)).toEqual([
      expect.objectContaining({
        id: "calculator_post_knauf_source_acquisition",
        rank: 1,
        readiness: expect.objectContaining({
          exactTopologyOrBoundedRuleNamed: false,
          localMaterialMappingNamed: false,
          metricOwnerNamed: false,
          pairedEngineVisibleTestsNamed: false,
          pairedWebVisibleTestsNamed: false,
          runtimeImportReadyNow: false,
          sourceLocatorConcrete: false,
          toleranceOwnerNamed: false
        }),
        selectedNext: true,
        targetFile: "packages/engine/src/calculator-post-knauf-source-acquisition-gate-a-contract.test.ts"
      })
    ]);
  });

  it("defines the selected source acquisition Gate A scope before any runtime or visible movement", () => {
    expect(SELECTED_POST_KNAUF_SOURCE_ACQUISITION_SCOPE).toEqual({
      firstGate: "gate_a_acquire_and_classify_post_knauf_source_locators_without_runtime_import",
      requiredArtifacts: [
        "official_source_locator_matrix_for_top_wall_and_floor_gaps",
        "candidate_eligibility_rules_for_exact_topology_metric_tolerance_material_and_visible_test_ownership",
        "per_family_source_search_targets_for_clt_mass_timber_generated_floor_no_stud_lined_heavy_and_timber_double_board",
        "explicit_rejection_rules_for_exhausted_knauf_rows_and_historical_blockers",
        "selected_next_extraction_or_mapping_slice_only_if_a_concrete_locator_becomes_ready",
        "validation_scope_with_targeted_contract_current_gate_and_git_diff_check"
      ],
      runtimeBehaviorChange: false,
      selectedPlanningSurface: "docs/calculator/SLICE_CALCULATOR_POST_KNAUF_SOURCE_ACQUISITION_V1_PLAN.md",
      targetFirstGateFile: "packages/engine/src/calculator-post-knauf-source-acquisition-gate-a-contract.test.ts"
    });
  });

  it("keeps active docs aligned on the selected post-Knauf source acquisition slice", () => {
    const docs = [
      readRepoFile("AGENTS.md"),
      readRepoFile("docs/calculator/NEXT_IMPLEMENTATION_PLAN.md"),
      readRepoFile("docs/calculator/CURRENT_STATE.md"),
      readRepoFile("docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V7_PLAN.md"),
      readRepoFile(CALCULATOR_SOURCE_GAP_REVALIDATION_V7_GATE_A.selectedPlanningSurface),
      readRepoFile("docs/calculator/CHECKPOINT_2026-04-30_CALCULATOR_SOURCE_GAP_REVALIDATION_V7_GATE_A_HANDOFF.md")
    ];

    for (const doc of docs) {
      expect(doc).toContain(CALCULATOR_SOURCE_GAP_REVALIDATION_V7_GATE_A.selectedImplementationSlice);
      expect(doc).toContain(CALCULATOR_SOURCE_GAP_REVALIDATION_V7_GATE_A.targetFirstGateFile);
      expect(doc).toContain(CALCULATOR_SOURCE_GAP_REVALIDATION_V7_GATE_A.selectionStatus);
      expect(doc).toContain("post-Knauf");
      expect(doc).toContain("no-runtime");
    }
  });

  it("keeps frozen surfaces and validation expectations explicit", () => {
    const joinedDocs = [
      readRepoFile("docs/calculator/CHECKPOINT_2026-04-30_CALCULATOR_SOURCE_GAP_REVALIDATION_V7_GATE_A_HANDOFF.md"),
      readRepoFile("docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V7_PLAN.md"),
      readRepoFile("docs/calculator/SLICE_CALCULATOR_POST_KNAUF_SOURCE_ACQUISITION_V1_PLAN.md")
    ].join("\n");

    for (const surface of FROZEN_SURFACES) {
      expect(joinedDocs, surface).toContain(surface);
    }

    expect(joinedDocs).toContain("pnpm --filter @dynecho/engine exec vitest run src/calculator-source-gap-revalidation-v7-gate-a-contract.test.ts --maxWorkers=1");
    expect(joinedDocs).toContain("pnpm calculator:gate:current");
    expect(joinedDocs).toContain("git diff --check");
  });
});
