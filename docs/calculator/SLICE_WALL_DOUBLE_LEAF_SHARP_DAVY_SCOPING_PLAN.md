# Slice Plan - Wall Double-Leaf Sharp/Davy Scoping v1

Status: GATE C CLOSED NO-RUNTIME (opened 2026-04-27 after
`wall_single_leaf_mass_law_calibration_v1` Gate C closeout; Gate B
landed the bounded current-value/source-tolerance matrix with no
runtime movement; Gate C selected
`wall_double_leaf_source_evidence_acquisition_v1`)

## Objective

Prepare the next wall coverage slice for common double-leaf, stud,
double-stud, and cavity wall combinations. Gate A has now landed as a
no-runtime scoping pass: it maps the current implementation, formula
ownership, source/benchmark surfaces, and negative boundaries before
any value, confidence, output-support, evidence-tier, or route-card
movement.

The goal was to decide whether Gate B could safely build a bounded
runtime-candidate matrix for double-leaf / stud-cavity walls. Gate B
landed no-runtime: the current values are defensible formula-owned
estimates, but no source row, benchmark envelope, formula tolerance
owner, or bounded family rule exists to justify value movement. Gate C
then closed the slice no-runtime and selected a source-evidence
acquisition slice.

## Why This Slice Is Next

`wall_single_leaf_mass_law_calibration_v1` closed without runtime
movement. Its Gate A and Gate B proved that unmatched single-leaf
concrete, solid-brick, and generic AAC values are currently defensible
formula-owned estimates, but they cannot move without a stack-specific
source row or bounded tolerance pack.

The current wall coverage roadmap ranks double-leaf / stud-cavity
scoping immediately after single-leaf mass-law calibration. This family
is common in private/internal use and has more combinatorial risk than
single-leaf walls because cavity depth, cavity fill, stud metadata,
leaf symmetry, direct coupling, and triple-leaf shapes can change the
answer materially.

## Non-Goals

- Gate A changed no runtime values, formulas, confidence scores, output
  support, evidence tiers, or web route-card text. Gate B must keep that
  posture unless its contract names the source/tolerance basis for a
  movement.
- Do not retune generic single-leaf concrete, masonry, or AAC values
  without a new source row or bounded tolerance pack.
- Do not promote heavy-core/concrete lined-massive screening, timber
  stud, CLT wall, or floor fallback from nearby green tests.
- Do not borrow Dataholz floor CLT rows as wall CLT source truth.
- Do not reopen `GDMTXA04A`, `C11c`, raw bare open-box/open-web,
  wall-selector behavior, or reinforced-concrete follow-ups.
- Do not resume productization work while this calculator slice is
  selected unless the priority is explicitly changed.

## Current Baseline

- `wall_single_leaf_mass_law_calibration_v1` Gate C selected this
  slice no-runtime.
- `wall_coverage_expansion_planning_v2` already named
  `wall_double_leaf_sharp_davy_scoping_v1` as the next candidate after
  single-leaf mass-law calibration.
- `packages/engine/src/dynamic-airborne.ts` still owns the top-level
  dynamic airborne route selection and several correction/cap guards.
- `packages/engine/src/dynamic-airborne-cavity-topology.ts` owns cavity
  and reinforcement helpers used by double-leaf style wall routing.
- `packages/engine/src/dynamic-airborne-framed-wall.ts` owns framed
  wall and stud-wall target summaries.
- `packages/engine/src/airborne-framed-wall-benchmark.test.ts`,
  `dynamic-airborne-order-sensitivity.test.ts`, and
  `apps/web/features/workbench/dynamic-route-family-boundary-scan.test.ts`
  already provide important guardrail context for framed, double-leaf,
  double-stud, and family-boundary behavior.
- Gate A now lands in
  `packages/engine/src/wall-double-leaf-sharp-davy-scoping-gate-a-contract.test.ts`.
  It pins current field values for empty double-leaf (`R'w=46`),
  porous double-leaf without stud metadata (`R'w=41`), explicit
  single-stud (`R'w=37`), and explicit double-stud / split-cavity
  (`R'w=52`), plus lined-massive and triple-leaf negative boundaries.
- Gate B has landed in
  `packages/engine/src/wall-double-leaf-sharp-davy-scoping-gate-b-contract.test.ts`.
- Gate B pins the same four positive current-value cases plus source /
  tolerance decisions and protected boundary surfaces. Current values,
  formulas, source posture, output support, confidence, evidence tier,
  and route cards remain unchanged.
- The 2026-04-28 Gate C handoff closes this slice and selects
  [SLICE_WALL_DOUBLE_LEAF_SOURCE_EVIDENCE_ACQUISITION_PLAN.md](./SLICE_WALL_DOUBLE_LEAF_SOURCE_EVIDENCE_ACQUISITION_PLAN.md).

## Gate A - Scoping Contract

Gate A landed a no-runtime executable contract that records:

1. current representative outputs and trace posture for:
   - simple empty-cavity double-leaf wall;
   - porous-filled double-leaf wall;
   - single-stud framed wall;
   - double-stud / independent framed wall;
   - heavy or asymmetric double-leaf boundary case;
2. which delegate or formula family owns each representative stack
   today, including Sharp/Davy/double-leaf/framed-wall interactions;
3. which input metadata is required before a future value movement is
   honest: cavity depth, fill type, stud type, stud spacing, leaf mass,
   direct coupling, and leaf count;
4. negative boundaries for exact/catalog rows, resilient-bar side-count
   exact rows, timber exact rows, single-leaf mass-law stacks,
   lined-massive heavy-core stacks, CLT walls, direct-coupled leaves,
   and triple-leaf or multi-cavity shapes;
5. that Gate B may proceed to a bounded current-value candidate matrix,
   but no value may move unless source/tolerance evidence is named;
6. the paired web route-card surfaces required before any future value,
   support, confidence, evidence text, missing-input copy, or
   unsupported-output behavior changes.

Suggested first evidence to inspect:

- `packages/engine/src/post-wall-single-leaf-mass-law-calibration-v1-next-slice-selection-contract.test.ts`
- `packages/engine/src/wall-coverage-expansion-planning-v2-gate-a-contract.test.ts`
- `packages/engine/src/dynamic-airborne.ts`
- `packages/engine/src/dynamic-airborne-cavity-topology.ts`
- `packages/engine/src/dynamic-airborne-framed-wall.ts`
- `packages/engine/src/airborne-framed-wall-benchmark.test.ts`
- `packages/engine/src/dynamic-airborne-order-sensitivity.test.ts`
- `packages/engine/src/blocked-source-rank-4-wall-selector-feasibility-contract.test.ts`
- `apps/web/features/workbench/dynamic-route-family-boundary-scan.test.ts`
- `apps/web/features/workbench/wall-physical-invariants-matrix.test.ts`
- `apps/web/features/workbench/wall-reorder-invariance-matrix.test.ts`

## Gate B - Conditional Runtime Candidate Matrix

Gate B is landed no-runtime. It was allowed to move runtime values only
if the contract proved a bounded, source- or formula-owned corridor. The
landed matrix preserves these required checks:

- positive double-leaf/stud-cavity cases covering empty cavity, porous
  fill, single-stud, and double-stud;
- negative exact/catalog and exact side-count rows;
- negative direct-coupled and triple-leaf/multi-cavity shapes;
- field output support assertions for `R'w`, `Dn,w`, `DnT,w`, and
  `DnT,A`;
- reorder/split invariance rules that distinguish physically symmetric
  cases from order-sensitive cavity/stud cases;
- web route-card assertions if visible outputs or support posture move.

Gate B proved finite current behavior and protected boundaries, but did
not find source/tolerance evidence for a runtime move. Gate C closed the
slice no-runtime and selected source-evidence acquisition instead of
widening by assumption.

### Gate B Landed Result

Gate B is an executable contract, not a retune. It reuses the Gate A
positive cases, keeps runtime values unchanged, and records one
source/tolerance decision row per positive route.

### Gate B Implementation Blueprint

The implementation pass stayed no-runtime because the contract did not
name stronger source/tolerance evidence than Gate A already found. It
uses `wall-single-leaf-mass-law-calibration-gate-b-contract.test.ts` as
the closest pattern: a bounded positive matrix, a source/tolerance
decision table, explicit blocked movement, and a closeout selector.

Concrete test sections:

1. Gate metadata: record `wall_double_leaf_sharp_davy_scoping_v1`
   Gate B as a bounded current-value/source-tolerance matrix with
   `runtimeBehaviorChange=false`.
2. Positive current-value matrix: reuse the Gate A four stacks and pin
   lab `Rw` plus field `R'w`, `Dn,w`, `DnT,w`, `DnT,A`, support arrays,
   trace family, strategy, confidence, selected method, selected
   candidate `Rw`, cavity/fill metadata, and verified-source absence.
3. Source/tolerance decision table: one row per positive stack with
   `currentValueIsDefensible=true`, no direct stack source row, no
   lab-fallback source row, no bounded benchmark/tolerance package, and
   `runtimeMoveAllowedNow=false`.
4. Negative boundary matrix: keep exact/catalog, resilient side-count,
   timber exact/formula, single-leaf mass-law, lined-massive, CLT,
   direct-coupled, and triple-leaf/multi-cavity surfaces outside this
   retune lane. Use existing contract files as authority for protected
   surfaces and keep the Gate A lined-massive/triple-leaf runtime
   boundary checks executable.
5. Closeout selector: if all positive rows are finite and defensible but
   source/tolerance blockers remain, select a Gate C no-runtime closeout
   / next-slice selection contract. Do not add web route-card tests
   unless Gate B changes visible values, support, confidence, evidence
   text, or missing-input copy.

Required positive matrix:

| Case | Required assertions |
|---|---|
| Empty double-leaf, no stud metadata | lab/field values, `double_leaf` family, empty-cavity strategy, field output support, no exact/lab-fallback source row |
| Porous double-leaf, no stud metadata | lab/field values, `double_leaf` family, porous-fill strategy, field output support, no exact/lab-fallback source row |
| Explicit single-stud metadata | lab/field values, `stud_wall_system` family, framed-wall calibration strategy, narrow `double_leaf` runner-up, field output support, no exact/lab-fallback source row |
| Explicit double-stud / split-cavity metadata | lab/field values, `double_stud_system` family, double-stud calibration strategy, field output support, no exact/lab-fallback source row |

Required source/tolerance decision columns for each positive route:

- `currentValueIsDefensible`;
- `directStackSourceRow`;
- `labFallbackSourceRow`;
- `benchmarkEnvelope`;
- `formulaToleranceOwner`;
- `runtimeMoveAllowedNow`;
- `runtimeMoveBlocker`.

Required negative matrix:

- exact catalog and lab-fallback rows remain stronger than any
  double-leaf/stud formula lane;
- resilient side-count exact rows stay exact-row owned;
- timber exact/formula surfaces stay in their existing contracts;
- unmatched single-leaf mineral stacks stay under the single-leaf
  mass-law contract;
- lined-massive/heavy-core stacks remain lined-massive or screening;
- CLT wall remains formula/source-gated and must not borrow Dataholz
  floor rows;
- direct-coupled leaves must not be treated as decoupled double-leaf;
- triple-leaf / multi-cavity shapes must stay `multileaf_multicavity`.

Selected no-runtime closeout path:

- All positive routes are finite and defensible, but no source row,
  benchmark envelope, formula tolerance owner, or bounded family rule is
  present, so Gate B landed no-runtime.
- After this no-runtime Gate B, Gate C closed no-runtime and selected
  source-evidence acquisition instead of retuning from assumptions.
- If Gate B changes value, support, confidence, evidence text, or
  missing-input copy, add paired web route-card tests before closing.

## Completion Criteria

- Gate A scoping contract is green and included in
  `pnpm calculator:gate:current`.
- Gate A changes no runtime math, source posture, output support,
  confidence score, evidence tier, or route-card text.
- The Gate A contract explicitly names Gate B as bounded matrix or
  no-runtime closeout, with no value movement authorized yet.
- Gate B lands the bounded current-value/source-tolerance matrix
  no-runtime and is included in `pnpm calculator:gate:current`.
- Gate C no-runtime closeout / next-slice selection has landed in
  `packages/engine/src/post-wall-double-leaf-sharp-davy-scoping-v1-next-slice-selection-contract.test.ts`.
- `NEXT_IMPLEMENTATION_PLAN.md`, `CURRENT_STATE.md`, `AGENTS.md`, this
  plan, and the latest checkpoint agree on the active selected slice.
- `pnpm calculator:gate:current` and `git diff --check` are green
  before committing a checkpoint. Use broad `pnpm check` when runtime or
  shared surfaces change, or when the checkpoint explicitly calls for a
  full-repo gate.

## Closed Outcome

1. Gate A pinned current values, route ownership, metadata requirements,
   and negative boundaries.
2. Gate B pinned the bounded current-value/source-tolerance matrix and
   blocked runtime movement.
3. Gate C closed no-runtime in
   `packages/engine/src/post-wall-double-leaf-sharp-davy-scoping-v1-next-slice-selection-contract.test.ts`.
4. The selected next plan is
   [SLICE_WALL_DOUBLE_LEAF_SOURCE_EVIDENCE_ACQUISITION_PLAN.md](./SLICE_WALL_DOUBLE_LEAF_SOURCE_EVIDENCE_ACQUISITION_PLAN.md).
