# Checkpoint - 2026-04-24 - Dynamic Airborne Split v2 Gate B Third Carve Handoff

Status: Gate B third carve landed. Continue
`dynamic_airborne_split_refactor_v2` with the next bounded
non-recursive field-lift carve.

## What Changed

- Moved `applyMixedSecurityBoardDoubleStudFieldTrim` out of
  `packages/engine/src/dynamic-airborne.ts` and into
  `packages/engine/src/dynamic-airborne-correction-guards.ts`.
- Kept the moved field trim non-recursive; it does not take
  `DynamicAirborneComposer`.
- Updated `dynamic-airborne.ts` to import all three carved correction
  guards from `dynamic-airborne-correction-guards.ts`.
- Replaced the second-carve static contract with
  `packages/engine/src/dynamic-airborne-split-v2-gate-b-third-carve-contract.test.ts`.
- Updated the current gate script to include the new third-carve
  contract.

## Current Shape

- `packages/engine/src/dynamic-airborne.ts`: 2880 physical lines.
- `packages/engine/src/dynamic-airborne-correction-guards.ts`: 310
  physical lines.
- Remaining top-level `apply*` guards in `dynamic-airborne.ts`: 11.
- Remaining direct recursive composer callers in `dynamic-airborne.ts`:
  5:
  - `applySingleLeafMasonryMonotonicFloor`
  - `applyNarrowHeavyDoubleLeafGapCap`
  - `applyLinedMassiveMasonryMonotonicFloor`
  - `applyFramedReinforcementMonotonicFloor`
  - `applyAmbiguousFamilyBoundaryHold`
- Carved guards now in `dynamic-airborne-correction-guards.ts`:
  - `applyHeavyUnframedCavityScreeningCap`
  - `applyMixedSecurityBoardDoubleStudFieldTrim`
  - `applyMicroGapFillEquivalenceGuard`

## Next Step

Move `applyHighFillSingleBoardStudFieldLift` into
`dynamic-airborne-correction-guards.ts`.

Why this is next:

- it is the next smallest remaining non-recursive correction guard;
- it has no `DynamicAirborneComposer` dependency;
- it keeps Gate B moving through bounded correction moves before the
  larger template / premium field-correction blocks and recursive
  monotonic floor/cap guards.

Keep this fourth carve isolated. Do not mix it with
`applyAmbiguousFamilyBoundaryHold`, monotonic floor guards,
`applyPremiumSingleBoardFieldCorrection`, or the template correction
block.

## Validation

Completed after this third-carve patch:

- targeted Gate B third-carve contract + coverage-grid contract:
  2 files / 10 tests green
- focused dynamic airborne / hostile-input behavior sweep:
  7 files / 248 tests green
- `pnpm --filter @dynecho/engine lint`: green
- `pnpm --filter @dynecho/engine typecheck`: green
- `pnpm calculator:gate:current`: green
  - engine: 86 files / 396 tests
  - web: 36 files / 170 passed + 18 skipped
  - build: 5/5 tasks
  - whitespace guard: clean
  - known non-fatal `sharp/@img` optional-package warnings only
- post-build `pnpm --filter @dynecho/web typecheck`: green
- `git diff --check`: green

## Boundaries

- No formula retunes.
- No defended value changes accepted as part of this architecture move.
- No source-family reopen from nearby green tests.
- No circular imports between `dynamic-airborne.ts` and correction guard
  modules.
- `project_access_policy_route_integration_v1` stays deferred until
  this selected calculator slice closes or priority explicitly changes.
