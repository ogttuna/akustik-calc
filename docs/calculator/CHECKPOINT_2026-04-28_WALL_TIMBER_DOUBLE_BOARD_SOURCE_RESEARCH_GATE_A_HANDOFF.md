# Checkpoint - Wall Timber Double-Board Source Research Gate A Handoff

Date: 2026-04-28

## What Landed

`wall_timber_double_board_source_research_v1` Gate A landed
no-runtime:

- `packages/engine/src/wall-timber-double-board-source-research-gate-a-contract.test.ts`
  pins the current generated `wall-timber-stud` route, classifies the
  already-landed timber/lightweight source corpus, and records the Gate
  A source/tolerance decision matrix.
- `tools/dev/run-calculator-current-gate.ts` now includes the Gate A
  contract in the focused calculator gate.

No acoustic runtime values, formulas, support classifications,
confidence classes, evidence text, warnings, API behavior, or web
route-card copy changed.

## Gate A Decision

No direct runtime import and no formula/tolerance Gate B are ready now.

| Candidate | Gate A status | Why it stays frozen |
|---|---|---|
| Current generated `wall-timber-stud` route | formula-owned live route | no verified exact match, no lab-fallback match, no same-stack direct row, and no named bounded timber-stud formula tolerance owner |
| Direct single-board timber exact rows | adjacent exact imports | useful source truth for single-board topology only; board count and layer signature do not match the live double-board route |
| RB1/RB2 resilient timber rows | topology-bounded adjacent exact imports | require explicit resilient bar side count and acoustic-board topology; they cannot promote a direct line-connection live route |
| Gyproc Ireland A026025 2x15 FireLine direct double-board row | secondary benchmark | direct double-board family evidence, but proprietary FireLine mapping, no fill, 100 mm cavity, and 2x15 boards do not match the live 2x12.5 gypsum-board / rockwool / air-gap stack |
| Knauf W111/W112 linked lightweight holdouts | non-timber context | steel-framed companions remain linked holdouts, not wood-stud source truth |
| Published timber-stud formula/tolerance owner | missing | no named source currently supplies a bounded local single-number `Rw` tolerance for the live route |

Gate A selected Gate C no-runtime closeout / next-slice selection as the
next bounded action. The current route remains formula-owned,
low-confidence, and pinned at generated lab `Rw=50`, generated field
`R'w=42`, generated field-context `DnT,w=43`, and workbench
building-context card `DnT,w=44`.

## Validation

- Baseline before Gate A edits: `pnpm calculator:gate:current` green
  with engine 116 files / 539 tests, web 43 files / 211 passed + 18
  skipped, build 5/5, and the known non-fatal `sharp/@img` warnings.
- Targeted Gate A validation:
  `pnpm --filter @dynecho/engine exec vitest run src/wall-timber-double-board-source-research-gate-a-contract.test.ts --maxWorkers=1`
  green with 1 file / 5 tests.
- Post-doc focused validation: `pnpm calculator:gate:current` green
  with engine 117 files / 544 tests, web 43 files / 211 passed + 18
  skipped, build 5/5, and the known non-fatal `sharp/@img` warnings.
- `git diff --check` clean.

## Resume Instructions

Start from:

1. `docs/calculator/NEXT_IMPLEMENTATION_PLAN.md`
2. this checkpoint
3. `docs/calculator/SLICE_WALL_TIMBER_DOUBLE_BOARD_SOURCE_RESEARCH_PLAN.md`
4. `docs/calculator/CURRENT_STATE.md`

Next implementation file:

- `packages/engine/src/post-wall-timber-double-board-source-research-v1-next-slice-selection-contract.test.ts`

Gate C should close the timber double-board source research slice
no-runtime and select the next wall source-catalog gap. It should not
import values, change confidence/support/evidence text, or add
route-card copy.
