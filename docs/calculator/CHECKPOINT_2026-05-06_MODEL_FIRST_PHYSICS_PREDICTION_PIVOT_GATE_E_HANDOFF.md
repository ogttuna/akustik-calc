# Checkpoint - 2026-05-06 Model-First Physics Prediction Pivot Gate E

Slice:
`calculator_model_first_physics_prediction_pivot_v1`

Landed Gate E file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-e-airborne-candidate-resolver-contract.test.ts`

Landed Gate E action:

`gate_e_define_airborne_candidate_resolver_selected_rejected_candidates_without_value_movement`

Selection status:

`gate_e_airborne_candidate_resolver_landed_no_runtime_selected_grouped_rockwool_prediction_gate_g`

Selected next file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-g-grouped-rockwool-prediction-contract.test.ts`

Selected next action:

`gate_g_promote_grouped_rockwool_triple_leaf_family_physics_prediction_with_benchmarks`

## What Landed

Gate E added a no-runtime airborne candidate resolver contract and
optional shared metadata surface:

- `packages/shared/src/domain/airborne-basis.ts` now exports
  `AIRBORNE_CANDIDATE_RESOLVER_PRECEDENCE`,
  `AirborneCandidateResolutionSchema`, and resolver tie-breaker types;
- `AssemblyCalculationSchema` now accepts optional
  `airborneCandidateResolution` metadata;
- the focused Gate E contract is included in
  `tools/dev/run-calculator-current-gate.ts`.

The resolver contract pins the model-first candidate order:

1. measured exact full-stack row;
2. measured exact subassembly plus named calculated delta;
3. calibrated family-physics candidate;
4. uncalibrated `family_physics_prediction`;
5. bounded prediction;
6. screening fallback;
7. `needs_input`;
8. `unsupported`.

The selected candidate must be exactly one candidate and must not carry
rejection reasons. Every rejected candidate must explain whether it was
blocked by source evidence, blocked by physical inputs, lost to a
higher-precedence candidate, or lost a deterministic tie-breaker.

## Runtime Boundaries

No runtime values, support buckets, confidence, evidence, route cards,
output cards, proposal/report copy, or workbench input behavior moved in
Gate E.

Protected values remain:

- adjacent Rockwool lab remains `Rw 51` / `STC 51`;
- grouped split Rockwool remains `Rw 41` / `STC 41` through
  `multileaf_screening_blend`;
- direct exact Rockwool promotion remains blocked by
  `rights_safe_source_owned_curve_payload_absent`;
- source absence blocks exact/calibration promotion only and no longer
  justifies blocking a valid formula-backed prediction path once Gate G
  deliberately moves it.

## Next Step

Gate G is next. It is the first runtime prediction movement in this
pivot and should promote only the explicit grouped Rockwool triple-leaf
case to a labelled `family_physics_prediction`.

Gate G must:

- use the Gate B basis/candidate schema, Gate C rating-adapter basis,
  Gate D input-completeness matrix, and Gate E resolver semantics;
- keep exact/source-validated flags false;
- carry standards/rating basis, solver assumptions, and uncertainty;
- leave ambiguous flat-list triple-leaf stacks guarded as `needs_input`
  or screening/withheld according to the existing boundary tests.

## Validation

Validation completed on 2026-05-06:

- Focused Gate E passed 1 file / 8 tests.
- Focused Gate A + Gate B + Gate C + Gate D + Gate E continuity passed
  5 files / 32 tests.
- `pnpm calculator:gate:current` passed with engine 286 files / 1619
  tests, web 61 files / 273 passed + 18 skipped, repo build 5 / 5
  tasks, and whitespace guard green.
- Broad `pnpm check` passed with lint/typecheck clean, engine 411 files
  / 2421 tests, web 166 files / 936 passed + 18 skipped, and repo
  build 5 / 5 tasks.
- Final `git diff --check` passed after the Gate E validation notes.

Known non-fatal warnings remain the optional `sharp/@img` packages
through `@turbodocx/html-to-docx` during the Next build. The Next build
can rewrite `apps/web/next-env.d.ts` to `.next/types`; it is clean at
handoff and remains on the repo's `.next-typecheck` reference.
