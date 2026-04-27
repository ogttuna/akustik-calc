# Checkpoint - Wall Double-Leaf Sharp/Davy Scoping Gate A Handoff

Date: 2026-04-27

Latest landed gate: `wall_double_leaf_sharp_davy_scoping_v1` Gate A

Next action inside the selected slice: Gate B bounded candidate matrix
or no-runtime closeout decision for double-leaf / stud-cavity wall
coverage.

## What Changed

Gate A landed as a no-runtime scoping contract:

- `packages/engine/src/wall-double-leaf-sharp-davy-scoping-gate-a-contract.test.ts`
- `tools/dev/run-calculator-current-gate.ts`

No acoustic runtime values, formulas, confidence scores, output
support, evidence tiers, verified-catalog precedence, or web route-card
text changed.

## Current Representative Matrix

Gate A pins current values and trace posture for representative common
wall stacks:

- empty double-leaf wall, no stud metadata:
  - lab `Rw=48`, field `R'w=46`, `Dn,w=47`, `DnT,w=47`,
    `DnT,A=45.8`;
  - family `double_leaf`, strategy `double_leaf_empty_cavity_delegate`,
    confidence `medium`.
- porous-filled double-leaf wall, no stud metadata:
  - lab `Rw=43`, field `R'w=41`, `Dn,w=42`, `DnT,w=42`,
    `DnT,A=40.4`;
  - family `double_leaf`, strategy `double_leaf_porous_fill_corrected`,
    confidence `low`.
- explicit single-stud metadata:
  - lab `Rw=45`, field `R'w=37`, `Dn,w=38`, `DnT,w=38`,
    `DnT,A=35.9`;
  - family `stud_wall_system`,
    strategy `stud_surrogate_blend+framed_wall_calibration`,
    confidence `low`, narrow runner-up `double_leaf`.
- explicit double-stud / split-cavity metadata:
  - lab `Rw=61`, field `R'w=52`, `Dn,w=53`, `DnT,w=53`,
    `DnT,A=51.8`;
  - family `double_stud_system`,
    strategy `double_stud_surrogate_blend+double_stud_calibration`,
    confidence `medium`.

Gate A also pins two negative boundaries:

- AAC lining boundary stays `lined_massive_wall` with an ambiguous
  `double_leaf` runner-up and family-boundary hold.
- classic triple-leaf stays `multileaf_multicavity` screening, not
  double-leaf.

## Decision

Gate A selects Gate B matrix work but does not allow value movement.
Gate B must either:

- build a bounded current-value matrix for empty double-leaf,
  porous-filled double-leaf, single-stud, and double-stud routes, plus
  negative exact/catalog/resilient/timber/single-leaf/lined-massive/CLT
  and triple-leaf boundaries; or
- close the slice no-runtime if no source row, benchmark envelope,
  formula tolerance owner, or bounded family rule is defensible.

## Validation

Baseline before Gate A edits:

- `pnpm calculator:gate:current` green:
  - engine 104 files / 475 tests
  - web 43 files / 211 passed + 18 skipped
  - build 5/5 with the known non-fatal `sharp/@img` warnings
  - whitespace guard clean

Post-change validation:

- targeted contract:
  `pnpm --filter @dynecho/engine exec vitest run src/wall-double-leaf-sharp-davy-scoping-gate-a-contract.test.ts --maxWorkers=1`
  green: 1 file / 5 tests.
- `pnpm calculator:gate:current` green after runner/doc updates:
  - engine 105 files / 480 tests
  - web 43 files / 211 passed + 18 skipped
  - build 5/5 with the known non-fatal `sharp/@img` warnings
  - whitespace guard clean

## Resume Order

1. Read this checkpoint.
2. Read [NEXT_IMPLEMENTATION_PLAN.md](./NEXT_IMPLEMENTATION_PLAN.md).
3. Read
   [SLICE_WALL_DOUBLE_LEAF_SHARP_DAVY_SCOPING_PLAN.md](./SLICE_WALL_DOUBLE_LEAF_SHARP_DAVY_SCOPING_PLAN.md).
4. Run `pnpm calculator:gate:current` before editing Gate B.
5. Add Gate B bounded candidate matrix or no-runtime closeout decision.

## Boundaries

- Keep `/home/ogttuna/Dev/Machinity/Acoustic2` read-only.
- Do not change double-leaf, stud-wall, or double-stud runtime values
  during Gate B setup unless the Gate B contract first names the source
  row, benchmark envelope, tolerance owner, or bounded family rule.
- Do not merge triple-leaf/multi-cavity shapes into double-leaf.
- Do not override exact/catalog, resilient side-count, timber exact,
  single-leaf, lined-massive, or CLT boundaries.
- Do not reopen `GDMTXA04A`, `C11c`, raw bare open-box/open-web,
  wall-selector behavior, heavy-core/concrete, timber-stud, CLT wall,
  floor fallback, or wall exact-row follow-ups from nearby green tests
  alone.
