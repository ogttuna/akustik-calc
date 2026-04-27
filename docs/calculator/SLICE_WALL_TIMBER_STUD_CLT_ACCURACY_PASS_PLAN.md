# Slice Plan - Wall Timber Stud + CLT Accuracy Pass

Status: ACTIVE NEXT after heavy-core/concrete Gate B no-runtime closeout

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

## First Gate

Gate A must be no-runtime.

Audit the current live surfaces before changing math:

1. Generated timber stud case `wall-timber-stud`:
   - current dynamic family and strategy;
   - supported field outputs;
   - relationship to `wall-timber-lightweight-source-corpus.ts`;
   - whether any exact imported timber row truly matches the generated
     stack and context.
2. Generated CLT wall case `wall-clt-local`:
   - current dynamic family and strategy;
   - supported field outputs;
   - which formula owns the lane;
   - why floor CLT source truth is not automatically wall CLT exact
     truth.
3. Workbench and card surfaces already covering these rows:
   - timber direct/exact route cards;
   - LSF/timber preset benchmark cards;
   - wall preset expansion benchmarks.

Gate A output should be an executable contract that states current
values, output support, source/exact non-match status, and the proposed
Gate B target. If no defended runtime move exists, close no-runtime and
keep the lane formula-owned.

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

Only start runtime implementation after Gate A answers:

- which lane is selected first: timber stud or CLT wall;
- exact current `Rw` / `R'w` / `Dn,w` / `DnT,w` values and support;
- source/formula basis and allowed dB tolerance;
- exact/benchmark rows that must not drift;
- whether web card wording, warning posture, or output support changes.

If visible card posture changes, add focused web tests. If only engine
numeric behavior changes, keep web tests out unless existing card
surfaces would misrepresent origin/confidence.

## Validation

Current selection baseline:

- targeted closeout contract: 1 file / 4 tests green;
- `pnpm calculator:gate:current`: engine 90 files / 412 tests, web 36
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
