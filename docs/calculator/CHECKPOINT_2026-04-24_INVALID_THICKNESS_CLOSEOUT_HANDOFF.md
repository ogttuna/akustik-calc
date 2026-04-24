# Checkpoint - 2026-04-24 Invalid Thickness Closeout

Status: checkpoint handoff

## What Closed

`all_caller_invalid_thickness_guard_v1` is closed as a no-runtime
calculator robustness audit.

Gate A landed:

- `packages/engine/src/all-caller-invalid-thickness-guard-gate-a-matrix.test.ts`

Gate C landed:

- `packages/engine/src/post-all-caller-invalid-thickness-gate-c-v1-next-slice-selection-contract.test.ts`

The focused current gate includes both files.

## Findings Preserved

The direct invalid-thickness matrix calls `calculateAssembly` without
workbench normalization, scenario helpers, or route/card helpers.

It covers:

- wall lab direct caller;
- wall field direct caller;
- explicit-role floor field caller;
- raw floor pre-inference caller.

Across:

- `0`;
- `-5`;
- `Number.NaN`;
- `Number.POSITIVE_INFINITY`;
- non-numeric runtime value (`"abc"` at the layer boundary).

Every cell fail-closed:

- no caller crashed;
- metrics, ratings, and curve bands stayed finite;
- `supportedTargetOutputs` stayed empty;
- requested outputs moved to `unsupportedTargetOutputs`;
- impact and floor-system lanes stayed null or absent;
- every cell emitted a thickness-specific warning.

Gate B was not required.

## Grid / Plan Result

`MASTER_PLAN.md` engine thickness validity moved from partial to
benchmark, and `coverage-grid-consistency.test.ts` now requires the
all-caller invalid-thickness matrix as evidence.

The selected next slice is `dynamic_airborne_split_refactor_v2` because:

- direct invalid thickness is now pinned across floor and wall engine
  callers;
- remaining source-family gaps are blocked or lower-ROI without new
  evidence;
- `dynamic-airborne.ts` is still 3152 lines;
- C6 architecture hygiene remains a documented split-v2 deferral;
- composer injection is the known blocker before the remaining floor/cap
  guards can move safely.

## Next Step

Start Gate A of
[SLICE_DYNAMIC_AIRBORNE_SPLIT_REFACTOR_V2_PLAN.md](./SLICE_DYNAMIC_AIRBORNE_SPLIT_REFACTOR_V2_PLAN.md).

Gate A is no-runtime:

- inventory the remaining `dynamic-airborne.ts` `apply*` floor/cap
  guards;
- identify which guards directly or indirectly call
  `calculateDynamicAirborneResult(...)`;
- define the composer function type to inject;
- select the smallest first carve that avoids circular imports;
- update [DYNAMIC_AIRBORNE_CARTOGRAPHY.md](./DYNAMIC_AIRBORNE_CARTOGRAPHY.md)
  with the fresh call graph and carve order.

Do not reopen `GDMTXA04A`, `C11c`, raw bare open-box/open-web impact,
wall-selector behavior, reinforced-concrete formula scope, timber exact
row follow-ups, or productization route integration by adjacency.

## Executable Evidence

Baseline before Gate A:

- `pnpm calculator:gate:current`
  - engine focused gate: 83 files / 385 tests green
  - web focused gate: 36 files / 170 passed + 18 skipped
  - build: 5/5 tasks with known non-fatal `sharp/@img` warnings
  - whitespace guard: clean
- `pnpm check`
  - engine broad suite: 216 files / 1205 tests green
  - web broad suite: 150 files / 864 passed + 18 skipped
  - build: green with known non-fatal `sharp/@img` warnings

Gate A targeted evidence:

- `pnpm --filter @dynecho/engine exec vitest run src/all-caller-invalid-thickness-guard-gate-a-matrix.test.ts --maxWorkers=1`
  - 1 file / 1 test green

Gate A integrated evidence:

- `pnpm calculator:gate:current`
  - engine focused gate: 84 files / 386 tests green
  - web focused gate: 36 files / 170 passed + 18 skipped
  - build: 5/5 tasks with known non-fatal `sharp/@img` warnings
  - whitespace guard: clean

Gate C broad pre-contract evidence:

- `pnpm check`
  - first run caught a test-only type issue:
    `result.warnings.some((warning) => ...)` needed `warning: string`
  - after that fix, broad check passed:
    - engine broad suite: 217 files / 1206 tests green
    - web broad suite: 150 files / 864 passed + 18 skipped
    - build: 5/5 tasks with known non-fatal `sharp/@img` warnings

Gate C final evidence after post-contract/grid sync:

- `pnpm calculator:gate:current`
  - engine focused gate: 85 files / 391 tests green
  - web focused gate: 36 files / 170 passed + 18 skipped
  - build: 5/5 tasks with known non-fatal `sharp/@img` warnings
  - whitespace guard: clean
- `pnpm check`
  - engine broad suite: 218 files / 1211 tests green
  - web broad suite: 150 files / 864 passed + 18 skipped
  - build: 5/5 tasks with known non-fatal `sharp/@img` warnings
- `pnpm --filter @dynecho/web typecheck`
  - green after build
- `git diff --check`
  - clean

## Documents Updated In This Checkpoint

- `AGENTS.md`
- `docs/calculator/NEXT_IMPLEMENTATION_PLAN.md`
- `docs/calculator/CURRENT_STATE.md`
- `docs/calculator/MASTER_PLAN.md`
- `docs/calculator/SYSTEM_MAP.md`
- `docs/calculator/README.md`
- `docs/calculator/SOURCE_GAP_LEDGER.md`
- `docs/calculator/POST_CALCULATOR_PRODUCTIZATION_ROADMAP.md`
- `docs/calculator/DYNAMIC_AIRBORNE_CARTOGRAPHY.md`
- `docs/calculator/SLICE_ALL_CALLER_INVALID_THICKNESS_GUARD_PLAN.md`
- `docs/calculator/SLICE_DYNAMIC_AIRBORNE_SPLIT_REFACTOR_V2_PLAN.md`
- `packages/engine/src/coverage-grid-consistency.test.ts`
- `tools/dev/run-calculator-current-gate.ts`
- this checkpoint file
