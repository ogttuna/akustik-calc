# Gate AZ Advanced Wall Source-Absent Solver Input Surface - 2026-05-13

Landed action:

`gate_az_personal_use_mvp_advanced_wall_source_absent_solver_input_surface_plan`

Selection status:

`gate_az_personal_use_mvp_advanced_wall_source_absent_solver_input_surface_landed_selected_floor_impact_source_absent_solver_gap_cartography_gate_ba`

Selected next action:

`gate_ba_personal_use_mvp_floor_impact_source_absent_solver_gap_cartography_plan`

Selected next file:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ba-floor-impact-source-absent-solver-gap-cartography-contract.test.ts`

Short label:

advanced wall source-absent solver input surface

## Summary

Gate AZ lands the Dynamic Calculator input surface for the Gate AY
advanced wall source-absent solver. It does not retune the Gate AY
formula corridor and does not promote field/building adapters. It makes
the explicit physical owner fields usable from the workbench, replay,
snapshot, report, and API surfaces.

Complete UI-derived advanced wall input now flows through shared
`AirborneContext.advancedWall` into the Gate AY runtime adapter and
preserves lab `Rw 65`, `STC 65`, `C -1.1`, and `Ctr -6.4` through
`gate_ay_advanced_wall_source_absent_direct_curve_runtime_corridor`.
The value keeps `family_physics_prediction`, the Gate AY candidate id,
and source-absent budgets of `+/-8 dB` for `Rw` / `STC` and `+/-3 dB`
for `C` / `Ctr` as not-measured evidence.

Gate AZ keeps the calculator-first boundaries intact:

- partial physical input returns `needs_input` with precise missing
  fields and no promoted budget;
- field and building targets remain unsupported and are not lab aliases;
- duplicate or split leaf/panel/cavity/opening ownership is refused;
- safe explicit reorders remain stable because owned sequence fields
  drive the solver;
- exact source precedence and already-owned delegate routes still win
  before the advanced-wall formula corridor;
- cards, posture, dynamic trace, corridor dossier, Markdown report,
  saved replay, server snapshot, calculator API, and impact-independent
  wall evaluation surfaces show the same Gate AY basis.

## Next Gate

Gate BA should add:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ba-floor-impact-source-absent-solver-gap-cartography-contract.test.ts`

Gate BA should be no-runtime cartography for floor-impact
source-absent solver coverage. It should map concrete, floating screed,
resilient underlay, suspended ceiling, and mixed timber/steel/CLT floor
impact combinations across exact-source rows, existing owned formula
lanes, `needs_input`, unsupported basis boundaries, and remaining solver
gaps before selecting a later bounded `Ln,w` / `DeltaLw` runtime
corridor.

## Validation

Validation passed on 2026-05-13:

1. focused Gate AZ engine contract: 1 file / 5 tests;
2. focused Gate AZ web acceptance: 1 file / 4 tests;
3. Gate AX + Gate AY + Gate AZ continuity;
4. web opening/leak + advanced wall input-surface continuity;
5. `pnpm calculator:gate:current`;
6. `git diff --check`: clean.

Known non-blocking warnings remained unchanged: jsdom workbench tests
can print the existing Zustand storage-unavailable warning, and the
Next build can report optional `sharp` / `@img` package warnings before
compiling successfully.
