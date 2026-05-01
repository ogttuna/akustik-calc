import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import type { AirborneContext, LayerInput } from "@dynecho/shared";

import { calculateAssembly } from "./calculate-assembly";
import {
  ENGINE_MIXED_GENERATED_CASES,
  resultSnapshot
} from "./mixed-floor-wall-generated-test-helpers";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const;
const FIELD_OUTPUTS = ["R'w", "Dn,w", "DnT,w", "DnT,A"] as const;

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

const TIMBER_DOUBLE_BOARD_KNAUF_TB5A_GATE_A = {
  apiShapeChange: false,
  confidencePromotion: false,
  evidencePromotion: false,
  landedGate: "gate_a_map_knauf_tb5a_topology_materials_tolerance_without_runtime_import",
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
  sliceId: "timber_double_board_knauf_tb5a_mapping_tolerance_v1",
  sourceReadyRuntimeCandidate: false,
  supportPromotion: false,
  targetNextFile:
    "packages/engine/src/post-timber-double-board-knauf-tb5a-mapping-tolerance-v1-next-slice-selection-contract.test.ts",
  workbenchInputBehaviorChange: false
} as const;

const REQUIRED_SURFACES = [
  "packages/engine/src/timber-double-board-knauf-tb5a-mapping-tolerance-gate-a-contract.test.ts",
  "packages/engine/src/calculator-source-gap-revalidation-v5-gate-a-contract.test.ts",
  "packages/engine/src/knauf-wall-systems-source-pack-extraction-gate-a-contract.test.ts",
  "packages/engine/src/knauf-wall-systems-source-pack-extraction-gate-b-contract.test.ts",
  "packages/engine/src/wall-timber-double-board-source-research-gate-a-contract.test.ts",
  "docs/calculator/SLICE_TIMBER_DOUBLE_BOARD_KNAUF_TB5A_MAPPING_TOLERANCE_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-04-30_TIMBER_DOUBLE_BOARD_KNAUF_TB5A_MAPPING_TOLERANCE_GATE_A_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-04-30_CALCULATOR_SOURCE_GAP_REVALIDATION_V5_GATE_A_HANDOFF.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "AGENTS.md"
] as const;

const KNAUF_TB5A_SOURCE_ROW = {
  acousticRatingsBasis: "RT&A TE405-20S04(R4)",
  boardSide1: "2x13 mm SHEETROCK ONE",
  boardSide2: "2x13 mm SHEETROCK ONE",
  columns: [
    {
      nominalWallWidthMm: 122,
      rwCtrByInsulation: {
        ki50g11: "46(39)",
        ki75g11: "46(39)",
        ki90g11: null,
        nil: "40(34)"
      },
      studSizeMm: 70
    },
    {
      nominalWallWidthMm: 142,
      rwCtrByInsulation: {
        ki50g11: "47(40)",
        ki75g11: "47(40)",
        ki90g11: "47(40)",
        nil: "41(35)"
      },
      studSizeMm: 90
    }
  ],
  metricContext: "lab_rw_plus_rw_ctr",
  pageOrTable: "D Timber Stud Walls, TB.5 lined both sides",
  retrievalDate: "2026-04-30",
  sourceLabel: "Knauf AU Systems+ Section D Timber Stud Walls",
  sourceUrl:
    "https://knauf.com/api/download-center/v1/assets/4e58706c-df9d-4579-8d5b-8e685cf29194?country=AU&download=true&locale=en-AU",
  studSpacingMm: 600,
  systemCode: "TB.5A"
} as const;

const LIVE_ROUTE_TO_TB5A_TOPOLOGY_DELTA = {
  boardCount: "matches_two_boards_each_side",
  boardMaterial: "blocked_source_sheetrock_one_vs_live_generic_gypsum_board",
  boardThickness: "blocked_source_13_mm_vs_live_12p5_mm",
  cavityAndInsulation: "blocked_source_75_mm_glasswool_vs_live_50_mm_rockwool_plus_50_mm_air_gap",
  connectionType: "matches_line_connection",
  exactColumnDecision: "not_selectable_because_live_stud_depth_is_not_carried_as_engine_input",
  studSpacing: "matches_600_mm",
  studType: "matches_wood_stud",
  topologyMatchForRuntime: false
} as const;

const MATERIAL_MAPPING_DECISIONS: readonly MappingDecision[] = [
  {
    decision: "mapped_context_only",
    localMaterialId: "gypsum_board",
    reason:
      "SHEETROCK_ONE_is_a_proprietary_13_mm_board_while_the_live_route_uses_generic_12p5_mm_gypsum_board",
    sourceMaterial: "SHEETROCK ONE"
  },
  {
    decision: "blocked_not_exact",
    localMaterialId: "rockwool",
    reason:
      "KI_75G11_is_75_mm_11_kg_m3_glasswool_while_the_live_route_uses_50_mm_rockwool_plus_a_50_mm_air_gap",
    sourceMaterial: "KI 75G11"
  }
] as const;

const METRIC_POLICY_DECISION = {
  blockedTargetOutputs: ["R'w", "Dn,w", "DnT,w", "DnT,A", "STC", "C", "Ctr"],
  fieldOutputOwnerNamed: false,
  labRwContextAllowed: true,
  rwPlusCtrIsSpectrumContextOnly: true,
  selectedLabRwImportNow: false,
  toleranceOwnerNamed: false
} as const;

const PROTECTED_NEGATIVE_BOUNDARIES: readonly NegativeBoundary[] = [
  {
    boundary: "TO120.1A_one_side_lined",
    reason: "one_side_lined_timber_row_is_not_two_sided_timber_double_board_truth"
  },
  {
    boundary: "TSF120.1A_staggered_stud",
    reason: "staggered_stud_topology_and_fiberock_mapping_are_not_live_direct_timber_inputs"
  },
  {
    boundary: "TTF30.2A_twin_timber",
    reason: "twin_frame_gap_and_asymmetric_boards_are_not_the_live_single_frame_direct_route"
  },
  {
    boundary: "single_board_timber_exact_imports",
    reason:
      "single_board_rows_do_not_promote_the_live_double_board_route_without_board_count_and_layer_signature_match"
  },
  {
    boundary: "rb1_rb2_resilient_timber_rows",
    reason: "resilient_rows_require_explicit_side_count_and_do_not_promote_direct_line_connection"
  },
  {
    boundary: "steel_clt_masonry_adjacent_context",
    reason: "non_timber_or_non_stud_context_must_not_promote_tb5a_or_the_live_timber_route"
  }
] as const;

const TB5A_GATE_A_DECISION = {
  directRuntimeImportSelectedNow: false,
  exactColumnSelected: false,
  formulaToleranceGateSelectedNow: false,
  localMaterialMappingComplete: false,
  metricOwnerComplete: false,
  nextRequiredGate: "gate_c_no_runtime_closeout_and_next_slice_selection",
  selectedFieldOutputs: [],
  selectedLabRwImportNow: false,
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

describe("timber double-board Knauf TB.5A mapping / tolerance Gate A contract", () => {
  it("lands Gate A as no-runtime mapping / tolerance work", () => {
    expect(TIMBER_DOUBLE_BOARD_KNAUF_TB5A_GATE_A).toEqual({
      apiShapeChange: false,
      confidencePromotion: false,
      evidencePromotion: false,
      landedGate: "gate_a_map_knauf_tb5a_topology_materials_tolerance_without_runtime_import",
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
      sliceId: "timber_double_board_knauf_tb5a_mapping_tolerance_v1",
      sourceReadyRuntimeCandidate: false,
      supportPromotion: false,
      targetNextFile:
        "packages/engine/src/post-timber-double-board-knauf-tb5a-mapping-tolerance-v1-next-slice-selection-contract.test.ts",
      workbenchInputBehaviorChange: false
    });

    for (const path of REQUIRED_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("pins the TB.5A source row as lab Rw context, not import approval", () => {
    expect(KNAUF_TB5A_SOURCE_ROW).toMatchObject({
      acousticRatingsBasis: "RT&A TE405-20S04(R4)",
      boardSide1: "2x13 mm SHEETROCK ONE",
      boardSide2: "2x13 mm SHEETROCK ONE",
      metricContext: "lab_rw_plus_rw_ctr",
      pageOrTable: "D Timber Stud Walls, TB.5 lined both sides",
      sourceLabel: "Knauf AU Systems+ Section D Timber Stud Walls",
      studSpacingMm: 600,
      systemCode: "TB.5A"
    });
    expect(KNAUF_TB5A_SOURCE_ROW.columns).toEqual([
      {
        nominalWallWidthMm: 122,
        rwCtrByInsulation: {
          ki50g11: "46(39)",
          ki75g11: "46(39)",
          ki90g11: null,
          nil: "40(34)"
        },
        studSizeMm: 70
      },
      {
        nominalWallWidthMm: 142,
        rwCtrByInsulation: {
          ki50g11: "47(40)",
          ki75g11: "47(40)",
          ki90g11: "47(40)",
          nil: "41(35)"
        },
        studSizeMm: 90
      }
    ]);
  });

  it("pins the live timber route and proves TB.5A is not an exact topology match", () => {
    const testCase = generatedCase("wall-timber-stud");
    const lab = calculateAssembly(testCase.rows, testCase.labOptions);
    const field = calculateAssembly(testCase.rows, testCase.fieldOptions);
    const labContext = context(testCase.labOptions, testCase.id);
    const fieldContext = context(testCase.fieldOptions, testCase.id);

    expect(layerSignature(testCase.rows)).toEqual([
      "gypsum_board:12.5",
      "gypsum_board:12.5",
      "rockwool:50",
      "air_gap:50",
      "gypsum_board:12.5",
      "gypsum_board:12.5"
    ]);
    expect(labContext).toMatchObject({
      connectionType: "line_connection",
      contextMode: "element_lab",
      studSpacingMm: 600,
      studType: "wood_stud"
    });
    expect(fieldContext).toMatchObject({
      connectionType: "line_connection",
      contextMode: "building_prediction",
      studSpacingMm: 600,
      studType: "wood_stud"
    });
    expect(resultSnapshot(lab)).toMatchObject({
      dynamicFamily: "stud_wall_system",
      rw: 50,
      rwDb: 50
    });
    expect(resultSnapshot(field)).toMatchObject({
      dnTA: 43.9,
      dnTw: 43,
      dnW: 42,
      dynamicFamily: "stud_wall_system",
      rw: 42,
      rwPrimeDb: 42
    });
    expect(resultSnapshot(lab).supportedTargetOutputs).toEqual([...LAB_OUTPUTS]);
    expect(resultSnapshot(field).supportedTargetOutputs).toEqual([...FIELD_OUTPUTS]);
    expect(LIVE_ROUTE_TO_TB5A_TOPOLOGY_DELTA).toEqual({
      boardCount: "matches_two_boards_each_side",
      boardMaterial: "blocked_source_sheetrock_one_vs_live_generic_gypsum_board",
      boardThickness: "blocked_source_13_mm_vs_live_12p5_mm",
      cavityAndInsulation: "blocked_source_75_mm_glasswool_vs_live_50_mm_rockwool_plus_50_mm_air_gap",
      connectionType: "matches_line_connection",
      exactColumnDecision: "not_selectable_because_live_stud_depth_is_not_carried_as_engine_input",
      studSpacing: "matches_600_mm",
      studType: "matches_wood_stud",
      topologyMatchForRuntime: false
    });
  });

  it("keeps material, metric, and tolerance decisions blocked before runtime movement", () => {
    expect(MATERIAL_MAPPING_DECISIONS).toEqual([
      {
        decision: "mapped_context_only",
        localMaterialId: "gypsum_board",
        reason:
          "SHEETROCK_ONE_is_a_proprietary_13_mm_board_while_the_live_route_uses_generic_12p5_mm_gypsum_board",
        sourceMaterial: "SHEETROCK ONE"
      },
      {
        decision: "blocked_not_exact",
        localMaterialId: "rockwool",
        reason:
          "KI_75G11_is_75_mm_11_kg_m3_glasswool_while_the_live_route_uses_50_mm_rockwool_plus_a_50_mm_air_gap",
        sourceMaterial: "KI 75G11"
      }
    ]);
    expect(METRIC_POLICY_DECISION).toEqual({
      blockedTargetOutputs: ["R'w", "Dn,w", "DnT,w", "DnT,A", "STC", "C", "Ctr"],
      fieldOutputOwnerNamed: false,
      labRwContextAllowed: true,
      rwPlusCtrIsSpectrumContextOnly: true,
      selectedLabRwImportNow: false,
      toleranceOwnerNamed: false
    });
    expect(TB5A_GATE_A_DECISION).toEqual({
      directRuntimeImportSelectedNow: false,
      exactColumnSelected: false,
      formulaToleranceGateSelectedNow: false,
      localMaterialMappingComplete: false,
      metricOwnerComplete: false,
      nextRequiredGate: "gate_c_no_runtime_closeout_and_next_slice_selection",
      selectedFieldOutputs: [],
      selectedLabRwImportNow: false,
      toleranceOwnerNamed: false
    });
  });

  it("protects adjacent and negative boundaries around TB.5A", () => {
    expect(PROTECTED_NEGATIVE_BOUNDARIES.map((boundary) => boundary.boundary)).toEqual([
      "TO120.1A_one_side_lined",
      "TSF120.1A_staggered_stud",
      "TTF30.2A_twin_timber",
      "single_board_timber_exact_imports",
      "rb1_rb2_resilient_timber_rows",
      "steel_clt_masonry_adjacent_context"
    ]);
    expect(PROTECTED_NEGATIVE_BOUNDARIES.every((boundary) => boundary.reason.length > 60)).toBe(true);
  });

  it("keeps docs aligned on Gate C closeout as the next action", () => {
    const docs = [
      readRepoFile("AGENTS.md"),
      readRepoFile("docs/calculator/NEXT_IMPLEMENTATION_PLAN.md"),
      readRepoFile("docs/calculator/CURRENT_STATE.md"),
      readRepoFile("docs/calculator/SLICE_TIMBER_DOUBLE_BOARD_KNAUF_TB5A_MAPPING_TOLERANCE_PLAN.md"),
      readRepoFile("docs/calculator/CHECKPOINT_2026-04-30_TIMBER_DOUBLE_BOARD_KNAUF_TB5A_MAPPING_TOLERANCE_GATE_A_HANDOFF.md")
    ];

    for (const doc of docs) {
      expect(doc).toContain(TIMBER_DOUBLE_BOARD_KNAUF_TB5A_GATE_A.sliceId);
      expect(doc).toContain(TIMBER_DOUBLE_BOARD_KNAUF_TB5A_GATE_A.targetNextFile);
      expect(doc).toContain(TIMBER_DOUBLE_BOARD_KNAUF_TB5A_GATE_A.selectedNextAction);
      expect(doc).toContain("TB.5A");
    }
  });

  it("keeps frozen surfaces and validation expectations explicit", () => {
    const joinedDocs = [
      readRepoFile("docs/calculator/SLICE_TIMBER_DOUBLE_BOARD_KNAUF_TB5A_MAPPING_TOLERANCE_PLAN.md"),
      readRepoFile("docs/calculator/CHECKPOINT_2026-04-30_TIMBER_DOUBLE_BOARD_KNAUF_TB5A_MAPPING_TOLERANCE_GATE_A_HANDOFF.md")
    ].join("\n");

    for (const surface of FROZEN_SURFACES) {
      expect(joinedDocs, surface).toContain(surface);
    }

    expect(joinedDocs).toContain("pnpm --filter @dynecho/engine exec vitest run src/timber-double-board-knauf-tb5a-mapping-tolerance-gate-a-contract.test.ts --maxWorkers=1");
    expect(joinedDocs).toContain("pnpm calculator:gate:current");
    expect(joinedDocs).toContain("git diff --check");
  });
});
