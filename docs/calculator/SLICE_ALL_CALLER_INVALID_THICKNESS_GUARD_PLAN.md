# Slice Plan - All-Caller Invalid Thickness Guard v1

Status: ACTIVE (selected 2026-04-24; Gate A next)

## Objective

Close the remaining cross-cutting calculator robustness gap around
invalid layer thickness for direct engine callers.

Workbench row normalization already catches common invalid text input,
and the wall hostile-input matrix pins several direct wall classes. The
remaining risk is narrower but important: code that bypasses workbench
normalization must not be able to get a defended-looking answer from
`0`, negative, `NaN`, `Infinity`, or otherwise non-finite thicknesses.
The calculator should either return a specifically labeled fail-closed
answer or preserve an already-supported warning/output posture without
crashes, `NaN`, `undefined`, or unsupported live leakage.

## Non-Goals

- Do not change defended numeric values for valid floor or wall stacks.
- Do not broaden source-family support.
- Do not reopen `GDMTXA04A`, `C11c`, raw bare open-box/open-web impact,
  wall-selector behavior, reinforced-concrete formula scope, or timber
  wall exact-row follow-ups.
- Do not normalize physical layer order, merge layers, or retune
  formulas as part of this guard.
- Do not make invalid thickness estimate-owned; invalid input must be
  explicit and fail closed where it cannot be safely interpreted.
- Do not resume `project_access_policy_route_integration_v1` until this
  selected calculator slice closes or priority explicitly changes.

## Why This Slice Is High ROI

The latest broad check is green, and the floor layer-order audit found
no runtime drift. The next highest-value calculator move is therefore a
small cross-cutting correctness guard that maps directly to
`MASTER_PLAN.md` D3 and the §3 cross-cutting grid:

- D3 requires invalid `0`, negative, non-numeric, `NaN`, and `Infinity`
  thicknesses to produce specific warnings and defended fail-closed
  outputs.
- The grid still marks engine thickness validity as partial because
  direct all-caller floor/wall engine coverage remains deferred.
- This improves accuracy honesty rather than cosmetic behavior: hostile
  direct callers must not receive plausible-looking values from invalid
  physical input.

## Current Baseline

- `apps/web/features/workbench/normalize-rows.test.ts` and the
  workbench route/card tests cover user-facing row normalization.
- `packages/engine/src/raw-wall-hostile-input-answer-matrix.test.ts`
  pins direct wall hostile-input classes, including invalid thickness.
- `packages/engine/src/raw-floor-hostile-input-answer-matrix.test.ts`
  and related floor route/card matrices pin important floor hostile
  surfaces, but they are not yet a standalone all-caller guard.
- `MASTER_PLAN.md` still lists engine thickness validity as partial
  because callers that bypass workbench normalization need a dedicated
  cross-cutting audit.

## Gate Plan

### Gate A - inventory current direct invalid-thickness surfaces

Status: NEXT.

No runtime change. Add a direct engine matrix that exercises both floor
and wall callers with representative invalid thickness variants:

- `0`;
- negative finite value;
- `Number.NaN`;
- `Number.POSITIVE_INFINITY`;
- non-numeric input where the public type boundary allows it through
  test construction.

The matrix should pin:

- no crash;
- no non-finite output values;
- support buckets and answer origins;
- warning fragments or unsupported reasons where they carry the
  fail-closed meaning;
- floor and wall parity where the same invalid physical condition enters
  different caller paths.

### Gate B - add a guard only for concrete drift

Status: conditional.

Open Gate B only if Gate A proves that any direct caller can produce a
crash, `NaN`, `Infinity`, `undefined`, unsupported live leakage, or a
defended-looking value without a specific invalid-thickness warning.

Valid Gate B fixes:

- add or reuse a central layer-thickness validation helper at the
  engine boundary;
- make direct floor/wall callers fail closed consistently;
- keep existing valid-stack values unchanged;
- preserve workbench normalization semantics.

Invalid Gate B fixes:

- broad formula retunes;
- source-family reopening;
- layer-order normalization;
- changing valid-stack outputs to make invalid inputs easier to handle.

### Gate C - closeout and next-slice selection

Close after targeted tests, `pnpm calculator:gate:current`, broad
`pnpm check`, web typecheck after build, and `git diff --check` are
green. If Gate B changes runtime behavior, document exact invalid-input
behavior changes and prove that valid defended values stayed stable.

## Immediate Next Steps

1. Run the current focused gate as the baseline.
2. Add the Gate A direct engine invalid-thickness inventory.
3. If Gate A finds concrete drift, implement the smallest central guard
   and add regression assertions before changing runtime.
4. Update `CURRENT_STATE.md`, `NEXT_IMPLEMENTATION_PLAN.md`, this plan,
   and the checkpoint together.
5. Close only on focused + broad green validation.

## Validation

Minimum:

- targeted Gate A engine invalid-thickness matrix;
- existing floor/wall hostile-input matrices touched by the same caller
  path;
- `pnpm calculator:gate:current`;
- `pnpm check`;
- `pnpm --filter @dynecho/web typecheck` after build;
- `git diff --check`.

## Completion Criteria

- direct floor and wall engine callers are audited for invalid
  thickness;
- invalid thickness never yields a crash, non-finite output, or
  unsupported live leakage;
- valid defended stacks keep their current values;
- workbench normalization assumptions stay honest;
- blocked-source families remain blocked;
- the next selected slice is recorded in a post-contract test.
