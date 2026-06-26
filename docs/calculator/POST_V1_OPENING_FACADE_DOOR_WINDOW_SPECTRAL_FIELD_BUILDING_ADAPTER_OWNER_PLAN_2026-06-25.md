# Post-V1 Opening/Facade Door/Window Spectral Field/Building Adapter Owner Plan - 2026-06-25

Status:
`post_v1_opening_facade_door_window_spectral_field_building_adapter_owner_landed_runtime_selected_coverage_refresh`

Owner action:
`post_v1_opening_facade_door_window_spectral_field_building_adapter_owner_plan`

Owner file:
`packages/engine/src/post-v1-opening-facade-door-window-spectral-field-building-adapter-owner-contract.test.ts`

Previous rerank:
`post_v1_runtime_first_route_family_rerank_after_opening_facade_door_window_spectral_opening_curve_runtime_coverage_refresh_plan`
/
`post_v1_runtime_first_route_family_rerank_after_opening_facade_door_window_spectral_opening_curve_runtime_coverage_refresh_landed_no_runtime_selected_opening_facade_door_window_spectral_field_building_adapter_owner`

Previous coverage refresh:
`post_v1_opening_facade_door_window_spectral_opening_curve_runtime_coverage_refresh_plan`

Previous rerank counters:
`estimatedNextCalculableRequestShapes: 2`,
`estimatedNextCalculableTargetOutputs: 6`,
`estimatedNextRuntimeBasisPromotions: 2`,
`estimatedNextRuntimeValuesMoved: 11`, `runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`, and no support-only loop.

Selected candidate:
`opening.facade_door_window_spectral_field_building_adapter_owner`

Runtime label:
`spectral field/building adapter`

Selected next action:
`post_v1_opening_facade_door_window_spectral_field_building_adapter_coverage_refresh_plan`

Selected next file:
`packages/engine/src/post-v1-opening-facade-door-window-spectral-field-building-adapter-coverage-refresh-contract.test.ts`

Selected next plan:
`docs/calculator/POST_V1_OPENING_FACADE_DOOR_WINDOW_SPECTRAL_FIELD_BUILDING_ADAPTER_COVERAGE_REFRESH_PLAN_2026-06-25.md`

## Selection Card

- User construction / formula family: indoor partition host wall with
  door/window/facade opening elements described by explicit
  `openingElementTransmissionLossCurve`.
- Target outputs opened: field `R'w`, `Dn,w`, `Dn,A`, `DnT,w`,
  `DnT,A`; building `R'w`, `Dn,w`, `Dn,A`, `DnT,w`, `DnT,A`, and
  `DnT,A,k` where building characteristic context is present.
- Route: Gate S area-energy spectral composite transmission-loss curve
  produces the lab anchor, then the owned opening/leak ISO 12354-1
  field/building adapter applies explicit flanking, junction, area, and
  room-normalization terms.
- Required physical inputs: `hostWallTransmissionLossCurve`,
  `openingElementTransmissionLossCurve`, `hostWallAreaM2`,
  `openingLeakElements`, `panelWidthMm`, `panelHeightMm`,
  `receivingRoomVolumeM3`, `receivingRoomRt60S`, `frequencyBandSet`, and
  for building prediction `sourceRoomVolumeM3`, `flankingJunctionClass`,
  `conservativeFlankingAssumption`, `junctionCouplingLengthM`, and
  `buildingPredictionOutputBasis`.
- `needs_input` behavior: missing building/flanking context remains a
  runtime `needs_input`; the frequency-input boundary no longer
  re-labels that case as unsupported when the spectral adapter owns the
  route.
- `unsupported` boundaries: outdoor-indoor/OITC, impact aliases,
  scalar STC-to-Rw shortcuts, source-row import, and direct lab-curve
  copying remain blocked.

## Result

Complete curve-only indoor partition field requests now calculate
`R'w 44.2`, `Dn,w 44.5`, `Dn,A 43.7`, `DnT,w 44.7`, and
`DnT,A 43.9`; `DnT,A,k` remains outside field context. Complete
building requests now calculate `R'w 39.4`, `Dn,w 39.7`, `Dn,A 38.9`,
`DnT,w 39.9`, `DnT,A 39.1`, and `DnT,A,k 38.2`. The route basis is
`post_v1_opening_facade_door_window_spectral_field_building_adapter_owner`
with `curveBasis: calculated_frequency_curve`; it does not copy lab
`Rw/STC/C/Ctr` into field/building outputs.

Counters:
`newCalculableLayerTemplates: 0`, `newCalculableRequestShapes: 2`,
`newCalculableTargetOutputs: 6`, `requiredPhysicalInputsCaptured: 0`,
`runtimeBasisPromotions: 2`, `runtimeValuesMoved 11`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`,
`frontendImplementationFilesTouched: 0`, and
`unsupportedBoundariesProtected: 5`.

This is not a broad source crawl, catalog import, formula retune, or
frontend slice.
