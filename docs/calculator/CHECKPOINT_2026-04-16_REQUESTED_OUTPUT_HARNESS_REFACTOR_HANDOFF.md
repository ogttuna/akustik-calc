# Checkpoint 2026-04-16 Requested Output Harness Refactor Handoff

Document role:

- define the current committed checkpoint after the requested-output snapshot
  harness hardening chain
- map the living plan to the implemented work without pretending the next slice
  is already done
- give the next agent a short restart path, a fresh validation gate, and an
  explicit not-done list

This is a checkpoint document, not a new solver plan.

Use [NEXT_IMPLEMENTATION_PLAN.md](./NEXT_IMPLEMENTATION_PLAN.md) as the current
next-step authority. Use [CURRENT_STATE.md](./CURRENT_STATE.md) as the broader
living snapshot. Use [SYSTEM_MAP.md](./SYSTEM_MAP.md) when the next agent needs
a fast explanation of the live runtime and file boundaries.

## Two-Minute Restart

1. Read this file first.
2. Open [NEXT_IMPLEMENTATION_PLAN.md](./NEXT_IMPLEMENTATION_PLAN.md).
3. Confirm the active selected slice is still
   `mixed_floor_wall_output_card_snapshot_requested_output_surface_runner_loop_extraction_v1`.
4. Open
   [mixed-study-mode-output-card-snapshot-grid.test.ts](../../apps/web/features/workbench/mixed-study-mode-output-card-snapshot-grid.test.ts),
   [mixed-study-mode-output-card-snapshot-requested-output-runners.ts](../../apps/web/features/workbench/mixed-study-mode-output-card-snapshot-requested-output-runners.ts),
   and
   [mixed-study-mode-output-card-snapshot-requested-output-variant-drivers.ts](../../apps/web/features/workbench/mixed-study-mode-output-card-snapshot-requested-output-variant-drivers.ts).
5. Run `pnpm calculator:gate:current` before touching runtime code.

Do not start with catalog or solver widening. The next safe step remains a
no-runtime output-card harness extraction slice.

## Current Answer In One Screen

- latest closed implementation slice:
  `mixed_floor_wall_output_card_snapshot_requested_output_variant_branch_driver_extraction_v1`
- latest selected but not yet implemented slice:
  `mixed_floor_wall_output_card_snapshot_requested_output_surface_runner_loop_extraction_v1`
- current checkpoint rule:
  do not widen runtime/source/formula/selector scope until the requested-output
  surface runner-loop harness closes green
- explicit not-done item:
  output-card requested-output coverage is green, and the shared variant-driver
  layer now exists, but the runner helper still duplicates broad / selected /
  representative outer loop orchestration, case-selection wiring, label
  scaffolding, and failure-closeout structure across `10` exported runners

## File Map For This Checkpoint

- visible assertion surface:
  [mixed-study-mode-output-card-snapshot-grid.test.ts](../../apps/web/features/workbench/mixed-study-mode-output-card-snapshot-grid.test.ts)
- requested-output harness hotspot:
  [mixed-study-mode-output-card-snapshot-requested-output-runners.ts](../../apps/web/features/workbench/mixed-study-mode-output-card-snapshot-requested-output-runners.ts)
- shared requested-output branch setup:
  [mixed-study-mode-output-card-snapshot-requested-output-variant-drivers.ts](../../apps/web/features/workbench/mixed-study-mode-output-card-snapshot-requested-output-variant-drivers.ts)
- extracted low-level snapshot helpers:
  [mixed-study-mode-output-card-snapshot-test-helpers.ts](../../apps/web/features/workbench/mixed-study-mode-output-card-snapshot-test-helpers.ts)
- engine companion:
  [mixed-floor-wall-generated-matrix.test.ts](../../packages/engine/src/mixed-floor-wall-generated-matrix.test.ts)
- current focused gate:
  [run-calculator-current-gate.ts](../../tools/dev/run-calculator-current-gate.ts)

## What Closed Before This Checkpoint

- `mixed_floor_wall_output_card_snapshot_grid_helper_extraction_v1`
  - low-level snapshot-grid harness helpers moved into a dedicated helper file
  - the visible snapshot-grid file dropped from about `2145` lines to about
    `1515` lines
- `mixed_floor_wall_output_card_snapshot_requested_output_runner_extraction_v1`
  - broad / selected / representative requested-output runner bodies moved into
    a dedicated runner helper
  - the visible snapshot-grid file dropped further to about `315` lines while
    requested-output orchestration moved into a focused helper
- `mixed_floor_wall_output_card_snapshot_requested_output_save_load_detour_driver_extraction_v1`
  - shared requested-output baseline, save/load, and opposite-mode detour
    restore setup is now centralized
- `mixed_floor_wall_output_card_snapshot_requested_output_variant_branch_driver_extraction_v1`
  - compact replay, edit-history, and partial-restore branch setup is now
    centralized in `mixed-study-mode-output-card-snapshot-requested-output-variant-drivers.ts`
  - `mixed-study-mode-output-card-snapshot-requested-output-runners.ts`
    dropped from about `1147` lines to about `979` lines

None of those slices changed runtime or numeric calculator behavior.

## What Was Planned But Not Done In This Checkpoint

- `mixed_floor_wall_output_card_snapshot_requested_output_surface_runner_loop_extraction_v1`
  remains selected-only
  - no shared outer runner-loop harness landed yet for broad / selected /
    representative requested-output snapshot surfaces
  - no new runtime/source/formula widening was attempted for this slice
- no new runtime widenings were opened for:
  - raw bare open-box/open-web impact
  - visible `GDMTXA04A` exact reopen
  - `C11c` exact import
  - broad heavy-concrete formula widening
  - wall-selector behavior widening

## Validation Gate For This Checkpoint

Revalidated on `2026-04-16`:

- `pnpm calculator:gate:current`
  - green
- `pnpm --filter @dynecho/engine test`
  - green: `140` files / `887` tests
- `pnpm --filter @dynecho/web test`
  - green: `113` files / `655` tests
- `pnpm typecheck`
  - green
- `pnpm lint`
  - green
- `pnpm build`
  - green with the known optional `sharp/@img` warnings from the DOCX path
- `git diff --check`
  - green

## Minimal Resume Commands

1. `pnpm calculator:gate:current`
2. `pnpm --filter @dynecho/web exec vitest run features/workbench/mixed-study-mode-output-card-snapshot-grid.test.ts features/workbench/mixed-study-mode-generated-history-grid.test.ts features/workbench/mixed-study-mode-generated-edit-history-matrix.test.ts --maxWorkers=1`
3. `pnpm --filter @dynecho/engine exec vitest run src/post-mixed-floor-wall-output-card-snapshot-requested-output-variant-branch-driver-extraction-next-slice-selection-contract.test.ts src/mixed-floor-wall-generated-matrix.test.ts --maxWorkers=1`

## Exact Resume Target

Keep the next scope on:

- planning contract:
  [post-mixed-floor-wall-output-card-snapshot-requested-output-variant-branch-driver-extraction-next-slice-selection-contract.test.ts](../../packages/engine/src/post-mixed-floor-wall-output-card-snapshot-requested-output-variant-branch-driver-extraction-next-slice-selection-contract.test.ts)
- web visible posture target:
  [mixed-study-mode-output-card-snapshot-grid.test.ts](../../apps/web/features/workbench/mixed-study-mode-output-card-snapshot-grid.test.ts)
- requested-output runner helper:
  [mixed-study-mode-output-card-snapshot-requested-output-runners.ts](../../apps/web/features/workbench/mixed-study-mode-output-card-snapshot-requested-output-runners.ts)
- requested-output variant-driver helper:
  [mixed-study-mode-output-card-snapshot-requested-output-variant-drivers.ts](../../apps/web/features/workbench/mixed-study-mode-output-card-snapshot-requested-output-variant-drivers.ts)
- engine companion:
  [mixed-floor-wall-generated-matrix.test.ts](../../packages/engine/src/mixed-floor-wall-generated-matrix.test.ts)
- living plan:
  [NEXT_IMPLEMENTATION_PLAN.md](./NEXT_IMPLEMENTATION_PLAN.md)

Do not claim the active slice is closed until the requested-output runner
helper shares the broad / selected / representative outer loop shell without
hiding scenario meaning or weakening current green output-card evidence.
