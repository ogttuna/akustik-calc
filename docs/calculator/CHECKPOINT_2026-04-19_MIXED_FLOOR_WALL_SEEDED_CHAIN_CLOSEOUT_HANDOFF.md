# Checkpoint 2026-04-19 Mixed Floor Wall Seeded Chain Closeout Handoff

Document role:

- define the current checkpoint after the mixed seeded floor/wall no-runtime
  follow-up closes cleanly
- map the living plan to implemented work without pretending a blocked runtime
  candidate has reopened
- give the next agent a short restart path, a fresh validation gate, and an
  explicit not-done list

This is a checkpoint document, not a new solver plan.

Use [NEXT_IMPLEMENTATION_PLAN.md](./NEXT_IMPLEMENTATION_PLAN.md) as the current
next-step authority.
Use [CURRENT_STATE.md](./CURRENT_STATE.md) as the short verified snapshot.
Use [SYSTEM_MAP.md](./SYSTEM_MAP.md) for the live runtime/file map.

## Two-Minute Restart

1. Read this file first.
2. Open [NEXT_IMPLEMENTATION_PLAN.md](./NEXT_IMPLEMENTATION_PLAN.md).
3. Confirm the active selected slice is now
   `blocked_source_backed_widening_rerank_refresh_v2`.
4. Open:
   - [post-mixed-floor-wall-seeded-cross-mode-chain-next-slice-selection-contract.test.ts](../../packages/engine/src/post-mixed-floor-wall-seeded-cross-mode-chain-next-slice-selection-contract.test.ts)
   - [post-blocked-source-backed-widening-rerank-next-slice-selection-contract.test.ts](../../packages/engine/src/post-blocked-source-backed-widening-rerank-next-slice-selection-contract.test.ts)
   - [source-gap-candidate-re-rank-contract.test.ts](../../packages/engine/src/source-gap-candidate-re-rank-contract.test.ts)
   - [blocked-source-rank-1-gdmtxa04a-feasibility-contract.test.ts](../../packages/engine/src/blocked-source-rank-1-gdmtxa04a-feasibility-contract.test.ts)
   - [blocked-source-rank-2-c11c-feasibility-contract.test.ts](../../packages/engine/src/blocked-source-rank-2-c11c-feasibility-contract.test.ts)
   - [blocked-source-rank-3-raw-bare-open-box-open-web-feasibility-contract.test.ts](../../packages/engine/src/blocked-source-rank-3-raw-bare-open-box-open-web-feasibility-contract.test.ts)
   - [blocked-source-rank-4-wall-selector-feasibility-contract.test.ts](../../packages/engine/src/blocked-source-rank-4-wall-selector-feasibility-contract.test.ts)
   - [mixed-floor-wall-complex-stack.test.ts](../../packages/engine/src/mixed-floor-wall-complex-stack.test.ts)
   - [mixed-floor-wall-generated-matrix.test.ts](../../packages/engine/src/mixed-floor-wall-generated-matrix.test.ts)
   - [mixed-study-mode-torture.test.ts](../../apps/web/features/workbench/mixed-study-mode-torture.test.ts)
   - [mixed-study-mode-generated-history-grid.test.ts](../../apps/web/features/workbench/mixed-study-mode-generated-history-grid.test.ts)
   - [mixed-study-mode-generated-edit-history-matrix.test.ts](../../apps/web/features/workbench/mixed-study-mode-generated-edit-history-matrix.test.ts)
   - [mixed-study-mode-output-card-snapshot-grid.test.ts](../../apps/web/features/workbench/mixed-study-mode-output-card-snapshot-grid.test.ts)
   - [mixed-study-mode-output-card-snapshot-requested-output-surface-descriptors.test.ts](../../apps/web/features/workbench/mixed-study-mode-output-card-snapshot-requested-output-surface-descriptors.test.ts)
5. Run `pnpm calculator:gate:current` before touching behavior code.

Do not reopen `GDMTXA04A`, raw open-box/open-web, `C11c`,
reinforced-concrete, heavy-concrete parity, or wall-selector widening first.
The next safe step after the seeded-chain closeout is the blocked-source rerank
refresh, not a direct runtime reopen.

## Current Answer In One Screen

- latest closed implementation slice:
  `mixed_floor_wall_seeded_cross_mode_chain_expansion_v2`
- latest selected next slice:
  `blocked_source_backed_widening_rerank_refresh_v2`
- current checkpoint rule:
  the mixed seeded floor/wall follow-up is closed and no fresh classified
  runtime red emerged, so the next move is a no-runtime blocked-source rerank
  refresh rather than a direct runtime reopen
- explicit not-done item:
  no blocked runtime/source candidate has been reopened; the selected next work
  is to refresh that blocked candidate order against the now-closed mixed
  seeded evidence pack

## What Closed In This Checkpoint

- `mixed_floor_wall_seeded_cross_mode_chain_expansion_v2`
  - widened selected seeded edit-history replay to longer reversed split-order
    chains
  - widened selected duplicate/swap replay from a single global reverse toggle
    to explicit per-plan reverse-mask variants
  - widened selected requested-output restore lanes onto the same reverse-mask
    branch while keeping broad and representative requested-output surfaces on
    their compact branch
  - added a descriptor contract so the requested-output branch split stays
    pinned in the focused gate
  - no solver, catalog, selector, or numeric calculator behavior changed
- closeout selection result:
  - selected `blocked_source_backed_widening_rerank_refresh_v2`
  - reason: the shared seeded follow-up is now closed cleanly and still did
    not produce a fresh classified runtime red, so the honest next step is to
    refresh the blocked-source order instead of reopening a candidate by
    inertia

No solver, catalog, selector, or numeric calculator behavior changed in the
closeout selection step itself.

## File Map For This Checkpoint

- closeout planning contract:
  [post-mixed-floor-wall-seeded-cross-mode-chain-next-slice-selection-contract.test.ts](../../packages/engine/src/post-mixed-floor-wall-seeded-cross-mode-chain-next-slice-selection-contract.test.ts)
- blocked-source rerank evidence:
  - [post-blocked-source-backed-widening-rerank-next-slice-selection-contract.test.ts](../../packages/engine/src/post-blocked-source-backed-widening-rerank-next-slice-selection-contract.test.ts)
  - [source-gap-candidate-re-rank-contract.test.ts](../../packages/engine/src/source-gap-candidate-re-rank-contract.test.ts)
  - [blocked-source-rank-1-gdmtxa04a-feasibility-contract.test.ts](../../packages/engine/src/blocked-source-rank-1-gdmtxa04a-feasibility-contract.test.ts)
  - [blocked-source-rank-2-c11c-feasibility-contract.test.ts](../../packages/engine/src/blocked-source-rank-2-c11c-feasibility-contract.test.ts)
  - [blocked-source-rank-3-raw-bare-open-box-open-web-feasibility-contract.test.ts](../../packages/engine/src/blocked-source-rank-3-raw-bare-open-box-open-web-feasibility-contract.test.ts)
  - [blocked-source-rank-4-wall-selector-feasibility-contract.test.ts](../../packages/engine/src/blocked-source-rank-4-wall-selector-feasibility-contract.test.ts)
- closed mixed seeded evidence anchors:
  - [mixed-floor-wall-complex-stack.test.ts](../../packages/engine/src/mixed-floor-wall-complex-stack.test.ts)
  - [mixed-floor-wall-generated-matrix.test.ts](../../packages/engine/src/mixed-floor-wall-generated-matrix.test.ts)
  - [mixed-study-mode-torture.test.ts](../../apps/web/features/workbench/mixed-study-mode-torture.test.ts)
  - [mixed-study-mode-generated-history-grid.test.ts](../../apps/web/features/workbench/mixed-study-mode-generated-history-grid.test.ts)
  - [mixed-study-mode-generated-edit-history-matrix.test.ts](../../apps/web/features/workbench/mixed-study-mode-generated-edit-history-matrix.test.ts)
  - [mixed-study-mode-output-card-snapshot-grid.test.ts](../../apps/web/features/workbench/mixed-study-mode-output-card-snapshot-grid.test.ts)
  - [mixed-study-mode-output-card-snapshot-requested-output-surface-descriptors.test.ts](../../apps/web/features/workbench/mixed-study-mode-output-card-snapshot-requested-output-surface-descriptors.test.ts)
- current focused gate:
  [run-calculator-current-gate.ts](../../tools/dev/run-calculator-current-gate.ts)
- source-backed boundary ledger:
  [SOURCE_GAP_LEDGER.md](./SOURCE_GAP_LEDGER.md)

## What Is Planned But Not Done Now

- `blocked_source_backed_widening_rerank_refresh_v2`
  is selected and not started
  - refresh the blocked candidate order against the closed mixed seeded chain
  - keep all four current runtime candidates fail-closed unless a fresh
    classified runtime red now exists
  - close the refresh with an explicit next-slice selection contract instead of
    silently reopening a candidate
- still blocked:
  - `dataholz_gdmtxa04a_visible_exact_reopen`
  - `tuas_c11c_exact_import`
  - `raw_bare_open_box_open_web_impact_widening`
  - `wall_selector_behavior_widening`

## Validation Gate For This Checkpoint

Revalidated on `2026-04-19` after the selected requested-output branch split
and the mixed seeded closeout selection landed:

- `pnpm calculator:gate:current`
  - green
  - focused engine gate: `11/11` test files passed, `31/31` tests passed
  - focused web gate: `5/5` test files passed, `25/25` tests passed
- `pnpm check`
  - green
  - full engine suite: `160/160` test files passed, `961/961` tests passed
  - full web suite: `118/118` test files passed, `676/676` tests passed
- `pnpm build`
  - green with the known optional `sharp/@img` warnings from the DOCX path
- `git diff --check`
  - green

No calculator/runtime behavior changed in this closeout selection pass; the
landed code is closeout contract, focused-gate, and documentation wiring only.

## Exact Resume Target

Keep the next scope on:

- planning contract:
  [post-mixed-floor-wall-seeded-cross-mode-chain-next-slice-selection-contract.test.ts](../../packages/engine/src/post-mixed-floor-wall-seeded-cross-mode-chain-next-slice-selection-contract.test.ts)
- blocked-source refresh anchors:
  [post-blocked-source-backed-widening-rerank-next-slice-selection-contract.test.ts](../../packages/engine/src/post-blocked-source-backed-widening-rerank-next-slice-selection-contract.test.ts)
  and
  [source-gap-candidate-re-rank-contract.test.ts](../../packages/engine/src/source-gap-candidate-re-rank-contract.test.ts)
- closed mixed seeded evidence pack:
  [mixed-floor-wall-complex-stack.test.ts](../../packages/engine/src/mixed-floor-wall-complex-stack.test.ts),
  [mixed-floor-wall-generated-matrix.test.ts](../../packages/engine/src/mixed-floor-wall-generated-matrix.test.ts),
  [mixed-study-mode-torture.test.ts](../../apps/web/features/workbench/mixed-study-mode-torture.test.ts),
  [mixed-study-mode-generated-history-grid.test.ts](../../apps/web/features/workbench/mixed-study-mode-generated-history-grid.test.ts),
  [mixed-study-mode-generated-edit-history-matrix.test.ts](../../apps/web/features/workbench/mixed-study-mode-generated-edit-history-matrix.test.ts),
  [mixed-study-mode-output-card-snapshot-grid.test.ts](../../apps/web/features/workbench/mixed-study-mode-output-card-snapshot-grid.test.ts),
  and
  [mixed-study-mode-output-card-snapshot-requested-output-surface-descriptors.test.ts](../../apps/web/features/workbench/mixed-study-mode-output-card-snapshot-requested-output-surface-descriptors.test.ts)

Do not claim a blocked runtime candidate is reopening until this rerank refresh
records that decision explicitly in a new executable selection contract.
