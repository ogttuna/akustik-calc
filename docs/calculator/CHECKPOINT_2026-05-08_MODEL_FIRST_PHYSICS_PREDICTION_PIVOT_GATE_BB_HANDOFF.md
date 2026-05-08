# Checkpoint - 2026-05-08 - Model-First Physics Prediction Pivot Gate BB

Gate:

`gate_bb_steel_floor_formula_same_stack_iso_delta_lw_residual_policy_decision_plan`

Implemented file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-bb-steel-floor-formula-same-stack-iso-delta-lw-residual-policy-decision-contract.test.ts`

Helper:

`packages/engine/src/steel-floor-formula-same-stack-iso-delta-lw-residual-policy-decision.ts`

Status:

Gate BB landed as a no-runtime residual-policy decision surface for the
same-stack ISO lab `DeltaLw` steel-floor formula path.

Summary:

- Gate BB uses only Gate BA residual-admitted rows as policy-decision
  inputs;
- current blocked rows and rejected probes remain blocked before policy
  decision;
- the admitted future same-stack ISO lab `DeltaLw` row is classified as
  `hold_current_corridor_policy_decision`;
- blocker closure requirements are explicit: 2 additional source-owned
  `DeltaLw` holdouts, 3 additional paired negative boundaries,
  source-owned open-web formula inputs, and field/building basis owners
  are still required before retune/tighten/widen can be selected;
- future `retune_candidate`, `tighten`, or `widen` policy labels are
  later-gate signals only and do not move runtime or tolerance values;
- source text and source documents are not copied or ingested, measured
  metric values are not ingested for runtime;
- runtime values remain `Ln,w 55.6` / `DeltaLw 22.4`, tolerances remain
  `+/-4.5 dB` / `+/-2.0 dB`, exact-source precedence is unchanged, and
  lab/field/building bases remain separate.

Selection status:

`gate_bb_same_stack_iso_delta_lw_residual_policy_decision_landed_no_runtime_selected_blocker_closure_gate_bc`

Selected next file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-bc-steel-floor-formula-same-stack-iso-delta-lw-residual-blocker-closure-contract.test.ts`

Selected next action:

`gate_bc_steel_floor_formula_same_stack_iso_delta_lw_residual_blocker_closure_plan`

Next step:

Gate BC should rank and select the next residual blocker-closure lane
from the Gate BB blocker shortfalls: source-owned same-stack ISO
`DeltaLw` holdout count, paired negative boundaries, open-web formula
input ownership, and field/building basis owners. It must keep runtime
and tolerance movement closed.

Validation result:

Focused Gate BB validation completed on 2026-05-08. The Gate BB engine
contract passed 1 file / 8 tests, focused Gate BA/BB continuity passed
2 files / 16 tests, engine typecheck passed, and engine DTS build
passed. Full `pnpm calculator:gate:current` passed with engine 334 files
/ 1912 tests, web 66 files / 286 passed + 18 skipped, repo build 5/5
successful, and whitespace guard clean. Known warnings were the existing
Zustand unavailable test-storage warnings and optional sharp package
resolution warnings during the web build.

Broad `pnpm check` was not rerun because Gate BB is a no-runtime,
no-API, no-UI contract/doc gate and the current-gate plus engine
typecheck/build cover the changed surfaces.
