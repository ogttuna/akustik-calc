# Post-V1 Next Numeric Coverage Gap After A-Weighted Field/Building Plan - 2026-06-10

## North Star

DynEcho is an acoustic calculator. This rerank must select the next
bounded calculator improvement after the compatible anchor-delta
A-weighted field/building closeout. It must not select broad source
crawling, report polish, auth/storage, generic UI work, or another
closed lane.

## Previous Gate

Previous selected next action, now landed:

`post_v1_wall_compatible_anchor_delta_a_weighted_field_building_coverage_refresh_plan`

Previous file:

`packages/engine/src/post-v1-wall-compatible-anchor-delta-a-weighted-field-building-coverage-refresh-contract.test.ts`

Previous status:

`post_v1_wall_compatible_anchor_delta_a_weighted_field_building_coverage_refresh_landed_no_runtime_selected_next_numeric_coverage_gap_after_a_weighted_field_building`

The previous refresh froze the Knauf `416889` compatible anchor-delta
Gate I / Gate AR route through resolver registry, runtime adapter,
runtime surface, coverage matrix, and company-internal V0. Closed values
are paired field `Dn,A 49.5 / DnT,A 51.9`, one-side field
`Dn,A 48 / DnT,A 50.4`, paired building `DnT,A 51.9`, and one-side
building `DnT,A 50.4`. Building `Dn,A`, lab aliases, ASTM/IIC/AIIC,
missing-input, and non-`416889` rows remain outside the owner.

## Iteration 1 - Subtract Closed Lanes

Closed lanes must not be reselected:

- compatible anchor-delta direct `Rw`;
- compatible anchor-delta field/building `R'w`, `Dn,w`, and `DnT,w`;
- paired lab companion `STC`, `C`, and `Ctr`;
- one-side lab companion `STC`, `C`, and `Ctr`;
- compatible anchor-delta field `Dn,A` / `DnT,A`;
- compatible anchor-delta building `DnT,A`;
- A-weighted surface parity and coverage refresh.

This removes another surface, report, or coverage-only pass from the
immediate candidate set.

## Iteration 2 - Candidate Comparison

Highest current signal:

- `wall.compatible_anchor_delta.building_dn_a_owner`
- current values are already available but unsupported;
- paired building `Dn,A 49.5`;
- one-side building `Dn,A 48`;
- both use the same Knauf `416889` compatible anchor-delta direct curve,
  Gate AR building prediction basis, explicit room/flanking context, and
  ISO 717 C adapter term already used by the closed A-weighted route.

Lower-ranked alternatives:

- `wall.generic_non_knauf_a_weighted_building_formula_widening` needs
  owned non-Knauf A-weighted holdouts or same-family anchors before
  runtime can safely promote values.
- `wall.double_leaf_route_input_surface_residual_after_a_weighted_closeout`
  is useful but does not beat the same-route computed residual value.
- `wall.compatible_anchor_delta_a_weighted_budget_tightening_holdout`
  is accuracy work, but it needs same-basis measured A-weighted holdouts.
- `wall.compatible_anchor_delta_a_weighted_field_and_building_dnt_a_closed_lane`
  is already closed.
- `broad_source_crawl_or_report_ui_after_a_weighted_closeout` is not a
  calculator advancement.

## Iteration 3 - Selected Work Order

Selected candidate:

`wall.compatible_anchor_delta.building_dn_a_owner`

Selected next action:

`post_v1_wall_compatible_anchor_delta_building_dn_a_owner_plan`

Selected next file:

`packages/engine/src/post-v1-wall-compatible-anchor-delta-building-dn-a-owner-contract.test.ts`

Selected next label:

`post-V1 wall compatible anchor-delta building Dn,A owner`

Expected movement:

- new calculable request shapes: 2;
- runtime values moved: 2;
- paired building `Dn,A 49.5`;
- one-side building `Dn,A 48`.

Boundaries:

- Field `Dn,A` / `DnT,A` and building `DnT,A` stay on the already-landed
  A-weighted owner.
- Lab aliases stay unsupported on field/building routes.
- ASTM/IIC/AIIC stay unsupported.
- Missing `buildingPredictionOutputBasis` remains `needs_input`.
- Non-`416889` and non-Knauf rows need separate owners or holdouts.
- No source rows are imported now.
- No Gate I, Gate AR, or compatible anchor-delta curve retune is allowed
  in the selection step.

## Closeout Metadata

This rerank lands as:

`post_v1_next_numeric_coverage_gap_after_a_weighted_field_building_plan`

Contract:

`packages/engine/src/post-v1-next-numeric-coverage-gap-after-a-weighted-field-building-contract.test.ts`

Plan doc:

`docs/calculator/POST_V1_NEXT_NUMERIC_COVERAGE_GAP_AFTER_A_WEIGHTED_FIELD_BUILDING_PLAN_2026-06-10.md`

Status:

`post_v1_next_numeric_coverage_gap_after_a_weighted_field_building_landed_no_runtime_selected_compatible_anchor_delta_building_dn_a_owner`

Counters: `candidateCount: 6`, `roiAnalysisIterations: 3`,
`closedAWeightedRowsRechecked: 4`, `buildingDnAUnsupportedRowsRechecked: 2`,
`estimatedNextCalculableRequestShapes: 2`,
`estimatedNextRuntimeValuesMoved: 2`, `immediateRuntimeValuesMoved: 0`,
`runtimeBasisPromotions: 0`, `runtimeFormulaRetunes 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.

This is not a broad source crawl.
