# Checkpoint - 2026-05-06 Model-First Physics Prediction Pivot Gate D

Slice:
`calculator_model_first_physics_prediction_pivot_v1`

Landed Gate D file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-d-input-completeness-contract.test.ts`

Landed Gate D action:

`gate_d_define_physical_input_completeness_needs_input_matrix_without_value_movement`

Selection status:

`gate_d_input_completeness_matrix_landed_no_runtime_selected_airborne_candidate_resolver_gate_e`

Selected next file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-e-airborne-candidate-resolver-contract.test.ts`

Selected next action:

`gate_e_define_airborne_candidate_resolver_selected_rejected_candidates_without_value_movement`

## What Landed

Gate D added a shared optional physical-input completeness surface
without populating runtime results yet:

- new shared schema file:
  `packages/shared/src/domain/input-completeness.ts`;
- new optional `inputCompletenessSet` metadata on
  `AssemblyCalculationSchema`;
- shared export from `packages/shared/src/index.ts`;
- focused Gate D contract added to the current-gate runner.

The schema names the minimum input families required before later
physics predictions are allowed to move values:

- single-leaf airborne;
- double-leaf / framed airborne;
- triple-leaf / multicavity airborne;
- porous-fill cavity modifier;
- floating-floor impact;
- field/apparent output context.

The contract proves the important separation:

- missing exact/source evidence blocks exact or calibration promotion
  only;
- missing physical topology, geometry, material, field, or impact input
  produces `needs_input`;
- optional precision gaps such as modulus, loss factor, flow
  resistivity, or absorber class can widen uncertainty only when a
  documented default policy exists;
- every `needs_input` object names UI-actionable missing fields;
- current Rockwool runtime values remain frozen.

## Runtime Boundaries

No runtime values, support buckets, confidence, evidence, route cards,
output cards, proposal/report copy, or workbench input behavior moved in
Gate D.

Protected values remain:

- adjacent Rockwool lab remains `Rw 51` / `STC 51`;
- grouped split Rockwool remains `Rw 41` / `STC 41` through
  `multileaf_screening_blend`;
- direct exact Rockwool promotion remains blocked by
  `rights_safe_source_owned_curve_payload_absent`;
- that source blocker still must not block a later labelled
  `family_physics_prediction` when Gate E and M6 deliberately enable it.

## Next Step

Gate E is next. It must define the airborne candidate resolver that
collects exact full-stack rows, exact subassembly anchors plus
calculated deltas, calibrated family-physics candidates, uncalibrated
family-physics predictions, bounded/screening fallbacks, and
`needs_input` candidates. It must return selected and rejected
candidates so tests can prove why a better-looking candidate was blocked
or rejected.

Gate E must remain no-runtime unless its contract explicitly says
otherwise. The first runtime prediction movement remains grouped
Rockwool triple-leaf M6/Gate G after the resolver and stop rules are in
place.

## Validation

Validation completed on 2026-05-06:

- Focused Gate D passed 1 file / 7 tests.
- Focused Gate A + Gate B + Gate C + Gate D continuity passed 4 files /
  24 tests.
- `pnpm calculator:gate:current` passed with engine 285 files / 1611
  tests, web 61 files / 273 passed + 18 skipped, repo build 5 / 5
  tasks, and whitespace guard green.
- Broad `pnpm check` passed with lint/typecheck clean, engine 410 files
  / 2413 tests, web 166 files / 936 passed + 18 skipped, and repo
  build 5 / 5 tasks.
- Final `git diff --check` passed after the Gate D validation notes.

Known non-fatal warnings remain the optional `sharp/@img` packages
through `@turbodocx/html-to-docx` during the Next build. The Next build
can rewrite `apps/web/next-env.d.ts` to `.next/types`; it is clean at
handoff and remains on the repo's `.next-typecheck` reference.
