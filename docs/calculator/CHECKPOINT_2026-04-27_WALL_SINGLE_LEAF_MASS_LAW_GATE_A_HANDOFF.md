# Checkpoint - Wall Single-Leaf Mass-Law Calibration Gate A Handoff

Date: 2026-04-27

Latest landed gate: `wall_single_leaf_mass_law_calibration_v1` Gate A

Next action inside the selected slice: Gate B bounded runtime-candidate
matrix or no-runtime closeout.

## What Changed

Gate A landed as a no-runtime source/formula contract:

- `packages/engine/src/wall-single-leaf-mass-law-calibration-gate-a-contract.test.ts`
- `tools/dev/run-calculator-current-gate.ts`

The contract does not change acoustic runtime values, formulas,
confidence scores, output support, evidence tiers, source rows, or
precedence rules. It pins the current implementation surface that Gate B
must respect.

## Contract Scope

Gate A names the current source/formula basis:

- KS calibrated mass-law formulas in `packages/engine/src/airborne-calculator.ts`:
  - homogeneous/dense mineral: `Rw = 30.9 log10(m) - 22.2`;
  - AAC type 3: `Rw = 30.9 log10(m) - 20.2`;
  - lightweight concrete type 4: piecewise `32.6 log10(m) - 22.5`
    then `26.1 log10(m) - 8.4`;
- source-row masonry calibration functions in
  `packages/engine/src/dynamic-airborne-masonry-calibration.ts`;
- masonry/AAC benchmark ownership in
  `airborne-masonry-benchmark.test.ts`,
  `airborne-aircrete-benchmark.test.ts`, and
  `airborne-ytong-massief-benchmark.test.ts`.

Positive Gate B candidates are limited to unmatched mineral single-leaf
stacks that have one visible leaf, no cavity, no porous/gap fill, no
stud/support layers, no verified exact catalog match, and no lab
fallback match:

- 150 mm concrete: current field `R'w=53`, dynamic family
  `rigid_massive_wall`, strategy `rigid_massive_blend`;
- 150 mm generic solid brick: current field `R'w=51`, dynamic family
  `masonry_nonhomogeneous`, strategy `masonry_nonhomogeneous_blend`;
- 150 mm generic AAC: current field `R'w=38`, dynamic family
  `masonry_nonhomogeneous`, strategy
  `masonry_nonhomogeneous_blend+aircrete_unfinished_calibration`.

Exact/catalog and lab-fallback precedence stays stronger than this
formula lane:

- Silka 150 mm uses the Xella Silka lab row as field lab fallback;
- Xella D700 150 mm with 10 mm cement plaster remains an exact lab row;
- Porotherm PLS 140 with 13 mm dense plaster remains an exact lab row.

Adjacent non-target lanes are explicitly blocked from this slice:

- LSF and resilient exact catalog rows;
- timber stud and direct timber exact rows;
- CLT / laminated timber panel formula lane;
- double-leaf/cavity assemblies;
- lined-massive heavy-core/concrete screening lane.

## Next Work

Gate B must start with a bounded runtime-candidate matrix, not a retune.
For each positive Gate A stack it must decide whether current formula
values are already the honest posture or whether a source-backed /
tolerance-bounded adjustment is defensible.

Runtime movement is allowed only if Gate B adds or updates:

- positive concrete / generic masonry / generic AAC assertions;
- negative exact/catalog/lab-fallback, LSF/resilient, timber-stud, CLT,
  double-leaf/cavity, and lined-massive assertions;
- field-output support assertions for `R'w`, `Dn,w`, `DnT,w`, `DnT,A`;
- web route-card tests whenever value, support, confidence, evidence, or
  missing-input copy changes.

If that evidence is insufficient, close Gate B no-runtime and select the
next candidate instead of widening by assumption.

## Validation

Baseline before edits:

- `pnpm calculator:gate:current` green:
  - engine 101 files / 460 tests
  - web 43 files / 211 passed + 18 skipped
  - build 5/5 with the known non-fatal `sharp/@img` warnings
  - whitespace guard clean

Post-change validation:

- targeted contract:
  `pnpm --filter @dynecho/engine exec vitest run src/wall-single-leaf-mass-law-calibration-gate-a-contract.test.ts --maxWorkers=1`
  green: 1 file / 5 tests.
- `pnpm calculator:gate:current` green:
  - engine 102 files / 465 tests
  - web 43 files / 211 passed + 18 skipped
  - build 5/5 with the known non-fatal `sharp/@img` warnings
  - whitespace guard clean

## Resume Order

1. Read this checkpoint.
2. Read [NEXT_IMPLEMENTATION_PLAN.md](./NEXT_IMPLEMENTATION_PLAN.md).
3. Read
   [SLICE_WALL_SINGLE_LEAF_MASS_LAW_CALIBRATION_PLAN.md](./SLICE_WALL_SINGLE_LEAF_MASS_LAW_CALIBRATION_PLAN.md).
4. Run `pnpm calculator:gate:current` before editing Gate B.
5. Start Gate B with the bounded runtime-candidate matrix.

## Boundaries

- Keep `/home/ogttuna/Dev/Machinity/Acoustic2` read-only.
- Do not reopen `GDMTXA04A`, `C11c`, raw bare open-box/open-web,
  wall-selector behavior, heavy-core/concrete, timber-stud, CLT wall, or
  floor fallback from nearby green tests alone.
- Do not let exact/catalog/lab-fallback rows be overridden by the
  single-leaf mass-law lane.
- Runtime movement requires named source, benchmark, tolerance, and
  route-card evidence.
