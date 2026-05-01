# Checkpoint - Twin Timber Knauf TTF30.2A Mapping / Tolerance Gate C Closeout Handoff

Date: 2026-04-30

Slice: `twin_timber_knauf_ttf302a_mapping_tolerance_v1`

Gate: Gate C

Status: CLOSED / NO RUNTIME MOVEMENT

## Decision

`packages/engine/src/post-twin-timber-knauf-ttf302a-mapping-tolerance-v1-next-slice-selection-contract.test.ts`
closes `twin_timber_knauf_ttf302a_mapping_tolerance_v1` no-runtime.

Gate C does not select runtime import, value movement, support
promotion, confidence promotion, evidence promotion, output support
movement, API movement, route-card movement, output-card movement,
proposal/report copy movement, or workbench-input behavior movement.

Next selected slice:

`calculator_source_gap_revalidation_v6`

Next selected file:

`packages/engine/src/calculator-source-gap-revalidation-v6-gate-a-contract.test.ts`

Gate C selection status:

`closed_ttf302a_mapping_tolerance_no_runtime_and_selected_source_gap_revalidation_v6_because_knauf_tb5a_mwi2a_ttf302a_all_lack_exact_material_metric_tolerance_ownership`

## Closeout Evidence

Gate A pinned official Knauf AU Section D `TTF30.2A` context:

- acoustic ratings basis: `SLR-FB-T-DS-01`;
- source table: `D 60-61 FIBEROCK AQUA-TOUGH - Twin Stud,
  TTF30.2`;
- side 1 board: `1x13 mm FIBEROCK AQUA-TOUGH`;
- side 2 board: `2x13 mm FIBEROCK AQUA-TOUGH`;
- framing: twin timber studs separated by a 20 mm gap;
- column variants: 70 mm studs / 199 mm minimum wall width and 90 mm
  studs / 239 mm minimum wall width;
- insulation variants: `Nil`, `KI 50G11`, `KI 75G11`, and
  `KI 90G11`;
- ratings span: `Rw 49-64` and `Rw+Ctr 41-54`.

This is context only, not import permission.

## Why Runtime Stays Blocked

Runtime remains blocked because:

- exact 70 / 90 mm source column and minimum wall width are not
  selectable from live engine inputs;
- `FIBEROCK AQUA-TOUGH` cannot be collapsed to generic 12.5 mm gypsum
  board;
- asymmetric side lining and twin-frame 20 mm gap/coupling are not
  live route inputs;
- `KI 50G11`, `KI 75G11`, and `KI 90G11` glasswool placement is not a
  valid mapping to live rockwool plus air gap;
- source `Rw+Ctr` is spectrum context only, not standalone DynEcho
  `C`, `Ctr`, or `STC`;
- no field-output owner exists for `R'w`, `Dn,w`, `DnT,w`, or
  `DnT,A`;
- no twin-frame / double-leaf tolerance owner is named.

## Protected Boundaries

Gate C carries these boundaries forward:

- no-stud double-leaf formula routes stay closed;
- raw open-box / open-web floor routes stay closed;
- simple timber and `TB.5A` direct timber routes do not inherit
  twin-frame truth;
- `TSF120.1A` staggered timber remains adjacent context;
- `TO120.1A` one-side-lined timber remains a negative boundary;
- steel, CLT, and masonry context does not promote `TTF30.2A`.

## Next Slice Rationale

`calculator_source_gap_revalidation_v6` is selected because the three
concrete post-Knauf mapping decisions now all closed no-runtime:

- `TB.5A` lacks exact column, `SHEETROCK ONE`, `KI 75G11`, field
  output policy, and tolerance ownership;
- `MWI.2A` lacks exact substrate mass, furring/coupling, board /
  insulation mapping, field output policy, and tolerance ownership;
- `TTF30.2A` lacks exact twin-frame topology, `FIBEROCK AQUA-TOUGH`,
  side asymmetry, glasswool placement, field output policy, and
  tolerance ownership.

The next honest step is a fresh source / accuracy revalidation before
selecting any narrower follow-up. Runtime work remains allowed only if
v6 names exact topology, metric owner, tolerance owner, local material
mapping, protected negative boundaries, and paired engine / web
visible tests.

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
  this active slice, engine 154 files / 764 tests, web 45 files / 216
  passed + 18 skipped, build 5/5 with known non-fatal `sharp/@img`
  warnings, whitespace guard clean.

Completed after this handoff:

- `pnpm --filter @dynecho/engine exec vitest run src/post-twin-timber-knauf-ttf302a-mapping-tolerance-v1-next-slice-selection-contract.test.ts --maxWorkers=1`
  green on 2026-04-30, 1 engine file / 6 tests.
- `pnpm --filter @dynecho/engine exec vitest run src/post-twin-timber-knauf-ttf302a-mapping-tolerance-v1-next-slice-selection-contract.test.ts src/twin-timber-knauf-ttf302a-mapping-tolerance-gate-a-contract.test.ts src/post-lined-masonry-knauf-mwi2a-mapping-tolerance-v1-next-slice-selection-contract.test.ts --maxWorkers=1`
  green on 2026-04-30, 3 engine files / 20 tests.
- `pnpm calculator:gate:current` green on 2026-04-30 after Gate C,
  engine 155 files / 770 tests, web 45 files / 216 passed + 18
  skipped, build 5/5 with known non-fatal `sharp/@img` warnings,
  whitespace guard clean.
- `git diff --check` clean after validation note sync.

Run `pnpm check` only if a later gate selects runtime/import/visible
behavior movement or if this checkpoint is promoted to a release gate.
