# Post-V1 Runtime-First Route-Family Rerank After Opening/Facade Outdoor-Indoor OITC Spectral Rating Coverage Refresh - 2026-06-29

Status:
`post_v1_runtime_first_route_family_rerank_after_opening_facade_outdoor_indoor_oitc_spectral_rating_coverage_refresh_landed_no_runtime_selected_post_v1_spectral_rating_backbone_v1`

Previous coverage refresh:
`post_v1_opening_facade_outdoor_indoor_oitc_spectral_rating_coverage_refresh_plan`

Previous coverage refresh status:
`post_v1_opening_facade_outdoor_indoor_oitc_spectral_rating_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank_after_opening_facade_outdoor_indoor_oitc_spectral_rating_coverage_refresh`

Previous coverage refresh file:
`packages/engine/src/post-v1-opening-facade-outdoor-indoor-oitc-spectral-rating-coverage-refresh-contract.test.ts`

Rerank action:
`post_v1_runtime_first_route_family_rerank_after_opening_facade_outdoor_indoor_oitc_spectral_rating_coverage_refresh_plan`

Rerank file:
`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-opening-facade-outdoor-indoor-oitc-spectral-rating-coverage-refresh-contract.test.ts`

Rerank plan doc:
`docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_OPENING_FACADE_OUTDOOR_INDOOR_OITC_SPECTRAL_RATING_COVERAGE_REFRESH_PLAN_2026-06-29.md`

Selected candidate:
`post_v1_spectral_rating_backbone_v1`

Selected next action:
`post_v1_spectral_rating_backbone_v1_plan`

Selected next file:
`packages/engine/src/post-v1-spectral-rating-backbone-v1-contract.test.ts`

Selected next plan:
`docs/calculator/POST_V1_SPECTRAL_RATING_BACKBONE_V1_PLAN_2026-06-29.md`

Selected next label:
`post-V1 spectral rating backbone V1`

Previous coverage refresh counters:
`coverageRefreshContractFilesTouched: 1`,
`newCalculableRequestShapes: 0`, `newCalculableTargetOutputs: 0`,
`requiredPhysicalInputsCaptured: 0`, `runtimeBasisPromotions: 0`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, `frontendImplementationFilesTouched: 0`, and
`unsupportedBoundariesProtected: 0`.

## Purpose

The outdoor-indoor `OITC` runtime owner has landed and its no-runtime
coverage refresh protects the ASTM E1332 value route, missing-band
`needs_input`, legacy ISO-band rejection, indoor partition rejection, and
`Rw` / `STC` / `NISR` / `ISR` / indoor `DnT,w` alias blocks.

This rerank must choose the next highest-ROI calculator slice from the
post-OITC state. It must not repeat the OITC owner, reopen the metric
schema bridge, start a broad source crawl, retune formulas without
same-family same-basis evidence, or select cosmetic UI work.

## Candidate Set To Evaluate

Primary candidates:

- `post_v1_spectral_rating_backbone_v1`
- `post_v1_route_input_family_first_class_surface_v1`
- `post_v1_industry_grade_golden_scenario_matrix_v1`
- `post_v1_route_required_input_question_engine_v1`
- `post_v1_wall_triple_leaf_multicavity_runtime_promotion_after_holdout_v1`
- `post_v1_building_flanking_adapter_backbone_v1`

Selected candidate:
`post_v1_spectral_rating_backbone_v1`, because the OITC owner just
proved the need for a reusable rating/band/basis primitive and the
implementation now has separate evidence in `curve-rating.ts`,
`oitc-rating.ts`, and shared `rating-adapter.ts`. This selection is
valid only because it stays tightly scoped around just-landed OITC and
existing owned curve routes, and because it exits into a value-moving
or accuracy owner. It is not a broad architecture cleanup.

## Selection Rules

- Prefer runtime, accuracy, input-surface, or boundary movement over
  another passive support loop.
- If a support primitive is selected, it must name the calculator
  behavior it unlocks and have an executable exit test.
- Do not select OITC calibration unless same-family same-basis holdout
  evidence is present and admissible.
- Do not promote triple-leaf runtime until calibration and holdout
  blockers are explicitly closed.
- Do not import many source rows unless the selected slice names an
  exact-match, calibration, holdout, or bounded-delta use.

## Landed Rerank Counters

Landed rerank counters:
`candidateCount: 6`, `roiAnalysisIterations: 4`,
`estimatedNextCalculableRequestShapes: 0`,
`estimatedNextCalculableTargetOutputs: 0`,
`estimatedNextRequiredPhysicalInputsCaptured: 0`,
`estimatedNextRuntimeBasisPromotions: 0`,
`estimatedNextRuntimeValuesMoved: 0`,
`estimatedNextReusableRatingProceduresMoved: 3`,
`estimatedNextUnsupportedBoundariesProtected: 6`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.

Selected-next counters remain runtime-frozen for the support slice:
`newCalculableRequestShapes: 0`, `newCalculableTargetOutputs: 0`,
`requiredPhysicalInputsCaptured: 0`, `runtimeBasisPromotions: 0`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.
The selected slice must move reusable rating/band/basis ownership and
then exit to a value-moving, accuracy, input-surface, or boundary owner
unless it exposes a concrete blocker.

This is not a broad source crawl.

## Decision Notes

Rejected candidates:

- `opening.facade_outdoor_indoor_oitc_spectral_rating_owner`: already
  landed with its coverage refresh.
- `opening.facade_outdoor_indoor_oitc_calibration_retune`: blocked
  until same-family same-basis outdoor-indoor holdout evidence exists.
- `post_v1_route_input_family_first_class_surface_v1`: still high ROI,
  but lower immediate ROI until the just-exposed rating backbone closes.
- `post_v1_wall_triple_leaf_multicavity_runtime_promotion_after_holdout_v1`:
  still blocked behind holdout and calibration prerequisites.
- `broad_source_crawl_or_frontend_polish`: rejected drift.

Current selected next:
`post_v1_spectral_rating_backbone_v1_plan`
/
`packages/engine/src/post-v1-spectral-rating-backbone-v1-contract.test.ts`
/
`docs/calculator/POST_V1_SPECTRAL_RATING_BACKBONE_V1_PLAN_2026-06-29.md`
/
`post-V1 spectral rating backbone V1`.

## Guardrails

- Exact measured rows remain exact evidence only.
- Same-family anchors need same-basis compatibility and owned bounded
  deltas.
- Missing physics returns precise `needs_input`.
- Unsupported metric/basis combinations remain `unsupported`.
- `OITC` must not be synthesized from `Rw`, `STC`, `NISR`, `ISR`, or
  indoor field metrics.
- Field/building metrics must not copy lab values without an owned
  adapter and route-required physical context.
