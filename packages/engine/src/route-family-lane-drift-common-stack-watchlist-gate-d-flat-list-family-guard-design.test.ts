import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput, RequestedOutputId, ResolvedLayer } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { buildCalibratedMassLawCurve } from "./curve-rating";
import { calculateDynamicAirborneResult } from "./dynamic-airborne";
import { estimateRwDb } from "./estimate-rw";
import { getDefaultMaterialCatalog, resolveMaterial } from "./material-catalog";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

type FlatListGuardAssessment = {
  adjacentProbeCount: number;
  current: WallRouteSnapshot;
  guardCandidate: boolean;
  maxAdjacentRwDeltaDb: number;
  rejectionReasons: readonly string[];
};

type WallRouteSnapshot = {
  confidence: string | null;
  family: string | null;
  rw: number | null;
  strategy: string | null;
};

const ROUTE_FAMILY_LANE_DRIFT_COMMON_STACK_WATCHLIST_GATE_D = {
  apiShapeChange: false,
  confidencePromotion: false,
  evidencePromotion: false,
  landedGate: "gate_d_design_flat_list_multileaf_family_guard_with_negative_boundaries_no_runtime",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: false,
  outputSupportChange: false,
  proposalReportCopyChange: false,
  routeCardValueChange: false,
  runtimeImportSelectedNow: false,
  selectedNextAction: "gate_e_implement_flat_list_multileaf_family_guard_with_engine_web_negative_boundaries",
  selectedNextFile:
    "packages/engine/src/route-family-lane-drift-common-stack-watchlist-gate-e-flat-list-family-guard-implementation.test.ts",
  selectedNextStatus:
    "common_stack_lane_drift_flat_list_guard_design_landed_no_runtime_selected_gate_e_implementation",
  selectedPlanningSurface: "docs/calculator/SLICE_ROUTE_FAMILY_LANE_DRIFT_COMMON_STACK_WATCHLIST_PLAN.md",
  sliceId: "route_family_lane_drift_common_stack_watchlist_v1",
  supportPromotion: false,
  thisGateFile:
    "packages/engine/src/route-family-lane-drift-common-stack-watchlist-gate-d-flat-list-family-guard-design.test.ts",
  workbenchInputBehaviorChange: false
} as const;

const REQUIRED_PLANNING_SURFACES = [
  "packages/engine/src/route-family-lane-drift-common-stack-watchlist-gate-a-contract.test.ts",
  "packages/engine/src/route-family-lane-drift-common-stack-watchlist-gate-b-reprobes.test.ts",
  "packages/engine/src/route-family-lane-drift-common-stack-watchlist-gate-c-classification.test.ts",
  "packages/engine/src/route-family-lane-drift-common-stack-watchlist-gate-d-flat-list-family-guard-design.test.ts",
  "docs/calculator/SLICE_ROUTE_FAMILY_LANE_DRIFT_COMMON_STACK_WATCHLIST_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-03_ROUTE_FAMILY_LANE_DRIFT_COMMON_STACK_WATCHLIST_GATE_C_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-05-03_ROUTE_FAMILY_LANE_DRIFT_COMMON_STACK_WATCHLIST_GATE_D_HANDOFF.md",
  "docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md",
  "docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md",
  "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "AGENTS.md"
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

const FLAT_LIST_MULTILEAF_GUARD_DESIGN = {
  ambiguityProbe: "flat_list_adjacent_swap_sensitivity_probe",
  currentRuntimeBehaviorChange: false,
  futureTargetStrategy: "multileaf_screening_blend_fail_closed_until_grouped_topology",
  guardCandidateThresholdDb: 8,
  maximumProbeLayerCount: 9,
  protectedBoundaries: [
    "ordinary_double_leaf_negative_boundary",
    "simple_stud_negative_boundary",
    "lined_massive_boundary_hold_negative_boundary",
    "grouped_triple_leaf_topology_negative_boundary",
    "duplicate_many_layer_finite_output_negative_boundary",
    "known_floor_exact_row_negative_boundary",
    "near_source_alias_no_promotion_boundary",
    "field_output_visible_policy_boundary",
    "paired_engine_and_web_visible_tests_before_runtime"
  ],
  runtimeImportSelectedNow: false,
  sourcePromotionAllowedNow: false,
  valueRetuneAllowedNow: false
} as const;

const WALL_LAB_CONTEXT: AirborneContext = {
  contextMode: "element_lab",
  airtightness: "good"
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

function materialId(layer: LayerInput): string {
  return layer.materialId.toLowerCase();
}

function isBoardLike(layer: LayerInput): boolean {
  return /gypsum|board|plasterboard|firestop|soundbloc|diamond|silent/.test(materialId(layer));
}

function isCompliant(layer: LayerInput): boolean {
  return /rockwool|mineral|glass|wool|fiber|fibre|insulation|air_gap|air|gap|cavity/.test(materialId(layer));
}

function isHeavyMasonryLike(layer: LayerInput): boolean {
  return /aac|ytong|concrete|masonry|brick|block|pumice|bims|silicate/.test(materialId(layer));
}

function hasGroupedTripleLeafTopology(context: AirborneContext): boolean {
  return context.wallTopology?.topologyMode === "grouped_triple_leaf";
}

function hasExplicitFramingContext(context: AirborneContext): boolean {
  return (
    context.connectionType !== undefined ||
    context.studType !== undefined ||
    typeof context.studSpacingMm === "number" ||
    context.sharedTrack === "independent" ||
    context.sharedTrack === "shared"
  );
}

function resolveTestLayers(layers: readonly LayerInput[]): ResolvedLayer[] {
  const catalog = getDefaultMaterialCatalog();

  return layers.map((layer) => {
    const material = resolveMaterial(layer.materialId, catalog);

    return {
      ...layer,
      material,
      surfaceMassKgM2: (layer.thicknessMm / 1000) * material.densityKgM3
    };
  });
}

function wallSnapshot(layers: readonly LayerInput[], context: AirborneContext = WALL_LAB_CONTEXT): WallRouteSnapshot {
  const resolvedLayers = resolveTestLayers(layers);
  const screeningEstimatedRwDb = estimateRwDb(resolvedLayers);
  const screeningCurve = buildCalibratedMassLawCurve(
    resolvedLayers.reduce((sum, layer) => sum + layer.surfaceMassKgM2, 0),
    screeningEstimatedRwDb
  );
  const result = calculateDynamicAirborneResult(resolvedLayers, {
    airborneContext: context,
    disableFlatListMultileafFamilyGuard: true,
    frequenciesHz: screeningCurve.frequenciesHz,
    screeningEstimatedRwDb
  });

  return {
    confidence: result.trace.confidenceClass,
    family: result.trace.detectedFamily,
    rw: result.rw,
    strategy: result.trace.strategy
  };
}

function swap(stack: readonly LayerInput[], a: number, b: number): readonly LayerInput[] {
  const swapped = [...stack];
  [swapped[a], swapped[b]] = [swapped[b]!, swapped[a]!];
  return swapped;
}

function adjacentBoardCompliantSwaps(layers: readonly LayerInput[]): readonly (readonly LayerInput[])[] {
  const variants: LayerInput[][] = [];

  for (let index = 0; index < layers.length - 1; index += 1) {
    const current = layers[index]!;
    const next = layers[index + 1]!;
    if ((isBoardLike(current) && isCompliant(next)) || (isCompliant(current) && isBoardLike(next))) {
      variants.push([...swap(layers, index, index + 1)]);
    }
  }

  return variants;
}

function assessFlatListMultileafGuardCandidate(
  layers: readonly LayerInput[],
  options: { context?: AirborneContext; mode?: "floor" | "wall" } = {}
): FlatListGuardAssessment {
  const context = options.context ?? WALL_LAB_CONTEXT;
  const rejectionReasons: string[] = [];

  if (options.mode === "floor") {
    rejectionReasons.push("known_floor_exact_row_negative_boundary");
  }
  if (hasGroupedTripleLeafTopology(context)) {
    rejectionReasons.push("grouped_triple_leaf_topology_negative_boundary");
  }
  if (hasExplicitFramingContext(context)) {
    rejectionReasons.push("simple_stud_negative_boundary");
  }
  if (layers.length > FLAT_LIST_MULTILEAF_GUARD_DESIGN.maximumProbeLayerCount) {
    rejectionReasons.push("duplicate_many_layer_finite_output_negative_boundary");
  }
  if (layers.some(isHeavyMasonryLike)) {
    rejectionReasons.push("lined_massive_boundary_hold_negative_boundary");
  }
  if (layers.filter(isBoardLike).length < 3 || layers.filter(isCompliant).length < 1) {
    rejectionReasons.push("ordinary_double_leaf_negative_boundary");
  }

  const current = wallSnapshot(layers, context);
  const probeSnapshots = adjacentBoardCompliantSwaps(layers).map((variant) => wallSnapshot(variant, context));
  const candidateFamilies = new Set([current.family, ...probeSnapshots.map((snapshot) => snapshot.family)]);
  const maxAdjacentRwDeltaDb = Math.max(
    0,
    ...probeSnapshots.map((snapshot) =>
      current.rw !== null && snapshot.rw !== null ? Math.abs(snapshot.rw - current.rw) : 0
    )
  );
  const routeFlipBetweenDoubleAndMultileaf =
    candidateFamilies.has("double_leaf") && candidateFamilies.has("multileaf_multicavity");

  return {
    adjacentProbeCount: probeSnapshots.length,
    current,
    guardCandidate:
      rejectionReasons.length === 0 &&
      routeFlipBetweenDoubleAndMultileaf &&
      maxAdjacentRwDeltaDb >= FLAT_LIST_MULTILEAF_GUARD_DESIGN.guardCandidateThresholdDb,
    maxAdjacentRwDeltaDb,
    rejectionReasons
  };
}

describe("route-family lane-drift common-stack watchlist Gate D flat-list family guard design", () => {
  it("lands Gate D as a no-runtime guard design and selects Gate E implementation", () => {
    expect(ROUTE_FAMILY_LANE_DRIFT_COMMON_STACK_WATCHLIST_GATE_D).toEqual({
      apiShapeChange: false,
      confidencePromotion: false,
      evidencePromotion: false,
      landedGate: "gate_d_design_flat_list_multileaf_family_guard_with_negative_boundaries_no_runtime",
      numericRuntimeBehaviorChange: false,
      outputCardStatusChange: false,
      outputSupportChange: false,
      proposalReportCopyChange: false,
      routeCardValueChange: false,
      runtimeImportSelectedNow: false,
      selectedNextAction: "gate_e_implement_flat_list_multileaf_family_guard_with_engine_web_negative_boundaries",
      selectedNextFile:
        "packages/engine/src/route-family-lane-drift-common-stack-watchlist-gate-e-flat-list-family-guard-implementation.test.ts",
      selectedNextStatus:
        "common_stack_lane_drift_flat_list_guard_design_landed_no_runtime_selected_gate_e_implementation",
      selectedPlanningSurface: "docs/calculator/SLICE_ROUTE_FAMILY_LANE_DRIFT_COMMON_STACK_WATCHLIST_PLAN.md",
      sliceId: "route_family_lane_drift_common_stack_watchlist_v1",
      supportPromotion: false,
      thisGateFile:
        "packages/engine/src/route-family-lane-drift-common-stack-watchlist-gate-d-flat-list-family-guard-design.test.ts",
      workbenchInputBehaviorChange: false
    });

    for (const path of REQUIRED_PLANNING_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("designs an adjacent-swap sensitivity predicate that catches both rockwool and ordinary flat-list flips", () => {
    const splitBase = assessFlatListMultileafGuardCandidate(SPLIT_ROCKWOOL_STACK);
    const splitSwapped = assessFlatListMultileafGuardCandidate(swap(SPLIT_ROCKWOOL_STACK, 3, 4));
    const classicBase = assessFlatListMultileafGuardCandidate(CLASSIC_TRIPLE_LEAF_STACK);
    const classicSwapped = assessFlatListMultileafGuardCandidate(swap(CLASSIC_TRIPLE_LEAF_STACK, 1, 2));

    expect(splitBase).toMatchObject({
      current: {
        confidence: "low",
        family: "multileaf_multicavity",
        rw: 41,
        strategy: "multileaf_screening_blend"
      },
      guardCandidate: true,
      maxAdjacentRwDeltaDb: 10,
      rejectionReasons: []
    });
    expect(splitSwapped).toMatchObject({
      current: {
        confidence: "medium",
        family: "double_leaf",
        rw: 51,
        strategy: "double_leaf_porous_fill_delegate"
      },
      guardCandidate: true,
      maxAdjacentRwDeltaDb: 10,
      rejectionReasons: []
    });
    expect(classicBase).toMatchObject({
      current: {
        confidence: "low",
        family: "multileaf_multicavity",
        rw: 32,
        strategy: "multileaf_screening_blend"
      },
      guardCandidate: true,
      maxAdjacentRwDeltaDb: 12,
      rejectionReasons: []
    });
    expect(classicSwapped).toMatchObject({
      current: {
        confidence: "medium",
        family: "double_leaf",
        rw: 44,
        strategy: "double_leaf_porous_fill_delegate"
      },
      guardCandidate: true,
      maxAdjacentRwDeltaDb: 12,
      rejectionReasons: []
    });
  });

  it("protects ordinary double-leaf, stud, masonry, grouped topology, duplicate, floor, and alias boundaries", () => {
    const ordinaryDoubleLeaf = assessFlatListMultileafGuardCandidate(ORDINARY_DOUBLE_LEAF_STACK);
    const simpleStud = assessFlatListMultileafGuardCandidate(SIMPLE_STUD_STACK, { context: SIMPLE_STUD_CONTEXT });
    const heavyBoundary = assessFlatListMultileafGuardCandidate(HEAVY_MULTILEAF_STACK);
    const groupedTripleLeaf = assessFlatListMultileafGuardCandidate(SPLIT_ROCKWOOL_STACK, {
      context: COMPLETE_TRIPLE_LEAF_CONTEXT
    });
    const duplicateClassic = assessFlatListMultileafGuardCandidate([
      ...CLASSIC_TRIPLE_LEAF_STACK,
      ...CLASSIC_TRIPLE_LEAF_STACK
    ]);
    const knownFloor = assessFlatListMultileafGuardCandidate(RAW_FLOOR_STACK, { mode: "floor" });
    const aliasOnly = assessFlatListMultileafGuardCandidate(GYPSUM_ALIAS_MIXED_STACK);
    const floor = calculateAssembly(RAW_FLOOR_STACK, { targetOutputs: FLOOR_LAB_OUTPUTS });

    expect(ordinaryDoubleLeaf.guardCandidate).toBe(false);
    expect(ordinaryDoubleLeaf.rejectionReasons).toContain("ordinary_double_leaf_negative_boundary");
    expect(ordinaryDoubleLeaf.current).toMatchObject({
      confidence: "medium",
      family: "double_leaf",
      rw: 41,
      strategy: "double_leaf_porous_fill_delegate"
    });

    expect(simpleStud.guardCandidate).toBe(false);
    expect(simpleStud.rejectionReasons).toContain("simple_stud_negative_boundary");
    expect(simpleStud.current).toMatchObject({
      confidence: "low",
      family: "stud_wall_system",
      rw: 43,
      strategy: "stud_surrogate_blend+framed_wall_calibration"
    });

    expect(heavyBoundary.guardCandidate).toBe(false);
    expect(heavyBoundary.rejectionReasons).toContain("lined_massive_boundary_hold_negative_boundary");
    expect(heavyBoundary.current.rw).toBe(39);

    expect(groupedTripleLeaf.guardCandidate).toBe(false);
    expect(groupedTripleLeaf.rejectionReasons).toContain("grouped_triple_leaf_topology_negative_boundary");
    expect(groupedTripleLeaf.current.strategy).toBe("broad_accuracy_wall_multileaf_triple_leaf_local_substitution_runtime_corridor");

    expect(duplicateClassic.guardCandidate).toBe(false);
    expect(duplicateClassic.rejectionReasons).toContain("duplicate_many_layer_finite_output_negative_boundary");
    expect(duplicateClassic.current.rw).toBe(37);

    expect(knownFloor.guardCandidate).toBe(false);
    expect(knownFloor.rejectionReasons).toContain("known_floor_exact_row_negative_boundary");
    expect(floor.floorSystemMatch?.system.id).toBe("dataholz_gdmtxn01_dry_clt_lab_2026");
    expect(floor.floorSystemRatings?.Rw).toBe(62);
    expect(floor.impact?.LnW).toBe(50);

    expect(aliasOnly.guardCandidate).toBe(false);
    expect(aliasOnly.rejectionReasons).toContain("ordinary_double_leaf_negative_boundary");
    expect(aliasOnly.current).toMatchObject({
      confidence: "medium",
      family: "laminated_single_leaf",
      rw: 37,
      strategy: "laminated_leaf_sharp_delegate"
    });
  });

  it("keeps the proposed future effect fail-closed rather than treating the rockwool answer as fixed", () => {
    expect(FLAT_LIST_MULTILEAF_GUARD_DESIGN).toEqual({
      ambiguityProbe: "flat_list_adjacent_swap_sensitivity_probe",
      currentRuntimeBehaviorChange: false,
      futureTargetStrategy: "multileaf_screening_blend_fail_closed_until_grouped_topology",
      guardCandidateThresholdDb: 8,
      maximumProbeLayerCount: 9,
      protectedBoundaries: [
        "ordinary_double_leaf_negative_boundary",
        "simple_stud_negative_boundary",
        "lined_massive_boundary_hold_negative_boundary",
        "grouped_triple_leaf_topology_negative_boundary",
        "duplicate_many_layer_finite_output_negative_boundary",
        "known_floor_exact_row_negative_boundary",
        "near_source_alias_no_promotion_boundary",
        "field_output_visible_policy_boundary",
        "paired_engine_and_web_visible_tests_before_runtime"
      ],
      runtimeImportSelectedNow: false,
      sourcePromotionAllowedNow: false,
      valueRetuneAllowedNow: false
    });
  });

  it("requires paired web-visible proof before any runtime guard can ship", () => {
    const requiredGateEProofs = [
      "engine_split_rockwool_swapped_flat_list_holds_multileaf_fail_closed",
      "engine_classic_swapped_flat_list_holds_multileaf_fail_closed",
      "engine_ordinary_double_leaf_negative_boundary",
      "engine_simple_stud_negative_boundary",
      "engine_lined_massive_negative_boundary",
      "engine_grouped_topology_negative_boundary",
      "engine_duplicate_many_layer_negative_boundary",
      "engine_floor_exact_row_negative_boundary",
      "engine_near_source_alias_negative_boundary",
      "web_route_card_shows_fail_closed_multileaf_screening_not_exact",
      "web_output_card_does_not_promote_rw_prime_or_dntw_as_exact"
    ];

    expect(requiredGateEProofs).toContain("web_route_card_shows_fail_closed_multileaf_screening_not_exact");
    expect(requiredGateEProofs).toContain("web_output_card_does_not_promote_rw_prime_or_dntw_as_exact");
    expect(requiredGateEProofs.filter((proof) => proof.startsWith("engine_"))).toHaveLength(9);
  });

  it("keeps active docs aligned on Gate D landing and Gate E selection", () => {
    const docs = [
      readRepoFile("AGENTS.md"),
      readRepoFile("docs/calculator/NEXT_IMPLEMENTATION_PLAN.md"),
      readRepoFile("docs/calculator/CURRENT_STATE.md"),
      readRepoFile("docs/calculator/SLICE_ROUTE_FAMILY_LANE_DRIFT_COMMON_STACK_WATCHLIST_PLAN.md"),
      readRepoFile("docs/calculator/CHECKPOINT_2026-05-03_ROUTE_FAMILY_LANE_DRIFT_COMMON_STACK_WATCHLIST_GATE_D_HANDOFF.md"),
      readRepoFile("docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md"),
      readRepoFile("docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md"),
      readRepoFile("docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md")
    ];

    for (const doc of docs) {
      expect(doc).toContain(ROUTE_FAMILY_LANE_DRIFT_COMMON_STACK_WATCHLIST_GATE_D.sliceId);
      expect(doc).toContain(ROUTE_FAMILY_LANE_DRIFT_COMMON_STACK_WATCHLIST_GATE_D.thisGateFile);
      expect(doc).toContain(ROUTE_FAMILY_LANE_DRIFT_COMMON_STACK_WATCHLIST_GATE_D.selectedNextFile);
      expect(doc).toContain(ROUTE_FAMILY_LANE_DRIFT_COMMON_STACK_WATCHLIST_GATE_D.selectedNextAction);
      expect(doc).toContain(ROUTE_FAMILY_LANE_DRIFT_COMMON_STACK_WATCHLIST_GATE_D.selectedNextStatus);
      expect(doc).toContain("flat_list_adjacent_swap_sensitivity_probe");
      expect(doc).toContain("multileaf_screening_blend_fail_closed_until_grouped_topology");
      expect(doc).toContain("ordinary_double_leaf_negative_boundary");
      expect(doc).toContain("lined_massive_boundary_hold_negative_boundary");
      expect(doc).toContain("paired_engine_and_web_visible_tests_before_runtime");
      expect(doc).toContain("paused_waiting_rights_safe_source_packet");
      expect(doc).toContain("standing_lane_misclassification_monitoring_mandate");
      expect(doc).toContain("note_test_document_or_easy_fix");
    }
  });

  it("keeps frozen surfaces and validation expectations explicit", () => {
    const joinedDocs = [
      readRepoFile("docs/calculator/CHECKPOINT_2026-05-03_ROUTE_FAMILY_LANE_DRIFT_COMMON_STACK_WATCHLIST_GATE_D_HANDOFF.md"),
      readRepoFile("docs/calculator/SLICE_ROUTE_FAMILY_LANE_DRIFT_COMMON_STACK_WATCHLIST_PLAN.md"),
      readRepoFile("docs/calculator/NEXT_IMPLEMENTATION_PLAN.md")
    ].join("\n");

    for (const surface of FROZEN_SURFACES) {
      expect(joinedDocs, surface).toContain(surface);
    }

    expect(joinedDocs).toContain(
      "pnpm --filter @dynecho/engine exec vitest run src/route-family-lane-drift-common-stack-watchlist-gate-d-flat-list-family-guard-design.test.ts --maxWorkers=1"
    );
    expect(joinedDocs).toContain("pnpm calculator:gate:current");
    expect(joinedDocs).toContain("git diff --check");
  });
});
