# Post-V1 Ceiling Single-Leaf Field/Building Context Adapter Owner - 2026-06-26

Status:
`post_v1_ceiling_single_leaf_field_building_context_adapter_owner_landed_runtime_basis_selected_coverage_refresh`

Owner action:
`post_v1_ceiling_single_leaf_field_building_context_adapter_owner_plan`

Owner label:
`post-V1 ceiling single-leaf field/building context adapter owner`

Owner file:
`packages/engine/src/post-v1-ceiling-single-leaf-field-building-context-adapter-owner-contract.test.ts`

Owner plan:
`docs/calculator/POST_V1_CEILING_SINGLE_LEAF_FIELD_BUILDING_CONTEXT_ADAPTER_OWNER_PLAN_2026-06-26.md`

Previous coverage refresh:
`post_v1_ceiling_single_leaf_airborne_route_coverage_refresh_plan`

Previous coverage refresh status:
`post_v1_ceiling_single_leaf_airborne_route_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank_after_ceiling_single_leaf_airborne_route_coverage_refresh`

Selected by:
`post_v1_runtime_first_route_family_rerank_after_ceiling_single_leaf_airborne_route_coverage_refresh_plan`
/
`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-ceiling-single-leaf-airborne-route-coverage-refresh-contract.test.ts`

Selected by status:
`post_v1_runtime_first_route_family_rerank_after_ceiling_single_leaf_airborne_route_coverage_refresh_landed_no_runtime_selected_ceiling_single_leaf_field_building_context_adapter_owner`

Selected rerank estimate:
`estimatedNextCalculableRequestShapes: 2`,
`estimatedNextCalculableTargetOutputs: 6`,
`estimatedNextRuntimeValuesMoved: 11`, and `runtimeValuesMoved 0`.

Selected candidate:
`ceiling.single_leaf_field_building_context_adapter_owner`

Runtime resolver candidates:
`ceiling.single_leaf_airborne_field_context_adapter` and
`ceiling.single_leaf_airborne_building_prediction_adapter`.

Selected next action:
`post_v1_ceiling_single_leaf_field_building_context_adapter_coverage_refresh_plan`

Selected next file:
`packages/engine/src/post-v1-ceiling-single-leaf-field-building-context-adapter-coverage-refresh-contract.test.ts`

Selected next plan:
`docs/calculator/POST_V1_CEILING_SINGLE_LEAF_FIELD_BUILDING_CONTEXT_ADAPTER_COVERAGE_REFRESH_PLAN_2026-06-26.md`

Selected next label:
`post-V1 ceiling single-leaf field/building context adapter coverage refresh`

## Selection Card

- User construction / formula family: two 12.5 mm gypsum boards entered
  as a ceiling-only single-leaf stack.
- Target outputs opened: field `R'w`, `Dn,w`, `Dn,A`, `DnT,w`,
  `DnT,A`; building `R'w`, `Dn,w`, `Dn,A`, `DnT,w`, `DnT,A`,
  `DnT,A,k`.
- Route: existing ceiling single-leaf direct curve plus explicit
  field-between-rooms context, and existing ISO 12354-1 building
  prediction corridor for complete building context.
- Required physical inputs: `route=ceiling`, ceiling-only layer roles,
  panel width/height, receiving-room volume, receiving-room RT60,
  source-room volume for building prediction, flanking junction class,
  conservative flanking assumption, and junction coupling length.
- `needs_input` behavior: incomplete field/building context stays
  stopped; no context defaults are introduced.
- `unsupported` boundaries: floor impact, ASTM IIC/AIIC, OITC, and
  source-row proximity substitution remain blocked.
- Movement:
  `newCalculableRequestShapes: 2`,
  `newCalculableTargetOutputs: 6`,
  `runtimeBasisPromotions: 2`, and `runtimeValuesMoved 11`.

## Landed Behavior

Complete ceiling-only field requests now publish on `route=ceiling` via
`ceiling.single_leaf_airborne_field_context_adapter`:
`R'w 33`, `Dn,w 33`, `Dn,A 36.5`, `DnT,w 36`, and `DnT,A 38.9`.

Complete ceiling-only building requests now publish on `route=ceiling`
via `ceiling.single_leaf_airborne_building_prediction_adapter`:
`R'w 33`, `Dn,w 33`, `Dn,A 36.5`, `DnT,w 36`, `DnT,A 38.9`, and
`DnT,A,k 36`. Mixed building requests may still show lab companions
`Rw 34` and `STC 34`, but the building candidate value pins stay on the
building basis and do not relabel lab values.

Incomplete building context remains stopped, ceiling impact requests
remain floor `needs_input`, and `OITC` remains unsupported until an
owned outdoor-indoor rating adapter exists.

Counters: `newCalculableLayerTemplates: 0`,
`newCalculableRequestShapes: 2`, `newCalculableTargetOutputs: 6`,
`requiredPhysicalInputsCaptured: 3`, `runtimeBasisPromotions: 2`,
`runtimeValuesMoved 11`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, `frontendImplementationFilesTouched: 0`, and
`unsupportedBoundariesProtected: 6`.

This is not a broad source crawl, catalog import, formula retune, or
frontend slice.
