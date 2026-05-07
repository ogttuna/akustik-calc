# Checkpoint - 2026-05-07 - Model-First Physics Prediction Pivot Gate AK

## Scope

Gate AK lands the steel-floor formula source-owned same-stack lab
`DeltaLw` holdout packet contract inside
`calculator_model_first_physics_prediction_pivot_v1`.

This is still a calculator-first accuracy gate. It does not gather a
broad source catalog and it does not retune runtime values. It makes the
next residual-tightening step stricter by defining exactly what a
measured `DeltaLw` holdout must own before it can affect the
steel-floor formula corridor.

## Landed

Gate AK landed file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ak-steel-floor-formula-source-owned-delta-lw-holdout-contract.test.ts`

Gate AK landed action:

`gate_ak_steel_floor_formula_source_owned_delta_lw_holdout_acquisition_plan`

Selection status:

`gate_ak_delta_lw_holdout_packet_contract_landed_selected_first_source_owned_holdout_gate_al`

Selected next file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-al-steel-floor-formula-source-owned-delta-lw-first-holdout-contract.test.ts`

Selected next action:

`gate_al_steel_floor_formula_source_owned_delta_lw_first_holdout_plan`

## Behavior

- A `DeltaLw` packet can count toward steel-floor formula residual
  tightening only when metric value, topology/support family, carrier
  spacing, load basis, dynamic stiffness, lower support class,
  upper-resilient topology, and paired negative boundary owner are all
  source-owned.
- Current Pliteq steel-joist rows remain `Ln,w` holdouts only because
  they do not own measured same-stack `DeltaLw`.
- Current UBIQ open-web rows remain exact rows or calibration anchors
  only; they do not own the formula input set required for lab `DeltaLw`
  residual tightening.
- Product-catalog `DeltaLw`, Annex-C or companion-inferred `DeltaLw`,
  and field/ASTM/building-basis improvement values are executable
  rejections for lab formula residual tightening.
- Accepted measured `DeltaLw` holdout count remains zero, so runtime
  values and residual retune permission stay held.

## Validation

Validation completed on 2026-05-07:

- Gate AK focused engine contract passed 1 file / 5 tests;
- engine typecheck passed;
- full `pnpm calculator:gate:current` passed with engine 317 files /
  1798 tests, web 65 files / 284 passed + 18 skipped, repo build 5/5
  tasks, and whitespace guard clean;
- `git diff --check` passed.

Known non-fatal warnings remain the Node/Vitest Zustand persist storage
warning and optional `sharp` / `@img` Next build warnings via the DOCX
export dependency.

## Next

Gate AL should acquire or encode the first real source-owned measured
same-stack lab `DeltaLw` holdout packet for the steel-floor formula lane.
Do not count a row unless the Gate AK owner fields are source-owned, and
do not use product-only, inferred, field, ASTM, or building-basis values
to tighten the lab `DeltaLw` residual corridor.
