# Post-V1 Opening/Facade Outdoor-Indoor OITC Metric Schema And Adapter Bridge Coverage Refresh Plan - 2026-06-26

Status:
`post_v1_opening_facade_outdoor_indoor_oitc_metric_schema_and_adapter_bridge_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank_after_opening_facade_outdoor_indoor_oitc_metric_schema_and_adapter_bridge_coverage_refresh`

Coverage refresh action:
`post_v1_opening_facade_outdoor_indoor_oitc_metric_schema_and_adapter_bridge_coverage_refresh_plan`

Previous owner:
`post_v1_opening_facade_outdoor_indoor_oitc_metric_schema_and_adapter_bridge_owner_plan`

Previous owner file:
`packages/engine/src/post-v1-opening-facade-outdoor-indoor-oitc-metric-schema-and-adapter-bridge-owner-contract.test.ts`

Previous owner status:
`post_v1_opening_facade_outdoor_indoor_oitc_metric_schema_and_adapter_bridge_owner_landed_input_surface_selected_coverage_refresh`

Coverage refresh file:
`packages/engine/src/post-v1-opening-facade-outdoor-indoor-oitc-metric-schema-and-adapter-bridge-coverage-refresh-contract.test.ts`

Selected next action:
`post_v1_runtime_first_route_family_rerank_after_opening_facade_outdoor_indoor_oitc_metric_schema_and_adapter_bridge_coverage_refresh_plan`

Selected next file:
`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-opening-facade-outdoor-indoor-oitc-metric-schema-and-adapter-bridge-coverage-refresh-contract.test.ts`

Selected next plan:
`docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_OPENING_FACADE_OUTDOOR_INDOOR_OITC_METRIC_SCHEMA_AND_ADAPTER_BRIDGE_COVERAGE_REFRESH_PLAN_2026-06-26.md`

Selected next label:
`post-V1 runtime-first route-family rerank after opening/facade outdoor-indoor OITC metric schema and adapter bridge coverage refresh`

## Purpose

Re-probe that `OITC` remains a valid requested output while complete
outdoor-indoor facade requests stay `unsupported` until an owned
spectral OITC rating adapter exists. This refresh should move no
runtime values.

Coverage refresh counters:
`coverageRefreshContractFilesTouched: 1`,
`newCalculableLayerTemplates: 0`, `newCalculableRequestShapes: 0`,
`newCalculableTargetOutputs: 0`, `newRequestedTargetOutputs: 1`,
`requiredPhysicalInputsCaptured: 0`, `runtimeBasisPromotions: 0`,
`runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`.

Support-loop note:
This is the selected next refresh after an input-surface owner. The
following rerank must either select the outdoor-indoor spectral OITC
runtime adapter if formula ownership is ready, or move to the next
highest ROI runtime family such as floor-impact user-material depth.

Landed result:
The refresh keeps `OITC` requestable and keeps complete outdoor-indoor
facade requests `unsupported` rather than copying `STC`, `Rw`,
`NISR`/`ISR`, indoor partition field metrics, or source report values.
Missing facade/opening physical context remains `needs_input`. It moves
no runtime values and selects the runtime-first rerank above.

This is not a broad source crawl, formula retune, or frontend slice.
