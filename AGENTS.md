# DynEcho Agent Notes

Start here before changing calculator behavior.

## Authority Order

1. `docs/calculator/NEXT_IMPLEMENTATION_PLAN.md`
2. `docs/calculator/CHECKPOINT_2026-04-27_WALL_HEAVY_CORE_CONCRETE_GATE_B_AUDIT_HANDOFF.md`
3. `docs/calculator/CHECKPOINT_2026-04-27_REALISTIC_LAYER_COMBINATION_COVERAGE_CARTOGRAPHY_GATE_A_HANDOFF.md`
4. `docs/calculator/CURRENT_STATE.md`
5. `docs/calculator/SLICE_REALISTIC_LAYER_COMBINATION_COVERAGE_CARTOGRAPHY_PLAN.md`
6. `docs/calculator/SLICE_WALL_HEAVY_CORE_CONCRETE_TIGHTENING_PLAN.md`
7. `docs/calculator/PERSONAL_USE_READINESS_ROADMAP.md`
8. `docs/calculator/CHECKPOINT_2026-04-26_DYNAMIC_AIRBORNE_SPLIT_V2_GATE_C_CLOSEOUT_HANDOFF.md`
9. `docs/calculator/DYNAMIC_AIRBORNE_CARTOGRAPHY.md`
10. `docs/calculator/CALCULATION_MODEL_AND_VALIDATION.md`

Use the long-form plan files only for backlog context after reading the current
plan.

## Current Workflow

- current selected slice:
  `realistic_layer_combination_coverage_cartography_v1`
- current first decision inside the slice:
  Gate A has landed no-runtime in
  `packages/engine/src/realistic-layer-combination-coverage-cartography.test.ts`.
  The executable cartography covers 29 representative floor/wall cells
  across exact, benchmark, formula, family, screening, bound, and
  fail-closed lanes, and it pins output support, origin, confidence,
  invariants, existing web-card posture, and next-action candidate type.
  The highest-ROI runtime candidate is
  `wall.concrete_heavy_core_screening.field`. Gate B source/formula and
  implementation-path audit for that wall heavy-core lane has landed
  no-runtime in
  `packages/engine/src/wall-heavy-core-concrete-gate-b-audit-contract.test.ts`
  using
  `docs/calculator/SLICE_WALL_HEAVY_CORE_CONCRETE_TIGHTENING_PLAN.md`.
  The audit found no
  exact catalog row, no direct external benchmark match in the current
  repo audit, and no topology-specific tolerance for
  `gypsum_board_12_5_rockwool_50_air_gap_50_concrete_100`; evidence
  remains `screening`. Next choose either a source/bounded-family import
  path or an honest no-runtime Gate B closeout before moving to timber
  stud + CLT.
- personal-use readiness chain:
  `docs/calculator/PERSONAL_USE_READINESS_ROADMAP.md` is active
  calculator guidance. Finish, in order: heavy-core/concrete wall,
  timber stud + CLT wall accuracy, floor fallback / low-confidence
  cleanup, and UI/input/output honesty before resuming deferred
  productization.
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
