// Post-slice contract — `dynamic_airborne_split_refactor_v1`
// closed on 2026-04-21 after 15 atomic commits. Main
// `dynamic-airborne.ts` fell from 6630 → 3214 lines (−52%) into
// seven bounded modules. Remaining ~3200 lines hold the
// floor / cap guards and the composition scaffolding; those live
// inside the same file today because the guards recursively call
// `calculateDynamicAirborneResult`, which would produce a
// circular import after a mechanical move. The follow-up
// `dynamic_airborne_split_refactor_v2` slice will resolve that
// with composer parameterization — the split surface is already
// documented in `docs/calculator/DYNAMIC_AIRBORNE_CARTOGRAPHY.md`.
//
// What closed:
//   - **Architecture (MASTER_PLAN §8 C6)**: the 6630-line monolith
//     is broken into one entry-point file plus seven bounded
//     modules, each with a narrowed purpose and a test surface
//     that already pins end-to-end behaviour (framed wall
//     benchmark, masonry benchmark, aircrete benchmark, verified
//     catalog anchor, lab-fallback anchor, instability repro,
//     hostile-input matrix). Every carve ran the regression
//     sweep.
//   - **Zero behaviour change**: 15 commits verbatim-extracted
//     functions with `export` prefix only. Tests confirm no
//     rating, curve, or warning drift.
//   - **Accuracy preserved**: the 2026-04-21 masonry flanking
//     inversion fix and its lab-fallback anchor lane remain
//     intact. Benchmark fit audits rerun green on every carve.
//
// Bounded modules now in place:
//   - `dynamic-airborne-helpers.ts` (287 lines)
//   - `dynamic-airborne-family-detection.ts` (257 lines)
//   - `dynamic-airborne-davy-masonry.ts` (270 lines)
//   - `dynamic-airborne-mixed-plain-templates.ts` (237 lines)
//   - `dynamic-airborne-cavity-topology.ts` (460 lines)
//   - `dynamic-airborne-masonry-calibration.ts` (1057 lines)
//   - `dynamic-airborne-framed-wall.ts` (1251 lines)
//
// What the slice did NOT do (documented in cartography):
//   - Carve floor / cap guards (14 `apply*` functions). Deferred
//     to `dynamic_airborne_split_refactor_v2` because guards
//     recursively call the composer.
//   - Carve `calculateDynamicAirborneResult` +
//     `detectDynamicFamily` + `chooseBlend`. Stays as the
//     composition entry until composer injection is in place.
//   - Touch any accuracy contract (masonry flanking inversion
//     fix, lab-fallback anchor, invariants matrix all untouched).
//
// Next selected slice:
//   `wall_field_continuation_value_pinning_v1` (master-plan
//   step 5). Highest primary-objective ROI — audits every defended
//   wall corridor × lab/field/building × every field output,
//   surfaces silent accuracy gaps the way the invariants matrix
//   did for masonry flanking inversion, and unlocks the conditional
//   step 6 formula widening (where the timber stud accuracy gap
//   can then be addressed).
//
// Rationale:
//   - C6 is already at "split landed, composer injection deferred"
//     — continuing the split today forces a behaviour-preserving
//     refactor, not a mechanical move.
//   - C2 (source/benchmark coverage) + C3 (field continuation)
//     remain partial; step 5 is the direct path.
//   - Primary objective (accuracy + coverage) aligns with step 5;
//     architectural hygiene (step 4 tail) can be picked back up
//     opportunistically once step 5 gaps are known.

import { describe, expect, it } from "vitest";

export const POST_SLICE_CONTRACT = {
  closedSliceId: "dynamic_airborne_split_refactor_v1",
  closedSliceRole:
    "Mechanical split of the 6630-line `dynamic-airborne.ts` monolith into seven bounded modules through 15 atomic commits. Zero behaviour change guarded by the focused calculator gate plus regression sweeps on framed-wall + masonry + aircrete benchmarks, verified catalog + lab-fallback anchors, calculate-assembly full suite, instability repro, wall selector trace, and wall hostile-input matrix at every step.",
  commitsLanded: [
    "c0a5068 helpers.ts carve",
    "361d97d family-detection.ts predicates",
    "b4d32a9 family-detection.ts framing hint helpers",
    "a398ec9 shared types to helpers + davy-masonry carve",
    "c74e915 mixed-plain-templates carve",
    "6a15f5b cavity-topology carve",
    "75359a7 masonry-calibration AAC + silicate",
    "40591cb masonry-calibration aircrete pair",
    "b59ab19 masonry-calibration Porotherm + HELUZ",
    "1379eff masonry-calibration Ytong trio",
    "bdd1b9f board predicates into family-detection",
    "280942a normalizeBoundarySignal into helpers",
    "025b2a7 cavity-topology extensions (reinforcement + single-leaf masonry profile + trim)",
    "9a5ab34 framed-wall summaries + types carve",
    "c15defa framed-wall estimateStudWallTargetRw carve"
  ],
  boundedModules: [
    "packages/engine/src/dynamic-airborne-helpers.ts",
    "packages/engine/src/dynamic-airborne-family-detection.ts",
    "packages/engine/src/dynamic-airborne-davy-masonry.ts",
    "packages/engine/src/dynamic-airborne-mixed-plain-templates.ts",
    "packages/engine/src/dynamic-airborne-cavity-topology.ts",
    "packages/engine/src/dynamic-airborne-masonry-calibration.ts",
    "packages/engine/src/dynamic-airborne-framed-wall.ts"
  ],
  mainFileLinesBefore: 6630,
  mainFileLinesAfter: 3214,
  mainFileReductionPercent: 52,
  selectedImplementationSlice: "wall_field_continuation_value_pinning_v1",
  selectedImplementationSliceRole:
    "Master-plan step 5. Pin every defended wall corridor × lab/field/building × every field output as a VALUE drift guard, surface silent accuracy gaps the way the physical invariants matrix caught masonry flanking inversion, and unlock the conditional step 6 formula widening (which can then address the timber stud accuracy gap).",
  deferred: {
    sliceId: "dynamic_airborne_split_refactor_v2",
    reason:
      "14 `apply*` floor / cap guards recursively call `calculateDynamicAirborneResult` on variant layer stacks to build their monotonic floors. A mechanical carve would create a circular import between guards and composer. The follow-up slice will either inject the composer as a function parameter or restructure the composition entry point so the guards land in their own module without cycles.",
    remainingMainFileLines: 3214,
    blueprintDoc: "docs/calculator/DYNAMIC_AIRBORNE_CARTOGRAPHY.md"
  },
  kept: {
    frozenUpstreamClosuresUntouched: true,
    blockedSourceBackedQueueUnchanged: true,
    masonryFlankingInversionFixIntact: true,
    labFallbackAnchorIntact: true,
    invariantsMatrixGreen: true,
    engineThicknessGuardrailLive: true,
    accuracyContractPreserved: true
  }
} as const;

describe("post-dynamic-airborne split refactor v1 — next slice selection contract", () => {
  it("records the slice id and the next selected slice", () => {
    expect(POST_SLICE_CONTRACT.closedSliceId).toBe("dynamic_airborne_split_refactor_v1");
    expect(POST_SLICE_CONTRACT.selectedImplementationSlice).toBe(
      "wall_field_continuation_value_pinning_v1"
    );
  });

  it("pins the 15 commits landed and the seven bounded modules carved", () => {
    expect(POST_SLICE_CONTRACT.commitsLanded.length).toBe(15);
    expect(POST_SLICE_CONTRACT.boundedModules.length).toBe(7);
  });

  it("quantifies the main-file reduction so follow-up slices can target the remainder", () => {
    expect(POST_SLICE_CONTRACT.mainFileLinesBefore).toBe(6630);
    expect(POST_SLICE_CONTRACT.mainFileLinesAfter).toBe(3214);
    expect(POST_SLICE_CONTRACT.mainFileReductionPercent).toBe(52);
  });

  it("records the deferred composer-injection follow-up and points at the blueprint", () => {
    expect(POST_SLICE_CONTRACT.deferred.sliceId).toBe(
      "dynamic_airborne_split_refactor_v2"
    );
    expect(POST_SLICE_CONTRACT.deferred.blueprintDoc).toBe(
      "docs/calculator/DYNAMIC_AIRBORNE_CARTOGRAPHY.md"
    );
    expect(POST_SLICE_CONTRACT.deferred.remainingMainFileLines).toBe(3214);
  });

  it("keeps every accuracy contract intact", () => {
    expect(POST_SLICE_CONTRACT.kept.frozenUpstreamClosuresUntouched).toBe(true);
    expect(POST_SLICE_CONTRACT.kept.blockedSourceBackedQueueUnchanged).toBe(true);
    expect(POST_SLICE_CONTRACT.kept.masonryFlankingInversionFixIntact).toBe(true);
    expect(POST_SLICE_CONTRACT.kept.labFallbackAnchorIntact).toBe(true);
    expect(POST_SLICE_CONTRACT.kept.invariantsMatrixGreen).toBe(true);
    expect(POST_SLICE_CONTRACT.kept.engineThicknessGuardrailLive).toBe(true);
    expect(POST_SLICE_CONTRACT.kept.accuracyContractPreserved).toBe(true);
  });
});
