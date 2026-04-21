// Post-slice contract — `masonry_flanking_inversion_fix_v1` closed
// on 2026-04-21. Pinned selection for the next slice so the chain
// stays readable by agents resuming the calculator work.
//
// Why this slice:
//   Running the `wall_lsf_timber_preset_pack_with_invariants_v1`
//   slice's first artifact — `wall-physical-invariants-matrix.test.ts`
//   — surfaced a real engine accuracy bug: Wienerberger Porotherm
//   assemblies in `field_between_rooms` and `building_prediction`
//   contexts produced apparent R'w > lab Rw, violating ISO 140-4.
//   The invariants matrix caught what the field-side sweep had been
//   hiding behind mass-law overestimates. Fix landed before the slice
//   closed, as required by SLICE_LSF_TIMBER_PRESET_WITH_INVARIANTS_PLAN
//   §Stop Conditions.
//
// What landed:
//   - Engine: `findVerifiedAirborneAssemblyMatchWithLabFallback` +
//     `applyVerifiedAirborneCatalogAnchor` field fallback lane
//     (`packages/engine/src/airborne-verified-catalog.ts`).
//   - Engine: `calculate-assembly.ts` now forwards the overlay's
//     `fieldFlankingPenaltyDb` so the fallback can compute
//     `lab_benchmark - flanking_penalty` as the apparent target.
//   - Audit: `airborne-verified-catalog-lab-fallback.test.ts` (unit).
//   - Audit: `airborne-catalog-field-anchor-lab-fallback.test.ts`
//     (integration).
//   - Acceptance: `wall-physical-invariants-matrix.test.ts` now green
//     across 6 wall presets × 3 context modes (I1/I2/I3).
//   - Probe: `masonry-flanking-bug-probe.test.ts` removed — purpose
//     served, bug fixed, invariants matrix is the durable guard.
//
// Next selected slice:
//   `wall_lsf_timber_preset_pack_with_invariants_v1` resumes. The
//   physical invariants step landed inside this fix (since the bug
//   blocked the slice); remaining deliverables are the LSF + timber
//   stud preset pack, the LSF benchmark pin, the field VALUE pinning
//   on AAC / masonry / CLT, plus the parent slice's post-contract.

import { describe, expect, it } from "vitest";

export const POST_SLICE_CONTRACT = {
  closedSliceId: "masonry_flanking_inversion_fix_v1",
  closedSliceRole:
    "Engine accuracy blocker surfaced by the physical invariants matrix; fixed via lab-fallback anchor so field R'w is bounded by lab Rw under ISO 140-4 regardless of whether the catalog carries a dedicated field entry.",
  evidenceLedger: [
    "packages/engine/src/airborne-verified-catalog-lab-fallback.test.ts",
    "packages/engine/src/airborne-catalog-field-anchor-lab-fallback.test.ts",
    "packages/engine/src/airborne-verified-catalog.ts",
    "packages/engine/src/calculate-assembly.ts",
    "apps/web/features/workbench/wall-physical-invariants-matrix.test.ts",
    "apps/web/features/workbench/wall-preset-expansion-benchmarks.test.ts"
  ],
  selectedImplementationSlice: "wall_lsf_timber_preset_pack_with_invariants_v1",
  selectedImplementationSliceRole:
    "Land LSF + timber stud wall presets with `airborneDefaults` wiring, pin LSF benchmark Rw and timber stud drift-guard Rw, pin AAC / masonry / CLT field VALUE drift guards, keep the physical invariants matrix green at 6 × 3.",
  kept: {
    frozenUpstreamClosuresUntouched: true,
    blockedSourceBackedQueueUnchanged: true,
    labMasonryAnchorBehaviourUnchanged: true,
    fieldEntryAnchorBehaviourUnchanged: true
  }
} as const;

describe("post-masonry flanking inversion fix — next slice selection contract", () => {
  it("records what the fix closed and what the next slice is", () => {
    expect(POST_SLICE_CONTRACT.closedSliceId).toBe("masonry_flanking_inversion_fix_v1");
    expect(POST_SLICE_CONTRACT.selectedImplementationSlice).toBe(
      "wall_lsf_timber_preset_pack_with_invariants_v1"
    );
  });

  it("keeps the ledger pointed at source-of-truth artifacts, not narrative docs", () => {
    expect(POST_SLICE_CONTRACT.evidenceLedger).toContain(
      "packages/engine/src/airborne-verified-catalog-lab-fallback.test.ts"
    );
    expect(POST_SLICE_CONTRACT.evidenceLedger).toContain(
      "packages/engine/src/airborne-catalog-field-anchor-lab-fallback.test.ts"
    );
    expect(POST_SLICE_CONTRACT.evidenceLedger).toContain(
      "apps/web/features/workbench/wall-physical-invariants-matrix.test.ts"
    );
    expect(POST_SLICE_CONTRACT.evidenceLedger).toContain(
      "packages/engine/src/airborne-verified-catalog.ts"
    );
    expect(POST_SLICE_CONTRACT.evidenceLedger).toContain(
      "packages/engine/src/calculate-assembly.ts"
    );
  });

  it("pins the invariants every downstream slice still has to honour", () => {
    expect(POST_SLICE_CONTRACT.kept.frozenUpstreamClosuresUntouched).toBe(true);
    expect(POST_SLICE_CONTRACT.kept.blockedSourceBackedQueueUnchanged).toBe(true);
    expect(POST_SLICE_CONTRACT.kept.labMasonryAnchorBehaviourUnchanged).toBe(true);
    expect(POST_SLICE_CONTRACT.kept.fieldEntryAnchorBehaviourUnchanged).toBe(true);
  });
});
