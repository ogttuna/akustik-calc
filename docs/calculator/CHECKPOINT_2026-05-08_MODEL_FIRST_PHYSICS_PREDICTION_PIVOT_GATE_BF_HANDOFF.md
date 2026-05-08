# Checkpoint - 2026-05-08 - Model-First Physics Prediction Pivot Gate BF

Gate:

`gate_bf_steel_floor_formula_same_stack_iso_delta_lw_open_web_input_ownership_closure_plan`

Implemented file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-bf-steel-floor-formula-same-stack-iso-delta-lw-open-web-input-ownership-closure-contract.test.ts`

Helper:

`packages/engine/src/steel-floor-formula-same-stack-iso-delta-lw-open-web-input-ownership-closure.ts`

Status:

Gate BF landed as a no-runtime source-owned open-web formula input
ownership closure for the same-stack ISO lab `DeltaLw` steel-floor
formula residual path.

Summary:

- Gate BF consumes Gate BE's selected open-web input ownership closure
  lane;
- the boundary requires one future source-owned open-web formula input
  packet with support form, carrier depth, carrier spacing, load basis,
  dynamic stiffness, lower support class, upper resilient topology, and
  rights-safe locator metadata;
- complete future open-web input packets count only as residual-policy
  readiness evidence;
- missing owner fields, missing physical input values, missing locator
  metadata, wrong metric basis, wrong support form, product/inferred
  claims, rights-blocked packets, and missing upper topology remain
  rejected;
- field/building basis owner closure is selected for Gate BG because
  Gate BF can close the open-web input ownership blocker while
  field/building basis owners remain missing;
- broad source crawl, source text/document ingestion, exact-source
  promotion, tolerance movement, formula retune, field/building alias,
  and runtime movement remain blocked;
- runtime values remain `Ln,w 55.6` / `DeltaLw 22.4`, tolerances remain
  `+/-4.5 dB` / `+/-2.0 dB`, exact-source precedence is unchanged, and
  lab/field/building bases remain separate.

Selection status:

`gate_bf_same_stack_iso_delta_lw_open_web_input_ownership_closure_landed_no_runtime_selected_field_building_basis_owner_gate_bg`

Selected next file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-bg-steel-floor-formula-same-stack-iso-delta-lw-field-building-basis-owner-closure-contract.test.ts`

Selected next action:

`gate_bg_steel_floor_formula_same_stack_iso_delta_lw_field_building_basis_owner_closure_plan`

Next step:

Gate BG should define the field/building basis owner closure boundary.
It must keep lab, field, and building-prediction bases separate, require
explicit owner fields before any `L'n,w` / `L'nT,w` or building
prediction path can be closed, and preserve exact-source precedence,
source-absent steel formula pins, Gate BD holdout-count closure, Gate BE
paired-negative closure, and Gate BF open-web input ownership
requirements.

Validation result:

Focused Gate BF validation completed on 2026-05-08. The Gate BF engine
contract passed 1 file / 9 tests, focused Gate BE/BF continuity passed
2 files / 19 tests, engine typecheck passed, and engine DTS build
passed. Full `pnpm calculator:gate:current` passed with engine 338 files
/ 1948 tests, web 66 files / 286 passed + 18 skipped, repo build 5/5
successful, and whitespace guard clean. Known warnings were the existing
Zustand unavailable test-storage warnings and optional sharp package
resolution warnings during the web build.

Broad `pnpm check` was not rerun because Gate BF is a no-runtime,
no-API, no-UI contract/doc gate and the current-gate plus engine
typecheck/build cover the changed surfaces.
