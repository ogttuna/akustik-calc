# Checkpoint - Floor Fallback Low-Confidence Gate C Closeout

Date: 2026-04-27

## Status

`floor_fallback_low_confidence_cleanup_v1` is closed at Gate C.

No runtime values, formulas, confidence classes, supported outputs,
unsupported outputs, warnings, or web cards changed in Gate C. Gate A
and Gate B were both no-runtime and together proved that the selected
`floor-steel-fallback` lane should stay low-confidence until new source
evidence or a bounded family rule exists.

## Closeout Decision

Kept runtime posture for generated `floor-steel-fallback`:

- evidence tier: `screening`;
- estimate kind: `low_confidence`;
- fit: `28%`;
- origin basis: `predictor_floor_system_low_confidence_estimate`;
- field impact basis:
  `mixed_predicted_plus_estimated_standardized_field_volume_normalization`;
- field values remain `R'w = 70`, `Ln,w = 58.3`,
  `L'n,w = 61.3`, `L'nT,w = 58.5`;
- supported field outputs remain `Rw`, `R'w`, `DnT,w`, `Ln,w`,
  `L'n,w`, `L'nT,w`;
- unsupported field output remains `L'nT,50`.

Closed because:

- no exact Pliteq source topology matches the live stack;
- no UBIQ FL-32 bound topology matches the live stack;
- no bounded steel/open-web family rule was named;
- `L'nT,50`, lab `Ln,w+CI`, and lab `DeltaLw` are already explicit
  unsupported outputs;
- existing engine and web surfaces already expose low-confidence
  posture for this lane.

## Executable Evidence

Gate A:

- `packages/engine/src/floor-fallback-low-confidence-gate-a-audit-contract.test.ts`

Gate B:

- `packages/engine/src/floor-fallback-low-confidence-gate-b-source-contract.test.ts`

Gate C:

- `packages/engine/src/post-floor-fallback-low-confidence-gate-c-next-slice-selection-contract.test.ts`

Gate C is also now part of:

- `tools/dev/run-calculator-current-gate.ts`

## Next Slice

Active slice is now `ui_input_output_honesty_v1`.

Start from:

- `docs/calculator/SLICE_UI_INPUT_OUTPUT_HONESTY_PLAN.md`

First action:

- Gate A inventory of required inputs, output support, origin/confidence
  visibility, unsupported-output display, and edit/save/load stability;
- no runtime math change by default;
- change runtime only if Gate A finds a defended-looking unsupported or
  invalid answer that must fail closed.

Keep `project_access_policy_route_integration_v1` deferred until this
calculator readiness slice closes or priority explicitly changes.

## Validation

Pre-closeout focused baseline:

- `pnpm calculator:gate:current`
  - engine focused gate: 96 files / 436 tests green;
  - web focused gate: 36 files / 170 passed + 18 skipped;
  - build 5/5 with the known non-fatal `sharp/@img`
    optional-package warnings.

Post-closeout validation:

- `pnpm --filter @dynecho/engine exec vitest run src/post-floor-fallback-low-confidence-gate-c-next-slice-selection-contract.test.ts --maxWorkers=1`
  - 1 file / 4 tests green.
- `pnpm calculator:gate:current`
  - engine focused gate: 97 files / 440 tests green;
  - web focused gate: 36 files / 170 passed + 18 skipped;
  - build 5/5 with the known non-fatal `sharp/@img`
    optional-package warnings;
  - whitespace guard clean.
- `pnpm check`
  - lint green;
  - typecheck green;
  - engine broad suite: 230 files / 1260 tests green;
  - web broad suite: 150 files / 864 passed + 18 skipped;
  - build 5/5 with the known non-fatal `sharp/@img`
    optional-package warnings.
- `git diff --check` is clean.
