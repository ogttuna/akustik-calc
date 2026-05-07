# Checkpoint - 2026-05-07 - Model-First Physics Prediction Pivot Gate AF

## Status

Gate AF landed for `calculator_model_first_physics_prediction_pivot_v1`.

Landed gate:

`gate_af_steel_floor_formula_input_surface_plan`

Landed file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-af-steel-floor-formula-input-surface-contract.test.ts`

Selection status:

`gate_af_steel_floor_formula_input_surface_landed_selected_acceptance_revalidation_gate_ag`

Selected next file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ag-steel-floor-formula-input-surface-acceptance-contract.test.ts`

Selected next action:

`gate_ag_steel_floor_formula_input_surface_acceptance_revalidation_plan`

## What Changed

Gate AF closes the gap where the steel formula worked only from hidden
explicit `impactPredictorInput`. The Dynamic Calculator floor route now
has a first-class steel-floor formula input surface that maps user-facing
fields into the same predictor input used by the Gate AD formula.

Implemented behavior:

- `steelSupportForm`, `steelCarrierDepthMm`,
  `steelCarrierSpacingMm`, `resilientLayerDynamicStiffnessMNm3`,
  `loadBasisKgM2`, and `lowerCeilingIsolationSupportForm` are owned as
  the Gate AF field set.
- `packages/engine/src/steel-floor-formula-input-surface.ts` bridges
  layer-derived floor topology with the explicit steel formula fields.
- Complete construction-image style steel rows plus UI fields produce
  the same formula corridor as the explicit predictor input:
  lab `LnW 55.6`, `DeltaLw 22.4`,
  `predictor_lightweight_steel_mass_spring_holdout_corridor_estimate`.
- Partial fields do not fall through into a fake formula answer.
- Unsafe duplicate steel carriers are parked as unsafe topology instead
  of being collapsed into a false single carrier.
- Exact measured source rows remain above the formula corridor.
- Workbench scenario analysis now passes the UI-derived predictor input
  into `calculateAssembly`.
- Workbench store, browser/server snapshots, and route panel controls
  now persist and restore the steel formula input surface.

## Files Touched

- `packages/engine/src/steel-floor-formula-input-surface.ts`
- `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-af-steel-floor-formula-input-surface-contract.test.ts`
- `packages/engine/src/index.ts`
- `apps/web/features/workbench/steel-floor-formula-input-surface.ts`
- `apps/web/features/workbench/steel-floor-formula-input-surface.test.ts`
- `apps/web/features/workbench/scenario-analysis.ts`
- `apps/web/features/workbench/simple-workbench-shell.tsx`
- `apps/web/features/workbench/simple-workbench-route-panel.tsx`
- `apps/web/features/workbench/simple-workbench-constants.ts`
- `apps/web/features/workbench/workbench-store.ts`
- `apps/web/features/workbench/server-project-workbench-snapshot.test.ts`
- `tools/dev/run-calculator-current-gate.ts`

## Validation

Focused validation:

- `pnpm --filter @dynecho/engine exec vitest run src/calculator-model-first-physics-prediction-pivot-gate-af-steel-floor-formula-input-surface-contract.test.ts --maxWorkers=1`
  passed 1 file / 5 tests.
- `pnpm --filter @dynecho/web exec vitest run features/workbench/steel-floor-formula-input-surface.test.ts --maxWorkers=1`
  passed 1 file / 4 tests.
- `pnpm --filter @dynecho/engine exec tsc --noEmit` passed.
- `pnpm --filter @dynecho/web exec tsc --noEmit` passed.

Current-gate validation:

- `pnpm calculator:gate:current` passed.
- Engine gate: 312 files / 1775 tests passed.
- Web gate: 64 files / 280 tests passed plus 18 skipped.
- Repo build passed.
- Whitespace guard passed.
- The web build still emits the known non-fatal optional
  `sharp/@img` package warnings through the DOCX export dependency.

## Next Gate AG

Gate AG should not retune the formula and should not start a source crawl.
It should harden the landed input surface into an acceptance/revalidation
pack:

1. Add a Gate AG contract that verifies workbench UI input, saved local
   scenario replay, server snapshot replay, output cards, report data,
   and calculator API payloads stay numerically aligned for the complete
   steel formula case.
2. Make missing/invalid steel formula fields visibly precise in the route
   panel and output unlock flow, not only internally parked.
3. Add more hostile UI cases: zero/negative values, comma decimals,
   many split layers, safe row reorder, unsafe carrier duplication, and
   toggling steel/non-steel base materials.
4. Keep exact measured rows as first precedence and keep field/building
   impact outputs separate from lab `Ln,w` / `DeltaLw`.
