# Gate BR Handoff

Gate BR has landed:

`gate_br_personal_use_mvp_floor_impact_astm_iic_aiic_adapter_contract_plan`

Selection status:

`gate_br_personal_use_mvp_floor_impact_astm_iic_aiic_adapter_contract_landed_no_runtime_selected_runtime_corridor_gate_bs`

Selected next action:

`gate_bs_personal_use_mvp_floor_impact_astm_iic_aiic_runtime_corridor_plan`

Selected next file:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bs-floor-impact-astm-iic-aiic-runtime-corridor-contract.test.ts`

Next plain label: floor-impact ASTM IIC/AIIC runtime corridor.

## What Changed

Gate BR is a no-runtime ownership contract for ASTM impact ratings.
It keeps the current runtime boundary intact: complete ISO floor-impact
formula rows still leave `IIC` and `AIIC` unsupported, with no promoted
ASTM value and no ASTM budget.

The contract now makes the missing owner surface executable:

- lab `IIC` requires owned ASTM impact frequency bands, rating
  procedure, exact ASTM source precedence, an uncertainty budget, visible
  parity, and an ISO `Ln,w` / `DeltaLw` non-alias boundary;
- field `AIIC` requires owned field ASTM impact bands, apparent-rating
  procedure, receiving-room field context, a field uncertainty budget,
  visible parity, and a field-impact non-alias boundary;
- missing frequency bands or room context returns `needs_input`;
- missing rating or uncertainty owners returns `runtime_owner_missing`;
- ISO lab, ISO field, and building-prediction impact outputs do not
  become `IIC` or `AIIC` by alias.

Gate BQ remains the previous gate. Its 58-row matrix and zero
calculation-grade `coverage_gap` posture are unchanged.

## Validation

- Focused Gate BR:
  `pnpm --filter @dynecho/engine exec vitest run src/calculator-personal-use-mvp-coverage-sprint-gate-br-floor-impact-astm-iic-aiic-adapter-contract.test.ts --maxWorkers=1`
  passed, 1 file / 6 tests.
- Engine typecheck:
  `pnpm --filter @dynecho/engine typecheck` passed.
- Gate BQ/BR continuity:
  `pnpm --filter @dynecho/engine exec vitest run src/calculator-personal-use-mvp-coverage-sprint-gate-bq-coverage-matrix-refresh-after-reinforced-concrete-cleanup-contract.test.ts src/calculator-personal-use-mvp-coverage-sprint-gate-br-floor-impact-astm-iic-aiic-adapter-contract.test.ts --maxWorkers=1`
  passed, 2 files / 12 tests.
- Current gate:
  `pnpm calculator:gate:current` passed; engine focused gate
  411 files / 2378 tests, web focused gate 78 files / 334 passed +
  18 skipped, repo build 5/5. Known non-fatal warnings remained the
  existing optional `sharp/@img` build warnings and test-storage
  `zustand persist middleware` warnings.
- Whitespace guard: `git diff --check` passed.

## Next Step

Gate BS should test the ASTM `IIC` / `AIIC` runtime corridor against the
Gate BR owners. It must not alias or convert ISO `Ln,w`, `DeltaLw`,
`L'n,w`, or `L'nT,w` into ASTM values unless owned ASTM band/rating
inputs exist and the negative boundaries stay visible.
