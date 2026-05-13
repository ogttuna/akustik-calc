# Gate AY Advanced Wall Source-Absent Solver Runtime Corridor - 2026-05-13

Landed action:

`gate_ay_personal_use_mvp_advanced_wall_source_absent_solver_runtime_corridor_plan`

Selection status:

`gate_ay_personal_use_mvp_advanced_wall_source_absent_solver_runtime_corridor_landed_selected_input_surface_gate_az`

Selected next action:

`gate_az_personal_use_mvp_advanced_wall_source_absent_solver_input_surface_plan`

Selected next file:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-az-advanced-wall-source-absent-solver-input-surface-contract.test.ts`

Short label:

advanced wall source-absent solver runtime corridor

## Summary

Gate AY lands the bounded runtime corridor selected by Gate AX. It adds
the first executable advanced wall source-absent solver for complete,
explicit owner input without adding broad source-row crawling or a public
workbench input surface yet.

Complete Gate AX owner input now promotes to
`gate_ay_advanced_wall_source_absent_direct_curve_runtime_corridor`.
The runtime builds a third-octave direct transmission curve from explicit
panel surface mass, bending stiffness, loss factor, critical frequency,
cavity depth, absorber thickness/coverage/flow resistivity, frame and
coupling terms, and explicit opening intent. The active no-opening
fixture returns lab `Rw 65`, `STC 65`, `C -1.1`, and `Ctr -6.4` with
source-absent budgets of `+/-8 dB` for `Rw` / `STC` and `+/-3 dB` for
`C` / `Ctr`. A weak opening/leak fixture is not ignored; it drops to
`Rw 37`, `STC 36`, `C 1.2`, and `Ctr 1.2`.

The corridor keeps the calculator-first model honest:

- exact same-stack lab source precedence bypasses the formula;
- existing owned grouped triple-leaf delegates keep their current
  runtime values;
- missing panel, cavity/absorber, frame/coupling, opening/leak, direct
  curve, rating-adapter, or budget owners return `needs_input`;
- duplicate layer ownership, duplicate leaf/panel ownership, duplicate
  cavity/opening identity, and unsafe topology return fail-closed
  results with no budget;
- safe explicit reorders remain stable because the solver sorts by
  owned sequence fields, not UI array position;
- field/building outputs remain unsupported and are not aliases of lab
  `Rw` / `STC`.

Gate AY is intentionally not the workbench input surface. The runtime is
now executable behind explicit typed owner input, and Gate AZ is selected
to make those physical fields first-class on the Dynamic Calculator wall
input surface.

## Next Gate

Gate AZ should add:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-az-advanced-wall-source-absent-solver-input-surface-contract.test.ts`

Gate AZ should wire the Gate AY physical fields through the calculator
input surface and replay/API payloads without retuning `Rw 65` /
`STC 65` / `C -1.1` / `Ctr -6.4`, without promoting field/building
adapters, and without weakening the exact-source, missing-input, and
hostile-topology boundaries.

## Validation

Validation passed on 2026-05-13:

1. focused Gate AY engine contract: 1 file / 8 tests;
2. Gate AX + Gate AY continuity: 2 files / 14 tests;
3. Gate AW + Gate AX + Gate AY continuity: 3 files / 20 tests;
4. `pnpm calculator:gate:current`: engine 392 files / 2267 tests, web
   75 files / 321 passed + 18 skipped, repo build 5/5;
5. `git diff --check`: clean.

Known non-blocking warnings remained unchanged: Vitest still prints the
workbench Zustand storage-unavailable warning in jsdom cases, and the
Next build still reports optional `sharp` package resolution warnings
before compiling successfully.
