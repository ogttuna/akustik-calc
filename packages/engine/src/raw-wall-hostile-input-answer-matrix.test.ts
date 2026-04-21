// Wall hostile-input answer matrix — the wall-side analog of
// `raw-floor-hostile-input-answer-matrix.test.ts`. Every case here
// pins the deterministic engine output for a stack that a careless
// or adversarial user might feed into the calculator: oversized
// stacks, unknown materials, invalid thickness, empty layers, and
// mixes of the above. The assertions capture the current observed
// engine behaviour so that any future change lands with an explicit
// test update rather than a silent user-visible shift.
//
// Coverage classes:
//   1. 50 identical heavy layers (stress the single-leaf mass-law
//      path; verify deterministic finite Rw and no numerical
//      blow-up under extreme surface mass)
//   2. 50 mixed layers (alternating gypsum + rockwool + air gap to
//      stress the cavity family heuristics under extreme layer
//      count)
//   3. Unknown material id alone (resolveMaterial must raise a
//      catalog miss; this case records that the engine currently
//      throws on bare `calculateAssembly` for unknown ids — a
//      finding the companion thickness-and-material guardrail slice
//      addresses)
//   4. Unknown material id mixed with valid layers (same finding)
//   5. Invalid thickness: zero, negative, NaN, Infinity, very large
//   6. Empty layers array (degenerate zero-length input)
//   7. Single valid layer (trivial happy-path baseline)
//   8. 50-layer reorder invariance (reversed stack must produce the
//      same supported-output set as the original)
//
// When an assertion fires, treat it as a real finding per
// MASTER_PLAN §2 P3: tests measure correctness, not execution. An
// engine crash here is always a real bug, not a test artifact.

import type { LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";

type HostileSnapshot = {
  layerCount: number;
  rwDb: number | null;
  rwPrimeDb: number | null;
  stcDb: number | null;
  supported: readonly RequestedOutputId[];
  unsupported: readonly RequestedOutputId[];
  warningCount: number;
};

const WALL_OUTPUTS: readonly RequestedOutputId[] = [
  "Rw",
  "R'w",
  "DnT,w",
  "STC",
  "C",
  "Ctr"
];

const WALL_LAB_CONTEXT = {
  airtightness: "good" as const,
  contextMode: "element_lab" as const
};

const WALL_FIELD_CONTEXT = {
  airtightness: "good" as const,
  contextMode: "field_between_rooms" as const,
  panelHeightMm: 3000,
  panelWidthMm: 4200
};

function snapshot(
  layers: readonly LayerInput[],
  context: typeof WALL_LAB_CONTEXT | typeof WALL_FIELD_CONTEXT
): HostileSnapshot {
  const result = calculateAssembly(layers, {
    airborneContext: context,
    calculator: "dynamic",
    targetOutputs: WALL_OUTPUTS
  });

  return {
    layerCount: layers.length,
    rwDb: result.metrics.estimatedRwDb ?? null,
    rwPrimeDb: result.metrics.estimatedRwPrimeDb ?? null,
    stcDb: result.metrics.estimatedStc ?? null,
    supported: result.supportedTargetOutputs,
    unsupported: result.unsupportedTargetOutputs,
    warningCount: result.warnings.length
  };
}

describe("raw wall hostile-input answer matrix", () => {
  it("handles 50 identical heavy concrete layers without blowing up", () => {
    // 50 × 100 mm concrete = 5 m combined thickness — heavier than any
    // real-world wall, but the engine must still produce a finite,
    // bounded answer. Rw is expected to saturate at the curve cap
    // (~95 dB) because surface mass is off the realistic range, but
    // the STC / rating math must not return NaN or Infinity.
    const layers: LayerInput[] = Array.from({ length: 50 }, () => ({
      materialId: "concrete",
      thicknessMm: 100
    }));
    const snap = snapshot(layers, WALL_LAB_CONTEXT);

    expect(snap.layerCount).toBe(50);
    expect(snap.rwDb).not.toBeNull();
    expect(Number.isFinite(snap.rwDb ?? NaN)).toBe(true);
    expect(snap.rwDb ?? 0).toBeGreaterThan(40);
    // The curve clamp in `buildCalibratedMassLawCurve` caps individual
    // bands at 95 dB; the derived Rw can round slightly above that
    // without being physically meaningful. Accept anything ≤ 100 dB.
    expect(snap.rwDb ?? 0).toBeLessThanOrEqual(100);
    expect(snap.stcDb).not.toBeNull();
    expect(Number.isFinite(snap.stcDb ?? NaN)).toBe(true);
  });

  it("handles 50 mixed layers without blowing up", () => {
    const layers: LayerInput[] = Array.from({ length: 50 }, (_, index) => {
      const rotation = index % 3;
      if (rotation === 0) return { materialId: "gypsum_board", thicknessMm: 12.5 };
      if (rotation === 1) return { materialId: "rockwool", thicknessMm: 45 };
      return { materialId: "air_gap", thicknessMm: 20 };
    });
    const snap = snapshot(layers, WALL_LAB_CONTEXT);

    expect(snap.layerCount).toBe(50);
    expect(snap.rwDb).not.toBeNull();
    expect(Number.isFinite(snap.rwDb ?? NaN)).toBe(true);
    expect(snap.rwDb ?? 0).toBeGreaterThan(0);
    expect(snap.rwDb ?? 0).toBeLessThanOrEqual(95);
  });

  it("produces a single-layer happy-path baseline", () => {
    const layers: LayerInput[] = [{ materialId: "concrete", thicknessMm: 100 }];
    const snap = snapshot(layers, WALL_LAB_CONTEXT);

    expect(snap.layerCount).toBe(1);
    expect(snap.rwDb).not.toBeNull();
    expect(Number.isFinite(snap.rwDb ?? NaN)).toBe(true);
  });

  it("keeps reorder invariance on a 50-layer mixed stack", () => {
    const base: LayerInput[] = Array.from({ length: 50 }, (_, index) => {
      const rotation = index % 4;
      if (rotation === 0) return { materialId: "gypsum_board", thicknessMm: 12.5 };
      if (rotation === 1) return { materialId: "rockwool", thicknessMm: 45 };
      if (rotation === 2) return { materialId: "air_gap", thicknessMm: 20 };
      return { materialId: "concrete", thicknessMm: 60 };
    });
    const original = snapshot(base, WALL_LAB_CONTEXT);
    const reversed = snapshot([...base].reverse(), WALL_LAB_CONTEXT);

    // Supported / unsupported sets must be identical under reorder —
    // this is the extension of step 1's reorder invariance matrix to
    // hostile sizes.
    expect(reversed.supported).toEqual(original.supported);
    expect(reversed.unsupported).toEqual(original.unsupported);
  });

  it("survives an empty layers array with a fail-closed output set", () => {
    const snap = snapshot([], WALL_LAB_CONTEXT);

    expect(snap.layerCount).toBe(0);
    // Empty layers: nothing to compute; rw falls back to a formula
    // default or stays unsupported. The contract: no crash, and the
    // output set is deterministic across repeated calls.
    const second = snapshot([], WALL_LAB_CONTEXT);
    expect(second.rwDb).toBe(snap.rwDb);
    expect(second.supported).toEqual(snap.supported);
  });

  it("stays finite in field context on a 50-identical heavy stack", () => {
    const layers: LayerInput[] = Array.from({ length: 50 }, () => ({
      materialId: "concrete",
      thicknessMm: 100
    }));
    const snap = snapshot(layers, WALL_FIELD_CONTEXT);

    expect(snap.rwPrimeDb).not.toBeNull();
    expect(Number.isFinite(snap.rwPrimeDb ?? NaN)).toBe(true);
    expect(snap.rwPrimeDb ?? 0).toBeGreaterThan(0);
    expect(snap.rwPrimeDb ?? 0).toBeLessThanOrEqual(95);
  });
});

describe("raw wall hostile-input — unknown material and invalid thickness", () => {
  // These assertions describe the target post-guardrail engine
  // behaviour. API / CLI callers bypassing the workbench row
  // normaliser must still receive a deterministic fail-closed output
  // with a specific warning, not a raw throw. The guardrail lands
  // alongside this matrix inside the same slice.
  const WALL_LAB_CONTEXT_LOCAL = WALL_LAB_CONTEXT;

  it("fail-closes on unknown materialId alone (no throw, specific warning)", () => {
    const result = calculateAssembly(
      [{ materialId: "unobtainium" as unknown as string, thicknessMm: 100 }],
      {
        airborneContext: WALL_LAB_CONTEXT_LOCAL,
        calculator: "dynamic",
        targetOutputs: WALL_OUTPUTS
      }
    );

    expect(
      result.warnings.some((warning: string) => /unknown material/i.test(warning))
    ).toBe(true);
    // Fail-closed: the unknown layer cannot contribute to the
    // acoustic answer, so the user-visible outputs are empty.
    expect(result.supportedTargetOutputs.length).toBe(0);
  });

  it("fail-closes when an unknown materialId is mixed with valid layers", () => {
    const result = calculateAssembly(
      [
        { materialId: "gypsum_board", thicknessMm: 12.5 },
        { materialId: "unobtainium" as unknown as string, thicknessMm: 100 }
      ],
      {
        airborneContext: WALL_LAB_CONTEXT_LOCAL,
        calculator: "dynamic",
        targetOutputs: WALL_OUTPUTS
      }
    );

    expect(
      result.warnings.some((warning: string) => /unknown material/i.test(warning))
    ).toBe(true);
    expect(result.supportedTargetOutputs.length).toBe(0);
  });

  it("fail-closes on a zero-thickness layer with a specific warning", () => {
    const result = calculateAssembly(
      [{ materialId: "concrete", thicknessMm: 0 }],
      {
        airborneContext: WALL_LAB_CONTEXT_LOCAL,
        calculator: "dynamic",
        targetOutputs: WALL_OUTPUTS
      }
    );

    expect(
      result.warnings.some((warning: string) => /invalid thickness|thickness/i.test(warning))
    ).toBe(true);
    expect(result.supportedTargetOutputs.length).toBe(0);
  });

  it("fail-closes on a NaN-thickness layer with a specific warning", () => {
    const result = calculateAssembly(
      [{ materialId: "concrete", thicknessMm: Number.NaN }],
      {
        airborneContext: WALL_LAB_CONTEXT_LOCAL,
        calculator: "dynamic",
        targetOutputs: WALL_OUTPUTS
      }
    );

    expect(
      result.warnings.some((warning: string) => /invalid thickness|thickness/i.test(warning))
    ).toBe(true);
    expect(result.supportedTargetOutputs.length).toBe(0);
  });

  it("fail-closes on an Infinity-thickness layer with a specific warning", () => {
    const result = calculateAssembly(
      [{ materialId: "concrete", thicknessMm: Number.POSITIVE_INFINITY }],
      {
        airborneContext: WALL_LAB_CONTEXT_LOCAL,
        calculator: "dynamic",
        targetOutputs: WALL_OUTPUTS
      }
    );

    expect(
      result.warnings.some((warning: string) => /invalid thickness|thickness/i.test(warning))
    ).toBe(true);
    expect(result.supportedTargetOutputs.length).toBe(0);
  });

  it("fail-closes on a negative-thickness layer with a specific warning", () => {
    const result = calculateAssembly(
      [{ materialId: "concrete", thicknessMm: -5 }],
      {
        airborneContext: WALL_LAB_CONTEXT_LOCAL,
        calculator: "dynamic",
        targetOutputs: WALL_OUTPUTS
      }
    );

    expect(
      result.warnings.some((warning: string) => /invalid thickness|thickness/i.test(warning))
    ).toBe(true);
    expect(result.supportedTargetOutputs.length).toBe(0);
  });

  it("fail-closes on extreme thickness beyond physical plausibility (1e9 mm)", () => {
    const result = calculateAssembly(
      [{ materialId: "concrete", thicknessMm: 1e9 }],
      {
        airborneContext: WALL_LAB_CONTEXT_LOCAL,
        calculator: "dynamic",
        targetOutputs: WALL_OUTPUTS
      }
    );

    expect(
      result.warnings.some((warning: string) => /invalid thickness|thickness/i.test(warning))
    ).toBe(true);
    expect(result.supportedTargetOutputs.length).toBe(0);
  });
});
