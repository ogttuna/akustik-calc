# Post-V1 Floor User-Material Low-Density Exact ASTM Companion Owner Plan - 2026-06-16

Plan doc:

`docs/calculator/POST_V1_FLOOR_USER_MATERIAL_LOW_DENSITY_EXACT_ASTM_COMPANION_OWNER_PLAN_2026-06-16.md`

## North Star

DynEcho is an acoustic calculator. This runtime owner lets a custom
low-density/lightweight visible floating-floor stack combine exact ASTM
`IIC` / `AIIC` bands with the already-owned lightweight concrete ISO
impact route, field impact adapter, and lightweight airborne companion.

This is not a broad source crawl, UI pass, confidence wording task,
generic ASTM aliasing task, or formula retune.

## Previous Runtime Chain

Previous owner:

`post_v1_floor_user_material_visible_floating_astm_exact_band_field_impact_companion_owner_plan`

Previous owner file:

`packages/engine/src/post-v1-floor-user-material-visible-floating-astm-exact-band-field-impact-companion-owner-contract.test.ts`

Previous owner status:

`post_v1_floor_user_material_visible_floating_astm_exact_band_field_impact_companion_owner_landed_runtime_selected_coverage_refresh`

Previous coverage refresh:

`post_v1_floor_user_material_visible_floating_astm_exact_band_field_impact_companion_coverage_refresh_plan`

Previous coverage refresh file:

`packages/engine/src/post-v1-floor-user-material-visible-floating-astm-exact-band-field-impact-companion-coverage-refresh-contract.test.ts`

Previous coverage refresh status:

`post_v1_floor_user_material_visible_floating_astm_exact_band_field_impact_companion_coverage_refresh_landed_no_runtime_selected_next_numeric_coverage_gap`

Post-refresh rerank:

`post_v1_next_numeric_coverage_gap_after_floor_user_material_visible_floating_astm_exact_band_field_impact_companion_plan`

Post-refresh rerank file:

`packages/engine/src/post-v1-next-numeric-coverage-gap-after-floor-user-material-visible-floating-astm-exact-band-field-impact-companion-contract.test.ts`

Post-refresh rerank status:

`post_v1_next_numeric_coverage_gap_after_floor_user_material_visible_floating_astm_exact_band_field_impact_companion_landed_no_runtime_selected_floor_user_material_low_density_exact_astm_companion_owner`

Rerank counters:

- `candidateCount: 11`;
- `estimatedNextRuntimeValuesMoved: 12`;
- `runtimeValuesMoved 0`;
- `runtimeFormulaRetunes: 0`;
- `sourceRowsImported: 0`;
- `frontendImplementationFilesTouched: 0`.

## Selected Candidate

Selected candidate:

`floor.user_material_low_density_exact_astm_companion_owner`

Runtime owner action:

`post_v1_floor_user_material_low_density_exact_astm_companion_owner_plan`

Runtime owner file:

`packages/engine/src/post-v1-floor-user-material-low-density-exact-astm-companion-owner-contract.test.ts`

Runtime owner status:

`post_v1_floor_user_material_low_density_exact_astm_companion_owner_landed_runtime_selected_coverage_refresh`

## Runtime Movement

Before this owner, exact ASTM low-density visible floating-floor requests
kept only `Rw` and `IIC` / `AIIC`; `Ln,w`, `DeltaLw`, `L'n,w`,
`L'nT,w`, and `L'nT,50` were parked even though the same stack already
owned those routes without the exact ASTM source. The owner keeps ASTM
rating ownership exact while carrying the lightweight family companions.

Expected and closeout counters:

- `newCalculableLayerTemplates: 0`;
- `newCalculableRequestShapes: 2`;
- `newCalculableTargetOutputs: 10`;
- `runtimeBasisPromotions: 4`;
- `runtimeValuesMoved 12`;
- `runtimeFormulaRetunes: 0`;
- `sourceRowsImported: 0`;
- `frontendImplementationFilesTouched: 0`.

Pinned exact lab ASTM request:

- `Rw 53`;
- `Ln,w 64.3`;
- `DeltaLw 24.3`;
- `L'n,w 66.3`;
- `L'nT,w 63.9`;
- `L'nT,50 66.9`;
- `IIC 50`.

Pinned exact field ASTM request:

- `Rw 53`;
- `Ln,w 64.3`;
- `DeltaLw 24.3`;
- `L'n,w 66.3`;
- `L'nT,w 63.9`;
- `L'nT,50 66.9`;
- `AIIC 50`.

## Boundaries

Keep outside this owner:

- generic `IIC` / `AIIC` without exact ASTM E492/E1007 bands;
- opposite ASTM metric aliasing (`IIC` from a field AIIC source or
  `AIIC` from a lab IIC source);
- missing `floorImpactContext.resilientLayerDynamicStiffnessMNm3`;
- missing `floorImpactContext.loadBasisKgM2`;
- missing `fieldKDb`, receiving-room volume, or `ci50_2500Db` for the
  corresponding field impact companion;
- non-ASTM exact impact methods;
- formula coefficient retuning.

## Selected Next

Selected coverage refresh action:

`post_v1_floor_user_material_low_density_exact_astm_companion_coverage_refresh_plan`

Selected coverage refresh file:

`packages/engine/src/post-v1-floor-user-material-low-density-exact-astm-companion-coverage-refresh-contract.test.ts`

Selected coverage refresh plan doc:

`docs/calculator/POST_V1_FLOOR_USER_MATERIAL_LOW_DENSITY_EXACT_ASTM_COMPANION_COVERAGE_REFRESH_PLAN_2026-06-16.md`

Selected coverage refresh status:

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
  src/post-v1-next-numeric-coverage-gap-after-floor-user-material-visible-floating-astm-exact-band-field-impact-companion-contract.test.ts \
  src/post-v1-floor-user-material-low-density-exact-astm-companion-owner-contract.test.ts
```

Before handoff, run:

```bash
pnpm calculator:gate:current
git diff --check
```
