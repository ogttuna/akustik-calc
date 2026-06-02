# Post-V1 Gate CC Numeric Coverage And Accuracy Rerank Plan

Date: 2026-06-01

Authority: [CALCULATOR_SOURCE_OF_TRUTH.md](./CALCULATOR_SOURCE_OF_TRUTH.md)
and [USABLE_V1_EXECUTION_PLAN.md](./USABLE_V1_EXECUTION_PLAN.md).

## Goal

Gate CC is a no-runtime selection gate. It re-ranks the next calculator
gap after Gate CB and selects the highest-ROI scope/correctness action.

The selected gap is not source crawling, confidence wording, finite
scenario packing, or UI/report polish. It is a target-output support
bug in an already-owned calculator route: finished open-box package
building/impact calculations can produce finite `Rw`, `C`, `Ln,w`,
`L'n,w`, `L'nT,w`, and `L'nT,50`, but some of those outputs remain
unsupported when the user requests them alone instead of also asking for
`R'w` or another building output.

## Landed Selection

Gate CC has now landed:

`post_v1_next_numeric_coverage_gap_gate_cc_plan`

Gate CC status:

`post_v1_next_numeric_coverage_gap_gate_cc_landed_no_runtime_selected_floor_open_box_target_output_independence_gate_cd`

Selected candidate:

`floor.open_box_timber_finished_package.target_output_independence_gap`

This selected candidate is target-output independence work.

Selected next action:

`post_v1_floor_open_box_target_output_independence_gate_cd_plan`

Selected next file:

`packages/engine/src/post-v1-floor-open-box-target-output-independence-gate-cd-contract.test.ts`

## Why This Is Calculator Work

The selected Gate CD runtime work increases calculable scope for
realistic open-box timber floor layer combinations. With required
building and impact field inputs present, the same route already
calculates the numeric values; Gate CD makes support independent of
whether the user asks for a bundle or a single-output answer.

Expected before/after:

- before Gate CD, single-output requests such as `Rw`, `C`, `Ln,w`,
  `L'n,w`, `L'nT,w`, or `L'nT,50` can be reported unsupported even
  though complete package route values are finite;
- after Gate CD, those single-output requests publish the owned values;
- missing `impactFieldContext` still keeps field impact outputs
  unsupported;
- `Ctr`, ASTM `IIC`, and ASTM `AIIC` remain unsupported because their
  metric-basis owners are separate.

## Validation

Gate CC is covered by:

`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-cc-contract.test.ts`

Gate CD closes the selected runtime action:

`post_v1_floor_open_box_target_output_independence_gate_cd_plan`

Gate CD has now landed with status:

`post_v1_floor_open_box_target_output_independence_gate_cd_landed_selected_next_numeric_coverage_gap_gate_ce`

Gate CD selected next action:

`post_v1_next_numeric_coverage_gap_gate_ce_plan`
