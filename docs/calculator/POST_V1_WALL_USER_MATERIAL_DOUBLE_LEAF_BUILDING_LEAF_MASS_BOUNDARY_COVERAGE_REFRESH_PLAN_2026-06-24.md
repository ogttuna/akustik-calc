# Post-V1 Wall User-Material Double-Leaf Building Leaf-Mass Boundary Coverage Refresh Plan - 2026-06-24

Status:
`post_v1_wall_user_material_double_leaf_building_leaf_mass_boundary_coverage_refresh_landed_no_runtime_selected_runtime_first_rerank_after_wall_user_material_double_leaf_building_leaf_mass_boundary_coverage_refresh`

## Purpose

This is the selected follow-up coverage refresh after the runtime
boundary owner:
`post_v1_wall_user_material_double_leaf_building_leaf_mass_boundary_owner_plan`.
It should re-probe the zero-mass explicit double-leaf/framed
`building_prediction` boundary without changing runtime values.

The refresh must keep complete positive-mass user-material
double-leaf/framed building requests calculable through Gate AR while
keeping missing side-leaf mass parked behind Gate S `needs_input` for
`R'w`, `Dn,w`, `Dn,A`, `DnT,w`, `DnT,A`, `DnT,A,k`, `Rw`, `STC`, `C`,
and `Ctr`.

## Follows

Previous no-runtime rerank action:
`post_v1_runtime_first_route_family_rerank_after_wall_user_material_formula_required_input_surface_coverage_refresh_plan`

Previous no-runtime rerank file:
`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-wall-user-material-formula-required-input-surface-coverage-refresh-contract.test.ts`

Previous no-runtime rerank status:
`post_v1_runtime_first_route_family_rerank_after_wall_user_material_formula_required_input_surface_coverage_refresh_landed_no_runtime_selected_wall_user_material_double_leaf_building_leaf_mass_boundary_owner`

Previous runtime owner action:
`post_v1_wall_user_material_double_leaf_building_leaf_mass_boundary_owner_plan`

Previous runtime owner file:
`packages/engine/src/post-v1-wall-user-material-double-leaf-building-leaf-mass-boundary-owner-contract.test.ts`

Previous runtime owner status:
`post_v1_wall_user_material_double_leaf_building_leaf_mass_boundary_owner_landed_runtime_boundary_selected_coverage_refresh`

Previous runtime owner selected candidate:
`wall.user_material_double_leaf_building_leaf_mass_boundary_owner`

Current coverage refresh action:
`post_v1_wall_user_material_double_leaf_building_leaf_mass_boundary_coverage_refresh_plan`

Current coverage refresh file:
`packages/engine/src/post-v1-wall-user-material-double-leaf-building-leaf-mass-boundary-coverage-refresh-contract.test.ts`

Current coverage refresh label:
`post-V1 wall user-material double-leaf building leaf-mass boundary coverage refresh`

Selected next action:
`post_v1_runtime_first_route_family_rerank_after_wall_user_material_double_leaf_building_leaf_mass_boundary_coverage_refresh_plan`

Selected next file:
`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-wall-user-material-double-leaf-building-leaf-mass-boundary-coverage-refresh-contract.test.ts`

Selected next plan:
`docs/calculator/POST_V1_RUNTIME_FIRST_RERANK_AFTER_WALL_USER_MATERIAL_DOUBLE_LEAF_BUILDING_LEAF_MASS_BOUNDARY_COVERAGE_REFRESH_PLAN_2026-06-24.md`

Selected next label:
`post-V1 runtime-first route-family rerank after wall user-material double-leaf building leaf-mass boundary coverage refresh`

## Refresh Scope

- Re-probe zero-mass double-leaf/framed building mixed outputs.
- Re-probe zero-mass double-leaf/framed `DnT,A,k`-only building output.
- Re-probe adjacent element-lab and field missing-mass boundaries.
- Re-probe complete positive-mass double-leaf/framed building outputs.
- Keep impact aliases, source-row imports, formula retunes,
  manufacturer ratings, and UI work out of scope.

## Expected Counters

- `coverageRefreshContractFilesTouched: 1`
- `newCalculableLayerTemplates: 0`
- `newCalculableRequestShapes: 0`
- `newCalculableTargetOutputs: 0`
- `runtimeBasisPromotions: 0`
- `runtimeValuesMoved 0`
- `runtimeFormulaRetunes: 0`
- `sourceRowsImported: 0`
- `frontendImplementationFilesTouched: 0`
