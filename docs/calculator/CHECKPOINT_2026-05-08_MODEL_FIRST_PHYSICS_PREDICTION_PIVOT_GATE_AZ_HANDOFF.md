# Checkpoint - 2026-05-08 - Model-First Physics Prediction Pivot Gate AZ

Gate:

`gate_az_steel_floor_formula_same_stack_iso_delta_lw_packet_calibration_candidate_plan`

Implemented file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-az-steel-floor-formula-same-stack-iso-delta-lw-packet-calibration-candidate-contract.test.ts`

Helper:

`packages/engine/src/steel-floor-formula-same-stack-iso-delta-lw-packet-calibration-candidate.ts`

Status:

Gate AZ landed as a no-runtime calibration evidence candidate boundary.

Summary:

- Gate AZ uses Gate AY accepted packet boundary rows as the only
  calibration candidate source;
- current request-status rows remain blocked because no current
  source-owned packet has left request status;
- rejected Gate AY probes remain blocked before calibration candidate
  use;
- the accepted future same-stack ISO lab `DeltaLw` packet boundary probe
  can become a calibration evidence candidate only when rights-safe
  citation/locator metadata is preserved;
- calibration candidates are not residual-policy admissions, exact rows,
  retune inputs, tolerance changes, field/building aliases, or runtime
  movement;
- source text and source documents are not copied or ingested, measured
  metric values are not ingested for runtime;
- runtime values remain `Ln,w 55.6` / `DeltaLw 22.4`, tolerances remain
  `+/-4.5 dB` / `+/-2.0 dB`, exact-source precedence is unchanged, and
  lab/field/building bases remain separate.

Selection status:

`gate_az_same_stack_iso_delta_lw_packet_calibration_candidate_landed_no_runtime_selected_residual_admission_boundary_gate_ba`

Selected next file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ba-steel-floor-formula-same-stack-iso-delta-lw-residual-admission-boundary-contract.test.ts`

Selected next action:

`gate_ba_steel_floor_formula_same_stack_iso_delta_lw_residual_admission_boundary_plan`

Next step:

Gate BA should define when a calibration evidence candidate can enter
residual-policy evaluation. It must keep residual admission separate
from exact-source promotion, field/building aliases, tolerance movement,
formula retune, and runtime value movement unless a later residual
policy gate explicitly owns that decision.

Validation result:

Focused Gate AZ validation completed on 2026-05-08. The Gate AZ engine
contract passed 1 file / 8 tests, focused Gate AY/AZ continuity passed
2 files / 16 tests, engine typecheck passed, and engine DTS build
passed. Full `pnpm calculator:gate:current` passed with engine 332 files
/ 1896 tests, web 66 files / 286 passed + 18 skipped, repo build 5/5
successful, and whitespace guard clean. Known warnings were the existing
Zustand unavailable test-storage warnings and optional sharp package
resolution warnings during the web build.

Broad `pnpm check` was not rerun because Gate AZ is a no-runtime,
no-API, no-UI contract/doc gate and the current-gate plus engine
typecheck/build cover the changed surfaces.
