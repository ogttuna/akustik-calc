# Checkpoint - Wall Heavy-Core Concrete Gate B Closeout

Date: 2026-04-27

## Status

`wall_heavy_core_concrete_gate_b_v1` is closed no-runtime.

The selected concrete lining lane remains screening-tier. No runtime
values, formulas, output support, or web cards changed.

## Closeout Decision

Gate B did not import a source row or promote the selected topology
because the landed audit found:

- no exact verified airborne catalog match;
- no verified airborne lab-fallback match;
- no floor-system or bound-floor source match for this wall case;
- no direct external benchmark match in the current audit;
- no topology-specific tolerance for
  `gypsum_board_12_5_rockwool_50_air_gap_50_concrete_100`.

The current generated case stays:

- generated id: `wall-screening-concrete`;
- dynamic family: `lined_massive_wall`;
- field `R'w = 55`;
- supported field outputs: `R'w`, `Dn,w`, `DnT,w`, `DnT,A`;
- evidence posture: `screening`.

## Next Slice

Selected next calculator slice:
`wall_timber_stud_clt_accuracy_pass_v1`.

Planning surface:
[SLICE_WALL_TIMBER_STUD_CLT_ACCURACY_PASS_PLAN.md](./SLICE_WALL_TIMBER_STUD_CLT_ACCURACY_PASS_PLAN.md).

Reason:

- `wall.timber_stud_formula.field` and `wall.clt_formula.field` are the
  next runtime candidates after heavy-core/concrete;
- both are common personal-use wall topologies;
- both need source/formula audit before any exact, family, or formula
  promotion;
- this remains higher priority than floor fallback / low-confidence
  cleanup.

## Validation

Pre-closeout baseline:

- `pnpm calculator:gate:current` green: engine 89 files / 408 tests,
  web 36 files / 170 passed + 18 skipped, build 5/5.
- Known non-fatal `sharp/@img` optional-package warnings remain.

Post-closeout validation:

- Targeted closeout contract:
  `pnpm --filter @dynecho/engine exec vitest run src/post-wall-heavy-core-concrete-gate-b-next-slice-selection-contract.test.ts --maxWorkers=1`
  - 1 file / 4 tests green.
- Focused current gate:
  `pnpm calculator:gate:current`
  - engine 90 files / 412 tests;
  - web 36 files / 170 passed + 18 skipped;
  - build 5/5.
- Broad repo gate:
  `pnpm check`
  - engine 223 files / 1232 tests;
  - web 150 files / 864 passed + 18 skipped;
  - build 5/5.
- Known non-fatal `sharp/@img` optional-package warnings remain.

Closeout evidence:

- `packages/engine/src/wall-heavy-core-concrete-gate-b-audit-contract.test.ts`
- `packages/engine/src/post-wall-heavy-core-concrete-gate-b-next-slice-selection-contract.test.ts`
