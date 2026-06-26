# Post-V1 Runtime-First Route-Family Rerank After Opening/Facade Door/Window Acoustic-Rating Input Boundary Coverage Refresh - 2026-06-25

Status:
`post_v1_runtime_first_route_family_rerank_after_opening_facade_door_window_acoustic_rating_input_boundary_coverage_refresh_landed_no_runtime_selected_opening_facade_door_window_spectral_opening_curve_runtime_owner`

Rerank action:
`post_v1_runtime_first_route_family_rerank_after_opening_facade_door_window_acoustic_rating_input_boundary_coverage_refresh_plan`

Rerank file:
`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-opening-facade-door-window-acoustic-rating-input-boundary-coverage-refresh-contract.test.ts`

Rerank plan:
`docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_OPENING_FACADE_DOOR_WINDOW_ACOUSTIC_RATING_INPUT_BOUNDARY_COVERAGE_REFRESH_PLAN_2026-06-25.md`

Previous owner action:
`post_v1_opening_facade_door_window_acoustic_rating_input_boundary_owner_plan`

Previous owner file:
`packages/engine/src/post-v1-opening-facade-door-window-acoustic-rating-input-boundary-owner-contract.test.ts`

Previous owner status:
`post_v1_opening_facade_door_window_acoustic_rating_input_boundary_owner_landed_input_boundary_selected_coverage_refresh`

Previous owner selected candidate:
`opening.facade_door_window_acoustic_rating_input_boundary_owner`

Previous coverage refresh action:
`post_v1_opening_facade_door_window_acoustic_rating_input_boundary_coverage_refresh_plan`

Previous coverage refresh file:
`packages/engine/src/post-v1-opening-facade-door-window-acoustic-rating-input-boundary-coverage-refresh-contract.test.ts`

Previous coverage refresh status:
`post_v1_opening_facade_door_window_acoustic_rating_input_boundary_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank_after_opening_facade_door_window_acoustic_rating_input_boundary_coverage_refresh`

Previous coverage refresh counters:
`coverageRefreshContractFilesTouched: 1`, `requiredPhysicalInputsCaptured: 0`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.

Selected candidate:
`opening.facade_door_window_spectral_opening_curve_runtime_owner`

Selected next action:
`post_v1_opening_facade_door_window_spectral_opening_curve_runtime_owner_plan`

Selected next file:
`packages/engine/src/post-v1-opening-facade-door-window-spectral-opening-curve-runtime-owner-contract.test.ts`

Selected next plan:
`docs/calculator/POST_V1_OPENING_FACADE_DOOR_WINDOW_SPECTRAL_OPENING_CURVE_RUNTIME_OWNER_PLAN_2026-06-25.md`

Selected next label:
`post-V1 opening/facade door/window spectral opening-curve runtime owner`

## Selection Card

- User construction / formula family: indoor partition opening route with
  a user-entered door/window/facade `elementTransmissionLossCurve`.
- Target outputs to open: `Rw`, `STC`, `C`, and `Ctr` on element-lab
  basis.
- Formula route: use the existing host wall curve and area-energy
  opening composite formula band-by-band, then rate the calculated
  opening transmission-loss curve.
- Required physical inputs: `hostWallTransmissionLossCurve`,
  `hostWallAreaM2`, `openingAreaM2`, `openingCount`,
  `openingElementTransmissionLossCurve`, `openingRatingBasis`,
  `openingSealLeakageClass`, and `openingOrigin`.
- `needs_input` behavior: if neither `openingElementRwDb` nor a usable
  `openingElementTransmissionLossCurve` is present, the acoustic-rating
  boundary still returns `needs_input` for `openingElementRwDb`.
- Unsupported boundaries: no scalar STC-to-Rw shortcut, no
  outdoor-indoor/OITC promotion, no field/building copy from the lab
  spectral curve, no source-row import, no broad catalog crawl, and no
  impact fallback.

## Rerank Outcome

The selected runtime owner is higher ROI than repeating the landed
acoustic-rating boundary, C/Ctr companion, or indoor field/building
adapter because it changes the input model from scalar `openingElementRwDb`
to an explicit opening transmission-loss curve. That directly advances
the frequency-first backbone and opens manufacturer/user spectral data
without aliasing a scalar STC or copying field/building metrics.

Counters: `candidateCount: 10`, `roiAnalysisIterations: 4`,
`estimatedNextCalculableRequestShapes: 3`,
`estimatedNextCalculableTargetOutputs: 4`,
`estimatedNextRequiredPhysicalInputsCaptured: 1`,
`estimatedNextRuntimeBasisPromotions: 3`,
`estimatedNextRuntimeValuesMoved: 12`,
`estimatedNextUnsupportedBoundariesProtected: 6`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.

This rerank is support work only. It does not move runtime values by
itself, but it selects the immediate runtime owner and records
no support-only loop.

This is not a broad source crawl.
