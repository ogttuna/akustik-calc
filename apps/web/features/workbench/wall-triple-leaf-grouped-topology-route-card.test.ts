import {
  AirborneContextSchema,
  type AirborneContext,
  type RequestedOutputId
} from "@dynecho/shared";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { getDoubleLeafFramedBridgeAirbornePromptDetail } from "./airborne-physical-input-prompt";
import { getDynamicCalcBranchSummary } from "./dynamic-calc-branch";
import { getGuidedTopologyGap } from "./guided-topology-gap";
import { evaluateScenario } from "./scenario-analysis";
import { buildOutputCard } from "./simple-workbench-output-model";
import {
  buildWorkbenchWallTopology,
  parseWorkbenchLayerIndexList,
  type WorkbenchWallTopologyDraft
} from "./simple-workbench-wall-topology";
import type { LayerDraft } from "./workbench-store";

const WALL_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];

const SPLIT_ROCKWOOL_ROWS: readonly Omit<LayerDraft, "id">[] = [
  { materialId: "gypsum_board", thicknessMm: "12.5" },
  { materialId: "mlv", thicknessMm: "4" },
  { materialId: "gypsum_board", thicknessMm: "12.5" },
  { materialId: "rockwool", thicknessMm: "50" },
  { materialId: "gypsum_board", thicknessMm: "12.5" },
  { materialId: "rockwool", thicknessMm: "50" },
  { materialId: "gypsum_board", thicknessMm: "12.5" },
  { materialId: "gypsum_plaster", thicknessMm: "10" },
  { materialId: "gypsum_board", thicknessMm: "12.5" }
];

const COMPLETE_TRIPLE_LEAF_TOPOLOGY_DRAFT: WorkbenchWallTopologyDraft = {
  airborneWallCavity1AbsorptionClass: "porous_absorptive",
  airborneWallCavity1DepthMm: "50",
  airborneWallCavity1FillCoverage: "full",
  airborneWallCavity1LayerIndices: "4",
  airborneWallCavity2AbsorptionClass: "porous_absorptive",
  airborneWallCavity2DepthMm: "50",
  airborneWallCavity2FillCoverage: "full",
  airborneWallCavity2LayerIndices: "6",
  airborneWallInternalLeafCoupling: "independent",
  airborneWallInternalLeafLayerIndices: "5",
  airborneWallSideALeafLayerIndices: "1, 2, 3",
  airborneWallSideBLeafLayerIndices: "7, 8, 9",
  airborneWallSupportTopology: "independent_frames",
  airborneWallTopologyMode: "grouped_triple_leaf"
};

function createMemoryStorage(): Storage {
  const values = new Map<string, string>();

  return {
    clear() {
      values.clear();
    },
    getItem(key: string) {
      return values.has(key) ? values.get(key)! : null;
    },
    key(index: number) {
      return Array.from(values.keys())[index] ?? null;
    },
    get length() {
      return values.size;
    },
    removeItem(key: string) {
      values.delete(key);
    },
    setItem(key: string, value: string) {
      values.set(key, value);
    }
  };
}

function toDraftRows(rows: readonly Omit<LayerDraft, "id">[], id: string): LayerDraft[] {
  return rows.map((row, index) => ({
    ...row,
    id: `${id}-${index + 1}`
  }));
}

function runTripleLeafRoute(input: {
  airborneContext?: AirborneContext;
  id: string;
}) {
  const rows = toDraftRows(SPLIT_ROCKWOOL_ROWS, input.id);
  const scenario = evaluateScenario({
    airborneContext: input.airborneContext ?? { contextMode: "element_lab" },
    calculator: "dynamic",
    id: input.id,
    name: input.id,
    rows,
    source: "current",
    studyMode: "wall",
    targetOutputs: WALL_OUTPUTS
  });

  expect(scenario.result, `${input.id} result`).not.toBeNull();

  if (!scenario.result) {
    throw new Error(`${input.id} did not evaluate.`);
  }

  return {
    branch: getDynamicCalcBranchSummary({ result: scenario.result, studyMode: "wall" }),
    result: scenario.result,
    rows,
    rwCard: buildOutputCard({
      output: "Rw",
      result: scenario.result,
      studyMode: "wall"
    }),
    topologyGap: getGuidedTopologyGap({
      result: scenario.result,
      rows,
      studyMode: "wall"
    }),
    warnings: scenario.warnings
  };
}

describe("wall triple-leaf grouped topology route-card Gate I", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubGlobal("localStorage", createMemoryStorage());
  });

  it("converts visible row-number groups into shared wallTopology without ambiguous flat-order roles", () => {
    expect(parseWorkbenchLayerIndexList("1, 2  3", SPLIT_ROCKWOOL_ROWS.length)).toEqual([0, 1, 2]);
    expect(parseWorkbenchLayerIndexList("0", SPLIT_ROCKWOOL_ROWS.length)).toBeUndefined();
    expect(parseWorkbenchLayerIndexList("10", SPLIT_ROCKWOOL_ROWS.length)).toBeUndefined();

    const wallTopology = buildWorkbenchWallTopology(
      COMPLETE_TRIPLE_LEAF_TOPOLOGY_DRAFT,
      SPLIT_ROCKWOOL_ROWS.length
    );

    expect(wallTopology).toEqual({
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
    });

    expect(
      AirborneContextSchema.parse({
        contextMode: "element_lab",
        wallTopology
      }).wallTopology
    ).toEqual(wallTopology);
  });

  it("persists grouped topology controls through workbench scenario save/load and clears stale row groups on preset load", async () => {
    const { useWorkbenchStore } = await import("./workbench-store");

    useWorkbenchStore.getState().startStudyMode("wall");
    useWorkbenchStore.getState().appendRows(SPLIT_ROCKWOOL_ROWS);
    useWorkbenchStore.getState().setAirborneWallTopologyMode("grouped_triple_leaf");
    useWorkbenchStore.getState().setAirborneWallSideALeafLayerIndices("1, 2, 3");
    useWorkbenchStore.getState().setAirborneWallCavity1LayerIndices("4");
    useWorkbenchStore.getState().setAirborneWallCavity1DepthMm("50");
    useWorkbenchStore.getState().setAirborneWallCavity1FillCoverage("full");
    useWorkbenchStore.getState().setAirborneWallCavity1AbsorptionClass("porous_absorptive");
    useWorkbenchStore.getState().setAirborneWallInternalLeafLayerIndices("5");
    useWorkbenchStore.getState().setAirborneWallInternalLeafCoupling("independent");
    useWorkbenchStore.getState().setAirborneWallCavity2LayerIndices("6");
    useWorkbenchStore.getState().setAirborneWallCavity2DepthMm("50");
    useWorkbenchStore.getState().setAirborneWallCavity2FillCoverage("full");
    useWorkbenchStore.getState().setAirborneWallCavity2AbsorptionClass("porous_absorptive");
    useWorkbenchStore.getState().setAirborneWallSideBLeafLayerIndices("7, 8, 9");
    useWorkbenchStore.getState().setAirborneWallSupportTopology("independent_frames");

    const wallTopology = buildWorkbenchWallTopology(useWorkbenchStore.getState(), useWorkbenchStore.getState().rows.length);
    expect(wallTopology?.sideALeafLayerIndices).toEqual([0, 1, 2]);
    expect(wallTopology?.sideBLeafLayerIndices).toEqual([6, 7, 8]);

    useWorkbenchStore.getState().saveCurrentScenario();
    const savedScenarioId = useWorkbenchStore.getState().savedScenarios[0]?.id;

    useWorkbenchStore.getState().setAirborneWallTopologyMode("auto");
    useWorkbenchStore.getState().loadSavedScenario(savedScenarioId!);

    expect(useWorkbenchStore.getState().airborneWallTopologyMode).toBe("grouped_triple_leaf");
    expect(useWorkbenchStore.getState().airborneWallInternalLeafLayerIndices).toBe("5");

    useWorkbenchStore.getState().loadPreset("concrete_wall");

    expect(useWorkbenchStore.getState().airborneWallTopologyMode).toBe("auto");
    expect(useWorkbenchStore.getState().airborneWallSideALeafLayerIndices).toBe("");
  });

  it("shows missing grouped topology on the route-card layer when the PDF repro is still only a flat list", () => {
    const snapshot = runTripleLeafRoute({ id: "triple-leaf-flat-list" });

    expect(snapshot.result.dynamicAirborneTrace?.strategy).toBe("multileaf_screening_blend");
    expect(snapshot.result.dynamicAirborneTrace?.confidenceClass).toBe("low");
    expect(snapshot.result.supportedTargetOutputs).toEqual([]);
    expect(snapshot.result.unsupportedTargetOutputs).toEqual([...WALL_OUTPUTS]);
    expect(snapshot.rwCard).toMatchObject({
      detail: getDoubleLeafFramedBridgeAirbornePromptDetail(snapshot.result),
      status: "needs_input",
      value: "Not ready"
    });
    expect(snapshot.topologyGap).toMatchObject({
      value: "Grouped topology missing"
    });
    expect(snapshot.topologyGap?.detail).toContain("Missing: side A leaf layer group");
  });

  it("accepts complete grouped topology and shows the source-gated prediction with source validation blockers", () => {
    const wallTopology = buildWorkbenchWallTopology(
      COMPLETE_TRIPLE_LEAF_TOPOLOGY_DRAFT,
      SPLIT_ROCKWOOL_ROWS.length
    );
    const snapshot = runTripleLeafRoute({
      airborneContext: {
        contextMode: "element_lab",
        wallTopology
      },
      id: "triple-leaf-grouped"
    });

    expect(snapshot.result.dynamicAirborneTrace?.strategy).toBe(
      "broad_accuracy_wall_multileaf_triple_leaf_local_substitution_runtime_corridor"
    );
    expect(snapshot.result.dynamicAirborneTrace?.confidenceClass).toBe("medium");
    expect(snapshot.rwCard).toMatchObject({ status: "live", value: "53 dB" });
    expect(snapshot.branch).toMatchObject({
      tone: "ready",
      value: "Wall triple-leaf local substitution"
    });
    expect(snapshot.topologyGap).toMatchObject({
      value: "Triple-leaf prediction"
    });
    expect(snapshot.topologyGap?.detail).toContain("triple-leaf prediction route");
    expect(snapshot.topologyGap?.detail).not.toContain("Missing:");
    expect(snapshot.warnings.some((warning) => /lab spectrum adapter is active/i.test(warning))).toBe(true);
  });
});
