# Checkpoint - 2026-05-08 - Model-First Physics Prediction Pivot Gate AY

Gate:

`gate_ay_steel_floor_formula_same_stack_iso_delta_lw_packet_acceptance_boundary_plan`

Implemented file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ay-steel-floor-formula-same-stack-iso-delta-lw-packet-acceptance-boundary-contract.test.ts`

Helper:

`packages/engine/src/steel-floor-formula-same-stack-iso-delta-lw-packet-acceptance-boundary.ts`

Status:

Gate AY landed as a no-runtime packet acceptance boundary.

Summary:

- Gate AY uses only Gate AX request-ledger rows as current packet
  acceptance boundary rows;
- current request-ledger entries remain in request status because no
  source-owned packet is present yet;
- a complete future same-stack ISO lab `DeltaLw` packet boundary probe
  can leave request status only when measured `DeltaLw`, same-stack
  steel reference, ISO 10140 / 717-2 lab basis, all Gate AT/AK owner
  fields, and paired negative-boundary ownership are source-owned;
- wrong-basis, wrong-reference, product/inferred, rights-blocked,
  missing-owner, and blocked-ledger probes remain rejected;
- accepted boundary packets are not calibration evidence yet, not exact
  overrides, not retune input, and not field/building aliases;
- source text and source documents are not copied or ingested, measured
  metric values are not ingested for runtime;
- runtime values remain `Ln,w 55.6` / `DeltaLw 22.4`, tolerances remain
  `+/-4.5 dB` / `+/-2.0 dB`, exact-source precedence is unchanged, and
  lab/field/building bases remain separate.

Selection status:

`gate_ay_same_stack_iso_delta_lw_packet_acceptance_boundary_landed_no_runtime_selected_packet_calibration_candidate_gate_az`

Selected next file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-az-steel-floor-formula-same-stack-iso-delta-lw-packet-calibration-candidate-contract.test.ts`

Selected next action:

`gate_az_steel_floor_formula_same_stack_iso_delta_lw_packet_calibration_candidate_plan`

Next step:

Gate AZ should define when an accepted packet boundary row can become a
calibration evidence candidate. It must still keep candidate admission
separate from residual-policy admission, exact-source promotion,
field/building aliases, tolerance changes, and formula retune.

Validation result:

Focused Gate AY validation completed on 2026-05-08. The Gate AY engine
contract passed 1 file / 8 tests, focused Gate AX/AY continuity passed
2 files / 15 tests, engine typecheck passed, and engine DTS build
passed. Full `pnpm calculator:gate:current` passed with engine 331 files
/ 1888 tests, web 66 files / 286 passed + 18 skipped, repo build 5/5
successful, and whitespace guard clean. Known warnings were the existing
Zustand unavailable test-storage warnings and optional sharp package
resolution warnings during the web build.

Broad `pnpm check` was not rerun because Gate AY is a no-runtime,
no-API, no-UI contract/doc gate and the current-gate plus engine
typecheck/build cover the changed surfaces.
