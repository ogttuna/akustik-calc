import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

type CertainTeedGateBDecision = "block_immediate_runtime_import" | "keep_context_only";

type CertainTeedGateBRowDecision = {
  blockedTargetOutputs: readonly string[];
  currentImplementationFit:
    | "ctg_2481_u309_stc51_login_locator_not_dyn_echo_rw_or_field_output"
    | "ctg_2481_u465_stc57_login_locator_not_existing_lsf_anchor"
    | "nrc_astc_field_flanking_examples_not_lab_rw_or_dntw_runtime";
  family:
    | "nrc_astc_high_rise_steel_stud_field_flanking_context"
    | "silentfx_product_data_steel_stud_stc_context";
  firstMissingRequirement: string;
  gateBDecision: CertainTeedGateBDecision;
  localMaterialMapping:
    | "blocked_silentfx_typex_certainteed_typex_25gauge_steel_highrise_mapping_missing"
    | "blocked_silentfx_typex_certainteed_typex_ul_design_payload_and_stc_metric_mapping_missing";
  metricOwner:
    | "astc_field_flanking_without_direct_rw_dntw_policy"
    | "product_stc_locator_without_iso_rw_curve_or_payload_owner";
  protectedBoundary: string;
  requiredEngineTestsBeforeRuntime: readonly string[];
  requiredWebTestsBeforeRuntimeIfVisible: readonly string[];
  rowId: string;
  runtimeImportReadyNow: false;
  selectedRuntimeImportNow: false;
  sourceUrl: string;
  stc: number | null;
  toleranceOwnerNamed: false;
};

type CertainTeedMetricDecision = {
  blockedTargets: readonly string[];
  firstMissingRequirement: string;
  metricContext: "astc_field_flanking" | "material_topology_policy" | "onesource_payload" | "product_stc";
  runtimeOutputReadyNow: false;
};

const CERTAINTEED_GATE_B = {
  apiShapeChange: false,
  confidencePromotion: false,
  evidencePromotion: false,
  landedGate: "gate_b_mapping_tolerance_decision_no_runtime",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: false,
  outputSupportChange: false,
  previousGate: "gate_a_extract_certainteed_silentfx_nrc_astc_rows_without_runtime_import",
  proposalReportCopyChange: false,
  routeCardValueChange: false,
  runtimeImportReadyNow: false,
  runtimeImportSelectedNow: false,
  runtimeTightening: false,
  runtimeWidening: false,
  selectedNextAction: "gate_c_closeout_and_next_slice_selection_no_runtime",
  sliceId: "certainteed_silentfx_nrc_astc_source_pack_extraction_v1",
  status: "certainteed_gate_b_found_no_runtime_ready_row_selected_closeout",
  supportPromotion: false,
  targetNextGateFile:
    "packages/engine/src/post-certainteed-silentfx-nrc-astc-source-pack-extraction-v1-next-slice-selection-contract.test.ts",
  workbenchInputBehaviorChange: false
} as const;

const NRC_ASTC_ARCHIVE_URL =
  "https://publications-cnrc.canada.ca/eng/view/object/?id=f308069f-1b20-4aac-bc6d-e7b174ff21bb";
const CERTAINTEED_CTG_2481_URL = "https://ctonesource.certainteed.com/Products/PDF/CTG-2481.pdf";
const CERTAINTEED_ACOUSTIC_GYPSUM_URL = "https://www.certainteed.com/acoustic-gypsum-board";
const CERTAINTEED_SILENTFX_PRODUCT_URL =
  "https://www.certainteed.com/products/drywall-products/silentfx-quickcut-drywall";

const SOURCE_URLS = [
  NRC_ASTC_ARCHIVE_URL,
  CERTAINTEED_CTG_2481_URL,
  CERTAINTEED_ACOUSTIC_GYPSUM_URL,
  CERTAINTEED_SILENTFX_PRODUCT_URL
] as const;

const REQUIRED_DOCS = [
  "AGENTS.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md",
  "docs/calculator/SLICE_CERTAINTEED_SILENTFX_NRC_ASTC_SOURCE_PACK_EXTRACTION_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-03_CERTAINTEED_SILENTFX_NRC_ASTC_SOURCE_PACK_EXTRACTION_GATE_B_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-05-03_CERTAINTEED_SILENTFX_NRC_ASTC_SOURCE_PACK_EXTRACTION_GATE_A_HANDOFF.md",
  "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md",
  "docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md"
] as const;

const GATE_B_ROW_DECISIONS: readonly CertainTeedGateBRowDecision[] = [
  {
    blockedTargetOutputs: ["Rw", "R'w", "Dn,w", "DnT,w", "DnT,A", "ASTC_as_DynEcho_Rw"],
    currentImplementationFit: "nrc_astc_field_flanking_examples_not_lab_rw_or_dntw_runtime",
    family: "nrc_astc_high_rise_steel_stud_field_flanking_context",
    firstMissingRequirement:
      "nrc_certainteed_astc_high_rise_examples_need_example_level_rights_safe_payload_direct_flanking_split_policy_astc_to_rw_or_explicit_rejection_policy_silentfx_typex_certainteed_typex_25_gauge_steel_stud_mapping_tolerance_owner_and_visible_tests",
    gateBDecision: "keep_context_only",
    localMaterialMapping: "blocked_silentfx_typex_certainteed_typex_25gauge_steel_highrise_mapping_missing",
    metricOwner: "astc_field_flanking_without_direct_rw_dntw_policy",
    protectedBoundary:
      "certainteed_nrc_astc_gate_b_high_rise_examples_do_not_promote_dyn_echo_rw_dntw_or_field_outputs",
    requiredEngineTestsBeforeRuntime: [
      "engine_certainteed_nrc_astc_value_or_rejection_pin",
      "engine_certainteed_nrc_astc_rejects_astc_as_rw_dntw_or_field_runtime_truth"
    ],
    requiredWebTestsBeforeRuntimeIfVisible: [
      "web_certainteed_nrc_astc_route_card_source_context",
      "web_certainteed_nrc_astc_report_keeps_astc_field_flanking_label"
    ],
    rowId: "NRC_CERTAINTEED_SILENTFX_ASTC_HIGH_RISE_22_EXAMPLES_2018",
    runtimeImportReadyNow: false,
    selectedRuntimeImportNow: false,
    sourceUrl: NRC_ASTC_ARCHIVE_URL,
    stc: null,
    toleranceOwnerNamed: false
  },
  {
    blockedTargetOutputs: ["Rw", "R'w", "Dn,w", "DnT,w", "DnT,A", "STC_as_DynEcho_Rw"],
    currentImplementationFit: "ctg_2481_u465_stc57_login_locator_not_existing_lsf_anchor",
    family: "silentfx_product_data_steel_stud_stc_context",
    firstMissingRequirement:
      "ctg_2481_u465_stc57_still_needs_rights_safe_current_pdf_payload_full_ul_u465_layer_fastener_stud_insulation_detail_silentfx_typex_certainteed_typex_material_mapping_stc_to_rw_or_rejection_policy_tolerance_owner_lsf_anchor_precedence_tests_and_visible_tests",
    gateBDecision: "block_immediate_runtime_import",
    localMaterialMapping: "blocked_silentfx_typex_certainteed_typex_ul_design_payload_and_stc_metric_mapping_missing",
    metricOwner: "product_stc_locator_without_iso_rw_curve_or_payload_owner",
    protectedBoundary:
      "certainteed_ctg_2481_u465_gate_b_stc57_login_locator_does_not_replace_existing_lsf_or_generic_gypsum_routes",
    requiredEngineTestsBeforeRuntime: [
      "engine_certainteed_u465_stc57_value_or_rejection_pin",
      "engine_certainteed_u465_stc57_rejects_lsf_anchor_or_generic_gypsum_replacement"
    ],
    requiredWebTestsBeforeRuntimeIfVisible: [
      "web_certainteed_u465_stc57_route_card_source_context",
      "web_certainteed_u465_stc57_report_blocks_stc_to_rw_copy"
    ],
    rowId: "CERTAINTEED_CTG_2481_SILENTFX_U465_STC57_PRODUCT_DATA_EXAMPLE",
    runtimeImportReadyNow: false,
    selectedRuntimeImportNow: false,
    sourceUrl: CERTAINTEED_CTG_2481_URL,
    stc: 57,
    toleranceOwnerNamed: false
  },
  {
    blockedTargetOutputs: ["Rw", "R'w", "Dn,w", "DnT,w", "DnT,A", "STC_as_DynEcho_Rw"],
    currentImplementationFit: "ctg_2481_u309_stc51_login_locator_not_dyn_echo_rw_or_field_output",
    family: "silentfx_product_data_steel_stud_stc_context",
    firstMissingRequirement:
      "ctg_2481_u309_stc51_still_needs_rights_safe_current_pdf_payload_full_ul_u309_layer_fastener_stud_insulation_detail_silentfx_typex_certainteed_typex_material_mapping_stc_to_rw_or_rejection_policy_tolerance_owner_runtime_value_or_rejection_pin_and_visible_tests",
    gateBDecision: "block_immediate_runtime_import",
    localMaterialMapping: "blocked_silentfx_typex_certainteed_typex_ul_design_payload_and_stc_metric_mapping_missing",
    metricOwner: "product_stc_locator_without_iso_rw_curve_or_payload_owner",
    protectedBoundary:
      "certainteed_ctg_2481_u309_gate_b_stc51_login_locator_does_not_promote_dyn_echo_rw_or_field_outputs",
    requiredEngineTestsBeforeRuntime: [
      "engine_certainteed_u309_stc51_value_or_rejection_pin",
      "engine_certainteed_u309_stc51_rejects_product_stc_to_rw_or_field_output_promotion"
    ],
    requiredWebTestsBeforeRuntimeIfVisible: [
      "web_certainteed_u309_stc51_route_card_source_context",
      "web_certainteed_u309_stc51_report_blocks_product_stc_as_runtime_truth"
    ],
    rowId: "CERTAINTEED_CTG_2481_SILENTFX_U309_STC51_PRODUCT_DATA_EXAMPLE",
    runtimeImportReadyNow: false,
    selectedRuntimeImportNow: false,
    sourceUrl: CERTAINTEED_CTG_2481_URL,
    stc: 51,
    toleranceOwnerNamed: false
  }
] as const;

const METRIC_DECISIONS: readonly CertainTeedMetricDecision[] = [
  {
    blockedTargets: ["Rw", "ASTC_as_DynEcho_Rw", "DnT,w", "runtime_import_until_metric_policy_exists"],
    firstMissingRequirement:
      "nrc_astc_examples_include_field_flanking_context_and_need_direct_flanking_split_policy_or_explicit_rejection_before_any_dyn_echo_rw_dntw_or_support_promotion",
    metricContext: "astc_field_flanking",
    runtimeOutputReadyNow: false
  },
  {
    blockedTargets: ["Rw", "STC_as_DynEcho_Rw", "runtime_import_until_curve_or_metric_owner_exists"],
    firstMissingRequirement:
      "certainteed_product_stc_values_need_explicit_rejection_or_iso_717_rw_derivation_from_source_owned_one_third_octave_curves_before_runtime_use",
    metricContext: "product_stc",
    runtimeOutputReadyNow: false
  },
  {
    blockedTargets: ["evidence_tier_promotion", "runtime_import_without_current_rights_safe_pdf_payload"],
    firstMissingRequirement:
      "ctg_2481_onesource_locator_redirects_to_login_and_does_not_supply_current_rights_safe_payload_full_band_curves_or_chain_of_custody",
    metricContext: "onesource_payload",
    runtimeOutputReadyNow: false
  },
  {
    blockedTargets: ["support_promotion", "confidence_promotion", "tolerance_claim_without_error_owner"],
    firstMissingRequirement:
      "certainteed_gate_b_has_no_source_owned_mae_max_error_family_tolerance_owner_or_material_alias_owner_for_screening_to_exact_runtime_movement",
    metricContext: "material_topology_policy",
    runtimeOutputReadyNow: false
  }
] as const;

const MATERIAL_ALIAS_DECISIONS = [
  "silentfx_quickcut_type_x_does_not_coalesce_with_generic_gypsum_without_source_tolerance_owner",
  "certainteed_type_x_does_not_coalesce_with_pabco_type_x_quietrock_type_c_or_generic_gypsum_without_row_policy",
  "certainteed_product_stc_ul_u465_u309_rows_need_full_payload_before_exact_lsf_or_generic_wall_mapping",
  "nrc_astc_25_gauge_steel_stud_high_rise_examples_do_not_replace_existing_lsf_lab_anchors",
  "astc_field_flanking_context_does_not_coalesce_with_lab_rw_or_dntw_outputs",
  "silentfx_context_does_not_coalesce_with_local_mlv_or_uris_2006_triple_leaf_route"
] as const;

const FAMILY_BOUNDARY_DECISIONS = [
  "certainteed_astc_rows_do_not_promote_lab_rw_dntw_or_field_output_routes",
  "certainteed_product_stc_rows_do_not_replace_existing_lsf_anchors",
  "certainteed_silentfx_and_type_x_rows_do_not_promote_generic_gypsum_or_quietrock_aliases",
  "certainteed_onesource_login_locator_rows_do_not_promote_runtime_truth_without_payload",
  "certainteed_gate_b_rows_do_not_fix_the_uris_2006_split_rockwool_triple_leaf_rw_41_screening_result",
  "certainteed_gate_b_rows_do_not_override_closed_pabco_georgia_pacific_national_gypsum_usg_rockwool_british_gypsum_knauf_or_existing_anchors"
] as const;

const PROTECTED_BOUNDARIES = [
  "certainteed_gate_b_source_rows_are_not_runtime_import_approval",
  "certainteed_gate_b_astc_field_flanking_examples_do_not_promote_dyn_echo_rw_dntw_or_field_outputs",
  "certainteed_gate_b_product_stc_values_do_not_promote_dyn_echo_rw_or_field_outputs",
  "certainteed_gate_b_silentfx_typex_certainteed_typex_generic_gypsum_quietrock_and_pabco_type_x_do_not_coalesce_without_mapping_tolerance",
  "certainteed_gate_b_onesource_login_redirect_blocks_runtime_import_and_confidence_promotion",
  "certainteed_gate_b_rows_do_not_override_closed_pabco_georgia_pacific_national_gypsum_usg_rockwool_british_gypsum_knauf_or_existing_anchors",
  "certainteed_gate_b_rows_do_not_fix_the_uris_2006_split_rockwool_triple_leaf_rw_41_screening_result",
  "runtime_support_confidence_evidence_api_route_card_output_card_proposal_report_and_workbench_input_surfaces_remain_frozen"
] as const;

const GATE_B_DECISION = {
  rowsKeptContextOnly: GATE_B_ROW_DECISIONS.map((row) => row.rowId),
  runtimeImportSelectedNow: false,
  selectedNextAction: "gate_c_closeout_and_next_slice_selection_no_runtime",
  targetNextGateFile:
    "packages/engine/src/post-certainteed-silentfx-nrc-astc-source-pack-extraction-v1-next-slice-selection-contract.test.ts"
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

describe("CertainTeed SilentFX NRC ASTC source-pack extraction Gate B contract", () => {
  it("lands Gate B as no-runtime mapping / tolerance decision and selects Gate C closeout", () => {
    expect(CERTAINTEED_GATE_B).toEqual({
      apiShapeChange: false,
      confidencePromotion: false,
      evidencePromotion: false,
      landedGate: "gate_b_mapping_tolerance_decision_no_runtime",
      numericRuntimeBehaviorChange: false,
      outputCardStatusChange: false,
      outputSupportChange: false,
      previousGate: "gate_a_extract_certainteed_silentfx_nrc_astc_rows_without_runtime_import",
      proposalReportCopyChange: false,
      routeCardValueChange: false,
      runtimeImportReadyNow: false,
      runtimeImportSelectedNow: false,
      runtimeTightening: false,
      runtimeWidening: false,
      selectedNextAction: "gate_c_closeout_and_next_slice_selection_no_runtime",
      sliceId: "certainteed_silentfx_nrc_astc_source_pack_extraction_v1",
      status: "certainteed_gate_b_found_no_runtime_ready_row_selected_closeout",
      supportPromotion: false,
      targetNextGateFile:
        "packages/engine/src/post-certainteed-silentfx-nrc-astc-source-pack-extraction-v1-next-slice-selection-contract.test.ts",
      workbenchInputBehaviorChange: false
    });

    for (const path of REQUIRED_DOCS) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("keeps every extracted CertainTeed / NRC row out of runtime with row-specific blockers", () => {
    expect(GATE_B_ROW_DECISIONS.map((row) => row.rowId)).toEqual([
      "NRC_CERTAINTEED_SILENTFX_ASTC_HIGH_RISE_22_EXAMPLES_2018",
      "CERTAINTEED_CTG_2481_SILENTFX_U465_STC57_PRODUCT_DATA_EXAMPLE",
      "CERTAINTEED_CTG_2481_SILENTFX_U309_STC51_PRODUCT_DATA_EXAMPLE"
    ]);
    expect(GATE_B_ROW_DECISIONS.map((row) => row.stc)).toEqual([null, 57, 51]);
    expect(GATE_B_ROW_DECISIONS.every((row) => row.runtimeImportReadyNow === false)).toBe(true);
    expect(GATE_B_ROW_DECISIONS.every((row) => row.selectedRuntimeImportNow === false)).toBe(true);
    expect(GATE_B_ROW_DECISIONS.every((row) => row.toleranceOwnerNamed === false)).toBe(true);
    expect(GATE_B_ROW_DECISIONS.every((row) => row.firstMissingRequirement.length > 170)).toBe(true);
    expect(GATE_B_DECISION.rowsKeptContextOnly).toEqual(GATE_B_ROW_DECISIONS.map((row) => row.rowId));
  });

  it("blocks ASTC, product STC, OneSource locators, and tolerance claims from becoming DynEcho metrics", () => {
    expect(METRIC_DECISIONS).toEqual([
      {
        blockedTargets: ["Rw", "ASTC_as_DynEcho_Rw", "DnT,w", "runtime_import_until_metric_policy_exists"],
        firstMissingRequirement:
          "nrc_astc_examples_include_field_flanking_context_and_need_direct_flanking_split_policy_or_explicit_rejection_before_any_dyn_echo_rw_dntw_or_support_promotion",
        metricContext: "astc_field_flanking",
        runtimeOutputReadyNow: false
      },
      {
        blockedTargets: ["Rw", "STC_as_DynEcho_Rw", "runtime_import_until_curve_or_metric_owner_exists"],
        firstMissingRequirement:
          "certainteed_product_stc_values_need_explicit_rejection_or_iso_717_rw_derivation_from_source_owned_one_third_octave_curves_before_runtime_use",
        metricContext: "product_stc",
        runtimeOutputReadyNow: false
      },
      {
        blockedTargets: ["evidence_tier_promotion", "runtime_import_without_current_rights_safe_pdf_payload"],
        firstMissingRequirement:
          "ctg_2481_onesource_locator_redirects_to_login_and_does_not_supply_current_rights_safe_payload_full_band_curves_or_chain_of_custody",
        metricContext: "onesource_payload",
        runtimeOutputReadyNow: false
      },
      {
        blockedTargets: ["support_promotion", "confidence_promotion", "tolerance_claim_without_error_owner"],
        firstMissingRequirement:
          "certainteed_gate_b_has_no_source_owned_mae_max_error_family_tolerance_owner_or_material_alias_owner_for_screening_to_exact_runtime_movement",
        metricContext: "material_topology_policy",
        runtimeOutputReadyNow: false
      }
    ]);
    expect(METRIC_DECISIONS.every((decision) => decision.runtimeOutputReadyNow === false)).toBe(true);
    expect(PROTECTED_BOUNDARIES).toContain(
      "certainteed_gate_b_product_stc_values_do_not_promote_dyn_echo_rw_or_field_outputs"
    );
  });

  it("requires material and topology alias ownership before any future runtime or visible movement", () => {
    expect(MATERIAL_ALIAS_DECISIONS).toEqual([
      "silentfx_quickcut_type_x_does_not_coalesce_with_generic_gypsum_without_source_tolerance_owner",
      "certainteed_type_x_does_not_coalesce_with_pabco_type_x_quietrock_type_c_or_generic_gypsum_without_row_policy",
      "certainteed_product_stc_ul_u465_u309_rows_need_full_payload_before_exact_lsf_or_generic_wall_mapping",
      "nrc_astc_25_gauge_steel_stud_high_rise_examples_do_not_replace_existing_lsf_lab_anchors",
      "astc_field_flanking_context_does_not_coalesce_with_lab_rw_or_dntw_outputs",
      "silentfx_context_does_not_coalesce_with_local_mlv_or_uris_2006_triple_leaf_route"
    ]);
    expect(
      GATE_B_ROW_DECISIONS.every(
        (row) =>
          row.requiredEngineTestsBeforeRuntime.length === 2 &&
          row.requiredWebTestsBeforeRuntimeIfVisible.length === 2
      )
    ).toBe(true);
    expect(MATERIAL_ALIAS_DECISIONS.join("\n")).toContain(
      "does_not_coalesce_with_generic_gypsum_without_source_tolerance_owner"
    );
    expect(MATERIAL_ALIAS_DECISIONS.join("\n")).not.toContain("runtime_exact");
  });

  it("holds source-family boundaries for ASTC, STC, material aliases, payload gaps, and Uris 2006", () => {
    expect(GATE_B_ROW_DECISIONS.map((row) => row.currentImplementationFit)).toEqual([
      "nrc_astc_field_flanking_examples_not_lab_rw_or_dntw_runtime",
      "ctg_2481_u465_stc57_login_locator_not_existing_lsf_anchor",
      "ctg_2481_u309_stc51_login_locator_not_dyn_echo_rw_or_field_output"
    ]);
    expect(FAMILY_BOUNDARY_DECISIONS).toEqual([
      "certainteed_astc_rows_do_not_promote_lab_rw_dntw_or_field_output_routes",
      "certainteed_product_stc_rows_do_not_replace_existing_lsf_anchors",
      "certainteed_silentfx_and_type_x_rows_do_not_promote_generic_gypsum_or_quietrock_aliases",
      "certainteed_onesource_login_locator_rows_do_not_promote_runtime_truth_without_payload",
      "certainteed_gate_b_rows_do_not_fix_the_uris_2006_split_rockwool_triple_leaf_rw_41_screening_result",
      "certainteed_gate_b_rows_do_not_override_closed_pabco_georgia_pacific_national_gypsum_usg_rockwool_british_gypsum_knauf_or_existing_anchors"
    ]);
    expect(PROTECTED_BOUNDARIES).toContain(
      "certainteed_gate_b_onesource_login_redirect_blocks_runtime_import_and_confidence_promotion"
    );
  });

  it("keeps the original split-rockwool defect and every runtime-visible surface frozen", () => {
    const splitRockwool = calculateAssembly(SPLIT_ROCKWOOL_STACK, {
      airborneContext: COMPLETE_TRIPLE_LEAF_CONTEXT,
      calculator: "dynamic",
      targetOutputs: ["Rw"]
    });

    expect(PROTECTED_BOUNDARIES).toContain(
      "certainteed_gate_b_rows_do_not_fix_the_uris_2006_split_rockwool_triple_leaf_rw_41_screening_result"
    );
    expect(splitRockwool.metrics.estimatedRwDb).toBe(50);
    expect(splitRockwool.dynamicAirborneTrace?.strategy).toBe("triple_leaf_two_cavity_frequency_solver_family_physics_prediction");
    expect(splitRockwool.dynamicAirborneTrace?.confidenceClass).toBe("medium");
    expect(CERTAINTEED_GATE_B.numericRuntimeBehaviorChange).toBe(false);
    expect(CERTAINTEED_GATE_B.runtimeWidening).toBe(false);
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
      "certainteed_gate_b_source_rows_are_not_runtime_import_approval",
      "certainteed_gate_b_astc_field_flanking_examples_do_not_promote_dyn_echo_rw_dntw_or_field_outputs",
      "certainteed_gate_b_product_stc_values_do_not_promote_dyn_echo_rw_or_field_outputs",
      "certainteed_gate_b_silentfx_typex_certainteed_typex_generic_gypsum_quietrock_and_pabco_type_x_do_not_coalesce_without_mapping_tolerance",
      "certainteed_gate_b_onesource_login_redirect_blocks_runtime_import_and_confidence_promotion",
      "certainteed_gate_b_rows_do_not_override_closed_pabco_georgia_pacific_national_gypsum_usg_rockwool_british_gypsum_knauf_or_existing_anchors",
      "certainteed_gate_b_rows_do_not_fix_the_uris_2006_split_rockwool_triple_leaf_rw_41_screening_result",
      "runtime_support_confidence_evidence_api_route_card_output_card_proposal_report_and_workbench_input_surfaces_remain_frozen"
    ]);
    expect(GATE_B_DECISION).toEqual({
      rowsKeptContextOnly: [
        "NRC_CERTAINTEED_SILENTFX_ASTC_HIGH_RISE_22_EXAMPLES_2018",
        "CERTAINTEED_CTG_2481_SILENTFX_U465_STC57_PRODUCT_DATA_EXAMPLE",
        "CERTAINTEED_CTG_2481_SILENTFX_U309_STC51_PRODUCT_DATA_EXAMPLE"
      ],
      runtimeImportSelectedNow: false,
      selectedNextAction: "gate_c_closeout_and_next_slice_selection_no_runtime",
      targetNextGateFile:
        "packages/engine/src/post-certainteed-silentfx-nrc-astc-source-pack-extraction-v1-next-slice-selection-contract.test.ts"
    });
  });

  it("keeps active docs aligned on Gate C closeout as the next no-runtime action", () => {
    const docs = REQUIRED_DOCS.map((path) => readRepoFile(path)).join("\n");

    expect(docs).toContain(CERTAINTEED_GATE_B.sliceId);
    expect(docs).toContain(CERTAINTEED_GATE_B.status);
    expect(docs).toContain(CERTAINTEED_GATE_B.selectedNextAction);
    expect(docs).toContain(CERTAINTEED_GATE_B.targetNextGateFile);

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
