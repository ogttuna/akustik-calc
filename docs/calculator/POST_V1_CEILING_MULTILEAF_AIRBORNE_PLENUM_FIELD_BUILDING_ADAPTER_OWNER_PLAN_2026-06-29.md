# Post-V1 Ceiling Multileaf Airborne Plenum Field/Building Adapter Owner - 2026-06-29

Status:
`post_v1_ceiling_multileaf_airborne_plenum_field_building_adapter_owner_landed_runtime_basis_selected_coverage_refresh`

Owner action:
`post_v1_ceiling_multileaf_airborne_plenum_field_building_adapter_owner_plan`

Planning status:
landed runtime owner selected by
`post_v1_runtime_first_route_family_rerank_after_ceiling_multileaf_airborne_plenum_element_lab_formula_owner_coverage_refresh_landed_no_runtime_selected_ceiling_multileaf_airborne_plenum_field_building_adapter_owner`.

Expected owner file:
`packages/engine/src/post-v1-ceiling-multileaf-airborne-plenum-field-building-adapter-owner-contract.test.ts`

Plan file:
`docs/calculator/POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_FIELD_BUILDING_ADAPTER_OWNER_PLAN_2026-06-29.md`

Selected next label:
`post-V1 ceiling multileaf airborne plenum field/building adapter owner`

Selected next action:
`post_v1_ceiling_multileaf_airborne_plenum_field_building_adapter_owner_coverage_refresh_plan`

Selected next file:
`packages/engine/src/post-v1-ceiling-multileaf-airborne-plenum-field-building-adapter-owner-coverage-refresh-contract.test.ts`

Selected next plan:
`docs/calculator/POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_FIELD_BUILDING_ADAPTER_OWNER_COVERAGE_REFRESH_PLAN_2026-06-29.md`

Selected next coverage refresh label:
`post-V1 ceiling multileaf airborne plenum field/building adapter owner coverage refresh`

Selected candidate:
`ceiling.multileaf_airborne_plenum_field_building_adapter_owner`.

Runtime resolver candidates:
`ceiling.multileaf_airborne_plenum_field_context_adapter` and
`ceiling.multileaf_airborne_plenum_building_prediction_adapter`.

Selected by rerank:
`post_v1_runtime_first_route_family_rerank_after_ceiling_multileaf_airborne_plenum_element_lab_formula_owner_coverage_refresh_plan`
/
`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-ceiling-multileaf-airborne-plenum-element-lab-formula-owner-coverage-refresh-contract.test.ts`
/
`docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_CEILING_MULTILEAF_AIRBORNE_PLENUM_ELEMENT_LAB_FORMULA_OWNER_COVERAGE_REFRESH_PLAN_2026-06-29.md`
/
`post_v1_runtime_first_route_family_rerank_after_ceiling_multileaf_airborne_plenum_element_lab_formula_owner_coverage_refresh_landed_no_runtime_selected_ceiling_multileaf_airborne_plenum_field_building_adapter_owner`.

Previous coverage refresh:
`post_v1_ceiling_multileaf_airborne_plenum_element_lab_formula_owner_coverage_refresh_plan`
/
`packages/engine/src/post-v1-ceiling-multileaf-airborne-plenum-element-lab-formula-owner-coverage-refresh-contract.test.ts`
/
`docs/calculator/POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_ELEMENT_LAB_FORMULA_OWNER_COVERAGE_REFRESH_PLAN_2026-06-29.md`
/
`post_v1_ceiling_multileaf_airborne_plenum_element_lab_formula_owner_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank_after_ceiling_multileaf_airborne_plenum_element_lab_formula_owner_coverage_refresh`.

Protected element-lab owner:
`post_v1_ceiling_multileaf_airborne_plenum_element_lab_formula_owner_plan`
/
`packages/engine/src/post-v1-ceiling-multileaf-airborne-plenum-element-lab-formula-owner-contract.test.ts`
/
`docs/calculator/POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_ELEMENT_LAB_FORMULA_OWNER_PLAN_2026-06-29.md`
/
`post_v1_ceiling_multileaf_airborne_plenum_element_lab_formula_owner_landed_runtime_basis_selected_coverage_refresh`.

Protected runtime method:
`post_v1_ceiling_multileaf_airborne_plenum_element_lab_formula_owner`.

Protected element-lab values:
`Rw 48`, `STC 48`, `C -1.7`, and `Ctr -6.5`.

Landed runtime values:
complete ceiling-only multileaf/plenum field requests publish
`R'w 47`, `Dn,w 44.9`, `Dn,A 43.2`, `DnT,w 45.7`, and `DnT,A 44`
on route `ceiling`. Complete building requests publish those values
plus `DnT,A,k 41.1`.

Landed owner counters:
`newCalculableRequestShapes: 2`,
`newCalculableTargetOutputs: 6`,
`requiredPhysicalInputsCaptured: 4`,
`runtimeBasisPromotions: 2`,
`runtimeValuesMoved 11`,
`runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`,
`frontendImplementationFilesTouched: 0`, and
`unsupportedBoundariesProtected: 6`.

This is not a broad source crawl.

## Selection Card

User construction / formula family:
ceiling-only multileaf or suspended-plenum airborne stack with explicit
`ceilingPlenum` context and complete field/building room context.

Target outputs to open:
`R'w`, `Dn,w`, `Dn,A`, `DnT,w`, `DnT,A`, and, when the building basis
owns it, `DnT,A,k`.

Adapter route:
owned ceiling field/building adapter using the plenum element-lab
formula route as the hidden direct-transmission anchor, then applying
explicit room normalization, reverberation/standardization, and
flanking/junction context. The owner must not copy `Rw 48` into `R'w`,
`Dn,w`, or `DnT,w`.

Required physical context:

- `airborneContext.ceilingPlenum.*` complete from the landed lab owner;
- `airborneContext.contextMode=field_between_rooms` or
  `building_prediction`;
- `airborneContext.panelWidthHeight` or equivalent element area;
- `airborneContext.receivingRoomVolumeM3`;
- `airborneContext.receivingRoomRt60S`;
- for building prediction: `airborneContext.sourceRoomVolumeM3`,
  `airborneContext.flankingJunctionClass`,
  `airborneContext.conservativeFlankingAssumption`, and
  `airborneContext.junctionCouplingLengthM`.

`needs_input` behavior:
missing room, area, reverberation, source-room, or flanking/junction
context must return precise `needs_input` and no field/building value
pins.

Unsupported boundaries that must remain blocked:

- lab `Rw` / `STC` / `C` / `Ctr` aliasing into field/building outputs;
- floor impact `Ln,w`, `DeltaLw`, `IIC`, and `AIIC`;
- opening/facade `OITC`;
- ASTM aliases;
- source-row proximity substitution;
- confidence fallback;
- route promotion by layer name alone.

Expected next-owner counters:
`newCalculableRequestShapes: 2`,
`newCalculableTargetOutputs: 6`,
`requiredPhysicalInputsCaptured: 4`,
`runtimeBasisPromotions: 2`,
`runtimeValuesMoved 11`,
`runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`,
`frontendImplementationFilesTouched: 0`, and
`unsupportedBoundariesProtected: 6`.

Selecting rerank counters:
`candidateCount: 7`, `roiAnalysisIterations: 4`,
`estimatedNextCalculableRequestShapes: 2`,
`estimatedNextCalculableTargetOutputs: 6`,
`estimatedNextRequiredPhysicalInputsCaptured: 4`,
`estimatedNextRuntimeBasisPromotions: 2`,
`estimatedNextRuntimeValuesMoved: 11`,
`estimatedNextUnsupportedBoundariesProtected: 6`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.

## Implementation Steps

1. Add the owner contract at
   `packages/engine/src/post-v1-ceiling-multileaf-airborne-plenum-field-building-adapter-owner-contract.test.ts`.
2. Reuse the complete explicit plenum fixture from the element-lab owner
   and add complete field and building contexts.
3. Route `field_between_rooms` requests through the owned plenum lab
   formula anchor plus explicit receiving-room normalization and
   conservative field flanking overlay.
4. Route `building_prediction` requests through the owned plenum lab
   formula anchor plus explicit room standardization and flanking
   context.
5. Keep missing field/building context on precise `needs_input`.
6. Keep impact, `IIC`/`AIIC`, `OITC`, ASTM aliases, source-row
   proximity, and confidence fallback outside this owner.
7. Wire the owner into the current gate only after the focused owner
   contract passes and active docs are synchronized.

## Acceptance Criteria

- Complete explicit ceiling plenum field requests publish `R'w`,
  `Dn,w`, `Dn,A`, `DnT,w`, and `DnT,A` on route `ceiling`.
- Complete explicit ceiling plenum building requests publish `R'w`,
  `Dn,w`, `Dn,A`, `DnT,w`, `DnT,A`, and `DnT,A,k` on route `ceiling`.
- The owner uses the plenum element-lab formula output as a route-owned
  anchor and applies field/building context; it does not copy lab values
  directly.
- Missing room/flanking context returns `needs_input` without values.
- Impact, `IIC`/`AIIC`, `OITC`, ASTM aliases, source proximity, and
  confidence fallback remain blocked.
