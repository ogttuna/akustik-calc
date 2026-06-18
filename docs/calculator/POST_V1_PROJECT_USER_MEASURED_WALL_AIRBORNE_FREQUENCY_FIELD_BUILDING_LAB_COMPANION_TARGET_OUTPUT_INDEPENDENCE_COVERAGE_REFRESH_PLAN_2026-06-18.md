# Post-V1 Project/User Measured Wall Airborne Frequency Field/Building Lab-Companion Target-Output Independence Coverage Refresh - 2026-06-18

## Purpose

This is the selected no-runtime coverage refresh after
`post_v1_project_user_measured_wall_airborne_frequency_field_building_lab_companion_target_output_independence_owner_plan`.

It should freeze the landed owner values without formula retuning,
source-row imports, frontend changes, or broad source crawling.

Coverage refresh action:

`post_v1_project_user_measured_wall_airborne_frequency_field_building_lab_companion_target_output_independence_coverage_refresh_plan`

Coverage refresh file:

`packages/engine/src/post-v1-project-user-measured-wall-airborne-frequency-field-building-lab-companion-target-output-independence-coverage-refresh-contract.test.ts`

Coverage refresh plan:

`docs/calculator/POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_FIELD_BUILDING_LAB_COMPANION_TARGET_OUTPUT_INDEPENDENCE_COVERAGE_REFRESH_PLAN_2026-06-18.md`

Coverage refresh label:

`post-V1 project/user measured wall airborne frequency field/building lab-companion target-output independence coverage refresh`

Coverage refresh status:

`post_v1_project_user_measured_wall_airborne_frequency_field_building_lab_companion_target_output_independence_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank`

Selected next action:

`post_v1_runtime_first_route_family_rerank_after_project_user_measured_wall_airborne_frequency_field_building_lab_companion_target_output_independence_coverage_refresh_plan`

Selected next file:

`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-project-user-measured-wall-airborne-frequency-field-building-lab-companion-target-output-independence-coverage-refresh-contract.test.ts`

Selected next plan:

`docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_FIELD_BUILDING_LAB_COMPANION_TARGET_OUTPUT_INDEPENDENCE_COVERAGE_REFRESH_PLAN_2026-06-18.md`

Selected next label:

`post-V1 runtime-first route-family rerank after project/user measured wall airborne frequency field/building lab-companion target-output independence coverage refresh`

## Follows

Previous rerank:

`post_v1_runtime_first_route_family_rerank_after_project_user_measured_wall_airborne_frequency_field_building_lab_companion_basis_integrity_coverage_refresh_plan`

Previous rerank file:

`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-project-user-measured-wall-airborne-frequency-field-building-lab-companion-basis-integrity-coverage-refresh-contract.test.ts`

Previous rerank plan:

`docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_FIELD_BUILDING_LAB_COMPANION_BASIS_INTEGRITY_COVERAGE_REFRESH_PLAN_2026-06-18.md`

Previous rerank status:

`post_v1_runtime_first_route_family_rerank_after_project_user_measured_wall_airborne_frequency_field_building_lab_companion_basis_integrity_coverage_refresh_landed_no_runtime_selected_project_user_measured_wall_airborne_frequency_field_building_lab_companion_target_output_independence_owner`

Previous owner:

`post_v1_project_user_measured_wall_airborne_frequency_field_building_lab_companion_target_output_independence_owner_plan`

Previous owner file:

`packages/engine/src/post-v1-project-user-measured-wall-airborne-frequency-field-building-lab-companion-target-output-independence-owner-contract.test.ts`

Previous owner plan:

`docs/calculator/POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_FIELD_BUILDING_LAB_COMPANION_TARGET_OUTPUT_INDEPENDENCE_OWNER_PLAN_2026-06-18.md`

Previous owner status:

`post_v1_project_user_measured_wall_airborne_frequency_field_building_lab_companion_target_output_independence_owner_landed_runtime_selected_coverage_refresh`

Selected candidate:

`project_user_measured_wall_airborne_frequency_field_building_lab_companion_target_output_independence_owner`

## Landed Runtime To Protect

The owner should protect:

- exact measured-frequency field lab-only `Rw`, `STC`, `C`, and `Ctr`;
- exact measured-frequency building lab-only `Rw`, `STC`, `C`, and
  `Ctr`;
- compatible measured-frequency field lab-only `Rw`, `STC`, `C`, and
  `Ctr`;
- compatible measured-frequency building lab-only `Rw`, `STC`, `C`,
  and `Ctr`;
- mixed field/building values already landed by the basis-integrity
  owner;
- missing-context, impact, scalar-anchor, and unsupported-adjacent
  boundaries.

## Counters

The runtime owner landed with:

- `newCalculableLayerTemplates: 0`
- `newCalculableRequestShapes: 4`
- `newCalculableTargetOutputs: 16`
- `runtimeBasisPromotions: 4`
- `runtimeValuesMoved 16`
- `runtimeFormulaRetunes: 0`
- `sourceRowsImported: 0`
- `frontendImplementationFilesTouched: 0`
- `unsupportedBoundariesProtected: 8`

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

## Validation

Run at minimum:

```bash
pnpm --filter @dynecho/engine exec vitest run \
  src/post-v1-project-user-measured-wall-airborne-frequency-field-building-lab-companion-target-output-independence-owner-contract.test.ts \
  --maxWorkers=1
git diff --check
```
