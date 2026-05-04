# Slice Plan - British Gypsum White Book Source Pack Extraction v1

Slice id: `british_gypsum_white_book_source_pack_extraction_v1`

Status: GATE C CLOSED / NO RUNTIME MOVEMENT (selected 2026-04-30 by
`packages/engine/src/calculator-post-knauf-source-acquisition-gate-a-contract.test.ts`;
Gate A landed by
`packages/engine/src/british-gypsum-white-book-source-pack-extraction-gate-a-contract.test.ts`;
resumed on 2026-05-02 by
`packages/engine/src/calculator-source-gap-revalidation-v8-gate-a-contract.test.ts`
after the Uris 2006 triple-leaf source lane was paused on
`paused_waiting_rights_safe_source_packet`; Gate B landed by
`packages/engine/src/british-gypsum-white-book-source-pack-extraction-gate-b-contract.test.ts`;
Gate C closed by
`packages/engine/src/post-british-gypsum-white-book-source-pack-extraction-v1-next-slice-selection-contract.test.ts`).

Latest checkpoint:

[CHECKPOINT_2026-05-02_BRITISH_GYPSUM_WHITE_BOOK_SOURCE_PACK_EXTRACTION_GATE_C_CLOSEOUT_HANDOFF.md](./CHECKPOINT_2026-05-02_BRITISH_GYPSUM_WHITE_BOOK_SOURCE_PACK_EXTRACTION_GATE_C_CLOSEOUT_HANDOFF.md)
lands Gate C closeout no-runtime and selects
`calculator_source_gap_revalidation_v9` with
`closed_british_gypsum_white_book_source_pack_no_runtime_and_selected_source_gap_revalidation_v9_because_gate_b_found_no_new_import_ready_row`.

Prior checkpoint:

[CHECKPOINT_2026-05-02_BRITISH_GYPSUM_WHITE_BOOK_SOURCE_PACK_EXTRACTION_GATE_B_HANDOFF.md](./CHECKPOINT_2026-05-02_BRITISH_GYPSUM_WHITE_BOOK_SOURCE_PACK_EXTRACTION_GATE_B_HANDOFF.md)
lands Gate B no-runtime and selects
`gate_c_closeout_and_next_slice_selection_no_runtime` with
`british_gypsum_gate_b_found_no_new_runtime_ready_row_kept_a046006_existing_anchor_and_selected_closeout`.

Earlier checkpoint:

[CHECKPOINT_2026-05-02_CALCULATOR_SOURCE_GAP_REVALIDATION_V8_GATE_A_HANDOFF.md](./CHECKPOINT_2026-05-02_CALCULATOR_SOURCE_GAP_REVALIDATION_V8_GATE_A_HANDOFF.md)
resumed this slice for `gate_b_mapping_tolerance_decision_no_runtime`
with
`selected_british_gypsum_gate_b_mapping_tolerance_after_v8_rerank_paused_uris_2006_lane_and_found_official_rows_waiting_mapping`.

Older checkpoint:

[CHECKPOINT_2026-04-30_BRITISH_GYPSUM_WHITE_BOOK_SOURCE_PACK_EXTRACTION_GATE_A_HANDOFF.md](./CHECKPOINT_2026-04-30_BRITISH_GYPSUM_WHITE_BOOK_SOURCE_PACK_EXTRACTION_GATE_A_HANDOFF.md)
lands British Gypsum source-pack extraction Gate A no-runtime and
selects Gate B mapping/tolerance decision.

Gate A selection status:

`british_gypsum_rows_extracted_no_new_runtime_import_a046006_already_landed_others_need_mapping_tolerance_visible_tests`

Selection status:

`closed_british_gypsum_white_book_source_pack_no_runtime_and_selected_source_gap_revalidation_v9_because_gate_b_found_no_new_import_ready_row`

Prior selection status from post-Knauf acquisition:

`selected_british_gypsum_white_book_source_pack_extraction_after_post_knauf_acquisition_found_official_wall_floor_rows_but_no_runtime_ready_import`

Next implementation file:

`packages/engine/src/calculator-source-gap-revalidation-v9-gate-a-contract.test.ts`

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

Gate B landed in:

`packages/engine/src/british-gypsum-white-book-source-pack-extraction-gate-b-contract.test.ts`

Gate B status:

`british_gypsum_gate_b_found_no_new_runtime_ready_row_kept_a046006_existing_anchor_and_selected_closeout`

Gate B decided, row by row:

- `C204006`: blocked from runtime as a floor-only GypFloor Silent row.
  It still lacks Gypframe SIF channel, timber joist, RB1 ceiling,
  SoundBloc / Plank, floor tolerance ownership, and paired visible
  tests.
- `C204003`: blocked from runtime as a separate Plank / FireLine
  GypFloor Silent variant. It cannot substitute for `C204006` or
  generic generated floor truth.
- `A206A290`: blocked from runtime. It is near the current LSF exact
  lane but not the same AcouStud / SoundBloc / APR / cavity / precedent
  topology and has no row-specific tolerance owner.
- `A046006`: already represented by the existing exact timber corpus
  row
  `british_gypsum_a046006_timber_rb2_2x12p5_soundbloc_50apr_lab_2026`;
  Gate B selects no duplicate import.
- `A326017B`: context-only twin-frame audio row. The live calculator
  lacks its twin 92 S 10 frames, GAB3 bracing, 600 mm width, six
  insulation layers, metric policy, tolerance owner, and negative
  boundary tests.
- `B226010`: context-only lined-brick row. The live calculator lacks
  its 103 mm solid brick/density, plaster, GL1 channels, 35 mm
  cavities, APR mapping, metric policy, tolerance owner, and negative
  boundaries.

Metric result: floor rows are source lab `Rw`, `Rw+Ctr`, and `Ln,w`
context only; wall rows are source lab `Rw` / `Rw+Ctr` context only.
They do not own field `R'w`, `Dn,w`, `DnT,w`, `DnT,A`, standalone `C`
or `Ctr`, or route-card/report promotion.

Gate B keeps all frozen surfaces unchanged and selects
`gate_c_closeout_and_next_slice_selection_no_runtime`.

## Gate C - Closeout / Next-Slice Selection

Gate C landed in:

`packages/engine/src/post-british-gypsum-white-book-source-pack-extraction-v1-next-slice-selection-contract.test.ts`

Gate C status:

`closed_british_gypsum_white_book_source_pack_no_runtime_and_selected_source_gap_revalidation_v9_because_gate_b_found_no_new_import_ready_row`

Gate C closes this source pack no-runtime because no row gained exact
topology, material mapping, metric owner, tolerance owner, protected
negative boundaries, and paired engine/web visible tests after Gate B.

Gate C selects:

`packages/engine/src/calculator-source-gap-revalidation-v9-gate-a-contract.test.ts`

with:

`gate_a_revalidate_source_accuracy_gap_order_after_british_gypsum_source_pack_closeout`

The selected next slice is `calculator_source_gap_revalidation_v9`.

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

Gate B validation completed on 2026-05-02:

- `pnpm --filter @dynecho/engine exec vitest run src/british-gypsum-white-book-source-pack-extraction-gate-b-contract.test.ts --maxWorkers=1`
- `pnpm --filter @dynecho/engine exec vitest run src/british-gypsum-white-book-source-pack-extraction-gate-b-contract.test.ts src/british-gypsum-white-book-source-pack-extraction-gate-a-contract.test.ts src/calculator-source-gap-revalidation-v8-gate-a-contract.test.ts --maxWorkers=1`
- `pnpm calculator:gate:current`
- `git diff --check`

Gate B validation shape:

- focused Gate B: 1 file / 8 tests;
- Gate B / Gate A / v8 continuity: 3 files / 24 tests;
- current gate: engine 190 files / 1011 tests, web 47 files / 227
  passed + 18 skipped, build 5/5 with known non-fatal `sharp/@img`
  warnings, whitespace guard clean.

Gate C validation completed on 2026-05-02:

- `pnpm --filter @dynecho/engine exec vitest run src/post-british-gypsum-white-book-source-pack-extraction-v1-next-slice-selection-contract.test.ts --maxWorkers=1`
- `pnpm --filter @dynecho/engine exec vitest run src/post-british-gypsum-white-book-source-pack-extraction-v1-next-slice-selection-contract.test.ts src/british-gypsum-white-book-source-pack-extraction-gate-b-contract.test.ts src/calculator-source-gap-revalidation-v8-gate-a-contract.test.ts --maxWorkers=1`
- `pnpm calculator:gate:current`
- `git diff --check`

Gate C validation shape:

- focused Gate C: 1 file / 6 tests;
- Gate C / Gate B / v8 continuity: 3 files / 22 tests;
- current gate: engine 191 files / 1017 tests, web 47 files / 227
  passed + 18 skipped, build 5/5 with known non-fatal `sharp/@img`
  warnings, whitespace guard clean.

Run `pnpm check` only if Gate B or Gate C selects runtime import, support /
confidence / evidence promotion, API movement, route-card movement,
output-card movement, proposal/report copy movement, output-support
movement, or workbench-input behavior movement.
