# Checkpoint 2026-05-15 - Company-Internal Opening/Leak A-Weighted Surface Parity Handoff

## Landed Gate

`company_internal_opening_leak_a_weighted_spectrum_adapter_surface_parity_plan`
has landed with selection status:

`company_internal_opening_leak_a_weighted_spectrum_adapter_surface_parity_landed_selected_matrix_v6_refresh`

This closes the selected post-runtime surface step for the opening/leak
A-weighted spectrum-adapter lane. Runtime values did not move.

## Frozen Runtime Pins

- field `Dn,A 35.9`
- field `DnT,A 36.1`
- building `DnT,A 31.3`
- field budget `+/-9 dB`
- building budget `+/-11 dB`
- frequency band set `third_octave_100_3150`

The values still come from
`company_internal_opening_leak_a_weighted_spectrum_adapter_runtime_corridor`
through
`candidate_company_internal_opening_leak_a_weighted_family_physics_prediction`.
They remain source-absent family-physics predictions, not measured field
or building evidence.

## Surface Parity Closed

The same A-weighted basis is now visible across:

- output cards;
- route posture;
- scenario summary;
- corridor dossier;
- method dossier;
- local saved replay;
- server snapshot replay;
- calculator API payload;
- Markdown report;
- Dynamic Calculator frequency-band input surface.

The workbench now carries `frequencyBandSet` through the airborne field
context input surface, store, saved snapshots, server snapshots, live
scenario assembly, and route panel. Missing `frequencyBandSet` remains a
fail-closed input problem instead of an inferred A-weighted answer.

## Boundaries Preserved

- building `Dn,A` remains unsupported;
- lab `Rw` / `STC` are not aliased into A-weighted field/building
  metrics;
- ASTM `IIC` / `AIIC` remain out of this airborne lane;
- exact/source rows still take precedence when a true same-basis source
  match exists;
- base opening/leak field/building values stay frozen at field
  `R'w 36.4` / `Dn,w 36.7` / `DnT,w 36.9` and building `R'w 31.6` /
  `DnT,w 32.1`.

## Tests

Added/updated coverage:

- `packages/engine/src/company-internal-opening-leak-a-weighted-spectrum-adapter-surface-parity-contract.test.ts`
- `apps/web/features/workbench/company-internal-opening-leak-a-weighted-surface-parity.test.ts`
- `tools/dev/run-calculator-current-gate.ts`

These assert value pins, method/candidate ids, budget labels,
frequency-band propagation, card/report/API parity, saved replay, server
snapshot replay, and non-alias boundaries.

Validation after the final expectation refresh:

- `pnpm check` passed on 2026-05-15 with lint and typecheck clean,
  engine Vitest `560` files / `3311` tests, web Vitest `190` files /
  `1027` passed + `18` skipped, and repo build `5/5`.
- `git diff --check` passed.
- The broad check aligned one stale wall-selector building-context
  expectation to the current `needs_input` building-prediction owner
  contract; runtime values and support buckets did not move.

## Next Selected Action

Selected next action:

`company_internal_calculation_grade_mainline_matrix_v6_refresh_after_opening_leak_a_weighted_surface_parity_plan`

Selected next file:

`packages/engine/src/company-internal-calculation-grade-mainline-matrix-v6-contract.test.ts`

Selected next label:

company-internal matrix v6 refresh after opening/leak Dn,A / DnT,A surface parity
