# DynEcho

This repository is the new product track for DynEcho.

Current scope:

- Build a production web application around the existing acoustic calculation domain.
- Keep the calculation engine portable so it can later power a desktop app.
- Treat `/home/ogttuna/Dev/Machinity/Acoustic2` as an external upstream source, not as a working directory for this repo.

Project status:

- Monorepo scaffold is in place.
- A first web shell exists in `apps/web`.
- A seed `engine`, `catalogs`, `shared`, and `ui` package set exists.
- Docker build and compose structure exist.
- The web app now has auth-gated workbench flows and proposal PDF/DOCX export.
- Server-backed project storage v1 is available through explicit
  workbench sync/list/load; editing remains local-first.
- Project access roles/actions now have a shared pure policy contract,
  but project/proposal routes remain owner-scoped; route integration is
  deferred while the active slice returns to calculator accuracy and
  coverage.
- No code should be copied from `Acoustic2` until the import policy in [`docs/foundation/SOURCE_REPO_POLICY.md`](./docs/foundation/SOURCE_REPO_POLICY.md) is followed.

Primary calculator documents:

- [`docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md`](./docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md) — first authority for product goal, anti-drift rules, and next-slice selection
- [`docs/calculator/USABLE_V1_EXECUTION_PLAN.md`](./docs/calculator/USABLE_V1_EXECUTION_PLAN.md) — closed company-internal usable V1 acceptance contract
- [`docs/calculator/CURRENT_STATE.md`](./docs/calculator/CURRENT_STATE.md) — current implementation snapshot
- [`docs/calculator/NEXT_IMPLEMENTATION_PLAN.md`](./docs/calculator/NEXT_IMPLEMENTATION_PLAN.md) — active tactical slice
- [`docs/calculator/POST_V1_GATE_FE_FF_CURRENT_FORMULA_SCOPE_ACCURACY_LEDGER_PLAN_2026-06-09.md`](./docs/calculator/POST_V1_GATE_FE_FF_CURRENT_FORMULA_SCOPE_ACCURACY_LEDGER_PLAN_2026-06-09.md) — landed Gate FE rerank, landed Gate FF formula scope ledger, and selected post double-leaf revalidation
- [`docs/calculator/POST_V1_GATE_FD_FE_FLOOR_RAW_BARE_FLOATING_HOLDOUT_CLOSEOUT_PLAN_2026-06-09.md`](./docs/calculator/POST_V1_GATE_FD_FE_FLOOR_RAW_BARE_FLOATING_HOLDOUT_CLOSEOUT_PLAN_2026-06-09.md) — landed Gate FD holdout owner rejection and selected Gate FE rerank
- [`docs/calculator/POST_V1_GATE_FC_FD_FLOOR_RAW_BARE_FLOATING_HOLDOUT_PLAN_2026-06-09.md`](./docs/calculator/POST_V1_GATE_FC_FD_FLOOR_RAW_BARE_FLOATING_HOLDOUT_PLAN_2026-06-09.md) — landed Gate FC rerank and selected Gate FD floor holdout plan
- [`docs/calculator/POST_V1_GATE_FB_FC_OPENING_LEAK_COMMON_WALL_OWNER_CLOSEOUT_AND_NEXT_NUMERIC_GAP_PLAN_2026-06-09.md`](./docs/calculator/POST_V1_GATE_FB_FC_OPENING_LEAK_COMMON_WALL_OWNER_CLOSEOUT_AND_NEXT_NUMERIC_GAP_PLAN_2026-06-09.md) — landed Gate FB owner rejection and selected Gate FC rerank plan
- [`docs/calculator/POST_V1_GATE_FA_FB_OPENING_LEAK_COMMON_WALL_RESIDUAL_OWNER_PLAN_2026-06-09.md`](./docs/calculator/POST_V1_GATE_FA_FB_OPENING_LEAK_COMMON_WALL_RESIDUAL_OWNER_PLAN_2026-06-09.md) — landed Gate FA ledger and selected Gate FB residual owner plan
- [`docs/calculator/POST_V1_GATE_EZ_FA_CURRENT_COVERAGE_ACCURACY_GAP_LEDGER_PLAN_2026-06-09.md`](./docs/calculator/POST_V1_GATE_EZ_FA_CURRENT_COVERAGE_ACCURACY_GAP_LEDGER_PLAN_2026-06-09.md) — landed Gate EZ rerank and selected Gate FA current ledger plan
- [`docs/calculator/POST_V1_GATE_EY_EZ_HEAVY_CORE_LINED_MASSIVE_TARGETED_EVIDENCE_CLOSEOUT_PLAN_2026-06-09.md`](./docs/calculator/POST_V1_GATE_EY_EZ_HEAVY_CORE_LINED_MASSIVE_TARGETED_EVIDENCE_CLOSEOUT_PLAN_2026-06-09.md) — landed Gate EY targeted evidence closeout and selected Gate EZ rerank plan
- [`docs/calculator/POST_V1_GATE_EX_EY_HEAVY_CORE_LINED_MASSIVE_TARGETED_EVIDENCE_PLAN_2026-06-09.md`](./docs/calculator/POST_V1_GATE_EX_EY_HEAVY_CORE_LINED_MASSIVE_TARGETED_EVIDENCE_PLAN_2026-06-09.md) — landed Gate EX rerank and selected Gate EY targeted evidence plan
- [`docs/calculator/POST_V1_GATE_EV_EW_HEAVY_CORE_LINED_MASSIVE_CALIBRATION_OWNER_PLAN_2026-06-09.md`](./docs/calculator/POST_V1_GATE_EV_EW_HEAVY_CORE_LINED_MASSIVE_CALIBRATION_OWNER_PLAN_2026-06-09.md) — landed Gate EV ledger and selected Gate EW owner-proof plan
- [`docs/calculator/POST_V1_GATE_EU_EV_CURRENT_COVERAGE_ACCURACY_GAP_LEDGER_PLAN_2026-06-09.md`](./docs/calculator/POST_V1_GATE_EU_EV_CURRENT_COVERAGE_ACCURACY_GAP_LEDGER_PLAN_2026-06-09.md) — landed Gate EU rerank and selected Gate EV ledger plan
- [`docs/calculator/POST_V1_GATE_ES_ET_REINFORCED_CONCRETE_VISIBLE_DERIVED_BOUNDARY_PLAN_2026-06-08.md`](./docs/calculator/POST_V1_GATE_ES_ET_REINFORCED_CONCRETE_VISIBLE_DERIVED_BOUNDARY_PLAN_2026-06-08.md) — landed Gate ES/ET boundary plan
- [`docs/calculator/POST_V1_GATE_EQ_ER_WALL_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_RUNTIME_PLAN_2026-06-08.md`](./docs/calculator/POST_V1_GATE_EQ_ER_WALL_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_RUNTIME_PLAN_2026-06-08.md) — landed Gate ER runtime plan
- [`docs/calculator/CHECKPOINT_2026-06-08_DOUBLE_LEAF_ROUTE_INPUT_BOUNDARY_CHECKPOINT.md`](./docs/calculator/CHECKPOINT_2026-06-08_DOUBLE_LEAF_ROUTE_INPUT_BOUNDARY_CHECKPOINT.md) — double-leaf route-input boundary checkpoint
- [`docs/calculator/POST_V1_THICK_BOARD_AUTO_FAMILY_BOUNDARY_SAFETY_PLAN_2026-06-09.md`](./docs/calculator/POST_V1_THICK_BOARD_AUTO_FAMILY_BOUNDARY_SAFETY_PLAN_2026-06-09.md) — latest bounded route-family safety follow-up

Current selection rule: the source-of-truth and next implementation plan
select the next calculator slice. The checkpoint and thick-board safety
plan are landed records; they preserve boundaries but do not replace the
current post double-leaf revalidation selected next action.

Calculator north star: broaden and improve the dynamic acoustic engine.
Measured rows are preferred when owned, but they will never cover every
layer combination. New calculator work must either let more physically
valid layer stacks calculate owned outputs from formulas and required
inputs, or make an existing route more accurate without weakening metric
basis, `needs_input`, or `unsupported` boundaries.

Latest calculator formula scope ledger:

- `post_v1_current_formula_scope_accuracy_gap_ledger_gate_ff_plan`
  landed with status
  `post_v1_current_formula_scope_accuracy_gap_ledger_gate_ff_landed_no_runtime_selected_post_double_leaf_framed_wall_banded_coverage_revalidation`.
- Selected candidate:
  `wall.double_leaf_framed_post_runtime_coverage_revalidation_after_direct_fixed_gate_er`.
- Gate FF subtracts already-live single-leaf mass-law,
  non-direct-fixed double-leaf/framed, direct-fixed double-leaf
  field/building, historical candidate-matrix/company-internal rehearsal,
  Gate FD floor holdout, Gate FB opening/leak common-wall residual, Gate
  EY heavy-core / lined-massive, and broad-source-crawl lanes.
- Gate FF selected:
  `layer_combination_resolver_post_double_leaf_framed_wall_banded_coverage_revalidation_plan`
  in
  `packages/engine/src/layer-combination-resolver-post-double-leaf-framed-wall-banded-coverage-revalidation-contract.test.ts`.
- Counters: `candidateCount 10`, `roiAnalysisIterations: 2`,
  `estimatedNextPostDoubleLeafRevalidationRows 1`,
  `estimatedNextRuntimeCandidateFamiliesToRerank 4`,
  `closedRuntimeRowsRechecked 5`, `blockedOwnerOrHoldoutRows 3`,
`openHistoricalSelectedNextFilesStillMissing 1`,
  `immediateRuntimeCandidatesSelected 0`,
  `newCalculableLayerTemplates 0`, `newCalculableRequestShapes 0`,
  `runtimeBasisPromotions 0`, `runtimeFormulaRetunes 0`,
  `runtimeValuesMoved 0`, `sourceRowsImported: 0`, and
  `frontendImplementationFilesTouched: 0`.

Previous calculator rerank:

- `post_v1_next_numeric_coverage_gap_gate_fe_plan` landed with status
  `post_v1_next_numeric_coverage_gap_gate_fe_landed_no_runtime_selected_current_formula_scope_accuracy_gap_ledger_gate_ff`.
- Selected candidate:
  `calculator.current_formula_scope_accuracy_gap_ledger_after_gate_fd_closeout`.
- Gate FE subtracts Gate FD floor holdout rejection, Gate FB
  opening/leak and common-wall owner rejection, Gate EY heavy-core /
  lined-massive owner rejection, stale cartography `runtime_widening`
  labels for heavy-core, timber stud, CLT, and steel fallback, and the
  blocked Rockwool source packet lane. Gate FE is not a broad source
  crawl and moves no runtime values.
- Gate FE selected:
  `post_v1_current_formula_scope_accuracy_gap_ledger_gate_ff_plan` in
  `packages/engine/src/post-v1-current-formula-scope-accuracy-gap-ledger-gate-ff-contract.test.ts`.
- Counters: `candidateCount 10`, `roiAnalysisIterations: 2`,
  `estimatedNextFormulaScopeLedgerRows 1`,
  `estimatedNextRuntimeCandidateFamiliesToEvaluate 6`,
  `staleCartographyRuntimeWideningRows 4`,
  `blockedOwnerOrHoldoutRows 3`,
  `sourcePacketRowsRejectedAsCurrentRuntime 1`,
  `immediateRuntimeCandidatesSelected 0`,
  `newCalculableLayerTemplates 0`, `newCalculableRequestShapes 0`,
  `runtimeBasisPromotions 0`, `runtimeFormulaRetunes 0`,
  `runtimeValuesMoved 0`, `sourceRowsImported: 0`, and
  `frontendImplementationFilesTouched: 0`.

Previous calculator holdout closeout:

- `post_v1_floor_raw_bare_and_floating_same_basis_holdout_gate_fd_plan`
  landed with status
  `post_v1_floor_raw_bare_and_floating_same_basis_holdout_gate_fd_landed_no_runtime_owner_rejected_selected_next_numeric_coverage_gap_gate_fe`.
- Owner rejected:
  `floor.raw_bare_and_floating.same_basis_holdout_owner_rejected_missing_admissible_holdouts`.
- Gate FD evaluated only the three Gate CL floor residual ledgers:
  open-box raw-bare lab impact, open-web raw-bare lab impact, and Gate
  CH heavy-floating field companion. All three still lack admissible
  same-basis holdout evidence, so runtime values and budgets remain
  frozen.
- Gate FD selected:
  `post_v1_next_numeric_coverage_gap_gate_fe_plan` in
  `packages/engine/src/post-v1-next-numeric-coverage-gap-gate-fe-contract.test.ts`.
- Counters: `ownerLedgersRejected 3`, `admissibleHoldoutLedgers 0`,
  `evaluatedGateCLResidualLedgers 3`,
  `rejectedCandidateEvidenceLedgers 6`, `boundaryLedgersPinned 7`,
  `runtimeBudgetTighteningAdmitted 0`, `broadSourceCrawlSelected
  false`, `newCalculableLayerTemplates 0`, `newCalculableRequestShapes
  0`, `runtimeBasisPromotions 0`, `runtimeFormulaRetunes 0`,
  `runtimeValuesMoved 0`, `sourceRowsImported: 0`, and
  `frontendImplementationFilesTouched: 0`.

Previous calculator rerank:

- `post_v1_next_numeric_coverage_gap_gate_fc_plan` landed with status
  `post_v1_next_numeric_coverage_gap_gate_fc_landed_no_runtime_selected_floor_raw_bare_and_floating_same_basis_holdout_gate_fd`.
- Selected candidate:
  `floor.raw_bare_and_floating_same_basis_holdout_prerequisite_after_gate_fb`.
- Gate FC subtracts Gate FB-rejected opening/leak/common-wall budget
  tightening, Gate EY/EW-rejected heavy-core retune, and already-closed
  direct-fixed, reinforced-concrete visible-derived, thick-board safety,
  ASTM exact-band, and steel visible input-surface repeats.
- No safe immediate value-moving runtime candidate remains from current
  evidence, so Gate FC selected Gate FD, a bounded targeted same-basis
  holdout prerequisite for floor raw-bare/floating residual accuracy.
  This is not a broad source crawl.
- Gate FC selected:
  `post_v1_floor_raw_bare_and_floating_same_basis_holdout_gate_fd_plan`
  in
  `packages/engine/src/post-v1-floor-raw-bare-and-floating-same-basis-holdout-gate-fd-contract.test.ts`.
- Counters: `candidateCount 10`, `roiAnalysisIterations: 2`,
  `blockedByGateFBOwnerRejectionRows 2`,
  `blockedHeavyCoreOwnerRejectedRows 1`, `closedRepeatRows 5`,
  `estimatedNextTargetedHoldoutLedgers 3`,
  `floorResidualLedgersSelected 3`, `immediateRuntimeCandidatesSelected
  0`, `broadSourceCrawlSelected false`,
  `newCalculableLayerTemplates 0`, `newCalculableRequestShapes 0`,
  `runtimeBasisPromotions 0`, `runtimeFormulaRetunes 0`,
  `runtimeValuesMoved 0`, `sourceRowsImported: 0`, and
  `frontendImplementationFilesTouched: 0`.

Latest calculator owner closeout:

- `post_v1_opening_leak_common_wall_same_basis_residual_owner_gate_fb_plan`
  landed with status
  `post_v1_opening_leak_common_wall_same_basis_residual_owner_gate_fb_landed_no_runtime_owner_rejected_selected_next_numeric_coverage_gap_gate_fc`.
- Owner rejected:
  `wall.opening_leak_common_wall.same_basis_residual_owner_rejected_missing_holdouts`.
- Gate FB rejected runtime budget tightening for
  `wall.opening_leak_common_wall_same_basis_residual_owner_gap_after_gate_ey_owner_rejection_closeout`
  because source-owned same-basis holdouts are absent for
  opening/leak field, opening/leak building, opening/leak A-weighted,
  and common wall building residuals.
- Field/building/A-weighted values and budgets remain frozen: field
  `8`, building `10`, A-weighted field `9`, and A-weighted building
  `11`.
- Gate FB selected Gate FC:
  `post_v1_next_numeric_coverage_gap_gate_fc_plan` in
  `packages/engine/src/post-v1-next-numeric-coverage-gap-gate-fc-contract.test.ts`.
- Counters: `ownerLedgersRejected 5`,
  `sameBasisHoldoutLedgersMissing 5`, `boundaryLedgersPinned 7`,
  `runtimeBudgetTighteningAdmitted 0`, `newCalculableLayerTemplates 0`,
  `newCalculableRequestShapes 0`, `runtimeBasisPromotions 0`,
  `runtimeFormulaRetunes 0`, `runtimeValuesMoved 0`,
  `sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.

Latest calculator current ledger:

- `post_v1_current_coverage_accuracy_gap_ledger_gate_fa_plan` landed
  with status
  `post_v1_current_coverage_accuracy_gap_ledger_gate_fa_landed_no_runtime_selected_opening_leak_common_wall_same_basis_residual_owner_gate_fb`.
- Selected gap:
  `wall.opening_leak_common_wall_same_basis_residual_owner_gap_after_gate_ey_owner_rejection_closeout`.
- Gate FA selected Gate FB, a no-runtime same-basis residual owner
  proof for opening/leak field/building/A-weighted rows and the common
  wall building residual:
  `post_v1_opening_leak_common_wall_same_basis_residual_owner_gate_fb_plan`
  in
  `packages/engine/src/post-v1-opening-leak-common-wall-same-basis-residual-owner-gate-fb-contract.test.ts`.
- Counters: `ledgerRows 11`, `candidateCount 11`,
  `ownerGapRows 1`, `runtimeCandidateRowsHeldBehindOwner 2`,
  `closedRepeatRows 5`, `blockedHeavyCoreOwnerRejectedRows 1`,
  `blockedNonGoalRows 1`, `estimatedNextOwnerLedgers 1`,
  `estimatedNextRuntimeCandidateFamiliesAfterOwner 2`,
  `estimatedNextBoundaryLedgers 3`, `newCalculableLayerTemplates 0`,
  `newCalculableRequestShapes 0`, `runtimeBasisPromotions 0`,
  `runtimeFormulaRetunes 0`, `runtimeValuesMoved 0`,
  `sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.

Latest calculator rerank:

- `post_v1_next_numeric_coverage_gap_gate_ez_plan` landed with status
  `post_v1_next_numeric_coverage_gap_gate_ez_landed_no_runtime_selected_current_coverage_accuracy_gap_ledger_gate_fa`.
- Selected candidate:
  `calculator.current_coverage_accuracy_gap_ledger_after_gate_ey_owner_rejection_closeout`.
- Gate EY left the heavy-core / lined-massive owner rejected: MWI.2A
  and B226010 remain targeted evidence context only, not runtime owners.
- Gate EZ selected Gate FA, a fresh current coverage/accuracy gap
  ledger:
  `post_v1_current_coverage_accuracy_gap_ledger_gate_fa_plan` in
  `packages/engine/src/post-v1-current-coverage-accuracy-gap-ledger-gate-fa-contract.test.ts`.
- Counters: `candidateCount 10`, `roiAnalysisIterations: 2`,
  `estimatedNextGapLedgers 1`, `estimatedNextBoundaryLedgers 2`,
  `estimatedNextRuntimeCandidateFamiliesToEvaluate 6`,
  `heavyCoreLinedMassiveRuntimeStillBlocked true`,
  `broadSourceCrawlSelected false`, `runtimeValuesMoved 0`,
  `sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.

Previous calculator closeout:

- `post_v1_wall_heavy_core_lined_massive_targeted_evidence_acquisition_gate_ey_plan`
  landed with status
  `post_v1_wall_heavy_core_lined_massive_targeted_evidence_acquisition_gate_ey_landed_no_runtime_owner_remains_rejected_selected_next_numeric_coverage_gap_gate_ez`.
- Gate EY decision:
  `wall.heavy_core_lined_massive.targeted_evidence_acquired_owner_still_rejected_no_runtime_admissible_row_or_rule`.
- Gate EY accepted MWI.2A and B226010 only as targeted wall-specific
  evidence contexts. The owner remains rejected because neither context
  is runtime-admissible for the live generic heavy-core / lined-massive
  route and no bounded wall lining rule was accepted.
- This is not a broad source crawl. Gate DG `bounded_prediction` values
  remain frozen.
- Gate EY selected Gate EZ:
  `post_v1_next_numeric_coverage_gap_gate_ez_plan` in
  `packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ez-contract.test.ts`.
- Counters: `targetedEvidenceLedgers 6`,
  `acceptedTargetedEvidenceLedgers 2`,
  `runtimeAdmissibleEvidenceLedgers 0`,
  `acceptedBoundedWallLiningRules 0`,
  `calibrationOwnerRemainsRejected true`,
  `broadSourceCrawlSelected false`, `runtimeValuesMoved 0`,
  `sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.

Previous calculator rerank:

- `post_v1_next_numeric_coverage_gap_gate_ex_plan` landed with status
  `post_v1_next_numeric_coverage_gap_gate_ex_landed_no_runtime_selected_wall_heavy_core_lined_massive_targeted_evidence_acquisition_gate_ey`.
- Selected candidate:
  `wall.heavy_core_lined_massive_targeted_evidence_acquisition_after_owner_rejection`.
- This is targeted evidence acquisition, not a broad source crawl. Gate
  EY must look only for a wall-specific lined concrete or heavy-masonry
  source row, or a bounded wall lining rule with coefficient scope,
  local tolerance, holdouts, and negative boundaries.
- Gate EX selected Gate EY:
  `post_v1_wall_heavy_core_lined_massive_targeted_evidence_acquisition_gate_ey_plan`
  in
  `packages/engine/src/post-v1-wall-heavy-core-lined-massive-targeted-evidence-acquisition-gate-ey-contract.test.ts`.
- Counters: `candidateCount 10`, `roiAnalysisIterations 2`,
  `targetedEvidenceAcquisitionSelected true`,
  `broadSourceCrawlSelected false`, `runtimeValuesMoved 0`,
  `sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.

Previous calculator owner proof:

- `post_v1_wall_heavy_core_lined_massive_calibration_owner_gate_ew_plan`
  landed with status
  `post_v1_wall_heavy_core_lined_massive_calibration_owner_gate_ew_landed_no_runtime_owner_rejected_selected_next_numeric_coverage_gap_gate_ex`.
- Gate EW owner rejected:
  `wall.heavy_core_lined_massive.calibration_owner_rejected_missing_wall_specific_source_or_bounded_rule`.
- The current evidence still lacks a wall-specific lined concrete or
  heavy-masonry source row and lacks a bounded wall lining rule with
  coefficient scope, tolerance, holdouts, and negative boundaries.
- Gate EW keeps bounded_prediction values frozen and selected Gate EX:
  `post_v1_next_numeric_coverage_gap_gate_ex_plan` in
  `packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ex-contract.test.ts`.
- Counters: `acceptedOwnerLedgers 0`,
  `calibrationOwnerRejectedLedgers 1`,
  `evidenceBoundaryLedgersPinned 8`, `metricBasisBoundariesPinned 4`,
  `wallSpecificPositiveRowsAccepted 0`, `runtimeValuesMoved 0`,
  `sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.

Previous calculator ledger closeout:

- `post_v1_current_coverage_accuracy_gap_ledger_gate_ev_plan` landed
  with status
  `post_v1_current_coverage_accuracy_gap_ledger_gate_ev_landed_no_runtime_selected_wall_heavy_core_lined_massive_calibration_owner_gate_ew`.
- Selected gap:
  `wall.heavy_core_lined_massive_calibration_owner_gap_after_bounded_basis`.
- Gate EV selected the heavy-core / lined-massive calibration owner Gate
  EW as the next calculator action:
  `post_v1_wall_heavy_core_lined_massive_calibration_owner_gate_ew_plan`
  in
  `packages/engine/src/post-v1-wall-heavy-core-lined-massive-calibration-owner-gate-ew-contract.test.ts`.
- Gate EV classified the current coverage/accuracy gap ledger and kept
  runtime frozen; a later heavy-core / lined-massive retune must first
  prove a wall-specific owner and holdout/tolerance boundary.
- Counters: `ledgerRows 10`, `currentEvidenceSurfaces 10`,
  `ownerGapRows 1`, `runtimeCandidateRowsHeldBehindOwner 1`,
  `estimatedNextOwnerLedgers 1`,
  `estimatedNextRuntimeCandidateFamiliesAfterOwner 1`,
  `runtimeValuesMoved 0`, `sourceRowsImported: 0`, and
  `frontendImplementationFilesTouched: 0`.

Previous calculator rerank:

- `post_v1_next_numeric_coverage_gap_gate_eu_plan` landed with status
  `post_v1_next_numeric_coverage_gap_gate_eu_landed_no_runtime_selected_current_coverage_accuracy_gap_ledger_gate_ev`.
- Selected candidate:
  `calculator.current_coverage_accuracy_gap_ledger_after_gate_et_and_thick_board`.
- Gate EU ran two ROI iterations (`roiAnalysisIterations: 2`) and
  selected the current coverage/accuracy gap ledger as the highest-ROI
  no-runtime next action after subtracting Gate ET, the thick-board
  safety guard, Gate ER, Gate EL, Gate EJ, Gate DK, blocked formula
  retunes, and non-goal source/confidence/frontend work.
- Counters: `candidateCount 10`, `estimatedNextGapLedgers 1`,
  `estimatedNextBoundaryLedgers 2`,
  `estimatedNextRuntimeCandidateFamiliesToEvaluate 6`,
  `runtimeValuesMoved 0`, `sourceRowsImported: 0`, and
  `frontendImplementationFilesTouched: 0`.
- Gate EU selected Gate EV in
  `packages/engine/src/post-v1-current-coverage-accuracy-gap-ledger-gate-ev-contract.test.ts`.
- Historical selected next action:
  Gate FA,
  `post_v1_current_coverage_accuracy_gap_ledger_gate_fa_plan`,
  in
  `packages/engine/src/post-v1-current-coverage-accuracy-gap-ledger-gate-fa-contract.test.ts`.

Latest calculator boundary closeout:

- `post_v1_floor_reinforced_concrete_visible_derived_missing_input_boundary_gate_et_plan`
  landed with status
  `post_v1_floor_reinforced_concrete_visible_derived_missing_input_boundary_gate_et_landed_no_runtime_selected_next_numeric_coverage_gap_gate_eu`.
- Boundary id:
  `floor.reinforced_concrete.visible_derived_lower_assembly_from_layers_missing_dynamic_stiffness_and_load`.
- Visible-derived reinforced-concrete combined upper/lower impact now
  parks `Ln,w` / `DeltaLw` as `needs_input` with exactly
  `resilientLayerDynamicStiffnessMNm3` and `loadBasisKgM2`; explicit
  partial predictor input still requires `loadBasisKgM2` and
  `ceilingOrLowerAssembly`.
- Counters: `currentGateFailuresCleared 6`, `runtimeValuesMoved 0`,
  `sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 1`.
- Gate ET selected Gate EU in
  `packages/engine/src/post-v1-next-numeric-coverage-gap-gate-eu-contract.test.ts`;
  Gate EU has since landed and selected Gate EV.
- Post-Gate-ET checkpoint:
  `fb0ea67 Fix double-leaf route input boundary` keeps flat
  `leaf / porous absorber / leaf` wall stacks without complete
  double-leaf topology/support inputs parked as `needs_input`; complete
  topology still calculates. Gate EV has since landed and selected Gate
  EW.
- Follow-up thick-board ambiguity:
  generic `gypsum_board 12.5 / rockwool 50 / gypsum_board 100` is now
  guarded from Auto-promoting into `lined_massive_wall` by surface mass
  alone. Do not blanket-park all lined-massive fallback routes; the
  guard distinguishes board/panel double-leaf intent from true concrete,
  AAC, brick, or CLT massive substrate intent.
- Safety plan for that follow-up:
  `docs/calculator/POST_V1_THICK_BOARD_AUTO_FAMILY_BOUNDARY_SAFETY_PLAN_2026-06-09.md`.
  It now contains the implemented guard, safety contract, validation
  results, rollback conditions, and current-gate registration. The
  focused engine contract has 62 tests and the web payload contract has
  4 tests. This follow-up does not change the selected next action.

Latest calculator rerank:

- `post_v1_next_numeric_coverage_gap_gate_es_plan` landed with status
  `post_v1_next_numeric_coverage_gap_gate_es_landed_no_runtime_selected_floor_reinforced_concrete_visible_derived_missing_input_boundary_gate_et`.
- Selected candidate:
  `floor.reinforced_concrete_visible_derived_missing_input_boundary_refresh`.
- Gate ES ran two ROI iterations (`roiAnalysisIterations: 2`) and
  selected Gate ET, the reinforced-concrete visible-derived missing-input boundary;
  estimated Gate ET boundary-surface touch
  `estimatedNextFrontendImplementationFilesTouched 1`;
  `runtimeValuesMoved 0`,
  `sourceRowsImported: 0`, and
  `frontendImplementationFilesTouched: 0`.
- Gate ES selected next file:
  `packages/engine/src/post-v1-floor-reinforced-concrete-visible-derived-missing-input-boundary-gate-et-contract.test.ts`.

Latest calculator runtime closeout:

- `post_v1_wall_direct_fixed_double_leaf_field_building_adapter_runtime_gate_er_plan`
  landed with status
  `post_v1_wall_direct_fixed_double_leaf_field_building_adapter_runtime_gate_er_landed_runtime_selected_next_numeric_coverage_gap_gate_es`.
- Readable label: direct-fixed double-leaf field/building adapter runtime.
- Complete direct-fixed double-leaf `field_between_rooms` requests now
  select `gate_i_airborne_field_apparent_context_adapter_runtime`, and
  complete `building_prediction` requests now select
  `gate_ar_airborne_building_prediction_all_owner_runtime_corridor`.
- The representative stack calculates `R'w 23 / Dn,w 24 / DnT,w 27`;
  `runtimeValuesMoved 6`, `sourceRowsImported: 0`, and
  `frontendImplementationFilesTouched: 0`.
- Gate ER selected Gate ES file:
  `packages/engine/src/post-v1-next-numeric-coverage-gap-gate-es-contract.test.ts`.

Calculator reference documents:

- [`docs/calculator/SYSTEM_MAP.md`](./docs/calculator/SYSTEM_MAP.md) — runtime and test-surface map
- [`docs/calculator/CALCULATION_MODEL_AND_VALIDATION.md`](./docs/calculator/CALCULATION_MODEL_AND_VALIDATION.md) — answer-origin semantics
- [`docs/calculator/POST_V1_CALCULATOR_CAPABILITY_PLAN_2026-05-25.md`](./docs/calculator/POST_V1_CALCULATOR_CAPABILITY_PLAN_2026-05-25.md) — selected post-V1 capability chain
- [`docs/calculator/POST_V1_GATE_EP_EQ_WALL_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_PLAN_2026-06-07.md`](./docs/calculator/POST_V1_GATE_EP_EQ_WALL_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_PLAN_2026-06-07.md) — landed Gate EQ owner-proof plan
- [`docs/calculator/POST_V1_HIGH_ROI_SCOPE_ACCURACY_GATES_AFTER_GATE_CD_PLAN_2026-06-02.md`](./docs/calculator/POST_V1_HIGH_ROI_SCOPE_ACCURACY_GATES_AFTER_GATE_CD_PLAN_2026-06-02.md) — high-ROI planning framework
- [`docs/README.md`](./docs/README.md) — docs hierarchy entry point
- [`docs/foundation/SOURCE_REPO_POLICY.md`](./docs/foundation/SOURCE_REPO_POLICY.md) — read-only upstream/import policy

Historical `CHECKPOINT_*`, `SLICE_*`, source-pack, confidence, report,
auth, storage, and productization docs are useful for what landed, but
they do not select calculator work. Do not reopen source crawling,
finite scenario-library building, confidence wording, report polish, or
auth/storage slices unless the user explicitly asks for that work
outside calculator behavior.

Working principles:

- Web-first delivery.
- Desktop-ready architecture.
- Engine stays framework-free.
- No edits to `Acoustic2` from this project.

Run locally:

- `pnpm install`
- optional: set `DYNECHO_AUTH_USERNAME`, `DYNECHO_AUTH_PASSWORD`, and `DYNECHO_AUTH_SECRET`
- `pnpm dev`
- `pnpm calculator:gate:current`
- `pnpm check`
- `pnpm build`
- `pnpm e2e`
- `pnpm test`
- `pnpm lint`
- `pnpm typecheck`
- `pnpm engine:estimate --layers "concrete:100,gypsum_board:12.5"`
- `pnpm upstream:inventory`
- `pnpm upstream:estimate --layers "gypsum_board:12.5,rockwool:50,air_gap:50,concrete:100"`
- `pnpm upstream:compare`
- `pnpm upstream:status`
- `pnpm upstream:note`

Run with Docker:

- `docker build -t dynecho-web .`
- `docker compose up --build`

Useful endpoints:

- `GET /api/health`
- `POST /api/estimate`
- `POST /api/impact-only`
- `GET /api/projects`
- `POST /api/projects/import-local`
- `POST /api/proposal-pdf`
- `POST /api/proposal-docx`

Authentication:

- the landing page remains public
- when auth is configured, `/workbench`, `/workbench/proposal`,
  project APIs, estimate APIs, and proposal PDF/DOCX APIs require
  sign-in
- if auth env vars are not configured locally, the app falls back to preview mode instead of forcing login
- copy [`apps/web/.env.example`](./apps/web/.env.example) into your local env setup if you want authenticated local runs instead of preview mode

Agent workflow:

- read [`AGENTS.md`](./AGENTS.md) before changing calculator behavior
- treat calculator work as scope/accuracy work only: make more
  physically valid wall/floor layer combinations calculate correctly, or
  improve an existing formula/anchor/boundary; do not drift into source
  catalog, low-confidence wording, report polish, auth/storage, or
  finite scenario work unless explicitly requested
- read [`docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md`](./docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md)
  before older roadmap or handoff files
- use [`docs/calculator/NEXT_IMPLEMENTATION_PLAN.md`](./docs/calculator/NEXT_IMPLEMENTATION_PLAN.md)
  as the current next-step authority
- run `pnpm calculator:gate:current` for the focused current-slice validation
  gate

Read-only upstream tooling:

- `upstream:status` reads branch, SHA, and dirty working tree state from `Acoustic2`.
- `upstream:inventory` writes a snapshot report into `docs/imports` without modifying upstream.
- `upstream:estimate` runs a one-off estimate inside upstream for comparison work.
- `upstream:compare` compares seeded DynEcho estimates against upstream smoke cases.
