import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

type Readiness = {
  exactRowLocatorNamed: boolean;
  localMaterialMappingComplete: boolean;
  metricOwnerNamed: boolean;
  pairedEngineTestsNamed: boolean;
  pairedWebTestsNamed: boolean;
  protectedNegativeBoundariesNamed: boolean;
  runtimeImportReadyNow: false;
  toleranceOwnerNamed: boolean;
};

type SourceLocator = {
  coveredFamilies: readonly string[];
  firstMissingRequirement: string;
  id: string;
  locator: string;
  rank: number;
  readiness: Readiness;
  reportedMetrics: readonly string[];
  retrievalDate: "2026-05-02";
  rowExamples: readonly string[];
  selectedForNoRuntimeExtraction: boolean;
  sourceLabel: string;
  sourceUrl: string;
  userVisibleRisk: string;
};

const CALCULATOR_POST_GEORGIA_PACIFIC_SOURCE_ACQUISITION_GATE_A = {
  apiShapeChange: false,
  confidencePromotion: false,
  evidencePromotion: false,
  landedGate: "gate_a_acquire_and_classify_post_georgia_pacific_source_locators_without_runtime_import",
  latestClosedSlice: "calculator_source_gap_revalidation_v13",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: false,
  outputSupportChange: false,
  proposalReportCopyChange: false,
  routeCardValueChange: false,
  runtimeImportSelectedNow: false,
  runtimeTightening: false,
  runtimeWidening: false,
  selectedImplementationSlice: "pabco_quietrock_sound_design_guide_source_pack_extraction_v1",
  selectedPlanningSurface: "docs/calculator/SLICE_PABCO_QUIETROCK_SOUND_DESIGN_GUIDE_SOURCE_PACK_EXTRACTION_PLAN.md",
  selectedRouteFamily: "pabco_quietrock_sound_design_guide_wall_assembly_source_locator_extraction_no_runtime",
  selectionStatus:
    "selected_pabco_quietrock_sound_design_guide_source_pack_extraction_after_post_georgia_pacific_acquisition_found_official_row_pages_but_no_runtime_ready_import",
  sliceId: "calculator_post_georgia_pacific_source_acquisition_v1",
  sourceReadyRuntimePackAvailable: false,
  supportPromotion: false,
  targetFirstGateFile:
    "packages/engine/src/pabco-quietrock-sound-design-guide-source-pack-extraction-gate-a-contract.test.ts",
  workbenchInputBehaviorChange: false
} as const;

const REQUIRED_PLANNING_SURFACES = [
  "packages/engine/src/calculator-post-georgia-pacific-source-acquisition-gate-a-contract.test.ts",
  "packages/engine/src/calculator-source-gap-revalidation-v13-gate-a-contract.test.ts",
  "docs/calculator/SLICE_CALCULATOR_POST_GEORGIA_PACIFIC_SOURCE_ACQUISITION_V1_PLAN.md",
  "docs/calculator/SLICE_PABCO_QUIETROCK_SOUND_DESIGN_GUIDE_SOURCE_PACK_EXTRACTION_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-02_CALCULATOR_POST_GEORGIA_PACIFIC_SOURCE_ACQUISITION_GATE_A_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-05-02_CALCULATOR_SOURCE_GAP_REVALIDATION_V13_GATE_A_HANDOFF.md",
  "docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md",
  "docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md",
  "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "AGENTS.md"
] as const;

const POST_GEORGIA_PACIFIC_SOURCE_LOCATORS: readonly SourceLocator[] = [
  {
    coveredFamilies: [
      "wood_stud_quietrock_single_staggered_and_double_stud_wall",
      "steel_stud_quietrock_resilient_channel_wall",
      "area_separation_wall_context",
      "pabco_material_alias_and_stc_metric_policy_context"
    ],
    firstMissingRequirement:
      "extract_row_by_row_product_layer_stud_type_spacing_resilient_channel_insulation_summary_report_payload_stc_metric_policy_tolerance_owner_material_mapping_negative_boundaries_and_paired_visible_tests",
    id: "pabco_quietrock_sound_design_guide_and_selector",
    locator:
      "PABCO Gypsum / QuietRock Sound Design Guide 2025 and Sound Assembly Tool: tested wall assembly pages with STC, fire design, thickness, weight, bearing, test report number, and product/stud/insulation details",
    rank: 1,
    readiness: {
      exactRowLocatorNamed: true,
      localMaterialMappingComplete: false,
      metricOwnerNamed: true,
      pairedEngineTestsNamed: false,
      pairedWebTestsNamed: false,
      protectedNegativeBoundariesNamed: true,
      runtimeImportReadyNow: false,
      toleranceOwnerNamed: false
    },
    reportedMetrics: ["STC", "NOAL_or_NRC_test_report_number", "fire_design_context"],
    retrievalDate: "2026-05-02",
    rowExamples: [
      "PGD-W-646-16_2x4_wood_16oc_QR_ES_typeX_one_side_typeX_other_side_STC41_NOAL17_0730",
      "PGD-W-445-16_2x4_wood_16oc_QR_ES_resilient_channel_double_typeX_STC57_NOAL17_0745",
      "PGD-W-449-24_2x4_wood_24oc_QR530_three_layers_STC57_NRC_TLA_04_035",
      "PGD-68-534-16_3_5_8_68mil_steel_16oc_QR_ES_RC_typeX_STC50_NOAL18_0611",
      "PGD-546-407-16_6in_54mil_steel_16oc_QR_ES_RC_double_typeX_STC60_NOAL21_0358",
      "PGD-W6-467-24_2x6_wood_24oc_QR530_STC56_NOAL21_1053"
    ],
    selectedForNoRuntimeExtraction: true,
    sourceLabel: "PABCO Gypsum / QuietRock Sound Design Guide and Sound Assembly Tool",
    sourceUrl: "https://go.pabcogypsum.com/tsdg",
    userVisibleRisk:
      "official_stc_row_pages_can_false_promote_dyn_echo_rw_field_outputs_or_generic_gypsum_material_aliases_without_metric_policy_material_mapping_tolerance_and_visible_tests"
  },
  {
    coveredFamilies: ["silentfx_steel_stud_astc_context", "field_output_policy_context"],
    firstMissingRequirement:
      "separate_direct_stc_or_rw_lab_row_truth_from_astc_field_or_flanking_examples_before_any_dyn_echo_runtime_metric_or_output_card_promotion",
    id: "certainteed_silentfx_nrc_astc_and_product_data_context",
    locator:
      "NRC Canada CertainTeed SilentFX ASTC high-rise report plus CertainTeed SilentFX product data with example STC rows",
    rank: 2,
    readiness: {
      exactRowLocatorNamed: true,
      localMaterialMappingComplete: false,
      metricOwnerNamed: true,
      pairedEngineTestsNamed: false,
      pairedWebTestsNamed: false,
      protectedNegativeBoundariesNamed: true,
      runtimeImportReadyNow: false,
      toleranceOwnerNamed: false
    },
    reportedMetrics: ["ASTC", "STC", "field_or_flanking_context"],
    retrievalDate: "2026-05-02",
    rowExamples: [
      "NRC_CertainTeed_SilentFX_ASTC_high_rise_22_examples",
      "CTG-2481_SilentFX_U465_STC57_product_data_example",
      "CTG-2481_SilentFX_U309_STC51_product_data_example"
    ],
    selectedForNoRuntimeExtraction: false,
    sourceLabel: "CertainTeed SilentFX NRC ASTC report and product data",
    sourceUrl: "https://publications-cnrc.canada.ca/eng/view/object/?id=f308069f-1b20-4aac-bc6d-e7b174ff21bb",
    userVisibleRisk:
      "astc_and_product_data_examples_can_leak_into_dyn_echo_field_outputs_or_lab_rw_claims_if_metric_policy_is_not_explicit"
  },
  {
    coveredFamilies: ["generic_gypsum_wall_floor_ceiling_sound_control_context"],
    firstMissingRequirement:
      "obtain_rights_safe_current_row_payloads_before_treating_ga_600_as_extractable_runtime_or_mapping_truth",
    id: "gypsum_association_ga600_2024_sound_control_manual_context",
    locator:
      "Gypsum Association GA-600-2024 Fire Resistance and Sound Control Design Manual product page and older public manual context",
    rank: 3,
    readiness: {
      exactRowLocatorNamed: false,
      localMaterialMappingComplete: false,
      metricOwnerNamed: true,
      pairedEngineTestsNamed: false,
      pairedWebTestsNamed: false,
      protectedNegativeBoundariesNamed: true,
      runtimeImportReadyNow: false,
      toleranceOwnerNamed: false
    },
    reportedMetrics: ["STC", "IIC", "fire_resistance_design_context"],
    retrievalDate: "2026-05-02",
    rowExamples: ["GA-600-2024_current_product_page", "GA-600_older_public_sound_control_index_context"],
    selectedForNoRuntimeExtraction: false,
    sourceLabel: "Gypsum Association GA-600-2024 sound-control manual context",
    sourceUrl: "https://gypsumpublications.com/product/fire-resistance-and-sound-control-design-manual-ga-600-2024/",
    userVisibleRisk:
      "manual_context_is_authoritative_but_current_rights_safe_row_payloads_are_not_in_the_runtime_corpus"
  },
  {
    coveredFamilies: ["closed_manufacturer_source_pack_context", "near_source_negative_boundaries"],
    firstMissingRequirement:
      "new_payload_truth_not_already_closed_by_rockwool_usg_national_gypsum_georgia_pacific_british_gypsum_knauf_or_uris_lane",
    id: "closed_official_locator_chain_after_georgia_pacific",
    locator:
      "ROCKWOOL, USG, National Gypsum, Georgia-Pacific, British Gypsum, Knauf, and paused Uris 2006 decisions remain context only",
    rank: 4,
    readiness: {
      exactRowLocatorNamed: false,
      localMaterialMappingComplete: false,
      metricOwnerNamed: false,
      pairedEngineTestsNamed: false,
      pairedWebTestsNamed: false,
      protectedNegativeBoundariesNamed: true,
      runtimeImportReadyNow: false,
      toleranceOwnerNamed: false
    },
    reportedMetrics: ["STC", "OITC", "IIC", "Rw", "field_context"],
    retrievalDate: "2026-05-02",
    rowExamples: [
      "closed_georgia_pacific_stc_planning_rows",
      "closed_national_gypsum_selector_rows",
      "closed_usg_levelrock_and_partition_rows",
      "paused_uris_2006_rights_safe_packet_lane"
    ],
    selectedForNoRuntimeExtraction: false,
    sourceLabel: "Closed official locator chain after Georgia-Pacific",
    sourceUrl: "docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md",
    userVisibleRisk:
      "closed_official_context_can_look_more_reliable_than_screening_but_must_not_reopen_without_new_exact_payload_truth"
  }
] as const;

const PABCO_EXTRACTION_SCOPE = {
  firstGate: "gate_a_extract_pabco_quietrock_sound_design_guide_rows_without_runtime_import",
  requiredArtifacts: [
    "row_locator_matrix_for_pabco_pgd_wood_steel_area_separation_and_quietrock_product_pages",
    "product_layers_stud_type_spacing_resilient_channel_insulation_fire_design_stc_and_test_report_number_per_row",
    "stc_to_dyn_echo_rw_field_output_metric_policy_or_explicit_metric_rejection",
    "local_material_alias_decision_for_quietrock_es_510_530_545_pabco_type_x_glass_fiber_and_generic_gypsum_without_coalescing",
    "negative_boundaries_for_uris_2006_triple_leaf_closed_gp_national_gypsum_usg_rockwool_british_gypsum_knauf_and_ga600_context",
    "paired_engine_and_web_visible_test_plan_before_any_runtime_or_visible_movement"
  ],
  runtimeBehaviorChange: false,
  selectedPlanningSurface: "docs/calculator/SLICE_PABCO_QUIETROCK_SOUND_DESIGN_GUIDE_SOURCE_PACK_EXTRACTION_PLAN.md",
  targetFirstGateFile:
    "packages/engine/src/pabco-quietrock-sound-design-guide-source-pack-extraction-gate-a-contract.test.ts"
} as const;

const PROTECTED_NEGATIVE_BOUNDARIES = [
  "pabco_quietrock_stc_row_pages_do_not_promote_dyn_echo_rw_or_field_outputs_without_metric_policy",
  "quietrock_es_510_530_545_and_generic_pabco_type_x_do_not_coalesce_with_generic_gypsum_or_mlv_without_material_mapping",
  "pabco_single_staggered_double_stud_rows_do_not_fix_the_uris_2006_split_rockwool_triple_leaf_rw_41_screening_result",
  "pabco_glass_fiber_wood_steel_rc_rows_do_not_reopen_closed_rockwool_usg_national_gypsum_georgia_pacific_british_gypsum_or_knauf_decisions",
  "pabco_summary_report_download_links_are_not_runtime_truth_until_payloads_are_retrieved_and_curve_or_metric_policy_is_owned"
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

describe("calculator post-Georgia-Pacific source acquisition Gate A contract", () => {
  it("lands Gate A without runtime or visible-surface movement", () => {
    expect(CALCULATOR_POST_GEORGIA_PACIFIC_SOURCE_ACQUISITION_GATE_A).toEqual({
      apiShapeChange: false,
      confidencePromotion: false,
      evidencePromotion: false,
      landedGate: "gate_a_acquire_and_classify_post_georgia_pacific_source_locators_without_runtime_import",
      latestClosedSlice: "calculator_source_gap_revalidation_v13",
      numericRuntimeBehaviorChange: false,
      outputCardStatusChange: false,
      outputSupportChange: false,
      proposalReportCopyChange: false,
      routeCardValueChange: false,
      runtimeImportSelectedNow: false,
      runtimeTightening: false,
      runtimeWidening: false,
      selectedImplementationSlice: "pabco_quietrock_sound_design_guide_source_pack_extraction_v1",
      selectedPlanningSurface:
        "docs/calculator/SLICE_PABCO_QUIETROCK_SOUND_DESIGN_GUIDE_SOURCE_PACK_EXTRACTION_PLAN.md",
      selectedRouteFamily: "pabco_quietrock_sound_design_guide_wall_assembly_source_locator_extraction_no_runtime",
      selectionStatus:
        "selected_pabco_quietrock_sound_design_guide_source_pack_extraction_after_post_georgia_pacific_acquisition_found_official_row_pages_but_no_runtime_ready_import",
      sliceId: "calculator_post_georgia_pacific_source_acquisition_v1",
      sourceReadyRuntimePackAvailable: false,
      supportPromotion: false,
      targetFirstGateFile:
        "packages/engine/src/pabco-quietrock-sound-design-guide-source-pack-extraction-gate-a-contract.test.ts",
      workbenchInputBehaviorChange: false
    });

    for (const path of REQUIRED_PLANNING_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("classifies post-Georgia-Pacific source locators without importing them", () => {
    expect(POST_GEORGIA_PACIFIC_SOURCE_LOCATORS.map((locator) => locator.id)).toEqual([
      "pabco_quietrock_sound_design_guide_and_selector",
      "certainteed_silentfx_nrc_astc_and_product_data_context",
      "gypsum_association_ga600_2024_sound_control_manual_context",
      "closed_official_locator_chain_after_georgia_pacific"
    ]);
    expect(POST_GEORGIA_PACIFIC_SOURCE_LOCATORS.map((locator) => locator.rank)).toEqual([1, 2, 3, 4]);
    expect(POST_GEORGIA_PACIFIC_SOURCE_LOCATORS.every((locator) => locator.retrievalDate === "2026-05-02")).toBe(
      true
    );
    expect(POST_GEORGIA_PACIFIC_SOURCE_LOCATORS.every((locator) => locator.reportedMetrics.length > 0)).toBe(true);
    expect(POST_GEORGIA_PACIFIC_SOURCE_LOCATORS.every((locator) => locator.firstMissingRequirement.length > 90)).toBe(
      true
    );
  });

  it("selects PABCO only for no-runtime source-pack extraction", () => {
    expect(POST_GEORGIA_PACIFIC_SOURCE_LOCATORS.filter((locator) => locator.selectedForNoRuntimeExtraction)).toEqual([
      expect.objectContaining({
        id: "pabco_quietrock_sound_design_guide_and_selector",
        readiness: expect.objectContaining({
          exactRowLocatorNamed: true,
          localMaterialMappingComplete: false,
          metricOwnerNamed: true,
          pairedEngineTestsNamed: false,
          pairedWebTestsNamed: false,
          runtimeImportReadyNow: false,
          toleranceOwnerNamed: false
        })
      })
    ]);
    expect(POST_GEORGIA_PACIFIC_SOURCE_LOCATORS.every((locator) => locator.readiness.runtimeImportReadyNow === false)).toBe(
      true
    );
  });

  it("pins the PABCO row examples that make extraction worthwhile", () => {
    const pabco = POST_GEORGIA_PACIFIC_SOURCE_LOCATORS[0];

    expect(pabco.rowExamples).toEqual([
      "PGD-W-646-16_2x4_wood_16oc_QR_ES_typeX_one_side_typeX_other_side_STC41_NOAL17_0730",
      "PGD-W-445-16_2x4_wood_16oc_QR_ES_resilient_channel_double_typeX_STC57_NOAL17_0745",
      "PGD-W-449-24_2x4_wood_24oc_QR530_three_layers_STC57_NRC_TLA_04_035",
      "PGD-68-534-16_3_5_8_68mil_steel_16oc_QR_ES_RC_typeX_STC50_NOAL18_0611",
      "PGD-546-407-16_6in_54mil_steel_16oc_QR_ES_RC_double_typeX_STC60_NOAL21_0358",
      "PGD-W6-467-24_2x6_wood_24oc_QR530_STC56_NOAL21_1053"
    ]);
    expect(pabco.coveredFamilies).toContain("wood_stud_quietrock_single_staggered_and_double_stud_wall");
    expect(pabco.coveredFamilies).toContain("steel_stud_quietrock_resilient_channel_wall");
    expect(pabco.userVisibleRisk).toContain("false_promote_dyn_echo_rw_field_outputs");
  });

  it("defines the selected PABCO extraction scope before any runtime movement", () => {
    expect(PABCO_EXTRACTION_SCOPE).toEqual({
      firstGate: "gate_a_extract_pabco_quietrock_sound_design_guide_rows_without_runtime_import",
      requiredArtifacts: [
        "row_locator_matrix_for_pabco_pgd_wood_steel_area_separation_and_quietrock_product_pages",
        "product_layers_stud_type_spacing_resilient_channel_insulation_fire_design_stc_and_test_report_number_per_row",
        "stc_to_dyn_echo_rw_field_output_metric_policy_or_explicit_metric_rejection",
        "local_material_alias_decision_for_quietrock_es_510_530_545_pabco_type_x_glass_fiber_and_generic_gypsum_without_coalescing",
        "negative_boundaries_for_uris_2006_triple_leaf_closed_gp_national_gypsum_usg_rockwool_british_gypsum_knauf_and_ga600_context",
        "paired_engine_and_web_visible_test_plan_before_any_runtime_or_visible_movement"
      ],
      runtimeBehaviorChange: false,
      selectedPlanningSurface: "docs/calculator/SLICE_PABCO_QUIETROCK_SOUND_DESIGN_GUIDE_SOURCE_PACK_EXTRACTION_PLAN.md",
      targetFirstGateFile:
        "packages/engine/src/pabco-quietrock-sound-design-guide-source-pack-extraction-gate-a-contract.test.ts"
    });
  });

  it("protects closed and near-source boundaries while the PABCO pack is extracted", () => {
    expect(PROTECTED_NEGATIVE_BOUNDARIES).toHaveLength(5);
    expect(PROTECTED_NEGATIVE_BOUNDARIES.every((boundary) => boundary.length > 85)).toBe(true);
    expect(PROTECTED_NEGATIVE_BOUNDARIES.join("\n")).toContain("do_not_fix_the_uris_2006_split_rockwool");
    expect(PROTECTED_NEGATIVE_BOUNDARIES.join("\n")).toContain("do_not_coalesce_with_generic_gypsum_or_mlv");
    expect(PROTECTED_NEGATIVE_BOUNDARIES.join("\n")).toContain("summary_report_download_links_are_not_runtime_truth");
  });

  it("keeps active docs aligned on the selected PABCO source-pack extraction slice", () => {
    const docs = [
      readRepoFile("AGENTS.md"),
      readRepoFile("docs/calculator/NEXT_IMPLEMENTATION_PLAN.md"),
      readRepoFile("docs/calculator/CURRENT_STATE.md"),
      readRepoFile("docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md"),
      readRepoFile("docs/calculator/SLICE_CALCULATOR_POST_GEORGIA_PACIFIC_SOURCE_ACQUISITION_V1_PLAN.md"),
      readRepoFile(CALCULATOR_POST_GEORGIA_PACIFIC_SOURCE_ACQUISITION_GATE_A.selectedPlanningSurface),
      readRepoFile(
        "docs/calculator/CHECKPOINT_2026-05-02_CALCULATOR_POST_GEORGIA_PACIFIC_SOURCE_ACQUISITION_GATE_A_HANDOFF.md"
      ),
      readRepoFile("docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md"),
      readRepoFile("docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md")
    ];

    for (const doc of docs) {
      expect(doc).toContain(CALCULATOR_POST_GEORGIA_PACIFIC_SOURCE_ACQUISITION_GATE_A.selectedImplementationSlice);
      expect(doc).toContain(CALCULATOR_POST_GEORGIA_PACIFIC_SOURCE_ACQUISITION_GATE_A.targetFirstGateFile);
      expect(doc).toContain(CALCULATOR_POST_GEORGIA_PACIFIC_SOURCE_ACQUISITION_GATE_A.selectionStatus);
      expect(doc).toContain("PABCO Gypsum / QuietRock Sound Design Guide");
      expect(doc).toContain("gate_a_extract_pabco_quietrock_sound_design_guide_rows_without_runtime_import");
    }
  });

  it("keeps frozen surfaces and validation expectations explicit", () => {
    const joinedDocs = [
      readRepoFile(
        "docs/calculator/CHECKPOINT_2026-05-02_CALCULATOR_POST_GEORGIA_PACIFIC_SOURCE_ACQUISITION_GATE_A_HANDOFF.md"
      ),
      readRepoFile("docs/calculator/SLICE_CALCULATOR_POST_GEORGIA_PACIFIC_SOURCE_ACQUISITION_V1_PLAN.md"),
      readRepoFile("docs/calculator/SLICE_PABCO_QUIETROCK_SOUND_DESIGN_GUIDE_SOURCE_PACK_EXTRACTION_PLAN.md")
    ].join("\n");

    for (const surface of FROZEN_SURFACES) {
      expect(joinedDocs, surface).toContain(surface);
    }

    expect(joinedDocs).toContain(
      "pnpm --filter @dynecho/engine exec vitest run src/calculator-post-georgia-pacific-source-acquisition-gate-a-contract.test.ts --maxWorkers=1"
    );
    expect(joinedDocs).toContain("pnpm calculator:gate:current");
    expect(joinedDocs).toContain("git diff --check");
  });
});
