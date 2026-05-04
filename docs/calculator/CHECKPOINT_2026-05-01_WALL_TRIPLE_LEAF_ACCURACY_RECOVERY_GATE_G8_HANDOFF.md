# Checkpoint - Wall Triple-Leaf Accuracy Recovery Gate G8 Handoff

Date: 2026-05-01

Slice: `wall_triple_leaf_accuracy_recovery_v1`

Gate: G8

Status: LANDED / SOURCE-GAP AND ORDER-RISK REGISTER / NO RUNTIME

Gate G8 status:

`gate_g8_landed_source_gap_and_order_risk_register_no_runtime_selected_visible_diagnostics_and_topology_guard_gate_g9`

Next implementation file:

`packages/engine/src/wall-triple-leaf-visible-diagnostics-and-topology-guard-gate-g9.test.ts`

## Decision

Gate G8 turns the Gate G7 blocked source-pack intake and sibling
order/topology risk register into the next explicit implementation
decision. It keeps runtime blocked and selects visible diagnostics plus
grouped topology guard ownership for Gate G9.

The Gate G8 module is:

`packages/engine/src/wall-triple-leaf-source-gap-and-order-risk.ts`

The Gate G8 contract is:

`packages/engine/src/wall-triple-leaf-source-gap-and-order-risk-gate-g8.test.ts`

Gate G8 does not change the live calculator result, support status,
confidence, evidence, route-card, output-card, proposal/report copy,
API shape, or workbench input behavior.

## Source Gap Buckets

Gate G8 keeps all source gaps open and classifies them by the next
owner needed:

1. `source_acquisition_required`: local Type C board product mapping,
   rockwool/mineral-wool absorber equivalence or measured band curve,
   and a measured or graph-digitized local `50 mm` two-cavity rockwool
   row;
2. `bounded_effect_model_required`: MLV limp-mass effect and gypsum
   plaster face-finish effect;
3. `topology_input_owner_required`: support gauge/depth/spacing and
   frame-independence mapping.

The source pack still has zero usable runtime candidates and is still
not ready for mapping/tolerance evaluation.

## Order And Topology Follow-Up

Gate G8 selects these new wall risks for Gate G9 visible diagnostics
and grouped topology guard work:

- `triple_leaf_double_leaf_route_flip`;
- `duplicate_stack_family_flip`.

It preserves existing pinned order-sensitive boundaries for:

- `heavy_multileaf_lined_massive_boundary_flip`;
- `masonry_lined_massive_swap_flip`;
- `raw_floor_order_role_inference_sensitivity`.

Before any route smoothing, source-family widening, or runtime
promotion, Gate G8 requires paired engine and web-visible tests covering
wall route/order sensitivity, known route-instability repros, wall
reorder invariance classes, floor role/order edit stability, and the
new triple-leaf visible diagnostics/topology guard target.

## Runtime Hold

The live user split-rockwool repro still returns low-confidence
`multileaf_screening_blend` `Rw 41`. Gate G8 selects Gate G9 visible
diagnostics and grouped topology guard work; it does not authorize Gate
H runtime integration.

## Validation

Gate G8 post-edit validation completed green on 2026-05-01:

- `pnpm --filter @dynecho/engine exec vitest run src/wall-triple-leaf-source-gap-and-order-risk-gate-g8.test.ts --maxWorkers=1`
  green: 1 file / 7 tests.
- `pnpm --filter @dynecho/engine exec vitest run src/wall-triple-leaf-accuracy-recovery-gate-c-contract.test.ts src/wall-triple-leaf-source-pack-extraction-gate-d-contract.test.ts src/wall-triple-leaf-source-corpus-contract.test.ts src/wall-triple-leaf-frequency-solver.test.ts src/wall-triple-leaf-calibration-regime.test.ts src/wall-triple-leaf-source-curve-digitization-intake.test.ts src/wall-triple-leaf-source-curve-digitization-qc.test.ts src/wall-triple-leaf-calibration-fit-gate-g3.test.ts src/wall-triple-leaf-local-material-mapping-gate-g4.test.ts src/wall-triple-leaf-blocked-diagnostics-gate-g5.test.ts src/wall-triple-leaf-local-source-acquisition-gate-g6.test.ts src/wall-triple-leaf-local-source-pack-acquisition-gate-g7.test.ts src/wall-triple-leaf-source-gap-and-order-risk-gate-g8.test.ts --maxWorkers=1`
  green: 13 files / 86 tests.
- `pnpm --filter @dynecho/engine lint`
  green.
- `pnpm calculator:gate:current`
  green after adding Gate G8 to the current runner: engine 176 files /
  911 tests, web 45 files / 216 passed + 18 skipped, build 5/5 with the
  known non-fatal `sharp/@img` warnings, whitespace guard clean.
