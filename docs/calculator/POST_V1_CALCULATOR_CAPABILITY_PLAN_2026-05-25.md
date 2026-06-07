# Post-V1 Calculator Capability Plan - 2026-05-25

Document role: implementation-ready post-V1 plan. Read after
[CALCULATOR_SOURCE_OF_TRUTH.md](./CALCULATOR_SOURCE_OF_TRUTH.md). This
file selects the next calculator capability slice and gives future
agents a narrow path that cannot drift into catalog work.

Status: active post-V1 plan. Usable V1 Steps 0-5 are closed for the
current company-internal envelope. The post-V1 calculator-capability
chain has advanced through Gate EK. Gate ED is the latest value-moving
runtime scope slice, Gate DK is the latest calculator surface parity
action, Gate EK is the latest no-runtime numeric coverage/accuracy
rerank, Gate EH is the latest no-runtime input-owner proof, Gate EC is
the previous no-runtime owner proof, Gate DT is the previous mixed-lab
runtime-basis action, Gate DX is the latest runtime-basis accuracy
action, Gate EF is the latest runtime-basis route-boundary action, Gate
EJ is the latest input-surface scope action, and the current selected
next action is:

`post_v1_wall_visible_layer_formula_route_second_pass_gate_el_plan`

Selected Gate EL file:

`packages/engine/src/post-v1-wall-visible-layer-formula-route-second-pass-gate-el-contract.test.ts`

Gate EK/EL plan:

`docs/calculator/POST_V1_GATE_EK_EL_WALL_VISIBLE_LAYER_FORMULA_ROUTE_SECOND_PASS_PLAN_2026-06-07.md`

Latest landed no-runtime numeric coverage/accuracy rerank:

`post_v1_next_numeric_coverage_gap_gate_ek_plan`

Gate EK status:

`post_v1_next_numeric_coverage_gap_gate_ek_landed_no_runtime_selected_wall_visible_layer_formula_route_second_pass_gate_el`

Gate EK selected:

`wall.visible_layer_formula_route_second_pass_after_gate_ej`

Gate EK ran two ROI plan iterations (`roiAnalysisIterations: 2`) after
Gate EJ. It rejects repeating the now-closed ASTM exact-band input
surface, closed floor formula-route gates, already-live open-web/open-box
field-building routes, supportless wall topology entries that correctly
remain `needs_input`, historical Dataholz/C11c/raw source reopens, and
opening/leak holdout tightening. The selected highest-ROI action is the
wall visible-layer formula-route second pass: Gate EL must reconcile the
old wall coverage/source chain against the current post-V1 wall
implementation and select only a fresh visible wall layer subset that
can improve calculator scope or accuracy without weakening metric-basis
or `needs_input` / `unsupported` boundaries. Counters: `candidateCount
10`, `roiAnalysisIterations: 2`, `estimatedNextWallCoverageLedgers 1`,
`estimatedNextRouteFamilyCandidatesToReconcile 8`,
`newCalculableLayerTemplates 0`, `newCalculableRequestShapes 0`,
`runtimeBasisPromotions 0`, `runtimeFormulaRetunes 0`,
`runtimeValuesMoved 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`. Gate EK selects
`post_v1_wall_visible_layer_formula_route_second_pass_gate_el_plan`
in
`packages/engine/src/post-v1-wall-visible-layer-formula-route-second-pass-gate-el-contract.test.ts`.

Gate EI/EJ plan:

`docs/calculator/POST_V1_GATE_EI_EJ_ASTM_IIC_AIIC_EXACT_BAND_INPUT_SURFACE_PLAN_2026-06-07.md`

Latest landed input-surface scope action:

`post_v1_floor_astm_iic_aiic_exact_band_input_surface_gate_ej_plan`

Gate EJ status:

`post_v1_floor_astm_iic_aiic_exact_band_input_surface_gate_ej_landed_surface_parity_selected_next_numeric_coverage_gap_gate_ek`

Gate EJ selected:

`post_v1_next_numeric_coverage_gap_gate_ek_plan`

Gate EJ closes the Gate EI selected `floor.astm_iic_aiic_user_band_input_surface`
scope gap. Explicitly ASTM-labelled one-third-octave user/import impact
bands now carry `standardMethod` through shared estimate, shared
impact-only, API forwarding, and the workbench exact-band import helper.
Lab `ASTM E492 / ASTM E989` bands calculate owned `IIC`; field
`ASTM E1007 / ASTM E989` bands calculate owned `AIIC`. ISO import
defaults remain ISO, missing/ambiguous standard methods and lab/field
metric mismatch remain stopped, and formula-derived ISO `Ln,w`,
`DeltaLw`, `CI`, or `CI,50-2500` does not alias to ASTM ratings.
Counters: `inputSurfaceLedgers 1`,
`newCalculableMetricBasisRequestShapes: 2`,
`newCalculableLayerTemplates 0`, `newCalculableRequestShapes 0`,
`runtimeBasisPromotions 0`, `runtimeFormulaRetunes 0`,
`runtimeValuesMoved 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 1`. Gate EJ selects
`post_v1_next_numeric_coverage_gap_gate_ek_plan`
in
`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ek-contract.test.ts`.

Latest landed no-runtime numeric coverage/accuracy rerank:

`post_v1_next_numeric_coverage_gap_gate_ei_plan`

Gate EI status:

`post_v1_next_numeric_coverage_gap_gate_ei_landed_no_runtime_selected_floor_astm_iic_aiic_exact_band_input_surface_gate_ej`

Gate EI selected:

`floor.astm_iic_aiic_user_band_input_surface`

Gate EI ran two ROI plan iterations (`roiAnalysisIterations: 2`) after
Gate EH. Gate EH proved the ASTM exact-band owner, shared/API payloads
already carry `exactImpactSource.standardMethod`, and the remaining
high-ROI scope move is the selected input surface that lets explicitly
ASTM-labelled one-third-octave user/import bands publish owned `IIC` /
`AIIC` without turning ISO bands or formula-derived ISO impact values
into ASTM ratings. Gate EI rejects closed formula-route repeats,
already-live held-AAC/grouped multicavity and open-web/open-box
field-building routes, cross-family lower-treatment `DeltaLw`
subtraction, opening/leak holdout tightening, broad source crawling,
and confidence/frontend polish. Counters: `candidateCount 10`,
`roiAnalysisIterations: 2`, `estimatedNextInputSurfaceLedgers 1`,
`estimatedNextNewCalculableMetricBasisRequestShapes 2`,
`newCalculableLayerTemplates 0`, `newCalculableRequestShapes 0`,
`runtimeBasisPromotions 0`, `runtimeFormulaRetunes 0`,
`runtimeValuesMoved 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`. Gate EI selects
`post_v1_floor_astm_iic_aiic_exact_band_input_surface_gate_ej_plan`
in
`packages/engine/src/post-v1-floor-astm-iic-aiic-exact-band-input-surface-gate-ej-contract.test.ts`.

Latest landed no-runtime input-owner proof:

`post_v1_floor_astm_iic_aiic_exact_band_input_owner_gate_eh_plan`

Gate EH status:

`post_v1_floor_astm_iic_aiic_exact_band_input_owner_gate_eh_landed_no_runtime_selected_next_numeric_coverage_gap_gate_ei`

Gate EH owner:

`floor.astm_iic_aiic.exact_band_standard_method_owner`

Gate EH closes the Gate EG selected ASTM exact-band input owner. Lab
ASTM E492/E989 exact one-third-octave sources own `IIC`, field ASTM
E1007/E989 exact one-third-octave sources own `AIIC`, and ISO
one-third-octave sources or missing/ambiguous `standardMethod` do not
publish ASTM ratings. Gate EH moves no runtime values, retunes no
formulas, imports no source rows, and touches no frontend
implementation. Counters: `acceptedOwnerLedgers: 1`,
`astmExactBandRequestShapesPinned: 2`,
`newCalculableLayerTemplates 0`, `newCalculableRequestShapes 0`,
`runtimeBasisPromotions 0`, `runtimeFormulaRetunes 0`,
`runtimeValuesMoved 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`. Gate EH selects
`post_v1_next_numeric_coverage_gap_gate_ei_plan`
in
`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ei-contract.test.ts`.

Gate EG/EH plan:

`docs/calculator/POST_V1_GATE_EG_EH_ASTM_IIC_AIIC_EXACT_BAND_INPUT_OWNER_PLAN_2026-06-07.md`

Previous landed no-runtime numeric coverage/accuracy rerank:

`post_v1_next_numeric_coverage_gap_gate_eg_plan`

Gate EG status:

`post_v1_next_numeric_coverage_gap_gate_eg_landed_no_runtime_selected_floor_astm_iic_aiic_exact_band_input_owner_gate_eh`

Gate EG selected:

`floor.astm_iic_aiic_exact_band_user_input_owner_gap`

Gate EG ran two ROI plan iterations (`roiAnalysisIterations: 2`) after
Gate EF. The highest-ROI next slice is the ASTM exact-band input owner:
the engine already owns ASTM E492/E1007 one-third-octave `IIC` /
`AIIC` through the ASTM E989 owner, and shared/API schemas already carry
`exactImpactSource` with `standardMethod`, but user/import surfaces need
a pinned owner boundary before ASTM bands can be promoted safely.
Open-web/open-box field-building repeats are already live, lower
treatment `DeltaLw` subtraction remains wrong-metric, and residual
holdout tightening remains blocked. Counters: `candidateCount 12`,
`roiAnalysisIterations: 2`, `estimatedNextInputOwnerLedgers 1`,
`estimatedFollowingNewCalculableMetricBasisRequestShapesIfGateEHProvesOwner 2`,
`newCalculableLayerTemplates 0`, `newCalculableRequestShapes 0`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.
Gate EG selects
`post_v1_floor_astm_iic_aiic_exact_band_input_owner_gate_eh_plan`
in
`packages/engine/src/post-v1-floor-astm-iic-aiic-exact-band-input-owner-gate-eh-contract.test.ts`.

Gate EF plan:

`docs/calculator/POST_V1_GATE_EE_EF_COMPOSITE_PANEL_SUSPENDED_CEILING_ROUTE_PLAN_2026-06-07.md`

Latest landed runtime-basis route-boundary action:

`post_v1_floor_composite_panel_suspended_ceiling_only_route_boundary_gate_ef_plan`

Gate EF status:

`post_v1_floor_composite_panel_suspended_ceiling_only_route_boundary_gate_ef_landed_runtime_basis_no_value_selected_next_numeric_coverage_gap_gate_eg`

Gate EF closes the Gate EE selected composite-panel
suspended-ceiling-only route boundary. The visible
`steel_deck_composite 150 / resilient_channel 150 / rockwool 100 / 2 x
firestop_board 16` stack now pins the owned Gate CY route
`predictor_composite_panel_published_interaction_estimate` instead of
the stale upstream low-confidence expectation. It publishes `Rw 48.6 /
Ln,w 63.3 / DeltaLw 20.7` with runtime candidate
`floor.composite_panel.published_interaction_family_solver`. Gate EF
does not retune formulas, import source rows, promote ASTM `IIC` /
`AIIC`, or derive generic lower-treatment `DeltaLw` for open-web,
hollow-core, steel, Pliteq, or Knauf lanes. Counters:
`routeBoundaryLedgersPinned: 1`,
`staleLowConfidenceParityRowsCorrected: 1`,
`newCalculableLayerTemplates 0`, `newCalculableRequestShapes 0`,
`runtimeBasisPromotions: 0`, `runtimeValuesMoved: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.
Gate EF selects `post_v1_next_numeric_coverage_gap_gate_eg_plan` in
`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-eg-contract.test.ts`.

Latest landed no-runtime numeric coverage/accuracy rerank:

`post_v1_next_numeric_coverage_gap_gate_ee_plan`

Gate EE status:

`post_v1_next_numeric_coverage_gap_gate_ee_landed_no_runtime_selected_floor_composite_panel_suspended_ceiling_only_route_boundary_gate_ef`

Gate EE candidate:

`floor.composite_panel_suspended_ceiling_only_route_boundary`

Gate EE selected the composite-panel suspended-ceiling-only route
boundary after two ROI plan iterations (`roiAnalysisIterations: 2`).
Gate CY already owns the composite-panel published-interaction family,
and the visible suspended-ceiling-only stack currently resolves to
`predictor_composite_panel_published_interaction_estimate` with
`Rw 48.6 / Ln,w 63.3 / DeltaLw 20.7`. The open issue is route
ownership, not a formula retune: a legacy layer-driven parity row still
expects `predictor_floor_system_low_confidence_estimate` for the same
visible stack. Gate EF must either pin the owned published-family route
or add a guard if the current owner is disproven. Gate EE rejects ASTM
user-band intake, explicit CI input-surface work, held-AAC missing
topology, opening/leak holdout tightening, wrong-metric lower-treatment
`DeltaLw` derivations, broad source crawling, and frontend polish as
lower ROI for the current calculator goal. Counters: `candidateCount
10`, `roiAnalysisIterations: 2`, `estimatedNextAccuracyBoundaryLedgers
1`, `estimatedNextRuntimeCorrectedLayerTemplates 1`,
`estimatedNextRuntimeCorrectedRequestShapes 3`,
`newCalculableLayerTemplates 0`, `newCalculableRequestShapes 0`,
`runtimeValuesMoved 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`. Gate EE selects
`post_v1_floor_composite_panel_suspended_ceiling_only_route_boundary_gate_ef_plan`
in
`packages/engine/src/post-v1-floor-composite-panel-suspended-ceiling-only-route-boundary-gate-ef-contract.test.ts`.

Latest landed value-moving runtime action:

`post_v1_floor_heavy_concrete_combined_resilient_channel_lower_treatment_runtime_gate_ed_plan`

Gate ED status:

`post_v1_floor_heavy_concrete_combined_resilient_channel_lower_treatment_runtime_gate_ed_landed_runtime_selected_next_numeric_coverage_gap_gate_ee`

Gate ED closes the Gate EC selected resilient-channel lower-treatment
runtime gap. Visible heavy-concrete combined upper/lower stacks with
`resilient_channel` lower treatment and complete route-required
`loadBasisKgM2`, `resilientLayerDynamicStiffnessMNm3`, base slab,
floating/topping layer, board schedule, cavity depth, and cavity fill
now route through the existing
`predictor_heavy_combined_upper_lower_floor_iso12354_annexc_estimate`
formula corridor. The newly calculable visible stack publishes
`Ln,w 44.6 / DeltaLw 29.9` with runtime candidate
`floor.heavy_concrete_combined_upper_lower.lab_impact_formula`. Missing
route-required physical inputs remain `needs_input`, adjacent
`furring_channel`, `acoustic_hanger_ceiling`, and
`resilient_stud_ceiling` pins are unchanged, and ISO `DeltaLw` still
does not alias to ASTM `IIC` / `AIIC`. Gate ED moves runtime scope but
does not retune the formula, import source rows, or touch frontend
implementation. Counters: `newCalculableLayerTemplates 1`,
`newCalculableRequestShapes 4`, `runtimeCorrectedLayerTemplates 1`,
`runtimeCorrectedRequestShapes 4`, `formulaCorridorGuardsWeakened 0`,
`astmAliasesPromoted 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`. Gate ED selects
`post_v1_next_numeric_coverage_gap_gate_ee_plan`
in
`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ee-contract.test.ts`.

Latest landed no-runtime owner proof:

`post_v1_floor_heavy_concrete_combined_resilient_channel_lower_treatment_owner_gate_ec_plan`

Gate EC status:

`post_v1_floor_heavy_concrete_combined_resilient_channel_lower_treatment_owner_gate_ec_landed_no_runtime_selected_resilient_channel_lower_treatment_runtime_gate_ed`

Gate EC owner:

`floor.heavy_concrete_combined.resilient_channel_lower_treatment_owner`

Gate EC proves the bounded visible heavy-concrete combined upper/lower
`resilient_channel` lower-treatment owner before runtime values move.
The owner is only the existing heavy-concrete combined ISO 12354-2
Annex C formula corridor with complete route-required physical inputs:
`structuralSupportType=reinforced_concrete`,
`impactSystemType=combined_upper_lower_system`, visible
`resilient_channel`, `supportProductId=resilient_channel`,
`lowerTreatment.type=suspended_ceiling_elastic_hanger`,
`baseSlabOrFloor`, `floatingOrToppingLayer`,
`resilientLayerDynamicStiffnessMNm3`, `loadBasisKgM2`,
`ceilingBoardSchedule`, `ceilingCavityDepthMm`, and
`ceilingFillThicknessMm`. Gate EC keeps adjacent already-live
`furring_channel`, `acoustic_hanger_ceiling`, and
`resilient_stud_ceiling` corridors unchanged, missing route-required
physical inputs as `needs_input`, the old generic reinforced-concrete
low-confidence fallback closed, wrong-metric lower-treatment `DeltaLw`
subtraction rejected, and ASTM `IIC` / `AIIC` unsupported. Gate EC
moves no runtime values, imports no source rows, and touches no
frontend implementation. Counters: `acceptedOwnerLedgers: 1`,
`estimatedNextNewCalculableLayerTemplates 1`,
`estimatedNextNewCalculableRequestShapes 4`,
`newCalculableLayerTemplates 0`, `newCalculableRequestShapes 0`,
`runtimeBasisPromotions 0`, `runtimeValuesMoved 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.
Gate EC selects
`post_v1_floor_heavy_concrete_combined_resilient_channel_lower_treatment_runtime_gate_ed_plan`
in
`packages/engine/src/post-v1-floor-heavy-concrete-combined-resilient-channel-lower-treatment-runtime-gate-ed-contract.test.ts`.
Gate ED is the value-moving runtime slice expected to calculate the
visible `resilient_channel` stack as `Ln,w 44.6 / DeltaLw 29.9`
through
`predictor_heavy_combined_upper_lower_floor_iso12354_annexc_estimate`
when all required physical inputs are present.

Latest landed no-runtime numeric coverage/accuracy rerank:

`post_v1_next_numeric_coverage_gap_gate_eb_plan`

Gate EB status:

`post_v1_next_numeric_coverage_gap_gate_eb_landed_no_runtime_selected_floor_heavy_concrete_combined_resilient_channel_lower_treatment_owner_gate_ec`

Gate EB candidate:

`floor.heavy_concrete_combined_resilient_channel_lower_treatment_owner_gap`

Gate EB selected the heavy-concrete combined resilient-channel
lower-treatment owner proof after two ROI plan iterations
(`roiAnalysisIterations: 2`). The selected gap is a visible
heavy-concrete combined upper/lower stack with `resilient_channel`
lower treatment: with route-required `loadBasisKgM2` and
`resilientLayerDynamicStiffnessMNm3` it currently publishes airborne
`Rw` / `Ctr` but keeps `Ln,w` and `DeltaLw` unsupported behind the
lower-assembly owner boundary. Nearby `furring_channel`,
`acoustic_hanger_ceiling`, and `resilient_stud_ceiling` stacks already
calculate through the existing heavy-concrete combined formula corridor.
Gate EC must prove whether `resilient_channel` can be mapped to that
owner without reopening the old reinforced-concrete low-confidence
fallback. Gate EB rejects open-web/hollow-core/Pliteq/Knauf
lower-treatment row subtraction as wrong metric derivation, keeps ASTM
`IIC` / `AIIC` separate, preserves `loadBasisKgM2`,
`resilientLayerDynamicStiffnessMNm3`, and `ceilingOrLowerAssembly`
guards, imports no source rows, and touches no frontend implementation.
Counters: `candidateCount 10`, `estimatedNextOwnerLedgers 1`,
`estimatedFollowingNewCalculableLayerTemplatesIfGateECProvesOwner 1`,
`estimatedFollowingNewCalculableRequestShapesIfGateECProvesOwner 4`,
`newCalculableLayerTemplates 0`, `newCalculableRequestShapes 0`,
`runtimeBasisPromotions 0`, `runtimeValuesMoved 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.
Gate EB selects
`post_v1_floor_heavy_concrete_combined_resilient_channel_lower_treatment_owner_gate_ec_plan`
in
`packages/engine/src/post-v1-floor-heavy-concrete-combined-resilient-channel-lower-treatment-owner-gate-ec-contract.test.ts`.

Latest landed value-moving runtime action:

`post_v1_floor_mass_timber_clt_upper_package_delta_lw_runtime_gate_ea_plan`

Gate EA status:

`post_v1_floor_mass_timber_clt_upper_package_delta_lw_runtime_gate_ea_landed_runtime_selected_next_numeric_coverage_gap_gate_eb`

Gate EA candidate:

`candidate_mass_timber_clt_upper_package_delta_lw_same_source_pair`

Gate EA closes the Gate DZ selected CLT upper-package `DeltaLw`
runtime gap. The five accepted TUAS same-source/same-carrier upper-only
CLT treated rows now keep exact measured `Ln,w` and calculate the
companion `DeltaLw`: X3/X2 `Ln,w 52 / DeltaLw 9`, X4/X2 `Ln,w 50 /
DeltaLw 11`, C3/C2 `Ln,w 47 / DeltaLw 8`, C4/C2 `Ln,w 45 /
DeltaLw 10`, and C7/C2 `Ln,w 39 / DeltaLw 16`. The companion uses
the `open_measured_floor_system_exact_match` basis, carries
`bareReferenceLnW` / `treatedReferenceLnW`, and does not import source
rows or create a product catalog. X2/C2 reference rows, X5/C5
non-positive deltas, C2c/C3c/C4c/C5c/C7c lower-treatment combined
rows, shorthand/published-family estimates without the exact pair,
cross-family borrowing, and ASTM `IIC` / `AIIC` aliases remain
unsupported. The existing timber/CLT formula corridor still requires
`loadBasisKgM2` and `resilientLayerDynamicStiffnessMNm3` when it is not
using an accepted same-source exact pair. Counters:
`newCalculableLayerTemplates: 5`, `newCalculableRequestShapes: 5`,
`runtimeCorrectedLayerTemplates 5`, `runtimeCorrectedRequestShapes 5`,
`sourceRowsImported 0`, `formulaCorridorGuardsWeakened 0`,
`astmAliasesPromoted 0`, and `frontendImplementationFilesTouched: 0`.
Gate EA selects `post_v1_next_numeric_coverage_gap_gate_eb_plan` in
`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-eb-contract.test.ts`.

Latest landed no-runtime owner proof:

`post_v1_floor_mass_timber_clt_upper_package_delta_lw_owner_gate_dz_plan`

Gate DZ status:

`post_v1_floor_mass_timber_clt_upper_package_delta_lw_owner_gate_dz_landed_no_runtime_selected_mass_timber_clt_upper_package_delta_lw_runtime_gate_ea`

Gate DZ owner:

`floor.mass_timber_clt.upper_package_delta_lw_same_source_reference_owner`

Gate DZ proves the bounded same-source/same-carrier mass-timber CLT
upper-package `DeltaLw` owner policy before runtime values move. It
accepts only five TUAS open-measured upper-only CLT pairs with the same
reference finish package and positive measured `Ln,w` reduction: X3/X2
`DeltaLw 9`, X4/X2 `DeltaLw 11`, C3/C2 `DeltaLw 8`, C4/C2
`DeltaLw 10`, and C7/C2 `DeltaLw 16`. It rejects X2/C2 baselines as
reference-only rows, X5/C5 non-positive deltas, C2c/C3c/C4c/C5c/C7c
combined lower-treatment rows, shorthand/published-family estimates
without the exact pair, cross-family borrowing, and ASTM `IIC` / `AIIC`
aliases. Counters: `acceptedSameSourcePairs: 5`,
`rejectedBoundaryExamples 9`, `estimatedNextNewCalculableLayerTemplates
5`, `estimatedNextNewCalculableRequestShapes 5`,
`newCalculableLayerTemplates 0`, `newCalculableRequestShapes 0`,
`runtimeBasisPromotions 0`, `runtimeValuesMoved 0`,
`sourceRowsImported 0`, `broadSourceCrawlSelected false`, and
`frontendImplementationFilesTouched: 0`. Gate DZ selects
`post_v1_floor_mass_timber_clt_upper_package_delta_lw_runtime_gate_ea_plan`
in
`packages/engine/src/post-v1-floor-mass-timber-clt-upper-package-delta-lw-runtime-gate-ea-contract.test.ts`.

Previous landed no-runtime numeric coverage/accuracy rerank:

`post_v1_next_numeric_coverage_gap_gate_dy_plan`

Gate DY status:

`post_v1_next_numeric_coverage_gap_gate_dy_landed_no_runtime_selected_floor_mass_timber_clt_upper_package_delta_lw_owner_gate_dz`

Gate DY selected `floor.mass_timber_clt_upper_package_delta_lw_owner_gap`
after two ROI plan iterations (`roiAnalysisIterations: 2`). It did not
move runtime values. Held-AAC without `supportTopology` remains a
correct `needs_input` boundary, explicit impact `CI` / `CI,50-2500` /
`Ln,w+CI` / `L'nT,50` already calculate with `impactFieldContext`, and
broad bare-minus-treated `DeltaLw` subtraction across unrelated floor
lanes is rejected. Gate DZ must first prove a bounded same-family
mass-timber CLT upper-package `DeltaLw` owner before runtime values
move. Counters: `candidateCount 10`, `estimatedNextOwnerLedgers 1`,
`estimatedFollowingNewCalculableLayerTemplatesIfGateDZProvesOwner 2`,
`estimatedFollowingNewCalculableRequestShapesIfGateDZProvesOwner 2`,
`runtimeBasisPromotions 0`, `newCalculableLayerTemplates 0`,
`newCalculableRequestShapes 0`, `runtimeValuesMoved 0`,
`roiAnalysisIterations: 2`, and `frontendImplementationFilesTouched: 0`.
Gate DY selects
`post_v1_floor_mass_timber_clt_upper_package_delta_lw_owner_gate_dz_plan`
in
`packages/engine/src/post-v1-floor-mass-timber-clt-upper-package-delta-lw-owner-gate-dz-contract.test.ts`.

Latest landed runtime-basis accuracy action:

`post_v1_wall_exact_source_field_context_basis_gate_dx_plan`

Gate DX status:

`post_v1_wall_exact_source_field_context_basis_gate_dx_landed_runtime_basis_no_value_selected_next_numeric_coverage_gap_gate_dy`

Gate DX closes the Gate DW selected wall exact-source family
field-context basis gap without moving numeric values. Generated
`wall-masonry-brick` field keeps `R'w 40 / Dn,w 40 / DnT,w 42 /
DnT,A 41.3`; generated `wall-lsf-knauf` field keeps `R'w 51 / Dn,w 51
/ DnT,w 52 / DnT,A 51.1`. Both now select
`gate_dx_exact_source_family_calculated_field_context_runtime` with
runtime candidate `candidate_exact_source_family_calculated_field_context`
instead of `screening_fallback`. Explicit `airtightness:"good"` lab
anchor field deltas keep precedence, lab mixed companions remain on
Gates DT/DV, held-AAC multicavity-style flat lists still need explicit
support/topology inputs, and no frontend implementation was touched.
Counters: `runtimeBasisPromotions: 2`,
`runtimeCorrectedLayerTemplates 2`, `runtimeCorrectedRequestShapes 8`,
`protectedExactAnchorRequestShapes 2`, `protectedLabRequestShapes 2`,
`protectedNeedsInputRequestShapes 1`, `newCalculableLayerTemplates 0`,
`newCalculableRequestShapes 0`, and `runtimeValuesMoved: 0`. Gate DX
selects `post_v1_next_numeric_coverage_gap_gate_dy_plan` in
`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-dy-contract.test.ts`.

Latest no-runtime numeric coverage/accuracy rerank:

`post_v1_next_numeric_coverage_gap_gate_dw_plan`

Gate DW status:

`post_v1_next_numeric_coverage_gap_gate_dw_landed_no_runtime_selected_wall_exact_source_field_context_basis_gate_dx`

Gate DW selected `wall.exact_source_family_field_context_basis_gap`
after two ROI plan iterations (`roiAnalysisIterations: 2`). Generated
`wall-masonry-brick` and `wall-lsf-knauf` field requests already
calculate `R'w`, `Dn,w`, `DnT,w`, and `DnT,A`, but still selected the
generic screening fallback. Counters: `candidateCount 10`,
`estimatedNextRuntimeBasisPromotions 2`,
`estimatedNextRuntimeCorrectedLayerTemplates 2`,
`estimatedNextRuntimeCorrectedRequestShapes 8`,
`frontendImplementationFilesTouched: 0`, and `runtimeValuesMoved: 0`.
Gate DW selects
`post_v1_wall_exact_source_field_context_basis_gate_dx_plan` in
`packages/engine/src/post-v1-wall-exact-source-field-context-basis-gate-dx-contract.test.ts`.

Latest landed runtime scope/basis action:

`post_v1_wall_lsf_exact_source_mixed_metric_companion_gate_dv_plan`

Gate DV status:

`post_v1_wall_lsf_exact_source_mixed_metric_companion_gate_dv_landed_runtime_scope_basis_selected_next_numeric_coverage_gap_gate_dw`

Gate DV exact source:

`knauf_lab_416889_primary_2026`

Gate DV closes the Gate DU selected LSF exact-source mixed lab companion
gap without moving numeric values. The generated `wall-lsf-knauf` mixed
lab request now supports `Rw 55 / STC 55 / C -1.5 / Ctr -6.4` through
`gate_dv_lsf_exact_rw_calculated_lab_companion_runtime` with selected
candidate `candidate_lsf_exact_rw_calculated_lab_companions`. The exact
source owns only `Rw`; `STC`, `C`, and `Ctr` are calculated companions
from the existing dynamic curve and rating adapters. Single-output `Rw`
stays exact, field/building outputs are not relabelled from lab `Rw`,
and no frontend implementation was touched. Counters:
`newCalculableLayerTemplates 1`, `newCalculableRequestShapes 1`,
`newCalculableTargetOutputs: 3`, `runtimeBasisPromotions 1`,
`protectedSingleOutputExactRequestShapes 1`,
`protectedFieldOrBuildingAliasRequestShapes 1`, and
`runtimeValuesMoved: 0`. Gate DV selects
`post_v1_next_numeric_coverage_gap_gate_dw_plan` in
`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-dw-contract.test.ts`.

Latest no-runtime numeric coverage/accuracy rerank:

`post_v1_next_numeric_coverage_gap_gate_du_plan`

Gate DU status:

`post_v1_next_numeric_coverage_gap_gate_du_landed_no_runtime_selected_wall_lsf_exact_source_mixed_metric_companion_gate_dv`

Gate DU selected candidate:

`wall.lsf_exact_source_mixed_lab_companion_gap`

Gate DU selected the highest-ROI engine-only scope repair after two ROI
plan iterations (`roiAnalysisIterations: 2`): publish calculated
`STC`, `C`, and `Ctr` companions beside exact-source LSF `Rw` through
the existing dynamic curve, while rejecting broad source crawling,
confidence wording, frontend work, field/building aliasing, and numeric
retuning. Counters: `candidateCount 11`,
`estimatedNextNewCalculableLayerTemplates 1`,
`estimatedNextNewCalculableRequestShapes 1`,
`estimatedNextNewCalculableTargetOutputs 3`,
`estimatedNextRuntimeBasisPromotions 1`,
`frontendImplementationFilesTouched: 0`, and `runtimeValuesMoved: 0`.
Gate DU selects `post_v1_wall_lsf_exact_source_mixed_metric_companion_gate_dv_plan`
in
`packages/engine/src/post-v1-wall-lsf-exact-source-mixed-metric-companion-gate-dv-contract.test.ts`.

Latest runtime-basis accuracy action:

`post_v1_wall_masonry_exact_source_mixed_metric_companion_gate_dt_plan`

Gate DT status:

`post_v1_wall_masonry_exact_source_mixed_metric_companion_gate_dt_landed_runtime_basis_no_value_selected_next_numeric_coverage_gap_gate_du`

Gate DT exact source:

`wienerberger_porotherm_100_dense_plaster_primary_2026`

Gate DT closes the Gate DS selected mixed-metric companion policy gap
without moving numeric values. The generated `wall-masonry-brick` mixed
lab request keeps `Rw 43 / STC 43 / C -1 / Ctr -5.5` and now selects
`family_physics_prediction` through
`gate_dt_masonry_exact_rw_calculated_lab_companion_runtime` with
selected candidate `candidate_masonry_exact_rw_calculated_lab_companions`.
The exact source owns only `Rw`; STC, C, and Ctr remain calculated
companions from the dynamic curve and rating adapters. Single-output
`Rw` stays on the Gate DR `measured_exact_full_stack` route,
field/building outputs are not relabelled from lab `Rw`, and no
frontend implementation was touched. Counters: `runtimeBasisPromotions:
1`, `runtimeCorrectedLayerTemplates 1`, `runtimeCorrectedRequestShapes
1`, `protectedMixedCompanionRequestShapes 1`,
`protectedFieldOrBuildingAliasRequestShapes 1`,
`newCalculableLayerTemplates 0`, `newCalculableRequestShapes 0`,
`frontendImplementationFilesTouched: 0`, and `runtimeValuesMoved: 0`.
Gate DT selects `post_v1_next_numeric_coverage_gap_gate_du_plan` in
`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-du-contract.test.ts`.

Latest no-runtime numeric coverage/accuracy rerank:

`post_v1_next_numeric_coverage_gap_gate_ds_plan`

Gate DS status:

`post_v1_next_numeric_coverage_gap_gate_ds_landed_no_runtime_selected_wall_masonry_exact_source_mixed_metric_companion_gate_dt`

Gate DS selected candidate:

`wall.masonry_exact_source_mixed_metric_companion_policy_gap`

Gate DS selected the highest-ROI post-DR engine-only accuracy repair
after two plan iterations (`roiAnalysisIterations: 2`). Iteration one
rejected lower-scope or surface-heavy candidates; iteration two rejected
any route that would falsely promote STC/C/Ctr to exact-source ownership,
drop mixed companions, retune from source proximity, or touch frontend.
Gate DS moved no runtime values. Counters: `candidateCount 10`,
`estimatedNextRuntimeBasisPromotions 1`,
`estimatedNextRuntimeCorrectedLayerTemplates 1`,
`estimatedNextRuntimeCorrectedRequestShapes 1`,
`newCalculableLayerTemplates 0`, `newCalculableRequestShapes 0`,
`frontendImplementationFilesTouched: 0`, and `runtimeValuesMoved 0`.
Gate DS selects
`post_v1_wall_masonry_exact_source_mixed_metric_companion_gate_dt_plan`
in
`packages/engine/src/post-v1-wall-masonry-exact-source-mixed-metric-companion-gate-dt-contract.test.ts`.

Previous runtime-basis accuracy action:

`post_v1_wall_exact_source_zero_delta_basis_gate_dr_plan`

Gate DR status:

`post_v1_wall_exact_source_zero_delta_basis_gate_dr_landed_runtime_basis_no_value_selected_next_numeric_coverage_gap_gate_ds`

Gate DR exact source:

`wienerberger_porotherm_100_dense_plaster_primary_2026`

Gate DR closes the Gate DQ selected exact-source zero-delta
runtime-basis repair without moving numeric values. The generated
`wall-masonry-brick` single-output `Rw` request keeps `Rw 43` but now
selects `measured_exact_full_stack` through
`verified_airborne_catalog_exact_match` with selected candidate
`candidate_blocked_rockwool_exact_source` instead of the older
`screening_fallback` answer basis. Mixed `Rw/STC/C/Ctr` masonry requests
remain calculated companions on `candidate_multileaf_screening_fallback`
because the exact catalog row owns only `Rw`; field/building outputs are
not relabelled from lab `Rw`; LSF field anchoring still requires its
airtightness and field context inputs; floor CI and ASTM IIC/AIIC
boundaries are unchanged. Counters: `runtimeBasisPromotions: 1`,
`runtimeCorrectedLayerTemplates 1`, `runtimeCorrectedRequestShapes 1`,
`protectedMixedCompanionRequestShapes 1`,
`protectedFieldOrBuildingAliasRequestShapes 1`,
`newCalculableLayerTemplates 0`, `newCalculableRequestShapes 0`,
`frontendImplementationFilesTouched: 0`, and `runtimeValuesMoved: 0`.
Gate DR selects `post_v1_next_numeric_coverage_gap_gate_ds_plan` in
`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ds-contract.test.ts`.

Previous Gate DR file:

`packages/engine/src/post-v1-wall-exact-source-zero-delta-basis-gate-dr-contract.test.ts`

Latest no-runtime numeric coverage/accuracy rerank:

`post_v1_next_numeric_coverage_gap_gate_dq_plan`

Gate DQ status:

`post_v1_next_numeric_coverage_gap_gate_dq_landed_no_runtime_selected_wall_exact_source_zero_delta_basis_gate_dr`

Gate DQ selected candidate:

`wall.exact_source_zero_delta_single_output_basis_gap`

Gate DQ selected the highest-ROI answer-order accuracy repair after
Gate DP: the `wall-masonry-brick` single-output `Rw` route had the
rights-safe exact source
`wienerberger_porotherm_100_dense_plaster_primary_2026` and already
landed on `Rw 43`, but because no numeric delta was needed the public
basis stayed `screening_fallback`. Gate DR must promote only the
single-output exact metric to `measured_exact_full_stack`, keep mixed
`Rw/STC/C/Ctr` calculated companions live, keep field/building aliases
closed, and avoid source crawling, confidence wording, or frontend work.
Counters: `candidateCount 11`, `estimatedNextRuntimeBasisPromotions 1`,
`estimatedNextRuntimeCorrectedLayerTemplates 1`,
`estimatedNextRuntimeCorrectedRequestShapes 1`,
`newCalculableLayerTemplates 0`, `newCalculableRequestShapes 0`,
`frontendImplementationFilesTouched: 0`, and `runtimeValuesMoved 0`.
Gate DQ selects `post_v1_wall_exact_source_zero_delta_basis_gate_dr_plan`
in
`packages/engine/src/post-v1-wall-exact-source-zero-delta-basis-gate-dr-contract.test.ts`.

Previous Gate DQ file:

`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-dq-contract.test.ts`

Previous runtime-basis accuracy action:

`post_v1_wall_clt_laminated_leaf_runtime_basis_gate_dp_plan`

Gate DP status:

`post_v1_wall_clt_laminated_leaf_runtime_basis_gate_dp_landed_runtime_basis_no_value_selected_next_numeric_coverage_gap_gate_dq`

Gate DP runtime lineage:

`gate_h_clt_mass_timber_wall_single_leaf_family_physics_runtime`

Gate DP closes the Gate DO selected CLT laminated-leaf runtime-basis
repair without moving values. The generated `wall-clt-local` CLT +
gypsum lab route keeps `Rw 42 / STC 43 / C -1.1 / Ctr -7.1` and now
routes through the existing CLT family owner lineage
`gate_h_clt_mass_timber_wall_single_leaf_family_physics_runtime`; when
lab `Ctr` is requested, the selected lab candidate is the existing Gate
Y spectrum adapter over that base. Explicit field context keeps
`R'w 41 / Dn,w 41 / DnT,w 42 / DnT,A 40.7` on Gate I over the CLT base
instead of relabelling lab `Rw`. The selected runtime candidate lineage
includes `candidate_clt_mass_timber_wall_family_physics_prediction`;
ordinary gypsum laminated leaves, plywood/NLT/DLT timber boards,
double-leaf CLT, timber-stud, LSF, lined massive, grouped multicavity,
floor-system source rows, and STC/FSTC/ASTC context aliases remain
outside this repair. Counters: `runtimeBasisPromotions 1`,
`runtimeCorrectedLayerTemplates 1`, `runtimeCorrectedRequestShapes 8`,
`newCalculableLayerTemplates 0`, `newCalculableRequestShapes 0`,
`protectedRuntimePins 8`, and `runtimeValuesMoved 0`. Gate DP selects
`post_v1_next_numeric_coverage_gap_gate_dq_plan` in
`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-dq-contract.test.ts`.

Previous Gate DP file:

`packages/engine/src/post-v1-wall-clt-laminated-leaf-runtime-basis-gate-dp-contract.test.ts`

Latest no-runtime numeric coverage/accuracy rerank:

`post_v1_next_numeric_coverage_gap_gate_do_plan`

Gate DO status:

`post_v1_next_numeric_coverage_gap_gate_do_landed_no_runtime_selected_wall_clt_laminated_leaf_runtime_basis_gate_dp`

Gate DO selected candidate:

`wall.clt_laminated_leaf_runtime_basis_gap`

Gate DO selects the CLT laminated single-leaf runtime-basis repair as
the highest-ROI engine-only formula-routing step after Gate DN. The
generated `wall-clt-local` CLT + gypsum wall stack already calculates
lab `Rw 42 / STC 43 / C -1.1 / Ctr -7.1` and field
`R'w 41 / Dn,w 41 / DnT,w 42 / DnT,A 40.7`, but its selected basis is
still `screening_fallback` with selected candidate
`candidate_multileaf_screening_fallback`. Gate DP must reuse the
existing Gate H CLT / mass-timber wall family physics owner, keep
numeric pins frozen, keep explicit field context on the Gate I adapter,
and leave Dataholz floor-system rows, WoodWorks/NRC STC/FSTC/ASTC
context, ordinary gypsum laminated leaves, NLT, double-leaf CLT,
timber-stud, LSF, lined massive, and grouped multicavity routes outside
this repair. Counters: `candidateCount 11`,
`estimatedNextRuntimeBasisPromotions 1`,
`estimatedNextRuntimeCorrectedLayerTemplates 1`,
`estimatedNextRuntimeCorrectedRequestShapes 8`,
`newCalculableLayerTemplates 0`, `newCalculableRequestShapes 0`, and
`runtimeValuesMoved 0`. Gate DO selects
`post_v1_wall_clt_laminated_leaf_runtime_basis_gate_dp_plan` in
`packages/engine/src/post-v1-wall-clt-laminated-leaf-runtime-basis-gate-dp-contract.test.ts`.

Previous Gate DO file:

`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-do-contract.test.ts`

Latest runtime-basis accuracy action:

`post_v1_wall_timber_stud_bounded_runtime_basis_gate_dn_plan`

Gate DN status:

`post_v1_wall_timber_stud_bounded_runtime_basis_gate_dn_landed_runtime_basis_no_value_selected_next_numeric_coverage_gap_gate_do`

Gate DN runtime candidate:

`candidate_timber_stud_bounded_wall_prediction`

Gate DN closes the Gate DM selected timber-stud runtime-basis step
without retuning the live lab or field values. The direct wood-stud
double-board lab route now reports `bounded_prediction` through
`gate_dn_timber_stud_bounded_wall_runtime` with selected candidate
`candidate_timber_stud_bounded_wall_prediction` instead of generic
screening. Explicit field context continues through the Gate I field
adapter over the Gate DN base, so lab `Rw` is not relabelled as field
metrics. Live pins stay `Rw 50 / STC 50 / C 0.5 / Ctr -4.2` and field
`R'w 42 / Dn,w 42 / DnT,w 43 / DnT,A 43.9`. Exact single-board timber
rows, resilient-bar exact rows, the secondary direct double-board
benchmark, steel-framed holdouts, `light_steel_stud_or_resilient_bar`,
split double-stud, grouped multicavity, CLT/mass-timber, and
field/building aliases remain outside this owner. Counters:
`boundedRuntimeBasisPromotions 1`, `fieldAdapterAliasesAdded 0`,
`newCalculableLayerTemplates 0`, `newCalculableRequestShapes 0`,
`protectedRuntimePins 8`, and `runtimeValuesMoved 0`. Gate DN selects
`post_v1_next_numeric_coverage_gap_gate_do_plan` in
`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-do-contract.test.ts`.

Previous Gate DN file:

`packages/engine/src/post-v1-wall-timber-stud-bounded-runtime-basis-gate-dn-contract.test.ts`

Latest no-runtime bounded-rule owner action:

`post_v1_wall_timber_stud_bounded_rule_gate_dm_plan`

Gate DM status:

`post_v1_wall_timber_stud_bounded_rule_gate_dm_landed_no_runtime_selected_timber_stud_bounded_runtime_basis_gate_dn`

Gate DM selected candidate:

`wall.timber_stud.bounded_rule_owner_contract`

Gate DM closes the Gate DL selected timber-stud owner-contract step
without retuning the live lab or field values. The bounded owner is
intentionally narrow: direct `wood_stud`, line-connected, 600 mm stud
spacing, board-dominant double-board gypsum leaves, one 100 mm
cavity/core with 50 mm mineral fill, and the current
`stud_surrogate_blend + framed_wall_calibration` coefficient corridor.
Exact single-board timber rows, resilient-bar exact rows, the secondary
direct double-board benchmark, steel-framed holdouts,
`light_steel_stud_or_resilient_bar`, split double-stud, grouped
multicavity, CLT/mass-timber, and field/building aliases remain outside
this owner. Runtime values do not move: live pins stay `Rw 50 / STC 50 /
C 0.5 / Ctr -4.2` and field `R'w 42 / Dn,w 42 / DnT,w 43 /
DnT,A 43.9`.
Counters: `boundedOwnerLedgers 1`,
`boundedRuntimeBasisPromotions 0`, `newCalculableLayerTemplates 0`,
`newCalculableRequestShapes 0`, and `runtimeValuesMoved 0`. Gate DM
selects `post_v1_wall_timber_stud_bounded_runtime_basis_gate_dn_plan` in
`packages/engine/src/post-v1-wall-timber-stud-bounded-runtime-basis-gate-dn-contract.test.ts`.

Previous Gate DM file:

`packages/engine/src/post-v1-wall-timber-stud-bounded-rule-gate-dm-contract.test.ts`

Latest no-runtime numeric coverage/accuracy rerank:

`post_v1_next_numeric_coverage_gap_gate_dl_plan`

Gate DL status:

`post_v1_next_numeric_coverage_gap_gate_dl_landed_no_runtime_selected_wall_timber_stud_bounded_rule_gate_dm`

Gate DL selected candidate:

`wall.timber_stud_formula_bounded_rule_owner_gap`

Gate DL selects the highest-ROI engine-only timber-stud bounded-rule
owner step after Gate DK. The live timber-stud wall stack already
calculates through `stud_surrogate_blend+framed_wall_calibration` with
`Rw 50` and field `R'w 42 / Dn,w 42 / DnT,w 43 / DnT,A 43.9`, but the
existing timber source audits prove no exact or lab-fallback source row
matches the live double-board, fill, cavity, and wood-stud topology.
Gate DM must define the bounded timber-stud formula owner with
coefficient scope, tolerance, and negative boundaries before any runtime
values move. Gate DL rejects stale steel runtime/surface work,
already-live exact ASTM band routes, support-backed AAC/multicavity fake
gaps, source crawling, confidence wording, and frontend polish. Counters:
`candidateCount 12`, `boundedOwnerLedgersEstimated 1`,
`newCalculableLayerTemplates 0`, `newCalculableRequestShapes 0`, and
`runtimeValuesMoved 0`. Gate DL selects
`post_v1_wall_timber_stud_bounded_rule_gate_dm_plan` in
`packages/engine/src/post-v1-wall-timber-stud-bounded-rule-gate-dm-contract.test.ts`.

Latest calculator surface parity action:

`post_v1_floor_steel_visible_formula_input_surface_parity_gate_dk_plan`

Gate DK status:

`post_v1_floor_steel_visible_formula_input_surface_parity_gate_dk_landed_surface_parity_selected_next_numeric_coverage_gap_gate_dl`

Gate DK selected candidate:

`floor.steel_visible_formula_input_surface_parity_gap`

Gate DK closes the Gate DJ selected steel visible formula input surface
parity slice. Shared `steelFloorFormulaSurface`, estimate API payloads,
server estimate route plumbing, impact-only API payloads, server
impact-only route plumbing, and engine `calculateImpactOnly` now carry
the Gate DI steel owner inputs into the existing steel mass-spring
formula corridor. Complete steel joist surface payloads calculate
`Ln,w 51.6 / DeltaLw 22.4`; complete open-web surface payloads
calculate `Ln,w 52.2 / DeltaLw 22.4`. Missing `steelSupportForm`,
`steelCarrierDepthMm`, `steelCarrierSpacingMm`,
`toppingOrFloatingLayer`, `resilientLayerDynamicStiffnessMNm3`,
`loadBasisKgM2`, or `lowerCeilingIsolationSupportForm` remains
`needs_input`; surface-absent generated steel/open-web rows still do
not publish `DeltaLw`; and ISO `DeltaLw` still does not alias to ASTM
`IIC` / `AIIC`. Gate DK does not add a new steel formula, does not
retune the formula, does not crawl source rows, and does not touch
frontend UI implementation. Counters: `newCalculableLayerTemplates 0`,
`newCalculableRequestShapes 4`, `impactOnlySurfaceRequestShapes 4`,
`runtimeCorrectedLayerTemplates 0`, `runtimeCorrectedRequestShapes 0`,
`protectedNoSurfaceGeneratedRequestShapes 5`, and
`astmAliasRequestShapesKeptUnsupported 2`. Gate DK selects
`post_v1_next_numeric_coverage_gap_gate_dl_plan` in
`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-dl-contract.test.ts`.

Previous no-runtime numeric coverage/accuracy rerank:

`post_v1_next_numeric_coverage_gap_gate_dj_plan`

Gate DJ status:

`post_v1_next_numeric_coverage_gap_gate_dj_landed_no_runtime_selected_floor_steel_visible_formula_input_surface_parity_gate_dk`

Gate DJ selected candidate:

`floor.steel_visible_formula_input_surface_parity_gap`

Gate DJ selects the steel visible formula input surface parity slice
because Gate DI already made the visible steel/open-web route calculate
inside `calculateAssembly`, while the next user-reachable calculator
scope move is to carry the same steel owner inputs through calculator
surfaces. Gate DK must not add a new steel formula, retune the
mass-spring corridor, borrow bound-only steel `Ln,w` rows, or alias ISO
`DeltaLw` to ASTM `IIC` / `AIIC`. Gate DJ rejects wall-held
AAC/multicavity as already calculable when `supportTopology` is
provided, rejects exact ASTM E492/E1007 as already live, and keeps
opening/leak holdouts plus heavy-core direct retune blocked until their
evidence owners exist. Gate DJ moved no runtime values and touched no
frontend implementation. Counters: `candidateCount 10`,
`estimatedNextSurfaceRequestShapes 4`, `newCalculableLayerTemplates 0`,
`newCalculableRequestShapes 0`, and `runtimeValuesMoved 0`.
Gate DJ selected
`post_v1_floor_steel_visible_formula_input_surface_parity_gate_dk_plan`
in
`packages/engine/src/post-v1-floor-steel-visible-formula-input-surface-parity-gate-dk-contract.test.ts`.

Latest value-moving runtime action:

`post_v1_floor_steel_visible_formula_input_bridge_gate_di_plan`

Gate DI status:

`post_v1_floor_steel_visible_formula_input_bridge_gate_di_landed_runtime_selected_next_numeric_coverage_gap_gate_dj`

Gate DI closes the Gate DH selected
`floor.steel_visible_formula_input_bridge_gap`. Visible steel/open-web
floor layers with complete steel owner inputs now route through the
existing steel mass-spring formula corridor without requiring explicit
`impactPredictorInput`: steel joist calculates
`Ln,w 51.6 / DeltaLw 22.4`, and open-web calculates
`Ln,w 52.2 / DeltaLw 22.4`. Missing `steelSupportForm`,
`steelCarrierDepthMm`, `steelCarrierSpacingMm`,
`toppingOrFloatingLayer`, `resilientLayerDynamicStiffnessMNm3`,
`loadBasisKgM2`, or `lowerCeilingIsolationSupportForm` remains
`needs_input`; surface-absent generated steel/open-web rows keep their
previous `Ln,w`-only posture; and ISO `DeltaLw` still does not alias to
ASTM `IIC` / `AIIC`. Counters: `newCalculableLayerTemplates 2`,
`newCalculableRequestShapes 4`, `runtimeCorrectedLayerTemplates 0`,
`runtimeCorrectedRequestShapes 0`,
`protectedNoSurfaceGeneratedRequestShapes 5`, and
`astmAliasRequestShapesKeptUnsupported 2`. Gate DI selects
`post_v1_next_numeric_coverage_gap_gate_dj_plan` in
`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-dj-contract.test.ts`.

Previous no-runtime numeric coverage/accuracy rerank:

`post_v1_next_numeric_coverage_gap_gate_dh_plan`

Gate DH status:

`post_v1_next_numeric_coverage_gap_gate_dh_landed_no_runtime_selected_floor_steel_visible_formula_input_bridge_gate_di`

Gate DH selected `floor.steel_visible_formula_input_bridge_gap` as the
highest-ROI engine-only scope move after Gate DG and selected
`post_v1_floor_steel_visible_formula_input_bridge_gate_di_plan` in
`packages/engine/src/post-v1-floor-steel-visible-formula-input-bridge-gate-di-contract.test.ts`.

Latest runtime-basis accuracy action:

`post_v1_wall_heavy_core_lined_massive_bounded_runtime_basis_gate_dg_plan`

Gate DG status:

`post_v1_wall_heavy_core_lined_massive_bounded_runtime_basis_gate_dg_landed_runtime_basis_no_value_selected_next_numeric_coverage_gap_gate_dh`

Gate DG keeps `wall-screening-concrete` values unchanged while changing
the lab lined-massive runtime basis to `bounded_prediction` /
`airborne_bound`: `Rw 57 / STC 57 / C -1.6 / Ctr -6.5`. The candidate
resolver selects the existing Gate H lined-massive candidate instead of
the generic bounded fallback. Field/apparent values remain on Gate I
with `family_physics_prediction` origin:
`R'w 55 / Dn,w 55 / DnT,w 56 / DnT,A 54.9`. Heavy composite,
AAC/multicavity, floor rows, workbench presets, and source-row promotion
remain blocked from this bounded lane. Counters:
`boundedRuntimeBasisPromotions 1`, `newCalculableLayerTemplates 0`,
`newCalculableRequestShapes 0`, and `runtimeValuesMoved 0`. Gate DG
selects `post_v1_next_numeric_coverage_gap_gate_dh_plan` in
`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-dh-contract.test.ts`.

Latest no-runtime bounded-rule owner action:

`post_v1_wall_heavy_core_lined_massive_bounded_rule_gate_df_plan`

Gate DF status:

`post_v1_wall_heavy_core_lined_massive_bounded_rule_gate_df_landed_no_runtime_selected_bounded_runtime_basis_gate_dg`

Gate DF closes the Gate DE owner-contract step without retuning
`wall-screening-concrete` numeric values. The existing Gate H lab
lined-massive route remains `Rw 57 / STC 57 / C -1.6 / Ctr -6.5`
through `lined_massive_wall` / `lined_massive_blend`; Gate DF narrows
the bounded-rule envelope to element-lab, two visible leaves, one
compliant cavity, no support layer, a light board/lining leaf, a heavy
masonry/concrete leaf, explicit cavity/fill state from visible layers,
and the current `0.75 mass_law + 0.25 screening seed` coefficient
scope. Field/apparent values remain on the explicit Gate I adapter
(`R'w 55 / Dn,w 55 / DnT,w 56 / DnT,A 54.9`) instead of aliasing lab
`Rw`; `heavy_composite_double_leaf_sibling`, AAC/multicavity grouped
topology, floor rows, workbench presets, selector pins, and source-row
promotion remain negative boundaries. Gate DF moved no runtime values,
touched no frontend implementation, and selected
`post_v1_wall_heavy_core_lined_massive_bounded_runtime_basis_gate_dg_plan`
in
`packages/engine/src/post-v1-wall-heavy-core-lined-massive-bounded-runtime-basis-gate-dg-contract.test.ts`.
Selected candidate:
`wall.heavy_core_lined_massive.bounded_rule_owner_contract`.

Latest no-runtime numeric coverage/accuracy rerank:

`post_v1_next_numeric_coverage_gap_gate_de_plan`

Gate DE status:

`post_v1_next_numeric_coverage_gap_gate_de_landed_no_runtime_selected_wall_heavy_core_lined_massive_bounded_rule_gate_df`

Gate DE rejects stale or already-live candidates after Gate DD and
selects `wall.heavy_core_lined_massive_bounded_rule_owner_gap` as the
highest-ROI next engine-only accuracy owner step. Gate DF must not
retune `wall-screening-concrete` directly; it must decide whether the
existing lined-massive/heavy-core route can be promoted from
source-absent screening to a bounded formula owner with coefficient
scope, tolerance, and negative boundaries. Exact ASTM band ownership is
already separate, ISO impact still does not alias to ASTM `IIC` /
`AIIC`, and steel fallback `L'nT,50` is already calculable when explicit
`impactFieldContext.ci50_2500Db` is present. Gate DE moved no runtime
values, touched no frontend implementation, and selected
`post_v1_wall_heavy_core_lined_massive_bounded_rule_gate_df_plan` in
`packages/engine/src/post-v1-wall-heavy-core-lined-massive-bounded-rule-gate-df-contract.test.ts`.

Latest no-runtime accuracy readiness action:

`post_v1_wall_heavy_core_lined_massive_accuracy_gate_dd_plan`

Gate DD status:

`post_v1_wall_heavy_core_lined_massive_accuracy_gate_dd_landed_no_runtime_selected_next_numeric_coverage_gap_gate_de`

Gate DD closes the Gate DC selected
`wall.heavy_core_lined_massive_accuracy_tightening_gap` readiness pass
without retuning lined-massive / heavy-core wall values. The live
`wall-screening-concrete` route is pinned as source-absent screening
behavior: lab `Rw 57 / STC 57 / C -1.6 / Ctr -6.5`, and field
`R'w 55 / Dn,w 55 / DnT,w 56 / DnT,A 54.9 / C -1.6 / Ctr -6.3`.
Exact verified wall source and lab-fallback matches remain absent.
Knauf CC60 concrete floor rows, manufacturer lining context, selector
pins, deep-hybrid guards, workbench concrete presets, and ISO/Sharp/Davy
framework context remain non-promotable until a wall-specific same-stack
source row or a named bounded lined-massive wall rule exists. Gate DD
moved no runtime values, touched no frontend implementation, and selected
`post_v1_next_numeric_coverage_gap_gate_de_plan` in
`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-de-contract.test.ts`.

Previous no-runtime accuracy selection:

`post_v1_next_numeric_coverage_gap_gate_dc_plan`

Gate DC status:

`post_v1_next_numeric_coverage_gap_gate_dc_landed_no_runtime_selected_wall_heavy_core_lined_massive_accuracy_gate_dd`

Gate DC selected
`post_v1_wall_heavy_core_lined_massive_accuracy_gate_dd_plan` in
`packages/engine/src/post-v1-wall-heavy-core-lined-massive-accuracy-gate-dd-contract.test.ts`.

Previous value-moving runtime slice:

`post_v1_wall_local_substitution_building_adapter_gate_cw_plan`

Gate CW status:

`post_v1_wall_local_substitution_building_adapter_gate_cw_landed_runtime_selected_next_numeric_coverage_gap_gate_cx`

Gate CW closes the Gate CV selected local-substitution triple-leaf wall
building adapter gap. Complete local Rockwool / MLV / plaster grouped
triple-leaf wall requests with explicit `building_prediction` flanking,
junction, room, panel, RT60, and output-basis inputs now publish
`R'w 51 / Dn,w 51 / Dn,A 52.4 / DnT,w 53 / DnT,A 53.9` from the
local-substitution lab curve plus the building adapter, with a
`+/-11 dB` source-absent budget. Missing building physical inputs remain
`needs_input`, exact same-stack field/building source rows remain higher
precedence, and lab/field/building metric owners stay separate.
Counters: `newCalculableLayerTemplates 1`,
`newCalculableRequestShapes 5`, `runtimeCorrectedLayerTemplates 1`, and
`runtimeCorrectedRequestShapes 5`. Gate CW selected
`post_v1_next_numeric_coverage_gap_gate_cx_plan` in
`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-cx-contract.test.ts`.

Latest no-runtime numeric coverage selection:

`post_v1_next_numeric_coverage_gap_gate_cx_plan`

Gate CX status:

`post_v1_next_numeric_coverage_gap_gate_cx_landed_no_runtime_selected_floor_composite_panel_delta_lw_owner_gate_cy`

Gate CX selects
`floor.composite_panel_delta_lw_published_interaction_owner_gap` as the
highest-ROI next engine-only formula-owner slice. Composite-panel
published-interaction routes already own same-family bare and treated
`Ln,w` anchors for dry floating, suspended-ceiling, and combined treated
stacks, but ISO `DeltaLw` remains unsupported for those visible treated
combinations. Gate CY should add a separate composite-panel `DeltaLw`
owner by subtracting treated `Ln,w` from the same-family bare `Ln,w`
anchor. It must not borrow heavy-concrete Annex C formulas, must keep
existing composite-panel `Rw` and `Ln,w` pins unchanged, must preserve
missing owner fields as `needs_input`, and must not publish ASTM `IIC`
or `AIIC` aliases. Gate CX moved no runtime values and touched no
frontend implementation. Counters: `candidateCount 12`,
`newCalculableLayerTemplates 0`, `newCalculableRequestShapes 0`,
`runtimeValuesMoved 0`, `estimatedNextNewCalculableLayerTemplates 3`,
and `estimatedNextNewCalculableRequestShapes 3`. Gate CX selected
`post_v1_floor_composite_panel_delta_lw_owner_gate_cy_plan` in
`packages/engine/src/post-v1-floor-composite-panel-delta-lw-owner-gate-cy-contract.test.ts`.

Latest value-moving runtime slice:

`post_v1_floor_composite_panel_delta_lw_owner_gate_cy_plan`

Gate CY status:

`post_v1_floor_composite_panel_delta_lw_owner_gate_cy_landed_runtime_selected_next_numeric_coverage_gap_gate_cz`

Gate CY closes the Gate CX selected composite-panel `DeltaLw` owner gap.
Composite-panel published-interaction floor stacks now keep their
existing `Rw` / `Ln,w` pins and additionally calculate ISO `DeltaLw`
from the same-family bare-minus-treated `Ln,w` owner. Dry floating
calculates `Ln,w 69.4 / Rw 45.1 / DeltaLw 14.6`;
suspended-ceiling-only calculates `Ln,w 63.3 / Rw 48.6 / DeltaLw 20.7`;
combined upper/lower treatment calculates `Ln,w 48.5 / Rw 60.6 /
DeltaLw 35.5`. Missing composite-panel owner fields remain
`needs_input`, exact same-stack official PMC rows remain primary without
source-absent `DeltaLw` aliases, heavy-concrete / timber-CLT /
lightweight-concrete formulas are not borrowed, and ASTM `IIC` / `AIIC`
remain unsupported. Counters: `newCalculableLayerTemplates 3`,
`newCalculableRequestShapes 3`, `runtimeCorrectedLayerTemplates 0`, and
`runtimeCorrectedRequestShapes 0`. Gate CY selected
`post_v1_next_numeric_coverage_gap_gate_cz_plan` in
`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-cz-contract.test.ts`.

Latest no-runtime numeric coverage selection:

`post_v1_next_numeric_coverage_gap_gate_cz_plan`

Gate CZ status:

`post_v1_next_numeric_coverage_gap_gate_cz_landed_no_runtime_selected_floor_lightweight_concrete_delta_lw_owner_contract_gate_da`

Gate CZ selects
`floor.lightweight_concrete_delta_lw_family_owner_contract_gap` as the
highest-ROI next engine-only owner-contract slice. Lightweight concrete
already has owned `Rw` / `Ln,w` family routes and explicit field-impact
companion adaptation from that owned `Ln,w` anchor, but ISO `DeltaLw`
remains blocked because no lightweight family-specific owner contract
has pinned the required bare-vs-treated or dynamic-improvement basis.
Gate DA should pin that owner contract before runtime values move. It
must not borrow heavy-concrete Annex C, composite-panel
bare-minus-treated, timber/CLT, or steel mass-spring `DeltaLw` routes,
must keep existing lightweight-concrete `Rw` / `Ln,w` / field-impact
pins unchanged, must preserve missing owner fields as `needs_input` or
`unsupported`, and must not publish ASTM `IIC` or `AIIC` aliases. Gate
CZ moved no runtime values and touched no frontend implementation.
Counters: `candidateCount 13`, `newCalculableLayerTemplates 0`,
`newCalculableRequestShapes 0`, `runtimeValuesMoved 0`,
`estimatedNextNewCalculableLayerTemplates 0`,
`estimatedNextNewCalculableRequestShapes 0`,
`estimatedFollowOnNewCalculableLayerTemplates 2`, and
`estimatedFollowOnNewCalculableRequestShapes 2`. Gate CZ selected
`post_v1_floor_lightweight_concrete_delta_lw_owner_contract_gate_da_plan`
in
`packages/engine/src/post-v1-floor-lightweight-concrete-delta-lw-owner-contract-gate-da-contract.test.ts`.

Latest lightweight-concrete owner-boundary action:

`post_v1_floor_lightweight_concrete_delta_lw_owner_contract_gate_da_plan`

Gate DA status:

`post_v1_floor_lightweight_concrete_delta_lw_owner_contract_gate_da_landed_runtime_boundary_selected_delta_lw_runtime_corridor_gate_db`

Gate DA closes the Gate CZ selected owner-contract step for
`floor.lightweight_concrete.delta_lw_family_owner_contract`. It does
not publish new lightweight-concrete `DeltaLw` values yet. It pins the
family-specific no-default owner fields `baseSlabThicknessMm`,
`baseSlabDensityKgM3_or_lightweightConcreteMaterialClass`,
`upperTreatmentState`, `floorCoveringOrWalkingSurface`,
`resilientLayerOrToppingState`,
`resilientLayerDynamicStiffnessMNm3_or_productCurve`, `loadBasisKgM2`,
and `elementLabMetricBasis`. It also corrects one wrong-family runtime
boundary: low-density predictor input with complete dynamic stiffness
and load basis now stays on the lightweight-concrete `Rw` / `Ln,w`
route and does not borrow `heavy_concrete_annex_c_delta_lw`.
Composite-panel bare-minus-treated, timber/CLT, and steel mass-spring
`DeltaLw` routes remain forbidden for this family. Existing visible
lightweight-concrete `Rw 53 / Ln,w 64.3`, the Gate M non-dynamic
low-density predictor `Rw 49 / Ln,w 47`, and field-impact companions
stay unchanged; the complete dynamic low-density predictor also stays
lightweight at `Rw 53 / Ln,w 64.3` without `DeltaLw`. `DeltaLw` remains
unsupported until Gate DB lands the family runtime corridor, and ASTM
`IIC` / `AIIC` remain unsupported. Counters:
`newCalculableLayerTemplates 0`, `newCalculableRequestShapes 0`,
`runtimeCorrectedRequestShapes 1`, and
`falseHeavyConcreteDeltaLwPublicationsPrevented 1`. Gate DA selected
`post_v1_floor_lightweight_concrete_delta_lw_runtime_corridor_gate_db_plan`
in
`packages/engine/src/post-v1-floor-lightweight-concrete-delta-lw-runtime-corridor-gate-db-contract.test.ts`.

Latest lightweight-concrete value-moving runtime action:

`post_v1_floor_lightweight_concrete_delta_lw_runtime_corridor_gate_db_plan`

Gate DB status:

`post_v1_floor_lightweight_concrete_delta_lw_runtime_corridor_gate_db_landed_runtime_selected_next_numeric_coverage_gap_gate_dc`

Gate DB closes the Gate DA selected runtime corridor for
lightweight-concrete ISO `DeltaLw`. Complete visible
lightweight-concrete floating-floor stacks with `loadBasisKgM2` and
`resilientLayerDynamicStiffnessMNm3` keep `Rw 53 / Ln,w 64.3` and now
calculate `DeltaLw 24.9` through
`predictor_lightweight_concrete_delta_lw_dynamic_improvement_estimate`.
Complete low-density predictor input keeps `Rw 53 / Ln,w 64.3` and
also calculates `DeltaLw 24.9`. Missing `loadBasisKgM2` or
`resilientLayerDynamicStiffnessMNm3` remains `needs_input`, the Gate M
non-dynamic low-density predictor remains `Rw 49 / Ln,w 47`, and ASTM
`IIC` / `AIIC` remain unsupported. Heavy-concrete Annex-C,
composite-panel bare-minus-treated, timber/CLT, and steel `DeltaLw`
routes are not borrowed. Counters: `newCalculableLayerTemplates 2`,
`newCalculableRequestShapes 4`, `runtimeCorrectedLayerTemplates 2`,
and `runtimeCorrectedRequestShapes 4`.

Gate DB selected next action:

`post_v1_next_numeric_coverage_gap_gate_dc_plan`

Gate DB selected next file:

`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-dc-contract.test.ts`.

Previous value-moving runtime slice:

`post_v1_floor_visible_layer_upper_package_delta_lw_gate_co_plan`

Gate CO status:

`post_v1_floor_visible_layer_upper_package_delta_lw_gate_co_landed_runtime_selected_next_numeric_coverage_gap_gate_cp`

Gate CO closes the visible-layer upper-package `DeltaLw` routing gap.
Visible tagged timber joist and CLT upper-package floor stacks now use
the existing timber/CLT `DeltaLw` formula owners when physical inputs are
present. Timber keeps exact `Ln,w 51` and calculates `DeltaLw 25.2`;
with explicit `impactFieldContext` it also calculates `L'n,w 53 /
L'nT,w 50.6 / L'nT,50 53.6`. CLT keeps published-family `Ln,w 50` and
calculates `DeltaLw 22.6`; with explicit `impactFieldContext` it also
calculates `L'n,w 52 / L'nT,w 49.6 / L'nT,50 52.6`. Missing
`loadBasisKgM2` or `resilientLayerDynamicStiffnessMNm3` remains
`needs_input`, and ASTM `IIC` / `AIIC` remain unsupported. Counters:
`newCalculableLayerTemplates 2`, `newCalculableRequestShapes 10`,
`runtimeCorrectedLayerTemplates 0`, and `runtimeCorrectedRequestShapes
0`. Gate CO selected `post_v1_next_numeric_coverage_gap_gate_cp_plan` in
`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-cp-contract.test.ts`.

Latest no-runtime numeric coverage selection:

`post_v1_next_numeric_coverage_gap_gate_cp_plan`

Gate CP status:

`post_v1_next_numeric_coverage_gap_gate_cp_landed_no_runtime_selected_floor_common_floating_lower_treatment_anchor_gate_cq`

Gate CP selects
`floor.common_floating_lower_treatment_published_anchor_gap` as the
highest-ROI next engine-only calculator slice. Visible heavy-floating
reinforced-concrete stacks with lower ceiling treatment currently keep
airborne `Rw` / `Ctr` but lose requested impact outputs behind the
combined upper/lower formula's `loadBasisKgM2` `needs_input` guard. The
published upper-treatment family already owns an `Ln,w` anchor for the
elastic and rigid gypsum-ceiling variants, so Gate CQ can increase
common ISO impact coverage for two visible lower-treatment templates
without source crawling or frontend work. Gate CQ must keep `Ln,w` and
field impact companions live from that anchor while leaving `DeltaLw`
as `needs_input` until `loadBasisKgM2` and
`resilientLayerDynamicStiffnessMNm3` are present. Complete physical
inputs must stay on the heavy combined upper/lower formula corridor,
and ASTM `IIC` / `AIIC` remain unsupported. Gate CP moved no runtime
values. Counters: `candidateCount 8`, `newCalculableLayerTemplates 0`,
`newCalculableRequestShapes 0`, `runtimeValuesMoved 0`,
`estimatedNextNewCalculableLayerTemplates 2`, and
`estimatedNextNewCalculableRequestShapes 10`.

Gate CP selected next action:

`post_v1_floor_common_floating_lower_treatment_anchor_gate_cq_plan`

Gate CP selected next file:

`packages/engine/src/post-v1-floor-common-floating-lower-treatment-anchor-gate-cq-contract.test.ts`

Previous value-moving runtime slice:

`post_v1_floor_common_floating_lower_treatment_anchor_gate_cq_plan`

Gate CQ status:

`post_v1_floor_common_floating_lower_treatment_anchor_gate_cq_landed_runtime_selected_next_numeric_coverage_gap_gate_cr`

Gate CQ keeps the published-family `Ln,w` anchor live for visible
heavy-floating reinforced-concrete lower-treatment stacks instead of
stopping all impact outputs behind the combined-formula needs-input
guard. The `acoustic_hanger_ceiling` template calculates `Ln,w 43`;
with explicit `impactFieldContext` it also calculates `L'n,w 45 /
L'nT,w 42.6 / L'nT,50 46.6`. The `resilient_stud_ceiling` template
calculates `Ln,w 51.5`; with explicit `impactFieldContext` it also
calculates `L'n,w 53.5 / L'nT,w 51.1 / L'nT,50 55.1`. `DeltaLw`
remains `needs_input` until `loadBasisKgM2` and
`resilientLayerDynamicStiffnessMNm3` are present. Complete physical
inputs still use the heavy combined upper/lower formula corridor, and
ASTM `IIC` / `AIIC` remain unsupported. Counters:
`newCalculableLayerTemplates 2`, `newCalculableRequestShapes 10`, and
`runtimeCorrectedRequestShapes 8`.

Gate CQ selected next action:

`post_v1_next_numeric_coverage_gap_gate_cr_plan`

Gate CQ selected next file:

`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-cr-contract.test.ts`

Latest no-runtime numeric coverage selection:

`post_v1_next_numeric_coverage_gap_gate_cr_plan`

Gate CR status:

`post_v1_next_numeric_coverage_gap_gate_cr_landed_no_runtime_selected_wall_common_auto_topology_second_pass_gate_cs`

Gate CR selects
`wall.common_auto_topology_second_pass_after_cj` as the highest-ROI
engine-only formula-routing slice after Gate CQ. The selected runtime
gap is wall flat layer-entry: Gate CJ already proved support-owned common
flat double-leaf `building_prediction` requests can use the Gate S
double-leaf/framed direct curve through the Gate AR building adapter,
but explicit `flat_layer_order` requests with the same safe segmentation
and owner inputs still stop behind the older ambiguity guard. Gate CS
must admit only safely segmentable explicit flat-entry wall stacks,
preserve missing `supportTopology`, `studSpacingMm`, and
`resilientBarSideCount` as `needs_input`, keep ambiguous multicavity
flat lists blocked, and keep lab metrics separate from field/building
metrics. Gate CR moved no runtime values, touched no frontend
implementation, selected no source crawl, and selected no confidence
wording. Counters: `candidateCount 9`,
`newCalculableLayerTemplates 0`, `newCalculableRequestShapes 0`,
`runtimeValuesMoved 0`, `estimatedNextRuntimeCorrectedLayerTemplates 5`,
and `estimatedNextRuntimeCorrectedRequestShapes 25`.

Gate CR selected next action:

`post_v1_wall_common_auto_topology_second_pass_gate_cs_plan`

Gate CR selected next file:

`packages/engine/src/post-v1-wall-common-auto-topology-second-pass-gate-cs-contract.test.ts`

Latest value-moving runtime slice:

`post_v1_wall_common_auto_topology_second_pass_gate_cs_plan`

Gate CS status:

`post_v1_wall_common_auto_topology_second_pass_gate_cs_landed_runtime_selected_next_numeric_coverage_gap_gate_ct`

Gate CS closes the Gate CR selected wall flat-entry routing gap. Safe
explicit `flat_layer_order` double-leaf wall requests with complete
support/stud owner inputs now use the Gate S double-leaf/framed direct
curve through the Gate AR building adapter instead of falling into the
generic lab/field/building basis boundary. The explicit flat-order
variants keep the Gate CJ pins: simple independent `R'w 39 / Dn,w 40 /
Dn,A 38.5 / DnT,w 42 / DnT,A 40.9`, resilient both-sides `R'w 41 /
Dn,w 42 / Dn,A 40.5 / DnT,w 44 / DnT,A 42.9`, multi-board `R'w 46 /
Dn,w 47 / Dn,A 45.7 / DnT,w 49 / DnT,A 48.1`, split air/porous cavity
`R'w 44 / Dn,w 44 / Dn,A 43.1 / DnT,w 47 / DnT,A 45.5`, and
asymmetric board-count `R'w 43 / Dn,w 43 / Dn,A 42.1 / DnT,w 46 /
DnT,A 44.5`. Gate CS carried explicit `flat_layer_order` multicavity
stacks forward to a separate grouped multicavity owner instead of
widening them in the double-leaf slice; missing
`supportTopology`, missing `studSpacingMm`, and missing
`resilientBarSideCount` remain `needs_input`; lab metrics still do not
alias into field/building metrics. Counters:
`newCalculableLayerTemplates 0`, `newCalculableRequestShapes 5`,
`runtimeCorrectedLayerTemplates 5`, and
`runtimeCorrectedRequestShapes 25`.

Gate CS selected next action:

`post_v1_next_numeric_coverage_gap_gate_ct_plan`

Gate CS selected next file:

`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ct-contract.test.ts`

Latest no-runtime numeric coverage selection:

`post_v1_next_numeric_coverage_gap_gate_ct_plan`

Gate CT status:

`post_v1_next_numeric_coverage_gap_gate_ct_landed_no_runtime_selected_wall_flat_layer_order_multicavity_gate_cu`

Gate CT selects
`wall.flat_layer_order_multicavity_grouped_owner_gap` as the highest-ROI
engine-only formula-routing slice after Gate CS. Safe explicit
`flat_layer_order` multicavity wall entry is the gap: five-segment
`leaf / cavity / leaf / cavity / leaf` stacks with explicit
`supportTopology` can already use the existing grouped multicavity
owner, but were still stopped by the older flat-order ambiguity guard.
Gate CU must connect that layer order to the existing Gate AE
multicavity lab formula plus Gate I/Gate AR field/building adapters,
preserve missing `supportTopology` as `needs_input`, keep contradictory
explicit grouped indices blocked, and keep lab/field/building metric
owners separate. Gate CT moved no runtime values and touched no frontend
implementation. Counters: `candidateCount 10`,
`newCalculableLayerTemplates 0`, `newCalculableRequestShapes 0`,
`runtimeValuesMoved 0`, `estimatedNextNewCalculableLayerTemplates 1`,
and `estimatedNextNewCalculableRequestShapes 14`.

Gate CT selected next action:

`post_v1_wall_flat_layer_order_multicavity_gate_cu_plan`

Gate CT selected next file:

`packages/engine/src/post-v1-wall-flat-layer-order-multicavity-gate-cu-contract.test.ts`

Latest value-moving runtime slice:

`post_v1_wall_flat_layer_order_multicavity_gate_cu_plan`

Gate CU status:

`post_v1_wall_flat_layer_order_multicavity_gate_cu_landed_runtime_selected_next_numeric_coverage_gap_gate_cv`

Gate CU closes the Gate CT selected formula-routing gap. Safe explicit
`flat_layer_order` multicavity wall requests with a five-segment
leaf/cavity/leaf/cavity/leaf layer order and explicit `supportTopology`
now use the Gate AE two-cavity multicavity formula for lab
`Rw/STC/C/Ctr`, the Gate I field adapter for field/apparent outputs,
and the Gate AR building adapter for building-prediction outputs. The
pinned lab answer is `Rw 53 / STC 57 / C -0.6 / Ctr -8`; field and
building requests publish `R'w 53 / Dn,w 53 / Dn,A 52 / DnT,w 54 /
DnT,A 53.5`. Missing `supportTopology` remains `needs_input`,
contradictory explicit grouped indices on `flat_layer_order` remain
blocked, field/building requests still require their own room/flanking
context, and lab metrics are not relabelled as field/building metrics
without the owned adapters. Counters: `newCalculableLayerTemplates 1`,
Gate CU exact pins: `Rw 53 / STC 57 / C -0.6 / Ctr -8`; `R'w 53 / Dn,w 53 / Dn,A 52 / DnT,w 54 / DnT,A 53.5`.
`newCalculableRequestShapes 14`, `runtimeCorrectedLayerTemplates 1`,
and `runtimeCorrectedRequestShapes 14`.

Gate CU selected next action:

`post_v1_next_numeric_coverage_gap_gate_cv_plan`

Gate CU selected next file:

`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-cv-contract.test.ts`

Latest no-runtime numeric coverage selection:

`post_v1_next_numeric_coverage_gap_gate_cv_plan`

Gate CV status:

`post_v1_next_numeric_coverage_gap_gate_cv_landed_no_runtime_selected_wall_local_substitution_building_adapter_gate_cw`

Gate CV selects
`wall.local_substitution_building_prediction_adapter_gap` as the
highest-ROI engine-only formula/adapter-routing slice after Gate CU. Lab
`Rw/STC/C/Ctr` and field `R'w/DnT,w` already calculate for the
local-substitution triple-leaf wall family, but complete
`building_prediction` context still stops as unsupported. Gate CW must
connect the family-specific lab curve to the existing building-prediction
corridor while preserving building physical-input stops, exact-source
precedence, and lab/field/building metric boundaries. Gate CV moved no
runtime values and touched no frontend implementation. Counters:
`candidateCount 11`, `newCalculableLayerTemplates 0`,
`newCalculableRequestShapes 0`, `runtimeValuesMoved 0`,
`estimatedNextNewCalculableLayerTemplates 1`, and
`estimatedNextNewCalculableRequestShapes 5`.

Gate CV selected next action:

`post_v1_wall_local_substitution_building_adapter_gate_cw_plan`

Gate CV selected next file:

`packages/engine/src/post-v1-wall-local-substitution-building-adapter-gate-cw-contract.test.ts`

Previous value-moving runtime slice:

`post_v1_opening_leak_composite_wall_adapters_gate_ck_plan`

Gate CK status:

`post_v1_opening_leak_composite_wall_adapters_gate_ck_landed_runtime_selected_next_numeric_coverage_gap_gate_cl`

Gate CK corrects opening/leak/composite wall adapter routing. Complete
top-level field opening/leak contexts now use the owned Gate S lab
composite `Rw` anchor plus the field area-energy adapter without a
hidden adapter-boundary flag and publish `R'w 36.4 / Dn,w 36.7 /
DnT,w 36.9`. Complete top-level building-prediction opening/leak
contexts publish `R'w 31.6 / DnT,w 32.1` through the building adapter.
Missing room/flanking physical inputs remain `needs_input`,
`frequencyBandSet` remains required for `Dn,A` / `DnT,A`, and lab `Rw` /
STC remain separate metrics. Gate CK selected
`post_v1_next_numeric_coverage_gap_gate_cl_plan` in
`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-cl-contract.test.ts`.

Latest no-runtime accuracy/rerank slice:

`post_v1_next_numeric_coverage_gap_gate_cl_plan`

Gate CL status:

`post_v1_next_numeric_coverage_gap_gate_cl_landed_no_runtime_selected_required_physical_input_surface_parity_gate_cm`

Gate CL creates residual and holdout ledgers without moving runtime
values. It keeps five already-owned route families on their current
wider budgets until same-family calibration rows and same-basis holdout
rows exist: common flat double-leaf building prediction, opening/leak
field/building, open-box raw-bare lab impact, open-web raw-bare lab
impact, and heavy floating upper-treatment field companion. It also
blocks source-proximity rows from promoting runtime values by themselves.
Counters: `residualLedgers 5`, `budgetsHeldWide 5`,
`budgetsTightened 0`, `newCalculableLayerTemplates 0`,
`newCalculableRequestShapes 0`, and
`runtimePromotionsFromSourceProximity 0`. Gate CL selected
`post_v1_required_physical_input_surface_parity_gate_cm_plan` in
`packages/engine/src/post-v1-required-physical-input-surface-parity-gate-cm-contract.test.ts`.

Latest no-runtime required physical input guard:

`post_v1_required_physical_input_surface_parity_gate_cm_plan`

Gate CM status:

`post_v1_required_physical_input_surface_parity_gate_cm_landed_no_runtime_selected_next_numeric_coverage_gap_gate_cn`

Gate CM pins selected-route required physical input and `needs_input`
boundaries without moving runtime values. It covers Gate CK opening/leak
field/building, Gate CJ common flat double-leaf building prediction, Gate
CG2 heavy-floating dynamic `DeltaLw`, and Gate CH direct/flanking
field-impact `L'nT,50`. It does not touch frontend implementation,
retune formulas, or crawl source rows. Counters:
`inputSurfaceLedgers 4`, `requiredPhysicalInputsPinned 20`,
`guardedRequestShapes 15`, `newCalculableLayerTemplates 0`,
`newCalculableRequestShapes 0`, and `runtimeValuesMoved 0`. Gate CM
selected `post_v1_next_numeric_coverage_gap_gate_cn_plan` in
`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-cn-contract.test.ts`.

Latest no-runtime numeric coverage selection:

`post_v1_next_numeric_coverage_gap_gate_cn_plan`

Gate CN status:

`post_v1_next_numeric_coverage_gap_gate_cn_landed_no_runtime_selected_floor_visible_layer_upper_package_delta_lw_gate_co`

Gate CN selected
`floor.visible_layer_upper_package_delta_lw_formula_routing_gap` as the
highest-ROI next calculator slice. The deciding implementation fact is
that timber/CLT `DeltaLw` formula owners already calculate with explicit
`impactPredictorInput`, while visible tagged CLT and timber upper-package
layer stacks with equivalent physical inputs still publish only `Ln,w`.
Gate CO must route those layer-entered combinations into the existing
`DeltaLw` owner without weakening exact/predicted `Ln,w` precedence,
missing-field `needs_input`, or ISO/ASTM boundaries. Gate CN moved no
runtime values, touched no frontend implementation, selected no broad
source crawl, and selected no confidence wording. Counters:
`candidateCount 7`, `newCalculableLayerTemplates 0`,
`newCalculableRequestShapes 0`, `runtimeValuesMoved 0`,
`estimatedNextNewCalculableLayerTemplates 2`, and
`estimatedNextNewCalculableRequestShapes 10`.

Gate CN selected next action:

`post_v1_floor_visible_layer_upper_package_delta_lw_gate_co_plan`

Gate CN selected next file:

`packages/engine/src/post-v1-floor-visible-layer-upper-package-delta-lw-gate-co-contract.test.ts`

Previous value-moving runtime slice:

`post_v1_wall_common_auto_topology_expansion_gate_cj_plan`

Gate CJ status:

`post_v1_wall_common_auto_topology_expansion_gate_cj_landed_runtime_selected_opening_leak_composite_wall_adapters_gate_ck`

Gate CJ corrects common flat double-leaf wall `building_prediction`
routing. Complete support-owned simple independent, resilient
both-sides, multi-board, split air/porous cavity, asymmetric, and
explicit double-leaf stacks now use the Gate S double-leaf/framed direct
curve inside the Gate AR building adapter instead of generic building
fallback or unsupported explicit-topology behavior. Missing
`supportTopology`, missing `studSpacingMm`, explicit `flat_layer_order`,
missing `sourceRoomVolumeM3`, and missing `resilientBarSideCount` remain
value-less boundaries. Gate CJ selected
`post_v1_opening_leak_composite_wall_adapters_gate_ck_plan` in
`packages/engine/src/post-v1-opening-leak-composite-wall-adapters-gate-ck-contract.test.ts`.

Gate CI landed as:

`post_v1_next_numeric_coverage_gap_gate_ci_plan`

Gate CI status:

`post_v1_next_numeric_coverage_gap_gate_ci_landed_no_runtime_selected_wall_common_auto_topology_expansion_gate_cj`

Gate CI preserves the exact ASTM E492/E1007 one-third-octave `IIC` /
`AIIC` owner, proves representative ISO impact routes keep ASTM aliases
unsupported, and selects `wall.common_auto_topology_expansion` as the
next value-moving engine slice. The Gate CI/CJ implementation comparison
plan is
`docs/calculator/POST_V1_GATE_CI_CJ_ENGINE_PLAN_2026-06-05.md`.

Gate CI selected next action:

`post_v1_wall_common_auto_topology_expansion_gate_cj_plan`

Gate CI selected next file:

`packages/engine/src/post-v1-wall-common-auto-topology-expansion-gate-cj-contract.test.ts`

Gate CH landed as
`post_v1_next_numeric_coverage_gap_gate_ch_plan` with status
`post_v1_next_numeric_coverage_gap_gate_ch_landed_runtime_selected_next_numeric_coverage_gap_gate_ci`.
It corrects the field/building direct+flanking low-frequency companion
for visible heavy-floating reinforced-concrete upper-treatment stacks:
with explicit direct/flanking impact context and explicit
`impactFieldContext.ci50_2500Db`, the published upper-treatment
`Ln,w 50` anchor now publishes `L'n,w 57.5 / L'nT,w 55.1 / L'nT,50 59.1` through
`source_absent_field_building_adapter_error_budget`. Missing
`impactFieldContext.ci50_2500Db` still stops only `L'nT,50` as
`needs_input`; ASTM `IIC` / `AIIC` remain unsupported without ASTM
E492/E1007 owners. Counters: `newCalculableLayerTemplates 2`,
`newCalculableRequestShapes 4`, and `runtimeCorrectedRequestShapes 3`.
Gate CH selected `post_v1_next_numeric_coverage_gap_gate_ci_plan` in
`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ci-contract.test.ts`.

Gate CG2 landed as
`post_v1_floor_common_floating_covering_expansion_gate_cg2_plan` with
status
`post_v1_floor_common_floating_covering_expansion_gate_cg2_landed_selected_next_numeric_coverage_gap_gate_ch`.
It is the second common floor floating/covering expansion runtime slice:
visible heavy-floating reinforced-concrete upper-treatment stacks now
keep the published-family `Ln,w 50` anchor live when `loadBasisKgM2` or
`resilientLayerDynamicStiffnessMNm3` is missing, while `DeltaLw` remains
`needs_input` for the exact missing owner field. With complete
`impactFieldContext`, the same anchor publishes `L'n,w 52`,
`L'nT,w 49.6`, and `L'nT,50 53.6`; complete explicit dynamic input
still uses `Ln,w 50.3` / `DeltaLw 24.3`. Counters:
`newCalculableLayerTemplates 2`, `newCalculableRequestShapes 10`, and
`runtimeCorrectedRequestShapes 8`. ASTM `IIC` / `AIIC` remain
unsupported without ASTM E492/E1007 owners. Gate CG2 added shared
resolver owner
`floor.heavy_concrete_floating.published_upper_treatment_anchor_owned`;
the resolver surface now has 43 declared candidates and 40 active
runtime-basis mappings. Historical Gate H-M resolver snapshots recorded
42 declared candidates and 39 active runtime-basis mappings before Gate
CG2 added the published upper-treatment owner. Gate CG2 selected
`post_v1_next_numeric_coverage_gap_gate_ch_plan` in
`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ch-contract.test.ts`.

Gate CG landed as
`post_v1_floor_common_floating_covering_expansion_gate_cg_plan` with
status
`post_v1_floor_common_floating_covering_expansion_gate_cg_landed_partial_selected_floor_common_floating_covering_expansion_gate_cg2`.
It is the first common floor floating/covering expansion runtime slice:
visible floor-covering-only heavy/reinforced concrete stacks now keep
the owned bare-heavy `Ln,w` answer live when `DeltaLw` or field impact
companions are requested. Representative covering templates publish
`Ln,w 71.2`, `71.6`, `71.5`, and `71.4`; with explicit
`impactFieldContext` they also publish `L'n,w`, `L'nT,w`, and
`L'nT,50`. `DeltaLw` remains `needs_input` for
`toppingOrFloatingLayer`, `resilientLayerDynamicStiffnessMNm3`, and
`loadBasisKgM2`. Counters: `newCalculableLayerTemplates 4`,
`newCalculableRequestShapes 20`, and `runtimeCorrectedRequestShapes 12`.
ASTM `IIC` / `AIIC` remain unsupported without ASTM E492/E1007 owners.
Gate CG was intentionally marked partial because the broader floor
floating/covering expansion still needs more common floating and lower
treatment templates before moving to Gate CH.

Gate CF repairs and pins target-output independence across existing
runtime families. Flat double-leaf and full-fill multileaf wall
`field_between_rooms` contexts now calculate single-output `Rw`, STC,
`C`, and `Ctr` through the owned family route instead of screening
fallback or unsupported publication. It also pins single-output parity
for raw-bare open-web/open-box field impact, heavy-concrete combined lab
impact, and steel suspended-ceiling field impact. Counters:
`newSingleOutputParityPins 37`, `runtimeCorrectedRequestShapes 8`,
`newCalculableRequestShapes 8`, `newCalculableLayerTemplates 0`.
Missing field `receivingRoomRt60S`, ASTM `IIC` / `AIIC`, and field-only
wall request boundaries remain protected.

Gate CD corrected finished open-box target-output independence. Complete
dry package-transfer and EPS/screed hybrid building/impact requests now
support already-owned single-output asks without requiring the user to
also ask for `R'w` or another building output. Dry pins include
`Rw 66`, `C -3.9`, `Ln,w 50.8`, `L'n,w 52.8`, `L'nT,w 50.4`, and
`L'nT,50 53.7`; EPS/screed pins include `Rw 72`, `C -1.3`,
`Ln,w 47`, `L'n,w 49`, `L'nT,w 46.6`, and `L'nT,50 47.6`. Missing
`impactFieldContext` still leaves field impact outputs unsupported.
`Ctr`, ASTM `IIC`, and ASTM `AIIC` remain unsupported because these
metric-basis owners are separate.

Post-V1 selection rule: every next gate must be calculator-capability
work. It must either expand the set of physically valid layer
combinations that can calculate owned acoustic outputs, or improve the
correctness/calibration/boundary handling of an existing calculation
route. Do not select broad source crawling, finite scenario packs,
confidence wording, report polish, storage/auth work, or generic UI
cleanup as the active calculator slice unless a previous executable
numeric/correctness gate explicitly makes that work necessary to prove
calculator scope or accuracy.

Latest landed value-moving action:

`post_v1_floor_visible_layer_upper_package_delta_lw_gate_co_plan`

Latest landed value-moving file:

`packages/engine/src/post-v1-floor-visible-layer-upper-package-delta-lw-gate-co-contract.test.ts`

Gate CO selection status:

`post_v1_floor_visible_layer_upper_package_delta_lw_gate_co_landed_runtime_selected_next_numeric_coverage_gap_gate_cp`

Gate CH selected next action:

`post_v1_next_numeric_coverage_gap_gate_ci_plan`

Gate CH selected next file:

`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ci-contract.test.ts`

Latest landed no-runtime selection:

`post_v1_next_numeric_coverage_gap_gate_ci_plan`

Gate CI selection status:

`post_v1_next_numeric_coverage_gap_gate_ci_landed_no_runtime_selected_wall_common_auto_topology_expansion_gate_cj`

Gate CI selected candidate:

`wall.common_auto_topology_expansion`

Gate CI selected next action:

`post_v1_wall_common_auto_topology_expansion_gate_cj_plan`

Gate CI selected next file:

`packages/engine/src/post-v1-wall-common-auto-topology-expansion-gate-cj-contract.test.ts`

Previous landed value-moving action:

`post_v1_floor_common_floating_covering_expansion_gate_cg2_plan`

Previous landed value-moving file:

`packages/engine/src/post-v1-floor-common-floating-covering-expansion-gate-cg2-contract.test.ts`

Gate CG2 selection status:

`post_v1_floor_common_floating_covering_expansion_gate_cg2_landed_selected_next_numeric_coverage_gap_gate_ch`

Gate CG2 selected next action:

`post_v1_next_numeric_coverage_gap_gate_ch_plan`

Gate CG2 selected next file:

`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ch-contract.test.ts`

Previous landed value-moving action:

`post_v1_floor_common_floating_covering_expansion_gate_cg_plan`

Gate CG selection status:

`post_v1_floor_common_floating_covering_expansion_gate_cg_landed_partial_selected_floor_common_floating_covering_expansion_gate_cg2`

Gate CG selected next action:

`post_v1_floor_common_floating_covering_expansion_gate_cg2_plan`

Gate CG selected next file:

`packages/engine/src/post-v1-floor-common-floating-covering-expansion-gate-cg2-contract.test.ts`

Previous landed value-moving action:

`post_v1_target_output_independence_sweep_gate_cf_plan`

Gate CF selection status:

`post_v1_target_output_independence_sweep_gate_cf_landed_selected_floor_common_floating_covering_expansion_gate_cg`

Gate CF selected next action:

`post_v1_floor_common_floating_covering_expansion_gate_cg_plan`

Gate CF selected next file:

`packages/engine/src/post-v1-floor-common-floating-covering-expansion-gate-cg-contract.test.ts`

Previous landed value-moving action:

`post_v1_floor_open_box_target_output_independence_gate_cd_plan`

Gate CD selection status:

`post_v1_floor_open_box_target_output_independence_gate_cd_landed_selected_next_numeric_coverage_gap_gate_ce`

Gate CD selected next action:

`post_v1_next_numeric_coverage_gap_gate_ce_plan`

Gate CD selected next file:

`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ce-contract.test.ts`

Previous no-runtime selection:

`post_v1_next_numeric_coverage_gap_gate_ce_plan`

Gate CE selection status:

`post_v1_next_numeric_coverage_gap_gate_ce_landed_no_runtime_selected_target_output_independence_sweep_gate_cf`

Gate CE selected candidate:

`target_output_independence_sweep`

Gate CE selected next action:

`post_v1_target_output_independence_sweep_gate_cf_plan`

Gate CE selected next file:

`packages/engine/src/post-v1-target-output-independence-sweep-gate-cf-contract.test.ts`

Gate CE planning input:

`POST_V1_HIGH_ROI_SCOPE_ACCURACY_GATES_AFTER_GATE_CD_PLAN_2026-06-02.md`

That plan is not runtime movement. It records the high-ROI
scope/accuracy candidate set that Gate CE must rank before selecting the
next value-moving post-V1 gate. Gate CE has now selected
`target_output_independence_sweep` as
`post_v1_target_output_independence_sweep_gate_cf_plan`, now closed by
Gate CF. The remaining
ranked candidates stay as follow-up scope/accuracy options: common floor
floating/covering expansion, field/building direct + flanking adapters,
ASTM `IIC` / `AIIC` expansion beyond the already-landed exact
E492/E1007 E989 bridge, common wall auto-topology expansion,
opening/leak/composite wall adapters, residual accuracy + holdouts, and
selected-route physical input surface parity. Its 2026-06-02
implementation audit also records that existing wall auto-topology,
opening/leak, ASTM exact-band, and holdout surfaces are baselines to
preserve and extend, not work to re-land.

Previous landed no-runtime selection:

`post_v1_next_numeric_coverage_gap_gate_cc_plan`

Gate CC selection status:

`post_v1_next_numeric_coverage_gap_gate_cc_landed_no_runtime_selected_floor_open_box_target_output_independence_gate_cd`

Gate CC selected candidate:

`floor.open_box_timber_finished_package.target_output_independence_gap`

Gate CC selected next action:

`post_v1_floor_open_box_target_output_independence_gate_cd_plan`

Gate CC selected next file:

`packages/engine/src/post-v1-floor-open-box-target-output-independence-gate-cd-contract.test.ts`

Previous landed value-moving action:

`post_v1_floor_open_box_eps_screed_full_mixed_field_building_gate_cb_plan`

Gate CB selection status:

`post_v1_floor_open_box_eps_screed_full_mixed_field_building_gate_cb_landed_selected_next_numeric_coverage_gap_gate_cc`

Gate CB selected next action:

`post_v1_next_numeric_coverage_gap_gate_cc_plan`

Previous landed no-runtime selection:

`post_v1_next_numeric_coverage_gap_gate_ca_plan`

Gate CA selection status:

`post_v1_next_numeric_coverage_gap_gate_ca_landed_no_runtime_selected_floor_open_box_eps_screed_full_mixed_field_building_gate_cb`

Gate CA selected candidate:

`floor.open_box_timber_eps_screed_hybrid.full_mixed_field_building_gap`

Gate CA selected next action:

`post_v1_floor_open_box_eps_screed_full_mixed_field_building_gate_cb_plan`

Previous landed value-moving action:

`post_v1_floor_open_box_finished_package_full_mixed_building_impact_gate_bz_plan`

Gate BZ selection status:

`post_v1_floor_open_box_finished_package_full_mixed_building_impact_gate_bz_landed_selected_next_numeric_coverage_gap_gate_ca`

Gate BZ closeout pins include dry `Rw 66 / C -3.9`,
`R'w 64 / DnT,w 67`,
`Ln,w 50.8 / CI 1.2 / CI,50-2500 3.3 / Ln,w+CI 52`, and
`L'n,w 52.8 / L'nT,w 50.4 / L'nT,50 53.7`; EPS/screed remains
`Rw 72 / C -1.3`, `R'w 70 / DnT,w 73`, and
`Ln,w 47 / CI 0 / CI,50-2500 1 / Ln,w+CI 47`. After Gate CB the same
EPS/screed full mixed route also publishes
`L'n,w 49 / L'nT,w 46.6 / L'nT,50 47.6`.

Previous landed no-runtime selection:

`post_v1_next_numeric_coverage_gap_gate_by_plan`

Gate BY selection status:

`post_v1_next_numeric_coverage_gap_gate_by_landed_no_runtime_selected_floor_open_box_finished_package_full_mixed_building_impact_gate_bz`

Gate BY selected candidate:

`floor.open_box_timber_finished_package.full_mixed_building_impact_gap`

Gate BY selected next action:

`post_v1_floor_open_box_finished_package_full_mixed_building_impact_gate_bz_plan`

Gate BY selected next file:

`packages/engine/src/post-v1-floor-open-box-finished-package-full-mixed-building-impact-gate-bz-contract.test.ts`

Previous landed value-moving action:

`post_v1_floor_open_box_finished_package_lab_metric_projection_gate_bx_plan`

Gate BX selection status:

`post_v1_floor_open_box_finished_package_lab_metric_projection_gate_bx_landed_selected_next_numeric_coverage_gap_gate_by`

Gate BX selected next action:

`post_v1_next_numeric_coverage_gap_gate_by_plan`

Gate BX selected next file:

`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-by-contract.test.ts`

Previous landed no-runtime selection:

`post_v1_next_numeric_coverage_gap_gate_bw_plan`

Gate BW selection status:

`post_v1_next_numeric_coverage_gap_gate_bw_landed_no_runtime_selected_floor_open_box_finished_package_lab_metric_projection_gate_bx`

Gate BW selected candidate:

`floor.open_box_timber_finished_package.lab_metric_projection_gap`

Gate BW selected next action:

`post_v1_floor_open_box_finished_package_lab_metric_projection_gate_bx_plan`

Gate BW selected next file:

`packages/engine/src/post-v1-floor-open-box-finished-package-lab-metric-projection-gate-bx-contract.test.ts`

Previous landed value-moving action:

`post_v1_floor_open_box_finished_package_mixed_lab_building_companion_gate_bv_plan`

Gate BV selection status:

`post_v1_floor_open_box_finished_package_mixed_lab_building_companion_gate_bv_landed_selected_next_numeric_coverage_gap_gate_bw`

Gate BV selected next action:

`post_v1_next_numeric_coverage_gap_gate_bw_plan`

Gate BV selected next file:

`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-bw-contract.test.ts`

Previous landed value-moving action:

`post_v1_floor_open_box_finished_package_airborne_building_companion_gate_bu_plan`

Gate BU selection status:

`post_v1_floor_open_box_finished_package_airborne_building_companion_gate_bu_landed_selected_next_numeric_coverage_gap_gate_bv`

Previous landed no-runtime selection:

`post_v1_next_numeric_coverage_gap_gate_bt_plan`

Gate BT selection status:

`post_v1_next_numeric_coverage_gap_gate_bt_landed_no_runtime_selected_floor_open_box_finished_package_airborne_building_companion_gate_bu`

Gate BT selected candidate:

`floor.open_box_timber_finished_package.airborne_building_companion_gap`

Gate BT selected next action:

`post_v1_floor_open_box_finished_package_airborne_building_companion_gate_bu_plan`

Gate BT selected next file:

`packages/engine/src/post-v1-floor-open-box-finished-package-airborne-building-companion-gate-bu-contract.test.ts`

Current full-gate evidence after Gate DA on 2026-06-05:
`NEXT_DIST_DIR=.next-gate-da pnpm calculator:gate:current` passed with
engine 618 files / 3396 tests, web 113 files / 438 passed + 18 skipped,
repo build 5 / 5, and whitespace guard passed. Closed-gate history remains below and is
historical unless it agrees with the Gate CD/Gate CE selection above.

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

Gate BH has now landed as:

`post_v1_floor_mixed_support_family_owner_boundary_gate_bh_plan`

Gate BH selection status:

`post_v1_floor_mixed_support_family_owner_boundary_gate_bh_landed_no_runtime_selected_floor_mixed_support_family_runtime_corridor_gate_bi`

Gate BH pins `primaryCarrierFamily`, `dominantImpactTransferFamily`,
`mixedSupportRolePartition`, `secondarySupportTreatmentOwner`, and
`duplicateOwnershipGuard` as no-default owner fields. Existing
mixed-support stacks stay fail-closed behind `duplicateOwnershipGuard`,
and ASTM `IIC` / `AIIC` aliases remain unsupported. This is no-runtime
scope/accuracy boundary work.

Gate BH selected next action:

`post_v1_floor_mixed_support_family_runtime_corridor_gate_bi_plan`

Gate BH selected next file:

`packages/engine/src/post-v1-floor-mixed-support-family-runtime-corridor-gate-bi-contract.test.ts`

Gate BI must be the value-moving follow-up for the admitted explicit
single-primary-carrier mixed-support subset and must preserve the Gate
BH negative boundaries.

Gate BI has now landed as:

`post_v1_floor_mixed_support_family_runtime_corridor_gate_bi_plan`

Gate BI selection status:

`post_v1_floor_mixed_support_family_runtime_corridor_gate_bi_landed_selected_floor_mixed_support_family_surface_parity_gate_bj`

Gate BI opens the explicit single-primary-carrier mixed-support runtime.
The pinned complete case calculates `Ln,w 44.6` / `DeltaLw 29.9`; with
explicit `impactFieldContext` it also calculates `L'n,w 46.6`,
`L'nT,w 43.8`, and `L'nT,50 47.8`. Missing owner fields still stop as
`needs_input`, unsafe duplicate partitions do not fall through to
another family solver, and ASTM `IIC` / `AIIC` remain unsupported.

Gate BI selected next action:

`post_v1_floor_mixed_support_family_surface_parity_gate_bj_plan`

Gate BI selected next file:

`packages/engine/src/post-v1-floor-mixed-support-family-surface-parity-gate-bj-contract.test.ts`

Gate BJ has now landed as:

`post_v1_floor_mixed_support_family_surface_parity_gate_bj_plan`

Gate BJ selection status:

`post_v1_floor_mixed_support_family_surface_parity_gate_bj_landed_no_runtime_selected_next_numeric_coverage_gap_gate_bk`

Gate BJ is no-runtime mixed-support surface parity plus usage-placement
correction. workbench cards, Markdown report, saved replay, estimate API,
impact-only API, resolver trace, and dynamic impact trace now expose the
same Gate BI mixed-support single-primary-carrier answer. The visible
mixed-support floor stack calculates `Ln,w 44.6` / `DeltaLw 29.9`; with
explicit `impactFieldContext` it also calculates `L'n,w 46.6`,
`L'nT,w 43.8`, and `L'nT,50 47.8` on
`predictor_mixed_support_primary_heavy_concrete_combined_owner_guarded_estimate`.
`calculateAssembly` now lets that explicit mixed-support owner path
through instead of withholding it behind unrelated older floating-floor
inputs. Missing owner fields, unsafe duplicate partitions, and ASTM
`IIC` / `AIIC` remain stopped.

Gate BJ selected next action:

`post_v1_next_numeric_coverage_gap_gate_bk_plan`

Gate BJ selected next file:

`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-bk-contract.test.ts`

Gate BK has now landed as:

`post_v1_floor_open_web_raw_bare_field_companion_gate_bk_plan`

Gate BK selection status:

`post_v1_floor_open_web_raw_bare_field_companion_gate_bk_landed_selected_next_numeric_coverage_gap_gate_bl`

Gate BK is runtime calculator coverage: the raw-bare open-web steel
base-only stack keeps lab `Ln,w 96`, `CI 1.8`, `CI,50-2500 5.2`, and
`Ln,w+CI 97.8`, and with explicit `impactFieldContext` now calculates
`L'n,w 98`, `L'nT,w 95.6`, and `L'nT,50 100.8`. Field-only requests
derive the lab anchor internally. Missing field context remains
`needs_input`; building prediction, open-box raw-bare field transfer,
and ASTM `IIC` / `AIIC` aliases remain blocked.

Gate BK selected next action:

`post_v1_next_numeric_coverage_gap_gate_bl_plan`

Gate BL has now landed as a no-runtime scope/accuracy rerank:

`post_v1_next_numeric_coverage_gap_gate_bl_plan`

Gate BL selection status:

`post_v1_next_numeric_coverage_gap_gate_bl_landed_no_runtime_selected_floor_open_box_raw_bare_field_companion_gate_bl`

Gate BL selected candidate:

`floor.open_box_timber_raw_bare.field_companion_runtime_gap`

Gate BL selected next action:

`post_v1_floor_open_box_raw_bare_field_companion_gate_bl_plan`

Gate BL selected next file:

`packages/engine/src/post-v1-floor-open-box-raw-bare-field-companion-gate-bl-contract.test.ts`

The active plan is
[POST_V1_GATE_BL_NUMERIC_COVERAGE_AND_ACCURACY_RERANK_PLAN_2026-06-01.md](./POST_V1_GATE_BL_NUMERIC_COVERAGE_AND_ACCURACY_RERANK_PLAN_2026-06-01.md).
Gate BL moves no runtime values. The selected runtime slice must
calculate open-box raw-bare field companions with pins `L'n,w 93.1`,
`L'nT,w 90.7`, and `L'nT,50 94.1` for the 220 mm carrier with explicit
`impactFieldContext`; building prediction and ASTM `IIC` / `AIIC`
remain blocked.

Gate BL runtime has now landed as:

`post_v1_floor_open_box_raw_bare_field_companion_gate_bl_plan`

Gate BL runtime status:

`post_v1_floor_open_box_raw_bare_field_companion_gate_bl_landed_selected_next_numeric_coverage_gap_gate_bm`

Gate BL is runtime calculator coverage. The 220 mm raw-bare open-box
carrier keeps lab `Ln,w 91.1`, `CI -0.9`, `CI,50-2500 3.4`, and
`Ln,w+CI 90.2`; with explicit `impactFieldContext` it calculates
`L'n,w 93.1`, `L'nT,w 90.7`, and `L'nT,50 94.1`. The 370 mm carrier
calculates `L'n,w 90.2`, `L'nT,w 87.8`, and `L'nT,50 90.9`. Field-only
requests derive the lab anchor internally. Missing field context still
stops as `needs_input`; building prediction and ASTM `IIC` / `AIIC`
remain blocked.

Gate BL selected next action:

`post_v1_next_numeric_coverage_gap_gate_bm_plan`

Gate BM has now landed as:

`post_v1_next_numeric_coverage_gap_gate_bm_plan`

Gate BM status:

`post_v1_next_numeric_coverage_gap_gate_bm_landed_runtime_selected_next_numeric_coverage_gap_gate_bn`

Gate BM is runtime calculator coverage for
`floor.raw_bare_open_web.building_prediction_impact_direct_flanking_runtime_gap`.
The 300 mm raw-bare open-web steel carrier with explicit direct+flanking
`impactFieldContext` now calculates `L'n,w 97.8`, `L'nT,w 95.4`, and
`L'nT,50 100.6` under `contextMode=building_prediction`. `R'w`,
`DnT,w`, and lab `Ln,w` are not published as floor building outputs,
open-box raw-bare building prediction remains blocked, and ASTM `IIC` /
`AIIC` remain unsupported. Source-absent single-number direct+flanking
uplifts above `12 dB` stay blocked until exact path or impact-band
evidence exists.

Gate BM selected next action:

`post_v1_next_numeric_coverage_gap_gate_bn_plan`

Gate BM selected next file:

`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-bn-contract.test.ts`

Gate BM plan:

[POST_V1_GATE_BM_NUMERIC_COVERAGE_AND_ACCURACY_RERANK_PLAN_2026-06-01.md](./POST_V1_GATE_BM_NUMERIC_COVERAGE_AND_ACCURACY_RERANK_PLAN_2026-06-01.md)

Active Gate BN plan:

[POST_V1_GATE_BN_NUMERIC_PLAUSIBILITY_AND_CALIBRATION_PLAN_2026-06-01.md](./POST_V1_GATE_BN_NUMERIC_PLAUSIBILITY_AND_CALIBRATION_PLAN_2026-06-01.md)

Gate BN is an accuracy/plausibility calibration gate. It must compare
current source-absent field/building impact outputs against external
method constraints and implementation pins, keep severe unsupported
uplifts blocked, and only then choose the next value-moving coverage
slice.

Gate BN has now landed as `post_v1_next_numeric_coverage_gap_gate_bn_plan`
with status
`post_v1_next_numeric_coverage_gap_gate_bn_landed_no_runtime_selected_floor_open_box_raw_bare_building_prediction_owner_gate_bo`.
The selected accuracy candidate is
`calculator.numeric_plausibility_and_calibration_sweep.source_absent_field_building_routes`.
Gate BN selects `floor.open_box_timber_raw_bare.building_prediction_owner_gap`
and `post_v1_floor_open_box_raw_bare_building_prediction_owner_gate_bo_plan`
in
`packages/engine/src/post-v1-floor-open-box-raw-bare-building-prediction-owner-gate-bo-contract.test.ts`.

Latest landed runtime action:

`post_v1_floor_open_box_raw_bare_building_prediction_owner_gate_bo_plan`

Latest landed runtime file:

`packages/engine/src/post-v1-floor-open-box-raw-bare-building-prediction-owner-gate-bo-contract.test.ts`

Gate BO has now landed with status
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
Gate BP has now landed as
`post_v1_next_numeric_coverage_gap_gate_bp_plan` with status
`post_v1_next_numeric_coverage_gap_gate_bp_landed_no_runtime_selected_floor_raw_bare_airborne_building_prediction_gate_bq`.
It selected
`floor.raw_bare_floor_airborne_building_prediction_owner_gap` and
`post_v1_floor_raw_bare_airborne_building_prediction_gate_bq_plan` in
`packages/engine/src/post-v1-floor-raw-bare-airborne-building-prediction-gate-bq-contract.test.ts`.
This is scope/accuracy calculator work: raw-bare floor building
airborne outputs (`R'w`, `Dn,w`, `Dn,A`, `DnT,w`, `DnT,A`) must use
the owned direct raw-bare `Rw` path rather than generic screening.
Gate BQ has now landed as
`post_v1_floor_raw_bare_airborne_building_prediction_gate_bq_plan`
with status
`post_v1_floor_raw_bare_airborne_building_prediction_gate_bq_landed_runtime_selected_next_numeric_coverage_gap_gate_br`.
The 220 mm raw-bare open-box building airborne case now publishes
`R'w 36` and `DnT,w 39`; thicker open-box and open-web raw-bare
carriers follow the same owner path instead of generic screening.
ASTM `IIC` / `AIIC` remain unsupported without their own ASTM owner.
Gate BQ selects `post_v1_next_numeric_coverage_gap_gate_br_plan` in
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

Current reconciliation checkpoint:

[CHECKPOINT_2026-06-06_DOCS_IMPLEMENTATION_SYNC_AFTER_GATE_DB.md](./CHECKPOINT_2026-06-06_DOCS_IMPLEMENTATION_SYNC_AFTER_GATE_DB.md)

Historical Gate BT reconciliation checkpoint:

[CHECKPOINT_2026-06-01_POST_V1_GATE_BT_STATE_RECONCILIATION.md](./CHECKPOINT_2026-06-01_POST_V1_GATE_BT_STATE_RECONCILIATION.md)

Gate AW direction and implementation plan:

[POST_V1_GATE_AW_DIRECTION_ANALYSIS_AND_PLAN_2026-05-27.md](./POST_V1_GATE_AW_DIRECTION_ANALYSIS_AND_PLAN_2026-05-27.md)

Gate AZ numeric coverage plan:

[POST_V1_GATE_AZ_NUMERIC_COVERAGE_GAP_PLAN_2026-05-27.md](./POST_V1_GATE_AZ_NUMERIC_COVERAGE_GAP_PLAN_2026-05-27.md)

Earlier Gate AY evidence remains recorded for closed-gate continuity:
`post_v1_floor_tuas_c11c_iso_impact_gate_ay_plan` with status
`post_v1_floor_tuas_c11c_iso_impact_gate_ay_landed_selected_next_numeric_coverage_gap_gate_az`
selected `post_v1_next_numeric_coverage_gap_gate_az_plan` for
`floor-tuas-c11c-fail-closed`. It pins `Ln,w 59`, `CI 1`,
`CI,50-2500 1`, `Ln,w+CI 60`, and field `L'nT,50 60.2` on
`tuas_c11c_visible_iso_weighted_impact_tuple_guarded`.

Gate BS landed runtime field-companion coverage and correctness for the
finished open-box floor lane. Dry package-transfer field-only requests
now calculate `L'n,w 52.8 / L'nT,w 50.4 / L'nT,50 53.7` from the same
anchor as mixed requests, and EPS/screed hybrid requests with explicit
`impactFieldContext` now calculate `L'n,w 49 / L'nT,w 46.6 /
L'nT,50 47.6` from the owned `Ln,w 47` / `CI,50-2500 1` lab anchor.
Gate BT then landed as no-runtime calculator selection and selected
Gate BU:
`post_v1_floor_open_box_finished_package_airborne_building_companion_gate_bu_plan`.
This remains calculator scope/correctness work, not a broad source
crawl, confidence wording pass, finite scenario pack, or no-runtime
cartography gate.
Latest full `NEXT_DIST_DIR=.next-gate-dg pnpm calculator:gate:current`
passed after Gate DG with engine 624 files / 3428 tests, web 113 files /
438 passed + 18 skipped, repo build 5 / 5, and whitespace guard passed.

Gate AZ has now landed as no-runtime numeric coverage selection:

`post_v1_next_numeric_coverage_gap_gate_az_plan`

Gate AZ selection status:

`post_v1_next_numeric_coverage_gap_gate_az_landed_no_runtime_selected_floor_dynamic_stiffness_load_basis_owner_gate_ba`

Gate AZ selected next action:

`post_v1_floor_dynamic_stiffness_load_basis_owner_gate_ba_plan`

Gate AZ selected next file:

`packages/engine/src/post-v1-floor-dynamic-stiffness-load-basis-owner-gate-ba-contract.test.ts`

Gate AZ uses the current implementation surfaces and the existing
floor-impact source-absent gap evidence to select one next slice:
`floor.material_owner_gap.dynamic_stiffness_load_basis`. The other
ranked candidates remain
`floor.suspended_ceiling.lower_treatment_coupling_gap` and
`floor.mixed_support_family.multi_family_solver_gap`. The selected
Gate AZ+1 slice must include before/after supported-output evidence and
explicit basis/candidate ownership.

Gate BA has now landed as no-runtime dynamic stiffness / load basis
owner contract:

`post_v1_floor_dynamic_stiffness_load_basis_owner_gate_ba_plan`

Gate BA selection status:

`post_v1_floor_dynamic_stiffness_load_basis_owner_gate_ba_landed_no_runtime_selected_suspended_ceiling_lower_treatment_gate_bb`

Gate BA selected next action:

`post_v1_floor_suspended_ceiling_lower_treatment_gate_bb_plan`

Gate BA selected next file:

`packages/engine/src/post-v1-floor-suspended-ceiling-lower-treatment-gate-bb-contract.test.ts`

Gate BA pins `resilientLayerDynamicStiffnessMNm3` and `loadBasisKgM2`
as no-default physical owner fields. Complete heavy floating inputs keep
the existing `Ln,w 48.7` / `DeltaLw 25.8` runtime; missing dynamic
stiffness or load basis cannot invent `DeltaLw`. The next selected
runtime-family target is suspended-ceiling lower-treatment coupling.

Gate BB has now landed as runtime coverage for that target:

`post_v1_floor_suspended_ceiling_lower_treatment_gate_bb_plan`

Gate BB selection status:

`post_v1_floor_suspended_ceiling_lower_treatment_gate_bb_landed_selected_surface_parity_gate_bc`

Gate BB selected next action:

`post_v1_floor_suspended_ceiling_lower_treatment_surface_parity_gate_bc_plan`

Gate BB selected next file:

`packages/engine/src/post-v1-floor-suspended-ceiling-lower-treatment-surface-parity-gate-bc-contract.test.ts`

Complete visible heavy-concrete combined upper/lower floor stacks with
`acoustic_hanger_ceiling` or `resilient_stud_ceiling` lower-treatment
support now calculate on
`predictor_heavy_combined_upper_lower_floor_iso12354_annexc_estimate`.
Pinned values: acoustic hanger `Ln,w 45.6` / `DeltaLw 28.9`;
resilient stud `Ln,w 44.6` / `DeltaLw 29.9`. Missing
`ceilingOrLowerAssembly` or `loadBasisKgM2` still stops, and ASTM
`IIC` / `AIIC` aliases remain unsupported.

Gate BC has now landed as
`post_v1_floor_suspended_ceiling_lower_treatment_surface_parity_gate_bc_plan`
with status
`post_v1_floor_suspended_ceiling_lower_treatment_surface_parity_gate_bc_landed_selected_coverage_refresh_gate_bd`.
It is no-runtime surface parity: workbench cards, Markdown report, saved
replay, estimate API, impact-only API, and resolver trace now expose the
same layer-derived heavy-concrete combined lower-treatment answer. The
acoustic-hanger case remains `Ln,w 45.6` / `DeltaLw 28.9`; the
resilient-stud case remains `Ln,w 44.6` / `DeltaLw 29.9`. Visible
`acoustic_hanger_ceiling` and `resilient_stud_ceiling` support products
are accepted without duplicate lower support-class fields, while
`resilientLayerDynamicStiffnessMNm3` and `loadBasisKgM2` remain required
physical inputs. ASTM `IIC` / `AIIC` aliases remain unsupported. Gate BC
selects
`post_v1_floor_suspended_ceiling_lower_treatment_coverage_refresh_gate_bd_plan`
in
`packages/engine/src/post-v1-floor-suspended-ceiling-lower-treatment-coverage-refresh-gate-bd-contract.test.ts`.

Gate BD has now landed as
`post_v1_floor_suspended_ceiling_lower_treatment_coverage_refresh_gate_bd_plan`
with status
`post_v1_floor_suspended_ceiling_lower_treatment_coverage_refresh_gate_bd_landed_no_runtime_selected_next_numeric_coverage_gap_gate_be`.
It is no-runtime coverage refresh: acoustic-hanger, resilient-stud, and
impact-only lower-treatment rows are now counted as source-absent
family-physics coverage with pins `Ln,w 45.6` / `DeltaLw 28.9` and
`Ln,w 44.6` / `DeltaLw 29.9`; missing load basis, missing lower
assembly, and ASTM `IIC` / `AIIC` remain value-less boundaries. The
remaining high-risk `floor.mixed_support_family.multi_family_solver_gap`
is carried forward for reranking. Gate BD selects
`post_v1_next_numeric_coverage_gap_gate_be_plan` in
`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-be-contract.test.ts`.

Gate BE has now landed as
`post_v1_next_numeric_coverage_gap_gate_be_plan` with status
`post_v1_next_numeric_coverage_gap_gate_be_landed_no_runtime_selected_floor_suspended_ceiling_lower_treatment_field_companion_gate_bf`.
It selected
`floor.suspended_ceiling_lower_treatment.field_companion_assembly_runtime_gap`
because it directly increases supported field outputs for the
lower-treatment formula lane without requiring source-row crawl. Gate BE
selected
`post_v1_floor_suspended_ceiling_lower_treatment_field_companion_gate_bf_plan`
in
`packages/engine/src/post-v1-floor-suspended-ceiling-lower-treatment-field-companion-gate-bf-contract.test.ts`.

Gate BF has now landed as
`post_v1_floor_suspended_ceiling_lower_treatment_field_companion_gate_bf_plan`
with status
`post_v1_floor_suspended_ceiling_lower_treatment_field_companion_gate_bf_landed_selected_next_numeric_coverage_gap_gate_bg`.
assembly field-only lower-treatment requests now calculate the same
field adapter values already available to mixed lab-plus-field and
impact-only paths. Acoustic hanger pins
`L'n,w 47.6 / L'nT,w 44.8 / L'nT,50 48.8`; resilient stud pins
`L'n,w 46.6 / L'nT,w 43.8 / L'nT,50 47.8`. Missing
`impactFieldContext.ci50_2500Db` remains a value-less `needs_input`
boundary for only `L'nT,50`, and ASTM `IIC` / `AIIC` remain unsupported.
Gate BF selects `post_v1_next_numeric_coverage_gap_gate_bg_plan` in
`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-bg-contract.test.ts`.

Previous Gate AX landed as
`post_v1_wall_framed_building_adapter_gate_ax_plan` with status
`post_v1_wall_framed_building_adapter_gate_ax_landed_selected_next_numeric_coverage_gap_gate_ay`;
it added framed LSF/timber building adapter coverage for source-absent
wall direct-curve families. Complete Gate AR
`building_prediction` requests for `wall-lsf-knauf` now pin `Rw 51`,
STC 51, `C -1.4`, `Ctr -6.4`, `R'w 51`, `Dn,w 51`, `Dn,A 49.6`,
`DnT,w 52`, and `DnT,A 51.1`; `wall-timber-stud` now pins `Rw 42`,
STC 42, `C 0.4`, `Ctr -4.3`, `R'w 42`, `Dn,w 42`, `Dn,A 42.4`,
`DnT,w 43`, and `DnT,A 43.9`. Missing framed metadata and incomplete
building context still stop as `needs_input`; opening/leak building
requests and grouped AAC topology prompts remain closed. Gate AY is
selected through `post_v1_next_numeric_coverage_gap_gate_ay_plan`,
focused on the `floor-tuas-c11c-fail-closed` ISO impact gap. Full
`pnpm calculator:gate:current` passed after
Gate AX with engine 561 files / 3117 tests, web 110 files / 431 passed
and 18 skipped, repo build 5 / 5, and whitespace guard passed.

Gate AV expands floor impact explicit-DeltaLw field companion coverage.
The explicit heavy-reference `DeltaLw` lane that already derives
`Ln,w` from user-supplied `DeltaLw` and carries Gate AU lab companions
now also calculates explicit field companions: `L'n,w = Ln,w + K`,
`L'nT,w` from K plus receiving-room volume, and
`L'nT,50 = L'nT,w + CI,50-2500`. The current pins are `DeltaLw 26`,
heavy-reference derived `Ln,w 52`, explicit `CI -1`, derived
`Ln,w+CI 51`, explicit `CI,50-2500 +4`, `L'n,w 54`, `L'nT,w 52`, and
`L'nT,50 56` on
`mixed_predicted_plus_estimated_standardized_field_volume_normalization`.
Metric basis remains explicit: `predictor_explicit_delta_user_input`
for `DeltaLw`, `predictor_explicit_delta_heavy_reference_derived` for
`Ln,w`, `explicit_user_impact_ci_input` for `CI`,
`estimated_local_guide_lnwci_from_lnw_plus_ci` for `Ln,w+CI`,
`explicit_user_impact_ci50_2500_input` for `CI,50-2500`,
`estimated_field_lprimenw_from_lnw_plus_k` for `L'n,w`,
`estimated_standardized_field_lprimentw_from_lprimenw_plus_room_volume`
for `L'nT,w`, and
`estimated_standardized_field_lpriment50_from_lprimentw_plus_ci50_2500`
for `L'nT,50`. ASTM `IIC` / `AIIC` remain blocked unless their own
ASTM owners exist, and lower-treatment reduction is not reinterpreted as
another `DeltaLw` term. Focused validation passed with engine 5 files /
312 tests and web 5 files / 12 tests. Full
`pnpm calculator:gate:current` passed after Gate AV with engine 559
files / 3109 tests, web 108 files / 429 passed and 18 skipped, repo
build 5 / 5, and whitespace guard passed.

Previous Gate AU expands floor impact explicit-DeltaLw lab companion coverage. The
explicit heavy-reference `DeltaLw` lane that already derives `Ln,w` from
user-supplied `DeltaLw` now also calculates explicit lab companions:
`CI`, `Ln,w+CI`, and `CI,50-2500`. The current pins are `DeltaLw 26`,
heavy-reference derived `Ln,w 52`, explicit `CI -1`, derived
`Ln,w+CI 51`, and explicit `CI,50-2500 +4` on
`predictor_explicit_delta_heavy_reference_derived`. Focused validation
passed with engine 3 files / 305 tests and web 3 files / 5 tests. Full
`pnpm calculator:gate:current` passed after Gate AU with engine 558
files / 3105 tests, web 107 files / 428 passed and 18 skipped, repo
build 5 / 5, and whitespace guard passed.

Previous Gate AT expands floor impact explicit-CI,50-2500 lab companion coverage. Floor
impact lanes that already own live `Ln,w` or conservative `Ln,w` upper
bound and receive explicit user `CI,50-2500` now calculate
`CI,50-2500` without requiring field K, Hd, receiving-room volume,
small-room toggle, or `CI`. The live pins are hollow-core vinyl
`Ln,w 48`, `CI,50-2500 +4`; heavy concrete `Ln,w 50`,
`CI,50-2500 +4`; and steel fallback `Ln,w 58`, `CI,50-2500 +4`. The
bound pins are open-web / UBIQ 300 `Ln,w <= 51`, `CI,50-2500 +4`;
UBIQ 200 `Ln,w <= 53`, `CI,50-2500 +4`; and UBIQ 250 `Ln,w <= 52`,
`CI,50-2500 +4`. `CI`, `Ln,w+CI`, field outputs `L'n,w`, `L'nT,w`,
and `L'nT,50`, and ASTM `IIC` / `AIIC` remain blocked unless their own
inputs/owners exist. Focused validation passed with engine 5 files / 24
tests and web 4 files / 8 tests. Full `pnpm calculator:gate:current`
passed after Gate AT with engine 557 files / 3101 tests, web 106 files
/ 427 passed and 18 skipped, repo build 5 / 5, and whitespace guard
passed.

Previous Gate AS expands floor impact explicit-CI lab companion coverage. Floor
impact lanes that already own live `Ln,w` or conservative `Ln,w` upper
bound and receive explicit user `CI` now calculate `CI` and `Ln,w+CI`
without requiring field K, Hd, receiving-room volume, small-room toggle,
or `CI,50-2500`. The live pins are hollow-core vinyl `Ln,w 48`,
`CI -1`, `Ln,w+CI 47`; heavy concrete `Ln,w 50`, `CI -1`,
`Ln,w+CI 49`; and steel fallback `Ln,w 58`, `CI -1`, `Ln,w+CI 57`.
The bound pins are open-web / UBIQ 300 `Ln,w <= 51`, `CI -1`,
`Ln,w+CI <= 50`; UBIQ 200 `Ln,w <= 53`, `Ln,w+CI <= 52`; and UBIQ 250
`Ln,w <= 52`, `Ln,w+CI <= 51`. Field outputs `L'n,w`, `L'nT,w`, and
`L'nT,50` still require their own physical inputs, and ASTM `IIC` /
`AIIC` remain blocked. Focused validation passed with engine 5 files /
24 tests and web 4 files / 8 tests. Full `pnpm calculator:gate:current`
passed after Gate AS with engine 556 files / 3097 tests, web 105 files
/ 425 passed and 18 skipped, repo build 5 / 5, and whitespace guard
passed.

Previous Gate AR expands floor impact small-room low-frequency coverage. Floor
impact lanes that already calculate `L'nT,w` through the explicit
Turkish small-room guide and receive explicit `CI,50-2500` now
calculate `L'nT,50 = L'nT,w + CI,50-2500` on both live and conservative
bound lanes. The heavy-concrete live small-room pins are `Ln,w 50`,
`L'nT,w 53`, `CI,50-2500 +4`, and `L'nT,50 57`. The UBIQ FL-28
open-web carpet combined-bound small-room pins are `Ln,w+CI <= 45`,
`CI -1`, derived `Ln,w <= 46`, `L'nT,w <= 49`, `CI,50-2500 +4`, and
`L'nT,50 <= 53`. `L'n,w`, ASTM `IIC`, and ASTM `AIIC` remain
unsupported unless a separate owner/input exists. Focused validation
passed with engine 5 files / 24 tests and web 4 files / 8 tests. Full
`pnpm calculator:gate:current` passed after Gate AR with engine 555
files / 3093 tests, web 104 files / 423 passed + 18 skipped, repo
build 5 / 5, and whitespace guard passed.

Previous Gate AQ expands combined-bound floor impact split coverage. Floor
bound lanes that own a conservative combined `Ln,w+CI` upper bound and
receive explicit `CI` now derive `Ln,w` upper bound as
`Ln,w+CI upper bound - CI`. With K and receiving-room volume they also
calculate `L'n,w` and `L'nT,w` upper bounds while preserving the
local-guide `L'nT,50` upper bound. The current UBIQ FL-28 open-web
carpet pins are `Ln,w+CI <= 45`, `CI -1`, derived `Ln,w <= 46`,
`L'n,w <= 49`, `L'nT,w <= 48.9`, and `L'nT,50 <= 48`. Missing CI keeps
split `Ln,w`, `CI`, `L'n,w`, and `L'nT,w` closed; `CI,50-2500`, ASTM
`IIC`, and ASTM `AIIC` remain unsupported unless a separate owner
exists. Focused validation passed with engine 5 files / 27 tests and
web 5 files / 10 tests. Full `pnpm calculator:gate:current` passed
after Gate AQ with engine 554 files / 3089 tests, web 103 files / 421
passed + 18 skipped, repo build 5 / 5, and whitespace guard passed.

Previous Gate AP expanded bound-only floor impact local-guide coverage. Floor
bound lanes that own a conservative `Ln,w` upper bound and receive
explicit `CI` plus local-guide K/Hd inputs now calculate `CI`,
`Ln,w+CI` upper bound, `L'n,w` upper bound, and `L'nT,50` upper bound
from `Ln,w upper bound + CI + K + Hd`: open-web bound and UBIQ steel
300 bound return `Ln,w <= 51`, `CI -1`, `Ln,w+CI <= 50`,
`L'n,w <= 54`, and `L'nT,50 <= 53`; UBIQ steel 200 bound returns
`Ln,w <= 53`, `CI -1`, `Ln,w+CI <= 52`, `L'n,w <= 56`, and
`L'nT,50 <= 55`; UBIQ steel 250 bound returns `Ln,w <= 52`, `CI -1`,
`Ln,w+CI <= 51`, `L'n,w <= 55`, and `L'nT,50 <= 54`. Missing CI now
reports `impactFieldContext.ciDb` when the bound local-guide branch has
K/Hd intent and is otherwise ready. `L'nT,w` still requires receiving
room volume; ASTM `IIC` / `AIIC` and `CI,50-2500` remain unsupported
on this bound local-guide path. Focused validation passed with engine
5 files / 26 tests and web 5 files / 29 tests. Full
`pnpm calculator:gate:current` passed after Gate AP with engine 553
files / 3085 tests, web 102 files / 419 passed + 18 skipped, repo
build 5 / 5, and whitespace guard passed.

Previous Gate AO expanded floor standardized-field coverage by wiring the existing
explicit workbench `CI,50-2500` input into owned output support and the
engine. Floor lanes with owned `Ln,w`, K, receiving-room volume, and
explicit `CI,50-2500` can now calculate `CI,50-2500`, `L'n,w`,
`L'nT,w`, and `L'nT,50` from `L'nT,w + CI,50-2500`: hollow-core vinyl
exact returns `CI,50-2500 +2`, `L'nT,50 50.2`; heavy concrete formula
returns `CI,50-2500 +2`, `L'nT,50 52.2`; steel fallback returns
`CI,50-2500 +2`, `L'nT,50 60.2`. Missing `CI,50-2500` reports
`impactFieldContext.ci50_2500Db` when K and receiving-room volume are
otherwise ready, and ASTM `IIC` / `AIIC` remain unsupported. Focused
validation passed with engine 4 files / 20 tests and web 4 files / 27
tests. Full `pnpm calculator:gate:current` passed after Gate AO with
engine 552 files / 3080 tests, web 101 files / 417 passed + 18 skipped,
repo build 5 / 5, and whitespace guard passed.

Previous Gate AN expanded floor local-guide coverage by wiring the
existing explicit workbench `CI` input into `impactFieldContext.ciDb`
and the engine. Floor lanes with owned `Ln,w` but no owned `CI` can now
calculate `CI`, `Ln,w+CI`, and `L'nT,50` from `Ln,w + CI + K + Hd`:
hollow-core vinyl exact returns `CI -1`, `Ln,w+CI 47`, `L'nT,50 50`;
heavy concrete formula returns `CI -1`, `Ln,w+CI 49`, `L'nT,50 52`;
steel fallback returns `CI -1`, `Ln,w+CI 57`, `L'nT,50 60`. Missing
CI reports `impactFieldContext.ciDb` when K/Hd are otherwise ready, and
ASTM `IIC` / `AIIC` remain unsupported. Focused validation passed with
engine 4 files / 24 tests and web 4 files / 28 tests. Full
`pnpm calculator:gate:current` passed after Gate AN with engine 551
files / 3076 tests, web 100 files / 415 passed + 18 skipped, repo build
5 / 5, and whitespace guard passed.

Previous Gate AM expanded the local-guide input surface for floor impact
`L'nT,50`. Exact UBIQ FL-28 timber rows now calculate `L'nT,50 52` and
`L'n,w 54` from owned `Ln,w+CI 49` when K is looked up from
`impactFieldContext.guideMassRatio 2.5` and Hd is supplied directly as
`impactFieldContext.guideHdDb 0`. The same input pair keeps the UBIQ
FL-28 carpet combined-bound route live at `Ln,w+CI <= 45` and
`L'nT,50 <= 48`, with bound API payloads carrying K/Hd provenance.
The workbench guide surface now treats combined `Ln,w+CI` bounds as an
active local-guide base. Missing Hd now reports
`impactFieldContext.guideHdDb_or_receivingRoomVolumeM3`. Split metrics
and ASTM `IIC` / `AIIC` aliases remain unsupported. Focused validation
passed with engine 4 files / 25 tests and web 4 files / 28 tests. Full
`pnpm calculator:gate:current` passed with engine 550 files / 3072
tests, web 99 files / 413 passed + 18 skipped, repo build 5 / 5, and
whitespace guard passed.
Gate 0 selection status:

`post_v1_calculator_capability_roi_confirmation_gate_0_landed_selected_wall_multileaf_gate_a`

Gate A selection status:

`post_v1_wall_multileaf_generalized_formula_gate_a_landed_no_runtime_selected_gate_b_runtime_corridor`

Landed Gate 0 action:

`post_v1_calculator_capability_roi_confirmation_gate_0_plan`

Landed Gate 0 file:

`packages/engine/src/post-v1-calculator-capability-roi-confirmation-gate-0-contract.test.ts`

Landed Gate A action:

`post_v1_wall_multileaf_generalized_formula_gate_a_input_owner_and_gap_matrix_plan`

Landed Gate A file:

`packages/engine/src/post-v1-wall-multileaf-generalized-formula-gate-a-contract.test.ts`

Landed Gate B action:

`post_v1_wall_multileaf_generalized_formula_gate_b_runtime_corridor_plan`

Landed Gate B file:

`packages/engine/src/post-v1-wall-multileaf-generalized-formula-gate-b-runtime-corridor-contract.test.ts`

Gate B selection status:

`post_v1_wall_multileaf_generalized_formula_gate_b_landed_selected_gate_c_surface_parity_and_guided_inputs`

Landed Gate C action:

`post_v1_wall_multileaf_generalized_formula_gate_c_surface_parity_and_guided_inputs_plan`

Landed Gate C file:

`packages/engine/src/post-v1-wall-multileaf-generalized-formula-gate-c-surface-parity-contract.test.ts`

Gate C selection status:

`post_v1_wall_multileaf_generalized_formula_gate_c_landed_selected_gate_d_compatible_anchor_delta`

Landed Gate D action:

`post_v1_wall_compatible_anchor_delta_gate_d_plan`

Landed Gate D file:

`packages/engine/src/post-v1-wall-compatible-anchor-delta-gate-d-contract.test.ts`

Gate D selection status:

`post_v1_wall_compatible_anchor_delta_gate_d_landed_selected_gate_e_floor_or_wall_next_formula_gap`

Landed Gate E action:

`post_v1_floor_or_wall_next_formula_gap_gate_e_plan`

Landed Gate E file:

`packages/engine/src/post-v1-floor-or-wall-next-formula-gap-gate-e-contract.test.ts`

Gate E selection status:

`post_v1_floor_or_wall_next_formula_gap_gate_e_landed_selected_gate_f_floor_astm_iic_aiic_contour_runtime`

Landed Gate F action:

`post_v1_floor_astm_iic_aiic_contour_rating_gate_f_plan`

Landed Gate F file:

`packages/engine/src/post-v1-floor-astm-iic-aiic-contour-rating-gate-f-contract.test.ts`

Gate F selection status:

`post_v1_floor_astm_iic_aiic_contour_rating_gate_f_landed_selected_surface_parity_or_next_floor_formula_gap`

Landed Gate G action:

`post_v1_floor_astm_iic_aiic_surface_parity_gate_g_plan`

Landed Gate G file:

`packages/engine/src/post-v1-floor-astm-iic-aiic-surface-parity-gate-g-contract.test.ts`

Gate G selection status:

`post_v1_floor_astm_iic_aiic_surface_parity_gate_g_landed_selected_gate_h_floor_formula_expansion`

Landed Gate H action:

`post_v1_floor_formula_expansion_gate_h_plan`

Landed Gate H file:

`packages/engine/src/post-v1-floor-formula-expansion-gate-h-contract.test.ts`

Previously selected label:

post-V1 floor formula expansion Gate H

Gate H selection status:

`post_v1_floor_formula_expansion_gate_h_landed_selected_gate_i_floor_formula_gap_refresh`

Landed Gate I action:

`post_v1_floor_formula_gap_refresh_gate_i_plan`

Landed Gate I file:

`packages/engine/src/post-v1-floor-formula-gap-refresh-gate-i-contract.test.ts`

Previously selected label:

post-V1 floor formula gap refresh Gate I

Gate I selection status:

`post_v1_floor_formula_gap_refresh_gate_i_landed_no_runtime_selected_gate_j_reinforced_concrete_combined_resolver`

Gate I selected Gate J:

`post_v1_floor_reinforced_concrete_combined_resolver_gate_j_plan`

Gate I selected file:

`packages/engine/src/post-v1-floor-reinforced-concrete-combined-resolver-gate-j-contract.test.ts`

Gate I selected label:

post-V1 floor reinforced-concrete combined resolver Gate J

Gate J has landed as:

`post_v1_floor_reinforced_concrete_combined_resolver_gate_j_plan`

Gate J file:

`packages/engine/src/post-v1-floor-reinforced-concrete-combined-resolver-gate-j-contract.test.ts`

Gate J selection status:

`post_v1_floor_reinforced_concrete_combined_resolver_gate_j_landed_selected_gate_k_timber_clt_delta_lw_resolver`

Gate J selected Gate K label:

post-V1 floor timber/CLT DeltaLw resolver Gate K

Gate K has landed as:

`post_v1_floor_timber_clt_delta_lw_resolver_gate_k_plan`

Gate K file:

`packages/engine/src/post-v1-floor-timber-clt-delta-lw-resolver-gate-k-contract.test.ts`

Gate K selection status:

`post_v1_floor_timber_clt_delta_lw_resolver_gate_k_landed_selected_gate_l_composite_panel_family_solver_owner`

Gate K selected Gate L label:

post-V1 floor composite-panel family solver owner Gate L

Landed Gate L action:

`post_v1_floor_composite_panel_family_solver_owner_gate_l_plan`

Landed Gate L file:

`packages/engine/src/post-v1-floor-composite-panel-family-solver-owner-gate-l-contract.test.ts`

Gate L selection status:

`post_v1_floor_composite_panel_family_solver_owner_gate_l_landed_selected_gate_m_lightweight_concrete_family_solver_owner`

Selected next action:

`post_v1_floor_lightweight_concrete_family_solver_owner_gate_m_plan`

Selected next file:

`packages/engine/src/post-v1-floor-lightweight-concrete-family-solver-owner-gate-m-contract.test.ts`

Selected next label:

post-V1 floor lightweight-concrete family solver owner Gate M

This is not a broad source crawl, not a confidence wording pass, not a
tolerance retune, and not a finite scenario pack.

Gate H increased floor formula coverage by mapping existing
lightweight-steel upper/lower mass-spring and suspended-ceiling-only
source-absent floor formulas into the shared resolver and answer-engine
surface. Complete upper/lower steel now publishes `Ln,w 51.6` /
`DeltaLw 22.4`; suspended-only steel publishes `Ln,w 62.2`, while
`DeltaLw` without a complete upper package remains unsupported/needs
owner inputs and ASTM/field aliases remain blocked. Gate I selected the
next floor formula move: bring the existing reinforced-concrete combined
upper/lower lab formula (`Ln,w 58.1` / `DeltaLw 13.7` on
`predictor_heavy_combined_upper_lower_floor_iso12354_annexc_estimate`)
onto the shared resolver/answer-engine candidate surface. Gate J now
owns that path as `floor.heavy_concrete_combined_upper_lower.lab_impact_formula`:
complete requests publish `Ln,w 58.1` / `DeltaLw 13.7`, `IIC` / `AIIC`
remain unsupported ASTM boundaries, and missing `loadBasisKgM2` or
`ceilingOrLowerAssembly` stops as `needs_input`. Gate K now owns the
timber/CLT `DeltaLw` metric-basis import through
`floor.timber_joist.delta_lw_formula` and
`floor.mass_timber_clt.delta_lw_formula`: timber joist publishes
`DeltaLw 25.2`, CLT publishes `DeltaLw 22.6`, exact or published
`Ln,w` companions remain separate, and missing timber/CLT physical
inputs stop as `needs_input`. Gate L landed as
`post_v1_floor_composite_panel_family_solver_owner_gate_l_plan` in
`packages/engine/src/post-v1-floor-composite-panel-family-solver-owner-gate-l-contract.test.ts`
with status
`post_v1_floor_composite_panel_family_solver_owner_gate_l_landed_selected_gate_m_lightweight_concrete_family_solver_owner`.
It maps the existing composite-panel published interaction runtime
through `floor.composite_panel.published_interaction_family_solver`: dry
floating publishes `Ln,w 69.4 / Rw 45.1`, suspended ceiling publishes
`Ln,w 63.3 / Rw 48.6`, and combined upper/lower publishes
`Ln,w 48.5 / Rw 60.6`. Composite `DeltaLw`, ASTM, and field aliases
remain blocked until separate owners exist. The selected next action is
`post_v1_floor_lightweight_concrete_family_solver_owner_gate_m_plan` in
`packages/engine/src/post-v1-floor-lightweight-concrete-family-solver-owner-gate-m-contract.test.ts`;
selected next label: post-V1 floor lightweight-concrete family solver owner Gate M.
Gate M landed as
`post_v1_floor_lightweight_concrete_family_solver_owner_gate_m_plan` in
`packages/engine/src/post-v1-floor-lightweight-concrete-family-solver-owner-gate-m-contract.test.ts`
with status
`post_v1_floor_lightweight_concrete_family_solver_owner_gate_m_landed_selected_gate_n_floor_field_building_expansion`.
It maps `floor.lightweight_concrete.family_solver_owner` on
`predictor_lightweight_concrete_family_estimate`: visible lightweight
floating floor publishes `Ln,w 64.3 / Rw 53`, and low-density predictor
input publishes `Ln,w 47 / Rw 49`. Lightweight-concrete `DeltaLw`, ASTM,
and field aliases remain blocked. Gate N landed as
`post_v1_floor_field_building_expansion_gate_n_plan` in
`packages/engine/src/post-v1-floor-field-building-expansion-gate-n-contract.test.ts`
with status
`post_v1_floor_field_building_expansion_gate_n_landed_selected_gate_o_input_surface_guided_physical_fields`.
Previous selected label: post-V1 floor field/building expansion Gate N.
It maps the generalized floor impact field-context adapter through
`floor.impact_field_context.field_building_adapter` on
`source_absent_field_building_adapter_error_budget`: dynamic
lightweight-concrete field requests with a live lab `Ln,w` anchor plus
`impactFieldContext.fieldKDb` and
`impactFieldContext.receivingRoomVolumeM3` publish
`L'n,w 66.3 / L'nT,w 63.9`. Missing context asks for
`impactFieldContext` and `receivingRoomVolumeM3`; building prediction
and ASTM `IIC` / `AIIC` aliases remain blocked. Gate N selected Gate O
action was `post_v1_input_surface_guided_physical_fields_gate_o_plan` in
`packages/engine/src/post-v1-input-surface-guided-physical-fields-gate-o-contract.test.ts`;
Gate N selected Gate O label: post-V1 input-surface guided physical fields Gate O.
Gate O was corrected away from input-surface-only drift and landed as
`post_v1_wall_flat_multicavity_auto_topology_gate_o_plan` in
`packages/engine/src/post-v1-wall-flat-multicavity-auto-topology-gate-o-contract.test.ts`
with status
`post_v1_wall_flat_multicavity_auto_topology_gate_o_landed_selected_next_numeric_coverage_gap`.
It makes safe flat wall multicavity stacks with explicit air-gap plus
porous-fill cavity segments calculate through the existing two-cavity
frequency solver instead of stopping for manual grouping: the pinned
case publishes `Rw 53` / STC 57 / `C -0.6` / `Ctr -8`. Ambiguous flat
stacks without explicit air gaps, explicit `flat_layer_order`, and
invalid duplicate groups stay blocked. The selected next action is
`post_v1_next_numeric_coverage_gap_selection_gate_p_plan` in
`packages/engine/src/post-v1-next-numeric-coverage-gap-selection-gate-p-contract.test.ts`;
selected next label: post-V1 next numeric coverage gap selection Gate P.

Gate P was corrected from selection-only drift into another numeric
coverage move and landed as
`post_v1_wall_double_leaf_auto_topology_gate_p_plan` in
`packages/engine/src/post-v1-wall-double-leaf-auto-topology-gate-p-contract.test.ts`
with status
`post_v1_wall_double_leaf_auto_topology_gate_p_landed_selected_next_numeric_coverage_gap_gate_q`.
It derives double-leaf/framed topology from flat wall layer order only
when support topology can be read from explicit wall context and
`studSpacingMm` is present. The existing double-leaf mass-air-mass /
bridge solver now calculates flat `gypsum / rockwool / gypsum` style
stacks without manual leaf/cavity grouping: independent support
publishes `Rw 45` / STC 45 / `C -1` / `Ctr -6.1`, and resilient
both-sides publishes `Rw 47` / STC 47 / `C -1` / `Ctr -6.1`. Missing
support topology is not guessed, and resilient cases without
`resilientBarSideCount` stay stopped with that exact field. Latest Gate
P targeted validation passed 4 files / 19 tests, the Gate P regression
sentinel passed 10 files / 95 tests, and full
`pnpm calculator:gate:current` passed with engine 527 files / 2976
tests, web 95 files / 402 passed + 18 skipped, repo build 5 / 5, and
whitespace guard passed.

Gate Q landed as
`post_v1_wall_full_fill_multicavity_auto_topology_gate_q_plan` in
`packages/engine/src/post-v1-wall-full-fill-multicavity-auto-topology-gate-q-contract.test.ts`
with status
`post_v1_wall_full_fill_multicavity_auto_topology_gate_q_landed_selected_next_numeric_coverage_gap_gate_r`.
It expands the same wall multicavity auto-topology path to common
full-fill flat stacks when explicit support context is present. The
pinned `gypsum / rockwool / gypsum / rockwool / gypsum` wall now
derives grouped triple-leaf topology with full-fill cavities and
calculates through the existing grouped Rockwool/triple-leaf frequency
solver at `Rw 52` / STC 53 / `C -2.6` / `Ctr -9.4`. Legacy
`sharedTrack` / `connectionType` hints are not guessed, and explicit
`flat_layer_order` remains a stopped topology boundary. Gate Q reuses an
existing resolver candidate, so the shared resolver surface remains 36
declared candidates and 33 active runtime-basis mappings. Gate Q
selected Gate R action was `post_v1_next_numeric_coverage_gap_gate_r_plan` in
`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-r-contract.test.ts`;
selected next label: post-V1 next numeric coverage gap Gate R. Latest
Gate Q targeted validation passed 5 files / 21 tests, the regression
sentinel passed 9 files / 90 tests, and full
`pnpm calculator:gate:current` passed with engine 528 files / 2979
tests, web 95 files / 402 passed + 18 skipped, repo build 5 / 5, and
whitespace guard passed.

Gate R landed as
`post_v1_wall_field_auto_topology_gate_r_plan` in
`packages/engine/src/post-v1-wall-field-auto-topology-gate-r-contract.test.ts`
with status
`post_v1_wall_field_auto_topology_gate_r_landed_selected_next_numeric_coverage_gap_gate_s`.
It expands the Gate Q full-fill flat multicavity wall from element-lab
only into complete `field_between_rooms` apparent/standardized outputs
when explicit support context and field geometry/room data are present.
The pinned `gypsum / rockwool / gypsum / rockwool / gypsum` wall now
calculates `R'w 50`, `Dn,w 50`, `Dn,A 48.5`, `DnT,w 53`, and
`DnT,A 50.9` without manual leaf/cavity grouping. Missing
`receivingRoomRt60S` is the precise `needs_input` field; support
topology is not guessed, and air-gap-only Gate O field requests without
explicit support do not promote. Gate R reuses the existing wall field
adapter candidate, so the shared resolver surface remains 36 declared
candidates and 33 active runtime-basis mappings. Gate R selected next
action was `post_v1_next_numeric_coverage_gap_gate_s_plan` in
`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-s-contract.test.ts`;
Gate R selected next label: post-V1 next numeric coverage gap Gate S.
Gate R targeted validation passed 1 file / 4 tests, the regression
sentinel passed 9 files / 56 tests, and full
`pnpm calculator:gate:current` passed with engine 529 files / 2983
tests, web 95 files / 402 passed + 18 skipped, repo build 5 / 5, and
whitespace guard passed.

Gate S landed as
`post_v1_wall_double_leaf_field_auto_topology_gate_s_plan` in
`packages/engine/src/post-v1-wall-double-leaf-field-auto-topology-gate-s-contract.test.ts`
with status
`post_v1_wall_double_leaf_field_auto_topology_gate_s_landed_selected_next_numeric_coverage_gap_gate_t`.
It expands the Gate P flat double-leaf auto-topology path into complete
`field_between_rooms` apparent/standardized outputs when explicit
support context, `studSpacingMm`, and room geometry/RT60 are present.
The pinned `gypsum / rockwool / gypsum` wall now calculates through the
double-leaf family physics plus field adapter at `R'w 39`, `Dn,w 40`,
`Dn,A 38.5`, `DnT,w 42`, and `DnT,A 40.9` instead of the old screening
fallback. Missing `receivingRoomRt60S` is the precise `needs_input`
field; support topology is not guessed. Gate S reuses the existing
double-leaf and wall field adapter candidates, so the shared resolver
surface remains 37 declared candidates and 34 active runtime-basis
mappings. Gate S selected next action was
`post_v1_next_numeric_coverage_gap_gate_t_plan` in
`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-t-contract.test.ts`;
selected next label: post-V1 next numeric coverage gap Gate T. Latest
Gate S targeted validation passed 1 file / 4 tests, the regression
sentinel passed 8 files / 52 tests, and full
`pnpm calculator:gate:current` passed with engine 530 files / 2987
tests, web 95 files / 402 passed + 18 skipped, repo build 5 / 5, and
whitespace guard passed.

Gate T landed as
`post_v1_wall_mixed_lab_field_output_gate_t_plan` in
`packages/engine/src/post-v1-wall-mixed-lab-field-output-gate-t-contract.test.ts`
with status
`post_v1_wall_mixed_lab_field_output_gate_t_landed_selected_next_numeric_coverage_gap_gate_u`.
It keeps the Gate S flat `gypsum / rockwool / gypsum` double-leaf field
stack complete for mixed lab-spectrum plus field requests. With explicit
support context, `studSpacingMm`, and complete `field_between_rooms`
data, the answer now supports `Rw 39`, STC 39, `C -1`, `Ctr -5.7`,
`R'w 39`, `Dn,w 40`, `Dn,A 38.5`, `DnT,w 42`, and `DnT,A 40.9`.
Previously calculable `Rw` could be marked unsupported in that mixed
request shape. The resolver trace remains
`wall.airborne_field_context.field_apparent_adapter` and pins only field
metrics; lab outputs are not relabelled as field-candidate ownership,
and field-only requests do not widen to lab outputs. Gate T selected
next action was `post_v1_next_numeric_coverage_gap_gate_u_plan` in
`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-u-contract.test.ts`;
selected next label: post-V1 next numeric coverage gap Gate U. Latest
Gate T targeted validation passed 1 file / 4 tests, the regression
sentinel passed 10 files / 55 tests, and full
`pnpm calculator:gate:current` passed with engine 531 files / 2991
tests, web 95 files / 402 passed + 18 skipped, repo build 5 / 5, and
whitespace guard passed.

Gate U landed as
`post_v1_wall_multileaf_mixed_lab_field_output_gate_u_plan` in
`packages/engine/src/post-v1-wall-multileaf-mixed-lab-field-output-gate-u-contract.test.ts`
with status
`post_v1_wall_multileaf_mixed_lab_field_output_gate_u_landed_selected_next_numeric_coverage_gap_gate_v`.
It applies the same mixed-output correctness rule to the Gate R
full-fill flat multicavity field stack. With explicit support context
and complete `field_between_rooms` data, the answer now supports
`Rw 50`, STC 51, `C -2`, `Ctr -8.5`, `R'w 50`, `Dn,w 50`,
`Dn,A 48.5`, `DnT,w 53`, and `DnT,A 50.9`. Previously calculable `Rw`
could be marked unsupported in that mixed request shape. The resolver
trace remains `wall.airborne_field_context.field_apparent_adapter` and
pins only field metrics; lab outputs are not relabelled as
field-candidate ownership, and field-only requests do not widen to lab
outputs. Gate U selected next action was
`post_v1_next_numeric_coverage_gap_gate_v_plan` in
`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-v-contract.test.ts`;
selected next label: post-V1 next numeric coverage gap Gate V. Latest
Gate U targeted validation passed 1 file / 4 tests, the regression
sentinel passed 12 files / 63 tests, and full
`pnpm calculator:gate:current` passed with engine 532 files / 2995
tests, web 95 files / 402 passed + 18 skipped, repo build 5 / 5, and
whitespace guard passed.

Gate V landed as
`post_v1_wall_rw_field_output_gate_v_plan` in
`packages/engine/src/post-v1-wall-rw-field-output-gate-v-contract.test.ts`
with status
`post_v1_wall_rw_field_output_gate_v_landed_selected_next_numeric_coverage_gap_gate_w`.
It keeps requested `Rw` live for complete double-leaf and multileaf
field requests when the user asks only for `Rw` plus field outputs,
without requiring STC or spectrum companions. The pinned double-leaf
case supports `Rw 39`, `R'w 39`, and `DnT,w 42`; the pinned multileaf
case supports `Rw 50`, `R'w 50`, and `DnT,w 53`. Field-only requests
remain field-only, and field-adapter traces still pin only field
metrics. Gate V selected next action was
`post_v1_next_numeric_coverage_gap_gate_w_plan` in
`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-w-contract.test.ts`;
selected next label: post-V1 next numeric coverage gap Gate W. Latest
Gate V targeted validation passed 1 file / 4 tests, the regression
sentinel passed 13 files / 67 tests, and full
`pnpm calculator:gate:current` passed with engine 533 files / 2999
tests, web 95 files / 402 passed + 18 skipped, repo build 5 / 5, and
whitespace guard passed.

Gate W landed as
`post_v1_wall_field_rw_companion_gate_w_plan` in
`packages/engine/src/post-v1-wall-field-rw-companion-gate-w-contract.test.ts`
with status
`post_v1_wall_field_rw_companion_gate_w_landed_selected_next_numeric_coverage_gap_gate_x`.
It extends the requested-`Rw` field companion rule to complete
heavy-composite and local-substitution grouped triple-leaf field
adapters. Heavy-composite now supports `Rw 60`, `R'w 60`, and
`DnT,w 61`; local-substitution now supports `Rw 51`, `R'w 51`, and
`DnT,w 53`. Field-only requests remain field-only, and field-adapter
traces still pin only field metrics. Gate W selected next action was
`post_v1_next_numeric_coverage_gap_gate_x_plan` in
`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-x-contract.test.ts`;
selected next label: post-V1 next numeric coverage gap Gate X. Latest
Gate W targeted validation passed 1 file / 4 tests, the regression
sentinel passed 14 files / 71 tests, and full
`pnpm calculator:gate:current` passed with engine 534 files / 3003
tests, web 95 files / 402 passed + 18 skipped, repo build 5 / 5, and
whitespace guard passed.

Gate X landed as
`post_v1_floor_airborne_spectrum_companion_gate_x_plan` in
`packages/engine/src/post-v1-floor-airborne-spectrum-companion-gate-x-contract.test.ts`
with status
`post_v1_floor_airborne_spectrum_companion_gate_x_landed_selected_next_numeric_coverage_gap_gate_y`.
It opens calculated `STC`, `C`, and `Ctr` companions for complete floor
family-estimate field requests while preserving exact measured floor
metric scope. Heavy concrete now supports `STC 58`, `C -0.9`, and
`Ctr -5.6`; lightweight steel now supports `STC 70`, `C -0.9`, and
`Ctr -5.6`; exact measured floor rows do not alias `Rw` to STC. Gate X
selected next action is `post_v1_next_numeric_coverage_gap_gate_y_plan`
in
`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-y-contract.test.ts`;
selected next label: post-V1 next numeric coverage gap Gate Y. Latest
Gate X targeted validation passed 1 file / 4 tests, and the relevant
regression sentinel passed 11 files / 64 tests. Full
`pnpm calculator:gate:current` passed after Gate X with engine 535 files
/ 3007 tests, web 95 files / 402 passed + 18 skipped, repo build 5 / 5,
and whitespace guard passed.

Gate Y landed as
`post_v1_floor_screening_spectrum_companion_gate_y_plan` in
`packages/engine/src/post-v1-floor-screening-spectrum-companion-gate-y-contract.test.ts`
with status
`post_v1_floor_screening_spectrum_companion_gate_y_landed_selected_next_numeric_coverage_gap_gate_z`.
It opens calculated `STC` and `C` companions for complete floor
`screening_mass_law_curve_seed_v3` field requests while preserving exact
measured floor metric scope and ASTM / impact boundary stops. Regupol
Curve 8 now supports `STC 58` and `C -1.4`; Getzner AFM 35 supports
`STC 58` and `C -0.9`; Regupol Multi 4.5 porcelain supports `STC 55`
and `C -0.8`. Gate Y selected next action is
`post_v1_next_numeric_coverage_gap_gate_z_plan` in
`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-z-contract.test.ts`;
selected next label: post-V1 next numeric coverage gap Gate Z. Latest
Gate Y/Gate X targeted validation passed 2 files / 9 tests. Full
`pnpm calculator:gate:current` passed after Gate Y with engine 536 files /
3012 tests, web 95 files / 402 passed + 18 skipped, repo build 5 / 5,
and whitespace guard passed.

Gate Z landed as
`post_v1_floor_screening_rw_companion_gate_z_plan` in
`packages/engine/src/post-v1-floor-screening-rw-companion-gate-z-contract.test.ts`
with status
`post_v1_floor_screening_rw_companion_gate_z_landed_selected_next_numeric_coverage_gap_gate_aa`.
It opens calculated `Rw` for source-absent floor
`screening_mass_law_curve_seed_v3` requests with visible floor roles
while preserving exact measured floor metric scope, UBIQ bound missing
`C`, and impact / ASTM boundary stops. The TUAS C11c fail-closed stack
now supports `Rw 47`, STC 47, `C -1`, `Ctr -5.7`, `R'w 47`, and
`DnT,w 49` through `floor.screening_airborne.source_absent`; `Ln,w`,
`DeltaLw`, `L'n,w`, and `L'nT,w` remain stopped. Gate Z selected next
action was `post_v1_next_numeric_coverage_gap_gate_aa_plan` in
`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-aa-contract.test.ts`;
selected next label: post-V1 next numeric coverage gap Gate AA. Latest
validation: focused Gate Z / Gate Y / Gate X / resolver passed 6 files
/ 30 tests, and full `pnpm calculator:gate:current` passed on
2026-05-26 with engine 537 files / 3016 tests, web 95 files / 402
passed + 18 skipped, repo build 5 / 5, and whitespace guard passed.

Gate AA landed as
`post_v1_wall_lined_massive_rw_companion_gate_aa_plan` in
`packages/engine/src/post-v1-wall-lined-massive-rw-companion-gate-aa-contract.test.ts`
with status
`post_v1_wall_lined_massive_rw_companion_gate_aa_landed_selected_next_numeric_coverage_gap_gate_ab`.
It opens calculated `Rw` for the existing Gate H lined-massive wall
family when a complete wall field request also carries unrelated
floor/impact targets. The pinned concrete lined wall supports `Rw 55`,
STC 55, `C -1.6`, `Ctr -6.3`, `R'w 55`, `Dn,w 55`, `Dn,A 53.4`,
`DnT,w 56`, and `DnT,A 54.9`; impact outputs remain stopped instead of
fabricated. Gate AA selected next action is
`post_v1_next_numeric_coverage_gap_gate_ab_plan` in
`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ab-contract.test.ts`;
selected next label: post-V1 next numeric coverage gap Gate AB. Latest
validation: focused Gate AA / Gate Z / Gate Y / Gate X / Gate W /
resolver passed 6 files / 26 tests, and full
`pnpm calculator:gate:current` passed on 2026-05-26 with engine 538
files / 3019 tests, web 95 files / 402 passed + 18 skipped, repo build
5 / 5, and whitespace guard passed.

Gate AB has now landed as
`post_v1_wall_screening_rw_field_companion_gate_ab_plan` in
`packages/engine/src/post-v1-wall-screening-rw-field-companion-gate-ab-contract.test.ts`
with status
`post_v1_wall_screening_rw_field_companion_gate_ab_landed_selected_next_numeric_coverage_gap_gate_ac`.
It opens calculated `Rw` for complete single-leaf wall field requests on
the screening fallback lane: masonry brick now supports `Rw 40` plus
field/apparent and spectrum outputs, and laminated CLT now supports
`Rw 41` plus field/apparent and spectrum outputs. Framed/grouped wall
routes that still need topology inputs remain `needs_input`, and exact
floor/source metric scopes and UBIQ bound missing-`C` guards remain
closed. Gate AB selected next action was
`post_v1_next_numeric_coverage_gap_gate_ac_plan` in
`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ac-contract.test.ts`;
selected next label: post-V1 next numeric coverage gap Gate AC. Latest
validation: focused Gate AB passed 1 file / 4 tests; focused Gate AB /
Gate AA / Gate Z / Gate Y / Gate X / Gate W / resolver / origin matrix
passed 8 files / 31 tests; web Gate B visibility passed 1 file / 4
tests; web origin card matrix passed 1 file / 1 test; full
`pnpm calculator:gate:current` passed on 2026-05-26 with engine 539
files / 3023 tests, web 95 files / 402 passed + 18 skipped, repo build
5 / 5, and whitespace guard passed.

Gate AC has now landed as
`post_v1_floor_field_a_weighted_surface_gate_ac_plan` in
`packages/engine/src/post-v1-floor-field-a-weighted-surface-gate-ac-contract.test.ts`
with status
`post_v1_floor_field_a_weighted_surface_gate_ac_landed_selected_next_numeric_coverage_gap_gate_ad`.
It opens already-calculated complete floor field/building airborne
outputs `Dn,w`, `Dn,A`, `DnT,w`, and `DnT,A` through the resolver trace
and automatic workbench floor presets. Heavy concrete now pins `Dn,w 57`,
`Dn,A 56.1`, `DnT,w 60`, and `DnT,A 58.6`; lightweight steel fallback
pins `Dn,w 69`, `Dn,A 68.1`, `DnT,w 72`, and `DnT,A 70.6`. Exact floor
metric scope, bound-only missing-`C`, ASTM/IIC, and unrelated
`needs_input` boundaries remain closed. Gate AC selected next action is
`post_v1_next_numeric_coverage_gap_gate_ad_plan` in
`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ad-contract.test.ts`;
selected next label: post-V1 next numeric coverage gap Gate AD. Latest
validation: focused Gate AC passed engine 1 file / 4 tests and web 1
file / 4 tests; focused Gate N + Gate AC passed engine 2 files / 9
tests; focused Gate AC + floor preset web passed 2 files / 6 tests; full
`pnpm calculator:gate:current` passed on 2026-05-26 with engine 540
files / 3027 tests, web 96 files / 406 passed + 18 skipped, repo build
5 / 5, and whitespace guard passed.

Gate AD has now landed as
`post_v1_wall_framed_metadata_auto_topology_gate_ad_plan` in
`packages/engine/src/post-v1-wall-framed-metadata-auto-topology-gate-ad-contract.test.ts`
with status
`post_v1_wall_framed_metadata_auto_topology_gate_ad_landed_selected_next_numeric_coverage_gap_gate_ae`.
It keeps the existing stud-surrogate/framed-calibration field/building route and
uses explicit `connectionType` / `studType` metadata only to keep the
already-calculated `Rw` companion live for framed field/building
requests; it does not promote the less accurate source-absent double-leaf
formula. The LSF
Knauf framed wall now supports `Rw 51`, STC 51, `C -1.4`, `Ctr -6.4`,
`R'w 51`, `Dn,w 51`, `Dn,A 49.6`, `DnT,w 52`, and `DnT,A 51.1`; the
timber-stud wall now supports `Rw 42`, STC 42, `C 0.4`, `Ctr -4.3`,
`R'w 42`, `Dn,w 42`, `Dn,A 42.4`, `DnT,w 43`, and `DnT,A 43.9`.
No-support framed metadata and grouped AAC/triple-leaf cases still stop
as `needs_input`; exact/bound floor metric scope and ASTM/IIC aliases
remain closed. Gate AD selected next action is
`post_v1_next_numeric_coverage_gap_gate_ae_plan` in
`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ae-contract.test.ts`;
selected next label: post-V1 next numeric coverage gap Gate AE. Latest
validation: focused Gate AD passed engine 1 file / 4 tests; framed/source
regression coverage passed 21 files / 157 tests; resolver and answer
engine regression coverage passed 5 files / 41 tests; full
`pnpm calculator:gate:current` passed on 2026-05-26 with engine 541
files / 3031 tests, web 96 files / 406 passed + 18 skipped, repo build
5 / 5, and whitespace guard passed.

Gate AE has now landed as
`post_v1_wall_framed_lab_spectrum_companion_gate_ae_plan` in
`packages/engine/src/post-v1-wall-framed-lab-spectrum-companion-gate-ae-contract.test.ts`
with status
`post_v1_wall_framed_lab_spectrum_companion_gate_ae_landed_selected_next_numeric_coverage_gap_gate_af`.
It generalizes Gate AD's guarded framed companion from `Rw` only to
`Rw`, STC, `C`, and `Ctr` when the explicit
stud-surrogate/framed-calibration route already has finite calculated
lab-spectrum values. Building requests still keep `R'w`, `Dn,w`,
`Dn,A`, `DnT,w`, and `DnT,A` parked behind building/field physical input
boundaries, and no-support metadata, grouped AAC/triple-leaf,
exact-source metric scope, floor bound, and ASTM/IIC boundaries remain
closed. LSF Knauf building requests now support `Rw 51`, STC 51,
`C -1.4`, and `Ctr -6.4`; timber-stud building requests support
`Rw 42`, STC 42, `C 0.4`, and `Ctr -4.3`; direct timber and British
Gypsum framed building card matrices expose the same calculated
lab-spectrum companions. Gate AE selected next action is
`post_v1_next_numeric_coverage_gap_gate_af_plan` in
`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-af-contract.test.ts`;
selected next label: post-V1 next numeric coverage gap Gate AF. Latest
validation: focused Gate AD + Gate AE passed engine 2 files / 8 tests;
focused wall card coverage passed web 3 files / 31 tests.

Gate AF has now landed as
`post_v1_wall_source_absent_building_lab_spectrum_companion_gate_af_plan`
in
`packages/engine/src/post-v1-wall-source-absent-building-lab-spectrum-companion-gate-af-contract.test.ts`
with status
`post_v1_wall_source_absent_building_lab_spectrum_companion_gate_af_landed_selected_next_numeric_coverage_gap_gate_ag`.
It opens calculated lab-spectrum companions for complete source-absent
building wall requests on owned single-leaf / lined-massive traces.
`Rw`, STC, `C`, and `Ctr` are supported while `R'w`, `Dn,w`, `Dn,A`,
`DnT,w`, and `DnT,A` remain parked behind field/building owners. Lined
concrete building requests support `Rw 55`, STC 55, `C -1.6`, and
`Ctr -6.3`; masonry brick supports `Rw 40`, STC 40, `C -0.2`, and
`Ctr -4.7`; laminated CLT supports `Rw 41`, STC 41, `C -1.8`, and
`Ctr -7.6`. Grouped AAC/multileaf, opening/leak building, exact
metric-scope, floor bound, and ASTM/IIC boundaries remain closed. Gate
AF selected next action is
`post_v1_next_numeric_coverage_gap_gate_ag_plan` in
`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ag-contract.test.ts`;
selected next label: post-V1 next numeric coverage gap Gate AG. Latest
validation: focused Gate AE + Gate AF passed engine 2 files / 8 tests;
focused wall surface coverage passed web 3 files / 12 tests; full
`pnpm calculator:gate:current` passed on 2026-05-26 with engine 543
files / 3039 tests, web 96 files / 406 passed + 18 skipped, repo build
5 / 5, and whitespace guard passed.

Gate AG has now landed as
`post_v1_wall_heavy_composite_building_lab_spectrum_companion_gate_ag_plan`
in
`packages/engine/src/post-v1-wall-heavy-composite-building-lab-spectrum-companion-gate-ag-contract.test.ts`
with status
`post_v1_wall_heavy_composite_building_lab_spectrum_companion_gate_ag_landed_selected_next_numeric_coverage_gap_gate_ah`.
It opens calculated lab-spectrum companions for complete
heavy-composite building wall requests on the guarded double-leaf /
heavy-unframed-cavity-cap trace. `Rw`, STC, `C`, and `Ctr` are
supported while `R'w`, `Dn,w`, `Dn,A`, `DnT,w`, and `DnT,A` remain
parked behind field/building owners. The heavy-composite building case
supports `Rw 60`, STC 60, `C -1.4`, and `Ctr -6.1`. Grouped
AAC/multileaf, opening/leak building, exact metric-scope, floor bound,
ASTM/IIC, and field/building value aliases remain closed. Gate AG
selected next action is `post_v1_next_numeric_coverage_gap_gate_ah_plan`
in
`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ah-contract.test.ts`;
selected next label: post-V1 next numeric coverage gap Gate AH. Latest
validation: focused Gate AG + Gate AF + heavy-composite regressions
passed engine 5 files / 22 tests; focused wall surface coverage passed
web 3 files / 12 tests; full `pnpm calculator:gate:current` passed on
2026-05-26 with engine 544 files / 3042 tests, web 96 files /
406 passed + 18 skipped, repo build 5 / 5, and whitespace guard passed.

Gate AH has now landed as
`post_v1_wall_multileaf_screening_rw_field_companion_gate_ah_plan`
in
`packages/engine/src/post-v1-wall-multileaf-screening-rw-field-companion-gate-ah-contract.test.ts`
with status
`post_v1_wall_multileaf_screening_rw_field_companion_gate_ah_landed_selected_next_numeric_coverage_gap_gate_ai`.
It opens calculated `Rw` for complete support-backed AAC/multileaf field
requests on the existing `multileaf_screening_blend` trace. `Rw` is now
supported beside the already supported STC, `C`, `Ctr`, `R'w`, `Dn,w`,
`Dn,A`, `DnT,w`, and `DnT,A` outputs. The support-backed AAC/multileaf
field case supports `Rw 41`, STC 41, `C -1.7`, `Ctr -6.8`, `R'w 41`,
`Dn,w 41`, `Dn,A 39.3`, `DnT,w 42`, and `DnT,A 40.8`. Missing support
topology remains a `needs_input` boundary with exact missing fields.
Floor bound `C`, exact floor STC/`C`/`Ctr` aliases, opening/leak
building, ASTM/IIC, and field/building value aliases remain closed. Gate
AH selected next action is `post_v1_next_numeric_coverage_gap_gate_ai_plan`
in
`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ai-contract.test.ts`;
selected next label: post-V1 next numeric coverage gap Gate AI. Latest
validation: focused Gate AH + Gate AG + floor metric-scope regressions
passed engine 5 files / 19 tests; focused wall surface coverage passed
web 4 files / 19 tests; full `pnpm calculator:gate:current` passed on
2026-05-26 with engine 545 files / 3046 tests, web 96 files /
406 passed + 18 skipped, repo build 5 / 5, and whitespace guard passed.

Gate AI has now landed as
`post_v1_wall_flat_multicavity_field_physics_companion_gate_ai_plan`
in
`packages/engine/src/post-v1-wall-flat-multicavity-field-physics-companion-gate-ai-contract.test.ts`
with status
`post_v1_wall_flat_multicavity_field_physics_companion_gate_ai_landed_selected_next_numeric_coverage_gap_gate_aj`.
It promotes support-backed AAC/multileaf field requests from the
screening fallback into the Gate AE two-cavity physics solver plus Gate
I field adapter. The same field request now supports `Rw 60`, STC 60,
`C -1.9`, `Ctr -8`, `R'w 60`, `Dn,w 60`, `Dn,A 58.1`, `DnT,w 61`, and
`DnT,A 59.6`. Missing support topology still stops as `needs_input`,
missing `receivingRoomRt60S` remains that exact `needs_input` field,
and floor bound `C`, exact floor STC/`C`/`Ctr` aliases, opening/leak
building, ASTM/IIC, and field/building value aliases remain closed.
Gate AI selected next action is
`post_v1_next_numeric_coverage_gap_gate_aj_plan` in
`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-aj-contract.test.ts`;
selected next label: post-V1 next numeric coverage gap Gate AJ. Latest
validation: focused Gate AI + Gate AH + wall/floor regression coverage
passed engine 5 files / 21 tests; focused wall surface coverage passed
web 4 files / 19 tests; full `pnpm calculator:gate:current` passed on
2026-05-26 with engine 546 files / 3051 tests, web 96 files /
406 passed + 18 skipped, repo build 5 / 5, and whitespace guard passed.

Gate AJ has now landed as
`post_v1_wall_flat_multicavity_building_physics_gate_aj_plan`
in
`packages/engine/src/post-v1-wall-flat-multicavity-building-physics-gate-aj-contract.test.ts`
with status
`post_v1_wall_flat_multicavity_building_physics_gate_aj_landed_selected_next_numeric_coverage_gap_gate_ak`.
It promotes complete support-backed AAC/multileaf building requests from
the screening/`needs_input` stop into the Gate AE two-cavity physics
solver plus building-prediction runtime basis. The same building request
now supports `R'w 60`, `Dn,w 60`, `Dn,A 58.1`, `DnT,w 61`, and
`DnT,A 59.6`; lab `Rw`, STC, `C`, and `Ctr` remain unsupported on the
building route instead of being aliased. Missing support topology still
stops as `needs_input`, missing `sourceRoomVolumeM3` remains that exact
`needs_input` field, and floor bound `C`, exact floor STC/`C`/`Ctr`
aliases, opening/leak building, ASTM/IIC, and field/building value
aliases remain closed. Gate AJ selected next action is
`post_v1_next_numeric_coverage_gap_gate_ak_plan` in
`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ak-contract.test.ts`;
selected next label: post-V1 next numeric coverage gap Gate AK. Latest
validation: focused Gate AJ + Gate AI + answer-engine regression
coverage passed engine 5 files / 40 tests; focused wall/building
surface coverage passed web 5 files / 25 tests; full
`pnpm calculator:gate:current` passed on 2026-05-26 with engine 547
files / 3056 tests, web 96 files / 406 passed + 18 skipped, repo build
5 / 5, and whitespace guard passed.

## Goal

DynEcho must become the best usable acoustic calculator for realistic
wall and floor layer combinations. Exact measured values still win true
same-stack, same-metric, same-basis matches. Compatible measured rows may
anchor or calibrate predictions. But the product is the calculator: when
source rows are absent, the engine must choose the right formula family,
ask for missing physical inputs, and calculate owned outputs.

## Research And Implementation Inputs

Implementation recheck on 2026-05-25 found:

- the shared resolver registry has 43 declared candidates and 40 active runtime-basis mappings;
- wall already has exact, single-leaf, double-leaf, lined massive,
  heavy-composite, guarded flat-list, local-substitution triple-leaf, and
  field-adapter candidates;
- floor already has exact, exact ISO impact-band, ASTM IIC/AIIC
  exact-band contour rating, package-transfer,
  supported-band, raw-bare, helper-only, direct-fixed, lightweight-steel
  upper/lower mass-spring, lightweight-steel suspended-ceiling-only,
  reinforced-concrete combined upper/lower lab-impact, timber/CLT
  `DeltaLw` formula companions, heavy floating
  lab-impact, and field-adapter candidates;
- generic `needs_input`, lab/field/building basis, and ASTM/IIC
  unsupported boundaries are active and must be preserved;
- the old `wall-triple-leaf-frequency-solver.ts` is still marked
  research-only and runtime-ineligible, while newer local-substitution
  runtime paths cover only specific grouped triple-leaf stacks;
- flat or grouping-ambiguous multileaf wall stacks correctly stop as
  `needs_input` unless a guarded double-leaf numeric lane owns the path.

External benchmark recheck on 2026-05-25 found:

- INSUL publicly positions itself as a quick prediction tool for walls,
  floors, and ceilings with construction inputs and one-third-octave
  transmission-loss graphs:
  https://www.insul.co.nz/
- INSUL technical material describes family models such as single-panel
  mass law, coincidence effects, finite-size effects, and double-panel
  mass-air-mass regions:
  https://www.insul.co.nz/tech-info/
- INSUL Version 10 highlights STC/Rw predictions for single, double,
  triple, and quad systems, plus IIC/Ln,w predictions for single,
  double, and triple systems:
  https://www.insul.co.nz/media/43149/INSUL-Version10-November-2023.pdf
- INSUL Version 10 also calls out quad wall/ceiling models, revised
  single/double/triple algorithms, updated bridging calculations, and
  refined material properties:
  https://www.insul.co.nz/news/version-10/
- ISO 12354-1 defines airborne building calculation models using direct
  and indirect flanking element data plus theoretical propagation
  methods:
  https://www.iso.org/standard/70242.html
- ISO 12354-2 defines impact building calculation models and single
  number building ratings from frequency-band results:
  https://www.iso.org/standard/70243.html
- ISO 717-2 defines impact single-number quantities from one-third-octave
  or octave-band measurement results:
  https://www.iso.org/standard/69867.html

Planning consequence: the highest-impact next work is not more source
collection. Gate 0 proved generalized wall multileaf formula coverage is
the highest-ROI next capability slice because it can make currently
stopped grouped wall multileaf element-lab requests calculate owned
`Rw`, STC, `C`, and `Ctr` after the runtime gate while preserving
`needs_input` for ambiguous topology.

## Current Capability Map

| Area | Current state | Post-V1 decision |
| --- | --- | --- |
| Exact measured rows | Working for scoped wall, floor, and impact rows | Preserve rank-zero exact precedence |
| Compatible anchors | Working in selected floor package/support-band lanes and first wall exact-subassembly plus added-board delta lane | Expand later through named delta owners only |
| Wall single leaf | Active source-absent formula | Preserve |
| Wall double leaf | Active source-absent formula with missing-input boundary | Preserve |
| Wall lined massive/heavy composite | Active formula traces | Preserve |
| Wall grouped triple/multileaf | Active only for selected calibrated/local-substitution paths plus the landed Gate B grouped Rockwool runtime; old frequency solver is research-only | Preserve fail-closed topology boundaries |
| Wall flat ambiguous multileaf | Stops as `needs_input` unless guarded lane owns the answer | Preserve fail-closed behavior |
| Wall field `R'w` / `DnT,w` | Active adapters for owned contexts | Extend after lab multileaf owner |
| Wall building prediction | Boundary only | Later ISO 12354-1 slice |
| Floor broad formulas | Multiple active source-absent and anchor lanes, but common source-absent floor systems still remain unsupported or too narrow | Gate H selected for formula expansion |
| Floor ASTM `IIC` / `AIIC` | Active exact-band ASTM E989 contour runtime for complete ASTM E492 lab and ASTM E1007 field sources; unsupported boundary remains for ISO aliases and incomplete ASTM curves; cards/chart/report/API/provenance parity is landed | Gate G landed; preserve while Gate H expands floor formulas |
| UI input ergonomics | Existing topology/context surfaces, but not yet a full formula-first guided workflow | Follow runtime owner work with targeted UX slice |

## Landed Gate 0 ROI Confirmation

Gate 0 landed action:

`post_v1_calculator_capability_roi_confirmation_gate_0_plan`

Gate 0 landed file:

`packages/engine/src/post-v1-calculator-capability-roi-confirmation-gate-0-contract.test.ts`

Selection status:

`post_v1_calculator_capability_roi_confirmation_gate_0_landed_selected_wall_multileaf_gate_a`

Gate 0 creates an executable ROI confirmation contract. Its purpose is
to prevent another long chain of low-value gates by proving that the next
selected slice increases calculator capacity or correctness in a
measurable way.

### Gate 0 Acceptance

Gate 0 is closed when all of these are true:

- a new focused engine contract exists at
  `packages/engine/src/post-v1-calculator-capability-roi-confirmation-gate-0-contract.test.ts`;
- the contract compares at least these candidate next slices:
  generalized wall multileaf formula, compatible anchor delta, guided
  required-input UX, ASTM `IIC` / `AIIC` owner, ISO 12354 wall
  building prediction, ISO 12354 floor field/building expansion, and
  floor formula expansion;
- the contract scores each candidate by measurable calculator capacity:
  newly calculable outputs, currently stopped `needs_input` /
  `unsupported` / screening cases unlocked, standards/formula readiness,
  implementation risk, UI burden, and metric/basis safety;
- the contract names the selected Gate A and explains why it beats the
  alternatives;
- the winning path must promise a concrete before/after capability delta
  by the end of its runtime gate, not just clearer copy or a confidence
  label;
- the contract blocks any plan whose expected deliverable is only
  low-confidence wording, tolerance language, documentation, source-row
  volume, or a finite scenario pack;
- docs record Gate 0 as landed and Gate A as the selected next action;
  no older selected-next handoff can override it;
- targeted validation and `git diff --check` pass.

Gate 0 must not:

- move runtime values;
- create or promote source rows;
- retune confidence wording;
- select a path that cannot name the exact metrics it will make newly
  calculable;
- report "2-3 iterations left" without open gates, acceptance state, and
  test status.

Expected Gate 0 output:

- a ranked ROI table;
- one selected Gate A;
- one explicitly rejected list for tempting but low-value work;
- a count of the first runtime gate's expected new calculable states;
- a validation command for the selected Gate A.

Gate 0 ranked result:

| Rank | Candidate | Newly calculable outputs | Runtime delta | Decision |
| --- | --- | --- | --- | --- |
| 1 | Generalized wall multileaf formula | `Rw`, STC, `C`, `Ctr` | Complete grouped triple-leaf/two-cavity wall requests can publish owned element-lab values after Gate B; ambiguous flat lists remain `needs_input` | Selected Gate A |
| 2 | Compatible measured anchor delta | `Rw` first; STC/`C`/`Ctr` only with separate metric owners | Valuable for known stack plus one layer, but metric scope must stay anchored to the measured owner | Later Gate D |
| 3 | ASTM `IIC` / `AIIC` owner | `IIC`, `AIIC` | Commercially useful but narrower and needs ASTM rating ownership | Later |
| 4 | Floor formula expansion | `Rw`, `Ln,w`, `CI` | Useful, but current floor source-absent coverage is broader than generalized wall multileaf | Later |
| 5 | ISO 12354 wall/floor building expansion | field/building metrics | High value but higher risk; direct/flanking/junction/room owners must land together | Later |
| Blocked | Guided required-input UX by itself | none | Helps completion but does not add a solver or metric owner | Not next alone |
| Blocked | Docs, low-confidence wording, or broad source crawl | none | No concrete before/after capability delta | Blocked |

## Selected Next Slice

Gate A landed action:

`post_v1_wall_multileaf_generalized_formula_gate_a_input_owner_and_gap_matrix_plan`

Gate A landed file:

`packages/engine/src/post-v1-wall-multileaf-generalized-formula-gate-a-contract.test.ts`

Gate A selection status:

`post_v1_wall_multileaf_generalized_formula_gate_a_landed_no_runtime_selected_gate_b_runtime_corridor`

Gate A created a no-runtime executable contract for a generalized wall
multileaf formula owner. It did not move runtime values. It defines
exactly which physical inputs, formula terms, boundary states, and tests
are required before Gate B can calculate.

### Gate A Acceptance

Gate A is closed when all of these are true:

- a new focused engine contract exists at
  `packages/engine/src/post-v1-wall-multileaf-generalized-formula-gate-a-contract.test.ts`;
- the contract names the generalized wall multileaf candidate id, route,
  basis, support bucket, required inputs, formula terms, error-budget
  terms, and negative cases;
- the candidate shape covers at least grouped triple-leaf / two-cavity
  walls and leaves explicit extension hooks for quad / three-cavity
  walls without pretending quad runtime is already implemented;
- the contract proves exact measured wall rows still outrank the new
  family;
- flat-list or grouping-ambiguous multileaf cases still stop as
  `needs_input` with exact missing topology fields;
- direct-fixed double-leaf, lined massive, heavy-composite, floor, field,
  building, and ASTM/IIC lanes remain separate;
- the docs point to Gate 0 and Gate A as landed and Gate B as the
  selected next slice; no older selected-next handoff can override them;
- targeted engine validation and `git diff --check` pass.

Gate A must not:

- import the research-only solver into runtime;
- publish a new `Rw`, STC, `C`, `Ctr`, `R'w`, or `DnT,w` value;
- promote source rows;
- retune confidence or tolerance text;
- add a scenario pack as a substitute for formula ownership.

## Gate Sequence

### Gate A - Input Owner And Gap Matrix

Landed by Gate 0 ROI confirmation. No runtime movement. It defines the
generalized wall multileaf formula owner and closes the ambiguity around
required physical fields.

Required owner fields:

- route `wall`;
- `wallTopology.topologyMode` for grouped multileaf/triple-leaf;
- side leaf groups and internal leaf groups;
- cavity layer groups, cavity depths, fill coverage, and absorption
  class;
- internal leaf coupling;
- support topology, bridge class, resilient connection state, and
  spacing where applicable;
- leaf surface masses and material family/density ownership;
- one-third-octave transmission-loss curve owner;
- ISO 717-1 `Rw` / `C` / `Ctr` adapter owner;
- STC display boundary or ASTM E413 owner;
- error budget and holdout policy.

### Gate B - Element-Lab Runtime Corridor

Landed runtime action:

`post_v1_wall_multileaf_generalized_formula_gate_b_runtime_corridor_plan`

Landed runtime file:

`packages/engine/src/post-v1-wall-multileaf-generalized-formula-gate-b-runtime-corridor-contract.test.ts`

Selection status:

`post_v1_wall_multileaf_generalized_formula_gate_b_landed_selected_gate_c_surface_parity_and_guided_inputs`

Runtime movement. Promote a source-absent generalized wall multileaf
formula only for complete grouped topology.

Expected runtime behavior:

- selected candidate kind `source_absent_family_solver`;
- basis `element_lab`;
- owned outputs initially `Rw`, `STC`, `C`, and `Ctr`;
- exact rows still win first;
- complete grouped triple-leaf/two-cavity cases publish value pins;
- quad/three-cavity cases remain `needs_input` or `unsupported` until
  their formula owner exists;
- flat-list ambiguous cases remain `needs_input`;
- error budget remains explicit and not-measured.

Gate B landed scope:

- the complete grouped Rockwool triple-leaf/two-cavity wall runtime now
  traces through
  `candidate_post_v1_wall_multileaf_generalized_source_absent_family_solver`
  on runtime basis `triple_leaf_two_cavity_frequency_solver`;
- current tested value pins are `Rw 43`, STC 43, `C -0.7`, and
  `Ctr -7.7` with a 5 dB source-absent `Rw`/STC budget;
- exact measured wall rows still win first;
- flat or grouping-ambiguous multileaf stacks still stop as
  `needs_input` with exact topology fields.

### Gate C - Surface Parity And Guided Inputs

Status: landed.

Landed action:

`post_v1_wall_multileaf_generalized_formula_gate_c_surface_parity_and_guided_inputs_plan`

Landed file:

`packages/engine/src/post-v1-wall-multileaf-generalized-formula-gate-c-surface-parity-contract.test.ts`

Selection status:

`post_v1_wall_multileaf_generalized_formula_gate_c_landed_selected_gate_d_compatible_anchor_delta`

Gate C made Gate B visible without requiring users to understand
internal topology ids.

Landed surfaces:

- workbench route panel opens only the required wall multileaf fields;
- output cards, answer chart, summary card, resolver trace, API payload,
  saved replay, server replay, Markdown report, and proposal surfaces
  show the same candidate id, basis, value pins, missing fields, and
  stopped outputs;
- mobile and desktop labels do not hide or truncate missing physical
  input names.

Current tested mixed lab+field behavior: complete grouped Rockwool
triple-leaf/two-cavity requests keep `Rw 43`, STC 43, `C -0.7`, and
`Ctr -7.7` live on
`candidate_post_v1_wall_multileaf_generalized_source_absent_family_solver`
with runtime basis `triple_leaf_two_cavity_frequency_solver`, while
`R'w` and `DnT,w` are stopped by
`generic.required_input_owner.needs_input_boundary` until `contextMode`,
`partitionAreaM2`, `receivingRoomVolumeM3`, and `receivingRoomRt60S`
are supplied.

### Gate D - Compatible Anchor Delta

Status: landed.

Landed action:

`post_v1_wall_compatible_anchor_delta_gate_d_plan`

Landed file:

`packages/engine/src/post-v1-wall-compatible-anchor-delta-gate-d-contract.test.ts`

Selection status:

`post_v1_wall_compatible_anchor_delta_gate_d_landed_selected_gate_e_floor_or_wall_next_formula_gap`

Gate D adds the user-requested "known stack plus one extra layer"
behavior only through named delta owners.

Allowed scope:

- start with wall multileaf or double-leaf cases where the base exact row
  and added layer have compatible topology and metric scope;
- use measured rows as exact base, calibration evidence, or holdout
  checks;
- compute the layer delta through the owned family formula;
- keep unowned companion metrics unsupported.

Blocked scope:

- broad catalog ingestion;
- arbitrary row borrowing;
- metric aliasing;
- hiding uncertainty behind confidence wording.

Landed Gate D behavior:

- Knauf LSF exact `Rw 55` stays rank-zero for the exact stack;
- adding one compatible outer `acoustic_gypsum_board` on either side
  now selects
  `wall.compatible_anchor_delta.extra_board_on_verified_lsf`;
- the runtime basis is `exact_subassembly_source_plus_calculated_delta`;
- the published value is `Rw 57` with a `+/-5 dB` not-measured budget;
- STC, `C`, and `Ctr` stay unsupported because the anchor owns only
  `Rw`;
- unsafe cavity insertions still stop as `needs_input`.

### Gate E - Next Capability Selection

Selected next action:

`post_v1_floor_or_wall_next_formula_gap_gate_e_plan`

Selected next file:

`packages/engine/src/post-v1-floor-or-wall-next-formula-gap-gate-e-contract.test.ts`

After Gate D, Gate E must select the next product gap from real
failures:

1. ASTM `IIC` / `AIIC` owner from ASTM E989-compatible spectrum/rating
   inputs;
2. ISO 12354-1 wall building prediction with direct/flanking/junction/
   room owners;
3. ISO 12354-2 floor field/building impact expansion;
4. floor formula expansion for unsupported common systems;
5. UI ergonomics pass for full formula-first workflow.

Do not select a source crawl unless it is explicitly framed as exact
promotion, anchor calibration, holdout evidence, or bounded validation
for one named formula family.

### Gate F - ASTM IIC/AIIC Contour Runtime

Status: landed.

Landed action:

`post_v1_floor_astm_iic_aiic_contour_rating_gate_f_plan`

Landed file:

`packages/engine/src/post-v1-floor-astm-iic-aiic-contour-rating-gate-f-contract.test.ts`

Selection status:

`post_v1_floor_astm_iic_aiic_contour_rating_gate_f_landed_selected_surface_parity_or_next_floor_formula_gap`

Gate F calculates complete ASTM E492 lab impact-band sources into
`IIC` and complete ASTM E1007 field impact-band sources into `AIIC`
through the ASTM E989 contour bridge. It keeps ISO `Ln,w`/`CI` sources,
incomplete ASTM curves, and source-absent floor formulas from aliasing
into ASTM ratings.

### Gate G - ASTM IIC/AIIC Surface Parity

Status: landed.

Landed action:

`post_v1_floor_astm_iic_aiic_surface_parity_gate_g_plan`

Landed file:

`packages/engine/src/post-v1-floor-astm-iic-aiic-surface-parity-gate-g-contract.test.ts`

Selection status:

`post_v1_floor_astm_iic_aiic_surface_parity_gate_g_landed_selected_gate_h_floor_formula_expansion`

Gate G makes the new ASTM `IIC` / `AIIC` runtime visible and consistent
across output cards, answer chart, Markdown report, `/api/estimate`,
`/api/impact-only`, resolver candidate trace, and metric-basis
provenance. It does not move runtime values.

### Gate H - Floor Formula Expansion

Status: selected next.

Selected action:

`post_v1_floor_formula_expansion_gate_h_plan`

Selected file:

`packages/engine/src/post-v1-floor-formula-expansion-gate-h-contract.test.ts`

Gate H must pick the next floor source-absent formula expansion by
measurable calculator capacity: newly calculable floor `Rw`, `Ln,w`,
`CI`, `DeltaLw`, or related owned outputs for realistic layer
combinations. It must preserve exact/anchor/formula/`needs_input`/
`unsupported` answer order and avoid broad source crawl.

## Validation Commands

Gate 0 targeted command:

```bash
pnpm --filter @dynecho/engine exec vitest run src/post-v1-calculator-capability-roi-confirmation-gate-0-contract.test.ts src/acoustic-calculator-answer-engine-v1-contract.test.ts src/layer-combination-resolver-registry-contract.test.ts --maxWorkers=1
```

Conditional Gate A targeted command:

```bash
pnpm --filter @dynecho/engine exec vitest run src/post-v1-wall-multileaf-generalized-formula-gate-a-contract.test.ts src/acoustic-calculator-answer-engine-v1-contract.test.ts src/layer-combination-resolver-registry-contract.test.ts --maxWorkers=1
```

Gate B targeted command:

```bash
pnpm --filter @dynecho/engine exec vitest run src/post-v1-wall-multileaf-generalized-formula-gate-b-runtime-corridor-contract.test.ts src/post-v1-wall-multileaf-generalized-formula-gate-a-contract.test.ts src/post-v1-calculator-capability-roi-confirmation-gate-0-contract.test.ts src/layer-combination-resolver-registry-contract.test.ts src/layer-combination-resolver-runtime-candidate-adapter-contract.test.ts src/layer-combination-resolver-runtime-candidate-surface-parity-contract.test.ts src/acoustic-calculator-answer-engine-v1-contract.test.ts --maxWorkers=1
```

Gate C targeted command:

```bash
pnpm --filter @dynecho/engine exec vitest run src/post-v1-wall-multileaf-generalized-formula-gate-c-surface-parity-contract.test.ts src/post-v1-wall-multileaf-generalized-formula-gate-b-runtime-corridor-contract.test.ts src/layer-combination-resolver-runtime-candidate-surface-parity-contract.test.ts src/acoustic-calculator-answer-engine-v1-contract.test.ts --maxWorkers=1
pnpm --filter @dynecho/web exec vitest run features/workbench/wall-multileaf-generalized-surface-parity.test.ts features/workbench/wall-triple-leaf-grouped-topology-route-card.test.ts features/workbench/layer-combination-resolver-candidate-surface-parity.test.ts --maxWorkers=1
```

Gate K targeted command:

```bash
pnpm --filter @dynecho/engine exec vitest run src/post-v1-floor-timber-clt-delta-lw-resolver-gate-k-contract.test.ts src/post-v1-floor-reinforced-concrete-combined-resolver-gate-j-contract.test.ts src/post-v1-floor-formula-gap-refresh-gate-i-contract.test.ts src/post-v1-floor-formula-expansion-gate-h-contract.test.ts src/layer-combination-resolver-registry-contract.test.ts src/layer-combination-resolver-runtime-candidate-adapter-contract.test.ts src/layer-combination-resolver-runtime-candidate-surface-parity-contract.test.ts --maxWorkers=1
```

Latest Gate N validation on 2026-05-25:

- targeted Gate N/resolver validation: 8 engine files / 57 tests;
- targeted Gate N web surface validation: 1 web file / 14 tests;
- `pnpm calculator:gate:current`: engine 525 files / 2969 tests, web 95
  files / 402 passed + 18 skipped, repo build 5 / 5, whitespace guard
  passed;
- `git diff --check`: clean.

Gate B and later runtime/surface changes must also run:

```bash
pnpm calculator:gate:current
git diff --check
```

## Handoff Format

Every handoff for this plan must report:

- selected gate and status;
- route, basis, candidate id, candidate kind, and owned metrics;
- whether runtime values moved;
- exact/anchor/formula/`needs_input`/`unsupported` order evidence;
- tests run and result;
- next gate.
