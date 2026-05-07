# Checkpoint - 2026-05-07 Model-First Physics Prediction Pivot Gate Z

Status: Gate Z landed. Gate AA construction-image accuracy incident is
selected next.

Selection status:

`gate_z_floor_impact_field_runtime_landed_selected_construction_image_accuracy_incident_gate_aa`

Landed action:

`gate_z_promote_floor_impact_field_context_runtime_for_dynamic_calculator`

Selected next action:

`gate_aa_construction_image_accuracy_incident_route_selection_and_solver_recovery_plan`

Selected next planning surface:

`docs/calculator/ACCURACY_INCIDENT_2026-05-07_CONSTRUCTION_IMAGE_ROUTE_SELECTION.md`

## What Changed

Gate Z turns the Gate Y field-context boundary into current Dynamic
Calculator runtime behavior for field-only floor-impact requests. A
field-only `L'n,w` / `L'nT,w` request can now use the Gate W lab
`Ln,w` / `DeltaLw` physics anchor when the field context is complete,
then applies the existing field supplement instead of relabelling lab
values.

Pinned reference stack:

- 150 mm concrete base structure;
- 8 mm `generic_resilient_underlay_s30`;
- 30 mm screed;
- 8 mm ceramic tile;
- `loadBasisKgM2 = 76`;
- `resilientLayerDynamicStiffnessMNm3 = 30`;
- field `K = 2 dB`;
- receiving-room volume `55 m3`.

Expected promoted values:

- `LnW 50.3`;
- `DeltaLw 24.3`;
- `LPrimeNW 52.3`;
- `LPrimeNTw 49.9`;
- basis `mixed_predicted_plus_estimated_standardized_field_volume_normalization`.

`L'nT,50` remains unsupported because
`lowFrequencyImpactSpectrumOrCI50_2500Owner` is not implemented. Missing
field context still produces a missing-input warning instead of a
fabricated field impact value.

## Files Touched

- `packages/engine/src/calculate-assembly.ts`
- `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-z-floor-impact-field-runtime-contract.test.ts`
- `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-y-floor-impact-field-context-contract.test.ts`
- `tools/dev/run-calculator-current-gate.ts`
- `AGENTS.md`
- `docs/calculator/NEXT_IMPLEMENTATION_PLAN.md`
- `docs/calculator/CURRENT_STATE.md`
- `docs/calculator/README.md`
- `docs/calculator/SLICE_CALCULATOR_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_V1_PLAN.md`
- `docs/calculator/ACCURACY_INCIDENT_2026-05-07_CONSTRUCTION_IMAGE_ROUTE_SELECTION.md`

## Why Gate AA Is Next

The construction-image examples exposed a calculation accuracy incident,
not a presentation issue. The next gate must start from numeric tests
for the five construction-image wall/floor scenarios, compare app-path
and direct-solver behavior, tighten route selection, and prevent wrong
source-family anchors from driving explicit lightweight-steel floors.

Gate AA must preserve the product rule: DynEcho is a calculator. Exact
source rows can override or calibrate, but source absence cannot be the
reason source-absent physics fails to calculate a realistic layer
combination.

## Validation

Baseline before Gate Z changes: `pnpm calculator:gate:current` passed on
2026-05-07 with engine 305 files / 1738 tests, web 62 files / 275 tests
plus 18 skipped, repo build, and whitespace guard. Known optional
`sharp/@img` Next build warnings remained non-fatal.

Post-change validation completed on 2026-05-07:

- focused Gate Z passed: 1 file / 6 tests;
- focused Gate V/W/X/Y/Z regression passed: 5 files / 28 tests;
- focused Gate J readiness pack regression passed after updating the
  expected Gate Z field-context warning: 1 file / 8 tests;
- `pnpm --filter @dynecho/engine typecheck` passed;
- `pnpm calculator:gate:current` passed with engine 306 files / 1744
  tests, web 62 files / 275 tests plus 18 skipped, repo build, and
  whitespace guard;
- `git diff --check` passed after the final validation-note update.
