# Next Implementation Plan

Last reviewed: 2026-04-16

Document role:

- authoritative current next-step plan for calculator work
- use this before any historical backlog note
- keep older long-form backlog detail in:
  - [DYNAMIC_CALCULATOR_REMAINING_WORK_PLAN.md](./DYNAMIC_CALCULATOR_REMAINING_WORK_PLAN.md)
  - [DYNAMIC_CALCULATOR_COVERAGE_ACCURACY_PLAN.md](./DYNAMIC_CALCULATOR_COVERAGE_ACCURACY_PLAN.md)
  - [DYNAMIC_CALCULATOR_PLAN.md](./DYNAMIC_CALCULATOR_PLAN.md)

Read together with:

- [CURRENT_STATE.md](./CURRENT_STATE.md)
- [SYSTEM_MAP.md](./SYSTEM_MAP.md)
- [CHECKPOINT_2026-04-16_RUNTIME_CANDIDATE_RERANK_HANDOFF.md](./CHECKPOINT_2026-04-16_RUNTIME_CANDIDATE_RERANK_HANDOFF.md)
- [CALCULATION_MODEL_AND_VALIDATION.md](./CALCULATION_MODEL_AND_VALIDATION.md)
- [SOURCE_GAP_LEDGER.md](./SOURCE_GAP_LEDGER.md)

## Verified Against Implementation - 2026-04-16

- latest closed implementation slice:
  `mixed_floor_wall_runtime_candidate_re_rank_after_requested_output_harness_v1`
- local verification in this closeout pass:
  - focused engine gate: `4/4` test files passed, `13/13` tests passed
  - focused web gate: `3/3` test files passed, `6/6` tests passed
  - `pnpm calculator:gate:current`: green
  - full engine suite: `146/146` test files passed, `900/900` tests passed
  - full web suite: `113/113` test files passed, `655/655` tests passed
  - `pnpm typecheck`: green
  - `pnpm lint`: green
  - `pnpm build`: green with the known optional `sharp/@img` DOCX warnings
  - `git diff --check`: green

## Closeout Summary

The requested-output harness chain remains frozen. The no-runtime rerank that
followed it is now also closed.

Concrete comparison result:

- selected next widening direction:
  `heavy_concrete_formula_family_widening_v1`
- held but not selected candidate:
  `dataholz_clt_calibration_tightening`
- why heavy concrete won the rerank:
  - the formula lane is already live on bare and floating reinforced-concrete
    routes
  - official catalog exact rows, product-delta rows, and lower-bound anchors
    already defend the same corridor
  - monotonicity, helper-negative, history, trace, report, and method-dossier
    provenance guards are already green
  - widening can stay inside a physically obvious reinforced-concrete corridor
    instead of reopening a blocked source anomaly
- why Dataholz CLT did not win the rerank:
  - exact-only slack is now mostly consumed
  - the remaining `GDMTXA04A` row is still a manual-match/material-surface
    boundary, not generic calibration slack
  - there is no fresh classified runtime red on the current defended CLT estimate
    lane
- no runtime or numeric calculator behavior changed in the rerank itself

## Current Position

- latest committed checkpoint:
  `CHECKPOINT_2026-04-16_RUNTIME_CANDIDATE_RERANK_HANDOFF.md`
- latest closed implementation slice:
  `mixed_floor_wall_runtime_candidate_re_rank_after_requested_output_harness_v1`
- closed planning action in this pass:
  `post_mixed_floor_wall_runtime_candidate_re_rank_after_requested_output_harness_next_slice_selection_v1`
- selected next implementation slice:
  `heavy_concrete_formula_family_widening_v1`
- slice type:
  runtime formula-family widening on the defended reinforced-concrete corridor
- implementation status:
  selected and contract-guarded
- explicit not-done item at this checkpoint:
  no heavy-concrete widening has landed yet; only the post-harness rerank is
  closed

## Selected Next Slice

- slice id:
  `heavy_concrete_formula_family_widening_v1`
- workstream:
  `runtime_formula_family_widening`
- route family:
  `heavy_concrete_formula_floor_lane`
- output surface:
  `heavy_concrete_formula_family_widening_matrix`
- engine companion surface:
  `reinforced_concrete_formula_scope_benchmark`
- behavior class:
  runtime widening inside an already-owned reinforced-concrete formula corridor

### Scope

- widen the current heavy-concrete formula family lane only where the reinforced
  concrete corridor is already source-anchored or formula-owned
- preserve exact row, exact catalog, product-delta, and lower-bound precedence
  over the formula lane
- keep formula provenance explicit on engine, workbench, trace, and report
  surfaces
- do not use this slice to reopen CLT, raw open-box/open-web, `GDMTXA04A`,
  `C11c`, or wall-selector behavior

### Candidate Re-rank Result

Selected now:

- `heavy_concrete_formula_family_widening`
  - posture: selected after the post-harness rerank
  - reason: live formula lane plus catalog/lower-bound anchors and green
    monotonicity / provenance guards make it the highest-ROI honest widening

Held for later:

- `dataholz_clt_calibration_tightening`
  - posture: held second candidate after rerank
  - reason: current CLT estimate lane is defended, the remaining exact-only row
    is still a blocked material-surface boundary, and no fresh runtime red is
    forcing immediate CLT calibration work

Still blocked:

- `raw_bare_open_box_open_web_impact_widening`
  - blocked until bare-carrier impact source evidence exists
- `dataholz_gdmtxa04a_visible_exact_reopen`
  - blocked until the composite dry-screed surface is modeled honestly
- `tuas_c11c_exact_import`
  - blocked until the frequency/source anomaly is explained
- `wall_selector_behavior_widening`
  - blocked until a fresh classified wall-selector red exists

### Current Implementation Anchors

- planning contract:
  `packages/engine/src/post-mixed-floor-wall-runtime-candidate-re-rank-after-requested-output-harness-next-slice-selection-contract.test.ts`
- heavy-concrete engine evidence:
  - `packages/engine/src/impact-heavy-floor-planned-scope-benchmark.test.ts`
  - `packages/engine/src/reinforced-concrete-floor-monotonicity.test.ts`
  - `packages/engine/src/floor-widening-candidate-contract.test.ts`
  - `packages/engine/src/calculate-impact-only.test.ts`
- heavy-concrete web evidence:
  - `apps/web/features/workbench/heavy-concrete-formula-history-card-matrix.test.ts`
  - `apps/web/features/workbench/heavy-concrete-formula-provenance-report-surface.test.ts`
- held CLT evidence:
  - `packages/engine/src/dataholz-clt-source-truth-audit.test.ts`
  - `packages/engine/src/floor-source-corpus-contract.test.ts`
  - `apps/web/features/workbench/dataholz-clt-source-truth-route.test.ts`
- likely runtime edit anchors for the selected widening:
  - `packages/engine/src/impact-estimate.ts`
  - `packages/engine/src/floor-system-estimate.ts`
  - `packages/engine/src/dynamic-impact.ts`
  - `packages/engine/src/impact-support.ts`
- focused gate entrypoint:
  `tools/dev/run-calculator-current-gate.ts`
- source-backed boundary ledger:
  `docs/calculator/SOURCE_GAP_LEDGER.md`

### Validation Commands For This Checkpoint

1. `pnpm --filter @dynecho/engine exec vitest run src/post-mixed-floor-wall-runtime-candidate-re-rank-after-requested-output-harness-next-slice-selection-contract.test.ts src/impact-heavy-floor-planned-scope-benchmark.test.ts src/reinforced-concrete-floor-monotonicity.test.ts src/dataholz-clt-source-truth-audit.test.ts --maxWorkers=1`
2. `pnpm --filter @dynecho/web exec vitest run features/workbench/heavy-concrete-formula-history-card-matrix.test.ts features/workbench/heavy-concrete-formula-provenance-report-surface.test.ts features/workbench/dataholz-clt-source-truth-route.test.ts --maxWorkers=1`
3. `pnpm --filter @dynecho/engine test`
4. `pnpm --filter @dynecho/web test`
5. `pnpm typecheck`
6. `pnpm lint`
7. `pnpm build`
8. `git diff --check`

### Slice Stop Conditions

- stop if the widening leaks outside reinforced-concrete carriers into CLT,
  open-box, open-web, or selector-specific behavior
- stop if exact, catalog, product-delta, or lower-bound precedence is weakened
  by the new formula-family lane
- stop if the widening makes field/report/provenance surfaces less explicit
  about formula ownership
- stop if Dataholz `GDMTXA04A`, TUAS `C11c`, or any bare-carrier source anomaly
  is implicitly reopened by the same change

## Explicitly Deferred Until This Widening Closes

- Dataholz CLT calibration tightening
- raw bare open-box/open-web impact widening
- Dataholz `GDMTXA04A` visible exact reopen
- TUAS `C11c` exact import
- wall-selector behavior widening

## Immediate Next Steps

1. Keep this plan as the authoritative next-step file.
2. Treat the requested-output harness chain as closed and frozen.
3. Execute `heavy_concrete_formula_family_widening_v1`.
4. Keep the held Dataholz CLT candidate explicit; do not silently substitute it
   for the selected heavy-concrete widening.
