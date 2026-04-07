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
      confidence: "medium",
      dnTw: 36,
      family: "masonry_nonhomogeneous",
      rw: 36,
      rwPrime: 34,
      strategy: "masonry_nonhomogeneous_blend+aac_massive_calibration+masonry_davy_cap"
    },
    duplicated: {
      confidence: "low",
      dnTw: 48,
      family: "double_leaf",
      rw: 48,
      rwPrime: 47,
      strategy: "double_leaf_porous_fill_delegate+heavy_unframed_cavity_cap"
    },
    name: "base",
    stack: DUPLICATE_STACK
  },
  {
    base: {
      confidence: "medium",
      dnTw: 37,
      family: "masonry_nonhomogeneous",
      rw: 36,
      rwPrime: 36,
      strategy: "masonry_nonhomogeneous_blend+aac_massive_calibration+masonry_davy_cap"
    },
    duplicated: {
      confidence: "low",
      dnTw: 48,
      family: "double_leaf",
      rw: 48,
      rwPrime: 47,
      strategy: "double_leaf_porous_fill_delegate+heavy_unframed_cavity_cap"
    },
    name: "leading-gap",
    stack: [{ materialId: "air_gap", thicknessMm: "25" }, ...DUPLICATE_STACK]
  },
  {
    base: {
      confidence: "medium",
      dnTw: 36,
      family: "masonry_nonhomogeneous",
      rw: 36,
      rwPrime: 34,
      strategy: "masonry_nonhomogeneous_blend+aac_massive_calibration+masonry_davy_cap"
    },
    duplicated: {
      confidence: "low",
      dnTw: 49,
      family: "double_leaf",
      rw: 48,
      rwPrime: 48,
      strategy: "double_leaf_porous_fill_delegate+heavy_unframed_cavity_cap"
    },
    name: "trailing-wool",
    stack: [...DUPLICATE_STACK, { materialId: "rockwool", thicknessMm: "25" }]
  }
] as const;

const ADJACENT_SWAP_CASES = [
  {
    base: {
      confidence: "medium",
      dnTw: 36,
      family: "masonry_nonhomogeneous",
      rw: 36,
      rwPrime: 34,
      strategy: "masonry_nonhomogeneous_blend+aac_massive_calibration+masonry_davy_cap"
    },
    changed: {
      confidence: "low",
      dnTw: 47,
      family: "lined_massive_wall",
      rw: 47,
      rwPrime: 46,
      strategy: "lined_massive_blend+reinforcement_monotonic_floor+family_boundary_hold"
    },
    maxDnTwDelta: 13,
    maxRwDelta: 13,
    maxRwPrimeDelta: 14,
    name: "duplicate-stack swap 2<->3",
    stack: DUPLICATE_STACK,
    swapIndex: 1
  },
  {
    base: {
      confidence: "medium",
      dnTw: 36,
      family: "masonry_nonhomogeneous",
      rw: 36,
      rwPrime: 34,
      strategy: "masonry_nonhomogeneous_blend+aac_massive_calibration+masonry_davy_cap"
    },
    changed: {
      confidence: "low",
      dnTw: 46,
      family: "lined_massive_wall",
      rw: 47,
      rwPrime: 44,
      strategy: "lined_massive_blend+reinforcement_monotonic_floor+family_boundary_hold"
    },
    maxDnTwDelta: 12,
    maxRwDelta: 13,
    maxRwPrimeDelta: 12,
    name: "duplicate-stack swap 4<->5",
    stack: DUPLICATE_STACK,
    swapIndex: 3
  },
  {
    base: {
      confidence: "low",
      dnTw: 48,
      family: "lined_massive_wall",
      rw: 49,
      rwPrime: 47,
      strategy: "lined_massive_blend+reinforcement_monotonic_floor+family_boundary_hold"
    },
    changed: {
      confidence: "medium",
      dnTw: 37,
      family: "masonry_nonhomogeneous",
      rw: 37,
      rwPrime: 35,
      strategy: "masonry_nonhomogeneous_blend+aac_massive_calibration+masonry_davy_cap"
    },
    maxDnTwDelta: 12,
    maxRwDelta: 13,
    maxRwPrimeDelta: 13,
    name: "move-stack swap 1<->2",
    stack: MOVE_STACK,
    swapIndex: 0
  },
  {
    base: {
      confidence: "low",
      dnTw: 48,
      family: "lined_massive_wall",
      rw: 49,
      rwPrime: 47,
      strategy: "lined_massive_blend+reinforcement_monotonic_floor+family_boundary_hold"
    },
    changed: {
      confidence: "low",
      dnTw: 42,
      family: "multileaf_multicavity",
      rw: 43,
      rwPrime: 41,
      strategy: "multileaf_screening_blend"
    },
    maxDnTwDelta: 8,
    maxRwDelta: 8,
    maxRwPrimeDelta: 8,
    name: "move-stack swap 4<->5",
    stack: MOVE_STACK,
    swapIndex: 3
  }
] as const;

const COMPLEX_STACK_CASES = [
  {
    base: {
      confidence: "low",
      dnTw: 45,
      family: "multileaf_multicavity",
      rw: 44,
      rwPrime: 43,
      strategy: "multileaf_screening_blend"
    },
    duplicated: {
      confidence: "low",
      dnTw: 51,
      family: "multileaf_multicavity",
      rw: 51,
      rwPrime: 50,
      strategy: "multileaf_screening_blend+heavy_unframed_cavity_cap"
    },
    maxDnTwDelta: 6,
    maxRwDelta: 7,
    maxRwPrimeDelta: 7,
    name: "hybrid-a",
    stack: [
      { materialId: "rockwool", thicknessMm: "25" },
      { materialId: "security_board", thicknessMm: "12.5" },
      { materialId: "air_gap", thicknessMm: "30" },
      { materialId: "ytong_aac_d700", thicknessMm: "75" },
      { materialId: "rockwool", thicknessMm: "40" },
      { materialId: "security_board", thicknessMm: "12.5" },
      { materialId: "air_gap", thicknessMm: "20" },
      { materialId: "firestop_board", thicknessMm: "15" },
      { materialId: "ytong_aac_d700", thicknessMm: "100" }
    ] as const,
    swapIndex: 6,
    swapped: {
      confidence: "low",
      dnTw: 45,
      family: "multileaf_multicavity",
      rw: 44,
      rwPrime: 43,
      strategy: "multileaf_screening_blend"
    }
  },
  {
    base: {
      confidence: "low",
      dnTw: 44,
      family: "multileaf_multicavity",
      rw: 44,
      rwPrime: 43,
      strategy: "multileaf_screening_blend"
    },
    duplicated: {
      confidence: "low",
      dnTw: 52,
      family: "multileaf_multicavity",
      rw: 51,
      rwPrime: 50,
      strategy: "multileaf_screening_blend"
    },
    maxDnTwDelta: 8,
    maxRwDelta: 7,
    maxRwPrimeDelta: 7,
    name: "hybrid-b",
    stack: [
      { materialId: "cement_plaster", thicknessMm: "10" },
      { materialId: "ytong_aac_d700", thicknessMm: "100" },
      { materialId: "air_gap", thicknessMm: "25" },
      { materialId: "rockwool", thicknessMm: "50" },
      { materialId: "security_board", thicknessMm: "12.5" },
      { materialId: "air_gap", thicknessMm: "25" },
      { materialId: "rockwool", thicknessMm: "50" },
      { materialId: "security_board", thicknessMm: "12.5" },
      { materialId: "cement_plaster", thicknessMm: "10" }
    ] as const,
    swapIndex: 6,
    swapped: {
      confidence: "low",
      dnTw: 44,
      family: "multileaf_multicavity",
      rw: 44,
      rwPrime: 43,
      strategy: "multileaf_screening_blend"
    }
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
    confidence:
      resultPair.field.result!.dynamicAirborneTrace?.confidenceClass ??
      resultPair.lab.result!.dynamicAirborneTrace?.confidenceClass ??
      null,
    dnTw: resultPair.field.result!.metrics.estimatedDnTwDb,
    family:
      resultPair.field.result!.dynamicAirborneTrace?.detectedFamily ??
      resultPair.lab.result!.dynamicAirborneTrace?.detectedFamily ??
      null,
    notes: resultPair.field.result!.dynamicAirborneTrace?.notes ?? [],
    rw: resultPair.lab.result!.metrics.estimatedRwDb,
    rwPrime: resultPair.field.result!.metrics.estimatedRwPrimeDb,
    strategy:
      resultPair.field.result!.dynamicAirborneTrace?.strategy ??
      resultPair.lab.result!.dynamicAirborneTrace?.strategy ??
      null,
    warnings: resultPair.field.result!.warnings
  };
}

function swapAdjacent(stack: readonly StackLayer[], leftIndex: number) {
  const swapped = [...stack];
  [swapped[leftIndex], swapped[leftIndex + 1]] = [swapped[leftIndex + 1]!, swapped[leftIndex]!];
  return swapped;
}

function expectWarningFragment(warnings: readonly string[], fragment: string, label: string) {
  expect(
    warnings.some((warning) => warning.includes(fragment)),
    `${label} should include warning fragment: ${fragment}`
  ).toBe(true);
}

describe("dynamic route stability contracts", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubGlobal("localStorage", createMemoryStorage());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("stabilizes the reported five-layer duplicate jump on the workbench wall route", async () => {
    const { useWorkbenchStore } = await import("./workbench-store");

    useWorkbenchStore.getState().reset();
    useWorkbenchStore.getState().startStudyMode("wall");
    useWorkbenchStore.getState().setCalculatorId("dynamic");
    useWorkbenchStore.getState().appendRows(DUPLICATE_STACK);

    const base = snapshot(evaluateDynamicWall(useWorkbenchStore.getState().rows, "wall-duplicate-base"));

    useWorkbenchStore.getState().appendRows(DUPLICATE_STACK);

    const duplicated = snapshot(evaluateDynamicWall(useWorkbenchStore.getState().rows, "wall-duplicate-changed"));

    expect({
      confidence: base.confidence,
      dnTw: base.dnTw,
      family: base.family,
      rw: base.rw,
      rwPrime: base.rwPrime,
      strategy: base.strategy
    }).toEqual({
      confidence: "medium",
      dnTw: 36,
      family: "masonry_nonhomogeneous",
      rw: 36,
      rwPrime: 34,
      strategy: "masonry_nonhomogeneous_blend+aac_massive_calibration+masonry_davy_cap"
    });
    expect({
      confidence: duplicated.confidence,
      dnTw: duplicated.dnTw,
      family: duplicated.family,
      rw: duplicated.rw,
      rwPrime: duplicated.rwPrime,
      strategy: duplicated.strategy
    }).toEqual({
      confidence: "low",
      dnTw: 48,
      family: "double_leaf",
      rw: 48,
      rwPrime: 47,
      strategy: "double_leaf_porous_fill_delegate+heavy_unframed_cavity_cap"
    });
    expect(duplicated.rw - base.rw).toBeLessThanOrEqual(12);
    expect(duplicated.rwPrime - base.rwPrime).toBeLessThanOrEqual(13);
    expect(duplicated.dnTw - base.dnTw).toBeLessThanOrEqual(12);
    expectWarningFragment(duplicated.warnings, "heavy unframed cavity cap was applied", "duplicated stack");
  });

  it("reclassifies the light-lining reorder case onto the lined-massive lane instead of the old optimistic double-leaf lane", async () => {
    const { useWorkbenchStore } = await import("./workbench-store");

    useWorkbenchStore.getState().reset();
    useWorkbenchStore.getState().startStudyMode("wall");
    useWorkbenchStore.getState().setCalculatorId("dynamic");
    useWorkbenchStore.getState().appendRows(MOVE_STACK);

    const base = snapshot(evaluateDynamicWall(useWorkbenchStore.getState().rows, "wall-move-base"));
    const movableRowId = useWorkbenchStore.getState().rows[1]!.id;

    useWorkbenchStore.getState().moveRow(movableRowId, "up");

    const moved = snapshot(evaluateDynamicWall(useWorkbenchStore.getState().rows, "wall-move-changed"));

    expect({
      confidence: base.confidence,
      dnTw: base.dnTw,
      family: base.family,
      notes: base.notes,
      rw: base.rw,
      rwPrime: base.rwPrime,
      strategy: base.strategy
    }).toEqual({
      confidence: "low",
      dnTw: 48,
      family: "lined_massive_wall",
      notes: expect.arrayContaining([expect.stringMatching(/ambiguity hold trimmed/i)]),
      rw: 49,
      rwPrime: 47,
      strategy: "lined_massive_blend+reinforcement_monotonic_floor+family_boundary_hold"
    });
    expect({
      confidence: moved.confidence,
      dnTw: moved.dnTw,
      family: moved.family,
      rw: moved.rw,
      rwPrime: moved.rwPrime,
      strategy: moved.strategy
    }).toEqual({
      confidence: "medium",
      dnTw: 37,
      family: "masonry_nonhomogeneous",
      rw: 37,
      rwPrime: 35,
      strategy: "masonry_nonhomogeneous_blend+aac_massive_calibration+masonry_davy_cap"
    });
    expect(base.rw - moved.rw).toBeLessThanOrEqual(13);
    expect(base.rwPrime - moved.rwPrime).toBeLessThanOrEqual(13);
    expect(base.dnTw - moved.dnTw).toBeLessThanOrEqual(12);
    expectWarningFragment(base.warnings, "family-boundary hold was applied", "move base");
  });

  it("keeps duplicate-handling stable across equivalent compliant-layer variants entered one row at a time", async () => {
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

      expect(
        {
          confidence: base.confidence,
          dnTw: base.dnTw,
          family: base.family,
          rw: base.rw,
          rwPrime: base.rwPrime,
          strategy: base.strategy
        },
        `${variant.name} base`
      ).toEqual(variant.base);
      expect(
        {
          confidence: duplicated.confidence,
          dnTw: duplicated.dnTw,
          family: duplicated.family,
          rw: duplicated.rw,
          rwPrime: duplicated.rwPrime,
          strategy: duplicated.strategy
        },
        `${variant.name} duplicated`
      ).toEqual(variant.duplicated);
      expect(duplicated.rw - base.rw, `${variant.name} lab jump`).toBeLessThanOrEqual(12);
      expect(duplicated.rwPrime - base.rwPrime, `${variant.name} field R'w jump`).toBeLessThanOrEqual(14);
      expect(duplicated.dnTw - base.dnTw, `${variant.name} field DnT,w jump`).toBeLessThanOrEqual(13);
      expectWarningFragment(duplicated.warnings, "heavy unframed cavity cap was applied", `${variant.name} duplicated`);
    }
  });

  it("holds adjacent-swap deltas inside the guarded band on ambiguous workbench wall stacks", () => {
    for (const testCase of ADJACENT_SWAP_CASES) {
      const base = snapshot(evaluateDynamicWall(buildRows(testCase.stack, `${testCase.name}-base`), `${testCase.name}-base`));
      const changed = snapshot(
        evaluateDynamicWall(buildRows(swapAdjacent(testCase.stack, testCase.swapIndex), `${testCase.name}-changed`), `${testCase.name}-changed`)
      );

      expect(
        {
          confidence: base.confidence,
          dnTw: base.dnTw,
          family: base.family,
          notes: base.notes,
          rw: base.rw,
          rwPrime: base.rwPrime,
          strategy: base.strategy
        },
        `${testCase.name} base`
      ).toEqual({
        ...testCase.base,
        notes: base.family === "lined_massive_wall"
          ? expect.arrayContaining([expect.stringMatching(/ambiguity hold trimmed/i)])
          : base.notes
      });
      expect(
        {
          confidence: changed.confidence,
          dnTw: changed.dnTw,
          family: changed.family,
          notes: changed.notes,
          rw: changed.rw,
          rwPrime: changed.rwPrime,
          strategy: changed.strategy
        },
        `${testCase.name} changed`
      ).toEqual({
        ...testCase.changed,
        notes: changed.family === "lined_massive_wall"
          ? expect.arrayContaining([expect.stringMatching(/ambiguity hold trimmed/i)])
          : changed.notes
      });
      expect(Math.abs(changed.rw - base.rw), `${testCase.name} lab delta`).toBeLessThanOrEqual(testCase.maxRwDelta);
      expect(Math.abs(changed.rwPrime - base.rwPrime), `${testCase.name} field R'w delta`).toBeLessThanOrEqual(
        testCase.maxRwPrimeDelta
      );
      expect(Math.abs(changed.dnTw - base.dnTw), `${testCase.name} field DnT,w delta`).toBeLessThanOrEqual(testCase.maxDnTwDelta);
      if (base.family === "lined_massive_wall") {
        expectWarningFragment(base.warnings, "family-boundary hold was applied", `${testCase.name} base`);
      }
      if (changed.family === "lined_massive_wall") {
        expectWarningFragment(changed.warnings, "family-boundary hold was applied", `${testCase.name} changed`);
      }
    }
  });

  it("keeps deeper hybrid workbench stacks inside conservative duplicate and swap ranges", () => {
    for (const testCase of COMPLEX_STACK_CASES) {
      const base = snapshot(evaluateDynamicWall(buildRows(testCase.stack, `${testCase.name}-base`), `${testCase.name}-base`));
      const swapped = snapshot(
        evaluateDynamicWall(buildRows(swapAdjacent(testCase.stack, testCase.swapIndex), `${testCase.name}-swapped`), `${testCase.name}-swapped`)
      );
      const duplicated = snapshot(
        evaluateDynamicWall(buildRows([...testCase.stack, ...testCase.stack], `${testCase.name}-duplicated`), `${testCase.name}-duplicated`)
      );

      expect({
        confidence: base.confidence,
        dnTw: base.dnTw,
        family: base.family,
        rw: base.rw,
        rwPrime: base.rwPrime,
        strategy: base.strategy
      }).toEqual(testCase.base);
      expect({
        confidence: swapped.confidence,
        dnTw: swapped.dnTw,
        family: swapped.family,
        rw: swapped.rw,
        rwPrime: swapped.rwPrime,
        strategy: swapped.strategy
      }).toEqual(testCase.swapped);
      expect({
        confidence: duplicated.confidence,
        dnTw: duplicated.dnTw,
        family: duplicated.family,
        rw: duplicated.rw,
        rwPrime: duplicated.rwPrime,
        strategy: duplicated.strategy
      }).toEqual(testCase.duplicated);
      expect(Math.abs(swapped.rw - base.rw), `${testCase.name} swap lab delta`).toBeLessThanOrEqual(0);
      expect(Math.abs(swapped.rwPrime - base.rwPrime), `${testCase.name} swap field R'w delta`).toBeLessThanOrEqual(0);
      expect(Math.abs(swapped.dnTw - base.dnTw), `${testCase.name} swap field DnT,w delta`).toBeLessThanOrEqual(0);
      expect(duplicated.rw - base.rw, `${testCase.name} duplicate lab delta`).toBeLessThanOrEqual(testCase.maxRwDelta);
      expect(duplicated.rwPrime - base.rwPrime, `${testCase.name} duplicate field R'w delta`).toBeLessThanOrEqual(
        testCase.maxRwPrimeDelta
      );
      expect(duplicated.dnTw - base.dnTw, `${testCase.name} duplicate field DnT,w delta`).toBeLessThanOrEqual(testCase.maxDnTwDelta);
    }
  });
});
