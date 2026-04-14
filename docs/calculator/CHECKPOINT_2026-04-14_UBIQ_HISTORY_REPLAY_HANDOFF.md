# Checkpoint 2026-04-14 UBIQ History Replay Handoff

Document role:

- define the committed checkpoint after the UBIQ packaged open-web
  finish-family, near-miss, and workbench history-replay passes
- preserve the latest green validation gate
- give the next agent a safe restart point before any new source-led widening or
  planning iteration

This is a checkpoint document, not a new solver plan.

## Current State

Checkpoint date: `2026-04-14`

Accepted commit:

- `1be632d test(calculator): lock UBIQ packaged floor source and history surfaces`

Current restart posture:

- working tree was clean after the accepted checkpoint commit
- use [NEXT_IMPLEMENTATION_PLAN.md](./NEXT_IMPLEMENTATION_PLAN.md) for the
  post-checkpoint planning iteration and selected next action

Latest closed implementation slice:

- `ubiq_open_web_packaged_finish_history_replay_matrix_v1`
- artifact:
  `apps/web/features/workbench/ubiq-open-web-packaged-finish-history-replay-matrix.test.ts`
- type: no-runtime workbench store/history guard
- scope:
  - weak carpet exact `FL-27`
  - supported carpet `Ln,w+CI <=45` bound `FL-28`
  - supported carpet extra-board near-miss fail-closed posture
  - supported carpet-to-timber valid finish switch
  - supported timber wrong-deck `family_archetype` fallback
- replayed user actions:
  - duplicate
  - split
  - reorder bounce
  - save/load
  - floor/wall mode detour

Result:

- source-equivalent histories preserve exact/bound ids, impact/bound basis,
  supported-output buckets, unsupported-output buckets, and output-card
  statuses/values
- source-critical near-misses remain off official exact/bound provenance after
  realistic workbench history
- valid finish switches remain controlled official route switches instead of
  accidental fallback or raw open-web widening
- no solver, catalog, selector, support, or workbench runtime behavior was
  changed by this slice

## Latest Validation Gate

Green on `2026-04-14`:

- targeted history replay guard:
  - `pnpm --filter @dynecho/web exec vitest run features/workbench/ubiq-open-web-packaged-finish-history-replay-matrix.test.ts --maxWorkers=1`
  - `1` file / `1` test
- adjacent UBIQ web history/near-miss pack:
  - `pnpm --filter @dynecho/web exec vitest run features/workbench/ubiq-open-web-packaged-finish-history-replay-matrix.test.ts features/workbench/ubiq-open-web-packaged-finish-near-miss-card-matrix.test.ts features/workbench/ubiq-lnw-plus-ci-bound-history-guard.test.ts --maxWorkers=1`
  - `3` files / `4` tests
- current post-UBIQ re-rank engine starting pack:
  - `pnpm --filter @dynecho/engine exec vitest run src/source-gap-candidate-re-rank-contract.test.ts src/raw-bare-open-web-open-box-source-evidence-rerank-contract.test.ts src/remaining-source-gap-posture-matrix.test.ts src/tuas-c11c-wet-stack-anomaly-audit.test.ts src/dataholz-clt-source-truth-audit.test.ts src/ubiq-candidate-backlog-contract.test.ts src/floor-source-corpus-contract.test.ts --maxWorkers=1`
  - `7` files / `32` tests
- current post-UBIQ re-rank web starting pack:
  - `pnpm --filter @dynecho/web exec vitest run features/workbench/ubiq-open-web-packaged-finish-history-replay-matrix.test.ts features/workbench/ubiq-open-web-packaged-finish-near-miss-card-matrix.test.ts features/workbench/ubiq-lnw-plus-ci-bound-history-guard.test.ts features/workbench/remaining-source-gap-posture-card-matrix.test.ts features/workbench/compose-workbench-report-bound-metrics.test.ts features/workbench/impact-field-guides-bound-metrics.test.ts --maxWorkers=1`
  - `6` files / `13` tests
- web typecheck:
  - `pnpm --filter @dynecho/web typecheck`
  - green with the known Next.js TypeScript plugin recommendation
- web lint:
  - `pnpm --filter @dynecho/web lint`
  - green
- full web suite:
  - `pnpm --filter @dynecho/web test`
  - `110` files / `633` tests
- engine typecheck:
  - `pnpm --filter @dynecho/engine typecheck`
  - green
- engine lint:
  - `pnpm --filter @dynecho/engine lint`
  - green
- root typecheck:
  - `pnpm typecheck`
  - green after the small `e2e/workbench.spec.ts` helper return-type cleanup
- root lint:
  - `pnpm lint`
  - green
- full engine suite:
  - `pnpm --filter @dynecho/engine test`
  - `115` files / `830` tests
- cross-package build:
  - `pnpm build`
  - green
  - known non-blocking warnings:
    - `sharp/@img` optional-package warnings through `proposal-docx`
    - Next.js TypeScript plugin recommendation
- whitespace gate:
  - `git diff --check`
  - green

Build note:

- `pnpm build` rewrote `apps/web/next-env.d.ts` from
  `./.next-typecheck/types/routes.d.ts` to `./.next/types/routes.d.ts`
- the file was restored to the pre-build `.next-typecheck` reference after the
  green build

## Committed Checkpoint Shape

The checkpoint is committed in `1be632d`. Treat the following package groups as
the accepted restart baseline, not as unreviewed dirty work.

Do not reopen or revert these groups while selecting the next slice unless a
new failing test or source finding specifically targets them.

High-level package groups represented in the checkpoint commit:

- UBIQ weak-band exact import and topology correction
- UBIQ supported-band finish completion
- `Ln,w+CI` bound-surface support
- metric-specific bound report/reference/guide surfaces
- UBIQ combined-bound history and near-miss posture guards
- remaining source-gap posture matrix
- raw bare open-web/open-box source-evidence re-rank
- TUAS open-box same-package fragmentation guard
- UBIQ packaged open-web finish-family guard
- UBIQ packaged open-web near-miss/drop-off matrix
- UBIQ packaged open-web history-replay guard
- living docs updates reflecting the same sequence

## Implementation Comparison

The current implementation and living docs were compared at this checkpoint.

Implementation facts now reflected in docs:

- exact UBIQ weak-band rows are imported as exact-only correction rows:
  - `packages/catalogs/src/floor-systems/ubiq-open-web-weak-band-rows.ts`
  - `packages/engine/src/ubiq-open-web-weak-band-exact-source-mapping.test.ts`
  - `apps/web/features/workbench/ubiq-open-web-weaker-band-card-posture.test.ts`
- supported UBIQ open-web finish rows are split out of the monolithic exact
  catalog:
  - `packages/catalogs/src/floor-systems/ubiq-open-web-supported-band-rows.ts`
  - `packages/engine/src/ubiq-open-web-supported-band-finish-completion.test.ts`
- UBIQ carpet rows that only publish `Ln,w+CI <=45` are modeled as
  metric-specific bounds, not exact impact rows:
  - `packages/catalogs/src/floor-systems/ubiq-open-web-supported-band-carpet-bound-rows.ts`
  - `packages/shared/src/domain/impact-bound.ts`
  - `packages/engine/src/impact-lnw-plus-ci-bound-surface.test.ts`
- malformed UBIQ bound-only near-misses fail closed instead of borrowing nearby
  exact rows:
  - `packages/engine/src/bound-only-floor-near-miss.ts`
  - `packages/engine/src/ubiq-lnw-plus-ci-near-miss-estimate-posture.test.ts`
  - `apps/web/features/workbench/ubiq-lnw-plus-ci-near-miss-estimate-posture.test.ts`
- report, Dutch reference, guide, and product-bound surfaces now distinguish
  `Ln,w+CI` bounds from exact `Ln,w`:
  - `apps/web/features/workbench/compose-workbench-report.ts`
  - `apps/web/features/workbench/dutch-impact-reference.ts`
  - `apps/web/features/workbench/impact-field-guides.ts`
  - `apps/web/features/workbench/impact-product-catalog-panel.tsx`
- deferred source gaps are executable posture tests, not undocumented judgement:
  - `packages/engine/src/source-gap-candidate-re-rank-contract.test.ts`
  - `packages/engine/src/remaining-source-gap-posture-matrix.test.ts`
  - `apps/web/features/workbench/remaining-source-gap-posture-card-matrix.test.ts`
  - `packages/engine/src/raw-bare-open-web-open-box-source-evidence-rerank-contract.test.ts`
- the latest UBIQ packaged history-replay guard exists and is referenced from
  current docs:
  - `apps/web/features/workbench/ubiq-open-web-packaged-finish-history-replay-matrix.test.ts`

Docs updated to match those facts:

- `docs/calculator/NEXT_IMPLEMENTATION_PLAN.md`
- `docs/calculator/CURRENT_STATE.md`
- `docs/calculator/CALCULATION_MODEL_AND_VALIDATION.md`
- `docs/calculator/DYNAMIC_CALCULATOR_PLAN.md`
- `docs/calculator/DYNAMIC_CALCULATOR_COVERAGE_ACCURACY_PLAN.md`
- `docs/calculator/DYNAMIC_CALCULATOR_REMAINING_WORK_PLAN.md`
- `docs/calculator/SOURCE_GAP_LEDGER.md`
- `docs/calculator/README.md`

Small checkpoint cleanup completed:

- the docs read order now starts from this checkpoint
- `NEXT_IMPLEMENTATION_PLAN.md` now has a current post-UBIQ re-rank starting
  pack instead of the older selected-next-slice pack
- `e2e/workbench.spec.ts` now returns explicit `null` instead of leaking
  `undefined` from `readPrimaryGuidedMetric`, keeping the root TypeScript
  contract green
- the new history replay guard, this checkpoint, and the docs README have no
  `TODO`, `FIXME`, `.only`, `console.log`, or `debugger` leftovers
- `git diff --check` is green

## Architecture Health Scan

Checked at this checkpoint:

- root `pnpm typecheck`: green
- root `pnpm lint`: green
- full engine suite: green
- full web suite: green
- `pnpm build`: green
- touched-file size scan
- repo source size scan across `apps/web/features/workbench`, `packages/engine`,
  `packages/catalogs`, and `packages/shared`

Current conclusion:

- no new production-code monolith was introduced by the latest history-replay
  slice
- the new UBIQ history replay guard is `463` lines and stays focused on one
  route family plus one workbench history surface
- the new checkpoint is `301` lines and intentionally replaces scattered
  handoff context with one current restart document
- the UBIQ catalog work moves rows out of the monolithic exact catalog into
  focused source files:
  - `ubiq-open-web-weak-band-rows.ts`
  - `ubiq-open-web-supported-band-rows.ts`
  - `ubiq-open-web-supported-band-carpet-bound-rows.ts`
- the main remaining large files are known existing debt, not newly introduced
  uncontrolled growth:
  - `packages/engine/src/dynamic-airborne.ts`: large wall selector/airborne core;
    do not refactor during a floor-source checkpoint unless a wall-specific
    behavior slice is opened
  - `packages/engine/src/calculate-assembly.test.ts` and
    `packages/engine/src/calculate-impact-only.test.ts`: broad regression suites;
    future additions should prefer focused new guard files over growing them
  - `packages/catalogs/src/floor-systems/exact-floor-systems.ts`: still large,
    but this checkpoint moved the new UBIQ rows into focused modules instead of
    expanding it
  - `apps/web/features/workbench/floor-family-regressions.test.ts`: broad
    historical workbench guard; current UBIQ route/card/history additions were
    placed in focused files instead of adding more bulk there

No immediate refactor was opened at this checkpoint because the remaining large
files are behavior-sensitive and already covered by green broad gates. The safe
next cleanup path is to continue moving new source-family coverage into focused
modules/tests rather than splitting old core files during source-family work.

## Current Next Step

Selected next planning slice:

- `post_ubiq_source_gap_re_rank_v1`

Completed immediate implementation action from that planning slice:

- `post_ubiq_source_gap_decision_matrix_v1`
- no runtime behavior change
- purpose: update the executable source-gap selector so the already completed
  UBIQ weak-band exact-import path is no longer presented as the active next
  task

Closed next research action:

- `tuas_c11c_frequency_source_recheck_v1`
- no runtime behavior change
- result: keep `C11c` fail-closed because the weak measured tuple is not
  explained by `CI` or `CI,50-2500`

Closed next research action:

- `dataholz_gdmtxa04a_material_surface_recheck_v1`
- no runtime behavior change
- result: keep `GDMTXA04A` direct-official-id exact only and visible
  estimate-routed because the source top layer is a composite dry screed element
  (`2x12.5 mm` gypsum fibre with `40 mm` mineral wool), not the current local
  single `dry_floating_gypsum_fiberboard` surface

Closed checkpoint action:

- `checkpoint_validation_and_commit_v1`
- no runtime behavior change
- current close-out validation is green:
  - engine source-gap/Dataholz/C11c pack: `6` files / `23` tests
  - web remaining-source-gap + Dataholz card pack: `2` files / `8` tests
  - full engine suite: `117` files / `837` tests
  - full web suite: `110` files / `633` tests
  - engine/web typecheck and lint
  - `pnpm build` green with known optional `sharp/@img` warnings
  - `git diff --check`

Closed next planning action:

- `post_checkpoint_next_slice_selection_v1`
- no runtime behavior change
- selected and implemented:
  `clt_combined_anchor_history_replay_matrix_v1`
- selected route family / output surface:
  `tuas_combined_clt_anchors` / `workbench_field_impact_cards`

Closed next implementation action:

- `clt_combined_anchor_history_replay_matrix_v1`
- no runtime behavior change
- result: `C4c` exact, `C5c` predictor-backed, and under-described
  combined-CLT fail-closed routes now survive split, row-order bounce,
  save/load, and floor/wall mode detour on workbench field impact cards

Selected next planning action:

- `post_clt_combined_anchor_history_next_slice_selection_v1`
- no runtime behavior change
- choose the next single route family and output surface; do not treat the CLT
  history guard as permission for broad raw-floor, Dataholz, C11c, UBIQ, or wall
  selector widening

Architecture checkpoint note:

- no production runtime file changed in this pass
- current large-file hotspots are pre-existing:
  `packages/engine/src/dynamic-airborne.ts`,
  `apps/web/features/workbench/simple-workbench-proposal.ts`,
  `apps/web/features/workbench/simple-workbench-proposal-panel.tsx`, and
  `packages/engine/src/impact-predictor-input.ts`
- future behavior work touching those files should extract a narrow helper or
  module with regression tests before widening the calculator surface

Purpose:

- re-rank raw-floor, CLT-local, wall-selector, Dataholz, and remaining UBIQ
  candidates after the packaged UBIQ exact/bound/near-miss/history surfaces are
  now frozen
- name exactly one next implementation slice with value/origin/basis/support and
  workbench/report test requirements before any runtime widening

Hard constraints:

- raw bare open-web/open-box impact support remains closed
- TUAS `C11c` remains deferred / impact-fail-closed
- Dataholz `GDMTXA04A` remains estimate-only
- UBIQ FRL/D visible-code drift remains a provenance/documentation issue, not a
  runtime rename prompt
- no broad weak-band family fallback
- no wall-selector widening without a fresh classified red or source-backed
  behavior plan

## Accepted Commit Notes

This checkpoint was accepted as one commit:

```text
1be632d test(calculator): lock UBIQ packaged floor source and history surfaces
```

The package map that was reviewed for that commit:

1. UBIQ source/catalog/runtime support changes
   - shared bound schema and target-output support
   - exact/bound UBIQ catalog rows
   - selector/match/estimate fail-closed behavior around UBIQ bound-only
     near-misses
2. UBIQ and TUAS no-runtime route/card/history guards
   - weak-band posture tests
   - supported-band finish completion tests
   - same-package fragmentation tests
   - packaged finish-family / near-miss / history-replay tests
3. Report/reference/guide bound-surface completion
   - workbench report, Dutch reference, guide, trace/card/report UI surfaces
   - matching web tests
4. Source-gap re-rank and posture contracts
   - remaining-source-gap posture
   - raw bare open-web/open-box source evidence
   - `C11c` / `GDMTXA04A` deferred posture docs and tests
5. Docs/checkpoint refresh
   - current-state and next-plan updates
   - source-gap ledger updates
   - this checkpoint
