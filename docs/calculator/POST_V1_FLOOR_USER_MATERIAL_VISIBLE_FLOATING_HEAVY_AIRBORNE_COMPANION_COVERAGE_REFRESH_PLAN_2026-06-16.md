# Post-V1 Floor User-Material Visible Floating Heavy Airborne Companion Coverage Refresh Plan - 2026-06-16

## North Star

DynEcho is an acoustic calculator. This coverage refresh exists only to
re-probe the newly landed custom visible heavy floating-floor airborne
companion owner and protect the calculator behavior it moved. It is not
a source crawl, UI pass, confidence-copy task, or formula retune.

## Previous Chain

Selected rerank action:

`post_v1_next_numeric_coverage_gap_after_floor_user_material_visible_floating_mixed_lab_companion_plan`

Selected rerank file:

`packages/engine/src/post-v1-next-numeric-coverage-gap-after-floor-user-material-visible-floating-mixed-lab-companion-contract.test.ts`

Selected rerank status:

`post_v1_next_numeric_coverage_gap_after_floor_user_material_visible_floating_mixed_lab_companion_landed_no_runtime_selected_floor_user_material_visible_floating_heavy_airborne_companion_owner`

Runtime owner action:

`post_v1_floor_user_material_visible_floating_heavy_airborne_companion_owner_plan`

Runtime owner file:

`packages/engine/src/post-v1-floor-user-material-visible-floating-heavy-airborne-companion-owner-contract.test.ts`

Runtime owner status:

`post_v1_floor_user_material_visible_floating_heavy_airborne_companion_owner_landed_runtime_selected_coverage_refresh`

Selected candidate:

`floor.user_material_visible_floating_heavy_airborne_companion_owner`

## Landed Owner Behavior To Refresh

The owner promotes the custom visible heavy floating-floor lab airborne
companion from generic `screening_mass_law_curve_seed_v3` to
`predictor_heavy_concrete_floor_airborne_companion_estimate` when the
impact route proves heavy floating-floor ownership through
`predictor_heavy_floating_floor_iso12354_annexc_estimate`.

Pinned moved values:

- floor airborne companion `Rw 58`;
- floor airborne companion `Ctr -7.3`;
- impact `Ln,w 50.1`;
- impact `DeltaLw 24.4`;
- complete field context still supports `L'n,w 52.1`, `L'nT,w 49.7`,
  and `L'nT,50 52.7`;
- low-density, missing dynamic stiffness, and generic `IIC` / `AIIC`
  remain outside the owner.

Runtime owner counters: `accuracyPromotedRequestShapes: 1`,
`accuracyPromotedTargetOutputs: 4`, `newCalculableLayerTemplates: 0`,
`newCalculableRequestShapes: 0`, `newCalculableTargetOutputs: 0`,
`runtimeBasisPromotions: 1`, `runtimeValuesMoved 2`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`. This is not a broad source
crawl.

## Selected Work

Current selected next action:

`post_v1_floor_user_material_visible_floating_heavy_airborne_companion_coverage_refresh_plan`

Current selected next file:

`packages/engine/src/post-v1-floor-user-material-visible-floating-heavy-airborne-companion-coverage-refresh-contract.test.ts`

Current selected next plan:

`docs/calculator/POST_V1_FLOOR_USER_MATERIAL_VISIBLE_FLOATING_HEAVY_AIRBORNE_COMPANION_COVERAGE_REFRESH_PLAN_2026-06-16.md`

Current selected next label:

`post-V1 floor user-material visible floating heavy airborne companion coverage refresh`

Landed coverage refresh status:

`post_v1_floor_user_material_visible_floating_heavy_airborne_companion_coverage_refresh_landed_no_runtime_selected_next_numeric_coverage_gap`

Selected next after landing:

`post_v1_next_numeric_coverage_gap_after_floor_user_material_visible_floating_heavy_airborne_companion_plan`
/
`packages/engine/src/post-v1-next-numeric-coverage-gap-after-floor-user-material-visible-floating-heavy-airborne-companion-contract.test.ts`
/
`docs/calculator/POST_V1_NEXT_NUMERIC_COVERAGE_GAP_AFTER_FLOOR_USER_MATERIAL_VISIBLE_FLOATING_HEAVY_AIRBORNE_COMPANION_PLAN_2026-06-16.md`
/
`post-V1 next numeric coverage gap after floor user-material visible floating heavy airborne companion`

## Refresh Scope

The next contract should re-probe:

1. custom visible heavy floating-floor lab airborne companion basis and
   moved values;
2. complete impact field context after the owner;
3. low-density custom concrete staying outside the heavy owner;
4. missing dynamic stiffness staying unpromoted;
5. generic `IIC` / `AIIC` staying unsupported.

Expected refresh counters: `coverageRefreshContractFilesTouched: 1`,
`newCalculableLayerTemplates: 0`, `newCalculableRequestShapes: 0`,
`newCalculableTargetOutputs: 0`, `runtimeBasisPromotions: 0`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.

## Validation

Run:

```bash
pnpm --filter @dynecho/engine exec vitest run \
  src/post-v1-floor-user-material-visible-floating-heavy-airborne-companion-owner-contract.test.ts \
  src/post-v1-floor-user-material-visible-floating-heavy-airborne-companion-coverage-refresh-contract.test.ts
```

Then run:

```bash
git diff --check
```
