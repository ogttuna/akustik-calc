# Checkpoint - 2026-05-07 Model-First Physics Prediction Pivot Gate X

## Summary

Gate X landed a no-runtime selection for the next Dynamic Calculator
solver or field-context boundary after Gate W's floor-impact runtime
promotion.

Selection status:

`gate_x_next_solver_or_field_context_selection_landed_no_runtime_selected_floor_impact_field_context_gate_y`

Selected next Gate Y file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-y-floor-impact-field-context-contract.test.ts`

Selected next Gate Y action:

`gate_y_define_floor_impact_field_context_boundary_for_dynamic_calculator`

## Why Gate Y

Gate W promoted only the complete ISO 717-2 lab floor-impact lane:
`Ln,w` / `DeltaLw` with explicit `loadBasisKgM2` and
`resilientLayerDynamicStiffnessMNm3`. The highest-value next gap is not
another source packet and not a broad multi-cavity runtime move. The
direct personal-use gap is floor field impact: `L'n,w`, `L'nT,w`, and
`L'nT,50` must ask for the room/context/flanking inputs they need before
any runtime field value can be promoted.

Gate Y should define:

1. required field/context inputs:
   `contextMode`, `partitionAreaM2`, `receivingRoomVolumeM3`,
   `receivingRoomRt60S`, `impactFieldContext`, and flanking/junction
   policy;
2. the ISO 717-2 field-impact adapter boundary, including which inputs
   support `L'n,w`, `L'nT,w`, and `L'nT,50`;
3. positive cases with complete lab impact plus complete field context;
4. nearby negatives for missing area, volume, RT60/absorption, context
   mode, impact field context, and flanking policy;
5. visible card/report parity so unsupported and `needs_input` states do
   not disagree across API, workbench, and proposal outputs.

## Landed Surfaces

- `packages/engine/src/dynamic-calculator-next-solver-or-field-context-selection.ts`
- `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-x-next-solver-or-field-context-selection-contract.test.ts`
- `packages/engine/src/index.ts`
- `tools/dev/run-calculator-current-gate.ts`
- `docs/calculator/NEXT_IMPLEMENTATION_PLAN.md`
- `docs/calculator/CURRENT_STATE.md`
- `docs/calculator/SLICE_CALCULATOR_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_V1_PLAN.md`
- `docs/calculator/README.md`
- `AGENTS.md`

## Boundaries Preserved

- Gate X has no numeric runtime behavior change.
- Gate W lab floor pins remain `DeltaLw 24.3` / `LnW 50.3` with basis
  `predictor_heavy_floating_floor_iso12354_annexc_estimate`.
- `L'n,w`, `L'nT,w`, and `L'nT,50` remain field-context outputs, not
  aliases of lab `Ln,w`.
- `IIC` / `AIIC` stay blocked behind a separate ASTM adapter owner.
- Source rows remain exact overrides, anchors, calibration evidence, and
  holdouts. They are not the product path selected by Gate X.

## Validation

- focused Gate X:
  `pnpm --filter @dynecho/engine exec vitest run src/calculator-model-first-physics-prediction-pivot-gate-x-next-solver-or-field-context-selection-contract.test.ts`
  passed, 1 file / 5 tests.
- focused Gate V/W/X regression:
  `pnpm --filter @dynecho/engine exec vitest run src/calculator-model-first-physics-prediction-pivot-gate-v-floor-impact-dynamic-stiffness-contract.test.ts src/calculator-model-first-physics-prediction-pivot-gate-w-floor-impact-runtime-contract.test.ts src/calculator-model-first-physics-prediction-pivot-gate-x-next-solver-or-field-context-selection-contract.test.ts`
  passed, 3 files / 17 tests.
- `pnpm calculator:gate:current` passed: engine 304 files / 1733
  tests, web 62 files / 275 tests + 18 skipped, repo build, and
  whitespace guard.
- broad `pnpm check` passed: full engine 429 files / 2535 tests, full
  web suite, typecheck, lint, and build. The known optional
  `sharp/@img` Next build warnings remained non-fatal.
- `git diff --check` passed.
