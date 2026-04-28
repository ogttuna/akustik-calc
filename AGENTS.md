# DynEcho Agent Notes

Start here before changing calculator behavior.

## Authority Order

1. `docs/calculator/NEXT_IMPLEMENTATION_PLAN.md`
2. `docs/calculator/CHECKPOINT_2026-04-28_WALL_DOUBLE_LEAF_SOURCE_EVIDENCE_GATE_A_HANDOFF.md`
3. `docs/calculator/SLICE_WALL_DOUBLE_LEAF_SOURCE_EVIDENCE_ACQUISITION_PLAN.md`
4. `docs/calculator/CHECKPOINT_2026-04-28_WALL_DOUBLE_LEAF_SHARP_DAVY_GATE_C_CLOSEOUT_HANDOFF.md`
5. `docs/calculator/CHECKPOINT_2026-04-28_WALL_DOUBLE_LEAF_SHARP_DAVY_GATE_B_HANDOFF.md`
6. `docs/calculator/CHECKPOINT_2026-04-28_WALL_DOUBLE_LEAF_SHARP_DAVY_GATE_B_READY_REVALIDATION.md`
7. `docs/calculator/CHECKPOINT_2026-04-27_WALL_DOUBLE_LEAF_SHARP_DAVY_GATE_B_READY_HANDOFF.md`
8. `docs/calculator/CHECKPOINT_2026-04-27_WALL_DOUBLE_LEAF_SHARP_DAVY_GATE_A_HANDOFF.md`
9. `docs/calculator/CURRENT_STATE.md`
10. `docs/calculator/SLICE_WALL_DOUBLE_LEAF_SHARP_DAVY_SCOPING_PLAN.md`
11. `docs/calculator/CHECKPOINT_2026-04-27_WALL_SINGLE_LEAF_MASS_LAW_GATE_C_CLOSEOUT_HANDOFF.md`
12. `docs/calculator/SLICE_WALL_SINGLE_LEAF_MASS_LAW_CALIBRATION_PLAN.md`
13. `docs/calculator/CHECKPOINT_2026-04-27_WALL_SINGLE_LEAF_MASS_LAW_GATE_B_HANDOFF.md`
14. `docs/calculator/CHECKPOINT_2026-04-27_WALL_SINGLE_LEAF_MASS_LAW_GATE_A_HANDOFF.md`
15. `docs/calculator/CHECKPOINT_2026-04-27_WALL_COVERAGE_EXPANSION_PLANNING_V2_GATE_A_HANDOFF.md`
16. `docs/calculator/SLICE_WALL_COVERAGE_EXPANSION_PLANNING_V2_PLAN.md`
17. `docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_PLAN.md`
18. `docs/calculator/SOURCE_GAP_LEDGER.md`
19. `docs/calculator/CALCULATION_MODEL_AND_VALIDATION.md`
20. `docs/calculator/DYNAMIC_AIRBORNE_CARTOGRAPHY.md`
21. `docs/calculator/SLICE_PROPOSAL_REPORT_POLISH_PLAN.md`
22. `docs/calculator/POST_CALCULATOR_PRODUCTIZATION_ROADMAP.md`
23. `docs/calculator/PERSONAL_USE_READINESS_ROADMAP.md`

Use the long-form plan files only for backlog context after reading the current
plan.

## Current Workflow

- current selected slice:
  `wall_double_leaf_source_evidence_acquisition_v1`
- current first decision inside the slice:
  Gate A of `wall_double_leaf_source_evidence_acquisition_v1` landed
  no-runtime in
  `packages/engine/src/wall-double-leaf-source-evidence-acquisition-gate-a-contract.test.ts`.
  It classified generic empty and no-stud porous double-leaf rows as
  rejected for runtime movement, found bounded Knauf W111 / W115 framed
  wall evidence for single-stud and double-stud reconciliation, and kept
  Davy / stud-type references as corridor context only. Next start Gate B
  by reconciling those bounded framed rows against current lab/field
  outputs or closing no-runtime if they already fit or do not map cleanly.
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
- `wall_double_leaf_source_evidence_acquisition_v1` remains selected.
  Gate B may only reconcile the bounded framed-wall rows named by Gate A;
  no runtime values, confidence, support, evidence text, or route-card
  copy may move without paired engine value and web route-card tests.

## Validation

- run `pnpm calculator:gate:current` before and after touching the active
  selected slice
- use `pnpm check` only when you need the broad full-repo gate
- latest focused validation: engine 108 files / 496 tests, web
  43 files / 211 passed + 18 skipped, build 5/5 with the known
  non-fatal `sharp/@img` warnings, whitespace guard clean
- latest broad validation: `pnpm check` green on 2026-04-28; engine/web
  test tasks were unchanged and replayed by Turbo cache from the prior
  238 engine files / 1300 tests and 155 web files / 885 passed +
  18 skipped green run
- web broad tests run through `tools/dev/run-web-vitest.ts`; it keeps
  all 155 web test files in scope while isolating long route scans so
  Vitest worker RPC timeouts do not hide green test results
- keep `git diff --check` clean

## Boundaries

- treat `/home/ogttuna/Dev/Machinity/Acoustic2` as read-only upstream
- do not edit upstream from this repo
- keep workbench persistence assumptions honest:
  editing is still local-first, with explicit server sync/load available
