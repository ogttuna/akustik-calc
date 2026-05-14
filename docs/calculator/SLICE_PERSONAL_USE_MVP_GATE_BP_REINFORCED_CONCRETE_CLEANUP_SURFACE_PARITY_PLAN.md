# Gate BP Reinforced Concrete Cleanup Surface Parity Plan

Gate BP lands the selected no-retune surface-parity step after Gate BO.
It does not change the reinforced-concrete combined upper/lower runtime
formula. Its job is to make the Gate BO result readable and consistent
on the Dynamic Calculator surfaces.

## Landed Contract

Landed action:

`gate_bp_personal_use_mvp_reinforced_concrete_cleanup_surface_parity_plan`

Selection status:

`gate_bp_personal_use_mvp_reinforced_concrete_cleanup_surface_parity_landed_selected_matrix_refresh_gate_bq`

Selected next action:

`gate_bq_personal_use_mvp_coverage_matrix_refresh_after_reinforced_concrete_cleanup_plan`

Selected next file:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bq-coverage-matrix-refresh-after-reinforced-concrete-cleanup-contract.test.ts`

## Runtime Pins

- Complete explicit or UI-derived owner input returns lab `Ln,w 58.1`
  and `DeltaLw 13.7`.
- Runtime basis remains
  `predictor_heavy_combined_upper_lower_floor_iso12354_annexc_estimate`.
- Source-absent budgets remain `+/-6.5 dB` for `Ln,w` and
  `+/-5.5 dB` for `DeltaLw`.
- Exact source rows, bare heavy floors, upper-only floating floors,
  field/building requests, and ASTM/IIC outputs stay outside the Gate BP
  formula budget.

## Surface Parity

Gate BP makes the cleanup visible across output cards, route card,
impact trace, diagnostics/method surfaces, saved replay, calculator API,
impact-only API, and Markdown report text.

Incomplete explicit owner input remains `needs_input` for impact output
with the exact missing fields. Visible-derived combined upper/lower
input keeps airborne `Rw` / `Ctr` visible but shows `Ln,w` / `DeltaLw`
cards as `needs_input` for
`resilientLayerDynamicStiffnessMNm3`, `loadBasisKgM2`, and
`ceilingOrLowerAssembly`.

## Next Step

Gate BQ should refresh the executable coverage matrix after the Gate
BO/BP cleanup so the matrix reflects complete formula support,
needs-input posture, and non-alias boundaries before choosing the next
highest-ROI personal-use lane.
