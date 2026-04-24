# DynEcho Agent Notes

Start here before changing calculator behavior.

## Authority Order

1. `docs/calculator/NEXT_IMPLEMENTATION_PLAN.md`
2. `docs/calculator/CHECKPOINT_2026-04-23_WALL_TIMBER_LIGHTWEIGHT_SOURCE_CORPUS_CLOSEOUT_HANDOFF.md`
3. `docs/calculator/CURRENT_STATE.md`
4. `docs/calculator/SLICE_WALL_RESILIENT_BAR_SIDE_COUNT_MODELING_PLAN.md`
5. `docs/calculator/CALCULATION_MODEL_AND_VALIDATION.md`

Use the long-form plan files only for backlog context after reading the current
plan.

## Current Workflow

- current selected slice:
  `wall_resilient_bar_side_count_modeling_v1`
- current first decision inside the slice:
  continue `docs/calculator/SLICE_WALL_RESILIENT_BAR_SIDE_COUNT_MODELING_PLAN.md`;
  Gate A is now landed without runtime change. The engine audit
  `wall-resilient-bar-side-count-blind-audit.test.ts` proves the four
  official RB1/RB2 timber rows currently collapse onto the same
  side-count-blind outputs despite published 3 dB lab deltas. The web
  route/card matrix
  `wall-resilient-bar-side-count-route-card-matrix.test.ts` pins the
  same user-visible collapse, and
  `wall-resilient-bar-side-count-input-contract.test.ts` proves the
  shared schema/store still expose `connectionType`/`studType`/
  `studSpacingMm` but not resilient-bar side count. The next decision is
  Gate B explicit input/model plumbing, not a formula retune. Broad
  `pnpm check` revalidation on `2026-04-24` is green again after two
  test-only hardening fixes: the side-count input contract now asserts
  schema blindness through parse behavior instead of `.keyof()` on the
  exported `ZodType`, and the heavy `calculate-assembly` split-cavity
  field swap audit now uses a representative asymmetry matrix so the
  full single-worker suite does not hit a Vitest worker timeout
- do not reopen `GDMTXA04A`, `C11c`, raw open-box/open-web, heavy-concrete
  parity or formula scope, reinforced-concrete reopening, wall-selector
  behavior, timber-stud widening, or resilient-row exact promotion from
  nearby green tests alone
- if a slice closes, update the current plan, current state, and the relevant
  checkpoint/handoff note together
- keep planning-contract tests in sync with the selected next slice
- `project_access_policy_route_integration_v1` is deferred, not
  cancelled; do not resume productization until the selected calculator
  re-entry slice closes or the priority explicitly changes

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
