# Checkpoint - Wall Triple-Leaf Accuracy Recovery Gate G2 Handoff

Date: 2026-04-30

Slice: `wall_triple_leaf_accuracy_recovery_v1`

Gate: G2

Status: LANDED / SOURCE-CURVE DIGITIZATION INTAKE / NO RUNTIME

Gate G2 status:

`gate_g2_landed_source_curve_digitization_intake_no_runtime_and_selected_reproducible_digitization_qc`

Next implementation file:

`packages/engine/src/wall-triple-leaf-source-curve-digitization-qc.test.ts`

## Decision

Gate G2 creates the typed NRC 2024 source-curve intake. It records the
Type C base wall and assemblies A-D as graph-derived source rows, but
keeps all rows blocked because the source exposes Figure 4 / Figure 5 as
plotted image data rather than tabular one-third-octave TL values.

The source-curve intake module is:

`packages/engine/src/wall-triple-leaf-source-curve-digitization-intake.ts`

The Gate G2 contract is:

`packages/engine/src/wall-triple-leaf-source-curve-digitization-intake.test.ts`

## Source Rows

Gate G2 pins five NRC 2024 graph rows:

- `nrc_2024_base_type_c_double_stud`, baseline only, reported STC 64;
- `nrc_2024_assembly_a_internal_board`, candidate, reported STC 64;
- `nrc_2024_assembly_b_internal_board`, candidate, reported STC 60;
- `nrc_2024_assembly_c_one_side_insulation`, separate fill-regime
  candidate, reported STC 57;
- `nrc_2024_assembly_d_internal_board`, candidate, reported STC 65.

Every row records `sourceId`, `assemblyId`, `figureId`, `curveId`,
`bandGridHz`, `reportedStc`, `topology`, `materialMapping`,
`calibrationRole`, and `runtimeImportReadyNow`. Every row deliberately
keeps `transmissionLossDb`, `derivedRw`, and
`digitizationUncertaintyDb` null until reproducible digitization QC
exists.

## Blockers

Gate G2 blockers:

- `no_nrc_2024_graph_row_has_digitized_band_vector`;
- `insufficient_internal_board_rows_for_fit`;
- `no_source_owned_holdout_split`;
- `local_material_mapping_not_owned_for_user_stack`.

The PDF review confirms that the source is usable for graph intake, not
yet for runtime: `pdfimages` shows the relevant Figure 4 / Figure 5
curves as embedded images, and `pdftotext` exposes labels and captions
but not numeric TL vectors. Therefore Gate G2 selects reproducible
digitization QC rather than solver fitting.

## Runtime Hold

Gate G2 freezes:

- runtime numeric values;
- support status;
- confidence promotion;
- evidence promotion;
- API shape;
- route-card values;
- output-card status;
- proposal/report copy;
- workbench input behavior.

The user split-rockwool repro still returns low-confidence
`multileaf_screening_blend` `Rw 41` in the live dynamic calculator.

## Next Gate

Gate G2B must make digitization reproducible or reject the graph source:

- render Figure 4 / Figure 5 at fixed resolution and record the render
  provenance;
- calibrate x/y axes from visible ticks;
- digitize the base Type C curve and assemblies A-D into
  one-third-octave TL vectors;
- compute derived local `Rw` through the existing ISO 717 helper;
- cross-check Figure 5 deltas against `assemblyTL - baseTL`;
- declare per-row uncertainty and assign calibration/holdout roles only
  after QC passes.

Runtime integration remains behind Gate H and only after Gate G2B
supplies executable source curves and Gate G3 proves calibration /
holdout / negative-boundary pass.

## Validation

Pre-edit current gate completed green on 2026-04-30:

- `pnpm calculator:gate:current`
  green before Gate G2 edits: engine 168 files / 856 tests, web 45
  files / 216 passed + 18 skipped, build 5/5 with the known non-fatal
  `sharp/@img` warnings, whitespace guard clean.

Gate G2 post-edit validation completed green on 2026-04-30:

- `pnpm --filter @dynecho/engine exec vitest run src/wall-triple-leaf-source-curve-digitization-intake.test.ts --maxWorkers=1`
  green: 1 file / 7 tests.
- `pnpm --filter @dynecho/engine exec vitest run src/wall-triple-leaf-accuracy-recovery-gate-c-contract.test.ts src/wall-triple-leaf-source-pack-extraction-gate-d-contract.test.ts src/wall-triple-leaf-source-corpus-contract.test.ts src/wall-triple-leaf-frequency-solver.test.ts src/wall-triple-leaf-calibration-regime.test.ts src/wall-triple-leaf-source-curve-digitization-intake.test.ts --maxWorkers=1`
  green: 6 files / 38 tests.
- `pnpm --filter @dynecho/engine lint`
  green.
- `pnpm calculator:gate:current`
  green after adding Gate G2 to the current runner: engine 169 files /
  863 tests, web 45 files / 216 passed + 18 skipped, build 5/5 with the
  known non-fatal `sharp/@img` warnings, whitespace guard clean.
