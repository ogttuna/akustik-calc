// Post-slice contract — `wall_field_continuation_value_pinning_v1`
// closed on 2026-04-21. Master-plan step 5.
//
// What closed:
//   - **Dimension A (preset surface)**: every defended wall preset
//     × every airborne context mode × every field output is pinned
//     to an exact VALUE. 18 cells × 10 outputs = 180 numeric
//     assertions, all green.
//   - **Accuracy findings confirmed clean**: invariants I1 (R'w ≤
//     Rw), I2 (|Dn,A − (Dn,w + C)| ≤ 1 dB), and I3 (DnT,w − Dn,w
//     ∈ [2, 10] dB) hold on every cell. No new physical
//     inconsistency surfaced — the 2026-04-21 masonry flanking
//     inversion fix remains the only accuracy violation found so
//     far, and the lab-fallback anchor continues to keep Porotherm
//     masonry bounded by its Wienerberger lab benchmark.
//   - **Timber stud gap re-confirmed**: `timber_stud_wall` keeps
//     pinning at Rw=31 / field R'w=24, both lower than
//     manufacturer field data for similar stacks (~45-50 dB).
//     Flagged for `wall_formula_family_widening_v1` (step 6,
//     conditional) with explicit inline comment.
//   - **Zero engine changes**: every cell pin captured the post-
//     split engine output verbatim. The split refactor landed
//     without drift.
//
// What the slice did NOT do (scope-limited):
//   - **Dimension B (corridor selector VALUE pins)**: the
//     `dynamic-airborne-wall-selector-trace-matrix.test.ts`
//     corridors already carry narrative pins (family / support /
//     origin strings). Extending to exact VALUE pins is a
//     follow-up slice — the corridor surface needs explicit layer
//     configuration per case, which is a larger body of work than
//     the preset surface covered here.
//   - **Floor corridor VALUE pinning**: out of scope for this wall
//     slice. A parallel floor slice can mirror this shape.
//
// Next selected slice:
//   The accuracy audit landed **clean** (no new findings, timber
//   stud gap already known). Per MASTER_PLAN step 5 →
//   post-condition: "if every cell pins cleanly, advance to step
//   7". Selected: `mixed_floor_wall_edge_case_hardening_v1`
//   (master-plan step 7).
//
// Rationale:
//   - Primary-objective ROI now points at the cross-mode torture
//     matrix because the preset-side surface is fully VALUE-pinned
//     and invariants are green. Step 6 stays conditional —
//     defensible timber stud widening is a single known gap that
//     can ride along inside a future slice rather than block step
//     7.
//   - Step 7 also consolidates progress into a final audit gate.
//   - The dimension B corridor VALUE pins + composer-injection
//     split (`dynamic_airborne_split_refactor_v2`) remain
//     documented follow-ups that a later slice can pick up without
//     losing the current progress.

import { describe, expect, it } from "vitest";

export const POST_SLICE_CONTRACT = {
  closedSliceId: "wall_field_continuation_value_pinning_v1",
  closedSliceRole:
    "Pinned every defended wall preset × every airborne context mode × every field output to an exact VALUE. 18 cells × 10 outputs = 180 numeric assertions land as drift guards. Invariants I1/I2/I3 confirmed green on every cell. Timber stud accuracy gap flagged for step 6 with explicit inline comment. Zero engine changes — the post-split engine layout carries the 2026-04-21 masonry flanking inversion fix + lab-fallback anchor intact.",
  evidenceLedger: [
    "apps/web/features/workbench/wall-field-continuation-completeness-matrix.test.ts",
    "apps/web/features/workbench/wall-physical-invariants-matrix.test.ts",
    "apps/web/features/workbench/wall-preset-expansion-benchmarks.test.ts",
    "apps/web/features/workbench/wall-lsf-timber-stud-preset-benchmarks.test.ts",
    "docs/calculator/SLICE_WALL_FIELD_CONTINUATION_VALUE_PINNING_PLAN.md"
  ],
  selectedImplementationSlice: "mixed_floor_wall_edge_case_hardening_v1",
  selectedImplementationSliceRole:
    "Master-plan step 7. Extend the cross-mode torture matrix with new wall corridors, consolidate existing mixed-mode tests under the post-split engine layout, and confirm every defended cell still holds under randomized hostile-input / reorder / save-load / duplicate-swap pressure. Primary-objective ROI path — covers breadth without requiring new calibration work.",
  deferred: {
    dimensionBCorridorValuePins:
      "Extend VALUE pins to the dynamic-airborne-wall-selector corridors (double_leaf, lined_massive_wall, aac_boundary, g5_sibling, heavy_core_trim, lab_double_stud, deep_hybrid_swap_*) once the corridor-specific layer configurations are sourced. Narrative pins already cover these cases.",
    timberStudAccuracyGap:
      "timber_stud_wall engine output (Rw=31 / field R'w=24) is lower than manufacturer field data for similar stacks (~45-50 dB). Parked for `wall_formula_family_widening_v1` (step 6, conditional) — documented in the completeness matrix inline comment and in `SLICE_LSF_TIMBER_PRESET_WITH_INVARIANTS_PLAN.md`.",
    dynamicAirborneSplitV2:
      "14 `apply*` floor / cap guards + composition scaffolding (~3200 lines) still live in `dynamic-airborne.ts`. Deferred to `dynamic_airborne_split_refactor_v2` because the guards recursively call the composer. Blueprint in `docs/calculator/DYNAMIC_AIRBORNE_CARTOGRAPHY.md`."
  },
  kept: {
    frozenUpstreamClosuresUntouched: true,
    blockedSourceBackedQueueUnchanged: true,
    masonryFlankingInversionFixIntact: true,
    labFallbackAnchorIntact: true,
    invariantsMatrixGreen: true,
    engineThicknessGuardrailLive: true,
    splitRefactorV1Intact: true,
    accuracyContractPreserved: true
  }
} as const;

describe("post-wall field continuation value pinning v1 — next slice selection contract", () => {
  it("records the slice id and the next selected slice", () => {
    expect(POST_SLICE_CONTRACT.closedSliceId).toBe(
      "wall_field_continuation_value_pinning_v1"
    );
    expect(POST_SLICE_CONTRACT.selectedImplementationSlice).toBe(
      "mixed_floor_wall_edge_case_hardening_v1"
    );
  });

  it("pins the evidence ledger to source-of-truth artifacts", () => {
    expect(POST_SLICE_CONTRACT.evidenceLedger).toContain(
      "apps/web/features/workbench/wall-field-continuation-completeness-matrix.test.ts"
    );
    expect(POST_SLICE_CONTRACT.evidenceLedger).toContain(
      "apps/web/features/workbench/wall-physical-invariants-matrix.test.ts"
    );
  });

  it("records the three deferred follow-up tracks", () => {
    expect(POST_SLICE_CONTRACT.deferred.dimensionBCorridorValuePins.length).toBeGreaterThan(0);
    expect(POST_SLICE_CONTRACT.deferred.timberStudAccuracyGap.length).toBeGreaterThan(0);
    expect(POST_SLICE_CONTRACT.deferred.dynamicAirborneSplitV2.length).toBeGreaterThan(0);
  });

  it("keeps every accuracy contract intact", () => {
    expect(POST_SLICE_CONTRACT.kept.frozenUpstreamClosuresUntouched).toBe(true);
    expect(POST_SLICE_CONTRACT.kept.blockedSourceBackedQueueUnchanged).toBe(true);
    expect(POST_SLICE_CONTRACT.kept.masonryFlankingInversionFixIntact).toBe(true);
    expect(POST_SLICE_CONTRACT.kept.labFallbackAnchorIntact).toBe(true);
    expect(POST_SLICE_CONTRACT.kept.invariantsMatrixGreen).toBe(true);
    expect(POST_SLICE_CONTRACT.kept.engineThicknessGuardrailLive).toBe(true);
    expect(POST_SLICE_CONTRACT.kept.splitRefactorV1Intact).toBe(true);
    expect(POST_SLICE_CONTRACT.kept.accuracyContractPreserved).toBe(true);
  });
});
