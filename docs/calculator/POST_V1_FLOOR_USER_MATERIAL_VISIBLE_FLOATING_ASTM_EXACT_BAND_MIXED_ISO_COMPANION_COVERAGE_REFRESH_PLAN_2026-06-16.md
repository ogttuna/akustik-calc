# Post-V1 Floor User-Material Visible Floating ASTM Exact-Band Mixed ISO Companion Coverage Refresh Plan - 2026-06-16

## North Star

DynEcho is an acoustic calculator. This refresh protects the runtime
owner that lets a custom visible heavy floating-floor stack carry exact
ASTM `IIC` / `AIIC`, owned ISO `Ln,w` / `DeltaLw`, and heavy airborne
companions in one answer without metric aliasing.

This is not a broad source crawl, UI pass, confidence wording task,
formula retune, or material-editor task.

## Previous Runtime Owner

Runtime owner action:

`post_v1_floor_user_material_visible_floating_astm_exact_band_mixed_iso_companion_owner_plan`

Runtime owner file:

`packages/engine/src/post-v1-floor-user-material-visible-floating-astm-exact-band-mixed-iso-companion-owner-contract.test.ts`

Runtime owner status:

`post_v1_floor_user_material_visible_floating_astm_exact_band_mixed_iso_companion_owner_landed_runtime_selected_coverage_refresh`

Previous rerank:

`post_v1_next_numeric_coverage_gap_after_floor_user_material_visible_floating_heavy_airborne_companion_plan`
/
`packages/engine/src/post-v1-next-numeric-coverage-gap-after-floor-user-material-visible-floating-heavy-airborne-companion-contract.test.ts`
/
`post_v1_next_numeric_coverage_gap_after_floor_user_material_visible_floating_heavy_airborne_companion_landed_no_runtime_selected_floor_user_material_visible_floating_astm_exact_band_mixed_iso_companion_owner`

Selected candidate:

`floor.user_material_visible_floating_astm_exact_band_mixed_iso_companion_owner`

The owner preserves exact lab ASTM `IIC 50` and field ASTM `AIIC 50`
while carrying same-stack owned ISO `Ln,w 50.1` and `DeltaLw 24.4`.
The same mixed request keeps heavy airborne companions `Rw 58`,
`STC 57`, `C -1.8`, and `Ctr -7.3`.

Counters: `newCalculableLayerTemplates: 0`,
`newCalculableRequestShapes: 2`, `newCalculableTargetOutputs: 12`,
`runtimeBasisPromotions: 2`, `runtimeValuesMoved 12`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`. This is not a broad source
crawl.

## Selected Next

Current selected next action:

`post_v1_floor_user_material_visible_floating_astm_exact_band_mixed_iso_companion_coverage_refresh_plan`

Current selected next file:

`packages/engine/src/post-v1-floor-user-material-visible-floating-astm-exact-band-mixed-iso-companion-coverage-refresh-contract.test.ts`

Current selected next plan doc:

`docs/calculator/POST_V1_FLOOR_USER_MATERIAL_VISIBLE_FLOATING_ASTM_EXACT_BAND_MIXED_ISO_COMPANION_COVERAGE_REFRESH_PLAN_2026-06-16.md`

Current selected next label:

`post-V1 floor user-material visible floating ASTM exact-band mixed ISO companion coverage refresh`

## Closeout

Coverage refresh status:

`post_v1_floor_user_material_visible_floating_astm_exact_band_mixed_iso_companion_coverage_refresh_landed_no_runtime_selected_next_numeric_coverage_gap`

The refresh re-probes exact lab ASTM `IIC 50` and field ASTM `AIIC 50`
while preserving same-stack ISO `Ln,w 50.1` and `DeltaLw 24.4`, plus
heavy airborne companions `Rw 58`, `STC 57`, `C -1.8`, and `Ctr -7.3`.
Generic ASTM `IIC` / `AIIC`, non-ASTM exact methods, missing dynamic
stiffness, and missing load basis remain outside the mixed owner.
Counters: `coverageRefreshContractFilesTouched: 1`,
`newCalculableLayerTemplates: 0`, `newCalculableRequestShapes: 0`,
`newCalculableTargetOutputs: 0`, `runtimeBasisPromotions: 0`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.
This is not a broad source crawl.

Current selected next action:

`post_v1_next_numeric_coverage_gap_after_floor_user_material_visible_floating_astm_exact_band_mixed_iso_companion_plan`

Current selected next file:

`packages/engine/src/post-v1-next-numeric-coverage-gap-after-floor-user-material-visible-floating-astm-exact-band-mixed-iso-companion-contract.test.ts`

Current selected next plan doc:

`docs/calculator/POST_V1_NEXT_NUMERIC_COVERAGE_GAP_AFTER_FLOOR_USER_MATERIAL_VISIBLE_FLOATING_ASTM_EXACT_BAND_MIXED_ISO_COMPANION_PLAN_2026-06-16.md`

Current selected next label:

`post-V1 next numeric coverage gap after floor user-material visible floating ASTM exact-band mixed ISO companion`

## Coverage Refresh Scope

Add
`packages/engine/src/post-v1-floor-user-material-visible-floating-astm-exact-band-mixed-iso-companion-coverage-refresh-contract.test.ts`
as a no-runtime coverage refresh.

The refresh should re-probe:

- lab exact ASTM bands plus mixed outputs:
  `Rw`, `STC`, `C`, `Ctr`, `Ln,w`, `DeltaLw`, and `IIC`;
- field exact ASTM bands plus mixed outputs:
  `Rw`, `STC`, `C`, `Ctr`, `Ln,w`, `DeltaLw`, and `AIIC`;
- generic ASTM requests without exact bands remain unsupported for
  `IIC` / `AIIC`;
- missing dynamic stiffness or missing load-basis inputs still withhold
  ISO `Ln,w` / `DeltaLw`;
- exact ASTM metric basis remains ASTM E989, while ISO companion metric
  basis remains
  `predictor_heavy_floating_floor_iso12354_annexc_estimate`;
- heavy airborne companion basis remains
  `predictor_heavy_concrete_floor_airborne_companion_estimate`.

Expected refresh counters:

- `coverageRefreshContractFilesTouched: 1`;
- `newCalculableLayerTemplates: 0`;
- `newCalculableRequestShapes: 0`;
- `newCalculableTargetOutputs: 0`;
- `runtimeBasisPromotions: 0`;
- `runtimeValuesMoved 0`;
- `runtimeFormulaRetunes: 0`;
- `sourceRowsImported: 0`;
- `frontendImplementationFilesTouched: 0`.

## Out Of Scope

- Adding source rows;
- broad ASTM `IIC` / `AIIC` support without exact E492/E1007 bands;
- aliasing ISO and ASTM metrics;
- formula coefficient changes;
- UI/material-editor changes;
- low-density/default-catalog promotion;
- building-prediction impact promotion without owned field inputs.

## Validation

Run targeted Vitest:

```bash
pnpm --filter @dynecho/engine exec vitest run \
  src/post-v1-floor-user-material-visible-floating-astm-exact-band-mixed-iso-companion-owner-contract.test.ts \
  src/post-v1-floor-user-material-visible-floating-astm-exact-band-mixed-iso-companion-coverage-refresh-contract.test.ts
```

Before handoff, run:

```bash
pnpm calculator:gate:current
git diff --check
```
