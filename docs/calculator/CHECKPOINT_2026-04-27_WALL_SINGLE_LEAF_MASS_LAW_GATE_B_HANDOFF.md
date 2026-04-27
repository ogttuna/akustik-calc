# Checkpoint - Wall Single-Leaf Mass-Law Calibration Gate B Handoff

Date: 2026-04-27

Latest landed gate: `wall_single_leaf_mass_law_calibration_v1` Gate B

Next action inside the selected slice: Gate C no-runtime closeout and
next-slice selection.

## What Changed

Gate B landed as a no-runtime bounded runtime-candidate matrix:

- `packages/engine/src/wall-single-leaf-mass-law-calibration-gate-b-contract.test.ts`
- `tools/dev/run-calculator-current-gate.ts`

No acoustic runtime values, formulas, confidence scores, output support,
verified-catalog precedence, or web route-card text changed.

## Candidate Matrix

Gate B re-ran the three Gate A positive stacks with complete field
geometry/room metadata and pinned the current dynamic surface:

- 150 mm concrete:
  - `R'w=53`, `Dn,w=53`, `DnT,w=55`, `DnT,A=54.1`;
  - family `rigid_massive_wall`;
  - selected delegate `ks_rw_calibrated`;
  - confidence `high`.
- 150 mm generic solid brick:
  - `R'w=51`, `Dn,w=51`, `DnT,w=53`, `DnT,A=51.7`;
  - family `masonry_nonhomogeneous`;
  - selected delegate `sharp`;
  - confidence `medium`.
- 150 mm generic AAC:
  - `R'w=38`, `Dn,w=38`, `DnT,w=40`, `DnT,A=39.4`;
  - family `masonry_nonhomogeneous`;
  - strategy `masonry_nonhomogeneous_blend+aircrete_unfinished_calibration`;
  - confidence `medium`.

The matrix also pins 100/150/200 mm monotonic sensitivity for concrete,
solid brick, and generic AAC. This guards against a later retune making
ordinary thickness changes non-physical.

## Decision

Current values are treated as defensible formula-owned estimates, but
runtime movement is blocked now because none of the positive candidates
has a stack-specific wall source row or bounded tolerance pack:

- generic concrete has the KS formula basis but no single-leaf wall
  source/tolerance pack for the selected stack;
- generic solid brick has masonry-family benchmark context, but not a
  direct generic solid-brick source row;
- generic AAC has adjacent named aircrete benchmarks, but not a direct
  source row for the generic AAC placeholder.

The next step is therefore Gate C: close
`wall_single_leaf_mass_law_calibration_v1` no-runtime and select the
next candidate. Do not retune this lane unless new source evidence is
introduced deliberately.

## Validation

Baseline before edits:

- `pnpm calculator:gate:current` green:
  - engine 102 files / 465 tests
  - web 43 files / 211 passed + 18 skipped
  - build 5/5 with the known non-fatal `sharp/@img` warnings
  - whitespace guard clean

Post-change validation:

- targeted contract:
  `pnpm --filter @dynecho/engine exec vitest run src/wall-single-leaf-mass-law-calibration-gate-b-contract.test.ts --maxWorkers=1`
  green: 1 file / 5 tests.
- `pnpm calculator:gate:current` green:
  - engine 103 files / 470 tests
  - web 43 files / 211 passed + 18 skipped
  - build 5/5 with the known non-fatal `sharp/@img` warnings
  - whitespace guard clean

## Resume Order

1. Read this checkpoint.
2. Read [NEXT_IMPLEMENTATION_PLAN.md](./NEXT_IMPLEMENTATION_PLAN.md).
3. Read
   [SLICE_WALL_SINGLE_LEAF_MASS_LAW_CALIBRATION_PLAN.md](./SLICE_WALL_SINGLE_LEAF_MASS_LAW_CALIBRATION_PLAN.md).
4. Run `pnpm calculator:gate:current` before editing Gate C.
5. Add the Gate C no-runtime closeout / next-slice selection contract.

## Boundaries

- Keep `/home/ogttuna/Dev/Machinity/Acoustic2` read-only.
- Do not reopen `GDMTXA04A`, `C11c`, raw bare open-box/open-web,
  wall-selector behavior, heavy-core/concrete, timber-stud, CLT wall, or
  floor fallback from nearby green tests alone.
- Do not let exact/catalog/lab-fallback rows be overridden by the
  single-leaf mass-law lane.
- Runtime movement in this lane requires a new named source row or a
  bounded tolerance pack plus route-card coverage if visible outputs
  change.
