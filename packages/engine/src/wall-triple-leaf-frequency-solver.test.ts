import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import type { AirborneContext, LayerInput } from "@dynecho/shared";

import { calculateAssembly } from "./calculate-assembly";
import {
  solveWallTripleLeafFrequencyBands,
  WALL_TRIPLE_LEAF_FREQUENCY_SOLVER_BANDS_HZ,
  WALL_TRIPLE_LEAF_FREQUENCY_SOLVER_GATE_F
} from "./wall-triple-leaf-frequency-solver";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const REQUIRED_DOCS = [
  "AGENTS.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/SLICE_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-04-30_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_F_HANDOFF.md"
] as const;

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

const COMPLETE_TRIPLE_LEAF_CONTEXT: AirborneContext = {
  contextMode: "element_lab",
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

function curveValueAt(result: ReturnType<typeof solveWallTripleLeafFrequencyBands>, frequencyHz: number): number {
  const curve = result.curve;
  expect(curve).not.toBeNull();
  const index = curve?.frequenciesHz.indexOf(frequencyHz) ?? -1;
  expect(index).toBeGreaterThanOrEqual(0);

  return curve?.transmissionLossDb[index] ?? 0;
}

function solveWithTopologyPatch(
  wallTopology: NonNullable<AirborneContext["wallTopology"]>
): ReturnType<typeof solveWallTripleLeafFrequencyBands> {
  return solveWallTripleLeafFrequencyBands({
    airborneContext: {
      contextMode: "element_lab",
      wallTopology
    },
    layers: SPLIT_ROCKWOOL_STACK
  });
}

describe("wall triple-leaf frequency solver Gate F", () => {
  it("lands a research-only solver skeleton without moving runtime or visible calculator behavior", () => {
    expect(WALL_TRIPLE_LEAF_FREQUENCY_SOLVER_GATE_F).toMatchObject({
      apiShapeChange: false,
      confidencePromotion: false,
      evidencePromotion: false,
      numericRuntimeBehaviorChange: false,
      runtimeImportReadyNow: false,
      runtimeImportSelectedNow: false,
      selectedNextAction: "gate_g_calibration_and_holdout_tolerance",
      selectedNextFile: "packages/engine/src/wall-triple-leaf-calibration-regime.test.ts",
      sourceOwned: false,
      workbenchInputBehaviorChange: false
    });
  });

  it("derives leaf surface masses from explicit Side A / internal / Side B groups", () => {
    const result = solveWallTripleLeafFrequencyBands({
      airborneContext: COMPLETE_TRIPLE_LEAF_CONTEXT,
      layers: SPLIT_ROCKWOOL_STACK
    });

    expect(result.calculationBlocked).toBe(false);
    expect(result.runtimeEligible).toBe(false);
    expect(result.researchOnly).toBe(true);
    expect(result.sourceOwned).toBe(false);
    expect(result.leafMasses.map((leaf) => leaf.id)).toEqual(["side_a_leaf", "internal_leaf", "side_b_leaf"]);
    expect(result.leafMasses.map((leaf) => leaf.layerIndices)).toEqual([[0, 1, 2], [4], [6, 7, 8]]);
    expect(result.leafMasses.map((leaf) => leaf.surfaceMassKgM2)).toEqual([28.9, 10.6, 31.3]);
    expect(result.cavities.map((cavity) => cavity.depthMm)).toEqual([50, 50]);
    expect(result.cavities.map((cavity) => cavity.dampingMultiplier)).toEqual([0.5, 0.5]);
  });

  it("returns an ISO 717-ready one-third-octave transmission-loss curve", () => {
    const result = solveWallTripleLeafFrequencyBands({
      airborneContext: COMPLETE_TRIPLE_LEAF_CONTEXT,
      layers: SPLIT_ROCKWOOL_STACK
    });

    expect(result.curve?.frequenciesHz).toEqual(WALL_TRIPLE_LEAF_FREQUENCY_SOLVER_BANDS_HZ);
    expect(result.curve?.transmissionLossDb).toHaveLength(WALL_TRIPLE_LEAF_FREQUENCY_SOLVER_BANDS_HZ.length);
    expect(result.curve?.transmissionLossDb.every((value) => Number.isFinite(value))).toBe(true);
    expect(result.ratings?.iso717.descriptor).toBe("Rw");
    expect(result.ratings?.iso717.Rw).toBeGreaterThan(0);
    expect(result.ratings?.iso717.composite).toContain("(");
    expect(result.ratings?.astmE413.STC).toBeGreaterThan(0);
  });

  it("models two cavity springs plus an interacting resonance pair instead of a flat dB penalty", () => {
    const result = solveWallTripleLeafFrequencyBands({
      airborneContext: COMPLETE_TRIPLE_LEAF_CONTEXT,
      layers: SPLIT_ROCKWOOL_STACK
    });

    expect(result.resonances).toHaveLength(2);
    expect(result.resonances.map((entry) => entry.cavityId)).toEqual(["cavity_1", "cavity_2"]);
    expect(result.resonances.map((entry) => entry.coupledLeafIds)).toEqual([
      ["side_a_leaf", "internal_leaf"],
      ["internal_leaf", "side_b_leaf"]
    ]);
    expect(result.resonances[0]?.resonanceHz).toBeGreaterThan(85);
    expect(result.resonances[0]?.resonanceHz).toBeLessThan(110);
    expect(result.resonances[1]?.resonanceHz).toBeGreaterThan(85);
    expect(result.resonances[1]?.resonanceHz).toBeLessThan(110);
    expect(result.resonances.map((entry) => entry.nearestBandHz)).toEqual([100, 100]);
    expect(result.interactingResonancePair?.centerHz).toBeGreaterThan(90);
    expect(result.interactingResonancePair?.penaltyDb).toBeGreaterThan(1);
    expect(curveValueAt(result, 100)).toBeLessThan(curveValueAt(result, 250));
  });

  it("makes fill damping and coupling explicit enough for Gate G calibration", () => {
    const emptyUnbridged = solveWithTopologyPatch({
      ...COMPLETE_TRIPLE_LEAF_CONTEXT.wallTopology,
      cavity1AbsorptionClass: "none",
      cavity1FillCoverage: "empty",
      cavity2AbsorptionClass: "none",
      cavity2FillCoverage: "empty"
    });
    const fullUnbridged = solveWallTripleLeafFrequencyBands({
      airborneContext: COMPLETE_TRIPLE_LEAF_CONTEXT,
      layers: SPLIT_ROCKWOOL_STACK
    });
    const fullDirectBridge = solveWithTopologyPatch({
      ...COMPLETE_TRIPLE_LEAF_CONTEXT.wallTopology,
      internalLeafCoupling: "direct_bridge",
      supportTopology: "direct_fixed"
    });

    expect(emptyUnbridged.resonances[0]?.dipDepthDb).toBeGreaterThan(fullUnbridged.resonances[0]?.dipDepthDb ?? 0);
    expect(curveValueAt(fullUnbridged, 100)).toBeGreaterThan(curveValueAt(emptyUnbridged, 100));
    expect(fullDirectBridge.coupling?.broadbandPenaltyDb).toBeGreaterThan(fullUnbridged.coupling?.broadbandPenaltyDb ?? 0);
    expect(fullDirectBridge.ratings?.iso717.Rw).toBeLessThan(fullUnbridged.ratings?.iso717.Rw ?? 0);
  });

  it("fails closed when grouped topology is missing, out of range, or overlapping", () => {
    const missing = solveWallTripleLeafFrequencyBands({
      airborneContext: { contextMode: "element_lab" },
      layers: SPLIT_ROCKWOOL_STACK
    });
    const outOfRange = solveWithTopologyPatch({
      ...COMPLETE_TRIPLE_LEAF_CONTEXT.wallTopology,
      sideBLeafLayerIndices: [6, 7, 999]
    });
    const overlapping = solveWithTopologyPatch({
      ...COMPLETE_TRIPLE_LEAF_CONTEXT.wallTopology,
      sideALeafLayerIndices: [0, 1, 2, 3]
    });
    const emptyBandGrid = solveWallTripleLeafFrequencyBands({
      airborneContext: COMPLETE_TRIPLE_LEAF_CONTEXT,
      frequenciesHz: [],
      layers: SPLIT_ROCKWOOL_STACK
    });

    expect(missing.calculationBlocked).toBe(true);
    expect(missing.blockers).toContain("complete_grouped_triple_leaf_topology_required");
    expect(outOfRange.calculationBlocked).toBe(true);
    expect(outOfRange.blockers).toContain("side_b_leaf_contains_out_of_range_layer_index_999");
    expect(overlapping.calculationBlocked).toBe(true);
    expect(overlapping.blockers).toContain("layer_index_3_appears_in_both_side_a_leaf_and_cavity_1");
    expect(emptyBandGrid.calculationBlocked).toBe(true);
    expect(emptyBandGrid.blockers).toContain("frequency_band_grid_required");
  });

  it("does not integrate the Gate F curve into the live dynamic calculator", () => {
    const liveResult = calculateAssembly(SPLIT_ROCKWOOL_STACK, {
      airborneContext: COMPLETE_TRIPLE_LEAF_CONTEXT,
      calculator: "dynamic",
      targetOutputs: ["Rw"]
    });

    expect(liveResult.metrics.estimatedRwDb).toBe(41);
    expect(liveResult.dynamicAirborneTrace?.strategy).toBe("multileaf_screening_blend");
    expect(liveResult.warnings.some((warning) => warning.includes("source-calibrated triple-leaf solver"))).toBe(true);
  });

  it("keeps active docs aligned with Gate F and the selected Gate G calibration gate", () => {
    for (const relativePath of REQUIRED_DOCS) {
      const absolutePath = join(REPO_ROOT, relativePath);
      expect(existsSync(absolutePath), `${relativePath} should exist`).toBe(true);
      const contents = readFileSync(absolutePath, "utf8");
      expect(contents).toContain(WALL_TRIPLE_LEAF_FREQUENCY_SOLVER_GATE_F.selectionStatus);
      expect(contents).toContain(WALL_TRIPLE_LEAF_FREQUENCY_SOLVER_GATE_F.selectedNextFile);
    }

    const plan = readFileSync(join(REPO_ROOT, "docs/calculator/SLICE_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_PLAN.md"), "utf8");
    expect(plan).toContain("Gate F - Frequency-Band Solver Skeleton");
    expect(plan).toContain("Gate G - Calibration and Holdout Tolerance");
    expect(plan).toContain("three-leaf/two-cavity frequency-band solver");
  });
});
