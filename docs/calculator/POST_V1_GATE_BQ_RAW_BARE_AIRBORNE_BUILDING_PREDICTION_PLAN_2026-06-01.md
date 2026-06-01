# Post-V1 Gate BQ Raw-Bare Airborne Building Prediction Plan

Date: 2026-06-01

Authority: [CALCULATOR_SOURCE_OF_TRUTH.md](./CALCULATOR_SOURCE_OF_TRUTH.md)
and [USABLE_V1_EXECUTION_PLAN.md](./USABLE_V1_EXECUTION_PLAN.md).

## Goal

Gate BQ is runtime calculator coverage and accuracy work. It opens
building airborne outputs for raw-bare open-box and open-web floor
stacks only when the request has complete building-prediction context
and an owned raw-bare direct `Rw` result.

The important accuracy rule is that these outputs must not come from the
generic screening airborne curve. The runtime adapter seeds the
building-prediction curve from the raw-bare floor direct `Rw` owner, then
applies the same flanking and room-normalization path used for building
airborne outputs.

Selected action:

`post_v1_floor_raw_bare_airborne_building_prediction_gate_bq_plan`

Selected candidate:

`floor.raw_bare_floor_airborne_building_prediction_owner_gap`

Runtime basis:

`post_v1_floor_raw_bare_airborne_building_prediction_runtime_adapter`

## Landed Action

Gate BQ has now landed as:

`post_v1_floor_raw_bare_airborne_building_prediction_gate_bq_plan`

Gate BQ status:

`post_v1_floor_raw_bare_airborne_building_prediction_gate_bq_landed_runtime_selected_next_numeric_coverage_gap_gate_br`

Runtime pins:

- 220 mm raw-bare open-box: direct `Rw 38.1`, `R'w 36`,
  `Dn,w 36`, `Dn,A 35`, `DnT,w 39`, and `DnT,A 37.4`.
- 370 mm raw-bare open-box: direct `Rw 42.3`, `R'w 40`,
  `Dn,w 41`, `Dn,A 39.8`, `DnT,w 43`, and `DnT,A 42.2`.
- 300 mm raw-bare open-web: direct `Rw 32`, `R'w 30`,
  `Dn,w 30`, `Dn,A 28.9`, `DnT,w 32`, and `DnT,A 31.3`.

Mixed building requests keep the Gate BO impact outputs live while
publishing the new airborne building companions. Lab `Ln,w` remains a
separate lab impact output, and ASTM `IIC` / `AIIC` remain unsupported
unless their own ASTM band/contour owner exists.

Selected next action:

`post_v1_next_numeric_coverage_gap_gate_br_plan`

Selected next file:

`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-br-contract.test.ts`

Gate BR has now landed as:

`post_v1_next_numeric_coverage_gap_gate_br_plan`

Gate BR status:

`post_v1_next_numeric_coverage_gap_gate_br_landed_no_runtime_selected_floor_open_box_eps_screed_field_companion_gate_bs`

Gate BR selected:

`floor.open_box_timber_eps_screed_hybrid.field_companion_runtime_gap`

Gate BR selected next action:

`post_v1_floor_open_box_eps_screed_field_companion_gate_bs_plan`

Gate BS must open `L'n,w`, `L'nT,w`, and `L'nT,50` for the complete
open-box timber EPS/screed hybrid package with explicit
`impactFieldContext`, using the owned lab anchor while `R'w`, `DnT,w`,
and ASTM `IIC` / `AIIC` remain separate owners.

## Acceptance

The Gate BQ contract proves that:

1. Complete building-prediction requests calculate `R'w`, `Dn,w`,
   `Dn,A`, `DnT,w`, and `DnT,A` from the raw-bare direct `Rw` owner.
2. The 220 mm open-box pin publishes `R'w 36` and `DnT,w 39`, replacing
   the incorrect generic screening path for building airborne outputs.
3. Mixed airborne+impact requests keep `L'n,w`, `L'nT,w`, and
   `L'nT,50` live while leaving `Ln,w`, `IIC`, and `AIIC` separate.
4. Incomplete building contexts fail closed instead of publishing a
   generic screening `R'w` or `DnT,w`.
