# Checkpoint - 2026-05-07 - Model-First Physics Prediction Pivot Gate V

## Status

Landed:

`gate_v_define_floor_impact_dynamic_stiffness_input_and_adapter_contract_for_dynamic_calculator`

Selection status:

`gate_v_floor_impact_dynamic_stiffness_contract_landed_no_runtime_selected_floor_impact_runtime_gate_w`

Selected next file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-w-floor-impact-runtime-contract.test.ts`

Selected next action:

`gate_w_promote_floor_impact_dynamic_stiffness_runtime_for_dynamic_calculator`

## What Changed

- Added
  `packages/engine/src/dynamic-calculator-floor-impact-dynamic-stiffness-contract.ts`
  and the Gate V contract test.
- Extended Dynamic Calculator route/topology input assessment with
  `floorImpactContext` so `loadBasisKgM2` and user-entered
  `resilientLayerDynamicStiffnessMNm3` can satisfy physical input
  requirements.
- Canonicalized the surfaced dynamic-stiffness input id to
  `resilientLayerDynamicStiffnessMNm3` while keeping source rows as
  anchors/calibration candidates, not the product.
- `Ln,w` / `DeltaLw` stay lab impact outputs, `L'n,w` / `L'nT,w` require
  field context, and `IIC` / `AIIC` stay unsupported until an ASTM E989
  adapter owner exists.
- Safe role-defined floor reorders normalize through the existing
  topology normalizer without runtime value movement.

## Tests Captured

Gate V adds positive and nearby-negative coverage for:

- complete heavy floating-floor `Ln,w` / `DeltaLw` input;
- missing `resilientLayerDynamicStiffnessMNm3`;
- missing `loadBasisKgM2`;
- user-entered dynamic stiffness filling a missing catalog property;
- field impact outputs without room/context inputs;
- `IIC` / `AIIC` blocked behind ASTM E989 ownership;
- safe role-defined floor reorders and current runtime value pins.

Runtime numeric behavior did not move in this gate. The pinned heavy
floating-floor predictor scenario remains `DeltaLw 24.3` and `LnW 50.3`
with basis `predictor_heavy_floating_floor_iso12354_annexc_estimate`.

## Validation

- `pnpm --filter @dynecho/engine typecheck` passed.
- Focused Gate V passed: 1 file / 6 tests.
- Affected model-first gates passed: Gate D, Gate J, Gate K, Gate L,
  Gate U, and Gate V.
- `pnpm calculator:gate:current` passed with engine 302 files / 1722
  tests, web 62 files / 275 tests plus 18 skipped, repo build, and
  whitespace guard.
- `pnpm check` passed: lint, typecheck, full tests, and build. The
  existing Next build sharp optional-dependency warnings appeared during
  the cached web build replay, then the build completed successfully.
- `git diff --check` passed.

## Next Step

Gate W should promote only the complete resilient floating-floor lab
impact lane where the Gate V contract reports `ready_for_runtime_gate`.
It must keep field impact and ASTM rating adapters out of runtime until
their input/adapter boundaries are ready, and it must pin visible
card/report parity, basis/origin, support bucket, and error budget.
