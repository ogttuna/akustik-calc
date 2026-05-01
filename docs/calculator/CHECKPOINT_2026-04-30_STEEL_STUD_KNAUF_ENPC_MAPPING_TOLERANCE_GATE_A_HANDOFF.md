# Checkpoint - Steel Stud Knauf EN-PC Mapping / Tolerance Gate A Handoff

Date: 2026-04-30

Slice: `steel_stud_knauf_enpc_mapping_tolerance_v1`

Gate: A

Status: LANDED / NO RUNTIME MOVEMENT

## Decision

`packages/engine/src/steel-stud-knauf-enpc-mapping-tolerance-gate-a-contract.test.ts`
lands Gate A no-runtime mapping / tolerance work for Knauf UK
`EN-PC-50-055-6-2-12.5-WB-25`.

Gate A does not select runtime import, value movement, support
promotion, confidence promotion, evidence promotion, output support
movement, API movement, route-card movement, output-card movement,
proposal/report copy movement, or workbench-input behavior movement.

Next selected action:

`gate_c_no_runtime_closeout_and_next_slice_selection`

Next selected file:

`packages/engine/src/post-steel-stud-knauf-enpc-mapping-tolerance-v1-next-slice-selection-contract.test.ts`

Gate A selection status:

`gate_a_landed_enpc_steel_stud_mapping_tolerance_no_runtime_because_wallboard_acoustic_roll_stud_gauge_field_metric_and_tolerance_ownership_remain_incomplete`

## Source Row Pinned

Gate A records the Knauf UK row as source context only:

- source: Knauf UK Drywall Systems Performance Guide, April 2026;
- row: EN Compliance Performer Wallboard
  `EN-PC-50-055-6-2-12.5-WB-25`;
- page/table context: Table Guide p.15 and EN Compliance Performer
  Wallboard p.17;
- topology: 50 mm 0.55 gauge Knauf C metal stud at 600 mm centres;
- boards: `2x12.5 mm` Wallboard each side;
- cavity: `25 mm` Knauf Insulation Acoustic Roll;
- coupling: single metal stud frame, non-deflection arrangement;
- reported metric: lab `Rw 49 dB`;
- retrieval date used by the source-pack chain: `2026-04-29`.

This is not import permission.

## Live Implementation Comparison

The live `wall-lsf-knauf` route remains anchored to the current exact
steel-stud catalog row:

- live rows:
  `2x12.5 mm acoustic_gypsum_board + 5 mm air_gap + 70 mm glasswool + 2x12.5 mm acoustic_gypsum_board`;
- live lab context: `light_steel_stud`, line connection, 600 mm
  centres, element lab;
- live lab exact match:
  `knauf_lab_416889_primary_2026`, `Rw 55`;
- live field route stays formula / field owned and does not use a lab
  fallback exact match;
- current live field values remain `R'w 51`, `Dn,w 51`, `DnT,w 52`,
  `DnT,A 51.1`, `C -1.4`, `Ctr -6.4`, `STC 51`.

`EN-PC-50-055-6-2-12.5-WB-25` is adjacent, not exact. The source row
uses Wallboard rather than live acoustic board, 25 mm Acoustic Roll
rather than live 70 mm glasswool plus 5 mm air gap, and names 50 mm /
0.55 gauge steel stud details that the live input model cannot select
as exact row dimensions.

## Mapping / Metric / Tolerance Result

Gate A decisions:

- Wallboard maps to local generic `gypsum` context only, not to the
  live `acoustic_gypsum_board` exact anchor.
- `25 mm` Knauf Insulation Acoustic Roll does not exact-map to the
  live `70 mm` glasswool plus `5 mm` air-gap anchor.
- `50 mm` / `0.55` gauge C stud at 600 mm centres maps only partly:
  the live context can name `light_steel_stud` and 600 mm centres, but
  has no stud-depth or gauge input.
- Non-deflection single metal stud context is directionally a line
  connection, but not a complete local coupling policy.
- Lab `Rw 49` is allowed as context only.
- Field/building outputs `R'w`, `Dn,w`, `Dn,A`, `DnT,w`, and `DnT,A`
  remain blocked.
- `C`, `Ctr`, and `STC` remain blocked because the source row reports
  only `Rw`.
- No row-specific tolerance owner is named.

## Protected Boundaries

Gate A protects these boundaries:

- existing `knauf_lab_416889_primary_2026` acoustic-board exact anchor;
- existing `knauf_lab_416702_primary_2026` generic-gypsum adjacent
  anchor;
- all field / building output proxies;
- `TB.5A` timber double-board;
- `MWI.2A` lined masonry;
- `TTF30.2A` twin timber;
- `AAC.1A`, `TSF120.1A`, and `TO120.1A` adjacent / negative context.

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

`packages/engine/src/post-steel-stud-knauf-enpc-mapping-tolerance-v1-next-slice-selection-contract.test.ts`

That closeout should either select a fully source-ready runtime path
only if all prerequisites are named, or keep `EN-PC-50-055-6-2-12.5-WB-25`
as source context and select the next no-runtime source/planning slice.

## Validation

Baseline before Gate A:

- `pnpm calculator:gate:current`: green on 2026-04-30 after
  `calculator_source_gap_revalidation_v6` Gate A selected this slice,
  engine 156 files / 778 tests, web 45 files / 216 passed + 18 skipped,
  build 5/5 with known non-fatal `sharp/@img` warnings, whitespace
  guard clean.

Completed after this handoff:

- `pnpm --filter @dynecho/engine exec vitest run src/steel-stud-knauf-enpc-mapping-tolerance-gate-a-contract.test.ts --maxWorkers=1`
  green on 2026-04-30, 1 engine file / 7 tests.
- `pnpm --filter @dynecho/engine exec vitest run src/calculator-source-gap-revalidation-v6-gate-a-contract.test.ts src/steel-stud-knauf-enpc-mapping-tolerance-gate-a-contract.test.ts --maxWorkers=1`
  green on 2026-04-30, 2 engine files / 15 tests.
- `pnpm calculator:gate:current` green on 2026-04-30 after Gate A,
  engine 157 files / 785 tests, web 45 files / 216 passed + 18
  skipped, build 5/5 with known non-fatal `sharp/@img` warnings,
  whitespace guard clean.
- `git diff --check` clean after validation note sync.

Run `pnpm check` only if a later gate selects runtime/import/visible
behavior movement or if this checkpoint is promoted to a release gate.
