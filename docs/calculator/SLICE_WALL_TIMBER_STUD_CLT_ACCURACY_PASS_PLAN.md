# Slice Plan - Wall Timber Stud + CLT Accuracy Pass

Status: ACTIVE - timber-stud Gate B landed no-runtime; CLT Gate B next

Selected: 2026-04-27 by
`post-wall-heavy-core-concrete-gate-b-next-slice-selection-contract.test.ts`

## Objective

Improve common wall accuracy without letting exact/source rows bleed
into unmatched topologies.

This slice covers the next two wall runtime candidates from
`realistic-layer-combination-coverage-cartography.test.ts` after the
heavy-core/concrete lane closed no-runtime:

- `wall.timber_stud_formula.field`
- `wall.clt_formula.field`

Both are common personal-use wall families. Both already return finite
field outputs, but neither should claim exact or benchmark confidence
unless the selected topology has source, benchmark, formula, or bounded
family evidence.

## Gate A Result

Gate A landed no-runtime in
`packages/engine/src/wall-timber-stud-clt-gate-a-audit-contract.test.ts`.
It did not change runtime math, output support, formulas, warnings, or
web cards.

Pinned generated timber stud surface:

- generated id: `wall-timber-stud`;
- stack: `2x12.5 gypsum_board + 50 rockwool + 50 air_gap + 2x12.5
  gypsum_board`;
- lab `Rw=50`, `STC=50`, `C=0.5`, `Ctr=-4.2`;
- field `R'w=42`, `Dn,w=42`, `DnT,w=43`, `DnT,A=43.9`;
- dynamic family: `stud_wall_system`;
- strategy: `stud_surrogate_blend+framed_wall_calibration`;
- confidence: `low`, family decision `ambiguous`, runner-up
  `double_leaf`;
- supported field outputs: `R'w`, `Dn,w`, `DnT,w`, `DnT,A`;
- verified exact match: none;
- verified lab-fallback match: none;
- exact timber source-row topology match: none across the six landed
  timber exact rows.

Pinned generated CLT wall surface:

- generated id: `wall-clt-local`;
- stack: `12.5 gypsum_board + 140 clt_panel + 12.5 gypsum_board`;
- lab `Rw=42`, `STC=43`, `C=-1.1`, `Ctr=-7.1`;
- field `R'w=41`, `Dn,w=41`, `DnT,w=42`, `DnT,A=40.7`;
- dynamic family: `laminated_single_leaf`;
- strategy: `laminated_leaf_sharp_delegate`;
- confidence: `medium`;
- supported field outputs: `R'w`, `Dn,w`, `DnT,w`, `DnT,A`;
- verified exact match: none;
- verified lab-fallback match: none;
- floor-system/source truth import: none.

Gate A selected `wall.timber_stud_formula.field` as the first Gate B
target because it is rank 2 before CLT rank 3 in the cartography, is a
common personal-use wall topology, and is currently low-confidence while
nearby timber source rows exist but do not match the live generated
stack exactly.

## Gate B Execution

### Timber Stud Gate B Result

Timber-stud Gate B landed no-runtime in
`packages/engine/src/wall-timber-stud-gate-b-source-contract.test.ts`.
It did not change runtime math, output support, formulas, warnings, web
cards, or confidence class.

Decision:

- generated id: `wall-timber-stud`;
- candidate id: `wall.timber_stud_formula.field`;
- current lab `Rw=50`;
- current field `R'w=42`;
- evidence tier remains `formula`;
- confidence remains `low`;
- runtime tightening is blocked until a future change names an exact
  matching source row or a documented bounded family rule with explicit
  tolerance.

Blockers found:

- no verified airborne exact match;
- no verified airborne lab-fallback match;
- direct timber exact imports are single-board only;
- resilient timber exact imports require explicit side-count and
  acoustic-board topology;
- the direct double-board official row is a secondary benchmark, not an
  exact match for live material/fill/cavity topology;
- linked lightweight holdouts are steel-framed companions, not wood-stud
  exact truth.

### CLT Wall Gate B Next

Start the next bounded step with `wall.clt_formula.field`.

The CLT Gate B contract must pin:

- generated `wall-clt-local` current values: lab `Rw=42`, field
  `R'w=41`;
- `laminated_single_leaf` / `laminated_leaf_sharp_delegate` formula
  posture;
- no verified exact or lab-fallback match;
- no floor CLT source-truth import;
- exact/benchmark precedence and disallowed floor-row borrowing.

Only change CLT runtime if the contract names a wall-specific source
row, a documented CLT wall formula rule, or a bounded family rule with
explicit tolerance.

## Evidence Policy

Acceptable promotion evidence:

- official manufacturer/system rows with exact layers, stud/cavity
  metadata, and `Rw` / field metrics;
- existing verified airborne catalog rows only when layer and context
  signatures match the live generated case;
- a documented formula-owned CLT wall rule with explicit tolerance and
  exact-row precedence;
- a bounded family rule that improves honesty without claiming exact
  source truth.

Unacceptable promotion evidence:

- applying direct timber exact rows to the live timber preset by family
  adjacency alone;
- applying resilient-bar exact rows when side-count/connection metadata
  does not match;
- borrowing floor CLT source rows as wall CLT exact values;
- reopening heavy-core concrete, `GDMTXA04A`, `C11c`, raw bare
  open-box/open-web, wall-selector, or other blocked source families
  from nearby green tests.

## Implementation Files To Inspect

- `packages/engine/src/realistic-layer-combination-coverage-cartography.test.ts`
- `packages/engine/src/wall-timber-lightweight-source-corpus.ts`
- `packages/engine/src/wall-timber-lightweight-source-audit.test.ts`
- `packages/engine/src/airborne-verified-catalog.ts`
- `packages/engine/src/dynamic-airborne.ts`
- `packages/engine/src/dynamic-airborne-family-detection.ts`
- `apps/web/features/workbench/wall-direct-timber-exact-route-card-matrix.test.ts`
- `apps/web/features/workbench/wall-lsf-timber-stud-preset-benchmarks.test.ts`
- `apps/web/features/workbench/wall-preset-expansion-benchmarks.test.ts`

## Gate B Readiness

Gate B is ready to start for `wall.clt_formula.field`, but runtime math
remains blocked until the new CLT contract names a defensible evidence
path.

- exact current `Rw` / `R'w` / `Dn,w` / `DnT,w` values and support for
  the generated CLT stack;
- source/formula basis and allowed dB tolerance;
- exact/benchmark/floor-source rows that must not drift or bleed into
  the live wall topology;
- whether web card wording, warning posture, or output support changes.

If visible card posture changes, add focused web tests. If only engine
numeric behavior changes, keep web tests out unless existing card
surfaces would misrepresent origin/confidence.

## Validation

Current selection baseline:

- targeted closeout contract: 1 file / 4 tests green;
- targeted Gate A contract:
  `pnpm --filter @dynecho/engine exec vitest run src/wall-timber-stud-clt-gate-a-audit-contract.test.ts --maxWorkers=1`
  - 1 file / 4 tests green;
- targeted timber Gate B contract:
  `pnpm --filter @dynecho/engine exec vitest run src/wall-timber-stud-gate-b-source-contract.test.ts --maxWorkers=1`
  - 1 file / 4 tests green;
- `pnpm calculator:gate:current`: engine 92 files / 420 tests, web 36
  files / 170 passed + 18 skipped, build 5/5;
- broad `pnpm check`: engine 223 files / 1232 tests, web 150 files /
  864 passed + 18 skipped, build 5/5;
- known non-fatal `sharp/@img` optional-package warnings remain.

Minimum per change:

- targeted Gate A/Gate B engine test;
- `pnpm calculator:gate:current`;
- `git diff --check`.

Run broad `pnpm check` before closing the slice or when shared/user
visible behavior changes.
