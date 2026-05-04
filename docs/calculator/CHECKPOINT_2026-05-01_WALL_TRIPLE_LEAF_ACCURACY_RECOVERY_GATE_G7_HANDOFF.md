# Checkpoint - Wall Triple-Leaf Accuracy Recovery Gate G7 Handoff

Date: 2026-05-01

Slice: `wall_triple_leaf_accuracy_recovery_v1`

Gate: G7

Status: LANDED / LOCAL SOURCE-PACK INTAKE AND ORDER-RISK REGISTER / NO RUNTIME

Gate G7 status:

`gate_g7_landed_local_source_pack_intake_no_runtime_selected_source_gap_and_order_risk_register_gate_g8`

Next implementation file:

`packages/engine/src/wall-triple-leaf-source-gap-and-order-risk-gate-g8.test.ts`

## Decision

Gate G7 compares the Gate G6 plan against implementation and records
the local source-pack intake gaps as executable data. It also records
rockwool-like sibling order/topology risks that can create large route
or value changes when a flat layer list is edited.

The Gate G7 module is:

`packages/engine/src/wall-triple-leaf-local-source-pack-acquisition.ts`

The Gate G7 contract is:

`packages/engine/src/wall-triple-leaf-local-source-pack-acquisition-gate-g7.test.ts`

Gate G7 does not change the live calculator result, support status,
confidence, evidence, route-card, output-card, proposal/report copy,
API shape, or workbench input behavior.

## Source-Pack Intake Gaps

Gate G7 keeps every local source-pack candidate blocked:

1. local Type C board mapping has only an NRC Type C mass/thickness
   reference; the local `gypsum_board` row still needs a product
   datasheet mapping;
2. rockwool/mineral-wool absorber behavior has only an NRC glass-fiber
   batt adjacent reference; it still needs direct measured/digitized
   rows or flow-resistivity/density equivalence with band tolerance;
3. local `50 mm` rockwool two-cavity behavior has only the NRC
   `92.1 mm` adjacent reference; it still needs a direct measured or
   graph-digitized source row;
4. MLV still needs a bounded one-third-octave limp-mass effect source;
5. gypsum plaster still needs a bounded face-finish delta source;
6. support gauge/depth/spacing still needs explicit topology input
   ownership against the NRC-like support family.

Because those gaps remain open, the source pack is not ready for
mapping/tolerance evaluation and is not ready for runtime import.

## Order And Topology Risk Register

Gate G7 records these sibling risks for follow-up:

- `triple_leaf_double_leaf_route_flip`;
- `heavy_multileaf_lined_massive_boundary_flip`;
- `masonry_lined_massive_swap_flip`;
- `duplicate_stack_family_flip`;
- `raw_floor_order_role_inference_sensitivity`.

The Gate G7 test pins representative route flips, including the user
rockwool case (`Rw 51` double-leaf to `Rw 41` multileaf screening), a
classic triple-leaf swap (`Rw 32` to `Rw 44`), and a heavy multileaf /
lined-massive boundary swap (`Rw 39` to `Rw 49`). These are documented
as risk findings, not fixed runtime behavior.

## Runtime Hold

The live user split-rockwool repro still returns low-confidence
`multileaf_screening_blend` `Rw 41`. Gate G7 selects Gate G8 source-gap
and order-risk register work; it does not authorize Gate H runtime
integration.

## Validation

Gate G7 post-edit validation completed green on 2026-05-01:

- `pnpm --filter @dynecho/engine exec vitest run src/wall-triple-leaf-local-source-pack-acquisition-gate-g7.test.ts --maxWorkers=1`
  green: 1 file / 7 tests.
- `pnpm --filter @dynecho/engine exec vitest run src/wall-triple-leaf-accuracy-recovery-gate-c-contract.test.ts src/wall-triple-leaf-source-pack-extraction-gate-d-contract.test.ts src/wall-triple-leaf-source-corpus-contract.test.ts src/wall-triple-leaf-frequency-solver.test.ts src/wall-triple-leaf-calibration-regime.test.ts src/wall-triple-leaf-source-curve-digitization-intake.test.ts src/wall-triple-leaf-source-curve-digitization-qc.test.ts src/wall-triple-leaf-calibration-fit-gate-g3.test.ts src/wall-triple-leaf-local-material-mapping-gate-g4.test.ts src/wall-triple-leaf-blocked-diagnostics-gate-g5.test.ts src/wall-triple-leaf-local-source-acquisition-gate-g6.test.ts src/wall-triple-leaf-local-source-pack-acquisition-gate-g7.test.ts --maxWorkers=1`
  green: 12 files / 79 tests.
- `pnpm --filter @dynecho/engine lint`
  green.
- `pnpm calculator:gate:current`
  green after adding Gate G7 to the current runner: engine 175 files /
  904 tests, web 45 files / 216 passed + 18 skipped, build 5/5 with the
  known non-fatal `sharp/@img` warnings, whitespace guard clean.
