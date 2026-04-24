# Checkpoint - 2026-04-24 Invalid Thickness Baseline Ready

Status: checkpoint handoff

## What This Checkpoint Confirms

This checkpoint is a post-commit revalidation checkpoint after
`3b2f300 chore: checkpoint calculator accuracy slices`.

No calculator runtime or test code changed in this checkpoint. The
purpose was to re-read the active docs, compare them with implementation
evidence, run the focused and broad gates, and confirm whether the
selected plan is still the right next move.

## Current Slice

Active selected calculator slice:
`all_caller_invalid_thickness_guard_v1`.

Planning surface:
[SLICE_ALL_CALLER_INVALID_THICKNESS_GUARD_PLAN.md](./SLICE_ALL_CALLER_INVALID_THICKNESS_GUARD_PLAN.md).

The plan remains correct. The implementation evidence still shows:

- workbench row normalization catches common invalid thickness input;
- wall direct invalid-thickness classes are pinned in
  `raw-wall-hostile-input-answer-matrix.test.ts`;
- floor hostile-input coverage exists, but not as a standalone
  all-caller invalid-thickness guard;
- the master-plan cross-cutting grid still correctly marks
  engine thickness validity as `Partial / active follow-up`.

Therefore the next implementation action remains Gate A: add a
no-runtime direct engine inventory across representative floor and wall
caller paths for `0`, negative, `NaN`, `Infinity`, and non-finite
thickness values.

## Validation

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
  - broad test shape remains engine 216 files / 1205 tests green and
    web 150 files / 864 passed + 18 skipped
- `pnpm --filter @dynecho/web typecheck`
  - green after build

## Plan/Implementation Comparison

No drift requiring runtime work was found.

Confirmed anchors:

- `AGENTS.md` points at `all_caller_invalid_thickness_guard_v1`.
- `NEXT_IMPLEMENTATION_PLAN.md` points at Gate A of the active slice.
- `CURRENT_STATE.md` records the latest closed slice as
  `floor_layer_order_edit_stability_v1`.
- `MASTER_PLAN.md` keeps engine thickness validity partial and ties it
  to the active invalid-thickness guard.
- `coverage-grid-consistency.test.ts` still expects the partial
  thickness-validity posture.
- `tools/dev/run-calculator-current-gate.ts` includes the current
  closeout and planning-contract evidence.

## Open Gaps

The remaining gap is intentionally narrow:

- direct floor and wall engine callers that bypass workbench
  normalization still need a single explicit inventory for invalid
  thickness behavior;
- if Gate A finds no crash, no non-finite output, no unsupported live
  leakage, and no defended-looking answer without a specific invalid
  posture, Gate B should not open;
- if Gate A finds a concrete failure, Gate B should add the smallest
  central engine-boundary guard and prove valid-stack values are
  unchanged.

Do not use this checkpoint to reopen `GDMTXA04A`, `C11c`, raw bare
open-box/open-web impact, wall-selector behavior, reinforced-concrete
formula scope, timber exact-row follow-ups, or productization route
integration by adjacency.

## Resume Instruction

Start Gate A of
[SLICE_ALL_CALLER_INVALID_THICKNESS_GUARD_PLAN.md](./SLICE_ALL_CALLER_INVALID_THICKNESS_GUARD_PLAN.md).

First concrete action:

Add a direct engine invalid-thickness inventory test that exercises both
floor and wall representative caller paths before any runtime guard is
introduced.
