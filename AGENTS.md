# DynEcho Agent Notes

Start here before changing calculator behavior.

## Authority Order

1. `docs/calculator/NEXT_IMPLEMENTATION_PLAN.md`
2. `docs/calculator/CHECKPOINT_2026-04-27_WALL_DOUBLE_LEAF_SHARP_DAVY_GATE_A_HANDOFF.md`
3. `docs/calculator/CURRENT_STATE.md`
4. `docs/calculator/SLICE_WALL_DOUBLE_LEAF_SHARP_DAVY_SCOPING_PLAN.md`
5. `docs/calculator/CHECKPOINT_2026-04-27_WALL_SINGLE_LEAF_MASS_LAW_GATE_C_CLOSEOUT_HANDOFF.md`
6. `docs/calculator/SLICE_WALL_SINGLE_LEAF_MASS_LAW_CALIBRATION_PLAN.md`
7. `docs/calculator/CHECKPOINT_2026-04-27_WALL_SINGLE_LEAF_MASS_LAW_GATE_B_HANDOFF.md`
8. `docs/calculator/CHECKPOINT_2026-04-27_WALL_SINGLE_LEAF_MASS_LAW_GATE_A_HANDOFF.md`
9. `docs/calculator/CHECKPOINT_2026-04-27_WALL_COVERAGE_EXPANSION_PLANNING_V2_GATE_A_HANDOFF.md`
10. `docs/calculator/SLICE_WALL_COVERAGE_EXPANSION_PLANNING_V2_PLAN.md`
11. `docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_PLAN.md`
12. `docs/calculator/SOURCE_GAP_LEDGER.md`
13. `docs/calculator/CALCULATION_MODEL_AND_VALIDATION.md`
14. `docs/calculator/DYNAMIC_AIRBORNE_CARTOGRAPHY.md`
15. `docs/calculator/SLICE_PROPOSAL_REPORT_POLISH_PLAN.md`
16. `docs/calculator/POST_CALCULATOR_PRODUCTIZATION_ROADMAP.md`
17. `docs/calculator/PERSONAL_USE_READINESS_ROADMAP.md`

Use the long-form plan files only for backlog context after reading the current
plan.

## Current Workflow

- current selected slice:
  `wall_double_leaf_sharp_davy_scoping_v1`
- current first decision inside the slice:
  Gate A of `wall_double_leaf_sharp_davy_scoping_v1` landed no-runtime.
  It pins current values for empty double-leaf (`R'w=46`), porous
  double-leaf (`R'w=41`), explicit single-stud (`R'w=37`), and explicit
  double-stud (`R'w=52`) routes, plus lined-massive and triple-leaf
  negative boundaries. Start Gate B with a bounded candidate matrix or
  no-runtime closeout decision. Gate B must not move values unless it
  names a source row, benchmark envelope, formula tolerance owner, or
  bounded family rule.
- personal-use readiness chain:
  closed. Heavy-core/concrete remains screening; timber stud + CLT wall
  remain formula/source-gated until new source evidence appears; floor
  fallback remains low-confidence until new source evidence or a bounded
  family rule appears. UI/input/output honesty is closed and validated.
- do not reopen `GDMTXA04A`, `C11c`, raw open-box/open-web, heavy-concrete
  parity or formula scope, reinforced-concrete reopening, wall-selector
  behavior, timber-stud widening, or wall exact-row follow-ups from nearby
  green tests alone
- if a slice closes, update the current plan, current state, and the relevant
  checkpoint/handoff note together
- keep planning-contract tests in sync with the selected next slice
- `wall_double_leaf_sharp_davy_scoping_v1` remains selected. Gate B
  must use the landed Gate A inventory and decide whether a bounded
  matrix can proceed or the slice should close no-runtime.

## Validation

- run `pnpm calculator:gate:current` before and after touching the active
  selected slice
- use `pnpm check` only when you need the broad full-repo gate
- latest focused validation: engine 105 files / 480 tests, web
  43 files / 211 passed + 18 skipped, build 5/5 with the known
  non-fatal `sharp/@img` warnings, whitespace guard clean
- latest broad validation: `pnpm check` green with engine
  234 files / 1280 tests and web 155 files / 885 passed + 18 skipped
- web broad tests run through `tools/dev/run-web-vitest.ts`; it keeps
  all 155 web test files in scope while isolating long route scans so
  Vitest worker RPC timeouts do not hide green test results
- keep `git diff --check` clean

## Boundaries

- treat `/home/ogttuna/Dev/Machinity/Acoustic2` as read-only upstream
- do not edit upstream from this repo
- keep workbench persistence assumptions honest:
  editing is still local-first, with explicit server sync/load available
