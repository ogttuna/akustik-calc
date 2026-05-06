import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

type PabcoFamily =
  | "steel_stud_quietrock_resilient_channel_wall"
  | "wood_stud_quietrock_530_wall"
  | "wood_stud_quietrock_es_resilient_channel_wall"
  | "wood_stud_quietrock_es_single_stud_wall"
  | "wood_stud_quietrock_multilayer_wall";

type PabcoMetricContext = "stc_report_number_locator" | "stc_static_row_with_report_locator";

type PabcoSourceRow = {
  blockedTargetOutputs: readonly string[];
  buildSummary: string;
  downloadableSummaryReportPayloadCaptured: false;
  exactRwMetricOwned: false;
  family: PabcoFamily;
  fireDesign: string;
  fireRating: "1 hr.";
  firstMissingRequirement: string;
  id: string;
  importDisposition: "no_runtime_import";
  insulation: string;
  localMappingStatus:
    | "blocked_pabco_type_x_quietrock_es_glass_fiber_and_resilient_channel_mapping_missing"
    | "blocked_pabco_type_x_quietrock_es_steel_stud_glass_fiber_and_resilient_channel_mapping_missing"
    | "blocked_quietrock_530_multilayer_and_glass_fiber_mapping_missing";
  metricContext: PabcoMetricContext;
  pagePayloadCaptured: boolean;
  pairedEngineTestsBeforeRuntime: readonly string[];
  pairedWebTestsBeforeVisibleMovement: readonly string[];
  productLayers: readonly string[];
  protectedBoundary: string;
  reportNumber: string;
  sourceLocator: string;
  sourceUrl: string;
  stc: number;
  studSpacing: "16 in oc" | "24 in oc";
  studTopology: string;
  thickness: string;
  weight: string;
};

const PABCO_QUIETROCK_GATE_A = {
  apiShapeChange: false,
  confidencePromotion: false,
  evidencePromotion: false,
  landedGate: "gate_a_extract_pabco_quietrock_sound_design_guide_rows_without_runtime_import",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: false,
  outputSupportChange: false,
  proposalReportCopyChange: false,
  routeCardValueChange: false,
  runtimeImportReadyNow: false,
  runtimeImportSelectedNow: false,
  selectedNextAction: "gate_b_mapping_tolerance_decision_no_runtime",
  selectedNextFile:
    "packages/engine/src/pabco-quietrock-sound-design-guide-source-pack-extraction-gate-b-contract.test.ts",
  sliceId: "pabco_quietrock_sound_design_guide_source_pack_extraction_v1",
  status: "pabco_quietrock_sound_design_guide_rows_extracted_no_runtime_selected_mapping_tolerance_gate_b",
  supportPromotion: false,
  workbenchInputBehaviorChange: false
} as const;

const SOUND_DESIGN_GUIDE_URL = "https://go.pabcogypsum.com/tsdg";
const SOUND_ASSEMBLY_TOOL_URL = "https://quietrock.com/resources/sound-control-assembly-selector/";
const PGD_W_646_16_URL = "https://pabcogypsum.com/resources/sound-control-assembly-selector/pgd-w-646-16/";
const PGD_W_445_16_URL = "https://pabcogypsum.com/resources/sound-control-assembly-selector/pgd-w-445-16/";
const PGD_W_449_24_URL = "https://pabcogypsum.com/resources/sound-control-assembly-selector/pgd-w-449-24/";
const PGD_68_534_16_URL = "https://pabcogypsum.com/resources/sound-control-assembly-selector/pgd-68-534-16/";
const PGD_546_407_16_URL = "https://pabcogypsum.com/resources/sound-control-assembly-selector/pgd-546-407-16/";
const PGD_W6_467_24_URL = "https://pabcogypsum.com/resources/sound-control-assembly-selector/pgd-w6-467-24/";

const REQUIRED_DOCS = [
  "AGENTS.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md",
  "docs/calculator/SLICE_PABCO_QUIETROCK_SOUND_DESIGN_GUIDE_SOURCE_PACK_EXTRACTION_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-03_PABCO_QUIETROCK_SOUND_DESIGN_GUIDE_SOURCE_PACK_EXTRACTION_GATE_A_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-05-02_CALCULATOR_POST_GEORGIA_PACIFIC_SOURCE_ACQUISITION_GATE_A_HANDOFF.md",
  "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md",
  "docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md"
] as const;

const PABCO_SOURCE_ROWS: readonly PabcoSourceRow[] = [
  {
    blockedTargetOutputs: ["Rw", "R'w", "Dn,w", "DnT,w", "DnT,A"],
    buildSummary:
      "one layer 5/8 in QuietRock ES or ES MR Type X, 2x4 wood studs at 16 in oc, R-13 glass fiber, and one opposite Type X gypsum layer",
    downloadableSummaryReportPayloadCaptured: false,
    exactRwMetricOwned: false,
    family: "wood_stud_quietrock_es_single_stud_wall",
    fireDesign: "U305",
    fireRating: "1 hr.",
    firstMissingRequirement:
      "pgd_w_646_16_needs_summary_report_payload_stc_to_rw_or_rejection_policy_quietrock_es_type_x_glass_fiber_mapping_tolerance_owner_negative_boundaries_and_paired_visible_tests",
    id: "PABCO_PGD_W_646_16_QR_ES_WOOD_2X4_16OC_STC41_NOAL17_0730",
    importDisposition: "no_runtime_import",
    insulation: "3-1/2 in R-13 glass fiber",
    localMappingStatus: "blocked_pabco_type_x_quietrock_es_glass_fiber_and_resilient_channel_mapping_missing",
    metricContext: "stc_static_row_with_report_locator",
    pagePayloadCaptured: true,
    pairedEngineTestsBeforeRuntime: [
      "engine_pabco_pgd_w_646_16_value_or_rejection_pin",
      "engine_pabco_pgd_w_646_16_blocks_generic_timber_or_lsf_anchor_replacement"
    ],
    pairedWebTestsBeforeVisibleMovement: [
      "web_pabco_pgd_w_646_16_route_card_source_context",
      "web_pabco_pgd_w_646_16_report_keeps_stc_context_explicit"
    ],
    productLayers: ["5/8 in QuietRock ES or ES MR Type X", "5/8 in PABCO Type X gypsum panel"],
    protectedBoundary: "pabco_pgd_w_646_16_stc41_does_not_replace_generic_wood_stud_or_quietrock_runtime_route",
    reportNumber: "NOAL 17-0730",
    sourceLocator: "PABCO Sound Assembly Tool / PGD-W-646-16",
    sourceUrl: PGD_W_646_16_URL,
    stc: 41,
    studSpacing: "16 in oc",
    studTopology: "2x4 wood studs",
    thickness: "4-3/4 in",
    weight: "6.3 lb/ft2"
  },
  {
    blockedTargetOutputs: ["Rw", "R'w", "Dn,w", "DnT,w", "DnT,A"],
    buildSummary:
      "one layer 5/8 in QuietRock ES or ES MR Type X, 2x4 wood studs at 16 in oc, R-13 glass fiber, resilient channel, and two opposite Type X gypsum layers",
    downloadableSummaryReportPayloadCaptured: false,
    exactRwMetricOwned: false,
    family: "wood_stud_quietrock_es_resilient_channel_wall",
    fireDesign: "U305",
    fireRating: "1 hr.",
    firstMissingRequirement:
      "pgd_w_445_16_needs_summary_report_payload_stc_to_rw_or_rejection_policy_resilient_channel_side_mapping_quietrock_es_type_x_glass_fiber_tolerance_owner_and_visible_tests",
    id: "PABCO_PGD_W_445_16_QR_ES_WOOD_2X4_RC_16OC_STC57_NOAL17_0745",
    importDisposition: "no_runtime_import",
    insulation: "3-1/2 in R-13 glass fiber",
    localMappingStatus: "blocked_pabco_type_x_quietrock_es_glass_fiber_and_resilient_channel_mapping_missing",
    metricContext: "stc_static_row_with_report_locator",
    pagePayloadCaptured: true,
    pairedEngineTestsBeforeRuntime: [
      "engine_pabco_pgd_w_445_16_value_or_rejection_pin",
      "engine_pabco_pgd_w_445_16_blocks_resilient_channel_side_false_equivalence"
    ],
    pairedWebTestsBeforeVisibleMovement: [
      "web_pabco_pgd_w_445_16_route_card_source_context",
      "web_pabco_pgd_w_445_16_report_blocks_field_output_promotion"
    ],
    productLayers: [
      "5/8 in QuietRock ES or ES MR Type X",
      "5/8 in PABCO Type X base layer",
      "5/8 in PABCO Type X face layer"
    ],
    protectedBoundary:
      "pabco_pgd_w_445_16_stc57_resilient_channel_context_does_not_promote_dyn_echo_rw_or_field_outputs",
    reportNumber: "NOAL 17-0745",
    sourceLocator: "PABCO Sound Assembly Tool / PGD-W-445-16",
    sourceUrl: PGD_W_445_16_URL,
    stc: 57,
    studSpacing: "16 in oc",
    studTopology: "2x4 wood studs plus resilient channel side",
    thickness: "5-7/8 in",
    weight: "8.5 lb/ft2"
  },
  {
    blockedTargetOutputs: ["Rw", "R'w", "Dn,w", "DnT,w", "DnT,A"],
    buildSummary:
      "two layers 5/8 in QuietRock 530 or 530 RF one side, 2x4 wood studs at 24 in oc, R-13 glass fiber, and one opposite QuietRock 530 or 530 RF layer",
    downloadableSummaryReportPayloadCaptured: false,
    exactRwMetricOwned: false,
    family: "wood_stud_quietrock_multilayer_wall",
    fireDesign: "U309",
    fireRating: "1 hr.",
    firstMissingRequirement:
      "pgd_w_449_24_needs_current_row_payload_or_summary_report_payload_quietrock_530_multilayer_mapping_stc_to_rw_policy_tolerance_owner_negative_boundaries_and_visible_tests",
    id: "PABCO_PGD_W_449_24_QR530_WOOD_2X4_24OC_THREE_LAYERS_STC57_NRC_TLA_04_035",
    importDisposition: "no_runtime_import",
    insulation: "3-1/2 in R-13 glass fiber",
    localMappingStatus: "blocked_quietrock_530_multilayer_and_glass_fiber_mapping_missing",
    metricContext: "stc_report_number_locator",
    pagePayloadCaptured: false,
    pairedEngineTestsBeforeRuntime: [
      "engine_pabco_pgd_w_449_24_value_or_rejection_pin",
      "engine_pabco_pgd_w_449_24_blocks_multilayer_quietrock_false_equivalence"
    ],
    pairedWebTestsBeforeVisibleMovement: [
      "web_pabco_pgd_w_449_24_route_card_source_context",
      "web_pabco_pgd_w_449_24_report_keeps_locator_not_payload_status"
    ],
    productLayers: [
      "5/8 in QuietRock 530 or 530 RF face layer",
      "5/8 in QuietRock 530 or 530 RF base layer",
      "opposite side 5/8 in QuietRock 530 or 530 RF"
    ],
    protectedBoundary: "pabco_pgd_w_449_24_indexed_locator_is_not_runtime_truth_until_payload_is_retrieved",
    reportNumber: "NRC TLA-04-035",
    sourceLocator: "PABCO indexed row locator / PGD-W-449-24",
    sourceUrl: PGD_W_449_24_URL,
    stc: 57,
    studSpacing: "24 in oc",
    studTopology: "2x4 wood studs",
    thickness: "5-3/8 in",
    weight: "9.3 lb/ft2"
  },
  {
    blockedTargetOutputs: ["Rw", "R'w", "Dn,w", "DnT,w", "DnT,A"],
    buildSummary:
      "one layer 5/8 in QuietRock ES or ES MR Type X, 3-5/8 in 68 mil steel studs at 16 in oc, R-13 glass fiber, resilient channel, and one Type X gypsum layer",
    downloadableSummaryReportPayloadCaptured: false,
    exactRwMetricOwned: false,
    family: "steel_stud_quietrock_resilient_channel_wall",
    fireDesign: "U425",
    fireRating: "1 hr.",
    firstMissingRequirement:
      "pgd_68_534_16_needs_summary_report_payload_68_mil_steel_stud_and_resilient_channel_mapping_quietrock_es_type_x_glass_fiber_metric_policy_tolerance_owner_and_visible_tests",
    id: "PABCO_PGD_68_534_16_QR_ES_STEEL_68MIL_RC_16OC_STC50_NOAL18_0611",
    importDisposition: "no_runtime_import",
    insulation: "3-1/2 in R-13 glass fiber",
    localMappingStatus: "blocked_pabco_type_x_quietrock_es_steel_stud_glass_fiber_and_resilient_channel_mapping_missing",
    metricContext: "stc_static_row_with_report_locator",
    pagePayloadCaptured: true,
    pairedEngineTestsBeforeRuntime: [
      "engine_pabco_pgd_68_534_16_value_or_rejection_pin",
      "engine_pabco_pgd_68_534_16_blocks_generic_steel_stud_gauge_false_equivalence"
    ],
    pairedWebTestsBeforeVisibleMovement: [
      "web_pabco_pgd_68_534_16_route_card_source_context",
      "web_pabco_pgd_68_534_16_report_blocks_lsf_anchor_override"
    ],
    productLayers: ["5/8 in QuietRock ES or ES MR Type X", "5/8 in PABCO Type X gypsum panel"],
    protectedBoundary: "pabco_pgd_68_534_16_68mil_steel_stud_row_does_not_replace_existing_lsf_anchors",
    reportNumber: "NOAL 18-0611",
    sourceLocator: "PABCO Sound Assembly Tool / PGD-68-534-16",
    sourceUrl: PGD_68_534_16_URL,
    stc: 50,
    studSpacing: "16 in oc",
    studTopology: "3-5/8 in 68 mil steel studs plus resilient channel side",
    thickness: "5-3/8 in",
    weight: "6.9 lb/ft2"
  },
  {
    blockedTargetOutputs: ["Rw", "R'w", "Dn,w", "DnT,w", "DnT,A"],
    buildSummary:
      "one layer 5/8 in QuietRock ES or ES MR Type X, 6 in 54 mil steel studs at 16 in oc, R-19 glass fiber, resilient channel, and two opposite Type X gypsum layers",
    downloadableSummaryReportPayloadCaptured: false,
    exactRwMetricOwned: false,
    family: "steel_stud_quietrock_resilient_channel_wall",
    fireDesign: "U425",
    fireRating: "1 hr.",
    firstMissingRequirement:
      "pgd_546_407_16_needs_summary_report_payload_6in_54mil_steel_stud_resilient_channel_double_type_x_mapping_stc_policy_tolerance_owner_negative_boundaries_and_visible_tests",
    id: "PABCO_PGD_546_407_16_QR_ES_STEEL_54MIL_RC_16OC_DOUBLE_TYPEX_STC60_NOAL21_0358",
    importDisposition: "no_runtime_import",
    insulation: "6-1/4 in R-19 glass fiber",
    localMappingStatus: "blocked_pabco_type_x_quietrock_es_steel_stud_glass_fiber_and_resilient_channel_mapping_missing",
    metricContext: "stc_static_row_with_report_locator",
    pagePayloadCaptured: true,
    pairedEngineTestsBeforeRuntime: [
      "engine_pabco_pgd_546_407_16_value_or_rejection_pin",
      "engine_pabco_pgd_546_407_16_blocks_high_stc_field_output_leakage"
    ],
    pairedWebTestsBeforeVisibleMovement: [
      "web_pabco_pgd_546_407_16_route_card_source_context",
      "web_pabco_pgd_546_407_16_report_blocks_high_stc_as_rw_promotion"
    ],
    productLayers: [
      "5/8 in QuietRock ES or ES MR Type X",
      "5/8 in PABCO Type X base layer",
      "5/8 in PABCO Type X face layer"
    ],
    protectedBoundary: "pabco_pgd_546_407_16_stc60_is_not_a_dyn_echo_field_or_lsf_runtime_anchor",
    reportNumber: "NOAL 21-0358",
    sourceLocator: "PABCO Sound Assembly Tool / PGD-546-407-16",
    sourceUrl: PGD_546_407_16_URL,
    stc: 60,
    studSpacing: "16 in oc",
    studTopology: "6 in 54 mil steel studs plus resilient channel side",
    thickness: "8-3/8 in",
    weight: "9.2 lb/ft2"
  },
  {
    blockedTargetOutputs: ["Rw", "R'w", "Dn,w", "DnT,w", "DnT,A"],
    buildSummary:
      "one layer 5/8 in QuietRock 530 or 530 RF each side, 2x6 wood studs at 24 in oc, and R-19 glass fiber",
    downloadableSummaryReportPayloadCaptured: false,
    exactRwMetricOwned: false,
    family: "wood_stud_quietrock_530_wall",
    fireDesign: "U309",
    fireRating: "1 hr.",
    firstMissingRequirement:
      "pgd_w6_467_24_needs_summary_report_payload_quietrock_530_or_530rf_material_mapping_2x6_wood_stud_mapping_stc_policy_tolerance_owner_and_visible_tests",
    id: "PABCO_PGD_W6_467_24_QR530_WOOD_2X6_24OC_STC56_NOAL21_1053",
    importDisposition: "no_runtime_import",
    insulation: "6 in R-19 glass fiber",
    localMappingStatus: "blocked_quietrock_530_multilayer_and_glass_fiber_mapping_missing",
    metricContext: "stc_static_row_with_report_locator",
    pagePayloadCaptured: true,
    pairedEngineTestsBeforeRuntime: [
      "engine_pabco_pgd_w6_467_24_value_or_rejection_pin",
      "engine_pabco_pgd_w6_467_24_blocks_quietrock_530_generic_gypsum_mapping"
    ],
    pairedWebTestsBeforeVisibleMovement: [
      "web_pabco_pgd_w6_467_24_route_card_source_context",
      "web_pabco_pgd_w6_467_24_report_keeps_quietrock_specific_material_context"
    ],
    productLayers: ["5/8 in QuietRock 530 or 530 RF", "opposite side 5/8 in QuietRock 530 or 530 RF"],
    protectedBoundary: "pabco_pgd_w6_467_24_quietrock_530_row_does_not_promote_generic_wood_stud_route",
    reportNumber: "NOAL 21-1053",
    sourceLocator: "PABCO Sound Assembly Tool / PGD-W6-467-24",
    sourceUrl: PGD_W6_467_24_URL,
    stc: 56,
    studSpacing: "24 in oc",
    studTopology: "2x6 wood studs",
    thickness: "6-3/4 in",
    weight: "7.3 lb/ft2"
  }
] as const;

const SOURCE_SURFACE_COVERAGE = {
  downloadableSummaryReportsAdvertised: true,
  guideLandingClaimsOverFireAndSoundDesigns: 220,
  guideLandingClaimsNewWallAssemblies: 50,
  interactiveFiltersVisible: [
    "stud_type",
    "wall_stud_config",
    "stud_thickness",
    "stud_spacing",
    "fire_rating",
    "steel_stud_mil_thickness",
    "product"
  ],
  officialGuideLandingAvailable: true,
  rowPagesCapturedNow: 5,
  rowPagesRequiringFreshPayloadRetrieval: 1,
  selectorPageAvailable: true,
  sourceUrls: [SOUND_DESIGN_GUIDE_URL, SOUND_ASSEMBLY_TOOL_URL]
} as const;

const METRIC_POLICY = {
  blockedFieldOutputs: ["R'w", "Dn,w", "DnT,w", "DnT,A"],
  directRwImportSelectedNow: false,
  directStcToRwEquivalenceOwned: false,
  downloadableReportPayloadsCaptured: false,
  fullBandCurvesCaptured: false,
  reportNumbersAreLocatorsOnly: true,
  sourceMetrics: ["STC", "NOAL_or_NRC_report_locator", "fire_design", "thickness", "weight"],
  toleranceOwnerNamed: false
} as const;

const MATERIAL_AND_TOPOLOGY_POLICY = [
  {
    aliasDecision: "blocked_quietrock_es_or_es_mr_type_x_is_not_generic_gypsum_without_source_mapping",
    localInput: "gypsum_board",
    sourceMaterial: "QuietRock ES or QuietRock ES MR Type X"
  },
  {
    aliasDecision: "blocked_quietrock_530_or_530rf_is_not_generic_gypsum_or_mlv_without_source_mapping",
    localInput: "gypsum_board_or_mlv",
    sourceMaterial: "QuietRock 530 or QuietRock 530 RF Type X"
  },
  {
    aliasDecision: "blocked_pabco_type_x_family_needs_type_x_type_c_and_glass_mat_policy_before_coalescing",
    localInput: "gypsum_board",
    sourceMaterial: "PABCO Type X / FLAME CURB / MOLD CURB / ABUSE CURB / Glass Sheathing"
  },
  {
    aliasDecision: "blocked_glass_fiber_does_not_equal_local_rockwool_or_generic_mineral_wool",
    localInput: "rockwool",
    sourceMaterial: "R-13 or R-19 glass fiber"
  },
  {
    aliasDecision: "blocked_resilient_channel_side_and_spacing_must_not_be_merged_into_generic_resilient_bar",
    localInput: "resilient_bar",
    sourceMaterial: "resilient channel at right angle 24 in oc"
  },
  {
    aliasDecision: "blocked_steel_mil_wood_depth_spacing_and_load_bearing_roles_must_remain_explicit",
    localInput: "generic_steel_or_wood_stud",
    sourceMaterial: "2x4 wood, 2x6 wood, 68 mil steel, 54 mil steel"
  }
] as const;

const FAMILY_BOUNDARY_MATRIX = [
  {
    blockedPromotion: "do_not_promote_pabco_wood_rows_to_generic_timber_or_nrc_triple_leaf_routes",
    sourceFamily: "wood_stud_quietrock_rows",
    targetRouteFamilies: ["timber_stud_context_only", "quietrock_context_only"]
  },
  {
    blockedPromotion: "do_not_promote_pabco_steel_rows_to_existing_lsf_anchors",
    sourceFamily: "steel_stud_quietrock_rows",
    targetRouteFamilies: ["steel_stud_context_only", "resilient_channel_context_only"]
  },
  {
    blockedPromotion: "do_not_promote_pabco_high_stc_rows_to_field_outputs_without_field_overlay",
    sourceFamily: "stc_lab_rows",
    targetRouteFamilies: ["lab_stc_context_only"]
  },
  {
    blockedPromotion: "do_not_use_pabco_glass_fiber_rows_to_fix_uris_rockwool_two_cavity_lane",
    sourceFamily: "glass_fiber_single_cavity_rows",
    targetRouteFamilies: ["rockwool_triple_leaf_negative_boundary"]
  },
  {
    blockedPromotion: "do_not_promote_missing_or_indexed_row_payloads_to_runtime_truth",
    sourceFamily: "indexed_or_summary_report_locator",
    targetRouteFamilies: ["source_payload_required"]
  }
] as const;

const PROTECTED_NEGATIVE_BOUNDARIES = [
  "pabco_quietrock_stc_row_pages_do_not_promote_dyn_echo_rw_or_field_outputs_without_metric_policy",
  "quietrock_es_510_530_545_and_generic_pabco_type_x_do_not_coalesce_with_generic_gypsum_or_mlv_without_material_mapping",
  "pabco_single_staggered_double_stud_rows_do_not_fix_the_uris_2006_split_rockwool_triple_leaf_rw_41_screening_result",
  "pabco_glass_fiber_wood_steel_rc_rows_do_not_reopen_closed_rockwool_usg_national_gypsum_georgia_pacific_british_gypsum_or_knauf_decisions",
  "pabco_summary_report_download_links_are_not_runtime_truth_until_payloads_are_retrieved_and_curve_or_metric_policy_is_owned",
  "pabco_pgd_w_449_24_indexed_locator_requires_fresh_payload_before_runtime_or_confidence_promotion",
  "runtime_support_confidence_evidence_api_route_card_output_card_proposal_report_and_workbench_input_surfaces_remain_frozen"
] as const;

const GATE_A_DECISION = {
  rowsNeedingGateBMappingOrCloseout: PABCO_SOURCE_ROWS.map((row) => row.id),
  runtimeImportSelectedNow: false,
  selectedNextAction: "gate_b_mapping_tolerance_decision_no_runtime",
  selectedNextFile:
    "packages/engine/src/pabco-quietrock-sound-design-guide-source-pack-extraction-gate-b-contract.test.ts"
} as const;

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

describe("PABCO QuietRock Sound Design Guide source-pack extraction Gate A contract", () => {
  it("lands Gate A as no-runtime source row extraction and selects Gate B mapping", () => {
    expect(PABCO_QUIETROCK_GATE_A).toEqual({
      apiShapeChange: false,
      confidencePromotion: false,
      evidencePromotion: false,
      landedGate: "gate_a_extract_pabco_quietrock_sound_design_guide_rows_without_runtime_import",
      numericRuntimeBehaviorChange: false,
      outputCardStatusChange: false,
      outputSupportChange: false,
      proposalReportCopyChange: false,
      routeCardValueChange: false,
      runtimeImportReadyNow: false,
      runtimeImportSelectedNow: false,
      selectedNextAction: "gate_b_mapping_tolerance_decision_no_runtime",
      selectedNextFile:
        "packages/engine/src/pabco-quietrock-sound-design-guide-source-pack-extraction-gate-b-contract.test.ts",
      sliceId: "pabco_quietrock_sound_design_guide_source_pack_extraction_v1",
      status: "pabco_quietrock_sound_design_guide_rows_extracted_no_runtime_selected_mapping_tolerance_gate_b",
      supportPromotion: false,
      workbenchInputBehaviorChange: false
    });

    for (const path of REQUIRED_DOCS) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("extracts representative PABCO rows with product, topology, STC, and report-locator context", () => {
    expect(PABCO_SOURCE_ROWS.map((row) => row.id)).toEqual([
      "PABCO_PGD_W_646_16_QR_ES_WOOD_2X4_16OC_STC41_NOAL17_0730",
      "PABCO_PGD_W_445_16_QR_ES_WOOD_2X4_RC_16OC_STC57_NOAL17_0745",
      "PABCO_PGD_W_449_24_QR530_WOOD_2X4_24OC_THREE_LAYERS_STC57_NRC_TLA_04_035",
      "PABCO_PGD_68_534_16_QR_ES_STEEL_68MIL_RC_16OC_STC50_NOAL18_0611",
      "PABCO_PGD_546_407_16_QR_ES_STEEL_54MIL_RC_16OC_DOUBLE_TYPEX_STC60_NOAL21_0358",
      "PABCO_PGD_W6_467_24_QR530_WOOD_2X6_24OC_STC56_NOAL21_1053"
    ]);
    expect(new Set(PABCO_SOURCE_ROWS.map((row) => row.family))).toEqual(
      new Set<PabcoFamily>([
        "steel_stud_quietrock_resilient_channel_wall",
        "wood_stud_quietrock_530_wall",
        "wood_stud_quietrock_es_resilient_channel_wall",
        "wood_stud_quietrock_es_single_stud_wall",
        "wood_stud_quietrock_multilayer_wall"
      ])
    );
    expect(PABCO_SOURCE_ROWS.map((row) => row.stc)).toEqual([41, 57, 57, 50, 60, 56]);
    expect(PABCO_SOURCE_ROWS.map((row) => row.reportNumber)).toEqual([
      "NOAL 17-0730",
      "NOAL 17-0745",
      "NRC TLA-04-035",
      "NOAL 18-0611",
      "NOAL 21-0358",
      "NOAL 21-1053"
    ]);
    expect(PABCO_SOURCE_ROWS.filter((row) => row.pagePayloadCaptured)).toHaveLength(5);
    expect(PABCO_SOURCE_ROWS.every((row) => row.sourceUrl.startsWith("https://pabcogypsum.com/"))).toBe(true);
    expect(PABCO_SOURCE_ROWS.every((row) => row.exactRwMetricOwned === false)).toBe(true);
    expect(PABCO_SOURCE_ROWS.every((row) => row.downloadableSummaryReportPayloadCaptured === false)).toBe(true);
  });

  it("keeps Sound Design Guide and Sound Assembly Tool context separate from runtime truth", () => {
    expect(SOURCE_SURFACE_COVERAGE).toEqual({
      downloadableSummaryReportsAdvertised: true,
      guideLandingClaimsOverFireAndSoundDesigns: 220,
      guideLandingClaimsNewWallAssemblies: 50,
      interactiveFiltersVisible: [
        "stud_type",
        "wall_stud_config",
        "stud_thickness",
        "stud_spacing",
        "fire_rating",
        "steel_stud_mil_thickness",
        "product"
      ],
      officialGuideLandingAvailable: true,
      rowPagesCapturedNow: 5,
      rowPagesRequiringFreshPayloadRetrieval: 1,
      selectorPageAvailable: true,
      sourceUrls: [SOUND_DESIGN_GUIDE_URL, SOUND_ASSEMBLY_TOOL_URL]
    });
    expect(PABCO_SOURCE_ROWS.every((row) => row.firstMissingRequirement.includes("payload"))).toBe(true);
  });

  it("blocks STC report locators from becoming DynEcho Rw or field outputs", () => {
    expect(METRIC_POLICY).toEqual({
      blockedFieldOutputs: ["R'w", "Dn,w", "DnT,w", "DnT,A"],
      directRwImportSelectedNow: false,
      directStcToRwEquivalenceOwned: false,
      downloadableReportPayloadsCaptured: false,
      fullBandCurvesCaptured: false,
      reportNumbersAreLocatorsOnly: true,
      sourceMetrics: ["STC", "NOAL_or_NRC_report_locator", "fire_design", "thickness", "weight"],
      toleranceOwnerNamed: false
    });
    expect(new Set(PABCO_SOURCE_ROWS.map((row) => row.metricContext))).toEqual(
      new Set<PabcoMetricContext>(["stc_report_number_locator", "stc_static_row_with_report_locator"])
    );
    expect(PABCO_SOURCE_ROWS.some((row) => row.stc >= 60)).toBe(true);
    expect(PABCO_SOURCE_ROWS.every((row) => row.blockedTargetOutputs.includes("R'w"))).toBe(true);
  });

  it("blocks QuietRock, PABCO Type X, glass fiber, resilient-channel, stud-depth, and gauge coalescing", () => {
    expect(MATERIAL_AND_TOPOLOGY_POLICY.map((entry) => `${entry.sourceMaterial}:${entry.localInput}`)).toEqual([
      "QuietRock ES or QuietRock ES MR Type X:gypsum_board",
      "QuietRock 530 or QuietRock 530 RF Type X:gypsum_board_or_mlv",
      "PABCO Type X / FLAME CURB / MOLD CURB / ABUSE CURB / Glass Sheathing:gypsum_board",
      "R-13 or R-19 glass fiber:rockwool",
      "resilient channel at right angle 24 in oc:resilient_bar",
      "2x4 wood, 2x6 wood, 68 mil steel, 54 mil steel:generic_steel_or_wood_stud"
    ]);
    expect(MATERIAL_AND_TOPOLOGY_POLICY.every((entry) => entry.aliasDecision.startsWith("blocked"))).toBe(true);
    const aliasDecisions = MATERIAL_AND_TOPOLOGY_POLICY.map((entry) => entry.aliasDecision).join("\n");
    expect(aliasDecisions).toContain("does_not_equal_local_rockwool");
    expect(aliasDecisions).not.toContain("runtime_exact");
  });

  it("holds source-family boundaries for wood, steel, high-STC, glass-fiber, and indexed payload rows", () => {
    expect(FAMILY_BOUNDARY_MATRIX).toHaveLength(5);
    expect(FAMILY_BOUNDARY_MATRIX.map((entry) => entry.blockedPromotion)).toEqual([
      "do_not_promote_pabco_wood_rows_to_generic_timber_or_nrc_triple_leaf_routes",
      "do_not_promote_pabco_steel_rows_to_existing_lsf_anchors",
      "do_not_promote_pabco_high_stc_rows_to_field_outputs_without_field_overlay",
      "do_not_use_pabco_glass_fiber_rows_to_fix_uris_rockwool_two_cavity_lane",
      "do_not_promote_missing_or_indexed_row_payloads_to_runtime_truth"
    ]);
    expect(FAMILY_BOUNDARY_MATRIX.flatMap((entry) => entry.targetRouteFamilies)).not.toContain("runtime_import_ready");
  });

  it("protects the original split-rockwool defect and closed near-source boundaries", () => {
    const liveResult = calculateAssembly(SPLIT_ROCKWOOL_STACK, {
      airborneContext: COMPLETE_TRIPLE_LEAF_CONTEXT,
      calculator: "dynamic",
      targetOutputs: ["Rw"]
    });

    expect(GATE_A_DECISION).toEqual({
      rowsNeedingGateBMappingOrCloseout: [
        "PABCO_PGD_W_646_16_QR_ES_WOOD_2X4_16OC_STC41_NOAL17_0730",
        "PABCO_PGD_W_445_16_QR_ES_WOOD_2X4_RC_16OC_STC57_NOAL17_0745",
        "PABCO_PGD_W_449_24_QR530_WOOD_2X4_24OC_THREE_LAYERS_STC57_NRC_TLA_04_035",
        "PABCO_PGD_68_534_16_QR_ES_STEEL_68MIL_RC_16OC_STC50_NOAL18_0611",
        "PABCO_PGD_546_407_16_QR_ES_STEEL_54MIL_RC_16OC_DOUBLE_TYPEX_STC60_NOAL21_0358",
        "PABCO_PGD_W6_467_24_QR530_WOOD_2X6_24OC_STC56_NOAL21_1053"
      ],
      runtimeImportSelectedNow: false,
      selectedNextAction: "gate_b_mapping_tolerance_decision_no_runtime",
      selectedNextFile:
        "packages/engine/src/pabco-quietrock-sound-design-guide-source-pack-extraction-gate-b-contract.test.ts"
    });
    expect(PROTECTED_NEGATIVE_BOUNDARIES).toHaveLength(7);
    expect(PROTECTED_NEGATIVE_BOUNDARIES.join("\n")).toContain("do_not_fix_the_uris_2006_split_rockwool");
    expect(PROTECTED_NEGATIVE_BOUNDARIES.join("\n")).toContain("do_not_coalesce_with_generic_gypsum_or_mlv");
    expect(PROTECTED_NEGATIVE_BOUNDARIES.join("\n")).toContain("summary_report_download_links_are_not_runtime_truth");
    expect(liveResult.metrics.estimatedRwDb).toBe(50);
    expect(liveResult.dynamicAirborneTrace?.strategy).toBe("triple_leaf_two_cavity_frequency_solver_family_physics_prediction");
    expect(liveResult.dynamicAirborneTrace?.confidenceClass).toBe("medium");
  });

  it("keeps active docs aligned on Gate B as the next no-runtime action", () => {
    const docs = REQUIRED_DOCS.map((path) => readRepoFile(path)).join("\n");

    expect(docs).toContain(PABCO_QUIETROCK_GATE_A.sliceId);
    expect(docs).toContain(PABCO_QUIETROCK_GATE_A.status);
    expect(docs).toContain(PABCO_QUIETROCK_GATE_A.selectedNextAction);
    expect(docs).toContain(PABCO_QUIETROCK_GATE_A.selectedNextFile);
    expect(docs).toContain(SOUND_DESIGN_GUIDE_URL);
    expect(docs).toContain(SOUND_ASSEMBLY_TOOL_URL);

    for (const row of PABCO_SOURCE_ROWS) {
      expect(docs, row.id).toContain(row.id);
      expect(docs, row.sourceUrl).toContain(row.sourceUrl);
      expect(docs, row.protectedBoundary).toContain(row.protectedBoundary);
    }

    for (const boundary of PROTECTED_NEGATIVE_BOUNDARIES) {
      expect(docs, boundary).toContain(boundary);
    }
  });
});
