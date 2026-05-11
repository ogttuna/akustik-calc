# Personal-Use MVP Coverage Sprint Gate X Handoff - 2026-05-11

## Status

Gate X has landed:

`gate_x_personal_use_mvp_aac_nonhomogeneous_masonry_wall_family_solver_plan`

Selection status:

`gate_x_personal_use_mvp_aac_nonhomogeneous_masonry_wall_family_solver_landed_selected_clt_ctr_gate_y`

Selected next action:

`gate_y_personal_use_mvp_clt_mass_timber_ctr_spectrum_adapter_plan`

Selected next file:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-y-clt-mass-timber-ctr-spectrum-adapter-contract.test.ts`

## What Changed

- Added
  `packages/engine/src/dynamic-airborne-gate-x-aac-nonhomogeneous-masonry.ts`
  as the named AAC / non-homogeneous masonry family-physics basis helper.
- Promoted only complete element-lab AAC / non-homogeneous masonry
  wall results from `screening_fallback` to
  `family_physics_prediction` through
  `gate_x_aac_nonhomogeneous_masonry_sharp_davy_family_physics_runtime`.
- Kept the existing runtime values unchanged:
  `Rw 44 / STC 44 / C -0.7 / Ctr -5.2`.
- Added the route-input owner set in
  `packages/engine/src/dynamic-calculator-route-input-topology.ts`:
  AAC material class, density, thickness, surface mass, and optional
  stiffness / loss-factor defaults. Custom AAC with missing density now
  returns `needs_input` for `densityKgM3`.
- Added Gate X candidate id mapping:
  `candidate_aac_nonhomogeneous_masonry_family_physics_prediction`.
- Preserved exact-source precedence and kept wrong-family, lined
  massive, field/apparent, and building-prediction requests out of the
  Gate X lab basis.
- Added
  `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-x.ts`
  so the Gate X matrix/ranking logic stays outside the near-2000-line
  base coverage matrix file.

## Matrix Result

The Gate X executable matrix still has 28 rows. It closes
`wall.aac_nonhomogeneous_masonry.lab` and leaves
`wall.clt_mass_timber.lab` as the remaining immediate coverage gap
because CLT / mass-timber wall `Ctr` still lacks a bounded spectrum
adapter. Gate Y is selected for that gap.

Broad source crawling remains unselected. Targeted AAC source holdouts
remain useful future calibration evidence, but they are not needed for
the Gate X runtime promotion because the family-physics path owns the
required material/topology inputs and visible error budget.

## Architecture Note

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint.ts` is
1989 lines after Gate X. It stays below the local 2000-line split
threshold because Gate X matrix/ranking work lives in
`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-x.ts`.
Gate Y should continue this companion-module pattern.

## Validation

Completed validation:

- focused Gate X:
  `pnpm --filter @dynecho/engine exec vitest run src/calculator-personal-use-mvp-coverage-sprint-gate-x-aac-nonhomogeneous-masonry-wall-family-solver-contract.test.ts --maxWorkers=1`
  passed 1 file / 7 tests;
- focused Gate W/X continuity:
  `pnpm --filter @dynecho/engine exec vitest run src/calculator-personal-use-mvp-coverage-sprint-gate-w-coverage-matrix-refresh-after-opening-leak-contract.test.ts src/calculator-personal-use-mvp-coverage-sprint-gate-x-aac-nonhomogeneous-masonry-wall-family-solver-contract.test.ts --maxWorkers=1`
  passed 2 files / 13 tests;
- engine typecheck:
  `pnpm --filter @dynecho/engine typecheck` passed;
- targeted regression after the Gate A historical AAC snapshot and
  dynamic-airborne line-count update:
  `pnpm --filter @dynecho/engine exec vitest run src/calculator-personal-use-mvp-coverage-sprint-gate-a-scenario-matrix-contract.test.ts src/dynamic-airborne-split-v2-gate-b-eleventh-carve-contract.test.ts --maxWorkers=1`
  passed 2 files / 12 tests;
- current gate:
  `pnpm calculator:gate:current` passed with engine 365 files / 2109
  tests, web 73 files / 314 passed + 18 skipped, repo build 5/5, and
  whitespace guard clean. Known non-fatal warnings remain the existing
  Zustand unavailable test-storage warnings and optional `sharp/@img`
  package resolution warnings during the Next build.
