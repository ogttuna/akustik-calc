# Calculator Docs

Use this folder for the current acoustic-calculator and workbench behavior.

This is the primary living doc set for dynamic calculator work. Read these files before using anything under `docs/archive`.

## Read Order

1. [NEXT_IMPLEMENTATION_PLAN.md](./NEXT_IMPLEMENTATION_PLAN.md): concise current execution plan and validated next steps
2. [CURRENT_STATE.md](./CURRENT_STATE.md): short snapshot of the current calculator/workbench posture
3. [STABILIZATION_CHECKPOINT_2026-04-13.md](./STABILIZATION_CHECKPOINT_2026-04-13.md): current dirty-worktree package map and safe checkpoint before new widening
4. [FULL_ENGINE_SUITE_TRIAGE_2026-04-12.md](./FULL_ENGINE_SUITE_TRIAGE_2026-04-12.md): current broad-suite failure classification and focused cleanup status
5. [CHECKPOINT_2026-04-08_UI_HANDOFF.md](./CHECKPOINT_2026-04-08_UI_HANDOFF.md): fast restart note for the latest UI handoff point
6. [DYNAMIC_CALCULATOR_REMAINING_WORK_PLAN.md](./DYNAMIC_CALCULATOR_REMAINING_WORK_PLAN.md): cross-floor/wall remaining work, recently closed regressions, completion status, and non-regressive fix order
7. [DYNAMIC_CALCULATOR_COVERAGE_ACCURACY_PLAN.md](./DYNAMIC_CALCULATOR_COVERAGE_ACCURACY_PLAN.md): current execution model for coverage growth, accuracy tightening, and test-first slice planning
8. [DYNAMIC_WALL_STABILITY_REMEDIATION.md](./DYNAMIC_WALL_STABILITY_REMEDIATION.md): wall-side dynamic stability diagnosis, safe fix order, and test contracts
9. [DYNAMIC_CALCULATOR_PLAN.md](./DYNAMIC_CALCULATOR_PLAN.md): active implementation order and hardening backlog
10. [SOURCE_GAP_LEDGER.md](./SOURCE_GAP_LEDGER.md): source-backed widening, tightening, and deferred-family boundaries
11. [../archive/analysis/README.md](../archive/analysis/README.md): dated investigations and reproduction notes

## Status Shortcut

If the question is “what is actually finished vs still open?”, use this order:

1. [NEXT_IMPLEMENTATION_PLAN.md](./NEXT_IMPLEMENTATION_PLAN.md): current execution plan, next slice, and validation commands
2. [CURRENT_STATE.md](./CURRENT_STATE.md): broad verified snapshot
3. [STABILIZATION_CHECKPOINT_2026-04-13.md](./STABILIZATION_CHECKPOINT_2026-04-13.md): current dirty-worktree package map and validation gate
4. [FULL_ENGINE_SUITE_TRIAGE_2026-04-12.md](./FULL_ENGINE_SUITE_TRIAGE_2026-04-12.md): which broad-suite reds are stale, fixed, real, or intentionally fail-closed
5. [DYNAMIC_CALCULATOR_REMAINING_WORK_PLAN.md](./DYNAMIC_CALCULATOR_REMAINING_WORK_PLAN.md): explicit completion checklist across floor + wall
6. [DYNAMIC_CALCULATOR_COVERAGE_ACCURACY_PLAN.md](./DYNAMIC_CALCULATOR_COVERAGE_ACCURACY_PLAN.md): next-slice execution order, test-first rules, and workstream priorities
7. [DYNAMIC_WALL_STABILITY_REMEDIATION.md](./DYNAMIC_WALL_STABILITY_REMEDIATION.md): wall-only phase closure and partial-open items
8. [DYNAMIC_CALCULATOR_PLAN.md](./DYNAMIC_CALCULATOR_PLAN.md): floor-dominant roadmap phases

Reading rule:

- `complete` means defended by executable tests
- `partial` means a narrow defended slice exists, not that the whole problem class is closed
- `open` means do not infer completion from nearby green representative corridors

## Resume Shortcut

If the question is “where do I restart tomorrow without re-reading everything?”, use this order:

1. [NEXT_IMPLEMENTATION_PLAN.md](./NEXT_IMPLEMENTATION_PLAN.md): exact restart point and current next slice
2. [CHECKPOINT_2026-04-08_UI_HANDOFF.md](./CHECKPOINT_2026-04-08_UI_HANDOFF.md): latest UI handoff context
3. [STABILIZATION_CHECKPOINT_2026-04-13.md](./STABILIZATION_CHECKPOINT_2026-04-13.md): current dirty-worktree package map before new widening work
4. [CURRENT_STATE.md](./CURRENT_STATE.md): latest verified snapshot and immediate next tasks
5. [DYNAMIC_CALCULATOR_REMAINING_WORK_PLAN.md](./DYNAMIC_CALCULATOR_REMAINING_WORK_PLAN.md): open work, risk level, safe fix order, and missing-test surfaces
6. [DYNAMIC_CALCULATOR_COVERAGE_ACCURACY_PLAN.md](./DYNAMIC_CALCULATOR_COVERAGE_ACCURACY_PLAN.md): only if the next task is choosing or staging the next coverage/accuracy slice
7. [DYNAMIC_WALL_STABILITY_REMEDIATION.md](./DYNAMIC_WALL_STABILITY_REMEDIATION.md): only if the next task touches wall family selection or held boundary widening
8. [SOURCE_GAP_LEDGER.md](./SOURCE_GAP_LEDGER.md): only if the next task needs source-backed widening decisions

## File Roles

- [NEXT_IMPLEMENTATION_PLAN.md](./NEXT_IMPLEMENTATION_PLAN.md): concise current execution plan, next slice, validation commands, and definition of done
- [CURRENT_STATE.md](./CURRENT_STATE.md): what is stable now, what is intentionally narrow, and what remains risky
- [STABILIZATION_CHECKPOINT_2026-04-13.md](./STABILIZATION_CHECKPOINT_2026-04-13.md): current dirty-worktree package map, validation gate, and safe restart notes before new widening
- [FULL_ENGINE_SUITE_TRIAGE_2026-04-12.md](./FULL_ENGINE_SUITE_TRIAGE_2026-04-12.md): broad engine-suite failure classes, cleanup fixes, and non-blocking vs real-risk split
- [DYNAMIC_CALCULATOR_REMAINING_WORK_PLAN.md](./DYNAMIC_CALCULATOR_REMAINING_WORK_PLAN.md): the current cross-floor/wall work list, completion checklist, recently closed regressions, and the safest next implementation order
- [DYNAMIC_CALCULATOR_COVERAGE_ACCURACY_PLAN.md](./DYNAMIC_CALCULATOR_COVERAGE_ACCURACY_PLAN.md): the current execution model for growing scope and accuracy together, including workstreams, slice ordering, and required test packs
- [DYNAMIC_WALL_STABILITY_REMEDIATION.md](./DYNAMIC_WALL_STABILITY_REMEDIATION.md): how to harden dynamic wall routing without breaking source-backed corridors, plus the current wall-only closure checklist
- [DYNAMIC_CALCULATOR_PLAN.md](./DYNAMIC_CALCULATOR_PLAN.md): floor-dominant roadmap phases and the long-form execution backlog
- [SOURCE_GAP_LEDGER.md](./SOURCE_GAP_LEDGER.md): which family lanes are source-backed enough to widen, which should stay fail-closed, and which are deferred

## Historical Analysis

- [../archive/analysis/NUMERICAL_SYSTEM_ANALYSIS_2026-03-31.md](../archive/analysis/NUMERICAL_SYSTEM_ANALYSIS_2026-03-31.md): broad numerical-system deep dive
- [../archive/analysis/DYNAMIC_ROUTE_STABILITY_ANALYSIS_2026-04-07.md](../archive/analysis/DYNAMIC_ROUTE_STABILITY_ANALYSIS_2026-04-07.md): reproduced dynamic-route duplicate and reorder instability cases
