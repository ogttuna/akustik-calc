# Post-V1 Runtime-First Route-Family Rerank After Project/User Measured Wall Airborne Frequency Field/Building Lab-Companion Target-Output Independence Coverage Refresh - 2026-06-18

## Purpose

This is the selected no-runtime rerank after
`post_v1_project_user_measured_wall_airborne_frequency_field_building_lab_companion_target_output_independence_coverage_refresh_plan`.

The goal is to pick the next highest-ROI calculator runtime slice after
the project/user measured wall airborne frequency field/building
lab-companion target-output independence owner and coverage refresh have
closed.

This plan does not authorize a runtime owner by itself. The next agent
must first land the rerank contract, compare candidates through the
calculator north star, and only then follow the selected runtime owner.

Rerank action:

`post_v1_runtime_first_route_family_rerank_after_project_user_measured_wall_airborne_frequency_field_building_lab_companion_target_output_independence_coverage_refresh_plan`

Expected rerank contract file to create:

`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-project-user-measured-wall-airborne-frequency-field-building-lab-companion-target-output-independence-coverage-refresh-contract.test.ts`

Rerank plan:

`docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_FIELD_BUILDING_LAB_COMPANION_TARGET_OUTPUT_INDEPENDENCE_COVERAGE_REFRESH_PLAN_2026-06-18.md`

Rerank label:

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

Previous coverage refresh:

`post_v1_project_user_measured_wall_airborne_frequency_field_building_lab_companion_target_output_independence_coverage_refresh_plan`

Previous coverage refresh file:

`packages/engine/src/post-v1-project-user-measured-wall-airborne-frequency-field-building-lab-companion-target-output-independence-coverage-refresh-contract.test.ts`

Previous coverage refresh plan:

`docs/calculator/POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_FIELD_BUILDING_LAB_COMPANION_TARGET_OUTPUT_INDEPENDENCE_COVERAGE_REFRESH_PLAN_2026-06-18.md`

Previous coverage refresh status:

`post_v1_project_user_measured_wall_airborne_frequency_field_building_lab_companion_target_output_independence_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank`

Previous coverage refresh counters:

- `coverageRefreshContractFilesTouched: 1`
- `newCalculableLayerTemplates: 0`
- `newCalculableRequestShapes: 0`
- `newCalculableTargetOutputs: 0`
- `runtimeBasisPromotions: 0`
- `runtimeValuesMoved 0`
- `runtimeFormulaRetunes: 0`
- `sourceRowsImported: 0`
- `frontendImplementationFilesTouched: 0`

Selected candidate closed by the previous owner:

`project_user_measured_wall_airborne_frequency_field_building_lab_companion_target_output_independence_owner`

## Closed Runtime To Subtract

The previous owner/coverage chain has closed:

- exact measured-frequency field lab-only `Rw`, `STC`, `C`, and `Ctr`;
- exact measured-frequency building lab-only `Rw`, `STC`, `C`, and
  `Ctr`;
- compatible measured-frequency field lab-only `Rw`, `STC`, `C`, and
  `Ctr`;
- compatible measured-frequency building lab-only `Rw`, `STC`, `C`,
  and `Ctr`;
- mixed field/building basis integrity for the same lab companions.

Do not reopen this slice unless a regression is found.

## Candidate Streams To Compare

The rerank must compare at least these streams:

- user-material physical input coverage for custom wall/floor systems;
- building prediction and flanking runtime where required context is
  available;
- frequency-band backbone work that derives ratings from curves instead
  of scalar aliases;
- companion metric completeness only when the route already owns the
  rating basis;
- calibration or holdout packets with same-family, same-basis evidence;
- residual families such as opening/leak, common-wall, and open-web
  only when a bounded formula or anchor exists.

Reject UI/report work, broad source crawling, generic refactors,
confidence copy, or process cleanup unless directly needed to protect
calculator accuracy or route ownership.

## Iteration Rules

1. Subtract closed chains before scoring candidates.
2. Name the layer family, target outputs, formula/anchor route,
   required inputs, and protected boundary for every candidate.
3. Prefer runtime owners that move numeric outputs for existing
   user-entered constructions through owned formulas, measured rows, or
   same-family bounded deltas.
4. If a candidate needs new research, keep it as planning unless the
   evidence is strong enough to implement without guessing.
5. Do not alias metrics across lab, field, building, airborne, or impact
   bases.

## Validation

Run at minimum:

```bash
pnpm --filter @dynecho/engine exec vitest run \
  src/post-v1-project-user-measured-wall-airborne-frequency-field-building-lab-companion-target-output-independence-coverage-refresh-contract.test.ts \
  --maxWorkers=1
git diff --check
```
