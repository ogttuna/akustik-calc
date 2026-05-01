# Checkpoint - Wall Triple-Leaf Accuracy Recovery Gate F Handoff

Date: 2026-04-30

Slice: `wall_triple_leaf_accuracy_recovery_v1`

Gate: F

Status: LANDED / FREQUENCY-BAND SOLVER SKELETON / NO RUNTIME

Gate F status:

`gate_f_landed_frequency_band_solver_skeleton_no_runtime_and_selected_calibration_holdout_gate_g`

Next implementation file:

`packages/engine/src/wall-triple-leaf-calibration-regime.test.ts`

## Decision

Gate F adds a research-only three-leaf/two-cavity frequency-band solver
skeleton. It deliberately does not integrate into live calculator
runtime, support, confidence, evidence, route-card, output-card,
proposal/report, API, or workbench input behavior.

The solver module is:

`packages/engine/src/wall-triple-leaf-frequency-solver.ts`

The Gate F contract is:

`packages/engine/src/wall-triple-leaf-frequency-solver.test.ts`

## Solver Shape

Gate F builds curves from grouped topology instead of direct `Rw`
retuning:

- derives Side A, internal, and Side B leaf surface masses from grouped
  layer indices and material density / nominal surface-mass helpers;
- models cavity 1 and cavity 2 as mass-air-mass springs between
  adjacent leaf pairs;
- exposes both resonance bands and the interacting resonance pair;
- applies cavity fill coverage, absorption class, internal-leaf
  coupling, and support topology as explicit parameters;
- returns one-third-octave TL curves on the local `50 Hz` to `6300 Hz`
  band grid;
- computes `Rw`, `C`, `Ctr`, and STC through existing curve-rating
  helpers.

## Runtime Hold

Gate F freezes:

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
The Gate F curve is not source-owned and is not runtime-eligible.

## Blockers Carried To Gate G

Runtime promotion remains blocked by:

- no Gate G source-family calibration pass;
- no Gate G holdout tolerance owner;
- no paired engine and web visible runtime tests;
- no source-owned damping / coupling parameters;
- no protected negative-boundary pass for ordinary double leaf, simple
  stud, lined masonry / one-side lining, missing-curve/topology,
  floor/impact, and field-only rows.

## Next Gate

Gate G must calibrate or reject the solver before any runtime
integration:

- digitized or numeric source TL rows;
- local material mapping;
- damping / coupling parameter ownership;
- source-family MAE and max-error thresholds;
- low-frequency dip-band placement tolerance;
- holdout rows;
- paired engine/web visible tests.

If thresholds fail, the solver remains research-only and runtime stays
on fail-closed `multileaf_screening_blend`.

## Validation

Pre-edit current gate completed green on 2026-04-30:

- `pnpm calculator:gate:current`
  green before Gate F edits: engine 166 files / 842 tests, web 45 files
  / 216 passed + 18 skipped, build 5/5 with the known non-fatal
  `sharp/@img` warnings, whitespace guard clean.

Gate F focused validation completed green on 2026-04-30:

- `pnpm --filter @dynecho/engine exec vitest run src/wall-triple-leaf-frequency-solver.test.ts --maxWorkers=1`
  green after documentation alignment: 1 file / 8 tests.
- `pnpm --filter @dynecho/engine exec vitest run src/wall-triple-leaf-accuracy-recovery-gate-c-contract.test.ts src/wall-triple-leaf-source-pack-extraction-gate-d-contract.test.ts src/wall-triple-leaf-source-corpus-contract.test.ts src/wall-triple-leaf-frequency-solver.test.ts --maxWorkers=1`
  green: 4 files / 25 tests.
- `pnpm --filter @dynecho/engine lint`
  green.

Post-edit current-gate validation completed green on 2026-04-30:

- `pnpm calculator:gate:current`
  green after adding Gate F to the current-gate runner: engine 167
  files / 850 tests, web 45 files / 216 passed + 18 skipped, build 5/5
  with the known non-fatal `sharp/@img` warnings, whitespace guard
  clean.
