# Checkpoint - Lined Masonry Knauf MWI.2A Mapping / Tolerance Gate A Handoff

Date: 2026-04-30

Slice: `lined_masonry_knauf_mwi2a_mapping_tolerance_v1`

Gate: Gate A

Status: LANDED / NO RUNTIME MOVEMENT

## Decision

`packages/engine/src/lined-masonry-knauf-mwi2a-mapping-tolerance-gate-a-contract.test.ts`
lands Gate A as a no-runtime mapping / tolerance decision for Knauf
`MWI.2A`.

Gate A does not select runtime import, value movement, support
promotion, confidence promotion, evidence promotion, output support
movement, API movement, route-card movement, output-card movement,
proposal/report copy movement, or workbench-input behavior movement.

Next action:

`gate_c_no_runtime_closeout_and_next_slice_selection`

Next file:

`packages/engine/src/post-lined-masonry-knauf-mwi2a-mapping-tolerance-v1-next-slice-selection-contract.test.ts`

## Source Mapping Result

Official Knauf AU Section F `MWI.2A` was checked as context:

- source table: `F Masonry Upgrades, acoustic upgrades internal walls,
  MWI.2 / MWI.2A`;
- acoustic ratings basis: `RT&A TE405-20S09(R4)`;
- boards: `1x13 mm SHEETROCK ONE` each side;
- side 1 board is adhesive fixed;
- side 2 board is on 28 mm furring channels at 600 mm centres;
- side 2 furring cavity variants are 30 mm and 50 mm;
- insulation variants are `Nil`, `KI 25G24`, and `KI 50G11`;
- substrate variants include 150 / 200 mm concrete panel and 140 /
  190 mm core-filled concrete block families;
- source ratings span `Rw 52-61` and `Rw+Ctr 44-51` for the `MWI.2A`
  `SHEETROCK ONE` rows.

This is useful lab `Rw` context, but not a runtime import.

## Why Runtime Stays Blocked

The live `wall-screening-concrete` route remains a screening /
formula-owned generated route:

- live layers are `gypsum_board:12.5`, `rockwool:50`, `air_gap:50`,
  and `concrete:100`;
- live board is generic `gypsum_board`, not `1x13 mm SHEETROCK ONE`;
- live route has one generic board layer and no side-count metadata,
  while `MWI.2A` is lined both sides;
- live substrate is generic 100 mm concrete, not a selected concrete
  panel or core-filled block mass variant;
- live cavity is an unsided 50 mm air gap, not a furring-channel /
  direct-fix / BETAGRIP coupling model;
- live insulation is rockwool, not `KI 25G24` or `KI 50G11`;
- source values are lab `Rw` / `Rw+Ctr` context only;
- no field-output owner exists for `R'w`, `Dn,w`, `DnT,w`, or `DnT,A`;
- `Rw+Ctr` is not treated as standalone DynEcho `C`, `Ctr`, or `STC`;
- no tolerance owner is named.

## Protected Boundaries

Gate A keeps these boundaries explicit:

- `MWI.1A` adhesive both-side lining is not `MWI.2A` furring truth;
- `MWI.2I` Impactstop rows are adjacent, not `SHEETROCK ONE` truth;
- `AAC.1A` discontinuous AAC / steel-frame topology stays adjacent;
- floor / ceiling lining rows stay floor-only or ceiling-only;
- generic `wall-screening-concrete` remains screening;
- timber, CLT, no-stud, and generated-floor context does not promote
  `MWI.2A`.

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
  this active slice, engine 151 files / 743 tests, web 45 files / 216
  passed + 18 skipped, build 5/5 with known non-fatal `sharp/@img`
  warnings, whitespace guard clean.

Completed after this handoff:

- `pnpm --filter @dynecho/engine exec vitest run src/lined-masonry-knauf-mwi2a-mapping-tolerance-gate-a-contract.test.ts --maxWorkers=1`
  green on 2026-04-30, 1 file / 7 tests.
- `pnpm calculator:gate:current`: green on 2026-04-30 after adding
  Gate A, engine 152 files / 750 tests, web 45 files / 216 passed +
  18 skipped, build 5/5 with known non-fatal `sharp/@img` warnings,
  whitespace guard clean.
- `git diff --check`: clean after Gate A validation note sync.

Run before/after Gate C:

- `pnpm --filter @dynecho/engine exec vitest run src/post-lined-masonry-knauf-mwi2a-mapping-tolerance-v1-next-slice-selection-contract.test.ts --maxWorkers=1`
- `pnpm calculator:gate:current`
- `git diff --check`

Run `pnpm check` only if a later gate selects runtime/import/visible
behavior movement or if this checkpoint is promoted to a release gate.
