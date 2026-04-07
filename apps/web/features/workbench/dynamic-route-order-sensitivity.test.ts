import type { AirborneContext, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

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

const CLASSIC_TRIPLE_LEAF_STACK = [
  { materialId: "gypsum_board", thicknessMm: "12.5" },
  { materialId: "rockwool", thicknessMm: "50" },
  { materialId: "gypsum_board", thicknessMm: "12.5" },
  { materialId: "air_gap", thicknessMm: "50" },
  { materialId: "gypsum_board", thicknessMm: "12.5" }
] as const;

const HEAVY_MULTILEAF_STACK = [
  { materialId: "gypsum_board", thicknessMm: "12.5" },
  { materialId: "rockwool", thicknessMm: "25" },
  { materialId: "ytong_aac_d700", thicknessMm: "100" },
  { materialId: "air_gap", thicknessMm: "50" },
  { materialId: "diamond_board", thicknessMm: "12.5" }
] as const;

function buildRows(
  stack: readonly { materialId: string; thicknessMm: string }[],
  prefix: string
) {
  return stack.map((layer, index) => ({
    ...layer,
    id: `${prefix}-${index + 1}`
  }));
}

function evaluateDynamicWall(
  stack: readonly { materialId: string; thicknessMm: string }[],
  id: string
) {
  const rows = buildRows(stack, id);
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

  expect(lab.result?.ok, `${id} lab should stay ok`).toBe(true);
  expect(field.result?.ok, `${id} field should stay ok`).toBe(true);

  return {
    confidence:
      field.result!.dynamicAirborneTrace?.confidenceClass ??
      lab.result!.dynamicAirborneTrace?.confidenceClass ??
      null,
    dnTw: field.result!.metrics.estimatedDnTwDb,
    family:
      field.result!.dynamicAirborneTrace?.detectedFamily ??
      lab.result!.dynamicAirborneTrace?.detectedFamily ??
      null,
    notes: field.result!.dynamicAirborneTrace?.notes ?? [],
    rw: lab.result!.metrics.estimatedRwDb,
    rwPrime: field.result!.metrics.estimatedRwPrimeDb,
    strategy:
      field.result!.dynamicAirborneTrace?.strategy ??
      lab.result!.dynamicAirborneTrace?.strategy ??
      null,
    warnings: field.result!.warnings
  };
}

function swapInnerLeaf(
  stack: readonly { materialId: string; thicknessMm: string }[]
) {
  const swapped = [...stack];
  [swapped[1], swapped[2]] = [swapped[2]!, swapped[1]!];
  return swapped;
}

function expectFragment(items: readonly string[], fragment: string, label: string) {
  expect(items.some((item) => item.includes(fragment)), `${label} should include ${fragment}`).toBe(true);
}

describe("dynamic route order-sensitive multileaf contracts", () => {
  it("surfaces a dedicated triple-leaf warning for classic lightweight workbench stacks", () => {
    const base = evaluateDynamicWall(CLASSIC_TRIPLE_LEAF_STACK, "classic-triple");

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
    expectFragment(base.warnings, "triple-leaf partition", "classic workbench triple-leaf warning");
    expectFragment(base.notes, "triple-leaf partition", "classic workbench triple-leaf note");
  });

  it("keeps the classic workbench triple-leaf reorder jump explicit and labelled as order-sensitive", () => {
    const base = evaluateDynamicWall(CLASSIC_TRIPLE_LEAF_STACK, "classic-triple-base");
    const swapped = evaluateDynamicWall(swapInnerLeaf(CLASSIC_TRIPLE_LEAF_STACK), "classic-triple-swapped");

    expect({
      confidence: swapped.confidence,
      dnTw: swapped.dnTw,
      family: swapped.family,
      rw: swapped.rw,
      rwPrime: swapped.rwPrime,
      strategy: swapped.strategy
    }).toEqual({
      confidence: "medium",
      dnTw: 44,
      family: "double_leaf",
      rw: 44,
      rwPrime: 42,
      strategy: "double_leaf_porous_fill_delegate"
    });
    expect(swapped.rw - base.rw).toBeGreaterThanOrEqual(12);
    expect(swapped.rwPrime - base.rwPrime).toBeGreaterThanOrEqual(12);
    expect(swapped.dnTw - base.dnTw).toBeGreaterThanOrEqual(12);
    expectFragment(base.warnings, "triple-leaf partition", "classic triple base warning");
    expect(
      swapped.warnings.some((warning) => warning.includes("triple-leaf partition")),
      "collapsed swap should no longer report the triple-leaf warning"
    ).toBe(false);
  });

  it("marks heavier workbench multi-leaf stacks as intentionally order-sensitive without pretending they are framed or stable", () => {
    const base = evaluateDynamicWall(HEAVY_MULTILEAF_STACK, "heavy-multileaf-base");
    const swapped = evaluateDynamicWall(swapInnerLeaf(HEAVY_MULTILEAF_STACK), "heavy-multileaf-swapped");
    const duplicated = evaluateDynamicWall([...HEAVY_MULTILEAF_STACK, ...HEAVY_MULTILEAF_STACK], "heavy-multileaf-duplicated");

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
      dnTw: 50,
      family: "lined_massive_wall",
      rw: 51,
      rwPrime: 49,
      strategy: "lined_massive_blend+reinforcement_monotonic_floor"
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
    expect(swapped.family).not.toBe("stud_wall_system");
    expect(duplicated.family).not.toBe("stud_wall_system");
    expectFragment(base.warnings, "intentionally order-sensitive", "heavy multileaf workbench warning");
    expectFragment(swapped.warnings, "boundary between Lined Massive Wall and Double Leaf", "heavy multileaf swapped boundary warning");
    expectFragment(duplicated.warnings, "intentionally order-sensitive", "heavy duplicated workbench warning");
  });
});
