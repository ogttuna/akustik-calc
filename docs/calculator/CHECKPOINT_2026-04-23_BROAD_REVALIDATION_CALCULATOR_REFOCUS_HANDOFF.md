# Checkpoint - 2026-04-23 Broad Revalidation And Calculator Refocus

Status: broad revalidation handoff

## What Was Revalidated

- Focused calculator gate passed after the team-access policy model:
  68 engine files / 321 tests, 29 web files / 132 tests + 18 skipped,
  build 5/5 tasks.
- Broad `pnpm check` passed: lint, typecheck, full engine/web tests, and
  build. Full tests were engine 202 files / 1150 tests and web 143
  files / 824 tests + 18 skipped.
- The build still emits the known non-fatal optional `sharp/@img`
  warnings through `@turbodocx/html-to-docx`.
- `git diff --check` stayed clean.

## Planning Decision

The project priority was reasserted as:

1. increase calculation accuracy,
2. increase defensible floor/wall layer-combination coverage,
3. keep those gains protected by tests.

Therefore the current selected slice moves from productization route
integration to calculator runtime planning:

`wall_formula_family_widening_v1`

Planning surface:
`docs/calculator/SLICE_WALL_FORMULA_FAMILY_WIDENING_PLAN.md`

## Why This Is The Next Step

- The calculator final audit is green.
- Wall coverage remains the weaker side relative to floor coverage.
- The known `timber_stud_wall` gap is already VALUE-pinned and documented
  as a real formula-owned accuracy gap.
- Wall hostile-input, field-continuation, physical-invariant, reorder,
  and mixed cross-mode guardrails are already in place.
- A formula-family audit matrix can improve accuracy/coverage without
  reopening blocked source families.

## Deferred, Not Cancelled

`project_access_policy_route_integration_v1` remains a valid
productization follow-up. It is deferred because it does not improve
acoustic calculation accuracy or coverage.

## Resume Notes

- Start with `SLICE_WALL_FORMULA_FAMILY_WIDENING_PLAN.md`.
- First implementation action is an audit/anchor matrix. Do not change
  formula values before current values, trace origins, negative cases,
  and exact/benchmark precedence are pinned.
- Productization route integration should resume after the calculator
  re-entry slice closes or if deployment/user-management risk becomes
  the selected priority again.
