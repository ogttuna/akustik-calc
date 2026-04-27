# Checkpoint - Wall CLT Gate B Handoff

Date: 2026-04-27

## Status

`wall_timber_stud_clt_accuracy_pass_v1` CLT wall Gate B is landed
no-runtime.

No runtime values, formulas, output support, warnings, confidence
classes, or web cards changed. Timber-stud Gate B and CLT wall Gate B
are both complete. The next bounded step is Gate C closeout for the
timber stud + CLT wall accuracy pass, then selection of the roadmap's
floor fallback / low-confidence cleanup slice.

## CLT Gate B Decision

The generated CLT wall candidate stays on its current formula-owned
dynamic surface:

- candidate id: `wall.clt_formula.field`;
- generated id: `wall-clt-local`;
- lab `Rw=42`, `STC=43`, `C=-1.1`, `Ctr=-7.1`;
- field `R'w=41`, `Dn,w=41`, `DnT,w=42`, `DnT,A=40.7`;
- dynamic family: `laminated_single_leaf`;
- strategy: `laminated_leaf_sharp_delegate`;
- confidence: `medium`;
- evidence tier: `formula`.

Gate B does not change math because the landed contract found no
defensible source/formula unlock:

- no verified airborne exact match;
- no verified airborne lab-fallback match;
- no wall-specific CLT exact row in the current catalog;
- Dataholz CLT rows are floor-system source truth, not wall exact truth;
- the current laminated single-leaf lane is a Sharp-delegate formula,
  not a source row.

Runtime tightening remains blocked until a future change names a
wall-specific CLT source row, a documented laminated-leaf solver, or a
bounded family rule with explicit tolerance.

## Next Step

Close Gate C for `wall_timber_stud_clt_accuracy_pass_v1`.

Gate C should summarize the two no-runtime Gate B decisions, update
`NEXT_IMPLEMENTATION_PLAN.md`, `CURRENT_STATE.md`, this checkpoint chain,
and the roadmap. Because the slice is closing, run broad validation
before commit if feasible. The next calculator-priority slice remains
`floor_fallback_low_confidence_cleanup`.

## Validation

Pre-Gate B baseline:

- `pnpm calculator:gate:current` green before this change: engine
  92 files / 420 tests, web 36 files / 170 passed + 18 skipped, build
  5/5.
- Known non-fatal `sharp/@img` optional-package warnings remain.

Gate B targeted validation:

- `pnpm --filter @dynecho/engine exec vitest run src/wall-clt-gate-b-source-contract.test.ts --maxWorkers=1`
  - 1 file / 4 tests green.

Post-Gate B focused validation:

- `pnpm calculator:gate:current`
  - engine 93 files / 424 tests;
  - web 36 files / 170 passed + 18 skipped;
  - build 5/5.
- `git diff --check`
  - clean.
- Known non-fatal `sharp/@img` optional-package warnings remain.

Executable evidence:

- `packages/engine/src/wall-clt-gate-b-source-contract.test.ts`
- `packages/engine/src/wall-timber-stud-gate-b-source-contract.test.ts`
- `packages/engine/src/wall-timber-stud-clt-gate-a-audit-contract.test.ts`
- `packages/engine/src/dataholz-clt-source-truth-audit.test.ts`
- `apps/web/features/workbench/wall-preset-expansion-benchmarks.test.ts`
