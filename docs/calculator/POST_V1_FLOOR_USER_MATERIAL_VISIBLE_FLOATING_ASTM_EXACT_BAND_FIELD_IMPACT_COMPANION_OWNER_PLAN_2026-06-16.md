# Post-V1 Floor User-Material Visible Floating ASTM Exact-Band Field Impact Companion Owner Plan - 2026-06-16

## North Star

DynEcho is an acoustic calculator. This runtime owner should let a user
enter a custom visible heavy floating-floor stack, provide exact ASTM
impact bands for `IIC` or `AIIC`, provide complete field impact context,
and receive the owned field impact companions for the same stack without
breaking ASTM metric-basis integrity.

This is not a broad source crawl, UI pass, confidence wording task,
formula retune, or generic ASTM aliasing task.

## Previous Runtime Chain

Mixed ASTM/ISO runtime owner:

`post_v1_floor_user_material_visible_floating_astm_exact_band_mixed_iso_companion_owner_plan`

Mixed ASTM/ISO runtime owner file:

`packages/engine/src/post-v1-floor-user-material-visible-floating-astm-exact-band-mixed-iso-companion-owner-contract.test.ts`

Mixed ASTM/ISO runtime owner status:

`post_v1_floor_user_material_visible_floating_astm_exact_band_mixed_iso_companion_owner_landed_runtime_selected_coverage_refresh`

Coverage refresh:

`post_v1_floor_user_material_visible_floating_astm_exact_band_mixed_iso_companion_coverage_refresh_plan`

Coverage refresh file:

`packages/engine/src/post-v1-floor-user-material-visible-floating-astm-exact-band-mixed-iso-companion-coverage-refresh-contract.test.ts`

Coverage refresh status:

`post_v1_floor_user_material_visible_floating_astm_exact_band_mixed_iso_companion_coverage_refresh_landed_no_runtime_selected_next_numeric_coverage_gap`

Post-refresh rerank:

`post_v1_next_numeric_coverage_gap_after_floor_user_material_visible_floating_astm_exact_band_mixed_iso_companion_plan`

Post-refresh rerank file:

`packages/engine/src/post-v1-next-numeric-coverage-gap-after-floor-user-material-visible-floating-astm-exact-band-mixed-iso-companion-contract.test.ts`

Post-refresh rerank status:

`post_v1_next_numeric_coverage_gap_after_floor_user_material_visible_floating_astm_exact_band_mixed_iso_companion_landed_no_runtime_selected_floor_user_material_visible_floating_astm_exact_band_field_impact_companion_owner`

Post-refresh rerank counters:

- `candidateCount: 10`;
- `estimatedNextRuntimeValuesMoved: 6`;
- `runtimeValuesMoved 0`;
- `runtimeFormulaRetunes: 0`;
- `sourceRowsImported: 0`;
- `frontendImplementationFilesTouched: 0`.

## Selected Candidate

Selected candidate:

`floor.user_material_visible_floating_astm_exact_band_field_impact_companion_owner`

Current selected next action:

`post_v1_floor_user_material_visible_floating_astm_exact_band_field_impact_companion_owner_plan`

Current selected next file:

`packages/engine/src/post-v1-floor-user-material-visible-floating-astm-exact-band-field-impact-companion-owner-contract.test.ts`

Current selected next plan doc:

`docs/calculator/POST_V1_FLOOR_USER_MATERIAL_VISIBLE_FLOATING_ASTM_EXACT_BAND_FIELD_IMPACT_COMPANION_OWNER_PLAN_2026-06-16.md`

Current selected next label:

`post-V1 floor user-material visible floating ASTM exact-band field impact companion owner`

Runtime owner status:

`post_v1_floor_user_material_visible_floating_astm_exact_band_field_impact_companion_owner_landed_runtime_selected_coverage_refresh`

Selected coverage refresh action:

`post_v1_floor_user_material_visible_floating_astm_exact_band_field_impact_companion_coverage_refresh_plan`

Selected coverage refresh file:

`packages/engine/src/post-v1-floor-user-material-visible-floating-astm-exact-band-field-impact-companion-coverage-refresh-contract.test.ts`

Selected coverage refresh plan doc:

`docs/calculator/POST_V1_FLOOR_USER_MATERIAL_VISIBLE_FLOATING_ASTM_EXACT_BAND_FIELD_IMPACT_COMPANION_COVERAGE_REFRESH_PLAN_2026-06-16.md`

Selected coverage refresh status:

`post_v1_floor_user_material_visible_floating_astm_exact_band_field_impact_companion_coverage_refresh_landed_no_runtime_selected_next_numeric_coverage_gap`

Selected coverage refresh label:

`post-V1 floor user-material visible floating ASTM exact-band field impact companion coverage refresh`

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

Post-refresh selected next action:

`post_v1_next_numeric_coverage_gap_after_floor_user_material_visible_floating_astm_exact_band_field_impact_companion_plan`

Post-refresh selected next file:

`packages/engine/src/post-v1-next-numeric-coverage-gap-after-floor-user-material-visible-floating-astm-exact-band-field-impact-companion-contract.test.ts`

Post-refresh selected next plan doc:

`docs/calculator/POST_V1_NEXT_NUMERIC_COVERAGE_GAP_AFTER_FLOOR_USER_MATERIAL_VISIBLE_FLOATING_ASTM_EXACT_BAND_FIELD_IMPACT_COMPANION_PLAN_2026-06-16.md`

## Current Runtime Gap

The exact ASTM mixed ISO owner is closed for lab-side mixed outputs:

- exact lab ASTM `IIC 50`;
- exact field ASTM `AIIC 50`;
- same-stack ISO `Ln,w 50.1` and `DeltaLw 24.4`;
- heavy airborne companions `Rw 58`, `STC 57`, `C -1.8`, and
  `Ctr -7.3`.

When complete `impactFieldContext` is added for `L'n,w`, `L'nT,w`, and
`L'nT,50`, the owned field adapter has the physical inputs and formula
route, but current runtime can throw during result validation. The field
adapter changes the top-level impact basis to a mixed field basis while
the exact ASTM `IIC` / `AIIC` value remains present. The shared impact
schema correctly rejects that basis mismatch.

This owner should preserve the top-level ASTM E989 bridge basis when
`IIC` / `AIIC` is present, add the field companion values under their
own metric-basis entries, and keep `Ln,w` / `DeltaLw` on the ISO heavy
floating-floor basis.

## Expected Runtime Movement

Expected counters:

- `newCalculableLayerTemplates: 0`;
- `newCalculableRequestShapes: 2`;
- `newCalculableTargetOutputs: 6`;
- `runtimeBasisPromotions: 2`;
- `runtimeValuesMoved 6`;
- `runtimeFormulaRetunes: 0`;
- `sourceRowsImported: 0`;
- `frontendImplementationFilesTouched: 0`.

Closeout counters:

- `newCalculableLayerTemplates: 0`;
- `newCalculableRequestShapes: 2`;
- `newCalculableTargetOutputs: 6`;
- `runtimeBasisPromotions: 2`;
- `runtimeValuesMoved 6`;
- `runtimeFormulaRetunes: 0`;
- `sourceRowsImported: 0`;
- `frontendImplementationFilesTouched: 0`.

Expected numeric values for both exact lab ASTM and exact field ASTM
requests with complete field context:

- `Ln,w 50.1`;
- `DeltaLw 24.4`;
- `L'n,w 52.1`;
- `L'nT,w 49.7`;
- `L'nT,50 52.7`;
- heavy airborne companion `Rw 58`, `STC 57`, `C -1.8`, `Ctr -7.3`;
- exact lab request keeps `IIC 50`;
- exact field request keeps `AIIC 50`.

## Boundaries

Keep outside this owner:

- generic `IIC` / `AIIC` without exact ASTM E492/E1007 bands;
- non-ASTM exact impact methods;
- missing `fieldKDb`;
- missing receiving-room volume when `L'nT,w` is requested;
- missing `ci50_2500Db` when `L'nT,50` is requested;
- missing dynamic stiffness or load basis for ISO `Ln,w` / `DeltaLw`;
- low-density/default-catalog promotion;
- building-prediction impact promotion without owned field inputs;
- formula coefficient retunes.

## Implementation Notes

Implement narrowly around impact composition, not shared schema
weakening. The schema is correct: `IIC` and `AIIC` require ASTM E989
metric ownership. Runtime should keep ASTM `IIC` / `AIIC` on the ASTM
basis and carry field impact companions through metric-basis entries
rather than replacing the whole impact basis with a field mixed basis.

## Validation

Run targeted Vitest:

```bash
pnpm --filter @dynecho/engine exec vitest run \
  src/post-v1-next-numeric-coverage-gap-after-floor-user-material-visible-floating-astm-exact-band-mixed-iso-companion-contract.test.ts \
  src/post-v1-floor-user-material-visible-floating-astm-exact-band-field-impact-companion-owner-contract.test.ts
```

Before handoff, run:

```bash
pnpm calculator:gate:current
git diff --check
```
