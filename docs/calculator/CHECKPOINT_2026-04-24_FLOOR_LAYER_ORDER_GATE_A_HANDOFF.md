# Checkpoint - 2026-04-24 Floor Layer-Order Gate A

Status: checkpoint handoff

## What Landed

`floor_layer_order_edit_stability_v1` Gate A landed as a no-runtime
inventory.

New executable evidence:

- engine:
  `packages/engine/src/floor-layer-order-edit-stability-gate-a-matrix.test.ts`
- web cards:
  `apps/web/features/workbench/floor-layer-order-edit-stability-gate-a-card-matrix.test.ts`

The current gate now includes both Gate A files.

## Findings Preserved

- Explicit-role exact floor rows keep their exact topology under
  reverse, rotate, and base-structure-first edit orders:
  - UBIQ FL-28 200 mm open-web exact remains
    `ubiq_fl28_open_web_steel_200_exact_lab_2026`.
  - Dataholz GDMTXN01 dry CLT exact remains
    `dataholz_gdmtxn01_dry_clt_lab_2026`.
- Raw terminal concrete helper rows are order-sensitive by design:
  moving concrete away from terminal position removes `Rw` support, but
  keeps field/building airborne companions and impact values finite and
  explicit.
- Raw open-web impact remains fail-closed for impact outputs after
  reorder while airborne building companions remain finite and
  formula-owned.
- No unsupported card leaked `live` or `bound`.
- No `GDMTXA04A`, `C11c`, raw bare source-family,
  reinforced-concrete formula-scope, wall selector, timber formula, or
  arbitrary floor reorder value-invariance reopening happened.

## Next Step

Gate B is not required by the current Gate A findings. Continue this
slice at Gate C: close out the no-runtime audit and select the next
calculator accuracy/coverage slice.

Gate C must keep the same boundary: floor layer-order edit stability is
now pinned for the audited surfaces, but broad arbitrary floor layer
reorder value invariance remains unclaimed.

## Executable Evidence

Baseline before Gate A:

- `pnpm calculator:gate:current`
  - engine focused gate: 81 files / 380 tests green
  - web focused gate: 35 files / 169 passed + 18 skipped
  - build: 5/5 tasks with known non-fatal `sharp/@img` warnings
  - whitespace guard: clean
- `pnpm --filter @dynecho/web typecheck`
  - green

Gate A targeted evidence:

- `pnpm --filter @dynecho/engine exec vitest run src/floor-layer-order-edit-stability-gate-a-matrix.test.ts --maxWorkers=1`
  - 1 file / 1 test green
- `pnpm --filter @dynecho/web exec vitest run features/workbench/floor-layer-order-edit-stability-gate-a-card-matrix.test.ts --maxWorkers=1`
  - 1 file / 1 test green
- `pnpm --filter @dynecho/web typecheck`
  - green after widening the Gate A card snapshot type to
    `Partial<Record<RequestedOutputId, CardSnapshot>>`

Gate A integrated evidence:

- `pnpm calculator:gate:current`
  - engine focused gate: 82 files / 381 tests green
  - web focused gate: 36 files / 170 passed + 18 skipped
  - build: 5/5 tasks with known non-fatal `sharp/@img` warnings
  - whitespace guard: clean
- `pnpm --filter @dynecho/web typecheck`
  - green after build

## Documents Updated In This Checkpoint

- `AGENTS.md`
- `docs/calculator/NEXT_IMPLEMENTATION_PLAN.md`
- `docs/calculator/CURRENT_STATE.md`
- `docs/calculator/SYSTEM_MAP.md`
- `docs/calculator/README.md`
- `docs/calculator/SLICE_FLOOR_LAYER_ORDER_EDIT_STABILITY_PLAN.md`
- `tools/dev/run-calculator-current-gate.ts`
- this checkpoint file
