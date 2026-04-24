# Checkpoint - 2026-04-24 - Dynamic Airborne Split v2 Post-Commit Revalidation Handoff

Status: clean checkpoint after commit `eba9859`
(`refactor(calculator): continue dynamic airborne split v2`). Continue
`dynamic_airborne_split_refactor_v2` with the eighth bounded Gate B
carve.

## What Was Rechecked

- Re-read the active authority chain:
  `AGENTS.md`, `NEXT_IMPLEMENTATION_PLAN.md`, the seventh-carve
  checkpoint, `CURRENT_STATE.md`, and
  `SLICE_DYNAMIC_AIRBORNE_SPLIT_REFACTOR_V2_PLAN.md`.
- Compared those docs to implementation shape in
  `packages/engine/src/dynamic-airborne.ts`,
  `packages/engine/src/dynamic-airborne-correction-guards.ts`,
  `packages/engine/src/dynamic-airborne-split-v2-gate-b-seventh-carve-contract.test.ts`,
  and `tools/dev/run-calculator-current-gate.ts`.
- No plan / implementation drift was found.

## Confirmed Implementation Shape

- `packages/engine/src/dynamic-airborne.ts`: 2538 physical lines.
- `packages/engine/src/dynamic-airborne-correction-guards.ts`: 657
  physical lines.
- Remaining top-level `apply*` guards in `dynamic-airborne.ts`: 7:
  - `applySingleLeafMasonryMonotonicFloor`
  - `applyNarrowHeavyDoubleLeafGapCap`
  - `applyLinedMassiveMasonryMonotonicFloor`
  - `applyFramedReinforcementMonotonicFloor`
  - `applyMixedPlainModerateSingleBoardLabTemplate`
  - `applyPremiumSingleBoardFieldCorrection`
  - `applyAmbiguousFamilyBoundaryHold`
- Remaining direct recursive composer callers in `dynamic-airborne.ts`:
  5:
  - `applySingleLeafMasonryMonotonicFloor`
  - `applyNarrowHeavyDoubleLeafGapCap`
  - `applyLinedMassiveMasonryMonotonicFloor`
  - `applyFramedReinforcementMonotonicFloor`
  - `applyAmbiguousFamilyBoundaryHold`
- Carved guards in `dynamic-airborne-correction-guards.ts`: 7:
  - `applyDiamondHybridResilientFieldMidbandTrim`
  - `applyHeavyUnframedCavityScreeningCap`
  - `applyHighFillSingleBoardStudFieldLift`
  - `applyMixedBoardEmptyCavityFieldMidbandLift`
  - `applyMixedPremiumSplitFieldLift`
  - `applyMixedSecurityBoardDoubleStudFieldTrim`
  - `applyMicroGapFillEquivalenceGuard`

## Validation

- `pnpm calculator:gate:current` green after the post-commit checkpoint
  review:
  - engine 86 files / 396 tests;
  - web 36 files / 170 passed + 18 skipped;
  - build 5/5;
  - whitespace guard clean;
  - known non-fatal `sharp/@img` warnings only.
- `pnpm check` green:
  - lint green;
  - typecheck green;
  - tests green via Turbo cache replay from the latest full run: engine
    219 files / 1216 tests and web 150 files / 864 passed + 18 skipped;
  - build 5/5 with the same known non-fatal `sharp/@img` warnings.

## Decision

This is a good stopping point. No runtime fix is needed before the next
slice step.

The next implementation action remains:

1. Move `applyMixedPlainModerateSingleBoardLabTemplate` into
   `packages/engine/src/dynamic-airborne-correction-guards.ts`.
2. Import it back into `dynamic-airborne.ts`.
3. Replace the seventh-carve static contract with an eighth-carve
   contract and update cartography counts.
4. Re-run the focused Gate B contract, the focused behavior sweep as
   needed, `pnpm calculator:gate:current`, post-build web typecheck if
   Next metadata changes, and `git diff --check`.

## Boundaries

- No formula retunes.
- No defended value changes as part of the architecture move.
- No source-family reopen from nearby green tests.
- No circular imports between `dynamic-airborne.ts` and correction guard
  modules.
- Gate C remains open because `dynamic-airborne.ts` is still 2538 lines,
  above the 2000-line C6 architecture threshold.
- `project_access_policy_route_integration_v1` stays deferred until
  this selected calculator slice closes or priority explicitly changes.
