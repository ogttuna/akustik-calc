# Checkpoint - 2026-05-07 - Model-First Physics Prediction Pivot Gate AG

## Status

Gate AG landed for `calculator_model_first_physics_prediction_pivot_v1`.

Landed gate:

`gate_ag_steel_floor_formula_input_surface_acceptance_revalidation_plan`

Landed file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ag-steel-floor-formula-input-surface-acceptance-contract.test.ts`

Selection status:

`gate_ag_steel_floor_formula_input_surface_acceptance_landed_selected_accuracy_benchmark_gate_ah`

Selected next file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ah-steel-floor-formula-accuracy-benchmark-contract.test.ts`

Selected next action:

`gate_ah_steel_floor_formula_accuracy_benchmark_expansion_plan`

## What Changed

Gate AG converts the Gate AF steel-floor input surface into an acceptance
contract across the Dynamic Calculator user surfaces and API payloads. It
does not retune the Gate AD steel formula, add source rows, or promote field
impact outputs from lab values.

Implemented behavior:

- complete UI-derived steel floors still calculate lab `LnW 55.6`,
  `DeltaLw 22.4`, and
  `predictor_lightweight_steel_mass_spring_holdout_corridor_estimate`;
- live workbench evaluation, local saved scenario replay, server snapshot
  replay, output cards, Markdown report payload, estimate API payload, and
  impact-only API payload preserve the same basis, tolerance, and numbers;
- missing or invalid physical inputs now produce precise steel-floor formula
  warnings for the blocked fields instead of silently parking the lane;
- comma decimals are accepted for numeric formula fields;
- field removal after a complete calculation parks the formula lane;
- many parked rows, safe reorder, and split-contiguous same steel carriers do
  not move the formula result or crash the workbench;
- unsafe duplicate steel carrier topology remains refused;
- toggling the base layer to a non-steel floor deactivates the steel formula
  surface;
- `L'n,w` and `L'nT,w` stay unsupported unless a field-context owner exists.

## Files Touched

- `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ag-steel-floor-formula-input-surface-acceptance-contract.test.ts`
- `apps/web/features/workbench/steel-floor-formula-input-surface-acceptance.test.ts`
- `apps/web/features/workbench/steel-floor-formula-input-surface.ts`
- `apps/web/features/workbench/scenario-analysis.ts`
- `tools/dev/run-calculator-current-gate.ts`
- `docs/calculator/CURRENT_STATE.md`
- `docs/calculator/NEXT_IMPLEMENTATION_PLAN.md`
- `docs/calculator/README.md`
- `docs/calculator/SLICE_CALCULATOR_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_V1_PLAN.md`
- `AGENTS.md`

## Validation

Focused validation:

- `pnpm --filter @dynecho/engine exec vitest run src/calculator-model-first-physics-prediction-pivot-gate-ag-steel-floor-formula-input-surface-acceptance-contract.test.ts --maxWorkers=1`
  passed 1 file / 3 tests.
- `pnpm --filter @dynecho/web exec vitest run features/workbench/steel-floor-formula-input-surface-acceptance.test.ts --maxWorkers=1`
  passed 1 file / 4 tests.
- `pnpm --filter @dynecho/web exec vitest run features/workbench/steel-floor-formula-input-surface.test.ts features/workbench/steel-floor-formula-input-surface-acceptance.test.ts --maxWorkers=1`
  passed 2 files / 8 tests.
- `pnpm --filter @dynecho/engine exec tsc --noEmit` passed.
- `pnpm --filter @dynecho/web exec tsc --noEmit` passed.

Current-gate validation:

- `git diff --check` passed before the full gate.
- `pnpm calculator:gate:current` passed.
- Engine gate: 313 files / 1778 tests passed.
- Web gate: 65 files / 284 tests passed plus 18 skipped.
- Repo build passed.
- Whitespace guard passed.
- The Gate AG web acceptance test emits known non-fatal Zustand persist
  storage warnings under Node/Vitest.
- The web build still emits the known non-fatal optional `sharp/@img`
  package warnings through the DOCX export dependency.

## Next Gate AH

Gate AH should expand steel-floor formula accuracy benchmarking. The right
next risk is numeric evidence across nearby steel-floor support families, not
another UI plumbing pass and not a source-row catalog.

Gate AH should:

1. create the Gate AH contract at
   `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ah-steel-floor-formula-accuracy-benchmark-contract.test.ts`;
2. build a rights-safe benchmark matrix from existing measured/holdout rows
   and explicit physics input cases;
3. include support form, carrier depth/spacing, resilient dynamic stiffness,
   load basis, lower isolation, metric basis, and tolerance owner for each
   benchmark case;
4. compare formula residuals only where topology and metric basis truly match;
5. decide whether the current `+/-4.5 dB Ln,w` and `+/-2.0 dB DeltaLw`
   tolerances should stay, widen, or narrow from evidence;
6. keep exact-source precedence and lab/field/building-prediction bases
   separate.

Non-goals:

- no broad source crawl;
- no replacing the physics calculator with a measured-row catalog;
- no field/building output promotion from lab values;
- no formula retune without residual evidence and paired negative tests.
