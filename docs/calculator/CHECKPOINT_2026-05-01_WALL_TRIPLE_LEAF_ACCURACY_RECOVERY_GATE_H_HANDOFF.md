# Checkpoint - Wall Triple-Leaf Accuracy Recovery Gate H Handoff

Date: 2026-05-01

Slice: `wall_triple_leaf_accuracy_recovery_v1`

Gate: H

Status: LANDED / ENGINE INTEGRATION FAIL-CLOSED PREREQUISITE CHECK / NO RUNTIME

Gate H status:

`gate_h_landed_engine_integration_fail_closed_prerequisite_check_no_runtime_selected_web_visible_grouped_topology_inputs_gate_i`

Next implementation file:

`apps/web/features/workbench/wall-triple-leaf-grouped-topology-route-card.test.ts`

## Decision

Gate H checks whether the Gate G2B-G9 prerequisite chain is ready for
engine runtime integration. It is not. The source-family curves,
calibration / holdout fit, negative boundaries, and complete grouped
test topology pass, but local material mapping, usable local source
pack, source-gap closure, runtime-ready topology guards, and paired
engine/web-visible runtime tests are still blocked.

The Gate H module is:

`packages/engine/src/wall-triple-leaf-engine-integration-fail-closed.ts`

The Gate H contract is:

`packages/engine/src/wall-triple-leaf-engine-integration-fail-closed-gate-h.test.ts`

Gate H does not change the live calculator result, support status,
confidence, evidence, route-card value, output-card status,
proposal/report copy, API shape, or workbench input behavior.

## Prerequisite Matrix

Passed prerequisites:

- `gate_g2b_executable_source_curves`;
- `gate_g3_calibration_holdout_negative_boundaries`;
- `complete_grouped_wall_topology`.

Blocked prerequisites:

- `gate_g4_local_material_mapping`;
- `gate_g7_usable_local_source_pack`;
- `gate_g8_source_gaps_closed`;
- `gate_g9_route_topology_guards_runtime_ready`;
- `paired_engine_web_visible_runtime_tests`.

Complete grouped topology is necessary but not sufficient. The local
source/material gaps and paired visible tests still block any exact
runtime path.

## Runtime Hold

The live user split-rockwool repro still returns low-confidence
`multileaf_screening_blend` `Rw 41`. Gate H keeps runtime fail-closed
on `multileaf_screening_blend` and selects Gate I web-visible grouped
topology input work; it does not authorize runtime integration or
numeric retuning.

## Validation

Gate H post-edit validation completed green on 2026-05-01:

- `pnpm --filter @dynecho/engine exec vitest run src/wall-triple-leaf-engine-integration-fail-closed-gate-h.test.ts --maxWorkers=1`
  green: 1 file / 7 tests.
- `pnpm --filter @dynecho/engine exec vitest run src/wall-triple-leaf-accuracy-recovery-gate-c-contract.test.ts src/wall-triple-leaf-source-pack-extraction-gate-d-contract.test.ts src/wall-triple-leaf-source-corpus-contract.test.ts src/wall-triple-leaf-frequency-solver.test.ts src/wall-triple-leaf-calibration-regime.test.ts src/wall-triple-leaf-source-curve-digitization-intake.test.ts src/wall-triple-leaf-source-curve-digitization-qc.test.ts src/wall-triple-leaf-calibration-fit-gate-g3.test.ts src/wall-triple-leaf-local-material-mapping-gate-g4.test.ts src/wall-triple-leaf-blocked-diagnostics-gate-g5.test.ts src/wall-triple-leaf-local-source-acquisition-gate-g6.test.ts src/wall-triple-leaf-local-source-pack-acquisition-gate-g7.test.ts src/wall-triple-leaf-source-gap-and-order-risk-gate-g8.test.ts src/wall-triple-leaf-visible-diagnostics-and-topology-guard-gate-g9.test.ts src/wall-triple-leaf-engine-integration-fail-closed-gate-h.test.ts --maxWorkers=1`
  green: 15 files / 100 tests.
- `pnpm --filter @dynecho/engine lint`
  green.
- `pnpm calculator:gate:current`
  green after adding Gate H to the current runner: engine 178 files /
  925 tests, web 45 files / 216 passed + 18 skipped, build 5/5 with the
  known non-fatal `sharp/@img` warnings, whitespace guard clean.
