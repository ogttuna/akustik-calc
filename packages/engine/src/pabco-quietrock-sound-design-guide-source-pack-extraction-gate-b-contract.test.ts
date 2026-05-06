import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

type PabcoGateBDecision = "block_immediate_runtime_import" | "keep_context_only";

type PabcoGateBRowDecision = {
  blockedTargetOutputs: readonly string[];
  currentImplementationFit:
    | "pgd_w_646_16_adjacent_wood_stud_single_cavity_not_existing_timber_anchor"
    | "pgd_w_445_16_resilient_channel_side_not_generic_timber_or_resilient_bar_anchor"
    | "pgd_w_449_24_indexed_payload_missing_and_quietrock_530_multilayer_not_nrc_triple_leaf"
    | "pgd_68_534_16_68mil_steel_rc_not_existing_lsf_anchor"
    | "pgd_546_407_16_54mil_steel_rc_high_stc_not_field_or_lsf_anchor"
    | "pgd_w6_467_24_quietrock_530_2x6_not_generic_wood_stud_route";
  family:
    | "steel_stud_quietrock_resilient_channel_wall"
    | "wood_stud_quietrock_530_wall"
    | "wood_stud_quietrock_es_resilient_channel_wall"
    | "wood_stud_quietrock_es_single_stud_wall"
    | "wood_stud_quietrock_multilayer_wall";
  firstMissingRequirement: string;
  gateBDecision: PabcoGateBDecision;
  localMaterialMapping:
    | "blocked_quietrock_es_pabco_type_x_glass_fiber_and_wood_stud_mapping_missing"
    | "blocked_quietrock_es_pabco_type_x_resilient_channel_glass_fiber_and_wood_stud_mapping_missing"
    | "blocked_quietrock_530_multilayer_glass_fiber_and_indexed_payload_mapping_missing"
    | "blocked_quietrock_es_pabco_type_x_resilient_channel_glass_fiber_and_steel_gauge_mapping_missing"
    | "blocked_quietrock_530_glass_fiber_and_2x6_wood_mapping_missing";
  metricOwner:
    | "stc_static_without_iso_rw_curve_or_rejection_owner"
    | "stc_report_locator_without_payload_or_curve_owner"
    | "field_outputs_without_iso_12354_overlay_owner";
  protectedBoundary: string;
  requiredEngineTestsBeforeRuntime: readonly string[];
  requiredWebTestsBeforeRuntimeIfVisible: readonly string[];
  rowId: string;
  runtimeImportReadyNow: false;
  selectedRuntimeImportNow: false;
  sourceUrl: string;
  stc: number;
  toleranceOwnerNamed: false;
};

type PabcoMetricDecision = {
  blockedTargets: readonly string[];
  firstMissingRequirement: string;
  metricContext: "field_outputs" | "report_locator" | "source_stc" | "tolerance_policy";
  runtimeOutputReadyNow: false;
};

const PABCO_GATE_B = {
  apiShapeChange: false,
  confidencePromotion: false,
  evidencePromotion: false,
  landedGate: "gate_b_mapping_tolerance_decision_no_runtime",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: false,
  outputSupportChange: false,
  previousGate: "gate_a_extract_pabco_quietrock_sound_design_guide_rows_without_runtime_import",
  proposalReportCopyChange: false,
  routeCardValueChange: false,
  runtimeImportReadyNow: false,
  runtimeImportSelectedNow: false,
  runtimeTightening: false,
  runtimeWidening: false,
  selectedNextAction: "gate_c_closeout_and_next_slice_selection_no_runtime",
  sliceId: "pabco_quietrock_sound_design_guide_source_pack_extraction_v1",
  status: "pabco_gate_b_found_no_runtime_ready_row_selected_closeout",
  supportPromotion: false,
  targetNextGateFile:
    "packages/engine/src/post-pabco-quietrock-sound-design-guide-source-pack-extraction-v1-next-slice-selection-contract.test.ts",
  workbenchInputBehaviorChange: false
} as const;

const SOURCE_URLS = [
  "https://go.pabcogypsum.com/tsdg",
  "https://quietrock.com/resources/sound-control-assembly-selector/",
  "https://pabcogypsum.com/resources/sound-control-assembly-selector/pgd-w-646-16/",
  "https://pabcogypsum.com/resources/sound-control-assembly-selector/pgd-w-445-16/",
  "https://pabcogypsum.com/resources/sound-control-assembly-selector/pgd-w-449-24/",
  "https://pabcogypsum.com/resources/sound-control-assembly-selector/pgd-68-534-16/",
  "https://pabcogypsum.com/resources/sound-control-assembly-selector/pgd-546-407-16/",
  "https://pabcogypsum.com/resources/sound-control-assembly-selector/pgd-w6-467-24/"
] as const;

const REQUIRED_DOCS = [
  "AGENTS.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md",
  "docs/calculator/SLICE_PABCO_QUIETROCK_SOUND_DESIGN_GUIDE_SOURCE_PACK_EXTRACTION_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-03_PABCO_QUIETROCK_SOUND_DESIGN_GUIDE_SOURCE_PACK_EXTRACTION_GATE_B_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-05-03_PABCO_QUIETROCK_SOUND_DESIGN_GUIDE_SOURCE_PACK_EXTRACTION_GATE_A_HANDOFF.md",
  "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md",
  "docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md"
] as const;

const GATE_B_ROW_DECISIONS: readonly PabcoGateBRowDecision[] = [
  {
    blockedTargetOutputs: ["Rw", "R'w", "Dn,w", "DnT,w", "DnT,A", "STC_as_DynEcho_Rw"],
    currentImplementationFit: "pgd_w_646_16_adjacent_wood_stud_single_cavity_not_existing_timber_anchor",
    family: "wood_stud_quietrock_es_single_stud_wall",
    firstMissingRequirement:
      "pabco_pgd_w_646_16_needs_downloaded_summary_report_payload_or_source_curve_metric_owner_quietrock_es_pabco_type_x_glass_fiber_mapping_tolerance_owner_and_timber_anchor_precedence_tests",
    gateBDecision: "block_immediate_runtime_import",
    localMaterialMapping: "blocked_quietrock_es_pabco_type_x_glass_fiber_and_wood_stud_mapping_missing",
    metricOwner: "stc_static_without_iso_rw_curve_or_rejection_owner",
    protectedBoundary: "pabco_pgd_w_646_16_gate_b_stc41_does_not_replace_existing_timber_or_generic_wood_stud_routes",
    requiredEngineTestsBeforeRuntime: [
      "engine_pabco_pgd_w_646_16_value_or_rejection_pin",
      "engine_pabco_pgd_w_646_16_rejects_generic_timber_or_wood_stud_anchor_replacement"
    ],
    requiredWebTestsBeforeRuntimeIfVisible: [
      "web_pabco_pgd_w_646_16_route_card_source_context",
      "web_pabco_pgd_w_646_16_report_blocks_stc_to_rw_copy"
    ],
    rowId: "PABCO_PGD_W_646_16_QR_ES_WOOD_2X4_16OC_STC41_NOAL17_0730",
    runtimeImportReadyNow: false,
    selectedRuntimeImportNow: false,
    sourceUrl: SOURCE_URLS[2],
    stc: 41,
    toleranceOwnerNamed: false
  },
  {
    blockedTargetOutputs: ["Rw", "R'w", "Dn,w", "DnT,w", "DnT,A", "resilient_channel_as_generic_resilient_bar"],
    currentImplementationFit: "pgd_w_445_16_resilient_channel_side_not_generic_timber_or_resilient_bar_anchor",
    family: "wood_stud_quietrock_es_resilient_channel_wall",
    firstMissingRequirement:
      "pabco_pgd_w_445_16_needs_summary_report_payload_resilient_channel_side_policy_quietrock_es_type_x_glass_fiber_mapping_metric_owner_tolerance_owner_and_visible_tests",
    gateBDecision: "block_immediate_runtime_import",
    localMaterialMapping:
      "blocked_quietrock_es_pabco_type_x_resilient_channel_glass_fiber_and_wood_stud_mapping_missing",
    metricOwner: "stc_static_without_iso_rw_curve_or_rejection_owner",
    protectedBoundary:
      "pabco_pgd_w_445_16_gate_b_resilient_channel_stc57_does_not_promote_dyn_echo_rw_or_generic_resilient_bar",
    requiredEngineTestsBeforeRuntime: [
      "engine_pabco_pgd_w_445_16_value_or_rejection_pin",
      "engine_pabco_pgd_w_445_16_rejects_resilient_channel_side_false_equivalence"
    ],
    requiredWebTestsBeforeRuntimeIfVisible: [
      "web_pabco_pgd_w_445_16_route_card_source_context",
      "web_pabco_pgd_w_445_16_report_blocks_field_output_promotion"
    ],
    rowId: "PABCO_PGD_W_445_16_QR_ES_WOOD_2X4_RC_16OC_STC57_NOAL17_0745",
    runtimeImportReadyNow: false,
    selectedRuntimeImportNow: false,
    sourceUrl: SOURCE_URLS[3],
    stc: 57,
    toleranceOwnerNamed: false
  },
  {
    blockedTargetOutputs: ["Rw", "R'w", "Dn,w", "DnT,w", "DnT,A", "indexed_locator_as_runtime_payload"],
    currentImplementationFit: "pgd_w_449_24_indexed_payload_missing_and_quietrock_530_multilayer_not_nrc_triple_leaf",
    family: "wood_stud_quietrock_multilayer_wall",
    firstMissingRequirement:
      "pabco_pgd_w_449_24_needs_fresh_live_row_or_summary_report_payload_quietrock_530_multilayer_material_mapping_nrc_tla_locator_policy_metric_owner_tolerance_owner_and_triple_leaf_negative_tests",
    gateBDecision: "keep_context_only",
    localMaterialMapping: "blocked_quietrock_530_multilayer_glass_fiber_and_indexed_payload_mapping_missing",
    metricOwner: "stc_report_locator_without_payload_or_curve_owner",
    protectedBoundary: "pabco_pgd_w_449_24_gate_b_indexed_locator_missing_payload_blocks_runtime_and_confidence_promotion",
    requiredEngineTestsBeforeRuntime: [
      "engine_pabco_pgd_w_449_24_value_or_rejection_pin",
      "engine_pabco_pgd_w_449_24_rejects_quietrock_530_multilayer_as_nrc_triple_leaf_or_local_mlv"
    ],
    requiredWebTestsBeforeRuntimeIfVisible: [
      "web_pabco_pgd_w_449_24_locator_only_route_card_context",
      "web_pabco_pgd_w_449_24_report_blocks_payload_claim"
    ],
    rowId: "PABCO_PGD_W_449_24_QR530_WOOD_2X4_24OC_THREE_LAYERS_STC57_NRC_TLA_04_035",
    runtimeImportReadyNow: false,
    selectedRuntimeImportNow: false,
    sourceUrl: SOURCE_URLS[4],
    stc: 57,
    toleranceOwnerNamed: false
  },
  {
    blockedTargetOutputs: ["Rw", "R'w", "Dn,w", "DnT,w", "DnT,A", "68mil_steel_as_existing_lsf_anchor"],
    currentImplementationFit: "pgd_68_534_16_68mil_steel_rc_not_existing_lsf_anchor",
    family: "steel_stud_quietrock_resilient_channel_wall",
    firstMissingRequirement:
      "pabco_pgd_68_534_16_needs_summary_report_payload_68_mil_steel_stud_gauge_mapping_resilient_channel_side_policy_quietrock_es_type_x_glass_fiber_metric_owner_tolerance_owner_and_lsf_anchor_precedence_tests",
    gateBDecision: "block_immediate_runtime_import",
    localMaterialMapping:
      "blocked_quietrock_es_pabco_type_x_resilient_channel_glass_fiber_and_steel_gauge_mapping_missing",
    metricOwner: "stc_static_without_iso_rw_curve_or_rejection_owner",
    protectedBoundary: "pabco_pgd_68_534_16_gate_b_68mil_steel_resilient_channel_row_does_not_replace_lsf_anchors",
    requiredEngineTestsBeforeRuntime: [
      "engine_pabco_pgd_68_534_16_value_or_rejection_pin",
      "engine_pabco_pgd_68_534_16_rejects_generic_steel_stud_gauge_anchor_replacement"
    ],
    requiredWebTestsBeforeRuntimeIfVisible: [
      "web_pabco_pgd_68_534_16_route_card_source_context",
      "web_pabco_pgd_68_534_16_report_blocks_lsf_anchor_override"
    ],
    rowId: "PABCO_PGD_68_534_16_QR_ES_STEEL_68MIL_RC_16OC_STC50_NOAL18_0611",
    runtimeImportReadyNow: false,
    selectedRuntimeImportNow: false,
    sourceUrl: SOURCE_URLS[5],
    stc: 50,
    toleranceOwnerNamed: false
  },
  {
    blockedTargetOutputs: ["Rw", "R'w", "Dn,w", "DnT,w", "DnT,A", "high_stc_as_field_or_lsf_runtime_anchor"],
    currentImplementationFit: "pgd_546_407_16_54mil_steel_rc_high_stc_not_field_or_lsf_anchor",
    family: "steel_stud_quietrock_resilient_channel_wall",
    firstMissingRequirement:
      "pabco_pgd_546_407_16_needs_summary_report_payload_54_mil_6in_steel_stud_resilient_channel_double_type_x_mapping_stc_metric_policy_field_output_rejection_tolerance_owner_and_visible_tests",
    gateBDecision: "block_immediate_runtime_import",
    localMaterialMapping:
      "blocked_quietrock_es_pabco_type_x_resilient_channel_glass_fiber_and_steel_gauge_mapping_missing",
    metricOwner: "field_outputs_without_iso_12354_overlay_owner",
    protectedBoundary: "pabco_pgd_546_407_16_gate_b_stc60_does_not_promote_field_outputs_or_existing_lsf_anchors",
    requiredEngineTestsBeforeRuntime: [
      "engine_pabco_pgd_546_407_16_value_or_rejection_pin",
      "engine_pabco_pgd_546_407_16_rejects_high_stc_field_output_or_lsf_anchor_promotion"
    ],
    requiredWebTestsBeforeRuntimeIfVisible: [
      "web_pabco_pgd_546_407_16_route_card_source_context",
      "web_pabco_pgd_546_407_16_report_blocks_high_stc_as_rw_promotion"
    ],
    rowId: "PABCO_PGD_546_407_16_QR_ES_STEEL_54MIL_RC_16OC_DOUBLE_TYPEX_STC60_NOAL21_0358",
    runtimeImportReadyNow: false,
    selectedRuntimeImportNow: false,
    sourceUrl: SOURCE_URLS[6],
    stc: 60,
    toleranceOwnerNamed: false
  },
  {
    blockedTargetOutputs: ["Rw", "R'w", "Dn,w", "DnT,w", "DnT,A", "quietrock_530_as_generic_gypsum"],
    currentImplementationFit: "pgd_w6_467_24_quietrock_530_2x6_not_generic_wood_stud_route",
    family: "wood_stud_quietrock_530_wall",
    firstMissingRequirement:
      "pabco_pgd_w6_467_24_needs_summary_report_payload_quietrock_530_or_530rf_material_mapping_2x6_24oc_wood_stud_mapping_metric_policy_tolerance_owner_and_visible_tests",
    gateBDecision: "block_immediate_runtime_import",
    localMaterialMapping: "blocked_quietrock_530_glass_fiber_and_2x6_wood_mapping_missing",
    metricOwner: "stc_static_without_iso_rw_curve_or_rejection_owner",
    protectedBoundary: "pabco_pgd_w6_467_24_gate_b_quietrock_530_row_does_not_promote_generic_wood_stud_route",
    requiredEngineTestsBeforeRuntime: [
      "engine_pabco_pgd_w6_467_24_value_or_rejection_pin",
      "engine_pabco_pgd_w6_467_24_rejects_quietrock_530_generic_gypsum_mapping"
    ],
    requiredWebTestsBeforeRuntimeIfVisible: [
      "web_pabco_pgd_w6_467_24_route_card_source_context",
      "web_pabco_pgd_w6_467_24_report_keeps_quietrock_specific_material_context"
    ],
    rowId: "PABCO_PGD_W6_467_24_QR530_WOOD_2X6_24OC_STC56_NOAL21_1053",
    runtimeImportReadyNow: false,
    selectedRuntimeImportNow: false,
    sourceUrl: SOURCE_URLS[7],
    stc: 56,
    toleranceOwnerNamed: false
  }
] as const;

const METRIC_DECISIONS: readonly PabcoMetricDecision[] = [
  {
    blockedTargets: ["Rw", "STC_as_DynEcho_Rw", "runtime_import_until_curve_owner_exists"],
    firstMissingRequirement:
      "pabco_stc_values_need_explicit_metric_rejection_or_iso_717_rw_derivation_from_source_owned_one_third_octave_curves_before_runtime_use",
    metricContext: "source_stc",
    runtimeOutputReadyNow: false
  },
  {
    blockedTargets: ["evidence_tier_promotion", "runtime_import_without_downloaded_summary_report_payload"],
    firstMissingRequirement:
      "pabco_noal_and_nrc_report_numbers_identify_rows_but_do_not_supply_downloaded_payload_full_band_curves_digitization_qc_or_chain_of_custody",
    metricContext: "report_locator",
    runtimeOutputReadyNow: false
  },
  {
    blockedTargets: ["R'w", "Dn,w", "DnT,w", "DnT,A"],
    firstMissingRequirement:
      "pabco_row_pages_do_not_supply_field_building_context_iso_12354_overlay_room_geometry_or_visible_output_policy",
    metricContext: "field_outputs",
    runtimeOutputReadyNow: false
  },
  {
    blockedTargets: ["support_promotion", "confidence_promotion", "tolerance_claim_without_error_owner"],
    firstMissingRequirement:
      "pabco_gate_b_has_no_source_owned_mae_max_error_or_family_tolerance_owner_for_screening_to_exact_runtime_movement",
    metricContext: "tolerance_policy",
    runtimeOutputReadyNow: false
  }
] as const;

const MATERIAL_ALIAS_DECISIONS = [
  "quietrock_es_or_es_mr_type_x_does_not_coalesce_with_generic_gypsum_without_source_tolerance_owner",
  "quietrock_530_or_530rf_does_not_coalesce_with_generic_gypsum_mlv_or_damped_leaf_without_mapping",
  "pabco_type_x_family_does_not_coalesce_with_generic_type_x_type_c_or_glass_mat_without_row_policy",
  "glass_fiber_does_not_coalesce_with_local_rockwool_or_generic_mineral_wool",
  "resilient_channel_side_spacing_and_attachment_do_not_coalesce_with_generic_resilient_bar",
  "wood_depth_steel_mil_spacing_bearing_and_load_roles_must_remain_explicit"
] as const;

const FAMILY_BOUNDARY_DECISIONS = [
  "pabco_wood_stud_quietrock_rows_do_not_replace_existing_timber_or_generic_wood_stud_routes",
  "pabco_steel_stud_quietrock_rows_do_not_replace_existing_lsf_anchors",
  "pabco_resilient_channel_rows_do_not_promote_generic_resilient_bar_routes",
  "pabco_quietrock_multilayer_rows_do_not_promote_nrc_triple_leaf_or_local_mlv_routes",
  "pabco_high_stc_rows_do_not_promote_field_outputs_without_field_overlay",
  "pabco_indexed_or_summary_report_locator_rows_do_not_promote_runtime_truth_without_payload"
] as const;

const PROTECTED_BOUNDARIES = [
  "pabco_gate_b_source_rows_are_not_runtime_import_approval",
  "pabco_gate_b_stc_values_and_report_locators_do_not_promote_dyn_echo_rw_or_field_outputs",
  "pabco_gate_b_quietrock_es_530_pabco_type_x_and_generic_gypsum_do_not_coalesce_without_mapping_tolerance",
  "pabco_gate_b_glass_fiber_does_not_coalesce_with_local_rockwool_or_fix_uris_2006",
  "pabco_gate_b_resilient_channel_stud_depth_spacing_gauge_and_bearing_do_not_promote_generic_routes",
  "pabco_gate_b_pgd_w_449_24_indexed_payload_missing_blocks_runtime_import",
  "pabco_gate_b_rows_do_not_override_closed_georgia_pacific_national_gypsum_usg_rockwool_british_gypsum_knauf_or_existing_anchors",
  "pabco_gate_b_rows_do_not_fix_the_uris_2006_split_rockwool_triple_leaf_rw_41_screening_result",
  "runtime_support_confidence_evidence_api_route_card_output_card_proposal_report_and_workbench_input_surfaces_remain_frozen"
] as const;

const GATE_B_DECISION = {
  rowsKeptContextOnly: GATE_B_ROW_DECISIONS.map((row) => row.rowId),
  runtimeImportSelectedNow: false,
  selectedNextAction: "gate_c_closeout_and_next_slice_selection_no_runtime",
  targetNextGateFile:
    "packages/engine/src/post-pabco-quietrock-sound-design-guide-source-pack-extraction-v1-next-slice-selection-contract.test.ts"
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

const SPLIT_ROCKWOOL_STACK: readonly LayerInput[] = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "mlv", thicknessMm: 4 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 50 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 50 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "gypsum_plaster", thicknessMm: 10 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
];

const COMPLETE_TRIPLE_LEAF_CONTEXT: AirborneContext = {
  contextMode: "element_lab",
  wallTopology: {
    cavity1AbsorptionClass: "porous_absorptive",
    cavity1DepthMm: 50,
    cavity1FillCoverage: "full",
    cavity1LayerIndices: [3],
    cavity2AbsorptionClass: "porous_absorptive",
    cavity2DepthMm: 50,
    cavity2FillCoverage: "full",
    cavity2LayerIndices: [5],
    internalLeafCoupling: "independent",
    internalLeafLayerIndices: [4],
    sideALeafLayerIndices: [0, 1, 2],
    sideBLeafLayerIndices: [6, 7, 8],
    supportTopology: "independent_frames",
    topologyMode: "grouped_triple_leaf"
  }
};

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("PABCO QuietRock Sound Design Guide source-pack extraction Gate B contract", () => {
  it("lands Gate B as no-runtime mapping / tolerance decision and selects Gate C closeout", () => {
    expect(PABCO_GATE_B).toEqual({
      apiShapeChange: false,
      confidencePromotion: false,
      evidencePromotion: false,
      landedGate: "gate_b_mapping_tolerance_decision_no_runtime",
      numericRuntimeBehaviorChange: false,
      outputCardStatusChange: false,
      outputSupportChange: false,
      previousGate: "gate_a_extract_pabco_quietrock_sound_design_guide_rows_without_runtime_import",
      proposalReportCopyChange: false,
      routeCardValueChange: false,
      runtimeImportReadyNow: false,
      runtimeImportSelectedNow: false,
      runtimeTightening: false,
      runtimeWidening: false,
      selectedNextAction: "gate_c_closeout_and_next_slice_selection_no_runtime",
      sliceId: "pabco_quietrock_sound_design_guide_source_pack_extraction_v1",
      status: "pabco_gate_b_found_no_runtime_ready_row_selected_closeout",
      supportPromotion: false,
      targetNextGateFile:
        "packages/engine/src/post-pabco-quietrock-sound-design-guide-source-pack-extraction-v1-next-slice-selection-contract.test.ts",
      workbenchInputBehaviorChange: false
    });

    for (const path of REQUIRED_DOCS) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("keeps every extracted PABCO row out of runtime with row-specific blockers", () => {
    expect(GATE_B_ROW_DECISIONS.map((row) => row.rowId)).toEqual([
      "PABCO_PGD_W_646_16_QR_ES_WOOD_2X4_16OC_STC41_NOAL17_0730",
      "PABCO_PGD_W_445_16_QR_ES_WOOD_2X4_RC_16OC_STC57_NOAL17_0745",
      "PABCO_PGD_W_449_24_QR530_WOOD_2X4_24OC_THREE_LAYERS_STC57_NRC_TLA_04_035",
      "PABCO_PGD_68_534_16_QR_ES_STEEL_68MIL_RC_16OC_STC50_NOAL18_0611",
      "PABCO_PGD_546_407_16_QR_ES_STEEL_54MIL_RC_16OC_DOUBLE_TYPEX_STC60_NOAL21_0358",
      "PABCO_PGD_W6_467_24_QR530_WOOD_2X6_24OC_STC56_NOAL21_1053"
    ]);
    expect(GATE_B_ROW_DECISIONS.every((row) => row.runtimeImportReadyNow === false)).toBe(true);
    expect(GATE_B_ROW_DECISIONS.every((row) => row.selectedRuntimeImportNow === false)).toBe(true);
    expect(GATE_B_ROW_DECISIONS.every((row) => row.toleranceOwnerNamed === false)).toBe(true);
    expect(GATE_B_ROW_DECISIONS.every((row) => row.firstMissingRequirement.length > 140)).toBe(true);
    expect(GATE_B_ROW_DECISIONS.map((row) => row.stc)).toEqual([41, 57, 57, 50, 60, 56]);
    expect(GATE_B_DECISION.rowsKeptContextOnly).toEqual(GATE_B_ROW_DECISIONS.map((row) => row.rowId));
  });

  it("blocks STC values, report locators, field outputs, and tolerance claims from becoming DynEcho metrics", () => {
    expect(METRIC_DECISIONS).toEqual([
      {
        blockedTargets: ["Rw", "STC_as_DynEcho_Rw", "runtime_import_until_curve_owner_exists"],
        firstMissingRequirement:
          "pabco_stc_values_need_explicit_metric_rejection_or_iso_717_rw_derivation_from_source_owned_one_third_octave_curves_before_runtime_use",
        metricContext: "source_stc",
        runtimeOutputReadyNow: false
      },
      {
        blockedTargets: ["evidence_tier_promotion", "runtime_import_without_downloaded_summary_report_payload"],
        firstMissingRequirement:
          "pabco_noal_and_nrc_report_numbers_identify_rows_but_do_not_supply_downloaded_payload_full_band_curves_digitization_qc_or_chain_of_custody",
        metricContext: "report_locator",
        runtimeOutputReadyNow: false
      },
      {
        blockedTargets: ["R'w", "Dn,w", "DnT,w", "DnT,A"],
        firstMissingRequirement:
          "pabco_row_pages_do_not_supply_field_building_context_iso_12354_overlay_room_geometry_or_visible_output_policy",
        metricContext: "field_outputs",
        runtimeOutputReadyNow: false
      },
      {
        blockedTargets: ["support_promotion", "confidence_promotion", "tolerance_claim_without_error_owner"],
        firstMissingRequirement:
          "pabco_gate_b_has_no_source_owned_mae_max_error_or_family_tolerance_owner_for_screening_to_exact_runtime_movement",
        metricContext: "tolerance_policy",
        runtimeOutputReadyNow: false
      }
    ]);
    expect(METRIC_DECISIONS.every((decision) => decision.runtimeOutputReadyNow === false)).toBe(true);
    expect(PROTECTED_BOUNDARIES).toContain(
      "pabco_gate_b_stc_values_and_report_locators_do_not_promote_dyn_echo_rw_or_field_outputs"
    );
  });

  it("requires material and topology alias ownership before any future runtime or visible movement", () => {
    expect(MATERIAL_ALIAS_DECISIONS).toEqual([
      "quietrock_es_or_es_mr_type_x_does_not_coalesce_with_generic_gypsum_without_source_tolerance_owner",
      "quietrock_530_or_530rf_does_not_coalesce_with_generic_gypsum_mlv_or_damped_leaf_without_mapping",
      "pabco_type_x_family_does_not_coalesce_with_generic_type_x_type_c_or_glass_mat_without_row_policy",
      "glass_fiber_does_not_coalesce_with_local_rockwool_or_generic_mineral_wool",
      "resilient_channel_side_spacing_and_attachment_do_not_coalesce_with_generic_resilient_bar",
      "wood_depth_steel_mil_spacing_bearing_and_load_roles_must_remain_explicit"
    ]);
    expect(
      GATE_B_ROW_DECISIONS.every(
        (row) =>
          row.requiredEngineTestsBeforeRuntime.length === 2 &&
          row.requiredWebTestsBeforeRuntimeIfVisible.length === 2
      )
    ).toBe(true);
    expect(MATERIAL_ALIAS_DECISIONS.join("\n")).toContain("glass_fiber_does_not_coalesce_with_local_rockwool");
    expect(MATERIAL_ALIAS_DECISIONS.join("\n")).not.toContain("runtime_exact");
  });

  it("holds source-family boundaries for wood, steel, resilient-channel, multilayer, high-STC, and payload gaps", () => {
    expect(GATE_B_ROW_DECISIONS.map((row) => row.currentImplementationFit)).toEqual([
      "pgd_w_646_16_adjacent_wood_stud_single_cavity_not_existing_timber_anchor",
      "pgd_w_445_16_resilient_channel_side_not_generic_timber_or_resilient_bar_anchor",
      "pgd_w_449_24_indexed_payload_missing_and_quietrock_530_multilayer_not_nrc_triple_leaf",
      "pgd_68_534_16_68mil_steel_rc_not_existing_lsf_anchor",
      "pgd_546_407_16_54mil_steel_rc_high_stc_not_field_or_lsf_anchor",
      "pgd_w6_467_24_quietrock_530_2x6_not_generic_wood_stud_route"
    ]);
    expect(FAMILY_BOUNDARY_DECISIONS).toEqual([
      "pabco_wood_stud_quietrock_rows_do_not_replace_existing_timber_or_generic_wood_stud_routes",
      "pabco_steel_stud_quietrock_rows_do_not_replace_existing_lsf_anchors",
      "pabco_resilient_channel_rows_do_not_promote_generic_resilient_bar_routes",
      "pabco_quietrock_multilayer_rows_do_not_promote_nrc_triple_leaf_or_local_mlv_routes",
      "pabco_high_stc_rows_do_not_promote_field_outputs_without_field_overlay",
      "pabco_indexed_or_summary_report_locator_rows_do_not_promote_runtime_truth_without_payload"
    ]);
    expect(PROTECTED_BOUNDARIES).toContain(
      "pabco_gate_b_pgd_w_449_24_indexed_payload_missing_blocks_runtime_import"
    );
  });

  it("keeps the original split-rockwool defect and every runtime-visible surface frozen", () => {
    const splitRockwool = calculateAssembly(SPLIT_ROCKWOOL_STACK, {
      airborneContext: COMPLETE_TRIPLE_LEAF_CONTEXT,
      calculator: "dynamic",
      targetOutputs: ["Rw"]
    });

    expect(PROTECTED_BOUNDARIES).toContain(
      "pabco_gate_b_rows_do_not_fix_the_uris_2006_split_rockwool_triple_leaf_rw_41_screening_result"
    );
    expect(splitRockwool.metrics.estimatedRwDb).toBe(50);
    expect(splitRockwool.dynamicAirborneTrace?.strategy).toBe("triple_leaf_two_cavity_frequency_solver_family_physics_prediction");
    expect(splitRockwool.dynamicAirborneTrace?.confidenceClass).toBe("medium");
    expect(PABCO_GATE_B.numericRuntimeBehaviorChange).toBe(false);
    expect(PABCO_GATE_B.runtimeWidening).toBe(false);
    expect(FROZEN_SURFACES).toEqual([
      "runtime",
      "support",
      "confidence",
      "evidence",
      "API",
      "route-card",
      "output-card",
      "proposal/report",
      "workbench-input"
    ]);
  });

  it("protects closed near-source families and selects only Gate C no-runtime closeout", () => {
    expect(PROTECTED_BOUNDARIES).toEqual([
      "pabco_gate_b_source_rows_are_not_runtime_import_approval",
      "pabco_gate_b_stc_values_and_report_locators_do_not_promote_dyn_echo_rw_or_field_outputs",
      "pabco_gate_b_quietrock_es_530_pabco_type_x_and_generic_gypsum_do_not_coalesce_without_mapping_tolerance",
      "pabco_gate_b_glass_fiber_does_not_coalesce_with_local_rockwool_or_fix_uris_2006",
      "pabco_gate_b_resilient_channel_stud_depth_spacing_gauge_and_bearing_do_not_promote_generic_routes",
      "pabco_gate_b_pgd_w_449_24_indexed_payload_missing_blocks_runtime_import",
      "pabco_gate_b_rows_do_not_override_closed_georgia_pacific_national_gypsum_usg_rockwool_british_gypsum_knauf_or_existing_anchors",
      "pabco_gate_b_rows_do_not_fix_the_uris_2006_split_rockwool_triple_leaf_rw_41_screening_result",
      "runtime_support_confidence_evidence_api_route_card_output_card_proposal_report_and_workbench_input_surfaces_remain_frozen"
    ]);
    expect(GATE_B_DECISION).toEqual({
      rowsKeptContextOnly: [
        "PABCO_PGD_W_646_16_QR_ES_WOOD_2X4_16OC_STC41_NOAL17_0730",
        "PABCO_PGD_W_445_16_QR_ES_WOOD_2X4_RC_16OC_STC57_NOAL17_0745",
        "PABCO_PGD_W_449_24_QR530_WOOD_2X4_24OC_THREE_LAYERS_STC57_NRC_TLA_04_035",
        "PABCO_PGD_68_534_16_QR_ES_STEEL_68MIL_RC_16OC_STC50_NOAL18_0611",
        "PABCO_PGD_546_407_16_QR_ES_STEEL_54MIL_RC_16OC_DOUBLE_TYPEX_STC60_NOAL21_0358",
        "PABCO_PGD_W6_467_24_QR530_WOOD_2X6_24OC_STC56_NOAL21_1053"
      ],
      runtimeImportSelectedNow: false,
      selectedNextAction: "gate_c_closeout_and_next_slice_selection_no_runtime",
      targetNextGateFile:
        "packages/engine/src/post-pabco-quietrock-sound-design-guide-source-pack-extraction-v1-next-slice-selection-contract.test.ts"
    });
  });

  it("keeps active docs aligned on Gate C closeout as the next no-runtime action", () => {
    const docs = REQUIRED_DOCS.map((path) => readRepoFile(path)).join("\n");

    expect(docs).toContain(PABCO_GATE_B.sliceId);
    expect(docs).toContain(PABCO_GATE_B.status);
    expect(docs).toContain(PABCO_GATE_B.selectedNextAction);
    expect(docs).toContain(PABCO_GATE_B.targetNextGateFile);

    for (const sourceUrl of SOURCE_URLS) {
      expect(docs, sourceUrl).toContain(sourceUrl);
    }

    for (const row of GATE_B_ROW_DECISIONS) {
      expect(docs, row.rowId).toContain(row.rowId);
      expect(docs, row.sourceUrl).toContain(row.sourceUrl);
      expect(docs, row.protectedBoundary).toContain(row.protectedBoundary);
    }

    for (const boundary of [...PROTECTED_BOUNDARIES, ...FAMILY_BOUNDARY_DECISIONS]) {
      expect(docs, boundary).toContain(boundary);
    }

    for (const surface of FROZEN_SURFACES) {
      expect(docs, surface).toContain(surface);
    }
  });
});
