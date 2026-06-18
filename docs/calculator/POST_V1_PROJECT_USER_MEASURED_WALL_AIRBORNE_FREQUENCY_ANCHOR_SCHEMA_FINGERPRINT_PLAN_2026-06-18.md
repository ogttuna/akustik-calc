# Post-V1 Project/User Measured Wall Airborne Frequency Anchor Schema + Fingerprint Plan - 2026-06-18

## Purpose

This is the selected next shared-domain prerequisite after
`post_v1_runtime_first_route_family_rerank_after_project_user_measured_wall_rw_exact_bridge_coverage_refresh_plan`.

The landed exact bridge intentionally accepts only scalar active
project/user/team measured wall lab `Rw` anchors. The next calculator
step is not to infer `STC`, `C`, `Ctr`, or `OITC` from that scalar row.
It is to add a measured airborne transmission-loss frequency-curve
anchor schema and canonical fingerprint so future runtime work can
derive companion metrics from source-owned bands through explicit
rating adapters.

## Landing Update

Status:

`post_v1_project_user_measured_wall_airborne_frequency_anchor_schema_fingerprint_landed_no_runtime_selected_runtime_first_route_family_rerank`

Landed file:

`packages/shared/src/domain/project-user-measured-source-anchor.test.ts`

Implemented candidate:

`project_user_measured_wall_lab_airborne_frequency_curve_anchor_schema_fingerprint`

The slice adds shared-domain schema, active-candidate guards, and a
canonical fingerprint builder for project/user/team measured wall lab
airborne transmission-loss curve anchors. It keeps scalar `Rw` anchors
separate from measured curve anchors, rejects duplicate frequency bands
and duplicate rating standards, keeps display metadata and row ordering
out of the fingerprint, and makes transmission-loss bands, band set,
rating standards, and calculation-relevant wall inputs fingerprint
sensitive.

Counters: `sharedDomainFilesTouched: 2`,
`newExactMeasuredFrequencyAnchorInputFamilies: 1`,
`activeMeasuredFrequencyAnchorCandidateSchemas: 1`,
`canonicalFingerprintBuilders: 1`,
`estimateRequestSchemaChanged: 0`, `engineRuntimeFilesTouched: 0`,
`newCalculableLayerTemplates: 0`, `newCalculableRequestShapes: 0`,
`newCalculableTargetOutputs: 0`, `runtimeBasisPromotions: 0`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.

Selected next action:

`post_v1_runtime_first_route_family_rerank_after_project_user_measured_wall_airborne_frequency_anchor_schema_fingerprint_plan`

Selected next implementation file:

`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-project-user-measured-wall-airborne-frequency-anchor-schema-fingerprint-contract.test.ts`

Selected next plan:

`docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_ANCHOR_SCHEMA_FINGERPRINT_PLAN_2026-06-18.md`

Selected next label:

`post-V1 runtime-first route-family rerank after project/user measured wall airborne frequency anchor schema + fingerprint`

## Selected By Rerank

Rerank action:

`post_v1_runtime_first_route_family_rerank_after_project_user_measured_wall_rw_exact_bridge_coverage_refresh_plan`

Rerank file:

`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-project-user-measured-wall-rw-exact-bridge-coverage-refresh-contract.test.ts`

Rerank plan:

`docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_PROJECT_USER_MEASURED_WALL_RW_EXACT_BRIDGE_COVERAGE_REFRESH_PLAN_2026-06-18.md`

Rerank status:

`post_v1_runtime_first_route_family_rerank_after_project_user_measured_wall_rw_exact_bridge_coverage_refresh_landed_no_runtime_selected_project_user_measured_wall_airborne_frequency_anchor_schema_fingerprint`

Previous coverage refresh:

`post_v1_project_user_measured_wall_rw_exact_bridge_coverage_refresh_plan`
/
`packages/engine/src/post-v1-project-user-measured-wall-rw-exact-bridge-coverage-refresh-contract.test.ts`
/
`post_v1_project_user_measured_wall_rw_exact_bridge_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank`

Protected runtime method:

`post_v1_project_user_measured_wall_rw_exact_bridge`

Selected candidate:

`project_user_measured_wall_lab_airborne_frequency_curve_anchor_schema_fingerprint`

Rerank counters: `candidateCount: 8`, `roiAnalysisIterations: 4`,
`estimatedNextSharedDomainFilesTouched: 1`,
`estimatedNextFrequencyCurveAnchorSchemas: 1`,
`estimatedNextMeasuredCurveMetricFamilies: 1`,
`estimatedNextCompanionTargetOutputsUnlockedAfterBridge: 4`,
`estimatedNextRuntimeBasisPromotionsAfterBridge: 1`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.

## Selected Next

Selected next action:

`post_v1_project_user_measured_wall_airborne_frequency_anchor_schema_fingerprint_plan`

Selected next implementation file:

`packages/shared/src/domain/project-user-measured-source-anchor.test.ts`

Selected next plan:

`docs/calculator/POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_ANCHOR_SCHEMA_FINGERPRINT_PLAN_2026-06-18.md`

Selected next label:

`post-V1 project/user measured wall airborne frequency anchor schema + fingerprint`

## Scope

Add shared-domain schema and tests for active project/user/team measured
wall lab airborne transmission-loss curve anchors.

The schema should capture:

- exact construction snapshot using the same calculation-relevant wall
  layer/material/topology snapshot family as the landed `Rw` anchor;
- `sourceMode: "lab"` and element-lab airborne basis only;
- measurement method standard, rating standards available from the
  source, and explicit band basis;
- one-third-octave frequency band metadata and transmission-loss values
  in dB, with deterministic ordering and duplicate-band rejection;
- canonicalization version and fingerprint prefix distinct from scalar
  `Rw`;
- source scope, status, revision, label, tolerance/error notes, and
  active-only runtime-candidate guards.

The implementation should reuse the existing shared source-anchor file
instead of creating a parallel catalog. If the source file becomes too
large, split only after the schema boundaries are proven by tests.

## Boundaries

Do not in this slice:

- add estimate request intake for frequency-curve anchors;
- bridge the new curve anchor into the Dynamic Calculator runtime;
- derive or publish `Rw`, `STC`, `C`, `Ctr`, or `OITC` yet;
- infer companion metrics from scalar `Rw`;
- copy lab curves into `R'w`, `Dn,w`, `DnT,w`, or other field/building
  outputs;
- import source rows, crawl the web, or retune formulas;
- add UI/storage management.

The slice moves no runtime values. It is a prerequisite for a later
runtime owner that can use exact measured curves and existing rating
adapter guards without aliasing ASTM and ISO metrics.

## Validation

Run:

```bash
pnpm --filter @dynecho/shared exec vitest run src/domain/project-user-measured-source-anchor.test.ts --maxWorkers=1
pnpm --filter @dynecho/shared typecheck
git diff --check
```

Because this is shared schema/fingerprint work only, engine runtime
tests are optional unless request intake, exports, or runtime bridge
files are touched. A later runtime owner must add positive, mixed-output,
target-output independence, unsupported-adjacent, and stale/duplicate
guard tests before moving any calculator values.
