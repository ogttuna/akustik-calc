# Checkpoint - 2026-05-08 - Model-First Physics Prediction Pivot Gate AV

Gate:

`gate_av_steel_floor_formula_same_stack_iso_delta_lw_source_lead_intake_plan`

Implemented file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-av-steel-floor-formula-same-stack-iso-delta-lw-source-lead-intake-contract.test.ts`

Helper:

`packages/engine/src/steel-floor-formula-same-stack-iso-delta-lw-source-lead-intake.ts`

Status:

Gate AV landed as a no-runtime metadata-only source-lead intake ledger.

Summary:

- Gate AV uses the Gate AU narrow rights-safe source-lead scope as the
  only intake surface;
- manufacturer lab-report index, accredited lab-report index, and
  internal measurement packet leads become acquisition request targets
  only;
- accepted intake rows are not source packets, not measured metric
  values, not calibration evidence, not exact overrides, and not retune
  evidence;
- product-only/catalog, inferred, ASTM/IIC/STC, field/building,
  concrete-reference, boundary-only, rights-blocked, and missing-owner
  leads remain blocked at intake;
- runtime values remain `Ln,w 55.6` / `DeltaLw 22.4`, tolerances remain
  `+/-4.5 dB` / `+/-2.0 dB`, exact-source precedence is unchanged, and
  lab/field/building bases remain separate.

Selection status:

`gate_av_same_stack_iso_delta_lw_source_lead_intake_landed_no_runtime_selected_packet_acquisition_readiness_gate_aw`

Selected next file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-aw-steel-floor-formula-same-stack-iso-delta-lw-packet-acquisition-readiness-contract.test.ts`

Selected next action:

`gate_aw_steel_floor_formula_same_stack_iso_delta_lw_packet_acquisition_readiness_plan`

Next step:

Gate AW should define the packet-acquisition readiness contract for
moving from a rights-safe lead row to a source-owned packet request
without ingesting source text, copying report contents, or changing
runtime values. Rejected intake rows must remain blocked, and a ready
packet request must still be separate from packet acceptance,
calibration evidence, exact-source promotion, and formula retune.

Validation result:

Focused Gate AV validation completed on 2026-05-08. The Gate AV engine
contract passed 1 file / 7 tests, focused Gate AU/AV continuity passed
2 files / 14 tests, engine typecheck passed, and engine DTS build
passed. Full `pnpm calculator:gate:current` passed with engine 328 files
/ 1866 tests, web 66 files / 286 passed + 18 skipped, repo build 5/5
successful, and whitespace guard clean. Known warnings were the existing
Zustand unavailable test-storage warnings and optional sharp package
resolution warnings during the web build.

Broad `pnpm check` was not rerun because Gate AV is a no-runtime,
no-API, no-UI contract/doc gate and the current-gate plus engine
typecheck/build cover the changed surfaces.
