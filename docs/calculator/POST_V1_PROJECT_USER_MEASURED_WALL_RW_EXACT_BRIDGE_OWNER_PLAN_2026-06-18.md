# Post-V1 Project/User Measured Wall Rw Exact Bridge Owner Plan - 2026-06-18

## Purpose

This is the selected next runtime owner after the project/user measured
wall `Rw` anchor schema + fingerprint rerank. The shared domain can now
validate active lab `Rw` anchors and build canonical fingerprints; this
owner connects those active exact anchors to the calculator request and
engine resolver for exact `Rw` matches only.

The calculator goal is answer-order step 1: use an exact
measured/source row when it truly matches the entered construction and
metric basis. This is not a source crawl, preset shortcut, UI/storage
task, formula retune, compatible delta owner, or field/building alias.

## Previous Rerank

Previous selected action:

`post_v1_runtime_first_route_family_rerank_after_project_user_measured_wall_rw_anchor_schema_fingerprint_plan`

Previous selected file:

`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-project-user-measured-wall-rw-anchor-schema-fingerprint-contract.test.ts`

Previous selected status:

`post_v1_runtime_first_route_family_rerank_after_project_user_measured_wall_rw_anchor_schema_fingerprint_landed_no_runtime_selected_project_user_measured_wall_rw_exact_bridge_owner`

Selected candidate:

`project_user_measured_wall_rw_exact_bridge_owner`

It follows
`post_v1_project_user_measured_wall_rw_anchor_schema_fingerprint_plan`
/
`packages/shared/src/domain/project-user-measured-source-anchor.test.ts`
/
`post_v1_project_user_measured_wall_rw_anchor_schema_fingerprint_landed_no_runtime_selected_runtime_first_route_family_rerank`.

Rerank counters: `candidateCount: 6`, `roiAnalysisIterations: 4`,
`activeMeasuredAnchorCandidateSchemas: 1`,
`estimatedNextExactMeasuredAnchorRuntimeFamilies: 1`,
`estimatedNextCalculableRequestShapes: 1`,
`estimatedNextTargetOutputsMoved: 1`,
`estimatedNextRuntimeBasisPromotions: 1`,
`estimatedNextRuntimeValuesMoved: 1`, `runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`.

## Selected Next

Selected next action:

`post_v1_project_user_measured_wall_rw_exact_bridge_owner_plan`

Selected next implementation file:

`packages/engine/src/post-v1-project-user-measured-wall-rw-exact-bridge-owner-contract.test.ts`

Selected next plan:

`docs/calculator/POST_V1_PROJECT_USER_MEASURED_WALL_RW_EXACT_BRIDGE_OWNER_PLAN_2026-06-18.md`

Selected next label:

`post-V1 project/user measured wall Rw exact bridge owner`

## Scope

Implement the narrow exact bridge:

- add an optional `airborneMeasuredSourceAnchors` request field carrying
  active project/user/team measured wall lab `Rw` anchors;
- add the same optional field to `CalculateAssemblyOptions`;
- build the request-side wall `Rw` fingerprint from the entered layers,
  material catalog, and lab wall context using the shared
  canonicalization contract;
- if exactly one active anchor has the same fingerprint, metric `Rw`,
  `metricBasis: lab_rw`, and `sourceMode: lab`, publish anchor `Rw` for
  `Rw` target output;
- expose source-anchor trace/basis so downstream answer explanations can
  see that the exact project/user measured row won.

## Boundaries

This owner must not:

- support `STC`, `C`, `Ctr`, field/building metrics, or impact metrics;
- alias `Rw` to `R'w`, `Dn,w`, `DnT,w`, or `STC`;
- consume `draft`, `retired`, `promoted`, stale-fingerprint, or
  conflicting anchors;
- use preset `targetValue` metadata as source truth;
- implement compatible exterior-board deltas;
- create UI/storage flows;
- import source rows or retune formulas.

If no exact active fingerprint match exists, the calculator must fall
back to the existing owned formula/source route and leave unsupported or
`needs_input` boundaries intact.

## Implementation Steps

1. Add `airborneMeasuredSourceAnchors` to
   `packages/shared/src/api/estimate.ts` using the active measured wall
   `Rw` anchor schema and duplicate-id/conflict guards.
2. Extend `CalculateAssemblyOptions` in
   `packages/engine/src/calculate-assembly.ts` with the same optional
   field.
3. Add a tiny engine helper that builds the request fingerprint from
   the current wall lab request. Start with `element_lab` / omitted
   context only; field/building contexts remain outside this owner.
4. Apply the exact anchor before formula-derived `Rw` is finalized, but
   only for `Rw` output. Preserve existing verified global source rows
   precedence unless the owner contract explicitly proves local project
   precedence is intended.
5. Add runtime owner tests for exact match, no-match fallback, inactive
   anchor rejection, stale fingerprint rejection, field/building/STC
   boundaries, and target-output independence for `Rw` only.
6. Update docs and current gate only after the owner is green.

## Validation

Run:

```bash
pnpm --filter @dynecho/shared exec vitest run src/api/estimate.test.ts src/domain/project-user-measured-source-anchor.test.ts --maxWorkers=1
pnpm --filter @dynecho/engine exec vitest run src/post-v1-project-user-measured-wall-rw-exact-bridge-owner-contract.test.ts src/post-v1-runtime-first-route-family-rerank-after-project-user-measured-wall-rw-anchor-schema-fingerprint-contract.test.ts --maxWorkers=1
pnpm --filter @dynecho/shared typecheck
git diff --check
```

Because this owner moves runtime calculator behavior, run
`pnpm calculator:gate:current` before finishing the owner turn if the
runtime implementation lands.

## Landing Update

Status:

`post_v1_project_user_measured_wall_rw_exact_bridge_owner_landed_runtime_selected_coverage_refresh`

Runtime method:

`post_v1_project_user_measured_wall_rw_exact_bridge`

Landed files:

- `packages/shared/src/api/estimate.ts`
- `packages/engine/src/project-user-measured-wall-rw-exact-bridge.ts`
- `packages/engine/src/calculate-assembly.ts`
- `packages/engine/src/dynamic-calculator-candidate-resolver-runtime.ts`
- `packages/engine/src/layer-combination-resolver-runtime-candidate-surface-parity.ts`
- `apps/web/app/api/estimate/route.ts`
- `packages/engine/src/post-v1-project-user-measured-wall-rw-exact-bridge-owner-contract.test.ts`

The owner adds active `airborneMeasuredSourceAnchors` intake and lets an
exact fingerprint match publish only lab `Rw` from the measured
project/user/team anchor. It keeps `STC`, `C`, `Ctr`, field/building
outputs, impact outputs, stale/inactive anchors, conflicting anchors,
compatible deltas, UI/storage, source imports, and formula retunes
outside this owner.

Counters: `sharedApiFilesTouched: 1`, `apiRouteBridgeFilesTouched: 1`,
`engineRuntimeFilesTouched: 3`, `newCalculableLayerTemplates: 0`,
`newCalculableRequestShapes: 1`, `newCalculableTargetOutputs: 1`,
`runtimeBasisPromotions: 1`, `runtimeValuesMoved 1`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`.

Selected next action:

`post_v1_project_user_measured_wall_rw_exact_bridge_coverage_refresh_plan`

Selected next file:

`packages/engine/src/post-v1-project-user-measured-wall-rw-exact-bridge-coverage-refresh-contract.test.ts`

Selected next plan:

`docs/calculator/POST_V1_PROJECT_USER_MEASURED_WALL_RW_EXACT_BRIDGE_COVERAGE_REFRESH_PLAN_2026-06-18.md`
