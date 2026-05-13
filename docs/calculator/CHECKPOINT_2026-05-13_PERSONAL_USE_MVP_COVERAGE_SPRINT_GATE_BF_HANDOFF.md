# Personal-Use MVP Coverage Sprint Gate BF Handoff

Date: 2026-05-13

## Landed Gate

Gate BF has now landed:

`gate_bf_personal_use_mvp_floor_impact_source_absent_input_surface_plan`

Gate BF selection status:

`gate_bf_personal_use_mvp_floor_impact_source_absent_input_surface_landed_selected_revalidation_gate_bg`

Selected next action:

`gate_bg_personal_use_mvp_floor_impact_source_absent_post_input_surface_revalidation_plan`

Selected next file:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bg-floor-impact-source-absent-post-input-surface-revalidation-contract.test.ts`

## What Changed

Gate BF makes the `Heavy concrete combined input surface` first-class on
the Dynamic Calculator floor route for complete lab `Ln,w` / `DeltaLw`
requests. Workbench controls, scenario analysis, local saved replay,
server snapshot replay, calculator API payloads, impact-only API
payloads, output cards, and Markdown report payloads now feed the same
Gate BD runtime predictor input.

Complete UI-derived heavy-concrete combined input still returns lab
`Ln,w 44.4` / `DeltaLw 30.1` through
`predictor_heavy_combined_upper_lower_floor_iso12354_annexc_estimate`.
The source-absent not-measured budgets stay frozen at `+/-6.5 dB` for
`Ln,w` and `+/-5.5 dB` for `DeltaLw`.

## Boundaries

Gate BF does not promote source rows, retune formulas, change
tolerances, or add field/building/ASTM adapters. Exact source
precedence remains first. Missing slab, load, resilient dynamic
stiffness, or lower ceiling assembly fields return `needs_input` with
precise physical-field labels. Duplicate or ambiguous heavy-concrete
base ownership is parked as unsafe topology. Existing heavy floating,
steel, timber/CLT, airborne field/building, and ASTM/IIC boundaries
remain separate.

## Next Step

Gate BG should revalidate the post-input-surface floor-impact lane as a
no-runtime gate. It should prove Gate BF did not move `Ln,w 44.4`,
`DeltaLw 30.1`, source-absent budgets, exact source precedence, hostile
input boundaries, or lab/field/building/ASTM basis boundaries before
selecting the next highest-ROI calculator coverage lane.

## Validation

Gate BF validation passed on 2026-05-13:

- focused Gate BF engine contract: 1 file / 5 tests;
- focused web heavy-concrete combined input-surface acceptance: 1 file /
  3 tests;
- server snapshot replay coverage for the added floor input fields:
  1 file / 4 tests;
- engine typecheck and web typecheck clean;
- `pnpm calculator:gate:current` green with engine 399 files / 2310
  tests, web 77 files / 328 passed + 18 skipped, repo build 5/5, and
  whitespace guard clean;
- full `pnpm check` green with lint/typecheck clean, engine 524 files /
  3112 tests, web 184 files / 1006 passed + 18 skipped, and build 5/5.

The first broad `pnpm check` attempt exposed timeout-only failures in
three pre-existing long-running engine tests under full-suite load.
Those tests now have explicit long-test timeouts; their behavior was
rerun directly and then passed in the full check without runtime value
movement.

Known non-fatal build warnings remain the existing optional
`sharp/@img` resolution warnings from `@turbodocx/html-to-docx`; they
did not fail the build.
