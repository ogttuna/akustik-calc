# Slice Plan - Wall Double-Leaf Sharp/Davy Scoping v1

Status: GATE A LANDED NO-RUNTIME (opened 2026-04-27 after
`wall_single_leaf_mass_law_calibration_v1` Gate C closeout; Gate B
bounded matrix or no-runtime closeout is next)

## Objective

Prepare the next wall coverage slice for common double-leaf, stud,
double-stud, and cavity wall combinations. Gate A has now landed as a
no-runtime scoping pass: it maps the current implementation, formula
ownership, source/benchmark surfaces, and negative boundaries before
any value, confidence, output-support, evidence-tier, or route-card
movement.

The goal is to decide whether the next Gate B can safely build a
bounded runtime-candidate matrix for double-leaf / stud-cavity walls,
or whether this slice must close no-runtime until stronger source,
benchmark, or tolerance evidence exists.

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

Gate B is the next decision point. It may only move runtime values if
the Gate B contract proves a bounded, source- or formula-owned corridor.
The minimum matrix before any runtime movement:

- positive double-leaf/stud-cavity cases covering empty cavity, porous
  fill, single-stud, and double-stud;
- negative exact/catalog and exact side-count rows;
- negative direct-coupled and triple-leaf/multi-cavity shapes;
- field output support assertions for `R'w`, `Dn,w`, `DnT,w`, and
  `DnT,A`;
- reorder/split invariance rules that distinguish physically symmetric
  cases from order-sensitive cavity/stud cases;
- web route-card assertions if visible outputs or support posture move.

If Gate B cannot prove that scope, it should close no-runtime and select
the next roadmap candidate instead of widening by assumption.

## Completion Criteria

- Gate A scoping contract is green and included in
  `pnpm calculator:gate:current`.
- Gate A changes no runtime math, source posture, output support,
  confidence score, evidence tier, or route-card text.
- The Gate A contract explicitly names Gate B as bounded matrix or
  no-runtime closeout, with no value movement authorized yet.
- Gate B either lands the bounded current-value/source-tolerance matrix
  or closes the slice no-runtime.
- `NEXT_IMPLEMENTATION_PLAN.md`, `CURRENT_STATE.md`, `AGENTS.md`, this
  plan, and the latest checkpoint agree on the active selected slice.
- `pnpm calculator:gate:current` and `git diff --check` are green.

## Immediate Execution Order

1. Read the latest Gate A checkpoint:
   [CHECKPOINT_2026-04-27_WALL_DOUBLE_LEAF_SHARP_DAVY_GATE_A_HANDOFF.md](./CHECKPOINT_2026-04-27_WALL_DOUBLE_LEAF_SHARP_DAVY_GATE_A_HANDOFF.md).
2. Run `pnpm calculator:gate:current` as the baseline.
3. Add Gate B current-value matrix coverage for empty double-leaf,
   porous double-leaf, explicit single-stud, and explicit double-stud
   routes.
4. Add negative boundaries for exact/catalog rows, resilient side-count
   exact rows, timber exact/formula surfaces, single-leaf mass-law,
   lined-massive, CLT, direct-coupled, and triple-leaf/multi-cavity
   shapes.
5. Keep runtime values, formulas, output support, confidence, evidence
   text, and web route cards unchanged unless Gate B names the source
   row, benchmark envelope, formula tolerance owner, or bounded family
   rule that supports the movement.
