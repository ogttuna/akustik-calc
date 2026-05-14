# Gate BR Floor-Impact ASTM IIC/AIIC Adapter Contract Plan

Gate BR lands the selected ASTM impact-rating ownership contract after
Gate BQ. It is no-runtime: current ISO `Ln,w` / `DeltaLw`, field
`L'n,w` / `L'nT,w`, and building-prediction impact values remain
basis-separated and do not produce `IIC` or `AIIC`.

## Landed Contract

Landed action:

`gate_br_personal_use_mvp_floor_impact_astm_iic_aiic_adapter_contract_plan`

Selection status:

`gate_br_personal_use_mvp_floor_impact_astm_iic_aiic_adapter_contract_landed_no_runtime_selected_runtime_corridor_gate_bs`

Selected next action:

`gate_bs_personal_use_mvp_floor_impact_astm_iic_aiic_runtime_corridor_plan`

Selected next file:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bs-floor-impact-astm-iic-aiic-runtime-corridor-contract.test.ts`

## Owner Boundary

Gate BR splits ASTM impact ratings into two owner groups:

- lab `IIC`: requires explicit ASTM lab impact band ownership,
  ASTM rating-procedure ownership, exact ASTM source precedence,
  uncertainty-budget ownership, visible-surface parity, and an explicit
  non-alias boundary from ISO `Ln,w` / `DeltaLw`;
- field `AIIC`: requires explicit field ASTM impact band ownership,
  apparent-rating ownership, receiving-room context, field uncertainty
  budget, visible-surface parity, and a non-alias boundary from ISO
  field/apparent impact values.

Missing frequency bands or room context stays `needs_input`. Missing
rating or uncertainty owners stays `runtime_owner_missing`. ISO lab,
ISO field, and building-prediction requests stay blocked or unsupported
instead of becoming ASTM ratings by relabeling.

## Next Step

Gate BS should investigate the runtime corridor only through the Gate BR
owner set. A runtime promotion is allowed only if it consumes owned ASTM
impact-band/rating inputs and keeps exact ASTM source precedence and all
non-alias negative boundaries visible. Broad ASTM source crawling remains
lower priority because it would not define source-absent ASTM behavior.
