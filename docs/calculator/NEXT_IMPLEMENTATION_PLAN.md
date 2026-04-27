# Next Implementation Plan

Document role: tactical detail for the **active slice**. Short,
focused, agent-resume friendly. For the strategic picture read
[MASTER_PLAN.md](./MASTER_PLAN.md). For what is stable right now read
[CURRENT_STATE.md](./CURRENT_STATE.md). For the private-use readiness
chain read
[PERSONAL_USE_READINESS_ROADMAP.md](./PERSONAL_USE_READINESS_ROADMAP.md).

Last reviewed: 2026-04-27
(`calculator_source_gap_revalidation_v1` Gate A closed; selected
`wall_coverage_expansion_planning_v2`;
see
`SLICE_WALL_COVERAGE_EXPANSION_PLANNING_V2_PLAN.md`).

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
  `wall_coverage_expansion_planning_v2`.
- **Latest checkpoint**:
  [CHECKPOINT_2026-04-27_CALCULATOR_SOURCE_GAP_REVALIDATION_GATE_A_HANDOFF.md](./CHECKPOINT_2026-04-27_CALCULATOR_SOURCE_GAP_REVALIDATION_GATE_A_HANDOFF.md).
- **Planning surface**:
  [SLICE_WALL_COVERAGE_EXPANSION_PLANNING_V2_PLAN.md](./SLICE_WALL_COVERAGE_EXPANSION_PLANNING_V2_PLAN.md).
- **Personal-use readiness roadmap**:
  [PERSONAL_USE_READINESS_ROADMAP.md](./PERSONAL_USE_READINESS_ROADMAP.md)
  is closed for the current private/internal-use bar. Heavy-core/concrete
  remains screening, timber stud + CLT wall remain formula/source-gated
  until new source evidence appears, floor fallback remains
  low-confidence until new source evidence or a bounded family rule
  appears, and UI/input/output honesty is validated.
- **Just closed**: `proposal_report_polish_v1`.
  Simple PDF/DOCX exports now include output coverage posture,
  generated proposal documents preserve real floor/wall workbench
  caveats, and many-layer / long-label report rendering is pinned.
  This did not change calculator runtime/source/confidence posture.
- **Latest broad validation**: 2026-04-27 `pnpm check` is green after
  calculator source-gap revalidation Gate A: engine 233 files / 1275
  tests, web 155 files / 885 passed + 18 skipped through
  `tools/dev/run-web-vitest.ts`, build 5/5, with only the known
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
- **UI/input/output honesty Gate B result**:
  `apps/web/lib/calculator-api-validation.ts` now gives
  `/api/estimate` and `/api/impact-only` concrete `nextField` guidance
  while preserving raw schema `issues`. `simple-workbench-output-model`
  keeps genuinely missing field-impact inputs as `needs_input`, but
  marks engine-rejected current-path field-impact companions such as
  active-continuation `L'nT,50` as `unsupported` and non-numeric. No
  acoustic runtime values, formulas, confidence scores, or support
  precedence changed.
- **UI/input/output honesty Gate C result**:
  `packages/engine/src/post-ui-input-output-honesty-gate-c-next-slice-selection-contract.test.ts`
  closes the personal-use readiness chain and selects
  `project_access_policy_route_integration_v1`. The calculator is now
  reasonable for private/internal estimates across common wall/floor
  stacks when the visible evidence-tier caveats are respected. This is
  not a certification, every-possible-family, or full productization
  claim.
- **Project access policy route integration result**:
  `apps/web/lib/project-route-auth.ts` now adapts resolved owner scope
  into the pure project access policy. Project list/create/import/detail
  and proposal audit append decisions use that policy path while keeping
  current owner-scoped route behavior. `apps/web/lib/project-route-auth.test.ts`,
  `apps/web/lib/server-project-routes.test.ts`, and
  `apps/web/lib/post-project-access-policy-route-integration-next-slice-selection-contract.test.ts`
  pin the adapter, owner-only route behavior, no team-role route
  enablement, and next-slice selection.
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
- **Closed productization follow-up**:
  `proposal_report_polish_v1`. PDF/DOCX/workbench proposal honesty is
  tightened for representative wall/floor scenarios without changing
  calculator values, formulas, support, or confidence.
- **Proposal/report polish Gate A first carve**:
  the simple PDF/DOCX HTML path now renders an output coverage register
  so live, `needs_input`, and `unsupported` output posture does not
  disappear from short-form exports. The focused
  `simple-workbench-proposal.test.ts` pins this; calculator runtime and
  support/confidence decisions are unchanged.
- **Proposal/report polish Gate A second carve**:
  `simple-workbench-proposal-generated-document-honesty.test.ts` now
  builds proposal documents from real workbench output models and pins a
  reinforced-concrete low-confidence floor case plus a dynamic
  field-airborne wall case across copy-ready text, branded preview, and
  simple preview. Targeted proposal/export tests and
  `pnpm calculator:gate:current` are green. This is still no-runtime for
  acoustic calculations.
- **Proposal/report polish Gate A third carve**:
  the generated-document test now includes a 53-row UBIQ exact floor
  stack with long material labels. Branded/simple HTML tables use fixed
  table layout plus `overflow-wrap` / `word-break` guards, SVG
  construction labels stay truncated, full labels remain available in
  wrapping table/text surfaces, and simple short-form exports explicitly
  state when the layer table is capped. Targeted proposal/report tests
  are green across 5 files / 18 tests, web lint is green,
  `pnpm calculator:gate:current` is green, and broad `pnpm check` is
  green with engine 233 files / 1275 tests and web 155 files / 885
  passed + 18 skipped.
- **Proposal/report polish closeout**:
  `packages/engine/src/post-proposal-report-polish-next-slice-selection-contract.test.ts`
  closes `proposal_report_polish_v1` and selects
  `calculator_source_gap_revalidation_v1`. The selected Gate A action
  is a no-runtime inventory and rerank of remaining source gaps.
  `pnpm calculator:gate:current` is green after adding the closeout
  contract: engine 99 files / 450 tests, web 43 files / 211 passed +
  18 skipped, build 5/5 with the known non-fatal `sharp/@img` warnings.
- **Calculator source-gap revalidation Gate A**:
  `packages/engine/src/calculator-source-gap-revalidation-gate-a-contract.test.ts`
  closes `calculator_source_gap_revalidation_v1` no-runtime and selects
  `wall_coverage_expansion_planning_v2`. `GDMTXA04A`, `C11c`, raw bare
  open-box/open-web impact, and wall-selector behavior remain
  fail-closed. Heavy-core/concrete, timber stud, CLT wall, and floor
  fallback are not promoted from nearby green tests.
  `pnpm calculator:gate:current` is green after adding the Gate A
  contract: engine 100 files / 455 tests, web 43 files / 211 passed +
  18 skipped, build 5/5 with the known non-fatal `sharp/@img` warnings.

## Immediate Execution Order

`wall_coverage_expansion_planning_v2` should now proceed in this
order:

1. Re-read
   [SLICE_WALL_COVERAGE_EXPANSION_PLANNING_V2_PLAN.md](./SLICE_WALL_COVERAGE_EXPANSION_PLANNING_V2_PLAN.md)
   and
   [CHECKPOINT_2026-04-27_CALCULATOR_SOURCE_GAP_REVALIDATION_GATE_A_HANDOFF.md](./CHECKPOINT_2026-04-27_CALCULATOR_SOURCE_GAP_REVALIDATION_GATE_A_HANDOFF.md).
2. Run `pnpm calculator:gate:current` as the baseline.
3. Inventory the current wall coverage map:
   exact/catalog/benchmark/formula/screening ownership, generated
   wall-stack posture, preset coverage, and the landed wall guardrails.
4. Add one no-runtime Gate A planning contract that records the current
   wall candidate order and evidence owner files.
5. Select the first wall Gate B runtime/source slice only if that
   contract proves it is source-backed, benchmark-backed, bounded, or
   formula-owned.
6. Keep formulas, runtime values, exact/bound/formula precedence,
   confidence scores, output support, and evidence tiers unchanged
   during Gate A planning.

## Personal-Use Readiness Chain

These are the calculator priorities before calling the project ready for
private day-to-day use:

1. Floor fallback / low-confidence cleanup.
   - closed no-runtime at Gate C.
2. UI / input / output honesty pass.
   - closed at Gate C.

Productization route-policy and proposal/report polish slices are
closed. Calculator runtime/source posture stays frozen during the
selected no-runtime revalidation slice; additional productization work
is deferred.

## Latest Closed Slices

See [CURRENT_STATE.md](./CURRENT_STATE.md) "Latest Closed Slices" table.
`calculator_source_gap_revalidation_v1` Gate A is now closed and
`wall_coverage_expansion_planning_v2` is active.

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
   closed as `project_access_policy_route_integration_v1`. Route
   behavior remains owner-scoped and acoustic calculations are
   unaffected.
