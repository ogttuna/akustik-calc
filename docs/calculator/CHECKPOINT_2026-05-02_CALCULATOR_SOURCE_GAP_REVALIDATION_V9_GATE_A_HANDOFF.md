# Checkpoint - 2026-05-02 - Calculator Source Gap Revalidation v9 Gate A

Slice: `calculator_source_gap_revalidation_v9`

Gate landed:

`gate_a_revalidate_source_accuracy_gap_order_after_british_gypsum_source_pack_closeout`

Status:

`selected_post_british_gypsum_source_acquisition_v1_after_v9_rerank_found_no_runtime_ready_candidate_and_british_gypsum_closed_no_runtime`

Selected next slice:

`calculator_post_british_gypsum_source_acquisition_v1`

Selected next action:

`gate_a_acquire_and_classify_post_british_gypsum_source_locators_without_runtime_import`

Selected next file:

`packages/engine/src/calculator-post-british-gypsum-source-acquisition-gate-a-contract.test.ts`

Implementation artifact:

`packages/engine/src/calculator-source-gap-revalidation-v9-gate-a-contract.test.ts`

Selected planning surface:

`docs/calculator/SLICE_CALCULATOR_POST_BRITISH_GYPSUM_SOURCE_ACQUISITION_V1_PLAN.md`

## Summary

Gate A re-ranks the source and accuracy backlog after British Gypsum
Gate B / Gate C closed no-runtime.

It does not select runtime import, value movement, support promotion,
confidence promotion, evidence promotion, output support movement, API
movement, route-card movement, output-card movement, proposal/report
copy movement, or workbench-input behavior movement.

Because the Uris 2006 source lane is still paused, British Gypsum rows
are closed no-runtime, Knauf rows remain closed, and the remaining
family candidates still lack exact topology / metric / tolerance /
material / visible-test ownership, Gate A selects a fresh
post-British-Gypsum source acquisition pass.

## Rerank Evidence

- `wall_triple_leaf_uris_2006_source_packet_lane`: real user defect,
  but still paused on `paused_waiting_rights_safe_source_packet`.
- `closed_british_gypsum_rows_reopen`: `C204006`, `C204003`,
  `A206A290`, `A046006`, `A326017B`, and `B226010` are closed
  no-runtime after Gate B and Gate C.
- `closed_knauf_mapping_chain_reopen`: recent Knauf `TB.5A`, `MWI.2A`,
  `TTF30.2A`, and `EN-PC-50-055-6-2-12.5-WB-25` decisions remain
  closed no-runtime.
- `clt_mass_timber_generated_floor_and_lined_heavy_followups`: still
  high-value but missing exact source / metric / tolerance / material /
  visible-test ownership.
- `historical_blocked_or_productization_only_work`: does not improve
  calculator accuracy or coverage before new source truth exists.

## Rockwool Defect Posture

This gate still does not fix or retune the original rockwool reorder /
triple-leaf defect. The split-rockwool wall answer remains
low-confidence `multileaf_screening_blend` (`Rw 41`) and must not be
presented as fixed, correct, or source-validated.

## Frozen Surfaces

- runtime;
- support;
- confidence;
- evidence;
- API;
- route-card;
- output-card;
- proposal/report;
- workbench-input.

## Next Step

Implement:

`packages/engine/src/calculator-post-british-gypsum-source-acquisition-gate-a-contract.test.ts`

with:

`gate_a_acquire_and_classify_post_british_gypsum_source_locators_without_runtime_import`

Gate A must acquire and classify fresh official locators or rights-safe
source packets. It may only select runtime work if exact topology,
metric owner, tolerance owner, local material mapping, protected
negative boundaries, and paired engine/web visible tests are named
together.

## Validation

Validation completed for this checkpoint on 2026-05-02:

- `pnpm --filter @dynecho/engine exec vitest run src/calculator-source-gap-revalidation-v9-gate-a-contract.test.ts --maxWorkers=1`
- `pnpm --filter @dynecho/engine exec vitest run src/calculator-source-gap-revalidation-v9-gate-a-contract.test.ts src/post-british-gypsum-white-book-source-pack-extraction-v1-next-slice-selection-contract.test.ts src/british-gypsum-white-book-source-pack-extraction-gate-b-contract.test.ts src/calculator-source-gap-revalidation-v8-gate-a-contract.test.ts --maxWorkers=1`
- `pnpm calculator:gate:current`
- `git diff --check`

Observed no-runtime gate shape after adding v9 Gate A to the current
runner: focused v9 Gate A 1 file / 8 tests; v9 / Gate C / Gate B / v8
continuity 4 files / 30 tests; current-gate engine 192 files / 1025
tests, web 47 files / 227 passed + 18 skipped, build 5/5 with known
non-fatal `sharp/@img` warnings, and whitespace guard clean.

Run `pnpm check` only if a later gate selects runtime import, support /
confidence / evidence promotion, API movement, route-card movement,
output-card movement, proposal/report copy movement, output-support
movement, or workbench-input behavior movement.
