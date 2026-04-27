# Checkpoint - Dynamic Airborne Split v2 Gate B Ninth Carve

Status: Gate B ninth carve landed. Continue
`dynamic_airborne_split_refactor_v2` with the first remaining recursive
bounded carve: `applySingleLeafMasonryMonotonicFloor`.

## What Changed

- Moved `applyPremiumSingleBoardFieldCorrection` from
  `packages/engine/src/dynamic-airborne.ts` into
  `packages/engine/src/dynamic-airborne-correction-guards.ts`.
- Kept the function behavior-preserving and non-recursive; no
  `DynamicAirborneComposer` parameter was added.
- Imported the moved guard back into `dynamic-airborne.ts` and left the
  existing call site unchanged.
- Replaced the Gate B static contract with
  `packages/engine/src/dynamic-airborne-split-v2-gate-b-ninth-carve-contract.test.ts`.
- Updated `tools/dev/run-calculator-current-gate.ts` and
  `coverage-grid-consistency.test.ts` to track the ninth-carve
  contract.

## Current Shape

- `dynamic-airborne.ts`: 2105 physical lines.
- `dynamic-airborne-correction-guards.ts`: 1091 physical lines.
- Carved correction guards: 9.
- Remaining in-file `apply*` guards: 5.
- Remaining direct recursive composer guards: 5:
  `applySingleLeafMasonryMonotonicFloor`,
  `applyNarrowHeavyDoubleLeafGapCap`,
  `applyLinedMassiveMasonryMonotonicFloor`,
  `applyFramedReinforcementMonotonicFloor`, and
  `applyAmbiguousFamilyBoundaryHold`.

## Validation

- Pre-edit `pnpm calculator:gate:current`: green.
- Targeted ninth-carve contract + coverage-grid contract:
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

Move `applySingleLeafMasonryMonotonicFloor` into
`dynamic-airborne-correction-guards.ts` as the first remaining recursive
carve. Inject `DynamicAirborneComposer`, pass
`calculateDynamicAirborneResult` from the existing call site, and keep
the monotonic-floor logic otherwise mechanical.

Do not reopen source-family scope, benchmark formulas, wall selector
behavior, `GDMTXA04A`, `C11c`, raw bare open-box/open-web impact, or
productization work from this architecture carve.
