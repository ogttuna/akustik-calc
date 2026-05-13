# Personal-Use MVP Coverage Sprint Gate BE Handoff

Date: 2026-05-13

## Landed Gate

Gate BE has now landed:

`gate_be_personal_use_mvp_floor_impact_source_absent_surface_parity_plan`

Gate BE selection status:

`gate_be_personal_use_mvp_floor_impact_source_absent_surface_parity_landed_selected_input_surface_gate_bf`

Selected next action:

`gate_bf_personal_use_mvp_floor_impact_source_absent_input_surface_plan`

Selected next file:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bf-floor-impact-source-absent-input-surface-contract.test.ts`

## What Changed

Gate BE is a no-retune surface-parity gate over the Gate BD runtime
corridor. It makes the `Heavy concrete combined formula corridor`
visible and replay-stable across the workbench card/posture layer,
impact metric basis copy, support trace, corridor dossier, method
dossier, scenario analysis, saved replay, calculator API payload,
impact-only API payload, and Markdown report.

The runtime remains frozen at lab `Ln,w 44.4` / `DeltaLw 30.1` through
`predictor_heavy_combined_upper_lower_floor_iso12354_annexc_estimate`.
The visible budgets remain source-absent, not measured evidence:
`+/-6.5 dB` for `Ln,w` and `+/-5.5 dB` for `DeltaLw`.

## Boundaries

Gate BE does not promote source rows, retune formulas, change
tolerances, or add field/building/ASTM adapters. Exact UBIQ source
precedence remains first. Existing heavy floating remains
`Ln,w 50.3` / `DeltaLw 24.3`. Missing lower treatment and missing
dynamic stiffness still block the combined fallback. ASTM/IIC, field,
and building requests stay explicit non-alias boundaries and do not
inherit the Gate BD budget.

## Next Step

Gate BF should make the same heavy-concrete combined upper/lower
physical inputs first-class on the Dynamic Calculator floor input
surface. It should feed the existing Gate BD predictor input through
live workbench evaluation, saved replay, and APIs without changing
`Ln,w 44.4`, `DeltaLw 30.1`, or the Gate BE visible basis/budget copy.

## Validation

Gate BE validation passed on 2026-05-13:

- focused Gate BE engine contract: 1 file / 4 tests;
- Gate BD + Gate BE continuity: 2 files / 10 tests;
- focused web heavy-concrete combined surface parity: 1 file / 3 tests;
- engine typecheck and web typecheck clean;
- `pnpm calculator:gate:current` green with engine 398 files / 2305
  tests, web 76 files / 325 passed + 18 skipped, repo build 5/5, and
  whitespace guard clean;
- full `pnpm check` green with lint/typecheck clean, engine 523 files /
  3107 tests, web 183 files / 1003 passed + 18 skipped, and build 5/5.

Known non-fatal build warnings remain the existing optional
`sharp/@img` resolution warnings from `@turbodocx/html-to-docx`; they
did not fail the build.
