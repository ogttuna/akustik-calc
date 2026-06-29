# Post-V1 Ceiling Multileaf Airborne Plenum Input-Boundary Owner - 2026-06-29

Status:
`post_v1_ceiling_multileaf_airborne_plenum_input_boundary_owner_landed_input_boundary_selected_coverage_refresh`

Owner action:
`post_v1_ceiling_multileaf_airborne_plenum_input_boundary_owner_plan`

Selected by:
`post_v1_runtime_first_route_family_rerank_after_ceiling_single_leaf_field_building_context_adapter_coverage_refresh_landed_no_runtime_selected_ceiling_multileaf_airborne_plenum_input_boundary_owner`.

Selected candidate:
`ceiling.multileaf_airborne_plenum_input_boundary_owner`.

Expected owner file:
`packages/engine/src/post-v1-ceiling-multileaf-airborne-plenum-input-boundary-owner-contract.test.ts`

Selected next label:
`post-V1 ceiling multileaf airborne plenum input-boundary coverage refresh`.

Owner label:
`post-V1 ceiling multileaf airborne plenum input-boundary owner`

Selected next action:
`post_v1_ceiling_multileaf_airborne_plenum_input_boundary_coverage_refresh_plan`

Selected next file:
`packages/engine/src/post-v1-ceiling-multileaf-airborne-plenum-input-boundary-coverage-refresh-contract.test.ts`

Selected next plan:
`docs/calculator/POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_INPUT_BOUNDARY_COVERAGE_REFRESH_PLAN_2026-06-29.md`

Landed selected coverage refresh:
`post_v1_ceiling_multileaf_airborne_plenum_input_boundary_coverage_refresh_plan`
/
`packages/engine/src/post-v1-ceiling-multileaf-airborne-plenum-input-boundary-coverage-refresh-contract.test.ts`
/
`docs/calculator/POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_INPUT_BOUNDARY_COVERAGE_REFRESH_PLAN_2026-06-29.md`
/
`post_v1_ceiling_multileaf_airborne_plenum_input_boundary_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank_after_ceiling_multileaf_airborne_plenum_input_boundary_coverage_refresh`.
Counters: `coverageRefreshContractFilesTouched: 1`,
`newCalculableRequestShapes: 0`, `newCalculableTargetOutputs: 0`,
`requiredPhysicalInputsCaptured: 0`, `runtimeBasisPromotions: 0`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, `frontendImplementationFilesTouched: 0`, and
`unsupportedBoundariesProtected: 0`. Selected next:
`post_v1_runtime_first_route_family_rerank_after_ceiling_multileaf_airborne_plenum_input_boundary_coverage_refresh_plan`
/
`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-ceiling-multileaf-airborne-plenum-input-boundary-coverage-refresh-contract.test.ts`
/
`docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_CEILING_MULTILEAF_AIRBORNE_PLENUM_INPUT_BOUNDARY_COVERAGE_REFRESH_PLAN_2026-06-29.md`.

Previous landed coverage refresh:
`post_v1_ceiling_single_leaf_field_building_context_adapter_coverage_refresh_plan`
/
`packages/engine/src/post-v1-ceiling-single-leaf-field-building-context-adapter-coverage-refresh-contract.test.ts`
/
`post_v1_ceiling_single_leaf_field_building_context_adapter_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank_after_ceiling_single_leaf_field_building_context_adapter_coverage_refresh`.

Previous rerank:
`post_v1_runtime_first_route_family_rerank_after_ceiling_single_leaf_field_building_context_adapter_coverage_refresh_plan`
/
`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-ceiling-single-leaf-field-building-context-adapter-coverage-refresh-contract.test.ts`.

This is not a broad source crawl.

## Landed Behavior

The owner landed as an input-boundary behavior, not a runtime formula
publication. Method
`post_v1_ceiling_multileaf_airborne_plenum_input_boundary_missing_physical_inputs`
now stops ceiling-only board plus plenum/cavity/fill airborne requests
on route `ceiling` before the single-leaf mass-law source-absent route,
floor-impact suspended-ceiling route, field/building adapters,
source-row proximity, or confidence-label fallback can publish values.

The boundary returns precise `needs_input` for:

- `ceilingLeafGrouping`;
- `ceilingLeafSurfaceMassKgM2`;
- `ceilingCavityOrPlenumDepthMm`;
- `ceilingAbsorberThicknessAndFlowResistivity`;
- `ceilingSupportCouplingOrHangerClass`.

Board-only ceiling single-leaf stacks remain calculable through
`ceiling.single_leaf_airborne_mass_law.source_absent`; impact requests
remain floor `needs_input`; OITC remains outside this owner.

Landed counters:
`newCalculableRequestShapes: 0`,
`newCalculableTargetOutputs: 0`,
`requiredPhysicalInputsCaptured: 5`,
`runtimeBasisPromotions: 0`,
`runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`,
`frontendImplementationFilesTouched: 0`, and
`unsupportedBoundariesProtected: 7`.

## Purpose

The ceiling single-leaf lab and field/building route is now protected.
The next high-ROI calculator gap is user-entered ceiling stacks that are
not single-leaf: suspended boards below a plenum, multiple ceiling
leaves, absorber in the cavity, or resilient/hanger coupling. Those
requests cannot safely calculate through the single-leaf mass-law route,
the floor-impact suspended-ceiling route, or nearby source rows.

This owner is an input-boundary slice. It should not publish new runtime
values yet. Its job is to make the route physically honest before the
formula owner: capture the missing physical inputs, return precise
`needs_input` when they are absent, and keep unsupported/adjacent metric
bases blocked.

## Selection Card

User construction / formula family:
ceiling-only airborne multileaf or suspended-plenum assembly, such as
gypsum board leaf or leaves below a ceiling cavity/plenum with optional
absorber and resilient/hanger support. This is a ceiling airborne route,
not a floor impact lower-treatment route.

Target outputs to unlock later:
`Rw`, `STC`, `C`, and `Ctr` first on `element_lab`; field/building
outputs must wait until a later adapter consumes explicit room and
flanking context.

Route:
input-surface and boundary owner for a future owned multileaf/plenum
airborne formula route. No measured-row import, no bounded delta, no
runtime retune, and no source-row proximity substitution in this slice.

Required physical inputs:
`ceilingLeafGrouping`, `ceilingLeafSurfaceMassKgM2`,
`ceilingCavityOrPlenumDepthMm`,
`ceilingAbsorberThicknessAndFlowResistivity`, and
`ceilingSupportCouplingOrHangerClass`.

Expected `needs_input` behavior:
if any required physical input is missing, the result must name the
missing field and avoid low-confidence fallback, single-leaf fallback,
floor-impact fallback, or source-row substitution. If all inputs are
present before the formula owner exists, the route should remain
`unsupported` with a precise "formula owner not landed" boundary rather
than fabricate a value.

Unsupported boundaries that must remain blocked:
floor-impact `Ln,w`, `DeltaLw`, `IIC`, and `AIIC`; roof/facade route
promotion; outdoor-indoor `OITC`; field/building copies from lab
outputs; scalar `Rw` to `STC`/`C`/`Ctr` fabrication without an owned
spectrum/rating adapter; and broad source-row/catalog fallback.

Expected counters:
`newCalculableRequestShapes: 0`,
`newCalculableTargetOutputs: 0`,
`requiredPhysicalInputsCaptured: 5`,
`runtimeBasisPromotions: 0`,
`runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`,
`frontendImplementationFilesTouched: 0`, and
`unsupportedBoundariesProtected: 7`.

## Implementation Steps

1. Add the owner contract at
   `packages/engine/src/post-v1-ceiling-multileaf-airborne-plenum-input-boundary-owner-contract.test.ts`.
2. Model one complete ceiling multileaf/plenum user stack and several
   incomplete variants. The contract should prove complete input is
   routed to the named ceiling input boundary while missing input
   returns exact `needs_input`.
3. Keep runtime values frozen. This owner may capture input fields and
   boundary behavior, but it must not calculate `Rw`, `STC`, `C`, `Ctr`,
   field/building metrics, impact metrics, or `OITC`.
4. Prove the route does not fall back to
   `ceiling.single_leaf_airborne_mass_law.source_absent`,
   `floor.lightweight_steel.suspended_ceiling_only.source_absent`, or
   any confidence/source-row proximity fallback.
5. Wire the owner into `tools/dev/run-calculator-current-gate.ts` only
   after the contract is green and docs are synchronized.

## Acceptance Criteria

- The selected candidate id
  `ceiling.multileaf_airborne_plenum_input_boundary_owner` is visible in
  the owner contract and active docs.
- Missing physical inputs are precise and user-actionable.
- Complete physical inputs do not cause value publication until the
  formula owner lands.
- The floor-impact suspended-ceiling corridor remains floor-only.
- OITC, ASTM impact aliases, roof/facade promotion, field/building
  promotion, source-row proximity, and confidence-label fallback remain
  blocked.
- `candidateCount: 8`,
  `estimatedNextRequiredPhysicalInputsCaptured: 5`,
  `estimatedNextRuntimeValuesMoved: 0`, and `runtimeValuesMoved 0`
  remain recorded from the selecting rerank.
