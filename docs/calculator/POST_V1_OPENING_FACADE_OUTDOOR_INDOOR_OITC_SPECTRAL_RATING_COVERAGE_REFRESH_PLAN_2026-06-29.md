# Post-V1 Opening/Facade Outdoor-Indoor OITC Spectral Rating Coverage Refresh Plan - 2026-06-29

Status:
`post_v1_opening_facade_outdoor_indoor_oitc_spectral_rating_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank_after_opening_facade_outdoor_indoor_oitc_spectral_rating_coverage_refresh`

Coverage refresh action:
`post_v1_opening_facade_outdoor_indoor_oitc_spectral_rating_coverage_refresh_plan`

Selected by:
`post_v1_opening_facade_outdoor_indoor_oitc_spectral_rating_owner_plan`

Selected by status:
`post_v1_opening_facade_outdoor_indoor_oitc_spectral_rating_owner_landed_runtime_basis_selected_coverage_refresh`

Selected candidate to re-probe:
`opening.facade_outdoor_indoor_oitc_spectral_rating_owner`

Coverage refresh file:
`packages/engine/src/post-v1-opening-facade-outdoor-indoor-oitc-spectral-rating-coverage-refresh-contract.test.ts`

Selected next action:
`post_v1_runtime_first_route_family_rerank_after_opening_facade_outdoor_indoor_oitc_spectral_rating_coverage_refresh_plan`

Selected next file:
`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-opening-facade-outdoor-indoor-oitc-spectral-rating-coverage-refresh-contract.test.ts`

Selected next plan:
`docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_OPENING_FACADE_OUTDOOR_INDOOR_OITC_SPECTRAL_RATING_COVERAGE_REFRESH_PLAN_2026-06-29.md`

Selected next label:
`post-V1 runtime-first route-family rerank after opening/facade outdoor-indoor OITC spectral rating coverage refresh`

Previous owner file:
`packages/engine/src/post-v1-opening-facade-outdoor-indoor-oitc-spectral-rating-owner-contract.test.ts`

Previous owner plan:
`docs/calculator/POST_V1_OPENING_FACADE_OUTDOOR_INDOOR_OITC_SPECTRAL_RATING_OWNER_PLAN_2026-06-29.md`

Previous owner runtime counters:
`newCalculableRequestShapes: 1`,
`newCalculableTargetOutputs: 1`,
`requiredPhysicalInputsCaptured: 4`,
`runtimeBasisPromotions: 1`,
`runtimeValuesMoved 1`,
`runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`,
`frontendImplementationFilesTouched: 0`, and
`unsupportedBoundariesProtected: 7`.

Landed counters:
`coverageRefreshContractFilesTouched: 1`,
`newCalculableRequestShapes: 0`,
`newCalculableTargetOutputs: 0`,
`requiredPhysicalInputsCaptured: 0`,
`runtimeBasisPromotions: 0`,
`runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`,
`frontendImplementationFilesTouched: 0`, and
`unsupportedBoundariesProtected: 0`.

This is not a broad source crawl.

## Purpose

The OITC spectral rating owner moved runtime value coverage. The next
support slice should be a no-runtime coverage refresh that re-probes the
same outdoor-indoor facade route after integration, so later work does
not regress into `Rw`/`STC` aliasing, legacy ISO-band promotion, indoor
partition copying, or source-report scalar substitution.

## Acceptance Criteria

- Complete outdoor-indoor facade/opening requests with explicit
  `one_third_octave_80_4000` curves remain supported for `OITC`.
- The result keeps `OITC` on
  `post_v1_opening_facade_outdoor_indoor_oitc_spectral_rating_owner`
  with ASTM E1332 rating adapter metadata and resolver value pins.
- Missing OITC band-set context remains `needs_input`.
- Legacy `third_octave_100_3150` ISO curve contexts remain outside the
  OITC owner.
- Indoor partition requests remain unsupported for outdoor-indoor
  `OITC`.
- Mixed `Rw`, `STC`, `NISR`/`ISR`, and indoor `DnT,w` requests do not
  publish those metrics as OITC aliases.
- No source rows are imported and no frontend implementation files are
  touched by the refresh.

## Non-Goals

- Do not retune the ASTM E1332 spectrum or OITC formula.
- Do not add source rows or crawl manufacturer facade/window libraries.
- Do not widen OITC to indoor partition, `STC`, `Rw`, `NISR`/`ISR`, or
  ISO 717-1 outputs.
- Do not start the later facade/window calibration or holdout work until
  this runtime owner is pinned.
