# Calculator Docs

Use this folder for the current acoustic-calculator and workbench behavior.

This is the primary living doc set for dynamic calculator work. Read these files before using anything under `docs/archive`.

If the question is “what is still open and what executes next?”, start with
[NEXT_IMPLEMENTATION_PLAN.md](./NEXT_IMPLEMENTATION_PLAN.md), then
[CURRENT_STATE.md](./CURRENT_STATE.md), then the latest committed checkpoint.

## New Agent Fast Start

1. Read [CHECKPOINT_2026-04-17_HEAVY_CONCRETE_FORMULA_FAMILY_CLOSEOUT_HANDOFF.md](./CHECKPOINT_2026-04-17_HEAVY_CONCRETE_FORMULA_FAMILY_CLOSEOUT_HANDOFF.md).
2. Read [NEXT_IMPLEMENTATION_PLAN.md](./NEXT_IMPLEMENTATION_PLAN.md).
3. Run `pnpm calculator:gate:current`.
4. If green, start the selected next slice `reinforced_concrete_accuracy_tightening_follow_up_v1`.

## Current Execution Snapshot

- primary product aim:
  broader corridor coverage plus higher numerical and provenance accuracy at the
  same time
- active next slice:
  `reinforced_concrete_accuracy_tightening_follow_up_v1`
- current guardrail:
  requested-output output-card harness work is hard-stopped; the heavy-concrete
  widening is closed and the next step is reinforced-concrete accuracy
  tightening
- current candidate posture:
  reinforced-concrete tightening is selected; Dataholz CLT is held second; the
  heavy-concrete parity queue is closed unless new proof appears; and the
  source-anomaly candidates remain blocked
- last full green validation:
  `2026-04-17`
  - engine: `152/152` test files passed, `941/941` tests passed
  - web: `117/117` test files passed, `674/674` tests passed
  - focused engine gate: `9/9` test files passed, `33/33` tests passed
  - focused web gate: `7/7` test files passed, `16/16` tests passed
  - `pnpm typecheck`, `pnpm lint`, `pnpm check`, `pnpm build`, and
    `pnpm calculator:gate:current` green

## Current Hot Files

- [heavy-concrete-published-upper-treatment-estimate.ts](../../packages/engine/src/heavy-concrete-published-upper-treatment-estimate.ts): published-family reinforced-concrete tightening anchor
- [predictor-published-family-estimate.ts](../../packages/engine/src/predictor-published-family-estimate.ts): reinforced-concrete archetype tightening anchor
- [impact-estimate.ts](../../packages/engine/src/impact-estimate.ts): formula-owned reinforced-concrete baseline anchor
- [target-output-support.ts](../../packages/engine/src/target-output-support.ts): supported/unsupported and companion-output honesty anchor
- [post-heavy-concrete-formula-family-widening-next-slice-selection-contract.test.ts](../../packages/engine/src/post-heavy-concrete-formula-family-widening-next-slice-selection-contract.test.ts): executable next-slice selection contract
- [reinforced-concrete-formula-family-closeout-audit.test.ts](../../packages/engine/src/reinforced-concrete-formula-family-closeout-audit.test.ts): central reinforced-concrete ownership matrix
- [impact-heavy-floor-planned-scope-benchmark.test.ts](../../packages/engine/src/impact-heavy-floor-planned-scope-benchmark.test.ts): official exact/product/lower-bound benchmark for the owned corridor
- [reinforced-concrete-floor-monotonicity.test.ts](../../packages/engine/src/reinforced-concrete-floor-monotonicity.test.ts): monotonicity and treatment-strength guard for the owned corridor
- [heavy-concrete-formula-history-card-matrix.test.ts](../../apps/web/features/workbench/heavy-concrete-formula-history-card-matrix.test.ts): workbench history/card stability guard for the selected corridor
- [heavy-concrete-formula-provenance-report-surface.test.ts](../../apps/web/features/workbench/heavy-concrete-formula-provenance-report-surface.test.ts): trace/report/provenance guard for the selected corridor
- [dataholz-clt-source-truth-audit.test.ts](../../packages/engine/src/dataholz-clt-source-truth-audit.test.ts): held CLT second-candidate audit anchor
- [dataholz-clt-source-truth-route.test.ts](../../apps/web/features/workbench/dataholz-clt-source-truth-route.test.ts): held CLT route/card posture anchor
- [run-calculator-current-gate.ts](../../tools/dev/run-calculator-current-gate.ts): single-command focused checkpoint gate
- [SOURCE_GAP_LEDGER.md](./SOURCE_GAP_LEDGER.md): source-backed widening, tightening, and blocked-family boundaries for the current rerank outcome

## Read Order

1. [NEXT_IMPLEMENTATION_PLAN.md](./NEXT_IMPLEMENTATION_PLAN.md): concise current execution plan and validated next steps
2. [CURRENT_STATE.md](./CURRENT_STATE.md): short snapshot of the current calculator/workbench posture
3. [SYSTEM_MAP.md](./SYSTEM_MAP.md): end-to-end product flow, runtime boundaries, persistence posture, and test surface map
4. [CHECKPOINT_2026-04-17_HEAVY_CONCRETE_FORMULA_FAMILY_CLOSEOUT_HANDOFF.md](./CHECKPOINT_2026-04-17_HEAVY_CONCRETE_FORMULA_FAMILY_CLOSEOUT_HANDOFF.md): latest checkpoint after the heavy-concrete widening closeout
5. [CALCULATION_MODEL_AND_VALIDATION.md](./CALCULATION_MODEL_AND_VALIDATION.md): answer-origin map for formulas, source rows, predictors, field continuations, support gating, and test meaning
6. [SOURCE_GAP_LEDGER.md](./SOURCE_GAP_LEDGER.md): source-backed widening, tightening, and deferred-family boundaries
7. [DYNAMIC_CALCULATOR_REMAINING_WORK_PLAN.md](./DYNAMIC_CALCULATOR_REMAINING_WORK_PLAN.md): cross-floor/wall remaining work, completion status, and safe execution order
8. [DYNAMIC_CALCULATOR_COVERAGE_ACCURACY_PLAN.md](./DYNAMIC_CALCULATOR_COVERAGE_ACCURACY_PLAN.md): current execution model for coverage growth, accuracy tightening, and test-first slice planning
9. [DYNAMIC_CALCULATOR_PLAN.md](./DYNAMIC_CALCULATOR_PLAN.md): active implementation order and long-form backlog
10. [../archive/analysis/README.md](../archive/analysis/README.md): dated investigations and reproduction notes
