# Post-V1 Project/User Measured Wall Rw Exact Bridge Coverage Refresh Plan - 2026-06-18

## Purpose

This is the selected next no-runtime coverage refresh after
`post_v1_project_user_measured_wall_rw_exact_bridge_owner_plan`.

The owner connected active project/user/team measured wall lab `Rw`
anchors to the request schema and Dynamic Calculator runtime when the
canonical wall fingerprint exactly matches the entered element-lab wall
request. This refresh should freeze that narrow answer-order step 1
behavior without opening compatible deltas, companion aliases, UI
storage, source imports, or formula retunes.

## Landing Update

Status:

`post_v1_project_user_measured_wall_rw_exact_bridge_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank`

Landed file:

`packages/engine/src/post-v1-project-user-measured-wall-rw-exact-bridge-coverage-refresh-contract.test.ts`

The refresh adds no runtime movement. It freezes exact active
project/user/team measured wall lab `Rw` request intake, exact
fingerprint runtime selection, layer-combination resolver trace
ownership, duplicate/stale/inactive schema guards, no-match fallback,
ambiguous direct-runtime rejection, and the `STC` / `C` / `Ctr` /
field/building / impact / compatible-delta outside boundaries.

Coverage refresh counters: `coverageRefreshContractFilesTouched: 1`,
`newCalculableLayerTemplates: 0`, `newCalculableRequestShapes: 0`,
`newCalculableTargetOutputs: 0`, `runtimeBasisPromotions: 0`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.

Selected next action:

`post_v1_runtime_first_route_family_rerank_after_project_user_measured_wall_rw_exact_bridge_coverage_refresh_plan`

Selected next implementation file:

`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-project-user-measured-wall-rw-exact-bridge-coverage-refresh-contract.test.ts`

Selected next plan:

`docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_PROJECT_USER_MEASURED_WALL_RW_EXACT_BRIDGE_COVERAGE_REFRESH_PLAN_2026-06-18.md`

Selected next label:

`post-V1 runtime-first route-family rerank after project/user measured wall Rw exact bridge coverage refresh`

## Previous Owner

Previous selected action:

`post_v1_project_user_measured_wall_rw_exact_bridge_owner_plan`

Previous selected file:

`packages/engine/src/post-v1-project-user-measured-wall-rw-exact-bridge-owner-contract.test.ts`

Previous selected status:

`post_v1_project_user_measured_wall_rw_exact_bridge_owner_landed_runtime_selected_coverage_refresh`

Runtime method:

`post_v1_project_user_measured_wall_rw_exact_bridge`

The owner follows
`post_v1_runtime_first_route_family_rerank_after_project_user_measured_wall_rw_anchor_schema_fingerprint_plan`
/
`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-project-user-measured-wall-rw-anchor-schema-fingerprint-contract.test.ts`
/
`post_v1_runtime_first_route_family_rerank_after_project_user_measured_wall_rw_anchor_schema_fingerprint_landed_no_runtime_selected_project_user_measured_wall_rw_exact_bridge_owner`.

Owner counters: `sharedApiFilesTouched: 1`,
`apiRouteBridgeFilesTouched: 1`, `engineRuntimeFilesTouched: 3`,
`newCalculableLayerTemplates: 0`, `newCalculableRequestShapes: 1`,
`newCalculableTargetOutputs: 1`, `runtimeBasisPromotions: 1`,
`runtimeValuesMoved 1`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.

## Selected Next

Selected next action:

`post_v1_project_user_measured_wall_rw_exact_bridge_coverage_refresh_plan`

Selected next implementation file:

`packages/engine/src/post-v1-project-user-measured-wall-rw-exact-bridge-coverage-refresh-contract.test.ts`

Selected next plan:

`docs/calculator/POST_V1_PROJECT_USER_MEASURED_WALL_RW_EXACT_BRIDGE_COVERAGE_REFRESH_PLAN_2026-06-18.md`

Selected next label:

`post-V1 project/user measured wall Rw exact bridge coverage refresh`

## Scope

Add a no-runtime coverage contract that protects:

- matching active project/user measured wall lab `Rw` anchors continue
  to publish exact `Rw` through
  `post_v1_project_user_measured_wall_rw_exact_bridge`;
- `EstimateRequestSchema` preserves active
  `airborneMeasuredSourceAnchors` and rejects inactive, stale, duplicate
  id, and duplicate fingerprint rows;
- no-match active anchors fall back to the existing owned formula/source
  route without changing values;
- `STC`, `C`, `Ctr`, mixed lab requests, field/building outputs, impact
  outputs, and compatible exterior-board deltas remain outside this
  exact bridge;
- layer-combination resolver trace and Answer Engine V1 owner audit keep
  `Rw` supported only when the exact `Rw` bridge is selected.

## Boundaries

Do not:

- import source rows or crawl the web;
- retune formulas;
- add UI/storage anchor management;
- turn a single-number measured `Rw` into a measured frequency curve;
- publish `STC`, `C`, `Ctr`, `R'w`, `Dn,w`, `DnT,w`, `IIC`, or impact
  metrics from this `Rw` anchor;
- implement compatible-delta matching.

If the refresh discovers a gap, fix only the boundary needed to preserve
the landed exact `Rw` owner. New runtime movement requires a new owner
plan and rerank.

## Validation

Run:

```bash
pnpm --filter @dynecho/shared exec vitest run src/api/estimate.test.ts src/domain/project-user-measured-source-anchor.test.ts --maxWorkers=1
pnpm --filter @dynecho/engine exec vitest run src/post-v1-project-user-measured-wall-rw-exact-bridge-owner-contract.test.ts src/post-v1-runtime-first-route-family-rerank-after-project-user-measured-wall-rw-anchor-schema-fingerprint-contract.test.ts --maxWorkers=1
pnpm --filter @dynecho/shared typecheck
git diff --check
```

Because this refresh should move no runtime behavior, `pnpm
calculator:gate:current` is useful but not mandatory unless the refresh
implementation changes runtime code.
