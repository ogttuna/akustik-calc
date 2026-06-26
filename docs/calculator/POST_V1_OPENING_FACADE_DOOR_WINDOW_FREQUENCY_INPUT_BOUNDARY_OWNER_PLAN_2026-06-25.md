# Post-V1 Opening/Facade Door/Window Frequency-Input Boundary Owner Plan - 2026-06-25

Status:
`post_v1_opening_facade_door_window_frequency_input_boundary_owner_landed_input_boundary_selected_coverage_refresh`

Owner action:
`post_v1_opening_facade_door_window_frequency_input_boundary_owner_plan`

Selected by:
`post_v1_runtime_first_route_family_rerank_after_advanced_wall_current_gate_checkpoint_plan`

Selected rerank file:
`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-advanced-wall-current-gate-checkpoint-contract.test.ts`

Selected rerank status:
`post_v1_runtime_first_route_family_rerank_after_advanced_wall_current_gate_checkpoint_landed_no_runtime_selected_opening_facade_door_window_frequency_input_boundary_owner`

Selected candidate:
`opening.facade_door_window_frequency_input_boundary_owner`

Selected rerank candidate count:
`candidateCount: 8`

Selected owner file:
`packages/engine/src/post-v1-opening-facade-door-window-frequency-input-boundary-owner-contract.test.ts`

Selected owner label:
`post-V1 opening/facade door/window frequency-input boundary owner`

Selected next action:
`post_v1_opening_facade_door_window_frequency_input_boundary_coverage_refresh_plan`

Selected next file:
`packages/engine/src/post-v1-opening-facade-door-window-frequency-input-boundary-coverage-refresh-contract.test.ts`

Selected next plan:
`docs/calculator/POST_V1_OPENING_FACADE_DOOR_WINDOW_FREQUENCY_INPUT_BOUNDARY_COVERAGE_REFRESH_PLAN_2026-06-25.md`

Selected next label:
`post-V1 opening/facade door/window frequency-input boundary coverage refresh`

Landing counters: `requiredPhysicalInputsCaptured: 6`,
`unsupportedBoundariesProtected: 8`, `newCalculableLayerTemplates: 0`,
`newCalculableRequestShapes: 0`, `newCalculableTargetOutputs: 0`,
`runtimeBasisPromotions: 0`, `runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`.

Selected coverage refresh status:
`post_v1_opening_facade_door_window_frequency_input_boundary_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank_after_opening_facade_door_window_frequency_input_boundary_coverage_refresh`

Selected coverage refresh counters:
`coverageRefreshContractFilesTouched: 1`,
`requiredPhysicalInputsCaptured: 0`,
`newCalculableLayerTemplates: 0`, `newCalculableRequestShapes: 0`,
`newCalculableTargetOutputs: 0`, `runtimeBasisPromotions: 0`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.

The landed coverage refresh re-probes
`opening.facade_door_window_frequency_input_boundary_owner`, keeps
legacy generic and explicit complete opening/leak lab `Rw 38.2` and
`STC 39` live, keeps `openingFrequencyBandsOrRatingBasis` as precise
`needs_input`, and keeps field/building facade, outdoor-indoor facade,
and impact aliases unsupported. This is not a broad source crawl.

Coverage refresh selected next action:
`post_v1_runtime_first_route_family_rerank_after_opening_facade_door_window_frequency_input_boundary_coverage_refresh_plan`

Coverage refresh selected next file:
`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-opening-facade-door-window-frequency-input-boundary-coverage-refresh-contract.test.ts`

Coverage refresh selected next plan:
`docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_OPENING_FACADE_DOOR_WINDOW_FREQUENCY_INPUT_BOUNDARY_COVERAGE_REFRESH_PLAN_2026-06-25.md`

Coverage refresh selected next label:
`post-V1 runtime-first route-family rerank after opening/facade door/window frequency-input boundary coverage refresh`

## Purpose

This is the next calculator-first owner selected after the advanced-wall
current-gate checkpoint rerank. The goal is not to add a product catalog
or widen scalar opening rows. The goal is to protect the calculator from
claiming door, window, facade, or exterior-opening coverage unless the
route has the physical inputs needed for a frequency-first prediction or
for a precise `needs_input` / `unsupported` response.

Gate S already owns an element-lab opening/leak composite Rw path from
host-wall and area-energy inputs, and Gate AH already adapts that path
to element-lab STC through an owned shifted spectrum. The missing next
boundary is the wider opening/facade surface: door/window/facade
elements, outdoor-indoor use, frequency-band input, and field/building
normalization must not be inferred from generic opening labels or nearby
scalar ratings.

## Selection Card

- User construction / formula family:
  opaque host wall plus user-entered opening, door, window, or facade
  element candidates where the user may provide element area, element
  type, seal/leakage condition, and either frequency bands or a clearly
  scoped rating basis.
- Target outputs to open:
  no runtime target output is opened by this boundary owner. It prepares
  safe future work for `Rw`, `STC`, `C`, `Ctr`, `R'w`, `Dn,w`, `Dn,A`,
  `DnT,w`, `DnT,A`, and OITC-like facade metrics only when a later owner
  provides the required spectral or building context.
- Route:
  required-input and unsupported-boundary owner. Existing Gate S/Gate AH
  element-lab behavior remains live, but door/window/facade claims must
  require explicit area, element type, rating or frequency basis,
  leakage/seal class, and facade/outdoor or room-normalization context.
- Required physical inputs:
  `hostWallAreaM2`, `openingLeakElements[].areaM2`,
  `openingLeakElements[].elementType`,
  `openingLeakElements[].frequencyBandsOrRatingBasis`,
  `openingLeakElements[].sealLeakageClass`, and
  `facadeOutdoorOrRoomNormalizationContext`.
- `needs_input` behavior:
  missing required inputs should return precise `needs_input` for the
  missing physical quantity rather than falling back to generic opening
  rows, copied scalar ratings, or adjacent metrics.
- `unsupported` boundaries:
  generic door/window/facade scalar aliases, lab-to-field or
  lab-to-building copies, OITC promotion without an owned outdoor-indoor
  spectrum adapter, ASTM/ISO metric aliasing, impact metric fallback,
  broad product/source crawling, area-free composite transmission loss,
  and target-output widening beyond requested metrics remain blocked.
- Expected `newCalculableRequestShapes`:
  `0`.
- Expected `newCalculableTargetOutputs`:
  `0`.
- Expected `requiredPhysicalInputsCaptured`:
  `6`.
- Expected `runtimeBasisPromotions`:
  `0`.
- Expected `runtimeValuesMoved`:
  `0`.

## Acceptance Criteria

- The owner contract proves current Gate S/Gate AH opening/leak runtime
  behavior remains live for its existing element-lab basis.
- Door, window, facade, or exterior-opening requests that lack area,
  element type, frequency/rating basis, seal/leakage class, or facade /
  normalization context return precise `needs_input`.
- Requests that try to promote OITC, field/building metrics, impact
  metrics, or ASTM/ISO aliases without owned adapters stay unsupported.
- The owner does not import source rows, retune formulas, or move
  runtime numeric values.
- The owner names the next runtime or coverage-refresh step after the
  boundary is protected.

## Non-Goals

- No broad source crawl.
- No manufacturer rating copy.
- No product catalog import.
- No frontend polish.
- No field/building facade prediction runtime.
- No OITC adapter runtime.
- No formula retune.
- No runtime value movement.
