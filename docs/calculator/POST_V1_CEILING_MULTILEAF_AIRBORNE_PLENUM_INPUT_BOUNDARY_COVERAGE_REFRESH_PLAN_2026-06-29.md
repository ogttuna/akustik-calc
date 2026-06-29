# Post-V1 Ceiling Multileaf Airborne Plenum Input-Boundary Coverage Refresh - 2026-06-29

Status:
`post_v1_ceiling_multileaf_airborne_plenum_input_boundary_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank_after_ceiling_multileaf_airborne_plenum_input_boundary_coverage_refresh`

Coverage refresh action:
`post_v1_ceiling_multileaf_airborne_plenum_input_boundary_coverage_refresh_plan`

Coverage refresh plan:
`docs/calculator/POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_INPUT_BOUNDARY_COVERAGE_REFRESH_PLAN_2026-06-29.md`

Selected by:
`post_v1_ceiling_multileaf_airborne_plenum_input_boundary_owner_landed_input_boundary_selected_coverage_refresh`

Previous rerank:
`post_v1_runtime_first_route_family_rerank_after_ceiling_single_leaf_field_building_context_adapter_coverage_refresh_plan`
/
`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-ceiling-single-leaf-field-building-context-adapter-coverage-refresh-contract.test.ts`
/
`post_v1_runtime_first_route_family_rerank_after_ceiling_single_leaf_field_building_context_adapter_coverage_refresh_landed_no_runtime_selected_ceiling_multileaf_airborne_plenum_input_boundary_owner`

Previous owner:
`post_v1_ceiling_multileaf_airborne_plenum_input_boundary_owner_plan`
/
`packages/engine/src/post-v1-ceiling-multileaf-airborne-plenum-input-boundary-owner-contract.test.ts`
/
`docs/calculator/POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_INPUT_BOUNDARY_OWNER_PLAN_2026-06-29.md`

Selected candidate:
`ceiling.multileaf_airborne_plenum_input_boundary_owner`

Protected method:
`post_v1_ceiling_multileaf_airborne_plenum_input_boundary_missing_physical_inputs`

Expected coverage file:
`packages/engine/src/post-v1-ceiling-multileaf-airborne-plenum-input-boundary-coverage-refresh-contract.test.ts`

Selected next action:
`post_v1_runtime_first_route_family_rerank_after_ceiling_multileaf_airborne_plenum_input_boundary_coverage_refresh_plan`

Selected next file:
`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-ceiling-multileaf-airborne-plenum-input-boundary-coverage-refresh-contract.test.ts`

Selected next plan:
`docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_CEILING_MULTILEAF_AIRBORNE_PLENUM_INPUT_BOUNDARY_COVERAGE_REFRESH_PLAN_2026-06-29.md`

Selected next label:
`post-V1 runtime-first route-family rerank after ceiling multileaf airborne plenum input-boundary coverage refresh`

This is not a broad source crawl.

## Purpose

This is a no-runtime coverage refresh for the landed ceiling multileaf
airborne plenum input-boundary owner. It should preserve the new route
truth before selecting another runtime owner: ceiling-only board plus
plenum/cavity/fill airborne stacks must not fall through to single-leaf
mass-law, floor suspended-ceiling impact, field/building copies,
source-row proximity, or confidence-label fallback.

The refresh must not calculate new `Rw`, `STC`, `C`, `Ctr`, field,
building, impact, or OITC values. It exists to lock the boundary and
make the next formula-owner step safer.

## Landed Owner Ledger To Preserve

The owner landed with status
`post_v1_ceiling_multileaf_airborne_plenum_input_boundary_owner_landed_input_boundary_selected_coverage_refresh`.

It uses method
`post_v1_ceiling_multileaf_airborne_plenum_input_boundary_missing_physical_inputs`
and selected candidate
`ceiling.multileaf_airborne_plenum_input_boundary_owner`.

Landed owner counters:
`newCalculableRequestShapes: 0`,
`newCalculableTargetOutputs: 0`,
`requiredPhysicalInputsCaptured: 5`,
`runtimeBasisPromotions: 0`,
`runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`,
`frontendImplementationFilesTouched: 0`, and
`unsupportedBoundariesProtected: 7`.

Required physical inputs captured by the boundary:

- `ceilingLeafGrouping`;
- `ceilingLeafSurfaceMassKgM2`;
- `ceilingCavityOrPlenumDepthMm`;
- `ceilingAbsorberThicknessAndFlowResistivity`;
- `ceilingSupportCouplingOrHangerClass`.

## Coverage Refresh Scope

Re-probe these request shapes:

- complete-looking ceiling-only board plus absorber/plenum/cavity lab
  airborne request for `Rw`, `STC`, `C`, and `Ctr`;
- complete-looking ceiling-only board plus absorber/plenum/cavity field
  request for `R'w`, `Dn,w`, `Dn,A`, `DnT,w`, and `DnT,A`;
- board-only ceiling single-leaf request proving `Rw 34`, `STC 34`,
  `C 3.7`, and `Ctr 8` remain calculable through the existing
  single-leaf route;
- impact and OITC probes proving those outputs remain outside this
  ceiling airborne owner.

Expected coverage counters:
`coverageRefreshContractFilesTouched: 1`,
`newCalculableRequestShapes: 0`,
`newCalculableTargetOutputs: 0`,
`requiredPhysicalInputsCaptured: 0`,
`runtimeBasisPromotions: 0`,
`runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`,
`frontendImplementationFilesTouched: 0`, and
`unsupportedBoundariesProtected: 0`.

Landed refresh status:
`post_v1_ceiling_multileaf_airborne_plenum_input_boundary_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank_after_ceiling_multileaf_airborne_plenum_input_boundary_coverage_refresh`.

Selected next:
`post_v1_runtime_first_route_family_rerank_after_ceiling_multileaf_airborne_plenum_input_boundary_coverage_refresh_plan`
/
`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-ceiling-multileaf-airborne-plenum-input-boundary-coverage-refresh-contract.test.ts`
/
`docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_CEILING_MULTILEAF_AIRBORNE_PLENUM_INPUT_BOUNDARY_COVERAGE_REFRESH_PLAN_2026-06-29.md`
/
`post-V1 runtime-first route-family rerank after ceiling multileaf airborne plenum input-boundary coverage refresh`.

## Acceptance Criteria

- The coverage contract exists at
  `packages/engine/src/post-v1-ceiling-multileaf-airborne-plenum-input-boundary-coverage-refresh-contract.test.ts`.
- The landed owner action, status, candidate, method, and counters above
  remain visible in active docs.
- Plenum airborne outputs remain route `ceiling` `needs_input` with no
  value pins and no runtime basis id.
- Board-only ceiling single-leaf outputs remain calculable and do not
  inherit the plenum input boundary.
- Floor impact, OITC, field/building copy, source-row proximity, and
  confidence-label fallback remain blocked.
- The current gate runner includes the owner contract before this
  coverage refresh is selected for implementation.
