# Checkpoint 2026-05-08 - Personal-Use MVP Coverage Sprint Gate D Handoff

## Scope

Gate D lands the first runtime promotion for the timber/CLT
floor-impact `DeltaLw` corridor selected by Gate C. This is a calculator
runtime move, not a source-row promotion.

Landed file:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-d-timber-clt-floor-impact-delta-lw-runtime-corridor-contract.test.ts`

Landed action:

`gate_d_personal_use_mvp_timber_clt_floor_impact_delta_lw_runtime_corridor_plan`

Selection status:

`gate_d_personal_use_mvp_timber_clt_floor_impact_delta_lw_runtime_corridor_landed_selected_surface_parity_gate_e`

Selected next file:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-e-timber-clt-floor-impact-delta-lw-surface-parity-contract.test.ts`

Selected next action:

`gate_e_personal_use_mvp_timber_clt_floor_impact_delta_lw_surface_parity_plan`

## Result

- Added
  `packages/engine/src/timber-clt-floor-impact-delta-lw-runtime-corridor.ts`.
- Shared impact calculations now allow a valid `DeltaLw`-only impact
  metric, which is required for improvement/corridor evidence that does
  not own `Ln,w`.
- Explicit complete timber joist predictor input now carries source-
  absent lab `DeltaLw 25.2` through
  `predictor_timber_joist_delta_lw_formula_corridor_estimate`.
- Explicit complete mass-timber CLT predictor input now carries
  source-absent lab `DeltaLw 22.6` through
  `predictor_mass_timber_clt_delta_lw_formula_corridor_estimate`.
- Existing `Ln,w` values stay on their own basis: timber exact
  `Ln,w 51` remains `official_floor_system_exact_match`, and CLT
  `Ln,w 50` remains `predictor_mass_timber_clt_dataholz_dry_estimate`.
- Both `DeltaLw` formula results carry a structured
  `source_absent_formula_error_budget` with `+/-7.5 dB` tolerance and
  `notMeasuredEvidence: true`.
- Missing dynamic stiffness, load basis, topping/floating mass, or lower
  assembly still blocks `DeltaLw` instead of guessing.
- `Ln,w`-only, ASTM `IIC` / `AIIC`, field `L'n,w` / `L'nT,w`, and
  wrong-family steel requests do not promote the timber/CLT formula.

## Gate E Entry Criteria

Gate E is selected for visible/API/report parity. It must prove the
runtime values above appear consistently in output cards, dynamic trace,
support notes, Markdown report payload, calculator API payload, and
impact-only API payload, while preserving the same missing-input and
basis-alias negatives.

## Validation

Validation completed on 2026-05-08:

- focused Gate D runtime contract passed 1 file / 7 tests;
- focused Gate B/C/D continuity passed 3 files / 22 tests;
- focused Gate BI/A/B/C/D continuity passed 5 files / 36 tests;
- `pnpm --filter @dynecho/engine typecheck` passed;
- final `pnpm calculator:gate:current` passed with engine 345 files /
  2001 tests, web 66 files / 286 passed + 18 skipped, repo build 5/5
  successful, and whitespace guard clean;
- `git diff --check` passed after the validation-result doc updates.

Known warnings were the existing Zustand unavailable test-storage
warnings and optional sharp package resolution warnings during web
build.
