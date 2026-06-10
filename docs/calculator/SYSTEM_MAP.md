# System Map

Last reviewed: 2026-06-10

Document role:

- explain what the acoustic calculator product actually is today
- map the user flow to the real runtime and file boundaries
- separate engine truth, UI truth, API glue, persistence, and test surfaces
- give future agents one place to answer “how does the system work?” before
  changing solver, workbench, or docs

Use this together with the calculator source-of-truth chain:

- [CALCULATOR_SOURCE_OF_TRUTH.md](./CALCULATOR_SOURCE_OF_TRUTH.md)
  — first authority for product goal, current status, and next-slice
  selection
- [../../AGENTS.md](../../AGENTS.md) — repository-level calculator
  authority order
- [USABLE_V1_EXECUTION_PLAN.md](./USABLE_V1_EXECUTION_PLAN.md)
  — closed company-internal usable V1 acceptance contract
- [CHECKPOINT_2026-06-08_DOUBLE_LEAF_ROUTE_INPUT_BOUNDARY_CHECKPOINT.md](./CHECKPOINT_2026-06-08_DOUBLE_LEAF_ROUTE_INPUT_BOUNDARY_CHECKPOINT.md)
  — latest docs/implementation/test reconciliation after the
  post-Gate-ET double-leaf route-input boundary fix; also records the
  thick `gypsum_board` vs `lined_massive_wall` ambiguity; Gate EU has
  since landed
- [CHECKPOINT_2026-06-08_GATE_ET_BOUNDARY_HANDOFF.md](./CHECKPOINT_2026-06-08_GATE_ET_BOUNDARY_HANDOFF.md)
  — Gate ET boundary closeout; Gate EM/EN/EO/EP/EQ/ER/ES/ET evidence is
  focused-green, and Gate EU has since landed
- [POST_V1_CALCULATOR_CAPABILITY_PLAN_2026-05-25.md](./POST_V1_CALCULATOR_CAPABILITY_PLAN_2026-05-25.md)
  — selected post-V1 capability plan; the chain has advanced past
  Gate FF, post double-leaf/framed revalidation, and compatible
  anchor-delta building `Dn,A` owner
- [POST_V1_GATE_FE_FF_CURRENT_FORMULA_SCOPE_ACCURACY_LEDGER_PLAN_2026-06-09.md](./POST_V1_GATE_FE_FF_CURRENT_FORMULA_SCOPE_ACCURACY_LEDGER_PLAN_2026-06-09.md)
  — landed Gate FE numeric coverage/accuracy rerank, landed Gate FF
  current formula scope/accuracy ledger, and historical post
  double-leaf/framed coverage revalidation selection
- [POST_V1_GATE_FD_FE_FLOOR_RAW_BARE_FLOATING_HOLDOUT_CLOSEOUT_PLAN_2026-06-09.md](./POST_V1_GATE_FD_FE_FLOOR_RAW_BARE_FLOATING_HOLDOUT_CLOSEOUT_PLAN_2026-06-09.md)
  — landed Gate FD floor raw-bare/floating holdout owner rejection and
  selected Gate FE numeric coverage/accuracy rerank
- [POST_V1_GATE_FC_FD_FLOOR_RAW_BARE_FLOATING_HOLDOUT_PLAN_2026-06-09.md](./POST_V1_GATE_FC_FD_FLOOR_RAW_BARE_FLOATING_HOLDOUT_PLAN_2026-06-09.md)
  — landed Gate FC numeric coverage/accuracy rerank and selected Gate
  FD floor raw-bare/floating holdout prerequisite
- [POST_V1_GATE_FB_FC_OPENING_LEAK_COMMON_WALL_OWNER_CLOSEOUT_AND_NEXT_NUMERIC_GAP_PLAN_2026-06-09.md](./POST_V1_GATE_FB_FC_OPENING_LEAK_COMMON_WALL_OWNER_CLOSEOUT_AND_NEXT_NUMERIC_GAP_PLAN_2026-06-09.md)
  — landed Gate FB owner rejection and selected Gate FC numeric
  coverage/accuracy rerank
- [POST_V1_GATE_FA_FB_OPENING_LEAK_COMMON_WALL_RESIDUAL_OWNER_PLAN_2026-06-09.md](./POST_V1_GATE_FA_FB_OPENING_LEAK_COMMON_WALL_RESIDUAL_OWNER_PLAN_2026-06-09.md)
  — landed Gate FA current coverage/accuracy gap ledger and selected
  Gate FB opening/leak common wall residual owner proof
- [POST_V1_GATE_EZ_FA_CURRENT_COVERAGE_ACCURACY_GAP_LEDGER_PLAN_2026-06-09.md](./POST_V1_GATE_EZ_FA_CURRENT_COVERAGE_ACCURACY_GAP_LEDGER_PLAN_2026-06-09.md)
  — landed Gate EZ numeric rerank and selected Gate FA current
  coverage/accuracy gap ledger
- [POST_V1_GATE_EY_EZ_HEAVY_CORE_LINED_MASSIVE_TARGETED_EVIDENCE_CLOSEOUT_PLAN_2026-06-09.md](./POST_V1_GATE_EY_EZ_HEAVY_CORE_LINED_MASSIVE_TARGETED_EVIDENCE_CLOSEOUT_PLAN_2026-06-09.md)
  — landed Gate EY targeted evidence closeout and selected Gate EZ
  rerank
- [POST_V1_GATE_EX_EY_HEAVY_CORE_LINED_MASSIVE_TARGETED_EVIDENCE_PLAN_2026-06-09.md](./POST_V1_GATE_EX_EY_HEAVY_CORE_LINED_MASSIVE_TARGETED_EVIDENCE_PLAN_2026-06-09.md)
  — landed Gate EX numeric rerank and selected Gate EY targeted evidence
  action
- [POST_V1_GATE_EV_EW_HEAVY_CORE_LINED_MASSIVE_CALIBRATION_OWNER_PLAN_2026-06-09.md](./POST_V1_GATE_EV_EW_HEAVY_CORE_LINED_MASSIVE_CALIBRATION_OWNER_PLAN_2026-06-09.md)
  — landed Gate EV current coverage/accuracy gap ledger and landed Gate
  EW heavy-core / lined-massive calibration owner proof
- [POST_V1_GATE_EU_EV_CURRENT_COVERAGE_ACCURACY_GAP_LEDGER_PLAN_2026-06-09.md](./POST_V1_GATE_EU_EV_CURRENT_COVERAGE_ACCURACY_GAP_LEDGER_PLAN_2026-06-09.md)
  — landed Gate EU rerank and selected Gate EV current coverage/accuracy
  gap ledger work order
- [POST_V1_GATE_ES_ET_REINFORCED_CONCRETE_VISIBLE_DERIVED_BOUNDARY_PLAN_2026-06-08.md](./POST_V1_GATE_ES_ET_REINFORCED_CONCRETE_VISIBLE_DERIVED_BOUNDARY_PLAN_2026-06-08.md)
  — landed Gate ES/ET plan for the reinforced-concrete visible-derived missing-input boundary
- [POST_V1_GATE_EQ_ER_WALL_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_RUNTIME_PLAN_2026-06-08.md](./POST_V1_GATE_EQ_ER_WALL_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_RUNTIME_PLAN_2026-06-08.md)
  — landed Gate ER runtime plan for direct-fixed double-leaf
  field/building adapters
- [POST_V1_GATE_EP_EQ_WALL_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_PLAN_2026-06-07.md](./POST_V1_GATE_EP_EQ_WALL_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_PLAN_2026-06-07.md)
  — landed Gate EQ owner-proof plan
- [POST_V1_HIGH_ROI_SCOPE_ACCURACY_GATES_AFTER_GATE_CD_PLAN_2026-06-02.md](./POST_V1_HIGH_ROI_SCOPE_ACCURACY_GATES_AFTER_GATE_CD_PLAN_2026-06-02.md)
  — high-ROI candidate framework; useful planning input, not an older
  selected-next override
- [POST_V1_GATE_CD_OPEN_BOX_TARGET_OUTPUT_INDEPENDENCE_PLAN_2026-06-01.md](./POST_V1_GATE_CD_OPEN_BOX_TARGET_OUTPUT_INDEPENDENCE_PLAN_2026-06-01.md)
  — landed historical Gate CD target-output independence scope/correctness slice
- [ACOUSTIC_CALCULATOR_ANSWER_ENGINE_V1_PLAN_2026-05-21.md](./ACOUSTIC_CALCULATOR_ANSWER_ENGINE_V1_PLAN_2026-05-21.md)
  — historical product correction that is now landed for usable V1
- [SLICE_CALCULATOR_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_V1_PLAN.md](./SLICE_CALCULATOR_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_V1_PLAN.md)
  — historical model-first physics prediction pivot; still useful as
  foundation, but no longer the active next-action document
- [CURRENT_STATE.md](./CURRENT_STATE.md) — snapshot (what just closed, what is selected)
- [MASTER_PLAN.md](./MASTER_PLAN.md) — historical strategic roadmap; not a selector
- [NEXT_IMPLEMENTATION_PLAN.md](./NEXT_IMPLEMENTATION_PLAN.md) — tactical slice detail
- [CALCULATION_MODEL_AND_VALIDATION.md](./CALCULATION_MODEL_AND_VALIDATION.md)
  — answer-origin and validation contract
- [CHECKPOINT_2026-06-10_COMPATIBLE_ANCHOR_DELTA_BUILDING_DN_A_OWNER.md](./CHECKPOINT_2026-06-10_COMPATIBLE_ANCHOR_DELTA_BUILDING_DN_A_OWNER.md)
  — latest checkpoint: compatible anchor-delta building `Dn,A` owner
  landed and selected coverage refresh

And:

- [POST_CALCULATOR_PRODUCTIZATION_ROADMAP.md](./POST_CALCULATOR_PRODUCTIZATION_ROADMAP.md)
  for productization backlog only; it is not the active calculator
  behavior plan.

## Product Contract

Latest no-runtime formula scope/accuracy ledger: Gate FF landed
`post_v1_current_formula_scope_accuracy_gap_ledger_gate_ff_plan`
with status
`post_v1_current_formula_scope_accuracy_gap_ledger_gate_ff_landed_no_runtime_selected_post_double_leaf_framed_wall_banded_coverage_revalidation`.
Gate FF selected
`wall.double_leaf_framed_post_runtime_coverage_revalidation_after_direct_fixed_gate_er`
after two ROI plan iterations (`roiAnalysisIterations: 2`). Gate FF
subtracts already-live single-leaf mass-law, non-direct-fixed
double-leaf/framed, direct-fixed double-leaf field/building, historical
candidate-matrix/company-internal rehearsal, Gate FD floor holdout, Gate
FB opening/leak common-wall residual, Gate EY heavy-core / lined-massive,
and broad-source-crawl lanes. Gate FF is not a broad source crawl and
moves no runtime values. Gate FF selects:
`layer_combination_resolver_post_double_leaf_framed_wall_banded_coverage_revalidation_plan`
in
`packages/engine/src/layer-combination-resolver-post-double-leaf-framed-wall-banded-coverage-revalidation-contract.test.ts`.
Counters: `candidateCount 10`, `roiAnalysisIterations: 2`,
`estimatedNextPostDoubleLeafRevalidationRows 1`,
`estimatedNextRuntimeCandidateFamiliesToRerank 4`,
`closedRuntimeRowsRechecked 5`, `blockedOwnerOrHoldoutRows 3`,
`openHistoricalSelectedNextFilesStillMissing 1`,
`immediateRuntimeCandidatesSelected 0`, `newCalculableLayerTemplates 0`,
`newCalculableRequestShapes 0`, `runtimeBasisPromotions 0`,
`runtimeFormulaRetunes 0`, `runtimeValuesMoved 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.
Gate FE/FF plan:
`docs/calculator/POST_V1_GATE_FE_FF_CURRENT_FORMULA_SCOPE_ACCURACY_LEDGER_PLAN_2026-06-09.md`.

Latest post double-leaf/framed revalidation landed no-runtime as
`layer_combination_resolver_post_double_leaf_framed_wall_banded_coverage_revalidation_plan`
in
`packages/engine/src/layer-combination-resolver-post-double-leaf-framed-wall-banded-coverage-revalidation-contract.test.ts`
with status
`layer_combination_resolver_post_double_leaf_framed_wall_banded_coverage_revalidation_landed_no_runtime_selected_wall_compatible_anchor_delta_scope_expansion`.
It rechecked the live non-direct-fixed double-leaf/framed lab route, safe
flat double-leaf auto-topology lab/field/building routes, and direct-fixed
Gate EO / Gate ER lab/field/building routes; those are closed runtime
routes, not the next slice. Missing support topology, missing
`studSpacingMm`, missing `resilientBarSideCount`, floor-impact outputs,
and ASTM/IIC outputs remain guarded as `needs_input` / unsupported
boundaries. The revalidation selected
`post_v1_wall_compatible_anchor_delta_scope_expansion_plan`
in
`packages/engine/src/post-v1-wall-compatible-anchor-delta-scope-expansion-contract.test.ts`
with label `post-V1 wall compatible measured-anchor delta scope expansion`.
Counters: `roiAnalysisIterations: 3`,
`closedRuntimeRouteRowsRevalidated 3`, `runtimeScopeCandidates 1`,
`needsInputSurfaceCandidates 1`, `accuracyCandidatesBlocked 1`,
`blockedNonGoalRows 1`, `newCalculableLayerTemplates 0`,
`newCalculableRequestShapes 0`, `runtimeBasisPromotions 0`,
`runtimeValuesMoved 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`.

Latest compatible anchor-delta runtime scope expansion landed as
`post_v1_wall_compatible_anchor_delta_scope_expansion_plan`
in
`packages/engine/src/post-v1-wall-compatible-anchor-delta-scope-expansion-contract.test.ts`
with status
`post_v1_wall_compatible_anchor_delta_scope_expansion_landed_runtime_selected_field_building_adapter_owner`.
It keeps the existing one-side exterior board anchor delta at `Rw 57`
and opens the paired exterior board shape at `Rw 59` from the exact
`knauf_lab_416889_primary_2026` `Rw 55` source row. `STC`, `C`, and
`Ctr` remain guarded until separate owners exist.
The scope expansion selected
`post_v1_wall_compatible_anchor_delta_field_building_adapter_owner_plan`
in
`packages/engine/src/post-v1-wall-compatible-anchor-delta-field-building-adapter-owner-contract.test.ts`
with label `post-V1 wall compatible anchor-delta field/building adapter owner`.
Counters: `newCalculableLayerTemplates 1`,
`newCalculableRequestShapes 1`, `runtimeBasisPromotions 1`,
`runtimeValuesMoved 1`, `runtimeFormulaRetunes 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.

Latest compatible anchor-delta field/building adapter owner landed as
`post_v1_wall_compatible_anchor_delta_field_building_adapter_owner_plan`
in
`packages/engine/src/post-v1-wall-compatible-anchor-delta-field-building-adapter-owner-contract.test.ts`
with status
`post_v1_wall_compatible_anchor_delta_field_building_adapter_owner_landed_runtime_selected_surface_parity_input_acceptance`.
The paired exterior-board Knauf LSF compatible anchor-delta direct curve
(`Rw 59`) now feeds Gate I for complete `field_between_rooms` and Gate
AR for complete `building_prediction`, publishing `R'w 50 / Dn,w 51 /
DnT,w 53` in the pinned contexts. Missing `receivingRoomRt60S` or
`buildingPredictionOutputBasis` remains `needs_input`; `STC`, `C`,
`Ctr`, `Dn,A`, `DnT,A`, and ASTM outputs stay outside this owner. The
adapter owner selected
`post_v1_wall_compatible_anchor_delta_surface_parity_input_acceptance_plan`
in
`apps/web/features/workbench/post-v1-wall-compatible-anchor-delta-field-building-surface-parity.test.ts`
with label `post-V1 wall compatible anchor-delta field/building surface parity input acceptance`.
Counters: `newCalculableLayerTemplates 0`,
`newCalculableRequestShapes 2`, `runtimeBasisPromotions 2`,
`runtimeValuesMoved 6`, `runtimeFormulaRetunes 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.

Latest compatible anchor-delta field/building surface parity landed as
`post_v1_wall_compatible_anchor_delta_surface_parity_input_acceptance_plan`
in
`apps/web/features/workbench/post-v1-wall-compatible-anchor-delta-field-building-surface-parity.test.ts`
with status
`post_v1_wall_compatible_anchor_delta_surface_parity_input_acceptance_landed_no_runtime_selected_lab_metric_companion_owner`.
Workbench live calculation, calculator API payloads, saved replay,
server snapshot replay, cards, and report summaries now keep the paired
exterior-board Knauf LSF compatible anchor-delta values aligned:
`R'w 50 / Dn,w 51 / DnT,w 53` for both field and building contexts.
The existing web input surface carries the required stud/connection,
room, RT60, flanking/junction, and building-output-basis inputs, so no
frontend implementation file changed. Missing RT60 stays `needs_input`;
`STC`, `Dn,A`, and `DnT,A` remain unsupported. The surface parity selected
`post_v1_wall_compatible_anchor_delta_lab_metric_companion_owner_plan`
in
`packages/engine/src/post-v1-wall-compatible-anchor-delta-lab-metric-companion-owner-contract.test.ts`
with label `post-V1 wall compatible anchor-delta lab metric companion owner`.
Counters: `newCalculableLayerTemplates 0`,
`newCalculableRequestShapes 0`, `runtimeBasisPromotions 0`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes 0`,
`sourceRowsImported: 0`, `frontendImplementationFilesTouched: 0`, and
`webSurfaceParityContractFilesTouched: 1`.

Latest compatible anchor-delta lab metric companion owner landed as
`post_v1_wall_compatible_anchor_delta_lab_metric_companion_owner_plan`
in
`packages/engine/src/post-v1-wall-compatible-anchor-delta-lab-metric-companion-owner-contract.test.ts`
with status
`post_v1_wall_compatible_anchor_delta_lab_metric_companion_owner_landed_runtime_selected_surface_parity`.
The paired exterior-board Knauf LSF compatible anchor-delta lab route now
publishes `Rw 59 / STC 59 / C -1.1 / Ctr -6` for complete
`element_lab` mixed `Rw+STC/C/Ctr` requests. `STC`, `C`, and `Ctr` are
calculated from the shifted direct curve and rating adapters; the Knauf
source row remains measured `Rw` evidence only. Single `Rw`, `STC`-only,
field/building, A-weighted, and ASTM impact requests remain on their
existing owners or boundaries. The owner selected
`post_v1_wall_compatible_anchor_delta_lab_metric_companion_surface_parity_plan`
in
`apps/web/features/workbench/post-v1-wall-compatible-anchor-delta-lab-metric-companion-surface-parity.test.ts`
with label `post-V1 wall compatible anchor-delta lab metric companion surface parity`.
Counters: `newCalculableLayerTemplates 0`,
`newCalculableRequestShapes 1`, `newCalculableTargetOutputs: 3`,
`runtimeBasisPromotions 1`, `runtimeValuesMoved: 0`,
`runtimeFormulaRetunes 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`.

Latest compatible anchor-delta lab metric companion surface parity landed
as
`post_v1_wall_compatible_anchor_delta_lab_metric_companion_surface_parity_plan`
in
`apps/web/features/workbench/post-v1-wall-compatible-anchor-delta-lab-metric-companion-surface-parity.test.ts`
with status
`post_v1_wall_compatible_anchor_delta_lab_metric_companion_surface_parity_landed_no_runtime_selected_coverage_refresh`.
Workbench live calculation, calculator API, saved replay, server snapshot
replay, cards, and report summaries now preserve the paired exterior-board
Knauf LSF lab companion values `Rw 59 / STC 59 / C -1.1 / Ctr -6`.
`STC`-only and one-side exterior-board requests stay off the lab companion
candidate. The surface parity selected
`post_v1_wall_compatible_anchor_delta_lab_metric_companion_coverage_refresh_plan`
in
`packages/engine/src/post-v1-wall-compatible-anchor-delta-lab-metric-companion-coverage-refresh-contract.test.ts`
with label `post-V1 wall compatible anchor-delta lab metric companion coverage refresh`.
Counters: `newCalculableLayerTemplates 0`,
`newCalculableRequestShapes 0`, `runtimeBasisPromotions 0`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes 0`,
`sourceRowsImported: 0`, `frontendImplementationFilesTouched: 0`, and
`webSurfaceParityContractFilesTouched: 1`.

Latest compatible anchor-delta lab metric companion coverage refresh
landed as
`post_v1_wall_compatible_anchor_delta_lab_metric_companion_coverage_refresh_plan`
in
`packages/engine/src/post-v1-wall-compatible-anchor-delta-lab-metric-companion-coverage-refresh-contract.test.ts`
with status
`post_v1_wall_compatible_anchor_delta_lab_metric_companion_coverage_refresh_landed_no_runtime_selected_one_side_lab_metric_companion_owner`.
The refresh pins
`wall.compatible_anchor_delta.calculated_lab_companions` with runtime
basis
`post_v1_wall_compatible_anchor_delta_calculated_lab_companion_runtime`
as `ready_with_budget` in the candidate coverage matrix and
`allowed_with_budget` in company-internal V0. It re-probes the paired
exterior-board Knauf LSF values
`Rw 59 / STC 59 / C -1.1 / Ctr -6` and keeps single `Rw`, `STC`-only,
field/building, and one-side exterior-board mixed requests off the
paired-board lab companion owner. This is not a broad source crawl.
The refresh selected
`post_v1_wall_compatible_anchor_delta_one_side_lab_metric_companion_owner_plan`
in
`packages/engine/src/post-v1-wall-compatible-anchor-delta-one-side-lab-metric-companion-owner-contract.test.ts`
with label `post-V1 wall compatible anchor-delta one-side lab metric companion owner`.
Counters: `coverageRefreshContractFilesTouched: 1`,
`newCalculableLayerTemplates 0`, `newCalculableRequestShapes 0`,
`runtimeBasisPromotions 0`, `runtimeValuesMoved 0`,
`runtimeFormulaRetunes 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`.

Latest compatible anchor-delta one-side lab metric companion owner landed
as
`post_v1_wall_compatible_anchor_delta_one_side_lab_metric_companion_owner_plan`
in
`packages/engine/src/post-v1-wall-compatible-anchor-delta-one-side-lab-metric-companion-owner-contract.test.ts`
with status
`post_v1_wall_compatible_anchor_delta_one_side_lab_metric_companion_owner_landed_runtime_selected_surface_parity`.
It reuses candidate
`wall.compatible_anchor_delta.calculated_lab_companions` and runtime
basis
`post_v1_wall_compatible_anchor_delta_calculated_lab_companion_runtime`
for the one-side exterior-board Knauf LSF route. One-side `element_lab`
mixed `Rw+STC/C/Ctr` requests now publish
`Rw 57 / STC 57 / C -0.6 / Ctr -5.5`. Single `Rw`, STC-only,
field/building, A-weighted, ASTM, and non-Knauf rows remain on their
existing owners or boundaries. This is not a broad source crawl.
The owner selected
`post_v1_wall_compatible_anchor_delta_one_side_lab_metric_companion_surface_parity_plan`
in
`apps/web/features/workbench/post-v1-wall-compatible-anchor-delta-one-side-lab-metric-companion-surface-parity.test.ts`
with label `post-V1 wall compatible anchor-delta one-side lab metric companion surface parity`.
Counters: `newCalculableLayerTemplates 0`,
`newCalculableRequestShapes 1`, `newCalculableTargetOutputs: 3`,
`runtimeBasisPromotions 1`, `runtimeValuesMoved 0`,
`runtimeFormulaRetunes 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`.

Latest compatible anchor-delta one-side lab metric companion surface
parity landed as
`post_v1_wall_compatible_anchor_delta_one_side_lab_metric_companion_surface_parity_plan`
in
`apps/web/features/workbench/post-v1-wall-compatible-anchor-delta-one-side-lab-metric-companion-surface-parity.test.ts`
with status
`post_v1_wall_compatible_anchor_delta_one_side_lab_metric_companion_surface_parity_landed_no_runtime_selected_coverage_refresh`.
Workbench live calculation, calculator API, saved replay, server snapshot
replay, cards, and report summaries now preserve the one-side
exterior-board Knauf LSF lab companion values
`Rw 57 / STC 57 / C -0.6 / Ctr -5.5`. The surface shows candidate
`wall.compatible_anchor_delta.calculated_lab_companions` and runtime
basis
`post_v1_wall_compatible_anchor_delta_calculated_lab_companion_runtime`.
Direct single `Rw` remains on
`wall.compatible_anchor_delta.extra_board_on_verified_lsf`, STC-only
remains unsupported, and field/building, A-weighted, ASTM, and non-Knauf
rows remain outside this owner. This is not a broad source crawl.
The surface parity selected
`post_v1_wall_compatible_anchor_delta_one_side_lab_metric_companion_coverage_refresh_plan`
in
`packages/engine/src/post-v1-wall-compatible-anchor-delta-one-side-lab-metric-companion-coverage-refresh-contract.test.ts`
with label `post-V1 wall compatible anchor-delta one-side lab metric companion coverage refresh`.
Counters: `webSurfaceParityContractFilesTouched: 1`,
`frontendImplementationFilesTouched: 0`, `newCalculableLayerTemplates: 0`,
`newCalculableRequestShapes: 0`, `newCalculableTargetOutputs: 0`,
`runtimeBasisPromotions: 0`, `runtimeValuesMoved 0`,
`runtimeFormulaRetunes 0`, and `sourceRowsImported: 0`.

Latest compatible anchor-delta one-side lab metric companion coverage
refresh landed as
`post_v1_wall_compatible_anchor_delta_one_side_lab_metric_companion_coverage_refresh_plan`
in
`packages/engine/src/post-v1-wall-compatible-anchor-delta-one-side-lab-metric-companion-coverage-refresh-contract.test.ts`
with status
`post_v1_wall_compatible_anchor_delta_one_side_lab_metric_companion_coverage_refresh_landed_no_runtime_selected_next_numeric_coverage_gap_after_one_side_lab_companion`.
The refresh pins candidate
`wall.compatible_anchor_delta.calculated_lab_companions` with runtime
basis
`post_v1_wall_compatible_anchor_delta_calculated_lab_companion_runtime`
as a one-side-aware `ready_with_budget` coverage-matrix row and
`allowed_with_budget` company-internal V0 row. It re-probes the one-side
exterior-board Knauf LSF values
`Rw 57 / STC 57 / C -0.6 / Ctr -5.5` and keeps direct single `Rw`,
STC-only, field/building, A-weighted, ASTM, and non-Knauf rows outside
the lab companion owner. This is not a broad source crawl.
The refresh selected
`post_v1_next_numeric_coverage_gap_after_one_side_lab_companion_plan`
in
`packages/engine/src/post-v1-next-numeric-coverage-gap-after-one-side-lab-companion-contract.test.ts`
with label `post-V1 next numeric coverage gap after one-side lab companion`.
Counters: `coverageRefreshContractFilesTouched: 1`,
`frontendImplementationFilesTouched: 0`, `newCalculableLayerTemplates: 0`,
`newCalculableRequestShapes: 0`, `newCalculableTargetOutputs: 0`,
`runtimeBasisPromotions: 0`, `runtimeValuesMoved 0`,
`runtimeFormulaRetunes 0`, and `sourceRowsImported: 0`.

Latest numeric coverage gap after one-side lab companion landed as
`post_v1_next_numeric_coverage_gap_after_one_side_lab_companion_plan`
in
`packages/engine/src/post-v1-next-numeric-coverage-gap-after-one-side-lab-companion-contract.test.ts`
with status
`post_v1_next_numeric_coverage_gap_after_one_side_lab_companion_landed_no_runtime_selected_compatible_anchor_delta_a_weighted_owner`.
Plan doc:
`docs/calculator/POST_V1_NEXT_NUMERIC_COVERAGE_GAP_AFTER_ONE_SIDE_LAB_COMPANION_PLAN_2026-06-10.md`.
The selected candidate is
`wall.compatible_anchor_delta.a_weighted_field_building_adapter_owner`.
The rerank compares formula-scope, route-input, and accuracy/holdout
candidates against the closed compatible anchor-delta direct, field,
building, paired lab companion, and one-side lab companion lanes. It
selects the A-weighted owner because the engine already computes
compatible anchor-delta `Dn,A` / `DnT,A` values but keeps them
unsupported until a metric owner lands. Expected follow-up movement is
paired and one-side field `Dn,A` / `DnT,A` plus paired and one-side
building `DnT,A`; building `Dn,A`, STC-only, field/building lab aliases,
ASTM/IIC/AIIC, and non-Knauf rows remain outside the owner. This is not
a broad source crawl.
The rerank selected
`post_v1_wall_compatible_anchor_delta_a_weighted_field_building_adapter_owner_plan`
in
`packages/engine/src/post-v1-wall-compatible-anchor-delta-a-weighted-field-building-adapter-owner-contract.test.ts`
with label `post-V1 wall compatible anchor-delta A-weighted field/building adapter owner`.
Counters: `candidateCount: 6`, `roiAnalysisIterations: 3`,
`estimatedNextRuntimeValuesMoved: 6`, `immediateRuntimeValuesMoved: 0`,
`runtimeBasisPromotions: 0`, `runtimeFormulaRetunes 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.

Latest compatible anchor-delta A-weighted field/building adapter owner
landed as
`post_v1_wall_compatible_anchor_delta_a_weighted_field_building_adapter_owner_plan`
in
`packages/engine/src/post-v1-wall-compatible-anchor-delta-a-weighted-field-building-adapter-owner-contract.test.ts`
with status
`post_v1_wall_compatible_anchor_delta_a_weighted_field_building_adapter_owner_landed_runtime_selected_surface_parity_input_acceptance`.
The owner uses the same compatible anchor-delta direct curve plus Gate I
/ Gate AR route, but only for the Knauf `416889` reduced-stack anchor.
It publishes paired field `Dn,A 49.5 / DnT,A 51.9`, one-side field
`Dn,A 48 / DnT,A 50.4`, paired building `DnT,A 51.9`, and one-side
building `DnT,A 50.4`. At this owner checkpoint, building `Dn,A` stayed
parked until the later building `Dn,A` owner below landed. Lab aliases,
ASTM/IIC/AIIC, and non-`416889` compatible anchors remain unsupported.
The owner selected
`post_v1_wall_compatible_anchor_delta_a_weighted_surface_parity_input_acceptance_plan`
in
`apps/web/features/workbench/post-v1-wall-compatible-anchor-delta-a-weighted-field-building-surface-parity.test.ts`
with label `post-V1 wall compatible anchor-delta A-weighted field/building surface parity input acceptance`.
Counters: `newCalculableLayerTemplates 0`, `newCalculableRequestShapes 4`,
`runtimeBasisPromotions 2`, `runtimeValuesMoved 6`,
`runtimeFormulaRetunes 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`.

Latest compatible anchor-delta A-weighted field/building surface parity
landed as
`post_v1_wall_compatible_anchor_delta_a_weighted_surface_parity_input_acceptance_plan`
in
`apps/web/features/workbench/post-v1-wall-compatible-anchor-delta-a-weighted-field-building-surface-parity.test.ts`
with status
`post_v1_wall_compatible_anchor_delta_a_weighted_surface_parity_input_acceptance_landed_no_runtime_selected_coverage_refresh`.
The surface locks the workbench live path, output cards, target-output
status, report summaries, calculator API, saved replay, and server
snapshot replay for paired and one-side A-only compatible anchor-delta
requests. At this surface checkpoint, field published `Dn,A` and
`DnT,A`; building published `DnT,A` while `Dn,A` was still parked. The
later building `Dn,A` owner below now promotes building `Dn,A`. Gate AR
building outputs use the `Airborne building prediction` posture label on
the workbench.
The surface selected
`post_v1_wall_compatible_anchor_delta_a_weighted_field_building_coverage_refresh_plan`
in
`packages/engine/src/post-v1-wall-compatible-anchor-delta-a-weighted-field-building-coverage-refresh-contract.test.ts`
with label `post-V1 wall compatible anchor-delta A-weighted field/building coverage refresh`.
Counters: `webSurfaceParityContractFilesTouched: 1`,
`frontendImplementationFilesTouched: 1`, `newCalculableLayerTemplates: 0`,
`newCalculableRequestShapes: 0`, `newCalculableTargetOutputs: 0`,
`runtimeBasisPromotions: 0`, `runtimeValuesMoved 0`,
`runtimeFormulaRetunes 0`, and `sourceRowsImported: 0`.

Latest compatible anchor-delta A-weighted field/building coverage refresh
landed as
`post_v1_wall_compatible_anchor_delta_a_weighted_field_building_coverage_refresh_plan`
in
`packages/engine/src/post-v1-wall-compatible-anchor-delta-a-weighted-field-building-coverage-refresh-contract.test.ts`
with status
`post_v1_wall_compatible_anchor_delta_a_weighted_field_building_coverage_refresh_landed_no_runtime_selected_next_numeric_coverage_gap_after_a_weighted_field_building`.
The refresh pins the Knauf `416889` A-weighted field/building owner in
resolver registry, runtime adapter, runtime surface, coverage matrix,
and company-internal V0. `wall.airborne_field_context.field_apparent_adapter`
stays `ready_with_budget` / `allowed_with_budget` on
`gate_i_airborne_field_apparent_context_adapter_runtime`; the Gate AR
building candidate
`candidate_airborne_building_prediction_all_owner_family_physics_prediction`
stays `ready_with_budget` / `allowed_with_budget` on
`gate_ar_airborne_building_prediction_all_owner_runtime_corridor`.
It re-probes paired field `Dn,A 49.5 / DnT,A 51.9`, one-side field
`Dn,A 48 / DnT,A 50.4`, paired building `DnT,A 51.9`, and one-side
building `DnT,A 50.4`; at that refresh checkpoint building `Dn,A` was
still outside the owner. The later building `Dn,A` owner below now
promotes it, while lab aliases, ASTM/IIC/AIIC, missing-input, and
non-`416889` rows remain outside the route. This is not a broad source
crawl and moves no runtime values.
The refresh selected
`post_v1_next_numeric_coverage_gap_after_a_weighted_field_building_plan`
in
`packages/engine/src/post-v1-next-numeric-coverage-gap-after-a-weighted-field-building-contract.test.ts`
with label `post-V1 next numeric coverage gap after A-weighted field/building`.
Counters: `coverageRefreshContractFilesTouched: 1`,
`frontendImplementationFilesTouched: 0`, `newCalculableLayerTemplates: 0`,
`newCalculableRequestShapes: 0`, `newCalculableTargetOutputs: 0`,
`runtimeBasisPromotions: 0`, `runtimeValuesMoved 0`,
`runtimeFormulaRetunes 0`, and `sourceRowsImported: 0`.

Latest numeric coverage gap after A-weighted field/building landed as
`post_v1_next_numeric_coverage_gap_after_a_weighted_field_building_plan`
in
`packages/engine/src/post-v1-next-numeric-coverage-gap-after-a-weighted-field-building-contract.test.ts`
with status
`post_v1_next_numeric_coverage_gap_after_a_weighted_field_building_landed_no_runtime_selected_compatible_anchor_delta_building_dn_a_owner`.
Plan doc:
`docs/calculator/POST_V1_NEXT_NUMERIC_COVERAGE_GAP_AFTER_A_WEIGHTED_FIELD_BUILDING_PLAN_2026-06-10.md`.
Selected candidate:
`wall.compatible_anchor_delta.building_dn_a_owner`.
The rerank subtracts the closed compatible anchor-delta direct `Rw`,
field/building base metrics, paired and one-side lab companions, field
`Dn,A`/`DnT,A`, and building `DnT,A`. It selects the building Dn,A owner
because the Gate AR compatible anchor-delta route already carries paired
building `Dn,A 49.5` and one-side building `Dn,A 48` as computed values,
but they remain unsupported behind an explicit separate-owner warning.
Non-Knauf formula widening, route-input work, and A-weighted budget
tightening stay lower-ranked until they have owned evidence or inputs.
This is not a broad source crawl and moves no runtime values in the
selection step.
The rerank selected
`post_v1_wall_compatible_anchor_delta_building_dn_a_owner_plan`
in
`packages/engine/src/post-v1-wall-compatible-anchor-delta-building-dn-a-owner-contract.test.ts`
with label `post-V1 wall compatible anchor-delta building Dn,A owner`.
Counters: `candidateCount: 6`, `roiAnalysisIterations: 3`,
`closedAWeightedRowsRechecked: 4`,
`buildingDnAUnsupportedRowsRechecked: 2`,
`estimatedNextCalculableRequestShapes: 2`,
`estimatedNextRuntimeValuesMoved: 2`, `immediateRuntimeValuesMoved: 0`,
`frontendImplementationFilesTouched: 0`, `runtimeBasisPromotions: 0`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes 0`, and
`sourceRowsImported: 0`.

Latest compatible anchor-delta building Dn,A owner landed as
`post_v1_wall_compatible_anchor_delta_building_dn_a_owner_plan`
in
`packages/engine/src/post-v1-wall-compatible-anchor-delta-building-dn-a-owner-contract.test.ts`
with status
`post_v1_wall_compatible_anchor_delta_building_dn_a_owner_landed_runtime_selected_coverage_refresh`.
It promotes the already-computed Gate AR compatible anchor-delta building
`Dn,A` values: paired exterior-board building `Dn,A 49.5` and one-side
exterior-board building `Dn,A 48`. The route keeps the shifted Knauf
`416889` direct curve, Gate AR building-prediction basis, and ISO 717 C
adapter term; no source rows were imported and no formula was retuned.
Lab aliases, missing `buildingPredictionOutputBasis`, non-selected
anchors, and ASTM/IIC/AIIC remain boundary rows. It selected
`post_v1_wall_compatible_anchor_delta_building_dn_a_coverage_refresh_plan`
in
`packages/engine/src/post-v1-wall-compatible-anchor-delta-building-dn-a-coverage-refresh-contract.test.ts`
with label `post-V1 wall compatible anchor-delta building Dn,A coverage refresh`.
Counters: `newCalculableRequestShapes: 2`,
`newCalculableTargetOutputs: 1`, `runtimeBasisPromotions: 1`,
`runtimeValuesMoved 2`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, `frontendImplementationFilesTouched: 0`, and
`webSurfaceParityContractFilesTouched: 1`.

Previous no-runtime numeric coverage/accuracy rerank: Gate FE landed
`post_v1_next_numeric_coverage_gap_gate_fe_plan`
with status
`post_v1_next_numeric_coverage_gap_gate_fe_landed_no_runtime_selected_current_formula_scope_accuracy_gap_ledger_gate_ff`.
Gate FE selected
`calculator.current_formula_scope_accuracy_gap_ledger_after_gate_fd_closeout`
after two ROI plan iterations (`roiAnalysisIterations: 2`). Gate FE
subtracts Gate FD floor holdout rejection, Gate FB opening/leak and
common-wall owner rejection, Gate EY heavy-core / lined-massive owner
rejection, stale cartography `runtime_widening` labels for heavy-core,
timber stud, CLT, and steel fallback, and the blocked Rockwool source
packet lane. Gate FE is not a broad source crawl and moves no runtime
values. Gate FE selects Gate FF:
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
Previous no-runtime floor raw-bare/floating holdout closeout: Gate FD landed
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
values and budgets remain frozen. Gate FD selects Gate FE:
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

Previous no-runtime numeric coverage/accuracy rerank: Gate FC landed
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
broad source crawl. Gate FC selects
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

Previous no-runtime opening/leak common wall owner closeout: Gate FB landed
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

Previous no-runtime current coverage/accuracy gap ledger: Gate FA landed
`post_v1_current_coverage_accuracy_gap_ledger_gate_fa_plan`
with status
`post_v1_current_coverage_accuracy_gap_ledger_gate_fa_landed_no_runtime_selected_opening_leak_common_wall_same_basis_residual_owner_gate_fb`.
Gate FA selected
`wall.opening_leak_common_wall_same_basis_residual_owner_gap_after_gate_ey_owner_rejection_closeout`.
Gate FA re-read current implementation after Gate EY/EZ: opening/leak
field/building and A-weighted runtime rows are live, but they remain
source-absent with wide budgets; Gate CL also left the common wall
building residual and opening/leak residuals without same-basis
holdouts. Gate FA selected Gate FB, a no-runtime same-basis residual
owner proof:
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

Previous no-runtime numeric coverage/accuracy rerank: Gate EZ landed
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

Previous no-runtime targeted evidence action: Gate EY landed
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

Previous no-runtime numeric coverage/accuracy rerank: Gate EX landed
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

Previous no-runtime calibration owner proof: Gate EW landed
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

Previous no-runtime current coverage/accuracy gap ledger: Gate EV landed
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

Previous no-runtime rerank: Gate EU landed
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
`frontendImplementationFilesTouched: 0`. Gate EU selects Gate EV:
`post_v1_current_coverage_accuracy_gap_ledger_gate_ev_plan` in
`packages/engine/src/post-v1-current-coverage-accuracy-gap-ledger-gate-ev-contract.test.ts`.

Latest boundary closeout: Gate ET landed
`post_v1_floor_reinforced_concrete_visible_derived_missing_input_boundary_gate_et_plan`
with status
`post_v1_floor_reinforced_concrete_visible_derived_missing_input_boundary_gate_et_landed_no_runtime_selected_next_numeric_coverage_gap_gate_eu`.
Boundary id:
`floor.reinforced_concrete.visible_derived_lower_assembly_from_layers_missing_dynamic_stiffness_and_load`.
Visible-derived reinforced-concrete combined upper/lower floors park
`Ln,w` / `DeltaLw` as `needs_input` for exactly
`resilientLayerDynamicStiffnessMNm3` and `loadBasisKgM2`; explicit
partial predictor input still asks for `loadBasisKgM2` and
`ceilingOrLowerAssembly`. This moved `runtimeValuesMoved 0`, cleared
`currentGateFailuresCleared 6`, imported `sourceRowsImported: 0`, and
touched `frontendImplementationFilesTouched: 1`. Gate ET selects
`post_v1_next_numeric_coverage_gap_gate_eu_plan` in
`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-eu-contract.test.ts`.

Latest boundary-preservation checkpoint: commit `fb0ea67 Fix
double-leaf route input boundary` keeps flat `leaf / porous absorber /
leaf` wall stacks without complete double-leaf topology/support inputs
parked as `needs_input`; complete topology still calculates through the
owned double-leaf/framed route. This is not a value-moving slice and it
does not import source rows. Gate EV has since landed and selected Gate
EW, Gate EW selected Gate EX, and Gate EX has since landed and selected
Gate EY targeted evidence acquisition.

Route-family ambiguity to preserve: generic
`gypsum_board 12.5 / rockwool 50 / gypsum_board 100` is now guarded
from flipping to `lined_massive_wall` by surface mass alone. Treat this
as a classification/boundary rule, not a mandate to park all
lined-massive fallback routes. Existing concrete/AAC/brick/CLT
massive-core lanes are separate and must stay pinned unless a selected
calculator slice changes them with tests.

Previous no-runtime rerank: Gate ES landed
`post_v1_next_numeric_coverage_gap_gate_es_plan` with status
`post_v1_next_numeric_coverage_gap_gate_es_landed_no_runtime_selected_floor_reinforced_concrete_visible_derived_missing_input_boundary_gate_et`.
It selected
`floor.reinforced_concrete_visible_derived_missing_input_boundary_refresh`
after two ROI iterations (`roiAnalysisIterations: 2`) and selected Gate
ET in
`packages/engine/src/post-v1-floor-reinforced-concrete-visible-derived-missing-input-boundary-gate-et-contract.test.ts`.
Gate ES estimated the selected boundary-surface touch as
`estimatedNextFrontendImplementationFilesTouched 1`.
Gate ES moved `runtimeValuesMoved 0`, imported `sourceRowsImported: 0`,
and touched `frontendImplementationFilesTouched: 0`.

Latest runtime closeout: Gate ER landed
`post_v1_wall_direct_fixed_double_leaf_field_building_adapter_runtime_gate_er_plan`
with status
`post_v1_wall_direct_fixed_double_leaf_field_building_adapter_runtime_gate_er_landed_runtime_selected_next_numeric_coverage_gap_gate_es`.
Readable label: direct-fixed double-leaf field/building adapter runtime.
Complete direct-fixed double-leaf `field_between_rooms` requests now use
`gate_i_airborne_field_apparent_context_adapter_runtime`, and complete
`building_prediction` requests now use
`gate_ar_airborne_building_prediction_all_owner_runtime_corridor`; both
calculate `R'w 23 / Dn,w 24 / DnT,w 27` over the Gate EO direct
separating-element curve. This moved `runtimeValuesMoved 6` with
`sourceRowsImported: 0` and `frontendImplementationFilesTouched: 0`.
Gate ER selected Gate ES file:
`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-es-contract.test.ts`.

This repo is an acoustic calculator for floor and wall assemblies.
Its product direction is scope and accuracy: more physically valid
layer combinations should calculate owned acoustic outputs when required
inputs are present, and existing calculation routes should become more
correct, calibrated, or better bounded over time. Work that does not
advance calculator scope or accuracy is product drift unless explicitly
requested outside calculator behavior.

The user picks wall or floor, enters the layer stack, layer order,
thicknesses, and any extra physical inputs genuinely required by that
route, then receives acoustic outputs such as `Rw`, `R'w`, `DnT,w`,
`Ln,w`, `L'n,w`, or `L'nT,w`. The system must do three things correctly:

- calculate the right value when a route legitimately supports that
  output, using exact data when available and family-specific physics
  when exact data is absent
- surface `needs_input` only when required physical/context inputs are
  missing, and `unsupported` only when the route genuinely has no
  bounded calculation path
- keep the same answer/support posture stable under duplicate rows, row reorders,
  save/load replay, study-mode detours, and other hostile operator behavior

A green result is only valid if both the number and its support/origin posture
are correct.

## Answer-Engine Baseline

This project is not a lookup database, a catalog project, or a test
environment. Lab/source rows are allowed to win exact whole-stack
matches, anchor known compatible constructions, calibrate formula
families, benchmark tolerances, and provide regression tests. They must
not replace the calculator engine.

When no exact whole-stack row exists, the engine must still calculate
through the best physically appropriate route it owns:

- exact full-stack measured row when it truly matches;
- compatible measured anchor plus calculated delta when the algorithm
  owns the topology, metric, and basis;
- calibrated family formula;
- source-absent family formula with a visible error budget;
- `needs_input` only when a required physical field is missing;
- `unsupported` only when DynEcho has no bounded calculation path.

The answer-engine V1 correction is now landed for the current
company-internal usable V1 envelope. The selected answer surface is
implemented through resolver candidate declarations, runtime candidate
mapping, answer-boundary payloads, owner audit, value parking, trace
building, and UI/API/report parity tests. Wall and floor paths both
publish answers through selected candidates or explicit `needs_input` /
`unsupported` stops.

## End-To-End User Flow

1. Auth-gated workbench entry.
   - `/workbench` is server-gated by `requireAuthenticatedPage(...)`.
   - `view=advanced` selects the advanced operator desk; default is the simpler
     guided shell.
   - Files:
     - `apps/web/app/workbench/page.tsx`
     - `apps/web/app/workbench/workbench-client-page.tsx`
2. Client shell selection.
   - `SimpleWorkbenchShell` is the default day-to-day calculator surface.
   - `WorkbenchShell` is the denser operator/debug/reporting desk.
   - Files:
     - `apps/web/features/workbench/simple-workbench-shell.tsx`
     - `apps/web/features/workbench/workbench-shell.tsx`
3. Local scenario state and editing.
   - Zustand store owns study mode, layer rows, requested outputs, optional
     airborne/impact context, criteria/report settings, and saved scenarios.
   - Layer edits, duplicate/reorder, split parity, and scenario save/load all
     start here.
   - File:
     - `apps/web/features/workbench/workbench-store.ts`
4. Request building and engine execution.
   - Web routes validate payloads with shared schemas and call engine entry
     points.
   - Full route:
     - `apps/web/app/api/estimate/route.ts` -> `calculateAssembly(...)`
   - Impact-only route:
     - `apps/web/app/api/impact-only/route.ts` -> `calculateImpactOnly(...)`
5. Engine lane selection and support gating.
   - Engine builds airborne/impact candidates, selects route-specific results,
     then computes supported and unsupported requested outputs.
   - Core files:
     - `packages/engine/src/calculate-assembly.ts`
     - `packages/engine/src/calculate-impact-only.ts`
     - `packages/engine/src/target-output-support.ts`
6. Output-card projection.
   - UI cards do not simply print raw numbers. They combine the engine result,
     support buckets, field blockers, route posture, and requested-output state
     into `live`, `bound`, `needs_input`, or `unsupported` cards.
   - File:
     - `apps/web/features/workbench/simple-workbench-output-model.ts`
7. Save/load and proposal/report surfaces.
   - Local scenario editing is browser-local first.
   - Users can explicitly sync/load owner-scoped server project records.
   - Proposal/report exports can append server project audit events.
   - Project access roles/actions have a pure policy contract, but route
     access is still owner-scoped until the deferred route-integration slice
     wires the policy through an owner-only adapter.

## Runtime Boundaries

### Engine

The engine is the truth surface for numeric and support decisions.

- public package entry:
  `packages/engine/src/index.ts`
- core entry points:
  - `calculate-assembly.ts`
  - `calculate-impact-only.ts`
- support gate:
  - `target-output-support.ts`

The engine decides:

- which lane owns the answer
- whether a requested output is supported
- what provenance/basis metadata accompanies the answer

The UI must not widen unsupported outputs beyond what the engine exposes.

### Web API Glue

The Next API routes are intentionally thin.

They do four things only:

- auth check
- schema validation
- call engine entry point
- serialize JSON result/error

If behavior changes here, it should usually be validation/auth/transport, not
acoustic logic.

### Workbench UI

The UI owns operator flow, edit ergonomics, posture wording, and projection of
engine support state into cards, guides, reports, and review surfaces.

The UI must stay parity-safe with the engine. A card can be wrong even when the
engine number is correct if the UI shows `live` for something that should be
`needs_input` or `unsupported`.

### Persistence

Current workbench editing persistence is local-first.

- store uses Zustand `persist(...)`
- storage backend is `createJSONStorage(() => localStorage)`
- saved scenarios are snapshots in the client store
- `server_backed_project_storage_v1` has closed an owner-scoped
  server project repository and `/api/projects` import/list/detail
  routes backed by filesystem JSON records
- the workbench can copy browser-local saved scenarios into a server
  project with `Sync to server`
- the default workbench can sync the current snapshot to a server
  project, list server projects, and load a marked server snapshot
  back into local Zustand
- `/workbench/proposal/configure` edits the packaged proposal/report
  snapshot only. This is the manual report-correction path for issued
  PDF and DOCX output; it must not mutate calculator inputs, solver
  routes, or engine result state.
- proposal PDF/DOCX routes append a project audit event when a
  `projectId` is present
- `team_access_model_v1` has closed a pure project-access policy helper
  with owner/editor/reviewer/viewer role-action decisions and stable
  denial reasons
- `project_access_policy_route_integration_v1` has closed; route
  decisions now flow through an owner-only policy adapter while team
  route access remains disabled until membership storage exists
- local Zustand remains the live editing source; server persistence is
  explicit sync/load, not shared multi-user editing

This is important because docs should not describe current save/load as shared
multi-user project persistence.

## Answer Model

There is no single universal acoustic formula in the repo, and there
must not be a lookup-only answer path either.

A visible answer can be owned by:

- exact imported/source-backed rows
- exact subassembly anchors plus calculated deltas
- calibrated family-specific formula lanes
- family physics prediction lanes
- conservative bound lanes
- screening fallback lanes
- needs-input state
- unsupported state

For the full origin rules, read
[CALCULATION_MODEL_AND_VALIDATION.md](./CALCULATION_MODEL_AND_VALIDATION.md).
This document is the system map; that document is the answer-origin contract.

## Study Mode And Context Model

The main top-level operator switch is `studyMode`.

- `wall` mode biases the flow toward airborne partition behavior
- `floor` mode enables impact lanes and floor companion logic

Requested outputs, context fields, and card behavior depend on:

- study mode
- selected route/lane
- available geometry or field inputs
- support gating from the engine

Important consequence:

- the UI must not assume that selecting an output means it can be shown
- missing context should produce `needs_input`, not guessed values

## Test System

The test system has distinct jobs.

### Engine Truth Tests

These prove numeric values, support buckets, provenance, and fail-closed
boundaries.

Examples:

- `packages/engine/src/mixed-floor-wall-generated-matrix.test.ts`
- `packages/engine/src/output-origin-trace-matrix.test.ts`
- source-truth audits and lane-specific route guards across `packages/engine/src`

### Web Parity Tests

These prove that output cards, status labels, replay/save-load posture, and
requested-output surfaces stay aligned with engine truth.

Examples:

- `apps/web/features/workbench/mixed-study-mode-output-card-snapshot-grid.test.ts`
- `apps/web/features/workbench/mixed-study-mode-generated-history-grid.test.ts`
- `apps/web/features/workbench/mixed-study-mode-generated-edit-history-matrix.test.ts`

### Planning Contracts

These are executable docs for next-slice selection. They pin what just closed,
what is explicitly deferred, and what should be implemented next.

Examples live in `packages/engine/src/post-*.test.ts`.

### Productization Policy Tests

These prove non-calculator product contracts such as auth, project
storage, route authorization, and access policy semantics.

Examples:

- `apps/web/lib/project-access-policy.test.ts`
- `apps/web/lib/server-project-routes.test.ts`
- `apps/web/lib/auth.test.ts`
- `apps/web/lib/auth-routes.test.ts`

### Focused Gate

`pnpm calculator:gate:current` is the current single-command checkpoint gate.

It should stay aligned with the living next slice and gives the shortest safe
validation path before and after a refactor.

## Current Architectural Hotspots

As of 2026-06-08, the current calculator hotspots are post-V1 product
gaps, not missing answer-engine architecture:

- `packages/engine/src/layer-combination-resolver-registry.ts` is the
  declared candidate surface. Keep it lightweight and free of heavy
  runtime imports.
- `packages/engine/src/layer-combination-resolver-runtime-candidate-adapter.ts`
  maps runtime basis ids and answer-boundary states onto selected
  candidates. New formula families should enter here instead of leaking
  untraced outputs.
- `packages/engine/src/acoustic-answer-engine-v1-owner-audit.ts` parks
  outputs that the selected candidate does not own. New mixed-output
  behavior must prove ownership instead of weakening this guard.
- `packages/engine/src/calculate-assembly.ts` and
  `packages/engine/src/calculate-impact-only.ts` can compute diagnostic
  lanes, but publication must still go through selected answer
  candidates, value parking, and resolver traces.
- `apps/web/features/workbench/layer-combination-resolver-candidate-surface.ts`
  is the visible projection path. Cards, reports, API payloads, and
  replay must not infer acoustic basis from display labels.
- Post-V1 work should broaden formula coverage, adapters, calibration,
  holdouts, and required-input ergonomics while preserving exact /
  anchor / formula / `needs_input` / `unsupported` answer order.

Current selected hotspot: Gate ER direct-fixed double-leaf
field/building adapter runtime. Gate EQ accepted
`wall.direct_fixed_double_leaf.field_between_rooms_adapter_owner` and
`wall.direct_fixed_double_leaf.building_prediction_adapter_owner`
without moving runtime values. Complete `field_between_rooms` requests
still use `screening_mass_law_curve_seed_v3` and complete
`building_prediction` requests still stop as
`dynamic_calculator_building_prediction_runtime_adapter_owner_missing`.
Gate ER is the value-moving step that should connect the Gate EO direct
curve to Gate I/AR adapter semantics for the bounded direct-fixed
subset while preserving `needs_input` / `unsupported` boundaries.

### Historical 2026-04-27 Snapshot

The following anchors are retained as historical architecture context.
They are not the active next-slice map.

Current hotspots:

- selected wall single-leaf calibration anchors:
  - `docs/calculator/CHECKPOINT_2026-04-27_WALL_COVERAGE_EXPANSION_PLANNING_V2_GATE_A_HANDOFF.md`
  - `docs/calculator/SLICE_WALL_SINGLE_LEAF_MASS_LAW_CALIBRATION_PLAN.md`
  - `packages/engine/src/wall-coverage-expansion-planning-v2-gate-a-contract.test.ts`
  - `tools/dev/run-calculator-current-gate.ts`
- closed wall coverage planning anchors:
  - `docs/calculator/SLICE_WALL_COVERAGE_EXPANSION_PLANNING_V2_PLAN.md`
  - `packages/engine/src/calculator-source-gap-revalidation-gate-a-contract.test.ts`
- closed source-gap revalidation anchors:
  - `docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_PLAN.md`
  - `docs/calculator/SOURCE_GAP_LEDGER.md`
  - `docs/calculator/CALCULATION_MODEL_AND_VALIDATION.md`
  - `packages/engine/src/post-proposal-report-polish-next-slice-selection-contract.test.ts`
- closed proposal/report polish anchors:
  - `docs/calculator/SLICE_PROPOSAL_REPORT_POLISH_PLAN.md`
  - `apps/web/features/workbench/simple-workbench-proposal-generated-document-honesty.test.ts`
  - `apps/web/features/workbench/simple-workbench-proposal.test.ts`
  - `apps/web/features/workbench/simple-workbench-proposal-simple.ts`
  - `apps/web/features/workbench/simple-workbench-proposal.ts`
- closed route-policy integration anchors:
  - `docs/calculator/SLICE_PROJECT_ACCESS_POLICY_ROUTE_INTEGRATION_PLAN.md`
  - `docs/calculator/POST_CALCULATOR_PRODUCTIZATION_ROADMAP.md`
  - `apps/web/lib/project-route-auth.test.ts`
  - `apps/web/lib/server-project-routes.test.ts`
- closed calculator re-entry anchors:
  - `docs/calculator/CHECKPOINT_2026-04-26_DYNAMIC_AIRBORNE_SPLIT_V2_GATE_C_CLOSEOUT_HANDOFF.md`
  - `docs/calculator/SLICE_REALISTIC_LAYER_COMBINATION_COVERAGE_CARTOGRAPHY_PLAN.md`
  - `docs/calculator/DYNAMIC_AIRBORNE_CARTOGRAPHY.md`
  - `packages/engine/src/post-dynamic-airborne-split-refactor-v2-gate-c-next-slice-selection-contract.test.ts`
  - `docs/calculator/CHECKPOINT_2026-04-24_INVALID_THICKNESS_GATE_A_HANDOFF.md`
  - `docs/calculator/CHECKPOINT_2026-04-24_INVALID_THICKNESS_BASELINE_READY_HANDOFF.md`
  - `docs/calculator/CHECKPOINT_2026-04-24_FLOOR_LAYER_ORDER_CLOSEOUT_HANDOFF.md`
  - `docs/calculator/SLICE_ALL_CALLER_INVALID_THICKNESS_GUARD_PLAN.md`
  - `packages/engine/src/all-caller-invalid-thickness-guard-gate-a-matrix.test.ts`
  - `packages/engine/src/post-floor-layer-order-gate-c-v1-next-slice-selection-contract.test.ts`
  - `docs/calculator/CHECKPOINT_2026-04-24_FLOOR_LAYER_ORDER_GATE_A_HANDOFF.md`
  - `docs/calculator/SLICE_FLOOR_LAYER_ORDER_EDIT_STABILITY_PLAN.md`
  - `packages/engine/src/floor-layer-order-edit-stability-gate-a-matrix.test.ts`
  - `apps/web/features/workbench/floor-layer-order-edit-stability-gate-a-card-matrix.test.ts`
  - `docs/calculator/CHECKPOINT_2026-04-24_FLOOR_MANY_LAYER_CLOSEOUT_HANDOFF.md`
  - `packages/engine/src/post-floor-many-layer-gate-c-v1-next-slice-selection-contract.test.ts`
  - `docs/calculator/SLICE_FLOOR_MANY_LAYER_STRESS_REGRESSION_PLAN.md`
  - `docs/calculator/CHECKPOINT_2026-04-24_FLOOR_MANY_LAYER_GATE_A_HANDOFF.md`
  - `packages/engine/src/floor-many-layer-stress-gate-a-matrix.test.ts`
  - `apps/web/features/workbench/floor-many-layer-stress-gate-a-card-matrix.test.ts`
  - `docs/calculator/CHECKPOINT_2026-04-24_FLOOR_FIELD_CONTINUATION_CLOSEOUT_HANDOFF.md`
  - `packages/engine/src/post-floor-field-continuation-gate-c-v1-next-slice-selection-contract.test.ts`
  - `docs/calculator/SLICE_FLOOR_FIELD_CONTINUATION_EXPANSION_PLAN.md`
  - `docs/calculator/CHECKPOINT_2026-04-24_FLOOR_FIELD_CONTINUATION_GATE_A_HANDOFF.md`
  - `packages/engine/src/floor-field-continuation-gate-a-matrix.test.ts`
  - `apps/web/features/workbench/floor-field-continuation-gate-a-card-matrix.test.ts`
  - `docs/calculator/CHECKPOINT_2026-04-24_RESILIENT_SIDE_COUNT_GATE_C_CLOSEOUT_HANDOFF.md`
  - `packages/engine/src/post-wall-resilient-side-count-gate-c-v1-next-slice-selection-contract.test.ts`
  - `docs/calculator/SLICE_WALL_RESILIENT_BAR_SIDE_COUNT_MODELING_PLAN.md`
  - `docs/calculator/CHECKPOINT_2026-04-24_RESILIENT_SIDE_COUNT_GATE_B_LANDED_HANDOFF.md`
  - `docs/calculator/CHECKPOINT_2026-04-24_RESILIENT_SIDE_COUNT_GATE_B_READY_HANDOFF.md`
  - `docs/calculator/CHECKPOINT_2026-04-23_WALL_TIMBER_LIGHTWEIGHT_SOURCE_CORPUS_CLOSEOUT_HANDOFF.md`
  - `packages/engine/src/wall-resilient-bar-side-count-blind-audit.test.ts`
  - `apps/web/features/workbench/wall-resilient-bar-side-count-route-card-matrix.test.ts`
  - `apps/web/features/workbench/wall-resilient-bar-side-count-input-contract.test.ts`
  - `packages/engine/src/post-wall-resilient-side-count-gate-b-v1-next-slice-selection-contract.test.ts`
  - `packages/engine/src/post-wall-timber-lightweight-source-corpus-v1-next-slice-selection-contract.test.ts`
  - `docs/calculator/SLICE_WALL_TIMBER_LIGHTWEIGHT_SOURCE_CORPUS_PLAN.md`
  - `apps/web/features/workbench/wall-lsf-timber-stud-preset-benchmarks.test.ts`
  - `apps/web/features/workbench/wall-field-continuation-completeness-matrix.test.ts`
  - `apps/web/features/workbench/wall-live-dynamic-preset-route-card-matrix.test.ts`
  - `apps/web/features/workbench/wall-direct-timber-exact-route-card-matrix.test.ts`
  - `packages/engine/src/coverage-grid-consistency.test.ts`
- selected productization anchors:
  - `apps/web/lib/project-access-policy.ts`
  - `apps/web/lib/project-access-policy.test.ts`
  - `apps/web/lib/project-route-auth.ts`
  - `apps/web/lib/project-storage-auth.ts`
  - `apps/web/lib/server-project-routes.test.ts`
  - `docs/calculator/SLICE_PROJECT_ACCESS_POLICY_ROUTE_INTEGRATION_PLAN.md` (deferred)
  - `docs/calculator/CHECKPOINT_2026-04-23_TEAM_ACCESS_MODEL_HANDOFF.md`
- selected closeout and follow-up anchors:
  - `packages/engine/src/post-blocked-source-backed-widening-rerank-next-slice-selection-contract.test.ts`
  - `packages/engine/src/post-mixed-floor-wall-seeded-cross-mode-chain-next-slice-selection-contract.test.ts`
  - `packages/engine/src/post-blocked-source-backed-widening-rerank-refresh-next-slice-selection-contract.test.ts`
  - `packages/engine/src/post-dataholz-gdmtxa04a-composite-surface-model-design-next-slice-selection-contract.test.ts`
  - `packages/engine/src/source-gap-candidate-re-rank-contract.test.ts`
  - `packages/engine/src/blocked-source-rank-1-gdmtxa04a-feasibility-contract.test.ts`
  - `packages/engine/src/dataholz-gdmtxa04a-composite-surface-model.ts`
  - `packages/engine/src/clt-local-combined-interaction-evidence-matrix.test.ts`
  - `packages/engine/src/clt-local-combined-exact-anchor-pack.test.ts`
  - `packages/engine/src/raw-terminal-concrete-helper-origin-matrix.test.ts`
  - `packages/engine/src/raw-terminal-concrete-helper-split-topology-matrix.test.ts`
  - `packages/engine/src/raw-terminal-concrete-helper-split-topology-origin-matrix.test.ts`
  - `packages/engine/src/raw-terminal-concrete-helper-partial-order-matrix.test.ts`
  - `packages/engine/src/raw-terminal-concrete-helper-partial-order-origin-matrix.test.ts`
  - `packages/engine/src/post-raw-terminal-concrete-helper-family-widening-next-slice-selection-contract.test.ts`
  - `packages/engine/src/post-clt-local-combined-interaction-evidence-next-slice-selection-contract.test.ts`
  - `packages/engine/src/post-reinforced-concrete-accuracy-reopen-next-slice-selection-contract.test.ts`
  - `packages/engine/src/tuas-clt-backlog-decision-contract.test.ts`
  - `packages/engine/src/dataholz-clt-source-truth-audit.test.ts`
  - `packages/engine/src/dataholz-clt-calibration-tightening-audit.test.ts`
  - `packages/engine/src/reinforced-concrete-formula-family-closeout-audit.test.ts`
  - `packages/engine/src/reinforced-concrete-low-confidence-follow-up-matrix.test.ts`
  - `packages/engine/src/reinforced-concrete-low-confidence-follow-up-origin-matrix.test.ts`
  - `packages/engine/src/reinforced-concrete-family-formula-fit-audit.test.ts`
  - `packages/engine/src/reinforced-concrete-low-confidence-edge-continuity.test.ts`
  - `packages/engine/src/reinforced-concrete-visible-low-confidence-edge-continuity.test.ts`
  - `packages/engine/src/reinforced-concrete-combined-vinyl-elastic-ceiling-estimate.test.ts`
  - `apps/web/features/workbench/raw-terminal-concrete-helper-output-origin-card-matrix.test.ts`
  - `apps/web/features/workbench/raw-terminal-concrete-helper-split-topology-route-card-matrix.test.ts`
  - `apps/web/features/workbench/raw-terminal-concrete-helper-split-topology-output-origin-card-matrix.test.ts`
  - `apps/web/features/workbench/raw-terminal-concrete-helper-partial-order-route-card-matrix.test.ts`
  - `apps/web/features/workbench/raw-terminal-concrete-helper-partial-order-output-origin-card-matrix.test.ts`
  - `apps/web/features/workbench/clt-combined-anchor-history-replay-matrix.test.ts`
  - `apps/web/features/workbench/clt-local-combined-exact-anchor-route-card-matrix.test.ts`
  - `apps/web/features/workbench/reinforced-concrete-low-confidence-impact-panels.test.ts`
  - `apps/web/features/workbench/reinforced-concrete-low-confidence-follow-up-route-card-matrix.test.ts`
  - `apps/web/features/workbench/reinforced-concrete-low-confidence-follow-up-provenance-matrix.test.ts`
  - `apps/web/features/workbench/reinforced-concrete-low-confidence-diagnostics-dossier-matrix.test.ts`
  - `apps/web/features/workbench/reinforced-concrete-low-confidence-consultant-trail-matrix.test.ts`
  - `apps/web/features/workbench/reinforced-concrete-low-confidence-proposal-honesty.test.ts`
  - `apps/web/features/workbench/dataholz-clt-source-truth-route.test.ts`
  - `packages/engine/src/dataholz-gdmtxa04a-composite-surface-model-design.test.ts`
  - `packages/engine/src/dataholz-gdmtxa04a-material-surface-recheck.test.ts`
  - `packages/engine/src/tuas-c11c-exact-import-readiness.ts`
  - `packages/engine/src/tuas-c11c-exact-import-readiness-design.test.ts`
  - `packages/engine/src/post-tuas-c11c-exact-import-readiness-design-next-slice-selection-contract.test.ts`
  - `packages/engine/src/tuas-c11c-frequency-source-recheck.test.ts`
  - `packages/engine/src/blocked-source-rank-2-c11c-feasibility-contract.test.ts`
  - `packages/engine/src/blocked-source-rank-3-raw-bare-open-box-open-web-feasibility-contract.test.ts`
  - `packages/engine/src/post-raw-bare-open-box-open-web-impact-widening-next-slice-selection-contract.test.ts`
  - `packages/engine/src/blocked-source-rank-4-wall-selector-feasibility-contract.test.ts`
  - `packages/engine/src/post-wall-selector-behavior-widening-next-slice-selection-contract.test.ts`
- selected broad-audit and raw-helper anchors:
  - `packages/engine/src/post-broad-audit-and-replanning-pass-v2-next-slice-selection-contract.test.ts`
  - `packages/engine/src/raw-floor-screening-carrier-support.test.ts`
  - `packages/engine/src/raw-concrete-helper-answer-guard.test.ts`
  - `packages/engine/src/raw-terminal-concrete-helper-widening-matrix.test.ts`
  - `packages/engine/src/raw-floor-hostile-input-answer-matrix.test.ts`
  - `packages/engine/src/raw-floor-safe-bare-split-parity.test.ts`
  - `packages/engine/src/output-origin-trace-matrix.test.ts`
  - `apps/web/features/workbench/raw-floor-screening-route-support.test.ts`
  - `apps/web/features/workbench/raw-concrete-helper-route-card-guard.test.ts`
  - `apps/web/features/workbench/raw-terminal-concrete-helper-route-card-matrix.test.ts`
  - `apps/web/features/workbench/raw-floor-hostile-input-route-card-matrix.test.ts`
  - `apps/web/features/workbench/raw-floor-safe-bare-split-parity.test.ts`
- focused gate entrypoint:
  `tools/dev/run-calculator-current-gate.ts`
- final-audit gate additions:
  - `packages/engine/src/coverage-grid-consistency.test.ts`
  - `packages/engine/src/post-good-calculator-final-audit-v1-next-slice-selection-contract.test.ts`
- source-backed widening ledger:
  `docs/calculator/SOURCE_GAP_LEDGER.md`

In this historical 2026-04-27 snapshot, the then-selected next slice was
a wall single-leaf source/formula contract slice:
`wall_single_leaf_mass_law_calibration_v1`. It started by
defining unmatched massive single-leaf wall signatures, formula/source
basis, positive cases, negative cases, exact/lab-fallback precedence,
and UI/card coverage without changing acoustic values, support,
confidence, evidence tiers, or formulas. `calculator_source_gap_revalidation_v1`
and `wall_coverage_expansion_planning_v2` Gate A are closed
no-runtime: closed reinforced, `GDMTXA04A`, `C11c`, raw bare,
wall-selector, floor continuation, floor many-layer, floor layer-order,
timber-stud formula, CLT wall, floor fallback, UI honesty, and route
policy integration tracks stay explicit deferrals or closed references.

## What This System Is Not Yet

To avoid docs drift, be explicit about current non-features:

- not yet a complete multi-user/team project persistence system
- not yet route-enabled for team membership; policy exists, but routes
  remain owner-scoped through the landed owner-only adapter
- not a single-formula calculator
- not a lookup-only calculator; missing exact source data must not block
  a labelled physics prediction when the required inputs are sufficient
- not allowed to fabricate unsupported field or low-frequency outputs
- not complete across every possible floor/wall family corridor
- not free to promote measured-exact/source-validated claims without
  explicit source-backed or guarded planning work

## Reading Guide

- Want current behavior and risks:
  read [CURRENT_STATE.md](./CURRENT_STATE.md)
- Want the next implementation step:
  read [NEXT_IMPLEMENTATION_PLAN.md](./NEXT_IMPLEMENTATION_PLAN.md)
- Want the productization roadmap:
  read [POST_CALCULATOR_PRODUCTIZATION_ROADMAP.md](./POST_CALCULATOR_PRODUCTIZATION_ROADMAP.md)
- Want the active implementation plan:
  read [SLICE_CALCULATOR_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_V1_PLAN.md](./SLICE_CALCULATOR_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_V1_PLAN.md)
- Want answer-origin or support semantics:
  read [CALCULATION_MODEL_AND_VALIDATION.md](./CALCULATION_MODEL_AND_VALIDATION.md)
- Want the last clean resume point:
  read [CHECKPOINT_2026-05-05_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_REPLAN_HANDOFF.md](./CHECKPOINT_2026-05-05_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_REPLAN_HANDOFF.md)
