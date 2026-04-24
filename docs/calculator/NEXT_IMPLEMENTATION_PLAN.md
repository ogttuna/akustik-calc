# Next Implementation Plan

Document role: tactical detail for the **active slice**. Short,
focused, agent-resume friendly. For the strategic picture read
[MASTER_PLAN.md](./MASTER_PLAN.md). For what is stable right now
read [CURRENT_STATE.md](./CURRENT_STATE.md).

Last reviewed: 2026-04-24 (`wall_resilient_bar_side_count_modeling_v1`
Gate A landed with no runtime change; focused gate + broad revalidation
are green after test-only hardening; the planning refresh rechecked the
active implementation surfaces and official Knauf / British Gypsum
evidence, and Gate B input/model plumbing is still next).

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

- **Active slice**: `wall_resilient_bar_side_count_modeling_v1`
  (common resilient framed-wall input/model expansion). Selected
  `2026-04-23` immediately after
  `wall_timber_lightweight_source_corpus_v1` closed.
- **Planning surface**:
  [SLICE_WALL_RESILIENT_BAR_SIDE_COUNT_MODELING_PLAN.md](./SLICE_WALL_RESILIENT_BAR_SIDE_COUNT_MODELING_PLAN.md).
- **Calculator runtime posture**: `good_calculator_final_audit_v1`
  is closed. The final audit reconciled `MASTER_PLAN.md` §3/§8,
  added `coverage-grid-consistency.test.ts`, verified C1-C6 with
  executable assertions, added the post-final-audit contract, and
  opened the productization roadmap. The archived plan lives at
  `docs/archive/handoffs/SLICE_GOOD_CALCULATOR_FINAL_AUDIT_PLAN.md`.
- **Next implementation action**: execute Gate B explicit
  input/model plumbing for
  `wall_resilient_bar_side_count_modeling_v1`. Gate A already landed:
  `packages/engine/src/wall-resilient-bar-side-count-blind-audit.test.ts`
  pins the current side-count-blind engine posture for the four
  official RB1/RB2 timber rows, while
  `apps/web/features/workbench/wall-resilient-bar-side-count-route-card-matrix.test.ts`
  and
  `apps/web/features/workbench/wall-resilient-bar-side-count-input-contract.test.ts`
  pin the current workbench route/card collapse and prove the shared
  schema/store still lack a resilient-bar side-count dimension. The
  just-closed
  `wall_timber_lightweight_source_corpus_v1` slice landed:
  `packages/engine/src/wall-timber-lightweight-source-corpus.ts`,
  `wall-timber-lightweight-source-corpus-contract.test.ts`,
  `wall-timber-lightweight-source-audit.test.ts`,
  `airborne-verified-catalog.test.ts`, and
  `apps/web/features/workbench/wall-direct-timber-exact-route-card-matrix.test.ts`.
  That slice closed with 2 direct timber rows promoted to
  `exact_import_landed`, 5 resilient/proprietary rows held as
  benchmark-only, and 2 linked lightweight steel rows held as
  holdout-only. The next honest move is still not a timber formula
  retune: it is to model the missing one-side vs both-sides
  resilient-bar dimension that currently keeps four official timber
  rows from becoming exact or narrower benchmark lanes. Gate A already
  proved that today the wall context can express `connectionType` and
  `studType`, but not resilient-bar side count, so those rows remain
  intentionally non-exact until Gate B lands. Broad `pnpm check`
  revalidation on `2026-04-24` changed no calculator values; it only
  hardened two tests so the suite stays truthful under full load:
  the shared-schema side-count contract now asserts parse behavior
  instead of `.keyof()` on the exported `ZodType`, and the heavy
  `calculate-assembly` split-cavity field swap invariant now runs on a
  representative small/mid/large gap matrix rather than the full 4x4
  asymmetry grid. The planning refresh on `2026-04-24` also rechecked
  the active write scope and official-source reason for the slice. The
  shared wall context still exposes `connectionType`, `studType`, and
  `studSpacingMm` in:
  `packages/shared/src/domain/airborne-context.ts`,
  `apps/web/features/workbench/workbench-store.ts`,
  `apps/web/features/workbench/preset-definitions.ts`,
  `apps/web/features/workbench/workbench-shell.tsx`,
  `apps/web/features/workbench/simple-workbench-shell.tsx`, and
  `apps/web/features/workbench/simple-workbench-route-panel.tsx`, but no
  resilient-bar side-count dimension exists yet. Official manufacturer
  evidence still says that omission matters: the Knauf GB 2026 guide
  carries EN-TP-RB1 56 dB and EN-TP-RB2 59 dB on the same timber
  family, while British Gypsum A046005 and A046006 carry the same
  one-side vs both-sides 55/58 dB split. That keeps Gate B as the
  highest-ROI next move because it unlocks narrower source-backed wall
  answers without inventing new formula authority.
  `project_access_policy_route_integration_v1` is deferred, not
  cancelled, because it does not improve acoustic calculation accuracy
  or coverage.

## Immediate Execution Order

Gate B should now be executed in this order:

1. Add a shared resilient-bar side-count enum with a legacy-stable
   `auto` posture.
2. Plumb the field through workbench state, snapshot persistence, preset
   defaults, and shell-to-engine context assembly.
3. Add the explicit workbench control only where the wall route already
   exposes the other framed-wall context fields.
4. Prove `auto` preserves the current side-count-blind route.
5. Only after propagation is green, reopen the four RB1/RB2 timber rows
   for exact-vs-benchmark posture decisions in Gate C.

## Latest Closed Slices

See [CURRENT_STATE.md](./CURRENT_STATE.md) "Latest Closed Slices"
table. `wall_timber_lightweight_source_corpus_v1` is now the latest
closed calculator slice and has an explicit post-contract test.

## Deferred Follow-Up Tracks

Explicitly carried forward by the final-audit contract:

Just closed: `wall_timber_lightweight_source_corpus_v1`.
Gate A authored the typed source corpus, Gate B proved all 9 rows stay
inside the defended current-engine corridor, and Gate C imported the 2
direct timber rows as exact lab anchors without changing the live
double-board timber preset route. The remaining common-wall gap is now
explicit: resilient-bar side count is not yet modeled, so four official
timber rows remain benchmark-only.

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

1. [CHECKPOINT_2026-04-23_WALL_TIMBER_LIGHTWEIGHT_SOURCE_CORPUS_CLOSEOUT_HANDOFF.md](./CHECKPOINT_2026-04-23_WALL_TIMBER_LIGHTWEIGHT_SOURCE_CORPUS_CLOSEOUT_HANDOFF.md)
   — source-corpus closeout and resilient side-count next slice selection.
2. [CHECKPOINT_2026-04-24_RESILIENT_SIDE_COUNT_GATE_B_READY_HANDOFF.md](./CHECKPOINT_2026-04-24_RESILIENT_SIDE_COUNT_GATE_B_READY_HANDOFF.md)
   — latest checkpoint: docs/implementation reconciliation plus focused and broad validation green.
3. [CURRENT_STATE.md](./CURRENT_STATE.md)
4. [SLICE_WALL_RESILIENT_BAR_SIDE_COUNT_MODELING_PLAN.md](./SLICE_WALL_RESILIENT_BAR_SIDE_COUNT_MODELING_PLAN.md)
5. [MASTER_PLAN.md](./MASTER_PLAN.md) §3 (state grid) + §4 (master
   sequence) + §6 (accuracy preservation contract) + §8
   (completion signals)
6. [SLICE_WALL_TIMBER_LIGHTWEIGHT_SOURCE_CORPUS_PLAN.md](./SLICE_WALL_TIMBER_LIGHTWEIGHT_SOURCE_CORPUS_PLAN.md)
   — closed slice reference; Gate A/B/C landed and direct-timber exact import is closed.
7. [CHECKPOINT_2026-04-23_TEAM_ACCESS_MODEL_HANDOFF.md](./CHECKPOINT_2026-04-23_TEAM_ACCESS_MODEL_HANDOFF.md)
   — closed team-access policy model handoff, reference only.
8. [SLICE_PROJECT_ACCESS_POLICY_ROUTE_INTEGRATION_PLAN.md](./SLICE_PROJECT_ACCESS_POLICY_ROUTE_INTEGRATION_PLAN.md)
   — deferred productization route-integration slice, reference only.
9. [SLICE_TEAM_ACCESS_MODEL_PLAN.md](./SLICE_TEAM_ACCESS_MODEL_PLAN.md)
   — closed team-access policy model slice, reference only.
10. [SLICE_AUTH_SESSION_HARDENING_PLAN.md](./SLICE_AUTH_SESSION_HARDENING_PLAN.md)
   — closed auth-session hardening slice, reference only.
11. [SLICE_PROJECT_ACCESS_AUTHORIZATION_PLAN.md](./SLICE_PROJECT_ACCESS_AUTHORIZATION_PLAN.md)
   — closed productization authorization slice, reference only.
12. This file.
13. Previous calculator slice plans (closed, reference only):
   - `docs/archive/handoffs/SLICE_GOOD_CALCULATOR_FINAL_AUDIT_PLAN.md` (step 8)
   - `docs/archive/handoffs/SLICE_WALL_CORRIDOR_SURFACE_VALUE_PINNING_PLAN.md` (step 7b)
   - `docs/archive/handoffs/SLICE_MIXED_FLOOR_WALL_EDGE_CASE_HARDENING_PLAN.md` (step 7)
14. Run `pnpm calculator:gate:current` before calculator runtime
   changes. Productization slices should add their own focused app/API
   tests and use `pnpm check` when they touch shared contracts.
