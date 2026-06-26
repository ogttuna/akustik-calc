# Post-V1 Opening/Facade Door/Window Indoor Field/Building Adapter Coverage Refresh Plan - 2026-06-25

Status:
`post_v1_opening_facade_door_window_indoor_field_building_adapter_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank_after_opening_facade_door_window_indoor_field_building_adapter_coverage_refresh`

Coverage refresh action:
`post_v1_opening_facade_door_window_indoor_field_building_adapter_coverage_refresh_plan`

Selected by:
`post_v1_opening_facade_door_window_indoor_field_building_adapter_owner_plan`

Selected owner file:
`packages/engine/src/post-v1-opening-facade-door-window-indoor-field-building-adapter-owner-contract.test.ts`

Selected owner status:
`post_v1_opening_facade_door_window_indoor_field_building_adapter_owner_landed_runtime_selected_coverage_refresh`

Selected candidate:
`opening.facade_door_window_indoor_field_building_adapter_owner`

Selected coverage refresh file:
`packages/engine/src/post-v1-opening-facade-door-window-indoor-field-building-adapter-coverage-refresh-contract.test.ts`

Selected coverage refresh label:
`post-V1 opening/facade door/window indoor field/building adapter coverage refresh`

Current selected next action:
`post_v1_runtime_first_route_family_rerank_after_opening_facade_door_window_indoor_field_building_adapter_coverage_refresh_plan`

Current selected next file:
`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-opening-facade-door-window-indoor-field-building-adapter-coverage-refresh-contract.test.ts`

Current selected next plan:
`docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_OPENING_FACADE_DOOR_WINDOW_INDOOR_FIELD_BUILDING_ADAPTER_COVERAGE_REFRESH_PLAN_2026-06-25.md`

Current selected next label:
`post-V1 runtime-first route-family rerank after opening/facade door/window indoor field/building adapter coverage refresh`

Selected owner counters:
`newCalculableRequestShapes: 4`, `newCalculableTargetOutputs: 6`,
`runtimeBasisPromotions: 4`, `runtimeValuesMoved 22`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`.

## Purpose

This is the no-runtime coverage refresh selected after the opening /
facade door/window indoor field/building adapter owner. It should
re-probe the landed runtime behavior without moving additional values,
importing source rows, retuning formulas, widening outdoor facade/OITC,
or adding impact aliases.

The refresh should prove that complete indoor partition door/window /
facade `field_between_rooms` requests keep `R'w 36.4`, `Dn,w 36.7`,
`Dn,A 35.9`, `DnT,w 36.9`, and `DnT,A 36.1`, while field
`DnT,A,k` remains unsupported. Complete indoor partition
`building_prediction` requests should keep `R'w 31.6`, `Dn,w 31.9`,
`Dn,A 31.1`, `DnT,w 32.1`, `DnT,A 31.3`, and `DnT,A,k 30.4`.
Mixed requests should keep lab companions `Rw 38.2` and `STC 39`.
Missing frequency input, outdoor-indoor/OITC facade, and impact aliases
remain blocked.

## Expected Counters

- `coverageRefreshContractFilesTouched: 1`
- `newCalculableLayerTemplates: 0`
- `newCalculableRequestShapes: 0`
- `newCalculableTargetOutputs: 0`
- `requiredPhysicalInputsCaptured: 0`
- `runtimeBasisPromotions: 0`
- `runtimeValuesMoved 0`
- `runtimeFormulaRetunes: 0`
- `sourceRowsImported: 0`
- `frontendImplementationFilesTouched: 0`

## Landed Result

This no-runtime refresh re-probes the landed indoor field/building
adapter owner and selects the fresh runtime-first route-family rerank
named above. It keeps complete indoor partition field outputs
`R'w 36.4`, `Dn,w 36.7`, `Dn,A 35.9`, `DnT,w 36.9`, and
`DnT,A 36.1`, keeps field `DnT,A,k` unsupported, keeps complete
building outputs `R'w 31.6`, `Dn,w 31.9`, `Dn,A 31.1`,
`DnT,w 32.1`, `DnT,A 31.3`, and `DnT,A,k 30.4`, and keeps mixed
lab companions `Rw 38.2` and `STC 39` basis-separated.
Missing frequency input, outdoor-indoor/OITC facade, and impact aliases
remain blocked. Counters: `coverageRefreshContractFilesTouched: 1`,
`newCalculableRequestShapes: 0`, `newCalculableTargetOutputs: 0`,
`runtimeBasisPromotions: 0`, `runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`. This is not a broad source
crawl. In short: not a broad source crawl.

## Non-Goals

- No broad source crawl.
- No product catalog import.
- No formula retune.
- No runtime value movement.
- No outdoor-indoor/OITC adapter.
- No impact metric owner.
- No frontend slice.
