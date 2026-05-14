# Gate BQ Coverage Matrix Refresh After Reinforced Concrete Cleanup Plan

Gate BQ lands the selected no-runtime matrix refresh after Gate BP.
It does not retune the reinforced-concrete combined upper/lower formula
and does not change any workbench input behavior. Its job is to make the
executable Personal-Use MVP coverage matrix reflect the Gate BO/BP
runtime, needs-input, exact-source, and basis-boundary posture.

## Landed Contract

Landed action:

`gate_bq_personal_use_mvp_coverage_matrix_refresh_after_reinforced_concrete_cleanup_plan`

Selection status:

`gate_bq_personal_use_mvp_coverage_matrix_refresh_after_reinforced_concrete_cleanup_landed_no_runtime_selected_floor_impact_astm_iic_aiic_adapter_gate_br`

Selected next action:

`gate_br_personal_use_mvp_floor_impact_astm_iic_aiic_adapter_contract_plan`

Selected next file:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-br-floor-impact-astm-iic-aiic-adapter-contract.test.ts`

## Matrix Refresh

Gate BQ replaces the old
`floor.reinforced_concrete_low_confidence_combined.cleanup_candidate`
coverage-gap row with eight reinforced-concrete rows:

- complete combined upper/lower formula support;
- visible-derived `needs_input` with airborne `Rw` / `Ctr` still visible
  and impact `Ln,w` / `DeltaLw` blocked on physical owner fields;
- incomplete explicit `needs_input`;
- exact-source precedence;
- bare heavy-floor existing corridor;
- upper-only floating-floor existing corridor;
- field/building non-alias boundary;
- ASTM `IIC` / `AIIC` unsupported boundary.

The refreshed matrix has 58 rows and zero calculation-grade
`coverage_gap` rows. Gate BP runtime values remain frozen at lab
`Ln,w 58.1` / `DeltaLw 13.7` through
`predictor_heavy_combined_upper_lower_floor_iso12354_annexc_estimate`
with `+/-6.5 dB` / `+/-5.5 dB` source-absent budgets.

## Next Step

Gate BQ ranks the floor-impact ASTM IIC/AIIC adapter contract ahead of
reopening reinforced concrete, narrow steel suspended-ceiling
companions, low-frequency field impact ownership, and broad source
crawling. Gate BR must be an ownership contract first: no `Ln,w` to
`IIC` alias, no lab-to-field shortcut, and no broad source crawl.
