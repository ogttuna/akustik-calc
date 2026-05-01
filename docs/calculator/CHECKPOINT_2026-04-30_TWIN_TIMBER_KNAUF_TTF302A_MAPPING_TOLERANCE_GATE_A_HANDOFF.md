# Checkpoint - Twin Timber Knauf TTF30.2A Mapping / Tolerance Gate A Handoff

Date: 2026-04-30

Slice: `twin_timber_knauf_ttf302a_mapping_tolerance_v1`

Gate: Gate A

Status: LANDED / NO RUNTIME MOVEMENT

## Decision

`packages/engine/src/twin-timber-knauf-ttf302a-mapping-tolerance-gate-a-contract.test.ts`
lands Gate A as a no-runtime mapping / tolerance decision for Knauf
`TTF30.2A`.

Gate A does not select runtime import, value movement, support
promotion, confidence promotion, evidence promotion, output support
movement, API movement, route-card movement, output-card movement,
proposal/report copy movement, or workbench-input behavior movement.

Next action:

`gate_c_no_runtime_closeout_and_next_slice_selection`

Next file:

`packages/engine/src/post-twin-timber-knauf-ttf302a-mapping-tolerance-v1-next-slice-selection-contract.test.ts`

## Source Mapping Result

Official Knauf AU Section D `TTF30.2A` was checked as context:

- source table: `D 60-61 FIBEROCK AQUA-TOUGH - Twin Stud,
  TTF30.2`;
- acoustic ratings basis: `SLR-FB-T-DS-01`;
- system row: `TTF30.2A`;
- minimum wall widths are 199 mm for 70 mm studs and 239 mm for
  90 mm studs;
- side 1 board is `1x13 mm FIBEROCK AQUA-TOUGH`;
- side 2 board is `2x13 mm FIBEROCK AQUA-TOUGH`;
- framing is twin timber studs separated by a 20 mm gap;
- insulation variants are `Nil`, `KI 50G11`, `KI 75G11`, and
  `KI 90G11` in one-side or both-side table groups;
- source ratings span `Rw 49-64` and `Rw+Ctr 41-54`.

This is useful lab `Rw` context and a strong negative-boundary source,
but not a runtime import.

## Why Runtime Stays Blocked

The live `wall-timber-stud` route remains a formula-owned single-frame
wood-stud surrogate:

- live layers are `gypsum_board:12.5`, `gypsum_board:12.5`,
  `rockwool:50`, `air_gap:50`, `gypsum_board:12.5`, and
  `gypsum_board:12.5`;
- live board is generic `gypsum_board`, not proprietary
  `FIBEROCK AQUA-TOUGH`;
- live route is symmetric two-board each side, while `TTF30.2A` is
  asymmetric `1x13 mm` side 1 and `2x13 mm` side 2;
- live route has a single stud-wall formula context, not two timber
  frames separated by a 20 mm gap;
- live route does not carry exact 70 / 90 mm source column, minimum
  wall width, or inter-frame coupling as engine inputs;
- live insulation is rockwool plus a generic air gap, not `KI 50G11`,
  `KI 75G11`, or `KI 90G11` glasswool with one-side / both-side table
  placement;
- source values are lab `Rw` / `Rw+Ctr` context only;
- no field-output owner exists for `R'w`, `Dn,w`, `DnT,w`, or
  `DnT,A`;
- `Rw+Ctr` is not treated as standalone DynEcho `C`, `Ctr`, or `STC`;
- no twin-frame or double-leaf tolerance owner is named.

## Protected Boundaries

Gate A keeps these boundaries explicit:

- no-stud double-leaf formula routes stay closed;
- raw open-box / open-web floor routes stay closed;
- simple timber and `TB.5A` direct timber routes are not
  twin-frame truth;
- `TSF120.1A` staggered timber stays adjacent;
- `TO120.1A` one-side-lined timber stays negative;
- steel, CLT, and masonry context does not promote `TTF30.2A`.

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

- `pnpm calculator:gate:current`: green on 2026-04-30 before touching
  this active slice, engine 153 files / 756 tests, web 45 files / 216
  passed + 18 skipped, build 5/5 with known non-fatal `sharp/@img`
  warnings, whitespace guard clean.

Completed after this handoff:

- `pnpm --filter @dynecho/engine exec vitest run src/twin-timber-knauf-ttf302a-mapping-tolerance-gate-a-contract.test.ts --maxWorkers=1`
  green on 2026-04-30, 1 file / 8 tests.
- `pnpm --filter @dynecho/engine exec vitest run src/post-lined-masonry-knauf-mwi2a-mapping-tolerance-v1-next-slice-selection-contract.test.ts src/twin-timber-knauf-ttf302a-mapping-tolerance-gate-a-contract.test.ts --maxWorkers=1`
  green on 2026-04-30 after preserving the prior MWI.2A Gate C
  selection status in the active docs, 2 files / 14 tests.
- `pnpm calculator:gate:current`
  green on 2026-04-30 after adding Gate A, engine 154 files / 764
  tests, web 45 files / 216 passed + 18 skipped, build 5/5 with known
  non-fatal `sharp/@img` warnings, whitespace guard clean.
- `git diff --check`
  clean after validation note sync.

Run `pnpm check` only if a later gate selects runtime/import/visible
behavior movement or if this checkpoint is promoted to a release gate.
