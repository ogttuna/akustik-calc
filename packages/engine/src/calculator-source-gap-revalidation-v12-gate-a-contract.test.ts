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

type V12Candidate = {
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

const CALCULATOR_SOURCE_GAP_REVALIDATION_V12_GATE_A = {
  apiShapeChange: false,
  confidencePromotion: false,
  evidencePromotion: false,
  landedGate: "gate_a_revalidate_source_accuracy_gap_order_after_national_gypsum_source_pack_closeout",
  latestClosedSlice: "national_gypsum_fire_sound_selector_source_pack_extraction_v1",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: false,
  outputSupportChange: false,
  proposalReportCopyChange: false,
  routeCardValueChange: false,
  runtimeImportSelectedNow: false,
  runtimeTightening: false,
  runtimeWidening: false,
  selectedImplementationSlice: "georgia_pacific_fire_sound_assemblies_source_pack_extraction_v1",
  selectedPlanningSurface:
    "docs/calculator/SLICE_GEORGIA_PACIFIC_FIRE_SOUND_ASSEMBLIES_SOURCE_PACK_EXTRACTION_PLAN.md",
  selectedRouteFamily: "georgia_pacific_fire_sound_assemblies_source_locator_extraction_no_runtime",
  selectionStatus:
    "selected_georgia_pacific_fire_sound_assemblies_source_pack_extraction_after_v12_rerank_found_official_planning_context_but_no_runtime_ready_import",
  sliceId: "calculator_source_gap_revalidation_v12",
  sourceReadyRuntimePackAvailable: false,
  supportPromotion: false,
  targetFirstGateFile:
    "packages/engine/src/georgia-pacific-fire-sound-assemblies-source-pack-extraction-gate-a-contract.test.ts",
  workbenchInputBehaviorChange: false
} as const;

const REQUIRED_PLANNING_SURFACES = [
  "packages/engine/src/calculator-source-gap-revalidation-v12-gate-a-contract.test.ts",
  "packages/engine/src/post-national-gypsum-fire-sound-selector-source-pack-extraction-v1-next-slice-selection-contract.test.ts",
  "packages/engine/src/national-gypsum-fire-sound-selector-source-pack-extraction-gate-b-contract.test.ts",
  "packages/engine/src/national-gypsum-fire-sound-selector-source-pack-extraction-gate-a-contract.test.ts",
  "packages/engine/src/calculator-source-gap-revalidation-v11-gate-a-contract.test.ts",
  "packages/engine/src/post-usg-acoustical-assemblies-source-pack-extraction-v1-next-slice-selection-contract.test.ts",
  "packages/engine/src/post-rockwool-acoustic-wall-assemblies-source-pack-extraction-v1-next-slice-selection-contract.test.ts",
  "packages/engine/src/calculator-post-british-gypsum-source-acquisition-gate-a-contract.test.ts",
  "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V12_PLAN.md",
  "docs/calculator/SLICE_GEORGIA_PACIFIC_FIRE_SOUND_ASSEMBLIES_SOURCE_PACK_EXTRACTION_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-02_CALCULATOR_SOURCE_GAP_REVALIDATION_V12_GATE_A_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-05-02_NATIONAL_GYPSUM_FIRE_SOUND_SELECTOR_SOURCE_PACK_EXTRACTION_GATE_C_CLOSEOUT_HANDOFF.md",
  "docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md",
  "docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md",
  "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "AGENTS.md"
] as const;

const NATIONAL_GYPSUM_CLOSEOUT_SUMMARY = {
  closedRows: [
    "NATIONAL_GYPSUM_V438_U465_20EQ_RC1_STC50",
    "NATIONAL_GYPSUM_W419_U499_SHAFTWALL_STC44",
    "NATIONAL_GYPSUM_W469_LOAD_BEARING_RC1_STC51",
    "NATIONAL_GYPSUM_W454_AREA_SEPARATION_STC43",
    "NATIONAL_GYPSUM_P540_ROOF_CEILING_STC_NA"
  ],
  closedSlice: "national_gypsum_fire_sound_selector_source_pack_extraction_v1",
  closedStatus:
    "closed_national_gypsum_fire_sound_selector_source_pack_no_runtime_and_selected_source_gap_revalidation_v12_because_gate_b_found_no_runtime_ready_row",
  materialAliasBlockers: [
    "Fire-Shield",
    "SoundBreak",
    "eXP Shaftliner",
    "glass_fiber",
    "resilient_channel",
    "CT_stud",
    "H_stud",
    "load_bearing_stud",
    "roof_truss"
  ],
  metricBlockers: ["STC", "acoustical_test_report_locator", "STC_NA"],
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

const SELECTED_GEORGIA_PACIFIC_SOURCE_LOCATOR = {
  extractionScope: [
    "resource_surface_and_actual_directory_or_test_report_locator_capture",
    "fire_resistance_directory_and_assembly_payload_retrieval_policy",
    "wall_floor_ceiling_roof_family_boundary_matrix",
    "stc_metric_context_only_until_mapping_gate",
    "gp_material_alias_boundary_capture_for_densglass_toughrock_soundbreak_and_generic_gypsum",
    "negative_boundaries_against_closed_national_gypsum_usg_rockwool_british_gypsum_knauf_and_triple_leaf_rows",
    "paired_engine_and_web_visible_test_plan_before_any_runtime_or_visible_movement"
  ],
  firstGate: "gate_a_extract_georgia_pacific_fire_sound_assemblies_rows_without_runtime_import",
  id: "georgia_pacific_fire_sound_assemblies",
  reportedMetrics: ["STC", "fire_resistance_context", "assembly_context_pending_actual_directory_or_test_report"],
  rowExamples: [
    "GP_fire_sound_assembly_context_requires_actual_test_report_before_import",
    "GP_fire_resistance_directory_rows_need_exact_payload_before_import"
  ],
  runtimeImportReadyNow: false,
  selectedPlanningSurface:
    "docs/calculator/SLICE_GEORGIA_PACIFIC_FIRE_SOUND_ASSEMBLIES_SOURCE_PACK_EXTRACTION_PLAN.md",
  sourceUrl: "https://www.buildgp.com/resources/assemblies",
  targetFirstGateFile:
    "packages/engine/src/georgia-pacific-fire-sound-assemblies-source-pack-extraction-gate-a-contract.test.ts"
} as const;

const V12_RERANK_CANDIDATES: readonly V12Candidate[] = [
  {
    currentPosture: "official_gp_resource_context_highest_remaining_source_locator_after_national_gypsum_closeout",
    docOwner: "docs/calculator/SLICE_GEORGIA_PACIFIC_FIRE_SOUND_ASSEMBLIES_SOURCE_PACK_EXTRACTION_PLAN.md",
    executableTestOwner:
      "packages/engine/src/georgia-pacific-fire-sound-assemblies-source-pack-extraction-gate-a-contract.test.ts",
    firstMissingRequirement:
      "resolve_actual_georgia_pacific_fire_resistance_directory_or_test_report_rows_with_exact_assembly_topology_stc_metric_policy_material_alias_mapping_tolerance_owner_negative_boundaries_and_paired_engine_web_visible_tests_before_any_runtime_import",
    id: "georgia_pacific_fire_sound_assemblies",
    protectedNegativeBoundaries: [
      "gp_planning_resource_does_not_count_as_a_runtime_ready_stc_source_row",
      "actual_directory_or_test_report_information_is_required_before_complete_use",
      "gp_context_does_not_override_closed_national_gypsum_usg_rockwool_british_gypsum_knauf_or_existing_lsf_anchors"
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
      sourceLocatorConcrete: false,
      toleranceOwnerNamed: false
    },
    reason:
      "after_national_gypsum_closed_no_runtime_georgia_pacific_is_the_highest_ranked_remaining_official_locator_from_the_post_british_gypsum_source_acquisition_pass_but_it_is_only_suitable_for_no_runtime_locator_and_payload_extraction_because_actual_directory_or_test_report_rows_are_still_missing",
    runtimeBehaviorChange: false,
    selectedNext: true,
    targetFile:
      "packages/engine/src/georgia-pacific-fire-sound-assemblies-source-pack-extraction-gate-a-contract.test.ts",
    userVisibleRisk:
      "georgia_pacific_fire_sound_context_can_look_like_ready_stc_truth_even_though_the_resource_warns_that_actual_directory_or_test_report_information_is_required_for_complete_use",
    validationScope: [
      "georgia_pacific_fire_sound_assemblies_source_pack_extraction_gate_a_contract",
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
      "rights_safe_uris_2006_source_packet_with_page_locators_curve_identity_band_vectors_rating_derivation_uncertainty_chain_of_custody_and_local_material_mapping_to_the_split_rockwool_grouped_topology",
    id: "wall_triple_leaf_uris_2006_source_packet_lane",
    protectedNegativeBoundaries: [
      "rw_41_split_rockwool_screening_result_must_not_be_presented_as_fixed_or_source_validated",
      "georgia_pacific_stc_context_does_not_substitute_for_two_cavity_rockwool_triple_leaf_curves",
      "source_packet_absence_blocks_runtime_even_when_grouped_topology_and_visible_guards_exist"
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
      "the_original_user_defect_remains_important_but_gate_t_left_the_primary_source_packet_absent_so_it_must_stay_paused_while_georgia_pacific_locator_extraction_can_continue_without_runtime_movement",
    runtimeBehaviorChange: false,
    selectedNext: false,
    targetFile: "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md",
    userVisibleRisk:
      "reopening_the_uris_lane_without_the_packet_would_reintroduce_the_original_rockwool_reorder_false_precision_problem",
    validationScope: ["gate_t_handoff_context", "route_source_risk_register"]
  },
  {
    currentPosture: "closed_no_runtime_after_national_gypsum_gate_b_and_gate_c",
    docOwner: "docs/calculator/SLICE_NATIONAL_GYPSUM_FIRE_SOUND_SELECTOR_SOURCE_PACK_EXTRACTION_PLAN.md",
    executableTestOwner:
      "packages/engine/src/post-national-gypsum-fire-sound-selector-source-pack-extraction-v1-next-slice-selection-contract.test.ts",
    firstMissingRequirement:
      "new_national_gypsum_report_payload_curve_metric_owner_material_mapping_tolerance_owner_or_paired_visible_tests_not_already_rejected_by_gate_b_and_gate_c",
    id: "closed_national_gypsum_selector_rows",
    protectedNegativeBoundaries: [
      "v438_w419_w469_w454_and_p540_rows_remain_context_only",
      "stc_report_locators_and_stc_na_do_not_promote_dyn_echo_outputs",
      "fire_shield_soundbreak_exp_shaftliner_glass_fiber_and_resilient_channel_do_not_coalesce_with_generic_routes"
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
      "national_gypsum_gate_b_and_gate_c_already_closed_the_selector_rows_no_runtime_so_reopening_them_now_would_duplicate_a_closed_decision",
    runtimeBehaviorChange: false,
    selectedNext: false,
    targetFile:
      "packages/engine/src/post-national-gypsum-fire-sound-selector-source-pack-extraction-v1-next-slice-selection-contract.test.ts",
    userVisibleRisk:
      "official_selector_rows_can_still_false_promote_stc_report_or_stc_na_context_into_dyn_echo_rw_field_or_route_card_outputs",
    validationScope: ["national_gypsum_gate_b_context", "national_gypsum_gate_c_closeout_context"]
  },
  {
    currentPosture: "closed_no_runtime_after_usg_gate_b_and_gate_c",
    docOwner: "docs/calculator/SLICE_USG_ACOUSTICAL_ASSEMBLIES_SOURCE_PACK_EXTRACTION_PLAN.md",
    executableTestOwner:
      "packages/engine/src/post-usg-acoustical-assemblies-source-pack-extraction-v1-next-slice-selection-contract.test.ts",
    firstMissingRequirement:
      "new_usg_mapping_tolerance_metric_owner_exact_visible_tests_or_row_truth_not_already_rejected_by_usg_gate_b_and_gate_c",
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
      "usg_gate_b_and_gate_c_already_closed_the_rows_no_runtime_so_they_stay_below_the_remaining_georgia_pacific_source_locator",
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
    reason:
      "rockwool_catalog_rows_are_closed_context_and_do_not_become_more_runtime_ready_because_georgia_pacific_is_now_the_next_locator",
    runtimeBehaviorChange: false,
    selectedNext: false,
    targetFile:
      "packages/engine/src/post-rockwool-acoustic-wall-assemblies-source-pack-extraction-v1-next-slice-selection-contract.test.ts",
    userVisibleRisk: "official_rockwool_rows_can_still_false_promote_local_rockwool_and_triple_leaf_routes",
    validationScope: ["rockwool_gate_b_context", "rockwool_gate_c_closeout_context"]
  },
  {
    currentPosture: "closed_no_runtime_after_british_gypsum_gate_b_and_gate_c",
    docOwner: "docs/calculator/SLICE_BRITISH_GYPSUM_WHITE_BOOK_SOURCE_PACK_EXTRACTION_PLAN.md",
    executableTestOwner: "packages/engine/src/british-gypsum-white-book-source-pack-extraction-gate-b-contract.test.ts",
    firstMissingRequirement:
      "new_british_gypsum_mapping_tolerance_metric_owner_or_exact_visible_tests_not_already_rejected_by_british_gypsum_gate_b_and_gate_c",
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
      "british_gypsum_rows_are_closed_context_and_do_not_become_more_ready_after_national_gypsum_closed_no_runtime",
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
      "knauf_field_or_adjacent_metric_context_does_not_promote_usg_national_gypsum_rockwool_or_georgia_pacific_rows"
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
    reason: "the_knauf_mapping_chain_was_already_exhausted_and_has_no_new_v12_source_truth",
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
      "these_families_remain_high_value_but_have_prior_near_misses_or_metric_gaps_and_do_not_outrank_the_remaining_georgia_pacific_source_locator_for_no_runtime_extraction",
    runtimeBehaviorChange: false,
    selectedNext: false,
    targetFile: "docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md",
    userVisibleRisk: "formula_owned_or_near_miss_families_can_look_source_backed_before exact metric and topology requirements are met",
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

describe("calculator source-gap revalidation v12 Gate A contract", () => {
  it("lands v12 Gate A without runtime or visible-surface movement", () => {
    expect(CALCULATOR_SOURCE_GAP_REVALIDATION_V12_GATE_A).toEqual({
      apiShapeChange: false,
      confidencePromotion: false,
      evidencePromotion: false,
      landedGate: "gate_a_revalidate_source_accuracy_gap_order_after_national_gypsum_source_pack_closeout",
      latestClosedSlice: "national_gypsum_fire_sound_selector_source_pack_extraction_v1",
      numericRuntimeBehaviorChange: false,
      outputCardStatusChange: false,
      outputSupportChange: false,
      proposalReportCopyChange: false,
      routeCardValueChange: false,
      runtimeImportSelectedNow: false,
      runtimeTightening: false,
      runtimeWidening: false,
      selectedImplementationSlice: "georgia_pacific_fire_sound_assemblies_source_pack_extraction_v1",
      selectedPlanningSurface:
        "docs/calculator/SLICE_GEORGIA_PACIFIC_FIRE_SOUND_ASSEMBLIES_SOURCE_PACK_EXTRACTION_PLAN.md",
      selectedRouteFamily: "georgia_pacific_fire_sound_assemblies_source_locator_extraction_no_runtime",
      selectionStatus:
        "selected_georgia_pacific_fire_sound_assemblies_source_pack_extraction_after_v12_rerank_found_official_planning_context_but_no_runtime_ready_import",
      sliceId: "calculator_source_gap_revalidation_v12",
      sourceReadyRuntimePackAvailable: false,
      supportPromotion: false,
      targetFirstGateFile:
        "packages/engine/src/georgia-pacific-fire-sound-assemblies-source-pack-extraction-gate-a-contract.test.ts",
      workbenchInputBehaviorChange: false
    });

    for (const path of REQUIRED_PLANNING_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("keeps National Gypsum closeout evidence blocked from runtime import", () => {
    expect(NATIONAL_GYPSUM_CLOSEOUT_SUMMARY.closedRows).toEqual([
      "NATIONAL_GYPSUM_V438_U465_20EQ_RC1_STC50",
      "NATIONAL_GYPSUM_W419_U499_SHAFTWALL_STC44",
      "NATIONAL_GYPSUM_W469_LOAD_BEARING_RC1_STC51",
      "NATIONAL_GYPSUM_W454_AREA_SEPARATION_STC43",
      "NATIONAL_GYPSUM_P540_ROOF_CEILING_STC_NA"
    ]);
    expect(NATIONAL_GYPSUM_CLOSEOUT_SUMMARY.runtimeImportReadyNow).toBe(false);
    expect(NATIONAL_GYPSUM_CLOSEOUT_SUMMARY.metricBlockers).toEqual([
      "STC",
      "acoustical_test_report_locator",
      "STC_NA"
    ]);
    expect(NATIONAL_GYPSUM_CLOSEOUT_SUMMARY.materialAliasBlockers).toContain("glass_fiber");
    expect(NATIONAL_GYPSUM_CLOSEOUT_SUMMARY.materialAliasBlockers).toContain("resilient_channel");
  });

  it("keeps the original Uris 2006 rockwool lane paused instead of calling Rw 41 fixed", () => {
    expect(PAUSED_TRIPLE_LEAF_SOURCE_LANE.sourceLaneDisposition).toBe("paused_waiting_rights_safe_source_packet");
    expect(PAUSED_TRIPLE_LEAF_SOURCE_LANE.currentScreeningAnswer).toBe(
      "multileaf_screening_blend_rw_41_low_confidence"
    );
    expect(PAUSED_TRIPLE_LEAF_SOURCE_LANE.runtimeImportReadyNow).toBe(false);
    expect(PAUSED_TRIPLE_LEAF_SOURCE_LANE.missingPacketArtifacts).toContain("authorized_source_file_or_tdm_payload");
    expect(PAUSED_TRIPLE_LEAF_SOURCE_LANE.missingPacketArtifacts).toContain("band_vector_or_digitization_payload");
    expect(PAUSED_TRIPLE_LEAF_SOURCE_LANE.missingPacketArtifacts).toContain("chain_of_custody_review");
  });

  it("reranks the backlog after National Gypsum closeout with every candidate fail-closed", () => {
    expect(V12_RERANK_CANDIDATES.map((candidate) => candidate.id)).toEqual([
      "georgia_pacific_fire_sound_assemblies",
      "wall_triple_leaf_uris_2006_source_packet_lane",
      "closed_national_gypsum_selector_rows",
      "closed_usg_levelrock_and_steel_partition_rows",
      "closed_rockwool_iss_iws_ess_rows",
      "closed_british_gypsum_rows",
      "closed_knauf_mapping_chain",
      "clt_mass_timber_generated_floor_no_stud_lined_heavy_followups",
      "historical_blocked_or_productization_only_work"
    ]);
    expect(V12_RERANK_CANDIDATES.map((candidate) => candidate.rank)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    expect(new Set(V12_RERANK_CANDIDATES.map((candidate) => candidate.id)).size).toBe(
      V12_RERANK_CANDIDATES.length
    );
    expect(V12_RERANK_CANDIDATES.every((candidate) => candidate.runtimeBehaviorChange === false)).toBe(true);
    expect(V12_RERANK_CANDIDATES.every((candidate) => candidate.readiness.runtimeImportReadyNow === false)).toBe(
      true
    );
    expect(
      V12_RERANK_CANDIDATES.every((candidate) => candidate.readiness.protectedNegativeBoundariesNamed)
    ).toBe(true);
    expect(V12_RERANK_CANDIDATES.every((candidate) => candidate.firstMissingRequirement.length > 80)).toBe(true);
  });

  it("selects Georgia-Pacific extraction as the next no-runtime source step", () => {
    expect(V12_RERANK_CANDIDATES.filter((candidate) => candidate.selectedNext)).toEqual([
      expect.objectContaining({
        id: "georgia_pacific_fire_sound_assemblies",
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
          sourceLocatorConcrete: false,
          toleranceOwnerNamed: false
        }),
        selectedNext: true,
        targetFile:
          "packages/engine/src/georgia-pacific-fire-sound-assemblies-source-pack-extraction-gate-a-contract.test.ts"
      })
    ]);
  });

  it("defines the selected Georgia-Pacific extraction scope without importing STC context", () => {
    expect(SELECTED_GEORGIA_PACIFIC_SOURCE_LOCATOR).toEqual({
      extractionScope: [
        "resource_surface_and_actual_directory_or_test_report_locator_capture",
        "fire_resistance_directory_and_assembly_payload_retrieval_policy",
        "wall_floor_ceiling_roof_family_boundary_matrix",
        "stc_metric_context_only_until_mapping_gate",
        "gp_material_alias_boundary_capture_for_densglass_toughrock_soundbreak_and_generic_gypsum",
        "negative_boundaries_against_closed_national_gypsum_usg_rockwool_british_gypsum_knauf_and_triple_leaf_rows",
        "paired_engine_and_web_visible_test_plan_before_any_runtime_or_visible_movement"
      ],
      firstGate: "gate_a_extract_georgia_pacific_fire_sound_assemblies_rows_without_runtime_import",
      id: "georgia_pacific_fire_sound_assemblies",
      reportedMetrics: ["STC", "fire_resistance_context", "assembly_context_pending_actual_directory_or_test_report"],
      rowExamples: [
        "GP_fire_sound_assembly_context_requires_actual_test_report_before_import",
        "GP_fire_resistance_directory_rows_need_exact_payload_before_import"
      ],
      runtimeImportReadyNow: false,
      selectedPlanningSurface:
        "docs/calculator/SLICE_GEORGIA_PACIFIC_FIRE_SOUND_ASSEMBLIES_SOURCE_PACK_EXTRACTION_PLAN.md",
      sourceUrl: "https://www.buildgp.com/resources/assemblies",
      targetFirstGateFile:
        "packages/engine/src/georgia-pacific-fire-sound-assemblies-source-pack-extraction-gate-a-contract.test.ts"
    });
  });

  it("keeps active docs aligned on the selected Georgia-Pacific source-pack extraction", () => {
    const docs = [
      readRepoFile("AGENTS.md"),
      readRepoFile("docs/calculator/NEXT_IMPLEMENTATION_PLAN.md"),
      readRepoFile("docs/calculator/CURRENT_STATE.md"),
      readRepoFile("docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V12_PLAN.md"),
      readRepoFile(CALCULATOR_SOURCE_GAP_REVALIDATION_V12_GATE_A.selectedPlanningSurface),
      readRepoFile("docs/calculator/CHECKPOINT_2026-05-02_CALCULATOR_SOURCE_GAP_REVALIDATION_V12_GATE_A_HANDOFF.md"),
      readRepoFile("docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md"),
      readRepoFile("docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md"),
      readRepoFile("docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md")
    ];

    for (const doc of docs) {
      expect(doc).toContain(CALCULATOR_SOURCE_GAP_REVALIDATION_V12_GATE_A.selectedImplementationSlice);
      expect(doc).toContain(CALCULATOR_SOURCE_GAP_REVALIDATION_V12_GATE_A.targetFirstGateFile);
      expect(doc).toContain(CALCULATOR_SOURCE_GAP_REVALIDATION_V12_GATE_A.selectionStatus);
      expect(doc).toContain("Georgia-Pacific Fire & Sound Assemblies");
      expect(doc).toContain("gate_a_extract_georgia_pacific_fire_sound_assemblies_rows_without_runtime_import");
      expect(doc).toContain("paused_waiting_rights_safe_source_packet");
      expect(doc).toContain("multileaf_screening_blend");
      expect(doc).toContain("Rw 41");
    }
  });

  it("keeps frozen surfaces and validation expectations explicit", () => {
    const joinedDocs = [
      readRepoFile("docs/calculator/CHECKPOINT_2026-05-02_CALCULATOR_SOURCE_GAP_REVALIDATION_V12_GATE_A_HANDOFF.md"),
      readRepoFile("docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V12_PLAN.md"),
      readRepoFile("docs/calculator/SLICE_GEORGIA_PACIFIC_FIRE_SOUND_ASSEMBLIES_SOURCE_PACK_EXTRACTION_PLAN.md")
    ].join("\n");

    for (const surface of FROZEN_SURFACES) {
      expect(joinedDocs, surface).toContain(surface);
    }

    expect(joinedDocs).toContain(
      "pnpm --filter @dynecho/engine exec vitest run src/calculator-source-gap-revalidation-v12-gate-a-contract.test.ts --maxWorkers=1"
    );
    expect(joinedDocs).toContain("pnpm calculator:gate:current");
    expect(joinedDocs).toContain("git diff --check");
  });
});
