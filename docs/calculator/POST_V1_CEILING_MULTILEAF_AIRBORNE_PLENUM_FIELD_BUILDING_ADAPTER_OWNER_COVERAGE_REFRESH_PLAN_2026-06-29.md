# Post-V1 Ceiling Multileaf Airborne Plenum Field/Building Adapter Owner Coverage Refresh - 2026-06-29

Action:
`post_v1_ceiling_multileaf_airborne_plenum_field_building_adapter_owner_coverage_refresh_plan`

Status:
`post_v1_ceiling_multileaf_airborne_plenum_field_building_adapter_owner_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank_after_ceiling_multileaf_airborne_plenum_field_building_adapter_owner_coverage_refresh`

Planning status:
selected next by
`post_v1_ceiling_multileaf_airborne_plenum_field_building_adapter_owner_landed_runtime_basis_selected_coverage_refresh`.

Expected coverage refresh file:
`packages/engine/src/post-v1-ceiling-multileaf-airborne-plenum-field-building-adapter-owner-coverage-refresh-contract.test.ts`

Plan file:
`docs/calculator/POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_FIELD_BUILDING_ADAPTER_OWNER_COVERAGE_REFRESH_PLAN_2026-06-29.md`

Protected owner:
`post_v1_ceiling_multileaf_airborne_plenum_field_building_adapter_owner_plan`
/
`packages/engine/src/post-v1-ceiling-multileaf-airborne-plenum-field-building-adapter-owner-contract.test.ts`
/
`docs/calculator/POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_FIELD_BUILDING_ADAPTER_OWNER_PLAN_2026-06-29.md`
/
`post_v1_ceiling_multileaf_airborne_plenum_field_building_adapter_owner_landed_runtime_basis_selected_coverage_refresh`.

Previous coverage refresh:
`post_v1_ceiling_multileaf_airborne_plenum_element_lab_formula_owner_coverage_refresh_plan`
/
`packages/engine/src/post-v1-ceiling-multileaf-airborne-plenum-element-lab-formula-owner-coverage-refresh-contract.test.ts`
/
`docs/calculator/POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_ELEMENT_LAB_FORMULA_OWNER_COVERAGE_REFRESH_PLAN_2026-06-29.md`
/
`post_v1_ceiling_multileaf_airborne_plenum_element_lab_formula_owner_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank_after_ceiling_multileaf_airborne_plenum_element_lab_formula_owner_coverage_refresh`.

Previous rerank:
`post_v1_runtime_first_route_family_rerank_after_ceiling_multileaf_airborne_plenum_element_lab_formula_owner_coverage_refresh_plan`
/
`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-ceiling-multileaf-airborne-plenum-element-lab-formula-owner-coverage-refresh-contract.test.ts`
/
`docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_CEILING_MULTILEAF_AIRBORNE_PLENUM_ELEMENT_LAB_FORMULA_OWNER_COVERAGE_REFRESH_PLAN_2026-06-29.md`
/
`post_v1_runtime_first_route_family_rerank_after_ceiling_multileaf_airborne_plenum_element_lab_formula_owner_coverage_refresh_landed_no_runtime_selected_ceiling_multileaf_airborne_plenum_field_building_adapter_owner`.

Selected owner candidate:
`ceiling.multileaf_airborne_plenum_field_building_adapter_owner`.

Runtime resolver candidates:
`ceiling.multileaf_airborne_plenum_field_context_adapter` and
`ceiling.multileaf_airborne_plenum_building_prediction_adapter`.

Selected next label:
`post-V1 ceiling multileaf airborne plenum field/building adapter owner coverage refresh`

This is not a broad source crawl.

Selected next action after this refresh:
`post_v1_runtime_first_route_family_rerank_after_ceiling_multileaf_airborne_plenum_field_building_adapter_owner_coverage_refresh_plan`

Selected next file:
`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-ceiling-multileaf-airborne-plenum-field-building-adapter-owner-coverage-refresh-contract.test.ts`

Selected next plan:
`docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_CEILING_MULTILEAF_AIRBORNE_PLENUM_FIELD_BUILDING_ADAPTER_OWNER_COVERAGE_REFRESH_PLAN_2026-06-29.md`

Selected next label:
`post-V1 runtime-first route-family rerank after ceiling multileaf airborne plenum field/building adapter owner coverage refresh`

## Refresh Scope

This is a no-runtime coverage refresh. It must re-probe the landed
ceiling multileaf/plenum field/building adapter owner without retuning
formulas, importing source rows, widening the candidate set, or touching
frontend implementation files.

Field request values to keep pinned:

- `R'w 47`
- `Dn,w 44.9`
- `Dn,A 43.2`
- `DnT,w 45.7`
- `DnT,A 44`

Building request values to keep pinned:

- `R'w 47`
- `Dn,w 44.9`
- `Dn,A 43.2`
- `DnT,w 45.7`
- `DnT,A 44`
- `DnT,A,k 41.1`

Required boundaries to re-probe:

- missing room, area, RT60, source-room, or flanking context remains
  precise `needs_input`;
- lab `Rw` / `STC` / `C` / `Ctr` does not alias into field/building
  outputs;
- floor impact `Ln,w`, `DeltaLw`, `IIC`, and `AIIC` remain outside this
  owner;
- opening/facade `OITC` remains outside this owner;
- ASTM aliases remain blocked;
- source-row proximity substitution remains blocked;
- confidence fallback remains blocked.

Expected refresh counters:
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

Landed refresh note:
the coverage refresh contract re-probes runtime resolver candidates
`ceiling.multileaf_airborne_plenum_field_context_adapter` and
`ceiling.multileaf_airborne_plenum_building_prediction_adapter`. It
keeps complete ceiling-only multileaf/plenum field values pinned at
`R'w 47`, `Dn,w 44.9`, `Dn,A 43.2`, `DnT,w 45.7`, and `DnT,A 44`, and
keeps complete building values pinned at those values plus
`DnT,A,k 41.1`. Missing room/flanking context remains `needs_input`;
lab aliasing, impact, `IIC`/`AIIC`, `OITC`, ASTM aliases,
source-row proximity substitution, and confidence fallback remain
blocked. It selects the runtime-first rerank above.

Protected landed owner counters:
`newCalculableRequestShapes: 2`,
`newCalculableTargetOutputs: 6`,
`requiredPhysicalInputsCaptured: 4`,
`runtimeBasisPromotions: 2`,
`runtimeValuesMoved 11`,
`runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`,
`frontendImplementationFilesTouched: 0`, and
`unsupportedBoundariesProtected: 6`.

## Implementation Steps

1. Add the no-runtime coverage refresh contract at
   `packages/engine/src/post-v1-ceiling-multileaf-airborne-plenum-field-building-adapter-owner-coverage-refresh-contract.test.ts`.
2. Reuse the complete field and building fixtures from the owner
   contract.
3. Assert the field/building values, route `ceiling`, runtime basis
   methods, resolver candidates, warnings, and value pins stay unchanged.
4. Assert missing context, lab aliases, impact, `OITC`, ASTM aliases,
   source proximity, and confidence fallback remain blocked.
5. Select the next runtime-first route-family rerank only after this
   refresh passes.

## Acceptance Criteria

- The refresh moves no runtime values and imports no source rows.
- `runtimeValuesMoved 0` and `runtimeFormulaRetunes: 0` remain explicit.
- The owner values and boundaries stay identical to the landed runtime
  owner.
- The next selected action after this refresh is a runtime-first rerank,
  not a broad source crawl or support loop.
