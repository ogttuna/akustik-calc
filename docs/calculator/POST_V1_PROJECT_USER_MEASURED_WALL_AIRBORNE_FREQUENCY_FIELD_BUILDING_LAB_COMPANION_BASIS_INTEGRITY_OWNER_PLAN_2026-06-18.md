# Post-V1 Project/User Measured Wall Airborne Frequency Field/Building Lab-Companion Basis Integrity Owner - 2026-06-18

## Purpose

This is the selected next runtime owner after
`post_v1_runtime_first_route_family_rerank_after_wall_advanced_wall_source_absent_field_building_lab_companion_target_output_independence_plan`.

The owner should publish the missing lab `Rw` companion for
project/user measured wall airborne frequency curves when those curves
are already being used as the direct separating-element basis for
explicit field/building outputs. Mixed requests already publish `STC`,
`C`, and `Ctr`; the owner must preserve those values and add `Rw` on
the measured curve basis. It must keep field/building values on Gate I /
Gate AR, avoid copying lab values into field/building metrics, avoid
inferring missing companions from scalar `Rw`, and avoid importing
source rows.

Selected candidate:

`project_user_measured_wall_airborne_frequency_field_building_lab_companion_basis_integrity_owner`

Selected runtime owner action:

`post_v1_project_user_measured_wall_airborne_frequency_field_building_lab_companion_basis_integrity_owner_plan`

Selected runtime owner file:

`packages/engine/src/post-v1-project-user-measured-wall-airborne-frequency-field-building-lab-companion-basis-integrity-owner-contract.test.ts`

Selected runtime owner plan:

`docs/calculator/POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_FIELD_BUILDING_LAB_COMPANION_BASIS_INTEGRITY_OWNER_PLAN_2026-06-18.md`

Selected runtime owner label:

`post-V1 project/user measured wall airborne frequency field/building lab-companion basis integrity owner`

Selected runtime owner status:

`post_v1_project_user_measured_wall_airborne_frequency_field_building_lab_companion_basis_integrity_owner_landed_runtime_selected_coverage_refresh`

Selected coverage refresh action:

`post_v1_project_user_measured_wall_airborne_frequency_field_building_lab_companion_basis_integrity_coverage_refresh_plan`

Selected coverage refresh file:

`packages/engine/src/post-v1-project-user-measured-wall-airborne-frequency-field-building-lab-companion-basis-integrity-coverage-refresh-contract.test.ts`

Selected coverage refresh plan:

`docs/calculator/POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_FIELD_BUILDING_LAB_COMPANION_BASIS_INTEGRITY_COVERAGE_REFRESH_PLAN_2026-06-18.md`

Selected coverage refresh status:

`post_v1_project_user_measured_wall_airborne_frequency_field_building_lab_companion_basis_integrity_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank`

Selected coverage refresh next action:

`post_v1_runtime_first_route_family_rerank_after_project_user_measured_wall_airborne_frequency_field_building_lab_companion_basis_integrity_coverage_refresh_plan`

Selected coverage refresh next file:

`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-project-user-measured-wall-airborne-frequency-field-building-lab-companion-basis-integrity-coverage-refresh-contract.test.ts`

Selected coverage refresh next plan:

`docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_FIELD_BUILDING_LAB_COMPANION_BASIS_INTEGRITY_COVERAGE_REFRESH_PLAN_2026-06-18.md`

Selected coverage refresh next label:

`post-V1 runtime-first route-family rerank after project/user measured wall airborne frequency field/building lab-companion basis integrity coverage refresh`

Selected coverage refresh counters:

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

Previous owner:

`post_v1_wall_advanced_wall_source_absent_field_building_lab_companion_target_output_independence_owner_plan`

Previous owner file:

`packages/engine/src/post-v1-wall-advanced-wall-source-absent-field-building-lab-companion-target-output-independence-owner-contract.test.ts`

Previous owner plan:

`docs/calculator/POST_V1_WALL_ADVANCED_WALL_SOURCE_ABSENT_FIELD_BUILDING_LAB_COMPANION_TARGET_OUTPUT_INDEPENDENCE_OWNER_PLAN_2026-06-18.md`

Previous owner status:

`post_v1_wall_advanced_wall_source_absent_field_building_lab_companion_target_output_independence_owner_landed_runtime_selected_coverage_refresh`

Previous coverage refresh:

`post_v1_wall_advanced_wall_source_absent_field_building_lab_companion_target_output_independence_coverage_refresh_plan`

Previous coverage refresh file:

`packages/engine/src/post-v1-wall-advanced-wall-source-absent-field-building-lab-companion-target-output-independence-coverage-refresh-contract.test.ts`

Previous coverage refresh plan:

`docs/calculator/POST_V1_WALL_ADVANCED_WALL_SOURCE_ABSENT_FIELD_BUILDING_LAB_COMPANION_TARGET_OUTPUT_INDEPENDENCE_COVERAGE_REFRESH_PLAN_2026-06-18.md`

Previous coverage refresh status:

`post_v1_wall_advanced_wall_source_absent_field_building_lab_companion_target_output_independence_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank`

Selecting rerank:

`post_v1_runtime_first_route_family_rerank_after_wall_advanced_wall_source_absent_field_building_lab_companion_target_output_independence_plan`

Selecting rerank file:

`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-wall-advanced-wall-source-absent-field-building-lab-companion-target-output-independence-contract.test.ts`

Selecting rerank plan:

`docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_WALL_ADVANCED_WALL_SOURCE_ABSENT_FIELD_BUILDING_LAB_COMPANION_TARGET_OUTPUT_INDEPENDENCE_PLAN_2026-06-18.md`

Selecting rerank status:

`post_v1_runtime_first_route_family_rerank_after_wall_advanced_wall_source_absent_field_building_lab_companion_target_output_independence_landed_no_runtime_selected_project_user_measured_wall_airborne_frequency_field_building_lab_companion_basis_integrity_owner`

## Current Runtime Gap

The measured-frequency chain is already calculator-owned:

- exact full-stack project/user measured TL curves publish lab `Rw`,
  `STC`, `C`, and `Ctr`;
- compatible exterior-board measured TL curves plus bounded delta
  publish lab `Rw`, `STC`, `C`, and `Ctr`;
- the field/building adapter already turns those direct curves into
  `R'w`, `Dn,w`, `Dn,A`, `DnT,w`, and `DnT,A` when explicit room,
  area, and building/flanking context is present.

The remaining gap is mixed basis output. Requests such as:

- exact measured curve + `field_between_rooms` + `R'w`, `Rw`, `STC`,
  `C`, `Ctr`;
- exact measured curve + `building_prediction` + `DnT,w`, `Rw`, `STC`,
  `C`, `Ctr`;
- compatible measured curve + the same two contexts;

currently return the field/building output plus `STC`, `C`, and `Ctr`,
but park lab `Rw` as unsupported. The owner should publish `Rw` from
the same measured curve basis while keeping the field/building output on
Gate I or Gate AR.

## Scope

In scope:

- exact full-stack measured frequency anchors with complete
  field/building context;
- compatible exterior-board measured frequency anchors with complete
  field/building context;
- mixed target sets containing a field/building output plus `Rw`, while
  preserving already-supported `STC`, `C`, and `Ctr`;
- per-output basis integrity in warnings, `airborneBasis` assumptions,
  supported/unsupported outputs, and metrics.

Out of scope:

- lab-only field/building target-output independence;
- scalar `Rw` anchor companion expansion;
- `OITC`;
- impact outputs such as `IIC` and `AIIC`;
- missing room, area, flanking, or junction context;
- ambiguous measured-frequency anchors;
- non-board compatible-delta changes;
- source crawling, formula retuning, UI/report work, and confidence
  copy.

## Required Inputs And Bases

Required inputs:

- active project/user measured wall airborne frequency anchor;
- canonical construction fingerprint;
- measured TL curve with declared rating standards;
- explicit `field_between_rooms` or `building_prediction` context;
- Gate I / Gate AR field/building adapter requirements;
- source kind: `exact_full_stack` or `compatible_delta`.

Basis requirements:

- lab `Rw`, `STC`, `C`, and `Ctr`: measured frequency curve rating
  basis;
- field `R'w`, `Dn,w`, `Dn,A`, `DnT,w`, and `DnT,A`: Gate I;
- building `R'w`, `Dn,w`, `Dn,A`, `DnT,w`, and `DnT,A`: Gate AR;
- each output must keep its own basis. No metric aliasing is allowed.

## Expected Movement

The selecting rerank estimated:

- `candidateCount: 8`
- `roiAnalysisIterations: 4`
- `estimatedNextCalculableRequestShapes: 4`
- `estimatedNextCalculableTargetOutputs: 4`
- `estimatedNextLabCompanionTargetOutputs: 4`
- `estimatedNextRuntimeBasisPromotions: 4`
- `estimatedNextRuntimeValuesMoved: 4`
- `estimatedNextUnsupportedBoundariesProtected: 8`
- `runtimeValuesMoved 0`
- `runtimeFormulaRetunes: 0`
- `sourceRowsImported: 0`
- `frontendImplementationFilesTouched: 0`

## Landed Owner Status

Owner status:

`post_v1_project_user_measured_wall_airborne_frequency_field_building_lab_companion_basis_integrity_owner_landed_runtime_selected_coverage_refresh`

The owner landed the planned `Rw` movement for exact and compatible
project/user measured wall airborne frequency curves in both
field-between-rooms and building-prediction mixed requests. It keeps
field/building outputs unchanged and preserves existing `STC`, `C`, and
`Ctr` support. It moves no source rows and performs no formula retune.

The runtime owner should land with:

- `newCalculableLayerTemplates: 0`
- `newCalculableRequestShapes: 4`
- `newCalculableTargetOutputs: 4`
- `runtimeBasisPromotions: 4`
- `runtimeValuesMoved 4`
- `runtimeFormulaRetunes: 0`
- `sourceRowsImported: 0`
- `frontendImplementationFilesTouched: 0`

Selected coverage refresh action:

`post_v1_project_user_measured_wall_airborne_frequency_field_building_lab_companion_basis_integrity_coverage_refresh_plan`

Selected coverage refresh file:

`packages/engine/src/post-v1-project-user-measured-wall-airborne-frequency-field-building-lab-companion-basis-integrity-coverage-refresh-contract.test.ts`

Selected coverage refresh plan:

`docs/calculator/POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_FIELD_BUILDING_LAB_COMPANION_BASIS_INTEGRITY_COVERAGE_REFRESH_PLAN_2026-06-18.md`

Selected coverage refresh label:

`post-V1 project/user measured wall airborne frequency field/building lab-companion basis integrity coverage refresh`

## Implementation Steps

1. Add the owner contract named above.
2. Reuse the measured-frequency exact curve bridge and compatible-delta
   owner fixtures to prove current lab values.
3. Add mixed field/building positive cases for exact and compatible
   anchors, proving `Rw` moves while `STC`, `C`, and `Ctr` stay stable.
4. Update runtime only where the project/user measured-frequency
   field/building adapter assembles supported/unsupported outputs.
5. Keep field/building values unchanged and add lab `Rw` from the
   measured curve source result.
6. Keep lab-only field/building target sets unsupported; that is a
   separate target-output independence owner.
7. Keep missing context, scalar-only anchors, impact metrics, `OITC`,
   ambiguous anchors, and non-board compatible deltas unsupported.
8. Add a coverage refresh after the owner lands.

## Validation

Run at minimum:

```bash
pnpm --filter @dynecho/engine exec vitest run src/post-v1-runtime-first-route-family-rerank-after-wall-advanced-wall-source-absent-field-building-lab-companion-target-output-independence-contract.test.ts --maxWorkers=1
pnpm --filter @dynecho/engine exec vitest run src/post-v1-project-user-measured-wall-airborne-frequency-field-building-adapter-owner-contract.test.ts src/post-v1-project-user-measured-wall-airborne-frequency-field-building-adapter-coverage-refresh-contract.test.ts --maxWorkers=1
git diff --check
```
