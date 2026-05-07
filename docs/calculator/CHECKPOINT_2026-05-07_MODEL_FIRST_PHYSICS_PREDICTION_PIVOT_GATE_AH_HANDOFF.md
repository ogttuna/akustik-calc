# Checkpoint - 2026-05-07 - Model-First Physics Prediction Pivot Gate AH

## Status

Gate AH landed for `calculator_model_first_physics_prediction_pivot_v1`.

Landed gate:

`gate_ah_steel_floor_formula_accuracy_benchmark_expansion_plan`

Landed file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ah-steel-floor-formula-accuracy-benchmark-contract.test.ts`

Selection status:

`gate_ah_steel_floor_formula_accuracy_benchmark_landed_selected_residual_policy_gate_ai`

Selected next file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ai-steel-floor-formula-residual-policy-contract.test.ts`

Selected next action:

`gate_ai_steel_floor_formula_residual_policy_and_calibration_readiness_plan`

## What Changed

Gate AH adds a steel-floor formula accuracy benchmark matrix without
moving runtime values. The point is to measure the Gate AD formula
against owned same-family evidence, while keeping source rows as exact
overrides, anchors, or calibration evidence rather than turning the
calculator into a finite row catalog.

Implemented behavior:

- three same-family Pliteq steel-joist lab `Ln,w` holdouts are residual
  checks with explicit support form, carrier depth/spacing, resilient
  dynamic stiffness, load basis, lower isolation, and metric basis;
- those holdouts produce `0.3 dB`, `0.3 dB`, and `0.6 dB` `Ln,w`
  residuals;
- max `Ln,w` residual is `0.6 dB` and mean `Ln,w` residual is `0.4 dB`;
- all residuals stay inside the current `+/-4.5 dB Ln,w` corridor;
- measured `DeltaLw` residual count remains zero, so the current
  `+/-2.0 dB DeltaLw` corridor is kept but not tightened;
- 36 UBIQ open-web exact rows are inventoried as exact anchors, but they
  remain non-residual rows when carrier spacing, load basis, resilient
  dynamic stiffness, lower support class, or upper-resilient topology is
  missing;
- the source-absent complete open-web design reference remains a runtime
  reference, not a measured residual;
- exact measured rows remain above the formula corridor.

## Files Touched

- `packages/engine/src/steel-floor-formula-accuracy-benchmark.ts`
- `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ah-steel-floor-formula-accuracy-benchmark-contract.test.ts`
- `packages/engine/src/index.ts`
- `tools/dev/run-calculator-current-gate.ts`
- `docs/calculator/CURRENT_STATE.md`
- `docs/calculator/NEXT_IMPLEMENTATION_PLAN.md`
- `docs/calculator/README.md`
- `docs/calculator/SLICE_CALCULATOR_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_V1_PLAN.md`
- `AGENTS.md`

## Validation

Focused validation:

- `pnpm --filter @dynecho/engine exec vitest run src/calculator-model-first-physics-prediction-pivot-gate-ah-steel-floor-formula-accuracy-benchmark-contract.test.ts --maxWorkers=1`
  passed 1 file / 5 tests.
- `pnpm --filter @dynecho/engine exec tsc --noEmit` passed.

Current-gate validation:

- Full `pnpm calculator:gate:current` passed with engine 314 files /
  1783 tests, web 65 files / 284 passed + 18 skipped, and repo build
  5/5 tasks.
- Known non-fatal warnings remain the Node/Vitest Zustand persist
  storage warning and optional `sharp` / `@img` Next build warnings via
  the DOCX export dependency.

## Next Gate AI

Gate AI should turn the Gate AH benchmark outcome into an explicit
residual policy. The current evidence supports holding the existing
runtime values and tolerances; it is not enough to retune from a
Pliteq-only limited holdout set.

Gate AI should:

1. create the Gate AI contract at
   `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ai-steel-floor-formula-residual-policy-contract.test.ts`;
2. express when the steel formula posture is `hold`, `tighten`, `widen`,
   or `retune_candidate`;
3. require measured `DeltaLw` holdouts before tightening `DeltaLw`;
4. require source-owned open-web formula inputs before turning UBIQ exact
   anchors into residual rows;
5. keep exact-source precedence and lab/field/building basis separation;
6. require paired negative tests before any runtime retune.

Non-goals:

- no broad source crawl;
- no measured-row catalog replacement;
- no field/building output promotion from lab formula values;
- no formula retune from the current limited holdout set.
