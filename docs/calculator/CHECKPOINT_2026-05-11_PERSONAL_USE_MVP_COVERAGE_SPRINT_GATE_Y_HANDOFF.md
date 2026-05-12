# Personal-Use MVP Coverage Sprint Gate Y Handoff

Date: 2026-05-11

## Status

Gate Y has landed:

`gate_y_personal_use_mvp_clt_mass_timber_ctr_spectrum_adapter_plan`

Selection status:

`gate_y_personal_use_mvp_clt_mass_timber_ctr_spectrum_adapter_landed_selected_post_gate_y_revalidation_gate_z`

Selected next action:

`gate_z_personal_use_mvp_post_clt_ctr_coverage_revalidation_plan`

Selected next file:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-z-post-clt-ctr-coverage-revalidation-contract.test.ts`

## What Changed

Gate Y promotes the already calculated CLT / mass-timber element-lab
`Ctr` value from the ISO 717-1 dynamic delegate curve into supported
calculator output, but only for complete source-absent CLT /
mass-timber single-panel lab inputs.

The pinned complete CLT wall remains:

- `Rw 42`
- `STC 42`
- `C -1.2`
- `Ctr -6.1`
- `+/-6 dB` uncalibrated source-absent error budget

The runtime basis is now:

`gate_y_clt_mass_timber_ctr_spectrum_adapter_runtime`

Candidate id:

`candidate_clt_mass_timber_ctr_spectrum_adapter_family_physics_prediction`

This is a support/basis promotion over an already finite calculated
frequency-curve value. It is not a measured-source promotion, a
calibration retune, an ASTM-only adapter, or a field/building alias.

## Guardrails

- Exact measured/source rows still win when they truly match.
- Missing custom CLT density stays `needs_input` and does not receive a
  Gate Y budget.
- Wrong families, AAC, lined massive, duplicate/ambiguous CLT leaves,
  field/apparent requests, building-prediction requests, and STC-only
  requests stay outside the Gate Y adapter.
- `Rw`, `STC`, `C`, `Ctr`, and the `+/-6 dB` budget are not retuned.
- The Gate H CLT parent curve remains the source-absent frequency
  signal; Gate Y only owns the ISO 717-1 traffic-spectrum support
  adapter.

## Implementation Surfaces

- `packages/engine/src/dynamic-airborne-gate-y-clt-mass-timber-ctr-spectrum-adapter.ts`
- `packages/engine/src/calculate-assembly.ts`
- `packages/engine/src/dynamic-calculator-candidate-resolver-runtime.ts`
- `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-y.ts`
- `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-y-clt-mass-timber-ctr-spectrum-adapter-contract.test.ts`
- `tools/dev/run-calculator-current-gate.ts`

## Validation Result

Validation completed on 2026-05-11:

- Focused Gate Y engine contract passed: 1 file / 7 tests.
- Gate H/X/Y continuity passed: 3 files / 21 tests.
- Targeted Gate W/O/P expectation refresh passed: 3 files / 15 tests.
- Engine typecheck passed.
- `pnpm calculator:gate:current` passed: engine 366 files / 2116 tests,
  web 73 files / 314 passed + 18 skipped, repo build 5/5, whitespace
  guard clean.
- `pnpm check` passed: lint clean, typecheck clean, engine 491 files /
  2918 tests, web 179 files / 989 passed + 18 skipped, repo build 5/5.
- `git diff --check` passed before the final validation-result doc edit.

Known non-fatal output remained unchanged: Zustand storage warnings in
web tests where storage is unavailable, and optional `sharp` package
resolution warnings during Next build. Neither warning failed the check.

Gate Z should now perform a no-runtime coverage revalidation over the
refreshed matrix before selecting the next highest-ROI calculator lane.
