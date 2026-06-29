# Post-V1 Ceiling Roof/Suspended-Ceiling Route Split Boundary Owner - 2026-06-29

Status:
`post_v1_ceiling_roof_suspended_ceiling_route_split_boundary_owner_plan`

Landed status:
`post_v1_ceiling_roof_suspended_ceiling_route_split_boundary_owner_landed_input_boundary_selected_coverage_refresh`

Planning status:
selected next by
`post_v1_runtime_first_route_family_rerank_after_ceiling_multileaf_airborne_plenum_field_building_adapter_owner_coverage_refresh_landed_no_runtime_selected_ceiling_roof_suspended_ceiling_route_split_boundary_owner`.

Selected candidate:
`ceiling.roof_suspended_ceiling_route_split_boundary_owner`

Expected owner file:
`packages/engine/src/post-v1-ceiling-roof-suspended-ceiling-route-split-boundary-owner-contract.test.ts`

Plan file:
`docs/calculator/POST_V1_CEILING_ROOF_SUSPENDED_CEILING_ROUTE_SPLIT_BOUNDARY_OWNER_PLAN_2026-06-29.md`

Selected next action:
`post_v1_ceiling_roof_suspended_ceiling_route_split_boundary_coverage_refresh_plan`

Selected next file:
`packages/engine/src/post-v1-ceiling-roof-suspended-ceiling-route-split-boundary-coverage-refresh-contract.test.ts`

Selected next plan:
`docs/calculator/POST_V1_CEILING_ROOF_SUSPENDED_CEILING_ROUTE_SPLIT_BOUNDARY_COVERAGE_REFRESH_PLAN_2026-06-29.md`

Selected next label:
`post-V1 ceiling roof/suspended-ceiling route split boundary coverage refresh`

Previous coverage refresh:
`post_v1_ceiling_multileaf_airborne_plenum_field_building_adapter_owner_coverage_refresh_plan`
/
`packages/engine/src/post-v1-ceiling-multileaf-airborne-plenum-field-building-adapter-owner-coverage-refresh-contract.test.ts`
/
`docs/calculator/POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_FIELD_BUILDING_ADAPTER_OWNER_COVERAGE_REFRESH_PLAN_2026-06-29.md`
/
`post_v1_ceiling_multileaf_airborne_plenum_field_building_adapter_owner_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank_after_ceiling_multileaf_airborne_plenum_field_building_adapter_owner_coverage_refresh`.

Previous owner:
`post_v1_ceiling_multileaf_airborne_plenum_field_building_adapter_owner_plan`
/
`packages/engine/src/post-v1-ceiling-multileaf-airborne-plenum-field-building-adapter-owner-contract.test.ts`
/
`docs/calculator/POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_FIELD_BUILDING_ADAPTER_OWNER_PLAN_2026-06-29.md`
/
`post_v1_ceiling_multileaf_airborne_plenum_field_building_adapter_owner_landed_runtime_basis_selected_coverage_refresh`.

Selecting rerank:
`post_v1_runtime_first_route_family_rerank_after_ceiling_multileaf_airborne_plenum_field_building_adapter_owner_coverage_refresh_plan`
/
`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-ceiling-multileaf-airborne-plenum-field-building-adapter-owner-coverage-refresh-contract.test.ts`
/
`docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_CEILING_MULTILEAF_AIRBORNE_PLENUM_FIELD_BUILDING_ADAPTER_OWNER_COVERAGE_REFRESH_PLAN_2026-06-29.md`
/
`post_v1_runtime_first_route_family_rerank_after_ceiling_multileaf_airborne_plenum_field_building_adapter_owner_coverage_refresh_landed_no_runtime_selected_ceiling_roof_suspended_ceiling_route_split_boundary_owner`.

Selected owner label:
`post-V1 ceiling roof/suspended-ceiling route split boundary owner`

This is not a broad source crawl.

Runtime status:
landed input-boundary slice. Ambiguous ceiling/roof/suspended-ceiling
plenum stacks now return
`post_v1_ceiling_roof_suspended_ceiling_route_split_boundary_missing_route_context`
with `airborneContext.routeIntent`,
`airborneContext.roofOrCeilingMountingContext`,
`airborneContext.suspendedCeilingAirborneOrImpactIntent`, and
`airborneContext.hangerOrSupportCouplingClass` as required inputs.
Explicit roof/facade, ceiling-airborne impact, and lower-treatment
airborne aliases return
`post_v1_ceiling_roof_suspended_ceiling_route_split_boundary_unsupported_route_family`.
Explicit ceiling-airborne plenum route context keeps the existing
field/building values pinned.

## Purpose

The ceiling multileaf/plenum element-lab, field, and building routes are
now owned and protected. The next high-ROI gap is not another formula
retune; it is route integrity. Common user-entered stacks can describe a
roof, a ceiling airborne assembly, a suspended ceiling as an airborne
lining, or a suspended-ceiling lower treatment for floor impact. Those
families must not borrow each other's metrics.

This owner is a narrow route/input-boundary slice. It should capture the
minimum route context required to prevent wrong-family publication and
return precise `needs_input` or `unsupported` boundaries when the route
cannot be physically owned.

## Selection Card

User construction / formula family:
ceiling, roof, and suspended-ceiling stacks that are ambiguous between
airborne ceiling/plenum prediction, roof/facade transmission, and floor
impact lower-treatment prediction.

Target outputs to open:
none in this owner. It protects already-opened ceiling airborne
`Rw`, `STC`, `C`, `Ctr`, `R'w`, `Dn,w`, `Dn,A`, `DnT,w`, `DnT,A`, and
`DnT,A,k`, and it blocks wrong-family `Ln,w`, `DeltaLw`, `IIC`, and
`AIIC` publication.

Route:
input-boundary and route split owner. No measured-row import, no source
crawl, no lab-to-field copy, no ISO-to-ASTM impact alias, and no runtime
formula retune.

Required physical inputs:

- `routeIntent`;
- `roofOrCeilingMountingContext`;
- `suspendedCeilingAirborneOrImpactIntent`;
- `hangerOrSupportCouplingClass`.

Expected `needs_input` behavior:
if a stack is ambiguous between roof, ceiling airborne, and suspended
ceiling impact routes, return precise `needs_input` naming the missing
route context instead of publishing from the nearest ceiling or floor
candidate.

Unsupported boundaries that must remain blocked:

- route promotion by layer role or product name alone;
- floor impact values from ceiling airborne stacks;
- ceiling airborne values from floor lower-treatment impact stacks;
- roof/facade promotion without route-owned context;
- lab `Rw` copied into field/building outputs;
- `OITC` outside the opening/facade spectral owner;
- source-row proximity substitution;
- confidence fallback.

Expected counters:
`newCalculableRequestShapes: 0`,
`newCalculableTargetOutputs: 0`,
`requiredPhysicalInputsCaptured: 4`,
`runtimeBasisPromotions: 0`,
`runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`,
`frontendImplementationFilesTouched: 0`, and
`unsupportedBoundariesProtected: 8`.

Landed counters:
`newCalculableRequestShapes: 0`,
`newCalculableTargetOutputs: 0`,
`requiredPhysicalInputsCaptured: 4`,
`runtimeBasisPromotions: 0`,
`runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`,
`frontendImplementationFilesTouched: 0`, and
`unsupportedBoundariesProtected: 8`.

Selecting rerank counters:
`candidateCount: 7`,
`roiAnalysisIterations: 4`,
`estimatedNextCalculableRequestShapes: 0`,
`estimatedNextCalculableTargetOutputs: 0`,
`estimatedNextRequiredPhysicalInputsCaptured: 4`,
`estimatedNextRuntimeBasisPromotions: 0`,
`estimatedNextRuntimeValuesMoved: 0`,
`estimatedNextUnsupportedBoundariesProtected: 8`,
`runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`.

## Implementation Steps

1. Add the owner contract at
   `packages/engine/src/post-v1-ceiling-roof-suspended-ceiling-route-split-boundary-owner-contract.test.ts`.
2. Model ambiguous ceiling/roof/suspended-ceiling user stacks that could
   otherwise fall into ceiling airborne, floor impact, or roof/facade
   families.
3. Capture route intent, mounting context, airborne-vs-impact suspended
   ceiling intent, and hanger/support coupling class as explicit
   physical inputs.
4. Keep current ceiling multileaf/plenum field/building values pinned:
   `R'w 47`, `Dn,w 44.9`, `Dn,A 43.2`, `DnT,w 45.7`, `DnT,A 44`, and
   `DnT,A,k 41.1`.
5. Keep `IIC`/`AIIC`, `OITC`, ASTM aliases, source-row proximity
   substitution, and confidence fallback blocked unless a later owner
   physically opens them.
6. Select a coverage refresh after this owner lands.

## Acceptance Criteria

- The selected candidate id
  `ceiling.roof_suspended_ceiling_route_split_boundary_owner` is visible
  in the owner contract and active docs.
- Ambiguous roof/ceiling/suspended-ceiling stacks stop with precise
  route-context `needs_input`.
- Already-owned ceiling plenum lab/field/building values do not move.
- No new source rows are imported and no runtime formula is retuned.
- The owner selects a focused coverage refresh, not a broad support loop.
