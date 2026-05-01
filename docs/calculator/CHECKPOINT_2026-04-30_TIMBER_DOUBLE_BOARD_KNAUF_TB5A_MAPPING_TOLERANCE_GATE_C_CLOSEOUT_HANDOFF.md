# Checkpoint - Timber Double-Board Knauf TB.5A Mapping / Tolerance Gate C Closeout Handoff

Date: 2026-04-30

Slice: `timber_double_board_knauf_tb5a_mapping_tolerance_v1`

Gate: Gate C

Status: CLOSED / NO RUNTIME MOVEMENT

## Decision

`packages/engine/src/post-timber-double-board-knauf-tb5a-mapping-tolerance-v1-next-slice-selection-contract.test.ts`
closes the `TB.5A` mapping / tolerance slice no-runtime.

Gate C does not select runtime import, value movement, support
promotion, confidence promotion, evidence promotion, output support
movement, API movement, route-card movement, output-card movement,
proposal/report copy movement, or workbench-input behavior movement.

Next selected slice:

`lined_masonry_knauf_mwi2a_mapping_tolerance_v1`

Next file:

`packages/engine/src/lined-masonry-knauf-mwi2a-mapping-tolerance-gate-a-contract.test.ts`

Selection status:

`closed_tb5a_mapping_tolerance_no_runtime_and_selected_knauf_mwi2a_lined_masonry_mapping_tolerance_because_tb5a_lacks_exact_material_metric_tolerance_ownership`

## Closeout Evidence

Gate A proved `TB.5A` is useful lab context but not a runtime import:

- source row basis: Knauf AU Section D `TB.5A`,
  `RT&A TE405-20S04(R4)`;
- `2x13 mm SHEETROCK ONE` each side with `KI 75G11`;
- 70 mm stud / 122 mm wall column gives `Rw 46 (Rw+Ctr 39)`;
- 90 mm stud / 142 mm wall column gives `Rw 47 (Rw+Ctr 40)`;
- live route still uses generic `gypsum_board`, `rockwool + air_gap`,
  and no explicit stud-depth column input;
- field outputs, `STC`, `C`, and `Ctr` remain blocked;
- no tolerance owner is named.

## Next Slice Rationale

`MWI.2A` is selected next because it is the next ranked concrete Knauf
locator after `TB.5A` and directly targets the lined masonry /
heavy-core screening gap.

It is still no-runtime. It must map or reject:

- concrete panel / core-filled block substrate mass;
- `1x13 mm SHEETROCK ONE` board mapping;
- 28 mm furring channels, furring cavity, coupling, and insulation;
- lab `Rw` / `Rw+Ctr` versus field-output policy;
- tolerance ownership;
- `AAC.1A`, `MWI.1A`, floor-only lining rows, and generic heavy-core
  negative boundaries.

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

- `pnpm --filter @dynecho/engine exec vitest run src/timber-double-board-knauf-tb5a-mapping-tolerance-gate-a-contract.test.ts --maxWorkers=1`:
  green on 2026-04-30, 1 file / 7 tests.
- `pnpm calculator:gate:current`: green on 2026-04-30 after Gate A,
  engine 150 files / 737 tests, web 45 files / 216 passed + 18
  skipped, build 5/5 with known non-fatal `sharp/@img` warnings,
  whitespace guard clean.

Completed after this handoff:

- `pnpm --filter @dynecho/engine exec vitest run src/post-timber-double-board-knauf-tb5a-mapping-tolerance-v1-next-slice-selection-contract.test.ts --maxWorkers=1`:
  green on 2026-04-30, 1 file / 6 tests.
- `pnpm --filter @dynecho/engine exec vitest run src/timber-double-board-knauf-tb5a-mapping-tolerance-gate-a-contract.test.ts src/calculator-source-gap-revalidation-v5-gate-a-contract.test.ts src/post-timber-double-board-knauf-tb5a-mapping-tolerance-v1-next-slice-selection-contract.test.ts --maxWorkers=1`:
  green on 2026-04-30, 3 files / 20 tests.
- `pnpm calculator:gate:current`: green on 2026-04-30 after Gate C,
  engine 151 files / 743 tests, web 45 files / 216 passed + 18
  skipped, build 5/5 with known non-fatal `sharp/@img` warnings,
  whitespace guard clean.

Still run before `MWI.2A` Gate A lands:

- `pnpm --filter @dynecho/engine exec vitest run src/lined-masonry-knauf-mwi2a-mapping-tolerance-gate-a-contract.test.ts --maxWorkers=1`
- `pnpm calculator:gate:current`
- `git diff --check`

Run `pnpm check` only if a later gate selects runtime/import/visible
behavior movement or if this checkpoint is promoted to a release gate.
