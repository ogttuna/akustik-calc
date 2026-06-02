# Post-V1 Gate BV Open-Box Finished-Package Mixed Lab/Building Companion Plan

Date: 2026-06-01

Authority: [CALCULATOR_SOURCE_OF_TRUTH.md](./CALCULATOR_SOURCE_OF_TRUTH.md)
and [USABLE_V1_EXECUTION_PLAN.md](./USABLE_V1_EXECUTION_PLAN.md).

## Goal

Gate BV is calculator scope/correctness work. It closes the mixed-output
owner-parity gap left after Gate BU: complete finished open-box package
requests that ask for both package lab outputs and building-prediction
airborne outputs must not park owned package `Rw` / `C` companions just
because the selected building adapter owns only `R'w`, `Dn,w`, `Dn,A`,
`DnT,w`, and `DnT,A`.

This is not a new formula. It uses the existing package owner for lab
`Rw` / `C` and the Gate BU building adapter for building outputs in the
same request, while keeping unsupported `Ctr` visible.

## Landed Runtime

Gate BV has now landed:

`post_v1_floor_open_box_finished_package_mixed_lab_building_companion_gate_bv_plan`

Implementation contract:

`packages/engine/src/post-v1-floor-open-box-finished-package-mixed-lab-building-companion-gate-bv-contract.test.ts`

Selection status:

`post_v1_floor_open_box_finished_package_mixed_lab_building_companion_gate_bv_landed_selected_next_numeric_coverage_gap_gate_bw`

Gate BV selected next action:

`post_v1_next_numeric_coverage_gap_gate_bw_plan`

Gate BV selected next file:

`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-bw-contract.test.ts`

## Value Movement

Complete dry package-transfer mixed lab/building requests now support:

- `Rw 66 / C -3.9`
- `R'w 64`
- `Dn,w 65`
- `Dn,A 63.7`
- `DnT,w 67`
- `DnT,A 66.1`

Complete EPS/screed hybrid mixed lab/building requests now support:

- `Rw 72 / C -1.3`
- `R'w 70`
- `Dn,w 71`
- `Dn,A 69.4`
- `DnT,w 73`
- `DnT,A 71.8`

The building output trace remains on
`floor.open_box_timber_finished_package.airborne_building_prediction_adapter`.
The lab companions are not relabelled as building metrics; they remain
package-owned lab outputs.

## Boundaries

- `Ctr` remains unsupported for these packages because the package
  companion semantic is `Rw+C`, not a true `Ctr`.
- Missing building context remains `needs_input` for building outputs.
- Impact field outputs remain on the explicit `impactFieldContext`
  adapter and are not owned by this airborne mixed companion.
- ASTM `IIC` / `AIIC` aliases remain unsupported without their own
  ASTM band-curve owner.
- Generic screening and `screening_mass_law_curve_seed_v3` are not used
  for the finished-package building outputs.

## Validation

Focused validation includes Gate BU continuity and Gate BV runtime:

`pnpm --filter @dynecho/engine exec vitest run src/post-v1-floor-open-box-finished-package-airborne-building-companion-gate-bu-contract.test.ts src/post-v1-floor-open-box-finished-package-mixed-lab-building-companion-gate-bv-contract.test.ts --maxWorkers=1`

Focused Gate BU/Gate BV validation passed with engine 2 files / 11
tests. Focused Gate BT/Gate BU/Gate BV continuity passed with engine 3
files / 15 tests.

Full calculator validation passed after Gate BV on 2026-06-01:

`pnpm calculator:gate:current`

The full gate passed with engine 586 files / 3238 tests, web 113 files /
437 passed + 18 skipped, repo build 5 / 5, and whitespace guard passed.
The web build still emits the known non-fatal optional `sharp/@img`
warnings through `@turbodocx/html-to-docx`.
