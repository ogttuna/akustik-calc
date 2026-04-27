# Checkpoint - Realistic Layer Combination Coverage Cartography Gate A

Date: 2026-04-27

## Status

`realistic_layer_combination_coverage_cartography_v1` Gate A has landed
with no runtime calculator changes.

The executable matrix lives at
`packages/engine/src/realistic-layer-combination-coverage-cartography.test.ts`.
It uses live `calculateAssembly` results rather than hand-written static
tables, so future engine changes must keep the support/origin posture
honest across the mapped layer combinations.

## Matrix Shape

- 29 representative cells total.
- 14 floor cells: heavy concrete, reinforced-concrete exact/product
  formula lanes, CLT source rows, timber direct/mount rows, open-web and
  open-box rows, UBIQ exact/bound lanes, Regupol/Getzner/Pliteq product
  lanes, raw/fail-closed carriers, and steel fallback.
- 15 wall cells: masonry/AAC, CLT, light-steel stud, timber stud,
  concrete/heavy-core lined and double-leaf lanes, mixed-board
  single-board dynamic lane, resilient-bar `auto`/`one_side`/`both_sides`
  rows, and deep-hybrid representative swaps.
- Evidence tiers covered: `exact`, `benchmark`, `formula`, `family`,
  `screening`, `bound`, and `fail_closed`.
- Every cell records expected supported/unsupported output sets,
  origin/basis id or null, confidence posture, invariants, web-card
  evidence posture, and candidate type.

## Gate A Findings

Highest-ROI runtime candidate:
`wall.concrete_heavy_core_screening.field`.

Reason: it is a common wall topology, currently screening-tier, already
returns finite field outputs, and has lower source/benchmark confidence
than the nearby masonry, light-steel, resilient-bar, and exact floor
lanes. Gate B should tighten/source this lane before claiming benchmark
or exact confidence.

Runtime candidate order:

1. `wall.concrete_heavy_core_screening.field`
2. `wall.timber_stud_formula.field`
3. `wall.clt_formula.field`
4. no runtime deep-hybrid target; existing engine/web parity is already
   pinned, so those cells stay value-pin-only
5. `floor.steel_fallback_low_confidence.field`

Source-blocked rows remain blocked:

- `floor.tuas_c11c_fail_closed.field`
- `floor.dataholz_gdmtxa04a_visible_formula.field`

Gate A did not find a reason to reopen `GDMTXA04A`, `C11c`, raw bare
open-box/open-web impact, reinforced-concrete reopening, wall-selector
behavior, or timber exact-row follow-ups.

## Web Matrix Decision

No new paired web matrix was added in Gate A. Each selected cell is
already tied to an existing web/card evidence path or an engine-only
stress/cartography artifact. Gate B should add web coverage only when it
changes a user-visible card, route, warning, support bucket, or displayed
origin.

## Validation

- Targeted cartography contract:
  `pnpm --filter @dynecho/engine exec vitest run src/realistic-layer-combination-coverage-cartography.test.ts --maxWorkers=1`
  - 1 file / 3 tests green.
- Focused current gate after adding the matrix to
  `tools/dev/run-calculator-current-gate.ts`:
  engine 88 files / 404 tests, web 36 files / 170 passed + 18 skipped,
  build 5/5, whitespace guard clean.
- Broad revalidation after Gate A and web test-runner stabilization:
  `pnpm check` green. Engine broad is 221 files / 1224 tests. Web broad
  keeps 150 files in scope through `tools/dev/run-web-vitest.ts` with
  864 passed + 18 skipped. Build is 5/5.
- Known non-fatal build warnings remain the optional `sharp/@img`
  package warnings from `@turbodocx/html-to-docx`.

## Next Action

Start Gate B planning for the heavy-core/concrete wall lane. Do not
retune runtime values until the Gate B plan names the exact evidence
source, expected support/card behavior, and value/error tolerances for
the selected widening/tightening path. The detailed subplan is
[SLICE_WALL_HEAVY_CORE_CONCRETE_TIGHTENING_PLAN.md](./SLICE_WALL_HEAVY_CORE_CONCRETE_TIGHTENING_PLAN.md).
