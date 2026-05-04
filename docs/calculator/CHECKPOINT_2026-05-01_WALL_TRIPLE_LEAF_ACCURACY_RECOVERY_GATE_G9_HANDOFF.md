# Checkpoint - Wall Triple-Leaf Accuracy Recovery Gate G9 Handoff

Date: 2026-05-01

Slice: `wall_triple_leaf_accuracy_recovery_v1`

Gate: G9

Status: LANDED / VISIBLE DIAGNOSTICS AND GROUPED TOPOLOGY GUARD / NO RUNTIME

Gate G9 status:

`gate_g9_landed_visible_diagnostics_and_grouped_topology_guard_no_runtime_selected_engine_integration_fail_closed_gate_h`

Next implementation file:

`packages/engine/src/wall-triple-leaf-engine-integration-fail-closed-gate-h.test.ts`

## Decision

Gate G9 turns the Gate G8 source-gap and order-risk register into an
engine-owned visible diagnostic contract plus grouped topology guard
ownership. It keeps runtime blocked and selects Gate H fail-closed
engine-integration prerequisite checking.

The Gate G9 module is:

`packages/engine/src/wall-triple-leaf-visible-diagnostics-and-topology-guard.ts`

The Gate G9 contract is:

`packages/engine/src/wall-triple-leaf-visible-diagnostics-and-topology-guard-gate-g9.test.ts`

Gate G9 does not change the live calculator result, support status,
confidence, evidence, route-card value, output-card status,
proposal/report copy, API shape, or workbench input behavior.

## Visible Diagnostic Contract

Gate G9 keeps these user/developer-visible diagnostic ids blocking
runtime promotion:

- `triple_leaf_visible_screening_result_not_validated`;
- `triple_leaf_visible_local_type_c_board_source_gap`;
- `triple_leaf_visible_rockwool_equivalence_source_gap`;
- `triple_leaf_visible_50mm_cavity_source_gap`;
- `triple_leaf_visible_mlv_effect_model_gap`;
- `triple_leaf_visible_gypsum_plaster_effect_model_gap`;
- `triple_leaf_visible_support_topology_owner_gap`;
- `triple_leaf_visible_route_flip_grouped_topology_guard`;
- `triple_leaf_visible_duplicate_stack_grouped_topology_guard`;
- `triple_leaf_visible_runtime_promotion_missing_paired_tests`.

The diagnostic contract targets route-card, output-card,
proposal/report, workbench-input, and developer-trace surfaces, but it
does not yet modify those visible surfaces. Web-visible runtime tests
remain not ready.

## Grouped Topology Guards

Gate G9 owns guard definitions for:

- `grouped_triple_leaf_roles_required`;
- `flat_list_route_flip_guard_required`;
- `duplicate_stack_guard_required`;
- `source_gap_runtime_block_guard`;
- `paired_visible_tests_runtime_block_guard`.

The guards keep `triple_leaf_double_leaf_route_flip` and
`duplicate_stack_family_flip` visible as blocked topology risks until
the grouped roles, source gaps, and paired web-visible tests are
closed.

## Runtime Hold

The live user split-rockwool repro still returns low-confidence
`multileaf_screening_blend` `Rw 41`. Gate G9 selects Gate H
fail-closed prerequisite checking; it does not authorize runtime
integration or numeric retuning.

## Validation

Gate G9 post-edit validation completed green on 2026-05-01:

- `pnpm --filter @dynecho/engine exec vitest run src/wall-triple-leaf-visible-diagnostics-and-topology-guard-gate-g9.test.ts --maxWorkers=1`
  green: 1 file / 7 tests.
- `pnpm --filter @dynecho/engine exec vitest run src/wall-triple-leaf-accuracy-recovery-gate-c-contract.test.ts src/wall-triple-leaf-source-pack-extraction-gate-d-contract.test.ts src/wall-triple-leaf-source-corpus-contract.test.ts src/wall-triple-leaf-frequency-solver.test.ts src/wall-triple-leaf-calibration-regime.test.ts src/wall-triple-leaf-source-curve-digitization-intake.test.ts src/wall-triple-leaf-source-curve-digitization-qc.test.ts src/wall-triple-leaf-calibration-fit-gate-g3.test.ts src/wall-triple-leaf-local-material-mapping-gate-g4.test.ts src/wall-triple-leaf-blocked-diagnostics-gate-g5.test.ts src/wall-triple-leaf-local-source-acquisition-gate-g6.test.ts src/wall-triple-leaf-local-source-pack-acquisition-gate-g7.test.ts src/wall-triple-leaf-source-gap-and-order-risk-gate-g8.test.ts src/wall-triple-leaf-visible-diagnostics-and-topology-guard-gate-g9.test.ts --maxWorkers=1`
  green: 14 files / 93 tests.
- `pnpm --filter @dynecho/engine lint`
  green.
- `pnpm calculator:gate:current`
  green after adding Gate G9 to the current runner: engine 177 files /
  918 tests, web 45 files / 216 passed + 18 skipped, build 5/5 with the
  known non-fatal `sharp/@img` warnings, whitespace guard clean.
