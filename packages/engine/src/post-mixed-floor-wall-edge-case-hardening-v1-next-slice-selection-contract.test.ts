// Post-slice contract — `mixed_floor_wall_edge_case_hardening_v1`
// closed on 2026-04-22. Master-plan step 7.
//
// What closed:
//   - **Dimension A (engine wall gap-close)**: four new wall
//     cases landed in `ENGINE_MIXED_GENERATED_CASES`, closing
//     the 3-case vs. 30-case floor/wall asymmetry and bringing
//     the engine surface to 6/6 wall preset parity:
//       • wall-masonry-brick   (lab-fallback anchor exercise)
//       • wall-clt-local       (formula-owned CLT lane)
//       • wall-lsf-knauf       (Knauf exact anchor + studType)
//       • wall-timber-stud     (wood_stud formula-owned)
//   - **Dimension C (cross-mode 8-overlay torture matrix)**:
//     `mixed-floor-wall-cross-mode-wall-extension-matrix.test.ts`
//     iterates 8 overlays × 4 new cases = 32 assertions:
//       O1 hostile-input (5 thickness classes + 3 stack-level
//          classes: unknown material / empty / absurd single)
//       O2 reorder (strict on symmetric cases, ±10 dB bounded
//          drift on asymmetric)
//       O3 save-load JSON round-trip
//       O4 duplicate-swap reverse-mask grid
//       O5 history-replay studType toggle idempotency
//       O6 physical invariants (I1/I2/I3)
//       O7 engine-direct dynamic lab Rw drift guard
//       O8 many-layer (10×) stability + monotonicity
//   - **Two real engine bugs caught and fixed (F1, F2)**:
//       F1 masonry calibrators fell off lane when a same-
//          material core was split (+4 dB drift on Porotherm
//          50+50). Fixed with `coalesceSameMaterialSolidLeaves`
//          helper in `dynamic-airborne-masonry-calibration.ts`,
//          applied across all nine masonry calibrators.
//          Guarded by
//          `dynamic-airborne-masonry-same-material-split-invariance.test.ts`.
//       F2 verified-catalog exact match stopped firing when
//          a same-material layer split (+5 dB drift on Knauf
//          LSF 70 mm glasswool → 35+35). Fixed with
//          `coalesceAdjacentSameMaterialLayers` helper in
//          `airborne-topology.ts`, applied symmetrically at
//          `layersApproximatelyMatch`. Guarded by
//          `airborne-verified-catalog-same-material-split-invariance.test.ts`.
//   - **Two test-discipline findings (F3 deferred, F4 refined)**:
//       F3 framed-wall monotonic-floor guard emits an extra
//          diagnostic warning on board-layer splits — numeric
//          outputs unchanged, cosmetic drift only. Mitigated
//          by scoping `wall-lsf-knauf` splitPlans to the
//          porous glasswool fill only; facing-split torture
//          deferred.
//       F4 reorder-invariance test initially assumed all
//          cases were symmetric — LSF + timber-stud internal
//          cavities `[gap, fill]` vs `[fill, gap]` are
//          physically distinguishable. Refined to assert
//          bit-equality only on truly symmetric cases and
//          ±10 dB bounded drift on asymmetric.
//   - **2026-04-21 session-close drift corrected**: 54 unused-
//     import lint errors in `dynamic-airborne.ts` +
//     `dynamic-airborne-masonry-calibration.ts` removed,
//     plus a `formattedValue` → `value` type-only typo in
//     `raw-wall-hostile-input-route-card-matrix.test.ts` —
//     baseline `pnpm check` now truly green end-to-end.
//
// What the slice did NOT do (scope-limited):
//   - **Step 6 `wall_formula_family_widening_v1`**: still
//     conditional — timber stud accuracy gap (Rw=31 vs.
//     manufacturer ~45-50 dB) stays source-blocked pending
//     external lab data for wood-stud coupling. AP4 (blocked-
//     source posture never loosened) respected.
//   - **Dimension B corridor VALUE pins**: still deferred —
//     narrative pins on `dynamic-airborne-wall-selector-trace-matrix`
//     corridors already guard the surface; VALUE pins require
//     per-corridor layer configuration work.
//   - **`dynamic_airborne_split_refactor_v2`**: composer-
//     injection blocker unchanged. Attempted engine-entry
//     coalesce pass (to also fix F3) landed 18 test failures
//     because framed-wall benchmarks rely on the physical
//     distinction between `2×12.5 mm gyp` (double-board) and
//     `1×25 mm` (single-board) — reverted. Coalesce stays
//     scoped to the catalog-match + masonry-calibration sites.
//   - **F3 board-facing split warning**: deferred until the
//     monotonic-floor guard's sibling-variant generator can
//     be made layer-count invariant. Low priority — cosmetic
//     only.
//
// Next selected slice:
//   All mission-critical steps 1-7 are now green. Completion
//   signals C1 (wall archetypes ≥6) and C5 (reorder invariance)
//   are fully green; C4 (hostile input) is green on both floor
//   and wall; C6 (architectural hygiene) is partial with
//   split-v1 intact and v2 documented-deferred. C2 and C3
//   preset surface green with corridor surface deferred.
//
//   Selected: `good_calculator_final_audit_v1` (master-plan
//   step 8). The final-audit slice authors the executable
//   grid-consistency test, verifies every completion signal
//   with an executable assertion, and opens the post-
//   calculator roadmap.
//
// Rationale:
//   - Step 7 is the last non-audit slice in the master
//     sequence. No accuracy work remains that does not
//     require external evidence (step 6) or longer-form
//     follow-up (Dimension B corridor pins, split v2, F3).
//   - Step 8 consolidates the full resume triangle into a
//     "the calculator is done" session-close posture and
//     opens the roadmap for productization work that the
//     master plan explicitly deferred (§1 non-goals).

import { describe, expect, it } from "vitest";

export const POST_SLICE_CONTRACT = {
  closedSliceId: "mixed_floor_wall_edge_case_hardening_v1",
  closedSliceRole:
    "Brought ENGINE_MIXED_GENERATED_CASES to 6/6 wall preset parity by adding four new wall cases (masonry brick, CLT local, LSF Knauf, timber stud) + authored the 8-overlay cross-mode torture matrix (32 assertions) + landed two real engine bug fixes (F1 masonry-calibrator same-material-split, F2 verified-catalog same-material-split) + corrected the 2026-04-21 session-close drift (54 lint errors + 1 type-only typo). Primary-objective ROI delivered: wall surface consolidation unblocks step 8 final audit.",
  evidenceLedger: [
    "packages/engine/src/mixed-floor-wall-cross-mode-wall-extension-matrix.test.ts",
    "packages/engine/src/mixed-floor-wall-generated-test-helpers.ts",
    "packages/engine/src/dynamic-airborne-masonry-same-material-split-invariance.test.ts",
    "packages/engine/src/airborne-verified-catalog-same-material-split-invariance.test.ts",
    "packages/engine/src/dynamic-airborne-masonry-calibration.ts",
    "packages/engine/src/airborne-topology.ts",
    "packages/engine/src/airborne-verified-catalog.ts",
    "docs/calculator/SLICE_MIXED_FLOOR_WALL_EDGE_CASE_HARDENING_PLAN.md"
  ],
  selectedImplementationSlice: "good_calculator_final_audit_v1",
  selectedImplementationSliceRole:
    "Master-plan step 8. Author coverage-grid-consistency.test.ts asserting §3 grid matches engine reality; verify every C1-C6 completion signal with an executable assertion; archive the full resume triangle into a session-close checkpoint; open the post-calculator productization roadmap (explicit non-goal until C1-C6 all green).",
  deferred: {
    wallFormulaFamilyWidening:
      "Step 6 conditional. timber_stud_wall engine output (Rw=31 under auto-select / Rw=50 under dynamic lane) is lower than manufacturer field data (~45-50 dB). Stays source-blocked pending external wood-stud coupling evidence. AP4 respected.",
    dimensionBCorridorValuePins:
      "Extend VALUE pins from presets to the dynamic-airborne-wall-selector-trace-matrix corridors (double_leaf, lined_massive_wall, aac_boundary, g5_sibling, heavy_core_trim, lab_double_stud, deep_hybrid_swap_*). Narrative pins already guard these cases.",
    dynamicAirborneSplitV2:
      "14 apply* floor/cap guards + composition scaffolding (~3150 lines) still live in dynamic-airborne.ts. Guards recursively call the composer → circular-import blocker needs composer injection. Engine-entry coalesce experiment showed why broad normalization is tricky; targeted composer injection is the correct path.",
    framedWallMonotonicFloorWarningDrift:
      "F3. Monotonic-floor guard in dynamic-airborne.ts emits an extra diagnostic warning when a board-layer is split into equal halves (numeric outputs unchanged). Low priority — cosmetic. Mitigated by scoping wall-lsf-knauf splitPlans to porous fill only."
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
    crossModeTortureMatrixGreen: true
  }
} as const;

describe("post-mixed-floor-wall edge-case hardening v1 — next slice selection contract", () => {
  it("records the slice id and the next selected slice", () => {
    expect(POST_SLICE_CONTRACT.closedSliceId).toBe(
      "mixed_floor_wall_edge_case_hardening_v1"
    );
    expect(POST_SLICE_CONTRACT.selectedImplementationSlice).toBe(
      "good_calculator_final_audit_v1"
    );
  });

  it("pins the evidence ledger to the torture matrix + regression guards + engine fix sites", () => {
    expect(POST_SLICE_CONTRACT.evidenceLedger).toContain(
      "packages/engine/src/mixed-floor-wall-cross-mode-wall-extension-matrix.test.ts"
    );
    expect(POST_SLICE_CONTRACT.evidenceLedger).toContain(
      "packages/engine/src/dynamic-airborne-masonry-same-material-split-invariance.test.ts"
    );
    expect(POST_SLICE_CONTRACT.evidenceLedger).toContain(
      "packages/engine/src/airborne-verified-catalog-same-material-split-invariance.test.ts"
    );
    expect(POST_SLICE_CONTRACT.evidenceLedger).toContain(
      "packages/engine/src/dynamic-airborne-masonry-calibration.ts"
    );
    expect(POST_SLICE_CONTRACT.evidenceLedger).toContain(
      "packages/engine/src/airborne-topology.ts"
    );
    expect(POST_SLICE_CONTRACT.evidenceLedger).toContain(
      "packages/engine/src/airborne-verified-catalog.ts"
    );
    expect(POST_SLICE_CONTRACT.evidenceLedger).toContain(
      "docs/calculator/SLICE_MIXED_FLOOR_WALL_EDGE_CASE_HARDENING_PLAN.md"
    );
  });

  it("records the four deferred follow-up tracks", () => {
    expect(POST_SLICE_CONTRACT.deferred.wallFormulaFamilyWidening.length).toBeGreaterThan(0);
    expect(POST_SLICE_CONTRACT.deferred.dimensionBCorridorValuePins.length).toBeGreaterThan(0);
    expect(POST_SLICE_CONTRACT.deferred.dynamicAirborneSplitV2.length).toBeGreaterThan(0);
    expect(
      POST_SLICE_CONTRACT.deferred.framedWallMonotonicFloorWarningDrift.length
    ).toBeGreaterThan(0);
  });

  it("keeps every accuracy contract intact and adds the new landed invariants", () => {
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
  });
});
