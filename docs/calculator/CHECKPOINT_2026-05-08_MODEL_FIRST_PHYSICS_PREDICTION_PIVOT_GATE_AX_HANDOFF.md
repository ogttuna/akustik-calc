# Checkpoint - 2026-05-08 - Model-First Physics Prediction Pivot Gate AX

Gate:

`gate_ax_steel_floor_formula_same_stack_iso_delta_lw_packet_request_ledger_plan`

Implemented file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ax-steel-floor-formula-same-stack-iso-delta-lw-packet-request-ledger-contract.test.ts`

Helper:

`packages/engine/src/steel-floor-formula-same-stack-iso-delta-lw-packet-request-ledger.ts`

Status:

Gate AX landed as a no-runtime rights-safe packet request ledger.

Summary:

- Gate AX uses only Gate AW ready packet request rows as request-ledger
  entries;
- blocked Gate AW readiness rows remain blocked;
- request-ledger entries preserve locator-only metadata and the full
  Gate AT/AK source-owned owner-field checklist;
- request-ledger entries are not source packets, measured rows,
  calibration evidence, exact overrides, or retune evidence;
- source documents, source text, and measured metric values are not
  copied or ingested;
- runtime values remain `Ln,w 55.6` / `DeltaLw 22.4`, tolerances remain
  `+/-4.5 dB` / `+/-2.0 dB`, exact-source precedence is unchanged, and
  lab/field/building bases remain separate.

Selection status:

`gate_ax_same_stack_iso_delta_lw_packet_request_ledger_landed_no_runtime_selected_packet_acceptance_boundary_gate_ay`

Selected next file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ay-steel-floor-formula-same-stack-iso-delta-lw-packet-acceptance-boundary-contract.test.ts`

Selected next action:

`gate_ay_steel_floor_formula_same_stack_iso_delta_lw_packet_acceptance_boundary_plan`

Next step:

Gate AY should define the packet acceptance boundary that a future
source-owned same-stack ISO `DeltaLw` packet must satisfy before it can
leave request status. Acceptance must remain separate from runtime use,
exact-source promotion, field/building aliases, and formula retune.

Validation result:

Focused Gate AX validation completed on 2026-05-08. The Gate AX engine
contract passed 1 file / 7 tests, focused Gate AW/AX continuity passed
2 files / 14 tests, engine typecheck passed, and engine DTS build
passed. Full `pnpm calculator:gate:current` passed with engine 330 files
/ 1880 tests, web 66 files / 286 passed + 18 skipped, repo build 5/5
successful, and whitespace guard clean. Known warnings were the existing
Zustand unavailable test-storage warnings and optional sharp package
resolution warnings during the web build.

Broad `pnpm check` was not rerun because Gate AX is a no-runtime,
no-API, no-UI contract/doc gate and the current-gate plus engine
typecheck/build cover the changed surfaces.
