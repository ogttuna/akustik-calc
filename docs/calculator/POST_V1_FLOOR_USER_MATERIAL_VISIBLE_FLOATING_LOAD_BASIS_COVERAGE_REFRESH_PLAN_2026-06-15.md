# Post-V1 Floor User-Material Visible Floating Load-Basis Coverage Refresh Plan - 2026-06-15

## Purpose

Re-probe the newly landed runtime owner:
`post_v1_floor_user_material_visible_floating_load_basis_owner_plan`.
Owner file:
`packages/engine/src/post-v1-floor-user-material-visible-floating-load-basis-owner-contract.test.ts`.
Owner status:
`post_v1_floor_user_material_visible_floating_load_basis_owner_landed_runtime_selected_coverage_refresh`.
It follows previous selected action:
`post_v1_next_numeric_coverage_gap_after_floor_user_material_low_density_floating_floor_family_plan`.
Selected candidate:
`floor.user_material_visible_floating_load_basis_owner`.

This is a narrow coverage refresh for the visible floating-floor load
basis derivation. It is not a broad source crawl, formula retune, UI
pass, or generic cleanup task.

## Required Checks

- Low-density visible floating floor without manual `loadBasisKgM2`
  still calculates `Ln,w 64.3`, `DeltaLw 24.4`, `L'n,w 66.3`,
  `L'nT,w 63.9`, and `L'nT,50 66.9`.
- Heavy visible floating floor without manual `loadBasisKgM2` still
  calculates `Ln,w 50.1`, `DeltaLw 24.4`, `L'n,w 52.1`, `L'nT,w 49.7`,
  and `L'nT,50 52.7`.
- Explicit `loadBasisKgM2` still overrides the derived `77.6 kg/m2`
  value.
- Missing dynamic stiffness and non-derivable load basis stay
  `needs_input`.
- ASTM `IIC` / `AIIC` remains unsupported unless exact ASTM band owner
  inputs are supplied through the separate route.

## Selected Next After Refresh

After this refresh lands, run a new ROI selection only if no runtime
owner is already physically ready. The selection must prioritize
calculator scope and accuracy over another no-runtime bookkeeping loop.

## Landed Closeout

Coverage refresh action:

`post_v1_floor_user_material_visible_floating_load_basis_coverage_refresh_plan`

Coverage refresh file:

`packages/engine/src/post-v1-floor-user-material-visible-floating-load-basis-coverage-refresh-contract.test.ts`

Coverage refresh status:

`post_v1_floor_user_material_visible_floating_load_basis_coverage_refresh_landed_no_runtime_selected_next_numeric_coverage_gap`

The refresh re-probes the visible floating load-basis owner without
moving runtime values. Counters:
`coverageRefreshContractFilesTouched: 1`,
`newCalculableLayerTemplates: 0`, `newCalculableRequestShapes: 0`,
`newCalculableTargetOutputs: 0`, `runtimeBasisPromotions: 0`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.
This is not a broad source crawl.

Selected next action:

`post_v1_next_numeric_coverage_gap_after_floor_user_material_visible_floating_load_basis_plan`

Selected next file:

`packages/engine/src/post-v1-next-numeric-coverage-gap-after-floor-user-material-visible-floating-load-basis-contract.test.ts`

Selected next plan:

`docs/calculator/POST_V1_NEXT_NUMERIC_COVERAGE_GAP_AFTER_FLOOR_USER_MATERIAL_VISIBLE_FLOATING_LOAD_BASIS_PLAN_2026-06-16.md`

Selected next label:

`post-V1 next numeric coverage gap after floor user-material visible floating load-basis`
