# Slice Plan - Calculator Post-Knauf Source Acquisition v1

Slice id: `calculator_post_knauf_source_acquisition_v1`

Status: GATE A LANDED / NO RUNTIME MOVEMENT (selected 2026-04-30 by
`packages/engine/src/calculator-source-gap-revalidation-v7-gate-a-contract.test.ts`;
Gate A landed 2026-04-30 in
`packages/engine/src/calculator-post-knauf-source-acquisition-gate-a-contract.test.ts`).

Latest checkpoint:
[CHECKPOINT_2026-04-30_CALCULATOR_POST_KNAUF_SOURCE_ACQUISITION_GATE_A_HANDOFF.md](./CHECKPOINT_2026-04-30_CALCULATOR_POST_KNAUF_SOURCE_ACQUISITION_GATE_A_HANDOFF.md)
lands this source acquisition slice no-runtime and selects
`british_gypsum_white_book_source_pack_extraction_v1`.

Prior v7 selection status:

`selected_post_knauf_source_acquisition_v1_after_v7_rerank_found_no_runtime_ready_candidate_and_current_sources_exhausted`

Selection status:

`selected_british_gypsum_white_book_source_pack_extraction_after_post_knauf_acquisition_found_official_wall_floor_rows_but_no_runtime_ready_import`

Selected next slice:

`british_gypsum_white_book_source_pack_extraction_v1`

Selected next file:

`packages/engine/src/british-gypsum-white-book-source-pack-extraction-gate-a-contract.test.ts`

## Objective

Acquire and classify fresh official post-Knauf source locators after
the concrete Knauf mapping chain closed no-runtime.

This is not a runtime import slice. Its job is to find whether any new
floor or wall source candidate can satisfy the calculator accuracy bar:

- exact topology or a bounded family rule;
- metric owner and lab / field context;
- tolerance owner;
- local material and thickness mapping;
- protected negative boundaries and near misses;
- paired engine and web visible tests before any user-visible movement.

## Why This Slice Is Next

The current source set is exhausted for runtime movement:

- `TB.5A`, `MWI.2A`, `TTF30.2A`, and
  `EN-PC-50-055-6-2-12.5-WB-25` all closed no-runtime.
- `AAC.1A` and `TSF120.1A` remain adjacent context only.
- `TO120.1A` remains a one-side-lined negative boundary.
- CLT / mass-timber, generated floor fallback, no-stud double-leaf,
  lined-heavy / heavy-core, and historical blocked families all still
  lack complete topology / metric / tolerance / material / visible-test
  ownership.

Repeating another runtime or mapping attempt on the same evidence set
would not improve accuracy. The next useful move is a bounded source
acquisition pass that either finds concrete new locators or records why
none are ready.

## Gate A - Source Locator Acquisition Decision

Gate A added:

`packages/engine/src/calculator-post-knauf-source-acquisition-gate-a-contract.test.ts`

Required records:

1. Official-source locator matrix for the highest-value floor and wall
   gaps:
   - CLT / mass-timber wall;
   - generated floor fallback and steel/open-web floor routes;
   - no-stud double-leaf wall;
   - lined-heavy / heavy-core wall;
   - timber double-board wall after Knauf `TB.5A` rejection;
   - any measured benchmark pack with exact topology metadata.
2. Source eligibility rules:
   - source label, URL or local path, page/table/row locator, and
     retrieval date;
   - exact layer order, thickness, material name, density or surface
     mass where available;
   - mounting, cavity, fill, support, coupling, and side metadata;
   - reported metric and lab / field / spectrum context;
   - tolerance owner or explicit tolerance gap;
   - local material mapping confidence;
   - negative boundaries and paired test requirements.
3. Rejection rules for exhausted Knauf rows and historical blockers.
4. Selected next extraction / mapping slice only if a concrete locator
   becomes ready for no-runtime extraction.
5. Frozen-surface assertion for runtime, support, confidence,
   evidence, API, route-card, output-card, proposal/report,
   output-support, and workbench-input behavior.

Gate A result:

- British Gypsum White Book / Specification Selector is the selected
  fresh official source pack for no-runtime extraction;
- selected row examples are `C204006`, `C204003`, `A206A290`,
  `A046006`, `A326017B`, and `B226010`;
- Stora Enso CLT soundproofing is retained as CLT context only;
- existing WoodWorks / NRC / Pliteq / UBIQ / Dataholz context remains
  governed by prior source-gated contracts;
- no runtime, support, confidence, evidence, API, route-card,
  output-card, proposal/report, or workbench-input movement is
  selected.

Selected next file:

`packages/engine/src/british-gypsum-white-book-source-pack-extraction-gate-a-contract.test.ts`

Gate A selection status:

`selected_british_gypsum_white_book_source_pack_extraction_after_post_knauf_acquisition_found_official_wall_floor_rows_but_no_runtime_ready_import`

## Frozen Surfaces

Until Gate A names a fully source-ready runtime candidate, all of these
surfaces stay frozen:

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

Gate A may select runtime work only if a candidate already names all of:

- exact source row, exact topology, or bounded family/formula rule;
- metric owner and lab / field context;
- tolerance owner;
- local material/thickness mapping to engine inputs;
- protected negative boundaries and near misses;
- paired engine value tests and web route-card / report tests.

If any one of these is missing, Gate A remains no-runtime and selects
source extraction, mapping, validation, or another acquisition pass.

## Validation

Baseline before this slice:

- `pnpm calculator:gate:current`: green on 2026-04-30 after v7 Gate A
  selected this slice, engine 159 files / 799 tests, web 45 files /
  216 passed + 18 skipped, build 5/5 with known non-fatal
  `sharp/@img` warnings, whitespace guard clean.

Gate A validation completed:

- `pnpm --filter @dynecho/engine exec vitest run src/calculator-post-knauf-source-acquisition-gate-a-contract.test.ts --maxWorkers=1`
  green: 1 file / 8 tests.
- `pnpm --filter @dynecho/engine exec vitest run src/calculator-source-gap-revalidation-v7-gate-a-contract.test.ts src/calculator-post-knauf-source-acquisition-gate-a-contract.test.ts --maxWorkers=1`
  green: 2 files / 16 tests.
- `pnpm calculator:gate:current` green on 2026-04-30 after Gate A:
  engine 160 files / 807 tests, web 45 files / 216 passed + 18 skipped,
  build 5/5 with known non-fatal `sharp/@img` warnings, whitespace
  guard clean.
- `git diff --check`: clean after validation-doc refresh.

Run `pnpm check` only if Gate A selects any runtime import, support /
confidence / evidence promotion, API movement, route-card movement,
output-card movement, proposal/report copy movement, output-support
movement, or workbench-input behavior movement.
