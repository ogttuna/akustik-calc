# DynEcho Agent Notes

Start here before changing calculator behavior.

## Authority Order

1. `docs/calculator/NEXT_IMPLEMENTATION_PLAN.md`
2. `docs/calculator/CHECKPOINT_2026-04-27_WALL_CLT_GATE_B_HANDOFF.md`
3. `docs/calculator/CURRENT_STATE.md`
4. `docs/calculator/SLICE_WALL_TIMBER_STUD_CLT_ACCURACY_PASS_PLAN.md`
5. `docs/calculator/PERSONAL_USE_READINESS_ROADMAP.md`
6. `docs/calculator/CHECKPOINT_2026-04-27_WALL_TIMBER_STUD_GATE_B_HANDOFF.md`
7. `docs/calculator/CHECKPOINT_2026-04-27_WALL_TIMBER_STUD_CLT_GATE_A_HANDOFF.md`
8. `docs/calculator/CHECKPOINT_2026-04-27_WALL_HEAVY_CORE_CONCRETE_GATE_B_CLOSEOUT_HANDOFF.md`
9. `docs/calculator/CHECKPOINT_2026-04-27_WALL_HEAVY_CORE_CONCRETE_GATE_B_AUDIT_HANDOFF.md`
10. `docs/calculator/CHECKPOINT_2026-04-27_REALISTIC_LAYER_COMBINATION_COVERAGE_CARTOGRAPHY_GATE_A_HANDOFF.md`
11. `docs/calculator/SLICE_REALISTIC_LAYER_COMBINATION_COVERAGE_CARTOGRAPHY_PLAN.md`
12. `docs/calculator/SLICE_WALL_HEAVY_CORE_CONCRETE_TIGHTENING_PLAN.md`
13. `docs/calculator/CHECKPOINT_2026-04-26_DYNAMIC_AIRBORNE_SPLIT_V2_GATE_C_CLOSEOUT_HANDOFF.md`
14. `docs/calculator/DYNAMIC_AIRBORNE_CARTOGRAPHY.md`
15. `docs/calculator/CALCULATION_MODEL_AND_VALIDATION.md`

Use the long-form plan files only for backlog context after reading the current
plan.

## Current Workflow

- current selected slice:
  `wall_timber_stud_clt_accuracy_pass_v1`
- current first decision inside the slice:
  Timber-stud Gate B and CLT wall Gate B landed no-runtime. The CLT
  contract in
  `packages/engine/src/wall-clt-gate-b-source-contract.test.ts` keeps
  generated `wall-clt-local` at lab `Rw=42`, field `R'w=41`,
  medium-confidence `laminated_single_leaf`, strategy
  `laminated_leaf_sharp_delegate`, and blocks exact/source promotion
  because the live wall stack has no verified exact or lab-fallback
  match, the current catalog has no wall-specific CLT exact row,
  Dataholz CLT rows are floor-system source truth rather than wall exact
  truth, and the current laminated lane is a Sharp-delegate formula. The
  next bounded implementation step is Gate C closeout for
  `wall_timber_stud_clt_accuracy_pass_v1`: update plan/current state,
  run broad validation if closing the slice, then select the roadmap's
  `floor_fallback_low_confidence_cleanup` slice.
- personal-use readiness chain:
  `docs/calculator/PERSONAL_USE_READINESS_ROADMAP.md` is active
  calculator guidance. Finish, in order: timber stud + CLT wall
  accuracy, floor fallback / low-confidence cleanup, and UI/input/output
  honesty before resuming deferred productization. Heavy-core/concrete
  is closed no-runtime and remains screening until new source evidence
  appears.
- do not reopen `GDMTXA04A`, `C11c`, raw open-box/open-web, heavy-concrete
  parity or formula scope, reinforced-concrete reopening, wall-selector
  behavior, timber-stud widening, or wall exact-row follow-ups from nearby
  green tests alone
- if a slice closes, update the current plan, current state, and the relevant
  checkpoint/handoff note together
- keep planning-contract tests in sync with the selected next slice
- `project_access_policy_route_integration_v1` is deferred, not
  cancelled; do not resume productization until the selected calculator
  slice closes or the priority explicitly changes

## Validation

- run `pnpm calculator:gate:current` before and after touching the active
  selected slice
- use `pnpm check` only when you need the broad full-repo gate
- web broad tests run through `tools/dev/run-web-vitest.ts`; it keeps
  all 150 web test files in scope while isolating long route scans so
  Vitest worker RPC timeouts do not hide green test results
- keep `git diff --check` clean

## Boundaries

- treat `/home/ogttuna/Dev/Machinity/Acoustic2` as read-only upstream
- do not edit upstream from this repo
- keep workbench persistence assumptions honest:
  editing is still local-first, with explicit server sync/load available
