# Checkpoint - 2026-04-28 Floor Layer-Order Invariance Expansion Gate C Closeout

Status: Gate C closed no-runtime

## What Closed

`floor_layer_order_invariance_expansion_v1` is closed as a no-runtime
accuracy and support-honesty audit.

Closed evidence:

- Gate A engine contract:
  `packages/engine/src/floor-layer-order-invariance-expansion-gate-a-contract.test.ts`
- Gate C closeout / next-slice selection:
  `packages/engine/src/post-floor-layer-order-invariance-expansion-v1-next-slice-selection-contract.test.ts`
- active slice plan:
  `docs/calculator/SLICE_FLOOR_LAYER_ORDER_INVARIANCE_EXPANSION_PLAN.md`

No acoustic runtime values, formulas, output support, confidence,
evidence text, warnings, API behavior, or route-card copy changed.

## Findings Preserved

- UBIQ FL-28 open-web steel exact row stays exact under reverse, rotate,
  base-first, grouped-by-role, and interleaved UI order edits.
- Dataholz GDMTXN01 dry CLT exact row stays exact under the same
  expanded order edits.
- Raw terminal concrete helper order sensitivity remains explicit:
  moving the concrete helper out of terminal position changes support
  buckets visibly instead of fabricating order invariance.
- Raw open-web impact outputs remain fail-closed after reorder.
- Many-layer split raw concrete stacks remain finite and do not promote
  to exact or bound floor-system matches.
- Broad arbitrary raw floor reorder value invariance remains unclaimed.

## Selected Next Slice

Next selected calculator slice:
`wall_framed_facing_split_warning_stability_v1`.

Planning surface:
[SLICE_WALL_FRAMED_FACING_SPLIT_WARNING_STABILITY_PLAN.md](./SLICE_WALL_FRAMED_FACING_SPLIT_WARNING_STABILITY_PLAN.md).

First action:

Add Gate A no-runtime inventory:
`packages/engine/src/wall-framed-facing-split-warning-stability-gate-a-contract.test.ts`.

Why this is next:

- source import/runtime widening candidates remain blocked by missing
  source evidence or bounded tolerance owners;
- F3 is the remaining documented non-source-blocked calculator drift;
- it is warning-only today, but warnings are part of answer honesty;
- board/facing split edits are a realistic user action;
- the slice can inventory the risk without moving values.

## Boundaries

- Do not change the floor-order Gate A values, support buckets,
  evidence, warnings, or route-card posture during closeout.
- Do not claim broad arbitrary floor layer-order value invariance.
- Do not add global same-material entry coalescing for framed-wall board
  layers; the previous broad coalescing attempt caused benchmark
  failures and is not an acceptable shortcut.
- Do not merge physically distinct board layers as a source/catalog
  equivalence rule.
- Do not reopen `GDMTXA04A`, `C11c`, raw bare open-box/open-web impact,
  floor fallback, no-stud, timber double-board, CLT, lined-massive /
  heavy-core, wall selector, or productization-only work from this green
  closeout.
- Add paired web route-card tests before any visible warning copy,
  support, confidence, evidence, or value behavior changes.

## Validation

Pre-Gate-C baseline:

- `pnpm calculator:gate:current`
  - engine 124 files / 581 tests green
  - web 43 files / 211 passed + 18 skipped
  - build 5/5 with known non-fatal `sharp/@img` warnings
  - whitespace guard clean

Post-Gate-C validation:

- targeted Gate C contract
  - `pnpm --filter @dynecho/engine exec vitest run src/post-floor-layer-order-invariance-expansion-v1-next-slice-selection-contract.test.ts --maxWorkers=1`
  - 1 file / 5 tests green
- `pnpm calculator:gate:current`
  - engine 125 files / 586 tests green
  - web 43 files / 211 passed + 18 skipped
  - build 5/5 with known non-fatal `sharp/@img` warnings
  - whitespace guard clean
