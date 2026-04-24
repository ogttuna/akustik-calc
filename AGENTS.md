# DynEcho Agent Notes

Start here before changing calculator behavior.

## Authority Order

1. `docs/calculator/NEXT_IMPLEMENTATION_PLAN.md`
2. `docs/calculator/CHECKPOINT_2026-04-24_DYNAMIC_AIRBORNE_SPLIT_V2_GATE_B_SEVENTH_CARVE_HANDOFF.md`
3. `docs/calculator/CURRENT_STATE.md`
4. `docs/calculator/SLICE_DYNAMIC_AIRBORNE_SPLIT_REFACTOR_V2_PLAN.md`
5. `docs/calculator/DYNAMIC_AIRBORNE_CARTOGRAPHY.md`
6. `docs/calculator/CALCULATION_MODEL_AND_VALIDATION.md`

Use the long-form plan files only for backlog context after reading the current
plan.

## Current Workflow

- current selected slice:
  `dynamic_airborne_split_refactor_v2`
- current first decision inside the slice:
  start `docs/calculator/SLICE_DYNAMIC_AIRBORNE_SPLIT_REFACTOR_V2_PLAN.md`
  in Gate B after the seventh carve. Gate A landed no-runtime: it pinned
  the remaining `dynamic-airborne.ts` 3152-line call graph, confirmed 14
  top-level `apply*` guards, and classified six direct recursive
  composer callers versus eight non-recursive correction guards. Gate B
  first carve moved `applyMicroGapFillEquivalenceGuard` into
  `dynamic-airborne-correction-guards.ts` with
  `DynamicAirborneComposer`; Gate B second carve moved
  `applyHeavyUnframedCavityScreeningCap` into the same module; Gate B
  third carve moved `applyMixedSecurityBoardDoubleStudFieldTrim`.
  Gate B fourth carve moved `applyHighFillSingleBoardStudFieldLift`.
  Gate B fifth carve moved `applyMixedBoardEmptyCavityFieldMidbandLift`.
  Gate B sixth carve moved `applyMixedPremiumSplitFieldLift`.
  Gate B seventh carve moved `applyDiamondHybridResilientFieldMidbandTrim`.
  `dynamic-airborne.ts` is now 2538 lines with 7 in-file guards. The
  follow-up broad `pnpm check` audit is green (engine 219 files / 1216
  tests, web 150 files / 864 passed + 18 skipped, build 5/5 with the
  known non-fatal `sharp/@img` warnings). The next bounded carve target
  is `applyMixedPlainModerateSingleBoardLabTemplate`.
- do not reopen `GDMTXA04A`, `C11c`, raw open-box/open-web, heavy-concrete
  parity or formula scope, reinforced-concrete reopening, wall-selector
  behavior, timber-stud widening, or wall exact-row follow-ups from nearby
  green tests alone
- if a slice closes, update the current plan, current state, and the relevant
  checkpoint/handoff note together
- keep planning-contract tests in sync with the selected next slice
- `project_access_policy_route_integration_v1` is deferred, not
  cancelled; do not resume productization until the selected calculator
  slice closes or the priority explicitly changes

## Validation

- run `pnpm calculator:gate:current` before and after touching the active
  selected slice
- use `pnpm check` only when you need the broad full-repo gate
- keep `git diff --check` clean

## Boundaries

- treat `/home/ogttuna/Dev/Machinity/Acoustic2` as read-only upstream
- do not edit upstream from this repo
- keep workbench persistence assumptions honest:
  editing is still local-first, with explicit server sync/load available
