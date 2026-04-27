# Next Implementation Plan

Document role: tactical detail for the **active slice**. Short,
focused, agent-resume friendly. For the strategic picture read
[MASTER_PLAN.md](./MASTER_PLAN.md). For what is stable right now read
[CURRENT_STATE.md](./CURRENT_STATE.md). For the private-use readiness
chain read
[PERSONAL_USE_READINESS_ROADMAP.md](./PERSONAL_USE_READINESS_ROADMAP.md).

Last reviewed: 2026-04-27
(`wall_timber_stud_clt_accuracy_pass_v1` Gate A landed no-runtime;
timber-stud Gate B selected first;
see
`CHECKPOINT_2026-04-27_WALL_TIMBER_STUD_CLT_GATE_A_HANDOFF.md`).

---

## Primary Objective

The calculator exists to predict `Rw`, `R'w`, `Ln,w`, `DnT,w`, and
related values across realistic floor / wall layer combinations with:

- the broadest defensible coverage, and
- the highest defensible accuracy,

at the same time. Coverage gained at the cost of accuracy is a
regression. Every slice obeys the accuracy-preservation contract in
`MASTER_PLAN.md` §6.

## Planning Model

For every next slice decision:

1. Widen only inside corridors that are benchmark-backed,
   source-anchored, or formula-owned.
2. Pair widening with a tightening pass on the same family when the
   widened lane still relies on low-confidence blending.
3. Re-rank blocked families only after the current corridor is both
   broader and numerically honest.

## Now

- **Active slice**:
  `wall_timber_stud_clt_accuracy_pass_v1`.
- **Planning surface**:
  [SLICE_WALL_TIMBER_STUD_CLT_ACCURACY_PASS_PLAN.md](./SLICE_WALL_TIMBER_STUD_CLT_ACCURACY_PASS_PLAN.md).
- **Personal-use readiness roadmap**:
  [PERSONAL_USE_READINESS_ROADMAP.md](./PERSONAL_USE_READINESS_ROADMAP.md)
  fixes the remaining calculator-priority chain as timber stud + CLT
  wall accuracy, floor fallback/low-confidence cleanup, then
  UI/input/output honesty. Heavy-core/concrete remains screening until
  new source evidence appears.
- **Just closed**: `dynamic_airborne_split_refactor_v2` Gate C.
  Gate B carved eleven correction guards into
  `dynamic-airborne-correction-guards.ts`; `dynamic-airborne.ts` is now
  1793 lines, below the 2000-line C6 threshold.
- **Latest broad validation**: 2026-04-27 `pnpm check` is green after
  heavy-core/concrete Gate B no-runtime closeout and timber+CLT
  selection: engine 223 files / 1232 tests, web 150 files / 864 passed
  + 18 skipped through `tools/dev/run-web-vitest.ts`, build 5/5, with
  only the known non-fatal `sharp/@img` optional-package warnings.
- **Gate A result**:
  `packages/engine/src/realistic-layer-combination-coverage-cartography.test.ts`
  landed no-runtime. It executes 29 representative floor/wall cells and
  maps evidence tier, support/card posture, output coverage, origin,
  confidence, invariants, and candidate type.
- **Heavy-core/concrete closeout**: Gate B closed no-runtime for
  `wall.concrete_heavy_core_screening.field`. The no-runtime
  source/formula audit found no exact catalog row, no direct external
  benchmark match in the current audit, and no topology-specific
  tolerance for the selected concrete lining stack. Evidence remains
  `screening`.
- **Latest plan/implementation reconciliation**: 2026-04-27 Gate A
  landed no-runtime for the timber stud + CLT wall pass.
  `packages/engine/src/wall-timber-stud-clt-gate-a-audit-contract.test.ts`
  pins generated `wall-timber-stud` at lab `Rw=50`, field `R'w=42`,
  low-confidence `stud_wall_system`, with no verified exact,
  lab-fallback, or landed timber exact-row topology match. It also pins
  generated `wall-clt-local` at lab `Rw=42`, field `R'w=41`,
  medium-confidence `laminated_single_leaf`, with no verified exact,
  lab-fallback, or floor CLT source-truth import. Gate B starts with
  `wall.timber_stud_formula.field`.
- **Deferred but not cancelled**:
  `project_access_policy_route_integration_v1`. Do not resume
  productization until the selected calculator slice closes or priority
  explicitly changes.

## Immediate Execution Order

Gate A of `wall_timber_stud_clt_accuracy_pass_v1` is complete. Gate B
should now proceed in this order:

1. Re-read
   [SLICE_WALL_TIMBER_STUD_CLT_ACCURACY_PASS_PLAN.md](./SLICE_WALL_TIMBER_STUD_CLT_ACCURACY_PASS_PLAN.md).
2. Start Gate B with `wall.timber_stud_formula.field`, not CLT. The
   reason is executable in
   `wall-timber-stud-clt-gate-a-audit-contract.test.ts`: timber rank 2
   precedes CLT rank 3, timber is low-confidence, and the source corpus
   is nearby but not exact for the live generated stack.
3. Add a focused engine runtime/source contract for the generated
   `wall-timber-stud` stack before changing math. It must pin current
   lab/field values, exact-row non-match, warning/confidence posture,
   and exact/benchmark precedence.
4. Only change runtime if the contract names one of:
   an exact matching source row, a documented formula-owned timber rule,
   or a bounded family rule with explicit tolerance. Do not retune from
   adjacency to direct single-board or resilient-bar rows alone.
5. Add web tests only if visible card status, warning text, support, or
   output origin changes.
6. After timber Gate B closes, run the same source/formula discipline on
   `wall.clt_formula.field`; do not borrow floor CLT rows as wall exact
   truth.
7. Run targeted tests, `pnpm calculator:gate:current`, and
   `git diff --check`. Use broad `pnpm check` before Gate C closeout.

## Personal-Use Readiness Chain

These are the calculator priorities before calling the project ready for
private day-to-day use:

1. Timber stud + CLT wall accuracy pass.
2. Floor fallback / low-confidence cleanup.
3. UI / input / output honesty pass.

Do not resume productization ahead of this chain unless priority
explicitly changes.

## Latest Closed Slices

See [CURRENT_STATE.md](./CURRENT_STATE.md) "Latest Closed Slices" table.
`dynamic_airborne_split_refactor_v2` is now closed and
`wall_timber_stud_clt_accuracy_pass_v1` is the selected active
follow-up.

## Deferred Follow-Up Tracks

1. **Remaining dynamic-airborne recursive guard carves** — optional
   architecture backlog only. `applyLinedMassiveMasonryMonotonicFloor`,
   `applyFramedReinforcementMonotonicFloor`, and
   `applyAmbiguousFamilyBoundaryHold` still live in
   `dynamic-airborne.ts`, but C6 is closed because the file is below
   2000 lines after broad validation.
2. **Blocked source-family reopens** — `GDMTXA04A`, `C11c`, raw bare
   open-box/open-web impact, wall-selector behavior, reinforced-concrete
   reopening, and timber exact-row follow-ups remain closed unless new
   source evidence deliberately selects a source slice.
3. **Productization route integration** —
   `project_access_policy_route_integration_v1` remains deferred until a
   calculator slice closes or priority explicitly changes.
