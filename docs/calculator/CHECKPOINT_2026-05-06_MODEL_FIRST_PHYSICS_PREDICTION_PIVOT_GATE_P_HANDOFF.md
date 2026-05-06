# Checkpoint - 2026-05-06 Model-First Physics Prediction Pivot Gate P

## Status

Landed Gate P for the active slice:

`calculator_model_first_physics_prediction_pivot_v1`

Gate P landed action:

`gate_p_select_next_family_solver_upgrade_after_single_leaf_runtime_promotion`

Gate P landed file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-p-next-family-solver-upgrade-selection-contract.test.ts`

Selection status:

`gate_p_next_family_solver_selection_landed_no_runtime_selected_double_leaf_framed_bridge_gate_q`

Selected next file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-q-double-leaf-framed-bridge-input-contract.test.ts`

Selected next action:

`gate_q_define_double_leaf_framed_bridge_input_and_benchmark_contract_for_dynamic_calculator`

Previous Gate O selection status:

`gate_o_single_leaf_massive_panel_runtime_promotion_landed_no_value_selected_next_family_solver_gate_p`

Gate O selected Gate P file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-p-next-family-solver-upgrade-selection-contract.test.ts`

Gate O selected Gate P action:

`gate_p_select_next_family_solver_upgrade_after_single_leaf_runtime_promotion`

## What Changed

Gate P adds
`packages/engine/src/dynamic-calculator-next-family-solver-upgrade-selection.ts`
and exports it from `packages/engine/src/index.ts`.

The helper reuses the Gate N family solver candidate matrix, excludes
the already-landed single-leaf / laminated single-leaf / rigid massive
panel family from the next-upgrade ranking, and selects
double-leaf / framed bridge as the next Dynamic Calculator solver
family.

This is a calculator-engine selection step, not a source-library step.
The selected family does not require a measured source row to exist
before DynEcho can build a source-absent physics solver. Trusted source
rows remain exact overrides, calibration anchors, holdouts, and
benchmark evidence when their topology, material, metric, tolerance, and
rights owners are complete.

## Selection Rationale

Gate P selects double-leaf / framed bridge because:

- it unlocks common personal-use wall calculator coverage;
- it is the nearest wall lab-element family after Gate O;
- Gate N already named its missing physical owners;
- Gate I already has the absorbed double-leaf material-readiness
  scenario;
- the next safe move is an input and benchmark contract, not broad
  runtime promotion.

Runtime promotion remains blocked until Gate Q or later owns:

- `frameBridgeClass`;
- `studSpacingMm`;
- `resilientSideCount`;
- `supportTopology`;
- porous cavity damping;
- mass-air-mass resonance;
- positive benchmark scenarios and nearby negative scenarios.

Deferred families remain explicit:

- generalized multi-cavity needs a grouped leaf graph, limp-mass
  position owner, multi-cavity transfer owner, and unsafe flat-list
  guard;
- lined masonry / CLT needs core/lining boundary ownership and CLT
  directional properties;
- floor impact needs dynamic stiffness, load basis, and a separate
  ISO 717-2 / ASTM E989 adapter boundary;
- field/building prediction needs area, room volume, RT60, flanking
  context, and lab-to-field basis delta ownership.

## Runtime Movement

Gate P does not move numeric runtime values, target-output support,
confidence, evidence, report copy, or workbench input behavior.

The Gate O and Gate G pins remain the forward-continuity expectations:

- single 12.5 mm gypsum board remains `Rw 31 / STC 31` with
  `family_physics_prediction` and `runtimeValueMovement: false`;
- two 12.5 mm gypsum boards remain `Rw 34 / STC 34` with
  `family_physics_prediction` and `runtimeValueMovement: false`;
- 150 mm concrete remains `Rw 55 / STC 55` with
  `family_physics_prediction` and `runtimeValueMovement: false`;
- grouped Rockwool triple-leaf remains `Rw 50 / STC 55` on the Gate G
  `triple_leaf_two_cavity_frequency_solver` path;
- CLT/mass timber remains `screening_fallback` until orthotropic and
  directional material properties are owned.

## Next Step

Implement Gate Q:

`gate_q_define_double_leaf_framed_bridge_input_and_benchmark_contract_for_dynamic_calculator`

Gate Q should define the double-leaf / framed bridge input contract and
benchmark pack for Dynamic Calculator. It should not move runtime values
until the required physical inputs, positive benchmarks, nearby
negatives, hostile-input boundaries, error-budget posture, and
visible/report basis parity are owned.

## Validation

Validation commands for this checkpoint are green:

- focused Gate P Vitest:
  `pnpm --filter @dynecho/engine exec vitest run src/calculator-model-first-physics-prediction-pivot-gate-p-next-family-solver-upgrade-selection-contract.test.ts --maxWorkers=1`
  passed 1 file / 5 tests;
- focused Gate O forward-continuity Vitest:
  `pnpm --filter @dynecho/engine exec vitest run src/calculator-model-first-physics-prediction-pivot-gate-o-single-leaf-massive-panel-runtime-contract.test.ts --maxWorkers=1`
  passed 1 file / 4 tests;
- pivot continuity A through P passed 15 files / 97 tests;
- `pnpm --filter @dynecho/engine typecheck` passed;
- `pnpm calculator:gate:current` passed:
  engine 296 files / 1684 tests, web 61 files / 273 passed + 18
  skipped, repo build 5 / 5 tasks, whitespace guard green;
- `git diff --check` passed.

Known non-fatal build warnings remain the existing optional
`sharp/@img` package resolution warnings through
`@turbodocx/html-to-docx`; they did not fail the build.
