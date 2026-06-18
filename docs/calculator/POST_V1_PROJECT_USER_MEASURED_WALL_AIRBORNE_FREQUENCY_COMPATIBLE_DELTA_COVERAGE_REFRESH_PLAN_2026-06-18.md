# Post-V1 Project/User Measured Wall Airborne Frequency Compatible-Delta Coverage Refresh Plan - 2026-06-18

## Purpose

This is the selected next no-runtime coverage refresh after
`post_v1_project_user_measured_wall_airborne_frequency_compatible_delta_owner_plan`.

The runtime owner moved the calculator in the intended direction: active
project/user measured wall airborne TL curves can now anchor a bounded
near-measured element-lab wall calculation when the entered construction
adds a compatible exterior board. This refresh should freeze that value
movement and protect the boundaries before any new ROI slice is chosen.

This is not a source crawl, formula retune, UI/storage task, or a new
runtime owner.

## Previous Owner

Owner action:

`post_v1_project_user_measured_wall_airborne_frequency_compatible_delta_owner_plan`

Owner file:

`packages/engine/src/post-v1-project-user-measured-wall-airborne-frequency-compatible-delta-owner-contract.test.ts`

Owner plan:

`docs/calculator/POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_COMPATIBLE_DELTA_OWNER_PLAN_2026-06-18.md`

Owner status:

`post_v1_project_user_measured_wall_airborne_frequency_compatible_delta_owner_landed_runtime_selected_coverage_refresh`

Selected candidate:

`project_user_measured_wall_airborne_frequency_compatible_delta_owner`

Runtime method:

`post_v1_project_user_measured_wall_airborne_frequency_compatible_delta`

Owner counters: `newCalculableLayerTemplates: 0`,
`newCalculableRequestShapes: 4`, `newCalculableTargetOutputs: 4`,
`runtimeBasisPromotions: 1`, `runtimeValuesMoved 4`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`,
`frontendImplementationFilesTouched: 0`, and
`unsupportedBoundariesProtected: 7`.

## Selected Next

Selected next action:

`post_v1_project_user_measured_wall_airborne_frequency_compatible_delta_coverage_refresh_plan`

Selected next file:

`packages/engine/src/post-v1-project-user-measured-wall-airborne-frequency-compatible-delta-coverage-refresh-contract.test.ts`

Selected next label:

`post-V1 project/user measured wall airborne frequency compatible-delta coverage refresh`

## Landing Update - 2026-06-18

Status:

`post_v1_project_user_measured_wall_airborne_frequency_compatible_delta_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank`

Coverage refresh file:

`packages/engine/src/post-v1-project-user-measured-wall-airborne-frequency-compatible-delta-coverage-refresh-contract.test.ts`

Coverage refresh plan doc:

`docs/calculator/POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_COMPATIBLE_DELTA_COVERAGE_REFRESH_PLAN_2026-06-18.md`

The refresh freezes the runtime owner without moving additional
calculator values. It protects one-side and paired exterior-board
compatible deltas, single-output and mixed lab target-output
independence, exact measured full-stack precedence, missing standard
boundaries, ambiguous reduced-stack anchor failure, field/building and
impact outside boundaries, scalar `Rw` anchor separation, and resolver
trace provenance as compatible-delta rather than exact measured source.

Counters: `coverageRefreshContractFilesTouched: 1`,
`newCalculableLayerTemplates: 0`, `newCalculableRequestShapes: 0`,
`newCalculableTargetOutputs: 0`, `runtimeBasisPromotions: 0`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.

Current selected next action:

`post_v1_runtime_first_route_family_rerank_after_project_user_measured_wall_airborne_frequency_compatible_delta_coverage_refresh_plan`

Current selected next file:

`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-project-user-measured-wall-airborne-frequency-compatible-delta-coverage-refresh-contract.test.ts`

Current selected next plan doc:

`docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_COMPATIBLE_DELTA_COVERAGE_REFRESH_PLAN_2026-06-18.md`

Current selected next label:

`post-V1 runtime-first route-family rerank after project/user measured wall airborne frequency compatible-delta coverage refresh`

## Coverage Scope

The refresh should protect:

- positive one-side exterior board delta from a reduced active measured
  frequency anchor;
- target-output independence for single `Rw`, `STC`, `C`, and `Ctr`;
- mixed lab output support for `Rw`/`STC`/`C`/`Ctr`;
- exact full-stack measured curve precedence over compatible delta;
- missing `ASTM E413` keeps `STC` unsupported;
- missing `ISO 717-1` keeps `Rw`, `C`, and `Ctr` unsupported;
- ambiguous reduced-stack anchors fail closed;
- field/building, impact/IIC/AIIC, OITC, scalar-Rw-anchor, non-board,
  cavity, absorber, support, and middle-layer changes stay outside;
- resolver/candidate trace reports compatible-delta, not exact measured
  override;
- no runtime value movement in this refresh.

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

## Validation

Run:

```bash
pnpm --filter @dynecho/engine exec vitest run src/post-v1-project-user-measured-wall-airborne-frequency-compatible-delta-owner-contract.test.ts src/post-v1-project-user-measured-wall-airborne-frequency-compatible-delta-coverage-refresh-contract.test.ts --maxWorkers=1
git diff --check
```

Before closeout, also run the adjacent exact-curve coverage/rerank tests
to confirm the exact-measured row still outranks this compatible delta.
