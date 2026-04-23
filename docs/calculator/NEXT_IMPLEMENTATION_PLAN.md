# Next Implementation Plan

Document role: tactical detail for the **active slice**. Short,
focused, agent-resume friendly. For the strategic picture read
[MASTER_PLAN.md](./MASTER_PLAN.md). For what is stable right now
read [CURRENT_STATE.md](./CURRENT_STATE.md).

Last reviewed: 2026-04-23 (broad revalidation green;
`wall_formula_family_widening_v1` selected).

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

- **Active slice**: `wall_formula_family_widening_v1`
  (calculator accuracy/coverage re-entry). Selected `2026-04-23`
  after a green broad revalidation and the explicit priority reset to
  calculation accuracy + defensible coverage first.
- **Planning surface**:
  [SLICE_WALL_FORMULA_FAMILY_WIDENING_PLAN.md](./SLICE_WALL_FORMULA_FAMILY_WIDENING_PLAN.md).
- **Calculator runtime posture**: `good_calculator_final_audit_v1`
  is closed. The final audit reconciled `MASTER_PLAN.md` §3/§8,
  added `coverage-grid-consistency.test.ts`, verified C1-C6 with
  executable assertions, added the post-final-audit contract, and
  opened the productization roadmap. The archived plan lives at
  `docs/archive/handoffs/SLICE_GOOD_CALCULATOR_FINAL_AUDIT_PLAN.md`.
- **Next implementation action**: author the wall formula-family
  audit/anchor matrix before changing runtime values. Pin current
  `timber_stud_wall`, LSF, double-leaf empty-cavity, and lined-cavity
  outputs with trace/provenance; prove exact/catalog/benchmark
  precedence and negative cases; only then decide whether a timber-stud
  or double-leaf correction is defensible. `project_access_policy_route_integration_v1`
  is deferred, not cancelled, because it does not improve acoustic
  calculation accuracy or coverage.

## Latest Closed Slices

See [CURRENT_STATE.md](./CURRENT_STATE.md) "Latest Closed Slices"
table. `good_calculator_final_audit_v1` is the latest closed
calculator slice and has an explicit post-contract test.

## Deferred Follow-Up Tracks

Explicitly carried forward by the final-audit contract:

Active now, not deferred: `wall_formula_family_widening_v1`.
The current slice starts with an audit/anchor matrix before any runtime
formula value changes.

1. **`dynamic_airborne_split_refactor_v2`** — composer injection
   to finish the `dynamic-airborne.ts` split (last ~3200 lines +
   14 `apply*` guards). Blueprint in
   [DYNAMIC_AIRBORNE_CARTOGRAPHY.md](./DYNAMIC_AIRBORNE_CARTOGRAPHY.md)
   "Remaining Work Deferred" section.
2. **Dimension B deep-hybrid swap VALUE pins** — per-cell
   VALUE pins for the deep-hybrid swap grids remain low-ROI.
3. **Dimension C workbench card VALUE pins** — optional
   corridor card-level VALUE audit, deferred unless the final
   audit finds user-visible card drift.
4. **F3 framed-wall monotonic-floor warning drift** — cosmetic
   warning-only drift on board-layer splits; numeric outputs
   unchanged.
5. **Floor field continuation audit** — parallel floor
   integrity check, non-blocking for the closed wall final audit.
6. **Arbitrary floor reorder expansion** — not claimed by the
   final audit beyond defended floor split/parity surfaces.
7. **Standalone all-caller invalid-thickness guard** — direct
   engine hardening follow-up for floor/wall callers that bypass
   workbench normalization.
8. **Dedicated floor 50+ layer regression** — wall 50-layer
   behavior is pinned; floor stress coverage remains a future
   hardening track.

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

1. [CHECKPOINT_2026-04-23_BROAD_REVALIDATION_CALCULATOR_REFOCUS_HANDOFF.md](./CHECKPOINT_2026-04-23_BROAD_REVALIDATION_CALCULATOR_REFOCUS_HANDOFF.md)
   — broad test revalidation and calculator accuracy/coverage refocus.
2. [CURRENT_STATE.md](./CURRENT_STATE.md)
3. [SLICE_WALL_FORMULA_FAMILY_WIDENING_PLAN.md](./SLICE_WALL_FORMULA_FAMILY_WIDENING_PLAN.md)
4. [MASTER_PLAN.md](./MASTER_PLAN.md) §3 (state grid) + §4 (master
   sequence) + §6 (accuracy preservation contract) + §8
   (completion signals)
5. [CHECKPOINT_2026-04-23_TEAM_ACCESS_MODEL_HANDOFF.md](./CHECKPOINT_2026-04-23_TEAM_ACCESS_MODEL_HANDOFF.md)
   — closed team-access policy model handoff, reference only.
6. [SLICE_PROJECT_ACCESS_POLICY_ROUTE_INTEGRATION_PLAN.md](./SLICE_PROJECT_ACCESS_POLICY_ROUTE_INTEGRATION_PLAN.md)
   — deferred productization route-integration slice, reference only.
7. [SLICE_TEAM_ACCESS_MODEL_PLAN.md](./SLICE_TEAM_ACCESS_MODEL_PLAN.md)
   — closed team-access policy model slice, reference only.
8. [SLICE_AUTH_SESSION_HARDENING_PLAN.md](./SLICE_AUTH_SESSION_HARDENING_PLAN.md)
   — closed auth-session hardening slice, reference only.
9. [SLICE_PROJECT_ACCESS_AUTHORIZATION_PLAN.md](./SLICE_PROJECT_ACCESS_AUTHORIZATION_PLAN.md)
   — closed productization authorization slice, reference only.
10. This file.
11. Previous calculator slice plans (closed, reference only):
   - `docs/archive/handoffs/SLICE_GOOD_CALCULATOR_FINAL_AUDIT_PLAN.md` (step 8)
   - `docs/archive/handoffs/SLICE_WALL_CORRIDOR_SURFACE_VALUE_PINNING_PLAN.md` (step 7b)
   - `docs/archive/handoffs/SLICE_MIXED_FLOOR_WALL_EDGE_CASE_HARDENING_PLAN.md` (step 7)
12. Run `pnpm calculator:gate:current` before calculator runtime
   changes. Productization slices should add their own focused app/API
   tests and use `pnpm check` when they touch shared contracts.
