# Checkpoint - 2026-04-24 - Dynamic Airborne Split v2 Gate B First Carve Handoff

Status: Gate B first carve landed. Continue
`dynamic_airborne_split_refactor_v2` with the next bounded non-recursive
cap carve.

## What Changed

- Added `DynamicAirborneComposer` to
  `packages/engine/src/dynamic-airborne-helpers.ts`.
- Added `packages/engine/src/dynamic-airborne-correction-guards.ts`.
- Moved `applyMicroGapFillEquivalenceGuard` out of
  `packages/engine/src/dynamic-airborne.ts` and into the new correction
  guard module.
- Replaced only the moved guard's direct
  `calculateDynamicAirborneResult(...)` call with `composer(...)`.
- Updated the composer call site in `dynamic-airborne.ts` to pass
  `calculateDynamicAirborneResult`.
- Replaced the Gate A static planning contract with
  `packages/engine/src/dynamic-airborne-split-v2-gate-b-first-carve-contract.test.ts`.
- Updated the current gate script to include the new Gate B contract.

## Current Shape

- `packages/engine/src/dynamic-airborne.ts`: 3046 physical lines.
- `packages/engine/src/dynamic-airborne-correction-guards.ts`: 131
  physical lines.
- Remaining top-level `apply*` guards in `dynamic-airborne.ts`: 13.
- Remaining direct recursive composer callers in `dynamic-airborne.ts`:
  5:
  - `applySingleLeafMasonryMonotonicFloor`
  - `applyNarrowHeavyDoubleLeafGapCap`
  - `applyLinedMassiveMasonryMonotonicFloor`
  - `applyFramedReinforcementMonotonicFloor`
  - `applyAmbiguousFamilyBoundaryHold`
- The moved micro-gap guard has no direct composer import; it uses the
  injected `DynamicAirborneComposer`.

## Next Step

Move `applyHeavyUnframedCavityScreeningCap` into
`dynamic-airborne-correction-guards.ts`.

Why this is next:

- it is the smallest remaining non-recursive cap guard;
- it has no `DynamicAirborneComposer` dependency;
- it proves the new correction-guards module can host simple cap guards
  before the larger field correction and monotonic floor blocks move.

Keep this second carve isolated. Do not mix it with
`applyAmbiguousFamilyBoundaryHold`, monotonic floor guards, or the larger
field correction/template guards.

## Validation

Completed after this first-carve patch:

- targeted Gate B first-carve contract: green
  (`dynamic-airborne-split-v2-gate-b-first-carve-contract.test.ts` +
  `coverage-grid-consistency.test.ts`, 2 files / 9 tests)
- focused behavior sweep: green
  (`calculate-assembly.test.ts`, `dynamic-airborne-instability-repro.test.ts`,
  `dynamic-airborne-wall-selector-value-pins.test.ts`,
  `raw-wall-hostile-input-answer-matrix.test.ts`,
  `airborne-framed-wall-benchmark.test.ts`,
  `airborne-masonry-benchmark.test.ts`,
  `airborne-aircrete-benchmark.test.ts`; 7 files / 248 tests)
- `pnpm --filter @dynecho/engine lint`: green
- `pnpm --filter @dynecho/engine typecheck`: green
- `pnpm calculator:gate:current`: green
  - engine: 86 files / 395 tests
  - web: 36 files / 170 passed + 18 skipped
  - build: 5/5 tasks
  - whitespace guard: clean
  - known non-fatal `sharp/@img` build warnings only
- `pnpm --filter @dynecho/web typecheck`: green after build, restored
  Next metadata
- `git diff --check`: clean

## Boundaries

- No formula retunes.
- No defended value changes accepted as part of this architecture move.
- No source-family reopen from nearby green tests.
- No circular imports between `dynamic-airborne.ts` and correction guard
  modules.
- `project_access_policy_route_integration_v1` stays deferred until
  this selected calculator slice closes or priority explicitly changes.
