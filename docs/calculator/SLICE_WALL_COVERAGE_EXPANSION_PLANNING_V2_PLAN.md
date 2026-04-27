# Slice Plan - Wall Coverage Expansion Planning v2

Status: CLOSED at Gate A (2026-04-27, no runtime movement; selected
`wall_single_leaf_mass_law_calibration_v1`)

## Objective

Create an executable, current, no-runtime plan for the next wall
coverage/accuracy expansion. The goal is broader common wall layer
combination coverage without weakening numerical honesty or overriding
exact/source/benchmark precedence.

This is a planning slice first because the archived
`wall_coverage_expansion_planning_v1` predates several landed guardrails:
wall preset expansion, wall formula-family audit, resilient-bar
side-count exact rows, many-layer/reorder/invalid-thickness guards,
private-use UI honesty, and report-surface honesty.

## Non-Goals

- Do not change acoustic formulas, runtime values, confidence scores,
  output support, evidence tiers, or catalog precedence in Gate A.
- Do not reopen `GDMTXA04A`, `C11c`, raw bare open-box/open-web impact,
  or wall-selector behavior from nearby green tests.
- Do not promote heavy-core/concrete, timber stud, CLT wall, or floor
  fallback posture without a source-backed, benchmark-backed, or
  formula-owned rule and dedicated positive/negative tests.
- Do not resume productization work while this calculator slice is
  selected.

## Current Baseline

- Private/internal-use readiness is closed with visible evidence-tier
  caveats.
- Source-gap revalidation Gate A closed no-runtime:
  historical blocked-source families remain fail-closed, and no current
  blocked source candidate is runtime-eligible.
- Floor coverage is deeper than wall coverage across UBIQ, Knauf,
  Dataholz CLT, reinforced-concrete low-confidence, raw helper, exact,
  bound, and fail-closed lanes.
- Wall coverage has strong guardrails but still shallow breadth:
  presets and exact rows exist for selected archetypes, timber stud and
  CLT generated wall lanes remain formula/source-gated, and
  heavy-core/concrete remains screening.
- The old
  [WALL_COVERAGE_EXPANSION_PLAN.md](../archive/analysis/WALL_COVERAGE_EXPANSION_PLAN.md)
  is backlog context only. Its v1 status is closed and its first
  sub-slices have already landed; this v2 slice must inventory current
  implementation reality before selecting a new runtime cut.

## Gate A - Current Wall Coverage Inventory

Gate A landed no-runtime in
`packages/engine/src/wall-coverage-expansion-planning-v2-gate-a-contract.test.ts`.
It records:

1. the current wall archetype coverage map;
2. exact/source/benchmark/formula/screening ownership per archetype;
3. which common wall layer combinations still return low-confidence or
   screening answers;
4. which hostile-input, many-layer, reorder, and unsupported-output
   guards already protect new wall work;
5. the first implementable Gate B runtime/source slice, if any.

Suggested evidence to inspect:

- `packages/engine/src/wall-formula-family-widening-audit.test.ts`
- `packages/engine/src/wall-timber-stud-gate-b-source-contract.test.ts`
- `packages/engine/src/wall-clt-gate-b-source-contract.test.ts`
- `packages/engine/src/wall-heavy-core-concrete-gate-b-audit-contract.test.ts`
- `packages/engine/src/airborne-verified-catalog.test.ts`
- `packages/engine/src/wall-resilient-bar-side-count-blind-audit.test.ts`
- `apps/web/features/workbench/wall-full-preset-contract-matrix.test.ts`
- `apps/web/features/workbench/wall-live-dynamic-preset-route-card-matrix.test.ts`
- `apps/web/features/workbench/wall-resilient-bar-side-count-route-card-matrix.test.ts`
- `apps/web/features/workbench/raw-wall-hostile-input-route-card-matrix.test.ts`

## Gate A Result

The executable contract selected
`wall_single_leaf_mass_law_calibration_v1` as the first implementable
wall candidate. That selection is limited to a no-runtime Gate A
source/formula contract first:

- massive unmatched single-leaf concrete/masonry/dense-AAC style walls
  are the selected candidate family;
- exact/catalog and lab-fallback wall rows remain stronger than the
  formula lane;
- heavy-core/concrete remains screening and is not retuned here;
- timber stud and CLT walls remain source/formula-gated;
- double-leaf/stud/cavity walls remain a later Sharp/Davy scoping
  candidate.

## Candidate Order To Validate

This order is a starting hypothesis, not permission to change runtime
values without a Gate A contract:

1. `wall_single_leaf_mass_law_calibration_v1`
   - Likely highest safe coverage gain for concrete, masonry, dense AAC,
     and similar massive single-leaf walls.
   - Must not override exact AAC/masonry/catalog rows or the current
     lined-massive/heavy-core screening lanes.
2. `wall_double_leaf_sharp_davy_scoping_v1`
   - Covers common stud/double-leaf/cavity walls.
   - Needs explicit Sharp vs Davy applicability, cavity-fill handling,
     stud metadata, and negative cases for direct-coupled/triple-leaf
     stacks.
3. `wall_clt_wall_formula_or_source_tightening_v1`
   - Useful for mass-timber wall coverage.
   - Must not borrow Dataholz floor-system rows as wall exact truth.
4. `wall_timber_stud_bounded_confidence_tightening_v1`
   - Common user lane, but currently low-confidence.
   - Needs source/benchmark or bounded formula evidence before any
     value/confidence movement.
5. `wall_source_catalog_acquisition_v1`
   - Longer lead: exact wall rows from manufacturer/catalog sources.
   - Should create catalog schema only when rows are actually ready.

## Completion Criteria

- A Gate A planning contract is green and included in
  `pnpm calculator:gate:current`.
- The contract names the selected Gate B slice or explicitly keeps the
  slice in planning if no wall runtime candidate is ready.
- `NEXT_IMPLEMENTATION_PLAN.md`, `CURRENT_STATE.md`, `AGENTS.md`, this
  plan, and the latest checkpoint agree on the active selected slice.
- Runtime behavior stays unchanged during Gate A.
- `pnpm calculator:gate:current` and `git diff --check` are green.

## Immediate Execution Order

1. Closed: baseline `pnpm calculator:gate:current` was green.
2. Closed: current wall coverage and exact/formula/screening ownership
   were inventoried.
3. Closed: the Gate A planning contract was written.
4. Closed: the first next slice was selected as
   `wall_single_leaf_mass_law_calibration_v1`.
5. Continue in
   [SLICE_WALL_SINGLE_LEAF_MASS_LAW_CALIBRATION_PLAN.md](./SLICE_WALL_SINGLE_LEAF_MASS_LAW_CALIBRATION_PLAN.md).
