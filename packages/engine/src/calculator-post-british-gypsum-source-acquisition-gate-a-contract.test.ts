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

type OfficialLocator = {
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

const CALCULATOR_POST_BRITISH_GYPSUM_SOURCE_ACQUISITION_GATE_A = {
  apiShapeChange: false,
  confidencePromotion: false,
  evidencePromotion: false,
  landedGate: "gate_a_acquire_and_classify_post_british_gypsum_source_locators_without_runtime_import",
  latestClosedSlice: "calculator_source_gap_revalidation_v9",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: false,
  outputSupportChange: false,
  proposalReportCopyChange: false,
  routeCardValueChange: false,
  runtimeImportSelectedNow: false,
  runtimeTightening: false,
  runtimeWidening: false,
  selectedImplementationSlice: "rockwool_acoustic_wall_assemblies_source_pack_extraction_v1",
  selectedPlanningSurface: "docs/calculator/SLICE_ROCKWOOL_ACOUSTIC_WALL_ASSEMBLIES_SOURCE_PACK_EXTRACTION_PLAN.md",
  selectedRouteFamily: "rockwool_stone_wool_wall_assemblies_official_source_locator_extraction_no_runtime",
  selectionStatus:
    "selected_rockwool_acoustic_wall_assemblies_source_pack_extraction_after_post_british_gypsum_acquisition_found_official_stone_wool_wall_rows_but_no_runtime_ready_import",
  sliceId: "calculator_post_british_gypsum_source_acquisition_v1",
  sourceReadyRuntimePackAvailable: false,
  supportPromotion: false,
  targetFirstGateFile:
    "packages/engine/src/rockwool-acoustic-wall-assemblies-source-pack-extraction-gate-a-contract.test.ts",
  workbenchInputBehaviorChange: false
} as const;

const REQUIRED_PLANNING_SURFACES = [
  "packages/engine/src/calculator-post-british-gypsum-source-acquisition-gate-a-contract.test.ts",
  "packages/engine/src/calculator-source-gap-revalidation-v9-gate-a-contract.test.ts",
  "docs/calculator/SLICE_CALCULATOR_POST_BRITISH_GYPSUM_SOURCE_ACQUISITION_V1_PLAN.md",
  "docs/calculator/SLICE_ROCKWOOL_ACOUSTIC_WALL_ASSEMBLIES_SOURCE_PACK_EXTRACTION_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-02_CALCULATOR_POST_BRITISH_GYPSUM_SOURCE_ACQUISITION_GATE_A_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-05-02_CALCULATOR_SOURCE_GAP_REVALIDATION_V9_GATE_A_HANDOFF.md",
  "docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md",
  "docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md",
  "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "AGENTS.md"
] as const;

const OFFICIAL_SOURCE_LOCATORS: readonly OfficialLocator[] = [
  {
    coveredFamilies: [
      "interior_steel_stud_stone_wool_wall",
      "interior_wood_stud_stone_wool_wall",
      "exterior_steel_stud_stone_wool_wall",
      "rockwool_material_alias_and_negative_boundary_context"
    ],
    firstMissingRequirement:
      "extract_row_by_row_stud_gauge_spacing_gypsum_layers_rockwool_product_thickness_resilient_channel_metric_policy_tolerance_owner_negative_boundaries_and_paired_visible_tests",
    id: "rockwool_acoustic_wall_assemblies_catalog",
    locator:
      "ROCKWOOL Acoustic Wall Assemblies Catalog: interior steel stud ISS rows, interior wood stud IWS rows, exterior steel stud ESS rows with STC/OITC, report number, and ROCKWOOL product references",
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
    reportedMetrics: ["STC", "OITC", "test_report_number"],
    retrievalDate: "2026-05-02",
    rowExamples: [
      "ISS-00_5_8_gypsum_2_1_2_steel_stud_16oc_AFB_1_5in_STC43_OITC28",
      "ISS-22_asymmetric_gypsum_2_1_2_steel_stud_24oc_AFB_1_5in_STC50",
      "ISS-39_2x5_8_gypsum_3_5_8_steel_stud_24oc_AFB_3in_STC57",
      "IWS-04_2x5_8_gypsum_2x4_wood_stud_16oc_AFB_3in_STC40",
      "ESS-05_exterior_steel_stud_Comfortbatt_Cavityrock_STC49"
    ],
    selectedForNoRuntimeExtraction: true,
    sourceLabel: "ROCKWOOL Acoustic Wall Assemblies Catalog technical guide",
    sourceUrl:
      "https://www.rockwool.com/siteassets/o2-rockwool/documentation/technical-guides/commercial/acoustic-wall-assemblies-catalog-techincal-guide.pdf",
    userVisibleRisk:
      "official_stone_wool_rows_are_close_to_the_user_rockwool_material_but_can_false_promote_triple_leaf_or_iso_rw_outputs_if_stc_oitc_metric_and_topology_boundaries_are_not_decided_first"
  },
  {
    coveredFamilies: ["floor_ceiling_impact_and_airborne", "usg_wall_and_floor_context"],
    firstMissingRequirement:
      "extract_exact_floor_or_wall_row_topology_and_map_iic_stc_metric_context_to_supported_dyn_echo_outputs_before_any_import",
    id: "usg_acoustical_assemblies_sa200",
    locator:
      "USG Acoustical Assemblies SA200: wall and floor/ceiling assemblies including Levelrock floor underlayment Sound Isolation System tables with IIC/STC values",
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
    reportedMetrics: ["STC", "IIC"],
    retrievalDate: "2026-05-02",
    rowExamples: [
      "Levelrock_I_joist_SRM25_carpet_IIC77_STC65",
      "Levelrock_I_joist_SRB_wood_laminate_IIC61_STC65",
      "Levelrock_truss_SRM25_ceramic_tile_IIC56_STC61"
    ],
    selectedForNoRuntimeExtraction: false,
    sourceLabel: "USG Acoustical Assemblies brochure SA200",
    sourceUrl:
      "https://www.usg.com/content/dam/USG_Marketing_Communications/united_states/product_promotional_materials/finished_assets/acoustical-assemblies-en-SA200.pdf",
    userVisibleRisk:
      "iic_and_stc_tables_can_look_runtime_ready_for_floors_but_need_exact_floor_topology_and_supported_metric_policy_before_dyn_echo_import"
  },
  {
    coveredFamilies: ["national_gypsum_fire_sound_wall_and_floor_selector"],
    firstMissingRequirement:
      "retrieve_row_level_selector_payloads_or_downloadable_test_reports_with_exact_assembly_topology_metric_context_and_tolerance_owner",
    id: "national_gypsum_fire_sound_assembly_selector",
    locator:
      "National Gypsum Fire & Sound Assembly Selector announcement and selector surface with UL designs and downloadable acoustical test reports",
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
    reportedMetrics: ["sound_test_results", "fire_design_context"],
    retrievalDate: "2026-05-02",
    rowExamples: [
      "National_Gypsum_selector_UL_designs_with_related_sound_tests",
      "V438_or_W419_family_examples_need_row_payload_before_import"
    ],
    selectedForNoRuntimeExtraction: false,
    sourceLabel: "National Gypsum Fire & Sound Assembly Selector",
    sourceUrl:
      "https://www.nationalgypsum.com/newsroom/press-releases/introducing-national-gypsums-fire-sound-assembly-selector",
    userVisibleRisk:
      "selector_surfaces_can_hide_dynamic_row_payloads_and_related_test_reports_so_green_nearby_rows_must_not_be_used_without_exact_payload_extraction"
  },
  {
    coveredFamilies: ["georgia_pacific_fire_sound_assemblies_context"],
    firstMissingRequirement:
      "resolve_the_actual_fire_resistance_directory_or_test_report_for_each_row_before_using_gp_assembly_stc_values_as_source_truth",
    id: "georgia_pacific_fire_sound_assemblies",
    locator:
      "Georgia-Pacific Fire & Sound Assemblies resource with STC planning caveat and assembly context",
    rank: 4,
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
    reportedMetrics: ["STC"],
    retrievalDate: "2026-05-02",
    rowExamples: ["GP_fire_sound_assembly_context_requires_actual_test_report_before_import"],
    selectedForNoRuntimeExtraction: false,
    sourceLabel: "Georgia-Pacific Fire & Sound Assemblies",
    sourceUrl: "https://www.buildgp.com/resources/assemblies",
    userVisibleRisk:
      "gp_resource_is_planning_context_and_explicitly_warns_that_actual_directory_or_test_report_information_is_required_for_complete_use"
  },
  {
    coveredFamilies: ["clt_mass_timber_wall", "clt_floor_formula_context"],
    firstMissingRequirement:
      "new_exact_mass_timber_report_row_or_metric_policy_owner_not_already_rejected_by_prior_clt_mass_timber_closeout",
    id: "stora_enso_and_existing_mass_timber_context",
    locator:
      "Stora Enso CLT soundproofing plus WoodWorks/NRC mass-timber context already classified by prior CLT extraction gates",
    rank: 5,
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
    reportedMetrics: ["Rw", "Ln,w", "STC", "ASTC", "IIC"],
    retrievalDate: "2026-05-02",
    rowExamples: [
      "stora_enso_clt_soundproofing_wall_and_floor_context",
      "woodworks_table_groups_remain_prior_context",
      "nrc_mass_timber_reports_remain_metric_policy_context"
    ],
    selectedForNoRuntimeExtraction: false,
    sourceLabel: "Existing CLT / mass-timber official and report context",
    sourceUrl: "docs/calculator/SLICE_CLT_MASS_TIMBER_WALL_SOURCE_PACK_EXTRACTION_PLAN.md",
    userVisibleRisk:
      "mass_timber_context_has_already_closed_no_runtime_and_should_not_reopen_without_new_exact_metric_or_row_truth"
  }
] as const;

const ROCKWOOL_EXTRACTION_SCOPE = {
  firstGate: "gate_a_extract_rockwool_acoustic_wall_assemblies_rows_without_runtime_import",
  requiredArtifacts: [
    "row_locator_matrix_for_rockwool_iss_iws_and_ess_assembly_numbers",
    "gypsum_layer_stud_type_spacing_resilient_channel_rockwool_product_thickness_and_report_number_per_row",
    "stc_oitc_to_dyn_echo_metric_policy_or_explicit_metric_rejection",
    "local_material_alias_decision_for_afb_comfortbatt_cavityrock_and_generic_rockwool_without_coalescing_to_glass_fiber",
    "negative_boundaries_for_uris_2006_triple_leaf_nrc_2024_glass_fiber_british_gypsum_knauf_and_floor_only_sources",
    "paired_engine_and_web_visible_test_plan_before_any_runtime_or_visible_movement"
  ],
  runtimeBehaviorChange: false,
  selectedPlanningSurface: "docs/calculator/SLICE_ROCKWOOL_ACOUSTIC_WALL_ASSEMBLIES_SOURCE_PACK_EXTRACTION_PLAN.md",
  targetFirstGateFile: "packages/engine/src/rockwool-acoustic-wall-assemblies-source-pack-extraction-gate-a-contract.test.ts"
} as const;

const PROTECTED_NEGATIVE_BOUNDARIES = [
  "rockwool_acoustic_catalog_stc_oitc_rows_do_not_fix_the_uris_2006_split_rockwool_triple_leaf_rw_41_screening_result",
  "rockwool_afb_comfortbatt_and_cavityrock_do_not_coalesce_with_glass_fiber_or_generic_mineral_wool_without_mapping_tolerance",
  "interior_steel_or_wood_stud_catalog_rows_do_not_promote_masonry_lined_massive_floor_or_generated_floor_outputs",
  "usg_national_gypsum_and_gp_sources_remain_context_until_exact_row_payload_metric_policy_tolerance_and_tests_are_owned",
  "closed_british_gypsum_and_knauf_rows_remain_closed_no_runtime_until_new_requirements_are_satisfied"
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

describe("calculator post-British-Gypsum source acquisition Gate A contract", () => {
  it("lands Gate A without runtime or visible-surface movement", () => {
    expect(CALCULATOR_POST_BRITISH_GYPSUM_SOURCE_ACQUISITION_GATE_A).toEqual({
      apiShapeChange: false,
      confidencePromotion: false,
      evidencePromotion: false,
      landedGate: "gate_a_acquire_and_classify_post_british_gypsum_source_locators_without_runtime_import",
      latestClosedSlice: "calculator_source_gap_revalidation_v9",
      numericRuntimeBehaviorChange: false,
      outputCardStatusChange: false,
      outputSupportChange: false,
      proposalReportCopyChange: false,
      routeCardValueChange: false,
      runtimeImportSelectedNow: false,
      runtimeTightening: false,
      runtimeWidening: false,
      selectedImplementationSlice: "rockwool_acoustic_wall_assemblies_source_pack_extraction_v1",
      selectedPlanningSurface: "docs/calculator/SLICE_ROCKWOOL_ACOUSTIC_WALL_ASSEMBLIES_SOURCE_PACK_EXTRACTION_PLAN.md",
      selectedRouteFamily: "rockwool_stone_wool_wall_assemblies_official_source_locator_extraction_no_runtime",
      selectionStatus:
        "selected_rockwool_acoustic_wall_assemblies_source_pack_extraction_after_post_british_gypsum_acquisition_found_official_stone_wool_wall_rows_but_no_runtime_ready_import",
      sliceId: "calculator_post_british_gypsum_source_acquisition_v1",
      sourceReadyRuntimePackAvailable: false,
      supportPromotion: false,
      targetFirstGateFile:
        "packages/engine/src/rockwool-acoustic-wall-assemblies-source-pack-extraction-gate-a-contract.test.ts",
      workbenchInputBehaviorChange: false
    });

    for (const path of REQUIRED_PLANNING_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("classifies fresh official source locators after British Gypsum closeout", () => {
    expect(OFFICIAL_SOURCE_LOCATORS.map((locator) => locator.id)).toEqual([
      "rockwool_acoustic_wall_assemblies_catalog",
      "usg_acoustical_assemblies_sa200",
      "national_gypsum_fire_sound_assembly_selector",
      "georgia_pacific_fire_sound_assemblies",
      "stora_enso_and_existing_mass_timber_context"
    ]);
    expect(OFFICIAL_SOURCE_LOCATORS.map((locator) => locator.rank)).toEqual([1, 2, 3, 4, 5]);
    expect(OFFICIAL_SOURCE_LOCATORS.every((locator) => locator.retrievalDate === "2026-05-02")).toBe(true);
    expect(OFFICIAL_SOURCE_LOCATORS.every((locator) => locator.reportedMetrics.length > 0)).toBe(true);
    expect(OFFICIAL_SOURCE_LOCATORS.every((locator) => locator.firstMissingRequirement.length > 85)).toBe(true);
  });

  it("selects ROCKWOOL only for no-runtime source-pack extraction", () => {
    expect(OFFICIAL_SOURCE_LOCATORS.filter((locator) => locator.selectedForNoRuntimeExtraction)).toEqual([
      expect.objectContaining({
        id: "rockwool_acoustic_wall_assemblies_catalog",
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
    expect(OFFICIAL_SOURCE_LOCATORS.every((locator) => locator.readiness.runtimeImportReadyNow === false)).toBe(
      true
    );
  });

  it("pins the ROCKWOOL row examples that make extraction worthwhile", () => {
    const rockwool = OFFICIAL_SOURCE_LOCATORS[0];

    expect(rockwool.rowExamples).toEqual([
      "ISS-00_5_8_gypsum_2_1_2_steel_stud_16oc_AFB_1_5in_STC43_OITC28",
      "ISS-22_asymmetric_gypsum_2_1_2_steel_stud_24oc_AFB_1_5in_STC50",
      "ISS-39_2x5_8_gypsum_3_5_8_steel_stud_24oc_AFB_3in_STC57",
      "IWS-04_2x5_8_gypsum_2x4_wood_stud_16oc_AFB_3in_STC40",
      "ESS-05_exterior_steel_stud_Comfortbatt_Cavityrock_STC49"
    ]);
    expect(rockwool.coveredFamilies).toContain("interior_steel_stud_stone_wool_wall");
    expect(rockwool.coveredFamilies).toContain("rockwool_material_alias_and_negative_boundary_context");
    expect(rockwool.userVisibleRisk).toContain("false_promote_triple_leaf");
  });

  it("defines the selected ROCKWOOL extraction scope before any runtime movement", () => {
    expect(ROCKWOOL_EXTRACTION_SCOPE).toEqual({
      firstGate: "gate_a_extract_rockwool_acoustic_wall_assemblies_rows_without_runtime_import",
      requiredArtifacts: [
        "row_locator_matrix_for_rockwool_iss_iws_and_ess_assembly_numbers",
        "gypsum_layer_stud_type_spacing_resilient_channel_rockwool_product_thickness_and_report_number_per_row",
        "stc_oitc_to_dyn_echo_metric_policy_or_explicit_metric_rejection",
        "local_material_alias_decision_for_afb_comfortbatt_cavityrock_and_generic_rockwool_without_coalescing_to_glass_fiber",
        "negative_boundaries_for_uris_2006_triple_leaf_nrc_2024_glass_fiber_british_gypsum_knauf_and_floor_only_sources",
        "paired_engine_and_web_visible_test_plan_before_any_runtime_or_visible_movement"
      ],
      runtimeBehaviorChange: false,
      selectedPlanningSurface: "docs/calculator/SLICE_ROCKWOOL_ACOUSTIC_WALL_ASSEMBLIES_SOURCE_PACK_EXTRACTION_PLAN.md",
      targetFirstGateFile: "packages/engine/src/rockwool-acoustic-wall-assemblies-source-pack-extraction-gate-a-contract.test.ts"
    });
  });

  it("protects closed and near-source boundaries while the ROCKWOOL pack is extracted", () => {
    expect(PROTECTED_NEGATIVE_BOUNDARIES).toHaveLength(5);
    expect(PROTECTED_NEGATIVE_BOUNDARIES.every((boundary) => boundary.length > 95)).toBe(true);
    expect(PROTECTED_NEGATIVE_BOUNDARIES.join("\n")).toContain("do_not_fix_the_uris_2006_split_rockwool");
    expect(PROTECTED_NEGATIVE_BOUNDARIES.join("\n")).toContain("do_not_coalesce_with_glass_fiber");
    expect(PROTECTED_NEGATIVE_BOUNDARIES.join("\n")).toContain("closed_british_gypsum_and_knauf_rows");
  });

  it("keeps active docs aligned on the selected ROCKWOOL source-pack extraction slice", () => {
    const docs = [
      readRepoFile("AGENTS.md"),
      readRepoFile("docs/calculator/NEXT_IMPLEMENTATION_PLAN.md"),
      readRepoFile("docs/calculator/CURRENT_STATE.md"),
      readRepoFile("docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md"),
      readRepoFile("docs/calculator/SLICE_CALCULATOR_POST_BRITISH_GYPSUM_SOURCE_ACQUISITION_V1_PLAN.md"),
      readRepoFile(CALCULATOR_POST_BRITISH_GYPSUM_SOURCE_ACQUISITION_GATE_A.selectedPlanningSurface),
      readRepoFile(
        "docs/calculator/CHECKPOINT_2026-05-02_CALCULATOR_POST_BRITISH_GYPSUM_SOURCE_ACQUISITION_GATE_A_HANDOFF.md"
      ),
      readRepoFile("docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md"),
      readRepoFile("docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md")
    ];

    for (const doc of docs) {
      expect(doc).toContain(CALCULATOR_POST_BRITISH_GYPSUM_SOURCE_ACQUISITION_GATE_A.selectedImplementationSlice);
      expect(doc).toContain(CALCULATOR_POST_BRITISH_GYPSUM_SOURCE_ACQUISITION_GATE_A.targetFirstGateFile);
      expect(doc).toContain(CALCULATOR_POST_BRITISH_GYPSUM_SOURCE_ACQUISITION_GATE_A.selectionStatus);
      expect(doc).toContain("ROCKWOOL Acoustic Wall Assemblies Catalog");
      expect(doc).toContain("gate_a_extract_rockwool_acoustic_wall_assemblies_rows_without_runtime_import");
    }
  });

  it("keeps frozen surfaces and validation expectations explicit", () => {
    const joinedDocs = [
      readRepoFile(
        "docs/calculator/CHECKPOINT_2026-05-02_CALCULATOR_POST_BRITISH_GYPSUM_SOURCE_ACQUISITION_GATE_A_HANDOFF.md"
      ),
      readRepoFile("docs/calculator/SLICE_CALCULATOR_POST_BRITISH_GYPSUM_SOURCE_ACQUISITION_V1_PLAN.md"),
      readRepoFile("docs/calculator/SLICE_ROCKWOOL_ACOUSTIC_WALL_ASSEMBLIES_SOURCE_PACK_EXTRACTION_PLAN.md")
    ].join("\n");

    for (const surface of FROZEN_SURFACES) {
      expect(joinedDocs, surface).toContain(surface);
    }

    expect(joinedDocs).toContain(
      "pnpm --filter @dynecho/engine exec vitest run src/calculator-post-british-gypsum-source-acquisition-gate-a-contract.test.ts --maxWorkers=1"
    );
    expect(joinedDocs).toContain("pnpm calculator:gate:current");
    expect(joinedDocs).toContain("git diff --check");
  });
});
