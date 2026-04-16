# Dynamic Calculator Current State

Document role:

- primary short snapshot for the current dynamic calculator and workbench posture
- read this before historical analysis or older checkpoint notes
- for the current checkpoint, also read:
  - [CHECKPOINT_2026-04-16_RUNTIME_CANDIDATE_RERANK_HANDOFF.md](./CHECKPOINT_2026-04-16_RUNTIME_CANDIDATE_RERANK_HANDOFF.md)
- for the authoritative next step, read:
  - [NEXT_IMPLEMENTATION_PLAN.md](./NEXT_IMPLEMENTATION_PLAN.md)
- for end-to-end product flow and file boundaries, read:
  - [SYSTEM_MAP.md](./SYSTEM_MAP.md)
- for answer-origin / source-vs-formula questions, read:
  - [CALCULATION_MODEL_AND_VALIDATION.md](./CALCULATION_MODEL_AND_VALIDATION.md)
- for source-backed widening posture, read:
  - [SOURCE_GAP_LEDGER.md](./SOURCE_GAP_LEDGER.md)

## Scope

- floor and wall dynamic-calculator behavior
- workbench-side layer normalization and operator flow
- result stability under duplicate/split/reorder/save-load/history misuse
- executable evidence for source/formula/support/origin honesty

## Revalidated Snapshot

Last full engine revalidation: `2026-04-16`

Last full web revalidation: `2026-04-16`

Last cross-package build revalidation: `2026-04-16`

Planning / implementation update: `2026-04-16`

- latest live verification after the runtime candidate rerank closeout:
  - full engine suite: `146/146` test files passed, `900/900` tests passed
  - full web suite: `113/113` test files passed, `655/655` tests passed
  - focused engine gate: `4/4` test files passed, `13/13` tests passed
  - focused web gate: `3/3` test files passed, `6/6` tests passed
  - `pnpm typecheck`: green
  - `pnpm lint`: green
  - `pnpm calculator:gate:current`: green
  - `pnpm build`: green with the known optional `sharp/@img` DOCX warnings
  - `git diff --check`: green
- latest no-runtime closeout on `2026-04-16`:
  - closed `mixed_floor_wall_runtime_candidate_re_rank_after_requested_output_harness_v1`
  - selected `heavy_concrete_formula_family_widening_v1` as the next honest
    widening direction
  - kept `dataholz_clt_calibration_tightening` as the held second candidate
  - kept raw bare open-box/open-web, `GDMTXA04A`, `C11c`, and wall-selector
    widening blocked
  - no runtime or numeric calculator behavior changed

## Current Answer In One Screen

- latest closed implementation slice:
  `mixed_floor_wall_runtime_candidate_re_rank_after_requested_output_harness_v1`
- latest closed planning action:
  `post_mixed_floor_wall_runtime_candidate_re_rank_after_requested_output_harness_next_slice_selection_v1`
- current active next slice:
  `heavy_concrete_formula_family_widening_v1`
- current rule:
  the requested-output harness chain stays frozen; the next move is a real
  heavy-concrete runtime widening, not another harness micro-slice
- current explicit not-done item:
  the heavy-concrete widening itself has not landed yet

## Current Hotspot Map

- selected runtime formula widening anchors:
  - `packages/engine/src/impact-estimate.ts`
  - `packages/engine/src/floor-system-estimate.ts`
  - `packages/engine/src/dynamic-impact.ts`
  - `packages/engine/src/impact-support.ts`
- selected heavy-concrete engine evidence:
  - `packages/engine/src/impact-heavy-floor-planned-scope-benchmark.test.ts`
  - `packages/engine/src/reinforced-concrete-floor-monotonicity.test.ts`
  - `packages/engine/src/floor-widening-candidate-contract.test.ts`
  - `packages/engine/src/calculate-impact-only.test.ts`
- selected heavy-concrete workbench evidence:
  - `apps/web/features/workbench/heavy-concrete-formula-history-card-matrix.test.ts`
  - `apps/web/features/workbench/heavy-concrete-formula-provenance-report-surface.test.ts`
- held Dataholz CLT evidence:
  - `packages/engine/src/dataholz-clt-source-truth-audit.test.ts`
  - `packages/engine/src/floor-source-corpus-contract.test.ts`
  - `apps/web/features/workbench/dataholz-clt-source-truth-route.test.ts`
- focused checkpoint gate:
  `tools/dev/run-calculator-current-gate.ts`
- source-backed rerank ledger:
  `docs/calculator/SOURCE_GAP_LEDGER.md`

## Harness Hard Stop

The requested-output output-card harness refactor chain is now complete enough.

Rule from this point:

- do not create another requested-output harness-only micro-slice
- only reopen that harness if the selected heavy-concrete widening exposes a new
  concrete red that cannot be localized otherwise

## Immediate Candidate Posture

Selected now:

- `heavy_concrete_formula_family_widening`

Held but not selected:

- `dataholz_clt_calibration_tightening`

Still blocked:

- raw bare open-box/open-web impact widening
- Dataholz `GDMTXA04A` visible exact reopen
- TUAS `C11c` exact import
- wall-selector behavior widening without a fresh classified red

## Current Next Steps

1. Keep the requested-output harness frozen at the current green baseline.
2. Execute `heavy_concrete_formula_family_widening_v1`.
3. Keep Dataholz CLT on the held second-candidate posture until a real runtime
   red or stronger family-tightening signal appears.
4. Do not blur blocked source-anomaly candidates into the heavy-concrete pass.
