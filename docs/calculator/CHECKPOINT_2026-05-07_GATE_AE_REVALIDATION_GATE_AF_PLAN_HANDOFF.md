# Checkpoint - 2026-05-07 - Gate AE Revalidation / Gate AF Plan

## Status

Landed scope remains:
`gate_ae_steel_floor_formula_card_and_report_parity_plan`.

Current selected slice:

`calculator_model_first_physics_prediction_pivot_v1`

Current selection status:

`gate_ae_steel_formula_card_report_parity_landed_selected_input_surface_gate_af`

Selected next file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-af-steel-floor-formula-input-surface-contract.test.ts`

Selected next action:

`gate_af_steel_floor_formula_input_surface_plan`

This checkpoint is a broad revalidation and next-step planning pass. It
does not land new runtime behavior.

## Revalidation Result

Validation completed on 2026-05-07 with `pnpm calculator:gate:current`.
The current gate passed:

- engine focused suite: 311 files / 1770 tests;
- web focused suite: 63 files / 276 tests plus 18 skipped;
- repo build through Turbo;
- whitespace guard.

The Next build still emits the known non-fatal optional `sharp/@img`
package warnings through the DOCX export dependency chain. No tracked
runtime or test failure was found in this pass. Existing unrelated
untracked local artifacts remain outside this slice.

## Implementation Reading

The implementation is aligned with the current plan through Gate AE:

- Gate AC defined the physical steel-floor input contract and named the
  required fields;
- Gate AD promoted the source-absent lightweight-steel impact formula
  corridor for complete explicit predictor input;
- Gate AE made that formula corridor visible across workbench cards,
  output posture, dynamic trace, support notes, validation mode,
  proposal dossier, and Markdown report.

The remaining gap is not a new source row and not a wording problem. The
formula can currently be reached from explicit engine/API
`impactPredictorInput`, but the Dynamic Calculator user workflow still
needs a first-class floor input surface for the same physical inputs.
That is the first product-readiness blocker because the user goal is a
calculator flow: choose floor, enter required physical fields, add
layers, and calculate. A hidden explicit engine object is not enough.

## Gate AF Implementation Order

Gate AF should move in this order:

1. Land an executable Gate AF contract and scenario pack.
   The contract should prove that the UI/API input surface owns the Gate
   AC fields: `steelSupportForm`, `steelCarrierDepthMm`,
   `steelCarrierSpacingMm`, `resilientLayerDynamicStiffnessMNm3`,
   `loadBasisKgM2`, and `lowerCeilingIsolationSupportForm`.

2. Bridge the surface into the existing predictor input.
   The floor route must convert user-entered steel support form,
   carrier geometry, resilient dynamic stiffness, load basis, and lower
   isolation into the same `ImpactPredictorInput` shape used by Gate AD.
   Missing or invalid fields must stay `needs_input`; they must not fall
   through to broad steel-family blending.

3. Add the workbench controls and visible prompts.
   Controls should appear only when the selected floor route/output
   family requires them. The visible missing-input list must match the
   engine prompt field IDs and reduce as the user fills fields.

4. Preserve numeric and basis parity.
   A complete UI-derived open-web steel floor should still return lab
   `LnW 55.6` and `DeltaLw 22.4` from
   `predictor_lightweight_steel_mass_spring_holdout_corridor_estimate`
   with `+/-4.5 dB` and `+/-2.0 dB` tolerances. Exact measured source
   rows must still outrank the formula.

5. Prove hostile-input behavior.
   Tests should cover partial fields, invalid zero/negative values,
   many-layer stacks, duplicate/split steel carriers, safe reorder, and
   unsafe reorder. The acceptance target is stable missing-input or
   formula behavior, not a finite list of source assemblies.

## Non-Goals For Gate AF

- Do not retune the Gate AD numeric formula unless a failing acceptance
  test proves the formula surface changes the calculation basis.
- Do not start another source-packet crawl as the main task.
- Do not alias lab `Ln,w` with `IIC`, or field `L'n,w` / `L'nT,w` with
  lab values.
- Do not promote field/building-prediction outputs from this gate unless
  the required field-context owner is already explicit.

## Validation To Run After Gate AF

- Focused Gate AF contract.
- Gate AC, Gate AD, and Gate AE regression contracts.
- Focused workbench steel input-surface and card/report parity tests.
- `pnpm calculator:gate:current`.
- `git diff --check`.
