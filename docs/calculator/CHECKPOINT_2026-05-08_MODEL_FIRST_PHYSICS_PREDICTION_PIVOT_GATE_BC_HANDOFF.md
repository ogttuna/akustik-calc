# Checkpoint - 2026-05-08 - Model-First Physics Prediction Pivot Gate BC

Gate:

`gate_bc_steel_floor_formula_same_stack_iso_delta_lw_residual_blocker_closure_plan`

Implemented file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-bc-steel-floor-formula-same-stack-iso-delta-lw-residual-blocker-closure-contract.test.ts`

Helper:

`packages/engine/src/steel-floor-formula-same-stack-iso-delta-lw-residual-blocker-closure.ts`

Status:

Gate BC landed as a no-runtime residual blocker-closure ranking for the
same-stack ISO lab `DeltaLw` steel-floor formula path.

Summary:

- Gate BC uses only Gate BB accepted policy-decision rows as
  blocker-closure ranking inputs;
- current blocked policy rows and rejected probes remain blocked before
  closure ranking;
- the source-owned same-stack ISO lab `DeltaLw` holdout-count closure
  lane is selected for Gate BD because it directly improves residual
  case-count readiness and has a shortfall of 2;
- paired negative-boundary closure, source-owned open-web formula input
  ownership, and field/building basis owner closure remain ranked
  follow-up lanes;
- broad source crawl, source text/document ingestion, exact-source
  promotion, tolerance movement, formula retune, and runtime movement
  remain blocked;
- runtime values remain `Ln,w 55.6` / `DeltaLw 22.4`, tolerances remain
  `+/-4.5 dB` / `+/-2.0 dB`, exact-source precedence is unchanged, and
  lab/field/building bases remain separate.

Selection status:

`gate_bc_same_stack_iso_delta_lw_residual_blocker_closure_landed_no_runtime_selected_holdout_closure_gate_bd`

Selected next file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-bd-steel-floor-formula-same-stack-iso-delta-lw-holdout-closure-contract.test.ts`

Selected next action:

`gate_bd_steel_floor_formula_same_stack_iso_delta_lw_holdout_closure_plan`

Next step:

Gate BD should define the boundary for closing the two-missing
source-owned same-stack ISO lab `DeltaLw` holdout shortfall. It must
preserve rights-safe locator-only evidence handling, require all Gate
AT/AK owner fields, and keep holdout evidence separate from exact-source
promotion, formula retune, tolerance movement, and runtime movement.

Validation result:

Focused Gate BC validation completed on 2026-05-08. The Gate BC engine
contract passed 1 file / 8 tests, focused Gate BB/BC continuity passed
2 files / 16 tests, engine typecheck passed, and engine DTS build
passed. Full `pnpm calculator:gate:current` passed with engine 335 files
/ 1920 tests, web 66 files / 286 passed + 18 skipped, repo build 5/5
successful, and whitespace guard clean. Known warnings were the existing
Zustand unavailable test-storage warnings and optional sharp package
resolution warnings during the web build.

Broad `pnpm check` was not rerun because Gate BC is a no-runtime,
no-API, no-UI contract/doc gate and the current-gate plus engine
typecheck/build cover the changed surfaces.
