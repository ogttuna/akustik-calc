# Post-V1 Opening/Facade Door/Window Indoor Field/Building Adapter Owner Plan - 2026-06-25

Status:
`post_v1_opening_facade_door_window_indoor_field_building_adapter_owner_landed_runtime_selected_coverage_refresh`

Owner action:
`post_v1_opening_facade_door_window_indoor_field_building_adapter_owner_plan`

Selected by:
`post_v1_runtime_first_route_family_rerank_after_opening_facade_door_window_building_lab_companion_target_output_independence_coverage_refresh_plan`

Selected rerank status:
`post_v1_runtime_first_route_family_rerank_after_opening_facade_door_window_building_lab_companion_target_output_independence_coverage_refresh_landed_no_runtime_selected_opening_facade_door_window_indoor_field_building_adapter_owner`

Selected rerank estimated counter:
`estimatedNextRuntimeValuesMoved: 22`; no support-only loop.

Selected owner file:
`packages/engine/src/post-v1-opening-facade-door-window-indoor-field-building-adapter-owner-contract.test.ts`

Selected candidate:
`opening.facade_door_window_indoor_field_building_adapter_owner`

Selected owner label:
`post-V1 opening/facade door/window indoor field/building adapter owner`

Selected next action:
`post_v1_opening_facade_door_window_indoor_field_building_adapter_coverage_refresh_plan`

Selected next file:
`packages/engine/src/post-v1-opening-facade-door-window-indoor-field-building-adapter-coverage-refresh-contract.test.ts`

Selected next plan:
`docs/calculator/POST_V1_OPENING_FACADE_DOOR_WINDOW_INDOOR_FIELD_BUILDING_ADAPTER_COVERAGE_REFRESH_PLAN_2026-06-25.md`

Selected next label:
`post-V1 opening/facade door/window indoor field/building adapter coverage refresh`

Selected coverage refresh now landed:
`post_v1_opening_facade_door_window_indoor_field_building_adapter_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank_after_opening_facade_door_window_indoor_field_building_adapter_coverage_refresh`.
Coverage refresh file:
`packages/engine/src/post-v1-opening-facade-door-window-indoor-field-building-adapter-coverage-refresh-contract.test.ts`.
The refresh keeps indoor field/building values and mixed lab companions
pinned without moving runtime values. Counters:
`coverageRefreshContractFilesTouched: 1`,
`newCalculableRequestShapes: 0`, `newCalculableTargetOutputs: 0`,
`runtimeBasisPromotions: 0`, `runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`. This is not a broad source
crawl. Selected next after the refresh:
`post_v1_runtime_first_route_family_rerank_after_opening_facade_door_window_indoor_field_building_adapter_coverage_refresh_plan`
/
`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-opening-facade-door-window-indoor-field-building-adapter-coverage-refresh-contract.test.ts`.

## Selection Card

User construction / formula family:
complete indoor partition door/window/facade opening in a host wall,
with explicit host wall area, opening area, element `Rw`, opening type,
frequency/rating basis, seal/leakage class, panel size, receiving-room
volume, reverberation time, and, for building prediction, source-room
volume plus junction/flanking context.

Target outputs opened:

- `field_between_rooms`: `R'w`, `Dn,w`, `Dn,A`, `DnT,w`, `DnT,A`;
- `building_prediction`: `R'w`, `Dn,w`, `Dn,A`, `DnT,w`, `DnT,A`,
  and companion `DnT,A,k` when the owned building `DnT,A` value exists;
- mixed requests keep existing lab companions `Rw 38.2` and `STC 39`
  independent from field/building values.

Route:
the owner lifts the door/window/facade boundary suppression only for
complete `facadeOutdoorContext: indoor_partition` field/building
contexts and then uses the existing
`company_internal_opening_leak_field_area_energy_runtime_corridor`,
`company_internal_opening_leak_building_area_energy_runtime_corridor`,
and `company_internal_opening_leak_a_weighted_spectrum_adapter_runtime_corridor`
paths. This is an owned formula/runtime route, not a source-row import
and not a lab-to-field copy.

Required physical inputs:
`hostWallAreaM2`, `openingLeakElements`, opening area, element type,
frequency band set or rating basis, seal/leakage class,
`facadeOutdoorContext`, `panelWidthMm`, `panelHeightMm`,
`receivingRoomVolumeM3`, `receivingRoomRt60S`, and for building
prediction `sourceRoomVolumeM3`, `flankingJunctionClass`,
`conservativeFlankingAssumption`, `junctionCouplingLengthM`, and
`buildingPredictionOutputBasis`.

`needs_input` behavior:
missing opening frequency/rating basis remains
`openingFrequencyBandsOrRatingBasis` `needs_input`. The owner does not
bypass the existing input boundary.

`unsupported` boundaries:
outdoor-indoor/OITC facade prediction, broad facade prediction, scalar
STC opening ratings, impact aliases, source-row imports, formula
retunes, and missing-frequency claims remain blocked.

Expected counters:
`newCalculableLayerTemplates: 0`, `newCalculableRequestShapes: 4`,
`newCalculableTargetOutputs: 6`, `requiredPhysicalInputsCaptured: 0`,
`runtimeBasisPromotions: 4`, `runtimeValuesMoved 22`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`,
`frontendImplementationFilesTouched: 0`, and
`unsupportedBoundariesProtected: 6`.

## Landed Runtime Behavior

Complete indoor `field_between_rooms` requests now calculate
`R'w 36.4`, `Dn,w 36.7`, `Dn,A 35.9`, `DnT,w 36.9`, and
`DnT,A 36.1` through the opening/leak field runtime. `DnT,A,k` remains
unsupported in field mode.

Complete indoor `building_prediction` requests now calculate
`R'w 31.6`, `Dn,w 31.9`, `Dn,A 31.1`, `DnT,w 32.1`,
`DnT,A 31.3`, and `DnT,A,k 30.4` through the opening/leak building
runtime plus the owned characteristic adapter. Mixed requests keep
`Rw 38.2` and `STC 39` as lab companions while the field/building
values stay on the field/building basis.

This is not a broad source crawl, product catalog import, formula
retune, frontend slice, outdoor-indoor facade/OITC adapter, or impact
metric owner.
