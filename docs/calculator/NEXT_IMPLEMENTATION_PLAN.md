# Next Implementation Plan

Document role: tactical detail for the **active slice**. Short,
focused, agent-resume friendly. For the strategic picture read
[MASTER_PLAN.md](./MASTER_PLAN.md). For what is stable right now read
[CURRENT_STATE.md](./CURRENT_STATE.md). For the private-use readiness
chain read
[PERSONAL_USE_READINESS_ROADMAP.md](./PERSONAL_USE_READINESS_ROADMAP.md).

Last reviewed: 2026-04-27
(`wall_heavy_core_concrete_gate_b_v1` closed no-runtime;
`wall_timber_stud_clt_accuracy_pass_v1` selected;
see
`CHECKPOINT_2026-04-27_WALL_HEAVY_CORE_CONCRETE_GATE_B_CLOSEOUT_HANDOFF.md`).

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
- **Latest plan/implementation reconciliation**: 2026-04-27 review
  closed heavy-core/concrete no-runtime and selected
  `wall_timber_stud_clt_accuracy_pass_v1`.
  `packages/engine/src/post-wall-heavy-core-concrete-gate-b-next-slice-selection-contract.test.ts`
  records that decision and keeps exact/source/productization
  boundaries closed.
- **Deferred but not cancelled**:
  `project_access_policy_route_integration_v1`. Do not resume
  productization until the selected calculator slice closes or priority
  explicitly changes.

## Immediate Execution Order

Gate A of `wall_timber_stud_clt_accuracy_pass_v1` should now proceed in
this order:

1. Re-read
   [SLICE_WALL_TIMBER_STUD_CLT_ACCURACY_PASS_PLAN.md](./SLICE_WALL_TIMBER_STUD_CLT_ACCURACY_PASS_PLAN.md).
2. Audit generated `wall-timber-stud` and `wall-clt-local` with no
   runtime change: current values, dynamic family, strategy, support,
   confidence, warnings, exact/source non-match, and visible card
   evidence.
3. Separate timber exact/source opportunities from the live generated
   timber formula lane. Do not promote direct timber or resilient-bar
   source rows by adjacency.
4. Separate CLT wall formula evidence from floor CLT exact/source
   truth. Do not borrow floor rows as wall exact rows.
5. Pick the first Gate B target: timber stud, CLT wall, or no-runtime
   closeout if neither has defensible source/formula support.
6. Add focused engine tests for the selected runtime contract before
   changing math; add web tests only if card/warning/support posture
   changes.
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
