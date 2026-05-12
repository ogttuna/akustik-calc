# Gate AM Airborne Building Prediction Direct Curve Owner Handoff - 2026-05-12

Landed action:

`gate_am_personal_use_mvp_airborne_building_prediction_direct_curve_owner_contract_plan`

Selection status:

`gate_am_personal_use_mvp_airborne_building_prediction_direct_curve_owner_landed_no_runtime_selected_flanking_path_energy_gate_an`

Selected next action:

`gate_an_personal_use_mvp_airborne_building_prediction_flanking_path_energy_owner_contract_plan`

Selected next file:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-an-airborne-building-prediction-flanking-path-energy-owner-contract.test.ts`

## Summary

Gate AM is a no-runtime direct separating-element frequency curve owner
contract for airborne `building_prediction`. It does not promote `R'w`
or `DnT,w`, does not create a building estimate, and does not reuse lab
`Rw` / `STC`, field `R'w` / `DnT,w`, source single-number rows, opening
/ leak lab adapters, or legacy raw dynamic field/building continuation
snapshots as the ISO 12354-1 direct-energy term.

The direct curve owner now requires these explicit ownership signals:

- selected dynamic airborne family-solver frequency curve;
- frequency-band resolution owner;
- ISO 717-1 rating adapter basis;
- selected candidate trace owner;
- basis-compatible metric scope for building outputs.

Complete building requests remain `unsupported` through
`dynamic_calculator_building_prediction_runtime_adapter_owner_missing`.
Partial building requests remain `needs_input` with precise missing
physical fields. Field-context wall requests keep the Gate I/J/K
`family_physics_prediction` route and are not used as building
prediction evidence. The Gate O `+/-9 dB` design budget remains a
future source-absent corridor budget, not runtime evidence.

## Lane Decision

Gate AM selects flanking path energy ownership for Gate AN. This is the
next prerequisite after the direct curve owner because building
prediction needs both direct separating-element energy and indirect
flanking path energy before junction coupling, room standardization,
uncertainty decomposition, or runtime promotion can be evaluated safely.

Lower-ranked lanes:

- junction vibration reduction stays behind named flanking path energy;
- room standardization is necessary for `DnT,w` but cannot create
  building runtime while flanking and junction terms are unowned;
- uncertainty budget ownership should trail the direct/flanking/junction
  physical owners;
- building runtime promotion and broad source crawling remain blocked.

## Validation

Validation passed before commit:

- Focused Gate AM:
  `pnpm --filter @dynecho/engine exec vitest run src/calculator-personal-use-mvp-coverage-sprint-gate-am-airborne-building-prediction-direct-curve-owner-contract.test.ts --maxWorkers=1`
  passed with 6 tests.
- Gate AL + Gate AM continuity:
  `pnpm --filter @dynecho/engine exec vitest run src/calculator-personal-use-mvp-coverage-sprint-gate-al-airborne-building-prediction-owner-gap-refresh-contract.test.ts src/calculator-personal-use-mvp-coverage-sprint-gate-am-airborne-building-prediction-direct-curve-owner-contract.test.ts --maxWorkers=1`
  passed with 12 tests.
- Engine typecheck:
  `pnpm --filter @dynecho/engine typecheck` passed.
- Current gate:
  `pnpm calculator:gate:current` passed. Focused engine gate passed
  380 files / 2193 tests, focused web gate passed 74 files /
  318 passed + 18 skipped, build passed 5/5 packages, and whitespace
  guard passed.
- Full repo:
  `pnpm check` passed. Lint and typecheck passed 5/5 packages, engine
  tests passed 505 files / 2995 tests, web tests passed 180 files /
  993 passed + 18 skipped, and build passed 5/5 packages. The known
  optional `sharp/@img` build warnings and unavailable test-storage
  Zustand warnings remain non-fatal.

## Next Gate AN

Gate AN should implement a no-runtime flanking path energy owner
contract:

1. define the flanking path energy owner for airborne building
   prediction without selecting building runtime;
2. require named flanking path topology, basis-compatible indirect
   transmission terms, coupling surface ownership, and source-absent
   conservative assumptions;
3. prove the Gate AM direct curve owner alone cannot promote `R'w` or
   `DnT,w`;
4. keep junction vibration reduction, room standardization, uncertainty
   budget, and runtime promotion blocked until their owners exist;
5. keep lab, field, opening/leak, STC-only, and source-single-number
   aliases blocked;
6. select the next narrow owner lane only after flanking path energy
   ownership is stable.
