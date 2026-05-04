# Slice Plan - Calculator Post-British-Gypsum Source Acquisition v1

Slice id: `calculator_post_british_gypsum_source_acquisition_v1`

Status: GATE A LANDED / NO RUNTIME MOVEMENT (selected 2026-05-02 by
`calculator_source_gap_revalidation_v9` Gate A; Gate A landed
2026-05-02 in
`packages/engine/src/calculator-post-british-gypsum-source-acquisition-gate-a-contract.test.ts`).

Prior selection status:

`selected_post_british_gypsum_source_acquisition_v1_after_v9_rerank_found_no_runtime_ready_candidate_and_british_gypsum_closed_no_runtime`

Landed Gate A file:

`packages/engine/src/calculator-post-british-gypsum-source-acquisition-gate-a-contract.test.ts`

Landed Gate A action:

`gate_a_acquire_and_classify_post_british_gypsum_source_locators_without_runtime_import`

Gate A selection status:

`selected_rockwool_acoustic_wall_assemblies_source_pack_extraction_after_post_british_gypsum_acquisition_found_official_stone_wool_wall_rows_but_no_runtime_ready_import`

Selected next slice:

`rockwool_acoustic_wall_assemblies_source_pack_extraction_v1`

Selected next file:

`packages/engine/src/rockwool-acoustic-wall-assemblies-source-pack-extraction-gate-a-contract.test.ts`

Selected next action:

`gate_a_extract_rockwool_acoustic_wall_assemblies_rows_without_runtime_import`

## Objective

Acquire and classify the next official source locators after the
British Gypsum White Book pack closed no-runtime.

This is not a runtime import slice. Its job is to decide whether any
new source pack, source locator, or rights-safe source packet is
concrete enough for a later extraction / mapping / validation slice.
It must keep runtime, confidence, evidence, route cards, output cards,
proposal/report text, API shape, and workbench input behavior frozen.

## Why This Slice Is Next

`calculator_source_gap_revalidation_v9` found no source-ready runtime
candidate:

- the Uris 2006 triple-leaf / rockwool lane remains paused on
  `paused_waiting_rights_safe_source_packet`;
- the split-rockwool wall answer remains low-confidence
  `multileaf_screening_blend` (`Rw 41`) and must not be presented as
  fixed or source-validated;
- British Gypsum `C204006`, `C204003`, `A206A290`, `A046006`,
  `A326017B`, and `B226010` are closed no-runtime after Gate B / Gate C;
- the Knauf mapping chain remains closed no-runtime;
- CLT / mass timber, generated floor, no-stud double-leaf,
  lined-heavy, and historical blocked families still need new exact
  topology, metric, tolerance, material mapping, protected negative
  boundaries, and paired visible-test ownership.

Repeating another runtime attempt on this exhausted source set would
create false precision. The next useful accuracy step is a fresh,
bounded source acquisition pass.

## Gate A - Source Locator Acquisition Decision

Gate A should add:

`packages/engine/src/calculator-post-british-gypsum-source-acquisition-gate-a-contract.test.ts`

Required records:

1. Official source locator matrix after British Gypsum, Knauf, and Uris
   lane closeouts.
2. Rights-safe source packet / URL locator policy for the rockwool
   triple-leaf lane and other high-value families.
3. Candidate eligibility rules for exact topology, metric context,
   tolerance owner, local material mapping, protected negative
   boundaries, and paired visible tests.
4. Search targets for:
   - rockwool / triple-leaf / two-cavity wall rows;
   - CLT / mass timber wall rows;
   - generated floor and steel/open-web floor rows;
   - no-stud double-leaf rows;
   - lined-heavy / heavy-core wall rows;
   - double-board timber or steel stud rows not already closed.
5. Explicit rejection rules for closed British Gypsum, Knauf, and
   historical blockers.
6. Selected next extraction / mapping slice only if a concrete locator
   becomes ready.

Gate A result:

- ROCKWOOL Acoustic Wall Assemblies Catalog is the selected fresh
  official source pack for no-runtime extraction;
- representative source rows include `ISS-00`, `ISS-22`, `ISS-39`,
  `IWS-04`, and `ESS-05`;
- reported metric context is `STC`, `OITC`, and test report number;
- USG SA200, National Gypsum Fire & Sound Assembly Selector,
  Georgia-Pacific Fire & Sound Assemblies, and existing Stora Enso /
  WoodWorks / NRC mass-timber context remain ranked context only;
- no runtime, support, confidence, evidence, API, route-card,
  output-card, proposal/report, or workbench-input movement is
  selected.

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

Gate A may select runtime work only if a candidate already names all of:

- exact source row, exact topology, or bounded family/formula rule;
- metric owner and lab / field context;
- tolerance owner;
- local material/thickness mapping to engine inputs;
- protected negative boundaries and near misses;
- paired engine value tests and web route-card / report tests.

If any one of these is missing, Gate A remains no-runtime and selects
source extraction, mapping, validation, another acquisition pass, or
another source-gap revalidation step.

## Validation

Gate A validation completed on 2026-05-02:

- `pnpm --filter @dynecho/engine exec vitest run src/calculator-post-british-gypsum-source-acquisition-gate-a-contract.test.ts --maxWorkers=1`
- `pnpm --filter @dynecho/engine exec vitest run src/calculator-post-british-gypsum-source-acquisition-gate-a-contract.test.ts src/calculator-source-gap-revalidation-v9-gate-a-contract.test.ts src/post-british-gypsum-white-book-source-pack-extraction-v1-next-slice-selection-contract.test.ts src/british-gypsum-white-book-source-pack-extraction-gate-b-contract.test.ts src/calculator-source-gap-revalidation-v8-gate-a-contract.test.ts --maxWorkers=1`
- `pnpm calculator:gate:current`
- `git diff --check`

Observed no-runtime gate shape after adding this Gate A to the current
runner: focused post-British-Gypsum Gate A 1 file / 8 tests; post-BG /
v9 / Gate C / Gate B / v8 continuity 5 files / 38 tests; current-gate
engine 193 files / 1033 tests, web 47 files / 227 passed + 18 skipped,
build 5/5 with known non-fatal `sharp/@img` warnings, whitespace guard
clean.

Run `pnpm check` only if Gate A selects runtime import, support /
confidence / evidence promotion, API movement, route-card movement,
output-card movement, proposal/report copy movement, output-support
movement, or workbench-input behavior movement.
