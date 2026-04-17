# DynEcho Agent Notes

Start here before changing calculator behavior.

## Authority Order

1. `docs/calculator/NEXT_IMPLEMENTATION_PLAN.md`
2. `docs/calculator/CHECKPOINT_2026-04-16_RUNTIME_CANDIDATE_RERANK_HANDOFF.md`
3. `docs/calculator/CURRENT_STATE.md`
4. `docs/calculator/CALCULATION_MODEL_AND_VALIDATION.md`

Use the long-form plan files only for backlog context after reading the current
plan.

## Current Workflow

- current selected slice:
  `heavy_concrete_formula_family_widening_v1`
- do not widen raw source families, `GDMTXA04A`, `C11c`, heavy-concrete formula
  scope, or wall-selector behavior from nearby green tests alone
- if a slice closes, update the current plan, current state, and the relevant
  checkpoint/handoff note together
- keep planning-contract tests in sync with the selected next slice

## Validation

- run `pnpm calculator:gate:current` before and after touching the active
  selected slice
- use `pnpm check` only when you need the broad full-repo gate
- keep `git diff --check` clean

## Boundaries

- treat `/home/ogttuna/Dev/Machinity/Acoustic2` as read-only upstream
- do not edit upstream from this repo
- keep workbench persistence assumptions honest:
  today they are browser-local, not server-side project storage
