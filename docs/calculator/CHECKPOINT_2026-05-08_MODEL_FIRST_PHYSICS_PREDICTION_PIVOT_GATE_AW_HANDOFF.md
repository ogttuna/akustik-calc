# Checkpoint - 2026-05-08 - Model-First Physics Prediction Pivot Gate AW

Gate:

`gate_aw_steel_floor_formula_same_stack_iso_delta_lw_packet_acquisition_readiness_plan`

Implemented file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-aw-steel-floor-formula-same-stack-iso-delta-lw-packet-acquisition-readiness-contract.test.ts`

Helper:

`packages/engine/src/steel-floor-formula-same-stack-iso-delta-lw-packet-acquisition-readiness.ts`

Status:

Gate AW landed as a no-runtime packet-acquisition readiness contract.

Summary:

- Gate AW uses only Gate AV accepted source-lead intake rows as packet
  request candidates;
- rejected Gate AV intake rows remain blocked;
- ready packet requests must carry same-stack steel ISO `DeltaLw`
  scope, rights-safe locator metadata, and the full Gate AT/AK
  source-owned owner-field checklist;
- ready packet requests are not source packets, measured rows,
  calibration evidence, exact overrides, or retune evidence;
- source documents, source text, and measured metric values are not
  copied or ingested;
- runtime values remain `Ln,w 55.6` / `DeltaLw 22.4`, tolerances remain
  `+/-4.5 dB` / `+/-2.0 dB`, exact-source precedence is unchanged, and
  lab/field/building bases remain separate.

Selection status:

`gate_aw_same_stack_iso_delta_lw_packet_acquisition_readiness_landed_no_runtime_selected_packet_request_ledger_gate_ax`

Selected next file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ax-steel-floor-formula-same-stack-iso-delta-lw-packet-request-ledger-contract.test.ts`

Selected next action:

`gate_ax_steel_floor_formula_same_stack_iso_delta_lw_packet_request_ledger_plan`

Next step:

Gate AX should build the rights-safe packet request ledger from Gate AW
ready request rows. Blocked rows must remain blocked, and request-ledger
entries must still be separate from packet acceptance, source text,
measured metric values, calibration evidence, exact-source promotion,
and formula retune.

Validation result:

Focused Gate AW validation completed on 2026-05-08. The Gate AW engine
contract passed 1 file / 7 tests, focused Gate AV/AW continuity passed
2 files / 14 tests, engine typecheck passed, and engine DTS build
passed. Full `pnpm calculator:gate:current` passed with engine 329 files
/ 1873 tests, web 66 files / 286 passed + 18 skipped, repo build 5/5
successful, and whitespace guard clean. Known warnings were the existing
Zustand unavailable test-storage warnings and optional sharp package
resolution warnings during the web build.

Broad `pnpm check` was not rerun because Gate AW is a no-runtime,
no-API, no-UI contract/doc gate and the current-gate plus engine
typecheck/build cover the changed surfaces.
