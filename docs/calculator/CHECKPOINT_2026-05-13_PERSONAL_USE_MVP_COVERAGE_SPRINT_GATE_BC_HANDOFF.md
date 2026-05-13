# Gate BC Floor-Impact Source-Absent Formula Corridor - 2026-05-13

Landed action:

`gate_bc_personal_use_mvp_floor_impact_source_absent_formula_corridor_plan`

Selection status:

`gate_bc_personal_use_mvp_floor_impact_source_absent_formula_corridor_landed_no_runtime_selected_runtime_corridor_gate_bd`

Selected next action:

`gate_bd_personal_use_mvp_floor_impact_source_absent_runtime_corridor_plan`

Selected next file:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bd-floor-impact-source-absent-runtime-corridor-contract.test.ts`

Short label:

floor-impact source-absent formula corridor

## Summary

Gate BC lands the no-runtime formula-corridor contract selected by Gate
BB. It does not move `Ln,w`, `DeltaLw`, field, building, ASTM, exact
source, card, API, report, or workbench behavior.

The gate takes the complete Gate BB heavy-concrete combined
upper/lower floor target and defines the formula spine for the next
runtime corridor:

- `DeltaLw_total = DeltaLw_upper(m'load, s') + DeltaLw_lower(lower assembly) - couplingPenalty(upper, lower)`;
- `Ln,w = Ln,w_bare_heavy_reference - DeltaLw_total`;
- the upper floating term remains anchored to the existing heavy
  concrete runtime probe, currently `Ln,w 50.3` / `DeltaLw 24.3`;
- lower treatment is a separate owner term, not a hidden bonus on the
  upper floating-floor formula;
- exact source rows still win first;
- lightweight concrete, composite panels, mixed support families,
  duplicate/split floor roles, ASTM, field, and building outputs stay
  blocked until their own owners exist.

Gate BC also defines source-absent design budgets without presenting
them as measured evidence: `+/-6.5 dB` for lab `Ln,w` and `+/-5.5 dB`
for lab `DeltaLw`. The budgets are term-owned by heavy reference floor
spread, lower assembly coupling, upper/lower interaction, dynamic
stiffness precision, load basis precision, and combined-system holdout
absence.

Current runtime probes remain frozen:

- exact UBIQ stays `Ln,w 51` with `DeltaLw` unsupported;
- heavy concrete floating-floor stays `Ln,w 50.3` / `DeltaLw 24.3`;
- missing-load published-family stays `Ln,w 47` with `DeltaLw`
  unsupported;
- ASTM `IIC` / `AIIC` stays unsupported.

## Next Gate

Gate BD should implement the selected floor-impact source-absent
runtime corridor:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bd-floor-impact-source-absent-runtime-corridor-contract.test.ts`

Gate BD should calculate the combined upper/lower heavy-concrete lab
`Ln,w` / `DeltaLw` values only when Gate BB physical owners are
complete, emit the Gate BC not-measured error budgets, preserve exact
source precedence, and keep ASTM, field, and building metrics separate.

Next plain label: floor-impact source-absent runtime corridor.

## Validation

Validation passed on 2026-05-13:

1. focused Gate BC engine contract: 1 file / 8 tests;
2. Gate BB + Gate BC continuity: 2 files / 17 tests;
3. Gate BA + Gate BB + Gate BC continuity: 3 files / 23 tests;
4. engine build, including DTS;
5. `pnpm calculator:gate:current`: engine 396 files / 2295 tests, web
   76 files / 325 passed + 18 skipped, repo build 5/5;
6. `git diff --check`: clean.

Known non-blocking warnings remained unchanged: jsdom workbench tests
can print the existing Zustand storage-unavailable warning, and the
Next build can report optional `sharp` / `@img` package warnings before
compiling successfully.
