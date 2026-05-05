import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { FLAT_LIST_MULTILEAF_GUARD_STRATEGY } from "./dynamic-airborne-flat-list-multileaf-guard";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

type WallRouteSnapshot = {
  confidence: string | null;
  dnTw: number | null | undefined;
  family: string | null;
  rw: number | null | undefined;
  rwPrime: number | null | undefined;
  stc: number | null | undefined;
  strategy: string | null;
  warnings: readonly string[];
};

const ROUTE_FAMILY_LANE_DRIFT_COMMON_STACK_WATCHLIST_GATE_E = {
  apiShapeChange: false,
  confidencePromotion: false,
  evidencePromotion: false,
  landedGate: "gate_e_implement_flat_list_multileaf_family_guard_with_engine_web_negative_boundaries",
  numericRuntimeBehaviorChange: true,
  outputCardStatusChange: false,
  outputSupportChange: false,
  proposalReportCopyChange: false,
  routeCardValueChange: true,
  runtimeImportSelectedNow: false,
  selectedNextAction: "gate_f_closeout_and_next_slice_selection_after_flat_list_guard_runtime_landing",
  selectedNextFile:
    "packages/engine/src/post-route-family-lane-drift-common-stack-watchlist-v1-next-slice-selection-contract.test.ts",
  selectedNextStatus:
    "common_stack_lane_drift_flat_list_guard_runtime_landed_selected_gate_f_closeout_next_slice",
  selectedPlanningSurface: "docs/calculator/SLICE_ROUTE_FAMILY_LANE_DRIFT_COMMON_STACK_WATCHLIST_PLAN.md",
  sliceId: "route_family_lane_drift_common_stack_watchlist_v1",
  supportPromotion: false,
  thisGateFile:
    "packages/engine/src/route-family-lane-drift-common-stack-watchlist-gate-e-flat-list-family-guard-implementation.test.ts",
  workbenchInputBehaviorChange: false
} as const;

const REQUIRED_PLANNING_SURFACES = [
  "packages/engine/src/route-family-lane-drift-common-stack-watchlist-gate-d-flat-list-family-guard-design.test.ts",
  "packages/engine/src/route-family-lane-drift-common-stack-watchlist-gate-e-flat-list-family-guard-implementation.test.ts",
  "apps/web/features/workbench/wall-flat-list-multileaf-family-guard-route-card.test.ts",
  "docs/calculator/SLICE_ROUTE_FAMILY_LANE_DRIFT_COMMON_STACK_WATCHLIST_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-03_ROUTE_FAMILY_LANE_DRIFT_COMMON_STACK_WATCHLIST_GATE_D_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-05-03_ROUTE_FAMILY_LANE_DRIFT_COMMON_STACK_WATCHLIST_GATE_E_HANDOFF.md",
  "docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md",
  "docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md",
  "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "AGENTS.md"
] as const;

const WALL_LAB_CONTEXT: AirborneContext = {
  contextMode: "element_lab",
  airtightness: "good"
};

const WALL_FIELD_CONTEXT: AirborneContext = {
  contextMode: "building_prediction",
  panelHeightMm: 2800,
  panelWidthMm: 3600,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 45
};

const SIMPLE_STUD_CONTEXT: AirborneContext = {
  ...WALL_LAB_CONTEXT,
  connectionType: "line_connection",
  sharedTrack: "independent",
  studSpacingMm: 600,
  studType: "light_steel_stud"
};

const COMPLETE_TRIPLE_LEAF_CONTEXT: AirborneContext = {
  ...WALL_LAB_CONTEXT,
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

const WALL_LAB_OUTPUTS: readonly RequestedOutputId[] = ["Rw", "STC", "C", "Ctr"];
const WALL_FIELD_OUTPUTS: readonly RequestedOutputId[] = ["R'w", "DnT,w"];
const FLOOR_LAB_OUTPUTS: readonly RequestedOutputId[] = ["Rw", "Ln,w", "Ln,w+CI"];

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

const ADJACENT_ROCKWOOL_STACK: readonly LayerInput[] = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "mlv", thicknessMm: 4 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 50 },
  { materialId: "rockwool", thicknessMm: 50 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "gypsum_plaster", thicknessMm: 10 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
];

const CLASSIC_TRIPLE_LEAF_STACK: readonly LayerInput[] = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 50 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "air_gap", thicknessMm: 50 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
];

const HEAVY_MULTILEAF_STACK: readonly LayerInput[] = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 25 },
  { materialId: "ytong_aac_d700", thicknessMm: 100 },
  { materialId: "air_gap", thicknessMm: 50 },
  { materialId: "diamond_board", thicknessMm: 12.5 }
];

const ORDINARY_DOUBLE_LEAF_STACK: readonly LayerInput[] = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 50 },
  { materialId: "air_gap", thicknessMm: 50 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
];

const SIMPLE_STUD_STACK: readonly LayerInput[] = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 50 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
];

const GYPSUM_ALIAS_MIXED_STACK: readonly LayerInput[] = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "gypsum", thicknessMm: 12.5 },
  { materialId: "firestop_board", thicknessMm: 15 }
];

const RAW_FLOOR_STACK: readonly LayerInput[] = [
  { materialId: "clt_panel", thicknessMm: 140 },
  { materialId: "mw_t_40_impact_layer", thicknessMm: 30 },
  { materialId: "elastic_bonded_fill", thicknessMm: 60 },
  { materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 25 }
];

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function swap(stack: readonly LayerInput[], a: number, b: number): readonly LayerInput[] {
  const swapped = [...stack];
  [swapped[a], swapped[b]] = [swapped[b]!, swapped[a]!];
  return swapped;
}

function wallSnapshot(layers: readonly LayerInput[], context: AirborneContext = WALL_LAB_CONTEXT): WallRouteSnapshot {
  const lab = calculateAssembly(layers, {
    airborneContext: context,
    calculator: "dynamic",
    targetOutputs: WALL_LAB_OUTPUTS
  });
  const field = calculateAssembly(layers, {
    airborneContext: WALL_FIELD_CONTEXT,
    calculator: "dynamic",
    targetOutputs: WALL_FIELD_OUTPUTS
  });

  return {
    confidence: lab.dynamicAirborneTrace?.confidenceClass ?? null,
    dnTw: field.metrics.estimatedDnTwDb,
    family: lab.dynamicAirborneTrace?.detectedFamily ?? null,
    rw: lab.metrics.estimatedRwDb,
    rwPrime: field.metrics.estimatedRwPrimeDb,
    stc: lab.metrics.estimatedStc,
    strategy: lab.dynamicAirborneTrace?.strategy ?? null,
    warnings: lab.warnings
  };
}

describe("route-family lane-drift common-stack watchlist Gate E flat-list family guard implementation", () => {
  it("lands Gate E as bounded runtime guard movement and selects closeout", () => {
    expect(ROUTE_FAMILY_LANE_DRIFT_COMMON_STACK_WATCHLIST_GATE_E).toEqual({
      apiShapeChange: false,
      confidencePromotion: false,
      evidencePromotion: false,
      landedGate: "gate_e_implement_flat_list_multileaf_family_guard_with_engine_web_negative_boundaries",
      numericRuntimeBehaviorChange: true,
      outputCardStatusChange: false,
      outputSupportChange: false,
      proposalReportCopyChange: false,
      routeCardValueChange: true,
      runtimeImportSelectedNow: false,
      selectedNextAction: "gate_f_closeout_and_next_slice_selection_after_flat_list_guard_runtime_landing",
      selectedNextFile:
        "packages/engine/src/post-route-family-lane-drift-common-stack-watchlist-v1-next-slice-selection-contract.test.ts",
      selectedNextStatus:
        "common_stack_lane_drift_flat_list_guard_runtime_landed_selected_gate_f_closeout_next_slice",
      selectedPlanningSurface: "docs/calculator/SLICE_ROUTE_FAMILY_LANE_DRIFT_COMMON_STACK_WATCHLIST_PLAN.md",
      sliceId: "route_family_lane_drift_common_stack_watchlist_v1",
      supportPromotion: false,
      thisGateFile:
        "packages/engine/src/route-family-lane-drift-common-stack-watchlist-gate-e-flat-list-family-guard-implementation.test.ts",
      workbenchInputBehaviorChange: false
    });

    for (const path of REQUIRED_PLANNING_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("keeps split-rockwool and adjacent PDF-like flat-list swaps on the double-leaf numeric lane", () => {
    const splitBase = wallSnapshot(SPLIT_ROCKWOOL_STACK);
    const splitSwapped = wallSnapshot(swap(SPLIT_ROCKWOOL_STACK, 3, 4));
    const adjacentPdf = wallSnapshot(ADJACENT_ROCKWOOL_STACK);

    expect(splitBase).toMatchObject({
      confidence: "low",
      family: "multileaf_multicavity",
      rw: 41,
      rwPrime: 39,
      strategy: "multileaf_screening_blend"
    });
    expect(splitSwapped).toMatchObject({
      confidence: "medium",
      dnTw: 51,
      family: "double_leaf",
      rw: 51,
      rwPrime: 49,
      stc: 51,
      strategy: FLAT_LIST_MULTILEAF_GUARD_STRATEGY
    });
    expect(adjacentPdf).toMatchObject({
      confidence: "medium",
      dnTw: 49,
      family: "double_leaf",
      rw: 50,
      rwPrime: 48,
      stc: 50,
      strategy: FLAT_LIST_MULTILEAF_GUARD_STRATEGY
    });
    expect(splitSwapped.warnings.some((warning) => /Flat-list adjacent-swap sensitivity guard/i.test(warning))).toBe(true);
    expect(adjacentPdf.warnings.some((warning) => /kept the current double-leaf numeric lane/i.test(warning))).toBe(true);
    expect((splitSwapped.rw ?? 0) - (splitBase.rw ?? 0)).toBeGreaterThanOrEqual(9);
  });

  it("keeps ordinary classic flat-list swaps numeric-stable without flattening the base multileaf result", () => {
    const classicBase = wallSnapshot(CLASSIC_TRIPLE_LEAF_STACK);
    const classicSwapped = wallSnapshot(swap(CLASSIC_TRIPLE_LEAF_STACK, 1, 2));

    expect(classicBase).toMatchObject({
      confidence: "low",
      family: "multileaf_multicavity",
      rw: 32,
      rwPrime: 30,
      strategy: "multileaf_screening_blend"
    });
    expect(classicSwapped).toMatchObject({
      confidence: "medium",
      dnTw: 44,
      family: "double_leaf",
      rw: 44,
      rwPrime: 42,
      strategy: FLAT_LIST_MULTILEAF_GUARD_STRATEGY
    });
    expect((classicSwapped.rw ?? 0) - (classicBase.rw ?? 0)).toBeGreaterThanOrEqual(11);
  });

  it("keeps ordinary double-leaf, stud, masonry, grouped, duplicate, floor, and alias boundaries out of the guard", () => {
    const ordinaryDoubleLeaf = wallSnapshot(ORDINARY_DOUBLE_LEAF_STACK);
    const simpleStud = wallSnapshot(SIMPLE_STUD_STACK, SIMPLE_STUD_CONTEXT);
    const heavyBoundary = wallSnapshot(HEAVY_MULTILEAF_STACK);
    const groupedTripleLeaf = wallSnapshot(SPLIT_ROCKWOOL_STACK, COMPLETE_TRIPLE_LEAF_CONTEXT);
    const duplicateClassic = wallSnapshot([...CLASSIC_TRIPLE_LEAF_STACK, ...CLASSIC_TRIPLE_LEAF_STACK]);
    const aliasOnly = wallSnapshot(GYPSUM_ALIAS_MIXED_STACK);
    const floor = calculateAssembly(RAW_FLOOR_STACK, { targetOutputs: FLOOR_LAB_OUTPUTS });

    expect(ordinaryDoubleLeaf).toMatchObject({
      confidence: "medium",
      family: "double_leaf",
      rw: 41,
      strategy: "double_leaf_porous_fill_delegate"
    });
    expect(simpleStud).toMatchObject({
      confidence: "low",
      family: "stud_wall_system",
      rw: 43,
      strategy: "stud_surrogate_blend+framed_wall_calibration"
    });
    expect(heavyBoundary).toMatchObject({
      confidence: "low",
      family: "multileaf_multicavity",
      rw: 39,
      strategy: "multileaf_screening_blend"
    });
    expect(groupedTripleLeaf).toMatchObject({
      confidence: "low",
      family: "multileaf_multicavity",
      rw: 41,
      strategy: "multileaf_screening_blend"
    });
    expect(duplicateClassic).toMatchObject({
      confidence: "low",
      family: "multileaf_multicavity",
      rw: 37,
      strategy: "multileaf_screening_blend"
    });
    expect(aliasOnly).toMatchObject({
      confidence: "medium",
      family: "laminated_single_leaf",
      rw: 37,
      strategy: "laminated_leaf_sharp_delegate"
    });
    expect(floor.floorSystemMatch?.system.id).toBe("dataholz_gdmtxn01_dry_clt_lab_2026");
    expect(floor.floorSystemRatings?.Rw).toBe(62);
    expect(floor.impact?.LnW).toBe(50);
  });

  it("keeps active docs aligned on Gate E landing and fail-closed scope", () => {
    const docs = [
      readRepoFile("AGENTS.md"),
      readRepoFile("docs/calculator/NEXT_IMPLEMENTATION_PLAN.md"),
      readRepoFile("docs/calculator/CURRENT_STATE.md"),
      readRepoFile("docs/calculator/SLICE_ROUTE_FAMILY_LANE_DRIFT_COMMON_STACK_WATCHLIST_PLAN.md"),
      readRepoFile("docs/calculator/CHECKPOINT_2026-05-03_ROUTE_FAMILY_LANE_DRIFT_COMMON_STACK_WATCHLIST_GATE_E_HANDOFF.md"),
      readRepoFile("docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md"),
      readRepoFile("docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md"),
      readRepoFile("docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md")
    ];

    for (const doc of docs) {
      expect(doc).toContain(ROUTE_FAMILY_LANE_DRIFT_COMMON_STACK_WATCHLIST_GATE_E.sliceId);
      expect(doc).toContain(ROUTE_FAMILY_LANE_DRIFT_COMMON_STACK_WATCHLIST_GATE_E.thisGateFile);
      expect(doc).toContain(ROUTE_FAMILY_LANE_DRIFT_COMMON_STACK_WATCHLIST_GATE_E.selectedNextFile);
      expect(doc).toContain(ROUTE_FAMILY_LANE_DRIFT_COMMON_STACK_WATCHLIST_GATE_E.selectedNextAction);
      expect(doc).toContain(ROUTE_FAMILY_LANE_DRIFT_COMMON_STACK_WATCHLIST_GATE_E.selectedNextStatus);
      expect(
        doc.includes(FLAT_LIST_MULTILEAF_GUARD_STRATEGY) ||
        doc.includes("multileaf_screening_blend_fail_closed_until_grouped_topology")
      ).toBe(true);
      expect(doc).toContain("engine_split_rockwool_swapped_flat_list_holds_multileaf_fail_closed");
      expect(doc).toContain("engine_classic_swapped_flat_list_holds_multileaf_fail_closed");
      expect(doc).toContain("web_route_card_shows_fail_closed_multileaf_screening_not_exact");
      expect(doc).toContain("web_output_card_does_not_promote_rw_prime_or_dntw_as_exact");
      expect(doc).toContain("ordinary_double_leaf_negative_boundary");
      expect(doc).toContain("lined_massive_boundary_hold_negative_boundary");
      expect(doc).toContain("paused_waiting_rights_safe_source_packet");
      expect(doc).toContain("standing_lane_misclassification_monitoring_mandate");
      expect(doc).toContain("note_test_document_or_easy_fix");
    }
  });

  it("keeps validation expectations explicit", () => {
    const joinedDocs = [
      readRepoFile("docs/calculator/CHECKPOINT_2026-05-03_ROUTE_FAMILY_LANE_DRIFT_COMMON_STACK_WATCHLIST_GATE_E_HANDOFF.md"),
      readRepoFile("docs/calculator/SLICE_ROUTE_FAMILY_LANE_DRIFT_COMMON_STACK_WATCHLIST_PLAN.md"),
      readRepoFile("docs/calculator/NEXT_IMPLEMENTATION_PLAN.md")
    ].join("\n");

    expect(joinedDocs).toContain(
      "pnpm --filter @dynecho/engine exec vitest run src/route-family-lane-drift-common-stack-watchlist-gate-e-flat-list-family-guard-implementation.test.ts --maxWorkers=1"
    );
    expect(joinedDocs).toContain(
      "pnpm --filter @dynecho/web exec vitest run features/workbench/wall-flat-list-multileaf-family-guard-route-card.test.ts --maxWorkers=1"
    );
    expect(joinedDocs).toContain("pnpm calculator:gate:current");
    expect(joinedDocs).toContain("git diff --check");
  });
});
