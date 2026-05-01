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

type V5Candidate = {
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

const CALCULATOR_SOURCE_GAP_REVALIDATION_V5_GATE_A = {
  apiShapeChange: false,
  confidencePromotion: false,
  evidencePromotion: false,
  landedGate: "gate_a_revalidate_source_accuracy_gap_order_after_knauf_source_pack_closeout",
  latestClosedSlice: "knauf_wall_systems_source_pack_extraction_v1",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: false,
  outputSupportChange: false,
  proposalReportCopyChange: false,
  routeCardValueChange: false,
  runtimeImportSelectedNow: false,
  runtimeTightening: false,
  runtimeWidening: false,
  selectedImplementationSlice: "timber_double_board_knauf_tb5a_mapping_tolerance_v1",
  selectedPlanningSurface: "docs/calculator/SLICE_TIMBER_DOUBLE_BOARD_KNAUF_TB5A_MAPPING_TOLERANCE_PLAN.md",
  selectedRouteFamily: "timber_double_board_knauf_tb5a_mapping_tolerance_no_runtime",
  selectionStatus:
    "selected_no_runtime_knauf_tb5a_timber_double_board_mapping_tolerance_after_v5_rerank_found_no_runtime_ready_candidate",
  sliceId: "calculator_source_gap_revalidation_v5",
  sourceReadyRuntimePackAvailable: false,
  supportPromotion: false,
  targetFirstGateFile: "packages/engine/src/timber-double-board-knauf-tb5a-mapping-tolerance-gate-a-contract.test.ts",
  workbenchInputBehaviorChange: false
} as const;

const REQUIRED_PLANNING_SURFACES = [
  "packages/engine/src/calculator-source-gap-revalidation-v5-gate-a-contract.test.ts",
  "packages/engine/src/knauf-wall-systems-source-pack-extraction-gate-a-contract.test.ts",
  "packages/engine/src/knauf-wall-systems-source-pack-extraction-gate-b-contract.test.ts",
  "packages/engine/src/post-knauf-wall-systems-source-pack-extraction-v1-next-slice-selection-contract.test.ts",
  "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V5_PLAN.md",
  "docs/calculator/SLICE_TIMBER_DOUBLE_BOARD_KNAUF_TB5A_MAPPING_TOLERANCE_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-04-30_CALCULATOR_SOURCE_GAP_REVALIDATION_V5_GATE_A_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-04-29_POST_KNAUF_V5_READY_REVALIDATION_HANDOFF.md",
  "docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md",
  "docs/calculator/CALCULATOR_COMPREHENSIVE_ACCURACY_ROADMAP.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "AGENTS.md"
] as const;

const GATE_B_KNAUF_ROWS = [
  {
    closeoutPosture: "steel_stud_roadmap_context",
    firstMissingRequirement:
      "wallboard_acoustic_roll_stud_gauge_equivalence_tolerance_owner_and_paired_visible_tests",
    runtimeImportReadyNow: false,
    systemCode: "EN-PC-50-055-6-2-12.5-WB-25"
  },
  {
    closeoutPosture: "selected_no_runtime_mapping_tolerance_followup",
    firstMissingRequirement:
      "exact_stud_depth_column_sheetrock_one_mapping_ki75g11_mapping_lab_field_policy_and_tolerance_owner",
    runtimeImportReadyNow: false,
    systemCode: "TB.5A"
  },
  {
    closeoutPosture: "twin_timber_double_leaf_adjacent_context",
    firstMissingRequirement:
      "twin_frame_gap_side_asymmetry_fiberock_mapping_double_leaf_tolerance_owner_and_visible_tests",
    runtimeImportReadyNow: false,
    systemCode: "TTF30.2A"
  },
  {
    closeoutPosture: "lined_masonry_roadmap_context",
    firstMissingRequirement:
      "substrate_mass_furring_cavity_coupling_sheetrock_mapping_field_policy_and_tolerance_owner",
    runtimeImportReadyNow: false,
    systemCode: "MWI.2A"
  },
  {
    closeoutPosture: "one_side_lined_negative_boundary",
    firstMissingRequirement: "one_side_lined_row_is_not_two_sided_timber_double_board_truth",
    runtimeImportReadyNow: false,
    systemCode: "TO120.1A"
  },
  {
    closeoutPosture: "staggered_stud_adjacent_context",
    firstMissingRequirement: "staggered_stud_and_fiberock_topology_are_not_live_direct_timber_inputs",
    runtimeImportReadyNow: false,
    systemCode: "TSF120.1A"
  },
  {
    closeoutPosture: "aac_adjacent_context",
    firstMissingRequirement: "aac_density_discontinuous_frame_and_panel_mapping_are_not_generic_wall_truth",
    runtimeImportReadyNow: false,
    systemCode: "AAC.1A"
  }
] as const;

const V5_RERANK_CANDIDATES: readonly V5Candidate[] = [
  {
    currentPosture: "concrete_knauf_locator_not_runtime_import",
    docOwner: "docs/calculator/SLICE_TIMBER_DOUBLE_BOARD_KNAUF_TB5A_MAPPING_TOLERANCE_PLAN.md",
    executableTestOwner:
      "packages/engine/src/timber-double-board-knauf-tb5a-mapping-tolerance-gate-a-contract.test.ts",
    firstMissingRequirement:
      "exact_tb5a_stud_depth_column_sheetrock_one_mapping_ki75g11_mapping_lab_field_policy_tolerance_owner_and_paired_visible_tests",
    id: "knauf_tb5a_timber_double_board_mapping_tolerance",
    protectedNegativeBoundaries: [
      "TO120.1A_one_side_lined_row_must_not_promote_two_sided_timber_truth",
      "TSF120.1A_staggered_stud_context_must_not_promote_direct_line_connection",
      "TTF30.2A_twin_frame_context_must_not_promote_single_cavity_timber_truth",
      "single_board_and_resilient_timber_exact_rows_do_not_promote_direct_double_board_without_topology_match"
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
      sourceLocatorConcrete: true,
      toleranceOwnerNamed: false
    },
    reason:
      "tb5a_is_the_highest_value_no_runtime_followup_because_it_targets_a_common_live_timber_double_board_lane_with_a_concrete_knauf_locator_but_still_lacks_mapping_and_tolerance_ownership",
    runtimeBehaviorChange: false,
    selectedNext: true,
    targetFile: "packages/engine/src/timber-double-board-knauf-tb5a-mapping-tolerance-gate-a-contract.test.ts",
    userVisibleRisk:
      "the common timber double-board wall route remains low-confidence and formula-owned until the Knauf row can be mapped or explicitly rejected",
    validationScope: [
      "targeted_tb5a_mapping_tolerance_gate_a_contract",
      "knauf_gate_b_closeout_context",
      "wall_timber_double_board_source_research_context",
      "pnpm_calculator_gate_current",
      "git_diff_check"
    ]
  },
  {
    currentPosture: "concrete_knauf_locator_not_runtime_import",
    docOwner: "docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md",
    executableTestOwner:
      "packages/engine/src/lined-masonry-knauf-mwi2a-mapping-tolerance-gate-a-contract.test.ts",
    firstMissingRequirement:
      "mwi2a_substrate_mass_furring_cavity_coupling_sheetrock_mapping_field_output_policy_tolerance_owner_and_visible_tests",
    id: "knauf_mwi2a_lined_masonry_mapping_tolerance",
    protectedNegativeBoundaries: [
      "masonry_upgrade_row_must_not_become_generic_lined_heavy_wall_truth",
      "aac_panel_context_must_stay_adjacent_until_density_and_frame_mapping_are_complete"
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
      "mwi2a_attacks_the_lined_masonry_heavy_core_screening_gap_but_has_more_substrate_and_coupling_unknowns_than_tb5a",
    runtimeBehaviorChange: false,
    selectedNext: false,
    targetFile: "packages/engine/src/lined-masonry-knauf-mwi2a-mapping-tolerance-gate-a-contract.test.ts",
    userVisibleRisk:
      "lined masonry and heavy-core estimates can look more precise than their substrate and coupling evidence allows",
    validationScope: ["knauf_gate_b_context", "lined_massive_heavy_core_source_research_context"]
  },
  {
    currentPosture: "formula_source_gated_metric_policy_blocked",
    docOwner: "docs/calculator/SLICE_CLT_MASS_TIMBER_WALL_SOURCE_PACK_EXTRACTION_PLAN.md",
    executableTestOwner: "packages/engine/src/clt-mass-timber-wall-source-pack-extraction-gate-b-contract.test.ts",
    firstMissingRequirement:
      "explicit_stc_fstc_astc_iic_to_dyn_echo_metric_policy_or_rejection_plus_formula_tolerance_owner",
    id: "clt_mass_timber_metric_policy_tolerance",
    protectedNegativeBoundaries: [
      "iic_is_not_wall_airborne_truth",
      "dataholz_clt_floor_rw_remains_floor_only",
      "woodworks_database_context_is_not_import_without_exact_wall_row_mapping"
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
      "woodworks_and_nrc_context_are_useful_but_metric_conversion_and_field_output_policy_are_still_blockers_before_any_runtime_movement",
    runtimeBehaviorChange: false,
    selectedNext: false,
    targetFile: "packages/engine/src/clt-mass-timber-wall-source-pack-extraction-gate-b-contract.test.ts",
    userVisibleRisk:
      "mass-timber wall outputs remain easy to overstate if STC ASTC IIC or floor rows are treated as direct Rw wall truth",
    validationScope: ["clt_mass_timber_gate_b_contract", "clt_visible_estimate_web_context"]
  },
  {
    currentPosture: "generated_low_confidence_screening",
    docOwner: "docs/calculator/SLICE_GENERATED_FLOOR_FALLBACK_TOPOLOGY_DELTA_V1_PLAN.md",
    executableTestOwner: "packages/engine/src/generated-floor-fallback-topology-delta-gate-a-contract.test.ts",
    firstMissingRequirement:
      "exact_live_floor_topology_match_or_bounded_pliteq_ubiq_family_rule_with_metric_and_tolerance_owner",
    id: "generated_floor_fallback_pliteq_ubiq_topology",
    protectedNegativeBoundaries: [
      "pliteq_exact_rows_apply_only_to_exact_source_topology",
      "ubiq_fl32_bound_precedence_stays_source_topology_gated",
      "generated_split_variants_remain_low_confidence"
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
      "floor_fallback_has_good_source_reservoirs_but_the_recent_topology_delta_slice_found_near_misses_only",
    runtimeBehaviorChange: false,
    selectedNext: false,
    targetFile: "packages/engine/src/generated-floor-fallback-topology-delta-gate-a-contract.test.ts",
    userVisibleRisk:
      "generated floors can overstate accuracy if exact or bound source precedence is inherited by proximity",
    validationScope: ["generated_floor_topology_delta_context", "floor_many_layer_and_order_edge_context"]
  },
  {
    currentPosture: "formula_context_without_local_single_number_tolerance_owner",
    docOwner: "docs/calculator/SLICE_WALL_NO_STUD_DOUBLE_LEAF_SOURCE_RESEARCH_PLAN.md",
    executableTestOwner: "packages/engine/src/wall-no-stud-double-leaf-source-research-gate-b-contract.test.ts",
    firstMissingRequirement:
      "direct_no_stud_no_rail_row_or_local_davy_sharp_single_number_tolerance_owner_with_visible_tests",
    id: "no_stud_double_leaf_tolerance_or_direct_row",
    protectedNegativeBoundaries: [
      "framed_double_leaf_rows_do_not_promote_no_stud_truth",
      "formula_scope_does_not_move_values_without_local_tolerance_owner"
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
      "no_stud_double_leaf_stays_fail_closed_until_a_direct_row_or_local_formula_tolerance_owner_satisfies_the_original_blocker",
    runtimeBehaviorChange: false,
    selectedNext: false,
    targetFile: "packages/engine/src/wall-no-stud-double-leaf-source-research-gate-b-contract.test.ts",
    userVisibleRisk: "unsupported no-stud double-leaf cases should remain explicit instead of returning false precision",
    validationScope: ["no_stud_double_leaf_gate_b_context", "unsupported_output_partition_context"]
  },
  {
    currentPosture: "closed_blockers_must_stay_fail_closed",
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
      "historical_blocked_families_remain_closed_until_their_original_evidence_or_topology_blockers_are_satisfied_directly",
    runtimeBehaviorChange: false,
    selectedNext: false,
    targetFile: "docs/calculator/SOURCE_GAP_LEDGER.md",
    userVisibleRisk: "old exact or raw routes could silently regain support from unrelated nearby evidence",
    validationScope: ["blocked_source_rank_contracts", "source_gap_ledger_context"]
  },
  {
    currentPosture: "controlled_use_evidence_not_promotion_permission",
    docOwner: "docs/calculator/INTERNAL_USE_PILOT_HANDOFF.md",
    executableTestOwner: "packages/engine/src/internal-use-acceptance-rehearsal-v1-gate-a-contract.test.ts",
    firstMissingRequirement:
      "concrete_operator_defect_or_source_ready_accuracy_pack_before_confidence_support_or_copy_promotion",
    id: "internal_use_pilot_defect_or_promotion",
    protectedNegativeBoundaries: [
      "pilot_handoff_does_not_promote_source_gated_families",
      "acceptance_rehearsal_success_does_not_create_runtime_import_permission"
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
      "internal_use_is_available_inside_the_handoff_envelope_but_it_does_not_outrank_the_next_source_mapping_step_without_a_concrete_defect",
    runtimeBehaviorChange: false,
    selectedNext: false,
    targetFile: "docs/calculator/INTERNAL_USE_PILOT_HANDOFF.md",
    userVisibleRisk: "pilot success could be mistaken for broad high-confidence coverage outside the supported envelope",
    validationScope: ["internal_use_acceptance_rehearsal", "internal_use_pilot_handoff"]
  },
  {
    currentPosture: "deferred_while_accuracy_scope_active",
    docOwner: "docs/calculator/POST_CALCULATOR_PRODUCTIZATION_ROADMAP.md",
    executableTestOwner: "packages/engine/src/post-good-calculator-final-audit-v1-next-slice-selection-contract.test.ts",
    firstMissingRequirement: "calculator_source_accuracy_coverage_bar_must_advance_before_productization_only_work",
    id: "productization_only_work",
    protectedNegativeBoundaries: ["productization_does_not_raise_calculator_accuracy_or_source_readiness"],
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
      "product_surfaces_should_remain_deferred_while_the_user_priority_is_broader_and_more_accurate_calculation_coverage",
    runtimeBehaviorChange: false,
    selectedNext: false,
    targetFile: "docs/calculator/POST_CALCULATOR_PRODUCTIZATION_ROADMAP.md",
    userVisibleRisk: "workflow polish can consume time without improving acoustic correctness",
    validationScope: ["current_gate_only_unless_user_visible_behavior_moves"]
  }
] as const;

const SELECTED_TB5A_NEXT_SLICE_SCOPE = {
  firstGate: "gate_a_map_knauf_tb5a_topology_materials_tolerance_without_runtime_import",
  requiredArtifacts: [
    "tb5a_exact_table_row_and_stud_depth_column_decision",
    "sheetrock_one_to_local_board_mapping_or_rejection",
    "ki75g11_to_local_insulation_mapping_or_rejection",
    "lab_field_metric_and_output_policy",
    "tolerance_owner_or_explicit_tolerance_gap",
    "negative_boundaries_for_to1201a_tsf1201a_ttf302a_single_board_and_resilient_rows",
    "paired_engine_and_web_visible_test_plan_if_later_runtime_or_copy_moves"
  ],
  runtimeBehaviorChange: false,
  selectedPlanningSurface: "docs/calculator/SLICE_TIMBER_DOUBLE_BOARD_KNAUF_TB5A_MAPPING_TOLERANCE_PLAN.md",
  targetFirstGateFile: "packages/engine/src/timber-double-board-knauf-tb5a-mapping-tolerance-gate-a-contract.test.ts"
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

describe("calculator source-gap revalidation v5 Gate A contract", () => {
  it("lands v5 Gate A without runtime or visible-surface movement", () => {
    expect(CALCULATOR_SOURCE_GAP_REVALIDATION_V5_GATE_A).toEqual({
      apiShapeChange: false,
      confidencePromotion: false,
      evidencePromotion: false,
      landedGate: "gate_a_revalidate_source_accuracy_gap_order_after_knauf_source_pack_closeout",
      latestClosedSlice: "knauf_wall_systems_source_pack_extraction_v1",
      numericRuntimeBehaviorChange: false,
      outputCardStatusChange: false,
      outputSupportChange: false,
      proposalReportCopyChange: false,
      routeCardValueChange: false,
      runtimeImportSelectedNow: false,
      runtimeTightening: false,
      runtimeWidening: false,
      selectedImplementationSlice: "timber_double_board_knauf_tb5a_mapping_tolerance_v1",
      selectedPlanningSurface: "docs/calculator/SLICE_TIMBER_DOUBLE_BOARD_KNAUF_TB5A_MAPPING_TOLERANCE_PLAN.md",
      selectedRouteFamily: "timber_double_board_knauf_tb5a_mapping_tolerance_no_runtime",
      selectionStatus:
        "selected_no_runtime_knauf_tb5a_timber_double_board_mapping_tolerance_after_v5_rerank_found_no_runtime_ready_candidate",
      sliceId: "calculator_source_gap_revalidation_v5",
      sourceReadyRuntimePackAvailable: false,
      supportPromotion: false,
      targetFirstGateFile: "packages/engine/src/timber-double-board-knauf-tb5a-mapping-tolerance-gate-a-contract.test.ts",
      workbenchInputBehaviorChange: false
    });

    for (const path of REQUIRED_PLANNING_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("keeps every Knauf Gate B row blocked from runtime import", () => {
    expect(GATE_B_KNAUF_ROWS.map((row) => row.systemCode)).toEqual([
      "EN-PC-50-055-6-2-12.5-WB-25",
      "TB.5A",
      "TTF30.2A",
      "MWI.2A",
      "TO120.1A",
      "TSF120.1A",
      "AAC.1A"
    ]);
    expect(GATE_B_KNAUF_ROWS.every((row) => row.runtimeImportReadyNow === false)).toBe(true);
    expect(GATE_B_KNAUF_ROWS.find((row) => row.systemCode === "TB.5A")).toMatchObject({
      closeoutPosture: "selected_no_runtime_mapping_tolerance_followup"
    });
    expect(GATE_B_KNAUF_ROWS.find((row) => row.systemCode === "TO120.1A")).toMatchObject({
      closeoutPosture: "one_side_lined_negative_boundary"
    });
  });

  it("reranks source and accuracy candidates with no runtime-ready pack", () => {
    expect(V5_RERANK_CANDIDATES.map((candidate) => candidate.id)).toEqual([
      "knauf_tb5a_timber_double_board_mapping_tolerance",
      "knauf_mwi2a_lined_masonry_mapping_tolerance",
      "clt_mass_timber_metric_policy_tolerance",
      "generated_floor_fallback_pliteq_ubiq_topology",
      "no_stud_double_leaf_tolerance_or_direct_row",
      "historical_blocked_family_reopen",
      "internal_use_pilot_defect_or_promotion",
      "productization_only_work"
    ]);
    expect(V5_RERANK_CANDIDATES.map((candidate) => candidate.rank)).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
    expect(new Set(V5_RERANK_CANDIDATES.map((candidate) => candidate.id)).size).toBe(
      V5_RERANK_CANDIDATES.length
    );
    expect(V5_RERANK_CANDIDATES.every((candidate) => candidate.runtimeBehaviorChange === false)).toBe(true);
    expect(V5_RERANK_CANDIDATES.every((candidate) => candidate.readiness.runtimeImportReadyNow === false)).toBe(
      true
    );
    expect(
      V5_RERANK_CANDIDATES.some((candidate) => candidate.readiness.sourceLocatorConcrete)
    ).toBe(true);
    expect(V5_RERANK_CANDIDATES.every((candidate) => candidate.firstMissingRequirement.length > 60)).toBe(true);
  });

  it("selects Knauf TB.5A only as a no-runtime mapping and tolerance slice", () => {
    expect(V5_RERANK_CANDIDATES.filter((candidate) => candidate.selectedNext)).toEqual([
      expect.objectContaining({
        id: "knauf_tb5a_timber_double_board_mapping_tolerance",
        rank: 1,
        readiness: expect.objectContaining({
          exactTopologyOrBoundedRuleNamed: false,
          localMaterialMappingNamed: false,
          metricOwnerNamed: false,
          pairedEngineVisibleTestsNamed: false,
          pairedWebVisibleTestsNamed: false,
          runtimeImportReadyNow: false,
          sourceLocatorConcrete: true,
          toleranceOwnerNamed: false
        }),
        selectedNext: true,
        targetFile: "packages/engine/src/timber-double-board-knauf-tb5a-mapping-tolerance-gate-a-contract.test.ts"
      })
    ]);
  });

  it("defines the next TB.5A Gate A scope before any import or visible movement", () => {
    expect(SELECTED_TB5A_NEXT_SLICE_SCOPE).toEqual({
      firstGate: "gate_a_map_knauf_tb5a_topology_materials_tolerance_without_runtime_import",
      requiredArtifacts: [
        "tb5a_exact_table_row_and_stud_depth_column_decision",
        "sheetrock_one_to_local_board_mapping_or_rejection",
        "ki75g11_to_local_insulation_mapping_or_rejection",
        "lab_field_metric_and_output_policy",
        "tolerance_owner_or_explicit_tolerance_gap",
        "negative_boundaries_for_to1201a_tsf1201a_ttf302a_single_board_and_resilient_rows",
        "paired_engine_and_web_visible_test_plan_if_later_runtime_or_copy_moves"
      ],
      runtimeBehaviorChange: false,
      selectedPlanningSurface: "docs/calculator/SLICE_TIMBER_DOUBLE_BOARD_KNAUF_TB5A_MAPPING_TOLERANCE_PLAN.md",
      targetFirstGateFile: "packages/engine/src/timber-double-board-knauf-tb5a-mapping-tolerance-gate-a-contract.test.ts"
    });
  });

  it("keeps active docs aligned on the selected TB.5A next slice", () => {
    const docs = [
      readRepoFile("AGENTS.md"),
      readRepoFile("docs/calculator/NEXT_IMPLEMENTATION_PLAN.md"),
      readRepoFile("docs/calculator/CURRENT_STATE.md"),
      readRepoFile("docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V5_PLAN.md"),
      readRepoFile(CALCULATOR_SOURCE_GAP_REVALIDATION_V5_GATE_A.selectedPlanningSurface),
      readRepoFile("docs/calculator/CHECKPOINT_2026-04-30_CALCULATOR_SOURCE_GAP_REVALIDATION_V5_GATE_A_HANDOFF.md")
    ];

    for (const doc of docs) {
      expect(doc).toContain(CALCULATOR_SOURCE_GAP_REVALIDATION_V5_GATE_A.selectedImplementationSlice);
      expect(doc).toContain(CALCULATOR_SOURCE_GAP_REVALIDATION_V5_GATE_A.targetFirstGateFile);
      expect(doc).toContain(CALCULATOR_SOURCE_GAP_REVALIDATION_V5_GATE_A.selectionStatus);
      expect(doc).toContain("TB.5A");
      expect(doc).toContain("no-runtime");
    }
  });

  it("keeps frozen surfaces and validation expectations explicit", () => {
    const joinedDocs = [
      readRepoFile("docs/calculator/CHECKPOINT_2026-04-30_CALCULATOR_SOURCE_GAP_REVALIDATION_V5_GATE_A_HANDOFF.md"),
      readRepoFile("docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V5_PLAN.md"),
      readRepoFile("docs/calculator/SLICE_TIMBER_DOUBLE_BOARD_KNAUF_TB5A_MAPPING_TOLERANCE_PLAN.md")
    ].join("\n");

    for (const surface of FROZEN_SURFACES) {
      expect(joinedDocs, surface).toContain(surface);
    }

    expect(joinedDocs).toContain("pnpm --filter @dynecho/engine exec vitest run src/calculator-source-gap-revalidation-v5-gate-a-contract.test.ts --maxWorkers=1");
    expect(joinedDocs).toContain("pnpm calculator:gate:current");
    expect(joinedDocs).toContain("git diff --check");
  });
});
