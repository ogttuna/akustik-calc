# Post-V1 Project/User Measured Wall Airborne Frequency Compatible-Delta Owner Plan - 2026-06-18

## Purpose

This is the selected next runtime owner after
`post_v1_runtime_first_route_family_rerank_after_project_user_measured_wall_airborne_frequency_exact_curve_bridge_coverage_refresh_plan`.

The calculator goal is directly aligned with the product north star:
when a project/user measured wall lab airborne transmission-loss curve
exactly matches a reduced stack, and the entered construction differs
only by a bounded exterior board addition, DynEcho should calculate the
changed stack from that measured curve plus an owned delta instead of
falling back to a generic formula or pretending the exact row still
matches.

This is not UI/storage work, source crawling, confidence copy, or a
general similarity solver. It is a bounded compatible-anchor calculation
route for near-measured wall layer combinations.

## Selected By Rerank

Rerank action:

`post_v1_runtime_first_route_family_rerank_after_project_user_measured_wall_airborne_frequency_exact_curve_bridge_coverage_refresh_plan`

Rerank file:

`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-project-user-measured-wall-airborne-frequency-exact-curve-bridge-coverage-refresh-contract.test.ts`

Rerank plan:

`docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_EXACT_CURVE_BRIDGE_COVERAGE_REFRESH_PLAN_2026-06-18.md`

Rerank status:

`post_v1_runtime_first_route_family_rerank_after_project_user_measured_wall_airborne_frequency_exact_curve_bridge_coverage_refresh_landed_no_runtime_selected_project_user_measured_wall_airborne_frequency_compatible_delta_owner`

Previous coverage refresh:

`post_v1_project_user_measured_wall_airborne_frequency_exact_curve_bridge_coverage_refresh_plan`
/
`packages/engine/src/post-v1-project-user-measured-wall-airborne-frequency-exact-curve-bridge-coverage-refresh-contract.test.ts`
/
`post_v1_project_user_measured_wall_airborne_frequency_exact_curve_bridge_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank`

Selected candidate:

`project_user_measured_wall_airborne_frequency_compatible_delta_owner`

Rerank counters: `candidateCount: 8`, `roiAnalysisIterations: 4`,
`estimatedNextCalculableRequestShapes: 4`,
`estimatedNextCalculableTargetOutputs: 4`,
`estimatedNextRequiredPhysicalInputsCaptured: 6`,
`estimatedNextRuntimeBasisPromotions: 1`,
`estimatedNextRuntimeValuesMoved: 4`,
`estimatedNextUnsupportedBoundariesProtected: 7`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.

## Selected Next

Selected next action:

`post_v1_project_user_measured_wall_airborne_frequency_compatible_delta_owner_plan`

Selected next implementation file:

`packages/engine/src/post-v1-project-user-measured-wall-airborne-frequency-compatible-delta-owner-contract.test.ts`

Selected next plan:

`docs/calculator/POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_COMPATIBLE_DELTA_OWNER_PLAN_2026-06-18.md`

Selected next label:

`post-V1 project/user measured wall airborne frequency compatible-delta owner`

## Landing Update - 2026-06-18

Status:

`post_v1_project_user_measured_wall_airborne_frequency_compatible_delta_owner_landed_runtime_selected_coverage_refresh`

Runtime implementation files:

- `packages/engine/src/project-user-measured-wall-airborne-frequency-compatible-delta.ts`
- `packages/engine/src/calculate-assembly.ts`
- `packages/engine/src/dynamic-calculator-candidate-resolver-runtime.ts`
- `packages/engine/src/layer-combination-resolver-registry.ts`
- `packages/engine/src/layer-combination-resolver-runtime-candidate-surface-parity.ts`

Owner contract:

`packages/engine/src/post-v1-project-user-measured-wall-airborne-frequency-compatible-delta-owner-contract.test.ts`

The owner now supports active project/user measured wall airborne
frequency anchors as reduced-stack evidence when the current
element-lab wall differs only by a compatible exterior board addition.
It publishes calculated lab `Rw`, `STC`, `C`, and `Ctr` from the
shifted measured TL curve, marks the route as
`measured_exact_subassembly_plus_calculated_delta`, and keeps exact
full-stack matches, field/building outputs, impact aliases, non-board
changes, missing rating standards, and ambiguous reduced-stack anchors
out.

Counters: `newCalculableLayerTemplates: 0`,
`newCalculableRequestShapes: 4`, `newCalculableTargetOutputs: 4`,
`runtimeBasisPromotions: 1`, `runtimeValuesMoved 4`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`,
`frontendImplementationFilesTouched: 0`, and
`unsupportedBoundariesProtected: 7`.

Current selected next action:

`post_v1_project_user_measured_wall_airborne_frequency_compatible_delta_coverage_refresh_plan`

Current selected next file:

`packages/engine/src/post-v1-project-user-measured-wall-airborne-frequency-compatible-delta-coverage-refresh-contract.test.ts`

Current selected next plan doc:

`docs/calculator/POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_COMPATIBLE_DELTA_COVERAGE_REFRESH_PLAN_2026-06-18.md`

Current selected next label:

`post-V1 project/user measured wall airborne frequency compatible-delta coverage refresh`

Coverage refresh follow-up landed:

`post_v1_project_user_measured_wall_airborne_frequency_compatible_delta_coverage_refresh_plan`
/
`packages/engine/src/post-v1-project-user-measured-wall-airborne-frequency-compatible-delta-coverage-refresh-contract.test.ts`
/
`docs/calculator/POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_COMPATIBLE_DELTA_COVERAGE_REFRESH_PLAN_2026-06-18.md`
/
`post_v1_project_user_measured_wall_airborne_frequency_compatible_delta_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank`

Current selected next after coverage refresh:

`post_v1_runtime_first_route_family_rerank_after_project_user_measured_wall_airborne_frequency_compatible_delta_coverage_refresh_plan`
/
`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-project-user-measured-wall-airborne-frequency-compatible-delta-coverage-refresh-contract.test.ts`
/
`docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_COMPATIBLE_DELTA_COVERAGE_REFRESH_PLAN_2026-06-18.md`

## Scope

Implement a bounded runtime owner that:

- accepts only active `airborneMeasuredFrequencySourceAnchors`;
- detects when the current element-lab wall request differs from an
  active measured curve anchor by one exterior board or paired exterior
  boards;
- proves the reduced current stack fingerprint exactly matches the
  measured curve anchor fingerprint before any delta is calculated;
- calculates a bounded exterior-board mass delta using the existing
  compatible-anchor delta rule shape;
- shifts the measured transmission-loss curve to the calculated direct
  `Rw` and derives requested lab `Rw`, `STC`, `C`, and `Ctr` from that
  shifted curve only when the anchor declares the required rating
  standards;
- records a non-exact compatible-anchor basis, not a measured exact
  basis, with the measured anchor id, removed/added board description,
  delta value, curve metadata, and explicit error budget;
- keeps target-output independence for single-output and mixed lab
  requests.

Expected runtime movement: four lab target outputs for one bounded
modified measured-wall request family:

- `Rw`;
- `STC`;
- `C`;
- `Ctr`.

## Required Physical Inputs

The owner must require:

- active measured wall airborne frequency anchor;
- current element-lab wall stack;
- reduced-stack canonical fingerprint equal to the measured anchor
  fingerprint;
- one-side or paired exterior board delta;
- board thickness and surface mass from resolved layer data;
- anchor rating standards for the requested output set.

Missing or ambiguous values must return unsupported/needs-input style
boundaries. Do not default topology or infer construction boundaries
from material names alone.

## Boundaries

Do not in this owner:

- treat the modified stack as an exact measured row;
- run when the full current stack already exact-matches a measured curve
  anchor;
- run from scalar `Rw` anchors;
- run for non-board changes, cavity changes, absorber changes, support
  topology changes, or multiple interior layer differences;
- publish `R'w`, `Dn,w`, `Dn,A`, `DnT,w`, or `DnT,A`;
- publish `OITC`, impact metrics, `IIC`, or `AIIC`;
- copy lab values into field/building metrics;
- retune formulas or import source rows;
- touch UI/storage.

Ambiguous multiple reduced-stack anchors must fail closed. Missing ASTM
E413 must keep `STC` unsupported. Missing ISO 717-1 must keep `Rw`,
`C`, and `Ctr` unsupported.

## Implementation Steps

1. Create the owner contract:
   `packages/engine/src/post-v1-project-user-measured-wall-airborne-frequency-compatible-delta-owner-contract.test.ts`.
2. Add a positive case where the measured curve matches the reduced
   stack and the current stack adds one exterior board.
3. Add a paired exterior-board case only if it can reuse the existing
   bounded delta rule without extra assumptions.
4. Add target-output independence cases for `Rw`, `STC`, `C`, `Ctr`,
   and a mixed lab request.
5. Add boundaries for full exact match precedence, scalar `Rw` anchors,
   field/building outputs, impact outputs, missing rating standards,
   non-board layer changes, cavity/support/absorber changes, and
   ambiguous reduced-stack anchors.
6. Implement the runtime by extending the measured frequency curve
   bridge or adding a sibling measured-frequency compatible-delta module.
   Prefer a sibling module if it keeps exact-match and compatible-delta
   basis logic clearer.
7. Keep resolver trace and candidate basis explicit:
   compatible-anchor calculation, not exact measured override.
8. Update live docs only after the owner lands, then select a coverage
   refresh.

## Expected Counters

- `newCalculableLayerTemplates: 0`;
- `newCalculableRequestShapes: 4`;
- `newCalculableTargetOutputs: 4`;
- `runtimeBasisPromotions: 1`;
- `runtimeValuesMoved 4`;
- `runtimeFormulaRetunes: 0`;
- `sourceRowsImported: 0`;
- `frontendImplementationFilesTouched: 0`.

## Validation

Run:

```bash
pnpm --filter @dynecho/engine exec vitest run src/post-v1-project-user-measured-wall-airborne-frequency-exact-curve-bridge-coverage-refresh-contract.test.ts src/post-v1-runtime-first-route-family-rerank-after-project-user-measured-wall-airborne-frequency-exact-curve-bridge-coverage-refresh-contract.test.ts src/post-v1-project-user-measured-wall-airborne-frequency-compatible-delta-owner-contract.test.ts --maxWorkers=1
git diff --check
```

Because the owner will move runtime behavior, also run relevant adjacent
measured-anchor, compatible-anchor delta, resolver-trace, and current
calculator gate tests before closeout.
