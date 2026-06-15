# Post-V1 Wall Double-Leaf/Framed User-Material Route-Input Coverage Refresh Plan - 2026-06-12

## North Star

DynEcho is an acoustic calculator. The user-material double-leaf/framed
owner moved runtime values by letting explicit user-supplied
`panel_leaf / porous_absorber / panel_leaf` stacks use the existing
source-absent formula route. The next step is a no-runtime coverage
refresh that freezes this calculator behavior and keeps boundary rows
visible.

This is not a broad source crawl and not material-editor UI work.

## Previous Owner

Previous owner action:

`post_v1_wall_double_leaf_framed_user_material_route_input_owner_plan`

Previous owner file:

`packages/engine/src/post-v1-wall-double-leaf-framed-user-material-route-input-owner-contract.test.ts`

Previous owner status:

`post_v1_wall_double_leaf_framed_user_material_route_input_owner_landed_runtime_selected_coverage_refresh`

Selected candidate:

`wall.double_leaf_framed.user_material_route_input_owner`

Previous rerank status:

`post_v1_next_numeric_coverage_gap_after_direct_fixed_a_weighted_field_building_landed_no_runtime_selected_user_material_double_leaf_route_input_owner`

Runtime moved custom explicit double-leaf/framed lab
`Rw 46 / STC 46 / C -1 / Ctr -6.1`, field
`R'w 40 / Dn,w 41 / Dn,A 39.5 / DnT,w 43 / DnT,A 41.9`, and building
`R'w 40 / Dn,w 41 / Dn,A 39.5 / DnT,w 43 / DnT,A 41.9` onto owned
runtime bases. Unknown material IDs, ASTM/IIC/AIIC, impact outputs, and
metric-basis aliases remain outside the owner.

Owner counters: `newCalculableLayerTemplates: 1`,
`newCalculableRequestShapes: 3`, `newCalculableTargetOutputs: 12`,
`runtimeBasisPromotions: 3`, `runtimeValuesMoved 12`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`,
`frontendImplementationFilesTouched: 0`,
`webSurfaceParityContractFilesTouched: 0`.

## Work Order

Selected action:

`post_v1_wall_double_leaf_framed_user_material_route_input_coverage_refresh_plan`

Selected file:

`packages/engine/src/post-v1-wall-double-leaf-framed-user-material-route-input-coverage-refresh-contract.test.ts`

Selected plan doc:

`docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_USER_MATERIAL_ROUTE_INPUT_COVERAGE_REFRESH_PLAN_2026-06-12.md`

Selected label:

`post-V1 wall double-leaf/framed user-material route-input coverage refresh`

Expected coverage-refresh scope:

- re-probe the custom user-material lab, field, and building values;
- assert the runtime bases remain the double-leaf/framed formula
  corridor, Gate I field adapter, and Gate AR building adapter;
- freeze unknown-material, ASTM/IIC/AIIC, impact, and missing-context
  boundary rows;
- confirm resolver registry, runtime surface, coverage matrix, and
  company-internal V0 posture stay synchronized if those ledgers already
  carry the relevant generic runtime owners;
- move no new runtime values.

Expected counters: `coverageRefreshContractFilesTouched: 1`,
`newCalculableLayerTemplates: 0`, `newCalculableRequestShapes: 0`,
`newCalculableTargetOutputs: 0`, `runtimeBasisPromotions: 0`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, `frontendImplementationFilesTouched: 0`.

## Closeout

Landed status:

`post_v1_wall_double_leaf_framed_user_material_route_input_coverage_refresh_landed_no_runtime_selected_next_numeric_coverage_gap`

The refresh re-probes lab `Rw 46 / STC 46 / C -1 / Ctr -6.1`,
field `R'w 40 / Dn,w 41 / Dn,A 39.5 / DnT,w 43 / DnT,A 41.9`,
and building `R'w 40 / Dn,w 41 / Dn,A 39.5 / DnT,w 43 /
DnT,A 41.9`. Lab stays on
`layer_combination_resolver_double_leaf_framed_wall_banded_source_absent_formula_corridor`;
field stays on `gate_i_airborne_field_apparent_context_adapter_runtime`;
building stays on
`gate_ar_airborne_building_prediction_all_owner_runtime_corridor`.
Unknown custom material IDs, missing explicit topology, ASTM/IIC/AIIC,
and impact outputs remain outside the owner. This is not a broad source
crawl.

Selected next action:

`post_v1_next_numeric_coverage_gap_after_user_material_route_input_plan`

Selected next file:

`packages/engine/src/post-v1-next-numeric-coverage-gap-after-user-material-route-input-contract.test.ts`

Selected next plan doc:

`docs/calculator/POST_V1_NEXT_NUMERIC_COVERAGE_GAP_AFTER_USER_MATERIAL_ROUTE_INPUT_PLAN_2026-06-12.md`

Selected next label:

`post-V1 next numeric coverage gap after user-material route input`
