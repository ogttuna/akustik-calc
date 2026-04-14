# Calculator Docs

Use this folder for the current acoustic-calculator and workbench behavior.

This is the primary living doc set for dynamic calculator work. Read these files before using anything under `docs/archive`.

## Read Order

1. [CHECKPOINT_2026-04-14_FORMULA_PROVENANCE_DOSSIER_HANDOFF.md](./CHECKPOINT_2026-04-14_FORMULA_PROVENANCE_DOSSIER_HANDOFF.md): current end-of-day checkpoint after the formula provenance dossier guard
2. [NEXT_IMPLEMENTATION_PLAN.md](./NEXT_IMPLEMENTATION_PLAN.md): concise current execution plan and validated next steps
3. [CALCULATION_MODEL_AND_VALIDATION.md](./CALCULATION_MODEL_AND_VALIDATION.md): answer-origin map for formulas, source rows, predictors, field continuations, support gating, and test meaning
4. [CURRENT_STATE.md](./CURRENT_STATE.md): short snapshot of the current calculator/workbench posture
5. [CHECKPOINT_2026-04-14_UBIQ_HISTORY_REPLAY_HANDOFF.md](./CHECKPOINT_2026-04-14_UBIQ_HISTORY_REPLAY_HANDOFF.md): historical committed checkpoint after the UBIQ packaged open-web history replay guard
6. [CHECKPOINT_2026-04-13_END_OF_DAY_HANDOFF.md](./CHECKPOINT_2026-04-13_END_OF_DAY_HANDOFF.md): clean resume point after the accepted 2026-04-13 guard slices
7. [STABILIZATION_CHECKPOINT_2026-04-13.md](./STABILIZATION_CHECKPOINT_2026-04-13.md): historical package map for the accepted large dirty-worktree stabilization
8. [FULL_ENGINE_SUITE_TRIAGE_2026-04-12.md](./FULL_ENGINE_SUITE_TRIAGE_2026-04-12.md): current broad-suite failure classification and focused cleanup status
9. [CHECKPOINT_2026-04-08_UI_HANDOFF.md](./CHECKPOINT_2026-04-08_UI_HANDOFF.md): fast restart note for the latest UI handoff point
10. [DYNAMIC_CALCULATOR_REMAINING_WORK_PLAN.md](./DYNAMIC_CALCULATOR_REMAINING_WORK_PLAN.md): cross-floor/wall remaining work, recently closed regressions, completion status, and non-regressive fix order
11. [DYNAMIC_CALCULATOR_COVERAGE_ACCURACY_PLAN.md](./DYNAMIC_CALCULATOR_COVERAGE_ACCURACY_PLAN.md): current execution model for coverage growth, accuracy tightening, and test-first slice planning
12. [DYNAMIC_WALL_STABILITY_REMEDIATION.md](./DYNAMIC_WALL_STABILITY_REMEDIATION.md): wall-side dynamic stability diagnosis, safe fix order, and test contracts
13. [DYNAMIC_CALCULATOR_PLAN.md](./DYNAMIC_CALCULATOR_PLAN.md): active implementation order and hardening backlog
14. [SOURCE_GAP_LEDGER.md](./SOURCE_GAP_LEDGER.md): source-backed widening, tightening, and deferred-family boundaries
15. [../archive/analysis/README.md](../archive/analysis/README.md): dated investigations and reproduction notes

## Status Shortcut

If the question is “what is actually finished vs still open?”, use this order:

1. [CHECKPOINT_2026-04-14_FORMULA_PROVENANCE_DOSSIER_HANDOFF.md](./CHECKPOINT_2026-04-14_FORMULA_PROVENANCE_DOSSIER_HANDOFF.md): current committed checkpoint, validation gate, completed formula-provenance slices, and explicit not-done list
2. [NEXT_IMPLEMENTATION_PLAN.md](./NEXT_IMPLEMENTATION_PLAN.md): current execution plan, next action, and validation commands
3. [CALCULATION_MODEL_AND_VALIDATION.md](./CALCULATION_MODEL_AND_VALIDATION.md): how to decide whether a shown answer is source-backed, formula-backed, predictor-backed, bound-only, or unsupported
4. [CURRENT_STATE.md](./CURRENT_STATE.md): broad verified snapshot
5. [CHECKPOINT_2026-04-14_UBIQ_HISTORY_REPLAY_HANDOFF.md](./CHECKPOINT_2026-04-14_UBIQ_HISTORY_REPLAY_HANDOFF.md): historical UBIQ checkpoint and accepted package map
6. [CHECKPOINT_2026-04-13_END_OF_DAY_HANDOFF.md](./CHECKPOINT_2026-04-13_END_OF_DAY_HANDOFF.md): latest clean handoff state and resume constraints
7. [STABILIZATION_CHECKPOINT_2026-04-13.md](./STABILIZATION_CHECKPOINT_2026-04-13.md): historical package map and validation gate for the accepted stabilization set
8. [FULL_ENGINE_SUITE_TRIAGE_2026-04-12.md](./FULL_ENGINE_SUITE_TRIAGE_2026-04-12.md): which broad-suite reds are stale, fixed, real, or intentionally fail-closed
9. [DYNAMIC_CALCULATOR_REMAINING_WORK_PLAN.md](./DYNAMIC_CALCULATOR_REMAINING_WORK_PLAN.md): explicit completion checklist across floor + wall
10. [DYNAMIC_CALCULATOR_COVERAGE_ACCURACY_PLAN.md](./DYNAMIC_CALCULATOR_COVERAGE_ACCURACY_PLAN.md): next-slice execution order, test-first rules, and workstream priorities
11. [DYNAMIC_WALL_STABILITY_REMEDIATION.md](./DYNAMIC_WALL_STABILITY_REMEDIATION.md): wall-only phase closure and partial-open items
12. [DYNAMIC_CALCULATOR_PLAN.md](./DYNAMIC_CALCULATOR_PLAN.md): floor-dominant roadmap phases

Reading rule:

- `complete` means defended by executable tests
- `partial` means a narrow defended slice exists, not that the whole problem class is closed
- `open` means do not infer completion from nearby green representative corridors

## Resume Shortcut

If the question is “where do I restart tomorrow without re-reading everything?”, use this order:

1. [CHECKPOINT_2026-04-14_FORMULA_PROVENANCE_DOSSIER_HANDOFF.md](./CHECKPOINT_2026-04-14_FORMULA_PROVENANCE_DOSSIER_HANDOFF.md): current committed checkpoint, latest validation gate, and restart notes
2. [NEXT_IMPLEMENTATION_PLAN.md](./NEXT_IMPLEMENTATION_PLAN.md): exact restart point and current next action
3. [CALCULATION_MODEL_AND_VALIDATION.md](./CALCULATION_MODEL_AND_VALIDATION.md): only if the next task touches output origin, formula/source confidence, or card support meaning
4. [CURRENT_STATE.md](./CURRENT_STATE.md): latest verified snapshot and immediate next tasks
5. [CHECKPOINT_2026-04-14_UBIQ_HISTORY_REPLAY_HANDOFF.md](./CHECKPOINT_2026-04-14_UBIQ_HISTORY_REPLAY_HANDOFF.md): historical UBIQ checkpoint context
6. [CHECKPOINT_2026-04-13_END_OF_DAY_HANDOFF.md](./CHECKPOINT_2026-04-13_END_OF_DAY_HANDOFF.md): latest clean historical handoff context
7. [CHECKPOINT_2026-04-08_UI_HANDOFF.md](./CHECKPOINT_2026-04-08_UI_HANDOFF.md): latest UI handoff context
8. [STABILIZATION_CHECKPOINT_2026-04-13.md](./STABILIZATION_CHECKPOINT_2026-04-13.md): historical package map from the accepted stabilization set
9. [DYNAMIC_CALCULATOR_REMAINING_WORK_PLAN.md](./DYNAMIC_CALCULATOR_REMAINING_WORK_PLAN.md): open work, risk level, safe fix order, and missing-test surfaces
10. [DYNAMIC_CALCULATOR_COVERAGE_ACCURACY_PLAN.md](./DYNAMIC_CALCULATOR_COVERAGE_ACCURACY_PLAN.md): only if the next task is choosing or staging the next coverage/accuracy slice
11. [DYNAMIC_WALL_STABILITY_REMEDIATION.md](./DYNAMIC_WALL_STABILITY_REMEDIATION.md): only if the next task touches wall family selection or held boundary widening
12. [SOURCE_GAP_LEDGER.md](./SOURCE_GAP_LEDGER.md): only if the next task needs source-backed widening decisions

## File Roles

- [NEXT_IMPLEMENTATION_PLAN.md](./NEXT_IMPLEMENTATION_PLAN.md): concise current execution plan, next action, validation commands, and definition of done
- [CALCULATION_MODEL_AND_VALIDATION.md](./CALCULATION_MODEL_AND_VALIDATION.md): central map of answer origins, formulas, source rows, predictor lanes, support gating, and test confidence rules
- [CURRENT_STATE.md](./CURRENT_STATE.md): what is stable now, what is intentionally narrow, and what remains risky
- [CHECKPOINT_2026-04-14_FORMULA_PROVENANCE_DOSSIER_HANDOFF.md](./CHECKPOINT_2026-04-14_FORMULA_PROVENANCE_DOSSIER_HANDOFF.md): current checkpoint, green validation gate, formula-provenance slice map, explicit not-done list, and restart notes
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
