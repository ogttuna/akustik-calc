# Checkpoint - 2026-04-24 Resilient Side Count Gate B Ready

Status: checkpoint handoff

## What Was Revalidated

- Active calculator docs were reread against the current implementation
  surface.
- Focused calculator gate passed again:
  - engine: 75 files / 355 tests
  - web: 33 files / 153 tests + 18 skipped
  - build: 5/5 tasks
- Broad `pnpm check` passed again:
  - engine: 208 files / 1175 tests
  - web: 147 files / 845 tests + 18 skipped
  - lint, typecheck, tests, build all green
- `git diff --check` is clean.
- The build still emits the known non-fatal optional `sharp/@img`
  warnings through `@turbodocx/html-to-docx`.

## Implementation Vs Plan

The current plan still matches the real implementation.

The active gap remains explicit resilient-bar side count:

- `packages/shared/src/domain/airborne-context.ts`
- `apps/web/features/workbench/workbench-store.ts`
- `apps/web/features/workbench/preset-definitions.ts`
- `apps/web/features/workbench/workbench-shell.tsx`
- `apps/web/features/workbench/simple-workbench-shell.tsx`
- `apps/web/features/workbench/simple-workbench-route-panel.tsx`

Those surfaces still expose the nearby framed-wall context fields
(`connectionType`, `studType`, `studSpacingMm`) but do not yet model
resilient-bar side count.

The existing Gate A tests remain accurate:

- engine blindness:
  `packages/engine/src/wall-resilient-bar-side-count-blind-audit.test.ts`
- web route/card blindness:
  `apps/web/features/workbench/wall-resilient-bar-side-count-route-card-matrix.test.ts`
- shared schema/store blindness:
  `apps/web/features/workbench/wall-resilient-bar-side-count-input-contract.test.ts`

## Why Gate B Is Still Next

This checkpoint did not uncover a better next move.

Official-source evidence still supports explicit side-count modeling as
the highest-ROI accuracy/coverage step:

- Knauf GB 2026 guide:
  EN-TP-RB1 `Rw 56 dB` vs EN-TP-RB2 `Rw 59 dB`
- British Gypsum:
  A046005 `Rw 55 dB` vs A046006 `Rw 58 dB`

So the current bottleneck is not lack of evidence and not a formula
reopen. It is one missing modeled dimension.

## Current Stop Point

This is a good stopping point because:

- the active slice is unchanged and clearly defined,
- docs and implementation are aligned,
- focused and broad validation are both green,
- no unresolved runtime drift was found,
- the next step is concrete and bounded.

## Next Step On Resume

Execute Gate B of
`wall_resilient_bar_side_count_modeling_v1` in this order:

1. add a shared resilient-bar side-count enum with legacy-stable
   `auto`,
2. plumb it through store, snapshot persistence, preset defaults, and
   shell-to-engine context assembly,
3. add the explicit workbench control in the existing framed-wall route
   UI,
4. prove `auto` preserves the current blind behavior,
5. only then reopen the four RB1/RB2 timber rows for Gate C
   exact-vs-benchmark posture decisions.

## Documents Updated In This Checkpoint

- `AGENTS.md`
- `docs/calculator/NEXT_IMPLEMENTATION_PLAN.md`
- `docs/calculator/CURRENT_STATE.md`
- `docs/calculator/SLICE_WALL_RESILIENT_BAR_SIDE_COUNT_MODELING_PLAN.md`
- this checkpoint file
