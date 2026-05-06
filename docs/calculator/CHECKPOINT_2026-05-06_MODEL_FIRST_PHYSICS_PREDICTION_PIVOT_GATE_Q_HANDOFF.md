# Checkpoint - 2026-05-06 Model-First Physics Prediction Pivot Gate Q

## Status

Landed Gate Q for the active slice:

`calculator_model_first_physics_prediction_pivot_v1`

Gate Q landed action:

`gate_q_define_double_leaf_framed_bridge_input_and_benchmark_contract_for_dynamic_calculator`

Gate Q landed file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-q-double-leaf-framed-bridge-input-contract.test.ts`

Selection status:

`gate_q_double_leaf_framed_bridge_input_contract_landed_no_runtime_selected_solver_candidate_gate_r`

Selected next file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-r-double-leaf-framed-bridge-solver-contract.test.ts`

Selected next action:

`gate_r_define_double_leaf_framed_bridge_solver_candidate_without_runtime_value_movement`

Previous Gate P selection status:

`gate_p_next_family_solver_selection_landed_no_runtime_selected_double_leaf_framed_bridge_gate_q`

Gate P selected Gate Q file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-q-double-leaf-framed-bridge-input-contract.test.ts`

Gate P selected Gate Q action:

`gate_q_define_double_leaf_framed_bridge_input_and_benchmark_contract_for_dynamic_calculator`

## What Changed

Gate Q adds
`packages/engine/src/dynamic-calculator-double-leaf-framed-bridge-input-contract.ts`
and exports it from `packages/engine/src/index.ts`.

It also extends the shared wall topology mode enum with
`double_leaf_framed` and wires explicit double-leaf/framed contexts into
`packages/engine/src/dynamic-calculator-route-input-topology.ts`.

This is an input and benchmark contract, not a runtime value movement.
The contract makes the physical prerequisites executable before a
double-leaf/framed bridge solver can be promoted:

- side A leaf group;
- cavity depth;
- side B leaf group;
- frame bridge class;
- support topology;
- support/stud spacing;
- resilient-bar side count when the bridge class is resilient;
- porous fill precision fields such as flow resistivity and absorber
  class for error-budget tightening.

Source absence remains exact/calibration-only evidence. It does not
turn the selected family into a source-library task.

## Benchmarks

Gate Q adds a small source-independent benchmark pack:

- explicit independent absorbed double-leaf cavity: complete with
  engineering-default flow-resistivity uncertainty;
- missing bridge/grouping/spacing: targeted `needs_input`;
- resilient bridge missing side count: targeted `needs_input`;
- direct-fixed bridge: complete input but negative for later broad
  runtime promotion;
- multi-cavity flat list: nearby negative, not swallowed by the
  double-leaf/framed contract.

The route-input assessment now recognizes only explicit
`wallTopology.topologyMode: "double_leaf_framed"` for this contract.
Existing ambiguous multi-cavity flat lists continue to use the grouped
multi-cavity prompt path instead of being auto-promoted into double-leaf.

## Runtime Movement

Gate Q does not move numeric runtime values, target-output support,
confidence, evidence, report copy, or solver origin.

Forward pins remain:

- Gate O single 12.5 mm gypsum board remains `Rw 31 / STC 31` with
  `family_physics_prediction` and `runtimeValueMovement: false`;
- Gate G grouped Rockwool triple-leaf remains `Rw 50 / STC 55` on
  `triple_leaf_two_cavity_frequency_solver`;
- double-leaf/framed runtime promotion remains blocked until a solver
  candidate contract owns equations, benchmark ranges, negative
  boundaries, and visible/report parity.

## Next Step

Implement Gate R:

`gate_r_define_double_leaf_framed_bridge_solver_candidate_without_runtime_value_movement`

Gate R should define the solver-candidate/equation contract for
double-leaf / framed bridge systems. It should name the mass-air-mass
resonance, bridge-coupling, porous-damping, and rating-adapter method
owners, expected tolerance/error-budget posture, and the positive and
nearby-negative numeric benchmark ranges before any runtime value
promotion.

## Validation

Validation passed on 2026-05-06:

- focused Gate Q Vitest:
  `pnpm --filter @dynecho/engine exec vitest run src/calculator-model-first-physics-prediction-pivot-gate-q-double-leaf-framed-bridge-input-contract.test.ts --maxWorkers=1`
  passed 1 file / 7 tests.
- focused Gate P forward-continuity Vitest:
  `pnpm --filter @dynecho/engine exec vitest run src/calculator-model-first-physics-prediction-pivot-gate-p-next-family-solver-upgrade-selection-contract.test.ts --maxWorkers=1`
  passed 1 file / 5 tests.
- pivot continuity A through Q passed 16 files / 104 tests.
- `pnpm --filter @dynecho/shared typecheck` passed.
- `pnpm --filter @dynecho/engine typecheck` passed.
- `pnpm calculator:gate:current` passed: engine focused gate
  297 files / 1691 tests, web focused gate 61 files / 273 passed
  and 18 skipped, repo build 5/5 tasks.
- `git diff --check` passed.

Known non-blocking environment noise: the web build emitted optional
`sharp` / `@img` dependency warnings, but compilation, type validation,
static generation, and build completion succeeded.
