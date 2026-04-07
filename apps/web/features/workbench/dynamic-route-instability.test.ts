import type { AirborneContext, RequestedOutputId } from "@dynecho/shared";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { evaluateScenario } from "./scenario-analysis";

const LAB_OUTPUTS: readonly RequestedOutputId[] = ["Rw"];
const FIELD_OUTPUTS: readonly RequestedOutputId[] = ["R'w", "DnT,w"];

const LAB_CONTEXT: AirborneContext = {
  contextMode: "element_lab"
};

const FIELD_CONTEXT: AirborneContext = {
  contextMode: "building_prediction",
  panelHeightMm: 2800,
  panelWidthMm: 3600,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 45
};

const DUPLICATE_STACK = [
  { materialId: "rockwool", thicknessMm: "50" },
  { materialId: "rockwool", thicknessMm: "50" },
  { materialId: "security_board", thicknessMm: "12.5" },
  { materialId: "ytong_aac_d700", thicknessMm: "100" },
  { materialId: "air_gap", thicknessMm: "50" }
] as const;

const MOVE_STACK = [
  { materialId: "security_board", thicknessMm: "12.5" },
  { materialId: "rockwool", thicknessMm: "50" },
  { materialId: "security_board", thicknessMm: "12.5" },
  { materialId: "ytong_aac_d700", thicknessMm: "100" },
  { materialId: "rockwool", thicknessMm: "50" }
] as const;

const DUPLICATE_VARIANTS = [
  {
    base: {
      dnTw: 36,
      family: "masonry_nonhomogeneous",
      rw: 36,
      rwPrime: 34,
      strategy: "masonry_nonhomogeneous_blend+aac_massive_calibration+masonry_davy_cap"
    },
    duplicated: {
      dnTw: 56,
      family: "double_leaf",
      rw: 55,
      rwPrime: 55,
      strategy: "double_leaf_porous_fill_delegate"
    },
    name: "base",
    stack: DUPLICATE_STACK
  },
  {
    base: {
      dnTw: 37,
      family: "masonry_nonhomogeneous",
      rw: 36,
      rwPrime: 36,
      strategy: "masonry_nonhomogeneous_blend+aac_massive_calibration+masonry_davy_cap"
    },
    duplicated: {
      dnTw: 56,
      family: "double_leaf",
      rw: 55,
      rwPrime: 55,
      strategy: "double_leaf_porous_fill_delegate"
    },
    name: "leading-gap",
    stack: [{ materialId: "air_gap", thicknessMm: "25" }, ...DUPLICATE_STACK]
  },
  {
    base: {
      dnTw: 36,
      family: "masonry_nonhomogeneous",
      rw: 36,
      rwPrime: 34,
      strategy: "masonry_nonhomogeneous_blend+aac_massive_calibration+masonry_davy_cap"
    },
    duplicated: {
      dnTw: 56,
      family: "double_leaf",
      rw: 55,
      rwPrime: 55,
      strategy: "double_leaf_porous_fill_delegate"
    },
    name: "trailing-wool",
    stack: [...DUPLICATE_STACK, { materialId: "rockwool", thicknessMm: "25" }]
  }
] as const;

const ADJACENT_SWAP_CASES = [
  {
    base: {
      dnTw: 36,
      family: "masonry_nonhomogeneous",
      rw: 36,
      rwPrime: 34,
      strategy: "masonry_nonhomogeneous_blend+aac_massive_calibration+masonry_davy_cap"
    },
    changed: {
      dnTw: 50,
      family: "double_leaf",
      rw: 50,
      rwPrime: 48,
      strategy: "double_leaf_porous_fill_delegate"
    },
    minDnTwDelta: 14,
    minRwDelta: 14,
    minRwPrimeDelta: 14,
    name: "duplicate-stack swap 2<->3",
    stack: DUPLICATE_STACK,
    swapIndex: 1
  },
  {
    base: {
      dnTw: 36,
      family: "masonry_nonhomogeneous",
      rw: 36,
      rwPrime: 34,
      strategy: "masonry_nonhomogeneous_blend+aac_massive_calibration+masonry_davy_cap"
    },
    changed: {
      dnTw: 49,
      family: "double_leaf",
      rw: 50,
      rwPrime: 48,
      strategy: "double_leaf_empty_cavity_delegate"
    },
    minDnTwDelta: 13,
    minRwDelta: 14,
    minRwPrimeDelta: 14,
    name: "duplicate-stack swap 4<->5",
    stack: DUPLICATE_STACK,
    swapIndex: 3
  },
  {
    base: {
      dnTw: 50,
      family: "double_leaf",
      rw: 51,
      rwPrime: 49,
      strategy: "double_leaf_porous_fill_delegate"
    },
    changed: {
      dnTw: 37,
      family: "masonry_nonhomogeneous",
      rw: 37,
      rwPrime: 35,
      strategy: "masonry_nonhomogeneous_blend+aac_massive_calibration+masonry_davy_cap"
    },
    minDnTwDelta: 10,
    minRwDelta: 12,
    minRwPrimeDelta: 12,
    name: "move-stack swap 1<->2",
    stack: MOVE_STACK,
    swapIndex: 0
  },
  {
    base: {
      dnTw: 50,
      family: "double_leaf",
      rw: 51,
      rwPrime: 49,
      strategy: "double_leaf_porous_fill_delegate"
    },
    changed: {
      dnTw: 42,
      family: "multileaf_multicavity",
      rw: 43,
      rwPrime: 41,
      strategy: "multileaf_screening_blend"
    },
    minDnTwDelta: 8,
    minRwDelta: 8,
    minRwPrimeDelta: 8,
    name: "move-stack swap 4<->5",
    stack: MOVE_STACK,
    swapIndex: 3
  }
] as const;

type StackLayer = {
  materialId: string;
  thicknessMm: string;
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

function buildRows(stack: readonly StackLayer[], prefix: string) {
  return stack.map((layer, index) => ({
    ...layer,
    id: `${prefix}-${index + 1}`
  }));
}

function evaluateDynamicWall(
  rows: Parameters<typeof evaluateScenario>[0]["rows"],
  id: string
) {
  const lab = evaluateScenario({
    airborneContext: LAB_CONTEXT,
    calculator: "dynamic",
    id: `${id}-lab`,
    name: `${id} lab`,
    rows,
    source: "current",
    studyMode: "wall",
    targetOutputs: LAB_OUTPUTS
  });
  const field = evaluateScenario({
    airborneContext: FIELD_CONTEXT,
    calculator: "dynamic",
    id: `${id}-field`,
    name: `${id} field`,
    rows,
    source: "current",
    studyMode: "wall",
    targetOutputs: FIELD_OUTPUTS
  });

  return { field, lab };
}

function expectReady(
  resultPair: ReturnType<typeof evaluateDynamicWall>,
  label: string
) {
  expect(resultPair.lab.result, `${label} lab result should be present`).not.toBeNull();
  expect(resultPair.field.result, `${label} field result should be present`).not.toBeNull();
  expect(resultPair.lab.result?.ok, `${label} lab result should stay ok`).toBe(true);
  expect(resultPair.field.result?.ok, `${label} field result should stay ok`).toBe(true);
}

function snapshot(resultPair: ReturnType<typeof evaluateDynamicWall>) {
  expectReady(resultPair, "dynamic wall pair");

  return {
    dnTw: resultPair.field.result!.metrics.estimatedDnTwDb,
    family: resultPair.field.result!.dynamicAirborneTrace?.detectedFamily ?? resultPair.lab.result!.dynamicAirborneTrace?.detectedFamily ?? null,
    rw: resultPair.lab.result!.metrics.estimatedRwDb,
    rwPrime: resultPair.field.result!.metrics.estimatedRwPrimeDb,
    strategy: resultPair.field.result!.dynamicAirborneTrace?.strategy ?? resultPair.lab.result!.dynamicAirborneTrace?.strategy ?? null
  };
}

function swapAdjacent(stack: readonly StackLayer[], leftIndex: number) {
  const swapped = [...stack];
  [swapped[leftIndex], swapped[leftIndex + 1]] = [swapped[leftIndex + 1]!, swapped[leftIndex]!];
  return swapped;
}

describe("dynamic route instability reproductions", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubGlobal("localStorage", createMemoryStorage());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("reproduces the reported five-layer duplicate jump on the workbench wall route", async () => {
    const { useWorkbenchStore } = await import("./workbench-store");

    useWorkbenchStore.getState().reset();
    useWorkbenchStore.getState().startStudyMode("wall");
    useWorkbenchStore.getState().setCalculatorId("dynamic");
    useWorkbenchStore.getState().appendRows(DUPLICATE_STACK);

    const base = snapshot(evaluateDynamicWall(useWorkbenchStore.getState().rows, "wall-duplicate-base"));

    useWorkbenchStore.getState().appendRows(DUPLICATE_STACK);

    const duplicated = snapshot(evaluateDynamicWall(useWorkbenchStore.getState().rows, "wall-duplicate-changed"));

    expect(base).toEqual({
      dnTw: 36,
      family: "masonry_nonhomogeneous",
      rw: 36,
      rwPrime: 34,
      strategy: "masonry_nonhomogeneous_blend+aac_massive_calibration+masonry_davy_cap"
    });
    expect(duplicated).toEqual({
      dnTw: 56,
      family: "double_leaf",
      rw: 55,
      rwPrime: 55,
      strategy: "double_leaf_porous_fill_delegate"
    });
    expect(duplicated.rw - base.rw).toBeGreaterThanOrEqual(15);
    expect(duplicated.rwPrime - base.rwPrime).toBeGreaterThanOrEqual(20);
    expect(duplicated.dnTw - base.dnTw).toBeGreaterThanOrEqual(18);
  });

  it("reproduces the reported move-up jump on the workbench wall route", async () => {
    const { useWorkbenchStore } = await import("./workbench-store");

    useWorkbenchStore.getState().reset();
    useWorkbenchStore.getState().startStudyMode("wall");
    useWorkbenchStore.getState().setCalculatorId("dynamic");
    useWorkbenchStore.getState().appendRows(MOVE_STACK);

    const base = snapshot(evaluateDynamicWall(useWorkbenchStore.getState().rows, "wall-move-base"));
    const movableRowId = useWorkbenchStore.getState().rows[1]!.id;

    useWorkbenchStore.getState().moveRow(movableRowId, "up");

    const moved = snapshot(evaluateDynamicWall(useWorkbenchStore.getState().rows, "wall-move-changed"));

    expect(base).toEqual({
      dnTw: 50,
      family: "double_leaf",
      rw: 51,
      rwPrime: 49,
      strategy: "double_leaf_porous_fill_delegate"
    });
    expect(moved).toEqual({
      dnTw: 37,
      family: "masonry_nonhomogeneous",
      rw: 37,
      rwPrime: 35,
      strategy: "masonry_nonhomogeneous_blend+aac_massive_calibration+masonry_davy_cap"
    });
    expect(base.rw - moved.rw).toBeGreaterThanOrEqual(12);
    expect(base.rwPrime - moved.rwPrime).toBeGreaterThanOrEqual(12);
    expect(base.dnTw - moved.dnTw).toBeGreaterThanOrEqual(10);
  });

  it("reproduces the duplicate handoff across equivalent compliant-layer variants entered one row at a time", async () => {
    const { useWorkbenchStore } = await import("./workbench-store");

    for (const variant of DUPLICATE_VARIANTS) {
      useWorkbenchStore.getState().reset();
      useWorkbenchStore.getState().startStudyMode("wall");
      useWorkbenchStore.getState().setCalculatorId("dynamic");

      for (const layer of variant.stack) {
        useWorkbenchStore.getState().appendMaterial(layer.materialId, layer.thicknessMm);
      }

      const base = snapshot(evaluateDynamicWall(useWorkbenchStore.getState().rows, `${variant.name}-sequential-base`));

      for (const layer of variant.stack) {
        useWorkbenchStore.getState().appendMaterial(layer.materialId, layer.thicknessMm);
      }

      const duplicated = snapshot(evaluateDynamicWall(useWorkbenchStore.getState().rows, `${variant.name}-sequential-duplicated`));

      expect(base, `${variant.name} base`).toEqual(variant.base);
      expect(duplicated, `${variant.name} duplicated`).toEqual(variant.duplicated);
      expect(duplicated.rw - base.rw, `${variant.name} lab jump`).toBeGreaterThanOrEqual(19);
      expect(duplicated.rwPrime - base.rwPrime, `${variant.name} field R'w jump`).toBeGreaterThanOrEqual(19);
      expect(duplicated.dnTw - base.dnTw, `${variant.name} field DnT,w jump`).toBeGreaterThanOrEqual(18);
    }
  });

  it("captures an adjacent-swap instability matrix on ambiguous workbench wall stacks", () => {
    for (const testCase of ADJACENT_SWAP_CASES) {
      const base = snapshot(evaluateDynamicWall(buildRows(testCase.stack, `${testCase.name}-base`), `${testCase.name}-base`));
      const changed = snapshot(
        evaluateDynamicWall(buildRows(swapAdjacent(testCase.stack, testCase.swapIndex), `${testCase.name}-changed`), `${testCase.name}-changed`)
      );

      expect(base, `${testCase.name} base`).toEqual(testCase.base);
      expect(changed, `${testCase.name} changed`).toEqual(testCase.changed);
      expect(Math.abs(changed.rw - base.rw), `${testCase.name} lab delta`).toBeGreaterThanOrEqual(testCase.minRwDelta);
      expect(Math.abs(changed.rwPrime - base.rwPrime), `${testCase.name} field R'w delta`).toBeGreaterThanOrEqual(
        testCase.minRwPrimeDelta
      );
      expect(Math.abs(changed.dnTw - base.dnTw), `${testCase.name} field DnT,w delta`).toBeGreaterThanOrEqual(testCase.minDnTwDelta);
    }
  });
});
