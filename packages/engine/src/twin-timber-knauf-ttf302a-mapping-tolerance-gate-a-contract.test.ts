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

const TWIN_TIMBER_KNAUF_TTF302A_GATE_A = {
  apiShapeChange: false,
  confidencePromotion: false,
  evidencePromotion: false,
  landedGate: "gate_a_map_knauf_ttf302a_twin_timber_topology_materials_tolerance_without_runtime_import",
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
  sliceId: "twin_timber_knauf_ttf302a_mapping_tolerance_v1",
  sourceReadyRuntimeCandidate: false,
  supportPromotion: false,
  targetNextFile:
    "packages/engine/src/post-twin-timber-knauf-ttf302a-mapping-tolerance-v1-next-slice-selection-contract.test.ts",
  workbenchInputBehaviorChange: false
} as const;

const REQUIRED_SURFACES = [
  "packages/engine/src/twin-timber-knauf-ttf302a-mapping-tolerance-gate-a-contract.test.ts",
  "packages/engine/src/post-lined-masonry-knauf-mwi2a-mapping-tolerance-v1-next-slice-selection-contract.test.ts",
  "packages/engine/src/knauf-wall-systems-source-pack-extraction-gate-a-contract.test.ts",
  "packages/engine/src/knauf-wall-systems-source-pack-extraction-gate-b-contract.test.ts",
  "packages/engine/src/timber-double-board-knauf-tb5a-mapping-tolerance-gate-a-contract.test.ts",
  "packages/engine/src/wall-no-stud-double-leaf-source-research-gate-b-contract.test.ts",
  "docs/calculator/SLICE_TWIN_TIMBER_KNAUF_TTF302A_MAPPING_TOLERANCE_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-04-30_TWIN_TIMBER_KNAUF_TTF302A_MAPPING_TOLERANCE_GATE_A_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-04-30_LINED_MASONRY_KNAUF_MWI2A_MAPPING_TOLERANCE_GATE_C_CLOSEOUT_HANDOFF.md",
  "docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "AGENTS.md"
] as const;

const KNAUF_TTF302A_SOURCE_ROW = {
  acousticRatingsBasis: "SLR-FB-T-DS-01",
  boardSide1: "1x13 mm FIBEROCK AQUA-TOUGH",
  boardSide2: "2x13 mm FIBEROCK AQUA-TOUGH",
  couplingOrMounting: "two timber stud frames separated by 20 mm gap",
  metricContext: "lab_rw_plus_rw_ctr",
  pageOrTable: "D 60-61 FIBEROCK AQUA-TOUGH - Twin Stud, TTF30.2",
  retrievalDate: "2026-04-30",
  sourceLabel: "Knauf AU Systems+ Section D Timber Stud Walls",
  sourceUrl:
    "https://knauf.com/api/download-center/v1/assets/4e58706c-df9d-4579-8d5b-8e685cf29194?country=AU&download=true&locale=en-AU",
  studSpacingMm: 600,
  systemCode: "TTF30.2A",
  variants: [
    {
      minWallWidthMm: 199,
      ratings: {
        bothSidesKi50g11: { rw: 60, rwCtr: 50 },
        bothSidesKi75g11: { rw: 61, rwCtr: 51 },
        bothSidesKi90g11: null,
        nil: { rw: 49, rwCtr: 41 },
        oneSideKi50g11: { rw: 58, rwCtr: 48 },
        oneSideKi75g11: { rw: 59, rwCtr: 49 },
        oneSideKi90g11: null
      },
      studSizeMm: 70
    },
    {
      minWallWidthMm: 239,
      ratings: {
        bothSidesKi50g11: { rw: 62, rwCtr: 52 },
        bothSidesKi75g11: { rw: 63, rwCtr: 53 },
        bothSidesKi90g11: { rw: 64, rwCtr: 54 },
        nil: { rw: 51, rwCtr: 43 },
        oneSideKi50g11: { rw: 60, rwCtr: 51 },
        oneSideKi75g11: { rw: 61, rwCtr: 52 },
        oneSideKi90g11: { rw: 61, rwCtr: 52 }
      },
      studSizeMm: 90
    }
  ]
} as const;

const LIVE_ROUTE_TO_TTF302A_TOPOLOGY_DELTA = {
  boardMaterial: "blocked_source_fiberock_aqua_tough_vs_live_generic_gypsum_board",
  boardSideAsymmetry: "blocked_source_1x13_side1_2x13_side2_vs_live_symmetric_2x12p5_each_side",
  boardThickness: "blocked_source_13_mm_vs_live_12p5_mm",
  exactColumnDecision: "not_selectable_because_live_stud_depth_min_wall_width_and_twin_frame_gap_are_not_engine_inputs",
  insulation:
    "blocked_source_ki50g11_ki75g11_ki90g11_glasswool_one_or_both_sides_vs_live_50_mm_rockwool_plus_50_mm_air_gap",
  noStudDoubleLeafFit: "blocked_source_has_twin_timber_studs_so_no_stud_double_leaf_formula_routes_stay_closed",
  rawOpenBoxOpenWebFit: "blocked_wall_twin_timber_source_row_does_not_supply_floor_open_box_or_open_web_truth",
  studType: "mapped_context_only_source_timber_studs_vs_live_single_wood_stud_context",
  topologyMatchForRuntime: false,
  twinFrameGap: "blocked_source_two_frames_with_20_mm_gap_vs_live_single_stud_wall_formula_surrogate"
} as const;

const MATERIAL_MAPPING_DECISIONS: readonly MappingDecision[] = [
  {
    decision: "blocked_not_exact",
    localMaterialId: "gypsum_board",
    reason:
      "FIBEROCK_AQUA_TOUGH_is_a_proprietary_wet_area_gypsum_fibre_board_and_cannot_be_collapsed_to_generic_12p5_mm_gypsum_board",
    sourceMaterial: "FIBEROCK AQUA-TOUGH"
  },
  {
    decision: "mapped_context_only",
    localMaterialId: "wood_stud",
    reason:
      "the_live_context_can_name_wood_stud_but_has_no_twin_frame_count_20_mm_gap_or_independent_frame_coupling_input",
    sourceMaterial: "twin timber studs"
  },
  {
    decision: "blocked_not_exact",
    localMaterialId: "air_gap",
    reason:
      "the_source_20_mm_interframe_gap_is_a_coupling_separator_between_two_frames_not_the_live_unsided_50_mm_air_gap_layer",
    sourceMaterial: "20 mm twin-frame gap"
  },
  {
    decision: "blocked_not_exact",
    localMaterialId: "rockwool",
    reason:
      "KI_50G11_KI_75G11_and_KI_90G11_are_11_kg_m3_glasswool_variants_with_one_or_both_side_placement_not_live_50_mm_rockwool",
    sourceMaterial: "KI 50G11 / KI 75G11 / KI 90G11"
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

const CURRENT_TTF302A_BOUNDARY_ROUTE_COMPARISON = [
  {
    exactFit: false,
    reason:
      "live_wall_timber_stud_is_a_single_formula_owned_wood_stud_surrogate_with_symmetric_generic_boards_not_twin_frames",
    route: "wall-timber-stud"
  },
  {
    exactFit: false,
    reason:
      "tb5a_context_has_direct_single_frame_double_board_sheetrock_rows_not_asymmetric_twin_fiberock_frames",
    route: "TB.5A direct timber double-board context"
  },
  {
    exactFit: false,
    reason:
      "no_stud_double_leaf_routes_intentionally_exclude_studs_and_must_not_be_reopened_by_a_twin_stud_source_row",
    route: "no-stud double-leaf formula routes"
  },
  {
    exactFit: false,
    reason:
      "raw_open_box_and_open_web_families_are_floor_or_open_carrier_boundaries_not_wall_twin_timber_truth",
    route: "raw open-box / open-web floor routes"
  }
] as const;

const PROTECTED_NEGATIVE_BOUNDARIES: readonly NegativeBoundary[] = [
  {
    boundary: "no_stud_double_leaf_formula_routes",
    reason:
      "ttf302a_contains_twin_timber_studs_and_cannot_reopen_no_stud_empty_or_porous_double_leaf_routes_without_separate_no_stud_source_evidence"
  },
  {
    boundary: "raw_open_box_open_web_floor_routes",
    reason:
      "a_wall_twin_stud_source_row_does_not_authorize_floor_open_box_open_web_or_generated_fallback_output_promotion"
  },
  {
    boundary: "simple_timber_and_tb5a_direct_routes",
    reason:
      "single_frame_direct_timber_or_tb5a_double_board_context_lacks_twin_frame_gap_and_asymmetric_fiberock_side_mapping"
  },
  {
    boundary: "TSF120.1A_staggered_timber_adjacent",
    reason:
      "staggered_stud_topology_has_different_frame_coupling_board_thickness_and_fire_rating_context_than_ttf302a"
  },
  {
    boundary: "TO120.1A_one_side_lined_negative",
    reason:
      "one_side_lined_timber_rows_do_not_supply_both_side_asymmetric_twin_frame_fiberock_truth"
  },
  {
    boundary: "steel_clt_masonry_context",
    reason:
      "non_timber_stud_steel_clt_and_masonry_context_must_not_promote_ttf302a_or_current_timber_values"
  }
] as const;

const TTF302A_GATE_A_DECISION = {
  exactColumnSelected: false,
  localMaterialMappingComplete: false,
  metricOwnerComplete: false,
  nextRequiredGate: "gate_c_no_runtime_closeout_and_next_slice_selection",
  runtimeImportSelectedNow: false,
  selectedFieldOutputs: [],
  selectedLabRwImportNow: false,
  sourceReadyRuntimeCandidate: false,
  toleranceOwnerNamed: false,
  twinFrameFamilyRuleNamed: false
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

describe("twin timber Knauf TTF30.2A mapping / tolerance Gate A contract", () => {
  it("lands Gate A as no-runtime mapping / tolerance work", () => {
    expect(TWIN_TIMBER_KNAUF_TTF302A_GATE_A).toEqual({
      apiShapeChange: false,
      confidencePromotion: false,
      evidencePromotion: false,
      landedGate: "gate_a_map_knauf_ttf302a_twin_timber_topology_materials_tolerance_without_runtime_import",
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
      sliceId: "twin_timber_knauf_ttf302a_mapping_tolerance_v1",
      sourceReadyRuntimeCandidate: false,
      supportPromotion: false,
      targetNextFile:
        "packages/engine/src/post-twin-timber-knauf-ttf302a-mapping-tolerance-v1-next-slice-selection-contract.test.ts",
      workbenchInputBehaviorChange: false
    });

    for (const path of REQUIRED_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("pins the official TTF30.2A row values as lab Rw context, not import approval", () => {
    expect(KNAUF_TTF302A_SOURCE_ROW).toMatchObject({
      acousticRatingsBasis: "SLR-FB-T-DS-01",
      boardSide1: "1x13 mm FIBEROCK AQUA-TOUGH",
      boardSide2: "2x13 mm FIBEROCK AQUA-TOUGH",
      couplingOrMounting: "two timber stud frames separated by 20 mm gap",
      metricContext: "lab_rw_plus_rw_ctr",
      sourceLabel: "Knauf AU Systems+ Section D Timber Stud Walls",
      studSpacingMm: 600,
      systemCode: "TTF30.2A"
    });
    expect(KNAUF_TTF302A_SOURCE_ROW.variants).toEqual([
      {
        minWallWidthMm: 199,
        ratings: {
          bothSidesKi50g11: { rw: 60, rwCtr: 50 },
          bothSidesKi75g11: { rw: 61, rwCtr: 51 },
          bothSidesKi90g11: null,
          nil: { rw: 49, rwCtr: 41 },
          oneSideKi50g11: { rw: 58, rwCtr: 48 },
          oneSideKi75g11: { rw: 59, rwCtr: 49 },
          oneSideKi90g11: null
        },
        studSizeMm: 70
      },
      {
        minWallWidthMm: 239,
        ratings: {
          bothSidesKi50g11: { rw: 62, rwCtr: 52 },
          bothSidesKi75g11: { rw: 63, rwCtr: 53 },
          bothSidesKi90g11: { rw: 64, rwCtr: 54 },
          nil: { rw: 51, rwCtr: 43 },
          oneSideKi50g11: { rw: 60, rwCtr: 51 },
          oneSideKi75g11: { rw: 61, rwCtr: 52 },
          oneSideKi90g11: { rw: 61, rwCtr: 52 }
        },
        studSizeMm: 90
      }
    ]);
  });

  it("pins the live timber route and proves TTF30.2A is not an exact topology match", () => {
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
      c: 0.5,
      ctr: -4.2,
      dynamicFamily: "stud_wall_system",
      rw: 50,
      rwDb: 50,
      stc: 50
    });
    expect(resultSnapshot(field)).toMatchObject({
      c: 0.4,
      ctr: -4.3,
      dnTA: 43.9,
      dnTw: 43,
      dnW: 42,
      dynamicFamily: "stud_wall_system",
      rw: 42,
      rwPrimeDb: 42,
      stc: 42
    });
    expect(resultSnapshot(lab).supportedTargetOutputs).toEqual([...LAB_OUTPUTS]);
    expect(resultSnapshot(field).supportedTargetOutputs).toEqual([...FIELD_OUTPUTS]);
    expect(LIVE_ROUTE_TO_TTF302A_TOPOLOGY_DELTA).toEqual({
      boardMaterial: "blocked_source_fiberock_aqua_tough_vs_live_generic_gypsum_board",
      boardSideAsymmetry: "blocked_source_1x13_side1_2x13_side2_vs_live_symmetric_2x12p5_each_side",
      boardThickness: "blocked_source_13_mm_vs_live_12p5_mm",
      exactColumnDecision:
        "not_selectable_because_live_stud_depth_min_wall_width_and_twin_frame_gap_are_not_engine_inputs",
      insulation:
        "blocked_source_ki50g11_ki75g11_ki90g11_glasswool_one_or_both_sides_vs_live_50_mm_rockwool_plus_50_mm_air_gap",
      noStudDoubleLeafFit: "blocked_source_has_twin_timber_studs_so_no_stud_double_leaf_formula_routes_stay_closed",
      rawOpenBoxOpenWebFit: "blocked_wall_twin_timber_source_row_does_not_supply_floor_open_box_or_open_web_truth",
      studType: "mapped_context_only_source_timber_studs_vs_live_single_wood_stud_context",
      topologyMatchForRuntime: false,
      twinFrameGap: "blocked_source_two_frames_with_20_mm_gap_vs_live_single_stud_wall_formula_surrogate"
    });
  });

  it("keeps no-stud, raw floor, and simple timber route boundaries closed", () => {
    expect(CURRENT_TTF302A_BOUNDARY_ROUTE_COMPARISON).toEqual([
      {
        exactFit: false,
        reason:
          "live_wall_timber_stud_is_a_single_formula_owned_wood_stud_surrogate_with_symmetric_generic_boards_not_twin_frames",
        route: "wall-timber-stud"
      },
      {
        exactFit: false,
        reason:
          "tb5a_context_has_direct_single_frame_double_board_sheetrock_rows_not_asymmetric_twin_fiberock_frames",
        route: "TB.5A direct timber double-board context"
      },
      {
        exactFit: false,
        reason:
          "no_stud_double_leaf_routes_intentionally_exclude_studs_and_must_not_be_reopened_by_a_twin_stud_source_row",
        route: "no-stud double-leaf formula routes"
      },
      {
        exactFit: false,
        reason:
          "raw_open_box_and_open_web_families_are_floor_or_open_carrier_boundaries_not_wall_twin_timber_truth",
        route: "raw open-box / open-web floor routes"
      }
    ]);
    expect(CURRENT_TTF302A_BOUNDARY_ROUTE_COMPARISON.every((route) => route.exactFit === false)).toBe(true);
  });

  it("keeps material, metric, and tolerance decisions blocked before runtime movement", () => {
    expect(MATERIAL_MAPPING_DECISIONS).toEqual([
      {
        decision: "blocked_not_exact",
        localMaterialId: "gypsum_board",
        reason:
          "FIBEROCK_AQUA_TOUGH_is_a_proprietary_wet_area_gypsum_fibre_board_and_cannot_be_collapsed_to_generic_12p5_mm_gypsum_board",
        sourceMaterial: "FIBEROCK AQUA-TOUGH"
      },
      {
        decision: "mapped_context_only",
        localMaterialId: "wood_stud",
        reason:
          "the_live_context_can_name_wood_stud_but_has_no_twin_frame_count_20_mm_gap_or_independent_frame_coupling_input",
        sourceMaterial: "twin timber studs"
      },
      {
        decision: "blocked_not_exact",
        localMaterialId: "air_gap",
        reason:
          "the_source_20_mm_interframe_gap_is_a_coupling_separator_between_two_frames_not_the_live_unsided_50_mm_air_gap_layer",
        sourceMaterial: "20 mm twin-frame gap"
      },
      {
        decision: "blocked_not_exact",
        localMaterialId: "rockwool",
        reason:
          "KI_50G11_KI_75G11_and_KI_90G11_are_11_kg_m3_glasswool_variants_with_one_or_both_side_placement_not_live_50_mm_rockwool",
        sourceMaterial: "KI 50G11 / KI 75G11 / KI 90G11"
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
    expect(TTF302A_GATE_A_DECISION).toEqual({
      exactColumnSelected: false,
      localMaterialMappingComplete: false,
      metricOwnerComplete: false,
      nextRequiredGate: "gate_c_no_runtime_closeout_and_next_slice_selection",
      runtimeImportSelectedNow: false,
      selectedFieldOutputs: [],
      selectedLabRwImportNow: false,
      sourceReadyRuntimeCandidate: false,
      toleranceOwnerNamed: false,
      twinFrameFamilyRuleNamed: false
    });
  });

  it("protects adjacent and negative boundaries around TTF30.2A", () => {
    expect(PROTECTED_NEGATIVE_BOUNDARIES.map((boundary) => boundary.boundary)).toEqual([
      "no_stud_double_leaf_formula_routes",
      "raw_open_box_open_web_floor_routes",
      "simple_timber_and_tb5a_direct_routes",
      "TSF120.1A_staggered_timber_adjacent",
      "TO120.1A_one_side_lined_negative",
      "steel_clt_masonry_context"
    ]);
    expect(PROTECTED_NEGATIVE_BOUNDARIES.every((boundary) => boundary.reason.length > 70)).toBe(true);
  });

  it("keeps docs aligned on Gate C closeout as the next action", () => {
    const docs = [
      readRepoFile("AGENTS.md"),
      readRepoFile("docs/calculator/NEXT_IMPLEMENTATION_PLAN.md"),
      readRepoFile("docs/calculator/CURRENT_STATE.md"),
      readRepoFile("docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md"),
      readRepoFile("docs/calculator/SLICE_TWIN_TIMBER_KNAUF_TTF302A_MAPPING_TOLERANCE_PLAN.md"),
      readRepoFile("docs/calculator/CHECKPOINT_2026-04-30_TWIN_TIMBER_KNAUF_TTF302A_MAPPING_TOLERANCE_GATE_A_HANDOFF.md")
    ];

    for (const doc of docs) {
      expect(doc).toContain(TWIN_TIMBER_KNAUF_TTF302A_GATE_A.sliceId);
      expect(doc).toContain(TWIN_TIMBER_KNAUF_TTF302A_GATE_A.targetNextFile);
      expect(doc).toContain(TWIN_TIMBER_KNAUF_TTF302A_GATE_A.selectedNextAction);
      expect(doc).toContain("TTF30.2A");
    }
  });

  it("keeps frozen surfaces and validation expectations explicit", () => {
    const joinedDocs = [
      readRepoFile("docs/calculator/SLICE_TWIN_TIMBER_KNAUF_TTF302A_MAPPING_TOLERANCE_PLAN.md"),
      readRepoFile("docs/calculator/CHECKPOINT_2026-04-30_TWIN_TIMBER_KNAUF_TTF302A_MAPPING_TOLERANCE_GATE_A_HANDOFF.md")
    ].join("\n");

    for (const surface of FROZEN_SURFACES) {
      expect(joinedDocs, surface).toContain(surface);
    }

    expect(joinedDocs).toContain("pnpm --filter @dynecho/engine exec vitest run src/twin-timber-knauf-ttf302a-mapping-tolerance-gate-a-contract.test.ts --maxWorkers=1");
    expect(joinedDocs).toContain("pnpm calculator:gate:current");
    expect(joinedDocs).toContain("git diff --check");
  });
});
