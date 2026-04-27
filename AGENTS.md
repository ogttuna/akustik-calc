# DynEcho Agent Notes

Start here before changing calculator behavior.

## Authority Order

1. `docs/calculator/NEXT_IMPLEMENTATION_PLAN.md`
2. `docs/calculator/CHECKPOINT_2026-04-27_PROPOSAL_REPORT_POLISH_CLOSEOUT_HANDOFF.md`
3. `docs/calculator/CURRENT_STATE.md`
4. `docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_PLAN.md`
5. `docs/calculator/SOURCE_GAP_LEDGER.md`
6. `docs/calculator/CALCULATION_MODEL_AND_VALIDATION.md`
7. `docs/calculator/DYNAMIC_AIRBORNE_CARTOGRAPHY.md`
8. `docs/calculator/SLICE_PROPOSAL_REPORT_POLISH_PLAN.md`
9. `docs/calculator/POST_CALCULATOR_PRODUCTIZATION_ROADMAP.md`
10. `docs/calculator/PERSONAL_USE_READINESS_ROADMAP.md`

Use the long-form plan files only for backlog context after reading the current
plan.

## Current Workflow

- current selected slice:
  `calculator_source_gap_revalidation_v1`
- current first decision inside the slice:
  `proposal_report_polish_v1` is closed no-runtime for acoustic
  calculations. It landed the simple PDF/DOCX output coverage register,
  generated-document honesty tests for real floor/wall workbench output
  models, and a 53-row long-label / many-layer report regression with
  table wrapping and simple short-form layer-cap disclosure. The next
  selected work is `calculator_source_gap_revalidation_v1`. Gate A is a
  no-runtime inventory/rerank of remaining source gaps; do not change
  acoustic values, output support, confidence, evidence tiers, or
  formulas until a source-backed or formula-owned candidate is selected.
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
- `calculator_source_gap_revalidation_v1` is now selected. Gate A must
  revalidate/rerank remaining source gaps without calculator runtime
  movement, then select the next source or runtime slice explicitly.

## Validation

- run `pnpm calculator:gate:current` before and after touching the active
  selected slice
- use `pnpm check` only when you need the broad full-repo gate
- latest focused validation: engine 99 files / 450 tests, web
  43 files / 211 passed + 18 skipped, build 5/5 with the known
  non-fatal `sharp/@img` warnings, whitespace guard clean
- latest broad validation: `pnpm check` green with engine
  232 files / 1270 tests and web 155 files / 885 passed + 18 skipped
- web broad tests run through `tools/dev/run-web-vitest.ts`; it keeps
  all 155 web test files in scope while isolating long route scans so
  Vitest worker RPC timeouts do not hide green test results
- keep `git diff --check` clean

## Boundaries

- treat `/home/ogttuna/Dev/Machinity/Acoustic2` as read-only upstream
- do not edit upstream from this repo
- keep workbench persistence assumptions honest:
  editing is still local-first, with explicit server sync/load available
