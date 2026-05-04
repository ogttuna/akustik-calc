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

type V8Candidate = {
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

const CALCULATOR_SOURCE_GAP_REVALIDATION_V8_GATE_A = {
  apiShapeChange: false,
  confidencePromotion: false,
  evidencePromotion: false,
  landedGate: "gate_a_revalidate_source_accuracy_gap_order_after_triple_leaf_uris_lane_pause",
  latestClosedSlice: "wall_triple_leaf_accuracy_recovery_v1_gate_t",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: false,
  outputSupportChange: false,
  proposalReportCopyChange: false,
  routeCardValueChange: false,
  runtimeImportSelectedNow: false,
  runtimeTightening: false,
  runtimeWidening: false,
  selectedImplementationSlice: "british_gypsum_white_book_source_pack_extraction_v1",
  selectedPlanningSurface: "docs/calculator/SLICE_BRITISH_GYPSUM_WHITE_BOOK_SOURCE_PACK_EXTRACTION_PLAN.md",
  selectedRouteFamily: "british_gypsum_white_book_mapping_tolerance_no_runtime",
  selectionStatus:
    "selected_british_gypsum_gate_b_mapping_tolerance_after_v8_rerank_paused_uris_2006_lane_and_found_official_rows_waiting_mapping",
  sliceId: "calculator_source_gap_revalidation_v8",
  sourceReadyRuntimePackAvailable: false,
  supportPromotion: false,
  targetFirstGateFile: "packages/engine/src/british-gypsum-white-book-source-pack-extraction-gate-b-contract.test.ts",
  workbenchInputBehaviorChange: false
} as const;

const REQUIRED_PLANNING_SURFACES = [
  "packages/engine/src/calculator-source-gap-revalidation-v8-gate-a-contract.test.ts",
  "packages/engine/src/wall-triple-leaf-manual-source-packet-handoff-gate-t.test.ts",
  "packages/engine/src/british-gypsum-white-book-source-pack-extraction-gate-a-contract.test.ts",
  "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V8_PLAN.md",
  "docs/calculator/SLICE_BRITISH_GYPSUM_WHITE_BOOK_SOURCE_PACK_EXTRACTION_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-02_CALCULATOR_SOURCE_GAP_REVALIDATION_V8_GATE_A_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-05-02_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_T_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-04-30_BRITISH_GYPSUM_WHITE_BOOK_SOURCE_PACK_EXTRACTION_GATE_A_HANDOFF.md",
  "docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md",
  "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "AGENTS.md"
] as const;

const PAUSED_TRIPLE_LEAF_SOURCE_LANE = {
  blockedRuntimeReason: "rights_safe_source_packet_absent",
  firstBacklogItem: "uris_2006_authorized_curve_packet",
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

const BRITISH_GYPSUM_GATE_B_SCOPE = {
  alreadyRepresentedRows: ["A046006"],
  firstGate: "gate_b_mapping_tolerance_decision_no_runtime",
  rowsNeedingMappingDecision: ["C204006", "C204003", "A206A290", "A326017B", "B226010"],
  runtimeBehaviorChange: false,
  selectedPlanningSurface: "docs/calculator/SLICE_BRITISH_GYPSUM_WHITE_BOOK_SOURCE_PACK_EXTRACTION_PLAN.md",
  targetFirstGateFile: "packages/engine/src/british-gypsum-white-book-source-pack-extraction-gate-b-contract.test.ts"
} as const;

const V8_RERANK_CANDIDATES: readonly V8Candidate[] = [
  {
    currentPosture: "official_british_gypsum_rows_extracted_waiting_gate_b_mapping_tolerance_decision",
    docOwner: "docs/calculator/SLICE_BRITISH_GYPSUM_WHITE_BOOK_SOURCE_PACK_EXTRACTION_PLAN.md",
    executableTestOwner: "packages/engine/src/british-gypsum-white-book-source-pack-extraction-gate-b-contract.test.ts",
    firstMissingRequirement:
      "row_by_row_live_topology_material_metric_tolerance_negative_boundary_and_paired_visible_test_decision_for_c204006_c204003_a206a290_a326017b_and_b226010",
    id: "british_gypsum_white_book_gate_b_mapping_tolerance",
    protectedNegativeBoundaries: [
      "c204006_and_c204003_floor_rows_do_not_promote_wall_outputs_or_generic_floor_fallbacks",
      "a206a290_does_not_override_existing_knauf_lsf_anchor_without_precedence_tests",
      "a046006_is_already_landed_and_must_not_be_reimported_or_used_for_direct_timber_routes",
      "a326017b_twin_frame_audio_does_not_promote_no_stud_or_simple_timber_routes",
      "b226010_lined_brick_does_not_promote_generic_lined_concrete_or_mwi2a_masonry"
    ],
    rank: 1,
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
      "the_british_gypsum_white_book_pack_has_official_extracted_rows_covering_floor_steel_twin_frame_and_lined_masonry_gaps_and_unlike_the_paused_uris_lane_it_is_not_blocked_by_missing_source_packet_access_but_still_requires_gate_b_mapping_tolerance_and_visible_test_ownership_before_runtime",
    runtimeBehaviorChange: false,
    selectedNext: true,
    targetFile: "packages/engine/src/british-gypsum-white-book-source-pack-extraction-gate-b-contract.test.ts",
    userVisibleRisk:
      "official_white_book_rows_can_look_import_ready_unless_floor_only_wall_only_existing_anchor_and_near_source_boundaries_are_decided_row_by_row",
    validationScope: [
      "british_gypsum_gate_a_context",
      "british_gypsum_gate_b_mapping_tolerance_contract",
      "route_source_risk_register",
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
      "the_user_defect_is_real_and_visible_but_gate_t_found_the_primary_uris_2006_packet_missing_so_the_lane_should_wait_for_manual_source_acquisition_instead_of_blocking_other_official_source_pack_work",
    runtimeBehaviorChange: false,
    selectedNext: false,
    targetFile: "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md",
    userVisibleRisk:
      "reopening_this_lane_without_the_packet_would_reintroduce_the_original_rockwool_reorder_false_precision_problem",
    validationScope: ["gate_t_handoff_context", "gate_j_visible_acceptance_context"]
  },
  {
    currentPosture: "concrete_knauf_rows_closed_no_runtime_after_mapping_tolerance_chain",
    docOwner: "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V7_PLAN.md",
    executableTestOwner: "packages/engine/src/calculator-source-gap-revalidation-v7-gate-a-contract.test.ts",
    firstMissingRequirement:
      "new_exact_knauf_row_or_new_mapping_tolerance_owner_not_already_rejected_by_tb5a_mwi2a_ttf302a_and_enpc_closeouts",
    id: "closed_knauf_mapping_chain_reopen",
    protectedNegativeBoundaries: [
      "tb5a_mwi2a_ttf302a_and_enpc_do_not_reopen_from_green_tests_alone",
      "remaining_aac_tsf_to_knauf_rows_stay_adjacent_or_negative_context",
      "near_source_knauf_rows_do_not_override_existing_exact_anchors"
    ],
    rank: 3,
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
      "the_knauf_chain_has_already_been_exhausted_by_recent_closeouts_and_should_not_outrank_fresh_official_british_gypsum_rows_waiting_for_gate_b",
    runtimeBehaviorChange: false,
    selectedNext: false,
    targetFile: "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V7_PLAN.md",
    userVisibleRisk:
      "closed_knauf_context_could_leak_back_into_runtime_by_proximity_if_reopened_without_new_requirements",
    validationScope: ["v7_closeout_context", "knauf_negative_boundaries"]
  },
  {
    currentPosture: "important_formula_family_still_metric_and_tolerance_blocked",
    docOwner: "docs/calculator/SLICE_CLT_MASS_TIMBER_WALL_SOURCE_PACK_EXTRACTION_PLAN.md",
    executableTestOwner: "packages/engine/src/clt-mass-timber-wall-source-pack-extraction-gate-b-contract.test.ts",
    firstMissingRequirement:
      "wall_specific_metric_policy_or_frequency_recompute_path_plus_laminated_leaf_material_and_tolerance_owner",
    id: "clt_mass_timber_second_pass_metric_tolerance",
    protectedNegativeBoundaries: [
      "dataholz_clt_floor_rows_remain_floor_only",
      "iic_context_does_not_support_wall_airborne_outputs",
      "woodworks_database_pointers_do_not_import_without_exact_report_and_metric_mapping"
    ],
    rank: 4,
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
      "clt_and_mass_timber_are_high_value_but_the_prior_source_pack_extraction_still_left_metric_and_tolerance_policy_gaps_that_are_less_bounded_than_british_gypsum_gate_b",
    runtimeBehaviorChange: false,
    selectedNext: false,
    targetFile: "packages/engine/src/clt-mass-timber-wall-source-pack-extraction-gate-b-contract.test.ts",
    userVisibleRisk:
      "mass_timber_wall_outputs_can_look_source_backed_before_metric_conversion_and_tolerance_evidence_exist",
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
      "floor_fallback_remains_important_for_coverage_but_the_recent_topology_delta_found_near_misses_only_and_british_gypsum_gate_b_has_concrete_extracted_floor_rows_to_decide_first",
    runtimeBehaviorChange: false,
    selectedNext: false,
    targetFile: "packages/engine/src/generated-floor-fallback-topology-delta-gate-a-contract.test.ts",
    userVisibleRisk:
      "generated_floor_routes_can_overstate_accuracy_if_exact_or_bound_source_precedence_is_inherited_by_proximity",
    validationScope: ["generated_floor_topology_delta_context", "floor_many_layer_and_order_edge_context"]
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
      "historical_blockers_and_productization_only_work_should_stay_below_concrete_official_source_rows_when_the_user_priority_is_accuracy_and_coverage",
    runtimeBehaviorChange: false,
    selectedNext: false,
    targetFile: "docs/calculator/SOURCE_GAP_LEDGER.md",
    userVisibleRisk:
      "workflow_polish_or_old_green_tests_could_be_mistaken_for_broad_high_confidence_coverage",
    validationScope: ["blocked_source_rank_contracts", "internal_use_acceptance_rehearsal"]
  }
] as const;

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

describe("calculator source-gap revalidation v8 Gate A contract", () => {
  it("lands v8 Gate A without runtime or visible-surface movement", () => {
    expect(CALCULATOR_SOURCE_GAP_REVALIDATION_V8_GATE_A).toEqual({
      apiShapeChange: false,
      confidencePromotion: false,
      evidencePromotion: false,
      landedGate: "gate_a_revalidate_source_accuracy_gap_order_after_triple_leaf_uris_lane_pause",
      latestClosedSlice: "wall_triple_leaf_accuracy_recovery_v1_gate_t",
      numericRuntimeBehaviorChange: false,
      outputCardStatusChange: false,
      outputSupportChange: false,
      proposalReportCopyChange: false,
      routeCardValueChange: false,
      runtimeImportSelectedNow: false,
      runtimeTightening: false,
      runtimeWidening: false,
      selectedImplementationSlice: "british_gypsum_white_book_source_pack_extraction_v1",
      selectedPlanningSurface: "docs/calculator/SLICE_BRITISH_GYPSUM_WHITE_BOOK_SOURCE_PACK_EXTRACTION_PLAN.md",
      selectedRouteFamily: "british_gypsum_white_book_mapping_tolerance_no_runtime",
      selectionStatus:
        "selected_british_gypsum_gate_b_mapping_tolerance_after_v8_rerank_paused_uris_2006_lane_and_found_official_rows_waiting_mapping",
      sliceId: "calculator_source_gap_revalidation_v8",
      sourceReadyRuntimePackAvailable: false,
      supportPromotion: false,
      targetFirstGateFile: "packages/engine/src/british-gypsum-white-book-source-pack-extraction-gate-b-contract.test.ts",
      workbenchInputBehaviorChange: false
    });

    for (const path of REQUIRED_PLANNING_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("keeps the Gate T Uris 2006 lane paused as an external packet dependency", () => {
    expect(PAUSED_TRIPLE_LEAF_SOURCE_LANE).toEqual({
      blockedRuntimeReason: "rights_safe_source_packet_absent",
      firstBacklogItem: "uris_2006_authorized_curve_packet",
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
    });
  });

  it("reranks the remaining source and accuracy backlog after the Uris lane pause", () => {
    expect(V8_RERANK_CANDIDATES.map((candidate) => candidate.id)).toEqual([
      "british_gypsum_white_book_gate_b_mapping_tolerance",
      "wall_triple_leaf_uris_2006_source_packet_lane",
      "closed_knauf_mapping_chain_reopen",
      "clt_mass_timber_second_pass_metric_tolerance",
      "generated_floor_fallback_new_source_rule",
      "historical_blocked_or_productization_only_work"
    ]);
    expect(V8_RERANK_CANDIDATES.map((candidate) => candidate.rank)).toEqual([1, 2, 3, 4, 5, 6]);
    expect(new Set(V8_RERANK_CANDIDATES.map((candidate) => candidate.id)).size).toBe(
      V8_RERANK_CANDIDATES.length
    );
    expect(V8_RERANK_CANDIDATES.every((candidate) => candidate.runtimeBehaviorChange === false)).toBe(true);
    expect(V8_RERANK_CANDIDATES.every((candidate) => candidate.readiness.runtimeImportReadyNow === false)).toBe(
      true
    );
    expect(
      V8_RERANK_CANDIDATES.every((candidate) => candidate.readiness.protectedNegativeBoundariesNamed)
    ).toBe(true);
    expect(V8_RERANK_CANDIDATES.every((candidate) => candidate.firstMissingRequirement.length > 70)).toBe(true);
  });

  it("selects British Gypsum Gate B as the next bounded no-runtime source decision", () => {
    expect(V8_RERANK_CANDIDATES.filter((candidate) => candidate.selectedNext)).toEqual([
      expect.objectContaining({
        id: "british_gypsum_white_book_gate_b_mapping_tolerance",
        rank: 1,
        readiness: expect.objectContaining({
          exactLiveTopologyMappingNamed: false,
          exactSourceRowsNamed: true,
          externalSourcePacketAvailable: true,
          localMaterialMappingNamed: false,
          metricOwnerNamed: true,
          pairedEngineVisibleTestsNamed: false,
          pairedWebVisibleTestsNamed: false,
          runtimeImportReadyNow: false,
          sourceLocatorConcrete: true,
          toleranceOwnerNamed: false
        }),
        selectedNext: true,
        targetFile: "packages/engine/src/british-gypsum-white-book-source-pack-extraction-gate-b-contract.test.ts"
      })
    ]);
  });

  it("defines the selected British Gypsum Gate B scope without importing rows", () => {
    expect(BRITISH_GYPSUM_GATE_B_SCOPE).toEqual({
      alreadyRepresentedRows: ["A046006"],
      firstGate: "gate_b_mapping_tolerance_decision_no_runtime",
      rowsNeedingMappingDecision: ["C204006", "C204003", "A206A290", "A326017B", "B226010"],
      runtimeBehaviorChange: false,
      selectedPlanningSurface: "docs/calculator/SLICE_BRITISH_GYPSUM_WHITE_BOOK_SOURCE_PACK_EXTRACTION_PLAN.md",
      targetFirstGateFile: "packages/engine/src/british-gypsum-white-book-source-pack-extraction-gate-b-contract.test.ts"
    });
  });

  it("keeps route/source risk boundaries represented in the selected candidate", () => {
    const selected = V8_RERANK_CANDIDATES.find((candidate) => candidate.selectedNext);

    expect(selected?.protectedNegativeBoundaries).toEqual([
      "c204006_and_c204003_floor_rows_do_not_promote_wall_outputs_or_generic_floor_fallbacks",
      "a206a290_does_not_override_existing_knauf_lsf_anchor_without_precedence_tests",
      "a046006_is_already_landed_and_must_not_be_reimported_or_used_for_direct_timber_routes",
      "a326017b_twin_frame_audio_does_not_promote_no_stud_or_simple_timber_routes",
      "b226010_lined_brick_does_not_promote_generic_lined_concrete_or_mwi2a_masonry"
    ]);
    expect(selected?.userVisibleRisk).toContain("official_white_book_rows_can_look_import_ready");
    expect(selected?.validationScope).toContain("route_source_risk_register");
  });

  it("keeps active docs aligned on the selected British Gypsum Gate B continuation", () => {
    const docs = [
      readRepoFile("AGENTS.md"),
      readRepoFile("docs/calculator/NEXT_IMPLEMENTATION_PLAN.md"),
      readRepoFile("docs/calculator/CURRENT_STATE.md"),
      readRepoFile("docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V8_PLAN.md"),
      readRepoFile(CALCULATOR_SOURCE_GAP_REVALIDATION_V8_GATE_A.selectedPlanningSurface),
      readRepoFile("docs/calculator/CHECKPOINT_2026-05-02_CALCULATOR_SOURCE_GAP_REVALIDATION_V8_GATE_A_HANDOFF.md"),
      readRepoFile("docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md"),
      readRepoFile("docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md")
    ];

    for (const doc of docs) {
      expect(doc).toContain(CALCULATOR_SOURCE_GAP_REVALIDATION_V8_GATE_A.selectedImplementationSlice);
      expect(doc).toContain(CALCULATOR_SOURCE_GAP_REVALIDATION_V8_GATE_A.targetFirstGateFile);
      expect(doc).toContain(CALCULATOR_SOURCE_GAP_REVALIDATION_V8_GATE_A.selectionStatus);
      expect(doc).toContain("paused_waiting_rights_safe_source_packet");
      expect(doc).toContain("gate_b_mapping_tolerance_decision_no_runtime");
    }
  });

  it("keeps frozen surfaces and validation expectations explicit", () => {
    const joinedDocs = [
      readRepoFile("docs/calculator/CHECKPOINT_2026-05-02_CALCULATOR_SOURCE_GAP_REVALIDATION_V8_GATE_A_HANDOFF.md"),
      readRepoFile("docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V8_PLAN.md"),
      readRepoFile("docs/calculator/SLICE_BRITISH_GYPSUM_WHITE_BOOK_SOURCE_PACK_EXTRACTION_PLAN.md")
    ].join("\n");

    for (const surface of FROZEN_SURFACES) {
      expect(joinedDocs, surface).toContain(surface);
    }

    expect(joinedDocs).toContain("pnpm --filter @dynecho/engine exec vitest run src/calculator-source-gap-revalidation-v8-gate-a-contract.test.ts --maxWorkers=1");
    expect(joinedDocs).toContain("pnpm calculator:gate:current");
    expect(joinedDocs).toContain("git diff --check");
  });
});
