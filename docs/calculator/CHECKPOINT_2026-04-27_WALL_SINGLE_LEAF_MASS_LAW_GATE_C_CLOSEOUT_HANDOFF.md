# Checkpoint - Wall Single-Leaf Mass-Law Calibration Gate C Closeout

Date: 2026-04-27

Latest closed slice: `wall_single_leaf_mass_law_calibration_v1`

Next selected slice: `wall_double_leaf_sharp_davy_scoping_v1`

Next action: start Gate A no-runtime scoping for double-leaf, stud,
double-stud, and cavity wall formula applicability.

## What Changed

Gate C closed the single-leaf mass-law slice no-runtime and selected
the next wall coverage candidate:

- `packages/engine/src/post-wall-single-leaf-mass-law-calibration-v1-next-slice-selection-contract.test.ts`
- `docs/calculator/SLICE_WALL_DOUBLE_LEAF_SHARP_DAVY_SCOPING_PLAN.md`
- `tools/dev/run-calculator-current-gate.ts`

No acoustic runtime values, formulas, confidence scores, output
support, verified-catalog precedence, evidence tiers, or web route-card
text changed.

## Closeout Decision

Gate A and Gate B of `wall_single_leaf_mass_law_calibration_v1` proved
that the current unmatched single-leaf values are defensible
formula-owned estimates:

- 150 mm concrete: `R'w=53`, high confidence,
  `rigid_massive_wall`, formula evidence;
- 150 mm solid brick: `R'w=51`, medium confidence,
  `masonry_nonhomogeneous`, formula evidence;
- 150 mm generic AAC: `R'w=38`, medium confidence,
  `masonry_nonhomogeneous`, formula evidence.

Runtime movement remains blocked because no positive generic stack has
a stack-specific wall source row or bounded tolerance pack. Exact,
catalog, and lab-fallback rows still outrank the formula lane.

## Next Slice Decision

`wall_double_leaf_sharp_davy_scoping_v1` is selected because the wall
coverage roadmap ranked double-leaf / stud-cavity scoping immediately
after single-leaf mass-law calibration, and because these assemblies
are common private/internal-use combinations.

Gate A must not move runtime behavior. It must inventory the current
formula/delegate ownership and guardrails for:

- empty-cavity double-leaf walls;
- porous-filled double-leaf walls;
- single-stud and double-stud framed walls;
- Sharp vs Davy applicability;
- cavity-fill, stud metadata, leaf-count, and direct-coupling
  requirements;
- exact/catalog, resilient side-count, timber exact, single-leaf,
  lined-massive, CLT, direct-coupled, and triple-leaf negative
  boundaries.

Gate B may only proceed if Gate A proves a source-backed,
benchmark-backed, bounded, or formula-owned corridor.

## Validation

Baseline before Gate C edits:

- `pnpm calculator:gate:current` green:
  - engine 103 files / 470 tests
  - web 43 files / 211 passed + 18 skipped
  - build 5/5 with the known non-fatal `sharp/@img` warnings
  - whitespace guard clean

Post-change validation:

- targeted contract:
  `pnpm --filter @dynecho/engine exec vitest run src/post-wall-single-leaf-mass-law-calibration-v1-next-slice-selection-contract.test.ts --maxWorkers=1`
  green: 1 file / 5 tests.
- `pnpm calculator:gate:current` green:
  - engine 104 files / 475 tests
  - web 43 files / 211 passed + 18 skipped
  - build 5/5 with the known non-fatal `sharp/@img` warnings
  - whitespace guard clean

## Resume Order

1. Read this checkpoint.
2. Read [NEXT_IMPLEMENTATION_PLAN.md](./NEXT_IMPLEMENTATION_PLAN.md).
3. Read
   [SLICE_WALL_DOUBLE_LEAF_SHARP_DAVY_SCOPING_PLAN.md](./SLICE_WALL_DOUBLE_LEAF_SHARP_DAVY_SCOPING_PLAN.md).
4. Run `pnpm calculator:gate:current` before editing Gate A.
5. Add the Gate A no-runtime scoping contract for
   `wall_double_leaf_sharp_davy_scoping_v1`.

## Boundaries

- Keep `/home/ogttuna/Dev/Machinity/Acoustic2` read-only.
- Do not retune generic single-leaf concrete, masonry, or AAC values
  without a new source row or bounded tolerance pack.
- Do not change double-leaf or stud-wall runtime values during Gate A.
- Do not reopen `GDMTXA04A`, `C11c`, raw bare open-box/open-web,
  wall-selector behavior, heavy-core/concrete, timber-stud, CLT wall,
  floor fallback, or wall exact-row follow-ups from nearby green tests
  alone.
- Runtime movement in the selected double-leaf slice requires a
  bounded source/formula/tolerance contract plus route-card coverage if
  visible outputs change.
