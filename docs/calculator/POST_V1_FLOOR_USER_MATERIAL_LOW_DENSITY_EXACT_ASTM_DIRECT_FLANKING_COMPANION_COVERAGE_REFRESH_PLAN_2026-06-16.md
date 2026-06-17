# Post-V1 Floor User-Material Low-Density Exact ASTM Direct-Flanking Companion Coverage Refresh Plan - 2026-06-16

## Purpose

This is the bounded no-runtime refresh selected after
`post_v1_floor_user_material_low_density_exact_astm_direct_flanking_companion_owner_plan`.
It should re-probe the new direct+flanking exact ASTM owner, protect the
metric-basis boundary, and then select the next numeric runtime gap.

## Previous Owner

Previous rerank:

`post_v1_next_numeric_coverage_gap_after_floor_user_material_low_density_exact_astm_companion_plan`

Previous rerank file:

`packages/engine/src/post-v1-next-numeric-coverage-gap-after-floor-user-material-low-density-exact-astm-companion-contract.test.ts`

Previous rerank status:

`post_v1_next_numeric_coverage_gap_after_floor_user_material_low_density_exact_astm_companion_landed_no_runtime_selected_floor_user_material_low_density_exact_astm_direct_flanking_companion_owner`

Runtime owner action:

`post_v1_floor_user_material_low_density_exact_astm_direct_flanking_companion_owner_plan`

Runtime owner file:

`packages/engine/src/post-v1-floor-user-material-low-density-exact-astm-direct-flanking-companion-owner-contract.test.ts`

Runtime owner status:

`post_v1_floor_user_material_low_density_exact_astm_direct_flanking_companion_owner_landed_runtime_selected_coverage_refresh`

Selected candidate:

`floor.user_material_low_density_exact_astm_direct_flanking_companion_owner`

The owner moved `runtimeValuesMoved 17` across
`newCalculableRequestShapes: 2` and `newCalculableTargetOutputs: 17`,
with `runtimeBasisPromotions: 2`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.
This is not a broad source crawl.

Selected coverage refresh action:

`post_v1_floor_user_material_low_density_exact_astm_direct_flanking_companion_coverage_refresh_plan`

Selected coverage refresh file:

`packages/engine/src/post-v1-floor-user-material-low-density-exact-astm-direct-flanking-companion-coverage-refresh-contract.test.ts`

Selected coverage refresh plan:

`docs/calculator/POST_V1_FLOOR_USER_MATERIAL_LOW_DENSITY_EXACT_ASTM_DIRECT_FLANKING_COMPANION_COVERAGE_REFRESH_PLAN_2026-06-16.md`

Coverage refresh status:

`post_v1_floor_user_material_low_density_exact_astm_direct_flanking_companion_coverage_refresh_landed_no_runtime_selected_next_numeric_coverage_gap`

## Refresh Scope

The refresh must protect:

- `IIC 50` staying on `astm_e989_impact_rating_metric_schema_adapter_bridge`;
- direct+flanking `L'n,w 62`, `L'nT,w 60`, and `L'nT,50 63`;
- field/building airborne companions with complete physical context;
- unsupported `Rw`, `STC`, `C`, and `Ctr` in building context;
- unsupported generic ASTM aliases and missing direct+flanking input.

## Landed Refresh Result

The refresh re-probes the selected runtime owner without moving runtime
values or retuning formulas. Closeout counters:

- `coverageRefreshContractFilesTouched: 1`;
- `newCalculableLayerTemplates: 0`;
- `newCalculableRequestShapes: 0`;
- `newCalculableTargetOutputs: 0`;
- `runtimeBasisPromotions: 0`;
- `runtimeValuesMoved 0`;
- `runtimeFormulaRetunes: 0`;
- `sourceRowsImported: 0`;
- `frontendImplementationFilesTouched: 0`.

This is not a broad source crawl.

Current selected next action:

`post_v1_next_numeric_coverage_gap_after_floor_user_material_low_density_exact_astm_direct_flanking_companion_plan`

Current selected next file:

`packages/engine/src/post-v1-next-numeric-coverage-gap-after-floor-user-material-low-density-exact-astm-direct-flanking-companion-contract.test.ts`

Current selected next plan doc:

`docs/calculator/POST_V1_NEXT_NUMERIC_COVERAGE_GAP_AFTER_FLOOR_USER_MATERIAL_LOW_DENSITY_EXACT_ASTM_DIRECT_FLANKING_COMPANION_PLAN_2026-06-16.md`

Current selected next label:

`post-V1 next numeric coverage gap after floor user-material low-density exact ASTM direct-flanking companion`

## Validation

Run targeted Vitest:

```bash
pnpm --filter @dynecho/engine exec vitest run \
  src/post-v1-floor-user-material-low-density-exact-astm-direct-flanking-companion-owner-contract.test.ts
```
