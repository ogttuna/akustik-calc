# Checkpoint - 2026-05-08 - Model-First Physics Prediction Pivot Gate BD

Gate:

`gate_bd_steel_floor_formula_same_stack_iso_delta_lw_holdout_closure_plan`

Implemented file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-bd-steel-floor-formula-same-stack-iso-delta-lw-holdout-closure-contract.test.ts`

Helper:

`packages/engine/src/steel-floor-formula-same-stack-iso-delta-lw-holdout-closure.ts`

Status:

Gate BD landed as a no-runtime holdout-count closure boundary for the
same-stack ISO lab `DeltaLw` steel-floor formula residual path.

Summary:

- Gate BD consumes only Gate BC's selected source-owned same-stack ISO
  `DeltaLw` holdout-count closure lane;
- the boundary requires two additional source-owned same-stack ISO lab
  `DeltaLw` holdouts, each with measured metric value, same-stack steel
  reference, ISO lab basis, all Gate AT/AK owner fields, paired
  negative-boundary ownership, and rights-safe locator metadata;
- complete future closure packets count only as residual-readiness
  evidence;
- missing metric value, missing paired negative-boundary owner, missing
  locator metadata, wrong basis/reference, product/inferred values, and
  rights-blocked packets remain rejected;
- paired negative-boundary closure is selected for Gate BE because the
  future holdout-count probe can close the two-holdout shortfall while
  paired negative boundaries remain short by 3;
- broad source crawl, source text/document ingestion, exact-source
  promotion, tolerance movement, formula retune, field/building alias,
  and runtime movement remain blocked;
- runtime values remain `Ln,w 55.6` / `DeltaLw 22.4`, tolerances remain
  `+/-4.5 dB` / `+/-2.0 dB`, exact-source precedence is unchanged, and
  lab/field/building bases remain separate.

Selection status:

`gate_bd_same_stack_iso_delta_lw_holdout_closure_landed_no_runtime_selected_paired_negative_closure_gate_be`

Selected next file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-be-steel-floor-formula-same-stack-iso-delta-lw-paired-negative-closure-contract.test.ts`

Selected next action:

`gate_be_steel_floor_formula_same_stack_iso_delta_lw_paired_negative_closure_plan`

Next step:

Gate BE should define the paired negative-boundary closure boundary for
the three-missing-paired-negative shortfall. It must keep the evidence
residual-readiness-only, require source-owned boundary ownership and
rights-safe locator metadata, and preserve exact-source precedence,
lab/field/building separation, source-absent steel formula pins, and
Gate BD holdout-count closure requirements.

Validation result:

Focused Gate BD validation completed on 2026-05-08. The Gate BD engine
contract passed 1 file / 9 tests, focused Gate BC/BD continuity passed
2 files / 17 tests, engine typecheck passed, and engine DTS build
passed. Full `pnpm calculator:gate:current` passed with engine 336 files
/ 1929 tests, web 66 files / 286 passed + 18 skipped, repo build 5/5
successful, and whitespace guard clean. Known warnings were the existing
Zustand unavailable test-storage warnings and optional sharp package
resolution warnings during the web build.

Broad `pnpm check` was not rerun because Gate BD is a no-runtime,
no-API, no-UI contract/doc gate and the current-gate plus engine
typecheck/build cover the changed surfaces.
