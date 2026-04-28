# Slice Plan - Wall Timber Double-Board Source Research v1

Status: CLOSED NO-RUNTIME (by
`packages/engine/src/post-wall-no-stud-double-leaf-source-research-v1-next-slice-selection-contract.test.ts`;
Gate A landed source/tolerance inventory, Gate C selected
`wall_clt_wall_source_research_v1`)

## Objective

Acquire and classify source or tolerance evidence for the live
double-board timber-stud wall lane before any runtime value, confidence,
support, evidence, warning, API, or route-card movement.

The target is narrow:

- the generated `wall-timber-stud` route currently stays formula-owned;
- current lab `Rw=50`, field `R'w=42`, and building `DnT,w=43` remain
  pinned as existing behavior;
- direct single-board timber rows and explicit RB1/RB2 resilient rows
  are already imported where they match exact topology, but they do not
  exact-match the live double-board timber preset.

## Why This Slice Is Next

`wall_no_stud_double_leaf_source_research_v1` closed no-runtime at Gate C.
The no-stud double-leaf line remains blocked because Davy/Sharp is not
yet a local single-number tolerance owner and NRC rows are not extracted
with no-stud/no-rail proof.

The remaining wall source-catalog gaps are:

- timber double-board stud walls;
- CLT wall assemblies;
- lined-massive / heavy-core concrete.

Timber double-board is selected first because it is a common lightweight
wall lane, it already has nearby exact/source corpus evidence in the
repo, and the current live preset is still low-confidence formula. That
makes it the next best source-research slice after no-stud double-leaf,
without guessing and without reopening runtime widening from green tests
alone.

## Non-Goals

- Do not change acoustic runtime formulas, values, confidence, support,
  evidence tiers, warnings, API behavior, or web route-card copy during
  Gate A.
- Do not promote direct single-board timber rows into the double-board
  lane without exact layer and context topology.
- Do not promote resilient/proprietary timber rows unless resilient bar
  side count, acoustic-board topology, board count, cavity/fill, stud
  metadata, and tolerance are complete.
- Do not borrow CLT floor rows, product-delta rows, report/export rows,
  or steel-framed holdouts as timber double-board source truth.
- Do not reopen `GDMTXA04A`, `C11c`, raw open-box/open-web,
  wall-selector behavior, heavy-core/concrete, CLT, no-stud double-leaf,
  or exact-row follow-ups from nearby green tests alone.
- Do not add route-card copy or UI changes unless a later gate changes
  visible support/confidence/evidence/missing-input behavior and adds
  paired web tests.

## Gate A - Timber Double-Board Source And Tolerance Inventory

Gate A is executable and no-runtime. It created
`packages/engine/src/wall-timber-double-board-source-research-gate-a-contract.test.ts`
and records:

1. current live `wall-timber-stud` route posture and values;
2. direct double-board timber source rows, if any, that match or nearly
   match the live stack;
3. already-imported single-board timber exact rows as negative or
   adjacent boundaries;
4. explicit RB1/RB2 resilient rows as topology-bounded adjacent evidence;
5. linked steel/lightweight holdouts as non-timber context boundaries;
6. any documented timber-stud formula or bounded family tolerance that
   could own the current route;
7. the next action: direct import, formula/tolerance gate, or no-runtime
   closeout.

Required evidence fields:

- source label, URL or local path, page/table/row locator, and retrieval
  date;
- exact layer order, board count, board material, thicknesses, density
  or surface mass;
- stud material, stud spacing, cavity depth, fill/absorber type,
  coupling, and mounting context;
- resilient bar side count and acoustic-board topology when present;
- reported metric (`Rw`, `R'w`, `DnT,w`, `DnT,A`, spectrum adaptation,
  lab/field context) and tolerance owner;
- local material mapping confidence;
- exact/bound/family/formula/screening precedence impact;
- engine value tests and web route-card tests required before any
  visible movement.

## Acceptance Rules

Gate A may select a future direct import only if:

- the source row is a direct timber double-board wall stack;
- board count, board material, cavity/fill, stud/coupling, and
  resilient side-count metadata match a live or generated topology;
- all row metadata and metric context are complete;
- the tolerance owner is named;
- negative boundaries are executable; and
- paired engine value tests plus web route-card tests are explicitly
  named for the import slice.

Gate A may select a formula/tolerance slice only if a named published
timber-stud or lightweight-wall formula scope clearly covers the current
route and supplies a bounded tolerance corridor.

If the available material is adjacent context only, Gate A must close
no-runtime and leave current behavior formula-owned.

## Implementation Reconciliation - 2026-04-28

Gate A and Gate C have landed and the selected slice is closed
no-runtime. The new active plan is
`docs/calculator/SLICE_WALL_CLT_WALL_SOURCE_RESEARCH_PLAN.md`.

Verified implementation state:

- `packages/engine/src/post-wall-no-stud-double-leaf-source-research-v1-next-slice-selection-contract.test.ts`
  selects this slice and requires Gate A no-runtime source/tolerance
  inventory.
- `packages/engine/src/wall-timber-double-board-source-research-gate-a-contract.test.ts`
  now exists and lands the no-runtime Gate A inventory.
- `packages/engine/src/wall-timber-stud-gate-b-source-contract.test.ts`
  already pins the live generated `wall-timber-stud` route at lab
  `Rw=50`, field `R'w=42`, low confidence, and
  `stud_surrogate_blend+framed_wall_calibration`.
- `packages/engine/src/wall-timber-lightweight-source-corpus.ts`
  already contains two direct single-board timber exact imports, four
  explicit RB1/RB2 resilient timber exact imports, one direct
  double-board timber secondary benchmark, and two steel-framed linked
  holdouts.
- Existing source tests prove those rows do not exact-match the live
  double-board `gypsum_board + rockwool + air_gap + gypsum_board`
  stack, so no runtime import is currently justified from existing
  implementation alone.
- `packages/engine/src/wall-timber-double-board-source-research-gate-a-contract.test.ts`
  selects Gate C no-runtime closeout / next-slice selection instead of
  a direct import or formula/tolerance Gate B because all available
  material remains adjacent context.
- `packages/engine/src/post-wall-timber-double-board-source-research-v1-next-slice-selection-contract.test.ts`
  closes this slice no-runtime and selects
  `wall_clt_wall_source_research_v1`.
- `pnpm calculator:gate:current` is green at the baseline before Gate A
  work: engine 116 files / 539 tests, web 43 files / 211 passed + 18
  skipped, build 5/5 with the known non-fatal `sharp/@img` warnings.

## Second Planning Review Risk Controls - 2026-04-28

This review found no need for a new plan, but Gate A should guard these
failure modes explicitly:

- **Context-specific field values**: `DnT,w` is geometry-dependent.
  `wall-timber-stud-gate-b-source-contract.test.ts` pins the generated
  engine fixture with `WALL_FIELD_CONTEXT` (`2800 x 3600 mm`,
  `V=45 m3`, `RT60=0.6 s`) at `DnT,w=43`, while
  `wall-live-dynamic-preset-route-card-matrix.test.ts` pins the live
  workbench building context (`3000 x 4200 mm`, `V=55 m3`,
  `RT60=0.7 s`) at card value `44 dB`. Gate A must name the context it
  is pinning and must not treat this context difference as a drift or
  retune signal.
- **Exact-match discipline**: source candidates must be classified by
  layer signature plus `airborneContext` signature. Source labels,
  material family names, or nearby green tests are not enough to promote
  the live double-board stack.
- **Existing-corpus limit**: the current repository corpus already
  proves single-board and side-count-specific resilient rows, but it
  does not contain a live-topology direct double-board timber import.
  If Gate A does not add fresh source evidence, the expected result is
  no runtime movement.
- **Visible-surface boundary**: Gate A must not change support buckets,
  confidence, warning text, evidence text, API shape, or web route-card
  copy. Paired web route-card tests are deferred until a later gate
  deliberately changes a visible surface.
- **Closeout contract discipline**: if Gate A selects a no-runtime
  closeout rather than Gate B, add a post-selection contract such as
  `packages/engine/src/post-wall-timber-double-board-source-research-v1-next-slice-selection-contract.test.ts`
  and update `NEXT_IMPLEMENTATION_PLAN.md`, `CURRENT_STATE.md`, and the
  Gate A checkpoint in the same change.

## Gate A Detailed Execution Record

1. Landed
   `packages/engine/src/wall-timber-double-board-source-research-gate-a-contract.test.ts`
   as a no-runtime contract.
2. In that contract, pinned the current generated route by executing
   `wall-timber-stud` through `calculateAssembly` in lab and field
   contexts, preserving the current lab `Rw=50`, field `R'w=42`,
   low-confidence trace, supported output sets, context-specific
   `DnT,w` values, and exact-match absence.
3. Classified all already-landed source-corpus rows:
   - direct single-board timber exact rows as adjacent/negative
     boundaries;
   - RB1/RB2 resilient timber exact rows as topology-bounded adjacent
     evidence requiring explicit side count and acoustic-board topology;
   - the Gyproc Ireland A026025 2x15 FireLine direct double-board row as
     a secondary benchmark, not a live-stack import;
   - Knauf W111/W112 linked steel rows as non-timber holdout context.
4. Recorded the live-stack metadata that must match before any future
   import: board count, board material, board thicknesses, fill type,
   cavity depth/order, stud material, stud spacing, coupling, mounting
   context, metric context, tolerance owner, and local material mapping.
5. Added a candidate decision matrix with one of three outcomes:
   - `direct_import_candidate` only when a row exactly matches the live
     topology and has complete metadata, tolerance, protected negative
     boundaries, and paired engine/web tests named;
   - `formula_tolerance_gate_candidate` only when a named published
     timber-stud or lightweight-wall formula supplies a bounded
     tolerance corridor for this route;
   - `no_runtime_closeout_candidate` when all available evidence remains
     adjacent context.
6. Current Gate A outcome: no value/support/confidence/evidence
   movement, no route-card copy movement, no import from existing
   adjacent rows, and Gate C no-runtime closeout selected.
7. Added the new Gate A test file to
   `tools/dev/run-calculator-current-gate.ts` after
   `post-wall-no-stud-double-leaf-source-research-v1-next-slice-selection-contract.test.ts`.
8. Validate in this order:
   - targeted Gate A Vitest file;
   - `pnpm calculator:gate:current`;
   - `git diff --check`.
9. Wrote the Gate A handoff checkpoint and updated
   `NEXT_IMPLEMENTATION_PLAN.md` and `CURRENT_STATE.md` so the resume
   triangle agrees on Gate C no-runtime closeout / next-slice selection.

Gate A selected the next implementation branch explicitly:

- if it finds a complete direct row, select a narrow import slice with
  named engine value tests and web route-card tests;
- if it finds a named formula/tolerance owner, select a bounded Gate B
  formula/tolerance feasibility slice;
- because it found only adjacent context, proceed to Gate C closeout and
  select the next wall source-catalog gap, expected to be CLT wall source
  research unless Gate C evidence changes the ordering.

## Expected Tests

- Landed:
  `packages/engine/src/wall-timber-double-board-source-research-gate-a-contract.test.ts`.
- Keep it no-runtime.
- Assert current route posture, source-candidate classification,
  metadata completeness, negative boundaries, and the selected next
  action.
- Add paired web route-card tests only in a later slice that changes
  visible values, support, confidence, evidence text, or missing-input
  copy.

## Gate C Closeout Record

Gate C landed no-runtime in
`packages/engine/src/post-wall-timber-double-board-source-research-v1-next-slice-selection-contract.test.ts`.

Closeout decision:

- current timber double-board route remains formula-owned,
  low-confidence, and pinned at lab `Rw=50`, field `R'w=42`,
  generated field-context `DnT,w=43`, and workbench building-context
  `DnT,w=44`;
- no direct same-stack timber double-board source row exists;
- no named bounded timber-stud formula tolerance owner exists;
- adjacent single-board/resilient/secondary/steel evidence remains
  blocked from runtime movement;
- no support/confidence/evidence/API/route-card behavior changed.

Selected next slice:

- `wall_clt_wall_source_research_v1`;
- planning surface:
  [SLICE_WALL_CLT_WALL_SOURCE_RESEARCH_PLAN.md](./SLICE_WALL_CLT_WALL_SOURCE_RESEARCH_PLAN.md);
- first action:
  `packages/engine/src/wall-clt-wall-source-research-gate-a-contract.test.ts`
  should inventory wall-specific CLT rows, laminated-leaf
  formula/tolerance candidates, floor-only negative boundaries, and
  metadata completeness before any runtime movement.

Validation after Gate C:

- targeted Gate C test green with 1 file / 5 tests;
- `pnpm calculator:gate:current` green with engine 118 files / 549
  tests, web 43 files / 211 passed + 18 skipped, build 5/5, and the
  known non-fatal `sharp/@img` warnings;
- `git diff --check` clean.
