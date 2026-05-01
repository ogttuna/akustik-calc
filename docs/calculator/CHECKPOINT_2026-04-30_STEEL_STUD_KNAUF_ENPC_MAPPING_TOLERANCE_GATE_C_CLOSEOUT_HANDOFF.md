# Checkpoint - Steel Stud Knauf EN-PC Mapping / Tolerance Gate C Closeout Handoff

Date: 2026-04-30

Slice: `steel_stud_knauf_enpc_mapping_tolerance_v1`

Gate: C

Status: CLOSED / NO RUNTIME MOVEMENT

## Decision

`packages/engine/src/post-steel-stud-knauf-enpc-mapping-tolerance-v1-next-slice-selection-contract.test.ts`
closes `steel_stud_knauf_enpc_mapping_tolerance_v1` no-runtime.

Gate C does not select runtime import, value movement, support
promotion, confidence promotion, evidence promotion, output support
movement, API movement, route-card movement, output-card movement,
proposal/report copy movement, or workbench-input behavior movement.

Next selected slice:

`calculator_source_gap_revalidation_v7`

Next selected file:

`packages/engine/src/calculator-source-gap-revalidation-v7-gate-a-contract.test.ts`

Gate C selection status:

`closed_enpc_mapping_tolerance_no_runtime_and_selected_source_gap_revalidation_v7_because_all_concrete_knauf_mapping_rows_lack_exact_material_metric_tolerance_ownership`

## Closeout Evidence

`EN-PC-50-055-6-2-12.5-WB-25` remains source context only:

- Knauf UK source row: 50 mm 0.55 gauge C metal stud at 600 mm
  centres, `2x12.5 mm` Wallboard each side, `25 mm` Knauf Insulation
  Acoustic Roll, lab `Rw 49`;
- live route anchor: `knauf_lab_416889_primary_2026`, `Rw 55`,
  acoustic gypsum board, 70 mm glasswool, and 5 mm air gap;
- live field route remains formula / field owned and not lab-fallback
  exact.

Runtime remains blocked because:

- Wallboard to live `acoustic_gypsum_board` mapping is context only;
- `25 mm` Acoustic Roll does not exact-map to `70 mm` glasswool plus
  `5 mm` air gap;
- 50 mm / 0.55 gauge stud detail is not selectable from current live
  engine inputs;
- lab `Rw 49` does not supply `R'w`, `Dn,w`, `Dn,A`, `DnT,w`,
  `DnT,A`, `C`, `Ctr`, `STC`, or tolerance ownership;
- paired engine and web visible tests for any runtime or copy movement
  are not named.

## Protected Boundaries

The closeout keeps these boundaries active:

- existing `knauf_lab_416889_primary_2026` acoustic-board exact anchor;
- existing `knauf_lab_416702_primary_2026` generic-gypsum adjacent
  anchor;
- field / building output proxies;
- `TB.5A`, `MWI.2A`, and `TTF30.2A` closed no-runtime source context;
- `AAC.1A`, `TSF120.1A`, and `TO120.1A` adjacent / negative context.

## Why v7 Is Next

The concrete Knauf mapping chain has now closed no-runtime:

- `TB.5A` lacks exact material, metric, tolerance, and visible-test
  ownership.
- `MWI.2A` lacks exact material, metric, tolerance, and visible-test
  ownership.
- `TTF30.2A` lacks exact material, metric, tolerance, and visible-test
  ownership.
- `EN-PC-50-055-6-2-12.5-WB-25` lacks exact material, metric,
  tolerance, and visible-test ownership.

The next honest accuracy step is a fresh revalidation, not another
runtime import attempt. `calculator_source_gap_revalidation_v7` must
re-rank remaining Knauf adjacent rows, CLT / mass-timber, generated
floor fallback, no-stud double-leaf, lined-heavy, and historical
blocked families before selecting any narrow follow-up.

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

`packages/engine/src/calculator-source-gap-revalidation-v7-gate-a-contract.test.ts`

Gate A may select runtime work only if it names exact topology or a
bounded family rule, metric owner, tolerance owner, local material
mapping, protected negative boundaries, and paired engine/web visible
tests. Otherwise it must select the next no-runtime source acquisition,
extraction, mapping, validation, or revalidation slice.

## Validation

Baseline before Gate C:

- `pnpm calculator:gate:current`: green on 2026-04-30 after EN-PC Gate
  A, engine 157 files / 785 tests, web 45 files / 216 passed + 18
  skipped, build 5/5 with known non-fatal `sharp/@img` warnings,
  whitespace guard clean.

Completed after this handoff:

- `pnpm --filter @dynecho/engine exec vitest run src/post-steel-stud-knauf-enpc-mapping-tolerance-v1-next-slice-selection-contract.test.ts --maxWorkers=1`
  green on 2026-04-30, 1 engine file / 6 tests.
- `pnpm --filter @dynecho/engine exec vitest run src/steel-stud-knauf-enpc-mapping-tolerance-gate-a-contract.test.ts src/post-steel-stud-knauf-enpc-mapping-tolerance-v1-next-slice-selection-contract.test.ts --maxWorkers=1`
  green on 2026-04-30, 2 engine files / 13 tests.
- `pnpm calculator:gate:current` green on 2026-04-30 after Gate C,
  engine 158 files / 791 tests, web 45 files / 216 passed + 18
  skipped, build 5/5 with known non-fatal `sharp/@img` warnings,
  whitespace guard clean.
- `git diff --check` clean after validation note sync.

Run `pnpm check` only if a later gate selects runtime/import/visible
behavior movement or if this checkpoint is promoted to a release gate.
