# Calculator Docs

Use this folder for the current acoustic-calculator and workbench behavior.

This is the primary living doc set for dynamic calculator work. Read these files before using anything under `docs/archive`.

If the question is “what is still open and what executes next?”, start with
[NEXT_IMPLEMENTATION_PLAN.md](./NEXT_IMPLEMENTATION_PLAN.md), then
[CURRENT_STATE.md](./CURRENT_STATE.md), then the latest committed checkpoint.

## New Agent Fast Start

1. Read [CHECKPOINT_2026-04-16_RUNTIME_CANDIDATE_RERANK_HANDOFF.md](./CHECKPOINT_2026-04-16_RUNTIME_CANDIDATE_RERANK_HANDOFF.md).
2. Read [NEXT_IMPLEMENTATION_PLAN.md](./NEXT_IMPLEMENTATION_PLAN.md).
3. Run `pnpm calculator:gate:current`.
4. If green, start the selected next slice `heavy_concrete_formula_family_widening_v1`.

## Current Execution Snapshot

- primary product aim:
  broader corridor coverage plus higher numerical and provenance accuracy at the
  same time
- active next slice:
  `heavy_concrete_formula_family_widening_v1`
- current guardrail:
  requested-output output-card harness work is hard-stopped; the next step is a
  real heavy-concrete runtime widening
- current candidate posture:
  heavy concrete won the post-harness rerank; Dataholz CLT is held second and
  the source-anomaly candidates remain blocked
- last full green validation:
  `2026-04-16`
  - engine: `146/146` test files passed, `900/900` tests passed
  - web: `113/113` test files passed, `655/655` tests passed
  - focused engine gate: `4/4` test files passed, `13/13` tests passed
  - focused web gate: `3/3` test files passed, `6/6` tests passed
  - `pnpm typecheck`, `pnpm lint`, `pnpm build`, and `pnpm calculator:gate:current`
    green

## Current Hot Files

- [impact-estimate.ts](../../packages/engine/src/impact-estimate.ts): heavy-concrete narrow formula runtime anchor
- [floor-system-estimate.ts](../../packages/engine/src/floor-system-estimate.ts): family estimate selection and precedence anchor
- [dynamic-impact.ts](../../packages/engine/src/dynamic-impact.ts): impact lane routing and formula-basis ownership
- [impact-support.ts](../../packages/engine/src/impact-support.ts): formula notes and provenance wording
- [impact-heavy-floor-planned-scope-benchmark.test.ts](../../packages/engine/src/impact-heavy-floor-planned-scope-benchmark.test.ts): official exact/product/lower-bound benchmark for the selected corridor
- [reinforced-concrete-floor-monotonicity.test.ts](../../packages/engine/src/reinforced-concrete-floor-monotonicity.test.ts): monotonicity and treatment-strength guard for the selected corridor
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
4. [CHECKPOINT_2026-04-16_RUNTIME_CANDIDATE_RERANK_HANDOFF.md](./CHECKPOINT_2026-04-16_RUNTIME_CANDIDATE_RERANK_HANDOFF.md): latest checkpoint after the post-harness runtime rerank closeout
5. [CALCULATION_MODEL_AND_VALIDATION.md](./CALCULATION_MODEL_AND_VALIDATION.md): answer-origin map for formulas, source rows, predictors, field continuations, support gating, and test meaning
6. [SOURCE_GAP_LEDGER.md](./SOURCE_GAP_LEDGER.md): source-backed widening, tightening, and deferred-family boundaries
7. [DYNAMIC_CALCULATOR_REMAINING_WORK_PLAN.md](./DYNAMIC_CALCULATOR_REMAINING_WORK_PLAN.md): cross-floor/wall remaining work, completion status, and safe execution order
8. [DYNAMIC_CALCULATOR_COVERAGE_ACCURACY_PLAN.md](./DYNAMIC_CALCULATOR_COVERAGE_ACCURACY_PLAN.md): current execution model for coverage growth, accuracy tightening, and test-first slice planning
9. [DYNAMIC_CALCULATOR_PLAN.md](./DYNAMIC_CALCULATOR_PLAN.md): active implementation order and long-form backlog
10. [../archive/analysis/README.md](../archive/analysis/README.md): dated investigations and reproduction notes
