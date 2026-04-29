# Checkpoint - Internal Use Acceptance Rehearsal Gate A Handoff

Date: 2026-04-29

## Summary

`internal_use_acceptance_rehearsal_v1` Gate A landed as a no-runtime
company-internal acceptance matrix. It turns the closed operating
envelope into executable representative scenarios covering ready
benchmark/source corridors, caveated formula/screening routes,
fail-closed/source-gated cases, and hostile many-layer/reorder/
missing-input proof owners.

No acoustic formulas, runtime values, support classes, confidence
classes, evidence tiers, API shape, route-card values, output-card
statuses, proposal/report copy, or workbench input behavior changed.

## Implementation

Executable Gate A contract:

`packages/engine/src/internal-use-acceptance-rehearsal-v1-gate-a-contract.test.ts`

Focused gate runner update:

`tools/dev/run-calculator-current-gate.ts`

Planning surfaces updated:

- `docs/calculator/SLICE_INTERNAL_USE_ACCEPTANCE_REHEARSAL_V1_PLAN.md`
- `docs/calculator/NEXT_IMPLEMENTATION_PLAN.md`
- `docs/calculator/CURRENT_STATE.md`
- `docs/calculator/INTERNAL_USE_PILOT_USAGE_NOTE.md`
- `AGENTS.md`

## Gate A Decision

Gate A selected Gate C closeout / next-slice selection:

`packages/engine/src/post-internal-use-acceptance-rehearsal-v1-next-slice-selection-contract.test.ts`

Reason: the acceptance matrix found no runtime defect and no new source
ready accuracy pack. Existing web/API proof owners already cover
visible caveat, missing-input, unsupported-output, and save/load replay
surfaces for this no-runtime rehearsal.

## Acceptance Coverage

The landed matrix pins:

- ready wall benchmarks: LSF exact preset, AAC single-leaf, masonry
  single-leaf;
- ready floor corridors: Pliteq exact source stack and UBIQ bound source
  stack, without collapsing exact and bound evidence into one truth;
- caveated generated routes: timber double-board, CLT local,
  lined/heavy-core screening, and generated steel floor fallback;
- hostile/edge behavior: many-layer exact and raw stacks, role-defined
  floor reorder stability, raw-order support boundary, invalid thickness
  fail-closed behavior, unsupported-output partitioning, missing-input
  proof owners, no-stud source gating, historical blocked floor family
  proof owners, and mixed study-mode save/load proof owner.

## Validation

- targeted Gate A engine contract green: 1 file / 7 tests;
- focused `pnpm calculator:gate:current` green after runner sync:
  engine 137 files / 656 tests, web 45 files / 216 passed + 18 skipped,
  build 5/5 with known non-fatal `sharp/@img` warnings, whitespace guard
  clean;
- broad `pnpm check` was not rerun for this handoff because Gate A is
  no-runtime/no-web-behavior. Latest broad remains the 2026-04-29 CLT /
  mass-timber Gate C broad green run.

## Next Action

Implement Gate C closeout / next-slice selection. Gate C should close
this slice unless the landed acceptance matrix identifies a concrete
acceptance defect or a genuinely source-ready accuracy pack becomes
available.
