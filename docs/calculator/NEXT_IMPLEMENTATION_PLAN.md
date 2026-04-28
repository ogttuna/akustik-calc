# Next Implementation Plan

Document role: tactical detail for the **active slice**. Short,
focused, agent-resume friendly. For the strategic picture read
[MASTER_PLAN.md](./MASTER_PLAN.md). For what is stable right now read
[CURRENT_STATE.md](./CURRENT_STATE.md). For the private-use readiness
chain read
[PERSONAL_USE_READINESS_ROADMAP.md](./PERSONAL_USE_READINESS_ROADMAP.md).

Last reviewed: 2026-04-28
(`wall_source_catalog_acquisition_v1` Gate C closed no-runtime and
selected `wall_no_stud_double_leaf_source_research_v1`;
see
`SLICE_WALL_NO_STUD_DOUBLE_LEAF_SOURCE_RESEARCH_PLAN.md`).

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
  `wall_no_stud_double_leaf_source_research_v1`.
- **Latest checkpoint**:
  [CHECKPOINT_2026-04-28_WALL_SOURCE_CATALOG_ACQUISITION_GATE_C_CLOSEOUT_HANDOFF.md](./CHECKPOINT_2026-04-28_WALL_SOURCE_CATALOG_ACQUISITION_GATE_C_CLOSEOUT_HANDOFF.md).
- **Planning surface**:
  [SLICE_WALL_NO_STUD_DOUBLE_LEAF_SOURCE_RESEARCH_PLAN.md](./SLICE_WALL_NO_STUD_DOUBLE_LEAF_SOURCE_RESEARCH_PLAN.md).
- **Personal-use readiness roadmap**:
  [PERSONAL_USE_READINESS_ROADMAP.md](./PERSONAL_USE_READINESS_ROADMAP.md)
  is closed for the current private/internal-use bar. Heavy-core/concrete
  remains screening, timber stud + CLT wall remain formula/source-gated
  until new source evidence appears, floor fallback remains
  low-confidence until new source evidence or a bounded family rule
  appears, and UI/input/output honesty is validated.
- **Just closed**: `wall_coverage_expansion_planning_v2` Gate A.
  The no-runtime contract inventories current wall exact/formula/
  screening ownership and guardrails, keeps heavy-core/concrete
  screening, timber stud low-confidence, and CLT wall formula-owned/
  source-blocked, and selects
  `wall_single_leaf_mass_law_calibration_v1` as the next no-runtime
  source/formula contract slice.
- **Just closed**: `wall_single_leaf_mass_law_calibration_v1` Gate C.
  Gate A and Gate B changed no runtime math. The no-runtime
  bounded candidate matrix pins current field values for 150 mm
  concrete (`R'w=53`), 150 mm solid brick (`R'w=51`), and 150 mm
  generic AAC (`R'w=38`), plus 100/150/200 mm monotonic sensitivity.
  It blocks runtime movement because none of the generic stacks has a
  stack-specific source row or bounded tolerance pack.
  `post-wall-single-leaf-mass-law-calibration-v1-next-slice-selection-contract.test.ts`
  closes the slice no-runtime and selects
  `wall_double_leaf_sharp_davy_scoping_v1` because double-leaf,
  stud/double-stud, and cavity walls are the next common wall coverage
  gap in the current roadmap.
- **Just landed**: `wall_double_leaf_sharp_davy_scoping_v1` Gate B.
  `packages/engine/src/wall-double-leaf-sharp-davy-scoping-gate-b-contract.test.ts`
  pins the empty double-leaf, porous double-leaf, explicit single-stud,
  and explicit double-stud current values and records source/tolerance
  decisions for each. Gate B changed no runtime math and blocks value
  movement because no direct source row, lab-fallback row, benchmark
  envelope, formula tolerance owner, or bounded family rule exists.
- **Just closed**: `wall_double_leaf_sharp_davy_scoping_v1` Gate C.
  `packages/engine/src/post-wall-double-leaf-sharp-davy-scoping-v1-next-slice-selection-contract.test.ts`
  closes the slice no-runtime and selects
  `wall_double_leaf_source_evidence_acquisition_v1`. Runtime remains
  frozen; the next slice must classify direct rows, family benchmarks,
  and formula tolerance references before any retune or import.
  The next implementation file is
  `packages/engine/src/wall-double-leaf-source-evidence-acquisition-gate-a-contract.test.ts`.
- **Just landed**: `wall_double_leaf_source_evidence_acquisition_v1`
  Gate B. Gate A classified the source/tolerance candidates; Gate B
  then reconciled bounded Knauf W111 / W112 / W115 / W119 framed-wall
  rows against current dynamic lab/field outputs. The rows already fit:
  W111/W112 single-stud rows sit inside tolerance, W112 field rows are
  exact verified proxy anchors, and W115/W119 split-cavity rows already
  match as `double_stud_system`. No runtime/support/confidence/evidence
  or route-card behavior changed.
- **Just closed**: `wall_double_leaf_source_evidence_acquisition_v1`
  Gate C. `packages/engine/src/post-wall-double-leaf-source-evidence-acquisition-v1-next-slice-selection-contract.test.ts`
  closes the source-evidence slice no-runtime and selects
  `wall_source_catalog_acquisition_v1`. The next slice should inventory
  wall source catalog targets and import acceptance rules before any
  runtime, confidence, support, evidence text, or route-card movement.
- **Just landed**: `wall_source_catalog_acquisition_v1` Gate A.
  `packages/engine/src/wall-source-catalog-acquisition-gate-a-contract.test.ts`
  lands no-runtime target/source-readiness inventory. It classifies
  manufacturer framed systems as `bounded_existing_rows`, no-stud
  double-leaf, timber double-board, CLT wall, and lined-massive /
  heavy-core concrete as `needs_research`, and floor / impact /
  product-delta adjacent rows as `reject_adjacent_context`. Gate B
  should close source-pack readiness no-runtime unless a direct row pack
  has complete metadata, tolerance, protected negative boundaries, and
  paired engine/web tests.
- **Just landed**: `wall_source_catalog_acquisition_v1` Gate B.
  `packages/engine/src/wall-source-catalog-acquisition-gate-b-contract.test.ts`
  closes source-pack readiness no-runtime. It selects no runtime import:
  existing framed rows already fit current behavior, no-stud
  double-leaf lacks direct rows, timber double-board lacks a live
  topology match, CLT lacks wall-specific source rows, lined-massive /
  heavy-core lacks a bounded lining rule, and floor/product-delta rows
  are rejected as wall source truth. Gate C then closed the
  source-catalog slice no-runtime and selected the next accuracy slice.
- **Just closed**: `wall_source_catalog_acquisition_v1` Gate C.
  `packages/engine/src/post-wall-source-catalog-acquisition-v1-next-slice-selection-contract.test.ts`
  closes the source-catalog slice no-runtime and selects
  `wall_no_stud_double_leaf_source_research_v1`. Runtime remains
  frozen. The next slice must classify direct empty and porous no-stud
  double-leaf rows, named formula/tolerance references, metadata
  completeness, and negative boundaries before any import, confidence,
  support, evidence, or route-card behavior changes.
- **Previously closed**: `proposal_report_polish_v1`.
  Simple PDF/DOCX exports now include output coverage posture,
  generated proposal documents preserve real floor/wall workbench
  caveats, and many-layer / long-label report rendering is pinned.
  This did not change calculator runtime/source/confidence posture.
- **Latest broad validation**: 2026-04-28 `pnpm check` is green after
  the wall double-leaf Gate B-ready checkpoint revalidation. The
  unchanged broad engine/web test tasks replayed from Turbo cache using
  the prior green run: engine 238 files / 1300 tests, web 155 files /
  885 passed + 18 skipped through `tools/dev/run-web-vitest.ts`,
  build 5/5, with only the known non-fatal `sharp/@img`
  optional-package warnings.
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
- **Wall coverage expansion planning v2 Gate A**:
  `packages/engine/src/wall-coverage-expansion-planning-v2-gate-a-contract.test.ts`
  closes the wall coverage inventory no-runtime and selects
  `wall_single_leaf_mass_law_calibration_v1`. It keeps exact/catalog
  and lab-fallback rows precedence-protected, keeps heavy-core/concrete
  screening, timber stud low-confidence, and CLT wall formula-owned/
  source-blocked, and requires hostile-input, many-layer, reorder,
  invariant, invalid-thickness, and unsupported-output guards before
  runtime wall work.
  `pnpm calculator:gate:current` is green after adding the Gate A
  contract: engine 101 files / 460 tests, web 43 files / 211 passed +
  18 skipped, build 5/5 with the known non-fatal `sharp/@img` warnings.
- **Wall single-leaf mass-law calibration Gate A**:
  `packages/engine/src/wall-single-leaf-mass-law-calibration-gate-a-contract.test.ts`
  lands the no-runtime source/formula contract for unmatched massive
  single-leaf walls. It keeps exact/catalog/lab-fallback precedence
  stronger than formula, limits positive Gate B scope to unmatched
  one-leaf mineral stacks, and requires web route-card coverage before
  any value/support/confidence/evidence text movement.
  `pnpm calculator:gate:current` is green after adding the Gate A
  contract: engine 102 files / 465 tests, web 43 files / 211 passed +
  18 skipped, build 5/5 with the known non-fatal `sharp/@img` warnings.
- **Wall single-leaf mass-law calibration Gate B**:
  `packages/engine/src/wall-single-leaf-mass-law-calibration-gate-b-contract.test.ts`
  lands the no-runtime bounded runtime-candidate matrix. Current
  concrete / solid-brick / generic-AAC values stay as defensible
  formula-owned estimates; runtime movement is blocked until a
  stack-specific source row or bounded tolerance pack exists.
  `pnpm calculator:gate:current` is green after adding the Gate B
  contract: engine 103 files / 470 tests, web 43 files / 211 passed +
  18 skipped, build 5/5 with the known non-fatal `sharp/@img` warnings.
- **Wall single-leaf mass-law calibration Gate C**:
  `packages/engine/src/post-wall-single-leaf-mass-law-calibration-v1-next-slice-selection-contract.test.ts`
  closes the slice no-runtime and selects
  `wall_double_leaf_sharp_davy_scoping_v1`. It keeps the single-leaf
  formula-owned values unchanged, preserves exact/catalog/lab-fallback
  precedence, and requires a no-runtime Sharp/Davy/double-leaf/stud
  scoping Gate A before any double-leaf runtime movement.
  `pnpm calculator:gate:current` is green after adding the Gate C
  contract: engine 104 files / 475 tests, web 43 files / 211 passed +
  18 skipped, build 5/5 with the known non-fatal `sharp/@img` warnings.
- **Wall double-leaf Sharp/Davy scoping Gate A**:
  `packages/engine/src/wall-double-leaf-sharp-davy-scoping-gate-a-contract.test.ts`
  lands the no-runtime current-value and route-ownership inventory for
  common double-leaf / stud-cavity walls. It pins empty double-leaf at
  field `R'w=46`, porous double-leaf without stud metadata at
  `R'w=41`, explicit single-stud at `R'w=37`, and explicit
  double-stud / split-cavity at `R'w=52`, while keeping lined-massive
  and triple-leaf shapes outside the target. Gate A selects Gate B
  matrix work but blocks value movement until a source row, benchmark
  envelope, formula tolerance owner, or bounded family rule is named.
- **Wall double-leaf Sharp/Davy Gate B**:
  `packages/engine/src/wall-double-leaf-sharp-davy-scoping-gate-b-contract.test.ts`
  lands the no-runtime bounded current-value/source-tolerance matrix.
  The four positive routes remain formula-owned estimates with no exact
  row, lab-fallback row, benchmark envelope, formula tolerance owner, or
  bounded family rule; protected exact, resilient, timber, single-leaf,
  lined-massive, CLT, direct-coupled, and triple-leaf boundaries remain
  outside the retune lane.
  `pnpm calculator:gate:current` is green after adding the Gate B
  contract: engine 106 files / 485 tests, web 43 files / 211 passed +
  18 skipped, build 5/5 with the known non-fatal `sharp/@img` warnings.
- **Wall double-leaf Sharp/Davy Gate C**:
  `packages/engine/src/post-wall-double-leaf-sharp-davy-scoping-v1-next-slice-selection-contract.test.ts`
  closes the slice no-runtime and selects
  `wall_double_leaf_source_evidence_acquisition_v1`. No value/support/
  confidence/evidence/card behavior changed; source-evidence acquisition
  is selected because Gate B named specific source/tolerance blockers.
  `pnpm calculator:gate:current` is green after adding the Gate C
  contract: engine 107 files / 490 tests, web 43 files / 211 passed +
  18 skipped, build 5/5 with the known non-fatal `sharp/@img` warnings.
- **Wall double-leaf source evidence Gate A**:
  `packages/engine/src/wall-double-leaf-source-evidence-acquisition-gate-a-contract.test.ts`
  lands no-runtime source/tolerance classification. It rejects the
  generic empty AAC/gap/gypsum double-leaf and no-stud porous
  gypsum/wool/gap/gypsum double-leaf rows for runtime movement, because
  no direct stack row or topology-specific tolerance exists. It classifies
  Knauf W111 single-stud and W115 double-stud / split-cavity rows as
  bounded framed-wall evidence for Gate B reconciliation, while keeping
  Knauf Quietstud, Davy double-leaf formula, and stud-type study
  references as corridor context only. Exact catalog, resilient
  side-count, timber, single-leaf, lined-massive, heavy-core, CLT,
  direct-coupled, and triple-leaf boundaries stay protected.
  Targeted Gate A validation is green: 1 file / 6 tests.
- **Wall double-leaf source evidence Gate B**:
  `packages/engine/src/wall-double-leaf-source-evidence-acquisition-gate-b-contract.test.ts`
  lands no-runtime reconciliation. It pins 16 bounded W111 / W112 /
  W115 / W119 rows against current dynamic outputs: W111/W112
  single-stud rows fit inside source tolerances, W112 field rows remain
  exact verified proxy anchors, and W115/W119 split-cavity rows already
  match on the `double_stud_system` lane. Targeted Gate B validation is
  green: 1 file / 4 tests.
- **Wall double-leaf source evidence Gate C**:
  `packages/engine/src/post-wall-double-leaf-source-evidence-acquisition-v1-next-slice-selection-contract.test.ts`
  closes the source-evidence slice no-runtime and selects
  `wall_source_catalog_acquisition_v1`. Targeted Gate C validation is
  green: 1 file / 5 tests.
- **Wall source catalog acquisition Gate A**:
  `packages/engine/src/wall-source-catalog-acquisition-gate-a-contract.test.ts`
  lands no-runtime. It pins six target families, 16 required row
  metadata fields, seven negative boundaries, and the Gate B decision:
  no direct runtime import is ready now. Targeted Gate A validation is
  green: 1 file / 6 tests.
- **Wall source catalog acquisition Gate B**:
  `packages/engine/src/wall-source-catalog-acquisition-gate-b-contract.test.ts`
  lands no-runtime source-pack readiness closeout. It pins eight import
  acceptance criteria, six source-pack readiness decisions, and the Gate
  C action. Targeted Gate B validation is green: 1 file / 6 tests.
- **Wall source catalog acquisition Gate C**:
  `packages/engine/src/post-wall-source-catalog-acquisition-v1-next-slice-selection-contract.test.ts`
  closes the source-catalog slice no-runtime and selects
  `wall_no_stud_double_leaf_source_research_v1`. Targeted Gate C
  validation is green: 1 file / 5 tests.

## Immediate Execution Order

`wall_no_stud_double_leaf_source_research_v1` should now proceed in this
order:

1. Re-read
   [CHECKPOINT_2026-04-28_WALL_SOURCE_CATALOG_ACQUISITION_GATE_C_CLOSEOUT_HANDOFF.md](./CHECKPOINT_2026-04-28_WALL_SOURCE_CATALOG_ACQUISITION_GATE_C_CLOSEOUT_HANDOFF.md),
   [SLICE_WALL_NO_STUD_DOUBLE_LEAF_SOURCE_RESEARCH_PLAN.md](./SLICE_WALL_NO_STUD_DOUBLE_LEAF_SOURCE_RESEARCH_PLAN.md)
   and the current-state active-slice section.
2. Run `pnpm calculator:gate:current` as the Gate A baseline.
3. Add
   `packages/engine/src/wall-no-stud-double-leaf-source-research-gate-a-contract.test.ts`
   as a no-runtime direct-source/tolerance inventory.
4. Classify empty no-stud double-leaf, porous/absorber-filled no-stud
   double-leaf, and named no-stud formula/tolerance references.
5. Keep all runtime values, support, confidence, evidence text, and
   route-card copy frozen unless Gate A finds a complete direct source
   pack or formula tolerance owner with executable boundaries.
6. Add paired web route-card tests before any future change to visible support,
   confidence, evidence text, output values, or missing-input copy.
7. Validate with the targeted Gate A test,
   `pnpm calculator:gate:current`, and `git diff --check`.

## Personal-Use Readiness Chain

These are the calculator priorities before calling the project ready for
private day-to-day use:

1. Floor fallback / low-confidence cleanup.
   - closed no-runtime at Gate C.
2. UI / input / output honesty pass.
   - closed at Gate C.

Productization route-policy and proposal/report polish slices are
closed. Calculator runtime/source posture stays frozen during the
selected no-stud double-leaf source research slice. The source-catalog
slice has closed no-runtime at Gate C. Additional productization work is
deferred until this calculator source/tolerance decision closes or the
priority explicitly changes.

## Latest Closed Slices

See [CURRENT_STATE.md](./CURRENT_STATE.md) "Latest Closed Slices" table.
`wall_source_catalog_acquisition_v1` Gate C is closed no-runtime and
`wall_no_stud_double_leaf_source_research_v1` Gate A is the next
decision point.

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
