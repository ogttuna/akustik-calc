# Post-V1 Project/User Measured Wall Airborne Frequency Exact Curve Bridge Coverage Refresh Plan - 2026-06-18

## Purpose

This is the selected next no-runtime coverage refresh after
`post_v1_project_user_measured_wall_airborne_frequency_exact_curve_bridge_owner_plan`.

The owner now accepts active project/user/team measured wall lab
airborne transmission-loss curve anchors through
`airborneMeasuredFrequencySourceAnchors`, matches them by canonical
fingerprint against the current element-lab wall request, rates the
measured curve through the existing curve-rating infrastructure, and
publishes only basis-owned lab `Rw`, `STC`, `C`, and `Ctr` outputs.

The refresh should freeze that behavior without retuning formulas,
importing source rows, widening field/building adapters, or changing UI
storage.

## Landed Coverage Refresh

Coverage refresh action:
`post_v1_project_user_measured_wall_airborne_frequency_exact_curve_bridge_coverage_refresh_plan`

Coverage refresh file:
`packages/engine/src/post-v1-project-user-measured-wall-airborne-frequency-exact-curve-bridge-coverage-refresh-contract.test.ts`

Coverage refresh plan:
`docs/calculator/POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_EXACT_CURVE_BRIDGE_COVERAGE_REFRESH_PLAN_2026-06-18.md`

Coverage refresh status:
`post_v1_project_user_measured_wall_airborne_frequency_exact_curve_bridge_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank`

Selected next action:
`post_v1_runtime_first_route_family_rerank_after_project_user_measured_wall_airborne_frequency_exact_curve_bridge_coverage_refresh_plan`

Selected next file:
`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-project-user-measured-wall-airborne-frequency-exact-curve-bridge-coverage-refresh-contract.test.ts`

Selected next plan:
`docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_EXACT_CURVE_BRIDGE_COVERAGE_REFRESH_PLAN_2026-06-18.md`

Selected next label:
`post-V1 runtime-first route-family rerank after project/user measured wall airborne frequency exact curve bridge coverage refresh`

Counters: `coverageRefreshContractFilesTouched: 1`,
`newCalculableLayerTemplates: 0`, `newCalculableRequestShapes: 0`,
`newCalculableTargetOutputs: 0`, `runtimeBasisPromotions: 0`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.

## Previous Owner

Owner action:
`post_v1_project_user_measured_wall_airborne_frequency_exact_curve_bridge_owner_plan`

Owner file:
`packages/engine/src/post-v1-project-user-measured-wall-airborne-frequency-exact-curve-bridge-owner-contract.test.ts`

Owner runtime method:
`post_v1_project_user_measured_wall_airborne_frequency_exact_curve_bridge`

Owner status:
`post_v1_project_user_measured_wall_airborne_frequency_exact_curve_bridge_owner_landed_runtime_selected_coverage_refresh`

Implemented candidate:
`project_user_measured_wall_airborne_frequency_exact_curve_bridge_owner`

Counters: `sharedApiFilesTouched: 1`, `apiRouteBridgeFilesTouched: 1`,
`engineRuntimeFilesTouched: 4`, `newCalculableLayerTemplates: 0`,
`newCalculableRequestShapes: 4`, `newCalculableTargetOutputs: 4`,
`runtimeBasisPromotions: 1`, `runtimeValuesMoved 4`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`.

## Coverage Scope

Add or refresh a focused contract that protects:

- request intake for active measured wall airborne frequency anchors,
  including stale, inactive, duplicate id, and duplicate fingerprint
  rejection;
- exact element-lab wall fingerprint matching only;
- measured curve rating for single-output `Rw`, `STC`, `C`, `Ctr`, and
  mixed lab output requests;
- scalar `Rw` anchor separation, with curve anchors taking precedence
  only for curve-owned target outputs;
- missing rating-standard boundary, where absent `ISO 717-1` or
  `ASTM E413` leaves that target output unsupported instead of aliasing;
- field/building/impact and mixed lab+field requests staying outside;
- resolver basis, candidate resolution, layer-combination trace, and
  warning text continuing to identify the exact measured curve owner.

## Boundaries

Do not in this refresh:

- move new runtime values;
- change the curve-rating formulas;
- infer companions from scalar `Rw`;
- accept field/building measured curves;
- add compatible deltas, near-match reuse, source crawling, UI storage,
  or frontend input flows.

## Validation

Run:

```bash
pnpm --filter @dynecho/shared exec vitest run src/api/estimate.test.ts src/domain/project-user-measured-source-anchor.test.ts --maxWorkers=1
pnpm --filter @dynecho/engine exec vitest run src/post-v1-runtime-first-route-family-rerank-after-project-user-measured-wall-airborne-frequency-anchor-schema-fingerprint-contract.test.ts src/post-v1-project-user-measured-wall-airborne-frequency-exact-curve-bridge-owner-contract.test.ts src/post-v1-project-user-measured-wall-airborne-frequency-exact-curve-bridge-coverage-refresh-contract.test.ts --maxWorkers=1
git diff --check
```

If the refresh changes shared schemas, estimate route plumbing,
candidate resolver behavior, or Answer Engine V1 ownership boundaries,
also run `pnpm calculator:gate:current`.
