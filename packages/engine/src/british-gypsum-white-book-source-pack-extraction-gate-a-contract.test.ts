import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { EXACT_FLOOR_SYSTEMS } from "@dynecho/catalogs";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  ENGINE_MIXED_GENERATED_CASES,
  resultSnapshot
} from "./mixed-floor-wall-generated-test-helpers";
import { WALL_TIMBER_LIGHTWEIGHT_SOURCE_CORPUS } from "./wall-timber-lightweight-source-corpus";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

type ExtractionClassification =
  | "needs_gate_b_mapping_tolerance_decision"
  | "already_landed_exact_anchor"
  | "adjacent_context_only";

type BritishGypsumSourceRow = {
  blockedTargetOutputs: readonly string[];
  classification: ExtractionClassification;
  currentImplementationFit:
    | "not_imported_floor_row_sif_timber_joist_topology_absent_from_exact_catalog"
    | "adjacent_to_existing_lsf_exact_anchor_not_same_stud_or_cavity"
    | "already_landed_as_resilient_timber_both_sides_exact_anchor"
    | "not_live_twin_frame_audio_route"
    | "not_live_lined_masonry_route";
  firstMissingRequirement: string;
  importDisposition: "no_new_runtime_import" | "already_imported_no_new_runtime";
  localMappingStatus:
    | "blocked_sif_channel_timber_joist_and_ceiling_board_mapping_missing"
    | "blocked_acoustud_soundbloc_apr_and_precedence_mapping_missing"
    | "complete_existing_wall_timber_lightweight_exact_import"
    | "blocked_twin_frame_bracing_multi_cavity_mapping_missing"
    | "blocked_solid_brick_plaster_gl1_furring_and_cavity_mapping_missing";
  metricContext: "lab_rw_rw_ctr_lnw" | "lab_rw_rw_ctr" | "lab_rw_only";
  pairedEngineTestsBeforeNewRuntime: readonly string[];
  pairedWebTestsBeforeVisibleMovement: readonly string[];
  protectedBoundary: string;
  reportedMetrics: {
    lnw?: number;
    rw: number;
    rwCtr?: number;
  };
  retrievalDate: "2026-04-30";
  sourceLabel: string;
  sourceUrl: string;
  systemCode: string;
  topologySummary: string;
};

const BRITISH_GYPSUM_WHITE_BOOK_GATE_A = {
  apiShapeChange: false,
  confidencePromotion: false,
  evidencePromotion: false,
  landedGate: "gate_a_extract_british_gypsum_white_book_rows_no_runtime",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: false,
  outputSupportChange: false,
  proposalReportCopyChange: false,
  routeCardValueChange: false,
  runtimeImportReadyNow: false,
  runtimeImportSelectedNow: false,
  selectedNextAction: "gate_b_mapping_tolerance_decision_no_runtime",
  sliceId: "british_gypsum_white_book_source_pack_extraction_v1",
  status:
    "british_gypsum_rows_extracted_no_new_runtime_import_a046006_already_landed_others_need_mapping_tolerance_visible_tests",
  supportPromotion: false,
  targetNextFile: "packages/engine/src/british-gypsum-white-book-source-pack-extraction-gate-b-contract.test.ts",
  workbenchInputBehaviorChange: false
} as const;

const REQUIRED_SURFACES = [
  "packages/engine/src/british-gypsum-white-book-source-pack-extraction-gate-a-contract.test.ts",
  "packages/engine/src/calculator-post-knauf-source-acquisition-gate-a-contract.test.ts",
  "docs/calculator/SLICE_BRITISH_GYPSUM_WHITE_BOOK_SOURCE_PACK_EXTRACTION_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-04-30_BRITISH_GYPSUM_WHITE_BOOK_SOURCE_PACK_EXTRACTION_GATE_A_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-04-30_CALCULATOR_POST_KNAUF_SOURCE_ACQUISITION_GATE_A_HANDOFF.md",
  "docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md",
  "docs/calculator/CALCULATOR_COMPREHENSIVE_ACCURACY_ROADMAP.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "AGENTS.md"
] as const;

const BRITISH_GYPSUM_SOURCE_ROWS: readonly BritishGypsumSourceRow[] = [
  {
    blockedTargetOutputs: ["wall_outputs", "field_floor_outputs_until_room_normalisation_owner_exists"],
    classification: "needs_gate_b_mapping_tolerance_decision",
    currentImplementationFit: "not_imported_floor_row_sif_timber_joist_topology_absent_from_exact_catalog",
    firstMissingRequirement:
      "map_gypframe_sif_channel_timber_joist_floor_rb1_ceiling_stack_to_exact_floor_catalog_or_explicit_rejection",
    importDisposition: "no_new_runtime_import",
    localMappingStatus: "blocked_sif_channel_timber_joist_and_ceiling_board_mapping_missing",
    metricContext: "lab_rw_rw_ctr_lnw",
    pairedEngineTestsBeforeNewRuntime: [
      "engine_c204006_floor_exact_value_or_rejection_pin",
      "engine_c204006_rejects_wall_and_generated_floor_near_miss_promotion"
    ],
    pairedWebTestsBeforeVisibleMovement: [
      "web_c204006_floor_route_card_source_context",
      "web_c204006_report_keeps_field_floor_outputs_source_gated"
    ],
    protectedBoundary: "gypfloor_silent_rows_are_floor_only_and_do_not_promote_wall_routes",
    reportedMetrics: { lnw: 56, rw: 61, rwCtr: 48 },
    retrievalDate: "2026-04-30",
    sourceLabel: "British Gypsum White Book Specification Selector C204006",
    sourceUrl: "https://www.british-gypsum.com/Specification/White-Book-Specification-Selector/floors/gypfloor-silent/c204006-en",
    systemCode: "C204006",
    topologySummary:
      "21_mm_tg_wood_flooring_on_19_mm_gyproc_plank_sif_channel_45x195_timber_joists_rb1_ceiling_2x15_soundbloc_100_mm_isover_spacesaver"
  },
  {
    blockedTargetOutputs: ["wall_outputs", "field_floor_outputs_until_room_normalisation_owner_exists"],
    classification: "needs_gate_b_mapping_tolerance_decision",
    currentImplementationFit: "not_imported_floor_row_sif_timber_joist_topology_absent_from_exact_catalog",
    firstMissingRequirement:
      "map_gypfloor_plank_fireline_ceiling_and_sif_channel_topology_before_import_or_bound_selection",
    importDisposition: "no_new_runtime_import",
    localMappingStatus: "blocked_sif_channel_timber_joist_and_ceiling_board_mapping_missing",
    metricContext: "lab_rw_rw_ctr_lnw",
    pairedEngineTestsBeforeNewRuntime: [
      "engine_c204003_floor_exact_value_or_rejection_pin",
      "engine_c204003_rejects_c204006_and_generic_timber_floor_substitution"
    ],
    pairedWebTestsBeforeVisibleMovement: [
      "web_c204003_floor_route_card_source_context",
      "web_c204003_report_keeps_impact_and_airborne_metric_context_explicit"
    ],
    protectedBoundary: "c204003_plank_fireline_ceiling_does_not_substitute_for_soundbloc_c204006",
    reportedMetrics: { lnw: 55, rw: 63, rwCtr: 51 },
    retrievalDate: "2026-04-30",
    sourceLabel: "British Gypsum White Book Specification Selector C204003",
    sourceUrl: "https://www.british-gypsum.com/Specification/White-Book-Specification-Selector/floors/gypfloor-silent/c204003-en",
    systemCode: "C204003",
    topologySummary:
      "21_mm_tg_wood_flooring_on_19_mm_gyproc_plank_sif_channel_45x195_timber_joists_rb1_ceiling_19_mm_plank_plus_12p5_fireline_100_mm_isover_spacesaver"
  },
  {
    blockedTargetOutputs: ["R'w", "Dn,w", "DnT,w", "DnT,A", "C", "Ctr"],
    classification: "needs_gate_b_mapping_tolerance_decision",
    currentImplementationFit: "adjacent_to_existing_lsf_exact_anchor_not_same_stud_or_cavity",
    firstMissingRequirement:
      "map_92_as_50_acoustud_soundbloc_apr_and_existing_knauf_steel_anchor_precedence_before_import",
    importDisposition: "no_new_runtime_import",
    localMappingStatus: "blocked_acoustud_soundbloc_apr_and_precedence_mapping_missing",
    metricContext: "lab_rw_rw_ctr",
    pairedEngineTestsBeforeNewRuntime: [
      "engine_a206a290_steel_stud_lab_rw_value_or_rejection_pin",
      "engine_a206a290_does_not_replace_knauf_lab_416889_anchor"
    ],
    pairedWebTestsBeforeVisibleMovement: [
      "web_a206a290_route_card_lab_context",
      "web_a206a290_report_keeps_field_outputs_source_gated"
    ],
    protectedBoundary: "a206a290_must_not_override_live_knauf_lsf_exact_anchor_without_precedence_tests",
    reportedMetrics: { rw: 57, rwCtr: 51 },
    retrievalDate: "2026-04-30",
    sourceLabel: "British Gypsum Technical Specification A206A290 (B) (EN)",
    sourceUrl: "https://www.british-gypsum.com/documents/technical-specification/british-gypsum-ts-a206a290-b-en.pdf",
    systemCode: "A206A290",
    topologySummary:
      "2x12p5_soundbloc_each_side_92_as_50_acoustuds_600_centres_25_mm_isover_apr_144_mm_partition"
  },
  {
    blockedTargetOutputs: [],
    classification: "already_landed_exact_anchor",
    currentImplementationFit: "already_landed_as_resilient_timber_both_sides_exact_anchor",
    firstMissingRequirement:
      "none_for_existing_exact_anchor_but_do_not_duplicate_import_or_use_it_to_promote_direct_timber_routes",
    importDisposition: "already_imported_no_new_runtime",
    localMappingStatus: "complete_existing_wall_timber_lightweight_exact_import",
    metricContext: "lab_rw_only",
    pairedEngineTestsBeforeNewRuntime: [
      "engine_existing_british_gypsum_a046006_exact_import_stays_value_pinned",
      "engine_a046006_does_not_promote_direct_timber_double_board_without_resilient_bar_context"
    ],
    pairedWebTestsBeforeVisibleMovement: [
      "web_existing_a046006_route_card_exact_context_stays_visible",
      "web_timber_direct_route_rejects_a046006_duplicate_promotion"
    ],
    protectedBoundary: "a046006_is_already_a_resilient_both_sides_exact_anchor_not_a_new_import_slice",
    reportedMetrics: { rw: 58 },
    retrievalDate: "2026-04-30",
    sourceLabel: "British Gypsum Technical Specification A046006 (EN)",
    sourceUrl: "https://www.british-gypsum.com/documents/technical-specification/british-gypsum-ts-a046006-en.pdf",
    systemCode: "A046006",
    topologySummary:
      "2x12p5_soundbloc_each_side_75x38_timber_cls_600_centres_rb1_resilient_bars_both_sides_50_mm_isover_apr"
  },
  {
    blockedTargetOutputs: ["R'w", "Dn,w", "DnT,w", "DnT,A", "C", "Ctr"],
    classification: "needs_gate_b_mapping_tolerance_decision",
    currentImplementationFit: "not_live_twin_frame_audio_route",
    firstMissingRequirement:
      "map_twin_92_s_10_frames_gab3_bracing_600_mm_width_and_six_insulation_layers_before_any_double_leaf_promotion",
    importDisposition: "no_new_runtime_import",
    localMappingStatus: "blocked_twin_frame_bracing_multi_cavity_mapping_missing",
    metricContext: "lab_rw_rw_ctr",
    pairedEngineTestsBeforeNewRuntime: [
      "engine_a326017b_twin_frame_value_or_rejection_pin",
      "engine_a326017b_rejects_no_stud_raw_open_box_and_simple_timber_promotion"
    ],
    pairedWebTestsBeforeVisibleMovement: [
      "web_a326017b_route_card_twin_frame_context",
      "web_a326017b_report_keeps_double_leaf_outputs_source_gated"
    ],
    protectedBoundary: "a326017b_twin_frame_audio_does_not_reopen_no_stud_or_simple_timber_routes",
    reportedMetrics: { rw: 77, rwCtr: 69 },
    retrievalDate: "2026-04-30",
    sourceLabel: "British Gypsum White Book Specification Selector A326017B",
    sourceUrl:
      "https://www.british-gypsum.com/Specification/White-Book-Specification-Selector/internal-partitions-walls/gypwall-twin-frame-audio/a326017b-b-en",
    systemCode: "A326017B",
    topologySummary:
      "three_15_mm_soundbloc_layers_outside_two_92_s_10_c_stud_frames_gab3_braces_four_100_mm_isover_cladding_roll_and_two_100_mm_stone_mineral_wool_layers"
  },
  {
    blockedTargetOutputs: ["R'w", "Dn,w", "DnT,w", "DnT,A", "C", "Ctr"],
    classification: "needs_gate_b_mapping_tolerance_decision",
    currentImplementationFit: "not_live_lined_masonry_route",
    firstMissingRequirement:
      "map_103_mm_solid_brick_plaster_gl1_lining_channels_35_mm_cavities_and_apr_to_lined_masonry_policy",
    importDisposition: "no_new_runtime_import",
    localMappingStatus: "blocked_solid_brick_plaster_gl1_furring_and_cavity_mapping_missing",
    metricContext: "lab_rw_rw_ctr",
    pairedEngineTestsBeforeNewRuntime: [
      "engine_b226010_lined_brick_value_or_rejection_pin",
      "engine_b226010_does_not_promote_generic_concrete_or_mwi2a_without_substrate_mapping"
    ],
    pairedWebTestsBeforeVisibleMovement: [
      "web_b226010_route_card_lined_brick_context",
      "web_b226010_report_keeps_heavy_core_screening_honest"
    ],
    protectedBoundary: "b226010_lined_brick_does_not_promote_generic_lined_concrete_or_heavy_core_screening",
    reportedMetrics: { rw: 60, rwCtr: 42 },
    retrievalDate: "2026-04-30",
    sourceLabel: "British Gypsum White Book Specification Selector B226010",
    sourceUrl: "https://www.british-gypsum.com/Specification/White-Book-Specification-Selector/wall-linings/gyplyner-single/b226010-en",
    systemCode: "B226010",
    topologySummary:
      "103_mm_solid_brick_1700_kg_m3_13_mm_plaster_each_side_gl1_channels_both_sides_35_mm_cavities_25_mm_isover_apr_1x12p5_soundbloc"
  }
] as const;

const METRIC_POLICY = {
  fieldOutputOwnerNamedForImportedRows: false,
  floorImpactMetricOwnerNamed: true,
  labRwContextAllowed: true,
  rwCtrPolicy: "source_reports_rw_plus_ctr_but_dyn_echo_must_not_treat_it_as_standalone_ctr_without_policy",
  selectedNewRuntimeRows: [],
  toleranceOwnerNamedForNewRows: false
} as const;

const GATE_A_DECISION = {
  alreadyRepresentedRows: ["A046006"],
  rowsNeedingGateBMapping: ["C204006", "C204003", "A206A290", "A326017B", "B226010"],
  runtimeImportSelectedNow: false,
  selectedNextAction: "gate_b_mapping_tolerance_decision_no_runtime",
  targetNextFile: "packages/engine/src/british-gypsum-white-book-source-pack-extraction-gate-b-contract.test.ts"
} as const;

const PROTECTED_NEGATIVE_BOUNDARIES = [
  "gypfloor_silent_rows_are_floor_only_and_do_not_promote_wall_outputs",
  "c204006_and_c204003_do_not_replace_existing_floor_catalog_rows_without_sif_topology_mapping",
  "a206a290_does_not_override_knauf_lab_416889_primary_2026_without_precedence_tests",
  "a046006_is_already_landed_and_must_not_be_reimported_or_used_for_direct_timber_routes",
  "a326017b_twin_frame_audio_does_not_reopen_no_stud_or_raw_open_box_routes",
  "b226010_lined_brick_does_not_promote_generic_concrete_or_mwi2a_lined_masonry",
  "runtime_support_confidence_evidence_api_route_card_output_card_proposal_report_and_workbench_input_surfaces_remain_frozen"
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function generatedCase(id: string) {
  const found = ENGINE_MIXED_GENERATED_CASES.find((testCase) => testCase.id === id);

  if (!found) {
    throw new Error(`Missing generated case ${id}`);
  }

  return found;
}

describe("British Gypsum White Book source-pack extraction Gate A contract", () => {
  it("lands Gate A as no-runtime row extraction and selects Gate B mapping", () => {
    expect(BRITISH_GYPSUM_WHITE_BOOK_GATE_A).toEqual({
      apiShapeChange: false,
      confidencePromotion: false,
      evidencePromotion: false,
      landedGate: "gate_a_extract_british_gypsum_white_book_rows_no_runtime",
      numericRuntimeBehaviorChange: false,
      outputCardStatusChange: false,
      outputSupportChange: false,
      proposalReportCopyChange: false,
      routeCardValueChange: false,
      runtimeImportReadyNow: false,
      runtimeImportSelectedNow: false,
      selectedNextAction: "gate_b_mapping_tolerance_decision_no_runtime",
      sliceId: "british_gypsum_white_book_source_pack_extraction_v1",
      status:
        "british_gypsum_rows_extracted_no_new_runtime_import_a046006_already_landed_others_need_mapping_tolerance_visible_tests",
      supportPromotion: false,
      targetNextFile: "packages/engine/src/british-gypsum-white-book-source-pack-extraction-gate-b-contract.test.ts",
      workbenchInputBehaviorChange: false
    });

    for (const path of REQUIRED_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("extracts the six selected British Gypsum row locators and ratings", () => {
    expect(BRITISH_GYPSUM_SOURCE_ROWS.map((row) => row.systemCode)).toEqual([
      "C204006",
      "C204003",
      "A206A290",
      "A046006",
      "A326017B",
      "B226010"
    ]);
    expect(new Set(BRITISH_GYPSUM_SOURCE_ROWS.map((row) => row.sourceUrl)).size).toBe(6);
    expect(BRITISH_GYPSUM_SOURCE_ROWS.map((row) => row.reportedMetrics)).toEqual([
      { lnw: 56, rw: 61, rwCtr: 48 },
      { lnw: 55, rw: 63, rwCtr: 51 },
      { rw: 57, rwCtr: 51 },
      { rw: 58 },
      { rw: 77, rwCtr: 69 },
      { rw: 60, rwCtr: 42 }
    ]);
    expect(BRITISH_GYPSUM_SOURCE_ROWS.every((row) => row.retrievalDate === "2026-04-30")).toBe(true);
  });

  it("keeps GypFloor Silent rows floor-only until exact floor topology mapping exists", () => {
    const floorRows = BRITISH_GYPSUM_SOURCE_ROWS.filter((row) => row.systemCode.startsWith("C204"));

    expect(floorRows.map((row) => row.currentImplementationFit)).toEqual([
      "not_imported_floor_row_sif_timber_joist_topology_absent_from_exact_catalog",
      "not_imported_floor_row_sif_timber_joist_topology_absent_from_exact_catalog"
    ]);
    expect(
      EXACT_FLOOR_SYSTEMS.some((system) => /c20400[36]|gypfloor|british_gypsum/i.test(`${system.id} ${system.label}`))
    ).toBe(false);
    expect(floorRows.every((row) => row.blockedTargetOutputs.includes("wall_outputs"))).toBe(true);
  });

  it("recognizes A046006 as already landed exact timber anchor, not new runtime movement", () => {
    const a046006 = WALL_TIMBER_LIGHTWEIGHT_SOURCE_CORPUS.find(
      (entry) => entry.id === "british_gypsum_a046006_timber_rb2_2x12p5_soundbloc_50apr_lab_2026"
    );
    const sourceRow = BRITISH_GYPSUM_SOURCE_ROWS.find((row) => row.systemCode === "A046006");

    expect(sourceRow).toMatchObject({
      classification: "already_landed_exact_anchor",
      importDisposition: "already_imported_no_new_runtime",
      reportedMetrics: { rw: 58 }
    });
    expect(a046006).toMatchObject({
      classification: "exact_import_landed",
      expectedRw: 58,
      metricPath: "ratings.iso717.Rw",
      sourceUrl: "https://www.british-gypsum.com/documents/technical-specification/british-gypsum-ts-a046006-en.pdf",
      toleranceDb: 3
    });
  });

  it("keeps the live steel-stud exact anchor ahead of adjacent A206A290 context", () => {
    const testCase = generatedCase("wall-lsf-knauf");
    const lab = calculateAssembly(testCase.rows, testCase.labOptions);
    const field = calculateAssembly(testCase.rows, testCase.fieldOptions);
    const a206a290 = BRITISH_GYPSUM_SOURCE_ROWS.find((row) => row.systemCode === "A206A290");

    expect(a206a290).toMatchObject({
      currentImplementationFit: "adjacent_to_existing_lsf_exact_anchor_not_same_stud_or_cavity",
      reportedMetrics: { rw: 57, rwCtr: 51 }
    });
    expect(resultSnapshot(lab)).toMatchObject({
      dynamicFamily: "stud_wall_system",
      rw: 55,
      rwDb: 55,
      stc: 55
    });
    expect(resultSnapshot(field)).toMatchObject({
      dnTA: 51.1,
      dnTw: 52,
      dnW: 51,
      dynamicFamily: "stud_wall_system",
      rwPrimeDb: 51
    });
  });

  it("blocks remaining wall rows until material, metric, tolerance, and visible tests are owned", () => {
    const blockedWallRows = BRITISH_GYPSUM_SOURCE_ROWS.filter((row) =>
      ["A206A290", "A326017B", "B226010"].includes(row.systemCode)
    );

    expect(blockedWallRows.map((row) => row.localMappingStatus)).toEqual([
      "blocked_acoustud_soundbloc_apr_and_precedence_mapping_missing",
      "blocked_twin_frame_bracing_multi_cavity_mapping_missing",
      "blocked_solid_brick_plaster_gl1_furring_and_cavity_mapping_missing"
    ]);
    expect(blockedWallRows.every((row) => row.classification === "needs_gate_b_mapping_tolerance_decision")).toBe(true);
    expect(blockedWallRows.every((row) => row.blockedTargetOutputs.includes("R'w"))).toBe(true);
    expect(METRIC_POLICY).toEqual({
      fieldOutputOwnerNamedForImportedRows: false,
      floorImpactMetricOwnerNamed: true,
      labRwContextAllowed: true,
      rwCtrPolicy: "source_reports_rw_plus_ctr_but_dyn_echo_must_not_treat_it_as_standalone_ctr_without_policy",
      selectedNewRuntimeRows: [],
      toleranceOwnerNamedForNewRows: false
    });
  });

  it("pins Gate A decision and protected negative boundaries", () => {
    expect(GATE_A_DECISION).toEqual({
      alreadyRepresentedRows: ["A046006"],
      rowsNeedingGateBMapping: ["C204006", "C204003", "A206A290", "A326017B", "B226010"],
      runtimeImportSelectedNow: false,
      selectedNextAction: "gate_b_mapping_tolerance_decision_no_runtime",
      targetNextFile: "packages/engine/src/british-gypsum-white-book-source-pack-extraction-gate-b-contract.test.ts"
    });
    expect(PROTECTED_NEGATIVE_BOUNDARIES).toEqual([
      "gypfloor_silent_rows_are_floor_only_and_do_not_promote_wall_outputs",
      "c204006_and_c204003_do_not_replace_existing_floor_catalog_rows_without_sif_topology_mapping",
      "a206a290_does_not_override_knauf_lab_416889_primary_2026_without_precedence_tests",
      "a046006_is_already_landed_and_must_not_be_reimported_or_used_for_direct_timber_routes",
      "a326017b_twin_frame_audio_does_not_reopen_no_stud_or_raw_open_box_routes",
      "b226010_lined_brick_does_not_promote_generic_concrete_or_mwi2a_lined_masonry",
      "runtime_support_confidence_evidence_api_route_card_output_card_proposal_report_and_workbench_input_surfaces_remain_frozen"
    ]);
  });

  it("keeps docs aligned on Gate B as the next no-runtime action", () => {
    const docs = [
      readRepoFile("AGENTS.md"),
      readRepoFile("docs/calculator/NEXT_IMPLEMENTATION_PLAN.md"),
      readRepoFile("docs/calculator/CURRENT_STATE.md"),
      readRepoFile("docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md"),
      readRepoFile("docs/calculator/CALCULATOR_COMPREHENSIVE_ACCURACY_ROADMAP.md"),
      readRepoFile("docs/calculator/SLICE_BRITISH_GYPSUM_WHITE_BOOK_SOURCE_PACK_EXTRACTION_PLAN.md"),
      readRepoFile("docs/calculator/CHECKPOINT_2026-04-30_BRITISH_GYPSUM_WHITE_BOOK_SOURCE_PACK_EXTRACTION_GATE_A_HANDOFF.md")
    ];

    for (const doc of docs) {
      expect(doc).toContain(BRITISH_GYPSUM_WHITE_BOOK_GATE_A.sliceId);
      expect(doc).toContain(BRITISH_GYPSUM_WHITE_BOOK_GATE_A.status);
      expect(doc).toContain(BRITISH_GYPSUM_WHITE_BOOK_GATE_A.selectedNextAction);
      expect(doc).toContain(BRITISH_GYPSUM_WHITE_BOOK_GATE_A.targetNextFile);
      expect(doc).toContain("A046006");
    }
  });
});
