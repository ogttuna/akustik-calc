# Post-V1 Gate BU Open-Box Finished-Package Airborne Building Companion Plan

Date: 2026-06-01

Authority: [CALCULATOR_SOURCE_OF_TRUTH.md](./CALCULATOR_SOURCE_OF_TRUTH.md)
and [USABLE_V1_EXECUTION_PLAN.md](./USABLE_V1_EXECUTION_PLAN.md).

## Goal

Gate BU is calculator scope/correctness work. It closes the Gate BT
wrong-anchor gap for complete finished open-box package
`building_prediction` airborne requests.

## Landed Runtime

Gate BU has now landed:

`post_v1_floor_open_box_finished_package_airborne_building_companion_gate_bu_plan`

Implementation contract:

`packages/engine/src/post-v1-floor-open-box-finished-package-airborne-building-companion-gate-bu-contract.test.ts`

Selection status:

`post_v1_floor_open_box_finished_package_airborne_building_companion_gate_bu_landed_selected_next_numeric_coverage_gap_gate_bv`

Gate BU selected next action:

`post_v1_next_numeric_coverage_gap_gate_bv_plan`

Gate BU selected next file:

`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-bv-contract.test.ts`

## Value Movement

Complete dry package-transfer `building_prediction` requests now use the
owned package-transfer `Rw 66` anchor from
`broad_accuracy_floor_open_box_timber_similarity_package_transfer_formula_corridor`
and calculate:

- `R'w 64`
- `Dn,w 65`
- `Dn,A 63.7`
- `DnT,w 67`
- `DnT,A 66.1`

Complete EPS/screed hybrid `building_prediction` requests now use the
owned package `Rw 72` anchor from
`broad_accuracy_floor_open_box_timber_eps_screed_hybrid_package_formula_corridor`
and calculate:

- `R'w 70`
- `Dn,w 71`
- `Dn,A 69.4`
- `DnT,w 73`
- `DnT,A 71.8`

These routes no longer use a generic screening predictor,
`predictor_floor_system_family_archetype_estimate`, or
`screening_mass_law_curve_seed_v3` for `R'w`, `Dn,w`, `Dn,A`, `DnT,w`,
or `DnT,A`.

## Boundaries

- Missing building context remains `needs_input`.
- Gate BU itself kept mixed lab companions separate; Gate BV now closes
  the explicit package-owned mixed companion follow-up:
  `post_v1_floor_open_box_finished_package_mixed_lab_building_companion_gate_bv_plan`
  with status
  `post_v1_floor_open_box_finished_package_mixed_lab_building_companion_gate_bv_landed_selected_next_numeric_coverage_gap_gate_bw`.
  Dry mixed requests keep `Rw 66 / C -3.9` beside `R'w 64 / DnT,w 67`;
  EPS/screed hybrid mixed requests keep `Rw 72 / C -1.3` beside
  `R'w 70 / DnT,w 73`. `Ctr` remains unsupported because these package
  owners declare `Rw+C`, not a true `Ctr`. Gate BV selected
  `post_v1_next_numeric_coverage_gap_gate_bw_plan`.
- Impact field outputs remain on the explicit `impactFieldContext`
  adapter and are not owned by this airborne building adapter.
- ASTM `IIC` / `AIIC` aliases remain unsupported without their own
  ASTM band-curve owner.

## Validation Target

Focused validation must include Gate BT continuity and Gate BU runtime:

`pnpm --filter @dynecho/engine exec vitest run src/post-v1-next-numeric-coverage-gap-gate-bt-contract.test.ts src/post-v1-floor-open-box-finished-package-airborne-building-companion-gate-bu-contract.test.ts --maxWorkers=1`

Full calculator validation remains:

`pnpm calculator:gate:current`

## Validation Completed

Focused Gate BT/Gate BU validation passed with engine 2 files / 10
tests. Resolver and open-box focused validation passed before the full
gate. Full `pnpm calculator:gate:current` passed after Gate BU on
2026-06-01 with engine 585 files / 3233 tests, web 113 files / 437
passed + 18 skipped, repo build 5 / 5, and whitespace guard passed.
The Next build still emits the known non-fatal optional `sharp/@img`
warnings through `@turbodocx/html-to-docx`.
