# Post-V1 Floor User-Material Low-Density Exact ASTM Companion Coverage Refresh Plan - 2026-06-16

Plan doc:

`docs/calculator/POST_V1_FLOOR_USER_MATERIAL_LOW_DENSITY_EXACT_ASTM_COMPANION_COVERAGE_REFRESH_PLAN_2026-06-16.md`

## North Star

DynEcho is an acoustic calculator. This no-runtime refresh should
protect the just-landed low-density exact ASTM companion owner for custom
visible floating-floor stacks. It is valid only because it guards the
newly calculated low-density `Rw`, ISO impact, field impact, and ASTM
rating combination.

This is not a broad source crawl, UI pass, source-row import,
confidence wording task, or formula retune.

## Previous Runtime Chain

Previous rerank:

`post_v1_next_numeric_coverage_gap_after_floor_user_material_visible_floating_astm_exact_band_field_impact_companion_plan`

Previous rerank file:

`packages/engine/src/post-v1-next-numeric-coverage-gap-after-floor-user-material-visible-floating-astm-exact-band-field-impact-companion-contract.test.ts`

Previous rerank status:

`post_v1_next_numeric_coverage_gap_after_floor_user_material_visible_floating_astm_exact_band_field_impact_companion_landed_no_runtime_selected_floor_user_material_low_density_exact_astm_companion_owner`

Runtime owner:

`post_v1_floor_user_material_low_density_exact_astm_companion_owner_plan`

Runtime owner file:

`packages/engine/src/post-v1-floor-user-material-low-density-exact-astm-companion-owner-contract.test.ts`

Runtime owner status:

`post_v1_floor_user_material_low_density_exact_astm_companion_owner_landed_runtime_selected_coverage_refresh`

Selected candidate:

`floor.user_material_low_density_exact_astm_companion_owner`

Runtime owner counters:

- `newCalculableLayerTemplates: 0`;
- `newCalculableRequestShapes: 2`;
- `newCalculableTargetOutputs: 10`;
- `runtimeBasisPromotions: 4`;
- `runtimeValuesMoved 12`;
- `runtimeFormulaRetunes: 0`;
- `sourceRowsImported: 0`;
- `frontendImplementationFilesTouched: 0`.

## Refresh Scope

Re-probe exact lab ASTM and exact field ASTM request shapes without
moving runtime behavior:

- lab exact ASTM `IIC 50` plus `Rw 53`, `Ln,w 64.3`,
  `DeltaLw 24.3`, `L'n,w 66.3`, `L'nT,w 63.9`, and
  `L'nT,50 66.9`;
- field exact ASTM `AIIC 50` plus the same low-density lightweight ISO
  and field companions;
- generic ASTM aliases, opposite ASTM metric aliasing, missing
  dynamic-stiffness/load-basis inputs, missing field inputs, source
  crawling, and formula retuning remain outside this owner.

## Landed Coverage Refresh

Coverage refresh action:

`post_v1_floor_user_material_low_density_exact_astm_companion_coverage_refresh_plan`

Coverage refresh file:

`packages/engine/src/post-v1-floor-user-material-low-density-exact-astm-companion-coverage-refresh-contract.test.ts`

Coverage refresh status:

`post_v1_floor_user_material_low_density_exact_astm_companion_coverage_refresh_landed_no_runtime_selected_next_numeric_coverage_gap`

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

## Selected Next

Current selected next action:

`post_v1_next_numeric_coverage_gap_after_floor_user_material_low_density_exact_astm_companion_plan`

Current selected next file:

`packages/engine/src/post-v1-next-numeric-coverage-gap-after-floor-user-material-low-density-exact-astm-companion-contract.test.ts`

Current selected next plan doc:

`docs/calculator/POST_V1_NEXT_NUMERIC_COVERAGE_GAP_AFTER_FLOOR_USER_MATERIAL_LOW_DENSITY_EXACT_ASTM_COMPANION_PLAN_2026-06-16.md`

Current selected next label:

`post-V1 next numeric coverage gap after floor user-material low-density exact ASTM companion`

## Validation

Run targeted Vitest:

```bash
pnpm --filter @dynecho/engine exec vitest run \
  src/post-v1-floor-user-material-low-density-exact-astm-companion-owner-contract.test.ts \
  src/post-v1-floor-user-material-low-density-exact-astm-companion-coverage-refresh-contract.test.ts
```

Before handoff, run:

```bash
pnpm calculator:gate:current
git diff --check
```
