# Checkpoint - Wall Heavy-Core Concrete Gate B Audit

Date: 2026-04-27

## Status

`realistic_layer_combination_coverage_cartography_v1` remains active.
Gate B for `wall.concrete_heavy_core_screening.field` has advanced with
a no-runtime audit contract, but no calculator runtime values have been
changed.

The executable audit lives at
`packages/engine/src/wall-heavy-core-concrete-gate-b-audit-contract.test.ts`.
It pins the selected generated candidate, the surfaces that must stay
separate, and the source/formula evidence posture before any retune.

## Audit Result

Selected generated case:
`wall-screening-concrete`.

Current field behavior:

- dynamic route: `lined_massive_wall`;
- selected method: `mass_law`;
- field `R'w = 55`;
- supported field outputs: `R'w`, `Dn,w`, `DnT,w`, and `DnT,A`;
- lab outputs: `Rw`, `STC`, `C`, and `Ctr`;
- confidence/evidence posture: still `screening`.

The audit found:

- no exact verified airborne catalog match;
- no verified airborne lab-fallback match;
- no floor-system, bound-floor, or source-catalog match for this wall
  case;
- no direct external benchmark match in the current audit;
- relevant external family candidates exist, but they are not imported
  exact rows for the selected topology;
- local mass-law curve selection, ISO 717 curve rating, field flanking
  overlay, and `Dn,w` / `DnT,w` normalization are formula components,
  not a topology-specific source row.

Blocker:
`gypsum_board_12_5_rockwool_50_air_gap_50_concrete_100` has no source
row or topology-specific tolerance in the current repo audit.

## Decision Point

The next implementation step is not a value retune from nearby green
tests. Pick one path:

1. Import or define a bounded source/family rule for the selected
   concrete lining topology, then write the runtime contract with
   target values, tolerances, origin/confidence labels, exact/benchmark
   non-drift rows, and web-card expectations.
2. Close Gate B no-runtime with the current `screening` posture, plus
   any needed user-facing honesty improvements, then continue to the
   timber stud + CLT wall accuracy pass.

Do not move to timber stud + CLT until this Gate B decision is recorded
in `NEXT_IMPLEMENTATION_PLAN.md`, `CURRENT_STATE.md`, and
`SLICE_WALL_HEAVY_CORE_CONCRETE_TIGHTENING_PLAN.md`.

## Validation

- Targeted audit contract:
  `pnpm --filter @dynecho/engine exec vitest run src/wall-heavy-core-concrete-gate-b-audit-contract.test.ts --maxWorkers=1`
  - 1 file / 4 tests green.
- Focused current gate after the audit contract:
  `pnpm calculator:gate:current`.
- Result: engine 89 files / 408 tests, web 36 files / 170 passed + 18
  skipped, build 5/5. Known non-fatal `sharp/@img` optional-package
  warnings remain.
- `git diff --check` clean; new audit/checkpoint files were also
  checked for trailing whitespace and tab characters.
