# Company-Internal Opening/Leak A-Weighted Runtime Corridor Handoff

Date: 2026-05-15

## Status

`company_internal_opening_leak_a_weighted_spectrum_adapter_runtime_corridor_plan`
has landed.

Selection status:
`company_internal_opening_leak_a_weighted_spectrum_adapter_runtime_corridor_landed_selected_surface_parity`.

Selected next action:
`company_internal_opening_leak_a_weighted_spectrum_adapter_surface_parity_plan`.

Selected next file:
`packages/engine/src/company-internal-opening-leak-a-weighted-spectrum-adapter-surface-parity-contract.test.ts`.

Selected next label:
opening/leak Dn,A / DnT,A card/report/API parity.

## Runtime Values

The runtime corridor promotes only complete opening/leak field/building
requests with `frequencyBandSet: "third_octave_100_3150"`.

- Field runtime: field `Dn,A 35.9`, field `DnT,A 36.1`, with base
  field `Dn,w 36.7`, `DnT,w 36.9`, and `R'w 36.4`.
- Building runtime: building `DnT,A 31.3`, with base building
  `DnT,w 32.1` and `R'w 31.6`.
- Building `Dn,A` remains unsupported because the current building route
  owns standardized `DnT,A`, not apparent `Dn,A`.
- Lab `Rw` / `STC`, ASTM `IIC` / `AIIC`, and field/building metrics
  remain separate; no lab or ASTM alias has been added.

The runtime basis is
`company_internal_opening_leak_a_weighted_spectrum_adapter_runtime_corridor`.
The dedicated candidate id is
`candidate_company_internal_opening_leak_a_weighted_family_physics_prediction`.

## Error Budget

The A-weighted adapter still uses the formula-corridor `-0.8 dB`
single-number adapter. It is source-absent, not measured evidence.

- Field A-weighted budget: base `+/-8 dB` plus `+/-1 dB` adapter term,
  total `+/-9 dB`.
- Building A-weighted budget: base `+/-10 dB` plus `+/-1 dB` adapter
  term, total `+/-11 dB`.

## Boundaries

- Missing `frequencyBandSet` leaves base field/building values live but
  keeps `Dn,A` / `DnT,A` unsupported and emits the precise
  `frequencyBandSet` warning.
- Building `Dn,A` remains unsupported even with the frequency-band set.
- Element-lab opening/leak `Rw 38.2` / `STC` remains Gate S lab runtime;
  it is not relabelled as field/building A-weighted output.
- Exact same-basis A-weighted source rows, if later added, must stay
  above this source-absent formula runtime in candidate precedence.

## Validation Target

The current gate now includes:

- `packages/engine/src/company-internal-opening-leak-a-weighted-spectrum-adapter-runtime-corridor-contract.test.ts`

Next slice should make the same values visible across cards, route
posture, dossiers, saved replay, calculator API, impact/API boundaries
where relevant, and Markdown report text without changing the runtime
values.
