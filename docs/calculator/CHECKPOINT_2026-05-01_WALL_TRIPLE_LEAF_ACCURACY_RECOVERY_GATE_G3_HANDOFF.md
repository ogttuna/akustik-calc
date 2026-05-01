# Checkpoint - Wall Triple-Leaf Accuracy Recovery Gate G3 Handoff

Date: 2026-05-01

Slice: `wall_triple_leaf_accuracy_recovery_v1`

Gate: G3

Status: LANDED / SOURCE-FAMILY CALIBRATION FIT AND NEGATIVE-BOUNDARY PROOF / NO RUNTIME

Gate G3 status:

`gate_g3_passed_nrc_2024_source_family_calibration_holdout_and_negative_boundaries_no_runtime_selected_local_mapping_gate_g4`

Next implementation file:

`packages/engine/src/wall-triple-leaf-local-material-mapping-gate-g4.test.ts`

## Decision

Gate G3 fits a bounded NRC 2024 source-family model from the QC-passed
Type C / assemblies A-D curves. It proves calibration rows and the
holdout row against the Gate G tolerance, protects negative boundaries,
and keeps runtime frozen.

The Gate G3 module is:

`packages/engine/src/wall-triple-leaf-calibration-fit.ts`

The Gate G3 contract is:

`packages/engine/src/wall-triple-leaf-calibration-fit-gate-g3.test.ts`

## Fit Scope

The fit is NRC-like source family only:

- 12.7 mm Type C gypsum board;
- glass-fiber batt;
- 18 gauge 92.1 mm steel studs at 610 mm centers;
- double-stud support with 25.4 mm internal-board spacing.

It does not authorize local `mlv`, `rockwool`, or `gypsum_plaster`
runtime mapping.

## Source-Family Parameters

Gate G3 keeps the fitted model low-dimensional:

| Parameter | Value | Owner |
| --- | ---: | --- |
| Base Type C derived `Rw` | `63 dB` | QC-passed baseline row |
| Single internal-board full-fill penalty | `14 dB` | calibration row B vs baseline |
| Receiving-face second Type C board lift | `9 dB` | calibration row A vs B |
| Second internal Type C board mass lift | `6 dB` | physical mass prior `20log10(2)` |
| Low-frequency dip feature band | `100 Hz` | calibration dip feature |

## Accuracy Result

Calibration rows:

- Assembly A: measured / predicted `Rw 58 -> 58`, dip `80 -> 80 Hz`;
- Assembly B: measured / predicted `Rw 49 -> 49`, dip `100 -> 100 Hz`.

Holdout row:

- Assembly D: measured / predicted `Rw 55 -> 55`, dip `80 -> 80 Hz`.

The combined Gate G source-family accuracy passes with MAE `0 dB`, max
error `0 dB`, and max dip-band distance `0`.

Assembly C remains separate fill-regime context and is not used for the
full-fill NRC-like calibration/holdout pass.

## Negative Boundaries

Gate G3 keeps these out of the calibrated triple-leaf lane:

- ordinary gypsum-board walls without an internal leaf;
- lined masonry / one-side lining;
- ordinary double-leaf exact rows;
- simple stud walls without an internal leaf;
- rows missing band curves or exact topology;
- floor / impact rows;
- field-only rows without lab element curve ownership.

## Runtime Hold

Runtime remains blocked by:

- `local_material_mapping_not_owned_for_user_stack`;
- `paired_engine_web_visible_runtime_tests_not_written`;
- `gate_h_engine_integration_fail_closed_not_landed`.

The live user split-rockwool repro still returns low-confidence
`multileaf_screening_blend` `Rw 41`.

## Next Gate

Gate G4 must decide whether local `rockwool`, `mlv`, `gypsum_plaster`,
local gypsum board, and grouped topology can be mapped into the NRC-like
source family. If mapping is not owned, Gate G4 must keep runtime
fail-closed and select more source acquisition or explicit blocked UI
diagnostics.

## Validation

Pre-edit current gate completed green on 2026-05-01:

- `pnpm calculator:gate:current`
  green before Gate G3 edits: engine 170 files / 871 tests, web 45
  files / 216 passed + 18 skipped, build 5/5 with the known non-fatal
  `sharp/@img` warnings, whitespace guard clean.

Gate G3 post-edit validation completed green on 2026-05-01:

- `pnpm --filter @dynecho/engine exec vitest run src/wall-triple-leaf-calibration-fit-gate-g3.test.ts --maxWorkers=1`
  green: 1 file / 8 tests.
- `pnpm --filter @dynecho/engine exec vitest run src/wall-triple-leaf-accuracy-recovery-gate-c-contract.test.ts src/wall-triple-leaf-source-pack-extraction-gate-d-contract.test.ts src/wall-triple-leaf-source-corpus-contract.test.ts src/wall-triple-leaf-frequency-solver.test.ts src/wall-triple-leaf-calibration-regime.test.ts src/wall-triple-leaf-source-curve-digitization-intake.test.ts src/wall-triple-leaf-source-curve-digitization-qc.test.ts src/wall-triple-leaf-calibration-fit-gate-g3.test.ts --maxWorkers=1`
  green: 8 files / 54 tests.
- `pnpm --filter @dynecho/engine lint`
  green.
- `pnpm calculator:gate:current`
  green after adding Gate G3 to the current runner: engine 171 files /
  879 tests, web 45 files / 216 passed + 18 skipped, build 5/5 with the
  known non-fatal `sharp/@img` warnings, whitespace guard clean.
