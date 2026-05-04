# Checkpoint - Wall Triple-Leaf Accuracy Recovery Gate G6 Handoff

Date: 2026-05-01

Slice: `wall_triple_leaf_accuracy_recovery_v1`

Gate: G6

Status: LANDED / LOCAL SOURCE ACQUISITION AND EFFECT MODEL REQUIREMENTS / NO RUNTIME

Gate G6 status:

`gate_g6_landed_local_source_and_effect_model_requirements_no_runtime_selected_source_pack_acquisition_gate_g7`

Next implementation file:

`packages/engine/src/wall-triple-leaf-local-source-pack-acquisition-gate-g7.test.ts`

## Decision

Gate G6 turns the Gate G5 diagnostics into explicit pre-runtime source,
mapping, and bounded-effect requirements. It does not change the live
calculator result, support status, confidence, evidence, route-card,
output-card, proposal/report copy, API shape, or workbench input
behavior.

The Gate G6 module is:

`packages/engine/src/wall-triple-leaf-local-source-acquisition.ts`

The Gate G6 contract is:

`packages/engine/src/wall-triple-leaf-local-source-acquisition-gate-g6.test.ts`

## Requirements

Gate G6 keeps every requirement blocked before runtime:

1. local Type C board product mapping from generic `gypsum_board`;
2. rockwool/mineral-wool absorber equivalence or direct measured row;
3. local `50 mm` rockwool cavity measured or digitized source row;
4. MLV limp-mass triple-leaf bounded effect model;
5. gypsum plaster face-finish bounded effect model;
6. support gauge/depth/spacing and frame-independence input mapping.

The two direct measured or digitized row requirements are the
rockwool/mineral-wool absorber substitution and the local `50 mm`
two-cavity family. MLV and gypsum plaster remain bounded-effect-model
blockers, not source-family shortcuts.

## Runtime Hold

The live user split-rockwool repro still returns low-confidence
`multileaf_screening_blend` `Rw 41`. Gate G6 only selects Gate G7
source-pack acquisition intake; it does not authorize Gate H runtime
integration.

## Validation

Gate G6 post-edit validation completed green on 2026-05-01:

- `pnpm --filter @dynecho/engine exec vitest run src/wall-triple-leaf-local-source-acquisition-gate-g6.test.ts --maxWorkers=1`
  green: 1 file / 6 tests.
- `pnpm --filter @dynecho/engine exec vitest run src/wall-triple-leaf-accuracy-recovery-gate-c-contract.test.ts src/wall-triple-leaf-source-pack-extraction-gate-d-contract.test.ts src/wall-triple-leaf-source-corpus-contract.test.ts src/wall-triple-leaf-frequency-solver.test.ts src/wall-triple-leaf-calibration-regime.test.ts src/wall-triple-leaf-source-curve-digitization-intake.test.ts src/wall-triple-leaf-source-curve-digitization-qc.test.ts src/wall-triple-leaf-calibration-fit-gate-g3.test.ts src/wall-triple-leaf-local-material-mapping-gate-g4.test.ts src/wall-triple-leaf-blocked-diagnostics-gate-g5.test.ts src/wall-triple-leaf-local-source-acquisition-gate-g6.test.ts --maxWorkers=1`
  green: 11 files / 72 tests.
- `pnpm --filter @dynecho/engine lint`
  green.
- `pnpm calculator:gate:current`
  green after adding Gate G6 to the current runner: engine 174 files /
  897 tests, web 45 files / 216 passed + 18 skipped, build 5/5 with the
  known non-fatal `sharp/@img` warnings, whitespace guard clean.
