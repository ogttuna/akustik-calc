# Checkpoint 2026-05-11 - Personal-Use MVP Coverage Sprint Gate P Handoff

Document role: implementation handoff for Gate P airborne
building-prediction runtime-corridor decision.

## Status

Gate P landed:

`gate_p_personal_use_mvp_airborne_building_prediction_runtime_corridor_plan`

Selection status:

`gate_p_personal_use_mvp_airborne_building_prediction_runtime_corridor_closed_no_runtime_selected_opening_leak_composite_gate_q`

Selected next action:

`gate_q_personal_use_mvp_opening_leak_composite_transmission_loss_input_contract_plan`

Selected next file:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-q-opening-leak-composite-transmission-loss-input-contract.test.ts`

## What Changed

Gate P did not move runtime values. It formalized the runtime decision
for the Gate O airborne building-prediction formula corridor after the
2026-05-11 INSUL / ISO refresh.

Added files:

- `packages/engine/src/dynamic-airborne-gate-p-building-prediction-runtime-corridor.ts`
- `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-p-airborne-building-prediction-runtime-corridor-contract.test.ts`

Updated surfaces:

- `packages/engine/src/index.ts`
- `tools/dev/run-calculator-current-gate.ts`
- `docs/calculator/NEXT_IMPLEMENTATION_PLAN.md`
- `docs/calculator/CURRENT_STATE.md`
- `docs/calculator/README.md`
- `AGENTS.md`

## Runtime Decision

Selected branch:

`runtime_blocked_formula_terms_not_owned`

Complete airborne `building_prediction` requests still select:

- candidate id: `candidate_dynamic_unsupported`
- method:
  `dynamic_calculator_building_prediction_runtime_adapter_owner_missing`
- warning:
  `Airborne building-prediction runtime adapter is scoped, but ISO 12354-1 flanking formula terms are not owned yet. DAC keeps R'w/DnT,w building results parked instead of reusing Gate I field budgets or lab values.`

Gate P keeps `R'w` and `DnT,w` building outputs parked because these
terms are not executable runtime owners yet:

- direct separating-element frequency curve;
- flanking path energy sum;
- junction vibration-reduction / coupling length;
- room absorption or standardization;
- the `+/-9 dB` source-absent building-prediction budget as a runtime
  trace term.

`proposedRuntimeEstimateDb` remains `null`. The Gate O `+/-9 dB` budget
is preserved as a not-measured design budget, not promoted to measured
evidence or design-grade runtime.

## Boundaries Preserved

- Exact measured/source rows remain first when they truly match.
- Lab `Rw` / `STC` are not relabelled as building `R'w` / `DnT,w`.
- Gate I field values remain live for `field_between_rooms`, but they
  are not copied into `building_prediction`.
- Source single-number rows without an owned curve cannot become
  building-prediction runtime.
- Broad source crawling remains rejected as the next step.

## Next Work

Gate Q should start the opening/leak composite transmission-loss input
contract. First target is input ownership, not numeric runtime:

1. opening area;
2. host wall area;
3. opening element rating or curve basis;
4. seal/leakage class;
5. opening count and placement/aggregation policy;
6. exact/source/catalog/source-absent origin posture;
7. hostile input boundaries for area overflow, zero area, duplicates,
   unknown rating basis, and many-layer host walls.

Gate Q should keep no-runtime unless the composite energy formula and all
physical inputs are owned.

## Validation

Validation completed on 2026-05-11:

- focused Gate P passed 1 file / 6 tests;
- Gate P/O/N/M/L plus Gate I/J/K continuity passed 8 files / 44 tests;
- final `pnpm calculator:gate:current` passed with engine 357 files /
  2068 tests, web 71 files / 306 passed + 18 skipped, repo build 5/5
  successful;
- known non-fatal warnings stayed limited to test-environment Zustand
  storage-unavailable messages and optional `sharp` `@img/*` resolution
  warnings during the web build.

`git diff --check` must still be clean after this validation note sync.
