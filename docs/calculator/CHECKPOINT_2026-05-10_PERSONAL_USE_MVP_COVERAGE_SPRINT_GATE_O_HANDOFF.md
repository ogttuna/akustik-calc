# Checkpoint 2026-05-10 - Personal-Use MVP Coverage Sprint Gate O

## Selection

Landed gate:

`gate_o_personal_use_mvp_airborne_building_prediction_formula_corridor_plan`

Selection status:

`gate_o_personal_use_mvp_airborne_building_prediction_formula_corridor_landed_no_runtime_selected_runtime_corridor_gate_p`

Selected next action:

`gate_p_personal_use_mvp_airborne_building_prediction_runtime_corridor_plan`

Selected next file:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-p-airborne-building-prediction-runtime-corridor-contract.test.ts`

## What Changed

Gate O lands the no-runtime airborne `building_prediction` formula
corridor. Gate N named the adapter and formula owners; Gate O now turns
that into explicit `R'w` and `DnT,w` formula-corridor contracts without
moving runtime values.

The corridor is source-absent but physics-owned at the design level. It
names these terms before any future runtime promotion:

- direct separating-element frequency curve;
- flanking path energy sum;
- junction vibration reduction index;
- room absorption standardization;
- building-prediction uncertainty budget.

Gate O intentionally keeps `proposedRuntimeEstimateDb: null` and
runtime promotion disabled. The current heuristic field/building overlay
is useful evidence for Gate P, but it is not relabelled as a complete
ISO 12354-1 building runtime in Gate O.

## Implementation Surfaces

- Added
  `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-o-airborne-building-prediction-formula-corridor-contract.test.ts`.
- Added
  `packages/engine/src/dynamic-airborne-gate-o-building-prediction-formula-corridor.ts`
  for the Gate O plan id, status id, formula basis, tolerance budget,
  negative boundaries, and Gate P selection constants.
- Exported the Gate O contract module from the engine package.
- Added the Gate O focused suite to `tools/dev/run-calculator-current-gate.ts`.
- Updated `AGENTS.md`, `CURRENT_STATE.md`, `README.md`, and
  `NEXT_IMPLEMENTATION_PLAN.md`.

## Boundary Assertions

- `R'w` and `DnT,w` get separate formula-corridor entries, both with
  `proposedRuntimeEstimateDb: null`.
- `+/-9 dB` budgets are explicitly marked as source-absent design
  budgets, not measured evidence.
- Missing physical building-prediction fields remain `needs_input`.
- Missing Gate N formula owners remain blocked and do not produce a
  building runtime value.
- Gate I field context remains a separate route and is not reused as a
  building-prediction formula result.
- Lab `Rw` / `STC` and source single-number rows without an owned curve
  cannot be relabelled as building `R'w` / `DnT,w`.

## Validation

Validation completed on 2026-05-10:

- Focused Gate O engine formula corridor contract passed 1 file / 6
  tests.
- Gate O/N/M/L plus Gate I/J/K continuity passed 7 files / 38 tests.
- Engine typecheck passed.
- Final `pnpm calculator:gate:current` passed with engine 356 files /
  2062 tests, web 71 files / 306 passed + 18 skipped, repo build 5/5
  successful, and whitespace guard clean.
- Final `git diff --check` passed after the validation-doc sync.
- Known non-fatal warnings remain the test-environment Zustand
  storage-unavailable messages and optional `sharp` `@img/*` resolution
  warnings during web build.

## Next Gate

Gate P should decide whether the Gate O formula corridor can safely
promote runtime values. Promotion requires a named building-prediction
basis, visible `+/-9 dB` error budget, direct separating-element curve,
conservative flanking path energy combination, junction vibration
reduction / coupling length, room standardization, and strict
lab/field/building separation.
