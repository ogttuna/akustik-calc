# Post-V1 Opening/Facade Door/Window Spectral Opening-Curve Runtime Coverage Refresh Plan - 2026-06-25

Status:
`post_v1_opening_facade_door_window_spectral_opening_curve_runtime_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank_after_opening_facade_door_window_spectral_opening_curve_runtime_coverage_refresh`

Coverage refresh action:
`post_v1_opening_facade_door_window_spectral_opening_curve_runtime_coverage_refresh_plan`

Selected by:
`post_v1_opening_facade_door_window_spectral_opening_curve_runtime_owner_plan`

Previous rerank action:
`post_v1_runtime_first_route_family_rerank_after_opening_facade_door_window_acoustic_rating_input_boundary_coverage_refresh_plan`

Previous owner status:
`post_v1_opening_facade_door_window_spectral_opening_curve_runtime_owner_landed_runtime_selected_coverage_refresh`

Previous owner file:
`packages/engine/src/post-v1-opening-facade-door-window-spectral-opening-curve-runtime-owner-contract.test.ts`

Selected coverage refresh file:
`packages/engine/src/post-v1-opening-facade-door-window-spectral-opening-curve-runtime-coverage-refresh-contract.test.ts`

Selected candidate:
`opening.facade_door_window_spectral_opening_curve_runtime_owner`

Selected next action:
`post_v1_runtime_first_route_family_rerank_after_opening_facade_door_window_spectral_opening_curve_runtime_coverage_refresh_plan`

Selected next file:
`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-opening-facade-door-window-spectral-opening-curve-runtime-coverage-refresh-contract.test.ts`

Selected next plan:
`docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_OPENING_FACADE_DOOR_WINDOW_SPECTRAL_OPENING_CURVE_RUNTIME_COVERAGE_REFRESH_PLAN_2026-06-25.md`

## Purpose

Re-probe the landed spectral opening-curve runtime without moving
runtime values. The refresh should keep the calculated element-lab
opening/facade values pinned at `Rw 46`, `STC 46`, `C -1.3`, and
`Ctr -5.9`, keep `openingElementTransmissionLossCurve` as the required
spectral opening input, keep scalar opening values unchanged, and keep
curve-only field/building outputs unsupported until a spectral
field/building adapter is selected. The owner being refreshed moved
`runtimeValuesMoved 12`.

The refresh must then select a fresh runtime-first rerank. It must not
be treated as product progress by itself.

## Refresh Result

The no-runtime refresh re-probes the landed spectral opening-curve
runtime across door, window, and facade element request shapes. It keeps
`openingElementTransmissionLossCurve` as the explicit spectral opening
input, keeps partial target-output requests request-scoped, and keeps
curve-only field/building requests blocked until a spectral
field/building adapter owns apparent and standardized outputs from the
calculated composite transmission-loss curve. Scalar opening values and
the missing-rating `needs_input` boundary remain unchanged.
Boundary label: `spectral field/building adapter`.

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

This is not a broad source crawl.

## Non-Goals

- No broad source crawl.
- No formula retune.
- No scalar STC-to-Rw conversion.
- No field/building promotion from the lab spectral curve.
- No outdoor-indoor/OITC adapter.
- No impact metric alias.
