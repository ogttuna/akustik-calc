# Next Implementation Plan

Document role: tactical detail for the **active slice**. Short,
focused, agent-resume friendly. For the strategic picture read
[MASTER_PLAN.md](./MASTER_PLAN.md). For what is stable right now read
[CURRENT_STATE.md](./CURRENT_STATE.md). For the private-use readiness
chain read
[PERSONAL_USE_READINESS_ROADMAP.md](./PERSONAL_USE_READINESS_ROADMAP.md).
For the prepared company-internal operating-envelope slice read
[SLICE_INTERNAL_USE_OPERATING_ENVELOPE_V1_PLAN.md](./SLICE_INTERNAL_USE_OPERATING_ENVELOPE_V1_PLAN.md).
For the long source-gated accuracy program read
[CALCULATOR_COMPREHENSIVE_ACCURACY_ROADMAP.md](./CALCULATOR_COMPREHENSIVE_ACCURACY_ROADMAP.md).

Last reviewed: 2026-04-29
(`wall_no_stud_double_leaf_source_research_v1` Gate C closed
no-runtime; `wall_timber_double_board_source_research_v1` Gate C closed
no-runtime; `wall_clt_wall_source_research_v1` Gate C closed
no-runtime; `wall_lined_massive_heavy_core_source_research_v1` Gate C
closed no-runtime and selected `calculator_source_gap_revalidation_v2`;
`calculator_source_gap_revalidation_v2` Gate A landed no-runtime and
selected `floor_layer_order_invariance_expansion_v1`;
`floor_layer_order_invariance_expansion_v1` Gate A landed no-runtime
and selected Gate C closeout / next-slice selection;
`floor_layer_order_invariance_expansion_v1` Gate C closed no-runtime
and selected `wall_framed_facing_split_warning_stability_v1`;
`wall_framed_facing_split_warning_stability_v1` Gate A landed
no-runtime and selected Gate B value/warning stability fix;
`wall_framed_facing_split_warning_stability_v1` Gate B landed the
bounded LSF field board-split value/warning stability fix and selected
Gate C closeout / next-slice selection;
`wall_framed_facing_split_warning_stability_v1` Gate C closed and
selected `calculator_source_gap_revalidation_v3`;
`calculator_source_gap_revalidation_v3` Gate A landed no-runtime and
selected `internal_use_operating_envelope_v1`;
`internal_use_operating_envelope_v1` Gate A landed no-runtime with the
short company pilot usage note and scenario summary;
`internal_use_operating_envelope_v1` Gate B landed the regular
internal-use visibility audit and selected Gate C closeout /
next-slice selection;
the broad revalidation after Gate B is green;
`internal_use_operating_envelope_v1` Gate C closed no-runtime and
selected `calculator_source_pack_readiness_triage_v1` because no
source-ready accuracy import pack exists;
see
`SLICE_CALCULATOR_SOURCE_PACK_READINESS_TRIAGE_PLAN.md`).

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
  `calculator_source_pack_readiness_triage_v1`.
- **Latest checkpoint**:
  [CHECKPOINT_2026-04-29_INTERNAL_USE_OPERATING_ENVELOPE_GATE_C_CLOSEOUT_HANDOFF.md](./CHECKPOINT_2026-04-29_INTERNAL_USE_OPERATING_ENVELOPE_GATE_C_CLOSEOUT_HANDOFF.md).
- **Planning surface**:
  [SLICE_CALCULATOR_SOURCE_PACK_READINESS_TRIAGE_PLAN.md](./SLICE_CALCULATOR_SOURCE_PACK_READINESS_TRIAGE_PLAN.md).
- **Pilot usage note**:
  [INTERNAL_USE_PILOT_USAGE_NOTE.md](./INTERNAL_USE_PILOT_USAGE_NOTE.md)
  defines the closed company-pilot operating envelope and scenario
  summary.
- **Just closed planning surface**:
  [SLICE_INTERNAL_USE_OPERATING_ENVELOPE_V1_PLAN.md](./SLICE_INTERNAL_USE_OPERATING_ENVELOPE_V1_PLAN.md)
  closed no-runtime at Gate C and selected the source-pack readiness
  triage slice.
- **Latest broad validation**:
  `pnpm check` is green after the internal-use Gate C closeout: engine
  265 files / 1444 tests, web 157 files / 890 passed + 18 skipped,
  build 5/5 with the known non-fatal `sharp/@img` warnings. The focused
  current gate is also green after Gate C: engine 132 files / 624 tests,
  web 45 files / 216 passed + 18 skipped, build 5/5, whitespace guard
  clean.
- **Prepared comprehensive-accuracy roadmap**:
  [CALCULATOR_COMPREHENSIVE_ACCURACY_ROADMAP.md](./CALCULATOR_COMPREHENSIVE_ACCURACY_ROADMAP.md)
  records the longer source-gated program. It is roadmap context for the
  selected triage slice, not an active runtime import.
- **Personal-use readiness roadmap**:
  [PERSONAL_USE_READINESS_ROADMAP.md](./PERSONAL_USE_READINESS_ROADMAP.md)
  is closed for the current private/internal-use bar. Heavy-core/concrete
  remains screening, timber stud + CLT wall remain formula/source-gated
  until new source evidence appears, floor fallback remains
  low-confidence until new source evidence or a bounded family rule
  appears, and UI/input/output honesty is validated.

## Next Three Steps

1. Implement
   `packages/engine/src/calculator-source-pack-readiness-triage-gate-a-contract.test.ts`.
2. Rank timber double-board, CLT/mass-timber, lined/heavy-core,
   no-stud double-leaf, generated floor fallback, and historical
   blocked families by source-pack readiness without runtime, support,
   confidence, evidence-tier, API, route-card, or output-card movement.
3. Select a narrow source-research slice only if Gate A can name exact
   topology, metric owner, tolerance owner, protected negative
   boundaries, and paired engine/web tests. Otherwise keep
   [CALCULATOR_COMPREHENSIVE_ACCURACY_ROADMAP.md](./CALCULATOR_COMPREHENSIVE_ACCURACY_ROADMAP.md)
   as roadmap context.

- **Just closed**: `internal_use_operating_envelope_v1` Gate C.
  `packages/engine/src/post-internal-use-operating-envelope-v1-next-slice-selection-contract.test.ts`
  closes the operating-envelope slice no-runtime, preserves Gate B
  visible-honesty wording as the only behavior movement, keeps dynamic
  wall formula routes source-gated scoped estimates, keeps generated
  steel floor fallback low-confidence/screening with `L'nT,50`
  unsupported, and selects `calculator_source_pack_readiness_triage_v1`
  because no source-ready accuracy import pack exists.

- **Prior readiness checkpoint**: `internal_use_operating_envelope_v1`
  broad clean stop / Gate C readiness.
  [CHECKPOINT_2026-04-28_INTERNAL_USE_OPERATING_ENVELOPE_CLEAN_STOP_GATE_C_READY_HANDOFF.md](./CHECKPOINT_2026-04-28_INTERNAL_USE_OPERATING_ENVELOPE_CLEAN_STOP_GATE_C_READY_HANDOFF.md)
  recorded the docs/implementation comparison before Gate C. Gate B was
  landed, focused and broad validation were green, and no source-ready
  accuracy pack was identified.

- **Prior readiness checkpoint**: `internal_use_operating_envelope_v1`
  broad
  Gate C readiness.
  [CHECKPOINT_2026-04-28_INTERNAL_USE_OPERATING_ENVELOPE_BROAD_REVALIDATION_GATE_C_READY_HANDOFF.md](./CHECKPOINT_2026-04-28_INTERNAL_USE_OPERATING_ENVELOPE_BROAD_REVALIDATION_GATE_C_READY_HANDOFF.md)
  records the full repo result. `pnpm check` is green after a
  type-only cleanup in the framed split Gate A/B tests. The broad green
  result did not reopen any source-gated runtime family.

- **Just landed**: `internal_use_operating_envelope_v1` Gate B.
  `packages/engine/src/internal-use-operating-envelope-v1-gate-b-contract.test.ts`
  and
  `apps/web/features/workbench/internal-use-operating-envelope-visibility-gate-b.test.ts`
  audit the caveated regular internal-use scenario set. Runtime,
  support, confidence, evidence tier, API shape, route-card values, and
  output-card statuses did not move. Dynamic wall formula routes now
  carry explicit formula-owned/source-gated scoped-estimate language in
  validation, evidence, and proposal/report surfaces. The generated
  steel floor fallback remains low-confidence/screening and `L'nT,50`
  unsupported. Targeted validation is green: web Gate B 1 file / 4
  tests; web related surfaces 6 files / 27 tests; engine Gate B 1 file
  / 5 tests. Focused current gate is green after docs/runner sync: 131
  engine files / 618 tests, 45 web files / 216 passed + 18 skipped,
  build 5/5 with known non-fatal `sharp/@img` warnings.

- **Just landed**: `internal_use_operating_envelope_v1` Gate A.
  [INTERNAL_USE_PILOT_USAGE_NOTE.md](./INTERNAL_USE_PILOT_USAGE_NOTE.md)
  and
  `packages/engine/src/internal-use-operating-envelope-v1-gate-a-contract.test.ts`
  define the short company pilot operating envelope. The scenario matrix
  separates exact/benchmark/source-backed lanes from low-confidence,
  screening, source-gated, unsupported, and fail-closed lanes. Runtime,
  support, confidence, evidence, API, and route-card behavior did not
  move. Targeted Gate A validation is green: 1 file / 6 tests.

- **Just landed**: `calculator_source_gap_revalidation_v3` Gate A.
  `packages/engine/src/calculator-source-gap-revalidation-v3-gate-a-contract.test.ts`
  lands no-runtime source/readiness rerank. It keeps the framed split
  fix closed, keeps wall source holdouts and floor fallback blocked,
  treats public source candidates as research intake only, keeps the
  comprehensive accuracy program as roadmap work, and selects
  `internal_use_operating_envelope_v1` because the short company pilot
  needs a clear operating envelope before regular internal-use
  hardening. Targeted Gate A validation is green: 1 file / 6 tests.

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
- **Just landed**: `wall_no_stud_double_leaf_source_research_v1` Gate A.
  `packages/engine/src/wall-no-stud-double-leaf-source-research-gate-a-contract.test.ts`
  lands no-runtime source/formula research. It keeps current empty
  (`R'w=46`, `Rw=48`) and porous (`R'w=41`, `Rw=43`) no-stud routes
  formula-owned, classifies gypsum-block double-wall rows as
  direct-family but adjacent material, selects Davy/Sharp formula
  tolerance and NRC row extraction for Gate B, and rejects stud/framed
  context as an import unlock.
- **Just landed**: `wall_no_stud_double_leaf_source_research_v1` Gate B.
  `packages/engine/src/wall-no-stud-double-leaf-source-research-gate-b-contract.test.ts`
  lands no-runtime formula-tolerance and direct-row feasibility. It
  keeps Davy/Sharp as relevant scope but rejects runtime ownership until
  local route inputs and single-number `Rw` tolerances are derived,
  keeps NRC as a useful row archive but rejects import until no-stud /
  no-rail / no-coupling row proof and live material/cavity mapping are
  extracted, keeps gypsum-block rows adjacent-material only, and selects
  Gate C no-runtime closeout / next-slice selection.
- **Just closed**: `wall_no_stud_double_leaf_source_research_v1` Gate C.
  `packages/engine/src/post-wall-no-stud-double-leaf-source-research-v1-next-slice-selection-contract.test.ts`
  closes the source-research slice no-runtime and selects
  `wall_timber_double_board_source_research_v1`. Current no-stud empty
  (`R'w=46`, `Rw=48`) and porous (`R'w=41`, `Rw=43`) routes stay
  formula-owned. The next slice must inventory direct double-board
  timber stud rows, adjacent single-board/resilient rows, formula or
  tolerance candidates, and negative boundaries before any runtime,
  confidence, support, evidence, or route-card behavior changes.
- **Just landed**: `wall_timber_double_board_source_research_v1` Gate A.
  `packages/engine/src/wall-timber-double-board-source-research-gate-a-contract.test.ts`
  lands no-runtime source/tolerance inventory. It pins the current
  generated `wall-timber-stud` route at lab `Rw=50`, field `R'w=42`,
  generated field-context `DnT,w=43`, workbench building-context
  `DnT,w=44`, low confidence, and
  `stud_surrogate_blend+framed_wall_calibration`. It classifies direct
  single-board timber rows as adjacent, RB1/RB2 resilient rows as
  side-count-bounded adjacent evidence, Gyproc A026025 as a secondary
  direct double-board benchmark that does not match the live stack, and
  linked steel holdouts as non-timber context. No direct import or
  formula/tolerance Gate B is ready; next is Gate C no-runtime closeout
  / next-slice selection.
- **Just closed**: `wall_timber_double_board_source_research_v1` Gate C.
  `packages/engine/src/post-wall-timber-double-board-source-research-v1-next-slice-selection-contract.test.ts`
  closes the timber double-board source-research slice no-runtime and
  selects `wall_clt_wall_source_research_v1`. Current timber
  double-board values stay formula-owned and low-confidence. The next
  slice must inventory wall-specific CLT rows, laminated-leaf formula or
  tolerance references, Dataholz/floor-only negative boundaries,
  metadata completeness, and selected next action before any runtime,
  confidence, support, evidence, API, or route-card behavior changes.
- **Just landed**: `wall_clt_wall_source_research_v1` Gate A.
  `packages/engine/src/wall-clt-wall-source-research-gate-a-contract.test.ts`
  lands no-runtime source/tolerance inventory. It pins the current
  generated `wall-clt-local` route at lab `Rw=42`, field `R'w=41`,
  field-context `DnT,w=42`, medium confidence, and
  `laminated_leaf_sharp_delegate`. It classifies Dataholz CLT rows as
  floor-only source truth, wall-specific CLT / mass-timber rows as
  missing, the laminated-leaf tolerance owner as missing, and report /
  product-delta CLT context as non-source. No direct import or
  formula/tolerance Gate B is ready; next is Gate C no-runtime closeout
  / next-slice selection.
- **Just closed**: `wall_clt_wall_source_research_v1` Gate C.
  `packages/engine/src/post-wall-clt-wall-source-research-v1-next-slice-selection-contract.test.ts`
  closes the CLT wall source-research slice no-runtime and selects
  `wall_lined_massive_heavy_core_source_research_v1`. Current CLT wall
  values stay formula-owned and medium-confidence. The next slice must
  inventory wall-specific lined concrete / heavy masonry rows,
  manufacturer wall-lining rows, bounded formula/tolerance candidates,
  and selector/deep-hybrid negative boundaries before any runtime,
  confidence, support, evidence, API, or route-card behavior changes.
- **Just landed**:
  `wall_lined_massive_heavy_core_source_research_v1` Gate A.
  `packages/engine/src/wall-lined-massive-heavy-core-source-research-gate-a-contract.test.ts`
  lands no-runtime source/bounded-lining-rule inventory. It pins the
  current `wall-screening-concrete` route at lab `Rw=57`, field
  `R'w=55`, `DnT,w=56`, `DnT,A=54.9`, medium confidence,
  `lined_massive_wall`, and `lined_massive_blend`. It keeps Knauf CC60
  rows floor-only, classifies wall-specific lined concrete / heavy
  masonry rows as missing, manufacturer wall-lining context as adjacent
  and unimported, formula-framework context as unbounded, selector and
  deep-hybrid rows as stability boundaries, and the old heavy-core Gate
  B audit as frozen baseline context. No direct import or
  formula/tolerance Gate B is ready; next is Gate C no-runtime closeout
  / next-slice selection.
- **Previously closed**: `proposal_report_polish_v1`.
  Simple PDF/DOCX exports now include output coverage posture,
  generated proposal documents preserve real floor/wall workbench
  caveats, and many-layer / long-label report rendering is pinned.
  This did not change calculator runtime/source/confidence posture.
- **Latest broad validation**: 2026-04-29 `pnpm check` is green after
  the internal-use Gate C closeout: engine 265 files / 1444 tests, web
  157 files / 890 passed + 18 skipped through
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
- **Wall no-stud double-leaf source research Gate A**:
  `packages/engine/src/wall-no-stud-double-leaf-source-research-gate-a-contract.test.ts`
  lands no-runtime. It pins current live route posture, direct-family
  but non-importable gypsum-block candidates, Davy/Sharp formula
  tolerance candidacy, NRC row-extraction candidacy, stud/framed
  negative boundaries, and the Gate B no-runtime feasibility decision.
  Targeted Gate A validation is green: 1 file / 6 tests.
- **Wall no-stud double-leaf source research Gate B**:
  `packages/engine/src/wall-no-stud-double-leaf-source-research-gate-b-contract.test.ts`
  lands no-runtime. It pins formula-tolerance acceptance criteria,
  rejects Davy/Sharp as a current runtime tolerance owner until a local
  tolerance derivation exists, rejects NRC and gypsum-block candidates
  as direct imports until row/topology proof exists, preserves current
  empty and porous values, and selects Gate C closeout. Targeted Gate B
  validation is green: 1 file / 6 tests.
- **Wall no-stud double-leaf source research Gate C**:
  `packages/engine/src/post-wall-no-stud-double-leaf-source-research-v1-next-slice-selection-contract.test.ts`
  closes the source-research slice no-runtime, keeps current no-stud
  values frozen, and selects
  `wall_timber_double_board_source_research_v1`. Targeted Gate C
  validation is green: 1 file / 5 tests.
- **Wall timber double-board source research Gate A**:
  `packages/engine/src/wall-timber-double-board-source-research-gate-a-contract.test.ts`
  lands no-runtime. It pins current live route posture, direct
  single-board timber exact rows as adjacent, RB1/RB2 resilient exact
  rows as side-count-bounded adjacent evidence, Gyproc A026025 as a
  secondary benchmark, linked steel holdouts as non-timber context, and
  no named bounded formula/tolerance owner. Gate A selects Gate C
  no-runtime closeout / next-slice selection. Targeted Gate A validation
  is green: 1 file / 5 tests.
- **Wall timber double-board source research Gate C**:
  `packages/engine/src/post-wall-timber-double-board-source-research-v1-next-slice-selection-contract.test.ts`
  closes the source-research slice no-runtime, keeps current timber
  double-board values frozen, and selects
  `wall_clt_wall_source_research_v1`. Targeted Gate C validation is
  green: 1 file / 5 tests.
- **Wall CLT wall source research Gate A**:
  `packages/engine/src/wall-clt-wall-source-research-gate-a-contract.test.ts`
  lands no-runtime. It pins current live route posture, Dataholz CLT
  floor exact rows as floor-only source truth, missing wall-specific CLT
  rows, missing laminated-leaf tolerance owner, report/product-delta
  non-source context, and the Gate C no-runtime closeout decision.
  Targeted Gate A validation is green: 1 file / 5 tests.
- **Wall CLT wall source research Gate C**:
  `packages/engine/src/post-wall-clt-wall-source-research-v1-next-slice-selection-contract.test.ts`
  closes the source-research slice no-runtime, keeps current CLT wall
  values frozen, and selects
  `wall_lined_massive_heavy_core_source_research_v1`. Targeted Gate C
  validation is green: 1 file / 5 tests.
- **Wall lined massive / heavy-core source research Gate A**:
  `packages/engine/src/wall-lined-massive-heavy-core-source-research-gate-a-contract.test.ts`
  lands no-runtime. It pins current live route posture, floor-only Knauf
  CC60 rows, missing wall-specific rows, adjacent manufacturer lining
  context, unbounded formula context, selector/deep-hybrid stability
  boundaries, and the Gate C no-runtime closeout decision. Targeted
  Gate A validation is green: 1 file / 5 tests.
- **Wall lined massive / heavy-core source research Gate C**:
  `packages/engine/src/post-wall-lined-massive-heavy-core-source-research-v1-next-slice-selection-contract.test.ts`
  closes the source-research slice no-runtime, keeps current
  lined-massive / heavy-core values frozen, and selects
  `calculator_source_gap_revalidation_v2`. The next slice must
  re-rank remaining floor/wall source and accuracy gaps after the wall
  source-research chain closed no-runtime. Targeted Gate C validation
  is green: 1 file / 5 tests.
- **Calculator source-gap revalidation v2 Gate A**:
  `packages/engine/src/calculator-source-gap-revalidation-v2-gate-a-contract.test.ts`
  lands no-runtime. It keeps wall source-chain holdouts, floor fallback,
  and historical blocked-source families closed, recognizes floor
  field-continuation as already audited, defers optional architecture
  and productization-only work, and selects
  `floor_layer_order_invariance_expansion_v1` because user layer
  reorder/edit behavior is the ready engine-addressable accuracy risk.
  Targeted Gate A validation is green: 1 file / 6 tests.
- **Floor layer-order invariance expansion Gate A**:
  `packages/engine/src/floor-layer-order-invariance-expansion-gate-a-contract.test.ts`
  lands no-runtime. It proves role-defined UBIQ FL-28 and Dataholz
  GDMTXN01 exact floor rows remain exact under reverse, rotate,
  base-first, grouped-by-role, and interleaved UI order edits; keeps raw
  terminal concrete helper support changes explicit; keeps raw open-web
  impact outputs fail-closed after reorder; and keeps many-layer split
  raw concrete stacks finite without exact/bound promotion. Gate B is
  not required; the next action is Gate C no-runtime closeout /
  next-slice selection. Targeted Gate A validation is green: 1 file / 6
  tests.
- **Floor layer-order invariance expansion Gate C**:
  `packages/engine/src/post-floor-layer-order-invariance-expansion-v1-next-slice-selection-contract.test.ts`
  closes the expanded floor-order slice no-runtime. It keeps broad
  arbitrary raw floor reorder value invariance unclaimed, keeps source
  families closed, and selects
  `wall_framed_facing_split_warning_stability_v1` because F3 is the
  remaining documented non-source-blocked calculator drift. Targeted
  Gate C validation is green: 1 file / 5 tests.
- **Wall framed facing split warning stability Gate A**:
  `packages/engine/src/wall-framed-facing-split-warning-stability-gate-a-contract.test.ts`
  lands no-runtime. It pins representative LSF and timber framed wall
  board splits across lab and field contexts. The old warning-only F3
  description is incomplete in the current implementation: LSF lab
  stays exact at `Rw=55`, timber lab/field stays stable, but LSF
  field/building board splits move `R'w`, `Dn,w`, `Dn,A`, `DnT,w`,
  `DnT,A`, and `STC` by +1 dB and add the framed reinforcement
  monotonic-floor warning. Gate A keeps route cards frozen, preserves
  the no-global-board-coalescing boundary, and selects Gate B
  value/warning stability fix. Targeted Gate A validation is green:
  1 file / 5 tests.
- **Wall framed facing split warning stability Gate B**:
  `packages/engine/src/wall-framed-facing-split-warning-stability-gate-b-contract.test.ts`
  lands the bounded runtime fix. LSF field/building board splits now
  keep the Gate A baseline values (`R'w=51`, `Dn,w=51`, `Dn,A=49.6`,
  `DnT,w=52`, `DnT,A=51.1`, `STC=51`, `C=-1.4`, `Ctr=-6.4`) and no
  longer add the framed reinforcement monotonic-floor warning. LSF lab
  exact and timber lab/field remain stable; coalesced 25 mm boards per
  face remain a different topology at `R'w=38`. Paired web route-card
  coverage pins the visible cards and acoustic warnings while leaving
  ordinary guided sanity notes honest for 6.25 mm split fragments.
  Targeted Gate B validation is green: 1 file / 5 tests, and the web
  route-card matrix is green: 1 file / 1 test.
- **Wall framed facing split warning stability Gate C**:
  `packages/engine/src/post-wall-framed-facing-split-warning-stability-v1-next-slice-selection-contract.test.ts`
  closes the slice no-runtime after the Gate B fix and selects
  `calculator_source_gap_revalidation_v3`. The framed split fix stays
  local; source-blocked wall/floor families and floor fallback are not
  reopened from this green result. The next first-gate file is
  `packages/engine/src/calculator-source-gap-revalidation-v3-gate-a-contract.test.ts`.

## Immediate Execution Order

`internal_use_operating_envelope_v1` should now proceed in this order:

1. Re-read
   [CHECKPOINT_2026-04-28_INTERNAL_USE_OPERATING_ENVELOPE_GATE_B_HANDOFF.md](./CHECKPOINT_2026-04-28_INTERNAL_USE_OPERATING_ENVELOPE_GATE_B_HANDOFF.md),
   [SLICE_INTERNAL_USE_OPERATING_ENVELOPE_V1_PLAN.md](./SLICE_INTERNAL_USE_OPERATING_ENVELOPE_V1_PLAN.md),
   [INTERNAL_USE_PILOT_USAGE_NOTE.md](./INTERNAL_USE_PILOT_USAGE_NOTE.md),
   and the current-state active-slice section.
2. Add
   `packages/engine/src/post-internal-use-operating-envelope-v1-next-slice-selection-contract.test.ts`
   as the Gate C closeout / next-slice selection contract.
3. Confirm Gate A pilot-ready/caveated/fail-closed scenario ownership
   and Gate B visible-honesty coverage still match implementation.
4. Select the next bounded calculator target without runtime, support,
   confidence, evidence, API, or route-card movement unless Gate C names
   a source-ready accuracy pack.
5. Update `NEXT_IMPLEMENTATION_PLAN.md`, `CURRENT_STATE.md`,
   `MASTER_PLAN.md`, `README.md`, `SOURCE_GAP_LEDGER.md`, `AGENTS.md`,
   and the Gate C handoff together.
6. Validate with the targeted Gate C test,
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
selected internal-use operating-envelope closeout unless a selected
Gate C contract names a source-ready accuracy pack. The landed
framed-wall split fix remains protected, and the no-stud, timber
double-board, CLT wall, lined-massive / heavy-core source research, and
floor layer-order invariance expansion slices have closed no-runtime at
Gate C. Additional productization work is deferred until this calculator
operating-envelope slice closes or the priority explicitly changes.

## Latest Closed Slices

See [CURRENT_STATE.md](./CURRENT_STATE.md) "Latest Closed Slices" table.
`wall_timber_double_board_source_research_v1` Gate C is closed
no-runtime and `wall_clt_wall_source_research_v1` Gate C is closed
no-runtime. `wall_lined_massive_heavy_core_source_research_v1` Gate C
is closed no-runtime and selected `calculator_source_gap_revalidation_v2`.
`calculator_source_gap_revalidation_v2` Gate A has landed no-runtime
and selected `floor_layer_order_invariance_expansion_v1`. Floor order
invariance Gate A has landed no-runtime and selected Gate C closeout /
next-slice selection. Floor order invariance Gate C has closed
no-runtime and selected `wall_framed_facing_split_warning_stability_v1`.
Framed-wall split warning stability Gate A has landed no-runtime and
selected Gate B LSF field board-split value/warning stability fix. Gate
B has landed that bounded fix and selected Gate C closeout /
next-slice selection. Gate C has closed the framed split slice and
selected `calculator_source_gap_revalidation_v3`. Source-gap
revalidation v3 Gate A then selected `internal_use_operating_envelope_v1`;
internal-use Gate A landed the pilot pack, and Gate B landed the
regular internal-use visibility audit. The next selected action is Gate
C closeout / next-slice selection.

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
