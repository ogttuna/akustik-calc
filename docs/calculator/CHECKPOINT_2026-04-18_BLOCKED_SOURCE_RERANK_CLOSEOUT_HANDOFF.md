# Checkpoint 2026-04-18 Blocked Source Rerank Closeout Handoff

Document role:

- define the current checkpoint after the blocked source-backed rerank closes
  cleanly
- map the living plan to implemented work without pretending a blocked runtime
  candidate is reopening
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
   `mixed_floor_wall_seeded_cross_mode_chain_expansion_v2`.
4. Open:
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
5. Run `pnpm calculator:gate:current` before touching behavior code.

Do not reopen `GDMTXA04A`, raw open-box/open-web, `C11c`,
reinforced-concrete, heavy-concrete parity, or wall-selector widening first.
The next safe step after the rerank closeout is the selected seeded mixed
floor/wall evidence follow-up.

## Current Answer In One Screen

- latest closed implementation slice:
  `blocked_source_backed_widening_rerank_v1`
- latest selected next slice:
  `mixed_floor_wall_seeded_cross_mode_chain_expansion_v2`
- current checkpoint rule:
  all four ranked runtime candidates are explicit blocked holds, so the next
  move is a no-runtime shared mixed floor/wall evidence expansion rather than
  a runtime reopen
- explicit not-done item:
  no blocked runtime/source candidate has been reopened; the selected next work
  is longer seeded cross-mode evidence on already-defended boundary routes

## What Closed In This Checkpoint

- `blocked_source_backed_widening_rerank_v1`
  - kept rank-1 `GDMTXA04A` blocked on honest composite dry-screed surface
    modeling
  - kept rank-2 `C11c` blocked on its unresolved combined wet tuple anomaly
  - kept rank-3 raw bare open-box/open-web blocked because current TUAS and
    UBIQ evidence remains packaged-system evidence, not true bare-carrier
    impact evidence
  - kept rank-4 wall-selector behavior blocked because the current wall
    trace/card guard is already closed and no fresh classified wall red exists
  - exhausted the comparison queue without changing runtime behavior
- closeout selection result:
  - selected `mixed_floor_wall_seeded_cross_mode_chain_expansion_v2`
  - reason: after the rerank exhausted its blocked candidates, the highest-ROI
    next move is a shared no-runtime evidence pass on existing defended seeded
    boundary routes

No solver, catalog, selector, or numeric calculator behavior changed in the
closeout selection step itself.

## File Map For This Checkpoint

- closeout planning contract:
  [post-blocked-source-backed-widening-rerank-next-slice-selection-contract.test.ts](../../packages/engine/src/post-blocked-source-backed-widening-rerank-next-slice-selection-contract.test.ts)
- closed rerank evidence:
  - [source-gap-candidate-re-rank-contract.test.ts](../../packages/engine/src/source-gap-candidate-re-rank-contract.test.ts)
  - [blocked-source-rank-1-gdmtxa04a-feasibility-contract.test.ts](../../packages/engine/src/blocked-source-rank-1-gdmtxa04a-feasibility-contract.test.ts)
  - [blocked-source-rank-2-c11c-feasibility-contract.test.ts](../../packages/engine/src/blocked-source-rank-2-c11c-feasibility-contract.test.ts)
  - [blocked-source-rank-3-raw-bare-open-box-open-web-feasibility-contract.test.ts](../../packages/engine/src/blocked-source-rank-3-raw-bare-open-box-open-web-feasibility-contract.test.ts)
  - [blocked-source-rank-4-wall-selector-feasibility-contract.test.ts](../../packages/engine/src/blocked-source-rank-4-wall-selector-feasibility-contract.test.ts)
- selected mixed floor/wall anchors:
  - [mixed-floor-wall-complex-stack.test.ts](../../packages/engine/src/mixed-floor-wall-complex-stack.test.ts)
  - [mixed-floor-wall-generated-matrix.test.ts](../../packages/engine/src/mixed-floor-wall-generated-matrix.test.ts)
  - [mixed-study-mode-torture.test.ts](../../apps/web/features/workbench/mixed-study-mode-torture.test.ts)
  - [mixed-study-mode-generated-history-grid.test.ts](../../apps/web/features/workbench/mixed-study-mode-generated-history-grid.test.ts)
  - [mixed-study-mode-generated-edit-history-matrix.test.ts](../../apps/web/features/workbench/mixed-study-mode-generated-edit-history-matrix.test.ts)
  - [mixed-study-mode-output-card-snapshot-grid.test.ts](../../apps/web/features/workbench/mixed-study-mode-output-card-snapshot-grid.test.ts)
- current focused gate:
  [run-calculator-current-gate.ts](../../tools/dev/run-calculator-current-gate.ts)
- source-backed boundary ledger:
  [SOURCE_GAP_LEDGER.md](./SOURCE_GAP_LEDGER.md)

## What Is Planned But Not Done Now

- `mixed_floor_wall_seeded_cross_mode_chain_expansion_v2`
  is selected and not started
  - broaden seeded cross-mode edit-chain families beyond the current second
    wall-family expansion
  - keep the work on already-defended seeded boundary routes only
  - reuse the existing mixed torture, generated history-grid, generated
    edit-history, and output-card projection surfaces instead of inventing a
    new broad family grid
- still blocked:
  - `dataholz_gdmtxa04a_visible_exact_reopen`
  - `tuas_c11c_exact_import`
  - `raw_bare_open_box_open_web_impact_widening`
  - `wall_selector_behavior_widening`

## Validation Gate For This Checkpoint

Revalidated on `2026-04-18` after widening the deep-hybrid web swap timeout
headroom for broad full-suite load:

- `pnpm calculator:gate:current`
  - green
  - focused engine gate: `10/10` test files passed, `28/28` tests passed
  - focused web gate: `4/4` test files passed, `23/23` tests passed
- `pnpm check`
  - green
  - full engine suite: `160/160` test files passed, `960/960` tests passed
  - full web suite: `117/117` test files passed, `674/674` tests passed
- `pnpm build`
  - green with the known optional `sharp/@img` warnings from the DOCX path
- `git diff --check`
  - green

No calculator/runtime behavior changed in this validation hardening pass; the
only landed code change was extra timeout headroom for the slowest broad-scan
web swap cohorts.

## Exact Resume Target

Keep the next scope on:

- planning contract:
  [post-blocked-source-backed-widening-rerank-next-slice-selection-contract.test.ts](../../packages/engine/src/post-blocked-source-backed-widening-rerank-next-slice-selection-contract.test.ts)
- engine companions:
  [mixed-floor-wall-complex-stack.test.ts](../../packages/engine/src/mixed-floor-wall-complex-stack.test.ts)
  and
  [mixed-floor-wall-generated-matrix.test.ts](../../packages/engine/src/mixed-floor-wall-generated-matrix.test.ts)
- web companions:
  [mixed-study-mode-torture.test.ts](../../apps/web/features/workbench/mixed-study-mode-torture.test.ts),
  [mixed-study-mode-generated-history-grid.test.ts](../../apps/web/features/workbench/mixed-study-mode-generated-history-grid.test.ts),
  [mixed-study-mode-generated-edit-history-matrix.test.ts](../../apps/web/features/workbench/mixed-study-mode-generated-edit-history-matrix.test.ts),
  and
  [mixed-study-mode-output-card-snapshot-grid.test.ts](../../apps/web/features/workbench/mixed-study-mode-output-card-snapshot-grid.test.ts)

Do not claim a blocked runtime candidate is reopening until this selected
shared follow-up exposes a fresh classified runtime red and a new selection
contract records that decision explicitly.
