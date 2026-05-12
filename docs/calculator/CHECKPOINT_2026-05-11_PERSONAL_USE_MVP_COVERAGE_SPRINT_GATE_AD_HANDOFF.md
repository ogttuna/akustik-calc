# Gate AD Broad Revalidation And Internal Pilot Handoff - 2026-05-11

## Landed Gate

`gate_ad_personal_use_mvp_flat_multicavity_broad_revalidation_and_internal_pilot_rehearsal_plan`

## Selection Status

`gate_ad_personal_use_mvp_broad_revalidation_landed_selected_flat_multicavity_solver_broadening_gate_ae`

## Selected Next Action

`gate_ae_personal_use_mvp_flat_multicavity_solver_broadening_plan`

## Selected Next File

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ae-flat-multicavity-solver-broadening-contract.test.ts`

## What Changed

Gate AD is a no-runtime revalidation and planning gate. It does not
retune any acoustic formula, promote any source row, change any
tolerance, or move the workbench/API shape.

The new executable helper is:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ad.ts`

The Gate AD contract proves:

- the Gate AA 40-row matrix remains gap-free;
- all 40 rows are classified for company-internal pilot use as
  pilot-ready numeric, controlled-use numeric, or blocked;
- the visible Gate AC flat multicavity topology surface stays connected;
- the complete grouped flat/many-layer wall remains explicit but still
  source-absent screening;
- field/building, opening `STC`, ASTM/IIC, floor polish, and broad
  source crawling remain lower ROI than the next algorithmic wall solver
  lane.

## Runtime Boundary

Gate AD keeps the complete flat/many-layer grouped topology pinned at:

- `Rw 38`
- `STC 38`
- `C -1`
- `Ctr -5.6`
- method `screening_mass_law_curve_seed_v3`
- origin `screening_fallback`
- error budget `+/-10 dB`

It also keeps the existing grouped triple-leaf solver pin unchanged:

- `Rw 50`
- `STC 55`
- `C 0.8`
- `Ctr -7.3`
- method `triple_leaf_two_cavity_frequency_solver`
- origin `family_physics_prediction`
- error budget `+/-5 dB`

The important finding is not a new value. It is that Gate AC has made the
flat grouped topology owner set visible, while the complete flat
multicavity stack still uses broad screening. That is now the highest-ROI
algorithmic gap.

## Internal Pilot Posture

Gate AD classifies the current 40-row matrix as:

- 23 numeric supported rows;
- 17 blocked rows with explicit `needs_input`, unsupported, basis
  boundary, or hostile-input posture;
- zero remaining `coverage_gap` rows.

This supports controlled internal pilot use for rows with exact,
source-anchored, or named family-physics methods, while keeping screening
and unsupported/blocked rows visibly labeled. It is not yet a final
high-accuracy calculator for every realistic wall/floor combination.

## Test Coverage

Gate AD adds:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ad-flat-multicavity-broad-revalidation-and-internal-pilot-rehearsal-contract.test.ts`

The tests cover:

- Gate AD metadata and Gate AE selection;
- Gate AA 40-row matrix continuity;
- pilot-ready, controlled-use, and blocked row classification;
- complete grouped flat/many-layer topology staying screening only;
- grouped triple-leaf family solver values staying pinned;
- lane ranking that selects algorithmic flat multicavity solver
  broadening over broad source crawling;
- docs, exports, and current-gate runner alignment.

Validation completed on 2026-05-11:

- focused Gate AD engine contract passed 1 file / 5 tests;
- Gate AA/AB/AC/AD engine continuity passed 4 files / 21 tests;
- Gate AC web surface parity continuity passed 2 files / 8 tests;
- engine typecheck passed;
- web typecheck passed;
- `pnpm calculator:gate:current` passed with engine 371 files / 2143
  tests, web 74 files / 318 passed + 18 skipped, repo build 5/5, and
  whitespace guard clean;
- `git diff --check` passed.

The Next build still reports the known optional `sharp/@img` package
warnings from the DOCX path, but it exits successfully.

## Next Step

Gate AE should implement a bounded flat multicavity solver-broadening
contract. It should start from the now-visible grouped topology owner set
and the existing double/triple-leaf physics paths, then replace broad
screening for complete source-absent flat multicavity wall stacks only
when the solver can name its method, basis, supported outputs, and error
budget. It should not autogroup ambiguous flat layer lists and should not
pull broad source rows as the primary fix.
