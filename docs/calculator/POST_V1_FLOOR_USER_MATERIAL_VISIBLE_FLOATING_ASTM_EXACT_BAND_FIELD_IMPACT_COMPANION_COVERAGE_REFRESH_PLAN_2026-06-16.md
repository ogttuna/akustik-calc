# Post-V1 Floor User-Material Visible Floating ASTM Exact-Band Field Impact Companion Coverage Refresh Plan - 2026-06-16

Plan doc:

`docs/calculator/POST_V1_FLOOR_USER_MATERIAL_VISIBLE_FLOATING_ASTM_EXACT_BAND_FIELD_IMPACT_COMPANION_COVERAGE_REFRESH_PLAN_2026-06-16.md`

## North Star

DynEcho is an acoustic calculator. This no-runtime refresh should
protect the just-landed field impact companion owner for custom visible
heavy floating-floor stacks that combine exact ASTM `IIC` / `AIIC`
ratings, same-stack ISO `Ln,w` / `DeltaLw`, and complete field impact
context.

This is not a broad source crawl, UI pass, source-row import, confidence
wording task, or formula retune.

## Previous Runtime Chain

Previous rerank:

`post_v1_next_numeric_coverage_gap_after_floor_user_material_visible_floating_astm_exact_band_mixed_iso_companion_plan`

Previous rerank file:

`packages/engine/src/post-v1-next-numeric-coverage-gap-after-floor-user-material-visible-floating-astm-exact-band-mixed-iso-companion-contract.test.ts`

Previous rerank status:

`post_v1_next_numeric_coverage_gap_after_floor_user_material_visible_floating_astm_exact_band_mixed_iso_companion_landed_no_runtime_selected_floor_user_material_visible_floating_astm_exact_band_field_impact_companion_owner`

Runtime owner:

`post_v1_floor_user_material_visible_floating_astm_exact_band_field_impact_companion_owner_plan`

Runtime owner file:

`packages/engine/src/post-v1-floor-user-material-visible-floating-astm-exact-band-field-impact-companion-owner-contract.test.ts`

Runtime owner status:

`post_v1_floor_user_material_visible_floating_astm_exact_band_field_impact_companion_owner_landed_runtime_selected_coverage_refresh`

Selected candidate:

`floor.user_material_visible_floating_astm_exact_band_field_impact_companion_owner`

Runtime owner counters:

- `newCalculableLayerTemplates: 0`;
- `newCalculableRequestShapes: 2`;
- `newCalculableTargetOutputs: 6`;
- `runtimeBasisPromotions: 2`;
- `runtimeValuesMoved 6`;
- `runtimeFormulaRetunes: 0`;
- `sourceRowsImported: 0`;
- `frontendImplementationFilesTouched: 0`.

## Refresh Scope

Coverage refresh action:

`post_v1_floor_user_material_visible_floating_astm_exact_band_field_impact_companion_coverage_refresh_plan`

Coverage refresh file:

`packages/engine/src/post-v1-floor-user-material-visible-floating-astm-exact-band-field-impact-companion-coverage-refresh-contract.test.ts`

Re-probe both request shapes without moving runtime behavior:

- exact lab ASTM `IIC 50` with owned ISO `Ln,w 50.1`,
  `DeltaLw 24.4`, and field companions `L'n,w 52.1`,
  `L'nT,w 49.7`, `L'nT,50 52.7`;
- exact field ASTM `AIIC 50` with the same owned ISO and field
  companion values;
- heavy airborne companions remain `Rw 58`, `STC 57`, `C -1.8`, and
  `Ctr -7.3`;
- generic ASTM aliases, non-ASTM exact methods, missing field K, missing
  receiving-room volume, missing `ci50_2500Db`, missing dynamic
  stiffness/load basis, source crawling, and formula retuning remain
  outside this owner.

## Expected Counters

- `coverageRefreshContractFilesTouched: 1`;
- `newCalculableLayerTemplates: 0`;
- `newCalculableRequestShapes: 0`;
- `newCalculableTargetOutputs: 0`;
- `runtimeBasisPromotions: 0`;
- `runtimeValuesMoved 0`;
- `runtimeFormulaRetunes: 0`;
- `sourceRowsImported: 0`;
- `frontendImplementationFilesTouched: 0`.

Coverage refresh status:

`post_v1_floor_user_material_visible_floating_astm_exact_band_field_impact_companion_coverage_refresh_landed_no_runtime_selected_next_numeric_coverage_gap`

## Selected Next

Current selected next action:

`post_v1_next_numeric_coverage_gap_after_floor_user_material_visible_floating_astm_exact_band_field_impact_companion_plan`

Current selected next file:

`packages/engine/src/post-v1-next-numeric-coverage-gap-after-floor-user-material-visible-floating-astm-exact-band-field-impact-companion-contract.test.ts`

Current selected next plan doc:

`docs/calculator/POST_V1_NEXT_NUMERIC_COVERAGE_GAP_AFTER_FLOOR_USER_MATERIAL_VISIBLE_FLOATING_ASTM_EXACT_BAND_FIELD_IMPACT_COMPANION_PLAN_2026-06-16.md`

Current selected next label:

`post-V1 next numeric coverage gap after floor user-material visible floating ASTM exact-band field impact companion`

## Validation

Run targeted Vitest:

```bash
pnpm --filter @dynecho/engine exec vitest run \
  src/post-v1-floor-user-material-visible-floating-astm-exact-band-field-impact-companion-owner-contract.test.ts \
  src/post-v1-floor-user-material-visible-floating-astm-exact-band-field-impact-companion-coverage-refresh-contract.test.ts
```

Before handoff, run:

```bash
pnpm calculator:gate:current
git diff --check
```
