# Gate AG Floor Formula Surface Polish Handoff - 2026-05-12

## Landed Gate

`gate_ag_personal_use_mvp_floor_formula_surface_polish_plan`

## Selection Status

`gate_ag_personal_use_mvp_floor_formula_surface_polish_landed_selected_opening_leak_stc_spectrum_adapter_gate_ah`

## Selected Next Action

`gate_ah_personal_use_mvp_opening_leak_stc_spectrum_adapter_plan`

## Selected Next File

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ah-opening-leak-stc-spectrum-adapter-contract.test.ts`

## What Changed

Gate AG is a no-runtime floor formula input-surface polish gate. It does
not retune steel, timber/CLT, or heavy floating-floor formulas. It moves
the shared missing-input labels for the existing floor formula lanes
into engine-owned constants and has the Dynamic Calculator workbench
warning formatters consume those constants.

The polished labels now name the physical owner more explicitly:

- steel carrier spacing is shown as `Steel carrier spacing (mm)`;
- dynamic stiffness is shown as
  `Upper resilient dynamic stiffness (MN/m3)`;
- load basis is shown as `Resilient-layer load basis (kg/m2)`;
- lower steel isolation is shown as
  `Lower ceiling isolation support form`;
- timber/CLT base family is shown as
  `Timber/CLT base floor family`.

## Runtime Boundary

Gate AG freezes all floor formula values and basis boundaries:

- steel formula remains lab `LnW 55.6` / `DeltaLw 22.4` through
  `predictor_lightweight_steel_mass_spring_holdout_corridor_estimate`;
- timber joist remains exact `Ln,w 51` plus formula `DeltaLw 25.2`;
- CLT/mass-timber remains `Ln,w 50` plus formula `DeltaLw 22.6`;
- heavy concrete floating-floor safe reorder remains
  `Ln,w 39.2` / `DeltaLw 32.6`;
- exact source rows still preempt source-absent formulas;
- field/apparent output requests still do not borrow lab `Ln,w` /
  `DeltaLw` as `L'n,w` / `L'nT,w`.

## Why Gate AH Is Next

After Gate AF closed the flat multicavity revalidation and Gate AG
closed floor formula prompt polish, the highest remaining bounded
calculator lane from the post-Gate-AE ranking is
`opening_leak_stc_spectrum_adapter`. Opening/leak lab `Rw` is already
supported, but `STC` remains unsupported because it needs a separate
rating/spectrum adapter and negative boundaries before promotion.

Broad source crawling remains blocked unless a later gate names a
specific source-owned unblocker.

## Validation

Final validation passed on 2026-05-12:

- focused Gate AG engine contract: 1 file / 4 tests;
- focused steel floor and timber/CLT web input-surface suite: 3 files /
  12 tests;
- `pnpm lint`: 5/5 package tasks passed;
- `pnpm typecheck`: 5/5 package tasks passed;
- `pnpm calculator:gate:current`: engine 374 files / 2158 tests, web
  74 files / 318 passed + 18 skipped, repo build 5/5;
- `git diff --check`: clean.

Known non-fatal warnings remain unchanged: web tests emit the existing
Zustand persist storage warnings, and the Next build emits optional
`sharp/@img` warnings from the DOCX/PDF path before completing.

## Next Step

Start Gate AH at:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ah-opening-leak-stc-spectrum-adapter-contract.test.ts`

Gate AH must keep lab/field/building bases separate. It may only promote
opening/leak `STC` if a focused contract owns the rating basis, spectrum
adapter, visible parity, and STC-only negative boundaries without
aliasing `Rw` or field/building outputs.
