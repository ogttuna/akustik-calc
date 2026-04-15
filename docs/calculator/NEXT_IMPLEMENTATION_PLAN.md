# Next Implementation Plan

Last reviewed: 2026-04-15

Document role:

- authoritative current next-step plan for calculator work
- use this before any long-form backlog or historical checkpoint note
- keep older long-form backlog detail in:
  - [DYNAMIC_CALCULATOR_REMAINING_WORK_PLAN.md](./DYNAMIC_CALCULATOR_REMAINING_WORK_PLAN.md)
  - [DYNAMIC_CALCULATOR_COVERAGE_ACCURACY_PLAN.md](./DYNAMIC_CALCULATOR_COVERAGE_ACCURACY_PLAN.md)
  - [DYNAMIC_CALCULATOR_PLAN.md](./DYNAMIC_CALCULATOR_PLAN.md)

Read together with:

- [CURRENT_STATE.md](./CURRENT_STATE.md)
- [CHECKPOINT_2026-04-15_REQUESTED_OUTPUT_HISTORY_REPLAY_HANDOFF.md](./CHECKPOINT_2026-04-15_REQUESTED_OUTPUT_HISTORY_REPLAY_HANDOFF.md)
- [CHECKPOINT_2026-04-14_FORMULA_PROVENANCE_DOSSIER_HANDOFF.md](./CHECKPOINT_2026-04-14_FORMULA_PROVENANCE_DOSSIER_HANDOFF.md)
- [CALCULATION_MODEL_AND_VALIDATION.md](./CALCULATION_MODEL_AND_VALIDATION.md)
- [SOURCE_GAP_LEDGER.md](./SOURCE_GAP_LEDGER.md)

## Verified Against Implementation - 2026-04-15

- latest closed implementation slice:
  `mixed_floor_wall_requested_output_history_replay_grid_expansion_v1`
- the remembered repo state was correct:
  - the selected requested-output history replay shared torture slice was still
    open
  - it now closes target-green without runtime widening
  - the overall plan is still not finished after that closeout
- local verification run in this closeout pass:
  - `pnpm --filter @dynecho/engine test`
    - green: `126` files / `859` tests
  - `pnpm --filter @dynecho/web test`
    - green: `113` files / `645` tests
  - `pnpm calculator:gate:current`
    - green
  - `pnpm typecheck`
    - green
  - `pnpm lint`
    - green
  - `pnpm build`
    - green with the known optional `sharp/@img` warnings from the DOCX path
  - `git diff --check`
    - green

## Current Position

- latest committed checkpoint:
  `CHECKPOINT_2026-04-15_REQUESTED_OUTPUT_HISTORY_REPLAY_HANDOFF.md`
- latest closed implementation slice:
  `mixed_floor_wall_requested_output_history_replay_grid_expansion_v1`
- latest closed behavior:
  the selected mixed floor/wall seeded boundary routes now keep custom
  requested-output bundles stable across hostile edit-history replay, long
  cross-mode history chains, and save/load restore without widening
  solver/catalog/runtime behavior
- closed planning action in this pass:
  `post_mixed_floor_wall_requested_output_history_replay_grid_next_slice_selection_v1`
- selected next implementation slice:
  `mixed_floor_wall_requested_output_card_history_replay_grid_expansion_v1`
- slice type:
  no-runtime evidence expansion
- implementation status:
  selected and contract-guarded, but not implemented yet
- explicit not-done item at this checkpoint:
  `mixed_floor_wall_requested_output_card_history_replay_grid_expansion_v1`
  has not landed durable test expansion yet; visible requested-output
  output-card replay posture remains the next open hardening target
- immediate rule:
  finish the requested-output output-card history replay grid before any new
  source, formula, or wall-selector widening

## Why This Slice Was Chosen

- the selected six-route ledger is now target-green on custom requested-output
  bundle replay and restore posture
- the remaining shared posture gap is no longer bundle persistence in store
  state; it is explicit user-facing output-card projection posture for those
  same custom bundles after long replay chains
- the user flow depends on cards staying honest after hostile edit history, not
  only the hidden `requestedOutputs` array
- this remains safer than reopening raw-source, Dataholz, `C11c`,
  heavy-concrete formula, or wall-selector runtime scope

## Implementation Comparison That Drove The Decision

Already present and defended:

- engine mixed route surfaces:
  - `packages/engine/src/mixed-floor-wall-complex-stack.test.ts`
  - `packages/engine/src/mixed-floor-wall-generated-matrix.test.ts`
- workbench mixed history/card surfaces:
  - `apps/web/features/workbench/mixed-study-mode-generated-matrix.test.ts`
  - `apps/web/features/workbench/mixed-study-mode-generated-edit-history-matrix.test.ts`
  - `apps/web/features/workbench/mixed-study-mode-generated-history-grid.test.ts`
  - `apps/web/features/workbench/mixed-study-mode-output-card-snapshot-grid.test.ts`
  - `apps/web/features/workbench/mixed-study-mode-torture.test.ts`
- explicit high-risk route ids already present in the generated helper set:
  - `route-wall-held-aac`
  - `route-wall-heavy-composite-hint-suppression`
  - `route-dataholz-gdmtxa04a-boundary`
  - `route-tuas-c11c-fail-closed`
  - `route-open-box-exact`
  - `route-open-web-bound`
- current planning-contract guard already present:
  - `packages/engine/src/post-mixed-floor-wall-requested-output-history-replay-grid-next-slice-selection-contract.test.ts`

Not frozen broadly enough yet:

- selected custom requested-output output-card status/value posture across
  expanded edit-history replay variants
- long cross-mode generated-history output-card restore after custom
  requested-output bundle selection
- targeted selected-route proof that the restored cards still align with the
  same support buckets after those replay chains

Current implementation gaps that matter for this slice:

- `packages/engine/src/mixed-floor-wall-generated-matrix.test.ts` now carries
  the selected support-bucket companion guard, and that surface should stay
  live while the user-facing card projection breadth expands
- `apps/web/features/workbench/mixed-study-mode-output-card-snapshot-grid.test.ts`
  proves default resets, direct split detours, and selected save-load restores,
  but it does not yet pin custom requested-output card projection posture
  across the expanded edit-history/history-grid replay chains already defended
  one layer below
- `apps/web/features/workbench/mixed-study-mode-generated-edit-history-matrix.test.ts`
  and `mixed-study-mode-generated-history-grid.test.ts` now prove the hidden
  requested-output bundle survives, but they do not prove the visible output
  cards stay aligned after the same abuse

## Selected Next Slice

- slice id:
  `mixed_floor_wall_requested_output_card_history_replay_grid_expansion_v1`
- workstream:
  `shared_torture_pass`
- route family:
  `mixed_floor_wall_seeded_boundary_routes`
- output surface:
  `workbench_requested_output_card_history_replay_posture`
- engine companion surface:
  `mixed_generated_route_support_bucket_parity`
- behavior class:
  no-runtime test/evidence widening

### Scope

- widen custom requested-output output-card replay posture for the same
  selected seed ledger
- keep scope on longer history-chain pressure rather than new route families
- keep the same compact seed set from the closed selected-ledger slices
- prove direct vs replayed/restored output-card posture and support snapshots
  stay aligned through:
  - custom requested-output bundle selection per study mode
  - output-card status/value parity after edit-history replay variants
  - output-card status/value parity after long cross-mode generated-history
    chains with save/load replay
  - opposite-mode detours and return restores after those chains
  - support-bucket companion parity on the selected engine routes

### Compact Seed Set For This Slice

- wall held boundary:
  `route-wall-held-aac`
- wall heavy-composite control:
  `route-wall-heavy-composite-hint-suppression`
- Dataholz manual-match boundary:
  `route-dataholz-gdmtxa04a-boundary`
- TUAS fail-closed boundary:
  `route-tuas-c11c-fail-closed`
- exact floor control:
  `route-open-box-exact`
- bound floor control:
  `route-open-web-bound`

Use this compact seed set as the minimum exact scope for the slice. Existing
broader generated cases may stay in helper-led matrix tests, but this slice is
not allowed to close unless these six ids are explicitly pinned in the targeted
implementation tests.

### Non-goals

- no raw bare open-box/open-web impact widening
- no `GDMTXA04A` visible exact reopen
- no `C11c` exact import
- no broad heavy-concrete formula widening
- no wall-selector behavior change
- no large-file extraction unless this slice exposes a real red

### Focused Test Pack

- engine:
  - `packages/engine/src/mixed-floor-wall-generated-matrix.test.ts`
- web:
  - `apps/web/features/workbench/mixed-study-mode-output-card-snapshot-grid.test.ts`
- planning contract:
  - `packages/engine/src/post-mixed-floor-wall-requested-output-history-replay-grid-next-slice-selection-contract.test.ts`

### Required Stressors Per Seed

- custom requested-output bundle selection per study mode
- output-card status/value parity after duplicate/swap/remove/rebuild replay
- opposite-mode output-card restore after replay pressure
- save/load requested-output card restore after long generated-history chains
- supported/unsupported target-output bucket parity on the engine companion

At least one targeted test surface must explicitly prove each stressor across
the compact seed set above. Do not rely on a broad helper matrix alone as proof
that the selected six route ids were all pinned.

### Acceptance

- custom requested-output output cards stay aligned for the selected seed set
  across edit-history replay, long cross-mode chains, and save/load restore
- selected-route support posture stays projection-identical after those replay
  chains
- no numeric result delta appears without a classified bug and a separate
  follow-up slice
- targeted test pack is green
- close the slice with a new planning pass:
  `post_mixed_floor_wall_requested_output_card_history_replay_grid_next_slice_selection_v1`

### Execution Checklist

1. Keep the selected six-route ledger fixed; do not widen route family scope in
   this slice.
2. Keep the engine generated companion surface live first.
   `packages/engine/src/mixed-floor-wall-generated-matrix.test.ts` should keep
   selected-route support-bucket posture visible while the web replay surfaces
   expand.
3. Expand the output-card projection surface second.
   `mixed-study-mode-output-card-snapshot-grid.test.ts` should pin custom
   requested-output card posture across the selected replay variants and
   save/load restore.
4. Keep the generated replay helpers honest.
   Reuse the already closed generated edit-history/history-grid surfaces as the
   structural chain substrate; do not reopen row-only gaps while widening the
   visible card surface.
5. Keep the slice no-runtime.
   No exact import, formula lane, selector behavior, source row, or supported
   family widening is allowed while doing the above.
6. Re-run the focused pack before any broad rerun.
   Run the new planning contract and the three targeted slice files first; only
   if they stay green move to full engine/web suite revalidation.
7. Close the slice only if requested-output output-card replay breadth,
   selected-ledger breadth, and targeted green status are all explicit in the
   final doc/test diff.
   Then open
   `post_mixed_floor_wall_requested_output_card_history_replay_grid_next_slice_selection_v1`.

### Focused Validation Order

1. `pnpm --filter @dynecho/engine exec vitest run src/post-mixed-floor-wall-requested-output-history-replay-grid-next-slice-selection-contract.test.ts src/mixed-floor-wall-generated-matrix.test.ts --maxWorkers=1`
2. `pnpm --filter @dynecho/web exec vitest run features/workbench/mixed-study-mode-output-card-snapshot-grid.test.ts --maxWorkers=1`
3. `pnpm --filter @dynecho/engine test`
4. `pnpm --filter @dynecho/web test`
5. `git diff --check`

### Slice Stop Conditions

- stop and re-scope if the engine companion surface requires solver/catalog
  changes to make the selected seed ledger pass
- stop and classify separately if any selected seed shows a numeric delta
  rather than pure requested-output card replay / restore posture drift
- stop and extract a helper/architecture sub-slice first if the targeted tests
  start duplicating large blocks of generated-case logic in an unreadable way

## Explicitly Deferred After This Selection

- raw bare open-box/open-web impact widening
  - still blocked by missing bare carrier impact evidence
- Dataholz `GDMTXA04A` visible exact reopen
  - still blocked by the missing honest visible composite dry-screed surface
- TUAS `C11c` exact import
  - still blocked by the unexplained weak weighted tuple
- broad heavy-concrete formula family widening
  - current recent work only hardened already-scoped formula lanes and mixed
    shared posture
- wall-selector behavior widening
  - still blocked until the shared torture pass is broader or a fresh
    classified red appears

## Immediate Next Steps

1. Keep this plan as the authoritative next-step file.
2. Execute
   `mixed_floor_wall_requested_output_card_history_replay_grid_expansion_v1`
   as a no-runtime test/evidence slice.
3. If that closes green, select between:
   - the next still-justified no-runtime evidence slice
   - the next mixed shared-torture hardening slice
4. Keep runtime widening blocked until the mixed shared posture pass is broader
   and still green.
