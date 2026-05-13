# Personal-Use MVP Coverage Sprint Gate BG Handoff

Date: 2026-05-13

## Landed Gate

Gate BG has now landed:

`gate_bg_personal_use_mvp_floor_impact_source_absent_post_input_surface_revalidation_plan`

Gate BG selection status:

`gate_bg_personal_use_mvp_floor_impact_source_absent_post_input_surface_revalidation_landed_no_runtime_selected_coverage_matrix_refresh_gate_bh`

Selected next action:

`gate_bh_personal_use_mvp_floor_impact_source_absent_coverage_matrix_refresh_plan`

Selected next file:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bh-floor-impact-source-absent-coverage-matrix-refresh-contract.test.ts`

Next plain label: floor-impact source-absent coverage matrix refresh.

## What Changed

Gate BG is a no-runtime revalidation gate after Gate BF's first-class
`Heavy concrete combined input surface`. It proves the complete
UI-derived heavy-concrete combined floor input still returns lab
`Ln,w 44.4` / `DeltaLw 30.1` through
`predictor_heavy_combined_upper_lower_floor_iso12354_annexc_estimate`
with unchanged `+/-6.5 dB` / `+/-5.5 dB` source-absent not-measured
budgets.

The revalidation also covers safe reordered layer input, missing load
basis, duplicate or ambiguous heavy-concrete base ownership, exact
source precedence, and field/ASTM basis boundaries.

## Boundaries

Gate BG does not change runtime values, formulas, tolerances, source
rows, API shape, workbench input behavior, route-card values, or
field/building/ASTM adapters. Partial physical input still returns
`needs_input`, unsafe topology still parks the formula lane, exact
source rows still win, and lab `Ln,w` / `DeltaLw` budgets are not
aliased onto field, building, `IIC`, or `AIIC` outputs.

## Next Step

Gate BH should refresh the floor-impact source-absent coverage matrix
after Gates BA-BG. It should include the heavy-concrete combined input
surface alongside existing heavy floating, steel, timber/CLT, exact
source, field, ASTM/IIC, missing-input, and hostile-topology rows before
selecting the next calculator coverage lane.

## Validation

Gate BG validation passed on 2026-05-13:

- focused Gate BG engine contract: 1 file / 4 tests;
- focused Gate BF + Gate BG continuity: 2 files / 9 tests;
- engine typecheck;
- `pnpm calculator:gate:current`: engine 400 files / 2314 tests, web
  77 files / 328 passed + 18 skipped, repo build 5/5;
- full `pnpm check`: lint/typecheck clean, engine 525 files / 3116
  tests, web 184 files / 1006 passed + 18 skipped, repo build 5/5;
- `git diff --check` clean.

Known non-fatal output remains the existing optional `sharp/@img`
warning from `@turbodocx/html-to-docx` during Next build, plus test
environment-only Zustand persist storage warnings in workbench tests.
