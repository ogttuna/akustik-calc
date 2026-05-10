# Checkpoint 2026-05-08 - Personal-Use MVP Coverage Sprint Gate C Handoff

## Scope

Gate C lands the timber/CLT floor-impact `DeltaLw` formula-corridor
contract selected by Gate B. It does not move runtime values, source
rows, API shape, card/report surfaces, or workbench controls.

Landed file:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-c-timber-clt-floor-impact-delta-lw-formula-corridor-contract.test.ts`

Landed action:

`gate_c_personal_use_mvp_timber_clt_floor_impact_delta_lw_formula_corridor_plan`

Selection status:

`gate_c_personal_use_mvp_timber_clt_floor_impact_delta_lw_formula_corridor_landed_no_runtime_selected_runtime_corridor_gate_d`

Selected next file:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-d-timber-clt-floor-impact-delta-lw-runtime-corridor-contract.test.ts`

Selected next action:

`gate_d_personal_use_mvp_timber_clt_floor_impact_delta_lw_runtime_corridor_plan`

## Result

- Gate C adds
  `packages/engine/src/timber-clt-floor-impact-delta-lw-formula-corridor.ts`.
- Two source-absent ISO lab `DeltaLw` formula corridors are now named:
  `timber_joist_dry_floating_lower_ceiling_physical_delta_lw_corridor`
  and `mass_timber_clt_dry_floating_physical_delta_lw_corridor`.
- Both corridors consume Gate B's complete timber joist and CLT inputs
  and define the physical terms Gate D must calculate from:
  reference-floor `Ln,w` anchor, upper-treatment loaded mass,
  resilient-layer dynamic stiffness transfer, lower-assembly coupling,
  and structural-family correction.
- Current runtime is unchanged: timber joist remains exact `Ln,w 51`
  with `DeltaLw` unsupported, and CLT remains family `Ln,w 50` with
  `DeltaLw` unsupported.
- `Ln,w` anchors are explicitly marked as current runtime snapshots, not
  `DeltaLw` metric owners.
- The first source-absent design budget for both timber joist and CLT
  `DeltaLw` is `+/-7.5 dB` and is labelled
  `source_absent_formula_design_budget`, not measured evidence.
- Missing dynamic stiffness, load basis, topping/floating mass, and
  lower assembly remain exact `needs_input` negatives.
- ASTM `IIC` / `AIIC`, field `L'n,w` / `L'nT,w`, building-prediction
  basis, steel floors, and exact `Ln,w` source precedence remain blocked
  from lab `DeltaLw` aliasing or promotion.

## Gate D Entry Criteria

Gate D is selected as the runtime corridor gate. It must:

- keep exact measured rows above formula candidates for the requested
  metric;
- calculate `DeltaLw` from loaded upper mass, dynamic stiffness,
  reference-floor, and lower-assembly terms instead of inventing it from
  `Ln,w`, `IIC`, or field values;
- emit a source-absent formula error budget and avoid presenting it as
  measured evidence;
- keep `Ln,w` anchors separate from `DeltaLw` metric ownership;
- preserve ASTM, field, and building-basis non-alias boundaries;
- pin output-card, report, calculator API, and impact-only API parity if
  runtime values move.

## Validation

Focused Gate C validation completed on 2026-05-08: Gate C passed 1 file
/ 7 tests, focused Gate B/Gate C continuity passed 2 files / 15 tests,
focused Gate BI/Gate A/Gate B/Gate C continuity passed 4 files / 29
tests, engine typecheck passed, and full `pnpm calculator:gate:current`
passed with engine 344 files / 1994 tests, web 66 files / 286 passed +
18 skipped, repo build 5/5 successful, and whitespace guard clean.
Known warnings were existing Zustand unavailable test-storage warnings
and optional `sharp/@img` package resolution warnings during web build.
