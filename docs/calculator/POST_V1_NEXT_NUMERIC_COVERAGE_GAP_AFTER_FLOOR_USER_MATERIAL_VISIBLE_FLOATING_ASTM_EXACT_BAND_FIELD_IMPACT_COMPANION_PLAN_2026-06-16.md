# Post-V1 Next Numeric Coverage Gap After Floor User-Material Visible Floating ASTM Exact-Band Field Impact Companion Plan - 2026-06-16

Plan doc:

`docs/calculator/POST_V1_NEXT_NUMERIC_COVERAGE_GAP_AFTER_FLOOR_USER_MATERIAL_VISIBLE_FLOATING_ASTM_EXACT_BAND_FIELD_IMPACT_COMPANION_PLAN_2026-06-16.md`

## North Star

DynEcho is an acoustic calculator. This rerank must choose the next
highest-ROI calculator slice after closing the custom visible heavy
floating-floor exact ASTM field-impact companion owner. A valid next
slice must increase calculable layer combinations, numeric target
outputs, formula-route ownership, route-required input capture, or
metric/basis integrity.

Reject UI polish, broad source crawling, source rows for their own sake,
confidence wording, generic refactoring, and formula retuning without
new evidence. This is not a broad source crawl.

## Previous Runtime Chain

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

Coverage refresh:

`post_v1_floor_user_material_visible_floating_astm_exact_band_field_impact_companion_coverage_refresh_plan`

Coverage refresh file:

`packages/engine/src/post-v1-floor-user-material-visible-floating-astm-exact-band-field-impact-companion-coverage-refresh-contract.test.ts`

Coverage refresh status:

`post_v1_floor_user_material_visible_floating_astm_exact_band_field_impact_companion_coverage_refresh_landed_no_runtime_selected_next_numeric_coverage_gap`

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

## Closed Lanes To Subtract

- custom visible heavy floating-floor dynamic stiffness/load-basis ISO
  `Ln,w` / `DeltaLw`;
- custom visible heavy floating-floor mixed lab companions with complete
  field impact context;
- custom visible heavy floating-floor heavy airborne companions
  `Rw`, `STC`, `C`, and `Ctr`;
- exact ASTM `IIC` / `AIIC` mixed with same-stack ISO companions;
- exact ASTM `IIC` / `AIIC` mixed with complete field impact companions.

## Candidate Priorities

Prefer the first candidate that can move runtime values without
weakening existing boundaries:

1. Generic ASTM `IIC` / `AIIC` input-surface owner only if the engine can
   require exact ASTM band data instead of aliasing ISO impact values.
2. Low-density or non-heavy custom floor carrier owner only if a
   physically owned route or defensible input boundary exists.
3. Next custom visible floating-floor request shape that carries owned
   ISO/ASTM/field/airborne companions but is currently parked by routing
   or audit ownership.
4. A boundary owner that captures missing physical inputs when it unlocks
   a concrete follow-on runtime slice.

Do not choose a slice that only updates documentation or test inventory.

## Landed Rerank

Rerank action:

`post_v1_next_numeric_coverage_gap_after_floor_user_material_visible_floating_astm_exact_band_field_impact_companion_plan`

Rerank status:

`post_v1_next_numeric_coverage_gap_after_floor_user_material_visible_floating_astm_exact_band_field_impact_companion_landed_no_runtime_selected_floor_user_material_low_density_exact_astm_companion_owner`

Rerank file:

`packages/engine/src/post-v1-next-numeric-coverage-gap-after-floor-user-material-visible-floating-astm-exact-band-field-impact-companion-contract.test.ts`

Selected candidate:

`floor.user_material_low_density_exact_astm_companion_owner`

The rerank ran `roiAnalysisIterations: 4` and `candidateCount: 11`.
It subtracts closed visible floating load-basis, mixed lab-companion,
heavy airborne companion, exact ASTM mixed ISO companion, and exact ASTM
field-impact companion lanes. It selects the custom low-density exact
ASTM companion owner because the same stack already owns lightweight
family `Rw` / `Ln,w`, lightweight dynamic `DeltaLw`, field impact
companions, and exact ASTM `IIC` / `AIIC`; exact ASTM source currently
parks those lightweight companions instead of merging them.

Estimated next counters: `estimatedNextRuntimeValuesMoved: 12`,
`estimatedNextCalculableRequestShapes: 2`,
`estimatedNextCalculableTargetOutputs: 10`, and
`estimatedNextRuntimeBasisPromotions: 4`. Closeout counters:
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.
This is not a broad source crawl.

## Selected Next

Current selected next action:

`post_v1_floor_user_material_low_density_exact_astm_companion_owner_plan`

Current selected next file:

`packages/engine/src/post-v1-floor-user-material-low-density-exact-astm-companion-owner-contract.test.ts`

Current selected next plan doc:

`docs/calculator/POST_V1_FLOOR_USER_MATERIAL_LOW_DENSITY_EXACT_ASTM_COMPANION_OWNER_PLAN_2026-06-16.md`

Current selected next label:

`post-V1 floor user-material low-density exact ASTM companion owner`

## Validation

Run targeted Vitest:

```bash
pnpm --filter @dynecho/engine exec vitest run \
  src/post-v1-floor-user-material-visible-floating-astm-exact-band-field-impact-companion-coverage-refresh-contract.test.ts \
  src/post-v1-next-numeric-coverage-gap-after-floor-user-material-visible-floating-astm-exact-band-field-impact-companion-contract.test.ts
```

Before handoff, run:

```bash
pnpm calculator:gate:current
git diff --check
```
