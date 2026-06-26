# Post-V1 Opening/Facade Door/Window Building Lab-Companion Target-Output Independence Owner Plan - 2026-06-25

Status:
`post_v1_opening_facade_door_window_building_lab_companion_target_output_independence_owner_landed_runtime_basis_selected_coverage_refresh`

Owner action:
`post_v1_opening_facade_door_window_building_lab_companion_target_output_independence_owner_plan`

Selected by:
`post_v1_runtime_first_route_family_rerank_after_opening_facade_door_window_frequency_input_boundary_coverage_refresh_plan`

Selected rerank file:
`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-opening-facade-door-window-frequency-input-boundary-coverage-refresh-contract.test.ts`

Selected candidate:
`opening.facade_door_window_building_lab_companion_target_output_independence_owner`

Owner file:
`packages/engine/src/post-v1-opening-facade-door-window-building-lab-companion-target-output-independence-owner-contract.test.ts`

Selected next action:
`post_v1_opening_facade_door_window_building_lab_companion_target_output_independence_coverage_refresh_plan`

Selected next file:
`packages/engine/src/post-v1-opening-facade-door-window-building-lab-companion-target-output-independence-coverage-refresh-contract.test.ts`

Selected next plan:
`docs/calculator/POST_V1_OPENING_FACADE_DOOR_WINDOW_BUILDING_LAB_COMPANION_TARGET_OUTPUT_INDEPENDENCE_COVERAGE_REFRESH_PLAN_2026-06-25.md`

Selected next label:
`post-V1 opening/facade door/window building lab-companion target-output independence coverage refresh`

Selected coverage refresh landed status:
`post_v1_opening_facade_door_window_building_lab_companion_target_output_independence_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank_after_opening_facade_door_window_building_lab_companion_target_output_independence_coverage_refresh`

Selected coverage refresh selected next:
`post_v1_runtime_first_route_family_rerank_after_opening_facade_door_window_building_lab_companion_target_output_independence_coverage_refresh_plan`
/
`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-opening-facade-door-window-building-lab-companion-target-output-independence-coverage-refresh-contract.test.ts`

Selected coverage refresh counters:
`coverageRefreshContractFilesTouched: 1`, `runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`.

## Selection Card

- User construction / formula family: gypsum / air gap / rockwool /
  concrete host wall with a complete rated indoor door/window opening.
- Target outputs opened: `Rw` and `STC` as lab companions inside
  complete `field_between_rooms` and `building_prediction` requests.
- Route: cloned `element_lab` Gate S area-energy composite `Rw` route
  plus Gate AH shifted-spectrum `STC` adapter.
- Required physical inputs: the previous boundary fields,
  `hostWallAreaM2`, `openingAreaM2`, `openingElementType`,
  `openingFrequencyBandsOrRatingBasis`, `openingSealLeakageClass`, and
  `facadeOutdoorOrRoomNormalizationContext`.
- `needs_input` behavior: missing door/window/facade frequency or
  rating basis remains a precise `needs_input`; the owner does not
  collapse incomplete facade claims into generic opening labels.
- `unsupported` boundaries: facade field/building outputs, outdoor-
  indoor facade/OITC, ASTM/ISO aliases, impact metrics, broad source
  crawling, source-row imports, and support widening remain blocked.

## Runtime Behavior

Complete indoor `field_between_rooms` and `building_prediction` door /
window / facade requests now keep lab companions target-output
independent:

- `Rw 38.2` from Gate S remains calculable as a lab companion.
- `STC 39` from Gate AH remains calculable as a lab companion.
- Single-output `Rw`, single-output `STC`, lab-only `Rw/STC`, and mixed
  lab + field/building requests keep request-scoped
  `supportedTargetOutputs`.
- Field/building outputs such as `R'w`, `Dn,w`, `Dn,A`, `DnT,w`,
  `DnT,A`, and `DnT,A,k` remain unsupported for this facade boundary.

This is a runtime/basis owner, not a formula retune, OITC adapter,
manufacturer scalar-rating copy, source crawl, catalog import, or
frontend slice; it is not a broad source crawl.

## Counters

- `newCalculableLayerTemplates: 0`
- `newCalculableRequestShapes: 4`
- `newCalculableTargetOutputs: 2`
- `requiredPhysicalInputsCaptured: 0`
- `runtimeBasisPromotions: 4`
- `runtimeValuesMoved 8`
- `runtimeFormulaRetunes: 0`
- `sourceRowsImported: 0`
- `frontendImplementationFilesTouched: 0`
- `unsupportedBoundariesProtected: 6`

## Non-Goals

- No facade field/building prediction runtime.
- No outdoor-indoor or OITC adapter.
- No STC scalar opening rating input.
- No ASTM/ISO metric alias.
- No lab-to-field/building copying.
- No impact fallback.
- No broad source crawl or product catalog import.
