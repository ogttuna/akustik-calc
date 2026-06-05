# Checkpoint 2026-06-05 - Docs/Implementation Sync After Gate CW

## Purpose

This checkpoint reconciles the living calculator documents with the
current implementation after Gate CW. It exists to keep the project on
calculator scope/accuracy work and to prevent drift back to older Gate
CD, Gate CH, or Gate CU "current selected next" wording.

## Documents Reviewed

- `AGENTS.md`
- `docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md`
- `docs/calculator/USABLE_V1_EXECUTION_PLAN.md`
- `docs/calculator/CURRENT_STATE.md`
- `docs/calculator/NEXT_IMPLEMENTATION_PLAN.md`
- `docs/calculator/POST_V1_CALCULATOR_CAPABILITY_PLAN_2026-05-25.md`
- `docs/calculator/POST_V1_HIGH_ROI_SCOPE_ACCURACY_GATES_AFTER_GATE_CD_PLAN_2026-06-02.md`
- `docs/calculator/README.md`
- `docs/calculator/SYSTEM_MAP.md`
- Gate CV and Gate CW executable contracts in `packages/engine/src`
- Gate CW runtime integration files in `packages/engine/src`
- `tools/dev/run-calculator-current-gate.ts`

Historical checkpoint and slice files were treated as history unless a
living document points to them as current. `CALCULATOR_SOURCE_OF_TRUTH.md`
and `POST_V1_CALCULATOR_CAPABILITY_PLAN_2026-05-25.md` remain the
authority when older files contain stale selected-next statements.

## Implementation Comparison

The current implementation and living docs agree on the post-V1 state:

- latest no-runtime numeric coverage selection:
  `post_v1_next_numeric_coverage_gap_gate_cv_plan`;
- Gate CV status:
  `post_v1_next_numeric_coverage_gap_gate_cv_landed_no_runtime_selected_wall_local_substitution_building_adapter_gate_cw`;
- latest value-moving runtime slice:
  `post_v1_wall_local_substitution_building_adapter_gate_cw_plan`;
- Gate CW status:
  `post_v1_wall_local_substitution_building_adapter_gate_cw_landed_runtime_selected_next_numeric_coverage_gap_gate_cx`;
- selected next action label:
  `post_v1_next_numeric_coverage_gap_gate_cx_plan`;
- selected next file:
  `packages/engine/src/post-v1-next-numeric-coverage-gap-gate-cx-contract.test.ts`.

Gate CW increases calculator scope for the local-substitution triple-leaf
wall family. Complete local Rockwool / MLV / plaster grouped triple-leaf
wall requests with explicit `building_prediction` flanking, junction,
room, panel, RT60, and output-basis inputs now calculate building
outputs from the local-substitution lab curve plus the building adapter
instead of stopping as unsupported.

Pinned Gate CW building values:

- `R'w 51`;
- `Dn,w 51`;
- `Dn,A 52.4`;
- `DnT,w 53`;
- `DnT,A 53.9`;
- source-absent building budget: `+/-11 dB`.

Boundaries remain intact:

- missing `buildingPredictionOutputBasis`, `flankingJunctionClass`,
  `conservativeFlankingAssumption`, room volumes, RT60, panel
  dimensions, or `junctionCouplingLengthM` remains `needs_input`;
- exact same-stack field/building source rows remain higher precedence
  than the source-absent Gate CW building adapter;
- lab `Rw` / STC / `C` / `Ctr`, field `R'w` / `DnT,w`, and building
  `R'w` / `Dn,w` / `DnT,w` style outputs remain separate metric-basis
  owners;
- no frontend/shared-surface work is part of Gate CW.

Gate CX is the correct next calculator step, but it is not scaffolded
yet in this checkpoint. The next implementation turn should create the
Gate CX no-runtime numeric coverage rerank contract before moving new
runtime values.

## Worktree Notes

The worktree is intentionally not assumed clean. There are unrelated
frontend, UI-documentation, generated-output, PDF, and older untracked
calculator files present from parallel agent work. This checkpoint only
speaks for the calculator Gate CW implementation/docs state and should
not be used as approval to commit unrelated frontend or generated files.

## Validation Evidence

Completed Gate CW evidence before this checkpoint:

- focused Gate CW / Gate CV verification passed:
  `pnpm --filter @dynecho/engine exec vitest run src/post-v1-wall-local-substitution-building-adapter-gate-cw-contract.test.ts src/post-v1-next-numeric-coverage-gap-gate-cv-contract.test.ts --maxWorkers=1`;
- full Gate CW current gate passed:
  `NEXT_DIST_DIR=.next-gate-cw pnpm calculator:gate:current` with
  engine 614 files / 3378 tests, web 113 files / 438 passed + 18 skipped,
  repo build 5 / 5, and whitespace guard passed;
- `git diff --check` passed after Gate CW documentation sync.

This checkpoint turn started
`NEXT_DIST_DIR=.next-gate-cw-checkpoint pnpm calculator:gate:current`.
The run was stopped at user request before completion to save time. No
failure was observed before interruption, but the interrupted run is not
new full-gate evidence.

## Stop Point

This is a good calculator checkpoint. Gate CW is a landed runtime
scope/correctness slice, the docs and implementation agree on the
current state, and the next action is Gate CX no-runtime numeric coverage
rerank. The next work must remain engine/calculator scope or accuracy
work: pick the highest-ROI formula/adapter/input-surface candidate, then
only move runtime values after that rerank selects a bounded slice.
