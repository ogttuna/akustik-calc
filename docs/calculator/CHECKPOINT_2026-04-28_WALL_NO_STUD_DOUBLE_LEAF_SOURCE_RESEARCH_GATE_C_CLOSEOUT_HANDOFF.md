# Checkpoint - Wall No-Stud Double-Leaf Source Research Gate C Closeout Handoff

Date: 2026-04-28

## What Landed

`wall_no_stud_double_leaf_source_research_v1` Gate C closed
no-runtime:

- `packages/engine/src/post-wall-no-stud-double-leaf-source-research-v1-next-slice-selection-contract.test.ts`
  records the no-stud closeout and selects the next calculator accuracy
  slice.
- `docs/calculator/SLICE_WALL_TIMBER_DOUBLE_BOARD_SOURCE_RESEARCH_PLAN.md`
  is the new active planning surface.
- `tools/dev/run-calculator-current-gate.ts` now includes the Gate C
  closeout contract in the focused calculator gate.

No acoustic runtime values, formulas, support classifications,
confidence classes, evidence text, warnings, API behavior, or web
route-card copy changed.

## Gate C Decision

The no-stud double-leaf source research slice is closed no-runtime.

| Surface | Closeout posture |
|---|---|
| Empty no-stud route | stays formula-owned at `R'w=46`, `Rw=48` |
| Porous no-stud route | stays formula-owned at `R'w=41`, `Rw=43` |
| Davy / Sharp line | relevant but not a current local single-number tolerance owner |
| NRC archive | useful reservoir but no extracted no-stud/no-rail row mapping yet |
| Gypsum-block rows | adjacent-material evidence only |

The selected next slice is
`wall_timber_double_board_source_research_v1`.

It is selected because the source-catalog queue still lists timber
double-board, CLT wall, and lined-massive / heavy-core concrete as
valid wall source gaps; timber double-board is the next highest-value
candidate after no-stud double-leaf because the live
`wall-timber-stud` route is common, still low-confidence formula, and
has nearby exact/source corpus evidence that can be audited without
guessing.

## Validation

- Baseline before Gate C edits: `pnpm calculator:gate:current` green
  with engine 115 files / 534 tests, web 43 files / 211 passed + 18
  skipped, build 5/5, and the known non-fatal `sharp/@img` warnings.
- Targeted Gate C validation:
  `pnpm --filter @dynecho/engine exec vitest run src/post-wall-no-stud-double-leaf-source-research-v1-next-slice-selection-contract.test.ts --maxWorkers=1`
  green with 1 file / 5 tests.
- Post-doc focused validation: `pnpm calculator:gate:current` green
  with engine 116 files / 539 tests, web 43 files / 211
  passed + 18 skipped, build 5/5, and the known non-fatal `sharp/@img`
  warnings.
- `git diff --check` clean.

## Resume Instructions

Start from:

1. `docs/calculator/NEXT_IMPLEMENTATION_PLAN.md`
2. this checkpoint
3. `docs/calculator/SLICE_WALL_TIMBER_DOUBLE_BOARD_SOURCE_RESEARCH_PLAN.md`
4. `docs/calculator/CURRENT_STATE.md`

Next implementation file:

- `packages/engine/src/wall-timber-double-board-source-research-gate-a-contract.test.ts`

Gate A must stay no-runtime unless it proves a complete direct row or a
bounded formula tolerance owner. It should not import values, change
confidence/support/evidence text, or add route-card copy without paired
engine value and web route-card tests.
