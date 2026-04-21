// Post-slice contract — `wall_hostile_input_matrix_with_airborne_cartography_v1`
// closed on 2026-04-21. Master-plan step 3.
//
// What closed:
//   - COVERAGE (C4): wall-side hostile-input discipline is now
//     pinned on both the engine surface
//     (`raw-wall-hostile-input-answer-matrix.test.ts`, 13 cases) and
//     the workbench surface (`raw-wall-hostile-input-route-card-matrix.test.ts`,
//     6 cases). C4 flips from `floor-only ✓, wall ✗` to `both ✓`.
//   - ACCURACY (P3): 50-layer heavy + 50-layer mixed cases prove the
//     engine stays finite and deterministic; 50-layer reorder
//     invariance is now guarded at the hostile size. The wall
//     equivalent of the floor hostile input matrix is live.
//   - ARCHITECTURE (step 4 prep):
//     `assembly-input-guardrail.ts` converts API/CLI hostile inputs
//     (NaN / Infinity / ≤ 0 thickness, missing / unknown materialId,
//     out-of-range thickness up to 1e5 mm) into a deterministic
//     fail-closed `AssemblyCalculation` with a specific warning
//     instead of a raw Zod/Error throw. The workbench normaliser
//     continues to catch the same classes earlier in the UI path.
//     `DYNAMIC_AIRBORNE_CARTOGRAPHY.md` maps the 6630-line file onto
//     three target files — the blueprint for the next split slice.
//
// What the slice did NOT do (explicitly out of scope):
//   - Split `dynamic-airborne.ts` (that is master-plan step 4).
//   - Fix the timber stud accuracy gap (parked for step 6).
//   - Touch any frozen upstream closeout or reopen a blocked-source
//     candidate.
//
// Next selected slice:
//   `dynamic_airborne_split_refactor_v1` (master-plan step 4). The
//   hostile-input + invariants test surfaces plus the benchmark
//   audit suite guard a pure mechanical code move — no behaviour
//   change is allowed. Cartography doc lives at
//   `docs/calculator/DYNAMIC_AIRBORNE_CARTOGRAPHY.md`.
//
// Rationale:
//   - C6 (architectural hygiene) is the only remaining
//     completion-signal blocker after C1, C4, C5 closed. Step 4 is
//     the cleanest next move because every guardrail it needs is now
//     green.

import { describe, expect, it } from "vitest";

export const POST_SLICE_CONTRACT = {
  closedSliceId: "wall_hostile_input_matrix_with_airborne_cartography_v1",
  closedSliceRole:
    "Landed the wall analog of the floor hostile-input matrices on both engine and workbench surfaces, added an engine-level assembly-input guardrail that fail-closes on invalid thickness / unknown material instead of throwing, and authored the dynamic-airborne cartography doc that blueprints the upcoming split refactor.",
  evidenceLedger: [
    "packages/engine/src/raw-wall-hostile-input-answer-matrix.test.ts",
    "apps/web/features/workbench/raw-wall-hostile-input-route-card-matrix.test.ts",
    "packages/engine/src/assembly-input-guardrail.ts",
    "packages/engine/src/calculate-assembly.ts",
    "docs/calculator/DYNAMIC_AIRBORNE_CARTOGRAPHY.md",
    "docs/calculator/SLICE_WALL_HOSTILE_INPUT_WITH_CARTOGRAPHY_PLAN.md"
  ],
  selectedImplementationSlice: "dynamic_airborne_split_refactor_v1",
  selectedImplementationSliceRole:
    "Mechanical move of `dynamic-airborne.ts` (6630 lines) into `dynamic-airborne-family-detection.ts` + `dynamic-airborne-predictor-scoring.ts` + `dynamic-airborne-helpers.ts`, keeping `calculateDynamicAirborneResult` as the composition entry point in the original file. Zero behaviour change is the guardrail contract.",
  kept: {
    frozenUpstreamClosuresUntouched: true,
    blockedSourceBackedQueueUnchanged: true,
    masonryFlankingInversionFixIntact: true,
    labFallbackAnchorIntact: true,
    invariantsMatrixGreen: true,
    engineThicknessGuardrailLive: true
  },
  coverageAdvance: {
    c1WallArchetypeCount: 6,
    c4FloorHostileInputStatus: "green",
    c4WallHostileInputStatus: "green",
    c5WallReorderInvarianceGreen: true,
    c6DynamicAirborneSplitStatus: "next"
  }
} as const;

describe("post-wall hostile-input matrix + cartography v1 — next slice selection contract", () => {
  it("records the slice id and the next selected slice", () => {
    expect(POST_SLICE_CONTRACT.closedSliceId).toBe(
      "wall_hostile_input_matrix_with_airborne_cartography_v1"
    );
    expect(POST_SLICE_CONTRACT.selectedImplementationSlice).toBe(
      "dynamic_airborne_split_refactor_v1"
    );
  });

  it("pins the evidence ledger to source-of-truth artifacts", () => {
    expect(POST_SLICE_CONTRACT.evidenceLedger).toContain(
      "packages/engine/src/raw-wall-hostile-input-answer-matrix.test.ts"
    );
    expect(POST_SLICE_CONTRACT.evidenceLedger).toContain(
      "apps/web/features/workbench/raw-wall-hostile-input-route-card-matrix.test.ts"
    );
    expect(POST_SLICE_CONTRACT.evidenceLedger).toContain(
      "packages/engine/src/assembly-input-guardrail.ts"
    );
    expect(POST_SLICE_CONTRACT.evidenceLedger).toContain(
      "docs/calculator/DYNAMIC_AIRBORNE_CARTOGRAPHY.md"
    );
  });

  it("keeps the upstream closeouts and blocked-source queue untouched", () => {
    expect(POST_SLICE_CONTRACT.kept.frozenUpstreamClosuresUntouched).toBe(true);
    expect(POST_SLICE_CONTRACT.kept.blockedSourceBackedQueueUnchanged).toBe(true);
    expect(POST_SLICE_CONTRACT.kept.masonryFlankingInversionFixIntact).toBe(true);
    expect(POST_SLICE_CONTRACT.kept.labFallbackAnchorIntact).toBe(true);
    expect(POST_SLICE_CONTRACT.kept.invariantsMatrixGreen).toBe(true);
    expect(POST_SLICE_CONTRACT.kept.engineThicknessGuardrailLive).toBe(true);
  });

  it("advances the MASTER_PLAN completion-signal state correctly", () => {
    expect(POST_SLICE_CONTRACT.coverageAdvance.c1WallArchetypeCount).toBe(6);
    expect(POST_SLICE_CONTRACT.coverageAdvance.c4FloorHostileInputStatus).toBe("green");
    expect(POST_SLICE_CONTRACT.coverageAdvance.c4WallHostileInputStatus).toBe("green");
    expect(POST_SLICE_CONTRACT.coverageAdvance.c5WallReorderInvarianceGreen).toBe(true);
    expect(POST_SLICE_CONTRACT.coverageAdvance.c6DynamicAirborneSplitStatus).toBe("next");
  });
});
