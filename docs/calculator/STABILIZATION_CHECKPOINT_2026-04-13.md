# Stabilization Checkpoint 2026-04-13

Document role:

- preserve the accepted large dirty-worktree stabilization map as historical context
- record which changes are behavior-affecting, test-only, fixture-only, or docs-only
- give the next agent a safe restart point before any new source-led widening work

This is a checkpoint document, not a new solver plan.

## Post-Acceptance Update

Accepted on: `2026-04-13`

The dirty-worktree packages classified below were committed into five reviewable
commits:

- `b278baa test(engine): stabilize validation and full-suite gates`
- `bdc91e7 fix(engine): preserve explicit floor stack intent`
- `9c0ed2e test(engine): lock TUAS C11c fail-closed posture`
- `bf585b7 test(workbench): expand mixed route torture coverage`
- `f3c0ace docs(calculator): refresh execution checkpoint`

Post-commit state:

- worktree: clean
- `git diff --check`: green
- `pnpm --filter @dynecho/engine typecheck`: green
- targeted workbench pack: `7` files, `19` tests, green
- targeted engine pack: `5` files, `9` tests, green
- accepted full engine gate: `pnpm --filter @dynecho/engine test`
  - `93` files, `757` tests, green
- `pnpm build`: green

Use `NEXT_IMPLEMENTATION_PLAN.md` for the current next slice. This checkpoint
remains useful as the package map for the accepted commit stack.

## Current State

Checkpoint date: `2026-04-13`

Worktree shape at checkpoint creation:

- tracked modified files before this checkpoint doc: `61`
- tracked diff before this checkpoint doc: `1281` insertions, `642` deletions
- untracked project files before this checkpoint doc:
  - `docs/calculator/FULL_ENGINE_SUITE_TRIAGE_2026-04-12.md`
  - `docs/calculator/NEXT_IMPLEMENTATION_PLAN.md`
  - `packages/engine/src/floor-system-test-layer-builders.ts`
  - `packages/engine/src/tuas-c11c-wet-stack-anomaly-audit.test.ts`

This worktree shape was the pre-acceptance stabilization state. The accepted
post-commit state is clean; do not use this historical dirty-worktree note as a
reason to expect uncommitted changes after `f3c0ace`.

## Last Verified Gate

Latest broad validation before this checkpoint:

- `pnpm --filter @dynecho/web exec vitest run features/workbench/mixed-study-mode-torture.test.ts --reporter=basic`
  - `1` file, `3` tests, green
- `pnpm --filter @dynecho/web exec vitest run features/workbench/mixed-study-mode-torture.test.ts features/workbench/mixed-study-mode-generated-matrix.test.ts features/workbench/mixed-study-mode-generated-edit-history-matrix.test.ts features/workbench/mixed-study-mode-generated-history-grid.test.ts features/workbench/floor-seeded-edit-stability.test.ts features/workbench/wall-seeded-edit-stability.test.ts --reporter=basic`
  - `6` files, `10` tests, green
- `pnpm --filter @dynecho/engine exec vitest run src/mixed-floor-wall-generated-matrix.test.ts src/mixed-floor-wall-complex-stack.test.ts --reporter=basic`
  - `2` files, `2` tests, green
- `pnpm --filter @dynecho/engine typecheck`
  - green
- `pnpm --filter @dynecho/engine exec vitest run --maxWorkers=1 --reporter=basic`
  - `93` files, `757` tests, green
- `pnpm build`
  - green
  - known non-blocking warnings remain:
    - `sharp/@img` optional packages through `proposal-docx`
    - Next.js TypeScript plugin recommendation
- `git diff --check`
  - green

## Package Map

These were the reviewable packages inside the pre-acceptance dirty worktree.

### 1. Full Engine Suite Triage And Unsupported-Gap Discipline

Intent:

- turn the broad engine suite back into a stable green gate
- separate real defects from stale expectations and worker-RPC instability
- add an explicit unsupported-gap posture for source-backed combinations that must fail closed

Representative files:

- `docs/calculator/FULL_ENGINE_SUITE_TRIAGE_2026-04-12.md`
- `packages/engine/package.json`
- `packages/engine/src/impact-validation-regime.ts`
- `packages/engine/src/impact-validation-regime.test.ts`
- `apps/web/features/workbench/validation-regime.ts`
- `apps/web/features/workbench/validation-regime.test.ts`
- `apps/web/features/workbench/validation-regime-panel.tsx`
- `packages/engine/src/dynamic-airborne-deep-hybrid-test-helpers.ts`
- `packages/engine/src/dynamic-airborne-deep-hybrid-*.test.ts`
- `packages/engine/src/dynamic-airborne-family-boundary*.test.ts`
- `packages/engine/src/airborne-lined-massive-stability.test.ts`

Review notes:

- the engine package full-suite path is now the single-worker command/script
- direct multi-worker `vitest run` can still hit worker RPC timeout on CPU-heavy scans even when assertions are green
- unsupported source gaps are now first-class validation posture, not low-confidence estimates

### 2. Impact Source Truth, Fixture, And Upstream Parity Refresh

Intent:

- align stale benchmark fixtures to the current source-truth posture
- make upstream parity comparison strict for unlisted mismatches while documenting accepted divergences

Representative files:

- `packages/engine/fixtures/reference-benchmarks-impact-real-world-field-coverage-2026.json`
- `packages/engine/fixtures/reference-benchmarks-impact-real-world-floor-coverage-2026.json`
- `packages/engine/fixtures/reference-benchmarks-impact-validation-2026.json`
- `tools/upstream/compare-impact-parity.ts`
- `tools/upstream/compare-impact-only-parity.ts`
- `tools/upstream/fixtures/impact-parity-cases.ts`
- `tools/upstream/fixtures/impact-only-parity-cases.ts`
- `packages/engine/src/impact-validation-benchmark.test.ts`
- `packages/engine/src/impact-layer-stack-driven.test.ts`
- `packages/engine/src/impact-common-floor-combinations.test.ts`
- `packages/engine/src/predictor-published-family-estimate.test.ts`
- `packages/engine/src/ubiq-candidate-backlog-contract.test.ts`

Review notes:

- this is source/fixture alignment, not opportunistic widening
- accepted upstream divergence is explicit and fail-strict for unlisted mismatches

### 3. Explicit Floor-Role And Split-Parity Hardening

Intent:

- keep fully tagged floor stacks on explicit operator intent
- preserve split-layer parity only through merge-safe contiguous same-role pieces
- avoid re-inferring explicit stacks into broader predictor lanes

Representative files:

- `packages/engine/src/calculate-assembly.ts`
- `packages/engine/src/calculate-impact-only.ts`
- `packages/engine/src/impact-predictor-input.ts`
- `packages/engine/src/floor-system-evaluation.ts`
- `packages/engine/src/floor-system-test-layer-builders.ts`
- `packages/engine/src/floor-library-raw-parity.test.ts`
- `packages/engine/src/floor-library-sweep.test.ts`
- `packages/engine/src/raw-floor-exact-exception-audit.test.ts`
- `packages/engine/src/raw-floor-weaker-carrier-posture.test.ts`
- `packages/engine/src/bare-floor-raw-support.test.ts`
- `packages/engine/src/clt-floor-monotonicity.test.ts`
- `packages/engine/src/floor-topology-sanity-sweep.test.ts`
- `packages/engine/src/dynamic-floor-regression-matrix.test.ts`

Review notes:

- this is behavior-affecting but conservative
- it narrows unsafe inference instead of opening new coverage
- the non-obvious behavior is commented in both `calculate-assembly.ts` and `calculate-impact-only.ts`

### 4. TUAS Combined-CLT Boundary And C11c Fail-Closed Audit

Intent:

- keep `C2c`, `C3c`, `C4c`, and `C7c` as exact anchors
- keep `C5c` predictor-backed
- keep `C11c` source-known but impact-unsupported until its weak wet-stack tuple is source-explained

Representative files:

- `packages/engine/src/tuas-c11c-wet-stack-anomaly-audit.test.ts`
- `packages/engine/src/tuas-candidate-backlog-contract.test.ts`
- `packages/engine/src/tuas-clt-backlog-decision-contract.test.ts`
- `packages/engine/src/tuas-post-corridor-screening-contract.test.ts`
- `packages/engine/src/tuas-support-surface-decision-contract.test.ts`
- `packages/engine/src/floor-source-corpus-contract.test.ts`
- `docs/calculator/SOURCE_GAP_LEDGER.md`

Review notes:

- no `C11c` exact row landed
- no generic combined-CLT widening landed
- C11c remains screening-only / impact-unsupported by executable test

### 5. Mixed Generated Boundary Torture Expansion

Intent:

- bring high-risk floor boundary surfaces into the mixed floor/wall generated engine and workbench matrices

Representative files:

- `packages/engine/src/mixed-floor-wall-generated-test-helpers.ts`
- `apps/web/features/workbench/mixed-study-mode-generated-test-helpers.ts`
- `packages/engine/src/mixed-floor-wall-generated-matrix.test.ts`
- `apps/web/features/workbench/mixed-study-mode-generated-matrix.test.ts`
- `apps/web/features/workbench/mixed-study-mode-generated-edit-history-matrix.test.ts`
- `apps/web/features/workbench/mixed-study-mode-generated-history-grid.test.ts`

Review notes:

- includes TUAS `C11c` as fail-closed generated boundary
- includes Dataholz `GDMTXA04A` as manual-match boundary routed conservatively
- no catalog or selector widening landed in this package

### 6. Mixed History-Grid Variant Expansion

Intent:

- widen generated workbench duplicate/swap/rebuild histories from two variants to four complementary variants

Representative file:

- `apps/web/features/workbench/mixed-study-mode-generated-history-grid.test.ts`

Review notes:

- test-only
- no store behavior changed
- direct final rows and scenario snapshots must match across all variants

### 7. Mixed Seeded Cross-Mode Wall-Family Expansion

Intent:

- widen the representative mixed torture save/load chain beyond one wall-family detour

Representative file:

- `apps/web/features/workbench/mixed-study-mode-torture.test.ts`

Review notes:

- test-only
- adds a concrete-wall detour beside the existing deep-hybrid wall detour
- checks saved-scenario retention boundary and reload parity

### 8. Documentation And Agent Restart Surface

Intent:

- make the project state readable by the next agent without rediscovering the full thread
- ensure stale historical docs do not override living state docs

Representative files:

- `docs/README.md`
- `docs/calculator/README.md`
- `docs/calculator/CURRENT_STATE.md`
- `docs/calculator/NEXT_IMPLEMENTATION_PLAN.md`
- `docs/calculator/DYNAMIC_CALCULATOR_REMAINING_WORK_PLAN.md`
- `docs/calculator/DYNAMIC_CALCULATOR_COVERAGE_ACCURACY_PLAN.md`
- `docs/calculator/DYNAMIC_CALCULATOR_PLAN.md`
- `docs/calculator/DYNAMIC_WALL_STABILITY_REMEDIATION.md`

Review notes:

- `NEXT_IMPLEMENTATION_PLAN.md` is the concise restart plan
- `CURRENT_STATE.md` is the current truth snapshot
- this checkpoint is only historical dirty-worktree stabilization and package classification

## Current Risk Register

- `pnpm build` is green but still prints the known `sharp/@img` optional-package warnings through `proposal-docx`.
- `pnpm build` is green but still prints the known Next.js TypeScript plugin recommendation.
- direct broad multi-worker engine Vitest remains operationally less stable than the documented `--maxWorkers=1` gate.
- the current diff is intentionally broad; do not add new solver widening until these packages are reviewed or committed.
- the next behavior-affecting work should be a single source-led raw/predictor widening family, not another opportunistic broad route change.

## Safe Next Move

The accepted next implementation slice is now maintained in
`NEXT_IMPLEMENTATION_PLAN.md`.

Current restart rule:

- execute one concrete `source_led_raw_or_predictor_widening_v1` family
- start with the selected Dataholz timber-frame role-gated raw/predictor audit
- write the contract tests first
- land only source-backed behavior
- keep unsupported or under-described combinations fail-closed
- keep the accepted full engine gate on `pnpm --filter @dynecho/engine test`
