# Calculator Docs

Use this folder for the current acoustic-calculator and workbench behavior.

This is the primary living doc set for dynamic calculator work. Read these files before using anything under `docs/archive`.

If the question is “what is still open and what executes next?”, start with
[NEXT_IMPLEMENTATION_PLAN.md](./NEXT_IMPLEMENTATION_PLAN.md), then
[CURRENT_STATE.md](./CURRENT_STATE.md), then the latest committed checkpoint.

## Current Execution Snapshot

- active next slice:
  `mixed_floor_wall_output_card_snapshot_requested_output_surface_runner_loop_extraction_v1`
- current guardrail:
  requested-output output-card coverage is green, but runtime widening stays
  blocked until the shared outer runner-loop harness lands cleanly
- last full green validation:
  `2026-04-16`
  - engine: `140` files / `887` tests
  - web: `113` files / `655` tests
  - `pnpm typecheck`, `pnpm lint`, `pnpm build`, and `pnpm calculator:gate:current`
    all green

## Current Hot Files

- [mixed-study-mode-output-card-snapshot-grid.test.ts](../../apps/web/features/workbench/mixed-study-mode-output-card-snapshot-grid.test.ts):
  visible output-card assertion surface, intentionally kept slim
- [mixed-study-mode-output-card-snapshot-requested-output-runners.ts](../../apps/web/features/workbench/mixed-study-mode-output-card-snapshot-requested-output-runners.ts):
  current requested-output harness hotspot and next refactor target
- [mixed-study-mode-output-card-snapshot-requested-output-variant-drivers.ts](../../apps/web/features/workbench/mixed-study-mode-output-card-snapshot-requested-output-variant-drivers.ts):
  shared replay/edit-history/partial-restore branch setup layer
- [mixed-floor-wall-generated-matrix.test.ts](../../packages/engine/src/mixed-floor-wall-generated-matrix.test.ts):
  engine companion parity surface for the mixed route matrix
- [run-calculator-current-gate.ts](../../tools/dev/run-calculator-current-gate.ts):
  single-command focused checkpoint gate

## Read Order

1. [NEXT_IMPLEMENTATION_PLAN.md](./NEXT_IMPLEMENTATION_PLAN.md): concise current execution plan and validated next steps
2. [CURRENT_STATE.md](./CURRENT_STATE.md): short snapshot of the current calculator/workbench posture
3. [SYSTEM_MAP.md](./SYSTEM_MAP.md): end-to-end product flow, runtime boundaries, persistence posture, and test surface map
4. [CHECKPOINT_2026-04-16_REQUESTED_OUTPUT_HARNESS_REFACTOR_HANDOFF.md](./CHECKPOINT_2026-04-16_REQUESTED_OUTPUT_HARNESS_REFACTOR_HANDOFF.md): latest committed checkpoint after the requested-output harness refactor chain
5. [CHECKPOINT_2026-04-14_FORMULA_PROVENANCE_DOSSIER_HANDOFF.md](./CHECKPOINT_2026-04-14_FORMULA_PROVENANCE_DOSSIER_HANDOFF.md): historical committed checkpoint after the formula provenance dossier guard
6. [CALCULATION_MODEL_AND_VALIDATION.md](./CALCULATION_MODEL_AND_VALIDATION.md): answer-origin map for formulas, source rows, predictors, field continuations, support gating, and test meaning
7. [CHECKPOINT_2026-04-14_UBIQ_HISTORY_REPLAY_HANDOFF.md](./CHECKPOINT_2026-04-14_UBIQ_HISTORY_REPLAY_HANDOFF.md): historical committed checkpoint after the UBIQ packaged open-web history replay guard
8. [CHECKPOINT_2026-04-13_END_OF_DAY_HANDOFF.md](./CHECKPOINT_2026-04-13_END_OF_DAY_HANDOFF.md): clean resume point after the accepted 2026-04-13 guard slices
9. [STABILIZATION_CHECKPOINT_2026-04-13.md](./STABILIZATION_CHECKPOINT_2026-04-13.md): historical package map for the accepted large dirty-worktree stabilization
10. [FULL_ENGINE_SUITE_TRIAGE_2026-04-12.md](./FULL_ENGINE_SUITE_TRIAGE_2026-04-12.md): current broad-suite failure classification and focused cleanup status
11. [CHECKPOINT_2026-04-08_UI_HANDOFF.md](./CHECKPOINT_2026-04-08_UI_HANDOFF.md): fast restart note for the latest UI handoff point
12. [DYNAMIC_CALCULATOR_REMAINING_WORK_PLAN.md](./DYNAMIC_CALCULATOR_REMAINING_WORK_PLAN.md): cross-floor/wall remaining work, recently closed regressions, completion status, and non-regressive fix order
13. [DYNAMIC_CALCULATOR_COVERAGE_ACCURACY_PLAN.md](./DYNAMIC_CALCULATOR_COVERAGE_ACCURACY_PLAN.md): current execution model for coverage growth, accuracy tightening, and test-first slice planning
14. [DYNAMIC_WALL_STABILITY_REMEDIATION.md](./DYNAMIC_WALL_STABILITY_REMEDIATION.md): wall-side dynamic stability diagnosis, safe fix order, and test contracts
15. [DYNAMIC_CALCULATOR_PLAN.md](./DYNAMIC_CALCULATOR_PLAN.md): active implementation order and hardening backlog
16. [SOURCE_GAP_LEDGER.md](./SOURCE_GAP_LEDGER.md): source-backed widening, tightening, and deferred-family boundaries
17. [../archive/analysis/README.md](../archive/analysis/README.md): dated investigations and reproduction notes

## Status Shortcut

If the question is “what is actually finished vs still open?”, use this order:

1. [NEXT_IMPLEMENTATION_PLAN.md](./NEXT_IMPLEMENTATION_PLAN.md): current execution plan, next action, and validation commands
2. [CURRENT_STATE.md](./CURRENT_STATE.md): broad verified snapshot
3. [SYSTEM_MAP.md](./SYSTEM_MAP.md): how the product actually flows through auth, store, API, engine, output cards, persistence, and tests
4. [CHECKPOINT_2026-04-16_REQUESTED_OUTPUT_HARNESS_REFACTOR_HANDOFF.md](./CHECKPOINT_2026-04-16_REQUESTED_OUTPUT_HARNESS_REFACTOR_HANDOFF.md): current committed checkpoint, validation gate, harness-hardening closeout, and explicit not-done list
5. [CHECKPOINT_2026-04-14_FORMULA_PROVENANCE_DOSSIER_HANDOFF.md](./CHECKPOINT_2026-04-14_FORMULA_PROVENANCE_DOSSIER_HANDOFF.md): historical formula-provenance checkpoint and earlier validation gate
6. [CALCULATION_MODEL_AND_VALIDATION.md](./CALCULATION_MODEL_AND_VALIDATION.md): how to decide whether a shown answer is source-backed, formula-backed, predictor-backed, bound-only, or unsupported
7. [CHECKPOINT_2026-04-14_UBIQ_HISTORY_REPLAY_HANDOFF.md](./CHECKPOINT_2026-04-14_UBIQ_HISTORY_REPLAY_HANDOFF.md): historical UBIQ checkpoint and accepted package map
8. [CHECKPOINT_2026-04-13_END_OF_DAY_HANDOFF.md](./CHECKPOINT_2026-04-13_END_OF_DAY_HANDOFF.md): latest clean handoff state and resume constraints
9. [STABILIZATION_CHECKPOINT_2026-04-13.md](./STABILIZATION_CHECKPOINT_2026-04-13.md): historical package map and validation gate for the accepted stabilization set
10. [FULL_ENGINE_SUITE_TRIAGE_2026-04-12.md](./FULL_ENGINE_SUITE_TRIAGE_2026-04-12.md): which broad-suite reds are stale, fixed, real, or intentionally fail-closed
11. [DYNAMIC_CALCULATOR_REMAINING_WORK_PLAN.md](./DYNAMIC_CALCULATOR_REMAINING_WORK_PLAN.md): explicit completion checklist across floor + wall
12. [DYNAMIC_CALCULATOR_COVERAGE_ACCURACY_PLAN.md](./DYNAMIC_CALCULATOR_COVERAGE_ACCURACY_PLAN.md): next-slice execution order, test-first rules, and workstream priorities
13. [DYNAMIC_WALL_STABILITY_REMEDIATION.md](./DYNAMIC_WALL_STABILITY_REMEDIATION.md): wall-only phase closure and partial-open items
14. [DYNAMIC_CALCULATOR_PLAN.md](./DYNAMIC_CALCULATOR_PLAN.md): floor-dominant roadmap phases

Reading rule:

- `complete` means defended by executable tests
- `partial` means a narrow defended slice exists, not that the whole problem class is closed
- `open` means do not infer completion from nearby green representative corridors

## Resume Shortcut

If the question is “where do I restart tomorrow without re-reading everything?”, use this order:

1. [CHECKPOINT_2026-04-16_REQUESTED_OUTPUT_HARNESS_REFACTOR_HANDOFF.md](./CHECKPOINT_2026-04-16_REQUESTED_OUTPUT_HARNESS_REFACTOR_HANDOFF.md): current committed checkpoint, latest validation gate, and explicit not-done list
2. [NEXT_IMPLEMENTATION_PLAN.md](./NEXT_IMPLEMENTATION_PLAN.md): exact restart point and current next action
3. [SYSTEM_MAP.md](./SYSTEM_MAP.md): how the live product is wired end-to-end before touching runtime boundaries
4. [CHECKPOINT_2026-04-14_FORMULA_PROVENANCE_DOSSIER_HANDOFF.md](./CHECKPOINT_2026-04-14_FORMULA_PROVENANCE_DOSSIER_HANDOFF.md): prior formula-provenance checkpoint context
5. [CALCULATION_MODEL_AND_VALIDATION.md](./CALCULATION_MODEL_AND_VALIDATION.md): only if the next task touches output origin, formula/source confidence, or card support meaning
6. [CURRENT_STATE.md](./CURRENT_STATE.md): latest verified snapshot and immediate next tasks
7. [CHECKPOINT_2026-04-14_UBIQ_HISTORY_REPLAY_HANDOFF.md](./CHECKPOINT_2026-04-14_UBIQ_HISTORY_REPLAY_HANDOFF.md): historical UBIQ checkpoint context
8. [CHECKPOINT_2026-04-13_END_OF_DAY_HANDOFF.md](./CHECKPOINT_2026-04-13_END_OF_DAY_HANDOFF.md): latest clean historical handoff context
9. [CHECKPOINT_2026-04-08_UI_HANDOFF.md](./CHECKPOINT_2026-04-08_UI_HANDOFF.md): latest UI handoff context
10. [STABILIZATION_CHECKPOINT_2026-04-13.md](./STABILIZATION_CHECKPOINT_2026-04-13.md): historical package map from the accepted stabilization set
11. [DYNAMIC_CALCULATOR_REMAINING_WORK_PLAN.md](./DYNAMIC_CALCULATOR_REMAINING_WORK_PLAN.md): open work, risk level, safe fix order, and missing-test surfaces
12. [DYNAMIC_CALCULATOR_COVERAGE_ACCURACY_PLAN.md](./DYNAMIC_CALCULATOR_COVERAGE_ACCURACY_PLAN.md): only if the next task is choosing or staging the next coverage/accuracy slice
13. [DYNAMIC_WALL_STABILITY_REMEDIATION.md](./DYNAMIC_WALL_STABILITY_REMEDIATION.md): only if the next task touches wall family selection or held boundary widening
14. [SOURCE_GAP_LEDGER.md](./SOURCE_GAP_LEDGER.md): only if the next task needs source-backed widening decisions

## File Roles

- [NEXT_IMPLEMENTATION_PLAN.md](./NEXT_IMPLEMENTATION_PLAN.md): concise current execution plan, next action, validation commands, and definition of done
- [CALCULATION_MODEL_AND_VALIDATION.md](./CALCULATION_MODEL_AND_VALIDATION.md): central map of answer origins, formulas, source rows, predictor lanes, support gating, and test confidence rules
- [CURRENT_STATE.md](./CURRENT_STATE.md): what is stable now, what is intentionally narrow, and what remains risky
- [SYSTEM_MAP.md](./SYSTEM_MAP.md): the live system model, file boundaries, persistence posture, and test surface map
- [CHECKPOINT_2026-04-16_REQUESTED_OUTPUT_HARNESS_REFACTOR_HANDOFF.md](./CHECKPOINT_2026-04-16_REQUESTED_OUTPUT_HARNESS_REFACTOR_HANDOFF.md): current checkpoint, green validation gate, requested-output harness hardening map, explicit not-done list, and restart notes
- [CHECKPOINT_2026-04-14_FORMULA_PROVENANCE_DOSSIER_HANDOFF.md](./CHECKPOINT_2026-04-14_FORMULA_PROVENANCE_DOSSIER_HANDOFF.md): historical formula-provenance checkpoint and prior close-out context
- [CHECKPOINT_2026-04-14_UBIQ_HISTORY_REPLAY_HANDOFF.md](./CHECKPOINT_2026-04-14_UBIQ_HISTORY_REPLAY_HANDOFF.md): historical UBIQ checkpoint, green validation gate, accepted package map, and restart notes
- [CHECKPOINT_2026-04-13_END_OF_DAY_HANDOFF.md](./CHECKPOINT_2026-04-13_END_OF_DAY_HANDOFF.md): clean handoff state, latest commits, validation snapshot, and next-agent constraints
- [STABILIZATION_CHECKPOINT_2026-04-13.md](./STABILIZATION_CHECKPOINT_2026-04-13.md): historical dirty-worktree package map, validation gate, and restart notes from the accepted stabilization set
- [FULL_ENGINE_SUITE_TRIAGE_2026-04-12.md](./FULL_ENGINE_SUITE_TRIAGE_2026-04-12.md): broad engine-suite failure classes, cleanup fixes, and non-blocking vs real-risk split
- [DYNAMIC_CALCULATOR_REMAINING_WORK_PLAN.md](./DYNAMIC_CALCULATOR_REMAINING_WORK_PLAN.md): the current cross-floor/wall work list, completion checklist, recently closed regressions, and the safest next implementation order
- [DYNAMIC_CALCULATOR_COVERAGE_ACCURACY_PLAN.md](./DYNAMIC_CALCULATOR_COVERAGE_ACCURACY_PLAN.md): the current execution model for growing scope and accuracy together, including workstreams, slice ordering, and required test packs
- [DYNAMIC_WALL_STABILITY_REMEDIATION.md](./DYNAMIC_WALL_STABILITY_REMEDIATION.md): how to harden dynamic wall routing without breaking source-backed corridors, plus the current wall-only closure checklist
- [DYNAMIC_CALCULATOR_PLAN.md](./DYNAMIC_CALCULATOR_PLAN.md): floor-dominant roadmap phases and the long-form execution backlog
- [SOURCE_GAP_LEDGER.md](./SOURCE_GAP_LEDGER.md): which family lanes are source-backed enough to widen, which should stay fail-closed, and which are deferred

## Historical Analysis

- [../archive/analysis/NUMERICAL_SYSTEM_ANALYSIS_2026-03-31.md](../archive/analysis/NUMERICAL_SYSTEM_ANALYSIS_2026-03-31.md): broad numerical-system deep dive
- [../archive/analysis/DYNAMIC_ROUTE_STABILITY_ANALYSIS_2026-04-07.md](../archive/analysis/DYNAMIC_ROUTE_STABILITY_ANALYSIS_2026-04-07.md): reproduced dynamic-route duplicate and reorder instability cases
