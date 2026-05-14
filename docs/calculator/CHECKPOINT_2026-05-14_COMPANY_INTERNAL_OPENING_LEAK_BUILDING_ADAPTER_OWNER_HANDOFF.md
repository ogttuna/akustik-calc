# Company-Internal Opening/Leak Field/Building Adapter Owner Handoff

Date: 2026-05-14

Landed gate:

`company_internal_opening_leak_building_adapter_owner_contract_plan`

Selection status:

`company_internal_opening_leak_building_adapter_owner_contract_landed_no_runtime_selected_runtime_corridor`

Selected next action:

`company_internal_opening_leak_building_runtime_corridor_plan`

Selected next file:

`packages/engine/src/company-internal-opening-leak-building-runtime-corridor-contract.test.ts`

Selected next label:

opening/leak field/building runtime corridor

## What Landed

This is a no-runtime owner boundary after Matrix V4 selected the
opening/leak building-context adapter lane.

Gate S lab opening/leak remains unchanged:

- lab `Rw 38.2`;
- lab `STC 39`;
- `gate_s_opening_leak_composite_area_energy_runtime_corridor`;
- `+/-6 dB` source-absent lab opening/leak budget.

The new company-internal contract makes field/apparent and
building-prediction opening/leak ownership explicit before any later
runtime corridor can promote `R'w` / `DnT,w`.

Field/apparent owner group:

- target outputs: `R'w`, `Dn,w`, `Dn,A`, `DnT,w`, `DnT,A`;
- physical inputs: `contextMode`, host wall area, opening area/count,
  opening element `Rw`, opening rating basis, opening seal/leakage class,
  opening origin, panel width/height, receiving-room volume, and
  receiving-room RT60;
- runtime owners: lab opening/leak composite curve, field opening/leak
  curve, field flanking penalty, room normalization, field uncertainty
  budget, and exact field/building opening packet precedence.

Building-prediction owner group:

- target outputs: `R'w`, `DnT,w`, `DnT,A`;
- physical inputs: the opening/leak common inputs plus panel geometry,
  source-room volume, receiving-room volume/RT60, flanking/junction
  class, conservative flanking assumption, junction coupling length, and
  building output basis;
- runtime owners: lab opening/leak composite curve, direct building
  opening/leak curve, flanking path energy, junction vibration
  reduction, room absorption standardization, building uncertainty
  budget, and exact field/building opening packet precedence.

Complete owner sets are marked ready for a later runtime corridor, but
this gate does not move values. Missing physical fields return
`needs_input`; missing runtime owners return `runtime_owner_missing`.
Element-lab `Rw` / `STC` and ASTM `IIC` / `AIIC` requests stay outside
this adapter.

## Runtime Boundaries

- Lab `Rw 38.2` / `STC 39` is not aliased to field/apparent or
  building-prediction metrics.
- Current complete field opening/leak probes can still compute host-wall
  field overlay values internally, but they remain unsupported for
  requested `R'w` / `DnT,w` until the dedicated opening/leak adapter
  runtime lands.
- Current complete building opening/leak probes remain unsupported under
  `dynamic_calculator_building_prediction_runtime_adapter_owner_missing`.
- The existing opening/leak warning remains active: Gate S owns
  element-lab opening/leak runtime only and does not alias it to `R'w` or
  `DnT,w`.
- Broad source crawling remains lower priority than bounded
  source-absent calculator coverage.

## Next Step

Implement:

`company_internal_opening_leak_building_runtime_corridor_plan`

The runtime corridor should use the owner groups landed here to promote
only basis-compatible field/apparent and/or building-prediction
opening/leak outputs. It must keep lab `Rw` / `STC`, field/apparent
`R'w` / `DnT,w`, and building-prediction outputs separate, expose a
not-measured error budget, preserve exact packet precedence, and keep
missing or hostile opening inputs fail-closed.

## Validation

Passed in this working slice:

- Focused engine opening/leak adapter owner contract:
  `pnpm --filter @dynecho/engine exec vitest run --maxWorkers=1 src/company-internal-opening-leak-building-adapter-owner-contract.test.ts`
  passed 1 file / 5 tests.
- Adjacent Matrix V4 / Gate Q-R-S opening/leak continuity:
  `pnpm --filter @dynecho/engine exec vitest run --maxWorkers=1 src/company-internal-calculation-grade-mainline-matrix-v4-contract.test.ts src/company-internal-opening-leak-building-adapter-owner-contract.test.ts src/calculator-personal-use-mvp-coverage-sprint-gate-q-opening-leak-composite-transmission-loss-input-contract.test.ts src/calculator-personal-use-mvp-coverage-sprint-gate-r-opening-leak-composite-transmission-loss-formula-corridor-contract.test.ts src/calculator-personal-use-mvp-coverage-sprint-gate-s-opening-leak-composite-transmission-loss-runtime-corridor-contract.test.ts`
  passed 5 files / 28 tests.
- Engine typecheck passed:
  `pnpm --filter @dynecho/engine typecheck`.
- Engine lint passed:
  `pnpm --filter @dynecho/engine lint`.
- Current gate passed:
  `pnpm calculator:gate:current`.
  Engine final-audit passed 425 files / 2464 tests; web final-audit
  passed 80 files / 340 passed + 18 skipped; repo build passed 5/5;
  whitespace guard passed.

Known non-fatal validation noise:

- Web tests print expected Zustand persist storage warnings in the
  Node/Vitest environment.
- Next build prints optional `sharp` / `@img` package resolution
  warnings through the proposal document route, then completes
  successfully.
