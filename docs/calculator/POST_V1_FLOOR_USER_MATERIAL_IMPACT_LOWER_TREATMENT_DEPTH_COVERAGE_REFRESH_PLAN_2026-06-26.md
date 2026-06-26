# Post-V1 Floor User-Material Impact Lower-Treatment Depth Coverage Refresh Plan - 2026-06-26

Status:
`post_v1_floor_user_material_impact_lower_treatment_depth_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank_after_floor_user_material_impact_lower_treatment_depth_coverage_refresh`

Coverage refresh action:
`post_v1_floor_user_material_impact_lower_treatment_depth_coverage_refresh_plan`

Coverage refresh file:
`packages/engine/src/post-v1-floor-user-material-impact-lower-treatment-depth-coverage-refresh-contract.test.ts`

Coverage refresh plan:
`docs/calculator/POST_V1_FLOOR_USER_MATERIAL_IMPACT_LOWER_TREATMENT_DEPTH_COVERAGE_REFRESH_PLAN_2026-06-26.md`

Selected by:
`post_v1_floor_user_material_impact_lower_treatment_depth_owner_plan`

Selected by status:
`post_v1_floor_user_material_impact_lower_treatment_depth_owner_landed_runtime_selected_coverage_refresh`

Previous owner file:
`packages/engine/src/post-v1-floor-user-material-impact-lower-treatment-depth-owner-contract.test.ts`

Previous owner plan:
`docs/calculator/POST_V1_FLOOR_USER_MATERIAL_IMPACT_LOWER_TREATMENT_DEPTH_OWNER_PLAN_2026-06-26.md`

Owner selected by rerank:
`post_v1_runtime_first_route_family_rerank_after_opening_facade_outdoor_indoor_oitc_metric_schema_and_adapter_bridge_coverage_refresh_plan`
/
`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-opening-facade-outdoor-indoor-oitc-metric-schema-and-adapter-bridge-coverage-refresh-contract.test.ts`
/
`post_v1_runtime_first_route_family_rerank_after_opening_facade_outdoor_indoor_oitc_metric_schema_and_adapter_bridge_coverage_refresh_landed_no_runtime_selected_floor_user_material_impact_lower_treatment_depth_owner`

Selected candidate:
`floor.user_material_impact_lower_treatment_depth_owner`

Selected label:
`post-V1 floor user-material impact lower-treatment depth coverage refresh`

Selected next action:
`post_v1_runtime_first_route_family_rerank_after_floor_user_material_impact_lower_treatment_depth_coverage_refresh_plan`

Selected next file:
`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-floor-user-material-impact-lower-treatment-depth-coverage-refresh-contract.test.ts`

Selected next plan:
`docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_FLOOR_USER_MATERIAL_IMPACT_LOWER_TREATMENT_DEPTH_COVERAGE_REFRESH_PLAN_2026-06-26.md`

Selected next label:
`post-V1 runtime-first route-family rerank after floor user-material impact lower-treatment depth coverage refresh`

## Coverage Refresh Card

User construction / formula family:
custom/user-material reinforced-concrete floor impact stacks with an
upper floating layer and visible lower treatment. The owner opened a
custom tagged lower ceiling support material, lower cavity depth,
ceiling fill, and ceiling board schedule into the heavy-concrete
combined upper/lower formula corridor.

Target outputs to keep protected:
`Ln,w`, `DeltaLw`, `L'n,w`, and `L'nT,w`.

Route to re-probe:
`predictor_heavy_combined_upper_lower_floor_iso12354_annexc_estimate`
for the lab anchor, followed by the existing field impact adapter only
when `impactFieldContext.fieldKDb` and `receivingRoomVolumeM3` are
available.

Required physical inputs to keep captured:
- visible or inferred lower-treatment support/cavity layer;
- lower cavity depth;
- lower fill and board layers;
- resilient layer dynamic stiffness;
- floating/load surface mass;
- `impactFieldContext` for field outputs.

`needs_input` behavior to keep pinned:
missing field context blocks `L'n,w` / `L'nT,w`; missing dynamic
stiffness blocks the combined ISO impact route; missing lower support
must keep the combined upper/lower formula corridor parked rather than
falling back to a false lower-treatment calculation.

`unsupported` boundaries to keep pinned:
`IIC`/`AIIC`, OITC, airborne aliases, source-row proximity
substitution, and field outputs without field context remain blocked.

Closeout movement:
`coverageRefreshContractFilesTouched: 1`,
`newCalculableLayerTemplates: 0`,
`newCalculableRequestShapes: 0`,
`newCalculableTargetOutputs: 0`,
`requiredPhysicalInputsCaptured: 0`,
`runtimeBasisPromotions: 0`,
`runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`,
`frontendImplementationFilesTouched: 0`.

This refresh is not a broad source crawl, formula retune, catalog
import, or frontend slice. It exists to protect the runtime scope opened
by the owner before the next runtime-first rerank.

## Owner Runtime Closeout To Re-Probe

The landed owner opened a custom user-material floor stack:
150 mm user heavy concrete, 8 mm user resilient underlay with
`dynamicStiffnessMNm3 30`, 50 mm user screed, 8 mm tile, a 90 mm
custom tagged `ceiling-support` / `clip` lower support, 80 mm lower
fill, and two 13 mm user ceiling board layers.

Complete lab requests now calculate `Ln,w 43.6` and `DeltaLw 30.9` on
`predictor_heavy_combined_upper_lower_floor_iso12354_annexc_estimate`.
Field-only requests for `L'n,w` / `L'nT,w` now use the same hidden lab
anchor and publish `L'n,w 45.6` and `L'nT,w 43.2`, instead of falling
back to the bare heavy slab `Ln,w 74.5` path. Mixed lab/field requests
keep all four outputs target-output independent.

Counters from the owner:
`newCalculableLayerTemplates: 1`,
`newCalculableRequestShapes: 3`,
`newCalculableTargetOutputs: 4`,
`requiredPhysicalInputsCaptured: 2`,
`runtimeBasisPromotions: 3`,
`runtimeValuesMoved 8`,
`runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`,
`frontendImplementationFilesTouched: 0`, and
`unsupportedBoundariesProtected: 7`.

Selected next after this coverage refresh should be a fresh
runtime-first route-family rerank:
`post_v1_runtime_first_route_family_rerank_after_floor_user_material_impact_lower_treatment_depth_coverage_refresh_plan`
/
`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-floor-user-material-impact-lower-treatment-depth-coverage-refresh-contract.test.ts`
/
`docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_FLOOR_USER_MATERIAL_IMPACT_LOWER_TREATMENT_DEPTH_COVERAGE_REFRESH_PLAN_2026-06-26.md`.
