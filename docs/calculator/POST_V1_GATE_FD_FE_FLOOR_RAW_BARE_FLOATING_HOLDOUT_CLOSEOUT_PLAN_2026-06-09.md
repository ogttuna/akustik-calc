# Post-V1 Gate FD/FE Floor Raw-Bare Floating Holdout Closeout - 2026-06-09

Status: Gate FD landed no-runtime, rejected the same-basis holdout
owner, and selected Gate FE.

Gate FD landed gate:
`post_v1_floor_raw_bare_and_floating_same_basis_holdout_gate_fd_plan`

Gate FD status:
`post_v1_floor_raw_bare_and_floating_same_basis_holdout_gate_fd_landed_no_runtime_owner_rejected_selected_next_numeric_coverage_gap_gate_fe`

Gate FD owner decision:
`floor.raw_bare_and_floating.same_basis_holdout_owner_rejected_missing_admissible_holdouts`

Selected next action:
`post_v1_next_numeric_coverage_gap_gate_fe_plan`

Selected next file:
`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-fe-contract.test.ts`

## Purpose

Gate FD closes the bounded Gate FC work order. The job was to evaluate
only three Gate CL floor residual ledgers and decide whether current
repo evidence contains admissible source-owned same-basis holdouts that
would justify later floor budget tightening.

Gate FD does not move runtime values, retune formulas, import source
rows, or touch frontend implementation. Its calculator value is boundary
correctness: it prevents source-absent formula outputs, packaged rows,
or field-adapter outputs from being treated as their own validation
holdouts. That preserves accuracy while forcing the next slice back to a
fresh numeric coverage/accuracy rerank.

This is not a broad source crawl and not a finite scenario library.

## Gate FD Outcome

Gate FD evaluated exactly these Gate CL residual ledgers:

- `floor.open_box_timber.raw_bare_lab_impact`
- `floor.open_web_steel.raw_bare_lab_impact`
- `floor.heavy_floating_upper_treatment.field_companion_gate_ch`

All three remain rejected for budget tightening:

- open-box raw-bare runtime rows are source-absent formula outputs with
  explicit holdout-absence budget terms;
- open-box package-transfer/finished rows are not raw-bare same-basis
  element-lab impact holdouts;
- open-web raw-bare runtime rows are source-absent formula outputs with
  explicit carrier-only holdout absence;
- UBIQ, INEX, firestop, packaged, or supported-band evidence is not a
  raw-bare same-basis holdout;
- the Gate CH published upper-treatment `Ln,w` anchor seeds a field
  adapter but is not a measured direct+flanking field holdout set;
- Gate CH field values are adapter outputs from explicit field context,
  not measured field residual holdouts for budget retune.

Frozen budgets remain:

- open-box raw-bare lab impact: `9`;
- open-web raw-bare lab impact: `9`;
- heavy floating field companion: `8`.

Gate CH field direct/flanking value pins remain frozen:
`Ln,w 50 / L'n,w 57.5 / L'nT,w 55.1 / L'nT,50 59.1 / CI,50-2500 4`.

## Boundary Pins

Gate FD pins these boundaries for future agents:

- exact same-stack, same-basis measured/source rows keep precedence;
- source-absent formula outputs cannot be their own holdouts;
- packaged, finished, UBIQ/INEX/firestop, or supported-band rows do not
  calibrate raw-bare element-lab impact budgets;
- element-lab raw-bare rows do not calibrate field direct/flanking
  outputs;
- the published upper-treatment `Ln,w` anchor does not retune field
  direct/flanking budgets;
- ASTM `IIC`/`AIIC` rows do not alias to ISO `Ln,w`, `DeltaLw`, or field
  impact ratings;
- missing carrier fields, field direct/flanking context, or
  `CI,50-2500` owner inputs stay `needs_input`.

## Counters

- `ownerLedgersRejected 3`
- `admissibleHoldoutLedgers 0`
- `evaluatedGateCLResidualLedgers 3`
- `rejectedCandidateEvidenceLedgers 6`
- `boundaryLedgersPinned 7`
- `runtimeBudgetTighteningAdmitted 0`
- `broadSourceCrawlSelected false`
- `newCalculableLayerTemplates 0`
- `newCalculableRequestShapes 0`
- `runtimeBasisPromotions 0`
- `runtimeFormulaRetunes 0`
- `runtimeValuesMoved 0`
- `sourceRowsImported: 0`
- `frontendImplementationFilesTouched: 0`

## Gate FE Work Order

Create:
`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-fe-contract.test.ts`.

Gate FE must rerank the current post-Gate-FD numeric coverage/accuracy
gaps and select the highest-ROI next calculator slice. It must subtract
the now-closed Gate FD floor holdout path, Gate FB rejected
opening/leak/common-wall residual owner path, Gate EY/EW rejected
heavy-core lined-massive calibration path, and already-closed runtime or
input-surface repeats.

Gate FE should prefer a value-moving scope or accuracy slice if a safe
candidate exists. If no safe value-moving candidate exists, it must
state why and select the smallest bounded owner/input-surface
prerequisite that preserves metric-basis and `needs_input` /
`unsupported` boundaries. Gate FE must not select broad source crawling,
confidence wording, finite scenario packs, frontend polish, or a catalog
buildout as calculator progress.

## Gate FE Outcome

Gate FE has landed as:
`post_v1_next_numeric_coverage_gap_gate_fe_plan`.

Gate FE status:
`post_v1_next_numeric_coverage_gap_gate_fe_landed_no_runtime_selected_current_formula_scope_accuracy_gap_ledger_gate_ff`

Gate FE selected:
`calculator.current_formula_scope_accuracy_gap_ledger_after_gate_fd_closeout`

Gate FF is the selected current formula scope ledger after this closeout.

Gate FE ran two ROI plan iterations (`roiAnalysisIterations: 2`). It
subtracted the Gate FD floor holdout rejection, Gate FB opening/leak and
common-wall owner rejection, Gate EY heavy-core / lined-massive owner
rejection, stale cartography `runtime_widening` labels for heavy-core,
timber stud, CLT, and steel fallback, and the blocked Rockwool source
packet lane. Gate FE is not a broad source crawl and moves no runtime
values.

Gate FE selected Gate FF:
`post_v1_current_formula_scope_accuracy_gap_ledger_gate_ff_plan`
in
`packages/engine/src/post-v1-current-formula-scope-accuracy-gap-ledger-gate-ff-contract.test.ts`.

Gate FE counters: `candidateCount 10`, `roiAnalysisIterations: 2`,
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

Gate FE/FF plan:
`docs/calculator/POST_V1_GATE_FE_FF_CURRENT_FORMULA_SCOPE_ACCURACY_LEDGER_PLAN_2026-06-09.md`

## Validation Plan

- `pnpm -C packages/engine exec vitest run src/post-v1-floor-raw-bare-and-floating-same-basis-holdout-gate-fd-contract.test.ts --maxWorkers=1`
- `pnpm -C packages/engine exec vitest run src/post-v1-next-numeric-coverage-gap-gate-fc-contract.test.ts src/post-v1-floor-raw-bare-and-floating-same-basis-holdout-gate-fd-contract.test.ts --maxWorkers=1`
- `pnpm calculator:gate:current`
- `git diff --check`
