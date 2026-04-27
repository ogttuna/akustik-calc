# Checkpoint - Wall Timber Stud + CLT Gate A Handoff

Date: 2026-04-27

## Status

`wall_timber_stud_clt_accuracy_pass_v1` Gate A is landed no-runtime.

No runtime values, formulas, output support, warnings, or web cards
changed. The slice remains active and Gate B starts with timber stud.

## Gate A Findings

Generated timber stud case:

- generated id: `wall-timber-stud`;
- candidate id: `wall.timber_stud_formula.field`;
- stack: `2x12.5 gypsum_board + 50 rockwool + 50 air_gap + 2x12.5
  gypsum_board`;
- lab `Rw=50`, `STC=50`, `C=0.5`, `Ctr=-4.2`;
- field `R'w=42`, `Dn,w=42`, `DnT,w=43`, `DnT,A=43.9`;
- dynamic family: `stud_wall_system`;
- strategy: `stud_surrogate_blend+framed_wall_calibration`;
- confidence: `low`;
- family decision: `ambiguous`, runner-up `double_leaf`;
- verified exact match: none;
- verified lab-fallback match: none;
- landed timber exact-row topology match: none.

Generated CLT wall case:

- generated id: `wall-clt-local`;
- candidate id: `wall.clt_formula.field`;
- stack: `12.5 gypsum_board + 140 clt_panel + 12.5 gypsum_board`;
- lab `Rw=42`, `STC=43`, `C=-1.1`, `Ctr=-7.1`;
- field `R'w=41`, `Dn,w=41`, `DnT,w=42`, `DnT,A=40.7`;
- dynamic family: `laminated_single_leaf`;
- strategy: `laminated_leaf_sharp_delegate`;
- confidence: `medium`;
- verified exact match: none;
- verified lab-fallback match: none;
- floor-system/source truth import: none.

## Next Step

Start Gate B with `wall.timber_stud_formula.field`.

The first Gate B change should be a focused engine runtime/source
contract for the generated `wall-timber-stud` stack. Do not change math
until the contract names one of:

- an exact matching source row;
- a documented formula-owned timber rule;
- a bounded family rule with explicit tolerance.

Do not promote direct single-board timber rows or resilient-bar rows by
adjacency to the generated double-board line-connected stack.

After timber Gate B closes, run the same source/formula discipline on
`wall.clt_formula.field`. Do not borrow floor CLT source rows as wall
CLT exact truth.

## Validation

Pre-Gate A baseline:

- `pnpm calculator:gate:current` green: engine 90 files / 412 tests,
  web 36 files / 170 passed + 18 skipped, build 5/5.
- Known non-fatal `sharp/@img` optional-package warnings remain.

Gate A targeted validation:

- `pnpm --filter @dynecho/engine exec vitest run src/wall-timber-stud-clt-gate-a-audit-contract.test.ts --maxWorkers=1`
  - 1 file / 4 tests green.

Post-Gate A focused validation:

- `pnpm calculator:gate:current`
  - engine 91 files / 416 tests;
  - web 36 files / 170 passed + 18 skipped;
  - build 5/5.
- `git diff --check` clean.
- Known non-fatal `sharp/@img` optional-package warnings remain.

Executable evidence:

- `packages/engine/src/wall-timber-stud-clt-gate-a-audit-contract.test.ts`
- `packages/engine/src/realistic-layer-combination-coverage-cartography.test.ts`
- `packages/engine/src/wall-timber-lightweight-source-audit.test.ts`
- `apps/web/features/workbench/wall-direct-timber-exact-route-card-matrix.test.ts`
- `apps/web/features/workbench/wall-preset-expansion-benchmarks.test.ts`
