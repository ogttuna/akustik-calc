# Slice Plan - Wall Lined Massive Heavy-Core Source Research v1

Status: CLOSED NO-RUNTIME (Gate A landed source/bounded-lining-rule
inventory; Gate C selected
`calculator_source_gap_revalidation_v2`)

## Objective

Acquire and classify wall-specific lined massive / heavy-core concrete
source rows or bounded lining-rule evidence before any runtime value,
confidence, support, evidence, warning, API, or route-card movement.

The target is narrow:

- the generated `wall-screening-concrete` route currently stays
  screening-tier;
- current lab `Rw=57`, field `R'w=55`, dynamic family
  `lined_massive_wall`, and strategy `lined_massive_blend` remain
  pinned as existing behavior;
- prior selector, deep-hybrid, workbench, and stability tests remain
  guardrails only and must not be used as runtime retune evidence.

## Why This Slice Is Next

The wall source-catalog chain has now closed no-runtime through:

- no-stud double-leaf source research;
- timber double-board source research;
- CLT / mass-timber wall source research.

The remaining high-value wall source-catalog gap is lined massive /
heavy-core concrete. It is common in renovation and internal-use
workflows, but the current route remains screening because the existing
repo evidence has no direct source row or bounded lining-rule tolerance
for the selected stack.

This slice is not a reopening of the older closed personal-use Gate B
runtime-tightening plan. It is a new source-catalog research slice that
must first prove whether new or already-local source evidence can
support a future narrow import or formula/tolerance gate.

## Non-Goals

- Do not change acoustic runtime formulas, values, confidence, support,
  evidence tiers, warnings, API behavior, or web route-card copy during
  Gate A.
- Do not promote `wall-screening-concrete`, `concrete_wall`, selector
  value pins, or deep-hybrid heavy-core rows from nearby green tests
  alone.
- Do not borrow floor heavy-concrete or reinforced-concrete source
  truth as wall lined-massive truth.
- Do not reopen heavy-concrete parity, the old closed heavy-core Gate B
  formula scope, reinforced-concrete floor reopening, wall-selector
  behavior, `GDMTXA04A`, `C11c`, or raw open-box/open-web work from
  this slice.
- Do not add route-card copy or UI changes unless a later gate changes
  visible support/confidence/evidence/missing-input behavior and adds
  paired web tests.

## Gate A - Lined Massive / Heavy-Core Source And Lining-Rule Inventory

Gate A must be executable and no-runtime. It should create
`packages/engine/src/wall-lined-massive-heavy-core-source-research-gate-a-contract.test.ts`
and record:

1. current live `wall-screening-concrete` route posture and values;
2. wall-specific lined concrete / heavy masonry source rows, if any,
   that match or nearly match the live stack;
3. manufacturer wall-lining rows as mounting-, side-order-, and
   material-bounded adjacent evidence;
4. selector, deep-hybrid, value-pin, and old Gate B audit surfaces as
   stability or baseline evidence, not direct retune truth;
5. exact verified airborne / lab-fallback absence for the live route;
6. any documented lined massive wall, heavy-core wall, ISO/Sharp/Davy,
   or manufacturer formula with a bounded `Rw` / field tolerance
   corridor;
7. the next action: direct import, formula/tolerance gate, or no-runtime
   closeout.

Required evidence fields:

- source label, URL or local path, page/table/row locator, and retrieval
  date;
- base wall material, thickness, density or surface mass, and local
  material mapping;
- lining boards, cavity depth, absorber, rails/frame/hangers/adhesive,
  side order, boundary condition, and coupling metadata;
- reported metric (`Rw`, `R'w`, `DnT,w`, `DnT,A`, spectrum adaptation,
  lab/field context) and tolerance owner;
- explicit wall-vs-floor source scope;
- exact/bound/family/formula/screening precedence impact;
- engine value tests and web route-card tests required before any
  visible movement.

## Acceptance Rules

Gate A may select a future direct import only if:

- the source row is wall-specific lined concrete / heavy masonry, not a
  floor or generic product row;
- layer order, base thickness, lining, cavity/absorber, mounting,
  coupling, side order, boundary, and metric context match a live or
  generated wall topology;
- all row metadata and metric context are complete;
- the tolerance owner is named;
- negative boundaries are executable; and
- paired engine value tests plus web route-card tests are explicitly
  named for the import slice.

Gate A may select a formula/tolerance slice only if a named published
lined massive / heavy-core wall formula or manufacturer bounded family
rule clearly covers the current route and supplies a bounded tolerance
corridor.

If the available material is adjacent, floor-only, selector-stability,
or unbounded formula context, Gate A must close no-runtime and leave
current behavior screening-tier.

## Implementation Reconciliation - 2026-04-28

Gate A landed and Gate C has now closed the selected slice no-runtime.
The next selected slice is `calculator_source_gap_revalidation_v2`.

Verified implementation state:

- `packages/engine/src/post-wall-clt-wall-source-research-v1-next-slice-selection-contract.test.ts`
  selects this slice and requires Gate A no-runtime source/tolerance
  inventory.
- `packages/engine/src/wall-lined-massive-heavy-core-source-research-gate-a-contract.test.ts`
  now exists and lands the no-runtime Gate A inventory.
- `packages/engine/src/post-wall-lined-massive-heavy-core-source-research-v1-next-slice-selection-contract.test.ts`
  now exists and closes the slice no-runtime, selecting
  `calculator_source_gap_revalidation_v2`.
- `packages/engine/src/wall-heavy-core-concrete-gate-b-audit-contract.test.ts`
  already pins the generated `wall-screening-concrete` route at lab
  `Rw=57`, field `R'w=55`, dynamic family `lined_massive_wall`, and
  `lined_massive_blend`.
- `docs/calculator/SLICE_WALL_HEAVY_CORE_CONCRETE_TIGHTENING_PLAN.md`
  is a closed older no-runtime Gate B subplan for the personal-use
  readiness chain. It remains useful baseline context, but it is not the
  active plan and does not authorize runtime retuning.
- Existing selector/deep-hybrid tests are stability and drift guards;
  Gate A must classify them as boundaries unless a future source row or
  bounded family rule names a narrower runtime slice.
- Baseline after CLT Gate A: `pnpm calculator:gate:current` is green
  with engine 119 files / 554 tests, web 43 files / 211 passed + 18
  skipped, build 5/5, whitespace guard clean, and the known non-fatal
  `sharp/@img` warnings.
- Baseline before this Gate A: `pnpm calculator:gate:current` is green
  with engine 120 files / 559 tests, web 43 files / 211 passed + 18
  skipped, build 5/5, whitespace guard clean, and the known non-fatal
  `sharp/@img` warnings.
- Post-Gate-A focused validation: `pnpm calculator:gate:current` is
  green with engine 121 files / 564 tests, web 43 files / 211 passed +
  18 skipped, build 5/5, whitespace guard clean, and the known
  non-fatal `sharp/@img` warnings.

## Gate A Detailed Execution Record

1. Landed
   `packages/engine/src/wall-lined-massive-heavy-core-source-research-gate-a-contract.test.ts`
   as a no-runtime contract.
2. In that contract, pinned the current generated route by executing
   `wall-screening-concrete` through `calculateAssembly` in lab and
   field contexts, preserving current lab `Rw=57`, field `R'w=55`,
   `DnT,w=56`, `DnT,A=54.9`, supported output sets, medium-confidence
   trace, and exact-match absence.
3. Classified existing evidence:
   - wall-specific lined concrete / heavy masonry rows as missing;
   - Knauf CC60 concrete rows as floor-only source truth;
   - manufacturer wall-lining context as adjacent and unimported;
   - ISO / Sharp / Davy / lined-massive formula context as unbounded;
   - selector value pins and deep-hybrid rows as stability boundaries;
   - `concrete_wall` as a visible screening preset, not source truth;
   - the prior heavy-core Gate B audit as frozen baseline context.
4. Current Gate A outcome: no value/support/confidence/evidence
   movement, no route-card copy movement, no import from floor or
   selector rows, and Gate C no-runtime closeout selected.
5. Added the new Gate A test file to
   `tools/dev/run-calculator-current-gate.ts` after the CLT Gate C
   closeout contract.
6. Validate in this order:
   - targeted Gate A Vitest file: green with 1 file / 5 tests;
   - `pnpm calculator:gate:current`: green with engine 121 files / 564
     tests, web 43 files / 211 passed + 18 skipped, build 5/5, and
     whitespace guard clean;
   - `git diff --check`: clean.

## Gate C Closeout Record

1. Landed
   `packages/engine/src/post-wall-lined-massive-heavy-core-source-research-v1-next-slice-selection-contract.test.ts`
   as a no-runtime Gate C closeout / next-slice selection contract.
2. Kept the current `wall-screening-concrete` route frozen at lab
   `Rw=57`, field `R'w=55`, `DnT,w=56`, `DnT,A=54.9`,
   `lined_massive_wall`, `lined_massive_blend`, medium confidence, and
   screening evidence tier.
3. Closed runtime import and formula/tolerance movement because Gate A
   found no wall-specific source row, kept Knauf CC60 rows floor-only,
   kept manufacturer lining context adjacent, and found no bounded
   lined-massive tolerance owner.
4. Selected
   [SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V2_PLAN.md](./SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V2_PLAN.md)
   so the next agent re-ranks the remaining floor/wall source and
   accuracy gaps before any runtime or productization movement.
5. Targeted Gate C validation is green with 1 file / 5 tests.
6. Post-Gate-C focused validation is green with engine 122 files / 569
   tests, web 43 files / 211 passed + 18 skipped, build 5/5, whitespace
   guard clean, and the known non-fatal `sharp/@img` warnings.

## Expected Tests

- Add:
  `packages/engine/src/wall-lined-massive-heavy-core-source-research-gate-a-contract.test.ts`.
- Keep it no-runtime.
- Assert current route posture, source-candidate classification,
  floor/selector/deep-hybrid negative boundaries, metadata
  completeness, and selected next action.
- Add paired web route-card tests only in a later slice that changes
  visible values, support, confidence, evidence text, or missing-input
  copy.

## Historical Execution Order

This slice is closed. Resume active work from
[SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V2_PLAN.md](./SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V2_PLAN.md).
