# Checkpoint - Wall Triple-Leaf Accuracy Recovery Gate D Handoff

Date: 2026-04-30

Slice: `wall_triple_leaf_accuracy_recovery_v1`

Gate: D

Status: LANDED / SOURCE-PACK EXTRACTION / NO RUNTIME

Gate D status:

`gate_d_extracted_triple_leaf_source_pack_no_runtime_and_selected_source_corpus_classifier_gate_e`

Next implementation file:

`packages/engine/src/wall-triple-leaf-source-corpus-contract.test.ts`

## Decision

Gate D extracts the source-pack candidates into a typed local corpus and
keeps every row blocked from direct runtime promotion. It does not
promote, retune, or re-label the current split-rockwool
`multileaf_screening_blend` value as accurate.

The local source-pack module is:

`packages/engine/src/wall-triple-leaf-source-pack.ts`

The Gate D contract is:

`packages/engine/src/wall-triple-leaf-source-pack-extraction-gate-d-contract.test.ts`

## Extracted Source Lanes

Gate D keeps the source priority from the second research iteration:

1. `P0` `nrc_2024_internal_gypsum_double_stud`:
   graph-digitization / bounded-calibration candidate. It has internal
   gypsum-board double-stud topology, published STC values, resonance
   estimates, and plotted one-third-octave transmission-loss curves, but
   not parser-ready numeric curves.
2. `P0` `nrc_1998_gypsum_board_walls_tl_data`:
   parser-ready baseline / negative-boundary corpus. It has `TestID`,
   `STC`, one-third-octave TL from `50 Hz` to `6300 Hz`, materials,
   densities, stud spacing, resilient-channel, and insulation details.
   Representative rows `TL-93-176` and `TL-93-185` are pinned with full
   band arrays, but they are ordinary gypsum-board wall rows, not
   internal-board triple-leaf rows.
3. `P1` `uris_2006_internal_gypsum_double_frame`:
   qualitative-only until full numeric curves and exact construction
   details are available. Its abstract-level weighted-index decrease is
   not a runtime penalty.
4. `P1` `ballagh_2013_triple_panel_low_frequency_model`:
   solver model only. It can shape Gate F, but cannot own `Rw` without
   measured row calibration and holdouts.
5. `P2` `warnock_1998_concrete_block_attached_drywall`:
   adjacent lined-masonry / attached-drywall negative boundary. It must
   not calibrate the steel-stud internal-board triple-leaf lane.

All candidates remain:

`directRuntimeReadyNow: false`

## Runtime Hold

Gate D freezes:

- runtime numeric values;
- support status;
- confidence promotion;
- evidence promotion;
- API shape;
- route-card values;
- output-card status;
- proposal/report copy;
- workbench input behavior.

The current user repro still requires Gate E/F/G/H before any accurate
answer can replace the low-confidence screening blend.

## Next Gate

Gate E must build the source-corpus classifier and negative boundaries:

- accept only true internal-leaf, two-cavity source candidates into the
  triple-leaf calibration lane;
- keep ordinary double-leaf rows as baselines only;
- keep simple stud walls, lined masonry, one-side lining, floor rows,
  field-only rows, abstract-only rows, and solver-only rows out of exact
  triple-leaf evidence;
- prove the candidate classes with engine tests before any web-visible
  movement.

## Validation

Pre-edit current gate completed green on 2026-04-30:

- `pnpm calculator:gate:current`
  green before Gate D edits: engine 164 files / 830 tests, web 45 files
  / 216 passed + 18 skipped, build 5/5 with the known non-fatal
  `sharp/@img` warnings, whitespace guard clean.

Gate D focused validation completed green on 2026-04-30:

- `pnpm --filter @dynecho/engine exec vitest run src/wall-triple-leaf-source-pack-extraction-gate-d-contract.test.ts --maxWorkers=1`
  green: 1 file / 6 tests.
- `pnpm --filter @dynecho/engine exec vitest run src/wall-triple-leaf-accuracy-recovery-gate-c-contract.test.ts src/wall-triple-leaf-source-pack-extraction-gate-d-contract.test.ts --maxWorkers=1`
  green after preserving Gate C doc continuity: 2 files / 11 tests.
- `pnpm --filter @dynecho/engine lint`
  green.

Post-edit current gate completed green on 2026-04-30:

- `pnpm calculator:gate:current`
  green after adding Gate D to the current runner: engine 165 files /
  836 tests, web 45 files / 216 passed + 18 skipped, build 5/5 with the
  known non-fatal `sharp/@img` warnings, whitespace guard clean.
