# Next Implementation Plan

Document role: tactical detail for the **active slice**. Short,
focused, agent-resume friendly. For the strategic picture read
[MASTER_PLAN.md](./MASTER_PLAN.md). For what is stable right now read
[CURRENT_STATE.md](./CURRENT_STATE.md). For the private-use readiness
chain read
[PERSONAL_USE_READINESS_ROADMAP.md](./PERSONAL_USE_READINESS_ROADMAP.md).

Last reviewed: 2026-04-27
(`wall_timber_stud_clt_accuracy_pass_v1` Gate C closed no-runtime;
`floor_fallback_low_confidence_cleanup_v1` selected next;
see
`CHECKPOINT_2026-04-27_WALL_TIMBER_STUD_CLT_GATE_C_CLOSEOUT_HANDOFF.md`).

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
  `floor_fallback_low_confidence_cleanup_v1`.
- **Planning surface**:
  [SLICE_FLOOR_FALLBACK_LOW_CONFIDENCE_CLEANUP_PLAN.md](./SLICE_FLOOR_FALLBACK_LOW_CONFIDENCE_CLEANUP_PLAN.md).
- **Personal-use readiness roadmap**:
  [PERSONAL_USE_READINESS_ROADMAP.md](./PERSONAL_USE_READINESS_ROADMAP.md)
  fixes the remaining calculator-priority chain as floor
  fallback/low-confidence cleanup, then UI/input/output honesty.
  Heavy-core/concrete remains screening and timber stud + CLT wall
  remain formula-owned until new source evidence appears.
- **Just closed**: `dynamic_airborne_split_refactor_v2` Gate C.
  Gate B carved eleven correction guards into
  `dynamic-airborne-correction-guards.ts`; `dynamic-airborne.ts` is now
  1793 lines, below the 2000-line C6 threshold.
- **Latest broad validation**: 2026-04-27 `pnpm check` is green after
  timber stud + CLT wall Gate C no-runtime closeout and floor fallback
  cleanup selection: engine 227 files / 1248 tests, web 150 files / 864
  passed + 18 skipped through `tools/dev/run-web-vitest.ts`, build 5/5,
  with only the known non-fatal `sharp/@img` optional-package warnings.
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
- **Latest plan/implementation reconciliation**: 2026-04-27
  `wall_timber_stud_clt_accuracy_pass_v1` closed no-runtime at Gate C.
  `packages/engine/src/wall-timber-stud-gate-b-source-contract.test.ts`
  keeps generated `wall-timber-stud` at lab `Rw=50`, field `R'w=42`,
  low-confidence `stud_wall_system`, and blocks exact/benchmark
  promotion because no source/formula unlock matches the live stack.
  Direct timber exact rows are single-board only, resilient exact rows
  require explicit side-count/acoustic-board topology, the direct
  double-board row is only a secondary benchmark, and linked holdouts
  are steel-framed companions.
  `packages/engine/src/wall-clt-gate-b-source-contract.test.ts` keeps
  generated `wall-clt-local` at lab `Rw=42`, field `R'w=41`,
  medium-confidence `laminated_single_leaf`, and blocks exact/source
  promotion because no verified exact/lab-fallback match or
  wall-specific CLT source row exists. Dataholz CLT rows stay floor
  source truth, and the current laminated lane stays formula-owned.
  `packages/engine/src/post-wall-timber-stud-clt-gate-c-next-slice-selection-contract.test.ts`
  closes the slice and selects
  `floor_fallback_low_confidence_cleanup_v1`.
- **Deferred but not cancelled**:
  `project_access_policy_route_integration_v1`. Do not resume
  productization until the selected calculator slice closes or priority
  explicitly changes.

## Immediate Execution Order

`floor_fallback_low_confidence_cleanup_v1` should now proceed in this
order:

1. Re-read
   [SLICE_FLOOR_FALLBACK_LOW_CONFIDENCE_CLEANUP_PLAN.md](./SLICE_FLOOR_FALLBACK_LOW_CONFIDENCE_CLEANUP_PLAN.md).
2. Add a no-runtime Gate A engine contract for
   `floor.steel_fallback_low_confidence.field` / generated
   `floor-steel-fallback`. Pin current lab/field values, supported and
   unsupported outputs, `low_confidence` estimate posture, origin basis,
   warnings, exact/bound near misses, and source precedence.
3. Add or update a focused web contract only if Gate A finds that the
   visible route/card posture is stale or misleading. Existing card
   coverage must keep "low-confidence fallback" visible.
4. Change runtime only if Gate A names an exact source row, bounded
   family rule, or fail-closed correction with explicit tolerance and
   exact-row precedence.
5. Keep `GDMTXA04A`, `C11c`, raw bare open-box/open-web impact,
   heavy-core concrete, wall selector, timber-stud, and CLT wall
   follow-ups closed unless new evidence deliberately selects them.
6. Run targeted tests, `pnpm calculator:gate:current`, and
   `git diff --check`; run broad `pnpm check` before closing this
   slice or after user-visible/runtime changes.

## Personal-Use Readiness Chain

These are the calculator priorities before calling the project ready for
private day-to-day use:

1. Floor fallback / low-confidence cleanup.
2. UI / input / output honesty pass.

Do not resume productization ahead of this chain unless priority
explicitly changes.

## Latest Closed Slices

See [CURRENT_STATE.md](./CURRENT_STATE.md) "Latest Closed Slices" table.
`wall_timber_stud_clt_accuracy_pass_v1` is now closed and
`floor_fallback_low_confidence_cleanup_v1` is the selected active
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
