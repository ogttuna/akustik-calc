# Next Implementation Plan

Document role: tactical detail for the **active slice**. Short,
focused, agent-resume friendly. For the strategic picture read
[MASTER_PLAN.md](./MASTER_PLAN.md). For what is stable right now
read [CURRENT_STATE.md](./CURRENT_STATE.md).

Last reviewed: 2026-04-22 (post-step-7 ROI re-analysis re-selects 7b `wall_corridor_surface_value_pinning_v1` ahead of step 8).

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

- **Active slice**: `wall_corridor_surface_value_pinning_v1`
  (master-plan step 7b — inserted between closed step 7 and
  pending step 8). Selected `2026-04-22` by a post-step-7
  ROI re-analysis that concluded the corridor-surface
  VALUE-pin gap (C2 + C3 🟡 preset-only) should close
  **before** the final audit so step 8 audits a fully-green
  grid, not a documented-deferred partial. The step-7
  post-contract's "selected step 8" line is superseded (not
  erased) — post-contracts lock what CLOSED, not what MUST
  come next.
- **Plan doc**:
  [SLICE_WALL_CORRIDOR_SURFACE_VALUE_PINNING_PLAN.md](./SLICE_WALL_CORRIDOR_SURFACE_VALUE_PINNING_PLAN.md)
  (authored 2026-04-22).
- **Scope**: ~162 new numerical pins on 6 wall selector
  corridor families × 3 contexts × 9 outputs. Files live
  alongside existing `dynamic-airborne-wall-selector-trace-matrix.test.ts`
  which currently carries narrative + partial VALUE pins (3
  outputs only). Dimension C (workbench card surface) is
  optional stretch.
- **After 7b closes**: `good_calculator_final_audit_v1`
  (master-plan step 8) — now genuinely audit-able on a
  fully-green grid.
- **Previous slice closed 2026-04-22** —
  `mixed_floor_wall_edge_case_hardening_v1` landed 8 atomic
  commits bringing the engine wall torture surface to 6/6
  preset parity, a 32-assertion cross-mode torture matrix,
  and two same-material-split regression guards that
  surfaced + fixed two real engine accuracy bugs (F1 masonry
  calibrator, F2 catalog-match).

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
5. [SLICE_WALL_CORRIDOR_SURFACE_VALUE_PINNING_PLAN.md](./SLICE_WALL_CORRIDOR_SURFACE_VALUE_PINNING_PLAN.md)
   — tactical plan for the active slice (step 7b, authored
   2026-04-22).
6. Previous slice plan (closed 2026-04-22, reference only):
   `docs/archive/handoffs/SLICE_MIXED_FLOOR_WALL_EDGE_CASE_HARDENING_PLAN.md`.
7. Run `pnpm calculator:gate:current` — confirm green baseline
   (5/5 tasks).
8. Start from the first un-landed deliverable in the slice
   plan's Atomic Order section.
