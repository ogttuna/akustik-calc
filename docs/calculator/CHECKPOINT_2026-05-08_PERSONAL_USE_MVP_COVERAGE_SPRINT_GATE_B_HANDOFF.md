# Checkpoint - 2026-05-08 - Personal-Use MVP Coverage Sprint Gate B

Gate:

`gate_b_personal_use_mvp_timber_clt_floor_impact_delta_lw_input_contract_plan`

Implemented file:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-b-timber-clt-floor-impact-delta-lw-contract.test.ts`

Helper:

`packages/engine/src/timber-clt-floor-impact-delta-lw-input-contract.ts`

Status:

Gate B landed as a no-runtime timber/CLT floor-impact `DeltaLw` input
and formula-readiness contract for the Personal-Use MVP Coverage Sprint.

Summary:

- Gate B consumes the Gate A evidence rows
  `floor.timber_joist_impact.lab`,
  `floor.clt_mass_timber_impact.lab`, and
  `floor.complete_field_impact_context.lprime`;
- complete timber joist and CLT/mass-timber predictor inputs are
  `ready_for_formula_corridor_gate`;
- current runtime remains unchanged: timber joist still exposes exact
  `Ln,w 51` with `DeltaLw` unsupported, and CLT still exposes family
  `Ln,w 50` with `DeltaLw` unsupported;
- required physical inputs are `baseSlabOrFloor`,
  `toppingOrFloatingLayer`, `resilientLayerDynamicStiffnessMNm3`,
  `loadBasisKgM2`, and `ceilingOrLowerAssembly`;
- missing dynamic stiffness, load basis, topping/floating mass, and
  lower ceiling/isolation each produce exact `needs_input` prompts;
- ASTM `IIC` / `AIIC` stays unsupported and is not aliased to ISO
  `DeltaLw`;
- field `L'n,w` / `L'nT,w` stays outside the Gate B lab route;
- exact `Ln,w` source precedence does not invent `DeltaLw`;
- steel floors stay on the existing steel corridor and are not consumed
  by the timber/CLT contract;
- broad source crawling remains blocked.

Selection status:

`gate_b_personal_use_mvp_timber_clt_floor_impact_delta_lw_input_contract_landed_no_runtime_selected_formula_corridor_gate_c`

Selected next file:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-c-timber-clt-floor-impact-delta-lw-formula-corridor-contract.test.ts`

Selected next action:

`gate_c_personal_use_mvp_timber_clt_floor_impact_delta_lw_formula_corridor_plan`

Why Gate C:

Gate B now gives the calculator an executable input boundary for the
highest-ROI floor-impact gap selected by Gate A. The next step is not a
source crawl. Gate C should design the first timber/CLT `DeltaLw`
formula corridor: reference-floor handling, upper-treatment
mass/dynamic-stiffness transfer, lower-assembly coupling, tolerance or
error budget, support bucket labels, exact/source precedence, and
negative boundaries.

Gate C must keep lab, field, ASTM, and building-prediction bases
separate. If it promotes runtime, it must pin numeric values and visible
card/report/API parity in the same gate. If it remains no-runtime, it
must leave a precise Gate D runtime proposal.

Validation result:

Focused Gate B validation completed on 2026-05-08: Gate B passed 1 file
/ 8 tests. Focused Gate A/Gate B continuity passed 2 files / 15 tests.
Focused Gate BI/Gate A/Gate B continuity passed 3 files / 22 tests.
Engine typecheck passed. Full `pnpm calculator:gate:current` passed
with engine 343 files / 1987 tests, web 66 files / 286 passed + 18
skipped, repo build 5/5 successful, and whitespace guard clean. Known
warnings were the existing Zustand unavailable test-storage warnings in
focused web tests and optional `sharp/@img` package resolution warnings
during web build.
