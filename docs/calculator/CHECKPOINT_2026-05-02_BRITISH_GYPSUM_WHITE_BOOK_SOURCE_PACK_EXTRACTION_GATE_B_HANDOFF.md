# Checkpoint - 2026-05-02 - British Gypsum White Book Source Pack Extraction Gate B

Slice: `british_gypsum_white_book_source_pack_extraction_v1`

Gate landed: `gate_b_mapping_tolerance_decision_no_runtime`

Status:

`british_gypsum_gate_b_found_no_new_runtime_ready_row_kept_a046006_existing_anchor_and_selected_closeout`

Selected next action:

`gate_c_closeout_and_next_slice_selection_no_runtime`

Selected next file:

`packages/engine/src/post-british-gypsum-white-book-source-pack-extraction-v1-next-slice-selection-contract.test.ts`

Implementation artifact:

`packages/engine/src/british-gypsum-white-book-source-pack-extraction-gate-b-contract.test.ts`

## Summary

Gate B compared the British Gypsum White Book rows extracted by Gate A
against the live calculator topology, material mapping, metric policy,
tolerance ownership, negative-boundary, and paired visible-test
requirements.

No new British Gypsum row is runtime-ready now. Runtime, support,
confidence, evidence, API, route-card, output-card, proposal/report,
and workbench-input behavior stay frozen.

`A046006` remains the only represented British Gypsum row because it is
already landed in the timber lightweight exact corpus as
`british_gypsum_a046006_timber_rb2_2x12p5_soundbloc_50apr_lab_2026`.
Gate B does not re-import it and does not use it to promote direct
timber routes.

## Row Decisions

- `C204006`: blocked from runtime. It is a GypFloor Silent floor row and
  still needs Gypframe SIF channel, timber joist, RB1 ceiling,
  SoundBloc / Plank, floor metric policy, tolerance ownership, and
  paired visible tests before any exact floor import.
- `C204003`: blocked from runtime. It is a separate Plank / FireLine
  GypFloor Silent variant and must not substitute for `C204006` or for
  generic generated timber-floor fallback truth.
- `A206A290`: blocked from runtime. It is adjacent to the live LSF exact
  lane but not the same stud/cavity/material topology; AcouStud,
  SoundBloc, APR, cavity, current Knauf anchor precedence, metric
  policy, tolerance ownership, and paired visible tests are missing.
- `A046006`: already represented as an existing exact timber anchor;
  no new runtime import is selected.
- `A326017B`: context only. The twin-frame audio row needs the twin
  92 S 10 frame topology, GAB3 bracing, 600 mm width, six insulation
  layers, metric policy, tolerance ownership, and negative-boundary
  tests before runtime.
- `B226010`: context only. The lined-brick row needs 103 mm solid
  brick/density, plaster, GL1 channels, 35 mm cavities, APR mapping,
  lined-masonry metric policy, tolerance ownership, and negative
  boundaries before runtime.

## Metric Policy

The floor rows provide source lab `Rw`, `Rw+Ctr`, and `Ln,w` context,
but they do not own wall outputs or field-floor normalization.

The wall rows provide source lab `Rw` / `Rw+Ctr` context, but they do
not own field/building `R'w`, `Dn,w`, `DnT,w`, `DnT,A`, `C`, or `Ctr`
outputs.

`Rw+Ctr` context is not a standalone DynEcho spectrum-term or field
output owner.

## Protected Boundaries

- `C204006` and `C204003` stay floor-only and cannot promote wall
  routes or generic generated floor fallback routes.
- `C204003` cannot substitute for `C204006`.
- `A206A290` cannot override the current Knauf LSF exact anchor.
- `A046006` cannot be re-imported or used as direct timber route truth.
- `A326017B` cannot promote no-stud, raw open-box, or simple timber
  routes.
- `B226010` cannot promote generic lined concrete, `MWI.2A`, or heavy
  core screening routes.
- `Rw+Ctr` context cannot promote standalone `C`, `Ctr`, or field
  outputs without a metric owner.

## Rockwool Defect Posture

This checkpoint does not fix or retune the original rockwool reorder /
triple-leaf defect. The Uris 2006 source lane remains paused on
`paused_waiting_rights_safe_source_packet`, and the split-rockwool wall
answer remains low-confidence `multileaf_screening_blend` (`Rw 41`).
It must not be presented as fixed, correct, or source-validated.

## Validation

Validation completed on 2026-05-02:

- `pnpm --filter @dynecho/engine exec vitest run src/british-gypsum-white-book-source-pack-extraction-gate-b-contract.test.ts --maxWorkers=1`
- `pnpm --filter @dynecho/engine exec vitest run src/british-gypsum-white-book-source-pack-extraction-gate-b-contract.test.ts src/british-gypsum-white-book-source-pack-extraction-gate-a-contract.test.ts src/calculator-source-gap-revalidation-v8-gate-a-contract.test.ts --maxWorkers=1`
- `pnpm calculator:gate:current`
- `git diff --check`

Observed no-runtime gate shape after adding Gate B to the current
runner: focused Gate B 1 file / 8 tests; Gate B / Gate A / v8
continuity 3 files / 24 tests; current-gate engine 190 files / 1011
tests, web 47 files / 227 passed + 18 skipped, build 5/5 with known
non-fatal `sharp/@img` warnings, and whitespace guard clean.

Run `pnpm check` only if a later gate selects runtime import, support /
confidence / evidence promotion, API movement, route-card movement,
output-card movement, proposal/report copy movement, output-support
movement, or workbench-input behavior movement.
