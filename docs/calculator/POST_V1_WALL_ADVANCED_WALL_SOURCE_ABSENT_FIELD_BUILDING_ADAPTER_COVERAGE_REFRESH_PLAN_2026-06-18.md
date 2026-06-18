# Post-V1 Wall Advanced-Wall Source-Absent Field/Building Adapter Coverage Refresh Plan - 2026-06-18

## Purpose

This is the selected no-runtime coverage refresh after
`post_v1_wall_advanced_wall_source_absent_field_building_adapter_owner_plan`.
It should freeze the newly landed advanced-wall source-absent
field/building adapter behavior without retuning formulas, importing
source rows, or touching frontend files.

Coverage refresh action:

`post_v1_wall_advanced_wall_source_absent_field_building_adapter_coverage_refresh_plan`

Coverage refresh file:

`packages/engine/src/post-v1-wall-advanced-wall-source-absent-field-building-adapter-coverage-refresh-contract.test.ts`

Coverage refresh plan:

`docs/calculator/POST_V1_WALL_ADVANCED_WALL_SOURCE_ABSENT_FIELD_BUILDING_ADAPTER_COVERAGE_REFRESH_PLAN_2026-06-18.md`

Coverage refresh status:

`post_v1_wall_advanced_wall_source_absent_field_building_adapter_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank`

Coverage refresh label:

`post-V1 wall advanced-wall source-absent field/building adapter coverage refresh`

The runtime owner moved the complete Gate AY advanced-wall direct curve
through Gate I / Gate AR for field/building outputs. The refresh should
protect that movement and its boundaries so future route-family reranks
can continue from a stable calculator surface.

## Follows

Previous rerank:

`post_v1_runtime_first_route_family_rerank_after_project_user_measured_wall_airborne_frequency_field_building_adapter_coverage_refresh_plan`

Previous rerank file:

`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-project-user-measured-wall-airborne-frequency-field-building-adapter-coverage-refresh-contract.test.ts`

Previous rerank plan:

`docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_FIELD_BUILDING_ADAPTER_COVERAGE_REFRESH_PLAN_2026-06-18.md`

Previous rerank status:

`post_v1_runtime_first_route_family_rerank_after_project_user_measured_wall_airborne_frequency_field_building_adapter_coverage_refresh_landed_no_runtime_selected_advanced_wall_source_absent_field_building_adapter_owner`

Previous owner:

`post_v1_wall_advanced_wall_source_absent_field_building_adapter_owner_plan`

Previous owner file:

`packages/engine/src/post-v1-wall-advanced-wall-source-absent-field-building-adapter-owner-contract.test.ts`

Previous owner plan:

`docs/calculator/POST_V1_WALL_ADVANCED_WALL_SOURCE_ABSENT_FIELD_BUILDING_ADAPTER_OWNER_PLAN_2026-06-18.md`

Previous owner status:

`post_v1_wall_advanced_wall_source_absent_field_building_adapter_owner_landed_runtime_selected_coverage_refresh`

Selected candidate re-probed:

`wall.advanced_wall_source_absent_field_building_adapter_owner`

Previous owner counters:

- `newCalculableLayerTemplates: 0`
- `newCalculableRequestShapes: 2`
- `newCalculableTargetOutputs: 10`
- `runtimeBasisPromotions: 2`
- `runtimeValuesMoved 10`
- `runtimeFormulaRetunes: 0`
- `sourceRowsImported: 0`
- `frontendImplementationFilesTouched: 0`
- `unsupportedBoundariesProtected: 6`

## Protected Runtime Behavior

Complete Gate AY advanced-wall source-absent field contexts publish:

- `R'w 63`
- `Dn,w 64`
- `Dn,A 62.6`
- `DnT,w 66`
- `DnT,A 65`

Complete Gate AY advanced-wall source-absent building-prediction
contexts publish the same target-output values through Gate AR when
`buildingPredictionOutputBasis`, `flankingJunctionClass`,
`conservativeFlankingAssumption`, `junctionCouplingLengthM`,
`sourceRoomVolumeM3`, receiving-room volume, and RT60 are explicit.

Gate AY element-lab requests remain on the lab basis:

- `Rw 65`
- `STC 65`
- `C -1.1`
- `Ctr -6.4`

Mixed field/lab requests keep lab `Rw`, `STC`, `C`, and `Ctr`
unsupported under the field/building adapter. The owner must not publish
field-adapted `STC`, `C`, or `Ctr` as lab companions.

## Boundaries To Refresh

- missing field context keeps `R'w`, `Dn,w`, `Dn,A`, `DnT,w`, and
  `DnT,A` unsupported;
- missing building-prediction context keeps those outputs unsupported;
- direct Gate AY requests outside `element_lab` remain
  `unsupported_boundary`;
- exact source precedence and existing owned delegates still outrank
  the advanced-wall adapter;
- impact, ASTM/IIC/AIIC, OITC, source crawling, and formula retuning
  stay outside this refresh.

## Coverage Counters

Expected refresh counters:

- `coverageRefreshContractFilesTouched: 1`
- `newCalculableLayerTemplates: 0`
- `newCalculableRequestShapes: 0`
- `newCalculableTargetOutputs: 0`
- `runtimeBasisPromotions: 0`
- `runtimeValuesMoved 0`
- `runtimeFormulaRetunes: 0`
- `sourceRowsImported: 0`
- `frontendImplementationFilesTouched: 0`

## Selected Next After Refresh

After this refresh lands, run the runtime-first route-family rerank
instead of continuing to extend this same owner:

`post_v1_runtime_first_route_family_rerank_after_wall_advanced_wall_source_absent_field_building_adapter_coverage_refresh_plan`

Expected rerank file:

`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-wall-advanced-wall-source-absent-field-building-adapter-coverage-refresh-contract.test.ts`

Expected rerank plan:

`docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_WALL_ADVANCED_WALL_SOURCE_ABSENT_FIELD_BUILDING_ADAPTER_COVERAGE_REFRESH_PLAN_2026-06-18.md`

Expected rerank label:

`post-V1 runtime-first route-family rerank after wall advanced-wall source-absent field/building adapter coverage refresh`

## Validation

Run at minimum:

```bash
pnpm --filter @dynecho/engine exec vitest run src/post-v1-wall-advanced-wall-source-absent-field-building-adapter-owner-contract.test.ts src/post-v1-wall-advanced-wall-source-absent-field-building-adapter-coverage-refresh-contract.test.ts --maxWorkers=1
git diff --check
```
