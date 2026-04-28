# Checkpoint - Wall Framed Facing Split Warning Stability Gate C Closeout

Date: 2026-04-28

## Scope

Gate C closed `wall_framed_facing_split_warning_stability_v1`.

Executable evidence:

- `packages/engine/src/post-wall-framed-facing-split-warning-stability-v1-next-slice-selection-contract.test.ts`
- `packages/engine/src/wall-framed-facing-split-warning-stability-gate-a-contract.test.ts`
- `packages/engine/src/wall-framed-facing-split-warning-stability-gate-b-contract.test.ts`
- `apps/web/features/workbench/wall-framed-facing-split-warning-stability-route-card-matrix.test.ts`

## Closeout

The slice closes with a bounded runtime fix already covered by Gate B:

- LSF field/building board splits keep baseline values:
  `R'w=51`, `Dn,w=51`, `Dn,A=49.6`, `DnT,w=52`, `DnT,A=51.1`,
  `STC=51`, `C=-1.4`, `Ctr=-6.4`.
- the split-only framed reinforcement monotonic-floor warning is gone;
- LSF lab exact stays anchored at `Rw=55`;
- timber lab/field board splits stay stable;
- paired web route-card coverage pins visible cards and acoustic
  warnings;
- global same-material board coalescing remains disallowed, and the
  coalesced 25 mm board-per-face topology remains a different route.

## Decision

The next selected slice is:

`calculator_source_gap_revalidation_v3`

Planning surface:

`docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V3_PLAN.md`

First bounded action:

`packages/engine/src/calculator-source-gap-revalidation-v3-gate-a-contract.test.ts`

Reason: the framed split fix was local and does not unlock source-gated
wall/floor families. The next honest step is a no-runtime rerank of the
remaining source and accuracy gaps before any new runtime, confidence,
support, evidence, API, or route-card movement.

## Validation

- Targeted Gate C validation:
  `pnpm --filter @dynecho/engine exec vitest run src/post-wall-framed-facing-split-warning-stability-v1-next-slice-selection-contract.test.ts --maxWorkers=1`
  green: 1 file / 5 tests.
- Focused current-gate validation after Gate C:
  `pnpm calculator:gate:current` green with 128 engine files / 601
  tests, 44 web files / 212 passed + 18 skipped, build 5/5, known
  non-fatal `sharp/@img` warnings, whitespace guard clean.

## Handoff

Read this checkpoint after `docs/calculator/NEXT_IMPLEMENTATION_PLAN.md`.
Then continue at `calculator_source_gap_revalidation_v3` Gate A. Do not
reopen source-blocked families from the framed split fix alone.
