# Slice Plan - Wall Timber Double-Board Source Research v1

Status: SELECTED NEXT (by
`packages/engine/src/post-wall-no-stud-double-leaf-source-research-v1-next-slice-selection-contract.test.ts`;
start Gate A no-runtime)

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

Gate A must be executable and no-runtime. It should create
`packages/engine/src/wall-timber-double-board-source-research-gate-a-contract.test.ts`
and record:

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

## Expected Tests

- Add:
  `packages/engine/src/wall-timber-double-board-source-research-gate-a-contract.test.ts`.
- Keep it no-runtime.
- Assert current route posture, source-candidate classification,
  metadata completeness, negative boundaries, and the selected next
  action.
- Add paired web route-card tests only in a later slice that changes
  visible values, support, confidence, evidence text, or missing-input
  copy.

## Immediate Execution Order

1. Read
   [CHECKPOINT_2026-04-28_WALL_NO_STUD_DOUBLE_LEAF_SOURCE_RESEARCH_GATE_C_CLOSEOUT_HANDOFF.md](./CHECKPOINT_2026-04-28_WALL_NO_STUD_DOUBLE_LEAF_SOURCE_RESEARCH_GATE_C_CLOSEOUT_HANDOFF.md).
2. Run `pnpm calculator:gate:current` as the Gate A baseline.
3. Add
   `packages/engine/src/wall-timber-double-board-source-research-gate-a-contract.test.ts`
   as a no-runtime inventory.
4. Keep runtime values, support, confidence, evidence text, and
   route-card copy frozen.
5. Validate with the targeted Gate A test, `pnpm calculator:gate:current`,
   and `git diff --check`.
