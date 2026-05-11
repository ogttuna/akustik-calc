# Personal-Use MVP Coverage Sprint Gate W Handoff - 2026-05-11

## Status

Gate W has landed:

`gate_w_personal_use_mvp_coverage_matrix_refresh_after_opening_leak_plan`

Selection status:

`gate_w_personal_use_mvp_coverage_matrix_refresh_after_opening_leak_landed_selected_aac_masonry_gate_x`

Selected next action:

`gate_x_personal_use_mvp_aac_nonhomogeneous_masonry_wall_family_solver_plan`

Selected next file:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-x-aac-nonhomogeneous-masonry-wall-family-solver-contract.test.ts`

## What Changed

- Added an executable post-opening/leak coverage matrix refresh after
  Gates B-U in
  `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-w-coverage-matrix-refresh-after-opening-leak-contract.test.ts`.
- Refreshed the matrix to 28 rows: the original Gate A common/hostile
  rows plus opening/leak lab, opening/leak partial `needs_input`,
  opening/leak building-boundary, and complete building-prediction
  unsupported rows.
- Kept Gate W no-runtime: no formula coefficients, source rows, APIs,
  workbench inputs, cards, or report behavior moved.
- Re-pinned landed lanes and boundaries:
  - timber joist `Ln,w 51` plus `DeltaLw 25.2`;
  - CLT `Ln,w 50` plus `DeltaLw 22.6`;
  - lightweight steel `Ln,w 55.6` plus `DeltaLw 22.4`;
  - opening/leak lab `Rw 38.2` with `+/-6 dB`;
  - lined massive `Rw 60 / STC 60`;
  - field wall/floor outputs, exact-source precedence, ASTM/IIC
    unsupported boundary, building-prediction unsupported boundary,
    missing-input prompts, and hostile refusals.
- Tightened the matrix value-pin rule so unsupported outputs do not
  carry value pins. This prevents host-wall/screening values from
  masquerading as supported results in `needs_input` or `unsupported`
  rows.
- Re-scored the remaining lanes and selected the bounded
  AAC/non-homogeneous masonry wall family solver for Gate X. Broad
  source crawling remains unselected.

## Gate X Rationale

The refreshed matrix leaves `wall.aac_nonhomogeneous_masonry.lab` on
`screening_fallback` with `Rw 44 / STC 44 / C -0.7 / Ctr -5.2`. This
is a common element-lab wall route with low basis-leakage risk and a
ready algorithmic path. Building runtime terms, ASTM/IIC adapters,
flat-list autogrouping, CLT `Ctr`, and source-holdout acquisition remain
lower ROI or higher basis-risk for the next step.

## Architecture Note

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint.ts` is
1965 lines after Gate W. It remains under the local 2000-line split
threshold, but Gate X should split shared coverage-matrix helpers or
lane-ranking data into a small companion module before adding enough
logic to push this file over the threshold.

## Validation

- Focused Gate A/V/W continuity passed:
  `pnpm --filter @dynecho/engine exec vitest run
  src/calculator-personal-use-mvp-coverage-sprint-gate-a-scenario-matrix-contract.test.ts
  src/calculator-personal-use-mvp-coverage-sprint-gate-v-post-opening-leak-input-surface-revalidation-contract.test.ts
  src/calculator-personal-use-mvp-coverage-sprint-gate-w-coverage-matrix-refresh-after-opening-leak-contract.test.ts
  --maxWorkers=1` -> 3 files / 18 tests.
- Engine typecheck passed:
  `pnpm --filter @dynecho/engine typecheck`.
- Current calculator gate passed:
  `pnpm calculator:gate:current`.
  Engine focused gate: 364 files / 2102 tests.
  Web focused gate: 73 files / 314 passed + 18 skipped.
  Repo build: 5 tasks successful.
  Runner whitespace guard passed.
- Known non-fatal warnings stayed unchanged: Zustand persist storage
  warnings in workbench tests and optional `sharp/@img` resolution
  warnings from the proposal DOCX import path during Next build.
