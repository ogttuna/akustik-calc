# Post-V1 Project/User Measured Wall Airborne Frequency Exact Curve Bridge Owner Plan - 2026-06-18

## Purpose

This is the selected next runtime owner after
`post_v1_runtime_first_route_family_rerank_after_project_user_measured_wall_airborne_frequency_anchor_schema_fingerprint_plan`.

The shared-domain frequency anchor schema now represents active
project/user/team measured wall lab airborne transmission-loss curves
with canonical fingerprints. The next runtime step is to bridge those
exact curves into the Dynamic Calculator for element-lab wall requests
when the fingerprint exactly matches the entered construction, then
derive only the owned lab airborne outputs from the curve and rating
adapters.

## Selected By Rerank

Rerank action:

`post_v1_runtime_first_route_family_rerank_after_project_user_measured_wall_airborne_frequency_anchor_schema_fingerprint_plan`

Rerank file:

`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-project-user-measured-wall-airborne-frequency-anchor-schema-fingerprint-contract.test.ts`

Rerank plan:

`docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_ANCHOR_SCHEMA_FINGERPRINT_PLAN_2026-06-18.md`

Rerank status:

`post_v1_runtime_first_route_family_rerank_after_project_user_measured_wall_airborne_frequency_anchor_schema_fingerprint_landed_no_runtime_selected_project_user_measured_wall_airborne_frequency_exact_curve_bridge_owner`

Previous shared-domain slice:

`post_v1_project_user_measured_wall_airborne_frequency_anchor_schema_fingerprint_plan`
/
`packages/shared/src/domain/project-user-measured-source-anchor.test.ts`
/
`post_v1_project_user_measured_wall_airborne_frequency_anchor_schema_fingerprint_landed_no_runtime_selected_runtime_first_route_family_rerank`

Previous implemented candidate:

`project_user_measured_wall_lab_airborne_frequency_curve_anchor_schema_fingerprint`

Selected candidate:

`project_user_measured_wall_airborne_frequency_exact_curve_bridge_owner`

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

## Selected Next

Selected next action:

`post_v1_project_user_measured_wall_airborne_frequency_exact_curve_bridge_owner_plan`

Selected next implementation file:

`packages/engine/src/post-v1-project-user-measured-wall-airborne-frequency-exact-curve-bridge-owner-contract.test.ts`

Selected next plan:

`docs/calculator/POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_EXACT_CURVE_BRIDGE_OWNER_PLAN_2026-06-18.md`

Selected next label:

`post-V1 project/user measured wall airborne frequency exact curve bridge owner`

## Scope

Implement a bounded runtime owner that:

- adds estimate request intake for active measured wall airborne
  frequency anchors without changing scalar `airborneMeasuredSourceAnchors`;
- matches only one active lab curve anchor whose canonical fingerprint
  equals the current element-lab wall request fingerprint;
- maps the anchor band values into the engine `TransmissionLossCurve`
  shape and rates them through existing curve-rating infrastructure;
- publishes `Rw`, `STC`, `C`, and `Ctr` only when requested and when the
  anchor declares the required rating standard basis;
- records an exact measured airborne basis with
  `curveBasis: "measured_frequency_curve"`, `origin:
  "measured_exact_full_stack"`, and frequency-band metadata;
- keeps target-output independence: single-output `Rw`, `STC`, `C`, or
  `Ctr` requests and mixed lab requests must select the same exact
  curve owner when basis requirements are satisfied.

Expected next movement: one exact measured curve runtime family, four
element-lab target outputs, and no formula retune or source import.

## Boundaries

Do not in this owner:

- infer `STC`, `C`, `Ctr`, or `OITC` from scalar `Rw`;
- use a scalar `Rw` anchor as a curve source;
- accept field or building measured curves;
- publish `R'w`, `Dn,w`, `Dn,A`, `DnT,w`, `DnT,A`, or any other
  field/building metric from the lab curve;
- implement compatible deltas or near-match construction reuse;
- import source rows, crawl the web, retune formulas, or add UI/storage.

When a required rating standard is absent, the owner should leave that
target output unsupported instead of aliasing another standard. When
multiple active anchors match the same request fingerprint, the owner
should reject the direct runtime path until the conflict is resolved.

## Validation

Run:

```bash
pnpm --filter @dynecho/shared exec vitest run src/api/estimate.test.ts src/domain/project-user-measured-source-anchor.test.ts --maxWorkers=1
pnpm --filter @dynecho/engine exec vitest run src/post-v1-runtime-first-route-family-rerank-after-project-user-measured-wall-airborne-frequency-anchor-schema-fingerprint-contract.test.ts src/post-v1-project-user-measured-wall-airborne-frequency-exact-curve-bridge-owner-contract.test.ts --maxWorkers=1
git diff --check
```

If the owner touches `calculate-assembly`, resolver trace, or estimate
route plumbing, also run the relevant calculator-focused contracts that
cover project/user measured `Rw` anchors, Answer Engine V1 ownership,
and layer-combination resolver trace parity.

## Landed Result

Status:
`post_v1_project_user_measured_wall_airborne_frequency_exact_curve_bridge_owner_landed_runtime_selected_coverage_refresh`

Runtime method:
`post_v1_project_user_measured_wall_airborne_frequency_exact_curve_bridge`

Landed behavior:

- `airborneMeasuredFrequencySourceAnchors` is now accepted by the
  estimate request schema and API route without changing scalar
  `airborneMeasuredSourceAnchors`.
- Dynamic Calculator element-lab wall requests can select one active
  measured wall lab airborne frequency anchor when the canonical
  fingerprint exactly matches the current resolved wall stack.
- The measured TL curve is rated through the existing curve-rating
  infrastructure and can publish requested lab `Rw`, `STC`, `C`, and
  `Ctr` only when the anchor declares the required rating standard.
- Missing rating-standard outputs, field/building outputs, impact
  outputs, scalar `Rw` aliases, compatible deltas, source imports,
  formula retunes, UI, and storage remain outside.

Counters: `sharedApiFilesTouched: 1`, `apiRouteBridgeFilesTouched: 1`,
`engineRuntimeFilesTouched: 4`, `newCalculableLayerTemplates: 0`,
`newCalculableRequestShapes: 4`, `newCalculableTargetOutputs: 4`,
`runtimeBasisPromotions: 1`, `runtimeValuesMoved 4`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`.

Selected next:
`post_v1_project_user_measured_wall_airborne_frequency_exact_curve_bridge_coverage_refresh_plan`
/
`packages/engine/src/post-v1-project-user-measured-wall-airborne-frequency-exact-curve-bridge-coverage-refresh-contract.test.ts`
/
`docs/calculator/POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_EXACT_CURVE_BRIDGE_COVERAGE_REFRESH_PLAN_2026-06-18.md`
/
`post-V1 project/user measured wall airborne frequency exact curve bridge coverage refresh`.
