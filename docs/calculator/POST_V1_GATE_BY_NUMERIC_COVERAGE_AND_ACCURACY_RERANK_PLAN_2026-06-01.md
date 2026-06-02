# Post-V1 Gate BY Numeric Coverage And Accuracy Rerank Plan

Date: 2026-06-01

Authority: [CALCULATOR_SOURCE_OF_TRUTH.md](./CALCULATOR_SOURCE_OF_TRUTH.md)
and [USABLE_V1_EXECUTION_PLAN.md](./USABLE_V1_EXECUTION_PLAN.md).

## Goal

Gate BY is a no-runtime selection gate. It re-ranks the next calculator
slice after Gate BX and selects only work that increases acoustic
calculator scope or correctness.

This is not source crawling, finite scenario packing, report polish, or
confidence wording. The selected next action must make more requested
`Rw`, `R'w`, `DnT,w`, `Ln,w`, `L'n,w`, `L'nT,w`, or related outputs
calculate for a physically valid layer combination when the required
inputs are present, or it must prevent a wrong metric/basis route.

## Landed Selection

Gate BY has now landed:

`post_v1_next_numeric_coverage_gap_gate_by_plan`

Gate BY status:

`post_v1_next_numeric_coverage_gap_gate_by_landed_no_runtime_selected_floor_open_box_finished_package_full_mixed_building_impact_gate_bz`

Selected candidate:

`floor.open_box_timber_finished_package.full_mixed_building_impact_gap`

Selected next action:

`post_v1_floor_open_box_finished_package_full_mixed_building_impact_gate_bz_plan`

Selected next file:

`packages/engine/src/post-v1-floor-open-box-finished-package-full-mixed-building-impact-gate-bz-contract.test.ts`

## Gate BZ Closeout

Gate BZ has now landed:

`post_v1_floor_open_box_finished_package_full_mixed_building_impact_gate_bz_plan`

Gate BZ status:

`post_v1_floor_open_box_finished_package_full_mixed_building_impact_gate_bz_landed_selected_next_numeric_coverage_gap_gate_ca`

Gate BZ selected next action:

`post_v1_next_numeric_coverage_gap_gate_ca_plan`

## Why This Was Selected

The professional prediction-tool bar, using INSUL only as a reference
point, is that one construction request can return the owned airborne
and impact outputs it can defend. After Gate BX, finished open-box
package lanes already owned the separate lab, building, and impact
answers. The remaining gap was that a complete full mixed
building-plus-impact request could calculate impact values internally
but still leave their requested outputs unsupported after the
building-prediction parking step.

The selected Gate BZ therefore has high ROI:

- it opens already-computed impact outputs in a complete mixed
  building/impact request;
- it does not require new source rows;
- it does not invent a new formula;
- it keeps `Ctr`, `IIC`, and `AIIC` closed because those need separate
  metric owners.

Expected Gate BZ pins:

- dry package-transfer full mixed request keeps `Rw 66 / C -3.9`,
  `R'w 64 / DnT,w 67`, and opens `L'n,w 52.8 / L'nT,w 50.4 / L'nT,50 53.7`
  plus lab impact companions;
- EPS/screed hybrid full mixed request keeps `Rw 72 / C -1.3`,
  `R'w 70 / DnT,w 73`, and opens
  `Ln,w 47 / CI 0 / CI,50-2500 1 / Ln,w+CI 47`;
- EPS/screed field impact outputs stay unsupported in that combined
  building request unless a field impact value is actually computed.

## Non-Selected Work

The rerank keeps these out of the active implementation slice:

- `broad_source_row_crawl`;
- `finite_scenario_pack`;
- `confidence_wording_or_low_confidence_surface`;
- `generic_ui_or_report_storage_work`.

ASTM `IIC` / `AIIC` remains important, but it was not selected here
because ISO `Ln,w` / `CI` single-number routes must not be aliased into
ASTM contour ratings without a complete ASTM metric-basis owner.
