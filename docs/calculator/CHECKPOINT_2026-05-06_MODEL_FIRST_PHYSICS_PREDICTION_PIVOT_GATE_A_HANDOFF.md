# Checkpoint: Model-First Physics Prediction Pivot Gate A Handoff

Date: 2026-05-06

Status: Gate A landed; no runtime behavior changed.

## Landed Artifact

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-a-contract.test.ts`

Landed status:

`gate_a_model_first_direction_contract_landed_no_runtime_selected_basis_gate_b`

Landed action:

`gate_a_defined_model_first_candidate_basis_and_benchmark_acceptance_no_runtime`

Selected next file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-b-basis-contract.test.ts`

Selected next action:

`gate_b_define_shared_airborne_basis_candidate_schema_without_value_movement`

Active slice:

`calculator_model_first_physics_prediction_pivot_v1`

## What Gate A Locked

Gate A made the corrected model-first rule executable:

- source absence blocks exact/source-validated/calibration promotion
  only;
- source absence is not formula absence;
- physical topology/input absence is separate and can become
  `needs_input`;
- a complete grouped Rockwool triple-leaf topology remains the first
  runtime prediction benchmark, but not an exact/source-validated claim.

Gate A named the first-class airborne candidate origins:

- `measured_exact_full_stack`
- `measured_exact_subassembly_plus_calculated_delta`
- `calibrated_family_physics`
- `family_physics_prediction`
- `bounded_prediction`
- `screening_fallback`
- `needs_input`
- `unsupported`

Gate A named the required future basis fields:

- `measurementStandard`
- `calculationStandard`
- `ratingStandard`
- `frequencyBands`
- `curveBasis`
- `errorBudgetDb`
- `toleranceClass`
- `propertyDefaults`
- `missingSourceEvidence`
- `missingPhysicalInputs`

Gate A also locked the B0-B12 benchmark acceptance lanes and runtime stop
rules from:

`docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_BENCHMARK_ACCEPTANCE_HANDOFF.md`

## Runtime Posture

No calculator values moved.

- adjacent Rockwool remains supported at `Rw 51 / R'w 49 / DnT,w 51`;
- split/internal Rockwool remains `multileaf_screening_blend`, low
  confidence, and withheld from supported exact outputs;
- grouped/split Rockwool remains `Rw 41` screening until M6 deliberately
  promotes grouped topology to `family_physics_prediction`;
- exact/source-validated Rockwool promotion remains blocked until source
  rows own topology, material mapping, metric, tolerance,
  negative-boundary, calibration/holdout, and visible-test scope.

## Gate B Scope

Gate B must add the shared airborne basis/candidate schema without moving
numeric runtime values, support buckets, confidence, route cards, output
cards, proposal/report copy, or workbench input behavior.

Gate B must prove:

- exact/catalog rows can carry measurement and rating basis metadata;
- formula-backed prediction candidates can carry calculation and rating
  basis metadata;
- `missingSourceEvidence` and `missingPhysicalInputs` are different
  fields;
- non-exact candidate surfaces can carry `errorBudgetDb` or
  `toleranceClass`;
- current Rockwool runtime values remain frozen until M6.

## Validation

Handoff validation passed on 2026-05-06:

- focused Gate A contract passed: 1 file / 5 tests;
- focused V28 history plus Gate A continuity passed: 2 files / 10 tests;
- `pnpm calculator:gate:current` passed with engine 282 files / 1592
  tests, web 61 files / 273 passed + 18 skipped, repo build 5 / 5
  tasks, and whitespace guard green;
- `git diff --check` passed;
- trailing-whitespace scan over active authority docs, current-gate
  runner, and Gate A file passed.

Known non-fatal `sharp/@img` warnings remain through
`@turbodocx/html-to-docx`.
