# Checkpoint 2026-04-16 Runtime Candidate Re-rank Handoff

Superseded note:

- this checkpoint is historical
- use [CHECKPOINT_2026-04-17_REINFORCED_CONCRETE_ACCURACY_TIGHTENING_CLOSEOUT_HANDOFF.md](./CHECKPOINT_2026-04-17_REINFORCED_CONCRETE_ACCURACY_TIGHTENING_CLOSEOUT_HANDOFF.md) for the latest restart point after the reinforced-concrete tightening closeout

Document role:

- define the current checkpoint after the requested-output harness hard stop and
  the post-harness runtime/source rerank
- map the living plan to implemented work without pretending the selected heavy
  concrete widening is already landed
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
   `heavy_concrete_formula_family_widening_v1`.
4. Open:
   - [impact-estimate.ts](../../packages/engine/src/impact-estimate.ts)
   - [floor-system-estimate.ts](../../packages/engine/src/floor-system-estimate.ts)
   - [dynamic-impact.ts](../../packages/engine/src/dynamic-impact.ts)
   - [impact-support.ts](../../packages/engine/src/impact-support.ts)
   - [impact-heavy-floor-planned-scope-benchmark.test.ts](../../packages/engine/src/impact-heavy-floor-planned-scope-benchmark.test.ts)
   - [reinforced-concrete-floor-monotonicity.test.ts](../../packages/engine/src/reinforced-concrete-floor-monotonicity.test.ts)
   - [SOURCE_GAP_LEDGER.md](./SOURCE_GAP_LEDGER.md)
5. Run `pnpm calculator:gate:current` before touching runtime code.

Do not start with CLT, raw open-box/open-web, `GDMTXA04A`, `C11c`, or selector
widening. The next safe step is the selected heavy-concrete widening.

## Current Answer In One Screen

- latest closed implementation slice:
  `mixed_floor_wall_runtime_candidate_re_rank_after_requested_output_harness_v1`
- latest selected next slice:
  `heavy_concrete_formula_family_widening_v1`
- current checkpoint rule:
  the requested-output harness refactor chain is hard-stopped and the rerank is
  closed; no new harness-only or CLT-tightening slice should be opened first
- explicit not-done item:
  this handoff selected the heavy-concrete widening, and later work has already
  landed six defended predictor-side substeps; the remaining job is to
  finish the rest of the bounded reinforced-concrete corridor without reopening
  blocked families

## What Closed In This Checkpoint

- `mixed_floor_wall_runtime_candidate_re_rank_after_requested_output_harness_v1`
  - compared the only two immediate rerank-eligible candidates:
    - `heavy_concrete_formula_family_widening`
    - `dataholz_clt_calibration_tightening`
  - selected heavy concrete as the next widening because:
    - the formula lane is already live on bare and floating reinforced concrete
    - official exact catalog rows, product-delta rows, and lower-bound anchors
      already defend the same corridor
    - monotonicity, helper-negative, history, trace, report, and proposal
      method-dossier provenance guards are already green
    - widening can stay inside a physically obvious reinforced-concrete corridor
      instead of reopening a blocked source anomaly
  - held Dataholz CLT as the second candidate because:
    - exact-only slack is mostly consumed
    - the remaining `GDMTXA04A` row is still a material-surface/manual-match
      boundary rather than generic CLT calibration slack
    - no fresh classified runtime red exists on the current CLT estimate lane

None of those changes altered runtime or numeric calculator behavior.

## File Map For This Checkpoint

- selected planning contract:
  [post-mixed-floor-wall-runtime-candidate-re-rank-after-requested-output-harness-next-slice-selection-contract.test.ts](../../packages/engine/src/post-mixed-floor-wall-runtime-candidate-re-rank-after-requested-output-harness-next-slice-selection-contract.test.ts)
- selected runtime anchors:
  - [impact-estimate.ts](../../packages/engine/src/impact-estimate.ts)
  - [floor-system-estimate.ts](../../packages/engine/src/floor-system-estimate.ts)
  - [dynamic-impact.ts](../../packages/engine/src/dynamic-impact.ts)
  - [impact-support.ts](../../packages/engine/src/impact-support.ts)
- selected heavy-concrete engine evidence:
  - [impact-heavy-floor-planned-scope-benchmark.test.ts](../../packages/engine/src/impact-heavy-floor-planned-scope-benchmark.test.ts)
  - [reinforced-concrete-floor-monotonicity.test.ts](../../packages/engine/src/reinforced-concrete-floor-monotonicity.test.ts)
  - [floor-widening-candidate-contract.test.ts](../../packages/engine/src/floor-widening-candidate-contract.test.ts)
  - [calculate-impact-only.test.ts](../../packages/engine/src/calculate-impact-only.test.ts)
- selected heavy-concrete workbench evidence:
  - [heavy-concrete-formula-history-card-matrix.test.ts](../../apps/web/features/workbench/heavy-concrete-formula-history-card-matrix.test.ts)
  - [heavy-concrete-formula-provenance-report-surface.test.ts](../../apps/web/features/workbench/heavy-concrete-formula-provenance-report-surface.test.ts)
- held Dataholz CLT evidence:
  - [dataholz-clt-source-truth-audit.test.ts](../../packages/engine/src/dataholz-clt-source-truth-audit.test.ts)
  - [floor-source-corpus-contract.test.ts](../../packages/engine/src/floor-source-corpus-contract.test.ts)
  - [dataholz-clt-source-truth-route.test.ts](../../apps/web/features/workbench/dataholz-clt-source-truth-route.test.ts)
- current focused gate:
  [run-calculator-current-gate.ts](../../tools/dev/run-calculator-current-gate.ts)
- rerank evidence docs:
  - [SOURCE_GAP_LEDGER.md](./SOURCE_GAP_LEDGER.md)
  - [DYNAMIC_CALCULATOR_REMAINING_WORK_PLAN.md](./DYNAMIC_CALCULATOR_REMAINING_WORK_PLAN.md)

## What Is Planned But Not Done Now

- `heavy_concrete_formula_family_widening_v1`
  remains active and partially landed
  - predictor-input separator retention, elastic ceiling promotion, and rigid
    gypsum ceiling promotion have landed on the defended reinforced-concrete
    corridor
  - visible-stack parity for the same gypsum-board wet concrete ceiling
    corridors is now restored through the derived `generic_gypsum_board` alias,
    while DeltaLw still comes from the visible-stack formula companion
  - exact row, exact catalog, product-delta, and lower-bound precedence must
    remain intact through that widening
- `dataholz_clt_calibration_tightening`
  remains held-only
  - it is not blocked forever, but it is no longer the first honest move
- still blocked:
  - raw bare open-box/open-web impact widening
  - visible `GDMTXA04A` exact reopen
  - TUAS `C11c` exact import
  - wall-selector behavior widening without a fresh classified red

## Validation Gate For This Checkpoint

Revalidated on `2026-04-16`:

- `pnpm calculator:gate:current`
  - green
  - focused engine gate: `4/4` test files passed, `14/14` tests passed
  - focused web gate: `3/3` test files passed, `6/6` tests passed
- `pnpm --filter @dynecho/engine test`
  - green: `146/146` test files passed, `900/900` tests passed
- `pnpm --filter @dynecho/web test`
  - green: `113/113` test files passed, `655/655` tests passed
- `pnpm typecheck`
  - green
- `pnpm lint`
  - green
- `pnpm build`
  - green with the known optional `sharp/@img` warnings from the DOCX path
- `git diff --check`
  - green

## Minimal Resume Commands

1. `pnpm calculator:gate:current`
2. `pnpm --filter @dynecho/engine exec vitest run src/post-mixed-floor-wall-runtime-candidate-re-rank-after-requested-output-harness-next-slice-selection-contract.test.ts src/impact-heavy-floor-planned-scope-benchmark.test.ts src/reinforced-concrete-floor-monotonicity.test.ts src/dataholz-clt-source-truth-audit.test.ts --maxWorkers=1`
3. `pnpm --filter @dynecho/web exec vitest run features/workbench/heavy-concrete-formula-history-card-matrix.test.ts features/workbench/heavy-concrete-formula-provenance-report-surface.test.ts features/workbench/dataholz-clt-source-truth-route.test.ts --maxWorkers=1`
4. Read [SOURCE_GAP_LEDGER.md](./SOURCE_GAP_LEDGER.md) before widening runtime code.

## Exact Resume Target

Keep the next scope on:

- planning contract:
  [post-mixed-floor-wall-runtime-candidate-re-rank-after-requested-output-harness-next-slice-selection-contract.test.ts](../../packages/engine/src/post-mixed-floor-wall-runtime-candidate-re-rank-after-requested-output-harness-next-slice-selection-contract.test.ts)
- selected engine guards:
  [impact-heavy-floor-planned-scope-benchmark.test.ts](../../packages/engine/src/impact-heavy-floor-planned-scope-benchmark.test.ts)
  and [reinforced-concrete-floor-monotonicity.test.ts](../../packages/engine/src/reinforced-concrete-floor-monotonicity.test.ts)
- selected workbench guards:
  [heavy-concrete-formula-history-card-matrix.test.ts](../../apps/web/features/workbench/heavy-concrete-formula-history-card-matrix.test.ts)
  and [heavy-concrete-formula-provenance-report-surface.test.ts](../../apps/web/features/workbench/heavy-concrete-formula-provenance-report-surface.test.ts)
- source-gap evidence map:
  [SOURCE_GAP_LEDGER.md](./SOURCE_GAP_LEDGER.md)
- living plan:
  [NEXT_IMPLEMENTATION_PLAN.md](./NEXT_IMPLEMENTATION_PLAN.md)

Do not claim the heavy-concrete widening is closed until runtime edits land and
full validation is green again.
