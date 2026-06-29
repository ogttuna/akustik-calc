# Post-V1 Ceiling Roof/Suspended-Ceiling Route Split Boundary Coverage Refresh - 2026-06-29

Status:
`post_v1_ceiling_roof_suspended_ceiling_route_split_boundary_coverage_refresh_plan`

Landed status:
`post_v1_ceiling_roof_suspended_ceiling_route_split_boundary_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank_after_ceiling_roof_suspended_ceiling_route_split_boundary_coverage_refresh`

Planning status:
selected next by
`post_v1_ceiling_roof_suspended_ceiling_route_split_boundary_owner_landed_input_boundary_selected_coverage_refresh`.

Selected candidate to re-probe:
`ceiling.roof_suspended_ceiling_route_split_boundary_owner`

Expected coverage file:
`packages/engine/src/post-v1-ceiling-roof-suspended-ceiling-route-split-boundary-coverage-refresh-contract.test.ts`

Plan file:
`docs/calculator/POST_V1_CEILING_ROOF_SUSPENDED_CEILING_ROUTE_SPLIT_BOUNDARY_COVERAGE_REFRESH_PLAN_2026-06-29.md`

Previous owner:
`post_v1_ceiling_roof_suspended_ceiling_route_split_boundary_owner_plan`
/
`packages/engine/src/post-v1-ceiling-roof-suspended-ceiling-route-split-boundary-owner-contract.test.ts`
/
`docs/calculator/POST_V1_CEILING_ROOF_SUSPENDED_CEILING_ROUTE_SPLIT_BOUNDARY_OWNER_PLAN_2026-06-29.md`
/
`post_v1_ceiling_roof_suspended_ceiling_route_split_boundary_owner_landed_input_boundary_selected_coverage_refresh`.

Selecting rerank:
`post_v1_runtime_first_route_family_rerank_after_ceiling_multileaf_airborne_plenum_field_building_adapter_owner_coverage_refresh_plan`
/
`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-ceiling-multileaf-airborne-plenum-field-building-adapter-owner-coverage-refresh-contract.test.ts`
/
`docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_CEILING_MULTILEAF_AIRBORNE_PLENUM_FIELD_BUILDING_ADAPTER_OWNER_COVERAGE_REFRESH_PLAN_2026-06-29.md`
/
`post_v1_runtime_first_route_family_rerank_after_ceiling_multileaf_airborne_plenum_field_building_adapter_owner_coverage_refresh_landed_no_runtime_selected_ceiling_roof_suspended_ceiling_route_split_boundary_owner`.

Landed owner counters:
`newCalculableRequestShapes: 0`,
`newCalculableTargetOutputs: 0`,
`requiredPhysicalInputsCaptured: 4`,
`runtimeBasisPromotions: 0`,
`runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`,
`frontendImplementationFilesTouched: 0`, and
`unsupportedBoundariesProtected: 8`.

This is not a broad source crawl.

Selected next action:
`post_v1_runtime_first_route_family_rerank_after_ceiling_roof_suspended_ceiling_route_split_boundary_coverage_refresh_plan`

Selected next file:
`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-ceiling-roof-suspended-ceiling-route-split-boundary-coverage-refresh-contract.test.ts`

Selected next plan:
`docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_CEILING_ROOF_SUSPENDED_CEILING_ROUTE_SPLIT_BOUNDARY_COVERAGE_REFRESH_PLAN_2026-06-29.md`

Selected next label:
`post-V1 runtime-first route-family rerank after ceiling roof/suspended-ceiling route split boundary coverage refresh`.

## Purpose

Re-probe the just-landed route split boundary before selecting the next
runtime-first owner. The coverage refresh must prove that ambiguous
roof/ceiling/suspended-ceiling stacks still return route-context
`needs_input`, explicit wrong-family route requests stay `unsupported`,
and explicitly routed ceiling airborne plenum field/building values
remain pinned.

## Expected Counters

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

## Landed Runtime Status

The coverage refresh moved no runtime values and did not retune any
formula. It re-probed the just-landed route split boundary and selected
the follow-up runtime-first rerank named above.

## Acceptance Criteria

- Ambiguous roof/ceiling/suspended-ceiling stacks keep
  `post_v1_ceiling_roof_suspended_ceiling_route_split_boundary_missing_route_context`.
- Explicit roof/facade, ceiling-airborne impact, and lower-treatment
  airborne aliases keep
  `post_v1_ceiling_roof_suspended_ceiling_route_split_boundary_unsupported_route_family`.
- Explicit ceiling airborne plenum field/building values remain pinned
  at `R'w 47`, `Dn,w 44.9`, `Dn,A 43.2`, `DnT,w 45.7`,
  `DnT,A 44`, and `DnT,A,k 41.1`.
- The next step after this refresh must be a runtime-first rerank, not a
  broad support loop.
