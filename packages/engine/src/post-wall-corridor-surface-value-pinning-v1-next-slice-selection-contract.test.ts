// Post-slice contract — `wall_corridor_surface_value_pinning_v1`
// closed on 2026-04-22. Master-plan step 7b (inserted between
// closed step 7 and pending step 8).
//
// What closed:
//   - **Dimension A**: the 6 wall selector corridor labels
//     (double_leaf, lined_massive_wall, aac_boundary,
//     g5_sibling, heavy_core_trim, lab_double_stud) are now
//     VALUE-pinned across 3 contexts (lab / field / building)
//     × 9 outputs (Rw, R'w, Dn,w, Dn,A, DnT,w, DnT,A, STC,
//     C, Ctr) in
//     `dynamic-airborne-wall-selector-value-pins.test.ts`.
//     18 cells × ~9 metric pins + family pin = ~180
//     individual `toBe` drift guards.
//   - **Invariant cross-cell bank**: 5 physics invariants
//     (I1 R'w ≤ Rw, I2 |Dn,A − (Dn,w + C)| ≤ 1 dB, I3
//     DnT,w − Dn,w ∈ [0, 10] dB, Ctr ≤ C, STC ≈ Rw ±3 dB)
//     asserted across the full 18-cell matrix — the same
//     physical correctness bank that caught the 2026-04-21
//     masonry flanking inversion fix.
//   - **Stud-context plumbing hardened**: `lab_double_stud`
//     now uses stud-aware FIELD + BUILDING context variants
//     (FRAMED_FIELD_CONTEXT, FRAMED_BUILDING_CONTEXT) so the
//     engine keeps the `double_stud_system` family across
//     all 3 contexts — previously field/building lost stud
//     metadata and drifted to `double_leaf`.
//   - **No engine changes**: every pin was discovered from
//     the engine's existing output with no remediation
//     needed. The 18 cells landed inside the §R6 plausibility
//     window (ISO 717-1:2020 European-construction ranges)
//     the slice plan pre-registered. Clean audit.
//   - **Test-infrastructure flake fixed**: the
//     `floor-library-sweep.test.ts` field-bundle high-split
//     test timed out at 5 s under serial CPU contention once
//     the new matrix landed. Raised its timeout to 15 s with
//     an inline note. No other test affected.
//
// What the slice did NOT do (scope-limited):
//   - **Dimension B (deep-hybrid swap VALUE pins)**:
//     out of scope per plan. The four
//     `dynamic-airborne-deep-hybrid-swap-*.test.ts` files
//     already guard no-silent-≥8-dB-adjacent-swap-jump;
//     VALUE pins on the swap grid are high-noise and were
//     deferred.
//   - **Dimension C (workbench card VALUE pins)**: optional
//     stretch per plan. Skipped in the interest of shipping
//     the accuracy-discipline delivery (Dimension A) without
//     duplicating coverage the engine-side matrix already
//     provides. Can land as a follow-up slice when the
//     workbench card surface is independently audited.
//   - **Step 8 `good_calculator_final_audit_v1` preparation**:
//     the next slice's plan doc is TBD. Step 8 now audits a
//     fully-green C2/C3 grid (both flip 🟡 → ✅ on close of
//     this slice) instead of a documented-deferred partial —
//     the primary reason 7b was re-selected ahead of 8.
//
// Next selected slice:
//   `good_calculator_final_audit_v1` (master-plan step 8).
//
// Rationale:
//   - C2 + C3 close on this slice (corridor surface fully
//     VALUE-pinned). All four remaining completion signals
//     that are actionable without external evidence have now
//     landed.
//   - Step 8 is the final audit slice. It verifies every
//     C1-C6 completion signal with an executable assertion,
//     authors the grid-consistency test that asserts the
//     §3 grid matches engine reality, and opens the
//     post-calculator productization roadmap.
//   - No other non-source-blocked accuracy work remains —
//     step 6 timber-stud widening is still blocked on
//     external lab evidence; split v2 is pure architecture;
//     F3 is cosmetic.

import { describe, expect, it } from "vitest";

export const POST_SLICE_CONTRACT = {
  closedSliceId: "wall_corridor_surface_value_pinning_v1",
  closedSliceRole:
    "Extended VALUE-pin discipline from the wall preset surface (closed in slice 5) to the wall selector corridor surface. 6 corridor labels × 3 contexts × 9 outputs = ~150 individual drift guards + 5 cross-cell invariant tests landed in `dynamic-airborne-wall-selector-value-pins.test.ts`. Stud-context plumbing for `lab_double_stud` hardened so family detection stays `double_stud_system` across lab/field/building. Closes C2 + C3 corridor surface gap — step 8 now audits a fully-green grid.",
  evidenceLedger: [
    "packages/engine/src/dynamic-airborne-wall-selector-value-pins.test.ts",
    "packages/engine/src/dynamic-airborne-wall-selector-trace-matrix.test.ts",
    "packages/engine/src/floor-library-sweep.test.ts",
    "docs/calculator/SLICE_WALL_CORRIDOR_SURFACE_VALUE_PINNING_PLAN.md"
  ],
  selectedImplementationSlice: "good_calculator_final_audit_v1",
  selectedImplementationSliceRole:
    "Master-plan step 8. Now runs against a fully-green C1-C5 grid (C6 split v2 remains documented-deferred per architectural scope). Authors `coverage-grid-consistency.test.ts` asserting §3 grid rows match engine reality, verifies every completion signal with an executable assertion, and opens the post-calculator productization roadmap (§1 non-goals).",
  deferred: {
    dimensionBDeepHybridSwapValuePins:
      "Four `dynamic-airborne-deep-hybrid-swap-*.test.ts` files guard no-silent-≥8-dB-jump invariants; per-cell VALUE pins on the swap grid are high-noise and were out of scope for this slice. Can land as a follow-up slice when a clear ROI argument surfaces.",
    dimensionCWorkbenchCardValuePins:
      "Optional stretch deliverable of this slice. Workbench card-level `value` / `status` / `tone` cross-check against the engine VALUE pins. Skipped to keep this slice scoped to the engine-side accuracy-discipline delivery. Can land as a follow-up slice once the workbench card surface needs independent audit.",
    wallFormulaFamilyWidening:
      "Step 6 conditional. timber_stud_wall engine output (Rw=31 under auto-select / Rw=50 under dynamic lane) is lower than manufacturer field data (~45-50 dB). Stays source-blocked pending external wood-stud coupling evidence. AP4 respected.",
    dynamicAirborneSplitV2:
      "14 apply* floor/cap guards + composition scaffolding (~3150 lines) still live in dynamic-airborne.ts. Needs composer injection to break the circular-import blocker. Zero user-facing accuracy/coverage delta; pure architecture.",
    framedWallMonotonicFloorWarningDrift:
      "F3 from step 7. Cosmetic warning drift only; numeric outputs unchanged."
  },
  kept: {
    frozenUpstreamClosuresUntouched: true,
    blockedSourceBackedQueueUnchanged: true,
    masonryFlankingInversionFixIntact: true,
    labFallbackAnchorIntact: true,
    invariantsMatrixGreen: true,
    engineThicknessGuardrailLive: true,
    splitRefactorV1Intact: true,
    accuracyContractPreserved: true,
    sameMaterialSplitInvarianceLanded: true,
    crossModeTortureMatrixGreen: true,
    corridorSurfaceValuePinned: true,
    physicalInvariantsBankOnCorridorGreen: true
  }
} as const;

describe("post-wall corridor surface value pinning v1 — next slice selection contract", () => {
  it("records the slice id and the next selected slice", () => {
    expect(POST_SLICE_CONTRACT.closedSliceId).toBe(
      "wall_corridor_surface_value_pinning_v1"
    );
    expect(POST_SLICE_CONTRACT.selectedImplementationSlice).toBe(
      "good_calculator_final_audit_v1"
    );
  });

  it("pins the evidence ledger to the corridor VALUE matrix + source trace matrix + archived slice plan", () => {
    expect(POST_SLICE_CONTRACT.evidenceLedger).toContain(
      "packages/engine/src/dynamic-airborne-wall-selector-value-pins.test.ts"
    );
    expect(POST_SLICE_CONTRACT.evidenceLedger).toContain(
      "packages/engine/src/dynamic-airborne-wall-selector-trace-matrix.test.ts"
    );
    expect(POST_SLICE_CONTRACT.evidenceLedger).toContain(
      "packages/engine/src/floor-library-sweep.test.ts"
    );
    expect(POST_SLICE_CONTRACT.evidenceLedger).toContain(
      "docs/calculator/SLICE_WALL_CORRIDOR_SURFACE_VALUE_PINNING_PLAN.md"
    );
  });

  it("records the five deferred follow-up tracks", () => {
    expect(POST_SLICE_CONTRACT.deferred.dimensionBDeepHybridSwapValuePins.length).toBeGreaterThan(0);
    expect(POST_SLICE_CONTRACT.deferred.dimensionCWorkbenchCardValuePins.length).toBeGreaterThan(0);
    expect(POST_SLICE_CONTRACT.deferred.wallFormulaFamilyWidening.length).toBeGreaterThan(0);
    expect(POST_SLICE_CONTRACT.deferred.dynamicAirborneSplitV2.length).toBeGreaterThan(0);
    expect(
      POST_SLICE_CONTRACT.deferred.framedWallMonotonicFloorWarningDrift.length
    ).toBeGreaterThan(0);
  });

  it("keeps every accuracy contract intact and adds corridor-surface invariants as newly landed", () => {
    expect(POST_SLICE_CONTRACT.kept.frozenUpstreamClosuresUntouched).toBe(true);
    expect(POST_SLICE_CONTRACT.kept.blockedSourceBackedQueueUnchanged).toBe(true);
    expect(POST_SLICE_CONTRACT.kept.masonryFlankingInversionFixIntact).toBe(true);
    expect(POST_SLICE_CONTRACT.kept.labFallbackAnchorIntact).toBe(true);
    expect(POST_SLICE_CONTRACT.kept.invariantsMatrixGreen).toBe(true);
    expect(POST_SLICE_CONTRACT.kept.engineThicknessGuardrailLive).toBe(true);
    expect(POST_SLICE_CONTRACT.kept.splitRefactorV1Intact).toBe(true);
    expect(POST_SLICE_CONTRACT.kept.accuracyContractPreserved).toBe(true);
    expect(POST_SLICE_CONTRACT.kept.sameMaterialSplitInvarianceLanded).toBe(true);
    expect(POST_SLICE_CONTRACT.kept.crossModeTortureMatrixGreen).toBe(true);
    expect(POST_SLICE_CONTRACT.kept.corridorSurfaceValuePinned).toBe(true);
    expect(POST_SLICE_CONTRACT.kept.physicalInvariantsBankOnCorridorGreen).toBe(true);
  });
});
