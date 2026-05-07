# Checkpoint - 2026-05-07 - Model-First Physics Prediction Pivot Gate AE

## Status

Landed scope: `gate_ae_steel_floor_formula_card_and_report_parity_plan`.

Current selected slice:

`calculator_model_first_physics_prediction_pivot_v1`

Selection status after this gate:

`gate_ae_steel_formula_card_report_parity_landed_selected_input_surface_gate_af`

Selected next file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-af-steel-floor-formula-input-surface-contract.test.ts`

Selected next action:

`gate_af_steel_floor_formula_input_surface_plan`

## What Landed

Gate AE keeps the Gate AD steel formula numbers unchanged and fixes the
user-facing evidence language around them. Complete explicit source-
absent open-web steel input still returns lab `LnW 55.6` and
`DeltaLw 22.4` from
`predictor_lightweight_steel_mass_spring_holdout_corridor_estimate`.

The same basis is now visible across:

- dynamic impact trace selected label and basis label:
  `Lightweight-steel formula corridor`;
- impact support notes and formula notes, including the Gate AD
  mass-spring corridor, DeltaLw relation, and `+/-4.5 dB` / `+/-2 dB`
  tolerances;
- workbench `Ln,w` and `DeltaLw` output cards and posture copy;
- impact lane pill/headline/narrative;
- validation mode and validation posture;
- proposal method dossier trace group;
- Markdown report current result, validation regime, predictor trace,
  support notes, and formula notes.

The validation ladder now has a dedicated
`steel_formula_corridor_estimate` mode. The lightweight-steel/open-web
family is no longer presented as only bound coverage; it exposes an
estimated floor-side corridor with `4.5 dB` max tolerance. Exact measured
source rows still outrank the formula corridor when the full topology
truly matches.

## Files Touched

- `packages/engine/src/steel-floor-impact-formula-corridor.ts`
- `packages/engine/src/steel-floor-formula-card-report-parity.ts`
- `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ae-steel-floor-formula-card-report-parity-contract.test.ts`
- `packages/engine/src/dynamic-impact.ts`
- `packages/engine/src/impact-support.ts`
- `packages/engine/src/impact-validation-regime.ts`
- `apps/web/features/workbench/steel-floor-formula-corridor-view.ts`
- `apps/web/features/workbench/steel-floor-formula-card-report-parity.test.ts`
- `apps/web/features/workbench/impact-lane-view.ts`
- `apps/web/features/workbench/impact-confidence-view.ts`
- `apps/web/features/workbench/simple-workbench-output-model.ts`
- `apps/web/features/workbench/simple-workbench-output-posture.ts`
- `apps/web/features/workbench/validation-regime.ts`
- `tools/dev/run-calculator-current-gate.ts`
- `AGENTS.md`
- calculator docs/current state files

## Validation

Validation completed on 2026-05-07:

- focused Gate AE engine contract passed: 1 file / 4 tests;
- focused web steel formula card/report parity passed: 1 file / 1 test;
- focused Gate AD regression passed: 1 file / 6 tests;
- focused web output/model/dossier/formula report regressions passed:
  3 files / 16 tests;
- final `pnpm calculator:gate:current` passed with engine 311 files /
  1770 tests, web 63 files / 276 tests plus 18 skipped, repo build, and
  whitespace guard.

The Next build still emits the known non-fatal optional `sharp/@img`
package warnings.

## Next Step

Gate AF should wire the same steel formula requirements into the actual
Dynamic Calculator input surface. The goal is for a user to supply or be
prompted for steel support form, carrier depth/spacing, load basis,
resilient dynamic stiffness, and lower ceiling isolation directly in the
floor route instead of relying on hidden explicit engine input.
