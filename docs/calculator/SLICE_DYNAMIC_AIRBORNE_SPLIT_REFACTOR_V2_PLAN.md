# Slice Plan - Dynamic Airborne Split Refactor v2

Status: CLOSED 2026-04-26 (selected 2026-04-24 after
`all_caller_invalid_thickness_guard_v1` closed no-runtime; Gate A
landed no-runtime; Gate B carved eleven guards; Gate C closed after
broad validation)

## Objective

Reduce the remaining `dynamic-airborne.ts` architecture debt without
changing calculator behavior.

The file is 1793 lines after the eleventh Gate B carve, now below the
2000-line hygiene threshold, and the remaining block is not a
source or formula problem. It is a composition problem: several floor /
cap / correction guard functions recursively call `calculateDynamicAirborneResult(...)`
on layer variants, so a mechanical move would create a circular import
unless the composer is passed in as an explicit dependency.

## Non-Goals

- Do not change defended calculator values.
- Do not retune dynamic airborne formulas or curve blending.
- Do not widen source-family support.
- Do not reopen `GDMTXA04A`, `C11c`, raw bare open-box/open-web impact,
  wall-selector behavior, reinforced-concrete formula scope, or timber
  exact-row follow-ups.
- Do not deduplicate, rename, or rewrite guard logic during a mechanical
  carve.
- Do not resume `project_access_policy_route_integration_v1` during this
  calculator architecture slice.

## Why This Slice Is High ROI Now

`all_caller_invalid_thickness_guard_v1` closed the last explicit
cross-cutting engine thickness-validity partial row. The remaining
source-family gaps are source-blocked or optional value-pin hardening.
By contrast, `dynamic-airborne.ts` was the main calculator file still
violating the architecture hygiene signal C6 before this slice closed.

This slice improved future accuracy work by shrinking review scope and
making the floor/cap guard boundary explicit, while preserving every
current numeric result.

## Current Baseline

- `dynamic_airborne_split_refactor_v1` already carved seven modules:
  helpers, family detection, Davy masonry, mixed-plain templates, cavity
  topology, masonry calibration, and framed-wall logic.
- `dynamic-airborne.ts` currently has 1793 lines after the eleventh v2
  carve; `dynamic-airborne-correction-guards.ts` has 1422 lines.
- `docs/calculator/DYNAMIC_AIRBORNE_CARTOGRAPHY.md` records the blocker:
  the remaining floor/cap guards call the composer recursively.
- Broad `pnpm check` is green after Gate C closeout:
  engine 219 files / 1216 tests, web 150 files / 864 passed +
  18 skipped, build 5/5 with known non-fatal `sharp/@img` warnings.

## Gate Plan

### Gate A - inventory remaining guard call graph

Status: LANDED 2026-04-24, no runtime change.

No runtime change. Build the exact call graph and carve order before any
module move:

- list every remaining `apply*` floor/cap guard in
  `dynamic-airborne.ts`;
- identify which guards call `calculateDynamicAirborneResult(...)`
  directly or indirectly;
- define the composer function type to inject;
- choose the smallest first carve that can move without behavior change;
- update `DYNAMIC_AIRBORNE_CARTOGRAPHY.md` with the fresh line count and
  selected carve order.

Gate A may add a planning/contract test if needed, but it must not move
runtime code.

Gate A result:

- Baseline `pnpm calculator:gate:current` was green before edits
  (engine 85 files / 391 tests, web 36 files / 170 passed +
  18 skipped, build 5/5, whitespace guard clean; known non-fatal
  `sharp/@img` warnings only).
- `dynamic-airborne.ts` remains 3152 physical lines.
- The remaining 14 top-level `apply*` guards split into six direct
  recursive composer callers and eight non-recursive correction guards.
- Direct recursive composer guards:
  `applySingleLeafMasonryMonotonicFloor`,
  `applyNarrowHeavyDoubleLeafGapCap`,
  `applyLinedMassiveMasonryMonotonicFloor`,
  `applyFramedReinforcementMonotonicFloor`,
  `applyMicroGapFillEquivalenceGuard`, and
  `applyAmbiguousFamilyBoundaryHold`.
- Non-recursive correction guards:
  `applyHeavyUnframedCavityScreeningCap`,
  `applyMixedSecurityBoardDoubleStudFieldTrim`,
  `applyHighFillSingleBoardStudFieldLift`,
  `applyMixedBoardEmptyCavityFieldMidbandLift`,
  `applyMixedPremiumSplitFieldLift`,
  `applyDiamondHybridResilientFieldMidbandTrim`,
  `applyMixedPlainModerateSingleBoardLabTemplate`, and
  `applyPremiumSingleBoardFieldCorrection`.
- The planned injected type is:

```ts
export type DynamicAirborneComposer = (
  layers: readonly ResolvedLayer[],
  options: DynamicAirborneOptions
) => DynamicAirborneResult;
```

- First carve target: move `applyMicroGapFillEquivalenceGuard` into
  `dynamic-airborne-correction-guards.ts` with the composer passed as a
  `DynamicAirborneComposer`. It is the smallest recursive guard and
  exercises the real circular-import blocker without also moving
  `FAMILY_LABELS` or the larger monotonic floor/cap blocks.
- The Gate A planning contract was superseded by the Gate B first-carve
  contract once runtime code moved.

### Gate B - composer injection and first mechanical carve

Status: CLOSED 2026-04-26. Eleven bounded carves landed and the slice
closed at Gate C because `dynamic-airborne.ts` is now below the C6 line
threshold after broad validation.

Valid Gate B work:

- introduce a narrow composer function parameter for the guards that
  need recursive evaluation;
- move `applyMicroGapFillEquivalenceGuard` into
  `dynamic-airborne-correction-guards.ts`;
- replace only that moved guard's direct recursive composer call with
  the injected `composer(...)` call;
- keep code movement as verbatim as TypeScript allows;
- prove zero behavior change with focused dynamic airborne, hostile
  input, benchmark, and invariants gates.

Invalid Gate B work:

- formula retunes;
- value changes accepted because they look "better";
- guard deduplication mixed into the carve;
- circular imports;
- broad source-family reopening.

Gate B first carve result:

- `DynamicAirborneComposer` now lives in
  `dynamic-airborne-helpers.ts`.
- `applyMicroGapFillEquivalenceGuard` now lives in
  `dynamic-airborne-correction-guards.ts`.
- The moved guard calls `composer(...)`; it no longer imports or calls
  `calculateDynamicAirborneResult(...)` directly.
- `dynamic-airborne.ts` imports the moved guard and passes
  `calculateDynamicAirborneResult` from the existing call site.
- Source size after the move:
  - `dynamic-airborne.ts`: 3046 physical lines.
  - `dynamic-airborne-correction-guards.ts`: 131 physical lines.
- Executable first-carve contract:
  superseded by the second-carve contract after the next move landed.

Gate B second carve result:

- `applyHeavyUnframedCavityScreeningCap` now lives in
  `dynamic-airborne-correction-guards.ts`.
- The moved cap guard remains non-recursive and does not need a composer
  parameter.
- Source size after the move:
  - `dynamic-airborne.ts`: 2950 physical lines.
  - `dynamic-airborne-correction-guards.ts`: 237 physical lines.
- Executable second-carve contract:
  `packages/engine/src/dynamic-airborne-split-v2-gate-b-second-carve-contract.test.ts`.
- Validation after the second carve:
  - targeted second-carve contract + coverage-grid contract: 2 files /
    10 tests green;
  - focused dynamic airborne / hostile-input behavior sweep: 7 files /
    248 tests green;
  - engine lint and engine typecheck green;
  - `pnpm calculator:gate:current` green: engine 86 files / 396 tests,
    web 36 files / 170 passed + 18 skipped, build 5/5, whitespace guard
    clean; known non-fatal `sharp/@img` warnings only;
  - post-build `pnpm --filter @dynecho/web typecheck` green.

Next Gate B carve target: `applyMixedSecurityBoardDoubleStudFieldTrim`.
Reason: it is the smallest remaining non-recursive field trim and can
move into `dynamic-airborne-correction-guards.ts` without adding another
recursive composer path. Keep it isolated from the larger field
correction, template, and monotonic floor blocks.

Gate B third carve result:

- `applyMixedSecurityBoardDoubleStudFieldTrim` now lives in
  `dynamic-airborne-correction-guards.ts`.
- The moved field trim remains non-recursive and does not need a
  composer parameter.
- Source size after the move:
  - `dynamic-airborne.ts`: 2880 physical lines.
  - `dynamic-airborne-correction-guards.ts`: 310 physical lines.
- Executable third-carve contract:
  `packages/engine/src/dynamic-airborne-split-v2-gate-b-third-carve-contract.test.ts`.
- Validation after the third carve:
  - targeted third-carve contract + coverage-grid contract: 2 files /
    10 tests green;
  - focused dynamic airborne / hostile-input behavior sweep: 7 files /
    248 tests green;
  - engine lint and engine typecheck green;
  - `pnpm calculator:gate:current` green: engine 86 files / 396 tests,
    web 36 files / 170 passed + 18 skipped, build 5/5, whitespace guard
    clean; known non-fatal `sharp/@img` warnings only;
  - post-build `pnpm --filter @dynecho/web typecheck` green.

Next Gate B carve target: `applyHighFillSingleBoardStudFieldLift`.
Reason: it is the next smallest remaining non-recursive correction
guard and can move into `dynamic-airborne-correction-guards.ts` without
adding another recursive composer path. Keep it isolated from the larger
field correction, template, and monotonic floor blocks.

Gate B fourth carve result:

- `applyHighFillSingleBoardStudFieldLift` now lives in
  `dynamic-airborne-correction-guards.ts`.
- The moved field lift remains non-recursive and does not need a
  composer parameter.
- Source size after the move:
  - `dynamic-airborne.ts`: 2808 physical lines.
  - `dynamic-airborne-correction-guards.ts`: 383 physical lines.
- Executable fourth-carve contract:
  `packages/engine/src/dynamic-airborne-split-v2-gate-b-fourth-carve-contract.test.ts`.
- Validation after the fourth carve:
  - targeted fourth-carve contract + coverage-grid contract: 2 files /
    10 tests green;
  - focused dynamic airborne / hostile-input behavior sweep: 7 files /
    248 tests green;
  - engine lint and engine typecheck green;
  - `pnpm calculator:gate:current` green: engine 86 files / 396 tests,
    web 36 files / 170 passed + 18 skipped, build 5/5, whitespace guard
    clean; known non-fatal `sharp/@img` warnings only;
  - post-build `pnpm --filter @dynecho/web typecheck` green.

Next Gate B carve target: `applyMixedBoardEmptyCavityFieldMidbandLift`.
Reason: it is the next small non-recursive field-lift correction and
can move into `dynamic-airborne-correction-guards.ts` without adding
another recursive composer path. Keep it isolated from the larger field
correction, template, and monotonic floor blocks.

Gate B fifth carve result:

- `applyMixedBoardEmptyCavityFieldMidbandLift` now lives in
  `dynamic-airborne-correction-guards.ts`.
- The moved midband lift remains non-recursive and does not need a
  composer parameter.
- Source size after the move:
  - `dynamic-airborne.ts`: 2722 physical lines.
  - `dynamic-airborne-correction-guards.ts`: 471 physical lines.
- Executable fifth-carve contract:
  `packages/engine/src/dynamic-airborne-split-v2-gate-b-fifth-carve-contract.test.ts`.
- Validation after the fifth carve:
  - targeted fifth-carve contract + coverage-grid contract: 2 files /
    10 tests green;
  - focused dynamic airborne / hostile-input behavior sweep: 7 files /
    248 tests green;
  - engine lint and engine typecheck green;
  - `pnpm calculator:gate:current` green: engine 86 files / 396 tests,
    web 36 files / 170 passed + 18 skipped, build 5/5, whitespace guard
    clean; known non-fatal `sharp/@img` warnings only;
  - post-build `pnpm --filter @dynecho/web typecheck` green;
  - `git diff --check` clean.

Next Gate B carve target: `applyMixedPremiumSplitFieldLift`.
Reason: it is the next remaining non-recursive field-lift correction and
can move into `dynamic-airborne-correction-guards.ts` without adding
another recursive composer path. Keep it isolated from the larger field
correction, template, and monotonic floor blocks.

Gate B sixth carve result:

- `applyMixedPremiumSplitFieldLift` now lives in
  `dynamic-airborne-correction-guards.ts`.
- The moved split-cavity field lift remains non-recursive and does not
  need a composer parameter.
- Source size after the move:
  - `dynamic-airborne.ts`: 2625 physical lines.
  - `dynamic-airborne-correction-guards.ts`: 569 physical lines.
- Executable sixth-carve contract:
  `packages/engine/src/dynamic-airborne-split-v2-gate-b-sixth-carve-contract.test.ts`.
- Validation after the sixth carve:
  - targeted sixth-carve contract + coverage-grid contract: 2 files /
    10 tests green;
  - focused dynamic airborne / hostile-input behavior sweep: 7 files /
    248 tests green;
  - engine lint and engine typecheck green;
  - `pnpm calculator:gate:current` green: engine 86 files / 396 tests,
    web 36 files / 170 passed + 18 skipped, build 5/5, whitespace guard
    clean; known non-fatal `sharp/@img` warnings only;
  - post-build `pnpm --filter @dynecho/web typecheck` green;
  - `git diff --check` clean.

Next Gate B carve target: `applyDiamondHybridResilientFieldMidbandTrim`.
Reason: it is the next remaining non-recursive field-trim correction and
can move into `dynamic-airborne-correction-guards.ts` without adding
another recursive composer path. Keep it isolated from the larger field
correction, template, and monotonic floor blocks.

Gate B seventh carve result:

- `applyDiamondHybridResilientFieldMidbandTrim` now lives in
  `dynamic-airborne-correction-guards.ts`.
- The moved diamond-hybrid field trim remains non-recursive and does not
  need a composer parameter.
- Source size after the move:
  - `dynamic-airborne.ts`: 2538 physical lines.
  - `dynamic-airborne-correction-guards.ts`: 657 physical lines.
- Executable seventh-carve contract:
  `packages/engine/src/dynamic-airborne-split-v2-gate-b-seventh-carve-contract.test.ts`.
- Validation after the seventh carve:
  - targeted seventh-carve contract + coverage-grid contract: 2 files /
    10 tests green;
  - focused dynamic airborne / hostile-input behavior sweep: 7 files /
    248 tests green;
  - engine lint and engine typecheck green;
  - `pnpm calculator:gate:current` green: engine 86 files / 396 tests,
    web 36 files / 170 passed + 18 skipped, build 5/5, whitespace guard
    clean; known non-fatal `sharp/@img` warnings only;
  - post-build `pnpm --filter @dynecho/web typecheck` green;
  - `git diff --check` clean.

Follow-up general audit after the seventh carve:

- broad `pnpm check` green: engine 219 files / 1216 tests, web 150
  files / 864 passed + 18 skipped, build 5/5;
- no calculator behavior drift or plan/implementation mismatch found;
- Gate C remains open because `dynamic-airborne.ts` is still 2538
  lines, above the 2000-line C6 threshold.

Post-commit checkpoint after `eba9859`:

- authority docs were re-read against implementation;
- line counts, remaining guard order, carved guard module, recursive
  composer callers, and current-gate contract all matched the plan;
- `pnpm calculator:gate:current` and broad `pnpm check` stayed green;
- this is a valid stopping point, but not a Gate C closeout.

Next Gate B carve target: `applyMixedPlainModerateSingleBoardLabTemplate`.
Reason: it is the next remaining non-recursive template correction and
can move into `dynamic-airborne-correction-guards.ts` without adding
another recursive composer path. Keep it isolated from the premium
field-correction and monotonic floor blocks.

Gate B eighth carve result:

- `applyMixedPlainModerateSingleBoardLabTemplate` now lives in
  `dynamic-airborne-correction-guards.ts`.
- The mixed-plain moderate template guard stayed non-recursive and does
  not take a composer parameter.
- Source size after the move:
  - `dynamic-airborne.ts`: 2387 physical lines.
  - `dynamic-airborne-correction-guards.ts`: 814 physical lines.
- Executable eighth-carve contract:
  `packages/engine/src/dynamic-airborne-split-v2-gate-b-eighth-carve-contract.test.ts`.
- Remaining in-file `apply*` guards: 6.
- Remaining direct recursive composer guards: 5:
  `applySingleLeafMasonryMonotonicFloor`,
  `applyNarrowHeavyDoubleLeafGapCap`,
  `applyLinedMassiveMasonryMonotonicFloor`,
  `applyFramedReinforcementMonotonicFloor`, and
  `applyAmbiguousFamilyBoundaryHold`.
- Validation after the eighth carve:
  - targeted eighth-carve contract + coverage-grid contract: 2 files /
    10 tests green;
  - focused dynamic airborne / hostile-input behavior sweep: 13 files /
    239 tests green;
  - `pnpm calculator:gate:current` green: engine 86 files / 396 tests,
    web 36 files / 170 passed + 18 skipped, build 5/5, whitespace guard
    clean; known non-fatal `sharp/@img` warnings only.

Next Gate B carve target: `applyPremiumSingleBoardFieldCorrection`.
Reason: it is the last remaining non-recursive correction block. It is
larger than the template guard and should still move separately before
the recursive monotonic floor/cap guards.

Gate B ninth carve result:

- `applyPremiumSingleBoardFieldCorrection` now lives in
  `dynamic-airborne-correction-guards.ts`.
- The premium single-board field correction stayed non-recursive and
  does not take a composer parameter.
- Source size after the move:
  - `dynamic-airborne.ts`: 2105 physical lines.
  - `dynamic-airborne-correction-guards.ts`: 1091 physical lines.
- Executable ninth-carve contract:
  `packages/engine/src/dynamic-airborne-split-v2-gate-b-ninth-carve-contract.test.ts`.
- Remaining in-file `apply*` guards: 5.
- Remaining direct recursive composer guards: 5:
  `applySingleLeafMasonryMonotonicFloor`,
  `applyNarrowHeavyDoubleLeafGapCap`,
  `applyLinedMassiveMasonryMonotonicFloor`,
  `applyFramedReinforcementMonotonicFloor`, and
  `applyAmbiguousFamilyBoundaryHold`.
- Validation after the ninth carve:
  - targeted ninth-carve contract + coverage-grid contract: 2 files /
    10 tests green;
  - focused dynamic airborne / hostile-input behavior sweep: 13 files /
    239 tests green;
  - `pnpm calculator:gate:current` green: engine 86 files / 396 tests,
    web 36 files / 170 passed + 18 skipped, build 5/5, whitespace guard
    clean; known non-fatal `sharp/@img` warnings only.

Next Gate B carve target: `applySingleLeafMasonryMonotonicFloor`.
Reason: all non-recursive correction guards are now carved. This is the
first remaining in-file guard and the next bounded recursive monotonic
floor carve; it must use `DynamicAirborneComposer` injection instead of
importing the composer.

Gate B tenth carve result:

- `applySingleLeafMasonryMonotonicFloor` now lives in
  `dynamic-airborne-correction-guards.ts`.
- The single-leaf masonry monotonic floor guard uses injected
  `DynamicAirborneComposer` for reduced-thickness sibling probes and
  does not import or call `calculateDynamicAirborneResult(...)`
  directly from the guard module.
- Source size after the move:
  - `dynamic-airborne.ts`: 1952 physical lines.
  - `dynamic-airborne-correction-guards.ts`: 1256 physical lines.
- Executable tenth-carve contract:
  `packages/engine/src/dynamic-airborne-split-v2-gate-b-tenth-carve-contract.test.ts`.
- Remaining in-file `apply*` guards: 4.
- Remaining direct recursive composer guards: 4:
  `applyNarrowHeavyDoubleLeafGapCap`,
  `applyLinedMassiveMasonryMonotonicFloor`,
  `applyFramedReinforcementMonotonicFloor`, and
  `applyAmbiguousFamilyBoundaryHold`.
- Validation after the tenth carve:
  - targeted tenth-carve contract + coverage-grid contract: 2 files /
    10 tests green;
  - focused dynamic airborne / hostile-input behavior sweep: 13 files /
    239 tests green;
  - `pnpm calculator:gate:current` green: engine 86 files / 396 tests,
    web 36 files / 170 passed + 18 skipped, build 5/5, whitespace guard
    clean; known non-fatal `sharp/@img` warnings only.

Next Gate B carve target if the slice continues:
`applyNarrowHeavyDoubleLeafGapCap`. Reason: it is the next in-file
recursive cap guard and can move with the same
`DynamicAirborneComposer` injection pattern. Because the composer file is
now under 2000 lines, Gate C closeout should be considered after full
validation before starting another carve.

Gate B eleventh carve result:

- Gate B eleventh carve landed as the final runtime carve in this slice.
- `applyNarrowHeavyDoubleLeafGapCap` now lives in
  `dynamic-airborne-correction-guards.ts`.
- The narrow heavy double-leaf gap cap uses injected
  `DynamicAirborneComposer` for contact-equivalent sibling probes and
  does not import or call `calculateDynamicAirborneResult(...)`
  directly from the guard module.
- Source size after the move:
  - `dynamic-airborne.ts`: 1793 physical lines.
  - `dynamic-airborne-correction-guards.ts`: 1422 physical lines.
- Executable eleventh-carve contract:
  `packages/engine/src/dynamic-airborne-split-v2-gate-b-eleventh-carve-contract.test.ts`.
- Remaining in-file `apply*` guards: 3.
- Remaining direct recursive composer guards: 3:
  `applyLinedMassiveMasonryMonotonicFloor`,
  `applyFramedReinforcementMonotonicFloor`, and
  `applyAmbiguousFamilyBoundaryHold`.
- Validation after the eleventh carve:
  - targeted eleventh-carve contract + coverage-grid contract: 2 files /
    10 tests green;
  - focused dynamic airborne / hostile-input behavior sweep: 13 files /
    239 tests green;
  - `pnpm calculator:gate:current` green: engine 86 files / 396 tests,
    web 36 files / 170 passed + 18 skipped, build 5/5, whitespace guard
    clean; known non-fatal `sharp/@img` warnings only.

Next Gate B carve target if the slice continues:
`applyLinedMassiveMasonryMonotonicFloor`. Reason: it is the next in-file
recursive monotonic-floor guard and can move with the same
`DynamicAirborneComposer` injection pattern. Because the composer file is
now well under 2000 lines, Gate C closeout should again be considered
after validation before starting another carve.

### Gate C - closeout and next-slice selection

Status: CLOSED 2026-04-26.

Closed after focused gate, broad `pnpm check`, post-build web
typecheck, and `git diff --check` were green.

Gate C result:

- `dynamic-airborne.ts` is 1793 physical lines, below the 2000-line C6
  threshold.
- `dynamic_airborne_split_refactor_v2` Gate C closed and C6 moved out of
  partial.
- Broad `pnpm check` stayed green: engine 219 files / 1216 tests, web
  150 files / 864 passed + 18 skipped, build 5/5; known non-fatal
  `sharp/@img` warnings only.
- Remaining recursive composer guards are optional architecture backlog:
  `applyLinedMassiveMasonryMonotonicFloor`,
  `applyFramedReinforcementMonotonicFloor`, and
  `applyAmbiguousFamilyBoundaryHold`.
- The selected next slice is
  `realistic_layer_combination_coverage_cartography_v1`.

## Immediate Next Steps

This plan is closed. Do not continue Gate B from nearby green tests
alone. If the remaining recursive guards are carved later, open a new
architecture slice and keep each carve atomic.

Next active planning surface:
`SLICE_REALISTIC_LAYER_COMBINATION_COVERAGE_CARTOGRAPHY_PLAN.md`.
It maps realistic user layer combinations by evidence tier before
selecting the next runtime widening target.

## Validation

Per Gate B carve minimum:

- focused dynamic airborne benchmark/regression sweep named in
  `DYNAMIC_AIRBORNE_CARTOGRAPHY.md`;
- `pnpm calculator:gate:current`;
- `pnpm --filter @dynecho/web typecheck` after build;
- `git diff --check`.

Gate C closeout broad `pnpm check` was green.

## Completion Criteria

- the remaining floor/cap guard call graph is documented;
- any runtime carve is behavior-preserving and avoids circular imports;
- defended calculator values stay unchanged;
- `dynamic-airborne.ts` line count and C6 posture are updated honestly;
- the next selected slice is recorded in a post-contract test.

Completion result: all criteria are satisfied. Closure is pinned in
`packages/engine/src/post-dynamic-airborne-split-refactor-v2-gate-c-next-slice-selection-contract.test.ts`.
