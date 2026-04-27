# Next Implementation Plan

Document role: tactical detail for the **active slice**. Short,
focused, agent-resume friendly. For the strategic picture read
[MASTER_PLAN.md](./MASTER_PLAN.md). For what is stable right now read
[CURRENT_STATE.md](./CURRENT_STATE.md). For the private-use readiness
chain read
[PERSONAL_USE_READINESS_ROADMAP.md](./PERSONAL_USE_READINESS_ROADMAP.md).

Last reviewed: 2026-04-27
(`ui_input_output_honesty_v1` Gate A landed no-runtime;
Gate B honesty fixes are next;
see
`CHECKPOINT_2026-04-27_UI_INPUT_OUTPUT_HONESTY_GATE_A_HANDOFF.md`).

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
  `ui_input_output_honesty_v1`.
- **Latest checkpoint**:
  [CHECKPOINT_2026-04-27_UI_INPUT_OUTPUT_HONESTY_GATE_A_HANDOFF.md](./CHECKPOINT_2026-04-27_UI_INPUT_OUTPUT_HONESTY_GATE_A_HANDOFF.md).
- **Planning surface**:
  [SLICE_UI_INPUT_OUTPUT_HONESTY_PLAN.md](./SLICE_UI_INPUT_OUTPUT_HONESTY_PLAN.md).
- **Personal-use readiness roadmap**:
  [PERSONAL_USE_READINESS_ROADMAP.md](./PERSONAL_USE_READINESS_ROADMAP.md)
  fixes the remaining calculator-priority chain as UI/input/output
  honesty before productization resumes. Heavy-core/concrete remains
  screening, timber stud + CLT wall remain formula-owned until new
  source evidence appears, and floor fallback remains low-confidence
  until new source evidence or a bounded family rule appears.
- **Just closed**: `dynamic_airborne_split_refactor_v2` Gate C.
  Gate B carved eleven correction guards into
  `dynamic-airborne-correction-guards.ts`; `dynamic-airborne.ts` is now
  1793 lines, below the 2000-line C6 threshold.
- **Latest broad validation**: 2026-04-27 `pnpm check` is green after
  floor fallback Gate C no-runtime closeout and UI honesty selection:
  engine 230 files / 1260 tests, web 150 files / 864 passed + 18 skipped
  through `tools/dev/run-web-vitest.ts`, build 5/5, with only the known
  non-fatal `sharp/@img` optional-package warnings.
- **Cartography Gate A result**:
  `packages/engine/src/realistic-layer-combination-coverage-cartography.test.ts`
  landed no-runtime. It executes 29 representative floor/wall cells and
  maps evidence tier, support/card posture, output coverage, origin,
  confidence, invariants, and candidate type.
- **Floor fallback Gate A result**:
  `packages/engine/src/floor-fallback-low-confidence-gate-a-audit-contract.test.ts`
  landed no-runtime. It pins generated `floor-steel-fallback` as
  no-exact/no-bound, `low_confidence`, fit `28%`, origin basis
  `predictor_floor_system_low_confidence_estimate`, lab `Rw=61` /
  `Ln,w=58.3`, field `R'w=70` / `Ln,w=58.3` /
  `L'n,w=61.3` / `L'nT,w=58.5`, and keeps `L'nT,50`
  unsupported. Pliteq and UBIQ rows remain source lineage / near
  misses, not promotion evidence.
- **Floor fallback Gate B result**:
  `packages/engine/src/floor-fallback-low-confidence-gate-b-source-contract.test.ts`
  landed no-runtime. It proves exact and bound source precedence already
  work on the true Pliteq and UBIQ source topologies, blocks promotion
  for the generated stack because it lacks the critical INEX deck /
  GenieMat / Pliteq ceiling or UBIQ bound topology, and finds no
  fail-closed correction because unsupported outputs already stay
  explicit.
- **Floor fallback Gate C result**:
  `packages/engine/src/post-floor-fallback-low-confidence-gate-c-next-slice-selection-contract.test.ts`
  closed `floor_fallback_low_confidence_cleanup_v1` no-runtime and
  selected `ui_input_output_honesty_v1`. `floor-steel-fallback` remains
  `screening` / `low_confidence`, with field `R'w=70`, `Ln,w=58.3`,
  `L'n,w=61.3`, `L'nT,w=58.5`, and unsupported `L'nT,50`.
- **UI/input/output honesty Gate A result**:
  `apps/web/features/workbench/ui-input-output-honesty-gate-a-inventory.test.ts`
  landed no-runtime. It pins structured schema issue paths for missing
  estimate and impact-only inputs, field-airborne geometry vs room-volume
  blockers, and non-numeric handling for explicitly unsupported requested
  outputs. It found no defended-looking unsupported live/bound value.
  Gate B is now limited to API next-field message mapping and simple
  output-card unsupported-vs-missing-input label precedence.
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

`ui_input_output_honesty_v1` should now proceed in this order:

1. Re-read
   [SLICE_UI_INPUT_OUTPUT_HONESTY_PLAN.md](./SLICE_UI_INPUT_OUTPUT_HONESTY_PLAN.md).
2. Start Gate B with a small shared validation-message mapper for
   `/api/estimate` and `/api/impact-only`, preserving structured issue
   detail while exposing concrete next-field guidance.
3. Fix simple output-card precedence so an output already present in
   `unsupportedTargetOutputs` prefers a clear unsupported/current-path
   label over a generic missing-input label, while keeping genuine
   missing-field cards as `needs_input`.
4. Add focused tests for the changed API payloads and card labels.
5. Keep formulas, runtime values, exact/bound/formula precedence, and
   confidence scores unchanged.
6. Keep `GDMTXA04A`, `C11c`, raw bare open-box/open-web impact,
   heavy-core concrete, wall selector, timber-stud, and CLT wall
   follow-ups closed unless new evidence deliberately selects them.
7. Run targeted Gate B contracts, `pnpm calculator:gate:current`, and
   `git diff --check`; run broad `pnpm check` before closing the slice
   or after user-visible behavior changes.

## Personal-Use Readiness Chain

These are the calculator priorities before calling the project ready for
private day-to-day use:

1. Floor fallback / low-confidence cleanup.
   - closed no-runtime at Gate C.
2. UI / input / output honesty pass.
   - Gate A landed no-runtime; Gate B fixes are next.

Do not resume productization ahead of this chain unless priority
explicitly changes.

## Latest Closed Slices

See [CURRENT_STATE.md](./CURRENT_STATE.md) "Latest Closed Slices" table.
`floor_fallback_low_confidence_cleanup_v1` is now closed and
`ui_input_output_honesty_v1` is active with Gate B honesty fixes next.

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
   `project_access_policy_route_integration_v1` remains deferred until
   `ui_input_output_honesty_v1` closes or priority explicitly changes.
