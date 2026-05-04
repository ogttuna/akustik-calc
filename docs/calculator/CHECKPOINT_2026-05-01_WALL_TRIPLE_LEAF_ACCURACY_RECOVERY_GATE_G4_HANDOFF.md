# Checkpoint - Wall Triple-Leaf Accuracy Recovery Gate G4 Handoff

Date: 2026-05-01

Slice: `wall_triple_leaf_accuracy_recovery_v1`

Gate: G4

Status: LANDED / LOCAL MATERIAL MAPPING AND RUNTIME ELIGIBILITY DECISION / NO RUNTIME

Gate G4 status:

`gate_g4_blocked_local_material_and_topology_mapping_no_runtime_selected_blocked_diagnostics_and_source_acquisition_gate_g5`

Next implementation file:

`packages/engine/src/wall-triple-leaf-blocked-diagnostics-gate-g5.test.ts`

## Decision

Gate G4 evaluates whether the local split-rockwool repro can enter the
Gate G3 NRC-like source family. The answer is no. The source-family
calibration still passes, but the local material and topology mapping
needed for runtime promotion is not owned.

The Gate G4 module is:

`packages/engine/src/wall-triple-leaf-local-material-mapping.ts`

The Gate G4 contract is:

`packages/engine/src/wall-triple-leaf-local-material-mapping-gate-g4.test.ts`

## Mapping Result

Blocked mappings:

- local generic `gypsum_board` is not proven equivalent to NRC
  `12.7 mm` Type C gypsum board at `9.80 kg/m2`;
- local `rockwool` is not proven equivalent to the NRC glass-fiber batt
  absorber;
- local `mlv` is absent from the NRC 2024 source family;
- local `gypsum_plaster` is absent from the NRC 2024 source family;
- the user repro uses `50 mm` cavities, not the NRC `92.1 mm` full-fill
  source-family cavities plus `25.4 mm` internal-board spacing;
- the local topology can express generic support class, but it does not
  own the NRC double `18 gauge` / `92.1 mm` steel stud support;
- paired engine/web visible runtime tests and Gate H integration are
  not landed.

## Runtime Hold

Runtime remains frozen. The live user split-rockwool repro still returns
low-confidence `multileaf_screening_blend` `Rw 41`.

Gate G4 keeps these unchanged:

- runtime numeric values;
- support status;
- confidence promotion;
- evidence tier;
- API shape;
- route-card values;
- output-card status;
- proposal/report copy;
- workbench input behavior.

## Next Gate

Gate G5 must turn the blocked local mapping into explicit diagnostics
and source-acquisition decisions. It should keep local `rockwool`,
`mlv`, and `gypsum_plaster` outside exact NRC-like runtime until a
source row or bounded effect model owns them.

## Validation

Gate G4 post-edit validation completed green on 2026-05-01:

- `pnpm --filter @dynecho/engine exec vitest run src/wall-triple-leaf-local-material-mapping-gate-g4.test.ts --maxWorkers=1`
  green: 1 file / 6 tests.
- `pnpm --filter @dynecho/engine exec vitest run src/wall-triple-leaf-accuracy-recovery-gate-c-contract.test.ts src/wall-triple-leaf-source-pack-extraction-gate-d-contract.test.ts src/wall-triple-leaf-source-corpus-contract.test.ts src/wall-triple-leaf-frequency-solver.test.ts src/wall-triple-leaf-calibration-regime.test.ts src/wall-triple-leaf-source-curve-digitization-intake.test.ts src/wall-triple-leaf-source-curve-digitization-qc.test.ts src/wall-triple-leaf-calibration-fit-gate-g3.test.ts src/wall-triple-leaf-local-material-mapping-gate-g4.test.ts --maxWorkers=1`
  green: 9 files / 60 tests.
- `pnpm --filter @dynecho/engine lint`
  green.
- `pnpm calculator:gate:current`
  green after adding Gate G4 to the current runner: engine 172 files /
  885 tests, web 45 files / 216 passed + 18 skipped, build 5/5 with the
  known non-fatal `sharp/@img` warnings, whitespace guard clean.
