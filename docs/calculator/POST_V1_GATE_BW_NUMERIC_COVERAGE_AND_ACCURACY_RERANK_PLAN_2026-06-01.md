# Post-V1 Gate BW Numeric Coverage And Accuracy Rerank Plan

Date: 2026-06-01

Authority: [CALCULATOR_SOURCE_OF_TRUTH.md](./CALCULATOR_SOURCE_OF_TRUTH.md)
and [USABLE_V1_EXECUTION_PLAN.md](./USABLE_V1_EXECUTION_PLAN.md).

## Goal

Gate BW is a no-runtime calculator-capability rerank after Gate BV. It
selects the next implementation only by scope and correctness. The
selected slice must either calculate more owned acoustic outputs for
valid layer combinations, or correct a live wrong-number route while
preserving `needs_input` and `unsupported` boundaries.

## Selection

Gate BW has now landed as:

`post_v1_next_numeric_coverage_gap_gate_bw_plan`

Gate BW status:

`post_v1_next_numeric_coverage_gap_gate_bw_landed_no_runtime_selected_floor_open_box_finished_package_lab_metric_projection_gate_bx`

Selected candidate:

`floor.open_box_timber_finished_package.lab_metric_projection_gap`

Selected next action:

`post_v1_floor_open_box_finished_package_lab_metric_projection_gate_bx_plan`

Selected next file:

`packages/engine/src/post-v1-floor-open-box-finished-package-lab-metric-projection-gate-bx-contract.test.ts`

## Why This Is The Highest-ROI Next Step

Gate BV fixed finished open-box package lab/building mixed ownership,
but a separate mixed lab-impact path still had a visible wrong-number
projection: requests could mark `Rw` / `C` supported while
`metrics.estimatedRwDb` and `metrics.estimatedCDb` still came from the
generic dynamic airborne curve.

The owned package values are already present:

- dry package-transfer: `Rw 66 / C -3.9`;
- EPS/screed hybrid: `Rw 72 / C -1.3`.

Gate BX must project those owned package lab metrics into mixed
lab-impact and lab-field-impact requests without changing impact pins.
This improves numeric correctness for an already valid layer
combination and needs no new source rows.

## Rejected Alternatives

- `floor.open_box_timber_raw_bare.package_transfer_residual_accuracy_gap`
  remains useful accuracy work, but it is lower immediate ROI than a
  live wrong-number fix for already-supported finished-package outputs.
- `floor.raw_bare_impact.astm_iic_aiic_rating_curve_owner_gap` remains
  important, but ASTM `IIC` / `AIIC` require complete ASTM E492/E1007
  band-curve ownership; ISO `Ln,w` / `CI` single numbers must not be
  aliased into ASTM ratings.
- broad source crawling, finite scenario packs, confidence wording, and
  generic UI/report/storage work remain non-goals for the active
  calculator slice.

## Gate BX Acceptance

Gate BX must prove:

1. Dry package-transfer mixed lab-impact requests publish visible
   package `Rw 66 / C -3.9`, not generic dynamic `Rw/C`.
2. EPS/screed hybrid mixed lab-field-impact requests publish visible
   package `Rw 72 / C -1.3`, while field impact pins stay
   `L'n,w 49 / L'nT,w 46.6 / L'nT,50 47.6`.
3. Impact lab pins stay owned by the package impact lane:
   dry `Ln,w 50.8 / CI 1.2 / CI,50-2500 3.3 / Ln,w+CI 52`.
4. `Ctr` remains unsupported because these package owners declare
   `Rw+C`, not a true `Ctr`.

## Gate BX Closeout

Gate BX has now landed:

`post_v1_floor_open_box_finished_package_lab_metric_projection_gate_bx_plan`

Gate BX status:

`post_v1_floor_open_box_finished_package_lab_metric_projection_gate_bx_landed_selected_next_numeric_coverage_gap_gate_by`

Gate BX is runtime calculator correctness work. Finished open-box
package mixed lab-impact and lab-field-impact requests now project the
owned package lab values into visible metrics: dry package-transfer
publishes `Rw 66 / C -3.9`, and EPS/screed hybrid publishes
`Rw 72 / C -1.3`. Existing impact outputs are unchanged, and `Ctr`
remains unsupported because the package companion is `Rw+C`, not true
`Ctr`.

Gate BX selected next action:

`post_v1_next_numeric_coverage_gap_gate_by_plan`
