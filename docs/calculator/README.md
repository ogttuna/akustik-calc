# Calculator Docs

Use this folder for the current acoustic-calculator and workbench behavior.

This is the primary living doc set for dynamic calculator work. Read these files before using anything under `docs/archive`.

If the question is “what is still open and what executes next?”, start with
[NEXT_IMPLEMENTATION_PLAN.md](./NEXT_IMPLEMENTATION_PLAN.md), then
[CURRENT_STATE.md](./CURRENT_STATE.md), then the latest committed checkpoint.

## New Agent Fast Start

1. Read [CHECKPOINT_2026-04-18_BLOCKED_SOURCE_RERANK_CLOSEOUT_HANDOFF.md](./CHECKPOINT_2026-04-18_BLOCKED_SOURCE_RERANK_CLOSEOUT_HANDOFF.md).
2. Read [NEXT_IMPLEMENTATION_PLAN.md](./NEXT_IMPLEMENTATION_PLAN.md).
3. Run `pnpm calculator:gate:current`.
4. If green, continue the selected slice `mixed_floor_wall_seeded_cross_mode_chain_expansion_v2` from the landed blocked-source rerank closeout.

## Current Execution Snapshot

- primary product aim:
  broader corridor coverage plus higher numerical and provenance accuracy at the
  same time
- active next slice:
  `mixed_floor_wall_seeded_cross_mode_chain_expansion_v2`
- current guardrail:
  all four blocked source-backed runtime candidates are now explicit holds, so
  the next step is a no-runtime shared mixed floor/wall evidence pass instead
  of a reopen-by-inertia runtime widening
- current candidate posture:
  direct `GDMTXA04A`, `C11c`, raw open-box/open-web, reinforced-concrete
  reopening, and wall-selector widening stay blocked; the selected next move
  is seeded cross-mode follow-up evidence on the existing defended boundary
  routes
- last full green validation:
  `2026-04-18`
  - engine: `160/160` test files passed, `960/960` tests passed
  - web: `117/117` test files passed, `674/674` tests passed
  - focused engine gate: `10/10` test files passed, `28/28` tests passed
  - focused web gate: `4/4` test files passed, `23/23` tests passed
  - deep-hybrid web swap scans needed extra timeout headroom under full-suite
    load; no calculator/runtime behavior changed
  - `pnpm typecheck`, `pnpm lint`, `pnpm check`, `pnpm build`, and
    `pnpm calculator:gate:current` green

## Current Hot Files

- [post-blocked-source-backed-widening-rerank-next-slice-selection-contract.test.ts](../../packages/engine/src/post-blocked-source-backed-widening-rerank-next-slice-selection-contract.test.ts): executable blocked-source rerank closeout selection
- [source-gap-candidate-re-rank-contract.test.ts](../../packages/engine/src/source-gap-candidate-re-rank-contract.test.ts): executable blocked-source rerank order and closeout posture
- [blocked-source-rank-1-gdmtxa04a-feasibility-contract.test.ts](../../packages/engine/src/blocked-source-rank-1-gdmtxa04a-feasibility-contract.test.ts): executable rank-1 blocked hold
- [blocked-source-rank-2-c11c-feasibility-contract.test.ts](../../packages/engine/src/blocked-source-rank-2-c11c-feasibility-contract.test.ts): executable rank-2 blocked hold
- [blocked-source-rank-3-raw-bare-open-box-open-web-feasibility-contract.test.ts](../../packages/engine/src/blocked-source-rank-3-raw-bare-open-box-open-web-feasibility-contract.test.ts): executable rank-3 blocked hold
- [blocked-source-rank-4-wall-selector-feasibility-contract.test.ts](../../packages/engine/src/blocked-source-rank-4-wall-selector-feasibility-contract.test.ts): executable rank-4 blocked hold
- [mixed-floor-wall-complex-stack.test.ts](../../packages/engine/src/mixed-floor-wall-complex-stack.test.ts): seeded mixed floor/wall long-chain engine torture anchor
- [mixed-floor-wall-generated-matrix.test.ts](../../packages/engine/src/mixed-floor-wall-generated-matrix.test.ts): seeded mixed floor/wall generated engine grid anchor
- [mixed-study-mode-torture.test.ts](../../apps/web/features/workbench/mixed-study-mode-torture.test.ts): seeded mixed floor/wall route torture anchor
- [mixed-study-mode-generated-history-grid.test.ts](../../apps/web/features/workbench/mixed-study-mode-generated-history-grid.test.ts): generated mixed history-grid web anchor
- [mixed-study-mode-generated-edit-history-matrix.test.ts](../../apps/web/features/workbench/mixed-study-mode-generated-edit-history-matrix.test.ts): generated mixed edit-history web anchor
- [mixed-study-mode-output-card-snapshot-grid.test.ts](../../apps/web/features/workbench/mixed-study-mode-output-card-snapshot-grid.test.ts): saved-scenario and output-card projection anchor
- [run-calculator-current-gate.ts](../../tools/dev/run-calculator-current-gate.ts): single-command focused checkpoint gate
- [SOURCE_GAP_LEDGER.md](./SOURCE_GAP_LEDGER.md): blocked-source closeout and deferred runtime-candidate ledger

## Read Order

1. [NEXT_IMPLEMENTATION_PLAN.md](./NEXT_IMPLEMENTATION_PLAN.md): concise current execution plan and validated next steps
2. [CURRENT_STATE.md](./CURRENT_STATE.md): short snapshot of the current calculator/workbench posture
3. [SYSTEM_MAP.md](./SYSTEM_MAP.md): end-to-end product flow, runtime boundaries, persistence posture, and test surface map
4. [CHECKPOINT_2026-04-18_BLOCKED_SOURCE_RERANK_CLOSEOUT_HANDOFF.md](./CHECKPOINT_2026-04-18_BLOCKED_SOURCE_RERANK_CLOSEOUT_HANDOFF.md): latest checkpoint after the blocked-source rerank closeout
5. [CALCULATION_MODEL_AND_VALIDATION.md](./CALCULATION_MODEL_AND_VALIDATION.md): answer-origin map for formulas, source rows, predictors, field continuations, support gating, and test meaning
6. [SOURCE_GAP_LEDGER.md](./SOURCE_GAP_LEDGER.md): source-backed widening, tightening, and deferred-family boundaries
7. [DYNAMIC_CALCULATOR_REMAINING_WORK_PLAN.md](./DYNAMIC_CALCULATOR_REMAINING_WORK_PLAN.md): cross-floor/wall remaining work, completion status, and safe execution order
8. [DYNAMIC_CALCULATOR_COVERAGE_ACCURACY_PLAN.md](./DYNAMIC_CALCULATOR_COVERAGE_ACCURACY_PLAN.md): current execution model for coverage growth, accuracy tightening, and test-first slice planning
9. [DYNAMIC_CALCULATOR_PLAN.md](./DYNAMIC_CALCULATOR_PLAN.md): active implementation order and long-form backlog
10. [../archive/analysis/README.md](../archive/analysis/README.md): dated investigations and reproduction notes
