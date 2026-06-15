# Post-V1 Next Numeric Coverage Gap After Direct-Fixed A-Weighted Field/Building Plan - 2026-06-12

## North Star

DynEcho is an acoustic calculator. The direct-fixed double-leaf/framed
A-weighted field/building owner and surface parity are now covered by a
no-runtime refresh. The next step is a bounded numeric coverage rerank:
subtract the closed direct-fixed lab, base field/building, and
A-weighted field/building lanes, then choose the highest-ROI calculator
slice that can move scope or accuracy without weakening metric-basis
boundaries.

## Previous Coverage Refresh

Previous owner:

`post_v1_wall_double_leaf_framed_direct_fixed_a_weighted_field_building_owner_plan`

Previous owner file:

`packages/engine/src/post-v1-wall-double-leaf-framed-direct-fixed-a-weighted-field-building-owner-contract.test.ts`

Previous owner status:

`post_v1_wall_double_leaf_framed_direct_fixed_a_weighted_field_building_owner_landed_runtime_selected_surface_parity`

Previous surface parity:

`post_v1_wall_double_leaf_framed_direct_fixed_a_weighted_field_building_surface_parity_plan`

Previous surface parity file:

`apps/web/features/workbench/post-v1-wall-double-leaf-framed-direct-fixed-a-weighted-field-building-surface-parity.test.ts`

Previous surface parity status:

`post_v1_wall_double_leaf_framed_direct_fixed_a_weighted_field_building_surface_parity_landed_no_runtime_selected_coverage_refresh`

Coverage refresh action:

`post_v1_wall_double_leaf_framed_direct_fixed_a_weighted_field_building_coverage_refresh_plan`

Coverage refresh file:

`packages/engine/src/post-v1-wall-double-leaf-framed-direct-fixed-a-weighted-field-building-coverage-refresh-contract.test.ts`

Coverage refresh status:

`post_v1_wall_double_leaf_framed_direct_fixed_a_weighted_field_building_coverage_refresh_landed_no_runtime_selected_next_numeric_coverage_gap`

The refresh re-probes empty direct-fixed `Dn,A 24.9` / `DnT,A 27`,
full context-owned absorptive `Dn,A 28.9` / `DnT,A 31`, and partial
context-owned absorptive `Dn,A 26.9` / `DnT,A 29`. Field requests use
`gate_i_airborne_field_apparent_context_adapter_runtime`; building
requests use
`gate_ar_airborne_building_prediction_all_owner_runtime_corridor`; both
keep `gate_eo_direct_fixed_double_leaf_bridge_loss_runtime` /
`wall.direct_fixed_double_leaf.equivalent_coupled_mass_bridge_loss_owner`
as the direct separating-element curve. The Gate I / Gate AR rows stay
`ready_with_budget` in coverage and `allowed_with_budget` in
company-internal V0. Missing absorber ownership, Gate AY panelized
input, non-direct-fixed stacks, lab aliases, ASTM/IIC/AIIC, and impact
outputs remain outside the route.

Coverage refresh counters:

- `coverageRefreshContractFilesTouched: 1`;
- `webSurfaceParityContractFilesTouched: 1`;
- `frontendImplementationFilesTouched: 0`;
- `runtimeValuesMoved 0`;
- `runtimeFormulaRetunes: 0`;
- `sourceRowsImported: 0`.

This is not a broad source crawl.

## Work Order

Selected action:

`post_v1_next_numeric_coverage_gap_after_direct_fixed_a_weighted_field_building_plan`

Selected file:

`packages/engine/src/post-v1-next-numeric-coverage-gap-after-direct-fixed-a-weighted-field-building-contract.test.ts`

Selected plan doc:

`docs/calculator/POST_V1_NEXT_NUMERIC_COVERAGE_GAP_AFTER_DIRECT_FIXED_A_WEIGHTED_FIELD_BUILDING_PLAN_2026-06-12.md`

Selected label:

`post-V1 next numeric coverage gap after direct-fixed A-weighted field/building`

The rerank should run at least two ROI passes before choosing a runtime
candidate. It must prefer a value-moving or accuracy-tightening
calculator route over source-catalog or UI work. It should explicitly
subtract the closed direct-fixed owner chain and reject candidates that
would alias lab, field, building, ASTM, impact, or A-weighted metrics
without owned basis.

Expected selection-step counters:

- `roiAnalysisIterations: 2` or more;
- `candidateCount` recorded from the evaluated open rows;
- `immediateRuntimeValuesMoved: 0`;
- `runtimeValuesMoved 0`;
- `runtimeFormulaRetunes: 0`;
- `sourceRowsImported: 0`;
- `frontendImplementationFilesTouched: 0`.

The selected runtime follow-up should be documented only after the rerank
proves it is higher ROI than the remaining open candidates.

## Landed Outcome

Rerank status:

`post_v1_next_numeric_coverage_gap_after_direct_fixed_a_weighted_field_building_landed_no_runtime_selected_user_material_double_leaf_route_input_owner`

Selected candidate:

`wall.double_leaf_framed.user_material_route_input_owner`

Selected next action:

`post_v1_wall_double_leaf_framed_user_material_route_input_owner_plan`

Selected next file:

`packages/engine/src/post-v1-wall-double-leaf-framed-user-material-route-input-owner-contract.test.ts`

Selected next plan doc:

`docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_USER_MATERIAL_ROUTE_INPUT_OWNER_PLAN_2026-06-12.md`

Selected next label:

`post-V1 wall double-leaf/framed user-material route-input owner`

The rerank ran `roiAnalysisIterations: 3`. It subtracted the closed
direct-fixed lab/base/A-weighted lanes and default-catalog
double-leaf/framed lab/field/building lanes, rejected broad source
crawling and UI/material-editor work, and selected user-material
route-input ownership because explicit custom `panel_leaf /
porous_absorber / panel_leaf` stacks carry the physical inputs required
by the existing formula route but were not reaching resolver and solver
catalog ownership.

Counters: `candidateCount 8`,
`closedDirectFixedAWeightedRowsRechecked: 6`,
`closedDirectFixedBaseAndLabRowsRechecked: 9`,
`closedNonDirectDoubleLeafRowsRechecked: 9`,
`userMaterialBoundaryRowsRechecked: 3`,
`estimatedNextCalculableRequestShapes: 3`,
`estimatedNextRuntimeValuesMoved: 12`, `runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`.

This is not a broad source crawl.
