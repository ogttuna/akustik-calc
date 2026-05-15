# Checkpoint - Company-Internal Building/ASTM Boundary Revalidation

Date: 2026-05-15

## Landed

`company_internal_building_astm_boundary_revalidation_after_a_weighted_matrix_plan`
has landed with selection status
`company_internal_building_astm_boundary_revalidation_after_a_weighted_matrix_landed_selected_final_internal_use_rehearsal`.

This is a no-runtime revalidation after Matrix V6. It does not move
field `Dn,A 35.9`, field `DnT,A 36.1`, building `DnT,A 31.3`, any
formula, any tolerance, or exact-source precedence.

## Revalidated Boundaries

- `wall.opening_leak_building_missing_owner.needs_input` stays
  `needs_input` with `sourceRoomVolumeM3` named, no value pins, and no
  building budget.
- `wall.building_prediction_partial_context.needs_input` stays
  `needs_input` with source-room, flanking/junction, conservative
  assumption, coupling-length, and output-basis owners named, no value
  pins, and no building budget.
- `floor.astm_iic_aiic_boundary.unsupported`,
  `floor.lightweight_steel_suspended_ceiling_astm.unsupported`, and
  `floor.reinforced_concrete_combined_astm_iic.unsupported` keep ASTM
  `IIC` / `AIIC` unsupported without aliasing ISO `Ln,w` or `DeltaLw`.
- `wall.opening_leak_a_weighted_astm_alias.unsupported` keeps airborne
  `Dn,A` / `DnT,A` separate from impact ASTM `IIC` / `AIIC`.

## Current Next Step

Selected next action:
`company_internal_final_internal_use_rehearsal_after_boundary_revalidation_plan`.

Selected next file:
`packages/engine/src/company-internal-final-internal-use-rehearsal-contract.test.ts`.

Selected next label:
final internal-use rehearsal and operating envelope.

The next step should run the final company-internal operating-envelope
rehearsal now that Matrix V6 values and the remaining building/ASTM
boundaries are stable.

## Validation

Targeted boundary revalidation is expected in:

`packages/engine/src/company-internal-building-astm-boundary-revalidation-contract.test.ts`

The current calculator gate should include this file through
`tools/dev/run-calculator-current-gate.ts`.
