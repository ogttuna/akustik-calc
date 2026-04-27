# Checkpoint - Floor Fallback Low-Confidence Gate B

Date: 2026-04-27

## Status

`floor_fallback_low_confidence_cleanup_v1` Gate B has landed
no-runtime.

No runtime values, formulas, output support, warnings, confidence
classes, or web cards changed. Gate B confirmed that the selected
`floor-steel-fallback` lane should not be promoted from
`low_confidence` without new source evidence.

## Gate B Decision

Selected generated stack:

- id: `floor-steel-fallback`;
- candidate: `floor.steel_fallback_low_confidence.field`;
- exact match: none;
- bound match: none;
- bound estimate: none;
- current lane: `predictor_floor_system_low_confidence_estimate`;
- field values remain `R'w = 70`, `Ln,w = 58.3`,
  `L'n,w = 61.3`, `L'nT,w = 58.5`;
- unsupported field output remains `L'nT,50`.

Gate B blocked exact promotion because the live stack:

- uses `ubiq_resilient_ceiling` rather than the Pliteq
  resilient-channel ceiling support;
- uses `rockwool` rather than Pliteq `glasswool`;
- has no `geniemat_rst02` / `geniemat_rst12` resilient layer;
- has no `19 mm inex_floor_panel` deck;
- uses `3 mm vinyl_flooring`, while the nearest Pliteq vinyl exact row
  is `2.5 mm`.

Gate B blocked bound promotion because the live stack:

- has no `19 mm inex_floor_panel` deck;
- uses `vinyl_flooring`, while UBIQ FL-32 rows require
  engineered timber with acoustic underlay;
- includes `100 mm ceiling_fill`, while UBIQ FL-32 bound rows omit
  ceiling fill;
- can only inherit UBIQ FL-32 as upper-bound support when the UBIQ
  bound topology is actually present.

Gate B found no fail-closed correction to make:

- `L'nT,50` is already unsupported and null;
- lab `Ln,w+CI` and `DeltaLw` are already unsupported;
- engine warnings and existing web cards already expose
  low-confidence posture.

## Source Precedence Proof

The new contract proves that source precedence is not broken:

- the true Pliteq steel-joist vinyl stack with INEX deck, GenieMat, and
  matching ceiling support lands on exact source id
  `pliteq_steel_joist_250_rst02_vinyl_lab_2026`;
- the true UBIQ FL-32 steel-joist stack lands on the existing
  `bound_interpolation` lane using
  `ubiq_fl32_steel_200_lab_2026` and
  `ubiq_fl32_steel_300_lab_2026`;
- the selected generated fallback stack lacks the critical source
  topology for both paths, so staying low-confidence is the correct
  accuracy-preserving decision.

## Executable Evidence

New contract:

- `packages/engine/src/floor-fallback-low-confidence-gate-b-source-contract.test.ts`

Existing Gate A contract:

- `packages/engine/src/floor-fallback-low-confidence-gate-a-audit-contract.test.ts`

Gate B is also now part of:

- `tools/dev/run-calculator-current-gate.ts`

## Validation

Gate B targeted validation:

- `pnpm --filter @dynecho/engine exec vitest run src/floor-fallback-low-confidence-gate-b-source-contract.test.ts --maxWorkers=1`
  - 1 file / 4 tests green.

Post-Gate B focused validation:

- `pnpm calculator:gate:current`
  - engine focused gate: 96 files / 436 tests green;
  - web focused gate: 36 files / 170 passed + 18 skipped;
  - build 5/5 with the known non-fatal `sharp/@img`
    optional-package warnings;
  - whitespace guard clean.

## Next Step

Run Gate C closeout for `floor_fallback_low_confidence_cleanup_v1`.

Because Gate B was no-runtime, Gate C should:

- keep `floor-steel-fallback` on the low-confidence lane;
- close this floor fallback slice with the blocker list above;
- select `ui_input_output_honesty_v1` as the next calculator-readiness
  slice;
- run broad `pnpm check` before committing the closeout because the
  slice closes.
