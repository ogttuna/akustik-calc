# Checkpoint 2026-06-08 - Gate ET Boundary Handoff

Document role: docs/implementation reconciliation after Gate ET. This
checkpoint supersedes the Gate ER runtime handoff for current post-V1
selected-next status.

## Product Guard

DynEcho remains an acoustic calculator. Gate ES/ET did not crawl
sources, retune confidence wording, or polish frontend surfaces. It
closed a calculator correctness boundary: visible-derived
reinforced-concrete floors should ask for the physical inputs that are
actually missing, not for a lower assembly already represented by layer
roles.

## Gate ES Landed

Gate ES landed as:

`post_v1_next_numeric_coverage_gap_gate_es_plan`

Status:

`post_v1_next_numeric_coverage_gap_gate_es_landed_no_runtime_selected_floor_reinforced_concrete_visible_derived_missing_input_boundary_gate_et`

Selected candidate:

`floor.reinforced_concrete_visible_derived_missing_input_boundary_refresh`

Gate ES ran two ROI passes (`roiAnalysisIterations: 2`) after Gate ER:
first subtracting the now-live direct-fixed field/building runtime, then
selecting the reinforced-concrete visible-derived missing-input boundary
because it was the highest-ROI accuracy/current-gate blocker.

## Gate ET Landed

Gate ET landed as:

`post_v1_floor_reinforced_concrete_visible_derived_missing_input_boundary_gate_et_plan`

Status:

`post_v1_floor_reinforced_concrete_visible_derived_missing_input_boundary_gate_et_landed_no_runtime_selected_next_numeric_coverage_gap_gate_eu`

Boundary id:

`floor.reinforced_concrete.visible_derived_lower_assembly_from_layers_missing_dynamic_stiffness_and_load`

Runtime posture:

- visible-derived reinforced-concrete combined upper/lower impact keeps
  `Ln,w` / `DeltaLw` parked as `needs_input`;
- missing inputs are exactly `resilientLayerDynamicStiffnessMNm3` and
  `loadBasisKgM2`;
- `ceilingOrLowerAssembly` is no longer asked for that visible-derived
  stack because the lower assembly comes from visible layer roles;
- explicit partial predictor input still asks for `loadBasisKgM2` and
  `ceilingOrLowerAssembly`;
- complete explicit input still calculates `Ln,w 58.1` /
  `DeltaLw 13.7`.

Counters: `boundaryLedgersPinned 1`, `staleExpectationRowsCorrected 6`,
`currentGateFailuresCleared 6`, `newCalculableLayerTemplates 0`,
`newCalculableRequestShapes 0`, `runtimeBasisPromotions 0`,
`runtimeFormulaRetunes 0`, `runtimeValuesMoved 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 1`.

## Selected Next

Gate ET selects Gate EU:

`post_v1_next_numeric_coverage_gap_gate_eu_plan`

Selected next file:

`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-eu-contract.test.ts`

Gate ES estimated this selected boundary-surface touch as
`estimatedNextFrontendImplementationFilesTouched 1`; Gate ET recorded the
actual boundary-surface implementation touch as
`frontendImplementationFilesTouched: 1`.

Gate EU should rerank remaining calculator coverage/accuracy gaps after
subtracting Gate ER and the now-refreshed reinforced-concrete boundary.
It must not reopen source crawling, confidence wording, frontend polish,
or finite scenario packs unless a calculator scope/accuracy gate
explicitly selects them.
