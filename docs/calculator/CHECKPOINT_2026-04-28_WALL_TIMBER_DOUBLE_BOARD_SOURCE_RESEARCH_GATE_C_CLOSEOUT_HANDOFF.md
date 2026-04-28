# Checkpoint - Wall Timber Double-Board Source Research Gate C Closeout Handoff

Date: 2026-04-28

## What Landed

`wall_timber_double_board_source_research_v1` Gate C closed
no-runtime:

- `packages/engine/src/post-wall-timber-double-board-source-research-v1-next-slice-selection-contract.test.ts`
  closes the timber double-board source-research slice and selects
  `wall_clt_wall_source_research_v1`.
- `docs/calculator/SLICE_WALL_CLT_WALL_SOURCE_RESEARCH_PLAN.md`
  opens the next no-runtime CLT wall source/tolerance research slice.
- `tools/dev/run-calculator-current-gate.ts` now includes the Gate C
  contract in the focused calculator gate.

No acoustic runtime values, formulas, support classifications,
confidence classes, evidence text, warnings, API behavior, or web
route-card copy changed.

## Closeout Decision

Timber double-board remains formula-owned and low-confidence:

- generated id: `wall-timber-stud`;
- lab `Rw=50`;
- generated field `R'w=42`;
- generated field-context `DnT,w=43`;
- workbench building-context card `DnT,w=44`;
- strategy: `stud_surrogate_blend+framed_wall_calibration`;
- blocker: no direct same-stack source row and no named bounded
  timber-stud formula tolerance owner.

Gate A blockers that caused the no-runtime closeout:

- direct single-board timber rows are adjacent exact imports only;
- RB1/RB2 resilient rows require explicit side count and acoustic-board
  topology;
- Gyproc A026025 2x15 FireLine is a secondary direct double-board
  benchmark, not a live-stack import;
- linked Knauf W111/W112 holdouts are steel-framed context, not wood
  stud truth;
- visible web route-card work is not required because no output,
  support, confidence, evidence, or missing-input behavior changed.

## Selected Next Slice

`wall_clt_wall_source_research_v1` is selected because it is the next
source-catalog wall gap after timber double-board:

- the live `wall-clt-local` route is common for mass-timber wall use;
- current behavior is formula-owned at lab `Rw=42`, field `R'w=41`,
  field-context `DnT,w=42`, medium confidence, and
  `laminated_leaf_sharp_delegate`;
- existing Dataholz CLT rows are floor source truth and must remain
  floor-only until wall-specific CLT source evidence appears;
- a wall-specific CLT row or named laminated-leaf tolerance owner is
  still missing.

## Validation

- Baseline before Gate C edits: `pnpm calculator:gate:current` green
  with engine 117 files / 544 tests, web 43 files / 211 passed + 18
  skipped, build 5/5, and the known non-fatal `sharp/@img` warnings.
- Targeted Gate C validation:
  `pnpm --filter @dynecho/engine exec vitest run src/post-wall-timber-double-board-source-research-v1-next-slice-selection-contract.test.ts --maxWorkers=1`
  green with 1 file / 5 tests.
- Post-doc focused validation: `pnpm calculator:gate:current` green
  with engine 118 files / 549 tests, web 43 files / 211 passed + 18
  skipped, build 5/5, and the known non-fatal `sharp/@img` warnings.
- `git diff --check` clean.

## Resume Instructions

Start from:

1. `docs/calculator/NEXT_IMPLEMENTATION_PLAN.md`
2. this checkpoint
3. `docs/calculator/SLICE_WALL_CLT_WALL_SOURCE_RESEARCH_PLAN.md`
4. `docs/calculator/CURRENT_STATE.md`

Next implementation file:

- `packages/engine/src/wall-clt-wall-source-research-gate-a-contract.test.ts`

Gate A should inventory wall-specific CLT rows, laminated-leaf formula
or tolerance candidates, floor-only negative boundaries, and metadata
requirements before any runtime, confidence/support/evidence, API, or
route-card movement.
