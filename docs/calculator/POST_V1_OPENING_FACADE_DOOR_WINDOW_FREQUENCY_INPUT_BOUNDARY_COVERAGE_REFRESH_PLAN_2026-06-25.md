# Post-V1 Opening/Facade Door/Window Frequency-Input Boundary Coverage Refresh Plan - 2026-06-25

Status:
`post_v1_opening_facade_door_window_frequency_input_boundary_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank_after_opening_facade_door_window_frequency_input_boundary_coverage_refresh`

Coverage refresh action:
`post_v1_opening_facade_door_window_frequency_input_boundary_coverage_refresh_plan`

Selected by:
`post_v1_opening_facade_door_window_frequency_input_boundary_owner_plan`

Selected owner file:
`packages/engine/src/post-v1-opening-facade-door-window-frequency-input-boundary-owner-contract.test.ts`

Selected owner status:
`post_v1_opening_facade_door_window_frequency_input_boundary_owner_landed_input_boundary_selected_coverage_refresh`

Selected candidate:
`opening.facade_door_window_frequency_input_boundary_owner`

Selected coverage refresh file:
`packages/engine/src/post-v1-opening-facade-door-window-frequency-input-boundary-coverage-refresh-contract.test.ts`

Selected coverage refresh label:
`post-V1 opening/facade door/window frequency-input boundary coverage refresh`

Selected next action:
`post_v1_runtime_first_route_family_rerank_after_opening_facade_door_window_frequency_input_boundary_coverage_refresh_plan`

Selected next file:
`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-opening-facade-door-window-frequency-input-boundary-coverage-refresh-contract.test.ts`

Selected next plan:
`docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_OPENING_FACADE_DOOR_WINDOW_FREQUENCY_INPUT_BOUNDARY_COVERAGE_REFRESH_PLAN_2026-06-25.md`

Selected next label:
`post-V1 runtime-first route-family rerank after opening/facade door/window frequency-input boundary coverage refresh`

## Purpose

This is the no-runtime coverage refresh selected after the
opening/facade door/window frequency-input boundary owner. It must
re-probe the landed owner without moving values, importing source rows,
retuning formulas, or widening the existing Gate S/Gate AH element-lab
opening/leak runtime.

The refresh should prove that legacy generic opening/leak `Rw` / `STC`
requests remain live, explicit door/window/facade boundary requests
return precise `needs_input` when required fields are missing, and
field/building or outdoor-indoor facade outputs remain unsupported until
their adapters are physically owned.

The landed refresh also re-probes `openingFrequencyBandsOrRatingBasis`
as a single missing physical input, so the boundary does not collapse a
door/window/facade claim into a generic scalar opening route when area,
element type, seal class, and room/facade context are present but the
frequency or rating basis is absent. This is not a broad source crawl,
manufacturer rating copy, OITC adapter, or field/building facade
prediction runtime.

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

## Non-Goals

- No broad source crawl.
- No manufacturer rating copy.
- No product catalog import.
- No frontend polish.
- No field/building facade prediction runtime.
- No OITC adapter runtime.
- No formula retune.
- No runtime value movement.
