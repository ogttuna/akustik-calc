# Next Implementation Plan

Document role: tactical detail for the **active slice**. Short,
focused, agent-resume friendly. For the strategic picture read
[MASTER_PLAN.md](./MASTER_PLAN.md). For what is stable right now
read [CURRENT_STATE.md](./CURRENT_STATE.md).

Last reviewed: 2026-04-22 (step 7 plan doc authored).

---

## Primary Objective

The calculator exists to predict `Rw`, `R'w`, `Ln,w`, `DnT,w`
etc. across realistic floor / wall layer combinations with:

- the broadest defensible coverage, and
- the highest defensible accuracy,

at the same time. Coverage gained at the cost of accuracy is a
regression. Every slice obeys the accuracy-preservation contract
defined in `MASTER_PLAN.md` §6.

## Planning Model

For every next slice decision:

1. Widen only inside corridors that are benchmark-backed,
   source-anchored, or formula-owned.
2. Pair widening with a tightening pass on the same family when
   the widened lane still relies on low-confidence blending.
3. Re-rank blocked families only after the current corridor is
   both broader and numerically honest.

## Now

- **Active slice**: `mixed_floor_wall_edge_case_hardening_v1`
  (master-plan step 7). Selected `2026-04-21` by the
  `wall_field_continuation_value_pinning_v1` closeout.
- **Plan doc**:
  [SLICE_MIXED_FLOOR_WALL_EDGE_CASE_HARDENING_PLAN.md](./SLICE_MIXED_FLOOR_WALL_EDGE_CASE_HARDENING_PLAN.md)
  (authored 2026-04-22).
- **First implementation question — answered**: existing
  `mixed-floor-wall-*` tests cover **3** wall cases only
  (`wall-screening-concrete`, `wall-held-aac`,
  `wall-heavy-composite-hint-suppression`) against **30** floor
  cases. Masonry brick, CLT wall, LSF, and timber stud are
  absent from `ENGINE_MIXED_GENERATED_CASES`. A **gap-close
  pass lands first** (four new wall cases), then the five-overlay
  cross-mode torture matrix builds on top. See the plan doc's
  "First Implementation Question — Answered" section for full
  evidence.

## Latest Closed Slices

See [CURRENT_STATE.md](./CURRENT_STATE.md) "Latest Closed Slices"
table — six slices closed on 2026-04-21, all with explicit
post-contract tests.

## Deferred Follow-Up Tracks

Explicitly documented in
[CHECKPOINT_2026-04-21_SESSION_CLOSE_HANDOFF.md](./CHECKPOINT_2026-04-21_SESSION_CLOSE_HANDOFF.md)
"Planned But Not Done (Explicit Deferral Ledger)":

1. **`dynamic_airborne_split_refactor_v2`** — composer injection
   to finish the `dynamic-airborne.ts` split (last ~3200 lines +
   14 `apply*` guards). Blueprint in
   [DYNAMIC_AIRBORNE_CARTOGRAPHY.md](./DYNAMIC_AIRBORNE_CARTOGRAPHY.md)
   "Remaining Work Deferred" section.
2. **`wall_formula_family_widening_v1`** (master-plan step 6,
   conditional) — timber stud accuracy gap (engine Rw=31 vs
   manufacturer ~45-50). VALUE-pinned as drift guard.
3. **Dimension B corridor VALUE pins** — extend VALUE-pin
   discipline from the preset surface to the
   `dynamic-airborne-wall-selector-trace-matrix` corridors.

## Cross-Cutting Rules

Every slice under this plan obeys:

- **AP1-AP7** — accuracy preservation contract in MASTER_PLAN §6
  (pre-slice snapshot, tests lead implementation, no silent
  value changes, blocked-source posture never loosened,
  precedence stable, reorder invariance non-negotiable, broad
  validation caps every slice).
- **Frozen upstream closeouts** stay frozen.
- **Blocked-source queue** stays fail-closed unless the slice
  imports new external evidence that specifically justifies a
  reopen.
- **Agent resume triangle** (CURRENT_STATE + MASTER_PLAN + this
  file) is updated on every closed slice — drift between the
  three is the first thing to fix on resume.
- **Physical invariants** (I1 R'w ≤ Rw, I2 Dn,A ≈ Dn,w+C, I3
  DnT,w − Dn,w) stay green across every new preset / corridor /
  context added.

## Reading Path On Resume

1. [CHECKPOINT_2026-04-21_SESSION_CLOSE_HANDOFF.md](./CHECKPOINT_2026-04-21_SESSION_CLOSE_HANDOFF.md)
2. [CURRENT_STATE.md](./CURRENT_STATE.md)
3. [MASTER_PLAN.md](./MASTER_PLAN.md) §3 (state grid) + §4 (master
   sequence) + §6 (accuracy preservation contract) + §8
   (completion signals)
4. This file.
5. [SLICE_MIXED_FLOOR_WALL_EDGE_CASE_HARDENING_PLAN.md](./SLICE_MIXED_FLOOR_WALL_EDGE_CASE_HARDENING_PLAN.md)
   — tactical plan for the active slice.
6. Run `pnpm calculator:gate:current` — confirm green baseline.
7. Start from the first un-landed deliverable in the slice plan's
   Atomic Order section.
