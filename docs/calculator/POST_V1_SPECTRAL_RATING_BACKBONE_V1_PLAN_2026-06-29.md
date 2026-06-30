# Post-V1 Spectral Rating Backbone V1 - 2026-06-29

Status:
`post_v1_spectral_rating_backbone_v1_landed_support_selected_post_v1_route_input_family_first_class_surface_v1`

Action:
`post_v1_spectral_rating_backbone_v1_plan`

Selected by rerank:
`post_v1_runtime_first_route_family_rerank_after_opening_facade_outdoor_indoor_oitc_spectral_rating_coverage_refresh_landed_no_runtime_selected_post_v1_spectral_rating_backbone_v1`

Selected candidate:
`post_v1_spectral_rating_backbone_v1`

Prior coverage refresh:
`post_v1_opening_facade_outdoor_indoor_oitc_spectral_rating_coverage_refresh_plan`

Prior coverage refresh status:
`post_v1_opening_facade_outdoor_indoor_oitc_spectral_rating_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank_after_opening_facade_outdoor_indoor_oitc_spectral_rating_coverage_refresh`

Rerank action:
`post_v1_runtime_first_route_family_rerank_after_opening_facade_outdoor_indoor_oitc_spectral_rating_coverage_refresh_plan`

Rerank file:
`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-opening-facade-outdoor-indoor-oitc-spectral-rating-coverage-refresh-contract.test.ts`

Rerank status:
`post_v1_runtime_first_route_family_rerank_after_opening_facade_outdoor_indoor_oitc_spectral_rating_coverage_refresh_landed_no_runtime_selected_post_v1_spectral_rating_backbone_v1`

Plan file:
`packages/engine/src/post-v1-spectral-rating-backbone-v1-contract.test.ts`

Plan doc:
`docs/calculator/POST_V1_SPECTRAL_RATING_BACKBONE_V1_PLAN_2026-06-29.md`

Label:
`post-V1 spectral rating backbone V1`

Selected next action:
`post_v1_route_input_family_first_class_surface_v1_plan`

Selected next file:
`packages/engine/src/post-v1-route-input-family-first-class-surface-v1-contract.test.ts`

Selected next plan:
`docs/calculator/POST_V1_ROUTE_INPUT_FAMILY_FIRST_CLASS_SURFACE_V1_PLAN_2026-06-29.md`

Selected next label:
`post-V1 route/input family first-class surface V1`

Previous completed action:
`post_v1_runtime_first_route_family_rerank_after_opening_facade_outdoor_indoor_oitc_spectral_rating_coverage_refresh_plan`

Previous completed status:
`post_v1_runtime_first_route_family_rerank_after_opening_facade_outdoor_indoor_oitc_spectral_rating_coverage_refresh_landed_no_runtime_selected_post_v1_spectral_rating_backbone_v1`

Previous completed file:
`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-opening-facade-outdoor-indoor-oitc-spectral-rating-coverage-refresh-contract.test.ts`

## Purpose

The OITC runtime owner and coverage refresh proved that the calculator
can publish `OITC` through ASTM E1332 when an outdoor-indoor
transmission-loss curve has the required `one_third_octave_80_4000`
coverage. The implementation now has the right ingredients, but the
rating and band-basis ownership is split across `curve-rating.ts`,
`oitc-rating.ts`, impact rating helpers, and shared rating-adapter
metadata.

This support slice landed the reusable ingredients without opening new
runtime values by itself. It stays tight: centralize the
curve-rating/band-basis primitive around the just-landed OITC route and
the already-owned ISO/STC/impact curve procedures, then exit into the
route/input family first-class surface input-surface slice.

This is not a broad source crawl.

## Selection Card

User construction / formula family:
owned spectral or banded acoustic curves from opening/facade
outdoor-indoor, indoor opening, wall/ceiling airborne, and impact
routes.

Target outputs to open:
none in this support slice. It must preserve valid `Rw`, `STC`, `C`,
`Ctr`, `OITC`, `Ln,w`, `DeltaLw`, `IIC`, and `AIIC` derivation paths
for later value-moving owners, but it must not publish a new target
output by itself.

Route:
shared `ratingsFromOwnedCurve` style engine primitive backed by
route-owned curve evidence and shared adapter metadata.

Required physical inputs:

- owned input curve values;
- frequency band set or exact frequency coverage;
- rating standard / procedure, for example ISO 717-1, ASTM E413,
  ASTM E1332, or ASTM E989;
- context basis, such as element-lab, apparent field/building,
  outdoor-indoor facade, or impact level;
- source metric family and requested target outputs.

`needs_input` behavior:
missing required bands, missing curve values, or missing standard/basis
context must return precise `needs_input` or a blocked companion result
from the primitive. Do not silently omit required inputs and do not
fall back to a scalar source value.

`unsupported` boundaries:

- no `STC` or `Rw` to `OITC` alias;
- no `Ln,w` or `DeltaLw` to `IIC` / `AIIC` alias;
- no indoor partition rating reused as outdoor-indoor `OITC`;
- no ASTM E1332 value from `third_octave_100_3150` ISO-only coverage;
- no field/building copy from lab values without an owned adapter;
- no formula retune without same-family same-basis holdout evidence;
- no broad source import, confidence-label work, or frontend polish.

Landed counters:
`candidateCount: 6`,
`roiAnalysisIterations: 4`,
`newCalculableRequestShapes: 0`,
`newCalculableTargetOutputs: 0`,
`requiredPhysicalInputsCaptured: 0`,
`runtimeBasisPromotions: 0`,
`estimatedNextRuntimeValuesMoved: 0`,
`runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`,
`frontendImplementationFilesTouched: 0`,
`estimatedNextReusableRatingProceduresMoved: 3`,
`reusableRatingProceduresMoved: 3`, and
`unsupportedBoundariesProtected: 6`.

## Implementation Scope

Start files:

- `packages/shared/src/domain/rating-adapter.ts`
- `packages/shared/src/domain/rating.ts`
- `packages/engine/src/curve-rating.ts`
- `packages/engine/src/oitc-rating.ts`
- `packages/engine/src/impact-astm-e989.ts`
- `packages/engine/src/post-v1-opening-facade-outdoor-indoor-oitc-spectral-rating-owner.ts`
- `packages/engine/src/post-v1-spectral-rating-backbone-v1-contract.test.ts`

Actions:

- added a bounded engine primitive that accepts a route-owned
  curve plus rating/basis intent and returns only basis-valid companion
  ratings;
- centralized frequency coverage validation for outdoor-indoor OITC
  curves and ASTM E989 impact curves without turning one helper into a
  generic route solver;
- preserved ISO airborne curve rating math through the same
  `buildRatingsFromCurve` path;
- made the landed OITC owner consume the primitive while preserving its
  exact `OITC` value, `needs_input`, and alias-block behavior.

Implementation files touched:

- `packages/engine/src/rating-band-coverage.ts`
- `packages/engine/src/spectral-rating.ts`
- `packages/engine/src/oitc-rating.ts`
- `packages/engine/src/impact-astm-e989.ts`
- `packages/engine/src/post-v1-opening-facade-outdoor-indoor-oitc-spectral-rating-owner.ts`
- `packages/engine/src/post-v1-spectral-rating-backbone-v1-contract.test.ts`

Selected next:
`post_v1_route_input_family_first_class_surface_v1_plan`
/
`packages/engine/src/post-v1-route-input-family-first-class-surface-v1-contract.test.ts`
/
`docs/calculator/POST_V1_ROUTE_INPUT_FAMILY_FIRST_CLASS_SURFACE_V1_PLAN_2026-06-29.md`
/
`post-V1 route/input family first-class surface V1`.

This is not a broad source crawl.

Historical planned actions now satisfied:

- add or extract a bounded engine primitive that accepts a route-owned
  curve plus rating/basis intent and returns only basis-valid companion
  ratings;
- centralize frequency coverage validation for ISO airborne curves,
  outdoor-indoor OITC curves, and impact rating curves without turning
  one helper into a generic route solver;
- make the landed OITC owner consume the primitive while preserving its
  exact `OITC` value, `needs_input`, and alias-block behavior;
- prove existing ISO/STC curve rating behavior still uses the same
  rating math and does not gain invalid companions;
- keep shared rating-adapter metadata aligned with the primitive so
  future owners can ask the primitive what a route is allowed to derive.

Exit test:

- OITC still publishes through ASTM E1332 for complete outdoor-indoor
  `one_third_octave_80_4000` context;
- missing OITC bands still return `needs_input`;
- `Rw`, `STC`, `NISR`, `ISR`, indoor `DnT,w`, and source scalar OITC
  aliases remain blocked for OITC;
- existing ISO 717-1 / ASTM E413 curve ratings remain numerically
  stable;
- impact rating helpers remain basis-safe;
- the next selected action after this support slice is a value-moving,
  accuracy, input-surface, or boundary owner unless this slice exposes a
  concrete blocker.

## Drift Locks

Do not expand this into:

- a broad refactor of `calculate-assembly.ts`;
- a source-library import project;
- a confidence-label taxonomy;
- a UI or report polish pass;
- a generic “all ratings” framework detached from active calculator
  routes;
- a formula retune without admissible same-family same-basis evidence.

If the primitive cannot be extracted without a large route rewrite, stop
and document the blocker instead of broadening scope.
