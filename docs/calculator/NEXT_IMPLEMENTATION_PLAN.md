# Next Implementation Plan

Document role: tactical detail for the **active slice**. Short,
focused, agent-resume friendly. For the strategic picture read
[MASTER_PLAN.md](./MASTER_PLAN.md). For what is stable right now
read [CURRENT_STATE.md](./CURRENT_STATE.md).

Last reviewed: 2026-04-24 (`dynamic_airborne_split_refactor_v2`
Gate B seventh carve landed and broad `pnpm check` revalidated; see
`CHECKPOINT_2026-04-24_DYNAMIC_AIRBORNE_SPLIT_V2_GATE_B_SEVENTH_CARVE_HANDOFF.md`).

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

- **Active slice**: `dynamic_airborne_split_refactor_v2`
  (calculator architecture hygiene / behavior-preserving split).
  Selected `2026-04-24` immediately after
  `all_caller_invalid_thickness_guard_v1` closed as a no-runtime audit.
- **Planning surface**:
  [SLICE_DYNAMIC_AIRBORNE_SPLIT_REFACTOR_V2_PLAN.md](./SLICE_DYNAMIC_AIRBORNE_SPLIT_REFACTOR_V2_PLAN.md).
- **Calculator runtime posture**: `good_calculator_final_audit_v1`
  is closed. The final audit reconciled `MASTER_PLAN.md` §3/§8,
  added `coverage-grid-consistency.test.ts`, verified C1-C6 with
  executable assertions, added the post-final-audit contract, and
  opened the productization roadmap. The archived plan lives at
  `docs/archive/handoffs/SLICE_GOOD_CALCULATOR_FINAL_AUDIT_PLAN.md`.
- **Next implementation action**: continue Gate B of
  `dynamic_airborne_split_refactor_v2`. The first composer-injection
  carve landed: `applyMicroGapFillEquivalenceGuard` moved into
  `dynamic-airborne-correction-guards.ts` and now receives
  `calculateDynamicAirborneResult` through `DynamicAirborneComposer`.
  The second carve moved `applyHeavyUnframedCavityScreeningCap` into the
  same module, and the third carve moved
  `applyMixedSecurityBoardDoubleStudFieldTrim`. The fourth carve moved
  `applyHighFillSingleBoardStudFieldLift`. The fifth carve moved
  `applyMixedBoardEmptyCavityFieldMidbandLift`. The sixth carve moved
  `applyMixedPremiumSplitFieldLift`. The seventh carve moved
  `applyDiamondHybridResilientFieldMidbandTrim`. Move
  `applyMixedPlainModerateSingleBoardLabTemplate` next as a separate
  non-recursive template carve. Do not reopen
  `GDMTXA04A`, `C11c`, bare carrier source families, wall selector
  behavior, or formula scope from architecture adjacency.
  `project_access_policy_route_integration_v1` is deferred, not
  cancelled, because it does not improve acoustic calculation accuracy or
  coverage.
- **Checkpoint status**: dynamic-airborne split v2 Gate A landed as a
  no-runtime planning checkpoint, Gate B first carve moved one recursive
  guard without behavior changes, Gate B second carve moved one
  non-recursive cap guard, and Gate B third carve moved one
  non-recursive field-trim guard. Gate B fourth carve moved one
  non-recursive field-lift guard. Gate B fifth carve moved another
  non-recursive field-lift guard. Gate B sixth carve moved one more
  non-recursive field-lift guard. Gate B seventh carve moved one
  non-recursive field-trim guard. Pre-edit `pnpm calculator:gate:current`
  was green (engine 85 files / 391 tests, web 36 files / 170 passed +
  18 skipped, build 5/5, whitespace guard clean; known non-fatal
  `sharp/@img` warnings only). Post-seventh-carve targeted contract,
  focused behavior sweep, engine lint/typecheck,
  `pnpm calculator:gate:current`, post-build web typecheck, and
  `git diff --check` are green. The follow-up broad audit also passed
  `pnpm check`: engine 219 files / 1216 tests, web 150 files / 864
  passed + 18 skipped, build 5/5, same known non-fatal `sharp/@img`
  warnings only. Current focused gate shape: engine 86 files /
  396 tests, web 36 files / 170 passed + 18 skipped, build 5/5,
  whitespace guard clean.

## Immediate Execution Order

Gate B of `dynamic_airborne_split_refactor_v2` should now continue in
this order:

1. Move `applyMixedPlainModerateSingleBoardLabTemplate` into
   `packages/engine/src/dynamic-airborne-correction-guards.ts`.
2. Import that guard back into `dynamic-airborne.ts`.
3. Update the Gate B static contract and cartography counts.
4. Run the targeted Gate B contract, focused dynamic airborne and
   hostile-input suites as needed, `pnpm calculator:gate:current`, and
   `git diff --check`; run post-build web typecheck if Next metadata
   changes.

The broad audit did not surface calculator drift, so the right next
move is still a narrow mechanical carve, not a formula/source-family
reopen. Gate C remains open because `dynamic-airborne.ts` is still 2538
lines, above the 2000-line architecture threshold.

## Latest Closed Slices

See [CURRENT_STATE.md](./CURRENT_STATE.md) "Latest Closed Slices"
table. `all_caller_invalid_thickness_guard_v1` is now the latest closed
calculator slice, and `dynamic_airborne_split_refactor_v2` is the
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

Just closed: `all_caller_invalid_thickness_guard_v1`.
Gate A pinned direct floor/wall invalid thickness behavior without
runtime change. Gate B was not required. Gate C moved engine thickness
validity out of partial and selected the architecture hygiene slice
because `dynamic-airborne.ts` remains above the 2000-line threshold.

1. **`dynamic_airborne_split_refactor_v2`** — now active; composer
   injection to finish the `dynamic-airborne.ts` split. Gate B first
   carve moved `applyMicroGapFillEquivalenceGuard`; second carve moved
   `applyHeavyUnframedCavityScreeningCap`; third carve moved
   `applyMixedSecurityBoardDoubleStudFieldTrim`; fourth carve moved
   `applyHighFillSingleBoardStudFieldLift`; fifth carve moved
   `applyMixedBoardEmptyCavityFieldMidbandLift`; sixth carve moved
   `applyMixedPremiumSplitFieldLift`; seventh carve moved
   `applyDiamondHybridResilientFieldMidbandTrim`, leaving
   `dynamic-airborne.ts` at 2538 lines and 7 in-file `apply*` guards.
   Next target: `applyMixedPlainModerateSingleBoardLabTemplate`.
   Blueprint in
   [DYNAMIC_AIRBORNE_CARTOGRAPHY.md](./DYNAMIC_AIRBORNE_CARTOGRAPHY.md)
   "Gate B Seventh Carve - 2026-04-24" section.
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
7. **Standalone all-caller invalid-thickness guard** — closed
   no-runtime as `all_caller_invalid_thickness_guard_v1`.
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

1. [CHECKPOINT_2026-04-24_DYNAMIC_AIRBORNE_SPLIT_V2_GATE_B_SEVENTH_CARVE_HANDOFF.md](./CHECKPOINT_2026-04-24_DYNAMIC_AIRBORNE_SPLIT_V2_GATE_B_SEVENTH_CARVE_HANDOFF.md)
   — latest checkpoint: dynamic-airborne split v2 Gate A landed
   no-runtime, Gate B seventh carve landed, and the next carve target is
   selected.
2. [SLICE_DYNAMIC_AIRBORNE_SPLIT_REFACTOR_V2_PLAN.md](./SLICE_DYNAMIC_AIRBORNE_SPLIT_REFACTOR_V2_PLAN.md)
   — active slice plan; continue Gate B with the eighth carve.
3. [DYNAMIC_AIRBORNE_CARTOGRAPHY.md](./DYNAMIC_AIRBORNE_CARTOGRAPHY.md)
   — split-v1 map, circular-import blocker, remaining guard list, and
   Gate A call graph.
4. [CURRENT_STATE.md](./CURRENT_STATE.md)
5. [MASTER_PLAN.md](./MASTER_PLAN.md) §3 (state grid) + §4 (master
   sequence) + §6 (accuracy preservation contract) + §8
   (completion signals)
6. [CHECKPOINT_2026-04-24_DYNAMIC_AIRBORNE_SPLIT_V2_GATE_B_FIRST_CARVE_HANDOFF.md](./CHECKPOINT_2026-04-24_DYNAMIC_AIRBORNE_SPLIT_V2_GATE_B_FIRST_CARVE_HANDOFF.md),
   [CHECKPOINT_2026-04-24_DYNAMIC_AIRBORNE_SPLIT_V2_GATE_A_HANDOFF.md](./CHECKPOINT_2026-04-24_DYNAMIC_AIRBORNE_SPLIT_V2_GATE_A_HANDOFF.md),
   [CHECKPOINT_2026-04-24_INVALID_THICKNESS_CLOSEOUT_HANDOFF.md](./CHECKPOINT_2026-04-24_INVALID_THICKNESS_CLOSEOUT_HANDOFF.md),
   [CHECKPOINT_2026-04-24_INVALID_THICKNESS_GATE_A_HANDOFF.md](./CHECKPOINT_2026-04-24_INVALID_THICKNESS_GATE_A_HANDOFF.md)
   and [SLICE_ALL_CALLER_INVALID_THICKNESS_GUARD_PLAN.md](./SLICE_ALL_CALLER_INVALID_THICKNESS_GUARD_PLAN.md)
   — closed Gate A / invalid-thickness reference only.
7. [SLICE_PROJECT_ACCESS_POLICY_ROUTE_INTEGRATION_PLAN.md](./SLICE_PROJECT_ACCESS_POLICY_ROUTE_INTEGRATION_PLAN.md)
   — deferred productization route-integration slice, reference only.
8. Previous calculator slice plans are closed references only unless a
   future checkpoint explicitly reopens them.
9. Run `pnpm calculator:gate:current` before calculator runtime changes.
   Productization slices should add their own focused app/API tests and
   use `pnpm check` when they touch shared contracts.
