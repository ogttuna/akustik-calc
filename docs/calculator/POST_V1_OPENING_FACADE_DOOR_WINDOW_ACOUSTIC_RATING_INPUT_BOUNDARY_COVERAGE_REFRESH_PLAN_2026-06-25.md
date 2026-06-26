# Post-V1 Opening/Facade Door/Window Acoustic-Rating Input Boundary Coverage Refresh Plan - 2026-06-25

Status:
`post_v1_opening_facade_door_window_acoustic_rating_input_boundary_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank_after_opening_facade_door_window_acoustic_rating_input_boundary_coverage_refresh`

Coverage refresh action:
`post_v1_opening_facade_door_window_acoustic_rating_input_boundary_coverage_refresh_plan`

Selected by:
`post_v1_opening_facade_door_window_acoustic_rating_input_boundary_owner_plan`

Previous rerank action:
`post_v1_runtime_first_route_family_rerank_after_opening_facade_door_window_c_ctr_lab_companion_target_output_independence_coverage_refresh_plan`

Previous rerank file:
`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-opening-facade-door-window-c-ctr-lab-companion-target-output-independence-coverage-refresh-contract.test.ts`

Previous rerank status:
`post_v1_runtime_first_route_family_rerank_after_opening_facade_door_window_c_ctr_lab_companion_target_output_independence_coverage_refresh_landed_no_runtime_selected_opening_facade_door_window_acoustic_rating_input_boundary_owner`

Selected owner file:
`packages/engine/src/post-v1-opening-facade-door-window-acoustic-rating-input-boundary-owner-contract.test.ts`

Selected owner status:
`post_v1_opening_facade_door_window_acoustic_rating_input_boundary_owner_landed_input_boundary_selected_coverage_refresh`

Selected candidate:
`opening.facade_door_window_acoustic_rating_input_boundary_owner`

Selected coverage refresh file:
`packages/engine/src/post-v1-opening-facade-door-window-acoustic-rating-input-boundary-coverage-refresh-contract.test.ts`

Selected coverage refresh label:
`post-V1 opening/facade door/window acoustic-rating input boundary coverage refresh`

Selected next action:
`post_v1_runtime_first_route_family_rerank_after_opening_facade_door_window_acoustic_rating_input_boundary_coverage_refresh_plan`

Selected next file:
`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-opening-facade-door-window-acoustic-rating-input-boundary-coverage-refresh-contract.test.ts`

Selected next plan:
`docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_OPENING_FACADE_DOOR_WINDOW_ACOUSTIC_RATING_INPUT_BOUNDARY_COVERAGE_REFRESH_PLAN_2026-06-25.md`

Selected next label:
`post-V1 runtime-first route-family rerank after opening/facade door/window acoustic-rating input boundary coverage refresh`

Selected owner counters:
`newCalculableRequestShapes: 0`, `newCalculableTargetOutputs: 0`,
`newNeedsInputRequestShapes: 3`, `requiredPhysicalInputsCaptured: 1`,
`runtimeBasisPromotions: 0`, `runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`.

## Purpose

This is the no-runtime coverage refresh selected after the
opening/facade door/window acoustic-rating input boundary owner. It
should re-probe the landed input behavior without moving runtime
values, importing source rows, retuning formulas, widening
outdoor-indoor/OITC support, adding scalar STC aliases, or adding
impact aliases.

It is not a broad source crawl.

The refresh should prove that complete indoor field/building
door/window/facade requests still calculate the already-owned
`Rw`/`STC`/`C`/`Ctr` lab companions and field/building opening leakage
values, while otherwise complete requests that omit `openingElementRwDb`
return precise `needs_input` for `openingElementRwDb`. Missing
frequency/rating basis must remain owned by the earlier frequency-input
boundary, and impact aliases must remain unsupported.

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
- No product catalog import.
- No formula retune.
- No runtime value movement.
- No outdoor-indoor/OITC adapter.
- No scalar STC rating shortcut.
- No impact metric owner.
- No frontend slice.
