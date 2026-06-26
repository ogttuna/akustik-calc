# Post-V1 Ceiling Single-Leaf Airborne Route Coverage Refresh - 2026-06-26

Status:
`post_v1_ceiling_single_leaf_airborne_route_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank_after_ceiling_single_leaf_airborne_route_coverage_refresh`

Coverage refresh action:
`post_v1_ceiling_single_leaf_airborne_route_coverage_refresh_plan`

Coverage refresh file:
`packages/engine/src/post-v1-ceiling-single-leaf-airborne-route-coverage-refresh-contract.test.ts`

Coverage refresh plan:
`docs/calculator/POST_V1_CEILING_SINGLE_LEAF_AIRBORNE_ROUTE_COVERAGE_REFRESH_PLAN_2026-06-26.md`

Selected next:
`post_v1_runtime_first_route_family_rerank_after_ceiling_single_leaf_airborne_route_coverage_refresh_plan`
/
`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-ceiling-single-leaf-airborne-route-coverage-refresh-contract.test.ts`
/
`docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_CEILING_SINGLE_LEAF_AIRBORNE_ROUTE_COVERAGE_REFRESH_PLAN_2026-06-26.md`
/
`post-V1 runtime-first route-family rerank after ceiling single-leaf airborne route coverage refresh`

Selected by:
`post_v1_ceiling_single_leaf_airborne_route_owner_plan`
/
`packages/engine/src/post-v1-ceiling-single-leaf-airborne-route-owner-contract.test.ts`

Selected by status:
`post_v1_ceiling_single_leaf_airborne_route_owner_landed_runtime_basis_selected_coverage_refresh`

Owner selected by rerank:
`post_v1_runtime_first_route_family_rerank_after_floor_user_material_impact_lower_treatment_depth_coverage_refresh_plan`

Owner selected by rerank file:
`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-floor-user-material-impact-lower-treatment-depth-coverage-refresh-contract.test.ts`

Owner selected by rerank status:
`post_v1_runtime_first_route_family_rerank_after_floor_user_material_impact_lower_treatment_depth_coverage_refresh_landed_no_runtime_selected_ceiling_single_leaf_airborne_route_owner`

Selected owner candidate:
`ceiling.single_leaf_airborne_mass_law.source_absent`

Owner movement to protect:
`newCalculableLayerTemplates: 1`,
`newCalculableRequestShapes: 1`,
`newCalculableTargetOutputs: 4`,
`requiredPhysicalInputsCaptured: 1`,
`runtimeBasisPromotions: 1`,
`runtimeValuesMoved 4`,
`runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`,
`frontendImplementationFilesTouched: 0`, and
`unsupportedBoundariesProtected: 5`.

## Purpose

Re-probe the landed ceiling single-leaf airborne route after the owner.
The refresh should pin the first-class `ceiling` resolver trace, `Rw 34`,
`STC 34`, `C 3.7`, and `Ctr 8`; confirm ceiling-only implicit floor
impact estimates stay suppressed; and keep impact, OITC, ASTM, and
field/building requests outside this owner.

Expected movement:
`coverageRefreshContractFilesTouched: 1`,
`newCalculableLayerTemplates: 0`,
`newCalculableRequestShapes: 0`,
`newCalculableTargetOutputs: 0`,
`requiredPhysicalInputsCaptured: 0`,
`runtimeBasisPromotions: 0`,
`runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`.

This is not a broad source crawl, catalog import, formula retune, or
frontend slice. The selected post-refresh action is a fresh
runtime-first route-family rerank so the next step returns to runtime
owner selection instead of chaining support work.
