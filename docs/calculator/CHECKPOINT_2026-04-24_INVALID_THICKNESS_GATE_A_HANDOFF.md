# Checkpoint - 2026-04-24 Invalid Thickness Gate A

Status: checkpoint handoff

## What Landed

Gate A of `all_caller_invalid_thickness_guard_v1` landed with no runtime
change.

New executable evidence:

- engine:
  `packages/engine/src/all-caller-invalid-thickness-guard-gate-a-matrix.test.ts`

The current focused calculator gate now includes this Gate A file.

## Caller Surfaces Covered

The matrix calls `calculateAssembly` directly, without workbench
normalization, `evaluateScenario`, or route/card helpers.

It covers 4 caller surfaces:

- wall lab direct caller;
- wall field direct caller;
- explicit-role floor field caller;
- raw floor pre-inference caller.

Each surface is exercised across 5 invalid thickness classes:

- `0`;
- `-5`;
- `Number.NaN`;
- `Number.POSITIVE_INFINITY`;
- non-numeric runtime value (`"abc"` at the layer boundary).

## Findings

- No direct floor or wall caller crashed.
- Every returned metric, rating, and curve band stayed finite.
- `supportedTargetOutputs` stayed empty.
- Every requested target output moved to `unsupportedTargetOutputs`.
- `supportedImpactOutputs` stayed empty.
- Impact, floor-system match, floor-system estimate, floor-system
  ratings, recommendations, catalog match, and lower-bound impact lanes
  stayed null or absent.
- Every cell emitted a thickness-specific warning.
- No exact row, source-family, formula lane, unsupported live output, or
  defended-looking answer leaked from invalid physical input.

Gate A found no concrete runtime drift, so Gate B is not required by the
current evidence.

## Next Step

Continue `all_caller_invalid_thickness_guard_v1` at Gate C.

Gate C must:

- run broad `pnpm check`;
- run `pnpm --filter @dynecho/web typecheck` after the build;
- add the closeout post-contract recording the no-runtime closeout,
  "Gate B not required" decision, and selected next slice;
- update `MASTER_PLAN.md`, `coverage-grid-consistency.test.ts`,
  `CURRENT_STATE.md`, `NEXT_IMPLEMENTATION_PLAN.md`, the slice plan,
  checkpoint docs, and `AGENTS.md` together;
- close only after focused and broad gates are green.

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
  - lint: green
  - typecheck: green
  - test: green
  - build: green with known non-fatal `sharp/@img` warnings
  - broad test shape: engine 216 files / 1205 tests green and web
    150 files / 864 passed + 18 skipped
- `pnpm --filter @dynecho/web typecheck`
  - green after build

Gate A targeted evidence:

- `pnpm --filter @dynecho/engine exec vitest run src/all-caller-invalid-thickness-guard-gate-a-matrix.test.ts --maxWorkers=1`
  - 1 file / 1 test green

Gate A integrated evidence:

- `pnpm calculator:gate:current`
  - engine focused gate: 84 files / 386 tests green
  - web focused gate: 36 files / 170 passed + 18 skipped
  - build: 5/5 tasks with known non-fatal `sharp/@img` warnings
  - whitespace guard: clean
- `pnpm --filter @dynecho/web typecheck`
  - green after build to restore the generated Next route-type
    reference

## Documents Updated In This Checkpoint

- `AGENTS.md`
- `docs/calculator/NEXT_IMPLEMENTATION_PLAN.md`
- `docs/calculator/CURRENT_STATE.md`
- `docs/calculator/SYSTEM_MAP.md`
- `docs/calculator/README.md`
- `docs/calculator/SLICE_ALL_CALLER_INVALID_THICKNESS_GUARD_PLAN.md`
- `tools/dev/run-calculator-current-gate.ts`
- this checkpoint file
