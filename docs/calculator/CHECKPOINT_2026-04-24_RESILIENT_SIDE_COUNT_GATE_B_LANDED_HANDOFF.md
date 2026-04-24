# Checkpoint - 2026-04-24 Resilient Side Count Gate B Landed

Status: checkpoint handoff

## What Landed

Gate B of `wall_resilient_bar_side_count_modeling_v1` is implemented.

The calculator now has an explicit resilient-bar side-count model
dimension:

- `auto`
- `one_side`
- `both_sides`

The field is named `resilientBarSideCount` in runtime context and
`airborneResilientBarSideCount` in workbench scenario state.

Gate B is propagation-only. It does not promote any RB1/RB2 timber row,
does not retune the broad timber formula, and does not change current
route/card values.

## Implementation Vs Plan

The Gate B plan and implementation now agree:

- `packages/shared/src/domain/airborne-context.ts` exports
  `AirborneResilientBarSideCountSchema` and accepts optional
  `resilientBarSideCount`.
- `apps/web/features/workbench/workbench-store.ts` stores the selected
  side count, defaults legacy scenarios to `auto`, and round-trips saved
  scenarios.
- `apps/web/features/workbench/preset-definitions.ts` allows future
  preset defaults without forcing current presets to invent side-count
  semantics.
- `apps/web/features/workbench/server-project-workbench-snapshot.ts`
  preserves valid server snapshot values and drops invalid values before
  restore.
- `apps/web/features/workbench/workbench-shell.tsx` and
  `apps/web/features/workbench/simple-workbench-shell.tsx` pass the
  value into live runtime context.
- `apps/web/features/workbench/airborne-context-panel.tsx` and
  `apps/web/features/workbench/simple-workbench-route-panel.tsx` expose
  the same framed-wall control.
- `packages/engine/src/dynamic-airborne-family-detection.ts` carries the
  normalized hint while deliberately not letting side count alone trigger
  framed-wall route selection.
- `packages/engine/src/airborne-verified-catalog.ts` can now match
  future exact or companion entries that include explicit side-count
  metadata while existing rows remain legacy-compatible.

## Executable Evidence

Focused targeted tests passed after the implementation:

- web Gate B propagation and snapshot tests:
  4 files / 21 tests green
- engine side-count propagation and catalog tests:
  2 files / 14 tests green
- new planning contract:
  `post-wall-resilient-side-count-gate-b-v1-next-slice-selection-contract.test.ts`
  1 file / 4 tests green

The post-Gate-B focused current gate passed and is the active resume
validation:

- engine focused gate: 76 files / 360 tests
- web focused gate: 33 files / 155 tests + 18 skipped
- repo build: 5/5 tasks
- whitespace guard: `git diff --check` clean
- additional web typecheck: `pnpm --filter @dynecho/web typecheck` green

The previous broad `pnpm check` from the Gate B ready checkpoint remains
the latest broad all-repo validation. Gate B added focused coverage and
uses `pnpm calculator:gate:current` as the closeout gate unless a later
runtime/value change requires full `pnpm check`.

## Current Stop Point

Gate B is closed. The active slice remains open for Gate C.

The next work is not another plumbing pass. The next work is a
row-by-row source posture decision for the four official RB1/RB2 timber
rows.

## Next Step On Resume

Execute Gate C of
`wall_resilient_bar_side_count_modeling_v1` in this order:

1. Review the four RB1/RB2 timber rows against the landed
   `resilientBarSideCount` model.
2. Decide, per row, whether the current topology and board mapping are
   exact-representable.
3. Choose exactly one posture per row:
   - exact import,
   - narrower benchmark lane,
   - still blocked.
4. Pin any user-visible route/card/value change in both engine and web
   tests before accepting it.
5. Keep `auto` legacy behavior value-stable unless Gate C explicitly
   changes and pins a source-backed route.

## Boundaries Still Active

- Do not retune the broad timber-stud formula from nearby green tests.
- Do not promote resilient rows by adjacency alone.
- Do not reopen `GDMTXA04A`, `C11c`, raw open-box/open-web,
  heavy-concrete parity or formula scope, reinforced-concrete reopening,
  wall-selector behavior, timber-stud widening, or floor blocked-source
  families from this slice.
- Keep `project_access_policy_route_integration_v1` deferred until the
  selected calculator slice closes or priority explicitly changes.

## Documents Updated In This Checkpoint

- `AGENTS.md`
- `docs/calculator/NEXT_IMPLEMENTATION_PLAN.md`
- `docs/calculator/CURRENT_STATE.md`
- `docs/calculator/SYSTEM_MAP.md`
- `docs/calculator/SLICE_WALL_RESILIENT_BAR_SIDE_COUNT_MODELING_PLAN.md`
- `tools/dev/run-calculator-current-gate.ts`
- this checkpoint file
