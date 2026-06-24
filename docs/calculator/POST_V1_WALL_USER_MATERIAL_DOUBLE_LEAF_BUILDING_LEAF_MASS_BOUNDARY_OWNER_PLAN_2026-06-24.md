# Post-V1 Wall User-Material Double-Leaf Building Leaf-Mass Boundary Owner Plan - 2026-06-24

Status:
`post_v1_wall_user_material_double_leaf_building_leaf_mass_boundary_owner_plan_selected_after_runtime_first_rerank`

## Purpose

This runtime-boundary owner follows the no-runtime rerank after the wall
user-material formula required input-surface coverage refresh. It fixes
an owned-input boundary hole: an explicit double-leaf/framed
user/project wall with zero or missing side-leaf surface mass is parked
correctly in element-lab and field contexts, but a complete
`building_prediction` context can be promoted by Gate AR and publish
field/building plus lab-companion values from a false zero-mass direct
curve.

This is not a formula retune, source-row import, manufacturer-rating
copy, broad source crawl, UI change, or metric-label cleanup. The
calculator behavior change is to block the false Gate AR promotion until
the side leaves have positive usable mass.

## Follows

Previous no-runtime coverage refresh action:
`post_v1_wall_user_material_formula_required_input_surface_coverage_refresh_plan`

Previous no-runtime coverage refresh file:
`packages/engine/src/post-v1-wall-user-material-formula-required-input-surface-coverage-refresh-contract.test.ts`

Previous no-runtime coverage refresh status:
`post_v1_wall_user_material_formula_required_input_surface_coverage_refresh_landed_no_runtime_selected_runtime_first_rerank_after_wall_user_material_formula_required_input_surface_coverage_refresh`

Previous no-runtime rerank action:
`post_v1_runtime_first_route_family_rerank_after_wall_user_material_formula_required_input_surface_coverage_refresh_plan`

Previous no-runtime rerank file:
`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-wall-user-material-formula-required-input-surface-coverage-refresh-contract.test.ts`

Previous no-runtime rerank status:
`post_v1_runtime_first_route_family_rerank_after_wall_user_material_formula_required_input_surface_coverage_refresh_landed_no_runtime_selected_wall_user_material_double_leaf_building_leaf_mass_boundary_owner`

Selected owner action:
`post_v1_wall_user_material_double_leaf_building_leaf_mass_boundary_owner_plan`

Selected owner file:
`packages/engine/src/post-v1-wall-user-material-double-leaf-building-leaf-mass-boundary-owner-contract.test.ts`

Selected owner status:
`post_v1_wall_user_material_double_leaf_building_leaf_mass_boundary_owner_landed_runtime_boundary_selected_coverage_refresh`

Selected candidate:
`wall.user_material_double_leaf_building_leaf_mass_boundary_owner`

Selected owner label:
`post-V1 wall user-material double-leaf building leaf-mass boundary owner`

Selected next action:
`post_v1_wall_user_material_double_leaf_building_leaf_mass_boundary_coverage_refresh_plan`

Selected next file:
`packages/engine/src/post-v1-wall-user-material-double-leaf-building-leaf-mass-boundary-coverage-refresh-contract.test.ts`

Selected next plan:
`docs/calculator/POST_V1_WALL_USER_MATERIAL_DOUBLE_LEAF_BUILDING_LEAF_MASS_BOUNDARY_COVERAGE_REFRESH_PLAN_2026-06-24.md`

Selected next label:
`post-V1 wall user-material double-leaf building leaf-mass boundary coverage refresh`

## Selection Card

- User construction / formula family:
  explicit double-leaf/framed wall with user/project panel leaves,
  porous cavity fill, side leaf indices, and complete field/building
  room context, where one or both side leaves resolve to non-positive
  surface mass.
- Target outputs to protect:
  `R'w`, `Dn,w`, `Dn,A`, `DnT,w`, `DnT,A`, `DnT,A,k`, and requested
  lab companions `Rw`, `STC`, `C`, `Ctr`.
- Route:
  existing Gate S double-leaf/framed explicit surface-mass
  `needs_input` boundary must also recognize Gate AR building
  prediction and `DnT,A,k` requests. Gate AR remains valid only after
  side-leaf mass is positive.
- Required physical inputs:
  side A leaf group, side B leaf group, and positive `surfaceMassKgM2`
  for each side leaf, either explicit on the layer or derived from
  valid density and thickness.
- `needs_input` behavior:
  missing or zero side-leaf mass parks all requested wall airborne
  outputs behind `gate_s_double_leaf_framed_explicit_surface_mass_leaf_needs_input`.
- Unsupported boundaries:
  impact aliases stay unsupported; complete positive-mass
  double-leaf/framed building requests stay calculable; no lab value is
  copied into field/building outputs.
- Expected `newCalculableRequestShapes`: 0.
- Expected `newCalculableTargetOutputs`: 0.
- Expected `runtimeBasisPromotions`: 0.
- Expected `runtimeValuesMoved`: 0.
- Expected `falseGateARBuildingRequestShapesBlocked`: 2.
- Expected `targetOutputsMovedToNeedsInput`: 10.

## Planning Iterations

Iteration 1 - runtime-first filter:
the current selected rerank cannot stop at another support loop. Keep
candidates that move runtime support buckets, required input capture, or
metric/basis integrity.

Iteration 2 - live behavior probe:
complete user-material single-leaf and double-leaf/framed building
requests already calculate through owned formulas, including
`DnT,A,k`. Zero-mass single-leaf requests already park. The reproduced
gap is zero-mass explicit double-leaf/framed `building_prediction`,
where Gate AR can publish false values.

Iteration 3 - boundary locality:
the fix belongs in the existing Gate S double-leaf/framed side-leaf mass
guard, not in Gate AR coefficients. Gate AR should remain untouched and
usable for complete positive-mass requests.

Iteration 4 - blast-radius check:
extend the eligible methods to include Gate AR and include `DnT,A,k` in
the boundary output set. Do not change source rows, formulas, material
catalog rows, field/building adapters, or frontend output selection.

## Validation Plan

1. Add
   `packages/engine/src/post-v1-wall-user-material-double-leaf-building-leaf-mass-boundary-owner-contract.test.ts`.
2. Prove zero-mass explicit double-leaf/framed building requests park
   mixed field/building plus lab-companion outputs behind
   `needs_input`.
3. Prove `DnT,A,k`-only building requests are also parked.
4. Re-probe element-lab and field boundaries and complete positive-mass
   building requests.
5. Run the rerank contract, owner contract, previous coverage refresh,
   `git diff --check`, and `pnpm calculator:gate:current` after docs
   and current-gate sync.

## Expected Counters

- `falseGateARBuildingRequestShapesBlocked: 2`
- `targetOutputsMovedToNeedsInput: 10`
- `requiredPhysicalInputsCaptured: 1`
- `newCalculableLayerTemplates: 0`
- `newCalculableRequestShapes: 0`
- `newCalculableTargetOutputs: 0`
- `runtimeBasisPromotions: 0`
- `runtimeValuesMoved 0`
- `runtimeFormulaRetunes: 0`
- `sourceRowsImported: 0`
- `frontendImplementationFilesTouched: 0`
