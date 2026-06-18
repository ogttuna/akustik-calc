# Post-V1 Project/User Measured Wall Airborne Frequency Field/Building Adapter Coverage Refresh Plan - 2026-06-18

## Purpose

This is the selected no-runtime coverage refresh after
`post_v1_project_user_measured_wall_airborne_frequency_field_building_adapter_owner_plan`.

The landed owner makes exact full-stack and compatible exterior-board
project/user measured wall airborne frequency curves usable as direct
separating-element curves for explicit field/building outputs. The
coverage refresh should freeze that value movement without retuning
formulas, importing source rows, or touching frontend files.

## Follows

Previous owner:

`post_v1_project_user_measured_wall_airborne_frequency_field_building_adapter_owner_plan`

Previous owner file:

`packages/engine/src/post-v1-project-user-measured-wall-airborne-frequency-field-building-adapter-owner-contract.test.ts`

Previous owner plan:

`docs/calculator/POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_FIELD_BUILDING_ADAPTER_OWNER_PLAN_2026-06-18.md`

Previous owner status:

`post_v1_project_user_measured_wall_airborne_frequency_field_building_adapter_owner_landed_runtime_selected_coverage_refresh`

Selected candidate:

`project_user_measured_wall_airborne_frequency_field_building_adapter_owner`

Coverage refresh action:

`post_v1_project_user_measured_wall_airborne_frequency_field_building_adapter_coverage_refresh_plan`

Coverage refresh file:

`packages/engine/src/post-v1-project-user-measured-wall-airborne-frequency-field-building-adapter-coverage-refresh-contract.test.ts`

Coverage refresh plan:

`docs/calculator/POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_FIELD_BUILDING_ADAPTER_COVERAGE_REFRESH_PLAN_2026-06-18.md`

Coverage refresh label:

`post-V1 project/user measured wall airborne frequency field/building adapter coverage refresh`

Coverage refresh status:

`post_v1_project_user_measured_wall_airborne_frequency_field_building_adapter_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank`

## Landed Runtime To Protect

Exact full-stack measured wall airborne frequency anchors with explicit
`field_between_rooms` context now calculate:

- `R'w 49`
- `Dn,w 49`
- `Dn,A 47.7`
- `DnT,w 50`
- `DnT,A 48.8`

Compatible exterior-board measured frequency anchors with explicit
`field_between_rooms` or `building_prediction` context now calculate:

- `R'w 52`
- `Dn,w 52`
- `Dn,A 50.7`
- `DnT,w 53`
- `DnT,A 51.8`

The owner uses Gate I for field context and Gate AR for building
prediction. Lab `Rw`, `STC`, `C`, and `Ctr` stay on the exact or
compatible measured-frequency lab routes and are not relabelled as
field/building metrics.

## Current Selected Next

Selected next action:

`post_v1_runtime_first_route_family_rerank_after_project_user_measured_wall_airborne_frequency_field_building_adapter_coverage_refresh_plan`

Selected next file:

`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-project-user-measured-wall-airborne-frequency-field-building-adapter-coverage-refresh-contract.test.ts`

Selected next plan:

`docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_FIELD_BUILDING_ADAPTER_COVERAGE_REFRESH_PLAN_2026-06-18.md`

Selected next label:

`post-V1 runtime-first route-family rerank after project/user measured wall airborne frequency field/building adapter coverage refresh`

## Coverage Rules

1. Re-probe exact full-stack field/building and compatible-delta
   field/building shapes from the owner contract.
2. Assert `R'w`, `Dn,w`, `Dn,A`, `DnT,w`, and `DnT,A` remain supported
   only when explicit Gate I / Gate AR context exists.
3. Keep incomplete field context, missing building prediction context,
   impact outputs, scalar `Rw` anchors, OITC, ambiguous anchors, and
   non-board compatible-delta changes outside.
4. Keep the route measured-curve-first, not source-crawl-first:
   `sourceRowsImported: 0`.
5. Do not retune formulas or change runtime values in this refresh:
   `runtimeValuesMoved 0` and `runtimeFormulaRetunes: 0`.

## Counters

The previous owner landed with:

- `newCalculableLayerTemplates: 0`
- `newCalculableRequestShapes: 4`
- `newCalculableTargetOutputs: 20`
- `runtimeBasisPromotions: 4`
- `runtimeValuesMoved 20`
- `runtimeFormulaRetunes: 0`
- `sourceRowsImported: 0`
- `frontendImplementationFilesTouched: 0`
- `unsupportedBoundariesProtected: 7`

This coverage refresh should land with:

- `coverageRefreshContractFilesTouched: 1`
- `newCalculableLayerTemplates: 0`
- `newCalculableRequestShapes: 0`
- `newCalculableTargetOutputs: 0`
- `runtimeBasisPromotions: 0`
- `runtimeValuesMoved 0`
- `runtimeFormulaRetunes: 0`
- `sourceRowsImported: 0`
- `frontendImplementationFilesTouched: 0`

## Landed Coverage Summary

The refresh landed as
`post_v1_project_user_measured_wall_airborne_frequency_field_building_adapter_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank`.
It re-probes exact full-stack and compatible exterior-board measured
frequency field/building adapter values, keeps missing context, scalar
`Rw` anchors, impact requests, and non-board changes outside, and moves
no runtime values.

Counters: `coverageRefreshContractFilesTouched: 1`,
`newCalculableLayerTemplates: 0`, `newCalculableRequestShapes: 0`,
`newCalculableTargetOutputs: 0`, `runtimeBasisPromotions: 0`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.

## Validation

Run at minimum:

```bash
pnpm --filter @dynecho/engine exec vitest run src/post-v1-project-user-measured-wall-airborne-frequency-field-building-adapter-owner-contract.test.ts src/post-v1-project-user-measured-wall-airborne-frequency-field-building-adapter-coverage-refresh-contract.test.ts --maxWorkers=1
git diff --check
```
