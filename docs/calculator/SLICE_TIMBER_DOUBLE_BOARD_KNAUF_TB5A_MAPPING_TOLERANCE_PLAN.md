# Slice Plan - Timber Double-Board Knauf TB.5A Mapping / Tolerance v1

Slice id: `timber_double_board_knauf_tb5a_mapping_tolerance_v1`

Status: CLOSED / NO RUNTIME MOVEMENT (selected 2026-04-30 by
`packages/engine/src/calculator-source-gap-revalidation-v5-gate-a-contract.test.ts`;
Gate A landed and Gate C closed 2026-04-30).

Latest checkpoint:
[CHECKPOINT_2026-04-30_TIMBER_DOUBLE_BOARD_KNAUF_TB5A_MAPPING_TOLERANCE_GATE_C_CLOSEOUT_HANDOFF.md](./CHECKPOINT_2026-04-30_TIMBER_DOUBLE_BOARD_KNAUF_TB5A_MAPPING_TOLERANCE_GATE_C_CLOSEOUT_HANDOFF.md)
closes this slice no-runtime and selects
`lined_masonry_knauf_mwi2a_mapping_tolerance_v1`.

Selection status from v5:

`selected_no_runtime_knauf_tb5a_timber_double_board_mapping_tolerance_after_v5_rerank_found_no_runtime_ready_candidate`

Landed Gate A implementation file:

`packages/engine/src/timber-double-board-knauf-tb5a-mapping-tolerance-gate-a-contract.test.ts`

Gate C closeout implementation file:

`packages/engine/src/post-timber-double-board-knauf-tb5a-mapping-tolerance-v1-next-slice-selection-contract.test.ts`

Selected next slice:

`lined_masonry_knauf_mwi2a_mapping_tolerance_v1`

Selected next first implementation file:

`packages/engine/src/lined-masonry-knauf-mwi2a-mapping-tolerance-gate-a-contract.test.ts`

Gate C selection status:

`closed_tb5a_mapping_tolerance_no_runtime_and_selected_knauf_mwi2a_lined_masonry_mapping_tolerance_because_tb5a_lacks_exact_material_metric_tolerance_ownership`

## Objective

Decide whether Knauf AU `TB.5A` can become a future source-backed
mapping / tolerance path for the live direct timber double-board wall
lane, without changing runtime behavior during Gate A.

This is a no-runtime mapping slice. It must resolve or explicitly keep
blocked:

- the exact `TB.5A` source row and stud-depth column;
- `SHEETROCK ONE` to local board mapping;
- `KI 75G11` to local insulation mapping;
- lab / field metric and output policy;
- the tolerance owner or explicit tolerance gap;
- negative boundaries for `TO120.1A`, `TSF120.1A`, `TTF30.2A`,
  single-board timber rows, and resilient timber rows;
- paired engine and web visible tests required before any later runtime
  import, confidence/support promotion, route-card copy movement, or
  report movement.

## Current Posture

`TB.5A` is the highest-value next source/accuracy step because it is a
concrete Knauf locator for a common company-use lightweight wall lane.
It maps closest to the existing caveated `wall-timber-stud` generated
route, but it is not import-ready.

The existing implementation keeps the live timber double-board route
formula-owned, low confidence, and source-gated. Prior timber
double-board source research proved adjacent single-board, resilient,
and secondary benchmark evidence, but no direct live-stack import row.
Knauf Gate B then found `TB.5A` promising but still incomplete.

## Gate A - TB.5A Mapping / Tolerance Decision

Gate A should add:

`packages/engine/src/timber-double-board-knauf-tb5a-mapping-tolerance-gate-a-contract.test.ts`

Required records:

1. `TB.5A` source locator, table context, row label, and exact column
   decision.
2. Live generated `wall-timber-stud` route topology comparison:
   board count, board material, board thickness, stud material,
   stud spacing, cavity depth, fill type, coupling, and mounting
   context.
3. Local material mapping decisions for `SHEETROCK ONE` and `KI 75G11`.
4. Metric policy: whether the source value is usable as lab `Rw`, field
   `R'w`, `DnT,w`, or context only.
5. Tolerance owner: named tolerance corridor, rejected tolerance owner,
   or explicit tolerance gap.
6. Negative boundaries:
   `TO120.1A` one-side-lined row, `TSF120.1A` staggered-stud row,
   `TTF30.2A` twin timber row, single-board exact imports, RB1/RB2
   resilient imports, steel-stud rows, CLT rows, and masonry rows.
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

- exact `TB.5A` topology or a bounded family rule;
- metric owner and lab / field output policy;
- tolerance owner;
- local material mapping for board and insulation;
- protected negative boundaries and near misses;
- paired engine value tests and web route-card / report tests.

If any one of these is missing, Gate A remains no-runtime.

## Gate A Landed Record - 2026-04-30

Gate A landed no-runtime in:

`packages/engine/src/timber-double-board-knauf-tb5a-mapping-tolerance-gate-a-contract.test.ts`

Recorded source context:

- official Knauf AU Section D `TB.5` / `TB.5A`;
- acoustic ratings basis `RT&A TE405-20S04(R4)`;
- 70 mm stud / 122 mm nominal wall column at `Rw 46 (Rw+Ctr 39)` for
  `KI 75G11`;
- 90 mm stud / 142 mm nominal wall column at `Rw 47 (Rw+Ctr 40)` for
  `KI 75G11`;
- `2x13 mm SHEETROCK ONE` each side and `75 mm KI 75G11` glasswool.

Gate A outcome:

- no exact live topology match;
- no exact stud-depth column selection for the live engine input;
- `SHEETROCK ONE` is context-only against live generic `gypsum_board`;
- `KI 75G11` is blocked as exact mapping against live `rockwool +
  air_gap`;
- lab `Rw` context is allowed as source context only;
- field outputs, `STC`, `C`, and `Ctr` remain blocked;
- tolerance owner is still missing;
- all runtime/support/confidence/evidence/API/route-card/output-card/
  proposal/report/workbench-input surfaces remain frozen.

Next action:

`gate_c_no_runtime_closeout_and_next_slice_selection`

Next file:

`packages/engine/src/post-timber-double-board-knauf-tb5a-mapping-tolerance-v1-next-slice-selection-contract.test.ts`

## Gate C Closeout Record - 2026-04-30

Gate C closed no-runtime in:

`packages/engine/src/post-timber-double-board-knauf-tb5a-mapping-tolerance-v1-next-slice-selection-contract.test.ts`

Closeout outcome:

- `TB.5A` remains source context only;
- no exact live topology match or stud-depth column selection exists;
- `SHEETROCK ONE` and `KI 75G11` mapping remains incomplete;
- lab `Rw` context does not supply field outputs, `STC`, `C`, or
  `Ctr` policy;
- tolerance owner is still missing;
- all runtime/support/confidence/evidence/API/route-card/output-card/
  proposal/report/workbench-input surfaces remain frozen.

Gate C selected the next no-runtime source accuracy step:

`lined_masonry_knauf_mwi2a_mapping_tolerance_v1`

Selected first file:

`packages/engine/src/lined-masonry-knauf-mwi2a-mapping-tolerance-gate-a-contract.test.ts`

Selection status:

`closed_tb5a_mapping_tolerance_no_runtime_and_selected_knauf_mwi2a_lined_masonry_mapping_tolerance_because_tb5a_lacks_exact_material_metric_tolerance_ownership`

Reason: `MWI.2A` is the next ranked concrete Knauf locator after
`TB.5A` and directly targets the lined masonry / heavy-core screening
gap. It remains no-runtime until substrate mass, furring/cavity
coupling, `SHEETROCK ONE`, lab/field metric policy, tolerance
ownership, and visible test ownership are named.

## Validation

Gate A completed:

- `pnpm --filter @dynecho/engine exec vitest run src/timber-double-board-knauf-tb5a-mapping-tolerance-gate-a-contract.test.ts --maxWorkers=1`:
  green on 2026-04-30, 1 file / 7 tests.
- `pnpm calculator:gate:current`: green on 2026-04-30 after Gate A,
  engine 150 files / 737 tests, web 45 files / 216 passed + 18
  skipped, build 5/5 with known non-fatal `sharp/@img` warnings,
  whitespace guard clean.

Gate C completed:

- `pnpm --filter @dynecho/engine exec vitest run src/post-timber-double-board-knauf-tb5a-mapping-tolerance-v1-next-slice-selection-contract.test.ts --maxWorkers=1`:
  green on 2026-04-30, 1 file / 6 tests.
- `pnpm --filter @dynecho/engine exec vitest run src/timber-double-board-knauf-tb5a-mapping-tolerance-gate-a-contract.test.ts src/calculator-source-gap-revalidation-v5-gate-a-contract.test.ts src/post-timber-double-board-knauf-tb5a-mapping-tolerance-v1-next-slice-selection-contract.test.ts --maxWorkers=1`:
  green on 2026-04-30, 3 files / 20 tests.
- `pnpm calculator:gate:current`: green on 2026-04-30 after Gate C,
  engine 151 files / 743 tests, web 45 files / 216 passed + 18
  skipped, build 5/5 with known non-fatal `sharp/@img` warnings,
  whitespace guard clean.

Validate in this order before or after `MWI.2A` Gate A lands:

1. `pnpm --filter @dynecho/engine exec vitest run src/timber-double-board-knauf-tb5a-mapping-tolerance-gate-a-contract.test.ts --maxWorkers=1`
2. `pnpm --filter @dynecho/engine exec vitest run src/post-timber-double-board-knauf-tb5a-mapping-tolerance-v1-next-slice-selection-contract.test.ts --maxWorkers=1`
3. `pnpm --filter @dynecho/engine exec vitest run src/calculator-source-gap-revalidation-v5-gate-a-contract.test.ts --maxWorkers=1`
4. `pnpm calculator:gate:current`
5. `git diff --check`

Run `pnpm check` only if Gate A selects any runtime import, support /
confidence / evidence promotion, API movement, route-card movement,
output-card movement, proposal/report copy movement, output-support
movement, or workbench-input behavior movement.
