# Post-V1 Gate ES/ET Reinforced-Concrete Visible-Derived Boundary Plan - 2026-06-08

Document role: active handoff plan for the Gate ES rerank and the Gate
ET no-runtime boundary refresh. It exists to keep the calculator focused
on scope/accuracy boundaries, not source crawling, confidence wording,
or frontend polish.

## Gate ES Rerank

Landed gate:

`post_v1_next_numeric_coverage_gap_gate_es_plan`

Gate ES selected the reinforced-concrete visible-derived missing-input boundary.

Status:

`post_v1_next_numeric_coverage_gap_gate_es_landed_no_runtime_selected_floor_reinforced_concrete_visible_derived_missing_input_boundary_gate_et`

Selected candidate:

`floor.reinforced_concrete_visible_derived_missing_input_boundary_refresh`

Selected next action:

`post_v1_floor_reinforced_concrete_visible_derived_missing_input_boundary_gate_et_plan`

Selected next file:

`packages/engine/src/post-v1-floor-reinforced-concrete-visible-derived-missing-input-boundary-gate-et-contract.test.ts`

Gate ES Iteration 1: subtract the now-closed Gate ER direct-fixed
double-leaf field/building runtime, the closed Gate EO lab route, the
Gate EQ adapter owner proof, and correct missing-input boundaries. Do
not reselect direct-fixed field/building work that already calculates
through Gate I and Gate AR.

Gate ES Iteration 2: select the reinforced-concrete visible-derived
missing-input boundary refresh. Current runtime derives the lower
assembly from visible layer roles and correctly asks only for
`resilientLayerDynamicStiffnessMNm3` and `loadBasisKgM2`, while older
contracts still expected `ceilingOrLowerAssembly`. This protects
calculation correctness and clears a known current-gate red condition
without changing formulas.

Gate ES counters: `candidateCount 10`, `roiAnalysisIterations: 2`,
`estimatedNextBoundaryLedgers 1`, `estimatedNextCurrentGateFailuresCleared 6`,
`estimatedNextStaleExpectationRowsCorrected 6`,
`estimatedNextFrontendImplementationFilesTouched 1`,
`newCalculableLayerTemplates 0`, `newCalculableRequestShapes 0`,
`runtimeBasisPromotions 0`, `runtimeFormulaRetunes 0`,
`runtimeValuesMoved 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`.

Rejected directions: forcing `ceilingOrLowerAssembly` when visible
layers already define the lower treatment, retuning the heavy-concrete
combined formula without same-family holdouts, cross-family
lower-treatment `DeltaLw` subtraction, broad source crawling,
confidence wording, and frontend polish.

## Gate ET Work Order

Gate ET must pin the no-runtime boundary:

- visible-derived reinforced-concrete combined upper/lower stacks keep
  airborne `Rw` / `Ctr` live and park `Ln,w` / `DeltaLw` as
  `needs_input`;
- visible-derived missing inputs are exactly
  `resilientLayerDynamicStiffnessMNm3` and `loadBasisKgM2`;
- `ceilingOrLowerAssembly` is not requested for that visible-derived
  stack because the lower assembly is already represented by layer
  roles;
- explicit partial predictor input still requires
  `loadBasisKgM2` and `ceilingOrLowerAssembly`;
- complete explicit predictor input still calculates `Ln,w 58.1` and
  `DeltaLw 13.7` through
  `predictor_heavy_combined_upper_lower_floor_iso12354_annexc_estimate`;
- no formula value, source row, shared/API surface, or frontend
  implementation moves.

## Gate ET Landed

Landed gate:

`post_v1_floor_reinforced_concrete_visible_derived_missing_input_boundary_gate_et_plan`

Status:

`post_v1_floor_reinforced_concrete_visible_derived_missing_input_boundary_gate_et_landed_no_runtime_selected_next_numeric_coverage_gap_gate_eu`

Boundary id:

`floor.reinforced_concrete.visible_derived_lower_assembly_from_layers_missing_dynamic_stiffness_and_load`

Gate ET counters: `boundaryLedgersPinned 1`,
`staleExpectationRowsCorrected 6`, `currentGateFailuresCleared 6`,
`newCalculableLayerTemplates 0`, `newCalculableRequestShapes 0`,
`runtimeBasisPromotions 0`, `runtimeFormulaRetunes 0`,
`runtimeValuesMoved 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 1`.

Gate ET selects Gate EU:

`post_v1_next_numeric_coverage_gap_gate_eu_plan`

Selected next file:

`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-eu-contract.test.ts`

## Validation

Targeted Gate ES/ET validation:

`pnpm --filter @dynecho/engine exec vitest run src/post-v1-next-numeric-coverage-gap-gate-es-contract.test.ts src/post-v1-floor-reinforced-concrete-visible-derived-missing-input-boundary-gate-et-contract.test.ts --maxWorkers=1`

Current-gate validation remains:

`pnpm calculator:gate:current`
