# Post-V1 Floor User-Material Impact Context Dynamic-Stiffness Owner Plan - 2026-06-12

## North Star

DynEcho is an acoustic calculator. This owner exists to make the floor
impact engine calculate more arbitrary user-entered floor layer
combinations when the user provides the route-required physical inputs.

The selected gap is not material-editor UI, source crawling, or a finite
catalog row pack. It is a bounded calculator-runtime owner: a custom
visible heavy floating-floor stack with explicit floor roles should use
`floorImpactContext.resilientLayerDynamicStiffnessMNm3` when the custom
resilient material itself does not yet store
`impact.dynamicStiffnessMNm3`.

## Previous Rerank

Previous coverage refresh action:

`post_v1_wall_double_leaf_framed_user_material_porous_flow_resistivity_input_coverage_refresh_plan`

Previous coverage refresh file:

`packages/engine/src/post-v1-wall-double-leaf-framed-user-material-porous-flow-resistivity-input-coverage-refresh-contract.test.ts`

Previous coverage refresh status:

`post_v1_wall_double_leaf_framed_user_material_porous_flow_resistivity_input_coverage_refresh_landed_no_runtime_selected_next_numeric_coverage_gap`

Selected rerank action:

`post_v1_next_numeric_coverage_gap_after_user_material_porous_flow_resistivity_input_plan`

Selected rerank file:

`packages/engine/src/post-v1-next-numeric-coverage-gap-after-user-material-porous-flow-resistivity-input-contract.test.ts`

Selected rerank status:

`post_v1_next_numeric_coverage_gap_after_user_material_porous_flow_resistivity_input_landed_no_runtime_selected_floor_user_material_impact_context_dynamic_stiffness_owner`

Selected candidate:

`floor.user_material_impact_context_dynamic_stiffness_owner`

The rerank ran `roiAnalysisIterations: 3`, subtracted closed compatible
anchor-delta, direct-fixed, default-catalog double-leaf/framed,
explicit user-material, missing-topology, and porous flow-resistivity
lanes, then selected this floor owner. Counters: `candidateCount 11`,
`estimatedNextRuntimeValuesMoved: 2`,
`estimatedNextCalculableRequestShapes: 1`,
`estimatedNextCalculableTargetOutputs: 2`, `runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`. This is not a broad source
crawl.

## Selected Work

Selected action:

`post_v1_floor_user_material_impact_context_dynamic_stiffness_owner_plan`

Selected file:

`packages/engine/src/post-v1-floor-user-material-impact-context-dynamic-stiffness-owner-contract.test.ts`

Selected label:

`post-V1 floor user-material impact context dynamic-stiffness owner`

## Landed Closeout

Owner status:

`post_v1_floor_user_material_impact_context_dynamic_stiffness_owner_landed_runtime_selected_coverage_refresh`

The owner lets custom visible heavy floating-floor stacks use
`floorImpactContext.resilientLayerDynamicStiffnessMNm3` and
`floorImpactContext.loadBasisKgM2`; the pinned custom stack calculates
`Ln,w 50.3` and `DeltaLw 24.3` through
`predictor_heavy_floating_floor_iso12354_annexc_estimate`. Missing
dynamic stiffness/load basis remains `needs_input`, and low-density
custom concrete remains outside the heavy concrete carrier route.

Selected next action:

`post_v1_floor_user_material_impact_context_dynamic_stiffness_coverage_refresh_plan`

Selected next file:

`packages/engine/src/post-v1-floor-user-material-impact-context-dynamic-stiffness-coverage-refresh-contract.test.ts`

Selected next plan doc:

`docs/calculator/POST_V1_FLOOR_USER_MATERIAL_IMPACT_CONTEXT_DYNAMIC_STIFFNESS_COVERAGE_REFRESH_PLAN_2026-06-12.md`

Selected next label:

`post-V1 floor user-material impact context dynamic-stiffness coverage refresh`

Landed counters: `newCalculableLayerTemplates: 1`,
`newCalculableRequestShapes: 1`, `newCalculableTargetOutputs: 2`,
`runtimeBasisPromotions: 1`, `runtimeValuesMoved 2`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`. This is not a broad source
crawl.

## Follow-Up Coverage Refresh Closeout - 2026-06-15

Coverage refresh action:

`post_v1_floor_user_material_impact_context_dynamic_stiffness_coverage_refresh_plan`

Coverage refresh file:

`packages/engine/src/post-v1-floor-user-material-impact-context-dynamic-stiffness-coverage-refresh-contract.test.ts`

Coverage refresh status:

`post_v1_floor_user_material_impact_context_dynamic_stiffness_coverage_refresh_landed_no_runtime_selected_next_numeric_coverage_gap`

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

Selected next action:

`post_v1_next_numeric_coverage_gap_after_floor_user_material_impact_context_dynamic_stiffness_plan`

Selected next file:

`packages/engine/src/post-v1-next-numeric-coverage-gap-after-floor-user-material-impact-context-dynamic-stiffness-contract.test.ts`

Selected next plan doc:

`docs/calculator/POST_V1_NEXT_NUMERIC_COVERAGE_GAP_AFTER_FLOOR_USER_MATERIAL_IMPACT_CONTEXT_DYNAMIC_STIFFNESS_PLAN_2026-06-15.md`

Selected next label:

`post-V1 next numeric coverage gap after floor user-material impact context dynamic stiffness`

## Runtime Rule

The owner should promote only this bounded shape:

- route: floor;
- stack: explicit `floorRole` values for `base_structure`,
  `resilient_layer`, and at least one upper load layer such as
  `floating_screed` or `floor_covering`;
- base: heavy concrete / reinforced concrete by owned material tags and
  density eligibility;
- resilient layer: custom material may omit
  `impact.dynamicStiffnessMNm3`;
- context: `floorImpactContext.resilientLayerDynamicStiffnessMNm3`
  supplies positive dynamic stiffness;
- load: use the same owned heavy floating-floor load basis rules already
  used by the live formula route;
- outputs: ISO lab `Ln,w` and `DeltaLw`;
- basis: keep
  `predictor_heavy_floating_floor_iso12354_annexc_estimate`;
- no formula retune, source row import, ASTM/IIC alias, field/building
  alias, or frontend implementation change.

Missing dynamic stiffness must remain `needs_input`. Missing load basis
must remain `needs_input` when visible upper load cannot be derived by
the owned route. ASTM `IIC` / `AIIC`, field `L'n,w` / `L'nT,w`, and
building impact outputs remain separate owners.

## Expected Counters

Expected owner counters: `newCalculableLayerTemplates: 1`,
`newCalculableRequestShapes: 1`, `newCalculableTargetOutputs: 2`,
`runtimeBasisPromotions: 1`, `runtimeValuesMoved 2`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`.
