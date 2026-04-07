# Docs

This directory separates living reference docs from dated historical notes.

## Start Here

Read by intent:

1. Current calculator or workbench behavior: [calculator/README.md](./calculator/README.md)
2. Repo-level direction and rules: [foundation/README.md](./foundation/README.md)
3. Upstream import workflow and inventory: [imports/README.md](./imports/README.md)
4. Historical investigations, status notes, and handoffs: [archive/README.md](./archive/README.md)

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
- [calculator/DYNAMIC_CALCULATOR_PLAN.md](./calculator/DYNAMIC_CALCULATOR_PLAN.md): active execution order for dynamic-calculator hardening
- [calculator/SOURCE_GAP_LEDGER.md](./calculator/SOURCE_GAP_LEDGER.md): source-backed widening, tightening, and deferred-family ledger
- [foundation/PROJECT_PLAN.md](./foundation/PROJECT_PLAN.md): long-lived product direction and repo constraints
- [foundation/SOURCE_REPO_POLICY.md](./foundation/SOURCE_REPO_POLICY.md): upstream import and parity policy

## Historical Notes

Use [archive/README.md](./archive/README.md) for the dated status timeline, handoffs, and analysis index.
