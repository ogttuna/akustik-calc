# Checkpoint - 2026-05-08 Model-First Physics Prediction Pivot Gate AU

Slice:

`calculator_model_first_physics_prediction_pivot_v1`

Landed gate:

`gate_au_steel_floor_formula_same_stack_iso_delta_lw_narrow_source_lead_plan`

Landed file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-au-steel-floor-formula-same-stack-iso-delta-lw-narrow-source-lead-contract.test.ts`

Selection status:

`gate_au_same_stack_iso_delta_lw_narrow_source_lead_landed_no_runtime_selected_source_lead_intake_gate_av`

Selected next file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-av-steel-floor-formula-same-stack-iso-delta-lw-source-lead-intake-contract.test.ts`

Selected next action:

`gate_av_steel_floor_formula_same_stack_iso_delta_lw_source_lead_intake_plan`

## What Landed

Gate AU turns the Gate AT packet target into a narrow rights-safe source
lead plan. It does not crawl broadly, ingest source text, accept a
packet, promote a row, retune the formula, or change runtime values.

Covered cases:

1. Gate AT packet acceptance is the only source-lead scope:
   same-stack steel, lab ISO 10140 / 717-2 `DeltaLw`, all source-owned
   owner fields, and rights-safe metadata-only handling.
2. Manufacturer lab-report index leads, accredited lab-report index
   leads, and internal measurement packet leads can proceed to a later
   packet acquisition/intake gate when they name all required owner
   fields.
3. Accepted leads are metadata-only packet acquisition targets; they are
   not calibration evidence yet, not exact overrides, and not retune
   inputs.
4. Product-only/catalog claims, ASTM/IIC/STC or field-basis reports,
   concrete-reference ISO `DeltaLw`, boundary-only references,
   missing-owner metadata, and rights-blocked reports remain rejected.
5. Runtime values remain `Ln,w 55.6` and `DeltaLw 22.4`; tolerances
   remain `+/-4.5 dB` and `+/-2.0 dB`.

## Next Step

Gate AV should build the narrow source-lead intake ledger from the Gate
AU lead plan. It should keep lead intake metadata-only and rights-safe,
preserve the Gate AT acceptance surface, and block every rejected lead
bucket from calibration or retune. It must not perform a broad source
library crawl and must not move runtime values.

Validation result:

Focused Gate AU validation completed on 2026-05-08. The Gate AU engine
contract passed 1 file / 7 tests, focused Gate AT/AU continuity passed
2 files / 14 tests, engine typecheck passed, and engine DTS build passed.
Full `pnpm calculator:gate:current` passed with engine 327 files / 1859
tests, web 66 files / 286 passed + 18 skipped, repo build 5/5
successful, and whitespace guard clean. Known warnings were the existing
Zustand unavailable test-storage warnings and optional sharp package
resolution warnings during the web build.

Broad `pnpm check` was not rerun because Gate AU is a no-runtime,
no-API, no-UI contract/doc gate and the current-gate plus engine
typecheck/build cover the changed surfaces.
