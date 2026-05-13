# Gate AW Source-Absent Solver Gap Cartography - 2026-05-13

Landed action:

`gate_aw_personal_use_mvp_source_absent_solver_gap_cartography_plan`

Selection status:

`gate_aw_personal_use_mvp_source_absent_solver_gap_cartography_landed_no_runtime_selected_advanced_wall_source_absent_solver_contract_gate_ax`

Selected next action:

`gate_ax_personal_use_mvp_advanced_wall_source_absent_solver_contract_plan`

Selected next file:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ax-advanced-wall-source-absent-solver-contract.test.ts`

## Summary

Gate AW lands as executable no-runtime cartography after Gate AV. It
does not change runtime values, source rows, tolerance/error budgets,
workbench inputs, API payload values, cards, reports, or basis labels.

Gate AW maps 20 representative wall/floor layer-combination cells:

- 12 runtime-owned cells, including exact-source precedence, massive /
  AAC / CLT / lined masonry / grouped triple-leaf wall lab routes,
  opening/leak element-lab, wall field/building context, steel/timber/CLT
  impact lab corridors, and floor field impact context;
- 5 source-absent solver gaps, led by mixed N-layer wall packages,
  multicavity direct-curve wall needs, framed/resilient split layers,
  concrete floating/resilient floor packages, and dynamic-stiffness /
  material-property default ownership;
- 1 opening/leak field/building adapter gap;
- 1 ASTM IIC/AIIC unsupported boundary;
- 1 flat-list multicavity `needs_input` boundary.

The highest-ROI next lane is the advanced wall source-absent solver contract.
This is selected before floor-impact cartography, opening/leak
field/building adapters, ASTM impact adapters, calibration tightening,
or broad source-row crawling because mixed N-layer wall packages are the
largest unbounded layer-combination gap for current consulting use.

## Next Gate

Gate AX should add:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ax-advanced-wall-source-absent-solver-contract.test.ts`

Gate AX is still expected to be no-runtime first. It should define the
physical input contract for a wall multi-panel / multi-cavity direct
curve solver: panel surface mass, stiffness/loss/critical-frequency
inputs or defensible defaults, cavity depths, absorber coverage,
frame/coupling stiffness, stud spacing, resilient connections,
opening/leak sub-elements, exact-source precedence, `needs_input`
fields, hostile duplicate/split/reorder boundaries, and visible budget
requirements.

## Validation

Validation passed on 2026-05-13:

1. focused Gate AW engine contract: 1 file / 6 tests;
2. Gate AV + Gate AW continuity: 2 files / 13 tests;
3. `pnpm calculator:gate:current`: engine 390 files / 2253 tests, web
   75 files / 321 passed + 18 skipped, repo build 5/5;
4. `git diff --check`: clean.

Known non-blocking warnings remained unchanged: Vitest still prints the
workbench Zustand storage-unavailable warning in jsdom cases, and the
Next build still reports optional `sharp` package resolution warnings
before compiling successfully.
