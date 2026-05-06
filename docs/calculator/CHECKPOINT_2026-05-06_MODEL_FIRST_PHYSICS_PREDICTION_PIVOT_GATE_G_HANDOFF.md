# Checkpoint - 2026-05-06 Model-First Physics Prediction Pivot Gate G

Slice: `calculator_model_first_physics_prediction_pivot_v1`

Landed gate:

`gate_g_promote_grouped_rockwool_triple_leaf_family_physics_prediction_with_benchmarks`

Landed file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-g-grouped-rockwool-prediction-contract.test.ts`

Selection status:

`gate_g_grouped_rockwool_family_physics_prediction_landed_selected_source_calibration_gate_h`

Selected next file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-h-source-calibration-exact-promotion-contract.test.ts`

Selected next action:

`gate_h_calibrate_sources_and_exact_promotion_without_deleting_physics_solver`

## What Changed

Gate G is the first deliberate model-first runtime prediction movement.
The explicit grouped Rockwool triple-leaf wall topology now selects the
family-physics lane:

- strategy:
  `triple_leaf_two_cavity_frequency_solver_family_physics_prediction`
- selected method: `triple_leaf_two_cavity_frequency_solver`
- origin: `family_physics_prediction`
- kind: `airborne_physics_prediction`
- calculation standard:
  `engine_triple_leaf_two_cavity_frequency_solver`
- rating standard: `ISO 717-1`
- tolerance: `uncalibrated_prediction`, `errorBudgetDb: 5`

The reference grouped stack with two 50 mm full porous Rockwool cavities
and an internal gypsum leaf now returns:

- lab: `Rw 50 / STC 55 / C 0.8 / Ctr -7.3`
- building prediction reference room:
  `R'w 50 / DnT,w 51 / DnT,A 51.3 / Dn,w 50 / Dn,A 49.8`

This is not measured exact, not source-validated, and not design-grade.
Missing source evidence rejects exact and calibrated candidates only; it
does not reject the formula-backed prediction candidate.

## Guardrails Preserved

- Flat-list split/internal gypsum-leaf Rockwool remains guarded and
  unsupported for target outputs until grouped topology is supplied. The
  diagnostic remains `Rw 41` on `multileaf_screening_blend`.
- Exact/source-validated promotion remains blocked by
  `rights_safe_source_owned_curve_payload_absent`.
- Incomplete grouped topology does not fake solver promotion; it stays
  on the screening path and asks for missing topology inputs.
- Field/building outputs still travel through the field overlay instead
  of collapsing to lab `Rw`.

## Implementation Surfaces

- `packages/engine/src/dynamic-airborne.ts`
  - adds the narrow Gate G grouped Rockwool solver lane.
  - emits basis, candidate set, and selected/rejected resolver metadata.
- `packages/engine/src/dynamic-airborne-helpers.ts`
  - allows dynamic airborne results to carry airborne basis/candidate
    metadata.
- `packages/engine/src/calculate-assembly.ts`
  - passes runtime-populated airborne basis/candidate metadata into
    `AssemblyCalculation`.
- `packages/shared/src/domain/dynamic-airborne.ts`
  - adds `triple_leaf_two_cavity_frequency_solver` as a trace delegate
    method.
- `packages/shared/src/domain/airborne-basis.ts`
  - allows `runtimeValueMovement: true` on resolver metadata.

## Next Step

Gate H must calibrate sources and exact promotion without deleting or
weakening the Gate G formula-backed prediction lane. Source rows may
promote exact or calibrated results only when they have rights-safe
evidence, exact topology/material/metric ownership, tolerance ownership,
and paired positive/negative tests.
