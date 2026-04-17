# Calculator Docs

Use this folder for the current acoustic-calculator and workbench behavior.

This is the primary living doc set for dynamic calculator work. Read these files before using anything under `docs/archive`.

If the question is “what is still open and what executes next?”, start with
[NEXT_IMPLEMENTATION_PLAN.md](./NEXT_IMPLEMENTATION_PLAN.md), then
[CURRENT_STATE.md](./CURRENT_STATE.md), then the latest committed checkpoint.

## New Agent Fast Start

1. Read [CHECKPOINT_2026-04-17_DATAHOLZ_CLT_CALIBRATION_TIGHTENING_CLOSEOUT_HANDOFF.md](./CHECKPOINT_2026-04-17_DATAHOLZ_CLT_CALIBRATION_TIGHTENING_CLOSEOUT_HANDOFF.md).
2. Read [NEXT_IMPLEMENTATION_PLAN.md](./NEXT_IMPLEMENTATION_PLAN.md).
3. Run `pnpm calculator:gate:current`.
4. If green, continue the selected slice `blocked_source_backed_widening_rerank_v1` by treating raw bare open-box/open-web as a rank-3 feasibility audit, not as a pre-approved widening.

## Current Execution Snapshot

- primary product aim:
  broader corridor coverage plus higher numerical and provenance accuracy at the
  same time
- active next slice:
  `blocked_source_backed_widening_rerank_v1`
- current guardrail:
  requested-output output-card harness work is hard-stopped; the defended CLT
  calibration pass is closed and the next step is a no-runtime blocked-source
  rerank
- current candidate posture:
  blocked-source rerank is selected; direct `GDMTXA04A`, `C11c`, raw
  open-box/open-web, reinforced-concrete reopening, and wall-selector widening
  stay blocked until the rerank reorders them explicitly
- current rerank progress:
  rank-1 `GDMTXA04A` and rank-2 `C11c` feasibility are now explicitly held,
  so raw bare open-box/open-web is the active next comparison target and the
  current first question is whether any honest bare-carrier impact evidence
  exists at all
- last full green validation:
  `2026-04-17`
  - engine: `157/157` test files passed, `953/953` tests passed
  - web: `117/117` test files passed, `674/674` tests passed
  - focused engine gate: `10/10` test files passed, `33/33` tests passed
  - focused web gate: `3/3` test files passed, `9/9` tests passed
  - `pnpm typecheck`, `pnpm lint`, `pnpm check`, `pnpm build`, and
    `pnpm calculator:gate:current` green

## Current Hot Files

- [predictor-published-family-estimate.ts](../../packages/engine/src/predictor-published-family-estimate.ts): published-family CLT and remaining floor-family estimate anchor
- [predictor-floor-system-estimate.ts](../../packages/engine/src/predictor-floor-system-estimate.ts): predictor route-selection anchor for CLT estimate posture
- [floor-system-estimate.ts](../../packages/engine/src/floor-system-estimate.ts): floor-family exact vs estimate selection anchor
- [blocked-source-rank-1-gdmtxa04a-feasibility-contract.test.ts](../../packages/engine/src/blocked-source-rank-1-gdmtxa04a-feasibility-contract.test.ts): executable rank-1 rerank feasibility hold
- [blocked-source-rank-2-c11c-feasibility-contract.test.ts](../../packages/engine/src/blocked-source-rank-2-c11c-feasibility-contract.test.ts): executable rank-2 rerank feasibility hold
- [source-gap-candidate-re-rank-contract.test.ts](../../packages/engine/src/source-gap-candidate-re-rank-contract.test.ts): executable blocked-source rerank order contract
- [dataholz-clt-source-truth-audit.test.ts](../../packages/engine/src/dataholz-clt-source-truth-audit.test.ts): primary Dataholz CLT source-truth audit anchor
- [floor-source-corpus-contract.test.ts](../../packages/engine/src/floor-source-corpus-contract.test.ts): floor-source cluster and remaining exact-only slack contract
- [dataholz-clt-source-truth-route.test.ts](../../apps/web/features/workbench/dataholz-clt-source-truth-route.test.ts): workbench exact-vs-estimate CLT route posture anchor
- [run-calculator-current-gate.ts](../../tools/dev/run-calculator-current-gate.ts): single-command focused checkpoint gate
- [SOURCE_GAP_LEDGER.md](./SOURCE_GAP_LEDGER.md): source-backed widening, tightening, and blocked-family boundaries for the current rerank outcome

## Read Order

1. [NEXT_IMPLEMENTATION_PLAN.md](./NEXT_IMPLEMENTATION_PLAN.md): concise current execution plan and validated next steps
2. [CURRENT_STATE.md](./CURRENT_STATE.md): short snapshot of the current calculator/workbench posture
3. [SYSTEM_MAP.md](./SYSTEM_MAP.md): end-to-end product flow, runtime boundaries, persistence posture, and test surface map
4. [CHECKPOINT_2026-04-17_DATAHOLZ_CLT_CALIBRATION_TIGHTENING_CLOSEOUT_HANDOFF.md](./CHECKPOINT_2026-04-17_DATAHOLZ_CLT_CALIBRATION_TIGHTENING_CLOSEOUT_HANDOFF.md): latest checkpoint after the Dataholz CLT calibration closeout
5. [CALCULATION_MODEL_AND_VALIDATION.md](./CALCULATION_MODEL_AND_VALIDATION.md): answer-origin map for formulas, source rows, predictors, field continuations, support gating, and test meaning
6. [SOURCE_GAP_LEDGER.md](./SOURCE_GAP_LEDGER.md): source-backed widening, tightening, and deferred-family boundaries
7. [DYNAMIC_CALCULATOR_REMAINING_WORK_PLAN.md](./DYNAMIC_CALCULATOR_REMAINING_WORK_PLAN.md): cross-floor/wall remaining work, completion status, and safe execution order
8. [DYNAMIC_CALCULATOR_COVERAGE_ACCURACY_PLAN.md](./DYNAMIC_CALCULATOR_COVERAGE_ACCURACY_PLAN.md): current execution model for coverage growth, accuracy tightening, and test-first slice planning
9. [DYNAMIC_CALCULATOR_PLAN.md](./DYNAMIC_CALCULATOR_PLAN.md): active implementation order and long-form backlog
10. [../archive/analysis/README.md](../archive/analysis/README.md): dated investigations and reproduction notes
