import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

type RuntimeReadiness = {
  dynEchoMetricOwnerNamed: boolean;
  exactLiveTopologyMappingNamed: boolean;
  exactSourceRowsNamed: boolean;
  localMaterialMappingNamed: boolean;
  pairedEngineVisibleTestsNamed: boolean;
  pairedWebVisibleTestsNamed: boolean;
  protectedNegativeBoundariesNamed: boolean;
  rightsSafeCurrentPayloadAvailable: boolean;
  runtimeImportReadyNow: false;
  sourceLocatorConcrete: boolean;
  sourceMetricContextNamed: boolean;
  toleranceOwnerNamed: boolean;
};

type V14Candidate = {
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

const CALCULATOR_SOURCE_GAP_REVALIDATION_V14_GATE_A = {
  apiShapeChange: false,
  confidencePromotion: false,
  evidencePromotion: false,
  landedGate: "gate_a_revalidate_source_accuracy_gap_order_after_pabco_source_pack_closeout",
  latestClosedSlice: "pabco_quietrock_sound_design_guide_source_pack_extraction_v1",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: false,
  outputSupportChange: false,
  proposalReportCopyChange: false,
  routeCardValueChange: false,
  runtimeImportSelectedNow: false,
  runtimeTightening: false,
  runtimeWidening: false,
  selectedImplementationSlice: "certainteed_silentfx_nrc_astc_source_pack_extraction_v1",
  selectedPlanningSurface: "docs/calculator/SLICE_CERTAINTEED_SILENTFX_NRC_ASTC_SOURCE_PACK_EXTRACTION_PLAN.md",
  selectedRouteFamily: "certainteed_silentfx_nrc_astc_source_pack_extraction_no_runtime",
  selectionStatus:
    "selected_certainteed_silentfx_nrc_astc_source_pack_extraction_after_v14_rerank_found_official_astc_product_stc_context_but_no_runtime_ready_import",
  sliceId: "calculator_source_gap_revalidation_v14",
  sourceReadyRuntimePackAvailable: false,
  supportPromotion: false,
  targetFirstGateFile:
    "packages/engine/src/certainteed-silentfx-nrc-astc-source-pack-extraction-gate-a-contract.test.ts",
  workbenchInputBehaviorChange: false
} as const;

const REQUIRED_PLANNING_SURFACES = [
  "packages/engine/src/calculator-source-gap-revalidation-v14-gate-a-contract.test.ts",
  "packages/engine/src/post-pabco-quietrock-sound-design-guide-source-pack-extraction-v1-next-slice-selection-contract.test.ts",
  "packages/engine/src/pabco-quietrock-sound-design-guide-source-pack-extraction-gate-b-contract.test.ts",
  "packages/engine/src/pabco-quietrock-sound-design-guide-source-pack-extraction-gate-a-contract.test.ts",
  "packages/engine/src/calculator-post-georgia-pacific-source-acquisition-gate-a-contract.test.ts",
  "packages/engine/src/calculator-source-gap-revalidation-v13-gate-a-contract.test.ts",
  "packages/engine/src/calculator-route-source-risk-register-contract.test.ts",
  "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V14_PLAN.md",
  "docs/calculator/SLICE_CERTAINTEED_SILENTFX_NRC_ASTC_SOURCE_PACK_EXTRACTION_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-03_CALCULATOR_SOURCE_GAP_REVALIDATION_V14_GATE_A_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-05-03_PABCO_QUIETROCK_SOUND_DESIGN_GUIDE_SOURCE_PACK_EXTRACTION_GATE_C_CLOSEOUT_HANDOFF.md",
  "docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md",
  "docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md",
  "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "AGENTS.md"
] as const;

const PABCO_CLOSEOUT_SUMMARY = {
  closedRows: [
    "PABCO_PGD_W_646_16_QR_ES_WOOD_2X4_16OC_STC41_NOAL17_0730",
    "PABCO_PGD_W_445_16_QR_ES_WOOD_2X4_RC_16OC_STC57_NOAL17_0745",
    "PABCO_PGD_W_449_24_QR530_WOOD_2X4_24OC_THREE_LAYERS_STC57_NRC_TLA_04_035",
    "PABCO_PGD_68_534_16_QR_ES_STEEL_68MIL_RC_16OC_STC50_NOAL18_0611",
    "PABCO_PGD_546_407_16_QR_ES_STEEL_54MIL_RC_16OC_DOUBLE_TYPEX_STC60_NOAL21_0358",
    "PABCO_PGD_W6_467_24_QR530_WOOD_2X6_24OC_STC56_NOAL21_1053"
  ],
  commonMissingRequirements: [
    "downloaded_row_or_report_payload",
    "dyn_echo_metric_owner_for_stc_to_rw_or_field_outputs",
    "local_quietrock_pabco_type_x_glass_fiber_resilient_channel_material_mapping",
    "stud_depth_spacing_gauge_and_bearing_topology_owner",
    "tolerance_owner",
    "paired_engine_and_web_visible_tests"
  ],
  latestStatus:
    "closed_pabco_quietrock_sound_design_guide_source_pack_no_runtime_and_selected_source_gap_revalidation_v14_because_gate_b_found_no_runtime_ready_row",
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
    "paired_engine_and_web_visible_runtime_tests"
  ],
  runtimeImportReadyNow: false,
  sourceLaneDisposition: "paused_waiting_rights_safe_source_packet"
} as const;

const V14_RERANK_CANDIDATES: readonly V14Candidate[] = [
  {
    currentPosture: "official_astc_and_product_stc_context_after_pabco_closeout",
    docOwner: "docs/calculator/SLICE_CERTAINTEED_SILENTFX_NRC_ASTC_SOURCE_PACK_EXTRACTION_PLAN.md",
    executableTestOwner:
      "packages/engine/src/certainteed-silentfx-nrc-astc-source-pack-extraction-gate-a-contract.test.ts",
    firstMissingRequirement:
      "separate_nrc_astc_field_flanking_examples_from_direct_lab_stc_or_rw_rows_then_extract_rights_safe_product_data_rows_metric_policy_topology_material_mapping_tolerance_negative_boundaries_and_paired_visible_tests",
    id: "certainteed_silentfx_nrc_astc_source_pack_extraction",
    protectedNegativeBoundaries: [
      "certainteed_silentfx_astc_field_flanking_examples_do_not_promote_dyn_echo_rw_or_dntw",
      "certainteed_silentfx_product_stc_examples_do_not_promote_runtime_without_metric_topology_tolerance_and_visible_tests",
      "silentfx_and_generic_gypsum_or_quietrock_do_not_coalesce_without_material_mapping_tolerance_owner",
      "certainteed_context_does_not_fix_uris_2006_split_rockwool_rw_41_screening_result"
    ],
    rank: 1,
    readiness: {
      dynEchoMetricOwnerNamed: false,
      exactLiveTopologyMappingNamed: false,
      exactSourceRowsNamed: true,
      localMaterialMappingNamed: false,
      pairedEngineVisibleTestsNamed: false,
      pairedWebVisibleTestsNamed: false,
      protectedNegativeBoundariesNamed: true,
      rightsSafeCurrentPayloadAvailable: true,
      runtimeImportReadyNow: false,
      sourceLocatorConcrete: true,
      sourceMetricContextNamed: true,
      toleranceOwnerNamed: false
    },
    reason:
      "pabco_gate_c_closed_the_rank_1_post_georgia_pacific_locator_no_runtime_so_the_next_concrete_official_locator_is_certainteed_silentfx_nrc_astc_and_product_data_but_its_astc_field_flanking_context_and_product_stc_examples_need_extraction_and_metric_policy_before_any_runtime_movement",
    runtimeBehaviorChange: false,
    selectedNext: true,
    targetFile: "packages/engine/src/certainteed-silentfx-nrc-astc-source-pack-extraction-gate-a-contract.test.ts",
    userVisibleRisk:
      "astc_field_or_product_stc_context_can_look_precise_and_authoritative_enough_to_leak_into_rw_r_w_dntw_or_output_cards_without_metric_policy",
    validationScope: [
      "certainteed_silentfx_nrc_astc_gate_a_contract",
      "source_ready_intake_backlog_refresh",
      "route_source_risk_register_refresh",
      "pnpm_calculator_gate_current",
      "git_diff_check"
    ]
  },
  {
    currentPosture: "authoritative_manual_context_without_rights_safe_current_rows",
    docOwner: "docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md",
    executableTestOwner: "packages/engine/src/calculator-post-georgia-pacific-source-acquisition-gate-a-contract.test.ts",
    firstMissingRequirement:
      "rights_safe_current_ga600_row_payloads_with_exact_design_rows_metric_owner_material_mapping_tolerance_negative_boundaries_and_paired_visible_tests_before_extraction_or_runtime_selection",
    id: "gypsum_association_ga600_2024_context",
    protectedNegativeBoundaries: [
      "ga600_current_manual_context_requires_rights_safe_row_payload_before_extraction_or_runtime",
      "ga600_stc_iic_fire_design_context_does_not_promote_dyn_echo_rw_lnw_or_field_outputs",
      "older_public_ga600_context_does_not_replace_current_rights_safe_rows"
    ],
    rank: 2,
    readiness: {
      dynEchoMetricOwnerNamed: false,
      exactLiveTopologyMappingNamed: false,
      exactSourceRowsNamed: false,
      localMaterialMappingNamed: false,
      pairedEngineVisibleTestsNamed: false,
      pairedWebVisibleTestsNamed: false,
      protectedNegativeBoundariesNamed: true,
      rightsSafeCurrentPayloadAvailable: false,
      runtimeImportReadyNow: false,
      sourceLocatorConcrete: true,
      sourceMetricContextNamed: true,
      toleranceOwnerNamed: false
    },
    reason:
      "ga600_is_authoritative_but_the_current_rights_safe_row_payloads_are_not_available_in_the_calculator_corpus_so_it_stays_below_certainteed_extraction",
    runtimeBehaviorChange: false,
    selectedNext: false,
    targetFile: "docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md",
    userVisibleRisk:
      "ga600_authority_can_make_manual_context_look_runtime_ready_without_current_row_payload_and_metric_policy",
    validationScope: ["post_georgia_pacific_source_acquisition_context", "source_backlog_context"]
  },
  {
    currentPosture: "paused_waiting_rights_safe_source_packet_after_gate_t",
    docOwner: "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md",
    executableTestOwner: "packages/engine/src/wall-triple-leaf-manual-source-packet-handoff-gate-t.test.ts",
    firstMissingRequirement:
      "rights_safe_uris_2006_source_packet_with_curves_or_table_data_rating_derivation_uncertainty_local_material_mapping_runtime_topology_guard_and_paired_visible_tests",
    id: "wall_triple_leaf_uris_2006_source_packet_lane",
    protectedNegativeBoundaries: [
      "rw_41_split_rockwool_screening_result_must_not_be_presented_as_fixed_or_source_validated",
      "certainteed_pabco_and_ga600_context_do_not_substitute_for_uris_two_cavity_rockwool_curves",
      "source_packet_absence_blocks_runtime_even_when_grouped_topology_and_visible_guards_exist"
    ],
    rank: 3,
    readiness: {
      dynEchoMetricOwnerNamed: false,
      exactLiveTopologyMappingNamed: true,
      exactSourceRowsNamed: false,
      localMaterialMappingNamed: false,
      pairedEngineVisibleTestsNamed: true,
      pairedWebVisibleTestsNamed: true,
      protectedNegativeBoundariesNamed: true,
      rightsSafeCurrentPayloadAvailable: false,
      runtimeImportReadyNow: false,
      sourceLocatorConcrete: true,
      sourceMetricContextNamed: false,
      toleranceOwnerNamed: false
    },
    reason:
      "the_original_user_defect_remains_urgent_but_the_source_packet_is_still_absent_so_a_runtime_or_digitization_reopen_would_create_false_precision",
    runtimeBehaviorChange: false,
    selectedNext: false,
    targetFile: "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md",
    userVisibleRisk:
      "reopening_the_uris_lane_without_packet_truth_would_make_the_split_rockwool_reorder_result_look_fixed_while_it_is_still_screening_only",
    validationScope: ["gate_t_handoff_context", "route_source_risk_register"]
  },
  {
    currentPosture: "closed_no_runtime_after_pabco_gate_b_and_gate_c",
    docOwner: "docs/calculator/SLICE_PABCO_QUIETROCK_SOUND_DESIGN_GUIDE_SOURCE_PACK_EXTRACTION_PLAN.md",
    executableTestOwner:
      "packages/engine/src/post-pabco-quietrock-sound-design-guide-source-pack-extraction-v1-next-slice-selection-contract.test.ts",
    firstMissingRequirement:
      "new_pabco_row_or_report_payload_metric_policy_material_mapping_tolerance_owner_or_paired_visible_tests_not_already_rejected_by_gate_b_and_gate_c",
    id: "closed_pabco_quietrock_rows",
    protectedNegativeBoundaries: [
      "pabco_gate_b_source_rows_are_not_runtime_import_approval",
      "pabco_gate_b_stc_values_and_report_locators_do_not_promote_dyn_echo_rw_or_field_outputs",
      "pabco_gate_b_rows_do_not_fix_the_uris_2006_split_rockwool_triple_leaf_rw_41_screening_result"
    ],
    rank: 4,
    readiness: {
      dynEchoMetricOwnerNamed: false,
      exactLiveTopologyMappingNamed: false,
      exactSourceRowsNamed: true,
      localMaterialMappingNamed: false,
      pairedEngineVisibleTestsNamed: false,
      pairedWebVisibleTestsNamed: false,
      protectedNegativeBoundariesNamed: true,
      rightsSafeCurrentPayloadAvailable: false,
      runtimeImportReadyNow: false,
      sourceLocatorConcrete: true,
      sourceMetricContextNamed: true,
      toleranceOwnerNamed: false
    },
    reason:
      "pabco_gate_b_and_gate_c_already_closed_all_rows_no_runtime_so_reopening_them_now_would_duplicate_a_closed_decision_without_new_payload_truth",
    runtimeBehaviorChange: false,
    selectedNext: false,
    targetFile: "packages/engine/src/post-pabco-quietrock-sound-design-guide-source-pack-extraction-v1-next-slice-selection-contract.test.ts",
    userVisibleRisk:
      "official_pabco_stc_rows_can_still_false_promote_quietrock_or_generic_gypsum_wall_outputs_if_reopened_by_proximity",
    validationScope: ["pabco_gate_b_context", "pabco_gate_c_closeout_context"]
  },
  {
    currentPosture: "closed_no_runtime_official_manufacturer_chain",
    docOwner: "docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md",
    executableTestOwner: "packages/engine/src/calculator-route-source-risk-register-contract.test.ts",
    firstMissingRequirement:
      "new_payload_truth_not_already_closed_by_georgia_pacific_national_gypsum_usg_rockwool_british_gypsum_knauf_or_pabco_source_gates",
    id: "closed_georgia_pacific_national_gypsum_usg_rockwool_british_gypsum_knauf_rows",
    protectedNegativeBoundaries: [
      "closed_manufacturer_rows_remain_context_only",
      "stc_oitc_iic_rw_and_field_contexts_do_not_cross_promote_between_route_families",
      "near_source_rows_do_not_override_existing_exact_anchors"
    ],
    rank: 5,
    readiness: {
      dynEchoMetricOwnerNamed: false,
      exactLiveTopologyMappingNamed: false,
      exactSourceRowsNamed: true,
      localMaterialMappingNamed: false,
      pairedEngineVisibleTestsNamed: false,
      pairedWebVisibleTestsNamed: false,
      protectedNegativeBoundariesNamed: true,
      rightsSafeCurrentPayloadAvailable: true,
      runtimeImportReadyNow: false,
      sourceLocatorConcrete: true,
      sourceMetricContextNamed: true,
      toleranceOwnerNamed: false
    },
    reason:
      "the_closed_manufacturer_chain_remains_important_negative_boundary_context_but_none_of_those_rows_gain_new_runtime_readiness_from_pabco_closeout",
    runtimeBehaviorChange: false,
    selectedNext: false,
    targetFile: "docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md",
    userVisibleRisk:
      "near_source_false_promotion_can_make_closed_official_rows_look_more_exact_than_the_live_stack_can_defend",
    validationScope: ["route_source_risk_register", "source_ready_intake_backlog"]
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
    rank: 6,
    readiness: {
      dynEchoMetricOwnerNamed: false,
      exactLiveTopologyMappingNamed: false,
      exactSourceRowsNamed: false,
      localMaterialMappingNamed: false,
      pairedEngineVisibleTestsNamed: false,
      pairedWebVisibleTestsNamed: false,
      protectedNegativeBoundariesNamed: true,
      rightsSafeCurrentPayloadAvailable: true,
      runtimeImportReadyNow: false,
      sourceLocatorConcrete: true,
      sourceMetricContextNamed: false,
      toleranceOwnerNamed: false
    },
    reason:
      "these_families_remain_high_value_but_pabco_closeout_does_not_add_exact_metric_topology_or_material_truth_for_them",
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
    rank: 7,
    readiness: {
      dynEchoMetricOwnerNamed: false,
      exactLiveTopologyMappingNamed: false,
      exactSourceRowsNamed: false,
      localMaterialMappingNamed: false,
      pairedEngineVisibleTestsNamed: false,
      pairedWebVisibleTestsNamed: false,
      protectedNegativeBoundariesNamed: true,
      rightsSafeCurrentPayloadAvailable: true,
      runtimeImportReadyNow: false,
      sourceLocatorConcrete: false,
      sourceMetricContextNamed: false,
      toleranceOwnerNamed: false
    },
    reason:
      "historical_blockers_and_productization_only_work_stay_below_accuracy_source_extraction_when_the_user_priority_is_calculator_correctness_and_coverage",
    runtimeBehaviorChange: false,
    selectedNext: false,
    targetFile: "docs/calculator/SOURCE_GAP_LEDGER.md",
    userVisibleRisk: "workflow_polish_or_old_green_tests_could_be_mistaken_for_broad_high_confidence_coverage",
    validationScope: ["blocked_source_rank_contracts", "internal_use_acceptance_rehearsal"]
  }
] as const;

const SELECTED_CERTAINTEED_SOURCE_PACK_SCOPE = {
  firstGate: "gate_a_extract_certainteed_silentfx_nrc_astc_rows_without_runtime_import",
  requiredArtifacts: [
    "nrc_certainteed_silentfx_astc_report_locator_and_metric_classification",
    "certainteed_silentfx_product_data_stc_row_locator_matrix",
    "astc_field_flanking_versus_lab_stc_or_rw_metric_policy_or_explicit_rejection",
    "local_material_alias_decision_for_silentfx_generic_gypsum_quietrock_and_pabco_type_x_without_coalescing",
    "negative_boundaries_for_uris_2006_split_rockwool_pabco_ga600_closed_manufacturer_rows_and_field_output_leakage",
    "paired_engine_and_web_visible_test_plan_before_any_runtime_or_visible_movement"
  ],
  runtimeBehaviorChange: false,
  selectedPlanningSurface: "docs/calculator/SLICE_CERTAINTEED_SILENTFX_NRC_ASTC_SOURCE_PACK_EXTRACTION_PLAN.md",
  targetFirstGateFile:
    "packages/engine/src/certainteed-silentfx-nrc-astc-source-pack-extraction-gate-a-contract.test.ts"
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

describe("calculator source-gap revalidation v14 Gate A contract", () => {
  it("lands v14 Gate A without runtime or visible-surface movement", () => {
    expect(CALCULATOR_SOURCE_GAP_REVALIDATION_V14_GATE_A).toEqual({
      apiShapeChange: false,
      confidencePromotion: false,
      evidencePromotion: false,
      landedGate: "gate_a_revalidate_source_accuracy_gap_order_after_pabco_source_pack_closeout",
      latestClosedSlice: "pabco_quietrock_sound_design_guide_source_pack_extraction_v1",
      numericRuntimeBehaviorChange: false,
      outputCardStatusChange: false,
      outputSupportChange: false,
      proposalReportCopyChange: false,
      routeCardValueChange: false,
      runtimeImportSelectedNow: false,
      runtimeTightening: false,
      runtimeWidening: false,
      selectedImplementationSlice: "certainteed_silentfx_nrc_astc_source_pack_extraction_v1",
      selectedPlanningSurface:
        "docs/calculator/SLICE_CERTAINTEED_SILENTFX_NRC_ASTC_SOURCE_PACK_EXTRACTION_PLAN.md",
      selectedRouteFamily: "certainteed_silentfx_nrc_astc_source_pack_extraction_no_runtime",
      selectionStatus:
        "selected_certainteed_silentfx_nrc_astc_source_pack_extraction_after_v14_rerank_found_official_astc_product_stc_context_but_no_runtime_ready_import",
      sliceId: "calculator_source_gap_revalidation_v14",
      sourceReadyRuntimePackAvailable: false,
      supportPromotion: false,
      targetFirstGateFile:
        "packages/engine/src/certainteed-silentfx-nrc-astc-source-pack-extraction-gate-a-contract.test.ts",
      workbenchInputBehaviorChange: false
    });

    for (const path of REQUIRED_PLANNING_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("treats PABCO closeout evidence as no-runtime context only", () => {
    expect(PABCO_CLOSEOUT_SUMMARY.closedRows).toHaveLength(6);
    expect(PABCO_CLOSEOUT_SUMMARY.runtimeImportReadyNow).toBe(false);
    expect(PABCO_CLOSEOUT_SUMMARY.commonMissingRequirements).toContain(
      "dyn_echo_metric_owner_for_stc_to_rw_or_field_outputs"
    );
    expect(PABCO_CLOSEOUT_SUMMARY.commonMissingRequirements).toContain(
      "local_quietrock_pabco_type_x_glass_fiber_resilient_channel_material_mapping"
    );
    expect(PABCO_CLOSEOUT_SUMMARY.latestStatus).toBe(
      "closed_pabco_quietrock_sound_design_guide_source_pack_no_runtime_and_selected_source_gap_revalidation_v14_because_gate_b_found_no_runtime_ready_row"
    );
  });

  it("keeps the Uris 2006 split-rockwool lane paused instead of calling Rw 41 fixed", () => {
    expect(PAUSED_TRIPLE_LEAF_SOURCE_LANE.sourceLaneDisposition).toBe("paused_waiting_rights_safe_source_packet");
    expect(PAUSED_TRIPLE_LEAF_SOURCE_LANE.currentScreeningAnswer).toBe(
      "multileaf_screening_blend_rw_41_low_confidence"
    );
    expect(PAUSED_TRIPLE_LEAF_SOURCE_LANE.runtimeImportReadyNow).toBe(false);
    expect(PAUSED_TRIPLE_LEAF_SOURCE_LANE.requiredBeforeRuntime).toContain(
      "authorized_uris_2006_source_file_or_tdm_payload"
    );
    expect(PAUSED_TRIPLE_LEAF_SOURCE_LANE.requiredBeforeRuntime).toContain(
      "local_gypsum_board_rockwool_mlv_and_gypsum_plaster_mapping"
    );
  });

  it("reranks the backlog after PABCO closeout with every candidate fail-closed", () => {
    expect(V14_RERANK_CANDIDATES.map((candidate) => candidate.id)).toEqual([
      "certainteed_silentfx_nrc_astc_source_pack_extraction",
      "gypsum_association_ga600_2024_context",
      "wall_triple_leaf_uris_2006_source_packet_lane",
      "closed_pabco_quietrock_rows",
      "closed_georgia_pacific_national_gypsum_usg_rockwool_british_gypsum_knauf_rows",
      "clt_mass_timber_generated_floor_no_stud_lined_heavy_followups",
      "historical_blocked_or_productization_only_work"
    ]);
    expect(V14_RERANK_CANDIDATES.map((candidate) => candidate.rank)).toEqual([1, 2, 3, 4, 5, 6, 7]);
    expect(new Set(V14_RERANK_CANDIDATES.map((candidate) => candidate.id)).size).toBe(
      V14_RERANK_CANDIDATES.length
    );
    expect(V14_RERANK_CANDIDATES.every((candidate) => candidate.runtimeBehaviorChange === false)).toBe(true);
    expect(V14_RERANK_CANDIDATES.every((candidate) => candidate.readiness.runtimeImportReadyNow === false)).toBe(
      true
    );
    expect(
      V14_RERANK_CANDIDATES.every((candidate) => candidate.readiness.protectedNegativeBoundariesNamed)
    ).toBe(true);
    expect(V14_RERANK_CANDIDATES.every((candidate) => candidate.firstMissingRequirement.length > 90)).toBe(true);
  });

  it("selects CertainTeed SilentFX / NRC ASTC only for no-runtime source-pack extraction", () => {
    expect(V14_RERANK_CANDIDATES.filter((candidate) => candidate.selectedNext)).toEqual([
      expect.objectContaining({
        id: "certainteed_silentfx_nrc_astc_source_pack_extraction",
        rank: 1,
        readiness: expect.objectContaining({
          dynEchoMetricOwnerNamed: false,
          exactLiveTopologyMappingNamed: false,
          exactSourceRowsNamed: true,
          localMaterialMappingNamed: false,
          pairedEngineVisibleTestsNamed: false,
          pairedWebVisibleTestsNamed: false,
          rightsSafeCurrentPayloadAvailable: true,
          runtimeImportReadyNow: false,
          sourceLocatorConcrete: true,
          sourceMetricContextNamed: true,
          toleranceOwnerNamed: false
        }),
        selectedNext: true,
        targetFile:
          "packages/engine/src/certainteed-silentfx-nrc-astc-source-pack-extraction-gate-a-contract.test.ts"
      })
    ]);
  });

  it("defines the selected CertainTeed extraction scope before any runtime movement", () => {
    expect(SELECTED_CERTAINTEED_SOURCE_PACK_SCOPE).toEqual({
      firstGate: "gate_a_extract_certainteed_silentfx_nrc_astc_rows_without_runtime_import",
      requiredArtifacts: [
        "nrc_certainteed_silentfx_astc_report_locator_and_metric_classification",
        "certainteed_silentfx_product_data_stc_row_locator_matrix",
        "astc_field_flanking_versus_lab_stc_or_rw_metric_policy_or_explicit_rejection",
        "local_material_alias_decision_for_silentfx_generic_gypsum_quietrock_and_pabco_type_x_without_coalescing",
        "negative_boundaries_for_uris_2006_split_rockwool_pabco_ga600_closed_manufacturer_rows_and_field_output_leakage",
        "paired_engine_and_web_visible_test_plan_before_any_runtime_or_visible_movement"
      ],
      runtimeBehaviorChange: false,
      selectedPlanningSurface: "docs/calculator/SLICE_CERTAINTEED_SILENTFX_NRC_ASTC_SOURCE_PACK_EXTRACTION_PLAN.md",
      targetFirstGateFile:
        "packages/engine/src/certainteed-silentfx-nrc-astc-source-pack-extraction-gate-a-contract.test.ts"
    });
  });

  it("keeps active docs aligned on the selected CertainTeed no-runtime source-pack extraction", () => {
    const docs = [
      readRepoFile("AGENTS.md"),
      readRepoFile("docs/calculator/NEXT_IMPLEMENTATION_PLAN.md"),
      readRepoFile("docs/calculator/CURRENT_STATE.md"),
      readRepoFile("docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V14_PLAN.md"),
      readRepoFile(CALCULATOR_SOURCE_GAP_REVALIDATION_V14_GATE_A.selectedPlanningSurface),
      readRepoFile("docs/calculator/CHECKPOINT_2026-05-03_CALCULATOR_SOURCE_GAP_REVALIDATION_V14_GATE_A_HANDOFF.md"),
      readRepoFile("docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md"),
      readRepoFile("docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md"),
      readRepoFile("docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md")
    ];

    for (const doc of docs) {
      expect(doc).toContain(CALCULATOR_SOURCE_GAP_REVALIDATION_V14_GATE_A.selectedImplementationSlice);
      expect(doc).toContain(CALCULATOR_SOURCE_GAP_REVALIDATION_V14_GATE_A.targetFirstGateFile);
      expect(doc).toContain(CALCULATOR_SOURCE_GAP_REVALIDATION_V14_GATE_A.selectionStatus);
      expect(doc).toContain("CertainTeed SilentFX NRC ASTC");
      expect(doc).toContain("gate_a_extract_certainteed_silentfx_nrc_astc_rows_without_runtime_import");
      expect(doc).toContain("paused_waiting_rights_safe_source_packet");
      expect(doc).toContain("multileaf_screening_blend");
      expect(doc).toContain("Rw 41");
    }
  });

  it("keeps frozen surfaces and validation expectations explicit", () => {
    const joinedDocs = [
      readRepoFile("docs/calculator/CHECKPOINT_2026-05-03_CALCULATOR_SOURCE_GAP_REVALIDATION_V14_GATE_A_HANDOFF.md"),
      readRepoFile("docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V14_PLAN.md"),
      readRepoFile("docs/calculator/SLICE_CERTAINTEED_SILENTFX_NRC_ASTC_SOURCE_PACK_EXTRACTION_PLAN.md")
    ].join("\n");

    for (const surface of FROZEN_SURFACES) {
      expect(joinedDocs, surface).toContain(surface);
    }

    expect(joinedDocs).toContain(
      "pnpm --filter @dynecho/engine exec vitest run src/calculator-source-gap-revalidation-v14-gate-a-contract.test.ts --maxWorkers=1"
    );
    expect(joinedDocs).toContain("pnpm calculator:gate:current");
    expect(joinedDocs).toContain("git diff --check");
  });
});
