# Checkpoint - Lined Masonry Knauf MWI.2A Mapping / Tolerance Gate C Closeout Handoff

Date: 2026-04-30

Slice: `lined_masonry_knauf_mwi2a_mapping_tolerance_v1`

Gate: Gate C

Status: CLOSED / NO RUNTIME MOVEMENT

## Decision

`packages/engine/src/post-lined-masonry-knauf-mwi2a-mapping-tolerance-v1-next-slice-selection-contract.test.ts`
closes the `MWI.2A` mapping / tolerance slice no-runtime.

Gate C does not select runtime import, value movement, support
promotion, confidence promotion, evidence promotion, output support
movement, API movement, route-card movement, output-card movement,
proposal/report copy movement, or workbench-input behavior movement.

Next selected slice:

`twin_timber_knauf_ttf302a_mapping_tolerance_v1`

Next file:

`packages/engine/src/twin-timber-knauf-ttf302a-mapping-tolerance-gate-a-contract.test.ts`

Selection status:

`closed_mwi2a_mapping_tolerance_no_runtime_and_selected_knauf_ttf302a_twin_timber_mapping_tolerance_because_mwi2a_lacks_exact_material_metric_tolerance_ownership`

## Closeout Evidence

Gate A proved `MWI.2A` is useful lab context but not a runtime import:

- source row basis: Knauf AU Section F `MWI.2A`,
  `RT&A TE405-20S09(R4)`;
- `1x13 mm SHEETROCK ONE` each side;
- side 2 on 28 mm furring channels with 30 / 50 mm cavity variants;
- substrate variants include concrete panel and core-filled concrete
  block families;
- insulation variants are `Nil`, `KI 25G24`, and `KI 50G11`;
- source ratings span `Rw 52-61` and `Rw+Ctr 44-51`;
- live route still uses generic `gypsum_board`, `rockwool`, `air_gap`,
  and generic 100 mm `concrete`;
- field outputs, `STC`, `C`, and `Ctr` remain blocked;
- no tolerance owner is named.

## Next Slice Rationale

`TTF30.2A` is selected next because it is the remaining concrete Knauf
locator with a twin timber double-leaf topology. It is not runtime
ready, but it can resolve a high-risk boundary: a framed twin-stud row
must not reopen no-stud double-leaf, raw open-box / open-web, or simple
timber routes by proximity.

It is still no-runtime. It must map or reject:

- exact `TTF30.2A` table row and 70 / 90 mm stud column;
- twin timber frames and 20 mm inter-frame gap;
- asymmetric `1x13 mm` side 1 / `2x13 mm` side 2 `FIBEROCK
  AQUA-TOUGH` board mapping;
- `Nil`, `KI 50G11`, `KI 75G11`, and `KI 90G11` cavity-fill variants;
- lab `Rw` / `Rw+Ctr` versus field-output policy;
- double-leaf / twin-frame tolerance ownership;
- negative boundaries for no-stud, raw open-box / open-web, simple
  timber, `TB.5A`, `TSF120.1A`, and `TO120.1A`.

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

Baseline before Gate C:

- `pnpm calculator:gate:current`: green on 2026-04-30 before touching
  Gate C, engine 152 files / 750 tests, web 45 files / 216 passed +
  18 skipped, build 5/5 with known non-fatal `sharp/@img` warnings,
  whitespace guard clean.

Completed after this handoff:

- `pnpm --filter @dynecho/engine exec vitest run src/post-lined-masonry-knauf-mwi2a-mapping-tolerance-v1-next-slice-selection-contract.test.ts --maxWorkers=1`
  green on 2026-04-30, 1 file / 6 tests.
- `pnpm calculator:gate:current`: green on 2026-04-30 after Gate C,
  engine 153 files / 756 tests, web 45 files / 216 passed + 18
  skipped, build 5/5 with known non-fatal `sharp/@img` warnings,
  whitespace guard clean.

Run before `TTF30.2A` Gate A lands:

- `pnpm --filter @dynecho/engine exec vitest run src/twin-timber-knauf-ttf302a-mapping-tolerance-gate-a-contract.test.ts --maxWorkers=1`
- `pnpm calculator:gate:current`
- `git diff --check`

Run `pnpm check` only if a later gate selects runtime/import/visible
behavior movement or if this checkpoint is promoted to a release gate.
