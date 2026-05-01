# Checkpoint - Wall Triple-Leaf Accuracy Recovery Gate G Handoff

Date: 2026-04-30

Slice: `wall_triple_leaf_accuracy_recovery_v1`

Gate: G

Status: LANDED / CALIBRATION HOLDOUT REGIME / NO RUNTIME

Gate G status:

`gate_g_defined_calibration_holdout_regime_no_runtime_and_selected_source_curve_digitization_intake`

Next implementation file:

`packages/engine/src/wall-triple-leaf-source-curve-digitization-intake.test.ts`

## Decision

Gate G defines the source-owned calibration and holdout tolerance
regime for the Gate F research-only frequency-band solver. It
deliberately does not integrate the solver into live calculator runtime,
support, confidence, evidence, route-card, output-card, proposal/report,
API, or workbench input behavior.

The calibration module is:

`packages/engine/src/wall-triple-leaf-calibration-regime.ts`

The Gate G contract is:

`packages/engine/src/wall-triple-leaf-calibration-regime.test.ts`

## Tolerance Owner

The runtime promotion corridor is now explicit:

- at least two source-owned calibration rows;
- at least one source-owned holdout row;
- source-family MAE <= 2 dB;
- source-family max absolute error <= 4 dB;
- low-frequency dip-band placement within one neighboring
  one-third-octave band;
- all calibration and holdout rows must be source-owned;
- protected negatives must stay out of the runtime lane.

## Corpus Result

The current corpus does not pass Gate G. `nrc_2024_internal_gypsum_double_stud`
is only a blocked calibration candidate because the plotted TL curves
still need digitization and local material / coupling mapping. NRC 1998
ordinary gypsum-board TL rows remain baseline / negative-boundary only.
Uris 2006 remains qualitative until full curves and exact topology are
available. Ballagh 2013 remains solver-context only. Lined masonry,
ordinary double leaf, simple stud, missing-curve/topology, floor/impact,
and field-only rows stay protected negative boundaries.

Gate G blockers:

- `no_digitized_triple_leaf_source_rows`;
- `no_source_owned_holdout_rows`.

## Runtime Hold

Gate G freezes:

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
`multileaf_screening_blend` `Rw 41` in the live dynamic calculator. The
Gate F curve remains research-only and not source-owned.

## Next Gate

Gate G2 must digitize or reject source curves before integration:

- NRC 2024 plotted one-third-octave TL curves for assemblies A-D;
- NRC 2024 Type C base wall curve, because Figure 5 deltas need a
  consistency check against Figure 4 absolute curves;
- row-level topology, metric owner, band grid, material mapping, and
  internal-board coupling mapping;
- source-owned calibration versus holdout split;
- negative-boundary protection for ordinary double leaf, simple stud,
  lined masonry / one-side lining, missing-curve/topology,
  floor/impact, and field-only rows;
- no runtime or visible surface movement.

Post-Gate-G source review confirms the next blocker is not another
formula tweak. The NRC 2024 paper is the correct first graph source
because it explicitly describes internal gypsum board between double
stud rows, two mass-air-mass resonances around the low-frequency band,
and large TL reductions below 200 Hz. NRC 1998 remains baseline /
negative-boundary data: the official archive says it contains 350
gypsum board wall specimens with one-third-octave TL, specifications,
and construction details, but the current representative rows lack the
internal leaf and second cavity required for the triple-leaf lane.
ISO 717-1 rates curves, ISO 10140-2 defines lab measurement boundaries,
and ISO 12354-1 is for later field/building estimation; none of these
standards supplies the missing source TL curve.

Runtime integration remains behind Gate H and only after source curves
exist and Gate G3 tolerance / holdout / negative-boundary proof passes.

## Validation

Pre-edit current gate completed green on 2026-04-30:

- `pnpm calculator:gate:current`
  green before Gate G edits: engine 167 files / 850 tests, web 45 files
  / 216 passed + 18 skipped, build 5/5 with the known non-fatal
  `sharp/@img` warnings, whitespace guard clean.

Gate G focused validation completed green on 2026-04-30:

- `pnpm --filter @dynecho/engine exec vitest run src/wall-triple-leaf-calibration-regime.test.ts --maxWorkers=1`
  green: 1 file / 6 tests.
- `pnpm --filter @dynecho/engine exec vitest run src/wall-triple-leaf-accuracy-recovery-gate-c-contract.test.ts src/wall-triple-leaf-source-pack-extraction-gate-d-contract.test.ts src/wall-triple-leaf-source-corpus-contract.test.ts src/wall-triple-leaf-frequency-solver.test.ts src/wall-triple-leaf-calibration-regime.test.ts --maxWorkers=1`
  green after preserving Gate F doc continuity: 5 files / 31 tests.
- `pnpm --filter @dynecho/engine lint`
  green.

Post-edit current-gate validation completed green on 2026-04-30:

- `pnpm calculator:gate:current`
  green after adding Gate G to the current-gate runner: engine 168
  files / 856 tests, web 45 files / 216 passed + 18 skipped, build 5/5
  with the known non-fatal `sharp/@img` warnings, whitespace guard
  clean.
