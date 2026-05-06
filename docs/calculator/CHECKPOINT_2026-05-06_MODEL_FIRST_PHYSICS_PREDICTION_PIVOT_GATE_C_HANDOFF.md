# Checkpoint - 2026-05-06 Model-First Physics Prediction Pivot Gate C

Status: landed no-runtime.

Slice:

`calculator_model_first_physics_prediction_pivot_v1`

Landed Gate C file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-c-rating-adapter-contract.test.ts`

Landed Gate C action:

`gate_c_inventory_rating_adapter_integrity_without_value_movement`

Selection status:

`gate_c_rating_adapter_integrity_landed_no_runtime_selected_input_completeness_gate_d`

Selected next file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-d-input-completeness-contract.test.ts`

Selected next action:

`gate_d_define_physical_input_completeness_needs_input_matrix_without_value_movement`

## What Landed

Gate C added a shared optional rating-adapter ownership surface without
moving calculator values:

- `packages/shared/src/domain/rating-adapter.ts` defines rating adapter
  ids, metric family, context basis, input basis, rating standards,
  implementation status, alias blocks, and inventory validation.
- `AssemblyCalculationSchema` now accepts optional
  `ratingAdapterBasisSet` metadata.
- The Gate C contract inventories ISO 717-1, ISO 717-2, ASTM E413, and
  ASTM E989 lanes before runtime movement.
- `Rw`/`STC`, `Ln,w`/`IIC`, airborne/impact, and lab/field aliasing are
  schema-rejected instead of left to convention.
- ASTM E989/IIC is explicitly recorded as
  `planned_not_implemented` until a real runtime adapter or exact source
  owner exists.
- Current Rockwool runtime values remain frozen:
  adjacent Rockwool stays `Rw 51` / `STC 51`; grouped split Rockwool
  stays `Rw 41` / `STC 41` on `multileaf_screening_blend`.

## Runtime Boundaries

No numeric runtime behavior moved. Support buckets, confidence,
evidence, route-card values, output-card statuses, proposal/report copy,
and workbench input behavior remain frozen.

Gate C is not a rating retune. It is a basis/ownership gate so future
family-physics predictions can expose calculated curves and
single-number ratings without silently converting `Rw` to `STC`, `Ln,w`
to `IIC`, lab values to field values, or field values to lab exact rows.

## Next Step

Implement Gate D:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-d-input-completeness-contract.test.ts`

`gate_d_define_physical_input_completeness_needs_input_matrix_without_value_movement`

Gate D should define minimum physical input requirements for:

- single leaf / massive airborne prediction;
- double leaf / framed / cavity prediction;
- triple leaf / multi-cavity prediction;
- porous fill assumptions;
- floating-floor impact prediction;
- field/apparent room and building-prediction outputs.

The key rule remains: source absence blocks exact/calibration promotion
only; missing physical route inputs produce `needs_input`.

## Validation

Validation completed on 2026-05-06:

- Focused Gate C passed 1 file / 6 tests.
- Focused Gate A + Gate B + Gate C continuity passed 3 files / 17
  tests.
- `pnpm calculator:gate:current` passed with engine 284 files / 1604
  tests, web 61 files / 273 passed + 18 skipped, repo build 5 / 5
  tasks, and whitespace guard green.
- Broad `pnpm check` passed with lint/typecheck clean, engine 409 files
  / 2406 tests, web 166 files / 936 passed + 18 skipped, and repo
  build 5 / 5 tasks.
- Final `git diff --check` passed after the Gate C validation notes and
  `apps/web/next-env.d.ts` restoration.

Known non-fatal warnings remain the optional `sharp/@img` packages
through `@turbodocx/html-to-docx` during the Next build. The Next build
rewrote `apps/web/next-env.d.ts` to `.next/types`; it was restored to
the repo's `.next-typecheck` reference after both build validations.

Run `pnpm check` if later edits touch broad shared schema, app routes, or
visible runtime behavior beyond this no-runtime Gate C surface.
