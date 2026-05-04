# Slice Plan - Calculator Source Gap Revalidation v9

Slice id: `calculator_source_gap_revalidation_v9`

Status: GATE A LANDED / NO RUNTIME MOVEMENT (selected 2026-05-02 by
`british_gypsum_white_book_source_pack_extraction_v1` Gate C closeout;
Gate A landed 2026-05-02 in
`packages/engine/src/calculator-source-gap-revalidation-v9-gate-a-contract.test.ts`).

Prior selection status:

`closed_british_gypsum_white_book_source_pack_no_runtime_and_selected_source_gap_revalidation_v9_because_gate_b_found_no_new_import_ready_row`

Landed Gate A file:

`packages/engine/src/calculator-source-gap-revalidation-v9-gate-a-contract.test.ts`

Landed Gate A action:

`gate_a_revalidate_source_accuracy_gap_order_after_british_gypsum_source_pack_closeout`

Gate A selection status:

`selected_post_british_gypsum_source_acquisition_v1_after_v9_rerank_found_no_runtime_ready_candidate_and_british_gypsum_closed_no_runtime`

Selected next slice:

`calculator_post_british_gypsum_source_acquisition_v1`

Selected next file:

`packages/engine/src/calculator-post-british-gypsum-source-acquisition-gate-a-contract.test.ts`

Selected next action:

`gate_a_acquire_and_classify_post_british_gypsum_source_locators_without_runtime_import`

## Objective

Re-rank the current source / accuracy backlog after British Gypsum Gate
B and Gate C closed no-runtime.

This is a no-runtime revalidation slice. Gate A may only select a
runtime candidate if source-owned evidence, exact or bounded topology,
local material mapping, metric ownership, tolerance ownership,
protected negative boundaries, and paired engine/web visible tests are
all named together before implementation starts.

## Current Posture

British Gypsum Gate B status:

`british_gypsum_gate_b_found_no_new_runtime_ready_row_kept_a046006_existing_anchor_and_selected_closeout`

Gate B and Gate C preserve these row boundaries:

- `C204006` and `C204003` remain floor-only context rows and do not
  promote wall outputs or generic generated floor fallback truth.
- `A206A290` remains adjacent LSF context and does not override the
  current Knauf LSF exact anchor.
- `A046006` remains the already-landed exact timber anchor and is not
  re-imported.
- `A326017B` remains twin-frame context only.
- `B226010` remains lined-brick context only and does not promote
  `MWI.2A`, generic lined concrete, or heavy-core screening.

The Uris 2006 triple-leaf source lane remains paused on
`paused_waiting_rights_safe_source_packet`. The split-rockwool wall
answer remains low-confidence `multileaf_screening_blend` (`Rw 41`)
and must not be presented as fixed, correct, or source-validated.

## Gate A - Source Gap Revalidation v9 Decision

Gate A should add:

`packages/engine/src/calculator-source-gap-revalidation-v9-gate-a-contract.test.ts`

Required records:

1. British Gypsum Gate A / Gate B / Gate C closeout summary.
2. Closed British Gypsum row and negative-boundary re-rank.
3. Paused Uris 2006 triple-leaf source-packet lane status.
4. Closed Knauf mapping chain and remaining near-source boundaries.
5. CLT / mass timber, generated floor fallback, no-stud double-leaf,
   lined-heavy, and historical blocked-family re-rank.
6. Runtime readiness matrix with exact topology, metric, tolerance,
   material mapping, and paired visible-test flags.
7. Selected next slice with target gate file and validation scope.

Gate A result:

- no runtime import, support promotion, confidence promotion, evidence
  promotion, API movement, route-card movement, output-card movement,
  proposal/report movement, output-support movement, or workbench-input
  behavior movement is selected;
- the Uris 2006 triple-leaf lane remains paused on
  `paused_waiting_rights_safe_source_packet`;
- closed British Gypsum rows remain closed no-runtime;
- closed Knauf rows remain closed no-runtime;
- CLT / mass timber, generated floor, no-stud double-leaf,
  lined-heavy, and historical blocked families still lack complete
  source / topology / metric / tolerance / material / visible-test
  ownership;
- the selected next slice is
  `calculator_post_british_gypsum_source_acquisition_v1` at
  `packages/engine/src/calculator-post-british-gypsum-source-acquisition-gate-a-contract.test.ts`.

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
source acquisition, extraction, mapping, validation, or another
revalidation step instead.

## Validation

Gate A validation completed on 2026-05-02:

- `pnpm --filter @dynecho/engine exec vitest run src/calculator-source-gap-revalidation-v9-gate-a-contract.test.ts --maxWorkers=1`
- `pnpm --filter @dynecho/engine exec vitest run src/calculator-source-gap-revalidation-v9-gate-a-contract.test.ts src/post-british-gypsum-white-book-source-pack-extraction-v1-next-slice-selection-contract.test.ts src/british-gypsum-white-book-source-pack-extraction-gate-b-contract.test.ts src/calculator-source-gap-revalidation-v8-gate-a-contract.test.ts --maxWorkers=1`
- `pnpm calculator:gate:current`
- `git diff --check`

Observed no-runtime gate shape after adding v9 Gate A to the current
runner: focused v9 Gate A 1 file / 8 tests; v9 / Gate C / Gate B / v8
continuity 4 files / 30 tests; current-gate engine 192 files / 1025
tests, web 47 files / 227 passed + 18 skipped, build 5/5 with known
non-fatal `sharp/@img` warnings, whitespace guard clean.

Run `pnpm check` only if Gate A selects runtime import, support /
confidence / evidence promotion, API movement, route-card movement,
output-card movement, proposal/report copy movement, output-support
movement, or workbench-input behavior movement.
