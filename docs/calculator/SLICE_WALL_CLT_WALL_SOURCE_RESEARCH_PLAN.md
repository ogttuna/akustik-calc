# Slice Plan - Wall CLT Wall Source Research v1

Status: CLOSED no-runtime at Gate C (by
`packages/engine/src/post-wall-clt-wall-source-research-v1-next-slice-selection-contract.test.ts`;
selected
`wall_lined_massive_heavy_core_source_research_v1`)

## Objective

Acquire and classify wall-specific CLT / mass-timber source or
tolerance evidence before any runtime value, confidence, support,
evidence, warning, API, or route-card movement.

The target is narrow:

- the generated `wall-clt-local` route currently stays formula-owned;
- current lab `Rw=42`, field `R'w=41`, and field-context `DnT,w=42`
  remain pinned as existing behavior;
- Dataholz CLT floor rows remain floor-system source truth only and
  must not be borrowed as wall CLT exact truth.

## Why This Slice Is Next

`wall_timber_double_board_source_research_v1` closed no-runtime at Gate
C. It found only adjacent single-board/resilient rows, one secondary
direct double-board benchmark, steel holdout context, and no named
bounded timber-stud formula tolerance owner.

The remaining wall source-catalog gaps are:

- CLT / mass-timber wall assemblies;
- lined-massive / heavy-core concrete.

CLT wall is selected first because it is a common mass-timber wall lane,
it already has a live generated route and visible workbench preset, and
the current route remains formula-owned because no wall-specific CLT row
or laminated-leaf tolerance owner is complete. That makes it the next
best source-research slice after timber double-board, without borrowing
floor CLT rows or retuning from nearby green tests.

## Non-Goals

- Do not change acoustic runtime formulas, values, confidence, support,
  evidence tiers, warnings, API behavior, or web route-card copy during
  Gate A.
- Do not borrow Dataholz floor CLT rows, floor impact rows, product
  delta rows, or report/export rows as wall CLT source truth.
- Do not promote the current `laminated_leaf_sharp_delegate` lane to
  exact or benchmark-backed confidence without a wall-specific row or
  named bounded formula tolerance.
- Do not reopen timber double-board, no-stud double-leaf, heavy-core /
  concrete, `GDMTXA04A`, `C11c`, raw open-box/open-web, wall-selector
  behavior, or exact-row follow-ups from nearby green tests alone.
- Do not add route-card copy or UI changes unless a later gate changes
  visible support/confidence/evidence/missing-input behavior and adds
  paired web tests.

## Gate A - Wall CLT Source And Laminated-Leaf Tolerance Inventory

Gate A must be executable and no-runtime. It should create
`packages/engine/src/wall-clt-wall-source-research-gate-a-contract.test.ts`
and record:

1. current live `wall-clt-local` route posture and values;
2. wall-specific CLT / mass-timber rows, if any, that match or nearly
   match the live stack;
3. CLT wall lined / decoupled rows as mounting- and side-order-bounded
   adjacent evidence;
4. Dataholz floor CLT rows as floor-only negative boundaries;
5. exact verified airborne / lab-fallback absence for the live route;
6. any documented laminated single-leaf or mass-timber wall formula
   with a bounded `Rw` / field tolerance corridor;
7. the next action: direct import, formula/tolerance gate, or no-runtime
   closeout.

Required evidence fields:

- source label, URL or local path, page/table/row locator, and retrieval
  date;
- exact layer order, CLT thickness, ply/layer makeup if available,
  density or surface mass, and local material mapping;
- mounting context, boundary conditions, lining, decoupling, air cavity,
  side order, and orientation metadata;
- reported metric (`Rw`, `R'w`, `DnT,w`, `DnT,A`, spectrum adaptation,
  lab/field context) and tolerance owner;
- explicit floor-vs-wall source scope;
- exact/bound/family/formula/screening precedence impact;
- engine value tests and web route-card tests required before any
  visible movement.

## Acceptance Rules

Gate A may select a future direct import only if:

- the source row is wall-specific CLT / mass-timber, not floor-only;
- layer order, CLT thickness, density/surface mass, mounting, lining,
  cavity/decoupling, and metric context match a live or generated wall
  topology;
- all row metadata and metric context are complete;
- the tolerance owner is named;
- negative boundaries are executable; and
- paired engine value tests plus web route-card tests are explicitly
  named for the import slice.

Gate A may select a formula/tolerance slice only if a named published
laminated single-leaf or mass-timber wall formula clearly covers the
current route and supplies a bounded tolerance corridor.

If the available material is wall-adjacent or floor-only context, Gate A
must close no-runtime and leave current behavior formula-owned.

## Implementation Reconciliation - 2026-04-28

Gate A landed and Gate C has now closed this slice no-runtime. A new
active plan exists for the selected lined-massive / heavy-core source
research slice.

Verified implementation state:

- `packages/engine/src/post-wall-timber-double-board-source-research-v1-next-slice-selection-contract.test.ts`
  selects this slice and requires Gate A no-runtime source/tolerance
  inventory.
- `packages/engine/src/wall-clt-wall-source-research-gate-a-contract.test.ts`
  now exists and lands the no-runtime Gate A inventory.
- `packages/engine/src/wall-clt-gate-b-source-contract.test.ts`
  already pins the generated `wall-clt-local` route at lab `Rw=42`,
  field `R'w=41`, field-context `DnT,w=42`, medium confidence, and
  `laminated_leaf_sharp_delegate`.
- `packages/engine/src/dataholz-clt-source-truth-audit.test.ts` and
  the floor source catalog keep Dataholz CLT rows as floor-system source
  truth, not wall CLT exact truth.
- Existing CLT source/formula tests prove the live wall route has no
  verified airborne exact match, no lab-fallback match, and no
  wall-specific source row in the current catalog.
- `packages/engine/src/wall-clt-wall-source-research-gate-a-contract.test.ts`
  selects Gate C no-runtime closeout / next-slice selection instead of
  a direct import or formula/tolerance Gate B because all available
  material remains floor-only, missing, or unbounded context.
- `packages/engine/src/post-wall-clt-wall-source-research-v1-next-slice-selection-contract.test.ts`
  closes this slice no-runtime and selects
  `wall_lined_massive_heavy_core_source_research_v1`.
- Baseline after this slice was selected: `pnpm calculator:gate:current`
  is green with engine 118 files / 549 tests, web 43 files / 211 passed
  + 18 skipped, build 5/5, and the known non-fatal `sharp/@img`
  warnings.
- Post-Gate-A focused validation: `pnpm calculator:gate:current` is
  green with engine 119 files / 554 tests, web 43 files / 211 passed +
  18 skipped, build 5/5, whitespace guard clean, and the known
  non-fatal `sharp/@img` warnings.

## Gate A Detailed Execution Record

1. Landed
   `packages/engine/src/wall-clt-wall-source-research-gate-a-contract.test.ts`
   as a no-runtime contract.
2. In that contract, pinned the current generated route by executing
   `wall-clt-local` through `calculateAssembly` in lab and field
   contexts, preserving the current lab `Rw=42`, field `R'w=41`,
   `DnT,w=42`, medium-confidence trace, supported output sets, and
   exact-match absence.
3. Classified existing CLT evidence:
   - Dataholz CLT floor exact rows as floor-only negative boundaries;
   - current `laminated_leaf_sharp_delegate` as formula-owned, not a
     source row;
   - any wall-specific or mass-timber wall rows found in repo/source
     docs as direct, adjacent, or blocked based on topology metadata;
   - report/export/product-delta evidence as non-source context.
4. Recorded the live-stack metadata that must match before any future
   import: CLT thickness, layer makeup, density/surface mass, mounting,
   boundary condition, lining/decoupling, side order, metric context,
   tolerance owner, and local material mapping.
5. Added a candidate decision matrix with one of three outcomes:
   - `direct_import_candidate` only when a wall-specific row exactly
     matches the live topology and has complete metadata, tolerance,
     protected negative boundaries, and paired engine/web tests named;
   - `formula_tolerance_gate_candidate` only when a named published CLT
     or laminated-leaf wall formula supplies a bounded tolerance
     corridor for this route;
   - `no_runtime_closeout_candidate` when all available evidence remains
     floor-only or adjacent context.
6. Current Gate A outcome: no value/support/confidence/evidence
   movement, no route-card copy movement, no import from floor CLT rows,
   and Gate C no-runtime closeout selected.
7. Added the new Gate A test file to
   `tools/dev/run-calculator-current-gate.ts` after
   `post-wall-timber-double-board-source-research-v1-next-slice-selection-contract.test.ts`.
8. Validate in this order:
   - targeted Gate A Vitest file: green with 1 file / 5 tests;
   - `pnpm calculator:gate:current`: green with engine 119 files / 554
     tests, web 43 files / 211 passed + 18 skipped, build 5/5, and
     whitespace guard clean;
   - `git diff --check`: clean.
9. Wrote the Gate A handoff checkpoint and updated
   `NEXT_IMPLEMENTATION_PLAN.md`, `CURRENT_STATE.md`, this plan, and
   `AGENTS.md` so the resume triangle agrees on Gate C no-runtime
   closeout / next-slice selection.

Gate A selected the next implementation branch explicitly:

- if it finds a complete direct wall row, select a narrow import slice
  with named engine value tests and web route-card tests;
- if it finds a named formula/tolerance owner, select a bounded Gate B
  formula/tolerance feasibility slice;
- because it found only floor-only, missing, or unbounded context,
  proceed to Gate C closeout and select the next wall source-catalog
  gap, expected to be lined-massive / heavy-core source-rule research
  unless Gate C evidence changes the ordering.

## Gate C Closeout Record

Gate C landed no-runtime in
`packages/engine/src/post-wall-clt-wall-source-research-v1-next-slice-selection-contract.test.ts`.

Closeout result:

- CLT wall remains formula-owned and medium-confidence at lab `Rw=42`,
  field `R'w=41`, field-context `DnT,w=42`, and
  `laminated_leaf_sharp_delegate`.
- Dataholz CLT rows remain floor-only source truth.
- No wall-specific CLT row or named bounded laminated-leaf tolerance
  owner is available.
- No route-card or API movement is required because visible behavior did
  not change.
- The next selected slice is
  [SLICE_WALL_LINED_MASSIVE_HEAVY_CORE_SOURCE_RESEARCH_PLAN.md](./SLICE_WALL_LINED_MASSIVE_HEAVY_CORE_SOURCE_RESEARCH_PLAN.md).
- Targeted Gate C validation is green with 1 file / 5 tests; focused
  validation is green with engine 120 files / 559 tests, web 43 files /
  211 passed + 18 skipped, build 5/5, and whitespace guard clean.

## Expected Tests

- Landed:
  `packages/engine/src/wall-clt-wall-source-research-gate-a-contract.test.ts`.
- Keep it no-runtime.
- Assert current route posture, source-candidate classification,
  floor-only negative boundaries, metadata completeness, and selected
  next action.
- Add paired web route-card tests only in a later slice that changes
  visible values, support, confidence, evidence text, or missing-input
  copy.

## Immediate Execution Order

1. Read
   [CHECKPOINT_2026-04-28_WALL_CLT_WALL_SOURCE_RESEARCH_GATE_C_CLOSEOUT_HANDOFF.md](./CHECKPOINT_2026-04-28_WALL_CLT_WALL_SOURCE_RESEARCH_GATE_C_CLOSEOUT_HANDOFF.md).
2. Continue in
   [SLICE_WALL_LINED_MASSIVE_HEAVY_CORE_SOURCE_RESEARCH_PLAN.md](./SLICE_WALL_LINED_MASSIVE_HEAVY_CORE_SOURCE_RESEARCH_PLAN.md).
3. Implement
   `packages/engine/src/wall-lined-massive-heavy-core-source-research-gate-a-contract.test.ts`
   as a no-runtime source and bounded lining-rule inventory.
4. Keep runtime values, support, confidence, evidence text, and
   route-card copy frozen.
