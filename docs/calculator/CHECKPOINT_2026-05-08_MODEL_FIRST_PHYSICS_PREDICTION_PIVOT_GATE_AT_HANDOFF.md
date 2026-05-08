# Checkpoint - 2026-05-08 Model-First Physics Prediction Pivot Gate AT

Slice:

`calculator_model_first_physics_prediction_pivot_v1`

Landed gate:

`gate_at_steel_floor_formula_same_stack_iso_delta_lw_packet_target_plan`

Landed file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-at-steel-floor-formula-same-stack-iso-delta-lw-packet-target-contract.test.ts`

Selection status:

`gate_at_same_stack_iso_delta_lw_packet_target_landed_no_runtime_selected_narrow_source_lead_gate_au`

Selected next file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-au-steel-floor-formula-same-stack-iso-delta-lw-narrow-source-lead-contract.test.ts`

Selected next action:

`gate_au_steel_floor_formula_same_stack_iso_delta_lw_narrow_source_lead_plan`

## What Landed

Gate AT turns the Gate AS selected owner target into a strict
same-stack ISO lab `DeltaLw` packet fixture contract. It does not search
broadly, ingest source text, promote a source row, retune the formula, or
change runtime values.

Covered cases:

1. Gate AS selected target is the only acceptance surface:
   lab ISO 10140 / 717-2 `DeltaLw`, same-stack steel reference, and all
   Gate AK source-owned physical owner fields.
2. The future same-stack source-owned ISO `DeltaLw` fixture is accepted
   as calibration evidence only; it is not an exact override and cannot
   move runtime now.
3. The accepted fixture still leaves residual policy on `hold` because
   holdout count, paired negative boundaries, open-web source-owned
   formula inputs, and field/building basis owners are incomplete.
4. Product-only or inferred `DeltaLw`, ASTM/IIC/STC or field/building
   basis, concrete-reference floors, boundary-only references, missing
   source-owned owner fields, and rights-blocked packets remain
   rejected.
5. Exact measured rows stay exact overrides only for full assembly
   matches.
6. Runtime values remain `Ln,w 55.6` and `DeltaLw 22.4`; tolerances
   remain `+/-4.5 dB` and `+/-2.0 dB`.

## Next Step

Gate AU should use the Gate AT packet target to build a narrow
rights-safe source-lead plan for same-stack ISO lab `DeltaLw` packets.
It should list the lead packet fields, source-owned acceptance checks,
and rejection boundaries before any acquisition attempt. It must not
perform a broad source-library crawl and must not retune runtime values.

Validation result:

Focused Gate AT validation completed on 2026-05-08: Gate AT engine
contract passed 1 file / 7 tests. Focused Gate AS/AT continuity passed
2 files / 13 tests. Engine typecheck passed. Engine DTS build passed.
Full `pnpm calculator:gate:current` passed with engine 326 files / 1852
tests, web 66 files / 286 passed + 18 skipped, repo build 5/5
successful, and whitespace guard clean. Broad `pnpm check` was not
rerun because Gate AT is no-runtime/no-API/no-UI and the current-gate
plus engine typecheck/build cover the changed surfaces. Known non-fatal
warnings remain the Node/Vitest Zustand persist storage warning and
optional `sharp` / `@img` Next build warnings via the DOCX export
dependency.
