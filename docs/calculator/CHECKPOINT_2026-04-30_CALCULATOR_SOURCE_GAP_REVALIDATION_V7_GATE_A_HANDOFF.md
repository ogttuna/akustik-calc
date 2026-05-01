# Checkpoint - Calculator Source Gap Revalidation v7 Gate A Handoff

Date: 2026-04-30

Slice: `calculator_source_gap_revalidation_v7`

Gate: A

Status: LANDED / NO RUNTIME MOVEMENT

## Decision

`packages/engine/src/calculator-source-gap-revalidation-v7-gate-a-contract.test.ts`
lands v7 Gate A no-runtime.

Gate A does not select runtime import, value movement, support
promotion, confidence promotion, evidence promotion, output support
movement, API movement, route-card movement, output-card movement,
proposal/report copy movement, or workbench-input behavior movement.

Next selected slice:

`calculator_post_knauf_source_acquisition_v1`

Next selected file:

`packages/engine/src/calculator-post-knauf-source-acquisition-gate-a-contract.test.ts`

Gate A selection status:

`selected_post_knauf_source_acquisition_v1_after_v7_rerank_found_no_runtime_ready_candidate_and_current_sources_exhausted`

## Rerank Evidence

The concrete Knauf mapping chain remains closed no-runtime:

- `TB.5A` lacks exact stud-depth column, `SHEETROCK ONE`, `KI 75G11`,
  lab/field policy, tolerance ownership, and visible-test ownership.
- `MWI.2A` lacks exact substrate mass, furring/cavity coupling,
  `SHEETROCK ONE`, `KI` material mapping, field policy, tolerance
  ownership, and visible-test ownership.
- `TTF30.2A` lacks exact twin-frame gap, side asymmetry,
  `FIBEROCK AQUA-TOUGH`, column selection, glasswool placement, field
  policy, tolerance ownership, and visible-test ownership.
- `EN-PC-50-055-6-2-12.5-WB-25` lacks Wallboard / Acoustic Roll /
  stud-depth-gauge mapping, field-output policy, spectrum-term policy,
  tolerance ownership, and visible-test ownership.

Remaining Knauf rows do not outrank new source acquisition:

- `AAC.1A` remains AAC / steel-frame adjacent context only.
- `TSF120.1A` remains staggered timber adjacent context only.
- `TO120.1A` remains a one-side-lined negative boundary.

Non-Knauf families are still source-gated. CLT / mass-timber,
generated floor fallback, no-stud double-leaf, lined-heavy / heavy-core,
timber double-board, and historical blocked families all still need new
exact topology, metric, tolerance, material mapping, negative-boundary,
and visible-test evidence before runtime movement can be selected.

## Why Source Acquisition Is Next

The v7 rerank found no source-ready runtime pack. It also found that
the current Knauf and non-Knauf source reservoirs have already been
classified enough to reject runtime movement. The next useful accuracy
step is therefore post-Knauf source acquisition, not another direct
runtime attempt and not productization-only work.

`calculator_post_knauf_source_acquisition_v1` must acquire and classify
fresh official source locators for the highest-value floor and wall
gaps, then select a narrow extraction / mapping slice only if a concrete
locator satisfies the no-runtime evidence bar.

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

`packages/engine/src/calculator-post-knauf-source-acquisition-gate-a-contract.test.ts`

Gate A may select runtime work only if it names exact topology or a
bounded family rule, metric owner, tolerance owner, local material
mapping, protected negative boundaries, and paired engine/web visible
tests. Otherwise it must select source extraction, mapping, validation,
or another acquisition pass no-runtime.

## Validation

Baseline before Gate A:

- `pnpm calculator:gate:current`: green on 2026-04-30 before v7 edits,
  engine 158 files / 791 tests, web 45 files / 216 passed + 18 skipped,
  build 5/5 with known non-fatal `sharp/@img` warnings, whitespace
  guard clean.

Gate A validation completed on 2026-04-30:

- `pnpm --filter @dynecho/engine exec vitest run src/calculator-source-gap-revalidation-v7-gate-a-contract.test.ts --maxWorkers=1`:
  1 file / 8 tests passed.
- `pnpm --filter @dynecho/engine exec vitest run src/steel-stud-knauf-enpc-mapping-tolerance-gate-a-contract.test.ts src/post-steel-stud-knauf-enpc-mapping-tolerance-v1-next-slice-selection-contract.test.ts src/calculator-source-gap-revalidation-v7-gate-a-contract.test.ts --maxWorkers=1`:
  3 files / 21 tests passed after preserving historical EN-PC doc
  sync tokens.
- `pnpm calculator:gate:current`: green, engine 159 files / 799 tests,
  web 45 files / 216 passed + 18 skipped, build 5/5 with known
  non-fatal `sharp/@img` warnings, whitespace guard clean.
- `git diff --check`: clean.

Run `pnpm check` only if a later gate selects runtime/import/visible
behavior movement or if this checkpoint is promoted to a release gate.
