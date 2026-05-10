# Checkpoint 2026-05-10 - Personal-Use MVP Coverage Sprint Gate N

## Selection

Landed gate:

`gate_n_personal_use_mvp_airborne_building_prediction_runtime_adapter_plan`

Selection status:

`gate_n_personal_use_mvp_airborne_building_prediction_runtime_adapter_landed_no_runtime_selected_formula_corridor_gate_o`

Selected next action:

`gate_o_personal_use_mvp_airborne_building_prediction_formula_corridor_plan`

Selected next file:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-o-airborne-building-prediction-formula-corridor-contract.test.ts`

## What Changed

Gate N lands the no-runtime airborne `building_prediction` runtime
adapter boundary. Gate M defined the complete physical input owner set;
Gate N now separates those physical owners from the formula owners
needed before any ISO 12354-1 style building-prediction runtime can
promote.

Complete physical building-prediction requests still do not produce
`R'w` or `DnT,w` building values. They select
`candidate_dynamic_unsupported` with method
`dynamic_calculator_building_prediction_runtime_adapter_owner_missing`
until Gate O owns a narrow formula corridor.

Gate O formula promotion requires explicit ownership of:

- direct separating-element frequency curve;
- flanking path transmission terms;
- junction vibration reduction index;
- room absorption normalization;
- building-prediction uncertainty budget.

## Implementation Surfaces

- Added
  `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-n-airborne-building-prediction-runtime-adapter-contract.test.ts`.
- Added
  `packages/engine/src/dynamic-airborne-gate-n-building-prediction-runtime-adapter.ts`
  for the Gate N plan id, status id, scenario pack, warning, adapter
  method, formula owner inputs, and Gate O selection constants.
- Updated the dynamic candidate resolver so complete building
  prediction keeps the Gate N method and full adapter/formula owner
  input set.
- Updated `calculateAssembly` so building `unsupported` results surface
  the Gate N warning instead of the older Gate M runtime-placeholder
  warning.
- Updated the Gate M continuity contract, engine exports, current-gate
  runner, and calculator docs.

## Boundary Assertions

- Missing Gate M physical fields such as source-room volume, RT60,
  flanking/junction class, conservative flanking assumption, junction
  coupling length, building output basis, or separating area remain
  `needs_input`.
- Complete Gate M physical owner sets with missing Gate N formula owners
  are `blocked_formula_owner` in the Gate N scenario pack and
  `candidate_dynamic_unsupported` at runtime.
- Even a complete future formula owner set is only
  `ready_for_formula_corridor`; Gate N does not promote numeric
  building runtime.
- Gate I/J/K `field_between_rooms` values remain live and separate:
  `R'w 58 / DnT,w 59`.
- Lab, field, and building contexts remain separate. Gate N does not
  alias lab `Rw`, Gate I field budgets, or exact lab rows into building
  `R'w` / `DnT,w`.

## Validation

Validation completed on 2026-05-10:

- focused Gate N engine runtime-adapter suite passed 1 file / 6 tests;
- Gate M/L continuity plus Gate I/J/K airborne field-context continuity
  passed 6 files / 32 tests;
- focused workbench building/field input surfaces passed 2 files / 8
  tests;
- engine and web typechecks passed;
- final `pnpm calculator:gate:current` passed with engine 355 files /
  2056 tests, web 71 files / 306 passed + 18 skipped, repo build 5/5
  successful, and whitespace guard clean;
- final `git diff --check` passed after the validation-doc sync.

Known non-fatal warnings remain the existing Zustand unavailable
test-storage warnings and optional `sharp/@img` package resolution
warnings during the Next build.

## Next Gate

Gate O should decide whether a narrow airborne building-prediction
formula corridor can promote. The corridor must stay source-absent but
physics-owned: direct separating-element curve, flanking transmission
terms, junction vibration reduction, room absorption normalization, and
an explicit uncertainty budget must all be owned before any `R'w` or
`DnT,w` building value appears.
