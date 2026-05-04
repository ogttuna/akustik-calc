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

type V10Candidate = {
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

const CALCULATOR_SOURCE_GAP_REVALIDATION_V10_GATE_A = {
  apiShapeChange: false,
  confidencePromotion: false,
  evidencePromotion: false,
  landedGate: "gate_a_revalidate_source_accuracy_gap_order_after_rockwool_source_pack_closeout",
  latestClosedSlice: "rockwool_acoustic_wall_assemblies_source_pack_extraction_v1",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: false,
  outputSupportChange: false,
  proposalReportCopyChange: false,
  routeCardValueChange: false,
  runtimeImportSelectedNow: false,
  runtimeTightening: false,
  runtimeWidening: false,
  selectedImplementationSlice: "usg_acoustical_assemblies_source_pack_extraction_v1",
  selectedPlanningSurface: "docs/calculator/SLICE_USG_ACOUSTICAL_ASSEMBLIES_SOURCE_PACK_EXTRACTION_PLAN.md",
  selectedRouteFamily: "usg_acoustical_assemblies_floor_wall_source_locator_extraction_no_runtime",
  selectionStatus:
    "selected_usg_acoustical_assemblies_source_pack_extraction_after_v10_rerank_found_official_floor_wall_stc_iic_rows_but_no_runtime_ready_import",
  sliceId: "calculator_source_gap_revalidation_v10",
  sourceReadyRuntimePackAvailable: false,
  supportPromotion: false,
  targetFirstGateFile:
    "packages/engine/src/usg-acoustical-assemblies-source-pack-extraction-gate-a-contract.test.ts",
  workbenchInputBehaviorChange: false
} as const;

const REQUIRED_PLANNING_SURFACES = [
  "packages/engine/src/calculator-source-gap-revalidation-v10-gate-a-contract.test.ts",
  "packages/engine/src/post-rockwool-acoustic-wall-assemblies-source-pack-extraction-v1-next-slice-selection-contract.test.ts",
  "packages/engine/src/rockwool-acoustic-wall-assemblies-source-pack-extraction-gate-b-contract.test.ts",
  "packages/engine/src/rockwool-acoustic-wall-assemblies-source-pack-extraction-gate-a-contract.test.ts",
  "packages/engine/src/calculator-post-british-gypsum-source-acquisition-gate-a-contract.test.ts",
  "packages/engine/src/calculator-source-gap-revalidation-v9-gate-a-contract.test.ts",
  "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V10_PLAN.md",
  "docs/calculator/SLICE_USG_ACOUSTICAL_ASSEMBLIES_SOURCE_PACK_EXTRACTION_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-02_CALCULATOR_SOURCE_GAP_REVALIDATION_V10_GATE_A_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-05-02_ROCKWOOL_ACOUSTIC_WALL_ASSEMBLIES_SOURCE_PACK_EXTRACTION_GATE_C_CLOSEOUT_HANDOFF.md",
  "docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md",
  "docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md",
  "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "AGENTS.md"
] as const;

const ROCKWOOL_CLOSEOUT_SUMMARY = {
  closedSlice: "rockwool_acoustic_wall_assemblies_source_pack_extraction_v1",
  closedStatus:
    "closed_rockwool_acoustic_wall_assemblies_source_pack_no_runtime_and_selected_source_gap_revalidation_v10_because_gate_b_found_no_runtime_ready_row",
  extractedRows: ["ISS-00", "ISS-22", "ISS-39", "IWS-04", "ESS-05"],
  materialAliasBlockers: ["AFB", "Comfortbatt", "Cavityrock", "local_rockwool", "glass_fiber"],
  metricBlockers: ["STC", "OITC", "test_report_number"],
  runtimeImportReadyNow: false
} as const;

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

const SELECTED_USG_SOURCE_LOCATOR = {
  extractionScope: [
    "source_locator_and_row_table_boundary_extraction",
    "wall_versus_floor_ceiling_family_separation",
    "stc_iic_metric_policy_context_only_until_mapping_gate",
    "levelrock_srm_srb_i_joist_truss_material_and_topology_capture",
    "negative_boundaries_against_generated_floor_wall_triple_leaf_rockwool_british_gypsum_and_knauf_rows",
    "paired_engine_and_web_visible_test_plan_before_runtime_or_visible_movement"
  ],
  firstGate: "gate_a_extract_usg_acoustical_assemblies_rows_without_runtime_import",
  id: "usg_acoustical_assemblies_sa200",
  reportedMetrics: ["STC", "IIC"],
  rowExamples: [
    "Levelrock_I_joist_SRM25_carpet_IIC77_STC65",
    "Levelrock_I_joist_SRB_wood_laminate_IIC61_STC65",
    "Levelrock_truss_SRM25_ceramic_tile_IIC56_STC61"
  ],
  runtimeImportReadyNow: false,
  sourceUrl:
    "https://www.usg.com/content/dam/USG_Marketing_Communications/united_states/product_promotional_materials/finished_assets/acoustical-assemblies-en-SA200.pdf",
  targetFirstGateFile: "packages/engine/src/usg-acoustical-assemblies-source-pack-extraction-gate-a-contract.test.ts"
} as const;

const V10_RERANK_CANDIDATES: readonly V10Candidate[] = [
  {
    currentPosture: "official_usg_locator_concrete_but_not_runtime_mapped",
    docOwner: "docs/calculator/SLICE_USG_ACOUSTICAL_ASSEMBLIES_SOURCE_PACK_EXTRACTION_PLAN.md",
    executableTestOwner: "packages/engine/src/usg-acoustical-assemblies-source-pack-extraction-gate-a-contract.test.ts",
    firstMissingRequirement:
      "extract_source_rows_and_separate_wall_floor_ceiling_topology_stc_iic_metric_policy_levelrock_material_mapping_tolerance_negative_boundaries_and_paired_visible_tests_before_any_runtime_import",
    id: "usg_acoustical_assemblies_sa200",
    protectedNegativeBoundaries: [
      "usg_stc_iic_rows_do_not_promote_dyn_echo_rw_lnw_or_field_outputs_without_metric_policy",
      "usg_floor_ceiling_rows_do_not_become_wall_or_triple_leaf_truth",
      "usg_levelrock_and_resilient_system_materials_do_not_coalesce_with_generic_floor_layers_without_mapping_tolerance"
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
      "after_rockwool_closed_no_runtime_usg_sa200_is_the_highest_ranked_remaining_concrete_official_locator_from_post_british_gypsum_acquisition_and_is_suitable_for_no_runtime_row_extraction_only",
    runtimeBehaviorChange: false,
    selectedNext: true,
    targetFile: "packages/engine/src/usg-acoustical-assemblies-source-pack-extraction-gate-a-contract.test.ts",
    userVisibleRisk:
      "floor_iic_and_wall_stc_tables_can_look_ready_for_calculator_values_even_though_dyn_echo_needs_explicit_floor_wall_topology_and_metric_policy_before_import",
    validationScope: [
      "usg_acoustical_assemblies_source_pack_extraction_gate_a_contract",
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
      "rockwool_catalog_closeout_does_not_fix_the_uris_2006_triple_leaf_lane",
      "usg_floor_wall_tables_do_not_substitute_for_two_cavity_rockwool_triple_leaf_curves"
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
      "the_original_defect_is_still_real_but_the_primary_uris_2006_source_packet_is_absent_so_the_lane_stays_paused_while_usg_row_extraction_can_progress_without_runtime_movement",
    runtimeBehaviorChange: false,
    selectedNext: false,
    targetFile: "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md",
    userVisibleRisk: "reopening_the_rockwool_lane_without_source_packet_would_recreate_false_precision",
    validationScope: ["gate_t_handoff_context", "rockwool_gate_c_closeout_context"]
  },
  {
    currentPosture: "closed_no_runtime_after_gate_b_and_gate_c",
    docOwner: "docs/calculator/SLICE_ROCKWOOL_ACOUSTIC_WALL_ASSEMBLIES_SOURCE_PACK_EXTRACTION_PLAN.md",
    executableTestOwner:
      "packages/engine/src/post-rockwool-acoustic-wall-assemblies-source-pack-extraction-v1-next-slice-selection-contract.test.ts",
    firstMissingRequirement:
      "new_rockwool_catalog_mapping_tolerance_metric_policy_or_paired_visible_test_owner_not_already_rejected_by_gate_b_and_gate_c",
    id: "closed_rockwool_iss_iws_ess_rows",
    protectedNegativeBoundaries: [
      "iss_iws_ess_rows_remain_context_only",
      "stc_oitc_report_numbers_do_not_promote_iso_rw_or_field_outputs",
      "afb_comfortbatt_cavityrock_do_not_coalesce_with_local_rockwool_or_glass_fiber"
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
      "rockwool_gate_b_and_gate_c_already_closed_the_catalog_rows_no_runtime_so_reopening_them_now_would_duplicate_a_closed_decision",
    runtimeBehaviorChange: false,
    selectedNext: false,
    targetFile: "packages/engine/src/post-rockwool-acoustic-wall-assemblies-source-pack-extraction-v1-next-slice-selection-contract.test.ts",
    userVisibleRisk: "official_rockwool_rows_can_still_false_promote_local_rockwool_and_triple_leaf_routes",
    validationScope: ["rockwool_gate_b_context", "rockwool_gate_c_closeout_context"]
  },
  {
    currentPosture: "closed_no_runtime_after_british_gypsum_gate_b_and_gate_c",
    docOwner: "docs/calculator/SLICE_BRITISH_GYPSUM_WHITE_BOOK_SOURCE_PACK_EXTRACTION_PLAN.md",
    executableTestOwner: "packages/engine/src/british-gypsum-white-book-source-extraction-gate-b-contract.test.ts",
    firstMissingRequirement:
      "new_mapping_tolerance_metric_owner_or_exact_visible_tests_not_already_rejected_by_british_gypsum_gate_b_and_gate_c",
    id: "closed_british_gypsum_rows",
    protectedNegativeBoundaries: [
      "c204006_and_c204003_remain_floor_only_context",
      "a206a290_does_not_override_existing_knauf_lsf_anchor",
      "a046006_remains_existing_exact_anchor_without_duplicate_import",
      "a326017b_and_b226010_remain_context_only"
    ],
    rank: 4,
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
      "british_gypsum_rows_are_closed_context_and_do_not_become_more_ready_because_rockwool_later_closed_no_runtime",
    runtimeBehaviorChange: false,
    selectedNext: false,
    targetFile: "packages/engine/src/british-gypsum-white-book-source-pack-extraction-gate-b-contract.test.ts",
    userVisibleRisk: "official_white_book_rows_can_look_authoritative_before_floor_wall_metric_and_tolerance_owners_exist",
    validationScope: ["british_gypsum_gate_b_context", "british_gypsum_gate_c_context"]
  },
  {
    currentPosture: "post_british_gypsum_locator_context_lower_than_usg",
    docOwner: "docs/calculator/SLICE_CALCULATOR_POST_BRITISH_GYPSUM_SOURCE_ACQUISITION_V1_PLAN.md",
    executableTestOwner: "packages/engine/src/calculator-post-british-gypsum-source-acquisition-gate-a-contract.test.ts",
    firstMissingRequirement:
      "row_level_payloads_or_downloadable_test_reports_with_exact_topology_metric_context_tolerance_owner_material_mapping_and_visible_tests",
    id: "national_gypsum_and_georgia_pacific_source_locators",
    protectedNegativeBoundaries: [
      "selector_or_resource_surfaces_do_not_count_as_runtime_ready_rows",
      "planning_stc_context_does_not_override_exact_source_pack_rows",
      "dynamic_payloads_require_explicit_row_capture_before_import"
    ],
    rank: 5,
    readiness: {
      exactLiveTopologyMappingNamed: false,
      exactSourceRowsNamed: false,
      externalSourcePacketAvailable: true,
      localMaterialMappingNamed: false,
      metricOwnerNamed: true,
      pairedEngineVisibleTestsNamed: false,
      pairedWebVisibleTestsNamed: false,
      protectedNegativeBoundariesNamed: true,
      runtimeImportReadyNow: false,
      sourceLocatorConcrete: false,
      toleranceOwnerNamed: false
    },
    reason:
      "national_gypsum_and_georgia_pacific_remain_useful_locator_context_but_usg_has_more_concrete_named_floor_wall_rows_for_the_next_no_runtime_extraction",
    runtimeBehaviorChange: false,
    selectedNext: false,
    targetFile: "docs/calculator/SLICE_CALCULATOR_POST_BRITISH_GYPSUM_SOURCE_ACQUISITION_V1_PLAN.md",
    userVisibleRisk: "nearby_selector_surfaces_can_hide_missing_row_payloads_and_test_reports",
    validationScope: ["post_british_gypsum_source_locator_context"]
  },
  {
    currentPosture: "concrete_knauf_mapping_chain_closed_no_runtime",
    docOwner: "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V7_PLAN.md",
    executableTestOwner: "packages/engine/src/calculator-source-gap-revalidation-v7-gate-a-contract.test.ts",
    firstMissingRequirement:
      "new_exact_knauf_or_equivalent_row_not_already_rejected_by_tb5a_mwi2a_ttf302a_enpc_and_remaining_adjacent_boundaries",
    id: "closed_knauf_mapping_chain",
    protectedNegativeBoundaries: [
      "tb5a_mwi2a_ttf302a_and_enpc_do_not_reopen_from_green_tests_alone",
      "near_source_knauf_rows_do_not_override_existing_exact_anchors",
      "knauf_field_or_adjacent_metric_context_does_not_promote_usg_or_rockwool_rows"
    ],
    rank: 6,
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
    reason: "the_knauf_mapping_chain_was_already_exhausted_and_has_no_new_v10_source_truth",
    runtimeBehaviorChange: false,
    selectedNext: false,
    targetFile: "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V7_PLAN.md",
    userVisibleRisk: "closed_knauf_context_could_leak_back_into_runtime_by_proximity",
    validationScope: ["v7_closeout_context", "knauf_negative_boundaries"]
  },
  {
    currentPosture: "formula_owned_or_metric_blocked_followups_still_not_source_ready",
    docOwner: "docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md",
    executableTestOwner: "packages/engine/src/calculator-source-pack-readiness-triage-gate-a-contract.test.ts",
    firstMissingRequirement:
      "new_exact_wall_or_floor_source_rows_plus_metric_policy_tolerance_material_mapping_negative_boundaries_and_visible_tests",
    id: "clt_mass_timber_generated_floor_no_stud_lined_heavy_followups",
    protectedNegativeBoundaries: [
      "floor_only_or_ceiling_lining_rows_do_not_become_wall_truth",
      "generated_floor_near_misses_need_exact_or_bounded_topology_match",
      "lined_masonry_and_heavy_core_context_do_not_promote_without wall_specific_rows"
    ],
    rank: 7,
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
      "these_families_remain_high_value_but_have_prior_near_misses_or_metric_gaps_and_do_not outrank_the_concrete_usg_locator_for_no_runtime_extraction",
    runtimeBehaviorChange: false,
    selectedNext: false,
    targetFile: "docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md",
    userVisibleRisk: "formula_owned_or_near_miss_families_can_look_source_backed_before exact_metric_and_topology_requirements_are_met",
    validationScope: ["source_ready_intake_backlog", "clt_floor_no_stud_lined_heavy_boundaries"]
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
    rank: 8,
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
      "historical_blockers_and_productization_only_work_stay_below_concrete_source_extraction_when_the_user_priority_is_calculator_correctness_and_coverage",
    runtimeBehaviorChange: false,
    selectedNext: false,
    targetFile: "docs/calculator/SOURCE_GAP_LEDGER.md",
    userVisibleRisk: "workflow_polish_or_old_green_tests_could_be_mistaken_for_broad_high_confidence_coverage",
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

describe("calculator source-gap revalidation v10 Gate A contract", () => {
  it("lands v10 Gate A without runtime or visible-surface movement", () => {
    expect(CALCULATOR_SOURCE_GAP_REVALIDATION_V10_GATE_A).toEqual({
      apiShapeChange: false,
      confidencePromotion: false,
      evidencePromotion: false,
      landedGate: "gate_a_revalidate_source_accuracy_gap_order_after_rockwool_source_pack_closeout",
      latestClosedSlice: "rockwool_acoustic_wall_assemblies_source_pack_extraction_v1",
      numericRuntimeBehaviorChange: false,
      outputCardStatusChange: false,
      outputSupportChange: false,
      proposalReportCopyChange: false,
      routeCardValueChange: false,
      runtimeImportSelectedNow: false,
      runtimeTightening: false,
      runtimeWidening: false,
      selectedImplementationSlice: "usg_acoustical_assemblies_source_pack_extraction_v1",
      selectedPlanningSurface: "docs/calculator/SLICE_USG_ACOUSTICAL_ASSEMBLIES_SOURCE_PACK_EXTRACTION_PLAN.md",
      selectedRouteFamily: "usg_acoustical_assemblies_floor_wall_source_locator_extraction_no_runtime",
      selectionStatus:
        "selected_usg_acoustical_assemblies_source_pack_extraction_after_v10_rerank_found_official_floor_wall_stc_iic_rows_but_no_runtime_ready_import",
      sliceId: "calculator_source_gap_revalidation_v10",
      sourceReadyRuntimePackAvailable: false,
      supportPromotion: false,
      targetFirstGateFile:
        "packages/engine/src/usg-acoustical-assemblies-source-pack-extraction-gate-a-contract.test.ts",
      workbenchInputBehaviorChange: false
    });

    for (const path of REQUIRED_PLANNING_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("keeps ROCKWOOL closeout context blocked from runtime import", () => {
    expect(ROCKWOOL_CLOSEOUT_SUMMARY.extractedRows).toEqual(["ISS-00", "ISS-22", "ISS-39", "IWS-04", "ESS-05"]);
    expect(ROCKWOOL_CLOSEOUT_SUMMARY.runtimeImportReadyNow).toBe(false);
    expect(ROCKWOOL_CLOSEOUT_SUMMARY.metricBlockers).toEqual(["STC", "OITC", "test_report_number"]);
    expect(ROCKWOOL_CLOSEOUT_SUMMARY.materialAliasBlockers).toContain("local_rockwool");
    expect(ROCKWOOL_CLOSEOUT_SUMMARY.materialAliasBlockers).toContain("glass_fiber");
  });

  it("keeps the original Uris 2006 rockwool lane paused instead of calling Rw 41 fixed", () => {
    expect(PAUSED_TRIPLE_LEAF_SOURCE_LANE.sourceLaneDisposition).toBe("paused_waiting_rights_safe_source_packet");
    expect(PAUSED_TRIPLE_LEAF_SOURCE_LANE.currentScreeningAnswer).toBe(
      "multileaf_screening_blend_rw_41_low_confidence"
    );
    expect(PAUSED_TRIPLE_LEAF_SOURCE_LANE.runtimeImportReadyNow).toBe(false);
    expect(PAUSED_TRIPLE_LEAF_SOURCE_LANE.missingPacketArtifacts).toContain("authorized_source_file_or_tdm_payload");
    expect(PAUSED_TRIPLE_LEAF_SOURCE_LANE.missingPacketArtifacts).toContain("band_vector_or_digitization_payload");
  });

  it("reranks the backlog after ROCKWOOL closeout with every candidate fail-closed", () => {
    expect(V10_RERANK_CANDIDATES.map((candidate) => candidate.id)).toEqual([
      "usg_acoustical_assemblies_sa200",
      "wall_triple_leaf_uris_2006_source_packet_lane",
      "closed_rockwool_iss_iws_ess_rows",
      "closed_british_gypsum_rows",
      "national_gypsum_and_georgia_pacific_source_locators",
      "closed_knauf_mapping_chain",
      "clt_mass_timber_generated_floor_no_stud_lined_heavy_followups",
      "historical_blocked_or_productization_only_work"
    ]);
    expect(V10_RERANK_CANDIDATES.map((candidate) => candidate.rank)).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
    expect(new Set(V10_RERANK_CANDIDATES.map((candidate) => candidate.id)).size).toBe(
      V10_RERANK_CANDIDATES.length
    );
    expect(V10_RERANK_CANDIDATES.every((candidate) => candidate.runtimeBehaviorChange === false)).toBe(true);
    expect(V10_RERANK_CANDIDATES.every((candidate) => candidate.readiness.runtimeImportReadyNow === false)).toBe(
      true
    );
    expect(
      V10_RERANK_CANDIDATES.every((candidate) => candidate.readiness.protectedNegativeBoundariesNamed)
    ).toBe(true);
    expect(V10_RERANK_CANDIDATES.every((candidate) => candidate.firstMissingRequirement.length > 75)).toBe(true);
  });

  it("selects USG Acoustical Assemblies extraction as the next no-runtime source step", () => {
    expect(V10_RERANK_CANDIDATES.filter((candidate) => candidate.selectedNext)).toEqual([
      expect.objectContaining({
        id: "usg_acoustical_assemblies_sa200",
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
        targetFile: "packages/engine/src/usg-acoustical-assemblies-source-pack-extraction-gate-a-contract.test.ts"
      })
    ]);
  });

  it("defines the selected USG extraction scope without importing STC or IIC rows", () => {
    expect(SELECTED_USG_SOURCE_LOCATOR).toEqual({
      extractionScope: [
        "source_locator_and_row_table_boundary_extraction",
        "wall_versus_floor_ceiling_family_separation",
        "stc_iic_metric_policy_context_only_until_mapping_gate",
        "levelrock_srm_srb_i_joist_truss_material_and_topology_capture",
        "negative_boundaries_against_generated_floor_wall_triple_leaf_rockwool_british_gypsum_and_knauf_rows",
        "paired_engine_and_web_visible_test_plan_before_runtime_or_visible_movement"
      ],
      firstGate: "gate_a_extract_usg_acoustical_assemblies_rows_without_runtime_import",
      id: "usg_acoustical_assemblies_sa200",
      reportedMetrics: ["STC", "IIC"],
      rowExamples: [
        "Levelrock_I_joist_SRM25_carpet_IIC77_STC65",
        "Levelrock_I_joist_SRB_wood_laminate_IIC61_STC65",
        "Levelrock_truss_SRM25_ceramic_tile_IIC56_STC61"
      ],
      runtimeImportReadyNow: false,
      sourceUrl:
        "https://www.usg.com/content/dam/USG_Marketing_Communications/united_states/product_promotional_materials/finished_assets/acoustical-assemblies-en-SA200.pdf",
      targetFirstGateFile: "packages/engine/src/usg-acoustical-assemblies-source-pack-extraction-gate-a-contract.test.ts"
    });
  });

  it("keeps active docs aligned on the selected USG source-pack extraction", () => {
    const docs = [
      readRepoFile("AGENTS.md"),
      readRepoFile("docs/calculator/NEXT_IMPLEMENTATION_PLAN.md"),
      readRepoFile("docs/calculator/CURRENT_STATE.md"),
      readRepoFile("docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V10_PLAN.md"),
      readRepoFile(CALCULATOR_SOURCE_GAP_REVALIDATION_V10_GATE_A.selectedPlanningSurface),
      readRepoFile("docs/calculator/CHECKPOINT_2026-05-02_CALCULATOR_SOURCE_GAP_REVALIDATION_V10_GATE_A_HANDOFF.md"),
      readRepoFile("docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md"),
      readRepoFile("docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md"),
      readRepoFile("docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md")
    ];

    for (const doc of docs) {
      expect(doc).toContain(CALCULATOR_SOURCE_GAP_REVALIDATION_V10_GATE_A.selectedImplementationSlice);
      expect(doc).toContain(CALCULATOR_SOURCE_GAP_REVALIDATION_V10_GATE_A.targetFirstGateFile);
      expect(doc).toContain(CALCULATOR_SOURCE_GAP_REVALIDATION_V10_GATE_A.selectionStatus);
      expect(doc).toContain("gate_a_extract_usg_acoustical_assemblies_rows_without_runtime_import");
      expect(doc).toContain("paused_waiting_rights_safe_source_packet");
      expect(doc).toContain("multileaf_screening_blend");
      expect(doc).toContain("Rw 41");
    }
  });

  it("keeps frozen surfaces and validation expectations explicit", () => {
    const joinedDocs = [
      readRepoFile("docs/calculator/CHECKPOINT_2026-05-02_CALCULATOR_SOURCE_GAP_REVALIDATION_V10_GATE_A_HANDOFF.md"),
      readRepoFile("docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V10_PLAN.md"),
      readRepoFile("docs/calculator/SLICE_USG_ACOUSTICAL_ASSEMBLIES_SOURCE_PACK_EXTRACTION_PLAN.md")
    ].join("\n");

    for (const surface of FROZEN_SURFACES) {
      expect(joinedDocs, surface).toContain(surface);
    }

    expect(joinedDocs).toContain(
      "pnpm --filter @dynecho/engine exec vitest run src/calculator-source-gap-revalidation-v10-gate-a-contract.test.ts --maxWorkers=1"
    );
    expect(joinedDocs).toContain("pnpm calculator:gate:current");
    expect(joinedDocs).toContain("git diff --check");
  });
});
