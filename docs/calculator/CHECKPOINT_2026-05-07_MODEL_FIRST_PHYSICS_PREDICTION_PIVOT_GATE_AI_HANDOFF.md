# Checkpoint - 2026-05-07 - Model-First Physics Prediction Pivot Gate AI

## Status

Gate AI landed for `calculator_model_first_physics_prediction_pivot_v1`.

Landed gate:

`gate_ai_steel_floor_formula_residual_policy_and_calibration_readiness_plan`

Landed file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ai-steel-floor-formula-residual-policy-contract.test.ts`

Selection status:

`gate_ai_steel_floor_formula_residual_policy_landed_selected_negative_boundary_delta_lw_gate_aj`

Selected next file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-aj-steel-floor-formula-negative-boundary-and-delta-lw-holdout-contract.test.ts`

Selected next action:

`gate_aj_steel_floor_formula_negative_boundaries_and_delta_lw_holdout_intake_plan`

## What Changed

Gate AI turns the Gate AH benchmark result into an executable residual
policy without moving runtime values. The policy is deliberately
calculator-first: source rows can be exact overrides, anchors, or
holdouts, but a limited source set cannot replace the family solver.

Implemented behavior:

- `Ln,w` and `DeltaLw` each evaluate through explicit `hold`, `tighten`,
  `widen`, and `retune_candidate` branches;
- current `Ln,w` evidence resolves to `hold` because Gate AH residuals
  are low (`0.6 dB` max / `0.4 dB` mean) but the evidence set is only
  three same-family Pliteq holdouts;
- current `DeltaLw` evidence resolves to `hold` because measured
  `DeltaLw` residual count is zero;
- `tighten` requires enough source-owned holdouts, paired negative
  boundaries, source-owned open-web formula inputs, and separate
  field/building basis owners;
- `retune_candidate` additionally requires a source-owned correction;
- `widen` is expressed separately for out-of-corridor evidence when
  retune ownership is incomplete;
- UBIQ open-web exact rows remain `calibration_anchor_only` until formula
  inputs and topology are source-owned and paired negatives exist;
- exact measured rows remain precedence;
- runtime values stay unchanged.

## Files Touched

- `packages/engine/src/steel-floor-formula-residual-policy.ts`
- `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ai-steel-floor-formula-residual-policy-contract.test.ts`
- `packages/engine/src/index.ts`
- `tools/dev/run-calculator-current-gate.ts`
- `docs/calculator/CURRENT_STATE.md`
- `docs/calculator/NEXT_IMPLEMENTATION_PLAN.md`
- `docs/calculator/README.md`
- `docs/calculator/SLICE_CALCULATOR_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_V1_PLAN.md`
- `AGENTS.md`

## Validation

- `pnpm --filter @dynecho/engine exec vitest run src/calculator-model-first-physics-prediction-pivot-gate-ai-steel-floor-formula-residual-policy-contract.test.ts --maxWorkers=1`
  passed 1 file / 5 tests.
- `pnpm --filter @dynecho/engine exec tsc --noEmit` passed.
- Full `pnpm calculator:gate:current` passed with engine 315 files /
  1788 tests, web 65 files / 284 passed + 18 skipped, and repo build
  5/5 tasks.
- Known non-fatal warnings remain the Node/Vitest Zustand persist
  storage warning and optional `sharp` / `@img` Next build warnings via
  the DOCX export dependency.

## Next Gate AJ

Gate AJ should add the paired negative-boundary and measured `DeltaLw`
holdout intake layer that Gate AI requires before any retune or
tightening can be considered.

Gate AJ should:

1. create the Gate AJ contract at
   `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-aj-steel-floor-formula-negative-boundary-and-delta-lw-holdout-contract.test.ts`;
2. add paired negative-boundary cases for wrong support family, exact row
   precedence, field/building basis leakage, and source-absent design
   references;
3. define measured `DeltaLw` holdout intake rules separately from
   product-catalog `DeltaLw` or inferred Annex-C companions;
4. keep UBIQ exact rows as anchors until carrier spacing, load basis,
   dynamic stiffness, lower support class, and upper-resilient topology
   are source-owned;
5. preserve current runtime values and exact-source precedence.

Non-goals:

- no broad source crawl;
- no measured-row catalog replacement;
- no runtime formula retune;
- no DeltaLw tightening from inferred or product-only values;
- no field/building output promotion from lab formula values.
