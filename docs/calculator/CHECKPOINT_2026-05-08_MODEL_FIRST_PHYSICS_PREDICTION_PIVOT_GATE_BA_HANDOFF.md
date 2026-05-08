# Checkpoint - 2026-05-08 - Model-First Physics Prediction Pivot Gate BA

Gate:

`gate_ba_steel_floor_formula_same_stack_iso_delta_lw_residual_admission_boundary_plan`

Implemented file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ba-steel-floor-formula-same-stack-iso-delta-lw-residual-admission-boundary-contract.test.ts`

Helper:

`packages/engine/src/steel-floor-formula-same-stack-iso-delta-lw-residual-admission-boundary.ts`

Status:

Gate BA landed as a no-runtime residual-admission boundary for the
same-stack ISO lab `DeltaLw` steel-floor formula path.

Summary:

- Gate BA uses only Gate AZ accepted calibration evidence candidates as
  residual admission inputs;
- current request-status rows, rejected Gate AY probes, and blocked Gate
  AZ candidate rows remain blocked;
- residual admission requires source-owned measured `DeltaLw`,
  same-stack steel reference, ISO lab basis, all Gate AT/AK owner fields,
  paired negative-boundary ownership, and rights-safe citation/locator
  metadata;
- the accepted future same-stack ISO `DeltaLw` calibration candidate can
  enter residual-policy evaluation, but its decision remains `hold`
  because holdout count, paired negative-boundary count, open-web formula
  input ownership, and field/building owner coverage are incomplete;
- residual admission is not exact-source promotion, tolerance movement,
  formula retune, field/building aliasing, or runtime movement;
- source text and source documents are not copied or ingested, measured
  metric values are not ingested for runtime;
- runtime values remain `Ln,w 55.6` / `DeltaLw 22.4`, tolerances remain
  `+/-4.5 dB` / `+/-2.0 dB`, exact-source precedence is unchanged, and
  lab/field/building bases remain separate.

Selection status:

`gate_ba_same_stack_iso_delta_lw_residual_admission_boundary_landed_no_runtime_selected_residual_policy_decision_gate_bb`

Selected next file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-bb-steel-floor-formula-same-stack-iso-delta-lw-residual-policy-decision-contract.test.ts`

Selected next action:

`gate_bb_steel_floor_formula_same_stack_iso_delta_lw_residual_policy_decision_plan`

Next step:

Gate BB should make the residual-policy decision surface explicit. It
should consume only Gate BA residual-admitted rows, keep current blocked
rows out, prove the admitted future row is still `hold`, and preserve
the rule that retune/tighten/widen decisions require a later gate with
complete threshold ownership.

Validation result:

Focused Gate BA validation completed on 2026-05-08. The Gate BA engine
contract passed 1 file / 8 tests, focused Gate AZ/BA continuity passed
2 files / 16 tests, engine typecheck passed, and engine DTS build
passed. Full `pnpm calculator:gate:current` passed with engine 333 files
/ 1904 tests, web 66 files / 286 passed + 18 skipped, repo build 5/5
successful, and whitespace guard clean. Known warnings were the existing
Zustand unavailable test-storage warnings and optional sharp package
resolution warnings during the web build.

Broad `pnpm check` was not rerun because Gate BA is a no-runtime,
no-API, no-UI contract/doc gate and the current-gate plus engine
typecheck/build cover the changed surfaces.
