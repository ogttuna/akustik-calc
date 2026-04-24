# Checkpoint - 2026-04-24 Floor Field Continuation Gate A

Status: checkpoint handoff

## What Landed

Gate A of `floor_field_continuation_expansion_v1` landed with no runtime
change.

The slice now has an executable inventory for representative floor
field/building continuation surfaces:

- engine: `packages/engine/src/floor-field-continuation-gate-a-matrix.test.ts`
- web cards:
  `apps/web/features/workbench/floor-field-continuation-gate-a-card-matrix.test.ts`

The matrices pin lab, field-between-rooms, and building-prediction
behavior for:

- UBIQ exact supported-band open-web,
- Knauf acoustic timber exact,
- Dataholz CLT dry exact,
- reinforced-concrete low-confidence/formula,
- raw terminal concrete helper,
- raw bare open-web impact-blocked.

## Findings

- Lab mode parks field airborne outputs (`R'w`, `Dn,w`, `Dn,A`,
  `DnT,w`, `DnT,A`) as missing field/building input at the card layer.
- Field-between-rooms with partition geometry unlocks `R'w`, `Dn,w`,
  and `Dn,A`.
- `DnT,w` and `DnT,A` remain receiving-room-volume gated until
  building context.
- Building impact continuations unlock `L'n,w` and `L'nT,w` only when
  the active impact lane exists.
- The raw bare open-web representative remains impact fail-closed; its
  airborne field companions are formula-owned and still live where
  physical input is present.
- No `GDMTXA04A`, `C11c`, raw bare source-family, reinforced-concrete,
  or formula-scope reopening happened.

## Implementation Vs Plan

Gate A asked for a no-runtime inventory of current floor continuation
surfaces. That is now executable in both engine and web-card layers.

Gate A did not identify a required Gate B fix. Gate B should stay a
contingency only: reopen it if the focused current gate or a later
targeted review finds concrete drift.

## Executable Evidence

Targeted tests passed:

- `pnpm --filter @dynecho/engine exec vitest run src/floor-field-continuation-gate-a-matrix.test.ts --maxWorkers=1`
  - 1 file / 2 tests green
- `pnpm --filter @dynecho/web exec vitest run features/workbench/floor-field-continuation-gate-a-card-matrix.test.ts --maxWorkers=1`
  - 1 file / 2 tests green

Focused current gate passed after the Gate A matrices were added:

- `pnpm calculator:gate:current`
  - engine focused gate: 78 files / 371 tests
  - web focused gate: 34 files / 168 passed + 18 skipped
  - build: 5/5 tasks with the known non-fatal `sharp/@img` warnings
  - whitespace guard: clean
- `pnpm --filter @dynecho/web typecheck` green after build to restore the
  generated Next route-type reference.

## Next Action

Close `floor_field_continuation_expansion_v1` as a no-runtime audit and
write the next-slice selection contract/checkpoint. Reopen Gate B only if
a later review finds concrete drift that the Gate A inventory missed.

## Documents Updated In This Checkpoint

- `AGENTS.md`
- `docs/calculator/NEXT_IMPLEMENTATION_PLAN.md`
- `docs/calculator/CURRENT_STATE.md`
- `docs/calculator/SLICE_FLOOR_FIELD_CONTINUATION_EXPANSION_PLAN.md`
- `tools/dev/run-calculator-current-gate.ts`
- this checkpoint file
