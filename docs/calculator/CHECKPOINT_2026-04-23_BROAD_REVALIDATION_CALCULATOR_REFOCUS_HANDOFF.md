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

## Implementation Addendum - Gate A Audit

The first implementation pass for `wall_formula_family_widening_v1`
landed the no-runtime-value-change audit matrix:

- `packages/engine/src/wall-formula-family-widening-audit.test.ts`
  pins timber-stud screening vs dynamic surfaces, LSF exact precedence,
  double-leaf/stud boundary rows, direct-coupled/triple-leaf negatives,
  hostile invalid-input fail-closed behavior, and Porotherm exact/
  benchmark precedence.
- `tools/dev/run-calculator-current-gate.ts` now includes the audit test.
- `post-team-access-model-calculator-refocus-next-slice-selection-contract.test.ts`
  records Gate A as landed and keeps Gate B ahead of runtime value
  changes.

Current next step: Gate B route authority. Inspect the live workbench
timber-stud route/card surface and add web VALUE pins if it already uses
`calculator: "dynamic"`; otherwise make the smallest route-selection
correction before touching formula math.

## Implementation Addendum - Gate B Live Route Proof

Gate B is now landed with no runtime math change:

- `apps/web/features/workbench/wall-live-dynamic-preset-route-card-matrix.test.ts`
  proves the live workbench preset route uses `calculator: "dynamic"`
  through the store/shell default calculator path.
- The file pins the user-visible branch/card values for `timber_stud_wall`
  and `light_steel_stud_wall` across lab / field / building contexts.
- `wall-lsf-timber-stud-preset-benchmarks.test.ts` and
  `wall-field-continuation-completeness-matrix.test.ts` remain
  screening-side drift guards and are now documented as non-user-visible
  surfaces.

Current next step: Gate C runtime decision. Only open a runtime
tightening if a source-backed target corridor can be stated for the live
dynamic route; otherwise close the slice honestly with no runtime value
change.

## Why This Is The Next Step

- The calculator final audit is green.
- Wall coverage remains the weaker side relative to floor coverage.
- The known `timber_stud_wall` gap is already VALUE-pinned and documented
  as a real formula-owned accuracy gap. The 2026-04-23 Gate A audit
  refined this: no-calculator / screening-seed preset matrices pin lab
  Rw 31.1, field R'w 24, and building DnT,w 25, while the same stack
  with `calculator: "dynamic"` gives lab Rw 50, field R'w 42, and
  building DnT,w 43 with a low-confidence framed-wall trace. Gate B must
  prove the user-visible route authority before changing runtime values.
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
- Gate A audit and Gate B live-route proof are both landed. Do not
  change formula values unless Gate C can state a source-backed target
  corridor for the already-confirmed live dynamic timber/lightweight
  wall route.
- Productization route integration should resume after the calculator
  re-entry slice closes or if deployment/user-management risk becomes
  the selected priority again.

## 2026-04-24 Addendum

- Broad `pnpm check` is green again on top of the later
  `wall_resilient_bar_side_count_modeling_v1` Gate A work.
- Full-suite counts are now engine 208 files / 1175 tests and web
  147 files / 845 tests + 18 skipped.
- The broad rerun found no calculator-value drift. The only fixes were
  test-only hardening:
  - `wall-resilient-bar-side-count-input-contract.test.ts` now asserts
    parse behavior instead of `.keyof()` on the exported shared
    `AirborneContextSchema` `ZodType`
  - `calculate-assembly.test.ts` now uses a representative
    small/mid/large split-cavity gap matrix for the left/right swap
    invariant so the full single-worker suite stays below the Vitest
    worker timeout
- Active calculator priority remains unchanged: Gate B explicit
  resilient-bar side-count input/model plumbing.
