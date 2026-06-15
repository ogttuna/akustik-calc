# Post-V1 Floor User-Material Visible Floating Load-Basis Owner Plan - 2026-06-15

## Purpose

Land a runtime-value-moving calculator slice, not another no-runtime
rerank. The owner closes the visible floating-floor input gap where the
user has already entered enough physical layer data to calculate the
floating load basis, but the engine still asked for manual
`floorImpactContext.loadBasisKgM2`.

Previous selected action:
`post_v1_next_numeric_coverage_gap_after_floor_user_material_low_density_floating_floor_family_plan`.

Selected candidate:
`floor.user_material_visible_floating_load_basis_owner`.

Owner action:
`post_v1_floor_user_material_visible_floating_load_basis_owner_plan`.

Owner file:
`packages/engine/src/post-v1-floor-user-material-visible-floating-load-basis-owner-contract.test.ts`.

Owner status:
`post_v1_floor_user_material_visible_floating_load_basis_owner_landed_runtime_selected_coverage_refresh`.

## Runtime Scope

When a fully role-tagged visible floating-floor stack contains a
`resilient_layer` and `floating_screed`, derive `loadBasisKgM2` from the
positive surface mass of upper load layers:

- `floor_covering`;
- `floating_screed`;
- `upper_fill`.

Do not include `base_structure`, `resilient_layer`, or ceiling/lower
treatment layers in the load basis. If any required load layer cannot
produce positive surface mass, keep `loadBasisKgM2` at `needs_input`.

Pinned visible stack:

- 8 mm custom tile at 2200 kg/m3;
- 30 mm custom screed at 2000 kg/m3;
- 8 mm custom resilient underlay with `s' = 30 MN/m3`;
- 150 mm custom concrete carrier.

Derived load basis:
`77.6 kg/m2`.

## Runtime Values Moved

Low-density concrete floating floor without manual `loadBasisKgM2`:

- `Ln,w 64.3`;
- `DeltaLw 24.4`;
- `L'n,w 66.3`;
- `L'nT,w 63.9`;
- `L'nT,50 66.9`.

Heavy concrete floating floor without manual `loadBasisKgM2`:

- `Ln,w 50.1`;
- `DeltaLw 24.4`;
- `L'n,w 52.1`;
- `L'nT,w 49.7`;
- `L'nT,50 52.7`.

Explicit `loadBasisKgM2` still wins over the derived value, preserving
the earlier pinned heavy stack values at `Ln,w 50.3`, `DeltaLw 24.3`,
`L'n,w 52.3`, `L'nT,w 49.9`, and `L'nT,50 52.9` when the user supplies
`loadBasisKgM2: 76`.

## Boundaries

- Missing resilient-layer dynamic stiffness remains `needs_input`.
- Missing topping/floating layer remains `needs_input`.
- Non-derivable load basis remains `needs_input`.
- Generic `IIC` / `AIIC` is still not inferred from ISO impact outputs.
- No source rows are imported.
- No formula retune is performed.
- No frontend implementation files are touched.

Counters:

- `newCalculableLayerTemplates: 0`;
- `newCalculableRequestShapes: 2`;
- `newCalculableTargetOutputs: 10`;
- `runtimeBasisPromotions: 2`;
- `runtimeValuesMoved: 10`;
- `runtimeFormulaRetunes: 0`;
- `sourceRowsImported: 0`;
- `frontendImplementationFilesTouched: 0`.

## Selected Next

Selected next action:
`post_v1_floor_user_material_visible_floating_load_basis_coverage_refresh_plan`.

Selected next file:
`packages/engine/src/post-v1-floor-user-material-visible-floating-load-basis-coverage-refresh-contract.test.ts`.

Selected next plan doc:
`docs/calculator/POST_V1_FLOOR_USER_MATERIAL_VISIBLE_FLOATING_LOAD_BASIS_COVERAGE_REFRESH_PLAN_2026-06-15.md`.

Selected next label:
`post-V1 floor user-material visible floating load-basis coverage refresh`.

