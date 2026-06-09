# Post-V1 Gate FE/FF Current Formula Scope Accuracy Ledger Plan - 2026-06-09

Status: Gate FE landed no-runtime, Gate FF landed no-runtime, and Gate
FF selected the post double-leaf/framed coverage revalidation.

Gate FE landed gate:
`post_v1_next_numeric_coverage_gap_gate_fe_plan`

Gate FE status:
`post_v1_next_numeric_coverage_gap_gate_fe_landed_no_runtime_selected_current_formula_scope_accuracy_gap_ledger_gate_ff`

Gate FE selected candidate:
`calculator.current_formula_scope_accuracy_gap_ledger_after_gate_fd_closeout`

Gate FE selected next action:
`post_v1_current_formula_scope_accuracy_gap_ledger_gate_ff_plan`

Gate FE selected next file:
`packages/engine/src/post-v1-current-formula-scope-accuracy-gap-ledger-gate-ff-contract.test.ts`

Gate FF landed gate:
`post_v1_current_formula_scope_accuracy_gap_ledger_gate_ff_plan`

Gate FF status:
`post_v1_current_formula_scope_accuracy_gap_ledger_gate_ff_landed_no_runtime_selected_post_double_leaf_framed_wall_banded_coverage_revalidation`

Gate FF selected candidate:
`wall.double_leaf_framed_post_runtime_coverage_revalidation_after_direct_fixed_gate_er`

Gate FF selected next action:
`layer_combination_resolver_post_double_leaf_framed_wall_banded_coverage_revalidation_plan`

Gate FF selected next file:
`packages/engine/src/layer-combination-resolver-post-double-leaf-framed-wall-banded-coverage-revalidation-contract.test.ts`

Checkpoint note: this selected next file is intentionally still open.
Creating that contract is the next implementation step after Gate FF,
not a missing Gate FF artifact.

## Purpose

Gate FE is a no-runtime rerank after Gate FD. It does not increase
numeric scope or retune values by itself. Its calculator value is that
it prevents the next implementation slice from falling back into closed
or stale work: Gate FB rejected opening/leak and common-wall residual
budget tightening, Gate FD rejected floor raw-bare/floating holdout
tightening, and Gate EY kept heavy-core / lined-massive wall retune
blocked.

The selected follow-up, Gate FF, must produce a current formula
scope/accuracy ledger. That ledger must read today's implementation and
name a bounded formula owner/runtime family before any values move.
This keeps the project aligned with the calculator north star: improve
scope or accuracy through dynamic formulas and owned boundaries, not by
building a broad source catalog or replaying old `runtime_widening`
labels.

## Gate FE Iteration 1

Gate FE first subtracts the owner or holdout paths that are now closed:

- `floor.raw_bare_floating_budget_tightening_rejected_by_gate_fd`;
- `wall.opening_leak_common_wall_budget_tightening_rejected_by_gate_fb`;
- `wall.heavy_core_lined_massive_runtime_retune_rejected_by_gate_ey`.

These remain real accuracy topics, but they are not safe current
runtime movements. They need admissible same-basis holdouts, a bounded
wall lining owner, or a later selected formula corridor before any
runtime values move.

Result: `blockedOwnerOrHoldoutRows 3`,
`immediateRuntimeCandidatesSelected 0`, `runtimeValuesMoved 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.

## Gate FE Iteration 2

Gate FE then rechecks the historical cartography runtime labels.

- `wall.concrete_heavy_core_screening.field` is stale because the
  heavy-core / lined-massive owner remains rejected after Gate EY.
- `wall.timber_stud_formula.field` is already supported by the current
  formula lane, so it is not fresh scope by itself.
- `wall.clt_formula.field` is already supported by the laminated
  single-leaf formula lane, so it is not fresh scope by itself.
- `floor.steel_fallback_low_confidence.field` is a low-confidence
  fallback after bounded steel formula/input-surface gates, not a safe
  widening target.

The old Rockwool split triple-leaf source-packet refresh is also not a
current runtime candidate. It remains blocked by absent rights-safe
payloads and would pull the slice toward source-packet work instead of
formula scope.

Result: `staleCartographyRuntimeWideningRows 4`,
`sourcePacketRowsRejectedAsCurrentRuntime 1`,
`broadSourceCrawlSelected false`, `roiAnalysisIterations: 2`,
`runtimeFormulaRetunes 0`, and `runtimeBasisPromotions 0`.

## Gate FE Decision

Gate FE selects:
`calculator.current_formula_scope_accuracy_gap_ledger_after_gate_fd_closeout`.

Counters: `candidateCount 10`, `roiAnalysisIterations: 2`,
`estimatedNextFormulaScopeLedgerRows 1`,
`estimatedNextRuntimeCandidateFamiliesToEvaluate 6`,
`staleCartographyRuntimeWideningRows 4`,
`blockedOwnerOrHoldoutRows 3`,
`sourcePacketRowsRejectedAsCurrentRuntime 1`,
`immediateRuntimeCandidatesSelected 0`,
`newCalculableLayerTemplates 0`, `newCalculableRequestShapes 0`,
`runtimeBasisPromotions 0`, `runtimeFormulaRetunes 0`,
`runtimeValuesMoved 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`.

## Gate FF Work Order

Gate FF must build a current formula scope/accuracy ledger from the
current engine implementation. It should prefer a value-moving scope or
accuracy slice if a safe bounded candidate exists, but it must not move
runtime values during Gate FF itself unless the selected owner and
runtime route are both proven in the same contract.

Gate FF must:

- start from the live candidate coverage matrix and current gate runner;
- classify formula-scope gaps separately from owner-rejected holdout
  gaps, closed repeats, `needs_input` boundaries, `unsupported`
  boundaries, and source-packet work;
- name the next bounded formula owner or runtime corridor if one is
  ready;
- preserve exact measured precedence over formula paths;
- keep lab, field, building, ISO, and ASTM metric/basis boundaries
  separate;
- keep missing route-required physical inputs as `needs_input`;
- import no broad source rows and avoid source crawling as the selected
  work.

Gate FF is not a broad source crawl. It is not confidence wording,
frontend polish, scenario-pack work, or a catalog task. It is the
smallest safe bridge from the closed post-FD candidate list to the next
calculator slice that can improve formula scope or accuracy.

## Gate FF Iteration 1

Gate FF first subtracts formula/runtime routes that are already live:

- single-leaf mass-law owner, formula corridor, runtime basis, and
  surface parity;
- non-direct-fixed double-leaf/framed owner, formula corridor, runtime
  basis, surface parity, and coverage refresh;
- direct-fixed double-leaf field/building adapter from Gate ER;
- historical candidate-matrix and company-internal rehearsal chains.

These are not fresh scope by themselves. Reselecting them would loop the
project through closed work instead of improving calculator coverage or
accuracy.

Result: `closedRuntimeRowsRechecked 5`,
`immediateRuntimeCandidatesSelected 0`, `runtimeValuesMoved 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.

## Gate FF Iteration 2

Gate FF then subtracts owner-rejected or non-goal lanes:

- Gate FD floor raw-bare/floating holdout tightening remains rejected
  until admissible same-basis holdouts exist;
- Gate FB opening/leak and common-wall residual budget tightening
  remains rejected until same-basis holdouts exist;
- Gate EY heavy-core / lined-massive retune remains rejected until a
  runtime-admissible wall-specific owner or bounded rule exists;
- broad source crawling remains a non-goal without a selected bounded
  route.

The only current open formula-scope item with live implementation
evidence is the post double-leaf/framed coverage revalidation selected
by the previous double-leaf coverage refresh. It is higher ROI now
because both the non-direct-fixed double-leaf/framed runtime and the
direct-fixed double-leaf field/building adapter are live. The
revalidation must rerank remaining wall/floor gaps from current
evidence before any next value-moving slice is chosen.

Result: `roiAnalysisIterations: 2`,
`estimatedNextPostDoubleLeafRevalidationRows 1`,
`estimatedNextRuntimeCandidateFamiliesToRerank 4`,
`blockedOwnerOrHoldoutRows 3`, `runtimeFormulaRetunes 0`, and
`runtimeBasisPromotions 0`.

## Gate FF Decision

Gate FF selects:
`wall.double_leaf_framed_post_runtime_coverage_revalidation_after_direct_fixed_gate_er`.

Selected next action:
`layer_combination_resolver_post_double_leaf_framed_wall_banded_coverage_revalidation_plan`.

Selected next file:
`packages/engine/src/layer-combination-resolver-post-double-leaf-framed-wall-banded-coverage-revalidation-contract.test.ts`.

The selected file remains intentionally unimplemented until the next
slice starts.

Counters: `candidateCount 10`, `roiAnalysisIterations: 2`,
`estimatedNextPostDoubleLeafRevalidationRows 1`,
`estimatedNextRuntimeCandidateFamiliesToRerank 4`,
`closedRuntimeRowsRechecked 5`, `blockedOwnerOrHoldoutRows 3`,
`openHistoricalSelectedNextFilesStillMissing 1`,
`immediateRuntimeCandidatesSelected 0`,
`newCalculableLayerTemplates 0`, `newCalculableRequestShapes 0`,
`runtimeBasisPromotions 0`, `runtimeFormulaRetunes 0`,
`runtimeValuesMoved 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`.

## Revert / Stop Conditions

Stop before any runtime movement if Gate FF cannot identify a bounded
formula family with route-required physical inputs, target metrics,
metric basis, hostile boundaries, and owner terms.

Stop if the selected path requires:

- borrowing field/building values from lab rows without a selected
  adapter owner;
- aliasing ISO `Ln,w` / `DeltaLw` into ASTM `IIC` / `AIIC`;
- turning missing physical inputs into generic unsupported values;
- retuning source-absent budgets from their own outputs;
- broad source crawling or finite catalog collection.

Validation for Gate FE:

- focused Gate FE contract:
  `pnpm -C packages/engine exec vitest run src/post-v1-next-numeric-coverage-gap-gate-fe-contract.test.ts --maxWorkers=1`;
- Gate FD + Gate FE focused chain:
  `pnpm -C packages/engine exec vitest run src/post-v1-floor-raw-bare-and-floating-same-basis-holdout-gate-fd-contract.test.ts src/post-v1-next-numeric-coverage-gap-gate-fe-contract.test.ts --maxWorkers=1`;
- current calculator gate:
  `pnpm calculator:gate:current`;
- whitespace:
  `git diff --check`.
