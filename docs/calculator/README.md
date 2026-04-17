# Calculator Docs

Use this folder for the current acoustic-calculator and workbench behavior.

This is the primary living doc set for dynamic calculator work. Read these files before using anything under `docs/archive`.

If the question is “what is still open and what executes next?”, start with
[NEXT_IMPLEMENTATION_PLAN.md](./NEXT_IMPLEMENTATION_PLAN.md), then
[CURRENT_STATE.md](./CURRENT_STATE.md), then the latest committed checkpoint.

## New Agent Fast Start

1. Read [CHECKPOINT_2026-04-17_REINFORCED_CONCRETE_ACCURACY_TIGHTENING_CLOSEOUT_HANDOFF.md](./CHECKPOINT_2026-04-17_REINFORCED_CONCRETE_ACCURACY_TIGHTENING_CLOSEOUT_HANDOFF.md).
2. Read [NEXT_IMPLEMENTATION_PLAN.md](./NEXT_IMPLEMENTATION_PLAN.md).
3. Run `pnpm calculator:gate:current`.
4. If green, start the selected next slice `dataholz_clt_calibration_tightening`.

## Current Execution Snapshot

- primary product aim:
  broader corridor coverage plus higher numerical and provenance accuracy at the
  same time
- active next slice:
  `dataholz_clt_calibration_tightening`
- current guardrail:
  requested-output output-card harness work is hard-stopped; reinforced-
  concrete accuracy tightening is closed and the next step is Dataholz CLT
  calibration tightening
- current candidate posture:
  Dataholz CLT tightening is selected; reinforced-concrete reopening is closed
  unless new proof appears; the heavy-concrete parity queue stays closed; and
  the source-anomaly candidates remain blocked
- last full green validation:
  `2026-04-17`
  - engine: `153/153` test files passed, `945/945` tests passed
  - web: `117/117` test files passed, `674/674` tests passed
  - focused engine gate: `5/5` test files passed, `23/23` tests passed
  - focused web gate: `2/2` test files passed, `5/5` tests passed
  - `pnpm typecheck`, `pnpm lint`, `pnpm check`, `pnpm build`, and
    `pnpm calculator:gate:current` green

## Current Hot Files

- [predictor-published-family-estimate.ts](../../packages/engine/src/predictor-published-family-estimate.ts): published-family CLT and remaining floor-family estimate anchor
- [predictor-floor-system-estimate.ts](../../packages/engine/src/predictor-floor-system-estimate.ts): predictor route-selection anchor for CLT estimate posture
- [floor-system-estimate.ts](../../packages/engine/src/floor-system-estimate.ts): floor-family exact vs estimate selection anchor
- [post-reinforced-concrete-accuracy-tightening-follow-up-next-slice-selection-contract.test.ts](../../packages/engine/src/post-reinforced-concrete-accuracy-tightening-follow-up-next-slice-selection-contract.test.ts): executable next-slice selection contract
- [dataholz-clt-source-truth-audit.test.ts](../../packages/engine/src/dataholz-clt-source-truth-audit.test.ts): primary Dataholz CLT source-truth audit anchor
- [floor-source-corpus-contract.test.ts](../../packages/engine/src/floor-source-corpus-contract.test.ts): floor-source cluster and remaining exact-only slack contract
- [dataholz-clt-source-truth-route.test.ts](../../apps/web/features/workbench/dataholz-clt-source-truth-route.test.ts): workbench exact-vs-estimate CLT route posture anchor
- [reinforced-concrete-family-formula-fit-audit.test.ts](../../packages/engine/src/reinforced-concrete-family-formula-fit-audit.test.ts): closed reinforced-concrete closeout guard
- [reinforced-concrete-low-confidence-proposal-honesty.test.ts](../../apps/web/features/workbench/reinforced-concrete-low-confidence-proposal-honesty.test.ts): closed reinforced-concrete screening carry-through guard
- [run-calculator-current-gate.ts](../../tools/dev/run-calculator-current-gate.ts): single-command focused checkpoint gate
- [SOURCE_GAP_LEDGER.md](./SOURCE_GAP_LEDGER.md): source-backed widening, tightening, and blocked-family boundaries for the current rerank outcome

## Read Order

1. [NEXT_IMPLEMENTATION_PLAN.md](./NEXT_IMPLEMENTATION_PLAN.md): concise current execution plan and validated next steps
2. [CURRENT_STATE.md](./CURRENT_STATE.md): short snapshot of the current calculator/workbench posture
3. [SYSTEM_MAP.md](./SYSTEM_MAP.md): end-to-end product flow, runtime boundaries, persistence posture, and test surface map
4. [CHECKPOINT_2026-04-17_REINFORCED_CONCRETE_ACCURACY_TIGHTENING_CLOSEOUT_HANDOFF.md](./CHECKPOINT_2026-04-17_REINFORCED_CONCRETE_ACCURACY_TIGHTENING_CLOSEOUT_HANDOFF.md): latest checkpoint after the reinforced-concrete tightening closeout
5. [CALCULATION_MODEL_AND_VALIDATION.md](./CALCULATION_MODEL_AND_VALIDATION.md): answer-origin map for formulas, source rows, predictors, field continuations, support gating, and test meaning
6. [SOURCE_GAP_LEDGER.md](./SOURCE_GAP_LEDGER.md): source-backed widening, tightening, and deferred-family boundaries
7. [DYNAMIC_CALCULATOR_REMAINING_WORK_PLAN.md](./DYNAMIC_CALCULATOR_REMAINING_WORK_PLAN.md): cross-floor/wall remaining work, completion status, and safe execution order
8. [DYNAMIC_CALCULATOR_COVERAGE_ACCURACY_PLAN.md](./DYNAMIC_CALCULATOR_COVERAGE_ACCURACY_PLAN.md): current execution model for coverage growth, accuracy tightening, and test-first slice planning
9. [DYNAMIC_CALCULATOR_PLAN.md](./DYNAMIC_CALCULATOR_PLAN.md): active implementation order and long-form backlog
10. [../archive/analysis/README.md](../archive/analysis/README.md): dated investigations and reproduction notes
