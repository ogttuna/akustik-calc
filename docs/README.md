# Docs

This directory separates living reference docs from dated historical notes.

## Start Here

Read by intent:

1. Next calculator implementation steps: [calculator/NEXT_IMPLEMENTATION_PLAN.md](./calculator/NEXT_IMPLEMENTATION_PLAN.md)
2. Current calculator or workbench behavior: [calculator/README.md](./calculator/README.md)
3. Current dirty-worktree checkpoint: [calculator/STABILIZATION_CHECKPOINT_2026-04-13.md](./calculator/STABILIZATION_CHECKPOINT_2026-04-13.md)
4. Repo-level direction and rules: [foundation/README.md](./foundation/README.md)
5. Upstream import workflow and inventory: [imports/README.md](./imports/README.md)
6. Historical investigations, status notes, and handoffs: [archive/README.md](./archive/README.md)

## Hierarchy

```text
docs/
  calculator/   current calculator and workbench behavior
  foundation/   long-lived project direction and repo rules
  imports/      upstream import notes and helper commands
  archive/      dated status, handoff, and analysis notes
```

If a file under `docs/archive` disagrees with a living document under `docs/calculator` or `docs/foundation`, the living document wins.

## Current Canonical Documents

- [calculator/CURRENT_STATE.md](./calculator/CURRENT_STATE.md): short living snapshot of the current calculator/workbench posture
- [calculator/NEXT_IMPLEMENTATION_PLAN.md](./calculator/NEXT_IMPLEMENTATION_PLAN.md): concise current execution plan and validated next steps
- [calculator/STABILIZATION_CHECKPOINT_2026-04-13.md](./calculator/STABILIZATION_CHECKPOINT_2026-04-13.md): current dirty-worktree package map and safe checkpoint before new widening
- [calculator/FULL_ENGINE_SUITE_TRIAGE_2026-04-12.md](./calculator/FULL_ENGINE_SUITE_TRIAGE_2026-04-12.md): current full-engine-suite failure classification and cleanup notes
- [calculator/DYNAMIC_CALCULATOR_REMAINING_WORK_PLAN.md](./calculator/DYNAMIC_CALCULATOR_REMAINING_WORK_PLAN.md): explicit cross-floor/wall completion checklist and next-step order
- [calculator/DYNAMIC_CALCULATOR_COVERAGE_ACCURACY_PLAN.md](./calculator/DYNAMIC_CALCULATOR_COVERAGE_ACCURACY_PLAN.md): execution model for coverage growth, accuracy tightening, and test-first slice planning
- [calculator/DYNAMIC_CALCULATOR_PLAN.md](./calculator/DYNAMIC_CALCULATOR_PLAN.md): active execution order for dynamic-calculator hardening
- [calculator/SOURCE_GAP_LEDGER.md](./calculator/SOURCE_GAP_LEDGER.md): source-backed widening, tightening, and deferred-family ledger
- [foundation/PROJECT_PLAN.md](./foundation/PROJECT_PLAN.md): long-lived product direction and repo constraints
- [foundation/SOURCE_REPO_POLICY.md](./foundation/SOURCE_REPO_POLICY.md): upstream import and parity policy

Status reading rule:

- use `CURRENT_STATE.md` for “what is stable right now”
- use `NEXT_IMPLEMENTATION_PLAN.md` for “what exactly should be implemented next”
- use `STABILIZATION_CHECKPOINT_2026-04-13.md` for “how the current dirty worktree is grouped and validated”
- use `DYNAMIC_CALCULATOR_REMAINING_WORK_PLAN.md` for “what is done / partial / still open”
- use `DYNAMIC_CALCULATOR_COVERAGE_ACCURACY_PLAN.md` for “how the next widening or tightening slice should be selected and tested”
- use `DYNAMIC_CALCULATOR_PLAN.md` only as the long-form roadmap, not as the sole current-status snapshot

## Historical Notes

Use [archive/README.md](./archive/README.md) for the dated status timeline, handoffs, and analysis index.
