# Checkpoint - Wall Triple-Leaf Accuracy Recovery Gate E Handoff

Date: 2026-04-30

Slice: `wall_triple_leaf_accuracy_recovery_v1`

Gate: E

Status: LANDED / SOURCE-CORPUS CLASSIFIER / NO RUNTIME

Gate E status:

`gate_e_classified_triple_leaf_source_corpus_no_runtime_and_selected_frequency_band_solver_gate_f`

Next implementation file:

`packages/engine/src/wall-triple-leaf-frequency-solver.test.ts`

## Decision

Gate E adds the local source-corpus classifier and required negative
boundaries. It keeps every source out of exact/runtime evidence and does
not retune, promote, or relabel the current split-rockwool
`multileaf_screening_blend` result.

The classifier module is:

`packages/engine/src/wall-triple-leaf-source-corpus.ts`

The Gate E contract is:

`packages/engine/src/wall-triple-leaf-source-corpus-contract.test.ts`

## Classification Result

Gate E classifies the Gate D source pack as:

1. `nrc_2024_internal_gypsum_double_stud`:
   `triple_leaf_calibration_candidate`, not exact/runtime evidence. It
   is the only true internal-leaf / two-cavity source candidate in the
   current pack, but it still needs graph-digitized TL curves, coupling
   mapping, local material mapping, holdout tolerance, and paired
   visible tests.
2. `nrc_1998_gypsum_board_walls_tl_data`:
   `baseline_negative_boundary`. Parser-ready numeric TL rows stay
   ordinary gypsum-board wall baseline / negative-boundary data until a
   row has internal leaf and two-cavity topology.
3. `uris_2006_internal_gypsum_double_frame`:
   `qualitative_blocked`. It stays relevant physics evidence, but full
   curves and exact topology are required before calibration.
4. `ballagh_2013_triple_panel_low_frequency_model`:
   `solver_model_context`. It can shape Gate F equations but cannot own
   an `Rw` value.
5. `warnock_1998_concrete_block_attached_drywall`:
   `adjacent_negative_boundary`. It protects lined-masonry /
   attached-drywall boundaries and must not calibrate the steel-stud
   internal-board lane.

## Protected Negatives

Gate E explicitly rejects these families from exact triple-leaf evidence:

- ordinary double-leaf exact rows;
- simple stud walls without internal leaf;
- lined masonry or one-side lining;
- rows without usable band curves or exact topology;
- floor and floor/ceiling impact rows;
- field-only `R'w` / `DnT,w` rows without lab element curve ownership.

## Runtime Hold

Gate E freezes:

- runtime numeric values;
- support status;
- confidence promotion;
- evidence promotion;
- API shape;
- route-card values;
- output-card status;
- proposal/report copy;
- workbench input behavior.

## Next Gate

Gate F must build a frequency-band solver skeleton without live runtime
promotion:

- derive leaf surface masses from grouped topology;
- model two cavity springs and interacting resonance dips;
- expose damping / fill / coupling parameters as explicit inputs;
- return one-third-octave TL curves for later ISO 717 rating;
- remain research-only until Gate G calibration and holdout tolerance
  pass.

## Validation

Pre-edit current gate completed green on 2026-04-30:

- `pnpm calculator:gate:current`
  green before Gate E edits: engine 165 files / 836 tests, web 45 files
  / 216 passed + 18 skipped, build 5/5 with the known non-fatal
  `sharp/@img` warnings, whitespace guard clean.

Gate E focused validation completed green on 2026-04-30:

- `pnpm --filter @dynecho/engine exec vitest run src/wall-triple-leaf-source-corpus-contract.test.ts src/wall-triple-leaf-source-pack-extraction-gate-d-contract.test.ts --maxWorkers=1`
  green after preserving Gate D doc continuity: 2 files / 12 tests.
- `pnpm --filter @dynecho/engine exec vitest run src/wall-triple-leaf-accuracy-recovery-gate-c-contract.test.ts src/wall-triple-leaf-source-pack-extraction-gate-d-contract.test.ts src/wall-triple-leaf-source-corpus-contract.test.ts --maxWorkers=1`
  green: 3 files / 17 tests.
- `pnpm --filter @dynecho/engine lint`
  green.

Post-edit current gate completed green on 2026-04-30:

- `pnpm calculator:gate:current`
  green after adding Gate E to the current runner: engine 166 files /
  842 tests, web 45 files / 216 passed + 18 skipped, build 5/5 with the
  known non-fatal `sharp/@img` warnings, whitespace guard clean.
