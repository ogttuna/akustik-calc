# Docs

Living reference docs for the DynEcho acoustic calculator.
Historical checkpoints, analysis notes, and closed-slice plans
live under `docs/archive/`; they inform history but never
override the living triangle under `docs/calculator/`.

## Start Here - Calculator Source Of Truth

Read
[calculator/CALCULATOR_SOURCE_OF_TRUTH.md](./calculator/CALCULATOR_SOURCE_OF_TRUTH.md)
before any calculator implementation or planning work. It defines the
product goal and next-slice selection rules: DynEcho is a usable acoustic
calculator, not a source catalog, finite scenario library, or research
notebook.
For active calculator work, "progress" means scope or accuracy: more
physically valid wall/floor layer combinations calculate owned outputs,
or an existing calculation route becomes more correct, calibrated, or
better bounded. Do not treat source inventory, confidence wording,
finite scenarios, report polish, auth/storage, or generic UI work as
calculator progress unless an executable numeric/correctness gate
explicitly selects it.

Then read
[calculator/USABLE_V1_EXECUTION_PLAN.md](./calculator/USABLE_V1_EXECUTION_PLAN.md)
for the closed company-internal V1 acceptance contract and answer-order
rules.

For current calculator implementation, use only the living authority
chain under `docs/calculator/`: `CALCULATOR_SOURCE_OF_TRUTH.md`,
`USABLE_V1_EXECUTION_PLAN.md`, `CURRENT_STATE.md`,
`NEXT_IMPLEMENTATION_PLAN.md`,
`POST_V1_CALCULATOR_CAPABILITY_PLAN_2026-05-25.md`,
`CHECKPOINT_2026-06-08_DOUBLE_LEAF_ROUTE_INPUT_BOUNDARY_CHECKPOINT.md`,
the landed Gate ES/ET boundary plan
`POST_V1_GATE_ES_ET_REINFORCED_CONCRETE_VISIBLE_DERIVED_BOUNDARY_PLAN_2026-06-08.md`,
the landed Gate EU/EV current coverage/accuracy gap ledger plan
`POST_V1_GATE_EU_EV_CURRENT_COVERAGE_ACCURACY_GAP_LEDGER_PLAN_2026-06-09.md`,
the landed Gate EV/EW heavy-core lined-massive calibration owner plan
`POST_V1_GATE_EV_EW_HEAVY_CORE_LINED_MASSIVE_CALIBRATION_OWNER_PLAN_2026-06-09.md`,
the landed Gate EQ/ER runtime plan
`POST_V1_GATE_EQ_ER_WALL_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_RUNTIME_PLAN_2026-06-08.md`,
the landed thick-board family-boundary safety plan
`POST_V1_THICK_BOARD_AUTO_FAMILY_BOUNDARY_SAFETY_PLAN_2026-06-09.md`,
`CALCULATION_MODEL_AND_VALIDATION.md`, and `SYSTEM_MAP.md`. Older
`CHECKPOINT_*`, `SLICE_*`, roadmap, source-ledger, pilot, and
productization files are historical or secondary context unless the
source-of-truth chain explicitly reselects them.

## Current Implementation Snapshot

As of 2026-06-09, usable V1 Steps 0-5 are closed for the current
company-internal envelope. The post-V1 calculator chain has advanced
through Gate EW. The current selected next action is Gate EX:
`post_v1_next_numeric_coverage_gap_gate_ex_plan`
in
`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ex-contract.test.ts`.
Gate EW landed with status
`post_v1_wall_heavy_core_lined_massive_calibration_owner_gate_ew_landed_no_runtime_owner_rejected_selected_next_numeric_coverage_gap_gate_ex`.
Gate EW owner rejected:
`wall.heavy_core_lined_massive.calibration_owner_rejected_missing_wall_specific_source_or_bounded_rule`.
The current evidence still lacks a wall-specific lined concrete or
heavy-masonry source row and lacks a bounded wall lining rule with
tolerance and negative-boundary ownership. Gate EW keeps
bounded_prediction values frozen. Counters:
`acceptedOwnerLedgers 0`, `calibrationOwnerRejectedLedgers 1`,
`evidenceBoundaryLedgersPinned 8`, `metricBasisBoundariesPinned 4`,
`wallSpecificPositiveRowsAccepted 0`, `runtimeValuesMoved 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.
Gate EV landed with status
`post_v1_current_coverage_accuracy_gap_ledger_gate_ev_landed_no_runtime_selected_wall_heavy_core_lined_massive_calibration_owner_gate_ew`.
Selected Gate EV gap:
`wall.heavy_core_lined_massive_calibration_owner_gap_after_bounded_basis`.
Gate EV selected the heavy-core / lined-massive calibration owner after
classifying the current coverage/accuracy gap ledger:
`post_v1_wall_heavy_core_lined_massive_calibration_owner_gate_ew_plan`
in
`packages/engine/src/post-v1-wall-heavy-core-lined-massive-calibration-owner-gate-ew-contract.test.ts`.
Counters:
`ledgerRows 10`, `currentEvidenceSurfaces 10`, `ownerGapRows 1`,
`runtimeCandidateRowsHeldBehindOwner 1`, `estimatedNextOwnerLedgers 1`,
`estimatedNextRuntimeCandidateFamiliesAfterOwner 1`,
`runtimeValuesMoved 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`.
Gate EU landed with status
`post_v1_next_numeric_coverage_gap_gate_eu_landed_no_runtime_selected_current_coverage_accuracy_gap_ledger_gate_ev`.
Selected candidate:
`calculator.current_coverage_accuracy_gap_ledger_after_gate_et_and_thick_board`.
Gate EU selected the current coverage/accuracy gap ledger after two ROI
iterations (`roiAnalysisIterations: 2`). Counters:
`candidateCount 10`, `estimatedNextGapLedgers 1`,
`estimatedNextBoundaryLedgers 2`,
`estimatedNextRuntimeCandidateFamiliesToEvaluate 6`,
`runtimeValuesMoved 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`.
Gate EU selected Gate EV in
`post_v1_current_coverage_accuracy_gap_ledger_gate_ev_plan`,
`packages/engine/src/post-v1-current-coverage-accuracy-gap-ledger-gate-ev-contract.test.ts`.
The latest checkpoint is
`CHECKPOINT_2026-06-08_DOUBLE_LEAF_ROUTE_INPUT_BOUNDARY_CHECKPOINT.md`.
It records commit `fb0ea67 Fix double-leaf route input boundary`: flat
`leaf / porous absorber / leaf` wall stacks without complete
double-leaf topology/support inputs remain parked as `needs_input`, and
complete topology still calculates. Gate EW has since landed owner
rejected and selected Gate EX.

The latest landed route-family safety follow-up is
`POST_V1_THICK_BOARD_AUTO_FAMILY_BOUNDARY_SAFETY_PLAN_2026-06-09.md`.
It keeps generic board/panel/membrane Auto wall stacks, including thick
gypsum-like leaves, from promoting into `lined_massive_wall` by surface
mass alone while preserving true concrete/AAC/brick/CLT massive-core
lanes. The focused engine safety contract has 62 tests, the web payload
contract has 4 tests, both are registered in the current-gate runner,
and this follow-up does not replace Gate EX.

Latest full documented gate: `pnpm calculator:gate:current` passed after
Gate EW current-gate registration with engine 667 files / 3706 tests,
web 115 files / 447 passed and 18 skipped, repo build 5 / 5, and
whitespace guard passed.

The latest no-runtime boundary slice is
`post_v1_floor_reinforced_concrete_visible_derived_missing_input_boundary_gate_et_plan`
with status
`post_v1_floor_reinforced_concrete_visible_derived_missing_input_boundary_gate_et_landed_no_runtime_selected_next_numeric_coverage_gap_gate_eu`.
Boundary id:
`floor.reinforced_concrete.visible_derived_lower_assembly_from_layers_missing_dynamic_stiffness_and_load`.
Gate ET pins the reinforced-concrete visible-derived missing-input boundary:
visible layer roles already define the lower assembly, so
`Ln,w` / `DeltaLw` stop on `resilientLayerDynamicStiffnessMNm3` and
`loadBasisKgM2`; explicit partial predictor input still requires
`loadBasisKgM2` and `ceilingOrLowerAssembly`. Counters:
`currentGateFailuresCleared 6`, `runtimeValuesMoved 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 1`.
Gate ET selected Gate EU in
`post_v1_next_numeric_coverage_gap_gate_eu_plan`,
`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-eu-contract.test.ts`;
Gate EU has since landed and selected Gate EV.

The latest no-runtime numeric coverage/accuracy rerank is
`post_v1_next_numeric_coverage_gap_gate_es_plan` with status
`post_v1_next_numeric_coverage_gap_gate_es_landed_no_runtime_selected_floor_reinforced_concrete_visible_derived_missing_input_boundary_gate_et`.
Gate ES selected
`floor.reinforced_concrete_visible_derived_missing_input_boundary_refresh`
after two ROI iterations (`roiAnalysisIterations: 2`) and selected Gate
ET in
`packages/engine/src/post-v1-floor-reinforced-concrete-visible-derived-missing-input-boundary-gate-et-contract.test.ts`.
Estimated Gate ET boundary-surface touch:
`estimatedNextFrontendImplementationFilesTouched 1`.
Gate ES counters include `runtimeValuesMoved 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.

The latest value-moving runtime slice is
`post_v1_wall_direct_fixed_double_leaf_field_building_adapter_runtime_gate_er_plan`
with status
`post_v1_wall_direct_fixed_double_leaf_field_building_adapter_runtime_gate_er_landed_runtime_selected_next_numeric_coverage_gap_gate_es`.
Readable label: direct-fixed double-leaf field/building adapter runtime.
Gate ER connects the Gate EO direct separating-element curve to
`gate_i_airborne_field_apparent_context_adapter_runtime` for complete
direct-fixed `field_between_rooms` requests and to
`gate_ar_airborne_building_prediction_all_owner_runtime_corridor` for
complete direct-fixed `building_prediction` requests. The representative
direct-fixed empty-cavity stack calculates `R'w 23 / Dn,w 24 / DnT,w 27`
in both contexts. Missing `receivingRoomRt60S` and missing
`supportSpacingMm` remain `needs_input`, lab output remains
`Rw 31 / STC 31 / C -1.2 / Ctr -5.9`, `runtimeValuesMoved 6`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.
Gate ER selected Gate ES file:
`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-es-contract.test.ts`.

Gate EQ remains the latest landed no-runtime adapter owner proof. It
accepted `wall.direct_fixed_double_leaf.field_between_rooms_adapter_owner`
and `wall.direct_fixed_double_leaf.building_prediction_adapter_owner`
before Gate ER moved runtime values. Broad source crawling, source-row
cataloguing, confidence-label work, and UI/product polish are not
selected calculator work for this step.

Focused Gate EM/EN/EO/EP/EQ/ER/ES/ET implementation checks are green
when run by their targeted Vitest files. Gate ET specifically resolves
the earlier reinforced-concrete visible-derived expectation drift by
aligning the contracts to the runtime boundary above.

The closed-gate ledger below is retained for contract-test continuity
and historical traceability. Do not use an older "selected next" or
"latest" line in that ledger as current authority when it conflicts with
the snapshot or the living calculator docs.

## Closed-Gate Ledger

The selected post-V1 implementation plan is
[calculator/POST_V1_CALCULATOR_CAPABILITY_PLAN_2026-05-25.md](./calculator/POST_V1_CALCULATOR_CAPABILITY_PLAN_2026-05-25.md).
The post-Gate-CD high-ROI scope/accuracy planning input for Gate CE is
[calculator/POST_V1_HIGH_ROI_SCOPE_ACCURACY_GATES_AFTER_GATE_CD_PLAN_2026-06-02.md](./calculator/POST_V1_HIGH_ROI_SCOPE_ACCURACY_GATES_AFTER_GATE_CD_PLAN_2026-06-02.md).
Gate CE landed as `post_v1_next_numeric_coverage_gap_gate_ce_plan`
with status
`post_v1_next_numeric_coverage_gap_gate_ce_landed_no_runtime_selected_target_output_independence_sweep_gate_cf`.
It selected `target_output_independence_sweep`, now closed by Gate CF.
An earlier landed value-moving numeric coverage slice is
`post_v1_target_output_independence_sweep_gate_cf_plan`
in
`packages/engine/src/post-v1-target-output-independence-sweep-gate-cf-contract.test.ts`.
Gate CF repaired wall field-context lab companion single-output requests
so flat double-leaf and full-fill multileaf `Rw`, STC, `C`, and `Ctr`
use the owned family route instead of screening fallback or unsupported
publication. It also pins raw-bare open-web/open-box field impact,
heavy-concrete combined lab impact, and steel suspended-ceiling field
impact single-output parity. Counters: `newSingleOutputParityPins 37`,
`runtimeCorrectedRequestShapes 8`, `newCalculableRequestShapes 8`,
`newCalculableLayerTemplates 0`. Gate CF status is
`post_v1_target_output_independence_sweep_gate_cf_landed_selected_floor_common_floating_covering_expansion_gate_cg`;
Gate CF selected
`post_v1_floor_common_floating_covering_expansion_gate_cg_plan`, with
selected next file
`packages/engine/src/post-v1-floor-common-floating-covering-expansion-gate-cg-contract.test.ts`.
Gate CG has now landed as
`post_v1_floor_common_floating_covering_expansion_gate_cg_plan` with
status
`post_v1_floor_common_floating_covering_expansion_gate_cg_landed_partial_selected_floor_common_floating_covering_expansion_gate_cg2`.
It is the first common floor floating/covering runtime expansion:
floor-covering-only heavy/reinforced concrete stacks now keep the owned
bare-heavy `Ln,w` live when `DeltaLw` or field impact companions are
requested. Representative covering templates publish `Ln,w 71.2`,
`71.6`, `71.5`, and `71.4`; with explicit `impactFieldContext` they
also publish `L'n,w`, `L'nT,w`, and `L'nT,50`. `DeltaLw` remains
`needs_input` for `toppingOrFloatingLayer`,
`resilientLayerDynamicStiffnessMNm3`, and `loadBasisKgM2`; ASTM `IIC` /
`AIIC` remain unsupported without ASTM E492/E1007 owners. Counters:
`newCalculableLayerTemplates 4`, `newCalculableRequestShapes 20`, and
`runtimeCorrectedRequestShapes 12`.
Gate CG selected
`post_v1_floor_common_floating_covering_expansion_gate_cg2_plan`, with
selected next file
`packages/engine/src/post-v1-floor-common-floating-covering-expansion-gate-cg2-contract.test.ts`.
Gate CG2 has now landed as
`post_v1_floor_common_floating_covering_expansion_gate_cg2_plan` with
status
`post_v1_floor_common_floating_covering_expansion_gate_cg2_landed_selected_next_numeric_coverage_gap_gate_ch`.
Visible heavy-floating reinforced-concrete upper-treatment stacks now
keep the published-family `Ln,w 50` anchor live when `loadBasisKgM2` or
`resilientLayerDynamicStiffnessMNm3` is missing, while `DeltaLw` remains
`needs_input` for the exact missing owner field. With complete
`impactFieldContext`, the same anchor publishes `L'n,w 52`,
`L'nT,w 49.6`, and `L'nT,50 53.6`; complete explicit dynamic input
still uses `Ln,w 50.3` / `DeltaLw 24.3`. Counters:
`newCalculableLayerTemplates 2`, `newCalculableRequestShapes 10`, and
`runtimeCorrectedRequestShapes 8`. ASTM `IIC` / `AIIC` remain
unsupported without ASTM E492/E1007 owners. The resolver surface now has
43 declared candidates and 40 active runtime-basis mappings. Historical
Gate H-M resolver snapshots recorded 42 declared candidates and 39 active runtime-basis mappings before Gate CG2 added the published
upper-treatment owner. Gate CG2
selected
`post_v1_next_numeric_coverage_gap_gate_ch_plan`, with selected next
file
`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ch-contract.test.ts`.
Gate CH later landed as a historical value-moving runtime slice:
`post_v1_next_numeric_coverage_gap_gate_ch_plan`, with status
`post_v1_next_numeric_coverage_gap_gate_ch_landed_runtime_selected_next_numeric_coverage_gap_gate_ci`.
It corrects the field/building direct+flanking low-frequency companion
for the same visible heavy-floating upper-treatment route: explicit
direct/flanking impact context plus `impactFieldContext.ci50_2500Db`
publishes `L'n,w 57.5 / L'nT,w 55.1 / L'nT,50 59.1` from the
published upper-treatment `Ln,w 50` anchor. Missing CI50 still stops
only `L'nT,50`, and ASTM `IIC` / `AIIC` remain unsupported. At that
historical point, Gate CH selected
`post_v1_next_numeric_coverage_gap_gate_ci_plan`, with selected next file
`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ci-contract.test.ts`.
The previous value-moving numeric coverage slice is
`post_v1_floor_open_box_target_output_independence_gate_cd_plan`.
Gate CD corrects finished open-box target-output independence: complete
dry package-transfer and EPS/screed hybrid building/impact requests now
support already-owned single-output asks. Dry pins include `Rw 66`,
`C -3.9`, `Ln,w 50.8`, `L'n,w 52.8`, `L'nT,w 50.4`, and
`L'nT,50 53.7`; EPS/screed pins include `Rw 72`, `C -1.3`,
`Ln,w 47`, `L'n,w 49`, `L'nT,w 46.6`, and `L'nT,50 47.6`.
Missing `impactFieldContext` still leaves the field impact outputs
unsupported; `Ctr`, ASTM `IIC`, and ASTM `AIIC` remain unsupported
without their own metric-basis owners.
Gate CD status is
`post_v1_floor_open_box_target_output_independence_gate_cd_landed_selected_next_numeric_coverage_gap_gate_ce`;
Full `pnpm calculator:gate:current` passed after Gate CH on 2026-06-02
with engine 599 files / 3301 tests, web 113 files / 437 passed + 18
skipped, repo build 5 / 5, and whitespace guard passed.
Gate CC remains the previous no-runtime selection:
`post_v1_next_numeric_coverage_gap_gate_cc_plan` with status
`post_v1_next_numeric_coverage_gap_gate_cc_landed_no_runtime_selected_floor_open_box_target_output_independence_gate_cd`.
It selected
`floor.open_box_timber_finished_package.target_output_independence_gap`,
now closed by Gate CD. Gate CC selected next file:
`packages/engine/src/post-v1-floor-open-box-target-output-independence-gate-cd-contract.test.ts`.
Gate CB remains the previous value-moving runtime slice:
`post_v1_floor_open_box_eps_screed_full_mixed_field_building_gate_cb_plan`
with status
`post_v1_floor_open_box_eps_screed_full_mixed_field_building_gate_cb_landed_selected_next_numeric_coverage_gap_gate_cc`.
It corrected EPS/screed open-box full mixed building/impact scope:
complete mixed requests publish visible `Rw 72 / C -1.3`,
`R'w 70 / DnT,w 73`,
`Ln,w 47 / CI 0 / CI,50-2500 1 / Ln,w+CI 47`, and
`L'n,w 49 / L'nT,w 46.6 / L'nT,50 47.6`.
Gate CA remains the previous no-runtime selection:
`post_v1_next_numeric_coverage_gap_gate_ca_plan` with status
`post_v1_next_numeric_coverage_gap_gate_ca_landed_no_runtime_selected_floor_open_box_eps_screed_full_mixed_field_building_gate_cb`.
It selected
`floor.open_box_timber_eps_screed_hybrid.full_mixed_field_building_gap`,
now closed by Gate CB.
Gate BZ remains the previous value-moving runtime slice:
`post_v1_floor_open_box_finished_package_full_mixed_building_impact_gate_bz_plan`
with status
`post_v1_floor_open_box_finished_package_full_mixed_building_impact_gate_bz_landed_selected_next_numeric_coverage_gap_gate_ca`.
It corrected finished open-box package full mixed building/impact
scope: dry package-transfer mixed requests publish visible
`Rw 66 / C -3.9`, `R'w 64 / DnT,w 67`,
`Ln,w 50.8 / CI 1.2 / CI,50-2500 3.3 / Ln,w+CI 52`, and
`L'n,w 52.8 / L'nT,w 50.4 / L'nT,50 53.7`, while EPS/screed hybrid
mixed requests publish `Rw 72 / C -1.3`, `R'w 70 / DnT,w 73`,
`Ln,w 47 / CI 0 / CI,50-2500 1 / Ln,w+CI 47`, and after Gate CB
`L'n,w 49 / L'nT,w 46.6 / L'nT,50 47.6`.
Gate BY remains the previous no-runtime selection:
`post_v1_next_numeric_coverage_gap_gate_by_plan` with status
`post_v1_next_numeric_coverage_gap_gate_by_landed_no_runtime_selected_floor_open_box_finished_package_full_mixed_building_impact_gate_bz`.
It selected `floor.open_box_timber_finished_package.full_mixed_building_impact_gap`,
now closed by Gate BZ.
Gate BX remains the previous value-moving runtime slice:
`post_v1_floor_open_box_finished_package_lab_metric_projection_gate_bx_plan`
with status
`post_v1_floor_open_box_finished_package_lab_metric_projection_gate_bx_landed_selected_next_numeric_coverage_gap_gate_by`.
It selected `post_v1_next_numeric_coverage_gap_gate_by_plan` after
correcting finished open-box package mixed lab-impact metric projection:
dry package-transfer mixed requests publish visible `Rw 66 / C -3.9`,
while EPS/screed hybrid mixed requests publish `Rw 72 / C -1.3`.
Gate BW remains the previous no-runtime selection:
`post_v1_next_numeric_coverage_gap_gate_bw_plan` with status
`post_v1_next_numeric_coverage_gap_gate_bw_landed_no_runtime_selected_floor_open_box_finished_package_lab_metric_projection_gate_bx`.
It selected `floor.open_box_timber_finished_package.lab_metric_projection_gap`,
now closed by Gate BX.
Gate BV remains the previous value-moving runtime slice:
`post_v1_floor_open_box_finished_package_mixed_lab_building_companion_gate_bv_plan`
with status
`post_v1_floor_open_box_finished_package_mixed_lab_building_companion_gate_bv_landed_selected_next_numeric_coverage_gap_gate_bw`.
Gate BT remains the previous no-runtime selection:
`post_v1_next_numeric_coverage_gap_gate_bt_plan` with status
`post_v1_next_numeric_coverage_gap_gate_bt_landed_no_runtime_selected_floor_open_box_finished_package_airborne_building_companion_gate_bu`.
Closed Gate BF-BH continuity anchors remain historical evidence, not
the current selection. Gate BF landed
`post_v1_floor_suspended_ceiling_lower_treatment_field_companion_gate_bf_plan`
with status
`post_v1_floor_suspended_ceiling_lower_treatment_field_companion_gate_bf_landed_selected_next_numeric_coverage_gap_gate_bg`,
selected `post_v1_next_numeric_coverage_gap_gate_bg_plan` in
`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-bg-contract.test.ts`,
and opened assembly field-only lower-treatment pins
`L'n,w 47.6 / L'nT,w 44.8 / L'nT,50 48.8`. Gate BG landed as
`post_v1_next_numeric_coverage_gap_gate_bg_plan` with status
`post_v1_next_numeric_coverage_gap_gate_bg_landed_no_runtime_selected_floor_mixed_support_family_owner_boundary_gate_bh`,
selected `floor.mixed_support_family.multi_family_solver_gap`, and
selected `post_v1_floor_mixed_support_family_owner_boundary_gate_bh_plan`
in
`packages/engine/src/post-v1-floor-mixed-support-family-owner-boundary-gate-bh-contract.test.ts`
as scope/accuracy work. Gate BH landed as
`post_v1_floor_mixed_support_family_owner_boundary_gate_bh_plan` with
status
`post_v1_floor_mixed_support_family_owner_boundary_gate_bh_landed_no_runtime_selected_floor_mixed_support_family_runtime_corridor_gate_bi`,
pinned `primaryCarrierFamily`, `dominantImpactTransferFamily`,
`mixedSupportRolePartition`, `secondarySupportTreatmentOwner`, and
`duplicateOwnershipGuard`, and selected
`post_v1_floor_mixed_support_family_runtime_corridor_gate_bi_plan` in
`packages/engine/src/post-v1-floor-mixed-support-family-runtime-corridor-gate-bi-contract.test.ts`
as scope/accuracy owner-boundary follow-through.
Gate BI has now landed as
`post_v1_floor_mixed_support_family_runtime_corridor_gate_bi_plan` with
status
`post_v1_floor_mixed_support_family_runtime_corridor_gate_bi_landed_selected_floor_mixed_support_family_surface_parity_gate_bj`.
It opens the explicit single-primary-carrier mixed-support runtime:
complete owner input calculates `Ln,w 44.6` / `DeltaLw 29.9`, and with
explicit impact field context also calculates `L'n,w 46.6`,
`L'nT,w 43.8`, and `L'nT,50 47.8`. Missing owner fields still stop as
`needs_input`, unsafe mixed-support partitions do not fall through to
another family solver, and ASTM `IIC` / `AIIC` remain unsupported. Gate
BI selected `post_v1_floor_mixed_support_family_surface_parity_gate_bj_plan`
in
`packages/engine/src/post-v1-floor-mixed-support-family-surface-parity-gate-bj-contract.test.ts`.
Gate BJ has now landed as
`post_v1_floor_mixed_support_family_surface_parity_gate_bj_plan` with
status
`post_v1_floor_mixed_support_family_surface_parity_gate_bj_landed_no_runtime_selected_next_numeric_coverage_gap_gate_bk`.
It is no-runtime surface parity and usage-placement correction:
workbench cards, Markdown report, saved replay, estimate API,
impact-only API, resolver trace, and dynamic impact trace now expose the
same Gate BI mixed-support answer. The complete explicit case remains
`Ln,w 44.6` / `DeltaLw 29.9`; with field context it remains
`L'n,w 46.6` / `L'nT,w 43.8` / `L'nT,50 47.8`. Gate BJ also keeps the
ready explicit mixed-support predictor lane from being parked behind the
older generic floor-impact needs-input guard in `calculateAssembly`.
Missing owner fields, unsafe duplicate partitions, and ASTM `IIC` /
`AIIC` aliases remain blocked. Gate BJ selected
`post_v1_next_numeric_coverage_gap_gate_bk_plan` in
`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-bk-contract.test.ts`.
Gate BK has now landed as
`post_v1_floor_open_web_raw_bare_field_companion_gate_bk_plan` with
status
`post_v1_floor_open_web_raw_bare_field_companion_gate_bk_landed_selected_next_numeric_coverage_gap_gate_bl`.
It is runtime calculator coverage: the raw-bare open-web steel
base-only stack keeps lab `Ln,w 96`, `CI 1.8`, `CI,50-2500 5.2`, and
`Ln,w+CI 97.8`, and with explicit `impactFieldContext` now calculates
`L'n,w 98`, `L'nT,w 95.6`, and `L'nT,50 100.8`. Field-only requests
derive the lab anchor internally. Missing field context remains
`needs_input`; building prediction, open-box raw-bare field transfer,
and ASTM `IIC` / `AIIC` aliases remain blocked. Gate BK selected
`post_v1_next_numeric_coverage_gap_gate_bl_plan`.
Gate BL has now landed as
`post_v1_next_numeric_coverage_gap_gate_bl_plan` with status
`post_v1_next_numeric_coverage_gap_gate_bl_landed_no_runtime_selected_floor_open_box_raw_bare_field_companion_gate_bl`.
It selected `floor.open_box_timber_raw_bare.field_companion_runtime_gap`
and next action
`post_v1_floor_open_box_raw_bare_field_companion_gate_bl_plan` in
`packages/engine/src/post-v1-floor-open-box-raw-bare-field-companion-gate-bl-contract.test.ts`.
The plan is
[calculator/POST_V1_GATE_BL_NUMERIC_COVERAGE_AND_ACCURACY_RERANK_PLAN_2026-06-01.md](./calculator/POST_V1_GATE_BL_NUMERIC_COVERAGE_AND_ACCURACY_RERANK_PLAN_2026-06-01.md).
The selected runtime acceptance pins include `L'n,w 93.1`, `L'nT,w 90.7`,
and `L'nT,50 94.1` for the 220 mm raw-bare open-box carrier with
explicit `impactFieldContext`; building prediction and ASTM `IIC` /
`AIIC` remain blocked.
Gate BL runtime has now landed as
`post_v1_floor_open_box_raw_bare_field_companion_gate_bl_plan` with
status
`post_v1_floor_open_box_raw_bare_field_companion_gate_bl_landed_selected_next_numeric_coverage_gap_gate_bm`.
This is runtime calculator coverage: the 220 mm raw-bare open-box
carrier now calculates `L'n,w 93.1`, `L'nT,w 90.7`, and `L'nT,50 94.1`
with explicit `impactFieldContext`; the 370 mm carrier calculates
`L'n,w 90.2`, `L'nT,w 87.8`, and `L'nT,50 90.9`. Field-only requests
derive the lab anchor internally. Missing field context still stops as
`needs_input`; building prediction and ASTM `IIC` / `AIIC` remain
blocked. Validation after Gate BL runtime: `pnpm calculator:gate:current`
passed with engine 576 files / 3189 tests, web 113 files / 437 passed +
18 skipped, repo build 5 / 5, and whitespace guard passed. Gate BL
selected `post_v1_next_numeric_coverage_gap_gate_bm_plan`.
Gate BM has now landed as
`post_v1_next_numeric_coverage_gap_gate_bm_plan` with status
`post_v1_next_numeric_coverage_gap_gate_bm_landed_runtime_selected_next_numeric_coverage_gap_gate_bn`.
It is runtime calculator coverage for
`floor.raw_bare_open_web.building_prediction_impact_direct_flanking_runtime_gap`:
the 300 mm raw-bare open-web steel carrier with explicit direct+flanking
`impactFieldContext` now calculates `L'n,w 97.8`, `L'nT,w 95.4`, and
`L'nT,50 100.6` under `contextMode=building_prediction`. `R'w`,
`DnT,w`, and lab `Ln,w` are not published as floor building outputs,
open-box raw-bare building prediction remains blocked, and ASTM `IIC` /
`AIIC` remain unsupported. Source-absent single-number direct+flanking
uplifts above `12 dB` stay blocked until exact path or impact-band
evidence exists. The plan is
[calculator/POST_V1_GATE_BM_NUMERIC_COVERAGE_AND_ACCURACY_RERANK_PLAN_2026-06-01.md](./calculator/POST_V1_GATE_BM_NUMERIC_COVERAGE_AND_ACCURACY_RERANK_PLAN_2026-06-01.md).
Gate BM selected `post_v1_next_numeric_coverage_gap_gate_bn_plan` in
`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-bn-contract.test.ts`.
The active Gate BN plan is
[calculator/POST_V1_GATE_BN_NUMERIC_PLAUSIBILITY_AND_CALIBRATION_PLAN_2026-06-01.md](./calculator/POST_V1_GATE_BN_NUMERIC_PLAUSIBILITY_AND_CALIBRATION_PLAN_2026-06-01.md).
Gate BN must land an executable numeric plausibility/calibration
contract before another source-absent building route opens: raw-bare high
`Ln,w` values may remain calculable only on explicit raw-bare bases,
direct/flanking uplifts without exact evidence stay bounded, and ISO
impact outputs must not become ASTM aliases.
Gate BN has now landed as `post_v1_next_numeric_coverage_gap_gate_bn_plan`
with status
`post_v1_next_numeric_coverage_gap_gate_bn_landed_no_runtime_selected_floor_open_box_raw_bare_building_prediction_owner_gate_bo`.
The selected accuracy candidate is
`calculator.numeric_plausibility_and_calibration_sweep.source_absent_field_building_routes`.
Gate BN selects `floor.open_box_timber_raw_bare.building_prediction_owner_gap`
and `post_v1_floor_open_box_raw_bare_building_prediction_owner_gate_bo_plan`
in
`packages/engine/src/post-v1-floor-open-box-raw-bare-building-prediction-owner-gate-bo-contract.test.ts`.
Gate BO has now landed as
`post_v1_floor_open_box_raw_bare_building_prediction_owner_gate_bo_plan`
with status
`post_v1_floor_open_box_raw_bare_building_prediction_owner_gate_bo_landed_runtime_selected_next_numeric_coverage_gap_gate_bp`.
This is runtime calculator coverage for
`floor.open_box_timber_raw_bare.building_prediction_owner_gap`: the 220
mm raw-bare open-box carrier with explicit direct+flanking
`impactFieldContext` now calculates `L'n,w 92.9`, `L'nT,w 90.5`, and
`L'nT,50 93.9` under `contextMode=building_prediction`; the 370 mm
carrier calculates `L'n,w 90`, `L'nT,w 87.6`, and `L'nT,50 90.7`.
Simple `fieldKDb`, severe source-absent direct+flanking uplift, `R'w`,
`DnT,w`, lab `Ln,w`, and ASTM `IIC` / `AIIC` remain blocked. Gate BO
selects `post_v1_next_numeric_coverage_gap_gate_bp_plan` in
`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-bp-contract.test.ts`.
The active Gate BP plan is
[calculator/POST_V1_GATE_BP_NUMERIC_COVERAGE_AND_ACCURACY_RERANK_PLAN_2026-06-01.md](./calculator/POST_V1_GATE_BP_NUMERIC_COVERAGE_AND_ACCURACY_RERANK_PLAN_2026-06-01.md).
Gate BP has now landed as `post_v1_next_numeric_coverage_gap_gate_bp_plan`
with status
`post_v1_next_numeric_coverage_gap_gate_bp_landed_no_runtime_selected_floor_raw_bare_airborne_building_prediction_gate_bq`.
It selected
`floor.raw_bare_floor_airborne_building_prediction_owner_gap` because
raw-bare floor building airborne outputs (`R'w`, `Dn,w`, `Dn,A`,
`DnT,w`, `DnT,A`) must be calculated from the owned raw-bare direct
`Rw` path rather than generic screening. Gate BP selected
`post_v1_floor_raw_bare_airborne_building_prediction_gate_bq_plan` in
`packages/engine/src/post-v1-floor-raw-bare-airborne-building-prediction-gate-bq-contract.test.ts`.
The active Gate BQ plan is
[calculator/POST_V1_GATE_BQ_RAW_BARE_AIRBORNE_BUILDING_PREDICTION_PLAN_2026-06-01.md](./calculator/POST_V1_GATE_BQ_RAW_BARE_AIRBORNE_BUILDING_PREDICTION_PLAN_2026-06-01.md).
Gate BQ has now landed as
`post_v1_floor_raw_bare_airborne_building_prediction_gate_bq_plan`
with status
`post_v1_floor_raw_bare_airborne_building_prediction_gate_bq_landed_runtime_selected_next_numeric_coverage_gap_gate_br`.
The 220 mm raw-bare open-box building airborne case now publishes
`R'w 36` and `DnT,w 39`; thicker open-box and open-web raw-bare
carriers publish the same output family from their owned direct `Rw`
anchors instead of generic screening. ASTM `IIC` / `AIIC` remain
unsupported without their own ASTM owner. Gate BQ selects
`post_v1_next_numeric_coverage_gap_gate_br_plan` in
`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-br-contract.test.ts`.
Gate BR has now landed as `post_v1_next_numeric_coverage_gap_gate_br_plan`
with status
`post_v1_next_numeric_coverage_gap_gate_br_landed_no_runtime_selected_floor_open_box_eps_screed_field_companion_gate_bs`.
It selected
`floor.open_box_timber_eps_screed_hybrid.field_companion_runtime_gap`
because complete open-box timber finished-package lanes already own lab
`Ln,w` / `CI,50-2500` anchors. Dry package-transfer mixed requests
publish `L'n,w 52.8` / `L'nT,w 50.4` / `L'nT,50 53.7`, but dry
field-only requests currently publish a mismatched `46.7` / `44.3` /
`48.1` tuple; EPS/screed hybrid field outputs remain blocked. Gate BS
must align dry field-only with the mixed-request anchor and apply the
existing field-context adapter to the EPS/screed hybrid field route,
while `R'w`, `DnT,w`, and ASTM `IIC` / `AIIC` remain separate owners. Gate BR selects
`post_v1_floor_open_box_eps_screed_field_companion_gate_bs_plan` in
`packages/engine/src/post-v1-floor-open-box-eps-screed-field-companion-gate-bs-contract.test.ts`.
Gate BS has now landed as
`post_v1_floor_open_box_eps_screed_field_companion_gate_bs_plan` with
status
`post_v1_floor_open_box_eps_screed_field_companion_gate_bs_landed_selected_next_numeric_coverage_gap_gate_bt`.
This is runtime calculator coverage and correctness: dry package-transfer
field-only requests now use the same anchor as mixed requests and
calculate `L'n,w 52.8` / `L'nT,w 50.4` / `L'nT,50 53.7`; EPS/screed
hybrid requests with explicit `impactFieldContext` now calculate
`L'n,w 49` / `L'nT,w 46.6` / `L'nT,50 47.6` from the owned `Ln,w 47` /
`CI,50-2500 1` lab anchor. Missing `impactFieldContext` remains
`needs_input`; `R'w`, `DnT,w`, and ASTM `IIC` / `AIIC` remain separate
owners. Gate BS selects `post_v1_next_numeric_coverage_gap_gate_bt_plan`.

Gate BT has now landed as
`post_v1_next_numeric_coverage_gap_gate_bt_plan` with status
`post_v1_next_numeric_coverage_gap_gate_bt_landed_no_runtime_selected_floor_open_box_finished_package_airborne_building_companion_gate_bu`.
It is no-runtime calculator selection, not source crawling or UI/report
work. Gate BT selected
`floor.open_box_timber_finished_package.airborne_building_companion_gap`
because finished open-box packages already own lab airborne anchors
(`Rw 66` dry package-transfer and `Rw 72` EPS/screed hybrid), while
complete building-only `R'w` / `DnT,w` requests can still fall to
generic predictor or `screening_mass_law_curve_seed_v3` airborne bases
instead of the package anchor. Gate BT selected
`post_v1_floor_open_box_finished_package_airborne_building_companion_gate_bu_plan`
in
`packages/engine/src/post-v1-floor-open-box-finished-package-airborne-building-companion-gate-bu-contract.test.ts`.
The landed Gate AZ planning bridge is
[calculator/POST_V1_GATE_AZ_NUMERIC_COVERAGE_GAP_PLAN_2026-05-27.md](./calculator/POST_V1_GATE_AZ_NUMERIC_COVERAGE_GAP_PLAN_2026-05-27.md).
Earlier Gate AY evidence remains recorded for closed-gate continuity:
`post_v1_floor_tuas_c11c_iso_impact_gate_ay_plan` with status
`post_v1_floor_tuas_c11c_iso_impact_gate_ay_landed_selected_next_numeric_coverage_gap_gate_az`
selected `post_v1_next_numeric_coverage_gap_gate_az_plan` for
`floor-tuas-c11c-fail-closed`. It pins `Ln,w 59`, `CI 1`,
`CI,50-2500 1`, `Ln,w+CI 60`, and field `L'nT,50 60.2` on
`tuas_c11c_visible_iso_weighted_impact_tuple_guarded`.
Gate AZ has now landed as
`post_v1_next_numeric_coverage_gap_gate_az_plan` with status
`post_v1_next_numeric_coverage_gap_gate_az_landed_no_runtime_selected_floor_dynamic_stiffness_load_basis_owner_gate_ba`.
It selected `post_v1_floor_dynamic_stiffness_load_basis_owner_gate_ba_plan`
in
`packages/engine/src/post-v1-floor-dynamic-stiffness-load-basis-owner-gate-ba-contract.test.ts`.
The ranked floor-impact source-absent candidates are
`floor.material_owner_gap.dynamic_stiffness_load_basis`,
`floor.suspended_ceiling.lower_treatment_coupling_gap`, and
`floor.mixed_support_family.multi_family_solver_gap`.
Gate BA has now landed as
`post_v1_floor_dynamic_stiffness_load_basis_owner_gate_ba_plan` with
status
`post_v1_floor_dynamic_stiffness_load_basis_owner_gate_ba_landed_no_runtime_selected_suspended_ceiling_lower_treatment_gate_bb`.
It pins `resilientLayerDynamicStiffnessMNm3` and `loadBasisKgM2` as
no-default physical owner fields, preserves the existing `Ln,w 48.7` /
`DeltaLw 25.8` heavy-floating runtime, and selects
`post_v1_floor_suspended_ceiling_lower_treatment_gate_bb_plan` in
`packages/engine/src/post-v1-floor-suspended-ceiling-lower-treatment-gate-bb-contract.test.ts`.

Gate BB has now landed as
`post_v1_floor_suspended_ceiling_lower_treatment_gate_bb_plan` with
status
`post_v1_floor_suspended_ceiling_lower_treatment_gate_bb_landed_selected_surface_parity_gate_bc`.
Complete visible heavy-concrete combined upper/lower floor stacks with
`acoustic_hanger_ceiling` or `resilient_stud_ceiling` lower-treatment
support now calculate on
`predictor_heavy_combined_upper_lower_floor_iso12354_annexc_estimate`.
Pinned values: acoustic hanger `Ln,w 45.6` / `DeltaLw 28.9`;
resilient stud `Ln,w 44.6` / `DeltaLw 29.9`. Missing
`ceilingOrLowerAssembly` or `loadBasisKgM2` still stops, and ASTM
`IIC` / `AIIC` aliases remain unsupported. Gate BB selects
`post_v1_floor_suspended_ceiling_lower_treatment_surface_parity_gate_bc_plan`
in
`packages/engine/src/post-v1-floor-suspended-ceiling-lower-treatment-surface-parity-gate-bc-contract.test.ts`.

Gate BC has now landed as
`post_v1_floor_suspended_ceiling_lower_treatment_surface_parity_gate_bc_plan`
with status
`post_v1_floor_suspended_ceiling_lower_treatment_surface_parity_gate_bc_landed_selected_coverage_refresh_gate_bd`.
Workbench cards, Markdown report, saved replay, estimate API,
impact-only API, and resolver trace now expose the same layer-derived
heavy-concrete combined lower-treatment answer. Acoustic hanger remains
`Ln,w 45.6` / `DeltaLw 28.9`; resilient stud remains `Ln,w 44.6` /
`DeltaLw 29.9`. Gate BC selects
`post_v1_floor_suspended_ceiling_lower_treatment_coverage_refresh_gate_bd_plan`
in
`packages/engine/src/post-v1-floor-suspended-ceiling-lower-treatment-coverage-refresh-gate-bd-contract.test.ts`.
Gate BD has now landed as
`post_v1_floor_suspended_ceiling_lower_treatment_coverage_refresh_gate_bd_plan`
with status
`post_v1_floor_suspended_ceiling_lower_treatment_coverage_refresh_gate_bd_landed_no_runtime_selected_next_numeric_coverage_gap_gate_be`.
It counts the acoustic-hanger, resilient-stud, and impact-only
lower-treatment formula rows as source-absent family-physics coverage
with pins `Ln,w 45.6` / `DeltaLw 28.9` and `Ln,w 44.6` /
`DeltaLw 29.9`; missing load basis, missing lower assembly, and ASTM
`IIC` / `AIIC` remain value-less boundaries. Gate BD selects
`post_v1_next_numeric_coverage_gap_gate_be_plan` in
`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-be-contract.test.ts`;
`floor.mixed_support_family.multi_family_solver_gap` is the carried
high-risk follow-up candidate for that rerank.
Gate BE has now landed as
`post_v1_next_numeric_coverage_gap_gate_be_plan` with status
`post_v1_next_numeric_coverage_gap_gate_be_landed_no_runtime_selected_floor_suspended_ceiling_lower_treatment_field_companion_gate_bf`.
It selected
`floor.suspended_ceiling_lower_treatment.field_companion_assembly_runtime_gap`.
Gate BE selected
`post_v1_floor_suspended_ceiling_lower_treatment_field_companion_gate_bf_plan`
in
`packages/engine/src/post-v1-floor-suspended-ceiling-lower-treatment-field-companion-gate-bf-contract.test.ts`.
Gate BF has now landed as
Historical Gate BF action:
`post_v1_floor_suspended_ceiling_lower_treatment_field_companion_gate_bf_plan`
with status
`post_v1_floor_suspended_ceiling_lower_treatment_field_companion_gate_bf_landed_selected_next_numeric_coverage_gap_gate_bg`.
assembly field-only lower-treatment calculated
`L'n,w 47.6 / L'nT,w 44.8 / L'nT,50 48.8` for the acoustic-hanger case
and `L'n,w 46.6 / L'nT,w 43.8 / L'nT,50 47.8` for the resilient-stud
case; missing `impactFieldContext.ci50_2500Db` stopped only
`L'nT,50`, and ASTM `IIC` / `AIIC` remained unsupported. This handoff
has since advanced through Gate CG2; Gate CH is the selected next action
label.
Full `pnpm calculator:gate:current` passed after Gate BF with engine 569
files / 3155 tests, web 112 files / 435 passed + 18 skipped, repo build
5 / 5, and whitespace guard passed.
Previous Gate AX remains recorded as
`post_v1_wall_framed_building_adapter_gate_ax_plan` with status
`post_v1_wall_framed_building_adapter_gate_ax_landed_selected_next_numeric_coverage_gap_gate_ay`;
it selected `post_v1_next_numeric_coverage_gap_gate_ay_plan` for
`floor-tuas-c11c-fail-closed` after enabling framed building adapters
for `wall-lsf-knauf` and `wall-timber-stud`.
Gate 0 has landed:
`post_v1_calculator_capability_roi_confirmation_gate_0_plan` in
`packages/engine/src/post-v1-calculator-capability-roi-confirmation-gate-0-contract.test.ts`
with selection status
`post_v1_calculator_capability_roi_confirmation_gate_0_landed_selected_wall_multileaf_gate_a`.
The landed Gate A action is
`post_v1_wall_multileaf_generalized_formula_gate_a_input_owner_and_gap_matrix_plan`
in
`packages/engine/src/post-v1-wall-multileaf-generalized-formula-gate-a-contract.test.ts`.
Gate A has landed with selection status
`post_v1_wall_multileaf_generalized_formula_gate_a_landed_no_runtime_selected_gate_b_runtime_corridor`.
The landed Gate B action is
`post_v1_wall_multileaf_generalized_formula_gate_b_runtime_corridor_plan`
in
`packages/engine/src/post-v1-wall-multileaf-generalized-formula-gate-b-runtime-corridor-contract.test.ts`.
Gate B has landed with selection status
`post_v1_wall_multileaf_generalized_formula_gate_b_landed_selected_gate_c_surface_parity_and_guided_inputs`.
The landed Gate C action is
`post_v1_wall_multileaf_generalized_formula_gate_c_surface_parity_and_guided_inputs_plan`
in
`packages/engine/src/post-v1-wall-multileaf-generalized-formula-gate-c-surface-parity-contract.test.ts`.
Gate C has landed with selection status
`post_v1_wall_multileaf_generalized_formula_gate_c_landed_selected_gate_d_compatible_anchor_delta`.
The landed Gate D action is
`post_v1_wall_compatible_anchor_delta_gate_d_plan`
in
`packages/engine/src/post-v1-wall-compatible-anchor-delta-gate-d-contract.test.ts`.
Gate D has landed with selection status
`post_v1_wall_compatible_anchor_delta_gate_d_landed_selected_gate_e_floor_or_wall_next_formula_gap`.
Gate E landed as
`post_v1_floor_or_wall_next_formula_gap_gate_e_plan`
in
`packages/engine/src/post-v1-floor-or-wall-next-formula-gap-gate-e-contract.test.ts`.
Gate E has landed with selection status
`post_v1_floor_or_wall_next_formula_gap_gate_e_landed_selected_gate_f_floor_astm_iic_aiic_contour_runtime`.
Gate F has landed as
`post_v1_floor_astm_iic_aiic_contour_rating_gate_f_plan`
in
`packages/engine/src/post-v1-floor-astm-iic-aiic-contour-rating-gate-f-contract.test.ts`
with selection status
`post_v1_floor_astm_iic_aiic_contour_rating_gate_f_landed_selected_surface_parity_or_next_floor_formula_gap`.
Gate G has landed as
`post_v1_floor_astm_iic_aiic_surface_parity_gate_g_plan`
in
`packages/engine/src/post-v1-floor-astm-iic-aiic-surface-parity-gate-g-contract.test.ts`.
Gate G selection status:
`post_v1_floor_astm_iic_aiic_surface_parity_gate_g_landed_selected_gate_h_floor_formula_expansion`.
Gate H has landed as
`post_v1_floor_formula_expansion_gate_h_plan`
in
`packages/engine/src/post-v1-floor-formula-expansion-gate-h-contract.test.ts`.
Previously selected label: post-V1 floor formula expansion Gate H.
Gate H selection status:
`post_v1_floor_formula_expansion_gate_h_landed_selected_gate_i_floor_formula_gap_refresh`.
Gate I has landed as
`post_v1_floor_formula_gap_refresh_gate_i_plan`
in
`packages/engine/src/post-v1-floor-formula-gap-refresh-gate-i-contract.test.ts`.
Previously selected label: post-V1 floor formula gap refresh Gate I.
Gate I selection status:
`post_v1_floor_formula_gap_refresh_gate_i_landed_no_runtime_selected_gate_j_reinforced_concrete_combined_resolver`.
Gate I selected next action:
`post_v1_floor_reinforced_concrete_combined_resolver_gate_j_plan`
in
`packages/engine/src/post-v1-floor-reinforced-concrete-combined-resolver-gate-j-contract.test.ts`.
Gate I selected next label: post-V1 floor reinforced-concrete combined resolver Gate J.
Gate J has landed as
`post_v1_floor_reinforced_concrete_combined_resolver_gate_j_plan`
in
`packages/engine/src/post-v1-floor-reinforced-concrete-combined-resolver-gate-j-contract.test.ts`.
Gate J selection status:
`post_v1_floor_reinforced_concrete_combined_resolver_gate_j_landed_selected_gate_k_timber_clt_delta_lw_resolver`.
Gate J selected Gate K label: post-V1 floor timber/CLT DeltaLw resolver Gate K.
Gate K has landed as
`post_v1_floor_timber_clt_delta_lw_resolver_gate_k_plan`
in
`packages/engine/src/post-v1-floor-timber-clt-delta-lw-resolver-gate-k-contract.test.ts`.
Gate K selection status:
`post_v1_floor_timber_clt_delta_lw_resolver_gate_k_landed_selected_gate_l_composite_panel_family_solver_owner`.
Gate K selected Gate L action:
`post_v1_floor_composite_panel_family_solver_owner_gate_l_plan`
in
`packages/engine/src/post-v1-floor-composite-panel-family-solver-owner-gate-l-contract.test.ts`.
Gate K selected Gate L label: post-V1 floor composite-panel family solver owner Gate L.
Gate L has landed as
`post_v1_floor_composite_panel_family_solver_owner_gate_l_plan`
in
`packages/engine/src/post-v1-floor-composite-panel-family-solver-owner-gate-l-contract.test.ts`.
Gate L selection status:
`post_v1_floor_composite_panel_family_solver_owner_gate_l_landed_selected_gate_m_lightweight_concrete_family_solver_owner`.
The selected next action is
`post_v1_floor_lightweight_concrete_family_solver_owner_gate_m_plan`
in
`packages/engine/src/post-v1-floor-lightweight-concrete-family-solver-owner-gate-m-contract.test.ts`.
Selected next label: post-V1 floor lightweight-concrete family solver owner Gate M.
Gate D is the compatible measured-anchor delta slice chosen after
runtime and surface movement: Knauf LSF exact `Rw 55` plus one
compatible outer acoustic board now publishes `Rw 57`, while unowned
STC/`C`/`Ctr` companions stay unsupported. Gate E selected ASTM
`IIC`/`AIIC` as the next high-ROI exact-band runtime gap. Gate F now
calculates complete ASTM E492 lab bands to `IIC` and complete ASTM E1007
field bands to `AIIC`; ISO `Ln,w` rows and incomplete ASTM curves remain
unsupported for ASTM ratings. Gate G made those ratings visible across
cards, answer chart, report, calculator API, impact-only API, resolver
trace, and metric-basis provenance. Gate H increased floor formula
coverage by mapping existing lightweight-steel upper/lower mass-spring
and suspended-ceiling-only source-absent floor formulas into the shared
resolver and answer-engine surface. Complete upper/lower steel now
publishes `Ln,w 51.6` / `DeltaLw 22.4`; suspended-only steel publishes
`Ln,w 62.2`, while `DeltaLw` without a complete upper package remains
unsupported/needs owner inputs and ASTM/field aliases remain blocked.
Gate I selected the next floor formula move: route the existing
reinforced-concrete combined upper/lower formula, currently lab
`Ln,w 58.1` / `DeltaLw 13.7` on
`predictor_heavy_combined_upper_lower_floor_iso12354_annexc_estimate`,
through the shared resolver/answer-engine surface. Gate J now owns that
path as `floor.heavy_concrete_combined_upper_lower.lab_impact_formula`:
complete requests publish `Ln,w 58.1` / `DeltaLw 13.7`, `IIC` / `AIIC`
remain unsupported ASTM boundaries, and missing `loadBasisKgM2` or
`ceilingOrLowerAssembly` stops as `needs_input`. Gate K now maps the
existing timber-joist and mass-timber CLT `DeltaLw` formula corridors
through `floor.timber_joist.delta_lw_formula` and
`floor.mass_timber_clt.delta_lw_formula`; timber joist publishes
`DeltaLw 25.2`, CLT publishes `DeltaLw 22.6`, exact or published
`Ln,w` companions remain separate, and missing timber/CLT physical
inputs stop as `needs_input`. Gate L now owns the composite-panel
published interaction path as
`floor.composite_panel.published_interaction_family_solver`: dry floating
publishes `Ln,w 69.4 / Rw 45.1`, suspended ceiling publishes
`Ln,w 63.3 / Rw 48.6`, and combined upper/lower publishes
`Ln,w 48.5 / Rw 60.6`, while `DeltaLw`, ASTM, and field aliases remain
blocked. Gate L action
`post_v1_floor_composite_panel_family_solver_owner_gate_l_plan` landed
with status
`post_v1_floor_composite_panel_family_solver_owner_gate_l_landed_selected_gate_m_lightweight_concrete_family_solver_owner`.
Gate M action
`post_v1_floor_lightweight_concrete_family_solver_owner_gate_m_plan`
landed with status
`post_v1_floor_lightweight_concrete_family_solver_owner_gate_m_landed_selected_gate_n_floor_field_building_expansion`.
It maps `floor.lightweight_concrete.family_solver_owner` on
`predictor_lightweight_concrete_family_estimate`: visible lightweight
floating floor publishes `Ln,w 64.3 / Rw 53`, and low-density predictor
input publishes `Ln,w 47 / Rw 49`. Lightweight-concrete `DeltaLw`, ASTM,
and field aliases remain blocked. Gate N action
`post_v1_floor_field_building_expansion_gate_n_plan` in
`packages/engine/src/post-v1-floor-field-building-expansion-gate-n-contract.test.ts`
landed with status
`post_v1_floor_field_building_expansion_gate_n_landed_selected_gate_o_input_surface_guided_physical_fields`.
Previous selected label: post-V1 floor field/building expansion Gate N.
It maps the generalized floor impact field-context adapter through
`floor.impact_field_context.field_building_adapter` on
`source_absent_field_building_adapter_error_budget`: dynamic
lightweight-concrete field requests with a live lab `Ln,w` anchor plus
`impactFieldContext.fieldKDb` and
`impactFieldContext.receivingRoomVolumeM3` publish
`L'n,w 66.3 / L'nT,w 63.9`. Missing field-impact context stops as
`needs_input` with `impactFieldContext` and `receivingRoomVolumeM3`;
building prediction and ASTM `IIC` / `AIIC` aliases remain blocked.
Gate N selected Gate O action was
`post_v1_input_surface_guided_physical_fields_gate_o_plan` in
`packages/engine/src/post-v1-input-surface-guided-physical-fields-gate-o-contract.test.ts`;
Gate N selected Gate O label: post-V1 input-surface guided physical fields Gate O.
Gate O numeric correction has landed as `post_v1_wall_flat_multicavity_auto_topology_gate_o_plan`:
safe flat wall multicavity stacks with explicit air-gap plus porous-fill
cavity segments now calculate `Rw 53` / STC 57 / `C -0.6` / `Ctr -8`;
ambiguous flat stacks remain blocked. Gate P also landed numeric
double-leaf auto-topology: flat double-leaf stacks with explicit support
context and stud spacing now calculate through the existing double-leaf
solver at pinned independent `Rw 45` / STC 45 / `C -1` / `Ctr -6.1`
and resilient both-sides `Rw 47` / STC 47 / `C -1` / `Ctr -6.1`;
missing support is not guessed. Gate Q has now landed as
`post_v1_wall_full_fill_multicavity_auto_topology_gate_q_plan`:
full-fill flat multicavity walls with explicit support context now
derive grouped triple-leaf topology and calculate `Rw 52` / STC 53 /
`C -2.6` / `Ctr -9.4`; legacy support hints are not guessed and
explicit `flat_layer_order` remains blocked. Gate R has now landed as
`post_v1_wall_field_auto_topology_gate_r_plan`: the same
explicit-support full-fill field stack now calculates `R'w 50`,
`Dn,w 50`, `Dn,A 48.5`, `DnT,w 53`, and `DnT,A 50.9`; missing
`receivingRoomRt60S` is the precise `needs_input` field, and support is
not guessed. Gate S has now landed as
`post_v1_wall_double_leaf_field_auto_topology_gate_s_plan`: the common
flat `gypsum / rockwool / gypsum` double-leaf wall with explicit
support context, `studSpacingMm`, and complete `field_between_rooms`
data now calculates `R'w 39`, `Dn,w 40`, `Dn,A 38.5`, `DnT,w 42`, and
`DnT,A 40.9` through the double-leaf family physics plus field adapter
instead of screening fallback. Missing `receivingRoomRt60S` is the only
input stop and support is not guessed. The current shared resolver
surface has 43 declared candidates and 40 active runtime-basis mappings.
Gate T has now landed as
`post_v1_wall_mixed_lab_field_output_gate_t_plan`: the same complete
flat double-leaf field stack now supports mixed lab-spectrum plus field
requests at `Rw 39`, STC 39, `C -1`, `Ctr -5.7`, `R'w 39`, `Dn,w 40`,
`Dn,A 38.5`, `DnT,w 42`, and `DnT,A 40.9` without relabelling lab
values as field-candidate trace pins. Gate U has now landed as
`post_v1_wall_multileaf_mixed_lab_field_output_gate_u_plan`: the
explicit-support full-fill flat multicavity field stack now supports
mixed lab-spectrum plus field requests at `Rw 50`, STC 51, `C -2`,
`Ctr -8.5`, `R'w 50`, `Dn,w 50`, `Dn,A 48.5`, `DnT,w 53`, and
`DnT,A 50.9` without relabelling lab values as field-candidate trace
pins. Gate V has now landed as `post_v1_wall_rw_field_output_gate_v_plan`:
double-leaf and multileaf field requests that ask only for `Rw` plus
field outputs now keep requested `Rw` live (`Rw 39` / `R'w 39` /
`DnT,w 42`, and `Rw 50` / `R'w 50` / `DnT,w 53`) without widening
field-only requests. Gate W has now landed as
`post_v1_wall_field_rw_companion_gate_w_plan`: heavy-composite and
local-substitution grouped triple-leaf field requests that ask for `Rw`
plus field outputs now keep requested `Rw` live (`Rw 60` / `R'w 60` /
`DnT,w 61`, and `Rw 51` / `R'w 51` / `DnT,w 53`) without widening
field-only requests. Gate X has now landed as
`post_v1_floor_airborne_spectrum_companion_gate_x_plan`: complete floor
family-estimate field requests now keep calculated `STC`, `C`, and
`Ctr` live (`STC 58` / `C -0.9` / `Ctr -5.6` for heavy concrete and
`STC 70` / `C -0.9` / `Ctr -5.6` for lightweight steel) while exact
measured floor rows stay metric-scoped. Gate Y has now landed as
`post_v1_floor_screening_spectrum_companion_gate_y_plan`: complete floor
`screening_mass_law_curve_seed_v3` field requests now keep calculated
`STC` and `C` live (`STC 58` / `C -1.4` for Regupol Curve 8,
`STC 58` / `C -0.9` for Getzner AFM 35, and `STC 55` / `C -0.8` for
Regupol Multi 4.5 porcelain) while exact measured floor rows and ASTM /
impact boundaries stay scoped. Gate Z has now landed as
`post_v1_floor_screening_rw_companion_gate_z_plan`: source-absent floor
`screening_mass_law_curve_seed_v3` requests with visible floor roles now
keep calculated `Rw` live (`Rw 47`, STC 47, `C -1`, `Ctr -5.7`,
`R'w 47`, `DnT,w 49` for the TUAS C11c fail-closed stack) while
impact outputs stay stopped. Gate AA has now landed as
`post_v1_wall_lined_massive_rw_companion_gate_aa_plan`: complete Gate H
lined-massive wall field requests now keep calculated `Rw` live
(`Rw 55`, STC 55, `C -1.6`, `Ctr -6.3`, `R'w 55`, `Dn,w 55`,
`Dn,A 53.4`, `DnT,w 56`, `DnT,A 54.9`) while unrelated floor/impact
outputs stay stopped. Gate AA selected
`post_v1_next_numeric_coverage_gap_gate_ab_plan`; Gate AB has now
landed as `post_v1_wall_screening_rw_field_companion_gate_ab_plan`:
complete single-leaf screening wall field requests now keep calculated
`Rw` live (`Rw 40` for masonry brick and `Rw 41` for laminated CLT)
while framed/grouped wall routes that need topology inputs remain
`needs_input`. Gate AB selected next action was
`post_v1_next_numeric_coverage_gap_gate_ac_plan`. Latest validation:
focused Gate AB passed 1 file / 4 tests; focused Gate AB / Gate AA /
Gate Z / Gate Y / Gate X / Gate W / resolver / origin matrix passed 8
files / 31 tests; web Gate B visibility passed 1 file / 4 tests; web
origin card matrix passed 1 file / 1 test; full
`pnpm calculator:gate:current` passed on 2026-05-26 with engine 539
files / 3023 tests, web 95 files / 402 passed + 18 skipped, repo build
5 / 5, and whitespace guard passed.
Gate AC has now landed as
`post_v1_floor_field_a_weighted_surface_gate_ac_plan`: complete floor
field/building requests now expose already-calculated `Dn,w`, `Dn,A`,
`DnT,w`, and `DnT,A` through resolver trace and automatic workbench
presets (`57` / `56.1` / `60` / `58.6` for heavy concrete, `69` /
`68.1` / `72` / `70.6` for lightweight steel). Exact floor metric
scope, bound-only missing-`C`, ASTM/IIC, and unrelated `needs_input`
boundaries remain closed. Gate AC selected next action is
`post_v1_next_numeric_coverage_gap_gate_ad_plan`. Latest validation:
full `pnpm calculator:gate:current` passed on 2026-05-26 with engine
540 files / 3027 tests, web 96 files / 406 passed + 18 skipped, repo
build 5 / 5, and whitespace guard passed.
Gate AD has now landed as
`post_v1_wall_framed_metadata_auto_topology_gate_ad_plan`: explicit flat
framed wall metadata now keeps `Rw` live for LSF Knauf and timber-stud
field/building calculation without moving their defended calibration
values. LSF Knauf supports `Rw 51`, STC 51, `C -1.4`, `Ctr -6.4`,
`R'w 51`, `Dn,w 51`, `Dn,A 49.6`, `DnT,w 52`, and `DnT,A 51.1`;
timber-stud supports `Rw 42`, STC 42, `C 0.4`, `Ctr -4.3`, `R'w 42`,
`Dn,w 42`, `Dn,A 42.4`, `DnT,w 43`, and `DnT,A 43.9`. Gate AD selected next action is
`post_v1_next_numeric_coverage_gap_gate_ae_plan`. Latest validation:
full `pnpm calculator:gate:current` passed on 2026-05-26 with engine
541 files / 3031 tests, web 96 files / 406 passed + 18 skipped, repo
build 5 / 5, and whitespace guard passed.
Gate AE has now landed as
`post_v1_wall_framed_lab_spectrum_companion_gate_ae_plan`: the same
guarded framed-calibration building lane now keeps calculated `Rw`, STC,
`C`, and `Ctr` live while `R'w`, `Dn,w`, `Dn,A`, `DnT,w`, and `DnT,A`
remain parked until building/field input owners are complete. LSF Knauf
supports `Rw 51`, STC 51, `C -1.4`, `Ctr -6.4`; timber-stud supports
`Rw 42`, STC 42, `C 0.4`, `Ctr -4.3`; direct timber and British Gypsum
framed building cards now expose the same lab-spectrum companions. Gate
AE selected next action is `post_v1_next_numeric_coverage_gap_gate_af_plan`.
Gate AF has now landed as
`post_v1_wall_source_absent_building_lab_spectrum_companion_gate_af_plan`:
source-absent building wall requests on owned single-leaf / lined-massive
traces now keep calculated `Rw`, STC, `C`, and `Ctr` live while
`R'w`, `Dn,w`, `Dn,A`, `DnT,w`, and `DnT,A` remain parked. Lined
concrete supports `Rw 55`, STC 55, `C -1.6`, `Ctr -6.3`; masonry brick
supports `Rw 40`, STC 40, `C -0.2`, `Ctr -4.7`; laminated CLT supports
`Rw 41`, STC 41, `C -1.8`, `Ctr -7.6`. Grouped AAC/multileaf,
opening/leak building, exact metric-scope, floor bound, and ASTM/IIC
remain closed. Gate AF selected next action is
`post_v1_next_numeric_coverage_gap_gate_ag_plan`. Latest validation:
full `pnpm calculator:gate:current` passed on 2026-05-26 with engine
543 files / 3039 tests, web 96 files / 406 passed + 18 skipped, repo
build 5 / 5, and whitespace guard passed.
Gate AG has now landed as
`post_v1_wall_heavy_composite_building_lab_spectrum_companion_gate_ag_plan`:
heavy-composite building wall requests on the guarded double-leaf /
heavy-unframed-cavity-cap trace now keep calculated `Rw`, STC, `C`, and
`Ctr` live while `R'w`, `Dn,w`, `Dn,A`, `DnT,w`, and `DnT,A` remain
parked. Heavy-composite building supports `Rw 60`, STC 60, `C -1.4`,
and `Ctr -6.1`. Grouped AAC/multileaf, opening/leak building, exact
metric-scope, floor bound, ASTM/IIC, and field/building aliases remain
closed. Gate AG selected next action is
`post_v1_next_numeric_coverage_gap_gate_ah_plan`. Latest validation:
full `pnpm calculator:gate:current` passed on 2026-05-26 with engine
544 files / 3042 tests, web 96 files / 406 passed + 18 skipped, repo
build 5 / 5, and whitespace guard passed.
Gate AH has now landed as
`post_v1_wall_multileaf_screening_rw_field_companion_gate_ah_plan`:
support-backed AAC/multileaf field requests on the existing
`multileaf_screening_blend` path now keep calculated `Rw` live beside
the already supported STC, `C`, `Ctr`, `R'w`, `Dn,w`, `Dn,A`, `DnT,w`,
and `DnT,A` outputs. The support-backed AAC/multileaf field case
supports `Rw 41`, STC 41, `C -1.7`, `Ctr -6.8`, `R'w 41`, `Dn,w 41`,
`Dn,A 39.3`, `DnT,w 42`, and `DnT,A 40.8`. Missing support topology
still stops as `needs_input`; floor bound `C`, exact floor
STC/`C`/`Ctr` aliases, opening/leak building, ASTM/IIC, and
field/building aliases remain closed. Gate AH selected next action is
`post_v1_next_numeric_coverage_gap_gate_ai_plan`. Latest validation:
full `pnpm calculator:gate:current` passed on 2026-05-26 with engine
545 files / 3046 tests, web 96 files / 406 passed + 18 skipped, repo
build 5 / 5, and whitespace guard passed.
Gate AI has now landed as
`post_v1_wall_flat_multicavity_field_physics_companion_gate_ai_plan`:
support-backed AAC/multileaf field requests now run through the Gate AE
two-cavity physics solver plus the Gate I field adapter instead of the
screening fallback. The same field request now supports `Rw 60`, STC
60, `C -1.9`, `Ctr -8`, `R'w 60`, `Dn,w 60`, `Dn,A 58.1`, `DnT,w 61`,
and `DnT,A 59.6`; missing support or `receivingRoomRt60S` still stops
as precise `needs_input`, and floor/exact/ASTM/building aliases remain
closed. Gate AI selected next action is
`post_v1_next_numeric_coverage_gap_gate_aj_plan`. Latest validation:
full `pnpm calculator:gate:current` passed on 2026-05-26 with engine
546 files / 3051 tests, web 96 files / 406 passed + 18 skipped, repo
build 5 / 5, and whitespace guard passed.
Gate AJ has now landed as
`post_v1_wall_flat_multicavity_building_physics_gate_aj_plan`:
complete support-backed AAC/multileaf building requests now run through
the Gate AE two-cavity physics solver plus building-prediction runtime
basis. The building request supports `R'w 60`, `Dn,w 60`, `Dn,A 58.1`,
`DnT,w 61`, and `DnT,A 59.6`; lab `Rw`, STC, `C`, and `Ctr` stay
unsupported on the building route, missing support/source-room context
stays `needs_input`, and floor/exact/ASTM/building aliases remain
closed. Gate AJ selected next action is
`post_v1_next_numeric_coverage_gap_gate_ak_plan`. Latest validation:
full `pnpm calculator:gate:current` passed on 2026-05-26 with engine
547 files / 3056 tests, web 96 files / 406 passed + 18 skipped, repo
build 5 / 5, and whitespace guard passed.
Gate AK has now landed as
`post_v1_floor_bound_low_frequency_field_companion_gate_ak_plan`:
bound-only floor impact lanes now calculate an ISO low-frequency
`L'nT,50` upper-bound companion when the existing bound field path owns
`L'nT,w` and the user supplies explicit `CI,50-2500`. The UBIQ
open-web bound route now pins `L'nT,50 <= 55.2`; selected
lightweight-steel bound interpolation routes pin `<= 55.2`, `<= 56.2`,
or `<= 57.2`. Missing `CI,50-2500` remains `needs_input`, and ASTM
`IIC` / `AIIC` aliases remain unsupported. Gate AK selected next action
is `post_v1_next_numeric_coverage_gap_gate_al_plan`. Latest validation:
full `pnpm calculator:gate:current` passed on 2026-05-26 with engine
548 files / 3062 tests, web 97 files / 408 passed + 18 skipped, repo
build 5 / 5, and whitespace guard passed.
Gate AL has now landed as
`post_v1_floor_combined_bound_local_guide_gate_al_plan`: combined
bound-only floor impact lanes that own `Ln,w+CI` now calculate an ISO
field-side `L'nT,50` upper-bound companion through the local-guide
`K + Hd` path. The UBIQ FL-28 carpet bound route pins
`Ln,w+CI <= 45` and `L'nT,50 <= 48`; split `Ln,w`, `CI`, `L'n,w`, and
`L'nT,w` remain unsupported, and ASTM `IIC` / `AIIC` aliases remain
unsupported. Gate AL selected next action is
`post_v1_next_numeric_coverage_gap_gate_am_plan`. Focused validation
passed with engine 5 files / 29 tests and web 4 files / 27 tests. Full
`pnpm calculator:gate:current` passed with engine 549 files / 3067
tests, web 98 files / 410 passed + 18 skipped, repo build 5 / 5, and
whitespace guard passed.
Gate AM has now landed as
`post_v1_floor_local_guide_input_surface_gate_am_plan`: floor
local-guide `L'nT,50` now works from owned `Ln,w+CI` evidence when K is
looked up from `impactFieldContext.guideMassRatio` and Hd is supplied
directly or via room-volume lookup. The UBIQ FL-28 exact timber route
pins `Ln,w+CI 49`, `L'n,w 54`, and `L'nT,50 52`; the UBIQ FL-28 carpet
combined-bound route remains `Ln,w+CI <= 45` and `L'nT,50 <= 48` with
bound K/Hd provenance. Split bound-only metrics and ASTM aliases remain
unsupported. Gate AM selected next action is
`post_v1_next_numeric_coverage_gap_gate_an_plan`. Focused validation
passed with engine 4 files / 25 tests and web 4 files / 28 tests. Full
`pnpm calculator:gate:current` passed with engine 550 files / 3072
tests, web 99 files / 413 passed + 18 skipped, repo build 5 / 5, and
whitespace guard passed.

## Agent Resume Triangle

Three docs are authoritative for "where are we and what comes
next". If they disagree, fix the drift before starting work.

1. [calculator/CURRENT_STATE.md](./calculator/CURRENT_STATE.md)
   — short snapshot (what is stable right now, completion
   signals, active slice, deferred follow-up tracks)
2. [calculator/MASTER_PLAN.md](./calculator/MASTER_PLAN.md) —
   strategic roadmap, ROI ranking, accuracy preservation
   contract, quantitative completion targets
3. [calculator/NEXT_IMPLEMENTATION_PLAN.md](./calculator/NEXT_IMPLEMENTATION_PLAN.md)
   — tactical detail for the active slice

Then run `pnpm calculator:gate:current` before calculator runtime
changes. Productization slices should add their own focused tests and
use `pnpm check` when shared contracts move.

Current calculator handoff:

- Current product state:
  [calculator/CHECKPOINT_2026-05-23_POST_V1_ACOUSTIC_CALCULATOR_STATE_RECONCILIATION.md](./calculator/CHECKPOINT_2026-05-23_POST_V1_ACOUSTIC_CALCULATOR_STATE_RECONCILIATION.md).
  Usable V1 Steps 0-5 are closed for the current company-internal
  envelope. DynEcho now has the answer-engine contract in
  `packages/engine/src/acoustic-calculator-answer-engine-v1-contract.test.ts`,
  and it is part of `pnpm calculator:gate:current`. The current shared
  resolver surface has 43 declared candidates and 40 active runtime-basis mappings across exact measured overrides, compatible
  anchors, calibrated and source-absent family solvers, field/building
  adapters, `needs_input`, basis-boundary, and unsupported candidates.
  The next implementation must be selected as post-V1 accuracy/adapters
  or expanded formula coverage, not as broad source crawling, confidence
  wording, or a finite scenario pack.
- Product direction lock:
  [calculator/ACOUSTIC_CALCULATOR_ANSWER_ENGINE_V1_PLAN_2026-05-21.md](./calculator/ACOUSTIC_CALCULATOR_ANSWER_ENGINE_V1_PLAN_2026-05-21.md).
  Historical correction id: `acoustic_calculator_answer_engine_v1_plan`.
  DynEcho must behave as an acoustic calculator: the user enters wall or
  floor layers, thicknesses, requested outputs, and any formula-required
  physical inputs; the engine uses exact measured values when available,
  compatible measured anchors when valid, and otherwise the correct
  acoustic formula family to calculate the answer. Docs and tests are
  guardrails, not the product.
- Latest checkpoint:
  [calculator/CHECKPOINT_2026-05-23_POST_V1_ACOUSTIC_CALCULATOR_STATE_RECONCILIATION.md](./calculator/CHECKPOINT_2026-05-23_POST_V1_ACOUSTIC_CALCULATOR_STATE_RECONCILIATION.md).
  This re-read docs, compared implementation, and corrected stale
  README-level handoff text. It records that the V1 contract exists,
  flat double-leaf-like and missing-input cases now stop through traced
  answer boundaries, and the current tested envelope is ready for
  company-internal usable V1 once the current targeted suite, full
  `pnpm calculator:gate:current`, and `git diff --check` are clean.
- Previous implementation checkpoint:
  [calculator/CHECKPOINT_2026-05-21_LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_COVERAGE_REFRESH_REVALIDATION.md](./calculator/CHECKPOINT_2026-05-21_LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_COVERAGE_REFRESH_REVALIDATION.md).
  Read this for landed double-leaf coverage-refresh facts before
  implementing the next calculator slice. The fresh
  `pnpm calculator:gate:current` run passed on 2026-05-21 with engine
  508 files / 2889 tests, web 94 files / 388 passed + 18 skipped, repo
  build 5 / 5, and whitespace guard passed. The latest landed
  layer-combination gate is
  `layer_combination_resolver_double_leaf_framed_wall_banded_coverage_refresh_plan`
  with selection status
  `layer_combination_resolver_double_leaf_framed_wall_banded_coverage_refresh_landed_no_runtime_selected_post_double_leaf_revalidation`;
  at landing time the selected next action was
  `layer_combination_resolver_post_double_leaf_framed_wall_banded_coverage_revalidation_plan`
  in
  `packages/engine/src/layer-combination-resolver-post-double-leaf-framed-wall-banded-coverage-revalidation-contract.test.ts`.
  That historical next action is superseded by the active answer-engine
  plan above. This is not a broad source crawl.
  The candidate coverage matrix refresh has now landed as
  `layer_combination_resolver_candidate_coverage_matrix_refresh_plan`
  with selection status
  `layer_combination_resolver_candidate_coverage_matrix_refresh_landed_no_runtime_selected_company_internal_v0_rehearsal`;
  it covers all 13 resolver candidate declarations, 13 surface rows, 10
  active runtime candidates, and 3 boundary rows across exact measured
  overrides, similarity anchors, calibrated family solvers,
  source-absent family solvers, field/building adapters, `needs_input`,
  basis boundaries, and unsupported ASTM/IIC blockers without moving
  runtime values. The selected next action is
  `layer_combination_resolver_company_internal_v0_rehearsal_plan`
  in
  `packages/engine/src/layer-combination-resolver-company-internal-v0-rehearsal-contract.test.ts`;
  selected next label: layer combination resolver company-internal V0
  rehearsal. This is not a broad source crawl.
  The company-internal V0 rehearsal has now landed as
  `layer_combination_resolver_company_internal_v0_rehearsal_plan`
  with selection status
  `layer_combination_resolver_company_internal_v0_rehearsal_landed_no_runtime_selected_single_leaf_mass_law_banded_solver_owner`.
  It is no-runtime: it classifies the 13 current resolver rows as 2
  `ready`, 8 `ready_with_budget`, 1 `needs_input`, 2 `unsupported`,
  and 0 registered `research_only` rows, then ranks six research-only
  gaps. Internal V0 use is limited to the 10 exact or budgeted rows with
  visible candidate id, basis, support bucket, required fields, value
  pins, and budgets. Broad source crawling, field/building runtime
  promotion, ASTM/IIC/AIIC aliases, and tolerance retunes without
  holdouts remain blocked. The selected next action is
  `layer_combination_resolver_single_leaf_mass_law_banded_solver_owner_plan`
  in
  `packages/engine/src/layer-combination-resolver-single-leaf-mass-law-banded-solver-owner-contract.test.ts`;
  selected next label: layer combination resolver single-leaf mass-law
  banded solver owner. This is not a broad source crawl.
  The single-leaf mass-law banded solver owner has now landed as
  `layer_combination_resolver_single_leaf_mass_law_banded_solver_owner_plan`
  with selection status
  `layer_combination_resolver_single_leaf_mass_law_banded_solver_owner_landed_no_runtime_selected_formula_corridor`.
  It is no-runtime: wall/floor direct-airborne single-visible-leaf
  scope, material density/surface mass/thickness, stiffness/coincidence
  family, one-third-octave TL curve, ISO 717-1 `Rw`/`C`/`Ctr` adapter,
  exact-source precedence, holdout residual budget, and hostile topology
  boundaries are owned for the next formula corridor. Floor impact,
  field/building, ASTM/IIC/AIIC, broad source crawling, tolerance
  retune, and Rw-to-STC alias promotion stay blocked. Current Gate O
  values remain frozen: gypsum 12.5 mm `Rw/STC 31`, laminated gypsum
  25 mm `Rw/STC 34`, and concrete 150 mm `Rw/STC 55`. The selected next
  action is
  `layer_combination_resolver_single_leaf_mass_law_banded_formula_corridor_plan`
  in
  `packages/engine/src/layer-combination-resolver-single-leaf-mass-law-banded-formula-corridor-contract.test.ts`;
  selected next label: layer combination resolver single-leaf mass-law
  banded formula corridor. This is not a broad source crawl.
  The single-leaf mass-law banded formula corridor has now landed as
  `layer_combination_resolver_single_leaf_mass_law_banded_formula_corridor_plan`
  with selection status
  `layer_combination_resolver_single_leaf_mass_law_banded_formula_corridor_landed_no_runtime_selected_runtime_corridor`.
  It is no-runtime: it defines the source-absent element-lab basis
  `layer_combination_resolver_single_leaf_mass_law_banded_source_absent_formula_corridor`
  from surface mass, stiffness/coincidence, one-third-octave TL curve,
  ISO 717-1 `Rw`/`C`/`Ctr`, exact-source precedence, and budget terms.
  Representative design payloads include gypsum 12.5 mm `Rw 31`,
  laminated gypsum 25 mm `Rw 34`, and concrete/floor direct-airborne
  `Rw 55` with `+/-6 dB` `Rw` / STC-compatibility budgets. Runtime
  values remain frozen, exact rows still win first, and floor impact,
  field/building, ASTM/IIC/AIIC, broad source crawling, tolerance
  retune, and Rw-to-STC alias promotion remain blocked. The selected
  next action is
  `layer_combination_resolver_single_leaf_mass_law_banded_runtime_corridor_plan`
  in
  `packages/engine/src/layer-combination-resolver-single-leaf-mass-law-banded-runtime-corridor-contract.test.ts`;
  selected next label: layer combination resolver single-leaf mass-law
  banded runtime corridor. This is not a broad source crawl.
  The single-leaf mass-law banded runtime corridor has now landed as
  `layer_combination_resolver_single_leaf_mass_law_banded_runtime_corridor_plan`
  with selection status
  `layer_combination_resolver_single_leaf_mass_law_banded_runtime_corridor_landed_selected_surface_parity`.
  Complete source-absent wall/floor direct-airborne single-leaf
  element-lab stacks now expose the runtime basis
  `layer_combination_resolver_single_leaf_mass_law_banded_source_absent_formula_corridor`
  and candidate
  `candidate_layer_combination_resolver_single_leaf_mass_law_banded_source_absent_family_solver`.
  Numeric values remain frozen: gypsum 12.5 mm `Rw 31`, laminated
  gypsum 25 mm `Rw 34`, and concrete/floor direct-airborne `Rw 55`,
  with `+/-6 dB` Rw/STC compatibility budget. Exact rows still win
  first; field/building, floor impact, ASTM/IIC/AIIC, broad source
  crawling, tolerance retune, and new Rw-to-STC alias promotion remain
  outside this gate. The selected next action is
  `layer_combination_resolver_single_leaf_mass_law_banded_surface_parity_plan`
  in
  `packages/engine/src/layer-combination-resolver-single-leaf-mass-law-banded-surface-parity-contract.test.ts`;
  selected next label: layer combination resolver single-leaf mass-law
  banded surface parity. This is not a broad source crawl.
  The earlier broad-accuracy matrix refresh is
  `broad_accuracy_post_open_web_field_building_input_surface_matrix_refresh_plan`
  with selection status
  `broad_accuracy_post_open_web_field_building_input_surface_matrix_refresh_landed_no_runtime_selected_helper_only_timber_open_web_impact_stack_owner`
  in
  `packages/engine/src/broad-accuracy-post-open-web-field-building-input-surface-matrix-refresh-contract.test.ts`.
  The helper-only timber/open-web impact stack owner has now landed as
  `broad_accuracy_floor_helper_only_timber_open_web_impact_stack_owner_plan`
  with selection status
  `broad_accuracy_floor_helper_only_timber_open_web_impact_stack_owner_landed_no_runtime_selected_formula_corridor`
  in
  `packages/engine/src/broad-accuracy-floor-helper-only-timber-open-web-impact-stack-owner-contract.test.ts`.
  It is no-runtime: exact, direct-fixed, and supported-band open-web
  field values remain pinned, raw-bare impact field transfer remains
  blocked, building prediction remains unsupported, ASTM/IIC aliases
  remain blocked, and broad source crawling remains blocked. It names
  lower-treatment owner fields for helper-only timber/open-web stacks:
  base support family, carrier geometry, lower ceiling board mass,
  cavity depth, absorber thickness/density, suspension/support class,
  package absence, impact-curve ownership, ISO impact adapter ownership,
  hostile topology, and budgets. The selected next action is
  `broad_accuracy_floor_helper_only_timber_open_web_impact_stack_formula_corridor_plan`
  in
  `packages/engine/src/broad-accuracy-floor-helper-only-timber-open-web-impact-stack-formula-corridor-contract.test.ts`;
  selected next label: floor helper-only timber/open-web impact stack
  formula corridor. This is not a broad source crawl.
  The helper-only timber/open-web impact stack formula corridor has now
  landed as
  `broad_accuracy_floor_helper_only_timber_open_web_impact_stack_formula_corridor_plan`
  with selection status
  `broad_accuracy_floor_helper_only_timber_open_web_impact_stack_formula_corridor_landed_no_runtime_selected_runtime_corridor`.
  It defines the no-runtime source-absent element-lab basis
  `broad_accuracy_floor_helper_only_timber_open_web_impact_stack_source_absent_formula_corridor`
  without moving public runtime values; exact, direct-fixed,
  supported-band, raw-bare, package-transfer, and EPS/screed lanes remain
  separate; field/building and ASTM/IIC aliases remain blocked. The
  selected next action is
  `broad_accuracy_floor_helper_only_timber_open_web_impact_stack_runtime_corridor_plan`
  in
  `packages/engine/src/broad-accuracy-floor-helper-only-timber-open-web-impact-stack-runtime-corridor-contract.test.ts`;
  selected next label: floor helper-only timber/open-web impact stack
  runtime corridor. This is not a broad source crawl.
  The helper-only timber/open-web impact stack runtime corridor has now
  landed as
  `broad_accuracy_floor_helper_only_timber_open_web_impact_stack_runtime_corridor_plan`
  with selection status
  `broad_accuracy_floor_helper_only_timber_open_web_impact_stack_runtime_corridor_landed_selected_surface_parity`.
  Complete source-absent element-lab helper-only lower-treatment stacks
  now promote through
  `broad_accuracy_floor_helper_only_timber_open_web_impact_stack_source_absent_formula_corridor`:
  open-box timber returns `Rw 54.8` / `Ln,w 59.6`, timber joist returns
  `Rw 47.3` / `Ln,w 65.4`, and open-web returns `Rw 46.7` /
  `Ln,w 59.6` with not-measured source-absent budgets. Exact/package/
  raw-bare lanes still win first; partial, roleless, and missing-board
  helper-like inputs stay outside this runtime; field/building and
  ASTM/IIC aliases remain blocked. The selected next action is
  `broad_accuracy_floor_helper_only_timber_open_web_impact_stack_surface_parity_plan`
  in
  `packages/engine/src/broad-accuracy-floor-helper-only-timber-open-web-impact-stack-surface-parity-contract.test.ts`;
  selected next label: floor helper-only timber/open-web impact stack
  surface parity. This is not a broad source crawl.
  The helper-only timber/open-web impact stack surface parity has now
  landed as
  `broad_accuracy_floor_helper_only_timber_open_web_impact_stack_surface_parity_plan`
  with selection status
  `broad_accuracy_floor_helper_only_timber_open_web_impact_stack_surface_parity_landed_selected_coverage_refresh`.
  Cards, route posture, confidence provenance, metric-basis rows,
  method dossier, local saved replay, server snapshot replay,
  calculator API, impact-only API, and Markdown report now expose
  `broad_accuracy_floor_helper_only_timber_open_web_impact_stack_source_absent_formula_corridor`
  and the same open-box timber `Rw 54.8` / `Ln,w 59.6`, timber joist
  `Rw 47.3` / `Ln,w 65.4`, and open-web `Rw 46.7` / `Ln,w 59.6`
  helper-only values with not-measured budgets. Fully tagged
  impact-only entrypoints now stay on the same helper-only lane. Exact/
  package/raw-bare, direct-fixed, supported-band, field/building, and
  ASTM/IIC boundaries remain blocked or ahead. The selected next action
  is
  `broad_accuracy_floor_helper_only_timber_open_web_impact_stack_coverage_refresh_plan`
  in
  `packages/engine/src/broad-accuracy-floor-helper-only-timber-open-web-impact-stack-coverage-refresh-contract.test.ts`;
  selected next label: floor helper-only timber/open-web impact stack
  coverage refresh. This is not a broad source crawl.
  The helper-only timber/open-web coverage refresh has now landed as
  `broad_accuracy_floor_helper_only_timber_open_web_impact_stack_coverage_refresh_plan`
  with selection status
  `broad_accuracy_floor_helper_only_timber_open_web_impact_stack_coverage_refresh_landed_no_runtime_selected_post_helper_only_revalidation`.
  This no-runtime ledger refresh carries open-box timber 370 mm, split
  185/185, 4x92.5 safe fragments, timber-joist 250 mm, open-web 250 mm,
  and open-web split 125/125 without moving runtime values. Pins remain
  open-box timber `Rw 54.8` / `Ln,w 59.6` with `+/-8.5 dB` `Rw` and
  `+/-10.5 dB` `Ln,w`, timber-joist `Rw 47.3` / `Ln,w 65.4`, and
  open-web `Rw 46.7` / `Ln,w 59.6` on
  `broad_accuracy_floor_helper_only_timber_open_web_impact_stack_source_absent_formula_corridor`.
  Exact/package precedence stays first, raw-bare / direct-fixed /
  supported-band lanes stay separate, and partial, roleless,
  missing-board, field/building, and ASTM/IIC requests stay blocked.
  Selected next action:
  `broad_accuracy_post_helper_only_timber_open_web_impact_stack_coverage_revalidation_plan`.
  Selected next file:
  `packages/engine/src/broad-accuracy-post-helper-only-timber-open-web-impact-stack-coverage-revalidation-contract.test.ts`.
  Selected next label: post helper-only timber/open-web impact stack
  coverage revalidation.
  The post-helper-only timber/open-web coverage revalidation has now
  landed as
  `broad_accuracy_post_helper_only_timber_open_web_impact_stack_coverage_revalidation_plan`
  with selection status
  `broad_accuracy_post_helper_only_timber_open_web_impact_stack_coverage_revalidation_landed_no_runtime_selected_layer_combination_resolver_registry`.
  It is no-runtime: helper-only timber/open-web values remain open-box
  timber `Rw 54.8` / `Ln,w 59.6`, timber-joist `Rw 47.3` /
  `Ln,w 65.4`, and open-web `Rw 46.7` / `Ln,w 59.6` on
  `broad_accuracy_floor_helper_only_timber_open_web_impact_stack_source_absent_formula_corridor`.
  Exact/package precedence stays first, raw-bare / direct-fixed /
  supported-band lanes stay separate, field/building and ASTM/IIC
  requests stay blocked, and this is not a broad source crawl. Selected
  next action: `layer_combination_resolver_registry_plan`. Selected next
  file:
  `packages/engine/src/layer-combination-resolver-registry-contract.test.ts`.
  Selected next label: layer combination resolver registry.
  The layer combination resolver registry has now landed as
  `layer_combination_resolver_registry_plan` with selection status
  `layer_combination_resolver_registry_landed_no_runtime_selected_runtime_candidate_adapter`.
  It is no-runtime: it defines the shared candidate declaration surface
  for exact measured overrides, similarity anchor candidates, calibrated
  family solver candidates, source-absent family solver candidates,
  `needs_input` boundaries, `unsupported` boundaries, field/building
  basis boundaries, and ASTM/IIC alias blockers without moving runtime
  values. The selected next action is
  `layer_combination_resolver_runtime_candidate_adapter_plan` in
  `packages/engine/src/layer-combination-resolver-runtime-candidate-adapter-contract.test.ts`;
  selected next label: layer combination resolver runtime candidate
  adapter. This is not a broad source crawl.
  The layer combination resolver runtime candidate adapter has now landed
  as `layer_combination_resolver_runtime_candidate_adapter_plan` with
  selection status
  `layer_combination_resolver_runtime_candidate_adapter_landed_no_runtime_selected_surface_parity`.
  It is no-runtime: current runtime basis ids now map into the shared
  resolver candidate id surface for exact measured overrides, similarity
  anchors, calibrated family solvers, source-absent family solvers,
  field/building adapters, `needs_input` boundaries, and `unsupported` /
  ASTM/IIC boundaries without moving helper-only, raw-bare, direct-fixed,
  supported-band, package-transfer, exact, or field values. The selected
  next action is
  `layer_combination_resolver_runtime_candidate_surface_parity_plan` in
  `packages/engine/src/layer-combination-resolver-runtime-candidate-surface-parity-contract.test.ts`;
  selected next label: layer combination resolver runtime candidate
  surface parity. This is not a broad source crawl.
  The layer combination resolver runtime candidate surface parity has now
  landed as
  `layer_combination_resolver_runtime_candidate_surface_parity_plan` with
  selection status
  `layer_combination_resolver_runtime_candidate_surface_parity_landed_no_runtime_selected_candidate_coverage_matrix_refresh`.
  It is no-runtime: shared engine results now carry a candidate trace,
  and calculator API, impact-only API, replay paths, and Markdown report
  expose the same selected candidate id, candidate kind, support bucket,
  runtime basis, value pins, boundary candidates, and rejected candidate
  count without moving runtime values. `needs_input`, `unsupported`,
  field/building, and ASTM/IIC boundaries remain blocked. The selected
  next action is
  `layer_combination_resolver_candidate_coverage_matrix_refresh_plan` in
  `packages/engine/src/layer-combination-resolver-candidate-coverage-matrix-refresh-contract.test.ts`;
  selected next label: layer combination resolver candidate coverage
  matrix refresh. This is not a broad source crawl.
  The earlier landed open-web revalidation is
  `broad_accuracy_post_raw_bare_open_web_coverage_revalidation_plan`
  with selection status
  `broad_accuracy_post_raw_bare_open_web_coverage_revalidation_landed_no_runtime_selected_open_web_field_building_adapter_owner`.
  The earlier landed matrix refresh remains
  `broad_accuracy_open_box_timber_post_eps_screed_hybrid_matrix_refresh_plan`
  with selection status
  `broad_accuracy_open_box_timber_post_eps_screed_hybrid_matrix_refresh_landed_no_runtime_selected_open_web_raw_bare_owner`
  in
  `packages/engine/src/broad-accuracy-open-box-timber-post-eps-screed-hybrid-matrix-refresh-contract.test.ts`.
  It is a no-runtime company-internal V0 operating-envelope snapshot:
  open-box package-transfer remains `Ln,w 50.8`, raw-bare remains
  `Rw 42.3` / `Ln,w 88.2`, and EPS/screed remains `Rw 72` / `Ln,w 47`.
  It keeps exact rows first, keeps dry package-transfer/raw-bare/EPS
  lanes separate, and keeps field/building plus ASTM/IIC aliases
  blocked. The floor open-web raw-bare carrier owner has now landed as
  `broad_accuracy_floor_open_web_raw_bare_carrier_owner_plan`
  with selection status
  `broad_accuracy_floor_open_web_raw_bare_carrier_owner_landed_no_runtime_selected_formula_corridor`
  in
  `packages/engine/src/broad-accuracy-floor-open-web-raw-bare-carrier-owner-contract.test.ts`.
  It is a no-runtime owner boundary: the current 111 UBIQ open-web rows
  are INEX deck / firestop package evidence with zero carrier-only
  raw-bare impact rows, so raw open-web impact remains fail-closed and
  the current raw carrier `Rw 79` screening posture is not promoted. The
  EPS/screed pin remains `Rw 72` / `Ln,w 47`. Field/building plus
  ASTM/IIC aliases stay blocked, direct-fixed and suspended-ceiling
  package rows stay separate lanes, and raw/split/deck screening
  postures remain explicit formula-owner blockers. Lower-only partial
  package inputs also remain fail-closed until full INEX/firestop/package
  ownership exists. The
  selected next action is
  `broad_accuracy_floor_open_web_raw_bare_formula_corridor_plan` in
  `packages/engine/src/broad-accuracy-floor-open-web-raw-bare-formula-corridor-contract.test.ts`;
  selected next label: floor open-web raw-bare formula corridor.
  That formula corridor has now landed as
  `broad_accuracy_floor_open_web_raw_bare_formula_corridor_plan`
  with selection status
  `broad_accuracy_floor_open_web_raw_bare_formula_corridor_landed_no_runtime_selected_runtime_corridor`.
  It defines the source-absent element-lab basis
  `broad_accuracy_floor_open_web_raw_bare_source_absent_formula_corridor`
  with design values `Rw 32`, `C -2.2`, `Ctr -7.8`, `Ln,w 96`,
  `CI 1.8`, `CI,50-2500 5.2`, and `Ln,w+CI 97.8`; budgets remain
  not-measured source-absent values including `+/-9 dB` for `Rw` and
  `+/-12 dB` for `Ln,w`. The floor open-web raw-bare runtime corridor
  has now landed as
  `broad_accuracy_floor_open_web_raw_bare_runtime_corridor_plan`
  with selection status
  `broad_accuracy_floor_open_web_raw_bare_runtime_corridor_landed_selected_surface_parity`.
  Runtime landed contract:
  `packages/engine/src/broad-accuracy-floor-open-web-raw-bare-runtime-corridor-contract.test.ts`.
  Complete source-absent element-lab raw-bare open-web steel base-only
  stacks now promote through
  `broad_accuracy_floor_open_web_raw_bare_source_absent_formula_corridor`:
  300 mm and safe split 150/150 return `Rw 32`, `C -2.2`, `Ctr -7.8`,
  `Ln,w 96`, `CI 1.8`, `CI,50-2500 5.2`, and `Ln,w+CI 97.8`; 400 mm
  returns `Rw 36.6` and `Ln,w 92.8`. Budgets remain not-measured
  source-absent values including `+/-9 dB` for `Rw` and `+/-12 dB` for
  `Ln,w`. Exact UBIQ INEX/firestop package rows, direct-fixed and
  supported-band package lanes, deck-only or partial packages,
  field/building outputs, and ASTM/IIC aliases stay blocked outside this
  lane. The selected next action is
  `broad_accuracy_floor_open_web_raw_bare_surface_parity_plan` in
  `packages/engine/src/broad-accuracy-floor-open-web-raw-bare-surface-parity-contract.test.ts`;
  selected next label: floor open-web raw-bare surface parity.
  The floor open-web raw-bare surface parity has now landed as
  `broad_accuracy_floor_open_web_raw_bare_surface_parity_plan`
  with selection status
  `broad_accuracy_floor_open_web_raw_bare_surface_parity_landed_selected_coverage_refresh`.
  Cards, route posture, confidence provenance, metric-basis rows, method
  dossier, local saved replay, server snapshot replay, calculator API,
  impact-only API, and Markdown report now expose the same
  `broad_accuracy_floor_open_web_raw_bare_source_absent_formula_corridor`
  values: `Rw 32`, `C -2.2`, `Ctr -7.8`, `Ln,w 96`, `CI 1.8`,
  `CI,50-2500 5.2`, and `Ln,w+CI 97.8` for the canonical 300 mm
  raw-bare open-web steel carrier. UBIQ INEX/firestop package rows stay
  exact or package evidence and are not borrowed into the raw-bare
  open-web formula surface. The selected next action is
  `broad_accuracy_floor_open_web_raw_bare_coverage_refresh_plan` in
  `packages/engine/src/broad-accuracy-floor-open-web-raw-bare-coverage-refresh-contract.test.ts`;
  selected next label: floor open-web raw-bare coverage refresh.
  The floor open-web raw-bare coverage refresh has now landed as
  `broad_accuracy_floor_open_web_raw_bare_coverage_refresh_plan` with
  selection status
  `broad_accuracy_floor_open_web_raw_bare_coverage_refresh_landed_selected_post_raw_bare_open_web_revalidation`.
  It is no-runtime: 300 mm, split 150/150, and safe 6x50 fragments keep
  `Rw 32`, `Ln,w 96`, and `CI,50-2500 5.2` with `+/-9 dB` `Rw` and
  `+/-12 dB` `Ln,w` budgets; 400 mm stays `Rw 36.6` / `Ln,w 92.8`.
  Exact UBIQ packages, direct-fixed, and supported-band lanes stay
  separate; partial-package, deck-only, out-of-range, field/building,
  and ASTM/IIC requests stay blocked. The selected next action is
  `broad_accuracy_post_raw_bare_open_web_coverage_revalidation_plan` in
  `packages/engine/src/broad-accuracy-post-raw-bare-open-web-coverage-revalidation-contract.test.ts`;
  selected next label: post raw-bare open-web coverage revalidation.
  The post raw-bare open-web coverage revalidation has now landed as
  `broad_accuracy_post_raw_bare_open_web_coverage_revalidation_plan`
  with selection status
  `broad_accuracy_post_raw_bare_open_web_coverage_revalidation_landed_no_runtime_selected_open_web_field_building_adapter_owner`.
  It is no-runtime: raw-bare 300/400 mm values, exact UBIQ precedence,
  direct-fixed and supported-band separate lanes, wrong-family open-box
  guards, and field/building plus ASTM/IIC boundaries remain frozen. It
  ranks `broad_accuracy_floor_open_web_field_building_adapter_owner_plan`
  in
  `packages/engine/src/broad-accuracy-floor-open-web-field-building-adapter-owner-contract.test.ts`
  as the next bounded gate because common floor field/building outputs
  need an explicit basis owner; carrier-only holdout acquisition,
  ASTM/IIC rating ownership, broad source crawl, and tolerance retune
  stay blocked. Selected next label: floor open-web field/building
  adapter owner. This is not a broad source crawl.
  The floor open-web field/building adapter owner has now landed as
  `broad_accuracy_floor_open_web_field_building_adapter_owner_plan`
  with selection status
  `broad_accuracy_floor_open_web_field_building_adapter_owner_landed_no_runtime_selected_field_building_surface_parity`.
  It is no-runtime: existing exact UBIQ, direct-fixed, and supported-band
  open-web `field_between_rooms` continuations remain pinned, explicit
  `impactFieldContext` owns `L'n,w`, `L'nT,w`, and `L'nT,50` only for
  those lab anchors, raw-bare open-web field transfer is active even
  when the raw-bare lab `Ln,w 96` formula corridor is present, building
  prediction remains unsupported until separate flanking/building owners
  exist, and ASTM/IIC aliases remain blocked. The selected next action is
  `broad_accuracy_floor_open_web_field_building_surface_parity_plan` in
  `packages/engine/src/broad-accuracy-floor-open-web-field-building-surface-parity-contract.test.ts`;
  selected next label: floor open-web field/building surface parity. This
  is not a broad source crawl.
  The floor open-web field/building surface parity has now landed as
  `broad_accuracy_floor_open_web_field_building_surface_parity_plan`
  with selection status
  `broad_accuracy_floor_open_web_field_building_surface_parity_landed_no_runtime_selected_input_surface`.
  It is no-runtime: route card, output cards, method dossier, local saved
  replay, server snapshot replay, calculator API, impact-only API, and
  Markdown report must expose the same exact, direct-fixed, and
  supported-band field values plus
  `source_absent_field_building_adapter_error_budget` terms. The visible
  pins remain `Rw 51/52/61.5`, `R'w 77/75/45`, `DnT,w 80/78/48`,
  `Ln,w 71/77/61.5`, `L'n,w 73/79/63.5`, `L'nT,w 70.6/76.6/61.1`, and
  `L'nT,50 70/76.5/60`; raw-bare open-web field transfer is active,
  building prediction remains unsupported, and ASTM/IIC aliases remain
  blocked. The selected next action is
  `broad_accuracy_floor_open_web_field_building_input_surface_plan` in
  `apps/web/features/workbench/open-web-field-building-input-surface.test.ts`;
  selected next label: floor open-web field/building input surface. This
  is not a broad source crawl.
  The floor open-web field/building input surface has now landed as
  `broad_accuracy_floor_open_web_field_building_input_surface_plan` with
  selection status
  `broad_accuracy_floor_open_web_field_building_input_surface_landed_selected_post_input_surface_revalidation`.
  It wires workbench controls, live evaluation, local saved replay,
  server snapshot replay, calculator API payloads, impact-only API
  payloads, and Markdown report payloads through a first-class floor
  input surface without moving exact, direct-fixed, or supported-band
  values. Complete UI-derived field contexts keep `Rw 51/52/61.5`,
  `R'w 77/75/45`, `DnT,w 80/78/48`, `Ln,w 71/77/61.5`,
  `L'n,w 73/79/63.5`, `L'nT,w 70.6/76.6/61.1`, and
  `L'nT,50 70/76.5/60`; partial field contexts name the missing panel,
  room, RT60, K, or impact-volume inputs; raw-bare impact field transfer
  remains blocked, building prediction remains unsupported, and ASTM/IIC
  aliases remain blocked. The selected next action is
  `broad_accuracy_floor_open_web_field_building_post_input_surface_revalidation_plan`
  in
  `packages/engine/src/broad-accuracy-floor-open-web-field-building-post-input-surface-revalidation-contract.test.ts`;
  selected next label: floor open-web field/building post-input-surface
  revalidation. This is not a broad source crawl.
  The floor open-web field/building post-input-surface revalidation has
  now landed as
  `broad_accuracy_floor_open_web_field_building_post_input_surface_revalidation_plan`
  with selection status
  `broad_accuracy_floor_open_web_field_building_post_input_surface_revalidation_landed_no_runtime_selected_matrix_refresh`.
  It is no-runtime: exact, direct-fixed, and supported-band open-web
  field values remain pinned after input-surface wiring; raw-bare open-web field transfer is active, building prediction remains
  unsupported, ASTM/IIC aliases remain blocked, and broad source crawling
  remains blocked. The selected next action is
  `broad_accuracy_post_open_web_field_building_input_surface_matrix_refresh_plan`
  in
  `packages/engine/src/broad-accuracy-post-open-web-field-building-input-surface-matrix-refresh-contract.test.ts`;
  selected next label: post open-web field/building input-surface matrix
  refresh. This is not a broad source crawl.
  EPS/screed surface parity landed as
  `broad_accuracy_floor_open_box_timber_eps_screed_hybrid_package_surface_parity_plan`
  with selection status
  `broad_accuracy_floor_open_box_timber_eps_screed_hybrid_package_surface_parity_landed_selected_matrix_refresh`.
  Cards, route posture, confidence provenance, metric-basis rows, method
  dossier, local saved replay, server snapshot replay, calculator API,
  impact-only API, and Markdown report now expose
  `broad_accuracy_floor_open_box_timber_eps_screed_hybrid_package_formula_corridor`
  with `Rw 72`, `Ln,w 47`, `+/-7 dB` `Rw`, and `+/-8 dB` `Ln,w`
  budgets while exact R7b, dry package-transfer/raw-bare separation,
  field/building, and ASTM/IIC boundaries stay protected. The
  package-transfer surface parity closeout
  landed as `broad_accuracy_floor_open_box_timber_similarity_surface_parity_plan`
  with selection status
  `broad_accuracy_floor_open_box_timber_similarity_surface_parity_landed_selected_coverage_refresh`.
  The coverage refresh then landed as
  `broad_accuracy_floor_open_box_timber_similarity_coverage_refresh_plan`
  with selection status
  `broad_accuracy_floor_open_box_timber_similarity_coverage_refresh_landed_selected_exact_only_hybrid_fragmentation_policy`;
  the landed contract is
  `packages/engine/src/broad-accuracy-floor-open-box-timber-similarity-coverage-refresh-contract.test.ts`.
  It keeps the package-transfer pins at `Ln,w 50.8`, `CI,50-2500 3.3`,
  and `Rw 66` with exact source precedence while raw bare, exact-only
  hybrid, mixed staged, field/building, and ASTM/IIC cases stay outside
  the lane. Broad "every common wall/floor combination" confidence is
  still not done.
- Landed follow-up action:
  `broad_accuracy_floor_open_box_timber_raw_bare_reopening_guard_plan`;
  landed contract:
  `packages/engine/src/broad-accuracy-floor-open-box-timber-raw-bare-reopening-guard-contract.test.ts`.
  The exact-only hybrid fragmentation policy has now landed as
  `broad_accuracy_floor_open_box_timber_exact_only_hybrid_fragmentation_policy_plan`
  with selection status
  `broad_accuracy_floor_open_box_timber_exact_only_hybrid_fragmentation_policy_landed_no_runtime_selected_raw_bare_reopening_guard`.
  Its landed contract is
  `packages/engine/src/broad-accuracy-floor-open-box-timber-exact-only-hybrid-fragmentation-policy-contract.test.ts`.
  It is a no-runtime policy gate: R7b/R8b/R9b/R2c/R10a stay exact-only
  evidence, do not enter package-transfer runtime anchors, and do not
  move tolerances. The package-transfer pins remain `Ln,w 50.8`,
  `CI,50-2500 3.3`, and `Rw 66`; field/building and ASTM/IIC aliases
  remain blocked. The raw-bare reopening guard has also landed with
  selection status
  `broad_accuracy_floor_open_box_timber_raw_bare_reopening_guard_landed_no_runtime_selected_bare_carrier_owner`.
  It is a no-runtime guard: roleless, tagged, split, upper-only, and
  lower-only raw `open_box_timber_slab` probes do not borrow the
  package-transfer `Ln,w 50.8`, `CI,50-2500 3.3`, or `Rw 66` lane;
  impact stays unsupported and field/building plus ASTM/IIC aliases stay
  blocked. Selected next file:
  `packages/engine/src/broad-accuracy-floor-open-box-timber-raw-bare-carrier-owner-contract.test.ts`.
  The bare-carrier owner contract has now landed as
  `broad_accuracy_floor_open_box_timber_raw_bare_carrier_owner_contract_plan`
  with selection status
  `broad_accuracy_floor_open_box_timber_raw_bare_carrier_owner_landed_no_runtime_selected_formula_corridor`.
  It is no-runtime work: support geometry, airborne direct-curve, bare
  impact-curve, finish absence, lower-treatment state, package-transfer
  exclusion, basis-boundary, hostile-topology, and uncertainty-budget
  owner fields are now explicit before any raw-bare formula corridor can
  move values. Selected next file:
  `packages/engine/src/broad-accuracy-floor-open-box-timber-raw-bare-formula-corridor-contract.test.ts`.
  The raw-bare formula corridor has now landed as
  `broad_accuracy_floor_open_box_timber_raw_bare_formula_corridor_plan`
  with selection status
  `broad_accuracy_floor_open_box_timber_raw_bare_formula_corridor_landed_no_runtime_selected_runtime_corridor`.
  It was a no-runtime formula gate: the source-absent basis
  `broad_accuracy_floor_open_box_timber_raw_bare_source_absent_formula_corridor`
  defined raw-bare element-lab design payloads and budgets. The
  canonical 370 mm fixture is `Rw 42.3`, `Ln,w 88.2`, and
  `CI,50-2500 3.1` with `+/-8 dB` `Rw` and `+/-10 dB` `Ln,w`
  not-measured budgets. The raw-bare runtime corridor has now landed as
  `broad_accuracy_floor_open_box_timber_raw_bare_runtime_corridor_plan`
  with selection status
  `broad_accuracy_floor_open_box_timber_raw_bare_runtime_corridor_landed_selected_surface_parity`.
  Complete base-only raw-bare `open_box_timber_slab` inputs now use
  `broad_accuracy_floor_open_box_timber_raw_bare_source_absent_formula_corridor`
  at runtime: the canonical 370 mm case returns `Rw 42.3`, `C -1.4`,
  `Ctr -5.8`, `Ln,w 88.2`, `CI,50-2500 3.1`, and `Ln,w+CI 87.1`;
  the 220 mm case returns `Rw 38.1` / `Ln,w 91.1`. Package-transfer
  pins `Ln,w 50.8`, `CI,50-2500 3.3`, and `Rw 66`, exact source
  precedence, partial package and wrong-family boundaries,
  field/building outputs, and ASTM/IIC aliases remain protected.
  Landed runtime contract:
  `packages/engine/src/broad-accuracy-floor-open-box-timber-raw-bare-runtime-corridor-contract.test.ts`.
  The raw-bare surface parity gate has now landed as
  `broad_accuracy_floor_open_box_timber_raw_bare_surface_parity_plan`
  with selection status
  `broad_accuracy_floor_open_box_timber_raw_bare_surface_parity_landed_selected_coverage_refresh`.
  Cards, route posture, dynamic trace, impact support notes, confidence
  provenance, metric-basis rows, method dossier, local saved replay,
  server snapshot replay, calculator API, impact-only API, and Markdown
  report now expose the raw-bare open-box timber basis, `Rw 42.3`,
  `Ln,w 88.2`, `CI,50-2500 3.1`, `+/-8 dB` `Rw`, and `+/-10 dB`
  `Ln,w` budgets without presenting them as measured evidence. Exact
  TUAS rows still win, package-transfer pins stay on their own lane,
  and field/building plus ASTM/IIC aliases remain blocked. Landed
  surface parity contract:
  `packages/engine/src/broad-accuracy-floor-open-box-timber-raw-bare-surface-parity-contract.test.ts`.
  Surface-parity selected action, now consumed by the coverage refresh:
  `broad_accuracy_floor_open_box_timber_raw_bare_coverage_refresh_plan`.
  Surface-parity selected file:
  `packages/engine/src/broad-accuracy-floor-open-box-timber-raw-bare-coverage-refresh-contract.test.ts`.
  The raw-bare coverage refresh has now landed as
  `broad_accuracy_floor_open_box_timber_raw_bare_coverage_refresh_plan`
  with selection status
  `broad_accuracy_floor_open_box_timber_raw_bare_coverage_refresh_landed_selected_post_raw_bare_revalidation`.
  It refreshes the executable coverage matrix for raw-bare open-box
  timber 370 mm, split 185/185 mm, and 220 mm while keeping `Rw 42.3`,
  `Ln,w 88.2`, `CI,50-2500 3.1`, `+/-8 dB` `Rw`, and `+/-10 dB`
  `Ln,w` unchanged. It proves exact TUAS package precedence,
  package-transfer separation, partial-package and wrong-family
  refusals, field/building blockers, and ASTM/IIC blockers without
  moving runtime values. Landed coverage-refresh contract:
  `packages/engine/src/broad-accuracy-floor-open-box-timber-raw-bare-coverage-refresh-contract.test.ts`.
Selected next action:
`broad_accuracy_post_raw_bare_open_box_timber_coverage_revalidation_plan`.
Selected next file:
`packages/engine/src/broad-accuracy-post-raw-bare-open-box-timber-coverage-revalidation-contract.test.ts`.
That post raw-bare revalidation has now landed as
`broad_accuracy_post_raw_bare_open_box_timber_coverage_revalidation_plan`
with selection status
`broad_accuracy_post_raw_bare_open_box_timber_coverage_revalidation_landed_no_runtime_selected_package_transfer_residual_expansion`.
It is no-runtime: raw-bare open-box timber stays `Rw 42.3` /
`Ln,w 88.2`, finished package-transfer stays `Ln,w 50.8`, exact TUAS
rows still win, tolerances/API/workbench behavior do not move, and
field/building plus ASTM/IIC aliases remain blocked. It is not a broad
source crawl. The selected next action is
`broad_accuracy_floor_open_box_timber_package_transfer_residual_expansion_plan`
in
`packages/engine/src/broad-accuracy-floor-open-box-timber-package-transfer-residual-expansion-contract.test.ts`;
the next lane is package-transfer residual expansion for exact-only
hybrid / mixed-staged same-family evidence gaps.
That package-transfer residual expansion has now landed as
`broad_accuracy_floor_open_box_timber_package_transfer_residual_expansion_plan`
with selection status
`broad_accuracy_floor_open_box_timber_package_transfer_residual_expansion_landed_no_runtime_selected_eps_screed_hybrid_package_owner`.
It is no-runtime: `R7b` is the only selected candidate owner gap,
`R8b` and `R9b` are residual-readiness/negative-boundary evidence,
`R2c` and `R10a` remain blocked negative boundaries, and all five rows
stay exact-only instead of entering the package-transfer runtime anchors.
The existing package-transfer pins stay `Ln,w 50.8` / `Rw 66` for dry
gypsum-fiber, `Ln,w 53.5` / `Rw 55.5` for thin laminate, and
`Ln,w 53.5` / `Rw 63.5` for reinforced ceiling. Field/building and
ASTM/IIC aliases remain blocked, and this is not a broad source crawl.
The selected next action is
`broad_accuracy_floor_open_box_timber_eps_screed_hybrid_package_owner_plan`
in
`packages/engine/src/broad-accuracy-floor-open-box-timber-eps-screed-hybrid-package-owner-contract.test.ts`.
Selected next label: EPS/screed hybrid package owner.
That EPS/screed hybrid package owner has now landed as
`broad_accuracy_floor_open_box_timber_eps_screed_hybrid_package_owner_plan`
with selection status
`broad_accuracy_floor_open_box_timber_eps_screed_hybrid_package_owner_landed_no_runtime_selected_formula_corridor`.
It is no-runtime: R7b now owns the 370 mm open-box support, 35 mm EPS
board, 1 mm geotextile, 40 mm screed, 3 mm EPS underlay, 8 mm laminate,
and hybrid lower treatment owner checklist for the next formula
corridor. R8b, R9b, R2c, and R10a stay negative boundaries, the current
dry package `Ln,w 50.8` / `Rw 66` pin remains frozen, field/building and
ASTM/IIC aliases remain blocked, and this is not a broad source crawl.
The selected next action is
`broad_accuracy_floor_open_box_timber_eps_screed_hybrid_package_formula_corridor_plan`
in
`packages/engine/src/broad-accuracy-floor-open-box-timber-eps-screed-hybrid-package-formula-corridor-contract.test.ts`.
Selected next label: EPS/screed hybrid package formula corridor.
That EPS/screed hybrid package formula corridor has now landed as
`broad_accuracy_floor_open_box_timber_eps_screed_hybrid_package_formula_corridor_plan`
with selection status
`broad_accuracy_floor_open_box_timber_eps_screed_hybrid_package_formula_corridor_landed_no_runtime_selected_runtime_corridor`.
It is no-runtime: the corridor defines R7b-anchored element-lab design
metrics `Rw 72`, `C -1.3`, `Rw+C 70.7`, `Ln,w 47`, `CI 0`,
`CI,50-2500 1`, and `Ln,w+CI 47` with source-absent not-measured
budgets, but exact R7b still wins first and public runtime values remain
unchanged. R8b, R9b, R2c, and R10a remain negative boundaries, the
generic dry package-transfer basis is still forbidden, and field/building
plus ASTM/IIC aliases remain blocked. The selected next action is
`broad_accuracy_floor_open_box_timber_eps_screed_hybrid_package_runtime_corridor_plan`
in
`packages/engine/src/broad-accuracy-floor-open-box-timber-eps-screed-hybrid-package-runtime-corridor-contract.test.ts`.
Selected next label: EPS/screed hybrid package runtime corridor.
That EPS/screed hybrid package runtime corridor has now landed as
`broad_accuracy_floor_open_box_timber_eps_screed_hybrid_package_runtime_corridor_plan`
with selection status
`broad_accuracy_floor_open_box_timber_eps_screed_hybrid_package_runtime_corridor_landed_selected_surface_parity`.
Complete source-absent open-box timber EPS/screed hybrid variants now
promote through the
`broad_accuracy_floor_open_box_timber_eps_screed_hybrid_package_formula_corridor`
runtime basis. The representative source-absent element-lab case returns
`Rw 72`, `C -1.3`, `Rw+C 70.7`, `Ln,w 47`, `CI 0`,
`CI,50-2500 1`, and `Ln,w+CI 47` with not-measured budgets including
`+/-7 dB` for `Rw` and `+/-8 dB` for `Ln,w`. Exact R7b still wins,
dry package-transfer remains a separate lane, R8b/R9b/R2c/R10a remain
negative boundaries, and field/building plus ASTM/IIC aliases remain
blocked. The selected next action is
`broad_accuracy_floor_open_box_timber_eps_screed_hybrid_package_surface_parity_plan`
in
`packages/engine/src/broad-accuracy-floor-open-box-timber-eps-screed-hybrid-package-surface-parity-contract.test.ts`.
Selected next label: EPS/screed hybrid package surface parity.
Validation after this EPS/screed hybrid package runtime-corridor closeout:
`pnpm calculator:gate:current` passed on 2026-05-20 with engine 475
files / 2720 tests, web 89 files / 369 passed + 18 skipped, repo build
5 / 5,
  and `git diff --check` clean. The known optional `sharp/@img` warnings
  from the DOCX/PDF build path remain non-fatal.
- Broad-accuracy refocus:
  [calculator/BROAD_ACCURACY_CALCULATOR_PLAN.md](./calculator/BROAD_ACCURACY_CALCULATOR_PLAN.md).
  Use this as the current product-direction guardrail. The 71-row
  company-internal matrix is not the finish line; broad readiness now
  requires exact measured lookup, nearby measured similarity anchors,
  calibrated family solvers, source-absent solver budgets, and a global
  residual benchmark.
- Broad-accuracy landed chain:
  [calculator/SLICE_BROAD_ACCURACY_REFERENCE_BENCHMARK_AND_SIMILARITY_SOLVER_PLAN.md](./calculator/SLICE_BROAD_ACCURACY_REFERENCE_BENCHMARK_AND_SIMILARITY_SOLVER_PLAN.md).
  Older selected-next lines below are retained as landed history; the
  latest checkpoint above is authoritative for the current next action.
  It has now landed as
  `broad_accuracy_reference_benchmark_expansion_and_similarity_solver_plan`
  with selection status
  `broad_accuracy_reference_benchmark_expansion_landed_no_runtime_selected_floor_system_similarity_anchor`.
  The contract
  `packages/engine/src/broad-accuracy-reference-benchmark-expansion-contract.test.ts`
  creates the benchmark ledger, evidence-role classification, residual
  summary, weak-lane debt ledger, and similarity-anchor scoring policy.
  Selected next action:
  `broad_accuracy_floor_system_similarity_anchor_runtime_plan`; selected
  next file:
  `packages/engine/src/broad-accuracy-floor-system-similarity-anchor-contract.test.ts`.
  That selected floor-system anchor admission gate has now landed as
  `broad_accuracy_floor_system_similarity_anchor_runtime_plan` with
  selection status
  `broad_accuracy_floor_system_similarity_anchor_landed_no_runtime_selected_open_web_supported_band_runtime_corridor`.
  It classifies 90 UBIQ open-web exact rows, 21 open-web bound rows, and
  15 TUAS open-box exact rows without counting inventory as readiness,
  pins the existing FL-28 250 mm interpolation seed as
  no-runtime movement, and selects
  `broad_accuracy_open_web_supported_band_similarity_runtime_corridor_plan`
  as the next action. Selected next file:
  `packages/engine/src/broad-accuracy-open-web-supported-band-similarity-runtime-contract.test.ts`.
  Selected next label: open-web steel supported-band similarity runtime
  corridor.
  That runtime corridor has now landed as
  `broad_accuracy_open_web_supported_band_similarity_runtime_corridor_plan`
  with selection status
  `broad_accuracy_open_web_supported_band_similarity_runtime_corridor_landed_selected_surface_parity`.
  It adds
  `predictor_lightweight_steel_open_web_supported_band_similarity_estimate`
  for complete element-lab FL-24/FL-26 open-web steel supported-band
  stacks: FL-26 250 mm timber is `Ln,w 53.5`, `Ln,w+CI 52`,
  `Rw 61.5`; FL-24 250 mm timber is `Ln,w 54.5`, `Ln,w+CI 53`,
  `Rw 60.5`; FL-26 250 mm bare is `Ln,w 61.5`, `Ln,w+CI 60`,
  `Rw 61.5`. Exact rows and the existing FL-28 interpolation still win,
  while carpet, missing-fill, field/building, and ASTM/IIC aliases stay
  blocked. Selected next action:
  `broad_accuracy_open_web_supported_band_similarity_surface_parity_plan`;
  selected next file:
  `packages/engine/src/broad-accuracy-open-web-supported-band-similarity-surface-parity-contract.test.ts`.
  Selected next label: open-web supported-band similarity surface parity.
  That selected surface parity has now landed as
  `broad_accuracy_open_web_supported_band_similarity_surface_parity_plan`
  with selection status
  `broad_accuracy_open_web_supported_band_similarity_surface_parity_landed_selected_coverage_refresh`.
  It keeps runtime values frozen while cards, method dossier, saved
  replay, server snapshot replay, calculator API, impact-only API, and
  Markdown report all show `Open-web steel supported-band similarity`
  with the same
  `predictor_lightweight_steel_open_web_supported_band_similarity_estimate`
  basis, `89.5%` fit, exact-source precedence, and field/building,
  ASTM/IIC boundaries. FL-26 250 mm timber remains `Ln,w 53.5`,
  `Ln,w+CI 52`, `Rw 61.5`. Selected next action:
  `broad_accuracy_open_web_supported_band_similarity_coverage_refresh_plan`;
  selected next file:
  `packages/engine/src/broad-accuracy-open-web-supported-band-similarity-coverage-refresh-contract.test.ts`.
  Selected next label: open-web supported-band similarity coverage
  refresh.
  That coverage refresh has now landed as
  `broad_accuracy_open_web_supported_band_similarity_coverage_refresh_plan`
  with selection status
  `broad_accuracy_open_web_supported_band_similarity_coverage_refresh_landed_selected_wall_multileaf_triple_leaf_solver`.
  It keeps the open-web steel supported-band similarity runtime frozen
  while the refreshed matrix pins FL-26 250 mm timber at `Ln,w 53.5`,
  keeps exact-source precedence and FL-28 seed precedence, blocks
  carpet, missing-fill, field, building, and ASTM/IIC aliases, and
  leaves direct-fixed open-web and open-box timber as ranked follow-ups.
  Selected next action:
  `broad_accuracy_wall_multileaf_triple_leaf_calibrated_solver_plan`;
  selected next file:
  `packages/engine/src/broad-accuracy-wall-multileaf-triple-leaf-calibrated-solver-contract.test.ts`.
  Selected next label: wall multileaf triple-leaf calibrated solver.
  That calibrated solver has now landed as
  `broad_accuracy_wall_multileaf_triple_leaf_calibrated_solver_plan`
  with selection status
  `broad_accuracy_wall_multileaf_triple_leaf_calibrated_solver_landed_selected_surface_parity`.
  It promotes only explicit NRC 2024 source-family Type C / glass-fiber
  grouped triple-leaf element-lab stacks through
  `broad_accuracy_wall_triple_leaf_nrc2024_calibrated_two_cavity_solver`.
  Assembly B now returns `Rw 49 / STC 60 / C 1.4 / Ctr -7.4`, while
  Assembly A and D return `Rw 58` and `Rw 55` respectively with the same
  calibrated lab basis and `+/-4 dB` budget. Rockwool / MLV / plaster,
  generic gypsum or glasswool, duplicate or missing grouped topology,
  field outputs, and building outputs stay outside this calibrated lane.
  Selected next action:
  `broad_accuracy_wall_multileaf_triple_leaf_calibrated_solver_surface_parity_plan`;
  selected next file:
  `apps/web/features/workbench/wall-triple-leaf-calibrated-solver-surface-parity.test.ts`.
  Selected next label: wall triple-leaf calibrated solver surface parity.
  That surface parity has now landed with selection status
  `broad_accuracy_wall_multileaf_triple_leaf_calibrated_solver_surface_parity_landed_selected_coverage_refresh`.
  Cards, route posture, dynamic branch copy, method/corridor dossiers,
  Markdown reports, local saved replay, server snapshot replay, and the
  calculator API now show the calibrated source-family basis and `+/-4 dB`
  budget without moving `Rw 49 / STC 60 / C 1.4 / Ctr -7.4`.
  `R'w` and `DnT,w` stay parked as field input prompts on mixed
  lab-plus-field requests, not lab aliases. Selected next action:
  `broad_accuracy_wall_multileaf_triple_leaf_calibrated_solver_coverage_refresh_plan`;
  selected next file:
  `packages/engine/src/broad-accuracy-wall-multileaf-triple-leaf-calibrated-solver-coverage-refresh-contract.test.ts`.
  Selected next label: wall triple-leaf calibrated solver coverage
  refresh.
  That coverage refresh has now landed with selection status
  `broad_accuracy_wall_multileaf_triple_leaf_calibrated_solver_coverage_refresh_landed_selected_local_substitution_mapping`.
  The 12-row executable matrix keeps NRC 2024 Assembly B at `Rw 49`,
  Assembly A at `Rw 58`, and Assembly D at `Rw 55`; keeps mixed
  `R'w` / `DnT,w` and building requests as basis-boundary prompts; and
  keeps duplicate / partial grouped topology out of calibrated support.
  Generic gypsum / glasswool and local Rockwool / MLV / plaster
  substitutions are the selected local substitution follow-up, while
  direct-fixed open-web and open-box timber remain ranked later. Selected
  next action:
  `broad_accuracy_wall_multileaf_triple_leaf_local_substitution_mapping_plan`;
  selected next file:
  `packages/engine/src/broad-accuracy-wall-multileaf-triple-leaf-local-substitution-mapping-contract.test.ts`.
  Selected next label: wall triple-leaf local substitution mapping.
  That local substitution mapping has now landed with selection status
  `broad_accuracy_wall_multileaf_triple_leaf_local_substitution_mapping_landed_no_runtime_selected_formula_corridor`.
  It keeps the NRC Type C / glass-fiber calibrated runtime as the only
  currently supported triple-leaf control, while classifying generic
  gypsum / glasswool and local Rockwool / MLV / plaster grouped stacks as
  no-runtime formula corridor candidates. Field/building basis, duplicate
  grouping, and partial grouped topology stay blocked. Selected next
  action:
  `broad_accuracy_wall_multileaf_triple_leaf_local_substitution_formula_corridor_plan`;
  selected next file:
  `packages/engine/src/broad-accuracy-wall-multileaf-triple-leaf-local-substitution-formula-corridor-contract.test.ts`.
  Selected next label: wall triple-leaf local substitution formula
  corridor.
  That formula corridor has now landed with selection status
  `broad_accuracy_wall_multileaf_triple_leaf_local_substitution_formula_corridor_landed_no_runtime_selected_runtime_corridor`.
  It defines source-absent lab `Rw` design corridors without runtime
  promotion: generic gypsum / glasswool maps to `Rw 49.3` with a
  `+/-6 dB` not-measured budget, and local Rockwool / MLV / plaster maps
  to `Rw 52.8` with a `+/-8 dB` not-measured budget. `STC`, `C`, `Ctr`,
  field, and building outputs stay blocked until a later adapter owns
  them, exact measured rows still outrank the corridor, and live runtime
  values remain unchanged. Selected next action:
  `broad_accuracy_wall_multileaf_triple_leaf_local_substitution_runtime_corridor_plan`;
  selected next file:
  `packages/engine/src/broad-accuracy-wall-multileaf-triple-leaf-local-substitution-runtime-corridor-contract.test.ts`.
  Selected next label: wall triple-leaf local substitution runtime
  corridor.
  That runtime corridor has now landed with selection status
  `broad_accuracy_wall_multileaf_triple_leaf_local_substitution_runtime_corridor_landed_selected_surface_parity`.
  Complete grouped generic gypsum / glasswool now returns live lab
  ISO-rounded `Rw 50` from a `Rw 49.3` formula design corridor, and
  complete grouped local Rockwool / MLV / plaster now returns live lab
  ISO-rounded `Rw 53` from a `Rw 52.8` formula design corridor; both
  remain source-absent family-physics predictions with `STC`, `C`,
  `Ctr`, field, and building outputs blocked until separate adapters own
  them. Selected next action:
  `broad_accuracy_wall_multileaf_triple_leaf_local_substitution_surface_parity_plan`;
  selected next file:
  `packages/engine/src/broad-accuracy-wall-multileaf-triple-leaf-local-substitution-surface-parity-contract.test.ts`.
  Selected next label: wall triple-leaf local substitution surface
  parity.
  That surface parity closeout has now landed with selection status
  `broad_accuracy_wall_multileaf_triple_leaf_local_substitution_surface_parity_landed_selected_coverage_refresh`.
  Output cards, route posture, dynamic branch copy, method dossier, local
  saved replay, server snapshot replay, calculator API payloads, and
  Markdown reports now show `Wall triple-leaf local substitution` with
  the same Rw-only candidate id, method, warning, and not-measured
  budgets. Generic gypsum / glasswool remains `Rw 50` with `+/-6 dB`;
  local Rockwool / MLV / plaster remains `Rw 53` with `+/-8 dB`. `STC`,
  `C`, and `Ctr` stay unsupported, while `R'w` and `DnT,w` stay field
  input prompts rather than lab aliases. Selected next action:
  `broad_accuracy_wall_multileaf_triple_leaf_local_substitution_coverage_refresh_plan`;
  selected next file:
  `packages/engine/src/broad-accuracy-wall-multileaf-triple-leaf-local-substitution-coverage-refresh-contract.test.ts`.
  Selected next label: wall triple-leaf local substitution coverage
  refresh.
  Targeted mapping, formula-corridor, runtime-corridor, surface-parity,
  coverage-refresh, direct-fixed open-web, and open-box transfer-owner
  contracts are green. Full `pnpm calculator:gate:current` passed on
  2026-05-19 before the open-box formula sprint: engine 459 files / 2635
  tests, web 87 files / 363 passed + 18 skipped, repo build 5/5, with
  only the known non-fatal optional `sharp/@img` and Zustand test-storage
  warnings.
  That coverage refresh has now landed as
  `broad_accuracy_wall_multileaf_triple_leaf_local_substitution_coverage_refresh_plan`
  with selection status
  `broad_accuracy_wall_multileaf_triple_leaf_local_substitution_coverage_refresh_landed_selected_lab_spectrum_adapter`.
  It keeps generic `Rw 50` and local `Rw 53` frozen, keeps `R'w` and
  `DnT,w` under explicit field-context ownership, keeps direct-fixed
  open-web and open-box timber ranked behind the wall metric gap, and
  selects
  `broad_accuracy_wall_multileaf_triple_leaf_local_substitution_lab_spectrum_adapter_plan`.
  Selected next file:
  `packages/engine/src/broad-accuracy-wall-multileaf-triple-leaf-local-substitution-lab-spectrum-adapter-contract.test.ts`;
  selected next label: wall triple-leaf local substitution lab STC/C/Ctr
  spectrum adapter.
  That lab spectrum adapter has now landed as
  `broad_accuracy_wall_multileaf_triple_leaf_local_substitution_lab_spectrum_adapter_plan`
  with selection status
  `broad_accuracy_wall_multileaf_triple_leaf_local_substitution_lab_spectrum_adapter_landed_selected_surface_parity`.
  It preserves generic `Rw 50` and local `Rw 53` while promoting
  source-absent lab `STC`, `C`, and `Ctr` from the calculated curve:
  generic `STC 61 / C 1.6 / Ctr -7.2`, local `STC 64 / C 1.6 /
  Ctr -7.2`. Field `R'w` / `DnT,w`, building prediction, exact-source
  precedence, and hostile topology remain protected. Selected next
  action:
  `broad_accuracy_wall_multileaf_triple_leaf_local_substitution_lab_spectrum_adapter_surface_parity_plan`;
  selected next file:
  `packages/engine/src/broad-accuracy-wall-multileaf-triple-leaf-local-substitution-lab-spectrum-adapter-surface-parity-contract.test.ts`.
  Selected next label: wall triple-leaf local substitution lab spectrum
  adapter surface parity.
  The adapter surface parity closeout has now landed as
  `broad_accuracy_wall_multileaf_triple_leaf_local_substitution_lab_spectrum_adapter_surface_parity_plan`
  with selection status
  `broad_accuracy_wall_multileaf_triple_leaf_local_substitution_lab_spectrum_adapter_surface_parity_landed_selected_coverage_refresh`.
  It is no-runtime: cards, route posture, dynamic trace, dossiers,
  saved replay, server snapshot replay, API payloads, and reports now
  preserve the same adapter values and basis. Generic stays `Rw 50 /
  STC 61 / C 1.6 / Ctr -7.2`; local stays `Rw 53 / STC 64 / C 1.6 /
  Ctr -7.2`; field/building, exact precedence, and hostile topology
  boundaries remain protected. Selected next action:
  `broad_accuracy_wall_multileaf_triple_leaf_local_substitution_lab_spectrum_adapter_coverage_refresh_plan`;
  selected next file:
  `packages/engine/src/broad-accuracy-wall-multileaf-triple-leaf-local-substitution-lab-spectrum-adapter-coverage-refresh-contract.test.ts`.
  The adapter coverage refresh has now landed as
  `broad_accuracy_wall_multileaf_triple_leaf_local_substitution_lab_spectrum_adapter_coverage_refresh_plan`
  with selection status
  `broad_accuracy_wall_multileaf_triple_leaf_local_substitution_lab_spectrum_adapter_coverage_refresh_landed_selected_field_context_harmonization`.
  It is no-runtime: generic remains `Rw 50 / STC 61 / C 1.6 / Ctr
  -7.2`, local remains `Rw 53 / STC 64 / C 1.6 / Ctr -7.2`, STC-only
  stays on the calculated lab spectrum adapter, and exact/calibrated
  precedence plus mixed field `R'w` / `DnT,w`, building, duplicate, and
  partial-topology boundaries remain protected. The next action is
  `broad_accuracy_wall_multileaf_triple_leaf_local_substitution_field_context_harmonization_plan`;
  selected next file:
  `packages/engine/src/broad-accuracy-wall-multileaf-triple-leaf-local-substitution-field-context-harmonization-contract.test.ts`.
  Direct-fixed open-web and open-box timber remain ranked follow-ups
  behind this wall field context lane.
  The field context harmonization has now landed as
  `broad_accuracy_wall_multileaf_triple_leaf_local_substitution_field_context_harmonization_plan`
  with selection status
  `broad_accuracy_wall_multileaf_triple_leaf_local_substitution_field_context_harmonization_landed_selected_field_context_surface_parity`.
  It is runtime movement for complete local Rockwool / MLV / plaster
  grouped triple-leaf `field_between_rooms` requests: the lab
  local-substitution curve (`Rw 53 / STC 64 / C 1.6 / Ctr -7.2`) is the
  direct anchor, and the current contract fixture returns `R'w 51` and
  `DnT,w 53` with a `+/-10 dB` source-absent field error budget. Missing
  field context remains `needs_input`, building prediction remains
  unsupported, and exact measured rows still win. Selected next action:
  `broad_accuracy_wall_multileaf_triple_leaf_local_substitution_field_context_surface_parity_plan`;
  selected next file:
  `packages/engine/src/broad-accuracy-wall-multileaf-triple-leaf-local-substitution-field-context-surface-parity-contract.test.ts`.
  Direct-fixed open-web and open-box timber remain ranked follow-ups
  behind the surface-parity closeout.
  The field-context surface parity closeout has now landed as
  `broad_accuracy_wall_multileaf_triple_leaf_local_substitution_field_context_surface_parity_plan`
  with selection status
  `broad_accuracy_wall_multileaf_triple_leaf_local_substitution_field_context_surface_parity_landed_selected_open_web_direct_fixed_lining_transfer_owner`.
  It is no-runtime: cards, route posture, dynamic trace, dossiers,
  saved replay, server snapshot replay, API payloads, and reports now
  preserve the same local-substitution field basis and budget. The
  contract fixture remains `R'w 51 / DnT,w 53`, the workbench/API
  fixture remains `R'w 52 / DnT,w 53`, and both carry the `+/-10 dB`
  source-absent field budget without calling it measured field evidence
  or a lab `Rw`/`STC` relabel. Selected next action:
  `broad_accuracy_floor_open_web_direct_fixed_lining_transfer_owner_contract_plan`;
  selected next file:
  `packages/engine/src/broad-accuracy-floor-open-web-direct-fixed-lining-transfer-owner-contract.test.ts`.
  Direct-fixed open-web is selected next; open-box timber remains the
  ranked follow-up.
  The direct-fixed open-web transfer-owner contract has now landed as
  `broad_accuracy_floor_open_web_direct_fixed_lining_transfer_owner_contract_plan`
  with selection status
  `broad_accuracy_floor_open_web_direct_fixed_lining_transfer_owner_landed_no_runtime_selected_formula_corridor`.
  This is no-runtime owner work: it classifies 54 UBIQ direct-fixed
  open-web exact rows across FL-23, FL-25, and FL-27; owns carrier
  geometry, deck mass, upper finish delta, direct lining attachment,
  `Ln,w` / `CI` / `Ln,w+CI` transfer, `Rw` bridge, exact precedence,
  source-absent budget, and negative boundaries; and keeps resilient
  suspended-ceiling rows, open-box timber, field/building outputs, and
  ASTM/IIC aliases blocked. Selected next action:
  `broad_accuracy_floor_open_web_direct_fixed_lining_formula_corridor_plan`;
  selected next file:
  `packages/engine/src/broad-accuracy-floor-open-web-direct-fixed-lining-formula-corridor-contract.test.ts`.
  Selected next label: floor open-web direct-fixed lining formula
  corridor.
  The direct-fixed open-web formula corridor has now landed as
  `broad_accuracy_floor_open_web_direct_fixed_lining_formula_corridor_plan`
  with selection status
  `broad_accuracy_floor_open_web_direct_fixed_lining_formula_corridor_landed_no_runtime_selected_runtime_corridor`.
  This is no-runtime formula-corridor work: it defines same-family
  direct-fixed interpolation from the 54 UBIQ exact rows by FL-23 /
  FL-25 / FL-27 board schedule, 16/19 mm INEX deck, finish package, and
  200/300/400 mm carrier depth. The representative 250 mm FL-23 / 19 mm
  timber-underlay design row is `Ln,w 71`, `CI -0.5`, `Ln,w+CI 70.5`,
  `Rw 51`, and `Rw+Ctr 43.5`, with source-absent design budgets of
  `+/-4 dB` for `Ln,w` and `+/-3 dB` for `Rw`. Exact rows still win;
  out-of-band carrier depths, field/building outputs, and ASTM/IIC
  aliases remain blocked. Selected next action:
  `broad_accuracy_floor_open_web_direct_fixed_lining_runtime_corridor_plan`;
  selected next file:
  `packages/engine/src/broad-accuracy-floor-open-web-direct-fixed-lining-runtime-corridor-contract.test.ts`.
  Selected next label: floor open-web direct-fixed lining runtime
  corridor.
  The direct-fixed open-web runtime corridor has now landed as
  `broad_accuracy_floor_open_web_direct_fixed_lining_runtime_corridor_plan`
  with selection status
  `broad_accuracy_floor_open_web_direct_fixed_lining_runtime_corridor_landed_selected_surface_parity`.
  It promotes complete source-absent element-lab direct-fixed open-web
  stacks through
  `broad_accuracy_floor_open_web_direct_fixed_lining_direct_source_interpolation_formula_corridor`
  instead of the broad floor-family fallback. FL-23/FL-25/FL-27
  same-family source anchors now cover mid-depth direct-fixed variants:
  the 250 mm FL-23 / 19 mm timber-underlay runtime returns `Ln,w 71`,
  `CI -0.5`, `Ln,w+CI 70.5`, `Rw 51`, and `Rw+Ctr 43.5`; FL-25 bare and
  FL-27 carpet variants keep their formula-corridor pins. Runtime impact
  budgets stay visible as not-measured source-absent budgets (`+/-4 dB`
  for `Ln,w`, `+/-1.5 dB` for `CI`, `+/-4.5 dB` for `Ln,w+CI`; the
  formula owner still carries `+/-3 dB` for `Rw`). Exact rows still win;
  resilient supported-band stacks, out-of-band depths, duplicate
  carriers, field/building outputs, and ASTM/IIC aliases remain outside
  the runtime. Selected next action:
  `broad_accuracy_floor_open_web_direct_fixed_lining_surface_parity_plan`;
  selected next file:
  `packages/engine/src/broad-accuracy-floor-open-web-direct-fixed-lining-surface-parity-contract.test.ts`.
  Selected next label: floor open-web direct-fixed lining surface parity.
  The direct-fixed open-web surface parity gate has now landed as
  `broad_accuracy_floor_open_web_direct_fixed_lining_surface_parity_plan`
  with selection status
  `broad_accuracy_floor_open_web_direct_fixed_lining_surface_parity_landed_selected_coverage_refresh`.
  It keeps output cards, route posture, impact lane labels, confidence
  provenance, metric-basis copy, corridor/method dossier, local saved
  replay, server snapshot replay, calculator API, impact-only API, and
  Markdown report on the same source-absent direct-fixed lab basis without
  moving runtime values. The visible FL-23 timber pin still reports
  `Ln,w 71`, `CI -0.5`, `Ln,w+CI 70.5`, `Rw 51`, and `Rw+Ctr 43.5`
  inside the FL-23/FL-25/FL-27 direct-fixed source grid with
  source-absent budgets. Exact rows, resilient supported-band stacks,
  out-of-band depths, duplicate carriers, field/building outputs, and
  ASTM/IIC aliases remain outside this lane. Selected next action:
  `broad_accuracy_floor_open_web_direct_fixed_lining_coverage_refresh_plan`;
  selected next file:
  `packages/engine/src/broad-accuracy-floor-open-web-direct-fixed-lining-coverage-refresh-contract.test.ts`.
  Selected next label: floor open-web direct-fixed lining coverage refresh.
  The direct-fixed open-web coverage refresh has now landed as
  `broad_accuracy_floor_open_web_direct_fixed_lining_coverage_refresh_plan`
  with selection status
  `broad_accuracy_floor_open_web_direct_fixed_lining_coverage_refresh_landed_selected_open_box_timber_transfer_owner`.
  This no-runtime coverage refresh moves the FL-23/FL-25/FL-27
  direct-fixed lane out of follow-up status and into the broad matrix:
  FL-23 keeps `Ln,w 71`, `CI -0.5`, `Ln,w+CI 70.5`, `Rw 51`, and
  `Rw+Ctr 43.5`; FL-25 keeps `Ln,w 77`; FL-27 keeps `Ln,w 63`. Exact
  source precedence stays first for the 300 mm FL-23 exact row,
  resilient supported-band stacks stay on their separate lane,
  out-of-band depths and duplicate carriers stay outside direct-fixed,
  and field/building plus ASTM/IIC outputs remain boundary rows.
  Selected next action:
  `broad_accuracy_floor_open_box_timber_similarity_transfer_owner_contract_plan`;
  selected next file:
  `packages/engine/src/broad-accuracy-floor-open-box-timber-similarity-transfer-owner-contract.test.ts`.
  Selected next label: floor open-box timber similarity transfer owner.
  The open-box timber similarity transfer-owner contract has now landed as
  `broad_accuracy_floor_open_box_timber_similarity_transfer_owner_contract_plan`
  with selection status
  `broad_accuracy_floor_open_box_timber_similarity_transfer_owner_landed_no_runtime_selected_formula_corridor`.
  This no-runtime owner gate classifies 15 TUAS open-box timber exact
  rows on the 370 mm `open_box_timber_slab` carrier, separates the 10
  predictor-owned rows from the 5 exact-only hybrid / fragmented package
  rows, and owns the support family, laminate/EPS finish pair, upper
  package, lower ceiling family, fragmented exact-equivalence, ISO lab
  `Ln,w` / `CI` / `CI,50-2500` / `Ln,w+CI` transfer, `Rw` companion
  semantics, exact precedence, source-absent budget, and negative
  boundaries. Open-web steel, raw bare open-box carriers, disjoint
  duplicate roles, partial finish packages, field/building outputs, and
  ASTM/IIC aliases stay blocked. Selected next action:
  `broad_accuracy_floor_open_box_timber_similarity_formula_corridor_plan`;
  selected next file:
  `packages/engine/src/broad-accuracy-floor-open-box-timber-similarity-formula-corridor-contract.test.ts`.
  Selected next label: floor open-box timber similarity formula corridor.
  The open-box timber similarity formula corridor has now landed as
  `broad_accuracy_floor_open_box_timber_similarity_formula_corridor_plan`
  with selection status
  `broad_accuracy_floor_open_box_timber_similarity_formula_corridor_landed_no_runtime_selected_runtime_corridor`.
  This no-runtime gate defines TUAS same-family package-transfer design
  payloads without moving public runtime values: the dry gypsum-fiber
  packet probe is `Ln,w 50.8` / `Rw 66`, with `+/-7 dB` impact and
  `+/-6 dB` airborne design budgets. Exact TUAS rows still win; raw
  bare open-box carriers, exact-only hybrid and mixed staged packets,
  field/building outputs, and ASTM/IIC aliases stay blocked. Selected
  next action:
  `broad_accuracy_floor_open_box_timber_similarity_runtime_corridor_plan`;
  selected next file:
  `packages/engine/src/broad-accuracy-floor-open-box-timber-similarity-runtime-corridor-contract.test.ts`.
  Selected next label: floor open-box timber similarity runtime corridor.
  The open-box timber similarity runtime corridor has now landed as
  `broad_accuracy_floor_open_box_timber_similarity_runtime_corridor_plan`
  with selection status
  `broad_accuracy_floor_open_box_timber_similarity_runtime_corridor_landed_selected_surface_parity`.
  Complete source-absent dry gypsum-fiber, thin laminate/EPS, and
  reinforced-ceiling open-box timber packages now promote through the
  `broad_accuracy_floor_open_box_timber_similarity_package_transfer_formula_corridor`
  runtime basis. The dry gypsum-fiber runtime pin is `Ln,w 50.8`,
  `CI,50-2500 3.3`, and `Rw 66`; the not-measured budgets stay visible
  as `+/-7 dB` for `Ln,w`, `+/-2.5 dB` for `CI,50-2500`, and `+/-6 dB`
  for `Rw`. Exact TUAS rows still win; raw bare open-box, exact-only
  hybrid, mixed staged, field/building, and ASTM/IIC aliases stay
  blocked. Selected next action:
  `broad_accuracy_floor_open_box_timber_similarity_surface_parity_plan`;
  selected next file:
  `packages/engine/src/broad-accuracy-floor-open-box-timber-similarity-surface-parity-contract.test.ts`.
  Selected next label: floor open-box timber similarity surface parity.
- Current checkpoint:
  [calculator/CHECKPOINT_2026-05-18_OPEN_BOX_TIMBER_TRANSFER_OWNER.md](./calculator/CHECKPOINT_2026-05-18_OPEN_BOX_TIMBER_TRANSFER_OWNER.md).
- End-of-day checkpoint:
  [calculator/CHECKPOINT_2026-05-18_END_OF_DAY_BROAD_ACCURACY.md](./calculator/CHECKPOINT_2026-05-18_END_OF_DAY_BROAD_ACCURACY.md).
  Use this first when resuming after commit `c248db8`; it maps the
  landed broad-accuracy slice to implementation/docs and lists the
  open-box timber formula/runtime/surface-parity items that did not land.
- Pre-sprint revalidation:
  [calculator/CHECKPOINT_2026-05-19_PRE_SPRINT_REVALIDATION_AND_OPEN_BOX_FORMULA_PLAN.md](./calculator/CHECKPOINT_2026-05-19_PRE_SPRINT_REVALIDATION_AND_OPEN_BOX_FORMULA_PLAN.md).
  Use this before implementing the next sprint; it records the fresh
  full current-gate pass and the ordered open-box timber formula,
  runtime, surface-parity, and matrix-refresh sequence.
- Active mainline has been realigned after the no-runtime ASTM scaffold:
  [calculator/CHECKPOINT_2026-05-14_COMPANY_INTERNAL_MAINLINE_REALIGNMENT_HANDOFF.md](./calculator/CHECKPOINT_2026-05-14_COMPANY_INTERNAL_MAINLINE_REALIGNMENT_HANDOFF.md).
- Active tactical plan:
  [calculator/SLICE_COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_PLAN.md](./calculator/SLICE_COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_PLAN.md).
- Research-backed remaining-road checkpoint:
  [calculator/CHECKPOINT_2026-05-14_RESEARCH_BACKED_COMPANY_INTERNAL_ROADMAP.md](./calculator/CHECKPOINT_2026-05-14_RESEARCH_BACKED_COMPANY_INTERNAL_ROADMAP.md).
  Use this to keep the next work tied to company-internal acceptance
  scenarios, ISO lab/field/building basis separation, targeted source
  calibration, implementation-vs-doc drift cleanup, and zero complete
  in-scope `low_confidence` / `screening_fallback` finals.
- Current checkpoint review:
  [calculator/CHECKPOINT_2026-05-15_COMPANY_INTERNAL_CHECKPOINT_REVIEW_AND_VALIDATION.md](./calculator/CHECKPOINT_2026-05-15_COMPANY_INTERNAL_CHECKPOINT_REVIEW_AND_VALIDATION.md).
  Use this as the checkpoint before the opening/leak A-weighted
  formula-corridor handoff below; its selected formula action has now
  landed.
- Opening/leak A-weighted formula-corridor handoff:
  [calculator/CHECKPOINT_2026-05-15_COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FORMULA_CORRIDOR_HANDOFF.md](./calculator/CHECKPOINT_2026-05-15_COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FORMULA_CORRIDOR_HANDOFF.md).
  `company_internal_opening_leak_a_weighted_spectrum_adapter_formula_corridor_plan`
  has landed with selection status
  `company_internal_opening_leak_a_weighted_spectrum_adapter_formula_corridor_landed_no_runtime_selected_runtime_corridor`.
  Formula pins: field `Dn,A 35.9`; field `DnT,A 36.1`; building `DnT,A 31.3`.
  The selected next action, now landed, is
  `company_internal_opening_leak_a_weighted_spectrum_adapter_runtime_corridor_plan`;
  selected next file, now landed:
  `packages/engine/src/company-internal-opening-leak-a-weighted-spectrum-adapter-runtime-corridor-contract.test.ts`;
  selected next label, now landed: opening/leak Dn,A / DnT,A
  spectrum-adapter runtime corridor.
  Selected next label literal: opening/leak Dn,A / DnT,A spectrum-adapter runtime corridor.
- Opening/leak A-weighted runtime-corridor handoff:
  [calculator/CHECKPOINT_2026-05-15_COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_CORRIDOR_HANDOFF.md](./calculator/CHECKPOINT_2026-05-15_COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_CORRIDOR_HANDOFF.md).
  `company_internal_opening_leak_a_weighted_spectrum_adapter_runtime_corridor_plan`
  has landed with selection status
  `company_internal_opening_leak_a_weighted_spectrum_adapter_runtime_corridor_landed_selected_surface_parity`.
  Runtime pins: field `Dn,A 35.9`; field `DnT,A 36.1`; building `DnT,A 31.3`.
  `frequencyBandSet` is now a runtime input: missing it keeps A-weighted
  outputs unsupported. The selected next action, now landed, is
  `company_internal_opening_leak_a_weighted_spectrum_adapter_surface_parity_plan`;
  selected next file, now landed:
  `packages/engine/src/company-internal-opening-leak-a-weighted-spectrum-adapter-surface-parity-contract.test.ts`;
  selected next label, now landed: opening/leak Dn,A / DnT,A card/report/API parity.
- Current opening/leak A-weighted surface-parity handoff:
  [calculator/CHECKPOINT_2026-05-15_COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_SURFACE_PARITY_HANDOFF.md](./calculator/CHECKPOINT_2026-05-15_COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_SURFACE_PARITY_HANDOFF.md).
  `company_internal_opening_leak_a_weighted_spectrum_adapter_surface_parity_plan`
  has landed with selection status
  `company_internal_opening_leak_a_weighted_spectrum_adapter_surface_parity_landed_selected_matrix_v6_refresh`.
  It preserves field `Dn,A 35.9`, field `DnT,A 36.1`, building
  `DnT,A 31.3`, and carries the frequency band set through cards,
  report, API, saved replay, server snapshot replay, and workbench
  input surface. Selected next action:
  `company_internal_calculation_grade_mainline_matrix_v6_refresh_after_opening_leak_a_weighted_surface_parity_plan`;
  selected next file:
  `packages/engine/src/company-internal-calculation-grade-mainline-matrix-v6-contract.test.ts`;
  selected next label: company-internal matrix v6 refresh after opening/leak Dn,A / DnT,A surface parity.
- Current company-internal Matrix V6 handoff:
  [calculator/CHECKPOINT_2026-05-15_COMPANY_INTERNAL_MATRIX_V6_REFRESH_AFTER_A_WEIGHTED_SURFACE_HANDOFF.md](./calculator/CHECKPOINT_2026-05-15_COMPANY_INTERNAL_MATRIX_V6_REFRESH_AFTER_A_WEIGHTED_SURFACE_HANDOFF.md).
  `company_internal_calculation_grade_mainline_matrix_v6_refresh_after_opening_leak_a_weighted_surface_parity_plan`
  has landed with selection status
  `company_internal_calculation_grade_mainline_matrix_v6_refresh_after_opening_leak_a_weighted_surface_parity_landed_selected_boundary_revalidation`.
  Matrix V6 has 71 rows, preserves field `Dn,A 35.9`, field
  `DnT,A 36.1`, and building `DnT,A 31.3`, retires the stale
  A-weighted unsupported row, and keeps building `Dn,A`,
  missing `frequencyBandSet`, lab aliases, ASTM aliases, and
  exact-source precedence as explicit boundaries. Selected next action:
  `company_internal_building_astm_boundary_revalidation_after_a_weighted_matrix_plan`;
  selected next file:
  `packages/engine/src/company-internal-building-astm-boundary-revalidation-contract.test.ts`;
  selected next label: building partial-context and ASTM parked-boundary revalidation.
- Current building/ASTM boundary revalidation handoff:
  [calculator/CHECKPOINT_2026-05-15_COMPANY_INTERNAL_BUILDING_ASTM_BOUNDARY_REVALIDATION_HANDOFF.md](./calculator/CHECKPOINT_2026-05-15_COMPANY_INTERNAL_BUILDING_ASTM_BOUNDARY_REVALIDATION_HANDOFF.md).
  `company_internal_building_astm_boundary_revalidation_after_a_weighted_matrix_plan`
  has landed with selection status
  `company_internal_building_astm_boundary_revalidation_after_a_weighted_matrix_landed_selected_final_internal_use_rehearsal`.
  It proves building partial-context and opening/leak building
  missing-owner rows remain `needs_input` with named physical owners such
  as `sourceRoomVolumeM3`, no value pins, and no budget. It also proves
  floor ASTM `IIC` / `AIIC` and airborne A-weighted-to-ASTM alias rows
  remain unsupported without ISO alias values. Selected next action:
  `company_internal_final_internal_use_rehearsal_after_boundary_revalidation_plan`;
  selected next file:
  `packages/engine/src/company-internal-final-internal-use-rehearsal-contract.test.ts`;
  selected next label: final internal-use rehearsal and operating envelope.
- Current remaining-gap analysis and execution plan:
  [calculator/CHECKPOINT_2026-05-15_COMPANY_INTERNAL_REMAINING_GAP_ANALYSIS_AND_PLAN.md](./calculator/CHECKPOINT_2026-05-15_COMPANY_INTERNAL_REMAINING_GAP_ANALYSIS_AND_PLAN.md).
  Use this for the concrete path to controlled company-internal
  readiness: final internal-use rehearsal.
- Final rehearsal planning checkpoint:
  [calculator/CHECKPOINT_2026-05-15_COMPANY_INTERNAL_FINAL_REHEARSAL_PLANNING_HANDOFF.md](./calculator/CHECKPOINT_2026-05-15_COMPANY_INTERNAL_FINAL_REHEARSAL_PLANNING_HANDOFF.md).
  Use this for the exact implementation order before declaring
  controlled company-internal readiness. It compares the current
  implementation with the living docs, confirms Matrix V6 and boundary
  revalidation are landed, and makes the next file
  `packages/engine/src/company-internal-final-internal-use-rehearsal-contract.test.ts`.
- Controlled company-internal operating envelope:
  [calculator/COMPANY_INTERNAL_OPERATING_ENVELOPE.md](./calculator/COMPANY_INTERNAL_OPERATING_ENVELOPE.md).
  Use `COMPANY_INTERNAL_OPERATING_ENVELOPE.md` after the final rehearsal
  is green to explain which routes are ready, which ask for input, and
  which remain intentionally unsupported.
- Next plain label: company-internal ISO floor / wall solver coverage
  and field/building missing-input safety.
- Previous company-internal input-surface step:
  [calculator/CHECKPOINT_2026-05-14_COMPANY_INTERNAL_OPENING_LEAK_BUILDING_INPUT_SURFACE_HANDOFF.md](./calculator/CHECKPOINT_2026-05-14_COMPANY_INTERNAL_OPENING_LEAK_BUILDING_INPUT_SURFACE_HANDOFF.md).
  `company_internal_opening_leak_building_input_surface_plan` has
  landed. The Dynamic Calculator wall input surface now feeds the
  opening/leak field/building adapter from first-class physical fields:
  opening package, partition geometry, receiving-room volume/RT60,
  source-room volume, flanking/junction class, conservative flanking
  assumption, junction coupling length, and building output basis.
  UI-derived field input preserves `R'w 36.4` / `Dn,w 36.7` /
  `DnT,w 36.9` with `+/-8 dB`; UI-derived building input preserves
  `R'w 31.6` / `DnT,w 32.1` with `+/-10 dB`. Selection status:
  `company_internal_opening_leak_building_input_surface_landed_selected_matrix_v5_refresh`.
  Selected next action:
  `company_internal_calculation_grade_mainline_matrix_v5_refresh_after_opening_leak_building_input_surface_plan`.
  Selected next file:
  `packages/engine/src/company-internal-calculation-grade-mainline-matrix-v5-contract.test.ts`.
  Selected next label: company-internal matrix v5 refresh after
  opening/leak field/building input surface.
- Latest company-internal Matrix V5 step:
  [calculator/CHECKPOINT_2026-05-14_COMPANY_INTERNAL_MATRIX_V5_REFRESH_AFTER_OPENING_LEAK_INPUT_SURFACE_HANDOFF.md](./calculator/CHECKPOINT_2026-05-14_COMPANY_INTERNAL_MATRIX_V5_REFRESH_AFTER_OPENING_LEAK_INPUT_SURFACE_HANDOFF.md).
  `company_internal_calculation_grade_mainline_matrix_v5_refresh_after_opening_leak_building_input_surface_plan`
  has landed. Matrix V5 records opening/leak field `R'w 36.4` /
  `Dn,w 36.7` / `DnT,w 36.9` and building `R'w 31.6` / `DnT,w 32.1`
  as supported calculation-grade rows, retires the stale
  `wall.opening_leak_composite_building_boundary.unsupported` row, and
  keeps `Dn,A` / `DnT,A` unsupported until a spectrum-adapter owner
  exists. Selection status:
  `company_internal_calculation_grade_mainline_matrix_v5_refresh_after_opening_leak_building_input_surface_landed_selected_opening_leak_a_weighted_adapter_owner`.
  Selected next action:
  `company_internal_opening_leak_a_weighted_spectrum_adapter_owner_contract_plan`.
  Selected next file:
  `packages/engine/src/company-internal-opening-leak-a-weighted-spectrum-adapter-owner-contract.test.ts`.
- Latest company-internal opening/leak A-weighted owner step:
  [calculator/CHECKPOINT_2026-05-14_COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_OWNER_HANDOFF.md](./calculator/CHECKPOINT_2026-05-14_COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_OWNER_HANDOFF.md).
  `company_internal_opening_leak_a_weighted_spectrum_adapter_owner_contract_plan`
  has landed as a no-runtime owner gate. Field opening/leak remains
  `R'w 36.4` / `Dn,w 36.7` / `DnT,w 36.9`; building opening/leak
  remains `R'w 31.6` / `DnT,w 32.1`. `Dn,A` / `DnT,A` still stay
  unsupported until the formula corridor owns `frequencyBandSet`, the
  same-route spectrum curve, ISO 717 C or A-weighted adapter,
  uncertainty budget, exact A-weighted packet precedence, and lab
  `Rw` / `STC` alias guard. Selection status:
  `company_internal_opening_leak_a_weighted_spectrum_adapter_owner_contract_landed_no_runtime_selected_formula_corridor`.
  Selected next action:
  `company_internal_opening_leak_a_weighted_spectrum_adapter_formula_corridor_plan`.
  Selected next file:
  `packages/engine/src/company-internal-opening-leak-a-weighted-spectrum-adapter-formula-corridor-contract.test.ts`.
  Selected next label: opening/leak Dn,A / DnT,A spectrum-adapter formula corridor.
- Preceding company-internal Matrix V4 step:
  [calculator/CHECKPOINT_2026-05-14_COMPANY_INTERNAL_MATRIX_V4_REFRESH_AFTER_LNT50_SURFACE_PARITY_HANDOFF.md](./calculator/CHECKPOINT_2026-05-14_COMPANY_INTERNAL_MATRIX_V4_REFRESH_AFTER_LNT50_SURFACE_PARITY_HANDOFF.md).
  `company_internal_calculation_grade_mainline_matrix_v4_refresh_after_lnt50_surface_parity_plan`
  has landed and selected the opening/leak adapter owner contract.
  Selection status:
  `company_internal_calculation_grade_mainline_matrix_v4_refresh_after_lnt50_surface_parity_landed_selected_opening_leak_building_adapter_owner`.
  Selected next action, now landed:
  `company_internal_opening_leak_building_adapter_owner_contract_plan`.
  Selected next file, now landed:
  `packages/engine/src/company-internal-opening-leak-building-adapter-owner-contract.test.ts`.
  Owner contract selection status, now superseded by the runtime
  corridor:
  `company_internal_opening_leak_building_adapter_owner_contract_landed_no_runtime_selected_runtime_corridor`.
  Owner selected next action, now landed:
  `company_internal_opening_leak_building_runtime_corridor_plan`.
  Owner selected next file, now landed:
  `packages/engine/src/company-internal-opening-leak-building-runtime-corridor-contract.test.ts`.
  Runtime corridor landed with complete field `R'w 36.4` / `DnT,w 36.9`
  and complete building `R'w 31.6` / `DnT,w 32.1` through separate
  opening/leak field/building adapters. Selection status, now superseded
  by surface parity:
  `company_internal_opening_leak_building_runtime_corridor_landed_selected_surface_parity`.
  Runtime selected next action, now landed:
  `company_internal_opening_leak_building_surface_parity_plan`.
  Runtime selected next file, now landed:
  `packages/engine/src/company-internal-opening-leak-building-surface-parity-contract.test.ts`.
  Runtime selected next label, now landed:
  opening/leak field/building card/report/API parity.
- Preceding company-internal surface-parity step:
  [calculator/CHECKPOINT_2026-05-14_COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_SURFACE_PARITY_HANDOFF.md](./calculator/CHECKPOINT_2026-05-14_COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_SURFACE_PARITY_HANDOFF.md).
  `company_internal_steel_suspended_ceiling_low_frequency_lnt50_surface_parity_plan`
  has landed as a no-runtime surface parity closeout. Steel suspended-
  ceiling lab `Ln,w 51.6` / `DeltaLw 22.4` stays frozen; complete field
  context with `fieldKDb = 3`, receiving-room volume `60 m3`, and
  `CI,50-2500 = -1 dB` returns `L'n,w 54.6`, `L'nT,w 51.8`, and
  `L'nT,50 50.8`. Cards, corridor dossier, saved/server replay,
  calculator API, impact-only API, and Markdown report now carry the
  same
  `estimated_standardized_field_lpriment50_from_lprimentw_plus_ci50_2500`
  basis and `+/-7 dB` source-absent field adapter budget. ASTM `IIC` /
  `AIIC` remain unsupported. Selection status:
  `company_internal_steel_suspended_ceiling_low_frequency_lnt50_surface_parity_landed_selected_matrix_v4_refresh`.
  Selected next action:
  `company_internal_calculation_grade_mainline_matrix_v4_refresh_after_lnt50_surface_parity_plan`.
  Selected next file:
  `packages/engine/src/company-internal-calculation-grade-mainline-matrix-v4-contract.test.ts`.
  Selected next label, now landed by Matrix V4: company-internal matrix v4 refresh after steel L'nT,50 surface parity.
- Preceding company-internal Matrix V3 step:
  [calculator/CHECKPOINT_2026-05-14_COMPANY_INTERNAL_MATRIX_V3_REFRESH_HANDOFF.md](./calculator/CHECKPOINT_2026-05-14_COMPANY_INTERNAL_MATRIX_V3_REFRESH_HANDOFF.md).
  `company_internal_calculation_grade_mainline_matrix_v3_refresh_after_steel_delta_lw_surface_parity_plan`
  has landed. Matrix V3 retires
  `floor.lightweight_steel_suspended_ceiling_delta_lw.needs_input` and
  records
  `floor.lightweight_steel_suspended_ceiling_delta_lw.runtime` as
  supported lab `Ln,w 51.6` / `DeltaLw 22.4` through the
  `steel_suspended_ceiling_lower_reference` formula corridor. Selection
  status:
  `company_internal_calculation_grade_mainline_matrix_v3_refresh_after_steel_delta_lw_surface_parity_landed_selected_steel_suspended_ceiling_low_frequency_lnt50_owner`.
  Matrix V3 selected next action, now landed by the low-frequency owner:
  `company_internal_steel_suspended_ceiling_low_frequency_lnt50_owner_contract_plan`.
  Matrix V3 selected next file, now landed by the low-frequency owner:
  `packages/engine/src/company-internal-steel-suspended-ceiling-low-frequency-lnt50-owner-contract.test.ts`.
- Preceding low-frequency `L'nT,50` owner step:
  [calculator/CHECKPOINT_2026-05-14_COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_OWNER_HANDOFF.md](./calculator/CHECKPOINT_2026-05-14_COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_OWNER_HANDOFF.md).
  `company_internal_steel_suspended_ceiling_low_frequency_lnt50_owner_contract_plan`
  landed as the no-runtime owner boundary with selection status
  `company_internal_steel_suspended_ceiling_low_frequency_lnt50_owner_contract_landed_no_runtime_selected_runtime_corridor`.
  It requires explicit `lowFrequencyImpactSpectrumOrCI50_2500Owner`
  before source-absent `L'nT,50` runtime can promote. Owner contract
  file:
  `packages/engine/src/company-internal-steel-suspended-ceiling-low-frequency-lnt50-owner-contract.test.ts`.
  Owner selected next action, now landed by the runtime corridor:
  `company_internal_steel_suspended_ceiling_low_frequency_lnt50_runtime_corridor_plan`.
  Owner selected next file, now landed by the runtime corridor:
  `packages/engine/src/company-internal-steel-suspended-ceiling-low-frequency-lnt50-runtime-corridor-contract.test.ts`.
- Preceding steel surface-parity step:
  [calculator/CHECKPOINT_2026-05-14_COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_SURFACE_PARITY_HANDOFF.md](./calculator/CHECKPOINT_2026-05-14_COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_SURFACE_PARITY_HANDOFF.md).
  `company_internal_steel_suspended_ceiling_delta_lw_surface_parity_plan`
  has landed. Complete lower suspended-ceiling plus upper/reference
  package input still returns lab `Ln,w 51.6` / `DeltaLw 22.4`; cards,
  dossier, saved/server replay, calculator API, impact-only API, and
  Markdown report now show the same suspended-ceiling lower-reference
  basis and source-absent budgets. Selection status:
  `company_internal_steel_suspended_ceiling_delta_lw_surface_parity_landed_selected_matrix_v3_refresh`.
  Surface parity selected next action, now landed by Matrix V3:
  `company_internal_calculation_grade_mainline_matrix_v3_refresh_after_steel_delta_lw_surface_parity_plan`.
  Surface parity selected next file, now landed by Matrix V3:
  `packages/engine/src/company-internal-calculation-grade-mainline-matrix-v3-contract.test.ts`.
- Preceding company-internal matrix step:
  [calculator/CHECKPOINT_2026-05-14_COMPANY_INTERNAL_MATRIX_V2_REFRESH_HANDOFF.md](./calculator/CHECKPOINT_2026-05-14_COMPANY_INTERNAL_MATRIX_V2_REFRESH_HANDOFF.md).
  Preceding building reconciliation landed
  `company_internal_airborne_building_prediction_runtime_terms_owner_contract_plan`
  with selection status
  `company_internal_airborne_building_prediction_runtime_terms_owner_contract_landed_selected_matrix_v2_refresh`
  and selected
  `packages/engine/src/company-internal-calculation-grade-mainline-matrix-v2-contract.test.ts`,
  which is now landed by Matrix V2.
  `company_internal_calculation_grade_mainline_matrix_v2_refresh_plan`
  has landed. It preserves the accepted Gate AR/AS/AT building runtime,
  retires the stale building row, turns steel suspended-ceiling
  `DeltaLw` into a precise `needs_input` owner prompt, and removes the
  hidden heavy-floating `screening_fallback` matrix origin.
  Selection status:
  `company_internal_calculation_grade_mainline_matrix_v2_refresh_landed_selected_steel_suspended_ceiling_delta_lw_runtime_corridor`.
  Matrix V2 selected next action, now landed by the steel `DeltaLw`
  runtime corridor:
  `company_internal_steel_suspended_ceiling_delta_lw_runtime_corridor_plan`.
  Matrix V2 selected next file, now landed by the steel `DeltaLw`
  runtime corridor:
  `packages/engine/src/company-internal-steel-suspended-ceiling-delta-lw-runtime-corridor-contract.test.ts`.
- Preceding low-frequency runtime step:
  [calculator/CHECKPOINT_2026-05-14_COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_RUNTIME_HANDOFF.md](./calculator/CHECKPOINT_2026-05-14_COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_RUNTIME_HANDOFF.md).
  `company_internal_steel_suspended_ceiling_low_frequency_lnt50_runtime_corridor_plan`
  landed the source-absent `L'nT,50 50.8` runtime with selection status
  `company_internal_steel_suspended_ceiling_low_frequency_lnt50_runtime_corridor_landed_selected_surface_parity`.
  Runtime selected next action, now landed by surface parity:
  `company_internal_steel_suspended_ceiling_low_frequency_lnt50_surface_parity_plan`.
  Runtime selected next file, now landed by surface parity:
  `packages/engine/src/company-internal-steel-suspended-ceiling-low-frequency-lnt50-surface-parity-contract.test.ts`.
  Runtime selected next label, now landed by surface parity:
  steel suspended-ceiling L'nT,50 card/report/API parity.
- Preceding surface-parity selected next action, now landed:
  `company_internal_opening_leak_building_input_surface_plan`.
- Preceding surface-parity selected next file, now landed:
  `apps/web/features/workbench/company-internal-opening-leak-building-input-surface.test.ts`.
- Preceding surface-parity selected next label, now landed:
  opening/leak field/building input surface.
- Latest opening/leak field/building surface parity:
  [calculator/CHECKPOINT_2026-05-14_COMPANY_INTERNAL_OPENING_LEAK_BUILDING_SURFACE_PARITY_HANDOFF.md](./calculator/CHECKPOINT_2026-05-14_COMPANY_INTERNAL_OPENING_LEAK_BUILDING_SURFACE_PARITY_HANDOFF.md).
  `company_internal_opening_leak_building_surface_parity_plan`
  has landed with selection status
  `company_internal_opening_leak_building_surface_parity_landed_selected_input_surface`.
  Cards, dossiers, saved replay, API, and reports now carry the same
  source-absent field/building values and budgets without lab or
  A-weighted aliases.
- ASTM `IIC` / `AIIC` work is parked as no-runtime boundary history.
  Do not continue Gate BW unless a later active plan explicitly selects
  it again.

Parked ASTM handoff history:

- Gate BV has now landed:
  `gate_bv_personal_use_mvp_floor_impact_astm_iic_aiic_rating_curve_owner_scaffold_plan`.
- Latest checkpoint:
  [calculator/CHECKPOINT_2026-05-14_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BV_HANDOFF.md](./calculator/CHECKPOINT_2026-05-14_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BV_HANDOFF.md).
- Gate BV selection status:
  `gate_bv_personal_use_mvp_floor_impact_astm_iic_aiic_rating_curve_owner_scaffold_landed_no_runtime_selected_contour_rating_owner_gate_bw`.
- Selected next action:
  `gate_bw_personal_use_mvp_floor_impact_astm_iic_aiic_contour_rating_owner_plan`.
- Selected next file:
  `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bw-floor-impact-astm-iic-aiic-contour-rating-owner-contract.test.ts`.
- Next plain label: floor-impact ASTM IIC/AIIC contour rating owner.
- Gate BV is no-runtime. It owns the declared ASTM impact
  one-third-octave curve scaffold for lab `IIC` and field `AIIC`, but
  does not ingest standard text, source documents, or measured values and
  does not promote runtime values. Current runtime still lacks the
  executable ASTM E989 contour/rating owner, exact ASTM source
  precedence runtime owner, source-absent ASTM uncertainty, and visible
  parity. ISO `Ln,w` / `DeltaLw`, ISO field impact values,
  building-prediction metrics, and ASTM E413/STC rows must not alias to
  ASTM E989 impact ratings.
- Preceding Gate BU landed:
  `gate_bu_personal_use_mvp_floor_impact_astm_iic_aiic_rating_procedure_and_exact_source_owner_plan`.
- Preceding Gate BU checkpoint:
  [calculator/CHECKPOINT_2026-05-14_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BU_HANDOFF.md](./calculator/CHECKPOINT_2026-05-14_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BU_HANDOFF.md).
- Gate BU selection status:
  `gate_bu_personal_use_mvp_floor_impact_astm_iic_aiic_rating_procedure_exact_source_owner_closed_no_runtime_selected_rating_curve_owner_scaffold_gate_bv`.
- Gate BU selected next action:
  `gate_bv_personal_use_mvp_floor_impact_astm_iic_aiic_rating_curve_owner_scaffold_plan`.
- Gate BU selected next file:
  `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bv-floor-impact-astm-iic-aiic-rating-curve-owner-scaffold-contract.test.ts`.
- Gate BU next plain label: floor-impact ASTM IIC/AIIC rating curve owner scaffold.
- Preceding Gate BT landed:
  `gate_bt_personal_use_mvp_floor_impact_astm_iic_aiic_metric_schema_and_adapter_bridge_plan`.
- Preceding Gate BT checkpoint:
  [calculator/CHECKPOINT_2026-05-14_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BT_HANDOFF.md](./calculator/CHECKPOINT_2026-05-14_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BT_HANDOFF.md).
- Gate BT selection status:
  `gate_bt_personal_use_mvp_floor_impact_astm_iic_aiic_metric_schema_adapter_bridge_landed_no_runtime_selected_rating_procedure_exact_source_owner_gate_bu`.
- Gate BT selected next action:
  `gate_bu_personal_use_mvp_floor_impact_astm_iic_aiic_rating_procedure_and_exact_source_owner_plan`.
- Gate BT selected next file:
  `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bu-floor-impact-astm-iic-aiic-rating-procedure-and-exact-source-owner-contract.test.ts`.
- Gate BT next plain label: floor-impact ASTM IIC/AIIC rating procedure and exact-source owner.
- Preceding Gate BS landed:
  `gate_bs_personal_use_mvp_floor_impact_astm_iic_aiic_runtime_corridor_plan`.
- Preceding Gate BS checkpoint:
  [calculator/CHECKPOINT_2026-05-14_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BS_HANDOFF.md](./calculator/CHECKPOINT_2026-05-14_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BS_HANDOFF.md).
- Gate BS selection status:
  `gate_bs_personal_use_mvp_floor_impact_astm_iic_aiic_runtime_corridor_closed_no_runtime_selected_metric_schema_adapter_bridge_gate_bt`.
- Gate BS selected next action:
  `gate_bt_personal_use_mvp_floor_impact_astm_iic_aiic_metric_schema_and_adapter_bridge_plan`.
- Gate BS selected next file:
  `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bt-floor-impact-astm-iic-aiic-metric-schema-and-adapter-bridge-contract.test.ts`.
- Gate BS next plain label: floor-impact ASTM IIC/AIIC metric schema and adapter bridge.
- Preceding Gate BR landed:
  `gate_br_personal_use_mvp_floor_impact_astm_iic_aiic_adapter_contract_plan`.
- Preceding Gate BR checkpoint:
  [calculator/CHECKPOINT_2026-05-14_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BR_HANDOFF.md](./calculator/CHECKPOINT_2026-05-14_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BR_HANDOFF.md).
- Gate BR selection status:
  `gate_br_personal_use_mvp_floor_impact_astm_iic_aiic_adapter_contract_landed_no_runtime_selected_runtime_corridor_gate_bs`.
- Selected next action:
  `gate_bs_personal_use_mvp_floor_impact_astm_iic_aiic_runtime_corridor_plan`.
- Selected next file:
  `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bs-floor-impact-astm-iic-aiic-runtime-corridor-contract.test.ts`.
- Next plain label: floor-impact ASTM IIC/AIIC runtime corridor.
- Gate BR is no-runtime. It defines the ASTM lab `IIC` and field
  `AIIC` owner contract, keeps complete ISO impact formulas unsupported
  for ASTM outputs, and records that ISO `Ln,w` / `DeltaLw`, field
  `L'n,w` / `L'nT,w`, and building-prediction metrics must not alias to
  ASTM ratings.
- Preceding Gate BQ landed:
  `gate_bq_personal_use_mvp_coverage_matrix_refresh_after_reinforced_concrete_cleanup_plan`.
- Preceding Gate BQ checkpoint:
  [calculator/CHECKPOINT_2026-05-14_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BQ_HANDOFF.md](./calculator/CHECKPOINT_2026-05-14_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BQ_HANDOFF.md).
- Gate BQ selection status:
  `gate_bq_personal_use_mvp_coverage_matrix_refresh_after_reinforced_concrete_cleanup_landed_no_runtime_selected_floor_impact_astm_iic_aiic_adapter_gate_br`.
- Gate BQ selected next action:
  `gate_br_personal_use_mvp_floor_impact_astm_iic_aiic_adapter_contract_plan`.
- Gate BQ selected next file:
  `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-br-floor-impact-astm-iic-aiic-adapter-contract.test.ts`.
- Gate BQ next plain label: floor-impact ASTM IIC/AIIC adapter contract.
- Gate BQ refreshed the executable matrix after the reinforced-concrete
  cleanup. The old low-confidence coverage-gap row is gone; complete
  owner input stays lab `Ln,w 58.1` / `DeltaLw 13.7` through
  `predictor_heavy_combined_upper_lower_floor_iso12354_annexc_estimate`,
  partial owner input stays `needs_input`, exact source rows still win,
  and field/building/ASTM boundaries remain non-alias boundaries.
- Preceding Gate BP has now landed:
  `gate_bp_personal_use_mvp_reinforced_concrete_cleanup_surface_parity_plan`.
- Preceding Gate BP checkpoint:
  [calculator/CHECKPOINT_2026-05-14_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BP_HANDOFF.md](./calculator/CHECKPOINT_2026-05-14_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BP_HANDOFF.md).
- Gate BP selection status:
  `gate_bp_personal_use_mvp_reinforced_concrete_cleanup_surface_parity_landed_selected_matrix_refresh_gate_bq`.
- Selected next action:
  `gate_bq_personal_use_mvp_coverage_matrix_refresh_after_reinforced_concrete_cleanup_plan`.
- Selected next file:
  `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bq-coverage-matrix-refresh-after-reinforced-concrete-cleanup-contract.test.ts`.
- Next plain label: coverage matrix refresh after reinforced-concrete cleanup.
- Gate BP keeps Gate BO runtime values frozen while making the
  reinforced-concrete cleanup visible across cards, trace, report,
  saved replay, calculator API, and impact-only API. Complete owner
  input returns lab `Ln,w 58.1` / `DeltaLw 13.7` through
  `predictor_heavy_combined_upper_lower_floor_iso12354_annexc_estimate`;
  incomplete owner input shows impact cards as `needs_input` with named
  physical fields instead of a low-confidence result.
- Preceding Gate BO landed:
  `gate_bo_personal_use_mvp_reinforced_concrete_low_confidence_cleanup_plan`;
  selection status:
  `gate_bo_personal_use_mvp_reinforced_concrete_low_confidence_cleanup_landed_selected_surface_parity_gate_bp`;
  selected next action:
  `gate_bp_personal_use_mvp_reinforced_concrete_cleanup_surface_parity_plan`;
  selected next file:
  `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bp-reinforced-concrete-cleanup-surface-parity-contract.test.ts`.
- Preceding Gate BN selected Gate BO:
  `gate_bn_personal_use_mvp_coverage_matrix_refresh_after_steel_suspended_ceiling_plan`;
  selection status:
  `gate_bn_personal_use_mvp_coverage_matrix_refresh_after_steel_suspended_ceiling_landed_no_runtime_selected_reinforced_concrete_low_confidence_cleanup_gate_bo`;
  selected next action:
  `gate_bo_personal_use_mvp_reinforced_concrete_low_confidence_cleanup_plan`;
  selected next file:
  `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bo-reinforced-concrete-low-confidence-cleanup-contract.test.ts`.
  Next plain label: reinforced-concrete low-confidence cleanup.
  Gate BN pinned steel suspended-ceiling `Ln,w 62.2`.

## Supporting Reads

- [calculator/CHECKPOINT_2026-04-23_SERVER_BACKED_PROJECT_STORAGE_HANDOFF.md](./calculator/CHECKPOINT_2026-04-23_SERVER_BACKED_PROJECT_STORAGE_HANDOFF.md)
  — productization closeout: server-backed project storage v1 closed.
- [calculator/CHECKPOINT_2026-04-23_BROAD_REVALIDATION_CALCULATOR_REFOCUS_HANDOFF.md](./calculator/CHECKPOINT_2026-04-23_BROAD_REVALIDATION_CALCULATOR_REFOCUS_HANDOFF.md)
  — historical broad handoff: broad validation green and calculator
  accuracy/coverage refocus selected.
- [calculator/CHECKPOINT_2026-05-12_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AU_HANDOFF.md](./calculator/CHECKPOINT_2026-05-12_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AU_HANDOFF.md)
  — company-internal daily-use ready handoff: Gate AU closed and
  selected Gate AV post-release accuracy/adapters roadmap.
- [calculator/CHECKPOINT_2026-05-13_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AV_HANDOFF.md](./calculator/CHECKPOINT_2026-05-13_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AV_HANDOFF.md)
  — post-release roadmap handoff: Gate AV landed no-runtime and selected
  Gate AW source-absent solver gap cartography. Landed action:
  `gate_av_personal_use_mvp_post_release_accuracy_and_adapter_roadmap_plan`;
  selection status:
  `gate_av_personal_use_mvp_post_release_accuracy_and_adapter_roadmap_landed_no_runtime_selected_source_absent_solver_gap_cartography_gate_aw`;
  selected next action:
  `gate_aw_personal_use_mvp_source_absent_solver_gap_cartography_plan`;
  selected next file:
  `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-aw-source-absent-solver-gap-cartography-contract.test.ts`.
- [calculator/CHECKPOINT_2026-05-13_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AW_HANDOFF.md](./calculator/CHECKPOINT_2026-05-13_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AW_HANDOFF.md)
  — source-absent cartography handoff: Gate AW landed no-runtime source-absent
  solver gap cartography and selected Gate AX advanced wall source-absent solver contract.
  Landed action:
  `gate_aw_personal_use_mvp_source_absent_solver_gap_cartography_plan`;
  selection status:
  `gate_aw_personal_use_mvp_source_absent_solver_gap_cartography_landed_no_runtime_selected_advanced_wall_source_absent_solver_contract_gate_ax`;
  selected next action:
  `gate_ax_personal_use_mvp_advanced_wall_source_absent_solver_contract_plan`;
  selected next file:
  `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ax-advanced-wall-source-absent-solver-contract.test.ts`.
- [calculator/CHECKPOINT_2026-05-13_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AX_HANDOFF.md](./calculator/CHECKPOINT_2026-05-13_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AX_HANDOFF.md)
  — advanced wall contract handoff: Gate AX landed no-runtime advanced wall source-absent solver contract
  and selected Gate AY runtime corridor. Landed action:
  `gate_ax_personal_use_mvp_advanced_wall_source_absent_solver_contract_plan`;
  selection status:
  `gate_ax_personal_use_mvp_advanced_wall_source_absent_solver_contract_landed_no_runtime_selected_runtime_corridor_gate_ay`;
  selected next action:
  `gate_ay_personal_use_mvp_advanced_wall_source_absent_solver_runtime_corridor_plan`;
  selected next file:
  `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ay-advanced-wall-source-absent-solver-runtime-corridor-contract.test.ts`.
- [calculator/CHECKPOINT_2026-05-13_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AY_HANDOFF.md](./calculator/CHECKPOINT_2026-05-13_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AY_HANDOFF.md)
  — advanced wall runtime handoff: Gate AY landed the advanced wall
  source-absent solver runtime corridor and selected Gate AZ input
  surface. Landed action:
  `gate_ay_personal_use_mvp_advanced_wall_source_absent_solver_runtime_corridor_plan`;
  selection status:
  `gate_ay_personal_use_mvp_advanced_wall_source_absent_solver_runtime_corridor_landed_selected_input_surface_gate_az`;
  selected next action:
  `gate_az_personal_use_mvp_advanced_wall_source_absent_solver_input_surface_plan`;
  selected next file:
  `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-az-advanced-wall-source-absent-solver-input-surface-contract.test.ts`.
  Short label: advanced wall source-absent solver runtime corridor.
- [calculator/CHECKPOINT_2026-05-13_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AZ_HANDOFF.md](./calculator/CHECKPOINT_2026-05-13_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AZ_HANDOFF.md)
  — advanced wall input-surface handoff: Gate AZ landed the advanced wall
  source-absent solver input surface and selected Gate BA floor-impact
  source-absent solver gap cartography. Landed action:
  `gate_az_personal_use_mvp_advanced_wall_source_absent_solver_input_surface_plan`;
  selection status:
  `gate_az_personal_use_mvp_advanced_wall_source_absent_solver_input_surface_landed_selected_floor_impact_source_absent_solver_gap_cartography_gate_ba`;
  selected next action:
  `gate_ba_personal_use_mvp_floor_impact_source_absent_solver_gap_cartography_plan`;
  selected next file:
  `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ba-floor-impact-source-absent-solver-gap-cartography-contract.test.ts`.
  Short label: advanced wall source-absent solver input surface.
- [calculator/CHECKPOINT_2026-05-13_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BA_HANDOFF.md](./calculator/CHECKPOINT_2026-05-13_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BA_HANDOFF.md)
  — prior calculator handoff: Gate BA landed no-runtime floor-impact
  source-absent solver gap cartography and selected Gate BB
  floor-impact source-absent input contract. Landed action:
  `gate_ba_personal_use_mvp_floor_impact_source_absent_solver_gap_cartography_plan`;
  selection status:
  `gate_ba_personal_use_mvp_floor_impact_source_absent_solver_gap_cartography_landed_no_runtime_selected_floor_impact_source_absent_input_contract_gate_bb`;
  selected next action:
  `gate_bb_personal_use_mvp_floor_impact_source_absent_input_contract_plan`;
  selected next file:
  `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bb-floor-impact-source-absent-input-contract.test.ts`.
  Short label: floor-impact source-absent solver gap cartography.
- [calculator/CHECKPOINT_2026-05-13_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BB_HANDOFF.md](./calculator/CHECKPOINT_2026-05-13_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BB_HANDOFF.md)
  — prior calculator handoff: Gate BB landed no-runtime
  floor-impact source-absent input contract and selected Gate BC
  floor-impact source-absent formula corridor. Landed action:
  `gate_bb_personal_use_mvp_floor_impact_source_absent_input_contract_plan`;
  selection status:
  `gate_bb_personal_use_mvp_floor_impact_source_absent_input_contract_landed_no_runtime_selected_formula_corridor_gate_bc`;
  selected next action:
  `gate_bc_personal_use_mvp_floor_impact_source_absent_formula_corridor_plan`;
  selected next file:
  `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bc-floor-impact-source-absent-formula-corridor-contract.test.ts`.
  Short label: floor-impact source-absent input contract.
- [calculator/CHECKPOINT_2026-05-13_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BC_HANDOFF.md](./calculator/CHECKPOINT_2026-05-13_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BC_HANDOFF.md)
  — prior calculator handoff: Gate BC landed no-runtime
  floor-impact source-absent formula corridor and selected Gate BD
  floor-impact source-absent runtime corridor. Landed action:
  `gate_bc_personal_use_mvp_floor_impact_source_absent_formula_corridor_plan`;
  selection status:
  `gate_bc_personal_use_mvp_floor_impact_source_absent_formula_corridor_landed_no_runtime_selected_runtime_corridor_gate_bd`;
  selected next action:
  `gate_bd_personal_use_mvp_floor_impact_source_absent_runtime_corridor_plan`;
  selected next file:
  `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bd-floor-impact-source-absent-runtime-corridor-contract.test.ts`.
  Short label: floor-impact source-absent formula corridor.
- [calculator/CHECKPOINT_2026-05-13_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BD_HANDOFF.md](./calculator/CHECKPOINT_2026-05-13_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BD_HANDOFF.md)
  — prior calculator handoff: Gate BD landed the floor-impact
  source-absent runtime corridor and selected Gate BE surface parity.
  Landed action:
  `gate_bd_personal_use_mvp_floor_impact_source_absent_runtime_corridor_plan`;
  selection status:
  `gate_bd_personal_use_mvp_floor_impact_source_absent_runtime_corridor_landed_selected_surface_parity_gate_be`;
  selected next action:
  `gate_be_personal_use_mvp_floor_impact_source_absent_surface_parity_plan`;
  selected next file:
  `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-be-floor-impact-source-absent-surface-parity-contract.test.ts`.
  Complete heavy-concrete combined input now returns `Ln,w 44.4` /
  `DeltaLw 30.1` through
  `predictor_heavy_combined_upper_lower_floor_iso12354_annexc_estimate`
  with `+/-6.5 dB` / `+/-5.5 dB` not-measured budgets. Short label:
  floor-impact source-absent runtime corridor. Next plain label:
  floor-impact source-absent surface parity. Validation passed on
  2026-05-13 with focused Gate BD, BA-BD continuity, impact regression,
  engine typecheck/build, `pnpm calculator:gate:current`, and
  `git diff --check`.
- [calculator/CHECKPOINT_2026-05-14_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BI_HANDOFF.md](./calculator/CHECKPOINT_2026-05-14_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BI_HANDOFF.md)
  — prior calculator handoff: Gate BI landed no-runtime
  floor-impact field/building adapter ownership and selected the
  runtime-producing Gate BJ corridor. Landed action:
  `gate_bi_personal_use_mvp_floor_impact_field_building_adapter_contract_plan`;
  selection status:
  `gate_bi_personal_use_mvp_floor_impact_field_building_adapter_contract_landed_no_runtime_selected_field_building_runtime_corridor_gate_bj`;
  selected next action:
  `gate_bj_personal_use_mvp_floor_impact_field_building_runtime_corridor_plan`;
  selected next file:
  `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bj-floor-impact-field-building-runtime-corridor-contract.test.ts`.
  Next plain label: floor-impact field/building runtime corridor. Gate
  BI keeps lab and field values unchanged, keeps `IIC` / `AIIC`
  unsupported, and records the company-internal calculation-grade bar:
  common complete-input scenarios should not end on live
  low-confidence/screening final answers.
- [calculator/CHECKPOINT_2026-05-14_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BJ_HANDOFF.md](./calculator/CHECKPOINT_2026-05-14_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BJ_HANDOFF.md)
  — prior calculator handoff: Gate BJ landed the floor-impact
  field/building runtime corridor and selected Gate BK steel-floor
  low-confidence fallback cleanup. Landed action:
  `gate_bj_personal_use_mvp_floor_impact_field_building_runtime_corridor_plan`;
  selection status:
  `gate_bj_personal_use_mvp_floor_impact_field_building_runtime_corridor_landed_selected_steel_floor_low_confidence_cleanup_gate_bk`;
  selected next action:
  `gate_bk_personal_use_mvp_steel_floor_low_confidence_fallback_cleanup_plan`;
  selected next file:
  `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bk-steel-floor-low-confidence-fallback-cleanup-contract.test.ts`.
  Gate BJ pins field-volume `L'n,w 52.3` / `L'nT,w 49.9`, building
  direct+flanking `L'nT,w 52.4`, direct+flanking medium confidence, and
  `source_absent_field_building_adapter_error_budget`; source-absent
  `L'nT,50` stays blocked until a low-frequency owner exists. Next plain
  label: steel-floor low-confidence fallback cleanup.
- [calculator/CHECKPOINT_2026-05-14_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BK_HANDOFF.md](./calculator/CHECKPOINT_2026-05-14_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BK_HANDOFF.md)
  — latest calculator handoff: Gate BK landed the steel-floor
  low-confidence fallback cleanup and selected Gate BL steel-floor
  suspended-ceiling input surface. Landed action:
  `gate_bk_personal_use_mvp_steel_floor_low_confidence_fallback_cleanup_plan`;
  selection status:
  `gate_bk_personal_use_mvp_steel_floor_low_confidence_fallback_cleanup_landed_selected_suspended_ceiling_input_surface_gate_bl`;
  selected next action:
  `gate_bl_personal_use_mvp_steel_floor_suspended_ceiling_input_surface_plan`;
  selected next file:
  `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bl-steel-floor-suspended-ceiling-input-surface-contract.test.ts`.
  Gate BK adds
  `predictor_lightweight_steel_suspended_ceiling_corridor_estimate`
  for complete steel suspended-ceiling-only lab `Ln,w 62.2` with
  `+/-6 dB` source-absent budget, while Gate AD steel upper/lower
  `Ln,w 55.6` / `DeltaLw 22.4` stays frozen. Next plain label:
  steel-floor suspended-ceiling input surface.
- [calculator/CHECKPOINT_2026-05-13_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BH_HANDOFF.md](./calculator/CHECKPOINT_2026-05-13_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BH_HANDOFF.md)
  — prior calculator handoff: Gate BH landed no-runtime
  floor-impact source-absent coverage matrix refresh after the
  `Heavy concrete combined input surface`. Landed action:
  `gate_bh_personal_use_mvp_floor_impact_source_absent_coverage_matrix_refresh_plan`;
  selection status:
  `gate_bh_personal_use_mvp_floor_impact_source_absent_coverage_matrix_refresh_landed_no_runtime_selected_field_building_adapter_gate_bi`;
  selected next action:
  `gate_bi_personal_use_mvp_floor_impact_field_building_adapter_contract_plan`;
  selected next file:
  `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bi-floor-impact-field-building-adapter-contract.test.ts`.
  The refreshed executable matrix has 21 floor rows and adds Gate BF/BG
  combined-heavy rows plus `floor.building_impact.prediction_adapter_boundary`.
  Complete and safe-reordered combined-heavy input remains lab
  `Ln,w 44.4` / `DeltaLw 30.1` with the same source-absent
  not-measured budgets. Short label: floor-impact source-absent coverage
  matrix refresh. Gate BI plain label: floor-impact field/building adapter contract.
  Validation passed on 2026-05-13 with focused Gate BH, Gate BG/BH
  continuity, engine typecheck, `pnpm calculator:gate:current`, full
  `pnpm check`, and whitespace guard clean.
- [calculator/CHECKPOINT_2026-05-13_POST_GATE_BH_PLAN_AND_TEST_REVIEW.md](./calculator/CHECKPOINT_2026-05-13_POST_GATE_BH_PLAN_AND_TEST_REVIEW.md)
  — post-Gate-BH checkpoint review: docs and implementation still agree
  that Gate BI is the next floor-impact field/building adapter contract.
  It records the remaining owner/input gaps, keeps lab values and
  budgets frozen, keeps building-impact runtime unsupported, and defines
  the next Gate BI execution order. Validation passed with focused Gate
  BH, `pnpm calculator:gate:current`, and `git diff --check`.
- [calculator/CHECKPOINT_2026-05-13_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BG_HANDOFF.md](./calculator/CHECKPOINT_2026-05-13_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BG_HANDOFF.md)
  — prior calculator handoff: Gate BG landed no-runtime
  floor-impact source-absent post-input-surface revalidation after the
  `Heavy concrete combined input surface` and selected Gate BH
  coverage matrix refresh. Landed action:
  `gate_bg_personal_use_mvp_floor_impact_source_absent_post_input_surface_revalidation_plan`;
  selection status:
  `gate_bg_personal_use_mvp_floor_impact_source_absent_post_input_surface_revalidation_landed_no_runtime_selected_coverage_matrix_refresh_gate_bh`;
  selected next action:
  `gate_bh_personal_use_mvp_floor_impact_source_absent_coverage_matrix_refresh_plan`;
  selected next file:
  `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bh-floor-impact-source-absent-coverage-matrix-refresh-contract.test.ts`.
  The revalidated runtime remains lab `Ln,w 44.4` / `DeltaLw 30.1`
  through the Gate BD predictor with the same source-absent
  not-measured budgets. Safe reorders, missing load basis, duplicate
  concrete base ownership, exact source precedence, and field/ASTM
  boundaries are covered. Short label: floor-impact source-absent
  post-input-surface revalidation. Next plain label:
  floor-impact source-absent coverage matrix refresh. Validation passed
  on 2026-05-13 with focused Gate BG, Gate BF/BG continuity, engine
  typecheck, `pnpm calculator:gate:current`, full `pnpm check`, and
  `git diff --check`.
- [calculator/CHECKPOINT_2026-05-13_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BF_HANDOFF.md](./calculator/CHECKPOINT_2026-05-13_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BF_HANDOFF.md)
  — prior calculator handoff: Gate BF landed the floor-impact
  source-absent input surface for the `Heavy concrete combined input surface`
  and selected Gate BG post-input-surface revalidation. Landed action:
  `gate_bf_personal_use_mvp_floor_impact_source_absent_input_surface_plan`;
  selection status:
  `gate_bf_personal_use_mvp_floor_impact_source_absent_input_surface_landed_selected_revalidation_gate_bg`;
  selected next action:
  `gate_bg_personal_use_mvp_floor_impact_source_absent_post_input_surface_revalidation_plan`;
  selected next file:
  `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bg-floor-impact-source-absent-post-input-surface-revalidation-contract.test.ts`.
  Complete UI-derived heavy-concrete combined input now returns the
  same lab `Ln,w 44.4` / `DeltaLw 30.1` through the Gate BD runtime
  corridor with the same source-absent not-measured budgets. Partial
  fields stay `needs_input`, ambiguous concrete base ownership is
  unsafe, exact source precedence remains first, and field/building/ASTM
  aliases remain blocked. Short label: floor-impact source-absent input
  surface. Next plain label: floor-impact source-absent post-input-surface
  revalidation.
- [calculator/CHECKPOINT_2026-05-13_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BE_HANDOFF.md](./calculator/CHECKPOINT_2026-05-13_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BE_HANDOFF.md)
  — prior calculator handoff: Gate BE landed the floor-impact
  source-absent surface parity for the `Heavy concrete combined formula corridor`
  and selected Gate BF input surface. Landed action:
  `gate_be_personal_use_mvp_floor_impact_source_absent_surface_parity_plan`;
  selection status:
  `gate_be_personal_use_mvp_floor_impact_source_absent_surface_parity_landed_selected_input_surface_gate_bf`;
  selected next action:
  `gate_bf_personal_use_mvp_floor_impact_source_absent_input_surface_plan`;
  selected next file:
  `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bf-floor-impact-source-absent-input-surface-contract.test.ts`.
  Runtime stays lab `Ln,w 44.4` / `DeltaLw 30.1` with the same
  source-absent not-measured budgets. Short label: floor-impact
  source-absent surface parity. Next plain label: floor-impact
  source-absent input surface. Validation passed on 2026-05-13 with
  focused Gate BE, Gate BD/BE continuity, focused web surface parity,
  engine/web typecheck, `pnpm calculator:gate:current`, full
  `pnpm check`, and `git diff --check`.
- [calculator/CHECKPOINT_2026-05-13_POST_GATE_BD_FULL_REVALIDATION_AND_GATE_BE_PLAN_HANDOFF.md](./calculator/CHECKPOINT_2026-05-13_POST_GATE_BD_FULL_REVALIDATION_AND_GATE_BE_PLAN_HANDOFF.md)
  — latest broad revalidation and planning checkpoint: post-Gate BD
  `pnpm check` passed with lint, typecheck, engine 522 files / 3103
  tests, web 182 files / 985 passed + 18 skipped, and build 5/5 after
  two lint-only cleanups. It confirms Gate BE surface parity is the
  first next implementation step.
- [calculator/NEXT_IMPLEMENTATION_PLAN.md](./calculator/NEXT_IMPLEMENTATION_PLAN.md)
  — active calculator tactical plan; currently Gate BI floor-impact
  field/building adapter contract, revalidated by the post-Gate-BH
  checkpoint.
- [calculator/SLICE_PERSONAL_USE_MVP_GATE_AV_POST_RELEASE_ACCURACY_AND_ADAPTER_ROADMAP_PLAN.md](./calculator/SLICE_PERSONAL_USE_MVP_GATE_AV_POST_RELEASE_ACCURACY_AND_ADAPTER_ROADMAP_PLAN.md)
  — Gate AV analysis slice: no-runtime post-release roadmap,
  source-absent solver gap cartography selection, and ranked next
  accuracy/adapters work.
- [calculator/CHECKPOINT_2026-04-23_TEAM_ACCESS_MODEL_HANDOFF.md](./calculator/CHECKPOINT_2026-04-23_TEAM_ACCESS_MODEL_HANDOFF.md)
  — productization closeout: team-access policy model closed.
- [calculator/CHECKPOINT_2026-04-23_AUTH_SESSION_HARDENING_HANDOFF.md](./calculator/CHECKPOINT_2026-04-23_AUTH_SESSION_HARDENING_HANDOFF.md)
  — productization closeout: auth-session hardening closed.
- [calculator/CHECKPOINT_2026-04-23_PROJECT_ACCESS_AUTHORIZATION_HANDOFF.md](./calculator/CHECKPOINT_2026-04-23_PROJECT_ACCESS_AUTHORIZATION_HANDOFF.md)
  — productization closeout: project-access authorization closed.
- [calculator/CHECKPOINT_2026-04-23_FINAL_AUDIT_HANDOFF.md](./calculator/CHECKPOINT_2026-04-23_FINAL_AUDIT_HANDOFF.md)
  — latest calculator closeout: final audit closed and
  productization handoff opened.
- [calculator/POST_CALCULATOR_PRODUCTIZATION_ROADMAP.md](./calculator/POST_CALCULATOR_PRODUCTIZATION_ROADMAP.md)
  — productization roadmap; route integration is deferred while the
  calculator accuracy/coverage slice is active.
- [calculator/SLICE_WALL_FORMULA_FAMILY_WIDENING_PLAN.md](./calculator/SLICE_WALL_FORMULA_FAMILY_WIDENING_PLAN.md)
  — closed calculator accuracy/coverage re-entry plan.
- [calculator/SYSTEM_MAP.md](./calculator/SYSTEM_MAP.md) —
  end-to-end system model, runtime boundaries, persistence
  posture, test surface map.
- [calculator/CALCULATION_MODEL_AND_VALIDATION.md](./calculator/CALCULATION_MODEL_AND_VALIDATION.md)
  — answer-origin and evidence-tier composition.
- [calculator/SOURCE_GAP_LEDGER.md](./calculator/SOURCE_GAP_LEDGER.md)
  — source-backed widening / tightening / deferred-family
  ledger.
- [calculator/DYNAMIC_AIRBORNE_CARTOGRAPHY.md](./calculator/DYNAMIC_AIRBORNE_CARTOGRAPHY.md)
  — split refactor blueprint (v1 landed, v2 composer-injection
  follow-up deferred).
- [archive/handoffs/SLICE_WALL_CORRIDOR_SURFACE_VALUE_PINNING_PLAN.md](./archive/handoffs/SLICE_WALL_CORRIDOR_SURFACE_VALUE_PINNING_PLAN.md)
  — tactical plan for master-plan step 7b (closed
  2026-04-22). Reference doc for future agents auditing the
  wall corridor surface or the ~160-cell VALUE-pin matrix
  discipline.
- [archive/handoffs/SLICE_MIXED_FLOOR_WALL_EDGE_CASE_HARDENING_PLAN.md](./archive/handoffs/SLICE_MIXED_FLOOR_WALL_EDGE_CASE_HARDENING_PLAN.md)
  — tactical plan for master-plan step 7 (closed 2026-04-22).
  Reference doc for future agents investigating the same-
  material-split fixes (F1/F2) and the cross-mode torture
  matrix authoring pattern.
- [archive/handoffs/SLICE_GOOD_CALCULATOR_FINAL_AUDIT_PLAN.md](./archive/handoffs/SLICE_GOOD_CALCULATOR_FINAL_AUDIT_PLAN.md)
  — tactical plan for master-plan step 8 (closed 2026-04-23).
- [foundation/README.md](./foundation/README.md) — repo-level
  direction + rules.
- [imports/README.md](./imports/README.md) — upstream import
  workflow.

## Directory Layout

```text
docs/
  calculator/   living reference docs + latest checkpoint
  foundation/   long-lived project direction + repo rules
  imports/      upstream import notes + helper commands
  archive/      dated status, handoffs, closed-slice plans,
                historical analysis
```

If a file under `docs/archive/` disagrees with a living doc
under `docs/calculator/` or `docs/foundation/`, the living doc
wins.

## Fast Paths

- "Where do I resume implementation now?" →
  [calculator/CHECKPOINT_2026-05-14_COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_RUNTIME_HANDOFF.md](./calculator/CHECKPOINT_2026-05-14_COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_RUNTIME_HANDOFF.md)
  → [calculator/NEXT_IMPLEMENTATION_PLAN.md](./calculator/NEXT_IMPLEMENTATION_PLAN.md)
  → `packages/engine/src/company-internal-steel-suspended-ceiling-low-frequency-lnt50-surface-parity-contract.test.ts`.
- "What is stable right now?" →
  [calculator/CURRENT_STATE.md](./calculator/CURRENT_STATE.md)
  → [calculator/SYSTEM_MAP.md](./calculator/SYSTEM_MAP.md)
  → [calculator/CALCULATION_MODEL_AND_VALIDATION.md](./calculator/CALCULATION_MODEL_AND_VALIDATION.md).
- "What should be implemented next?" →
  [calculator/NEXT_IMPLEMENTATION_PLAN.md](./calculator/NEXT_IMPLEMENTATION_PLAN.md)
  → [calculator/MASTER_PLAN.md](./calculator/MASTER_PLAN.md) §3
  state grid + §4 master sequence.
- "What was the session narrative?" →
  [calculator/CHECKPOINT_2026-04-23_BROAD_REVALIDATION_CALCULATOR_REFOCUS_HANDOFF.md](./calculator/CHECKPOINT_2026-04-23_BROAD_REVALIDATION_CALCULATOR_REFOCUS_HANDOFF.md).

## Status Reading Rule

- Use `CURRENT_STATE.md` for "what is stable right now".
- Use `NEXT_IMPLEMENTATION_PLAN.md` for "what exactly should be
  implemented next".
- Use `calculator/CHECKPOINT_2026-05-14_COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_RUNTIME_HANDOFF.md`
  for the most recent calculator session narrative.
- Use older checkpoints under `docs/archive/handoffs/` only when
  you need the historical context that predates the living
  triangle.

## Historical Notes

Use [archive/README.md](./archive/README.md) for the dated
status timeline, handoffs, closed-slice plans, and analysis
index.
