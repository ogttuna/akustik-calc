import { describe, expect, it } from "vitest";

import type { AirborneContext, LayerInput } from "@dynecho/shared";

import { calculateAssembly } from "./calculate-assembly";

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

const TRIPLE_LEAF_VARIANTS = [
  {
    base: {
      confidence: "low",
      dnTw: 31,
      family: "multileaf_multicavity",
      rw: 32,
      rwPrime: 30,
      strategy: "multileaf_screening_blend"
    },
    name: "gypsum",
    stack: CLASSIC_TRIPLE_LEAF_STACK,
    swapped: {
      confidence: "medium",
      dnTw: 44,
      family: "double_leaf",
      rw: 44,
      rwPrime: 42,
      strategy: "double_leaf_porous_fill_delegate"
    }
  },
  {
    base: {
      confidence: "low",
      dnTw: 33,
      family: "multileaf_multicavity",
      rw: 33,
      rwPrime: 31,
      strategy: "multileaf_screening_blend"
    },
    name: "firestop",
    stack: [
      { materialId: "firestop_board", thicknessMm: 15 },
      { materialId: "rockwool", thicknessMm: 50 },
      { materialId: "gypsum_board", thicknessMm: 12.5 },
      { materialId: "air_gap", thicknessMm: 50 },
      { materialId: "firestop_board", thicknessMm: 15 }
    ] as const,
    swapped: {
      confidence: "medium",
      dnTw: 45,
      family: "double_leaf",
      rw: 45,
      rwPrime: 43,
      strategy: "double_leaf_porous_fill_delegate"
    }
  },
  {
    base: {
      confidence: "low",
      dnTw: 33,
      family: "multileaf_multicavity",
      rw: 33,
      rwPrime: 31,
      strategy: "multileaf_screening_blend"
    },
    name: "diamond",
    stack: [
      { materialId: "diamond_board", thicknessMm: 12.5 },
      { materialId: "rockwool", thicknessMm: 50 },
      { materialId: "gypsum_board", thicknessMm: 12.5 },
      { materialId: "air_gap", thicknessMm: 50 },
      { materialId: "diamond_board", thicknessMm: 12.5 }
    ] as const,
    swapped: {
      confidence: "medium",
      dnTw: 45,
      family: "double_leaf",
      rw: 45,
      rwPrime: 43,
      strategy: "double_leaf_porous_fill_delegate"
    }
  }
] as const;

function calculateDynamicWall(layers: readonly LayerInput[], airborneContext: AirborneContext) {
  return calculateAssembly(layers, {
    airborneContext,
    calculator: "dynamic",
    targetOutputs: airborneContext.contextMode === "element_lab" ? ["Rw"] : ["R'w", "DnT,w"]
  });
}

function snapshot(layers: readonly LayerInput[]) {
  const lab = calculateDynamicWall(layers, LAB_CONTEXT);
  const field = calculateDynamicWall(layers, FIELD_CONTEXT);

  return {
    confidence: field.dynamicAirborneTrace?.confidenceClass ?? lab.dynamicAirborneTrace?.confidenceClass ?? null,
    dnTw: field.metrics.estimatedDnTwDb,
    family: field.dynamicAirborneTrace?.detectedFamily ?? lab.dynamicAirborneTrace?.detectedFamily ?? null,
    notes: field.dynamicAirborneTrace?.notes ?? [],
    rw: lab.metrics.estimatedRwDb,
    rwPrime: field.metrics.estimatedRwPrimeDb,
    strategy: field.dynamicAirborneTrace?.strategy ?? lab.dynamicAirborneTrace?.strategy ?? null,
    warnings: field.warnings
  };
}

function swapInnerLeaf(stack: readonly LayerInput[]) {
  const swapped = [...stack];
  [swapped[1], swapped[2]] = [swapped[2]!, swapped[1]!];
  return swapped;
}

function expectFragment(items: readonly string[], fragment: string, label: string) {
  expect(items.some((item) => item.includes(fragment)), `${label} should include ${fragment}`).toBe(true);
}

describe("dynamic airborne order-sensitive multileaf contracts", () => {
  it("marks classic lightweight triple-leaf stacks as intentionally order-sensitive", () => {
    const base = snapshot(CLASSIC_TRIPLE_LEAF_STACK);
    const duplicated = snapshot([...CLASSIC_TRIPLE_LEAF_STACK, ...CLASSIC_TRIPLE_LEAF_STACK]);

    expect({
      confidence: base.confidence,
      dnTw: base.dnTw,
      family: base.family,
      rw: base.rw,
      rwPrime: base.rwPrime,
      strategy: base.strategy
    }).toEqual({
      confidence: "low",
      dnTw: 31,
      family: "multileaf_multicavity",
      rw: 32,
      rwPrime: 30,
      strategy: "multileaf_screening_blend"
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
      dnTw: 38,
      family: "multileaf_multicavity",
      rw: 37,
      rwPrime: 37,
      strategy: "multileaf_screening_blend"
    });
    expectFragment(base.warnings, "triple-leaf partition", "classic triple-leaf warning");
    expectFragment(base.notes, "triple-leaf partition", "classic triple-leaf note");
    expectFragment(duplicated.warnings, "intentionally order-sensitive", "duplicated multileaf warning");
  });

  it("keeps lightweight triple-leaf reorder jumps explicit instead of silently smoothing them away", () => {
    for (const variant of TRIPLE_LEAF_VARIANTS) {
      const base = snapshot(variant.stack);
      const swapped = snapshot(swapInnerLeaf(variant.stack));

      expect({
        confidence: base.confidence,
        dnTw: base.dnTw,
        family: base.family,
        rw: base.rw,
        rwPrime: base.rwPrime,
        strategy: base.strategy
      }).toEqual(variant.base);
      expect({
        confidence: swapped.confidence,
        dnTw: swapped.dnTw,
        family: swapped.family,
        rw: swapped.rw,
        rwPrime: swapped.rwPrime,
        strategy: swapped.strategy
      }).toEqual(variant.swapped);
      expect(swapped.rw - base.rw, `${variant.name} lab delta`).toBeGreaterThanOrEqual(12);
      expect(swapped.rwPrime - base.rwPrime, `${variant.name} field R'w delta`).toBeGreaterThanOrEqual(12);
      expect(swapped.dnTw - base.dnTw, `${variant.name} field DnT,w delta`).toBeGreaterThanOrEqual(12);
      expectFragment(base.warnings, "triple-leaf partition", `${variant.name} base warning`);
      expect(
        swapped.warnings.some((warning) => warning.includes("triple-leaf partition")),
        `${variant.name} swapped should not stay on the triple-leaf warning`
      ).toBe(false);
    }
  });

  it("marks heavier multi-leaf cavity stacks as order-sensitive and keeps that posture after duplication", () => {
    const base = snapshot(HEAVY_MULTILEAF_STACK);
    const swapped = snapshot(swapInnerLeaf(HEAVY_MULTILEAF_STACK));
    const duplicated = snapshot([...HEAVY_MULTILEAF_STACK, ...HEAVY_MULTILEAF_STACK]);

    expect({
      confidence: base.confidence,
      dnTw: base.dnTw,
      family: base.family,
      rw: base.rw,
      rwPrime: base.rwPrime,
      strategy: base.strategy
    }).toEqual({
      confidence: "low",
      dnTw: 39,
      family: "multileaf_multicavity",
      rw: 39,
      rwPrime: 37,
      strategy: "multileaf_screening_blend"
    });
    expect({
      confidence: swapped.confidence,
      dnTw: swapped.dnTw,
      family: swapped.family,
      rw: swapped.rw,
      rwPrime: swapped.rwPrime,
      strategy: swapped.strategy
    }).toEqual({
      confidence: "low",
      dnTw: 48,
      family: "lined_massive_wall",
      rw: 49,
      rwPrime: 47,
      strategy: "lined_massive_blend+reinforcement_monotonic_floor+family_boundary_hold"
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
      dnTw: 47,
      family: "multileaf_multicavity",
      rw: 46,
      rwPrime: 45,
      strategy: "multileaf_screening_blend"
    });
    expect(swapped.rw - base.rw).toBeGreaterThanOrEqual(10);
    expect(swapped.rwPrime - base.rwPrime).toBeGreaterThanOrEqual(10);
    expect(swapped.dnTw - base.dnTw).toBeGreaterThanOrEqual(9);
    expectFragment(base.warnings, "intentionally order-sensitive", "heavy multileaf warning");
    expectFragment(base.notes, "intentionally order-sensitive", "heavy multileaf note");
    expectFragment(swapped.warnings, "boundary between Lined Massive Wall and Double Leaf", "heavy swapped boundary warning");
    expectFragment(swapped.warnings, "family-boundary hold was applied", "heavy swapped hold warning");
    expectFragment(swapped.notes, "ambiguity hold trimmed", "heavy swapped hold note");
    expectFragment(duplicated.warnings, "intentionally order-sensitive", "heavy duplicated warning");
  });
});
