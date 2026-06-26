# Post-V1 Opening/Facade Door/Window Spectral Opening-Curve Runtime Owner Plan - 2026-06-25

Status:
`post_v1_opening_facade_door_window_spectral_opening_curve_runtime_owner_landed_runtime_selected_coverage_refresh`

Owner action:
`post_v1_opening_facade_door_window_spectral_opening_curve_runtime_owner_plan`

Owner file:
`packages/engine/src/post-v1-opening-facade-door-window-spectral-opening-curve-runtime-owner-contract.test.ts`

Selected by:
`post_v1_runtime_first_route_family_rerank_after_opening_facade_door_window_acoustic_rating_input_boundary_coverage_refresh_plan`

Previous coverage refresh action:
`post_v1_opening_facade_door_window_acoustic_rating_input_boundary_coverage_refresh_plan`

Previous rerank status:
`post_v1_runtime_first_route_family_rerank_after_opening_facade_door_window_acoustic_rating_input_boundary_coverage_refresh_landed_no_runtime_selected_opening_facade_door_window_spectral_opening_curve_runtime_owner`

Previous rerank estimate:
`estimatedNextRuntimeValuesMoved: 12`; selected the explicit opening transmission-loss curve runtime with no support-only loop.

Selected candidate:
`opening.facade_door_window_spectral_opening_curve_runtime_owner`

Runtime method:
`post_v1_opening_facade_door_window_spectral_opening_curve_runtime_owner`

Selected next action:
`post_v1_opening_facade_door_window_spectral_opening_curve_runtime_coverage_refresh_plan`

Selected next file:
`packages/engine/src/post-v1-opening-facade-door-window-spectral-opening-curve-runtime-coverage-refresh-contract.test.ts`

Selected next plan:
`docs/calculator/POST_V1_OPENING_FACADE_DOOR_WINDOW_SPECTRAL_OPENING_CURVE_RUNTIME_COVERAGE_REFRESH_PLAN_2026-06-25.md`

Selected next label:
`post-V1 opening/facade door/window spectral opening-curve runtime coverage refresh`

## Runtime Behavior Opened

Complete element-lab door/window/facade opening requests can now omit
scalar `openingElementRwDb` when they provide a usable
`openingElementTransmissionLossCurve`. The engine calculates the
area-energy opening transmission-loss curve band-by-band from the
host wall curve, opening area/count, seal/leakage penalty, and opening
curve, then rates the calculated curve for `Rw`, `STC`, `C`, and `Ctr`.

The representative contract fixture keeps the host wall stack
gypsum/air/rockwool/concrete, host area `12 m2`, one `1.8 m2` door,
average seal penalty, and a 63-4000 Hz opening TL curve. It returns
`Rw 46`, `STC 46`, `C -1.3`, and `Ctr -5.9` with
`curveBasis: calculated_frequency_curve` and
`origin: family_physics_prediction`.

The scalar opening route remains unchanged: complete scalar
`openingElementRwDb` requests still produce `Rw 38.2`, `STC 39`,
`C -1.6`, and `Ctr -6.3` for the existing fixture.

## Boundaries Preserved

- Field/building outputs are not copied from the lab spectral curve.
  Curve-only opening elements still keep `R'w`, `Dn,w`, `Dn,A`,
  `DnT,w`, `DnT,A`, and `DnT,A,k` unsupported until a spectral
  field/building adapter owns apparent and standardized outputs.
- If neither `openingElementRwDb` nor a usable
  `openingElementTransmissionLossCurve` is present, the acoustic-rating
  boundary still returns `needs_input` for `openingElementRwDb`.
- Outdoor-indoor facade, OITC, scalar STC rating conversion, source-row
  import, broad catalog crawling, and impact metrics remain outside this
  owner.

## Counters

- `newCalculableLayerTemplates: 0`
- `newCalculableRequestShapes: 3`
- `newCalculableTargetOutputs: 4`
- `requiredPhysicalInputsCaptured: 1`
- `runtimeBasisPromotions: 3`
- `runtimeValuesMoved 12`
- `runtimeFormulaRetunes: 0`
- `sourceRowsImported: 0`
- `frontendImplementationFilesTouched: 0`
- `unsupportedBoundariesProtected: 6`

This is a runtime/formula-scope calculator slice, not a source crawl,
formula retune, catalog import, or frontend slice.

## Follow-Up Coverage Refresh Landed

Coverage refresh action:
`post_v1_opening_facade_door_window_spectral_opening_curve_runtime_coverage_refresh_plan`.

Coverage refresh file:
`packages/engine/src/post-v1-opening-facade-door-window-spectral-opening-curve-runtime-coverage-refresh-contract.test.ts`.

Coverage refresh status:
`post_v1_opening_facade_door_window_spectral_opening_curve_runtime_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank_after_opening_facade_door_window_spectral_opening_curve_runtime_coverage_refresh`.

The refresh re-probes selected candidate
`opening.facade_door_window_spectral_opening_curve_runtime_owner`,
keeps `openingElementTransmissionLossCurve` as the explicit spectral
opening input, keeps curve-only outputs blocked until a spectral
field/building adapter owns them, and selects
`post_v1_runtime_first_route_family_rerank_after_opening_facade_door_window_spectral_opening_curve_runtime_coverage_refresh_plan`
/
`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-opening-facade-door-window-spectral-opening-curve-runtime-coverage-refresh-contract.test.ts`
/
`docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_OPENING_FACADE_DOOR_WINDOW_SPECTRAL_OPENING_CURVE_RUNTIME_COVERAGE_REFRESH_PLAN_2026-06-25.md`.
Counters: `coverageRefreshContractFilesTouched: 1`,
`requiredPhysicalInputsCaptured: 0`, `runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`. This is not a broad source
crawl; not a broad source crawl. Boundary label:
`spectral field/building adapter`.
