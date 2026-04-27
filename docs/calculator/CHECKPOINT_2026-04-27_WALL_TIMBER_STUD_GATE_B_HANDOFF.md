# Checkpoint - Wall Timber Stud Gate B Handoff

Date: 2026-04-27

## Status

`wall_timber_stud_clt_accuracy_pass_v1` timber-stud Gate B is landed
no-runtime.

Superseded for current workflow by
`CHECKPOINT_2026-04-27_WALL_CLT_GATE_B_HANDOFF.md`, which records CLT
wall Gate B as landed no-runtime and moves the slice to Gate C closeout.
Keep this file as the historical timber-stud Gate B evidence record.

No runtime values, formulas, output support, warnings, confidence
classes, or web cards changed. At the time of this checkpoint the next
bounded step was CLT wall Gate B.

## Timber Gate B Decision

The generated timber-stud candidate stays on its current formula-owned
dynamic surface:

- candidate id: `wall.timber_stud_formula.field`;
- generated id: `wall-timber-stud`;
- lab `Rw=50`, `STC=50`, `C=0.5`, `Ctr=-4.2`;
- field `R'w=42`, `Dn,w=42`, `DnT,w=43`, `DnT,A=43.9`;
- dynamic family: `stud_wall_system`;
- strategy: `stud_surrogate_blend+framed_wall_calibration`;
- confidence: `low`;
- evidence tier: `formula`.

Gate B does not change math because the landed contract found no
defensible source/formula unlock:

- no verified airborne exact match;
- no verified airborne lab-fallback match;
- direct timber exact imports are single-board only;
- resilient timber exact imports require explicit
  `resilientBarSideCount` and acoustic-board topology;
- the direct double-board official row is a secondary benchmark, not an
  exact match for the live material/fill/cavity topology;
- linked lightweight holdouts are steel-framed companions, not wood-stud
  exact truth.

Runtime tightening remains blocked until a future change names either an
exact matching source row or a documented bounded family rule with an
explicit tolerance.

## Next Step At This Checkpoint

At this checkpoint, the next step was to start Gate B for
`wall.clt_formula.field`. That step is now complete in
`CHECKPOINT_2026-04-27_WALL_CLT_GATE_B_HANDOFF.md`.

The first CLT change should be a focused engine source/formula contract
for generated `wall-clt-local`. Do not change math until the contract
names a wall-specific source row, documented CLT wall formula rule, or
bounded family rule. Do not borrow floor CLT source rows as wall CLT
exact truth.

## Validation

Pre-Gate B baseline:

- `pnpm calculator:gate:current` green: engine 91 files / 416 tests,
  web 36 files / 170 passed + 18 skipped, build 5/5.
- Known non-fatal `sharp/@img` optional-package warnings remain.

Gate B targeted validation:

- `pnpm --filter @dynecho/engine exec vitest run src/wall-timber-stud-gate-b-source-contract.test.ts --maxWorkers=1`
  - 1 file / 4 tests green.

Post-Gate B focused validation:

- `pnpm calculator:gate:current`
  - engine 92 files / 420 tests;
  - web 36 files / 170 passed + 18 skipped;
  - build 5/5.
- `git diff --check` clean.
- Known non-fatal `sharp/@img` optional-package warnings remain.

Executable evidence:

- `packages/engine/src/wall-timber-stud-gate-b-source-contract.test.ts`
- `packages/engine/src/wall-timber-stud-clt-gate-a-audit-contract.test.ts`
- `packages/engine/src/wall-timber-lightweight-source-audit.test.ts`
- `packages/engine/src/wall-formula-family-widening-audit.test.ts`
- `apps/web/features/workbench/wall-live-dynamic-preset-route-card-matrix.test.ts`
