# Checkpoint - Wall Triple-Leaf Accuracy Recovery Gate G5 Handoff

Date: 2026-05-01

Slice: `wall_triple_leaf_accuracy_recovery_v1`

Gate: G5

Status: LANDED / BLOCKED DIAGNOSTICS AND SOURCE ACQUISITION DECISION / NO RUNTIME

Gate G5 status:

`gate_g5_landed_blocked_diagnostics_no_runtime_selected_local_source_acquisition_gate_g6`

Next implementation file:

`packages/engine/src/wall-triple-leaf-local-source-acquisition-gate-g6.test.ts`

## Decision

Gate G5 converts the Gate G4 blocked local material/topology mapping
into explicit diagnostic and source-acquisition requirements. It does
not change the live calculator result, support status, confidence,
evidence, route-card, output-card, proposal/report copy, API shape, or
workbench input behavior.

The Gate G5 module is:

`packages/engine/src/wall-triple-leaf-blocked-diagnostics.ts`

The Gate G5 contract is:

`packages/engine/src/wall-triple-leaf-blocked-diagnostics-gate-g5.test.ts`

## Diagnostics

Gate G5 keeps the current `Rw 41` answer visibly caveated as screening,
not a fixed or validated triple-leaf calculation.

Blocking diagnostics cover:

- generic local `gypsum_board` is not owned as NRC Type C gypsum board;
- local `rockwool` is not owned as the NRC glass-fiber batt absorber;
- local `mlv` is absent from the source family;
- local `gypsum_plaster` is absent from the source family;
- local `50 mm` cavities are not the NRC `92.1 mm` full-fill source
  family;
- the internal leaf is still generic board, not source-owned Type C;
- support gauge/depth/spacing ownership is missing;
- face leaves contain out-of-family mass layers;
- paired engine/web visible runtime tests are not landed.

## Gate G6 Acquisition Targets

Gate G5 selects Gate G6 to decide local source acquisition and bounded
effect-model requirements before any Gate H runtime integration:

1. local Type C board product mapping;
2. rockwool/mineral-wool absorber equivalence or measured row;
3. local `50 mm` rockwool cavity source row;
4. MLV limp-mass triple-leaf effect model;
5. gypsum plaster face-finish effect model;
6. support gauge/depth/spacing mapping.

Every target remains required before runtime. None authorizes runtime
movement by itself.

## Runtime Hold

The live user split-rockwool repro still returns low-confidence
`multileaf_screening_blend` `Rw 41`.

## Validation

Gate G5 post-edit validation completed green on 2026-05-01:

- `pnpm --filter @dynecho/engine exec vitest run src/wall-triple-leaf-blocked-diagnostics-gate-g5.test.ts --maxWorkers=1`
  green: 1 file / 6 tests.
- `pnpm --filter @dynecho/engine exec vitest run src/wall-triple-leaf-accuracy-recovery-gate-c-contract.test.ts src/wall-triple-leaf-source-pack-extraction-gate-d-contract.test.ts src/wall-triple-leaf-source-corpus-contract.test.ts src/wall-triple-leaf-frequency-solver.test.ts src/wall-triple-leaf-calibration-regime.test.ts src/wall-triple-leaf-source-curve-digitization-intake.test.ts src/wall-triple-leaf-source-curve-digitization-qc.test.ts src/wall-triple-leaf-calibration-fit-gate-g3.test.ts src/wall-triple-leaf-local-material-mapping-gate-g4.test.ts src/wall-triple-leaf-blocked-diagnostics-gate-g5.test.ts --maxWorkers=1`
  green: 10 files / 66 tests.
- `pnpm --filter @dynecho/engine lint`
  green.
- `pnpm calculator:gate:current`
  green after adding Gate G5 to the current runner: engine 173 files /
  891 tests, web 45 files / 216 passed + 18 skipped, build 5/5 with the
  known non-fatal `sharp/@img` warnings, whitespace guard clean.
