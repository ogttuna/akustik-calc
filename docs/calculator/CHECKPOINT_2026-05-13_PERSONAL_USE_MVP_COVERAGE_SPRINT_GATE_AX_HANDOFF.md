# Gate AX Advanced Wall Source-Absent Solver Contract - 2026-05-13

Landed action:

`gate_ax_personal_use_mvp_advanced_wall_source_absent_solver_contract_plan`

Selection status:

`gate_ax_personal_use_mvp_advanced_wall_source_absent_solver_contract_landed_no_runtime_selected_runtime_corridor_gate_ay`

Selected next action:

`gate_ay_personal_use_mvp_advanced_wall_source_absent_solver_runtime_corridor_plan`

Selected next file:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ay-advanced-wall-source-absent-solver-runtime-corridor-contract.test.ts`

## Summary

Gate AX lands as the no-runtime advanced wall source-absent solver contract
selected by Gate AW. It does not change runtime values, source rows, tolerance/error
budgets, workbench inputs, API payload values, cards, reports, or
basis labels.

Gate AX converts the Gate AW wall gaps into an executable owner map for
future multi-panel / multi-cavity element-lab wall prediction:

- route, basis, and metric owner for lab `Rw`, `STC`, `C`, and `Ctr`;
- explicit leaf, panel, and cavity topology owner for N-layer walls;
- panel dynamic property owner for surface mass, bending stiffness, loss
  factor, critical frequency, material class, and thickness;
- cavity and absorber owner for airspace depth, absorber thickness,
  coverage, flow resistivity, and cavity seal state;
- frame and coupling owner for studs/frames, resilient connections, and
  mechanical bridges;
- opening/leak sub-element owner that either declares no openings or
  supplies the Gate S/T/U opening terms;
- direct-curve and rating-adapter owner for one-third-octave direct
  transmission plus ISO 717 and STC adapters;
- hostile-input guard owner for duplicate ownership, split layers, and
  unsafe reorders;
- source-absent uncertainty visibility owner for the future runtime
  budget.

Complete input is only `ready_for_runtime_gate`. Missing panel,
cavity/absorber, opening/leak, duplicate/split topology, field/building
outputs, and exact-source same-stack cases all fail closed or delegate to
existing owned routes. Field/building `R'w` and `DnT,w` remain blocked at
Gate AX, and exact source precedence stays first.

The future Gate AY runtime corridor must use this owner set before
promoting any numeric advanced wall solver. Gate AX records proposed
source-absent design-budget requirements for Gate AY only: `+/-8 dB`
for `Rw` / `STC`, and `+/-3 dB` for `C` / `Ctr`. Those budgets are not
active runtime tolerances at Gate AX and are not measured evidence.

## Next Gate

Gate AY should add:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ay-advanced-wall-source-absent-solver-runtime-corridor-contract.test.ts`

Gate AY may promote runtime only if the direct-curve owner terms are
executable, missing-field behavior remains precise, exact-source
precedence stays first, current grouped triple-leaf and existing family
delegates are not regressed, field/building outputs remain separate, and
the source-absent budget is visible as not-measured evidence.

## Validation

Validation passed on 2026-05-13:

1. focused Gate AX engine contract: 1 file / 6 tests;
2. Gate AW + Gate AX continuity: 2 files / 12 tests;
3. `pnpm calculator:gate:current`: engine 391 files / 2259 tests, web
   75 files / 321 passed + 18 skipped, repo build 5/5;
4. `git diff --check`: clean.

Known non-blocking warnings remained unchanged: Vitest still prints the
workbench Zustand storage-unavailable warning in jsdom cases, and the
Next build still reports optional `sharp` package resolution warnings
before compiling successfully.
