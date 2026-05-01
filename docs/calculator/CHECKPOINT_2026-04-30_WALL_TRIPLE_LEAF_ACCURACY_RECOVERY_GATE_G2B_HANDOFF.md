# Checkpoint - Wall Triple-Leaf Accuracy Recovery Gate G2B Handoff

Date: 2026-04-30

Slice: `wall_triple_leaf_accuracy_recovery_v1`

Gate: G2B

Status: LANDED / REPRODUCIBLE CURVE DIGITIZATION QC / NO RUNTIME

Gate G2B status:

`gate_g2b_landed_reproducible_curve_digitization_qc_no_runtime_and_selected_calibration_fit_gate_g3`

Next implementation file:

`packages/engine/src/wall-triple-leaf-calibration-fit-gate-g3.test.ts`

## Decision

Gate G2B turns the NRC 2024 Figure 4 / Figure 5 graph intake into
bounded one-third-octave source curves for research calibration. It does
not move runtime, support, confidence, evidence, API, workbench input,
route-card, output-card, or proposal/report behavior.

The digitization QC module is:

`packages/engine/src/wall-triple-leaf-source-curve-digitization-qc.ts`

The Gate G2B contract is:

`packages/engine/src/wall-triple-leaf-source-curve-digitization-qc.test.ts`

## Reproducibility

Gate G2B records:

- source PDF SHA-256:
  `e38ef3f18e7c4a0be3f7b2e011587a83c4da071ee69f11c28e217d67be88c1d8`;
- rendered page image SHA-256:
  `b109966bc15183fd5387678e12b7096bfa397a8b100afbea41b4e1e07a71bbed`;
- render command:
  `pdftoppm -png -f 4 -l 4 -r 180 tmp/pdfs/nrc-2024-triple-leaf.pdf tmp/pdfs/nrc-2024-page`;
- Figure 4 plot box: left `195`, top `180`, right `716`, bottom `648`
  with y-axis `0..90 dB`;
- Figure 5 plot box: left `195`, top `887`, right `716`, bottom `1355`
  with y-axis `-20..5 dB`;
- x-axis: `50..5000 Hz`, 21 one-third-octave bands.

Digitization uncertainty is bounded to `2 dB` per row. Figure 5 deltas
are cross-checked against `assemblyTL - baseTL`.

## Source Rows

Gate G2B pins five QC-passed graph rows:

| Row | Source role | Reported STC | Derived STC | Derived Rw |
| --- | --- | ---: | ---: | ---: |
| `nrc_2024_base_type_c_double_stud` | baseline only | 64 | 64 | 63 |
| `nrc_2024_assembly_a_internal_board` | calibration | 64 | 64 | 58 |
| `nrc_2024_assembly_b_internal_board` | calibration | 60 | 60 | 49 |
| `nrc_2024_assembly_c_one_side_insulation` | separate fill-regime context | 57 | 57 | 51 |
| `nrc_2024_assembly_d_internal_board` | holdout | 65 | 65 | 55 |

The high reported STC values for assemblies A and D do not mean the
wall is safe for exact runtime. The digitized Rw values are lower
because ISO 717 weighting starts at 100 Hz and the internal board causes
large low-frequency dips.

## Runtime Hold

Runtime remains blocked by:

- `gate_g3_solver_fit_not_run`;
- `local_material_mapping_not_owned_for_user_stack`;
- `paired_engine_web_visible_runtime_tests_not_written`.

The user split-rockwool repro still returns low-confidence
`multileaf_screening_blend` `Rw 41` in the live dynamic calculator.

## Next Gate

Gate G3 must fit only physically meaningful low-dimensional solver
parameters against the QC-passed curves, prove calibration and holdout
separately against Gate G tolerance, and protect negative boundaries.

Runtime integration remains behind Gate H and only after Gate G3 proves
calibration / holdout / negative-boundary pass and local material mapping
is owned.

## Validation

Pre-edit current gate completed green on 2026-04-30:

- `pnpm calculator:gate:current`
  green before Gate G2B edits: engine 169 files / 863 tests, web 45
  files / 216 passed + 18 skipped, build 5/5 with the known non-fatal
  `sharp/@img` warnings, whitespace guard clean.

Gate G2B post-edit validation completed green on 2026-04-30:

- `pnpm --filter @dynecho/engine exec vitest run src/wall-triple-leaf-source-curve-digitization-qc.test.ts --maxWorkers=1`
  green: 1 file / 8 tests.
- `pnpm --filter @dynecho/engine exec vitest run src/wall-triple-leaf-accuracy-recovery-gate-c-contract.test.ts src/wall-triple-leaf-source-pack-extraction-gate-d-contract.test.ts src/wall-triple-leaf-source-corpus-contract.test.ts src/wall-triple-leaf-frequency-solver.test.ts src/wall-triple-leaf-calibration-regime.test.ts src/wall-triple-leaf-source-curve-digitization-intake.test.ts src/wall-triple-leaf-source-curve-digitization-qc.test.ts --maxWorkers=1`
  green: 7 files / 46 tests.
- `pnpm --filter @dynecho/engine lint`
  green.
- `pnpm calculator:gate:current`
  green after adding Gate G2B to the current runner: engine 170 files /
  871 tests, web 45 files / 216 passed + 18 skipped, build 5/5 with the
  known non-fatal `sharp/@img` warnings, whitespace guard clean.
