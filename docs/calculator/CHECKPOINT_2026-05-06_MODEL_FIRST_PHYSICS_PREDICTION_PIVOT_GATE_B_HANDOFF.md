# Checkpoint: Model-First Physics Prediction Pivot Gate B Handoff

Date: 2026-05-06

Status: Gate B implemented and validated no-runtime. Runtime values,
support buckets, confidence, evidence, route-card values,
output-card statuses, proposal/report copy, and workbench input behavior
remain frozen.

## Landed Gate

Landed file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-b-basis-contract.test.ts`

Landed action:

`gate_b_defined_shared_airborne_basis_candidate_schema_without_value_movement`

Selection status:

`gate_b_shared_airborne_basis_candidate_schema_landed_no_runtime_selected_rating_adapter_gate_c`

Selected next file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-c-rating-adapter-contract.test.ts`

Selected next action:

`gate_c_inventory_rating_adapter_integrity_without_value_movement`

## What Changed

- Added shared airborne basis/candidate schemas in
  `packages/shared/src/domain/airborne-basis.ts`.
- Exported the schemas from `packages/shared/src/index.ts`.
- Added optional `airborneBasis` and `airborneCandidateSet` fields to
  `AssemblyCalculationSchema`.
- Added a focused Gate B contract test that proves legacy payloads still
  parse, exact/source candidates can carry measurement/rating basis,
  formula-backed candidates carry calculation/rating basis plus
  uncertainty, `missingSourceEvidence` and `missingPhysicalInputs` are
  separate, and Rockwool values remain frozen.
- Added Gate B to `tools/dev/run-calculator-current-gate.ts`.

## Protected Runtime Boundaries

- adjacent Rockwool remains `Rw 51 / R'w 49 / DnT,w 51`;
- grouped Rockwool remains `Rw 41` on `multileaf_screening_blend`;
- grouped Rockwool field continuation remains `R'w 34 / DnT,w 36`;
- flat-list ambiguous triple-leaf remains guarded;
- no exact/source-validated promotion landed;
- no runtime prediction movement landed.

## Next Step

Start Gate C. The target is rating-adapter integrity, not runtime value
movement. Gate C should inventory and pin ISO 717-1, ISO 717-2,
ASTM E413, and ASTM E989 paths, and prove `Rw`/`STC`, `Ln,w`/`IIC`,
lab, field, and building-prediction values cannot be silently aliased.

Gate C target:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-c-rating-adapter-contract.test.ts`

Gate C action:

`gate_c_inventory_rating_adapter_integrity_without_value_movement`

## Validation

Validation completed in this pass:

```sh
pnpm --filter @dynecho/engine exec vitest run src/calculator-model-first-physics-prediction-pivot-gate-a-contract.test.ts src/calculator-model-first-physics-prediction-pivot-gate-b-basis-contract.test.ts --maxWorkers=1
pnpm calculator:gate:current
git diff --check
```

Results:

- focused Gate A + Gate B passed: 2 files / 11 tests;
- `pnpm calculator:gate:current` passed:
  - engine: 283 files / 1598 tests;
  - web: 61 files / 273 passed + 18 skipped;
  - repo build: 5 / 5 tasks successful;
  - whitespace guard passed;
- known non-fatal `sharp/@img` optional package warnings remain through
  `@turbodocx/html-to-docx`.

Additional broad validation:

- `pnpm check` passed:
  - lint: 5 / 5 package tasks;
  - typecheck: 5 / 5 package tasks;
  - engine full test: 408 files / 2400 tests;
  - web full test: 166 files / 936 passed + 18 skipped;
  - build: 5 / 5 package tasks.
