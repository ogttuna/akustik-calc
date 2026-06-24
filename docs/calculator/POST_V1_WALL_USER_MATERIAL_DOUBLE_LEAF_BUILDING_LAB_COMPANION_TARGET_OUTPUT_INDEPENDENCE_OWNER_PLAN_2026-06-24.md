# Post-V1 Wall User-Material Double-Leaf Building Lab Companion Target-Output Independence Owner Plan - 2026-06-24

Status:
`post_v1_wall_user_material_double_leaf_building_lab_companion_target_output_independence_owner_landed_runtime_accuracy_selected_coverage_refresh`

## Purpose

This runtime/accuracy owner follows the runtime-first rerank after the
wall user-material double-leaf building leaf-mass boundary coverage
refresh. The previous owner made the route safe by blocking zero or
missing side-leaf mass. This owner improves the complete positive-mass
route: a user/project double-leaf/framed wall in `building_prediction`
mode must expose the same `Rw`, `STC`, `C`, and `Ctr` lab companion
metrics whether the user asks for one lab output, one field/building
output, or the mixed output set.

This is not a formula retune, source-row import, manufacturer-rating
copy, catalog expansion, broad source crawl, UI change, or confidence
wording task. The values remain source-absent formula predictions from
the owned direct curve.

## Follows

Previous no-runtime coverage refresh action:
`post_v1_wall_user_material_double_leaf_building_leaf_mass_boundary_coverage_refresh_plan`

Previous no-runtime coverage refresh file:
`packages/engine/src/post-v1-wall-user-material-double-leaf-building-leaf-mass-boundary-coverage-refresh-contract.test.ts`

Previous no-runtime coverage refresh status:
`post_v1_wall_user_material_double_leaf_building_leaf_mass_boundary_coverage_refresh_landed_no_runtime_selected_runtime_first_rerank_after_wall_user_material_double_leaf_building_leaf_mass_boundary_coverage_refresh`

Previous no-runtime rerank action:
`post_v1_runtime_first_route_family_rerank_after_wall_user_material_double_leaf_building_leaf_mass_boundary_coverage_refresh_plan`

Previous no-runtime rerank file:
`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-wall-user-material-double-leaf-building-leaf-mass-boundary-coverage-refresh-contract.test.ts`

Previous no-runtime rerank status:
`post_v1_runtime_first_route_family_rerank_after_wall_user_material_double_leaf_building_leaf_mass_boundary_coverage_refresh_landed_no_runtime_selected_wall_user_material_double_leaf_building_lab_companion_target_output_independence_owner`

Previous no-runtime rerank counters:
`candidateCount: 7`, `roiAnalysisIterations: 4`,
`estimatedNextAccuracyPromotedRequestShapes: 10`,
`estimatedNextTargetOutputIndependentMetricSets: 10`,
`estimatedNextRuntimeValuesMoved: 40`,
`estimatedNextCalculableRequestShapes: 0`,
`estimatedNextCalculableTargetOutputs: 0`, `runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`.

Selected owner action:
`post_v1_wall_user_material_double_leaf_building_lab_companion_target_output_independence_owner_plan`

Selected owner file:
`packages/engine/src/post-v1-wall-user-material-double-leaf-building-lab-companion-target-output-independence-owner-contract.test.ts`

Selected owner status:
`post_v1_wall_user_material_double_leaf_building_lab_companion_target_output_independence_owner_landed_runtime_accuracy_selected_coverage_refresh`

Selected candidate:
`wall.user_material_double_leaf_building_lab_companion_target_output_independence_owner`

Selected owner label:
`post-V1 wall user-material double-leaf building lab-companion target-output independence owner`

Selected next action:
`post_v1_wall_user_material_double_leaf_building_lab_companion_target_output_independence_coverage_refresh_plan`

Selected next file:
`packages/engine/src/post-v1-wall-user-material-double-leaf-building-lab-companion-target-output-independence-coverage-refresh-contract.test.ts`

Selected next plan:
`docs/calculator/POST_V1_WALL_USER_MATERIAL_DOUBLE_LEAF_BUILDING_LAB_COMPANION_TARGET_OUTPUT_INDEPENDENCE_COVERAGE_REFRESH_PLAN_2026-06-24.md`

Selected next label:
`post-V1 wall user-material double-leaf building lab-companion target-output independence coverage refresh`

## Selection Card

- User construction / formula family:
  explicit user/project double-leaf/framed wall with positive
  side-leaf surface mass, porous cavity fill, side leaf indices, and
  complete `building_prediction` context.
- Target outputs to improve:
  single and mixed requests across `Rw`, `STC`, `C`, `Ctr`, `R'w`,
  `Dn,w`, `Dn,A`, `DnT,w`, `DnT,A`, and `DnT,A,k`.
- Route:
  Gate AR building prediction over the owned user-material
  double-leaf/framed direct curve. The lab companions come from that
  direct curve; field/building values stay from Gate AR.
- Required physical inputs:
  side A leaf group, side B leaf group, positive side-leaf
  `surfaceMassKgM2`, cavity depth, porous absorber flow resistivity or
  owned material default, support topology, support spacing, room
  volumes, partition dimensions, RT60, flanking class, coupling length,
  and building output basis.
- `needs_input` behavior:
  missing or zero side-leaf mass remains parked behind
  `gate_s_double_leaf_framed_explicit_surface_mass_leaf_needs_input`.
- Unsupported boundaries:
  impact aliases stay unsupported; unrequested outputs are not added to
  `supportedTargetOutputs`; no lab source value is copied into
  field/building values; no manufacturer rating is imported.
- Expected `newCalculableRequestShapes`: 0.
- Expected `newCalculableTargetOutputs`: 0.
- Expected `runtimeBasisPromotions`: 0.
- Expected `runtimeValuesMoved`: 40.
- Expected `accuracyPromotedRequestShapes`: 10.
- Expected `targetOutputIndependentMetricSets`: 10.

## Planning Iterations

Iteration 1 - current lane check:
the missing leaf-mass boundary is landed and covered. The next owner
must move runtime accuracy or metric integrity, not another support-only
refresh.

Iteration 2 - live behavior probe:
complete positive-mass building requests calculate through Gate AR, but
single-output probes exposed inconsistent visible `Rw`, `STC`, `C`, and
`Ctr` companion metrics compared with the mixed output request.

Iteration 3 - ROI and blast-radius filter:
normalizing companions from the already selected direct curve has a
small implementation surface, no source evidence dependency, and
improves every single-output request shape in the complete user-material
double-leaf building family.

Iteration 4 - boundary check:
support movement must stay request-scoped. The owner may normalize the
visible metric payload but must not widen `supportedTargetOutputs` or
promote missing-input, impact, or catalog-rating routes.

## Validation Plan

1. Add
   `packages/engine/src/post-v1-wall-user-material-double-leaf-building-lab-companion-target-output-independence-owner-contract.test.ts`.
2. Prove mixed and single requests across all ten target outputs share
   `Rw 46`, `STC 46`, `C -1`, and `Ctr -6.1` from the same direct
   curve.
3. Prove single-output requests keep only the requested output in
   `supportedTargetOutputs`.
4. Re-probe zero-mass `needs_input` and impact unsupported boundaries.
5. Run the rerank, owner, previous owner/coverage tests, and
   `git diff --check`.

## Landed Counters

- `accuracyPromotedRequestShapes: 10`
- `targetOutputIndependentMetricSets: 10`
- `runtimeValuesMoved 40`
- `newCalculableLayerTemplates: 0`
- `newCalculableRequestShapes: 0`
- `newCalculableTargetOutputs: 0`
- `runtimeBasisPromotions: 0`
- `requiredPhysicalInputsCaptured: 0`
- `runtimeFormulaRetunes: 0`
- `sourceRowsImported: 0`
- `frontendImplementationFilesTouched: 0`
