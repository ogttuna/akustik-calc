# Post-V1 Floor User-Material Visible Floating Mixed Lab-Companion Coverage Refresh Plan - 2026-06-16

## Purpose

Re-probe the newly landed runtime owner:

`post_v1_floor_user_material_visible_floating_mixed_lab_companion_owner_plan`

Coverage refresh action:

`post_v1_floor_user_material_visible_floating_mixed_lab_companion_coverage_refresh_plan`

Coverage refresh file:

`packages/engine/src/post-v1-floor-user-material-visible-floating-mixed-lab-companion-coverage-refresh-contract.test.ts`

Owner file:

`packages/engine/src/post-v1-floor-user-material-visible-floating-mixed-lab-companion-owner-contract.test.ts`

Owner status:

`post_v1_floor_user_material_visible_floating_mixed_lab_companion_owner_landed_runtime_selected_coverage_refresh`

Selected candidate:

`floor.user_material_visible_floating_mixed_lab_companion_owner`

This refresh exists to confirm the owner did not widen beyond the
calculator-owned route. It is not a broad source crawl, formula retune,
UI task, source catalog import, or process cleanup.

## Required Checks

- Mixed target sets with explicit `ciDb` and `ci50_2500Db` still support
  `CI`, `CI,50-2500`, and `Ln,w+CI` even when an unready field output is
  also requested.
- The unready field output remains unsupported unless route-required
  field context is supplied.
- Complete field context keeps `L'n,w`, `L'nT,w`, and `L'nT,50` live.
- Missing explicit CI inputs do not create lab companions.
- `IIC` and `AIIC` remain outside the owner.

## Selected Next After Refresh

After this coverage refresh lands, run the next numeric coverage-gap
rerank. The rerank should prefer a physically ready runtime owner that
moves calculator values. If no such owner is ready, it should choose the
smallest route-required input or metric/basis boundary that protects
calculator accuracy.

Do not use the refresh to start UI work, broad source crawling, generic
cleanup, or confidence-label wording.

## Landed Closeout

Coverage refresh action:

`post_v1_floor_user_material_visible_floating_mixed_lab_companion_coverage_refresh_plan`

Coverage refresh file:

`packages/engine/src/post-v1-floor-user-material-visible-floating-mixed-lab-companion-coverage-refresh-contract.test.ts`

Coverage refresh status:

`post_v1_floor_user_material_visible_floating_mixed_lab_companion_coverage_refresh_landed_no_runtime_selected_next_numeric_coverage_gap`

The refresh re-probes the mixed lab-companion owner without moving
runtime values. It keeps explicit lab companions live in mixed target
sets, keeps incomplete field outputs unsupported, keeps complete field
context live, and keeps missing CI inputs plus generic `IIC`/`AIIC`
outside the owner.

Counters: `coverageRefreshContractFilesTouched: 1`,
`newCalculableLayerTemplates: 0`, `newCalculableRequestShapes: 0`,
`newCalculableTargetOutputs: 0`, `runtimeBasisPromotions: 0`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.
This is not a broad source crawl.

Selected next action:

`post_v1_next_numeric_coverage_gap_after_floor_user_material_visible_floating_mixed_lab_companion_plan`

Selected next file:

`packages/engine/src/post-v1-next-numeric-coverage-gap-after-floor-user-material-visible-floating-mixed-lab-companion-contract.test.ts`

Selected next plan:

`docs/calculator/POST_V1_NEXT_NUMERIC_COVERAGE_GAP_AFTER_FLOOR_USER_MATERIAL_VISIBLE_FLOATING_MIXED_LAB_COMPANION_PLAN_2026-06-16.md`

Selected next label:

`post-V1 next numeric coverage gap after floor user-material visible floating mixed lab-companion`
