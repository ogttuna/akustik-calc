# Checkpoint - 2026-05-06 Model-First Physics Prediction Pivot Gate N

## Status

Landed Gate N for the active slice:

`calculator_model_first_physics_prediction_pivot_v1`

Gate N landed action:

`gate_n_select_first_family_solver_upgrade_runtime_gate_for_dynamic_calculator`

Gate N landed file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-n-family-solver-upgrade-contract.test.ts`

Selection status:

`gate_n_family_solver_upgrade_selection_landed_no_runtime_selected_single_leaf_massive_panel_gate_o`

Selected next file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-o-single-leaf-massive-panel-runtime-contract.test.ts`

Selected next action:

`gate_o_promote_single_leaf_massive_panel_family_solver_runtime_for_dynamic_calculator`

## What Changed

Gate N adds `packages/engine/src/dynamic-calculator-family-solver-upgrade-selection.ts`,
an executable no-runtime selection matrix for the first family-solver
runtime upgrade after Gate M exposed Dynamic Calculator candidates.

The selected Gate O family is single-leaf / laminated single-leaf /
rigid massive panel:

- current runtime values already exist through Dynamic Calculator
  delegates, but the candidate resolver still selects
  `screening_fallback`;
- Gate I material readiness is complete for the selected family;
- source rows are not required for the source-absent solver to exist;
- the acceptance surface can pin gypsum board, laminated board, and
  concrete values while moving basis/origin honestly;
- the blast radius is lower than double/framed, generalized
  multi-cavity, lined masonry/CLT, floor impact, or field/building
  continuations.

Deferred families keep explicit physics blockers instead of
missing-source excuses:

- double/framed waits on frame/bridge and support spacing owners;
- generalized multi-cavity waits on grouped graph, MLV position, and
  transfer-matrix or impedance-network ownership;
- lined masonry/CLT waits on core/lining boundaries and CLT directional
  properties;
- floor impact waits on dynamic stiffness, load basis, and impact
  rating-adapter ownership;
- field/building prediction waits on room, area, RT60, and flanking
  context owners.

## Runtime Movement

No numeric runtime values, support buckets, confidence, evidence,
workbench input behavior, report copy, or proposal export behavior moved
in Gate N.

Pinned current values in the Gate N contract:

- single 12.5 mm gypsum board remains `Rw 31 / STC 31` with Sharp
  selected in the local dynamic delegate;
- two 12.5 mm gypsum boards remain `Rw 34 / STC 34` with the laminated
  single-leaf Sharp delegate;
- 150 mm concrete remains `Rw 55 / STC 55` with the rigid massive blend;
- grouped Rockwool/MLV triple-leaf remains `Rw 50 / STC 55` and
  `family_physics_prediction` from the Gate G solver.

## Next Step

Implement Gate O:

`gate_o_promote_single_leaf_massive_panel_family_solver_runtime_for_dynamic_calculator`

Gate O should promote the selected single-leaf / massive / panel family
candidate from screening to a labelled source-absent family-physics
runtime basis only when required physical inputs are complete. It should
pin or explicitly tolerance-own any numeric movement, keep `Rw`/`STC`
rating bases separate, and include visible card/report parity tests.

## Validation

Validation commands for this checkpoint are green:

- focused Gate N Vitest:
  `pnpm --filter @dynecho/engine exec vitest run src/calculator-model-first-physics-prediction-pivot-gate-n-family-solver-upgrade-contract.test.ts`
  passed 1 file / 5 tests;
- pivot continuity A through N passed 13 files / 88 tests;
- `pnpm --filter @dynecho/engine typecheck` passed;
- `pnpm calculator:gate:current` passed:
  engine 294 files / 1675 tests, web 61 files / 273 passed + 18
  skipped, repo build 5 / 5 tasks, whitespace guard green;
- `git diff --check` passed.

Known non-fatal build warnings remain the existing optional
`sharp/@img` package resolution warnings through
`@turbodocx/html-to-docx`; they did not fail the build.
