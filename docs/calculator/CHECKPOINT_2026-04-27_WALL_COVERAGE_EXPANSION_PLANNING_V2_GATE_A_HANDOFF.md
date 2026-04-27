# Checkpoint - Wall Coverage Expansion Planning v2 Gate A Handoff

Date: 2026-04-27

Latest closed slice: `wall_coverage_expansion_planning_v2` Gate A

Next selected slice: `wall_single_leaf_mass_law_calibration_v1`

## What Changed

Gate A landed as a no-runtime wall coverage inventory contract:

- `packages/engine/src/wall-coverage-expansion-planning-v2-gate-a-contract.test.ts`
- `tools/dev/run-calculator-current-gate.ts`

The contract records current wall coverage posture:

- exact/catalog and lab-fallback wall rows remain precedence-protected;
- the single-leaf masonry exact anchor remains protected;
- heavy-core/concrete remains screening;
- timber stud remains low-confidence formula/source-blocked;
- CLT wall remains medium-confidence formula/source-blocked;
- wall presets, route cards, hostile inputs, many-layer stress, reorder
  invariance, physical invariants, invalid thickness, and
  unsupported/missing-output honesty remain the guardrails around new
  wall work.

No acoustic runtime values, formulas, confidence scores, output support,
evidence tiers, source rows, or precedence rules changed.

## Selected Next Work

The next selected slice is:

- [SLICE_WALL_SINGLE_LEAF_MASS_LAW_CALIBRATION_PLAN.md](./SLICE_WALL_SINGLE_LEAF_MASS_LAW_CALIBRATION_PLAN.md)

Reason:

- wall coverage is still shallower than floor coverage;
- historical blocked source families remain fail-closed;
- common unmatched massive single-leaf wall stacks are the highest-ROI
  next candidate because the route is formula-owned in principle and
  can be bounded without reopening double-leaf, timber-stud, CLT, or
  heavy-core screening;
- exact/catalog and lab-fallback precedence already have guardrails, so
  the next slice can focus on a source/formula contract before any value
  movement.

## Validation

Baseline before edits:

- `pnpm calculator:gate:current` green:
  - engine 100 files / 455 tests
  - web 43 files / 211 passed + 18 skipped
  - build 5/5 with the known non-fatal `sharp/@img` warnings
  - whitespace guard clean

The focused gate delta after this slice is one new engine test file and
five planning-contract tests.

Post-change validation:

- targeted contract:
  `pnpm --filter @dynecho/engine exec vitest run src/wall-coverage-expansion-planning-v2-gate-a-contract.test.ts --maxWorkers=1`
  green: 1 file / 5 tests.
- `pnpm calculator:gate:current` green:
  - engine 101 files / 460 tests
  - web 43 files / 211 passed + 18 skipped
  - build 5/5 with the known non-fatal `sharp/@img` warnings
  - whitespace guard clean
- `pnpm check` green:
  - lint/typecheck green
  - engine 234 files / 1280 tests
  - web 155 files / 885 passed + 18 skipped
  - build 5/5 with the known non-fatal `sharp/@img` warnings

## Resume Order

1. Read this checkpoint.
2. Read [NEXT_IMPLEMENTATION_PLAN.md](./NEXT_IMPLEMENTATION_PLAN.md).
3. Read
   [SLICE_WALL_SINGLE_LEAF_MASS_LAW_CALIBRATION_PLAN.md](./SLICE_WALL_SINGLE_LEAF_MASS_LAW_CALIBRATION_PLAN.md).
4. Run `pnpm calculator:gate:current` before editing the selected wall
   single-leaf slice.
5. Start Gate A source/formula contract for
   `wall_single_leaf_mass_law_calibration_v1`.

## Boundaries

- Keep `/home/ogttuna/Dev/Machinity/Acoustic2` read-only.
- Do not reopen `GDMTXA04A`, `C11c`, raw bare open-box/open-web,
  wall-selector behavior, heavy-core/concrete, timber-stud, CLT wall, or
  floor fallback from nearby green tests alone.
- Runtime movement inside the next slice requires a named
  source-backed, benchmark-backed, bounded, or formula-owned rule plus
  positive, negative, precedence, and UI/card tests.
