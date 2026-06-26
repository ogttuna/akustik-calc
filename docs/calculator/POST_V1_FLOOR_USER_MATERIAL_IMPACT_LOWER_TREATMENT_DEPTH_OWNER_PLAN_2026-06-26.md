# Post-V1 Floor User-Material Impact Lower-Treatment Depth Owner Plan - 2026-06-26

Plan id:
`post_v1_floor_user_material_impact_lower_treatment_depth_owner_plan`

Status:
`post_v1_floor_user_material_impact_lower_treatment_depth_owner_landed_runtime_selected_coverage_refresh`

Selected by:
`post_v1_runtime_first_route_family_rerank_after_opening_facade_outdoor_indoor_oitc_metric_schema_and_adapter_bridge_coverage_refresh_plan`

Selected by file:
`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-opening-facade-outdoor-indoor-oitc-metric-schema-and-adapter-bridge-coverage-refresh-contract.test.ts`

Selected by status:
`post_v1_runtime_first_route_family_rerank_after_opening_facade_outdoor_indoor_oitc_metric_schema_and_adapter_bridge_coverage_refresh_landed_no_runtime_selected_floor_user_material_impact_lower_treatment_depth_owner`

Previous coverage refresh:
`post_v1_opening_facade_outdoor_indoor_oitc_metric_schema_and_adapter_bridge_coverage_refresh_plan`

Previous coverage refresh status:
`post_v1_opening_facade_outdoor_indoor_oitc_metric_schema_and_adapter_bridge_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank_after_opening_facade_outdoor_indoor_oitc_metric_schema_and_adapter_bridge_coverage_refresh`

Owner file:
`packages/engine/src/post-v1-floor-user-material-impact-lower-treatment-depth-owner-contract.test.ts`

Selected next:
`post_v1_floor_user_material_impact_lower_treatment_depth_coverage_refresh_plan`
/
`packages/engine/src/post-v1-floor-user-material-impact-lower-treatment-depth-coverage-refresh-contract.test.ts`
/
`docs/calculator/POST_V1_FLOOR_USER_MATERIAL_IMPACT_LOWER_TREATMENT_DEPTH_COVERAGE_REFRESH_PLAN_2026-06-26.md`
/
`post-V1 floor user-material impact lower-treatment depth coverage refresh`

Selected candidate:
`floor.user_material_impact_lower_treatment_depth_owner`

Selected label:
`post-V1 floor user-material impact lower-treatment depth owner`

## Selection Card

User construction / formula family:
visible user-entered floor impact stacks where the user supplies the
base floor and lower treatment directly as layers. The first owner
should target common lower-treatment forms already represented by the
engine's impact predictor and formula corridors: suspended ceiling,
resilient/furred lower support, ceiling cavity depth, fill, and ceiling
board mass.

Target outputs to open:
`Ln,w`, `DeltaLw`, `L'n,w`, and `L'nT,w`.

Formula / adapter route:
bridge visible floor layers and explicit route context into the already
owned floor-impact formula corridors, then use the existing field impact
adapter only when `impactFieldContext` is present. This owner must not
retune formula coefficients or import source rows.

Required physical inputs:
- lower-treatment depth / cavity depth from visible layers;
- lower ceiling isolation support form;
- lower fill and board layers where present;
- `resilientLayerDynamicStiffnessMNm3`;
- `loadBasisKgM2`;
- `impactFieldContext` for field outputs.

`needs_input` behavior:
missing lower-treatment depth/support, dynamic stiffness, load basis,
or field context must produce explicit missing input ids. The engine
must not silently default a lower treatment or load basis.

`unsupported` boundaries:
`IIC`/`AIIC`, airborne `Rw`/`STC`, OITC, source-row proximity
substitution, field outputs without field context, and any formula
family whose physical inputs are incomplete remain blocked.

Expected movement:
`newCalculableRequestShapes: 3`,
`newCalculableTargetOutputs: 4`,
`runtimeBasisPromotions: 3`,
`runtimeValuesMoved: 8`,
`estimatedNextRuntimeValuesMoved: 8`,
`requiredPhysicalInputsCaptured: 2`,
`runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`,
`frontendImplementationFilesTouched: 0`.

no support-only loop: the selected owner must move runtime scope or
return precise `needs_input` boundaries for missing physical inputs.

## Implementation Notes

Start from existing impact route evidence before adding new code:
`impact-predictor-input.ts`,
`heavy-concrete-combined-impact-formula-corridor.ts`,
`steel-floor-formula-input-surface.ts`, and existing lower-treatment
Gate BB/CQ/DI contracts. Reuse those owned routes instead of adding a
new formula.

The owner should prove at least:
- one complete visible lower-treatment stack calculates ISO lab impact
  outputs;
- the same owned basis supports field companions only with explicit
  `impactFieldContext`;
- missing lower-treatment depth/support or missing dynamic/load inputs
  returns `needs_input`;
- ASTM `IIC`/`AIIC`, airborne, and OITC requests remain unsupported.

This owner is about formula-route access and input capture, not catalog
import, confidence wording, UI polish, or source crawling.

## Runtime Closeout

The owner landed runtime scope for a source-absent custom
user-material floor stack: user 150 mm reinforced concrete, 8 mm user
resilient underlay with `dynamicStiffnessMNm3 30`, 50 mm screed,
8 mm tile, a custom 90 mm lower support tagged `ceiling-support` /
`clip`, 80 mm lower fill, and two 13 mm ceiling board layers. The
support layer does not need an explicit `floorRole`; the runtime now
captures the tagged support material as the lower-treatment
support/cavity input and keeps its custom product id on the predictor
input.

Complete lab requests now calculate `Ln,w 43.6` and `DeltaLw 30.9` on
`predictor_heavy_combined_upper_lower_floor_iso12354_annexc_estimate`.
Field-only `L'n,w` / `L'nT,w` requests now use the same hidden combined
lab anchor and publish `L'n,w 45.6` and `L'nT,w 43.2`; they no longer
fall through to the bare slab `Ln,w 74.5` screening path. Mixed
requests keep `Ln,w`, `DeltaLw`, `L'n,w`, and `L'nT,w` target-output
independent.

Missing `impactFieldContext` remains `needs_input` for field outputs.
Missing resilient dynamic stiffness blocks the route before calculation.
Missing lower support/cavity keeps the heavy-concrete combined
upper/lower formula corridor parked with `ceilingOrLowerAssembly`
missing. `IIC`/`AIIC`, OITC, airborne aliases, source-row proximity
substitution, and unsupported field contexts remain explicitly blocked.

Counters:
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

This is not a broad source crawl, catalog import, formula retune, or
frontend slice.

## Coverage Refresh Closeout

The selected coverage refresh has now landed:
`post_v1_floor_user_material_impact_lower_treatment_depth_coverage_refresh_plan`
/
`packages/engine/src/post-v1-floor-user-material-impact-lower-treatment-depth-coverage-refresh-contract.test.ts`
/
`docs/calculator/POST_V1_FLOOR_USER_MATERIAL_IMPACT_LOWER_TREATMENT_DEPTH_COVERAGE_REFRESH_PLAN_2026-06-26.md`
/
`post_v1_floor_user_material_impact_lower_treatment_depth_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank_after_floor_user_material_impact_lower_treatment_depth_coverage_refresh`.
It re-probes selected candidate
`floor.user_material_impact_lower_treatment_depth_owner` and keeps the
owner values pinned without moving runtime values.

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

Selected next:
`post_v1_runtime_first_route_family_rerank_after_floor_user_material_impact_lower_treatment_depth_coverage_refresh_plan`
/
`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-floor-user-material-impact-lower-treatment-depth-coverage-refresh-contract.test.ts`
/
`docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_FLOOR_USER_MATERIAL_IMPACT_LOWER_TREATMENT_DEPTH_COVERAGE_REFRESH_PLAN_2026-06-26.md`.
