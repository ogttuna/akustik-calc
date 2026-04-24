# Checkpoint - 2026-04-24 - Dynamic Airborne Split v2 Gate B Sixth Carve Handoff

Status: Gate B sixth carve landed. Continue
`dynamic_airborne_split_refactor_v2` with the next bounded
non-recursive field-trim carve.

## What Changed

- Moved `applyMixedPremiumSplitFieldLift` out of
  `packages/engine/src/dynamic-airborne.ts` and into
  `packages/engine/src/dynamic-airborne-correction-guards.ts`.
- Kept the moved split-cavity field lift non-recursive; it does not take
  `DynamicAirborneComposer`.
- Updated `dynamic-airborne.ts` to import all six carved correction
  guards from `dynamic-airborne-correction-guards.ts`.
- Replaced the fifth-carve static contract with
  `packages/engine/src/dynamic-airborne-split-v2-gate-b-sixth-carve-contract.test.ts`.
- Updated the current gate script to include the new sixth-carve
  contract.

## Current Shape

- `packages/engine/src/dynamic-airborne.ts`: 2625 physical lines.
- `packages/engine/src/dynamic-airborne-correction-guards.ts`: 569
  physical lines.
- Remaining top-level `apply*` guards in `dynamic-airborne.ts`: 8.
- Remaining direct recursive composer callers in `dynamic-airborne.ts`:
  5:
  - `applySingleLeafMasonryMonotonicFloor`
  - `applyNarrowHeavyDoubleLeafGapCap`
  - `applyLinedMassiveMasonryMonotonicFloor`
  - `applyFramedReinforcementMonotonicFloor`
  - `applyAmbiguousFamilyBoundaryHold`
- Carved guards now in `dynamic-airborne-correction-guards.ts`:
  - `applyHeavyUnframedCavityScreeningCap`
  - `applyHighFillSingleBoardStudFieldLift`
  - `applyMixedBoardEmptyCavityFieldMidbandLift`
  - `applyMixedPremiumSplitFieldLift`
  - `applyMixedSecurityBoardDoubleStudFieldTrim`
  - `applyMicroGapFillEquivalenceGuard`

## Next Step

Move `applyDiamondHybridResilientFieldMidbandTrim` into
`dynamic-airborne-correction-guards.ts`.

Why this is next:

- it is the next remaining non-recursive field-trim correction;
- it has no `DynamicAirborneComposer` dependency;
- it keeps Gate B moving through bounded correction moves before the
  template, premium field-correction, and recursive monotonic floor/cap
  guards.

Keep this seventh carve isolated. Do not mix it with
`applyAmbiguousFamilyBoundaryHold`, monotonic floor guards,
`applyPremiumSingleBoardFieldCorrection`, or the template correction
block.

## Validation

Completed after this sixth-carve patch:

- targeted Gate B sixth-carve contract + coverage-grid contract:
  2 files / 10 tests green;
- focused dynamic airborne / hostile-input behavior sweep:
  7 files / 248 tests green;
- engine lint and engine typecheck green;
- `pnpm calculator:gate:current` green: engine 86 files / 396 tests,
  web 36 files / 170 passed + 18 skipped, build 5/5, whitespace guard
  clean; known non-fatal `sharp/@img` warnings only;
- post-build `pnpm --filter @dynecho/web typecheck` green;
- `git diff --check` clean.

## Boundaries

- No formula retunes.
- No defended value changes accepted as part of this architecture move.
- No source-family reopen from nearby green tests.
- No circular imports between `dynamic-airborne.ts` and correction guard
  modules.
- `project_access_policy_route_integration_v1` stays deferred until
  this selected calculator slice closes or priority explicitly changes.
