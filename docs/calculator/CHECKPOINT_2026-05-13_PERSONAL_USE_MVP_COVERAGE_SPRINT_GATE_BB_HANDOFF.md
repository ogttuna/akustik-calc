# Gate BB Floor-Impact Source-Absent Input Contract - 2026-05-13

Landed action:

`gate_bb_personal_use_mvp_floor_impact_source_absent_input_contract_plan`

Selection status:

`gate_bb_personal_use_mvp_floor_impact_source_absent_input_contract_landed_no_runtime_selected_formula_corridor_gate_bc`

Selected next action:

`gate_bc_personal_use_mvp_floor_impact_source_absent_formula_corridor_plan`

Selected next file:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bc-floor-impact-source-absent-formula-corridor-contract.test.ts`

Short label:

floor-impact source-absent input contract

## Summary

Gate BB lands the no-runtime input ownership contract selected by Gate BA.
It does not move `Ln,w`, `DeltaLw`, field, building, ASTM, source,
card, API, or report behavior. The gate converts the Gate BA
floor-impact cartography into explicit physical owner fields and
fail-closed boundaries before any wider source-absent formula corridor
is promoted.

The executable contract names these floor-impact owners:

- base or carrier family and material class;
- upper topping / floating layer mass;
- resilient-layer dynamic stiffness or source-owned product curve;
- load basis for the upper package;
- lower treatment / ceiling coupling;
- steel support form, carrier depth, carrier spacing, and lower
  isolation support form;
- field, building, and ASTM basis boundaries;
- duplicate, split, mixed-family, and unsafe reorder guards.

Gate BB preserves current values while tightening the input boundary:

- exact same-stack official rows still win first and do not invent
  missing `DeltaLw`;
- complete heavy concrete floating-floor input stays on the existing
  owned formula corridor;
- complete combined upper/lower concrete input becomes the selected
  bounded Gate BC formula-corridor target;
- generic missing dynamic stiffness or missing load basis returns
  `needs_input` or published-anchor `Ln,w` only, never invented
  `DeltaLw`;
- lightweight concrete and composite panel floors stay out of heavy
  concrete formulas until family-specific corridors own them;
- steel, timber joist, and CLT/mass-timber existing corridors stay
  preserved;
- mixed support families and duplicate/split floor roles fail closed;
- field/building and ASTM impact outputs remain non-alias unsupported
  boundaries for this lab input contract.

Gate BB pins the same current runtime probes as Gate BA: exact UBIQ
`Ln,w 51`, heavy concrete `Ln,w 50.3` / `DeltaLw 24.3`, missing-load
published-family `Ln,w 47` with `DeltaLw` unsupported, and ASTM `IIC` /
`AIIC` unsupported.

## Next Gate

Gate BC should implement the selected floor-impact source-absent formula
corridor:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bc-floor-impact-source-absent-formula-corridor-contract.test.ts`

Gate BC should stay bounded to the Gate BB owner contract. It should not
open a broad source crawl, retune existing steel/timber/CLT formulas, or
alias lab `Ln,w` / `DeltaLw` to field, building, or ASTM metrics.

Next plain label: floor-impact source-absent formula corridor.

## Validation

Validation passed on 2026-05-13:

1. focused Gate BB engine contract: 1 file / 9 tests;
2. Gate BA + Gate BB continuity: 2 files / 15 tests;
3. engine build, including DTS;
4. `pnpm calculator:gate:current`: engine 395 files / 2287 tests, web
   76 files / 325 passed + 18 skipped, repo build 5/5;
5. `git diff --check`: clean.

Known non-blocking warnings remained unchanged: jsdom workbench tests
can print the existing Zustand storage-unavailable warning, and the
Next build can report optional `sharp` / `@img` package warnings before
compiling successfully.
