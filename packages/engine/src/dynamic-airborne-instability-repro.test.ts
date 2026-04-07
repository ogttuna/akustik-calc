import { describe, expect, it } from "vitest";

import type { AirborneContext, LayerInput } from "@dynecho/shared";

import { calculateAssembly } from "./calculate-assembly";

const LAB_CONTEXT: AirborneContext = {
  airtightness: "good",
  connectionType: "line_connection",
  contextMode: "element_lab",
  studSpacingMm: 600,
  studType: "light_steel_stud"
};

const FIELD_CONTEXT: AirborneContext = {
  airtightness: "good",
  connectionType: "line_connection",
  contextMode: "building_prediction",
  electricalBoxes: "none",
  junctionQuality: "good",
  panelHeightMm: 2800,
  panelWidthMm: 3600,
  penetrationState: "none",
  perimeterSeal: "good",
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 45,
  sharedTrack: "independent",
  studSpacingMm: 600,
  studType: "light_steel_stud"
};

const WORKBENCH_LAB_CONTEXT: AirborneContext = {
  contextMode: "element_lab"
};

const WORKBENCH_FIELD_CONTEXT: AirborneContext = {
  contextMode: "building_prediction",
  panelHeightMm: 2800,
  panelWidthMm: 3600,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 45
};

const EXPLICIT_DUPLICATE_STACK: readonly LayerInput[] = [
  { materialId: "concrete", thicknessMm: 80 },
  { materialId: "pumice_block", thicknessMm: 100 },
  { materialId: "air_gap", thicknessMm: 50 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "concrete", thicknessMm: 80 }
];

const EXPLICIT_MOVE_STACK: readonly LayerInput[] = [
  { materialId: "air_gap", thicknessMm: 50 },
  { materialId: "concrete", thicknessMm: 80 },
  { materialId: "ytong_aac_d700", thicknessMm: 100 },
  { materialId: "concrete", thicknessMm: 80 },
  { materialId: "firestop_board", thicknessMm: 15 }
];

const WORKBENCH_DUPLICATE_STACK: readonly LayerInput[] = [
  { materialId: "rockwool", thicknessMm: 50 },
  { materialId: "rockwool", thicknessMm: 50 },
  { materialId: "security_board", thicknessMm: 12.5 },
  { materialId: "ytong_aac_d700", thicknessMm: 100 },
  { materialId: "air_gap", thicknessMm: 50 }
];

const WORKBENCH_MOVE_STACK: readonly LayerInput[] = [
  { materialId: "security_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 50 },
  { materialId: "security_board", thicknessMm: 12.5 },
  { materialId: "ytong_aac_d700", thicknessMm: 100 },
  { materialId: "rockwool", thicknessMm: 50 }
];

const EXPLICIT_DUPLICATE_VARIANTS = [
  {
    base: {
      dnTw: 27,
      family: "stud_wall_system",
      rw: 34,
      rwPrime: 26,
      strategy: "stud_surrogate_blend+framed_wall_calibration"
    },
    duplicated: {
      dnTw: 59,
      family: "multileaf_multicavity",
      rw: 66,
      rwPrime: 58,
      strategy: "multileaf_screening_blend"
    },
    name: "base",
    stack: EXPLICIT_DUPLICATE_STACK
  },
  {
    base: {
      dnTw: 27,
      family: "stud_wall_system",
      rw: 34,
      rwPrime: 26,
      strategy: "stud_surrogate_blend+framed_wall_calibration"
    },
    duplicated: {
      dnTw: 59,
      family: "multileaf_multicavity",
      rw: 66,
      rwPrime: 58,
      strategy: "multileaf_screening_blend"
    },
    name: "leading-gap",
    stack: [{ materialId: "air_gap", thicknessMm: 25 }, ...EXPLICIT_DUPLICATE_STACK]
  },
  {
    base: {
      dnTw: 27,
      family: "stud_wall_system",
      rw: 34,
      rwPrime: 26,
      strategy: "stud_surrogate_blend+framed_wall_calibration"
    },
    duplicated: {
      dnTw: 59,
      family: "multileaf_multicavity",
      rw: 66,
      rwPrime: 58,
      strategy: "multileaf_screening_blend"
    },
    name: "trailing-wool",
    stack: [...EXPLICIT_DUPLICATE_STACK, { materialId: "rockwool", thicknessMm: 25 }]
  }
] as const;

const WORKBENCH_ADJACENT_SWAP_CASES = [
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
    name: "duplicate stack swap 2<->3",
    stack: WORKBENCH_DUPLICATE_STACK,
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
    name: "duplicate stack swap 4<->5",
    stack: WORKBENCH_DUPLICATE_STACK,
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
    name: "move stack swap 1<->2",
    stack: WORKBENCH_MOVE_STACK,
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
    name: "move stack swap 4<->5",
    stack: WORKBENCH_MOVE_STACK,
    swapIndex: 3
  }
] as const;

function calculateDynamicWall(layers: readonly LayerInput[], airborneContext: AirborneContext) {
  return calculateAssembly(layers, {
    airborneContext,
    calculator: "dynamic",
    targetOutputs: airborneContext.contextMode === "element_lab" ? ["Rw"] : ["R'w", "DnT,w"]
  });
}

function snapshot(lab: ReturnType<typeof calculateDynamicWall>, field: ReturnType<typeof calculateDynamicWall>) {
  return {
    dnTw: field.metrics.estimatedDnTwDb,
    family: field.dynamicAirborneTrace?.detectedFamily ?? lab.dynamicAirborneTrace?.detectedFamily ?? null,
    rw: lab.metrics.estimatedRwDb,
    rwPrime: field.metrics.estimatedRwPrimeDb,
    strategy: field.dynamicAirborneTrace?.strategy ?? lab.dynamicAirborneTrace?.strategy ?? null
  };
}

function snapshotPair(
  layers: readonly LayerInput[],
  contexts: {
    field: AirborneContext;
    lab: AirborneContext;
  }
) {
  return snapshot(calculateDynamicWall(layers, contexts.lab), calculateDynamicWall(layers, contexts.field));
}

function swapAdjacent(stack: readonly LayerInput[], leftIndex: number) {
  const swapped = [...stack];
  [swapped[leftIndex], swapped[leftIndex + 1]] = [swapped[leftIndex + 1]!, swapped[leftIndex]!];
  return swapped;
}

describe("dynamic airborne instability reproductions", () => {
  it("reproduces the explicit-metadata duplicate jump that flips the family to multileaf", () => {
    const baseLab = calculateDynamicWall(EXPLICIT_DUPLICATE_STACK, LAB_CONTEXT);
    const baseField = calculateDynamicWall(EXPLICIT_DUPLICATE_STACK, FIELD_CONTEXT);
    const duplicatedLayers = [...EXPLICIT_DUPLICATE_STACK, ...EXPLICIT_DUPLICATE_STACK];
    const duplicatedLab = calculateDynamicWall(duplicatedLayers, LAB_CONTEXT);
    const duplicatedField = calculateDynamicWall(duplicatedLayers, FIELD_CONTEXT);

    const base = snapshot(baseLab, baseField);
    const duplicated = snapshot(duplicatedLab, duplicatedField);

    expect(base).toEqual({
      dnTw: 27,
      family: "stud_wall_system",
      rw: 34,
      rwPrime: 26,
      strategy: "stud_surrogate_blend+framed_wall_calibration"
    });
    expect(duplicated).toEqual({
      dnTw: 59,
      family: "multileaf_multicavity",
      rw: 66,
      rwPrime: 58,
      strategy: "multileaf_screening_blend"
    });
    expect(duplicated.rw - base.rw).toBeGreaterThanOrEqual(30);
    expect(duplicated.rwPrime - base.rwPrime).toBeGreaterThanOrEqual(30);
    expect(duplicated.dnTw - base.dnTw).toBeGreaterThanOrEqual(30);
  });

  it("reproduces the explicit-metadata move jump that flips the family back to the stud lane", () => {
    const baseLab = calculateDynamicWall(EXPLICIT_MOVE_STACK, LAB_CONTEXT);
    const baseField = calculateDynamicWall(EXPLICIT_MOVE_STACK, FIELD_CONTEXT);
    const movedLayers = [
      EXPLICIT_MOVE_STACK[1]!,
      EXPLICIT_MOVE_STACK[0]!,
      EXPLICIT_MOVE_STACK[2]!,
      EXPLICIT_MOVE_STACK[3]!,
      EXPLICIT_MOVE_STACK[4]!
    ];
    const movedLab = calculateDynamicWall(movedLayers, LAB_CONTEXT);
    const movedField = calculateDynamicWall(movedLayers, FIELD_CONTEXT);

    const base = snapshot(baseLab, baseField);
    const moved = snapshot(movedLab, movedField);

    expect(base).toEqual({
      dnTw: 54,
      family: "masonry_nonhomogeneous",
      rw: 61,
      rwPrime: 53,
      strategy: "masonry_nonhomogeneous_blend+aac_massive_calibration+masonry_davy_cap"
    });
    expect(moved).toEqual({
      dnTw: 27,
      family: "stud_wall_system",
      rw: 34,
      rwPrime: 26,
      strategy: "stud_surrogate_blend+framed_wall_calibration"
    });
    expect(base.rw - moved.rw).toBeGreaterThanOrEqual(25);
    expect(base.rwPrime - moved.rwPrime).toBeGreaterThanOrEqual(25);
    expect(base.dnTw - moved.dnTw).toBeGreaterThanOrEqual(25);
  });

  it("reproduces the explicit duplicate handoff across equivalent outer compliant-layer variants", () => {
    for (const variant of EXPLICIT_DUPLICATE_VARIANTS) {
      const base = snapshotPair(variant.stack, {
        field: FIELD_CONTEXT,
        lab: LAB_CONTEXT
      });
      const duplicated = snapshotPair([...variant.stack, ...variant.stack], {
        field: FIELD_CONTEXT,
        lab: LAB_CONTEXT
      });

      expect(base, `${variant.name} base`).toEqual(variant.base);
      expect(duplicated, `${variant.name} duplicated`).toEqual(variant.duplicated);
      expect(duplicated.rw - base.rw, `${variant.name} lab jump`).toBeGreaterThanOrEqual(30);
      expect(duplicated.rwPrime - base.rwPrime, `${variant.name} field R'w jump`).toBeGreaterThanOrEqual(30);
      expect(duplicated.dnTw - base.dnTw, `${variant.name} field DnT,w jump`).toBeGreaterThanOrEqual(30);
    }
  });

  it("captures an adjacent-swap instability matrix on workbench-like ambiguous stacks at engine level", () => {
    for (const testCase of WORKBENCH_ADJACENT_SWAP_CASES) {
      const base = snapshotPair(testCase.stack, {
        field: WORKBENCH_FIELD_CONTEXT,
        lab: WORKBENCH_LAB_CONTEXT
      });
      const changed = snapshotPair(swapAdjacent(testCase.stack, testCase.swapIndex), {
        field: WORKBENCH_FIELD_CONTEXT,
        lab: WORKBENCH_LAB_CONTEXT
      });

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
