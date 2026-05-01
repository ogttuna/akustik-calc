import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

type RuntimeReadiness = {
  exactLiveTopologyMappingNamed: boolean;
  exactSourceRowNamed: boolean;
  localMaterialMappingNamed: boolean;
  metricOwnerNamed: boolean;
  pairedEngineVisibleTestsNamed: boolean;
  pairedWebVisibleTestsNamed: boolean;
  protectedNegativeBoundariesNamed: boolean;
  runtimeImportReadyNow: false;
  sourceLocatorConcrete: boolean;
  toleranceOwnerNamed: boolean;
};

type V6Candidate = {
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

const CALCULATOR_SOURCE_GAP_REVALIDATION_V6_GATE_A = {
  apiShapeChange: false,
  confidencePromotion: false,
  evidencePromotion: false,
  landedGate: "gate_a_revalidate_source_accuracy_gap_order_after_knauf_mapping_chain_closeout",
  latestClosedSlice: "twin_timber_knauf_ttf302a_mapping_tolerance_v1",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: false,
  outputSupportChange: false,
  proposalReportCopyChange: false,
  routeCardValueChange: false,
  runtimeImportSelectedNow: false,
  runtimeTightening: false,
  runtimeWidening: false,
  selectedImplementationSlice: "steel_stud_knauf_enpc_mapping_tolerance_v1",
  selectedPlanningSurface: "docs/calculator/SLICE_STEEL_STUD_KNAUF_ENPC_MAPPING_TOLERANCE_PLAN.md",
  selectedRouteFamily: "steel_stud_knauf_enpc_mapping_tolerance_no_runtime",
  selectionStatus:
    "selected_no_runtime_knauf_enpc_steel_stud_mapping_tolerance_after_v6_rerank_found_no_runtime_ready_candidate",
  sliceId: "calculator_source_gap_revalidation_v6",
  sourceReadyRuntimePackAvailable: false,
  supportPromotion: false,
  targetFirstGateFile: "packages/engine/src/steel-stud-knauf-enpc-mapping-tolerance-gate-a-contract.test.ts",
  workbenchInputBehaviorChange: false
} as const;

const REQUIRED_PLANNING_SURFACES = [
  "packages/engine/src/calculator-source-gap-revalidation-v6-gate-a-contract.test.ts",
  "packages/engine/src/post-twin-timber-knauf-ttf302a-mapping-tolerance-v1-next-slice-selection-contract.test.ts",
  "packages/engine/src/twin-timber-knauf-ttf302a-mapping-tolerance-gate-a-contract.test.ts",
  "packages/engine/src/post-lined-masonry-knauf-mwi2a-mapping-tolerance-v1-next-slice-selection-contract.test.ts",
  "packages/engine/src/post-timber-double-board-knauf-tb5a-mapping-tolerance-v1-next-slice-selection-contract.test.ts",
  "packages/engine/src/knauf-wall-systems-source-pack-extraction-gate-a-contract.test.ts",
  "packages/engine/src/knauf-wall-systems-source-pack-extraction-gate-b-contract.test.ts",
  "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V6_PLAN.md",
  "docs/calculator/SLICE_STEEL_STUD_KNAUF_ENPC_MAPPING_TOLERANCE_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-04-30_CALCULATOR_SOURCE_GAP_REVALIDATION_V6_GATE_A_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-04-30_TWIN_TIMBER_KNAUF_TTF302A_MAPPING_TOLERANCE_GATE_C_CLOSEOUT_HANDOFF.md",
  "docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md",
  "docs/calculator/CALCULATOR_COMPREHENSIVE_ACCURACY_ROADMAP.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "AGENTS.md"
] as const;

const POST_KNAUF_MAPPING_CLOSEOUTS = [
  {
    closedSlice: "timber_double_board_knauf_tb5a_mapping_tolerance_v1",
    runtimeImportReadyNow: false,
    systemCode: "TB.5A",
    unresolvedOwner:
      "exact_stud_depth_sheetrock_one_ki75g11_field_output_policy_tolerance_owner_and_visible_tests"
  },
  {
    closedSlice: "lined_masonry_knauf_mwi2a_mapping_tolerance_v1",
    runtimeImportReadyNow: false,
    systemCode: "MWI.2A",
    unresolvedOwner:
      "substrate_mass_furring_cavity_coupling_sheetrock_mapping_field_output_policy_tolerance_owner_and_visible_tests"
  },
  {
    closedSlice: "twin_timber_knauf_ttf302a_mapping_tolerance_v1",
    runtimeImportReadyNow: false,
    systemCode: "TTF30.2A",
    unresolvedOwner:
      "twin_frame_gap_side_asymmetry_fiberock_glasswool_field_output_policy_tolerance_owner_and_visible_tests"
  }
] as const;

const REMAINING_KNAUF_ROWS = [
  {
    closeoutPosture: "selected_no_runtime_mapping_tolerance_followup",
    firstMissingRequirement:
      "wallboard_acoustic_roll_stud_gauge_equivalence_row_tolerance_owner_and_paired_visible_tests",
    metricOwner: "lab_rw_only",
    runtimeImportReadyNow: false,
    systemCode: "EN-PC-50-055-6-2-12.5-WB-25"
  },
  {
    closeoutPosture: "negative_boundary_only",
    firstMissingRequirement: "one_side_lined_timber_row_is_not_two_sided_wall_truth",
    metricOwner: "lab_rw_plus_rw_ctr_context_only",
    runtimeImportReadyNow: false,
    systemCode: "TO120.1A"
  },
  {
    closeoutPosture: "staggered_timber_adjacent_context",
    firstMissingRequirement: "staggered_stud_and_fiberock_topology_are_not_live_direct_timber_inputs",
    metricOwner: "lab_rw_plus_rw_ctr_context_only",
    runtimeImportReadyNow: false,
    systemCode: "TSF120.1A"
  },
  {
    closeoutPosture: "aac_adjacent_context",
    firstMissingRequirement: "aac_density_gap_discontinuous_frame_and_panel_mapping_are_not_generic_wall_truth",
    metricOwner: "lab_rw_plus_rw_ctr_context_only",
    runtimeImportReadyNow: false,
    systemCode: "AAC.1A"
  }
] as const;

const V6_RERANK_CANDIDATES: readonly V6Candidate[] = [
  {
    currentPosture: "concrete_knauf_uk_steel_stud_lab_rw_locator_not_runtime_import",
    docOwner: "docs/calculator/SLICE_STEEL_STUD_KNAUF_ENPC_MAPPING_TOLERANCE_PLAN.md",
    executableTestOwner: "packages/engine/src/steel-stud-knauf-enpc-mapping-tolerance-gate-a-contract.test.ts",
    firstMissingRequirement:
      "wallboard_to_local_board_mapping_acoustic_roll_mapping_stud_gauge_equivalence_row_specific_tolerance_owner_and_paired_visible_tests",
    id: "knauf_enpc_steel_stud_mapping_tolerance",
    protectedNegativeBoundaries: [
      "uk_steel_stud_rows_do_not_promote_timber_double_board_or_masonry_lining_routes",
      "enpc_row_must_not_replace_existing_knauf_lab_exact_steel_stud_anchors_by_proximity",
      "lab_rw_context_does_not_supply_field_outputs_or_spectrum_adaptation_terms"
    ],
    rank: 1,
    readiness: {
      exactLiveTopologyMappingNamed: false,
      exactSourceRowNamed: true,
      localMaterialMappingNamed: false,
      metricOwnerNamed: true,
      pairedEngineVisibleTestsNamed: false,
      pairedWebVisibleTestsNamed: false,
      protectedNegativeBoundariesNamed: true,
      runtimeImportReadyNow: false,
      sourceLocatorConcrete: true,
      toleranceOwnerNamed: false
    },
    reason:
      "enpc_is_the_highest_value_remaining_no_runtime_followup_because_it_targets_a_common_live_steel_stud_lane_with_a_concrete_knauf_uk_lab_rw_row_but_still_lacks_local_material_mapping_stud_gauge_equivalence_tolerance_and_visible_test_ownership",
    runtimeBehaviorChange: false,
    selectedNext: true,
    targetFile: "packages/engine/src/steel-stud-knauf-enpc-mapping-tolerance-gate-a-contract.test.ts",
    userVisibleRisk:
      "steel stud estimates can look source-backed from nearby Knauf anchors unless the EN-PC row is either mapped exactly or explicitly rejected",
    validationScope: [
      "targeted_enpc_steel_stud_mapping_tolerance_gate_a_contract",
      "knauf_gate_a_gate_b_context",
      "existing_steel_stud_exact_anchor_boundary_context",
      "pnpm_calculator_gate_current",
      "git_diff_check"
    ]
  },
  {
    currentPosture: "aac_adjacent_context_without_local_panel_gap_mapping",
    docOwner: "docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md",
    executableTestOwner: "packages/engine/src/knauf-wall-systems-source-pack-extraction-gate-b-contract.test.ts",
    firstMissingRequirement:
      "aac_density_panel_gap_discontinuous_steel_frame_sheetrock_mapping_metric_policy_tolerance_owner_and_visible_tests",
    id: "knauf_aac1a_aac_panel_steel_frame_mapping",
    protectedNegativeBoundaries: [
      "aac_panel_upgrade_rows_do_not_promote_generic_aac_or_masonry_routes_without_exact_panel_gap_mapping",
      "steel_frame_side_context_does_not_promote_enpc_steel_stud_or_mwi_masonry_lining_truth"
    ],
    rank: 2,
    readiness: {
      exactLiveTopologyMappingNamed: false,
      exactSourceRowNamed: false,
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
      "aac1a_has_useful_adjacent_context_but_its_panel_density_gap_and_discontinuous_frame_mapping_are_less_aligned_with_current_live_routes_than_the_enpc_steel_stud_row",
    runtimeBehaviorChange: false,
    selectedNext: false,
    targetFile: "docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md",
    userVisibleRisk:
      "AAC or masonry routes could inherit panel-plus-frame evidence that does not match their actual live topology",
    validationScope: ["knauf_gate_b_context", "source_ready_intake_backlog"]
  },
  {
    currentPosture: "staggered_timber_adjacent_context_without_live_direct_mapping",
    docOwner: "docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md",
    executableTestOwner: "packages/engine/src/knauf-wall-systems-source-pack-extraction-gate-b-contract.test.ts",
    firstMissingRequirement:
      "staggered_stud_fiberock_side_configuration_local_material_mapping_tolerance_owner_and_visible_tests",
    id: "knauf_tsf1201a_staggered_timber_mapping",
    protectedNegativeBoundaries: [
      "staggered_timber_rows_do_not_promote_direct_timber_double_board_or_ttf_twin_frame_truth",
      "fiberock_context_does_not_promote_generic_gypsum_without_material_mapping"
    ],
    rank: 3,
    readiness: {
      exactLiveTopologyMappingNamed: false,
      exactSourceRowNamed: false,
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
      "tsf1201a_stays_below_enpc_because_staggered_timber_requires_new_live_topology_mapping_after_tb5a_and_ttf302a_already_closed_as_context_only",
    runtimeBehaviorChange: false,
    selectedNext: false,
    targetFile: "docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md",
    userVisibleRisk:
      "timber routes could overstate accuracy if staggered or twin-frame source context is treated as direct-stud truth",
    validationScope: ["knauf_gate_b_context", "timber_mapping_closeout_context"]
  },
  {
    currentPosture: "formula_source_gated_metric_policy_blocked",
    docOwner: "docs/calculator/SLICE_CLT_MASS_TIMBER_WALL_SOURCE_PACK_EXTRACTION_PLAN.md",
    executableTestOwner: "packages/engine/src/clt-mass-timber-wall-source-pack-extraction-gate-b-contract.test.ts",
    firstMissingRequirement:
      "stc_fstc_astc_iic_to_dyn_echo_metric_policy_or_rejection_plus_wall_tolerance_owner",
    id: "clt_mass_timber_metric_policy_tolerance",
    protectedNegativeBoundaries: [
      "iic_is_not_wall_airborne_truth",
      "dataholz_clt_floor_rw_remains_floor_only",
      "woodworks_database_context_is_not_import_without_exact_wall_row_mapping"
    ],
    rank: 4,
    readiness: {
      exactLiveTopologyMappingNamed: false,
      exactSourceRowNamed: false,
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
      "mass_timber_remains_important_but_the_recent_extraction_chain_left_metric_conversion_and_formula_tolerance_ownership_unresolved",
    runtimeBehaviorChange: false,
    selectedNext: false,
    targetFile: "packages/engine/src/clt-mass-timber-wall-source-pack-extraction-gate-b-contract.test.ts",
    userVisibleRisk:
      "CLT wall estimates can be overstated if STC ASTC IIC or floor rows are treated as direct Rw wall truth",
    validationScope: ["clt_mass_timber_gate_b_contract", "clt_visible_estimate_web_context"]
  },
  {
    currentPosture: "generated_low_confidence_screening",
    docOwner: "docs/calculator/SLICE_GENERATED_FLOOR_FALLBACK_TOPOLOGY_DELTA_V1_PLAN.md",
    executableTestOwner: "packages/engine/src/generated-floor-fallback-topology-delta-gate-a-contract.test.ts",
    firstMissingRequirement:
      "exact_live_floor_topology_match_or_bounded_family_rule_with_metric_tolerance_and_visible_test_owners",
    id: "generated_floor_fallback_pliteq_ubiq_topology",
    protectedNegativeBoundaries: [
      "pliteq_exact_rows_apply_only_to_exact_source_topology",
      "ubiq_fl32_bound_precedence_stays_source_topology_gated",
      "generated_split_variants_remain_low_confidence"
    ],
    rank: 5,
    readiness: {
      exactLiveTopologyMappingNamed: false,
      exactSourceRowNamed: false,
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
      "floor_fallback_has_source_reservoirs_but_the_recent_topology_delta_slice_found_near_misses_only_and_no_runtime_ready_floor_rule",
    runtimeBehaviorChange: false,
    selectedNext: false,
    targetFile: "packages/engine/src/generated-floor-fallback-topology-delta-gate-a-contract.test.ts",
    userVisibleRisk:
      "generated floors can overstate accuracy if exact or bound source precedence is inherited by proximity",
    validationScope: ["generated_floor_topology_delta_context", "floor_many_layer_and_order_edge_context"]
  },
  {
    currentPosture: "closed_blockers_must_stay_fail_closed_without_new_evidence",
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
      exactLiveTopologyMappingNamed: false,
      exactSourceRowNamed: false,
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
      exactLiveTopologyMappingNamed: false,
      exactSourceRowNamed: false,
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
  }
] as const;

const SELECTED_ENPC_NEXT_SLICE_SCOPE = {
  firstGate: "gate_a_map_knauf_enpc_steel_stud_topology_materials_tolerance_without_runtime_import",
  requiredArtifacts: [
    "enpc_exact_source_row_and_live_steel_stud_anchor_comparison",
    "wallboard_to_local_board_mapping_or_rejection",
    "acoustic_roll_to_local_insulation_mapping_or_rejection",
    "stud_gauge_and_centres_equivalence_or_rejection",
    "lab_rw_field_output_policy_and_spectrum_term_rejection",
    "row_specific_tolerance_owner_or_explicit_tolerance_gap",
    "negative_boundaries_for_timber_masonry_aac_existing_steel_anchors_and_field_outputs",
    "paired_engine_and_web_visible_test_plan_if_later_runtime_or_copy_moves"
  ],
  runtimeBehaviorChange: false,
  selectedPlanningSurface: "docs/calculator/SLICE_STEEL_STUD_KNAUF_ENPC_MAPPING_TOLERANCE_PLAN.md",
  targetFirstGateFile: "packages/engine/src/steel-stud-knauf-enpc-mapping-tolerance-gate-a-contract.test.ts"
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

describe("calculator source-gap revalidation v6 Gate A contract", () => {
  it("lands v6 Gate A without runtime or visible-surface movement", () => {
    expect(CALCULATOR_SOURCE_GAP_REVALIDATION_V6_GATE_A).toEqual({
      apiShapeChange: false,
      confidencePromotion: false,
      evidencePromotion: false,
      landedGate: "gate_a_revalidate_source_accuracy_gap_order_after_knauf_mapping_chain_closeout",
      latestClosedSlice: "twin_timber_knauf_ttf302a_mapping_tolerance_v1",
      numericRuntimeBehaviorChange: false,
      outputCardStatusChange: false,
      outputSupportChange: false,
      proposalReportCopyChange: false,
      routeCardValueChange: false,
      runtimeImportSelectedNow: false,
      runtimeTightening: false,
      runtimeWidening: false,
      selectedImplementationSlice: "steel_stud_knauf_enpc_mapping_tolerance_v1",
      selectedPlanningSurface: "docs/calculator/SLICE_STEEL_STUD_KNAUF_ENPC_MAPPING_TOLERANCE_PLAN.md",
      selectedRouteFamily: "steel_stud_knauf_enpc_mapping_tolerance_no_runtime",
      selectionStatus:
        "selected_no_runtime_knauf_enpc_steel_stud_mapping_tolerance_after_v6_rerank_found_no_runtime_ready_candidate",
      sliceId: "calculator_source_gap_revalidation_v6",
      sourceReadyRuntimePackAvailable: false,
      supportPromotion: false,
      targetFirstGateFile: "packages/engine/src/steel-stud-knauf-enpc-mapping-tolerance-gate-a-contract.test.ts",
      workbenchInputBehaviorChange: false
    });

    for (const path of REQUIRED_PLANNING_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("keeps the closed Knauf mapping chain out of runtime import", () => {
    expect(POST_KNAUF_MAPPING_CLOSEOUTS.map((row) => row.systemCode)).toEqual([
      "TB.5A",
      "MWI.2A",
      "TTF30.2A"
    ]);
    expect(POST_KNAUF_MAPPING_CLOSEOUTS.every((row) => row.runtimeImportReadyNow === false)).toBe(true);
    expect(POST_KNAUF_MAPPING_CLOSEOUTS.every((row) => row.unresolvedOwner.length > 70)).toBe(true);
  });

  it("keeps remaining Knauf rows blocked from runtime import while selecting EN-PC for no-runtime mapping", () => {
    expect(REMAINING_KNAUF_ROWS.map((row) => row.systemCode)).toEqual([
      "EN-PC-50-055-6-2-12.5-WB-25",
      "TO120.1A",
      "TSF120.1A",
      "AAC.1A"
    ]);
    expect(REMAINING_KNAUF_ROWS.every((row) => row.runtimeImportReadyNow === false)).toBe(true);
    expect(REMAINING_KNAUF_ROWS.find((row) => row.systemCode === "EN-PC-50-055-6-2-12.5-WB-25")).toMatchObject({
      closeoutPosture: "selected_no_runtime_mapping_tolerance_followup",
      metricOwner: "lab_rw_only"
    });
  });

  it("reranks source and accuracy candidates with no runtime-ready pack", () => {
    expect(V6_RERANK_CANDIDATES.map((candidate) => candidate.id)).toEqual([
      "knauf_enpc_steel_stud_mapping_tolerance",
      "knauf_aac1a_aac_panel_steel_frame_mapping",
      "knauf_tsf1201a_staggered_timber_mapping",
      "clt_mass_timber_metric_policy_tolerance",
      "generated_floor_fallback_pliteq_ubiq_topology",
      "historical_blocked_family_reopen",
      "internal_use_pilot_defect_or_promotion"
    ]);
    expect(V6_RERANK_CANDIDATES.map((candidate) => candidate.rank)).toEqual([1, 2, 3, 4, 5, 6, 7]);
    expect(new Set(V6_RERANK_CANDIDATES.map((candidate) => candidate.id)).size).toBe(
      V6_RERANK_CANDIDATES.length
    );
    expect(V6_RERANK_CANDIDATES.every((candidate) => candidate.runtimeBehaviorChange === false)).toBe(true);
    expect(V6_RERANK_CANDIDATES.every((candidate) => candidate.readiness.runtimeImportReadyNow === false)).toBe(
      true
    );
    expect(V6_RERANK_CANDIDATES.some((candidate) => candidate.readiness.exactSourceRowNamed)).toBe(true);
    expect(V6_RERANK_CANDIDATES.every((candidate) => candidate.firstMissingRequirement.length > 60)).toBe(true);
  });

  it("selects Knauf EN-PC only as a no-runtime steel-stud mapping and tolerance slice", () => {
    expect(V6_RERANK_CANDIDATES.filter((candidate) => candidate.selectedNext)).toEqual([
      expect.objectContaining({
        id: "knauf_enpc_steel_stud_mapping_tolerance",
        rank: 1,
        readiness: expect.objectContaining({
          exactLiveTopologyMappingNamed: false,
          exactSourceRowNamed: true,
          localMaterialMappingNamed: false,
          metricOwnerNamed: true,
          pairedEngineVisibleTestsNamed: false,
          pairedWebVisibleTestsNamed: false,
          runtimeImportReadyNow: false,
          sourceLocatorConcrete: true,
          toleranceOwnerNamed: false
        }),
        selectedNext: true,
        targetFile: "packages/engine/src/steel-stud-knauf-enpc-mapping-tolerance-gate-a-contract.test.ts"
      })
    ]);
  });

  it("defines the next EN-PC Gate A scope before any import or visible movement", () => {
    expect(SELECTED_ENPC_NEXT_SLICE_SCOPE).toEqual({
      firstGate: "gate_a_map_knauf_enpc_steel_stud_topology_materials_tolerance_without_runtime_import",
      requiredArtifacts: [
        "enpc_exact_source_row_and_live_steel_stud_anchor_comparison",
        "wallboard_to_local_board_mapping_or_rejection",
        "acoustic_roll_to_local_insulation_mapping_or_rejection",
        "stud_gauge_and_centres_equivalence_or_rejection",
        "lab_rw_field_output_policy_and_spectrum_term_rejection",
        "row_specific_tolerance_owner_or_explicit_tolerance_gap",
        "negative_boundaries_for_timber_masonry_aac_existing_steel_anchors_and_field_outputs",
        "paired_engine_and_web_visible_test_plan_if_later_runtime_or_copy_moves"
      ],
      runtimeBehaviorChange: false,
      selectedPlanningSurface: "docs/calculator/SLICE_STEEL_STUD_KNAUF_ENPC_MAPPING_TOLERANCE_PLAN.md",
      targetFirstGateFile: "packages/engine/src/steel-stud-knauf-enpc-mapping-tolerance-gate-a-contract.test.ts"
    });
  });

  it("keeps active docs aligned on the selected EN-PC next slice", () => {
    const docs = [
      readRepoFile("AGENTS.md"),
      readRepoFile("docs/calculator/NEXT_IMPLEMENTATION_PLAN.md"),
      readRepoFile("docs/calculator/CURRENT_STATE.md"),
      readRepoFile("docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V6_PLAN.md"),
      readRepoFile(CALCULATOR_SOURCE_GAP_REVALIDATION_V6_GATE_A.selectedPlanningSurface),
      readRepoFile("docs/calculator/CHECKPOINT_2026-04-30_CALCULATOR_SOURCE_GAP_REVALIDATION_V6_GATE_A_HANDOFF.md")
    ];

    for (const doc of docs) {
      expect(doc).toContain(CALCULATOR_SOURCE_GAP_REVALIDATION_V6_GATE_A.selectedImplementationSlice);
      expect(doc).toContain(CALCULATOR_SOURCE_GAP_REVALIDATION_V6_GATE_A.targetFirstGateFile);
      expect(doc).toContain(CALCULATOR_SOURCE_GAP_REVALIDATION_V6_GATE_A.selectionStatus);
      expect(doc).toContain("EN-PC-50-055-6-2-12.5-WB-25");
      expect(doc).toContain("no-runtime");
    }
  });

  it("keeps frozen surfaces and validation expectations explicit", () => {
    const joinedDocs = [
      readRepoFile("docs/calculator/CHECKPOINT_2026-04-30_CALCULATOR_SOURCE_GAP_REVALIDATION_V6_GATE_A_HANDOFF.md"),
      readRepoFile("docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V6_PLAN.md"),
      readRepoFile("docs/calculator/SLICE_STEEL_STUD_KNAUF_ENPC_MAPPING_TOLERANCE_PLAN.md")
    ].join("\n");

    for (const surface of FROZEN_SURFACES) {
      expect(joinedDocs, surface).toContain(surface);
    }

    expect(joinedDocs).toContain("pnpm --filter @dynecho/engine exec vitest run src/calculator-source-gap-revalidation-v6-gate-a-contract.test.ts --maxWorkers=1");
    expect(joinedDocs).toContain("pnpm calculator:gate:current");
    expect(joinedDocs).toContain("git diff --check");
  });
});
