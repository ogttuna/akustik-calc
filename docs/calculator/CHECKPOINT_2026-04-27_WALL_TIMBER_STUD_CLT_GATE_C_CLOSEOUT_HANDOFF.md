# Checkpoint - Wall Timber Stud + CLT Gate C Closeout

Date: 2026-04-27

## Status

`wall_timber_stud_clt_accuracy_pass_v1` is closed at Gate C.

No runtime values, formulas, output support, warnings, confidence
classes, or web cards changed in Gate C. Gate A and the two Gate B
source/formula contracts showed that the selected common wall lanes
should stay formula-owned until new source evidence or bounded rules are
available.

## Closed Wall Decisions

Timber-stud wall remains formula-owned:

- generated id: `wall-timber-stud`;
- lab `Rw=50`, field `R'w=42`;
- dynamic family: `stud_wall_system`;
- strategy: `stud_surrogate_blend+framed_wall_calibration`;
- confidence: `low`;
- blocker: no verified exact/lab-fallback match, direct timber exact
  rows are single-board only, resilient rows require explicit
  side-count/acoustic-board topology, and the direct double-board row is
  only a secondary benchmark.

CLT wall remains formula-owned:

- generated id: `wall-clt-local`;
- lab `Rw=42`, field `R'w=41`;
- dynamic family: `laminated_single_leaf`;
- strategy: `laminated_leaf_sharp_delegate`;
- confidence: `medium`;
- blocker: no verified exact/lab-fallback match, no wall-specific CLT
  exact row, Dataholz CLT rows are floor-system source truth, and the
  current laminated lane is a Sharp-delegate formula.

## Selected Next Slice

Active slice is now `floor_fallback_low_confidence_cleanup_v1`.

Planning surface:
`docs/calculator/SLICE_FLOOR_FALLBACK_LOW_CONFIDENCE_CLEANUP_PLAN.md`.

First action:
create the no-runtime Gate A source/formula audit for
`floor.steel_fallback_low_confidence.field` / generated
`floor-steel-fallback`. The audit must pin current values, exact/bound
near misses, low-confidence origin posture, web card honesty, and
unsupported `L'nT,50` behavior before any runtime change.

## Validation

Pre-closeout baseline:

- `pnpm calculator:gate:current`: engine 93 files / 424 tests, web 36
  files / 170 passed + 18 skipped, build 5/5, whitespace guard clean.

Gate C targeted validation:

- `pnpm --filter @dynecho/engine exec vitest run src/post-wall-timber-stud-clt-gate-c-next-slice-selection-contract.test.ts --maxWorkers=1`
  - 1 file / 4 tests green.

Post-closeout focused validation:

- `pnpm calculator:gate:current`
  - engine 94 files / 428 tests;
  - web 36 files / 170 passed + 18 skipped;
  - build 5/5.

Broad closeout validation:

- `pnpm check`
  - engine 227 files / 1248 tests;
  - web 150 files / 864 passed + 18 skipped;
  - build 5/5.

Known non-fatal `sharp/@img` optional-package warnings remain.

## Boundaries

- Do not reopen timber stud or CLT wall formula values without new
  source evidence.
- Do not borrow Dataholz floor CLT source rows as wall CLT truth.
- Do not promote the steel fallback floor lane from low confidence
  without exact source, benchmark, or bounded family evidence.
- Do not reopen `GDMTXA04A`, `C11c`, raw bare open-box/open-web impact,
  wall-selector behavior, reinforced-concrete reopening, or heavy-core
  concrete from nearby green tests.
- `project_access_policy_route_integration_v1` remains deferred, not
  cancelled.
