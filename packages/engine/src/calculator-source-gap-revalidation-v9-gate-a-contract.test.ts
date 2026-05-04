import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

type RuntimeReadiness = {
  exactLiveTopologyMappingNamed: boolean;
  exactSourceRowsNamed: boolean;
  externalSourcePacketAvailable: boolean;
  localMaterialMappingNamed: boolean;
  metricOwnerNamed: boolean;
  pairedEngineVisibleTestsNamed: boolean;
  pairedWebVisibleTestsNamed: boolean;
  protectedNegativeBoundariesNamed: boolean;
  runtimeImportReadyNow: false;
  sourceLocatorConcrete: boolean;
  toleranceOwnerNamed: boolean;
};

type V9Candidate = {
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

const CALCULATOR_SOURCE_GAP_REVALIDATION_V9_GATE_A = {
  apiShapeChange: false,
  confidencePromotion: false,
  evidencePromotion: false,
  landedGate: "gate_a_revalidate_source_accuracy_gap_order_after_british_gypsum_source_pack_closeout",
  latestClosedSlice: "british_gypsum_white_book_source_pack_extraction_v1",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: false,
  outputSupportChange: false,
  proposalReportCopyChange: false,
  routeCardValueChange: false,
  runtimeImportSelectedNow: false,
  runtimeTightening: false,
  runtimeWidening: false,
  selectedImplementationSlice: "calculator_post_british_gypsum_source_acquisition_v1",
  selectedPlanningSurface: "docs/calculator/SLICE_CALCULATOR_POST_BRITISH_GYPSUM_SOURCE_ACQUISITION_V1_PLAN.md",
  selectedRouteFamily: "post_british_gypsum_source_locator_acquisition_no_runtime",
  selectionStatus:
    "selected_post_british_gypsum_source_acquisition_v1_after_v9_rerank_found_no_runtime_ready_candidate_and_british_gypsum_closed_no_runtime",
  sliceId: "calculator_source_gap_revalidation_v9",
  sourceReadyRuntimePackAvailable: false,
  supportPromotion: false,
  targetFirstGateFile: "packages/engine/src/calculator-post-british-gypsum-source-acquisition-gate-a-contract.test.ts",
  workbenchInputBehaviorChange: false
} as const;

const REQUIRED_PLANNING_SURFACES = [
  "packages/engine/src/calculator-source-gap-revalidation-v9-gate-a-contract.test.ts",
  "packages/engine/src/post-british-gypsum-white-book-source-pack-extraction-v1-next-slice-selection-contract.test.ts",
  "packages/engine/src/british-gypsum-white-book-source-pack-extraction-gate-b-contract.test.ts",
  "packages/engine/src/calculator-source-gap-revalidation-v8-gate-a-contract.test.ts",
  "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V9_PLAN.md",
  "docs/calculator/SLICE_CALCULATOR_POST_BRITISH_GYPSUM_SOURCE_ACQUISITION_V1_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-02_CALCULATOR_SOURCE_GAP_REVALIDATION_V9_GATE_A_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-05-02_BRITISH_GYPSUM_WHITE_BOOK_SOURCE_PACK_EXTRACTION_GATE_C_CLOSEOUT_HANDOFF.md",
  "docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md",
  "docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md",
  "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "AGENTS.md"
] as const;

const BRITISH_GYPSUM_CLOSED_ROWS = [
  {
    closedReason:
      "floor_only_context_lacks_sif_channel_timber_joist_rb1_ceiling_metric_policy_tolerance_owner_and_visible_tests",
    id: "C204006",
    runtimeImportReadyNow: false
  },
  {
    closedReason:
      "floor_only_context_cannot_substitute_for_c204006_or_generic_generated_floor_truth_without_exact_topology_and_tolerance",
    id: "C204003",
    runtimeImportReadyNow: false
  },
  {
    closedReason:
      "adjacent_lsf_context_must_not_override_existing_knauf_lsf_exact_anchor_without_precedence_and_material_tests",
    id: "A206A290",
    runtimeImportReadyNow: false
  },
  {
    closedReason: "already_landed_exact_timber_anchor_no_duplicate_import_or_direct_timber_promotion",
    id: "A046006",
    runtimeImportReadyNow: false
  },
  {
    closedReason:
      "twin_frame_audio_context_lacks_live_grouped_topology_mapping_material_tolerance_and_visible_tests",
    id: "A326017B",
    runtimeImportReadyNow: false
  },
  {
    closedReason:
      "lined_brick_context_cannot_promote_generic_lined_concrete_mwi2a_or_heavy_core_screening",
    id: "B226010",
    runtimeImportReadyNow: false
  }
] as const;

const PAUSED_TRIPLE_LEAF_SOURCE_LANE = {
  currentScreeningAnswer: "multileaf_screening_blend_rw_41_low_confidence",
  missingPacketArtifacts: [
    "authorized_source_file_or_tdm_payload",
    "rights_and_storage_note",
    "source_identity_metadata",
    "page_figure_table_locator",
    "curve_identity_map",
    "band_vector_or_digitization_payload",
    "rating_derivation_and_uncertainty",
    "chain_of_custody_review"
  ],
  runtimeImportReadyNow: false,
  sourceLaneDisposition: "paused_waiting_rights_safe_source_packet"
} as const;

const V9_RERANK_CANDIDATES: readonly V9Candidate[] = [
  {
    currentPosture: "current_source_reservoir_exhausted_after_british_gypsum_closeout",
    docOwner: "docs/calculator/SLICE_CALCULATOR_POST_BRITISH_GYPSUM_SOURCE_ACQUISITION_V1_PLAN.md",
    executableTestOwner: "packages/engine/src/calculator-post-british-gypsum-source-acquisition-gate-a-contract.test.ts",
    firstMissingRequirement:
      "fresh_official_source_locators_or_rights_safe_source_packets_with_exact_topology_metric_tolerance_material_negative_boundary_and_visible_test_ownership",
    id: "calculator_post_british_gypsum_source_acquisition",
    protectedNegativeBoundaries: [
      "closed_british_gypsum_rows_remain_context_only_until_exact_runtime_prerequisites_are_named",
      "paused_uris_2006_lane_does_not_promote_rw_41_screening_without_rights_safe_packet",
      "closed_knauf_rows_and_historical_blockers_do_not_reopen_from_green_tests_alone"
    ],
    rank: 1,
    readiness: {
      exactLiveTopologyMappingNamed: false,
      exactSourceRowsNamed: false,
      externalSourcePacketAvailable: false,
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
      "british_gypsum_gate_b_and_gate_c_closed_no_runtime_the_uris_2006_lane_is_paused_for_packet_access_and_the_recent_knauf_and_non_knauf_candidates_remain_blocked_so_the_next_accuracy_step_is_new_official_source_locator_acquisition_not_value_movement",
    runtimeBehaviorChange: false,
    selectedNext: true,
    targetFile: "packages/engine/src/calculator-post-british-gypsum-source-acquisition-gate-a-contract.test.ts",
    userVisibleRisk:
      "without_new_source_acquisition_the_project_can_keep_reranking_exhausted_rows_instead_of_improving_wall_floor_accuracy_or_coverage",
    validationScope: [
      "post_british_gypsum_source_acquisition_gate_a_contract",
      "source_ready_intake_backlog_refresh",
      "route_source_risk_register_refresh",
      "pnpm_calculator_gate_current",
      "git_diff_check"
    ]
  },
  {
    currentPosture: "paused_waiting_rights_safe_source_packet_after_gate_t",
    docOwner: "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md",
    executableTestOwner: "packages/engine/src/wall-triple-leaf-manual-source-packet-handoff-gate-t.test.ts",
    firstMissingRequirement:
      "rights_safe_uris_2006_source_packet_with_page_locators_curve_identity_band_vectors_rating_derivation_uncertainty_and_chain_of_custody",
    id: "wall_triple_leaf_uris_2006_source_packet_lane",
    protectedNegativeBoundaries: [
      "rw_41_split_rockwool_screening_result_must_not_be_presented_as_fixed_or_source_validated",
      "nrc_2024_graph_packet_remains_adjacent_comparator_not_primary_uris_source_packet",
      "user_repro_pdfs_and_public_summaries_do_not_promote_runtime_evidence"
    ],
    rank: 2,
    readiness: {
      exactLiveTopologyMappingNamed: true,
      exactSourceRowsNamed: false,
      externalSourcePacketAvailable: false,
      localMaterialMappingNamed: false,
      metricOwnerNamed: false,
      pairedEngineVisibleTestsNamed: true,
      pairedWebVisibleTestsNamed: true,
      protectedNegativeBoundariesNamed: true,
      runtimeImportReadyNow: false,
      sourceLocatorConcrete: true,
      toleranceOwnerNamed: false
    },
    reason:
      "the_original_user_defect_is_real_but_gate_t_left_the_primary_source_packet_absent_so_it_must_stay_paused_while_another_acquisition_pass_searches_for_rights_safe_sources",
    runtimeBehaviorChange: false,
    selectedNext: false,
    targetFile: "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md",
    userVisibleRisk:
      "reopening_the_lane_without_the_packet_would_reintroduce_the_original_rockwool_reorder_false_precision_problem",
    validationScope: ["gate_t_handoff_context", "gate_j_visible_acceptance_context"]
  },
  {
    currentPosture: "british_gypsum_rows_closed_no_runtime_after_gate_b_and_gate_c",
    docOwner: "docs/calculator/SLICE_BRITISH_GYPSUM_WHITE_BOOK_SOURCE_PACK_EXTRACTION_PLAN.md",
    executableTestOwner: "packages/engine/src/british-gypsum-white-book-source-pack-extraction-gate-b-contract.test.ts",
    firstMissingRequirement:
      "new_mapping_tolerance_metric_owner_or_exact_visible_tests_not_already_rejected_by_british_gypsum_gate_b",
    id: "closed_british_gypsum_rows_reopen",
    protectedNegativeBoundaries: [
      "c204006_and_c204003_remain_floor_only_context",
      "a206a290_does_not_override_existing_knauf_lsf_anchor",
      "a046006_remains_existing_exact_anchor_without_duplicate_import",
      "a326017b_and_b226010_remain_context_only"
    ],
    rank: 3,
    readiness: {
      exactLiveTopologyMappingNamed: false,
      exactSourceRowsNamed: true,
      externalSourcePacketAvailable: true,
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
      "gate_b_already_compared_each_white_book_row_against_live_routes_and_found_no_new_import_ready_row_so reopening_them_now_would_duplicate_a_closed_decision",
    runtimeBehaviorChange: false,
    selectedNext: false,
    targetFile: "packages/engine/src/british-gypsum-white-book-source-pack-extraction-gate-b-contract.test.ts",
    userVisibleRisk:
      "official_white_book_rows_can_look_authoritative_even_when_floor_wall_boundary_metric_and_tolerance_owners_are_missing",
    validationScope: ["british_gypsum_gate_b_context", "british_gypsum_gate_c_closeout_context"]
  },
  {
    currentPosture: "concrete_knauf_mapping_chain_closed_no_runtime",
    docOwner: "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V7_PLAN.md",
    executableTestOwner: "packages/engine/src/calculator-source-gap-revalidation-v7-gate-a-contract.test.ts",
    firstMissingRequirement:
      "new_exact_knauf_or_equivalent_row_not_already_rejected_by_tb5a_mwi2a_ttf302a_enpc_and_remaining_adjacent_boundaries",
    id: "closed_knauf_mapping_chain_reopen",
    protectedNegativeBoundaries: [
      "tb5a_mwi2a_ttf302a_and_enpc_do_not_reopen_from_green_tests_alone",
      "aac_tsf_and_to_rows_remain_adjacent_or_negative_context",
      "near_source_knauf_rows_do_not_override_existing_exact_anchors"
    ],
    rank: 4,
    readiness: {
      exactLiveTopologyMappingNamed: false,
      exactSourceRowsNamed: true,
      externalSourcePacketAvailable: true,
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
      "the_recent_knauf_chain_was_exhausted_before_british_gypsum_and_has_no_new_source_truth_to_change_its_closeout",
    runtimeBehaviorChange: false,
    selectedNext: false,
    targetFile: "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V7_PLAN.md",
    userVisibleRisk: "closed_knauf_context_could_leak_back_into_runtime_by_proximity",
    validationScope: ["v7_closeout_context", "knauf_negative_boundaries"]
  },
  {
    currentPosture: "formula_owned_mass_timber_and_floor_fallback_context_still_metric_or_topology_blocked",
    docOwner: "docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md",
    executableTestOwner: "packages/engine/src/calculator-source-pack-readiness-triage-gate-a-contract.test.ts",
    firstMissingRequirement:
      "new_exact_wall_or_floor_source_rows_plus_metric_policy_tolerance_material_mapping_and_visible_tests",
    id: "clt_mass_timber_generated_floor_and_lined_heavy_followups",
    protectedNegativeBoundaries: [
      "dataholz_clt_floor_rows_remain_floor_only",
      "pliteq_ubiq_floor_rows_require_exact_or_bounded_topology_match",
      "floor_only_or_ceiling_lining_rows_do_not_become_wall_truth"
    ],
    rank: 5,
    readiness: {
      exactLiveTopologyMappingNamed: false,
      exactSourceRowsNamed: false,
      externalSourcePacketAvailable: true,
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
      "these_families_remain_high_value_but_prior_source_intake_found_near_misses_or_metric_gaps_only_so_new_acquisition_should_precede_another_runtime_attempt",
    runtimeBehaviorChange: false,
    selectedNext: false,
    targetFile: "docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md",
    userVisibleRisk:
      "formula_owned_or_near_miss_families_can_look_source_backed_before_exact_metric_and_topology_requirements_are_met",
    validationScope: ["source_ready_intake_backlog", "clt_and_floor_negative_boundaries"]
  },
  {
    currentPosture: "historical_blockers_and_productization_do_not_raise_accuracy",
    docOwner: "docs/calculator/SOURCE_GAP_LEDGER.md",
    executableTestOwner: "packages/engine/src/blocked-source-backed-widening-rerank-refresh-contract.test.ts",
    firstMissingRequirement:
      "new_evidence_that_directly_satisfies_each_family_original_blocker_or_a_concrete_operator_defect",
    id: "historical_blocked_or_productization_only_work",
    protectedNegativeBoundaries: [
      "old_exact_or_raw_routes_do_not_reopen_from_unrelated_nearby_evidence",
      "pilot_handoff_does_not_promote_source_gated_families",
      "productization_does_not_improve_calculator_accuracy_or_source_readiness"
    ],
    rank: 6,
    readiness: {
      exactLiveTopologyMappingNamed: false,
      exactSourceRowsNamed: false,
      externalSourcePacketAvailable: true,
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
      "historical_blockers_and_productization_only_work_should_stay_below_accuracy_source_acquisition_when_the_user_priority_is_calculator_correctness_and_coverage",
    runtimeBehaviorChange: false,
    selectedNext: false,
    targetFile: "docs/calculator/SOURCE_GAP_LEDGER.md",
    userVisibleRisk:
      "workflow_polish_or_old_green_tests_could_be_mistaken_for_broad_high_confidence_coverage",
    validationScope: ["blocked_source_rank_contracts", "internal_use_acceptance_rehearsal"]
  }
] as const;

const SELECTED_POST_BRITISH_GYPSUM_SOURCE_ACQUISITION_SCOPE = {
  firstGate: "gate_a_acquire_and_classify_post_british_gypsum_source_locators_without_runtime_import",
  requiredArtifacts: [
    "official_source_locator_matrix_after_british_gypsum_knauf_and_uris_lane_closeouts",
    "rights_safe_source_packet_or_url_locator_policy_for_rockwool_triple_leaf_and_other_high_value_families",
    "candidate_eligibility_rules_for_exact_topology_metric_tolerance_material_and_visible_test_ownership",
    "per_family_source_search_targets_for_clt_mass_timber_generated_floor_no_stud_lined_heavy_and_double_board_walls",
    "explicit_rejection_rules_for_closed_british_gypsum_knauf_and_historical_blockers",
    "selected_next_extraction_or_mapping_slice_only_if_a_concrete_locator_becomes_ready",
    "validation_scope_with_targeted_contract_current_gate_and_git_diff_check"
  ],
  runtimeBehaviorChange: false,
  selectedPlanningSurface: "docs/calculator/SLICE_CALCULATOR_POST_BRITISH_GYPSUM_SOURCE_ACQUISITION_V1_PLAN.md",
  targetFirstGateFile: "packages/engine/src/calculator-post-british-gypsum-source-acquisition-gate-a-contract.test.ts"
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

describe("calculator source-gap revalidation v9 Gate A contract", () => {
  it("lands v9 Gate A without runtime or visible-surface movement", () => {
    expect(CALCULATOR_SOURCE_GAP_REVALIDATION_V9_GATE_A).toEqual({
      apiShapeChange: false,
      confidencePromotion: false,
      evidencePromotion: false,
      landedGate: "gate_a_revalidate_source_accuracy_gap_order_after_british_gypsum_source_pack_closeout",
      latestClosedSlice: "british_gypsum_white_book_source_pack_extraction_v1",
      numericRuntimeBehaviorChange: false,
      outputCardStatusChange: false,
      outputSupportChange: false,
      proposalReportCopyChange: false,
      routeCardValueChange: false,
      runtimeImportSelectedNow: false,
      runtimeTightening: false,
      runtimeWidening: false,
      selectedImplementationSlice: "calculator_post_british_gypsum_source_acquisition_v1",
      selectedPlanningSurface: "docs/calculator/SLICE_CALCULATOR_POST_BRITISH_GYPSUM_SOURCE_ACQUISITION_V1_PLAN.md",
      selectedRouteFamily: "post_british_gypsum_source_locator_acquisition_no_runtime",
      selectionStatus:
        "selected_post_british_gypsum_source_acquisition_v1_after_v9_rerank_found_no_runtime_ready_candidate_and_british_gypsum_closed_no_runtime",
      sliceId: "calculator_source_gap_revalidation_v9",
      sourceReadyRuntimePackAvailable: false,
      supportPromotion: false,
      targetFirstGateFile: "packages/engine/src/calculator-post-british-gypsum-source-acquisition-gate-a-contract.test.ts",
      workbenchInputBehaviorChange: false
    });

    for (const path of REQUIRED_PLANNING_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("keeps the closed British Gypsum rows out of new runtime import", () => {
    expect(BRITISH_GYPSUM_CLOSED_ROWS.map((row) => row.id)).toEqual([
      "C204006",
      "C204003",
      "A206A290",
      "A046006",
      "A326017B",
      "B226010"
    ]);
    expect(BRITISH_GYPSUM_CLOSED_ROWS.every((row) => row.runtimeImportReadyNow === false)).toBe(true);
    expect(BRITISH_GYPSUM_CLOSED_ROWS.find((row) => row.id === "A046006")).toMatchObject({
      closedReason: "already_landed_exact_timber_anchor_no_duplicate_import_or_direct_timber_promotion"
    });
  });

  it("keeps the Uris 2006 rockwool lane paused instead of calling Rw 41 fixed", () => {
    expect(PAUSED_TRIPLE_LEAF_SOURCE_LANE.sourceLaneDisposition).toBe("paused_waiting_rights_safe_source_packet");
    expect(PAUSED_TRIPLE_LEAF_SOURCE_LANE.currentScreeningAnswer).toBe(
      "multileaf_screening_blend_rw_41_low_confidence"
    );
    expect(PAUSED_TRIPLE_LEAF_SOURCE_LANE.runtimeImportReadyNow).toBe(false);
    expect(PAUSED_TRIPLE_LEAF_SOURCE_LANE.missingPacketArtifacts).toContain("authorized_source_file_or_tdm_payload");
    expect(PAUSED_TRIPLE_LEAF_SOURCE_LANE.missingPacketArtifacts).toContain("band_vector_or_digitization_payload");
  });

  it("reranks the backlog after British Gypsum, Knauf, and Uris blockers are all explicit", () => {
    expect(V9_RERANK_CANDIDATES.map((candidate) => candidate.id)).toEqual([
      "calculator_post_british_gypsum_source_acquisition",
      "wall_triple_leaf_uris_2006_source_packet_lane",
      "closed_british_gypsum_rows_reopen",
      "closed_knauf_mapping_chain_reopen",
      "clt_mass_timber_generated_floor_and_lined_heavy_followups",
      "historical_blocked_or_productization_only_work"
    ]);
    expect(V9_RERANK_CANDIDATES.map((candidate) => candidate.rank)).toEqual([1, 2, 3, 4, 5, 6]);
    expect(new Set(V9_RERANK_CANDIDATES.map((candidate) => candidate.id)).size).toBe(
      V9_RERANK_CANDIDATES.length
    );
    expect(V9_RERANK_CANDIDATES.every((candidate) => candidate.runtimeBehaviorChange === false)).toBe(true);
    expect(V9_RERANK_CANDIDATES.every((candidate) => candidate.readiness.runtimeImportReadyNow === false)).toBe(
      true
    );
    expect(
      V9_RERANK_CANDIDATES.every((candidate) => candidate.readiness.protectedNegativeBoundariesNamed)
    ).toBe(true);
    expect(V9_RERANK_CANDIDATES.every((candidate) => candidate.firstMissingRequirement.length > 75)).toBe(true);
  });

  it("selects post-British-Gypsum source acquisition as the next no-runtime accuracy step", () => {
    expect(V9_RERANK_CANDIDATES.filter((candidate) => candidate.selectedNext)).toEqual([
      expect.objectContaining({
        id: "calculator_post_british_gypsum_source_acquisition",
        rank: 1,
        readiness: expect.objectContaining({
          exactLiveTopologyMappingNamed: false,
          exactSourceRowsNamed: false,
          externalSourcePacketAvailable: false,
          localMaterialMappingNamed: false,
          metricOwnerNamed: false,
          pairedEngineVisibleTestsNamed: false,
          pairedWebVisibleTestsNamed: false,
          runtimeImportReadyNow: false,
          sourceLocatorConcrete: false,
          toleranceOwnerNamed: false
        }),
        selectedNext: true,
        targetFile: "packages/engine/src/calculator-post-british-gypsum-source-acquisition-gate-a-contract.test.ts"
      })
    ]);
  });

  it("defines the selected post-British-Gypsum source-acquisition scope without importing rows", () => {
    expect(SELECTED_POST_BRITISH_GYPSUM_SOURCE_ACQUISITION_SCOPE).toEqual({
      firstGate: "gate_a_acquire_and_classify_post_british_gypsum_source_locators_without_runtime_import",
      requiredArtifacts: [
        "official_source_locator_matrix_after_british_gypsum_knauf_and_uris_lane_closeouts",
        "rights_safe_source_packet_or_url_locator_policy_for_rockwool_triple_leaf_and_other_high_value_families",
        "candidate_eligibility_rules_for_exact_topology_metric_tolerance_material_and_visible_test_ownership",
        "per_family_source_search_targets_for_clt_mass_timber_generated_floor_no_stud_lined_heavy_and_double_board_walls",
        "explicit_rejection_rules_for_closed_british_gypsum_knauf_and_historical_blockers",
        "selected_next_extraction_or_mapping_slice_only_if_a_concrete_locator_becomes_ready",
        "validation_scope_with_targeted_contract_current_gate_and_git_diff_check"
      ],
      runtimeBehaviorChange: false,
      selectedPlanningSurface: "docs/calculator/SLICE_CALCULATOR_POST_BRITISH_GYPSUM_SOURCE_ACQUISITION_V1_PLAN.md",
      targetFirstGateFile: "packages/engine/src/calculator-post-british-gypsum-source-acquisition-gate-a-contract.test.ts"
    });
  });

  it("keeps active docs aligned on the selected post-British-Gypsum source acquisition", () => {
    const docs = [
      readRepoFile("AGENTS.md"),
      readRepoFile("docs/calculator/NEXT_IMPLEMENTATION_PLAN.md"),
      readRepoFile("docs/calculator/CURRENT_STATE.md"),
      readRepoFile("docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V9_PLAN.md"),
      readRepoFile(CALCULATOR_SOURCE_GAP_REVALIDATION_V9_GATE_A.selectedPlanningSurface),
      readRepoFile("docs/calculator/CHECKPOINT_2026-05-02_CALCULATOR_SOURCE_GAP_REVALIDATION_V9_GATE_A_HANDOFF.md"),
      readRepoFile("docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md"),
      readRepoFile("docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md"),
      readRepoFile("docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md")
    ];

    for (const doc of docs) {
      expect(doc).toContain(CALCULATOR_SOURCE_GAP_REVALIDATION_V9_GATE_A.selectedImplementationSlice);
      expect(doc).toContain(CALCULATOR_SOURCE_GAP_REVALIDATION_V9_GATE_A.targetFirstGateFile);
      expect(doc).toContain(CALCULATOR_SOURCE_GAP_REVALIDATION_V9_GATE_A.selectionStatus);
      expect(doc).toContain("paused_waiting_rights_safe_source_packet");
      expect(doc).toContain("gate_a_acquire_and_classify_post_british_gypsum_source_locators_without_runtime_import");
    }
  });

  it("keeps frozen surfaces and validation expectations explicit", () => {
    const joinedDocs = [
      readRepoFile("docs/calculator/CHECKPOINT_2026-05-02_CALCULATOR_SOURCE_GAP_REVALIDATION_V9_GATE_A_HANDOFF.md"),
      readRepoFile("docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V9_PLAN.md"),
      readRepoFile("docs/calculator/SLICE_CALCULATOR_POST_BRITISH_GYPSUM_SOURCE_ACQUISITION_V1_PLAN.md")
    ].join("\n");

    for (const surface of FROZEN_SURFACES) {
      expect(joinedDocs, surface).toContain(surface);
    }

    expect(joinedDocs).toContain(
      "pnpm --filter @dynecho/engine exec vitest run src/calculator-source-gap-revalidation-v9-gate-a-contract.test.ts --maxWorkers=1"
    );
    expect(joinedDocs).toContain("pnpm calculator:gate:current");
    expect(joinedDocs).toContain("git diff --check");
  });
});
