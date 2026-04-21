// Post-slice contract — `wall_lsf_timber_preset_pack_with_invariants_v1`
// closed on 2026-04-21. This slice was one of the first that advanced
// all three project priority axes simultaneously (coverage + accuracy
// + architecture readiness) per MASTER_PLAN §2 P1.
//
// What closed:
//   - COVERAGE: wall preset archetypes moved from 4 → 6
//     (`light_steel_stud_wall` + `timber_stud_wall` landed with
//     `airborneDefaults` so their framed-wall family context flows
//     through `loadPreset` into the workbench store on selection).
//     Advances MASTER_PLAN §8 C1 to 6/6 archetypes.
//   - ACCURACY: `wall-physical-invariants-matrix.test.ts` pins
//     I1 (R'w ≤ Rw), I2 (Dn,A ≈ Dn,w + C), I3 (DnT,w − Dn,w ∈
//     [2,10] dB) across all 6 wall presets × 3 context modes
//     (element_lab, field_between_rooms, building_prediction) — 24
//     cells. I1 drove the masonry flanking inversion discovery that
//     landed as a prerequisite fix (see
//     `post-masonry-flanking-inversion-fix-next-slice-selection-contract`).
//     Field / building VALUE pins for AAC, masonry, CLT and LSF,
//     timber stud are drift guards for the 2026-04-21 lab-fallback
//     anchor output surface.
//   - ARCHITECTURE: `PresetAirborneDefaults` + `loadPreset` wiring
//     pattern is now production-proven. Later preset slices (masonry
//     variants, CLT wet, specialised stud walls) inherit the same
//     clean path.
//
// What the slice did NOT do (explicitly out of scope):
//   - Fix the timber stud accuracy gap (engine produces 31 dB under
//     the composed lab context; manufacturer field data for similar
//     stacks is typically ~45–50 dB). That is a real finding parked
//     for `wall_formula_family_widening_v1` (master-plan step 6,
//     conditional). Drift-guard pin captures present behaviour so any
//     future fix lands explicitly.
//   - Touch any frozen upstream closeout or reopen a blocked-source
//     candidate (GDMTXA04A, C11c, raw bare, wall-selector).
//   - Split `dynamic-airborne.ts` (6630 lines) — that is master-plan
//     step 4.
//
// Next selected slice:
//   `wall_hostile_input_matrix_with_airborne_cartography_v1`
//   (master-plan step 3). Brings the floor hostile-input discipline
//   to walls (50+ layer stacks, unknown material, invalid thickness,
//   mix of these with field/building context) plus the cross-cutting
//   engine thickness guardrail plus early cartography for the
//   eventual `dynamic-airborne.ts` split.
//
// Rationale:
//   - C4 (hostile-input discipline) is the only C-signal that still
//     has an entirely open wall half; closing it before step 4
//     refactor means the split lands on a test surface that includes
//     wall torture paths, not just a current happy-path guard.
//   - Parallel work on floor is not necessary — floor hostile input
//     already exists and engine thickness guardrail can ride along
//     this slice.

import { describe, expect, it } from "vitest";

export const POST_SLICE_CONTRACT = {
  closedSliceId: "wall_lsf_timber_preset_pack_with_invariants_v1",
  closedSliceRole:
    "Landed LSF + timber stud wall presets with `airborneDefaults` wiring, turned the physical invariants matrix (I1/I2/I3 across 6 presets × 3 contexts) from hypothetical to pinned, and extended AAC/masonry/CLT/LSF/timber drift guards to include field and building VALUE pins.",
  evidenceLedger: [
    "apps/web/features/workbench/preset-definitions.ts",
    "apps/web/features/workbench/workbench-store.ts",
    "apps/web/features/workbench/wall-lsf-timber-stud-preset-benchmarks.test.ts",
    "apps/web/features/workbench/wall-preset-expansion-benchmarks.test.ts",
    "apps/web/features/workbench/wall-physical-invariants-matrix.test.ts",
    "apps/web/features/workbench/wall-full-preset-contract-matrix.test.ts"
  ],
  selectedImplementationSlice: "wall_hostile_input_matrix_with_airborne_cartography_v1",
  selectedImplementationSliceRole:
    "Mirror the floor hostile-input matrices on walls (50+ layer, unknown material, invalid thickness, mixed with field/building context), land the cross-cutting engine thickness guardrail, and produce initial `dynamic-airborne.ts` cartography for the subsequent split slice.",
  kept: {
    frozenUpstreamClosuresUntouched: true,
    blockedSourceBackedQueueUnchanged: true,
    masonryFlankingInversionFixIntact: true,
    invariantsMatrixGreen: true,
    dynamicAirborneSizeDebtDeferred: true
  },
  coverageAdvance: {
    c1WallArchetypeCount: 6,
    c1WallArchetypeTarget: 6,
    c5WallReorderInvarianceGreen: true,
    c4WallHostileInputStatus: "still_open",
    c6DynamicAirborneSplitStatus: "deferred_to_step_4"
  }
} as const;

describe("post-wall LSF + timber preset pack with invariants v1 — next slice selection contract", () => {
  it("records the slice id and the next selected slice", () => {
    expect(POST_SLICE_CONTRACT.closedSliceId).toBe(
      "wall_lsf_timber_preset_pack_with_invariants_v1"
    );
    expect(POST_SLICE_CONTRACT.selectedImplementationSlice).toBe(
      "wall_hostile_input_matrix_with_airborne_cartography_v1"
    );
  });

  it("pins the evidence ledger to source-of-truth artifacts", () => {
    expect(POST_SLICE_CONTRACT.evidenceLedger).toContain(
      "apps/web/features/workbench/wall-lsf-timber-stud-preset-benchmarks.test.ts"
    );
    expect(POST_SLICE_CONTRACT.evidenceLedger).toContain(
      "apps/web/features/workbench/wall-physical-invariants-matrix.test.ts"
    );
    expect(POST_SLICE_CONTRACT.evidenceLedger).toContain(
      "apps/web/features/workbench/wall-preset-expansion-benchmarks.test.ts"
    );
  });

  it("keeps the upstream closeouts and blocked-source queue untouched", () => {
    expect(POST_SLICE_CONTRACT.kept.frozenUpstreamClosuresUntouched).toBe(true);
    expect(POST_SLICE_CONTRACT.kept.blockedSourceBackedQueueUnchanged).toBe(true);
    expect(POST_SLICE_CONTRACT.kept.masonryFlankingInversionFixIntact).toBe(true);
    expect(POST_SLICE_CONTRACT.kept.invariantsMatrixGreen).toBe(true);
    expect(POST_SLICE_CONTRACT.kept.dynamicAirborneSizeDebtDeferred).toBe(true);
  });

  it("advances the MASTER_PLAN completion-signal state correctly", () => {
    expect(POST_SLICE_CONTRACT.coverageAdvance.c1WallArchetypeCount).toBe(6);
    expect(POST_SLICE_CONTRACT.coverageAdvance.c1WallArchetypeTarget).toBe(6);
    expect(POST_SLICE_CONTRACT.coverageAdvance.c5WallReorderInvarianceGreen).toBe(true);
    expect(POST_SLICE_CONTRACT.coverageAdvance.c4WallHostileInputStatus).toBe("still_open");
    expect(POST_SLICE_CONTRACT.coverageAdvance.c6DynamicAirborneSplitStatus).toBe(
      "deferred_to_step_4"
    );
  });
});
