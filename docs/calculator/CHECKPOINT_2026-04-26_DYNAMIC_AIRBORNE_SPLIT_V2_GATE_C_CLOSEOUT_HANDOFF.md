# Checkpoint - Dynamic Airborne Split v2 Gate C Closeout

Date: 2026-04-26

## Status

`dynamic_airborne_split_refactor_v2` is closed at Gate C.

The slice stayed behavior-preserving. Gate B carved eleven correction
guards into `packages/engine/src/dynamic-airborne-correction-guards.ts`,
using `DynamicAirborneComposer` injection for the recursive guards that
probe sibling stacks. `packages/engine/src/dynamic-airborne.ts` is now
1793 physical lines, below the 2000-line C6 hygiene threshold, so the
remaining three recursive guards are optional architecture backlog
rather than a C6 blocker.

## Final Source Shape

- `packages/engine/src/dynamic-airborne.ts`: 1793 physical lines.
- `packages/engine/src/dynamic-airborne-correction-guards.ts`: 1422
  physical lines.
- Carved v2 guards: 11.
- Remaining in-file recursive composer guards:
  `applyLinedMassiveMasonryMonotonicFloor`,
  `applyFramedReinforcementMonotonicFloor`, and
  `applyAmbiguousFamilyBoundaryHold`.

The remaining guards may still be carved in a future architecture slice,
but they are no longer the selected work.

## Validation

- Targeted eleventh-carve contract + coverage-grid contract: 2 files /
  10 tests green.
- Focused dynamic airborne / hostile-input sweep: 13 files / 239 tests
  green.
- `pnpm calculator:gate:current`: engine 87 files / 401 tests, web 36
  files / 170 passed + 18 skipped, build 5/5, whitespace guard clean.
- Broad `pnpm check`: engine 219 files / 1216 tests, web 150 files /
  864 passed + 18 skipped, build 5/5.
- Known non-fatal build warnings remain the optional `sharp/@img`
  package warnings from `@turbodocx/html-to-docx`.

## Selected Next Slice

Active slice is now
`realistic_layer_combination_coverage_cartography_v1`.

Planning surface:
`docs/calculator/SLICE_REALISTIC_LAYER_COMBINATION_COVERAGE_CARTOGRAPHY_PLAN.md`.

First action:
create the no-runtime executable cartography matrix for realistic floor
and wall layer combinations. The matrix should classify representative
stacks by evidence tier, support/card posture, output coverage, origin,
confidence, invariants, and whether the cell is a runtime-widening,
value-pin-only, or source-blocked candidate.

## Boundaries

- Do not retune formulas during cartography Gate A.
- Do not claim arbitrary layer stacks are exact or defended.
- Do not reopen `GDMTXA04A`, `C11c`, raw bare open-box/open-web impact,
  reinforced-concrete reopening, wall-selector behavior, or timber exact
  follow-ups from nearby green tests.
- `project_access_policy_route_integration_v1` remains deferred, not
  cancelled.
