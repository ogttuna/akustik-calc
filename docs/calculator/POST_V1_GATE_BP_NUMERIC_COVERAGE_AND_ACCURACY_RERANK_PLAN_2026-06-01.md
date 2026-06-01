# Post-V1 Gate BP Numeric Coverage And Accuracy Rerank Plan

Date: 2026-06-01

Authority: [CALCULATOR_SOURCE_OF_TRUTH.md](./CALCULATOR_SOURCE_OF_TRUTH.md)
and [USABLE_V1_EXECUTION_PLAN.md](./USABLE_V1_EXECUTION_PLAN.md).

## Goal

Gate BP is a no-runtime rerank after Gate BO. It exists to prevent the
next slice from drifting into docs-only, source-crawl, confidence wording,
or generic UI work.

The selected gap is:

`floor.raw_bare_floor_airborne_building_prediction_owner_gap`

This is calculator scope and accuracy work. Gate BO opened raw-bare
open-box building impact outputs, but building airborne outputs (`R'w`,
`Dn,w`, `Dn,A`, `DnT,w`, `DnT,A`) still needed an owned runtime path.
Using the generic screening airborne curve for those values would be too
optimistic for raw-bare timber/open-web floors. Gate BQ must therefore
bind building airborne outputs to the same raw-bare direct `Rw` owner
before building flanking and room normalization.

## Landed Action

Gate BP has now landed as:

`post_v1_next_numeric_coverage_gap_gate_bp_plan`

Gate BP status:

`post_v1_next_numeric_coverage_gap_gate_bp_landed_no_runtime_selected_floor_raw_bare_airborne_building_prediction_gate_bq`

Selected next action:

`post_v1_floor_raw_bare_airborne_building_prediction_gate_bq_plan`

Selected next file:

`packages/engine/src/post-v1-floor-raw-bare-airborne-building-prediction-gate-bq-contract.test.ts`

## Acceptance

The Gate BP contract proves that:

1. `floor.raw_bare_floor_airborne_building_prediction_owner_gap` ranks
   ahead of package-transfer residuals, ASTM contour work, broad source
   crawl, finite scenario packs, low-confidence wording, and generic UI
   work.
2. The selected target metrics are `R'w`, `Dn,w`, `Dn,A`, `DnT,w`, and
   `DnT,A`.
3. The reason is both coverage and correctness: the calculator must
   answer more building airborne requests, and must not publish generic
   screening values as if they were raw-bare floor building predictions.

## Gate BQ Closeout

Gate BQ has now landed as:

`post_v1_floor_raw_bare_airborne_building_prediction_gate_bq_plan`

Gate BQ status:

`post_v1_floor_raw_bare_airborne_building_prediction_gate_bq_landed_runtime_selected_next_numeric_coverage_gap_gate_br`

The 220 mm raw-bare open-box building airborne case now publishes
`R'w 36` and `DnT,w 39` from the owned direct raw-bare `Rw` path instead
of generic screening. Thicker open-box and open-web raw-bare carriers
use the same owner rule. ASTM `IIC` / `AIIC` remain unsupported without
their own ASTM owner route.

Selected next action:

`post_v1_next_numeric_coverage_gap_gate_br_plan`
