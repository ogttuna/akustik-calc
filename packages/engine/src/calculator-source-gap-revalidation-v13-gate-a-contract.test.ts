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

type V13Candidate = {
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

const CALCULATOR_SOURCE_GAP_REVALIDATION_V13_GATE_A = {
  apiShapeChange: false,
  confidencePromotion: false,
  evidencePromotion: false,
  landedGate: "gate_a_revalidate_source_accuracy_gap_order_after_georgia_pacific_source_pack_closeout",
  latestClosedSlice: "georgia_pacific_fire_sound_assemblies_source_pack_extraction_v1",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: false,
  outputSupportChange: false,
  proposalReportCopyChange: false,
  routeCardValueChange: false,
  runtimeImportSelectedNow: false,
  runtimeTightening: false,
  runtimeWidening: false,
  selectedImplementationSlice: "calculator_post_georgia_pacific_source_acquisition_v1",
  selectedPlanningSurface: "docs/calculator/SLICE_CALCULATOR_POST_GEORGIA_PACIFIC_SOURCE_ACQUISITION_V1_PLAN.md",
  selectedRouteFamily: "post_georgia_pacific_source_locator_acquisition_no_runtime",
  selectionStatus:
    "selected_post_georgia_pacific_source_acquisition_v1_after_v13_rerank_found_no_runtime_ready_candidate_and_post_british_gypsum_official_locators_closed_no_runtime",
  sliceId: "calculator_source_gap_revalidation_v13",
  sourceReadyRuntimePackAvailable: false,
  supportPromotion: false,
  targetFirstGateFile: "packages/engine/src/calculator-post-georgia-pacific-source-acquisition-gate-a-contract.test.ts",
  workbenchInputBehaviorChange: false
} as const;

const REQUIRED_PLANNING_SURFACES = [
  "packages/engine/src/calculator-source-gap-revalidation-v13-gate-a-contract.test.ts",
  "packages/engine/src/post-georgia-pacific-fire-sound-assemblies-source-pack-extraction-v1-next-slice-selection-contract.test.ts",
  "packages/engine/src/georgia-pacific-fire-sound-assemblies-source-pack-extraction-gate-b-contract.test.ts",
  "packages/engine/src/georgia-pacific-fire-sound-assemblies-source-pack-extraction-gate-a-contract.test.ts",
  "packages/engine/src/calculator-source-gap-revalidation-v12-gate-a-contract.test.ts",
  "packages/engine/src/post-national-gypsum-fire-sound-selector-source-pack-extraction-v1-next-slice-selection-contract.test.ts",
  "packages/engine/src/post-usg-acoustical-assemblies-source-pack-extraction-v1-next-slice-selection-contract.test.ts",
  "packages/engine/src/post-rockwool-acoustic-wall-assemblies-source-pack-extraction-v1-next-slice-selection-contract.test.ts",
  "packages/engine/src/calculator-post-british-gypsum-source-acquisition-gate-a-contract.test.ts",
  "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V13_PLAN.md",
  "docs/calculator/SLICE_CALCULATOR_POST_GEORGIA_PACIFIC_SOURCE_ACQUISITION_V1_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-02_CALCULATOR_SOURCE_GAP_REVALIDATION_V13_GATE_A_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-05-02_GEORGIA_PACIFIC_FIRE_SOUND_ASSEMBLIES_SOURCE_PACK_EXTRACTION_GATE_C_CLOSEOUT_HANDOFF.md",
  "docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md",
  "docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md",
  "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "AGENTS.md"
] as const;

const POST_BRITISH_GYPSUM_OFFICIAL_LOCATOR_CLOSEOUT_SUMMARY = {
  closedSlices: [
    "rockwool_acoustic_wall_assemblies_source_pack_extraction_v1",
    "usg_acoustical_assemblies_source_pack_extraction_v1",
    "national_gypsum_fire_sound_selector_source_pack_extraction_v1",
    "georgia_pacific_fire_sound_assemblies_source_pack_extraction_v1"
  ],
  closedStatuses: [
    "closed_rockwool_acoustic_wall_assemblies_source_pack_no_runtime_and_selected_source_gap_revalidation_v10_because_gate_b_found_no_runtime_ready_row",
    "closed_usg_acoustical_assemblies_source_pack_no_runtime_and_selected_source_gap_revalidation_v11_because_gate_b_found_no_runtime_ready_row",
    "closed_national_gypsum_fire_sound_selector_source_pack_no_runtime_and_selected_source_gap_revalidation_v12_because_gate_b_found_no_runtime_ready_row",
    "closed_georgia_pacific_fire_sound_assemblies_source_pack_no_runtime_and_selected_source_gap_revalidation_v13_because_gate_b_found_no_runtime_ready_row"
  ],
  commonMissingRequirements: [
    "exact_runtime_topology_mapping",
    "source_owned_metric_policy_or_full_band_curve",
    "local_material_alias_mapping",
    "tolerance_owner",
    "protected_negative_boundaries",
    "paired_engine_and_web_visible_tests"
  ],
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

const V13_RERANK_CANDIDATES: readonly V13Candidate[] = [
  {
    currentPosture: "official_locator_reservoir_exhausted_after_georgia_pacific_closeout",
    docOwner: "docs/calculator/SLICE_CALCULATOR_POST_GEORGIA_PACIFIC_SOURCE_ACQUISITION_V1_PLAN.md",
    executableTestOwner: "packages/engine/src/calculator-post-georgia-pacific-source-acquisition-gate-a-contract.test.ts",
    firstMissingRequirement:
      "fresh_rights_safe_source_locators_or_source_packets_with_exact_topology_metric_policy_tolerance_material_mapping_negative_boundaries_and_paired_visible_test_ownership",
    id: "calculator_post_georgia_pacific_source_acquisition",
    protectedNegativeBoundaries: [
      "closed_georgia_pacific_national_gypsum_usg_rockwool_british_gypsum_and_knauf_rows_remain_context_only",
      "paused_uris_2006_lane_does_not_promote_rw_41_screening_without_rights_safe_packet",
      "clt_floor_no_stud_lined_heavy_and_historical_routes_do_not_reopen_from_nearby_green_tests"
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
      "georgia_pacific_gate_b_and_gate_c_closed_the_last_post_british_gypsum_official_locator_no_runtime_the_uris_2006_source_lane_is_still_paused_for_packet_access_and_closed_manufacturer_rows_do_not_become_runtime_ready_by_proximity_so_the_next_accuracy_step_is_a_new_bounded_source_acquisition_pass",
    runtimeBehaviorChange: false,
    selectedNext: true,
    targetFile: "packages/engine/src/calculator-post-georgia-pacific-source-acquisition-gate-a-contract.test.ts",
    userVisibleRisk:
      "without_new_source_acquisition_the_project_would_keep_reranking_exhausted_near_sources_or_reopen_the_rockwool_defect_without_the_source_packet_needed_for_a_defensible_fix",
    validationScope: [
      "post_georgia_pacific_source_acquisition_gate_a_contract",
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
      "georgia_pacific_national_gypsum_usg_and_rockwool_stc_context_do_not_substitute_for_uris_two_cavity_curves",
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
      "the_original_user_defect_remains_the_urgent_correctness_problem_but_gate_t_left_the_primary_source_packet_absent_so_reopening_runtime_now_would_reintroduce_the_false_precision_that_the_slice_is_trying_to remove",
    runtimeBehaviorChange: false,
    selectedNext: false,
    targetFile: "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md",
    userVisibleRisk:
      "reopening_the_uris_lane_without_the_packet_would_make_the_split_rockwool_reorder_result_look_fixed_while_it_is_still_screening_only",
    validationScope: ["gate_t_handoff_context", "route_source_risk_register"]
  },
  {
    currentPosture: "closed_no_runtime_after_georgia_pacific_gate_b_and_gate_c",
    docOwner: "docs/calculator/SLICE_GEORGIA_PACIFIC_FIRE_SOUND_ASSEMBLIES_SOURCE_PACK_EXTRACTION_PLAN.md",
    executableTestOwner:
      "packages/engine/src/post-georgia-pacific-fire-sound-assemblies-source-pack-extraction-v1-next-slice-selection-contract.test.ts",
    firstMissingRequirement:
      "new_georgia_pacific_directory_or_test_report_payload_metric_policy_material_mapping_tolerance_owner_or_paired_visible_tests_not_already_rejected_by_gate_b_and_gate_c",
    id: "closed_georgia_pacific_rows",
    protectedNegativeBoundaries: [
      "gp_stc_ranges_are_not_single_rw_values",
      "gp_sound_report_numbers_are_locators_not_full_band_curves",
      "gp_exterior_sheathing_shaftwall_and_area_separation_rows_do_not_promote_generic_wall_routes"
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
      "georgia_pacific_gate_b_and_gate_c_already_closed_the_rows_no_runtime_so_reopening_them_now_would_duplicate_a_closed_decision_without_new_payload_truth",
    runtimeBehaviorChange: false,
    selectedNext: false,
    targetFile:
      "packages/engine/src/post-georgia-pacific-fire-sound-assemblies-source-pack-extraction-v1-next-slice-selection-contract.test.ts",
    userVisibleRisk:
      "official_gp_fire_sound_context_can_still_false_promote_stc_planning_rows_into_dyn_echo_rw_field_or_route_card_outputs",
    validationScope: ["georgia_pacific_gate_b_context", "georgia_pacific_gate_c_closeout_context"]
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
      "national_gypsum_gate_b_and_gate_c_already_closed_the_selector_rows_no_runtime_and_georgia_pacific_closeout_does_not_add_new_selector_payload_truth",
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
      "usg_gate_b_and_gate_c_already_closed_the_rows_no_runtime_so_they_stay_below_a_fresh_post_georgia_pacific_source_acquisition_pass",
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
      "rockwool_catalog_rows_are_closed_context_and_do_not_become_more_runtime_ready_because_georgia_pacific_later_closed_no_runtime",
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
    rank: 7,
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
      "british_gypsum_rows_are_closed_context_and_do_not_become_more_ready_after_the_later_post_british_gypsum_official_locators_closed_no_runtime",
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
    rank: 8,
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
    reason: "the_knauf_mapping_chain_was_already_exhausted_and_has_no_new_v13_source_truth",
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
      sourceLocatorConcrete: true,
      toleranceOwnerNamed: false
    },
    reason:
      "these_families_remain_high_value_but_prior_near_misses_or_metric_gaps_do_not_outrank_a_fresh_source_acquisition_pass_after_the_known_official_locator_set_closed_no_runtime",
    runtimeBehaviorChange: false,
    selectedNext: false,
    targetFile: "docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md",
    userVisibleRisk:
      "formula_owned_or_near_miss_families_can_look_source_backed_before_exact_metric_and_topology_requirements_are_met",
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
    rank: 10,
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
      "historical_blockers_and_productization_only_work_stay_below_accuracy_source_acquisition_when_the_user_priority_is_calculator_correctness_and_coverage",
    runtimeBehaviorChange: false,
    selectedNext: false,
    targetFile: "docs/calculator/SOURCE_GAP_LEDGER.md",
    userVisibleRisk: "workflow_polish_or_old_green_tests_could_be_mistaken_for_broad_high_confidence_coverage",
    validationScope: ["blocked_source_rank_contracts", "internal_use_acceptance_rehearsal"]
  }
] as const;

const SELECTED_POST_GEORGIA_PACIFIC_SOURCE_ACQUISITION_SCOPE = {
  firstGate: "gate_a_acquire_and_classify_post_georgia_pacific_source_locators_without_runtime_import",
  requiredArtifacts: [
    "official_source_locator_matrix_after_rockwool_usg_national_gypsum_georgia_pacific_british_gypsum_knauf_and_uris_lane_closeouts",
    "rights_safe_source_packet_or_url_locator_policy_for_rockwool_triple_leaf_two_cavity_and_other_high_value_families",
    "candidate_eligibility_rules_for_exact_topology_metric_tolerance_material_negative_boundary_and_visible_test_ownership",
    "per_family_source_search_targets_for_clt_mass_timber_generated_floor_no_stud_lined_heavy_double_board_wall_floor_and_field_output_metric_policy",
    "explicit_rejection_rules_for_closed_georgia_pacific_national_gypsum_usg_rockwool_british_gypsum_knauf_and_historical_blockers",
    "selected_next_extraction_mapping_or_source_packet_slice_only_if_a_concrete_locator_or_packet_becomes_ready",
    "validation_scope_with_targeted_contract_current_gate_and_git_diff_check"
  ],
  runtimeBehaviorChange: false,
  selectedPlanningSurface: "docs/calculator/SLICE_CALCULATOR_POST_GEORGIA_PACIFIC_SOURCE_ACQUISITION_V1_PLAN.md",
  targetFirstGateFile: "packages/engine/src/calculator-post-georgia-pacific-source-acquisition-gate-a-contract.test.ts"
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

describe("calculator source-gap revalidation v13 Gate A contract", () => {
  it("lands v13 Gate A without runtime or visible-surface movement", () => {
    expect(CALCULATOR_SOURCE_GAP_REVALIDATION_V13_GATE_A).toEqual({
      apiShapeChange: false,
      confidencePromotion: false,
      evidencePromotion: false,
      landedGate: "gate_a_revalidate_source_accuracy_gap_order_after_georgia_pacific_source_pack_closeout",
      latestClosedSlice: "georgia_pacific_fire_sound_assemblies_source_pack_extraction_v1",
      numericRuntimeBehaviorChange: false,
      outputCardStatusChange: false,
      outputSupportChange: false,
      proposalReportCopyChange: false,
      routeCardValueChange: false,
      runtimeImportSelectedNow: false,
      runtimeTightening: false,
      runtimeWidening: false,
      selectedImplementationSlice: "calculator_post_georgia_pacific_source_acquisition_v1",
      selectedPlanningSurface:
        "docs/calculator/SLICE_CALCULATOR_POST_GEORGIA_PACIFIC_SOURCE_ACQUISITION_V1_PLAN.md",
      selectedRouteFamily: "post_georgia_pacific_source_locator_acquisition_no_runtime",
      selectionStatus:
        "selected_post_georgia_pacific_source_acquisition_v1_after_v13_rerank_found_no_runtime_ready_candidate_and_post_british_gypsum_official_locators_closed_no_runtime",
      sliceId: "calculator_source_gap_revalidation_v13",
      sourceReadyRuntimePackAvailable: false,
      supportPromotion: false,
      targetFirstGateFile:
        "packages/engine/src/calculator-post-georgia-pacific-source-acquisition-gate-a-contract.test.ts",
      workbenchInputBehaviorChange: false
    });

    for (const path of REQUIRED_PLANNING_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("treats the post-British-Gypsum official locator chain as closed no-runtime", () => {
    expect(POST_BRITISH_GYPSUM_OFFICIAL_LOCATOR_CLOSEOUT_SUMMARY.closedSlices).toEqual([
      "rockwool_acoustic_wall_assemblies_source_pack_extraction_v1",
      "usg_acoustical_assemblies_source_pack_extraction_v1",
      "national_gypsum_fire_sound_selector_source_pack_extraction_v1",
      "georgia_pacific_fire_sound_assemblies_source_pack_extraction_v1"
    ]);
    expect(POST_BRITISH_GYPSUM_OFFICIAL_LOCATOR_CLOSEOUT_SUMMARY.runtimeImportReadyNow).toBe(false);
    expect(POST_BRITISH_GYPSUM_OFFICIAL_LOCATOR_CLOSEOUT_SUMMARY.commonMissingRequirements).toContain(
      "source_owned_metric_policy_or_full_band_curve"
    );
    expect(POST_BRITISH_GYPSUM_OFFICIAL_LOCATOR_CLOSEOUT_SUMMARY.commonMissingRequirements).toContain(
      "paired_engine_and_web_visible_tests"
    );
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

  it("reranks the backlog after Georgia-Pacific closeout with every candidate fail-closed", () => {
    expect(V13_RERANK_CANDIDATES.map((candidate) => candidate.id)).toEqual([
      "calculator_post_georgia_pacific_source_acquisition",
      "wall_triple_leaf_uris_2006_source_packet_lane",
      "closed_georgia_pacific_rows",
      "closed_national_gypsum_selector_rows",
      "closed_usg_levelrock_and_steel_partition_rows",
      "closed_rockwool_iss_iws_ess_rows",
      "closed_british_gypsum_rows",
      "closed_knauf_mapping_chain",
      "clt_mass_timber_generated_floor_no_stud_lined_heavy_followups",
      "historical_blocked_or_productization_only_work"
    ]);
    expect(V13_RERANK_CANDIDATES.map((candidate) => candidate.rank)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    expect(new Set(V13_RERANK_CANDIDATES.map((candidate) => candidate.id)).size).toBe(
      V13_RERANK_CANDIDATES.length
    );
    expect(V13_RERANK_CANDIDATES.every((candidate) => candidate.runtimeBehaviorChange === false)).toBe(true);
    expect(V13_RERANK_CANDIDATES.every((candidate) => candidate.readiness.runtimeImportReadyNow === false)).toBe(
      true
    );
    expect(
      V13_RERANK_CANDIDATES.every((candidate) => candidate.readiness.protectedNegativeBoundariesNamed)
    ).toBe(true);
    expect(V13_RERANK_CANDIDATES.every((candidate) => candidate.firstMissingRequirement.length > 90)).toBe(true);
  });

  it("selects post-Georgia-Pacific source acquisition as the next no-runtime accuracy step", () => {
    expect(V13_RERANK_CANDIDATES.filter((candidate) => candidate.selectedNext)).toEqual([
      expect.objectContaining({
        id: "calculator_post_georgia_pacific_source_acquisition",
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
        targetFile: "packages/engine/src/calculator-post-georgia-pacific-source-acquisition-gate-a-contract.test.ts"
      })
    ]);
  });

  it("defines the selected post-Georgia-Pacific acquisition scope without importing nearby source context", () => {
    expect(SELECTED_POST_GEORGIA_PACIFIC_SOURCE_ACQUISITION_SCOPE).toEqual({
      firstGate: "gate_a_acquire_and_classify_post_georgia_pacific_source_locators_without_runtime_import",
      requiredArtifacts: [
        "official_source_locator_matrix_after_rockwool_usg_national_gypsum_georgia_pacific_british_gypsum_knauf_and_uris_lane_closeouts",
        "rights_safe_source_packet_or_url_locator_policy_for_rockwool_triple_leaf_two_cavity_and_other_high_value_families",
        "candidate_eligibility_rules_for_exact_topology_metric_tolerance_material_negative_boundary_and_visible_test_ownership",
        "per_family_source_search_targets_for_clt_mass_timber_generated_floor_no_stud_lined_heavy_double_board_wall_floor_and_field_output_metric_policy",
        "explicit_rejection_rules_for_closed_georgia_pacific_national_gypsum_usg_rockwool_british_gypsum_knauf_and_historical_blockers",
        "selected_next_extraction_mapping_or_source_packet_slice_only_if_a_concrete_locator_or_packet_becomes_ready",
        "validation_scope_with_targeted_contract_current_gate_and_git_diff_check"
      ],
      runtimeBehaviorChange: false,
      selectedPlanningSurface: "docs/calculator/SLICE_CALCULATOR_POST_GEORGIA_PACIFIC_SOURCE_ACQUISITION_V1_PLAN.md",
      targetFirstGateFile:
        "packages/engine/src/calculator-post-georgia-pacific-source-acquisition-gate-a-contract.test.ts"
    });
  });

  it("keeps active docs aligned on the selected post-Georgia-Pacific source acquisition", () => {
    const docs = [
      readRepoFile("AGENTS.md"),
      readRepoFile("docs/calculator/NEXT_IMPLEMENTATION_PLAN.md"),
      readRepoFile("docs/calculator/CURRENT_STATE.md"),
      readRepoFile("docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V13_PLAN.md"),
      readRepoFile(CALCULATOR_SOURCE_GAP_REVALIDATION_V13_GATE_A.selectedPlanningSurface),
      readRepoFile("docs/calculator/CHECKPOINT_2026-05-02_CALCULATOR_SOURCE_GAP_REVALIDATION_V13_GATE_A_HANDOFF.md"),
      readRepoFile("docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md"),
      readRepoFile("docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md"),
      readRepoFile("docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md")
    ];

    for (const doc of docs) {
      expect(doc).toContain(CALCULATOR_SOURCE_GAP_REVALIDATION_V13_GATE_A.selectedImplementationSlice);
      expect(doc).toContain(CALCULATOR_SOURCE_GAP_REVALIDATION_V13_GATE_A.targetFirstGateFile);
      expect(doc).toContain(CALCULATOR_SOURCE_GAP_REVALIDATION_V13_GATE_A.selectionStatus);
      expect(doc).toContain("post-Georgia-Pacific source acquisition");
      expect(doc).toContain("gate_a_acquire_and_classify_post_georgia_pacific_source_locators_without_runtime_import");
      expect(doc).toContain("paused_waiting_rights_safe_source_packet");
      expect(doc).toContain("multileaf_screening_blend");
      expect(doc).toContain("Rw 41");
    }
  });

  it("keeps frozen surfaces and validation expectations explicit", () => {
    const joinedDocs = [
      readRepoFile("docs/calculator/CHECKPOINT_2026-05-02_CALCULATOR_SOURCE_GAP_REVALIDATION_V13_GATE_A_HANDOFF.md"),
      readRepoFile("docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V13_PLAN.md"),
      readRepoFile("docs/calculator/SLICE_CALCULATOR_POST_GEORGIA_PACIFIC_SOURCE_ACQUISITION_V1_PLAN.md")
    ].join("\n");

    for (const surface of FROZEN_SURFACES) {
      expect(joinedDocs, surface).toContain(surface);
    }

    expect(joinedDocs).toContain(
      "pnpm --filter @dynecho/engine exec vitest run src/calculator-source-gap-revalidation-v13-gate-a-contract.test.ts --maxWorkers=1"
    );
    expect(joinedDocs).toContain("pnpm calculator:gate:current");
    expect(joinedDocs).toContain("git diff --check");
  });
});
