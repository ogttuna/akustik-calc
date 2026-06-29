# Post-V1 Runtime-First Route-Family Rerank After Ceiling Roof/Suspended-Ceiling Route Split Boundary Coverage Refresh - 2026-06-29

Status:
`post_v1_runtime_first_route_family_rerank_after_ceiling_roof_suspended_ceiling_route_split_boundary_coverage_refresh_landed_no_runtime_selected_opening_facade_outdoor_indoor_oitc_spectral_rating_owner`

Rerank action:
`post_v1_runtime_first_route_family_rerank_after_ceiling_roof_suspended_ceiling_route_split_boundary_coverage_refresh_plan`

Planning status:
selected next by
`post_v1_ceiling_roof_suspended_ceiling_route_split_boundary_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank_after_ceiling_roof_suspended_ceiling_route_split_boundary_coverage_refresh`.

Expected rerank file:
`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-ceiling-roof-suspended-ceiling-route-split-boundary-coverage-refresh-contract.test.ts`

Selected next label:
`post-V1 runtime-first route-family rerank after ceiling roof/suspended-ceiling route split boundary coverage refresh`

Selected candidate:
`opening.facade_outdoor_indoor_oitc_spectral_rating_owner`

Selected next action:
`post_v1_opening_facade_outdoor_indoor_oitc_spectral_rating_owner_plan`

Selected next file:
`packages/engine/src/post-v1-opening-facade-outdoor-indoor-oitc-spectral-rating-owner-contract.test.ts`

Selected next plan:
`docs/calculator/POST_V1_OPENING_FACADE_OUTDOOR_INDOOR_OITC_SPECTRAL_RATING_OWNER_PLAN_2026-06-29.md`

Selected next owner label:
`post-V1 opening/facade outdoor-indoor OITC spectral rating owner`

Plan file:
`docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_CEILING_ROOF_SUSPENDED_CEILING_ROUTE_SPLIT_BOUNDARY_COVERAGE_REFRESH_PLAN_2026-06-29.md`

Previous coverage refresh:
`post_v1_ceiling_roof_suspended_ceiling_route_split_boundary_coverage_refresh_plan`
/
`packages/engine/src/post-v1-ceiling-roof-suspended-ceiling-route-split-boundary-coverage-refresh-contract.test.ts`
/
`docs/calculator/POST_V1_CEILING_ROOF_SUSPENDED_CEILING_ROUTE_SPLIT_BOUNDARY_COVERAGE_REFRESH_PLAN_2026-06-29.md`
/
`post_v1_ceiling_roof_suspended_ceiling_route_split_boundary_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank_after_ceiling_roof_suspended_ceiling_route_split_boundary_coverage_refresh`.

Previous owner:
`post_v1_ceiling_roof_suspended_ceiling_route_split_boundary_owner_plan`
/
`packages/engine/src/post-v1-ceiling-roof-suspended-ceiling-route-split-boundary-owner-contract.test.ts`
/
`docs/calculator/POST_V1_CEILING_ROOF_SUSPENDED_CEILING_ROUTE_SPLIT_BOUNDARY_OWNER_PLAN_2026-06-29.md`
/
`post_v1_ceiling_roof_suspended_ceiling_route_split_boundary_owner_landed_input_boundary_selected_coverage_refresh`.

This is not a broad source crawl.

Protected coverage summary:
the previous refresh re-probed selected candidate
`ceiling.roof_suspended_ceiling_route_split_boundary_owner`; ambiguous
roof/ceiling/suspended-ceiling plenum stacks remain on
`post_v1_ceiling_roof_suspended_ceiling_route_split_boundary_missing_route_context`;
explicit roof/facade, ceiling-airborne impact, and lower-treatment
airborne aliases remain on
`post_v1_ceiling_roof_suspended_ceiling_route_split_boundary_unsupported_route_family`;
explicit ceiling-airborne plenum field/building values remain pinned at
`R'w 47`, `Dn,w 44.9`, `Dn,A 43.2`, `DnT,w 45.7`,
`DnT,A 44`, and `DnT,A,k 41.1`. Coverage counters:
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

## Purpose

Select the next runtime-first calculator owner after the
ceiling/roof/suspended-ceiling route split boundary has been protected.
The rerank must prefer the highest-ROI behavior that increases
calculation scope, target-output support, required physical input
capture, metric/basis integrity, or bounded accuracy without replacing
the calculator with a catalog or confidence-label workflow.

## Candidate Frame

The rerank starts from the current opening sequence drift lock:

- floor impact `IIC`/`AIIC` runtime/rating procedure ownership;
- opening/facade outdoor-indoor `OITC` spectral rating ownership;
- ceiling multileaf/plenum same-family accuracy calibration when
  admissible same-basis evidence is already bounded;
- any closer runtime/input-boundary candidate that the current gate
  proves has higher calculator ROI.

Reject candidates that require broad source crawling, copy lab values
into field/building outputs, alias ISO impact values into ASTM
`IIC`/`AIIC`, alias `STC`/`Rw` into `OITC`, or reopen the just-landed
ceiling route split boundary as a support loop.

## Selection Card Requirements

The rerank contract must record, for the selected candidate:

- user construction / formula family;
- target outputs to open;
- formula, measured-row, anchor, or adapter route;
- required physical inputs;
- `needs_input` behavior for missing inputs;
- `unsupported` boundaries that remain blocked;
- expected `newCalculableRequestShapes`,
  `newCalculableTargetOutputs`,
  `estimatedNextRequiredPhysicalInputsCaptured`,
  `estimatedNextRuntimeBasisPromotions`, and
  `estimatedNextRuntimeValuesMoved`.

## Expected Counters

This rerank itself should move no runtime values:
`runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`.

The selected next owner must be runtime-first or input-boundary-first
only if the input boundary directly protects metric/basis integrity
needed before runtime movement. Do not select another no-runtime
coverage refresh as the end state.

## Landed Result

This no-runtime rerank selected
`opening.facade_outdoor_indoor_oitc_spectral_rating_owner`.

Rationale:
the ceiling/roof/suspended-ceiling route split boundary is now landed
and protected. Current source-of-truth sections also record that ASTM
`IIC` / `AIIC` exact-band runtime and user/import input surfaces are
already landed: lab `ASTM E492 / ASTM E989` exact bands calculate owned
`IIC`, and field `ASTM E1007 / ASTM E989` exact bands calculate owned
`AIIC`. Re-selecting floor ASTM exact-band ownership would therefore be
a stale repeat. The remaining high-ROI market-facing target output is
`OITC`, which is requestable but still unsupported for complete
outdoor-indoor facade spectral requests until a spectral rating adapter
owns the calculation.

Selected next:
`post_v1_opening_facade_outdoor_indoor_oitc_spectral_rating_owner_plan`
/
`packages/engine/src/post-v1-opening-facade-outdoor-indoor-oitc-spectral-rating-owner-contract.test.ts`
/
`docs/calculator/POST_V1_OPENING_FACADE_OUTDOOR_INDOOR_OITC_SPECTRAL_RATING_OWNER_PLAN_2026-06-29.md`
/
`post-V1 opening/facade outdoor-indoor OITC spectral rating owner`.

Counters: `candidateCount: 8`, `roiAnalysisIterations: 4`,
`estimatedNextCalculableRequestShapes: 1`,
`estimatedNextCalculableTargetOutputs: 1`,
`estimatedNextRequiredPhysicalInputsCaptured: 4`,
`estimatedNextRuntimeBasisPromotions: 1`,
`estimatedNextRuntimeValuesMoved: 1`,
`estimatedNextUnsupportedBoundariesProtected: 7`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.
This is not a broad source crawl.
