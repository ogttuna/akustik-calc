# Personal-Use MVP Coverage Sprint Gate X Broad Revalidation Handoff - 2026-05-11

## Status

Post-Gate X broad revalidation is complete.

Current selected status remains:

`gate_x_personal_use_mvp_aac_nonhomogeneous_masonry_wall_family_solver_landed_selected_clt_ctr_gate_y`

Selected next action remains:

`gate_y_personal_use_mvp_clt_mass_timber_ctr_spectrum_adapter_plan`

Selected next file remains:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-y-clt-mass-timber-ctr-spectrum-adapter-contract.test.ts`

This pass did not move acoustic runtime values, formula coefficients,
tolerances, source precedence, or lab/field/building basis rules.

## What The Broad Check Found

The broad `pnpm check` pass found stale strictness around already-landed
contracts, not a new acoustic runtime failure:

- engine lint caught unused Gate R / Gate S cleanup after previous
  refactors;
- web lint caught an unescaped `R'w` JSX text literal and unused imports
  in visible-surface tests;
- proposal honesty expectations still used the older `Field
  continuation` label even though the landed surface now labels those
  live field outputs as `Airborne field-context prediction`;
- wall-selector card matrix still expected incomplete
  `building_prediction` cases to show live `R'w` / `DnT,w` cards, even
  though the current candidate resolution is `needs_input` until
  source-room volume, flanking/junction class, conservative flanking
  assumption, junction coupling length, and building output basis are
  owned.

Those fixes align tests and copy with current runtime contracts. They
do not broaden support buckets or expose hidden numbers.

## Validation

Completed validation:

- `pnpm --filter @dynecho/engine lint` passed after engine cleanup;
- `pnpm --filter @dynecho/web lint` passed after web cleanup;
- focused proposal honesty:
  `pnpm --filter @dynecho/web exec vitest run features/workbench/simple-workbench-proposal-generated-document-honesty.test.ts --maxWorkers=1`
  passed 1 file / 3 tests;
- focused wall-selector matrix:
  `pnpm --filter @dynecho/web exec vitest run features/workbench/wall-selector-output-origin-card-matrix.test.ts --maxWorkers=1`
  passed 1 file / 1 test;
- final broad `pnpm check` passed:
  - lint passed across repo and 5 packages;
  - typecheck passed across repo and 5 packages;
  - engine tests passed 490 files / 2911 tests;
  - web tests passed 179 files / 989 passed + 18 skipped;
  - build passed 5/5 tasks.

Known non-fatal warnings remain unchanged:

- Zustand persist storage is unavailable in some web test environments;
- optional `sharp/@img` package resolution warnings appear during the
  Next production build through `@turbodocx/html-to-docx`.

## Analysis

Gate X remains the correct landed state. The AAC / non-homogeneous
masonry row is no longer a `screening_fallback`; it is a named
`family_physics_prediction` route with the same pinned `Rw 44 / STC 44 /
C -0.7 / Ctr -5.2` values and `+/-6 dB` budget. The broad suite confirms
that adjacent-swap, deep-hybrid, family-boundary, input-surface,
proposal/report, server snapshot, API, and build surfaces still agree.

The highest-ROI next step is still Gate Y, not source crawling. Gate W
identified the remaining immediate matrix gap as CLT / mass-timber wall
`Ctr` spectrum adaptation. Gate X closed the AAC gap by adding a bounded
family solver; Gate Y should do the same style of bounded, basis-explicit
algorithmic work for CLT / mass-timber `Ctr` instead of waiting on a
finite source catalog.

## Gate Y Start Instructions

Start Gate Y from the selected contract file:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-y-clt-mass-timber-ctr-spectrum-adapter-contract.test.ts`

Gate Y should:

1. Keep Gate X runtime values and AAC route posture unchanged.
2. Add a named CLT / mass-timber wall `Ctr` spectrum-adapter contract
   only where the lab wall family owns enough curve/spectrum inputs.
3. Preserve exact-source precedence and reject lab-to-field/building
   aliasing.
4. Keep missing CLT material/spectrum inputs as `needs_input`; do not
   infer a high-confidence `Ctr` from `Rw` or `STC` alone.
5. Continue the companion-module pattern because
   `packages/engine/src/calculator-personal-use-mvp-coverage-sprint.ts`
   is 1985 lines after this cleanup.
6. Validate with focused Gate Y tests, W/X/Y continuity, engine
   typecheck, and then at least `pnpm calculator:gate:current`; run
   broad `pnpm check` again if Gate Y changes shared surfaces, report
   parity, APIs, or route/card output posture.

