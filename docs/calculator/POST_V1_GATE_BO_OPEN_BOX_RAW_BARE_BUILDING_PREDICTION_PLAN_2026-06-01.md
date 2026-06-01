# Post-V1 Gate BO Open-Box Raw-Bare Building Prediction Plan

Date: 2026-06-01

Authority: [CALCULATOR_SOURCE_OF_TRUTH.md](./CALCULATOR_SOURCE_OF_TRUTH.md)
and [USABLE_V1_EXECUTION_PLAN.md](./USABLE_V1_EXECUTION_PLAN.md).

## Goal

Gate BO is runtime calculator coverage. It opens building-context impact
outputs for raw-bare open-box timber carriers only after Gate BN proved
the source-absent field/building matrix was numerically admissible.

This improves calculator scope because a layer combination that already
had a lab raw-bare `Ln,w` anchor and field companion can now calculate
owned building-context impact outputs when the user supplies explicit
direct+flanking path inputs. It also preserves accuracy by blocking
simple `fieldKDb`, severe source-absent direct+flanking uplifts,
airborne floor-building outputs, lab-output relabelling, and ASTM
aliases.

Selected action:

`post_v1_floor_open_box_raw_bare_building_prediction_owner_gate_bo_plan`

Selected file:

`packages/engine/src/post-v1-floor-open-box-raw-bare-building-prediction-owner-gate-bo-contract.test.ts`

Selected candidate:

`floor.open_box_timber_raw_bare.building_prediction_owner_gap`

## Landed Action

Gate BO has now landed as:

`post_v1_floor_open_box_raw_bare_building_prediction_owner_gate_bo_plan`

Gate BO status:

`post_v1_floor_open_box_raw_bare_building_prediction_owner_gate_bo_landed_runtime_selected_next_numeric_coverage_gap_gate_bp`

Runtime pins:

- 220 mm raw-bare open-box carrier with explicit direct+flanking
  `impactFieldContext`: `L'n,w 92.9`, `L'nT,w 90.5`,
  `L'nT,50 93.9`.
- 370 mm raw-bare open-box carrier with explicit direct+flanking
  `impactFieldContext`: `L'n,w 90`, `L'nT,w 87.6`,
  `L'nT,50 90.7`.

Preserved boundaries:

- Simple `fieldKDb` without flanking paths remains unsupported for
  `contextMode=building_prediction`.
- Severe source-absent direct+flanking uplift remains blocked by the
  `12 dB` uplift guard.
- `R'w`, `DnT,w`, and lab `Ln,w` are not published as floor building
  impact outputs.
- ASTM `IIC` / `AIIC` remain unsupported without the ASTM band/contour
  owner route.

Selected next action:

`post_v1_next_numeric_coverage_gap_gate_bp_plan`

Selected next file:

`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-bp-contract.test.ts`

## Acceptance

Gate BO acceptance is executable in
`packages/engine/src/post-v1-floor-open-box-raw-bare-building-prediction-owner-gate-bo-contract.test.ts`.
The contract proves:

1. Gate BN selected the exact open-box raw-bare building owner gap.
2. The 220 mm and 370 mm raw-bare open-box carriers calculate only
   `L'n,w`, `L'nT,w`, and `L'nT,50` under explicit direct+flanking
   building context.
3. The field/building adapter carries source-absent error budgets and
   direct+flanking metric basis labels.
4. Simple-K transfer, severe uplift, `R'w`, `DnT,w`, lab `Ln,w`, and
   ASTM `IIC` / `AIIC` remain blocked.
5. Gate BM open-web building pins remain unchanged.

## Next

Gate BP must be a fresh numeric coverage/accuracy rerank. It should not
auto-follow surface/report work. The selected BP candidate must directly
increase calculator scope or numeric correctness for owned acoustic
outputs.

## Gate BP / BQ Closeout

Gate BP has now landed as:

`post_v1_next_numeric_coverage_gap_gate_bp_plan`

Gate BP status:

`post_v1_next_numeric_coverage_gap_gate_bp_landed_no_runtime_selected_floor_raw_bare_airborne_building_prediction_gate_bq`

Gate BP selected
`floor.raw_bare_floor_airborne_building_prediction_owner_gap` and
`post_v1_floor_raw_bare_airborne_building_prediction_gate_bq_plan` in
`packages/engine/src/post-v1-floor-raw-bare-airborne-building-prediction-gate-bq-contract.test.ts`.
The accuracy reason is explicit: raw-bare floor building airborne
outputs must not be published from generic screening when an owned
raw-bare direct `Rw` owner exists.

Gate BQ has now landed as:

`post_v1_floor_raw_bare_airborne_building_prediction_gate_bq_plan`

Gate BQ status:

`post_v1_floor_raw_bare_airborne_building_prediction_gate_bq_landed_runtime_selected_next_numeric_coverage_gap_gate_br`

Gate BQ now calculates raw-bare floor building airborne companions from
the direct raw-bare `Rw` owner: the 220 mm open-box case publishes
`R'w 36` and `DnT,w 39`, the 370 mm open-box case publishes `R'w 40`
and `DnT,w 43`, and the 300 mm open-web case publishes `R'w 30` and
`DnT,w 32`. ASTM `IIC` / `AIIC` remain unsupported without their own
ASTM owner route. Gate BQ selects
`post_v1_next_numeric_coverage_gap_gate_br_plan`.
