# Post-V1 Wall Advanced-Wall Source-Absent Field/Building Adapter Owner Plan - 2026-06-18

## Purpose

This is the selected runtime owner after
`post_v1_runtime_first_route_family_rerank_after_project_user_measured_wall_airborne_frequency_field_building_adapter_coverage_refresh_plan`.

Gate AY already owns a complete advanced-wall source-absent direct
transmission-loss curve for lab `Rw`, `STC`, `C`, and `Ctr` when the
user supplies explicit panel, cavity, absorber, opening, frame coupling,
and source-absent error-budget owner inputs. The current calculator still
parks the same complete advanced-wall payload when the user asks for
`R'w`, `Dn,w`, `Dn,A`, `DnT,w`, or `DnT,A`.

The next owner should feed the Gate AY direct curve into the existing
Gate I / Gate AR field-building adapters when explicit field/building
context is present. It must not relabel lab ratings as field or building
metrics.

## Follows

Previous coverage refresh:

`post_v1_project_user_measured_wall_airborne_frequency_field_building_adapter_coverage_refresh_plan`

Previous coverage file:

`packages/engine/src/post-v1-project-user-measured-wall-airborne-frequency-field-building-adapter-coverage-refresh-contract.test.ts`

Previous coverage plan:

`docs/calculator/POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_FIELD_BUILDING_ADAPTER_COVERAGE_REFRESH_PLAN_2026-06-18.md`

Previous coverage status:

`post_v1_project_user_measured_wall_airborne_frequency_field_building_adapter_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank`

Selected rerank:

`post_v1_runtime_first_route_family_rerank_after_project_user_measured_wall_airborne_frequency_field_building_adapter_coverage_refresh_plan`

Selected rerank file:

`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-project-user-measured-wall-airborne-frequency-field-building-adapter-coverage-refresh-contract.test.ts`

Selected rerank plan:

`docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_FIELD_BUILDING_ADAPTER_COVERAGE_REFRESH_PLAN_2026-06-18.md`

Selected rerank status:

`post_v1_runtime_first_route_family_rerank_after_project_user_measured_wall_airborne_frequency_field_building_adapter_coverage_refresh_landed_no_runtime_selected_advanced_wall_source_absent_field_building_adapter_owner`

## Selected Owner

Selected candidate:

`wall.advanced_wall_source_absent_field_building_adapter_owner`

Owner action:

`post_v1_wall_advanced_wall_source_absent_field_building_adapter_owner_plan`

Owner file:

`packages/engine/src/post-v1-wall-advanced-wall-source-absent-field-building-adapter-owner-contract.test.ts`

Owner plan:

`docs/calculator/POST_V1_WALL_ADVANCED_WALL_SOURCE_ABSENT_FIELD_BUILDING_ADAPTER_OWNER_PLAN_2026-06-18.md`

Owner label:

`post-V1 wall advanced-wall source-absent field/building adapter owner`

## Landed Status

Owner status:

`post_v1_wall_advanced_wall_source_absent_field_building_adapter_owner_landed_runtime_selected_coverage_refresh`

The owner now feeds the Gate AY advanced-wall source-absent direct TL
curve through Gate I for `field_between_rooms` and Gate AR for
`building_prediction` when the route has complete room, area, and
flanking context. It opens `R'w`, `Dn,w`, `Dn,A`, `DnT,w`, and
`DnT,A` for the complete advanced-wall payload while keeping Gate AY
lab `Rw`, `STC`, `C`, and `Ctr` on the element-lab basis.

Published field/building values for the covered complete request are
`R'w 63`, `Dn,w 64`, `Dn,A 62.6`, `DnT,w 66`, and `DnT,A 65`.
Gate AY lab values remain `Rw 65`, `STC 65`, `C -1.1`, and
`Ctr -6.4`. Mixed field/lab requests keep lab outputs unsupported
instead of relabelling field-adapted metrics as lab companions.

Owner counters:

- `newCalculableLayerTemplates: 0`
- `newCalculableRequestShapes: 2`
- `newCalculableTargetOutputs: 10`
- `runtimeBasisPromotions: 2`
- `runtimeValuesMoved 10`
- `runtimeFormulaRetunes: 0`
- `sourceRowsImported: 0`
- `frontendImplementationFilesTouched: 0`
- `unsupportedBoundariesProtected: 6`

Selected next action:

`post_v1_wall_advanced_wall_source_absent_field_building_adapter_coverage_refresh_plan`

Selected next file:

`packages/engine/src/post-v1-wall-advanced-wall-source-absent-field-building-adapter-coverage-refresh-contract.test.ts`

Selected next plan:

`docs/calculator/POST_V1_WALL_ADVANCED_WALL_SOURCE_ABSENT_FIELD_BUILDING_ADAPTER_COVERAGE_REFRESH_PLAN_2026-06-18.md`

Selected next label:

`post-V1 wall advanced-wall source-absent field/building adapter coverage refresh`

Coverage refresh status:

`post_v1_wall_advanced_wall_source_absent_field_building_adapter_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank`

Coverage refresh file:

`packages/engine/src/post-v1-wall-advanced-wall-source-absent-field-building-adapter-coverage-refresh-contract.test.ts`

Coverage refresh plan:

`docs/calculator/POST_V1_WALL_ADVANCED_WALL_SOURCE_ABSENT_FIELD_BUILDING_ADAPTER_COVERAGE_REFRESH_PLAN_2026-06-18.md`

Coverage refresh counters:

- `coverageRefreshContractFilesTouched: 1`
- `newCalculableLayerTemplates: 0`
- `newCalculableRequestShapes: 0`
- `newCalculableTargetOutputs: 0`
- `runtimeBasisPromotions: 0`
- `runtimeValuesMoved 0`
- `runtimeFormulaRetunes: 0`
- `sourceRowsImported: 0`
- `frontendImplementationFilesTouched: 0`

Next rerank action:

`post_v1_runtime_first_route_family_rerank_after_wall_advanced_wall_source_absent_field_building_adapter_coverage_refresh_plan`

Next rerank file:

`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-wall-advanced-wall-source-absent-field-building-adapter-coverage-refresh-contract.test.ts`

Next rerank plan:

`docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_WALL_ADVANCED_WALL_SOURCE_ABSENT_FIELD_BUILDING_ADAPTER_COVERAGE_REFRESH_PLAN_2026-06-18.md`

Next rerank label:

`post-V1 runtime-first route-family rerank after wall advanced-wall source-absent field/building adapter coverage refresh`

## Implementation Rules

1. Use Gate AY only as an owned direct element curve source for complete
   advanced-wall physical input. Do not ask Gate AY itself to publish
   field/building metrics.
2. Apply Gate I for `field_between_rooms` and Gate AR for
   `building_prediction` from that direct curve.
3. Publish only `R'w`, `Dn,w`, `Dn,A`, `DnT,w`, and `DnT,A` when finite
   adapter values exist.
4. Keep lab `Rw`, `STC`, `C`, and `Ctr` on the Gate AY lab basis and do
   not copy them into field/building outputs.
5. Keep missing advanced-wall owner fields, missing room/area/flanking
   context, exact-source precedence, existing owned delegate routes,
   impact metrics, OITC, and source crawling outside.

## Required Inputs

The owner may publish field/building values only when the route has:

- `advancedWall.wallSolverIntent=advanced_source_absent_wall`
- `GateAYAdvancedWallDirectTransmissionLossCurve`
- `advancedWall.fieldBuildingAdapterBoundary`
- `advancedWall.sourceAbsentErrorBudgetOwner`
- `airborneContext.contextMode=field_between_rooms_or_building_prediction`
- `airborneContext.panelWidthHeight`
- `airborneContext.receivingRoomVolumeM3`
- `airborneContext.receivingRoomRt60S`
- `airborneContext.sourceRoomVolumeM3_for_building_prediction`
- `airborneContext.flankingJunctionClass_for_building_prediction`

Building prediction also needs `conservativeFlankingAssumption`,
`junctionCouplingLengthM`, and `buildingPredictionOutputBasis`.

## Expected Runtime Movement

The rerank landed no-runtime and selected this owner with:

- `candidateCount: 8`
- `roiAnalysisIterations: 4`
- `estimatedNextCalculableRequestShapes: 2`
- `estimatedNextCalculableTargetOutputs: 10`
- `estimatedNextRequiredPhysicalInputsCaptured: 10`
- `estimatedNextRuntimeBasisPromotions: 2`
- `estimatedNextRuntimeValuesMoved: 10`
- `estimatedNextUnsupportedBoundariesProtected: 6`
- `runtimeValuesMoved 0`
- `runtimeFormulaRetunes: 0`
- `sourceRowsImported: 0`
- `frontendImplementationFilesTouched: 0`

The two request shapes are:

1. complete Gate AY advanced-wall payload plus `field_between_rooms`
   context;
2. complete Gate AY advanced-wall payload plus `building_prediction`
   context.

## Boundary Tests

Owner coverage must prove:

- complete Gate AY lab requests still return `Rw 65`, `STC 65`,
  `C -1.1`, and `Ctr -6.4` on the lab basis;
- field and building requests return adapter-owned values from the same
  direct curve only when room/area/flanking context is explicit;
- missing `panelWidthMm`, `panelHeightMm`, `receivingRoomVolumeM3`,
  `receivingRoomRt60S`, `sourceRoomVolumeM3`, `flankingJunctionClass`,
  `conservativeFlankingAssumption`, `junctionCouplingLengthM`, or
  `buildingPredictionOutputBasis` withholds the affected outputs;
- Gate AY incomplete physical inputs remain `needs_input`;
- exact-source precedence and existing owned triple-leaf delegates still
  outrank Gate AY;
- impact, ASTM/IIC/AIIC, OITC, and lab-to-field aliases remain
  unsupported.

## Validation

Run at minimum:

```bash
pnpm --filter @dynecho/engine exec vitest run src/post-v1-runtime-first-route-family-rerank-after-project-user-measured-wall-airborne-frequency-field-building-adapter-coverage-refresh-contract.test.ts src/post-v1-wall-advanced-wall-source-absent-field-building-adapter-owner-contract.test.ts --maxWorkers=1
git diff --check
```
