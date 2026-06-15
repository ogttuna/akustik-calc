# Post-V1 Floor User-Material Low-Density Floating-Floor Family Owner Plan - 2026-06-15

## North Star

DynEcho is a calculator first. This owner increases runtime scope for a
custom visible floor stack whose base is user-supplied low-density
concrete. It must route that stack through the existing
lightweight-concrete family and DeltaLw corridors, then through the
existing floor impact field adapter when explicit field context is
present.

This is not a broad source crawl, UI pass, confidence-label copy pass,
heavy-concrete formula borrowing, or ASTM `IIC` / `AIIC` aliasing
shortcut.

## Previous Chain

Previous rerank action:

`post_v1_next_numeric_coverage_gap_after_floor_user_material_impact_context_field_only_adapter_plan`

Previous rerank file:

`packages/engine/src/post-v1-next-numeric-coverage-gap-after-floor-user-material-impact-context-field-only-adapter-contract.test.ts`

Previous rerank status:

`post_v1_next_numeric_coverage_gap_after_floor_user_material_impact_context_field_only_adapter_landed_no_runtime_selected_floor_user_material_low_density_floating_floor_family_owner`

Selected candidate:

`floor.user_material_low_density_floating_floor_family_owner`

## Scope

The owner accepts custom visible floor stacks with:

- explicit floor roles including `base_structure`, `resilient_layer`,
  and an upper treatment;
- user-supplied concrete-like base material with low-density or
  lightweight carrier evidence, including density below the heavy
  concrete carrier threshold;
- explicit `floorImpactContext.resilientLayerDynamicStiffnessMNm3`;
- explicit `floorImpactContext.loadBasisKgM2`;
- explicit impact field context only for `L'n,w`, `L'nT,w`, and
  `L'nT,50`.

For the pinned stack it calculates `Rw 53`, `Ln,w 64.3`,
`DeltaLw 24.3`, `L'n,w 66.3`, `L'nT,w 63.9`, and `L'nT,50 66.9`.
`Ln,w` stays on `predictor_lightweight_concrete_family_estimate`,
`DeltaLw` stays on
`predictor_lightweight_concrete_delta_lw_dynamic_improvement_estimate`,
and field outputs stay on
`source_absent_field_building_adapter_error_budget`.

## Boundaries

Do not route this custom low-density stack through
`predictor_heavy_floating_floor_iso12354_annexc_estimate`.

Do not publish `IIC` or `AIIC` unless exact ASTM band/rating ownership is
available.

Missing dynamic stiffness or load basis remains `needs_input`.

Heavy custom concrete remains on the heavy floating-floor formula route.

## Landed Runtime

Owner action:

`post_v1_floor_user_material_low_density_floating_floor_family_owner_plan`

Owner file:

`packages/engine/src/post-v1-floor-user-material-low-density-floating-floor-family-owner-contract.test.ts`

Owner status:

`post_v1_floor_user_material_low_density_floating_floor_family_owner_landed_runtime_selected_coverage_refresh`

Counters: `newCalculableLayerTemplates: 1`,
`newCalculableRequestShapes: 2`, `newCalculableTargetOutputs: 6`,
`runtimeBasisPromotions: 2`, `runtimeValuesMoved 6`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`.

Selected next action:

`post_v1_floor_user_material_low_density_floating_floor_family_coverage_refresh_plan`

Selected next file:

`packages/engine/src/post-v1-floor-user-material-low-density-floating-floor-family-coverage-refresh-contract.test.ts`

Selected next plan:

`docs/calculator/POST_V1_FLOOR_USER_MATERIAL_LOW_DENSITY_FLOATING_FLOOR_FAMILY_COVERAGE_REFRESH_PLAN_2026-06-15.md`

Selected next label:

`post-V1 floor user-material low-density floating-floor family coverage refresh`
