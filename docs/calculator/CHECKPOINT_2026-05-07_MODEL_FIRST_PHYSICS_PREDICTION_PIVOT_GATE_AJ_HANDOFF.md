# Checkpoint - 2026-05-07 - Model-First Physics Prediction Pivot Gate AJ

## Scope

Gate AJ lands the steel-floor formula negative-boundary and measured
`DeltaLw` holdout-intake gate inside
`calculator_model_first_physics_prediction_pivot_v1`.

This is still a calculator-first slice. It does not gather a broad source
catalog and it does not retune runtime values. It makes the next
accuracy gate stricter by naming which negative cases protect the
steel-floor formula lane and which `DeltaLw` values can count as
measured residual holdouts.

## Landed

Gate AJ landed file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-aj-steel-floor-formula-negative-boundary-and-delta-lw-holdout-contract.test.ts`

Gate AJ landed action:

`gate_aj_steel_floor_formula_negative_boundaries_and_delta_lw_holdout_intake_plan`

Selection status:

`gate_aj_steel_formula_negative_boundary_delta_lw_intake_landed_selected_source_owned_delta_lw_gate_ak`

Selected next file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ak-steel-floor-formula-source-owned-delta-lw-holdout-contract.test.ts`

Selected next action:

`gate_ak_steel_floor_formula_source_owned_delta_lw_holdout_acquisition_plan`

## Behavior

- Four paired negative boundaries now protect the steel-floor formula
  lane before any later retune/tighten step: wrong support family, exact
  measured row precedence, lab-to-field/building basis leakage, and
  source-absent design references.
- The Gate AI residual policy can now be evaluated with paired negatives
  present, so `paired_negative_boundaries_missing` is removed from the
  current `Ln,w` and `DeltaLw` metric blockers.
- Runtime values still do not move. `Ln,w` remains held because the
  evidence set is still below the holdout threshold and lacks
  source-owned open-web formula inputs plus field/building basis owners.
  `DeltaLw` remains held because accepted measured lab holdout count is
  still zero.
- Product-catalog `DeltaLw`, Annex-C or companion-inferred `DeltaLw`,
  and field/ASTM/building-basis improvement values are rejected for lab
  formula residual tightening.
- UBIQ open-web rows remain exact rows or calibration anchors until
  carrier spacing, load basis, dynamic stiffness, lower support class,
  and upper-resilient topology are source-owned.

## Validation

Focused validation completed on 2026-05-07:

- Gate AJ engine contract passed 1 file / 5 tests;
- engine typecheck passed;
- full `pnpm calculator:gate:current` passed with engine 316 files /
  1793 tests, web 65 files / 284 passed + 18 skipped, repo build 5/5
  tasks, and whitespace guard clean.

Known non-fatal warnings remain the Node/Vitest Zustand persist storage
warning and optional `sharp` / `@img` Next build warnings via the DOCX
export dependency.

## Next

Gate AK should acquire or encode source-owned measured same-stack lab
`DeltaLw` holdout candidates for the steel-floor formula lane. A row
cannot count until metric value, topology/support family, carrier
spacing, load basis, dynamic stiffness, lower support class,
upper-resilient topology, and paired negative owner are source-owned.

Do not use product-only, inferred, field, ASTM, or building-basis values
to tighten the lab `DeltaLw` residual corridor.
