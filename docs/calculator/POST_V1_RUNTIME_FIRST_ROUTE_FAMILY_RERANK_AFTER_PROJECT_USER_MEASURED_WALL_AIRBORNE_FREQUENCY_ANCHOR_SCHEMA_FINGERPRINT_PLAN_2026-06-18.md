# Post-V1 Runtime-First Route-Family Rerank After Project/User Measured Wall Airborne Frequency Anchor Schema + Fingerprint Plan - 2026-06-18

## Purpose

This is the selected next no-runtime rerank after
`post_v1_project_user_measured_wall_airborne_frequency_anchor_schema_fingerprint_plan`.

The preceding slice added shared-domain schema and canonical
fingerprints for active project/user/team measured wall lab airborne
transmission-loss curve anchors. The next rerank must decide whether the
highest-ROI next calculator slice is an exact measured curve runtime
bridge or another calculator-first route family. It must not skip into
UI storage, broad source crawling, scalar companion aliasing, or
building/flanking copies.

## Landing Update

Status:

`post_v1_runtime_first_route_family_rerank_after_project_user_measured_wall_airborne_frequency_anchor_schema_fingerprint_landed_no_runtime_selected_project_user_measured_wall_airborne_frequency_exact_curve_bridge_owner`

Landed file:

`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-project-user-measured-wall-airborne-frequency-anchor-schema-fingerprint-contract.test.ts`

Selected candidate:

`project_user_measured_wall_airborne_frequency_exact_curve_bridge_owner`

The rerank selected the exact measured curve bridge owner because the
shared active frequency anchor schema and canonical fingerprint now
exist, the engine already has curve-rating infrastructure, and request
intake/runtime exact matching is the bounded missing bridge. Scalar
companion anchors, UI/storage, compatible deltas, building/flanking, and
formula retunes remain outside until their own route basis is owned.

Rerank counters: `candidateCount: 8`, `roiAnalysisIterations: 4`,
`activeMeasuredFrequencyAnchorCandidateSchemas: 1`,
`estimatedNextSharedApiFilesTouched: 1`,
`estimatedNextExactMeasuredCurveRuntimeFamilies: 1`,
`estimatedNextCalculableRequestShapes: 4`,
`estimatedNextTargetOutputsMoved: 4`,
`estimatedNextRuntimeBasisPromotions: 1`,
`estimatedNextRuntimeValuesMoved: 4`, `runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`.

Selected next action:

`post_v1_project_user_measured_wall_airborne_frequency_exact_curve_bridge_owner_plan`

Selected next implementation file:

`packages/engine/src/post-v1-project-user-measured-wall-airborne-frequency-exact-curve-bridge-owner-contract.test.ts`

Selected next plan:

`docs/calculator/POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_EXACT_CURVE_BRIDGE_OWNER_PLAN_2026-06-18.md`

Selected next label:

`post-V1 project/user measured wall airborne frequency exact curve bridge owner`

## Previous Shared-Domain Slice

Previous selected action:

`post_v1_project_user_measured_wall_airborne_frequency_anchor_schema_fingerprint_plan`

Previous selected file:

`packages/shared/src/domain/project-user-measured-source-anchor.test.ts`

Previous selected plan:

`docs/calculator/POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_ANCHOR_SCHEMA_FINGERPRINT_PLAN_2026-06-18.md`

Previous selected status:

`post_v1_project_user_measured_wall_airborne_frequency_anchor_schema_fingerprint_landed_no_runtime_selected_runtime_first_route_family_rerank`

Implemented candidate:

`project_user_measured_wall_lab_airborne_frequency_curve_anchor_schema_fingerprint`

It follows
`post_v1_runtime_first_route_family_rerank_after_project_user_measured_wall_rw_exact_bridge_coverage_refresh_plan`
/
`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-project-user-measured-wall-rw-exact-bridge-coverage-refresh-contract.test.ts`
/
`post_v1_runtime_first_route_family_rerank_after_project_user_measured_wall_rw_exact_bridge_coverage_refresh_landed_no_runtime_selected_project_user_measured_wall_airborne_frequency_anchor_schema_fingerprint`.

Shared-domain counters: `sharedDomainFilesTouched: 2`,
`newExactMeasuredFrequencyAnchorInputFamilies: 1`,
`activeMeasuredFrequencyAnchorCandidateSchemas: 1`,
`canonicalFingerprintBuilders: 1`,
`estimateRequestSchemaChanged: 0`, `engineRuntimeFilesTouched: 0`,
`newCalculableLayerTemplates: 0`, `newCalculableRequestShapes: 0`,
`newCalculableTargetOutputs: 0`, `runtimeBasisPromotions: 0`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.

## Selected Next

Selected next action:

`post_v1_runtime_first_route_family_rerank_after_project_user_measured_wall_airborne_frequency_anchor_schema_fingerprint_plan`

Selected next implementation file:

`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-project-user-measured-wall-airborne-frequency-anchor-schema-fingerprint-contract.test.ts`

Selected next plan:

`docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_ANCHOR_SCHEMA_FINGERPRINT_PLAN_2026-06-18.md`

Selected next label:

`post-V1 runtime-first route-family rerank after project/user measured wall airborne frequency anchor schema + fingerprint`

## Candidate Families To Compare

The rerank must compare calculator-first candidates only:

- **Project/user measured wall airborne frequency exact curve bridge**:
  request intake and runtime matching for exact active lab curve anchors,
  followed by owned `Rw`, `STC`, `C`, and `Ctr` derivation only where
  rating adapters are explicit. No scalar `Rw` companion aliases.
- **User-material physical input coverage**: adjacent custom wall/floor
  route-required inputs that unlock real formula routes without source
  rows.
- **Building prediction + flanking runtime**: only if room/area/junction
  context and direct curve basis are owned. Do not copy lab values into
  field/building metrics.
- **Companion metric completeness**: only for routes already carrying an
  owned spectrum or direct companion formula.
- **Calibration / holdout packets**: bounded same-family, same-basis,
  rights-safe evidence packets; no broad source crawl.
- **Opening/leak, common-wall, open-box/open-web residuals**: eligible
  only if the rerank can name owned evidence or required physical
  inputs that were absent in the last packet.

## No-Go Conditions

Reject candidates that:

- derive `STC`, `C`, `Ctr`, or `OITC` from scalar `Rw`;
- add UI/storage management before request and runtime basis are owned;
- copy lab curves or ratings into `R'w`, `Dn,w`, `DnT,w`, or other
  field/building outputs without context;
- retune formulas while `acceptedSameBasisHoldoutRows` is zero;
- import source rows or crawl broadly;
- change runtime before the rerank contract lands.

## Validation

Run the rerank contract once implemented:

```bash
pnpm --filter @dynecho/shared exec vitest run src/domain/project-user-measured-source-anchor.test.ts --maxWorkers=1
pnpm --filter @dynecho/engine exec vitest run src/post-v1-runtime-first-route-family-rerank-after-project-user-measured-wall-airborne-frequency-anchor-schema-fingerprint-contract.test.ts --maxWorkers=1
git diff --check
```

Because this is a no-runtime rerank, broad current gate is optional
unless the rerank updates the focused gate runner or discovers a
runtime boundary defect.
