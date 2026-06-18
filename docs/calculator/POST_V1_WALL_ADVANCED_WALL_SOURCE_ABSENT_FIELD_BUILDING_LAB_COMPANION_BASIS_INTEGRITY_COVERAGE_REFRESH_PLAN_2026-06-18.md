# Post-V1 Wall Advanced-Wall Source-Absent Field/Building Lab-Companion Basis Integrity Coverage Refresh Plan - 2026-06-18

## Purpose

This is the selected no-runtime coverage refresh after
`post_v1_wall_advanced_wall_source_absent_field_building_lab_companion_basis_integrity_owner_plan`.
It should freeze the mixed field/building plus Gate AY lab-companion
behavior without changing formulas, importing source rows, or touching
frontend files.

Coverage refresh action:

`post_v1_wall_advanced_wall_source_absent_field_building_lab_companion_basis_integrity_coverage_refresh_plan`

Coverage refresh file:

`packages/engine/src/post-v1-wall-advanced-wall-source-absent-field-building-lab-companion-basis-integrity-coverage-refresh-contract.test.ts`

Coverage refresh plan:

`docs/calculator/POST_V1_WALL_ADVANCED_WALL_SOURCE_ABSENT_FIELD_BUILDING_LAB_COMPANION_BASIS_INTEGRITY_COVERAGE_REFRESH_PLAN_2026-06-18.md`

Coverage refresh label:

`post-V1 wall advanced-wall source-absent field/building lab-companion basis integrity coverage refresh`

Coverage refresh status:

`post_v1_wall_advanced_wall_source_absent_field_building_lab_companion_basis_integrity_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank`

## Follows

Previous rerank:

`post_v1_runtime_first_route_family_rerank_after_wall_advanced_wall_source_absent_field_building_adapter_coverage_refresh_plan`

Previous rerank file:

`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-wall-advanced-wall-source-absent-field-building-adapter-coverage-refresh-contract.test.ts`

Previous rerank plan:

`docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_WALL_ADVANCED_WALL_SOURCE_ABSENT_FIELD_BUILDING_ADAPTER_COVERAGE_REFRESH_PLAN_2026-06-18.md`

Previous rerank status:

`post_v1_runtime_first_route_family_rerank_after_wall_advanced_wall_source_absent_field_building_adapter_coverage_refresh_landed_no_runtime_selected_wall_advanced_wall_source_absent_field_building_lab_companion_basis_integrity_owner`

Previous owner:

`post_v1_wall_advanced_wall_source_absent_field_building_lab_companion_basis_integrity_owner_plan`

Previous owner file:

`packages/engine/src/post-v1-wall-advanced-wall-source-absent-field-building-lab-companion-basis-integrity-owner-contract.test.ts`

Previous owner plan:

`docs/calculator/POST_V1_WALL_ADVANCED_WALL_SOURCE_ABSENT_FIELD_BUILDING_LAB_COMPANION_BASIS_INTEGRITY_OWNER_PLAN_2026-06-18.md`

Previous owner status:

`post_v1_wall_advanced_wall_source_absent_field_building_lab_companion_basis_integrity_owner_landed_runtime_selected_coverage_refresh`

Selected candidate re-probed:

`wall.advanced_wall_source_absent_field_building_lab_companion_basis_integrity_owner`

Previous owner counters:

- `newCalculableLayerTemplates: 0`
- `newCalculableRequestShapes: 2`
- `newCalculableTargetOutputs: 8`
- `runtimeBasisPromotions: 2`
- `runtimeValuesMoved 8`
- `runtimeFormulaRetunes: 0`
- `sourceRowsImported: 0`
- `frontendImplementationFilesTouched: 0`
- `unsupportedBoundariesProtected: 7`

## Protected Runtime Behavior

Complete field mixed requests now support:

- `R'w 63` on Gate I;
- `Rw 65`, `STC 65`, `C -1.1`, and `Ctr -6.4` from the Gate AY lab
  basis.

Complete building mixed requests now support:

- `DnT,w 66` on Gate AR;
- `Rw 65`, `STC 65`, `C -1.1`, and `Ctr -6.4` from the Gate AY lab
  basis.

The owner must continue to avoid publishing field-adapted scalar values
`STC 63`, `C -0.9`, or `Ctr -6` as lab companions.

## Boundaries To Refresh

- lab-only field/building requests remain outside this mixed-output
  owner until target-output independence is selected separately;
- missing field/building context remains unsupported;
- Gate AY remains element-lab direct curve owner, not a field/building
  publisher;
- exact measured/source and compatible project/user anchors continue to
  outrank this owner;
- impact, ASTM/IIC/AIIC, OITC, broad source crawling, and formula
  retuning stay outside this refresh.

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

After this refresh lands, run another runtime-first route-family rerank
instead of extending this same owner by default:

`post_v1_runtime_first_route_family_rerank_after_wall_advanced_wall_source_absent_field_building_lab_companion_basis_integrity_plan`

Expected rerank file:

`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-wall-advanced-wall-source-absent-field-building-lab-companion-basis-integrity-contract.test.ts`

Expected rerank plan:

`docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_WALL_ADVANCED_WALL_SOURCE_ABSENT_FIELD_BUILDING_LAB_COMPANION_BASIS_INTEGRITY_PLAN_2026-06-18.md`

Expected rerank label:

`post-V1 runtime-first route-family rerank after wall advanced-wall source-absent field/building lab-companion basis integrity`

## Validation

Run at minimum:

```bash
pnpm --filter @dynecho/engine exec vitest run src/post-v1-wall-advanced-wall-source-absent-field-building-lab-companion-basis-integrity-owner-contract.test.ts src/post-v1-wall-advanced-wall-source-absent-field-building-lab-companion-basis-integrity-coverage-refresh-contract.test.ts --maxWorkers=1
git diff --check
```
