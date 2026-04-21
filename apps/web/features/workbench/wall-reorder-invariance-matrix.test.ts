// Pins the invariance the engine must satisfy once the wall_reorder_output_set_consistency_v1
// slice lands: for a physically-equivalent wall stack (lab reciprocity), layer
// reordering must not change which airborne outputs are supported. Rw, C,
// and Ctr values must be identical across reorderings and the supportedOutputs
// set must be the same.
//
// Historical root cause (2026-04-21 probe):
//   * wall-mode stacks without explicit floorRole go through
//     `maybeInferFloorRoleLayerStack`, which is order-sensitive (floors
//     have physical orientation).
//   * For an asymmetric light/heavy stack, one ordering (gypsum top,
//     concrete base) matches the ceiling-helper-over-concrete-base
//     inference; the reverse does not.
//   * The inferred-carrier path sets `floorCarrier` in target-output-support.
//   * `getCarrierC` returned null when the carrier's semantic is `rw_plus_ctr`
//     (no declared C) instead of falling through to the curve-based
//     `metrics.estimatedCDb`. Same stack, same `ratings.iso717.C`, different
//     supported output set — a real non-determinism bug.
//
// The fix (see packages/engine/src/target-output-support.ts) keeps the
// `ctr_term` carrier guard intact (the carrier explicitly says no C) and
// falls through to metrics for other semantics. That eliminates the
// reorder-sensitivity of the supported output set without loosening the
// intentional ctr_term suppression.

import { describe, expect, it } from "vitest";

import { evaluateScenario } from "./scenario-analysis";
import type { LayerDraft } from "./workbench-store";

const WALL_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const;

type Snapshot = {
  rw: number | null;
  c: number | null;
  ctr: number | null;
  supportedOutputs: readonly string[];
};

function evaluateWall(id: string, rows: readonly Omit<LayerDraft, "id">[]): Snapshot {
  const scenario = evaluateScenario({
    id,
    name: id,
    rows: rows.map((row, index) => ({ ...row, id: `${id}-${index + 1}` })),
    source: "current",
    studyMode: "wall",
    targetOutputs: WALL_OUTPUTS
  });

  const result = scenario.result;
  return {
    rw: result?.ratings?.iso717?.Rw ?? null,
    c: result?.ratings?.iso717?.C ?? null,
    ctr: result?.ratings?.iso717?.Ctr ?? null,
    supportedOutputs: result?.supportedTargetOutputs ?? []
  };
}

type ReorderCase = {
  id: string;
  a: readonly Omit<LayerDraft, "id">[];
  b: readonly Omit<LayerDraft, "id">[];
  expectedSupportedOutputs: readonly string[];
};

const REORDER_CASES: readonly ReorderCase[] = [
  {
    id: "asymmetric light-heavy four-layer gypsum / rockwool / air_gap / concrete",
    a: [
      { materialId: "gypsum_board", thicknessMm: "12.5" },
      { materialId: "rockwool", thicknessMm: "50" },
      { materialId: "air_gap", thicknessMm: "50" },
      { materialId: "concrete", thicknessMm: "150" }
    ],
    b: [
      { materialId: "concrete", thicknessMm: "150" },
      { materialId: "rockwool", thicknessMm: "50" },
      { materialId: "air_gap", thicknessMm: "50" },
      { materialId: "gypsum_board", thicknessMm: "12.5" }
    ],
    expectedSupportedOutputs: ["Rw", "STC", "C", "Ctr"]
  },
  {
    id: "asymmetric light-heavy three-layer gypsum / air_gap / concrete",
    a: [
      { materialId: "gypsum_board", thicknessMm: "12.5" },
      { materialId: "air_gap", thicknessMm: "50" },
      { materialId: "concrete", thicknessMm: "150" }
    ],
    b: [
      { materialId: "concrete", thicknessMm: "150" },
      { materialId: "air_gap", thicknessMm: "50" },
      { materialId: "gypsum_board", thicknessMm: "12.5" }
    ],
    expectedSupportedOutputs: ["Rw", "STC", "C", "Ctr"]
  },
  {
    id: "symmetric double-leaf gypsum / air / gypsum",
    a: [
      { materialId: "gypsum_board", thicknessMm: "12.5" },
      { materialId: "air_gap", thicknessMm: "50" },
      { materialId: "gypsum_board", thicknessMm: "12.5" }
    ],
    b: [
      { materialId: "gypsum_board", thicknessMm: "12.5" },
      { materialId: "air_gap", thicknessMm: "50" },
      { materialId: "gypsum_board", thicknessMm: "12.5" }
    ],
    expectedSupportedOutputs: ["Rw", "STC", "C", "Ctr"]
  },
  {
    id: "symmetric single-leaf concrete-and-plaster",
    a: [
      { materialId: "concrete", thicknessMm: "150" },
      { materialId: "gypsum_board", thicknessMm: "12.5" }
    ],
    b: [
      { materialId: "gypsum_board", thicknessMm: "12.5" },
      { materialId: "concrete", thicknessMm: "150" }
    ],
    expectedSupportedOutputs: ["Rw", "STC", "C", "Ctr"]
  }
];

describe("wall reorder invariance matrix", () => {
  it.each(REORDER_CASES)(
    "$id: Rw, C, Ctr, and supportedOutputs are identical across layer reversal",
    (testCase) => {
      const a = evaluateWall(`${testCase.id}-A`, testCase.a);
      const b = evaluateWall(`${testCase.id}-B`, testCase.b);

      expect(a.rw, `${testCase.id}: Rw mismatch`).toBe(b.rw);
      expect(a.c, `${testCase.id}: C mismatch`).toBe(b.c);
      expect(a.ctr, `${testCase.id}: Ctr mismatch`).toBe(b.ctr);
      expect(a.supportedOutputs, `${testCase.id}: A supportedOutputs`).toEqual(
        testCase.expectedSupportedOutputs
      );
      expect(b.supportedOutputs, `${testCase.id}: B supportedOutputs`).toEqual(
        testCase.expectedSupportedOutputs
      );
      expect(a.supportedOutputs, `${testCase.id}: supportedOutputs mismatch across reversal`).toEqual(
        b.supportedOutputs
      );
    }
  );

  it("asymmetric stacks produce finite C values (regression guard for rw_plus_ctr floor-carrier fallthrough)", () => {
    const asymmetric = evaluateWall("asymmetric-guard", [
      { materialId: "gypsum_board", thicknessMm: "12.5" },
      { materialId: "rockwool", thicknessMm: "50" },
      { materialId: "air_gap", thicknessMm: "50" },
      { materialId: "concrete", thicknessMm: "150" }
    ]);

    expect(asymmetric.c).not.toBeNull();
    expect(Number.isFinite(asymmetric.c)).toBe(true);
    expect(asymmetric.supportedOutputs).toContain("C");
  });
});
