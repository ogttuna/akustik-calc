# Checkpoint - Floor Fallback Low-Confidence Gate A

Date: 2026-04-27

## Status

`floor_fallback_low_confidence_cleanup_v1` Gate A has landed
no-runtime.

No runtime values, formulas, output support, confidence classes, or web
cards changed. The new executable audit contract pins the current
`floor.steel_fallback_low_confidence.field` / generated
`floor-steel-fallback` lane before any Gate B source/formula decision.

## Pinned Runtime Surface

Generated case:

- id: `floor-steel-fallback`;
- stack:
  `16 firestop_board + 16 firestop_board + 100 rockwool +
  120 ubiq_resilient_ceiling + 3 vinyl_flooring +
  250 steel_joist_floor`;
- exact floor match: none;
- bound floor match: none;
- estimate kind: `low_confidence`;
- origin basis: `predictor_floor_system_low_confidence_estimate`;
- fit: `28%`;
- selected trace source ids:
  `pliteq_steel_joist_250_rst02_vinyl_lab_2026`,
  `pliteq_steel_joist_250_rst12_porcelain_lab_2026`,
  `pliteq_steel_joist_250_rst02_wood_lab_2026`;
- broader estimate candidate ids also include
  `ubiq_fl32_steel_200_lab_2026` and
  `ubiq_fl32_steel_300_lab_2026`.

Lab values:

- supported outputs: `Rw`, `Ln,w`;
- unsupported outputs: `Ln,w+CI`, `DeltaLw`;
- floor-system `Rw = 61`;
- screening airborne `Rw = 72.2`, `STC = 72`, `C = -0.9`,
  `Ctr = -5.8`;
- `Ln,w = 58.3`;
- impact confidence: low,
  `published_family_estimate`, score `0.54`.

Field values:

- supported outputs: `Rw`, `R'w`, `DnT,w`, `Ln,w`, `L'n,w`,
  `L'nT,w`;
- unsupported output: `L'nT,50`;
- floor-system `Rw = 61`;
- screening airborne `Rw = 70.2`, `R'w = 70`, `STC = 70`,
  `C = -0.9`, `Ctr = -5.6`;
- `Dn,w = 69`, `DnT,w = 72`, `DnT,A = 70.6`;
- `Ln,w = 58.3`, `L'n,w = 61.3`, `L'nT,w = 58.5`;
- field continuation:
  `explicit_field_lprimenw_from_lnw_plus_k` with `K = 3 dB`
  and standardized room-volume normalization;
- impact confidence: medium,
  `published_family_estimate`, score `0.72`.

## Source Decision

Gate A does not justify runtime promotion.

Exact near misses:

- the Pliteq steel joist rows are official source rows and useful
  lineage, but the live stack does not include the required INEX deck
  or GenieMat resilient layer;
- the live stack has `ubiq_resilient_ceiling` and `rockwool`, while the
  Pliteq exact rows require resilient-channel style ceiling support and
  `glasswool`;
- the live vinyl layer is `3 mm`, while the closest vinyl exact row is
  `2.5 mm`.

Bound near misses:

- the UBIQ FL-32 rows are official bound rows for `200 mm` and
  `300 mm` steel joist / purlin systems, not the live `250 mm` stack;
- they require INEX deck and engineered timber floor coverage;
- they explicitly omit `ceiling_fill`, while the live stack contains
  `100 mm rockwool`.

Allowed Gate B changes only if Gate B names one of:

- an exact source row that matches roles, materials, thicknesses, and
  context;
- a bounded steel/open-web family rule with source anchors, tolerance,
  and exact-row precedence;
- a fail-closed correction where an output looks defended but lacks
  evidence.

Do not add `L'nT,50` support without a source, bound, or explicit
formula basis.

## Executable Evidence

New contract:

- `packages/engine/src/floor-fallback-low-confidence-gate-a-audit-contract.test.ts`

Existing evidence kept in scope:

- `packages/engine/src/realistic-layer-combination-coverage-cartography.test.ts`
- `packages/engine/src/raw-floor-screening-carrier-support.test.ts`
- `packages/engine/src/floor-source-corpus-contract.test.ts`
- `apps/web/features/workbench/raw-floor-screening-route-support.test.ts`
- `apps/web/features/workbench/reinforced-concrete-low-confidence-impact-panels.test.ts`
- `apps/web/features/workbench/impact-result-panel.tsx`
- `apps/web/features/workbench/result-summary.tsx`

## Validation

Gate A targeted validation:

- `pnpm --filter @dynecho/engine exec vitest run src/floor-fallback-low-confidence-gate-a-audit-contract.test.ts --maxWorkers=1`
  - 1 file / 4 tests green.

Post-Gate A focused validation:

- `pnpm calculator:gate:current`
  - engine focused gate: 95 files / 432 tests green;
  - web focused gate: 36 files / 170 passed + 18 skipped;
  - build 5/5 with the known non-fatal `sharp/@img`
    optional-package warnings;
  - whitespace guard clean.

## Next Step

Start Gate B for `floor_fallback_low_confidence_cleanup_v1` as a
source/formula decision. The default expectation after Gate A is
no-runtime unless Gate B can name exact evidence, a bounded family rule,
or a fail-closed correction.

If Gate B remains no-runtime, close this slice explicitly and select
`ui_input_output_honesty_v1`.
