# Slice Plan - Wall Single-Leaf Mass-Law Calibration v1

Status: SELECTED (opened 2026-04-27 after
`wall_coverage_expansion_planning_v2` Gate A)

## Objective

Prepare the first runtime/source wall coverage slice after the v2 wall
inventory. The candidate is the unmatched massive single-leaf wall
lane: concrete, masonry, dense AAC, and similar solid wall assemblies
that are not already exact catalog rows and are not double-leaf,
stud/cavity, CLT, resilient-bar, or lined-massive heavy-core stacks.

The goal is broader wall coverage only where the lane is
source-backed, benchmark-backed, bounded, or formula-owned. Gate A is a
source/formula contract first; runtime values do not move until that
contract names the inputs, formula coefficients, precedence rules, and
negative cases.

## Non-Goals

- Do not change runtime values, formulas, confidence scores, output
  support, evidence tiers, or catalog precedence in Gate A.
- Do not override exact/catalog/lab-fallback rows such as resilient-bar,
  LSF, timber exact imports, or the current Porotherm single-leaf exact
  anchor.
- Do not retune `wall.concrete_heavy_core_screening.field` or the
  lined-massive heavy-core/concrete screening lane in this slice unless
  a separate contract explicitly selects it.
- Do not widen generic double-leaf, stud/cavity, CLT, or timber-stud
  lanes here. They remain separate candidates.
- Do not reopen `GDMTXA04A`, `C11c`, raw open-box/open-web,
  wall-selector behavior, reinforced-concrete reopening, or floor
  fallback from nearby green tests.

## Current Baseline

- `wall_coverage_expansion_planning_v2` Gate A closed no-runtime and
  selected this slice as the first implementable wall candidate.
- Exact/catalog and lab-fallback wall surfaces are guarded by
  `airborne-verified-catalog.test.ts`,
  `wall-resilient-bar-side-count-blind-audit.test.ts`, and web route
  matrices.
- The existing single-leaf masonry exact anchor is protected in
  `wall-formula-family-widening-audit.test.ts`.
- Heavy-core/concrete remains screening in
  `wall-heavy-core-concrete-gate-b-audit-contract.test.ts`.
- Timber stud remains low-confidence formula/source-blocked in
  `wall-timber-stud-gate-b-source-contract.test.ts`.
- CLT wall remains medium-confidence formula/source-blocked in
  `wall-clt-gate-b-source-contract.test.ts`.
- Hostile wall inputs, many-layer stress, reorder invariance, invalid
  thickness, and unsupported/missing-output honesty are already covered
  by the existing wall/raw-wall guardrail suites.

## Gate A - Source/Formula Contract

Gate A is no-runtime. It should add one executable contract that
defines:

1. the candidate layer signatures for unmatched massive single-leaf
   walls;
2. the source or formula basis for the mass-law lane, including any
   coefficient/tolerance decisions;
3. positive cases for concrete, masonry, dense AAC, and similar
   single-leaf stacks;
4. negative cases for exact/catalog rows, LSF/resilient rows, timber
   exact rows, stud/double-leaf/cavity stacks, CLT walls, and
   lined-massive heavy-core stacks;
5. precedence rules proving exact/lab-fallback/source rows win before
   the formula lane;
6. the UI/card test surface needed if values, support, confidence, or
   evidence text move in Gate B.

Suggested evidence to inspect first:

- `packages/engine/src/wall-coverage-expansion-planning-v2-gate-a-contract.test.ts`
- `packages/engine/src/wall-formula-family-widening-audit.test.ts`
- `packages/engine/src/wall-heavy-core-concrete-gate-b-audit-contract.test.ts`
- `packages/engine/src/airborne-verified-catalog.test.ts`
- `packages/engine/src/dynamic-airborne-wall-selector-value-pins.test.ts`
- `packages/engine/src/raw-wall-hostile-input-answer-matrix.test.ts`
- `apps/web/features/workbench/raw-wall-hostile-input-route-card-matrix.test.ts`
- `apps/web/features/workbench/wall-reorder-invariance-matrix.test.ts`
- `apps/web/features/workbench/wall-physical-invariants-matrix.test.ts`

## Gate B - Runtime Eligibility

Gate B may change runtime only if Gate A proves all of these:

- the target stack is a massive single leaf, not a cavity/stud,
  double-leaf, CLT, resilient-bar, exact catalog, or lined-massive
  heavy-core stack;
- exact/catalog/lab-fallback precedence stays stronger than the formula
  lane;
- the formula coefficients and tolerance are named and bounded;
- positive, negative, precedence, field-output, and UI/card tests are
  added or updated before the value movement lands.

If Gate A cannot prove those, close this slice no-runtime and select the
next candidate instead of widening by assumption.

## Completion Criteria

- A Gate A source/formula contract is green and included in
  `pnpm calculator:gate:current`.
- Runtime behavior stays unchanged until a Gate B contract permits a
  bounded change.
- `NEXT_IMPLEMENTATION_PLAN.md`, `CURRENT_STATE.md`, `AGENTS.md`, this
  plan, and the latest checkpoint agree on the active selected slice.
- `pnpm calculator:gate:current` and `git diff --check` are green.

## Immediate Execution Order

1. Run `pnpm calculator:gate:current` as the baseline.
2. Read the wall coverage Gate A contract and the evidence files listed
   above.
3. Add the no-runtime source/formula contract for unmatched massive
   single-leaf walls.
4. Only after that contract is green, decide whether Gate B may move
   runtime values or must close no-runtime.
