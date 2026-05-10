# Checkpoint 2026-05-10 - Personal-Use MVP Coverage Sprint Gate L

## Selection

Landed gate:

`gate_l_personal_use_mvp_airborne_building_prediction_boundary_plan`

Selection status:

`gate_l_personal_use_mvp_airborne_building_prediction_boundary_landed_selected_building_prediction_input_contract_gate_m`

Selected next action:

`gate_m_personal_use_mvp_airborne_building_prediction_input_contract_plan`

Selected next file:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-m-airborne-building-prediction-input-contract.test.ts`

## What Changed

Gate L lands the no-runtime airborne `building_prediction` boundary.
Gate I/J/K own complete `field_between_rooms` wall outputs; Gate L
keeps building-prediction requests out of that field basis until
building-specific owners exist.

Runtime numeric values remain unchanged. The selected airborne candidate
for `building_prediction` is now `candidate_dynamic_needs_input` until
these physical fields are explicit:

- `flankingJunctionClass`
- `conservativeFlankingAssumption`

This applies even when the legacy `junctionQuality` hint is `good`.
Lab-looking `Rw` / `STC` requests made under `building_prediction`
context are also blocked as building-basis requests instead of silently
borrowing lab element values.

## Implementation Surfaces

- Added
  `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-l-airborne-building-prediction-boundary-contract.test.ts`.
- Added
  `packages/engine/src/dynamic-airborne-gate-l-building-prediction-boundary.ts`
  for the Gate L plan id, status id, missing-field tuple, and warning
  text.
- Updated `packages/engine/src/dynamic-calculator-route-input-topology.ts`
  so airborne `building_prediction` always requires flanking/junction
  ownership and a conservative flanking assumption before any candidate
  can promote.
- Updated `packages/engine/src/calculate-assembly.ts` so parked
  building-prediction requests show the Gate L boundary warning and do
  not show legacy building-context overlay warnings as if a field-side
  runtime were active.
- Updated workbench input/card surfaces so building-prediction cards for
  `R'w` / `DnT,w` show `Not ready` with flanking/junction and
  conservative-assumption copy instead of Gate I field posture.
- Updated current-gate validation runner and docs.

## Boundary Assertions

- Complete `field_between_rooms` lined massive/masonry remains
  `R'w 58 / DnT,w 59` on the Gate I field-context adapter.
- Complete lab CLT/mass-timber remains `Rw 42 / STC 42` on the Gate H
  lab family-physics route.
- Complete `building_prediction` lined massive/masonry requests are
  selected as `needs_input`, with no Gate I selected candidate, no Gate I
  runtime method, no Gate I warning, and no live building card posture.
- Building-prediction visible cards and API payloads carry the same
  boundary warning and missing physical fields.

## Validation

Validation completed on 2026-05-10:

- focused Gate L engine boundary contract passed 1 file / 5 tests;
- focused Gate L/K workbench input and card surface coverage passed 2
  files / 8 tests;
- targeted route-card regression pack passed 4 files / 34 tests;
- Gate I/J/K/L engine continuity passed 4 files / 20 tests;
- Gate J/K/L web continuity passed 3 files / 12 tests;
- targeted legacy engine regression pack passed 4 files / 20 tests;
- targeted legacy web regression pack passed 8 files / 40 tests;
- engine and web typechecks passed;
- final `pnpm calculator:gate:current` passed with engine 353 files /
  2044 tests, web 71 files / 306 passed + 18 skipped, repo build 5/5
  successful, and whitespace guard clean.

Known non-fatal warnings remain the existing Zustand unavailable
test-storage warnings and optional `sharp/@img` package resolution
warnings during the Next build.

## Next Gate

Gate M should define the complete airborne building-prediction input
owner contract before any numeric building-prediction runtime is
allowed. Minimum owner candidates are separating element area,
sending/receiving room geometry or basis owner, receiver absorption or
reverberation basis, flanking/junction class, conservative flanking
assumption, junction coupling/length owner, and apparent versus
standardized building-metric output-basis owner.
