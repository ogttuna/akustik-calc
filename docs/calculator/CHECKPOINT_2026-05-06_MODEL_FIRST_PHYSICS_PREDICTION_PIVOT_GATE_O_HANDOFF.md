# Checkpoint - 2026-05-06 Model-First Physics Prediction Pivot Gate O

## Status

Landed Gate O for the active slice:

`calculator_model_first_physics_prediction_pivot_v1`

Gate O landed action:

`gate_o_promote_single_leaf_massive_panel_family_solver_runtime_for_dynamic_calculator`

Gate O landed file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-o-single-leaf-massive-panel-runtime-contract.test.ts`

Selection status:

`gate_o_single_leaf_massive_panel_runtime_promotion_landed_no_value_selected_next_family_solver_gate_p`

Selected next file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-p-next-family-solver-upgrade-selection-contract.test.ts`

Selected next action:

`gate_p_select_next_family_solver_upgrade_after_single_leaf_runtime_promotion`

Previous Gate N selection status:

`gate_n_family_solver_upgrade_selection_landed_no_runtime_selected_single_leaf_massive_panel_gate_o`

Gate N selected Gate O file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-o-single-leaf-massive-panel-runtime-contract.test.ts`

Gate N selected Gate O action:

`gate_o_promote_single_leaf_massive_panel_family_solver_runtime_for_dynamic_calculator`

## What Changed

Gate O adds
`packages/engine/src/dynamic-airborne-gate-o-single-leaf.ts` and wires it
into `packages/engine/src/dynamic-airborne.ts`.

The helper promotes only complete single-leaf / laminated single-leaf /
rigid massive panel topologies to an uncalibrated
`family_physics_prediction` basis:

- one visible solid leaf;
- no cavity, porous fill, support layer, or gap;
- finite positive thickness, density, and surface mass;
- no CLT/mass-timber material.

This is a calculator-engine move, not a source-library move. Exact source
rows still win when they are truly eligible under the Gate H promotion
policy. Source absence blocks exact/calibrated promotion only; it does
not block this source-absent formula-backed family prediction.

Architecture note: the new family basis builder lives outside the
composer. `dynamic-airborne.ts` only imports and invokes it, and the
existing split-size guard was updated to the new 1856-line composer
surface, still below the 2000-line follow-up threshold.

## Runtime Movement

Gate O changes selected origin/basis for the selected low-blast-radius
family, but does not move the pinned numeric values or target-output
support:

- single 12.5 mm gypsum board remains `Rw 31 / STC 31` and now selects
  `family_physics_prediction` with `runtimeValueMovement: false`;
- two 12.5 mm gypsum boards remain `Rw 34 / STC 34` and now select
  `family_physics_prediction` with `runtimeValueMovement: false`;
- 150 mm concrete remains `Rw 55 / STC 55` and now selects
  `family_physics_prediction` with `runtimeValueMovement: false`.

Guarded boundaries:

- an eligible exact full-stack source row still selects
  `measured_exact_full_stack`;
- grouped Rockwool triple-leaf remains the Gate G
  `triple_leaf_two_cavity_frequency_solver` path with its existing
  `Rw 50 / STC 55` movement;
- CLT/mass timber remains `screening_fallback` until orthotropic and
  directional material properties are owned.

## Next Step

Implement Gate P:

`gate_p_select_next_family_solver_upgrade_after_single_leaf_runtime_promotion`

Gate P should select the next family solver upgrade from the remaining
families. Do not select another broad runtime movement just because one
happy-path number is green. The selected next family must name required
physical inputs, equations/method owners, positive benchmarks, nearby
negatives, hostile-input boundaries, error budget, and visible/report
basis parity.

## Validation

Validation commands for this checkpoint are green:

- focused Gate O Vitest:
  `pnpm --filter @dynecho/engine exec vitest run src/calculator-model-first-physics-prediction-pivot-gate-o-single-leaf-massive-panel-runtime-contract.test.ts --maxWorkers=1`
  passed 1 file / 4 tests;
- focused Gate N forward-continuity Vitest:
  `pnpm --filter @dynecho/engine exec vitest run src/calculator-model-first-physics-prediction-pivot-gate-n-family-solver-upgrade-contract.test.ts --maxWorkers=1`
  passed 1 file / 5 tests;
- pivot continuity A through O passed 14 files / 92 tests;
- split-size guard after Gate O helper wiring passed:
  `pnpm --filter @dynecho/engine exec vitest run src/dynamic-airborne-split-v2-gate-b-eleventh-carve-contract.test.ts --maxWorkers=1`;
- `pnpm --filter @dynecho/engine typecheck` passed;
- `pnpm calculator:gate:current` passed:
  engine 295 files / 1679 tests, web 61 files / 273 passed + 18
  skipped, repo build 5 / 5 tasks, whitespace guard green;
- `git diff --check` passed.

Known non-fatal build warnings remain the existing optional
`sharp/@img` package resolution warnings through
`@turbodocx/html-to-docx`; they did not fail the build.
