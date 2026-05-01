# Slice Plan - Calculator Source Gap Revalidation v7

Slice id: `calculator_source_gap_revalidation_v7`

Status: GATE A LANDED / NO RUNTIME MOVEMENT (selected 2026-04-30 by
`packages/engine/src/post-steel-stud-knauf-enpc-mapping-tolerance-v1-next-slice-selection-contract.test.ts`;
Gate A landed 2026-04-30 in
`packages/engine/src/calculator-source-gap-revalidation-v7-gate-a-contract.test.ts`).

Prior selection status from EN-PC Gate C:

`closed_enpc_mapping_tolerance_no_runtime_and_selected_source_gap_revalidation_v7_because_all_concrete_knauf_mapping_rows_lack_exact_material_metric_tolerance_ownership`

Latest checkpoint:
[CHECKPOINT_2026-04-30_CALCULATOR_SOURCE_GAP_REVALIDATION_V7_GATE_A_HANDOFF.md](./CHECKPOINT_2026-04-30_CALCULATOR_SOURCE_GAP_REVALIDATION_V7_GATE_A_HANDOFF.md)
lands v7 no-runtime and selects
`calculator_post_knauf_source_acquisition_v1`.

Selection status:

`selected_post_knauf_source_acquisition_v1_after_v7_rerank_found_no_runtime_ready_candidate_and_current_sources_exhausted`

Selected next slice:

`calculator_post_knauf_source_acquisition_v1`

Next selected file:

`packages/engine/src/calculator-post-knauf-source-acquisition-gate-a-contract.test.ts`

## Objective

Re-rank the current source / accuracy backlog after all concrete Knauf
mapping rows have closed no-runtime:

- `TB.5A`;
- `MWI.2A`;
- `TTF30.2A`;
- `EN-PC-50-055-6-2-12.5-WB-25`.

This is a no-runtime revalidation slice unless Gate A proves a
source-ready runtime candidate exists.

## Current Posture

No concrete Knauf row is runtime-ready:

- `TB.5A` lacks exact material, metric, tolerance, and visible-test
  ownership.
- `MWI.2A` lacks exact material, metric, tolerance, and visible-test
  ownership.
- `TTF30.2A` lacks exact material, metric, tolerance, and visible-test
  ownership.
- `EN-PC-50-055-6-2-12.5-WB-25` lacks exact material, metric,
  tolerance, and visible-test ownership.

Remaining Knauf rows are context only:

- `AAC.1A` remains AAC / steel-frame adjacent context.
- `TSF120.1A` remains staggered timber adjacent context.
- `TO120.1A` remains a one-side-lined negative boundary.

Non-Knauf source-gated families still need fresh ranking against this
post-Knauf state: CLT / mass-timber, generated floor fallback,
no-stud double-leaf, lined-heavy / heavy-core, and historical blocked
families.

## Gate A - Source Gap Revalidation v7 Decision

Gate A added:

`packages/engine/src/calculator-source-gap-revalidation-v7-gate-a-contract.test.ts`

Required records:

1. Post-Knauf closeout summary for `TB.5A`, `MWI.2A`, `TTF30.2A`, and
   `EN-PC-50-055-6-2-12.5-WB-25`.
2. Remaining Knauf adjacent / negative row re-rank:
   `AAC.1A`, `TSF120.1A`, and `TO120.1A`.
3. Cross-family re-rank for CLT / mass-timber, generated floor
   fallback, no-stud double-leaf, lined-heavy / heavy-core, historical
   blocked families, internal-use evidence, and productization-only
   work.
4. Runtime readiness matrix with:
   - exact topology;
   - metric owner and lab / field context;
   - tolerance owner;
   - local material / thickness mapping;
   - protected negative boundaries;
   - paired engine tests;
   - paired web visible tests.
5. Selected next slice and target first-gate file.
6. Frozen-surface assertion for runtime, support, confidence,
   evidence, API, route-card, output-card, proposal/report, output
   support, and workbench-input behavior.

Gate A result:

- no runtime import, support promotion, confidence promotion, evidence
  promotion, API movement, route-card movement, output-card movement,
  proposal/report movement, or workbench-input movement is selected;
- every concrete Knauf mapping row remains no-runtime;
- remaining Knauf rows stay adjacent / negative context;
- CLT / mass-timber, generated floor fallback, no-stud double-leaf,
  lined-heavy / heavy-core, and historical blocked families still lack
  complete source-ready runtime prerequisites;
- the next no-runtime slice is
  `calculator_post_knauf_source_acquisition_v1`.

Selected next file:

`packages/engine/src/calculator-post-knauf-source-acquisition-gate-a-contract.test.ts`

Gate A selection status:

`selected_post_knauf_source_acquisition_v1_after_v7_rerank_found_no_runtime_ready_candidate_and_current_sources_exhausted`

## Frozen Surfaces

Until Gate A names a fully source-ready runtime candidate, all of
these surfaces stay frozen:

- runtime;
- support;
- confidence;
- evidence;
- API;
- route-card;
- output-card;
- proposal/report;
- workbench-input.

## Acceptance Rules

Gate A may select runtime work only if it names all of:

- exact source row, exact topology, or bounded family/formula rule;
- metric owner and lab / field context;
- tolerance owner;
- local material/thickness mapping to engine inputs;
- protected negative boundaries and near misses;
- paired engine value tests and web route-card / report tests.

If any one of these is missing, Gate A remains no-runtime and selects
source acquisition, extraction, mapping, validation, or revalidation
work instead.

## Validation

Baseline before v7:

- `pnpm calculator:gate:current`: green on 2026-04-30 after EN-PC Gate
  C closed this slice, engine 158 files / 791 tests, web 45 files /
  216 passed + 18 skipped, build 5/5 with known non-fatal
  `sharp/@img` warnings, whitespace guard clean.

Gate A validation completed on 2026-04-30:

- `pnpm --filter @dynecho/engine exec vitest run src/calculator-source-gap-revalidation-v7-gate-a-contract.test.ts --maxWorkers=1`:
  1 file / 8 tests passed.
- `pnpm --filter @dynecho/engine exec vitest run src/steel-stud-knauf-enpc-mapping-tolerance-gate-a-contract.test.ts src/post-steel-stud-knauf-enpc-mapping-tolerance-v1-next-slice-selection-contract.test.ts src/calculator-source-gap-revalidation-v7-gate-a-contract.test.ts --maxWorkers=1`:
  3 files / 21 tests passed after preserving historical EN-PC doc
  sync tokens.
- `pnpm calculator:gate:current`: green, engine 159 files / 799 tests,
  web 45 files / 216 passed + 18 skipped, build 5/5 with known
  non-fatal `sharp/@img` warnings, whitespace guard clean.
- `git diff --check`: clean.

Run `pnpm check` only if Gate A selects any runtime import, support /
confidence / evidence promotion, API movement, route-card movement,
output-card movement, proposal/report copy movement, output-support
movement, or workbench-input behavior movement.
