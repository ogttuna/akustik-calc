# DynEcho Agent Notes

Start here before changing calculator behavior.

## Authority Order

1. `docs/calculator/NEXT_IMPLEMENTATION_PLAN.md`
2. `docs/calculator/CHECKPOINT_2026-04-27_UI_INPUT_OUTPUT_HONESTY_GATE_B_HANDOFF.md`
3. `docs/calculator/CHECKPOINT_2026-04-27_UI_INPUT_OUTPUT_HONESTY_GATE_A_HANDOFF.md`
4. `docs/calculator/CURRENT_STATE.md`
5. `docs/calculator/SLICE_UI_INPUT_OUTPUT_HONESTY_PLAN.md`
6. `docs/calculator/PERSONAL_USE_READINESS_ROADMAP.md`
7. `docs/calculator/CHECKPOINT_2026-04-27_FLOOR_FALLBACK_LOW_CONFIDENCE_GATE_C_CLOSEOUT_HANDOFF.md`
8. `docs/calculator/CHECKPOINT_2026-04-27_FLOOR_FALLBACK_LOW_CONFIDENCE_GATE_B_HANDOFF.md`
9. `docs/calculator/SLICE_FLOOR_FALLBACK_LOW_CONFIDENCE_CLEANUP_PLAN.md`
10. `docs/calculator/CHECKPOINT_2026-04-27_FLOOR_FALLBACK_LOW_CONFIDENCE_GATE_A_HANDOFF.md`
11. `docs/calculator/CHECKPOINT_2026-04-27_WALL_TIMBER_STUD_CLT_GATE_C_CLOSEOUT_HANDOFF.md`
12. `docs/calculator/CHECKPOINT_2026-04-27_WALL_CLT_GATE_B_HANDOFF.md`
13. `docs/calculator/SLICE_WALL_TIMBER_STUD_CLT_ACCURACY_PASS_PLAN.md`
14. `docs/calculator/CHECKPOINT_2026-04-27_WALL_TIMBER_STUD_GATE_B_HANDOFF.md`
15. `docs/calculator/CHECKPOINT_2026-04-27_WALL_TIMBER_STUD_CLT_GATE_A_HANDOFF.md`
16. `docs/calculator/CHECKPOINT_2026-04-27_WALL_HEAVY_CORE_CONCRETE_GATE_B_CLOSEOUT_HANDOFF.md`
17. `docs/calculator/CHECKPOINT_2026-04-27_WALL_HEAVY_CORE_CONCRETE_GATE_B_AUDIT_HANDOFF.md`
18. `docs/calculator/CHECKPOINT_2026-04-27_REALISTIC_LAYER_COMBINATION_COVERAGE_CARTOGRAPHY_GATE_A_HANDOFF.md`
19. `docs/calculator/SLICE_REALISTIC_LAYER_COMBINATION_COVERAGE_CARTOGRAPHY_PLAN.md`
20. `docs/calculator/SLICE_WALL_HEAVY_CORE_CONCRETE_TIGHTENING_PLAN.md`
21. `docs/calculator/CHECKPOINT_2026-04-26_DYNAMIC_AIRBORNE_SPLIT_V2_GATE_C_CLOSEOUT_HANDOFF.md`
22. `docs/calculator/DYNAMIC_AIRBORNE_CARTOGRAPHY.md`
23. `docs/calculator/CALCULATION_MODEL_AND_VALIDATION.md`

Use the long-form plan files only for backlog context after reading the current
plan.

## Current Workflow

- current selected slice:
  `ui_input_output_honesty_v1`
- current first decision inside the slice:
  UI/input/output honesty Gate B implemented API next-field validation
  guidance and simple output-card unsupported-vs-missing-input
  precedence. Focused current gate and broad `pnpm check` are green for
  Gate B. The next bounded step is Gate C closeout and readiness-roadmap
  decision.
  Do not change acoustic formulas, runtime values, or confidence scores
  in this slice.
- personal-use readiness chain:
  `docs/calculator/PERSONAL_USE_READINESS_ROADMAP.md` is active
  calculator guidance. Finish UI/input/output honesty before resuming
  deferred productization. Heavy-core/concrete is closed no-runtime and
  remains screening; timber stud + CLT wall are closed no-runtime and
  remain formula-owned until new source evidence appears; floor fallback
  is closed no-runtime and remains low-confidence until new source
  evidence or a bounded family rule appears.
- do not reopen `GDMTXA04A`, `C11c`, raw open-box/open-web, heavy-concrete
  parity or formula scope, reinforced-concrete reopening, wall-selector
  behavior, timber-stud widening, or wall exact-row follow-ups from nearby
  green tests alone
- if a slice closes, update the current plan, current state, and the relevant
  checkpoint/handoff note together
- keep planning-contract tests in sync with the selected next slice
- `project_access_policy_route_integration_v1` is deferred, not
  cancelled; do not resume productization until
  `ui_input_output_honesty_v1` closes or the priority explicitly
  changes

## Validation

- run `pnpm calculator:gate:current` before and after touching the active
  selected slice
- use `pnpm check` only when you need the broad full-repo gate
- latest focused Gate B validation: engine 97 files / 440 tests, web
  39 files / 188 passed + 18 skipped, build 5/5 with the known
  non-fatal `sharp/@img` warnings, whitespace guard clean
- latest broad Gate B validation: `pnpm check` green with engine
  230 files / 1260 tests and web 152 files / 871 passed + 18 skipped
- web broad tests run through `tools/dev/run-web-vitest.ts`; it keeps
  all 152 web test files in scope while isolating long route scans so
  Vitest worker RPC timeouts do not hide green test results
- keep `git diff --check` clean

## Boundaries

- treat `/home/ogttuna/Dev/Machinity/Acoustic2` as read-only upstream
- do not edit upstream from this repo
- keep workbench persistence assumptions honest:
  editing is still local-first, with explicit server sync/load available
