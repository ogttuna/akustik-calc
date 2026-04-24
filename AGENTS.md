# DynEcho Agent Notes

Start here before changing calculator behavior.

## Authority Order

1. `docs/calculator/NEXT_IMPLEMENTATION_PLAN.md`
2. `docs/calculator/CHECKPOINT_2026-04-24_FLOOR_LAYER_ORDER_CLOSEOUT_HANDOFF.md`
3. `docs/calculator/CURRENT_STATE.md`
4. `docs/calculator/SLICE_ALL_CALLER_INVALID_THICKNESS_GUARD_PLAN.md`
5. `docs/calculator/CALCULATION_MODEL_AND_VALIDATION.md`

Use the long-form plan files only for backlog context after reading the current
plan.

## Current Workflow

- current selected slice:
  `all_caller_invalid_thickness_guard_v1`
- current first decision inside the slice:
  start `docs/calculator/SLICE_ALL_CALLER_INVALID_THICKNESS_GUARD_PLAN.md`
  at Gate A. The previous `floor_layer_order_edit_stability_v1` slice
  closed with no runtime change: the engine and web matrices pin
  explicit-role exact reorder stability, raw terminal-concrete helper
  order-sensitive support changes, raw open-web impact fail-closed
  behavior, and no unsupported card leaking `live` or `bound`. Gate B
  was not required. The next selected slice is the remaining
  cross-cutting engine thickness-validity gap: direct floor/wall callers
  that bypass workbench normalization must not get crashes, non-finite
  outputs, unsupported live leakage, or defended-looking answers from
  `0`, negative, `NaN`, or `Infinity` thicknesses
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
