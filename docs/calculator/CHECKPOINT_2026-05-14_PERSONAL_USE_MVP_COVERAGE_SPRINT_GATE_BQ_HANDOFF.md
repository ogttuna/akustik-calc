# Gate BQ Handoff

Gate BQ has landed:

`gate_bq_personal_use_mvp_coverage_matrix_refresh_after_reinforced_concrete_cleanup_plan`

Selection status:

`gate_bq_personal_use_mvp_coverage_matrix_refresh_after_reinforced_concrete_cleanup_landed_no_runtime_selected_floor_impact_astm_iic_aiic_adapter_gate_br`

Selected next action:

`gate_br_personal_use_mvp_floor_impact_astm_iic_aiic_adapter_contract_plan`

Selected next file:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-br-floor-impact-astm-iic-aiic-adapter-contract.test.ts`

Next plain label: floor-impact ASTM IIC/AIIC adapter contract.

## What Changed

Gate BQ is a no-runtime matrix refresh. It removes the stale
reinforced-concrete low-confidence cleanup candidate row and adds eight
executable rows covering:

- complete combined upper/lower formula support at lab `Ln,w 58.1` /
  `DeltaLw 13.7`;
- visible-derived and explicit partial `needs_input` cases with named
  physical blockers;
- exact source precedence;
- bare heavy-floor and upper-only floating-floor adjacent corridors;
- field/building non-alias posture;
- ASTM `IIC` / `AIIC` unsupported posture.

The Gate BO/BP formula basis remains
`predictor_heavy_combined_upper_lower_floor_iso12354_annexc_estimate`.
Source-absent budgets remain `+/-6.5 dB` for `Ln,w` and `+/-5.5 dB` for
`DeltaLw`. The refreshed Personal-Use MVP matrix now has 58 rows and no
remaining calculation-grade `coverage_gap` row.

## Next Step

Gate BR should define the floor-impact ASTM IIC/AIIC adapter ownership
contract. It should keep ISO `Ln,w` / `DeltaLw`, ASTM `IIC` / `AIIC`,
field apparent metrics, and building-prediction metrics basis-separated
until a dedicated adapter owns conversion terms, tolerance, and visible
negative boundaries.
