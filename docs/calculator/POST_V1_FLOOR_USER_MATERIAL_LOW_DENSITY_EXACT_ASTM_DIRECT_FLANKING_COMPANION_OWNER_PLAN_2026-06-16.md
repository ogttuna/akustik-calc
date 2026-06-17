# Post-V1 Floor User-Material Low-Density Exact ASTM Direct-Flanking Companion Owner Plan - 2026-06-16

## North Star

DynEcho is an acoustic calculator. This owner improves custom
low-density visible floating-floor calculations when a user supplies an
exact ASTM E492 impact band source plus explicit direct+flanking field
or building context.

It does not import source rows, retune formulas, invent flanking
defaults, or alias ISO and ASTM metrics. It keeps exact ASTM `IIC` on
the ASTM E989 basis while adding owned direct+flanking companions only
when physical inputs are present.

## Runtime Owner

Runtime owner action:

`post_v1_floor_user_material_low_density_exact_astm_direct_flanking_companion_owner_plan`

Runtime owner file:

`packages/engine/src/post-v1-floor-user-material-low-density-exact-astm-direct-flanking-companion-owner-contract.test.ts`

Runtime owner plan doc:

`docs/calculator/POST_V1_FLOOR_USER_MATERIAL_LOW_DENSITY_EXACT_ASTM_DIRECT_FLANKING_COMPANION_OWNER_PLAN_2026-06-16.md`

Runtime owner status:

`post_v1_floor_user_material_low_density_exact_astm_direct_flanking_companion_owner_landed_runtime_selected_coverage_refresh`

Previous rerank:

`post_v1_next_numeric_coverage_gap_after_floor_user_material_low_density_exact_astm_companion_plan`

Previous rerank file:

`packages/engine/src/post-v1-next-numeric-coverage-gap-after-floor-user-material-low-density-exact-astm-companion-contract.test.ts`

Previous rerank status:

`post_v1_next_numeric_coverage_gap_after_floor_user_material_low_density_exact_astm_companion_landed_no_runtime_selected_floor_user_material_low_density_exact_astm_direct_flanking_companion_owner`

Previous rerank counters:
`candidateCount: 8`, `estimatedNextRuntimeValuesMoved: 17`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.
This is not a broad source crawl.

Previous low-density exact ASTM owner:

`post_v1_floor_user_material_low_density_exact_astm_companion_owner_plan`

Previous low-density exact ASTM owner file:

`packages/engine/src/post-v1-floor-user-material-low-density-exact-astm-companion-owner-contract.test.ts`

Previous low-density exact ASTM owner status:

`post_v1_floor_user_material_low_density_exact_astm_companion_owner_landed_runtime_selected_coverage_refresh`

Previous low-density exact ASTM coverage refresh:

`post_v1_floor_user_material_low_density_exact_astm_companion_coverage_refresh_plan`

Previous low-density exact ASTM coverage refresh file:

`packages/engine/src/post-v1-floor-user-material-low-density-exact-astm-companion-coverage-refresh-contract.test.ts`

Previous low-density exact ASTM coverage refresh status:

`post_v1_floor_user_material_low_density_exact_astm_companion_coverage_refresh_landed_no_runtime_selected_next_numeric_coverage_gap`

Selected candidate:

`floor.user_material_low_density_exact_astm_direct_flanking_companion_owner`

## Calculated Values

For the pinned custom low-density visible floating-floor stack with
ASTM E492 exact lab bands, lightweight-family ISO companions, and an
explicit direct+flanking impact context, the owner returns:

- `IIC 50` on `astm_e989_impact_rating_metric_schema_adapter_bridge`;
- `Ln,w 64.3` and `DeltaLw 24.3` from the same lightweight-family route;
- direct+flanking companions `L'n,w 62`, `L'nT,w 60`, and `L'nT,50 63`;
- field/building airborne companions `R'w 51`, `Dn,w 51`, `Dn,A 50.2`,
  `DnT,w 54`, and `DnT,A 52.6` when complete field/building context is
  supplied.

Building-context lab-only airborne companions `Rw`, `STC`, `C`, and
`Ctr` remain unsupported in this owner. Generic ASTM `IIC` / `AIIC`
aliases and building prediction without direct+flanking, room, and
junction inputs remain outside.

Runtime counters:

- `newCalculableLayerTemplates: 0`;
- `newCalculableRequestShapes: 2`;
- `newCalculableTargetOutputs: 17`;
- `runtimeBasisPromotions: 2`;
- `runtimeValuesMoved 17`;
- `runtimeFormulaRetunes: 0`;
- `sourceRowsImported: 0`;
- `frontendImplementationFilesTouched: 0`.

This is not a broad source crawl.

## Selected Next

Historical selected next action at owner checkpoint:

`post_v1_floor_user_material_low_density_exact_astm_direct_flanking_companion_coverage_refresh_plan`

Historical selected next file at owner checkpoint:

`packages/engine/src/post-v1-floor-user-material-low-density-exact-astm-direct-flanking-companion-coverage-refresh-contract.test.ts`

Historical selected next plan at owner checkpoint:

`docs/calculator/POST_V1_FLOOR_USER_MATERIAL_LOW_DENSITY_EXACT_ASTM_DIRECT_FLANKING_COMPANION_COVERAGE_REFRESH_PLAN_2026-06-16.md`

Historical selected next label at owner checkpoint:

`post-V1 floor user-material low-density exact ASTM direct-flanking companion coverage refresh`

Landed coverage refresh status:

`post_v1_floor_user_material_low_density_exact_astm_direct_flanking_companion_coverage_refresh_landed_no_runtime_selected_next_numeric_coverage_gap`

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
  src/post-v1-next-numeric-coverage-gap-after-floor-user-material-low-density-exact-astm-companion-contract.test.ts \
  src/post-v1-floor-user-material-low-density-exact-astm-direct-flanking-companion-owner-contract.test.ts
```

Then run:

```bash
git diff --check
```
