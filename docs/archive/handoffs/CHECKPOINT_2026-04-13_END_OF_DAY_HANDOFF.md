# 2026-04-13 End-of-Day Handoff Checkpoint

This is the clean resume point for the next agent. It supersedes the older
"current dirty worktree" wording in the stabilization checkpoint; that file is
now historical context for how the previous large change set was accepted.

## Current Resume State

- Implementation baseline before this docs-only handoff: `8f321de`
  (`test(calculator): pin open box dry package fragmentation`).
- Worktree target at handoff: clean, with this document committed separately as
  documentation-only checkpoint.
- Latest implementation work did not widen solver/runtime behavior. It added
  answer-measuring guards and synchronized the plan docs.
- The defended corridors are usable for continued development, but the project
  is not ready to call product-complete. Remaining work is source-backed
  coverage expansion, exact-formula validation, and controlled behavior opening.

## Latest Accepted Commits

- `8f321de` - TUAS R5b open-box dry package fragmentation trace/card guards.
- `b2cc5b7` - TUAS R2b open-box finish-tolerance mixed-history boundary guard.
- `81f15c6` - UBIQ open-web packaged-lane trace/card guards.
- `646bdf8` - Raw-floor hostile input answer matrix.
- `e664c81` - Wall selector trace matrices.

## Validation Snapshot

The latest broad validation was rerun after the docs-only handoff edits. These
gates were green:

- `pnpm --filter @dynecho/engine typecheck`
- `pnpm --filter @dynecho/web typecheck`
  - Green with the known Next.js TypeScript plugin recommendation.
- `pnpm --filter @dynecho/engine test`
  - `103` files, `791` tests.
- `pnpm --filter @dynecho/web test`
  - `99` files, `607` tests.
- `pnpm build`
  - Green with known optional-package warnings around `sharp/@img` and the
    existing Next.js TypeScript plugin recommendation.
- `git diff --check`
  - Green.

## Read First Next Time

Read these in order:

1. `docs/calculator/CURRENT_STATE.md`
2. `docs/calculator/NEXT_IMPLEMENTATION_PLAN.md`
3. `docs/calculator/CALCULATION_MODEL_AND_VALIDATION.md`
4. `docs/calculator/SOURCE_GAP_LEDGER.md`
5. `docs/calculator/STABILIZATION_CHECKPOINT_2026-04-13.md`

The stabilization checkpoint is still useful, but only as the historical package
map for the accepted large dirty-worktree state. Do not treat it as saying the
repo is currently dirty.

## Important Constraints For The Next Slice

- Do not open a broad raw-floor behavior path yet. If behavior changes are
  needed, name exactly one route family and one output surface first, then write
  value/origin/support/card tests before changing runtime code.
- Do not use the R5b dry fragmentation guard as permission to support unrelated
  bare open-box impact cases. It only proves source-equivalent fragmentation for
  the exact dry package.
- Do not use the R2b finish-tolerance guard as permission to loosen laminate or
  EPS matching globally. It only proves a narrow measured package boundary:
  `10 mm` laminate split `4+6` exact; `12 mm` laminate split `6+6` impact
  remains unsupported/needs-input.
- UBIQ packaged-lane guards do not open the bare open-web raw carrier.
- C11c, weak UBIQ bands, GDMTXA04A exact reopen, and raw bare open-box impact
  support remain fail-closed/deferred unless the next plan explicitly chooses
  one narrow source-backed behavior opening.

## Architecture Watch

- `packages/engine/src/dynamic-airborne.ts` is still a large core file. Prefer
  narrow additions, extraction, or separate focused modules when touching this
  area.
- `apps/web/features/workbench/floor-family-regressions.test.ts` is already
  large. Recent work deliberately added separate focused test files instead of
  growing it. Keep doing that unless a local edit is unavoidable.
- Keep non-obvious behavior documented both in code comments and in calculator
  docs when changing solver decisions.

## Recommended Next Action

Start with a re-rank, not a runtime change. Choose either:

- another no-widening, source-backed answer/card guard for an already defended
  package family with high hostile-input risk; or
- one deliberately small behavior opening with a named route family, output
  surface, source evidence, trace tests, web card tests, and docs updated in the
  same slice.

The safer default is another no-widening guard until the exact formula-selection
evidence is documented tightly enough to justify behavior changes.
