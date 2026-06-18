# Post-V1 Project/User Measured Wall Airborne Frequency Field/Building Adapter Owner Plan - 2026-06-18

## Purpose

This is the selected runtime owner after
`post_v1_runtime_first_route_family_rerank_after_project_user_measured_wall_airborne_frequency_compatible_delta_coverage_refresh_plan`.

The previous measured-frequency owners made active project/user wall
airborne TL curves useful for element-lab `Rw`, `STC`, `C`, and `Ctr`:
exact full-stack matches use the measured curve directly, and
near-measured walls with one-side or paired compatible exterior board
additions use the measured reduced-stack curve plus a bounded calculated
delta.

The next calculator value is to use those owned direct separating
element curves for explicit field/building outputs:

- `R'w`
- `Dn,w`
- `Dn,A`
- `DnT,w`
- `DnT,A`

This must happen through the existing Gate I / Gate AR field-building
adapters. Lab ratings must not be relabelled as field or building
metrics.

## Follows

Previous coverage refresh:

`post_v1_project_user_measured_wall_airborne_frequency_compatible_delta_coverage_refresh_plan`

Previous coverage file:

`packages/engine/src/post-v1-project-user-measured-wall-airborne-frequency-compatible-delta-coverage-refresh-contract.test.ts`

Previous coverage plan:

`docs/calculator/POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_COMPATIBLE_DELTA_COVERAGE_REFRESH_PLAN_2026-06-18.md`

Previous coverage status:

`post_v1_project_user_measured_wall_airborne_frequency_compatible_delta_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank`

Selected rerank:

`post_v1_runtime_first_route_family_rerank_after_project_user_measured_wall_airborne_frequency_compatible_delta_coverage_refresh_plan`

Selected rerank file:

`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-project-user-measured-wall-airborne-frequency-compatible-delta-coverage-refresh-contract.test.ts`

Selected rerank status:

`post_v1_runtime_first_route_family_rerank_after_project_user_measured_wall_airborne_frequency_compatible_delta_coverage_refresh_landed_no_runtime_selected_project_user_measured_wall_airborne_frequency_field_building_adapter_owner`

## Selected Owner

Selected candidate:

`project_user_measured_wall_airborne_frequency_field_building_adapter_owner`

Owner action:

`post_v1_project_user_measured_wall_airborne_frequency_field_building_adapter_owner_plan`

Owner file:

`packages/engine/src/post-v1-project-user-measured-wall-airborne-frequency-field-building-adapter-owner-contract.test.ts`

Owner plan:

`docs/calculator/POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_FIELD_BUILDING_ADAPTER_OWNER_PLAN_2026-06-18.md`

Owner label:

`post-V1 project/user measured wall airborne frequency field/building adapter owner`

Owner status:

`post_v1_project_user_measured_wall_airborne_frequency_field_building_adapter_owner_landed_runtime_selected_coverage_refresh`

Current selected next action:

`post_v1_project_user_measured_wall_airborne_frequency_field_building_adapter_coverage_refresh_plan`

Current selected next file:

`packages/engine/src/post-v1-project-user-measured-wall-airborne-frequency-field-building-adapter-coverage-refresh-contract.test.ts`

Current selected next plan:

`docs/calculator/POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_FIELD_BUILDING_ADAPTER_COVERAGE_REFRESH_PLAN_2026-06-18.md`

Current selected next label:

`post-V1 project/user measured wall airborne frequency field/building adapter coverage refresh`

Coverage refresh landed as:

`post_v1_project_user_measured_wall_airborne_frequency_field_building_adapter_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank`

Coverage refresh selected next action:

`post_v1_runtime_first_route_family_rerank_after_project_user_measured_wall_airborne_frequency_field_building_adapter_coverage_refresh_plan`

Coverage refresh selected next file:

`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-project-user-measured-wall-airborne-frequency-field-building-adapter-coverage-refresh-contract.test.ts`

Coverage refresh selected next plan:

`docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_FIELD_BUILDING_ADAPTER_COVERAGE_REFRESH_PLAN_2026-06-18.md`

Coverage refresh selected next label:

`post-V1 runtime-first route-family rerank after project/user measured wall airborne frequency field/building adapter coverage refresh`

Coverage refresh counters: `coverageRefreshContractFilesTouched: 1`,
`newCalculableLayerTemplates: 0`, `newCalculableRequestShapes: 0`,
`newCalculableTargetOutputs: 0`, `runtimeBasisPromotions: 0`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.

## Implementation Rules

1. Use an active project/user measured wall airborne TL curve only when
   the exact full-stack fingerprint matches, or when the compatible
   exterior-board reduced-stack delta owner has proven the bounded
   near-measured route.
2. Use the owned measured/calculated TL curve as the direct separating
   element curve before field/building adaptation.
3. Publish field/building values only through the existing Gate I /
   Gate AR adapter basis with explicit context.
4. Keep scalar `Rw` anchors, impact metrics, OITC, non-board changes,
   missing rating standards, ambiguous anchors, and missing field or
   building context outside.
5. Do not import source rows, retune formulas, touch frontend files, or
   broaden the route into generic building prediction.

## Required Inputs

The owner may publish values only when the route has:

- `airborneMeasuredFrequencySourceAnchors`
- exact full-stack or compatible reduced-stack measured curve
  fingerprint proof
- calculated or measured direct TL curve
- `airborneContext.contextMode = field_between_rooms` or
  `building_prediction`
- `airborneContext.panelWidthMm`
- `airborneContext.panelHeightMm`
- `airborneContext.receivingRoomVolumeM3`
- `airborneContext.receivingRoomRt60S`
- `airborneContext.sourceRoomVolumeM3`
- for `building_prediction`: `flankingJunctionClass`,
  `conservativeFlankingAssumption`, and `junctionCouplingLengthM`

If any required context is missing, return `needs_input` or
`unsupported` instead of copying lab values.

## Expected Runtime Movement

Estimated next movement from the rerank:

- `candidateCount: 8`
- `roiAnalysisIterations: 4`
- `estimatedNextCalculableRequestShapes: 4`
- `estimatedNextCalculableTargetOutputs: 20`
- `estimatedNextRequiredPhysicalInputsCaptured: 9`
- `estimatedNextRuntimeBasisPromotions: 4`
- `estimatedNextRuntimeValuesMoved: 20`
- `estimatedNextUnsupportedBoundariesProtected: 7`
- `runtimeValuesMoved 0`
- `newCalculableLayerTemplates: 0`
- `newCalculableRequestShapes: 4`
- `newCalculableTargetOutputs: 20`
- `runtimeBasisPromotions: 4`
- `runtimeValuesMoved 20`
- `runtimeFormulaRetunes: 0`
- `sourceRowsImported: 0`
- `frontendImplementationFilesTouched: 0`
- `unsupportedBoundariesProtected: 7`

The four request shapes are:

1. exact measured full-stack field context;
2. exact measured full-stack building-prediction context;
3. compatible exterior-board delta field context;
4. compatible exterior-board delta building-prediction context.

## Landed Runtime Summary

The owner landed as
`post_v1_project_user_measured_wall_airborne_frequency_field_building_adapter_owner_landed_runtime_selected_coverage_refresh`.
It promotes exact full-stack and compatible exterior-board
project/user measured wall airborne frequency curves into Gate I /
Gate AR field-building adapters. Exact field/building outputs are
`R'w 49`, `Dn,w 49`, `Dn,A 47.7`, `DnT,w 50`, and `DnT,A 48.8`.
Compatible field/building outputs are `R'w 52`, `Dn,w 52`,
`Dn,A 50.7`, `DnT,w 53`, and `DnT,A 51.8`.

Counters: `newCalculableLayerTemplates: 0`,
`newCalculableRequestShapes: 4`, `newCalculableTargetOutputs: 20`,
`runtimeBasisPromotions: 4`, `runtimeValuesMoved 20`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`,
`frontendImplementationFilesTouched: 0`, and
`unsupportedBoundariesProtected: 7`.

## Expected Code Shape

Prefer a small owner around existing infrastructure:

- keep the current lab-compatible-delta owner behavior intact;
- expose or build a direct-curve result for exact measured and
  compatible-delta measured-frequency routes;
- apply `applyAirborneContextOverlay` to that curve for the requested
  context;
- build `maybeBuildGateIAirborneFieldContextBasisFromBase` for
  `field_between_rooms`;
- build `maybeBuildGateARAirborneBuildingPredictionBasisFromBase` for
  `building_prediction`;
- mark only `R'w`, `Dn,w`, `Dn,A`, `DnT,w`, and `DnT,A` as supported
  when finite adapter values exist.

## Boundary Tests

Owner coverage must prove:

- lab `Rw`/`STC`/`C`/`Ctr` remain on exact or compatible measured
  frequency bases;
- field/building outputs are calculated from the curve and context, not
  relabelled from lab metrics;
- exact full-stack measured curve outranks compatible delta;
- compatible exterior-board delta remains bounded and requires a unique
  reduced-stack anchor;
- scalar `Rw` anchors cannot use this owner;
- missing area, room, RT60, source-room, or junction/flanking inputs
  withhold the affected outputs;
- impact and OITC remain unsupported;
- no source crawl, formula retune, or frontend change is part of the
  owner.

## Validation

Run at minimum:

```bash
pnpm --filter @dynecho/engine exec vitest run src/post-v1-runtime-first-route-family-rerank-after-project-user-measured-wall-airborne-frequency-compatible-delta-coverage-refresh-contract.test.ts src/post-v1-project-user-measured-wall-airborne-frequency-field-building-adapter-owner-contract.test.ts --maxWorkers=1
git diff --check
```
