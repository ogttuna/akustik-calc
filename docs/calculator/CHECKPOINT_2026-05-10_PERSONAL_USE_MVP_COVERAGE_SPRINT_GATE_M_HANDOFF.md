# Checkpoint 2026-05-10 - Personal-Use MVP Coverage Sprint Gate M

## Selection

Landed gate:

`gate_m_personal_use_mvp_airborne_building_prediction_input_contract_plan`

Selection status:

`gate_m_personal_use_mvp_airborne_building_prediction_input_contract_landed_no_runtime_selected_runtime_adapter_gate_n`

Selected next action:

`gate_n_personal_use_mvp_airborne_building_prediction_runtime_adapter_plan`

Selected next file:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-n-airborne-building-prediction-runtime-adapter-contract.test.ts`

## What Changed

Gate M lands the no-runtime airborne `building_prediction` input
contract. Gate L only blocked building-prediction requests on
flanking/junction ownership and conservative flanking assumption. Gate M
now names the complete physical owner set before any building runtime can
be promoted.

Complete building prediction requires:

- separating element area;
- source-room volume;
- receiving-room volume and RT60 where standardized building metrics are
  requested;
- flanking/junction class;
- conservative flanking assumption;
- junction coupling length;
- building output basis.

Complete physical owner sets still do not produce `R'w` or `DnT,w`
building runtime. They select `candidate_dynamic_unsupported` with
`dynamic_calculator_building_prediction_runtime_owner_missing` until
Gate N owns the ISO 12354-1 flanking/runtime adapter.

## Implementation Surfaces

- Added
  `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-m-airborne-building-prediction-input-contract.test.ts`.
- Added
  `packages/engine/src/dynamic-airborne-gate-m-building-prediction-input-contract.ts`
  for the Gate M plan id, status id, scenario pack, runtime boundary
  warning, and Gate N selection constants.
- Updated shared airborne context and input-completeness schemas with
  source-room volume, flanking/junction class, conservative flanking
  assumption, junction coupling length, and building output basis.
- Updated `packages/engine/src/dynamic-calculator-route-input-topology.ts`
  so airborne `building_prediction` uses route family
  `building_prediction_airborne_context` and the full Gate M physical
  input set.
- Updated the candidate resolver and `calculateAssembly` so complete
  building-prediction physical inputs remain `unsupported` with a Gate M
  runtime-boundary warning instead of falling through to Gate I field
  budgets.
- Updated workbench helper surfaces so building cards treat the Gate M
  `unsupported` posture as blocked and keep partial owner sets parked as
  `needs_input`.
- Updated current-gate validation runner and docs.

## Boundary Assertions

- Partial owner sets remain `needs_input` with exact missing physical
  fields such as source-room volume, flanking/junction class,
  conservative flanking assumption, junction coupling length, and
  building output basis.
- Complete physical building-prediction owner sets are ready for Gate N
  runtime-adapter ownership but still do not promote a building runtime
  value.
- Complete `field_between_rooms` lined massive/masonry remains
  `R'w 58 / DnT,w 59` on the Gate I field-context adapter.
- Gate L parked building-boundary behavior remains available for older
  partial contexts, but Gate M broadens the missing-input contract.
- Exact-source precedence, lab/field/building separation, and Gate
  G/H/I/K numeric pins remain unchanged.

## Validation

Validation completed on 2026-05-10:

- focused Gate M engine input-contract suite passed 1 file / 6 tests;
- focused Gate L continuity suite passed 1 file / 5 tests;
- Gate I/J/K airborne field-context continuity passed 3 files / 15
  tests;
- focused Gate K route-input topology continuity passed 1 file / 8
  tests;
- focused workbench building/field input surfaces passed 2 files / 8
  tests;
- engine and web typechecks passed;
- final `pnpm calculator:gate:current` passed with engine 354 files /
  2050 tests, web 71 files / 306 passed + 18 skipped, repo build 5/5
  successful, and whitespace guard clean;
- final `git diff --check` passed.

Known non-fatal warnings remain the existing Zustand unavailable
test-storage warnings and optional `sharp/@img` package resolution
warnings during the Next build.

## Next Gate

Gate N should define the first airborne building-prediction runtime
adapter boundary. The decision point is whether a bounded ISO 12354-1
style adapter can be promoted with source-room volume, receiving-room
volume/RT60, flanking/junction class, conservative flanking assumption,
junction coupling length, and building output basis, or whether the
adapter must remain no-runtime until more formula ownership exists.
