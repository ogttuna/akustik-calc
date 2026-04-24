# Checkpoint - 2026-04-24 Floor Field Continuation Closeout

Status: checkpoint handoff

## What Closed

`floor_field_continuation_expansion_v1` is closed as a no-runtime audit.

Gate A landed the executable inventory:

- engine: `packages/engine/src/floor-field-continuation-gate-a-matrix.test.ts`
- web cards:
  `apps/web/features/workbench/floor-field-continuation-gate-a-card-matrix.test.ts`

Gate B was not required. The inventory did not find runtime/card drift
that justified a floor continuation fix.

Gate C added:

- `packages/engine/src/post-floor-field-continuation-gate-c-v1-next-slice-selection-contract.test.ts`
- the new active plan
  `docs/calculator/SLICE_FLOOR_MANY_LAYER_STRESS_REGRESSION_PLAN.md`

## Findings Preserved

- Lab mode parks field airborne outputs (`R'w`, `Dn,w`, `Dn,A`,
  `DnT,w`, `DnT,A`) as missing field/building input at the card layer.
- Field-between-rooms with partition geometry unlocks `R'w`, `Dn,w`,
  and `Dn,A`.
- `DnT,w` and `DnT,A` remain receiving-room-volume gated until
  building context.
- Building impact continuations unlock `L'n,w` and `L'nT,w` only when
  the active impact lane exists.
- Raw bare open-web impact remains fail-closed; airborne field
  companions remain formula-owned where physical input is present.
- No `GDMTXA04A`, `C11c`, raw bare source-family,
  reinforced-concrete, or formula-scope reopening happened.

## Next Selected Slice

`floor_many_layer_stress_regression_v1`.

Reason: the master plan requires 50+ layer stacks to return defended
answers or fail closed. Wall many-layer behavior is pinned, but floor
50+ stress coverage remained a documented hardening gap. This directly
matches the user/operator risk of very large layer stacks without
reopening source-blocked families.

The first gate is a no-runtime Gate A inventory of current floor 50+
layer behavior across exact/formula/helper and blocked/fail-closed
families.

## Boundaries

- Do not reopen `GDMTXA04A`, `C11c`, raw open-box/open-web impact,
  reinforced-concrete formula scope, wall selector behavior, or timber
  formula scope from nearby green tests.
- Do not claim arbitrary floor reorder value invariance; floor order is
  physically meaningful unless a narrower selected slice proves a
  specific invariant.
- `project_access_policy_route_integration_v1` remains deferred, not
  cancelled.

## Executable Evidence

Baseline before closeout:

- `pnpm calculator:gate:current`
  - engine focused gate: 78 files / 371 tests
  - web focused gate: 34 files / 168 passed + 18 skipped
  - build: 5/5 tasks with known non-fatal `sharp/@img` warnings
  - whitespace guard: clean

Closeout evidence added:

- `pnpm --filter @dynecho/engine exec vitest run src/post-floor-field-continuation-gate-c-v1-next-slice-selection-contract.test.ts --maxWorkers=1`
  - 1 file / 4 tests green
- `pnpm calculator:gate:current`
  - engine focused gate: 79 files / 375 tests
  - web focused gate: 34 files / 168 passed + 18 skipped
  - build: 5/5 tasks with known non-fatal `sharp/@img` warnings
  - whitespace guard: clean
- `pnpm --filter @dynecho/web typecheck` after build to restore the
  generated Next route-type reference
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
- `docs/calculator/SLICE_FLOOR_FIELD_CONTINUATION_EXPANSION_PLAN.md`
- `docs/calculator/SLICE_FLOOR_MANY_LAYER_STRESS_REGRESSION_PLAN.md`
- `tools/dev/run-calculator-current-gate.ts`
- this checkpoint file
