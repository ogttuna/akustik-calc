# Checkpoint - 2026-04-24 Floor Many-Layer Gate A

Status: checkpoint handoff

## What Landed

Gate A of `floor_many_layer_stress_regression_v1` landed with no runtime
change.

The slice now has executable 50+ layer floor stress coverage in both
engine and web-card layers:

- engine:
  `packages/engine/src/floor-many-layer-stress-gate-a-matrix.test.ts`
- web cards:
  `apps/web/features/workbench/floor-many-layer-stress-gate-a-card-matrix.test.ts`

## Families Covered

Engine matrix:

- 53-layer UBIQ split exact stack
  (`ubiq_fl28_open_web_steel_200_exact_lab_2026`)
- 52-layer Dataholz CLT dry split exact stack
  (`dataholz_gdmtxn01_dry_clt_lab_2026`)
- 53-layer raw terminal concrete helper stack
- 53-layer raw open-web impact-blocked stack
- 52-layer reinforced-concrete low-confidence/formula stack

Web route/card matrix:

- 53-layer UBIQ split exact stack
- 53-layer raw terminal concrete helper stack
- 53-layer raw open-web impact-blocked stack

## Findings

- Split-equivalent 50+ exact stacks remain exact for UBIQ and Dataholz
  CLT rows.
- Supported 50+ helper/formula stacks stay finite across airborne,
  field/building, and impact companion outputs.
- Unsupported impact lanes stay explicitly unsupported or `needs_input`
  at the card layer instead of leaking live values.
- Raw open-web impact remains fail-closed while airborne building
  companions stay formula-owned and finite.
- No `GDMTXA04A`, `C11c`, raw bare source-family,
  reinforced-concrete formula-scope, or arbitrary floor reorder reopening
  happened.

## Implementation Vs Plan

Gate A asked for a no-runtime inventory of current floor 50+ layer
stability. That is now executable for representative exact,
low-confidence/formula, helper, and blocked/fail-closed lanes.

Gate A did not identify a required Gate B fix. Gate B should stay a
contingency only: reopen it if the focused current gate or a later
targeted review finds concrete many-layer drift.

## Executable Evidence

Targeted tests passed:

- `pnpm --filter @dynecho/engine exec vitest run src/floor-many-layer-stress-gate-a-matrix.test.ts --maxWorkers=1`
  - 1 file / 1 test green
- `pnpm --filter @dynecho/web exec vitest run features/workbench/floor-many-layer-stress-gate-a-card-matrix.test.ts --maxWorkers=1`
  - 1 file / 1 test green

Focused current gate passed after the Gate A matrices were added:

- `pnpm calculator:gate:current`
  - engine focused gate: 80 files / 376 tests
  - web focused gate: 35 files / 169 passed + 18 skipped
  - build: 5/5 tasks with known non-fatal `sharp/@img` warnings
  - whitespace guard: clean
- `pnpm --filter @dynecho/web typecheck` green after build to restore the
  generated Next route-type reference.
- `git diff --check` clean.

## Next Action

Close `floor_many_layer_stress_regression_v1` as a no-runtime Gate A
audit and write the next-slice selection contract/checkpoint. Reopen
Gate B only if a later review finds concrete many-layer drift that the
Gate A matrix missed.

## Documents Updated In This Checkpoint

- `AGENTS.md`
- `docs/calculator/NEXT_IMPLEMENTATION_PLAN.md`
- `docs/calculator/CURRENT_STATE.md`
- `docs/calculator/MASTER_PLAN.md`
- `docs/calculator/SYSTEM_MAP.md`
- `docs/calculator/README.md`
- `docs/calculator/SLICE_FLOOR_MANY_LAYER_STRESS_REGRESSION_PLAN.md`
- `tools/dev/run-calculator-current-gate.ts`
- this checkpoint file
