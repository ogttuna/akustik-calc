# Checkpoint - 2026-05-02 - Calculator Source Gap Revalidation v8 Gate A

Slice:

`calculator_source_gap_revalidation_v8`

Gate A status:

`selected_british_gypsum_gate_b_mapping_tolerance_after_v8_rerank_paused_uris_2006_lane_and_found_official_rows_waiting_mapping`

Selected next slice:

`british_gypsum_white_book_source_pack_extraction_v1`

Selected next action:

`gate_b_mapping_tolerance_decision_no_runtime`

Selected next file:

`packages/engine/src/british-gypsum-white-book-source-pack-extraction-gate-b-contract.test.ts`

## Summary

Gate A lands calculator source-gap revalidation v8 with no runtime
movement. It adds:

- `packages/engine/src/calculator-source-gap-revalidation-v8-gate-a-contract.test.ts`
- `docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V8_PLAN.md`

The gate re-ranks the source/accuracy backlog after Gate T paused the
Uris 2006 triple-leaf source lane on
`paused_waiting_rights_safe_source_packet`. Because the Uris lane now
depends on a manually supplied rights-safe source packet, v8 selects the
already extracted official British Gypsum White Book rows for the next
bounded mapping/tolerance decision.

## Why British Gypsum Gate B Is Next

British Gypsum Gate A already extracted official source rows and
classified their current implementation fit:

- `C204006`
- `C204003`
- `A206A290`
- `A046006`
- `A326017B`
- `B226010`

`A046006` is already represented by the existing exact timber corpus.
The remaining rows still need Gate B mapping/rejection decisions before
any runtime or visible movement:

- `C204006`
- `C204003`
- `A206A290`
- `A326017B`
- `B226010`

This is a source-defensible next step because it works from official
extracted rows, but it is not a runtime import. Gate B must decide
topology, material mapping, metric ownership, tolerance ownership,
negative boundaries, and paired engine/web visible tests row by row.

## Paused Triple-Leaf Lane

The original rockwool/triple-leaf defect is not fixed or promoted.
The Uris 2006 lane remains paused because the following packet
requirements are still missing:

- `authorized_source_file_or_tdm_payload`
- `rights_and_storage_note`
- `source_identity_metadata`
- `page_figure_table_locator`
- `curve_identity_map`
- `band_vector_or_digitization_payload`
- `rating_derivation_and_uncertainty`
- `chain_of_custody_review`

The split-rockwool grouped stack remains `multileaf_screening_blend`,
`Rw 41`, low confidence. Do not present it as fixed, correct, or
source-validated.

## Runtime Posture

Runtime and visible surfaces remain frozen:

- runtime;
- support;
- confidence;
- evidence;
- API;
- route-card;
- output-card;
- proposal/report;
- workbench-input.

No runtime import, support promotion, confidence promotion, evidence
promotion, route-card movement, output-card movement, proposal/report
movement, or workbench-input behavior movement is selected by v8.

## Validation

Focused Gate A validation:

- `pnpm --filter @dynecho/engine exec vitest run src/calculator-source-gap-revalidation-v8-gate-a-contract.test.ts --maxWorkers=1`
  green on 2026-05-02: 1 file / 8 tests.

Continuity validation:

- `pnpm --filter @dynecho/engine exec vitest run src/calculator-source-gap-revalidation-v8-gate-a-contract.test.ts src/wall-triple-leaf-manual-source-packet-handoff-gate-t.test.ts src/british-gypsum-white-book-source-pack-extraction-gate-a-contract.test.ts --maxWorkers=1`
  green on 2026-05-02: 3 files / 23 tests.
- `pnpm calculator:gate:current`
  green on 2026-05-02 after adding v8 to the runner: engine 189 files /
  1003 tests, web 47 files / 227 passed + 18 skipped, build 5/5 with
  known non-fatal `sharp/@img` warnings, whitespace guard clean.
- `git diff --check`
  green on 2026-05-02.
