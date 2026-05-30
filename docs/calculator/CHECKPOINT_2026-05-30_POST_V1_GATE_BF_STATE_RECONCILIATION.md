# Checkpoint 2026-05-30 - Post-V1 Gate BF State Reconciliation

This checkpoint treats the current repository state as a stop-and-commit
candidate. It reconciles the source-of-truth docs, active plan, runtime
implementation, current-gate runner, and remaining next step after
Gate BF.

## Product Direction

DynEcho remains an acoustic calculator, not a catalog or scenario
library. The high-ROI path is still numeric coverage and accuracy:
select the next source-absent or adapter gap that can increase owned
calculation outputs, prove before/after values, preserve basis
boundaries, and keep exact missing-input/unsupported stops.

## Documents Re-read

- `AGENTS.md`
- `docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md`
- `docs/calculator/CURRENT_STATE.md`
- `docs/calculator/NEXT_IMPLEMENTATION_PLAN.md`
- `docs/calculator/POST_V1_CALCULATOR_CAPABILITY_PLAN_2026-05-25.md`
- `docs/calculator/README.md`
- `docs/README.md`

## Implementation Comparison

The implementation is ahead of a few stale summary blocks that still
named Gate AY / Gate AZ as the latest state. Runtime and tests are
aligned with Gate BF:

- Gate BE exists in
  `packages/engine/src/post-v1-next-numeric-coverage-gap-gate-be.ts`
  and selects
  `floor.suspended_ceiling_lower_treatment.field_companion_assembly_runtime_gap`.
- Gate BF exists in
  `packages/engine/src/post-v1-floor-suspended-ceiling-lower-treatment-field-companion-gate-bf.ts`
  and lands
  `post_v1_floor_suspended_ceiling_lower_treatment_field_companion_gate_bf_plan`.
- `packages/engine/src/calculate-assembly.ts` contains the
  lower-treatment field companion predictor seed, so assembly field-only
  lower-treatment floor requests reach the already-owned field adapter
  instead of stopping behind an unnecessary lab-anchor gap.
- `packages/engine/src/index.ts` exports the Gate BE/BF modules.
- `tools/dev/run-calculator-current-gate.ts` includes both Gate BE and
  Gate BF focused contracts.

## Current Calculated Coverage

Gate BF is real runtime coverage movement. It opens field-only assembly
outputs for the heavy-concrete suspended-ceiling lower-treatment lane:

- acoustic hanger: `L'n,w 47.6`, `L'nT,w 44.8`, `L'nT,50 48.8`;
- resilient stud: `L'n,w 46.6`, `L'nT,w 43.8`, `L'nT,50 47.8`.

Missing `impactFieldContext.ci50_2500Db` stops only `L'nT,50`, while
`L'n,w` and `L'nT,w` remain calculable when their inputs are present.
ASTM `IIC` / `AIIC` stay unsupported instead of being aliased from ISO
impact outputs.

## Plan Assessment

The active post-V1 plan is still correct, but its top summary needed to
move from Gate AY/AZ language to the current Gate BF checkpoint. The
right next action is not a source crawl, confidence wording pass, or
finite scenario pack. Gate BF selected:

`post_v1_next_numeric_coverage_gap_gate_bg_plan`

Selected next file:

`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-bg-contract.test.ts`

Gate BG should rerank the next numeric coverage gap from the current
implementation state and must choose a value-moving or correctness
boundary slice with explicit before/after acceptance. The carried
candidate to compare is still
`floor.mixed_support_family.multi_family_solver_gap`, but Gate BG should
not assume it wins before the executable rerank.

## Open Items

- Gate BG is selected but not implemented yet.
- Do not commit generated/local artifacts such as `.playwright-cli/`,
  `tmp/`, `output/`, `apps/web/output/`, or ad hoc PDF files.
- Do not broaden into catalog crawling unless a future executable
  numeric coverage gate explicitly selects exact-source promotion.

## Validation

Fresh validation for this checkpoint:

- Gate BE/BF focused engine contracts: passed, 2 files / 10 tests.
- Historical doc-regression plus BE/BF targeted set: passed, 8 files /
  35 tests.
- Full `pnpm calculator:gate:current`: passed. Engine focused gate:
  569 files / 3155 tests. Web focused gate: 112 files / 435 passed +
  18 skipped. Repo build: 5 successful / 5 total. The current-gate
  whitespace guard completed with exit code 0.
- Independent `git diff --check`: passed after the checkpoint doc
  update.
