# Next Implementation Plan

Document role: tactical detail for the **active slice**. Short,
focused, agent-resume friendly. For the strategic picture read
[MASTER_PLAN.md](./MASTER_PLAN.md). For what is stable right now
read [CURRENT_STATE.md](./CURRENT_STATE.md).

Last reviewed: 2026-04-22 (step 7b closed; active slice moves to step 8 `good_calculator_final_audit_v1`).

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

- **Active slice**: `good_calculator_final_audit_v1`
  (master-plan step 8). Selected `2026-04-22` by the
  `wall_corridor_surface_value_pinning_v1` closeout contract
  `post-wall-corridor-surface-value-pinning-v1-next-slice-selection-contract.test.ts`.
- **Plan doc**: NOT YET AUTHORED. Next agent writes
  `SLICE_GOOD_CALCULATOR_FINAL_AUDIT_PLAN.md` as the first
  slice action, following the shape of the five prior slice
  plan docs (archived under
  `docs/archive/handoffs/SLICE_*`).
- **Scope preview (per MASTER_PLAN step 8)**: author
  `coverage-grid-consistency.test.ts` asserting §3 grid
  rows match engine reality; verify each C1-C6 completion
  signal with an executable assertion; archive the full
  resume triangle into a session-close checkpoint; open the
  post-calculator productization roadmap (§1 non-goals:
  billing / auth / desktop app — re-enter only after the
  calculator itself is done).
- **Previous slice closed 2026-04-22** —
  `wall_corridor_surface_value_pinning_v1` landed the 6
  wall selector corridor labels × 3 contexts × 9 outputs
  VALUE-pin matrix (198 drift guards + 5 cross-cell physical
  invariants) in
  `dynamic-airborne-wall-selector-value-pins.test.ts`. C2 +
  C3 corridor surfaces flipped 🟡 → ✅ (preset + corridor
  both VALUE-pinned). No engine changes required.
- **Step 7 closed 2026-04-22** (prior slice before 7b) —
  `mixed_floor_wall_edge_case_hardening_v1` brought the
  engine wall torture surface to 6/6 preset parity, authored
  a 32-assertion cross-mode torture matrix, and surfaced +
  fixed two real engine accuracy bugs (F1 masonry calibrator,
  F2 catalog-match).

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

1. [CHECKPOINT_2026-04-22_SESSION_CLOSE_HANDOFF.md](./CHECKPOINT_2026-04-22_SESSION_CLOSE_HANDOFF.md)
   — most recent session narrative; the 2026-04-21 checkpoint
   is archived at `docs/archive/handoffs/`.
2. [CURRENT_STATE.md](./CURRENT_STATE.md)
3. [MASTER_PLAN.md](./MASTER_PLAN.md) §3 (state grid) + §4 (master
   sequence) + §6 (accuracy preservation contract) + §8
   (completion signals)
4. This file.
5. Previous slice plans (closed 2026-04-22, reference only):
   - `docs/archive/handoffs/SLICE_WALL_CORRIDOR_SURFACE_VALUE_PINNING_PLAN.md` (step 7b)
   - `docs/archive/handoffs/SLICE_MIXED_FLOOR_WALL_EDGE_CASE_HARDENING_PLAN.md` (step 7)
6. Run `pnpm calculator:gate:current` — confirm green baseline
   (5/5 tasks).
7. Author `SLICE_GOOD_CALCULATOR_FINAL_AUDIT_PLAN.md` before
   writing any implementation code for the step 8 slice.
