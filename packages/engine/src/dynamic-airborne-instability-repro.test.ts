import { describe, expect, it } from "vitest";

import type { AirborneContext, LayerInput } from "@dynecho/shared";

import { calculateAssembly } from "./calculate-assembly";

const EXPLICIT_LAB_CONTEXT: AirborneContext = {
  airtightness: "good",
  connectionType: "line_connection",
  contextMode: "element_lab",
  studSpacingMm: 600,
  studType: "light_steel_stud"
};

const EXPLICIT_FIELD_CONTEXT: AirborneContext = {
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
      confidence: "low",
      dnTw: 55,
      family: "double_leaf",
      rw: 63,
      rwPrime: 54,
      strategy: "double_leaf_empty_cavity_delegate+heavy_unframed_cavity_cap"
    },
    duplicated: {
      confidence: "low",
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
      confidence: "low",
      dnTw: 55,
      family: "double_leaf",
      rw: 63,
      rwPrime: 54,
      strategy: "double_leaf_empty_cavity_delegate+heavy_unframed_cavity_cap"
    },
    duplicated: {
      confidence: "low",
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
      confidence: "low",
      dnTw: 55,
      family: "double_leaf",
      rw: 63,
      rwPrime: 54,
      strategy: "double_leaf_empty_cavity_delegate+heavy_unframed_cavity_cap"
    },
    duplicated: {
      confidence: "low",
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
      confidence: "medium",
      dnTw: 36,
      family: "masonry_nonhomogeneous",
      rw: 36,
      rwPrime: 34,
      strategy: "masonry_nonhomogeneous_blend+aac_massive_calibration+masonry_davy_cap"
    },
    changed: {
      confidence: "low",
      dnTw: 49,
      family: "lined_massive_wall",
      rw: 49,
      rwPrime: 48,
      strategy: "lined_massive_blend+reinforcement_monotonic_floor"
    },
    maxDnTwDelta: 13,
    maxRwDelta: 13,
    maxRwPrimeDelta: 14,
    name: "duplicate stack swap 2<->3",
    stack: WORKBENCH_DUPLICATE_STACK,
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
      dnTw: 48,
      family: "lined_massive_wall",
      rw: 49,
      rwPrime: 46,
      strategy: "lined_massive_blend+reinforcement_monotonic_floor"
    },
    maxDnTwDelta: 12,
    maxRwDelta: 13,
    maxRwPrimeDelta: 12,
    name: "duplicate stack swap 4<->5",
    stack: WORKBENCH_DUPLICATE_STACK,
    swapIndex: 3
  },
  {
    base: {
      confidence: "low",
      dnTw: 49,
      family: "lined_massive_wall",
      rw: 50,
      rwPrime: 48,
      strategy: "lined_massive_blend+reinforcement_monotonic_floor"
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
    name: "move stack swap 1<->2",
    stack: WORKBENCH_MOVE_STACK,
    swapIndex: 0
  },
  {
    base: {
      confidence: "low",
      dnTw: 49,
      family: "lined_massive_wall",
      rw: 50,
      rwPrime: 48,
      strategy: "lined_massive_blend+reinforcement_monotonic_floor"
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
    name: "move stack swap 4<->5",
    stack: WORKBENCH_MOVE_STACK,
    swapIndex: 3
  }
] as const;

const DEEP_EXPLICIT_STACK_CASES = [
  {
    base: {
      confidence: "low",
      dnTw: 37,
      family: "multileaf_multicavity",
      rw: 44,
      rwPrime: 36,
      strategy: "multileaf_screening_blend"
    },
    duplicated: {
      confidence: "low",
      dnTw: 44,
      family: "multileaf_multicavity",
      rw: 51,
      rwPrime: 42,
      strategy: "multileaf_screening_blend+heavy_unframed_cavity_cap"
    },
    name: "hybrid-a-explicit",
    stack: [
      { materialId: "rockwool", thicknessMm: 25 },
      { materialId: "security_board", thicknessMm: 12.5 },
      { materialId: "air_gap", thicknessMm: 30 },
      { materialId: "ytong_aac_d700", thicknessMm: 75 },
      { materialId: "rockwool", thicknessMm: 40 },
      { materialId: "security_board", thicknessMm: 12.5 },
      { materialId: "air_gap", thicknessMm: 20 },
      { materialId: "firestop_board", thicknessMm: 15 },
      { materialId: "ytong_aac_d700", thicknessMm: 100 }
    ] as const,
    swapIndex: 6,
    swapped: {
      confidence: "low",
      dnTw: 37,
      family: "multileaf_multicavity",
      rw: 44,
      rwPrime: 36,
      strategy: "multileaf_screening_blend"
    }
  },
  {
    base: {
      confidence: "low",
      dnTw: 37,
      family: "multileaf_multicavity",
      rw: 44,
      rwPrime: 36,
      strategy: "multileaf_screening_blend"
    },
    duplicated: {
      confidence: "low",
      dnTw: 44,
      family: "multileaf_multicavity",
      rw: 51,
      rwPrime: 43,
      strategy: "multileaf_screening_blend"
    },
    name: "hybrid-b-explicit",
    stack: [
      { materialId: "cement_plaster", thicknessMm: 10 },
      { materialId: "ytong_aac_d700", thicknessMm: 100 },
      { materialId: "air_gap", thicknessMm: 25 },
      { materialId: "rockwool", thicknessMm: 50 },
      { materialId: "security_board", thicknessMm: 12.5 },
      { materialId: "air_gap", thicknessMm: 25 },
      { materialId: "rockwool", thicknessMm: 50 },
      { materialId: "security_board", thicknessMm: 12.5 },
      { materialId: "cement_plaster", thicknessMm: 10 }
    ] as const,
    swapIndex: 6,
    swapped: {
      confidence: "low",
      dnTw: 37,
      family: "multileaf_multicavity",
      rw: 44,
      rwPrime: 36,
      strategy: "multileaf_screening_blend"
    }
  },
  {
    base: {
      confidence: "low",
      dnTw: 52,
      family: "multileaf_multicavity",
      rw: 58,
      rwPrime: 50,
      strategy: "multileaf_screening_blend"
    },
    duplicated: {
      confidence: "low",
      dnTw: 58,
      family: "multileaf_multicavity",
      rw: 64,
      rwPrime: 56,
      strategy: "multileaf_screening_blend"
    },
    name: "explicit-heavy-hybrid",
    stack: [
      { materialId: "concrete", thicknessMm: 80 },
      { materialId: "air_gap", thicknessMm: 25 },
      { materialId: "rockwool", thicknessMm: 50 },
      { materialId: "firestop_board", thicknessMm: 15 },
      { materialId: "air_gap", thicknessMm: 25 },
      { materialId: "ytong_aac_d700", thicknessMm: 100 },
      { materialId: "concrete", thicknessMm: 80 },
      { materialId: "firestop_board", thicknessMm: 15 }
    ] as const,
    swapIndex: 5,
    swapped: {
      confidence: "low",
      dnTw: 52,
      family: "multileaf_multicavity",
      rw: 58,
      rwPrime: 50,
      strategy: "multileaf_screening_blend"
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

function snapshot(lab: ReturnType<typeof calculateDynamicWall>, field: ReturnType<typeof calculateDynamicWall>) {
  return {
    confidence: field.dynamicAirborneTrace?.confidenceClass ?? lab.dynamicAirborneTrace?.confidenceClass ?? null,
    dnTw: field.metrics.estimatedDnTwDb,
    family: field.dynamicAirborneTrace?.detectedFamily ?? lab.dynamicAirborneTrace?.detectedFamily ?? null,
    rw: lab.metrics.estimatedRwDb,
    rwPrime: field.metrics.estimatedRwPrimeDb,
    strategy: field.dynamicAirborneTrace?.strategy ?? lab.dynamicAirborneTrace?.strategy ?? null,
    warnings: field.warnings
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

function expectWarningFragment(warnings: readonly string[], fragment: string, label: string) {
  expect(
    warnings.some((warning) => warning.includes(fragment)),
    `${label} should include warning fragment: ${fragment}`
  ).toBe(true);
}

describe("dynamic airborne stability contracts", () => {
  it("suppresses hint-only stud promotion on heavy composite duplicate stacks", () => {
    const base = snapshotPair(EXPLICIT_DUPLICATE_STACK, {
      field: EXPLICIT_FIELD_CONTEXT,
      lab: EXPLICIT_LAB_CONTEXT
    });
    const duplicated = snapshotPair([...EXPLICIT_DUPLICATE_STACK, ...EXPLICIT_DUPLICATE_STACK], {
      field: EXPLICIT_FIELD_CONTEXT,
      lab: EXPLICIT_LAB_CONTEXT
    });

    expect({
      confidence: base.confidence,
      dnTw: base.dnTw,
      family: base.family,
      rw: base.rw,
      rwPrime: base.rwPrime,
      strategy: base.strategy
    }).toEqual({
      confidence: "low",
      dnTw: 55,
      family: "double_leaf",
      rw: 63,
      rwPrime: 54,
      strategy: "double_leaf_empty_cavity_delegate+heavy_unframed_cavity_cap"
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
      dnTw: 59,
      family: "multileaf_multicavity",
      rw: 66,
      rwPrime: 58,
      strategy: "multileaf_screening_blend"
    });
    expect(duplicated.rw - base.rw).toBeLessThanOrEqual(3);
    expect(duplicated.rwPrime - base.rwPrime).toBeLessThanOrEqual(4);
    expect(duplicated.dnTw - base.dnTw).toBeLessThanOrEqual(4);
    expectWarningFragment(
      base.warnings,
      "Explicit framed-wall metadata was not allowed to force the stud-wall lane",
      "explicit duplicate base"
    );
    expectWarningFragment(
      base.warnings,
      "heavy unframed cavity cap was applied",
      "explicit duplicate base"
    );
    expectWarningFragment(
      base.warnings,
      "boundary between Double Leaf and Lined Massive Wall",
      "explicit duplicate base"
    );
  });

  it("suppresses hint-only stud promotion on the move case while keeping the result inside a conservative cavity lane", () => {
    const base = snapshotPair(EXPLICIT_MOVE_STACK, {
      field: EXPLICIT_FIELD_CONTEXT,
      lab: EXPLICIT_LAB_CONTEXT
    });
    const moved = snapshotPair(
      [
        EXPLICIT_MOVE_STACK[1]!,
        EXPLICIT_MOVE_STACK[0]!,
        EXPLICIT_MOVE_STACK[2]!,
        EXPLICIT_MOVE_STACK[3]!,
        EXPLICIT_MOVE_STACK[4]!
      ],
      {
        field: EXPLICIT_FIELD_CONTEXT,
        lab: EXPLICIT_LAB_CONTEXT
      }
    );

    expect({
      confidence: base.confidence,
      dnTw: base.dnTw,
      family: base.family,
      rw: base.rw,
      rwPrime: base.rwPrime,
      strategy: base.strategy
    }).toEqual({
      confidence: "medium",
      dnTw: 54,
      family: "masonry_nonhomogeneous",
      rw: 61,
      rwPrime: 53,
      strategy: "masonry_nonhomogeneous_blend+aac_massive_calibration+masonry_davy_cap"
    });
    expect({
      confidence: moved.confidence,
      dnTw: moved.dnTw,
      family: moved.family,
      rw: moved.rw,
      rwPrime: moved.rwPrime,
      strategy: moved.strategy
    }).toEqual({
      confidence: "low",
      dnTw: 55,
      family: "double_leaf",
      rw: 62,
      rwPrime: 53,
      strategy: "double_leaf_empty_cavity_delegate+heavy_unframed_cavity_cap"
    });
    expect(Math.abs(base.rw - moved.rw)).toBeLessThanOrEqual(1);
    expect(Math.abs(base.rwPrime - moved.rwPrime)).toBeLessThanOrEqual(0);
    expect(Math.abs(base.dnTw - moved.dnTw)).toBeLessThanOrEqual(1);
    expectWarningFragment(
      moved.warnings,
      "Explicit framed-wall metadata was not allowed to force the stud-wall lane",
      "explicit move changed"
    );
    expectWarningFragment(
      moved.warnings,
      "boundary between Double Leaf and Lined Massive Wall",
      "explicit move changed"
    );
  });

  it("preserves board-dominant explicit framed cavities on the stud-wall lane", () => {
    const framedLayers: readonly LayerInput[] = [
      { materialId: "gypsum", thicknessMm: 12.5 },
      { materialId: "gypsum", thicknessMm: 12.5 },
      { materialId: "air_gap", thicknessMm: 42 },
      { materialId: "glasswool", thicknessMm: 50 },
      { materialId: "gypsum", thicknessMm: 12.5 },
      { materialId: "gypsum", thicknessMm: 12.5 }
    ];

    const base = snapshotPair(framedLayers, {
      field: EXPLICIT_FIELD_CONTEXT,
      lab: EXPLICIT_LAB_CONTEXT
    });

    expect({
      confidence: base.confidence,
      dnTw: base.dnTw,
      family: base.family,
      rw: base.rw,
      rwPrime: base.rwPrime,
      strategy: base.strategy
    }).toEqual({
      confidence: "low",
      dnTw: 43,
      family: "stud_wall_system",
      rw: 51,
      rwPrime: 42,
      strategy: "stud_surrogate_blend+framed_wall_calibration"
    });
    expectWarningFragment(
      base.warnings,
      "visible morphology still looks like a board-dominant framed cavity",
      "board-dominant explicit framed wall"
    );
  });

  it("keeps explicit duplicate variants inside the guarded handoff band", () => {
    for (const variant of EXPLICIT_DUPLICATE_VARIANTS) {
      const base = snapshotPair(variant.stack, {
        field: EXPLICIT_FIELD_CONTEXT,
        lab: EXPLICIT_LAB_CONTEXT
      });
      const duplicated = snapshotPair([...variant.stack, ...variant.stack], {
        field: EXPLICIT_FIELD_CONTEXT,
        lab: EXPLICIT_LAB_CONTEXT
      });

      expect({
        confidence: base.confidence,
        dnTw: base.dnTw,
        family: base.family,
        rw: base.rw,
        rwPrime: base.rwPrime,
        strategy: base.strategy
      }).toEqual(variant.base);
      expect({
        confidence: duplicated.confidence,
        dnTw: duplicated.dnTw,
        family: duplicated.family,
        rw: duplicated.rw,
        rwPrime: duplicated.rwPrime,
        strategy: duplicated.strategy
      }).toEqual(variant.duplicated);
      expect(duplicated.rw - base.rw, `${variant.name} lab delta`).toBeLessThanOrEqual(3);
      expect(duplicated.rwPrime - base.rwPrime, `${variant.name} field R'w delta`).toBeLessThanOrEqual(4);
      expect(duplicated.dnTw - base.dnTw, `${variant.name} field DnT,w delta`).toBeLessThanOrEqual(4);
      expectWarningFragment(
        base.warnings,
        "Explicit framed-wall metadata was not allowed to force the stud-wall lane",
        `${variant.name} base`
      );
    }
  });

  it("holds the workbench-like adjacent-swap matrix inside the new guarded band at engine level", () => {
    for (const testCase of WORKBENCH_ADJACENT_SWAP_CASES) {
      const base = snapshotPair(testCase.stack, {
        field: WORKBENCH_FIELD_CONTEXT,
        lab: WORKBENCH_LAB_CONTEXT
      });
      const changed = snapshotPair(swapAdjacent(testCase.stack, testCase.swapIndex), {
        field: WORKBENCH_FIELD_CONTEXT,
        lab: WORKBENCH_LAB_CONTEXT
      });

      expect({
        confidence: base.confidence,
        dnTw: base.dnTw,
        family: base.family,
        rw: base.rw,
        rwPrime: base.rwPrime,
        strategy: base.strategy
      }).toEqual(testCase.base);
      expect({
        confidence: changed.confidence,
        dnTw: changed.dnTw,
        family: changed.family,
        rw: changed.rw,
        rwPrime: changed.rwPrime,
        strategy: changed.strategy
      }).toEqual(testCase.changed);
      expect(Math.abs(changed.rw - base.rw), `${testCase.name} lab delta`).toBeLessThanOrEqual(testCase.maxRwDelta);
      expect(Math.abs(changed.rwPrime - base.rwPrime), `${testCase.name} field R'w delta`).toBeLessThanOrEqual(
        testCase.maxRwPrimeDelta
      );
      expect(Math.abs(changed.dnTw - base.dnTw), `${testCase.name} field DnT,w delta`).toBeLessThanOrEqual(testCase.maxDnTwDelta);
    }
  });

  it("keeps deeper explicit-metadata hybrids out of the stud lane and inside conservative duplicate and swap ranges", () => {
    for (const testCase of DEEP_EXPLICIT_STACK_CASES) {
      const base = snapshotPair(testCase.stack, {
        field: EXPLICIT_FIELD_CONTEXT,
        lab: EXPLICIT_LAB_CONTEXT
      });
      const swapped = snapshotPair(swapAdjacent(testCase.stack, testCase.swapIndex), {
        field: EXPLICIT_FIELD_CONTEXT,
        lab: EXPLICIT_LAB_CONTEXT
      });
      const duplicated = snapshotPair([...testCase.stack, ...testCase.stack], {
        field: EXPLICIT_FIELD_CONTEXT,
        lab: EXPLICIT_LAB_CONTEXT
      });

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
      expect(base.family, `${testCase.name} base family`).not.toBe("stud_wall_system");
      expect(swapped.family, `${testCase.name} swapped family`).not.toBe("stud_wall_system");
      expect(duplicated.family, `${testCase.name} duplicated family`).not.toBe("stud_wall_system");
      expect(Math.abs(swapped.rw - base.rw), `${testCase.name} swap lab delta`).toBeLessThanOrEqual(0);
      expect(Math.abs(swapped.rwPrime - base.rwPrime), `${testCase.name} swap field R'w delta`).toBeLessThanOrEqual(0);
      expect(Math.abs(swapped.dnTw - base.dnTw), `${testCase.name} swap field DnT,w delta`).toBeLessThanOrEqual(0);
      expect(duplicated.rw - base.rw, `${testCase.name} duplicate lab delta`).toBeLessThanOrEqual(13);
      expect(duplicated.rwPrime - base.rwPrime, `${testCase.name} duplicate field R'w delta`).toBeLessThanOrEqual(14);
      expect(duplicated.dnTw - base.dnTw, `${testCase.name} duplicate field DnT,w delta`).toBeLessThanOrEqual(15);
    }
  });
});
