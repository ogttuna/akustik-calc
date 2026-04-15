# Checkpoint 2026-04-15 Requested Output History Replay Handoff

Document role:

- define the current committed end-of-day checkpoint after the mixed
  floor/wall requested-output history replay guard
- map the living plan to the implemented work without pretending the next slice
  is already done
- give the next agent a short restart path and an explicit not-done list

This is a checkpoint document, not a new solver plan.

Use [NEXT_IMPLEMENTATION_PLAN.md](./NEXT_IMPLEMENTATION_PLAN.md) as the current
next-step authority. Use [CURRENT_STATE.md](./CURRENT_STATE.md) as the broader
living snapshot.

## Two-Minute Restart

1. Read this file first.
2. Open [NEXT_IMPLEMENTATION_PLAN.md](./NEXT_IMPLEMENTATION_PLAN.md).
3. Confirm the active selected slice is still
   `mixed_floor_wall_requested_output_card_history_replay_grid_expansion_v1`.
4. Open
   [mixed-study-mode-output-card-snapshot-grid.test.ts](../../apps/web/features/workbench/mixed-study-mode-output-card-snapshot-grid.test.ts)
   and
   [mixed-floor-wall-generated-matrix.test.ts](../../packages/engine/src/mixed-floor-wall-generated-matrix.test.ts).
5. Run `pnpm calculator:gate:current` before touching runtime code.

Do not start with catalog or solver widening. The next safe step remains a
no-runtime output-card replay hardening slice.

## Current Answer In One Screen

- latest closed implementation slice:
  `mixed_floor_wall_requested_output_history_replay_grid_expansion_v1`
- latest selected but not yet implemented slice:
  `mixed_floor_wall_requested_output_card_history_replay_grid_expansion_v1`
- current checkpoint rule:
  do not widen runtime/source/formula/selector scope until the requested-output
  output-card replay slice closes green
- explicit not-done item:
  the selected six-route custom requested-output bundle is guarded in store
  state and replay/history surfaces, but its visible output-card
  status/value/support projection is not yet widened across the same hostile
  replay chains

## What Closed Before This Checkpoint

- `mixed_floor_wall_requested_output_reset_grid_expansion_v1`
  - selected six-route requested-output defaults, opposite-mode resets, and
    save/load restore posture are now explicit
- `mixed_floor_wall_requested_output_history_replay_grid_expansion_v1`
  - the selected six-route ledger now keeps custom requested-output bundles
    stable across hostile edit-history replay, long cross-mode history chains,
    and save/load restore
  - this closure widened no runtime behavior

## What Was Planned But Not Done Today

- `mixed_floor_wall_requested_output_card_history_replay_grid_expansion_v1`
  remains selected-only
  - no durable test expansion landed for visible custom requested-output
    output-card status/value posture across the expanded replay chains
  - no solver/catalog/runtime changes were attempted for this slice
- no new runtime widenings were opened for:
  - raw bare open-box/open-web impact
  - visible `GDMTXA04A` exact reopen
  - `C11c` exact import
  - broad heavy-concrete formula widening
  - wall-selector behavior widening

## Validation Gate For This Checkpoint

Revalidated on `2026-04-15`:

- `pnpm calculator:gate:current`
  - green
- `pnpm --filter @dynecho/engine test`
  - green: `126` files / `859` tests
- `pnpm --filter @dynecho/web test`
  - green: `113` files / `645` tests
- `pnpm typecheck`
  - green
- `pnpm lint`
  - green
- `pnpm build`
  - green with the known optional `sharp/@img` warnings from the DOCX path
- `git diff --check`
  - green

Checkpoint note:

- one earlier full-engine rerun in this session produced timeout-heavy noise in
  `calculate-assembly.test.ts`, but the isolated file rerun and the final full
  engine suite both passed green
- no open engine red or classified runtime bug is carried forward from that
  transient failure

## Exact Resume Target

Keep tomorrow's scope on:

- planning contract:
  [post-mixed-floor-wall-requested-output-history-replay-grid-next-slice-selection-contract.test.ts](../../packages/engine/src/post-mixed-floor-wall-requested-output-history-replay-grid-next-slice-selection-contract.test.ts)
- engine companion:
  [mixed-floor-wall-generated-matrix.test.ts](../../packages/engine/src/mixed-floor-wall-generated-matrix.test.ts)
- web visible posture target:
  [mixed-study-mode-output-card-snapshot-grid.test.ts](../../apps/web/features/workbench/mixed-study-mode-output-card-snapshot-grid.test.ts)
- living plan:
  [NEXT_IMPLEMENTATION_PLAN.md](./NEXT_IMPLEMENTATION_PLAN.md)

Do not claim the active slice is closed until the output-card surface proves
custom requested-output card posture across the selected replay variants and
long save/load restore chains.
