# Post-V1 Floor User-Material Low-Density Floating-Floor Family Coverage Refresh Plan - 2026-06-15

## North Star

This is the bounded no-runtime refresh after the low-density
user-material floor owner. Re-probe the newly opened custom
low-density/lightweight concrete floating-floor lane, verify the heavy
concrete and ASTM boundaries still hold, and select the next numeric
coverage gap.

This is not a source crawl, UI pass, formula retune, or metric aliasing
task.

## Previous Owner

Owner action:

`post_v1_floor_user_material_low_density_floating_floor_family_owner_plan`

Owner file:

`packages/engine/src/post-v1-floor-user-material-low-density-floating-floor-family-owner-contract.test.ts`

Owner status:

`post_v1_floor_user_material_low_density_floating_floor_family_owner_landed_runtime_selected_coverage_refresh`

Selected candidate closed:

`floor.user_material_low_density_floating_floor_family_owner`

The owner calculates `Rw 53`, `Ln,w 64.3`, `DeltaLw 24.3`,
`L'n,w 66.3`, `L'nT,w 63.9`, and `L'nT,50 66.9` for the pinned custom
low-density floating-floor stack, without source-row import or formula
retune.

## Refresh Checks

Re-probe:

- full lab + field custom low-density request;
- field-only custom low-density request;
- heavy custom concrete stack remains on the heavy floating-floor basis;
- missing dynamic stiffness and missing load basis remain `needs_input`;
- generic `IIC` / `AIIC` remains unsupported.

Expected refresh counters: `runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`.

## Selected Work

Selected next action:

`post_v1_floor_user_material_low_density_floating_floor_family_coverage_refresh_plan`

Selected next file:

`packages/engine/src/post-v1-floor-user-material-low-density-floating-floor-family-coverage-refresh-contract.test.ts`

Selected next plan:

`docs/calculator/POST_V1_FLOOR_USER_MATERIAL_LOW_DENSITY_FLOATING_FLOOR_FAMILY_COVERAGE_REFRESH_PLAN_2026-06-15.md`

Selected next label:

`post-V1 floor user-material low-density floating-floor family coverage refresh`
