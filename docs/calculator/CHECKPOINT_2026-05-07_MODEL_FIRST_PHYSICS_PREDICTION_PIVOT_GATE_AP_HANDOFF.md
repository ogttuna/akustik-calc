# Checkpoint - 2026-05-07 Model-First Physics Prediction Pivot Gate AP

Slice:

`calculator_model_first_physics_prediction_pivot_v1`

Landed gate:

`gate_ap_steel_floor_formula_error_budget_hostile_input_plan`

Landed file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ap-steel-floor-formula-error-budget-hostile-input-contract.test.ts`

Selection status:

`gate_ap_error_budget_hostile_input_landed_no_runtime_selected_calibration_readiness_gate_aq`

Selected next file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-aq-steel-floor-formula-error-budget-calibration-readiness-contract.test.ts`

Selected next action:

`gate_aq_steel_floor_formula_error_budget_calibration_readiness_plan`

## What Landed

Gate AP treats the Gate AO steel-floor formula error-budget surface as a
hostile-input boundary, not a display-only feature. It verifies that the
budget appears only when the source-absent steel formula is actually the
selected lab route.

Covered cases:

1. Complete source-absent steel formula input keeps `Ln,w 55.6`,
   `DeltaLw 22.4`, and the structured `Ln,w` / `DeltaLw` budget.
2. Safe floor-row reorder keeps the same predictor input and the same
   structured budget object.
3. Saved/API replay through JSON-cloned layers and predictor input keeps
   the same values and budget object.
4. Missing `steelCarrierSpacingMm` returns `needs_input` and does not
   surface a formula budget.
5. Duplicate or ambiguous steel base-structure rows remain unsafe and
   budget-free.
6. Exact ISO impact-band source precedence remains budget-free even when
   complete steel formula inputs are present.
7. Field requests keep `L'n,w` and `L'nT,w` unsupported without field
   context, and the lab `Ln,w` / `DeltaLw` budget is not aliased onto
   field metric ids.

Runtime values did not move.

## Next Step

Gate AQ should turn this stable budget surface toward calibration
readiness. The next contract should define which source-owned evidence
can shrink each budget term, which evidence keeps the current tolerance,
and which evidence can only create a widen/retune candidate. This must
continue to reject product-only, inferred, STC/IIC, field/building, or
wrong-reference-floor rows as corridor-tightening evidence.

Validation result:

Focused Gate AP validation completed on 2026-05-07: Gate AP engine
contract passed 1 file / 7 tests. Full `pnpm calculator:gate:current`
passed with engine 322 files / 1825 tests, web 66 files / 286 passed +
18 skipped, repo build 5/5 successful, and whitespace guard clean. Known
non-fatal warnings remain the Node/Vitest Zustand persist storage
warning and optional `sharp` / `@img` Next build warnings via the DOCX
export dependency.
