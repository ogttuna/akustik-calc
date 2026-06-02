# Post-V1 Gate CD Open-Box Target Output Independence Plan

Date: 2026-06-01

Authority: [CALCULATOR_SOURCE_OF_TRUTH.md](./CALCULATOR_SOURCE_OF_TRUTH.md)
and [USABLE_V1_EXECUTION_PLAN.md](./USABLE_V1_EXECUTION_PLAN.md).

## Goal

Gate CD is calculator scope/correctness runtime work. It fixes the
finished open-box package route so already-owned package values do not
depend on the user asking for a larger output bundle.

This is not a new formula and not source-row inventory. It widens the
places where existing owned formula/anchor outputs are correctly used:
dry package-transfer and EPS/screed hybrid building/impact requests now
support single-output requests for the values that are already finite.
In short, this gate lands target-output independence for that owned
open-box package route.

## Landed Runtime

Gate CD has now landed:

`post_v1_floor_open_box_target_output_independence_gate_cd_plan`

Gate CD status:

`post_v1_floor_open_box_target_output_independence_gate_cd_landed_selected_next_numeric_coverage_gap_gate_ce`

Selected next action:

`post_v1_next_numeric_coverage_gap_gate_ce_plan`

Selected next file:

`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ce-contract.test.ts`

## Before And After

After Gate CD, complete finished open-box package building/impact
requests support these single-output asks without requiring an extra
`R'w` / `DnT,w` request:

- dry package-transfer: `Rw 66`, `C -3.9`, `Ln,w 50.8`,
  `L'n,w 52.8`, `L'nT,w 50.4`, and `L'nT,50 53.7`;
- EPS/screed hybrid: `Rw 72`, `C -1.3`, `Ln,w 47`,
  `L'n,w 49`, `L'nT,w 46.6`, and `L'nT,50 47.6`.

The route still preserves the boundaries that protect numeric
correctness:

- missing `impactFieldContext` keeps `L'n,w`, `L'nT,w`, and
  `L'nT,50` unsupported;
- `Ctr` remains unsupported because these package owners declare
  `Rw+C`, not a true `Ctr`;
- ASTM `IIC` / `AIIC` remain unsupported because ISO `Ln,w` routes are
  not ASTM E989 contour-rating owners.

## Validation

Gate CD is covered by:

`packages/engine/src/post-v1-floor-open-box-target-output-independence-gate-cd-contract.test.ts`

Focused validation passed:

`pnpm --filter @dynecho/engine exec vitest run src/post-v1-next-numeric-coverage-gap-gate-cc-contract.test.ts src/post-v1-floor-open-box-target-output-independence-gate-cd-contract.test.ts src/post-v1-floor-open-box-eps-screed-full-mixed-field-building-gate-cb-contract.test.ts src/post-v1-next-numeric-coverage-gap-gate-ca-contract.test.ts --maxWorkers=1`

Result: 4 files / 19 tests passed.

Full calculator validation passed:

`pnpm calculator:gate:current`

Result: engine 594 files / 3276 tests, web 113 files / 437 passed + 18
skipped, repo build 5 / 5, and whitespace guard passed. The known
optional `sharp/@img` warnings from `@turbodocx/html-to-docx` remained
non-fatal.
