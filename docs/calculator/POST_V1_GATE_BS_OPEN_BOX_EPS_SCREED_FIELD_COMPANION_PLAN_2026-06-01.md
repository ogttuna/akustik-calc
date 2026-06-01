# Post-V1 Gate BS Open-Box EPS/Screed Field Companion Plan

Date: 2026-06-01

Authority: [CALCULATOR_SOURCE_OF_TRUTH.md](./CALCULATOR_SOURCE_OF_TRUTH.md)
and [USABLE_V1_EXECUTION_PLAN.md](./USABLE_V1_EXECUTION_PLAN.md).

## Goal

Gate BS is runtime calculator coverage and correctness work selected by
Gate BR. It is not source crawling, scenario packing, confidence wording,
or generic UI/report work.

The selected gap was:

`floor.open_box_timber_eps_screed_hybrid.field_companion_runtime_gap`

The calculator already owned finished open-box timber lab anchors, but
two valid field-output request shapes were not using them correctly:

- dry gypsum-fiber package-transfer field-only requests used a weaker
  generic archetype field tuple instead of the same package-transfer
  anchor used by mixed lab-plus-field requests;
- EPS/screed hybrid package requests owned `Ln,w 47` and
  `CI,50-2500 1`, but still left `L'n,w`, `L'nT,w`, and `L'nT,50`
  unsupported.

## Landed Runtime

Gate BS has now landed as:

`post_v1_floor_open_box_eps_screed_field_companion_gate_bs_plan`

Gate BS status:

`post_v1_floor_open_box_eps_screed_field_companion_gate_bs_landed_selected_next_numeric_coverage_gap_gate_bt`

Dry package-transfer field-only requests now calculate the same field
companions as mixed requests:

- `L'n,w 52.8`
- `L'nT,w 50.4`
- `L'nT,50 53.7`

EPS/screed hybrid requests with explicit `impactFieldContext` now
calculate field companions from the owned lab anchor:

- `Ln,w 47`
- `CI,50-2500 1`
- `L'n,w 49`
- `L'nT,w 46.6`
- `L'nT,50 47.6`

Field-only requests derive the required lab anchor internally; the user
does not have to request `Ln,w` to receive the field outputs.

## Boundaries

Missing `impactFieldContext` remains `needs_input`; the runtime does not
guess K or receiving-room volume.

`R'w`, `DnT,w`, and ASTM `IIC` / `AIIC` remain separate owners. Gate BS
does not alias ISO `Ln,w` / `CI` single numbers into ASTM ratings and
does not promote airborne building outputs from impact field context.

Selected next action:

`post_v1_next_numeric_coverage_gap_gate_bt_plan`
