# Next Implementation Plan

Document role: tactical detail for the **active slice**. Short,
focused, agent-resume friendly. For the strategic picture read
[MASTER_PLAN.md](./MASTER_PLAN.md). For what is stable right now
read [CURRENT_STATE.md](./CURRENT_STATE.md).

Last reviewed: 2026-04-24 (`floor_field_continuation_expansion_v1`
closed as a no-runtime audit; `floor_many_layer_stress_regression_v1`
closed as a no-runtime Gate A audit; `floor_layer_order_edit_stability_v1`
closed no-runtime; `all_caller_invalid_thickness_guard_v1` is selected
next).

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

- **Active slice**: `all_caller_invalid_thickness_guard_v1`
  (cross-cutting direct engine invalid-thickness guard). Selected
  `2026-04-24` immediately after
  `floor_layer_order_edit_stability_v1` closed as a no-runtime audit.
- **Planning surface**:
  [SLICE_ALL_CALLER_INVALID_THICKNESS_GUARD_PLAN.md](./SLICE_ALL_CALLER_INVALID_THICKNESS_GUARD_PLAN.md).
- **Calculator runtime posture**: `good_calculator_final_audit_v1`
  is closed. The final audit reconciled `MASTER_PLAN.md` §3/§8,
  added `coverage-grid-consistency.test.ts`, verified C1-C6 with
  executable assertions, added the post-final-audit contract, and
  opened the productization roadmap. The archived plan lives at
  `docs/archive/handoffs/SLICE_GOOD_CALCULATOR_FINAL_AUDIT_PLAN.md`.
- **Next implementation action**: execute Gate A of
  `all_caller_invalid_thickness_guard_v1` with no runtime change first.
  Inventory direct floor and wall engine caller behavior for `0`,
  negative, `NaN`, `Infinity`, and non-finite thicknesses. Gate B opens
  only if a direct caller can crash, emit non-finite values, leak an
  unsupported live output, or return a defended-looking answer without a
  specific invalid-thickness posture. Do not reopen `GDMTXA04A`, `C11c`,
  bare carrier source families, wall selector behavior, or formula
  scope from hostile-input adjacency. `project_access_policy_route_integration_v1`
  is deferred, not cancelled, because it does not improve acoustic
  calculation accuracy or coverage.

## Immediate Execution Order

Gate A of `all_caller_invalid_thickness_guard_v1` should now be
executed in this order:

1. Run `pnpm calculator:gate:current` as the focused baseline.
2. Add a direct engine invalid-thickness inventory across representative
   floor and wall callers.
3. Pin no crash, finite outputs, support buckets, and warning/fail-closed
   reasons for each invalid-thickness class.
4. Reopen Gate B only if Gate A proves a concrete direct-caller failure.
5. Keep `CURRENT_STATE.md`, this plan, the slice plan, and checkpoint
   docs synchronized.

## Latest Closed Slices

See [CURRENT_STATE.md](./CURRENT_STATE.md) "Latest Closed Slices"
table. `floor_layer_order_edit_stability_v1` is now the latest closed
calculator slice, and `all_caller_invalid_thickness_guard_v1` is the
selected active follow-up.

## Deferred Follow-Up Tracks

Explicitly carried forward by the final-audit contract:

Just closed: `floor_field_continuation_expansion_v1`.
Gate A pinned representative floor lab, field-between-rooms, and
building-prediction continuation surfaces in engine and web card layers.
Gate B was not required because no concrete runtime/card drift surfaced.
Gate C selected floor 50+ layer stress regression as the next operator
risk hardening slice.

Just closed: `floor_many_layer_stress_regression_v1`.
Gate A pinned representative 50+ floor stacks in engine and web card
layers without runtime change. Gate B was not required because no
concrete runtime/card drift surfaced. Gate C selected floor layer-order
edit stability as the next operator-risk audit.

Just closed: `floor_layer_order_edit_stability_v1`.
Gate A pinned explicit-role exact reorder stability, raw helper
order-sensitive support changes, and raw blocked-impact fail-closed card
posture without runtime change. Gate B was not required. Gate C selected
the all-caller invalid-thickness guard because direct engine thickness
validity remains the last explicit cross-cutting partial item in the
master-plan grid.

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
5. **Floor field continuation audit** — closed no-runtime as
   `floor_field_continuation_expansion_v1`.
6. **Floor layer-order edit stability** — closed no-runtime as
   `floor_layer_order_edit_stability_v1`; broad arbitrary floor reorder
   value invariance remains unclaimed.
7. **Standalone all-caller invalid-thickness guard** — now selected as
   `all_caller_invalid_thickness_guard_v1` for direct floor/wall engine
   callers that bypass workbench normalization.
8. **Dedicated floor 50+ layer regression** — closed no-runtime as
   `floor_many_layer_stress_regression_v1`.

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

1. [CHECKPOINT_2026-04-24_FLOOR_LAYER_ORDER_CLOSEOUT_HANDOFF.md](./CHECKPOINT_2026-04-24_FLOOR_LAYER_ORDER_CLOSEOUT_HANDOFF.md)
   — latest checkpoint: floor layer-order closed no-runtime and
   all-caller invalid-thickness guard was selected next.
2. [SLICE_ALL_CALLER_INVALID_THICKNESS_GUARD_PLAN.md](./SLICE_ALL_CALLER_INVALID_THICKNESS_GUARD_PLAN.md)
   — active slice plan; start at Gate A.
3. [CHECKPOINT_2026-04-24_FLOOR_LAYER_ORDER_GATE_A_HANDOFF.md](./CHECKPOINT_2026-04-24_FLOOR_LAYER_ORDER_GATE_A_HANDOFF.md)
   — floor layer-order Gate A inventory reference.
4. [SLICE_FLOOR_LAYER_ORDER_EDIT_STABILITY_PLAN.md](./SLICE_FLOOR_LAYER_ORDER_EDIT_STABILITY_PLAN.md)
   — closed slice reference.
5. [CHECKPOINT_2026-04-24_FLOOR_MANY_LAYER_CLOSEOUT_HANDOFF.md](./CHECKPOINT_2026-04-24_FLOOR_MANY_LAYER_CLOSEOUT_HANDOFF.md)
   — floor many-layer closeout and layer-order selection reference.
6. [CHECKPOINT_2026-04-24_FLOOR_MANY_LAYER_GATE_A_HANDOFF.md](./CHECKPOINT_2026-04-24_FLOOR_MANY_LAYER_GATE_A_HANDOFF.md)
   — floor 50+ layer Gate A inventory reference.
7. [SLICE_FLOOR_MANY_LAYER_STRESS_REGRESSION_PLAN.md](./SLICE_FLOOR_MANY_LAYER_STRESS_REGRESSION_PLAN.md)
   — closed slice reference.
8. [CHECKPOINT_2026-04-24_FLOOR_FIELD_CONTINUATION_CLOSEOUT_HANDOFF.md](./CHECKPOINT_2026-04-24_FLOOR_FIELD_CONTINUATION_CLOSEOUT_HANDOFF.md)
   — floor continuation closeout and many-layer selection reference.
9. [CHECKPOINT_2026-04-24_FLOOR_FIELD_CONTINUATION_GATE_A_HANDOFF.md](./CHECKPOINT_2026-04-24_FLOOR_FIELD_CONTINUATION_GATE_A_HANDOFF.md)
   — Gate A floor continuation inventory reference.
10. [CHECKPOINT_2026-04-24_RESILIENT_SIDE_COUNT_GATE_C_CLOSEOUT_HANDOFF.md](./CHECKPOINT_2026-04-24_RESILIENT_SIDE_COUNT_GATE_C_CLOSEOUT_HANDOFF.md)
   — previous checkpoint: Gate C exact side-count imports landed and floor
   field continuation was selected next.
11. [SLICE_FLOOR_FIELD_CONTINUATION_EXPANSION_PLAN.md](./SLICE_FLOOR_FIELD_CONTINUATION_EXPANSION_PLAN.md)
   — closed slice reference.
12. [CHECKPOINT_2026-04-24_RESILIENT_SIDE_COUNT_GATE_B_LANDED_HANDOFF.md](./CHECKPOINT_2026-04-24_RESILIENT_SIDE_COUNT_GATE_B_LANDED_HANDOFF.md)
   — Gate B explicit side-count propagation reference.
13. [CHECKPOINT_2026-04-24_RESILIENT_SIDE_COUNT_GATE_B_READY_HANDOFF.md](./CHECKPOINT_2026-04-24_RESILIENT_SIDE_COUNT_GATE_B_READY_HANDOFF.md)
   — pre-Gate-B baseline and official-source rationale.
14. [CHECKPOINT_2026-04-23_WALL_TIMBER_LIGHTWEIGHT_SOURCE_CORPUS_CLOSEOUT_HANDOFF.md](./CHECKPOINT_2026-04-23_WALL_TIMBER_LIGHTWEIGHT_SOURCE_CORPUS_CLOSEOUT_HANDOFF.md)
   — source-corpus closeout and resilient side-count next slice selection.
15. [CURRENT_STATE.md](./CURRENT_STATE.md)
16. [SLICE_WALL_RESILIENT_BAR_SIDE_COUNT_MODELING_PLAN.md](./SLICE_WALL_RESILIENT_BAR_SIDE_COUNT_MODELING_PLAN.md)
   — closed slice reference.
17. [MASTER_PLAN.md](./MASTER_PLAN.md) §3 (state grid) + §4 (master
   sequence) + §6 (accuracy preservation contract) + §8
   (completion signals)
18. [SLICE_WALL_TIMBER_LIGHTWEIGHT_SOURCE_CORPUS_PLAN.md](./SLICE_WALL_TIMBER_LIGHTWEIGHT_SOURCE_CORPUS_PLAN.md)
   — closed slice reference; Gate A/B/C landed and direct-timber exact import is closed.
19. [CHECKPOINT_2026-04-23_TEAM_ACCESS_MODEL_HANDOFF.md](./CHECKPOINT_2026-04-23_TEAM_ACCESS_MODEL_HANDOFF.md)
   — closed team-access policy model handoff, reference only.
20. [SLICE_PROJECT_ACCESS_POLICY_ROUTE_INTEGRATION_PLAN.md](./SLICE_PROJECT_ACCESS_POLICY_ROUTE_INTEGRATION_PLAN.md)
   — deferred productization route-integration slice, reference only.
21. [SLICE_TEAM_ACCESS_MODEL_PLAN.md](./SLICE_TEAM_ACCESS_MODEL_PLAN.md)
   — closed team-access policy model slice, reference only.
22. [SLICE_AUTH_SESSION_HARDENING_PLAN.md](./SLICE_AUTH_SESSION_HARDENING_PLAN.md)
   — closed auth-session hardening slice, reference only.
23. [SLICE_PROJECT_ACCESS_AUTHORIZATION_PLAN.md](./SLICE_PROJECT_ACCESS_AUTHORIZATION_PLAN.md)
   — closed productization authorization slice, reference only.
24. This file.
25. Previous calculator slice plans (closed, reference only):
   - `docs/archive/handoffs/SLICE_GOOD_CALCULATOR_FINAL_AUDIT_PLAN.md` (step 8)
   - `docs/archive/handoffs/SLICE_WALL_CORRIDOR_SURFACE_VALUE_PINNING_PLAN.md` (step 7b)
   - `docs/archive/handoffs/SLICE_MIXED_FLOOR_WALL_EDGE_CASE_HARDENING_PLAN.md` (step 7)
26. Run `pnpm calculator:gate:current` before calculator runtime
   changes. Productization slices should add their own focused app/API
   tests and use `pnpm check` when they touch shared contracts.
