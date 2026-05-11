# Checkpoint - 2026-05-11 - Personal-Use MVP Coverage Sprint Gate S Handoff

## Scope

Gate S landed the opening/leak composite transmission-loss runtime
corridor selected by Gate R:

`gate_s_personal_use_mvp_opening_leak_composite_transmission_loss_runtime_corridor_plan`

This is a calculator-runtime gate, not a source-catalog gate. It promotes
the Gate R area-energy lab `Rw` formula only when the user has a complete
element-lab opening/leak route. Opening element rows remain formula
terms. They do not replace the selected host-wall candidate or create a
field/building/STC adapter.

## Runtime Behavior

New runtime helper:

`packages/engine/src/dynamic-airborne-gate-s-opening-leak-composite-transmission-loss-runtime-corridor.ts`

Runtime method:

`gate_s_opening_leak_composite_area_energy_runtime_corridor`

Complete element-lab opening/leak requests now:

- calculate composite lab `Rw` from the selected host-wall `Rw`, host
  wall area, opening area/count, opening `Rw` basis, and explicit
  seal/leakage penalty;
- expose `family_physics_prediction` with a `+/-6 dB` source-absent
  budget;
- return the pinned fixture `Rw 38.2` for host wall plus one `1.8 m2`
  average-seal opening with element `Rw 32`;
- support only `Rw` from this corridor.

Blocked outputs remain blocked:

- `STC`
- `R'w`
- `DnT,w`
- field context
- building-prediction context

Blocked/hostile opening inputs remain non-runtime:

- missing opening physical fields;
- duplicate openings;
- excessive or non-positive opening area/count;
- STC-only opening basis;
- source-absent opening values without
  `sourceAbsentOpeningValueBudgetOwner`;
- field/building context aliases.

Those cases now remove the requested opening-affected output from the
supported bucket instead of returning the host-wall `Rw` as if the
opening route did not exist.

## Tests

Added focused Gate S contract:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-s-opening-leak-composite-transmission-loss-runtime-corridor-contract.test.ts`

Updated Gate Q/R continuity expectations so they preserve their
historical no-runtime helper contracts while acknowledging that later
Gate S now owns runtime value movement.

Focused validation during implementation:

```text
pnpm --filter @dynecho/engine exec vitest run \
  src/calculator-personal-use-mvp-coverage-sprint-gate-s-opening-leak-composite-transmission-loss-runtime-corridor-contract.test.ts \
  src/calculator-personal-use-mvp-coverage-sprint-gate-r-opening-leak-composite-transmission-loss-formula-corridor-contract.test.ts \
  src/calculator-personal-use-mvp-coverage-sprint-gate-q-opening-leak-composite-transmission-loss-input-contract.test.ts
```

Result: Gate S/R/Q focused continuity passed 3 files / 17 tests.

Continuity validation:

```text
pnpm --filter @dynecho/engine exec vitest run \
  src/calculator-personal-use-mvp-coverage-sprint-gate-s-opening-leak-composite-transmission-loss-runtime-corridor-contract.test.ts \
  src/calculator-personal-use-mvp-coverage-sprint-gate-r-opening-leak-composite-transmission-loss-formula-corridor-contract.test.ts \
  src/calculator-personal-use-mvp-coverage-sprint-gate-q-opening-leak-composite-transmission-loss-input-contract.test.ts \
  src/calculator-personal-use-mvp-coverage-sprint-gate-p-airborne-building-prediction-runtime-corridor-contract.test.ts \
  src/calculator-personal-use-mvp-coverage-sprint-gate-o-airborne-building-prediction-formula-corridor-contract.test.ts \
  src/calculator-personal-use-mvp-coverage-sprint-gate-n-airborne-building-prediction-runtime-adapter-contract.test.ts \
  src/calculator-personal-use-mvp-coverage-sprint-gate-m-airborne-building-prediction-input-contract.test.ts \
  src/calculator-personal-use-mvp-coverage-sprint-gate-l-airborne-building-prediction-boundary-contract.test.ts \
  src/calculator-personal-use-mvp-coverage-sprint-gate-g-generalized-wall-multicavity-route-readiness-contract.test.ts \
  src/calculator-personal-use-mvp-coverage-sprint-gate-h-lined-masonry-clt-wall-upgrade-contract.test.ts \
  src/calculator-personal-use-mvp-coverage-sprint-gate-i-airborne-field-context-continuation-contract.test.ts \
  src/calculator-personal-use-mvp-coverage-sprint-gate-j-airborne-field-context-surface-parity-contract.test.ts \
  src/calculator-personal-use-mvp-coverage-sprint-gate-k-airborne-field-context-input-surface-contract.test.ts
```

Result: Gate S/R/Q/P/O/N/M/L plus Gate G/H/I/J/K continuity passed 13
files / 76 tests.

Full current-gate validation:

```text
pnpm calculator:gate:current
git diff --check
```

Result: `pnpm calculator:gate:current` passed with engine 360 files /
2085 tests, web 71 files / 306 passed + 18 skipped, repo build 5/5
successful, and whitespace guard clean. Known warnings remain the
existing Zustand unavailable test-storage warnings and optional
`sharp/@img` package resolution warnings during web build.

## Selection

Gate S selection status:

`gate_s_personal_use_mvp_opening_leak_composite_runtime_corridor_landed_selected_surface_parity_gate_t`

Selected next action:

`gate_t_personal_use_mvp_opening_leak_composite_surface_parity_plan`

Selected next file:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-t-opening-leak-composite-surface-parity-contract.test.ts`

Gate T should verify visible surface parity for the Gate S runtime:
route/output cards, API payload, saved replay, scenario analysis, and
report/Markdown should show the same `Rw`, basis, support bucket, and
`+/-6 dB` budget. Gate T must not add a field, building, or STC adapter;
those require a later gate with separate formula ownership and tests.
