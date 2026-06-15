# DynEcho

This repository is the new product track for DynEcho.

Calculator docs start here:
`docs/calculator/DOCUMENTATION_MAP.md`.

Current source of truth:
`docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md`.

Current operational handoff:
`docs/calculator/NEXT_AGENT_BRIEF.md`.

Older selected-next notes in long docs are historical unless the
documentation map and next-agent brief name them as current.

Latest floor user-material visible floating load-basis owner 2026-06-15:
`post_v1_floor_user_material_visible_floating_load_basis_owner_plan`
landed in
`packages/engine/src/post-v1-floor-user-material-visible-floating-load-basis-owner-contract.test.ts`
with status
`post_v1_floor_user_material_visible_floating_load_basis_owner_landed_runtime_selected_coverage_refresh`.
It follows
`post_v1_next_numeric_coverage_gap_after_floor_user_material_low_density_floating_floor_family_plan`
and intentionally lands runtime movement instead of another no-runtime
loop. It derives `loadBasisKgM2` from visible floating-floor upper
package surface mass when physically available above a `resilient_layer`.
The pinned custom stack derives `77.6 kg/m2` from 8 mm tile at
2200 kg/m3 and 30 mm screed at 2000 kg/m3. Low-density custom concrete
now calculates without manual `loadBasisKgM2`: `Ln,w 64.3`,
`DeltaLw 24.4`, `L'n,w 66.3`, `L'nT,w 63.9`, and `L'nT,50 66.9`.
Heavy custom concrete likewise calculates without manual
`loadBasisKgM2`: `Ln,w 50.1`, `DeltaLw 24.4`, `L'n,w 52.1`,
`L'nT,w 49.7`, and `L'nT,50 52.7`. Explicit `loadBasisKgM2` still
overrides the derived value. Missing dynamic stiffness, missing floating
layer, non-derivable load basis, and generic `IIC`/`AIIC` remain
parked. Counters: `newCalculableLayerTemplates: 0`,
`newCalculableRequestShapes: 2`, `newCalculableTargetOutputs: 10`,
`runtimeBasisPromotions: 2`, `runtimeValuesMoved 10`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`. This is not a broad source
crawl.

Current selected next:
`post_v1_floor_user_material_visible_floating_load_basis_coverage_refresh_plan`
/
`packages/engine/src/post-v1-floor-user-material-visible-floating-load-basis-coverage-refresh-contract.test.ts`
/
`docs/calculator/POST_V1_FLOOR_USER_MATERIAL_VISIBLE_FLOATING_LOAD_BASIS_COVERAGE_REFRESH_PLAN_2026-06-15.md`
/
`post-V1 floor user-material visible floating load-basis coverage refresh`.

Latest floor user-material low-density floating-floor family coverage
refresh 2026-06-15:
`post_v1_floor_user_material_low_density_floating_floor_family_coverage_refresh_plan`
landed in
`packages/engine/src/post-v1-floor-user-material-low-density-floating-floor-family-coverage-refresh-contract.test.ts`
with status
`post_v1_floor_user_material_low_density_floating_floor_family_coverage_refresh_landed_no_runtime_selected_next_numeric_coverage_gap`.
It follows
`post_v1_floor_user_material_low_density_floating_floor_family_owner_plan`
/
`packages/engine/src/post-v1-floor-user-material-low-density-floating-floor-family-owner-contract.test.ts`
/
`post_v1_floor_user_material_low_density_floating_floor_family_owner_landed_runtime_selected_coverage_refresh`
and
`post_v1_next_numeric_coverage_gap_after_floor_user_material_impact_context_field_only_adapter_plan`
/
`packages/engine/src/post-v1-next-numeric-coverage-gap-after-floor-user-material-impact-context-field-only-adapter-contract.test.ts`
/
`post_v1_next_numeric_coverage_gap_after_floor_user_material_impact_context_field_only_adapter_landed_no_runtime_selected_floor_user_material_low_density_floating_floor_family_owner`.
It re-probes
`floor.user_material_low_density_floating_floor_family_owner` without
moving runtime values. Counters: `coverageRefreshContractFilesTouched: 1`,
`newCalculableLayerTemplates: 0`, `newCalculableRequestShapes: 0`,
`newCalculableTargetOutputs: 0`, `runtimeBasisPromotions: 0`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.
This is not a broad source crawl.

Historical selected next at the coverage refresh checkpoint:
`post_v1_next_numeric_coverage_gap_after_floor_user_material_low_density_floating_floor_family_plan`
/
`packages/engine/src/post-v1-next-numeric-coverage-gap-after-floor-user-material-low-density-floating-floor-family-contract.test.ts`
/
`docs/calculator/POST_V1_NEXT_NUMERIC_COVERAGE_GAP_AFTER_FLOOR_USER_MATERIAL_LOW_DENSITY_FLOATING_FLOOR_FAMILY_PLAN_2026-06-15.md`
/
`post-V1 next numeric coverage gap after floor user-material low-density floating-floor family`.

Latest floor user-material low-density floating-floor family owner
2026-06-15:
`post_v1_floor_user_material_low_density_floating_floor_family_owner_plan`
landed in
`packages/engine/src/post-v1-floor-user-material-low-density-floating-floor-family-owner-contract.test.ts`
with status
`post_v1_floor_user_material_low_density_floating_floor_family_owner_landed_runtime_selected_coverage_refresh`.
It follows
`post_v1_next_numeric_coverage_gap_after_floor_user_material_impact_context_field_only_adapter_plan`
/
`packages/engine/src/post-v1-next-numeric-coverage-gap-after-floor-user-material-impact-context-field-only-adapter-contract.test.ts`
/
`post_v1_next_numeric_coverage_gap_after_floor_user_material_impact_context_field_only_adapter_landed_no_runtime_selected_floor_user_material_low_density_floating_floor_family_owner`.
Selected candidate:
`floor.user_material_low_density_floating_floor_family_owner`.
The owner routes a custom visible low-density concrete floating-floor
stack through the existing lightweight-concrete family, DeltaLw, and
field-adapter corridors: `Rw 53`, `Ln,w 64.3`, `DeltaLw 24.3`,
`L'n,w 66.3`, `L'nT,w 63.9`, and `L'nT,50 66.9`. Counters:
`newCalculableLayerTemplates: 1`, `newCalculableRequestShapes: 2`,
`newCalculableTargetOutputs: 6`, `runtimeBasisPromotions: 2`,
`runtimeValuesMoved 6`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.
This is not a broad source crawl.

Historical selected next at the owner checkpoint:
`post_v1_floor_user_material_low_density_floating_floor_family_coverage_refresh_plan`
/
`packages/engine/src/post-v1-floor-user-material-low-density-floating-floor-family-coverage-refresh-contract.test.ts`
/
`docs/calculator/POST_V1_FLOOR_USER_MATERIAL_LOW_DENSITY_FLOATING_FLOOR_FAMILY_COVERAGE_REFRESH_PLAN_2026-06-15.md`
/
`post-V1 floor user-material low-density floating-floor family coverage refresh`.

Latest floor user-material low-density floating-floor family rerank
2026-06-15:
`post_v1_next_numeric_coverage_gap_after_floor_user_material_impact_context_field_only_adapter_plan`
landed in
`packages/engine/src/post-v1-next-numeric-coverage-gap-after-floor-user-material-impact-context-field-only-adapter-contract.test.ts`
with status
`post_v1_next_numeric_coverage_gap_after_floor_user_material_impact_context_field_only_adapter_landed_no_runtime_selected_floor_user_material_low_density_floating_floor_family_owner`.
The rerank ran `roiAnalysisIterations: 4` across `candidateCount 9`,
then selected
`floor.user_material_low_density_floating_floor_family_owner`.

Latest floor user-material impact context field-only adapter coverage
refresh 2026-06-15:
`post_v1_floor_user_material_impact_context_field_only_adapter_coverage_refresh_plan`
landed in
`packages/engine/src/post-v1-floor-user-material-impact-context-field-only-adapter-coverage-refresh-contract.test.ts`
with status
`post_v1_floor_user_material_impact_context_field_only_adapter_coverage_refresh_landed_no_runtime_selected_next_numeric_coverage_gap`.
It follows
`post_v1_floor_user_material_impact_context_field_only_adapter_owner_plan`
/
`packages/engine/src/post-v1-floor-user-material-impact-context-field-only-adapter-owner-contract.test.ts`
/
`post_v1_floor_user_material_impact_context_field_only_adapter_owner_landed_runtime_selected_coverage_refresh`
and
`post_v1_next_numeric_coverage_gap_after_floor_user_material_impact_context_dynamic_stiffness_plan`
/
`packages/engine/src/post-v1-next-numeric-coverage-gap-after-floor-user-material-impact-context-dynamic-stiffness-contract.test.ts`
/
`post_v1_next_numeric_coverage_gap_after_floor_user_material_impact_context_dynamic_stiffness_landed_no_runtime_selected_floor_user_material_impact_context_field_only_adapter_owner`.
It re-probes
`floor.user_material_impact_context_field_only_adapter_owner` without
moving runtime values. Counters: `coverageRefreshContractFilesTouched: 1`,
`newCalculableLayerTemplates: 0`,
`newCalculableRequestShapes: 0`, `newCalculableTargetOutputs: 0`,
`runtimeBasisPromotions: 0`, `runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`. This is not a broad source
crawl.

Current selected next:
`post_v1_next_numeric_coverage_gap_after_floor_user_material_impact_context_field_only_adapter_plan`
/
`packages/engine/src/post-v1-next-numeric-coverage-gap-after-floor-user-material-impact-context-field-only-adapter-contract.test.ts`
/
`docs/calculator/POST_V1_NEXT_NUMERIC_COVERAGE_GAP_AFTER_FLOOR_USER_MATERIAL_IMPACT_CONTEXT_FIELD_ONLY_ADAPTER_PLAN_2026-06-15.md`
/
`post-V1 next numeric coverage gap after floor user-material impact context field-only adapter`.

Latest floor user-material impact context field-only adapter owner
2026-06-15:
`post_v1_floor_user_material_impact_context_field_only_adapter_owner_plan`
landed in
`packages/engine/src/post-v1-floor-user-material-impact-context-field-only-adapter-owner-contract.test.ts`
with status
`post_v1_floor_user_material_impact_context_field_only_adapter_owner_landed_runtime_selected_coverage_refresh`.
It follows
`post_v1_next_numeric_coverage_gap_after_floor_user_material_impact_context_dynamic_stiffness_plan`
/
`packages/engine/src/post-v1-next-numeric-coverage-gap-after-floor-user-material-impact-context-dynamic-stiffness-contract.test.ts`
/
`post_v1_next_numeric_coverage_gap_after_floor_user_material_impact_context_dynamic_stiffness_landed_no_runtime_selected_floor_user_material_impact_context_field_only_adapter_owner`.
Selected candidate:
`floor.user_material_impact_context_field_only_adapter_owner`.
The owner calculates field-only custom heavy floating-floor impact
values `L'n,w 52.3`, `L'nT,w 49.9`, and `L'nT,50 52.9` from the
owned `Ln,w 50.3` / `DeltaLw 24.3` lab anchor. Counters:
`newCalculableLayerTemplates: 0`, `newCalculableRequestShapes: 1`,
`newCalculableTargetOutputs: 3`, `runtimeBasisPromotions: 1`,
`runtimeValuesMoved 3`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.
This is not a broad source crawl.

Current selected next:
`post_v1_floor_user_material_impact_context_field_only_adapter_coverage_refresh_plan`
/
`packages/engine/src/post-v1-floor-user-material-impact-context-field-only-adapter-coverage-refresh-contract.test.ts`
/
`docs/calculator/POST_V1_FLOOR_USER_MATERIAL_IMPACT_CONTEXT_FIELD_ONLY_ADAPTER_COVERAGE_REFRESH_PLAN_2026-06-15.md`
/
`post-V1 floor user-material impact context field-only adapter coverage refresh`.

Latest floor user-material impact context field-only adapter rerank
2026-06-15:
`post_v1_next_numeric_coverage_gap_after_floor_user_material_impact_context_dynamic_stiffness_plan`
landed in
`packages/engine/src/post-v1-next-numeric-coverage-gap-after-floor-user-material-impact-context-dynamic-stiffness-contract.test.ts`
with status
`post_v1_next_numeric_coverage_gap_after_floor_user_material_impact_context_dynamic_stiffness_landed_no_runtime_selected_floor_user_material_impact_context_field_only_adapter_owner`.
It follows
`post_v1_floor_user_material_impact_context_dynamic_stiffness_owner_plan`
/
`packages/engine/src/post-v1-floor-user-material-impact-context-dynamic-stiffness-owner-contract.test.ts`
/
`post_v1_floor_user_material_impact_context_dynamic_stiffness_owner_landed_runtime_selected_coverage_refresh`
and
`post_v1_floor_user_material_impact_context_dynamic_stiffness_coverage_refresh_plan`
/
`packages/engine/src/post-v1-floor-user-material-impact-context-dynamic-stiffness-coverage-refresh-contract.test.ts`
/
`post_v1_floor_user_material_impact_context_dynamic_stiffness_coverage_refresh_landed_no_runtime_selected_next_numeric_coverage_gap`.
Selected candidate:
`floor.user_material_impact_context_field_only_adapter_owner`.
The rerank ran `roiAnalysisIterations: 4` and selected the custom heavy
floating-floor field-only adapter owner after confirming mixed field
requests are already live. Counters: `candidateCount 12`,
`estimatedNextRuntimeValuesMoved: 3`,
`estimatedNextCalculableRequestShapes: 1`,
`estimatedNextCalculableTargetOutputs: 3`, `runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`. This is not a broad source
crawl.

Historical selected next at the rerank checkpoint:
`post_v1_floor_user_material_impact_context_field_only_adapter_owner_plan`
/
`packages/engine/src/post-v1-floor-user-material-impact-context-field-only-adapter-owner-contract.test.ts`
/
`docs/calculator/POST_V1_FLOOR_USER_MATERIAL_IMPACT_CONTEXT_FIELD_ONLY_ADAPTER_OWNER_PLAN_2026-06-15.md`
/
`post-V1 floor user-material impact context field-only adapter owner`.

Latest floor user-material impact context dynamic-stiffness coverage
refresh 2026-06-15:
`post_v1_floor_user_material_impact_context_dynamic_stiffness_coverage_refresh_plan`
landed in
`packages/engine/src/post-v1-floor-user-material-impact-context-dynamic-stiffness-coverage-refresh-contract.test.ts`
with status
`post_v1_floor_user_material_impact_context_dynamic_stiffness_coverage_refresh_landed_no_runtime_selected_next_numeric_coverage_gap`.
It follows
`post_v1_floor_user_material_impact_context_dynamic_stiffness_owner_plan`
/
`packages/engine/src/post-v1-floor-user-material-impact-context-dynamic-stiffness-owner-contract.test.ts`
/
`post_v1_floor_user_material_impact_context_dynamic_stiffness_owner_landed_runtime_selected_coverage_refresh`.
It closes
`floor.user_material_impact_context_dynamic_stiffness_owner`.
The refresh re-probes the custom heavy floating-floor stack at
`Ln,w 50.3` and `DeltaLw 24.3`, preserves
`predictor_heavy_floating_floor_iso12354_annexc_estimate`, keeps missing
`resilientLayerDynamicStiffnessMNm3` or `loadBasisKgM2` at
`needs_input`, keeps low-density custom concrete outside the heavy
concrete route, and keeps ASTM/IIC/AIIC plus field/building impact
outputs outside this owner. Counters:
`coverageRefreshContractFilesTouched: 1`,
`newCalculableLayerTemplates: 0`, `newCalculableRequestShapes: 0`,
`newCalculableTargetOutputs: 0`, `runtimeBasisPromotions: 0`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.
This is not a broad source crawl.

Historical selected next at the coverage refresh checkpoint:
`post_v1_next_numeric_coverage_gap_after_floor_user_material_impact_context_dynamic_stiffness_plan`
/
`packages/engine/src/post-v1-next-numeric-coverage-gap-after-floor-user-material-impact-context-dynamic-stiffness-contract.test.ts`
/
`docs/calculator/POST_V1_NEXT_NUMERIC_COVERAGE_GAP_AFTER_FLOOR_USER_MATERIAL_IMPACT_CONTEXT_DYNAMIC_STIFFNESS_PLAN_2026-06-15.md`
/
`post-V1 next numeric coverage gap after floor user-material impact context dynamic stiffness`.

Latest floor user-material impact context dynamic-stiffness owner
2026-06-12:
`post_v1_floor_user_material_impact_context_dynamic_stiffness_owner_plan`
landed in
`packages/engine/src/post-v1-floor-user-material-impact-context-dynamic-stiffness-owner-contract.test.ts`
with status
`post_v1_floor_user_material_impact_context_dynamic_stiffness_owner_landed_runtime_selected_coverage_refresh`.
It follows
`post_v1_next_numeric_coverage_gap_after_user_material_porous_flow_resistivity_input_plan`
/
`packages/engine/src/post-v1-next-numeric-coverage-gap-after-user-material-porous-flow-resistivity-input-contract.test.ts`
/
`post_v1_next_numeric_coverage_gap_after_user_material_porous_flow_resistivity_input_landed_no_runtime_selected_floor_user_material_impact_context_dynamic_stiffness_owner`.
Selected candidate:
`floor.user_material_impact_context_dynamic_stiffness_owner`.
The owner lets custom visible heavy floating-floor stacks use
`floorImpactContext.resilientLayerDynamicStiffnessMNm3` and
`floorImpactContext.loadBasisKgM2`; the pinned custom stack calculates
`Ln,w 50.3` and `DeltaLw 24.3` through
`predictor_heavy_floating_floor_iso12354_annexc_estimate`. Missing
dynamic stiffness/load basis remains `needs_input`, and low-density
custom concrete remains outside the heavy concrete carrier route.
Counters: `newCalculableLayerTemplates: 1`,
`newCalculableRequestShapes: 1`, `newCalculableTargetOutputs: 2`,
`runtimeBasisPromotions: 1`, `runtimeValuesMoved 2`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`. This is not a broad source
crawl.

Historical selected next at the owner checkpoint:
`post_v1_floor_user_material_impact_context_dynamic_stiffness_coverage_refresh_plan`
/
`packages/engine/src/post-v1-floor-user-material-impact-context-dynamic-stiffness-coverage-refresh-contract.test.ts`
/
`docs/calculator/POST_V1_FLOOR_USER_MATERIAL_IMPACT_CONTEXT_DYNAMIC_STIFFNESS_COVERAGE_REFRESH_PLAN_2026-06-12.md`
/
`post-V1 floor user-material impact context dynamic-stiffness coverage refresh`.

Latest post-flow numeric coverage gap rerank 2026-06-12:
`post_v1_next_numeric_coverage_gap_after_user_material_porous_flow_resistivity_input_plan`
landed in
`packages/engine/src/post-v1-next-numeric-coverage-gap-after-user-material-porous-flow-resistivity-input-contract.test.ts`
with status
`post_v1_next_numeric_coverage_gap_after_user_material_porous_flow_resistivity_input_landed_no_runtime_selected_floor_user_material_impact_context_dynamic_stiffness_owner`.
It follows
`post_v1_wall_double_leaf_framed_user_material_porous_flow_resistivity_input_coverage_refresh_plan`
/
`packages/engine/src/post-v1-wall-double-leaf-framed-user-material-porous-flow-resistivity-input-coverage-refresh-contract.test.ts`
/
`post_v1_wall_double_leaf_framed_user_material_porous_flow_resistivity_input_coverage_refresh_landed_no_runtime_selected_next_numeric_coverage_gap`.
Selected candidate:
`floor.user_material_impact_context_dynamic_stiffness_owner`.
The rerank ran `roiAnalysisIterations: 3` and selected the custom floor
impact context dynamic-stiffness owner after subtracting closed wall
user-material lanes. Counters: `candidateCount 11`,
`estimatedNextRuntimeValuesMoved: 2`,
`estimatedNextCalculableRequestShapes: 1`,
`estimatedNextCalculableTargetOutputs: 2`, `runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`. This is not a broad source
crawl.

Historical selected next at the post-flow rerank checkpoint:
`post_v1_floor_user_material_impact_context_dynamic_stiffness_owner_plan`
/
`packages/engine/src/post-v1-floor-user-material-impact-context-dynamic-stiffness-owner-contract.test.ts`
/
`docs/calculator/POST_V1_FLOOR_USER_MATERIAL_IMPACT_CONTEXT_DYNAMIC_STIFFNESS_OWNER_PLAN_2026-06-12.md`
/
`post-V1 floor user-material impact context dynamic-stiffness owner`.

Latest user-material porous flow-resistivity input coverage refresh
2026-06-12:
`post_v1_wall_double_leaf_framed_user_material_porous_flow_resistivity_input_coverage_refresh_plan`
landed in
`packages/engine/src/post-v1-wall-double-leaf-framed-user-material-porous-flow-resistivity-input-coverage-refresh-contract.test.ts`
with status
`post_v1_wall_double_leaf_framed_user_material_porous_flow_resistivity_input_coverage_refresh_landed_no_runtime_selected_next_numeric_coverage_gap`.
It follows
`post_v1_wall_double_leaf_framed_user_material_porous_flow_resistivity_input_owner_plan`
/
`packages/engine/src/post-v1-wall-double-leaf-framed-user-material-porous-flow-resistivity-input-owner-contract.test.ts`
/
`post_v1_wall_double_leaf_framed_user_material_porous_flow_resistivity_input_owner_landed_runtime_selected_coverage_refresh`
and the prior rerank
`post_v1_next_numeric_coverage_gap_after_user_material_missing_topology_input_surface_plan`
/
`packages/engine/src/post-v1-next-numeric-coverage-gap-after-user-material-missing-topology-input-surface-contract.test.ts`
/
`post_v1_next_numeric_coverage_gap_after_user_material_missing_topology_input_surface_landed_no_runtime_selected_user_material_porous_flow_resistivity_input_owner`.
It closes
`wall.double_leaf_framed.user_material_porous_flow_resistivity_input_owner`
without moving values: numeric user flow, explicit engineering default,
and context-owned absorber flow remain pinned; missing user/unknown
`flowResistivityPaSM2` remains `needs_input`. Counters:
`coverageRefreshContractFilesTouched: 1`,
`newCalculableLayerTemplates: 0`, `newCalculableRequestShapes: 0`,
`newCalculableTargetOutputs: 0`, `runtimeBasisPromotions: 0`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.
This is not a broad source crawl.

Historical selected next at the coverage refresh checkpoint:
`post_v1_next_numeric_coverage_gap_after_user_material_porous_flow_resistivity_input_plan`
/
`packages/engine/src/post-v1-next-numeric-coverage-gap-after-user-material-porous-flow-resistivity-input-contract.test.ts`
/
`docs/calculator/POST_V1_NEXT_NUMERIC_COVERAGE_GAP_AFTER_USER_MATERIAL_POROUS_FLOW_RESISTIVITY_INPUT_PLAN_2026-06-12.md`
/
`post-V1 next numeric coverage gap after user-material porous flow-resistivity input`.

Latest user-material porous flow-resistivity input owner 2026-06-12:
`post_v1_wall_double_leaf_framed_user_material_porous_flow_resistivity_input_owner_plan`
landed in
`packages/engine/src/post-v1-wall-double-leaf-framed-user-material-porous-flow-resistivity-input-owner-contract.test.ts`
with status
`post_v1_wall_double_leaf_framed_user_material_porous_flow_resistivity_input_owner_landed_runtime_selected_coverage_refresh`.
It follows
`post_v1_next_numeric_coverage_gap_after_user_material_missing_topology_input_surface_plan`
/
`packages/engine/src/post-v1-next-numeric-coverage-gap-after-user-material-missing-topology-input-surface-contract.test.ts`
/
`post_v1_next_numeric_coverage_gap_after_user_material_missing_topology_input_surface_landed_no_runtime_selected_user_material_porous_flow_resistivity_input_owner`
and owns
`wall.double_leaf_framed.user_material_porous_flow_resistivity_input_owner`.
The owner preserves numeric user-supplied porous flow, preserves explicit
engineering-default flow with wider budget, accepts context-owned
absorber flow, and parks missing user-supplied or unknown
`flowResistivityPaSM2` at `needs_input`. Counters:
`accuracyBoundaryRowsMoved: 2`, `needsInputBoundaryRowsAdded: 1`,
`newCalculableLayerTemplates: 0`, `newCalculableRequestShapes: 0`,
`newCalculableTargetOutputs: 0`, `runtimeBasisPromotions: 0`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.
This is not a broad source crawl.

Historical selected next at the owner checkpoint:
`post_v1_wall_double_leaf_framed_user_material_porous_flow_resistivity_input_coverage_refresh_plan`
/
`packages/engine/src/post-v1-wall-double-leaf-framed-user-material-porous-flow-resistivity-input-coverage-refresh-contract.test.ts`
/
`docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_USER_MATERIAL_POROUS_FLOW_RESISTIVITY_INPUT_COVERAGE_REFRESH_PLAN_2026-06-12.md`
/
`post-V1 wall double-leaf/framed user-material porous flow-resistivity input coverage refresh`.

Latest post-missing-topology numeric gap rerank 2026-06-12:
`post_v1_next_numeric_coverage_gap_after_user_material_missing_topology_input_surface_plan`
landed in
`packages/engine/src/post-v1-next-numeric-coverage-gap-after-user-material-missing-topology-input-surface-contract.test.ts`
with status
`post_v1_next_numeric_coverage_gap_after_user_material_missing_topology_input_surface_landed_no_runtime_selected_user_material_porous_flow_resistivity_input_owner`.
It follows
`post_v1_wall_double_leaf_framed_user_material_missing_topology_input_surface_owner_plan`
/
`packages/engine/src/post-v1-wall-double-leaf-framed-user-material-missing-topology-input-surface-owner-contract.test.ts`
/
`post_v1_wall_double_leaf_framed_user_material_missing_topology_input_surface_owner_landed_no_runtime_selected_next_numeric_coverage_gap`.
It selected
`wall.double_leaf_framed.user_material_porous_flow_resistivity_input_owner`
after `roiAnalysisIterations: 3`. Counters include
`candidateCount 10`, `estimatedNextAccuracyBoundaryRowsMoved: 2`,
`estimatedNextRuntimeValuesMoved: 0`,
`estimatedFollowOnRuntimeValuesProtectedAfterInputCapture: 12`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.
This is not a broad source crawl.

Historical selected next at that rerank checkpoint:
`post_v1_wall_double_leaf_framed_user_material_porous_flow_resistivity_input_owner_plan`
/
`packages/engine/src/post-v1-wall-double-leaf-framed-user-material-porous-flow-resistivity-input-owner-contract.test.ts`
/
`docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_USER_MATERIAL_POROUS_FLOW_RESISTIVITY_INPUT_OWNER_PLAN_2026-06-12.md`
/
`post-V1 wall double-leaf/framed user-material porous flow-resistivity input owner`.

Latest user-material missing-topology input-surface owner 2026-06-12:
`post_v1_wall_double_leaf_framed_user_material_missing_topology_input_surface_owner_plan`
landed in
`packages/engine/src/post-v1-wall-double-leaf-framed-user-material-missing-topology-input-surface-owner-contract.test.ts`
with status
`post_v1_wall_double_leaf_framed_user_material_missing_topology_input_surface_owner_landed_no_runtime_selected_next_numeric_coverage_gap`.
It owns
`wall.double_leaf_framed.user_material_missing_topology_input_surface_owner`:
explicit custom `panel_leaf / porous_absorber / panel_leaf`
double-leaf/framed topology still calculates `Rw 46 / STC 46 /
C -1 / Ctr -6.1` and field/building `R'w 40 / Dn,w 41 /
Dn,A 39.5 / DnT,w 43 / DnT,A 41.9`, while missing topology asks for
`sideALeafGroup`, `cavity1DepthMm`, `sideBLeafGroup`,
`frameBridgeClass`, `supportTopology`, and `supportSpacingMm` instead of
guessing support details. Counters:
`inputSurfaceOwnerContractFilesTouched: 1`,
`estimatedFollowOnRuntimeValuesMovedAfterInputCapture: 12`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.
This is not a broad source crawl.

Historical selected next at that checkpoint:
`post_v1_next_numeric_coverage_gap_after_user_material_missing_topology_input_surface_plan`
/
`packages/engine/src/post-v1-next-numeric-coverage-gap-after-user-material-missing-topology-input-surface-contract.test.ts`
/
`docs/calculator/POST_V1_NEXT_NUMERIC_COVERAGE_GAP_AFTER_USER_MATERIAL_MISSING_TOPOLOGY_INPUT_SURFACE_PLAN_2026-06-12.md`
/
`post-V1 next numeric coverage gap after user-material missing-topology input surface`.

Latest post-user-material numeric gap rerank 2026-06-12:
`post_v1_next_numeric_coverage_gap_after_user_material_route_input_plan`
landed in
`packages/engine/src/post-v1-next-numeric-coverage-gap-after-user-material-route-input-contract.test.ts`
with status
`post_v1_next_numeric_coverage_gap_after_user_material_route_input_landed_no_runtime_selected_user_material_missing_topology_input_surface_owner`.
It selected
`wall.double_leaf_framed.user_material_missing_topology_input_surface_owner`
after `roiAnalysisIterations: 3`. Counters include
`estimatedNextRuntimeValuesMoved: 0`,
`estimatedFollowOnRuntimeValuesMovedAfterInputCapture: 12`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.
This is not a broad source crawl.

Historical selected next:
`post_v1_wall_double_leaf_framed_user_material_missing_topology_input_surface_owner_plan`
/
`packages/engine/src/post-v1-wall-double-leaf-framed-user-material-missing-topology-input-surface-owner-contract.test.ts`
/
`docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_USER_MATERIAL_MISSING_TOPOLOGY_INPUT_SURFACE_OWNER_PLAN_2026-06-12.md`
/
`post-V1 wall double-leaf/framed user-material missing-topology input-surface owner`.

Latest user-material double-leaf route-input rerank and owner 2026-06-12:
`post_v1_next_numeric_coverage_gap_after_direct_fixed_a_weighted_field_building_plan`
landed in
`packages/engine/src/post-v1-next-numeric-coverage-gap-after-direct-fixed-a-weighted-field-building-contract.test.ts`
with status
`post_v1_next_numeric_coverage_gap_after_direct_fixed_a_weighted_field_building_landed_no_runtime_selected_user_material_double_leaf_route_input_owner`.
The rerank selected
`wall.double_leaf_framed.user_material_route_input_owner` after
`roiAnalysisIterations: 3`; counters include
`estimatedNextRuntimeValuesMoved: 12`, `runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`. This is not a broad source
crawl.

`post_v1_wall_double_leaf_framed_user_material_route_input_owner_plan`
landed in
`packages/engine/src/post-v1-wall-double-leaf-framed-user-material-route-input-owner-contract.test.ts`
with status
`post_v1_wall_double_leaf_framed_user_material_route_input_owner_landed_runtime_selected_coverage_refresh`.
Custom explicit `panel_leaf / porous_absorber / panel_leaf`
double-leaf/framed user materials now calculate through the owned
double-leaf/framed formula route for lab, field, and building outputs.
Counters: `newCalculableLayerTemplates: 1`,
`newCalculableRequestShapes: 3`, `newCalculableTargetOutputs: 12`,
`runtimeBasisPromotions: 3`, `runtimeValuesMoved 12`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`,
`frontendImplementationFilesTouched: 0`, and
`webSurfaceParityContractFilesTouched: 0`. This is not a broad source
crawl.

Latest user-material double-leaf route-input coverage refresh:
`post_v1_wall_double_leaf_framed_user_material_route_input_coverage_refresh_plan`
landed in
`packages/engine/src/post-v1-wall-double-leaf-framed-user-material-route-input-coverage-refresh-contract.test.ts`
with status
`post_v1_wall_double_leaf_framed_user_material_route_input_coverage_refresh_landed_no_runtime_selected_next_numeric_coverage_gap`.
It re-probes lab `Rw 46 / STC 46 / C -1 / Ctr -6.1`,
field `R'w 40 / Dn,w 41 / Dn,A 39.5 / DnT,w 43 / DnT,A 41.9`,
and building `R'w 40 / Dn,w 41 / Dn,A 39.5 / DnT,w 43 /
DnT,A 41.9`. Unknown custom material IDs, missing explicit topology,
ASTM/IIC/AIIC, and impact outputs remain outside the owner. This is not
a broad source crawl. Counters: `coverageRefreshContractFilesTouched: 1`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.

Coverage refresh selected rerank, now landed:
`post_v1_next_numeric_coverage_gap_after_user_material_route_input_plan`
/
`packages/engine/src/post-v1-next-numeric-coverage-gap-after-user-material-route-input-contract.test.ts`
/
`docs/calculator/POST_V1_NEXT_NUMERIC_COVERAGE_GAP_AFTER_USER_MATERIAL_ROUTE_INPUT_PLAN_2026-06-12.md`
/
`post-V1 next numeric coverage gap after user-material route input`.

Latest direct-fixed A-weighted field/building coverage refresh 2026-06-12:
`post_v1_wall_double_leaf_framed_direct_fixed_a_weighted_field_building_coverage_refresh_plan`
landed in
`packages/engine/src/post-v1-wall-double-leaf-framed-direct-fixed-a-weighted-field-building-coverage-refresh-contract.test.ts`
with status
`post_v1_wall_double_leaf_framed_direct_fixed_a_weighted_field_building_coverage_refresh_landed_no_runtime_selected_next_numeric_coverage_gap`.
It closes
`post_v1_wall_double_leaf_framed_direct_fixed_a_weighted_field_building_surface_parity_plan`
/
`apps/web/features/workbench/post-v1-wall-double-leaf-framed-direct-fixed-a-weighted-field-building-surface-parity.test.ts`
/
`post_v1_wall_double_leaf_framed_direct_fixed_a_weighted_field_building_surface_parity_landed_no_runtime_selected_coverage_refresh`
and follows
`post_v1_wall_double_leaf_framed_direct_fixed_a_weighted_field_building_owner_plan`
/
`packages/engine/src/post-v1-wall-double-leaf-framed-direct-fixed-a-weighted-field-building-owner-contract.test.ts`
/
`post_v1_wall_double_leaf_framed_direct_fixed_a_weighted_field_building_owner_landed_runtime_selected_surface_parity`.
The refresh re-probes empty `Dn,A 24.9` / `DnT,A 27`, full absorptive
`Dn,A 28.9` / `DnT,A 31`, and partial absorptive `Dn,A 26.9` /
`DnT,A 29`. Field uses `gate_i_airborne_field_apparent_context_adapter_runtime`;
building uses `gate_ar_airborne_building_prediction_all_owner_runtime_corridor`;
both keep `wall.direct_fixed_double_leaf.equivalent_coupled_mass_bridge_loss_owner`
as the Gate EO base curve. The Gate I / Gate AR rows remain
`ready_with_budget` and `allowed_with_budget`. This is not a broad
source crawl. Counters: `coverageRefreshContractFilesTouched: 1`,
`webSurfaceParityContractFilesTouched: 1`,
`frontendImplementationFilesTouched: 0`, `runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`, and `sourceRowsImported: 0`.
Selected next:
`post_v1_next_numeric_coverage_gap_after_direct_fixed_a_weighted_field_building_plan`
/
`packages/engine/src/post-v1-next-numeric-coverage-gap-after-direct-fixed-a-weighted-field-building-contract.test.ts`
/
`docs/calculator/POST_V1_NEXT_NUMERIC_COVERAGE_GAP_AFTER_DIRECT_FIXED_A_WEIGHTED_FIELD_BUILDING_PLAN_2026-06-12.md`
/
`post-V1 next numeric coverage gap after direct-fixed A-weighted field/building`.

Latest direct-fixed A-weighted field/building surface parity 2026-06-11:
`post_v1_wall_double_leaf_framed_direct_fixed_a_weighted_field_building_surface_parity_plan`
landed in
`apps/web/features/workbench/post-v1-wall-double-leaf-framed-direct-fixed-a-weighted-field-building-surface-parity.test.ts`
with status
`post_v1_wall_double_leaf_framed_direct_fixed_a_weighted_field_building_surface_parity_landed_no_runtime_selected_coverage_refresh`.
It follows
`post_v1_wall_double_leaf_framed_direct_fixed_a_weighted_field_building_owner_plan`
/
`packages/engine/src/post-v1-wall-double-leaf-framed-direct-fixed-a-weighted-field-building-owner-contract.test.ts`
/
`post_v1_wall_double_leaf_framed_direct_fixed_a_weighted_field_building_owner_landed_runtime_selected_surface_parity`.
Workbench live calculation, calculator API payloads, saved replay,
server snapshot replay, output cards, target-output status, and report
summaries now keep direct-fixed A-only values aligned: empty
`Dn,A 24.9` / `DnT,A 27`, full absorptive `Dn,A 28.9` / `DnT,A 31`,
and partial absorptive `Dn,A 26.9` / `DnT,A 29`. Field uses
`gate_i_airborne_field_apparent_context_adapter_runtime`; building uses
`gate_ar_airborne_building_prediction_all_owner_runtime_corridor`; both
use `wall.direct_fixed_double_leaf.equivalent_coupled_mass_bridge_loss_owner`.
This is not a broad source crawl. Counters:
`webSurfaceParityContractFilesTouched: 1`,
`frontendImplementationFilesTouched: 0`, `runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`, and `sourceRowsImported: 0`.
Selected next:
`post_v1_wall_double_leaf_framed_direct_fixed_a_weighted_field_building_coverage_refresh_plan`
/
`packages/engine/src/post-v1-wall-double-leaf-framed-direct-fixed-a-weighted-field-building-coverage-refresh-contract.test.ts`
/
`docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_DIRECT_FIXED_A_WEIGHTED_FIELD_BUILDING_COVERAGE_REFRESH_PLAN_2026-06-11.md`
/
`post-V1 wall double-leaf/framed direct-fixed A-weighted field/building coverage refresh`.

Latest direct-fixed A-weighted field/building owner 2026-06-11:
`post_v1_wall_double_leaf_framed_direct_fixed_a_weighted_field_building_owner_plan`
landed in
`packages/engine/src/post-v1-wall-double-leaf-framed-direct-fixed-a-weighted-field-building-owner-contract.test.ts`
with status
`post_v1_wall_double_leaf_framed_direct_fixed_a_weighted_field_building_owner_landed_runtime_selected_surface_parity`.
Selected candidate:
`wall.direct_fixed_double_leaf.a_weighted_field_building_owner`.
It follows
`post_v1_next_numeric_coverage_gap_after_direct_fixed_context_absorptive_cavity_field_building_adapter_plan`
/
`packages/engine/src/post-v1-next-numeric-coverage-gap-after-direct-fixed-context-absorptive-cavity-field-building-adapter-contract.test.ts`
/
`post_v1_next_numeric_coverage_gap_after_direct_fixed_context_absorptive_cavity_field_building_adapter_landed_no_runtime_selected_direct_fixed_a_weighted_field_building_owner`.
The owner opens/corrects direct-fixed A-only `Dn,A` / `DnT,A` on Gate
ER: empty `24.9 / 27`, full absorptive `28.9 / 31`, partial absorptive
`26.9 / 29`. This is not a broad source crawl. Counters:
`newCalculableRequestShapes: 4`, `correctedRequestShapes: 2`,
`newCalculableTargetOutputs: 2`, `runtimeBasisPromotions: 2`,
`runtimeValuesMoved 12`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.
Selected next:
`post_v1_wall_double_leaf_framed_direct_fixed_a_weighted_field_building_surface_parity_plan`
/
`apps/web/features/workbench/post-v1-wall-double-leaf-framed-direct-fixed-a-weighted-field-building-surface-parity.test.ts`
/
`docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_DIRECT_FIXED_A_WEIGHTED_FIELD_BUILDING_SURFACE_PARITY_PLAN_2026-06-11.md`
/
`post-V1 wall double-leaf/framed direct-fixed A-weighted field/building surface parity`.

Latest numeric gap after direct-fixed context absorptive cavity field/building adapter 2026-06-11:
`post_v1_next_numeric_coverage_gap_after_direct_fixed_context_absorptive_cavity_field_building_adapter_plan`
landed in
`packages/engine/src/post-v1-next-numeric-coverage-gap-after-direct-fixed-context-absorptive-cavity-field-building-adapter-contract.test.ts`
with status
`post_v1_next_numeric_coverage_gap_after_direct_fixed_context_absorptive_cavity_field_building_adapter_landed_no_runtime_selected_direct_fixed_a_weighted_field_building_owner`.
Selected candidate:
`wall.direct_fixed_double_leaf.a_weighted_field_building_owner`.
It follows
`post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_field_building_adapter_coverage_refresh_plan`
and selects
`post_v1_wall_double_leaf_framed_direct_fixed_a_weighted_field_building_owner_plan`
/
`packages/engine/src/post-v1-wall-double-leaf-framed-direct-fixed-a-weighted-field-building-owner-contract.test.ts`
/
`docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_DIRECT_FIXED_A_WEIGHTED_FIELD_BUILDING_OWNER_PLAN_2026-06-11.md`
/
`post-V1 wall double-leaf/framed direct-fixed A-weighted field/building owner`.
The rerank used `roiAnalysisIterations: 3`, found four unsupported
full/partial absorptive A-only request shapes and two empty direct-fixed
A-only misroutes, and estimates `estimatedNextRuntimeValuesMoved: 12`.
This is not a broad source crawl. Counters:
`immediateRuntimeValuesMoved: 0`, `runtimeBasisPromotions: 0`,
`runtimeFormulaRetunes: 0`, `runtimeValuesMoved 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.

Latest direct-fixed context absorptive cavity field/building adapter coverage refresh 2026-06-11:
`post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_field_building_adapter_coverage_refresh_plan`
landed in
`packages/engine/src/post-v1-wall-double-leaf-framed-direct-fixed-context-absorptive-cavity-field-building-adapter-coverage-refresh-contract.test.ts`
with status
`post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_field_building_adapter_coverage_refresh_landed_no_runtime_selected_next_numeric_coverage_gap`.
It closes
`post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_field_building_adapter_surface_parity_plan`
/
`apps/web/features/workbench/post-v1-wall-double-leaf-framed-direct-fixed-context-absorptive-cavity-field-building-adapter-surface-parity.test.ts`
/
`post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_field_building_adapter_surface_parity_landed_no_runtime_selected_coverage_refresh`
and follows
`post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_field_building_adapter_owner_plan`
/
`packages/engine/src/post-v1-wall-double-leaf-framed-direct-fixed-context-absorptive-cavity-field-building-adapter-owner-contract.test.ts`
/
`post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_field_building_adapter_owner_landed_runtime_selected_surface_parity`.
It pins full `R'w 29`, `Dn,w 30`, `DnT,w 32` and partial `R'w 27`,
`Dn,w 28`, `DnT,w 30`; field uses
`gate_i_airborne_field_apparent_context_adapter_runtime`, building uses
`gate_ar_airborne_building_prediction_all_owner_runtime_corridor`, and
both use `wall.direct_fixed_double_leaf.equivalent_coupled_mass_bridge_loss_owner`.
Coverage stays `ready_with_budget`; company-internal V0 stays
`allowed_with_budget`. This is not a broad source crawl. Counters:
`coverageRefreshContractFilesTouched: 1`,
`webSurfaceParityContractFilesTouched: 1`,
`frontendImplementationFilesTouched: 0`, `runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`, and `sourceRowsImported: 0`.
Selected next:
`post_v1_next_numeric_coverage_gap_after_direct_fixed_context_absorptive_cavity_field_building_adapter_plan`
/
`packages/engine/src/post-v1-next-numeric-coverage-gap-after-direct-fixed-context-absorptive-cavity-field-building-adapter-contract.test.ts`
/
`docs/calculator/POST_V1_NEXT_NUMERIC_COVERAGE_GAP_AFTER_DIRECT_FIXED_CONTEXT_ABSORPTIVE_CAVITY_FIELD_BUILDING_ADAPTER_PLAN_2026-06-11.md`
/
`post-V1 next numeric coverage gap after direct-fixed context absorptive cavity field/building adapter`.

Latest direct-fixed context absorptive cavity field/building adapter surface parity 2026-06-11:
`post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_field_building_adapter_surface_parity_plan`
landed in
`apps/web/features/workbench/post-v1-wall-double-leaf-framed-direct-fixed-context-absorptive-cavity-field-building-adapter-surface-parity.test.ts`
with status
`post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_field_building_adapter_surface_parity_landed_no_runtime_selected_coverage_refresh`.
It follows
`post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_field_building_adapter_owner_plan`
/
`packages/engine/src/post-v1-wall-double-leaf-framed-direct-fixed-context-absorptive-cavity-field-building-adapter-owner-contract.test.ts`
/
`post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_field_building_adapter_owner_landed_runtime_selected_surface_parity`.
Workbench live calculation, calculator API payloads, saved replay,
server snapshot replay, output cards, target-output status, and report
summaries expose `gate_i_airborne_field_apparent_context_adapter_runtime`,
`gate_ar_airborne_building_prediction_all_owner_runtime_corridor`, and
`wall.direct_fixed_double_leaf.equivalent_coupled_mass_bridge_loss_owner`
without moving runtime values. Full absorptive field/building remains
`R'w 29`, `Dn,w 30`, `DnT,w 32`; partial remains `R'w 27`,
`Dn,w 28`, `DnT,w 30`. This is not a broad source crawl. Counters:
`webSurfaceParityContractFilesTouched: 1`,
`frontendImplementationFilesTouched: 0`, `runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`, and `sourceRowsImported: 0`.
Selected coverage-refresh follow-up:
`post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_field_building_adapter_coverage_refresh_plan`
/
`packages/engine/src/post-v1-wall-double-leaf-framed-direct-fixed-context-absorptive-cavity-field-building-adapter-coverage-refresh-contract.test.ts`
/
`docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_DIRECT_FIXED_CONTEXT_ABSORPTIVE_CAVITY_FIELD_BUILDING_ADAPTER_COVERAGE_REFRESH_PLAN_2026-06-11.md`
/
`post-V1 wall double-leaf/framed direct-fixed context absorptive cavity field/building adapter coverage refresh`.

Latest direct-fixed context absorptive cavity field/building adapter owner 2026-06-11:
`post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_field_building_adapter_owner_plan`
landed in
`packages/engine/src/post-v1-wall-double-leaf-framed-direct-fixed-context-absorptive-cavity-field-building-adapter-owner-contract.test.ts`
with status
`post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_field_building_adapter_owner_landed_runtime_selected_surface_parity`.
It follows
`post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_owner_coverage_refresh_plan`
/
`packages/engine/src/post-v1-wall-double-leaf-framed-direct-fixed-context-absorptive-cavity-owner-coverage-refresh-contract.test.ts`
/
`post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_owner_coverage_refresh_landed_no_runtime_selected_direct_fixed_context_absorptive_cavity_field_building_adapter_owner`.
The owner uses `wall.direct_fixed_double_leaf.equivalent_coupled_mass_bridge_loss_owner`
as the Gate EO base curve, `gate_i_airborne_field_apparent_context_adapter_runtime`
for field, and
`gate_ar_airborne_building_prediction_all_owner_runtime_corridor` for
building. Full absorptive field/building: `R'w 29`, `Dn,w 30`,
`DnT,w 32`; partial absorptive field/building: `R'w 27`, `Dn,w 28`,
`DnT,w 30`. Lab pins remain `Rw 35`, `STC 35`, `C -1.2`,
`Ctr -5.9`; `Rw 33`, `STC 33`, `C -1.2`, `Ctr -5.9`; and `Rw 31`,
`STC 31`, `C -1.2`, `Ctr -5.9`. This is not a broad source crawl.
Counters: `newCalculableRequestShapes: 4`,
`newCalculableTargetOutputs: 3`, `runtimeBasisPromotions: 2`,
`runtimeValuesMoved 12`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.
Selected surface-parity follow-up:
`post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_field_building_adapter_surface_parity_plan`
/
`apps/web/features/workbench/post-v1-wall-double-leaf-framed-direct-fixed-context-absorptive-cavity-field-building-adapter-surface-parity.test.ts`
/
`docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_DIRECT_FIXED_CONTEXT_ABSORPTIVE_CAVITY_FIELD_BUILDING_ADAPTER_SURFACE_PARITY_PLAN_2026-06-11.md`
/
`post-V1 wall double-leaf/framed direct-fixed context absorptive cavity field/building adapter surface parity`.

Latest direct-fixed context absorptive cavity coverage refresh 2026-06-11:
`post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_owner_coverage_refresh_plan`
landed in
`packages/engine/src/post-v1-wall-double-leaf-framed-direct-fixed-context-absorptive-cavity-owner-coverage-refresh-contract.test.ts`
with status
`post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_owner_coverage_refresh_landed_no_runtime_selected_direct_fixed_context_absorptive_cavity_field_building_adapter_owner`.
It closes
`post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_owner_surface_parity_plan`
/
`post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_owner_surface_parity_landed_no_runtime_selected_coverage_refresh`
and follows
`post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_owner_plan`
/
`packages/engine/src/post-v1-wall-double-leaf-framed-direct-fixed-context-absorptive-cavity-owner-contract.test.ts`
/
`post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_owner_landed_runtime_selected_surface_parity`.
The refresh keeps
`wall.direct_fixed_double_leaf.equivalent_coupled_mass_bridge_loss_owner`
with selected candidate
`candidate_wall_direct_fixed_double_leaf_bridge_loss_equivalent_coupled_mass`:
full `Rw 35`, `STC 35`, `C -1.2`, `Ctr -5.9`; partial `Rw 33`,
`STC 33`, `C -1.2`, `Ctr -5.9`; direct-fixed empty `Rw 31`,
`STC 31`, `C -1.2`, `Ctr -5.9`. It freezes the current
field/building gap for full/partial direct-fixed context-owned
absorptive cavity requests. This is not a broad source crawl. Counters:
`coverageRefreshContractFilesTouched: 1`,
`webSurfaceParityContractFilesTouched: 1`,
`frontendImplementationFilesTouched: 1`, `runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`,
`estimatedNextRuntimeValuesMoved: 12`, and
`broadSourceCrawlSelected false`.
Selected value-moving follow-up:
`post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_field_building_adapter_owner_plan`
/
`packages/engine/src/post-v1-wall-double-leaf-framed-direct-fixed-context-absorptive-cavity-field-building-adapter-owner-contract.test.ts`
/
`docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_DIRECT_FIXED_CONTEXT_ABSORPTIVE_CAVITY_FIELD_BUILDING_ADAPTER_OWNER_PLAN_2026-06-11.md`
/
`post-V1 wall double-leaf/framed direct-fixed context absorptive cavity field/building adapter owner`.

Latest direct-fixed context absorptive cavity surface parity 2026-06-11:
`post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_owner_surface_parity_plan`
landed in
`apps/web/features/workbench/post-v1-wall-double-leaf-framed-direct-fixed-context-absorptive-cavity-owner-surface-parity.test.ts`
with status
`post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_owner_surface_parity_landed_no_runtime_selected_coverage_refresh`.
It follows
`post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_owner_plan`
/
`packages/engine/src/post-v1-wall-double-leaf-framed-direct-fixed-context-absorptive-cavity-owner-contract.test.ts`
/
`post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_owner_landed_runtime_selected_surface_parity`.
Workbench live calculation, API payloads, saved replay, server snapshot
replay, output cards, target-output status, and report summaries now
expose
`wall.direct_fixed_double_leaf.equivalent_coupled_mass_bridge_loss_owner`
with selected candidate
`candidate_wall_direct_fixed_double_leaf_bridge_loss_equivalent_coupled_mass`.
Full direct-fixed context-owned absorptive cavity remains `Rw 35`,
`STC 35`, `C -1.2`, `Ctr -5.9`; partial remains `Rw 33`, `STC 33`,
`C -1.2`, `Ctr -5.9`; direct-fixed empty remains `Rw 31`, `STC 31`,
`C -1.2`, `Ctr -5.9`. This is not a broad source crawl. Counters:
`webSurfaceParityContractFilesTouched: 1`,
`frontendImplementationFilesTouched: 1`, `runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`.
Selected coverage-refresh follow-up:
`post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_owner_coverage_refresh_plan`
/
`packages/engine/src/post-v1-wall-double-leaf-framed-direct-fixed-context-absorptive-cavity-owner-coverage-refresh-contract.test.ts`
/
`docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_DIRECT_FIXED_CONTEXT_ABSORPTIVE_CAVITY_OWNER_COVERAGE_REFRESH_PLAN_2026-06-11.md`
/
`post-V1 wall double-leaf/framed direct-fixed context absorptive cavity owner coverage refresh`.

Latest direct-fixed context absorptive cavity owner 2026-06-11:
`post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_owner_plan`
landed in
`packages/engine/src/post-v1-wall-double-leaf-framed-direct-fixed-context-absorptive-cavity-owner-contract.test.ts`
with status
`post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_owner_landed_runtime_selected_surface_parity`.
It follows
`post_v1_wall_double_leaf_framed_context_absorptive_cavity_input_owner_coverage_refresh_plan`
/
`post_v1_wall_double_leaf_framed_context_absorptive_cavity_input_owner_coverage_refresh_landed_no_runtime_selected_direct_fixed_context_absorptive_cavity_owner`.
The owner uses
`wall.direct_fixed_double_leaf.equivalent_coupled_mass_bridge_loss_owner`
with selected candidate
`candidate_wall_direct_fixed_double_leaf_bridge_loss_equivalent_coupled_mass`.
Full direct-fixed context-owned absorptive cavity is now `Rw 35`,
`STC 35`, `C -1.2`, `Ctr -5.9`; partial is `Rw 33`, `STC 33`,
`C -1.2`, `Ctr -5.9`; direct-fixed empty remains `Rw 31`, `STC 31`,
`C -1.2`, `Ctr -5.9`. This is not a broad source crawl. Counters:
`newCalculableRequestShapes: 1`, `newCalculableTargetOutputs: 4`,
`runtimeBasisPromotions: 1`, `runtimeValuesMoved 4`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`,
`frontendImplementationFilesTouched: 0`.
Historical selected surface-parity follow-up:
`post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_owner_surface_parity_plan`
/
`apps/web/features/workbench/post-v1-wall-double-leaf-framed-direct-fixed-context-absorptive-cavity-owner-surface-parity.test.ts`
/
`docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_DIRECT_FIXED_CONTEXT_ABSORPTIVE_CAVITY_OWNER_SURFACE_PARITY_PLAN_2026-06-11.md`
/
`post-V1 wall double-leaf/framed direct-fixed context absorptive cavity owner surface parity`.

Latest coverage refresh 2026-06-11:
`post_v1_wall_double_leaf_framed_context_absorptive_cavity_input_owner_coverage_refresh_plan`
landed in
`packages/engine/src/post-v1-wall-double-leaf-framed-context-absorptive-cavity-input-owner-coverage-refresh-contract.test.ts`
with status
`post_v1_wall_double_leaf_framed_context_absorptive_cavity_input_owner_coverage_refresh_landed_no_runtime_selected_direct_fixed_context_absorptive_cavity_owner`.
It closes
`post_v1_wall_double_leaf_framed_context_absorptive_cavity_input_owner_surface_parity_plan`
/
`post_v1_wall_double_leaf_framed_context_absorptive_cavity_input_owner_surface_parity_landed_no_runtime_selected_coverage_refresh`
and follows
`post_v1_wall_double_leaf_framed_context_absorptive_cavity_input_owner_plan`
/
`packages/engine/src/post-v1-wall-double-leaf-framed-context-absorptive-cavity-input-owner-contract.test.ts`
/
`post_v1_wall_double_leaf_framed_context_absorptive_cavity_input_owner_landed_runtime_selected_surface_parity`.
It keeps the source-absent double-leaf/framed candidate
`candidate_layer_combination_resolver_double_leaf_framed_wall_banded_source_absent_family_solver`
on
`layer_combination_resolver_double_leaf_framed_wall_banded_source_absent_formula_corridor`
as `ready_with_budget` / `allowed_with_budget`. Full context-owned
absorptive cavity remains `Rw 46`, `STC 46`, `C -1`, `Ctr -6.1`;
partial remains `Rw 44`, `STC 44`, `C -1`, `Ctr -6.1`; empty remains
`Rw 42`, `STC 42`, `C -1`, `Ctr -6.1`. This is not a broad source
crawl. Counters: `coverageRefreshContractFilesTouched: 1`,
`webSurfaceParityContractFilesTouched: 1`,
`frontendImplementationFilesTouched: 1`, `runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`,
`estimatedNextNewCalculableRequestShapes: 1`,
`estimatedNextNewCalculableTargetOutputs: 4`, and
`estimatedNextRuntimeBasisPromotions: 1`.
Selected value-moving follow-up:
`post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_owner_plan`
/
`packages/engine/src/post-v1-wall-double-leaf-framed-direct-fixed-context-absorptive-cavity-owner-contract.test.ts`
/
`docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_DIRECT_FIXED_CONTEXT_ABSORPTIVE_CAVITY_OWNER_PLAN_2026-06-11.md`
/
`post-V1 wall double-leaf/framed direct-fixed context absorptive cavity owner`.
Route family: `wall.double_leaf_framed`. Target outputs: `Rw`, `STC`,
`C`, `Ctr`. Required physical inputs include side leaf groups, side leaf
masses, cavity depth, direct-fixed support topology, support spacing,
absorptive cavity coverage/class, and context-level flow resistivity.
Expected scope: direct-fixed context-owned absorptive cavity assemblies
calculate instead of staying on Gate AY `needs_input`.

Latest surface parity 2026-06-11:
`post_v1_wall_double_leaf_framed_context_absorptive_cavity_input_owner_surface_parity_plan`
landed in
`apps/web/features/workbench/post-v1-wall-double-leaf-framed-context-absorptive-cavity-input-owner-surface-parity.test.ts`
with status
`post_v1_wall_double_leaf_framed_context_absorptive_cavity_input_owner_surface_parity_landed_no_runtime_selected_coverage_refresh`.
It follows
`post_v1_wall_double_leaf_framed_context_absorptive_cavity_input_owner_plan`
/
`packages/engine/src/post-v1-wall-double-leaf-framed-context-absorptive-cavity-input-owner-contract.test.ts`
/
`post_v1_wall_double_leaf_framed_context_absorptive_cavity_input_owner_landed_runtime_selected_surface_parity`
and
`post_v1_wall_double_leaf_framed_route_input_runtime_widening_coverage_refresh_plan`
/
`packages/engine/src/post-v1-wall-double-leaf-framed-route-input-runtime-widening-coverage-refresh-contract.test.ts`
/
`post_v1_wall_double_leaf_framed_route_input_runtime_widening_coverage_refresh_landed_no_runtime_selected_context_absorptive_cavity_input_owner`.
Workbench live calculation, calculator API payloads, saved replay, server
snapshot replay, output cards, target-output status, and report summaries
now keep the context-owned full absorptive cavity values aligned: `Rw 46`,
`STC 46`, `C -1`, and `Ctr -6.1` through
`layer_combination_resolver_double_leaf_framed_wall_banded_source_absent_formula_corridor`
with selected candidate
`candidate_layer_combination_resolver_double_leaf_framed_wall_banded_source_absent_family_solver`.
This is not a broad source crawl. The surface added a narrow cavity-only
workbench input adapter, so counters are
`webSurfaceParityContractFilesTouched: 1`,
`frontendImplementationFilesTouched: 1`, `runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`, and `sourceRowsImported: 0`.
Selected next action:
`post_v1_wall_double_leaf_framed_context_absorptive_cavity_input_owner_coverage_refresh_plan`;
file:
`packages/engine/src/post-v1-wall-double-leaf-framed-context-absorptive-cavity-input-owner-coverage-refresh-contract.test.ts`;
plan:
`docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_CONTEXT_ABSORPTIVE_CAVITY_INPUT_OWNER_COVERAGE_REFRESH_PLAN_2026-06-11.md`;
label:
`post-V1 wall double-leaf/framed context absorptive cavity input owner coverage refresh`.

Latest runtime owner 2026-06-11:
`post_v1_wall_double_leaf_framed_context_absorptive_cavity_input_owner_plan`
landed in
`packages/engine/src/post-v1-wall-double-leaf-framed-context-absorptive-cavity-input-owner-contract.test.ts`
with status
`post_v1_wall_double_leaf_framed_context_absorptive_cavity_input_owner_landed_runtime_selected_surface_parity`.
It follows
`post_v1_wall_double_leaf_framed_route_input_runtime_widening_coverage_refresh_plan`
/
`packages/engine/src/post-v1-wall-double-leaf-framed-route-input-runtime-widening-coverage-refresh-contract.test.ts`
/
`post_v1_wall_double_leaf_framed_route_input_runtime_widening_coverage_refresh_landed_no_runtime_selected_context_absorptive_cavity_input_owner`.
The context-owned full absorptive cavity owner maps explicit absorber
input to `flowResistivitySource=user_supplied` and calculates `Rw 46`,
`STC 46`, `C -1`, and `Ctr -6.1` through
`layer_combination_resolver_double_leaf_framed_wall_banded_source_absent_formula_corridor`
with selected candidate
`candidate_layer_combination_resolver_double_leaf_framed_wall_banded_source_absent_family_solver`.
This is not a broad source crawl. Counters:
`newCalculableLayerTemplates: 1`, `newCalculableRequestShapes: 1`,
`newCalculableTargetOutputs: 4`, `runtimeBasisPromotions: 1`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.

Selected next action:
`post_v1_wall_double_leaf_framed_context_absorptive_cavity_input_owner_surface_parity_plan`;
file:
`apps/web/features/workbench/post-v1-wall-double-leaf-framed-context-absorptive-cavity-input-owner-surface-parity.test.ts`;
plan:
`docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_CONTEXT_ABSORPTIVE_CAVITY_INPUT_OWNER_SURFACE_PARITY_PLAN_2026-06-11.md`;
label:
`post-V1 wall double-leaf/framed context absorptive cavity input owner surface parity`.

Calculator closeout 2026-06-11:
`post_v1_wall_double_leaf_framed_route_input_runtime_widening_coverage_refresh_plan`
landed in
`packages/engine/src/post-v1-wall-double-leaf-framed-route-input-runtime-widening-coverage-refresh-contract.test.ts`
with status
`post_v1_wall_double_leaf_framed_route_input_runtime_widening_coverage_refresh_landed_no_runtime_selected_context_absorptive_cavity_input_owner`.
It follows
`post_v1_wall_double_leaf_framed_route_input_runtime_widening_surface_parity_plan`
/
`post_v1_wall_double_leaf_framed_route_input_runtime_widening_surface_parity_landed_no_runtime_selected_coverage_refresh`,
freezes `Rw 42`, `STC 42`, `C -1`, and `Ctr -6.1` through
`layer_combination_resolver_double_leaf_framed_wall_banded_source_absent_formula_corridor`
and
`candidate_layer_combination_resolver_double_leaf_framed_wall_banded_source_absent_family_solver`,
and keeps the route `ready_with_budget` / `allowed_with_budget`. This is
not a broad source crawl. Counters: `coverageRefreshContractFilesTouched: 1`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`, and
`sourceRowsImported: 0`.

Historical selected next action:
`post_v1_wall_double_leaf_framed_context_absorptive_cavity_input_owner_plan`;
file:
`packages/engine/src/post-v1-wall-double-leaf-framed-context-absorptive-cavity-input-owner-contract.test.ts`;
plan:
`docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_CONTEXT_ABSORPTIVE_CAVITY_INPUT_OWNER_PLAN_2026-06-11.md`;
label:
`post-V1 wall double-leaf/framed context absorptive cavity input owner`.
Route family `wall.double_leaf_framed`; target outputs `Rw`, `STC`,
`C`, `Ctr`; required physical inputs include side leaf groups, cavity
depth, non-direct-fixed support topology, support spacing, explicit
absorptive cavity coverage/class, and context-level absorber
flow-resistivity ownership. Expected scope: absorptive cavity assemblies
calculate without requiring a visible porous layer.

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

- [`docs/calculator/NEXT_AGENT_BRIEF.md`](./docs/calculator/NEXT_AGENT_BRIEF.md) — fastest current handoff for a new calculator agent
- [`docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md`](./docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md) — first authority for product goal, anti-drift rules, and next-slice selection
- [`docs/calculator/USABLE_V1_EXECUTION_PLAN.md`](./docs/calculator/USABLE_V1_EXECUTION_PLAN.md) — closed company-internal usable V1 acceptance contract
- [`docs/calculator/CURRENT_STATE.md`](./docs/calculator/CURRENT_STATE.md) — current implementation snapshot
- [`docs/calculator/NEXT_IMPLEMENTATION_PLAN.md`](./docs/calculator/NEXT_IMPLEMENTATION_PLAN.md) — active tactical slice
- [`docs/calculator/CHECKPOINT_2026-06-10_COMPATIBLE_ANCHOR_DELTA_BUILDING_DN_A_OWNER.md`](./docs/calculator/CHECKPOINT_2026-06-10_COMPATIBLE_ANCHOR_DELTA_BUILDING_DN_A_OWNER.md) — latest checkpoint after compatible anchor-delta building `Dn,A` owner landed
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
current compatible anchor-delta STC-only lab companion coverage refresh
selected next action.

Calculator north star: broaden and improve the dynamic acoustic engine.
Measured rows are preferred when owned, but they will never cover every
layer combination. New calculator work must either let more physically
valid layer stacks calculate owned outputs from formulas and required
inputs, or make an existing route more accurate without weakening metric
basis, `needs_input`, or `unsupported` boundaries.

Default agentic work should therefore target calculator scope or
accuracy, not surrounding process. Source rows, reports, UI, ledgers, and
audits are useful only when they directly support a bounded formula
route, input-surface, measured-anchor delta, calibration/holdout, runtime
promotion, or accuracy retune.

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

Latest calculator revalidation:

- `layer_combination_resolver_post_double_leaf_framed_wall_banded_coverage_revalidation_plan`
  landed no-runtime with status
  `layer_combination_resolver_post_double_leaf_framed_wall_banded_coverage_revalidation_landed_no_runtime_selected_wall_compatible_anchor_delta_scope_expansion`.
- It closed stale follow-ups for the already-live non-direct-fixed
  double-leaf/framed lab route, safe flat double-leaf auto-topology
  lab/field/building routes, and direct-fixed Gate EO / Gate ER
  lab/field/building routes.
- It selected:
  `post_v1_wall_compatible_anchor_delta_scope_expansion_plan` in
  `packages/engine/src/post-v1-wall-compatible-anchor-delta-scope-expansion-contract.test.ts`.
- Selected label:
  `post-V1 wall compatible measured-anchor delta scope expansion`.
- Counters: `roiAnalysisIterations: 3`,
  `closedRuntimeRouteRowsRevalidated 3`, `runtimeScopeCandidates 1`,
  `needsInputSurfaceCandidates 1`, `accuracyCandidatesBlocked 1`,
  `blockedNonGoalRows 1`, `newCalculableLayerTemplates 0`,
  `newCalculableRequestShapes 0`, `runtimeBasisPromotions 0`,
  `runtimeValuesMoved 0`, `sourceRowsImported: 0`, and
  `frontendImplementationFilesTouched: 0`.

Latest calculator runtime scope expansion:

- `post_v1_wall_compatible_anchor_delta_scope_expansion_plan` landed
  with status
  `post_v1_wall_compatible_anchor_delta_scope_expansion_landed_runtime_selected_field_building_adapter_owner`.
- It widened the compatible measured-anchor delta lane from a one-side
  exterior board addition to a paired exterior board addition on both
  faces of the exact Knauf LSF reduced stack.
- The new paired exterior board shape calculates `Rw 59` from the exact
  `knauf_lab_416889_primary_2026` `Rw 55` source row. `STC`, `C`, and
  `Ctr` remain blocked until separate owners exist.
- It selected:
  `post_v1_wall_compatible_anchor_delta_field_building_adapter_owner_plan`
  in
  `packages/engine/src/post-v1-wall-compatible-anchor-delta-field-building-adapter-owner-contract.test.ts`.
- Selected label:
  `post-V1 wall compatible anchor-delta field/building adapter owner`.
- Counters: `newCalculableLayerTemplates 1`,
  `newCalculableRequestShapes 1`, `runtimeBasisPromotions 1`,
  `runtimeValuesMoved 1`, `runtimeFormulaRetunes 0`,
  `sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.

Latest calculator field/building adapter owner:

- `post_v1_wall_compatible_anchor_delta_field_building_adapter_owner_plan`
  landed with status
  `post_v1_wall_compatible_anchor_delta_field_building_adapter_owner_landed_runtime_selected_surface_parity_input_acceptance`.
- Complete `field_between_rooms` requests now use the compatible
  anchor-delta direct curve (`Rw 59`) plus Gate I, publishing
  `R'w 50 / Dn,w 51 / DnT,w 53` for the pinned Knauf LSF paired-board
  context.
- Complete `building_prediction` requests now use the same direct curve
  plus Gate AR, publishing `R'w 50 / Dn,w 51 / DnT,w 53` for the pinned
  context. Missing `receivingRoomRt60S` or
  `buildingPredictionOutputBasis` still returns `needs_input`.
- `STC`, `C`, `Ctr`, `Dn,A`, `DnT,A`, and ASTM outputs remain out of
  this owner; no lab `Rw` relabelling is allowed.
- It selected:
  `post_v1_wall_compatible_anchor_delta_surface_parity_input_acceptance_plan`
  in
  `apps/web/features/workbench/post-v1-wall-compatible-anchor-delta-field-building-surface-parity.test.ts`.
- Selected label:
  `post-V1 wall compatible anchor-delta field/building surface parity input acceptance`.
- Counters: `newCalculableLayerTemplates 0`,
  `newCalculableRequestShapes 2`, `runtimeBasisPromotions 2`,
  `runtimeValuesMoved 6`, `runtimeFormulaRetunes 0`,
  `sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.

Latest calculator surface parity/input acceptance:

- `post_v1_wall_compatible_anchor_delta_surface_parity_input_acceptance_plan`
  landed with status
  `post_v1_wall_compatible_anchor_delta_surface_parity_input_acceptance_landed_no_runtime_selected_lab_metric_companion_owner`.
- Workbench live calculation, calculator API payloads, saved replay,
  server snapshot replay, output cards, and report summaries now keep
  the paired exterior-board Knauf LSF compatible anchor-delta
  field/building values aligned: field and building both publish
  `R'w 50 / Dn,w 51 / DnT,w 53`.
- No frontend implementation file changed; the existing field/building
  input surface already carries `connectionType`, `studType`,
  `studSpacingMm`, room geometry, RT60, flanking/junction, and building
  output basis through the stack.
- Missing `receivingRoomRt60S` remains `needs_input`, and `STC`,
  `Dn,A`, and `DnT,A` still stay unsupported on this owner.
- It selected:
  `post_v1_wall_compatible_anchor_delta_lab_metric_companion_owner_plan`
  in
  `packages/engine/src/post-v1-wall-compatible-anchor-delta-lab-metric-companion-owner-contract.test.ts`.
- Selected label:
  `post-V1 wall compatible anchor-delta lab metric companion owner`.
- Counters: `newCalculableLayerTemplates 0`,
  `newCalculableRequestShapes 0`, `runtimeBasisPromotions 0`,
  `runtimeValuesMoved 0`, `runtimeFormulaRetunes 0`,
  `sourceRowsImported: 0`, `frontendImplementationFilesTouched: 0`,
  and `webSurfaceParityContractFilesTouched: 1`.

Latest calculator lab metric companion owner:

- `post_v1_wall_compatible_anchor_delta_lab_metric_companion_owner_plan`
  landed with status
  `post_v1_wall_compatible_anchor_delta_lab_metric_companion_owner_landed_runtime_selected_surface_parity`.
- The paired exterior-board Knauf LSF compatible anchor-delta lab route
  now supports `Rw 59 / STC 59 / C -1.1 / Ctr -6` for complete
  `element_lab` mixed `Rw+STC/C/Ctr` requests.
- The Knauf reduced-stack source row remains `Rw`-only measured
  evidence; `STC`, `C`, and `Ctr` are calculated companions from the
  shifted direct curve and rating adapters, not measured aliases.
- Single-output `Rw` stays on the existing compatible anchor-delta direct
  owner, `STC`-only stays unsupported, and field/building plus
  A-weighted outputs stay on their separate owners.
- It selected:
  `post_v1_wall_compatible_anchor_delta_lab_metric_companion_surface_parity_plan`
  in
  `apps/web/features/workbench/post-v1-wall-compatible-anchor-delta-lab-metric-companion-surface-parity.test.ts`.
- Selected label:
  `post-V1 wall compatible anchor-delta lab metric companion surface parity`.
- Counters: `newCalculableLayerTemplates 0`,
  `newCalculableRequestShapes 1`, `newCalculableTargetOutputs: 3`,
  `runtimeBasisPromotions 1`, `runtimeValuesMoved: 0`,
  `runtimeFormulaRetunes 0`, `sourceRowsImported: 0`, and
  `frontendImplementationFilesTouched: 0`.

Latest calculator lab metric companion surface parity:

- `post_v1_wall_compatible_anchor_delta_lab_metric_companion_surface_parity_plan`
  landed no-runtime with status
  `post_v1_wall_compatible_anchor_delta_lab_metric_companion_surface_parity_landed_no_runtime_selected_coverage_refresh`.
- Workbench live calculation, calculator API payloads, saved replay,
  server snapshot replay, output cards, and report summaries now keep the
  paired exterior-board Knauf LSF lab companion values aligned:
  `Rw 59 / STC 59 / C -1.1 / Ctr -6`.
- `STC`-only and one-side exterior-board requests stay off this lab
  companion owner; single `Rw` still uses the direct anchor-delta owner.
- It selected:
  `post_v1_wall_compatible_anchor_delta_lab_metric_companion_coverage_refresh_plan`
  in
  `packages/engine/src/post-v1-wall-compatible-anchor-delta-lab-metric-companion-coverage-refresh-contract.test.ts`.
- Selected label:
  `post-V1 wall compatible anchor-delta lab metric companion coverage refresh`.
- Counters: `newCalculableLayerTemplates 0`,
  `newCalculableRequestShapes 0`, `runtimeBasisPromotions 0`,
  `runtimeValuesMoved 0`, `runtimeFormulaRetunes 0`,
  `sourceRowsImported: 0`, `frontendImplementationFilesTouched: 0`, and
  `webSurfaceParityContractFilesTouched: 1`.

Latest calculator lab metric companion coverage refresh:

- `post_v1_wall_compatible_anchor_delta_lab_metric_companion_coverage_refresh_plan`
  landed no-runtime with status
  `post_v1_wall_compatible_anchor_delta_lab_metric_companion_coverage_refresh_landed_no_runtime_selected_one_side_lab_metric_companion_owner`.
- The refresh freezes
  `wall.compatible_anchor_delta.calculated_lab_companions` with runtime
  basis
  `post_v1_wall_compatible_anchor_delta_calculated_lab_companion_runtime`
  as `ready_with_budget` in the coverage matrix and
  `allowed_with_budget` in company-internal V0.
- It re-probes the paired exterior-board Knauf LSF route at
  `Rw 59 / STC 59 / C -1.1 / Ctr -6` and keeps single `Rw`,
  `STC`-only, field/building, and one-side exterior-board mixed requests
  off the paired-board lab companion owner.
- It selected:
  `post_v1_wall_compatible_anchor_delta_one_side_lab_metric_companion_owner_plan`
  in
  `packages/engine/src/post-v1-wall-compatible-anchor-delta-one-side-lab-metric-companion-owner-contract.test.ts`.
- Selected label:
  `post-V1 wall compatible anchor-delta one-side lab metric companion owner`.
- This is not a broad source crawl. Counters:
  `coverageRefreshContractFilesTouched: 1`,
  `newCalculableLayerTemplates 0`, `newCalculableRequestShapes 0`,
  `runtimeBasisPromotions 0`, `runtimeValuesMoved 0`,
  `runtimeFormulaRetunes 0`, `sourceRowsImported: 0`, and
  `frontendImplementationFilesTouched: 0`.

Latest calculator one-side lab metric companion owner:

- `post_v1_wall_compatible_anchor_delta_one_side_lab_metric_companion_owner_plan`
  landed runtime with status
  `post_v1_wall_compatible_anchor_delta_one_side_lab_metric_companion_owner_landed_runtime_selected_surface_parity`.
- The owner reuses
  `wall.compatible_anchor_delta.calculated_lab_companions` and runtime
  basis
  `post_v1_wall_compatible_anchor_delta_calculated_lab_companion_runtime`
  for exactly one exterior-board delta on the Knauf LSF reduced stack.
- One-side `element_lab` mixed `Rw+STC/C/Ctr` requests now calculate
  `Rw 57 / STC 57 / C -0.6 / Ctr -5.5`. Single `Rw` stays on the direct
  compatible anchor-delta owner, STC-only remains unsupported, and
  field/building, A-weighted, ASTM, and non-Knauf rows remain outside
  this owner.
- It selected:
  `post_v1_wall_compatible_anchor_delta_one_side_lab_metric_companion_surface_parity_plan`
  in
  `apps/web/features/workbench/post-v1-wall-compatible-anchor-delta-one-side-lab-metric-companion-surface-parity.test.ts`.
- Selected label:
  `post-V1 wall compatible anchor-delta one-side lab metric companion surface parity`.
- This is not a broad source crawl. Counters:
  `newCalculableLayerTemplates 0`, `newCalculableRequestShapes 1`,
  `newCalculableTargetOutputs: 3`, `runtimeBasisPromotions 1`,
  `runtimeValuesMoved 0`, `runtimeFormulaRetunes 0`,
  `sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.

Latest calculator one-side lab metric companion surface parity:

- `post_v1_wall_compatible_anchor_delta_one_side_lab_metric_companion_surface_parity_plan`
  landed no-runtime with status
  `post_v1_wall_compatible_anchor_delta_one_side_lab_metric_companion_surface_parity_landed_no_runtime_selected_coverage_refresh`.
- Workbench live calculation, calculator API payloads, saved replay,
  server snapshot replay, output cards, and report summaries now keep the
  one-side exterior-board Knauf LSF lab companion values aligned:
  `Rw 57 / STC 57 / C -0.6 / Ctr -5.5`.
- The surface exposes
  `wall.compatible_anchor_delta.calculated_lab_companions` with runtime
  basis
  `post_v1_wall_compatible_anchor_delta_calculated_lab_companion_runtime`.
- Direct single `Rw` remains on
  `wall.compatible_anchor_delta.extra_board_on_verified_lsf`, STC-only
  remains unsupported, and field/building, A-weighted, ASTM, and
  non-Knauf rows remain outside this owner.
- It selected:
  `post_v1_wall_compatible_anchor_delta_one_side_lab_metric_companion_coverage_refresh_plan`
  in
  `packages/engine/src/post-v1-wall-compatible-anchor-delta-one-side-lab-metric-companion-coverage-refresh-contract.test.ts`.
- Selected label:
  `post-V1 wall compatible anchor-delta one-side lab metric companion coverage refresh`.
- This is not a broad source crawl. Counters:
  `webSurfaceParityContractFilesTouched: 1`,
  `frontendImplementationFilesTouched: 0`, `newCalculableLayerTemplates: 0`,
  `newCalculableRequestShapes: 0`, `newCalculableTargetOutputs: 0`,
  `runtimeBasisPromotions: 0`, `runtimeValuesMoved 0`,
  `runtimeFormulaRetunes 0`, and `sourceRowsImported: 0`.

Latest calculator one-side lab metric companion coverage refresh:

- `post_v1_wall_compatible_anchor_delta_one_side_lab_metric_companion_coverage_refresh_plan`
  landed no-runtime with status
  `post_v1_wall_compatible_anchor_delta_one_side_lab_metric_companion_coverage_refresh_landed_no_runtime_selected_next_numeric_coverage_gap_after_one_side_lab_companion`.
- The refresh pins
  `wall.compatible_anchor_delta.calculated_lab_companions` with runtime
  basis
  `post_v1_wall_compatible_anchor_delta_calculated_lab_companion_runtime`
  as one-side-aware `ready_with_budget` in the coverage matrix and
  `allowed_with_budget` in company-internal V0.
- It re-probes the one-side exterior-board Knauf LSF lab companion route
  at `Rw 57 / STC 57 / C -0.6 / Ctr -5.5` and keeps direct single `Rw`,
  STC-only, field/building, A-weighted, ASTM, and non-Knauf rows outside
  the lab companion owner.
- It selected:
  `post_v1_next_numeric_coverage_gap_after_one_side_lab_companion_plan`
  in
  `packages/engine/src/post-v1-next-numeric-coverage-gap-after-one-side-lab-companion-contract.test.ts`.
- Selected label:
  `post-V1 next numeric coverage gap after one-side lab companion`.
- This is not a broad source crawl. Counters:
  `coverageRefreshContractFilesTouched: 1`,
  `frontendImplementationFilesTouched: 0`, `newCalculableLayerTemplates: 0`,
  `newCalculableRequestShapes: 0`, `newCalculableTargetOutputs: 0`,
  `runtimeBasisPromotions: 0`, `runtimeValuesMoved 0`,
  `runtimeFormulaRetunes 0`, and `sourceRowsImported: 0`.

Latest calculator numeric coverage gap after one-side lab companion:

- `post_v1_next_numeric_coverage_gap_after_one_side_lab_companion_plan`
  landed no-runtime with status
  `post_v1_next_numeric_coverage_gap_after_one_side_lab_companion_landed_no_runtime_selected_compatible_anchor_delta_a_weighted_owner`.
- Contract:
  `packages/engine/src/post-v1-next-numeric-coverage-gap-after-one-side-lab-companion-contract.test.ts`.
- Plan doc:
  `docs/calculator/POST_V1_NEXT_NUMERIC_COVERAGE_GAP_AFTER_ONE_SIDE_LAB_COMPANION_PLAN_2026-06-10.md`.
- Selected candidate:
  `wall.compatible_anchor_delta.a_weighted_field_building_adapter_owner`.
- The rerank compared formula-scope, route-input, and accuracy/holdout
  candidates after subtracting the closed compatible anchor-delta direct,
  field/building, paired lab companion, and one-side lab companion lanes.
  At that checkpoint, it selected the A-weighted owner because the engine
  already computed compatible anchor-delta `Dn,A` / `DnT,A` companions but
  kept them unsupported until metric owners landed.
- It selected:
  `post_v1_wall_compatible_anchor_delta_a_weighted_field_building_adapter_owner_plan`
  in
  `packages/engine/src/post-v1-wall-compatible-anchor-delta-a-weighted-field-building-adapter-owner-contract.test.ts`.
- Selected label:
  `post-V1 wall compatible anchor-delta A-weighted field/building adapter owner`.
- This is not a broad source crawl. Counters:
  `candidateCount: 6`, `roiAnalysisIterations: 3`,
  `estimatedNextRuntimeValuesMoved: 6`, `immediateRuntimeValuesMoved: 0`,
  `runtimeBasisPromotions: 0`, `runtimeFormulaRetunes 0`,
  `sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.

Latest calculator compatible anchor-delta A-weighted field/building
adapter owner:

- `post_v1_wall_compatible_anchor_delta_a_weighted_field_building_adapter_owner_plan`
  landed runtime with status
  `post_v1_wall_compatible_anchor_delta_a_weighted_field_building_adapter_owner_landed_runtime_selected_surface_parity_input_acceptance`.
- Contract:
  `packages/engine/src/post-v1-wall-compatible-anchor-delta-a-weighted-field-building-adapter-owner-contract.test.ts`.
- The owner promotes the Knauf `416889` compatible anchor-delta
  A-weighted route values already computed by Gate I / Gate AR: paired
  field `Dn,A 49.5 / DnT,A 51.9`, one-side field
  `Dn,A 48 / DnT,A 50.4`, paired building `DnT,A 51.9`, and one-side
  building `DnT,A 50.4`.
- At this owner checkpoint, building `Dn,A` was still parked until the
  later building `Dn,A` owner below landed. Lab aliases, ASTM/IIC/AIIC,
  and non-`416889` compatible anchors remain unsupported; no source rows
  were imported and no formulas were retuned.
- It selected:
  `post_v1_wall_compatible_anchor_delta_a_weighted_surface_parity_input_acceptance_plan`
  in
  `apps/web/features/workbench/post-v1-wall-compatible-anchor-delta-a-weighted-field-building-surface-parity.test.ts`.
- Selected label:
  `post-V1 wall compatible anchor-delta A-weighted field/building surface parity input acceptance`.
- Counters: `newCalculableLayerTemplates 0`,
  `newCalculableRequestShapes 4`, `runtimeBasisPromotions 2`,
  `runtimeValuesMoved 6`, `runtimeFormulaRetunes 0`,
  `sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.

Latest calculator compatible anchor-delta A-weighted field/building
surface parity:

- `post_v1_wall_compatible_anchor_delta_a_weighted_surface_parity_input_acceptance_plan`
  landed no-runtime with status
  `post_v1_wall_compatible_anchor_delta_a_weighted_surface_parity_input_acceptance_landed_no_runtime_selected_coverage_refresh`.
- Contract:
  `apps/web/features/workbench/post-v1-wall-compatible-anchor-delta-a-weighted-field-building-surface-parity.test.ts`.
- Workbench live calculation, calculator API payloads, saved replay,
  server snapshot replay, output cards, target-output status, and report
  summaries now keep compatible anchor-delta A-only requests aligned:
  paired field `Dn,A 49.5 / DnT,A 51.9`, one-side field
  `Dn,A 48 / DnT,A 50.4`, paired building `DnT,A 51.9`, and one-side
  building `DnT,A 50.4`.
- At this surface checkpoint, building `Dn,A` was still unsupported; the
  later building `Dn,A` owner below now promotes it. The surface posture
  labels supported Gate AR building outputs as `Airborne building
  prediction` instead of a generic carry-over.
- It selected:
  `post_v1_wall_compatible_anchor_delta_a_weighted_field_building_coverage_refresh_plan`
  in
  `packages/engine/src/post-v1-wall-compatible-anchor-delta-a-weighted-field-building-coverage-refresh-contract.test.ts`.
- Selected label:
  `post-V1 wall compatible anchor-delta A-weighted field/building coverage refresh`.
- Counters: `webSurfaceParityContractFilesTouched: 1`,
  `frontendImplementationFilesTouched: 1`, `newCalculableLayerTemplates: 0`,
  `newCalculableRequestShapes: 0`, `newCalculableTargetOutputs: 0`,
  `runtimeBasisPromotions: 0`, `runtimeValuesMoved 0`,
  `runtimeFormulaRetunes 0`, and `sourceRowsImported: 0`.

Latest calculator compatible anchor-delta A-weighted field/building
coverage refresh:

- `post_v1_wall_compatible_anchor_delta_a_weighted_field_building_coverage_refresh_plan`
  landed no-runtime with status
  `post_v1_wall_compatible_anchor_delta_a_weighted_field_building_coverage_refresh_landed_no_runtime_selected_next_numeric_coverage_gap_after_a_weighted_field_building`.
- Contract:
  `packages/engine/src/post-v1-wall-compatible-anchor-delta-a-weighted-field-building-coverage-refresh-contract.test.ts`.
- It freezes the Knauf `416889` A-weighted field/building owner in
  registry, runtime adapter, runtime surface, coverage matrix, and
  company-internal V0. `wall.airborne_field_context.field_apparent_adapter`
  remains `ready_with_budget` / `allowed_with_budget` on
  `gate_i_airborne_field_apparent_context_adapter_runtime`, and
  `candidate_airborne_building_prediction_all_owner_family_physics_prediction`
  remains `ready_with_budget` / `allowed_with_budget` on
  `gate_ar_airborne_building_prediction_all_owner_runtime_corridor`.
- It re-probes paired field `Dn,A 49.5 / DnT,A 51.9`, one-side field
  `Dn,A 48 / DnT,A 50.4`, paired building `DnT,A 51.9`, and one-side
  building `DnT,A 50.4`. At that refresh checkpoint, building `Dn,A`
  was still outside the owner; the later building `Dn,A` owner below now
  promotes it. Lab aliases, ASTM/IIC/AIIC, missing-input, and
  non-`416889` rows remain outside the route.
- It selected:
  `post_v1_next_numeric_coverage_gap_after_a_weighted_field_building_plan`
  in
  `packages/engine/src/post-v1-next-numeric-coverage-gap-after-a-weighted-field-building-contract.test.ts`.
- Selected label:
  `post-V1 next numeric coverage gap after A-weighted field/building`.
- This is not a broad source crawl. Counters:
  `coverageRefreshContractFilesTouched: 1`,
  `frontendImplementationFilesTouched: 0`, `newCalculableLayerTemplates: 0`,
  `newCalculableRequestShapes: 0`, `newCalculableTargetOutputs: 0`,
  `runtimeBasisPromotions: 0`, `runtimeValuesMoved 0`,
  `runtimeFormulaRetunes 0`, and `sourceRowsImported: 0`.

Latest calculator numeric coverage gap after A-weighted field/building:

- `post_v1_next_numeric_coverage_gap_after_a_weighted_field_building_plan`
  landed no-runtime with status
  `post_v1_next_numeric_coverage_gap_after_a_weighted_field_building_landed_no_runtime_selected_compatible_anchor_delta_building_dn_a_owner`.
- Contract:
  `packages/engine/src/post-v1-next-numeric-coverage-gap-after-a-weighted-field-building-contract.test.ts`.
- Plan doc:
  `docs/calculator/POST_V1_NEXT_NUMERIC_COVERAGE_GAP_AFTER_A_WEIGHTED_FIELD_BUILDING_PLAN_2026-06-10.md`.
- Selected candidate:
  `wall.compatible_anchor_delta.building_dn_a_owner`.
- The rerank subtracts the closed compatible anchor-delta direct `Rw`,
  field/building base metrics, paired and one-side lab companions,
  field `Dn,A`/`DnT,A`, and building `DnT,A`. It selects the building
  Dn,A owner because the Gate AR compatible anchor-delta route already
  carries paired building `Dn,A 49.5` and one-side building `Dn,A 48`
  as computed values, but they remain unsupported behind an explicit
  separate-owner warning.
- It selected:
  `post_v1_wall_compatible_anchor_delta_building_dn_a_owner_plan`
  in
  `packages/engine/src/post-v1-wall-compatible-anchor-delta-building-dn-a-owner-contract.test.ts`.
- Selected label:
  `post-V1 wall compatible anchor-delta building Dn,A owner`.
- This is not a broad source crawl. Counters:
  `candidateCount: 6`, `roiAnalysisIterations: 3`,
  `closedAWeightedRowsRechecked: 4`,
  `buildingDnAUnsupportedRowsRechecked: 2`,
  `estimatedNextCalculableRequestShapes: 2`,
  `estimatedNextRuntimeValuesMoved: 2`, `immediateRuntimeValuesMoved: 0`,
  `frontendImplementationFilesTouched: 0`, `runtimeBasisPromotions: 0`,
  `runtimeValuesMoved 0`, `runtimeFormulaRetunes 0`, and
  `sourceRowsImported: 0`.

Latest calculator compatible anchor-delta building Dn,A owner:

- `post_v1_wall_compatible_anchor_delta_building_dn_a_owner_plan`
  landed with status
  `post_v1_wall_compatible_anchor_delta_building_dn_a_owner_landed_runtime_selected_coverage_refresh`.
- Owner contract:
  `packages/engine/src/post-v1-wall-compatible-anchor-delta-building-dn-a-owner-contract.test.ts`.
- It promotes the already-computed Gate AR compatible anchor-delta
  building `Dn,A` values: paired exterior-board building `Dn,A 49.5`
  and one-side exterior-board building `Dn,A 48`.
- It keeps the same shifted Knauf `416889` direct curve, Gate AR
  building-prediction basis, and ISO 717 C adapter term. No source rows
  were imported and no formula was retuned.
- Lab aliases, missing `buildingPredictionOutputBasis`, non-selected
  anchors, and ASTM/IIC/AIIC remain boundary rows.
- It selected:
  `post_v1_wall_compatible_anchor_delta_building_dn_a_coverage_refresh_plan`
  in
  `packages/engine/src/post-v1-wall-compatible-anchor-delta-building-dn-a-coverage-refresh-contract.test.ts`.
- Selected label:
  `post-V1 wall compatible anchor-delta building Dn,A coverage refresh`.
- Counters: `newCalculableRequestShapes: 2`,
  `newCalculableTargetOutputs: 1`, `runtimeBasisPromotions: 1`,
  `runtimeValuesMoved 2`, `runtimeFormulaRetunes: 0`,
  `sourceRowsImported: 0`, `frontendImplementationFilesTouched: 0`, and
  `webSurfaceParityContractFilesTouched: 1`.

Latest compatible anchor-delta building Dn,A coverage refresh:

- Landed action:
  `post_v1_wall_compatible_anchor_delta_building_dn_a_coverage_refresh_plan`.
- File:
  `packages/engine/src/post-v1-wall-compatible-anchor-delta-building-dn-a-coverage-refresh-contract.test.ts`.
- Status:
  `post_v1_wall_compatible_anchor_delta_building_dn_a_coverage_refresh_landed_no_runtime_selected_stc_only_lab_companion_owner`.
- It freezes paired exterior-board building `Dn,A 49.5` and one-side
  exterior-board building `Dn,A 48` without runtime movement, source
  import, or formula retune. STC-only remains pinned as a boundary in the
  closeout.
- Counters: `coverageRefreshContractFilesTouched: 1`,
  `runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
  `sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.
- Selected next action:
  `post_v1_wall_compatible_anchor_delta_stc_only_lab_companion_owner_plan`.
- Selected next file:
  `packages/engine/src/post-v1-wall-compatible-anchor-delta-stc-only-lab-companion-owner-contract.test.ts`.
- Selected next plan doc:
  `docs/calculator/POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_STC_ONLY_LAB_COMPANION_OWNER_PLAN_2026-06-11.md`.
- Selected next label:
  `post-V1 wall compatible anchor-delta STC-only lab companion owner`.
- The selected next is the STC-only lab companion coverage refresh after
  the surface parity closeout.

Latest compatible anchor-delta STC-only lab companion owner:

- Landed action:
  `post_v1_wall_compatible_anchor_delta_stc_only_lab_companion_owner_plan`.
- File:
  `packages/engine/src/post-v1-wall-compatible-anchor-delta-stc-only-lab-companion-owner-contract.test.ts`.
- Status:
  `post_v1_wall_compatible_anchor_delta_stc_only_lab_companion_owner_landed_runtime_selected_surface_parity`.
- It opens paired exterior-board `STC 59` and one-side exterior-board
  `STC 57` for Knauf `416889` compatible anchor-delta element-lab
  requests through the calculated lab companion runtime. It does not
  claim measured STC evidence, import source rows, or retune formulas.
- Direct `Rw`, mixed `Rw+STC/C/Ctr`, field/building, A-weighted,
  C/Ctr-only, ASTM/IIC/AIIC, missing-input, and non-Knauf boundaries
  remain pinned.
- Counters: `newCalculableRequestShapes: 2`,
  `newCalculableTargetOutputs: 1`, `runtimeBasisPromotions: 1`,
  `runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
  `sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.
- Selected follow-up:
  `post_v1_wall_compatible_anchor_delta_stc_only_lab_companion_surface_parity_plan`.
- Selected follow-up file:
  `apps/web/features/workbench/post-v1-wall-compatible-anchor-delta-stc-only-lab-companion-surface-parity.test.ts`.
- Selected follow-up plan doc:
  `docs/calculator/POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_STC_ONLY_LAB_COMPANION_SURFACE_PARITY_PLAN_2026-06-11.md`.
- Selected follow-up label:
  `post-V1 wall compatible anchor-delta STC-only lab companion surface parity`.

Latest compatible anchor-delta STC-only lab companion surface parity:

- Landed action:
  `post_v1_wall_compatible_anchor_delta_stc_only_lab_companion_surface_parity_plan`.
- File:
  `apps/web/features/workbench/post-v1-wall-compatible-anchor-delta-stc-only-lab-companion-surface-parity.test.ts`.
- Status:
  `post_v1_wall_compatible_anchor_delta_stc_only_lab_companion_surface_parity_landed_no_runtime_selected_coverage_refresh`.
- Workbench live calculation, calculator API payloads, saved replay,
  server snapshot replay, output cards, target-output status, and report
  summaries now keep paired exterior-board `STC 59` and one-side
  exterior-board `STC 57` aligned through
  `wall.compatible_anchor_delta.calculated_lab_companions` on runtime
  basis
  `post_v1_wall_compatible_anchor_delta_calculated_lab_companion_runtime`.
- Direct `Rw`, mixed `Rw+STC/C/Ctr`, C/Ctr-only, field/building,
  A-weighted, ASTM/IIC/AIIC, missing-input, and non-Knauf boundaries
  remain pinned.
- This is not a broad source crawl.
- Counters: `webSurfaceParityContractFilesTouched: 1`,
  `frontendImplementationFilesTouched: 0`, `runtimeValuesMoved 0`,
  `runtimeFormulaRetunes: 0`, and `sourceRowsImported: 0`.
- Selected next action:
  `post_v1_wall_compatible_anchor_delta_stc_only_lab_companion_coverage_refresh_plan`.
- Selected next file:
  `packages/engine/src/post-v1-wall-compatible-anchor-delta-stc-only-lab-companion-coverage-refresh-contract.test.ts`.
- Selected next plan doc:
  `docs/calculator/POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_STC_ONLY_LAB_COMPANION_COVERAGE_REFRESH_PLAN_2026-06-11.md`.
- Selected next label:
  `post-V1 wall compatible anchor-delta STC-only lab companion coverage refresh`.

Latest compatible anchor-delta STC-only lab companion coverage refresh:

- Landed action:
  `post_v1_wall_compatible_anchor_delta_stc_only_lab_companion_coverage_refresh_plan`.
- File:
  `packages/engine/src/post-v1-wall-compatible-anchor-delta-stc-only-lab-companion-coverage-refresh-contract.test.ts`.
- Status:
  `post_v1_wall_compatible_anchor_delta_stc_only_lab_companion_coverage_refresh_landed_no_runtime_selected_c_ctr_only_lab_companion_owner`.
- It freezes paired exterior-board `STC 59` and one-side exterior-board
  `STC 57` for Knauf `416889` compatible anchor-delta element-lab
  STC-only requests through
  `wall.compatible_anchor_delta.calculated_lab_companions` on runtime
  basis
  `post_v1_wall_compatible_anchor_delta_calculated_lab_companion_runtime`.
- The resolver registry, runtime adapter, runtime surface, coverage
  matrix, and company-internal V0 keep the candidate
  `ready_with_budget` / `allowed_with_budget` with visible
  not-measured STC/C/Ctr budget terms.
- Direct `Rw`, mixed `Rw+STC/C/Ctr`, C/Ctr-only, field/building,
  A-weighted, ASTM/IIC/AIIC, missing-input, and non-Knauf boundaries
  remain pinned. This is not a broad source crawl.
- Counters: `coverageRefreshContractFilesTouched: 1`,
  `webSurfaceParityContractFilesTouched: 1`,
  `frontendImplementationFilesTouched: 0`,
  `newCalculableRequestShapes: 0`, `runtimeBasisPromotions: 0`,
  `runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
  `sourceRowsImported: 0`,
  `estimatedNextCalculableRequestShapes: 4`, and
  `estimatedNextRuntimeBasisPromotions: 1`.
- Selected next action:
  `post_v1_wall_compatible_anchor_delta_c_ctr_only_lab_companion_owner_plan`.
- Selected next file:
  `packages/engine/src/post-v1-wall-compatible-anchor-delta-c-ctr-only-lab-companion-owner-contract.test.ts`.
- Selected next plan doc:
  `docs/calculator/POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_C_CTR_ONLY_LAB_COMPANION_OWNER_PLAN_2026-06-11.md`.
- Selected next label:
  `post-V1 wall compatible anchor-delta C/Ctr-only lab companion owner`.
- The selected next was value-moving: standalone C-only and Ctr-only
  requests were unsupported at the closeout checkpoint even though the
  mixed lab companion route already owned calculated C/Ctr values. The
  owner below now lands that support.

Latest compatible anchor-delta C/Ctr-only lab companion owner:

- Landed action:
  `post_v1_wall_compatible_anchor_delta_c_ctr_only_lab_companion_owner_plan`.
- File:
  `packages/engine/src/post-v1-wall-compatible-anchor-delta-c-ctr-only-lab-companion-owner-contract.test.ts`.
- Status:
  `post_v1_wall_compatible_anchor_delta_c_ctr_only_lab_companion_owner_landed_runtime_selected_surface_parity`.
- It opens standalone element-lab C-only and Ctr-only requests for Knauf
  `416889` compatible anchor-delta stacks through
  `wall.compatible_anchor_delta.calculated_lab_companions` on runtime
  basis
  `post_v1_wall_compatible_anchor_delta_calculated_lab_companion_runtime`:
  paired `C -1.1`, paired `Ctr -6`, one-side `C -0.6`, and one-side
  `Ctr -5.5`.
- These are calculated companion values, not measured C/Ctr source
  evidence. Direct `Rw`, STC-only, mixed `Rw+STC/C/Ctr`, C+Ctr without
  `Rw`/`STC`, field/building, A-weighted, ASTM/IIC/AIIC, missing-input,
  and non-Knauf boundaries remain pinned. This is not a broad source
  crawl.
- Counters: `newCalculableRequestShapes: 4`,
  `newCalculableTargetOutputs: 2`, `runtimeBasisPromotions: 1`,
  `runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
  `sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.
- Selected next action:
  `post_v1_wall_compatible_anchor_delta_c_ctr_only_lab_companion_surface_parity_plan`.
- Selected next file:
  `apps/web/features/workbench/post-v1-wall-compatible-anchor-delta-c-ctr-only-lab-companion-surface-parity.test.ts`.
- Selected next plan doc:
  `docs/calculator/POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_C_CTR_ONLY_LAB_COMPANION_SURFACE_PARITY_PLAN_2026-06-11.md`.
- Selected next label:
  `post-V1 wall compatible anchor-delta C/Ctr-only lab companion surface parity`.

Latest compatible anchor-delta C/Ctr-only lab companion surface parity:

- Landed action:
  `post_v1_wall_compatible_anchor_delta_c_ctr_only_lab_companion_surface_parity_plan`.
- File:
  `apps/web/features/workbench/post-v1-wall-compatible-anchor-delta-c-ctr-only-lab-companion-surface-parity.test.ts`.
- Status:
  `post_v1_wall_compatible_anchor_delta_c_ctr_only_lab_companion_surface_parity_landed_no_runtime_selected_coverage_refresh`.
- Workbench live calculation, calculator API payloads, saved replay,
  server snapshot replay, output cards, target-output status, and report
  summaries now keep paired `C -1.1`, paired `Ctr -6`, one-side
  `C -0.6`, and one-side `Ctr -5.5` aligned through
  `wall.compatible_anchor_delta.calculated_lab_companions` on runtime
  basis
  `post_v1_wall_compatible_anchor_delta_calculated_lab_companion_runtime`.
- Direct `Rw`, STC-only, mixed `Rw+STC/C/Ctr`, C+Ctr without `Rw`/`STC`,
  field/building, A-weighted, ASTM/IIC/AIIC, missing-input, and
  non-Knauf boundaries remain pinned. This is not a broad source crawl.
- Counters: `webSurfaceParityContractFilesTouched: 1`,
  `frontendImplementationFilesTouched: 0`, `runtimeValuesMoved 0`,
  `runtimeFormulaRetunes: 0`, and `sourceRowsImported: 0`.
- Selected next action:
  `post_v1_wall_compatible_anchor_delta_c_ctr_only_lab_companion_coverage_refresh_plan`.
- Selected next file:
  `packages/engine/src/post-v1-wall-compatible-anchor-delta-c-ctr-only-lab-companion-coverage-refresh-contract.test.ts`.
- Selected next plan doc:
  `docs/calculator/POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_C_CTR_ONLY_LAB_COMPANION_COVERAGE_REFRESH_PLAN_2026-06-11.md`.
- Selected next label:
  `post-V1 wall compatible anchor-delta C/Ctr-only lab companion coverage refresh`.

- Latest landed coverage refresh:
  `post_v1_wall_compatible_anchor_delta_c_ctr_only_lab_companion_coverage_refresh_plan`.
- Coverage refresh file:
  `packages/engine/src/post-v1-wall-compatible-anchor-delta-c-ctr-only-lab-companion-coverage-refresh-contract.test.ts`.
- Coverage refresh status:
  `post_v1_wall_compatible_anchor_delta_c_ctr_only_lab_companion_coverage_refresh_landed_no_runtime_selected_wall_double_leaf_framed_route_input_runtime_widening`.
- The refresh freezes paired `C -1.1`, paired `Ctr -6`, one-side
  `C -0.6`, and one-side `Ctr -5.5` through
  `wall.compatible_anchor_delta.calculated_lab_companions` with runtime
  basis
  `post_v1_wall_compatible_anchor_delta_calculated_lab_companion_runtime`.
  The route remains `ready_with_budget` in coverage and
  `allowed_with_budget` in company-internal V0. This is not a broad
  source crawl. Counters: `coverageRefreshContractFilesTouched: 1`,
  `webSurfaceParityContractFilesTouched: 1`,
  `frontendImplementationFilesTouched: 0`, `runtimeValuesMoved 0`,
  `runtimeFormulaRetunes: 0`, and `sourceRowsImported: 0`.
- Selected next action:
  `post_v1_wall_double_leaf_framed_route_input_runtime_widening_plan`.
- Selected next file:
  `packages/engine/src/post-v1-wall-double-leaf-framed-route-input-runtime-widening-contract.test.ts`.
- Selected next plan doc:
  `docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_ROUTE_INPUT_RUNTIME_WIDENING_PLAN_2026-06-11.md`.
- Selected next label:
  `post-V1 wall double-leaf/framed route-input runtime widening`.
- High-ROI declaration: route family `wall.double_leaf_framed`; target
  outputs `Rw`, `STC`, `C`, and `Ctr`; required physical inputs include
  side leaf groups, side leaf masses, cavity depth, absorber class/fill
  and flow resistivity, support topology, stud/support spacing, resilient
  side count when needed, and bridge class. The expected scope movement
  is more board/panel/cavity/porous-fill double-leaf/framed walls
  calculating through the owned formula route while exact-source
  precedence, the thick-board Auto boundary, field/building aliases,
  ASTM/IIC/AIIC, direct-fixed, grouped triple-leaf/multicavity, and
  floor-impact boundaries stay pinned.

- Latest landed runtime widening:
  `post_v1_wall_double_leaf_framed_route_input_runtime_widening_plan`.
- Runtime owner file:
  `packages/engine/src/post-v1-wall-double-leaf-framed-route-input-runtime-widening-contract.test.ts`.
- Runtime owner status:
  `post_v1_wall_double_leaf_framed_route_input_runtime_widening_landed_runtime_selected_surface_parity`.
- The owner opens context-only empty-cavity double-leaf/framed walls:
  two visible board leaves plus explicit `cavity1DepthMm`,
  `cavity1FillCoverage empty`, `cavity1AbsorptionClass none`, side leaf
  groups, support topology, and support spacing now calculate
  element-lab `Rw 42`, `STC 42`, `C -1`, and `Ctr -6.1` through
  `layer_combination_resolver_double_leaf_framed_wall_banded_source_absent_formula_corridor`.
  Context-only absorptive cavities without a visible porous-fill layer
  remain `needs_input` for `cavity1FillCoverage` and `absorberClass`.
  Direct-fixed, exact/anchor precedence, thick-board Auto, field/building
  alias, ASTM/IIC/AIIC, grouped triple-leaf, and floor-impact boundaries
  stay pinned. Counters: `newCalculableLayerTemplates: 1`,
  `newCalculableRequestShapes: 1`, `newCalculableTargetOutputs: 4`,
  `runtimeBasisPromotions: 1`, `frontendImplementationFilesTouched: 0`,
  `runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`, and
  `sourceRowsImported: 0`.
- Runtime declaration: route family `wall.double_leaf_framed`; target
  outputs `Rw`, `STC`, `C`, and `Ctr`; required physical inputs include
  side leaf groups, side leaf masses, cavity depth, absorber class/fill
  and flow resistivity, support topology, support spacing, resilient side
  count when needed, and bridge class.
- Selected next action:
  `post_v1_wall_double_leaf_framed_route_input_runtime_widening_surface_parity_plan`.
- Selected next file:
  `apps/web/features/workbench/post-v1-wall-double-leaf-framed-route-input-runtime-widening-surface-parity.test.ts`.
- Selected next plan doc:
  `docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_ROUTE_INPUT_RUNTIME_WIDENING_SURFACE_PARITY_PLAN_2026-06-11.md`.
- Selected next label:
  `post-V1 wall double-leaf/framed route-input runtime widening surface parity`.
- Latest landed surface parity:
  `post_v1_wall_double_leaf_framed_route_input_runtime_widening_surface_parity_plan`.
- Surface parity file:
  `apps/web/features/workbench/post-v1-wall-double-leaf-framed-route-input-runtime-widening-surface-parity.test.ts`.
- Surface parity status:
  `post_v1_wall_double_leaf_framed_route_input_runtime_widening_surface_parity_landed_no_runtime_selected_coverage_refresh`.
- The surface proves live workbench calculation, calculator API payloads,
  saved replay, server snapshot replay, output cards, target-output
  status, and report summaries preserve `Rw 42`, `STC 42`, `C -1`, and
  `Ctr -6.1` on runtime basis
  `layer_combination_resolver_double_leaf_framed_wall_banded_source_absent_formula_corridor`.
  Missing cavity classification stays `needs_input` for
  `cavity1FillCoverage` and `absorberClass`; field/building aliases plus
  ASTM/IIC/AIIC remain outside this owner. Counters:
  `webSurfaceParityContractFilesTouched: 1`,
  `frontendImplementationFilesTouched: 0`,
  `newCalculableLayerTemplates: 0`, `newCalculableRequestShapes: 0`,
  `newCalculableTargetOutputs: 0`, `runtimeBasisPromotions: 0`,
  `runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`, and
  `sourceRowsImported: 0`.
- Selected next action:
  `post_v1_wall_double_leaf_framed_route_input_runtime_widening_coverage_refresh_plan`.
- Selected next file:
  `packages/engine/src/post-v1-wall-double-leaf-framed-route-input-runtime-widening-coverage-refresh-contract.test.ts`.
- Selected next plan doc:
  `docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_ROUTE_INPUT_RUNTIME_WIDENING_COVERAGE_REFRESH_PLAN_2026-06-11.md`.
- Selected next label:
  `post-V1 wall double-leaf/framed route-input runtime widening coverage refresh`.

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
