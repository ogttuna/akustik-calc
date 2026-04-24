# Checkpoint - 2026-04-24 Floor Many-Layer Closeout

Status: checkpoint handoff

## What Closed

`floor_many_layer_stress_regression_v1` is closed as a no-runtime Gate A
audit.

Gate A landed the executable 50+ layer inventory:

- engine:
  `packages/engine/src/floor-many-layer-stress-gate-a-matrix.test.ts`
- web cards:
  `apps/web/features/workbench/floor-many-layer-stress-gate-a-card-matrix.test.ts`

Gate B was not required. The inventory did not find runtime/card drift
that justified a many-layer fix.

Gate C added:

- `packages/engine/src/post-floor-many-layer-gate-c-v1-next-slice-selection-contract.test.ts`
- the new active plan
  `docs/calculator/SLICE_FLOOR_LAYER_ORDER_EDIT_STABILITY_PLAN.md`

## Findings Preserved

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

## Next Selected Slice

`floor_layer_order_edit_stability_v1`.

Reason: after the many-layer risk was pinned, the next direct operator
risk is layer movement/reordering. The new slice is intentionally not a
claim that every floor order is value-invariant. It will audit
explicit-role reorder stability separately from raw/order-sensitive
fail-closed behavior.

The first gate is a no-runtime Gate A inventory of current floor
layer-order edit behavior across tagged exact rows, raw helper rows, and
raw blocked-impact rows.

## Boundaries

- Do not reopen `GDMTXA04A`, `C11c`, raw open-box/open-web impact,
  reinforced-concrete formula scope, wall selector behavior, or timber
  formula scope from nearby green tests.
- Do not claim raw or arbitrary floor layer reorder value invariance.
- `project_access_policy_route_integration_v1` remains deferred, not
  cancelled.

## Executable Evidence

Baseline before closeout:

- `pnpm calculator:gate:current`
  - engine focused gate: 80 files / 376 tests
  - web focused gate: 35 files / 169 passed + 18 skipped
  - build: 5/5 tasks with known non-fatal `sharp/@img` warnings
  - whitespace guard: clean

Closeout evidence added:

- `pnpm --filter @dynecho/engine exec vitest run src/post-floor-many-layer-gate-c-v1-next-slice-selection-contract.test.ts --maxWorkers=1`
  - 1 file / 4 tests green
- `pnpm calculator:gate:current`
  - engine focused gate: 81 files / 380 tests green
  - web focused gate: 35 files / 169 passed + 18 skipped
  - build: 5/5 tasks with known non-fatal `sharp/@img` warnings
  - whitespace guard: clean
- `pnpm --filter @dynecho/web typecheck` after build to restore the
  generated Next route-type reference
  - green
- `pnpm check`
  - lint: green
  - typecheck: green after tightening the many-layer Gate A warning
    callback type
  - engine broad suite: 214 files / 1200 tests green
  - web broad suite: 149 files / 863 passed + 18 skipped
  - build: 5/5 tasks with known non-fatal `sharp/@img` warnings
- `pnpm --filter @dynecho/web typecheck` after the broad build
  - green
- `git diff --check`
  - clean

## Documents Updated In This Checkpoint

- `AGENTS.md`
- `docs/calculator/NEXT_IMPLEMENTATION_PLAN.md`
- `docs/calculator/CURRENT_STATE.md`
- `docs/calculator/MASTER_PLAN.md`
- `docs/calculator/SYSTEM_MAP.md`
- `docs/calculator/README.md`
- `docs/calculator/POST_CALCULATOR_PRODUCTIZATION_ROADMAP.md`
- `docs/calculator/SOURCE_GAP_LEDGER.md`
- `docs/calculator/SLICE_PROJECT_ACCESS_POLICY_ROUTE_INTEGRATION_PLAN.md`
- `docs/calculator/SLICE_FLOOR_MANY_LAYER_STRESS_REGRESSION_PLAN.md`
- `docs/calculator/SLICE_FLOOR_LAYER_ORDER_EDIT_STABILITY_PLAN.md`
- `packages/engine/src/floor-many-layer-stress-gate-a-matrix.test.ts`
- `packages/engine/src/coverage-grid-consistency.test.ts`
- `tools/dev/run-calculator-current-gate.ts`
- this checkpoint file
