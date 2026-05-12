# Gate AF Post Flat Multicavity Revalidation Handoff - 2026-05-12

## Landed Gate

`gate_af_personal_use_mvp_post_flat_multicavity_solver_broadening_revalidation_plan`

## Selection Status

`gate_af_personal_use_mvp_post_flat_multicavity_solver_broadening_revalidation_landed_selected_floor_formula_surface_polish_gate_ag`

## Selected Next Action

`gate_ag_personal_use_mvp_floor_formula_surface_polish_plan`

## Selected Next File

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ag-floor-formula-surface-polish-contract.test.ts`

## What Changed

Gate AF is a no-runtime post-promotion revalidation gate after Gate AE.
It adds local summary/ranking and executable contract coverage without
moving runtime formulas, values, tolerances, source precedence, API
shape, card/report behavior, or lab/field/building basis rules.

New implementation surfaces:

- `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-af.ts`
- `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-af-post-flat-multicavity-solver-broadening-revalidation-contract.test.ts`
- `packages/engine/src/index.ts`
- `tools/dev/run-calculator-current-gate.ts`

## Runtime Boundary

Gate AF freezes the Gate AE and Gate G wall pins:

- Gate AE flat multicavity remains `Rw 53 / STC 57 / C -0.6 / Ctr -8`;
- Gate AE method remains
  `gate_ae_flat_multicavity_two_cavity_frequency_solver`;
- Gate AE origin remains `family_physics_prediction`;
- Gate AE error budget remains `+/-7 dB`;
- Gate G grouped triple-leaf remains `Rw 50 / STC 55 / C 0.8 / Ctr -7.3`;
- Gate G method remains `triple_leaf_two_cavity_frequency_solver`;
- Gate G error budget remains `+/-5 dB`.

Stale `flat_layer_order` topology, duplicate/overlapping layer groups,
missing topology, field/apparent output requests, building prediction,
ASTM/IIC output requests, and broad source crawling stay blocked behind
their explicit owners.

## Matrix and Lane Selection

The Gate AA 40-row personal-use matrix remains gap-free after the Gate
AE runtime promotion. Gate AF removes the now-landed
`flat_multicavity_solver_broadening` lane from post-Gate-AE scoring.

The selected next lane is:

`floor_formula_surface_polish`

Scored candidates:

- `floor_formula_surface_polish`: `27.0`;
- `opening_leak_stc_spectrum_adapter`: `21.8`;
- `airborne_field_building_basis_expansion`: `11.3`;
- `broad_source_crawl`: `0.2`.

The selected Gate AG lane should polish existing floor formula input
surfaces and prompts without changing formula values. It must not reopen
broad source crawling unless a later executable gate names a specific
source-owned unblocker.

## Validation

Focused pre-closeout smoke passed during the planning iteration:

- Gate AD/AE smoke: 2 files / 10 tests.

Final Gate AF validation passed after docs/export/runner closeout:

- focused Gate AF contract: 1 file / 6 tests;
- focused Gate AF/AE/AD engine contracts: 3 files / 16 tests;
- focused flat multicavity web parity: 1 file / 4 tests;
- `pnpm typecheck`: 5/5 package tasks passed;
- `pnpm calculator:gate:current`: engine 373 files / 2154 tests, web
  74 files / 318 passed + 18 skipped, repo build 5/5;
- whitespace guard clean.

The known optional `sharp/@img` warnings from the DOCX/PDF path remain
non-fatal when the repo build runs.

## Next Step

Implement Gate AG only after Gate AF validation is green:

`gate_ag_personal_use_mvp_floor_formula_surface_polish_plan`

Gate AG should stay calculator-first: improve floor formula prompt/input
surface coverage and acceptance evidence while keeping existing
`Ln,w`, `DeltaLw`, `Rw`, `STC`, `C`, `Ctr`, field/building, ASTM/IIC,
and source-precedence behavior frozen unless a focused contract proves a
safe movement.
