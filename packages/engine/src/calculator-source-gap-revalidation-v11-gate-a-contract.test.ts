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

type V11Candidate = {
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

const CALCULATOR_SOURCE_GAP_REVALIDATION_V11_GATE_A = {
  apiShapeChange: false,
  confidencePromotion: false,
  evidencePromotion: false,
  landedGate: "gate_a_revalidate_source_accuracy_gap_order_after_usg_source_pack_closeout",
  latestClosedSlice: "usg_acoustical_assemblies_source_pack_extraction_v1",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: false,
  outputSupportChange: false,
  proposalReportCopyChange: false,
  routeCardValueChange: false,
  runtimeImportSelectedNow: false,
  runtimeTightening: false,
  runtimeWidening: false,
  selectedImplementationSlice: "national_gypsum_fire_sound_selector_source_pack_extraction_v1",
  selectedPlanningSurface:
    "docs/calculator/SLICE_NATIONAL_GYPSUM_FIRE_SOUND_SELECTOR_SOURCE_PACK_EXTRACTION_PLAN.md",
  selectedRouteFamily: "national_gypsum_fire_sound_selector_source_locator_extraction_no_runtime",
  selectionStatus:
    "selected_national_gypsum_fire_sound_selector_source_pack_extraction_after_v11_rerank_found_official_selector_context_but_no_runtime_ready_import",
  sliceId: "calculator_source_gap_revalidation_v11",
  sourceReadyRuntimePackAvailable: false,
  supportPromotion: false,
  targetFirstGateFile:
    "packages/engine/src/national-gypsum-fire-sound-selector-source-pack-extraction-gate-a-contract.test.ts",
  workbenchInputBehaviorChange: false
} as const;

const REQUIRED_PLANNING_SURFACES = [
  "packages/engine/src/calculator-source-gap-revalidation-v11-gate-a-contract.test.ts",
  "packages/engine/src/post-usg-acoustical-assemblies-source-pack-extraction-v1-next-slice-selection-contract.test.ts",
  "packages/engine/src/usg-acoustical-assemblies-source-pack-extraction-gate-b-contract.test.ts",
  "packages/engine/src/usg-acoustical-assemblies-source-pack-extraction-gate-a-contract.test.ts",
  "packages/engine/src/calculator-source-gap-revalidation-v10-gate-a-contract.test.ts",
  "packages/engine/src/post-rockwool-acoustic-wall-assemblies-source-pack-extraction-v1-next-slice-selection-contract.test.ts",
  "packages/engine/src/calculator-post-british-gypsum-source-acquisition-gate-a-contract.test.ts",
  "packages/engine/src/calculator-source-gap-revalidation-v9-gate-a-contract.test.ts",
  "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V11_PLAN.md",
  "docs/calculator/SLICE_NATIONAL_GYPSUM_FIRE_SOUND_SELECTOR_SOURCE_PACK_EXTRACTION_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-02_CALCULATOR_SOURCE_GAP_REVALIDATION_V11_GATE_A_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-05-02_USG_ACOUSTICAL_ASSEMBLIES_SOURCE_PACK_EXTRACTION_GATE_C_CLOSEOUT_HANDOFF.md",
  "docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md",
  "docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md",
  "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "AGENTS.md"
] as const;

const USG_CLOSEOUT_SUMMARY = {
  closedRows: [
    "LEVELROCK_I_JOIST_SRM25_CARPET",
    "LEVELROCK_I_JOIST_SRM25_SHEET_VINYL",
    "LEVELROCK_I_JOIST_SRB_WOOD_LAMINATE",
    "LEVELROCK_TRUSS_SRM25_CERAMIC_TILE",
    "USG_STEEL_FRAMED_A1",
    "USG_STEEL_FRAMED_A8"
  ],
  closedSlice: "usg_acoustical_assemblies_source_pack_extraction_v1",
  closedStatus:
    "closed_usg_acoustical_assemblies_source_pack_no_runtime_and_selected_source_gap_revalidation_v11_because_gate_b_found_no_runtime_ready_row",
  metricBlockers: ["STC", "IIC", "range", "test_number"],
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

const SELECTED_NATIONAL_GYPSUM_SOURCE_LOCATOR = {
  extractionScope: [
    "selector_surface_and_downloadable_report_locator_capture",
    "ul_design_and_sound_test_payload_retrieval_policy",
    "wall_floor_ceiling_family_boundary_matrix",
    "stc_iic_or_sound_test_metric_context_only_until_mapping_gate",
    "national_gypsum_material_alias_and_gold_bond_purple_boundary_capture",
    "negative_boundaries_against_closed_usg_rockwool_british_gypsum_knauf_and_triple_leaf_rows",
    "paired_engine_and_web_visible_test_plan_before_any_runtime_or_visible_movement"
  ],
  firstGate: "gate_a_extract_national_gypsum_fire_sound_selector_rows_without_runtime_import",
  id: "national_gypsum_fire_sound_assembly_selector",
  reportedMetrics: ["sound_test_results", "fire_design_context", "STC_or_IIC_context_pending_row_payload"],
  rowExamples: [
    "National_Gypsum_selector_UL_designs_with_related_sound_tests",
    "V438_or_W419_family_examples_need_row_payload_before_import"
  ],
  runtimeImportReadyNow: false,
  selectedPlanningSurface:
    "docs/calculator/SLICE_NATIONAL_GYPSUM_FIRE_SOUND_SELECTOR_SOURCE_PACK_EXTRACTION_PLAN.md",
  sourceUrl:
    "https://www.nationalgypsum.com/newsroom/press-releases/introducing-national-gypsums-fire-sound-assembly-selector",
  targetFirstGateFile:
    "packages/engine/src/national-gypsum-fire-sound-selector-source-pack-extraction-gate-a-contract.test.ts"
} as const;

const V11_RERANK_CANDIDATES: readonly V11Candidate[] = [
  {
    currentPosture: "official_selector_context_highest_remaining_source_locator_after_rockwool_and_usg_closeouts",
    docOwner: "docs/calculator/SLICE_NATIONAL_GYPSUM_FIRE_SOUND_SELECTOR_SOURCE_PACK_EXTRACTION_PLAN.md",
    executableTestOwner:
      "packages/engine/src/national-gypsum-fire-sound-selector-source-pack-extraction-gate-a-contract.test.ts",
    firstMissingRequirement:
      "extract_selector_row_payloads_downloadable_sound_test_reports_ul_design_topology_metric_context_material_alias_boundaries_tolerance_owner_negative_boundaries_and_paired_visible_tests_before_any_import",
    id: "national_gypsum_fire_sound_assembly_selector",
    protectedNegativeBoundaries: [
      "selector_surfaces_do_not_count_as_runtime_ready_rows_without_row_payload_and_test_report_capture",
      "ul_fire_design_context_does_not_promote_dyn_echo_acoustic_outputs_without_metric_owner",
      "national_gypsum_material_names_do_not_coalesce_with_generic_gypsum_or_usg_knauf_british_gypsum_rows_without_mapping_tolerance"
    ],
    rank: 1,
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
      sourceLocatorConcrete: true,
      toleranceOwnerNamed: false
    },
    reason:
      "after_usg_gate_c_closed_no_runtime_national_gypsum_is_the_highest_ranked_remaining_official_locator_with_selector_and_related_sound_test_context_but_it_is_suitable_only_for_no_runtime_payload_extraction",
    runtimeBehaviorChange: false,
    selectedNext: true,
    targetFile:
      "packages/engine/src/national-gypsum-fire-sound-selector-source-pack-extraction-gate-a-contract.test.ts",
    userVisibleRisk:
      "selector_surfaces_can_make_stc_or_sound_test_context_look_runtime_ready_even_when_exact_row_payload_topology_metric_tolerance_and_visible_tests_are_missing",
    validationScope: [
      "national_gypsum_fire_sound_selector_source_pack_extraction_gate_a_contract",
      "source_ready_intake_backlog_refresh",
      "route_source_risk_register_refresh",
      "pnpm_calculator_gate_current",
      "git_diff_check"
    ]
  },
  {
    currentPosture: "official_gp_resource_planning_context_lower_than_national_gypsum_selector",
    docOwner: "docs/calculator/SLICE_CALCULATOR_POST_BRITISH_GYPSUM_SOURCE_ACQUISITION_V1_PLAN.md",
    executableTestOwner: "packages/engine/src/calculator-post-british-gypsum-source-acquisition-gate-a-contract.test.ts",
    firstMissingRequirement:
      "resolve_actual_gp_fire_resistance_directory_rows_or_test_reports_with_exact_topology_metric_context_material_mapping_tolerance_and_visible_tests",
    id: "georgia_pacific_fire_sound_assemblies",
    protectedNegativeBoundaries: [
      "gp_planning_resource_does_not_count_as_a_runtime_ready_stc_source_row",
      "actual_directory_or_test_report_information_is_required_before_complete_use",
      "gp_context_does_not_override_closed_usg_national_gypsum_knauf_rockwool_or_british_gypsum_boundaries"
    ],
    rank: 2,
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
      "georgia_pacific_remains_useful_official_context_but_the_resource_is_less_row_payload_ready_than_the_national_gypsum_selector",
    runtimeBehaviorChange: false,
    selectedNext: false,
    targetFile: "docs/calculator/SLICE_CALCULATOR_POST_BRITISH_GYPSUM_SOURCE_ACQUISITION_V1_PLAN.md",
    userVisibleRisk: "planning_context_can_be_mistaken_for_exact_stc_source_truth",
    validationScope: ["post_british_gypsum_source_locator_context", "national_gypsum_negative_boundaries"]
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
      "usg_and_national_gypsum_stc_iic_context_do_not_substitute_for_two_cavity_rockwool_triple_leaf_curves",
      "source_packet_absence_blocks_runtime_even_when_grouped_topology_and_visible_guards_exist"
    ],
    rank: 3,
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
      "the_original_defect_remains_important_but_gate_t_left_the_primary_source_packet_absent_so_it_must_stay_paused_while_non_runtime_source_locator_extraction_continues",
    runtimeBehaviorChange: false,
    selectedNext: false,
    targetFile: "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md",
    userVisibleRisk: "reopening_the_lane_without_the_packet_would_reintroduce_the_original_rockwool_reorder_false_precision_problem",
    validationScope: ["gate_t_handoff_context", "gate_j_visible_acceptance_context"]
  },
  {
    currentPosture: "closed_no_runtime_after_usg_gate_b_and_gate_c",
    docOwner: "docs/calculator/SLICE_USG_ACOUSTICAL_ASSEMBLIES_SOURCE_PACK_EXTRACTION_PLAN.md",
    executableTestOwner:
      "packages/engine/src/post-usg-acoustical-assemblies-source-pack-extraction-v1-next-slice-selection-contract.test.ts",
    firstMissingRequirement:
      "new_mapping_tolerance_metric_owner_or_exact_visible_tests_not_already_rejected_by_usg_gate_b_and_gate_c",
    id: "closed_usg_levelrock_and_steel_partition_rows",
    protectedNegativeBoundaries: [
      "levelrock_i_joist_truss_rows_remain_context_only",
      "stc_iic_range_and_test_numbers_do_not_promote_dyn_echo_outputs",
      "usg_sheetrock_thermafiber_and_rc_channel_do_not_coalesce_with_generic_gypsum_rockwool_glass_fiber_or_resilient_bar"
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
      "usg_gate_b_and_gate_c_already_closed_the_rows_no_runtime_so_reopening_them_now_would_duplicate_a_closed_decision",
    runtimeBehaviorChange: false,
    selectedNext: false,
    targetFile:
      "packages/engine/src/post-usg-acoustical-assemblies-source-pack-extraction-v1-next-slice-selection-contract.test.ts",
    userVisibleRisk: "official_usg_stc_iic_rows_can_still_false_promote_floor_wall_or_triple_leaf_routes",
    validationScope: ["usg_gate_b_context", "usg_gate_c_closeout_context"]
  },
  {
    currentPosture: "closed_no_runtime_after_rockwool_gate_b_and_gate_c",
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
    rank: 5,
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
    reason: "rockwool_rows_are_closed_context_and_do_not_become_more_ready_because_usg_later_closed_no_runtime",
    runtimeBehaviorChange: false,
    selectedNext: false,
    targetFile: "packages/engine/src/post-rockwool-acoustic-wall-assemblies-source-pack-extraction-v1-next-slice-selection-contract.test.ts",
    userVisibleRisk: "official_rockwool_rows_can_still_false_promote_local_rockwool_and_triple_leaf_routes",
    validationScope: ["rockwool_gate_b_context", "rockwool_gate_c_closeout_context"]
  },
  {
    currentPosture: "closed_no_runtime_after_british_gypsum_gate_b_and_gate_c",
    docOwner: "docs/calculator/SLICE_BRITISH_GYPSUM_WHITE_BOOK_SOURCE_PACK_EXTRACTION_PLAN.md",
    executableTestOwner: "packages/engine/src/british-gypsum-white-book-source-pack-extraction-gate-b-contract.test.ts",
    firstMissingRequirement:
      "new_mapping_tolerance_metric_owner_or_exact_visible_tests_not_already_rejected_by_british_gypsum_gate_b_and_gate_c",
    id: "closed_british_gypsum_rows",
    protectedNegativeBoundaries: [
      "c204006_and_c204003_remain_floor_only_context",
      "a206a290_does_not_override_existing_knauf_lsf_anchor",
      "a046006_remains_existing_exact_anchor_without_duplicate_import",
      "a326017b_and_b226010_remain_context_only"
    ],
    rank: 6,
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
      "british_gypsum_rows_are_closed_context_and_do_not_become_more_ready_because_usg_later_closed_no_runtime",
    runtimeBehaviorChange: false,
    selectedNext: false,
    targetFile: "packages/engine/src/british-gypsum-white-book-source-pack-extraction-gate-b-contract.test.ts",
    userVisibleRisk: "official_white_book_rows_can_look_authoritative_before_floor_wall_metric_and_tolerance_owners_exist",
    validationScope: ["british_gypsum_gate_b_context", "british_gypsum_gate_c_context"]
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
      "knauf_field_or_adjacent_metric_context_does_not_promote_usg_national_gypsum_or_rockwool_rows"
    ],
    rank: 7,
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
    reason: "the_knauf_mapping_chain_was_already_exhausted_and_has_no_new_v11_source_truth",
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
      "lined_masonry_and_heavy_core_context_do_not_promote_without_wall_specific_rows"
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
      sourceLocatorConcrete: true,
      toleranceOwnerNamed: false
    },
    reason:
      "these_families_remain_high_value_but_have_prior_near_misses_or_metric_gaps_and_do_not_outrank_the_concrete_national_gypsum_selector_for_no_runtime_extraction",
    runtimeBehaviorChange: false,
    selectedNext: false,
    targetFile: "docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md",
    userVisibleRisk: "formula_owned_or_near_miss_families_can_look_source_backed_before_exact_metric_and_topology_requirements_are_met",
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
    rank: 9,
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

describe("calculator source-gap revalidation v11 Gate A contract", () => {
  it("lands v11 Gate A without runtime or visible-surface movement", () => {
    expect(CALCULATOR_SOURCE_GAP_REVALIDATION_V11_GATE_A).toEqual({
      apiShapeChange: false,
      confidencePromotion: false,
      evidencePromotion: false,
      landedGate: "gate_a_revalidate_source_accuracy_gap_order_after_usg_source_pack_closeout",
      latestClosedSlice: "usg_acoustical_assemblies_source_pack_extraction_v1",
      numericRuntimeBehaviorChange: false,
      outputCardStatusChange: false,
      outputSupportChange: false,
      proposalReportCopyChange: false,
      routeCardValueChange: false,
      runtimeImportSelectedNow: false,
      runtimeTightening: false,
      runtimeWidening: false,
      selectedImplementationSlice: "national_gypsum_fire_sound_selector_source_pack_extraction_v1",
      selectedPlanningSurface:
        "docs/calculator/SLICE_NATIONAL_GYPSUM_FIRE_SOUND_SELECTOR_SOURCE_PACK_EXTRACTION_PLAN.md",
      selectedRouteFamily: "national_gypsum_fire_sound_selector_source_locator_extraction_no_runtime",
      selectionStatus:
        "selected_national_gypsum_fire_sound_selector_source_pack_extraction_after_v11_rerank_found_official_selector_context_but_no_runtime_ready_import",
      sliceId: "calculator_source_gap_revalidation_v11",
      sourceReadyRuntimePackAvailable: false,
      supportPromotion: false,
      targetFirstGateFile:
        "packages/engine/src/national-gypsum-fire-sound-selector-source-pack-extraction-gate-a-contract.test.ts",
      workbenchInputBehaviorChange: false
    });

    for (const path of REQUIRED_PLANNING_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("keeps USG closeout evidence blocked from runtime import", () => {
    expect(USG_CLOSEOUT_SUMMARY.closedRows).toEqual([
      "LEVELROCK_I_JOIST_SRM25_CARPET",
      "LEVELROCK_I_JOIST_SRM25_SHEET_VINYL",
      "LEVELROCK_I_JOIST_SRB_WOOD_LAMINATE",
      "LEVELROCK_TRUSS_SRM25_CERAMIC_TILE",
      "USG_STEEL_FRAMED_A1",
      "USG_STEEL_FRAMED_A8"
    ]);
    expect(USG_CLOSEOUT_SUMMARY.runtimeImportReadyNow).toBe(false);
    expect(USG_CLOSEOUT_SUMMARY.metricBlockers).toEqual(["STC", "IIC", "range", "test_number"]);
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

  it("reranks the backlog after USG closeout with every candidate fail-closed", () => {
    expect(V11_RERANK_CANDIDATES.map((candidate) => candidate.id)).toEqual([
      "national_gypsum_fire_sound_assembly_selector",
      "georgia_pacific_fire_sound_assemblies",
      "wall_triple_leaf_uris_2006_source_packet_lane",
      "closed_usg_levelrock_and_steel_partition_rows",
      "closed_rockwool_iss_iws_ess_rows",
      "closed_british_gypsum_rows",
      "closed_knauf_mapping_chain",
      "clt_mass_timber_generated_floor_no_stud_lined_heavy_followups",
      "historical_blocked_or_productization_only_work"
    ]);
    expect(V11_RERANK_CANDIDATES.map((candidate) => candidate.rank)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    expect(new Set(V11_RERANK_CANDIDATES.map((candidate) => candidate.id)).size).toBe(
      V11_RERANK_CANDIDATES.length
    );
    expect(V11_RERANK_CANDIDATES.every((candidate) => candidate.runtimeBehaviorChange === false)).toBe(true);
    expect(V11_RERANK_CANDIDATES.every((candidate) => candidate.readiness.runtimeImportReadyNow === false)).toBe(
      true
    );
    expect(
      V11_RERANK_CANDIDATES.every((candidate) => candidate.readiness.protectedNegativeBoundariesNamed)
    ).toBe(true);
    expect(V11_RERANK_CANDIDATES.every((candidate) => candidate.firstMissingRequirement.length > 80)).toBe(true);
  });

  it("selects National Gypsum selector extraction as the next no-runtime source step", () => {
    expect(V11_RERANK_CANDIDATES.filter((candidate) => candidate.selectedNext)).toEqual([
      expect.objectContaining({
        id: "national_gypsum_fire_sound_assembly_selector",
        rank: 1,
        readiness: expect.objectContaining({
          exactLiveTopologyMappingNamed: false,
          exactSourceRowsNamed: false,
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
        targetFile:
          "packages/engine/src/national-gypsum-fire-sound-selector-source-pack-extraction-gate-a-contract.test.ts"
      })
    ]);
  });

  it("defines the selected National Gypsum extraction scope without importing selector metrics", () => {
    expect(SELECTED_NATIONAL_GYPSUM_SOURCE_LOCATOR).toEqual({
      extractionScope: [
        "selector_surface_and_downloadable_report_locator_capture",
        "ul_design_and_sound_test_payload_retrieval_policy",
        "wall_floor_ceiling_family_boundary_matrix",
        "stc_iic_or_sound_test_metric_context_only_until_mapping_gate",
        "national_gypsum_material_alias_and_gold_bond_purple_boundary_capture",
        "negative_boundaries_against_closed_usg_rockwool_british_gypsum_knauf_and_triple_leaf_rows",
        "paired_engine_and_web_visible_test_plan_before_any_runtime_or_visible_movement"
      ],
      firstGate: "gate_a_extract_national_gypsum_fire_sound_selector_rows_without_runtime_import",
      id: "national_gypsum_fire_sound_assembly_selector",
      reportedMetrics: ["sound_test_results", "fire_design_context", "STC_or_IIC_context_pending_row_payload"],
      rowExamples: [
        "National_Gypsum_selector_UL_designs_with_related_sound_tests",
        "V438_or_W419_family_examples_need_row_payload_before_import"
      ],
      runtimeImportReadyNow: false,
      selectedPlanningSurface:
        "docs/calculator/SLICE_NATIONAL_GYPSUM_FIRE_SOUND_SELECTOR_SOURCE_PACK_EXTRACTION_PLAN.md",
      sourceUrl:
        "https://www.nationalgypsum.com/newsroom/press-releases/introducing-national-gypsums-fire-sound-assembly-selector",
      targetFirstGateFile:
        "packages/engine/src/national-gypsum-fire-sound-selector-source-pack-extraction-gate-a-contract.test.ts"
    });
  });

  it("keeps active docs aligned on the selected National Gypsum source-pack extraction", () => {
    const docs = [
      readRepoFile("AGENTS.md"),
      readRepoFile("docs/calculator/NEXT_IMPLEMENTATION_PLAN.md"),
      readRepoFile("docs/calculator/CURRENT_STATE.md"),
      readRepoFile("docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V11_PLAN.md"),
      readRepoFile(CALCULATOR_SOURCE_GAP_REVALIDATION_V11_GATE_A.selectedPlanningSurface),
      readRepoFile("docs/calculator/CHECKPOINT_2026-05-02_CALCULATOR_SOURCE_GAP_REVALIDATION_V11_GATE_A_HANDOFF.md"),
      readRepoFile("docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md"),
      readRepoFile("docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md"),
      readRepoFile("docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md")
    ];

    for (const doc of docs) {
      expect(doc).toContain(CALCULATOR_SOURCE_GAP_REVALIDATION_V11_GATE_A.selectedImplementationSlice);
      expect(doc).toContain(CALCULATOR_SOURCE_GAP_REVALIDATION_V11_GATE_A.targetFirstGateFile);
      expect(doc).toContain(CALCULATOR_SOURCE_GAP_REVALIDATION_V11_GATE_A.selectionStatus);
      expect(doc).toContain("National Gypsum Fire & Sound Assembly Selector");
      expect(doc).toContain("gate_a_extract_national_gypsum_fire_sound_selector_rows_without_runtime_import");
      expect(doc).toContain("paused_waiting_rights_safe_source_packet");
      expect(doc).toContain("multileaf_screening_blend");
      expect(doc).toContain("Rw 41");
    }
  });

  it("keeps frozen surfaces and validation expectations explicit", () => {
    const joinedDocs = [
      readRepoFile("docs/calculator/CHECKPOINT_2026-05-02_CALCULATOR_SOURCE_GAP_REVALIDATION_V11_GATE_A_HANDOFF.md"),
      readRepoFile("docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V11_PLAN.md"),
      readRepoFile("docs/calculator/SLICE_NATIONAL_GYPSUM_FIRE_SOUND_SELECTOR_SOURCE_PACK_EXTRACTION_PLAN.md")
    ].join("\n");

    for (const surface of FROZEN_SURFACES) {
      expect(joinedDocs, surface).toContain(surface);
    }

    expect(joinedDocs).toContain(
      "pnpm --filter @dynecho/engine exec vitest run src/calculator-source-gap-revalidation-v11-gate-a-contract.test.ts --maxWorkers=1"
    );
    expect(joinedDocs).toContain("pnpm calculator:gate:current");
    expect(joinedDocs).toContain("git diff --check");
  });
});
