# Checkpoint - 2026-04-24 - Dynamic Airborne Split v2 Gate A Handoff

Status: Gate A landed no-runtime. Continue
`dynamic_airborne_split_refactor_v2` at Gate B.

## What Changed

- Added an executable planning contract for the Gate A snapshot. That
  contract was later superseded by
  `packages/engine/src/dynamic-airborne-split-v2-gate-b-first-carve-contract.test.ts`
  once Gate B moved runtime code.
- Added the active dynamic-airborne split v2 contract to
  `pnpm calculator:gate:current` through
  `tools/dev/run-calculator-current-gate.ts`.
- Updated `DYNAMIC_AIRBORNE_CARTOGRAPHY.md` with the fresh 3152-line
  `dynamic-airborne.ts` snapshot, the remaining 14 `apply*` guards, the
  recursive composer caller inventory, and the first carve target.
- Updated the active slice plan, current state, and next implementation
  plan so a resume starts at Gate B instead of redoing Gate A.

No calculator runtime code moved in Gate A.

## Gate A Findings

`packages/engine/src/dynamic-airborne.ts` remains 3152 physical lines.
It still owns 14 top-level `apply*` correction guards plus
`calculateDynamicAirborneResult`, `detectDynamicFamily`, and
`chooseBlend`.

Direct recursive composer guards:

- `applySingleLeafMasonryMonotonicFloor`
- `applyNarrowHeavyDoubleLeafGapCap`
- `applyLinedMassiveMasonryMonotonicFloor`
- `applyFramedReinforcementMonotonicFloor`
- `applyMicroGapFillEquivalenceGuard`
- `applyAmbiguousFamilyBoundaryHold`

Non-recursive correction guards:

- `applyHeavyUnframedCavityScreeningCap`
- `applyMixedSecurityBoardDoubleStudFieldTrim`
- `applyHighFillSingleBoardStudFieldLift`
- `applyMixedBoardEmptyCavityFieldMidbandLift`
- `applyMixedPremiumSplitFieldLift`
- `applyDiamondHybridResilientFieldMidbandTrim`
- `applyMixedPlainModerateSingleBoardLabTemplate`
- `applyPremiumSingleBoardFieldCorrection`

## Gate B Plan

First carve target:

- Create `packages/engine/src/dynamic-airborne-correction-guards.ts`.
- Add the shared composer type in `dynamic-airborne-helpers.ts`:

```ts
export type DynamicAirborneComposer = (
  layers: readonly ResolvedLayer[],
  options: DynamicAirborneOptions
) => DynamicAirborneResult;
```

- Move `applyMicroGapFillEquivalenceGuard` into the new guard module.
- Keep the guard body verbatim except replacing the direct
  `calculateDynamicAirborneResult(...)` call with `composer(...)`.
- Import the moved guard into `dynamic-airborne.ts` and pass
  `calculateDynamicAirborneResult` from the existing call site.

Why this is first: it is the smallest direct recursive guard, so it
exercises the composer-injection blocker without also moving
`FAMILY_LABELS` or the larger monotonic floor/cap blocks.

## Validation

Baseline before Gate A edits:

- `pnpm calculator:gate:current` green
  - engine: 85 files / 391 tests
  - web: 36 files / 170 passed + 18 skipped
  - build: 5/5 tasks
  - whitespace guard: clean
  - known non-fatal `sharp/@img` build warnings only

Required after the Gate A patch:

- targeted Gate A snapshot contract: green at the time; later
  superseded by the Gate B first-carve contract after runtime movement
- `pnpm calculator:gate:current`: green
  - engine: 86 files / 395 tests
  - web: 36 files / 170 passed + 18 skipped
  - build: 5/5 tasks
  - whitespace guard: clean
  - known non-fatal `sharp/@img` build warnings only
- `pnpm --filter @dynecho/web typecheck`: green after build, restored
  Next metadata
- `git diff --check`: clean

Required after Gate B runtime movement:

- targeted dynamic-airborne split v2 contract
- focused dynamic airborne benchmark/regression sweep as needed
- raw wall hostile-input matrix
- `pnpm calculator:gate:current`
- post-build web typecheck if Next metadata changes
- `git diff --check`

## Boundaries

- Do not change defended calculator values during this architecture
  slice.
- Do not retune formulas, source-family support, or wall/floor selector
  behavior.
- Do not reopen `GDMTXA04A`, `C11c`, raw bare open-box/open-web,
  heavy-concrete parity/formula scope, reinforced-concrete,
  wall-selector, timber-stud, or exact-row follow-ups from nearby green
  tests.
- Do not resume `project_access_policy_route_integration_v1` until this
  selected calculator slice closes or priority explicitly changes.
