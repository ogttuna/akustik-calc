# Post-V1 Opening/Facade Door/Window Spectral Field/Building Adapter Coverage Refresh Plan - 2026-06-25

Status:
`post_v1_opening_facade_door_window_spectral_field_building_adapter_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank_after_opening_facade_door_window_spectral_field_building_adapter_coverage_refresh`

Coverage refresh action:
`post_v1_opening_facade_door_window_spectral_field_building_adapter_coverage_refresh_plan`

Previous owner:
`post_v1_opening_facade_door_window_spectral_field_building_adapter_owner_plan`

Previous owner file:
`packages/engine/src/post-v1-opening-facade-door-window-spectral-field-building-adapter-owner-contract.test.ts`

Previous owner status:
`post_v1_opening_facade_door_window_spectral_field_building_adapter_owner_landed_runtime_selected_coverage_refresh`

Selected candidate to re-probe:
`opening.facade_door_window_spectral_field_building_adapter_owner`

Coverage refresh file:
`packages/engine/src/post-v1-opening-facade-door-window-spectral-field-building-adapter-coverage-refresh-contract.test.ts`

Selected next action:
`post_v1_runtime_first_route_family_rerank_after_opening_facade_door_window_spectral_field_building_adapter_coverage_refresh_plan`

Selected next file:
`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-opening-facade-door-window-spectral-field-building-adapter-coverage-refresh-contract.test.ts`

Selected next plan:
`docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_OPENING_FACADE_DOOR_WINDOW_SPECTRAL_FIELD_BUILDING_ADAPTER_COVERAGE_REFRESH_PLAN_2026-06-26.md`

Selected next label:
`post-V1 runtime-first route-family rerank after opening/facade door/window spectral field/building adapter coverage refresh`

## Purpose

Re-probe the landed spectral field/building adapter without moving
runtime behavior. The refresh should verify that complete curve-only
indoor partition field/building requests remain calculable, missing
building context remains `needs_input`, and outdoor-indoor/OITC plus
impact aliases remain blocked.

## Protected Baseline

- Field context keeps `R'w 44.2`, `Dn,w 44.5`, `Dn,A 43.7`,
  `DnT,w 44.7`, and `DnT,A 43.9`; `DnT,A,k` is not a field output.
- Building context keeps `R'w 39.4`, `Dn,w 39.7`, `Dn,A 38.9`,
  `DnT,w 39.9`, `DnT,A 39.1`, and `DnT,A,k 38.2`.
- The basis method remains
  `post_v1_opening_facade_door_window_spectral_field_building_adapter_owner`.
- Missing building inputs such as `sourceRoomVolumeM3` remain
  `needs_input`.
- Outdoor-indoor/OITC, impact aliases, scalar STC-to-Rw shortcuts, and
  direct lab curve copying remain unsupported.

Previous owner counters:
`newCalculableLayerTemplates: 0`, `newCalculableRequestShapes: 2`,
`newCalculableTargetOutputs: 6`, `requiredPhysicalInputsCaptured: 0`,
`runtimeBasisPromotions: 2`, `runtimeValuesMoved 11`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`,
`frontendImplementationFilesTouched: 0`, and
`unsupportedBoundariesProtected: 5`.

Coverage refresh counters:
`coverageRefreshContractFilesTouched: 1`,
`newCalculableLayerTemplates: 0`, `newCalculableRequestShapes: 0`,
`newCalculableTargetOutputs: 0`, `requiredPhysicalInputsCaptured: 0`,
`runtimeBasisPromotions: 0`, `runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`.

Support-loop note:
This refresh intentionally moves no runtime values. Its only purpose is
to pin the just-landed spectral field/building adapter before the
selected runtime-first rerank picks the next calculator-scope owner.

## Non-Goals

- No broad source crawl.
- No formula retune.
- No frontend slice.
- No source-row import.

This is not a broad source crawl.
