# Post-V1 Gate BX Open-Box Finished-Package Lab Metric Projection Plan

Date: 2026-06-01

Authority: [CALCULATOR_SOURCE_OF_TRUTH.md](./CALCULATOR_SOURCE_OF_TRUTH.md)
and [USABLE_V1_EXECUTION_PLAN.md](./USABLE_V1_EXECUTION_PLAN.md).

## Goal

Gate BX is calculator correctness work. It fixes the finished open-box
package mixed lab-impact path so the visible lab `Rw` / `C` metrics come
from the owned package owner instead of the generic dynamic airborne
curve.

This is not formula invention, catalog work, or confidence wording. It
uses the same owned package values already used by the package lab and
Gate BV building paths.

## Landed Runtime

Gate BX has now landed:

`post_v1_floor_open_box_finished_package_lab_metric_projection_gate_bx_plan`

Gate BX status:

`post_v1_floor_open_box_finished_package_lab_metric_projection_gate_bx_landed_selected_next_numeric_coverage_gap_gate_by`

Selected next action:

`post_v1_next_numeric_coverage_gap_gate_by_plan`

Selected next file:

`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-by-contract.test.ts`

## Before And After

Before Gate BX, finished open-box package mixed lab-impact requests could
support `Rw` / `C` while visible `metrics.estimatedRwDb` and
`metrics.estimatedCDb` came from the generic dynamic airborne curve.

After Gate BX:

- dry package-transfer mixed lab-impact requests publish
  `Rw 66 / C -3.9`;
- EPS/screed hybrid mixed lab-field-impact requests publish
  `Rw 72 / C -1.3`;
- dry impact lab pins remain
  `Ln,w 50.8 / CI 1.2 / CI,50-2500 3.3 / Ln,w+CI 52`;
- EPS/screed field impact pins remain
  `L'n,w 49 / L'nT,w 46.6 / L'nT,50 47.6`;
- `Ctr` remains unsupported because these package owners declare
  `Rw+C`, not a true `Ctr`;
- ASTM `IIC` / `AIIC` remain separate owners.

## Validation

Focused validation passed:

`pnpm --filter @dynecho/engine exec vitest run src/post-v1-next-numeric-coverage-gap-gate-bw-contract.test.ts src/post-v1-floor-open-box-finished-package-lab-metric-projection-gate-bx-contract.test.ts --maxWorkers=1`

Full calculator validation passed:

`pnpm calculator:gate:current`

Result: engine 588 files / 3247 tests, web 113 files / 437 passed + 18
skipped, repo build 5 / 5, and whitespace guard passed. The known
optional `sharp/@img` warnings from `@turbodocx/html-to-docx` remained
non-fatal.
