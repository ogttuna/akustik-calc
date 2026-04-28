# Checkpoint - Wall CLT Wall Source Research Gate A Handoff

Date: 2026-04-28

## What Landed

`wall_clt_wall_source_research_v1` Gate A landed no-runtime:

- `packages/engine/src/wall-clt-wall-source-research-gate-a-contract.test.ts`
  pins the current generated `wall-clt-local` route, classifies Dataholz
  CLT rows as floor-only source truth, records wall-specific CLT source
  and laminated-leaf tolerance blockers, and selects Gate C closeout.
- `tools/dev/run-calculator-current-gate.ts` now includes the Gate A
  contract in the focused calculator gate.

No acoustic runtime values, formulas, support classifications,
confidence classes, evidence text, warnings, API behavior, or web
route-card copy changed.

## Gate A Decision

No direct runtime import and no formula/tolerance Gate B are ready now.

| Candidate | Gate A status | Why it stays frozen |
|---|---|---|
| Current generated `wall-clt-local` route | formula-owned live route | no verified exact match, no lab-fallback match, no wall-specific CLT row, and no named laminated-leaf tolerance owner |
| Dataholz CLT floor exact rows | floor-only exact source truth | useful floor source rows, but floor impact/build-up metadata does not supply wall CLT `Rw` or field tolerance ownership |
| Wall-specific CLT / mass-timber rows | missing | no current catalog row has wall source scope, mounting, boundary condition, lining/decoupling, metric context, and tolerance metadata |
| Laminated single-leaf / mass-timber formula owner | missing | current `laminated_leaf_sharp_delegate` is formula-owned behavior, not a named bounded tolerance pack |
| Report/export/product-delta CLT context | non-source context | cannot move runtime or visible copy without source row/tolerance and paired web tests |

Gate A selected Gate C no-runtime closeout / next-slice selection as the
next bounded action. The current route remains formula-owned,
medium-confidence, and pinned at generated lab `Rw=42`, generated field
`R'w=41`, generated field-context `DnT,w=42`, and strategy
`laminated_leaf_sharp_delegate`.

## Validation

- Baseline before Gate A edits: `pnpm calculator:gate:current` green
  with engine 118 files / 549 tests, web 43 files / 211 passed + 18
  skipped, build 5/5, and the known non-fatal `sharp/@img` warnings.
- Targeted Gate A validation:
  `pnpm --filter @dynecho/engine exec vitest run src/wall-clt-wall-source-research-gate-a-contract.test.ts --maxWorkers=1`
  green with 1 file / 5 tests.
- Post-doc focused validation: `pnpm calculator:gate:current` green
  with engine 119 files / 554 tests, web 43 files / 211 passed + 18
  skipped, build 5/5, whitespace guard clean, and the known non-fatal
  `sharp/@img` warnings.
- `git diff --check` clean after the current plan/current state
  updates.

## Resume Instructions

Start from:

1. `docs/calculator/NEXT_IMPLEMENTATION_PLAN.md`
2. this checkpoint
3. `docs/calculator/SLICE_WALL_CLT_WALL_SOURCE_RESEARCH_PLAN.md`
4. `docs/calculator/CURRENT_STATE.md`

Next implementation file:

- `packages/engine/src/post-wall-clt-wall-source-research-v1-next-slice-selection-contract.test.ts`

Gate C should close the CLT wall source research slice no-runtime and
select the next wall source-catalog gap, expected to be lined-massive /
heavy-core concrete source-rule research. It should not import values,
change confidence/support/evidence text, or add route-card copy.
