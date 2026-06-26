# Post-V1 Runtime-First Route-Family Rerank After Floor User-Material Impact Lower-Treatment Depth Coverage Refresh - 2026-06-26

Status:
`post_v1_runtime_first_route_family_rerank_after_floor_user_material_impact_lower_treatment_depth_coverage_refresh_landed_no_runtime_selected_ceiling_single_leaf_airborne_route_owner`

Rerank action:
`post_v1_runtime_first_route_family_rerank_after_floor_user_material_impact_lower_treatment_depth_coverage_refresh_plan`

Rerank file:
`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-floor-user-material-impact-lower-treatment-depth-coverage-refresh-contract.test.ts`

Rerank plan:
`docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_FLOOR_USER_MATERIAL_IMPACT_LOWER_TREATMENT_DEPTH_COVERAGE_REFRESH_PLAN_2026-06-26.md`

Selected by:
`post_v1_floor_user_material_impact_lower_treatment_depth_coverage_refresh_plan`

Selected by status:
`post_v1_floor_user_material_impact_lower_treatment_depth_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank_after_floor_user_material_impact_lower_treatment_depth_coverage_refresh`

Previous coverage refresh file:
`packages/engine/src/post-v1-floor-user-material-impact-lower-treatment-depth-coverage-refresh-contract.test.ts`

Previous coverage refresh plan:
`docs/calculator/POST_V1_FLOOR_USER_MATERIAL_IMPACT_LOWER_TREATMENT_DEPTH_COVERAGE_REFRESH_PLAN_2026-06-26.md`

Previous runtime owner:
`post_v1_floor_user_material_impact_lower_treatment_depth_owner_plan`
/
`packages/engine/src/post-v1-floor-user-material-impact-lower-treatment-depth-owner-contract.test.ts`
/
`docs/calculator/POST_V1_FLOOR_USER_MATERIAL_IMPACT_LOWER_TREATMENT_DEPTH_OWNER_PLAN_2026-06-26.md`
/
`post_v1_floor_user_material_impact_lower_treatment_depth_owner_landed_runtime_selected_coverage_refresh`

Owner selected by:
`post_v1_runtime_first_route_family_rerank_after_opening_facade_outdoor_indoor_oitc_metric_schema_and_adapter_bridge_coverage_refresh_plan`
/
`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-opening-facade-outdoor-indoor-oitc-metric-schema-and-adapter-bridge-coverage-refresh-contract.test.ts`
/
`post_v1_runtime_first_route_family_rerank_after_opening_facade_outdoor_indoor_oitc_metric_schema_and_adapter_bridge_coverage_refresh_landed_no_runtime_selected_floor_user_material_impact_lower_treatment_depth_owner`

Previous selected candidate:
`floor.user_material_impact_lower_treatment_depth_owner`

## Purpose

The floor user-material impact lower-treatment depth owner has moved
runtime values and the coverage refresh now protects those values. This
rerank is the next required current-state comparison. It must not
repeat the landed floor lower-treatment owner, and it must not select a
support-only prerequisite unless no safe value-moving runtime owner is
currently ready.

The rerank should compare route families against the current industry
calculator goal:

- more arbitrary user-entered constructions calculated through owned
  formulas;
- more target outputs on the correct metric/basis;
- better required input capture and `needs_input` behavior;
- no aliasing across ISO/ASTM, lab/field/building, indoor/outdoor, or
  source-row boundaries.

## Current Protected Floor Runtime

The landed owner opened a custom user-material reinforced-concrete
upper/lower floor impact stack. Complete lab requests calculate
`Ln,w 43.6` and `DeltaLw 30.9` on
`predictor_heavy_combined_upper_lower_floor_iso12354_annexc_estimate`.
Field-only requests use the same hidden combined lab anchor and publish
`L'n,w 45.6` and `L'nT,w 43.2`. Missing field context, missing dynamic
stiffness, and missing lower support/cavity remain `needs_input`.
`IIC`/`AIIC`, OITC, airborne aliases, and source-row proximity
substitution remain blocked.

Owner counters:
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

Coverage refresh counters:
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

The coverage refresh is not a broad source crawl, formula retune,
catalog import, or frontend slice.

## Rerank Candidate Set To Re-Assess

The next agent should re-run the candidate comparison instead of
blindly following stale selected-next prose. Minimum candidates to
compare:

- `opening.facade_outdoor_indoor_oitc_direct_spectral_runtime_owner`:
  high user-visible target output, but unsafe until the OITC rating
  adapter and outdoor-indoor contour basis are physically owned.
- `opening.facade_outdoor_indoor_oitc_rating_adapter_basis_owner`:
  valid prerequisite for OITC, but likely support-only unless it can
  also move a real OITC value.
- `ceiling.first_class_airborne_or_impact_route_owner`: strategic
  coverage gap because standalone ceilings are not yet first-class
  calculator constructions.
- `floor.astm_iic_aiic_rating_adapter_owner`: relevant for North
  American impact coverage, but must not alias ISO `Ln,w` or `DeltaLw`
  to ASTM `IIC`/`AIIC`.
- `opening.facade_door_window_user_material_opening_element_owner`:
  broad opening/facade user-material scope, but must have a spectral
  owner instead of scalar STC/Rw shortcuts.
- `wall.double_leaf_or_multileaf_user_material_frequency_backbone_owner`:
  useful if it opens additional arbitrary wall stacks with frequency
  output ownership rather than another lab-companion hygiene slice.
- `floor.user_material_impact_lower_treatment_depth_owner`: already
  landed; reject stale repeat unless a distinct adjacent runtime owner
  is named.

## Selection Rules

Select the candidate with the best combination of:

- value-moving runtime behavior;
- physically owned formula or adapter route;
- route-required user input capture;
- target-output expansion;
- explicit unsupported boundaries.

Reject candidates that would:

- copy lab values into field/building outputs;
- alias ISO impact to ASTM impact ratings;
- claim OITC from STC, Rw, NISR/ISR, or indoor partition metrics;
- use source rows as generic nearby substitutions;
- reopen a landed owner with no new calculable request shape.

Expected rerank movement:
`candidateCount` at least `7`, `roiAnalysisIterations` at least `4`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.

The selected next action after this rerank must be a runtime,
accuracy, or input-surface owner unless the contract documents why no
safe value-moving owner is available.

## Closeout - 2026-06-26

The rerank is landed as a no-runtime selection slice. It rejected stale
floor lower-treatment repetition, direct OITC runtime without an owned
outdoor-indoor rating contour, support-only OITC adapter work, arbitrary
ISO-to-ASTM impact aliasing, and already-landed opening/wall frequency
owners. The selected value-moving candidate is:

`ceiling.single_leaf_airborne_route_owner`

Selected next action:
`post_v1_ceiling_single_leaf_airborne_route_owner_plan`

Selected next file:
`packages/engine/src/post-v1-ceiling-single-leaf-airborne-route-owner-contract.test.ts`

Selected next plan:
`docs/calculator/POST_V1_CEILING_SINGLE_LEAF_AIRBORNE_ROUTE_OWNER_PLAN_2026-06-26.md`

Selected next label:
`post-V1 ceiling single-leaf airborne route owner`

The selected owner targets standalone ceiling-only gypsum-board
single-leaf airborne requests. Expected movement:
`candidateCount: 7`, `roiAnalysisIterations: 4`,
`estimatedNextCalculableRequestShapes: 1`,
`estimatedNextCalculableTargetOutputs: 4`,
`estimatedNextRequiredPhysicalInputsCaptured: 1`,
`estimatedNextRuntimeBasisPromotions: 1`,
`estimatedNextRuntimeValuesMoved: 4`,
`estimatedNextUnsupportedBoundariesProtected: 5`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.

The rerank is not a broad source crawl, catalog import, formula retune,
or frontend slice.
