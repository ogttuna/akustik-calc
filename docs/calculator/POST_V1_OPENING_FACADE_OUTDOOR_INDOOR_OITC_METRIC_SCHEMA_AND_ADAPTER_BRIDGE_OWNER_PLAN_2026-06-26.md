# Post-V1 Opening/Facade Outdoor-Indoor OITC Metric Schema And Adapter Bridge Owner Plan - 2026-06-26

Status:
`post_v1_opening_facade_outdoor_indoor_oitc_metric_schema_and_adapter_bridge_owner_landed_input_surface_selected_coverage_refresh`

Owner action:
`post_v1_opening_facade_outdoor_indoor_oitc_metric_schema_and_adapter_bridge_owner_plan`

Selected by:
`post_v1_runtime_first_route_family_rerank_after_opening_facade_door_window_spectral_field_building_adapter_coverage_refresh_plan`

Previous coverage refresh:
`post_v1_opening_facade_door_window_spectral_field_building_adapter_coverage_refresh_plan`

Previous rerank status:
`post_v1_runtime_first_route_family_rerank_after_opening_facade_door_window_spectral_field_building_adapter_coverage_refresh_landed_no_runtime_selected_opening_facade_outdoor_indoor_oitc_metric_schema_and_adapter_bridge_owner`

Selected candidate:
`opening.facade_outdoor_indoor_oitc_metric_schema_and_adapter_bridge_owner`

Owner file:
`packages/engine/src/post-v1-opening-facade-outdoor-indoor-oitc-metric-schema-and-adapter-bridge-owner-contract.test.ts`

Selected next action:
`post_v1_opening_facade_outdoor_indoor_oitc_metric_schema_and_adapter_bridge_coverage_refresh_plan`

Selected next file:
`packages/engine/src/post-v1-opening-facade-outdoor-indoor-oitc-metric-schema-and-adapter-bridge-coverage-refresh-contract.test.ts`

Selected next plan:
`docs/calculator/POST_V1_OPENING_FACADE_OUTDOOR_INDOOR_OITC_METRIC_SCHEMA_AND_ADAPTER_BRIDGE_COVERAGE_REFRESH_PLAN_2026-06-26.md`

Selected next label:
`post-V1 opening/facade outdoor-indoor OITC metric schema and adapter bridge coverage refresh`

Landed follow-up coverage refresh:
`post_v1_opening_facade_outdoor_indoor_oitc_metric_schema_and_adapter_bridge_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank_after_opening_facade_outdoor_indoor_oitc_metric_schema_and_adapter_bridge_coverage_refresh`

Coverage refresh selected next action:
`post_v1_runtime_first_route_family_rerank_after_opening_facade_outdoor_indoor_oitc_metric_schema_and_adapter_bridge_coverage_refresh_plan`

Coverage refresh selected next file:
`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-opening-facade-outdoor-indoor-oitc-metric-schema-and-adapter-bridge-coverage-refresh-contract.test.ts`

Coverage refresh selected next plan:
`docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_OPENING_FACADE_OUTDOOR_INDOOR_OITC_METRIC_SCHEMA_AND_ADAPTER_BRIDGE_COVERAGE_REFRESH_PLAN_2026-06-26.md`

Coverage refresh counters:
`coverageRefreshContractFilesTouched: 1`, `newRequestedTargetOutputs: 1`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.

## Selection Card

- User construction / formula family: outdoor-indoor facade opening or
  window with explicit `openingElementTransmissionLossCurve`,
  `facadeOutdoorContext: outdoor_indoor_facade`, host wall area,
  opening area/count, element type, seal class, room geometry, and
  flanking/building context.
- Target outputs to open: `OITC` as a first-class requested output
  surface. This owner does not calculate an OITC number.
- Route: shared requested-output schema plus opening/facade
  frequency-input boundary. The boundary carries OITC to explicit
  `unsupported` or `needs_input` until a later outdoor-indoor spectral
  rating adapter owns the calculation.
- Required physical inputs: existing facade/opening boundary inputs:
  `hostWallAreaM2`, `openingAreaM2`, `openingElementType`,
  `openingFrequencyBandsOrRatingBasis`, `openingSealLeakageClass`, and
  `facadeOutdoorOrRoomNormalizationContext`.
- `needs_input`: missing facade/opening fields return `needs_input`
  with the exact missing physical inputs and keep `OITC` unsupported.
- `unsupported`: complete OITC requests remain unsupported until an
  owned outdoor-indoor spectral rating adapter is implemented. `STC`,
  `Rw`, `NISR`, `ISR`, indoor `DnT,w`, and source report OITC rows are
  not aliases.
- Expected counters: `newRequestedTargetOutputs: 1`,
  `newCalculableRequestShapes: 0`, `newCalculableTargetOutputs: 0`,
  `runtimeBasisPromotions: 0`, `runtimeValuesMoved 0`,
  `requiredPhysicalInputsCaptured: 0`,
  `estimatedNextTargetOutputSurfacePromotions: 1`,
  `runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`,
  `frontendImplementationFilesTouched: 0`, and
  `unsupportedBoundariesProtected: 6`.

## Purpose

This owner opens a missing calculator target-output surface without
pretending the OITC formula is already owned. The previous spectral
field/building owner made curve-only indoor partition opening requests
calculable. The remaining opening/facade blocker is outdoor-indoor
facade/OITC: without a real `OITC` requested output, a later runtime
adapter cannot be represented safely and developers are tempted to
reuse `STC`, `Rw`, `NISR`/`ISR`, or indoor `DnT,w` values.

## Acceptance Criteria

- `OITC` is accepted by the shared requested-output schema.
- Complete outdoor-indoor facade OITC requests return `unsupported`,
  not a fabricated value.
- Missing facade/opening physical inputs return `needs_input`.
- Indoor partition OITC remains unsupported.
- Mixed `Rw`/`STC`/`OITC` outdoor facade requests do not copy lab
  companions into OITC.
- No source rows are imported.
- Post-gate web compile compatibility maps `OITC` labels/support text
  and value readers to the same explicit `null` / unsupported surface;
  it does not open a calculated frontend value.

This is not an OITC runtime formula, broad source crawl, calibration
slice, or frontend slice.
It has no support-only loop: the selected owner moves input-surface
calculator behavior required before any safe OITC runtime can land.
