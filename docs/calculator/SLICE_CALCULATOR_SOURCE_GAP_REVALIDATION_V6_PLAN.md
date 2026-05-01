# Slice Plan - Calculator Source Gap Revalidation v6

Slice id: `calculator_source_gap_revalidation_v6`

Status: LANDED / NO RUNTIME MOVEMENT (Gate A landed 2026-04-30 in
`packages/engine/src/calculator-source-gap-revalidation-v6-gate-a-contract.test.ts`).

Latest checkpoint:
[CHECKPOINT_2026-04-30_CALCULATOR_SOURCE_GAP_REVALIDATION_V6_GATE_A_HANDOFF.md](./CHECKPOINT_2026-04-30_CALCULATOR_SOURCE_GAP_REVALIDATION_V6_GATE_A_HANDOFF.md)
lands v6 no-runtime and selects
`steel_stud_knauf_enpc_mapping_tolerance_v1`.

Selection status:

`selected_no_runtime_knauf_enpc_steel_stud_mapping_tolerance_after_v6_rerank_found_no_runtime_ready_candidate`

Prior selection status:

`closed_ttf302a_mapping_tolerance_no_runtime_and_selected_source_gap_revalidation_v6_because_knauf_tb5a_mwi2a_ttf302a_all_lack_exact_material_metric_tolerance_ownership`

Next selected slice:

`steel_stud_knauf_enpc_mapping_tolerance_v1`

Next selected file:

`packages/engine/src/steel-stud-knauf-enpc-mapping-tolerance-gate-a-contract.test.ts`

## Objective

Re-rank the current source / accuracy backlog after the post-Knauf
mapping chain closed no-runtime. The user goal remains broad and
accurate wall/floor acoustic calculation, but runtime movement is only
allowed when a candidate satisfies the full source-ready checklist.

This is a no-runtime revalidation slice unless Gate A proves otherwise.

## Current Posture

The concrete post-Knauf mapping decisions all closed no-runtime:

- `TB.5A` is lab `Rw` / `Rw+Ctr` context only and lacks exact column,
  `SHEETROCK ONE`, `KI 75G11`, field output policy, and tolerance
  ownership.
- `MWI.2A` is lab `Rw` / `Rw+Ctr` context only and lacks exact
  substrate mass, furring/coupling, board / insulation mapping, field
  output policy, and tolerance ownership.
- `TTF30.2A` is lab `Rw` / `Rw+Ctr` context only and lacks exact
  twin-frame topology, `FIBEROCK AQUA-TOUGH`, side asymmetry,
  glasswool placement, field output policy, and tolerance ownership.

Remaining Knauf rows are not runtime-ready:

- `EN-PC-50-055-6-2-12.5-WB-25` remains steel-stud roadmap context;
- `TSF120.1A` remains staggered timber adjacent context;
- `TO120.1A` remains a one-side-lined negative boundary;
- `AAC.1A` remains adjacent AAC / steel-frame context.

## Gate A - Source Gap Revalidation v6 Decision

Gate A should add:

`packages/engine/src/calculator-source-gap-revalidation-v6-gate-a-contract.test.ts`

Gate A landed:

`packages/engine/src/calculator-source-gap-revalidation-v6-gate-a-contract.test.ts`

Landed records:

1. Post-Knauf closeout summary for `TB.5A`, `MWI.2A`, and `TTF30.2A`.
2. Remaining Knauf row re-rank: steel stud, staggered timber,
   one-side-lined negative, and AAC adjacent context.
3. Cross-family re-rank for CLT / mass-timber, generated floor
   fallback, no-stud double-leaf, historical blocked families,
   internal-use evidence, and productization-only tracks.
4. Runtime readiness matrix with exact topology, metric owner,
   tolerance owner, material mapping, protected negative boundaries,
   paired engine tests, and paired web visible tests.
5. Selection of exactly one next slice:
   - runtime work only if a candidate satisfies the full checklist;
   - otherwise select a no-runtime source acquisition, extraction,
     mapping, validation, or revalidation slice.
6. Frozen-surface assertion: runtime, support, confidence, evidence,
   API, route-card, output-card, proposal/report, output support, and
   workbench-input behavior remain unchanged unless the selected
   candidate is fully source-ready.

Gate A selected `steel_stud_knauf_enpc_mapping_tolerance_v1` because
`EN-PC-50-055-6-2-12.5-WB-25` is the highest-value remaining concrete
Knauf locator for a common steel-stud lane. It is still no-runtime:
Wallboard / Acoustic Roll material mapping, stud-gauge equivalence,
field-output policy, row-specific tolerance ownership, existing
steel-anchor precedence, and paired visible tests remain incomplete.

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

## Acceptance Rules

Gate A may select runtime work only if it names all of:

- exact source row, exact topology, or bounded family/formula rule;
- metric owner and lab / field context;
- tolerance owner;
- local material/thickness mapping to engine inputs;
- protected negative boundaries and near misses;
- paired engine value tests and web route-card / report tests.

If any one of these is missing, Gate A remains no-runtime.

## Validation

Baseline before v6:

- `pnpm calculator:gate:current`: green on 2026-04-30 after TTF30.2A
  Gate C selected this slice, engine 155 files / 770 tests, web 45
  files / 216 passed + 18 skipped, build 5/5 with known non-fatal
  `sharp/@img` warnings, whitespace guard clean.

Gate A validation completed after this handoff:

- `pnpm --filter @dynecho/engine exec vitest run src/calculator-source-gap-revalidation-v6-gate-a-contract.test.ts --maxWorkers=1`
  green on 2026-04-30, 1 engine file / 8 tests.
- `pnpm --filter @dynecho/engine exec vitest run src/post-lined-masonry-knauf-mwi2a-mapping-tolerance-v1-next-slice-selection-contract.test.ts src/post-twin-timber-knauf-ttf302a-mapping-tolerance-v1-next-slice-selection-contract.test.ts src/calculator-source-gap-revalidation-v6-gate-a-contract.test.ts --maxWorkers=1`
  green on 2026-04-30, 3 engine files / 20 tests.
- `pnpm calculator:gate:current`
  green on 2026-04-30 after adding Gate A, engine 156 files / 778
  tests, web 45 files / 216 passed + 18 skipped, build 5/5 with known
  non-fatal `sharp/@img` warnings, whitespace guard clean.
- `git diff --check`
  clean after validation note sync.

Run `pnpm check` only if Gate A selects any runtime import, support /
confidence / evidence promotion, API movement, route-card movement,
output-card movement, proposal/report copy movement, output-support
movement, or workbench-input behavior movement.
