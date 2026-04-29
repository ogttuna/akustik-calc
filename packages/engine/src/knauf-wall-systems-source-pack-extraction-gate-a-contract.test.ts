import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

type SourceClassification =
  | "eligible_for_gate_b_mapping_tolerance_decision"
  | "adjacent_context_only"
  | "negative_boundary";

type SourcePackRow = {
  boardLayerSummary: string;
  classification: SourceClassification;
  couplingOrMounting: string;
  cavityOrInsulation: string;
  firstMissingPrerequisite: string;
  localMappingConfidence: "medium" | "low";
  metricContext: "lab_rw" | "lab_rw_rw_ctr";
  pageOrTable: string;
  pairedTestShapeBeforeRuntime: readonly string[];
  protectedBoundary: string;
  reportedMetric: readonly string[];
  retrievalDate: "2026-04-29";
  sideCountMetadata: "one_side_lined" | "both_sides_lined" | "asymmetric_both_sides";
  sourceLabel: string;
  sourceUrl: string;
  studOrSubstrate: string;
  systemCode: string;
  topologyScope: string;
};

const KNAUF_WALL_SYSTEMS_SOURCE_PACK_GATE_A = {
  apiShapeChange: false,
  confidencePromotion: false,
  evidencePromotion: false,
  landedGate: "gate_a_extract_knauf_wall_systems_table_locators_no_runtime",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: false,
  proposalReportCopyChange: false,
  routeCardValueChange: false,
  runtimeImportReadyNow: false,
  selectedNextAction: "gate_b_mapping_tolerance_decision_no_runtime",
  selectedNextFile: "packages/engine/src/knauf-wall-systems-source-pack-extraction-gate-b-contract.test.ts",
  sliceId: "knauf_wall_systems_source_pack_extraction_v1",
  supportPromotion: false,
  workbenchInputBehaviorChange: false
} as const;

const REQUIRED_DOCS = [
  "AGENTS.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md",
  "docs/calculator/CALCULATOR_COMPREHENSIVE_ACCURACY_ROADMAP.md",
  "docs/calculator/SLICE_KNAUF_WALL_SYSTEMS_SOURCE_PACK_EXTRACTION_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-04-29_KNAUF_WALL_SYSTEMS_SOURCE_PACK_EXTRACTION_GATE_A_HANDOFF.md"
] as const;

const SOURCE_PACK_ROWS: readonly SourcePackRow[] = [
  {
    sourceLabel: "Knauf UK Drywall Systems Performance Guide April 2026",
    sourceUrl:
      "https://knauf.com/api/download-center/v1/assets/0f399ff9-ae51-4916-b290-c5f5d270a2e4?country=gb&download=true&locale=en-GB",
    pageOrTable: "Table Guide p.15 and EN Compliance Performer Wallboard p.17",
    retrievalDate: "2026-04-29",
    systemCode: "EN-PC-50-055-6-2-12.5-WB-25",
    topologyScope:
      "50_mm_steel_c_stud_wallboard_two_layers_each_side_25_mm_acoustic_roll_600_mm_centres",
    boardLayerSummary: "2x12.5 mm Wallboard each side",
    studOrSubstrate: "50 mm 0.55 gauge Knauf C metal stud at 600 mm centres",
    cavityOrInsulation: "25 mm Knauf Insulation Acoustic Roll in cavity",
    couplingOrMounting: "single metal stud frame, non-deflection arrangement",
    sideCountMetadata: "both_sides_lined",
    reportedMetric: ["Rw 49 dB"],
    metricContext: "lab_rw",
    localMappingConfidence: "medium",
    classification: "eligible_for_gate_b_mapping_tolerance_decision",
    firstMissingPrerequisite:
      "confirm_board_material_mapping_stud_gauge_equivalence_metric_tolerance_and_current_steel_stud_precedence_before_any_import",
    protectedBoundary:
      "uk_steel_stud_rows_do_not_promote_timber_double_board_or_masonry_lining_routes",
    pairedTestShapeBeforeRuntime: [
      "engine_knauf_uk_steel_stud_row_value_pin_or_rejection",
      "web_route_card_lab_rw_source_context_without_confidence_promotion"
    ]
  },
  {
    sourceLabel: "Knauf AU Systems+ Section D Timber Stud Walls",
    sourceUrl:
      "https://knauf.com/api/download-center/v1/assets/4e58706c-df9d-4579-8d5b-8e685cf29194?country=AU&download=true&locale=en-AU",
    pageOrTable: "D 10-11 lined one side TO90.1 / TO120.1",
    retrievalDate: "2026-04-29",
    systemCode: "TO120.1A",
    topologyScope: "timber_stud_wall_lined_one_side_three_16_mm_firestop_boards",
    boardLayerSummary: "3x16 mm FIRESTOP on side 1, side 2 unlined",
    studOrSubstrate: "timber studs, any stud size",
    cavityOrInsulation: "nil insulation",
    couplingOrMounting: "timber stud frame, one finished side only",
    sideCountMetadata: "one_side_lined",
    reportedMetric: ["Rw 39 dB", "Rw+Ctr 37 dB"],
    metricContext: "lab_rw_rw_ctr",
    localMappingConfidence: "low",
    classification: "negative_boundary",
    firstMissingPrerequisite:
      "one_side_lined_topology_does_not_match_current_two_sided_wall_outputs_or_timber_double_board_route",
    protectedBoundary:
      "one_side_lined_timber_rows_must_not_be_used_as_two_sided_wall_truth",
    pairedTestShapeBeforeRuntime: [
      "engine_reject_one_side_lined_as_two_sided_timber_wall_source",
      "web_visible_context_only_message_if_exposed"
    ]
  },
  {
    sourceLabel: "Knauf AU Systems+ Section D Timber Stud Walls",
    sourceUrl:
      "https://knauf.com/api/download-center/v1/assets/4e58706c-df9d-4579-8d5b-8e685cf29194?country=AU&download=true&locale=en-AU",
    pageOrTable: "D timber stud walls TB.5 table",
    retrievalDate: "2026-04-29",
    systemCode: "TB.5A",
    topologyScope: "timber_stud_wall_two_13_mm_sheetrock_one_boards_each_side_with_ki75g11",
    boardLayerSummary: "2x13 mm SHEETROCK ONE each side",
    studOrSubstrate: "timber studs, alternate stud depth columns",
    cavityOrInsulation: "KI 75G11 glasswool insulation",
    couplingOrMounting: "single timber stud frame",
    sideCountMetadata: "both_sides_lined",
    reportedMetric: ["Rw 46-47 dB", "Rw+Ctr 39-40 dB"],
    metricContext: "lab_rw_rw_ctr",
    localMappingConfidence: "medium",
    classification: "eligible_for_gate_b_mapping_tolerance_decision",
    firstMissingPrerequisite:
      "select_exact_stud_depth_column_map_sheetrock_to_local_board_material_and_name_timber_double_board_tolerance_owner",
    protectedBoundary:
      "timber_double_board_candidate_must_not_import_before_exact_column_and_tolerance_mapping",
    pairedTestShapeBeforeRuntime: [
      "engine_timber_double_board_exact_column_value_or_rejection_pin",
      "web_timber_double_board_route_card_metric_context"
    ]
  },
  {
    sourceLabel: "Knauf AU Systems+ Section D Timber Stud Walls",
    sourceUrl:
      "https://knauf.com/api/download-center/v1/assets/4e58706c-df9d-4579-8d5b-8e685cf29194?country=AU&download=true&locale=en-AU",
    pageOrTable: "D 49 staggered timber studs TSF120.1",
    retrievalDate: "2026-04-29",
    systemCode: "TSF120.1A",
    topologyScope: "staggered_timber_stud_wall_with_two_16_mm_fiberock_aqua_tough_boards_each_side",
    boardLayerSummary: "2x16 mm FIBEROCK AQUA-TOUGH each side",
    studOrSubstrate: "staggered timber studs on 90/120/140 mm plate columns",
    cavityOrInsulation: "nil, KI 50G11, KI 75G11, or KI 90G11",
    couplingOrMounting: "staggered timber stud frame",
    sideCountMetadata: "both_sides_lined",
    reportedMetric: ["Rw 49-56 dB", "Rw+Ctr 43-53 dB"],
    metricContext: "lab_rw_rw_ctr",
    localMappingConfidence: "low",
    classification: "adjacent_context_only",
    firstMissingPrerequisite:
      "staggered_stud_topology_and_fiberock_board_mapping_are_not_current_live_timber_stud_route_inputs",
    protectedBoundary:
      "staggered_stud_rows_do_not_widen_current_simple_timber_stud_routes_without_new_topology",
    pairedTestShapeBeforeRuntime: [
      "engine_staggered_stud_family_boundary_contract",
      "web_staggered_stud_source_gated_context_card"
    ]
  },
  {
    sourceLabel: "Knauf AU Systems+ Section D Timber Stud Walls",
    sourceUrl:
      "https://knauf.com/api/download-center/v1/assets/4e58706c-df9d-4579-8d5b-8e685cf29194?country=AU&download=true&locale=en-AU",
    pageOrTable: "D 60-61 twin stud TT.1 / TTF30.1 / TTF30.2",
    retrievalDate: "2026-04-29",
    systemCode: "TTF30.2A",
    topologyScope:
      "twin_timber_stud_wall_20_mm_gap_asymmetric_one_by_two_13_mm_fiberock_aqua_tough",
    boardLayerSummary: "1x13 mm FIBEROCK AQUA-TOUGH side 1, 2x13 mm side 2",
    studOrSubstrate: "twin timber studs, 70 or 90 mm stud columns",
    cavityOrInsulation: "nil, KI 50G11, KI 75G11, or KI 90G11",
    couplingOrMounting: "two timber stud frames separated by 20 mm gap",
    sideCountMetadata: "asymmetric_both_sides",
    reportedMetric: ["Rw 49-64 dB", "Rw+Ctr 41-54 dB"],
    metricContext: "lab_rw_rw_ctr",
    localMappingConfidence: "low",
    classification: "eligible_for_gate_b_mapping_tolerance_decision",
    firstMissingPrerequisite:
      "map_twin_stud_gap_side_asymmetry_board_material_and_double_leaf_tolerance_before_any_no_stud_or_timber_route_movement",
    protectedBoundary:
      "twin_timber_stud_rows_do_not_reopen_no_stud_double_leaf_or_raw_open_box_without_topology_mapping",
    pairedTestShapeBeforeRuntime: [
      "engine_twin_timber_double_leaf_boundary_and_value_contract",
      "web_twin_timber_source_context_without_no_stud_promotion"
    ]
  },
  {
    sourceLabel: "Knauf AU Systems+ Section F Masonry Upgrades",
    sourceUrl:
      "https://knauf.com/api/download-center/v1/assets/16b8f406-a9be-47bd-9e7a-7212d6f19a28?country=AU&download=true&locale=en-AU",
    pageOrTable: "F masonry upgrades internal walls MWI.1 / MWI.2",
    retrievalDate: "2026-04-29",
    systemCode: "MWI.2A",
    topologyScope: "internal_masonry_wall_sheetrock_one_lining_with_furring_cavity_options",
    boardLayerSummary: "1x13 mm SHEETROCK ONE each side",
    studOrSubstrate: "concrete panel or core-filled concrete block substrate",
    cavityOrInsulation: "nil or KI 25G24 / KI 50G11 in furring cavity",
    couplingOrMounting: "adhesive/furring lining over masonry substrate",
    sideCountMetadata: "both_sides_lined",
    reportedMetric: ["Rw 52-61 dB", "Rw+Ctr 44-51 dB"],
    metricContext: "lab_rw_rw_ctr",
    localMappingConfidence: "low",
    classification: "eligible_for_gate_b_mapping_tolerance_decision",
    firstMissingPrerequisite:
      "map_masonry_substrate_mass_furring_coupling_and_lined_massive_tolerance_owner_before_heavy_core_import",
    protectedBoundary:
      "masonry_upgrade_rows_do_not_promote_lined_heavy_wall_without_substrate_and_coupling_mapping",
    pairedTestShapeBeforeRuntime: [
      "engine_lined_masonry_substrate_mapping_or_rejection",
      "web_lined_heavy_route_card_source_context"
    ]
  },
  {
    sourceLabel: "Knauf AU Systems+ Section F Masonry Upgrades",
    sourceUrl:
      "https://knauf.com/api/download-center/v1/assets/16b8f406-a9be-47bd-9e7a-7212d6f19a28?country=AU&download=true&locale=en-AU",
    pageOrTable: "F 15 AAC acoustic upgrades AAC.1 / AAC.2",
    retrievalDate: "2026-04-29",
    systemCode: "AAC.1A",
    topologyScope: "aac_panel_discontinuous_construction_with_sheetrock_one_lining_and_steel_frame_gap",
    boardLayerSummary: "1x13 mm SHEETROCK ONE each side",
    studOrSubstrate: "75 mm AAC panel minimum 500 kg/m3 density plus steel frame side",
    cavityOrInsulation: "20 or 35 mm gap with KI 50G11 / KI 75G11",
    couplingOrMounting: "adhesive fixed board one side, steel frame separated from AAC panel on other side",
    sideCountMetadata: "both_sides_lined",
    reportedMetric: ["Rw 58-60 dB", "Rw+Ctr 48-50 dB"],
    metricContext: "lab_rw_rw_ctr",
    localMappingConfidence: "low",
    classification: "adjacent_context_only",
    firstMissingPrerequisite:
      "aac_panel_density_gap_and_discontinuous_steel_frame_mapping_do_not_match_current_generic_aac_or_masonry_routes",
    protectedBoundary:
      "aac_upgrade_rows_do_not_promote_generic_aac_or_lined_heavy_routes_without_exact_panel_gap_mapping",
    pairedTestShapeBeforeRuntime: [
      "engine_aac_panel_gap_negative_boundary",
      "web_aac_upgrade_context_only_visibility"
    ]
  }
] as const;

const GATE_A_DECISION = {
  directRuntimeImportReadyNow: false,
  gateBRequired: true,
  gateBReason:
    "multiple_rows_are_promising_but_still_need_exact_column_selection_metric_context_tolerance_owner_and_negative_boundary_tests",
  runtimePosture:
    "source_table_locators_are_extracted_but_all_runtime_support_confidence_evidence_and_visible_surfaces_stay_frozen",
  selectedNextFile: "packages/engine/src/knauf-wall-systems-source-pack-extraction-gate-b-contract.test.ts"
} as const;

const PROTECTED_BOUNDARIES = [
  "source_locators_are_not_runtime_import_approval",
  "uk_steel_stud_rows_do_not_promote_timber_double_board_routes",
  "one_side_lined_timber_rows_do_not_become_two_sided_wall_truth",
  "staggered_and_twin_timber_topologies_do_not_reopen_no_stud_or_raw_open_box_routes",
  "masonry_upgrade_rows_do_not_promote_lined_heavy_wall_without_substrate_and_coupling_mapping",
  "aac_panel_upgrade_rows_do_not_promote_generic_aac_routes_without_exact_panel_gap_mapping",
  "runtime_support_confidence_evidence_api_route_card_output_card_proposal_report_and_workbench_input_surfaces_remain_frozen"
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("Knauf wall systems source-pack extraction Gate A contract", () => {
  it("lands Gate A as no-runtime source table locator extraction", () => {
    expect(KNAUF_WALL_SYSTEMS_SOURCE_PACK_GATE_A).toEqual({
      apiShapeChange: false,
      confidencePromotion: false,
      evidencePromotion: false,
      landedGate: "gate_a_extract_knauf_wall_systems_table_locators_no_runtime",
      numericRuntimeBehaviorChange: false,
      outputCardStatusChange: false,
      proposalReportCopyChange: false,
      routeCardValueChange: false,
      runtimeImportReadyNow: false,
      selectedNextAction: "gate_b_mapping_tolerance_decision_no_runtime",
      selectedNextFile: "packages/engine/src/knauf-wall-systems-source-pack-extraction-gate-b-contract.test.ts",
      sliceId: "knauf_wall_systems_source_pack_extraction_v1",
      supportPromotion: false,
      workbenchInputBehaviorChange: false
    });

    for (const path of REQUIRED_DOCS) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("extracts official UK and AU locator rows with required metadata", () => {
    expect(SOURCE_PACK_ROWS.map((row) => row.systemCode)).toEqual([
      "EN-PC-50-055-6-2-12.5-WB-25",
      "TO120.1A",
      "TB.5A",
      "TSF120.1A",
      "TTF30.2A",
      "MWI.2A",
      "AAC.1A"
    ]);
    expect(new Set(SOURCE_PACK_ROWS.map((row) => row.systemCode)).size).toBe(SOURCE_PACK_ROWS.length);
    expect(SOURCE_PACK_ROWS.every((row) => row.retrievalDate === "2026-04-29")).toBe(true);
    expect(SOURCE_PACK_ROWS.every((row) => row.sourceUrl.startsWith("https://knauf.com/"))).toBe(true);
    expect(SOURCE_PACK_ROWS.every((row) => row.pageOrTable.length > 20)).toBe(true);
    expect(SOURCE_PACK_ROWS.every((row) => row.boardLayerSummary.length > 15)).toBe(true);
    expect(SOURCE_PACK_ROWS.every((row) => row.studOrSubstrate.length > 20)).toBe(true);
    expect(SOURCE_PACK_ROWS.every((row) => row.cavityOrInsulation.length > 10)).toBe(true);
    expect(SOURCE_PACK_ROWS.every((row) => row.reportedMetric.length > 0)).toBe(true);
  });

  it("keeps all extracted rows out of runtime import until Gate B resolves blockers", () => {
    expect(new Set(SOURCE_PACK_ROWS.map((row) => row.classification))).toEqual(
      new Set<SourceClassification>([
        "eligible_for_gate_b_mapping_tolerance_decision",
        "adjacent_context_only",
        "negative_boundary"
      ])
    );
    expect(SOURCE_PACK_ROWS.filter((row) => row.classification === "eligible_for_gate_b_mapping_tolerance_decision").map((row) => row.systemCode)).toEqual([
      "EN-PC-50-055-6-2-12.5-WB-25",
      "TB.5A",
      "TTF30.2A",
      "MWI.2A"
    ]);
    expect(SOURCE_PACK_ROWS.filter((row) => row.classification === "adjacent_context_only").map((row) => row.systemCode)).toEqual([
      "TSF120.1A",
      "AAC.1A"
    ]);
    expect(SOURCE_PACK_ROWS.filter((row) => row.classification === "negative_boundary").map((row) => row.systemCode)).toEqual([
      "TO120.1A"
    ]);
    expect(SOURCE_PACK_ROWS.every((row) => row.firstMissingPrerequisite.length > 70)).toBe(true);
    expect(SOURCE_PACK_ROWS.every((row) => row.pairedTestShapeBeforeRuntime.length === 2)).toBe(true);
  });

  it("selects Gate B mapping and tolerance decision without moving visible surfaces", () => {
    expect(GATE_A_DECISION).toEqual({
      directRuntimeImportReadyNow: false,
      gateBRequired: true,
      gateBReason:
        "multiple_rows_are_promising_but_still_need_exact_column_selection_metric_context_tolerance_owner_and_negative_boundary_tests",
      runtimePosture:
        "source_table_locators_are_extracted_but_all_runtime_support_confidence_evidence_and_visible_surfaces_stay_frozen",
      selectedNextFile: "packages/engine/src/knauf-wall-systems-source-pack-extraction-gate-b-contract.test.ts"
    });
  });

  it("preserves protected negative boundaries explicitly", () => {
    expect(SOURCE_PACK_ROWS.map((row) => row.protectedBoundary)).toEqual([
      "uk_steel_stud_rows_do_not_promote_timber_double_board_or_masonry_lining_routes",
      "one_side_lined_timber_rows_must_not_be_used_as_two_sided_wall_truth",
      "timber_double_board_candidate_must_not_import_before_exact_column_and_tolerance_mapping",
      "staggered_stud_rows_do_not_widen_current_simple_timber_stud_routes_without_new_topology",
      "twin_timber_stud_rows_do_not_reopen_no_stud_double_leaf_or_raw_open_box_without_topology_mapping",
      "masonry_upgrade_rows_do_not_promote_lined_heavy_wall_without_substrate_and_coupling_mapping",
      "aac_upgrade_rows_do_not_promote_generic_aac_or_lined_heavy_routes_without_exact_panel_gap_mapping"
    ]);
    expect(PROTECTED_BOUNDARIES).toContain(
      "runtime_support_confidence_evidence_api_route_card_output_card_proposal_report_and_workbench_input_surfaces_remain_frozen"
    );
  });

  it("keeps active docs aligned on Gate B as next action", () => {
    const docs = REQUIRED_DOCS.map((path) => readRepoFile(path)).join("\n");

    expect(docs).toContain("knauf_wall_systems_source_pack_extraction_v1");
    expect(docs).toContain(KNAUF_WALL_SYSTEMS_SOURCE_PACK_GATE_A.selectedNextFile);
    expect(docs).toContain("no-runtime");

    for (const boundary of PROTECTED_BOUNDARIES) {
      expect(docs, boundary).toContain(boundary);
    }
  });
});
