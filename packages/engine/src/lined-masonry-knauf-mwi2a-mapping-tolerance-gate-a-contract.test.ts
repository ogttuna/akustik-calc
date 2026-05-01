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

const LINED_MASONRY_KNAUF_MWI2A_GATE_A = {
  apiShapeChange: false,
  confidencePromotion: false,
  evidencePromotion: false,
  landedGate: "gate_a_map_knauf_mwi2a_lined_masonry_topology_materials_tolerance_without_runtime_import",
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
  sliceId: "lined_masonry_knauf_mwi2a_mapping_tolerance_v1",
  sourceReadyRuntimeCandidate: false,
  supportPromotion: false,
  targetNextFile:
    "packages/engine/src/post-lined-masonry-knauf-mwi2a-mapping-tolerance-v1-next-slice-selection-contract.test.ts",
  workbenchInputBehaviorChange: false
} as const;

const REQUIRED_SURFACES = [
  "packages/engine/src/lined-masonry-knauf-mwi2a-mapping-tolerance-gate-a-contract.test.ts",
  "packages/engine/src/post-timber-double-board-knauf-tb5a-mapping-tolerance-v1-next-slice-selection-contract.test.ts",
  "packages/engine/src/knauf-wall-systems-source-pack-extraction-gate-a-contract.test.ts",
  "packages/engine/src/knauf-wall-systems-source-pack-extraction-gate-b-contract.test.ts",
  "packages/engine/src/wall-lined-massive-heavy-core-source-research-gate-a-contract.test.ts",
  "docs/calculator/SLICE_LINED_MASONRY_KNAUF_MWI2A_MAPPING_TOLERANCE_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-04-30_LINED_MASONRY_KNAUF_MWI2A_MAPPING_TOLERANCE_GATE_A_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-04-30_TIMBER_DOUBLE_BOARD_KNAUF_TB5A_MAPPING_TOLERANCE_GATE_C_CLOSEOUT_HANDOFF.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "AGENTS.md"
] as const;

const KNAUF_MWI2A_SOURCE_ROW = {
  acousticRatingsBasis: "RT&A TE405-20S09(R4)",
  boardSide1: "1x13 mm SHEETROCK ONE adhesive fixed",
  boardSide2: "1x13 mm SHEETROCK ONE on 28 mm furring channels",
  furring: {
    channel: "28 mm furring channels @ 600 mm centres",
    clips: "direct fix clips or BETAGRIP clips for 50 mm furring cavities",
    side1CavityMm: null,
    side2CavityOptionsMm: [30, 50]
  },
  metricContext: "lab_rw_plus_rw_ctr",
  pageOrTable: "F Masonry Upgrades, acoustic upgrades internal walls, MWI.2 / MWI.2A",
  retrievalDate: "2026-04-30",
  sourceLabel: "Knauf AU Systems+ Section F Masonry Upgrades",
  sourceUrl:
    "https://knauf.com/api/download-center/v1/assets/16b8f406-a9be-47bd-9e7a-7212d6f19a28?country=AU&download=true&locale=en-AU",
  substrateRows: [
    {
      insulationRatings: [
        { insulation: "Nil", rw: 54, rwCtr: 45 },
        { insulation: "KI 25G24", rw: 58, rwCtr: 48 }
      ],
      masonryType: "150 mm Concrete Panel",
      nominalWallWidthMm: 208,
      side2CavityMm: 30,
      surfaceMassKgM2: 360
    },
    {
      insulationRatings: [
        { insulation: "Nil", rw: 57, rwCtr: 47 },
        { insulation: "KI 25G24", rw: 61, rwCtr: 50 }
      ],
      masonryType: "200 mm Concrete Panel",
      nominalWallWidthMm: 258,
      side2CavityMm: 30,
      surfaceMassKgM2: 480
    },
    {
      insulationRatings: [
        { insulation: "Nil", rw: 52, rwCtr: 44 },
        { insulation: "KI 25G24", rw: 55, rwCtr: 47 }
      ],
      masonryType: "140 mm Concrete Block Core Filled",
      nominalWallWidthMm: 198,
      side2CavityMm: 30,
      surfaceMassKgM2: 295
    },
    {
      insulationRatings: [
        { insulation: "Nil", rw: 55, rwCtr: 46 },
        { insulation: "KI 25G24", rw: 58, rwCtr: 49 }
      ],
      masonryType: "190 mm Concrete Block Core Filled",
      nominalWallWidthMm: 248,
      side2CavityMm: 30,
      surfaceMassKgM2: 400
    },
    {
      insulationRatings: [{ insulation: "KI 50G11", rw: 60, rwCtr: 51 }],
      masonryType: "190 mm Concrete Block Core Filled",
      nominalWallWidthMm: 268,
      side2CavityMm: 50,
      surfaceMassKgM2: 400
    },
    {
      insulationRatings: [
        { insulation: "Nil", rw: 54, rwCtr: 45 },
        { insulation: "KI 25G24", rw: 55, rwCtr: 46 }
      ],
      masonryType: "190 mm Lightweight Block Core Filled QLD Market",
      nominalWallWidthMm: 248,
      side2CavityMm: 30,
      surfaceMassKgM2: 360
    },
    {
      insulationRatings: [{ insulation: "KI 50G11", rw: 57, rwCtr: 48 }],
      masonryType: "190 mm Lightweight Block Core Filled QLD Market",
      nominalWallWidthMm: 268,
      side2CavityMm: 50,
      surfaceMassKgM2: 360
    }
  ],
  systemCode: "MWI.2A"
} as const;

const LIVE_ROUTE_TO_MWI2A_TOPOLOGY_DELTA = {
  boardCountAndSides: "blocked_source_sheetrock_one_each_side_vs_live_single_generic_gypsum_board_layer",
  boardMaterial: "blocked_source_sheetrock_one_vs_live_generic_gypsum_board",
  boardThickness: "blocked_source_13_mm_vs_live_12p5_mm",
  cavityAndCoupling:
    "blocked_source_side2_furring_direct_fix_or_betagrip_cavity_vs_live_unsided_50_mm_air_gap",
  exactSubstrateDecision:
    "not_selectable_because_live_route_uses_100_mm_generic_concrete_without_panel_or_core_filled_block_mass",
  insulation: "blocked_source_glasswool_ki25g24_or_ki50g11_vs_live_50_mm_rockwool",
  metricFit: "source_lab_rw_context_only_not_field_output_owner",
  topologyMatchForRuntime: false
} as const;

const MATERIAL_MAPPING_DECISIONS: readonly MappingDecision[] = [
  {
    decision: "mapped_context_only",
    localMaterialId: "gypsum_board",
    reason:
      "SHEETROCK_ONE_is_a_proprietary_13_mm_board_while_the_live_route_uses_one_generic_12p5_mm_gypsum_board_layer_without_side_metadata",
    sourceMaterial: "SHEETROCK ONE"
  },
  {
    decision: "blocked_not_exact",
    localMaterialId: "concrete",
    reason:
      "MWI2A_names_concrete_panel_or_core_filled_block_surface_mass_variants_while_the_live_route_uses_100_mm_generic_concrete",
    sourceMaterial: "concrete panel / core-filled concrete block substrate"
  },
  {
    decision: "blocked_not_exact",
    localMaterialId: "air_gap",
    reason:
      "MWI2A_names_side2_furring_channels_and_clip_coupling_while_the_live_route_has_an_unsided_generic_50_mm_air_gap",
    sourceMaterial: "28 mm furring channel cavity"
  },
  {
    decision: "blocked_not_exact",
    localMaterialId: "rockwool",
    reason:
      "KI_25G24_and_KI_50G11_are_glasswool_products_with_density_and_cavity_policy_not_the_live_50_mm_rockwool_layer",
    sourceMaterial: "KI 25G24 / KI 50G11"
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
    boundary: "MWI.1A_adhesive_both_sides_no_furring",
    reason:
      "mwi1a_is_direct_adhesive_lining_without_furring_cavity_and_must_not_promote_mwi2a_or_live_lined_heavy_truth"
  },
  {
    boundary: "MWI.2I_impactstop_adjacent_row",
    reason:
      "impactstop_rows_have_different_board_material_and_rating_context_and_cannot_promote_sheetrock_one_mapping"
  },
  {
    boundary: "AAC.1A_discontinuous_aac_panel",
    reason:
      "aac_panel_density_gap_and_steel_frame_topology_are_adjacent_context_not_generic_masonry_or_heavy_core_truth"
  },
  {
    boundary: "floor_or_ceiling_lining_rows",
    reason:
      "floor_and_ceiling_system_rows_do_not_supply_wall_lined_masonry_substrate_coupling_or_field_output_policy"
  },
  {
    boundary: "generic_wall_screening_concrete",
    reason:
      "the_live_screening_concrete_route_stays_formula_owned_until_exact_substrate_cavity_and_tolerance_are_named"
  },
  {
    boundary: "timber_clt_no_stud_and_generated_floor_context",
    reason:
      "unrelated_wall_or_floor_context_must_not_promote_mwi2a_or_the_live_lined_masonry_screening_route"
  }
] as const;

const MWI2A_GATE_A_DECISION = {
  exactSubstrateVariantSelected: false,
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

describe("lined masonry Knauf MWI.2A mapping / tolerance Gate A contract", () => {
  it("lands Gate A as no-runtime mapping / tolerance work", () => {
    expect(LINED_MASONRY_KNAUF_MWI2A_GATE_A).toEqual({
      apiShapeChange: false,
      confidencePromotion: false,
      evidencePromotion: false,
      landedGate: "gate_a_map_knauf_mwi2a_lined_masonry_topology_materials_tolerance_without_runtime_import",
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
      sliceId: "lined_masonry_knauf_mwi2a_mapping_tolerance_v1",
      sourceReadyRuntimeCandidate: false,
      supportPromotion: false,
      targetNextFile:
        "packages/engine/src/post-lined-masonry-knauf-mwi2a-mapping-tolerance-v1-next-slice-selection-contract.test.ts",
      workbenchInputBehaviorChange: false
    });

    for (const path of REQUIRED_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("pins the MWI.2A source rows as lab Rw context, not import approval", () => {
    expect(KNAUF_MWI2A_SOURCE_ROW).toMatchObject({
      acousticRatingsBasis: "RT&A TE405-20S09(R4)",
      boardSide1: "1x13 mm SHEETROCK ONE adhesive fixed",
      boardSide2: "1x13 mm SHEETROCK ONE on 28 mm furring channels",
      metricContext: "lab_rw_plus_rw_ctr",
      sourceLabel: "Knauf AU Systems+ Section F Masonry Upgrades",
      systemCode: "MWI.2A"
    });
    expect(KNAUF_MWI2A_SOURCE_ROW.substrateRows).toHaveLength(7);
    expect(KNAUF_MWI2A_SOURCE_ROW.substrateRows.map((row) => row.masonryType)).toEqual([
      "150 mm Concrete Panel",
      "200 mm Concrete Panel",
      "140 mm Concrete Block Core Filled",
      "190 mm Concrete Block Core Filled",
      "190 mm Concrete Block Core Filled",
      "190 mm Lightweight Block Core Filled QLD Market",
      "190 mm Lightweight Block Core Filled QLD Market"
    ]);
    expect(KNAUF_MWI2A_SOURCE_ROW.substrateRows.flatMap((row) => row.insulationRatings.map((rating) => rating.rw)))
      .toEqual([54, 58, 57, 61, 52, 55, 55, 58, 60, 54, 55, 57]);
    expect(KNAUF_MWI2A_SOURCE_ROW.substrateRows.flatMap((row) => row.insulationRatings.map((rating) => rating.rwCtr)))
      .toEqual([45, 48, 47, 50, 44, 47, 46, 49, 51, 45, 46, 48]);
  });

  it("pins the live lined-heavy route and proves MWI.2A is not an exact topology match", () => {
    const testCase = generatedCase("wall-screening-concrete");
    const lab = calculateAssembly(testCase.rows, testCase.labOptions);
    const field = calculateAssembly(testCase.rows, testCase.fieldOptions);
    const fieldContext = context(testCase.fieldOptions, testCase.id);

    expect(layerSignature(testCase.rows)).toEqual([
      "gypsum_board:12.5",
      "rockwool:50",
      "air_gap:50",
      "concrete:100"
    ]);
    expect(fieldContext).toMatchObject({
      contextMode: "building_prediction",
      panelHeightMm: 2800,
      panelWidthMm: 3600,
      receivingRoomRt60S: 0.6,
      receivingRoomVolumeM3: 45
    });
    expect(findVerifiedAirborneAssemblyMatch(lab.layers, testCase.labOptions?.airborneContext)).toBeNull();
    expect(findVerifiedAirborneAssemblyMatch(field.layers, testCase.fieldOptions?.airborneContext)).toBeNull();
    expect(findVerifiedAirborneAssemblyMatchWithLabFallback(field.layers, testCase.fieldOptions?.airborneContext))
      .toBeNull();
    expect(resultSnapshot(lab)).toMatchObject({
      c: -1.6,
      ctr: -6.5,
      dynamicFamily: "lined_massive_wall",
      rw: 57,
      rwDb: 57,
      stc: 57
    });
    expect(resultSnapshot(field)).toMatchObject({
      c: -1.6,
      ctr: -6.3,
      dnTA: 54.9,
      dnTw: 56,
      dnW: 55,
      dynamicFamily: "lined_massive_wall",
      rw: 55,
      rwPrimeDb: 55,
      stc: 55
    });
    expect(resultSnapshot(lab).supportedTargetOutputs).toEqual([...LAB_OUTPUTS]);
    expect(resultSnapshot(field).supportedTargetOutputs).toEqual([...FIELD_OUTPUTS]);
    expect(LIVE_ROUTE_TO_MWI2A_TOPOLOGY_DELTA).toEqual({
      boardCountAndSides: "blocked_source_sheetrock_one_each_side_vs_live_single_generic_gypsum_board_layer",
      boardMaterial: "blocked_source_sheetrock_one_vs_live_generic_gypsum_board",
      boardThickness: "blocked_source_13_mm_vs_live_12p5_mm",
      cavityAndCoupling:
        "blocked_source_side2_furring_direct_fix_or_betagrip_cavity_vs_live_unsided_50_mm_air_gap",
      exactSubstrateDecision:
        "not_selectable_because_live_route_uses_100_mm_generic_concrete_without_panel_or_core_filled_block_mass",
      insulation: "blocked_source_glasswool_ki25g24_or_ki50g11_vs_live_50_mm_rockwool",
      metricFit: "source_lab_rw_context_only_not_field_output_owner",
      topologyMatchForRuntime: false
    });
  });

  it("keeps material, metric, and tolerance decisions blocked before runtime movement", () => {
    expect(MATERIAL_MAPPING_DECISIONS).toEqual([
      {
        decision: "mapped_context_only",
        localMaterialId: "gypsum_board",
        reason:
          "SHEETROCK_ONE_is_a_proprietary_13_mm_board_while_the_live_route_uses_one_generic_12p5_mm_gypsum_board_layer_without_side_metadata",
        sourceMaterial: "SHEETROCK ONE"
      },
      {
        decision: "blocked_not_exact",
        localMaterialId: "concrete",
        reason:
          "MWI2A_names_concrete_panel_or_core_filled_block_surface_mass_variants_while_the_live_route_uses_100_mm_generic_concrete",
        sourceMaterial: "concrete panel / core-filled concrete block substrate"
      },
      {
        decision: "blocked_not_exact",
        localMaterialId: "air_gap",
        reason:
          "MWI2A_names_side2_furring_channels_and_clip_coupling_while_the_live_route_has_an_unsided_generic_50_mm_air_gap",
        sourceMaterial: "28 mm furring channel cavity"
      },
      {
        decision: "blocked_not_exact",
        localMaterialId: "rockwool",
        reason:
          "KI_25G24_and_KI_50G11_are_glasswool_products_with_density_and_cavity_policy_not_the_live_50_mm_rockwool_layer",
        sourceMaterial: "KI 25G24 / KI 50G11"
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
    expect(MWI2A_GATE_A_DECISION).toEqual({
      exactSubstrateVariantSelected: false,
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

  it("protects adjacent and negative boundaries around MWI.2A", () => {
    expect(PROTECTED_NEGATIVE_BOUNDARIES.map((boundary) => boundary.boundary)).toEqual([
      "MWI.1A_adhesive_both_sides_no_furring",
      "MWI.2I_impactstop_adjacent_row",
      "AAC.1A_discontinuous_aac_panel",
      "floor_or_ceiling_lining_rows",
      "generic_wall_screening_concrete",
      "timber_clt_no_stud_and_generated_floor_context"
    ]);
    expect(PROTECTED_NEGATIVE_BOUNDARIES.every((boundary) => boundary.reason.length > 70)).toBe(true);
  });

  it("keeps docs aligned on Gate C closeout as the next action", () => {
    const docs = [
      readRepoFile("AGENTS.md"),
      readRepoFile("docs/calculator/NEXT_IMPLEMENTATION_PLAN.md"),
      readRepoFile("docs/calculator/CURRENT_STATE.md"),
      readRepoFile("docs/calculator/SLICE_LINED_MASONRY_KNAUF_MWI2A_MAPPING_TOLERANCE_PLAN.md"),
      readRepoFile("docs/calculator/CHECKPOINT_2026-04-30_LINED_MASONRY_KNAUF_MWI2A_MAPPING_TOLERANCE_GATE_A_HANDOFF.md")
    ];

    for (const doc of docs) {
      expect(doc).toContain(LINED_MASONRY_KNAUF_MWI2A_GATE_A.sliceId);
      expect(doc).toContain(LINED_MASONRY_KNAUF_MWI2A_GATE_A.targetNextFile);
      expect(doc).toContain(LINED_MASONRY_KNAUF_MWI2A_GATE_A.selectedNextAction);
      expect(doc).toContain("MWI.2A");
    }
  });

  it("keeps frozen surfaces and validation expectations explicit", () => {
    const joinedDocs = [
      readRepoFile("docs/calculator/SLICE_LINED_MASONRY_KNAUF_MWI2A_MAPPING_TOLERANCE_PLAN.md"),
      readRepoFile("docs/calculator/CHECKPOINT_2026-04-30_LINED_MASONRY_KNAUF_MWI2A_MAPPING_TOLERANCE_GATE_A_HANDOFF.md")
    ].join("\n");

    for (const surface of FROZEN_SURFACES) {
      expect(joinedDocs, surface).toContain(surface);
    }

    expect(joinedDocs).toContain("pnpm --filter @dynecho/engine exec vitest run src/lined-masonry-knauf-mwi2a-mapping-tolerance-gate-a-contract.test.ts --maxWorkers=1");
    expect(joinedDocs).toContain("pnpm calculator:gate:current");
    expect(joinedDocs).toContain("git diff --check");
  });
});
