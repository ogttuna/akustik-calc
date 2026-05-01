# Slice Plan - Steel Stud Knauf EN-PC Mapping / Tolerance v1

Slice id: `steel_stud_knauf_enpc_mapping_tolerance_v1`

Status: CLOSED / NO RUNTIME MOVEMENT (selected 2026-04-30 by
`packages/engine/src/calculator-source-gap-revalidation-v6-gate-a-contract.test.ts`;
Gate A landed 2026-04-30 in
`packages/engine/src/steel-stud-knauf-enpc-mapping-tolerance-gate-a-contract.test.ts`;
Gate C closed 2026-04-30 in
`packages/engine/src/post-steel-stud-knauf-enpc-mapping-tolerance-v1-next-slice-selection-contract.test.ts`).

Latest checkpoint:
[CHECKPOINT_2026-04-30_STEEL_STUD_KNAUF_ENPC_MAPPING_TOLERANCE_GATE_C_CLOSEOUT_HANDOFF.md](./CHECKPOINT_2026-04-30_STEEL_STUD_KNAUF_ENPC_MAPPING_TOLERANCE_GATE_C_CLOSEOUT_HANDOFF.md)
closes EN-PC no-runtime and selects
`calculator_source_gap_revalidation_v7`.

Selection status:

`closed_enpc_mapping_tolerance_no_runtime_and_selected_source_gap_revalidation_v7_because_all_concrete_knauf_mapping_rows_lack_exact_material_metric_tolerance_ownership`

Prior v6 selection status:

`selected_no_runtime_knauf_enpc_steel_stud_mapping_tolerance_after_v6_rerank_found_no_runtime_ready_candidate`

Gate A selected action:

`gate_c_no_runtime_closeout_and_next_slice_selection`

Next selected slice:

`calculator_source_gap_revalidation_v7`

Next selected file:

`packages/engine/src/calculator-source-gap-revalidation-v7-gate-a-contract.test.ts`

## Objective

Decide whether Knauf UK `EN-PC-50-055-6-2-12.5-WB-25` can become a
future source-backed mapping / tolerance path for a steel-stud wall
lane, without changing runtime behavior during Gate A.

This is a no-runtime mapping slice. It must resolve or explicitly keep
blocked:

- exact source row and live steel-stud anchor comparison;
- Wallboard to local board mapping or rejection;
- Acoustic Roll to local insulation mapping or rejection;
- 50 mm 0.55 gauge C-stud / 600 mm centres equivalence to live inputs;
- lab `Rw` versus field-output policy;
- spectrum-term rejection for `C`, `Ctr`, and `STC`;
- row-specific tolerance owner or explicit tolerance gap;
- negative boundaries for timber, masonry, AAC, existing steel exact
  anchors, and field outputs;
- paired engine and web visible tests required before any later runtime
  import, confidence/support promotion, route-card copy movement, or
  report movement.

## Current Posture

`EN-PC-50-055-6-2-12.5-WB-25` is selected because it is the highest
value remaining concrete Knauf locator after `TB.5A`, `MWI.2A`, and
`TTF30.2A` all closed no-runtime.

Known source context:

- Knauf UK Drywall Systems Performance Guide, April 2026;
- Table Guide p.15 and EN Compliance Performer Wallboard p.17;
- source row `EN-PC-50-055-6-2-12.5-WB-25`;
- topology: 50 mm steel C-stud, 0.55 gauge, 600 mm centres;
- boards: `2x12.5 mm` Wallboard each side;
- cavity: `25 mm` Knauf Insulation Acoustic Roll;
- coupling: single metal stud frame, non-deflection arrangement;
- reported metric: lab `Rw 49 dB`.

This is not import-ready. It is adjacent to existing steel-stud exact
catalog anchors, but adjacency is not enough to move live values,
support, confidence, evidence, route-card, output-card, proposal/report,
or workbench-input behavior.

## Gate A - EN-PC Mapping / Tolerance Decision

Gate A added:

`packages/engine/src/steel-stud-knauf-enpc-mapping-tolerance-gate-a-contract.test.ts`

Landed records:

1. Source locator and row reconstruction for
   `EN-PC-50-055-6-2-12.5-WB-25`.
2. Live implementation comparison against steel-stud exact anchors and
   formula routes.
3. Local material mapping decisions:
   - Wallboard to local board;
   - Acoustic Roll to local insulation;
   - 50 mm / 0.55 gauge / 600 mm centres steel-stud equivalence.
4. Metric policy:
   - whether the source value is usable as lab `Rw`;
   - explicit rejection for field outputs `R'w`, `Dn,w`, `DnT,w`,
     `DnT,A`;
   - explicit rejection for `C`, `Ctr`, and `STC`.
5. Tolerance owner:
   - named row-specific tolerance corridor;
   - rejected tolerance owner; or
   - explicit tolerance gap.
6. Negative boundaries:
   timber double-board, lined masonry, AAC, `TSF120.1A`, `TO120.1A`,
   existing steel exact anchors by proximity, and field-output proxies.
7. Next decision:
   - direct runtime import is not selected;
   - Gate A remains no-runtime and selects Gate C closeout /
     next-slice selection.

Gate A result:

- source row pinned: `EN-PC-50-055-6-2-12.5-WB-25`, lab `Rw 49`;
- live steel-stud anchor protected:
  `knauf_lab_416889_primary_2026`, lab `Rw 55`;
- Wallboard maps to local generic `gypsum` context only, not to the
  live `acoustic_gypsum_board` exact anchor;
- `25 mm` Acoustic Roll does not exact-map to the live `70 mm`
  glasswool plus `5 mm` air gap;
- 50 mm / 0.55 gauge C-stud detail is not selectable in the current
  input model;
- field outputs and spectrum terms remain blocked;
- no tolerance owner is named.

## Gate C - Closeout / Next-Slice Selection

Gate C added:

`packages/engine/src/post-steel-stud-knauf-enpc-mapping-tolerance-v1-next-slice-selection-contract.test.ts`

Gate C closed this slice no-runtime. It did not select runtime import,
support promotion, confidence promotion, evidence promotion, API
movement, route-card movement, output-card movement, proposal/report
copy movement, or workbench-input behavior movement.

Gate C result:

- keep `EN-PC-50-055-6-2-12.5-WB-25` as source context only;
- keep existing steel exact anchors in force;
- keep runtime/support/confidence/evidence/API/visible/report/input
  behavior frozen;
- select `calculator_source_gap_revalidation_v7` because all concrete
  Knauf mapping rows have now closed no-runtime.

Next file:

`packages/engine/src/calculator-source-gap-revalidation-v7-gate-a-contract.test.ts`

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

Gate A must not change acoustic values, supported output sets,
confidence, evidence tier, route-card values, output-card statuses,
proposal/report copy, missing-input behavior, or input schema behavior.

## Acceptance Rules

Gate A may select runtime work only if it names all of:

- exact `EN-PC-50-055-6-2-12.5-WB-25` topology or a bounded family rule;
- metric owner and lab / field output policy;
- tolerance owner;
- local material mapping for board, studs, cavity insulation, and
  coupling;
- protected negative boundaries and near misses;
- paired engine value tests and web route-card / report tests.

If any one of these is missing, Gate A remains no-runtime.

## Validation

Baseline before Gate A:

- `pnpm calculator:gate:current`: green on 2026-04-30 after
  `calculator_source_gap_revalidation_v6` Gate A selected this slice,
  engine 156 files / 778 tests, web 45 files / 216 passed + 18 skipped,
  build 5/5 with known non-fatal `sharp/@img` warnings, whitespace
  guard clean.

Gate A validation completed:

- `pnpm --filter @dynecho/engine exec vitest run src/steel-stud-knauf-enpc-mapping-tolerance-gate-a-contract.test.ts --maxWorkers=1`
  green on 2026-04-30, 1 engine file / 7 tests.
- `pnpm --filter @dynecho/engine exec vitest run src/calculator-source-gap-revalidation-v6-gate-a-contract.test.ts src/steel-stud-knauf-enpc-mapping-tolerance-gate-a-contract.test.ts --maxWorkers=1`
  green on 2026-04-30, 2 engine files / 15 tests.
- `pnpm calculator:gate:current` green on 2026-04-30 after Gate A,
  engine 157 files / 785 tests, web 45 files / 216 passed + 18
  skipped, build 5/5 with known non-fatal `sharp/@img` warnings,
  whitespace guard clean.
- `git diff --check` clean after validation note sync.

Gate C validation completed:

- `pnpm --filter @dynecho/engine exec vitest run src/post-steel-stud-knauf-enpc-mapping-tolerance-v1-next-slice-selection-contract.test.ts --maxWorkers=1`
  green on 2026-04-30, 1 engine file / 6 tests.
- `pnpm --filter @dynecho/engine exec vitest run src/steel-stud-knauf-enpc-mapping-tolerance-gate-a-contract.test.ts src/post-steel-stud-knauf-enpc-mapping-tolerance-v1-next-slice-selection-contract.test.ts --maxWorkers=1`
  green on 2026-04-30, 2 engine files / 13 tests.
- `pnpm calculator:gate:current` green on 2026-04-30 after Gate C,
  engine 158 files / 791 tests, web 45 files / 216 passed + 18
  skipped, build 5/5 with known non-fatal `sharp/@img` warnings,
  whitespace guard clean.
- `git diff --check` clean after validation note sync.

Run `pnpm check` only if a later gate selects any runtime import, support /
confidence / evidence promotion, API movement, route-card movement,
output-card movement, proposal/report copy movement, output-support
movement, or workbench-input behavior movement.
