# Post-V1 Wall User-Material Formula Companion Completeness Owner - 2026-06-17

## Purpose

This is the runtime owner selected by the runtime-first route-family
rerank after the low-density exact ASTM floor target-output closeout.
It improves calculator scope for custom user-entered wall assemblies by
publishing lab airborne companions from the owned double-leaf/framed
formula route alongside complete building-prediction outputs.

This is not UI work, source crawling, confidence-labeling, or a formula
retune.

## Previous Rerank

Previous rerank:

`post_v1_runtime_first_route_family_rerank_after_floor_user_material_low_density_exact_astm_lab_airborne_impact_target_output_independence_plan`

Previous rerank file:

`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-floor-user-material-low-density-exact-astm-lab-airborne-impact-target-output-independence-contract.test.ts`

Previous rerank status:

`post_v1_runtime_first_route_family_rerank_after_floor_user_material_low_density_exact_astm_lab_airborne_impact_target_output_independence_landed_no_runtime_selected_wall_user_material_formula_companion_completeness_owner`

Previous coverage refresh:

`post_v1_floor_user_material_low_density_exact_astm_lab_airborne_impact_target_output_independence_coverage_refresh_plan`

Previous coverage refresh file:

`packages/engine/src/post-v1-floor-user-material-low-density-exact-astm-lab-airborne-impact-target-output-independence-coverage-refresh-contract.test.ts`

Previous coverage refresh status:

`post_v1_floor_user_material_low_density_exact_astm_lab_airborne_impact_target_output_independence_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank`

Rerank selected candidate:

`wall.user_material_formula_companion_completeness_owner`

Rerank counters: `candidateCount: 9`, `roiAnalysisIterations: 4`,
`estimatedNextRuntimeValuesMoved: 8`, `runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`. This is not a broad source
crawl.

## Runtime Owner

Owner action:

`post_v1_wall_user_material_formula_companion_completeness_owner_plan`

Owner file:

`packages/engine/src/post-v1-wall-user-material-formula-companion-completeness-owner-contract.test.ts`

Owner plan doc:

`docs/calculator/POST_V1_WALL_USER_MATERIAL_FORMULA_COMPANION_COMPLETENESS_OWNER_PLAN_2026-06-17.md`

Owner status:

`post_v1_wall_user_material_formula_companion_completeness_owner_landed_runtime_selected_coverage_refresh`

Selected candidate:

`wall.user_material_formula_companion_completeness_owner`

The owner is restricted to custom user-supplied material wall stacks on
the complete `double_leaf_framed` formula route with complete Gate AR
building-prediction context. It lets mixed building requests publish
owned lab companions from the direct formula curve while keeping the
resolver trace on the building adapter:

- lab companions: `Rw 46`, `STC 46`, `C -1`, and `Ctr -6.1`;
- building outputs: `R'w 40`, `Dn,w 41`, `Dn,A 39.5`,
  `DnT,w 43`, and `DnT,A 41.9`;
- base direct formula:
  `layer_combination_resolver_double_leaf_framed_wall_banded_source_absent_formula_corridor`;
- building adapter:
  `gate_ar_airborne_building_prediction_all_owner_runtime_corridor`.

Counters: `newCalculableLayerTemplates: 0`,
`newCalculableRequestShapes: 2`, `newCalculableTargetOutputs: 8`,
`runtimeBasisPromotions: 2`, `runtimeValuesMoved 8`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`. This is not a broad source
crawl.

## Boundaries

The owner does not:

- change the double-leaf/framed formula coefficients;
- import source rows;
- promote timber-stud or CLT wall formula values without new source
  evidence;
- alias `Rw` to `R'w`;
- publish ASTM `IIC` / `AIIC` from wall airborne routes;
- publish impact `Ln,w` / `DeltaLw` for wall assemblies;
- widen building-only requests into lab companion publication;
- bypass missing topology, missing field/building, or missing material
  inputs.

## Current Selected Next

Selected next action:

`post_v1_wall_user_material_formula_companion_completeness_coverage_refresh_plan`

Selected next file:

`packages/engine/src/post-v1-wall-user-material-formula-companion-completeness-coverage-refresh-contract.test.ts`

Selected next plan doc:

`docs/calculator/POST_V1_WALL_USER_MATERIAL_FORMULA_COMPANION_COMPLETENESS_COVERAGE_REFRESH_PLAN_2026-06-17.md`

Selected next label:

`post-V1 wall user-material formula companion completeness coverage refresh`

## Follow-Up Coverage Refresh Closeout

Coverage refresh:

`post_v1_wall_user_material_formula_companion_completeness_coverage_refresh_plan`

Coverage refresh file:

`packages/engine/src/post-v1-wall-user-material-formula-companion-completeness-coverage-refresh-contract.test.ts`

Coverage refresh status:

`post_v1_wall_user_material_formula_companion_completeness_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank`

Coverage refresh counters: `coverageRefreshContractFilesTouched: 1`,
`newCalculableLayerTemplates: 0`, `newCalculableRequestShapes: 0`,
`newCalculableTargetOutputs: 0`, `runtimeBasisPromotions: 0`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.
This is not a broad source crawl.

Current selected next action:

`post_v1_runtime_first_route_family_rerank_after_wall_user_material_formula_companion_completeness_plan`

Current selected next file:

`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-wall-user-material-formula-companion-completeness-contract.test.ts`

Current selected next plan doc:

`docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_WALL_USER_MATERIAL_FORMULA_COMPANION_COMPLETENESS_PLAN_2026-06-17.md`

Current selected next label:

`post-V1 runtime-first route-family rerank after wall user-material formula companion completeness`
