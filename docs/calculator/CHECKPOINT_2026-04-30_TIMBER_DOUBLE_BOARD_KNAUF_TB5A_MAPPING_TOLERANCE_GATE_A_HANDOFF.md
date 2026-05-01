# Checkpoint - Timber Double-Board Knauf TB.5A Mapping / Tolerance Gate A Handoff

Date: 2026-04-30

Slice: `timber_double_board_knauf_tb5a_mapping_tolerance_v1`

Gate: Gate A

Status: LANDED / NO RUNTIME MOVEMENT

## Decision

`packages/engine/src/timber-double-board-knauf-tb5a-mapping-tolerance-gate-a-contract.test.ts`
lands Gate A as a no-runtime mapping / tolerance decision for Knauf
`TB.5A`.

Gate A does not select runtime import, value movement, support
promotion, confidence promotion, evidence promotion, output support
movement, API movement, route-card movement, output-card movement,
proposal/report copy movement, or workbench-input behavior movement.

Next action:

`gate_c_no_runtime_closeout_and_next_slice_selection`

Next file:

`packages/engine/src/post-timber-double-board-knauf-tb5a-mapping-tolerance-v1-next-slice-selection-contract.test.ts`

## Source Mapping Result

Official Knauf AU Section D `TB.5` / `TB.5A` was checked as context:

- source table: `D Timber Stud Walls, TB.5 lined both sides`;
- acoustic ratings basis: `RT&A TE405-20S04(R4)`;
- stud spacing: 600 mm centres;
- 70 mm stud / 122 mm nominal wall column:
  `KI 75G11` gives `Rw 46 (Rw+Ctr 39)`;
- 90 mm stud / 142 mm nominal wall column:
  `KI 75G11` gives `Rw 47 (Rw+Ctr 40)`;
- boards: `2x13 mm SHEETROCK ONE` each side;
- insulation: `KI 75G11` 75 mm glasswool.

This is useful lab `Rw` context, but not a runtime import.

## Why Runtime Stays Blocked

The live `wall-timber-stud` route remains a formula-owned,
low-confidence generated route:

- live boards are generic `gypsum_board` at `2x12.5 mm` each side, not
  `2x13 mm SHEETROCK ONE`;
- live fill is `50 mm rockwool + 50 mm air_gap`, not `75 mm KI 75G11`
  glasswool;
- live context names wood studs and 600 mm spacing, but does not carry
  a 70 mm or 90 mm stud-depth input for exact column selection;
- Knauf source values are lab `Rw` / `Rw+Ctr` context only;
- no field-output owner exists for `R'w`, `Dn,w`, `DnT,w`, or `DnT,A`;
- `Rw+Ctr` is not treated as standalone DynEcho `C`, `Ctr`, or `STC`;
- no tolerance owner is named.

## Protected Boundaries

Gate A keeps these boundaries explicit:

- `TO120.1A` remains a one-side-lined negative boundary;
- `TSF120.1A` remains staggered-stud adjacent context;
- `TTF30.2A` remains twin timber / asymmetric double-leaf context;
- single-board timber exact imports do not promote the live
  double-board route;
- RB1 / RB2 resilient timber exact rows require explicit side count and
  do not promote direct line-connection routes;
- steel, CLT, and masonry context does not promote `TB.5A` or the live
  timber route.

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

## Validation

Baseline before Gate A:

- `pnpm calculator:gate:current`: green on 2026-04-30, engine 149 files
  / 730 tests, web 45 files / 216 passed + 18 skipped, build 5/5 with
  known non-fatal `sharp/@img` warnings, whitespace guard clean.

Completed after this handoff:

- `pnpm --filter @dynecho/engine exec vitest run src/timber-double-board-knauf-tb5a-mapping-tolerance-gate-a-contract.test.ts --maxWorkers=1`:
  green on 2026-04-30, 1 file / 7 tests.
- `pnpm calculator:gate:current`: green on 2026-04-30 after Gate A,
  engine 150 files / 737 tests, web 45 files / 216 passed + 18
  skipped, build 5/5 with known non-fatal `sharp/@img` warnings,
  whitespace guard clean.

Still run before Gate C closeout:

- `pnpm --filter @dynecho/engine exec vitest run src/post-timber-double-board-knauf-tb5a-mapping-tolerance-v1-next-slice-selection-contract.test.ts --maxWorkers=1`
- `pnpm calculator:gate:current`
- `git diff --check`

Run `pnpm check` only if a later gate selects runtime/import/visible
behavior movement or if this checkpoint is promoted to a release gate.
