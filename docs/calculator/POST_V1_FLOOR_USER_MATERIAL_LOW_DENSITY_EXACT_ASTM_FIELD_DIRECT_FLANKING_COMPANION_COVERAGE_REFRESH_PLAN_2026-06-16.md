# Post-V1 Floor User-Material Low-Density Exact ASTM Field Direct-Flanking Companion Coverage Refresh Plan - 2026-06-16

## Purpose

This is the bounded no-runtime coverage refresh selected after the
field exact ASTM `AIIC` direct-flanking companion owner. It must
re-probe the landed behavior without widening runtime scope.

This plan is calculator-only. It is not a UI polish task, broad source
crawl, confidence-copy pass, generic cleanup, or formula retune.

## Previous Closed Slice

Previous rerank:

`post_v1_next_numeric_coverage_gap_after_floor_user_material_low_density_exact_astm_direct_flanking_companion_plan`

Previous rerank file:

`packages/engine/src/post-v1-next-numeric-coverage-gap-after-floor-user-material-low-density-exact-astm-direct-flanking-companion-contract.test.ts`

Previous rerank status:

`post_v1_next_numeric_coverage_gap_after_floor_user_material_low_density_exact_astm_direct_flanking_companion_landed_no_runtime_selected_floor_user_material_low_density_exact_astm_field_direct_flanking_companion_owner`

Runtime owner:

`post_v1_floor_user_material_low_density_exact_astm_field_direct_flanking_companion_owner_plan`

Runtime owner file:

`packages/engine/src/post-v1-floor-user-material-low-density-exact-astm-field-direct-flanking-companion-owner-contract.test.ts`

Runtime owner status:

`post_v1_floor_user_material_low_density_exact_astm_field_direct_flanking_companion_owner_landed_runtime_selected_coverage_refresh`

Selected candidate:

`floor.user_material_low_density_exact_astm_field_direct_flanking_companion_owner`

Runtime owner counters:

- `newCalculableLayerTemplates: 0`;
- `newCalculableRequestShapes: 2`;
- `newCalculableTargetOutputs: 6`;
- `runtimeBasisPromotions: 2`;
- `runtimeValuesMoved 6`;
- `runtimeFormulaRetunes: 0`;
- `sourceRowsImported: 0`;
- `frontendImplementationFilesTouched: 0`.

This is not a broad source crawl.

## Coverage Refresh Scope

Re-probe and protect:

- exact field ASTM `AIIC 50` basis remains ASTM E989;
- same-stack ISO companions remain `Ln,w 64.3` and `DeltaLw 24.3`;
- direct+flanking field companions remain `L'n,w 66.1`,
  `L'nT,w 63.7`, and `L'nT,50 66.7`;
- complete building context keeps `R'w 51`, `Dn,w 51`, `Dn,A 50.2`,
  `DnT,w 54`, and `DnT,A 52.6`;
- opposite ASTM `IIC`, missing low-density floor impact context, generic
  ASTM aliases, source crawling, and formula retuning remain outside.

Coverage refresh counters:

- `coverageRefreshContractFilesTouched: 1`;
- `newCalculableLayerTemplates: 0`;
- `newCalculableRequestShapes: 0`;
- `newCalculableTargetOutputs: 0`;
- `runtimeBasisPromotions: 0`;
- `runtimeValuesMoved 0`;
- `runtimeFormulaRetunes: 0`;
- `sourceRowsImported: 0`;
- `frontendImplementationFilesTouched: 0`.

## Closeout

Coverage refresh action:

`post_v1_floor_user_material_low_density_exact_astm_field_direct_flanking_companion_coverage_refresh_plan`

Coverage refresh file:

`packages/engine/src/post-v1-floor-user-material-low-density-exact-astm-field-direct-flanking-companion-coverage-refresh-contract.test.ts`

Coverage refresh status:

`post_v1_floor_user_material_low_density_exact_astm_field_direct_flanking_companion_coverage_refresh_landed_no_runtime_selected_next_numeric_coverage_gap`

Coverage refresh plan doc:

`docs/calculator/POST_V1_FLOOR_USER_MATERIAL_LOW_DENSITY_EXACT_ASTM_FIELD_DIRECT_FLANKING_COMPANION_COVERAGE_REFRESH_PLAN_2026-06-16.md`

No runtime values moved in this refresh. It re-probes the owner behavior
and selects the next numeric coverage-gap rerank.

## Selected Next

Current selected next action:

`post_v1_next_numeric_coverage_gap_after_floor_user_material_low_density_exact_astm_field_direct_flanking_companion_plan`

Current selected next file:

`packages/engine/src/post-v1-next-numeric-coverage-gap-after-floor-user-material-low-density-exact-astm-field-direct-flanking-companion-contract.test.ts`

Current selected next plan doc:

`docs/calculator/POST_V1_NEXT_NUMERIC_COVERAGE_GAP_AFTER_FLOOR_USER_MATERIAL_LOW_DENSITY_EXACT_ASTM_FIELD_DIRECT_FLANKING_COMPANION_PLAN_2026-06-16.md`

Current selected next label:

`post-V1 next numeric coverage gap after floor user-material low-density exact ASTM field direct-flanking companion`

## Validation

When implementing the refresh, run targeted Vitest for the owner and the
new coverage refresh:

```bash
pnpm --filter @dynecho/engine exec vitest run \
  src/post-v1-floor-user-material-low-density-exact-astm-field-direct-flanking-companion-owner-contract.test.ts \
  src/post-v1-floor-user-material-low-density-exact-astm-field-direct-flanking-companion-coverage-refresh-contract.test.ts
```

Before handoff, run:

```bash
git diff --check
```
