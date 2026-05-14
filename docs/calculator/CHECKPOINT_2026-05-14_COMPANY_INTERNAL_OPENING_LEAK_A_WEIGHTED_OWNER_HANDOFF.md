# Company-Internal Opening/Leak A-Weighted Owner Handoff

Date: 2026-05-14

## Landed Gate

`company_internal_opening_leak_a_weighted_spectrum_adapter_owner_contract_plan`

## Selection Status

`company_internal_opening_leak_a_weighted_spectrum_adapter_owner_contract_landed_no_runtime_selected_formula_corridor`

## Selected Next Action

`company_internal_opening_leak_a_weighted_spectrum_adapter_formula_corridor_plan`

## Selected Next File

`packages/engine/src/company-internal-opening-leak-a-weighted-spectrum-adapter-formula-corridor-contract.test.ts`

## Selected Next Label

opening/leak Dn,A / DnT,A spectrum-adapter formula corridor

## What Changed

The Matrix V5 selected opening/leak A-weighted owner contract is now
executable. This is a no-runtime owner gate: it does not promote `Dn,A`
or `DnT,A`, does not move the existing opening/leak field/building
values, and does not alias lab `Rw` / `STC` into A-weighted outputs.

Current runtime probes remain frozen:

- field opening/leak keeps `R'w 36.4` / `Dn,w 36.7` / `DnT,w 36.9`
  with `+/-8 dB`;
- building opening/leak keeps `R'w 31.6` / `DnT,w 32.1` with
  `+/-10 dB`;
- field `Dn,A` / `DnT,A` and building `DnT,A` remain unsupported until
  the next formula corridor owns the spectrum adapter;
- building `Dn,A` stays outside this owner because the current building
  route owns apparent `R'w` and standardized `DnT,w`, not local `Dn,w`.

## Owner Contract

Field apparent `Dn,A` / `DnT,A` now require:

- `frequencyBandSet`;
- field opening/leak A-weighted spectrum curve ownership;
- ISO 717 C or A-weighted spectrum adapter ownership;
- `Dn,A` companion policy ownership;
- standardized `DnT,A` companion policy ownership;
- A-weighted opening/leak uncertainty budget ownership;
- exact A-weighted opening packet precedence;
- lab `Rw` / `STC` alias guard ownership.

Building prediction `DnT,A` now requires:

- `frequencyBandSet`;
- building opening/leak A-weighted spectrum curve ownership;
- ISO 717 C or A-weighted spectrum adapter ownership;
- building `DnT,A` companion policy ownership;
- standardized `DnT,A` companion policy ownership;
- A-weighted opening/leak uncertainty budget ownership;
- exact A-weighted opening packet precedence;
- lab `Rw` / `STC` alias guard ownership.

## Negative Boundaries

- Missing `frequencyBandSet` returns `needs_input`.
- Missing spectrum owner returns `adapter_owner_missing`.
- Lab `Rw` / `STC` does not become `Dn,A` or `DnT,A`.
- Building `Dn,A` is not promoted by this owner.
- ASTM `IIC` / `AIIC` remains outside the airborne A-weighted adapter.
- No broad source crawl is required for this owner gate.

## Validation

Focused validation:

```bash
pnpm --filter @dynecho/engine exec vitest run src/company-internal-opening-leak-a-weighted-spectrum-adapter-owner-contract.test.ts --maxWorkers=1
```

Run with neighboring matrix/runtime tests before handoff:

```bash
pnpm --filter @dynecho/engine exec vitest run src/company-internal-calculation-grade-mainline-matrix-v5-contract.test.ts src/company-internal-opening-leak-a-weighted-spectrum-adapter-owner-contract.test.ts src/company-internal-opening-leak-building-runtime-corridor-contract.test.ts src/company-internal-opening-leak-building-surface-parity-contract.test.ts --maxWorkers=1
```

Then run:

```bash
pnpm --filter @dynecho/engine typecheck
git diff --check
```

If runtime behavior moves in the next formula corridor, run
`pnpm calculator:gate:current`.
