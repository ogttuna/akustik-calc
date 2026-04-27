# DynEcho Agent Notes

Start here before changing calculator behavior.

## Authority Order

1. `docs/calculator/NEXT_IMPLEMENTATION_PLAN.md`
2. `docs/calculator/CHECKPOINT_2026-04-27_WALL_COVERAGE_EXPANSION_PLANNING_V2_GATE_A_HANDOFF.md`
3. `docs/calculator/CURRENT_STATE.md`
4. `docs/calculator/SLICE_WALL_SINGLE_LEAF_MASS_LAW_CALIBRATION_PLAN.md`
5. `docs/calculator/SLICE_WALL_COVERAGE_EXPANSION_PLANNING_V2_PLAN.md`
6. `docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_PLAN.md`
7. `docs/calculator/SOURCE_GAP_LEDGER.md`
8. `docs/calculator/CALCULATION_MODEL_AND_VALIDATION.md`
9. `docs/calculator/DYNAMIC_AIRBORNE_CARTOGRAPHY.md`
10. `docs/calculator/SLICE_PROPOSAL_REPORT_POLISH_PLAN.md`
11. `docs/calculator/POST_CALCULATOR_PRODUCTIZATION_ROADMAP.md`
12. `docs/calculator/PERSONAL_USE_READINESS_ROADMAP.md`

Use the long-form plan files only for backlog context after reading the current
plan.

## Current Workflow

- current selected slice:
  `wall_single_leaf_mass_law_calibration_v1`
- current first decision inside the slice:
  `wall_coverage_expansion_planning_v2` Gate A closed no-runtime. It
  inventoried current wall exact/formula/screening ownership and
  guardrails, kept heavy-core/concrete screening, timber stud
  low-confidence, and CLT wall formula-owned/source-blocked, and
  selected `wall_single_leaf_mass_law_calibration_v1`. Start that slice
  with a no-runtime source/formula contract for unmatched massive
  single-leaf walls before any runtime value movement.
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
- `wall_single_leaf_mass_law_calibration_v1` is now selected. Gate A
  must define candidate signatures, formula/source basis, positive
  cases, negative cases, exact/lab-fallback precedence, and UI/card
  coverage before any calculator runtime movement.

## Validation

- run `pnpm calculator:gate:current` before and after touching the active
  selected slice
- use `pnpm check` only when you need the broad full-repo gate
- latest focused validation: engine 101 files / 460 tests, web
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
