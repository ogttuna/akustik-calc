# Checkpoint - Company-Internal Matrix V6 After A-Weighted Surface Parity

Date: 2026-05-15

## Landed

`company_internal_calculation_grade_mainline_matrix_v6_refresh_after_opening_leak_a_weighted_surface_parity_plan`
has landed with selection status
`company_internal_calculation_grade_mainline_matrix_v6_refresh_after_opening_leak_a_weighted_surface_parity_landed_selected_boundary_revalidation`.

Matrix V6 is a matrix/documentation refresh only. It does not move
runtime values, formulas, tolerances, or exact-source precedence.

## Matrix Result

- Matrix rows: 71.
- Retired row: `wall.opening_leak_a_weighted_boundary.unsupported`.
- Added supported field row: `Dn,A 35.9` / `DnT,A 36.1`, source-absent
  opening/leak A-weighted field family physics, `+/-9 dB` budget.
- Added supported building row: `DnT,A 31.3`, source-absent opening/leak
  A-weighted building family physics, `+/-11 dB` budget.
- Added boundaries: building `Dn,A` unsupported, missing
  `frequencyBandSet` as precise `needs_input`, lab alias unsupported,
  ASTM alias unsupported, exact-source precedence reserved.

The refresh keeps the same values from the landed A-weighted runtime and
surface-parity work:

- field `Dn,A 35.9`;
- field `DnT,A 36.1`;
- building `DnT,A 31.3`.

## Current Next Step

Selected next action:
`company_internal_building_astm_boundary_revalidation_after_a_weighted_matrix_plan`.

Selected next file:
`packages/engine/src/company-internal-building-astm-boundary-revalidation-contract.test.ts`.

Selected next label:
building partial-context and ASTM parked-boundary revalidation.

This next step should prove the remaining parked building partial-context
and ASTM boundary rows still fail closed before the final internal-use
rehearsal.

2026-05-15 update: that next step has now landed as
`company_internal_building_astm_boundary_revalidation_after_a_weighted_matrix_plan`.
It keeps building missing-owner rows such as `sourceRoomVolumeM3` as
precise `needs_input`, keeps floor ASTM `IIC` / `AIIC` and
airborne-to-ASTM aliases unsupported, and selects
`company_internal_final_internal_use_rehearsal_after_boundary_revalidation_plan`.

## Validation

Targeted Matrix V6 validation is expected in:

`packages/engine/src/company-internal-calculation-grade-mainline-matrix-v6-contract.test.ts`

The current calculator gate should include this file through
`tools/dev/run-calculator-current-gate.ts`.
