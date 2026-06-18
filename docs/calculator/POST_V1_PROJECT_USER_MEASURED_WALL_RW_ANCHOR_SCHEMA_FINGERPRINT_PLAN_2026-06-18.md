# Post-V1 Project/User Measured Wall Rw Anchor Schema + Fingerprint Plan - 2026-06-18

## Purpose

This is the selected next calculator slice after the runtime-first
rerank following the wall opening/leak common-wall same-basis holdout
packet. It implements the first prerequisite for project/user measured
wall source anchors: a shared schema and canonical fingerprint contract
for active measured wall `Rw` anchors.

The user goal stays calculator-first. Exact measured/source rows should
win only when they truly match the entered construction and metric
basis. This slice makes that future runtime path possible without
turning presets, UI metadata, or broad source crawls into calculator
truth.

## Previous Rerank

Previous packet action:

`post_v1_wall_opening_leak_common_wall_same_basis_holdout_packet_plan`

Previous packet file:

`packages/engine/src/post-v1-wall-opening-leak-common-wall-same-basis-holdout-packet-contract.test.ts`

Previous packet status:

`post_v1_wall_opening_leak_common_wall_same_basis_holdout_packet_landed_no_runtime_selected_runtime_first_route_family_rerank`

Previous packet selected candidate:

`wall.opening_leak_common_wall_same_basis_holdout_packet`

The previous packet found `acceptedSameBasisHoldoutRows: 0`, with
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.

Previous selected action:

`post_v1_runtime_first_route_family_rerank_after_wall_opening_leak_common_wall_same_basis_holdout_packet_plan`

Previous selected file:

`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-wall-opening-leak-common-wall-same-basis-holdout-packet-contract.test.ts`

Previous selected status:

`post_v1_runtime_first_route_family_rerank_after_wall_opening_leak_common_wall_same_basis_holdout_packet_landed_no_runtime_selected_project_user_measured_wall_rw_anchor_schema_fingerprint`

Selected candidate:

`project_user_measured_wall_rw_anchor_schema_fingerprint`

The rerank rejected opening/leak/common-wall runtime retuning because
the previous packet found `acceptedSameBasisHoldoutRows: 0`. It also
subtracted closed framed wall, steel/open-web, and double-leaf
revalidation chains. Counters: `candidateCount: 9`,
`roiAnalysisIterations: 4`,
`estimatedNextExactMeasuredAnchorInputFamilies: 1`,
`estimatedNextSharedDomainFilesTouched: 1`,
`estimatedNextRuntimeValuesMovedAfterBridge: 1`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.

## Selected Next

Selected next action:

`post_v1_project_user_measured_wall_rw_anchor_schema_fingerprint_plan`

Selected next implementation file:

`packages/shared/src/domain/project-user-measured-source-anchor.test.ts`

Selected next plan:

`docs/calculator/POST_V1_PROJECT_USER_MEASURED_WALL_RW_ANCHOR_SCHEMA_FINGERPRINT_PLAN_2026-06-18.md`

Selected next label:

`post-V1 project/user measured wall Rw anchor schema + fingerprint`

## Outcome

Landed status:

`post_v1_project_user_measured_wall_rw_anchor_schema_fingerprint_landed_no_runtime_selected_runtime_first_route_family_rerank`

Implementation files:

`packages/shared/src/domain/project-user-measured-source-anchor.ts`
/
`packages/shared/src/domain/project-user-measured-source-anchor.test.ts`
/
`packages/shared/src/index.ts`

The slice added the shared schema, active runtime-candidate guard, and
canonical fingerprint builder for project/user measured wall lab `Rw`
anchors. It keeps inactive/draft anchors representable but not runtime
candidates, rejects field/building/STC aliasing, excludes display
metadata/preset ids/visual overrides from fingerprints, and changes the
fingerprint when layer thickness, custom material physical properties,
or support spacing changes.

Counters: `sharedDomainFilesTouched: 3`,
`newExactMeasuredAnchorInputFamilies: 1`,
`activeMeasuredAnchorCandidateSchemas: 1`,
`canonicalFingerprintBuilders: 1`, `estimateRequestSchemaChanged: 0`,
`engineRuntimeFilesTouched: 0`, `runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`.

Current selected next action:

`post_v1_runtime_first_route_family_rerank_after_project_user_measured_wall_rw_anchor_schema_fingerprint_plan`

Current selected next file:

`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-project-user-measured-wall-rw-anchor-schema-fingerprint-contract.test.ts`

Current selected next plan:

`docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_PROJECT_USER_MEASURED_WALL_RW_ANCHOR_SCHEMA_FINGERPRINT_PLAN_2026-06-18.md`

Current selected next label:

`post-V1 runtime-first route-family rerank after project/user measured wall Rw anchor schema + fingerprint`

## Scope

Implement a shared domain contract for project/user measured wall `Rw`
anchors:

- active scoped measured anchors for `project_measured`,
  `user_measured`, and `team_measured`;
- initial metric scope: wall `Rw` only;
- initial basis scope: lab `Rw`, not `R'w`, `Dn,w`, `DnT,w`, `STC`, or
  impact metrics;
- measured value, tolerance, source mode, measurement/rating standards,
  source status, scope, revision, and stable id fields;
- immutable construction snapshot inputs: layers, material ids,
  material physical properties for custom materials, layer roles,
  topology/context fields needed for exact matching;
- canonical fingerprint builder with an explicit canonicalization
  version.

## Fingerprint Rules

The fingerprint must include calculation-relevant identity:

- route mode: wall;
- metric and metric basis;
- layer order;
- material ids;
- custom material physical properties;
- thicknesses with deterministic rounding;
- wall topology, cavity depth, cavity fill, support/framing topology,
  and spacing when present;
- measurement/rating standard;
- canonicalization version.

The fingerprint must exclude non-calculation metadata:

- display name changes;
- notes;
- UI colors or visual overrides;
- source-reference row order;
- preset id when the construction snapshot is unchanged.

## Boundaries

This slice must not:

- move engine runtime values;
- connect the estimate request resolver to measured airborne anchors;
- import or crawl source rows;
- retune formulas;
- build UI/storage;
- let a preset `targetValue` become source truth;
- alias `Rw` to field/building metrics or `STC`;
- allow inactive, draft, retired, or conflicting anchors to become
  runtime candidates.

The next runtime bridge may only start after this schema/fingerprint
contract lands and documents how exact active anchors are matched.

## Implementation Steps

1. Add `packages/shared/src/domain/project-user-measured-source-anchor.ts`
   with Zod schemas, TypeScript types, canonicalization constants, and a
   fingerprint helper.
2. Add
   `packages/shared/src/domain/project-user-measured-source-anchor.test.ts`
   covering valid active wall `Rw` anchors, inactive/draft rejection,
   metric/basis boundaries, stable fingerprint equality, and fingerprint
   differences when calculation-relevant physical inputs change.
3. Export the new domain module from `packages/shared/src/index.ts`.
4. Keep `EstimateRequestSchema` unchanged unless this slice explicitly
   decides to expose only the typed domain without runtime request
   intake. Runtime request intake belongs to the next bridge slice.
5. Update the live calculator docs and current gate runner only if the
   implementation changes selected-next state.

## Validation

Run:

```bash
pnpm --filter @dynecho/shared exec vitest run src/domain/project-user-measured-source-anchor.test.ts --maxWorkers=1
pnpm --filter @dynecho/engine exec vitest run src/post-v1-runtime-first-route-family-rerank-after-wall-opening-leak-common-wall-same-basis-holdout-packet-contract.test.ts --maxWorkers=1
git diff --check
```

If this slice unexpectedly touches engine runtime behavior, also run
`pnpm calculator:gate:current`.
