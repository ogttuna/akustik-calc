# Post-V1 Ceiling Single-Leaf Airborne Route Owner - 2026-06-26

Status:
`post_v1_ceiling_single_leaf_airborne_route_owner_landed_runtime_basis_selected_coverage_refresh`

Owner action:
`post_v1_ceiling_single_leaf_airborne_route_owner_plan`

Owner file:
`packages/engine/src/post-v1-ceiling-single-leaf-airborne-route-owner-contract.test.ts`

Owner plan:
`docs/calculator/POST_V1_CEILING_SINGLE_LEAF_AIRBORNE_ROUTE_OWNER_PLAN_2026-06-26.md`

Selected by:
`post_v1_runtime_first_route_family_rerank_after_floor_user_material_impact_lower_treatment_depth_coverage_refresh_plan`

Selected by status:
`post_v1_runtime_first_route_family_rerank_after_floor_user_material_impact_lower_treatment_depth_coverage_refresh_landed_no_runtime_selected_ceiling_single_leaf_airborne_route_owner`

Selected candidate:
`ceiling.single_leaf_airborne_mass_law.source_absent`

## Selection Card

- user construction / formula family: standalone ceiling-only
  gypsum-board single-leaf stack, represented by two `ceiling_board`
  layers with no base floor carrier, cavity, support bridge, porous
  fill, field context, or building context.
- target outputs to open: `Rw`, `STC`, `C`, and `Ctr`.
- route: first-class `ceiling` resolver route using the existing
  single-leaf mass-law banded source-absent formula corridor and
  ISO 717-1 rating adapter.
- required physical inputs: `route=ceiling`,
  `ceilingOnlyLayerRoles`, `visibleLeafCount`, `densityKgM3`,
  `surfaceMassKgM2`, `thicknessMm`,
  `oneThirdOctaveTransmissionLossCurve`, and
  `iso717AirborneRatingAdapter`.
- `needs_input` behavior: impact requests still require floor-impact
  carrier context such as `baseSlabOrFloor`,
  `toppingOrFloatingLayer`,
  `resilientLayerDynamicStiffnessMNm3`, and `loadBasisKgM2`.
- `unsupported` boundaries: ceiling field/building metrics need a
  future room/plenum owner; `OITC` needs an outdoor-indoor contour
  adapter; ASTM `IIC`/`AIIC` must not alias ISO impact outputs; exact
  rows still outrank this source-absent formula route when they truly
  match.
- expected `newCalculableRequestShapes`: `1`.
- expected `newCalculableTargetOutputs`: `4`.
- expected `runtimeBasisPromotions`: `1`.
- expected `runtimeValuesMoved`: `4`.

## Landed Behavior

Complete ceiling-only gypsum-board single-leaf lab requests now select
the first-class ceiling candidate instead of being traced as a floor
route:

- `route: ceiling`;
- `selectedCandidateId:
  ceiling.single_leaf_airborne_mass_law.source_absent`;
- `runtimeBasisId:
  layer_combination_resolver_single_leaf_mass_law_banded_source_absent_formula_corridor`;
- values: `Rw 34`, `STC 34`, `C 3.7`, and `Ctr 8`.

The owner also suppresses implicit floor-impact family estimates for
ceiling-only role stacks when no explicit impact predictor or exact
impact source is supplied. This prevents an unrequested floor `Ln,w`
proxy from appearing beside a standalone ceiling airborne answer.

Impact requests on the same ceiling-only stack remain `needs_input` on
the floor-impact route, and `OITC` remains unsupported. Wall/floor
single-leaf requests continue to use their existing candidate; the
shared formula backbone is now selected route-aware by the adapter.

Counters:
`newCalculableLayerTemplates: 1`,
`newCalculableRequestShapes: 1`,
`newCalculableTargetOutputs: 4`,
`requiredPhysicalInputsCaptured: 1`,
`runtimeBasisPromotions: 1`,
`runtimeValuesMoved 4`,
`runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`,
`frontendImplementationFilesTouched: 0`, and
`unsupportedBoundariesProtected: 5`.

This is not a broad source crawl, catalog import, formula retune, or
frontend slice.

## Selected Next

Selected next action:
`post_v1_ceiling_single_leaf_airborne_route_coverage_refresh_plan`

Selected next file:
`packages/engine/src/post-v1-ceiling-single-leaf-airborne-route-coverage-refresh-contract.test.ts`

Selected next plan:
`docs/calculator/POST_V1_CEILING_SINGLE_LEAF_AIRBORNE_ROUTE_COVERAGE_REFRESH_PLAN_2026-06-26.md`

Selected next label:
`post-V1 ceiling single-leaf airborne route coverage refresh`
