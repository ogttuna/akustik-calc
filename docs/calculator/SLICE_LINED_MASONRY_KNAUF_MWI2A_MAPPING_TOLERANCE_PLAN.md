# Slice Plan - Lined Masonry Knauf MWI.2A Mapping / Tolerance v1

Slice id: `lined_masonry_knauf_mwi2a_mapping_tolerance_v1`

Status: CLOSED / NO RUNTIME MOVEMENT (selected 2026-04-30 by
`packages/engine/src/post-timber-double-board-knauf-tb5a-mapping-tolerance-v1-next-slice-selection-contract.test.ts`;
Gate A landed and Gate C closed 2026-04-30).

Latest checkpoint:
[CHECKPOINT_2026-04-30_LINED_MASONRY_KNAUF_MWI2A_MAPPING_TOLERANCE_GATE_C_CLOSEOUT_HANDOFF.md](./CHECKPOINT_2026-04-30_LINED_MASONRY_KNAUF_MWI2A_MAPPING_TOLERANCE_GATE_C_CLOSEOUT_HANDOFF.md)
closes Gate C no-runtime and selects the `TTF30.2A` twin timber
mapping / tolerance slice.

Selection status:

`closed_tb5a_mapping_tolerance_no_runtime_and_selected_knauf_mwi2a_lined_masonry_mapping_tolerance_because_tb5a_lacks_exact_material_metric_tolerance_ownership`

Landed Gate A implementation file:

`packages/engine/src/lined-masonry-knauf-mwi2a-mapping-tolerance-gate-a-contract.test.ts`

Next implementation file:

`packages/engine/src/twin-timber-knauf-ttf302a-mapping-tolerance-gate-a-contract.test.ts`

Next selected slice:

`twin_timber_knauf_ttf302a_mapping_tolerance_v1`

Gate C selection status:

`closed_mwi2a_mapping_tolerance_no_runtime_and_selected_knauf_ttf302a_twin_timber_mapping_tolerance_because_mwi2a_lacks_exact_material_metric_tolerance_ownership`

## Objective

Decide whether Knauf AU `MWI.2A` can become a future source-backed
mapping / tolerance path for the lined masonry / lined heavy-core wall
lane, without changing runtime behavior during Gate A.

This is a no-runtime mapping slice. It must resolve or explicitly keep
blocked:

- the exact `MWI.2A` table row and substrate variant;
- concrete panel or core-filled block mass mapping;
- `SHEETROCK ONE` to local board mapping;
- furring channel, furring cavity, coupling, and insulation mapping;
- lab / field metric and output policy;
- the tolerance owner or explicit tolerance gap;
- negative boundaries for `AAC.1A`, `MWI.1A`, floor-only lining rows,
  generic AAC routes, and generic lined-heavy / wall-screening routes;
- paired engine and web visible tests required before any later runtime
  import, confidence/support promotion, route-card copy movement, or
  report movement.

## Current Posture

`MWI.2A` is the next highest-value source/accuracy step after `TB.5A`
because it is a concrete official Knauf locator and it attacks the
lined masonry / heavy-core screening gap. It is not import-ready.

The current implementation keeps lined massive / heavy-core wall
behavior screening-oriented. Knauf Gate B blocks `MWI.2A` because the
source row still lacks substrate-mass mapping, furring/cavity coupling
mapping, local board mapping, field-output policy, and tolerance
ownership.

Known source context:

- official Knauf AU Section F Masonry Upgrades;
- acoustic ratings basis `RT&A TE405-20S09(R4)`;
- `MWI.2A` uses `1x13 mm SHEETROCK ONE` each side;
- masonry substrate variants include concrete panel and core-filled
  concrete block families;
- side 2 uses 28 mm furring channels at 600 mm centres with direct fix
  clips or BETAGRIP clips for 50 mm furring cavities;
- source metric is lab `Rw` / `Rw+Ctr` context only until Gate A maps
  or rejects every substrate/cavity/insulation variant.

## Gate A - MWI.2A Mapping / Tolerance Decision

Gate A should add:

`packages/engine/src/lined-masonry-knauf-mwi2a-mapping-tolerance-gate-a-contract.test.ts`

Required records:

1. `MWI.2A` source locator, table context, row label, and exact
   substrate/cavity variant decision.
2. Live lined-heavy / wall-screening implementation comparison:
   substrate material, substrate mass, board material, board thickness,
   lining side count, furring cavity, coupling, insulation, and field
   context.
3. Local material mapping decisions for `SHEETROCK ONE`, concrete
   panel / core-filled block variants, `KI 25G24`, and `KI 50G11`.
4. Metric policy: whether any source value is usable as lab `Rw`,
   field `R'w`, `DnT,w`, `DnT,A`, or context only.
5. Tolerance owner: named tolerance corridor, rejected tolerance owner,
   or explicit tolerance gap.
6. Negative boundaries:
   `AAC.1A`, `MWI.1A`, floor/ceiling lining rows, generic AAC,
   generic wall-screening concrete, generic lined-heavy, and unrelated
   timber/CLT/floor routes.
7. Next decision:
   - direct runtime import slice only if exact topology, metric owner,
     tolerance owner, local material mapping, protected negatives, and
     paired engine / web visible tests are all named;
   - otherwise no-runtime closeout or a narrower mapping / tolerance
     follow-up.

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

- exact `MWI.2A` topology or a bounded family rule;
- metric owner and lab / field output policy;
- tolerance owner;
- local material mapping for board, substrate, cavity, coupling, and
  insulation;
- protected negative boundaries and near misses;
- paired engine value tests and web route-card / report tests.

If any one of these is missing, Gate A remains no-runtime.

## Gate A Landed Record - 2026-04-30

Gate A landed no-runtime in:

`packages/engine/src/lined-masonry-knauf-mwi2a-mapping-tolerance-gate-a-contract.test.ts`

Recorded source context:

- official Knauf AU Section F `MWI.2A`;
- acoustic ratings basis `RT&A TE405-20S09(R4)`;
- `1x13 mm SHEETROCK ONE` each side;
- side 1 adhesive fixed and side 2 on 28 mm furring channels at
  600 mm centres;
- side 2 furring cavity variants 30 mm and 50 mm;
- insulation variants `Nil`, `KI 25G24`, and `KI 50G11`;
- substrate variants: 150 / 200 mm concrete panel and 140 / 190 mm
  core-filled concrete block families;
- source `MWI.2A` ratings span `Rw 52-61` and `Rw+Ctr 44-51`.

Gate A outcome:

- no exact live topology match;
- no exact substrate-mass or cavity/coupling variant selection for the
  live engine input;
- `SHEETROCK ONE` is context-only against live generic `gypsum_board`;
- concrete panel / core-filled block mapping is blocked against live
  generic 100 mm `concrete`;
- furring-channel and clip coupling is blocked against live generic
  `air_gap`;
- `KI 25G24` and `KI 50G11` are blocked as exact mappings against live
  `rockwool`;
- lab `Rw` context is allowed as source context only;
- field outputs, `STC`, `C`, and `Ctr` remain blocked;
- tolerance owner is still missing;
- all runtime/support/confidence/evidence/API/route-card/output-card/
  proposal/report/workbench-input surfaces remain frozen.

Next action:

`gate_c_no_runtime_closeout_and_next_slice_selection`

Next file:

`packages/engine/src/post-lined-masonry-knauf-mwi2a-mapping-tolerance-v1-next-slice-selection-contract.test.ts`

## Gate C Closeout Record - 2026-04-30

Gate C closed no-runtime in:

`packages/engine/src/post-lined-masonry-knauf-mwi2a-mapping-tolerance-v1-next-slice-selection-contract.test.ts`

Gate C outcome:

- `MWI.2A` remains source context only;
- exact live topology, substrate mass, furring/coupling model,
  `SHEETROCK ONE` mapping, `KI 25G24` / `KI 50G11` mapping, field
  output policy, and tolerance ownership remain incomplete;
- all runtime/support/confidence/evidence/API/route-card/output-card/
  proposal/report/workbench-input surfaces remain frozen;
- `TTF30.2A` is selected next because it is the remaining concrete
  Knauf double-leaf twin timber locator and can map the no-stud / raw
  open-box / simple timber negative boundaries without runtime
  movement.

Next selected slice:

`twin_timber_knauf_ttf302a_mapping_tolerance_v1`

Next file:

`packages/engine/src/twin-timber-knauf-ttf302a-mapping-tolerance-gate-a-contract.test.ts`

Selection status:

`closed_mwi2a_mapping_tolerance_no_runtime_and_selected_knauf_ttf302a_twin_timber_mapping_tolerance_because_mwi2a_lacks_exact_material_metric_tolerance_ownership`

## Validation

Baseline before Gate A:

- `pnpm calculator:gate:current`: green on 2026-04-30 after `TB.5A`
  Gate C closeout, engine 151 files / 743 tests, web 45 files / 216
  passed + 18 skipped, build 5/5 with known non-fatal `sharp/@img`
  warnings, whitespace guard clean.

Gate A completed validation:

- `pnpm --filter @dynecho/engine exec vitest run src/lined-masonry-knauf-mwi2a-mapping-tolerance-gate-a-contract.test.ts --maxWorkers=1`
  green on 2026-04-30, 1 file / 7 tests.
- `pnpm calculator:gate:current`: green on 2026-04-30 after adding
  Gate A, engine 152 files / 750 tests, web 45 files / 216 passed +
  18 skipped, build 5/5 with known non-fatal `sharp/@img` warnings,
  whitespace guard clean.
- `git diff --check`: clean after Gate A validation note sync.

Gate C completed validation:

- `pnpm --filter @dynecho/engine exec vitest run src/post-lined-masonry-knauf-mwi2a-mapping-tolerance-v1-next-slice-selection-contract.test.ts --maxWorkers=1`
  green on 2026-04-30, 1 file / 6 tests.
- `pnpm calculator:gate:current`: green on 2026-04-30 after Gate C,
  engine 153 files / 756 tests, web 45 files / 216 passed + 18
  skipped, build 5/5 with known non-fatal `sharp/@img` warnings,
  whitespace guard clean.

Next slice validation required:

- `pnpm --filter @dynecho/engine exec vitest run src/twin-timber-knauf-ttf302a-mapping-tolerance-gate-a-contract.test.ts --maxWorkers=1`
- `pnpm calculator:gate:current`
- `git diff --check`

Run `pnpm check` only if Gate A selects any runtime import, support /
confidence / evidence promotion, API movement, route-card movement,
output-card movement, proposal/report copy movement, output-support
movement, or workbench-input behavior movement.
