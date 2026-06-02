# Post-V1 Gate CB Open-Box EPS Screed Full Mixed Field Building Plan

Date: 2026-06-01

Authority: [CALCULATOR_SOURCE_OF_TRUTH.md](./CALCULATOR_SOURCE_OF_TRUTH.md)
and [USABLE_V1_EXECUTION_PLAN.md](./USABLE_V1_EXECUTION_PLAN.md).

## Goal

Gate CB is calculator scope and correctness work. It fixes the
EPS/screed open-box full mixed building/impact path where the user gives
the route-required `impactFieldContext`, but the `building_prediction`
impact lane returned only the lab impact tuple.

The field-only route already owned the field-impact calculation for this
same package. Gate CB applies that same explicit field-context adapter
in the full mixed building route. It does not add new source rows,
invent a new formula, or alias ISO single-number impact ratings to ASTM
ratings.

## Landed Runtime

Gate CB has now landed:

`post_v1_floor_open_box_eps_screed_full_mixed_field_building_gate_cb_plan`

Gate CB status:

`post_v1_floor_open_box_eps_screed_full_mixed_field_building_gate_cb_landed_selected_next_numeric_coverage_gap_gate_cc`

Selected next action:

`post_v1_next_numeric_coverage_gap_gate_cc_plan`

Selected next file:

`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-cc-contract.test.ts`

## Before And After

After Gate CB, complete EPS/screed hybrid full mixed building/impact
requests publish:

- `Rw 72 / C -1.3`;
- `R'w 70 / DnT,w 73`;
- `Ln,w 47 / CI 0 / CI,50-2500 1 / Ln,w+CI 47`;
- `L'n,w 49 / L'nT,w 46.6 / L'nT,50 47.6`.

The route still preserves the boundaries that protect numeric
correctness:

- missing `impactFieldContext` keeps `L'n,w`, `L'nT,w`, and
  `L'nT,50` unsupported;
- dry package-transfer full mixed values remain unchanged at
  `L'n,w 52.8 / L'nT,w 50.4 / L'nT,50 53.7`;
- `Ctr` remains unsupported because these package owners declare
  `Rw+C`, not a true `Ctr`;
- ASTM `IIC` / `AIIC` remain unsupported because ISO `Ln,w` routes are
  not ASTM E989 contour-rating owners.

## Validation

Gate CB is covered by:

`packages/engine/src/post-v1-floor-open-box-eps-screed-full-mixed-field-building-gate-cb-contract.test.ts`

Focused validation passed:

`pnpm --filter @dynecho/engine exec vitest run src/post-v1-next-numeric-coverage-gap-gate-ca-contract.test.ts src/post-v1-floor-open-box-eps-screed-full-mixed-field-building-gate-cb-contract.test.ts src/post-v1-floor-open-box-finished-package-full-mixed-building-impact-gate-bz-contract.test.ts src/post-v1-next-numeric-coverage-gap-gate-by-contract.test.ts --maxWorkers=1`

Result: 4 files / 20 tests passed.

Historical package metric docs-sync validation also passed:

`pnpm --filter @dynecho/engine exec vitest run src/post-v1-floor-open-box-finished-package-mixed-lab-building-companion-gate-bv-contract.test.ts src/post-v1-next-numeric-coverage-gap-gate-bw-contract.test.ts src/post-v1-floor-open-box-finished-package-lab-metric-projection-gate-bx-contract.test.ts src/post-v1-next-numeric-coverage-gap-gate-ca-contract.test.ts src/post-v1-floor-open-box-eps-screed-full-mixed-field-building-gate-cb-contract.test.ts --maxWorkers=1`

Result: 5 files / 24 tests passed.

Full calculator validation passed:

`pnpm calculator:gate:current`

Result: engine 592 files / 3267 tests, web 113 files / 437 passed + 18
skipped, repo build 5 / 5, and whitespace guard passed. The known
optional `sharp/@img` warnings from `@turbodocx/html-to-docx` remained
non-fatal.
