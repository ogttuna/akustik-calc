# Post-V1 Runtime-First Rerank After Wall User-Material Formula Required Input Surface Coverage Refresh Plan - 2026-06-24

Status:
`post_v1_runtime_first_route_family_rerank_after_wall_user_material_formula_required_input_surface_coverage_refresh_landed_no_runtime_selected_wall_user_material_double_leaf_building_leaf_mass_boundary_owner`

## Purpose

This is the selected next support step after the no-runtime
`post_v1_wall_user_material_formula_required_input_surface_coverage_refresh_plan`.
It must select the next high-ROI runtime/input-surface owner for the
calculator. It is not permission to retune formulas, import acoustic
source rows, copy manufacturer ratings, broaden UI scope, or continue
support work for its own sake.

The previous owner improved arbitrary source-absent user wall stacks by
keeping complete user-material formula routes calculable while parking
zero-mass leaves behind explicit required input. The coverage refresh
then re-probed that behavior with no runtime value movement.

## Follows

Previous no-runtime coverage refresh action:
`post_v1_wall_user_material_formula_required_input_surface_coverage_refresh_plan`

Previous no-runtime coverage refresh file:
`packages/engine/src/post-v1-wall-user-material-formula-required-input-surface-coverage-refresh-contract.test.ts`

Previous no-runtime coverage refresh status:
`post_v1_wall_user_material_formula_required_input_surface_coverage_refresh_landed_no_runtime_selected_runtime_first_rerank_after_wall_user_material_formula_required_input_surface_coverage_refresh`

Current selected next action:
`post_v1_runtime_first_route_family_rerank_after_wall_user_material_formula_required_input_surface_coverage_refresh_plan`

Current selected next file:
`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-wall-user-material-formula-required-input-surface-coverage-refresh-contract.test.ts`

Current selected next plan:
`docs/calculator/POST_V1_RUNTIME_FIRST_RERANK_AFTER_WALL_USER_MATERIAL_FORMULA_REQUIRED_INPUT_SURFACE_COVERAGE_REFRESH_PLAN_2026-06-24.md`

Current selected next label:
`post-V1 runtime-first route-family rerank after wall user-material formula required input surface coverage refresh`

## Selection Card

- User construction / formula family:
  rerank across runtime-first wall/floor/opening families after the
  user-material input-surface owner, with priority on arbitrary
  user-entered stacks where owned formulas or precise required inputs
  can move real calculator behavior.
- Target outputs to consider:
  airborne wall `Rw`, `STC`, `C`, `Ctr`, `R'w`, `Dn,w`, `Dn,A`,
  `DnT,w`, `DnT,A`, `DnT,A,k`; impact `Ln,w`, `DeltaLw`, `IIC`, and
  `AIIC` only where the family has a physically owned route.
- Candidate route types:
  exact measured row only on exact construction/basis match,
  same-family bounded delta only with admissible evidence, otherwise an
  owned physics/formula route with route-required inputs.
- Required physical inputs:
  surface mass, density and thickness, topology, support spacing,
  cavity depth, absorber flow resistivity or owned safe-default posture,
  opening/leak geometry, room volume, area, reverberation basis, load
  basis, dynamic stiffness, and other route-specific context as needed.
- `needs_input` behavior:
  missing route-critical inputs must be explicit and grouped by route;
  do not silently default unknown mass, field context, impact load basis,
  opening geometry, or flanking context.
- `unsupported` boundaries:
  manufacturer headline ratings, nearby source rows without bounded
  deltas, lab-to-field/building copying without adapters, impact aliases
  on airborne-only routes, and UI-only cleanup remain blocked.
- Expected `newCalculableRequestShapes`: 0.
- Expected `newCalculableTargetOutputs`: 0.
- Expected `runtimeBasisPromotions`: 0.
- Expected `runtimeValuesMoved`: 0.
- Expected `falseGateARBuildingRequestShapesBlocked`: 2.
- Expected `targetOutputsMovedToNeedsInput`: 10.

## Selected Runtime Owner

Selected candidate:
`wall.user_material_double_leaf_building_leaf_mass_boundary_owner`

Selected next action:
`post_v1_wall_user_material_double_leaf_building_leaf_mass_boundary_owner_plan`

Selected next file:
`packages/engine/src/post-v1-wall-user-material-double-leaf-building-leaf-mass-boundary-owner-contract.test.ts`

Selected next plan:
`docs/calculator/POST_V1_WALL_USER_MATERIAL_DOUBLE_LEAF_BUILDING_LEAF_MASS_BOUNDARY_OWNER_PLAN_2026-06-24.md`

Selected next label:
`post-V1 wall user-material double-leaf building leaf-mass boundary owner`

The selected owner blocks an explicit double-leaf/framed user/project
wall with missing or zero side-leaf mass from being promoted by Gate AR
in `building_prediction` mode. It keeps complete positive-mass
double-leaf/framed building requests calculable and does not retune Gate
AR.

## Planning Iterations

Iteration 1 - runtime-first filter:
reject candidates whose primary output is documentation, broad catalog
growth, frontend polish, confidence wording, or source crawling. Keep
only candidates that can open or protect calculator behavior.

Iteration 2 - evidence/basis filter:
prefer exact rows only when construction identity and basis match.
Reject nearby source-row deltas unless same-family, same-basis evidence
and an owned bounded delta rule exist.

Iteration 3 - formula-route ROI:
rank owned formula families by how many arbitrary user-entered stacks
gain calculable outputs or precise `needs_input` surfaces. Prefer
families with existing route scaffolding and clear physical inputs.

Iteration 4 - risk/boundary check:
select a slice whose unsupported neighbors can be explicitly blocked in
the same contract, with `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and no lab-to-field/building aliasing unless
an owned adapter is involved.

## Validation Plan

1. Add
   `packages/engine/src/post-v1-runtime-first-route-family-rerank-after-wall-user-material-formula-required-input-surface-coverage-refresh-contract.test.ts`.
2. Encode the candidate list, ROI iterations, selected runtime owner,
   expected counters, and no-go boundaries.
3. Update live docs to point from this rerank to the selected runtime
   owner.
4. Run the rerank contract, the just-landed coverage refresh, the
   selected owner contract, `git diff --check`, and then
   `pnpm calculator:gate:current` after current-gate sync changes.

## Landed Counters

- `candidateCount: 7`
- `roiAnalysisIterations: 4`
- `estimatedNextIncorrectRuntimeRequestShapesBlocked: 2`
- `estimatedNextTargetOutputsParked: 10`
- `estimatedNextRequiredPhysicalInputsCaptured: 1`
- `estimatedNextCalculableRequestShapes: 0`
- `estimatedNextCalculableTargetOutputs: 0`
- `runtimeValuesMoved 0`
- `runtimeFormulaRetunes: 0`
- `sourceRowsImported: 0`
- `frontendImplementationFilesTouched: 0`
