# Company-Internal Opening/Leak A-Weighted Formula Corridor Handoff

Date: 2026-05-15

## Status

Landed gate:

`company_internal_opening_leak_a_weighted_spectrum_adapter_formula_corridor_plan`

Selection status:

`company_internal_opening_leak_a_weighted_spectrum_adapter_formula_corridor_landed_no_runtime_selected_runtime_corridor`

Selected next action:

`company_internal_opening_leak_a_weighted_spectrum_adapter_runtime_corridor_plan`

Selected next file:

`packages/engine/src/company-internal-opening-leak-a-weighted-spectrum-adapter-runtime-corridor-contract.test.ts`

Selected next label:

opening/leak Dn,A / DnT,A spectrum-adapter runtime corridor

## What Landed

The formula corridor is now executable as a no-runtime contract in:

`packages/engine/src/company-internal-opening-leak-a-weighted-spectrum-adapter-formula-corridor-contract.ts`

The selected test file has landed:

`packages/engine/src/company-internal-opening-leak-a-weighted-spectrum-adapter-formula-corridor-contract.test.ts`

This gate defines the source-absent opening/leak A-weighted companion
formula without moving calculator runtime values:

- field `Dn,A = Dn,w + ownedAdapterDb`;
- field `DnT,A = DnT,w + ownedAdapterDb`;
- building `DnT,A = DnT,w + ownedAdapterDb`;
- building `Dn,A` remains unsupported because the current building
  opening/leak route owns apparent `R'w` and standardized `DnT,w`, not
  local `Dn,w`.

Current design pins:

- field `Dn,A 35.9`;
- field `DnT,A 36.1`;
- building `DnT,A 31.3`;
- owned adapter: `-0.8 dB`;
- field A-weighted budget: base `+/-8 dB` plus `+/-1 dB` adapter term,
  total `+/-9 dB`;
- building A-weighted budget: base `+/-10 dB` plus `+/-1 dB` adapter
  term, total `+/-11 dB`.

These values are formula-corridor design pins only. They are not yet
runtime outputs, not measured evidence, and not exact source rows.

## Guardrails

The formula corridor keeps these boundaries explicit:

- missing `frequencyBandSet` stays `needs_input`;
- missing same-route spectrum/adapter/budget owners stay blocked;
- lab `Rw` / `STC` cannot alias to field/building `Dn,A` / `DnT,A`;
- ASTM `IIC` / `AIIC` remains outside this airborne adapter route;
- building `Dn,A` is not promoted;
- true same-basis exact A-weighted source packets remain higher
  precedence if they ever exist.

The workbench caveat from the remaining-gap analysis still matters:
`frequencyBandSet` is in the shared schema and owner/formula contract,
but the opening/leak field/building workbench surface must carry it or
show the same missing-input block before the Dynamic Calculator UI can be
called ready for the A-weighted runtime.

## Runtime Freeze

Current runtime remains unchanged:

- field opening/leak keeps `R'w 36.4` / `Dn,w 36.7` / `DnT,w 36.9`;
- building opening/leak keeps `R'w 31.6` / `DnT,w 32.1`;
- field `Dn,A` / `DnT,A` and building `DnT,A` are still unsupported
  until the selected runtime corridor lands.

## Validation

- Focused engine validation passed:
  `pnpm --filter @dynecho/engine exec vitest run src/company-internal-opening-leak-a-weighted-spectrum-adapter-formula-corridor-contract.test.ts src/company-internal-opening-leak-a-weighted-spectrum-adapter-owner-contract.test.ts src/company-internal-calculation-grade-mainline-matrix-v5-contract.test.ts --maxWorkers=1`.
  Result: 3 files / 17 tests passed.
- Current calculator gate passed:
  `pnpm calculator:gate:current`.
  Result: engine 430 files / 2490 tests passed; web 82 files / 346
  passed + 18 skipped; repo build 5/5. The known optional `sharp/@img`
  build warnings and test-storage warnings remain non-fatal.
- Whitespace guard passed: `git diff --check`.

## Next Slice

Implement
`company_internal_opening_leak_a_weighted_spectrum_adapter_runtime_corridor_plan`.

The runtime slice should:

1. promote only field `Dn,A`, field `DnT,A`, and building `DnT,A` through
   the formula pins above;
2. keep building `Dn,A`, lab aliases, ASTM aliases, and exact-source
   precedence boundaries intact;
3. require or carry `frequencyBandSet` through runtime paths;
4. leave cards/reports/API parity to the following surface slice unless
   the runtime change requires minimal schema plumbing.
