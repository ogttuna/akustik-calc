# Gate AQ Airborne Building Prediction Uncertainty-Budget Owner Handoff - 2026-05-12

Landed action:

`gate_aq_personal_use_mvp_airborne_building_prediction_uncertainty_budget_owner_contract_plan`

Selection status:

`gate_aq_personal_use_mvp_airborne_building_prediction_uncertainty_budget_owner_landed_no_runtime_selected_all_owner_runtime_corridor_gate_ar`

Selected next action:

`gate_ar_personal_use_mvp_airborne_building_prediction_all_owner_runtime_corridor_plan`

Selected next file:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ar-airborne-building-prediction-all-owner-runtime-corridor-contract.test.ts`

## Summary

Gate AQ is a no-runtime uncertainty-budget owner contract for airborne
`building_prediction`. It consumes the Gate AP room standardization owner
and accounts for the last Gate AL owner gap:
`building_prediction_uncertainty_budget`.

The Gate O `+/-9 dB` source-absent design budget is now owned as a
metric-specific budget surface for both `R'w` and `DnT,w`. The budget
preserves direct-curve residual, flanking-energy simplification,
junction-vibration surrogate, metric-specific geometry or room
standardization precision, and same-building holdout absence terms. It
is explicitly not measured evidence and cannot tighten tolerance or
promote runtime in Gate AQ.

Rejected signals remain blocked:

- lab `Rw` / `STC` tolerance aliases;
- Gate I field-budget aliases;
- opening/leak lab adapter budget aliases;
- source single-number rows without building/flanking/room terms;
- STC/IIC/product-only evidence;
- generic safety factors without term decomposition;
- exact source rows without same-building metric basis;
- measured-evidence claims without source-owned same-building holdouts.

Complete building requests still return `unsupported` through
`dynamic_calculator_building_prediction_runtime_adapter_owner_missing`.
Partial building requests still return `needs_input`. Field-context wall
requests stay on the Gate I/J/K route, and lab/field/opening values are
not reused as building `R'w` / `DnT,w`.

## Lane Decision

Gate AQ selects the all-owner runtime corridor for Gate AR. This is now
the first place where runtime can be considered because the direct curve,
flanking path energy, junction vibration, room standardization, and
uncertainty-budget owner contracts are all accounted for.

Lower-ranked lanes:

- surface parity without runtime remains premature;
- broad source crawling remains blocked as the next action.

Gate AR may still close no-runtime if the all-owner value path cannot be
made executable and visible without unsafe assumptions.

## Validation

Validation passed before commit:

- focused Gate AQ: 1 file / 6 tests;
- Gate AP + Gate AQ continuity: 2 files / 12 tests;
- engine typecheck passed;
- `pnpm calculator:gate:current` passed with engine 384 files /
  2217 tests, web 74 files / 318 passed + 18 skipped, repo build 5/5,
  and whitespace guard clean;
- full `pnpm check` passed with lint/typecheck clean, engine 509 files /
  3019 tests, web 180 files / 993 passed + 18 skipped, and repo build
  5/5;
- `git diff --check` passed after validation-note sync.

Known non-fatal validation noise remains unchanged: optional
`sharp/@img` warnings during Next build and unavailable Zustand
test-storage warnings in web tests.
