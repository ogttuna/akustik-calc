# Post-V1 Project/User Measured Wall Airborne Frequency Field/Building Lab-Companion Basis Integrity Coverage Refresh - 2026-06-18

## Purpose

This is the selected no-runtime coverage refresh after
`post_v1_project_user_measured_wall_airborne_frequency_field_building_lab_companion_basis_integrity_owner_plan`.

It should freeze the landed owner values without changing runtime
formulas, importing source rows, or touching frontend files.

Coverage refresh action:

`post_v1_project_user_measured_wall_airborne_frequency_field_building_lab_companion_basis_integrity_coverage_refresh_plan`

Coverage refresh file:

`packages/engine/src/post-v1-project-user-measured-wall-airborne-frequency-field-building-lab-companion-basis-integrity-coverage-refresh-contract.test.ts`

Coverage refresh plan:

`docs/calculator/POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_FIELD_BUILDING_LAB_COMPANION_BASIS_INTEGRITY_COVERAGE_REFRESH_PLAN_2026-06-18.md`

Coverage refresh label:

`post-V1 project/user measured wall airborne frequency field/building lab-companion basis integrity coverage refresh`

Coverage refresh status:

`post_v1_project_user_measured_wall_airborne_frequency_field_building_lab_companion_basis_integrity_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank`

Selected next action:

`post_v1_runtime_first_route_family_rerank_after_project_user_measured_wall_airborne_frequency_field_building_lab_companion_basis_integrity_coverage_refresh_plan`

Selected next file:

`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-project-user-measured-wall-airborne-frequency-field-building-lab-companion-basis-integrity-coverage-refresh-contract.test.ts`

Selected next plan:

`docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_FIELD_BUILDING_LAB_COMPANION_BASIS_INTEGRITY_COVERAGE_REFRESH_PLAN_2026-06-18.md`

Selected next label:

`post-V1 runtime-first route-family rerank after project/user measured wall airborne frequency field/building lab-companion basis integrity coverage refresh`

## Follows

Previous owner:

`post_v1_project_user_measured_wall_airborne_frequency_field_building_lab_companion_basis_integrity_owner_plan`

Previous owner file:

`packages/engine/src/post-v1-project-user-measured-wall-airborne-frequency-field-building-lab-companion-basis-integrity-owner-contract.test.ts`

Previous owner plan:

`docs/calculator/POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_FIELD_BUILDING_LAB_COMPANION_BASIS_INTEGRITY_OWNER_PLAN_2026-06-18.md`

Previous owner status:

`post_v1_project_user_measured_wall_airborne_frequency_field_building_lab_companion_basis_integrity_owner_landed_runtime_selected_coverage_refresh`

Selecting rerank:

`post_v1_runtime_first_route_family_rerank_after_wall_advanced_wall_source_absent_field_building_lab_companion_target_output_independence_plan`

Selecting rerank plan:

`docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_WALL_ADVANCED_WALL_SOURCE_ABSENT_FIELD_BUILDING_LAB_COMPANION_TARGET_OUTPUT_INDEPENDENCE_PLAN_2026-06-18.md`

Selecting rerank status:

`post_v1_runtime_first_route_family_rerank_after_wall_advanced_wall_source_absent_field_building_lab_companion_target_output_independence_landed_no_runtime_selected_project_user_measured_wall_airborne_frequency_field_building_lab_companion_basis_integrity_owner`

Selected candidate:

`project_user_measured_wall_airborne_frequency_field_building_lab_companion_basis_integrity_owner`

## Landed Runtime To Protect

The owner publishes the missing lab `Rw` companion in mixed field and
building prediction requests for:

- exact full-stack project/user measured wall airborne frequency curves;
- compatible exterior-board project/user measured wall airborne
  frequency curves plus bounded delta.

It keeps:

- field/building outputs on Gate I / Gate AR;
- lab `Rw` on the measured-frequency curve basis;
- already-supported `STC`, `C`, and `Ctr` stable;
- lab-only field/building target sets unsupported until a separate
  target-output independence owner is selected.

## Counters

The runtime owner landed with:

- `newCalculableLayerTemplates: 0`
- `newCalculableRequestShapes: 4`
- `newCalculableTargetOutputs: 4`
- `runtimeBasisPromotions: 4`
- `runtimeValuesMoved 4`
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

It landed as a no-runtime coverage refresh and selected the
runtime-first rerank above. The next rerank should compare the remaining
calculator-scope candidates and is expected to prioritize measured
frequency field/building lab-companion target-output independence only
if the mixed-output basis integrity remains green.

## Validation

Run at minimum:

```bash
pnpm --filter @dynecho/engine exec vitest run src/post-v1-project-user-measured-wall-airborne-frequency-field-building-lab-companion-basis-integrity-owner-contract.test.ts --maxWorkers=1
git diff --check
```
