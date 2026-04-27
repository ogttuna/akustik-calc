# Checkpoint - Dynamic Airborne Split v2 Gate B Tenth Carve

Status: Gate B tenth carve landed. Validate the carve, then decide
whether `dynamic_airborne_split_refactor_v2` should close Gate C now
that `dynamic-airborne.ts` is below 2000 lines or continue with the next
bounded recursive carve: `applyNarrowHeavyDoubleLeafGapCap`.

## What Changed

- Moved `applySingleLeafMasonryMonotonicFloor` from
  `packages/engine/src/dynamic-airborne.ts` into
  `packages/engine/src/dynamic-airborne-correction-guards.ts`.
- Injected `DynamicAirborneComposer` into the moved guard and replaced
  its reduced-thickness sibling probe call with
  `composer(variantLayers, ...)`.
- Imported the moved guard back into `dynamic-airborne.ts` and passed
  `calculateDynamicAirborneResult` from the existing call site.
- Replaced the Gate B static contract with
  `packages/engine/src/dynamic-airborne-split-v2-gate-b-tenth-carve-contract.test.ts`.
- Updated `tools/dev/run-calculator-current-gate.ts` and
  `coverage-grid-consistency.test.ts` to track the tenth-carve
  contract.

## Current Shape

- `dynamic-airborne.ts`: 1952 physical lines.
- `dynamic-airborne-correction-guards.ts`: 1256 physical lines.
- Carved correction guards: 10.
- Remaining in-file `apply*` guards: 4.
- Remaining direct recursive composer guards: 4:
  `applyNarrowHeavyDoubleLeafGapCap`,
  `applyLinedMassiveMasonryMonotonicFloor`,
  `applyFramedReinforcementMonotonicFloor`, and
  `applyAmbiguousFamilyBoundaryHold`.

## Validation

- Pre-edit `pnpm calculator:gate:current`: green.
- Targeted tenth-carve contract + coverage-grid contract:
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

Choose one bounded path:

- close Gate C because `dynamic-airborne.ts` is now below the C6
  2000-line threshold, which requires broad `pnpm check`; or
- continue Gate B by moving `applyNarrowHeavyDoubleLeafGapCap` into
  `dynamic-airborne-correction-guards.ts` with
  `DynamicAirborneComposer` injection.

Do not reopen source-family scope, benchmark formulas, wall selector
behavior, `GDMTXA04A`, `C11c`, raw bare open-box/open-web impact, or
productization work from this architecture carve.
