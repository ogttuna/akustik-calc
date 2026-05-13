# Gate BA Floor-Impact Source-Absent Solver Gap Cartography - 2026-05-13

Landed action:

`gate_ba_personal_use_mvp_floor_impact_source_absent_solver_gap_cartography_plan`

Selection status:

`gate_ba_personal_use_mvp_floor_impact_source_absent_solver_gap_cartography_landed_no_runtime_selected_floor_impact_source_absent_input_contract_gate_bb`

Selected next action:

`gate_bb_personal_use_mvp_floor_impact_source_absent_input_contract_plan`

Selected next file:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bb-floor-impact-source-absent-input-contract.test.ts`

Short label:

floor-impact source-absent solver gap cartography

## Summary

Gate BA lands no-runtime floor-impact cartography after Gate AZ. It does
not retune `Ln,w`, `DeltaLw`, field, building, or ASTM behavior. It maps
the current floor-impact layer-combination surface across exact-source
precedence, source-absent formula corridors, published-family anchors,
low-confidence fallbacks, explicit unsupported boundaries, `needs_input`
boundaries, and remaining source-absent solver gaps.

The executable map confirms the current owned routes:

- exact official floor-system rows still win before formulas;
- heavy concrete bare/floating-floor formula paths remain numeric-stable;
- heavy concrete published upper-treatment anchors still catch generic
  resilient/floating packages;
- steel, timber joist, and CLT/mass-timber source-absent formula
  corridors remain owned when their physical inputs are complete;
- field impact outputs remain separate and require explicit field
  context;
- ASTM `IIC` / `AIIC` and building-prediction impact outputs remain
  unsupported boundaries, not aliases.

Gate BA also pins real current probes:

- exact UBIQ FL-28 open-web source row stays `Ln,w 51` and does not
  invent `DeltaLw`;
- explicit heavy concrete floating-floor input stays `Ln,w 50.3` /
  `DeltaLw 24.3` through
  `predictor_heavy_floating_floor_iso12354_annexc_estimate`;
- missing upper load owner falls back to the existing published-family
  `Ln,w 47` path and keeps `DeltaLw` unsupported;
- explicit field context carries `L'n,w 52.3` / `L'nT,w 50.3`;
- ASTM `IIC` / `AIIC` remain unsupported even when ISO impact values
  exist.

The selected next lane is the Gate BB floor-impact source-absent input
contract. It should define the physical owner fields and fail-closed
rules for dynamic stiffness, supported load, base/carrier family, lower
treatment coupling, mixed support families, and hostile floor-role
topology before any new broad runtime corridor is promoted.
Next plain label: floor-impact source-absent input contract.

## Next Gate

Gate BB should add:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bb-floor-impact-source-absent-input-contract.test.ts`

Gate BB should stay no-runtime unless the contract proves all owner
fields and negative boundaries are explicit. It should decide which
floor-impact fields are required, which published-family anchors may
remain fallback, which cases must return missing-input prompts, and
which hostile layer combinations must fail closed.

## Validation

Validation passed on 2026-05-13:

1. focused Gate BA engine contract: 1 file / 6 tests;
2. Gate AZ + Gate BA continuity;
3. `pnpm calculator:gate:current`;
4. `git diff --check`: clean.

Known non-blocking warnings remained unchanged: jsdom workbench tests
can print the existing Zustand storage-unavailable warning, and the
Next build can report optional `sharp` / `@img` package warnings before
compiling successfully.
