# Checkpoint - 2026-05-07 Model-First Physics Prediction Pivot Gate Y

## Summary

Gate Y landed the no-runtime floor-impact field-context contract for the
Dynamic Calculator.

Selection status:

`gate_y_floor_impact_field_context_contract_landed_no_runtime_selected_field_runtime_gate_z`

Selected next Gate Z file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-z-floor-impact-field-runtime-contract.test.ts`

Selected next Gate Z action:

`gate_z_promote_floor_impact_field_context_runtime_for_dynamic_calculator`

## What Gate Y Defines

Gate Y keeps DynEcho on the calculator-first path. It does not add a
finite source-row queue and does not promote new runtime values. It
defines the field-context boundary that must exist before
floor-impact field values can be treated as owned Dynamic Calculator
outputs.

Required field/context inputs for the floor field-impact lane:

- `contextMode`
- `partitionAreaM2`
- `receivingRoomVolumeM3`
- `receivingRoomRt60S`
- `impactFieldContext`

Required owners before runtime promotion:

- lab impact anchor, currently `Ln,w` / `DeltaLw`;
- `impactFieldContext.fieldKDb` or `guideMassRatio` or explicit direct
  flanking paths;
- flanking path or junction policy;
- low-frequency impact spectrum / `CI,50-2500` owner before `L'nT,50`.

## Runtime Boundary Observed

The current engine has an important pre-existing boundary:

- field-only Dynamic Calculator requests for `L'n,w` / `L'nT,w` stay
  blocked before Gate Z, even when room and impact context are complete;
- lab-anchored mixed requests such as `Ln,w` + `L'n,w` + `L'nT,w` can
  already reach the existing live field supplement and produce
  `LPrimeNW 52.3` / `LPrimeNTw 49.9` from the Gate W lab pin
  `LnW 50.3`;
- Gate Z must own this intentionally: field-only runtime promotion,
  support buckets, missing-input prompts, workbench cards, and proposal
  report parity must agree.

`L'nT,50` remains blocked until a low-frequency owner exists. It must
not be fabricated from `L'nT,w` without `CI,50-2500`, a band curve, or
another explicit low-frequency basis.

## Landed Surfaces

- `packages/engine/src/dynamic-calculator-floor-impact-field-context-contract.ts`
- `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-y-floor-impact-field-context-contract.test.ts`
- `packages/engine/src/index.ts`
- `tools/dev/run-calculator-current-gate.ts`
- `docs/calculator/NEXT_IMPLEMENTATION_PLAN.md`
- `docs/calculator/CURRENT_STATE.md`
- `docs/calculator/SLICE_CALCULATOR_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_V1_PLAN.md`
- `docs/calculator/README.md`
- `AGENTS.md`

## Boundaries Preserved

- Gate Y has no numeric runtime behavior change.
- Gate W lab floor pins remain `DeltaLw 24.3` / `LnW 50.3`.
- `L'n,w`, `L'nT,w`, and `L'nT,50` remain field-context outputs, not
  aliases of lab `Ln,w`.
- `IIC` / `AIIC` stay blocked behind a separate ASTM adapter owner.
- Source rows remain exact overrides, anchors, calibration evidence, and
  holdouts. They are not the selected way to cover unbounded layer
  combinations.

## Next Step

Gate Z should promote and normalize the floor-impact field-context
runtime path for Dynamic Calculator:

1. allow field-only `L'n,w` / `L'nT,w` requests to use the owned Gate W
   lab anchor internally when all Gate Y inputs are present;
2. keep incomplete contexts as `needs_input` with the same missing fields
   in API, workbench cards, and proposal reports;
3. keep `L'nT,50` unsupported/blocked until low-frequency evidence or a
   band/spectrum owner is added;
4. pin field values, basis strings, metric basis, support buckets, and
   visible/report parity with positive and nearby-negative tests.

## Validation

- focused Gate Y:
  `pnpm --filter @dynecho/engine exec vitest run src/calculator-model-first-physics-prediction-pivot-gate-y-floor-impact-field-context-contract.test.ts`
  passed, 1 file / 5 tests.
- focused Gate V/W/X/Y regression:
  `pnpm --filter @dynecho/engine exec vitest run src/calculator-model-first-physics-prediction-pivot-gate-v-floor-impact-dynamic-stiffness-contract.test.ts src/calculator-model-first-physics-prediction-pivot-gate-w-floor-impact-runtime-contract.test.ts src/calculator-model-first-physics-prediction-pivot-gate-x-next-solver-or-field-context-selection-contract.test.ts src/calculator-model-first-physics-prediction-pivot-gate-y-floor-impact-field-context-contract.test.ts`
  passed, 4 files / 22 tests.
- `pnpm --filter @dynecho/engine typecheck` passed.
- `pnpm calculator:gate:current` passed: engine 305 files / 1738
  tests, web 62 files / 275 tests plus 18 skipped, repo build, and
  whitespace guard.
- broad `pnpm check` passed: full engine 430 files / 2540 tests, full
  web 168 files / 950 tests plus 18 skipped, lint, typecheck, and build.
  The known optional `sharp/@img` Next build warnings remained
  non-fatal.
- `git diff --check` passed.
