# Checkpoint - 2026-05-06 Model-First Physics Prediction Pivot Gate T

Status: Gate T landed for
`calculator_model_first_physics_prediction_pivot_v1`.

Gate T landed file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-t-family-material-gap-closure-contract.test.ts`

Gate T landed action:

`gate_t_close_remaining_family_material_property_gaps_for_dynamic_calculator`

Selection status:

`gate_t_family_material_property_gap_closure_landed_no_runtime_selected_next_solver_or_calibration_gate_u`

Selected next Gate U file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-u-next-solver-or-calibration-selection-contract.test.ts`

Selected next Gate U action:

`gate_u_select_next_solver_or_calibration_lane_after_material_gap_closure`

## What Landed

Gate T closes the high-impact material-property gaps that were blocking
broader Dynamic Calculator family physics readiness. This is not a source
catalog expansion: the new values are engineering defaults for formula
inputs and uncertainty accounting, while exact/source-owned evidence still
requires the Gate H promotion policy.

Code surfaces:

- `packages/shared/src/domain/material.ts` adds `absorberClass` to shared
  acoustic material metadata.
- `packages/catalogs/src/materials/seed-materials.ts` adds engineering
  defaults for board leaves/finishes, masonry cores, porous absorbers,
  floor decks/screeds, limp membranes, and resilient impact layers.
- `packages/engine/src/airborne-family-material-gap-closure.ts` evaluates
  per-family material readiness, required gaps, optional precision gaps,
  and default-driven uncertainty widening.
- `packages/engine/src/airborne-family-material-expansion.ts` now reports
  `absorberClass` as an owned acoustic material field when present.
- `tools/dev/run-calculator-current-gate.ts` includes the Gate T contract
  in the current calculator gate runner.

## Boundaries

- Runtime numeric behavior did not move.
- Output support buckets, route cards, workbench input behavior, and
  proposal report copy did not move.
- Required material-property gaps still produce `needs_input`.
- Optional precision gaps produce `complete_with_defaults` and widen the
  error budget instead of pretending to be exact evidence.
- Engineering defaults are not marked `source_owned`.
- Gate S double-leaf/framed runtime pins remain stable:
  independent absorbed gypsum / rockwool / gypsum stays at `Rw 45`,
  `STC 45`, `C -1`, `Ctr -6.1`, and `errorBudgetDb: 7`.

## Next Step

Gate U should select the next solver or calibration lane after material
gap closure. The decision should compare remaining coverage gaps,
readiness scenarios, residual risk, and Dynamic Calculator user impact.
Source rows may still promote only through the Gate H exact/calibrated
policy; source absence must not block formula-backed prediction when the
physical inputs are present.

## Validation

Completed on 2026-05-06:

- `pnpm --filter @dynecho/engine exec vitest run src/calculator-model-first-physics-prediction-pivot-gate-t-family-material-gap-closure-contract.test.ts --maxWorkers=1`
  - 1 file passed, 6 tests passed.
- `pnpm --filter @dynecho/engine exec vitest run src/calculator-model-first-physics-prediction-pivot-gate-i-family-material-expansion-contract.test.ts src/calculator-model-first-physics-prediction-pivot-gate-s-double-leaf-framed-bridge-runtime-contract.test.ts src/calculator-model-first-physics-prediction-pivot-gate-t-family-material-gap-closure-contract.test.ts --maxWorkers=1`
  - 3 files passed, 20 tests passed.
- `pnpm --filter @dynecho/shared typecheck`
- `pnpm --filter @dynecho/catalogs typecheck`
- `pnpm --filter @dynecho/engine typecheck`
- `pnpm calculator:gate:current`
  - engine: 300 files passed, 1711 tests passed.
  - web: 62 files passed, 275 tests passed, 18 skipped.
  - repo build passed with the known non-fatal `sharp/@img` optional
    dependency warnings.
- `git diff --check`
  - clean.
