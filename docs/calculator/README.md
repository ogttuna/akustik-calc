# Calculator Docs

Use this folder for the current acoustic-calculator and workbench behavior.

This is the primary living doc set for dynamic calculator work. Read these files before using anything under `docs/archive`.

## Read Order

1. [CURRENT_STATE.md](./CURRENT_STATE.md): short snapshot of the current calculator/workbench posture
2. [CHECKPOINT_2026-04-08_UI_HANDOFF.md](./CHECKPOINT_2026-04-08_UI_HANDOFF.md): fast restart note for the latest UI handoff point
3. [DYNAMIC_CALCULATOR_REMAINING_WORK_PLAN.md](./DYNAMIC_CALCULATOR_REMAINING_WORK_PLAN.md): cross-floor/wall remaining work, recently closed regressions, completion status, and non-regressive fix order
4. [DYNAMIC_CALCULATOR_COVERAGE_ACCURACY_PLAN.md](./DYNAMIC_CALCULATOR_COVERAGE_ACCURACY_PLAN.md): current execution model for coverage growth, accuracy tightening, and test-first slice planning
5. [DYNAMIC_WALL_STABILITY_REMEDIATION.md](./DYNAMIC_WALL_STABILITY_REMEDIATION.md): wall-side dynamic stability diagnosis, safe fix order, and test contracts
6. [DYNAMIC_CALCULATOR_PLAN.md](./DYNAMIC_CALCULATOR_PLAN.md): active implementation order and hardening backlog
7. [SOURCE_GAP_LEDGER.md](./SOURCE_GAP_LEDGER.md): source-backed widening, tightening, and deferred-family boundaries
8. [../archive/analysis/README.md](../archive/analysis/README.md): dated investigations and reproduction notes

## Status Shortcut

If the question is “what is actually finished vs still open?”, use this order:

1. [CURRENT_STATE.md](./CURRENT_STATE.md): broad verified snapshot
2. [DYNAMIC_CALCULATOR_REMAINING_WORK_PLAN.md](./DYNAMIC_CALCULATOR_REMAINING_WORK_PLAN.md): explicit completion checklist across floor + wall
3. [DYNAMIC_CALCULATOR_COVERAGE_ACCURACY_PLAN.md](./DYNAMIC_CALCULATOR_COVERAGE_ACCURACY_PLAN.md): next-slice execution order, test-first rules, and workstream priorities
4. [DYNAMIC_WALL_STABILITY_REMEDIATION.md](./DYNAMIC_WALL_STABILITY_REMEDIATION.md): wall-only phase closure and partial-open items
5. [DYNAMIC_CALCULATOR_PLAN.md](./DYNAMIC_CALCULATOR_PLAN.md): floor-dominant roadmap phases

Reading rule:

- `complete` means defended by executable tests
- `partial` means a narrow defended slice exists, not that the whole problem class is closed
- `open` means do not infer completion from nearby green representative corridors

## Resume Shortcut

If the question is “where do I restart tomorrow without re-reading everything?”, use this order:

1. [CHECKPOINT_2026-04-08_UI_HANDOFF.md](./CHECKPOINT_2026-04-08_UI_HANDOFF.md): exact restart point, latest green commands, and recommended next candidates
2. [CURRENT_STATE.md](./CURRENT_STATE.md): latest verified snapshot and immediate next tasks
3. [DYNAMIC_CALCULATOR_REMAINING_WORK_PLAN.md](./DYNAMIC_CALCULATOR_REMAINING_WORK_PLAN.md): open work, risk level, safe fix order, and missing-test surfaces
4. [DYNAMIC_CALCULATOR_COVERAGE_ACCURACY_PLAN.md](./DYNAMIC_CALCULATOR_COVERAGE_ACCURACY_PLAN.md): only if the next task is choosing or staging the next coverage/accuracy slice
5. [DYNAMIC_WALL_STABILITY_REMEDIATION.md](./DYNAMIC_WALL_STABILITY_REMEDIATION.md): only if the next task touches wall family selection or held boundary widening
6. [SOURCE_GAP_LEDGER.md](./SOURCE_GAP_LEDGER.md): only if the next task needs source-backed widening decisions

## File Roles

- [CURRENT_STATE.md](./CURRENT_STATE.md): what is stable now, what is intentionally narrow, and what remains risky
- [DYNAMIC_CALCULATOR_REMAINING_WORK_PLAN.md](./DYNAMIC_CALCULATOR_REMAINING_WORK_PLAN.md): the current cross-floor/wall work list, completion checklist, recently closed regressions, and the safest next implementation order
- [DYNAMIC_CALCULATOR_COVERAGE_ACCURACY_PLAN.md](./DYNAMIC_CALCULATOR_COVERAGE_ACCURACY_PLAN.md): the current execution model for growing scope and accuracy together, including workstreams, slice ordering, and required test packs
- [DYNAMIC_WALL_STABILITY_REMEDIATION.md](./DYNAMIC_WALL_STABILITY_REMEDIATION.md): how to harden dynamic wall routing without breaking source-backed corridors, plus the current wall-only closure checklist
- [DYNAMIC_CALCULATOR_PLAN.md](./DYNAMIC_CALCULATOR_PLAN.md): floor-dominant roadmap phases and the long-form execution backlog
- [SOURCE_GAP_LEDGER.md](./SOURCE_GAP_LEDGER.md): which family lanes are source-backed enough to widen, which should stay fail-closed, and which are deferred

## Historical Analysis

- [../archive/analysis/NUMERICAL_SYSTEM_ANALYSIS_2026-03-31.md](../archive/analysis/NUMERICAL_SYSTEM_ANALYSIS_2026-03-31.md): broad numerical-system deep dive
- [../archive/analysis/DYNAMIC_ROUTE_STABILITY_ANALYSIS_2026-04-07.md](../archive/analysis/DYNAMIC_ROUTE_STABILITY_ANALYSIS_2026-04-07.md): reproduced dynamic-route duplicate and reorder instability cases
