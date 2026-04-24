# Checkpoint - 2026-04-24 Floor Layer-Order Closeout

Status: checkpoint handoff

## What Closed

`floor_layer_order_edit_stability_v1` is closed as a no-runtime audit.
Gate A landed the engine and web route/card matrices, and Gate C now
records that no Gate B runtime/card fix was required.

Closed evidence:

- engine:
  `packages/engine/src/floor-layer-order-edit-stability-gate-a-matrix.test.ts`
- web cards:
  `apps/web/features/workbench/floor-layer-order-edit-stability-gate-a-card-matrix.test.ts`
- closeout contract:
  `packages/engine/src/post-floor-layer-order-gate-c-v1-next-slice-selection-contract.test.ts`

## Findings Preserved

- UBIQ FL-28 and Dataholz GDMTXN01 explicit-role exact rows stay exact
  under reverse, rotate, and base-structure-first edit orders.
- Raw terminal concrete helper rows are order-sensitive by design:
  moving concrete away from terminal position removes `Rw` support, but
  keeps field/building airborne companions and impact values finite and
  explicit.
- Raw open-web impact remains fail-closed for impact outputs after
  reorder while airborne building companions remain finite and
  formula-owned.
- No unsupported card leaked `live` or `bound`.
- Broad arbitrary floor layer reorder value invariance remains
  unclaimed.
- No blocked source family or formula scope was reopened.

## Current Validation

Final closeout validation:

- targeted closeout contract:
  - `pnpm --filter @dynecho/engine exec vitest run src/post-floor-layer-order-gate-c-v1-next-slice-selection-contract.test.ts --maxWorkers=1`
  - 1 file / 4 tests green
- targeted consistency rerun after the master-plan grid status wording
  was corrected to keep the executable coverage contract honest:
  - `coverage-grid-consistency.test.ts` +
    `post-floor-layer-order-gate-c-v1-next-slice-selection-contract.test.ts`
  - 2 files / 9 tests green

- `pnpm calculator:gate:current`
  - engine focused gate: 83 files / 385 tests green
  - web focused gate: 36 files / 170 passed + 18 skipped
  - build: 5/5 tasks with known non-fatal `sharp/@img` warnings
  - whitespace guard: clean
- `pnpm check`
  - lint: green
  - typecheck: green
  - engine full suite: 216 files / 1205 tests green
  - web full suite: 150 files / 864 passed + 18 skipped
  - build: 5/5 tasks with known non-fatal `sharp/@img` warnings
- `pnpm --filter @dynecho/web typecheck`
  - green after build
- `git diff --check`
  - clean

## Selected Next Slice

Next selected calculator slice:
`all_caller_invalid_thickness_guard_v1`.

Planning surface:
[SLICE_ALL_CALLER_INVALID_THICKNESS_GUARD_PLAN.md](./SLICE_ALL_CALLER_INVALID_THICKNESS_GUARD_PLAN.md).

Why this is next:

- The layer-order audit found no concrete runtime/card drift.
- `MASTER_PLAN.md` D3 requires invalid thickness to produce specific
  warnings and defended fail-closed outputs.
- The cross-cutting implementation grid still marks engine thickness
  validity as partial because all direct floor/wall callers are not yet
  audited behind a standalone guard.
- This improves calculation honesty and robustness without reopening
  source-blocked families or retuning formulas.

First action:

Add Gate A no-runtime direct engine inventory for invalid thickness
across representative floor and wall caller paths.
