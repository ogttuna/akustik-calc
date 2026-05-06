# Checkpoint - 2026-05-06 Model-First Physics Prediction Pivot Gate R

## Status

Landed Gate R for the active slice:

`calculator_model_first_physics_prediction_pivot_v1`

Gate R landed action:

`gate_r_define_double_leaf_framed_bridge_solver_candidate_without_runtime_value_movement`

Gate R landed file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-r-double-leaf-framed-bridge-solver-contract.test.ts`

Selection status:

`gate_r_double_leaf_framed_bridge_solver_contract_landed_no_runtime_selected_runtime_promotion_gate_s`

Selected next file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-s-double-leaf-framed-bridge-runtime-contract.test.ts`

Selected next action:

`gate_s_promote_double_leaf_framed_bridge_solver_runtime_for_dynamic_calculator`

Previous Gate Q selection status:

`gate_q_double_leaf_framed_bridge_input_contract_landed_no_runtime_selected_solver_candidate_gate_r`

Gate Q selected Gate R file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-r-double-leaf-framed-bridge-solver-contract.test.ts`

Gate Q selected Gate R action:

`gate_r_define_double_leaf_framed_bridge_solver_candidate_without_runtime_value_movement`

## What Changed

Gate R adds
`packages/engine/src/dynamic-calculator-double-leaf-framed-bridge-solver-contract.ts`
and exports it from `packages/engine/src/index.ts`.

This is a solver-candidate and equation contract, not a runtime value
movement. It defines the no-runtime method owners required before the
Dynamic Calculator can promote explicit double-leaf / framed bridge
walls:

- side-leaf surface-mass partition from explicit side A / side B groups;
- mass-air-mass resonance using leaf masses and cavity depth;
- bridge-coupling delta from frame bridge class, support topology,
  support spacing, and resilient-bar side count;
- porous-cavity damping from fill coverage, absorption class, and flow
  resistivity;
- ISO 717-1 `Rw` rating adapter over the calculated curve;
- ASTM E413 `STC` rating-adapter boundary, explicitly not an alias of
  `Rw`.

Source absence remains exact/calibration-only evidence. The solver
candidate is source-independent, but exact source rows can still override
or calibrate later through the Gate H policy.

## Benchmarks

Gate R adds a source-independent benchmark pack:

- explicit independent absorbed cavity: solver candidate ready with
  engineering-default porous damping uncertainty;
- resilient bridge with both-side side count: solver candidate ready
  but still no-runtime;
- resilient bridge missing side count: targeted `needs_input`;
- direct-fixed bridge: complete input but negative boundary for this
  bridge solver;
- non-explicit multi-cavity flat list: rejected at the family boundary.

The positive benchmark corridor records uncalibrated `Rw` / `STC`
ranges and error budget. These are not visible runtime values yet; they
are the acceptance envelope Gate S must pin before promotion.

## Runtime Movement

Gate R does not move numeric runtime values, target-output support,
confidence, evidence, report copy, or solver origin.

Forward pins remain:

- Gate O single 12.5 mm gypsum board remains `Rw 31 / STC 31` with
  `family_physics_prediction` and `runtimeValueMovement: false`;
- Gate G grouped Rockwool triple-leaf remains `Rw 50 / STC 55` on
  `triple_leaf_two_cavity_frequency_solver`;
- explicit double-leaf/framed runtime promotion remains blocked until
  Gate S wires the candidate with value pins and route-card/output-card/
  report parity.

## Next Step

Implement Gate S:

`gate_s_promote_double_leaf_framed_bridge_solver_runtime_for_dynamic_calculator`

Gate S should wire the Gate R solver candidate into the Dynamic
Calculator runtime for explicitly complete double-leaf/framed contexts
only. It must pin numeric values/ranges, basis/origin, support bucket,
selected/rejected candidate trace, visible route/output card behavior,
and PDF/DOCX report snapshot parity. It must keep missing-input,
direct-fixed, and multi-cavity flat-list negative boundaries intact.

## Validation

Validation completed:

- focused Gate R Vitest:
  `pnpm --filter @dynecho/engine exec vitest run src/calculator-model-first-physics-prediction-pivot-gate-r-double-leaf-framed-bridge-solver-contract.test.ts --maxWorkers=1`
  passed 1 file / 7 tests;
- focused Gate Q forward-continuity Vitest:
  `pnpm --filter @dynecho/engine exec vitest run src/calculator-model-first-physics-prediction-pivot-gate-q-double-leaf-framed-bridge-input-contract.test.ts --maxWorkers=1`
  passed 1 file / 7 tests;
- pivot continuity A through R passed 17 files / 111 tests;
- `pnpm --filter @dynecho/shared typecheck` passed;
- `pnpm --filter @dynecho/engine typecheck` passed;
- `pnpm calculator:gate:current` passed the focused engine suite
  (298 files / 1698 tests), focused web suite (61 files / 273 passed,
  18 skipped), and repo build (5 tasks successful). The web build still
  emits the known optional `sharp`/`@img` package warnings without
  failing the build;
- `git diff --check` passed.
