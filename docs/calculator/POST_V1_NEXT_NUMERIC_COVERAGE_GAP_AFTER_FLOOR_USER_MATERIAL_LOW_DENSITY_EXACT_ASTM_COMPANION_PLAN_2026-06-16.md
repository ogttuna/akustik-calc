# Post-V1 Next Numeric Coverage Gap After Floor User-Material Low-Density Exact ASTM Companion Plan - 2026-06-16

Plan doc:

`docs/calculator/POST_V1_NEXT_NUMERIC_COVERAGE_GAP_AFTER_FLOOR_USER_MATERIAL_LOW_DENSITY_EXACT_ASTM_COMPANION_PLAN_2026-06-16.md`

## North Star

DynEcho is an acoustic calculator. This rerank must choose the next
highest-ROI calculator slice after closing the custom low-density exact
ASTM companion owner and its coverage refresh.

Rerank action:

`post_v1_next_numeric_coverage_gap_after_floor_user_material_low_density_exact_astm_companion_plan`

Rerank file:

`packages/engine/src/post-v1-next-numeric-coverage-gap-after-floor-user-material-low-density-exact-astm-companion-contract.test.ts`

Valid candidates must increase calculable layer combinations, numeric
target outputs, formula-route ownership, route-required input capture, or
metric/basis integrity. Reject UI work, broad source crawling,
confidence wording, generic refactors, and formula retunes without new
evidence. This is not a broad source crawl.

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

Coverage refresh:

`post_v1_floor_user_material_low_density_exact_astm_companion_coverage_refresh_plan`

Coverage refresh file:

`packages/engine/src/post-v1-floor-user-material-low-density-exact-astm-companion-coverage-refresh-contract.test.ts`

Coverage refresh status:

`post_v1_floor_user_material_low_density_exact_astm_companion_coverage_refresh_landed_no_runtime_selected_next_numeric_coverage_gap`

Selected candidate re-probed by the coverage refresh:

`floor.user_material_low_density_exact_astm_companion_owner`

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
- exact ASTM `IIC` / `AIIC` mixed with same-stack ISO and field impact
  companions for heavy visible floating floors;
- custom low-density visible floating-floor exact ASTM companion requests
  with `Rw 53`, `Ln,w 64.3`, `DeltaLw 24.3`, `L'n,w 66.3`,
  `L'nT,w 63.9`, `L'nT,50 66.9`, and exact ASTM `IIC 50` / `AIIC 50`.

## Candidate Priorities

Prefer the first candidate that can move runtime values without weakening
existing boundaries:

1. Low-density exact ASTM airborne companion owner if complete same-stack
   low-density `STC`, `C`, or `Ctr` values are already physically owned
   but not surfaced with exact ASTM requests.
2. Low-density exact ASTM input-surface owner if the same runtime route is
   parked only because dynamic stiffness/load basis is supplied in an
   alternate owned field, not because the physical input is absent.
3. Generic ASTM input-surface owner only if exact ASTM band data can be
   required without aliasing ISO `Ln,w`, `IIC`, or `AIIC`.
4. Another floor user-material route with owned formula inputs and
   calculable target outputs; no source crawl or UI-only slice.

Do not select another no-runtime closeout unless a just-landed runtime
owner needs immediate protection.

## Landed Rerank Result

Rerank status:

`post_v1_next_numeric_coverage_gap_after_floor_user_material_low_density_exact_astm_companion_landed_no_runtime_selected_floor_user_material_low_density_exact_astm_direct_flanking_companion_owner`

Selected candidate:

`floor.user_material_low_density_exact_astm_direct_flanking_companion_owner`

Selected next action:

`post_v1_floor_user_material_low_density_exact_astm_direct_flanking_companion_owner_plan`

Selected next file:

`packages/engine/src/post-v1-floor-user-material-low-density-exact-astm-direct-flanking-companion-owner-contract.test.ts`

Selected next plan:

`docs/calculator/POST_V1_FLOOR_USER_MATERIAL_LOW_DENSITY_EXACT_ASTM_DIRECT_FLANKING_COMPANION_OWNER_PLAN_2026-06-16.md`

Selected next label:

`post-V1 floor user-material low-density exact ASTM direct-flanking companion owner`

The rerank ran `roiAnalysisIterations: 4` across `candidateCount: 8`.
It rejected closed low-density exact ASTM airborne/embedded-input lanes,
generic ASTM aliases, building prediction without flanking context,
formula retuning without holdout evidence, and broad source crawling.
The selected runtime owner is high ROI because custom low-density exact
ASTM requests with explicit direct+flanking impact context currently
have all required physical inputs but were blocked by an ASTM metric
basis exception. Estimated next movement:
`estimatedNextRuntimeValuesMoved: 17`,
`estimatedNextRuntimeBasisPromotions: 2`,
`estimatedNextCalculableRequestShapes: 2`, and
`estimatedNextCalculableTargetOutputs: 17`. Closeout counters:
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.
This is not a broad source crawl.

## Validation

Run targeted Vitest:

```bash
pnpm --filter @dynecho/engine exec vitest run \
  src/post-v1-floor-user-material-low-density-exact-astm-companion-coverage-refresh-contract.test.ts \
  src/post-v1-next-numeric-coverage-gap-after-floor-user-material-low-density-exact-astm-companion-contract.test.ts
```

Before handoff, run:

```bash
pnpm calculator:gate:current
git diff --check
```
