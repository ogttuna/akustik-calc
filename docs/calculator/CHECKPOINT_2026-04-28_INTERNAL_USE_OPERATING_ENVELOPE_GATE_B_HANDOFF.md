# Checkpoint - Internal Use Operating Envelope Gate B

Date: 2026-04-28

Slice: `internal_use_operating_envelope_v1`

Gate landed:
`gate_b_regular_internal_use_visibility_audit`

## Summary

Gate B audited the regular internal-use visibility surfaces for the Gate
A pilot scenario ids and landed a focused web honesty fix.

Runtime did not move. The change is visible text only:

- wall dynamic/formula routes now say explicitly that no exact wall
  source row is active and that the result should stay
  formula-owned/source-gated scoped estimate language;
- dynamic airborne evidence citations carry the same source-gated
  posture into proposal/report surfaces;
- the generated steel floor fallback remains visibly low-confidence,
  screening-only, and unsupported for `L'nT,50`.

## Code Changes

Changed surfaces:

- `apps/web/features/workbench/validation-regime.ts`
- `apps/web/features/workbench/guided-validation-summary.ts`
- `apps/web/features/workbench/simple-workbench-evidence.ts`

New proof:

- `apps/web/features/workbench/internal-use-operating-envelope-visibility-gate-b.test.ts`
- `packages/engine/src/internal-use-operating-envelope-v1-gate-b-contract.test.ts`

The web proof covers:

- `wall_timber_double_board_generated`
- `wall_clt_local_generated`
- `wall_lined_heavy_core_screening`
- `floor_steel_fallback_generated`

## Runtime Posture

Unchanged:

- numeric runtime behavior;
- support classification;
- confidence classification;
- evidence tier;
- API shape;
- output card value/status behavior.

Changed:

- validation/evidence/proposal wording for wall dynamic formula routes.

## Selected Next Action

Gate C:
`internal_use_operating_envelope_v1_gate_c_closeout_and_next_slice_selection`

Next implementation file:

`packages/engine/src/post-internal-use-operating-envelope-v1-next-slice-selection-contract.test.ts`

Gate C should close the operating-envelope slice if no remaining
internal-use blocker is found. It should select a source-ready accuracy
slice only if a bounded source pack is actually ready; otherwise it
should select the long source-gated accuracy roadmap as planning
context.

## Validation

Targeted validation:

- `pnpm --filter @dynecho/web exec vitest run features/workbench/internal-use-operating-envelope-visibility-gate-b.test.ts --maxWorkers=1`
  - result: 1 file / 4 tests green.
- `pnpm --filter @dynecho/web exec vitest run features/workbench/guided-validation-summary.test.ts features/workbench/simple-workbench-evidence.test.ts features/workbench/consultant-decision-trail.test.ts features/workbench/clt-visible-estimate-consultant-trail-matrix.test.ts features/workbench/reinforced-concrete-low-confidence-proposal-honesty.test.ts features/workbench/internal-use-operating-envelope-visibility-gate-b.test.ts --maxWorkers=1`
  - result: 6 files / 27 tests green.
- `pnpm --filter @dynecho/engine exec vitest run src/internal-use-operating-envelope-v1-gate-b-contract.test.ts --maxWorkers=1`
  - result: 1 file / 5 tests green.

Focused current-gate validation after docs and runner updates:

- `pnpm calculator:gate:current`
  - result: engine 131 files / 618 tests green; web 45 files / 216
    passed + 18 skipped; build 5/5 with the known non-fatal
    `sharp/@img` warnings; whitespace guard clean.
