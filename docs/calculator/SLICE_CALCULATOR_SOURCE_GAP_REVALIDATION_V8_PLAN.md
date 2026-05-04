# Slice Plan - Calculator Source Gap Revalidation v8

Slice id: `calculator_source_gap_revalidation_v8`

Status: GATE A LANDED / NO RUNTIME MOVEMENT (selected 2026-05-02 by
`wall_triple_leaf_accuracy_recovery_v1` Gate T after the Uris 2006
source lane was paused on `paused_waiting_rights_safe_source_packet`).
Post-v8 update: British Gypsum Gate B landed no-runtime on 2026-05-02
with
`british_gypsum_gate_b_found_no_new_runtime_ready_row_kept_a046006_existing_anchor_and_selected_closeout`
and selected
`packages/engine/src/post-british-gypsum-white-book-source-pack-extraction-v1-next-slice-selection-contract.test.ts`
with `gate_c_closeout_and_next_slice_selection_no_runtime`.

Prior selection status from Gate T:

`gate_t_paused_uris_2006_source_lane_no_runtime_selected_source_gap_revalidation_v8`

Latest checkpoint:

[CHECKPOINT_2026-05-02_CALCULATOR_SOURCE_GAP_REVALIDATION_V8_GATE_A_HANDOFF.md](./CHECKPOINT_2026-05-02_CALCULATOR_SOURCE_GAP_REVALIDATION_V8_GATE_A_HANDOFF.md)
lands v8 no-runtime and selects
`british_gypsum_white_book_source_pack_extraction_v1`.

Selection status:

`selected_british_gypsum_gate_b_mapping_tolerance_after_v8_rerank_paused_uris_2006_lane_and_found_official_rows_waiting_mapping`

Selected next slice:

`british_gypsum_white_book_source_pack_extraction_v1`

Next selected file:

`packages/engine/src/british-gypsum-white-book-source-pack-extraction-gate-b-contract.test.ts`

Next selected action:

`gate_b_mapping_tolerance_decision_no_runtime`

## Objective

Re-rank the current source / accuracy backlog after the rockwool
triple-leaf Uris 2006 lane paused on an external source-packet
dependency.

This is a no-runtime revalidation slice. Gate A may only select a
runtime candidate if source-owned evidence, exact or bounded topology,
local material mapping, metric ownership, tolerance ownership, protected
negative boundaries, and paired engine/web visible tests are all named.

## Current Posture

The paused Uris 2006 lane remains important, but it is not executable
until the missing packet is supplied:

- source lane disposition:
  `paused_waiting_rights_safe_source_packet`;
- first backlog item:
  `uris_2006_authorized_curve_packet`;
- current split-rockwool answer remains `multileaf_screening_blend`,
  `Rw 41`, low confidence;
- no rights-safe source packet, page/figure/table locator, curve
  identity map, band-vector/digitization payload, rating derivation, or
  chain-of-custody review is available for runtime.

The best bounded next source decision is the British Gypsum White Book
Gate B mapping/tolerance decision because Gate A already extracted
official rows:

- `C204006`
- `C204003`
- `A206A290`
- `A046006`
- `A326017B`
- `B226010`

`A046006` is already represented by the existing exact timber corpus.
The remaining rows need row-by-row mapping/rejection decisions before
any runtime or visible behavior movement.

## Gate A - Source Gap Revalidation v8 Decision

Gate A added:

`packages/engine/src/calculator-source-gap-revalidation-v8-gate-a-contract.test.ts`

Required records:

1. Gate T pause summary for the Uris 2006 source lane.
2. British Gypsum Gate A extracted-row summary and Gate B scope.
3. Cross-family candidate re-rank for:
   - British Gypsum White Book Gate B mapping/tolerance;
   - paused Uris 2006 triple-leaf source lane;
   - closed Knauf mapping chain;
   - CLT / mass-timber metric/tolerance work;
   - generated floor fallback source-rule work;
   - historical blocked or productization-only work.
4. Runtime readiness matrix with:
   - source locator / source row status;
   - external source-packet availability;
   - exact live topology mapping;
   - local material mapping;
   - metric owner;
   - tolerance owner;
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
- the Uris 2006 lane remains paused until the rights-safe packet is
  supplied;
- closed Knauf rows stay closed/context-only;
- CLT / mass-timber, generated floor fallback, and historical blocked
  families still lack complete runtime prerequisites;
- the next no-runtime slice is
  `british_gypsum_white_book_source_pack_extraction_v1` Gate B.

## Selected Gate B Scope

Gate B should implement:

`packages/engine/src/british-gypsum-white-book-source-pack-extraction-gate-b-contract.test.ts`

The selected action is:

`gate_b_mapping_tolerance_decision_no_runtime`

Rows needing a Gate B mapping decision:

- `C204006`
- `C204003`
- `A206A290`
- `A326017B`
- `B226010`

Already represented row:

- `A046006`

Gate B must keep runtime frozen unless a row has complete topology,
material, metric, tolerance, negative-boundary, and paired visible-test
ownership.

## Frozen Surfaces

Until a later gate names a fully source-ready runtime candidate, all of
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

Baseline before v8:

- `pnpm calculator:gate:current`: green on 2026-05-02 after Gate T
  landed in the current runner, engine 188 files / 995 tests, web 47
  files / 227 passed + 18 skipped, build 5/5 with known non-fatal
  `sharp/@img` warnings, whitespace guard clean.

Gate A validation completed on 2026-05-02:

- `pnpm --filter @dynecho/engine exec vitest run src/calculator-source-gap-revalidation-v8-gate-a-contract.test.ts --maxWorkers=1`
  green: 1 file / 8 tests.
- `pnpm --filter @dynecho/engine exec vitest run src/calculator-source-gap-revalidation-v8-gate-a-contract.test.ts src/wall-triple-leaf-manual-source-packet-handoff-gate-t.test.ts src/british-gypsum-white-book-source-pack-extraction-gate-a-contract.test.ts --maxWorkers=1`
  green: 3 files / 23 tests.
- `pnpm calculator:gate:current`
  green after adding v8 to the current runner: engine 189 files / 1003
  tests, web 47 files / 227 passed + 18 skipped, build 5/5 with known
  non-fatal `sharp/@img` warnings, whitespace guard clean.
- `git diff --check`
  clean.

Run `pnpm check` only if Gate A selects any runtime import, support /
confidence / evidence promotion, API movement, route-card movement,
output-card movement, proposal/report copy movement, output-support
movement, or workbench-input behavior movement.
