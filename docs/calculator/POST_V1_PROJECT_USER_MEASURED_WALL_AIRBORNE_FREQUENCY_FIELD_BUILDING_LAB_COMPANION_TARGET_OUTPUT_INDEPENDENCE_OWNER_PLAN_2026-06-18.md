# Post-V1 Project/User Measured Wall Airborne Frequency Field/Building Lab-Companion Target-Output Independence Owner - 2026-06-18

## Purpose

This is the selected runtime owner after
`post_v1_runtime_first_route_family_rerank_after_project_user_measured_wall_airborne_frequency_field_building_lab_companion_basis_integrity_coverage_refresh_plan`.

The owner should make lab-only field and building requests target-output
independent for project/user measured wall airborne frequency curves.
The calculator already owns:

- exact full-stack measured-frequency lab `Rw`, `STC`, `C`, and `Ctr`;
- compatible exterior-board measured-frequency lab `Rw`, `STC`, `C`,
  and `Ctr` through a bounded delta;
- Gate I / Gate AR field and building context checks for the same
  measured-frequency route;
- mixed field/building lab companion `Rw` basis integrity.

The remaining gap is output-order/target-set dependence. When the user
asks only for lab companions in a complete `field_between_rooms` or
`building_prediction` context, the same owned measured-frequency lab
outputs are still parked. That prevents four valid request shapes from
returning values already owned by the calculator.

Selected candidate:

`project_user_measured_wall_airborne_frequency_field_building_lab_companion_target_output_independence_owner`

Selected runtime owner action:

`post_v1_project_user_measured_wall_airborne_frequency_field_building_lab_companion_target_output_independence_owner_plan`

Selected runtime owner file:

`packages/engine/src/post-v1-project-user-measured-wall-airborne-frequency-field-building-lab-companion-target-output-independence-owner-contract.test.ts`

Selected runtime owner plan:

`docs/calculator/POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_FIELD_BUILDING_LAB_COMPANION_TARGET_OUTPUT_INDEPENDENCE_OWNER_PLAN_2026-06-18.md`

Selected runtime owner label:

`post-V1 project/user measured wall airborne frequency field/building lab-companion target-output independence owner`

Selected runtime owner status:

`post_v1_project_user_measured_wall_airborne_frequency_field_building_lab_companion_target_output_independence_owner_landed_runtime_selected_coverage_refresh`

Selected coverage refresh action:

`post_v1_project_user_measured_wall_airborne_frequency_field_building_lab_companion_target_output_independence_coverage_refresh_plan`

Selected coverage refresh file:

`packages/engine/src/post-v1-project-user-measured-wall-airborne-frequency-field-building-lab-companion-target-output-independence-coverage-refresh-contract.test.ts`

Selected coverage refresh plan:

`docs/calculator/POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_FIELD_BUILDING_LAB_COMPANION_TARGET_OUTPUT_INDEPENDENCE_COVERAGE_REFRESH_PLAN_2026-06-18.md`

Selected coverage refresh label:

`post-V1 project/user measured wall airborne frequency field/building lab-companion target-output independence coverage refresh`

Selected coverage refresh status:

`post_v1_project_user_measured_wall_airborne_frequency_field_building_lab_companion_target_output_independence_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank`

Coverage refresh selected next action:

`post_v1_runtime_first_route_family_rerank_after_project_user_measured_wall_airborne_frequency_field_building_lab_companion_target_output_independence_coverage_refresh_plan`

Coverage refresh selected next file:

`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-project-user-measured-wall-airborne-frequency-field-building-lab-companion-target-output-independence-coverage-refresh-contract.test.ts`

Coverage refresh selected next plan:

`docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_FIELD_BUILDING_LAB_COMPANION_TARGET_OUTPUT_INDEPENDENCE_COVERAGE_REFRESH_PLAN_2026-06-18.md`

Coverage refresh selected next label:

`post-V1 runtime-first route-family rerank after project/user measured wall airborne frequency field/building lab-companion target-output independence coverage refresh`

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

## Follows

Previous runtime owner:

`post_v1_project_user_measured_wall_airborne_frequency_field_building_lab_companion_basis_integrity_owner_plan`

Previous runtime owner file:

`packages/engine/src/post-v1-project-user-measured-wall-airborne-frequency-field-building-lab-companion-basis-integrity-owner-contract.test.ts`

Previous runtime owner plan:

`docs/calculator/POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_FIELD_BUILDING_LAB_COMPANION_BASIS_INTEGRITY_OWNER_PLAN_2026-06-18.md`

Previous runtime owner status:

`post_v1_project_user_measured_wall_airborne_frequency_field_building_lab_companion_basis_integrity_owner_landed_runtime_selected_coverage_refresh`

Previous coverage refresh:

`post_v1_project_user_measured_wall_airborne_frequency_field_building_lab_companion_basis_integrity_coverage_refresh_plan`

Previous coverage file:

`packages/engine/src/post-v1-project-user-measured-wall-airborne-frequency-field-building-lab-companion-basis-integrity-coverage-refresh-contract.test.ts`

Previous coverage plan:

`docs/calculator/POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_FIELD_BUILDING_LAB_COMPANION_BASIS_INTEGRITY_COVERAGE_REFRESH_PLAN_2026-06-18.md`

Previous coverage status:

`post_v1_project_user_measured_wall_airborne_frequency_field_building_lab_companion_basis_integrity_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank`

Selecting rerank:

`post_v1_runtime_first_route_family_rerank_after_project_user_measured_wall_airborne_frequency_field_building_lab_companion_basis_integrity_coverage_refresh_plan`

Selecting rerank file:

`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-project-user-measured-wall-airborne-frequency-field-building-lab-companion-basis-integrity-coverage-refresh-contract.test.ts`

Selecting rerank plan:

`docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_FIELD_BUILDING_LAB_COMPANION_BASIS_INTEGRITY_COVERAGE_REFRESH_PLAN_2026-06-18.md`

Selecting rerank status:

`post_v1_runtime_first_route_family_rerank_after_project_user_measured_wall_airborne_frequency_field_building_lab_companion_basis_integrity_coverage_refresh_landed_no_runtime_selected_project_user_measured_wall_airborne_frequency_field_building_lab_companion_target_output_independence_owner`

Selecting rerank counters:

- `candidateCount: 8`
- `roiAnalysisIterations: 4`
- `estimatedNextCalculableRequestShapes: 4`
- `estimatedNextCalculableTargetOutputs: 16`
- `estimatedNextLabCompanionTargetOutputs: 16`
- `estimatedNextRuntimeBasisPromotions: 4`
- `estimatedNextRuntimeValuesMoved: 16`
- `estimatedNextUnsupportedBoundariesProtected: 8`
- `runtimeValuesMoved 0`
- `runtimeFormulaRetunes: 0`
- `sourceRowsImported: 0`
- `frontendImplementationFilesTouched: 0`

## Iteration 1 - Runtime Gap

The runtime currently supports:

- element-lab exact measured-frequency `Rw`, `STC`, `C`, and `Ctr`;
- element-lab compatible measured-frequency `Rw`, `STC`, `C`, and
  `Ctr`;
- mixed field request `R'w`, `Rw`, `STC`, `C`, `Ctr`;
- mixed building request `DnT,w`, `Rw`, `STC`, `C`, `Ctr`.

The runtime still parks:

- exact measured-frequency field lab-only `Rw`, `STC`, `C`, `Ctr`;
- exact measured-frequency building lab-only `Rw`, `STC`, `C`, `Ctr`;
- compatible measured-frequency field lab-only `Rw`, `STC`, `C`,
  `Ctr`;
- compatible measured-frequency building lab-only `Rw`, `STC`, `C`,
  `Ctr`.

This is target-output dependence, not a missing formula.

## Iteration 2 - Basis Integrity

The owner may only publish lab companions when:

- an active project/user measured wall airborne frequency anchor is
  selected;
- the anchor is exact full-stack or compatible exterior-board bounded
  delta;
- the field/building context is complete enough that the same route
  would support mixed field/building output;
- the requested outputs are lab airborne spectrum ratings:
  `Rw`, `STC`, `C`, `Ctr`.

It must not:

- copy lab `Rw` into `R'w`, `Dn,w`, or `DnT,w`;
- infer companions from scalar `Rw` anchors;
- publish impact metrics from airborne curves;
- bypass missing room, area, flanking, or junction requirements;
- import source rows or retune measured-frequency rating formulas.

## Iteration 3 - Expected Movement

Expected owner counters:

- `newCalculableLayerTemplates: 0`
- `newCalculableRequestShapes: 4`
- `newCalculableTargetOutputs: 16`
- `runtimeBasisPromotions: 4`
- `runtimeValuesMoved 16`
- `runtimeFormulaRetunes: 0`
- `sourceRowsImported: 0`
- `frontendImplementationFilesTouched: 0`
- `unsupportedBoundariesProtected: 8`

## Iteration 4 - Implementation Steps

1. Add an owner contract for exact and compatible measured-frequency
   lab-only field/building target-output independence.
2. Reuse the existing measured-frequency lab source and field/building
   context checks; do not add new formula constants.
3. Move only finite requested lab spectrum outputs from unsupported to
   supported when the measured-frequency route and complete
   field/building context are both proven.
4. Keep missing context, impact outputs, scalar anchors, generic source
   rows, and non-wall/floor carriers unsupported.
5. Update active docs only after the owner contract and targeted tests
   pass.

## Validation

Run at minimum:

```bash
pnpm --filter @dynecho/engine exec vitest run \
  src/post-v1-runtime-first-route-family-rerank-after-project-user-measured-wall-airborne-frequency-field-building-lab-companion-basis-integrity-coverage-refresh-contract.test.ts \
  src/post-v1-project-user-measured-wall-airborne-frequency-field-building-lab-companion-target-output-independence-owner-contract.test.ts \
  --maxWorkers=1
git diff --check
```
