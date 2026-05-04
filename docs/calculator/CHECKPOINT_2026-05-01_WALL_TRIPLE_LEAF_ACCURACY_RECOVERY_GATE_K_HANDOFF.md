# Checkpoint - Wall Triple-Leaf Accuracy Recovery Gate K Handoff

Date: 2026-05-01

Slice: `wall_triple_leaf_accuracy_recovery_v1`

Gate: K

Status: LANDED / RUNTIME-PROMOTION READINESS / NO RUNTIME

Gate K status:

`gate_k_blocked_runtime_promotion_no_runtime_selected_source_gap_closure_gate_l`

Next implementation file:

`packages/engine/src/wall-triple-leaf-source-gap-closure-gate-l.test.ts`

## Decision

Gate K adds the executable runtime-promotion readiness decision for the
user-reported triple-leaf / rockwool reorder defect. It does not move
runtime numbers, support status, confidence, evidence tier, API shape,
output-card status/value, route-card values, workbench behavior, or
proposal/report metric claims.

The Gate K contract is:

`packages/engine/src/wall-triple-leaf-runtime-promotion-readiness-gate-k.test.ts`

The Gate K decision model is:

`packages/engine/src/wall-triple-leaf-runtime-promotion-readiness.ts`

Runtime promotion remains blocked and the solver stays fail-closed on
`multileaf_screening_blend`.

## Passed Readiness Inputs

Gate K confirms the following prerequisites are already available for
the complete grouped split-rockwool test stack:

- executable NRC-like source curves from Gate G2B;
- Gate G3 calibration / holdout fit and protected negative boundaries;
- complete grouped wall topology for the user split-rockwool stack;
- Gate J company-internal acceptance rehearsal coverage.

These are necessary but not sufficient for exact runtime.

## Runtime Blockers

Gate K keeps promotion blocked because the following prerequisites are
still open together:

- local material mapping is unowned for generic `gypsum_board`,
  `rockwool`, `mlv`, `gypsum_plaster`, local support, and local cavity
  substitutions;
- no usable local source-pack candidate has source rows, metric context,
  and tolerance ownership ready for runtime;
- Gate G8 source gaps remain open for local Type C board mapping,
  rockwool/mineral-wool equivalence, two local `50 mm` rockwool
  cavities, MLV, gypsum plaster, and support gauge/depth/spacing;
- Gate G9 topology guards exist but are not runtime-promotion ready for
  route flips and duplicate-stack hostile inputs;
- paired engine and web visible runtime tests for the promoted path do
  not exist yet.

The readiness decision is:

`runtime_promotion_blocked_select_source_gap_closure`

## Gate L Selection

Gate K selects source-gap closure as the next bounded step:

`packages/engine/src/wall-triple-leaf-source-gap-closure-gate-l.test.ts`

Gate L should decide which of the open source gaps can be closed from
currently available evidence and which must remain blocked. Runtime
must stay frozen unless Gate L or a later gate proves all local
material/source-pack/tolerance/topology/test prerequisites together.

Gate L should carry forward these closure tracks:

- `local_type_c_board_product_mapping`;
- `rockwool_absorber_equivalence_or_measured_row`;
- `local_50mm_rockwool_cavity_source_row`;
- `mlv_limp_mass_triple_leaf_effect_model`;
- `gypsum_plaster_face_finish_effect_model`;
- `support_gauge_depth_and_spacing_mapping`.

## Runtime Hold

The live split-rockwool PDF repro remains low-confidence
`multileaf_screening_blend` `Rw 41`. Gate K proves why the promoted
path is blocked; it does not prove that `Rw 41` is correct.

Do not present the current answer as fixed or validated. It is still a
fail-closed screening result with explicit diagnostics.

## Validation

Focused Gate K validation:

- `pnpm --filter @dynecho/engine exec vitest run src/wall-triple-leaf-runtime-promotion-readiness-gate-k.test.ts --maxWorkers=1`
  green on 2026-05-01: 1 file / 7 tests.
- `pnpm --filter @dynecho/engine lint`
  green on 2026-05-01.
- `pnpm --filter @dynecho/web exec vitest run features/workbench/wall-triple-leaf-company-internal-acceptance-rehearsal.test.ts --maxWorkers=1`
  green on 2026-05-01 after preserving the prior Gate J handoff
  status while adding Gate K/Gate L state: 1 file / 7 tests.

Current-gate validation:

- `pnpm calculator:gate:current`
  green on 2026-05-01 after adding Gate K to the current runner:
  engine 179 files / 932 tests, web 47 files / 227 passed + 18
  skipped, build 5/5 with the known non-fatal `sharp/@img` warnings,
  whitespace guard clean.
