# Post-V1 Opening/Facade Outdoor-Indoor OITC Spectral Rating Owner Plan - 2026-06-29

Status:
`post_v1_opening_facade_outdoor_indoor_oitc_spectral_rating_owner_plan`

Selected by:
`post_v1_runtime_first_route_family_rerank_after_ceiling_roof_suspended_ceiling_route_split_boundary_coverage_refresh_plan`

Selected by status:
`post_v1_runtime_first_route_family_rerank_after_ceiling_roof_suspended_ceiling_route_split_boundary_coverage_refresh_landed_no_runtime_selected_opening_facade_outdoor_indoor_oitc_spectral_rating_owner`

Selected candidate:
`opening.facade_outdoor_indoor_oitc_spectral_rating_owner`

Owner file:
`packages/engine/src/post-v1-opening-facade-outdoor-indoor-oitc-spectral-rating-owner-contract.test.ts`

Plan file:
`docs/calculator/POST_V1_OPENING_FACADE_OUTDOOR_INDOOR_OITC_SPECTRAL_RATING_OWNER_PLAN_2026-06-29.md`

Previous rerank:
`post_v1_runtime_first_route_family_rerank_after_ceiling_roof_suspended_ceiling_route_split_boundary_coverage_refresh_plan`

Previous rerank file:
`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-ceiling-roof-suspended-ceiling-route-split-boundary-coverage-refresh-contract.test.ts`

Previous rerank plan:
`docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_CEILING_ROOF_SUSPENDED_CEILING_ROUTE_SPLIT_BOUNDARY_COVERAGE_REFRESH_PLAN_2026-06-29.md`

Previous coverage refresh:
`post_v1_ceiling_roof_suspended_ceiling_route_split_boundary_coverage_refresh_plan`
/
`packages/engine/src/post-v1-ceiling-roof-suspended-ceiling-route-split-boundary-coverage-refresh-contract.test.ts`
/
`docs/calculator/POST_V1_CEILING_ROOF_SUSPENDED_CEILING_ROUTE_SPLIT_BOUNDARY_COVERAGE_REFRESH_PLAN_2026-06-29.md`
/
`post_v1_ceiling_roof_suspended_ceiling_route_split_boundary_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank_after_ceiling_roof_suspended_ceiling_route_split_boundary_coverage_refresh`

Previous route-boundary owner:
`post_v1_ceiling_roof_suspended_ceiling_route_split_boundary_owner_plan`
/
`packages/engine/src/post-v1-ceiling-roof-suspended-ceiling-route-split-boundary-owner-contract.test.ts`
/
`docs/calculator/POST_V1_CEILING_ROOF_SUSPENDED_CEILING_ROUTE_SPLIT_BOUNDARY_OWNER_PLAN_2026-06-29.md`
/
`post_v1_ceiling_roof_suspended_ceiling_route_split_boundary_owner_landed_input_boundary_selected_coverage_refresh`

Selected next label:
`post-V1 opening/facade outdoor-indoor OITC spectral rating owner`

Checkpoint reconciliation:
`docs/calculator/CHECKPOINT_2026-06-29_OITC_OWNER_READY_HANDOFF.md`.
That checkpoint confirms the selected owner file is intentionally not
implemented yet, the current gate is wired through the latest no-runtime
rerank, complete outdoor-indoor `OITC` requests remain unsupported, and
this owner is still the next bounded calculator behavior.

Rerank counters:
`candidateCount: 8`, `roiAnalysisIterations: 4`,
`estimatedNextCalculableRequestShapes: 1`,
`estimatedNextCalculableTargetOutputs: 1`,
`estimatedNextRequiredPhysicalInputsCaptured: 4`,
`estimatedNextRuntimeBasisPromotions: 1`,
`estimatedNextRuntimeValuesMoved: 1`,
`estimatedNextUnsupportedBoundariesProtected: 7`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.

This is not a broad source crawl.

## Selection Card

- User construction / formula family: outdoor-indoor facade opening,
  window, door, or facade element with explicit spectral outdoor-indoor
  transmission-loss or noise-reduction curve and route context
  `facadeOutdoorContext: outdoor_indoor_facade`.
- Target outputs to open: `OITC`.
- Route: use the already landed OITC requested-output bridge and
  opening/facade frequency boundary, then calculate only through an
  owned outdoor-indoor spectral rating adapter. Exact measured/source
  scalar `OITC` rows remain admissible only on true construction,
  metric, standard/basis, and context matches.
- Required physical inputs:
  `outdoorIndoorTransmissionLossOrNoiseReductionCurve`,
  `oneThirdOctaveBands80To4000Hz`,
  `facadeOutdoorContext=outdoor_indoor_facade`, and
  `openingOrFacadeAreaEnergyContext`.
- `needs_input`: missing or incomplete spectral bands, missing facade
  outdoor context, missing opening/facade area-energy context, or
  ambiguous rating basis must return precise `needs_input`.
- `unsupported`: `STC`, `Rw`, `NISR`, `ISR`, indoor partition
  `DnT,w`, indoor field/building companions, ISO airborne scalar
  ratings, and source report values are not OITC aliases.
- Expected next counters:
  `newCalculableRequestShapes: 1`,
  `newCalculableTargetOutputs: 1`,
  `requiredPhysicalInputsCaptured: 4`,
  `runtimeBasisPromotions: 1`,
  `runtimeValuesMoved 1`,
  `runtimeFormulaRetunes: 0`,
  `sourceRowsImported: 0`,
  `frontendImplementationFilesTouched: 0`, and
  `unsupportedBoundariesProtected: 7`.

## Purpose

The OITC bridge already made `OITC` a valid requested output, but
complete outdoor-indoor facade requests still return `unsupported`.
This owner should move the next high-ROI calculator behavior: calculate
`OITC` from an owned outdoor-indoor spectral route when the user
supplies the required spectrum and facade/opening context.

This slice follows the ceiling route-boundary closeout and the existing
ASTM `IIC` / `AIIC` exact-band runtime/input-surface closeout. It must
not repeat already landed floor ASTM work, reopen the ceiling route
boundary, or turn OITC into a scalar alias.

## Acceptance Criteria

- Complete outdoor-indoor facade spectral requests calculate `OITC`
  through a route-owned spectral rating basis.
- Missing spectral bands or missing outdoor/facade context return
  `needs_input` with exact required inputs.
- Indoor partition requests stay outside the outdoor-indoor OITC route.
- `STC`, `Rw`, `NISR`, `ISR`, indoor `DnT,w`, and lab/field companions
  do not publish OITC.
- Existing exact ASTM `IIC` / `AIIC` routes remain unchanged and are
  not treated as impact aliases for OITC.
- No source rows are imported and no frontend implementation files are
  touched by the owner unless a later UI-specific input-surface slice is
  selected.

## Non-Goals

- Do not crawl all facade/window/door OITC source rows.
- Do not use `STC`, `Rw`, `NISR`, `ISR`, or indoor partition metrics as
  OITC substitutes.
- Do not copy a source report OITC value unless construction, metric,
  standard/basis, and context truly match.
- Do not reopen floor ASTM `IIC` / `AIIC` exact-band ownership or the
  ceiling route split boundary.
