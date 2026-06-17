# Post-V1 Floor User-Material Visible Floating Heavy Airborne Companion Owner Plan - 2026-06-16

## North Star

DynEcho is an acoustic calculator. This owner exists to improve the
numeric basis of a real user-entered floor construction, not to polish UI,
crawl sources, label confidence, or retune formulas without evidence.

The selected gap is a custom visible heavy floating-floor stack where
the impact side is already physically owned by the heavy floating-floor
ISO 12354 Annex C route, but the lab airborne companion outputs still
come from the generic screening mass-law basis. A market-grade
calculator should not leave `Rw` companions on a generic screening basis
when the same route already proves a heavy concrete floating-floor
family boundary.

## Previous Chain

Runtime owner action:

`post_v1_floor_user_material_visible_floating_mixed_lab_companion_owner_plan`

Runtime owner file:

`packages/engine/src/post-v1-floor-user-material-visible-floating-mixed-lab-companion-owner-contract.test.ts`

Runtime owner status:

`post_v1_floor_user_material_visible_floating_mixed_lab_companion_owner_landed_runtime_selected_coverage_refresh`

Coverage refresh action:

`post_v1_floor_user_material_visible_floating_mixed_lab_companion_coverage_refresh_plan`

Coverage refresh file:

`packages/engine/src/post-v1-floor-user-material-visible-floating-mixed-lab-companion-coverage-refresh-contract.test.ts`

Coverage refresh status:

`post_v1_floor_user_material_visible_floating_mixed_lab_companion_coverage_refresh_landed_no_runtime_selected_next_numeric_coverage_gap`

Numeric-gap rerank action:

`post_v1_next_numeric_coverage_gap_after_floor_user_material_visible_floating_mixed_lab_companion_plan`

Numeric-gap rerank file:

`packages/engine/src/post-v1-next-numeric-coverage-gap-after-floor-user-material-visible-floating-mixed-lab-companion-contract.test.ts`

Numeric-gap rerank status:

`post_v1_next_numeric_coverage_gap_after_floor_user_material_visible_floating_mixed_lab_companion_landed_no_runtime_selected_floor_user_material_visible_floating_heavy_airborne_companion_owner`

Selected candidate:

`floor.user_material_visible_floating_heavy_airborne_companion_owner`

Current selected next action:

`post_v1_floor_user_material_visible_floating_heavy_airborne_companion_owner_plan`

Current selected next file:

`packages/engine/src/post-v1-floor-user-material-visible-floating-heavy-airborne-companion-owner-contract.test.ts`

Current selected next plan:

`docs/calculator/POST_V1_FLOOR_USER_MATERIAL_VISIBLE_FLOATING_HEAVY_AIRBORNE_COMPANION_OWNER_PLAN_2026-06-16.md`

Current selected next label:

`post-V1 floor user-material visible floating heavy airborne companion owner`

Runtime owner status:

`post_v1_floor_user_material_visible_floating_heavy_airborne_companion_owner_landed_runtime_selected_coverage_refresh`

Selected coverage refresh action:

`post_v1_floor_user_material_visible_floating_heavy_airborne_companion_coverage_refresh_plan`

Selected coverage refresh file:

`packages/engine/src/post-v1-floor-user-material-visible-floating-heavy-airborne-companion-coverage-refresh-contract.test.ts`

Selected coverage refresh plan:

`docs/calculator/POST_V1_FLOOR_USER_MATERIAL_VISIBLE_FLOATING_HEAVY_AIRBORNE_COMPANION_COVERAGE_REFRESH_PLAN_2026-06-16.md`

Selected coverage refresh label:

`post-V1 floor user-material visible floating heavy airborne companion coverage refresh`

Landed coverage refresh status:

`post_v1_floor_user_material_visible_floating_heavy_airborne_companion_coverage_refresh_landed_no_runtime_selected_next_numeric_coverage_gap`

Selected next after coverage refresh:

`post_v1_next_numeric_coverage_gap_after_floor_user_material_visible_floating_heavy_airborne_companion_plan`
/
`packages/engine/src/post-v1-next-numeric-coverage-gap-after-floor-user-material-visible-floating-heavy-airborne-companion-contract.test.ts`
/
`docs/calculator/POST_V1_NEXT_NUMERIC_COVERAGE_GAP_AFTER_FLOOR_USER_MATERIAL_VISIBLE_FLOATING_HEAVY_AIRBORNE_COMPANION_PLAN_2026-06-16.md`

Coverage refresh counters: `coverageRefreshContractFilesTouched: 1`,
`newCalculableLayerTemplates: 0`, `newCalculableRequestShapes: 0`,
`newCalculableTargetOutputs: 0`, `runtimeBasisPromotions: 0`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.
This is not a broad source crawl.

Rerank counters: `candidateCount 8`, `roiAnalysisIterations: 4`,
`estimatedNextRuntimeBasisPromotions: 1`,
`estimatedNextRuntimeValuesMoved: 2`,
`estimatedNextCalculableRequestShapes: 1`,
`estimatedNextCalculableTargetOutputs: 4`, `runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`. This is not a broad source
crawl.

## Current Runtime Gap

Pinned custom stack:

- 8 mm custom tile at 2200 kg/m3;
- 30 mm custom screed at 2000 kg/m3;
- 8 mm custom resilient underlay at 650 kg/m3 with
  `impact.dynamicStiffnessMNm3: 30`;
- 150 mm custom heavy concrete at 2400 kg/m3.

Current behavior:

- `Ln,w 50.1` and `DeltaLw 24.4` are calculated through
  `predictor_heavy_floating_floor_iso12354_annexc_estimate`;
- `Rw 57`, `Rw+Ctr 49.9`, `STC`, `C`, and `Ctr` are supported, but the floor airborne
  companion basis remains `screening_mass_law_curve_seed_v3`;
- `floor-system-ratings.ts` already has the heavy companion basis
  `predictor_heavy_concrete_floor_airborne_companion_estimate` for heavy
  impact routes, but the visible assembly path currently prefers the
  screening basis whenever a screening Rw exists.

## Implementation Scope

Implement:

1. Add a contract file:
   `packages/engine/src/post-v1-floor-user-material-visible-floating-heavy-airborne-companion-owner-contract.test.ts`.
2. Pin the current custom heavy visible floating-floor stack from the
   rerank and assert the owner promotes the floor airborne companion
   basis from `screening_mass_law_curve_seed_v3` to
   `predictor_heavy_concrete_floor_airborne_companion_estimate`.
3. Keep the owner restricted to physically complete heavy floating-floor
   requests where the impact calculation basis is
   `predictor_heavy_floating_floor_iso12354_annexc_estimate`.
4. Preserve impact values already owned by the previous slices:
   `Ln,w 50.1`, `DeltaLw 24.4`, explicit `CI`, `CI,50-2500`,
   `Ln,w+CI`, and complete field outputs when their required inputs are
   present.
5. Do not promote low-density custom concrete, missing dynamic
   stiffness, missing load basis, incomplete field context, generic
   `IIC`, or generic `AIIC`.
6. Select a follow-up coverage refresh after the runtime owner lands.

## Expected Runtime Movement

Expected owner counters:

- `newCalculableLayerTemplates: 0`;
- `newCalculableRequestShapes: 0`;
- `newCalculableTargetOutputs: 0`;
- `accuracyPromotedRequestShapes: 1`;
- `accuracyPromotedTargetOutputs: 4`;
- `runtimeBasisPromotions: 1`;
- `runtimeValuesMoved 2`;
- `runtimeFormulaRetunes: 0`;
- `sourceRowsImported: 0`;
- `frontendImplementationFilesTouched: 0`.

Landed owner status:

`post_v1_floor_user_material_visible_floating_heavy_airborne_companion_owner_landed_runtime_selected_coverage_refresh`

Selected next after landing:

`post_v1_floor_user_material_visible_floating_heavy_airborne_companion_coverage_refresh_plan`
/
`packages/engine/src/post-v1-floor-user-material-visible-floating-heavy-airborne-companion-coverage-refresh-contract.test.ts`
/
`docs/calculator/POST_V1_FLOOR_USER_MATERIAL_VISIBLE_FLOATING_HEAVY_AIRBORNE_COMPANION_COVERAGE_REFRESH_PLAN_2026-06-16.md`

The expected value movement is deliberately narrow: the first owner
should promote the existing heavy companion basis for the same custom
heavy floating-floor construction. It should not claim broader airborne
formula ownership or add a new source row.

## Out Of Scope

- Broad source crawling for floor assemblies;
- UI work, material-editor work, or report work;
- formula retuning without validation evidence;
- `IIC` / `AIIC` aliasing from ISO impact outputs;
- silent defaults for CI, CI50, dynamic stiffness, load basis, field K,
  receiving-room volume, or ASTM bands;
- low-density/lightweight floating-floor airborne companion promotion.

## Validation

Run targeted Vitest while iterating:

```bash
pnpm --filter @dynecho/engine exec vitest run \
  src/post-v1-next-numeric-coverage-gap-after-floor-user-material-visible-floating-mixed-lab-companion-contract.test.ts \
  src/post-v1-floor-user-material-visible-floating-heavy-airborne-companion-owner-contract.test.ts
```

Before handoff, run:

```bash
git diff --check
```

If runtime behavior moves, run the current calculator gate before the
final handoff:

```bash
pnpm calculator:gate:current
```
