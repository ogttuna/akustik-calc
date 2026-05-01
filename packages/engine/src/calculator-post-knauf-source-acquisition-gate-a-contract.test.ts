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
  retrievalDate: "2026-04-30";
  rowExamples: readonly string[];
  selectedForNoRuntimeExtraction: boolean;
  sourceLabel: string;
  sourceUrl: string;
  userVisibleRisk: string;
};

const CALCULATOR_POST_KNAUF_SOURCE_ACQUISITION_GATE_A = {
  apiShapeChange: false,
  confidencePromotion: false,
  evidencePromotion: false,
  landedGate: "gate_a_acquire_and_classify_post_knauf_source_locators_without_runtime_import",
  latestClosedSlice: "calculator_source_gap_revalidation_v7",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: false,
  outputSupportChange: false,
  proposalReportCopyChange: false,
  routeCardValueChange: false,
  runtimeImportSelectedNow: false,
  runtimeTightening: false,
  runtimeWidening: false,
  selectedImplementationSlice: "british_gypsum_white_book_source_pack_extraction_v1",
  selectedPlanningSurface: "docs/calculator/SLICE_BRITISH_GYPSUM_WHITE_BOOK_SOURCE_PACK_EXTRACTION_PLAN.md",
  selectedRouteFamily: "british_gypsum_white_book_official_source_locator_extraction_no_runtime",
  selectionStatus:
    "selected_british_gypsum_white_book_source_pack_extraction_after_post_knauf_acquisition_found_official_wall_floor_rows_but_no_runtime_ready_import",
  sliceId: "calculator_post_knauf_source_acquisition_v1",
  sourceReadyRuntimePackAvailable: false,
  supportPromotion: false,
  targetFirstGateFile: "packages/engine/src/british-gypsum-white-book-source-pack-extraction-gate-a-contract.test.ts",
  workbenchInputBehaviorChange: false
} as const;

const REQUIRED_PLANNING_SURFACES = [
  "packages/engine/src/calculator-post-knauf-source-acquisition-gate-a-contract.test.ts",
  "packages/engine/src/calculator-source-gap-revalidation-v7-gate-a-contract.test.ts",
  "docs/calculator/SLICE_CALCULATOR_POST_KNAUF_SOURCE_ACQUISITION_V1_PLAN.md",
  "docs/calculator/SLICE_BRITISH_GYPSUM_WHITE_BOOK_SOURCE_PACK_EXTRACTION_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-04-30_CALCULATOR_POST_KNAUF_SOURCE_ACQUISITION_GATE_A_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-04-30_CALCULATOR_SOURCE_GAP_REVALIDATION_V7_GATE_A_HANDOFF.md",
  "docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md",
  "docs/calculator/CALCULATOR_COMPREHENSIVE_ACCURACY_ROADMAP.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "AGENTS.md"
] as const;

const OFFICIAL_SOURCE_LOCATORS: readonly OfficialLocator[] = [
  {
    coveredFamilies: [
      "gypfloor_silent_timber_joist_floor_airborne_and_impact",
      "single_frame_steel_stud_wall",
      "timber_double_board_resilient_bar_wall",
      "twin_frame_high_performance_wall",
      "lined_masonry_heavy_core_wall"
    ],
    firstMissingRequirement:
      "extract_row_by_row_topology_material_mapping_metric_policy_tolerance_owner_negative_boundaries_and_paired_visible_tests",
    id: "british_gypsum_white_book_selector_rows",
    locator:
      "British Gypsum White Book Specification Selector: C204006/C204003 GypFloor Silent, A206A290 steel stud, A046006 timber stud, A326017B twin frame audio, B226010 GypLyner Single",
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
    reportedMetrics: ["Rw", "Rw+Ctr", "Ln,w"],
    retrievalDate: "2026-04-30",
    rowExamples: [
      "C204006_EN_gypfloor_silent_Rw61_RwCtr48_Lnw56",
      "C204003_EN_gypfloor_silent_Rw63_RwCtr51_Lnw55",
      "A206A290_B_EN_gypwall_single_frame_Rw57_RwCtr51",
      "A046006_EN_timber_stud_double_soundbloc_resilient_bars_Rw58",
      "A326017B_B_EN_twin_frame_audio_Rw77_RwCtr69",
      "B226010_EN_gyplyner_single_lined_brick_Rw60_RwCtr42"
    ],
    selectedForNoRuntimeExtraction: true,
    sourceLabel: "British Gypsum White Book Specification Selector and technical specifications",
    sourceUrl: "https://www.british-gypsum.com/specification/white-book-specification-selector/white-book-overview",
    userVisibleRisk:
      "official manufacturer rows are broad enough to improve wall_floor_coverage_but_can_override_existing_exact_anchors_if_imported_before_material_tolerance_and_visible_test_mapping"
  },
  {
    coveredFamilies: ["clt_mass_timber_wall", "clt_floor_formula_context"],
    firstMissingRequirement:
      "choose_exact_clt_wall_or_floor_variant_and_map_stora_enso_rw_ln_w_formula_context_to_local_clt_routes_and_tolerance",
    id: "stora_enso_clt_soundproofing",
    locator:
      "Stora Enso CLT product page and Soundproofing for CLT PDF, wall/floor component sections and mass-law formula",
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
    reportedMetrics: ["Rw", "Ln,w", "formula_context"],
    retrievalDate: "2026-04-30",
    rowExamples: [
      "soundproofing_for_clt_wall_structures_section_4_2",
      "soundproofing_for_clt_floor_structures_section_4_1",
      "rw_clt_wall_mass_formula_applicable_60_to_150_mm"
    ],
    selectedForNoRuntimeExtraction: false,
    sourceLabel: "Stora Enso Soundproofing for CLT",
    sourceUrl:
      "https://www.storaenso.com/-/media/documents/download-center/documents/product-specifications/wood-products/clt-technical/soundproofing/soundproofing-for-clt-by-stora-enso-en.pdf",
    userVisibleRisk:
      "clt_formula_and_component_context_can_make_mass_timber_outputs_look_source_backed_without_local_route_mapping_and_tolerance"
  },
  {
    coveredFamilies: ["woodworks_mass_timber_wall_context", "nrc_mass_timber_metric_context"],
    firstMissingRequirement:
      "reuse_existing_clt_mass_timber_extraction_blockers_until_a_new_exact_report_row_or_metric_policy_owner_is_selected",
    id: "existing_mass_timber_context_recheck",
    locator: "WoodWorks and NRC mass-timber locators already classified by prior CLT extraction gates",
    rank: 3,
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
    reportedMetrics: ["STC", "FSTC", "ASTC", "one_third_octave_TL"],
    retrievalDate: "2026-04-30",
    rowExamples: [
      "woodworks_table_7_single_clt_wall_context_only",
      "woodworks_table_9_double_clt_wall_context_only",
      "nrc_rr335_astc_and_transmission_loss_context_only"
    ],
    selectedForNoRuntimeExtraction: false,
    sourceLabel: "Existing WoodWorks and NRC mass-timber context",
    sourceUrl: "docs/calculator/SLICE_CLT_MASS_TIMBER_WALL_SOURCE_PACK_EXTRACTION_PLAN.md",
    userVisibleRisk:
      "reopening_prior_mass_timber_sources_without_new_metric_policy_would_repeat_a_closed_no_runtime_path"
  },
  {
    coveredFamilies: ["generated_floor_fallback", "historical_blocked_floor_families"],
    firstMissingRequirement:
      "acquire_exact_bare_or_bounded_steel_open_web_floor_family_sources_rather_than_reusing_packaged_adjacent_rows",
    id: "floor_fallback_source_gap_still_open",
    locator: "Generated floor fallback remains governed by Pliteq/UBIQ near-miss and historical blocker contracts",
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
    reportedMetrics: ["Rw", "Ln,w", "L'nT,w"],
    retrievalDate: "2026-04-30",
    rowExamples: [
      "pliteq_exact_rows_apply_only_to_exact_source_topology",
      "ubiq_bound_rows_remain_source_topology_gated",
      "raw_open_box_open_web_reopen_requires_true_bare_carrier_evidence"
    ],
    selectedForNoRuntimeExtraction: false,
    sourceLabel: "Generated floor fallback near-miss context",
    sourceUrl: "docs/calculator/SLICE_GENERATED_FLOOR_FALLBACK_TOPOLOGY_DELTA_V1_PLAN.md",
    userVisibleRisk:
      "floor_fallback_screening_can_overstate_accuracy_if_near_miss_rows_are_promoted_as_exact_floor_truth"
  }
] as const;

const BRITISH_GYPSUM_EXTRACTION_SCOPE = {
  firstGate: "gate_a_extract_british_gypsum_white_book_rows_without_runtime_import",
  requiredArtifacts: [
    "row_locator_matrix_for_c204006_c204003_a206a290_a046006_a326017b_and_b226010",
    "layer_order_thickness_material_mounting_cavity_fill_support_and_metric_context_per_row",
    "mapping_decision_against_live_floor_wall_routes_and_existing_knauf_anchors",
    "tolerance_owner_or_explicit_tolerance_gap_per_row_family",
    "protected_negative_boundaries_for_floor_only_wall_only_adjacent_and_existing_exact_anchor_rows",
    "paired_engine_and_web_visible_test_plan_before_any_runtime_or_visible_movement"
  ],
  runtimeBehaviorChange: false,
  selectedPlanningSurface: "docs/calculator/SLICE_BRITISH_GYPSUM_WHITE_BOOK_SOURCE_PACK_EXTRACTION_PLAN.md",
  targetFirstGateFile: "packages/engine/src/british-gypsum-white-book-source-pack-extraction-gate-a-contract.test.ts"
} as const;

const PROTECTED_NEGATIVE_BOUNDARIES = [
  "closed_knauf_tb5a_mwi2a_ttf302a_and_enpc_rows_remain_context_only_until_their_exact_material_metric_tolerance_and_visible_test_gaps_are_resolved",
  "british_gypsum_steel_or_twin_frame_rows_must_not_override_existing_knauf_exact_anchors_without_precedence_tests",
  "gypfloor_silent_rows_are_floor_truth_only_and_must_not_promote_wall_outputs_or_generated_floor_near_misses",
  "stora_enso_clt_formula_context_must_not_promote_live_clt_wall_confidence_without_local_tolerance_and_metric_mapping",
  "historical_gdmtxa04a_c11c_raw_open_box_open_web_and_wall_selector_blockers_stay_fail_closed_until_their_original_blockers_are_satisfied"
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

describe("calculator post-Knauf source acquisition Gate A contract", () => {
  it("lands Gate A without runtime or visible-surface movement", () => {
    expect(CALCULATOR_POST_KNAUF_SOURCE_ACQUISITION_GATE_A).toEqual({
      apiShapeChange: false,
      confidencePromotion: false,
      evidencePromotion: false,
      landedGate: "gate_a_acquire_and_classify_post_knauf_source_locators_without_runtime_import",
      latestClosedSlice: "calculator_source_gap_revalidation_v7",
      numericRuntimeBehaviorChange: false,
      outputCardStatusChange: false,
      outputSupportChange: false,
      proposalReportCopyChange: false,
      routeCardValueChange: false,
      runtimeImportSelectedNow: false,
      runtimeTightening: false,
      runtimeWidening: false,
      selectedImplementationSlice: "british_gypsum_white_book_source_pack_extraction_v1",
      selectedPlanningSurface: "docs/calculator/SLICE_BRITISH_GYPSUM_WHITE_BOOK_SOURCE_PACK_EXTRACTION_PLAN.md",
      selectedRouteFamily: "british_gypsum_white_book_official_source_locator_extraction_no_runtime",
      selectionStatus:
        "selected_british_gypsum_white_book_source_pack_extraction_after_post_knauf_acquisition_found_official_wall_floor_rows_but_no_runtime_ready_import",
      sliceId: "calculator_post_knauf_source_acquisition_v1",
      sourceReadyRuntimePackAvailable: false,
      supportPromotion: false,
      targetFirstGateFile: "packages/engine/src/british-gypsum-white-book-source-pack-extraction-gate-a-contract.test.ts",
      workbenchInputBehaviorChange: false
    });

    for (const path of REQUIRED_PLANNING_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("classifies fresh official source locators for high-value wall and floor gaps", () => {
    expect(OFFICIAL_SOURCE_LOCATORS.map((locator) => locator.id)).toEqual([
      "british_gypsum_white_book_selector_rows",
      "stora_enso_clt_soundproofing",
      "existing_mass_timber_context_recheck",
      "floor_fallback_source_gap_still_open"
    ]);
    expect(OFFICIAL_SOURCE_LOCATORS.map((locator) => locator.rank)).toEqual([1, 2, 3, 4]);
    expect(OFFICIAL_SOURCE_LOCATORS.every((locator) => locator.retrievalDate === "2026-04-30")).toBe(true);
    expect(OFFICIAL_SOURCE_LOCATORS.every((locator) => locator.reportedMetrics.length > 0)).toBe(true);
    expect(OFFICIAL_SOURCE_LOCATORS.every((locator) => locator.firstMissingRequirement.length > 80)).toBe(true);
  });

  it("selects British Gypsum only for no-runtime source-pack extraction", () => {
    expect(OFFICIAL_SOURCE_LOCATORS.filter((locator) => locator.selectedForNoRuntimeExtraction)).toEqual([
      expect.objectContaining({
        id: "british_gypsum_white_book_selector_rows",
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

  it("pins the British Gypsum row examples that make extraction worthwhile", () => {
    const britishGypsum = OFFICIAL_SOURCE_LOCATORS[0];

    expect(britishGypsum.rowExamples).toEqual([
      "C204006_EN_gypfloor_silent_Rw61_RwCtr48_Lnw56",
      "C204003_EN_gypfloor_silent_Rw63_RwCtr51_Lnw55",
      "A206A290_B_EN_gypwall_single_frame_Rw57_RwCtr51",
      "A046006_EN_timber_stud_double_soundbloc_resilient_bars_Rw58",
      "A326017B_B_EN_twin_frame_audio_Rw77_RwCtr69",
      "B226010_EN_gyplyner_single_lined_brick_Rw60_RwCtr42"
    ]);
    expect(britishGypsum.coveredFamilies).toContain("gypfloor_silent_timber_joist_floor_airborne_and_impact");
    expect(britishGypsum.coveredFamilies).toContain("lined_masonry_heavy_core_wall");
  });

  it("defines the selected British Gypsum extraction scope before any runtime movement", () => {
    expect(BRITISH_GYPSUM_EXTRACTION_SCOPE).toEqual({
      firstGate: "gate_a_extract_british_gypsum_white_book_rows_without_runtime_import",
      requiredArtifacts: [
        "row_locator_matrix_for_c204006_c204003_a206a290_a046006_a326017b_and_b226010",
        "layer_order_thickness_material_mounting_cavity_fill_support_and_metric_context_per_row",
        "mapping_decision_against_live_floor_wall_routes_and_existing_knauf_anchors",
        "tolerance_owner_or_explicit_tolerance_gap_per_row_family",
        "protected_negative_boundaries_for_floor_only_wall_only_adjacent_and_existing_exact_anchor_rows",
        "paired_engine_and_web_visible_test_plan_before_any_runtime_or_visible_movement"
      ],
      runtimeBehaviorChange: false,
      selectedPlanningSurface: "docs/calculator/SLICE_BRITISH_GYPSUM_WHITE_BOOK_SOURCE_PACK_EXTRACTION_PLAN.md",
      targetFirstGateFile: "packages/engine/src/british-gypsum-white-book-source-pack-extraction-gate-a-contract.test.ts"
    });
  });

  it("protects closed source boundaries while fresh sources are acquired", () => {
    expect(PROTECTED_NEGATIVE_BOUNDARIES).toHaveLength(5);
    expect(PROTECTED_NEGATIVE_BOUNDARIES.every((boundary) => boundary.length > 90)).toBe(true);
    expect(PROTECTED_NEGATIVE_BOUNDARIES.join("\n")).toContain("closed_knauf_tb5a_mwi2a_ttf302a_and_enpc");
    expect(PROTECTED_NEGATIVE_BOUNDARIES.join("\n")).toContain("gypfloor_silent_rows_are_floor_truth_only");
    expect(PROTECTED_NEGATIVE_BOUNDARIES.join("\n")).toContain("historical_gdmtxa04a_c11c_raw_open_box_open_web");
  });

  it("keeps active docs aligned on the selected British Gypsum extraction slice", () => {
    const docs = [
      readRepoFile("AGENTS.md"),
      readRepoFile("docs/calculator/NEXT_IMPLEMENTATION_PLAN.md"),
      readRepoFile("docs/calculator/CURRENT_STATE.md"),
      readRepoFile("docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md"),
      readRepoFile("docs/calculator/CALCULATOR_COMPREHENSIVE_ACCURACY_ROADMAP.md"),
      readRepoFile("docs/calculator/SLICE_CALCULATOR_POST_KNAUF_SOURCE_ACQUISITION_V1_PLAN.md"),
      readRepoFile(CALCULATOR_POST_KNAUF_SOURCE_ACQUISITION_GATE_A.selectedPlanningSurface),
      readRepoFile("docs/calculator/CHECKPOINT_2026-04-30_CALCULATOR_POST_KNAUF_SOURCE_ACQUISITION_GATE_A_HANDOFF.md")
    ];

    for (const doc of docs) {
      expect(doc).toContain(CALCULATOR_POST_KNAUF_SOURCE_ACQUISITION_GATE_A.selectedImplementationSlice);
      expect(doc).toContain(CALCULATOR_POST_KNAUF_SOURCE_ACQUISITION_GATE_A.targetFirstGateFile);
      expect(doc).toContain(CALCULATOR_POST_KNAUF_SOURCE_ACQUISITION_GATE_A.selectionStatus);
      expect(doc).toContain("British Gypsum");
      expect(doc).toContain("no-runtime");
    }
  });

  it("keeps frozen surfaces and validation expectations explicit", () => {
    const joinedDocs = [
      readRepoFile("docs/calculator/CHECKPOINT_2026-04-30_CALCULATOR_POST_KNAUF_SOURCE_ACQUISITION_GATE_A_HANDOFF.md"),
      readRepoFile("docs/calculator/SLICE_CALCULATOR_POST_KNAUF_SOURCE_ACQUISITION_V1_PLAN.md"),
      readRepoFile("docs/calculator/SLICE_BRITISH_GYPSUM_WHITE_BOOK_SOURCE_PACK_EXTRACTION_PLAN.md")
    ].join("\n");

    for (const surface of FROZEN_SURFACES) {
      expect(joinedDocs, surface).toContain(surface);
    }

    expect(joinedDocs).toContain(
      "pnpm --filter @dynecho/engine exec vitest run src/calculator-post-knauf-source-acquisition-gate-a-contract.test.ts --maxWorkers=1"
    );
    expect(joinedDocs).toContain("pnpm calculator:gate:current");
    expect(joinedDocs).toContain("git diff --check");
  });
});
