# Checkpoint - Dynamic Airborne Split v2 Gate B Eighth Carve

Status: Gate B eighth carve landed. Continue
`dynamic_airborne_split_refactor_v2` with the ninth bounded carve:
`applyPremiumSingleBoardFieldCorrection`.

## What Changed

- Moved `applyMixedPlainModerateSingleBoardLabTemplate` from
  `packages/engine/src/dynamic-airborne.ts` into
  `packages/engine/src/dynamic-airborne-correction-guards.ts`.
- Kept the function behavior-preserving and non-recursive; no
  `DynamicAirborneComposer` parameter was added.
- Imported the moved guard back into `dynamic-airborne.ts` and left the
  existing call site unchanged.
- Replaced the Gate B static contract with
  `packages/engine/src/dynamic-airborne-split-v2-gate-b-eighth-carve-contract.test.ts`.
- Updated `tools/dev/run-calculator-current-gate.ts` and
  `coverage-grid-consistency.test.ts` to track the eighth-carve
  contract.

## Current Shape

- `dynamic-airborne.ts`: 2387 physical lines.
- `dynamic-airborne-correction-guards.ts`: 814 physical lines.
- Carved correction guards: 8.
- Remaining in-file `apply*` guards: 6.
- Remaining direct recursive composer guards: 5:
  `applySingleLeafMasonryMonotonicFloor`,
  `applyNarrowHeavyDoubleLeafGapCap`,
  `applyLinedMassiveMasonryMonotonicFloor`,
  `applyFramedReinforcementMonotonicFloor`, and
  `applyAmbiguousFamilyBoundaryHold`.

## Validation

- Pre-edit `pnpm calculator:gate:current`: green.
- Targeted eighth-carve contract + coverage-grid contract:
  2 files / 10 tests green.
- Focused dynamic airborne / hostile-input sweep:
  13 files / 239 tests green.
- `pnpm calculator:gate:current`: engine 86 files / 396 tests green;
  web 36 files / 170 passed + 18 skipped; build 5/5; whitespace guard
  clean.
- `git diff --check`: clean.
- Known non-fatal build warnings remain the optional `sharp/@img`
  package warnings through the proposal DOCX route import chain.

## Next Step

Move `applyPremiumSingleBoardFieldCorrection` into
`dynamic-airborne-correction-guards.ts` as the ninth isolated
non-recursive carve. Keep it separate from the recursive monotonic
floor/cap guards and `applyAmbiguousFamilyBoundaryHold`.

Do not reopen source-family scope, benchmark formulas, wall selector
behavior, `GDMTXA04A`, `C11c`, raw bare open-box/open-web impact, or
productization work from this architecture carve.
