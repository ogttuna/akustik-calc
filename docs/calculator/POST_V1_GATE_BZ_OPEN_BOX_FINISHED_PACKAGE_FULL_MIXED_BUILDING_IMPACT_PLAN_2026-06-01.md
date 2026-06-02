# Post-V1 Gate BZ Open-Box Finished-Package Full Mixed Building Impact Plan

Date: 2026-06-01

Authority: [CALCULATOR_SOURCE_OF_TRUTH.md](./CALCULATOR_SOURCE_OF_TRUTH.md)
and [USABLE_V1_EXECUTION_PLAN.md](./USABLE_V1_EXECUTION_PLAN.md).

## Goal

Gate BZ is calculator scope and correctness work. It fixes the full
mixed finished open-box package path where airborne building outputs and
impact outputs are requested together.

Before this gate, the engine could calculate the impact tuple internally
while the building-prediction parking layer still marked those requested
impact outputs unsupported. After this gate, only finite impact outputs
listed by `impact.availableOutputs` are promoted back to supported
beside the finished-package airborne building answer.

This is not formula invention, catalog work, or confidence wording. It
uses already-owned package airborne and impact calculations and corrects
their usage placement in a full mixed request.

## Landed Runtime

Gate BZ has now landed:

`post_v1_floor_open_box_finished_package_full_mixed_building_impact_gate_bz_plan`

Gate BZ status:

`post_v1_floor_open_box_finished_package_full_mixed_building_impact_gate_bz_landed_selected_next_numeric_coverage_gap_gate_ca`

Selected next action:

`post_v1_next_numeric_coverage_gap_gate_ca_plan`

Selected next file:

`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ca-contract.test.ts`

## Before And After

After Gate BZ:

- dry package-transfer full mixed building/impact requests publish
  `Rw 66 / C -3.9`, `R'w 64 / DnT,w 67`,
  `Ln,w 50.8 / CI 1.2 / CI,50-2500 3.3 / Ln,w+CI 52`, and
  `L'n,w 52.8 / L'nT,w 50.4 / L'nT,50 53.7`;
- the same dry request without `impactFieldContext` still publishes the
  lab impact tuple but keeps `L'n,w`, `L'nT,w`, and `L'nT,50`
  unsupported;
- EPS/screed hybrid full mixed building/impact requests publish
  `Rw 72 / C -1.3`, `R'w 70 / DnT,w 73`, and
  `Ln,w 47 / CI 0 / CI,50-2500 1 / Ln,w+CI 47`;
- Gate CA selected
  `floor.open_box_timber_eps_screed_hybrid.full_mixed_field_building_gap`
  with status
  `post_v1_next_numeric_coverage_gap_gate_ca_landed_no_runtime_selected_floor_open_box_eps_screed_full_mixed_field_building_gate_cb`;
- after Gate CB, the same EPS/screed hybrid full mixed request with
  explicit `impactFieldContext` also publishes
  `L'n,w 49 / L'nT,w 46.6 / L'nT,50 47.6`;
- `Ctr` remains unsupported because these package owners declare
  `Rw+C`, not a true `Ctr`;
- ASTM `IIC` / `AIIC` remain unsupported because ISO `Ln,w` routes are
  not ASTM E989 contour-rating owners.

## Validation

Focused validation passed:

`pnpm --filter @dynecho/engine exec vitest run src/post-v1-next-numeric-coverage-gap-gate-by-contract.test.ts src/post-v1-floor-open-box-finished-package-full-mixed-building-impact-gate-bz-contract.test.ts src/post-v1-floor-open-box-finished-package-lab-metric-projection-gate-bx-contract.test.ts src/post-v1-next-numeric-coverage-gap-gate-bw-contract.test.ts --maxWorkers=1`

Result: 4 files / 19 tests passed.

Full calculator validation passed:

`pnpm calculator:gate:current`

Result: engine 590 files / 3257 tests, web 113 files / 437 passed + 18
skipped, repo build 5 / 5, and whitespace guard passed. The known
optional `sharp/@img` warnings from `@turbodocx/html-to-docx` remained
non-fatal.

The current-gate runner includes both:

- `src/post-v1-next-numeric-coverage-gap-gate-by-contract.test.ts`;
- `src/post-v1-floor-open-box-finished-package-full-mixed-building-impact-gate-bz-contract.test.ts`.
