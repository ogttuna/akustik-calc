import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import type { AirborneContext, LayerInput } from "@dynecho/shared";

import {
  findVerifiedAirborneAssemblyMatch,
  findVerifiedAirborneAssemblyMatchWithLabFallback
} from "./airborne-verified-catalog";
import { calculateAssembly } from "./calculate-assembly";
import {
  ENGINE_MIXED_GENERATED_CASES,
  resultSnapshot
} from "./mixed-floor-wall-generated-test-helpers";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

type MappingDecision = {
  decision: "mapped_context_only" | "blocked_not_exact";
  localMaterialId: string | null;
  reason: string;
  sourceMaterial: string;
};

type NegativeBoundary = {
  boundary: string;
  reason: string;
};

const STEEL_STUD_KNAUF_ENPC_GATE_A = {
  apiShapeChange: false,
  confidencePromotion: false,
  evidencePromotion: false,
  landedGate: "gate_a_map_knauf_enpc_steel_stud_topology_materials_tolerance_without_runtime_import",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: false,
  outputSupportChange: false,
  proposalReportCopyChange: false,
  routeCardValueChange: false,
  runtimeImportReadyNow: false,
  runtimeImportSelectedNow: false,
  runtimeTightening: false,
  runtimeWidening: false,
  selectedNextAction: "gate_c_no_runtime_closeout_and_next_slice_selection",
  sliceId: "steel_stud_knauf_enpc_mapping_tolerance_v1",
  sourceReadyRuntimeCandidate: false,
  supportPromotion: false,
  targetNextFile:
    "packages/engine/src/post-steel-stud-knauf-enpc-mapping-tolerance-v1-next-slice-selection-contract.test.ts",
  workbenchInputBehaviorChange: false
} as const;

const REQUIRED_SURFACES = [
  "packages/engine/src/steel-stud-knauf-enpc-mapping-tolerance-gate-a-contract.test.ts",
  "packages/engine/src/calculator-source-gap-revalidation-v6-gate-a-contract.test.ts",
  "packages/engine/src/knauf-wall-systems-source-pack-extraction-gate-a-contract.test.ts",
  "packages/engine/src/knauf-wall-systems-source-pack-extraction-gate-b-contract.test.ts",
  "packages/engine/src/wall-framed-facing-split-warning-stability-gate-a-contract.test.ts",
  "docs/calculator/SLICE_STEEL_STUD_KNAUF_ENPC_MAPPING_TOLERANCE_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-04-30_STEEL_STUD_KNAUF_ENPC_MAPPING_TOLERANCE_GATE_A_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-04-30_CALCULATOR_SOURCE_GAP_REVALIDATION_V6_GATE_A_HANDOFF.md",
  "docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "AGENTS.md"
] as const;

const KNAUF_ENPC_SOURCE_ROW = {
  boardEachSide: "2x12.5 mm Wallboard",
  couplingOrMounting: "single metal stud frame, non-deflection arrangement",
  cavityInsulation: "25 mm Knauf Insulation Acoustic Roll",
  metricContext: "lab_rw",
  pageOrTable: "Table Guide p.15 and EN Compliance Performer Wallboard p.17",
  rating: {
    rw: 49
  },
  retrievalDate: "2026-04-29",
  sideCount: "both_sides_lined",
  sourceLabel: "Knauf UK Drywall Systems Performance Guide April 2026",
  sourceUrl:
    "https://knauf.com/api/download-center/v1/assets/0f399ff9-ae51-4916-b290-c5f5d270a2e4?country=gb&download=true&locale=en-GB",
  stud: {
    centresMm: 600,
    depthMm: 50,
    gauge: "0.55",
    product: "Knauf C metal stud"
  },
  systemCode: "EN-PC-50-055-6-2-12.5-WB-25"
} as const;

const LIVE_ROUTE_TO_ENPC_TOPOLOGY_DELTA = {
  boardCount: "matches_two_boards_each_side",
  boardMaterial: "blocked_source_wallboard_vs_live_acoustic_gypsum_board",
  boardThickness: "matches_12p5_mm",
  cavityAndInsulation: "blocked_source_25_mm_acoustic_roll_vs_live_70_mm_glasswool_plus_5_mm_air_gap",
  coupling: "mapped_context_only_source_single_metal_stud_non_deflection_vs_live_line_connection",
  exactAnchorPrecedence: "live_knauf_lab_416889_primary_2026_stays_active_and_is_not_replaced_by_enpc_proximity",
  exactSourceRowSelectedForRuntime: false,
  sourceVsLiveRwDeltaDb: -6,
  studGaugeAndDepth: "blocked_source_50_mm_0p55_gauge_vs_live_generic_light_steel_stud_without_depth_or_gauge_input",
  studSpacing: "matches_600_mm",
  studType: "matches_light_steel_stud",
  topologyMatchForRuntime: false
} as const;

const MATERIAL_MAPPING_DECISIONS: readonly MappingDecision[] = [
  {
    decision: "mapped_context_only",
    localMaterialId: "gypsum",
    reason:
      "wallboard_is_not_the_live_acoustic_gypsum_board_anchor_and_matches_only_the_generic_gypsum_catalog_context",
    sourceMaterial: "Wallboard"
  },
  {
    decision: "blocked_not_exact",
    localMaterialId: "glasswool",
    reason:
      "25_mm_knauf_insulation_acoustic_roll_does_not_match_the_live_70_mm_glasswool_layer_plus_5_mm_air_gap_anchor",
    sourceMaterial: "Knauf Insulation Acoustic Roll"
  },
  {
    decision: "blocked_not_exact",
    localMaterialId: "light_steel_stud",
    reason:
      "the_engine_context_names_light_steel_stud_and_600_mm_centres_but_has_no_50_mm_depth_or_0p55_gauge_input",
    sourceMaterial: "50 mm 0.55 gauge Knauf C metal stud"
  },
  {
    decision: "mapped_context_only",
    localMaterialId: "line_connection",
    reason:
      "non_deflection_single_frame_context_is_directionally_line_connected_but_not_a_complete_engine_coupling_policy",
    sourceMaterial: "single metal stud frame, non-deflection arrangement"
  }
] as const;

const METRIC_POLICY_DECISION = {
  blockedTargetOutputs: ["R'w", "Dn,w", "Dn,A", "DnT,w", "DnT,A", "STC", "C", "Ctr"],
  fieldOutputOwnerNamed: false,
  labRwContextAllowed: true,
  labRwImportSelectedNow: false,
  reportedMetric: "Rw",
  sourceRwDb: 49,
  spectrumTermOwnerNamed: false,
  toleranceOwnerNamed: false
} as const;

const PROTECTED_NEGATIVE_BOUNDARIES: readonly NegativeBoundary[] = [
  {
    boundary: "existing_knauf_lab_416889_acoustic_board_exact_anchor",
    reason:
      "live_acoustic_gypsum_board_70_mm_glasswool_anchor_stays_exact_and_must_not_be_replaced_by_a_wallboard_25_mm_acoustic_roll_row"
  },
  {
    boundary: "existing_knauf_lab_416702_generic_gypsum_adjacent_anchor",
    reason:
      "generic_gypsum_lab_anchor_has_70_mm_glasswool_plus_5_mm_air_gap_and_still_does_not_match_enpc_25_mm_acoustic_roll"
  },
  {
    boundary: "field_or_building_output_proxies",
    reason:
      "a_lab_rw_steel_stud_row_does_not_own_flanking_room_normalisation_or_building_prediction_outputs"
  },
  {
    boundary: "TB.5A_timber_double_board",
    reason: "timber_sheetrock_one_rows_do_not_promote_or_reject_a_uk_steel_stud_wallboard_row"
  },
  {
    boundary: "MWI.2A_lined_masonry",
    reason: "lined_masonry_substrate_and_furring_rows_do_not_supply_steel_stud_wallboard_mapping_or_tolerance"
  },
  {
    boundary: "TTF30.2A_twin_timber",
    reason: "twin_timber_fiberock_frame_rows_do_not_supply_single_steel_stud_wallboard_truth"
  },
  {
    boundary: "AAC.1A_TSF120.1A_TO120.1A_adjacent_context",
    reason:
      "aac_staggered_timber_and_one_side_lined_rows_remain adjacent_or_negative_context_not_enpc_runtime_permission"
  }
] as const;

const ENPC_GATE_A_DECISION = {
  exactSourceRowSelectedForRuntime: false,
  localMaterialMappingComplete: false,
  metricOwnerComplete: false,
  nextRequiredGate: "gate_c_no_runtime_closeout_and_next_slice_selection",
  runtimeImportSelectedNow: false,
  selectedFieldOutputs: [],
  selectedLabRwImportNow: false,
  sourceReadyRuntimeCandidate: false,
  toleranceOwnerNamed: false
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

function generatedCase(id: string) {
  const found = ENGINE_MIXED_GENERATED_CASES.find((testCase) => testCase.id === id);

  if (!found) {
    throw new Error(`Missing generated case ${id}`);
  }

  return found;
}

function context(options: Parameters<typeof calculateAssembly>[1], label: string): AirborneContext {
  const value = options?.airborneContext;

  if (!value) {
    throw new Error(`${label} airborne context missing`);
  }

  return value;
}

function layerSignature(layers: readonly LayerInput[]): string[] {
  return layers.map((layer) => `${layer.materialId}:${layer.thicknessMm}`);
}

describe("steel-stud Knauf EN-PC mapping / tolerance Gate A contract", () => {
  it("lands Gate A as no-runtime mapping / tolerance work", () => {
    expect(STEEL_STUD_KNAUF_ENPC_GATE_A).toEqual({
      apiShapeChange: false,
      confidencePromotion: false,
      evidencePromotion: false,
      landedGate: "gate_a_map_knauf_enpc_steel_stud_topology_materials_tolerance_without_runtime_import",
      numericRuntimeBehaviorChange: false,
      outputCardStatusChange: false,
      outputSupportChange: false,
      proposalReportCopyChange: false,
      routeCardValueChange: false,
      runtimeImportReadyNow: false,
      runtimeImportSelectedNow: false,
      runtimeTightening: false,
      runtimeWidening: false,
      selectedNextAction: "gate_c_no_runtime_closeout_and_next_slice_selection",
      sliceId: "steel_stud_knauf_enpc_mapping_tolerance_v1",
      sourceReadyRuntimeCandidate: false,
      supportPromotion: false,
      targetNextFile:
        "packages/engine/src/post-steel-stud-knauf-enpc-mapping-tolerance-v1-next-slice-selection-contract.test.ts",
      workbenchInputBehaviorChange: false
    });

    for (const path of REQUIRED_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("pins the EN-PC source row as lab Rw context, not import approval", () => {
    expect(KNAUF_ENPC_SOURCE_ROW).toMatchObject({
      boardEachSide: "2x12.5 mm Wallboard",
      cavityInsulation: "25 mm Knauf Insulation Acoustic Roll",
      metricContext: "lab_rw",
      rating: { rw: 49 },
      sideCount: "both_sides_lined",
      sourceLabel: "Knauf UK Drywall Systems Performance Guide April 2026",
      systemCode: "EN-PC-50-055-6-2-12.5-WB-25"
    });
    expect(KNAUF_ENPC_SOURCE_ROW.stud).toEqual({
      centresMm: 600,
      depthMm: 50,
      gauge: "0.55",
      product: "Knauf C metal stud"
    });
  });

  it("pins the live steel-stud exact anchor and proves EN-PC is not an exact topology match", () => {
    const testCase = generatedCase("wall-lsf-knauf");
    const lab = calculateAssembly(testCase.rows, testCase.labOptions);
    const field = calculateAssembly(testCase.rows, testCase.fieldOptions);
    const labContext = context(testCase.labOptions, testCase.id);
    const fieldContext = context(testCase.fieldOptions, testCase.id);

    expect(layerSignature(testCase.rows)).toEqual([
      "acoustic_gypsum_board:12.5",
      "acoustic_gypsum_board:12.5",
      "air_gap:5",
      "glasswool:70",
      "acoustic_gypsum_board:12.5",
      "acoustic_gypsum_board:12.5"
    ]);
    expect(labContext).toMatchObject({
      connectionType: "line_connection",
      contextMode: "element_lab",
      studSpacingMm: 600,
      studType: "light_steel_stud"
    });
    expect(fieldContext).toMatchObject({
      connectionType: "line_connection",
      contextMode: "building_prediction",
      studSpacingMm: 600,
      studType: "light_steel_stud"
    });
    expect(findVerifiedAirborneAssemblyMatch(lab.layers, testCase.labOptions?.airborneContext)?.id).toBe(
      "knauf_lab_416889_primary_2026"
    );
    expect(findVerifiedAirborneAssemblyMatchWithLabFallback(field.layers, testCase.fieldOptions?.airborneContext))
      .toBeNull();
    expect(resultSnapshot(lab)).toMatchObject({
      c: -1.5,
      ctr: -6.4,
      dynamicFamily: "stud_wall_system",
      rw: 55,
      rwDb: 55,
      stc: 55
    });
    expect(resultSnapshot(field)).toMatchObject({
      c: -1.4,
      ctr: -6.4,
      dnTA: 51.1,
      dnTw: 52,
      dnW: 51,
      dynamicFamily: "stud_wall_system",
      rw: 51,
      rwPrimeDb: 51,
      stc: 51
    });
    expect(LIVE_ROUTE_TO_ENPC_TOPOLOGY_DELTA).toEqual({
      boardCount: "matches_two_boards_each_side",
      boardMaterial: "blocked_source_wallboard_vs_live_acoustic_gypsum_board",
      boardThickness: "matches_12p5_mm",
      cavityAndInsulation: "blocked_source_25_mm_acoustic_roll_vs_live_70_mm_glasswool_plus_5_mm_air_gap",
      coupling: "mapped_context_only_source_single_metal_stud_non_deflection_vs_live_line_connection",
      exactAnchorPrecedence: "live_knauf_lab_416889_primary_2026_stays_active_and_is_not_replaced_by_enpc_proximity",
      exactSourceRowSelectedForRuntime: false,
      sourceVsLiveRwDeltaDb: -6,
      studGaugeAndDepth:
        "blocked_source_50_mm_0p55_gauge_vs_live_generic_light_steel_stud_without_depth_or_gauge_input",
      studSpacing: "matches_600_mm",
      studType: "matches_light_steel_stud",
      topologyMatchForRuntime: false
    });
  });

  it("keeps material, metric, and tolerance decisions blocked before runtime movement", () => {
    expect(MATERIAL_MAPPING_DECISIONS).toEqual([
      {
        decision: "mapped_context_only",
        localMaterialId: "gypsum",
        reason:
          "wallboard_is_not_the_live_acoustic_gypsum_board_anchor_and_matches_only_the_generic_gypsum_catalog_context",
        sourceMaterial: "Wallboard"
      },
      {
        decision: "blocked_not_exact",
        localMaterialId: "glasswool",
        reason:
          "25_mm_knauf_insulation_acoustic_roll_does_not_match_the_live_70_mm_glasswool_layer_plus_5_mm_air_gap_anchor",
        sourceMaterial: "Knauf Insulation Acoustic Roll"
      },
      {
        decision: "blocked_not_exact",
        localMaterialId: "light_steel_stud",
        reason:
          "the_engine_context_names_light_steel_stud_and_600_mm_centres_but_has_no_50_mm_depth_or_0p55_gauge_input",
        sourceMaterial: "50 mm 0.55 gauge Knauf C metal stud"
      },
      {
        decision: "mapped_context_only",
        localMaterialId: "line_connection",
        reason:
          "non_deflection_single_frame_context_is_directionally_line_connected_but_not_a_complete_engine_coupling_policy",
        sourceMaterial: "single metal stud frame, non-deflection arrangement"
      }
    ]);
    expect(METRIC_POLICY_DECISION).toEqual({
      blockedTargetOutputs: ["R'w", "Dn,w", "Dn,A", "DnT,w", "DnT,A", "STC", "C", "Ctr"],
      fieldOutputOwnerNamed: false,
      labRwContextAllowed: true,
      labRwImportSelectedNow: false,
      reportedMetric: "Rw",
      sourceRwDb: 49,
      spectrumTermOwnerNamed: false,
      toleranceOwnerNamed: false
    });
    expect(ENPC_GATE_A_DECISION).toEqual({
      exactSourceRowSelectedForRuntime: false,
      localMaterialMappingComplete: false,
      metricOwnerComplete: false,
      nextRequiredGate: "gate_c_no_runtime_closeout_and_next_slice_selection",
      runtimeImportSelectedNow: false,
      selectedFieldOutputs: [],
      selectedLabRwImportNow: false,
      sourceReadyRuntimeCandidate: false,
      toleranceOwnerNamed: false
    });
  });

  it("protects adjacent and negative boundaries around EN-PC", () => {
    expect(PROTECTED_NEGATIVE_BOUNDARIES.map((boundary) => boundary.boundary)).toEqual([
      "existing_knauf_lab_416889_acoustic_board_exact_anchor",
      "existing_knauf_lab_416702_generic_gypsum_adjacent_anchor",
      "field_or_building_output_proxies",
      "TB.5A_timber_double_board",
      "MWI.2A_lined_masonry",
      "TTF30.2A_twin_timber",
      "AAC.1A_TSF120.1A_TO120.1A_adjacent_context"
    ]);
    expect(PROTECTED_NEGATIVE_BOUNDARIES.every((boundary) => boundary.reason.length > 60)).toBe(true);
  });

  it("keeps docs aligned on Gate C closeout as the next action", () => {
    const docs = [
      readRepoFile("AGENTS.md"),
      readRepoFile("docs/calculator/NEXT_IMPLEMENTATION_PLAN.md"),
      readRepoFile("docs/calculator/CURRENT_STATE.md"),
      readRepoFile("docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md"),
      readRepoFile("docs/calculator/SLICE_STEEL_STUD_KNAUF_ENPC_MAPPING_TOLERANCE_PLAN.md"),
      readRepoFile("docs/calculator/CHECKPOINT_2026-04-30_STEEL_STUD_KNAUF_ENPC_MAPPING_TOLERANCE_GATE_A_HANDOFF.md")
    ];

    for (const doc of docs) {
      expect(doc).toContain(STEEL_STUD_KNAUF_ENPC_GATE_A.sliceId);
      expect(doc).toContain(STEEL_STUD_KNAUF_ENPC_GATE_A.targetNextFile);
      expect(doc).toContain(STEEL_STUD_KNAUF_ENPC_GATE_A.selectedNextAction);
      expect(doc).toContain("EN-PC-50-055-6-2-12.5-WB-25");
    }
  });

  it("keeps frozen surfaces and validation expectations explicit", () => {
    const joinedDocs = [
      readRepoFile("docs/calculator/SLICE_STEEL_STUD_KNAUF_ENPC_MAPPING_TOLERANCE_PLAN.md"),
      readRepoFile("docs/calculator/CHECKPOINT_2026-04-30_STEEL_STUD_KNAUF_ENPC_MAPPING_TOLERANCE_GATE_A_HANDOFF.md")
    ].join("\n");

    for (const surface of FROZEN_SURFACES) {
      expect(joinedDocs, surface).toContain(surface);
    }

    expect(joinedDocs).toContain("pnpm --filter @dynecho/engine exec vitest run src/steel-stud-knauf-enpc-mapping-tolerance-gate-a-contract.test.ts --maxWorkers=1");
    expect(joinedDocs).toContain("pnpm calculator:gate:current");
    expect(joinedDocs).toContain("git diff --check");
  });
});
