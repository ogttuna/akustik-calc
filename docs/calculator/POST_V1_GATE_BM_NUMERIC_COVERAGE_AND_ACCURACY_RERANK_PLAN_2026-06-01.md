# Post-V1 Gate BM Numeric Coverage And Accuracy Rerank Plan

Date: 2026-06-01

## Goal

Continue calculator scope/accuracy work after Gate BL runtime. Do not
select source crawling, finite scenario packs, confidence wording, generic
UI, storage, or report polish.

Gate BM lands runtime coverage for:

`floor.raw_bare_open_web.building_prediction_impact_direct_flanking_runtime_gap`

## Landed Action

Gate BM has now landed as:

`post_v1_next_numeric_coverage_gap_gate_bm_plan`

Gate BM status:

`post_v1_next_numeric_coverage_gap_gate_bm_landed_runtime_selected_next_numeric_coverage_gap_gate_bn`

Selected next action:

`post_v1_next_numeric_coverage_gap_gate_bn_plan`

Selected next file:

`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-bn-contract.test.ts`

Active Gate BN plan:

[POST_V1_GATE_BN_NUMERIC_PLAUSIBILITY_AND_CALIBRATION_PLAN_2026-06-01.md](./POST_V1_GATE_BN_NUMERIC_PLAUSIBILITY_AND_CALIBRATION_PLAN_2026-06-01.md)

Gate BN is selected as an accuracy gate before opening another
source-absent building route. It must compare the current raw-bare,
lower-treatment, mixed-support, and exact/weighted impact continuation
values against external method constraints and implementation pins, then
land a contract that blocks source-absent field/building outliers such
as the corrected `L'n,w 112.1` case.

Gate BN has now landed as `post_v1_next_numeric_coverage_gap_gate_bn_plan`
with status
`post_v1_next_numeric_coverage_gap_gate_bn_landed_no_runtime_selected_floor_open_box_raw_bare_building_prediction_owner_gate_bo`.
The selected accuracy candidate is
`calculator.numeric_plausibility_and_calibration_sweep.source_absent_field_building_routes`.
Gate BN selects `floor.open_box_timber_raw_bare.building_prediction_owner_gap`
and `post_v1_floor_open_box_raw_bare_building_prediction_owner_gate_bo_plan`
in
`packages/engine/src/post-v1-floor-open-box-raw-bare-building-prediction-owner-gate-bo-contract.test.ts`.

## Runtime Movement

Raw-bare open-web steel floors with `contextMode=building_prediction`
now calculate impact-side building-context outputs only when the user
provides explicit direct+flanking impact owners:

- `impactFieldContext.directPathOffsetDb` or `impactFieldContext.fieldKDb`
- at least one `impactFieldContext.flankingPaths` entry
- `impactFieldContext.receivingRoomVolumeM3` for standardized outputs
- an owned raw-bare open-web lab `Ln,w` anchor

Pinned complete case:

- carrier: `open_web_raw_bare_300`
- lab anchor: `Ln,w 96`, `CI,50-2500 5.2`
- direct path offset: `1 dB`
- flanking path level offset: `-6 dB`
- receiving room volume: `55 m3`
- calculated outputs: `L'n,w 97.8`, `L'nT,w 95.4`, `L'nT,50 100.6`

This is not a field-K alias and not an airborne building shortcut.
Simple `fieldKDb` + room volume remains blocked for
`building_prediction`.

Gate BM was corrected after plausibility review: the earlier synthetic
`+8 dB` flanking offset plus automatic `+8 dB` path modifier produced
`L'n,w 112.1`, which is mathematically consistent with those inputs but
not acceptable as the normal runtime acceptance pin for a source-absent
single-number estimate. Source-absent direct+flanking estimates that
uplift the lab `Ln,w` anchor by more than `12 dB` now stay blocked until
exact impact-band or path-specific evidence exists.

## Boundaries

- `R'w`, `DnT,w`, and lab `Ln,w` are not published as floor building
  outputs by this gate.
- Open-box raw-bare building prediction remains blocked until its own
  carrier-family direct+flanking owner is selected.
- ASTM `IIC` / `AIIC` remain unsupported without E492/E1007/E989 owner
  inputs.
- Broad source crawling, finite scenario packs, low-confidence wording,
  and generic UI/report/storage work remain non-goals.

## Ranked Follow-Ups

1. `calculator.numeric_plausibility_and_calibration_sweep.source_absent_field_building_routes`
2. `floor.open_box_timber_raw_bare.building_prediction_owner_gap`
3. `floor.raw_bare_impact.astm_iic_aiic_rating_curve_owner_gap`
4. `floor.open_box_timber_raw_bare.package_transfer_residual_accuracy_gap`
5. `floor.raw_bare_floor_airborne_building_prediction_owner_gap`

Gate BN must implement the plausibility/calibration sweep first. After
that, it must rerank later runtime slices by direct scope/accuracy ROI
and select only an executable calculator slice.
