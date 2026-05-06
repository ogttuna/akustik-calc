# Checkpoint - 2026-05-05 Model-First Physics Prediction Pivot Replan Handoff

Checkpoint type: read-only implementation analysis and plan correction.

Status:

`selected_model_first_physics_prediction_pivot_after_source_packet_path_found_too_narrow`

Selected slice:

`calculator_model_first_physics_prediction_pivot_v1`

Selected plan:

`docs/calculator/SLICE_CALCULATOR_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_V1_PLAN.md`

Selected Gate A file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-a-contract.test.ts`

Selected Gate A action:

`gate_a_define_airborne_candidate_basis_contract_without_runtime_movement`

## Why This Replan Exists

The user clarified that DynEcho must be an acoustic calculator first. A
missing source packet must not prevent calculation. It may only prevent
measured-exact/source-validated promotion.

The prior active plan selected
`rockwool_split_triple_leaf_rights_safe_source_packet_refresh_v2`. That
path is too narrow as the active next step because it keeps the Rockwool
triple-leaf issue waiting on exact source evidence instead of creating a
labelled physics-prediction path.

## Implementation Findings

- `calculateAssembly` already composes screening, dynamic airborne,
  verified catalog anchors, field companions, impact lanes, output
  support, and Rockwool withholding.
- `airborne-verified-catalog.ts` correctly supports full-stack exact
  source anchoring, but no partial-source-anchor plus calculated-delta
  candidate exists.
- `impact-lane.ts` has the closest correct precedence model: exact,
  bound, product, explicit delta, predictor, narrow formula, and broader
  estimate.
- `dynamic-airborne.ts` classifies `multileaf_multicavity`, but still
  selects `multileaf_screening_blend` instead of a real multi-cavity
  solver.
- `wall-triple-leaf-frequency-solver.ts` already produces a three-leaf
  two-cavity curve and ratings from grouped topology, but is marked
  research-only and runtime-ineligible.
- `wall-triple-leaf-engine-integration-fail-closed.ts` collapses
  source-exact promotion prerequisites and calculation prerequisites
  into one fail-closed path.
- shared airborne schemas do not yet expose a first-class output
  basis/origin equivalent to impact/floor basis semantics.

Read-only numeric probe:

- current grouped Rockwool dynamic path: `Rw 41`, `STC 41`,
  `multileaf_screening_blend`, low confidence.
- existing research triple-leaf solver on the same grouped topology:
  `Rw 50`, `STC 55`, finite leaf masses/cavities/resonances,
  `calculationBlocked: false`, `runtimeEligible: false`.

The probe is not a runtime change and does not make `Rw 50` exact. It
proves that a physics-prediction path is locally feasible and should be
made explicit.

## Corrected Decision

Active next work is now:

`calculator_model_first_physics_prediction_pivot_v1`

The source-packet refresh plan is retained only for later exact
source/calibration work. It is no longer the active next step.

## Carry-Forward Boundaries

- Exact/lab/source-backed promotion still requires source-owned topology,
  material mapping, metric context, tolerance, negative boundaries,
  calibration/holdout, and paired visible/report tests.
- Formula-backed prediction must not call itself exact or source-backed.
- Flat-list triple-leaf remains guarded when topology is ambiguous.
- Grouped triple-leaf should become the first wall airborne prediction
  benchmark because it has complete topology and exposes the current
  source-gate abstraction error.
- UBIQ packaged-finish current-gate ownership remains historical context
  and must not be broken by this pivot.

## Next Validation Expectations

Gate A is documentation/contract only and should run:

```sh
pnpm --filter @dynecho/engine exec vitest run src/calculator-model-first-physics-prediction-pivot-gate-a-contract.test.ts --maxWorkers=1
git diff --check
```

Runtime movement starts only after Gate A and shared basis/candidate
schema are in place.
