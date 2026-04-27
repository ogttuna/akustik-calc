# DynEcho Agent Notes

Start here before changing calculator behavior.

## Authority Order

1. `docs/calculator/NEXT_IMPLEMENTATION_PLAN.md`
2. `docs/calculator/CHECKPOINT_2026-04-27_UI_INPUT_OUTPUT_HONESTY_GATE_C_CLOSEOUT_HANDOFF.md`
3. `docs/calculator/SLICE_PROJECT_ACCESS_POLICY_ROUTE_INTEGRATION_PLAN.md`
4. `docs/calculator/POST_CALCULATOR_PRODUCTIZATION_ROADMAP.md`
5. `docs/calculator/CURRENT_STATE.md`
6. `docs/calculator/PERSONAL_USE_READINESS_ROADMAP.md`
7. `docs/calculator/CHECKPOINT_2026-04-27_UI_INPUT_OUTPUT_HONESTY_GATE_B_HANDOFF.md`
8. `docs/calculator/SLICE_UI_INPUT_OUTPUT_HONESTY_PLAN.md`
9. `docs/calculator/CHECKPOINT_2026-04-27_UI_INPUT_OUTPUT_HONESTY_GATE_A_HANDOFF.md`
10. `docs/calculator/CHECKPOINT_2026-04-27_FLOOR_FALLBACK_LOW_CONFIDENCE_GATE_C_CLOSEOUT_HANDOFF.md`
11. `docs/calculator/CHECKPOINT_2026-04-27_FLOOR_FALLBACK_LOW_CONFIDENCE_GATE_B_HANDOFF.md`
12. `docs/calculator/SLICE_FLOOR_FALLBACK_LOW_CONFIDENCE_CLEANUP_PLAN.md`
13. `docs/calculator/CHECKPOINT_2026-04-27_FLOOR_FALLBACK_LOW_CONFIDENCE_GATE_A_HANDOFF.md`
14. `docs/calculator/CHECKPOINT_2026-04-27_WALL_TIMBER_STUD_CLT_GATE_C_CLOSEOUT_HANDOFF.md`
15. `docs/calculator/CHECKPOINT_2026-04-27_WALL_CLT_GATE_B_HANDOFF.md`
16. `docs/calculator/SLICE_WALL_TIMBER_STUD_CLT_ACCURACY_PASS_PLAN.md`
17. `docs/calculator/CHECKPOINT_2026-04-27_WALL_TIMBER_STUD_GATE_B_HANDOFF.md`
18. `docs/calculator/CHECKPOINT_2026-04-27_WALL_TIMBER_STUD_CLT_GATE_A_HANDOFF.md`
19. `docs/calculator/CHECKPOINT_2026-04-27_WALL_HEAVY_CORE_CONCRETE_GATE_B_CLOSEOUT_HANDOFF.md`
20. `docs/calculator/CHECKPOINT_2026-04-27_WALL_HEAVY_CORE_CONCRETE_GATE_B_AUDIT_HANDOFF.md`
21. `docs/calculator/CHECKPOINT_2026-04-27_REALISTIC_LAYER_COMBINATION_COVERAGE_CARTOGRAPHY_GATE_A_HANDOFF.md`
22. `docs/calculator/SLICE_REALISTIC_LAYER_COMBINATION_COVERAGE_CARTOGRAPHY_PLAN.md`
23. `docs/calculator/SLICE_WALL_HEAVY_CORE_CONCRETE_TIGHTENING_PLAN.md`
24. `docs/calculator/CHECKPOINT_2026-04-26_DYNAMIC_AIRBORNE_SPLIT_V2_GATE_C_CLOSEOUT_HANDOFF.md`
25. `docs/calculator/DYNAMIC_AIRBORNE_CARTOGRAPHY.md`
26. `docs/calculator/CALCULATION_MODEL_AND_VALIDATION.md`

Use the long-form plan files only for backlog context after reading the current
plan.

## Current Workflow

- current selected slice:
  `project_access_policy_route_integration_v1`
- current first decision inside the slice:
  UI/input/output honesty Gate C closed the calculator personal-use
  readiness chain. The calculator is ready for private/internal use with
  visible evidence-tier caveats, not as a certified design tool or full
  productized service. Next start
  `project_access_policy_route_integration_v1`: wire the existing pure
  access policy through owner-scoped project/proposal routes without
  enabling team roles or changing route behavior unnecessarily.
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
- `project_access_policy_route_integration_v1` is now selected. It must
  not change calculator formulas, runtime values, source posture, output
  support, or confidence scores.

## Validation

- run `pnpm calculator:gate:current` before and after touching the active
  selected slice
- use `pnpm check` only when you need the broad full-repo gate
- latest focused Gate C validation: engine 98 files / 445 tests, web
  39 files / 188 passed + 18 skipped, build 5/5 with the known
  non-fatal `sharp/@img` warnings, whitespace guard clean
- latest broad Gate C validation: `pnpm check` green with engine
  231 files / 1265 tests and web 152 files / 871 passed + 18 skipped
- web broad tests run through `tools/dev/run-web-vitest.ts`; it keeps
  all 152 web test files in scope while isolating long route scans so
  Vitest worker RPC timeouts do not hide green test results
- keep `git diff --check` clean

## Boundaries

- treat `/home/ogttuna/Dev/Machinity/Acoustic2` as read-only upstream
- do not edit upstream from this repo
- keep workbench persistence assumptions honest:
  editing is still local-first, with explicit server sync/load available
