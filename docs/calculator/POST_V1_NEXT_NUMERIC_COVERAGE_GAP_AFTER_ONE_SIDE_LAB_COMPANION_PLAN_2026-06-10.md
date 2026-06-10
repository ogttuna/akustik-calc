# Post-V1 Next Numeric Coverage Gap After One-Side Lab Companion Plan

Date: 2026-06-10

Action:
`post_v1_next_numeric_coverage_gap_after_one_side_lab_companion_plan`

Status:
`post_v1_next_numeric_coverage_gap_after_one_side_lab_companion_landed_no_runtime_selected_compatible_anchor_delta_a_weighted_owner`

Plan doc:
`docs/calculator/POST_V1_NEXT_NUMERIC_COVERAGE_GAP_AFTER_ONE_SIDE_LAB_COMPANION_PLAN_2026-06-10.md`

Contract:
`packages/engine/src/post-v1-next-numeric-coverage-gap-after-one-side-lab-companion-contract.test.ts`

Selected next action:
`post_v1_wall_compatible_anchor_delta_a_weighted_field_building_adapter_owner_plan`

Selected next file:
`packages/engine/src/post-v1-wall-compatible-anchor-delta-a-weighted-field-building-adapter-owner-contract.test.ts`

Selected next label:
`post-V1 wall compatible anchor-delta A-weighted field/building adapter owner`

Selected candidate:
`wall.compatible_anchor_delta.a_weighted_field_building_adapter_owner`

## Purpose

This is a short no-runtime numeric coverage rerank after the compatible
anchor-delta one-side lab companion closeout. It keeps the product
focused on calculator capability, not source cataloging or UI/process
work. The selected follow-up should move real acoustic outputs for real
layer stacks, while preserving exact measured/source precedence and
route-specific boundaries.

The prior coverage refresh closed:
`post_v1_wall_compatible_anchor_delta_one_side_lab_metric_companion_coverage_refresh_plan`
in
`packages/engine/src/post-v1-wall-compatible-anchor-delta-one-side-lab-metric-companion-coverage-refresh-contract.test.ts`
with status
`post_v1_wall_compatible_anchor_delta_one_side_lab_metric_companion_coverage_refresh_landed_no_runtime_selected_next_numeric_coverage_gap_after_one_side_lab_companion`.

## Iteration 1 - Current Subtraction

Closed as live or boundary-pinned:

- exact measured/source precedence;
- compatible anchor-delta direct `Rw` for Knauf LSF one-side and paired
  exterior-board deltas;
- compatible anchor-delta `field_between_rooms` and
  `building_prediction` base values `R'w`, `Dn,w`, and `DnT,w`;
- paired lab companions `Rw 59 / STC 59 / C -1.1 / Ctr -6`;
- one-side lab companions `Rw 57 / STC 57 / C -0.6 / Ctr -5.5`;
- single `Rw`, STC-only, field/building lab aliases, ASTM, A-weighted,
  and non-Knauf boundary rows as explicitly pinned in the recent owner,
  surface, and coverage contracts.

Therefore the next work must not reopen the one-side Knauf LSF lab
companion, repeat surface parity, or start a broad source crawl.

Counters: `closedCompatibleAnchorDeltaRowsRechecked: 4`,
`immediateRuntimeValuesMoved: 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`.

## Iteration 2 - Candidate Comparison

Candidate 1, selected:
`wall.compatible_anchor_delta.a_weighted_field_building_adapter_owner`.

- Type: route metric owner / runtime candidate.
- Target outputs: `Dn,A` and `DnT,A`.
- Required inputs: exact reduced-stack `Rw` source row, compatible
  exterior-board delta, one-side compatible exterior-board delta,
  same-route Gate I / Gate AR field/building base values, calculated
  `C` adapter term, field RT60 / room context, and building prediction
  output basis.
- Current implementation already computes but withholds the A-weighted
  values: paired field/building has `Dn,A 49.5 / DnT,A 51.9`; one-side
  field/building has `Dn,A 48 / DnT,A 50.4`.
- Selected because the follow-up can expose six new same-route outputs
  without source import or formula retune.

Candidate 2, not selected:
`wall.generic_non_knauf_one_side_lab_companion_formula_widening`.

- Type: formula-scope candidate.
- It is useful later, but non-Knauf one-side rows need an owned anchor,
  material family, and holdout/evidence boundary before they can share
  the Knauf compatible anchor-delta companion.

Candidate 3, not selected:
`wall.double_leaf_role_input_surface_residual_after_anchor_delta`.

- Type: route-input candidate.
- Still relevant, but lower ROI here because the current web surface
  already carries the compatible anchor-delta field/building inputs.

Candidate 4, not selected:
`wall.compatible_anchor_delta_lab_companion_budget_tightening_holdout`.

- Type: accuracy / holdout candidate.
- Blocked until same-basis measured `STC`, `C`, `Ctr`, or A-weighted
  holdouts exist for the paired and one-side Knauf variants.

Candidate 5, not selected:
`wall.compatible_anchor_delta_one_side_lab_companion_closed_lane`.

- Closed by owner, surface parity, and coverage refresh. Reselecting it
  would be no calculator progress.

Candidate 6, rejected:
`broad_source_crawl_or_report_ui_after_anchor_delta`.

- Not a broad source crawl, report polish, auth/storage, confidence copy,
  or generic UI task. Those do not improve calculator scope or accuracy
  for this slice.

Counters: `candidateCount: 6`, `roiAnalysisIterations: 3`,
`formulaScopeCandidatesEvaluated: 1`, `routeInputCandidatesEvaluated: 1`,
`accuracyHoldoutCandidatesEvaluated: 1`, `estimatedNextRuntimeValuesMoved: 6`,
`runtimeBasisPromotions: 0`, `runtimeFormulaRetunes: 0`, and
`sourceRowsImported: 0`.

## Iteration 3 - Work Order

Implement:
`packages/engine/src/post-v1-wall-compatible-anchor-delta-a-weighted-field-building-adapter-owner-contract.test.ts`

The owner/runtime contract should:

- promote compatible anchor-delta field `Dn,A` and `DnT,A` for paired and
  one-side exterior-board Knauf LSF stacks;
- promote compatible anchor-delta building `DnT,A` for paired and
  one-side exterior-board Knauf LSF stacks;
- keep building `Dn,A` blocked unless the contract proves the route owns
  that metric basis;
- preserve direct single `Rw` on
  `wall.compatible_anchor_delta.extra_board_on_verified_lsf`;
- preserve lab `STC`, `C`, and `Ctr` on
  `wall.compatible_anchor_delta.calculated_lab_companions`;
- keep STC-only, field/building lab aliases, ASTM/IIC/AIIC, and
  non-Knauf rows outside the A-weighted owner;
- expose candidate traces, required inputs, assumptions, warnings, and
  value pins without claiming measured A-weighted evidence.

Expected follow-up movement:

- `estimatedNextCalculableRequestShapes: 4`;
- `estimatedNextRuntimeValuesMoved: 6`;
- `sourceRowsImported: 0`;
- `frontendImplementationFilesTouched: 0` unless the engine owner proves
  a web surface acceptance gap after runtime lands.
