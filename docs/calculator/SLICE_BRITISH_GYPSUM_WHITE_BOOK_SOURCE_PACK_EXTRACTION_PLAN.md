# Slice Plan - British Gypsum White Book Source Pack Extraction v1

Slice id: `british_gypsum_white_book_source_pack_extraction_v1`

Status: GATE A LANDED / GATE B NEXT (selected 2026-04-30 by
`packages/engine/src/calculator-post-knauf-source-acquisition-gate-a-contract.test.ts`;
Gate A landed by
`packages/engine/src/british-gypsum-white-book-source-pack-extraction-gate-a-contract.test.ts`).

Latest checkpoint:
[CHECKPOINT_2026-04-30_BRITISH_GYPSUM_WHITE_BOOK_SOURCE_PACK_EXTRACTION_GATE_A_HANDOFF.md](./CHECKPOINT_2026-04-30_BRITISH_GYPSUM_WHITE_BOOK_SOURCE_PACK_EXTRACTION_GATE_A_HANDOFF.md)
lands British Gypsum source-pack extraction Gate A no-runtime and
selects Gate B mapping/tolerance decision.

Selection status:

`british_gypsum_rows_extracted_no_new_runtime_import_a046006_already_landed_others_need_mapping_tolerance_visible_tests`

Prior selection status from post-Knauf acquisition:

`selected_british_gypsum_white_book_source_pack_extraction_after_post_knauf_acquisition_found_official_wall_floor_rows_but_no_runtime_ready_import`

Next implementation file:

`packages/engine/src/british-gypsum-white-book-source-pack-extraction-gate-b-contract.test.ts`

## Objective

Extract official British Gypsum White Book row locators without moving
runtime behavior.

This source pack is valuable because it contains exact official wall and
floor rows across several calculator gaps:

- GypFloor Silent timber-joist floor rows with `Rw`, `Rw+Ctr`, and
  `Ln,w`;
- GypWall Single Frame steel-stud rows with exact boards, studs,
  insulation, `Rw`, and `Rw+Ctr`;
- timber stud double-board resilient-bar rows;
- GypWall Twin Frame Audio high-performance double-frame rows;
- GypLyner Single lined masonry / heavy-core rows.

This is not a runtime import slice. Gate A must extract row-level
metadata and compare it with live floor/wall route topology, material
mapping, tolerance, and visible-test requirements before any later
runtime slice can be selected.

## Gate A - British Gypsum Row Extraction Decision

Gate A landed in:

`packages/engine/src/british-gypsum-white-book-source-pack-extraction-gate-a-contract.test.ts`

Required records:

1. Row locator matrix for:
   - `C204006 (EN)` GypFloor Silent, `Rw 61`, `Rw+Ctr 48`, `Ln,w 56`;
   - `C204003 (EN)` GypFloor Silent, `Rw 63`, `Rw+Ctr 51`, `Ln,w 55`;
   - `A206A290 (B) (EN)` GypWall Single Frame, `Rw 57`,
     `Rw+Ctr 51`;
   - `A046006 (EN)` timber stud partition, `Rw 58`;
   - `A326017B (B) (EN)` GypWall Twin Frame Audio, `Rw 77`,
     `Rw+Ctr 69`;
   - `B226010 (EN)` GypLyner Single lined brick, `Rw 60`,
     `Rw+Ctr 42`.
2. Per-row source URL, retrieval date, page / row locator, exact layer
   order, layer thicknesses, material names, mounting, cavity/fill,
   supports, and metric context.
3. Mapping decision against the current live engine routes and existing
   Knauf exact anchors.
4. Tolerance owner or explicit tolerance gap per row family.
5. Protected negative boundaries for floor-only rows, wall-only rows,
   adjacent British Gypsum rows, existing Knauf exact anchors, CLT
   context, and historical blocked families.
6. Paired engine and web visible test plan before any runtime or
   visible behavior movement.

Gate A result:

- `A046006` is already represented by the existing exact timber corpus
  row
  `british_gypsum_a046006_timber_rb2_2x12p5_soundbloc_50apr_lab_2026`;
  no duplicate import is selected.
- `C204006`, `C204003`, `A206A290`, `A326017B`, and `B226010` are
  extracted but not runtime-ready.
- Runtime, support, confidence, evidence, API, route-card, output-card,
  proposal/report, and workbench-input behavior stay frozen.
- Gate A selects `gate_b_mapping_tolerance_decision_no_runtime`.

## Gate B - Mapping / Tolerance Decision

Gate B should add:

`packages/engine/src/british-gypsum-white-book-source-pack-extraction-gate-b-contract.test.ts`

Gate B must decide, row by row:

1. Whether each non-landed row has exact live topology mapping or must
   remain context-only.
2. Whether proprietary products map to local materials without changing
   meaning:
   - Gypframe SIF floor channel and RB1 floor ceiling topology;
   - Gyproc SoundBloc / Gyproc Plank / Gyproc FireLine;
   - Gypframe 92 AS 50 AcouStud;
   - twin-frame acoustic braces and multi-layer insulation;
   - GL1 lining channels, 35 mm cavities, plastered brick substrate,
     and Isover APR.
3. Which metric outputs each row can own: lab `Rw`, `Rw+Ctr`, `Ln,w`,
   or no field/building outputs.
4. Whether a tolerance owner exists for any importable row.
5. Which engine and web visible tests must land before any later value
   or visibility movement.

If any row still lacks exact topology, material mapping, metric owner,
tolerance owner, negative boundaries, or paired visible tests, Gate B
must close no-runtime and select Gate C closeout / next-slice selection.

## Frozen Surfaces

Until a later contract names a fully source-ready runtime candidate,
all of these surfaces stay frozen:

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

- exact source row and exact live topology mapping;
- metric owner and lab / field context;
- tolerance owner;
- local material/thickness mapping to engine inputs;
- protected negative boundaries and near misses;
- paired engine value tests and web route-card / report tests.

If any one of these is missing, Gate A remains no-runtime and selects
mapping, validation, or closeout work.

## Validation

Baseline before this slice:

- `pnpm calculator:gate:current`: green on 2026-04-30 before
  this British Gypsum extraction slice, after
  `calculator_post_knauf_source_acquisition_v1` Gate A selected it:
  engine 160 files / 807 tests, web 45 files / 216 passed + 18
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

Gate B validation required:

- `pnpm --filter @dynecho/engine exec vitest run src/british-gypsum-white-book-source-pack-extraction-gate-b-contract.test.ts --maxWorkers=1`
- `pnpm calculator:gate:current`
- `git diff --check`

Run `pnpm check` only if Gate A selects runtime import, support /
confidence / evidence promotion, API movement, route-card movement,
output-card movement, proposal/report copy movement, output-support
movement, or workbench-input behavior movement.
