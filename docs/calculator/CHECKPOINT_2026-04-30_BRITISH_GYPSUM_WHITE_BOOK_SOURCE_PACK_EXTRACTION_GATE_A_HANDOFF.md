# Checkpoint - British Gypsum White Book Source Pack Extraction Gate A Handoff

Date: 2026-04-30

Slice: `british_gypsum_white_book_source_pack_extraction_v1`

Gate: A

Status: LANDED / NO RUNTIME MOVEMENT

Gate A status:

`british_gypsum_rows_extracted_no_new_runtime_import_a046006_already_landed_others_need_mapping_tolerance_visible_tests`

## Decision

`packages/engine/src/british-gypsum-white-book-source-pack-extraction-gate-a-contract.test.ts`
lands British Gypsum White Book row extraction no-runtime.

Gate A does not select runtime import, value movement, support
promotion, confidence promotion, evidence promotion, output support
movement, API movement, route-card movement, output-card movement,
proposal/report copy movement, or workbench-input behavior movement.

Next selected action:

`gate_b_mapping_tolerance_decision_no_runtime`

Next selected file:

`packages/engine/src/british-gypsum-white-book-source-pack-extraction-gate-b-contract.test.ts`

## Extracted Rows

- `C204006`: GypFloor Silent floor row with `Rw 61`, `Rw+Ctr 48`, and
  `Ln,w 56`; stays floor-only context until SIF channel / timber joist /
  RB1 ceiling topology and tolerance are mapped.
- `C204003`: GypFloor Silent floor row with `Rw 63`, `Rw+Ctr 51`, and
  `Ln,w 55`; stays floor-only context until the Plank / FireLine ceiling
  variant is mapped separately from `C204006`.
- `A206A290`: GypWall Single Frame steel-stud row with `Rw 57` and
  `Rw+Ctr 51`; cannot replace the live `knauf_lab_416889_primary_2026`
  steel-stud exact anchor without AcouStud / SoundBloc / APR / precedence
  mapping and paired tests.
- `A046006`: timber stud resilient-bar row with `Rw 58`; already
  represented by the exact corpus row
  `british_gypsum_a046006_timber_rb2_2x12p5_soundbloc_50apr_lab_2026`,
  so Gate A selects no duplicate runtime import.
- `A326017B`: GypWall Twin Frame Audio row with `Rw 77` and `Rw+Ctr 69`;
  stays context until twin-frame bracing, multi-cavity insulation, metric,
  tolerance, and no-stud / simple-timber negative boundaries are owned.
- `B226010`: GypLyner Single lined-brick row with `Rw 60` and
  `Rw+Ctr 42`; stays context until solid brick / plaster / GL1 lining /
  cavity / APR mapping and lined-masonry tolerance are owned.

## Why No Runtime Movement

British Gypsum rows are useful official source rows, but only `A046006`
is already complete in the live implementation. The remaining rows still
lack at least one of:

- exact live topology mapping;
- local material/thickness/coupling mapping;
- metric owner for lab, spectrum, impact, or field outputs;
- tolerance owner;
- protected negative boundaries;
- paired engine and web visible tests.

## Frozen Surfaces

These surfaces remain frozen:

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

`packages/engine/src/british-gypsum-white-book-source-pack-extraction-gate-b-contract.test.ts`

Gate B should compare the extracted rows against live implementation
routes. Runtime can only be selected if a row has complete topology,
material, metric, tolerance, negative-boundary, and paired test
ownership; otherwise Gate B should select Gate C closeout / next-slice
selection no-runtime.

## Validation

Baseline before Gate A:

- `pnpm calculator:gate:current`: green on 2026-04-30 before this Gate
  A edit, engine 160 files / 807 tests, web 45 files / 216 passed + 18
  skipped, build 5/5 with known non-fatal `sharp/@img` warnings,
  whitespace guard clean.

Gate A validation completed:

- `pnpm --filter @dynecho/engine exec vitest run src/british-gypsum-white-book-source-pack-extraction-gate-a-contract.test.ts --maxWorkers=1`
  green on 2026-04-30: 1 file / 8 tests.
- `pnpm --filter @dynecho/engine exec vitest run src/calculator-post-knauf-source-acquisition-gate-a-contract.test.ts src/british-gypsum-white-book-source-pack-extraction-gate-a-contract.test.ts --maxWorkers=1`
  green on 2026-04-30 after the historical post-Knauf selection path
  was preserved in current docs: 2 files / 16 tests.
- `pnpm calculator:gate:current`
  green on 2026-04-30 with this Gate A in the current runner:
  engine 161 files / 815 tests, web 45 files / 216 passed + 18
  skipped, build 5/5 with known non-fatal `sharp/@img` warnings,
  whitespace guard clean.
- `git diff --check`
  clean on 2026-04-30.

Run `pnpm check` only if a later gate selects runtime/import/visible
behavior movement or if this checkpoint is promoted to a release gate.
