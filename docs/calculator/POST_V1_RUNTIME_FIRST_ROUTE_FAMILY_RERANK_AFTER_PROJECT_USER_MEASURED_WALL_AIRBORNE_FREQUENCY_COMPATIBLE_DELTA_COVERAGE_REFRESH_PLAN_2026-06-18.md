# Post-V1 Runtime-First Route-Family Rerank After Project/User Measured Wall Airborne Frequency Compatible-Delta Coverage Refresh - 2026-06-18

## Purpose

This is the selected next no-runtime rerank after
`post_v1_project_user_measured_wall_airborne_frequency_compatible_delta_coverage_refresh_plan`.

The previous owner and refresh expanded the frequency-band backbone for
near-measured wall layer combinations: exact measured TL curves can now
produce full-stack lab `Rw`/`STC`/`C`/`Ctr`, and compatible exterior
board changes can calculate from a reduced measured TL curve plus a
bounded delta. The next rerank must choose the highest-ROI calculator
slice after that value movement, without drifting into UI polish,
source crawling, or documentation-only work.

## Previous Coverage Refresh

Coverage action:

`post_v1_project_user_measured_wall_airborne_frequency_compatible_delta_coverage_refresh_plan`

Coverage file:

`packages/engine/src/post-v1-project-user-measured-wall-airborne-frequency-compatible-delta-coverage-refresh-contract.test.ts`

Coverage plan:

`docs/calculator/POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_COMPATIBLE_DELTA_COVERAGE_REFRESH_PLAN_2026-06-18.md`

Coverage status:

`post_v1_project_user_measured_wall_airborne_frequency_compatible_delta_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank`

Previous owner:

`post_v1_project_user_measured_wall_airborne_frequency_compatible_delta_owner_plan`
/
`packages/engine/src/post-v1-project-user-measured-wall-airborne-frequency-compatible-delta-owner-contract.test.ts`
/
`post_v1_project_user_measured_wall_airborne_frequency_compatible_delta_owner_landed_runtime_selected_coverage_refresh`

Runtime method protected:

`post_v1_project_user_measured_wall_airborne_frequency_compatible_delta`

## Selected Next

Selected next action:

`post_v1_runtime_first_route_family_rerank_after_project_user_measured_wall_airborne_frequency_compatible_delta_coverage_refresh_plan`

Selected next file:

`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-project-user-measured-wall-airborne-frequency-compatible-delta-coverage-refresh-contract.test.ts`

Selected next plan:

`docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_COMPATIBLE_DELTA_COVERAGE_REFRESH_PLAN_2026-06-18.md`

Selected next label:

`post-V1 runtime-first route-family rerank after project/user measured wall airborne frequency compatible-delta coverage refresh`

## Landed Rerank Result

Rerank action:

`post_v1_runtime_first_route_family_rerank_after_project_user_measured_wall_airborne_frequency_compatible_delta_coverage_refresh_plan`

Rerank file:

`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-project-user-measured-wall-airborne-frequency-compatible-delta-coverage-refresh-contract.test.ts`

Rerank status:

`post_v1_runtime_first_route_family_rerank_after_project_user_measured_wall_airborne_frequency_compatible_delta_coverage_refresh_landed_no_runtime_selected_project_user_measured_wall_airborne_frequency_field_building_adapter_owner`

Selected candidate:

`project_user_measured_wall_airborne_frequency_field_building_adapter_owner`

Selected next action:

`post_v1_project_user_measured_wall_airborne_frequency_field_building_adapter_owner_plan`

Selected next file:

`packages/engine/src/post-v1-project-user-measured-wall-airborne-frequency-field-building-adapter-owner-contract.test.ts`

Selected next plan:

`docs/calculator/POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_FIELD_BUILDING_ADAPTER_OWNER_PLAN_2026-06-18.md`

Selected next label:

`post-V1 project/user measured wall airborne frequency field/building adapter owner`

The rerank selected the measured-frequency field/building adapter owner
because exact full-stack and compatible exterior-board project/user
measured wall airborne frequency curves are now owned as direct TL
curves. The next bounded runtime owner should feed those curves into
the existing Gate I / Gate AR adapters for `R'w`, `Dn,w`, `Dn,A`,
`DnT,w`, and `DnT,A` only when explicit field/building context is
present. Lab ratings must not be relabelled as field or building
metrics.

Counters: `candidateCount: 8`, `roiAnalysisIterations: 4`,
`estimatedNextCalculableRequestShapes: 4`,
`estimatedNextCalculableTargetOutputs: 20`,
`estimatedNextRequiredPhysicalInputsCaptured: 9`,
`estimatedNextRuntimeBasisPromotions: 4`,
`estimatedNextRuntimeValuesMoved: 20`,
`estimatedNextUnsupportedBoundariesProtected: 7`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.

## Rerank Inputs

Compare these streams through calculator ROI, implementation readiness,
owned physics basis, and conflict risk:

1. User-material physical input coverage:
   custom wall/floor topology inputs, dynamic stiffness, flow
   resistivity, load basis, and explicit construction boundaries.
2. Building prediction + flanking runtime:
   `R'w`, `Dn,w`, `DnT,w`, `L'n,w`, and `L'nT,w` from lab/direct
   values only through owned room, area, junction, and flanking inputs.
3. Frequency-band backbone:
   additional exact/compatible curve routes and scalar-to-curve
   boundaries that avoid metric aliasing.
4. Companion metric completeness:
   only when a curve or rating basis already physically owns the metric.
5. Calibration / holdout packets:
   small same-family, same-basis, rights-safe packets that tighten
   formulas without broad crawling.
6. Named residual families:
   opening/leak, common-wall, open-box/open-web, timber/CLT, and
   low-density floor residuals when an owned formula or anchor exists.

## No-Go Conditions

Do not select:

- UI/report/workbench work;
- broad source crawling;
- confidence copy or explainability-only work;
- general refactors without calculator route movement;
- source-family borrowing without same-basis proof;
- aliases from lab to field/building/impact metrics;
- runtime owners that need unavailable standards or unowned formulas.

## Expected Counters

This rerank must move no runtime values:

- `candidateCount` should be explicit;
- `roiAnalysisIterations` should be at least 4;
- `runtimeValuesMoved 0`;
- `runtimeFormulaRetunes: 0`;
- `sourceRowsImported: 0`;
- `frontendImplementationFilesTouched: 0`.

The selected candidate should name estimated calculable request shapes,
target outputs, required inputs captured, unsupported boundaries
protected, and whether runtime basis promotion is expected.

## Validation

Run:

```bash
pnpm --filter @dynecho/engine exec vitest run src/post-v1-project-user-measured-wall-airborne-frequency-compatible-delta-coverage-refresh-contract.test.ts src/post-v1-runtime-first-route-family-rerank-after-project-user-measured-wall-airborne-frequency-compatible-delta-coverage-refresh-contract.test.ts --maxWorkers=1
git diff --check
```
