# Usable V1 Execution Plan

Document role: this is the binding finish plan for company-internal
calculator readiness. It supersedes historical "selected next" handoff
chains whenever they conflict with usable V1 readiness.

For the current product source of truth and post-V1 next-slice
selection rules, read
[CALCULATOR_SOURCE_OF_TRUTH.md](./CALCULATOR_SOURCE_OF_TRUTH.md) first.
This file remains the closed V1 acceptance contract and answer-order
gate.

The selected post-V1 capability chain is
[POST_V1_CALCULATOR_CAPABILITY_PLAN_2026-05-25.md](./POST_V1_CALCULATOR_CAPABILITY_PLAN_2026-05-25.md).
It does not reopen usable V1. That plan started post-V1 formula
coverage with a no-runtime wall multileaf input-owner gate, but the
current selected post-V1 action must be read from
[CALCULATOR_SOURCE_OF_TRUTH.md](./CALCULATOR_SOURCE_OF_TRUTH.md), the
landed Gate EV/EW plan, the landed Gate EX/EY plan, the landed Gate
EY/EZ plan, the landed Gate EZ/FA plan, the landed Gate FA/FB plan, the
landed Gate FB/FC plan, the landed Gate FC/FD plan, and the landed Gate
FD/FE plan, and the landed Gate FE/FF plan. As of 2026-06-09, Gate FF
has landed and the current selected action is the post double-leaf/framed
coverage revalidation:
`layer_combination_resolver_post_double_leaf_framed_wall_banded_coverage_revalidation_plan`.
Selected next file:
`packages/engine/src/layer-combination-resolver-post-double-leaf-framed-wall-banded-coverage-revalidation-contract.test.ts`.
The selected revalidation must choose the next post-V1 calculator
scope/accuracy move from current double-leaf and direct-fixed runtime
evidence.

Gate FF landed as
`post_v1_current_formula_scope_accuracy_gap_ledger_gate_ff_plan`
with status
`post_v1_current_formula_scope_accuracy_gap_ledger_gate_ff_landed_no_runtime_selected_post_double_leaf_framed_wall_banded_coverage_revalidation`.
Gate FF is the landed formula scope ledger for this post-V1 handoff.
Gate FF selected:
`wall.double_leaf_framed_post_runtime_coverage_revalidation_after_direct_fixed_gate_er`.
Gate FF selected next:
`layer_combination_resolver_post_double_leaf_framed_wall_banded_coverage_revalidation_plan`
in
`packages/engine/src/layer-combination-resolver-post-double-leaf-framed-wall-banded-coverage-revalidation-contract.test.ts`.
Gate FF subtracts already-live single-leaf mass-law, non-direct-fixed
double-leaf/framed, direct-fixed double-leaf field/building, historical
candidate-matrix/company-internal rehearsal, Gate FD floor holdout, Gate
FB opening/leak common-wall residual, Gate EY heavy-core / lined-massive,
and broad-source-crawl lanes. Counters: `candidateCount 10`,
`roiAnalysisIterations: 2`,
`estimatedNextPostDoubleLeafRevalidationRows 1`,
`estimatedNextRuntimeCandidateFamiliesToRerank 4`,
`closedRuntimeRowsRechecked 5`, `blockedOwnerOrHoldoutRows 3`,
`openHistoricalSelectedNextFilesStillMissing 1`,
`immediateRuntimeCandidatesSelected 0`,
`newCalculableLayerTemplates 0`, `newCalculableRequestShapes 0`,
`runtimeBasisPromotions 0`, `runtimeFormulaRetunes 0`,
`runtimeValuesMoved 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`.

Gate FE landed as
`post_v1_next_numeric_coverage_gap_gate_fe_plan`
with status
`post_v1_next_numeric_coverage_gap_gate_fe_landed_no_runtime_selected_current_formula_scope_accuracy_gap_ledger_gate_ff`.
Gate FE selected:
`calculator.current_formula_scope_accuracy_gap_ledger_after_gate_fd_closeout`.
Gate FE subtracts Gate FD floor holdout rejection, Gate FB opening/leak
and common-wall owner rejection, Gate EY heavy-core / lined-massive
owner rejection, stale cartography `runtime_widening` labels for
heavy-core, timber stud, CLT, and steel fallback, and the blocked
Rockwool source packet lane. It is not a broad source crawl and moves no
runtime values. Gate FE selected Gate FF:
`post_v1_current_formula_scope_accuracy_gap_ledger_gate_ff_plan`
in
`packages/engine/src/post-v1-current-formula-scope-accuracy-gap-ledger-gate-ff-contract.test.ts`.
Counters: `candidateCount 10`, `roiAnalysisIterations: 2`,
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
Gate FE/FF plan:
`docs/calculator/POST_V1_GATE_FE_FF_CURRENT_FORMULA_SCOPE_ACCURACY_LEDGER_PLAN_2026-06-09.md`.

Gate FD landed as
`post_v1_floor_raw_bare_and_floating_same_basis_holdout_gate_fd_plan`
with status
`post_v1_floor_raw_bare_and_floating_same_basis_holdout_gate_fd_landed_no_runtime_owner_rejected_selected_next_numeric_coverage_gap_gate_fe`.
Gate FD owner rejected:
`floor.raw_bare_and_floating.same_basis_holdout_owner_rejected_missing_admissible_holdouts`.
Gate FD evaluated only the three Gate CL floor residual ledgers selected
by Gate FC. Open-box/open-web raw-bare formula outputs remain
source-absent, packaged/finished/supported-band rows are not raw-bare
same-basis holdouts, and the Gate CH published `Ln,w` anchor plus field
adapter outputs are not measured direct+flanking field holdouts. Runtime
values and budgets remain frozen. Gate FD selected Gate FE:
`post_v1_next_numeric_coverage_gap_gate_fe_plan`
in
`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-fe-contract.test.ts`.
Counters: `ownerLedgersRejected 3`, `admissibleHoldoutLedgers 0`,
`evaluatedGateCLResidualLedgers 3`,
`rejectedCandidateEvidenceLedgers 6`, `boundaryLedgersPinned 7`,
`runtimeBudgetTighteningAdmitted 0`, `broadSourceCrawlSelected false`,
`newCalculableLayerTemplates 0`, `newCalculableRequestShapes 0`,
`runtimeBasisPromotions 0`, `runtimeFormulaRetunes 0`,
`runtimeValuesMoved 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`.
Gate FD/FE plan:
`docs/calculator/POST_V1_GATE_FD_FE_FLOOR_RAW_BARE_FLOATING_HOLDOUT_CLOSEOUT_PLAN_2026-06-09.md`.

Gate FC landed as
`post_v1_next_numeric_coverage_gap_gate_fc_plan`
with status
`post_v1_next_numeric_coverage_gap_gate_fc_landed_no_runtime_selected_floor_raw_bare_and_floating_same_basis_holdout_gate_fd`.
Gate FC selected
`floor.raw_bare_and_floating_same_basis_holdout_prerequisite_after_gate_fb`
after two ROI plan iterations (`roiAnalysisIterations: 2`). Gate FC
subtracts Gate FB-rejected opening/leak/common-wall budget tightening,
Gate EY/EW-rejected heavy-core retune, and already-closed direct-fixed,
reinforced-concrete visible-derived, thick-board safety, ASTM
exact-band, and steel visible input-surface repeats. No safe immediate
value-moving runtime candidate remains from current evidence; Gate FC
therefore selects Gate FD, a bounded targeted same-basis holdout
prerequisite for floor raw-bare/floating residual accuracy. It is not a
broad source crawl. Gate FC selected
`post_v1_floor_raw_bare_and_floating_same_basis_holdout_gate_fd_plan`
in
`packages/engine/src/post-v1-floor-raw-bare-and-floating-same-basis-holdout-gate-fd-contract.test.ts`.
Counters: `candidateCount 10`, `roiAnalysisIterations: 2`,
`blockedByGateFBOwnerRejectionRows 2`,
`blockedHeavyCoreOwnerRejectedRows 1`, `closedRepeatRows 5`,
`estimatedNextTargetedHoldoutLedgers 3`,
`floorResidualLedgersSelected 3`, `immediateRuntimeCandidatesSelected
0`, `broadSourceCrawlSelected false`, `newCalculableLayerTemplates 0`,
`newCalculableRequestShapes 0`, `runtimeBasisPromotions 0`,
`runtimeFormulaRetunes 0`, `runtimeValuesMoved 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.
Gate FC/FD plan:
`docs/calculator/POST_V1_GATE_FC_FD_FLOOR_RAW_BARE_FLOATING_HOLDOUT_PLAN_2026-06-09.md`.

Gate FB landed as
`post_v1_opening_leak_common_wall_same_basis_residual_owner_gate_fb_plan`
with status
`post_v1_opening_leak_common_wall_same_basis_residual_owner_gate_fb_landed_no_runtime_owner_rejected_selected_next_numeric_coverage_gap_gate_fc`.
Gate FB owner rejected:
`wall.opening_leak_common_wall.same_basis_residual_owner_rejected_missing_holdouts`.
Gate FB rejected runtime budget tightening for
`wall.opening_leak_common_wall_same_basis_residual_owner_gap_after_gate_ey_owner_rejection_closeout`
because source-owned same-basis holdouts are absent for opening/leak
field, opening/leak building, opening/leak A-weighted, and common wall
building residuals. Field/building/A-weighted values and budgets remain
frozen: field `8`, building `10`, A-weighted field `9`, and A-weighted
building `11`. Gate FB selected Gate FC:
`post_v1_next_numeric_coverage_gap_gate_fc_plan`
in
`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-fc-contract.test.ts`.
Counters: `ownerLedgersRejected 5`, `sameBasisHoldoutLedgersMissing 5`,
`boundaryLedgersPinned 7`, `runtimeBudgetTighteningAdmitted 0`,
`newCalculableLayerTemplates 0`, `newCalculableRequestShapes 0`,
`runtimeBasisPromotions 0`, `runtimeFormulaRetunes 0`,
`runtimeValuesMoved 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`.
Gate FB/FC plan:
`docs/calculator/POST_V1_GATE_FB_FC_OPENING_LEAK_COMMON_WALL_OWNER_CLOSEOUT_AND_NEXT_NUMERIC_GAP_PLAN_2026-06-09.md`.

Gate FA landed as
`post_v1_current_coverage_accuracy_gap_ledger_gate_fa_plan`
with status
`post_v1_current_coverage_accuracy_gap_ledger_gate_fa_landed_no_runtime_selected_opening_leak_common_wall_same_basis_residual_owner_gate_fb`.
Gate FA selected
`wall.opening_leak_common_wall_same_basis_residual_owner_gap_after_gate_ey_owner_rejection_closeout`.
Gate FA selected Gate FB, a no-runtime same-basis residual owner proof
for opening/leak field/building/A-weighted rows and the common wall
building residual:
`post_v1_opening_leak_common_wall_same_basis_residual_owner_gate_fb_plan`
in
`packages/engine/src/post-v1-opening-leak-common-wall-same-basis-residual-owner-gate-fb-contract.test.ts`.
Counters: `ledgerRows 11`, `candidateCount 11`, `ownerGapRows 1`,
`runtimeCandidateRowsHeldBehindOwner 2`, `closedRepeatRows 5`,
`blockedHeavyCoreOwnerRejectedRows 1`, `blockedNonGoalRows 1`,
`estimatedNextOwnerLedgers 1`,
`estimatedNextRuntimeCandidateFamiliesAfterOwner 2`,
`estimatedNextBoundaryLedgers 3`, `newCalculableLayerTemplates 0`,
`newCalculableRequestShapes 0`, `runtimeBasisPromotions 0`,
`runtimeFormulaRetunes 0`, `runtimeValuesMoved 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.
Gate FA/FB plan:
`docs/calculator/POST_V1_GATE_FA_FB_OPENING_LEAK_COMMON_WALL_RESIDUAL_OWNER_PLAN_2026-06-09.md`.

Gate EZ landed as
`post_v1_next_numeric_coverage_gap_gate_ez_plan`
with status
`post_v1_next_numeric_coverage_gap_gate_ez_landed_no_runtime_selected_current_coverage_accuracy_gap_ledger_gate_fa`.
Gate EZ selected
`calculator.current_coverage_accuracy_gap_ledger_after_gate_ey_owner_rejection_closeout`.
Gate EY left the heavy-core / lined-massive owner rejected: MWI.2A and
B226010 remain targeted evidence context only, not runtime owners. Gate
EZ selected Gate FA, a fresh current coverage/accuracy gap ledger:
`post_v1_current_coverage_accuracy_gap_ledger_gate_fa_plan`
in
`packages/engine/src/post-v1-current-coverage-accuracy-gap-ledger-gate-fa-contract.test.ts`.
Counters: `candidateCount 10`, `roiAnalysisIterations: 2`,
`estimatedNextGapLedgers 1`, `estimatedNextBoundaryLedgers 2`,
`estimatedNextRuntimeCandidateFamiliesToEvaluate 6`,
`heavyCoreLinedMassiveRuntimeStillBlocked true`,
`broadSourceCrawlSelected false`, `newCalculableLayerTemplates 0`,
`newCalculableRequestShapes 0`, `runtimeBasisPromotions 0`,
`runtimeFormulaRetunes 0`, `runtimeValuesMoved 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.
Gate EZ/FA plan:
`docs/calculator/POST_V1_GATE_EZ_FA_CURRENT_COVERAGE_ACCURACY_GAP_LEDGER_PLAN_2026-06-09.md`.

Gate EY landed as
`post_v1_wall_heavy_core_lined_massive_targeted_evidence_acquisition_gate_ey_plan`
with status
`post_v1_wall_heavy_core_lined_massive_targeted_evidence_acquisition_gate_ey_landed_no_runtime_owner_remains_rejected_selected_next_numeric_coverage_gap_gate_ez`.
Gate EY decision:
`wall.heavy_core_lined_massive.targeted_evidence_acquired_owner_still_rejected_no_runtime_admissible_row_or_rule`.
Gate EY accepted MWI.2A and B226010 only as targeted wall-specific
evidence contexts. The owner remains rejected because neither context is
runtime-admissible for the live generic heavy-core / lined-massive route
and no bounded wall lining rule was accepted. This is not a broad source
crawl. Current Gate DG `bounded_prediction` values remain frozen. Gate
EY selected Gate EZ:
`post_v1_next_numeric_coverage_gap_gate_ez_plan`
in
`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ez-contract.test.ts`.
Counters: `targetedEvidenceLedgers 6`,
`acceptedTargetedEvidenceLedgers 2`,
`runtimeAdmissibleEvidenceLedgers 0`,
`acceptedBoundedWallLiningRules 0`,
`calibrationOwnerRemainsRejected true`,
`broadSourceCrawlSelected false`, `newCalculableLayerTemplates 0`,
`newCalculableRequestShapes 0`, `runtimeBasisPromotions 0`,
`runtimeFormulaRetunes 0`, `runtimeValuesMoved 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.

Gate EX previously landed as
`post_v1_next_numeric_coverage_gap_gate_ex_plan`
with status
`post_v1_next_numeric_coverage_gap_gate_ex_landed_no_runtime_selected_wall_heavy_core_lined_massive_targeted_evidence_acquisition_gate_ey`.
Gate EX selected
`wall.heavy_core_lined_massive_targeted_evidence_acquisition_after_owner_rejection`.
This is targeted evidence acquisition, not a broad source crawl: Gate EY
must look only for a wall-specific lined concrete or heavy-masonry source
row, or a bounded wall lining rule with coefficient scope, local
tolerance, holdouts, and negative boundaries. Current Gate DG
`bounded_prediction` values remain frozen. Gate EX selected Gate EY:
`post_v1_wall_heavy_core_lined_massive_targeted_evidence_acquisition_gate_ey_plan`
in
`packages/engine/src/post-v1-wall-heavy-core-lined-massive-targeted-evidence-acquisition-gate-ey-contract.test.ts`.
Counters: `candidateCount 10`, `roiAnalysisIterations 2`,
`targetedEvidenceAcquisitionSelected true`, `broadSourceCrawlSelected false`,
`newCalculableLayerTemplates 0`, `newCalculableRequestShapes 0`,
`runtimeBasisPromotions 0`, `runtimeFormulaRetunes 0`,
`runtimeValuesMoved 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`.

Gate EW landed as
`post_v1_wall_heavy_core_lined_massive_calibration_owner_gate_ew_plan`
with status
`post_v1_wall_heavy_core_lined_massive_calibration_owner_gate_ew_landed_no_runtime_owner_rejected_selected_next_numeric_coverage_gap_gate_ex`.
Gate EW owner rejected:
`wall.heavy_core_lined_massive.calibration_owner_rejected_missing_wall_specific_source_or_bounded_rule`.
The current evidence still lacks a wall-specific lined concrete or
heavy-masonry source row and lacks a named bounded wall lining rule with
coefficient scope, local tolerance, holdouts, and protected negative
boundaries. Gate EW keeps bounded_prediction values frozen and selected
Gate EX:
`post_v1_next_numeric_coverage_gap_gate_ex_plan` in
`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ex-contract.test.ts`.
Counters: `acceptedOwnerLedgers 0`,
`calibrationOwnerRejectedLedgers 1`, `evidenceBoundaryLedgersPinned 8`,
`metricBasisBoundariesPinned 4`, `wallSpecificPositiveRowsAccepted 0`,
`newCalculableLayerTemplates 0`, `newCalculableRequestShapes 0`,
`runtimeBasisPromotions 0`, `runtimeFormulaRetunes 0`,
`runtimeValuesMoved 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`.

Gate EV landed as
`post_v1_current_coverage_accuracy_gap_ledger_gate_ev_plan`
with status
`post_v1_current_coverage_accuracy_gap_ledger_gate_ev_landed_no_runtime_selected_wall_heavy_core_lined_massive_calibration_owner_gate_ew`.
It selected
`wall.heavy_core_lined_massive_calibration_owner_gap_after_bounded_basis`
and selected the heavy-core / lined-massive calibration owner Gate EW:
`post_v1_wall_heavy_core_lined_massive_calibration_owner_gate_ew_plan`
in
`packages/engine/src/post-v1-wall-heavy-core-lined-massive-calibration-owner-gate-ew-contract.test.ts`.
Counters: `ledgerRows 10`, `currentEvidenceSurfaces 10`,
`ownerGapRows 1`, `runtimeCandidateRowsHeldBehindOwner 1`,
`estimatedNextOwnerLedgers 1`,
`estimatedNextRuntimeCandidateFamiliesAfterOwner 1`,
`runtimeValuesMoved 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`.

Gate EU landed as
`post_v1_next_numeric_coverage_gap_gate_eu_plan`
with status
`post_v1_next_numeric_coverage_gap_gate_eu_landed_no_runtime_selected_current_coverage_accuracy_gap_ledger_gate_ev`.
It selected
`calculator.current_coverage_accuracy_gap_ledger_after_gate_et_and_thick_board`
after two ROI iterations (`roiAnalysisIterations: 2`) and selected the
current coverage/accuracy gap ledger. Counters:
`candidateCount 10`, `estimatedNextGapLedgers 1`,
`estimatedNextBoundaryLedgers 2`,
`estimatedNextRuntimeCandidateFamiliesToEvaluate 6`,
`runtimeValuesMoved 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`.
Gate EU selected Gate EV in
`packages/engine/src/post-v1-current-coverage-accuracy-gap-ledger-gate-ev-contract.test.ts`.

Post-Gate-ET checkpoint:
[CHECKPOINT_2026-06-08_DOUBLE_LEAF_ROUTE_INPUT_BOUNDARY_CHECKPOINT.md](./CHECKPOINT_2026-06-08_DOUBLE_LEAF_ROUTE_INPUT_BOUNDARY_CHECKPOINT.md).
Commit `fb0ea67 Fix double-leaf route input boundary` preserves
answer-engine V1 behavior for flat `leaf / porous absorber / leaf` wall
stacks: missing double-leaf topology/support inputs remain
`needs_input`, while complete topology still calculates through the
owned double-leaf/framed formula route. It moves no formula values and
does not reopen usable V1. Gate EV and Gate EW have since landed; Gate
EW landed owner rejected and selected Gate EX. Gate EX has since landed
and selected Gate EY targeted evidence acquisition. Gate EY has since
landed, owner remains rejected, and Gate EY selected Gate EZ.

Gate ET landed as
`post_v1_floor_reinforced_concrete_visible_derived_missing_input_boundary_gate_et_plan`
with status
`post_v1_floor_reinforced_concrete_visible_derived_missing_input_boundary_gate_et_landed_no_runtime_selected_next_numeric_coverage_gap_gate_eu`.
Boundary id:
`floor.reinforced_concrete.visible_derived_lower_assembly_from_layers_missing_dynamic_stiffness_and_load`.
It pins the reinforced-concrete visible-derived missing-input boundary:
visible layer roles already define the lower assembly, so `Ln,w` /
`DeltaLw` stay parked as `needs_input` for
`resilientLayerDynamicStiffnessMNm3` and `loadBasisKgM2`; explicit
partial predictor input still requires `loadBasisKgM2` and
`ceilingOrLowerAssembly`. Gate ET counters include
`currentGateFailuresCleared 6`, `runtimeValuesMoved 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 1`.
Gate ET selected Gate EU in
`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-eu-contract.test.ts`;
Gate EV and Gate EW have since landed; Gate EW landed owner rejected and
selected Gate EX. Gate EX has since landed and selected Gate EY targeted
evidence acquisition. Gate EY has since landed, owner remains rejected,
and Gate EY selected Gate EZ.

Gate ES landed as
`post_v1_next_numeric_coverage_gap_gate_es_plan` with status
`post_v1_next_numeric_coverage_gap_gate_es_landed_no_runtime_selected_floor_reinforced_concrete_visible_derived_missing_input_boundary_gate_et`.
It selected
`floor.reinforced_concrete_visible_derived_missing_input_boundary_refresh`
after two ROI iterations (`roiAnalysisIterations: 2`) and selected
Gate ET in
`packages/engine/src/post-v1-floor-reinforced-concrete-visible-derived-missing-input-boundary-gate-et-contract.test.ts`.
Gate ES estimated the selected Gate ET boundary-surface touch as
`estimatedNextFrontendImplementationFilesTouched 1`.
Gate ES counters include `runtimeValuesMoved 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.

Gate ER landed as
`post_v1_wall_direct_fixed_double_leaf_field_building_adapter_runtime_gate_er_plan`
with status
`post_v1_wall_direct_fixed_double_leaf_field_building_adapter_runtime_gate_er_landed_runtime_selected_next_numeric_coverage_gap_gate_es`.
Readable label: direct-fixed double-leaf field/building adapter runtime.
It routes complete direct-fixed double-leaf `field_between_rooms`
requests through `gate_i_airborne_field_apparent_context_adapter_runtime`
and complete `building_prediction` requests through
`gate_ar_airborne_building_prediction_all_owner_runtime_corridor`,
calculating `R'w 23 / Dn,w 24 / DnT,w 27`. It moved
`runtimeValuesMoved 6`, imported `sourceRowsImported: 0`, and touched
`frontendImplementationFilesTouched: 0`.
Gate ER selected Gate ES file:
`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-es-contract.test.ts`.

DynEcho is usable V1 only when a company-internal user can choose wall or
floor, enter layers plus the required physical inputs, and receive a
basis-correct answer or a precise `needs_input` / `unsupported` stop. It
is not usable V1 because another finite source row, scenario pack,
confidence label, or documentation-only slice landed.

## Non-Negotiable Answer Order

Every calculator answer must be selected in this order before values are
published:

1. exact measured answer for the same stack, topology, metric, and basis;
2. compatible measured anchor when topology and metric scope allow it;
3. calibrated family formula;
4. source-absent family formula;
5. `needs_input` with exact missing physical fields;
6. `unsupported` with the missing basis or standard owner.

No user-facing metric may bypass this order. Diagnostic or screening
numbers may exist internally, but they are not the answer unless they are
the selected candidate.

## V1 Included Output Scope

Wall V1 includes:

- element-lab `Rw`, STC, `C`, and `Ctr` when a measured same-metric row
  or owned wall formula candidate selects them;
- field `R'w` and `DnT,w` only when field context and field-basis owner
  requirements are satisfied;
- missing field/building context as `needs_input`, not estimated lab
  aliases;
- unsupported field/building owners as `unsupported`, not hidden
  fallback values.

Floor V1 includes:

- floor airborne `Rw`, `C`, and `Ctr` only from exact, compatible anchor,
  calibrated formula, or source-absent formula candidates that own those
  metrics;
- lab impact `Ln,w`, `DeltaLw`, `CI`, `CI,50-2500`, and `Ln,w+CI` only
  from exact impact evidence or owned impact formulas;
- field impact `L'n,w` and `L'nT,w` only with owned field context;
- ASTM `IIC` / `AIIC` as `unsupported` until an ASTM E989 owner exists.

## Formula Families That Must Feed V1

The following existing or landed formula lanes are part of usable V1 and
must not be deleted or bypassed:

- wall single-leaf mass-law banded formula;
- wall double-leaf/framed mass-air-mass / bridge formula;
- grouped triple-leaf and multicavity wall lanes, including topology
  `needs_input` boundaries;
- wall opening/leak lanes only when their basis owner and inputs exist;
- floor exact measured system rows as exact overrides only for owned
  metrics;
- floor package-transfer and supported-band anchors only for compatible
  metrics;
- floor raw-bare, helper-only, direct-fixed, and source-absent formula
  lanes;
- floor lab impact and field impact lanes with explicit input contracts;
- exact ISO 717-2 impact-band sources only for their ISO impact metrics.

## Architecture Rules

Usable V1 must be enforced by architecture, not by agent memory.

### Runtime Ownership

- `calculateAssembly` and `calculateImpactOnly` may compute diagnostic
  candidates, but the published answer must come from the selected
  answer candidate.
- The selected candidate owns a route, basis, metric set, required input
  set, support bucket, origin, and value pins. A metric outside that
  owned set is unsupported unless a separate selected companion basis
  owns it.
- `needs_input` and `unsupported` are final answer states, not warnings.
  They must park stopped outputs before cards, charts, API payloads, or
  reports can see those values as answers.
- Exact measured rows are rank-zero only for the same stack, topology,
  metric, and basis. They are not metric adapters.
- Similarity anchors may calibrate only when the physical topology and
  metric scope match the requested answer family.
- Source-absent formulas are first-class answer candidates. They are
  not low-priority fallbacks behind catalog behavior.

### Module Boundaries

- Candidate declaration, runtime selection, value parking, trace
  building, UI mapping, API serialization, and report rendering must
  remain separate responsibilities.
- Formula-family solvers must not import UI code, project persistence
  code, or report code.
- UI/report code must not infer acoustic basis from display labels. It
  must use engine fields such as selected candidate, basis, support
  bucket, missing inputs, unsupported outputs, and value pins.
- Shared schemas must carry answer-engine boundary payloads before UI or
  API code depends on them.
- Do not solve missing physics by inventing defaults in the UI, adapter,
  report, or persistence layer.

### Data And Metric Rules

- Lab, field, and building-prediction values are different bases.
- `Rw`, `R'w`, `DnT,w`, STC, `C`, `Ctr`, `Ln,w`, `L'n,w`,
  `L'nT,w`, `IIC`, `AIIC`, `CI`, and `CI,50-2500` must not be casually
  aliased.
- If an adapter is approximate or internally diagnostic, its output must
  still enter the same answer-selection order before publication.
- Tolerance and confidence text is secondary. It cannot justify
  publishing an answer whose physical inputs or basis owner are missing.

## UI And Surface Rules

The workbench is part of the calculator, not a decorative shell. UI must
make the selected answer path obvious and must not hide stopped outputs.

### Required UX Behavior

- User starts with wall or floor route selection.
- The UI opens only fields required by the selected route, output basis,
  and active formula family.
- Missing physical inputs appear as actionable field prompts with exact
  field names mapped to user-facing labels.
- A stopped output must appear as `needs_input` or `unsupported` in the
  same place where a numeric answer would appear. It must not disappear
  silently.
- Mixed requests must show split ownership clearly: for example lab
  `Ln,w` can be live while field `L'n,w` is parked.
- Exact measured answers must say they are exact only for the owned
  metric basis. Companion unsupported metrics must be visible as
  unsupported or missing-owner, not implied as measured.
- The answer card, route posture, method dossier, candidate trace, and
  report summary must use the same selected candidate id and basis.

### Visual And Interaction Rules

- This is an operational tool, not a landing page. Keep the interface
  dense, scannable, and work-focused.
- Do not put UI cards inside other cards. Use cards only for repeated
  result items, modals, and framed tools.
- Route controls, output selection, layer editing, topology/context
  fields, and missing-input prompts must have stable dimensions so
  values, warnings, and labels do not shift the layout.
- Text must not overlap or truncate critical metric labels, required
  input names, or numeric values on mobile or desktop.
- Use familiar controls: toggles for binary choices, segmented controls
  for modes, numeric inputs for physical quantities, menus for finite
  option sets, and icons with tooltips for compact actions.
- Do not add marketing copy, explanatory hero sections, or decorative
  surfaces to the calculator workflow.
- Color and typography must distinguish exact, formula, `needs_input`,
  and `unsupported` states without relying on color alone.

## API, Persistence, And Report Rules

- `/api/estimate`, `/api/impact-only`, saved local replay, server
  snapshots, Markdown reports, PDF/report surfaces, and workbench cards
  must all expose the same answer basis and stopped-output state.
- API responses must include enough structured data for the UI to render
  selected candidate id, origin, support bucket, basis, value pins,
  missing physical inputs, unsupported outputs, and warnings without
  re-interpreting acoustic logic.
- Persisted project data must preserve explicit physical inputs and
  topology/context fields. It must not save UI defaults as if the user
  supplied them.
- Reports must not include diagnostic values as final answers when the
  selected answer is `needs_input` or `unsupported`.
- If a surface cannot display an answer-engine field yet, the surface is
  not parity-complete.

## Test And Gate Rules

- A test that only proves a doc exists is not enough for usable V1.
  Documentation tests only protect execution discipline.
- Each implementation step must add behavior tests proving values,
  basis, origin, support bucket, missing inputs, unsupported outputs, and
  value pins.
- Negative tests are mandatory for metric aliases, partial field
  context, missing topology, roleless floors, duplicate/split layers, and
  unsafe reorder cases.
- Surface tests must prove UI/API/report parity for the same selected
  answer, not just that each surface renders.
- `pnpm calculator:gate:current` is the minimum final gate after runtime,
  schema, API, UI, or report behavior changes.
- `git diff --check` must be clean before handoff.

## Execution Protocol For Agents

- Start every implementation by naming the usable V1 step being closed.
- Do not open a broad source crawl, tolerance retune, confidence wording
  pass, or new finite scenario pack unless it directly closes the named
  usable V1 step.
- Prefer failing behavior tests before runtime changes.
- Keep changes scoped to the selected step, but include all surfaces
  required by that step.
- Final status must say which step closed, which tests prove it, and
  which step remains open. Do not report iteration counts.

## Final Implementation Sequence

These are the remaining steps from the current state to usable V1. Do
not replace them with another historical selected-next chain.

### Step 0 - Lock This Plan Into The Gate

Status: closed on 2026-05-22 for the plan/gate lock. The targeted V1
contract and full `pnpm calculator:gate:current` both pass with this
plan referenced from the repo entry docs.

Acceptance:

- `AGENTS.md`, `CURRENT_STATE.md`, and `NEXT_IMPLEMENTATION_PLAN.md`
  point to this file before older handoffs;
- `packages/engine/src/acoustic-calculator-answer-engine-v1-contract.test.ts`
  fails if this file or those pointers disappear;
- no agent should answer "how much is left" with an iteration count
  unless it also reports which acceptance step is open.

Implementation tasks:

- keep this file referenced from `AGENTS.md`, `CURRENT_STATE.md`, and
  `NEXT_IMPLEMENTATION_PLAN.md`;
- keep `acoustic-calculator-answer-engine-v1-contract.test.ts` checking
  this file, the required sections, and those pointers;
- run the targeted V1 contract after plan edits and the current gate
  after behavior edits.

### Step 1 - Candidate-Owned Answer Hardening

Status: closed on 2026-05-22. Exact ISO 717-2 impact-band candidates
now park ownerless airborne screening companion outputs such as `Rw`,
STC, `C`, and `Ctr` unless a separate owned airborne basis is selected.
A shared answer-owner audit helper now runs on assembly and impact-only
results, scoped to exact metric ownership where the trace declares owned
metrics, active `needs_input` / `unsupported` / `basis_boundary` answer
stops, and floor runtime traces with supported metric declarations. The
wall and floor V1 matrices plus the company-internal usable V1
acceptance gate now prove exact, anchor, calibrated formula,
source-absent formula, `needs_input`, and unsupported ownership across
the selected V1 families. Floor package-transfer anchors no longer
publish ownerless STC, exact impact-band traces keep airborne companions
parked, and real floor field/building continuation values remain live
only when the selected runtime publishes them.

Acceptance:

- for every engine result, supported target outputs are a subset of the
  selected candidate's owned metrics, except explicitly separate mixed
  companion outputs that have their own selected basis;
- selected `needs_input` and `unsupported` candidates have empty value
  pins and no published user-facing metric for their stopped outputs;
- exact, anchor, formula, `needs_input`, and `unsupported` decisions are
  visible on the shared resolver trace.

Implementation tasks:

- keep the shared answer-owner audit helper active for assembly and
  impact-only results;
- broaden selected-candidate owned metric assertions through the Step 2
  wall matrix and Step 3 floor matrix instead of parking every formula
  or anchor mismatch before those traces are complete;
- park exact ownerless outputs and active answer-stop outputs before
  resolver trace and before surface mapping;
- keep allowed mixed companion outputs only when a separate owned basis
  is present;
- add tests where old screening/catalog/helper values exist internally
  but are not the selected answer.

Done signal:

- the V1 contract includes a table of representative wall/floor outputs
  where every supported output is justified by a selected owner;
- stopped outputs have no value pins and no answer-card/report/API value;
- targeted resolver surface parity tests pass.
- full Step 1 closure additionally requires the Step 2 and Step 3
  matrices to prove owner scope for formula and anchor candidates without
  muting valid calculated answers.

### Step 2 - Wall V1 Acceptance Matrix

Status: closed on 2026-05-22. The engine-side wall matrix landed in
`packages/engine/src/acoustic-calculator-answer-engine-v1-contract.test.ts`.
It covers exact measured metric scope, reversed exact same-stack
matching, source-absent single-leaf and double-leaf formulas, missing
double-leaf topology, missing resilient side count, grouped multicavity
`needs_input`, complete field-apparent wall context, partial field
context, and unsupported building/opening ownership. The matching web
parity assertions in
`apps/web/features/workbench/layer-combination-resolver-candidate-surface-parity.test.ts`
now cover live wall formulas, exact wall rows, complete field-apparent
wall answers, partial field `needs_input`, and unsupported
building/opening owners across output cards, Markdown report lines, and
`/api/estimate` payloads.

Acceptance:

- exact measured same-stack wall rows win only for measured same-basis
  metrics;
- source-absent single-leaf and double-leaf formulas publish values when
  required inputs are present;
- missing double-leaf, resilient side-count, grouped triple-leaf, and
  multicavity topology fields stop as `needs_input`;
- complete field wall context publishes owned field outputs, while
  partial field/building context stops without lab aliasing;
- unsupported opening/leak or building owners produce `unsupported`.

Implementation tasks:

- build one wall acceptance matrix in the V1 contract covering exact,
  source-absent single-leaf, source-absent double-leaf, grouped
  triple/multicavity, partial field, complete field, and unsupported
  building/opening cases;
- map each wall case to required physical inputs and candidate owner;
- ensure existing formula lanes are selected when complete inputs exist;
- ensure missing topology/context parks all stopped wall outputs;
- verify reversed same-stack exact rows and hostile split/reorder cases.

Done signal:

- wall V1 matrix passes with expected values or explicit stops;
- no wall case publishes lab values as field/building answers;
- UI/API/report parity tests cover at least one live formula, one exact
  row, one `needs_input`, and one `unsupported` wall case.

### Step 3 - Floor V1 Acceptance Matrix

Status: closed on 2026-05-22. The engine-side matrix landed in
`packages/engine/src/acoustic-calculator-answer-engine-v1-contract.test.ts`.
It covers exact measured floor rows, exact ISO 717-2 impact-band
sources, package-transfer anchors, supported-band anchors, raw-bare,
helper-only, direct-fixed, heavy floating lab-impact formula,
field-impact missing context, and ASTM blockers. The heavy floating
formula now has an explicit resolver candidate,
`floor.heavy_concrete_floating_floor.lab_impact_formula`, so mixed
`Ln,w` / `DeltaLw` / `IIC` requests keep owned ISO lab values live while
parking `IIC`. Web output-card/report/API parity for the same floor
states landed in
`apps/web/features/workbench/layer-combination-resolver-candidate-surface-parity.test.ts`.

Acceptance:

- exact floor rows and exact impact-band sources publish only owned
  floor or ISO impact metrics;
- compatible floor anchors and source-absent formulas publish only their
  owned metrics;
- lab impact formulas ask for missing physical inputs instead of
  guessing;
- field impact asks for field context before publishing `L'n,w` /
  `L'nT,w`;
- ASTM `IIC` / `AIIC` remains `unsupported` until its owner exists.

Implementation tasks:

- build one floor acceptance matrix in the V1 contract covering exact
  floor rows, exact ISO 717-2 impact-band sources, package-transfer
  anchors, supported-band anchors, raw-bare, helper-only, direct-fixed,
  lab impact formula, field impact missing context, and ASTM blockers;
- ensure floor roles/topology are explicit before helper-only impact
  formulas publish;
- ensure exact floor rows do not publish STC, `Ctr`, field, or ASTM
  aliases unless those metrics are owned;
- verify split layers, roleless layers, many layers, and mixed
  lab/field output requests.

Done signal:

- floor V1 matrix passes with expected values or explicit stops;
- mixed floor requests preserve owned live lab outputs while parking
  unavailable field/ASTM outputs;
- UI/API/report parity tests cover at least one live formula, one exact
  row, one anchor, one `needs_input`, and one `unsupported` floor case.

### Step 4 - Surface Parity For The Same Answer

Status: closed on 2026-05-22. Workbench answer charts, result summary
cards, report live-stack summaries, saved replay, server snapshot
replay, and resolver candidate surfaces now use the same selected answer
scope. Impact-only answers no longer show incidental airborne `Rw` /
STC / `C` / `Ctr` lanes, exact `Rw`-only answers do not display
unowned STC or spectrum companions, and `needs_input` wall/floor stops
stay visibly stopped with exact missing fields instead of hidden chart
or report values. The targeted Step 4 web validation passed 5 files /
28 tests:
`apps/web/features/workbench/result-answer-chart-model.test.ts`,
`apps/web/features/workbench/result-answer-chart.test.ts`, and
`apps/web/features/workbench/layer-combination-resolver-candidate-surface-parity.test.ts`,
plus focused low-frequency and reinforced-concrete guard tests.

Acceptance:

- workbench cards, answer charts, API payloads, saved replay, server
  snapshot replay, Markdown/PDF/report surfaces, and resolver trace show
  the same selected candidate, basis, support bucket, values, and
  missing inputs;
- stopped outputs are visibly stopped everywhere, not hidden behind
  charts or companion cards.

Implementation tasks:

- add a shared expected-answer fixture that can be asserted by engine,
  API, workbench, saved replay, server snapshot, and report tests;
- remove any surface-local acoustic inference that disagrees with the
  engine answer boundary or resolver trace;
- make stopped outputs visible in cards/charts/report summaries;
- verify mobile and desktop layouts for no critical text overlap after
  adding missing-input and unsupported states.

Done signal:

- one wall and one floor stopped-output case show identical state across
  engine, API, UI, replay, and report;
- one wall and one floor live formula case show identical values and
  basis across the same surfaces;
- UI tests prove stopped outputs are visible, not silently dropped.

### Step 5 - Company-Internal Acceptance Gate

Status: closed on 2026-05-22. The gate landed in
`packages/engine/src/acoustic-calculator-company-internal-usable-v1-acceptance-gate-contract.test.ts`
and is included in `pnpm calculator:gate:current`.

Closeout evidence:

- targeted Step 5 gate passed: 1 file / 2 tests;
- targeted answer-engine plus Step 5 regression passed: 2 files / 22
  tests;
- targeted V1/company-internal regression groups passed: 4 files / 35
  tests and 4 files / 30 tests;
- full `pnpm calculator:gate:current` passed on 2026-05-22 with engine
  510 files / 2912 tests, web 94 files / 397 passed + 18 skipped, repo
  build 5 / 5, and whitespace guard passed.

The gate exercises realistic wall and floor rows across exact measured
same-stack answers, reversed exact wall order, source-absent single-leaf
and double-leaf formulas, compatible floor package-transfer anchors,
helper-only and heavy floating floor formulas, missing topology, missing
field context, missing impact load, missing floor roles, unsupported
building/opening, unsupported ASTM, and metric-alias negatives.

Acceptance:

- a single gate exercises realistic wall and floor stacks across exact,
  anchor, source-absent formula, `needs_input`, and `unsupported`
  outcomes;
- the gate includes hostile layer order, duplicate/split layers, missing
  roles, missing topology, missing field context, mixed lab/field
  output requests, and metric-alias negatives;
- passing this gate is the only basis for saying "usable V1 is ready for
  company-internal use."

Implementation tasks:

- create a single company-internal usable V1 gate file in the engine
  package;
- include a concise but realistic set of wall and floor stacks, not a
  broad catalog crawl;
- assert values where a candidate owns values, and assert exact missing
  fields or unsupported owner terms where it does not;
- add the gate to `pnpm calculator:gate:current`;
- update `CURRENT_STATE.md` only after the gate passes.

Done signal:

- `pnpm calculator:gate:current` passes with the usable V1 gate included;
- the final status checklist marks Steps 0-5 closed with test evidence;
- only then may the project be described as ready for company-internal
  usable V1.

## Explicitly Not Required For Usable V1

These may be future product work, but they must not block usable V1:

- broad source crawling;
- full ASTM `IIC` / `AIIC` runtime owner;
- every exotic wall or floor family;
- full building-prediction productization;
- confidence retuning without answer correctness movement;
- more finite catalog rows when a source-absent formula path is the
  correct product route.

Post-V1 note, 2026-05-23: wall trace reconciliation landed after usable
V1 closure. It does not reopen Steps 0-5; it extends the shared
answer-engine trace so existing wall triple-leaf local-substitution
`Rw`, lab-spectrum `STC`/`C`/`Ctr`, field `R'w`/`DnT,w`, guarded
adjacent flat-list lab/field, Gate H lined massive-wall lab formula, and
company-internal heavy-composite wall lab formula calculations expose
the correct candidate ids, basis, support bucket, budgets, and
scenario-specific value pins. The current shared resolver surface has 27
declared candidates and 24 active runtime-basis mappings after the
post-V1 generalized wall multileaf Gate B runtime corridor. Treat this
as post-V1 answer correctness/surface integration, not as source
crawling or a finite scenario pack.

## Required Status Answer Format

When asked "how much is left", answer with this checklist, not with a
guess:

- Step 0: closed, locked into gate;
- Step 1: closed, candidate-owned answer hardening;
- Step 2: closed, wall V1 acceptance;
- Step 3: closed, floor V1 acceptance;
- Step 4: closed, surface parity;
- Step 5: closed, company-internal acceptance gate.

If a step is not backed by tests, it is not done.
