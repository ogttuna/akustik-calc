# Post-V1 Runtime-First Route-Family Rerank After Ceiling Single-Leaf Airborne Route Coverage Refresh - 2026-06-26

Status:
`post_v1_runtime_first_route_family_rerank_after_ceiling_single_leaf_airborne_route_coverage_refresh_landed_no_runtime_selected_ceiling_single_leaf_field_building_context_adapter_owner`

Rerank action:
`post_v1_runtime_first_route_family_rerank_after_ceiling_single_leaf_airborne_route_coverage_refresh_plan`

Rerank file:
`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-ceiling-single-leaf-airborne-route-coverage-refresh-contract.test.ts`

Rerank plan:
`docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_CEILING_SINGLE_LEAF_AIRBORNE_ROUTE_COVERAGE_REFRESH_PLAN_2026-06-26.md`

Selected by:
`post_v1_ceiling_single_leaf_airborne_route_coverage_refresh_plan`
/
`packages/engine/src/post-v1-ceiling-single-leaf-airborne-route-coverage-refresh-contract.test.ts`

Selected by status:
`post_v1_ceiling_single_leaf_airborne_route_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank_after_ceiling_single_leaf_airborne_route_coverage_refresh`

Previous coverage refresh recap:
`coverageRefreshContractFilesTouched: 1`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.
The re-probed ceiling lab pins stayed `Rw 34`, `STC 34`, `C 3.7`,
and `Ctr 8`.

Previous owner:
`post_v1_ceiling_single_leaf_airborne_route_owner_plan`

Previous owner file:
`packages/engine/src/post-v1-ceiling-single-leaf-airborne-route-owner-contract.test.ts`

Previous owner status:
`post_v1_ceiling_single_leaf_airborne_route_owner_landed_runtime_basis_selected_coverage_refresh`

Previous owner selected by rerank:
`post_v1_runtime_first_route_family_rerank_after_floor_user_material_impact_lower_treatment_depth_coverage_refresh_plan`

Previous owner selected by rerank file:
`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-floor-user-material-impact-lower-treatment-depth-coverage-refresh-contract.test.ts`

Previous owner selected by rerank status:
`post_v1_runtime_first_route_family_rerank_after_floor_user_material_impact_lower_treatment_depth_coverage_refresh_landed_no_runtime_selected_ceiling_single_leaf_airborne_route_owner`

Previous selected candidate:
`ceiling.single_leaf_airborne_mass_law.source_absent`

Selected candidate:
`ceiling.single_leaf_field_building_context_adapter_owner`

Selected next action:
`post_v1_ceiling_single_leaf_field_building_context_adapter_owner_plan`

Selected next file:
`packages/engine/src/post-v1-ceiling-single-leaf-field-building-context-adapter-owner-contract.test.ts`

Selected next plan:
`docs/calculator/POST_V1_CEILING_SINGLE_LEAF_FIELD_BUILDING_CONTEXT_ADAPTER_OWNER_PLAN_2026-06-26.md`

Selected next label:
`post-V1 ceiling single-leaf field/building context adapter owner`

## Selection Card

- User construction / formula family: ceiling-only gypsum-board
  single-leaf stacks with explicit field-between-rooms or building
  prediction context.
- Target outputs to open: `R'w`, `Dn,w`, `Dn,A`, `DnT,w`, `DnT,A`,
  and `DnT,A,k` on route `ceiling`.
- Route: owned direct ceiling single-leaf transmission-loss curve,
  existing field overlay, and ISO 12354-1 building-prediction corridor,
  published through route-specific ceiling resolver candidates.
- Required physical inputs: ceiling-only layer roles, panel area or
  width/height, receiving-room volume, receiving-room RT60, source-room
  volume for building prediction, flanking junction class, conservative
  flanking assumption, and junction coupling length.
- `needs_input` behavior: missing room or flanking context must remain
  `needs_input`/unsupported instead of defaulting.
- `unsupported` boundaries: no floor impact alias, no ASTM IIC/AIIC
  alias, no OITC value before an outdoor-indoor rating adapter, no lab
  Rw/STC copy into field/building values, and no broad source-row
  proximity import.
- Expected movement for the selected owner:
  `newCalculableRequestShapes: 2`,
  `newCalculableTargetOutputs: 6`,
  `runtimeBasisPromotions: 2`, and `runtimeValuesMoved 11`.

## Rerank Result

Fresh current-state probing showed that explicit ASTM E989 exact-band
IIC/AIIC is already live on the accepted estimate and impact-only
surfaces, while OITC still lacks the outdoor-indoor rating adapter
needed to publish a value without aliasing STC, Rw, NISR/ISR, or indoor
field metrics.

The highest safe runtime-first scope move after the ceiling lab route is
therefore the ceiling field/building context adapter owner. Complete
ceiling-only field/building requests already have the direct curve and
normalization machinery available, but they need route-owned resolver
candidates so the calculator publishes the values on `route=ceiling`
with explicit field/building basis instead of falling through floor or
wall ownership.

Counters: `candidateCount: 8`, `roiAnalysisIterations: 4`,
`estimatedNextCalculableRequestShapes: 2`,
`estimatedNextCalculableTargetOutputs: 6`,
`estimatedNextRequiredPhysicalInputsCaptured: 3`,
`estimatedNextRuntimeBasisPromotions: 2`,
`estimatedNextRuntimeValuesMoved: 11`,
`estimatedNextUnsupportedBoundariesProtected: 6`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.

This is not a broad source crawl, catalog import, formula retune, or
frontend slice.
