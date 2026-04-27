# Next Implementation Plan

Document role: tactical detail for the **active slice**. Short,
focused, agent-resume friendly. For the strategic picture read
[MASTER_PLAN.md](./MASTER_PLAN.md). For what is stable right now read
[CURRENT_STATE.md](./CURRENT_STATE.md). For the private-use readiness
chain read
[PERSONAL_USE_READINESS_ROADMAP.md](./PERSONAL_USE_READINESS_ROADMAP.md).

Last reviewed: 2026-04-27
(`realistic_layer_combination_coverage_cartography_v1` Gate A landed;
heavy-core/concrete Gate B subplan added;
see
`CHECKPOINT_2026-04-27_REALISTIC_LAYER_COMBINATION_COVERAGE_CARTOGRAPHY_GATE_A_HANDOFF.md`).

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
  `realistic_layer_combination_coverage_cartography_v1`.
- **Planning surface**:
  [SLICE_REALISTIC_LAYER_COMBINATION_COVERAGE_CARTOGRAPHY_PLAN.md](./SLICE_REALISTIC_LAYER_COMBINATION_COVERAGE_CARTOGRAPHY_PLAN.md).
- **Gate B subplan**:
  [SLICE_WALL_HEAVY_CORE_CONCRETE_TIGHTENING_PLAN.md](./SLICE_WALL_HEAVY_CORE_CONCRETE_TIGHTENING_PLAN.md).
- **Personal-use readiness roadmap**:
  [PERSONAL_USE_READINESS_ROADMAP.md](./PERSONAL_USE_READINESS_ROADMAP.md)
  fixes the remaining calculator-priority chain as heavy-core/concrete
  wall, timber stud + CLT wall accuracy, floor fallback/low-confidence
  cleanup, then UI/input/output honesty.
- **Just closed**: `dynamic_airborne_split_refactor_v2` Gate C.
  Gate B carved eleven correction guards into
  `dynamic-airborne-correction-guards.ts`; `dynamic-airborne.ts` is now
  1793 lines, below the 2000-line C6 threshold.
- **Latest broad validation**: 2026-04-27 `pnpm check` is green after
  cartography Gate A and web-runner stabilization: engine 221 files /
  1224 tests, web 150 files / 864 passed + 18 skipped through
  `tools/dev/run-web-vitest.ts`, build 5/5, with only the known
  non-fatal `sharp/@img` optional-package warnings.
- **Gate A result**:
  `packages/engine/src/realistic-layer-combination-coverage-cartography.test.ts`
  landed no-runtime. It executes 29 representative floor/wall cells and
  maps evidence tier, support/card posture, output coverage, origin,
  confidence, invariants, and candidate type.
- **Next implementation action**: Gate B planning for
  `wall.concrete_heavy_core_screening.field` using
  [SLICE_WALL_HEAVY_CORE_CONCRETE_TIGHTENING_PLAN.md](./SLICE_WALL_HEAVY_CORE_CONCRETE_TIGHTENING_PLAN.md).
  Before runtime changes, name the source/formula evidence, expected
  output/card behavior, tolerances, and regression tests for the
  heavy-core/concrete wall widening/tightening lane.
- **Deferred but not cancelled**:
  `project_access_policy_route_integration_v1`. Do not resume
  productization until the selected calculator slice closes or priority
  explicitly changes.

## Immediate Execution Order

Gate B of `realistic_layer_combination_coverage_cartography_v1` should
now proceed in this order:

1. Treat Gate A as evidence, not permission to guess. The selected
   target is `wall.concrete_heavy_core_screening.field` because it is
   common, finite today, and still screening-tier.
2. Re-read the current heavy-core/concrete wall implementation path
   listed in
   [SLICE_WALL_HEAVY_CORE_CONCRETE_TIGHTENING_PLAN.md](./SLICE_WALL_HEAVY_CORE_CONCRETE_TIGHTENING_PLAN.md):
   dynamic family selection, lined massive wall handling, heavy
   composite/double-leaf guards, field output derivation, and web card
   display.
3. Find or confirm defensible evidence before runtime math changes:
   official manufacturer/system rows, source-corpus rows, a documented
   formula-owned lane, or a clearly bounded screening-to-family
   tightening rule.
4. Write the Gate B plan/contract first. It must state expected output
   support, origin/confidence posture, tolerances, and web-card behavior.
5. Implement the smallest runtime widening/tightening that improves
   honest coverage without downgrading exact/benchmark lanes.
6. Add focused engine tests for numerical behavior and support/origin
   posture; add web tests only if user-visible cards, warnings, or
   output support change.
7. Run targeted tests, `pnpm calculator:gate:current`, and
   `git diff --check`. Use broad `pnpm check` before Gate C closeout.

## Personal-Use Readiness Chain

These are the calculator priorities before calling the project ready for
private day-to-day use:

1. Heavy-core / concrete wall lane:
   `wall.concrete_heavy_core_screening.field` Gate B.
2. Timber stud + CLT wall accuracy pass.
3. Floor fallback / low-confidence cleanup.
4. UI / input / output honesty pass.

Do not resume productization ahead of this chain unless priority
explicitly changes.

## Latest Closed Slices

See [CURRENT_STATE.md](./CURRENT_STATE.md) "Latest Closed Slices" table.
`dynamic_airborne_split_refactor_v2` is now closed and
`realistic_layer_combination_coverage_cartography_v1` is the selected
active follow-up.

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
